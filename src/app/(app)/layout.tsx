import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';

// Gedeelde layout voor alle pagina's na het inloggen
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
