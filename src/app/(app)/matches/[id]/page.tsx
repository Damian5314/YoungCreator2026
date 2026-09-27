import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  CalendarDays,
  ExternalLink,
  Globe,
  MapPin,
  Radar,
  Sparkles,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { z } from 'zod';
import { CompanyMark } from '@/components/companies/CompanyMark';
import { SignalTag } from '@/components/companies/SignalTag';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MatchActions } from '@/components/opportunities/MatchActions';
import { MatchScore } from '@/components/opportunities/OpportunityCard';
import { OutreachPanel } from '@/components/outreach/OutreachPanel';
import { features } from '@/lib/env';
import { getBillingStatus, getMatch, getOutreachForMatch, getProfile } from '@/lib/data/queries';
import { classifySignal } from '@/modules/signals/signals';
import { getLocale, getT } from '@/i18n/server';
import { formatDateTime, formatShortDate } from '@/shared/utils/formatDate';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.matches.meta.title };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [match, outreach, profile, billing, t, locale] = await Promise.all([
    getMatch(id),
    getOutreachForMatch(id),
    getProfile(),
    getBillingStatus(),
    getT(),
    getLocale(),
  ]);
  if (!match) notFound();
  const d = t.matches.detail;

  return (
    <>
      <Link href="/opportunities" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        {d.allResults}
      </Link>
      <PageHeader
        title={match.title}
        description={match.company}
        action={<MatchScore score={match.matchScore} label={t.matches.score.label} />}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <div className="min-w-0 space-y-6 lg:col-span-3">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge kind="opportunity" status={match.status}>
                {t.common.opportunityStatuses[match.status]}
              </StatusBadge>
              <Badge>{t.common.opportunityTypes[match.type]}</Badge>
              {match.isHidden && (
                <Badge tone="primary">
                  <Radar className="size-3" aria-hidden />
                  {d.hiddenOpportunity}
                </Badge>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Building className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <dt className="sr-only">{d.company}</dt>
                <dd>{match.company}</dd>
              </div>
              {(match.location || match.remote) && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">{d.location}</dt>
                  <dd>{[match.location, match.remote ? d.remotePossible : null].filter(Boolean).join(' · ')}</dd>
                </div>
              )}
              {match.startsAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">{d.date}</dt>
                  <dd>{formatDateTime(match.startsAt, locale)}</dd>
                </div>
              )}
              {match.contact && (
                <div className="flex items-center gap-2">
                  <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">{d.contact}</dt>
                  <dd>
                    {match.contact.url ? (
                      <a href={match.contact.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {match.contact.name ?? d.contact}
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
                  <dt className="sr-only">{d.website}</dt>
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
              <MatchActions matchId={match.id} status={match.status} outreachStatus={match.outreachStatus} layout="inline" />
              <a
                href={match.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {d.viewOriginal}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </div>
          </Card>

          <Card>
            <CardHeader title={d.whyFits.title} description={d.whyFits.description} />
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
              <p className="text-sm text-muted-foreground">{d.noReasons}</p>
            )}
            {match.signals.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="size-4 text-muted-foreground" aria-hidden />
                  {d.whyNow}
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  {match.signals.map((signal) => (
                    <li key={signal} className="flex flex-wrap items-center gap-2">
                      <SignalTag kind={classifySignal(signal)} />
                      <span className="text-muted-foreground">{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-5 text-xs text-muted-foreground">
              {d.foundVia(t.common.opportunitySources[match.source], formatShortDate(match.discoveredAt, locale))}
            </p>
          </Card>

          {/* Van de kans naar het bedrijf: wie zit erachter en wat gebeurt er nog meer */}
          {match.companyId && (
            <Card>
              <div className="flex items-start gap-3">
                <CompanyMark name={match.company} />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{d.aboutCompany(match.company)}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {[match.companyLocation, match.companyIndustry].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <Link
                  href={`/companies/${match.companyId}`}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t.companies.card.viewCompany}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Card>
          )}
        </div>

        <Card id="reach-out" className="scroll-mt-24 lg:col-span-2">
          <CardHeader title={d.reachOut.title} description={d.reachOut.description} />
          <OutreachPanel
            key={`${outreach?.id ?? 'none'}-${outreach?.updatedAt ?? ''}-${outreach?.status ?? ''}`}
            matchId={match.id}
            company={match.company}
            contact={match.contact}
            outreach={outreach}
            automationLevel={profile?.automationLevel ?? 1}
            canSend={features.canSendEmail}
            sendLocked={!billing.automationsUnlocked}
          />
        </Card>
      </div>
    </>
  );
}
