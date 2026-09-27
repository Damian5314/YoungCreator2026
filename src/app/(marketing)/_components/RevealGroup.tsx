'use client';

import { useEffect, useRef, useState, type HTMLAttributes } from 'react';

type RevealState = 'idle' | 'pending' | 'in';

interface RevealGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Hoe ver (in % van de schermhoogte) de groep boven de onderrand moet komen voordat hij binnenkomt. */
  offset?: number;
}

/**
 * Laat kinderen met `revealItem()` gestaffeld binnenkomen zodra de groep in beeld
 * scrolt (CSS in globals.css). Alleen buiten beeld wordt iets verborgen, dus zonder
 * JS of met reduced motion is alles gewoon zichtbaar.
 */
export function RevealGroup({ offset = 20, ...props }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>('idle');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setState('in');
      return;
    }

    // De eerste callback beschrijft de huidige positie: al ver genoeg in beeld = meteen tonen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in');
          observer.disconnect();
        } else {
          setState((current) => (current === 'idle' ? 'pending' : current));
        }
      },
      { rootMargin: `0px 0px -${offset}% 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [offset]);

  return <div ref={ref} data-reveal-group={state} {...props} />;
}
