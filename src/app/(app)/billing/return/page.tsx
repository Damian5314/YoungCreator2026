import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CircleCheck, CircleX, Clock, Coins, Search } from 'lucide-react';
import { PaymentStatusPoller } from '@/components/billing/PaymentStatusPoller';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getCreditBalance, getCurrentUser } from '@/lib/data/queries';
import { confirmPaymentForUser } from '@/modules/billing/billingService';
import { findPack, formatMoney } from '@/modules/billing/plans';

export const metadata: Metadata = { title: 'Payment' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Hier komt de student terug na de Mollie-checkout. We vragen de status zelf op bij Mollie
// (de URL bewijst niets), en schrijven bij 'paid' de credits bij (idempotent, net als de webhook).
export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const [{ payment: paymentId }, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect('/login');
  if (!paymentId || !UUID.test(paymentId)) redirect('/billing');

  const payment = await confirmPaymentForUser(user.id, paymentId);
  if (!payment) redirect('/billing');

  const credits = await getCreditBalance();
  const pack = findPack(payment.packId);
  const summary = `${pack?.name ?? 'Credit pack'} · ${payment.credits} credits · ${formatMoney(payment.amountCents)}`;

  if (payment.status === 'paid') {
    return (
      <Card className="mx-auto max-w-lg py-10 text-center">
        <CircleCheck className="mx-auto size-10 text-success" aria-hidden />
        <h1 className="mt-4 text-xl font-semibold">Payment received</h1>
        <p className="mt-2 text-muted-foreground">
          {payment.credits} credits were added to your account. Automations are unlocked.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary-soft-foreground">
          <Coins className="size-4" aria-hidden />
          Balance: {credits} {credits === 1 ? 'credit' : 'credits'}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">{summary}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/search">
            <Search className="size-4" aria-hidden />
            Start a search
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">
            Go to dashboard
          </ButtonLink>
        </div>
      </Card>
    );
  }

  const stillProcessing = payment.status === 'open' || payment.status === 'pending' || payment.status === 'authorized';
  if (stillProcessing) {
    return (
      <Card className="mx-auto max-w-lg py-10 text-center">
        <PaymentStatusPoller />
        <Clock className="mx-auto size-10 text-muted-foreground" aria-hidden />
        <h1 className="mt-4 text-xl font-semibold">Waiting for your payment</h1>
        <p className="mt-2 text-muted-foreground">
          We&apos;re checking with Mollie. This page updates by itself. Closed the payment page? You can pick a pack again.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">{summary}</p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/billing" variant="secondary">
            Back to credits
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg py-10 text-center">
      <CircleX className="mx-auto size-10 text-warning" aria-hidden />
      <h1 className="mt-4 text-xl font-semibold">
        {payment.status === 'canceled' ? 'Payment canceled' : payment.status === 'expired' ? 'Payment expired' : 'Payment failed'}
      </h1>
      <p className="mt-2 text-muted-foreground">Nothing was charged. You can try again whenever you like.</p>
      <p className="mt-3 text-xs text-muted-foreground">{summary}</p>
      <div className="mt-6 flex justify-center">
        <ButtonLink href="/billing">Try again</ButtonLink>
      </div>
    </Card>
  );
}
