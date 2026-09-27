'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { useT } from '@/i18n/I18nProvider';
import { saveAgentSettings } from '@/lib/actions/agent';
import type { AutomationLevel, ProfileData } from '@/lib/data/queries';
import { useFormAction } from '@/lib/hooks/useFormAction';

const LEVELS: AutomationLevel[] = [1, 2, 3];

interface AgentSettingsCardProps {
  profile: ProfileData | null;
  canSendEmail: boolean;
  automationsUnlocked: boolean; // niveau 2 en 3 vragen een betaald account
}

// Hoe zelfstandig de agent mag werken + links onder de e-mails
export function AgentSettingsCard({ profile, canSendEmail, automationsUnlocked }: AgentSettingsCardProps) {
  const t = useT();
  const a = t.settings.agent;
  const { state, pending, submit } = useFormAction(saveAgentSettings);
  const [level, setLevel] = useState<AutomationLevel>(profile?.automationLevel ?? 1);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  return (
    <Card>
      <CardHeader title={a.title} description={a.description} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium">{a.levelLegend}</legend>
          <div className="mt-2 space-y-2">
            {LEVELS.map((value) => {
              const locked = !automationsUnlocked && value >= 2;
              return (
                <label
                  key={value}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                    locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  } ${level === value ? 'border-selected-border bg-selected' : 'border-border hover:bg-muted'}`}
                >
                  <input
                    type="radio"
                    name="automationLevel"
                    value={value}
                    checked={level === value}
                    onChange={() => setLevel(value)}
                    // Een al gekozen niveau blijft aanklikbaar, anders valt het veld weg uit het formulier
                    disabled={locked && level !== value}
                    className="mt-1 accent-action"
                  />
                  <span className="text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      {value}. {a.levels[value].title}
                      {locked && <Lock className="size-3.5 text-muted-foreground" aria-label={a.lockedLabel} />}
                    </span>
                    <span className="block text-muted-foreground">{a.levels[value].description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {!automationsUnlocked && (
            <p className="mt-2 text-sm text-muted-foreground">
              {a.lockedHint.text}{' '}
              <Link href="/billing" className="font-medium text-primary hover:underline">
                {a.lockedHint.link}
              </Link>
            </p>
          )}
          {level >= 2 && !canSendEmail && (
            <p className="mt-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">{a.notConnected}</p>
          )}
        </fieldset>

        {level === 3 && (
          <div className="space-y-4 rounded-lg border border-border p-4">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="autoSendConsent"
                defaultChecked={Boolean(profile?.autoSendConsentAt)}
                required
                className="mt-1 accent-action"
              />
              <span>{a.consent}</span>
            </label>
            <Field label={a.dailyLimitLabel} htmlFor="dailySendLimit" hint={a.dailyLimitHint}>
              <Input id="dailySendLimit" name="dailySendLimit" type="number" min={0} max={20} defaultValue={profile?.dailySendLimit ?? 3} />
            </Field>
          </div>
        )}
        {level !== 3 && <input type="hidden" name="dailySendLimit" value={profile?.dailySendLimit ?? 3} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={a.linkedinLabel} htmlFor="linkedinUrl" hint={a.linkedinHint}>
            <Input id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/…" defaultValue={profile?.linkedinUrl ?? ''} />
          </Field>
          <Field label={a.portfolioLabel} htmlFor="portfolioUrl" hint={a.portfolioHint}>
            <Input id="portfolioUrl" name="portfolioUrl" type="url" placeholder="https://…" defaultValue={profile?.portfolioUrl ?? ''} />
          </Field>
        </div>

        <FormMessage state={state} />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? t.common.actions.saving : a.save}
          </Button>
        </div>
      </form>
    </Card>
  );
}
