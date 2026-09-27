import { ArrowRight, GraduationCap, Play } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { WatchStoryLink } from '../story/WatchStoryLink';

/** Rustige entree: elk blok komt iets later op dan het vorige. */
const RISE = 'motion-safe:animate-rise';
const after = (ms: number) => ({ animationDelay: `${ms}ms` });

/** Handgetekende lime onderstreping onder de groene zinsnede — bewust zacht. */
function HandUnderline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 20"
      preserveAspectRatio="none"
      fill="none"
      className="draw-in absolute -bottom-[0.1em] left-[-1%] -z-10 h-[0.2em] w-[102%] text-lime/55"
      style={{ animationDelay: '700ms' }}
    >
      <path
        d="M4 13.5C52 8 110 5.5 170 6C214 6.4 256 8.6 296 11.5"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export async function HeroCopy() {
  const { hero } = buildLanding((await getT()).landing);
  const { lead, accent } = hero.headline;

  return (
    <>
      <p
        style={after(0)}
        className={`${RISE} inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-[13px] font-medium text-primary-hover`}
      >
        <GraduationCap className="size-4" aria-hidden />
        {hero.eyebrow}
      </p>

      <h1
        id="hero-title"
        style={after(90)}
        className={`${RISE} mt-6 text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[3.1rem] lg:text-[3.3rem] xl:text-[clamp(3.55rem,4.3vw,4.2rem)]`}
      >
        {lead.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <span className="block text-primary">{accent[0]}</span>
        <span className="relative isolate inline-block text-primary">
          {accent[1]}
          <HandUnderline />
        </span>
      </h1>

      <p
        style={after(180)}
        className={`${RISE} mt-8 max-w-[29rem] text-[17px] leading-relaxed text-muted-foreground lg:mt-9`}
      >
        {hero.body}
      </p>

      {/* Mobiel: twee even brede knoppen onder elkaar, net als in de slot-CTA */}
      <div style={after(270)} className={`${RISE} mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center`}>
        <ButtonLink
          href={hero.primaryCta.href}
          shape="pill"
          size="lg"
          className="h-13 w-full px-7 text-[15px] font-semibold shadow-[0_10px_24px_-10px_rgb(8_127_99/0.65)] hover:-translate-y-px sm:w-auto"
        >
          {hero.primaryCta.label}
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <WatchStoryLink
          href={hero.secondaryCta.href}
          className="h-13 w-full border-foreground/12 bg-white/80 pl-2 pr-6 text-[15px] font-semibold hover:-translate-y-px hover:bg-white sm:w-auto"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary">
            <Play className="size-3.5 fill-current" aria-hidden />
          </span>
          {hero.secondaryCta.label}
        </WatchStoryLink>
      </div>

      <p style={after(330)} className={`${RISE} mt-4 text-[13px] text-muted-foreground`}>
        {hero.note[0]}
        <span className="mx-2" aria-hidden>
          •
        </span>
        {hero.note[1]}
      </p>

      <ul
        style={after(400)}
        className={`${RISE} mt-10 flex max-w-[33rem] flex-col lg:mt-8 gap-3 sm:flex-row sm:flex-wrap sm:gap-x-12`}
      >
        {hero.benefits.map(({ icon: Icon, label: [first, second] }) => (
          <li key={first} className="flex items-start gap-2.5 text-[13.5px] font-medium leading-snug text-foreground/80">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span className="sm:whitespace-nowrap">
              {first} <br className="hidden sm:inline" />
              {second}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
