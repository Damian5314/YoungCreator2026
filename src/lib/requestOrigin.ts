import 'server-only';
import { headers } from 'next/headers';

// Basis-URL van de app zoals de browser hem ziet (voor callbacks van n8n en Mollie als APP_URL ontbreekt)
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get('origin');
  if (origin) return origin;
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const protocol = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}
