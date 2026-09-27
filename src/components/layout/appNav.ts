import { LayoutDashboard, Mail, Search, Settings } from 'lucide-react';

// Hoofdmenu van de app: zijbalk (breed scherm), bovenbalk (tablet) en tabbalk onderin (telefoon)
export const appNavItems = [
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/search', key: 'search', icon: Search },
  { href: '/outreach', key: 'outreach', icon: Mail },
  { href: '/settings', key: 'settings', icon: Settings },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  return pathname.startsWith(href);
}
