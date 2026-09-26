'use client';

import { useState, type FormEvent } from 'react';
import { Check, Upload } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, Input, Select } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { Switch } from '@/components/ui/Switch';
import { savePreferences } from '@/lib/actions/search';
import type { ProfileData, SearchProfileData } from '@/lib/data/queries';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { OpportunityType } from '@/shared/types/OpportunityType';

const ALL_TYPES = Object.keys(OPPORTUNITY_TYPE_LABELS) as OpportunityType[];

interface PreferencesFormProps {
  profile: ProfileData | null;
  searchProfile: SearchProfileData | null;
}

// Stap 1 van de search flow: situatie (profiles) + voorkeuren (search_profiles)
export function PreferencesForm({ profile, searchProfile }: PreferencesFormProps) {
  const preferences = searchProfile?.preferences;
  const { state, pending, submit } = useFormAction(savePreferences);

  const [types, setTypes] = useState<OpportunityType[]>(preferences?.opportunityTypes ?? []);
  const [remoteOnly, setRemoteOnly] = useState(preferences?.remoteOnly ?? false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  function toggleType(type: OpportunityType) {
    setTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(new FormData(event.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="searchProfileId" value={searchProfile?.id ?? ''} />
      <input type="hidden" name="opportunityTypes" value={types.join(',')} />
      <input type="hidden" name="remoteOnly" value={String(remoteOnly)} />

      <Card>
        <CardHeader
          title="Your situation"
          description="Helps us understand your deadline and what you bring to the table."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nationality" htmlFor="nationality">
            <Input id="nationality" name="nationality" defaultValue={profile?.nationality ?? ''} />
          </Field>
          <Field label="Search year ends on" htmlFor="searchYearEndsOn" hint="When your orientation year (zoekjaar) permit expires.">
            <Input id="searchYearEndsOn" name="searchYearEndsOn" type="date" defaultValue={profile?.searchYearEndsOn ?? ''} />
          </Field>
          <Field label="Degree" htmlFor="degree">
            <Select id="degree" name="degree" defaultValue={profile?.degree ?? ''}>
              <option value="">Select…</option>
              <option>BSc</option>
              <option>MSc</option>
              <option>MBA</option>
              <option>PhD</option>
            </Select>
          </Field>
          <Field label="Field of study" htmlFor="fieldOfStudy">
            <Input id="fieldOfStudy" name="fieldOfStudy" defaultValue={profile?.fieldOfStudy ?? ''} />
          </Field>
          <Field label="University" htmlFor="university">
            <Input id="university" name="university" defaultValue={profile?.university ?? ''} />
          </Field>
          <Field label="Graduation year" htmlFor="graduationYear">
            <Input
              id="graduationYear"
              name="graduationYear"
              type="number"
              min={1990}
              max={2040}
              defaultValue={profile?.graduationYear ?? ''}
            />
          </Field>
          <Field label="Languages" htmlFor="languages" hint="Separate with commas.">
            <Input id="languages" name="languages" defaultValue={profile?.languages.join(', ') ?? ''} />
          </Field>
          <Field label="Skills" htmlFor="skills" hint="Separate with commas.">
            <Input id="skills" name="skills" defaultValue={profile?.skills.join(', ') ?? ''} />
          </Field>
        </div>

        {/* TODO: upload naar Supabase Storage + parsen met CVParser. Nu wordt het bestand nog niet opgeslagen. */}
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
              <span className="block truncate font-medium">{cvFileName ?? 'Choose your CV (PDF)'}</span>
              <span className="block text-muted-foreground">CV upload isn&apos;t saved yet — coming soon</span>
            </span>
          </label>
        </div>
      </Card>

      <Card>
        <CardHeader title="Your preferences" description="What kind of opportunities should we hunt for?" />
        <div className="space-y-5">
          <Field label="Desired roles" htmlFor="desiredRoles" hint="Separate with commas.">
            <Input id="desiredRoles" name="desiredRoles" defaultValue={preferences?.desiredRoles.join(', ') ?? ''} />
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
              <Input id="locations" name="locations" defaultValue={preferences?.locations.join(', ') ?? ''} />
            </Field>
            <Field label="Industries" htmlFor="industries" hint="Separate with commas.">
              <Input id="industries" name="industries" defaultValue={preferences?.industries.join(', ') ?? ''} />
            </Field>
            <Field label="Minimum salary (€ gross / month)" htmlFor="minSalary" hint="Optional.">
              <Input id="minSalary" name="minSalary" type="number" min={0} step={100} defaultValue={preferences?.minSalary ?? ''} />
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

      <FormMessage state={state} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href={searchProfile ? '/search' : '/dashboard'} variant="ghost">
          Cancel
        </ButtonLink>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save & continue to search'}
        </Button>
      </div>
    </form>
  );
}
