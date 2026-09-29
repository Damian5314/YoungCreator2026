import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Info } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { getLocale, getT } from '@/i18n/server';
import { CREDIT_PACKS, formatMoney, pricePerCredit } from '@/modules/billing/plans';
import { SubpageHeading, SubpageShell } from '../_components/SubpageShell';

export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getT();
  return { title: pricing.metaTitle, description: pricing.metaDescription };
}

// Publieke prijzen: pakketten (uit plans.ts), regels rond credits en herroeping, vóór je een account maakt
export default async function PricingPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const p = t.pricing;

  return (
    <SubpageShell>
      <div className="mt-8 max-w-[62rem]">
        <SubpageHeading eyebrow={p.eyebrow} title={p.title}>
          <p className="mt-4 max-w-[40rem] text-[17px] leading-[1.7] text-muted-foreground">{p.intro}</p>
        </SubpageHeading>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {CREDIT_PACKS.map((pack) => {
            const popular = 'popular' in pack && pack.popular;
            return (
              <li
                key={pack.id}
                className={`flex flex-col rounded-3xl border bg-card p-6 ${popular ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{t.billing.packs[pack.id].name}</h2>
                  {popular && (
                    <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-foreground">
                      {p.popular}
                    </span>
                  )}
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight">{formatMoney(pack.amountCents, locale)}</span>
                  <span className="text-sm text-muted-foreground">{p.inclVat}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.credits(pack.credits)} · {p.perSearch(pricePerCredit(pack, locale))}
                </p>
                <p className="mt-4 flex-1 text-sm">{t.billing.packs[pack.id].description}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          {/* Lange vertalingen mogen op smalle schermen over twee regels */}
          <ButtonLink href="/register" shape="pill" size="lg" className="h-auto! min-h-12 whitespace-normal! py-3 text-center">
            {p.cta}
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">{p.rulesTitle}</h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-[1.6] text-foreground/85">
              {p.rules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold">{p.withdrawalTitle}</h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-foreground/85">{p.withdrawalBody}</p>
            <Link
              href="/terms#withdrawal"
              className="mt-4 inline-flex items-center gap-1.5 rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {p.withdrawalLink}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <p className="mt-6 flex gap-3 rounded-2xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {p.resultsNote}
            </p>
          </section>
        </div>
      </div>
    </SubpageShell>
  );
}
