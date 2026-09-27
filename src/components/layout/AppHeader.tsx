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

export function AppHeader({ name, credits }: AppHeaderProps) {
  const pathname = usePathname();
  const initials =
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .join('')
      .slice(0, 2) || '?';

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Logo href="/dashboard" />
        <nav className="flex items-center gap-1 sm:ml-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-3 ${
                  active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-soft-foreground md:flex">
            <Coins className="size-3.5" aria-hidden />
            {credits} {credits === 1 ? 'credit' : 'credits'}
          </span>
          <span
            title={name}
            className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background"
          >
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}
