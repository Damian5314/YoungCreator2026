import { Container } from '@/components/layout/Container';
import { RevealGroup } from '../../_components/RevealGroup';
import { revealItem } from '../../_components/revealItem';
import { footer } from '../../_content/landing';
import { FooterBottom } from './FooterBottom';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { FooterSocial } from './FooterSocial';

/**
 * Afsluiter van de landingspagina: een lichte, afgeronde kaart met merk, links en
 * socials. Desktop 4 kolommen, laptop merk + 3 kolommen, tablet 2×2, mobiel gestapeld.
 */
export function Footer() {
  const [product, getStarted] = footer.columns;

  return (
    <footer className="pb-6 sm:pb-8">
      <Container>
        <RevealGroup className="relative isolate overflow-hidden rounded-block border border-border bg-card px-6 pb-6 pt-12 shadow-[0_12px_40px_rgb(16_24_32/0.05)] sm:px-10 sm:pt-14 lg:px-[72px] lg:pb-8 lg:pt-16">
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.1fr)] xl:gap-x-12">
            <div className="lg:col-span-3 xl:col-span-1" {...revealItem(0)}>
              <FooterBrand />
            </div>
            <div {...revealItem(120)}>
              <FooterLinks title={product.title} links={product.links} />
            </div>
            <div {...revealItem(200)}>
              <FooterLinks title={getStarted.title} links={getStarted.links} />
            </div>
            <div {...revealItem(280)}>
              <FooterSocial />
            </div>
          </div>

          <div aria-hidden className="mt-12 h-px bg-foreground/9 lg:mt-14" />
          <FooterBottom />
        </RevealGroup>
      </Container>
    </footer>
  );
}
