import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { RecentRuns } from '@/components/search/RecentRuns';
import { SearchEngine } from '@/components/search/SearchEngine';
import { getT } from '@/i18n/server';
import { getCreditBalance, getRecentRuns, getSearchProfile } from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.search.meta.title };
}

export default async function SearchPage() {
  const t = await getT();
  const [searchProfile, credits, runs] = await Promise.all([getSearchProfile(), getCreditBalance(), getRecentRuns()]);

  // Eerst situatie en voorkeuren invullen, daarna pas de search engine
  if (!searchProfile) redirect('/search/preferences');

  return (
    <>
      <PageHeader
        title={t.search.page.title}
        description={t.search.page.description}
        action={
          <ButtonLink href="/search/preferences" variant="secondary" size="sm">
            <SlidersHorizontal className="size-4" aria-hidden />
            {t.search.page.changePreferences}
          </ButtonLink>
        }
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SearchEngine
            credits={credits}
            defaultIncludeRadar={searchProfile.includeRadar}
            defaultIncludeCompanyHunter={searchProfile.includeCompanyHunter}
          />
        </div>
        <aside className="space-y-6">
          <Card>
            <CardHeader title={t.search.page.profileTitle} description={t.search.page.profileDescription} />
            <PreferencesSummary preferences={searchProfile.preferences} />
          </Card>
          <RecentRuns runs={runs} />
        </aside>
      </div>
    </>
  );
}
