import { NextRequest, NextResponse } from 'next/server';
import { SearchCriteria } from '../../../shared/types/SearchCriteria';

// POST /api/search — start een zoekopdracht (verbruikt 1 credit)
export async function POST(req: NextRequest) {
  const criteria: SearchCriteria = await req.json();
  // TODO: inject SearchService via dependency container en voer search uit
  return NextResponse.json({ message: 'Search gestart' }, { status: 202 });
}

// GET /api/search — haal zoekgeschiedenis op
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  // TODO: haal zoekgeschiedenis op via SearchService
  return NextResponse.json([]);
}
