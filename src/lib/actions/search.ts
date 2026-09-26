'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/data/queries';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import { list, optionalInt, optionalText, text, type FormState } from './formState';

// Situatie (profiles) + voorkeuren (search_profiles) opslaan, daarna door naar de search engine
export async function savePreferences(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      nationality: optionalText(formData, 'nationality'),
      search_year_ends_on: optionalText(formData, 'searchYearEndsOn'),
      degree: optionalText(formData, 'degree'),
      field_of_study: optionalText(formData, 'fieldOfStudy'),
      university: optionalText(formData, 'university'),
      graduation_year: optionalInt(formData, 'graduationYear'),
      languages: list(formData, 'languages'),
      skills: list(formData, 'skills'),
    })
    .eq('id', user.id);
  if (profileError) return { error: profileError.message };

  const preferences = {
    desired_roles: list(formData, 'desiredRoles'),
    opportunity_types: list(formData, 'opportunityTypes').filter((type) => type in OPPORTUNITY_TYPE_LABELS),
    locations: list(formData, 'locations'),
    industries: list(formData, 'industries'),
    remote_only: text(formData, 'remoteOnly') === 'true',
    min_salary: optionalInt(formData, 'minSalary'),
  };

  const searchProfileId = optionalText(formData, 'searchProfileId');
  const { error } = searchProfileId
    ? await supabase.from('search_profiles').update(preferences).eq('id', searchProfileId)
    : await supabase.from('search_profiles').insert({ ...preferences, user_id: user.id });
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect('/search');
}

// Timer management: wanneer de search automatisch draait
export async function saveSchedule(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const enabled = text(formData, 'enabled') === 'true';
  const supabase = await createClient();
  const { error } = await supabase
    .from('search_profiles')
    .update({
      schedule_enabled: enabled,
      schedule_frequency: text(formData, 'frequency') === 'weekly' ? 'weekly' : 'daily',
      schedule_day_of_week: optionalInt(formData, 'dayOfWeek') ?? 1,
      schedule_time: text(formData, 'time') || '08:00',
      timezone: text(formData, 'timezone') || 'Europe/Amsterdam',
      // Berekend in de browser (lokale tijd); de n8n-scheduler pakt alles met next_run_at <= now()
      next_run_at: enabled ? optionalText(formData, 'nextRunAt') : null,
    })
    .eq('id', text(formData, 'searchProfileId'))
    .eq('user_id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { message: 'Saved' };
}
