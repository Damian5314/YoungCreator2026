'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { completeIntro } from '@/lib/actions/onboarding';
import { introFlow } from './IntroParts';
import { IntroStepDetail } from './IntroStepDetail';
import { IntroWelcome } from './IntroWelcome';

interface WelcomeIntroProps {
  firstName: string | null;
  credits: number;
  demoMode: boolean;
}

// Hier vult een nieuwe gebruiker zijn profiel in; de laatste knop stuurt ernaartoe
const PROFILE_PATH = '/search/preferences';

// Welkom + de drie stappen
const STEP_COUNT = introFlow.length + 1;

const textButton =
  'inline-flex h-11 items-center gap-1.5 rounded-[12px] px-4 text-[15px] font-medium text-[#66736E] transition-colors duration-200 hover:text-[#087F63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F63]';
const primaryButton =
  'group inline-flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[13px] bg-[#087F63] px-6 text-[15.5px] font-semibold text-white shadow-[0_10px_24px_-12px_rgb(8_127_99/0.7)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-[#0B6B55] hover:shadow-[0_16px_30px_-12px_rgb(8_127_99/0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F63] sm:flex-none lg:h-[clamp(46px,6.6svh,54px)]';
const arrow = 'size-[18px] transition-transform duration-200 group-hover:translate-x-[3px]';

/**
 * Korte uitleg na de eerste keer inloggen: wat de agent doet en waar alles staat.
 * Native <dialog> (focus-trap en Esc zitten er standaard in). Sluiten op welke manier dan ook
 * telt als "gezien", zodat de introductie niet blijft terugkomen.
 * Altijd licht (vaste kleuren), in dezelfde stijl als de landingspagina en de auth-pagina's.
 */
export function WelcomeIntro({ firstName, credits, demoMode }: WelcomeIntroProps) {
  const t = useT().onboarding;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const saved = useRef(false);
  const [step, setStep] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const isLast = step === STEP_COUNT - 1;
  const creditsNote =
    credits === 1 ? t.welcome.noteFree : credits > 1 ? t.welcome.noteCredits(credits) : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Focus op de kop (niet op het sluitkruisje): screenreaders lezen bij elke stap de nieuwe titel voor
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function markSeen() {
    if (saved.current) return;
    saved.current = true;
    void completeIntro();
  }

  function close() {
    dialogRef.current?.close();
  }

  function finish() {
    close();
    if (pathname !== PROFILE_PATH) router.push(PROFILE_PATH);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="welcome-intro-title"
      onClose={markSeen}
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(68rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[30px] border border-[rgb(16_24_32/0.06)] bg-white p-0 text-[#101820] shadow-[0_30px_90px_rgb(16_24_32/0.18)] [color-scheme:light] backdrop:bg-[rgb(16_24_32/0.38)] backdrop:backdrop-blur-[8px] motion-safe:animate-pop-in"
    >
      {/* Desktop: ruimtes schalen mee met de schermhoogte, zodat de dialoog op een laptop zonder scrollen past */}
      <div className="p-6 sm:p-10 lg:p-[clamp(28px,4.6svh,56px)]">
        <header className="flex items-center justify-between gap-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#66736E]">
            {step === 0 ? t.dialog.gettingStarted : t.dialog.stepOf(step, STEP_COUNT - 1)}
          </p>
          <button
            type="button"
            onClick={close}
            aria-label={t.dialog.close}
            className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-[#101820] transition-colors duration-200 hover:bg-[#EAF7EF] hover:text-[#087F63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F63]"
          >
            <X className="size-5" strokeWidth={1.6} aria-hidden />
          </button>
        </header>

        {/* key: bij elke stap opnieuw inkomen (alleen zonder 'reduce motion') */}
        <div key={step} className="motion-safe:animate-[fade_0.35s_var(--ease-soft)_both]">
          {step === 0 ? (
            <IntroWelcome firstName={firstName} note={creditsNote} headingRef={headingRef} />
          ) : (
            <IntroStepDetail index={step - 1} demoMode={demoMode} headingRef={headingRef} />
          )}
        </div>

        <footer
          className="mt-[clamp(16px,2.8svh,36px)] flex flex-col gap-5 motion-safe:animate-fade sm:flex-row sm:items-center sm:justify-between"
          style={{ animationDelay: '550ms' }}
        >
          <div className="flex items-center gap-2">
            {Array.from({ length: STEP_COUNT }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setStep(index)}
                aria-label={index === 0 ? t.dialog.goToWelcome : t.dialog.goToStep(index)}
                aria-current={index === step ? 'step' : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F63] ${
                  index === step ? 'w-7 bg-[#45C89C]' : 'w-2.5 bg-[#D7E1DC] hover:bg-[#B7CBC1]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {step === 0 ? (
              <button type="button" onClick={close} className={textButton}>
                {t.dialog.skip}
              </button>
            ) : (
              <button type="button" onClick={() => setStep(step - 1)} className={textButton}>
                <ArrowLeft className="size-4" aria-hidden />
                {t.dialog.back}
              </button>
            )}
            {isLast ? (
              <button type="button" onClick={finish} className={primaryButton}>
                {pathname === PROFILE_PATH ? t.dialog.letsGo : t.dialog.setUpProfile}
                <ArrowRight className={arrow} aria-hidden />
              </button>
            ) : (
              <button type="button" onClick={() => setStep(step + 1)} className={primaryButton}>
                {step === 0 ? t.dialog.showMe : t.dialog.next}
                <ArrowRight className={arrow} aria-hidden />
              </button>
            )}
          </div>
        </footer>
      </div>
    </dialog>
  );
}
