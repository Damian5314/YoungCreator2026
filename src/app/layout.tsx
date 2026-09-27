import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Caveat } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

// opsz-as: Inter schakelt op grote koppen automatisch naar de strakkere display-variant
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export const metadata: Metadata = {
  title: {
    default: 'Job Hunter',
    template: '%s · Job Hunter',
  },
  description:
    'Job Hunter helps international students find jobs, internships and hidden opportunities in the Netherlands by analyzing real-time company signals, news and hiring activity.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
