import type { Metadata } from 'next';
import { UserX } from 'lucide-react';
import { StatusPage } from '@/components/layout/StatusPage';
import { ButtonLink } from '@/components/ui/Button';
import { getT } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).settings.danger.deletedTitle, robots: { index: false } };
}

// Bevestiging na het verwijderen van een account (de sessie is dan al weg)
export default async function AccountDeletedPage() {
  const t = await getT();
  const d = t.settings.danger;

  return (
    <StatusPage
      icon={UserX}
      title={d.deletedTitle}
      body={d.deletedBody}
      actions={
        <ButtonLink href="/" shape="pill" size="lg">
          {t.common.states.toHome}
        </ButtonLink>
      }
    />
  );
}
