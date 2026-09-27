'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Radar, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { useT } from '@/i18n/I18nProvider';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';

// Soorten kansen gebundeld tot de filters bovenaan de pagina
const CATEGORIES = {
  jobs: ['job', 'traineeship', 'working-student', 'part-time', 'freelance'],
  internships: ['internship', 'thesis'],
  events: ['event', 'hackathon', 'conference', 'networking'],
  openApplications: ['open-application'],
  more: ['startup', 'project', 'research'],
} satisfies Record<string, OpportunityType[]>;

type Category = keyof typeof CATEGORIES | 'all';
type StatusFilter = OpportunityStatus | 'all' | 'active';

export interface CompanyIndexEntry {
  name: string;
  text: string; // naam, branche, plaats en signalen, om op te zoeken
}

function matchesQuery(opportunity: Opportunity, query: string, typeLabel: string): boolean {
  const haystack = [
    opportunity.title,
    opportunity.company,
    opportunity.location,
    typeLabel,
    opportunity.companyIndustry ?? '',
    ...opportunity.requiredSkills,
    ...opportunity.signals,
  ]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

interface OpportunityBrowserProps {
  opportunities: Opportunity[];
  initialQuery: string;
  companyIndex: CompanyIndexEntry[];
}

// Alle kansen, te filteren op soort, status, verborgen kansen en een zoekterm (ook uit de bovenbalk)
export function OpportunityBrowser({ opportunities, initialQuery, companyIndex }: OpportunityBrowserProps) {
  const t = useT();
  const o = t.opportunities;
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category>('all');
  const [status, setStatus] = useState<StatusFilter>('active');
  const [hiddenOnly, setHiddenOnly] = useState(false);

  // Zoekterm in de url bijhouden, zodat je de lijst kunt delen of terugkomen
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [query]);

  const trimmed = query.trim();
  const searched = trimmed
    ? opportunities.filter((item) => matchesQuery(item, trimmed, t.common.opportunityTypes[item.type]))
    : opportunities;
  const inCategory = (item: Opportunity, key: Category) =>
    key === 'all' || (CATEGORIES[key] as OpportunityType[]).includes(item.type);

  const visible = searched
    .filter((item) => inCategory(item, category))
    .filter((item) => status === 'all' || (status === 'active' ? item.status !== 'rejected' : item.status === status))
    .filter((item) => !hiddenOnly || item.isHidden)
    .sort((a, b) => b.matchScore - a.matchScore);

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const companyMatches = words.length
    ? companyIndex.filter((company) => words.every((word) => company.text.includes(word))).length
    : 0;

  const filtered = category !== 'all' || status !== 'active' || hiddenOnly || trimmed !== '';

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setStatus('active');
    setHiddenOnly(false);
  }

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="opportunity-search" className="sr-only">
            {o.page.searchLabel}
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="opportunity-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={o.page.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-base focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary sm:text-sm"
          />
        </div>
        <select
          aria-label={t.dashboard.results.filterByStatus}
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          className="h-10 rounded-lg border border-input bg-card px-2 text-base focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
        >
          <option value="active">{t.dashboard.results.allExceptRejected}</option>
          <option value="all">{t.dashboard.results.allStatuses}</option>
          {(Object.keys(t.common.opportunityStatuses) as OpportunityStatus[]).map((value) => (
            <option key={value} value={value}>
              {t.common.opportunityStatuses[value]}
            </option>
          ))}
        </select>
      </div>

      {/* Mobiel: één rij die horizontaal scrollt, in plaats van meerdere regels */}
      <div
        role="group"
        aria-label={o.categories.label}
        className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {(['all', ...Object.keys(CATEGORIES)] as Category[]).map((key) => (
          <Chip key={key} selected={category === key} onClick={() => setCategory(key)} className="shrink-0">
            {o.categories[key]}
            <span className="text-xs tabular-nums opacity-70">{searched.filter((item) => inCategory(item, key)).length}</span>
          </Chip>
        ))}
        <Chip selected={hiddenOnly} onClick={() => setHiddenOnly((value) => !value)} className="shrink-0">
          <Radar className="size-3.5" aria-hidden />
          {o.hiddenOnly}
        </Chip>
      </div>

      {companyMatches > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {o.page.companiesMatch(companyMatches, trimmed)}
          <Link
            href={`/companies?q=${encodeURIComponent(trimmed)}`}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            {o.page.viewCompanies}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </p>
      )}

      <h2 className="sr-only" aria-live="polite">
        {t.opportunities.page.title} ({visible.length})
      </h2>
      <div className="mt-5 space-y-3">
        {visible.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
        {visible.length === 0 && (
          <Card className="text-center text-sm text-muted-foreground">
            {o.noMatches}{' '}
            {filtered && (
              <button type="button" onClick={clearFilters} className="font-medium text-primary hover:underline">
                {o.clearFilters}
              </button>
            )}
          </Card>
        )}
      </div>
    </section>
  );
}
