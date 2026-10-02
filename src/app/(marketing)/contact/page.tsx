import type { Metadata } from 'next';
import { LocaleLink as Link } from '@/components/layout/LocaleLink';
import { ArrowRight, Mail, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { getT } from '@/i18n/server';
import { publicPageMetadata } from '@/lib/seo';
import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';
import { SubpageHeading, SubpageShell } from '../_components/SubpageShell';
import { BreadcrumbJsonLd } from '../_components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = (await getT()).support;
  return publicPageMetadata('/contact', { title: contact.metaTitle, description: contact.metaDescription });
}

const linkClass =
  'rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

// Contact & support: kanalen, wat je meestuurt, snelle links naar de FAQ en de bedrijfsgegevens
export default async function ContactPage() {
  const t = await getT();
  const c = t.support.contact;

  const channels: { icon: LucideIcon; title: string; body: string; href: string; value: string }[] = [
    { icon: Mail, ...c.channels.email, href: `mailto:${COMPANY.email}`, value: COMPANY.email },
    { icon: Phone, ...c.channels.phone, href: COMPANY.phoneHref, value: COMPANY.phone },
    {
      icon: MessageCircle,
      ...c.channels.whatsapp,
      href: `https://wa.me/${COMPANY.phoneHref.replace(/\D/g, '')}`,
      value: COMPANY.phone,
    },
  ];

  return (
    <SubpageShell>
      <BreadcrumbJsonLd name={c.title} path="/contact" />
      <div className="mt-8 max-w-[62rem]">
        <SubpageHeading eyebrow={c.eyebrow} title={c.title}>
          <p className="mt-4 max-w-[40rem] text-[17px] leading-[1.7] text-muted-foreground">{c.intro}</p>
          <p className="mt-2 text-sm text-muted-foreground">{c.responseTime}</p>
        </SubpageHeading>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {channels.map(({ icon: Icon, title, body, href, value }) => (
            <li key={title} className="flex flex-col rounded-3xl border border-border bg-card p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
                <Icon aria-hidden className="size-5" />
              </span>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <a href={href} className={`mt-4 break-all text-[15px] ${linkClass}`}>
                {value}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">{c.includeTitle}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15.5px] leading-[1.6] text-foreground/85 marker:text-primary">
              {c.includeList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">{c.topicsTitle}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.topics.map((topic) => (
                <li key={topic.href}>
                  <Link href={topic.href} className={`inline-flex items-center gap-1.5 text-[15.5px] ${linkClass}`}>
                    {topic.label}
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/faq" className={`mt-5 inline-block text-sm ${linkClass}`}>
              {c.allFaq}
            </Link>
          </section>
        </div>

        <section className="mt-10 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-semibold text-foreground">{t.legal.labels.companyDetails}</h2>
          <p className="mt-2">
            {t.landing.footer.productOf} {COMPANY.legalName}
            <br />
            {COMPANY_ADDRESS}
            <br />
            KvK {COMPANY.kvk} · {t.landing.footer.vat} {COMPANY.vatId}
          </p>
        </section>
      </div>
    </SubpageShell>
  );
}
