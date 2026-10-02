import 'server-only';
import type { Metadata } from 'next';
import { intlLocale, type Locale } from '@/i18n/config';
import { localizeHref, type PublicPath } from '@/i18n/routing';
import { getLocale } from '@/i18n/server';
import { env } from '@/lib/env';

export const SITE_NAME = 'Unlisted';

// Absolute basis-URL voor canonical, OpenGraph, sitemap en JSON-LD. Zet APP_URL op het productiedomein.
export const SITE_URL = env.appUrl ?? 'http://localhost:3000';

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

const ogLocale = (locale: Locale) => intlLocale[locale].replace('-', '_'); // en_GB, nl_NL

// Uit app/opengraph-image.tsx; expliciet nodig omdat een eigen openGraph-object de geërfde afbeelding vervangt
const SHARE_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Unlisted' };

/**
 * Metadata voor een publieke pagina: canonical in de huidige taal, hreflang naar beide talen
 * (x-default = Engels) en OpenGraph/Twitter. De deelafbeelding komt uit app/opengraph-image.tsx.
 */
export async function publicPageMetadata(
  path: PublicPath,
  { title, description, absoluteTitle = false }: { title: string; description: string; absoluteTitle?: boolean },
): Promise<Metadata> {
  const locale = await getLocale();
  const url = localizeHref(path, locale);
  const shareTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: localizeHref(path, 'en'),
        nl: localizeHref(path, 'nl'),
        'x-default': localizeHref(path, 'en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url,
      locale: ogLocale(locale),
      alternateLocale: [ogLocale(locale === 'en' ? 'nl' : 'en')],
      images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: [SHARE_IMAGE.url] },
  };
}

// Ingelogde app, login en hulpschermen: niet in zoekmachines
export const NO_INDEX: Metadata = { robots: { index: false, follow: false } };
