'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Check, Copy, LoaderCircle, Mail, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { SavedNote } from '@/components/ui/SavedNote';
import { draftOutreach, markOutreachSent, saveOutreachDraft, sendOutreachNow } from '@/lib/actions/outreach';
import type { FormState } from '@/lib/actions/formState';
import type { AutomationLevel, OutreachMessageData } from '@/lib/data/queries';
import type { OpportunityContact } from '@/shared/types/Opportunity';
import { formatDateTime } from '@/shared/utils/formatDate';

interface OutreachPanelProps {
  matchId: string;
  company: string;
  contact?: OpportunityContact;
  outreach: OutreachMessageData | null;
  automationLevel: AutomationLevel;
  canSend: boolean; // n8n send-webhook is gekoppeld
  aiEnabled: boolean;
}

// Action engine: de agent schrijft een persoonlijke mail, de student controleert en verstuurt
export function OutreachPanel({ matchId, company, contact, outreach, automationLevel, canSend, aiEnabled }: OutreachPanelProps) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<'draft' | 'save' | 'send' | 'manual' | null>(null);
  const [state, setState] = useState<FormState>(undefined);
  const [copied, setCopied] = useState(false);

  const [toEmail, setToEmail] = useState(outreach?.toEmail ?? '');
  const [toName, setToName] = useState(outreach?.toName ?? '');
  const [subject, setSubject] = useState(outreach?.subject ?? '');
  const [body, setBody] = useState(outreach?.body ?? '');

  const working = pending || busy !== null;
  const recipient = contact?.name ?? company;

  function run(kind: NonNullable<typeof busy>, task: () => Promise<FormState>) {
    setBusy(kind);
    setState(undefined);
    startTransition(async () => {
      try {
        setState(await task());
      } finally {
        setBusy(null);
      }
    });
  }

  function formData() {
    const data = new FormData();
    data.set('id', outreach?.id ?? '');
    data.set('matchId', matchId);
    data.set('toEmail', toEmail);
    data.set('toName', toName);
    data.set('subject', subject);
    data.set('body', body);
    return data;
  }

  const writeDraft = () =>
    run('draft', async () => {
      const result = await draftOutreach(matchId);
      return result.ok ? undefined : { error: result.error };
    });

  // Eerst opslaan, zodat er precies verstuurd wordt wat de student ziet
  const saveThen = async (next?: () => Promise<{ ok: boolean; error?: string }>): Promise<FormState> => {
    const saved = await saveOutreachDraft(undefined, formData());
    if (saved?.error || !next) return saved;
    const result = await next();
    return result.ok ? undefined : { error: result.error };
  };

  async function copyEmail() {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mailto = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (!outreach) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Let your agent write a short, personal email to {recipient}, based on this opportunity and your profile. You check it before
          anything is sent.
        </p>
        {!contact?.email && (
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            We don&apos;t have an email address for this contact yet. You can add one after the draft is written
            {contact?.url ? (
              <>
                {' '}
                (try{' '}
                <a href={contact.url} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                  their profile
                </a>
                )
              </>
            ) : null}
            .
          </p>
        )}
        <Button onClick={writeDraft} disabled={working} className="w-full">
          {busy === 'draft' ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
          {busy === 'draft' ? 'Writing your email…' : 'Write email'}
        </Button>
        {!aiEnabled && <p className="text-xs text-muted-foreground">AI isn&apos;t connected, so we start from a personal template.</p>}
        <FormMessage state={state} />
      </div>
    );
  }

  if (outreach.status === 'sent' || outreach.status === 'sending') {
    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 rounded-lg bg-success-soft p-3 text-sm font-medium text-success">
          <Check className="size-4" aria-hidden />
          {outreach.status === 'sending'
            ? 'Sending…'
            : `Sent ${outreach.sentAt ? formatDateTime(new Date(outreach.sentAt)) : ''}${outreach.sentVia === 'manual' ? ' from your own mailbox' : ' by JobHunter'}`}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">To: {outreach.toName ? `${outreach.toName} <${outreach.toEmail}>` : outreach.toEmail}</p>
          <p className="font-medium">{outreach.subject}</p>
          <p className="whitespace-pre-wrap text-muted-foreground">{outreach.body}</p>
        </div>
      </div>
    );
  }

  const sendDisabledReason = !canSend
    ? 'Sending from JobHunter isn’t connected yet. Use your mail app instead.'
    : automationLevel < 2
      ? 'You send emails yourself (automation level 1).'
      : !toEmail
        ? 'Add the recipient’s email address first.'
        : null;

  return (
    <div className="space-y-4">
      {outreach.createdBy === 'agent' && (
        <p className="flex items-start gap-2 rounded-lg bg-primary-soft p-3 text-sm text-primary-soft-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
          Your agent prepared this email because this is one of your strongest matches.
        </p>
      )}
      {outreach.status === 'failed' && outreach.errorMessage && <FormMessage state={{ error: outreach.errorMessage }} />}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="To (email)" htmlFor="outreach-to">
          <Input id="outreach-to" type="email" value={toEmail} onChange={(event) => setToEmail(event.target.value)} placeholder="name@company.com" />
        </Field>
        <Field label="Name" htmlFor="outreach-name">
          <Input id="outreach-name" value={toName} onChange={(event) => setToName(event.target.value)} />
        </Field>
      </div>
      <Field label="Subject" htmlFor="outreach-subject">
        <Input id="outreach-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={200} />
      </Field>
      <Field label="Message" htmlFor="outreach-body">
        <Textarea id="outreach-body" rows={12} value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} />
      </Field>

      <FormMessage state={state?.error ? state : undefined} />

      <div className="flex flex-wrap items-center gap-2">
        {automationLevel >= 2 && (
          <Button
            onClick={() => run('send', () => saveThen(() => sendOutreachNow(outreach.id, matchId)))}
            disabled={working || Boolean(sendDisabledReason)}
            title={sendDisabledReason ?? undefined}
          >
            {busy === 'send' ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
            {automationLevel === 3 ? 'Send now' : 'Approve & send'}
          </Button>
        )}
        <a
          href={mailto}
          onClick={() => void saveOutreachDraft(undefined, formData())}
          className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            automationLevel >= 2 ? 'border border-border bg-card hover:bg-muted' : 'bg-primary text-primary-foreground hover:bg-primary-hover'
          }`}
        >
          <Mail className="size-4" aria-hidden />
          Open in mail app
        </a>
        <Button variant="secondary" onClick={copyEmail} disabled={working}>
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="ghost" onClick={() => run('save', () => saveThen())} disabled={working}>
          {busy === 'save' ? 'Saving…' : 'Save'}
        </Button>
        {state?.message && busy === null && <SavedNote>{state.message}</SavedNote>}
      </div>
      {automationLevel >= 2 && sendDisabledReason && <p className="text-xs text-muted-foreground">{sendDisabledReason}</p>}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
        <button
          type="button"
          onClick={() => run('manual', () => saveThen(() => markOutreachSent(outreach.id, matchId)))}
          disabled={working}
          className="font-medium text-primary hover:underline disabled:opacity-50"
        >
          I sent it myself
        </button>
        <button
          type="button"
          onClick={writeDraft}
          disabled={working}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${busy === 'draft' ? 'animate-spin' : ''}`} aria-hidden />
          Rewrite
        </button>
      </div>
      {automationLevel === 1 && (
        <p className="text-xs text-muted-foreground">
          Want JobHunter to send approved emails for you?{' '}
          <Link href="/settings" className="font-medium text-primary hover:underline">
            Change your automation level
          </Link>
          .
        </p>
      )}
    </div>
  );
}
