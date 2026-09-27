import type { HTMLAttributes } from 'react';

const tones = {
  // Premium glas: grotendeels wit en goed leesbaar, net genoeg doorschijnend
  white: 'bg-white/72',
  // Zeer licht groen getint glas: de "kans voor jou"-kaart
  tint: 'bg-[rgb(241_249_239/0.8)]',
};

interface FloatCardProps extends HTMLAttributes<HTMLElement> {
  tone?: keyof typeof tones;
}

/** Basis voor de product-kaarten in de hero: licht glas, witte rand, zachte schaduw. */
export function FloatCard({ tone = 'white', className = '', ...props }: FloatCardProps) {
  return (
    <article
      className={`rounded-panel border border-white/75 text-foreground shadow-float backdrop-blur-[20px] ${tones[tone]} ${className}`}
      {...props}
    />
  );
}

/** Klein glazen rondje voor een icoon binnen een kaart. */
export const glassIcon =
  'grid shrink-0 place-items-center rounded-full bg-white/55 ring-1 ring-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)]';
