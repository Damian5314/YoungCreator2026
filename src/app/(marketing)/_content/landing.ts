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

/*
 * Alle copy en voorbeelddata van de landingspagina staat hier, los van de layout.
 */

// ---------------------------------------------------------------------------
// Media: een lege `src` rendert een verzorgde fallback. Zet het bestand in /public/images/<sectie>/ en vul het pad in.
// ---------------------------------------------------------------------------
export interface LandingMedia {
  src: string | null;
  alt: string;
}

export const media = {
  hero: {
    src: '/images/hero/hero-student-canal.png',
    alt: 'International student smiling with a laptop beside an Amsterdam canal at golden hour',
  },
  newsThumb: { src: '/images/hero/hero-news-thumb.jpg', alt: '' },
  // Decoratief watermerk (leeuw + groeicurve) in de trust-kaart; transparante PNG, verhouding ~3:1
  trustEmblem: { src: '/images/trust/trust-lion-emblem.png', alt: '' },
  // Donkere, filmische foto: student achter een laptop, onzeker/gestrest (liggend, ≥ 2400px breed)
  story: {
    src: '/images/story/story-student-late-night.png',
    alt: 'A tired international student at a desk late at night, head resting on one hand, staring at a laptop by the light of a desk lamp',
  },
  // Zonsondergang boven een Amsterdamse gracht, student van achteren met rugzak (rechts). Decoratief:
  // de kop van de CTA draagt de boodschap, dus een lege alt.
  cta: { src: '/images/cta/cta-sunset-canal.jpg', alt: '' },
} satisfies Record<string, LandingMedia>;

// Video achter "Watch our story". Zolang `src` leeg is toont de dialog een nette "binnenkort"-melding.
export const storyVideo = { src: null as string | null, duration: '1:26' };

