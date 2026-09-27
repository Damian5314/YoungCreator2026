import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, getMatches, getRun } from '@/lib/data/queries';

// GET /api/search/runs/:id — voortgang van een run, plus de resultaten zodra hij klaar is.
// Loopt via de sessie van de gebruiker (RLS): je ziet alleen je eigen runs.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const run = await getRun(id);
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const results = run.status === 'completed' ? await getMatches({ searchRunId: id }) : [];
  return NextResponse.json({ run, results }, { headers: { 'cache-control': 'no-store' } });
}
