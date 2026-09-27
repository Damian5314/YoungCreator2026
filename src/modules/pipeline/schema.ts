import { z } from 'zod';
import {
  OPPORTUNITY_SOURCES,
  OPPORTUNITY_TYPES,
  type OpportunitySource,
  type OpportunityType,
} from '@/shared/types/OpportunityType';

// Contract tussen n8n en de app. n8n is vrij rommelig (null, lege strings, komma-lijsten),
// dus we zijn ruim in wat we accepteren en maken het hier netjes.
// Ruwe zoekresultaten (alleen title + url + description, bv. uit Apify) mogen ook: de app vult
// bedrijf, type, locatie en signalen daarna zelf aan (zie enrich.ts / normalize.ts).

const optionalText = (max: number) =>
  z
    .string()
    .nullish()
    .transform((value) => value?.trim().slice(0, max) || undefined);

const optionalUrl = z
  .string()
  .nullish()
  .transform((value) => {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
    } catch {
      return undefined;
    }
  });

const optionalEmail = z
  .string()
  .nullish()
  .transform((value) => {
    const trimmed = value?.trim().toLowerCase();
    return trimmed && z.email().safeParse(trimmed).success ? trimmed : undefined;
  });

// ["React", "SQL"] of "React, SQL"
const textList = z
  .union([z.array(z.unknown()), z.string()])
  .nullish()
  .transform((value) => {
    const raw = typeof value === 'string' ? value.split(',') : (value ?? []);
    return raw
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim().slice(0, 120))
      .filter(Boolean)
      .slice(0, 25);
  });

const optionalDate = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((value) => {
    if (value === null || value === undefined || value === '') return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  });

const TYPE_ALIASES: Record<string, OpportunityType> = {
  vacancy: 'job',
  vacature: 'job',
  fulltime: 'job',
  'full-time': 'job',
  stage: 'internship',
  intern: 'internship',
  parttime: 'part-time',
  bijbaan: 'part-time',
  meetup: 'networking',
  workshop: 'event',
  webinar: 'event',
  company: 'startup',
  'open-sollicitatie': 'open-application',
  afstuderen: 'thesis',
};

// Onbekend of leeg = undefined: dan bepaalt de app het type (AI, of het soort zoekterm)
export function toOpportunityType(value: unknown): OpportunityType | undefined {
  const key = String(value ?? '').trim().toLowerCase().replace(/[\s_]+/g, '-');
  if ((OPPORTUNITY_TYPES as readonly string[]).includes(key)) return key as OpportunityType;
  return TYPE_ALIASES[key];
}

const opportunityType = z.unknown().optional().transform(toOpportunityType);

const SOURCE_ALIASES: Record<string, OpportunitySource> = {
  careers: 'company-career-page',
  'career-page': 'company-career-page',
  eventbrite: 'event-platform',
  meetup: 'event-platform',
  luma: 'event-platform',
  events: 'event-platform',
  crunchbase: 'startup-database',
  dealroom: 'startup-database',
  'google-news': 'news',
  rss: 'news',
  apify: 'web',
};

const opportunitySource = z
  .unknown()
  .optional()
  .transform((value): OpportunitySource => {
    const key = String(value ?? '').trim().toLowerCase().replace(/[\s_]+/g, '-');
    if ((OPPORTUNITY_SOURCES as readonly string[]).includes(key) && key !== 'demo') return key as OpportunitySource;
    return SOURCE_ALIASES[key] ?? 'web';
  });

const companySchema = z.union([
  z.string().transform((name) => ({ name: name.trim() })),
  z.object({
    name: z.string().trim().min(1).max(200),
    domain: optionalText(200),
    website: optionalUrl,
    careerPageUrl: optionalUrl,
    industry: optionalText(120),
    location: optionalText(200),
    description: optionalText(2000),
  }),
]);

const contactSchema = z
  .object({
    name: optionalText(200),
    email: optionalEmail,
    role: optionalText(200),
    url: optionalUrl,
  })
  .nullish()
  .transform((value) => ({ name: value?.name, email: value?.email, role: value?.role, url: value?.url }));

export interface CompanyInfo {
  name: string;
  domain?: string;
  website?: string;
  careerPageUrl?: string;
  industry?: string;
  location?: string;
  description?: string;
}

// Eén gevonden kans. Alleen title en url zijn verplicht; company en type vult de app zo nodig aan.
export const ingestItemSchema = z.object({
  title: z.string().trim().min(1).max(300),
  url: z.string().trim().min(1).transform((value, ctx) => {
    try {
      const url = new URL(value);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
    } catch {
      // valt door naar de fout hieronder
    }
    ctx.addIssue({ code: 'custom', message: 'url must be an http(s) URL' });
    return z.NEVER;
  }),
  company: companySchema
    .nullish()
    .transform((company): CompanyInfo | undefined => (company && company.name.length > 0 ? company : undefined)),
  type: opportunityType,
  // Soort zoekterm uit het zoekplan (job, internship, event, hackathon, startup, news) en de zoekterm zelf
  kind: optionalText(40),
  query: optionalText(300),
  source: opportunitySource,
  externalId: optionalText(300),
  description: optionalText(5000),
  location: optionalText(200),
  remote: z.boolean().nullish().transform((value) => value ?? false),
  requiredSkills: textList,
  salaryMin: z.number().int().nonnegative().nullish().transform((value) => value ?? undefined),
  salaryMax: z.number().int().nonnegative().nullish().transform((value) => value ?? undefined),
  postedAt: optionalDate,
  startsAt: optionalDate,
  isHidden: z.boolean().nullish().transform((value) => value ?? false),
  signals: textList,
  contact: contactSchema,
  // Optioneel: als n8n zelf al (met AI) gescoord heeft, nemen we die score over
  match: z
    .object({
      score: z.coerce.number().transform((score) => Math.round(Math.min(100, Math.max(0, score)))),
      reasons: textList,
    })
    .nullish()
    .transform((value) => value ?? undefined),
});

// Zoals n8n het aanlevert (company/type kunnen ontbreken) ...
export type RawIngestItem = z.output<typeof ingestItemSchema>;
// ... en na het aanvullen door de app (zie enrich.ts)
export type IngestItem = Omit<RawIngestItem, 'company' | 'type'> & { company: CompanyInfo; type: OpportunityType };

// Wat n8n naar POST /api/n8n/results stuurt. Items worden los gevalideerd,
// zodat één kapot item niet de hele levering blokkeert.
export const ingestEnvelopeSchema = z.object({
  runId: z.uuid(),
  items: z.array(z.unknown()).max(500).default([]),
  done: z.boolean().default(true), // false = er komen nog meer leveringen voor deze run
  error: optionalText(1000), // n8n kon niet zoeken → run faalt en credits gaan terug
});

export interface ItemRejection {
  index: number;
  issues: string[];
}

export function parseIngestItems(rawItems: unknown[]): { items: RawIngestItem[]; rejected: ItemRejection[] } {
  const items: RawIngestItem[] = [];
  const rejected: ItemRejection[] = [];
  rawItems.forEach((raw, index) => {
    const result = ingestItemSchema.safeParse(raw);
    if (result.success) items.push(result.data);
    else rejected.push({ index, issues: result.error.issues.map((issue) => `${issue.path.join('.') || 'item'}: ${issue.message}`) });
  });
  return { items, rejected };
}
