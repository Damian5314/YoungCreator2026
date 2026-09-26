import { Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { PRICING_TIERS } from '@/shared/constants/opportunityTypes';

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing, no subscription</h2>
          <p className="mt-4 text-muted-foreground">Buy credits. Use them whenever you want.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const unlimited = tier.credits === 999;
            return (
              <div key={tier.name} className="flex flex-col rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold">{tier.name}</h3>
                <p className="mt-4 text-4xl font-bold tracking-tight">€{tier.priceEur}</p>
                <p className="mt-1 text-sm text-muted-foreground">one-time payment</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-success" aria-hidden />
                    {unlimited ? 'Unlimited searches' : `${tier.credits} searches`}
                  </li>
                  {!unlimited && (
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" aria-hidden />
                      €{(tier.priceEur / tier.credits).toFixed(2)} per search
                    </li>
                  )}
                </ul>
                {/* TODO: naar checkout zodra billing er is */}
                <ButtonLink href="/register" variant="secondary" className="mt-6 w-full">
                  Choose {tier.name}
                </ButtonLink>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          1 credit = 1 search · 2 credits = 1 application action
        </p>
      </div>
    </section>
  );
}