// ---------------------------------------------------------------------------
// Navigatie
// ---------------------------------------------------------------------------
// Alleen bestemmingen die echt bestaan. Sectie-ID's: #home (hero), #trusted, #problem,
// #how-it-works, #cta. Er is geen About-pagina of succesverhalen-sectie, dus die staan er niet in.
export const nav = {
  home: '#home',
  links: [
    { href: '#problem', label: 'Problem' },
    { href: '#how-it-works', label: 'How it works' },
    // Geen aparte studentensectie: de hero is de pagina voor internationale studenten
    { href: '#home', label: 'For students' },
  ],
  signIn: { href: '/login', label: 'Sign in' },
  cta: { href: '/register', label: 'Find opportunities' },
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const hero = {
  eyebrow: 'For international students in the Netherlands',
  headline: {
    lead: ['You invested in', 'your future.'],
    accent: ['Now find the', 'opportunities.'],
  },
  body: 'Job Hunter helps international students find jobs, internships and hidden opportunities in the Netherlands by analyzing real-time company signals, news and hiring activity, so you don’t have to go back home.',
  primaryCta: { href: '/register', label: 'Find my opportunities' },
  secondaryCta: { href: '#problem', label: 'Watch our story' },
  // Klopt met het creditmodel: eenmalige bundels, geen abonnement (zie PRICING_TIERS)
  note: ['No subscription', 'Pay only for what you use'],
  benefits: [
    { icon: RadioTower, label: ['Real-time', 'company signals'] },
    { icon: Eye, label: ['Hidden', 'opportunities'] },
    { icon: Send, label: ['Personalized', 'outreach'] },
  ] satisfies { icon: LucideIcon; label: [string, string] }[],
  annotations: {
    student: ['Different country.', 'Same ambitions.'],
    cards: ['Turn company signals', 'into opportunities.'],
  },
};

export const heroCards = {
  signal: {
    company: 'ASML',
    time: '2 hours ago',
    title: 'ASML announces new R&D center in Eindhoven',
    tags: ['Expansion', 'Eindhoven', 'R&D'],
  },
  opportunity: {
    label: 'Opportunity for you',
    title: 'This could be a great fit for your skills.',
    reason: 'Based on company expansion and your profile.',
    cta: 'Explore opportunity',
  },
  outreach: {
    label: 'Suggested outreach',
    greeting: 'Hi ASML team,',
    // Bewust alleen een preview: de kaart toont een actie, niet het hele bericht
    preview: 'I saw your announcement about the new R&D center in Eindhoven…',
    cta: 'Send message',
  },
  match: {
    score: 92,
    label: 'Strong match',
    reasons: ['Your skills match', 'Relevant location', 'Growing team'],
  },
};

// ---------------------------------------------------------------------------
// University trust: bewust alleen het label en de namen, geen aantallen of beoordelingen
// ---------------------------------------------------------------------------
export const trust = {
  label: 'Trusted by students from top universities',
  // Tekst-woordmerken (geen officiële logo's). `|` = regelafbreking.
  universities: [
    { name: 'University of|Amsterdam', style: 'serif' },
    { name: 'VU Amsterdam', style: 'split' },
    { name: 'TU Delft', style: 'bold' },
    { name: 'Erasmus University Rotterdam', style: 'stacked' },
    { name: 'Universiteit|Utrecht', style: 'serif' },
  ] as const,
};

// ---------------------------------------------------------------------------
// Probleem / verhaal
// ---------------------------------------------------------------------------
export const story = {
  eyebrow: 'The problem',
  title: ['You didn’t come', 'all this way to', 'have no', 'opportunities.'],
  body: 'A short story about the real challenges international students face — and how Job Hunter changes that.',
  watch: 'Watch our story',
  videoPending: {
    title: 'Our story is coming soon.',
    text: 'We’re putting the finishing touches on the film.',
  },
  closeVideo: 'Close video',
  statements: [
    { title: '200+ applications', detail: 'No response.' },
    { title: 'Months of searching.', detail: 'Still nothing.' },
    { title: 'Do I have to go back home?', detail: null },
  ],
  annotation: ['A reality many', 'international students face.'],
};

// ---------------------------------------------------------------------------
// Signalen / product: "We look beyond job boards"
// ---------------------------------------------------------------------------
// Toon per signaaltype: zachte tegel + icoonkleur, ook leesbaar in dark mode
export type SignalTone = 'mint' | 'purple' | 'orange' | 'blue';

export const signals = {
  eyebrow: 'A smarter way to find opportunities',
  title: { lead: 'We look beyond', accent: 'job boards.' },
  body: 'Job Hunter analyzes real-time company signals, news and hiring activity to find opportunities before everyone else sees them.',
  items: [
    { icon: Newspaper, label: ['Company', 'news'], tone: 'mint' },
    { icon: TrendingUp, label: ['Funding', 'rounds'], tone: 'purple' },
    { icon: UserPlus, label: ['Hiring', 'activity'], tone: 'orange' },
    { icon: MapPin, label: ['Expansion', 'signals'], tone: 'blue' },
  ] satisfies { icon: LucideIcon; label: [string, string]; tone: SignalTone }[],
  primaryCta: { href: '/register', label: 'Get started free' },
  secondaryCta: { href: '#problem', label: 'Watch our story' },
  note: ['No credit card required', 'Free for students'],
  annotation: ['Real opportunities.', 'Not just job listings.'],
  // Het echte dashboard als productbeeld (transparante PNG, 1536×1024)
  dashboard: {
    src: '/images/beyond/beyond-dashboard-signals.png',
    width: 1536,
    height: 1024,
    alt: 'The Job Hunter dashboard: top opportunities matched to your profile, live company signals such as funding and hiring, and your agent’s recent activity',
  },
};

// ---------------------------------------------------------------------------
// Afsluitende CTA + footer
// ---------------------------------------------------------------------------
export const finalCta = {
  title: ['Your next opportunity', 'might already be happening.'],
  body: 'Find it with Job Hunter.',
  primary: { href: '/register', label: 'Find my opportunities' },
  secondary: { href: '#how-it-works', label: 'Watch how it works' },
  trust: ['No credit card required', 'Free for students'],
  annotation: ['Same city.', 'More opportunities.'],
};

export type SocialPlatform = 'linkedin' | 'instagram' | 'x' | 'youtube';

// Alleen echte bestemmingen: geen placeholders of verzonnen URL's.
export const footer = {
  about:
    'Job Hunter helps international students in the Netherlands turn real-time company signals into jobs, internships and hidden opportunities.',
  statement: 'Real opportunities. Not just job listings.',
  columns: [
    {
      title: 'Product',
      links: [
        { href: '#how-it-works', label: 'How it works' },
        { href: '#home', label: 'For students' },
      ],
    },
    {
      title: 'Get started',
      links: [
        { href: '/register', label: 'Find opportunities' },
        { href: '/register', label: 'Create account' },
        { href: '/login', label: 'Sign in' },
      ],
    },
  ],
  social: {
    title: 'Follow the signal',
    text: 'Stay updated and join our journey.',
    // Vul in zodra de accounts bestaan, bijv. { platform: 'linkedin', label: 'LinkedIn', href: 'https://…' }.
    // Zonder links toont de footer geen iconen.
    links: [] as { platform: SocialPlatform; label: string; href: string }[],
    annotation: ['Same city.', 'More opportunities.'],
  },
  copyright: '© 2026 Job Hunter',
  tagline: 'Made in the Netherlands, for international students.',
};
