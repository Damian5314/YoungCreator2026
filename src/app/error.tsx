'use client';

import { useEffect } from 'react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { StatusPage } from '@/components/layout/StatusPage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useT } from '@/i18n/I18nProvider';

// Fout op een publieke pagina (home, login, privacy, …). De app heeft een eigen boundary in (app)/error.tsx.
export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useT();
  const s = t.common.states;

  useEffect(() => {
    console.error('[page] failed', error);
  }, [error]);

  return (
    <StatusPage
      icon={TriangleAlert}
      title={s.errorTitle}
      body={s.pageErrorBody}
      actions={
        <>
          <Button onClick={retry} shape="pill" size="lg">
            <RotateCcw className="size-4" aria-hidden />
            {t.common.actions.retry}
          </Button>
          <ButtonLink href="/" variant="secondary" shape="pill" size="lg">
            {s.toHome}
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" shape="pill" size="lg">
            {s.contactSupport}
          </ButtonLink>
        </>
      }
      // De digest koppelt deze melding aan de serverlog, zonder details over de fout te lekken
      footnote={error.digest ? s.errorCode(error.digest) : undefined}
    />
  );
}
