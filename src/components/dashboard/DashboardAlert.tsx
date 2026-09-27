'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Coins, Sparkles, X } from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';

// Iconen per sleutel: een Server Component kan geen component (functie) als prop doorgeven
const ICONS = { sparkles: Sparkles, coins: Coins };

interface DashboardAlertProps {
  icon: keyof typeof ICONS;
  children: ReactNode;
  action: { href: string; label: string };
  dismissible?: boolean;
}

// Zachte groene balk voor wat nu je aandacht vraagt (mails om te bekijken, credits op)
export function DashboardAlert({ icon, children, action, dismissible = false }: DashboardAlertProps) {
  const Icon = ICONS[icon];
  const t = useT();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-[14px] border border-[rgb(8_127_99/0.08)] bg-[#EAF7EF] px-4 py-3.5 text-sm text-primary-hover motion-safe:animate-fade-up sm:min-h-14 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
      style={{ animationDelay: '360ms' }}
    >
      <Icon className="hidden size-5 shrink-0 sm:block" aria-hidden />
      <p className="flex-1 leading-snug">{children}</p>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={action.href}
          className="group inline-flex items-center gap-1 whitespace-nowrap font-semibold text-primary hover:underline"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </Link>
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t.dashboard.home.dismiss}
            className="grid size-8 place-items-center rounded-lg text-primary/70 transition-colors hover:bg-white/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:ml-2"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
