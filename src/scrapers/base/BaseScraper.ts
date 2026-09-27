import { IScraper } from '../interfaces/IScraper';
import { Opportunity } from '../../shared/types/Opportunity';
import { SearchCriteria } from '../../shared/types/SearchCriteria';

// OCP: subklassen extenden gedrag, BaseScraper zelf wijzigt nooit
export abstract class BaseScraper implements IScraper {
  abstract readonly sourceName: string;

  abstract scrape(criteria: SearchCriteria): Promise<Opportunity[]>;

  async isAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }

  protected abstract healthCheck(): Promise<void>;

  protected normalizeOpportunity(raw: Partial<Opportunity>, userId: string): Opportunity {
    return {
      id: crypto.randomUUID(),
      title: raw.title ?? '',
      company: raw.company ?? '',
      companyWebsite: raw.companyWebsite,
      location: raw.location ?? '',
      remote: raw.remote ?? false,
      type: raw.type ?? 'job',
      source: raw.source ?? 'linkedin',
      sourceUrl: raw.sourceUrl ?? '',
      description: raw.description ?? '',
      requiredSkills: raw.requiredSkills ?? [],
      matchScore: 0,
      matchReasons: [],
      signals: [],
      isHidden: false,
      status: 'new',
      postedAt: raw.postedAt,
      discoveredAt: new Date(),
      userId,
    };
  }
}
