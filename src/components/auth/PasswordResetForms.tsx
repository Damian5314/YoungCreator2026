'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FormMessage } from '@/components/ui/FormMessage';
import { useT } from '@/i18n/I18nProvider';
import { completePasswordReset, requestPasswordReset } from '@/lib/actions/auth';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/shared/constants/auth';
import { AuthField, authCardClasses, authLinkClasses, authSubmitClasses, inputClasses, PasswordInput } from './AuthForm';

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h1 className="text-[28px] font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-[32px]">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
    </>
  );
}

function BackToLogin() {
  const r = useT().auth.reset;
  return (
    <p className="mt-6 text-center text-sm">
      <Link href="/login" className={`inline-flex items-center gap-1.5 ${authLinkClasses}`}>
        <ArrowLeft className="size-4" aria-hidden />
        {r.backToLogin}
      </Link>
    </p>
  );
}

// Stap 1: e-mailadres invullen → link per mail (zelfde melding of het adres bestaat of niet)
export function ForgotPasswordForm({ expired }: { expired: boolean }) {
  const t = useT();
  const r = t.auth.reset;
  const { state, pending, submit } = useFormAction(requestPasswordReset);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  return (
    <div className={authCardClasses}>
      <Heading title={expired ? r.expiredTitle : r.title} subtitle={expired ? r.expiredBody : r.subtitle} />
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthField label={t.auth.form.emailLabel} htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t.auth.form.emailPlaceholder}
            required
            className={inputClasses}
          />
        </AuthField>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} aria-busy={pending || undefined} className={authSubmitClasses}>
          {pending ? t.auth.form.pending : r.submit}
        </button>
      </form>
      <BackToLogin />
    </div>
  );
}

// Stap 2: via de link uit de mail (met sessie) een nieuw wachtwoord kiezen
export function NewPasswordForm() {
  const t = useT();
  const r = t.auth.reset;
  const { state, pending, submit } = useFormAction(completePasswordReset);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  return (
    <div className={authCardClasses}>
      <Heading title={r.newTitle} subtitle={r.newSubtitle} />
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthField label={r.newLabel} htmlFor="password" hint={t.auth.form.passwordHint}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            required
          />
        </AuthField>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} aria-busy={pending || undefined} className={authSubmitClasses}>
          {pending ? t.auth.form.pending : r.newSubmit}
        </button>
      </form>
    </div>
  );
}
