import { defaultLocale, type Locale } from './config';

/*
 * Taal in de URL, alleen voor de publieke, indexeerbare pagina's: Engels op de gewone URL
 * (/pricing), Nederlands met prefix (/nl/pricing). Zo kan Google beide talen vinden (hreflang).
 * De ingelogde app en login/registratie blijven op de taalcookie werken, zonder prefix.
 * Puur (geen Next-imports): bruikbaar in de proxy, op de server en in de browser.
 */

// Paden met een Nederlandse variant onder /nl. Nieuwe publieke pagina's hier toevoegen.
export const PUBLIC_PATHS = ['/', '/pricing', '/faq', '/contact', '/privacy', '/terms'] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number];

// Request-header waarmee de proxy de taal van een /nl-URL doorgeeft aan de pagina
export const LOCALE_HEADER = 'x-unlisted-locale';

export const PREFIXED_LOCALE: Locale = 'nl';

export function isPublicPath(path: string): path is PublicPath {
  return (PUBLIC_PATHS as readonly string[]).includes(path);
}

// "/nl/faq" → { locale: 'nl', path: '/faq' }; "/faq" → { locale: null, path: '/faq' }
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  if (pathname === `/${PREFIXED_LOCALE}`) return { locale: PREFIXED_LOCALE, path: '/' };
  if (pathname.startsWith(`/${PREFIXED_LOCALE}/`)) {
    return { locale: PREFIXED_LOCALE, path: pathname.slice(PREFIXED_LOCALE.length + 1) };
  }
  return { locale: null, path: pathname };
}

/**
 * Link naar een pagina in een bepaalde taal. Alleen publieke paden krijgen een prefix; app-paden,
 * externe links, mailto: en ankers blijven ongewijzigd. Query en hash blijven behouden.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const path = match?.[1] || '/';
  const rest = match?.[2] ?? '';
  const base = splitLocale(path).path;
  if (!isPublicPath(base)) return href;
  if (locale === defaultLocale) return `${base}${rest}`;
  return `${base === '/' ? `/${locale}` : `/${locale}${base}`}${rest}`;
}
