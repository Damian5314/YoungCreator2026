import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { DashboardAlert } from './DashboardAlert';
import { ResultsList } from './ResultsList';
import { ScheduleCard } from './ScheduleCard';
import { StatsRow } from './StatsRow';
import { PageHeader } from '@/components/layout/PageHeader';
import { PreferencesSummary } from '@/components/search/PreferencesSummary';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { getT } from '@/i18n/server';
import type { BillingStatus, OutreachListItem, ProfileData, SearchProfileData } from '@/lib/data/queries';
import type { ActivityItem } from '@/modules/activity/activity';
import type { Opportunity } from '@/shared/types/Opportunity';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';

export interface DashboardData {
  profile: ProfileData | null;
  searchProfile: SearchProfileData | null;
  matches: Opportunity[];
  outreach: OutreachListItem[];
  billing: BillingStatus;
  activity: ActivityItem[];
}

/**
 * Commandocentrum: wat heeft je agent gevonden, wat is nieuw en wat moet je nu doen?
 * Kop → kerncijfers → wat aandacht vraagt → kansen (hoofdzaak) met rechts profiel, schema en activiteit.
 */
export async function DashboardView({ profile, searchProfile, matches, outreach, billing, activity }: DashboardData) {
  const t = await getT();
  const h = t.dashboard.home;
  const outOfCredits = billing.credits < CREDIT_COST_PER_SEARCH;
  const draftsToReview = outreach.filter((message) => message.status === 'draft' || message.status === 'failed').length;
  const firstName = profile?.fullName?.split(' ')[0];

  return (
    <>
      <div className="motion-safe:animate-fade-up">
        <PageHeader
          eyebrow={t.dashboard.meta.title}
          title={firstName ? h.welcomeName(firstName) : h.welcome}
          description={h.description}
          action={
            <ButtonLink
              href="/search"
              className="group h-12 rounded-[13px] px-5 text-[15px] font-semibold hover:-translate-y-px hover:shadow-[0_12px_24px_-12px_rgb(8_127_99/0.7)]"
            >
              {h.newSearch}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </ButtonLink>
          }
        />
      </div>

      <StatsRow opportunities={matches} searchYearEndsOn={profile?.searchYearEndsOn ?? null} />

      {/* Wat nu je aandacht vraagt: klaargezette mails en (als ze op zijn) credits */}
      {(draftsToReview > 0 || outOfCredits) && (
        <div className="mt-5 space-y-3">
          {draftsToReview > 0 && (
            <DashboardAlert icon="sparkles" action={{ href: '/outreach', label: h.reviewEmails }} dismissible>
              <span className="font-semibold">{t.dashboard.drafts.prepared(draftsToReview)}</span> {t.dashboard.drafts.review}
            </DashboardAlert>
          )}
          {outOfCredits && (
            <DashboardAlert icon="coins" action={{ href: '/billing', label: t.dashboard.credits.seePacks }}>
              <span className="font-semibold">
                {billing.hasPaid ? t.dashboard.credits.outOfCredits : t.dashboard.credits.freeSearchUsed}
              </span>{' '}
              {billing.automationsUnlocked ? t.dashboard.credits.keepSearching : t.dashboard.credits.keepSearchingAndUnlock}
            </DashboardAlert>
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,72fr)_minmax(0,28fr)]">
        <div className="min-w-0">
          {matches.length > 0 ? (
            <ResultsList opportunities={matches} />
          ) : (
            <EmptyState
              icon={Search}
              title={t.opportunities.empty.title}
              description={t.dashboard.empty.description}
              action={
                <ButtonLink href="/search" size="sm">
                  {t.dashboard.empty.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              }
            />
          )}
        </div>

        {/* Ondersteunend: rustiger dan de kansen links */}
        <aside className="min-w-0 space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0 xl:block xl:space-y-5">
          <Card>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-semibold tracking-tight">{h.profileTitle}</h2>
              <Link
                href="/search/preferences"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {searchProfile ? h.edit : t.dashboard.searchProfile.setUp}
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">{h.profileDescription}</p>
            {searchProfile ? (
              <PreferencesSummary preferences={searchProfile.preferences} />
            ) : (
              <p className="text-sm text-muted-foreground">{t.dashboard.searchProfile.notSetUp}</p>
            )}
          </Card>
          {searchProfile && (
            <ScheduleCard
              searchProfileId={searchProfile.id}
              initialSchedule={searchProfile.schedule}
              locked={!billing.automationsUnlocked}
            />
          )}
          <div className="md:col-span-2 xl:col-span-1">
            <ActivityCard items={activity} />
          </div>
        </aside>
      </div>
    </>
  );
}
