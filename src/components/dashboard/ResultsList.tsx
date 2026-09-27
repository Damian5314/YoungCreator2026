'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { useT } from '@/i18n/I18nProvider';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';

type TypeFilter = OpportunityType | 'all';
// "all" = alles behalve "niet interessant"; die staan onder hun eigen filter
type StatusFilter = OpportunityStatus | 'all';

const STATUSES: OpportunityStatus[] = ['new', 'reviewed', 'saved', 'applied', 'rejected'];
// Het dashboard toont er eerst een paar, zodat profiel, schema en activiteit (op kleinere schermen
// onder de lijst) bereikbaar blijven. De volledige lijst staat op /opportunities.
const PAGE_SIZE = 8;

// Nieuwste kansen op het dashboard, filterbaar op status en soort (beste match eerst)
export function ResultsList({ opportunities }: { opportunities: Opportunity[] }) {
  const t = useT();
  const h = t.dashboard.home;
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [shown, setShown] = useState(PAGE_SIZE);

  // Een ander filter begint weer met de eerste paar kansen
  function filterStatus(status: StatusFilter) {
    setStatusFilter(status);
    setShown(PAGE_SIZE);
  }
  function filterType(type: TypeFilter) {
    setTypeFilter(type);
    setShown(PAGE_SIZE);
  }

  // Alleen soorten tonen die ook echt in de resultaten voorkomen
  const availableTypes = (Object.keys(t.common.opportunityTypes) as OpportunityType[]).filter((type) =>
    opportunities.some((o) => o.type === type),
  );

  const visible = opportunities
    .filter((o) => typeFilter === 'all' || o.type === typeFilter)
    .filter((o) => (statusFilter === 'all' ? o.status !== 'rejected' : o.status === statusFilter))
    .sort((a, b) => b.matchScore - a.matchScore);

  const typeChip = (selected: boolean) =>
    `inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      selected ? 'bg-foreground/[0.07] text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <section aria-labelledby="latest-title">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="latest-title" className="text-lg font-semibold tracking-tight">
          {h.latest} <span className="font-normal text-muted-foreground">({visible.length})</span>
        </h2>
        <Link href="/opportunities" className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {h.viewAll}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>

      {/* Mobiel: één rij die horizontaal scrollt, in plaats van meerdere regels */}
      <div
        role="group"
        aria-label={h.statusFilter}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        <Chip selected={statusFilter === 'all'} onClick={() => filterStatus('all')} className="shrink-0">
          {h.statusAll}
        </Chip>
        {STATUSES.map((status) => (
          <Chip key={status} selected={statusFilter === status} onClick={() => filterStatus(status)} className="shrink-0">
            {t.common.opportunityStatuses[status]}
          </Chip>
        ))}
      </div>

      {availableTypes.length > 1 && (
        <div
          role="group"
          aria-label={h.typeFilter}
          className="-mx-4 mt-2 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <button type="button" aria-pressed={typeFilter === 'all'} onClick={() => filterType('all')} className={typeChip(typeFilter === 'all')}>
            {t.dashboard.results.allTypes}
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={typeFilter === type}
              onClick={() => filterType(type)}
              className={typeChip(typeFilter === type)}
            >
              {t.common.opportunityTypes[type]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {visible.slice(0, shown).map((opportunity, index) => (
          <div key={opportunity.id} className="motion-safe:animate-fade-up" style={{ animationDelay: `${Math.min(index, 6) * 60 + 420}ms` }}>
            <OpportunityCard opportunity={opportunity} />
          </div>
        ))}
        {visible.length === 0 && (
          <Card className="text-center text-sm text-muted-foreground">{t.dashboard.results.noMatches}</Card>
        )}
      </div>

      {visible.length > shown && (
        <Button variant="secondary" onClick={() => setShown((count) => count + PAGE_SIZE)} className="mt-4 w-full">
          {t.dashboard.results.showMore(visible.length - shown)}
        </Button>
      )}
    </section>
  );
}
