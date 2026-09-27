import type { ReactNode } from 'react';

interface FloatingProps {
  /** Positie + breedte in de desktop-compositie (lg:/xl: utilities); op mobiel staat de kaart in de stapel. */
  className?: string;
  /** Start van de entree en van het zweven, in seconden. */
  delay?: number;
  /** Duur van één zweefbeweging; verschillende duren houden de kaarten uit de maat. */
  duration?: number;
  children: ReactNode;
}

/**
 * Plaatst een hero-kaart en stapelt drie losse transforms zodat ze elkaar nooit
 * bijten: entree (opkomen) → zweven (alleen desktop) → hover-lift.
 */
export function Floating({ className = '', delay = 0, duration = 7, children }: FloatingProps) {
  return (
    <div className={`relative lg:pointer-events-auto lg:absolute ${className}`}>
      <div className="motion-safe:animate-rise" style={{ animationDelay: `${delay}s` }}>
        <div
          className="lg:motion-safe:animate-bob"
          style={{ animationDuration: `${duration}s`, animationDelay: `${delay + 1}s` }}
        >
          <div className="transition-transform duration-300 ease-soft hover:-translate-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
