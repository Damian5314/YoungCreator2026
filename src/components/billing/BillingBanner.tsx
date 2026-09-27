import { FlaskConical, TriangleAlert } from 'lucide-react';
import { getT } from '@/i18n/server';

// Zichtbaar maken in welke modus betalen staat: testmodus (demo) of nog niet ingesteld
export async function BillingBanner({ paymentsEnabled, testMode }: { paymentsEnabled: boolean; testMode: boolean }) {
  if (paymentsEnabled && !testMode) return null;
  const t = await getT();
  if (!paymentsEnabled) {
    return (
      <p className="flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        {t.billing.banner.notAvailable}
      </p>
    );
  }
  return (
    <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
      {t.billing.banner.testMode}
    </p>
  );
}
