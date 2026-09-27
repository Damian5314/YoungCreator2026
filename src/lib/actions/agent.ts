'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, getProfile } from '@/lib/data/queries';
import { text, type FormState } from './formState';

const optionalUrl = z.union([z.literal(''), z.url({ protocol: /^https?$/, error: 'Enter a full link, starting with https://' })]);

const agentSettings = z
  .object({
    automationLevel: z.coerce.number().int().min(1).max(3),
    autoSendConsent: z.boolean(),
    dailySendLimit: z.coerce.number().int().min(0).max(20),
    linkedinUrl: optionalUrl,
    portfolioUrl: optionalUrl,
  })
  .refine((settings) => settings.automationLevel < 3 || settings.autoSendConsent, {
    message: 'Give permission to send emails on your behalf to use full automation.',
  });

// Hoe zelfstandig de agent mag werken (niveau 1-3) + links voor onder de e-mails
export async function saveAgentSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Your session expired. Please log in again.' };

  const parsed = agentSettings.safeParse({
    automationLevel: text(formData, 'automationLevel'),
    autoSendConsent: text(formData, 'autoSendConsent') === 'on',
    dailySendLimit: text(formData, 'dailySendLimit') || '3',
    linkedinUrl: text(formData, 'linkedinUrl', 300),
    portfolioUrl: text(formData, 'portfolioUrl', 300),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your settings.' };

  const current = await getProfile();
  const level = parsed.data.automationLevel;
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({
      automation_level: level,
      // Toestemming houdt het oorspronkelijke moment vast; lager niveau = toestemming ingetrokken
      auto_send_consent_at: level === 3 ? (current?.autoSendConsentAt ?? new Date().toISOString()) : null,
      daily_send_limit: parsed.data.dailySendLimit,
      linkedin_url: parsed.data.linkedinUrl || null,
      portfolio_url: parsed.data.portfolioUrl || null,
    })
    .eq('id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/settings');
  return { message: 'Saved' };
}
