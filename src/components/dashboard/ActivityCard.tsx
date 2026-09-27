'use client';

import { useState } from 'react';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { Card } from '@/components/ui/Card';
import { useT } from '@/i18n/I18nProvider';
import type { ActivityItem } from '@/modules/activity/activity';

const COLLAPSED = 5;
const EXPANDED = 15;

// Recente activiteit in de zijkolom van het dashboard; "View all" klapt de lijst uit (geen aparte pagina)
export function ActivityCard({ items }: { items: ActivityItem[] }) {
  const t = useT();
  const h = t.dashboard.home;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-semibold tracking-tight">{t.activity.title}</h2>
        {items.length > COLLAPSED && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {expanded ? h.activityShowLess : `${h.activityViewAll} →`}
          </button>
        )}
      </div>
      <ActivityFeed items={items} limit={expanded ? EXPANDED : COLLAPSED} />
    </Card>
  );
}
