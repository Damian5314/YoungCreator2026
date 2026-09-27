import { FlaskConical, TriangleAlert } from 'lucide-react';

// Zichtbaar maken in welke modus betalen staat: testmodus (demo) of nog niet ingesteld
export function BillingBanner({ paymentsEnabled, testMode }: { paymentsEnabled: boolean; testMode: boolean }) {
  if (!paymentsEnabled) {
    return (
      <p className="flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        Buying credits isn&apos;t available yet. Payments will open soon.
      </p>
    );
  }
  if (!testMode) return null;
  return (
    <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
      Test mode: you&apos;ll see Mollie&apos;s test checkout, where you choose the outcome. No real money is charged.
    </p>
  );
}
