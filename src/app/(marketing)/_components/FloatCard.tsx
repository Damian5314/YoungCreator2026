import type { HTMLAttributes } from 'react';

const tones = {
  // Premium glas: grotendeels wit en goed leesbaar, net genoeg doorschijnend
  white: 'bg-white/72',
  // Zeer licht groen getint glas: de "kans voor jou"-kaart
  tint: 'bg-[rgb(241_249_239/0.8)]',
};

interface FloatCardProps extends HTMLAttributes<HTMLElement> {
  tone?: keyof typeof tones;
  /** Klein label rechtsboven, bijv. "Example": de kaarten zijn illustraties, geen live data. */
  exampleLabel?: string;
}

/** Basis voor de product-kaarten in de hero: licht glas, witte rand, zachte schaduw. */
export function FloatCard({ tone = 'white', className = '', exampleLabel, children, ...props }: FloatCardProps) {
  return (
    <article
      className={`relative rounded-panel border border-white/75 text-foreground shadow-float backdrop-blur-[20px] ${tones[tone]} ${className}`}
      {...props}
    >
      {exampleLabel && (
        // Tabje op de bovenrand: overlapt nooit de inhoud van de kaart
        <span className="absolute -top-2.5 right-4 z-10 rounded-full border border-foreground/8 bg-white px-2 py-px text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#4b5552] shadow-[0_1px_2px_rgb(16_24_32/0.08)]">
          {exampleLabel}
        </span>
      )}
      {children}
    </article>
  );
}

/** Klein glazen rondje voor een icoon binnen een kaart. */
export const glassIcon =
  'grid shrink-0 place-items-center rounded-full bg-white/55 ring-1 ring-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)]';
