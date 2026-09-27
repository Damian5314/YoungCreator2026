'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, LayoutDashboard, Mail, Search, Settings } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

const navItems = [
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/search', key: 'search', icon: Search },
  { href: '/outreach', key: 'outreach', icon: Mail },
  { href: '/settings', key: 'settings', icon: Settings },
] as const;

interface AppHeaderProps {
  name: string;
  credits: number;
}

/**
 * Bovenbalk met logo, credits en avatar. De navigatie staat vanaf sm bovenin
 * (labels vanaf md); op telefoons is het een vaste tabbalk onderin, binnen duimbereik.
 */
export function AppHeader({ name, credits }: AppHeaderProps) {
  const t = useT();
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const initials =
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .join('')
      .slice(0, 2) || '?';
  const creditLabel = t.common.credits.unit(credits);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
          <Logo href="/dashboard" />
          <nav aria-label={t.common.nav.main} className="ml-4 hidden items-center gap-1 sm:flex">
            {navItems.map(({ href, key, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={t.common.nav[key]}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden md:inline">{t.common.nav[key]}</span>
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            {/* Saldo → credits kopen */}
            <Link
              href="/billing"
              title={t.common.credits.buyMore(credits)}
              aria-current={isActive('/billing') ? 'page' : undefined}
              className="flex min-h-8 items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-foreground transition-colors hover:bg-primary hover:text-primary-foreground lg:px-3"
            >
              <Coins className="size-3.5" aria-hidden />
              {credits}
              <span className="sr-only lg:not-sr-only">{creditLabel}</span>
            </Link>
            <span
              title={name}
              className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background"
            >
              {initials}
            </span>
          </div>
        </div>
      </header>

      <nav
        aria-label={t.common.nav.main}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="grid grid-cols-4">
          {navItems.map(({ href, key, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  isActive(href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span
                  className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${
                    isActive(href) ? 'bg-primary-soft' : ''
                  }`}
                >
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                {t.common.nav[key]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
