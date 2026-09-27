'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SplashBackground } from './SplashBackground';
import { SplashProgress, SplashStatus, SplashTagline, UnlistedLogo, UnlistedWordmark } from './SplashBrand';
import styles from './splash.module.css';

interface UnlistedSplashProps {
  /** De uitgang begint: vanzelf aan het eind, of eerder omdat de bezoeker klikt, scrolt of een toets indrukt. */
  onExit?: () => void;
  /** De splash is helemaal weg en mag uit de DOM. */
  onComplete: () => void;
}

// Vangnet als animaties niet lopen (bijv. uitgeschakeld in de browser)
const FALLBACK_MS = 6000;

/** Laat de nog wachtende (vertraagde) animaties van deze elementen nu meteen beginnen. */
export function startExitNow(elements: Iterable<Element>) {
  for (const element of elements) {
    for (const animation of element.getAnimations()) {
      const delay = Number(animation.effect?.getTiming().delay ?? 0);
      if (Number(animation.currentTime ?? 0) < delay) animation.currentTime = delay;
    }
  }
}

/**
 * Korte merkentree (~4,4s): achtergrond, banen met signalen, logo, woordmerk, tagline en een
 * voortgangsbalk, waarna alles oplost in de site. De tijdlijn zelf staat in splash.module.css.
 * Puur decoratief (aria-hidden): de pagina eronder is meteen bereikbaar voor screenreaders.
 */
export function UnlistedSplash({ onExit, onComplete }: UnlistedSplashProps) {
  const root = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const completedRef = useRef(false);
  const callbacks = useRef({ onExit, onComplete });

  useEffect(() => {
    callbacks.current = { onExit, onComplete };
  });

  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    // Scrollen mag weer: de site is nu nog onzichtbaar, dus een terugkomende scrollbalk valt niet op
    setLeaving(true);
    callbacks.current.onExit?.();
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    callbacks.current.onComplete();
  }, []);

  const skip = useCallback(() => {
    const element = root.current;
    if (!element || leavingRef.current) return;
    startExitNow([element, ...element.querySelectorAll('[data-splash-exit]')]);
    leave();
  }, [leave]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    // Kwam React pas laat op gang, dan kan de uitgang al bezig of zelfs klaar zijn
    const style = getComputedStyle(element);
    if (style.visibility === 'hidden') {
      leave();
      complete();
      return;
    }
    if (Number(style.opacity) < 1) leave();

    const fallback = window.setTimeout(() => {
      leave();
      complete();
    }, FALLBACK_MS);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [leave, complete, skip]);

  return (
    <div
      ref={root}
      aria-hidden
      data-lock={leaving ? undefined : ''}
      className={styles.root}
      onPointerDown={skip}
      // Alleen de eigen uitgang van de root telt, niet de animaties van de lagen erin
      onAnimationStart={(event) => event.target === event.currentTarget && leave()}
      onAnimationEnd={(event) => event.target === event.currentTarget && complete()}
    >
      <SplashBackground />
      <div data-splash-exit className={styles.contentWrap}>
        <div className={styles.content}>
          <UnlistedLogo />
          <UnlistedWordmark />
          <SplashTagline />
          <SplashProgress />
          <SplashStatus />
        </div>
      </div>
    </div>
  );
}
