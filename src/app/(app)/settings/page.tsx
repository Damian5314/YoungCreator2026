import type { Metadata } from 'next';
import { Coins, PlayCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AgentSettingsCard } from '@/components/settings/AgentSettingsCard';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { ButtonLink } from '@/components/ui/Button';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Card, CardHeader } from '@/components/ui/Card';
import { getT } from '@/i18n/server';
import { replayIntro } from '@/lib/actions/onboarding';
import { getBillingStatus, getCurrentUser, getProfile } from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.settings.meta.title };
}

export default async function SettingsPage() {
  const t = await getT();
  const [user, profile, billing] = await Promise.all([getCurrentUser(), getProfile(), getBillingStatus()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title={t.settings.page.title} description={t.settings.page.description} />
      <AgentSettingsCard
        profile={profile}
        automationsUnlocked={billing.automationsUnlocked}
      />
      <Card>
        <CardHeader
          title={t.settings.billingCard.title}
          description={t.settings.billingCard.description(billing.credits)}
        />
        <div className="flex justify-end">
          <ButtonLink href="/billing" variant="secondary" size="sm">
            <Coins className="size-4" aria-hidden />
            {t.settings.billingCard.button}
          </ButtonLink>
        </div>
      </Card>
      <Card>
        <CardHeader title={t.settings.intro.title} description={t.settings.intro.description} />
        <form action={replayIntro} className="flex justify-end">
          <SubmitButton variant="secondary" size="sm" icon={<PlayCircle className="size-4" aria-hidden />}>
            {t.settings.intro.button}
          </SubmitButton>
        </form>
      </Card>
      {/* Laatste: eindigt met uitloggen */}
      <SettingsPanel email={user?.email ?? ''} fullName={profile?.fullName ?? null} />
    </div>
  );
}
