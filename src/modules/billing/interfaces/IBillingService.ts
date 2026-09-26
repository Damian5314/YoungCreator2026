export interface IBillingService {
  getCredits(userId: string): Promise<number>;
  deductCredits(userId: string, amount: number): Promise<void>;
  addCredits(userId: string, amount: number): Promise<void>;
  hasEnoughCredits(userId: string, required: number): Promise<boolean>;
  createCheckoutSession(userId: string, tierId: string): Promise<{ url: string }>;
}
