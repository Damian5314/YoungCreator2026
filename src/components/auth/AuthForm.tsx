'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';

// Gedeeld formulier voor login en registratie
export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const isRegister = mode === 'register';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: echte authenticatie. Nieuwe accounts vullen eerst hun situatie en voorkeuren in.
    router.push(isRegister ? '/search/preferences' : '/dashboard');
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
            <Input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" />
          </Field>
        )}
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" className="w-full">
          {isRegister ? 'Create account' : 'Log in'}
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
