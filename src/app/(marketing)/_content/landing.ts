import type { LucideIcon } from 'lucide-react';
import {
  Eye,
  MapPin,
  Newspaper,
  RadioTower,
  Send,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import type { Dictionary } from '@/i18n/dictionaries';
import { COMPANY, COMPANY_ADDRESS } from '@/shared/constants/company';

/*
 * Alle niet-tekstuele config van de landingspagina (iconen, links, afbeeldingen, tonen),
 * los van de layout. De teksten zelf staan in src/i18n/dictionaries/{en,nl}/landing.ts;
 * buildLanding() voegt beide samen tot de objecten die de secties gebruiken.
 * Server Components: buildLanding((await getT()).landing), Client Components: buildLanding(useT().landing).
 */

// ---------------------------------------------------------------------------
// Media: een lege `src` rendert een verzorgde fallback. Zet het bestand in /public/images/<sectie>/ en vul het pad in.
// ---------------------------------------------------------------------------
export interface LandingMedia {
  src: string | null;
  alt: string;
}

// Video achter "Watch our story" (1920×1080, H.264/AAC, 2:00). Zolang `src` leeg is toont de dialog een nette "binnenkort"-melding.
const storyVideo = { src: '/videos/unlisted-story.mp4' as string | null, duration: '2:00' };

// ---------------------------------------------------------------------------
// University trust: bewust alleen het label en de namen, geen aantallen of beoordelingen
// ---------------------------------------------------------------------------
// Tekst-woordmerken (geen officiële logo's). `|` = regelafbreking. Eigennamen: niet vertalen.
const universities = [
  { name: 'University of|Amsterdam', style: 'serif' },
  { name: 'VU Amsterdam', style: 'split' },
  { name: 'TU Delft', style: 'bold' },
  { name: 'Erasmus University Rotterdam', style: 'stacked' },
  { name: 'Universiteit|Utrecht', style: 'serif' },
] as const;

export type University = (typeof universities)[number];

// Toon per signaaltype: zachte tegel + icoonkleur, ook leesbaar in dark mode
export type SignalTone = 'mint' | 'purple' | 'orange' | 'blue';

export type SocialPlatform = 'linkedin' | 'instagram' | 'x' | 'youtube';

// Vul in zodra de accounts bestaan, bijv. { platform: 'linkedin', label: 'LinkedIn', href: 'https://…' }.
// Zonder links toont de footer geen iconen. `label` is de merknaam (niet vertalen).
const socialLinks = [] as { platform: SocialPlatform; label: string; href: string }[];

/** Voegt de teksten van één taal samen met de vaste config. Puur: geen hooks, geen server-only imports. */
export function buildLanding(t: Dictionary['landing']) {
  const media = {
    hero: {
      src: '/images/hero/hero-student-canal.png',
      alt: t.media.heroAlt,
    },
    newsThumb: { src: '/images/hero/hero-news-thumb.jpg', alt: '' },
    // Decoratief watermerk (leeuw + groeicurve) in de trust-kaart; transparante PNG, verhouding ~3:1
    trustEmblem: { src: '/images/trust/trust-lion-emblem.png', alt: '' },
    // Donkere, filmische foto: student achter een laptop, onzeker/gestrest (liggend, ≥ 2400px breed)
    story: {
      src: '/images/story/story-student-late-night.png',
      alt: t.media.storyAlt,
    },
    // Zonsondergang boven een Amsterdamse gracht, student van achteren met rugzak (rechts). Decoratief:
    // de kop van de CTA draagt de boodschap, dus een lege alt.
    cta: { src: '/images/cta/cta-sunset-canal.jpg', alt: '' },
  } satisfies Record<string, LandingMedia>;

  // -------------------------------------------------------------------------
  // Navigatie
  // -------------------------------------------------------------------------
  // Alleen bestemmingen die echt bestaan. Sectie-ID's: #home (hero), #trusted, #problem,
  // #how-it-works, #cta. Er is geen About-pagina of succesverhalen-sectie, dus die staan er niet in.
  const nav = {
    home: '#home',
    links: [
      { href: '#problem', label: t.nav.links.problem },
      { href: '#how-it-works', label: t.nav.links.howItWorks },
      // Geen aparte studentensectie: de hero is de pagina voor internationale studenten
      { href: '#home', label: t.nav.links.forStudents },
      { href: '/pricing', label: t.nav.links.pricing },
    ],
    signIn: { href: '/login', label: t.nav.signIn },
    cta: { href: '/register', label: t.nav.cta },
  };

  // -------------------------------------------------------------------------
  // Hero
  // -------------------------------------------------------------------------
  const hero = {
    eyebrow: t.hero.eyebrow,
    headline: t.hero.headline,
    body: t.hero.body,
    primaryCta: { href: '/register', label: t.hero.primaryCta },
    secondaryCta: { href: '#problem', label: t.hero.secondaryCta },
    // Klopt met het creditmodel: iedereen krijgt één gratis zoekopdracht (FREE_WELCOME_CREDITS),
    // daarna betaald via eenmalige creditpakketten, geen abonnement
    note: t.hero.note,
    benefits: [
      { icon: RadioTower, label: t.hero.benefits.signals },
      { icon: Eye, label: t.hero.benefits.hidden },
      { icon: Send, label: t.hero.benefits.outreach },
    ] satisfies { icon: LucideIcon; label: [string, string] }[],
    annotations: t.hero.annotations,
  };

  const heroCards = {
    exampleLabel: t.heroCards.exampleLabel,
    signal: {
      company: 'ASML',
      time: t.heroCards.signal.time,
      title: t.heroCards.signal.title,
      tags: t.heroCards.signal.tags,
      tagsLabel: t.heroCards.signal.tagsLabel,
    },
    opportunity: t.heroCards.opportunity,
    // Bewust alleen een preview: de kaart toont een actie, niet het hele bericht
    outreach: t.heroCards.outreach,
    match: {
      score: 92,
      label: t.heroCards.match.label,
      reasons: t.heroCards.match.reasons,
    },
  };

  const trust = {
    label: t.trust.label,
    universities,
  };

  // -------------------------------------------------------------------------
  // Probleem / verhaal
  // -------------------------------------------------------------------------
  const story = t.story;

  // -------------------------------------------------------------------------
  // Signalen / product: "We look beyond job boards"
  // -------------------------------------------------------------------------
  const signals = {
    eyebrow: t.signals.eyebrow,
    title: t.signals.title,
    body: t.signals.body,
    items: [
      { icon: Newspaper, label: t.signals.items.news, tone: 'mint' },
      { icon: TrendingUp, label: t.signals.items.funding, tone: 'purple' },
      { icon: UserPlus, label: t.signals.items.hiring, tone: 'orange' },
      { icon: MapPin, label: t.signals.items.expansion, tone: 'blue' },
    ] satisfies { icon: LucideIcon; label: [string, string]; tone: SignalTone }[],
    primaryCta: { href: '/register', label: t.signals.primaryCta },
    secondaryCta: { href: '#problem', label: t.signals.secondaryCta },
    note: t.signals.note,
    annotation: t.signals.annotation,
    // Het echte dashboard als productbeeld (transparante PNG, 1536×1024)
    dashboard: {
      src: '/images/beyond/beyond-dashboard-signals.png',
      width: 1536,
      height: 1024,
      alt: t.signals.dashboardAlt,
    },
  };

  // -------------------------------------------------------------------------
  // Afsluitende CTA + footer
  // -------------------------------------------------------------------------
  const finalCta = {
    title: t.finalCta.title,
    body: t.finalCta.body,
    primary: { href: '/register', label: t.finalCta.primary },
    secondary: { href: '#how-it-works', label: t.finalCta.secondary },
    trust: t.finalCta.trust,
    annotation: t.finalCta.annotation,
  };

  // Alleen echte bestemmingen: geen placeholders of verzonnen URL's. Ankers met `/` ervoor,
  // zodat de footer ook op /privacy en /terms naar de juiste sectie van de homepage linkt.
  const { columns } = t.footer;
  const footer = {
    about: t.footer.about,
    statement: t.footer.statement,
    columns: [
      {
        title: columns.product.title,
        links: [
          { href: '/#how-it-works', label: columns.product.links.howItWorks },
          { href: '/#home', label: columns.product.links.forStudents },
          { href: '/pricing', label: columns.product.links.pricing },
        ],
      },
      {
        title: columns.getStarted.title,
        links: [
          { href: '/register', label: columns.getStarted.links.findOpportunities },
          { href: '/register', label: columns.getStarted.links.createAccount },
          { href: '/login', label: columns.getStarted.links.signIn },
        ],
      },
    ],
    social: {
      title: t.footer.social.title,
      text: t.footer.social.text,
      links: socialLinks,
      linkLabel: t.footer.social.linkLabel,
      annotation: t.footer.social.annotation,
    },
    copyright: '© 2026 Unlisted',
    tagline: t.footer.tagline,
    legal: {
      label: t.footer.legal.label,
      links: [
        { href: '/privacy', label: t.footer.legal.privacy },
        { href: '/terms', label: t.footer.legal.terms },
        { href: '/faq', label: t.footer.legal.faq },
        { href: '/contact', label: t.footer.legal.contact },
      ],
    },
    // "Unlisted is a product of TechTable · KvK … · VAT ID … · adres"
    company: {
      productOf: t.footer.productOf,
      name: COMPANY.legalName,
      website: COMPANY.website,
      details: [`${t.footer.kvk} ${COMPANY.kvk}`, `${t.footer.vat} ${COMPANY.vatId}`, COMPANY_ADDRESS],
    },
  };

  return { media, storyVideo, nav, hero, heroCards, trust, story, signals, finalCta, footer };
}
