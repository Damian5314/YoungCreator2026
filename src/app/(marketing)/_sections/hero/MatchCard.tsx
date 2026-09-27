import { Check } from 'lucide-react';

const reasons = ['Your skills match', 'Relevant location', 'Growing team'];

/** Card 4 — a compact match summary; deliberately not a progress dashboard. */
export function MatchCard() {
  return (
    <article className="hero-glass w-60 rounded-[20px] p-4 text-[var(--hero-ink)]">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-[var(--hero-green)]">92%</span>
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--hero-ink-soft)]">
          Match
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {reasons.map((reason) => (
          <li key={reason} className="flex items-center gap-2 text-[13px]">
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[var(--hero-green)]/12 text-[var(--hero-green)]">
              <Check className="size-3" aria-hidden />
            </span>
            {reason}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--hero-green)]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--hero-green)]">
        <span className="size-1.5 rounded-full bg-[var(--hero-green)]" aria-hidden />
        High-potential opportunity
      </div>
    </article>
  );
}
