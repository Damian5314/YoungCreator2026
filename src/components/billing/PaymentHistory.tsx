import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import type { PaymentData, PaymentStatus } from '@/lib/data/queries';
import { findPack, formatMoney } from '@/modules/billing/plans';

const STATUS: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  paid: { label: 'Paid', tone: 'success' },
  open: { label: 'Not completed', tone: 'neutral' },
  pending: { label: 'Processing', tone: 'neutral' },
  authorized: { label: 'Processing', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'warning' },
  canceled: { label: 'Canceled', tone: 'warning' },
  expired: { label: 'Expired', tone: 'warning' },
};

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function PaymentHistory({ payments }: { payments: PaymentData[] }) {
  return (
    <Card>
      <CardHeader title="Payment history" description="Your credit purchases. Payments are handled securely by Mollie." />
      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No purchases yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {payments.map((payment) => {
            const status = STATUS[payment.status] ?? STATUS.open;
            return (
              <li key={payment.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">
                    {findPack(payment.packId)?.name ?? 'Credit pack'} · {payment.credits} credits
                  </p>
                  <p className="text-muted-foreground">{dateFormat.format(new Date(payment.createdAt))}</p>
                </div>
                <div className="flex items-center gap-2">
                  {payment.mode === 'test' && <Badge>Test</Badge>}
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <span className="w-20 text-right font-medium tabular-nums">{formatMoney(payment.amountCents)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
