'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Lock } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, Input, Select } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { SavedNote } from '@/components/ui/SavedNote';
import { Switch } from '@/components/ui/Switch';
import { intlLocale } from '@/i18n/config';
import { useLocale, useT } from '@/i18n/I18nProvider';
import { saveSchedule } from '@/lib/actions/search';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';
import type { ScheduleFrequency, SearchSchedule } from '@/shared/types/SearchSchedule';

const FREQUENCIES: ScheduleFrequency[] = ['daily', 'weekly'];

const nextRunOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
};

function getNextRun({ frequency, dayOfWeek, time }: SearchSchedule, now: Date): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (frequency === 'daily') {
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }

  let daysAhead = (dayOfWeek - now.getDay() + 7) % 7;
  if (daysAhead === 0 && next <= now) daysAhead = 7;
  next.setDate(next.getDate() + daysAhead);
  return next;
}

interface ScheduleCardProps {
  searchProfileId: string;
  initialSchedule: SearchSchedule;
  locked?: boolean; // automations nog niet ontgrendeld (nog nooit betaald)
}

// Timer management: wanneer de search automatisch moet draaien
export function ScheduleCard({ searchProfileId, initialSchedule, locked = false }: ScheduleCardProps) {
  const t = useT();
  const locale = useLocale();
  const [schedule, setSchedule] = useState<SearchSchedule>(initialSchedule);
  const [dirty, setDirty] = useState(false);
  const { state, pending, submit } = useFormAction(saveSchedule);
  // "Nu" pas op de client bepalen, anders verschilt de server-render van de client-render
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  function update(patch: Partial<SearchSchedule>) {
    setSchedule((current) => ({ ...current, ...patch }));
    setDirty(true);
  }

  function handleSave() {
    const formData = new FormData();
    formData.set('searchProfileId', searchProfileId);
    formData.set('enabled', String(schedule.enabled));
    formData.set('frequency', schedule.frequency);
    formData.set('dayOfWeek', String(schedule.dayOfWeek));
    formData.set('time', schedule.time);
    formData.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    setDirty(false);
    submit(formData);
  }

  let nextRunText = t.dashboard.schedule.paused;
  if (schedule.enabled) {
    if (!schedule.time) nextRunText = t.dashboard.schedule.pickTime;
    else if (now)
      nextRunText = t.dashboard.schedule.nextRun(
        new Intl.DateTimeFormat(intlLocale[locale], nextRunOptions).format(getNextRun(schedule, now)),
      );
    else nextRunText = t.dashboard.schedule.nextRunPending;
  }

  return (
    <Card>
      <CardHeader title={t.dashboard.schedule.title} description={t.dashboard.schedule.description} />

      {locked && (
        <Link
          href="/billing"
          className="mb-5 flex items-start gap-2 rounded-lg bg-muted p-3 text-sm transition-colors hover:bg-primary-soft"
        >
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="flex-1">
            {t.dashboard.schedule.locked}{' '}
            <span className="font-medium text-primary">{t.dashboard.schedule.seePacks}</span>
          </span>
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        </Link>
      )}

      <Switch
        id="schedule-enabled"
        label={t.dashboard.schedule.runAutomatically}
        checked={schedule.enabled}
        onChange={(enabled) => update({ enabled })}
        // Vergrendeld: aanzetten kan niet, uitzetten wel
        disabled={locked && !schedule.enabled}
      />

      <fieldset disabled={!schedule.enabled} className="mt-5 space-y-4 disabled:opacity-50">
        <div>
          <p id="schedule-frequency" className="text-sm font-medium">
            {t.dashboard.schedule.frequency}
          </p>
          <div role="group" aria-labelledby="schedule-frequency" className="mt-2 flex gap-2">
            {FREQUENCIES.map((value) => (
              <Chip key={value} selected={schedule.frequency === value} onClick={() => update({ frequency: value })}>
                {t.dashboard.schedule.frequencies[value]}
              </Chip>
            ))}
          </div>
        </div>

        {schedule.frequency === 'weekly' && (
          <Field label={t.dashboard.schedule.day} htmlFor="schedule-day">
            <Select
              id="schedule-day"
              value={schedule.dayOfWeek}
              onChange={(event) => update({ dayOfWeek: Number(event.target.value) })}
            >
              {t.dashboard.schedule.days.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Field label={t.dashboard.schedule.time} htmlFor="schedule-time">
          <Input
            id="schedule-time"
            type="time"
            value={schedule.time}
            onChange={(event) => update({ time: event.target.value })}
          />
        </Field>
      </fieldset>

      <p className="mt-5 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
        <CalendarClock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {nextRunText}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {t.dashboard.schedule.costNote(CREDIT_COST_PER_SEARCH)}
        </p>
        <div className="flex items-center gap-3">
          {state?.message && !dirty && !pending && <SavedNote>{state.message}</SavedNote>}
          <Button size="sm" onClick={handleSave} disabled={pending || (locked && schedule.enabled)}>
            {pending ? t.common.actions.saving : t.common.actions.save}
          </Button>
        </div>
      </div>
      {state?.error && (
        <div className="mt-3">
          <FormMessage state={{ error: state.error }} />
        </div>
      )}
    </Card>
  );
}
