import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getT } from '@/i18n/server';
import { SubpageHeading, SubpageShell } from '../_components/SubpageShell';
import { SupportCard } from '../_components/SupportCard';
import { OpenFromHash } from './OpenFromHash';

export async function generateMetadata(): Promise<Metadata> {
  const { faq } = (await getT()).support;
  return { title: faq.metaTitle, description: faq.metaDescription };
}

// Veelgestelde vragen: native <details>, dus zonder JavaScript toetsenbord- en screenreadervriendelijk
export default async function FaqPage() {
  const { faq } = (await getT()).support;

  return (
    <SubpageShell>
      <OpenFromHash />
      <div className="mt-8 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <aside className="hidden lg:block">
          <nav aria-label={faq.onThisPage} className="sticky top-28">
            <p className="text-sm font-semibold">{faq.onThisPage}</p>
            <ol className="mt-4 space-y-2.5 border-l border-foreground/9 text-sm">
              {faq.categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 max-w-[46rem]">
          <SubpageHeading eyebrow={faq.eyebrow} title={faq.title}>
            <p className="mt-4 text-[17px] leading-[1.7] text-muted-foreground">{faq.intro}</p>
          </SubpageHeading>

          {faq.categories.map((category) => (
            <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="mt-12 scroll-mt-28">
              <h2 id={`${category.id}-title`} className="text-2xl font-semibold tracking-[-0.02em]">
                {category.title}
              </h2>
              <div className="mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
                {category.items.map((item) => (
                  <details key={item.id} id={item.id} className="group scroll-mt-28">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-medium transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-6 [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <ChevronDown
                        aria-hidden
                        className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                      />
                    </summary>
                    <div className="space-y-3 px-5 pb-5 text-[15.5px] leading-[1.7] text-foreground/85 sm:px-6">
                      {item.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {item.link && (
                        <Link
                          href={item.link.href}
                          className="inline-flex items-center gap-1.5 rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                          {item.link.label}
                          <ArrowRight aria-hidden className="size-4" />
                        </Link>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <SupportCard />
        </div>
      </div>
    </SubpageShell>
  );
}
