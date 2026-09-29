'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/data/queries';
import { getT } from '@/i18n/server';
import { OPPORTUNITY_STATUSES } from '@/shared/types/OpportunityType';

const input = z.object({ matchId: z.uuid(), status: z.enum(OPPORTUNITY_STATUSES) });

// Opslaan, "niet interessant", bekeken, ... (RLS: alleen je eigen matches, alleen de status-kolommen)
export async function setMatchStatus(matchId: string, status: string): Promise<{ error?: string }> {
  const t = await getT();
  const user = await getCurrentUser();
  if (!user) return { error: t.matches.errors.sessionExpired };

  const parsed = input.safeParse({ matchId, status });
  if (!parsed.success) return { error: t.matches.errors.invalidStatus };

  const supabase = await createClient();
  const { error } = await supabase
    .from('matches')
    .update({ status: parsed.data.status, status_changed_at: new Date().toISOString() })
    .eq('id', parsed.data.matchId)
    .eq('user_id', user.id);
  if (error) {
    console.error('[matches] status update failed', error);
    return { error: t.matches.errors.invalidStatus };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/matches/${parsed.data.matchId}`);
  return {};
}
