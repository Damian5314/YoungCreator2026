import 'server-only';
import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { scoreItems } from '@/modules/opportunities/matchScorer';
import { runAgentOutreach } from '@/modules/outreach/outreachService';
import { normalizeItems } from './enrich';
import type { RunSnapshot } from './profile';
import type { IngestItem, RawIngestItem } from './schema';

const MIN_MATCH_SCORE = 25; // lager is ruis: niet op het dashboard zetten

export interface IngestBatch {
  runId: string;
  items: RawIngestItem[];
  done: boolean;
  error?: string;
}

export interface IngestSummary {
  found: number;
  newMatches: number;
}

function normalizeDomain(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const host = new URL(value.includes('://') ? value : `https://${value}`).hostname.toLowerCase();
    return host.replace(/^www\./, '') || undefined;
  } catch {
    return undefined;
  }
}

// Alleen velden met een waarde meesturen: een upsert mag bestaande gegevens niet leegmaken
function defined<T extends Record<string, unknown>>(row: T): Partial<T> {
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined && value !== null)) as Partial<T>;
}

type CompanyDetails = Partial<Record<'domain' | 'website' | 'careerPageUrl' | 'industry' | 'location' | 'description', string>>;

async function upsertCompany(admin: SupabaseClient, company: IngestItem['company']): Promise<string> {
  // n8n mag ook alleen een naam sturen ("company": "Acme"); dan zijn alle details leeg
  const details = company as CompanyDetails & { name: string };
  const domain = normalizeDomain(details.domain ?? details.website);
  const row = defined({
    name: company.name,
    domain,
    website: details.website,
    career_page_url: details.careerPageUrl,
    industry: details.industry,
    location: details.location,
    description: details.description,
  });

  if (domain) {
    const { data, error } = await admin.from('companies').upsert(row, { onConflict: 'domain' }).select('id').single();
    if (error) throw error;
    return data.id;
  }

  // Zonder domein: op naam hergebruiken
  const { data: existing } = await admin
    .from('companies')
    .select('id')
    .is('domain', null)
    .eq('name', company.name)
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await admin.from('companies').insert(row).select('id').single();
  if (error) throw error;
  return data.id;
}

async function upsertOpportunity(admin: SupabaseClient, item: IngestItem, companyId: string): Promise<string> {
  const externalId = item.externalId ?? createHash('sha256').update(item.url).digest('hex').slice(0, 40);
  const row = defined({
    company_id: companyId,
    source: item.source,
    external_id: externalId,
    url: item.url,
    title: item.title,
    type: item.type,
    location: item.location,
    remote: item.remote,
    description: item.description,
    required_skills: item.requiredSkills.length ? item.requiredSkills : undefined,
    salary_min: item.salaryMin,
    salary_max: item.salaryMin !== undefined && item.salaryMax !== undefined && item.salaryMax < item.salaryMin ? undefined : item.salaryMax,
    is_hidden: item.isHidden,
    posted_at: item.postedAt,
    starts_at: item.startsAt,
    signals: item.signals.length ? item.signals : undefined,
    contact_name: item.contact.name,
    contact_email: item.contact.email,
    contact_role: item.contact.role,
    contact_url: item.contact.url,
    last_seen_at: new Date().toISOString(),
  });
  const { data, error } = await admin
    .from('opportunities')
    .upsert(row, { onConflict: 'source,external_id' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

// Verwerkt een levering van n8n (of de demo-bron): opslaan, scoren, matches maken, outreach voorbereiden
export async function ingestResults({ runId, items, done, error }: IngestBatch): Promise<IngestSummary | null> {
  const admin = createAdminClient();
  const { data: run } = await admin
    .from('search_runs')
    .select('id, user_id, status, criteria_snapshot')
    .eq('id', runId)
    .maybeSingle();
  if (!run || (run.status !== 'queued' && run.status !== 'running')) {
    console.warn(`[ingest] ignoring results for run ${runId} (${run ? run.status : 'not found'})`);
    return null;
  }

  if (error && items.length === 0) {
    await admin.rpc('fail_search_run', { p_run_id: runId, p_error: error });
    return { found: 0, newMatches: 0 };
  }

  const snapshot = run.criteria_snapshot as RunSnapshot;
  const userId: string = run.user_id;

  // Ruwe zoekresultaten aanvullen tot volledige kansen (bedrijf, type, signalen); ruis valt af
  const normalized = await normalizeItems(items, snapshot.profile);

  // Zelfde kans twee keer in één levering (bv. via twee bronnen) → één keer verwerken
  const seen = new Set<string>();
  const unique = normalized.filter((item) => {
    const key = `${item.source}|${item.externalId ?? item.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const companyIds = new Map<string, Promise<string>>();
  const opportunityIds = await Promise.all(
    unique.map(async (item) => {
      const key = item.company.name.toLowerCase();
      if (!companyIds.has(key)) companyIds.set(key, upsertCompany(admin, item.company));
      return upsertOpportunity(admin, item, await companyIds.get(key)!);
    }),
  );

  const scores = await scoreItems(unique, snapshot.profile);

  const { data: existingMatches } = await admin
    .from('matches')
    .select('id, opportunity_id')
    .eq('user_id', userId)
    .in('opportunity_id', opportunityIds.length ? opportunityIds : ['00000000-0000-0000-0000-000000000000']);
  const existingByOpportunity = new Map((existingMatches ?? []).map((match) => [match.opportunity_id as string, match.id as string]));

  const newRows: {
    user_id: string;
    opportunity_id: string;
    search_run_id: string;
    match_score: number;
    match_reasons: string[];
  }[] = [];
  const updates: PromiseLike<unknown>[] = [];
  opportunityIds.forEach((opportunityId, index) => {
    const { score, reasons } = scores[index];
    const existingId = existingByOpportunity.get(opportunityId);
    if (existingId) {
      // Al bekend: score bijwerken, status (saved/applied/...) laten staan
      updates.push(admin.from('matches').update({ match_score: score, match_reasons: reasons }).eq('id', existingId));
    } else if (score >= MIN_MATCH_SCORE) {
      newRows.push({
        user_id: userId,
        opportunity_id: opportunityId,
        search_run_id: runId,
        match_score: score,
        match_reasons: reasons,
      });
    }
  });
  await Promise.all(updates);

  let newMatchIds: string[] = [];
  if (newRows.length > 0) {
    const { data: inserted, error: insertError } = await admin
      .from('matches')
      .upsert(newRows, { onConflict: 'user_id,opportunity_id', ignoreDuplicates: true })
      .select('id');
    if (insertError) throw insertError;
    newMatchIds = (inserted ?? []).map((row) => row.id as string);
  }

  const { error: recordError } = await admin.rpc('record_search_run_results', {
    p_run_id: runId,
    p_found: unique.length,
    p_new: newMatchIds.length,
    p_done: done,
  });
  if (recordError) throw recordError;

  // Action engine: mails voorbereiden (en bij niveau 3 versturen) voor de sterkste nieuwe matches
  try {
    await runAgentOutreach(userId, newMatchIds);
  } catch (outreachError) {
    console.error('[ingest] agent outreach failed', outreachError);
  }

  return { found: unique.length, newMatches: newMatchIds.length };
}

export async function failRun(runId: string, message: string) {
  await createAdminClient().rpc('fail_search_run', { p_run_id: runId, p_error: message });
}
