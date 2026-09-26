import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

// Korte bevestiging naast een knop ("Saved", "Reset link sent", ...)
export function SavedNote({ children }: { children: ReactNode }) {
  return (
    <span role="status" className="flex items-center gap-1 text-sm font-medium text-success">
      <Check className="size-4" aria-hidden />
      {children}
    </span>
  );
}
