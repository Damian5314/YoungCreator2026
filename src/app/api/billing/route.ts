import { NextRequest, NextResponse } from 'next/server';

// GET /api/billing — haal huidig credit-saldo op
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  // TODO: haal credits op via BillingService
  return NextResponse.json({ credits: 0 });
}

// POST /api/billing/checkout — start Stripe checkout sessie
export async function POST(req: NextRequest) {
  const { userId, tierId } = await req.json();
  // TODO: maak checkout sessie aan via BillingService
  return NextResponse.json({ url: '' });
}
