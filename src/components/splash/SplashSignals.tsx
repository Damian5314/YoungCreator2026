import type { CSSProperties } from 'react';
import styles from './splash.module.css';

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

type Point = { x: number; y: number };

const GREEN = '#087F63';

// Afgerond, zodat server en browser exact dezelfde attributen renderen
const round = (value: number) => Math.round(value * 10) / 10;

/** Punt op een cirkel. Hoek in graden, met de klok mee vanaf rechts (de y-as wijst omlaag, zoals in SVG). */
function onCircle(cx: number, cy: number, r: number, angle: number): Point {
  const radians = (angle * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(radians)), y: round(cy + r * Math.sin(radians)) };
}

/** Lijn die aan beide kanten (of alleen aan het begin) zacht uitloopt, over de richting begin → eind. */
function FadeGradient({ id, from, to, fadeEnd = true }: { id: string; from: Point; to: Point; fadeEnd?: boolean }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
      <stop offset="0" stopColor={GREEN} stopOpacity="0" />
      <stop offset={fadeEnd ? '0.22' : '0.55'} stopColor={GREEN} />
      <stop offset={fadeEnd ? '0.78' : '1'} stopColor={GREEN} />
      {fadeEnd && <stop offset="1" stopColor={GREEN} stopOpacity="0" />}
    </linearGradient>
  );
}

/**
 * Stip die over een pad beweegt: drie lagen (twee zachte ringen en een kern) van hetzelfde pad,
 * elk als streepje van lengte ~0 met ronde uiteinden. De positie zit in stroke-dashoffset.
 */
export function SignalDot({ d, className, style }: { d: string; className: string; style?: CssVars }) {
  return (
    <g className={`${styles.signal} ${className}`} style={style}>
      <path d={d} pathLength={1} />
      <path d={d} pathLength={1} />
      <path d={d} pathLength={1} />
    </g>
  );
}

export interface Orbit {
  cx: number;
  cy: number;
  r: number;
  /** Begin en eind van de zichtbare boog, in graden. */
  from: number;
  to: number;
  /** Het signaal glijdt tussen deze twee hoeken heen en weer. */
  signal: [number, number];
  /** Seconden na de start. */
  delay: number;
  tone?: 'green' | 'lime';
}

/** Boog van een baan uit de achtergrond, met één signaal dat er traag overheen glijdt. */
export function SignalOrbit({ orbit, id }: { orbit: Orbit; id: string }) {
  const { cx, cy, r, from, to, signal, delay, tone = 'green' } = orbit;
  const start = onCircle(cx, cy, r, from);
  const end = onCircle(cx, cy, r, to);
  const d = `M ${start.x} ${start.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${end.x} ${end.y}`;
  // Hoek → positie langs de boog (0..1); negatief, want stroke-dashoffset schuift de stip vooruit
  const offset = (angle: number) => Number((-(angle - from) / (to - from)).toFixed(4));

  return (
    <g className={styles.orbit} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <FadeGradient id={id} from={start} to={end} />
      <path d={d} stroke={`url(#${id})`} className={styles.orbitLine} />
      <SignalDot
        d={d}
        className={`${styles.orbitSignal} ${tone === 'lime' ? styles.lime : ''}`}
        style={{
          '--signal-from': offset(signal[0]),
          '--signal-to': offset(signal[1]),
          '--signal-delay': `${delay}s`,
        }}
      />
    </g>
  );
}

// Drie signalen komen van buitenaf naar het logo: linksboven, rechts en linksonder.
// Assenstelsel: het midden van het logo is 0,0 en het logo is 124 breed; ze stoppen net naast de rand.
const LINKS: { from: Point; c1: Point; c2: Point; to: Point }[] = [
  { from: { x: -300, y: -150 }, c1: { x: -220, y: -140 }, c2: { x: -140, y: -90 }, to: { x: -76, y: -36 } },
  { from: { x: 310, y: -40 }, c1: { x: 240, y: -60 }, c2: { x: 150, y: -50 }, to: { x: 78, y: -14 } },
  { from: { x: -310, y: 52 }, c1: { x: -230, y: 48 }, c2: { x: -150, y: 30 }, to: { x: -78, y: 10 } },
];

/** Veel signalen → één punt → Unlisted. Ligt achter het logo en schaalt mee met het logo. */
export function SignalConnection() {
  return (
    <svg viewBox="-320 -180 640 360" className={styles.connection}>
      {LINKS.map(({ from, c1, c2, to }, index) => {
        const d = `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
        const id = `splash-link-${index}`;
        return (
          <g key={id}>
            <FadeGradient id={id} from={from} to={to} fadeEnd={false} />
            <path
              d={d}
              pathLength={1}
              stroke={`url(#${id})`}
              className={styles.connectionLine}
              style={{ '--line-delay': `${1.75 + index * 0.08}s` } as CssVars}
            />
            <SignalDot d={d} className={styles.convergeSignal} style={{ '--signal-delay': `${1.8 + index * 0.1}s` }} />
          </g>
        );
      })}
    </svg>
  );
}
