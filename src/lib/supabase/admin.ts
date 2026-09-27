import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

let admin: SupabaseClient | null = null;

// Supabase-client met de secret key: omzeilt Row Level Security.
// Alleen voor systeemwerk (runs, matches, credits, outreach-status), nooit met invoer die niet gecontroleerd is.
export function createAdminClient(): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseSecretKey) {
    throw new Error('SUPABASE_SECRET_KEY is not configured. Add it to .env.local (server-only).');
  }
  admin ??= createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
