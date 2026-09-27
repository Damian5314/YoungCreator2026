import { getT } from '@/i18n/server';

// Tijdens het laden van een pagina: rustig skelet in de vorm van kop + kaarten, binnen de app-shell
export default async function AppLoading() {
  const t = await getT();
  const bar = 'rounded-full bg-muted motion-safe:animate-pulse';

  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{t.common.states.loading}</span>
      <div className="mb-8 space-y-3">
        <div className={`h-3 w-24 ${bar}`} />
        <div className={`h-9 w-72 max-w-full ${bar}`} />
        <div className={`h-4 w-96 max-w-full ${bar}`} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 rounded-card border border-border bg-card motion-safe:animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-card border border-border bg-card motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
