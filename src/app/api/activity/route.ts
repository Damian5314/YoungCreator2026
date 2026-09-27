import { NextResponse } from 'next/server';
import { getActivity, getCurrentUser } from '@/lib/data/queries';

// GET /api/activity — de laatste activiteit van je agent, voor de meldingenbel in de bovenbalk.
// Loopt via de sessie van de gebruiker (RLS): je ziet alleen je eigen activiteit.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await getActivity();
  return NextResponse.json({ items: items.slice(0, 8) }, { headers: { 'cache-control': 'no-store' } });
}
