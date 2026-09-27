import type { CSSProperties } from 'react';

/**
 * Props voor een element dat binnen een RevealGroup binnenkomt: fade + een klein
 * stukje omhoog (of vanaf rechts). Los van RevealGroup zodat server components het ook kunnen gebruiken.
 */
export function revealItem(delayMs = 0, distancePx = 15, { from = 'below', durationMs = 800 }: RevealOptions = {}) {
  return {
    'data-reveal': from === 'right' ? 'right' : '',
    style: {
      '--reveal-delay': `${delayMs}ms`,
      '--reveal-distance': `${distancePx}px`,
      '--reveal-duration': `${durationMs}ms`,
    } as CSSProperties,
  };
}

interface RevealOptions {
  from?: 'below' | 'right';
  durationMs?: number;
}
