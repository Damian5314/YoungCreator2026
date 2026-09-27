import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Mail, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getOutreachList, type OutreachListItem } from '@/lib/data/queries';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { getLocale, getT } from '@/i18n/server';
import type { OutreachStatus } from '@/shared/types/Opportunity';
import { formatDateTime } from '@/shared/utils/formatDate';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.outreach.meta.title };
}

const STATUS_TONES: Record<OutreachStatus, BadgeTone> = {
  draft: 'warning',
  failed: 'warning',
  sending: 'primary',
  sent: 'success',
};

function MessageRow({ message, t, locale }: { message: OutreachListItem; t: Dictionary; locale: Locale }) {
  const when = message.status === 'sent' && message.sentAt ? message.sentAt : message.updatedAt;
  const p = t.outreach.page;
  return (
    <li>
      <Link
        href={`/matches/${message.matchId}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-4"
      >
        <span className="hidden size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground min-[400px]:grid">
          {message.createdBy === 'agent' ? <Sparkles className="size-5 text-primary" aria-hidden /> : <Mail className="size-5" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={STATUS_TONES[message.status]}>{p.statuses[message.status]}</Badge>
            <span className="text-xs text-muted-foreground">{formatDateTime(new Date(when), locale)}</span>
          </span>
          {/* Mobiel mag het onderwerp over twee regels lopen, anders valt de helft weg */}
          <span className="mt-1 line-clamp-2 font-medium sm:line-clamp-1">{message.subject || message.opportunityTitle}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {message.opportunityTitle} · {message.company}
            {message.toEmail ? ` · ${p.toRecipient(message.toName ?? message.toEmail)}` : ` · ${p.noRecipient}`}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </li>
  );
}

export default async function OutreachPage() {
  const [messages, t, locale] = await Promise.all([getOutreachList(), getT(), getLocale()]);
  const p = t.outreach.page;
  const toReview = messages.filter((m) => m.status === 'draft' || m.status === 'failed');
  const sent = messages.filter((m) => m.status === 'sent' || m.status === 'sending');

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={p.title}
        description={p.description}
      />

      {messages.length === 0 ? (
        <Card className="py-12 text-center">
          <h2 className="font-semibold">{p.empty.title}</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {p.empty.body}
          </p>
          <ButtonLink href="/dashboard" size="sm" className="mt-5">
            {p.empty.cta}
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-semibold">
              {p.readyToReview} <span className="font-normal text-muted-foreground">({toReview.length})</span>
            </h2>
            {toReview.length > 0 ? (
              <ul className="space-y-3">
                {toReview.map((message) => (
                  <MessageRow key={message.id} message={message} t={t} locale={locale} />
                ))}
              </ul>
            ) : (
              <Card className="text-center text-sm text-muted-foreground">{p.nothingWaiting}</Card>
            )}
          </section>
          {sent.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">
                {p.sent} <span className="font-normal text-muted-foreground">({sent.length})</span>
              </h2>
              <ul className="space-y-3">
                {sent.map((message) => (
                  <MessageRow key={message.id} message={message} t={t} locale={locale} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
