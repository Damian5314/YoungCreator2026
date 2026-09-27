import { Briefcase, CalendarDays, Radar, Sparkles, TrendingUp } from 'lucide-react';
import { getT } from '@/i18n/server';
import type { Opportunity } from '@/shared/types/Opportunity';

const DAY_MS = 24 * 60 * 60 * 1000;

interface StatsRowProps {
  opportunities: Opportunity[];
  searchYearEndsOn: string | null; // 'YYYY-MM-DD', leeg zolang de gebruiker het niet heeft ingevuld
}

// Vier kerncijfers, allemaal uit je echte data. "Deze week" = gevonden in de afgelopen 7 dagen.
export async function StatsRow({ opportunities, searchYearEndsOn }: StatsRowProps) {
  const t = await getT();
  const now = Date.now();
  const daysLeft = searchYearEndsOn
    ? Math.max(0, Math.ceil((new Date(searchYearEndsOn).getTime() - now) / DAY_MS))
    : '—';
  const thisWeek = (list: Opportunity[]) => list.filter((o) => now - o.discoveredAt.getTime() < 7 * DAY_MS).length;
  const fresh = opportunities.filter((o) => o.status === 'new');
  const hidden = opportunities.filter((o) => o.isHidden);

  const stats = [
    { label: t.dashboard.stats.found, value: opportunities.length, icon: Briefcase, trend: thisWeek(opportunities) },
    { label: t.dashboard.stats.newSinceLast, value: fresh.length, icon: Sparkles, trend: 0 },
    { label: t.dashboard.stats.hidden, value: hidden.length, icon: Radar, trend: thisWeek(hidden) },
    { label: t.dashboard.stats.daysLeft, value: daysLeft, icon: CalendarDays, trend: 0, highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, trend, highlight }, index) => (
        <div
          key={label}
          className={`rounded-card border p-4 shadow-[0_1px_2px_rgb(16_24_32/0.04)] motion-safe:animate-fade-up sm:px-5 sm:py-4 ${
            highlight ? 'border-[#DDEBC4] bg-[#F2F8E7]' : 'border-[rgb(16_24_32/0.08)] bg-card'
          }`}
          style={{ animationDelay: `${80 + index * 70}ms` }}
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={`grid size-9 place-items-center rounded-full ${highlight ? 'bg-white text-primary' : 'bg-[#EAF7EF] text-primary'}`}
            >
              <Icon className="size-[18px]" aria-hidden />
            </span>
            {trend > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <TrendingUp className="size-3.5" aria-hidden />
                {t.dashboard.home.thisWeek(trend)}
              </span>
            )}
          </div>
          <p className="mt-2.5 text-3xl font-bold tracking-[-0.03em] tabular-nums">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
