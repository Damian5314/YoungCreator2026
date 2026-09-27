'use client';

import { useEffect } from 'react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useT } from '@/i18n/I18nProvider';

// Als een pagina in de app faalt: uitleg en twee uitwegen, binnen de app-shell
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();
  const s = t.common.states;

  useEffect(() => {
    console.error('[app] page failed', error);
  }, [error]);

  return (
    <EmptyState
      icon={TriangleAlert}
      title={s.errorTitle}
      description={s.errorBody}
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden />
            {t.common.actions.retry}
          </Button>
          <ButtonLink href="/dashboard" variant="secondary" size="sm">
            {s.toDashboard}
          </ButtonLink>
        </div>
      }
    />
  );
}
