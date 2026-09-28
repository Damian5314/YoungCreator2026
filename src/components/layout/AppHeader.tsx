'use client';

import { Suspense } from 'react';
import Form from 'next/form';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Coins, Search } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { appNavItems as navItems, isNavActive } from './appNav';
import { AvatarMenu } from './AvatarMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { NotificationsButton } from './NotificationsButton';

interface AppHeaderProps {
  name: string;
  email: string;
  credits: number;
}

const iconButton =
  'grid size-10 place-items-center rounded-xl text-[#52615C] transition-colors hover:bg-[#F5F6F4] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// Zoeken in de bovenbalk: opent Opportunities met de zoekterm (die pagina toont ook passende bedrijven)
function TopSearch() {
  const t = useT();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = pathname === '/opportunities' ? (searchParams.get('q') ?? '') : '';

  return (
    <Form action="/opportunities" role="search" className="relative w-[260px] min-[1600px]:w-[300px]">
      <label htmlFor="app-search" className="sr-only">
        {t.common.shell.searchLabel}
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7772]" aria-hidden />
      <input
        // key: bij een nieuwe zoekterm in de url begint het veld opnieuw met die waarde
        key={current}
        id="app-search"
        name="q"
        type="search"
        defaultValue={current}
        placeholder={t.common.shell.searchPlaceholder}
        className="h-11 w-full rounded-xl border border-transparent bg-[#F5F6F4] pl-10 pr-3 text-sm text-foreground transition-[background-color,border-color,box-shadow] placeholder:text-[#6B7772] focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgb(8_127_99/0.1)] focus:outline-none"
      />
    </Form>
  );
}

/**
 * Horizontale navigatie bovenaan, op elk scherm vanaf tablet: logo links, de vijf hoofdtabs
 * in het midden (labels vanaf 1180px), rechts zoeken, taal, credits, meldingen en het accountmenu.
 * Settings zit in het accountmenu. Op telefoons staan de tabs als tabbalk onderin.
 */
export function AppHeader({ name, email, credits }: AppHeaderProps) {
  const t = useT();
  const pathname = usePathname();
  const isActive = (href: string) => isNavActive(pathname, href);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[rgb(16_24_32/0.06)] bg-white/90 backdrop-blur-[18px]">
        <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center gap-3 px-4 sm:h-[76px] sm:px-8 xl:px-12">
          {/* Heel smalle telefoons: alleen het merkteken, zodat taal, credits, bel en avatar passen */}
          <div className="shrink-0 max-[400px]:w-10 max-[400px]:overflow-hidden">
            <Logo href="/dashboard" />
          </div>

          <nav aria-label={t.common.nav.main} className="hidden flex-1 items-center justify-center gap-1 sm:flex">
            {navItems.map(({ href, key, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={t.common.nav[key]}
                  title={t.common.nav[key]}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[14.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-[1180px]:px-3.5 ${
                    active
                      ? 'border-selected-border bg-selected text-selected-foreground'
                      : 'border-transparent text-[#52615C] hover:bg-[#F5F6F4] hover:text-foreground'
                  }`}
                >
                  <Icon className={`size-[18px] ${active ? 'text-primary' : ''}`} aria-hidden />
                  <span className="hidden min-[1180px]:inline">{t.common.nav[key]}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2.5">
            {/* Breed scherm: zoekveld; smaller een knop naar de zoekbare kansenlijst. Zolang de tabs alleen
                icoontjes zijn (<1180px) niet, anders staan er twee vergrootglazen naast elkaar. */}
            <div className="hidden min-[1536px]:block">
              <Suspense fallback={<div className="w-[260px]" />}>
                <TopSearch />
              </Suspense>
            </div>
            <Link href="/opportunities" aria-label={t.common.shell.searchLabel} className={`${iconButton} hidden min-[1180px]:grid min-[1536px]:hidden`}>
              <Search className="size-[18px]" aria-hidden />
            </Link>
            <LanguageSwitcher />
            {/* Saldo → credits kopen */}
            <Link
              href="/billing"
              title={t.common.credits.buyMore(credits)}
              aria-current={isActive('/billing') ? 'page' : undefined}
              className="flex h-9 items-center gap-1.5 rounded-full border border-selected-border bg-selected px-3 text-xs font-semibold text-selected-foreground transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-10 sm:text-sm"
            >
              <Coins className="size-4 text-primary" aria-hidden />
              <span className="tabular-nums">{credits}</span>
              <span className="sr-only lg:not-sr-only">{t.common.credits.unit(credits)}</span>
            </Link>
            <NotificationsButton />
            <AvatarMenu name={name} email={email} />
          </div>
        </div>
      </header>

      <nav
        aria-label={t.common.nav.main}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgb(16_24_32/0.06)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="grid grid-cols-5">
          {navItems.map(({ href, key, icon: Icon }) => (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-medium focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary tracking-[-0.01em] transition-colors min-[380px]:text-[10.5px] min-[380px]:tracking-normal ${
                  isActive(href) ? 'text-foreground' : 'text-[#52615C] hover:text-foreground'
                }`}
              >
                <span
                  className={`grid h-7 w-11 place-items-center rounded-full border transition-colors ${
                    isActive(href) ? 'border-selected-border bg-selected text-primary' : 'border-transparent'
                  }`}
                >
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="max-w-full truncate">{t.common.nav[key]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
