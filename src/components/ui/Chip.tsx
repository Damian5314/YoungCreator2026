import type { ButtonHTMLAttributes } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

// Aan/uit-knop in pilvorm, voor filters en meerkeuze-opties
export function Chip({ selected, className = '', ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
        selected
          ? 'border-primary bg-primary-soft font-medium text-primary-soft-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground'
      } ${className}`}
      {...props}
    />
  );
}
