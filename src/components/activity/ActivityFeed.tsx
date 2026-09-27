'use client';

import Link from 'next/link';
import { Mail, Radar, Search, Send, Sparkles, TrendingUp, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useLocale, useT } from '@/i18n/I18nProvider';
import type { ActivityItem, ActivityKind } from '@/modules/activity/activity';
import { formatRelativeDay } from '@/shared/utils/formatDate';

const ICONS: Record<ActivityKind, { icon: LucideIcon; tone: string }> = {
  search_completed: { icon: Search, tone: 'bg-muted text-muted-foreground' },
  search_failed: { icon: TriangleAlert, tone: 'bg-warning-soft text-warning' },
  hidden_opportunity: { icon: Radar, tone: 'bg-primary-soft text-primary-soft-foreground' },
  opportunity_detected: { icon: Sparkles, tone: 'bg-success-soft text-success' },
  signal_detected: { icon: TrendingUp, tone: 'bg-primary-soft text-primary-soft-foreground' },
  draft_created: { icon: Mail, tone: 'bg-warning-soft text-warning' },
  email_sent: { icon: Send, tone: 'bg-success-soft text-success' },
};

interface ActivityFeedProps {
  items: ActivityItem[];
  limit?: number;
  empty?: string;
}

// Tijdlijn van je agent. Dezelfde lijst op het dashboard, de bedrijfspagina en in de meldingen.
export function ActivityFeed({ items, limit, empty }: ActivityFeedProps) {
  const t = useT();
  const a = t.activity.items;
  const locale = useLocale();
  const visible = limit ? items.slice(0, limit) : items;

  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty ?? t.activity.empty}</p>;
  }

  function text(item: ActivityItem): string {
    const company = item.company ?? '';
    switch (item.kind) {
      case 'search_completed':
        return a.search_completed(item.count ?? 0);
      case 'search_failed':
        return a.search_failed;
      default:
        return a[item.kind](company);
    }
  }

  return (
    <ol className="space-y-1">
      {visible.map((item) => {
        const { icon: Icon, tone } = ICONS[item.kind];
        const detail = item.kind === 'signal_detected' ? item.signal : item.title;
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${tone}`}>
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block font-medium leading-snug">{text(item)}</span>
                {detail && <span className="block truncate text-muted-foreground">{detail}</span>}
              </span>
              <time
                dateTime={item.at}
                className="shrink-0 pt-0.5 text-xs text-muted-foreground"
                suppressHydrationWarning
              >
                {formatRelativeDay(new Date(item.at), locale)}
              </time>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
