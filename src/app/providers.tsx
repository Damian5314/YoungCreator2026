'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';

// De landingspagina is ontworpen op warm off-white en blijft daarom altijd licht
const LIGHT_ONLY_PATHS = ['/'];

// Dark mode: next-themes zet class="dark" op <html>, de kleur-tokens in globals.css doen de rest
export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const forcedTheme = LIGHT_ONLY_PATHS.includes(pathname) ? 'light' : undefined;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={forcedTheme}
    >
      {children}
    </ThemeProvider>
  );
}
