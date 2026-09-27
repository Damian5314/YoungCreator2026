'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/data/queries';
import { requestOrigin } from '@/lib/requestOrigin';
import { AUTOMATIONS_LOCKED_MESSAGE, hasPaidAccess } from '@/modules/billing/entitlements';
import { CVParser } from '@/modules/profile/CVParser';
import { startSearchRun } from '@/modules/pipeline/startRun';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import { list, mergeUnique, optionalInt, optionalText, text, type FormState } from './formState';

const MAX_CV_BYTES = 5 * 1024 * 1024;

type CvResult =
  | { ok: true; update: Record<string, unknown>; skills: string[]; interests: string[]; languages: string[] }
  | { ok: false; error: string };

// CV uploaden naar de privé bucket en uitlezen (tekst + met AI: skills, talen, interesses)
async function processCv(userId: string, file: File): Promise<CvResult> {
  if (file.size > MAX_CV_BYTES) return { ok: false, error: 'Your CV must be a PDF under 5 MB.' };
  const buffer = await file.arrayBuffer();
  const isPdf = new TextDecoder().decode(new Uint8Array(buffer, 0, Math.min(5, buffer.byteLength))) === '%PDF-';
  if (!isPdf) return { ok: false, error: 'Upload your CV as a PDF file.' };

  let parsed;
  try {
    parsed = await new CVParser().parseFromPDF(buffer);
  } catch (error) {
    console.error('[cv] parsing failed', error);
    return { ok: false, error: 'We couldn’t read this PDF. Try exporting it again from Word or Google Docs.' };
  }

  const path = `${userId}/cv.pdf`;
  const { error: uploadError } = await createAdminClient()
    .storage.from('cvs')
    .upload(path, buffer, { contentType: 'application/pdf', upsert: true });
  if (uploadError) {
    console.error('[cv] upload failed', uploadError);
    return { ok: false, error: 'Uploading your CV failed. Please try again.' };
  }

  return {
    ok: true,
    update: {
      cv_file_path: path,
      cv_text: parsed.rawText,
      cv_parsed: {
        summary: parsed.summary,
        skills: parsed.skills,
        languages: parsed.languages,
        interests: parsed.interests,
        education: parsed.education,
        experience: parsed.experience,
      },
    },
    skills: parsed.skills,
    interests: parsed.interests,
    languages: parsed.languages,
  };
}

// Situatie + "know me" (profiles) en voorkeuren (search_profiles) opslaan, daarna door naar de search engine
export async function savePreferences(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  let cv: CvResult | null = null;
  const cvFile = formData.get('cv');
  if (cvFile instanceof File && cvFile.size > 0) {
    cv = await processCv(user.id, cvFile);
    if (!cv.ok) return { error: cv.error };
  }

  const graduationYear = optionalInt(formData, 'graduationYear');
  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      nationality: optionalText(formData, 'nationality', 100),
      search_year_ends_on: optionalText(formData, 'searchYearEndsOn', 10),
      degree: optionalText(formData, 'degree', 20),
      field_of_study: optionalText(formData, 'fieldOfStudy', 200),
      university: optionalText(formData, 'university', 200),
      graduation_year: graduationYear && graduationYear >= 1950 && graduationYear <= 2100 ? graduationYear : null,
      // Wat de student zelf invult gaat voor; het cv vult aan
      languages: mergeUnique(list(formData, 'languages'), cv?.ok ? cv.languages : [], 15),
      skills: mergeUnique(list(formData, 'skills'), cv?.ok ? cv.skills : []),
      interests: mergeUnique(list(formData, 'interests'), cv?.ok ? cv.interests : [], 20),
      ambitions: optionalText(formData, 'ambitions', 1500),
      recent_curiosity: optionalText(formData, 'recentCuriosity', 1500),
      ...(cv?.ok ? cv.update : {}),
    })
    .eq('id', user.id);
  if (profileError) {
    console.error('[search] savePreferences: profile update failed', profileError);
    return { error: profileError.message };
  }

  const minSalary = optionalInt(formData, 'minSalary');
  const preferences = {
    desired_roles: list(formData, 'desiredRoles', 10),
    opportunity_types: list(formData, 'opportunityTypes').filter((type) => type in OPPORTUNITY_TYPE_LABELS),
    locations: list(formData, 'locations', 10),
    industries: list(formData, 'industries', 15),
    remote_only: text(formData, 'remoteOnly') === 'true',
    min_salary: minSalary && minSalary > 0 ? minSalary : null,
  };

  const searchProfileId = optionalText(formData, 'searchProfileId');
  const { error } = searchProfileId
    ? await supabase.from('search_profiles').update(preferences).eq('id', searchProfileId).eq('user_id', user.id)
    : await supabase.from('search_profiles').insert({ ...preferences, user_id: user.id });
  if (error) {
    console.error('[search] savePreferences: search_profiles upsert failed', error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/search');
}

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat('en', { timeZone });
    return true;
  } catch {
    return false;
  }
}

// Timer management: wanneer de search automatisch draait. next_run_at rekent de database zelf uit.
export async function saveSchedule(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const time = text(formData, 'time');
  const timezone = text(formData, 'timezone');
  const dayOfWeek = optionalInt(formData, 'dayOfWeek') ?? 1;
  const enabled = text(formData, 'enabled') === 'true';
  // Automatisch zoeken is een automation: alleen aanzetten met een betaald account
  if (enabled && !(await hasPaidAccess(user.id))) return { error: AUTOMATIONS_LOCKED_MESSAGE };

  const supabase = await createClient();
  const { error } = await supabase
    .from('search_profiles')
    .update({
      schedule_enabled: enabled,
      schedule_frequency: text(formData, 'frequency') === 'weekly' ? 'weekly' : 'daily',
      schedule_day_of_week: dayOfWeek >= 0 && dayOfWeek <= 6 ? dayOfWeek : 1,
      schedule_time: /^\d{2}:\d{2}$/.test(time) ? time : '08:00',
      timezone: isValidTimeZone(timezone) ? timezone : 'Europe/Amsterdam',
    })
    .eq('id', text(formData, 'searchProfileId'))
    .eq('user_id', user.id);
  if (error) {
    console.error('[search] saveSchedule: schedule update failed', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { message: 'Saved' };
}

const startSearchInput = z.object({
  includeHidden: z.boolean(),
  includeHunting: z.boolean(),
});

// Handmatige zoekopdracht vanuit de search engine
export async function startSearch(input: z.input<typeof startSearchInput>): Promise<{ runId?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Your session expired. Please log in again.' };

  const parsed = startSearchInput.safeParse(input);
  if (!parsed.success) return { error: 'Invalid search options.' };

  try {
    const supabase = await createClient();
    // De schakelaars onthouden als standaard voor volgende (ook geplande) zoekopdrachten
    await supabase
      .from('search_profiles')
      .update({ include_radar: parsed.data.includeHidden, include_company_hunter: parsed.data.includeHunting })
      .eq('user_id', user.id);

    const result = await startSearchRun({
      userId: user.id,
      trigger: 'manual',
      options: {
        includeHiddenOpportunities: parsed.data.includeHidden,
        includeCompanyHunting: parsed.data.includeHunting,
      },
      origin: await requestOrigin(),
    });
    if (!result.ok) return { error: result.error };

    revalidatePath('/', 'layout'); // creditsaldo in de header
    return { runId: result.runId };
  } catch (error) {
    console.error('[search] starting a run failed', error);
    return { error: 'Something went wrong while starting your search. Please try again.' };
  }
}
