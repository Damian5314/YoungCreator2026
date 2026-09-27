import { ArrowRight, Play } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { WatchStoryLink } from '../story/WatchStoryLink';

/** Dezelfde knoppen als in de hero: groen en dominant, daarnaast een rustige witte met play-icoon. */
export async function CTAButtons() {
  const { finalCta } = buildLanding((await getT()).landing);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <ButtonLink
        href={finalCta.primary.href}
        shape="pill"
        size="lg"
        className="h-13 w-full px-7 text-[15px] font-semibold shadow-[0_12px_28px_-10px_rgb(8_127_99/0.75)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgb(8_127_99/0.85)] sm:w-auto"
      >
        {finalCta.primary.label}
        <ArrowRight className="size-4" aria-hidden />
      </ButtonLink>
      <WatchStoryLink
        href={finalCta.secondary.href}
        className="h-13 w-full border-white/50 bg-white/94 pl-2 pr-6 text-[15px] font-semibold text-[#101820] hover:-translate-y-0.5 hover:bg-white sm:w-auto"
      >
        <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary">
          <Play className="size-3.5 fill-current" aria-hidden />
        </span>
        {finalCta.secondary.label}
      </WatchStoryLink>
    </div>
  );
}
