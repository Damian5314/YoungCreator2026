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
      <p className="font-[family-name:var(--font-hand)] text-xl leading-tight text-[var(--hero-ink)]">
        {text}
      </p>
      {arrow}
    </div>
  );
}

export function HeroVisual({ shown }: { shown: boolean }) {
  return (
    <div className="relative">
      {/* --- Photograph -------------------------------------------------- */}
      <div
        className={`relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e9f1ea] to-[#d8e4d9] shadow-2xl shadow-black/10 transition-all duration-1000 ease-out sm:max-w-lg ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Real editorial photo; the gradient above shows through if it fails to load. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80"
          alt="International student working on a laptop outdoors in the Netherlands"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        {/* Soften the left edge so the photo melts into the page. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#f8f6f0] to-transparent" />
      </div>

      {/* --- Floating composition (desktop) ------------------------------ */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="pointer-events-auto contents">
          <Floating
            className="-top-6 right-0 xl:-right-10"
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
            className="top-[42%] -right-4 xl:-right-14"
            rotate="-rotate-[1.5deg]"
            delay={0.3}
            duration={7.5}
            z="z-30"
            shown={shown}
          >
            <OpportunityCard />
          </Floating>

          <Floating
            className="bottom-10 -left-6 xl:-left-16"
            rotate="-rotate-1"
            delay={0.45}
            duration={7}
            z="z-20"
            shown={shown}
          >
            <OutreachCard />
          </Floating>

          <Floating
            className="-bottom-8 left-[28%]"
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
          className="-top-10 left-2"
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
              <path
                d="M2 4C22 2 52 6 60 30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
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
          className="top-[36%] -left-4 w-40"
          shown={shown}
          delay={0.95}
          arrow={
            <svg
              className="mt-1 ml-24 text-[var(--hero-ink)]"
              width="72"
              height="40"
              viewBox="0 0 72 40"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 30C24 34 50 30 64 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
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

      {/* --- Stacked composition (mobile / tablet) ----------------------- */}
      <div className="mt-8 flex flex-col items-center gap-4 lg:hidden">
        <CompanyNewsCard />
        <OpportunityCard />
        <OutreachCard />
        <MatchCard />
      </div>
    </div>
  );
}
