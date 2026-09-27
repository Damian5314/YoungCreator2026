import { Send } from 'lucide-react';

/** Card 3 — an actionable, personalized outreach draft. */
export function OutreachCard() {
  return (
    <article className="hero-glass w-72 rounded-[20px] p-4 text-[var(--hero-ink)]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--hero-green)] text-xs font-semibold text-white">
          M
        </span>
        <p className="text-sm font-semibold">Suggested outreach</p>
      </div>

      <div className="mt-3 rounded-xl bg-white/55 p-3 text-[13px] leading-relaxed text-[var(--hero-ink-soft)]">
        <p className="text-[var(--hero-ink)]">Hi ASML team,</p>
        <p className="mt-1.5">
          I saw your announcement about the new R&amp;D center in Eindhoven. I have experience in data
          analysis and would love to explore how I could contribute.
        </p>
      </div>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--hero-green)] transition-transform hover:translate-x-0.5"
      >
        Send message
        <Send className="size-3.5" aria-hidden />
      </button>
    </article>
  );
}
