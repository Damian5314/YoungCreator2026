import { Building, FileText, Radar } from 'lucide-react';

const features = [
  {
    icon: Radar,
    title: 'Hidden Opportunity Radar',
    text: 'Finds companies that haven’t posted a vacancy yet, but — based on growth, new projects, adjacent roles and tech stack — probably need someone like you.',
  },
  {
    icon: FileText,
    title: 'One profile, every opportunity',
    text: 'Upload your CV and preferences once. We automatically search for jobs, internships, traineeships, thesis projects, working-student roles and open applications — including at smaller companies that only advertise on their own site.',
  },
  {
    icon: Building,
    title: 'Autonomous Company Hunter',
    text: 'No need to give us a list of companies. The agent keeps discovering new companies, visits their career pages and only reaches out when there’s something worth your time.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Features</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What it does for you</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
