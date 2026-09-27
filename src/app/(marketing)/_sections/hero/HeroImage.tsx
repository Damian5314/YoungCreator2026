import Image from 'next/image';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/**
 * Eén foto-element voor alle schermen (dus ook één download):
 * - mobiel/tablet: afgeronde, ingezoomde foto in de flow, gericht op de student;
 * - desktop: rechts verankerde achtergrond op ware verhoudingen, die links, boven
 *   en onder zacht in de pagina overloopt. De kaarten (HeroScene) delen dezelfde maat.
 */
export async function HeroImage() {
  const { media } = buildLanding((await getT()).landing);

  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-block shadow-soft sm:aspect-[4/3] lg:absolute lg:right-0 lg:top-0 lg:z-0 lg:aspect-[1671/941] lg:h-[var(--hero-h)] lg:overflow-visible lg:rounded-none lg:shadow-none">
      <Image
        src={media.hero.src}
        alt={media.hero.alt}
        fill
        preload
        sizes="(min-width: 1024px) 1600px, 100vw"
        className="origin-[100%_42%] scale-[1.32] object-cover object-right sm:scale-[1.45] lg:hero-photo-blend lg:origin-center lg:scale-100 lg:object-center"
      />
    </div>
  );
}
