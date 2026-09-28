'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonClasses } from './Button';

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Icoon-element (ook vanuit een Server Component), tijdens het versturen vervangen door een spinner. */
  icon?: ReactNode;
  variant?: Parameters<typeof buttonClasses>[0];
  size?: Parameters<typeof buttonClasses>[1];
  /** Eigen classes i.p.v. de standaard knopstijl (bijv. een menu-item). */
  unstyled?: boolean;
}

/**
 * Verzendknop voor een <form action={serverAction}>: tijdens het versturen uitgeschakeld, met een
 * draaiend icoon en aria-busy, zodat een dubbele klik niet twee keer verstuurt.
 */
export function SubmitButton({ icon, variant, size, unstyled, className = '', disabled, children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending || undefined}
      className={unstyled ? className : buttonClasses(variant, size, className)}
      {...props}
    >
      {pending ? <Loader2 className="size-4 text-muted-foreground motion-safe:animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
