import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Logo } from './Logo';

interface StatusPageProps {
  icon: LucideIcon;
  /** Klein label boven de titel, bijv. "404". */
  code?: string;
  title: string;
  body: string;
  actions: ReactNode;
  /** Kleine regel onderaan, bijv. een foutcode om aan support door te geven. */
  footnote?: ReactNode;
}

/**
 * Volledige pagina voor 404 en fouten buiten de app: logo, uitleg en uitwegen, gecentreerd op het
 * warme off-white. Zonder hooks, dus bruikbaar in Server én Client Components.
 */
export function StatusPage({ icon: Icon, code, title, body, actions, footnote }: StatusPageProps) {
  return (
    <div className="flex min-h-svh flex-col px-4 py-6 sm:px-8">
      <header>
        <Logo />
      </header>
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center py-12 outline-none">
        <div className="w-full max-w-[34rem] text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground">
            <Icon className="size-7" aria-hidden />
          </span>
          {code && <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{code}</p>}
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{title}</h1>
          <p className="mt-4 text-[16px] leading-[1.7] text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
          {footnote && <p className="mt-8 text-xs text-muted-foreground">{footnote}</p>}
        </div>
      </main>
    </div>
  );
}
