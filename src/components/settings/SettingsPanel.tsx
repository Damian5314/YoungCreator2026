'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useTheme } from 'next-themes';
import { LogOut } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { SavedNote } from '@/components/ui/SavedNote';
import { Switch } from '@/components/ui/Switch';
import { mockUser } from '@/shared/mocks/mockData';

export function SettingsPanel() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState(mockUser.email);
  const [emailSaved, setEmailSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Het thema is pas op de client bekend (localStorage / systeemvoorkeur)
  useEffect(() => {
    setMounted(true);
  }, []);

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: e-mailadres bijwerken via /api/profile
    setEmailSaved(true);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Account" description="The email address we use for your login and notifications." />
        <form onSubmit={handleEmailSubmit}>
          <Field label="Email address" htmlFor="settings-email">
            <Input
              id="settings-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailSaved(false);
              }}
            />
          </Field>
          <div className="mt-4 flex items-center justify-end gap-3">
            {emailSaved && <SavedNote>Saved</SavedNote>}
            <Button type="submit" size="sm">
              Update email
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Password" description={`We'll send a reset link to ${email}.`} />
        <div className="flex items-center justify-end gap-3">
          {/* TODO: echte reset-mail versturen */}
          {resetSent && <SavedNote>Reset link sent</SavedNote>}
          <Button variant="secondary" size="sm" onClick={() => setResetSent(true)}>
            Send reset link
          </Button>
        </div>
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
        <CardHeader title="Session" description={`Logged in as ${mockUser.name}.`} />
        <div className="flex justify-end">
          {/* TODO: echte sessie beëindigen */}
          <ButtonLink href="/" variant="secondary" size="sm">
            <LogOut className="size-4" aria-hidden />
            Log out
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
