import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { PreferencesForm } from '@/components/search/PreferencesForm';
import { getT } from '@/i18n/server';
import { getProfile, getSearchProfile } from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.search.meta.preferencesTitle };
}

export default async function SearchPreferencesPage() {
  const t = await getT();
  const [profile, searchProfile] = await Promise.all([getProfile(), getSearchProfile()]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow={t.search.preferencesPage.eyebrow}
        title={t.search.preferencesPage.title}
        description={
          searchProfile ? t.search.preferencesPage.descriptionExisting : t.search.preferencesPage.descriptionNew
        }
      />
      <PreferencesForm profile={profile} searchProfile={searchProfile} />
    </div>
  );
}
