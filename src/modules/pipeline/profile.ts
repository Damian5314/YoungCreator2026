import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { OpportunityType } from '@/shared/types/OpportunityType';

// Alles wat de agent over de student weet, op het moment van zoeken.
// Wordt als criteria_snapshot bij de run opgeslagen en (zonder e-mail of user-id) naar n8n gestuurd.
export interface MatchProfile {
  name: string | null;
  nationality: string | null;
  searchYearEndsOn: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  university: string | null;
  graduationYear: number | null;
  languages: string[];
  skills: string[];
  interests: string[];
  ambitions: string | null;
  recentCuriosity: string | null;
  cvSummary: string | null;
  preferences: {
    desiredRoles: string[];
    opportunityTypes: OpportunityType[];
    locations: string[];
    industries: string[];
    remoteOnly: boolean;
    minSalary: number | null;
  };
}

export interface SearchOptions {
  includeHiddenOpportunities: boolean; // radar: bedrijven die (nog) geen vacature hebben
  includeCompanyHunting: boolean; // career pages van gevolgde bedrijven
  maxResults: number;
}

// Company Hunter: bedrijven die de student volgt (opgeslagen of al benaderd), met hun domein
export interface WatchedCompany {
  name: string;
  domain: string;
  careerPageUrl: string | null;
}

export interface RunSnapshot {
  profile: MatchProfile;
  options: SearchOptions;
  searchQueries: string[];
  searchPlan: PlannedQuery[];
  watchCompanies: WatchedCompany[];
}

export class MissingSearchProfileError extends Error {}

export async function loadMatchProfile(
  admin: SupabaseClient,
  userId: string,
  searchProfileId?: string | null,
): Promise<{ profile: MatchProfile; searchProfileId: string; defaults: Omit<SearchOptions, 'maxResults'> }> {
  const [{ data: profile, error: profileError }, searchProfileResult] = await Promise.all([
    admin.from('profiles').select('*').eq('id', userId).maybeSingle(),
    searchProfileId
      ? admin.from('search_profiles').select('*').eq('id', searchProfileId).eq('user_id', userId).maybeSingle()
      : admin.from('search_profiles').select('*').eq('user_id', userId).order('created_at').limit(1).maybeSingle(),
  ]);
  if (profileError) throw profileError;
  if (searchProfileResult.error) throw searchProfileResult.error;
  const search = searchProfileResult.data;
  if (!profile || !search) throw new MissingSearchProfileError('Set up your search profile first.');

  const cvParsed = (profile.cv_parsed ?? null) as { summary?: string } | null;

  return {
    searchProfileId: search.id,
    defaults: {
      includeHiddenOpportunities: search.include_radar,
      includeCompanyHunting: search.include_company_hunter,
    },
    profile: {
      name: profile.full_name,
      nationality: profile.nationality,
      searchYearEndsOn: profile.search_year_ends_on,
      degree: profile.degree,
      fieldOfStudy: profile.field_of_study,
      university: profile.university,
      graduationYear: profile.graduation_year,
      languages: profile.languages ?? [],
      skills: profile.skills ?? [],
      interests: profile.interests ?? [],
      ambitions: profile.ambitions,
      recentCuriosity: profile.recent_curiosity,
      cvSummary: cvParsed?.summary || null,
      preferences: {
        desiredRoles: search.desired_roles ?? [],
        opportunityTypes: search.opportunity_types ?? [],
        locations: search.locations ?? [],
        industries: search.industries ?? [],
        remoteOnly: search.remote_only,
        minSalary: search.min_salary,
      },
    },
  };
}

const MAX_WATCHED_COMPANIES = 5;
const MAX_PLAN_SIZE = 15;
const MAX_HUNTER_QUERIES = 3;

