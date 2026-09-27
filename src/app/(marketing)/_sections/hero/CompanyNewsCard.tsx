import { ExternalLink } from 'lucide-react';

const tags = ['Expansion', 'R&D', 'Eindhoven'];

/** Card 1 — a publicly announced company signal, styled like a news notification. */
export function CompanyNewsCard() {
  return (
    <article className="hero-glass w-72 rounded-[20px] p-4 text-[var(--hero-ink)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#0b5cd6] text-[11px] font-bold tracking-tight text-white">
            ASML
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">ASML</p>
            <p className="text-xs text-[var(--hero-ink-soft)]">2 hours ago</p>
          </div>
        </div>
        <ExternalLink className="size-4 shrink-0 text-[var(--hero-ink-soft)]" aria-hidden />
      </div>

      <p className="mt-3 text-sm font-medium leading-snug">
        ASML announces new R&amp;D center in Eindhoven
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium text-[var(--hero-ink-soft)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
