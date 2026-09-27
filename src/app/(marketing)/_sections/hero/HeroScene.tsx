import { Annotation } from '../../_components/Annotation';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { CompanySignalCard } from './CompanySignalCard';
import { Floating } from './Floating';
import { MatchCard } from './MatchCard';
import { OpportunityCard } from './OpportunityCard';
import { OutreachCard } from './OutreachCard';

/**
 * De product-kaarten rond de student, als verhaal van boven naar beneden:
 * bedrijfsnieuws → kans gevonden → 92% match → voorgesteld bericht.
 * - Mobiel: alleen nieuws + kans, als stapel die iets over de foto valt (vier kaarten is te lang).
 * - Tablet: alle vier in 2 kolommen.
 * - Desktop: een laag met exact dezelfde maat als de hero-foto, zodat de posities
 *   (in % van de foto) altijd op dezelfde plek rond de student blijven. Gezicht, haar
 *   en laptop blijven vrij. lg toont alleen nieuws + kans; vanaf xl de volledige compositie.
 */
export async function HeroScene() {
  const { hero } = buildLanding((await getT()).landing);

  return (
    <div className="relative z-20 -mt-10 grid gap-3 px-3 sm:-mt-14 sm:grid-cols-2 sm:gap-4 sm:px-5 lg:pointer-events-none lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:block lg:aspect-[1671/941] lg:h-[var(--hero-h)] lg:px-0">
      {/* Bron: het bedrijfsnieuws — boven, iets achter de kans-kaart */}
      <Floating
        className="lg:left-[63.5%] lg:top-[11%] lg:z-10 lg:w-[256px] lg:rotate-1 xl:left-[52%] xl:top-[16.5%] xl:w-[272px] 2xl:w-[284px]"
        delay={0.45}
        duration={7.5}
      >
        <CompanySignalCard />
      </Floating>

      {/* Held van de UI: de kans voor de student */}
      <Floating
        className="lg:left-[64%] lg:top-[56%] lg:z-30 lg:w-[272px] lg:-rotate-1 xl:left-[47.6%] xl:top-[34%] xl:w-[284px] 2xl:w-[300px]"
        delay={0.6}
        duration={8}
      >
        <OpportunityCard />
      </Floating>

      {/* Rechts-midden, kleiner: de match */}
      <Floating
        className="hidden sm:block lg:hidden xl:right-[2.2%] xl:top-[50%] xl:z-20 xl:block xl:w-[192px] xl:rotate-1 2xl:w-[204px]"
        delay={0.75}
        duration={6.5}
      >
        <MatchCard />
      </Floating>

      {/* Onderaan, kleinst en iets naar achteren: de volgende actie */}
      <Floating
        className="hidden sm:block lg:hidden xl:left-[56%] xl:top-[74%] xl:z-10 xl:block xl:w-49 xl:rotate-[-0.5deg] 2xl:top-[72.5%] 2xl:w-56"
        delay={0.9}
        duration={7}
      >
        <OutreachCard />
      </Floating>

      {/* Handgeschreven notities: vertellen het productverhaal, alleen waar er ruimte is */}
      <Annotation
        lines={hero.annotations.cards}
        arrow="down-right"
        className="absolute left-[43.4%] top-[10%] z-40 hidden xl:block"
        arrowClassName="-mt-0.5 ml-28"
        delay={1.2}
      />
      <Annotation
        lines={hero.annotations.student}
        arrow="down-left"
        className="absolute left-[81.5%] top-[10.5%] z-40 hidden xl:block"
        arrowClassName="-mt-0.5 -ml-3"
        delay={1.4}
      />
    </div>
  );
}
