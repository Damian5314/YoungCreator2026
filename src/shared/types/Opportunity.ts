import { OpportunityType, OpportunitySource, OpportunityStatus } from './OpportunityType';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyWebsite?: string;
  location: string;
  remote: boolean;
  type: OpportunityType;
  source: OpportunitySource;
  sourceUrl: string;
  description: string;
  requiredSkills: string[];
  matchScore: number; // 0-100, hoe goed past dit bij het profiel
  isHidden: boolean;  // true = gevonden via radar (geen vacature gepubliceerd)
  status: OpportunityStatus;
  postedAt?: Date;
  discoveredAt: Date;
  userId: string;
}

export interface CompanySignal {
  companyName: string;
  website: string;
  signals: {
    recentHiring: boolean;
    growthIndicators: string[];
    newProjects: string[];
    techStack: string[];
    adjacentRoles: string[];
  };
  radarScore: number; // hoe waarschijnlijk dat ze iemand zoals jij nodig hebben
}
