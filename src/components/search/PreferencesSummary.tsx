import { Briefcase, Building2, Euro, LayoutGrid, MapPin } from 'lucide-react';
import { intlLocale } from '@/i18n/config';
import { getLocale, getT } from '@/i18n/server';
import type { SearchPreferences } from '@/shared/types/UserProfile';

// Leesbare samenvatting van de zoekvoorkeuren, als icoon + label + waarde (dashboard en zoekpagina)
export async function PreferencesSummary({ preferences }: { preferences: SearchPreferences }) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const s = t.search.summary;

  const rows = [
    { icon: Briefcase, label: s.roles, value: preferences.desiredRoles.join(', ') },
    {
      icon: LayoutGrid,
      label: s.opportunityTypes,
      value: preferences.opportunityTypes.map((type) => t.common.opportunityTypes[type]).join(', '),
    },
    {
      icon: MapPin,
      label: s.locations,
      value: `${preferences.locations.join(', ')}${preferences.remoteOnly ? s.remoteOnly : ''}`,
    },
    { icon: Building2, label: s.industries, value: preferences.industries.join(', ') },
    {
      icon: Euro,
      label: s.minSalary,
      value: preferences.minSalary
        ? s.salaryPerMonth(preferences.minSalary.toLocaleString(intlLocale[locale]))
        : s.noMinimum,
    },
  ];

  return (
    <dl className="space-y-3 text-sm">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[#F5F6F4] text-[#52615C]">
            <Icon className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value || '—'}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
