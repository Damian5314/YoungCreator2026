import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { WelcomeIntro } from '@/components/onboarding/WelcomeIntro';
import { features } from '@/lib/env';
import { getCreditBalance, getCurrentUser, getProfile } from '@/lib/data/queries';

// Gedeelde layout voor alle pagina's na het inloggen (toegang wordt al in src/proxy.ts gecheckt)
export default async function AppLayout({ children }: { children: ReactNode }) {
  const [user, profile, credits] = await Promise.all([getCurrentUser(), getProfile(), getCreditBalance()]);

  return (
    // app-theme: zwarte knoppen en lime voor actief/geselecteerd (zie globals.css)
    <div className="app-theme min-h-screen">
      {/* Brede schermen (xl): zijbalk links; smaller zit het menu in AppHeader */}
      <div className="xl:flex">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <AppHeader name={profile?.fullName || user?.email || ''} credits={credits} />
          {/* Mobiel: extra ruimte onderin voor de vaste tabbalk uit AppHeader */}
          <main className="mx-auto max-w-6xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:py-10 xl:px-10">
            {children}
          </main>
        </div>
      </div>
      {/* Eerste keer ingelogd: korte uitleg over hoe de agent werkt */}
      {profile?.needsIntro && (
        <WelcomeIntro
          firstName={profile.fullName?.split(' ')[0] || null}
          credits={credits}
          demoMode={features.demoMode}
        />
      )}
    </div>
  );
}
