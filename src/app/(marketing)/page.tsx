import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { nav } from './_content/landing';
import { Footer } from './_sections/footer/Footer';
import { HeroSection } from './_sections/HeroSection';
import { ProblemSection } from './_sections/ProblemSection';
import { BeyondJobBoardsSection } from './_sections/BeyondJobBoardsSection';
import { FinalCTASection } from './_sections/FinalCTASection';

export default function LandingPage() {
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
