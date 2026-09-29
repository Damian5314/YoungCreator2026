'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getT } from '@/i18n/server';
import { env } from '@/lib/env';
import { clientIp, withinRateLimit } from '@/lib/rateLimit';
import { requestOrigin } from '@/lib/requestOrigin';
import { createClient } from '@/lib/supabase/server';
import { ensureDemoAccount, isDemoLogin, topUpDemoCredits } from '@/modules/auth/demoAccount';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/shared/constants/auth';
import { isDemoEmail } from '@/shared/constants/demoAccount';
import { text, type FormState } from './formState';

// Links in e-mails (bevestigen, wachtwoord resetten) wijzen altijd naar de vaste productie-URL als die
// bekend is, niet naar een Origin-header uit het verzoek.
async function siteUrl() {
  return env.appUrl ?? (await requestOrigin());
}

const email = z.email().max(320);
const password = z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH);

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = (await getT()).auth.errors;
  const address = text(formData, 'email', 320).toLowerCase();
  const secret = String(formData.get('password') ?? '').slice(0, PASSWORD_MAX_LENGTH);
  if (!email.safeParse(address).success || !secret) return { error: t.invalidCredentials };

  // Per IP én per account: remt brute force op één account en op veel accounts tegelijk
  const ip = await clientIp();
  if (!(await withinRateLimit('login', `ip:${ip}`)) || !(await withinRateLimit('login', `email:${address}`))) {
    return { error: t.rateLimited };
  }

  const demo = isDemoLogin(address, secret);
  const supabase = await createClient();
  let result = await supabase.auth.signInWithPassword({ email: address, password: secret });

  // Demo-account: bij een fout eerst terugzetten en opnieuw proberen, zodat de live demo altijd inlogt
  if (result.error && demo) {
    try {
      await ensureDemoAccount();
      result = await supabase.auth.signInWithPassword({ email: address, password: secret });
    } catch (error) {
      console.error('[demo] restoring the demo account failed', error);
    }
  }
  if (result.error) {
    // Eén melding voor "onbekend adres" en "fout wachtwoord": verraadt niet welke accounts bestaan
    if (result.error.code === 'email_not_confirmed') return { error: t.emailNotConfirmed };
    if (result.error.status === 429) return { error: t.rateLimited };
    return { error: t.invalidCredentials };
  }

  if (demo) {
    await topUpDemoCredits(result.data.user.id).catch((error) => console.error('[demo] topping up credits failed', error));
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const dict = await getT();
  const t = dict.auth.errors;
  const address = text(formData, 'email', 320).toLowerCase();
  const secret = String(formData.get('password') ?? '');
  if (!email.safeParse(address).success) return { error: t.invalidEmail };
  if (!password.safeParse(secret).success) return { error: t.weakPassword };

  if (!(await withinRateLimit('register', `ip:${await clientIp()}`))) return { error: t.rateLimited };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: address,
    password: secret,
    options: {
      data: { full_name: text(formData, 'name', 200) }, // de signup-trigger zet dit in profiles.full_name
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=/search/preferences`,
    },
  });
  if (error) {
    if (error.code === 'weak_password') return { error: t.weakPassword };
    if (error.status === 429) return { error: t.rateLimited };
    // Bestaand adres (alleen zichtbaar als e-mailbevestiging uit staat) en andere fouten: neutrale melding
    console.warn('[auth] sign-up failed', error.code ?? error.message);
    return { error: t.signupFailed };
  }

  // Staat "Confirm email" aan in Supabase, dan is er pas een sessie na het klikken op de link
  if (!data.session) return { message: dict.auth.messages.confirmSignup };

  revalidatePath('/', 'layout');
  redirect('/search/preferences');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// Wachtwoord vergeten: altijd dezelfde bevestiging, of het adres nu bestaat of niet
export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const dict = await getT();
  const address = text(formData, 'email', 320).toLowerCase();
  if (!email.safeParse(address).success) return { error: dict.auth.errors.invalidEmail };

  const allowed =
    (await withinRateLimit('passwordReset', `ip:${await clientIp()}`)) &&
    (await withinRateLimit('passwordReset', `email:${address}`));
  if (!allowed) return { error: dict.auth.errors.rateLimited };

  // Het demo-account is openbaar: zijn wachtwoord mag niemand overnemen
  if (!isDemoEmail(address)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(address, {
      redirectTo: `${await siteUrl()}/auth/callback?next=/reset-password`,
    });
    if (error) console.warn('[auth] password reset request failed', error.code ?? error.message);
  }

  return { message: dict.auth.reset.sent };
}

// Nieuw wachtwoord kiezen na de link uit de mail (de callback heeft er al een sessie van gemaakt)
export async function completePasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const dict = await getT();
  const secret = String(formData.get('password') ?? '');
  if (!password.safeParse(secret).success) return { error: dict.auth.errors.weakPassword };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: dict.auth.reset.expiredBody };
  if (isDemoEmail(userData.user.email)) return { error: dict.auth.errors.demoLocked };

  const { error } = await supabase.auth.updateUser({ password: secret });
  if (error) {
    if (error.code === 'weak_password') return { error: dict.auth.errors.weakPassword };
    if (error.code === 'same_password') return { error: dict.auth.errors.samePassword };
    console.error('[auth] completing password reset failed', error.code ?? error.message);
    return { error: dict.auth.errors.generic };
  }

  // Andere apparaten uitloggen: wie het oude wachtwoord kende, is er nu uit
  await supabase.auth.signOut({ scope: 'others' });
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function updateEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const dict = await getT();
  const address = text(formData, 'email', 320).toLowerCase();
  if (!email.safeParse(address).success) return { error: dict.auth.errors.invalidEmail };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: dict.auth.errors.sessionExpired };
  if (isDemoEmail(userData.user.email)) return { error: dict.auth.errors.demoLocked };
  if (!(await withinRateLimit('accountChange', `user:${userData.user.id}`))) return { error: dict.auth.errors.rateLimited };

  const { error } = await supabase.auth.updateUser(
    { email: address },
    { emailRedirectTo: `${await siteUrl()}/auth/callback?next=/settings` },
  );
  if (error) {
    console.warn('[auth] email change failed', error.code ?? error.message);
    return { error: error.status === 429 ? dict.auth.errors.rateLimited : dict.auth.errors.emailChangeFailed };
  }
  return { message: dict.auth.messages.confirmNewEmail };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const dict = await getT();
  const secret = String(formData.get('password') ?? '');
  if (!password.safeParse(secret).success) return { error: dict.auth.errors.weakPassword };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: dict.auth.errors.sessionExpired };
  if (isDemoEmail(userData.user.email)) return { error: dict.auth.errors.demoLocked };
  if (!(await withinRateLimit('accountChange', `user:${userData.user.id}`))) return { error: dict.auth.errors.rateLimited };

  const { error } = await supabase.auth.updateUser({ password: secret });
  if (error) {
    if (error.code === 'weak_password') return { error: dict.auth.errors.weakPassword };
    if (error.code === 'same_password') return { error: dict.auth.errors.samePassword };
    if (error.code === 'reauthentication_needed') return { error: dict.auth.errors.reauthenticate };
    console.error('[auth] password change failed', error.code ?? error.message);
    return { error: dict.auth.errors.generic };
  }

  // Andere sessies beëindigen na een wachtwoordwijziging
  await supabase.auth.signOut({ scope: 'others' });
  return { message: dict.auth.messages.passwordUpdated };
}
