import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { AgentSettingsCard } from '@/components/settings/AgentSettingsCard';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { features } from '@/lib/env';
import { getCurrentUser, getProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getProfile()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Manage your agent, your account and how JobHunter looks." />
      <AgentSettingsCard profile={profile} canSendEmail={features.canSendEmail} />
      <SettingsPanel email={user?.email ?? ''} fullName={profile?.fullName ?? null} />
    </div>
  );
}
