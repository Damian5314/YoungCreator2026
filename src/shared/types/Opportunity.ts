import { OpportunityType, OpportunitySource, OpportunityStatus } from './OpportunityType';

export type OutreachStatus = 'draft' | 'sending' | 'sent' | 'failed';

export interface OpportunityContact {
  name?: string;
  email?: string;
  role?: string;
  url?: string;
}

// Een gevonden kans zoals de UI hem toont. id = id van de match (persoonlijk resultaat).
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
  matchReasons: string[]; // waarom het bij je past, in gewone taal
  signals: string[]; // "why now": funding, nieuw kantoor, ...
  isHidden: boolean;  // true = gevonden via radar (geen vacature gepubliceerd)
  status: OpportunityStatus;
  startsAt?: Date; // events
  contact?: OpportunityContact;
  outreachStatus?: OutreachStatus;
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
