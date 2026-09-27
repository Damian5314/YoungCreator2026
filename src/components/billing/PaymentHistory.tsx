import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { intlLocale } from '@/i18n/config';
import { getLocale, getT } from '@/i18n/server';
import type { PaymentData, PaymentStatus } from '@/lib/data/queries';
import { findPack, formatMoney, type CreditPackId } from '@/modules/billing/plans';

const STATUS_TONE: Record<PaymentStatus, BadgeTone> = {
  paid: 'success',
  open: 'neutral',
  pending: 'neutral',
  authorized: 'neutral',
  failed: 'warning',
  canceled: 'warning',
  expired: 'warning',
};

export async function PaymentHistory({ payments }: { payments: PaymentData[] }) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const h = t.billing.history;
  const dateFormat = new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Card>
      <CardHeader title={h.title} description={h.description} />
      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{h.empty}</p>
      ) : (
        <ul className="divide-y divide-border">
          {payments.map((payment) => {
            const statusKey = payment.status in STATUS_TONE ? payment.status : 'open';
            const pack = findPack(payment.packId);
            const packName = pack ? t.billing.packs[pack.id as CreditPackId].name : h.creditPack;
            return (
              <li key={payment.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{h.item(packName, payment.credits)}</p>
                  <p className="text-muted-foreground">{dateFormat.format(new Date(payment.createdAt))}</p>
                </div>
                <div className="flex items-center gap-2">
                  {payment.mode === 'test' && <Badge>{h.test}</Badge>}
                  <Badge tone={STATUS_TONE[statusKey]}>{h.statuses[statusKey]}</Badge>
                  <span className="w-20 text-right font-medium tabular-nums">{formatMoney(payment.amountCents, locale)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
