import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Caveat } from 'next/font/google';
import { I18nProvider } from '@/i18n/I18nProvider';
import { headers } from 'next/headers';
import { getLocale, getT } from '@/i18n/server';
import { NONCE_HEADER } from '@/lib/csp';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { Providers } from './providers';
import './globals.css';

// opsz-as: Inter schakelt op grote koppen automatisch naar de strakkere display-variant
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: 'Unlisted',
      template: '%s · Unlisted',
    },
    description: t.common.meta.description,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Taal uit de URL (/nl) of de cookie (standaard Engels); bepaalt <html lang> en alle teksten
  const locale = await getLocale();
  const t = await getT();
  // Nonce uit de proxy, voor het inline thema-script van next-themes (CSP)
  const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${caveat.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {/* Eerste tabstop: sla header en navigatie over (elke layout heeft <main id="main">) */}
        <a
          href="#main"
          className="sr-only rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t.common.nav.skipToContent}
        </a>
        <I18nProvider locale={locale}>
          <Providers nonce={nonce}>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
