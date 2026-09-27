'use client';

import { useState, type FormEvent } from 'react';
import { Check, FileText, Upload } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { Switch } from '@/components/ui/Switch';
import { useT } from '@/i18n/I18nProvider';
import { savePreferences } from '@/lib/actions/search';
import type { ProfileData, SearchProfileData } from '@/lib/data/queries';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { OPPORTUNITY_TYPE_GROUPS } from '@/shared/constants/opportunityTypes';
import type { OpportunityType } from '@/shared/types/OpportunityType';

const MAX_CV_MB = 5;

interface PreferencesFormProps {
  profile: ProfileData | null;
  searchProfile: SearchProfileData | null;
}

// Stap 1 van de search flow: situatie, "know me" (profiles) + voorkeuren (search_profiles)
export function PreferencesForm({ profile, searchProfile }: PreferencesFormProps) {
  const t = useT();
  const f = t.search.form;
  const preferences = searchProfile?.preferences;
  const { state, pending, submit } = useFormAction(savePreferences);

  const [types, setTypes] = useState<OpportunityType[]>(preferences?.opportunityTypes ?? []);
  const [remoteOnly, setRemoteOnly] = useState(preferences?.remoteOnly ?? false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  function toggleType(type: OpportunityType) {
    setTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cvError) return;
    submit(new FormData(event.currentTarget));
  }

  let cvHint = profile?.hasCv ? f.cvSaved : f.cvHint(MAX_CV_MB);
  if (cvFileName) cvHint = f.cvPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="searchProfileId" value={searchProfile?.id ?? ''} />
      <input type="hidden" name="opportunityTypes" value={types.join(',')} />
      <input type="hidden" name="remoteOnly" value={String(remoteOnly)} />

      <Card>
        <CardHeader step={1} title={f.situationTitle} description={f.situationDescription} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={f.nationality} htmlFor="nationality">
            <Input id="nationality" name="nationality" defaultValue={profile?.nationality ?? ''} />
          </Field>
          <Field label={f.searchYearEndsOn} htmlFor="searchYearEndsOn" hint={f.searchYearHint}>
            <Input id="searchYearEndsOn" name="searchYearEndsOn" type="date" defaultValue={profile?.searchYearEndsOn ?? ''} />
          </Field>
          <Field label={f.degree} htmlFor="degree">
            <Select id="degree" name="degree" defaultValue={profile?.degree ?? ''}>
              <option value="">{f.selectPlaceholder}</option>
              <option>BSc</option>
              <option>MSc</option>
              <option>MBA</option>
              <option>PhD</option>
            </Select>
          </Field>
          <Field label={f.fieldOfStudy} htmlFor="fieldOfStudy">
            <Input id="fieldOfStudy" name="fieldOfStudy" defaultValue={profile?.fieldOfStudy ?? ''} />
          </Field>
          <Field label={f.university} htmlFor="university">
            <Input id="university" name="university" defaultValue={profile?.university ?? ''} />
          </Field>
          <Field label={f.graduationYear} htmlFor="graduationYear">
            <Input
              id="graduationYear"
              name="graduationYear"
              type="number"
              min={1990}
              max={2040}
              defaultValue={profile?.graduationYear ?? ''}
            />
          </Field>
          <Field label={f.languages} htmlFor="languages" hint={f.languagesHint}>
            <Input id="languages" name="languages" defaultValue={profile?.languages.join(', ') ?? ''} />
          </Field>
          <Field label={f.skills} htmlFor="skills" hint={f.skillsHint}>
            <Input id="skills" name="skills" defaultValue={profile?.skills.join(', ') ?? ''} />
          </Field>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">{f.cv}</p>
          <label className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input p-4 transition-colors hover:bg-muted focus-within:outline-2 focus-within:outline-primary">
            <input
              type="file"
              name="cv"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setCvFileName(file?.name ?? null);
                setCvError(file && file.size > MAX_CV_MB * 1024 * 1024 ? f.cvTooLarge(MAX_CV_MB) : null);
              }}
            />
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              {profile?.hasCv && !cvFileName ? <FileText className="size-5" aria-hidden /> : <Upload className="size-5" aria-hidden />}
            </span>
            <span className="min-w-0 text-sm">
              <span className="block truncate font-medium">
                {cvFileName ?? (profile?.hasCv ? 'cv.pdf' : f.chooseCv)}
              </span>
              <span className="block text-muted-foreground">{cvHint}</span>
            </span>
          </label>
          {cvError && <p role="alert" className="mt-1.5 text-sm text-danger">{cvError}</p>}
          {profile?.cvSummary && !cvFileName && (
            <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{f.cvReadLabel}</span>
              {profile.cvSummary}
            </p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader step={2} title={f.knowYouTitle} description={f.knowYouDescription} />
        <div className="space-y-4">
          <Field label={f.interests} htmlFor="interests" hint={f.interestsHint}>
            <Input id="interests" name="interests" defaultValue={profile?.interests.join(', ') ?? ''} />
          </Field>
          <Field label={f.ambitions} htmlFor="ambitions" hint={f.ambitionsHint}>
            <Textarea
              id="ambitions"
              name="ambitions"
              maxLength={1500}
              placeholder={f.ambitionsPlaceholder}
              defaultValue={profile?.ambitions ?? ''}
            />
          </Field>
          <Field label={f.recentCuriosity} htmlFor="recentCuriosity" hint={f.recentCuriosityHint}>
            <Textarea
              id="recentCuriosity"
              name="recentCuriosity"
              maxLength={1500}
              placeholder={f.recentCuriosityPlaceholder}
              defaultValue={profile?.recentCuriosity ?? ''}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader step={3} title={f.preferencesTitle} description={f.preferencesDescription} />
        <div className="space-y-5">
          <Field label={f.desiredRoles} htmlFor="desiredRoles" hint={f.separateWithCommas}>
            <Input id="desiredRoles" name="desiredRoles" defaultValue={preferences?.desiredRoles.join(', ') ?? ''} />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium">{f.opportunityTypes}</legend>
            <p className="mt-0.5 text-sm text-muted-foreground">{f.opportunityTypesHint}</p>
            <div className="mt-3 space-y-3">
              {OPPORTUNITY_TYPE_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t.common.opportunityTypeGroups[group.id]}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {group.types.map((type) => {
                      const selected = types.includes(type);
                      return (
                        <Chip key={type} selected={selected} onClick={() => toggleType(type)}>
                          {selected && <Check className="size-3.5" aria-hidden />}
                          {t.common.opportunityTypes[type]}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={f.locations} htmlFor="locations" hint={f.separateWithCommas}>
              <Input id="locations" name="locations" defaultValue={preferences?.locations.join(', ') ?? ''} />
            </Field>
            <Field label={f.industries} htmlFor="industries" hint={f.separateWithCommas}>
              <Input id="industries" name="industries" defaultValue={preferences?.industries.join(', ') ?? ''} />
            </Field>
            <Field label={f.minSalary} htmlFor="minSalary" hint={f.optional}>
              <Input id="minSalary" name="minSalary" type="number" min={0} step={100} defaultValue={preferences?.minSalary ?? ''} />
            </Field>
          </div>

          <Switch
            id="remoteOnly"
            label={f.remoteOnly}
            description={f.remoteOnlyDescription}
            checked={remoteOnly}
            onChange={setRemoteOnly}
          />
        </div>
      </Card>

      <FormMessage state={state} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href={searchProfile ? '/search' : '/dashboard'} variant="ghost">
          {t.common.actions.cancel}
        </ButtonLink>
        <Button type="submit" disabled={pending || Boolean(cvError)}>
          {pending ? (cvFileName ? f.readingCv : t.common.actions.saving) : f.submit}
        </Button>
      </div>
    </form>
  );
}
