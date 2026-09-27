import 'server-only';
import { features } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

// Wat mag deze gebruiker? Op basis van betalingen, nooit op basis van een vlag die de client meestuurt.
// Regels: elke zoekopdracht kost credits (ook zonder Mollie). Automations (automatisch zoeken,
// mails laten versturen door Unlisted) vragen minstens één gelukte betaling. Zonder Mollie-key
// staat de betaalmuur voor automations uit, zodat lokaal ontwikkelen zonder betalen werkt.

export const AUTOMATIONS_LOCKED_MESSAGE = 'Automations unlock with any credit pack. Your first search is on us.';

export async function hasPaidAccess(userId: string): Promise<boolean> {
  if (!features.payments) return true;
  const { data, error } = await createAdminClient().rpc('has_paid_access', { p_user_id: userId });
  if (error) {
    console.error('[billing] checking paid access failed', error.message);
    return false;
  }
  return Boolean(data);
}
