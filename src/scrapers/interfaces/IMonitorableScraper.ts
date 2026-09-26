import { IScraper } from './IScraper';
import { Opportunity } from '../../shared/types/Opportunity';

// ISP: alleen scrapers die een bedrijf continu kunnen monitoren implementeren dit
export interface IMonitorableScraper extends IScraper {
  monitorCompany(companyWebsite: string): Promise<Opportunity[]>;
  hasCareerPageChanged(companyWebsite: string, lastCheckedAt: Date): Promise<boolean>;
}
