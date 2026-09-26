import { IAgent } from './IAgent';
import { Opportunity, CompanySignal } from '../../shared/types/Opportunity';
import { SearchCriteria } from '../../shared/types/SearchCriteria';
import { UserProfile } from '../../shared/types/UserProfile';

// ISP: specifieke interface voor opportunity-gerelateerde agents
export interface IOpportunityAgent extends IAgent<SearchCriteria, Opportunity[]> {
  scoreOpportunity(opportunity: Opportunity, profile: UserProfile): Promise<number>;
}

// ISP: specifieke interface voor de radar (bedrijfssignalen)
export interface IRadarAgent extends IAgent<UserProfile, CompanySignal[]> {
  evaluateCompany(companyWebsite: string, profile: UserProfile): Promise<CompanySignal>;
}
