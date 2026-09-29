'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getT } from '@/i18n/server';
import { getCurrentUser } from '@/lib/data/queries';
import { withinRateLimit } from '@/lib/rateLimit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { isDemoEmail } from '@/shared/constants/demoAccount';
import { text, type FormState } from './formState';

/**
 * Account verwijderen. De student bevestigt door zijn e-mailadres te typen. Daarna:
 * 1. lopende zoekopdrachten stoppen (n8n-resultaten voor deze runs worden daarna genegeerd)
 * 2. het cv uit de opslag verwijderen
 * 3. de gebruiker in Supabase Auth verwijderen: profiel, zoekprofielen, runs, matches, outreach en
 *    creditboekingen gaan mee (on delete cascade). Betalingen blijven bewaard zonder koppeling met
 *    de persoon (wettelijke bewaarplicht, zie migratie 20260929100000).
 */
export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = (await getT()).settings.danger;
  const user = await getCurrentUser();
  if (!user?.email) redirect('/login');

  if (isDemoEmail(user.email)) return { error: t.demoLocked };
  if (text(formData, 'confirmEmail', 320).toLowerCase() !== user.email.toLowerCase()) return { error: t.confirmMismatch };
  if (!(await withinRateLimit('accountChange', `user:${user.id}`))) return { error: t.failed };

  const admin = createAdminClient();
  try {
    const { error: runsError } = await admin
      .from('search_runs')
      .update({ status: 'failed', error_message: 'Account deleted.', finished_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .in('status', ['queued', 'running']);
    if (runsError) throw runsError;

    const { data: files, error: listError } = await admin.storage.from('cvs').list(user.id);
    if (listError) throw listError;
    if (files?.length) {
      const { error: removeError } = await admin.storage.from('cvs').remove(files.map((file) => `${user.id}/${file.name}`));
      if (removeError) throw removeError;
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('[account] deleting account failed', user.id, error);
    return { error: t.failed };
  }

  console.info('[account] account deleted', user.id);
  // Sessiecookies opruimen; de gebruiker bestaat niet meer, dus fouten hier zijn niet erg
  await (await createClient()).auth.signOut().catch(() => undefined);
  revalidatePath('/', 'layout');
  redirect('/account-deleted');
}
