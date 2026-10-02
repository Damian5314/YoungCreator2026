import { cookies } from 'next/headers';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { SplashGate } from '@/components/splash/SplashGate';
import { SPLASH_COOKIE } from '@/components/splash/splashCookie';
import type { Metadata } from 'next';
import { getT } from '@/i18n/server';
import { publicPageMetadata } from '@/lib/seo';
import { HomeJsonLd } from './_components/StructuredData';
import { buildLanding } from './_content/landing';
import { Footer } from './_sections/footer/Footer';
import { HeroSection } from './_sections/HeroSection';
import { ProblemSection } from './_sections/ProblemSection';
import { BeyondJobBoardsSection } from './_sections/BeyondJobBoardsSection';
import { FinalCTASection } from './_sections/FinalCTASection';

export async function generateMetadata(): Promise<Metadata> {
  const { common } = await getT();
  return publicPageMetadata('/', { title: common.meta.homeTitle, description: common.meta.description, absoluteTitle: true });
}

export default async function LandingPage() {
  const { nav } = buildLanding((await getT()).landing);
  // Openingsanimatie alleen bij de eerste binnenkomst in deze browsersessie
  const showSplash = !(await cookies()).has(SPLASH_COOKIE);

  return (
    <SplashGate show={showSplash}>
      <MarketingHeader nav={nav} />
      <HomeJsonLd />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <ProblemSection />
        <BeyondJobBoardsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </SplashGate>
  );
}
