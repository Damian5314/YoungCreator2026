'use client';

import Link from 'next/link';
import { ExternalLink, Radar, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useLocale, useT } from '@/i18n/I18nProvider';
import type { Opportunity } from '@/shared/types/Opportunity';
import { formatDateTime, formatRelativeDay } from '@/shared/utils/formatDate';
import { MatchActions } from './MatchActions';

const MAX_SKILLS = 3;

// Geen hooks: wordt ook door de (server) detailpagina gerenderd, die het vertaalde label meegeeft
export function MatchScore({ score, label }: { score: number; label: string }) {
  const tone =
    score >= 80 ? 'bg-success-soft text-success' : score >= 65 ? 'bg-warning-soft text-warning' : 'bg-muted text-muted-foreground';

  return (
    <div className={`flex size-14 shrink-0 flex-col items-center justify-center rounded-xl sm:size-[60px] ${tone}`}>
      <span className="text-xl font-bold leading-none tabular-nums">{score}</span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

/**
 * Compacte, horizontale kanskaart (overal dezelfde): links de matchscore, in het midden wat het is,
 * waarom het past en waarom nu, rechts de acties. Op telefoons komen de acties eronder.
 */
export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const t = useT();
  const locale = useLocale();
  const c = t.opportunities.card;
  const skills = opportunity.requiredSkills;
  const meta = [
    opportunity.location,
    opportunity.remote ? c.remotePossible : null,
    opportunity.startsAt ? formatDateTime(opportunity.startsAt, locale) : null,
  ].filter(Boolean);

  return (
    <article
      className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-card border border-[rgb(16_24_32/0.08)] bg-card p-4 shadow-[0_1px_2px_rgb(16_24_32/0.04)] transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-soft sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5 ${
        opportunity.status === 'rejected' ? 'opacity-60' : ''
      }`}
    >
      <MatchScore score={opportunity.matchScore} label={t.matches.score.label} />

      <div className="min-w-0">
        {/* Maximaal drie labels: status, soort en eventueel verborgen kans */}
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge kind="opportunity" status={opportunity.status}>
            {t.common.opportunityStatuses[opportunity.status]}
          </StatusBadge>
          <Badge>{t.common.opportunityTypes[opportunity.type]}</Badge>
          {opportunity.isHidden && (
            <span className="inline-flex items-center gap-1 rounded-full border border-selected-border bg-selected px-2.5 py-0.5 text-xs font-medium text-selected-foreground">
              <Radar className="size-3 text-primary" aria-hidden />
              {t.matches.card.hiddenOpportunity}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-[16.5px] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={`/matches/${opportunity.id}`} className="hover:underline">
            {opportunity.title}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {opportunity.companyId ? (
            <Link href={`/companies/${opportunity.companyId}`} className="font-medium text-foreground hover:underline">
              {opportunity.company}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{opportunity.company}</span>
          )}
          {meta.map((item) => (
            <span key={item}> · {item}</span>
          ))}
        </p>

        {opportunity.matchReasons[0] ? (
          <p className="mt-2 flex items-start gap-1.5 text-sm">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="line-clamp-2 sm:line-clamp-1">{opportunity.matchReasons[0]}</span>
          </p>
        ) : (
          opportunity.description && <p className="mt-2 line-clamp-2 text-sm">{opportunity.description}</p>
        )}
        {opportunity.signals[0] && (
          <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
            <TrendingUp className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">
              <span className="font-medium text-foreground">{c.whyNow}</span> {opportunity.signals[0]}
            </span>
          </p>
        )}

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.slice(0, MAX_SKILLS).map((skill) => (
              <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {skill}
              </span>
            ))}
            {skills.length > MAX_SKILLS && (
              <span className="rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground">
                {c.moreSkills(skills.length - MAX_SKILLS)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:pt-0">
        <MatchActions matchId={opportunity.id} status={opportunity.status} outreachStatus={opportunity.outreachStatus} />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span suppressHydrationWarning>
            {formatRelativeDay(opportunity.discoveredAt, locale)} · {t.common.opportunitySources[opportunity.source]}
          </span>
          <a
            href={opportunity.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={c.viewSource}
            title={c.viewSource}
            className="rounded p-0.5 text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </p>
      </div>
    </article>
  );
}
