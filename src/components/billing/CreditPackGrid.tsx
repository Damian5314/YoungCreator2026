'use client';

import { useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormMessage } from '@/components/ui/FormMessage';
import { useLocale, useT } from '@/i18n/I18nProvider';
import { buyCredits } from '@/lib/actions/billing';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { CREDIT_PACKS, formatMoney, pricePerCredit } from '@/modules/billing/plans';

// Creditpakketten. "Buy" maakt een Mollie-betaling aan en stuurt door naar de Mollie-checkout.
export function CreditPackGrid({ paymentsEnabled }: { paymentsEnabled: boolean }) {
  const t = useT();
  const locale = useLocale();
  const g = t.billing.grid;
  const included = [g.included.searches, g.included.automations, g.included.noExpiry];
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CREDIT_PACKS.map((pack) => {
          const popular = 'popular' in pack && pack.popular;
          const busy = pending && chosen === pack.id;
          return (
            <Card key={pack.id} className={`flex flex-col ${popular ? 'border-primary ring-1 ring-primary' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{t.billing.packs[pack.id].name}</h3>
                {popular && <Badge tone="primary">{g.mostPopular}</Badge>}
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{formatMoney(pack.amountCents, locale)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {g.searchesPrice(pack.credits, pricePerCredit(pack, locale))}
              </p>
              <p className="mt-3 text-sm">{t.billing.packs[pack.id].description}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                {included.map((item) => (
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
                {busy ? g.opening : g.buy(pack.credits)}
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
