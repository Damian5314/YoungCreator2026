import Image from 'next/image';
import { revealItem } from '../../_components/revealItem';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/**
 * Het echte dashboard als zwevend productbeeld (transparante PNG, niet nagebouwd in HTML).
 * Desktop: begint in het midden en komt van rechts het beeld in (beyond-bleed in globals.css).
 * Mobiel: 130% breed en loopt rechts van het scherm af (de sectie knipt af), zodat de UI leesbaar blijft.
 */
export async function DashboardPreview() {
  const { signals } = buildLanding((await getT()).landing);
  const { src, width, height, alt } = signals.dashboard;

  return (
    <div
      {...revealItem(220, 50, { from: 'right', durationMs: 1100 })}
      className="relative max-sm:w-[130%] max-sm:max-w-none lg:beyond-bleed"
    >
      {/* Schaduw volgt de vorm van de panelen (drop-shadow), niet het rechthoekige bestand */}
      <div className="origin-[35%_50%] drop-shadow-[0_30px_60px_rgb(16_24_32/0.1)] transition-transform duration-700 ease-soft hover:scale-[1.01]">
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes="(min-width: 1024px) min(62vw, 1120px), (min-width: 640px) calc(100vw - 3rem), 130vw"
          className="h-auto w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
