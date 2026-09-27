// Prijzen en regels voor betalen. Eén plek: pas hier bedragen of pakketten aan.
// Bedragen in centen (integer), nooit als kommagetal.

export const CURRENCY = 'EUR';

// De eerste zoekopdracht is gratis: nieuwe accounts krijgen 1 credit (zie de billing-migratie)
export const FREE_WELCOME_CREDITS = 1;

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  amountCents: number;
  description: string;
  popular?: boolean;
}

export const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    amountCents: 499,
    description: 'Try it for a few weeks of searching.',
  },
  {
    id: 'plus',
    name: 'Plus',
    credits: 30,
    amountCents: 1199,
    description: 'A daily search for a month, with automations.',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 75,
    amountCents: 2499,
    description: 'For your whole search year, with room to spare.',
  },
] as const satisfies readonly CreditPack[];

export type CreditPackId = (typeof CREDIT_PACKS)[number]['id'];

export const PACK_IDS = CREDIT_PACKS.map((pack) => pack.id) as [CreditPackId, ...CreditPackId[]];

export function findPack(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((pack) => pack.id === id);
}

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: CURRENCY });

export function formatMoney(cents: number): string {
  return euro.format(cents / 100);
}

// Prijs per zoekopdracht, afgerond op hele centen ("€0.40 per search")
export function pricePerCredit(pack: CreditPack): string {
  return formatMoney(Math.round(pack.amountCents / pack.credits));
}
