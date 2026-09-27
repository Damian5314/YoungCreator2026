import type { ComponentType, ReactNode } from 'react';

type IconProps = { className?: string; 'aria-hidden'?: boolean };

interface GlassIconProps {
  /** Lucide icon component, e.g. `Sparkles`. */
  icon?: ComponentType<IconProps>;
  /** Escape hatch when you need custom inner content instead of a lucide icon. */
  children?: ReactNode;
  /** Tailwind size utility for the container (default: `size-9`). */
  size?: string;
  /** Tint the container/icon towards the brand green. */
  tone?: 'neutral' | 'green' | 'lime';
  className?: string;
}

const iconTone: Record<NonNullable<GlassIconProps['tone']>, string> = {
  neutral: 'text-[var(--hero-ink)]',
  green: 'text-[var(--hero-green)]',
  lime: 'text-[var(--hero-green)]',
};

/**
 * Small piece of "glass" floating above a card — a translucent, blurred circle
 * with a minimal line icon inside. Kept intentionally compact.
 */
export function GlassIcon({
  icon: Icon,
  children,
  size = 'size-9',
  tone = 'neutral',
  className = '',
}: GlassIconProps) {
  return (
    <span
      className={`hero-glass-icon grid ${size} shrink-0 place-items-center rounded-full ${
        tone === 'lime' ? 'bg-[var(--hero-lime)]/25' : ''
      } ${className}`}
    >
      {Icon ? <Icon className={`size-[45%] ${iconTone[tone]}`} aria-hidden /> : children}
    </span>
  );
}
