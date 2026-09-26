export type OpportunityType =
  | 'job'
  | 'internship'
  | 'traineeship'
  | 'thesis'
  | 'working-student'
  | 'open-application';

export type OpportunitySource = 'linkedin' | 'indeed' | 'company-career-page' | 'glassdoor' | 'radar';

export type OpportunityStatus = 'new' | 'reviewed' | 'applied' | 'rejected' | 'saved';
