import { defaultLocale, intlLocale, type Locale } from '@/i18n/config';

// Vaste tijdzone zodat server- en client-render dezelfde tekst opleveren.
// De taal komt van de gebruiker (cookie → getLocale()/useLocale()); Engels als die ontbreekt.
const TIME_ZONE = 'Europe/Amsterdam';

const shortDate = new Map<Locale, Intl.DateTimeFormat>();
const dateTime = new Map<Locale, Intl.DateTimeFormat>();

function formatter(cache: Map<Locale, Intl.DateTimeFormat>, locale: Locale, options: Intl.DateTimeFormatOptions) {
  let format = cache.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(intlLocale[locale], { ...options, timeZone: TIME_ZONE });
    cache.set(locale, format);
  }
  return format;
}

// "6 Oct" / "6 okt"
export function formatShortDate(date: Date, locale: Locale = defaultLocale): string {
  return formatter(shortDate, locale, { day: 'numeric', month: 'short' }).format(date);
}

// "Tue 6 Oct, 18:00" / "di 6 okt, 18:00": voor events en tijdstippen van runs/berichten
export function formatDateTime(date: Date, locale: Locale = defaultLocale): string {
  return formatter(dateTime, locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
