import Link from 'next/link';
import { Building, CalendarDays, ExternalLink, MapPin, Radar, Sparkles, TrendingUp, UserRound } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import {
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_TYPE_LABELS,
} from '@/shared/constants/opportunityTypes';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus } from '@/shared/types/OpportunityType';
import { formatDateTime, formatShortDate } from '@/shared/utils/formatDate';
import { MatchActions } from './MatchActions';

export const STATUS_TONES: Record<OpportunityStatus, BadgeTone> = {
  new: 'success',
  reviewed: 'neutral',
  saved: 'warning',
  applied: 'primary',
  rejected: 'neutral',
};

export function MatchScore({ score }: { score: number }) {
  const tone =
    score >= 80 ? 'bg-success-soft text-success' : score >= 65 ? 'bg-warning-soft text-warning' : 'bg-muted text-muted-foreground';

  return (
    <div className={`flex size-14 shrink-0 flex-col items-center justify-center rounded-xl ${tone}`}>
      <span className="text-lg font-bold leading-none">{score}</span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide">match</span>
    </div>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const location = opportunity.remote ? `${opportunity.location || 'Remote'}${opportunity.location ? ' · remote' : ''}` : opportunity.location;

  return (
    <article
      className={`rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 ${
        opportunity.status === 'rejected' ? 'opacity-60' : ''
      }`}
    >
      {/* Mobiel: score zweeft rechtsboven zodat de inhoud de volle breedte krijgt; vanaf sm een eigen kolom */}
      <div className="flow-root sm:flex sm:items-start sm:gap-4">
        <div className="float-right mb-2 ml-3 sm:float-none sm:m-0">
          <MatchScore score={opportunity.matchScore} />
        </div>
        <div className="min-w-0 sm:flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={STATUS_TONES[opportunity.status]}>{OPPORTUNITY_STATUS_LABELS[opportunity.status]}</Badge>
            <Badge>{OPPORTUNITY_TYPE_LABELS[opportunity.type]}</Badge>
            {opportunity.isHidden && (
              <Badge tone="primary">
                <Radar className="size-3" aria-hidden />
                Hidden opportunity
              </Badge>
            )}
          </div>
          <h3 className="mt-2 font-semibold leading-snug">
            <Link href={`/matches/${opportunity.id}`} className="hover:underline">
              {opportunity.title}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building className="size-3.5" aria-hidden />
              {opportunity.company}
            </span>
            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                {location}
              </span>
            )}
            {opportunity.startsAt && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" aria-hidden />
                {formatDateTime(opportunity.startsAt)}
              </span>
            )}
            {opportunity.contact?.name && (
              <span className="flex items-center gap-1.5">
                <UserRound className="size-3.5" aria-hidden />
                {opportunity.contact.name}
                {opportunity.contact.role ? `, ${opportunity.contact.role}` : ''}
              </span>
            )}
          </p>

          {opportunity.matchReasons.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {opportunity.matchReasons.slice(0, 3).map((reason) => (
                <li key={reason} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                  {reason}
                </li>
              ))}
            </ul>
          )}
          {opportunity.signals.length > 0 && (
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <TrendingUp className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                <span className="font-medium text-foreground">Why now:</span> {opportunity.signals.join(' · ')}
              </span>
            </p>
          )}
          {opportunity.matchReasons.length === 0 && opportunity.description && (
            <p className="mt-3 line-clamp-3 text-sm">{opportunity.description}</p>
          )}

          {opportunity.requiredSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {opportunity.requiredSkills.map((skill) => (
                <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <MatchActions matchId={opportunity.id} status={opportunity.status} outreachStatus={opportunity.outreachStatus} />
        <span className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Found via {OPPORTUNITY_SOURCE_LABELS[opportunity.source]} · {formatShortDate(opportunity.discoveredAt)}
          </span>
          <a
            href={opportunity.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 font-medium text-primary hover:underline"
          >
            View
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </span>
      </div>
    </article>
  );
}
