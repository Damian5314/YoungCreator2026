import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

// Publieke pagina's mogen geïndexeerd worden; de app, auth-schermen en API niet
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/dashboard',
        '/search',
        '/opportunities',
        '/companies',
        '/matches',
        '/outreach',
        '/billing',
        '/settings',
        '/reset-password',
        '/account-deleted',
        '/unsubscribe',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
