'use client';

import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { ArrowDown, ArrowRight, Building2, Check, Send, Sparkles, UserRound, type LucideIcon } from 'lucide-react';
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

function Chips({ items, small = false }: { items: readonly string[]; small?: boolean }) {
  return (
    <ul className={`flex flex-wrap ${small ? 'gap-1' : 'gap-1.5'}`}>
      {items.map((item, index) => (
        <li
          key={item}
          className={`${chipBase} ${small ? 'px-2 py-0.5 text-[10.5px]' : ''} ${index === 0 ? chipActive : chipIdle}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function CompanyHeader({ company, sub }: { company: string; sub: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <CompanyLogo text={company} tone="bg-[#10238A] text-[8px] text-white" className="size-8" />
      <div className="min-w-0 leading-tight">
        <p className="text-[12.5px] font-semibold text-[#101820]">{company}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#66736E]">{sub}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini-voorbeelden van de product-UI (inhoud, zonder eigen kaart eromheen)
// ---------------------------------------------------------------------------

/** Profiel: wie je bent en wat je zoekt; op de stap-slide ook dat je cv binnen is. */
function ProfilePreview({ withCv = false }: { withCv?: boolean }) {
  const t = useT().onboarding;
  const { previewTitle, chips } = t.overview.profile;

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
      <div className="mt-3">
        <Chips items={chips} />
      </div>
      {withCv && (
        <p className="mt-3 flex items-center gap-1.5 border-t border-[rgb(16_24_32/0.06)] pt-2.5 text-[11.5px] font-medium text-[#0B6B55]">
          <Check className="size-3.5" />
          {t.steps.profile.cvUploaded}
        </p>
      )}
    </div>
  );
}

/** Bedrijfssignaal: dezelfde ASML-melding als op de landingspagina en de auth-pagina's. */
function SignalPreview() {
  const { company, time, title, tags } = buildLanding(useT().landing).heroCards.signal;

  return (
    <div aria-hidden>
      <CompanyHeader company={company} sub={time} />
      <p className="mt-2 line-clamp-2 text-[12.5px] font-semibold leading-snug text-[#101820]">{title}</p>
      <div className="mt-2">
        <Chips items={tags} small />
      </div>
    </div>
  );
}

/** Match: score, bedrijf, rol en waarom het past. */
function MatchPreview() {
  const t = useT();
  const { signal, match } = buildLanding(t.landing).heroCards;
  const { matchScore, role, chips } = t.onboarding.steps.outreach;

  return (
    <div aria-hidden>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CompanyLogo text={signal.company} tone="bg-[#10238A] text-[8px] text-white" className="size-8" />
          <p className="text-[12.5px] font-semibold text-[#101820]">{signal.company}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#087F63] px-2.5 py-1 text-[11px] font-bold text-white">
          {matchScore(match.score)}
        </span>
      </div>
      {/* De rol op een eigen regel, zodat hij nooit wordt afgekapt */}
      <p className="mt-2 text-[13px] font-semibold leading-snug text-[#101820]">{role}</p>
      <div className="mt-2">
        <Chips items={chips} small />
      </div>
    </div>
  );
}

/**
 * Voorgesteld bericht. Op de welkomstkaart compact met "Send message"; op de stap-slide
 * volledig met "Review message": Unlisted bereidt voor, jij bekijkt en verstuurt.
 */
function OutreachPreview({ detailed = false }: { detailed?: boolean }) {
  const t = useT();
  const { label, greeting, preview, cta } = t.landing.heroCards.outreach;

  return (
    <div aria-hidden>
      <p className="flex items-center gap-2 text-[12px] font-semibold text-[#0B6B55]">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#CBEEDD]">
          <Send className="size-3" />
        </span>
        {label}
      </p>
      {detailed ? (
        <p className="mt-2 text-[12px] leading-snug text-[#66736E]">
          <span className="block font-medium text-[#101820]">{greeting}</span>
          <span className="line-clamp-2">{preview}</span>
        </p>
      ) : (
        <p className="mt-2 truncate text-[12px] text-[#66736E]">
          <span className="font-medium text-[#101820]">{greeting}</span> {preview}
        </p>
      )}
      <span className="mt-2.5 inline-flex h-7 items-center gap-1 rounded-full bg-[#087F63] px-3 text-[11.5px] font-semibold text-white">
        {detailed ? t.onboarding.steps.outreach.reviewMessage : cta}
        <ArrowRight className="size-3" />
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grotere voorbeelden op de stap-slides: witte kaartjes, eventueel verbonden
// ---------------------------------------------------------------------------

function Surface({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <div
      className="w-full rounded-[18px] border border-[rgb(16_24_32/0.06)] bg-white p-4 shadow-[0_18px_50px_rgb(16_24_32/0.1)] motion-safe:animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Van het ene kaartje naar het volgende: stippellijn met een klein pijltje. */
function FlowArrow({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden
      className="flex flex-col items-center text-[#45C89C] motion-safe:animate-fade"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="h-3.5 border-l-2 border-dotted border-[#CBEEDD]" />
      <ArrowDown className="size-3.5" />
    </span>
  );
}

function ProfileVisual() {
  return (
    <Surface delay={150}>
      <ProfilePreview withCv />
    </Surface>
  );
}

/** Bedrijfssignaal → mogelijke kans. */
function SignalVisual() {
  const { opportunityDetected } = useT().onboarding.steps.hunt;

  return (
    <>
      <Surface delay={150}>
        <SignalPreview />
      </Surface>
      <FlowArrow delay={300} />
      <p
        aria-hidden
        className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[12px] font-semibold text-[#087F63] ring-1 ring-[#CBEEDD] motion-safe:animate-fade-up"
        style={{ animationDelay: '400ms' }}
      >
        <Sparkles className="size-3.5" />
        {opportunityDetected}
      </p>
    </>
  );
}

/** Match → bericht. */
function OutreachVisual() {
  return (
    <>
      <Surface delay={150}>
        <MatchPreview />
      </Surface>
      <FlowArrow delay={300} />
      <Surface delay={400}>
        <OutreachPreview detailed />
      </Surface>
    </>
  );
}

/**
 * De drie stappen van Unlisted in volgorde. `Preview` staat op de welkomstkaarten,
 * `Visual` rechts op de stap-slide.
 */
export const introFlow: { key: FlowKey; icon: LucideIcon; Preview: ComponentType; Visual: ComponentType }[] = [
  { key: 'profile', icon: UserRound, Preview: ProfilePreview, Visual: ProfileVisual },
  { key: 'hunt', icon: Building2, Preview: SignalPreview, Visual: SignalVisual },
  { key: 'outreach', icon: Send, Preview: OutreachPreview, Visual: OutreachVisual },
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
