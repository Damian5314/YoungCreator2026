import type { Metadata } from 'next';
import { Coins, Lock, Search, Unlock } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BillingBanner } from '@/components/billing/BillingBanner';
import { CreditPackGrid } from '@/components/billing/CreditPackGrid';
import { PaymentHistory } from '@/components/billing/PaymentHistory';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { getBillingStatus, getPayments } from '@/lib/data/queries';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';

export const metadata: Metadata = { title: 'Credits & billing' };

const HOW_IT_WORKS = [
  'Your first search is free.',
  `Every search costs ${CREDIT_COST_PER_SEARCH} credit, whether you start it or it runs on a schedule.`,
  'Any credit pack unlocks automations: automatic searches and sending emails through Unlisted.',
  'Credits never expire. If a search fails, you get the credit back.',
];

export default async function BillingPage() {
  const [billing, payments] = await Promise.all([getBillingStatus(), getPayments()]);
  const creditLabel = billing.credits === 1 ? 'credit' : 'credits';

  return (
    <div className="space-y-6">
      <PageHeader title="Credits & billing" description="Pay only for what you use. No subscription." />

      <BillingBanner paymentsEnabled={billing.paymentsEnabled} testMode={billing.testMode} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Your balance" />
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
            {billing.automationsUnlocked
              ? 'Automations are unlocked.'
              : 'Automations unlock with your first credit pack.'}
          </p>
          {billing.credits >= CREDIT_COST_PER_SEARCH && (
            <ButtonLink href="/search" variant="secondary" size="sm" className="mt-4 w-full">
              <Search className="size-4" aria-hidden />
              Start a search
            </ButtonLink>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="How credits work" />
          <ol className="space-y-3 text-sm">
            {HOW_IT_WORKS.map((line, index) => (
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
          Buy credits
        </h2>
        <CreditPackGrid paymentsEnabled={billing.paymentsEnabled} />
        <p className="text-xs text-muted-foreground">
          Pay with iDEAL, card or another method via Mollie. You&apos;ll come straight back here afterwards.
        </p>
      </section>

      <PaymentHistory payments={payments} />
    </div>
  );
}
