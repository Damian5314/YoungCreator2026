import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getLocale, getT } from '@/i18n/server';
import type { SearchRunData } from '@/lib/data/queries';
import { formatDateTime } from '@/shared/utils/formatDate';

// Wat de agent de laatste keren gedaan heeft (handmatig en gepland)
export async function RecentRuns({ runs }: { runs: SearchRunData[] }) {
  if (runs.length === 0) return null;
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const r = t.search.recentRuns;

  return (
    <Card>
      <CardHeader title={r.title} description={r.description} />
      <ul className="space-y-3 text-sm">
        {runs.map((run) => (
          <li key={run.id} className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-medium">
                {formatDateTime(new Date(run.createdAt), locale)}
                <span className="font-normal text-muted-foreground"> · {r.triggers[run.trigger]}</span>
              </span>
              <span className="block text-muted-foreground">
                {run.status === 'completed' && r.resultSummary(run.newResults, run.resultsFound)}
                {run.status === 'failed' && t.search.engine.failedRefunded}
                {(run.status === 'queued' || run.status === 'running') && r.working}
              </span>
            </span>
            <StatusBadge kind="run" status={run.status}>
              {r.statuses[run.status]}
            </StatusBadge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
