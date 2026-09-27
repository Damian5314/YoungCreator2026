import 'server-only';
import { z } from 'zod';
import { env } from '@/lib/env';

// Kleine client voor de Mollie Payments API (v2), zonder SDK. Alleen server-side: de API-key
// mag nooit in de browser komen. Docs: https://docs.mollie.com/reference/create-payment

const MOLLIE_API = 'https://api.mollie.com/v2';

export class MollieError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

export const MOLLIE_PAYMENT_STATUSES = ['open', 'pending', 'authorized', 'paid', 'failed', 'canceled', 'expired'] as const;
export type MolliePaymentStatus = (typeof MOLLIE_PAYMENT_STATUSES)[number];

const paymentSchema = z.object({
  id: z.string().regex(/^tr_\w+$/),
  mode: z.enum(['test', 'live']),
  status: z.enum(MOLLIE_PAYMENT_STATUSES),
  amount: z.object({ currency: z.string(), value: z.string() }),
  paidAt: z.string().nullish(),
  metadata: z.unknown().optional(),
  _links: z.object({ checkout: z.object({ href: z.url() }).nullish() }).partial().optional(),
});

export interface MolliePayment {
  id: string;
  mode: 'test' | 'live';
  status: MolliePaymentStatus;
  amountCents: number;
  currency: string;
  paidAt: string | null;
  checkoutUrl: string | null;
  metadata: unknown;
}

// "12.50" → 1250 (Mollie geeft bedragen als string met precies twee decimalen)
function toCents(value: string): number {
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0').slice(0, 2)) * (value.startsWith('-') ? -1 : 1);
}

// 1250 → "12.50"
function toAmountValue(cents: number): string {
  if (!Number.isInteger(cents) || cents <= 0) throw new MollieError('Amount must be a positive number of cents.');
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
}

function toPayment(raw: unknown): MolliePayment {
  const parsed = paymentSchema.safeParse(raw);
  if (!parsed.success) throw new MollieError('Unexpected response from Mollie.');
  const payment = parsed.data;
  return {
    id: payment.id,
    mode: payment.mode,
    status: payment.status,
    amountCents: toCents(payment.amount.value),
    currency: payment.amount.currency,
    paidAt: payment.paidAt ?? null,
    checkoutUrl: payment._links?.checkout?.href ?? null,
    metadata: payment.metadata,
  };
}

async function mollieFetch(path: string, init: RequestInit & { idempotencyKey?: string } = {}): Promise<unknown> {
  if (!env.mollieApiKey) throw new MollieError('Payments are not configured (MOLLIE_API_KEY is missing).');

  const { idempotencyKey, ...rest } = init;
  let response: Response;
  try {
    response = await fetch(`${MOLLIE_API}${path}`, {
      ...rest,
      headers: {
        authorization: `Bearer ${env.mollieApiKey}`,
        'content-type': 'application/json',
        ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}),
      },
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    });
  } catch (error) {
    throw new MollieError(`Could not reach Mollie: ${error instanceof Error ? error.message : 'network error'}`);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    // Mollie-fouten: { status, title, detail, field? } — nooit de API-key of volledige request loggen
    const detail = (body as { detail?: string; field?: string } | null)?.detail;
    throw new MollieError(`Mollie responded with ${response.status}${detail ? `: ${detail}` : ''}`, response.status);
  }
  return body;
}

export interface CreatePaymentInput {
  amountCents: number;
  currency: string;
  description: string;
  redirectUrl: string;
  cancelUrl?: string;
  webhookUrl?: string; // alleen een publiek bereikbare URL; Mollie weigert localhost
  metadata: Record<string, string>;
  idempotencyKey: string;
}

export async function createMolliePayment(input: CreatePaymentInput): Promise<MolliePayment> {
  const raw = await mollieFetch('/payments', {
    method: 'POST',
    idempotencyKey: input.idempotencyKey,
    body: JSON.stringify({
      amount: { currency: input.currency, value: toAmountValue(input.amountCents) },
      description: input.description.slice(0, 255),
      redirectUrl: input.redirectUrl,
      ...(input.cancelUrl ? { cancelUrl: input.cancelUrl } : {}),
      ...(input.webhookUrl ? { webhookUrl: input.webhookUrl } : {}),
      metadata: input.metadata,
    }),
  });
  const payment = toPayment(raw);
  if (!payment.checkoutUrl) throw new MollieError('Mollie did not return a checkout link.');
  return payment;
}

export async function getMolliePayment(id: string): Promise<MolliePayment> {
  if (!/^tr_\w+$/.test(id)) throw new MollieError('Invalid Mollie payment id.');
  return toPayment(await mollieFetch(`/payments/${id}`, { method: 'GET' }));
}

// Mollie moet de webhook kunnen bereiken: niet vanaf localhost of een privé-adres
export function isPublicUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== 'https:') return false;
    return !/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/.test(hostname);
  } catch {
    return false;
  }
}
