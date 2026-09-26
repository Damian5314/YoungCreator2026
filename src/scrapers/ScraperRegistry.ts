import { IScraper } from './interfaces/IScraper';
import { Opportunity } from '../shared/types/Opportunity';
import { SearchCriteria } from '../shared/types/SearchCriteria';

// OCP: nieuwe scrapers toevoegen = alleen .register() aanroepen, niets hier wijzigen
export class ScraperRegistry {
  private scrapers = new Map<string, IScraper>();

  register(scraper: IScraper): this {
    this.scrapers.set(scraper.sourceName, scraper);
    return this;
  }

  async scrapeAll(criteria: SearchCriteria): Promise<Opportunity[]> {
    const available = await this.getAvailableScrapers();
    const results = await Promise.allSettled(
      available.map((s) => s.scrape(criteria))
    );

    return results
      .filter((r): r is PromiseFulfilledResult<Opportunity[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);
  }

  private async getAvailableScrapers(): Promise<IScraper[]> {
    const checks = await Promise.all(
      [...this.scrapers.values()].map(async (s) => ({
        scraper: s,
        available: await s.isAvailable(),
      }))
    );
    return checks.filter((c) => c.available).map((c) => c.scraper);
  }
}
