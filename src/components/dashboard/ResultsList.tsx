'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OPPORTUNITY_STATUS_LABELS, OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';

type TypeFilter = OpportunityType | 'all';
type StatusFilter = OpportunityStatus | 'all' | 'active';

// Overzicht van alle resultaten uit de searches, filterbaar op type en status
export function ResultsList({ opportunities }: { opportunities: Opportunity[] }) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  // Alleen types tonen die ook echt in de resultaten voorkomen
  const availableTypes = (Object.keys(OPPORTUNITY_TYPE_LABELS) as OpportunityType[]).filter((type) =>
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
          Results <span className="font-normal text-muted-foreground">({visible.length})</span>
        </h2>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="h-9 rounded-lg border border-input bg-card px-2 text-base focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
        >
          <option value="active">All except not interested</option>
          <option value="all">All statuses</option>
          {(Object.keys(OPPORTUNITY_STATUS_LABELS) as OpportunityStatus[]).map((status) => (
            <option key={status} value={status}>
              {OPPORTUNITY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Mobiel: één rij die horizontaal scrollt tot de schermrand, in plaats van meerdere regels */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        <Chip selected={typeFilter === 'all'} onClick={() => setTypeFilter('all')} className="shrink-0">
          All types
        </Chip>
        {availableTypes.map((type) => (
          <Chip key={type} selected={typeFilter === type} onClick={() => setTypeFilter(type)} className="shrink-0">
            {OPPORTUNITY_TYPE_LABELS[type]}
          </Chip>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
        {visible.length === 0 && (
          <Card className="text-center text-sm text-muted-foreground">No results match these filters.</Card>
        )}
      </div>
    </section>
  );
}
