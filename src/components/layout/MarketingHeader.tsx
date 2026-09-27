'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import { Container } from './Container';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { ButtonLink } from '../ui/Button';

interface NavLink {
  href: string;
  label: string;
}

export interface MarketingNav {
  /** Anker van de hero: het logo scrolt hierheen. */
  home: string;
  links: NavLink[];
  signIn: NavLink;
  cta: NavLink;
}

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

// Rustig navy → merkgroen, met een dunne lijn die van links onder de link in schuift
const desktopLink = `relative rounded-md py-2 text-[15px] font-medium text-foreground/70 transition-colors duration-200 hover:text-primary focus-visible:text-primary ${focusRing} after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-soft hover:after:scale-x-100 motion-reduce:after:transition-none`;

/**
 * Transparante navbar die in de hero opgaat; zodra je scrolt krijgt hij een
 * subtiele, geblurde off-white achtergrond. Desktop: logo links, links exact in
 * het midden, acties rechts. Onder lg klapt de navigatie in een menu.
 */
export function MarketingHeader({ nav }: { nav: MarketingNav }) {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  // Open menu: dicht vlak, zodat de hero niet door de links heen schemert
  const surface = open
    ? 'border-foreground/6 bg-background'
    : scrolled
      ? 'border-foreground/6 bg-background/88 backdrop-blur-[16px]'
      : 'border-transparent bg-transparent';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${surface}`}
    >
      <Container className="flex h-18 items-center justify-between gap-6 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
          <Logo href={nav.home} />
        </div>

        <nav aria-label={t.common.nav.main} className="hidden lg:block">
          <ul className="flex items-center gap-8 whitespace-nowrap xl:gap-10">
            {nav.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={desktopLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          <LanguageSwitcher />
          <Link
            href={nav.signIn.href}
            className={`hidden h-11 items-center whitespace-nowrap rounded-full px-3 text-[15px] font-medium text-foreground/80 transition-colors duration-200 hover:text-primary sm:inline-flex ${focusRing}`}
          >
            {nav.signIn.label}
          </Link>
          <div className="hidden sm:block">
            {/* Zelfde groene pill als de hero-CTA */}
            <ButtonLink
              href={nav.cta.href}
              shape="pill"
              className="h-11 px-5 text-[15px] font-semibold shadow-[0_8px_20px_-12px_rgb(8_127_99/0.6)] hover:-translate-y-px hover:shadow-[0_12px_26px_-12px_rgb(8_127_99/0.7)] motion-reduce:hover:translate-y-0"
            >
              {nav.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.common.nav.closeMenu : t.common.nav.openMenu}
            className={`grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5 lg:hidden ${focusRing}`}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-foreground/6 lg:hidden">
        <Container className="py-3">
          <nav aria-label={t.common.nav.main}>
            <ul className="flex flex-col">
              {nav.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={close}
                    className={`block rounded-xl px-3 py-3 text-base font-medium text-foreground/85 transition-colors hover:bg-primary-soft hover:text-primary ${focusRing}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Vanaf sm staan deze al in de balk zelf */}
          <div className="mt-3 flex flex-col gap-2 border-t border-foreground/6 pb-2 pt-4 sm:hidden">
            <ButtonLink href={nav.signIn.href} variant="secondary" shape="pill" size="lg">
              {nav.signIn.label}
            </ButtonLink>
            <ButtonLink href={nav.cta.href} shape="pill" size="lg" className="font-semibold">
              {nav.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
