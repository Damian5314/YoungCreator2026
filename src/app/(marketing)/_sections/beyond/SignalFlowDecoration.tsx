import { revealItem } from '../../_components/revealItem';

/**
 * Zacht lichtveld + een dunne signaallijn achter het dashboard: signalen → beweging → ontdekking.
 * Puur decoratief; het dashboard blijft het hoofdbeeld.
 */
export function SignalFlowDecoration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Lichtveld: grote, sterk vervaagde mint-vormen, geen harde randen */}
      <div {...revealItem(80, 0, { durationMs: 2200 })} className="absolute inset-0">
        <div className="absolute left-[4%] top-[6%] h-[82%] w-[100%] rounded-[50%] bg-[#5fcf9f] opacity-[0.14] blur-[100px]" />
        <div className="absolute -bottom-[8%] -left-[14%] h-[48%] w-[46%] rounded-[50%] bg-[#7fdcb6] opacity-[0.13] blur-[80px]" />
        <div className="absolute -top-[10%] right-[4%] h-[42%] w-[38%] rounded-[50%] bg-lime opacity-[0.10] blur-[110px]" />
      </div>

      {/* Signaallijn van linksonder naar achter het dashboard, met een klein groen knooppunt */}
      <svg
        data-reveal-play
        viewBox="0 0 400 300"
        fill="none"
        className="absolute -bottom-[11%] -left-[9%] hidden h-[52%] w-[52%] text-primary opacity-40 xl:block"
      >
        <g className="draw-in" style={{ animationDelay: '900ms' }}>
          <path
            d="M18 282C70 270 104 232 142 196C182 158 226 150 268 118C306 90 330 58 388 28"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
        <circle cx="18" cy="282" r="12" fill="currentColor" opacity="0.14" />
        <circle cx="18" cy="282" r="4.5" fill="currentColor" />
      </svg>

      {/* Drie korte handgetekende accentstreepjes linksboven, buiten het dashboard */}
      <svg
        data-reveal-play
        viewBox="0 0 40 40"
        fill="none"
        className="absolute -left-[3%] -top-[5%] hidden size-10 text-primary opacity-45 lg:block"
      >
        <g className="draw-in" style={{ animationDelay: '1500ms' }}>
          <path d="M20 5.5L21 13" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M31.5 11L26.5 16.5" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M34.5 25L27.5 24.2" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
