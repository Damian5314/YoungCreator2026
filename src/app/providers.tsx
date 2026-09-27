'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

// Unlisted is overal licht (warm off-white, witte kaarten): geen dark mode, ook niet via de systeemvoorkeur.
// De dark-tokens in globals.css blijven bestaan, maar worden niet meer aangezet.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
