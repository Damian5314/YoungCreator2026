import { Opportunity } from '../../shared/types/Opportunity';
import { SearchCriteria } from '../../shared/types/SearchCriteria';

// ISP: alleen de basis scraping verantwoordelijkheid
export interface IScraper {
  readonly sourceName: string;
  scrape(criteria: SearchCriteria): Promise<Opportunity[]>;
  isAvailable(): Promise<boolean>;
}
