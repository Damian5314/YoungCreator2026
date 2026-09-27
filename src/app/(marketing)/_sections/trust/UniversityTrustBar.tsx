import { RevealGroup } from '../../_components/RevealGroup';
import { revealItem } from '../../_components/revealItem';
import { trust } from '../../_content/landing';
import { TrustEmblem, TrustGlow } from './TrustDecoration';
import { UniversityLogoRow } from './UniversityLogoRow';

/** Klein label met een zachte groene 'status'-stip. */
function TrustHeading() {
  return (
    <h2
      id="trust-heading"
      {...revealItem(0, 10)}
      className="relative flex items-start gap-2.5 text-[11px] font-semibold uppercase leading-[1.5] tracking-[0.16em] text-[#52615C] xl:max-w-[14rem] xl:shrink-0"
    >
      <span
        aria-hidden
        className="mt-[4px] size-2 shrink-0 rounded-full bg-[#7FE0A6] shadow-[0_0_0_3px_rgb(127_224_166/0.18)]"
      />
      {trust.label}
    </h2>
  );
}

/**
 * Compacte trust-balk onderin de hero: label, universiteitsnamen en de leeuw.
 * - xl: één rij (~96px hoog), leeuw rechts over de volle hoogte.
 * - lg: label boven de namen, leeuw rechts over de volle hoogte.
 * - mobiel/tablet: leeuw in een eigen onderste rij, gelijk met de onderrand.
 * De leeuw is nooit afgesneden of vervaagd. Bewust zonder aantallen, reviews of CTA.
 */
export function UniversityTrustBar() {
  return (
    <RevealGroup
      id="trusted"
      role="region"
      aria-labelledby="trust-heading"
      offset={0}
      className="relative isolate flex scroll-mt-28 flex-col overflow-hidden rounded-[22px] border border-[rgb(8_127_99/0.08)] bg-white/90 px-5 pt-5 shadow-[0_14px_40px_rgb(16_24_32/0.06)] backdrop-blur-md sm:px-7 lg:block lg:py-6 lg:pr-[320px] xl:flex xl:min-h-[96px] xl:flex-row xl:items-center xl:gap-8 xl:py-5 xl:pr-[258px]"
    >
      <TrustGlow />
      <TrustHeading />
      <UniversityLogoRow />
      <TrustEmblem className="mt-1 h-16 self-end lg:absolute lg:bottom-0 lg:right-6 lg:mt-0 lg:h-full" />
    </RevealGroup>
  );
}
