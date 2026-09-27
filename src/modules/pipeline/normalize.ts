import type { OpportunitySource, OpportunityType } from '@/shared/types/OpportunityType';
import type { CompanyInfo, IngestItem, RawIngestItem } from './schema';

// Regels zonder AI om ruwe zoekresultaten om te zetten naar kansen. Ook de terugval als AI faalt.

// Nooit een kans: encyclopedie, video, fora, social feeds
const JUNK_DOMAINS = ['wikipedia.org', 'youtube.com', 'reddit.com', 'quora.com', 'pinterest.com', 'tiktok.com', 'instagram.com'];

// Platforms: het domein is níet het bedrijf (bedrijfsnaam staat hooguit in de titel)
const PLATFORM_SOURCES: [string, OpportunitySource][] = [
  ['linkedin.com', 'linkedin'],
  ['indeed.', 'indeed'],
  ['glassdoor.', 'glassdoor'],
  ['eventbrite.', 'event-platform'],
  ['meetup.com', 'event-platform'],
  ['lu.ma', 'event-platform'],
  ['luma.com', 'event-platform'],
  ['devpost.com', 'event-platform'],
  ['crunchbase.com', 'startup-database'],
  ['dealroom.co', 'startup-database'],
  ['wellfound.com', 'startup-database'],
  ['facebook.com', 'web'],
  ['x.com', 'web'],
  ['twitter.com', 'web'],
  ['medium.com', 'web'],
  ['werkzoeken.nl', 'web'],
  ['nationalevacaturebank.nl', 'web'],
  ['studentjob.nl', 'web'],
  ['iamexpat.nl', 'web'],
  ['jobbird.com', 'web'],
  ['monsterboard.nl', 'web'],
];

// Nieuwssites: het artikel gaat óver een bedrijf, maar dat bedrijf is niet uit het domein af te leiden
const NEWS_DOMAINS = [
  'nos.nl', 'nu.nl', 'fd.nl', 'emerce.nl', 'sprout.nl', 'techcrunch.com', 'tweakers.net', 'bnr.nl',
  'dutchnews.nl', 'nltimes.nl', 'siliconcanals.com', 'techleap.nl', 'computable.nl', 'rtl.nl', 'nrc.nl',
  'volkskrant.nl', 'telegraaf.nl', 'businessinsider', 'reuters.com', 'bloomberg.com', 'news.google.com',
];

const KIND_TYPES: Record<string, OpportunityType> = {
  job: 'job',
  internship: 'internship',
  traineeship: 'traineeship',
  thesis: 'thesis',
  event: 'event',
  networking: 'networking',
  conference: 'conference',
  hackathon: 'hackathon',
  startup: 'startup',
  project: 'project',
  research: 'research',
  news: 'open-application', // nieuws over een bedrijf = kans voor een open sollicitatie
};

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

const matchesDomain = (host: string, domain: string) =>
  domain.endsWith('.') ? host.includes(domain) : host === domain || host.endsWith(`.${domain}`) || host.includes(domain);

export const isJunkUrl = (url: string) => JUNK_DOMAINS.some((domain) => matchesDomain(hostnameOf(url), domain));
export const isNewsUrl = (url: string) => NEWS_DOMAINS.some((domain) => matchesDomain(hostnameOf(url), domain));

function platformSource(url: string): OpportunitySource | undefined {
  const host = hostnameOf(url);
  return PLATFORM_SOURCES.find(([domain]) => matchesDomain(host, domain))?.[1];
}

/** Bron op basis van de url, als n8n niets (of alleen "web") meegaf. */
export function sourceFromUrl(url: string): OpportunitySource {
  const platform = platformSource(url);
  if (platform) return platform;
  if (isNewsUrl(url)) return 'news';
  if (/\/(careers?|jobs?|vacatures?|werken-bij|werkenbij|join-us)(\/|$)/i.test(new URL(url).pathname)) return 'company-career-page';
  return 'web';
}

export const typeFromKind = (kind: string | undefined): OpportunityType | undefined =>
  kind ? KIND_TYPES[kind.toLowerCase()] : undefined;

// "nordwind-robotics.nl" → "Nordwind Robotics"
function nameFromDomain(host: string): string {
  const label = host.split('.').slice(0, -1).pop() ?? host;
  return label
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// Bedrijfsnaam uit een titel van een jobboard: "Acme hiring Data Analyst in Delft | LinkedIn",
// "Data Analyst - Acme - Delft | Indeed.com"
function companyFromTitle(title: string, source: OpportunitySource): string | undefined {
  const clean = title.replace(/\s*[|–-]\s*(LinkedIn|Indeed(\.com)?|Glassdoor)\s*$/i, '').trim();
  if (source === 'linkedin') return clean.match(/^(.+?)\s+hiring\s+/i)?.[1]?.trim();
  if (source === 'indeed') return clean.split(/\s+-\s+/)[1]?.trim();
  if (source === 'glassdoor') return clean.match(/\bat\s+(.+?)(\s+-|$)/i)?.[1]?.trim();
  return undefined;
}

/** Bedrijf zonder AI: eigen domein → naam uit het domein; jobboard → naam uit de titel. */
export function fallbackCompany(item: RawIngestItem): CompanyInfo | undefined {
  if (item.company) return item.company;
  const host = hostnameOf(item.url);
  const platform = platformSource(item.url);
  if (platform) {
    const name = companyFromTitle(item.title, platform);
    return name ? { name } : undefined;
  }
  if (isNewsUrl(item.url) || !host) return undefined; // over wélk bedrijf gaat het? Zonder AI niet te zeggen
  return { name: nameFromDomain(host), domain: host, website: `https://${host}/` };
}

export interface Enrichment {
  relevant: boolean;
  title: string;
  company: string;
  companyWebsite: string | null;
  type: OpportunityType;
  location: string | null;
  isHidden: boolean;
  signals: string[];
  startsAt: string | null;
}

function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Ruw item (+ eventueel AI-aanvulling) → volledig item, of null als het geen bruikbare kans is. */
export function toIngestItem(item: RawIngestItem, enrichment?: Enrichment | null): IngestItem | null {
  if (isJunkUrl(item.url)) return null;
  if (enrichment && !enrichment.relevant) return null;

  const aiCompany = enrichment?.company.trim()
    ? {
        name: enrichment.company.trim().slice(0, 200),
        website: enrichment.companyWebsite ?? undefined,
        domain: enrichment.companyWebsite ? hostnameOf(enrichment.companyWebsite) || undefined : undefined,
      }
    : undefined;
  const company = item.company ?? aiCompany ?? fallbackCompany(item);
  if (!company) return null;

  const isNews = item.kind === 'news' || isNewsUrl(item.url);
  const signals = item.signals.length ? item.signals : (enrichment?.signals ?? (isNews ? [item.title] : []));

  return {
    ...item,
    title: enrichment?.title.trim() || item.title,
    company,
    type: item.type ?? enrichment?.type ?? typeFromKind(item.kind) ?? 'job',
    source: item.source === 'web' ? sourceFromUrl(item.url) : item.source,
    location: item.location ?? enrichment?.location ?? undefined,
    isHidden: item.isHidden || enrichment?.isHidden || isNews,
    signals: signals.map((signal) => signal.trim()).filter(Boolean).slice(0, 5),
    startsAt: item.startsAt ?? isoDate(enrichment?.startsAt),
  };
}
