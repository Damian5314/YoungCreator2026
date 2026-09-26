'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OPPORTUNITY_STATUS_LABELS, OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';

type TypeFilter = OpportunityType | 'all';
type StatusFilter = OpportunityStatus | 'all';

// Overzicht van alle resultaten uit de searches, filterbaar op type en status
export function ResultsList({ opportunities }: { opportunities: Opportunity[] }) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Alleen types tonen die ook echt in de resultaten voorkomen
  const availableTypes = (Object.keys(OPPORTUNITY_TYPE_LABELS) as OpportunityType[]).filter((type) =>
    opportunities.some((o) => o.type === type),
  );

  const visible = opportunities
    .filter((o) => typeFilter === 'all' || o.type === typeFilter)
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)
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
          className="h-9 rounded-lg border border-input bg-card px-2 text-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          <option value="all">All statuses</option>
          {(Object.keys(OPPORTUNITY_STATUS_LABELS) as OpportunityStatus[]).map((status) => (
            <option key={status} value={status}>
              {OPPORTUNITY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Chip selected={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
          All types
        </Chip>
        {availableTypes.map((type) => (
          <Chip key={type} selected={typeFilter === type} onClick={() => setTypeFilter(type)}>
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
