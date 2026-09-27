'use client';

import { useId } from 'react';
import Link from 'next/link';
import { ChevronDown, Coins, LogOut, Settings, UserRound } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { logout } from '@/lib/actions/auth';
import { usePopover } from './usePopover';

const item =
  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#F5F6F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// Avatar met accountmenu: profiel & zoekvoorkeuren, Settings, credits en uitloggen
export function AvatarMenu({ name, email }: { name: string; email: string }) {
  const t = useT();
  const s = t.common.shell;
  const panelId = useId();
  const { open, toggle, close, rootRef, buttonRef } = usePopover();
  const initials =
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .join('')
      .slice(0, 2) || '?';

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={s.accountMenu}
        aria-expanded={open}
        aria-controls={panelId}
        title={name}
        className="flex items-center gap-1 rounded-full p-0.5 transition-colors sm:pr-1.5 hover:bg-[#F5F6F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="grid size-9 place-items-center rounded-full bg-[#EAF7EF] text-xs font-bold text-primary">{initials}</span>
        <ChevronDown className={`hidden size-4 text-[#52615C] transition-transform sm:block ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute right-0 top-12 z-40 w-64 rounded-2xl border border-[rgb(16_24_32/0.08)] bg-white p-2 shadow-float"
        >
          {name && (
            <div className="px-2.5 pb-2 pt-1.5">
              <p className="truncate text-sm font-semibold">{name}</p>
              {email && email !== name && <p className="truncate text-xs text-muted-foreground">{email}</p>}
            </div>
          )}
          <div className={name ? 'border-t border-border pt-1.5' : ''}>
            <Link href="/search/preferences" onClick={close} className={item}>
              <UserRound className="size-4 text-muted-foreground" aria-hidden />
              {s.profile}
            </Link>
            <Link href="/settings" onClick={close} className={item}>
              <Settings className="size-4 text-muted-foreground" aria-hidden />
              {t.common.nav.settings}
            </Link>
            <Link href="/billing" onClick={close} className={item}>
              <Coins className="size-4 text-muted-foreground" aria-hidden />
              {s.billing}
            </Link>
            <form action={logout} className="mt-1 border-t border-border pt-1">
              <button type="submit" className={item}>
                <LogOut className="size-4 text-muted-foreground" aria-hidden />
                {s.logout}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
