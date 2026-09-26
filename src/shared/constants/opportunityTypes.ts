import { OpportunityType, OpportunitySource, OpportunityStatus } from '../types/OpportunityType';

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  'job': 'Job',
  'internship': 'Internship',
  'traineeship': 'Traineeship',
  'thesis': 'Thesis project',
  'working-student': 'Working student',
  'open-application': 'Open application',
};

export const OPPORTUNITY_SOURCE_LABELS: Record<OpportunitySource, string> = {
  'linkedin': 'LinkedIn',
  'indeed': 'Indeed',
  'company-career-page': 'Career page',
  'glassdoor': 'Glassdoor',
  'radar': 'Radar',
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  'new': 'New',
  'reviewed': 'Reviewed',
  'saved': 'Saved',
  'applied': 'Applied',
  'rejected': 'Rejected',
};

export const CREDIT_COST_PER_SEARCH = 1;
export const CREDIT_COST_PER_APPLICATION = 2;

export const PRICING_TIERS = [
  { name: 'Starter', credits: 10, priceEur: 9 },
  { name: 'Pro', credits: 50, priceEur: 35 },
  { name: 'Unlimited', credits: 999, priceEur: 79 },
] as const;
