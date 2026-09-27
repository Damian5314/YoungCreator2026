'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/i18n/I18nProvider';
import { appNavItems, isNavActive } from './appNav';
import { Logo } from './Logo';

/**
 * Zijbalk met logo en hoofdmenu, alleen op brede schermen (xl). Daaronder staat het menu
 * in AppHeader: bovenin vanaf sm, als tabbalk onderin op telefoons.
 */
export function AppSidebar() {
  const t = useT();
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-background px-4 xl:flex">
      <div className="flex h-16 items-center px-2">
        <Logo href="/dashboard" />
      </div>
      <nav aria-label={t.common.nav.main} className="mt-6">
        <ul className="space-y-1">
          {appNavItems.map(({ href, key, icon: Icon }) => {
            const active = isNavActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active ? 'bg-selected text-selected-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="size-[18px]" aria-hidden />
                  {t.common.nav[key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
