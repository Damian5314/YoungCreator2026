import { OpportunityType } from './OpportunityType';

export interface SearchCriteria {
  userId: string;
  keywords: string[];
  opportunityTypes: OpportunityType[];
  locations: string[];
  remoteAllowed: boolean;
  industries: string[];
  includeHiddenOpportunities: boolean; // radar feature
  includeCompanyHunting: boolean;      // autonomous company hunter
  maxResults: number;
}

export interface SearchResult {
  searchId: string;
  criteria: SearchCriteria;
  opportunityIds: string[];
  creditsUsed: number;
  executedAt: Date;
  durationMs: number;
}
