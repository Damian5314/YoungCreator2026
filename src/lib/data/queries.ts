import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Opportunity, OutreachStatus } from '@/shared/types/Opportunity';
import type { OpportunitySource, OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';
import type { ScheduleFrequency, SearchSchedule } from '@/shared/types/SearchSchedule';
import type { SearchPreferences } from '@/shared/types/UserProfile';

// Leesfuncties voor server components. Alles loopt via RLS: je krijgt alleen je eigen data terug.
// cache() zorgt dat layout en page binnen één request dezelfde query maar één keer doen.

export interface CurrentUser {
  id: string;
  email: string;
}

export type AutomationLevel = 1 | 2 | 3;

export interface ProfileData {
  fullName: string | null;
  nationality: string | null;
  searchYearEndsOn: string | null; // 'YYYY-MM-DD'
  degree: string | null;
  fieldOfStudy: string | null;
  university: string | null;
  graduationYear: number | null;
  languages: string[];
  skills: string[];
  interests: string[];
  ambitions: string | null;
  recentCuriosity: string | null;
  hasCv: boolean;
  cvSummary: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  automationLevel: AutomationLevel;
  autoSendConsentAt: string | null;
  dailySendLimit: number;
  needsIntro: boolean; // introductie na de eerste keer inloggen nog niet gezien
}

export interface SearchProfileData {
  id: string;
  preferences: SearchPreferences;
  includeRadar: boolean;
  includeCompanyHunter: boolean;
  schedule: SearchSchedule;
  nextRunAt: string | null;
}

export type RunStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface SearchRunData {
  id: string;
  status: RunStatus;
  trigger: 'manual' | 'scheduled';
  resultsFound: number;
  newResults: number;
  errorMessage: string | null;
  createdAt: string;
  finishedAt: string | null;
}

export interface OutreachMessageData {
  id: string;
  matchId: string;
  toEmail: string | null;
  toName: string | null;
  subject: string;
  body: string;
  status: OutreachStatus;
  createdBy: 'user' | 'agent';
  sentVia: 'n8n' | 'manual' | null;
  sentAt: string | null;
  errorMessage: string | null;
  updatedAt: string;
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;
  return { id: data.claims.sub, email: data.claims.email ?? '' };
});

export const getProfile = cache(async (): Promise<ProfileData | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!data) return null;

  return {
    fullName: data.full_name,
    nationality: data.nationality,
    searchYearEndsOn: data.search_year_ends_on,
    degree: data.degree,
    fieldOfStudy: data.field_of_study,
    university: data.university,
    graduationYear: data.graduation_year,
    languages: data.languages ?? [],
    skills: data.skills ?? [],
    interests: data.interests ?? [],
    ambitions: data.ambitions,
    recentCuriosity: data.recent_curiosity,
    hasCv: Boolean(data.cv_file_path),
    cvSummary: (data.cv_parsed as { summary?: string } | null)?.summary || null,
    linkedinUrl: data.linkedin_url,
    portfolioUrl: data.portfolio_url,
    automationLevel: (data.automation_level ?? 1) as AutomationLevel,
    autoSendConsentAt: data.auto_send_consent_at,
    dailySendLimit: data.daily_send_limit ?? 3,
    // Zonder de onboarding-migratie bestaat de kolom niet: dan geen introductie (hij kan niet onthouden worden)
    needsIntro: 'onboarded_at' in data && data.onboarded_at === null,
  };
});

// Voorlopig één zoekprofiel per gebruiker (de database ondersteunt er meer)
export const getSearchProfile = cache(async (): Promise<SearchProfileData | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('search_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at')
    .limit(1)
    .maybeSingle();
  if (!data) return null;

  return {
    id: data.id,
    preferences: {
      desiredRoles: data.desired_roles,
      opportunityTypes: data.opportunity_types,
      locations: data.locations,
      remoteOnly: data.remote_only,
      industries: data.industries,
      minSalary: data.min_salary ?? undefined,
    },
    includeRadar: data.include_radar,
    includeCompanyHunter: data.include_company_hunter,
    schedule: {
      userId: user.id,
      enabled: data.schedule_enabled,
      frequency: data.schedule_frequency as ScheduleFrequency,
      dayOfWeek: data.schedule_day_of_week,
      time: String(data.schedule_time).slice(0, 5), // '08:00:00' -> '08:00'
    },
    nextRunAt: data.next_run_at,
  };
});

export const getCreditBalance = cache(async (): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) return 0;

  const supabase = await createClient();
  const { data } = await supabase.from('credit_balances').select('balance').eq('user_id', user.id).maybeSingle();
  return data?.balance ?? 0;
});

interface MatchRow {
  id: string;
  match_score: number;
  match_reasons: string[] | null;
  status: OpportunityStatus;
  created_at: string;
  opportunity: {
    title: string;
    type: OpportunityType;
    source: OpportunitySource;
    url: string;
    location: string | null;
    remote: boolean;
    description: string | null;
    required_skills: string[];
    is_hidden: boolean;
    posted_at: string | null;
    starts_at: string | null;
    signals: string[] | null;
    contact_name: string | null;
    contact_email: string | null;
    contact_role: string | null;
    contact_url: string | null;
    company: { name: string; website: string | null };
  } | null;
  // 1-op-1 relatie: PostgREST geeft een object, maar zonder types kan het ook een lijst lijken
  outreach: { status: OutreachStatus } | { status: OutreachStatus }[] | null;
}

