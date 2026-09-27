'use client';

import { FloatCard } from '@/app/(marketing)/_components/FloatCard';
import { CompanyLogo } from '@/app/(marketing)/_components/CompanyLogo';
import { buildLanding } from '@/app/(marketing)/_content/landing';
import { useT } from '@/i18n/I18nProvider';

/** Compacte bedrijfssignaal-kaart op de foto: dezelfde ASML-melding als in de hero van de landingspagina. */
export function AuthSignalCard({ className = '' }: { className?: string }) {
  const t = useT();
  const { company, time, title, tags, tagsLabel } = buildLanding(t.landing).heroCards.signal;

  return (
    <FloatCard className={`p-3.5 ${className}`}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-hover">
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" />
          <span className="relative size-2 rounded-full bg-primary" />
        </span>
        {t.authLayout.signalCard.detected}
      </p>

      <div className="mt-2.5 flex items-center gap-2.5">
        <CompanyLogo text={company} tone="bg-[#10238A] text-[8px] text-white" className="size-8" />
        <div className="min-w-0 leading-tight">
          <p className="text-[12.5px] font-semibold">{company}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{time}</p>
        </div>
      </div>

      <p className="mt-2.5 text-balance text-[13.5px] font-semibold leading-snug tracking-[-0.01em]">“{title}”</p>

      <ul className="mt-2.5 flex flex-wrap gap-1" aria-label={tagsLabel}>
        {tags.map((tag, index) => (
          <li
            key={tag}
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
              index === 0 ? 'bg-primary/10 text-primary-hover' : 'bg-white/60 text-muted-foreground'
            }`}
          >
            {tag}
          </li>
        ))}
      </ul>
    </FloatCard>
  );
}
