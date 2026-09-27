import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedN8nRequest } from '@/lib/n8n';
import { createAdminClient } from '@/lib/supabase/admin';
import { startSearchRun } from '@/modules/pipeline/startRun';

export const maxDuration = 300;

// Een paar runs tegelijk starten: elke start wacht tot 20 s op n8n, en 25 na elkaar past niet in maxDuration
const CONCURRENCY = 5;

interface DueSearchProfile {
  id: string;
  user_id: string;
}

type ScheduledRunResult = { searchProfileId: string; runId: string } | { searchProfileId: string; error: string };

async function startScheduledRun(profile: DueSearchProfile, origin: string): Promise<ScheduledRunResult> {
  try {
    const result = await startSearchRun({ userId: profile.user_id, searchProfileId: profile.id, trigger: 'scheduled', origin });
    return result.ok ? { searchProfileId: profile.id, runId: result.runId } : { searchProfileId: profile.id, error: result.error };
  } catch (runError) {
    console.error(`[scheduler] starting run for ${profile.id} failed`, runError);
    return { searchProfileId: profile.id, error: 'Could not start run' };
  }
}

// POST /api/n8n/scheduler — n8n roept dit elke 30 minuten aan (Schedule Trigger → HTTP Request).
// Start een run voor elk zoekprofiel waarvan next_run_at voorbij is, en ruimt vastgelopen runs op.
export async function POST(request: NextRequest) {
  if (!isAuthorizedN8nRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const [{ data: expired }, { data: due, error }] = await Promise.all([
    admin.rpc('expire_stale_search_runs'),
    admin.rpc('claim_due_search_profiles', { p_limit: 25 }),
  ]);
  if (error) {
    console.error('[scheduler] claiming due profiles failed', error);
    return NextResponse.json({ error: 'Could not load scheduled searches' }, { status: 500 });
  }

  const origin = request.nextUrl.origin;
  const profiles = (due ?? []) as DueSearchProfile[];
  const results: ScheduledRunResult[] = [];
  for (let start = 0; start < profiles.length; start += CONCURRENCY) {
    const batch = profiles.slice(start, start + CONCURRENCY);
    results.push(...(await Promise.all(batch.map((profile) => startScheduledRun(profile, origin)))));
  }

  return NextResponse.json({ ok: true, started: results.filter((r) => 'runId' in r).length, expiredRuns: expired ?? 0, results });
}
