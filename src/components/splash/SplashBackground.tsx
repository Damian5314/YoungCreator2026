import type { CSSProperties } from 'react';
import { preload } from 'react-dom';
import { getImageProps } from 'next/image';
import { SignalOrbit, type Orbit } from './SplashSignals';
import styles from './splash.module.css';

// Staand scherm (telefoon, tablet rechtop): een eigen, staande compositie van de achtergrond.
// Zelfde voorwaarde als in splash.module.css.
const PORTRAIT = '(orientation: portrait)';

interface Composition {
  src: string;
  width: number;
  height: number;
  /** Minuscule, vervaagde versie: staat er meteen, tot de echte afbeelding binnen is. */
  blur: string;
  /**
   * Cirkels die over de dunne lijnen in de afbeelding vallen, uitgemeten in haar eigen pixels.
   * Elk signaal legt maar ~30px af, richting het midden van het scherm; het enige lime accent
   * zit op de gelige baan linksonder.
   */
  orbits: Orbit[];
}

const LANDSCAPE: Composition = {
  src: '/images/splash/splash-background.jpg',
  width: 1672,
  height: 941,
  blur: 'data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAADwBQCdASooABcAPrVOnEqnJKKhtVv4AOAWiUAXYANd80MxDPSDnUwrmhPKJJ7UMJNpvmH6fJpaAAD5b/RU1+B1QqwdwXFKC2Hq+bNrO189QJYHqsY0myK5hypD/IPFFklTN4zJn9IwTQgWBsKQ3pFcokUB5bO3/11Vil23d2rvqec56xEk+VJa3WA0oNG1nrfdwSsjnOQzIpc35cAAAA==',
  orbits: [
    // Linksboven: van de bovenrand naar het kleine gele bolletje
    { cx: 239, cy: -155, r: 430, from: 18, to: 66, signal: [51, 46], delay: 0.5 },
    // Links: de stippelbaan naar de grote bol
    { cx: 36, cy: 696, r: 318, from: -97, to: -14, signal: [-50, -44], delay: 0.8 },
    // Linksonder: van de grote bol naar het kleine bolletje
    { cx: 179, cy: 1202, r: 548, from: -64, to: -28, signal: [-57, -53], delay: 1.1, tone: 'lime' },
    // Rechtsboven: de lijn met de donkere stip
    { cx: 1759, cy: 592, r: 596, from: -156, to: -96, signal: [-121, -124.5], delay: 0.65 },
    // Rechts: de stippelbaan om de groene vlek
    { cx: 1624, cy: 330, r: 343, from: 82, to: 168, signal: [112, 118], delay: 0.95 },
  ],
};

const PORTRAIT_COMPOSITION: Composition = {
  src: '/images/splash/splash-background-portrait.jpg',
  width: 941,
  height: 1672,
  blur: 'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAADQBQCdASoYACsAPrFGm0qnI6KhtVv8AOAWCUAX5wQsQF4Hcrp90PtBhGt1mH/DLJSbY+wGGu2AAP7KYFCgZbqpq0rCEvE6oeAv9vtJqQ2vLmQzBSTP0l+nWCkwF4x25D3FUfx5WYXD8AB5NPdMh9AY3w4sxLTUmDDXpCQJ05kr1bzJvH/yMmSo8X4iRodsl58YDYAA',
  orbits: [
    // Linksboven: van de bovenrand naar het kleine gele bolletje
    { cx: 114, cy: -153, r: 499, from: 18, to: 66, signal: [47, 52], delay: 0.5 },
    // Links: de stippelbaan naar de grote bol
    { cx: -173, cy: 1202, r: 312, from: -54, to: -5, signal: [-40, -32], delay: 0.8 },
    // Linksonder: van de grote bol langs de bolletjes naar de onderrand
    { cx: 8, cy: 1678, r: 422, from: -65, to: -2, signal: [-50, -43], delay: 1.1, tone: 'lime' },
    // Rechtsboven: de lijn met de donkere stip
    { cx: 1156, cy: 676, r: 528, from: -155, to: -114, signal: [-121, -128], delay: 0.65 },
    // Rechts: de stippelbaan om de groene vlek
    { cx: 1109, cy: 635, r: 380, from: 116, to: 190, signal: [158, 150], delay: 0.95 },
    // Rechtsonder: vanaf het gele bolletje omhoog
    { cx: 1044, cy: 1630, r: 449, from: -138, to: -109, signal: [-118, -126], delay: 0.75 },
  ],
};

/** Het vlak is zo breed als het scherm, of breder als de hoogte dat vraagt (zoals object-fit: cover). */
function coverSizes({ width, height }: Composition) {
  return `(min-aspect-ratio: ${width}/${height}) 100vw, ${Math.ceil((100 * width) / height)}vh`;
}

function Orbits({ composition, className, prefix }: { composition: Composition; className: string; prefix: string }) {
  return (
    <svg viewBox={`0 0 ${composition.width} ${composition.height}`} className={`${styles.orbits} ${className}`}>
      {composition.orbits.map((orbit, index) => (
        <SignalOrbit key={index} orbit={orbit} id={`splash-orbit-${prefix}${index}`} />
      ))}
    </svg>
  );
}

/** De bestaande Unlisted-achtergrond, met traag bewegend licht en signalen over de banen. */
export function SplashBackground() {
  const image = (composition: Composition) =>
    getImageProps({
      src: composition.src,
      alt: '',
      fill: true,
      sizes: coverSizes(composition),
      loading: 'eager',
      fetchPriority: 'high',
    }).props;
  const landscape = image(LANDSCAPE);
  const portrait = image(PORTRAIT_COMPOSITION);

  // Vooraf laden, maar per oriëntatie: een telefoon haalt alleen de staande versie op
  for (const [props, media] of [
    [landscape, '(orientation: landscape)'],
    [portrait, PORTRAIT],
  ] as const) {
    preload(props.src, {
      as: 'image',
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority: 'high',
      media,
    });
  }

  return (
    <div data-splash-exit className={styles.backdrop}>
      <div className={styles.zoom}>
        <div
          className={styles.stage}
          style={
            {
              '--blur-landscape': `url("${LANDSCAPE.blur}")`,
              '--blur-portrait': `url("${PORTRAIT_COMPOSITION.blur}")`,
            } as CSSProperties
          }
        >
          <picture>
            <source media={PORTRAIT} srcSet={portrait.srcSet} sizes={portrait.sizes} />
            <img {...landscape} className={styles.stageImage} />
          </picture>
          <span className={`${styles.atmo} ${styles.atmoLight}`} />
          <span className={`${styles.atmo} ${styles.atmoMint}`} />
          <Orbits composition={LANDSCAPE} className={styles.orbitsLandscape} prefix="l" />
          <Orbits composition={PORTRAIT_COMPOSITION} className={styles.orbitsPortrait} prefix="p" />
        </div>
      </div>
    </div>
  );
}
