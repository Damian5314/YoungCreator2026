import { OpportunityType, OpportunitySource, OpportunityStatus } from '../types/OpportunityType';

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  'job': 'Job',
  'internship': 'Internship',
  'traineeship': 'Traineeship',
  'thesis': 'Thesis project',
  'working-student': 'Working student',
  'part-time': 'Part-time work',
  'freelance': 'Freelance',
  'open-application': 'Open application',
  'event': 'Event',
  'hackathon': 'Hackathon',
  'conference': 'Conference',
  'networking': 'Networking',
  'project': 'Project',
  'research': 'Research project',
  'startup': 'Startup',
};

// Groepen voor het voorkeurenformulier: we zoeken bewust breder dan vacatures
export const OPPORTUNITY_TYPE_GROUPS: { label: string; types: OpportunityType[] }[] = [
  { label: 'Work', types: ['job', 'internship', 'traineeship', 'working-student', 'part-time', 'freelance', 'thesis'] },
  { label: 'Events & network', types: ['event', 'hackathon', 'conference', 'networking'] },
  { label: 'Companies & projects', types: ['open-application', 'startup', 'project', 'research'] },
];

export const OPPORTUNITY_SOURCE_LABELS: Record<OpportunitySource, string> = {
  'linkedin': 'LinkedIn',
  'indeed': 'Indeed',
  'glassdoor': 'Glassdoor',
  'company-career-page': 'Career page',
  'radar': 'Radar',
  'news': 'News',
  'event-platform': 'Event platform',
  'startup-database': 'Startup database',
  'web': 'Web',
  'demo': 'Demo data',
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  'new': 'New',
  'reviewed': 'Reviewed',
  'saved': 'Saved',
  'applied': 'Contacted',
  'rejected': 'Not interested',
};

export const CREDIT_COST_PER_SEARCH = 1;

export const PRICING_TIERS = [
  { name: 'Starter', credits: 10, priceEur: 9 },
  { name: 'Pro', credits: 50, priceEur: 35 },
  { name: 'Unlimited', credits: 999, priceEur: 79 },
] as const;
