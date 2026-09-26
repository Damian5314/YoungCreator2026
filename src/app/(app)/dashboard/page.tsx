import type { Metadata } from 'next';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { ResultsList } from '@/components/dashboard/ResultsList';
import { ScheduleCard } from '@/components/dashboard/ScheduleCard';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { mockOpportunities, mockUser } from '@/shared/mocks/mockData';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  const firstName = mockUser.name.split(' ')[0];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Everything your searches have found so far."
        action={
          <ButtonLink href="/search" size="sm">
            <Search className="size-4" aria-hidden />
            New search
          </ButtonLink>
        }
      />

      <StatsRow opportunities={mockOpportunities} visaDeadline={mockUser.visaDeadline} />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ResultsList opportunities={mockOpportunities} />
        </div>
        <aside className="space-y-6">
          <Card>
            <CardHeader title="Search profile" description="What we're hunting for." />
            <PreferencesSummary preferences={mockUser.preferences} />
            <ButtonLink href="/search/preferences" variant="secondary" size="sm" className="mt-5 w-full">
              <SlidersHorizontal className="size-4" aria-hidden />
              Edit search profile
            </ButtonLink>
          </Card>
          <ScheduleCard />
        </aside>
      </div>
    </>
  );
}
