import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Opportunity } from '@/shared/types/Opportunity';
import type { OpportunitySource, OpportunityStatus, OpportunityType } from '@/shared/types/OpportunityType';
import type { ScheduleFrequency, SearchSchedule } from '@/shared/types/SearchSchedule';
import type { SearchPreferences } from '@/shared/types/UserProfile';

// Leesfuncties voor server components. Alles loopt via RLS: je krijgt alleen je eigen data terug.
// cache() zorgt dat layout en page binnen één request dezelfde query maar één keer doen.

export interface CurrentUser {
  id: string;
  email: string;
}

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
}

export interface SearchProfileData {
  id: string;
  preferences: SearchPreferences;
  includeRadar: boolean;
  includeCompanyHunter: boolean;
  schedule: SearchSchedule;
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
    company: { name: string; website: string | null };
  } | null;
}

// Alle matches van de gebruiker, omgezet naar het Opportunity-type dat de UI al gebruikt
export async function getMatches(): Promise<Opportunity[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('matches')
    .select(
      `id, match_score, status, created_at,
       opportunity:opportunities (
         title, type, source, url, location, remote, description, required_skills, is_hidden, posted_at,
         company:companies ( name, website )
       )`,
    )
    .eq('user_id', user.id)
    .order('match_score', { ascending: false });

  // Zonder gegenereerde database-types denkt supabase-js dat de koppelingen lijsten zijn;
  // een match hoort bij precies één vacature (en een vacature bij één bedrijf), dus het zijn objecten
  return ((data ?? []) as unknown as MatchRow[])
    .filter((row) => row.opportunity)
    .map((row) => {
      const o = row.opportunity!;
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
        isHidden: o.is_hidden,
        status: row.status,
        postedAt: o.posted_at ? new Date(o.posted_at) : undefined,
        discoveredAt: new Date(row.created_at),
        userId: user.id,
      };
    });
}
