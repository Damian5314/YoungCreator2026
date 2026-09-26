import { Opportunity } from '../../../shared/types/Opportunity';

// S: alleen verantwoordelijk voor notificaties sturen
export interface INotificationService {
  notifyNewOpportunities(userId: string, opportunities: Opportunity[]): Promise<void>;
  notifyCareerPageChanged(userId: string, companyName: string): Promise<void>;
  notifyLowCredits(userId: string, remaining: number): Promise<void>;
}
