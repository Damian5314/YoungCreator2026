import { IOpportunityAgent } from './interfaces/IOpportunityAgent';
import { IScraper } from '../scrapers/interfaces/IScraper';
import { Opportunity } from '../shared/types/Opportunity';
import { SearchCriteria } from '../shared/types/SearchCriteria';
import { UserProfile } from '../shared/types/UserProfile';
import { ScraperRegistry } from '../scrapers/ScraperRegistry';

// Feature 2: One profile -> alle opportunity types (jobs, stages, traineeships, etc.)
// D: afhankelijk van IScraper abstractie, niet van concrete scrapers
export class VacancySearchAgent implements IOpportunityAgent {
  readonly agentName = 'vacancy-search';

  constructor(private readonly scraperRegistry: ScraperRegistry) {}

  async run(criteria: SearchCriteria): Promise<Opportunity[]> {
    const opportunities = await this.scraperRegistry.scrapeAll(criteria);
    return opportunities;
  }

  async scoreOpportunity(opportunity: Opportunity, profile: UserProfile): Promise<number> {
    // TODO: AI scoring op basis van CV en voorkeuren
    return 0;
  }
}
