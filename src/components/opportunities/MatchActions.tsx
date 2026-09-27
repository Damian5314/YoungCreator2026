'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { setMatchStatus } from '@/lib/actions/matches';
import type { OutreachStatus } from '@/shared/types/Opportunity';
import type { OpportunityStatus } from '@/shared/types/OpportunityType';

interface MatchActionsProps {
  matchId: string;
  status: OpportunityStatus;
  outreachStatus?: OutreachStatus;
  // card: vanaf sm gestapeld in de rechterkolom van een kaart; inline: altijd naast elkaar (detailpagina)
  layout?: 'card' | 'inline';
}

/**
 * Drie acties onder of naast een kans: bewaren (bladwijzer), contact opnemen (hoofdactie)
 * en "niet voor mij" (rustig). Op telefoons op één rij; in een kaart vanaf sm gestapeld aan de rechterkant.
 */
export function MatchActions({ matchId, status: initialStatus, outreachStatus, layout = 'card' }: MatchActionsProps) {
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
    <div className={`flex flex-wrap items-center gap-2 ${layout === 'card' ? 'sm:flex-col sm:items-end' : ''}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => update(saved ? 'reviewed' : 'saved')}
          disabled={pending}
          aria-pressed={saved}
          aria-label={saved ? t.common.actions.saved : t.common.actions.save}
          title={saved ? t.common.actions.saved : t.common.actions.save}
          className={`grid size-10 place-items-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
            saved
              ? 'border-selected-border bg-selected text-primary'
              : 'border-border bg-card text-[#52615C] hover:bg-[#F5F6F4] hover:text-foreground'
          }`}
        >
          {saved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
        </button>
        <Link
          href={`/matches/${matchId}#reach-out`}
          className="group inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-xl bg-action px-4 text-sm font-semibold text-action-foreground transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {outreachStatus ? a.outreachStatus[outreachStatus] : a.reachOut}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
      <button
        type="button"
        onClick={() => update(rejected ? 'reviewed' : 'rejected')}
        disabled={pending}
        aria-pressed={rejected}
        className="rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
      >
        {rejected ? a.undo : a.notForMe}
      </button>
    </div>
  );
}
