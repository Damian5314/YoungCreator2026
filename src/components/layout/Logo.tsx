import Link from 'next/link';
import { Crosshair } from 'lucide-react';

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Crosshair className="size-4" aria-hidden />
      </span>
      <span>
        JobHunter<span className="text-primary">.nl</span>
      </span>
    </Link>
  );
}
