import { Container } from '@/components/layout/Container';
import { HeroCopy } from './hero/HeroCopy';
import { HeroImage } from './hero/HeroImage';
import { HeroScene } from './hero/HeroScene';
import { UniversityTrustBar } from './trust/UniversityTrustBar';

/**
 * Twee-zijdige hero: links de boodschap, rechts de student met zwevende product-kaarten,
 * onderin een compacte trust-balk.
 * --hero-h is de hoogte van foto + kaartenlaag. Die houdt rekening met de schermhoogte,
 * zodat de trust-balk (die direct onder de foto begint) zonder scrollen in beeld valt.
 */
export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-6 [--hero-h:clamp(760px,min(58vw,100svh_-_112px),900px)] lg:pb-5"
    >
      {/* Zachte waas achter de tekstkolom: tekst blijft leesbaar waar de foto doorloopt */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-[1] hidden w-[58%] bg-linear-to-r from-background from-35% via-background/80 to-transparent lg:block xl:w-[46%]"
      />
      <Container className="relative lg:static">
        <div className="relative z-10 pb-12 pt-28 sm:pt-32 lg:flex lg:min-h-[var(--hero-h)] lg:max-w-[30rem] lg:flex-col lg:justify-center lg:pb-8 lg:pt-[104px] xl:max-w-[35rem]">
          <HeroCopy />
        </div>
        <HeroImage />
        <HeroScene />
      </Container>
      <Container className="relative z-30 mt-10 lg:-mt-2">
        <UniversityTrustBar />
      </Container>
    </section>
  );
}
