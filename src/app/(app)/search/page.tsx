import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { RecentRuns } from '@/components/search/RecentRuns';
import { SearchEngine } from '@/components/search/SearchEngine';
import { features } from '@/lib/env';
import { getCreditBalance, getRecentRuns, getSearchProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Search' };

export default async function SearchPage() {
  const [searchProfile, credits, runs] = await Promise.all([getSearchProfile(), getCreditBalance(), getRecentRuns()]);

  // Eerst situatie en voorkeuren invullen, daarna pas de search engine
  if (!searchProfile) redirect('/search/preferences');

  return (
    <>
      <PageHeader
        title="Search"
        description="One click sends your agent out: job boards, career pages, events, startups and company news."
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
            demoMode={features.demoMode}
          />
        </div>
        <aside className="space-y-6">
          <Card>
            <CardHeader title="Your search profile" description="We search with these preferences." />
            <PreferencesSummary preferences={searchProfile.preferences} />
          </Card>
          <RecentRuns runs={runs} />
        </aside>
      </div>
    </>
  );
}
