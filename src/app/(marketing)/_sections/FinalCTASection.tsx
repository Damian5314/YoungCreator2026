import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { RevealGroup } from '../_components/RevealGroup';
import { getT } from '@/i18n/server';
import { buildLanding } from '../_content/landing';
import { CTAAnnotation } from './cta/CTAAnnotation';
import { CTAContent } from './cta/CTAContent';

/**
 * De zonsondergang als filmische achtergrond. Desktop: vult de hele kaart, links iets
 * donkerder voor de kop. Mobiel/tablet: een beeld bovenin dat onderin overloopt in de
 * donkere kaart, zodat de tekst nooit over de student valt.
 */
async function CTABackground() {
  const { media } = buildLanding((await getT()).landing);

  return (
    <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[62%] sm:h-[60%] lg:inset-0 lg:h-auto">
      <div data-reveal-play className="absolute inset-0">
        <div className="absolute inset-0 animate-settle motion-reduce:animate-none">
          <Image
            src={media.cta.src}
            alt={media.cta.alt}
            fill
            sizes="(min-width: 1440px) 1320px, 100vw"
            className="object-cover object-[69%_center] contrast-[0.97] saturate-[0.9] lg:object-[45%_center] xl:object-[25%_center]"
          />
        </div>
      </div>
      {/* Filmische kleur: burgundy/navy in de schaduwen, zacht perzik in de lucht */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(58_22_44/0.6),transparent_60%),linear-gradient(to_bottom,rgb(255_196_160/0.22),transparent_45%)] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-45% to-[#120c0b] lg:hidden" />
      <div className="absolute inset-0 hidden bg-linear-to-r from-[rgb(7_10_9/0.55)] via-[rgb(7_10_9/0.38)] via-45% to-[rgb(7_10_9/0.1)] lg:block" />
    </div>
  );
}

/**
 * Het emotionele slotbeeld van de pagina: een student in een Nederlandse stad bij
 * zonsondergang, met één duidelijke actie. Bewust zonder kaarten, cijfers of extra UI.
 */
export function FinalCTASection() {
  return (
    <section id="cta" aria-labelledby="cta-title" className="scroll-mt-24 pb-20 lg:pb-28">
      <Container>
        <RevealGroup className="relative isolate flex min-h-[47rem] flex-col justify-end overflow-hidden rounded-[30px] bg-[#120c0b] sm:min-h-[40rem] lg:min-h-[28rem] lg:justify-center xl:min-h-[30rem]">
          <CTABackground />
          <CTAContent />
          <CTAAnnotation />
        </RevealGroup>
      </Container>
    </section>
  );
}
