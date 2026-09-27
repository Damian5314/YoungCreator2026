'use client';

import type { Ref } from 'react';
import { FlaskConical, MapPin } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { introFlow, NoteBanner, Spark, StepNumber } from './IntroParts';

interface IntroStepDetailProps {
  /** Positie in introFlow (0 = Know me). */
  index: number;
  demoMode: boolean;
  headingRef: Ref<HTMLHeadingElement>;
}

/** Stappenbalk bovenaan: dezelfde drie stappen als de kaarten, de huidige gemarkeerd. */
function StepTracker({ active }: { active: number }) {
  const t = useT().onboarding.overview;

  return (
    <ol aria-label={t.label} className="mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
      {introFlow.map(({ key }, index) => {
        const isActive = index === active;
        return (
          <li key={key} aria-current={isActive ? 'step' : undefined} className="flex items-center gap-1.5 sm:gap-2">
            {index > 0 && <span aria-hidden className="w-3 border-t-2 border-dotted border-[#CBEEDD] sm:w-8" />}
            <span
              className={`inline-flex items-center gap-2 rounded-full py-1 pl-1 text-[13px] font-semibold ${
                isActive ? 'bg-[#EAF7EF] pr-3 text-[#087F63]' : 'pr-1 text-[#66736E] sm:pr-3'
              }`}
            >
              <StepNumber index={index} muted={!isActive} />
              {/* Mobiel alleen de naam van de huidige stap, anders past de balk niet */}
              <span className={isActive ? '' : 'max-sm:sr-only'}>{t[key].title}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Slide per stap: links de uitleg (titel, tekst, waar je het vindt), rechts een groter
 * voorbeeld van de product-UI op een warm vlak.
 */
export function IntroStepDetail({ index, demoMode, headingRef }: IntroStepDetailProps) {
  const t = useT().onboarding;
  const { key, icon: Icon, Visual } = introFlow[index];
  const step = t.steps[key];
  // Stap 2: het verschil met vacaturesites, als losse zin met nadruk
  const highlight = key === 'hunt' ? t.steps.hunt.highlight : undefined;
  const note = key === 'hunt' && demoMode ? t.steps.hunt.demoNote : undefined;

  return (
    <>
      <StepTracker active={index} />

      <div className="mt-[clamp(18px,3.4svh,36px)] grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <div>
          <span className="grid size-14 place-items-center rounded-[18px] bg-[#EAF7EF] text-[#087F63]">
            <Icon className="size-6" aria-hidden />
          </span>
          <h2
            ref={headingRef}
            id="welcome-intro-title"
            tabIndex={-1}
            className="mt-5 text-balance text-[26px] font-bold leading-[1.12] tracking-[-0.025em] text-[#101820] focus:outline-none sm:text-[32px]"
          >
            {step.title}
          </h2>
          <p className="mt-3 text-pretty text-[16px] leading-[1.6] text-[#66736E] sm:text-[17px]">{step.body}</p>
          {highlight && (
            <p className="mt-2 text-pretty text-[16px] font-semibold leading-snug text-[#101820] sm:text-[17px]">
              {highlight}
            </p>
          )}

          {note && (
            <NoteBanner icon={FlaskConical} className="mt-5 text-[14px]">
              {note}
            </NoteBanner>
          )}

          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#F7F6F1] px-3 py-1.5 text-[13px] font-medium text-[#66736E] ring-1 ring-[rgb(16_24_32/0.06)]">
            <MapPin className="size-3.5 text-[#087F63]" aria-hidden />
            <span>
              <span className="sr-only">{t.dialog.whereToFind}</span>
              {step.where}
            </span>
          </p>
        </div>

        {/* Voorbeeld: puur ter illustratie */}
        <div
          aria-hidden
          className="relative grid min-h-[200px] place-items-center overflow-hidden rounded-[22px] bg-[#F7F6F1] p-6 sm:min-h-[260px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(203_238_221/0.55),transparent_65%)]" />
          <Spark className="absolute right-5 top-4 size-8" delay={0.5} />
          <div className="relative flex w-full max-w-[300px] flex-col items-center gap-1.5">
            <Visual />
          </div>
        </div>
      </div>
    </>
  );
}
