import { Opportunity } from '../../../shared/types/Opportunity';
import { UserProfile } from '../../../shared/types/UserProfile';

// OCP: nieuwe evaluatie-strategieën kunnen worden toegevoegd zonder bestaande te wijzigen
export interface IOpportunityEvaluator {
  evaluate(opportunity: Opportunity, profile: UserProfile): Promise<number>; // score 0-100
}
