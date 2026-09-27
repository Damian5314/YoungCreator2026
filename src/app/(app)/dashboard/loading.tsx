import { getT } from '@/i18n/server';

// Skelet in de vorm van het dashboard (kop, vier cijfers, kansen + zijkolom): de layout springt niet bij het laden
export default async function DashboardLoading() {
  const t = await getT();
  const block = 'rounded-card border border-[rgb(16_24_32/0.08)] bg-card motion-safe:animate-pulse';
  const bar = 'rounded-full bg-muted motion-safe:animate-pulse';

  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{t.common.states.loading}</span>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-3">
          <div className={`h-3 w-24 ${bar}`} />
          <div className={`h-9 w-80 max-w-full ${bar}`} />
          <div className={`h-4 w-64 max-w-full ${bar}`} />
        </div>
        <div className={`hidden h-12 w-40 rounded-[13px] bg-muted motion-safe:animate-pulse sm:block`} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-[118px] ${block}`} />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,72fr)_minmax(0,28fr)]">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-44 ${block}`} />
          ))}
        </div>
        <div className="space-y-5">
          <div className={`h-72 ${block}`} />
          <div className={`h-52 ${block}`} />
        </div>
      </div>
    </div>
  );
}
