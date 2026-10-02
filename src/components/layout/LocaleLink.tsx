'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLocale } from '@/i18n/I18nProvider';
import { localizeHref } from '@/i18n/routing';

/**
 * next/link die publieke pagina's in de huidige taal opent (/faq ↔ /nl/faq). App-paden, ankers en
 * externe links blijven zoals ze zijn, dus deze component kan overal Link vervangen.
 */
export function LocaleLink({ href, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const locale = useLocale();
  return <Link href={localizeHref(href, locale)} {...props} />;
}
