'use client';

import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, Building2, Send, UserRound, type LucideIcon } from 'lucide-react';
import { CompanyLogo } from '@/app/(marketing)/_components/CompanyLogo';
import { buildLanding } from '@/app/(marketing)/_content/landing';
import { useT } from '@/i18n/I18nProvider';

/*
 * Bouwstenen van de introductie. Vaste lichte kleuren (niet de thema-tokens): de dialoog
 * blijft licht, ook als het dashboard erachter in dark mode staat.
 */

export type FlowKey = 'profile' | 'hunt' | 'outreach';

const chipBase = 'rounded-full px-2.5 py-1 text-[11px] font-medium';
const chipActive = 'bg-[#087F63]/10 text-[#0B6B55]';
const chipIdle = 'bg-white text-[#66736E] ring-1 ring-[rgb(16_24_32/0.08)]';

/** Mini-profiel: wie je bent en wat je zoekt. */
function ProfilePreview() {
  const { previewTitle, chips } = useT().onboarding.overview.profile;

  return (
    <div aria-hidden>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#CBEEDD] text-[#087F63]">
          <UserRound className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-[#101820]">{previewTitle}</p>
          <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-[rgb(16_24_32/0.08)]" />
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {chips.map((chip, index) => (
          <li key={chip} className={`${chipBase} ${index === 0 ? chipActive : chipIdle}`}>
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mini-bedrijfssignaal: dezelfde ASML-melding als op de landingspagina en de auth-pagina's. */
function SignalPreview() {
  const { company, time, title, tags } = buildLanding(useT().landing).heroCards.signal;

  return (
    <div aria-hidden>
      <div className="flex items-center gap-2.5">
        <CompanyLogo text={company} tone="bg-[#10238A] text-[8px] text-white" className="size-8" />
        <div className="min-w-0 leading-tight">
          <p className="text-[12.5px] font-semibold text-[#101820]">{company}</p>
          <p className="mt-0.5 text-[11px] text-[#66736E]">{time}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[12.5px] font-semibold leading-snug text-[#101820]">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <li key={tag} className={`${chipBase} px-2 py-0.5 text-[10.5px] ${index === 0 ? chipActive : chipIdle}`}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mini-outreach: een voorgesteld bericht met één actie. */
function OutreachPreview() {
  const { label, greeting, preview, cta } = useT().landing.heroCards.outreach;

  return (
    <div aria-hidden>
      <p className="flex items-center gap-2 text-[12px] font-semibold text-[#0B6B55]">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#CBEEDD]">
          <Send className="size-3" />
        </span>
        {label}
      </p>
      <p className="mt-2 truncate text-[12px] text-[#66736E]">
        <span className="font-medium text-[#101820]">{greeting}</span> {preview}
      </p>
      <span className="mt-2.5 inline-flex h-7 items-center gap-1 rounded-full bg-[#087F63] px-3 text-[11.5px] font-semibold text-white">
        {cta}
        <ArrowRight className="size-3" />
      </span>
    </div>
  );
}

/** De drie stappen van Unlisted in volgorde; welkomstkaarten, stappenbalk en detailslides delen deze lijst. */
export const introFlow: { key: FlowKey; icon: LucideIcon; Preview: () => ReactNode }[] = [
  { key: 'profile', icon: UserRound, Preview: ProfilePreview },
  { key: 'hunt', icon: Building2, Preview: SignalPreview },
  { key: 'outreach', icon: Send, Preview: OutreachPreview },
];

/** Stapnummer als zacht mint pilletje: 01, 02, 03. */
export function StepNumber({ index, muted = false }: { index: number; muted?: boolean }) {
  return (
    <span
      className={`inline-grid h-7 min-w-9 place-items-center rounded-full px-2 text-[12px] font-bold tabular-nums tracking-[0.04em] ${
        muted ? 'bg-[#F1F3F0] text-[#66736E]' : 'bg-[#EAF7EF] text-[#087F63]'
      }`}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  );
}

/** Rustige groene infobalk, bijvoorbeeld voor het aantal credits. */
export function NoteBanner({
  icon: Icon,
  className = '',
  style,
  children,
}: {
  icon: LucideIcon;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <p
      className={`flex items-center gap-3 rounded-[13px] bg-[#EAF7EF] px-[18px] py-3 text-[15px] font-medium leading-snug text-[#087F63] ${className}`}
      style={style}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/80 ring-1 ring-[#CBEEDD]">
        <Icon className="size-4" aria-hidden />
      </span>
      {children}
    </p>
  );
}

/** Drie korte handgetekende streepjes, zoals op de landingspagina. Tekent zichzelf in. */
export function Spark({ className = '', delay = 0.6 }: { className?: string; delay?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      fill="none"
      className={`draw-in pointer-events-none text-[#087F63] opacity-55 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <path d="M20 5.5L21 13" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M31.5 11L26.5 16.5" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M34.5 25L27.5 24.2" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Handgetekende onderstreping onder een kop. */
export function HandUnderline({ className = '', delay = 0.8 }: { className?: string; delay?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 12"
      fill="none"
      preserveAspectRatio="none"
      className={`draw-in pointer-events-none text-[#45C89C] ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <path d="M2 8C28 4 62 3 118 6" pathLength={1} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
