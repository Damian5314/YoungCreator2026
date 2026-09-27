import 'server-only';
import type { z } from 'zod';
import { env } from '@/lib/env';
import { generateStructuredClaude } from './claude';
import { generateStructuredOpenAI } from './openai';
import type { StructuredRequest } from './types';

// Eén AI-aanroep met een gegarandeerd JSON-antwoord volgens het zod-schema, via OpenAI of Claude
// (zie env.aiProvider). null = geen key of mislukt: de aanroeper valt dan terug op regels.
export async function generateStructured<Schema extends z.ZodType>(
  request: StructuredRequest<Schema>,
): Promise<z.infer<Schema> | null> {
  if (env.aiProvider === 'openai') return generateStructuredOpenAI(request);
  if (env.aiProvider === 'anthropic') return generateStructuredClaude(request);
  return null;
}
