import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building, CalendarDays, ExternalLink, Globe, MapPin, Radar, Sparkles, TrendingUp, UserRound } from 'lucide-react';
import { z } from 'zod';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { MatchActions } from '@/components/opportunities/MatchActions';
import { MatchScore, STATUS_TONES } from '@/components/opportunities/OpportunityCard';
import { OutreachPanel } from '@/components/outreach/OutreachPanel';
import { features } from '@/lib/env';
import { getBillingStatus, getMatch, getOutreachForMatch, getProfile } from '@/lib/data/queries';
import {
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_TYPE_LABELS,
} from '@/shared/constants/opportunityTypes';
import { formatDateTime, formatShortDate } from '@/shared/utils/formatDate';

export const metadata: Metadata = { title: 'Opportunity' };

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [match, outreach, profile, billing] = await Promise.all([
    getMatch(id),
    getOutreachForMatch(id),
    getProfile(),
    getBillingStatus(),
  ]);
  if (!match) notFound();

  return (
    <>
      <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        All results
      </Link>
      <PageHeader title={match.title} description={match.company} action={<MatchScore score={match.matchScore} />} />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONES[match.status]}>{OPPORTUNITY_STATUS_LABELS[match.status]}</Badge>
              <Badge>{OPPORTUNITY_TYPE_LABELS[match.type]}</Badge>
              {match.isHidden && (
                <Badge tone="primary">
                  <Radar className="size-3" aria-hidden />
                  Hidden opportunity
                </Badge>
              )}
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Building className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <dt className="sr-only">Company</dt>
                <dd>{match.company}</dd>
              </div>
              {(match.location || match.remote) && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Location</dt>
                  <dd>{[match.location, match.remote ? 'remote possible' : null].filter(Boolean).join(' · ')}</dd>
                </div>
              )}
              {match.startsAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Date</dt>
                  <dd>{formatDateTime(match.startsAt)}</dd>
                </div>
              )}
              {match.contact && (
                <div className="flex items-center gap-2">
                  <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Contact</dt>
                  <dd>
                    {match.contact.url ? (
                      <a href={match.contact.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {match.contact.name ?? 'Contact'}
                      </a>
                    ) : (
                      (match.contact.name ?? match.contact.email)
                    )}
                    {match.contact.role ? `, ${match.contact.role}` : ''}
                  </dd>
                </div>
              )}
              {match.companyWebsite && (
                <div className="flex items-center gap-2">
                  <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Website</dt>
                  <dd>
                    <a href={match.companyWebsite} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {new URL(match.companyWebsite).hostname.replace(/^www\./, '')}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            {match.description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{match.description}</p>}

            {match.requiredSkills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {match.requiredSkills.map((skill) => (
                  <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <MatchActions matchId={match.id} status={match.status} outreachStatus={match.outreachStatus} />
              <a
                href={match.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View original
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </div>
          </Card>

          <Card>
            <CardHeader title="Why this fits you" description="How your agent matched this to your profile." />
            {match.matchReasons.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {match.matchReasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No specific reasons were recorded for this match.</p>
            )}
            {match.signals.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="size-4 text-muted-foreground" aria-hidden />
                  Why now
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  {match.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-5 text-xs text-muted-foreground">
              Found via {OPPORTUNITY_SOURCE_LABELS[match.source]} on {formatShortDate(match.discoveredAt)}
            </p>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader title="Reach out" description="Take the first step. A personal email, ready in seconds." />
          <OutreachPanel
            key={`${outreach?.id ?? 'none'}-${outreach?.updatedAt ?? ''}-${outreach?.status ?? ''}`}
            matchId={match.id}
            company={match.company}
            contact={match.contact}
            outreach={outreach}
            automationLevel={profile?.automationLevel ?? 1}
            canSend={features.canSendEmail}
            sendLocked={!billing.automationsUnlocked}
            aiEnabled={features.ai}
          />
        </Card>
      </div>
    </>
  );
}
