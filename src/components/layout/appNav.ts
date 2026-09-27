import { Briefcase, Building2, LayoutDashboard, Mail, Search } from 'lucide-react';

// Hoofdmenu van de app, in de volgorde van het verhaal: zoeken → kansen → bedrijven → contact.
// Bovenbalk (tablet en groter) en tabbalk onderin (telefoon) gebruiken dezelfde lijst.
export const appNavItems = [
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/search', key: 'search', icon: Search },
  { href: '/opportunities', key: 'opportunities', icon: Briefcase },
  { href: '/companies', key: 'companies', icon: Building2 },
  { href: '/outreach', key: 'outreach', icon: Mail },
] as const;

// Settings staat niet in het hoofdmenu, maar in het accountmenu (avatar rechtsboven)

export function isNavActive(pathname: string, href: string): boolean {
  // De detailpagina van een kans (/matches/…) hoort bij Opportunities
  if (href === '/opportunities' && pathname.startsWith('/matches/')) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}
