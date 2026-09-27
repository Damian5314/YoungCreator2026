'use client';

import { useEffect, useRef, type FormEvent } from 'react';
import { LogOut } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { useT } from '@/i18n/I18nProvider';
import { logout, updateEmail, updatePassword } from '@/lib/actions/auth';
import { useFormAction } from '@/lib/hooks/useFormAction';

interface SettingsPanelProps {
  email: string;
  fullName: string | null;
}

export function SettingsPanel({ email, fullName }: SettingsPanelProps) {
  const t = useT();
  const s = t.settings;
  const emailAction = useFormAction(updateEmail);
  const passwordAction = useFormAction(updatePassword);
  const passwordForm = useRef<HTMLFormElement>(null);

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
        <CardHeader title={s.account.title} description={s.account.description} />
        <form onSubmit={submitWith(emailAction)} className="space-y-4">
          <Field label={s.account.emailLabel} htmlFor="settings-email">
            <Input id="settings-email" name="email" type="email" autoComplete="email" defaultValue={email} required />
          </Field>
          <FormMessage state={emailAction.state} />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={emailAction.pending}>
              {emailAction.pending ? t.common.actions.saving : s.account.updateEmail}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title={s.password.title} description={s.password.description} />
        <form ref={passwordForm} onSubmit={submitWith(passwordAction)} className="space-y-4">
          <Field label={s.password.label} htmlFor="settings-password" hint={s.password.hint}>
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
              {passwordAction.pending ? t.common.actions.saving : s.password.update}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title={s.session.title} description={s.session.loggedInAs(fullName || email)} />
        <form action={logout} className="flex justify-end">
          <Button type="submit" variant="secondary" size="sm">
            <LogOut className="size-4" aria-hidden />
            {s.session.logout}
          </Button>
        </form>
      </Card>
    </div>
  );
}
