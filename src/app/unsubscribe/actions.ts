'use server';

import { redirect } from 'next/navigation';
import { isValidUnsubscribeToken, suppressEmail } from '@/modules/outreach/unsubscribe';

// Bevestigd met een knop (POST), zodat linkscanners van mailservers niemand per ongeluk afmelden
export async function confirmUnsubscribe(formData: FormData) {
  const email = String(formData.get('e') ?? '').trim().toLowerCase().slice(0, 320);
  const token = String(formData.get('t') ?? '').slice(0, 200);
  if (!email || !isValidUnsubscribeToken(email, token)) redirect('/unsubscribe');

  await suppressEmail(email, 'unsubscribe');
  console.info('[outreach] address unsubscribed');
  redirect('/unsubscribe?done=1');
}
