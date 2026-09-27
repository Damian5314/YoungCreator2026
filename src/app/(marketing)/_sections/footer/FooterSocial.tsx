import type { ReactNode } from 'react';
import { Annotation } from '../../_components/Annotation';
import { revealItem } from '../../_components/revealItem';
import { footer, type SocialPlatform } from '../../_content/landing';

/* Lijn-iconen in dezelfde stijl als lucide (lucide heeft geen merklogo's meer). */
const icons: Record<SocialPlatform, ReactNode> = {
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l11.733 16H20L8.267 4z" />
      <path d="M4 20l6.768-6.768M13.228 10.772 20 4" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
};

/**
 * "Follow the signal": korte zin, social-tegels en één handgeschreven notitie.
 * De tegels verschijnen pas als er echte account-URL's in de content staan.
 */
export function FooterSocial() {
  const { title, text, links, annotation } = footer.social;

  return (
    <div>
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{text}</p>

      {links.length > 0 && (
        <ul className="mt-5 flex gap-3">
          {links.map(({ platform, label, href }, index) => (
            <li key={platform} {...revealItem(420 + index * 70, 8)}>
              <a
                href={href}
                aria-label={`Job Hunter on ${label}`}
                className="grid size-12 place-items-center rounded-[14px] border border-primary/5 bg-primary-soft text-foreground transition-[background-color,color,translate,box-shadow] duration-200 ease-soft hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_10px_22px_-10px_rgb(8_127_99/0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="size-5"
                >
                  {icons[platform]}
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Tekent zichzelf pas in als de footer in beeld is (data-reveal-play, zie globals.css) */}
      <div data-reveal-play className="mt-5 pl-1">
        <Annotation
          lines={annotation}
          arrow="up-right"
          tone="green"
          delay={0.9}
          className="relative inline-block"
          arrowClassName="absolute bottom-3 left-full ml-1"
        />
      </div>
    </div>
  );
}
