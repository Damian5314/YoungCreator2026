import type { Metadata } from 'next';
import { ArrowRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { ResultsList } from '@/components/dashboard/ResultsList';
import { ScheduleCard } from '@/components/dashboard/ScheduleCard';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { getMatches, getOutreachList, getProfile, getSearchProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const [profile, searchProfile, matches, outreach] = await Promise.all([
    getProfile(),
    getSearchProfile(),
    getMatches(),
    getOutreachList(),
  ]);
  const draftsToReview = outreach.filter((message) => message.status === 'draft' || message.status === 'failed').length;
  const firstName = profile?.fullName?.split(' ')[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
        description="Everything your searches have found so far."
        action={
          <ButtonLink href="/search" size="sm">
            <Search className="size-4" aria-hidden />
            New search
          </ButtonLink>
        }
      />

      <StatsRow opportunities={matches} searchYearEndsOn={profile?.searchYearEndsOn ?? null} />

      {draftsToReview > 0 && (
        <Link
          href="/outreach"
          className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary-soft p-4 text-sm text-primary-soft-foreground transition-colors hover:border-primary"
        >
          <Sparkles className="size-5 shrink-0" aria-hidden />
          <span className="flex-1">
            <span className="font-semibold">
              Your agent prepared {draftsToReview} {draftsToReview === 1 ? 'email' : 'emails'} for you.
            </span>{' '}
            Review and send them to take the first step.
          </span>
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </Link>
      )}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        {/* min-w-0: de horizontaal scrollende filterrij mag de kolom niet breder maken dan het scherm */}
        <div className="min-w-0 lg:col-span-2">
          {matches.length > 0 ? (
            <ResultsList opportunities={matches} />
          ) : (
            <Card className="py-12 text-center">
              <h2 className="font-semibold">No results yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Run your first search and your matches will show up here.
              </p>
              <ButtonLink href="/search" size="sm" className="mt-5">
                <Search className="size-4" aria-hidden />
                Go to search
              </ButtonLink>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Search profile" description="What we're hunting for." />
            {searchProfile ? (
              <PreferencesSummary preferences={searchProfile.preferences} />
            ) : (
              <p className="text-sm text-muted-foreground">You haven&apos;t set up your search yet.</p>
            )}
            <ButtonLink href="/search/preferences" variant="secondary" size="sm" className="mt-5 w-full">
              <SlidersHorizontal className="size-4" aria-hidden />
              {searchProfile ? 'Edit search profile' : 'Set up your search'}
            </ButtonLink>
          </Card>
          {searchProfile && (
            <ScheduleCard searchProfileId={searchProfile.id} initialSchedule={searchProfile.schedule} />
          )}
        </aside>
      </div>
    </>
  );
}
