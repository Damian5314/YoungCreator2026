'use client';

import { useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { FormMessage } from '@/components/ui/FormMessage';
import { login, register } from '@/lib/actions/auth';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { DEMO_ACCOUNT } from '@/shared/constants/demoAccount';

// Ruime velden in de huisstijl van de landingspagina; 16px op mobiel zodat iOS niet inzoomt.
// Desktop: hoogtes en ruimtes schalen mee met de schermhoogte (svh), zodat de kaart zonder scrollen past.
const inputClasses =
  'h-[54px] lg:h-[clamp(42px,6.6svh,54px)] w-full rounded-[13px] border border-[#D9E2DD] bg-white px-4 text-base text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/12 disabled:opacity-50 sm:text-[15px]';

function AuthField({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-2 lg:space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={`${inputClasses} pr-12`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
      >
        {visible ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
      </button>
    </div>
  );
}

// Gedeeld formulier voor login en registratie
export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register';
  const { state, pending, submit } = useFormAction(isRegister ? register : login);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  // Live demo: vult het demo-account in, daarna alleen nog op "Log in" klikken (of Enter)
  function fillDemoAccount() {
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem('email') as HTMLInputElement).value = DEMO_ACCOUNT.email;
    (form.elements.namedItem('password') as HTMLInputElement).value = DEMO_ACCOUNT.password;
    form.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus();
  }

  return (
    <div className="rounded-[28px] border border-[rgb(16_24_32/0.06)] bg-white p-6 shadow-[0_20px_70px_rgb(16_24_32/0.09)] sm:p-10 lg:p-[clamp(26px,4.4svh,48px)]">
      <h1 className="text-[28px] font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-[32px] lg:text-[length:clamp(26px,4.4svh,32px)]">
        {isRegister ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground lg:mt-1.5">
        {isRegister
          ? 'Set up your search in a few minutes.'
          : 'Log in to see your latest matches and new opportunities.'}
      </p>

      {!isRegister && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-[13px] lg:mt-[clamp(14px,2.6svh,24px)] border border-dashed border-primary/30 bg-primary-soft/60 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary-soft-foreground">Demo account</p>
            <p className="truncate text-xs text-muted-foreground">{DEMO_ACCOUNT.email}</p>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-primary ring-1 ring-primary/20 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Sparkles className="size-4" aria-hidden />
            Use demo
          </button>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-5 lg:mt-[clamp(16px,3svh,32px)] lg:space-y-[clamp(10px,2svh,20px)]">
        {isRegister && (
          <AuthField label="Full name" htmlFor="name">
            <input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required className={inputClasses} />
          </AuthField>
        )}
        <AuthField label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className={inputClasses}
          />
        </AuthField>
        <AuthField label="Password" htmlFor="password" hint={isRegister ? 'At least 6 characters.' : undefined}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            minLength={isRegister ? 6 : undefined}
            required
          />
        </AuthField>
        <FormMessage state={state} />
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-[54px] w-full lg:h-[clamp(42px,6.6svh,54px)] items-center justify-center gap-2 rounded-[13px] bg-primary text-base font-semibold text-primary-foreground transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-primary-hover hover:shadow-[0_10px_24px_rgb(8_127_99/0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
          {!pending && (
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground lg:mt-[clamp(14px,2.4svh,24px)]">
        {isRegister ? 'Already have an account?' : 'New to Unlisted?'}{' '}
        <Link
          href={isRegister ? '/login' : '/register'}
          className="rounded font-semibold text-primary hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isRegister ? 'Sign in' : 'Create an account'}
        </Link>
      </p>

      {/* Registratie: past bij het creditmodel (eerste zoekopdracht gratis, daarna per zoekopdracht betalen) */}
      {isRegister ? (
        <p className="mt-8 text-center text-xs text-muted-foreground lg:mt-[clamp(12px,2.4svh,32px)]">
          No subscription <span aria-hidden>•</span> Pay only for what you use
        </p>
      ) : (
        <p className="mt-8 flex justify-center lg:mt-[clamp(12px,2.4svh,32px)]">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-soft-foreground">
            Real opportunities. Not just job listings.
          </span>
        </p>
      )}
    </div>
  );
}
