'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/data/queries';
import { requestOrigin } from '@/lib/requestOrigin';
import { startCheckout } from '@/modules/billing/billingService';
import { PACK_IDS } from '@/modules/billing/plans';
import type { FormState } from './formState';

const buyInput = z.object({ packId: z.enum(PACK_IDS) });

// "Buy" op een creditpakket → betaling aanmaken → door naar de Mollie-checkout
export async function buyCredits(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const parsed = buyInput.safeParse({ packId: formData.get('packId') });
  if (!parsed.success) return { error: 'Pick a credit pack.' };

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
