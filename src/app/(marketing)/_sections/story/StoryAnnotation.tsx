import { Annotation } from '../../_components/Annotation';
import { story } from '../../_content/landing';

/**
 * De enige handgeschreven notitie in het verhaal (desktop): boven het hoofd van
 * de student, met een pijl naar de bovenste kaart. De animatie start pas als de
 * foto in beeld is (data-reveal-play, zie globals.css).
 */
export function StoryAnnotation() {
  return (
    <div data-reveal-play className="absolute left-[41%] top-[4%] hidden lg:block xl:left-[50%] xl:top-[6%]">
      <Annotation
        lines={story.annotation}
        arrow="down-right"
        tone="light"
        delay={0.9}
        className="relative"
        arrowClassName="absolute left-full top-4 -ml-1"
      />
    </div>
  );
}
