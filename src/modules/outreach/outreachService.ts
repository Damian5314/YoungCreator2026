import 'server-only';
import { z } from 'zod';
import { env, features } from '@/lib/env';
import { callN8nWebhook } from '@/lib/n8n';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasPaidAccess } from '@/modules/billing/entitlements';
import type { OpportunityType } from '@/shared/types/OpportunityType';
import { writeOutreachEmail } from './emailWriter';
import { isSuppressed, outreachFooter } from './unsubscribe';

export const AUTO_DRAFT_MIN_SCORE = 70; // de agent bereidt alleen mails voor bij sterke matches
const AUTO_DRAFTS_PER_RUN = 3;
const MANUAL_DAILY_SEND_CAP = 25; // ook bij handmatig goedkeuren geen massamail
const DAY_MS = 24 * 60 * 60 * 1000;

export type ActionResult = { ok: true } | { ok: false; error: string };

interface MatchRow {
  id: string;
  match_score: number;
  match_reasons: string[];
  opportunity: {
    title: string;
    type: OpportunityType;
    url: string;
    description: string | null;
    location: string | null;
    starts_at: string | null;
    signals: string[];
    contact_name: string | null;
    contact_email: string | null;
    contact_role: string | null;
    company: { name: string } | null;
  } | null;
}

async function loadMatch(userId: string, matchId: string): Promise<MatchRow | null> {
  const { data, error } = await createAdminClient()
    .from('matches')
    .select(
      `id, match_score, match_reasons,
       opportunity:opportunities (
         title, type, url, description, location, starts_at, signals,
         contact_name, contact_email, contact_role,
         company:companies ( name )
       )`,
    )
    .eq('id', matchId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as MatchRow | null;
}

async function loadStudent(userId: string) {
  const admin = createAdminClient();
  const [{ data: profile, error }, { data: auth }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', userId).single(),
    admin.auth.admin.getUserById(userId),
  ]);
  if (error) throw error;
  return { profile, email: auth.user?.email ?? null };
}

// Maakt (of vernieuwt) het concept voor één match. Verstuurde berichten blijven ongemoeid.
export async function createOutreachDraft(
  userId: string,
  matchId: string,
  createdBy: 'user' | 'agent',
): Promise<{ id: string } | null> {
  const admin = createAdminClient();
  const [match, student, { data: existing }] = await Promise.all([
    loadMatch(userId, matchId),
    loadStudent(userId),
    admin.from('outreach_messages').select('id, status, to_email, to_name').eq('match_id', matchId).maybeSingle(),
  ]);
  if (!match?.opportunity) return null;
  if (existing && (existing.status === 'sent' || existing.status === 'sending')) return { id: existing.id };

  const { opportunity } = match;
  const { profile } = student;
  const draft = await writeOutreachEmail({
    student: {
      name: profile.full_name,
      degree: profile.degree,
      fieldOfStudy: profile.field_of_study,
      university: profile.university,
      skills: profile.skills ?? [],
      interests: profile.interests ?? [],
      ambitions: profile.ambitions,
      linkedinUrl: profile.linkedin_url,
      portfolioUrl: profile.portfolio_url,
    },
    opportunity: {
      title: opportunity.title,
      type: opportunity.type,
      company: opportunity.company?.name ?? '',
      description: opportunity.description,
      location: opportunity.location,
      startsAt: opportunity.starts_at,
      signals: opportunity.signals ?? [],
      url: opportunity.url,
    },
    contact: { name: opportunity.contact_name, role: opportunity.contact_role },
    matchReasons: match.match_reasons ?? [],
  });

  const { data, error } = await admin
    .from('outreach_messages')
    .upsert(
      {
        user_id: userId,
        match_id: matchId,
        // Een adres dat de student zelf heeft ingevuld niet overschrijven
        to_email: existing?.to_email || opportunity.contact_email,
        to_name: existing?.to_name || opportunity.contact_name,
        subject: draft.subject,
        body: draft.body,
        status: 'draft',
        created_by: createdBy,
        error_message: null,
      },
      { onConflict: 'match_id' },
    )
    .select('id')
    .single();
  if (error) throw error;
  return { id: data.id };
}

async function markMatchContacted(matchId: string) {
  await createAdminClient()
    .from('matches')
    .update({ status: 'applied', status_changed_at: new Date().toISOString() })
    .eq('id', matchId);
}

