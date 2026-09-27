// Talen van de site. Engels is de standaard; de gekozen taal staat in een cookie
// (geen /en- of /nl-prefix in de URL, zodat alle bestaande routes en redirects blijven werken).
export const locales = ['en', 'nl'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const LOCALE_COOKIE = 'locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

// BCP 47-tags voor Intl (datums, getallen, bedragen)
export const intlLocale: Record<Locale, string> = {
  en: 'en-GB',
  nl: 'nl-NL',
};
