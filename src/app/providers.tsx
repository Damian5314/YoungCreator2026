'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

// Dark mode: next-themes zet class="dark" op <html>, de kleur-tokens in globals.css doen de rest
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
