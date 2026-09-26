import { UserProfile, CVData, SearchPreferences } from '../../../shared/types/UserProfile';

// ISP: lees- en schrijfoperaties gescheiden gehouden
export interface IProfileReader {
  getById(userId: string): Promise<UserProfile | null>;
  getByEmail(email: string): Promise<UserProfile | null>;
}

export interface IProfileWriter {
  create(data: Omit<UserProfile, 'id' | 'createdAt' | 'credits'>): Promise<UserProfile>;
  updateCV(userId: string, cv: CVData): Promise<void>;
  updatePreferences(userId: string, preferences: SearchPreferences): Promise<void>;
}

export interface IProfileService extends IProfileReader, IProfileWriter {}
