'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { useT } from '@/i18n/I18nProvider';
import { AuthSignalCard } from './AuthSignalCard';

// Login en registratie delen de layout, maar elk heeft een eigen foto. De signaallijn staat in
// foto-pixels (1672×941), knooppunt en notitie in % van de foto: net rechts van het hoofd en boven het water.
// Teksten (alt, notitie, signaal) komen uit de authLayout-dictionary.
const scenes = {
  login: {
    photo: {
      src: '/images/auth/login-student-canal.png',
    },
    signalLine: 'M455 409C527 348 518 268 343 221',
    node: 'left-[27.2%] top-[43.5%]',
    annotation: {
      position: 'left-[28%] top-[63.5%]',
    },
  },
  register: {
    photo: {
      src: '/images/auth/register-student-canal.png',
    },
    // Het haar van de studente loopt verder naar rechts door, dus lijn en notitie schuiven iets op
    signalLine: 'M510 395C568 329 535 259 351 221',
    node: 'left-[30.5%] top-[42%]',
    annotation: {
      position: 'left-[31.5%] top-[62%]',
    },
  },
};

function useAuthScene() {
  const t = useT().authLayout;
  const key = usePathname() === '/register' ? 'register' : 'login';
  const scene = scenes[key];
  return {
    ...scene,
    photo: { ...scene.photo, alt: t.photoAlt },
    annotation: { ...scene.annotation, lines: t.annotations[key] },
    mobileSignal: t.mobileSignal,
  };
}

// Een laag met exact de verhouding van de foto: alles erop staat in % van de foto,
// zodat kaart, lijn en notitie op elke schermmaat op dezelfde plek rond de student blijven.
const photoBox = 'absolute left-0 top-0 h-full aspect-[1672/941]';

/**
 * Desktop: de foto vult de linkerkolom en loopt zacht uit in het off-white van de formulierkolom.
 * Eén bedrijfssignaal, één groene signaallijn naar de student en één handgeschreven notitie.
 */
export function AuthVisual() {
  const { photo, signalLine, node, annotation } = useAuthScene();

  return (
    <div className="relative hidden lg:block">
      {/* Foto: loopt 10rem door onder de formulierkolom en vervaagt daar naar #F7F6F1 */}
      <div className="absolute inset-y-0 left-0 w-[calc(100%+10rem)] overflow-hidden [mask-image:linear-gradient(to_right,#000_calc(100%-18rem),transparent)]">
        <div className={photoBox}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover motion-safe:animate-fade"
          />
        </div>
      </div>

      <div className={`${photoBox} pointer-events-none`}>
        {/* Signaallijn: van de student omhoog naar het bedrijfssignaal (coördinaten in foto-pixels) */}
        <svg
          viewBox="0 0 1672 941"
          fill="none"
          aria-hidden
          className="draw-in absolute inset-0 size-full"
          style={{ animationDelay: '0.9s' }}
        >
          <path
            d={signalLine}
            pathLength={1}
            stroke="#8ED8B0"
            strokeOpacity={0.5}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <span
          aria-hidden
          className={`absolute ${node} size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CBEEDD] ring-4 ring-[#8ED8B0]/30 motion-safe:animate-fade`}
          style={{ animationDelay: '1.6s' }}
        />

        <AuthSignalCard className="absolute left-[3.5%] top-[14%] w-[17%] min-w-[236px] max-w-[284px] motion-safe:animate-fade [animation-delay:0.5s]" />

        {/* Handgeschreven notitie boven het water, rechts van de student */}
        <div
          aria-hidden
          className={`absolute ${annotation.position} hidden select-none rounded-[20px] bg-[radial-gradient(ellipse_at_center,rgb(250_244_232/0.82),rgb(250_244_232/0.5)_60%,transparent_78%)] px-5 py-3 text-[#173A31] [text-shadow:0_1px_10px_rgb(255_248_236/0.95)] motion-safe:animate-rise xl:block`}
          style={{ animationDelay: '1.3s' }}
        >
          <p className="font-hand text-[26px] font-semibold leading-[1.02]">
            {annotation.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <svg viewBox="0 0 120 12" fill="none" className="draw-in ml-1 mt-1 h-2.5 w-24" style={{ animationDelay: '1.7s' }}>
            <path
              d="M2 8C28 4 62 3 118 6"
              pathLength={1}
              stroke="#087F63"
              strokeOpacity={0.6}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="absolute left-12 top-10 z-20 motion-safe:animate-fade xl:left-14">
        <Logo />
      </div>
    </div>
  );
}

/** Mobiel/tablet: een kleine uitsnede van dezelfde foto onder het formulier, met het signaal als label. */
export function AuthMobileVisual() {
  const { photo, mobileSignal } = useAuthScene();

  return (
    <div className="relative h-[260px] overflow-hidden rounded-[22px] shadow-soft motion-safe:animate-fade sm:h-[300px] lg:hidden">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 640px) 600px, 100vw"
        className="object-cover object-[22%_60%]"
      />
      <p className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full border border-white/75 bg-white/80 px-3 py-2 text-[12px] font-medium shadow-float backdrop-blur-[20px] sm:right-auto">
        <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
        <span className="truncate">
          <span className="font-semibold text-primary-hover">{mobileSignal.label}</span> {mobileSignal.text}
        </span>
      </p>
    </div>
  );
}
