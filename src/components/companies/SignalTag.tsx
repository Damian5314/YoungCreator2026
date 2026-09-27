'use client';

import {
  Banknote,
  Building2,
  CalendarDays,
  FlaskConical,
  Newspaper,
  Rocket,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useT } from '@/i18n/I18nProvider';
import type { SignalKind } from '@/modules/signals/signals';

export const SIGNAL_ICONS: Record<SignalKind, LucideIcon> = {
  funding: Banknote,
  product: Rocket,
  team: Users,
  office: Building2,
  expansion: TrendingUp,
  hiring: UserPlus,
  leadership: UserCog,
  event: CalendarDays,
  rnd: FlaskConical,
  news: Newspaper,
};

// Soort bedrijfssignaal als label: overal dezelfde vorm, icoon en tekst
export function SignalTag({ kind }: { kind: SignalKind }) {
  const t = useT();
  const Icon = SIGNAL_ICONS[kind];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary-soft-foreground">
      <Icon className="size-3" aria-hidden />
      {t.signals.kinds[kind].label}
    </span>
  );
}
