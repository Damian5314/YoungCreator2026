import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { getT } from '@/i18n/server';
import type { LegalDocument } from '@/i18n/dictionaries/en/legal';
import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';
import { buildLanding } from '../_content/landing';
import { Footer } from '../_sections/footer/Footer';

const textLink =
  'rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

/**
 * Gedeelde opmaak voor /privacy en /terms: dezelfde header en footer als de homepage, met
 * een leesbare tekstkolom en (vanaf lg) een inhoudsopgave die meeloopt. De ankers in de
 * navigatie krijgen een `/` ervoor, zodat ze terug naar de secties van de homepage leiden.
 */
export async function LegalPage({ doc }: { doc: LegalDocument }) {
  const t = await getT();
  const { nav } = buildLanding(t.landing);
  const labels = t.legal.labels;
  const subpageNav = {
    ...nav,
    home: '/',
    links: nav.links.map((link) => ({ ...link, href: `/${link.href}` })),
  };

  return (
    <>
      <MarketingHeader nav={subpageNav} />
      <main className="pb-16 pt-28 sm:pt-32 lg:pb-24">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {labels.backHome}
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
            <aside className="hidden lg:block">
              <nav aria-label={labels.onThisPage} className="sticky top-28">
                <p className="text-sm font-semibold">{labels.onThisPage}</p>
                <ol className="mt-4 space-y-2.5 border-l border-foreground/9 text-sm">
                  {doc.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l border-transparent pl-4 text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="max-w-[46rem]">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{doc.eyebrow}</p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{doc.title}</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                {labels.lastUpdated}: {doc.updated}
              </p>

              <div className="mt-8 space-y-4 text-[17px] leading-[1.7]">
                {doc.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} className="mt-12 scroll-mt-28">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em]">{section.heading}</h2>
                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-[16px] leading-[1.7] text-foreground/85">
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-[1.7] text-foreground/85 marker:text-primary">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <section className="mt-14 rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h2 className="text-lg font-semibold">{labels.questions}</h2>
                <p className="mt-2 text-muted-foreground">
                  {labels.questionsBody.split(COMPANY.email)[0]}
                  <a href={`mailto:${COMPANY.email}`} className={textLink}>
                    {COMPANY.email}
                  </a>
                  {labels.questionsBody.split(COMPANY.email)[1]}
                </p>
                <h3 className="mt-6 text-sm font-semibold">{labels.companyDetails}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {COMPANY.legalName} · {COMPANY_ADDRESS}
                  <br />
                  KvK {COMPANY.kvk} · {t.landing.footer.vat} {COMPANY.vatId}
                  <br />
                  <a href={COMPANY.phoneHref} className={textLink}>
                    {COMPANY.phone}
                  </a>
                </p>
              </section>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
