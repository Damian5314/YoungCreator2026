import type { HTMLAttributes, ReactNode } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-card border border-border bg-card p-5 ${className}`} {...props} />;
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  // Stapnummer in een rondje voor de titel, voor formulieren in stappen
  step?: number;
}

export function CardHeader({ title, description, action, step }: CardHeaderProps) {
  const text = (
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );

  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      {step === undefined ? (
        text
      ) : (
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold tabular-nums"
          >
            {step}
          </span>
          {text}
        </div>
      )}
      {action}
    </div>
  );
}
