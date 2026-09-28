import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import { StatusPage } from '@/components/layout/StatusPage';
import { ButtonLink } from '@/components/ui/Button';
import { getT } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).common.states.notFoundPageTitle, robots: { index: false } };
}

// Onbekende url buiten de app (binnen de app vangt (app)/not-found.tsx het op)
export default async function NotFound() {
  const s = (await getT()).common.states;

  return (
    <StatusPage
      icon={Compass}
      code="404"
      title={s.notFoundPageTitle}
      body={s.notFoundPageBody}
      actions={
        <>
          <ButtonLink href="/" shape="pill" size="lg">
            {s.toHome}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" shape="pill" size="lg">
            {s.contactSupport}
          </ButtonLink>
        </>
      }
    />
  );
}
