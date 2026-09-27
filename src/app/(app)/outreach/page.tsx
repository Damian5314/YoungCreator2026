import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Mail, Sparkles } from 'lucide-react';
import { CompanyMark } from '@/components/companies/CompanyMark';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getOutreachList, type OutreachListItem } from '@/lib/data/queries';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { getLocale, getT } from '@/i18n/server';
import { formatDateTime } from '@/shared/utils/formatDate';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.outreach.meta.title };
}

// Eén bericht: bij welk bedrijf en welke kans, aan wie, waarover en hoe ver het is. Klik → de kans.
function MessageRow({ message, t, locale }: { message: OutreachListItem; t: Dictionary; locale: Locale }) {
  const when = message.status === 'sent' && message.sentAt ? message.sentAt : message.updatedAt;
  const p = t.outreach.page;
  return (
    <li>
      <Link
        href={`/matches/${message.matchId}`}
        className="flex items-center gap-3 rounded-card border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-4"
      >
        <span className="hidden min-[400px]:block">
          <CompanyMark name={message.company || message.opportunityTitle} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge kind="outreach" status={message.status}>
              {p.statuses[message.status]}
            </StatusBadge>
            {message.createdBy === 'agent' && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="size-3 text-primary" aria-hidden />
                {p.byAgent}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{formatDateTime(new Date(when), locale)}</span>
          </span>
          {/* Mobiel mag het onderwerp over twee regels lopen, anders valt de helft weg */}
          <span className="mt-1 line-clamp-2 font-medium sm:line-clamp-1">{message.subject || message.opportunityTitle}</span>
          <span className="block truncate text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{message.company}</span> · {message.opportunityTitle}
            {message.toEmail ? ` · ${p.toRecipient(message.toName ?? message.toEmail)}` : ` · ${p.noRecipient}`}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </li>
  );
}

function Section({ title, messages, t, locale }: { title: string; messages: OutreachListItem[]; t: Dictionary; locale: Locale }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold">
        {title} <span className="font-normal text-muted-foreground">({messages.length})</span>
      </h2>
      <ul className="space-y-3">
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} t={t} locale={locale} />
        ))}
      </ul>
    </section>
  );
}

export default async function OutreachPage() {
  const [messages, t, locale] = await Promise.all([getOutreachList(), getT(), getLocale()]);
  const p = t.outreach.page;
  const toReview = messages.filter((m) => m.status === 'draft' || m.status === 'failed');
  const sending = messages.filter((m) => m.status === 'sending');
  const sent = messages.filter((m) => m.status === 'sent');

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={p.title} description={p.description} />

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={p.empty.title}
          description={p.empty.body}
          action={
            <ButtonLink href="/opportunities" size="sm">
              {p.empty.cta}
            </ButtonLink>
          }
        />
      ) : (
        <div className="space-y-8">
          {toReview.length > 0 ? (
            <Section title={p.readyToReview} messages={toReview} t={t} locale={locale} />
          ) : (
            <section>
              <h2 className="mb-3 font-semibold">
                {p.readyToReview} <span className="font-normal text-muted-foreground">(0)</span>
              </h2>
              <Card className="text-center text-sm text-muted-foreground">{p.nothingWaiting}</Card>
            </section>
          )}
          {sending.length > 0 && <Section title={p.sending} messages={sending} t={t} locale={locale} />}
          {sent.length > 0 && <Section title={p.sent} messages={sent} t={t} locale={locale} />}
        </div>
      )}
    </div>
  );
}
