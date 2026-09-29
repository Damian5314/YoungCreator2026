'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getT } from '@/i18n/server';
import { getCurrentUser } from '@/lib/data/queries';
import { withinRateLimit } from '@/lib/rateLimit';
import { requestOrigin } from '@/lib/requestOrigin';
import { startCheckout } from '@/modules/billing/billingService';
import { PACK_IDS } from '@/modules/billing/plans';
import { isDemoEmail } from '@/shared/constants/demoAccount';
import type { FormState } from './formState';

// waiver: uitdrukkelijk akkoord met directe levering + erkenning dat het herroepingsrecht dan vervalt
const buyInput = z.object({ packId: z.enum(PACK_IDS), waiver: z.literal('on') });

// "Buy" op een creditpakket → betaling aanmaken → door naar de Mollie-checkout
export async function buyCredits(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const parsed = buyInput.safeParse({ packId: formData.get('packId'), waiver: formData.get('waiver') });
  if (!parsed.success) {
    const t = (await getT()).billing.grid;
    return { error: formData.get('waiver') === 'on' ? t.pickPack : t.waiverRequired };
  }
  // Demo-account: krijgt automatisch credits en mag nooit echt betalen
  if (isDemoEmail(user.email)) return { error: 'The demo account can’t buy credits. It’s topped up automatically when you log in.' };
  if (!(await withinRateLimit('checkout', `user:${user.id}`))) return { error: 'Too many payment attempts. Please wait a while and try again.' };

  let result;
  try {
    result = await startCheckout(user.id, parsed.data.packId, await requestOrigin());
  } catch (error) {
    console.error('[billing] starting checkout failed', error);
    return { error: 'Something went wrong while starting the payment. Please try again.' };
  }
  if (!result.ok) return { error: result.error };

  redirect(result.checkoutUrl);
}
