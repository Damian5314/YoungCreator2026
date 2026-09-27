interface ProblemSignalCardProps {
  title: string;
  detail: string | null;
  /** De emotionele clou: iets groter dan de andere kaarten. */
  emphasis?: boolean;
}

/** Donkere, doorschijnende "gedachte" over de verhaalfoto. Bewust geen productkaart. */
export function ProblemSignalCard({ title, detail, emphasis = false }: ProblemSignalCardProps) {
  return (
    <div
      className={`h-full rounded-card border border-white/10 bg-[rgb(10_20_16/0.7)] shadow-[0_18px_50px_rgb(0_0_0/0.35)] backdrop-blur-[16px] ${
        emphasis ? 'px-5 py-4 lg:px-6 lg:py-5' : 'px-5 py-4'
      }`}
    >
      <p
        className={
          emphasis
            ? 'text-[17px] font-semibold leading-snug text-white lg:text-lg xl:text-xl'
            : 'text-[15px] font-semibold text-white'
        }
      >
        {title}
      </p>
      {detail && <p className="mt-0.5 text-sm text-white/70">{detail}</p>}
    </div>
  );
}
