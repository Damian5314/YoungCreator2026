import 'server-only';
import { env, features } from '@/lib/env';
import { createMolliePayment, getMolliePayment, isPublicUrl, type MolliePaymentStatus } from '@/lib/mollie';
import { createAdminClient } from '@/lib/supabase/admin';
import { CURRENCY, findPack } from './plans';

// Betalen met Mollie. De browser bepaalt nooit of iets betaald is: de status komt altijd van de
// Mollie API (fetch-to-confirm), en credits worden in de database precies één keer bijgeschreven.

export type CheckoutResult = { ok: true; checkoutUrl: string } | { ok: false; error: string };

// Maakt een betaling aan (eerst bij ons, dan bij Mollie) en geeft de link naar de Mollie-checkout terug
export async function startCheckout(userId: string, packId: string, origin: string): Promise<CheckoutResult> {
  if (!features.payments) return { ok: false, error: 'Payments aren’t set up yet.' };
  const pack = findPack(packId);
  if (!pack) return { ok: false, error: 'That credit pack doesn’t exist.' };

  const admin = createAdminClient();
  const { data: payment, error } = await admin
    .from('payments')
    .insert({ user_id: userId, pack_id: pack.id, credits: pack.credits, amount_cents: pack.amountCents, currency: CURRENCY })
    .select('id')
    .single();
  if (error) throw error;

  const baseUrl = env.appUrl ?? origin;
  const webhookUrl = `${baseUrl}/api/mollie/webhook`;
  try {
    const mollie = await createMolliePayment({
      amountCents: pack.amountCents,
      currency: CURRENCY,
      description: `Unlisted: ${pack.credits} credits (${pack.name})`,
      redirectUrl: `${baseUrl}/billing/return?payment=${payment.id}`,
      // Lokaal (localhost) kan Mollie ons niet bereiken; dan bevestigt de terugkeerpagina de betaling
      webhookUrl: isPublicUrl(webhookUrl) ? webhookUrl : undefined,
      metadata: { paymentId: payment.id, packId: pack.id },
      idempotencyKey: payment.id,
    });

    const { error: updateError } = await admin
      .from('payments')
      .update({ provider_payment_id: mollie.id, checkout_url: mollie.checkoutUrl, status: mollie.status, mode: mollie.mode })
      .eq('id', payment.id);
    if (updateError) throw updateError;

    return { ok: true, checkoutUrl: mollie.checkoutUrl! };
  } catch (checkoutError) {
    // Nooit bij Mollie aangekomen: geen spookregel in de betaalgeschiedenis laten staan
    await admin.from('payments').delete().eq('id', payment.id).is('provider_payment_id', null);
    console.error('[billing] creating the Mollie payment failed:', checkoutError instanceof Error ? checkoutError.message : checkoutError);
    return { ok: false, error: 'We couldn’t start the payment. Please try again in a moment.' };
  }
}

export interface PaymentSync {
  paymentId: string;
  status: MolliePaymentStatus;
  credited: boolean; // bij déze aanroep credits bijgeschreven
}

// Haalt de échte status op bij Mollie en verwerkt die. Gebruikt door de webhook én de terugkeerpagina;
// vaker aanroepen is veilig (idempotent). null = onbekende betaling of bedrag klopt niet.
export async function syncMolliePayment(molliePaymentId: string): Promise<PaymentSync | null> {
  const mollie = await getMolliePayment(molliePaymentId);
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from('payments')
    .select('id, amount_cents, currency')
    .eq('provider_payment_id', mollie.id)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;

  // Alleen bijschrijven voor precies het bedrag dat wij hebben aangemaakt
  if (mollie.amountCents !== row.amount_cents || mollie.currency !== row.currency) {
    console.error(`[billing] amount mismatch for payment ${row.id}; not crediting`);
    return null;
  }

  const { data: credited, error: applyError } = await admin.rpc('apply_payment_status', {
    p_payment_id: row.id,
    p_status: mollie.status,
    p_paid_at: mollie.paidAt,
    p_mode: mollie.mode,
  });
  if (applyError) throw applyError;
  if (credited) console.info(`[billing] payment ${row.id} paid; credits added`);

  return { paymentId: row.id, status: mollie.status, credited: Boolean(credited) };
}

export interface PaymentView {
  id: string;
  packId: string;
  credits: number;
  amountCents: number;
  currency: string;
  status: MolliePaymentStatus;
  mode: 'test' | 'live' | null;
  createdAt: string;
  paidAt: string | null;
}

// Terugkeerpagina: betaling van déze gebruiker, eerst bijgewerkt met de status bij Mollie
export async function confirmPaymentForUser(userId: string, paymentId: string): Promise<PaymentView | null> {
  const admin = createAdminClient();
  const load = async () => {
    const { data, error } = await admin
      .from('payments')
      .select('id, pack_id, credits, amount_cents, currency, status, mode, created_at, paid_at, provider_payment_id')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const before = await load();
  if (!before) return null;
  if (before.provider_payment_id && before.status !== 'paid' && features.payments) {
    try {
      await syncMolliePayment(before.provider_payment_id);
    } catch (syncError) {
      // Mollie even niet bereikbaar: de webhook of een refresh maakt het later af
      console.warn('[billing] confirming payment on return failed:', syncError instanceof Error ? syncError.message : syncError);
    }
  }

  const row = (await load()) ?? before;
  return {
    id: row.id,
    packId: row.pack_id,
    credits: row.credits,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    mode: row.mode,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}
