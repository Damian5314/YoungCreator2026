import { Check } from 'lucide-react';
import { FloatCard } from '../../_components/FloatCard';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/** Stap 3 — een snelle, compacte match-uitkomst; bewust geen dashboard-widget. */
export async function MatchCard() {
  const { heroCards } = buildLanding((await getT()).landing);
  const { score, label, reasons } = heroCards.match;

  return (
    <FloatCard className="p-3.5">
      <div className="flex items-baseline gap-2">
        <p className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-primary">{score}%</p>
        <p className="text-[12.5px] font-semibold">{label}</p>
      </div>

      <ul className="mt-2.5 space-y-1">
        {reasons.map((reason) => (
          <li key={reason} className="flex items-center gap-2 text-[12px] text-foreground/85">
            <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-2.5" strokeWidth={3} aria-hidden />
            </span>
            {reason}
          </li>
        ))}
      </ul>
    </FloatCard>
  );
}
