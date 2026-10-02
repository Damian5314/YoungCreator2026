import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_ACCOUNT, DEMO_MIN_CREDITS } from '@/shared/constants/demoAccount';

// Demo-account voor de live demo: mag nooit mislukken. Lukt inloggen niet (account weg, wachtwoord
// gewijzigd, e-mail niet bevestigd), dan zet de server het account terug en probeert opnieuw.

export function isDemoLogin(email: string, password: string): boolean {
  return email.toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
}

// Maakt het demo-account aan of zet het terug: bevestigd e-mailadres en het vaste wachtwoord
export async function ensureDemoAccount(): Promise<string> {
  const admin = createAdminClient();
  const attributes = {
    password: DEMO_ACCOUNT.password,
    email_confirm: true,
    user_metadata: { full_name: DEMO_ACCOUNT.name },
  };

  const created = await admin.auth.admin.createUser({ email: DEMO_ACCOUNT.email, ...attributes });
  if (!created.error) return created.data.user.id;

  const userId = await findUserId(DEMO_ACCOUNT.email);
  if (!userId) throw created.error;
  const { error } = await admin.auth.admin.updateUserById(userId, attributes);
  if (error) throw error;
  return userId;
}

// Vult het saldo aan tot DEMO_MIN_CREDITS
export async function topUpDemoCredits(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { data, error } = await admin.from('credit_balances').select('balance').eq('user_id', userId).maybeSingle();
  if (error) throw error;

  const missing = DEMO_MIN_CREDITS - (data?.balance ?? 0);
  if (missing <= 0) return;
  const { error: insertError } = await admin
    .from('credit_transactions')
    .insert({ user_id: userId, amount: missing, reason: 'adjustment' });
  if (insertError) throw insertError;
}

// Demo-data die ouder is dan een dag opruimen, zodat elke bezoeker een overzichtelijk account ziet.
// Alleen het demo-account; gedeelde bedrijven en kansen blijven staan (andere demo-bezoekers zien ze ook).
const DEMO_DATA_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function resetStaleDemoData(userId: string): Promise<void> {
  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - DEMO_DATA_MAX_AGE_MS).toISOString();
  // Volgorde: outreach hangt aan matches, matches verwijzen naar runs
  for (const table of ['outreach_messages', 'matches', 'search_runs'] as const) {
    const { error } = await admin.from(table).delete().eq('user_id', userId).lt('created_at', cutoff);
    if (error) throw error;
  }
}

async function findUserId(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) return user.id;
    if (data.users.length < perPage) return null;
  }
}
