import { NextResponse, type NextRequest } from 'next/server';
import { features } from '@/lib/env';
import { MollieError } from '@/lib/mollie';
import { syncMolliePayment } from '@/modules/billing/billingService';

// POST /api/mollie/webhook — Mollie meldt dat de status van een betaling is veranderd.
// Het verzoek bevat alleen "id=tr_…" en is niet ondertekend: we vertrouwen de inhoud dus niet,
// maar halen de betaling zelf op bij Mollie (fetch-to-confirm). Vaker ontvangen is veilig.
export async function POST(request: NextRequest) {
  if (!features.payments) return new NextResponse(null, { status: 404 });

  const form = await request.formData().catch(() => null);
  const id = String(form?.get('id') ?? '');
  // Onbekende of ongeldige id: 200, zodat we niets prijsgeven over welke betalingen bestaan
  if (!/^tr_\w+$/.test(id)) return new NextResponse(null, { status: 200 });

  try {
    await syncMolliePayment(id);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    // Betaling bestaat niet (meer) bij Mollie of hoort bij een andere key: niet opnieuw proberen
    if (error instanceof MollieError && (error.status === 404 || error.status === 410)) {
      return new NextResponse(null, { status: 200 });
    }
    // Tijdelijke fout (Mollie of database onbereikbaar): 500, dan probeert Mollie het later opnieuw
    console.error('[mollie] webhook processing failed:', error instanceof Error ? error.message : error);
    return new NextResponse(null, { status: 500 });
  }
}
