import type { Metadata } from 'next';
import { Building2, Search } from 'lucide-react';
import { CompanyBrowser } from '@/components/companies/CompanyBrowser';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { getT } from '@/i18n/server';
import { getCompanies } from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.companies.meta.title };
}

// Bedrijven achter je kansen: wie groeit er, wat gebeurt er, en wie moet je kennen
export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const [t, companies, params] = await Promise.all([getT(), getCompanies(), searchParams]);
  const query = typeof params.q === 'string' ? params.q.slice(0, 100) : '';
  const c = t.companies;

  return (
    <>
      <PageHeader title={c.page.title} description={c.page.description} />
      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={c.empty.title}
          description={c.empty.description}
          action={
            <ButtonLink href="/search" size="sm">
              <Search className="size-4" aria-hidden />
              {c.empty.cta}
            </ButtonLink>
          }
        />
      ) : (
        <CompanyBrowser key={query} companies={companies} initialQuery={query} />
      )}
    </>
  );
}
