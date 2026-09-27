import 'server-only';
import { timingSafeEqual } from 'node:crypto';
import { env } from '@/lib/env';

// Header waarmee de app zich bij n8n meldt (in n8n: Webhook → Authentication → Header Auth)
export const N8N_SECRET_HEADER = 'x-jobhunter-secret';

export class N8nError extends Error {}

// POST naar een n8n-webhook. Geeft de JSON-respons terug (of null als die leeg is).
export async function callN8nWebhook(url: string, body: unknown, timeoutMs = 20_000): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(env.n8nSecret ? { [N8N_SECRET_HEADER]: env.n8nSecret } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).slice(0, 300);
    throw new N8nError(`n8n responded with ${response.status}${detail ? `: ${detail}` : ''}`);
  }

  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Controleert "Authorization: Bearer <N8N_SECRET>" op verzoeken van n8n naar de app
export function isAuthorizedN8nRequest(request: Request): boolean {
  if (!env.n8nSecret) return false;
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  const expected = Buffer.from(env.n8nSecret);
  const received = Buffer.from(token);
  return received.length === expected.length && timingSafeEqual(received, expected);
}
