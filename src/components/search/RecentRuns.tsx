import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import type { RunStatus, SearchRunData } from '@/lib/data/queries';
import { formatDateTime } from '@/shared/utils/formatDate';

const STATUS: Record<RunStatus, { label: string; tone: BadgeTone }> = {
  queued: { label: 'Queued', tone: 'neutral' },
  running: { label: 'Running', tone: 'primary' },
  completed: { label: 'Done', tone: 'success' },
  failed: { label: 'Failed', tone: 'warning' },
};

// Wat de agent de laatste keren gedaan heeft (handmatig en gepland)
export function RecentRuns({ runs }: { runs: SearchRunData[] }) {
  if (runs.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Recent searches" description="Manual and scheduled runs of your agent." />
      <ul className="space-y-3 text-sm">
        {runs.map((run) => (
          <li key={run.id} className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-medium">
                {formatDateTime(new Date(run.createdAt))}
                <span className="font-normal text-muted-foreground"> · {run.trigger === 'scheduled' ? 'scheduled' : 'manual'}</span>
              </span>
              <span className="block text-muted-foreground">
                {run.status === 'completed' && `${run.newResults} new of ${run.resultsFound} found`}
                {run.status === 'failed' && (run.errorMessage ?? 'Something went wrong')}
                {(run.status === 'queued' || run.status === 'running') && 'Your agent is working on it…'}
              </span>
            </span>
            <Badge tone={STATUS[run.status].tone}>{STATUS[run.status].label}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
