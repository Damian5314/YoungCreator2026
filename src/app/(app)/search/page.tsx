import type { Metadata } from 'next';
import { SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { SearchEngine } from '@/components/search/SearchEngine';
import { mockUser } from '@/shared/mocks/mockData';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
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
          <SearchEngine />
        </div>
        <Card>
          <CardHeader title="Your search profile" description="We search with these preferences." />
          <PreferencesSummary preferences={mockUser.preferences} />
        </Card>
      </div>
    </>
  );
}
