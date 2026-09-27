import { Annotation } from '../../_components/Annotation';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/**
 * De enige handgeschreven notitie: onder het dashboard, met een pijl omhoog naar de
 * kansenlijst. Buiten het dashboard, zodat hij nooit UI afdekt. Start na het dashboard.
 */
export async function HandwrittenAnnotation() {
  const { signals } = buildLanding((await getT()).landing);

  return (
    <div
      data-reveal-play
      className="relative mt-4 ml-[12%] w-fit lg:absolute lg:left-[22%] lg:top-full lg:mt-1 lg:ml-0"
    >
      <Annotation
        lines={signals.annotation}
        arrow="up-right"
        delay={1.3}
        className="relative"
        arrowClassName="absolute left-full -top-9 ml-1"
      />
    </div>
  );
}
