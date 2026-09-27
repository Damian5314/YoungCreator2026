import { footer } from '../../_content/landing';
import { FooterSkyline } from './FooterSkyline';

/**
 * Onderste regel. Desktop: copyright links, skyline precies in het midden, herkomst rechts;
 * alle drie op dezelfde 'grondlijn'. Kleinere schermen: skyline boven, de tekst eronder.
 */
export function FooterBottom() {
  return (
    <div className="mt-8 flex flex-col items-center gap-5 text-center text-sm text-muted-foreground sm:gap-6 lg:mt-9 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-end lg:gap-8 lg:text-left">
      <FooterSkyline className="w-[min(100%,22rem)] sm:w-[26rem] lg:order-2 lg:w-[20rem] xl:w-[24rem]" />
      <div className="flex flex-col gap-1.5 sm:w-full sm:flex-row sm:justify-between lg:contents">
        <p className="lg:order-1">{footer.copyright}</p>
        <p className="text-balance lg:order-3 lg:text-right">{footer.tagline}</p>
      </div>
    </div>
  );
}
