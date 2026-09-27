import { Annotation } from '../../_components/Annotation';
import { finalCta } from '../../_content/landing';

/**
 * De enige handgeschreven notitie (desktop): rechtsboven in de felle lucht, met een pijl
 * omlaag naar de student en de stad. Komt als laatste in beeld.
 */
export function CTAAnnotation() {
  return (
    <div data-reveal-play className="absolute right-[6%] top-[9%] hidden lg:block xl:right-[11%] xl:top-[10%]">
      <Annotation
        lines={finalCta.annotation}
        arrow="down-left"
        tone="dusk"
        delay={1.1}
        className="relative"
        arrowClassName="absolute right-[55%] top-full -mt-1"
      />
    </div>
  );
}
