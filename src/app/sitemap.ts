import type { MetadataRoute } from 'next';
import { localizeHref, PUBLIC_PATHS } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo';

// Elke publieke pagina in beide talen, met hreflang-alternates (zie src/i18n/routing.ts)
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) => {
    const languages = { en: absoluteUrl(localizeHref(path, 'en')), nl: absoluteUrl(localizeHref(path, 'nl')) };
    const priority = path === '/' ? 1 : path === '/pricing' ? 0.8 : 0.5;
    return (['en', 'nl'] as const).map((locale) => ({
      url: languages[locale],
      changeFrequency: path === '/' || path === '/pricing' ? ('weekly' as const) : ('monthly' as const),
      priority,
      alternates: { languages },
    }));
  });
}
