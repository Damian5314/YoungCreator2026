import { NextRequest, NextResponse } from 'next/server';

// GET /api/opportunities — haal gevonden kansen op voor een gebruiker
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  // TODO: haal opportunities op via OpportunityService
  return NextResponse.json([]);
}

// PATCH /api/opportunities — update status (saved, applied, rejected)
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  // TODO: update status via OpportunityService
  return NextResponse.json({ success: true });
}
