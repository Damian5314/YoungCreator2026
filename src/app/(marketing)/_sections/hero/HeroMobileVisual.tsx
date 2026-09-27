import { CompanyNewsCard } from './CompanyNewsCard';
import { OpportunityCard } from './OpportunityCard';
import { OutreachCard } from './OutreachCard';
import { MatchCard } from './MatchCard';

/**
 * Mobile / tablet version of the hero visual: a contained photo banner (framed
 * on the student, since the left of the source image is empty) followed by the
 * signal cards as a simple vertical stack. Desktop uses a full-bleed background
 * instead — see HeroDesktopScene.
 */
export function HeroMobileVisual({ shown }: { shown: boolean }) {
  return (
    <div className="lg:hidden">
      <div
        className={`relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f3ede1] to-[#e5ddcd] shadow-xl shadow-black/10 transition-all duration-1000 ease-out ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-canal.png"
          alt="International student with a laptop by an Amsterdam canal at golden hour"
          className="h-full w-full object-cover object-[72%_center]"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <CompanyNewsCard />
        <OpportunityCard />
        <OutreachCard />
        <MatchCard />
      </div>
    </div>
  );
}
