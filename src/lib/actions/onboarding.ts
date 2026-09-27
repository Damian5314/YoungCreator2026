'use server';

import { refresh, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/data/queries';

// Introductie afgerond of overgeslagen: niet meer automatisch tonen
export async function completeIntro(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', user.id)
    .is('onboarded_at', null);
  // Niet fataal: in het ergste geval ziet de gebruiker de introductie de volgende keer nog eens
  if (error) {
    console.error('[onboarding] could not save intro state', error.message);
    return;
  }
  // Layout opnieuw renderen zodat de (gesloten) dialoog verdwijnt; "opnieuw bekijken" mount hem dan vers
  refresh();
}

// Vanuit Instellingen: introductie opnieuw bekijken (handig voor een demo)
export async function replayIntro(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  await supabase.from('profiles').update({ onboarded_at: null }).eq('id', user.id);

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