// "Companies we monitor for you": de bedrijven achter kansen die de student heeft opgeslagen of
// benaderd, meest recente eerst. Alleen met een domein, want n8n zoekt op hun eigen site.
export async function loadWatchedCompanies(admin: SupabaseClient, userId: string): Promise<WatchedCompany[]> {
  const { data, error } = await admin
    .from('matches')
    .select('opportunity:opportunities!inner(company:companies!inner(name, domain, career_page_url))')
    .eq('user_id', userId)
    .in('status', ['saved', 'applied'])
    .order('status_changed_at', { ascending: false, nullsFirst: false })
    .limit(30);
  if (error) throw error;

  type Row = { opportunity: { company: { name: string; domain: string | null; career_page_url: string | null } } };
  const companies = new Map<string, WatchedCompany>();
  for (const { opportunity } of (data ?? []) as unknown as Row[]) {
    const { name, domain, career_page_url: careerPageUrl } = opportunity.company;
    if (!domain || companies.has(domain)) continue;
    companies.set(domain, { name, domain, careerPageUrl });
    if (companies.size >= MAX_WATCHED_COMPANIES) break;
  }
  return [...companies.values()];
}

// Soort zoekterm: vertelt n8n en de app wat voor kans er terug hoort te komen
export type SearchKind = 'job' | 'internship' | 'event' | 'hackathon' | 'startup' | 'news';

export interface PlannedQuery {
  query: string;
  kind: SearchKind;
}

// Kant-en-klare zoektermen voor n8n/Apify (Google Search, LinkedIn, Eventbrite, Meetup, nieuws, ...).
// Met gevolgde bedrijven (Company Hunter) krijgen die een eigen zoekterm op hun site; die gaan vóór.
export function buildSearchPlan(
  profile: MatchProfile,
  options?: Pick<SearchOptions, 'includeHiddenOpportunities'>,
  watchCompanies: WatchedCompany[] = [],
): PlannedQuery[] {
  const { preferences } = profile;
  const place = preferences.locations[0] || 'Netherlands';
  const topics = unique([...profile.interests, ...preferences.industries, ...(profile.fieldOfStudy ? [profile.fieldOfStudy] : [])]);
  const wants = new Set(preferences.opportunityTypes);
  const wantsAll = wants.size === 0;
  const plan: PlannedQuery[] = [];

  for (const role of preferences.desiredRoles.slice(0, 3)) {
    plan.push({ query: `${role} ${place}`, kind: 'job' });
    if (wantsAll || wants.has('internship')) plan.push({ query: `${role} internship ${place}`, kind: 'internship' });
  }
  for (const topic of topics.slice(0, 4)) {
    if (wantsAll || wants.has('event') || wants.has('networking') || wants.has('conference')) {
      plan.push({ query: `${topic} events ${place}`, kind: 'event' });
    }
    if (wantsAll || wants.has('hackathon')) plan.push({ query: `${topic} hackathon Netherlands`, kind: 'hackathon' });
    if (wantsAll || wants.has('startup') || wants.has('open-application')) plan.push({ query: `${topic} startups ${place}`, kind: 'startup' });
    // Radar: bedrijfsnieuws dat op groei wijst (funding, nieuw kantoor) = kans vóór er een vacature is
    if (options?.includeHiddenOpportunities !== false) plan.push({ query: `${topic} company news ${place}`, kind: 'news' });
  }

  // Company Hunter: vacatures, stages en career pages op de eigen site van gevolgde bedrijven
  const hunter: PlannedQuery[] = watchCompanies
    .slice(0, MAX_HUNTER_QUERIES)
    .map(({ domain }) => ({ query: `site:${domain} (careers OR jobs OR vacatures OR internship)`, kind: 'job' }));

  const seen = new Set<string>();
  const base = plan
    .filter(({ query }) => {
      const key = query.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_PLAN_SIZE - hunter.length);
  return [...hunter, ...base];
}

export function buildSearchQueries(profile: MatchProfile): string[] {
  return buildSearchPlan(profile).map(({ query }) => query);
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter((value) => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
