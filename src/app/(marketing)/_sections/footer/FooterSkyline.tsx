import Image from 'next/image';
import { revealItem } from '../../_components/revealItem';

/**
 * Nederlandse skyline (grachtenpanden, brug, molen) in mintgroen, midden in de onderste
 * regel van de footer. Puur decoratief; de breedte komt van de ouder via `className`.
 */
export function FooterSkyline({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`} {...revealItem(300, 8, { durationMs: 1200 })}>
      <Image
        src="/images/footer/footer-skyline.png"
        alt=""
        width={2140}
        height={325}
        sizes="(min-width: 1280px) 24rem, (min-width: 640px) 26rem, 88vw"
        className="h-auto w-full"
      />
    </div>
  );
}
