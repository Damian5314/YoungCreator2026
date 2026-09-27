import 'server-only';
import { z } from 'zod';
import { generateStructured } from '@/lib/ai/generate';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { MatchProfile } from '@/modules/pipeline/profile';
import type { IngestItem } from '@/modules/pipeline/schema';
import { heuristicScore, type MatchResult } from './heuristicScore';

const BATCH_SIZE = 25;

const aiScoresSchema = z.object({
  results: z.array(
    z.object({
      index: z.number().int(),
      score: z.number().int(),
      reasons: z.array(z.string()),
    }),
  ),
});

const SYSTEM_PROMPT = `You are the matching engine of a personal AI job hunter for students and recent graduates in the Netherlands, many of them international students.
For each opportunity, judge how valuable it is for this specific student and score it from 0 to 100:
- 85-100: excellent fit, clearly worth reaching out or attending now
- 60-84: good fit
- 40-59: weak or partial fit
- 0-39: poor fit
Opportunities are deliberately broader than vacancies. An event, hackathon, conference, startup or project can score high when it brings the student closer to people and companies that match their skills, interests and ambitions.
Take hard constraints seriously: preferred locations, remote-only, opportunity types, and language requirements the student cannot meet.
For every opportunity give 1 to 3 short reasons written to the student ("You ..."), each under 20 words, concrete, and based only on the profile and the opportunity text. Never invent facts.
Return one result per opportunity, using its index.`;

function describeItem(item: IngestItem, index: number) {
  return {
    index,
    type: OPPORTUNITY_TYPE_LABELS[item.type],
    title: item.title,
    company: item.company.name,
    industry: 'industry' in item.company ? item.company.industry : undefined,
    location: item.location,
    remote: item.remote,
    startsAt: item.startsAt,
    requiredSkills: item.requiredSkills,
    signals: item.signals,
    notPubliclyPosted: item.isHidden,
    description: item.description?.slice(0, 1500),
  };
}

async function scoreBatchWithAi(items: IngestItem[], profile: MatchProfile): Promise<Map<number, MatchResult> | null> {
  const result = await generateStructured({
    schema: aiScoresSchema,
    system: SYSTEM_PROMPT,
    effort: 'low',
    prompt: `<student_profile>\n${JSON.stringify(profile, null, 2)}\n</student_profile>\n\n<opportunities>\n${JSON.stringify(
      items.map(describeItem),
      null,
      2,
    )}\n</opportunities>\n\nScore every opportunity for this student.`,
  });
  if (!result) return null;

  const scores = new Map<number, MatchResult>();
  for (const entry of result.results) {
    if (entry.index < 0 || entry.index >= items.length) continue;
    scores.set(entry.index, {
      score: Math.round(Math.min(100, Math.max(0, entry.score))),
      reasons: entry.reasons.map((reason) => reason.trim()).filter(Boolean).slice(0, 3),
    });
  }
  return scores;
}

// Score per item, in dezelfde volgorde als de invoer.
// Volgorde van voorkeur: score die n8n meestuurde → Claude → regels.
export async function scoreItems(items: IngestItem[], profile: MatchProfile): Promise<MatchResult[]> {
  const results: (MatchResult | undefined)[] = items.map((item) =>
    item.match ? { score: item.match.score, reasons: item.match.reasons.slice(0, 3) } : undefined,
  );

  const todo = items.map((item, index) => ({ item, index })).filter(({ index }) => !results[index]);
  for (let start = 0; start < todo.length; start += BATCH_SIZE) {
    const batch = todo.slice(start, start + BATCH_SIZE);
    const aiScores = await scoreBatchWithAi(
      batch.map(({ item }) => item),
      profile,
    );
    batch.forEach(({ item, index }, batchIndex) => {
      const ai = aiScores?.get(batchIndex);
      results[index] = ai && ai.reasons.length > 0 ? ai : heuristicScore(item, profile);
    });
  }

  return results.map((result, index) => result ?? heuristicScore(items[index], profile));
}
