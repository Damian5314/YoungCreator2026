import { ArrowRight, Play } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { revealItem } from '../../_components/revealItem';
import { signals } from '../../_content/landing';

/** Dezelfde knoppen als in de hero, zodat de pagina één geheel blijft. */
export function SectionActions() {
  return (
    <>
      <div {...revealItem(560)} className="mt-10 flex flex-wrap items-center gap-3">
        <ButtonLink
          href={signals.primaryCta.href}
          shape="pill"
          size="lg"
          className="h-13 px-7 text-[15px] font-semibold shadow-[0_10px_24px_-10px_rgb(8_127_99/0.65)] hover:-translate-y-px"
        >
          {signals.primaryCta.label}
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <ButtonLink
          href={signals.secondaryCta.href}
          variant="secondary"
          shape="pill"
          size="lg"
          className="h-13 border-foreground/12 bg-white/80 pl-2 pr-6 text-[15px] font-semibold hover:-translate-y-px hover:bg-white"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary">
            <Play className="size-3.5 fill-current" aria-hidden />
          </span>
          {signals.secondaryCta.label}
        </ButtonLink>
      </div>

      <p {...revealItem(620)} className="mt-4 text-[13px] text-muted-foreground">
        {signals.note[0]}
        <span className="mx-2" aria-hidden>
          •
        </span>
        {signals.note[1]}
      </p>
    </>
  );
}
