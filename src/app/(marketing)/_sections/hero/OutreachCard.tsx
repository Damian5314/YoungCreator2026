import { ArrowRight, PenLine } from 'lucide-react';
import { FloatCard, glassIcon } from '../../_components/FloatCard';
import { heroCards } from '../../_content/landing';

/** Stap 4 — een compacte preview van de volgende actie: een persoonlijk bericht. */
export function OutreachCard() {
  const { label, greeting, preview, cta } = heroCards.outreach;

  return (
    <FloatCard className="p-3.5">
      <div className="flex items-center gap-2">
        <span className={`${glassIcon} size-7 text-primary`}>
          <PenLine className="size-3.5" aria-hidden />
        </span>
        <p className="text-[12.5px] font-semibold">{label}</p>
      </div>

      <div className="mt-2.5 rounded-[10px] bg-white/70 px-3 py-2 text-[12px] leading-relaxed">
        <p className="font-medium">{greeting}</p>
        <p className="line-clamp-2 text-muted-foreground">{preview}</p>
      </div>

      <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary">
        {cta}
        <ArrowRight className="size-3.5" aria-hidden />
      </span>
    </FloatCard>
  );
}
