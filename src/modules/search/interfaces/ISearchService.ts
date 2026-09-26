import { SearchCriteria, SearchResult } from '../../../shared/types/SearchCriteria';

export interface ISearchService {
  executeSearch(criteria: SearchCriteria): Promise<SearchResult>;
  getSearchHistory(userId: string): Promise<SearchResult[]>;
}
