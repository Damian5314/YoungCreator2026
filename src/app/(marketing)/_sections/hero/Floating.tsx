import type { ReactNode } from 'react';

interface FloatingProps {
  /** Absolute-position utilities that place the card in the composition. */
  className?: string;
  /** Tailwind rotate utility, e.g. `-rotate-2` or `rotate-[1.5deg]`. */
  rotate?: string;
  /** Stagger, in seconds, for both the reveal and the idle float. */
  delay?: number;
  /** Idle float duration in seconds (varying this keeps cards out of sync). */
  duration?: number;
  /** Depth of the card in the stack. */
  z?: string;
  /** Drives the mount reveal — passed down from the hero. */
  shown: boolean;
  children: ReactNode;
}

/**
 * Positions a card in the floating composition and layers three independent
 * transforms so they never fight each other:
 *   floatLayer  → keyframe bob (translateY)
 *   revealLayer → rotation + mount reveal (opacity/translateY)
 *   hoverLayer  → quick lift on hover
 */
export function Floating({
  className = '',
  rotate = '',
  delay = 0,
  duration = 6,
  z = 'z-10',
  shown,
  children,
}: FloatingProps) {
  return (
    <div className={`absolute ${z} ${className}`}>
      <div
        className="hero-float"
        style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      >
        <div
          className={`${rotate} transition-[opacity,transform] duration-700 ease-out ${
            shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${delay}s` }}
        >
          <div className="transition-transform duration-300 ease-out hover:-translate-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
