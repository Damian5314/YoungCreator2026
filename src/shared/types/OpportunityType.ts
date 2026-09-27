// Zelfde waarden als de enums in de database (supabase/migrations)
export const OPPORTUNITY_TYPES = [
  'job',
  'internship',
  'traineeship',
  'thesis',
  'working-student',
  'part-time',
  'freelance',
  'open-application',
  'event',
  'hackathon',
  'conference',
  'networking',
  'project',
  'research',
  'startup',
] as const;

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const OPPORTUNITY_SOURCES = [
  'linkedin',
  'indeed',
  'glassdoor',
  'company-career-page',
  'radar',
  'news',
  'event-platform',
  'startup-database',
  'web',
  'demo',
] as const;

export type OpportunitySource = (typeof OPPORTUNITY_SOURCES)[number];

export const OPPORTUNITY_STATUSES = ['new', 'reviewed', 'saved', 'applied', 'rejected'] as const;

export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];
