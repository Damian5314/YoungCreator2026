'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Download, LogOut, Trash2 } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, buttonClasses } from '@/components/ui/Button';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Field, Input } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { useT } from '@/i18n/I18nProvider';
import { deleteAccount } from '@/lib/actions/account';
import { logout, updateEmail, updatePassword } from '@/lib/actions/auth';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/shared/constants/auth';

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
  const deleteAction = useFormAction(deleteAccount);
  const [confirmEmail, setConfirmEmail] = useState('');

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
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
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
          <SubmitButton variant="secondary" size="sm" icon={<LogOut className="size-4" aria-hidden />}>
            {s.session.logout}
          </SubmitButton>
        </form>
      </Card>

      <Card>
        <CardHeader title={s.data.title} description={s.data.description} />
        <div className="flex justify-end">
          {/* Gewone link: de route stuurt een bestand terug (Content-Disposition: attachment) */}
          <a href="/api/account/export" download className={buttonClasses('secondary', 'sm')}>
            <Download className="size-4" aria-hidden />
            {s.data.export}
          </a>
        </div>
      </Card>

      <Card className="border-danger/30">
        <CardHeader title={s.danger.title} description={s.danger.description} />
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {s.danger.consequences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <form onSubmit={submitWith(deleteAction)} className="space-y-4">
          <Field label={s.danger.confirmLabel(email)} htmlFor="delete-confirm">
            <Input
              id="delete-confirm"
              name="confirmEmail"
              type="email"
              autoComplete="off"
              required
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
            />
          </Field>
          <FormMessage state={deleteAction.state} />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={deleteAction.pending || confirmEmail.trim().toLowerCase() !== email.toLowerCase()}
              aria-busy={deleteAction.pending || undefined}
            >
              <Trash2 className="size-4" aria-hidden />
              {deleteAction.pending ? s.danger.deleting : s.danger.button}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
