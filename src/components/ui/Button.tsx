import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'glass';
type Size = 'sm' | 'md' | 'lg';
type Shape = 'rounded' | 'pill';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'border border-border bg-card text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  // Voor gebruik op foto's / donkere vlakken
  glass: 'border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const shapes: Record<Shape, string> = {
  rounded: 'rounded-lg',
  pill: 'rounded-full',
};

export function buttonClasses(
  variant: Variant = 'primary',
  size: Size = 'md',
  className = '',
  shape: Shape = 'rounded',
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${shapes[shape]} ${className}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
}

export function Button({ variant, size, shape, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className, shape)} {...props} />;
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant, size, shape, className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className, shape)}>
      {children}
    </Link>
  );
}
