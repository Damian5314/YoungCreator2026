import type { Metadata } from 'next';
import { PlayCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AgentSettingsCard } from '@/components/settings/AgentSettingsCard';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { features } from '@/lib/env';
import { replayIntro } from '@/lib/actions/onboarding';
import { getCurrentUser, getProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getProfile()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Manage your agent, your account and how JobHunter looks." />
      <AgentSettingsCard profile={profile} canSendEmail={features.canSendEmail} />
      <Card>
        <CardHeader title="Introduction" description="See the short tour of how your agent works again." />
        <form action={replayIntro} className="flex justify-end">
          <Button type="submit" variant="secondary" size="sm">
            <PlayCircle className="size-4" aria-hidden />
            Show introduction
          </Button>
        </form>
      </Card>
      {/* Laatste: eindigt met uitloggen */}
      <SettingsPanel email={user?.email ?? ''} fullName={profile?.fullName ?? null} />
    </div>
  );
}
