import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { CompanyLogo } from '../../_components/CompanyLogo';
import { FloatCard } from '../../_components/FloatCard';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';

/** Stap 1 — de bron: iets wat een bedrijf publiek aankondigt, als echte nieuwsmelding. */
export async function CompanySignalCard() {
  const { heroCards, media } = buildLanding((await getT()).landing);
  const { company, time, title, tags, tagsLabel } = heroCards.signal;

  return (
    <FloatCard className="p-3.5">
      <div className="flex items-center gap-2.5">
        <CompanyLogo text={company} tone="bg-[#10238A] text-[8px] text-white" className="size-8" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[12.5px] font-semibold">{company}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{time}</p>
        </div>
        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      </div>

      <div className="mt-2.5 flex items-start gap-3">
        <p className="flex-1 text-balance text-[13.5px] font-semibold leading-snug tracking-[-0.01em]">{title}</p>
        <Image
          src={media.newsThumb.src}
          alt={media.newsThumb.alt}
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-[10px] object-cover"
        />
      </div>

      <ul className="mt-2.5 flex flex-wrap gap-1" aria-label={tagsLabel}>
        {tags.map((tag, index) => (
          <li
            key={tag}
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
              index === 0 ? 'bg-primary/10 text-primary-hover' : 'bg-white/60 text-muted-foreground'
            }`}
          >
            {tag}
          </li>
        ))}
      </ul>
    </FloatCard>
  );
}
