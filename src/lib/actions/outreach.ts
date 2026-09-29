'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, getProfile } from '@/lib/data/queries';
import { withinRateLimit } from '@/lib/rateLimit';
import { isDemoEmail } from '@/shared/constants/demoAccount';
import {
  createOutreachDraft,
  markOutreachSentManually,
  sendOutreach,
  type ActionResult,
} from '@/modules/outreach/outreachService';
import { text, type FormState } from './formState';

const uuid = z.uuid();

function refresh(matchId?: string) {
  revalidatePath('/outreach');
  revalidatePath('/dashboard');
  if (matchId) revalidatePath(`/matches/${matchId}`);
}

// "Write email": de agent schrijft (of herschrijft) een persoonlijk concept voor deze kans
export async function draftOutreach(matchId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Your session expired. Please log in again.' };
  if (!uuid.safeParse(matchId).success) return { ok: false, error: 'Opportunity not found.' };
  // Elk concept is een AI-aanroep: remt misbruik van de AI-kosten
  if (!(await withinRateLimit('outreachDraft', `user:${user.id}`))) {
    return { ok: false, error: 'You’ve written a lot of emails in a short time. Please wait a while and try again.' };
  }

  try {
    const draft = await createOutreachDraft(user.id, matchId, 'user');
    if (!draft) return { ok: false, error: 'Opportunity not found.' };
  } catch (error) {
    console.error('[outreach] drafting failed', error);
    return { ok: false, error: 'Writing the email failed. Please try again.' };
  }
  refresh(matchId);
  return { ok: true };
}

const draftForm = z.object({
  id: z.uuid(),
  matchId: z.uuid(),
  toEmail: z.union([z.literal(''), z.email('Enter a valid email address.')]),
  toName: z.string().max(200),
  subject: z.string().trim().min(1, 'Add a subject.').max(200),
  body: z.string().trim().min(1, 'The message can’t be empty.').max(5000),
});

// Aanpassingen van de student aan het concept opslaan (RLS: alleen eigen, alleen zolang niet verstuurd)
export async function saveOutreachDraft(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Your session expired. Please log in again.' };

  const parsed = draftForm.safeParse({
    id: text(formData, 'id'),
    matchId: text(formData, 'matchId'),
    toEmail: text(formData, 'toEmail', 320).toLowerCase(),
    toName: text(formData, 'toName', 200),
    subject: text(formData, 'subject', 200),
    body: text(formData, 'body', 5000),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the email fields.' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outreach_messages')
    .update({
      to_email: parsed.data.toEmail || null,
      to_name: parsed.data.toName || null,
      subject: parsed.data.subject,
      body: parsed.data.body,
    })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .select('id');
  if (error) {
    console.error('[outreach] saving draft failed', error);
    return { error: 'Saving the email failed. Please try again.' };
  }
  if (!data?.length) return { error: 'This email was already sent and can’t be changed anymore.' };

  refresh(parsed.data.matchId);
  return { message: 'Saved' };
}

// Niveau 2/3: het systeem verstuurt via n8n. Niveau 1: de student verstuurt zelf.
export async function sendOutreachNow(messageId: string, matchId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Your session expired. Please log in again.' };
  if (!uuid.safeParse(messageId).success || !uuid.safeParse(matchId).success) return { ok: false, error: 'Message not found.' };

  // Het demo-account is openbaar: nooit echte e-mails versturen
  if (isDemoEmail(user.email)) return { ok: false, error: 'The demo account can’t send real emails. Copy the draft instead.' };
  if (!(await withinRateLimit('outreachSend', `user:${user.id}`))) {
    return { ok: false, error: 'Too many emails in a short time. Please wait a while and try again.' };
  }

  const profile = await getProfile();
  if (!profile || profile.automationLevel < 2) {
    return { ok: false, error: 'Sending from Unlisted needs automation level 2 or 3 (Settings → Agent).' };
  }

  try {
    const result = await sendOutreach(user.id, messageId);
    refresh(matchId);
    return result;
  } catch (error) {
    console.error('[outreach] sending failed', error);
    refresh(matchId);
    return { ok: false, error: 'Sending failed. Please try again.' };
  }
}

// De student heeft de mail zelf verstuurd (mailprogramma / kopiëren)
export async function markOutreachSent(messageId: string, matchId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Your session expired. Please log in again.' };
  if (!uuid.safeParse(messageId).success || !uuid.safeParse(matchId).success) return { ok: false, error: 'Message not found.' };

  const result = await markOutreachSentManually(user.id, messageId);
  refresh(matchId);
  return result;
}
