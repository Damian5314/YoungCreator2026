import { Eyebrow } from '../../_components/Eyebrow';
import { revealItem } from '../../_components/revealItem';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/** Dunne, licht wiebelende mint onderstreping: met de hand getrokken, niet neon. */
function HandUnderline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      fill="none"
      className="draw-in absolute -bottom-[0.12em] left-[-1%] -z-10 h-[0.24em] w-[102%] text-[#6fcfa6] dark:text-[#45c29c]/70"
      style={{ animationDelay: '650ms' }}
    >
      <path
        d="M3 10.5C36 6.5 64 12.5 100 9C138 5.5 164 11.8 202 8.6C236 5.8 266 10.2 297 6.5"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export async function SectionIntro() {
  const { signals } = buildLanding((await getT()).landing);

  return (
    <>
      <div {...revealItem(0)}>
        <Eyebrow>{signals.eyebrow}</Eyebrow>
      </div>

      <h2
        id="beyond-title"
        data-reveal-play
        {...revealItem(90)}
        className="mt-5 text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[3.1rem] xl:text-[3.7rem]"
      >
        <span className="block">{signals.title.lead}</span>
        <span className="relative isolate inline-block text-primary">
          {signals.title.accent}
          <HandUnderline />
        </span>
      </h2>

      <p
        {...revealItem(180)}
        className="mt-7 max-w-[32.5rem] text-[17px] leading-[1.6] text-muted-foreground lg:text-[19px]"
      >
        {signals.body}
      </p>
    </>
  );
}
