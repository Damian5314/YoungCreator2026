import { ArrowRight, Hourglass, Radar } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import { mockOpportunities } from '@/shared/mocks/mockData';

const topMatches = [...mockOpportunities].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-soft-foreground">
        <Hourglass className="size-3.5" aria-hidden />
        Built for international graduates in the Netherlands
      </span>
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
        Find your job before the clock runs out
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        Upload your CV once. We keep searching for vacancies, internships, traineeships and hidden
        opportunities — across every platform at the same time.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/register" size="lg">
          Start for free
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <ButtonLink href="#problem" variant="secondary" size="lg">
          Why JobHunter?
        </ButtonLink>
      </div>

      {/* Voorproefje van het dashboard, met dezelfde mock-data */}
      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/5">
        <div className="rounded-xl border border-border bg-background p-4 text-left sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">Today&apos;s top matches</p>
            <Badge tone="primary">
              <Hourglass className="size-3" aria-hidden />
              11 months left in your search year
            </Badge>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {topMatches.map((opportunity) => (
              <li key={opportunity.id} className="flex items-center gap-4 py-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-success-soft text-sm font-bold text-success">
                  {opportunity.matchScore}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{opportunity.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {opportunity.company} · {opportunity.location}
                  </p>
                </div>
                <span className="hidden sm:block">
                  {opportunity.isHidden ? (
                    <Badge tone="primary">
                      <Radar className="size-3" aria-hidden />
                      Hidden opportunity
                    </Badge>
                  ) : (
                    <Badge>{OPPORTUNITY_TYPE_LABELS[opportunity.type]}</Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
