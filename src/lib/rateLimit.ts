import 'server-only';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

// Limieten per actie: maximaal `max` keer per `windowSeconds`, per gebruiker of IP-adres.
// Ruim genoeg voor normaal gebruik, krap genoeg tegen brute force en misbruik van AI-kosten.
export const RATE_LIMITS = {
  login: { max: 10, windowSeconds: 15 * 60 },
  register: { max: 5, windowSeconds: 60 * 60 },
  passwordReset: { max: 5, windowSeconds: 60 * 60 },
  search: { max: 20, windowSeconds: 60 * 60 },
  outreachDraft: { max: 30, windowSeconds: 60 * 60 },
  outreachSend: { max: 30, windowSeconds: 60 * 60 },
  checkout: { max: 10, windowSeconds: 60 * 60 },
  cvUpload: { max: 10, windowSeconds: 60 * 60 },
  accountChange: { max: 10, windowSeconds: 60 * 60 },
  export: { max: 5, windowSeconds: 60 * 60 },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS;

// IP-adres van de bezoeker; op Vercel zet het platform x-forwarded-for (eerste adres = de client)
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

/**
 * Telt één poging mee en geeft true terug zolang de limiet niet is bereikt. `subject` is een
 * user-id of IP-adres. Faalt open: als de database even niet reageert, blokkeren we geen echte gebruikers.
 */
export async function withinRateLimit(action: RateLimitAction, subject: string): Promise<boolean> {
  const { max, windowSeconds } = RATE_LIMITS[action];
  try {
    const { data, error } = await createAdminClient().rpc('hit_rate_limit', {
      p_key: `${action}:${subject}`,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) throw error;
    return data !== false;
  } catch (error) {
    console.error(`[rate-limit] check for ${action} failed; allowing`, error instanceof Error ? error.message : error);
    return true;
  }
}
