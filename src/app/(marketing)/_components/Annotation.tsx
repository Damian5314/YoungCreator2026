/* Handgetekende pijlen (viewBox 80×60): zachte S-bocht met een open punt.
   Beide paden tekenen zichzelf in via .draw-in. */
const arrows = {
  'down-left': {
    line: 'M66 5C70 17 64 29 51 37C41 43 28 46 15 45.5',
    head: 'M23.5 39.5C20 41.8 17.4 43.6 14.8 45.6C18 47.2 21 48.8 24 51',
  },
  'down-right': {
    line: 'M12 5C8 17 14 29 27 37C37 43 50 46 63 45.5',
    head: 'M54.5 39.5C58 41.8 60.6 43.6 63.2 45.6C60 47.2 57 48.8 54 51',
  },
  // Gespiegeld van down-right: vanaf de tekst linksonder omhoog naar rechts
  'up-right': {
    line: 'M12 55C8 43 14 31 27 23C37 17 50 14 63 14.5',
    head: 'M54.5 20.5C58 18.2 60.6 16.4 63.2 14.4C60 12.8 57 11.2 54 9',
  },
} as const;

export type ArrowDirection = keyof typeof arrows;

const tones = {
  // Zachte donkere inkt met een witte gloed: op lichte foto's
  ink: 'text-foreground/75 [text-shadow:0_1px_12px_rgb(255_255_255/0.85)]',
  // Wit met een donkere gloed: op donkere foto's
  light: 'text-white/85 [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]',
  // Donkere navy inkt met een warme gloed: op een felle zonsonderganglucht
  dusk: 'text-[#161a2c]/85 [text-shadow:0_1px_14px_rgb(255_200_160/0.55)]',
  // Donkergroene inkt: op witte vlakken zoals de footer
  green: 'text-primary-hover',
};

interface AnnotationProps {
  lines: readonly string[];
  arrow: ArrowDirection;
  tone?: keyof typeof tones;
  /** Positie van de hele notitie (absolute utilities). */
  className?: string;
  /** Positie/grootte van de pijl ten opzichte van de tekst. */
  arrowClassName?: string;
  /** Start van de animatie, in seconden. */
  delay?: number;
}

/**
 * Handgeschreven notitie met een klein pijltje. Puur decoratief, dus verborgen
 * voor screenreaders.
 */
export function Annotation({
  lines,
  arrow,
  tone = 'ink',
  className = '',
  arrowClassName = '',
  delay = 1,
}: AnnotationProps) {
  const { line, head } = arrows[arrow];

  return (
    <div aria-hidden className={`pointer-events-none select-none ${tones[tone]} ${className}`}>
      <p
        className="font-hand text-[22px] leading-[0.98] motion-safe:animate-rise"
        style={{ animationDelay: `${delay}s` }}
      >
        {lines.map((text) => (
          <span key={text} className="block">
            {text}
          </span>
        ))}
      </p>
      <svg
        viewBox="0 0 80 60"
        fill="none"
        className={`draw-in h-10 w-14 ${arrowClassName}`}
        style={{ animationDelay: `${delay + 0.35}s` }}
      >
        <path d={line} pathLength={1} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d={head}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
