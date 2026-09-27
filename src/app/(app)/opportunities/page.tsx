import type { Metadata } from 'next';
import { Briefcase, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { OpportunityBrowser } from '@/components/opportunities/OpportunityBrowser';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { getT } from '@/i18n/server';
import { getCompanies, getMatches } from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.opportunities.meta.title };
}

// Alles waar je op kunt reageren: banen, stages, evenementen en verborgen kansen
export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const [t, opportunities, companies, params] = await Promise.all([getT(), getMatches(), getCompanies(), searchParams]);
  const query = typeof params.q === 'string' ? params.q.slice(0, 100) : '';
  const o = t.opportunities;

  // Klein zoekregister, zodat de pagina ook laat zien welke bedrijven bij de zoekterm passen
  const companyIndex = companies.map((company) => ({
    name: company.name,
    text: [company.name, company.industry, company.location, ...company.signals.map((signal) => signal.text)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  }));

  return (
    <>
      <PageHeader title={o.page.title} description={o.page.description} />
      {opportunities.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={o.empty.title}
          description={o.empty.description}
          action={
            <ButtonLink href="/search" size="sm">
              <Search className="size-4" aria-hidden />
              {o.empty.cta}
            </ButtonLink>
          }
        />
      ) : (
        // key: een nieuwe zoekopdracht uit de bovenbalk begint met schone filters
        <OpportunityBrowser key={query} opportunities={opportunities} initialQuery={query} companyIndex={companyIndex} />
      )}
    </>
  );
}
