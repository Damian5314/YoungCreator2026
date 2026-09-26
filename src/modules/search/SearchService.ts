import { ISearchService } from './interfaces/ISearchService';
import { IBillingService } from '../billing/interfaces/IBillingService';
import { IOpportunityAgent } from '../../agents/interfaces/IOpportunityAgent';
import { SearchCriteria, SearchResult } from '../../shared/types/SearchCriteria';
import { CREDIT_COST_PER_SEARCH } from '../../shared/constants/opportunityTypes';

// S: alleen verantwoordelijk voor search orchestratie
// D: afhankelijk van abstracties (IBillingService, IOpportunityAgent)
export class SearchService implements ISearchService {
  constructor(
    private readonly billing: IBillingService,
    private readonly vacancyAgent: IOpportunityAgent,
    private readonly radarAgent?: IOpportunityAgent,
    private readonly hunterAgent?: IOpportunityAgent,
  ) {}

  async executeSearch(criteria: SearchCriteria): Promise<SearchResult> {
    await this.billing.deductCredits(criteria.userId, CREDIT_COST_PER_SEARCH);

    const start = Date.now();
    const agentRuns: Promise<any[]>[] = [this.vacancyAgent.run(criteria)];

    if (criteria.includeHiddenOpportunities && this.radarAgent) {
      agentRuns.push(this.radarAgent.run(criteria));
    }

    if (criteria.includeCompanyHunting && this.hunterAgent) {
      agentRuns.push(this.hunterAgent.run(criteria));
    }

    const results = await Promise.all(agentRuns);
    const opportunities = results.flat();

    return {
      searchId: crypto.randomUUID(),
      criteria,
      opportunityIds: opportunities.map((o) => o.id),
      creditsUsed: CREDIT_COST_PER_SEARCH,
      executedAt: new Date(),
      durationMs: Date.now() - start,
    };
  }

  async getSearchHistory(userId: string): Promise<SearchResult[]> {
    // TODO: haal zoekgeschiedenis op uit database
    return [];
  }
}
