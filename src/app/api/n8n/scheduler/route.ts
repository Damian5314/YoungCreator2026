import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedN8nRequest } from '@/lib/n8n';
import { createAdminClient } from '@/lib/supabase/admin';
import { startSearchRun } from '@/modules/pipeline/startRun';

export const maxDuration = 300;

interface DueSearchProfile {
  id: string;
  user_id: string;
}

// POST /api/n8n/scheduler — n8n roept dit elke 15 minuten aan (Schedule Trigger → HTTP Request).
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
  const results = [];
  for (const profile of (due ?? []) as DueSearchProfile[]) {
    try {
      const result = await startSearchRun({ userId: profile.user_id, searchProfileId: profile.id, trigger: 'scheduled', origin });
      results.push(result.ok ? { searchProfileId: profile.id, runId: result.runId } : { searchProfileId: profile.id, error: result.error });
    } catch (runError) {
      console.error(`[scheduler] starting run for ${profile.id} failed`, runError);
      results.push({ searchProfileId: profile.id, error: 'Could not start run' });
    }
  }

  return NextResponse.json({ ok: true, started: results.filter((r) => 'runId' in r).length, expiredRuns: expired ?? 0, results });
}
