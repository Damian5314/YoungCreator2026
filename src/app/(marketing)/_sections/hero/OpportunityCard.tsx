import { Sparkles, ArrowRight } from 'lucide-react';

/** Card 2 — the pivotal card that connects a company signal to the student. */
export function OpportunityCard() {
  return (
    <article className="hero-glass-green w-72 rounded-[22px] p-4 text-[var(--hero-ink)]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--hero-lime)]/35 ring-1 ring-white/60">
          <Sparkles className="size-4 text-[var(--hero-green)]" aria-hidden />
        </span>
        <p className="text-sm font-semibold text-[var(--hero-green)]">Opportunity for you</p>
      </div>

      <p className="mt-3 text-[15px] font-medium leading-snug">
        This could be a great fit for your skills.
      </p>
      <p className="mt-1.5 text-xs text-[var(--hero-ink-soft)]">
        Based on company expansion and your profile.
      </p>

      <button
        type="button"
        className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--hero-green)] transition-transform hover:translate-x-0.5"
      >
        Explore opportunity
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </article>
  );
}
