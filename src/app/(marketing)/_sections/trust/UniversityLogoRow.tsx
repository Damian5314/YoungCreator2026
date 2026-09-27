import { revealItem } from '../../_components/revealItem';
import { trust } from '../../_content/landing';

type University = (typeof trust.universities)[number];

/** Tekst-woordmerk (~30–34px hoog), in een stijl die bij de instelling past. */
export function UniversityLogo({ name, style }: University) {
  switch (style) {
    case 'serif':
      return (
        <span className="flex flex-col font-serif text-[14.5px] leading-[1.1] tracking-[-0.01em]">
          {name.split('|').map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      );
    case 'split': {
      const [short, ...rest] = name.split(' ');
      return (
        <span className="flex items-baseline gap-1.5">
          <span className="text-[19.5px] font-extrabold tracking-[-0.04em]">{short}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{rest.join(' ')}</span>
        </span>
      );
    }
    case 'stacked': {
      const [first, ...rest] = name.split(' ');
      return (
        <span className="flex flex-col leading-none">
          <span className="text-[14.5px] font-bold tracking-[-0.01em]">{first}</span>
          <span className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.14em]">{rest.join(' ')}</span>
        </span>
      );
    }
    default:
      return <span className="text-[17.5px] font-bold tracking-[-0.03em]">{name}</span>;
  }
}

/**
 * Eén rij woordmerken, alleen gescheiden door witruimte. Past de rij niet (mobiel/tablet),
 * dan scrollt hij horizontaal met een zachte uitloop rechts in plaats van te krimpen.
 */
export function UniversityLogoRow() {
  return (
    <ul className="relative -mx-5 mt-3 flex items-center gap-x-7 overflow-x-auto whitespace-nowrap px-5 pb-1 pr-12 text-[#2B3440]/80 [mask-image:linear-gradient(to_right,#000_80%,transparent)] [scrollbar-width:none] sm:-mx-7 sm:px-7 lg:mx-0 lg:gap-x-7 lg:overflow-visible lg:px-0 lg:pb-0 lg:[mask-image:none] xl:mt-0 xl:max-w-[720px] xl:flex-1 xl:justify-between xl:gap-x-6 [&::-webkit-scrollbar]:hidden">
      {trust.universities.map((university, index) => (
        <li key={university.name} {...revealItem(140 + index * 70, 10)} className="shrink-0">
          <UniversityLogo {...university} />
        </li>
      ))}
    </ul>
  );
}
