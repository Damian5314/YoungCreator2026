'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { saveAgentSettings } from '@/lib/actions/agent';
import type { AutomationLevel, ProfileData } from '@/lib/data/queries';
import { useFormAction } from '@/lib/hooks/useFormAction';

const LEVELS: { value: AutomationLevel; title: string; description: string }[] = [
  {
    value: 1,
    title: 'Assistant',
    description: 'Your agent finds opportunities and writes the emails. You review them and send them yourself.',
  },
  {
    value: 2,
    title: 'Semi-automatic',
    description: 'Your agent prepares everything. You approve with one click and Unlisted sends it.',
  },
  {
    value: 3,
    title: 'Fully automatic',
    description: 'Your agent searches, writes and sends emails for your strongest matches on its own, within a daily limit.',
  },
];

interface AgentSettingsCardProps {
  profile: ProfileData | null;
  canSendEmail: boolean;
  automationsUnlocked: boolean; // niveau 2 en 3 vragen een betaald account
}

// Hoe zelfstandig de agent mag werken + links onder de e-mails
export function AgentSettingsCard({ profile, canSendEmail, automationsUnlocked }: AgentSettingsCardProps) {
  const { state, pending, submit } = useFormAction(saveAgentSettings);
  const [level, setLevel] = useState<AutomationLevel>(profile?.automationLevel ?? 1);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  return (
    <Card>
      <CardHeader title="Your agent" description="Decide how much your agent may do on its own." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium">Automation level</legend>
          <div className="mt-2 space-y-2">
            {LEVELS.map((option) => {
              const locked = !automationsUnlocked && option.value >= 2;
              return (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                    locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  } ${level === option.value ? 'border-selected-border bg-selected' : 'border-border hover:bg-muted'}`}
                >
                  <input
                    type="radio"
                    name="automationLevel"
                    value={option.value}
                    checked={level === option.value}
                    onChange={() => setLevel(option.value)}
                    // Een al gekozen niveau blijft aanklikbaar, anders valt het veld weg uit het formulier
                    disabled={locked && level !== option.value}
                    className="mt-1 accent-action"
                  />
                  <span className="text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      {option.value}. {option.title}
                      {locked && <Lock className="size-3.5 text-muted-foreground" aria-label="Needs a credit pack" />}
                    </span>
                    <span className="block text-muted-foreground">{option.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {!automationsUnlocked && (
            <p className="mt-2 text-sm text-muted-foreground">
              Levels 2 and 3 come with any credit pack.{' '}
              <Link href="/billing" className="font-medium text-primary hover:underline">
                See credit packs
              </Link>
            </p>
          )}
          {level >= 2 && !canSendEmail && (
            <p className="mt-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
              Email sending isn&apos;t connected yet (n8n). Until it is, you can still copy emails or open them in your mail app.
            </p>
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
              <span>
                I allow Unlisted to send emails on my behalf to contacts at opportunities that strongly match my profile. Replies
                go to my own email address.
              </span>
            </label>
            <Field label="Maximum emails per day" htmlFor="dailySendLimit" hint="Between 0 and 20. Your agent never sends more than this in 24 hours.">
              <Input id="dailySendLimit" name="dailySendLimit" type="number" min={0} max={20} defaultValue={profile?.dailySendLimit ?? 3} />
            </Field>
          </div>
        )}
        {level !== 3 && <input type="hidden" name="dailySendLimit" value={profile?.dailySendLimit ?? 3} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn" htmlFor="linkedinUrl" hint="Added below your emails.">
            <Input id="linkedinUrl" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/…" defaultValue={profile?.linkedinUrl ?? ''} />
          </Field>
          <Field label="Portfolio or GitHub" htmlFor="portfolioUrl" hint="Optional.">
            <Input id="portfolioUrl" name="portfolioUrl" type="url" placeholder="https://…" defaultValue={profile?.portfolioUrl ?? ''} />
          </Field>
        </div>

        <FormMessage state={state} />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Saving…' : 'Save agent settings'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
