import { revealItem } from '../../_components/revealItem';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { CTAButtons } from './CTAButtons';

/** Linkerkolom: de emotionele slotzin, de belofte, de knoppen en een ingetogen geruststelling. */
export async function CTAContent() {
  const { finalCta } = buildLanding((await getT()).landing);

  return (
    <div className="relative px-6 pb-8 text-white sm:px-10 sm:pb-10 lg:px-14 lg:py-14 xl:px-[72px]">
      <h2
        id="cta-title"
        {...revealItem(0, 20)}
        className="max-w-[720px] text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] [text-shadow:0_2px_28px_rgb(7_10_9/0.25)] sm:text-[3rem] lg:text-[2.6rem] xl:text-[3.4rem] 2xl:text-[3.75rem]"
      >
        {finalCta.title.map((line) => (
          <span key={line} className="sm:block">
            {line}{' '}
          </span>
        ))}
      </h2>

      <p {...revealItem(160, 14)} className="mt-4 text-[20px] font-medium text-white/88 sm:text-[22px] xl:mt-5 xl:text-[23px]">
        {finalCta.body}
      </p>

      <div {...revealItem(300, 12)} className="mt-8 xl:mt-9">
        <CTAButtons />
      </div>

      <p {...revealItem(420, 8)} className="mt-5 text-[13px] text-white/65">
        {finalCta.trust[0]}
        <span className="mx-2" aria-hidden>
          •
        </span>
        {finalCta.trust[1]}
      </p>
    </div>
  );
}
