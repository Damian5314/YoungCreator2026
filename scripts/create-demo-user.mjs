// Maakt het demo-account voor de live demo aan, of zet het terug: bevestigd e-mailadres, vast
// wachtwoord en genoeg credits. Veilig om vaker te draaien (bv. vlak voor de demo).
//
// Gebruik:
//   npm run demo:user
//
// Het inloggen herstelt het account ook zelf als het mislukt (zie src/modules/auth/demoAccount.ts);
// dit script is er om het vooraf zeker te weten.

import { existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { DEMO_ACCOUNT, DEMO_MIN_CREDITS } from '../src/shared/constants/demoAccount.ts';

// .env.local eerst: loadEnvFile overschrijft geen variabelen die al gezet zijn
for (const file of ['.env.local', '.env']) if (existsSync(file)) process.loadEnvFile(file);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required (.env.local or .env).');
  process.exit(1);
}

const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
const attributes = { password: DEMO_ACCOUNT.password, email_confirm: true, user_metadata: { full_name: DEMO_ACCOUNT.name } };

async function findUserId(email) {
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) return user.id;
    if (data.users.length < perPage) return null;
  }
}

let userId;
const created = await admin.auth.admin.createUser({ email: DEMO_ACCOUNT.email, ...attributes });
if (!created.error) {
  userId = created.data.user.id;
  console.log(`Created ${DEMO_ACCOUNT.email}`);
} else {
  userId = await findUserId(DEMO_ACCOUNT.email);
  if (!userId) throw created.error;
  const { error } = await admin.auth.admin.updateUserById(userId, attributes);
  if (error) throw error;
  console.log(`Reset ${DEMO_ACCOUNT.email} (already existed)`);
}

const { data: balanceRow, error: balanceError } = await admin
  .from('credit_balances')
  .select('balance')
  .eq('user_id', userId)
  .maybeSingle();
if (balanceError) throw balanceError;

const balance = balanceRow?.balance ?? 0;
const missing = DEMO_MIN_CREDITS - balance;
if (missing > 0) {
  const { error } = await admin.from('credit_transactions').insert({ user_id: userId, amount: missing, reason: 'adjustment' });
  if (error) throw error;
}
console.log(`Credits: ${Math.max(balance, DEMO_MIN_CREDITS)}`);

// Controle: echt inloggen zoals de app dat doet
const client = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error: signInError } = await client.auth.signInWithPassword({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password });
if (signInError) throw signInError;
console.log(`Login OK — ${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password}`);
