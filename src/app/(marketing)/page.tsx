import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { getT } from '@/i18n/server';
import { buildLanding } from './_content/landing';
import { Footer } from './_sections/footer/Footer';
import { HeroSection } from './_sections/HeroSection';
import { ProblemSection } from './_sections/ProblemSection';
import { BeyondJobBoardsSection } from './_sections/BeyondJobBoardsSection';
import { FinalCTASection } from './_sections/FinalCTASection';

export default async function LandingPage() {
  const { nav } = buildLanding((await getT()).landing);

  return (
    <>
      <MarketingHeader nav={nav} />
      <main>
        <HeroSection />
        <ProblemSection />
        <BeyondJobBoardsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
