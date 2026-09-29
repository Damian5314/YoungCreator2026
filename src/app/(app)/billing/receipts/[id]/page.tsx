import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { PrintButton } from '@/components/billing/PrintButton';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { intlLocale } from '@/i18n/config';
import { getLocale, getT } from '@/i18n/server';
import { getCurrentUser, getPayment, getProfile } from '@/lib/data/queries';
import { findPack, formatMoney, VAT_RATE_PERCENT, vatPart, type CreditPackId } from '@/modules/billing/plans';
import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).billing.receipt.metaTitle };
}

// Betaalbewijs van een betaald creditpakket: printbaar, met btw-uitsplitsing en de gegevens van TechTable
export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [t, locale, payment, user, profile] = await Promise.all([getT(), getLocale(), getPayment(id), getCurrentUser(), getProfile()]);
  if (!payment || payment.status !== 'paid') notFound();

  const r = t.billing.receipt;
  const pack = findPack(payment.packId);
  const packName = pack ? t.billing.packs[pack.id as CreditPackId].name : t.billing.history.creditPack;
  const vat = vatPart(payment.amountCents);
  const date = new Intl.DateTimeFormat(intlLocale[locale], { dateStyle: 'long' }).format(new Date(payment.paidAt ?? payment.createdAt));
  const money = (cents: number) => formatMoney(cents, locale);
  const row = 'flex justify-between gap-4 py-2';

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <ButtonLink href="/billing" variant="ghost" size="sm">
          <ArrowLeft className="size-4" aria-hidden />
          {r.back}
        </ButtonLink>
        <PrintButton label={r.print} />
      </div>

      <Card className="p-6 sm:p-10 print:border-0 print:p-0 print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{r.title}</h1>
            <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
              <div>
                <dt className="inline">{r.number}: </dt>
                {/* Het betalings-id is uniek en staat ook in de administratie bij Mollie */}
                <dd className="inline font-mono">{payment.id.slice(0, 8).toUpperCase()}</dd>
              </div>
              <div>
                <dt className="inline">{r.date}: </dt>
                <dd className="inline">{date}</dd>
              </div>
            </dl>
          </div>
          <div className="text-sm sm:text-right">
            <p className="font-semibold">{r.seller}</p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {COMPANY.legalName} ({COMPANY.product})
              <br />
              {COMPANY_ADDRESS}
              <br />
              KvK {COMPANY.kvk} · {t.landing.footer.vat} {COMPANY.vatId}
              <br />
              {COMPANY.email}
            </p>
          </div>
        </div>

        <div className="mt-8 text-sm">
          <p className="font-semibold">{r.customer}</p>
          <p className="mt-1 text-muted-foreground">
            {profile?.fullName && (
              <>
                {profile.fullName}
                <br />
              </>
            )}
            {user?.email}
          </p>
        </div>

        <div className="mt-8 border-t border-border text-sm">
          <div className={`${row} border-b border-border font-medium`}>
            <span>{r.item}</span>
            <span className="tabular-nums">{money(payment.amountCents)}</span>
          </div>
          <p className="py-2 text-muted-foreground">{r.itemLine(packName, payment.credits)}</p>
          <div className={`${row} border-t border-border text-muted-foreground`}>
            <span>{r.subtotal}</span>
            <span className="tabular-nums">{money(payment.amountCents - vat)}</span>
          </div>
          <div className={`${row} text-muted-foreground`}>
            <span>{r.vat(VAT_RATE_PERCENT)}</span>
            <span className="tabular-nums">{money(vat)}</span>
          </div>
          <div className={`${row} border-t border-border text-base font-semibold`}>
            <span>{r.total}</span>
            <span className="tabular-nums">{money(payment.amountCents)}</span>
          </div>
          {payment.refundedCents > 0 && (
            <p className="py-2 font-medium text-danger">{r.refunded(money(payment.refundedCents))}</p>
          )}
          <p className="pt-2 text-muted-foreground">{r.paidVia}</p>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{r.note}</p>
      </Card>
    </div>
  );
}
