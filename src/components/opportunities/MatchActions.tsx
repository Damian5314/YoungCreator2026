'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Mail, ThumbsDown } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { setMatchStatus } from '@/lib/actions/matches';
import type { OutreachStatus } from '@/shared/types/Opportunity';
import type { OpportunityStatus } from '@/shared/types/OpportunityType';

interface MatchActionsProps {
  matchId: string;
  status: OpportunityStatus;
  outreachStatus?: OutreachStatus;
}

// Snelle acties onder een kans: bewaren, niet interessant, e-mail
export function MatchActions({ matchId, status: initialStatus, outreachStatus }: MatchActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();
  const t = useT();
  const a = t.matches.actions;

  function update(next: OpportunityStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await setMatchStatus(matchId, next);
      if (result.error) setStatus(previous);
    });
  }

  const saved = status === 'saved';
  const rejected = status === 'rejected';

  return (
    // Mobiel: hoofdactie over de volle breedte, daaronder twee even brede knoppen (goed tikbaar)
    <div className="grid w-full grid-cols-2 gap-1.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
      <Link
        href={`/matches/${matchId}`}
        className="col-span-2 flex h-10 items-center justify-center gap-1.5 rounded-lg bg-action px-3 text-sm font-medium text-action-foreground transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-8 sm:justify-start sm:text-xs"
      >
        <Mail className="size-3.5" aria-hidden />
        {outreachStatus ? a.outreachStatus[outreachStatus] : a.reachOut}
      </Link>
      <button
        type="button"
        onClick={() => update(saved ? 'reviewed' : 'saved')}
        disabled={pending}
        aria-pressed={saved}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 sm:h-8 sm:border-0 sm:text-xs"
      >
        {saved ? <BookmarkCheck className="size-3.5 text-warning" aria-hidden /> : <Bookmark className="size-3.5" aria-hidden />}
        {saved ? t.common.actions.saved : t.common.actions.save}
      </button>
      <button
        type="button"
        onClick={() => update(rejected ? 'reviewed' : 'rejected')}
        disabled={pending}
        aria-pressed={rejected}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 sm:h-8 sm:border-0 sm:text-xs"
      >
        <ThumbsDown className="size-3.5" aria-hidden />
        {rejected ? a.undo : a.notForMe}
      </button>
    </div>
  );
}
