/** Compacte bedrijfstegel (woordmerk/initiaal) voor product-UI op de landingspagina. */
export function CompanyLogo({
  text,
  tone,
  className = 'size-10',
}: {
  text: string;
  /** Achtergrond- en tekstkleur-utilities. */
  tone: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-[10px] font-extrabold leading-none ${tone} ${className}`}
    >
      {text}
    </span>
  );
}
