import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { getCreditBalance, getCurrentUser, getProfile } from '@/lib/data/queries';

// Gedeelde layout voor alle pagina's na het inloggen (toegang wordt al in src/proxy.ts gecheckt)
export default async function AppLayout({ children }: { children: ReactNode }) {
  const [user, profile, credits] = await Promise.all([getCurrentUser(), getProfile(), getCreditBalance()]);

  return (
    <div className="min-h-screen">
      <AppHeader name={profile?.fullName || user?.email || ''} credits={credits} />
      {/* Mobiel: extra ruimte onderin voor de vaste tabbalk uit AppHeader */}
      <main className="mx-auto max-w-6xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
