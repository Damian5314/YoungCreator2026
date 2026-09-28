import Link from 'next/link';
import { getT } from '@/i18n/server';
import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';

const textLink =
  'rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

/** Afsluitend blok op privacy, voorwaarden en FAQ: waar je terechtkunt met vragen, plus de bedrijfsgegevens. */
export async function SupportCard() {
  const t = await getT();
  const s = t.support.card;

  return (
    <section className="mt-14 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold">{s.title}</h2>
      <p className="mt-2 text-muted-foreground">
        {s.body}{' '}
        <Link href="/contact" className={textLink}>
          {s.contactLink}
        </Link>
      </p>
      <p className="mt-3 text-muted-foreground">
        <a href={`mailto:${COMPANY.email}`} className={textLink}>
          {COMPANY.email}
        </a>
        <span aria-hidden> · </span>
        <a href={COMPANY.phoneHref} className={textLink}>
          {COMPANY.phone}
        </a>
      </p>
      <h3 className="mt-6 text-sm font-semibold">{t.legal.labels.companyDetails}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {COMPANY.legalName} · {COMPANY_ADDRESS}
        <br />
        KvK {COMPANY.kvk} · {t.landing.footer.vat} {COMPANY.vatId}
      </p>
    </section>
  );
}
