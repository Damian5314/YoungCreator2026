'use client';

import { Bell, BellRing, Bookmark, BookmarkCheck } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import type { CompanySummary } from '@/modules/companies/companies';
import { isCompanySaved, useCompanyRelations } from './useCompanyRelations';

const toggle =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// Bedrijf opslaan en volgen (aan/uit). Dezelfde knoppen op de kaart en op de bedrijfspagina.
export function CompanyActions({ company }: { company: CompanySummary }) {
  const t = useT().companies.card;
  const { relations, set } = useCompanyRelations();
  const local = relations[company.id];
  const saved = isCompanySaved(company, local);
  const following = Boolean(local?.following);

  return (
    <>
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => set(company.id, 'saved', !saved)}
        className={`${toggle} ${
          saved
            ? 'border-selected-border bg-selected text-selected-foreground'
            : 'border-border bg-card text-muted-foreground hover:text-foreground'
        }`}
      >
        {saved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
        {saved ? t.saved : t.save}
      </button>
      <button
        type="button"
        aria-pressed={following}
        onClick={() => set(company.id, 'following', !following)}
        className={`${toggle} ${
          following
            ? 'border-selected-border bg-selected text-selected-foreground'
            : 'border-border bg-card text-muted-foreground hover:text-foreground'
        }`}
      >
        {following ? <BellRing className="size-4" aria-hidden /> : <Bell className="size-4" aria-hidden />}
        {following ? t.following : t.follow}
      </button>
    </>
  );
}
