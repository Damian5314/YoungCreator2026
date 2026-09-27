// Bedrijfssignalen komen als vrije tekst binnen ("Raised a €2.4M seed round last month").
// Hier krijgen ze een soort, zodat de UI overal hetzelfde label, icoon en dezelfde uitleg toont.

export type SignalKind =
  | 'funding'
  | 'product'
  | 'team'
  | 'office'
  | 'expansion'
  | 'hiring'
  | 'leadership'
  | 'event'
  | 'rnd'
  | 'news';

// Volgorde telt: de eerste regel die past wint ("new R&D center" is R&D, niet een nieuw product)
const RULES: [SignalKind, RegExp][] = [
  ['funding', /\b(rais(e|ed|es|ing)|funding|funded|series [a-e]|seed|grant|investment round|investors?)\b/i],
  ['leadership', /\b(ceo|cto|cfo|coo|chief|appoint(s|ed)?|new head of|joins as|leadership)\b/i],
  ['rnd', /(r&d|\bresearch\b|\blab\b|innovation (centre|center)|\bpatent)/i],
  ['hiring', /\b(hiring|hired|hires|recruit(s|ing)?|vacanc(y|ies)|open roles?)\b/i],
  ['team', /\b(team|headcount|double|doubling|grow(s|ing)? (the|its|their) team)\b/i],
  ['product', /\b(launch(es|ed)?|product|releas(e|ed|es)|introduc(e|ed|es)|beta)\b/i],
  ['office', /\b(office|headquarters|hq)\b/i],
  ['expansion', /\b(expan(d|ds|ded|sion)|facility|new market|second|opening|opens|abroad|international)\b/i],
  ['event', /\b(hackathon|meetup|conference|summit|event|demo day|tech days)\b/i],
];

export function classifySignal(text: string): SignalKind {
  return RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? 'news';
}

// Signalen die erop wijzen dat een bedrijf groeit (filter "Growing" op de bedrijvenpagina)
export const GROWTH_SIGNALS: ReadonlySet<SignalKind> = new Set([
  'funding',
  'product',
  'team',
  'office',
  'expansion',
  'hiring',
  'rnd',
]);
