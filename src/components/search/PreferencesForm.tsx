'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Upload } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, Input, Select } from '@/components/ui/Field';
import { Switch } from '@/components/ui/Switch';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import { mockUser } from '@/shared/mocks/mockData';
import type { OpportunityType } from '@/shared/types/OpportunityType';

const ALL_TYPES = Object.keys(OPPORTUNITY_TYPE_LABELS) as OpportunityType[];

// Stap 1 van de search flow: situatie + voorkeuren (voorgevuld met mock-data)
export function PreferencesForm() {
  const router = useRouter();
  const { cv, preferences } = mockUser;
  const education = cv.education[0];

  const [types, setTypes] = useState<OpportunityType[]>(preferences.opportunityTypes);
  const [remoteOnly, setRemoteOnly] = useState(preferences.remoteOnly);
  const [cvFileName, setCvFileName] = useState('cv_alex_morgan_2026.pdf');

  function toggleType(type: OpportunityType) {
    setTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: opslaan via /api/profile (CV parsen via CVParser). Nu alleen door naar de search engine.
    router.push('/search');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader
          title="Your situation"
          description="Helps us understand your deadline and what you bring to the table."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nationality" htmlFor="nationality">
            <Input id="nationality" defaultValue={mockUser.nationality} />
          </Field>
          <Field label="Search year ends on" htmlFor="visaDeadline" hint="When your orientation year (zoekjaar) permit expires.">
            <Input id="visaDeadline" type="date" defaultValue={mockUser.visaDeadline.toISOString().slice(0, 10)} />
          </Field>
          <Field label="Degree" htmlFor="degree">
            <Select id="degree" defaultValue={education.degree}>
              <option>BSc</option>
              <option>MSc</option>
              <option>MBA</option>
              <option>PhD</option>
            </Select>
          </Field>
          <Field label="Field of study" htmlFor="field">
            <Input id="field" defaultValue={education.field} />
          </Field>
          <Field label="University" htmlFor="institution">
            <Input id="institution" defaultValue={education.institution} />
          </Field>
          <Field label="Graduation year" htmlFor="graduationYear">
            <Input id="graduationYear" type="number" defaultValue={education.graduationYear} />
          </Field>
          <Field label="Languages" htmlFor="languages" hint="Separate with commas.">
            <Input id="languages" defaultValue={cv.languages.join(', ')} />
          </Field>
          <Field label="Skills" htmlFor="skills" hint="Separate with commas.">
            <Input id="skills" defaultValue={cv.skills.join(', ')} />
          </Field>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">CV</p>
          <label className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input p-4 transition-colors hover:bg-muted focus-within:outline-2 focus-within:outline-primary">
            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setCvFileName(file.name);
              }}
            />
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Upload className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 text-sm">
              <span className="block truncate font-medium">{cvFileName}</span>
              <span className="block text-muted-foreground">PDF, max 5 MB · click to replace</span>
            </span>
          </label>
        </div>
      </Card>

      <Card>
        <CardHeader title="Your preferences" description="What kind of opportunities should we hunt for?" />
        <div className="space-y-5">
          <Field label="Desired roles" htmlFor="roles" hint="Separate with commas.">
            <Input id="roles" defaultValue={preferences.desiredRoles.join(', ')} />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium">Opportunity types</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_TYPES.map((type) => {
                const selected = types.includes(type);
                return (
                  <Chip key={type} selected={selected} onClick={() => toggleType(type)}>
                    {selected && <Check className="size-3.5" aria-hidden />}
                    {OPPORTUNITY_TYPE_LABELS[type]}
                  </Chip>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Locations" htmlFor="locations" hint="Separate with commas.">
              <Input id="locations" defaultValue={preferences.locations.join(', ')} />
            </Field>
            <Field label="Industries" htmlFor="industries" hint="Separate with commas.">
              <Input id="industries" defaultValue={preferences.industries.join(', ')} />
            </Field>
            <Field label="Minimum salary (€ gross / month)" htmlFor="minSalary" hint="Optional.">
              <Input id="minSalary" type="number" min={0} step={100} defaultValue={preferences.minSalary} />
            </Field>
          </div>

          <Switch
            id="remoteOnly"
            label="Remote only"
            description="Only show opportunities you can do fully remote."
            checked={remoteOnly}
            onChange={setRemoteOnly}
          />
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href="/search" variant="ghost">
          Cancel
        </ButtonLink>
        <Button type="submit">Save &amp; continue to search</Button>
      </div>
    </form>
  );
}
