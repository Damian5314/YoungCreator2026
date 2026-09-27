import { Logo } from '@/components/layout/Logo';
import { footer } from '../../_content/landing';

/** Merkkolom: logo, korte belofte en een klein groen statement. */
export function FooterBrand() {
  return (
    <div>
      <Logo size="lg" />
      <p className="mt-6 max-w-[25rem] text-[17px] leading-[1.6] text-muted-foreground xl:text-lg">{footer.about}</p>
      <p className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-primary-soft px-4 py-2.5 text-sm font-medium text-primary-hover">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
        {footer.statement}
      </p>
    </div>
  );
}
