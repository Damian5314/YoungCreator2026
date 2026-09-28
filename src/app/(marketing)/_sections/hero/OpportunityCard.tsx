import { ArrowRight, Sparkles } from 'lucide-react';
import { FloatCard, glassIcon } from '../../_components/FloatCard';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/** Stap 2 — de kernkaart: van bedrijfssignaal naar een persoonlijke kans. */
export async function OpportunityCard() {
  const { heroCards } = buildLanding((await getT()).landing);
  const { label, title, reason, cta } = heroCards.opportunity;

  return (
    <FloatCard tone="tint" className="p-[18px]">
      <div className="flex items-center gap-2.5">
        <span className={`${glassIcon} size-8 bg-lime/30`}>
          <Sparkles className="size-3.5 text-primary-hover" aria-hidden />
        </span>
        <p className="text-[12.5px] font-semibold text-primary-hover">{label}</p>
      </div>

      <p className="mt-3 text-balance text-[15.5px] font-semibold leading-snug tracking-[-0.015em]">{title}</p>
      {/* Op de lichtgroene kaart haalt muted-foreground net geen 4.5:1; iets donkerder */}
      <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-foreground/72">{reason}</p>

      {/* Product-UI ter illustratie: bewust geen echte knop */}
      <span className="mt-3.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-[12.5px] font-semibold text-primary-foreground">
        {cta}
        <ArrowRight className="size-3.5" aria-hidden />
      </span>
    </FloatCard>
  );
}
