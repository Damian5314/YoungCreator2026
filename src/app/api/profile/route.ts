import { NextRequest, NextResponse } from 'next/server';

// GET /api/profile — haal gebruikersprofiel op
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  // TODO: haal profiel op via ProfileService
  return NextResponse.json(null);
}

// POST /api/profile — maak nieuw profiel aan
export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: maak profiel aan via ProfileService
  return NextResponse.json({ success: true }, { status: 201 });
}

// PATCH /api/profile/cv — verwerk CV upload
export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('cv') as File;
  // TODO: parse CV via CVParser en sla op via ProfileService
  return NextResponse.json({ success: true });
}
