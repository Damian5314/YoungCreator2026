'use client';

import { useEffect } from 'react';
import { ArrowRight, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useT } from '@/i18n/I18nProvider';

// Dashboard kon niet laden: rustige melding (geen rode pagina) met opnieuw proberen
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();

  useEffect(() => {
    console.error('[dashboard] failed to load', error);
  }, [error]);

  return (
    <EmptyState
      icon={TriangleAlert}
      title={t.common.states.errorTitle}
      description={t.dashboard.home.errorBody}
      action={
        <Button size="sm" onClick={reset}>
          {t.dashboard.home.retry}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      }
    />
  );
}
