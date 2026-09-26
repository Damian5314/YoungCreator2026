import { BaseScraper } from './base/BaseScraper';
import { Opportunity } from '../shared/types/Opportunity';
import { SearchCriteria } from '../shared/types/SearchCriteria';

export class IndeedScraper extends BaseScraper {
  readonly sourceName = 'indeed';

  async scrape(criteria: SearchCriteria): Promise<Opportunity[]> {
    // TODO: implementeer Indeed scraping logica
    return [];
  }

  protected async healthCheck(): Promise<void> {
    // TODO: ping Indeed om te checken of het bereikbaar is
  }
}
