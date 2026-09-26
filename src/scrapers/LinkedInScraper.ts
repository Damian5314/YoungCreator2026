import { BaseScraper } from './base/BaseScraper';
import { Opportunity } from '../shared/types/Opportunity';
import { SearchCriteria } from '../shared/types/SearchCriteria';

export class LinkedInScraper extends BaseScraper {
  readonly sourceName = 'linkedin';

  async scrape(criteria: SearchCriteria): Promise<Opportunity[]> {
    // TODO: implementeer LinkedIn scraping logica
    return [];
  }

  protected async healthCheck(): Promise<void> {
    // TODO: ping LinkedIn om te checken of het bereikbaar is
  }
}
