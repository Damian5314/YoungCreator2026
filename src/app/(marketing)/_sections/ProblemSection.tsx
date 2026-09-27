import { Container } from '@/components/layout/Container';
import { revealItem } from '../_components/revealItem';
import { story } from '../_content/landing';
import { ProblemSignalCard } from './story/ProblemSignalCard';
import { StoryAnnotation } from './story/StoryAnnotation';
import { StoryBackground } from './story/StoryBackground';
import { StoryContent } from './story/StoryContent';

/* Desktop: de drie "gedachten" rechts van het gezicht, licht verspringend en een fractie gedraaid.
   Tablet: een rij over de onderkant van de foto. Mobiel: een stapel die alleen de onderrand
   van de foto overlapt, zodat het gezicht vrij blijft. */
const cardPlacement = [
  'lg:absolute lg:right-[6%] lg:top-[11%] lg:w-52 lg:-rotate-1 xl:w-60',
  'lg:absolute lg:right-[3%] lg:top-[39%] lg:w-52 lg:rotate-1 xl:w-60',
  'lg:absolute lg:right-[5%] lg:bottom-[9%] lg:w-60 lg:rotate-[-0.5deg] xl:w-[17rem]',
];

// S: alleen verantwoordelijk voor het emotionele verhaal op de landingspagina
export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="story-title" className="scroll-mt-24 py-20 lg:py-28">
      <Container>
        <div className="story-frame relative isolate flex flex-col overflow-hidden rounded-panel bg-[#0c1316] text-white shadow-[0_30px_80px_-30px_rgb(16_24_32/0.45)] lg:block lg:rounded-block dark:ring-1 dark:ring-white/10">
          <StoryContent />

          <StoryBackground>
            <ul className="relative -mt-16 grid gap-2.5 px-4 pb-4 sm:absolute sm:inset-x-6 sm:bottom-6 sm:mt-0 sm:grid-cols-3 sm:p-0 lg:static lg:block">
              {story.statements.map((statement, index) => (
                <li key={statement.title} {...revealItem(300 + index * 130)} className={cardPlacement[index]}>
                  <ProblemSignalCard title={statement.title} detail={statement.detail} emphasis={index === 2} />
                </li>
              ))}
            </ul>
            <StoryAnnotation />
          </StoryBackground>
        </div>
      </Container>
    </section>
  );
}
