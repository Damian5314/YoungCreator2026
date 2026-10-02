import { getT } from '@/i18n/server';
import type { LegalDocument } from '@/i18n/dictionaries/en/legal';
import type { PublicPath } from '@/i18n/routing';
import { BreadcrumbJsonLd } from './StructuredData';
import { SubpageHeading, SubpageShell } from './SubpageShell';
import { SupportCard } from './SupportCard';

/**
 * Gedeelde opmaak voor /privacy en /terms: een leesbare tekstkolom en (vanaf lg) een
 * inhoudsopgave die meeloopt.
 */
export async function LegalPage({ doc, path }: { doc: LegalDocument; path: PublicPath }) {
  const labels = (await getT()).legal.labels;

  return (
    <SubpageShell>
      <BreadcrumbJsonLd name={doc.title} path={path} />
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

        <article className="min-w-0 max-w-[46rem]">
          <SubpageHeading eyebrow={doc.eyebrow} title={doc.title}>
            <p className="mt-4 text-sm text-muted-foreground">
              {labels.lastUpdated}: {doc.updated}
            </p>
          </SubpageHeading>

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

          <SupportCard />
        </article>
      </div>
    </SubpageShell>
  );
}
