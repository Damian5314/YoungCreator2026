'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SPLASH_COOKIE } from './splashCookie';
import { startExitNow, UnlistedSplash } from './UnlistedSplash';
import styles from './splash.module.css';

// Eén keer per bezoek. De cookie dekt verversen (de server rendert dan geen splash); deze vlag dekt
// terugnavigeren binnen de app, waarbij de router een eerder opgehaalde pagina kan hergebruiken.
let playedThisVisit = false;

/**
 * Zet de openingsanimatie over de pagina heen. De pagina staat er direct onder in de DOM en komt
 * op (0 → 1, 8px omhoog) terwijl de splash oplost.
 */
export function SplashGate({ show, children }: { show: boolean; children: ReactNode }) {
  const [active, setActive] = useState(() => show && !playedThisVisit);
  const site = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    // Meteen bij de start: wie tijdens de animatie ververst, gaat daarna direct naar de site
    playedThisVisit = true;
    document.cookie = `${SPLASH_COOKIE}=1; path=/; samesite=lax`;
  }, [active]);

  return (
    <>
      {active && (
        <UnlistedSplash
          // Overgeslagen? Dan komt de site nu al op, samen met de uitgang van de splash
          onExit={() => site.current && startExitNow([site.current])}
          onComplete={() => setActive(false)}
        />
      )}
      <div ref={site} data-splash-site={active ? '' : undefined} className={styles.site}>
        {children}
      </div>
    </>
  );
}
