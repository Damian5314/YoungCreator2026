import { SearchX } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { getT } from '@/i18n/server';

// Onbekende kans of bedrijf (bv. een oude link): blijf in de app, met een weg terug
export default async function AppNotFound() {
  const t = await getT();
  const s = t.common.states;

  return (
    <EmptyState
      icon={SearchX}
      title={s.notFoundTitle}
      description={s.notFoundBody}
      action={
        <ButtonLink href="/dashboard" size="sm">
          {s.toDashboard}
        </ButtonLink>
      }
    />
  );
}
