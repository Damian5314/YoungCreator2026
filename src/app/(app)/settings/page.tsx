import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { getCurrentUser, getProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getProfile()]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and how JobHunter looks." />
      <SettingsPanel email={user?.email ?? ''} fullName={profile?.fullName ?? null} />
    </div>
  );
}
