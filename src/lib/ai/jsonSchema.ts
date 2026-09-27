import { z } from 'zod';

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

// Grenzen die zod standaard bij .int() zet; OpenAI heeft ze niet nodig
const SAFE_INT_BOUNDS = new Set([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);

function strictify(node: Json): Json {
  if (Array.isArray(node)) return node.map(strictify);
  if (!node || typeof node !== 'object') return node;

  const out: { [key: string]: Json } = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === '$schema') continue;
    if ((key === 'minimum' || key === 'maximum') && typeof value === 'number' && SAFE_INT_BOUNDS.has(value)) continue;
    out[key] = strictify(value);
  }
  // Strict mode: elk object sluit af en elke property is verplicht (optioneel = nullable in het zod-schema)
  if (out.type === 'object' && out.properties && typeof out.properties === 'object' && !Array.isArray(out.properties)) {
    out.additionalProperties = false;
    out.required = Object.keys(out.properties);
  }
  return out;
}

/** Zod-schema → JSON Schema dat OpenAI Structured Outputs (strict) accepteert. */
export function toStrictJsonSchema(schema: z.ZodType): Json {
  return strictify(z.toJSONSchema(schema, { io: 'output' }) as Json);
}
