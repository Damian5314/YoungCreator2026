import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { PreferencesForm } from '@/components/search/PreferencesForm';
import { getProfile, getSearchProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Search preferences' };

export default async function SearchPreferencesPage() {
  const [profile, searchProfile] = await Promise.all([getProfile(), getSearchProfile()]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Profile setup"
        title="Your situation & preferences"
        description={
          searchProfile
            ? 'Every search — manual or scheduled — uses this profile.'
            : 'Fill this in once and we can start hunting for you.'
        }
      />
      <PreferencesForm profile={profile} searchProfile={searchProfile} />
    </div>
  );
}
