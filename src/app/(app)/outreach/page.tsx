import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Mail, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getOutreachList, type OutreachListItem } from '@/lib/data/queries';
import type { OutreachStatus } from '@/shared/types/Opportunity';
import { formatDateTime } from '@/shared/utils/formatDate';

export const metadata: Metadata = { title: 'Outreach' };

const STATUS: Record<OutreachStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Ready to review', tone: 'warning' },
  failed: { label: 'Failed', tone: 'warning' },
  sending: { label: 'Sending', tone: 'primary' },
  sent: { label: 'Sent', tone: 'success' },
};

function MessageRow({ message }: { message: OutreachListItem }) {
  const when = message.status === 'sent' && message.sentAt ? message.sentAt : message.updatedAt;
  return (
    <li>
      <Link
        href={`/matches/${message.matchId}`}
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          {message.createdBy === 'agent' ? <Sparkles className="size-5 text-primary" aria-hidden /> : <Mail className="size-5" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={STATUS[message.status].tone}>{STATUS[message.status].label}</Badge>
            <span className="text-xs text-muted-foreground">{formatDateTime(new Date(when))}</span>
          </span>
          <span className="mt-1 block truncate font-medium">{message.subject || message.opportunityTitle}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {message.opportunityTitle} · {message.company}
            {message.toEmail ? ` · to ${message.toName ?? message.toEmail}` : ' · no recipient yet'}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </li>
  );
}

export default async function OutreachPage() {
  const messages = await getOutreachList();
  const toReview = messages.filter((m) => m.status === 'draft' || m.status === 'failed');
  const sent = messages.filter((m) => m.status === 'sent' || m.status === 'sending');

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Outreach"
        description="Emails your agent prepared for you, and the ones you already sent."
      />

      {messages.length === 0 ? (
        <Card className="py-12 text-center">
          <h2 className="font-semibold">No emails yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            After a search, your agent prepares emails for your strongest matches. You can also open any result and press
            &ldquo;Reach out&rdquo;.
          </p>
          <ButtonLink href="/dashboard" size="sm" className="mt-5">
            Go to your results
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-semibold">
              Ready to review <span className="font-normal text-muted-foreground">({toReview.length})</span>
            </h2>
            {toReview.length > 0 ? (
              <ul className="space-y-3">
                {toReview.map((message) => (
                  <MessageRow key={message.id} message={message} />
                ))}
              </ul>
            ) : (
              <Card className="text-center text-sm text-muted-foreground">Nothing waiting for you. Nice work.</Card>
            )}
          </section>
          {sent.length > 0 && (
            <section>
              <h2 className="mb-3 font-semibold">
                Sent <span className="font-normal text-muted-foreground">({sent.length})</span>
              </h2>
              <ul className="space-y-3">
                {sent.map((message) => (
                  <MessageRow key={message.id} message={message} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
