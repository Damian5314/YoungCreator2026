import { Container } from '@/components/layout/Container';
import { RevealGroup } from '../_components/RevealGroup';
import { DashboardPreview } from './beyond/DashboardPreview';
import { HandwrittenAnnotation } from './beyond/HandwrittenAnnotation';
import { SectionActions } from './beyond/SectionActions';
import { SectionIntro } from './beyond/SectionIntro';
import { SignalFlowDecoration } from './beyond/SignalFlowDecoration';
import { SignalTypeGrid } from './beyond/SignalTypeGrid';

/**
 * Het verschil van Unlisted: bedrijfssignalen → analyse → kansen → match → actie.
 * Links de uitleg (42%), rechts het echte dashboard dat van rechts het beeld in komt (58%+).
 * overflow-x-clip: het dashboard mag voorbij de rechterrand lopen zonder horizontale scroll.
 */
export function BeyondJobBoardsSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="beyond-title"
      className="relative isolate scroll-mt-24 overflow-x-clip bg-background py-20 sm:py-24 lg:py-32"
    >
      <Container>
        <RevealGroup
          offset={15}
          className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-0"
        >
          <div className="relative z-10 lg:pr-10 xl:pr-14">
            <SectionIntro />
            <SignalTypeGrid />
            <SectionActions />
          </div>

          <div className="relative lg:[--container-pad:3rem] xl:[--container-pad:4rem] 2xl:[--container-pad:5rem]">
            <SignalFlowDecoration />
            <DashboardPreview />
            <HandwrittenAnnotation />
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
