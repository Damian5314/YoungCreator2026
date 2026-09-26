'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { login, register } from '@/lib/actions/auth';
import { useFormAction } from '@/lib/hooks/useFormAction';

// Gedeeld formulier voor login en registratie
export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register';
  const { state, pending, submit } = useFormAction(isRegister ? register : login);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  return (
    <Card className="sm:p-6">
      <h1 className="text-xl font-semibold">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isRegister ? 'Set up your search in a few minutes.' : 'Log in to see your latest matches.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isRegister && (
          <Field label="Full name" htmlFor="name">
            <Input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required />
          </Field>
        )}
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </Field>
        <Field label="Password" htmlFor="password" hint={isRegister ? 'At least 6 characters.' : undefined}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            minLength={isRegister ? 6 : undefined}
            required
          />
        </Field>
        <FormMessage state={state} />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? 'Already have an account?' : 'New to JobHunter?'}{' '}
        <Link href={isRegister ? '/login' : '/register'} className="font-medium text-primary hover:underline">
          {isRegister ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </Card>
  );
}
