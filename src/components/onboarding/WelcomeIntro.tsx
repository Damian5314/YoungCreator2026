'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Radar, Send, Sparkles, UserRound, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { completeIntro } from '@/lib/actions/onboarding';

interface WelcomeIntroProps {
  firstName: string | null;
  credits: number;
  demoMode: boolean;
}

interface IntroStep {
  icon: LucideIcon;
  title: string;
  body: ReactNode;
  note?: string;
  where?: string;
}

// Hier vult een nieuwe gebruiker zijn profiel in; de laatste knop stuurt ernaartoe
const PROFILE_PATH = '/search/preferences';

/**
 * Korte uitleg na de eerste keer inloggen: wat de agent doet en waar alles staat.
 * Native <dialog> (focus-trap en Esc zitten er standaard in). Sluiten op welke manier dan ook
 * telt als "gezien", zodat de introductie niet blijft terugkomen.
 */
export function WelcomeIntro({ firstName, credits, demoMode }: WelcomeIntroProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const saved = useRef(false);
  const [step, setStep] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const steps: IntroStep[] = [
    {
      icon: Sparkles,
      title: firstName ? `Welcome, ${firstName}! Meet your opportunity agent.` : 'Welcome! Meet your opportunity agent.',
      body: 'Job Hunter finds jobs, internships, events and hidden opportunities in the Netherlands, and tells you why each one fits you. Here’s how it works in three steps.',
      note: credits > 0 ? `You have ${credits} free credits to get started.` : undefined,
    },
    {
      icon: UserRound,
      title: 'Tell your agent who you are',
      body: 'Add your situation, skills and interests, and upload your CV. The better your agent knows you, the sharper your matches get.',
      where: 'Search → Preferences',
    },
    {
      icon: Radar,
      title: 'Let it hunt for you',
      body: 'Each search costs 1 credit. Your agent scans job boards, events and company news for signals like funding or a new office, often before a vacancy is even posted. Schedule a daily or weekly search to keep it running on autopilot.',
      note: demoMode ? 'Demo mode: searches return sample opportunities, scored against your real profile.' : undefined,
      where: 'Search · Dashboard',
    },
    {
      icon: Send,
      title: 'Review your matches and reach out',
      body: 'Every opportunity gets a match score from 0 to 100, with the reasons it fits you. For strong matches your agent drafts a short, personal email. You review, edit and send it, and you decide how independent your agent is.',
      where: 'Dashboard · Outreach · Settings',
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current.icon;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Focus op de kop (niet op het sluitkruisje): screenreaders lezen bij elke stap de nieuwe titel voor
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function markSeen() {
    if (saved.current) return;
    saved.current = true;
    void completeIntro();
  }

  function finish() {
    dialogRef.current?.close();
    if (pathname !== PROFILE_PATH) router.push(PROFILE_PATH);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="welcome-intro-title"
      onClose={markSeen}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-panel border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close introduction"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" aria-hidden />
        </button>

        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {step === 0 ? 'Getting started' : `Step ${step} of ${steps.length - 1}`}
        </p>

        {/* key: bij elke stap opnieuw inkomen (alleen zonder 'reduce motion') */}
        <div key={step} className="motion-safe:animate-[rise_0.4s_var(--ease-soft)_both]">
          <span className="mt-5 grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
            <Icon className="size-6" aria-hidden />
          </span>
          <h2
            ref={headingRef}
            id="welcome-intro-title"
            tabIndex={-1}
            className="mt-5 text-balance text-2xl font-semibold tracking-tight focus:outline-none"
          >
            {current.title}
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{current.body}</p>

          {current.note && (
            <p className="mt-4 rounded-lg bg-primary-soft px-3 py-2 text-sm font-medium text-primary-soft-foreground">
              {current.note}
            </p>
          )}
          {current.where && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              <span>
                <span className="sr-only">Where to find it: </span>
                {current.where}
              </span>
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {steps.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setStep(index)}
                aria-label={index === 0 ? 'Go to welcome' : `Go to step ${index}`}
                aria-current={index === step ? 'step' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/25 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step === 0 ? (
              <Button variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
                Skip
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="size-4" aria-hidden />
                Back
              </Button>
            )}
            {isLast ? (
              <Button size="sm" onClick={finish}>
                {pathname === PROFILE_PATH ? 'Let’s go' : 'Set up my profile'}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setStep(step + 1)}>
                {step === 0 ? 'Show me how' : 'Next'}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
