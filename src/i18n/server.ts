import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config';
import { getDictionary, type Dictionary } from './dictionaries';

// Voor Server Components, generateMetadata en Server Actions. Client Components gebruiken useT().
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
});

export async function getT(): Promise<Dictionary> {
  return getDictionary(await getLocale());
}
