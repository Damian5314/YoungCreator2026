import { BaseScraper } from './base/BaseScraper';
import { IMonitorableScraper } from './interfaces/IMonitorableScraper';
import { Opportunity } from '../shared/types/Opportunity';
import { SearchCriteria } from '../shared/types/SearchCriteria';

// Implementeert ook IMonitorableScraper voor de Autonomous Company Hunter feature
export class CompanyCareerPageScraper extends BaseScraper implements IMonitorableScraper {
  readonly sourceName = 'company-career-page';

  async scrape(criteria: SearchCriteria): Promise<Opportunity[]> {
    // TODO: scrape bekende bedrijfswebsites op basis van criteria
    return [];
  }

  async monitorCompany(companyWebsite: string): Promise<Opportunity[]> {
    // TODO: bezoek de career-pagina van dit specifieke bedrijf
    return [];
  }

  async hasCareerPageChanged(companyWebsite: string, lastCheckedAt: Date): Promise<boolean> {
    // TODO: vergelijk huidige pagina met opgeslagen snapshot
    return false;
  }

  protected async healthCheck(): Promise<void> {
    // Altijd beschikbaar, afhankelijk van individueel bedrijfswebsite
  }
}
