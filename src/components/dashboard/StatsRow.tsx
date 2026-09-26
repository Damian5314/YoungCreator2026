import { Briefcase, Hourglass, Radar, Sparkles } from 'lucide-react';
import type { Opportunity } from '@/shared/types/Opportunity';

const DAY_MS = 24 * 60 * 60 * 1000;

interface StatsRowProps {
  opportunities: Opportunity[];
  searchYearEndsOn: string | null; // 'YYYY-MM-DD', leeg zolang de gebruiker het niet heeft ingevuld
}

export function StatsRow({ opportunities, searchYearEndsOn }: StatsRowProps) {
  const daysLeft = searchYearEndsOn
    ? Math.max(0, Math.ceil((new Date(searchYearEndsOn).getTime() - Date.now()) / DAY_MS))
    : '—';

  const stats = [
    { label: 'Opportunities found', value: opportunities.length, icon: Briefcase },
    { label: 'New since last search', value: opportunities.filter((o) => o.status === 'new').length, icon: Sparkles },
    { label: 'Hidden opportunities', value: opportunities.filter((o) => o.isHidden).length, icon: Radar },
    { label: 'Days left in search year', value: daysLeft, icon: Hourglass, highlight: true },
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
