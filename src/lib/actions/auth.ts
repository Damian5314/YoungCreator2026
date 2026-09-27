'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getT } from '@/i18n/server';
import { createClient } from '@/lib/supabase/server';
import { ensureDemoAccount, isDemoLogin, topUpDemoCredits } from '@/modules/auth/demoAccount';
import { text, type FormState } from './formState';

async function origin() {
  return (await headers()).get('origin') ?? '';
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, 'email');
  const password = String(formData.get('password') ?? '');
  const demo = isDemoLogin(email, password);

  const supabase = await createClient();
  let result = await supabase.auth.signInWithPassword({ email, password });

  // Demo-account: bij een fout eerst terugzetten en opnieuw proberen, zodat de live demo altijd inlogt
  if (result.error && demo) {
    try {
      await ensureDemoAccount();
      result = await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error('[demo] restoring the demo account failed', error);
    }
  }
  if (result.error) return { error: result.error.message };

  if (demo) {
    await topUpDemoCredits(result.data.user.id).catch((error) => console.error('[demo] topping up credits failed', error));
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: text(formData, 'email'),
    password: String(formData.get('password') ?? ''),
    options: {
      data: { full_name: text(formData, 'name') }, // de signup-trigger zet dit in profiles.full_name
      emailRedirectTo: `${await origin()}/auth/callback?next=/search/preferences`,
    },
  });
  if (error) return { error: error.message };

  // Staat "Confirm email" aan in Supabase, dan is er pas een sessie na het klikken op de link
  if (!data.session) return { message: (await getT()).auth.messages.confirmSignup };

  revalidatePath('/', 'layout');
  redirect('/search/preferences');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function updateEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser(
    { email: text(formData, 'email') },
    { emailRedirectTo: `${await origin()}/auth/callback?next=/settings` },
  );
  if (error) return { error: error.message };
  return { message: (await getT()).auth.messages.confirmNewEmail };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: String(formData.get('password') ?? '') });
  if (error) return { error: error.message };
  return { message: (await getT()).auth.messages.passwordUpdated };
}
