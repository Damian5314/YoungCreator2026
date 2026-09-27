import 'server-only';
import { z } from 'zod';
import { generateStructured } from '@/lib/ai/generate';
import { OPPORTUNITY_TYPES } from '@/shared/types/OpportunityType';
import { toIngestItem, type Enrichment } from './normalize';
import type { MatchProfile } from './profile';
import type { IngestItem, RawIngestItem } from './schema';

const BATCH_SIZE = 20;

const enrichmentSchema = z.object({
  results: z.array(
    z.object({
      index: z.number().int(),
      relevant: z.boolean(),
      title: z.string(),
      company: z.string(),
      companyWebsite: z.string().nullable(),
      type: z.enum(OPPORTUNITY_TYPES),
      location: z.string().nullable(),
      isHidden: z.boolean(),
      signals: z.array(z.string()),
      startsAt: z.string().nullable(),
    }),
  ),
});

const SYSTEM_PROMPT = `You turn raw web search results into structured career opportunities for a student in the Netherlands.
For each result:
- relevant: true only if it points to one concrete opportunity (a job, internship, event, hackathon, conference, meetup, startup or company worth approaching, project, research position, or company news that suggests they will hire). false for search-result pages, listicles, generic articles, directories and anything outside the Netherlands unless remote.
- title: a clean, short title of the opportunity (no site name).
- company: the organisation that offers, hosts or is the subject of it (for a LinkedIn job: the employer; for news: the company the article is about). Never the job board, event platform or news site. "" if unknown.
- companyWebsite: the organisation's own website if the result is on it, else null.
- type: the best matching opportunity type.
- location: city or region if mentioned, else null.
- isHidden: true when there is no published vacancy (e.g. news about funding, growth or a new office).
- signals: short "why now" facts from the text (funding, new office, product launch, hiring spree), max 3, [] if none.
- startsAt: ISO date for events if the date is mentioned, else null.
Use only what is in the result. Never invent facts. Return one entry per result, using its index.`;

// Alleen items zonder bedrijf of type hebben de AI nodig; volledige items (demo, of n8n met eigen AI) niet
const needsEnrichment = (item: RawIngestItem) => !item.company || !item.type;

async function enrichBatch(items: RawIngestItem[], profile: MatchProfile): Promise<Map<number, Enrichment> | null> {
  const result = await generateStructured({
    schema: enrichmentSchema,
    system: SYSTEM_PROMPT,
    effort: 'low',
    prompt: `<student_locations>${JSON.stringify(profile.preferences.locations)}</student_locations>\n\n<results>\n${JSON.stringify(
      items.map((item, index) => ({
        index,
        title: item.title,
        url: item.url,
        snippet: item.description?.slice(0, 600),
        searchKind: item.kind,
        searchQuery: item.query,
      })),
      null,
      2,
    )}\n</results>`,
  });
  if (!result) return null;
  return new Map(result.results.filter((entry) => entry.index >= 0 && entry.index < items.length).map((entry) => [entry.index, entry]));
}

/**
 * Maakt van (ruwe) resultaten volledige kansen: AI vult bedrijf, type, locatie en signalen aan
 * en gooit irrelevante hits weg. Zonder AI (of als die faalt) gelden de regels uit normalize.ts.
 */
export async function normalizeItems(items: RawIngestItem[], profile: MatchProfile): Promise<IngestItem[]> {
  const todo = items.map((item, index) => ({ item, index })).filter(({ item }) => needsEnrichment(item));
  const enrichments = new Map<number, Enrichment>();

  for (let start = 0; start < todo.length; start += BATCH_SIZE) {
    const batch = todo.slice(start, start + BATCH_SIZE);
    const found = await enrichBatch(
      batch.map(({ item }) => item),
      profile,
    );
    found?.forEach((enrichment, batchIndex) => enrichments.set(batch[batchIndex].index, enrichment));
  }

  return items
    .map((item, index) => toIngestItem(item, enrichments.get(index)))
    .filter((item): item is IngestItem => item !== null);
}
