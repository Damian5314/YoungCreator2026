'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Printdialoog van de browser; daar kun je ook "Opslaan als pdf" kiezen
export function PrintButton({ label }: { label: string }) {
  return (
    <Button variant="secondary" size="sm" onClick={() => window.print()}>
      <Printer className="size-4" aria-hidden />
      {label}
    </Button>
  );
}
