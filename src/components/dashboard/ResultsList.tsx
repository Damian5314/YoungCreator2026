'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { useT } from '@/i18n/I18nProvider';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';

type TypeFilter = OpportunityType | 'all';
type StatusFilter = OpportunityStatus | 'all' | 'active';

// Overzicht van alle resultaten uit de searches, filterbaar op type en status
export function ResultsList({ opportunities }: { opportunities: Opportunity[] }) {
  const t = useT();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  // Alleen types tonen die ook echt in de resultaten voorkomen
  const availableTypes = (Object.keys(t.common.opportunityTypes) as OpportunityType[]).filter((type) =>
    opportunities.some((o) => o.type === type),
  );

  const visible = opportunities
    .filter((o) => typeFilter === 'all' || o.type === typeFilter)
    .filter((o) => statusFilter === 'all' || (statusFilter === 'active' ? o.status !== 'rejected' : o.status === statusFilter))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">
          {t.dashboard.results.title} <span className="font-normal text-muted-foreground">({visible.length})</span>
        </h2>
        <select
          aria-label={t.dashboard.results.filterByStatus}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="h-9 rounded-lg border border-input bg-card px-2 text-base focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
        >
          <option value="active">{t.dashboard.results.allExceptRejected}</option>
          <option value="all">{t.dashboard.results.allStatuses}</option>
          {(Object.keys(t.common.opportunityStatuses) as OpportunityStatus[]).map((status) => (
            <option key={status} value={status}>
              {t.common.opportunityStatuses[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Mobiel: één rij die horizontaal scrollt tot de schermrand, in plaats van meerdere regels */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        <Chip selected={typeFilter === 'all'} onClick={() => setTypeFilter('all')} className="shrink-0">
          {t.dashboard.results.allTypes}
        </Chip>
        {availableTypes.map((type) => (
          <Chip key={type} selected={typeFilter === type} onClick={() => setTypeFilter(type)} className="shrink-0">
            {t.common.opportunityTypes[type]}
          </Chip>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
        {visible.length === 0 && (
          <Card className="text-center text-sm text-muted-foreground">{t.dashboard.results.noMatches}</Card>
        )}
      </div>
    </section>
  );
}
