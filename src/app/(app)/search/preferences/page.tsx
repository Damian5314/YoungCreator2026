import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { PreferencesForm } from '@/components/search/PreferencesForm';

export const metadata: Metadata = { title: 'Search preferences' };

export default function SearchPreferencesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Your situation & preferences"
        description="Fill this in once. Every search — manual or scheduled — uses this profile."
      />
      <PreferencesForm />
    </div>
  );
}
