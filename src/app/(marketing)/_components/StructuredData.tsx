import { getLocale, getT } from '@/i18n/server';
import { localizeHref, type PublicPath } from '@/i18n/routing';
import type { FaqCategory } from '@/i18n/dictionaries/en/support';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import { CREDIT_PACKS, CURRENCY } from '@/modules/billing/plans';
import { COMPANY } from '@/shared/constants/company';

/*
 * JSON-LD voor zoekmachines en AI-assistenten. Alleen feiten die in de code staan: bedrijfsgegevens,
 * prijzen en FAQ-teksten. Geen reviews, ratings of verzonnen cijfers.
 */

function JsonLd({ data }: { data: unknown }) {
  // "<" escapen zodat tekst nooit uit het script-element kan breken
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

const organizationId = `${COMPANY.website}/#organization`;

function organization() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: COMPANY.legalName,
    url: COMPANY.website,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    vatID: COMPANY.vatId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
      addressCountry: 'NL',
    },
  };
}

// Homepage: wie maakt Unlisted, wat is het en wat kost het
export async function HomeJsonLd() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const home = absoluteUrl(localizeHref('/', locale));

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          organization(),
          {
            '@type': 'WebSite',
            '@id': `${absoluteUrl('/')}#website`,
            name: SITE_NAME,
            url: home,
            inLanguage: locale,
            publisher: { '@id': organizationId },
          },
          {
            '@type': 'SoftwareApplication',
            name: SITE_NAME,
            url: home,
            description: t.common.meta.description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            inLanguage: ['en', 'nl'],
            provider: { '@id': organizationId },
            offers: CREDIT_PACKS.map((pack) => ({
              '@type': 'Offer',
              name: `${t.billing.packs[pack.id].name} (${pack.credits} credits)`,
              price: (pack.amountCents / 100).toFixed(2),
              priceCurrency: CURRENCY,
              url: absoluteUrl(localizeHref('/pricing', locale)),
            })),
          },
        ],
      }}
    />
  );
}

export async function FaqJsonLd({ categories }: { categories: FaqCategory[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: categories.flatMap((category) =>
          category.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer.join(' ') },
          })),
        ),
      }}
    />
  );
}

// Home › pagina
export async function BreadcrumbJsonLd({ name, path }: { name: string; path: PublicPath }) {
  const locale = await getLocale();
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl(localizeHref('/', locale)) },
          { '@type': 'ListItem', position: 2, name, item: absoluteUrl(localizeHref(path, locale)) },
        ],
      }}
    />
  );
}
