import { Briefcase, Hourglass, Radar, Sparkles } from 'lucide-react';
import { getT } from '@/i18n/server';
import type { Opportunity } from '@/shared/types/Opportunity';

const DAY_MS = 24 * 60 * 60 * 1000;

interface StatsRowProps {
  opportunities: Opportunity[];
  searchYearEndsOn: string | null; // 'YYYY-MM-DD', leeg zolang de gebruiker het niet heeft ingevuld
}

export async function StatsRow({ opportunities, searchYearEndsOn }: StatsRowProps) {
  const t = await getT();
  const daysLeft = searchYearEndsOn
    ? Math.max(0, Math.ceil((new Date(searchYearEndsOn).getTime() - Date.now()) / DAY_MS))
    : '—';

  const stats = [
    { label: t.dashboard.stats.found, value: opportunities.length, icon: Briefcase },
    { label: t.dashboard.stats.newSinceLast, value: opportunities.filter((o) => o.status === 'new').length, icon: Sparkles },
    { label: t.dashboard.stats.hidden, value: opportunities.filter((o) => o.isHidden).length, icon: Radar },
    { label: t.dashboard.stats.daysLeft, value: daysLeft, icon: Hourglass, highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, highlight }) => (
        <div
          key={label}
          className={`rounded-xl border p-4 shadow-sm ${
            highlight ? 'border-primary/30 bg-primary-soft' : 'border-border bg-card'
          }`}
        >
          <div className={`flex items-start justify-between gap-2 text-sm ${highlight ? 'text-primary-soft-foreground' : 'text-muted-foreground'}`}>
            <span>{label}</span>
            <Icon className="size-4 shrink-0" aria-hidden />
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
      ))}
    </div>
  );
}
