// Logo-tegel met initialen. Echte logo's hebben we (nog) niet; een vaste kleur per naam
// maakt bedrijven toch herkenbaar in lijsten.
const TONES = [
  'bg-[#E4F2EA] text-[#0B6B55]',
  'bg-[#E6ECF7] text-[#1F3F7A]',
  'bg-[#F4ECE0] text-[#8A4B12]',
  'bg-[#EFE8F6] text-[#5B3A86]',
  'bg-[#E3F0F2] text-[#1D5C66]',
  'bg-[#F5E6E6] text-[#8A2E2E]',
];

const sizes = {
  sm: 'size-9 rounded-[10px] text-xs',
  md: 'size-11 rounded-xl text-sm',
  lg: 'size-16 rounded-2xl text-lg',
};

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

function tone(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

export function CompanyMark({ name, size = 'md' }: { name: string; size?: keyof typeof sizes }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center font-bold tracking-tight ${sizes[size]} ${tone(name)}`}>
      {initials(name)}
    </span>
  );
}
