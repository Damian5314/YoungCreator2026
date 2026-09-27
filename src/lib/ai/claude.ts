import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { z } from 'zod';
import { env } from '@/lib/env';
import type { StructuredRequest } from './types';

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!env.anthropicApiKey) return null;
  client ??= new Anthropic({ apiKey: env.anthropicApiKey, timeout: 90_000, maxRetries: 2 });
  return client;
}

// Server-side fallback (bij een weigering draait dezelfde vraag op een ander model) bestaat voor deze families
const supportsFallbacks = (model: string) => /^claude-(opus-5|fable-5)/.test(model);

// Eén Claude-aanroep met gegarandeerd JSON-antwoord volgens het zod-schema.
// Geeft null terug als er geen API-key is of de aanroep mislukt: de aanroeper valt dan terug op regels.
export async function generateStructuredClaude<Schema extends z.ZodType>({
  schema,
  system,
  prompt,
  effort = 'low',
}: StructuredRequest<Schema>): Promise<z.infer<Schema> | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const model = env.anthropicModel;
  try {
    const response = await anthropic.beta.messages.parse({
      model,
      max_tokens: 16000,
      ...(supportsFallbacks(model) ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
      system,
      messages: [{ role: 'user', content: prompt }],
      output_config: { effort, format: betaZodOutputFormat(schema) },
    });

    if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') {
      console.warn(`[ai] Claude stopped with "${response.stop_reason}", falling back to rules`);
      return null;
    }
    return (response.parsed_output as z.infer<Schema> | null) ?? null;
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      console.error('[ai] Rate limited by the Claude API, falling back to rules');
    } else if (error instanceof Anthropic.AuthenticationError) {
      console.error('[ai] ANTHROPIC_API_KEY is invalid');
    } else if (error instanceof Anthropic.APIError) {
      console.error(`[ai] Claude API error ${error.status}: ${error.message}`);
    } else {
      console.error('[ai] Claude call failed', error);
    }
    return null;
  }
}