// Verstuurt via de n8n-webhook. auto = door de agent (niveau 3), dan geldt de daglimiet van de gebruiker.
export async function sendOutreach(userId: string, messageId: string, { auto = false } = {}): Promise<ActionResult> {
  if (!features.canSendEmail || !env.n8nSendEmailWebhookUrl) {
    return { ok: false, error: 'Sending from Unlisted isn’t available right now. Copy the email or open it in your mail app instead.' };
  }
  if (!(await hasPaidAccess(userId))) {
    return { ok: false, error: 'Sending through Unlisted comes with any credit pack. Copy the email or open it in your mail app instead.' };
  }

  const admin = createAdminClient();
  const { data: message, error } = await admin
    .from('outreach_messages')
    .select('*')
    .eq('id', messageId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!message) return { ok: false, error: 'Message not found.' };
  if (message.status === 'sent') return { ok: true };
  if (message.status === 'sending') return { ok: false, error: 'This email is already being sent.' };
  if (!message.to_email || !z.email().safeParse(message.to_email).success) {
    return { ok: false, error: 'Add a valid email address for the recipient first.' };
  }
  if (!message.subject.trim() || !message.body.trim()) return { ok: false, error: 'Subject and message can’t be empty.' };
  // Ontvanger heeft zich afgemeld (of het adres bounced): nooit meer via Unlisted mailen
  if (await isSuppressed(message.to_email)) {
    return { ok: false, error: 'This address has asked not to receive emails via Unlisted. Contact them another way.' };
  }

  const student = await loadStudent(userId);
  const limit = auto ? student.profile.daily_send_limit : MANUAL_DAILY_SEND_CAP;
  const { count } = await admin
    .from('outreach_messages')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'sent')
    .eq('sent_via', 'n8n')
    .gte('sent_at', new Date(Date.now() - DAY_MS).toISOString());
  if ((count ?? 0) >= limit) return { ok: false, error: `Daily sending limit reached (${limit} per 24 hours).` };

  // Claimen: alleen één verzoek kan een concept op 'sending' zetten
  const { data: claimed } = await admin
    .from('outreach_messages')
    .update({ status: 'sending', error_message: null })
    .eq('id', messageId)
    .in('status', ['draft', 'failed'])
    .select('id');
  if (!claimed?.length) return { ok: false, error: 'This email is already being sent.' };

  try {
    await callN8nWebhook(env.n8nSendEmailWebhookUrl, {
      messageId,
      to: { email: message.to_email, name: message.to_name },
      subject: message.subject,
      // Afmeldlink alleen in de verstuurde mail; het opgeslagen concept blijft zoals de student het schreef
      body: `${message.body}${outreachFooter(message.to_email)}`,
      from: { name: student.profile.full_name },
      replyTo: student.email ? { email: student.email, name: student.profile.full_name } : null,
      sentBy: auto ? 'agent' : 'user',
    });
  } catch (sendError) {
    const reason = sendError instanceof Error ? sendError.message : 'Unknown error';
    await admin.from('outreach_messages').update({ status: 'failed', error_message: reason }).eq('id', messageId);
    // De technische reden staat in de database en de serverlog, niet in beeld
    console.error('[outreach] n8n send webhook failed for message', messageId, ':', reason);
    return { ok: false, error: 'Sending failed. Please try again.' };
  }

  await admin
    .from('outreach_messages')
    .update({ status: 'sent', sent_via: 'n8n', sent_at: new Date().toISOString(), error_message: null })
    .eq('id', messageId);
  await markMatchContacted(message.match_id);
  return { ok: true };
}

// De student heeft de mail zelf verstuurd (vanuit zijn eigen mailprogramma)
export async function markOutreachSentManually(userId: string, messageId: string): Promise<ActionResult> {
  const { data } = await createAdminClient()
    .from('outreach_messages')
    .update({ status: 'sent', sent_via: 'manual', sent_at: new Date().toISOString(), error_message: null })
    .eq('id', messageId)
    .eq('user_id', userId)
    .in('status', ['draft', 'failed'])
    .select('match_id');
  if (!data?.length) return { ok: false, error: 'Message not found or already sent.' };
  await markMatchContacted(data[0].match_id);
  return { ok: true };
}

// Action engine na een zoekrun: de beste nieuwe matches met een contactpersoon krijgen een concept.
// Niveau 3 (met toestemming) verstuurt ze ook, binnen de daglimiet.
export async function runAgentOutreach(userId: string, newMatchIds: string[]): Promise<void> {
  if (newMatchIds.length === 0) return;
  const admin = createAdminClient();

  const [{ data: profile }, { data: candidates }] = await Promise.all([
    admin.from('profiles').select('automation_level, auto_send_consent_at').eq('id', userId).single(),
    admin
      .from('matches')
      .select('id, match_score, opportunity:opportunities ( contact_email )')
      .in('id', newMatchIds)
      .gte('match_score', AUTO_DRAFT_MIN_SCORE)
      .order('match_score', { ascending: false }),
  ]);

  const withContact = ((candidates ?? []) as unknown as { id: string; opportunity: { contact_email: string | null } | null }[])
    .filter((match) => match.opportunity?.contact_email)
    .slice(0, AUTO_DRAFTS_PER_RUN);

  const drafts: string[] = [];
  for (const match of withContact) {
    try {
      const draft = await createOutreachDraft(userId, match.id, 'agent');
      if (draft) drafts.push(draft.id);
    } catch (error) {
      console.error('[outreach] auto-draft failed', error);
    }
  }

  const autoSend = profile?.automation_level === 3 && profile.auto_send_consent_at && features.canSendEmail;
  if (!autoSend) return;
  for (const draftId of drafts) {
    const result = await sendOutreach(userId, draftId, { auto: true });
    if (!result.ok) {
      console.warn('[outreach] auto-send stopped:', result.error);
      break;
    }
  }
}
