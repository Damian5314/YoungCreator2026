import Link from 'next/link';
import { getT } from '@/i18n/server';
import { buildLanding } from '../../_content/landing';
import { FooterSkyline } from './FooterSkyline';

const legalLink =
  'rounded font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

/**
 * Onderste regel. Desktop: copyright links, skyline precies in het midden, herkomst rechts;
 * alle drie op dezelfde 'grondlijn'. Kleinere schermen: skyline boven, de tekst eronder.
 * Daaronder de juridische links en de bedrijfsgegevens van TechTable (verplicht op de site).
 */
export async function FooterBottom() {
  const { footer } = buildLanding((await getT()).landing);
  const { legal, company } = footer;

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-5 text-center text-sm text-muted-foreground sm:gap-6 lg:mt-9 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-end lg:gap-8 lg:text-left">
        <FooterSkyline className="w-[min(100%,22rem)] sm:w-[26rem] lg:order-2 lg:w-[20rem] xl:w-[24rem]" />
        <div className="flex flex-col gap-1.5 sm:w-full sm:flex-row sm:justify-between lg:contents">
          <p className="lg:order-1">{footer.copyright}</p>
          <p className="text-balance lg:order-3 lg:text-right">{footer.tagline}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 border-t border-foreground/6 pt-5 text-center text-[13px] text-muted-foreground lg:flex-row lg:justify-between lg:text-left">
        <nav aria-label={legal.label}>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legal.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={legalLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-balance">
          {company.productOf}{' '}
          <a href={company.website} className={legalLink}>
            {company.name}
          </a>
          {company.details.map((detail) => (
            <span key={detail}> · {detail}</span>
          ))}
        </p>
      </div>
    </>
  );
}
