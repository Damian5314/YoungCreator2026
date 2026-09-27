import { ArrowRight, Sparkles } from 'lucide-react';
import { FloatCard, glassIcon } from '../../_components/FloatCard';
import { heroCards } from '../../_content/landing';

/** Stap 2 — de kernkaart: van bedrijfssignaal naar een persoonlijke kans. */
export function OpportunityCard() {
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
      <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">{reason}</p>

      {/* Product-UI ter illustratie: bewust geen echte knop */}
      <span className="mt-3.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-[12.5px] font-semibold text-primary-foreground">
        {cta}
        <ArrowRight className="size-3.5" aria-hidden />
      </span>
    </FloatCard>
  );
}
