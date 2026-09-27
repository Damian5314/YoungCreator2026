import Image from 'next/image';
import Link from 'next/link';

const sizes = {
  md: { text: 'gap-2.5 text-[18px]', mark: 'h-[30px] w-[37px]' },
  // Footer: ~170px breed
  lg: { text: 'gap-3 text-[22px]', mark: 'h-[37px] w-[45px]' },
};

export function Logo({ href = '/', size = 'md' }: { href?: string; size?: keyof typeof sizes }) {
  return (
    <Link
      href={href}
      className={`flex shrink-0 items-center rounded-lg font-extrabold leading-none tracking-[-0.03em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${sizes[size].text}`}
    >
      {/* object-cover snijdt de transparante rand boven/onder weg, zodat merk en tekst optisch gelijk staan */}
      <Image src="/images/brand/logo.png" alt="" width={48} height={48} className={`object-cover ${sizes[size].mark}`} />
      Job Hunter
    </Link>
  );
}
