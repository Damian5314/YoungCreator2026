import { OpportunityType } from '../types/OpportunityType';

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  'job': 'Baan',
  'internship': 'Stage',
  'traineeship': 'Traineeship',
  'thesis': 'Afstudeeropdracht',
  'working-student': 'Werkstudent',
  'open-application': 'Open Sollicitatie',
};

export const CREDIT_COST_PER_SEARCH = 1;
export const CREDIT_COST_PER_APPLICATION = 2;

export const PRICING_TIERS = [
  { name: 'Starter', credits: 10, priceEur: 9 },
  { name: 'Pro', credits: 50, priceEur: 35 },
  { name: 'Unlimited', credits: 999, priceEur: 79 },
] as const;
