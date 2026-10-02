import 'server-only';

import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config';
import { getDictionary, type Dictionary } from './dictionaries';
import { LOCALE_HEADER } from './routing';

// Voor Server Components, generateMetadata en Server Actions. Client Components gebruiken useT().
// Publieke pagina's krijgen hun taal uit de URL (de proxy zet een header); de app gebruikt de cookie.
export const getLocale = cache(async (): Promise<Locale> => {
  const fromUrl = (await headers()).get(LOCALE_HEADER);
  if (isLocale(fromUrl)) return fromUrl;
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
});

export async function getT(): Promise<Dictionary> {
  return getDictionary(await getLocale());
}
