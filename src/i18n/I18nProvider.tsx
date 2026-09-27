'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { defaultLocale, type Locale } from './config';
import { dictionaries, type Dictionary } from './dictionaries';

const LocaleContext = createContext<Locale>(defaultLocale);

// De root layout leest de taal uit de cookie en geeft hem hier door
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

// Voor Client Components. Server Components gebruiken `await getT()` uit '@/i18n/server'.
export function useT(): Dictionary {
  return dictionaries[useLocale()];
}
