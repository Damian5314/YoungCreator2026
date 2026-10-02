import { LocaleLink as Link } from '@/components/layout/LocaleLink';
import { ArrowRight } from 'lucide-react';

interface FooterLinksProps {
  title: string;
  links: readonly { href: string; label: string }[];
}

/** Eén linkkolom; het pijltje schuift bij hover een fractie op. */
export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <nav aria-label={title}>
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2>
      <ul className="mt-5 space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 rounded text-[15px] font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {link.label}
              <ArrowRight
                aria-hidden
                className="size-3.5 opacity-60 transition-[translate,opacity] duration-200 ease-soft group-hover:translate-x-[3px] group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
