import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/data/queries';
import { withinRateLimit } from '@/lib/rateLimit';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/account/export — al je persoonsgegevens als JSON-bestand (AVG: inzage en dataportabiliteit).
// Loopt via de sessie van de gebruiker, dus RLS garandeert dat alleen je eigen data erin komt.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await withinRateLimit('export', `user:${user.id}`))) {
    return NextResponse.json({ error: 'Too many exports. Try again later.' }, { status: 429 });
  }

  const supabase = await createClient();
  const [profile, searchProfiles, searchRuns, matches, outreach, credits, payments] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('search_profiles').select('*').eq('user_id', user.id),
    supabase
      .from('search_runs')
      .select('id, triggered_by, status, results_found, new_results, credits_charged, error_message, created_at, started_at, finished_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('matches')
      .select('id, match_score, match_reasons, status, status_changed_at, created_at, opportunity:opportunities (title, type, url, location, company:companies (name, website))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('outreach_messages')
      .select('id, match_id, to_email, to_name, subject, body, status, created_by, sent_via, sent_at, created_at, updated_at')
      .eq('user_id', user.id),
    supabase.from('credit_transactions').select('amount, reason, created_at').eq('user_id', user.id).order('created_at'),
    supabase
      .from('payments')
      .select('id, pack_id, credits, amount_cents, currency, status, created_at, paid_at, refunded_cents')
      .eq('user_id', user.id)
      .order('created_at'),
  ]);

  const failed = [profile, searchProfiles, searchRuns, matches, outreach, credits, payments].find((result) => result.error);
  if (failed?.error) {
    console.error('[account] export failed', user.id, failed.error);
    return NextResponse.json({ error: 'Export failed. Please try again.' }, { status: 500 });
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email },
    profile: profile.data,
    searchProfiles: searchProfiles.data,
    searchRuns: searchRuns.data,
    matches: matches.data,
    outreachMessages: outreach.data,
    creditTransactions: credits.data,
    payments: payments.data,
  };

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="unlisted-data-${date}.json"`,
      'cache-control': 'no-store',
    },
  });
}
