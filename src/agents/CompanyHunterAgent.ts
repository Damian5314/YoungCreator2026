import { IOpportunityAgent } from './interfaces/IOpportunityAgent';
import { IMonitorableScraper } from '../scrapers/interfaces/IMonitorableScraper';
import { Opportunity } from '../shared/types/Opportunity';
import { SearchCriteria } from '../shared/types/SearchCriteria';
import { UserProfile } from '../shared/types/UserProfile';

// Feature 3: Autonomous Company Hunter
// Ontdekt continu nieuwe bedrijven, bezoekt career pages,
// signaleert wanneer er iets verandert dat het waard is om op te reageren
export class CompanyHunterAgent implements IOpportunityAgent {
  readonly agentName = 'company-hunter';

  // D: afhankelijk van IMonitorableScraper abstractie
  constructor(private readonly monitorableScraper: IMonitorableScraper) {}

  async run(criteria: SearchCriteria): Promise<Opportunity[]> {
    // TODO:
    // 1. Haal lijst van te monitoren bedrijven op uit de database
    // 2. Controleer voor elk bedrijf of de career page veranderd is
    // 3. Scrape alleen de pagina's die veranderd zijn
    // 4. Evalueer of de nieuwe vacature/kans de moeite waard is
    return [];
  }

  async scoreOpportunity(opportunity: Opportunity, profile: UserProfile): Promise<number> {
    // TODO: scoor hoe goed een gevonden kans past bij het profiel
    return 0;
  }

  async discoverNewCompanies(profile: UserProfile): Promise<string[]> {
    // TODO: vindt nieuwe bedrijven om te monitoren op basis van profiel
    // Via: LinkedIn company search, Crunchbase, nieuwsartikelen, etc.
    return [];
  }
}
