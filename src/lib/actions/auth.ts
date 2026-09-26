'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { text, type FormState } from './formState';

async function origin() {
  return (await headers()).get('origin') ?? '';
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: text(formData, 'email'),
    password: String(formData.get('password') ?? ''),
  });
  if (error) return { error: error.message };

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
  if (!data.session) return { message: 'Check your inbox and click the link to confirm your account.' };

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
  return { message: 'Check your inbox to confirm the new address' };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: String(formData.get('password') ?? '') });
  if (error) return { error: error.message };
  return { message: 'Password updated' };
}
