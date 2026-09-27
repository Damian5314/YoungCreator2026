'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Check, Copy, LoaderCircle, Mail, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { SavedNote } from '@/components/ui/SavedNote';
import { useLocale, useT } from '@/i18n/I18nProvider';
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
  sendLocked?: boolean; // versturen via Unlisted is een automation: nog geen creditpakket gekocht
  aiEnabled: boolean;
}

// Action engine: de agent schrijft een persoonlijke mail, de student controleert en verstuurt
export function OutreachPanel({
  matchId,
  company,
  contact,
  outreach,
  automationLevel,
  canSend,
  sendLocked = false,
  aiEnabled,
}: OutreachPanelProps) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<'draft' | 'save' | 'send' | 'manual' | null>(null);
  const [state, setState] = useState<FormState>(undefined);
  const [copied, setCopied] = useState(false);
  const t = useT();
  const locale = useLocale();
  const p = t.outreach.panel;

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
    await navigator.clipboard.writeText(`${p.clipboardSubject} ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mailto = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (!outreach) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {p.intro(recipient)}
        </p>
        {!contact?.email && (
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            {p.noEmail.text}
            {contact?.url ? (
              <>
                {' '}
                {p.noEmail.tryBefore}
                <a href={contact.url} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                  {p.noEmail.profileLink}
                </a>
                {p.noEmail.tryAfter}
              </>
            ) : null}
            {p.noEmail.end}
          </p>
        )}
        <Button onClick={writeDraft} disabled={working} className="w-full">
          {busy === 'draft' ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
          {busy === 'draft' ? p.writing : p.write}
        </Button>
        {!aiEnabled && <p className="text-xs text-muted-foreground">{p.noAi}</p>}
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
            ? p.sending
            : p.sent(outreach.sentAt ? formatDateTime(new Date(outreach.sentAt), locale) : '', outreach.sentVia === 'manual')}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">{p.to(outreach.toName ? `${outreach.toName} <${outreach.toEmail}>` : (outreach.toEmail ?? ''))}</p>
          <p className="font-medium">{outreach.subject}</p>
          <p className="whitespace-pre-wrap text-muted-foreground">{outreach.body}</p>
        </div>
      </div>
    );
  }

  const sendDisabledReason = !canSend
    ? p.sendDisabled.notConnected
    : sendLocked
      ? p.sendDisabled.locked
      : automationLevel < 2
      ? p.sendDisabled.level1
      : !toEmail
        ? p.sendDisabled.noRecipient
        : null;

  return (
    <div className="space-y-4">
      {outreach.createdBy === 'agent' && (
        <p className="flex items-start gap-2 rounded-lg bg-primary-soft p-3 text-sm text-primary-soft-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
          {p.agentPrepared}
        </p>
      )}
      {outreach.status === 'failed' && outreach.errorMessage && <FormMessage state={{ error: outreach.errorMessage }} />}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={p.fields.to} htmlFor="outreach-to">
          <Input id="outreach-to" type="email" value={toEmail} onChange={(event) => setToEmail(event.target.value)} placeholder={p.fields.toPlaceholder} />
        </Field>
        <Field label={p.fields.name} htmlFor="outreach-name">
          <Input id="outreach-name" value={toName} onChange={(event) => setToName(event.target.value)} />
        </Field>
      </div>
      <Field label={p.fields.subject} htmlFor="outreach-subject">
        <Input id="outreach-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={200} />
      </Field>
      <Field label={p.fields.message} htmlFor="outreach-body">
        <Textarea id="outreach-body" rows={12} value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} />
      </Field>

      <FormMessage state={state?.error ? state : undefined} />

      {/* Mobiel: hoofdactie over de volle breedte, de rest in twee even brede kolommen */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        {automationLevel >= 2 && (
          <Button
            onClick={() => run('send', () => saveThen(() => sendOutreachNow(outreach.id, matchId)))}
            disabled={working || Boolean(sendDisabledReason)}
            title={sendDisabledReason ?? undefined}
            className="col-span-2"
          >
            {busy === 'send' ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
            {automationLevel === 3 ? p.sendNow : p.approveSend}
          </Button>
        )}
        <a
          href={mailto}
          onClick={() => void saveOutreachDraft(undefined, formData())}
          className={`col-span-2 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            automationLevel >= 2 ? 'border border-border bg-card hover:bg-muted' : 'bg-primary text-primary-foreground hover:bg-primary-hover'
          }`}
        >
          <Mail className="size-4" aria-hidden />
          {p.openMailApp}
        </a>
        <Button variant="secondary" onClick={copyEmail} disabled={working}>
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? p.copied : p.copy}
        </Button>
        <Button
          variant="ghost"
          onClick={() => run('save', () => saveThen())}
          disabled={working}
          className="border border-border sm:border-0"
        >
          {busy === 'save' ? t.common.actions.saving : t.common.actions.save}
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
          Want Unlisted to send approved emails for you?{' '}
          <Link href="/settings" className="font-medium text-primary hover:underline">
            Change your automation level
          </Link>
          .
        </p>
      )}
    </div>
  );
}
