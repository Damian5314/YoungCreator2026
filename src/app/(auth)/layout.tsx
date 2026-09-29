import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthMobileVisual, AuthVisual } from '@/components/auth/AuthVisual';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Logo } from '@/components/layout/Logo';
import { getT } from '@/i18n/server';

const footerLink =
  'rounded underline-offset-2 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/**
 * Login en registratie: foto + productverhaal links, formulier rechts op warm off-white.
 * Mobiel: logo → formulier → kleine foto-uitsnede, zodat het formulier voorrang heeft.
 */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const dict = await getT();
  const t = dict.authLayout;
  const legal = dict.landing.footer.legal;

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-background lg:grid lg:grid-cols-[52fr_48fr] xl:grid-cols-[55fr_45fr]">
      <AuthVisual />

      {/* Zachte mint-gloed achter het formulier */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_45%,rgb(182_235_207/0.18),transparent_55%)]"
      />

      {/* Desktop: ruimtes schalen mee met de schermhoogte, zodat alles zonder scrollen in beeld past */}
      <div className="relative z-10 flex min-h-svh flex-col px-4 pb-6 pt-5 sm:px-8 lg:px-10 lg:pb-[clamp(10px,2svh,24px)] lg:pt-[clamp(16px,4svh,40px)] xl:px-14">
        <header className="flex items-center justify-between gap-4 lg:justify-end">
          <div className="motion-safe:animate-fade lg:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 rounded-md max-[400px]:size-10 max-[400px]:justify-center text-sm font-medium text-[#173A31] transition-[color,transform] duration-200 hover:-translate-x-0.5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <ArrowLeft className="size-4" aria-hidden />
              <span className="max-[400px]:sr-only">{t.backToHome}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center py-8 outline-none lg:py-[clamp(8px,1.6svh,40px)]">
          <div className="w-full max-w-[500px] motion-safe:animate-rise [animation-delay:0.15s]">{children}</div>
        </main>

        <div className="mx-auto w-full max-w-[500px] lg:hidden">
          <AuthMobileVisual />
        </div>

        <footer className="mt-6 text-center text-xs text-muted-foreground lg:mt-[clamp(8px,1.5svh,24px)]">
          {t.footer.copyright} <span aria-hidden>·</span> {t.footer.madeIn}{' '}
          <span aria-hidden>·</span>{' '}
          <Link href="/privacy" className={footerLink}>
            {legal.privacy}
          </Link>{' '}
          <span aria-hidden>·</span>{' '}
          <Link href="/terms" className={footerLink}>
            {legal.terms}
          </Link>{' '}
          <span aria-hidden>·</span>{' '}
          <Link href="/contact" className={footerLink}>
            {legal.contact}
          </Link>
        </footer>
      </div>
    </div>
  );
}
