import type { ReactNode } from 'react';
import { MediaSlot } from '../../_components/MediaSlot';
import { RevealGroup } from '../../_components/RevealGroup';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/** Tijdelijke, filmische achtergrond zolang er geen verhaalfoto is (laptoplicht in een donkere kamer). */
function StoryFallback() {
  return (
    <div aria-hidden className="absolute inset-0 bg-[#0c1316]">
      <div className="absolute inset-0 bg-[radial-gradient(55%_75%_at_72%_62%,rgb(255_184_112/0.2),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_60%_at_20%_15%,rgb(8_127_99/0.22),transparent_70%)]" />
    </div>
  );
}

/**
 * De verhaalfoto met overlays. Mobiel/tablet: een eigen blok onder de tekst.
 * Desktop: vult de hele kaart, achter de tekst. `children` (kaarten, notitie)
 * worden ten opzichte van dit blok gepositioneerd.
 */
export async function StoryBackground({ children }: { children: ReactNode }) {
  const { media } = buildLanding((await getT()).landing);

  return (
    <RevealGroup className="relative lg:absolute lg:inset-0">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
        {/* Iets hoger dan het blok, zodat de parallax (±8px) nooit een rand laat zien */}
        <div className="story-parallax absolute inset-x-0 -inset-y-3">
          <MediaSlot
            media={media.story}
            sizes="(min-width: 1440px) 1280px, 100vw"
            fallback={<StoryFallback />}
            className="object-[62%_center] lg:object-[70%_35%]"
          />
        </div>

        {/* Mobiel: loopt zacht over uit de tekst, onderaan donkerder voor de kaarten */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-[#0c1316] via-[#0c1316]/10 via-30% to-[#0c1316]/85 lg:hidden"
        />
        {/* Desktop: links flink donkerder voor de kop, rechts blijft de foto rijk */}
        <div aria-hidden className="story-scrim absolute inset-0 hidden lg:block" />
      </div>

      {children}
    </RevealGroup>
  );
}
