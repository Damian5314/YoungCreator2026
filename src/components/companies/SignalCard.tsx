'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { useLocale, useT } from '@/i18n/I18nProvider';
import type { CompanySignal } from '@/modules/companies/companies';
import { formatRelativeDay } from '@/shared/utils/formatDate';
import { SignalTag } from './SignalTag';

interface SignalCardProps {
  signal: CompanySignal;
  /** Waarom dit voor de student telt: de matchreden van de kans bij dit signaal. */
  relevance?: string;
}

/**
 * Een bedrijfssignaal is nooit alleen decoratie. Elke kaart beantwoordt: wat gebeurde er,
 * waarom doet het ertoe, waarom is het relevant voor jou, en wat kun je nu doen.
 */
export function SignalCard({ signal, relevance }: SignalCardProps) {
  const t = useT();
  const s = t.signals;
  const locale = useLocale();

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SignalTag kind={signal.kind} />
        <span className="text-xs text-muted-foreground" suppressHydrationWarning>
          {s.spotted(formatRelativeDay(signal.spottedAt, locale))}
        </span>
      </div>

      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="sr-only">{s.whatHappened}</dt>
          <dd className="font-semibold leading-snug">{signal.text}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">{s.whyItMatters}</dt>
          <dd>{s.kinds[signal.kind].why}</dd>
        </div>
        {relevance && (
          <div>
            <dt className="text-xs font-medium text-muted-foreground">{s.whyForYou}</dt>
            <dd>{relevance}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
        <Link href={`/matches/${signal.opportunityId}`} className="inline-flex items-center gap-1 text-primary hover:underline">
          {t.companies.detail.signals.viewOpportunity}
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        <Link
          href={`/matches/${signal.opportunityId}#reach-out`}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Mail className="size-3.5" aria-hidden />
          {t.companies.card.reachOut}
        </Link>
      </div>
    </article>
  );
}
