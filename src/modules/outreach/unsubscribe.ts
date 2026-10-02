import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

/*
 * Afmelden voor e-mails die Unlisted namens studenten verstuurt. Elke verstuurde mail krijgt een
 * persoonlijke link met een HMAC-handtekening, zodat niemand andermans adres kan afmelden.
 * De sleutel is afgeleid van de Supabase secret key, dus er is geen extra env-variabele nodig.
 */

function signingKey(): string {
  if (!env.supabaseSecretKey) throw new Error('SUPABASE_SECRET_KEY is required to sign unsubscribe links.');
  return createHmac('sha256', env.supabaseSecretKey).update('unlisted:outreach-unsubscribe:v1').digest('hex');
}

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', signingKey()).update(email.trim().toLowerCase()).digest('base64url');
}

export function isValidUnsubscribeToken(email: string, token: string): boolean {
  if (!env.supabaseSecretKey) return false; // zonder sleutel bestaan er ook geen geldige links
  const expected = Buffer.from(unsubscribeToken(email));
  const received = Buffer.from(token);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

// null als er geen vaste publieke URL is (lokaal zonder APP_URL): dan geen link, wel de rest van de mail
export function unsubscribeUrl(email: string): string | null {
  if (!env.appUrl || !env.supabaseSecretKey) return null;
  const params = new URLSearchParams({ e: email.trim().toLowerCase(), t: unsubscribeToken(email) });
  return `${env.appUrl}/unsubscribe?${params}`;
}

// Regel onder elke mail die via Unlisted wordt verstuurd (tweetalig: de taal van de ontvanger is onbekend)
export function outreachFooter(email: string): string {
  const url = unsubscribeUrl(email);
  const lines = ['—', 'Sent via Unlisted on behalf of the sender. / Verstuurd via Unlisted namens de afzender.'];
  if (url) lines.push(`No more emails via Unlisted? / Geen e-mails meer via Unlisted? ${url}`);
  return `\n\n${lines.join('\n')}`;
}

export async function isSuppressed(email: string): Promise<boolean> {
  const { data, error } = await createAdminClient()
    .from('outreach_suppressions')
    .select('email')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function suppressEmail(email: string, reason: 'unsubscribe' | 'bounce' | 'complaint' | 'manual' = 'unsubscribe') {
  const { error } = await createAdminClient()
    .from('outreach_suppressions')
    .upsert({ email: email.trim().toLowerCase(), reason }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) throw error;
}
