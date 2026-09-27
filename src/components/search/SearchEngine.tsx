'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, FlaskConical, LoaderCircle, Search, TriangleAlert } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { Switch } from '@/components/ui/Switch';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { startSearch } from '@/lib/actions/search';
import type { SearchRunData } from '@/lib/data/queries';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';
import type { Opportunity } from '@/shared/types/Opportunity';

type Phase = 'idle' | 'starting' | 'running' | 'done' | 'failed';

const POLL_MS = 2000;
const GIVE_UP_MS = 10 * 60 * 1000; // daarna verschijnen resultaten gewoon later op het dashboard

// JSON heeft geen Date: datums weer omzetten
type OpportunityJson = Omit<Opportunity, 'startsAt' | 'postedAt' | 'discoveredAt'> & {
  startsAt?: string;
  postedAt?: string;
  discoveredAt: string;
};

function reviveOpportunity(o: OpportunityJson): Opportunity {
  return {
    ...o,
    startsAt: o.startsAt ? new Date(o.startsAt) : undefined,
    postedAt: o.postedAt ? new Date(o.postedAt) : undefined,
    discoveredAt: new Date(o.discoveredAt),
  };
}

interface SearchEngineProps {
  credits: number;
  defaultIncludeRadar: boolean;
  defaultIncludeCompanyHunter: boolean;
  demoMode: boolean;
}

// Stap 2 van de search flow: de agent aan het werk zetten en de voortgang volgen
export function SearchEngine({ credits, defaultIncludeRadar, defaultIncludeCompanyHunter, demoMode }: SearchEngineProps) {
  const router = useRouter();
  const [includeHidden, setIncludeHidden] = useState(defaultIncludeRadar);
  const [includeHunting, setIncludeHunting] = useState(defaultIncludeCompanyHunter);
  const [phase, setPhase] = useState<Phase>('idle');
  const [runId, setRunId] = useState<string | null>(null);
  const [run, setRun] = useState<SearchRunData | null>(null);
  const [results, setResults] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tookTooLong, setTookTooLong] = useState(false);

  const busy = phase === 'starting' || phase === 'running';

  async function runSearch() {
    setPhase('starting');
    setError(null);
    setResults([]);
    setRun(null);
    setTookTooLong(false);

    const response = await startSearch({ includeHidden, includeHunting });
    if (!response.runId) {
      setError(response.error ?? 'Something went wrong.');
      setPhase('idle');
      return;
    }
    setRunId(response.runId);
    setPhase('running');
  }

  // Status van de run ophalen tot hij klaar (of mislukt) is
  useEffect(() => {
    if (phase !== 'running' || !runId) return;
    const startedAt = Date.now();
    let cancelled = false;

    const timer = setInterval(async () => {
      if (Date.now() - startedAt > GIVE_UP_MS) {
        clearInterval(timer);
        setTookTooLong(true);
        return;
      }
      try {
        const response = await fetch(`/api/search/runs/${runId}`, { cache: 'no-store' });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as { run: SearchRunData; results: OpportunityJson[] };
        setRun(data.run);
        if (data.run.status === 'completed') {
          clearInterval(timer);
          setResults(data.results.map(reviveOpportunity));
          setPhase('done');
          router.refresh();
        } else if (data.run.status === 'failed') {
          clearInterval(timer);
          setError(data.run.errorMessage ?? 'The search failed. Your credit was refunded.');
          setPhase('failed');
          router.refresh();
        }
      } catch {
        // netwerkhapering: volgende poll probeert het opnieuw
      }
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [phase, runId, router]);

  const steps = [
    { label: 'Search started', state: phase === 'starting' ? 'active' : 'done' },
    {
      label: demoMode
        ? 'Loading demo opportunities (n8n isn’t connected yet)'
        : 'Your agent is searching job boards, career pages, events and company news',
      state: phase === 'starting' ? 'pending' : phase === 'running' ? 'active' : phase === 'failed' ? 'failed' : 'done',
    },
    {
      label: 'Scoring matches and preparing emails for the best ones',
      state: phase === 'done' ? 'done' : phase === 'failed' ? 'pending' : phase === 'running' ? 'active' : 'pending',
    },
  ] as const;

  const alreadyKnown = run ? Math.max(0, run.resultsFound - run.newResults) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Run a search"
          description="Your agent looks for jobs, events, hackathons, startups and projects that fit you."
        />
        {demoMode && (
          <p className="mb-5 flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
            <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
            Demo mode: n8n isn&apos;t connected yet, so searches return sample opportunities scored against your real profile.
          </p>
        )}
        <div className="space-y-4">
          <Switch
            id="include-hidden"
            label="Hidden opportunity radar"
            description="Find companies that probably need you before they post a vacancy."
            checked={includeHidden}
            onChange={setIncludeHidden}
            disabled={busy}
          />
          <Switch
            id="include-hunting"
            label="Company hunter"
            description="Check the career pages of companies we monitor for you."
            checked={includeHunting}
            onChange={setIncludeHunting}
            disabled={busy}
          />
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Costs {CREDIT_COST_PER_SEARCH} credit · You have {credits} {credits === 1 ? 'credit' : 'credits'}
          </p>
          <Button size="lg" onClick={runSearch} disabled={busy || credits < CREDIT_COST_PER_SEARCH}>
            {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
            {busy ? 'Searching…' : phase === 'done' || phase === 'failed' ? 'Search again' : 'Search'}
          </Button>
        </div>
        {credits < CREDIT_COST_PER_SEARCH && !busy && (
          <p className="mt-3 text-sm text-muted-foreground">You&apos;re out of credits.</p>
        )}
        {error && phase === 'idle' && (
          <div className="mt-4">
            <FormMessage state={{ error }} />
          </div>
        )}
      </Card>

      {phase !== 'idle' && (
        <Card>
          <ol className="space-y-3" aria-live="polite">
            {steps.map((step) => (
              <li key={step.label} className="flex items-center gap-3 text-sm">
                {step.state === 'done' && (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                )}
                {step.state === 'active' && (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
                  </span>
                )}
                {step.state === 'failed' && (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
                    <TriangleAlert className="size-3.5" aria-hidden />
                  </span>
                )}
                {step.state === 'pending' && <span className="size-6 shrink-0 rounded-full border border-border" />}
                <span className={step.state === 'pending' ? 'text-muted-foreground' : 'font-medium'}>{step.label}</span>
              </li>
            ))}
          </ol>
          {phase === 'failed' && error && (
            <div className="mt-4">
              <FormMessage state={{ error }} />
            </div>
          )}
          {tookTooLong && phase === 'running' && (
            <p className="mt-4 text-sm text-muted-foreground">
              This is taking longer than usual. You can leave this page; new results will show up on your dashboard.
            </p>
          )}
        </Card>
      )}

      {phase === 'done' && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-semibold">
              {results.length} new {results.length === 1 ? 'opportunity' : 'opportunities'}
            </h2>
            <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all in dashboard
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {results.length === 0 ? (
            <Card className="text-center text-sm text-muted-foreground">
              Nothing new this time.
              {alreadyKnown > 0 && ` ${alreadyKnown} ${alreadyKnown === 1 ? 'result was' : 'results were'} already on your dashboard.`}
            </Card>
          ) : (
            <div className="space-y-3">
              {results.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
