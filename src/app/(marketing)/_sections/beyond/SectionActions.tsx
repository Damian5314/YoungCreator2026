import { ArrowRight, Play } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { revealItem } from '../../_components/revealItem';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { WatchStoryLink } from '../story/WatchStoryLink';

/** Dezelfde knoppen als in de hero, zodat de pagina één geheel blijft. */
export async function SectionActions() {
  const { signals } = buildLanding((await getT()).landing);

  return (
    <>
      <div {...revealItem(560)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <ButtonLink
          href={signals.primaryCta.href}
          shape="pill"
          size="lg"
          className="h-13 w-full px-7 text-[15px] font-semibold shadow-[0_10px_24px_-10px_rgb(8_127_99/0.65)] hover:-translate-y-px sm:w-auto"
        >
          {signals.primaryCta.label}
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <WatchStoryLink
          href={signals.secondaryCta.href}
          className="h-13 w-full border-foreground/12 bg-white/80 pl-2 pr-6 text-[15px] font-semibold hover:-translate-y-px hover:bg-white sm:w-auto"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary">
            <Play className="size-3.5 fill-current" aria-hidden />
          </span>
          {signals.secondaryCta.label}
        </WatchStoryLink>
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
