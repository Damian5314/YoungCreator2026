import { IRadarAgent } from './interfaces/IOpportunityAgent';
import { CompanySignal } from '../shared/types/Opportunity';
import { UserProfile } from '../shared/types/UserProfile';

// Feature 1: Hidden Opportunity Radar
// Vindt bedrijven die GEEN vacature hebben geplaatst maar waarschijnlijk
// iemand zoals jij nodig hebben op basis van groeisignalen
export class OpportunityRadarAgent implements IRadarAgent {
  readonly agentName = 'opportunity-radar';

  async run(profile: UserProfile): Promise<CompanySignal[]> {
    // TODO: zoek via nieuws, LinkedIn, GitHub, etc. naar bedrijven met groeisignalen
    // die matchen met het profiel van de gebruiker
    return [];
  }

  async evaluateCompany(companyWebsite: string, profile: UserProfile): Promise<CompanySignal> {
    // TODO: analyseer een specifiek bedrijf op signalen:
    // - Recent aangenomen mensen in aangrenzende rollen
    // - Nieuwe producten / projecten / funding
    // - Tech stack match met CV
    return {
      companyName: '',
      website: companyWebsite,
      signals: {
        recentHiring: false,
        growthIndicators: [],
        newProjects: [],
        techStack: [],
        adjacentRoles: [],
      },
      radarScore: 0,
    };
  }
}
