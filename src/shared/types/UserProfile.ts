import { OpportunityType } from './OpportunityType';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nationality: string;
  visaDeadline: Date; // datum waarop verblijfsvergunning verloopt
  cv: CVData;
  preferences: SearchPreferences;
  credits: number;
  createdAt: Date;
}

export interface CVData {
  rawText: string;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: string[];
  interests: string[];
  summary: string;
}

export interface SearchPreferences {
  desiredRoles: string[];
  opportunityTypes: OpportunityType[];
  locations: string[];
  remoteOnly: boolean;
  industries: string[];
  minSalary?: number;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  from: Date;
  to?: Date;
  description: string;
}
