import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { WelcomeIntro } from '@/components/onboarding/WelcomeIntro';
import { features } from '@/lib/env';
import { getCreditBalance, getCurrentUser, getProfile } from '@/lib/data/queries';

// Gedeelde layout voor alle pagina's na het inloggen (toegang wordt al in src/proxy.ts gecheckt).
// Horizontale navigatie bovenaan, geen zijbalk; de inhoud gebruikt bijna de volle breedte.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const [user, profile, credits] = await Promise.all([getCurrentUser(), getProfile(), getCreditBalance()]);

  return (
    // app-theme: zacht lime voor actief/geselecteerd (zie globals.css)
    <div className="app-theme min-h-screen">
      <AppHeader name={profile?.fullName || user?.email || ''} email={user?.email ?? ''} credits={credits} />
      {/* Mobiel: extra ruimte onderin voor de vaste tabbalk uit AppHeader */}
      <main className="mx-auto w-full max-w-[1500px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 sm:px-8 sm:pb-14 sm:pt-10 xl:px-12">
        {children}
      </main>
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
