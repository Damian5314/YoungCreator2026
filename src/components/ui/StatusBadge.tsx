import type { ReactNode } from 'react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { RunStatus } from '@/lib/data/queries';
import type { CompanyRelationship } from '@/modules/companies/companies';
import type { OutreachStatus } from '@/shared/types/Opportunity';
import type { OpportunityStatus } from '@/shared/types/OpportunityType';

// Eén plek voor de kleur van elke status, zodat dezelfde status overal dezelfde badge krijgt.
// De tekst staat altijd in de badge: kleur is nooit de enige aanwijzing.
const TONES = {
  opportunity: {
    new: 'success',
    reviewed: 'neutral',
    saved: 'warning',
    applied: 'primary',
    rejected: 'neutral',
  } satisfies Record<OpportunityStatus, BadgeTone>,
  outreach: {
    draft: 'warning',
    failed: 'warning',
    sending: 'primary',
    sent: 'success',
  } satisfies Record<OutreachStatus, BadgeTone>,
  run: {
    queued: 'neutral',
    running: 'primary',
    completed: 'success',
    failed: 'warning',
  } satisfies Record<RunStatus, BadgeTone>,
  company: {
    new: 'neutral',
    saved: 'warning',
    following: 'primary',
    contacted: 'primary',
    replied: 'success',
  } satisfies Record<CompanyRelationship, BadgeTone>,
};

type StatusBadgeProps =
  | { kind: 'opportunity'; status: OpportunityStatus; children: ReactNode }
  | { kind: 'outreach'; status: OutreachStatus; children: ReactNode }
  | { kind: 'run'; status: RunStatus; children: ReactNode }
  | { kind: 'company'; status: CompanyRelationship; children: ReactNode };

export function StatusBadge({ kind, status, children }: StatusBadgeProps) {
  const tones: Record<string, BadgeTone> = TONES[kind];
  return <Badge tone={tones[status]}>{children}</Badge>;
}
