// Prijzen en regels voor betalen. Eén plek: pas hier bedragen of pakketten aan.
// Bedragen in centen (integer), nooit als kommagetal.

import { defaultLocale, type Locale } from '@/i18n/config';

export const CURRENCY = 'EUR';

// Prijzen zijn inclusief btw. Digitale diensten aan consumenten in NL: 21%.
export const VAT_RATE_PERCENT = 21;

// Btw-deel van een bedrag inclusief btw, afgerond op hele centen
export function vatPart(grossCents: number): number {
  return grossCents - Math.round((grossCents * 100) / (100 + VAT_RATE_PERCENT));
}

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

// "€4.99" in het Engels, "€ 4,99" in het Nederlands
const euro: Record<Locale, Intl.NumberFormat> = {
  en: new Intl.NumberFormat('en-IE', { style: 'currency', currency: CURRENCY }),
  nl: new Intl.NumberFormat('nl-NL', { style: 'currency', currency: CURRENCY }),
};

export function formatMoney(cents: number, locale: Locale = defaultLocale): string {
  return euro[locale].format(cents / 100);
}

// Prijs per zoekopdracht, afgerond op hele centen ("€0.40 per search")
export function pricePerCredit(pack: CreditPack, locale: Locale = defaultLocale): string {
  return formatMoney(Math.round(pack.amountCents / pack.credits), locale);
}
