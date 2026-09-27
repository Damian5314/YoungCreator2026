'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, LayoutDashboard, Mail, Search, Settings } from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/outreach', label: 'Outreach', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface AppHeaderProps {
  name: string;
  credits: number;
}

/**
 * Bovenbalk met logo, credits en avatar. De navigatie staat vanaf sm bovenin
 * (labels vanaf md); op telefoons is het een vaste tabbalk onderin, binnen duimbereik.
 */
export function AppHeader({ name, credits }: AppHeaderProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const initials =
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .join('')
      .slice(0, 2) || '?';
  const creditLabel = credits === 1 ? 'credit' : 'credits';

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
          <Logo href="/dashboard" />
          <nav aria-label="Main" className="ml-4 hidden items-center gap-1 sm:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {/* Saldo → credits kopen */}
            <Link
              href="/billing"
              title={`${credits} ${creditLabel}: buy more`}
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
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="grid grid-cols-4">
          {navItems.map(({ href, label, icon: Icon }) => (
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
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
