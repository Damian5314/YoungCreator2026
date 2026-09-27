'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { useT } from '@/i18n/I18nProvider';
import type { CompanySummary } from '@/modules/companies/companies';
import { CompanyCard } from './CompanyCard';
import { isCompanySaved, relationshipOf, useCompanyRelations, type LocalRelation } from './useCompanyRelations';

type Filter = 'forYou' | 'saved' | 'following' | 'contacted' | 'growing' | 'hidden';

const FILTERS: Filter[] = ['forYou', 'saved', 'following', 'contacted', 'growing', 'hidden'];

function passes(filter: Filter, company: CompanySummary, local?: LocalRelation): boolean {
  switch (filter) {
    case 'forYou':
      return true;
    case 'saved':
      return isCompanySaved(company, local);
    case 'following':
      return Boolean(local?.following);
    case 'contacted':
      return relationshipOf(company, local) === 'contacted';
    case 'growing':
      return company.isGrowing;
    case 'hidden':
      return company.hasHidden;
  }
}

function searchText(company: CompanySummary): string {
  return [company.name, company.industry, company.location, ...company.signals.map((signal) => signal.text)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

// Bedrijven om te kennen, volgen of benaderen: zoeken, filteren en de bedrijfskaarten
export function CompanyBrowser({ companies, initialQuery }: { companies: CompanySummary[]; initialQuery: string }) {
  const t = useT();
  const c = t.companies;
  const { relations } = useCompanyRelations();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<Filter>('forYou');
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [query]);

  const industries = [...new Set(companies.flatMap((company) => company.industry ?? []))].sort();
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const searched = companies
    .filter((company) => words.every((word) => searchText(company).includes(word)))
    .filter((company) => !industry || company.industry === industry);
  const visible = searched.filter((company) => passes(filter, company, relations[company.id]));
  const localFilter = filter === 'saved' || filter === 'following';

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="company-search" className="sr-only">
            {c.page.searchLabel}
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="company-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={c.page.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-base focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary sm:text-sm"
          />
        </div>
        {industries.length > 1 && (
          <select
            aria-label={c.filters.industry}
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="h-10 rounded-lg border border-input bg-card px-2 text-base focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
          >
            <option value="">{c.filters.allIndustries}</option>
            {industries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div
        role="group"
        aria-label={c.filters.label}
        className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map((key) => (
          <Chip key={key} selected={filter === key} onClick={() => setFilter(key)} className="shrink-0">
            {c.filters[key]}
            <span className="text-xs tabular-nums opacity-70">
              {searched.filter((company) => passes(key, company, relations[company.id])).length}
            </span>
          </Chip>
        ))}
      </div>
      {localFilter && <p className="mt-3 text-xs text-muted-foreground">{c.page.localNote}</p>}

      <h2 className="sr-only" aria-live="polite">
        {c.page.title} ({visible.length})
      </h2>
      {visible.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <Card className="mt-5 text-center text-sm text-muted-foreground">{c.noMatches}</Card>
      )}
    </section>
  );
}
