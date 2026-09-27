'use client';

import Link from 'next/link';
import { ArrowRight, Radar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MatchScore } from '@/components/opportunities/OpportunityCard';
import { useLocale, useT } from '@/i18n/I18nProvider';
import { companyMeta, reachOutHref, type CompanySummary } from '@/modules/companies/companies';
import { formatRelativeDay } from '@/shared/utils/formatDate';
import { CompanyActions } from './CompanyActions';
import { CompanyMark } from './CompanyMark';
import { SignalTag } from './SignalTag';
import { relationshipOf, useCompanyRelations } from './useCompanyRelations';

/**
 * Bedrijfskaart: wie het is, hoe goed het past, wat er gebeurt (signalen), waarom je het ziet
 * en wat je kunt doen. Maximaal drie labels, zodat de kaart rustig blijft.
 */
export function CompanyCard({ company }: { company: CompanySummary }) {
  const t = useT();
  const c = t.companies;
  const locale = useLocale();
  const { relations } = useCompanyRelations();
  const relationship = relationshipOf(company, relations[company.id]);
  const latest = company.signals[0];

  // Eén label per soort signaal; een verborgen kans gaat voor
  const kinds = [...new Set(company.signals.map((signal) => signal.kind))].slice(0, company.hasHidden ? 2 : 3);

  return (
    <article className="flex flex-col rounded-card border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <CompanyMark name={company.name} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-snug">
            <Link href={`/companies/${company.id}`} className="hover:underline">
              {company.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {companyMeta(company, company.type ? c.types[company.type] : undefined)}
          </p>
        </div>
        <MatchScore score={company.fitScore} label={c.fit} />
      </div>

      {(company.hasHidden || kinds.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {company.hasHidden && (
            <Badge tone="primary">
              <Radar className="size-3" aria-hidden />
              {t.matches.card.hiddenOpportunity}
            </Badge>
          )}
          {kinds.map((kind) => (
            <SignalTag key={kind} kind={kind} />
          ))}
        </div>
      )}

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">{c.card.whyYoureSeeingThis}</dt>
          <dd className="mt-0.5 line-clamp-2">
            {company.whyYoureSeeingThis ?? c.card.fallbackWhy(company.opportunities.length)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">{c.card.latestSignal}</dt>
          <dd className="mt-0.5">
            {latest ? (
              <>
                <span className="font-medium" suppressHydrationWarning>
                  {formatRelativeDay(latest.spottedAt, locale)} · {t.signals.kinds[latest.kind].label}
                </span>
                <span className="line-clamp-1 text-muted-foreground">{latest.text}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{c.card.noSignals}</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-4">
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge kind="company" status={relationship}>
            {c.relationship[relationship]}
          </StatusBadge>
          {c.card.opportunities(company.opportunities.length)}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <ButtonLink href={`/companies/${company.id}`} size="sm">
            {c.card.viewCompany}
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href={reachOutHref(company)} variant="secondary" size="sm">
            {c.card.reachOut}
          </ButtonLink>
          <CompanyActions company={company} />
        </div>
      </div>
    </article>
  );
}
