import type { ReactNode } from 'react';

const tones = {
  brand: 'text-primary',
  // Het lichtere merkgroen uit dark mode: goed leesbaar op donkere foto's en vlakken
  light: 'text-[#45c29c]',
};

/** Klein label boven een sectiekop, in merkgroen. */
export function Eyebrow({
  children,
  tone = 'brand',
  className = '',
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.16em] sm:text-[13px] ${tones[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
