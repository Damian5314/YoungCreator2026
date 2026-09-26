import { Building, ExternalLink, MapPin, Radar } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import {
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_TYPE_LABELS,
} from '@/shared/constants/opportunityTypes';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus } from '@/shared/types/OpportunityType';
import { formatShortDate } from '@/shared/utils/formatDate';

const STATUS_TONES: Record<OpportunityStatus, BadgeTone> = {
  new: 'success',
  reviewed: 'neutral',
  saved: 'warning',
  applied: 'primary',
  rejected: 'neutral',
};

function MatchScore({ score }: { score: number }) {
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
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start gap-4">
        <MatchScore score={opportunity.matchScore} />
        <div className="min-w-0 flex-1">
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
          <h3 className="mt-2 font-semibold leading-snug">{opportunity.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building className="size-3.5" aria-hidden />
              {opportunity.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {opportunity.location}
            </span>
          </p>
          <p className="mt-3 text-sm">{opportunity.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map((skill) => (
              <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
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
      </div>
    </article>
  );
}
