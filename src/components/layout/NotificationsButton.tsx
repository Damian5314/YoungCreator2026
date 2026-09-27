'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { Bell } from 'lucide-react';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { useT } from '@/i18n/I18nProvider';
import type { ActivityItem } from '@/modules/activity/activity';
import { usePopover } from './usePopover';

// Wanneer je de meldingen voor het laatst opende (per apparaat): alles daarna telt als nieuw
const SEEN_KEY = 'unlisted.notifications.seen-at';

function readSeenAt(): number {
  try {
    return Number(window.localStorage.getItem(SEEN_KEY) ?? 0);
  } catch {
    return 0;
  }
}

// Meldingen: rode stip bij nieuwe activiteit, kort overzicht als je de bel opent
export function NotificationsButton() {
  const t = useT();
  const s = t.common.shell;
  const panelId = useId();
  const { open, toggle, rootRef, buttonRef } = usePopover();
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [seenAt, setSeenAt] = useState(Number.POSITIVE_INFINITY); // pas na het laden bekend

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/activity', { cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { items: ActivityItem[] };
      setItems(data.items);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  // Bij het laden van de pagina ophalen (voor de stip) en opnieuw bij elke keer openen
  useEffect(() => {
    setSeenAt(readSeenAt());
    void load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    void load();
    const now = Date.now();
    try {
      window.localStorage.setItem(SEEN_KEY, String(now));
    } catch {
      // niet onthouden kan geen kwaad: de stip komt dan gewoon terug
    }
    setSeenAt(now);
  }, [open, load]);

  const unread = !open && (items ?? []).some((item) => Date.parse(item.at) > seenAt);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={unread ? `${s.notifications} (${s.unread})` : s.notifications}
        aria-expanded={open}
        aria-controls={panelId}
        className={`relative grid size-10 place-items-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          open ? 'bg-[#F5F6F4] text-foreground' : 'text-[#52615C] hover:bg-[#F5F6F4] hover:text-foreground'
        }`}
      >
        <Bell className="size-[18px]" aria-hidden />
        {unread && <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-[#E5484D] ring-2 ring-white" />}
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-label={s.notificationsTitle}
          className="fixed inset-x-4 top-16 z-40 max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[rgb(16_24_32/0.08)] bg-white p-4 shadow-float sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96"
        >
          <p className="mb-2 text-sm font-semibold">{s.notificationsTitle}</p>
          {failed ? (
            <p className="text-sm text-muted-foreground">{s.notificationsError}</p>
          ) : items === null ? (
            <p className="text-sm text-muted-foreground">{s.loading}</p>
          ) : (
            <ActivityFeed items={items} limit={6} empty={s.notificationsEmpty} />
          )}
        </div>
      )}
    </div>
  );
}
