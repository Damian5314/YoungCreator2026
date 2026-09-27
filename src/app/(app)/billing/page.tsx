import type { Metadata } from 'next';
import { Coins, Lock, Search, Unlock } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BillingBanner } from '@/components/billing/BillingBanner';
import { CreditPackGrid } from '@/components/billing/CreditPackGrid';
import { PaymentHistory } from '@/components/billing/PaymentHistory';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { getT } from '@/i18n/server';
import { getBillingStatus, getPayments } from '@/lib/data/queries';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.billing.meta.title };
}

export default async function BillingPage() {
  const t = await getT();
  const p = t.billing.page;
  const [billing, payments] = await Promise.all([getBillingStatus(), getPayments()]);
  const creditLabel = t.common.credits.unit(billing.credits);
  const howItWorks = [
    p.howItWorks.free,
    p.howItWorks.perSearch(CREDIT_COST_PER_SEARCH),
    p.howItWorks.automations,
    p.howItWorks.noExpiry,
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={p.title} description={p.description} />

      <BillingBanner paymentsEnabled={billing.paymentsEnabled} testMode={billing.testMode} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title={p.balance} />
          <p className="flex items-baseline gap-2">
            <Coins className="size-5 self-center text-primary" aria-hidden />
            <span className="text-4xl font-semibold tracking-tight tabular-nums">{billing.credits}</span>
            <span className="text-muted-foreground">{creditLabel}</span>
          </p>
          <p
            className={`mt-4 flex items-start gap-2 rounded-lg p-3 text-sm ${
              billing.automationsUnlocked ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground'
            }`}
          >
            {billing.automationsUnlocked ? (
              <Unlock className="mt-0.5 size-4 shrink-0" aria-hidden />
            ) : (
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            )}
            {billing.automationsUnlocked ? p.unlocked : p.locked}
          </p>
          {billing.credits >= CREDIT_COST_PER_SEARCH && (
            <ButtonLink href="/search" variant="secondary" size="sm" className="mt-4 w-full">
              <Search className="size-4" aria-hidden />
              {p.startSearch}
            </ButtonLink>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title={p.howItWorks.title} />
          <ol className="space-y-3 text-sm">
            {howItWorks.map((line, index) => (
              <li key={line} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                  {index + 1}
                </span>
                <span className="pt-0.5">{line}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <section aria-labelledby="packs-title" className="space-y-4">
        <h2 id="packs-title" className="text-lg font-semibold">
          {p.buyCredits}
        </h2>
        <CreditPackGrid paymentsEnabled={billing.paymentsEnabled} />
        <p className="text-xs text-muted-foreground">{p.payNote}</p>
      </section>

      <PaymentHistory payments={payments} />
    </div>
  );
}
