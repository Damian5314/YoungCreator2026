import { CompanyNewsCard } from './CompanyNewsCard';
import { OpportunityCard } from './OpportunityCard';
import { OutreachCard } from './OutreachCard';
import { MatchCard } from './MatchCard';
import { Floating } from './Floating';

/** Handwritten annotation with a small hand-drawn arrow. Decorative, desktop-only. */
function Annotation({
  text,
  className,
  arrow,
  shown,
  delay,
}: {
  text: string;
  className: string;
  arrow: React.ReactNode;
  shown: boolean;
  delay: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-40 transition-opacity duration-700 ${
        shown ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <p className="font-[family-name:var(--font-hand)] text-xl leading-tight text-[var(--hero-ink)] drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
        {text}
      </p>
      {arrow}
    </div>
  );
}

/**
 * Desktop-only layer: the signal cards floating over the background photograph,
 * clustered in the calm central band so the student's face stays clear. Sits as
 * an absolute layer over the whole hero section (see HeroSection).
 */
export function HeroDesktopScene({ shown }: { shown: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 mx-auto hidden max-w-[110rem] lg:block">
      {/* pointer-events re-enabled per card via the wrapper below */}
      <div className="pointer-events-auto contents">
        <Floating
          className="top-[13%] right-[30%]"
          rotate="rotate-[1.5deg]"
          delay={0.15}
          duration={6.5}
          z="z-20"
          shown={shown}
        >
          <div className="scale-[0.97]">
            <CompanyNewsCard />
          </div>
        </Floating>

        <Floating
          className="top-[40%] right-[33%]"
          rotate="-rotate-[1.5deg]"
          delay={0.3}
          duration={7.5}
          z="z-30"
          shown={shown}
        >
          <OpportunityCard />
        </Floating>

        <Floating
          className="bottom-[15%] right-[40%]"
          rotate="-rotate-1"
          delay={0.45}
          duration={7}
          z="z-20"
          shown={shown}
        >
          <OutreachCard />
        </Floating>

        <Floating
          className="bottom-[11%] right-[13%]"
          rotate="rotate-2"
          delay={0.6}
          duration={6}
          z="z-30"
          shown={shown}
        >
          <MatchCard />
        </Floating>
      </div>

      {/* Handwritten annotations */}
      <Annotation
        text="We spot the signals."
        className="top-[6%] right-[46%]"
        shown={shown}
        delay={0.8}
        arrow={
          <svg
            className="mt-1 ml-16 text-[var(--hero-ink)]"
            width="70"
            height="42"
            viewBox="0 0 70 42"
            fill="none"
            aria-hidden
          >
            <path d="M2 4C22 2 52 6 60 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M52 26L61 31L58 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />

      <Annotation
        text="Turn company news into opportunity."
        className="top-[34%] right-[52%] w-44 text-right"
        shown={shown}
        delay={0.95}
        arrow={
          <svg
            className="mt-1 ml-auto text-[var(--hero-ink)]"
            width="72"
            height="40"
            viewBox="0 0 72 40"
            fill="none"
            aria-hidden
          >
            <path d="M2 30C24 34 50 30 64 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M56 8L65 6L62 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}
