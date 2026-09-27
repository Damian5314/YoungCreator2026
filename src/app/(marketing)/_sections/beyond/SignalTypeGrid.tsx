import { revealItem } from '../../_components/revealItem';
import { getT } from '@/i18n/server';
import { buildLanding, type SignalTone } from '../../_content/landing';

const tones: Record<SignalTone, string> = {
  mint: 'bg-primary-soft text-primary',
  purple: 'bg-[#f1ecfb] text-[#7a5bd0] dark:bg-[#7a5bd0]/15 dark:text-[#b9a4f2]',
  orange: 'bg-[#fdf0e2] text-[#cf7424] dark:bg-[#cf7424]/15 dark:text-[#f2b47c]',
  blue: 'bg-[#eaf2fd] text-[#3a78d4] dark:bg-[#3a78d4]/15 dark:text-[#95bbf2]',
};

/** De vier soorten signalen die Unlisted volgt: kleine tegel met icoon, label eronder. */
export async function SignalTypeGrid() {
  const { signals } = buildLanding((await getT()).landing);

  return (
    <ul className="mt-9 grid max-w-[31rem] grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:mt-10">
      {signals.items.map(({ icon: Icon, label: [first, second], tone }, index) => (
        <li key={first} {...revealItem(270 + index * 70)} className="group flex flex-col items-start gap-3">
          <span
            className={`grid size-14 place-items-center rounded-[17px] shadow-[0_8px_20px_-12px_rgb(16_24_32/0.35)] ring-1 ring-foreground/[0.04] transition-transform duration-300 ease-soft group-hover:-translate-y-0.5 lg:size-[3.75rem] ${tones[tone]}`}
          >
            <Icon className="size-[22px]" strokeWidth={1.9} aria-hidden />
          </span>
          {/* Vier op een rij (vanaf sm): altijd twee regels, zodat de labels even hoog en in balans zijn */}
          <span className="text-[14px] font-semibold leading-snug text-foreground/85">
            {first} <br className="hidden sm:inline" />
            {second}
          </span>
        </li>
      ))}
    </ul>
  );
}
