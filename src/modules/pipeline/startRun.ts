import 'server-only';
import { after } from 'next/server';
import { env, features } from '@/lib/env';
import { callN8nWebhook, N8nError } from '@/lib/n8n';
import { createAdminClient } from '@/lib/supabase/admin';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';
import { demoItems } from './demoItems';
import { failRun, ingestResults } from './ingest';
import {
  buildSearchPlan,
  loadMatchProfile,
  loadWatchedCompanies,
  MissingSearchProfileError,
  type RunSnapshot,
  type SearchOptions,
} from './profile';
import { parseIngestItems } from './schema';

export type StartRunResult = { ok: true; runId: string } | { ok: false; error: string };

export const OUT_OF_CREDITS_MESSAGE = "You’re out of credits. Buy a credit pack to keep searching.";

interface StartRunInput {
  userId: string;
  searchProfileId?: string | null;
  trigger: 'manual' | 'scheduled';
  options?: Partial<Omit<SearchOptions, 'maxResults'>>;
  origin: string; // basis-URL van deze app, voor de callback van n8n
  forceDemo?: boolean; // voorbeelddata i.p.v. n8n (demo-account)
}

// Wat n8n bij de zoek-webhook binnenkrijgt. Geen e-mailadres of user-id: runId is genoeg.
export interface SearchWebhookPayload extends RunSnapshot {
  runId: string;
  trigger: 'manual' | 'scheduled';
  callbackUrl: string;
}

// Start een zoekrun: run vastleggen, credit afschrijven, n8n (of de demo-bron) aan het werk zetten
export async function startSearchRun({ userId, searchProfileId, trigger, options, origin, forceDemo = false }: StartRunInput): Promise<StartRunResult> {
  const admin = createAdminClient();

  let loaded;
  try {
    loaded = await loadMatchProfile(admin, userId, searchProfileId);
  } catch (error) {
    if (error instanceof MissingSearchProfileError) return { ok: false, error: error.message };
    console.error('[startRun] loadMatchProfile failed', error);
    throw error;
  }

  // Geen credits (de gratis eerste zoekopdracht is op): meteen stoppen, zonder mislukte run.
  // spend_credits hieronder blijft de echte, atomische check.
  const { data: balance, error: balanceError } = await admin.from('credit_balances').select('balance').eq('user_id', userId).maybeSingle();
  if (balanceError) console.error('[startRun] failed to fetch credit balance', balanceError);
  console.log('[startRun] credit balance for', userId, ':', balance?.balance ?? 0, '(need', CREDIT_COST_PER_SEARCH, ')');
  if ((balance?.balance ?? 0) < CREDIT_COST_PER_SEARCH) {
    console.warn('[startRun] insufficient credits for user', userId);
    return { ok: false, error: OUT_OF_CREDITS_MESSAGE };
  }

  const searchOptions: SearchOptions = {
    includeHiddenOpportunities: options?.includeHiddenOpportunities ?? loaded.defaults.includeHiddenOpportunities,
    includeCompanyHunting: options?.includeCompanyHunting ?? loaded.defaults.includeCompanyHunting,
    maxResults: 30,
  };
  // Company Hunter is een extraatje: als dit faalt, zoeken we gewoon zonder
  const watchCompanies = searchOptions.includeCompanyHunting
    ? await loadWatchedCompanies(admin, userId).catch((error) => {
        console.warn('[search] loading watched companies failed', error);
        return [];
      })
    : [];
  const searchPlan = buildSearchPlan(loaded.profile, searchOptions, watchCompanies);
  const snapshot: RunSnapshot = {
    profile: loaded.profile,
    options: searchOptions,
    searchQueries: searchPlan.map(({ query }) => query),
    searchPlan,
    watchCompanies,
  };

  const { data: run, error: runError } = await admin
    .from('search_runs')
    .insert({
      user_id: userId,
      search_profile_id: loaded.searchProfileId,
      triggered_by: trigger,
      status: 'queued',
      criteria_snapshot: snapshot,
      credits_charged: CREDIT_COST_PER_SEARCH,
    })
    .select('id')
    .single();
  if (runError) {
    console.error('[startRun] inserting search_run failed', runError);
    throw runError;
  }
  console.log('[startRun] run created:', run.id, 'for user', userId);

  const { data: charged, error: creditError } = await admin.rpc('spend_credits', {
    p_user_id: userId,
    p_amount: CREDIT_COST_PER_SEARCH,
    p_reason: 'search',
    p_search_run_id: run.id,
  });
  if (creditError) {
    console.error('[startRun] spend_credits RPC failed', creditError);
    throw creditError;
  }
  if (!charged) {
    await admin
      .from('search_runs')
      .update({ status: 'failed', credits_charged: 0, error_message: 'Not enough credits.', finished_at: new Date().toISOString() })
      .eq('id', run.id);
    return { ok: false, error: OUT_OF_CREDITS_MESSAGE };
  }

  if (features.demoMode || forceDemo) {
    await admin.from('search_runs').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', run.id);
    after(() => runDemoSearch(run.id));
    return { ok: true, runId: run.id };
  }

  const payload: SearchWebhookPayload = {
    runId: run.id,
    trigger,
    callbackUrl: `${env.appUrl ?? origin}/api/n8n/results`,
    ...snapshot,
  };
  try {
    console.log("[startRun] calling n8n webhook for run", run.id);
    const response = (await callN8nWebhook(env.n8nSearchWebhookUrl!, payload)) as { executionId?: unknown } | null;
    const executionId = response && typeof response.executionId !== "undefined" ? String(response.executionId) : null;
    console.log("[startRun] n8n responded, executionId:", executionId);
    await admin
      .from("search_runs")
      .update({ status: "running", started_at: new Date().toISOString(), n8n_execution_id: executionId })
      .eq("id", run.id);
  } catch (error) {
    const message = error instanceof N8nError || error instanceof Error ? error.message : "Could not reach n8n";
    console.error("[startRun] n8n webhook call failed for run", run.id, ":", message, error);
    await failRun(run.id, `Could not start the n8n workflow: ${message}`);
    return { ok: false, error: "The search agent could not be started. Your credit was refunded, please try again later." };
  }

  return { ok: true, runId: run.id };
}

// Demo-modus: dezelfde verwerking als bij n8n, maar met voorbeeldkansen
async function runDemoSearch(runId: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500)); // laat de voortgang in de UI even zien
    const { items } = parseIngestItems(demoItems());
    await ingestResults({ runId, items: items.map((item) => ({ ...item, source: 'demo' as const })), done: true });
  } catch (error) {
    console.error('[demo] search failed', error);
    await failRun(runId, error instanceof Error ? error.message : 'Demo search failed');
  }
}
