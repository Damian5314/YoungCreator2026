'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTheme } from 'next-themes';
import { LogOut } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { Switch } from '@/components/ui/Switch';
import { logout, updateEmail, updatePassword } from '@/lib/actions/auth';
import { useFormAction } from '@/lib/hooks/useFormAction';

interface SettingsPanelProps {
  email: string;
  fullName: string | null;
}

export function SettingsPanel({ email, fullName }: SettingsPanelProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const emailAction = useFormAction(updateEmail);
  const passwordAction = useFormAction(updatePassword);
  const passwordForm = useRef<HTMLFormElement>(null);

  // Het thema is pas op de client bekend (localStorage / systeemvoorkeur)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Wachtwoordveld leegmaken zodra het opslaan gelukt is
  useEffect(() => {
    if (passwordAction.state?.message) passwordForm.current?.reset();
  }, [passwordAction.state]);

  function submitWith(action: ReturnType<typeof useFormAction>) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      action.submit(new FormData(event.currentTarget));
    };
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Account" description="The email address you log in with." />
        <form onSubmit={submitWith(emailAction)} className="space-y-4">
          <Field label="Email address" htmlFor="settings-email">
            <Input id="settings-email" name="email" type="email" autoComplete="email" defaultValue={email} required />
          </Field>
          <FormMessage state={emailAction.state} />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={emailAction.pending}>
              {emailAction.pending ? 'Saving…' : 'Update email'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Password" description="Choose a new password for your account." />
        <form ref={passwordForm} onSubmit={submitWith(passwordAction)} className="space-y-4">
          <Field label="New password" htmlFor="settings-password" hint="At least 6 characters.">
            <Input
              id="settings-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </Field>
          <FormMessage state={passwordAction.state} />
          <div className="flex justify-end">
            <Button type="submit" variant="secondary" size="sm" disabled={passwordAction.pending}>
              {passwordAction.pending ? 'Saving…' : 'Update password'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Appearance" />
        <Switch
          id="dark-mode"
          label="Dark mode"
          description="Switch between a light and a dark interface."
          checked={mounted && resolvedTheme === 'dark'}
          disabled={!mounted}
          onChange={(dark) => setTheme(dark ? 'dark' : 'light')}
        />
      </Card>

      <Card>
        <CardHeader title="Session" description={`Logged in as ${fullName || email}.`} />
        <form action={logout} className="flex justify-end">
          <Button type="submit" variant="secondary" size="sm">
            <LogOut className="size-4" aria-hidden />
            Log out
          </Button>
        </form>
      </Card>
    </div>
  );
}
