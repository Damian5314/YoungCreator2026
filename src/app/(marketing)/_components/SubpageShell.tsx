import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { getT } from '@/i18n/server';
import { buildLanding } from '../_content/landing';
import { Footer } from '../_sections/footer/Footer';

/**
 * Omlijsting voor losse publieke pagina's (privacy, voorwaarden, FAQ, contact): dezelfde header en
 * footer als de homepage. De ankers in de navigatie krijgen een `/` ervoor, zodat ze terug naar de
 * secties van de homepage leiden.
 */
export async function SubpageShell({ children }: { children: ReactNode }) {
  const t = await getT();
  const { nav } = buildLanding(t.landing);
  const subpageNav = {
    ...nav,
    home: '/',
    links: nav.links.map((link) => ({ ...link, href: `/${link.href}` })),
  };

  return (
    <>
      <MarketingHeader nav={subpageNav} />
      <main id="main" tabIndex={-1} className="pb-16 pt-28 outline-none sm:pt-32 lg:pb-24">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {t.legal.labels.backHome}
          </Link>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  );
}

/** Kop van een subpagina: klein label, titel en een korte inleiding. */
export function SubpageHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{title}</h1>
      {children}
    </>
  );
}
