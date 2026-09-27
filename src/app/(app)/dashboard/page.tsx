import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { getT } from '@/i18n/server';
import {
  getActivity,
  getBillingStatus,
  getMatches,
  getOutreachList,
  getProfile,
  getSearchProfile,
} from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.dashboard.meta.title };
}

export default async function DashboardPage() {
  const [profile, searchProfile, matches, outreach, billing, activity] = await Promise.all([
    getProfile(),
    getSearchProfile(),
    getMatches(),
    getOutreachList(),
    getBillingStatus(),
    getActivity(),
  ]);

  return (
    <DashboardView
      profile={profile}
      searchProfile={searchProfile}
      matches={matches}
      outreach={outreach}
      billing={billing}
      activity={activity}
    />
  );
}
