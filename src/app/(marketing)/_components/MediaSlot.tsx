import Image from 'next/image';
import type { ReactNode } from 'react';
import type { LandingMedia } from '../_content/landing';

interface MediaSlotProps {
  media: LandingMedia;
  sizes: string;
  /** Wordt getoond zolang er nog geen foto is aangeleverd. */
  fallback: ReactNode;
  className?: string;
}

/**
 * Vaste plek voor een (achtergrond)foto. Zonder `src` rendert hij de fallback,
 * zodat de sectie er af uitziet tot de definitieve foto er is.
 */
export function MediaSlot({ media, sizes, fallback, className = '' }: MediaSlotProps) {
  if (!media.src) return fallback;
  return <Image src={media.src} alt={media.alt} fill sizes={sizes} className={`object-cover ${className}`} />;
}
