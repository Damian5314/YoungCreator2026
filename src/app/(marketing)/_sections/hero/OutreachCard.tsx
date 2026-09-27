import { ArrowRight, PenLine } from 'lucide-react';
import { FloatCard, glassIcon } from '../../_components/FloatCard';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/**
 * Stap 4 — een compacte preview van de volgende actie: een persoonlijk bericht.
 * Op xl (kleinere desktops) extra compact, zodat de kaart niet over de onderrand van de foto valt.
 */
export async function OutreachCard() {
  const { heroCards } = buildLanding((await getT()).landing);
  const { label, greeting, preview, cta } = heroCards.outreach;

  return (
    <FloatCard className="p-3.5 xl:p-3 2xl:p-3.5">
      <div className="flex items-center gap-2">
        <span className={`${glassIcon} size-7 text-primary xl:size-6 2xl:size-7`}>
          <PenLine className="size-3.5 xl:size-3 2xl:size-3.5" aria-hidden />
        </span>
        <p className="text-[12.5px] font-semibold xl:text-[11.5px] 2xl:text-[12.5px]">{label}</p>
      </div>

      <div className="mt-2.5 rounded-[10px] bg-white/70 px-3 py-2 text-[12px] leading-relaxed xl:mt-2 xl:px-2.5 xl:py-1.5 xl:text-[11px] 2xl:mt-2.5 2xl:px-3 2xl:py-2 2xl:text-[12px]">
        <p className="font-medium">{greeting}</p>
        <p className="line-clamp-2 text-muted-foreground xl:line-clamp-1 2xl:line-clamp-2">{preview}</p>
      </div>

      <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary xl:mt-2 xl:text-[11.5px] 2xl:mt-2.5 2xl:text-[12.5px]">
        {cta}
        <ArrowRight className="size-3.5 xl:size-3 2xl:size-3.5" aria-hidden />
      </span>
    </FloatCard>
  );
}
