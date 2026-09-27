import type { Metadata } from 'next';
import { Coins, PlayCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AgentSettingsCard } from '@/components/settings/AgentSettingsCard';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { features } from '@/lib/env';
import { replayIntro } from '@/lib/actions/onboarding';
import { getBillingStatus, getCurrentUser, getProfile } from '@/lib/data/queries';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const [user, profile, billing] = await Promise.all([getCurrentUser(), getProfile(), getBillingStatus()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Manage your agent, your account and how Unlisted looks." />
      <AgentSettingsCard
        profile={profile}
        canSendEmail={features.canSendEmail}
        automationsUnlocked={billing.automationsUnlocked}
      />
      <Card>
        <CardHeader
          title="Credits & billing"
          description={`You have ${billing.credits} ${billing.credits === 1 ? 'credit' : 'credits'}. Buy more or see your payments.`}
        />
        <div className="flex justify-end">
          <ButtonLink href="/billing" variant="secondary" size="sm">
            <Coins className="size-4" aria-hidden />
            Credits & billing
          </ButtonLink>
        </div>
      </Card>
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
