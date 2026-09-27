import type { Metadata } from 'next';
import { ArrowRight, Coins, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { ResultsList } from '@/components/dashboard/ResultsList';
import { ScheduleCard } from '@/components/dashboard/ScheduleCard';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { getT } from '@/i18n/server';
import { getBillingStatus, getMatches, getOutreachList, getProfile, getSearchProfile } from '@/lib/data/queries';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.dashboard.meta.title };
}

export default async function DashboardPage() {
  const t = await getT();
  const [profile, searchProfile, matches, outreach, billing] = await Promise.all([
    getProfile(),
    getSearchProfile(),
    getMatches(),
    getOutreachList(),
    getBillingStatus(),
  ]);
  const outOfCredits = billing.credits < CREDIT_COST_PER_SEARCH;
  const draftsToReview = outreach.filter((message) => message.status === 'draft' || message.status === 'failed').length;
  const firstName = profile?.fullName?.split(' ')[0];

  return (
    <>
      <PageHeader
        eyebrow={t.dashboard.meta.title}
        title={firstName ? t.dashboard.header.welcomeName(firstName) : t.dashboard.header.welcome}
        description={t.dashboard.header.description}
        action={
          <ButtonLink href="/search" size="sm">
            <Search className="size-4" aria-hidden />
            {t.dashboard.header.newSearch}
          </ButtonLink>
        }
      />

      <StatsRow opportunities={matches} searchYearEndsOn={profile?.searchYearEndsOn ?? null} />

      {/* Gratis zoekopdracht op (of credits op): hier kopen, dat ontgrendelt ook de automations */}
      {outOfCredits && (
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary-soft p-4 sm:flex-row sm:items-center">
          <Coins className="hidden size-5 shrink-0 text-primary-soft-foreground sm:block" aria-hidden />
          <p className="flex-1 text-sm text-primary-soft-foreground">
            <span className="font-semibold">
              {billing.hasPaid ? t.dashboard.credits.outOfCredits : t.dashboard.credits.freeSearchUsed}
            </span>{' '}
            {billing.automationsUnlocked ? t.dashboard.credits.keepSearching : t.dashboard.credits.keepSearchingAndUnlock}
          </p>
          <ButtonLink href="/billing" size="sm" className="shrink-0">
            {t.dashboard.credits.seePacks}
          </ButtonLink>
        </div>
      )}

      {draftsToReview > 0 && (
        <Link
          href="/outreach"
          className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary-soft p-4 text-sm text-primary-soft-foreground transition-colors hover:border-primary"
        >
          <Sparkles className="size-5 shrink-0" aria-hidden />
          <span className="flex-1">
            <span className="font-semibold">
              {t.dashboard.drafts.prepared(draftsToReview)}
            </span>{' '}
            {t.dashboard.drafts.review}
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
              <h2 className="font-semibold">{t.dashboard.empty.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.dashboard.empty.description}
              </p>
              <ButtonLink href="/search" size="sm" className="mt-5">
                <Search className="size-4" aria-hidden />
                {t.dashboard.empty.cta}
              </ButtonLink>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title={t.dashboard.searchProfile.title} description={t.dashboard.searchProfile.description} />
            {searchProfile ? (
              <PreferencesSummary preferences={searchProfile.preferences} />
            ) : (
              <p className="text-sm text-muted-foreground">{t.dashboard.searchProfile.notSetUp}</p>
            )}
            <ButtonLink href="/search/preferences" variant="secondary" size="sm" className="mt-5 w-full">
              <SlidersHorizontal className="size-4" aria-hidden />
              {searchProfile ? t.dashboard.searchProfile.edit : t.dashboard.searchProfile.setUp}
            </ButtonLink>
          </Card>
          {searchProfile && (
            <ScheduleCard
              searchProfileId={searchProfile.id}
              initialSchedule={searchProfile.schedule}
              locked={!billing.automationsUnlocked}
            />
          )}
        </aside>
      </div>
    </>
  );
}
