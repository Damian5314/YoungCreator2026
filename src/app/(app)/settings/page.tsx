import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and how JobHunter looks." />
      <SettingsPanel />
    </div>
  );
}
