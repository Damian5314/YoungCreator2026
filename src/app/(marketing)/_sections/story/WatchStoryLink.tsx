'use client';

import type { ReactNode } from 'react';
import { buttonClasses } from '@/components/ui/Button';

// Andere "Watch"-knoppen op de pagina openen dezelfde video-dialog als in het verhaal (zie StoryVideoButton)
export const OPEN_STORY_VIDEO = 'unlisted:open-story-video';

interface WatchStoryLinkProps {
  /** Zonder JavaScript: gewoon naar de verhaalsectie scrollen. */
  href: string;
  className?: string;
  children: ReactNode;
}

/** Ziet eruit als de secundaire ButtonLink, maar speelt de video direct af. */
export function WatchStoryLink({ href, className, children }: WatchStoryLinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        // Synchroon versturen: zo telt het afspelen nog als klik van de gebruiker (nodig voor geluid op iOS)
        window.dispatchEvent(new Event(OPEN_STORY_VIDEO));
      }}
      className={buttonClasses('secondary', 'lg', className, 'pill')}
    >
      {children}
    </a>
  );
}
