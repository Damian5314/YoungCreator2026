'use client';

import { useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormMessage } from '@/components/ui/FormMessage';
import { buyCredits } from '@/lib/actions/billing';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { CREDIT_PACKS, formatMoney, pricePerCredit } from '@/modules/billing/plans';

const INCLUDED = ['Manual and automatic searches', 'Automations unlocked', 'Credits never expire'];

// Creditpakketten. "Buy" maakt een Mollie-betaling aan en stuurt door naar de Mollie-checkout.
export function CreditPackGrid({ paymentsEnabled }: { paymentsEnabled: boolean }) {
  const { state, pending, submit } = useFormAction(buyCredits);
  const [chosen, setChosen] = useState<string | null>(null);

  function buy(packId: string) {
    setChosen(packId);
    const formData = new FormData();
    formData.set('packId', packId);
    submit(formData);
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {CREDIT_PACKS.map((pack) => {
          const popular = 'popular' in pack && pack.popular;
          const busy = pending && chosen === pack.id;
          return (
            <Card key={pack.id} className={`flex flex-col ${popular ? 'border-primary ring-1 ring-primary' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{pack.name}</h3>
                {popular && <Badge tone="primary">Most popular</Badge>}
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{formatMoney(pack.amountCents)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pack.credits} searches · {pricePerCredit(pack)} per search
              </p>
              <p className="mt-3 text-sm">{pack.description}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                variant={popular ? 'primary' : 'secondary'}
                disabled={!paymentsEnabled || pending}
                onClick={() => buy(pack.id)}
              >
                {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
                {busy ? 'Opening checkout…' : `Buy ${pack.credits} credits`}
              </Button>
            </Card>
          );
        })}
      </div>
      {state?.error && (
        <div className="mt-4">
          <FormMessage state={{ error: state.error }} />
        </div>
      )}
    </div>
  );
}
