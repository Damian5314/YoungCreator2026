import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from './_sections/HeroSection';
import { ProblemSection } from './_sections/ProblemSection';
import { FeaturesSection } from './_sections/FeaturesSection';
import { PricingSection } from './_sections/PricingSection';

export default function LandingPage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
