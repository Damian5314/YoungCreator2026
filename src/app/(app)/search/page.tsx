import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { SearchEngine } from '@/components/search/SearchEngine';
import { getCreditBalance, getSearchProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Search' };

export default async function SearchPage() {
  const [searchProfile, credits] = await Promise.all([getSearchProfile(), getCreditBalance()]);

  // Eerst situatie en voorkeuren invullen, daarna pas de search engine
  if (!searchProfile) redirect('/search/preferences');

  return (
    <>
      <PageHeader
        title="Search"
        description="One click searches LinkedIn, Indeed, company career pages and our radar."
        action={
          <ButtonLink href="/search/preferences" variant="secondary" size="sm">
            <SlidersHorizontal className="size-4" aria-hidden />
            Change preferences
          </ButtonLink>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SearchEngine
            credits={credits}
            defaultIncludeRadar={searchProfile.includeRadar}
            defaultIncludeCompanyHunter={searchProfile.includeCompanyHunter}
          />
        </div>
        <Card>
          <CardHeader title="Your search profile" description="We search with these preferences." />
          <PreferencesSummary preferences={searchProfile.preferences} />
        </Card>
      </div>
    </>
  );
}
