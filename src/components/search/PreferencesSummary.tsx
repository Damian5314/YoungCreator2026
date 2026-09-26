import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { SearchPreferences } from '@/shared/types/UserProfile';

// Leesbare samenvatting van de zoekvoorkeuren (search page + dashboard)
export function PreferencesSummary({ preferences }: { preferences: SearchPreferences }) {
  const rows = [
    { label: 'Roles', value: preferences.desiredRoles.join(', ') },
    {
      label: 'Opportunity types',
      value: preferences.opportunityTypes.map((type) => OPPORTUNITY_TYPE_LABELS[type]).join(', '),
    },
    {
      label: 'Locations',
      value: `${preferences.locations.join(', ')}${preferences.remoteOnly ? ' (remote only)' : ''}`,
    },
    { label: 'Industries', value: preferences.industries.join(', ') },
    {
      label: 'Minimum salary',
      value: preferences.minSalary ? `€${preferences.minSalary.toLocaleString('en-GB')} / month` : 'No minimum',
    },
  ];

  return (
    <dl className="space-y-3 text-sm">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="mt-0.5 font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