const MATCH_SELECT = `id, match_score, match_reasons, status, created_at,
  opportunity:opportunities (
    title, type, source, url, location, remote, description, required_skills, is_hidden, posted_at,
    starts_at, signals, contact_name, contact_email, contact_role, contact_url,
    company:companies ( name, website )
  ),
  outreach:outreach_messages ( status )`;

function toOpportunity(row: MatchRow, userId: string): Opportunity {
  const o = row.opportunity!;
  const outreach = Array.isArray(row.outreach) ? row.outreach[0] : row.outreach;
  const hasContact = o.contact_name || o.contact_email || o.contact_url;
  return {
    id: row.id,
    title: o.title,
    company: o.company.name,
    companyWebsite: o.company.website ?? undefined,
    location: o.location ?? '',
    remote: o.remote,
    type: o.type,
    source: o.source,
    sourceUrl: o.url,
    description: o.description ?? '',
    requiredSkills: o.required_skills,
    matchScore: row.match_score,
    matchReasons: row.match_reasons ?? [],
    signals: o.signals ?? [],
    isHidden: o.is_hidden,
    status: row.status,
    startsAt: o.starts_at ? new Date(o.starts_at) : undefined,
    contact: hasContact
      ? {
          name: o.contact_name ?? undefined,
          email: o.contact_email ?? undefined,
          role: o.contact_role ?? undefined,
          url: o.contact_url ?? undefined,
        }
      : undefined,
    outreachStatus: outreach?.status,
    postedAt: o.posted_at ? new Date(o.posted_at) : undefined,
    discoveredAt: new Date(row.created_at),
    userId,
  };
}

// Alle matches van de gebruiker (of alleen de nieuwe uit één run), omgezet naar het Opportunity-type van de UI
export async function getMatches({ searchRunId }: { searchRunId?: string } = {}): Promise<Opportunity[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  let query = supabase.from('matches').select(MATCH_SELECT).eq('user_id', user.id);
  if (searchRunId) query = query.eq('search_run_id', searchRunId);
  const { data } = await query.order('match_score', { ascending: false });

  // Zonder gegenereerde database-types denkt supabase-js dat de koppelingen lijsten zijn;
  // een match hoort bij precies één vacature (en een vacature bij één bedrijf), dus het zijn objecten
  return ((data ?? []) as unknown as MatchRow[]).filter((row) => row.opportunity).map((row) => toOpportunity(row, user.id));
}

export async function getMatch(matchId: string): Promise<Opportunity | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from('matches').select(MATCH_SELECT).eq('id', matchId).eq('user_id', user.id).maybeSingle();
  const row = data as unknown as MatchRow | null;
  return row?.opportunity ? toOpportunity(row, user.id) : null;
}

interface RunRow {
  id: string;
  status: RunStatus;
  triggered_by: 'manual' | 'scheduled';
  results_found: number;
  new_results: number;
  error_message: string | null;
  created_at: string;
  finished_at: string | null;
}

function toRun(row: RunRow): SearchRunData {
  return {
    id: row.id,
    status: row.status,
    trigger: row.triggered_by,
    resultsFound: row.results_found,
    newResults: row.new_results,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    finishedAt: row.finished_at,
  };
}

const RUN_SELECT = 'id, status, triggered_by, results_found, new_results, error_message, created_at, finished_at';

export async function getRun(runId: string): Promise<SearchRunData | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from('search_runs').select(RUN_SELECT).eq('id', runId).eq('user_id', user.id).maybeSingle();
  return data ? toRun(data as RunRow) : null;
}

export async function getRecentRuns(limit = 5): Promise<SearchRunData[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('search_runs')
    .select(RUN_SELECT)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  return ((data ?? []) as RunRow[]).map(toRun);
}

interface OutreachRow {
  id: string;
  match_id: string;
  to_email: string | null;
  to_name: string | null;
  subject: string;
  body: string;
  status: OutreachStatus;
  created_by: 'user' | 'agent';
  sent_via: 'n8n' | 'manual' | null;
  sent_at: string | null;
  error_message: string | null;
  updated_at: string;
}

function toOutreach(row: OutreachRow): OutreachMessageData {
  return {
    id: row.id,
    matchId: row.match_id,
    toEmail: row.to_email,
    toName: row.to_name,
    subject: row.subject,
    body: row.body,
    status: row.status,
    createdBy: row.created_by,
    sentVia: row.sent_via,
    sentAt: row.sent_at,
    errorMessage: row.error_message,
    updatedAt: row.updated_at,
  };
}

export async function getOutreachForMatch(matchId: string): Promise<OutreachMessageData | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from('outreach_messages').select('*').eq('match_id', matchId).eq('user_id', user.id).maybeSingle();
  return data ? toOutreach(data as OutreachRow) : null;
}

export interface OutreachListItem extends OutreachMessageData {
  opportunityTitle: string;
  company: string;
}

export async function getOutreachList(): Promise<OutreachListItem[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('outreach_messages')
    .select('*, match:matches ( opportunity:opportunities ( title, company:companies ( name ) ) )')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  type Row = OutreachRow & { match: { opportunity: { title: string; company: { name: string } } | null } | null };
  return ((data ?? []) as unknown as Row[]).map((row) => ({
    ...toOutreach(row),
    opportunityTitle: row.match?.opportunity?.title ?? 'Opportunity',
    company: row.match?.opportunity?.company?.name ?? '',
  }));
}
