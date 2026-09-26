'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, LoaderCircle, Search } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';
import { mockOpportunities } from '@/shared/mocks/mockData';
import type { Opportunity } from '@/shared/types/Opportunity';

type Phase = 'idle' | 'running' | 'done';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface SearchEngineProps {
  credits: number;
  defaultIncludeRadar: boolean;
  defaultIncludeCompanyHunter: boolean;
}

// Stap 2 van de search flow: de search engine zelf (de run is nog nagespeeld met mock-data)
export function SearchEngine({ credits, defaultIncludeRadar, defaultIncludeCompanyHunter }: SearchEngineProps) {
  const [includeHidden, setIncludeHidden] = useState(defaultIncludeRadar);
  const [includeHunting, setIncludeHunting] = useState(defaultIncludeCompanyHunter);
  const [phase, setPhase] = useState<Phase>('idle');
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<Opportunity[]>([]);

  const running = phase === 'running';

  async function runSearch() {
    const plannedSteps = [
      'Starting n8n workflow',
      'Scraping LinkedIn, Indeed & Glassdoor via Apify',
      ...(includeHunting ? ['Checking career pages of companies we monitor'] : []),
      ...(includeHidden ? ['Scanning growth signals for hidden opportunities'] : []),
      'Scoring matches against your profile',
    ];
    setSteps(plannedSteps);
    setResults([]);
    setPhase('running');

    // TODO: vervangen door echte call naar de n8n webhook (via POST /api/search). Nu nagespeeld.
    for (let i = 0; i < plannedSteps.length; i++) {
      setCurrentStep(i);
      await wait(900);
    }

    setResults(
      mockOpportunities
        .filter((o) => includeHidden || !o.isHidden)
        .filter((o) => includeHunting || o.source !== 'company-career-page')
        .sort((a, b) => b.matchScore - a.matchScore),
    );
    setCurrentStep(plannedSteps.length);
    setPhase('done');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Run a search"
          description="We search every source at once, based on your situation and preferences."
        />
        <div className="space-y-4">
          <Switch
            id="include-hidden"
            label="Hidden opportunity radar"
            description="Find companies that probably need you before they post a vacancy."
            checked={includeHidden}
            onChange={setIncludeHidden}
            disabled={running}
          />
          <Switch
            id="include-hunting"
            label="Company hunter"
            description="Check the career pages of companies we monitor for you."
            checked={includeHunting}
            onChange={setIncludeHunting}
            disabled={running}
          />
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Costs {CREDIT_COST_PER_SEARCH} credit · You have {credits} {credits === 1 ? 'credit' : 'credits'}
          </p>
          <Button size="lg" onClick={runSearch} disabled={running}>
            {running ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Search className="size-4" aria-hidden />
            )}
            {running ? 'Searching…' : phase === 'done' ? 'Search again' : 'Search'}
          </Button>
        </div>
      </Card>

      {phase !== 'idle' && (
        <Card>
          <ol className="space-y-3" aria-live="polite">
            {steps.map((step, i) => {
              const state = i < currentStep ? 'done' : i === currentStep && running ? 'active' : 'pending';
              return (
                <li key={step} className="flex items-center gap-3 text-sm">
                  {state === 'done' && (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                  )}
                  {state === 'active' && (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                      <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
                    </span>
                  )}
                  {state === 'pending' && <span className="size-6 shrink-0 rounded-full border border-border" />}
                  <span className={state === 'pending' ? 'text-muted-foreground' : 'font-medium'}>{step}</span>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      {phase === 'done' && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-semibold">{results.length} opportunities found</h2>
            <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all in dashboard
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="space-y-3">
            {results.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
