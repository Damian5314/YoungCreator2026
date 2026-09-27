'use client';

import type { Ref } from 'react';
import Image from 'next/image';
import { Coins } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { HandUnderline, introFlow, NoteBanner, Spark, StepNumber } from './IntroParts';

interface IntroWelcomeProps {
  firstName: string | null;
  /** Credits-melding; ontbreekt als er (nog) geen credits zijn. */
  note?: string;
  headingRef: Ref<HTMLHeadingElement>;
}

/**
 * Eerste slide: begroeting, wat Unlisted doet, je credits en de drie stappen als
 * verbonden kaarten (Know me → Find signals → Take action), elk met een mini-voorbeeld.
 */
export function IntroWelcome({ firstName, note, headingRef }: IntroWelcomeProps) {
  const t = useT().onboarding;

  return (
    <>
      <div className="mt-[clamp(14px,2.6svh,28px)] flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        {/* Ons logo naast de begroeting: wit vlak met een mint rand, zodat de groentinten goed uitkomen */}
        <span className="relative grid size-16 shrink-0 place-items-center rounded-[20px] bg-white shadow-[0_10px_28px_rgb(8_127_99/0.14)] ring-1 ring-[#CBEEDD] sm:size-[76px]">
          <Image src="/images/brand/logo.png" alt="" width={56} height={56} className="size-12 object-contain sm:size-14" />
          <Spark className="absolute -right-5 -top-5 size-7" />
        </span>
        <h2
          ref={headingRef}
          id="welcome-intro-title"
          tabIndex={-1}
          className="text-balance text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-[#101820] focus:outline-none sm:text-[36px] lg:text-[length:clamp(30px,4.6svh,44px)]"
        >
          <span className="block">{firstName ? t.welcome.greetingNamed(firstName) : t.welcome.greeting}</span>
          <span className="relative inline-block">
            {t.welcome.tagline}
            <HandUnderline className="absolute -bottom-2 right-0 h-2.5 w-[42%]" />
          </span>
        </h2>
      </div>

      {/* Desktop: credits naast de intro, zodat alles zonder scrollen in beeld past */}
      <div className="mt-[clamp(12px,2svh,20px)] lg:flex lg:items-center lg:gap-10">
        <p className="max-w-[850px] text-pretty text-[17px] leading-[1.55] text-[#66736E] lg:flex-1 lg:text-[18px]">
          {t.welcome.body}
        </p>

        {note && (
          <NoteBanner
            icon={Coins}
            className="mt-4 w-fit motion-safe:animate-fade-up lg:mt-0 lg:shrink-0"
            style={{ animationDelay: '150ms' }}
          >
            {note}
          </NoteBanner>
        )}
      </div>

      <ol
        aria-label={t.overview.label}
        className="mt-[clamp(16px,2.8svh,32px)] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {introFlow.map(({ key, icon: Icon, Preview }, index) => (
          <li
            key={key}
            className="relative flex flex-col rounded-[20px] border border-[rgb(16_24_32/0.08)] bg-white p-5 shadow-[0_8px_30px_rgb(16_24_32/0.05)] motion-safe:animate-fade-up sm:last:col-span-2 lg:p-[22px] lg:last:col-span-1"
            style={{ animationDelay: `${240 + index * 100}ms` }}
          >
            {/* Stippellijn naar de volgende stap: verticaal als de kaarten gestapeld zijn, horizontaal op één rij */}
            {index < introFlow.length - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-[37px] top-full h-[18px] border-l-2 border-dotted border-[#CBEEDD] sm:hidden lg:left-full lg:top-[35px] lg:block lg:h-0 lg:w-[26px] lg:border-l-0 lg:border-t-2"
              />
            )}

            <div className="flex items-center justify-between">
              <StepNumber index={index} />
              <Icon className="size-[18px] text-[#087F63]" aria-hidden />
            </div>
            <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.01em] text-[#101820]">{t.overview[key].title}</h3>
            <p className="mt-1 text-pretty text-[14px] leading-relaxed text-[#66736E]">{t.overview[key].text}</p>

            {/* Op heel lage laptopschermen vallen de voorbeelden weg; de uitleg blijft staan */}
            <div className="mt-auto pt-3 lg:[@media(max-height:700px)]:hidden">
              <div className="rounded-[14px] border border-[rgb(16_24_32/0.05)] bg-[#F7F6F1] p-3">
                <Preview />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
