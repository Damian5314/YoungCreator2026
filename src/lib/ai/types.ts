import type { z } from 'zod';

export interface StructuredRequest<Schema extends z.ZodType> {
  schema: Schema;
  system: string;
  prompt: string;
  effort?: 'low' | 'medium' | 'high';
}
