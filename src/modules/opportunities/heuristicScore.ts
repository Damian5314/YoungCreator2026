import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { OpportunityType } from '@/shared/types/OpportunityType';
import type { MatchProfile } from '@/modules/pipeline/profile';
import type { IngestItem } from '@/modules/pipeline/schema';

export interface MatchResult {
  score: number; // 0-100
  reasons: string[]; // aan de student gericht ("Uses your skills: ...")
}

// Soorten kansen waarbij "remote only" echt uitmaakt
const WORK_TYPES = new Set<OpportunityType>([
  'job', 'internship', 'traineeship', 'thesis', 'working-student', 'part-time', 'open-application',
]);

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Hele woorden/termen zoeken, zodat "Go" niet matcht op "good" en "C#" wel werkt
function mentions(text: string, term: string): boolean {
  const cleaned = term.trim();
  if (cleaned.length < 2) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}+#])${escapeRegExp(cleaned)}($|[^\\p{L}\\p{N}+#])`, 'iu').test(text);
}

function listText(items: string[], max = 3) {
  return items.slice(0, max).join(', ');
}

// Uitlegbare score zonder AI. Wordt gebruikt als er geen Anthropic-key is of de AI-aanroep faalt.
export function heuristicScore(item: IngestItem, profile: MatchProfile, now = new Date()): MatchResult {
  const { preferences } = profile;
  const text = [item.title, item.description, item.company.name, 'industry' in item.company ? item.company.industry : '', item.requiredSkills.join(' ')]
    .filter(Boolean)
    .join(' \n ');
  const reasons: string[] = [];
  let score = 30;

  // Skills: wat je kunt en wat er gevraagd wordt
  const matchedSkills = profile.skills.filter(
    (skill) => item.requiredSkills.some((required) => required.toLowerCase() === skill.toLowerCase()) || mentions(text, skill),
  );
  if (matchedSkills.length > 0) {
    score += Math.min(30, 10 * matchedSkills.length);
    reasons.push(`Uses your skills: ${listText(matchedSkills)}`);
  }
  const missing = item.requiredSkills.filter((required) => !profile.skills.some((skill) => skill.toLowerCase() === required.toLowerCase()));
  if (item.requiredSkills.length > 0 && missing.length === item.requiredSkills.length) score -= 10;

  // Interesses en sectoren
  const matchedTopics = [...profile.interests, ...preferences.industries].filter(
    (topic, index, all) =>
      mentions(text, topic) && all.findIndex((other) => other.toLowerCase() === topic.toLowerCase()) === index,
  );
  if (matchedTopics.length > 0) {
    score += Math.min(20, 10 * matchedTopics.length);
    reasons.push(`Fits your interest in ${listText(matchedTopics, 2)}`);
  }

  // Gewenste rol in de titel
  const matchedRole = preferences.desiredRoles.find((role) => mentions(item.title, role));
  if (matchedRole) {
    score += 15;
    reasons.push(`Close to the role you want: ${matchedRole}`);
  }

  // Soort kans
  if (preferences.opportunityTypes.length === 0) {
    score += 3;
  } else if (preferences.opportunityTypes.includes(item.type)) {
    score += 10;
    reasons.push(`A ${OPPORTUNITY_TYPE_LABELS[item.type].toLowerCase()}: one of the things you're looking for`);
  } else {
    score -= 10;
  }

  // Locatie en remote
  const location = item.location ?? ('location' in item.company ? item.company.location : undefined) ?? '';
  const matchedLocation = preferences.locations.find((place) => mentions(location, place));
  if (item.remote) {
    score += 5;
    reasons.push('Can be done remotely');
  } else if (matchedLocation) {
    score += 8;
    reasons.push(`In ${matchedLocation}`);
  } else if (preferences.locations.length > 0 && location) {
    score -= 5;
  }
  if (preferences.remoteOnly && !item.remote && WORK_TYPES.has(item.type)) score -= 20;

  // Context die de kans waardevol maakt ("why now"-signalen toont de kaart apart)
  if (item.isHidden) reasons.push('Not publicly posted yet, so less competition');
  if (item.signals.length > 0) score += 5;
  if (item.startsAt) {
    const startsAt = new Date(item.startsAt);
    const days = (startsAt.getTime() - now.getTime()) / 86_400_000;
    if (days >= 0 && days <= 60) reasons.push(`Happening on ${dateFormat.format(startsAt)}, a chance to meet people in person`);
    if (days < 0) score -= 25; // al geweest
  }

  return { score: Math.round(Math.min(98, Math.max(5, score))), reasons: reasons.slice(0, 4) };
}
