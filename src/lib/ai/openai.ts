import 'server-only';
import type { z } from 'zod';
import { env } from '@/lib/env';
import { toStrictJsonSchema } from './jsonSchema';
import type { StructuredRequest } from './types';

// Redeneermodellen (gpt-5*, o*) kennen reasoning_effort; oudere modellen weigeren die parameter
const isReasoningModel = (model: string) => /^(gpt-5|o\d)/.test(model);

interface ChatCompletion {
  choices?: { finish_reason?: string; message?: { content?: string | null; refusal?: string | null } }[];
  error?: { message?: string };
}

// Eén OpenAI-aanroep (Chat Completions + Structured Outputs) via fetch, zonder extra dependency.
// Geeft null terug bij een fout of weigering: de aanroeper valt dan terug op regels.
export async function generateStructuredOpenAI<Schema extends z.ZodType>({
  schema,
  system,
  prompt,
  effort = 'low',
}: StructuredRequest<Schema>): Promise<z.infer<Schema> | null> {
  if (!env.openaiApiKey) return null;
  const model = env.openaiModel;

  try {
    const response = await fetch(`${env.openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${env.openaiApiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'result', strict: true, schema: toStrictJsonSchema(schema) },
        },
        ...(isReasoningModel(model) ? { reasoning_effort: effort } : {}),
      }),
      signal: AbortSignal.timeout(90_000),
      cache: 'no-store',
    });

    const data = (await response.json().catch(() => ({}))) as ChatCompletion;
    if (!response.ok) {
      console.error(`[ai] OpenAI API error ${response.status}: ${data.error?.message ?? 'unknown error'}`);
      return null;
    }

    const choice = data.choices?.[0];
    if (!choice?.message?.content || choice.message.refusal || choice.finish_reason === 'length') {
      console.warn(`[ai] OpenAI gave no usable answer (${choice?.finish_reason ?? 'empty'}), falling back to rules`);
      return null;
    }

    const parsed = schema.safeParse(JSON.parse(choice.message.content));
    if (!parsed.success) {
      console.warn('[ai] OpenAI answer did not match the schema, falling back to rules');
      return null;
    }
    return parsed.data as z.infer<Schema>;
  } catch (error) {
    console.error('[ai] OpenAI call failed', error);
    return null;
  }
}
