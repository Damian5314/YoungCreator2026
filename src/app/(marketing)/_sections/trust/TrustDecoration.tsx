import Image from 'next/image';
import { revealItem } from '../../_components/revealItem';
import { media } from '../../_content/landing';

/** Zachte mintwaas rechts in de kaart, achter het embleem. */
export function TrustGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(ellipse_45%_95%_at_88%_75%,rgb(223_244_231/0.75),transparent_72%)]"
    />
  );
}

/**
 * Merk-embleem: de leeuw met de groeicurve (één PNG, ~3:1). De leeuw staat altijd volledig
 * en scherp in beeld; alleen het begin van de curve (links) loopt zacht uit. Bij binnenkomst
 * veegt het embleem van links naar rechts in beeld, waardoor de curve zichzelf lijkt te tekenen.
 */
export function TrustEmblem({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      {...revealItem(300, 0)}
      data-reveal-play
      className={`pointer-events-none relative aspect-[2174/723] ${className}`}
    >
      <div className="absolute inset-0 animate-wipe-in [animation-delay:350ms] [mask-image:linear-gradient(to_right,transparent,#000_32%)] motion-reduce:animate-none">
        <Image
          src={media.trustEmblem.src}
          alt={media.trustEmblem.alt}
          fill
          sizes="(min-width: 1280px) 240px, 180px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
