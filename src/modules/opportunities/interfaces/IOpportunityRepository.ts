import { Opportunity } from '../../../shared/types/Opportunity';
import { OpportunityStatus } from '../../../shared/types/OpportunityType';

export interface IOpportunityRepository {
  save(opportunity: Opportunity): Promise<Opportunity>;
  findByUserId(userId: string): Promise<Opportunity[]>;
  findById(id: string): Promise<Opportunity | null>;
  updateStatus(id: string, status: OpportunityStatus): Promise<void>;
  updateMatchScore(id: string, score: number): Promise<void>;
}
