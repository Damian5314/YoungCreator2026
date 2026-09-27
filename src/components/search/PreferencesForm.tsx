'use client';

import { useState, type FormEvent } from 'react';
import { Check, FileText, Upload } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { Switch } from '@/components/ui/Switch';
import { savePreferences } from '@/lib/actions/search';
import type { ProfileData, SearchProfileData } from '@/lib/data/queries';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { OPPORTUNITY_TYPE_GROUPS, OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { OpportunityType } from '@/shared/types/OpportunityType';

const MAX_CV_MB = 5;

interface PreferencesFormProps {
  profile: ProfileData | null;
  searchProfile: SearchProfileData | null;
}

// Stap 1 van de search flow: situatie, "know me" (profiles) + voorkeuren (search_profiles)
export function PreferencesForm({ profile, searchProfile }: PreferencesFormProps) {
  const preferences = searchProfile?.preferences;
  const { state, pending, submit } = useFormAction(savePreferences);

  const [types, setTypes] = useState<OpportunityType[]>(preferences?.opportunityTypes ?? []);
  const [remoteOnly, setRemoteOnly] = useState(preferences?.remoteOnly ?? false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  function toggleType(type: OpportunityType) {
    setTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cvError) return;
    submit(new FormData(event.currentTarget));
  }

  let cvHint = profile?.hasCv ? 'Your CV is saved. Upload a new one to replace it.' : 'PDF, max 5 MB. We pull out your skills, languages and interests.';
  if (cvFileName) cvHint = 'Will be read and saved when you press save.';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="searchProfileId" value={searchProfile?.id ?? ''} />
      <input type="hidden" name="opportunityTypes" value={types.join(',')} />
      <input type="hidden" name="remoteOnly" value={String(remoteOnly)} />

      <Card>
        <CardHeader
          step={1}
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
          <Field label="Languages" htmlFor="languages" hint="Separate with commas, e.g. English (C2), Dutch (A2).">
            <Input id="languages" name="languages" defaultValue={profile?.languages.join(', ') ?? ''} />
          </Field>
          <Field label="Skills" htmlFor="skills" hint="Separate with commas. Your CV adds to this list.">
            <Input id="skills" name="skills" defaultValue={profile?.skills.join(', ') ?? ''} />
          </Field>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">CV</p>
          <label className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input p-4 transition-colors hover:bg-muted focus-within:outline-2 focus-within:outline-primary">
            <input
              type="file"
              name="cv"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setCvFileName(file?.name ?? null);
                setCvError(file && file.size > MAX_CV_MB * 1024 * 1024 ? `Your CV must be under ${MAX_CV_MB} MB.` : null);
              }}
            />
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              {profile?.hasCv && !cvFileName ? <FileText className="size-5" aria-hidden /> : <Upload className="size-5" aria-hidden />}
            </span>
            <span className="min-w-0 text-sm">
              <span className="block truncate font-medium">
                {cvFileName ?? (profile?.hasCv ? 'cv.pdf' : 'Choose your CV (PDF)')}
              </span>
              <span className="block text-muted-foreground">{cvHint}</span>
            </span>
          </label>
          {cvError && <p role="alert" className="mt-1.5 text-sm text-danger">{cvError}</p>}
          {profile?.cvSummary && !cvFileName && (
            <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">What we read from your CV: </span>
              {profile.cvSummary}
            </p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          step={2}
          title="Get to know you"
          description="Your agent looks beyond your CV: what excites you decides which companies, events and people it finds."
        />
        <div className="space-y-4">
          <Field label="Interests & topics" htmlFor="interests" hint="Separate with commas, e.g. robotics, climate tech, AI, fintech.">
            <Input id="interests" name="interests" defaultValue={profile?.interests.join(', ') ?? ''} />
          </Field>
          <Field label="What do you want to achieve?" htmlFor="ambitions" hint="Your ambitions for the next year or two, in your own words.">
            <Textarea
              id="ambitions"
              name="ambitions"
              maxLength={1500}
              placeholder="I want to work on robots that are used in the real world, ideally in a small team where I can learn fast."
              defaultValue={profile?.ambitions ?? ''}
            />
          </Field>
          <Field
            label="What caught your attention lately?"
            htmlFor="recentCuriosity"
            hint="A news story, technology or company you keep reading about. This helps the agent find hidden opportunities."
          >
            <Textarea
              id="recentCuriosity"
              name="recentCuriosity"
              maxLength={1500}
              placeholder="The warehouse robots in Rotterdam, and how startups use AI to plan routes."
              defaultValue={profile?.recentCuriosity ?? ''}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader step={3} title="Your preferences" description="What kind of opportunities should we hunt for?" />
        <div className="space-y-5">
          <Field label="Desired roles" htmlFor="desiredRoles" hint="Separate with commas.">
            <Input id="desiredRoles" name="desiredRoles" defaultValue={preferences?.desiredRoles.join(', ') ?? ''} />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium">Opportunity types</legend>
            <p className="mt-0.5 text-sm text-muted-foreground">Leave empty to get a bit of everything.</p>
            <div className="mt-3 space-y-3">
              {OPPORTUNITY_TYPE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.label}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {group.types.map((type) => {
                      const selected = types.includes(type);
                      return (
                        <Chip key={type} selected={selected} onClick={() => toggleType(type)}>
                          {selected && <Check className="size-3.5" aria-hidden />}
                          {OPPORTUNITY_TYPE_LABELS[type]}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              ))}
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
            description="Only show work you can do fully remote. Events are still shown."
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
        <Button type="submit" disabled={pending || Boolean(cvError)}>
          {pending ? (cvFileName ? 'Reading your CV…' : 'Saving…') : 'Save & continue to search'}
        </Button>
      </div>
    </form>
  );
}
