import Link from 'next/link';
import { ArrowLeft, ArrowRight, Globe, Lightbulb, Mail, Radar, Sparkles } from 'lucide-react';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { MatchScore, OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { intlLocale } from '@/i18n/config';
import { getLocale, getT } from '@/i18n/server';
import { activityForCompany, type ActivityItem } from '@/modules/activity/activity';
import { companyMeta, reachOutHref, sharedSkills, type CompanySummary } from '@/modules/companies/companies';
import { CompanyActions } from './CompanyActions';
import { CompanyMark } from './CompanyMark';
import { SignalCard } from './SignalCard';

interface CompanyDetailProps {
  company: CompanySummary;
  activity: ActivityItem[];
  studentSkills: string[];
}

// Eén bedrijf: waarom het bij je past, wat het doet (signalen), wat je er kunt doen en hoe je het benadert
export async function CompanyDetail({ company, activity, studentSkills }: CompanyDetailProps) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const c = t.companies;
  const d = c.detail;
  const best = company.opportunities[0];
  const reasonByOpportunity = new Map(company.opportunities.map((o) => [o.id, o.matchReasons[0]]));

  // Invalshoek voor een bericht: jouw skills die dit bedrijf zoekt + hun laatste nieuws
  const skills = new Intl.ListFormat(intlLocale[locale], { type: 'conjunction' }).format(
    sharedSkills(company, studentSkills).slice(0, 2),
  );
  const signal = company.signals[0]?.text;
  const angle =
    skills && signal
      ? d.angle.withSkillsAndSignal(skills, signal)
      : signal
        ? d.angle.withSignal(signal)
        : skills
          ? d.angle.withSkills(skills)
          : d.angle.generic;

  return (
    <>
      <Link href="/companies" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        {d.back}
      </Link>

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <CompanyMark name={company.name} size="lg" />
          <div className="min-w-0">
            <h1 className="wrap-break-word text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{company.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
              <span>{companyMeta(company, company.type ? c.types[company.type] : undefined)}</span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Globe className="size-3.5" aria-hidden />
                  <span className="sr-only">{d.website}: </span>
                  {new URL(company.website).hostname.replace(/^www\./, '')}
                </a>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <MatchScore score={company.fitScore} label={c.fit} />
          <div className="flex flex-wrap items-center gap-2">
            <CompanyActions company={company} />
            <ButtonLink href={reachOutHref(company)} variant="secondary" size="sm">
              <Mail className="size-4" aria-hidden />
              {c.card.reachOut}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title={d.why.title} description={d.why.description} />
            {best.matchReasons.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {best.matchReasons.slice(0, 3).map((reason) => (
                  <li key={reason} className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">{c.card.fallbackWhy(company.opportunities.length)}</p>
            )}
            {company.hasHidden && (
              <p className="mt-4">
                <Badge tone="primary">
                  <Radar className="size-3" aria-hidden />
                  {t.matches.card.hiddenOpportunity}
                </Badge>
              </p>
            )}
          </Card>

          <Card>
            <CardHeader title={d.signals.title} description={d.signals.description} />
            {company.signals.length > 0 ? (
              <div className="space-y-3">
                {company.signals.map((item) => (
                  <SignalCard key={item.text} signal={item} relevance={reasonByOpportunity.get(item.opportunityId)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{d.signals.empty}</p>
            )}
          </Card>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              {d.opportunities.title}{' '}
              <span className="font-normal text-muted-foreground">({company.opportunities.length})</span>
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">{d.opportunities.description}</p>
            <div className="space-y-3">
              {company.opportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <Card>
            <CardHeader title={d.angle.title} description={d.angle.description} />
            <p className="flex items-start gap-2 rounded-lg bg-primary-soft p-3 text-sm text-primary-soft-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
              {angle}
            </p>
            <ButtonLink href={reachOutHref(company)} size="sm" className="mt-4 w-full">
              {d.angle.cta}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </Card>
          <Card>
            <CardHeader title={t.activity.title} />
            <ActivityFeed items={activityForCompany(activity, company.id)} limit={6} empty={d.activity.empty} />
          </Card>
        </aside>
      </div>
    </>
  );
}
