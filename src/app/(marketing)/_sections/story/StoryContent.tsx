import { Eyebrow } from '../../_components/Eyebrow';
import { RevealGroup } from '../../_components/RevealGroup';
import { revealItem } from '../../_components/revealItem';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { StoryVideoButton } from './StoryVideoButton';

/** Linkerkolom van het verhaal: label, kop, korte intro en de video-knop. */
export async function StoryContent() {
  const { story, storyVideo } = buildLanding((await getT()).landing);

  return (
    <RevealGroup className="relative z-10 px-6 pb-10 pt-12 sm:px-10 sm:pb-12 sm:pt-16 lg:flex lg:min-h-[33rem] lg:w-[45%] lg:flex-col lg:justify-center lg:py-12 lg:pl-14 lg:pr-0 xl:min-h-[36rem] xl:pl-20">
      <div {...revealItem(0, 12)}>
        <Eyebrow tone="light">{story.eyebrow}</Eyebrow>
      </div>

      <h2
        id="story-title"
        {...revealItem(80, 20)}
        className="mt-5 text-[clamp(2.1rem,9.5vw,2.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[3.25rem] lg:text-[2.875rem] xl:text-[3.5rem] 2xl:text-[4rem]"
      >
        {story.title.map((line) => (
          <span key={line} className="block">
            {line}{' '}
          </span>
        ))}
      </h2>

      <p {...revealItem(200)} className="mt-6 max-w-sm text-[17px] leading-relaxed text-white/72">
        {story.body}
      </p>

      <div {...revealItem(340)}>
        <StoryVideoButton
          label={story.watch}
          duration={storyVideo.duration}
          videoSrc={storyVideo.src}
          pending={story.videoPending}
          closeLabel={story.closeVideo}
        />
      </div>
    </RevealGroup>
  );
}
