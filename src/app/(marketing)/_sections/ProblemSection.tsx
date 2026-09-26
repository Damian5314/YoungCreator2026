import { Hourglass, Layers, Store, Zap } from 'lucide-react';

const painPoints = [
  { icon: Layers, text: 'Hundreds of websites, all searched by hand' },
  { icon: Store, text: 'Small companies only post vacancies on their own website' },
  { icon: Zap, text: 'By the time you spot an opportunity, others are already on it' },
  { icon: Hourglass, text: 'The clock is ticking. Every day counts.' },
];

// S: alleen verantwoordelijk voor het emotionele verhaal op de landingspagina
export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-16 border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">The problem</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Twelve months. Then you have to go back.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            After graduating, international students in the Netherlands get exactly one year to find a
            job through the orientation year (zoekjaar). Not six months. Not two years. Twelve months.
          </p>
          <blockquote className="mt-8 border-l-4 border-primary pl-4 text-lg italic">
            “I applied every single day. LinkedIn, Indeed, company websites — all separately. I missed
            opportunities simply because I never saw them.”
          </blockquote>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {painPoints.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 rounded-xl border border-border bg-background p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="font-medium">{text}</p>
            </div>
          ))}
          <p className="mt-4 text-muted-foreground">
            We understand that pressure. That&apos;s why we built a tool that doesn&apos;t sleep,
            doesn&apos;t forget and never skips a vacancy.
          </p>
        </div>
      </div>
    </section>
  );
}
