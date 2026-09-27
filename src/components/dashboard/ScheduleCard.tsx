'use client';

import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, Input, Select } from '@/components/ui/Field';
import { FormMessage } from '@/components/ui/FormMessage';
import { SavedNote } from '@/components/ui/SavedNote';
import { Switch } from '@/components/ui/Switch';
import { saveSchedule } from '@/lib/actions/search';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { CREDIT_COST_PER_SEARCH } from '@/shared/constants/opportunityTypes';
import type { ScheduleFrequency, SearchSchedule } from '@/shared/types/SearchSchedule';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FREQUENCIES: { value: ScheduleFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const nextRunFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

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
}

// Timer management: wanneer de search automatisch moet draaien
export function ScheduleCard({ searchProfileId, initialSchedule }: ScheduleCardProps) {
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

  let nextRunText = 'Automatic search is paused.';
  if (schedule.enabled) {
    if (!schedule.time) nextRunText = 'Pick a time to schedule your search.';
    else if (now) nextRunText = `Next run: ${nextRunFormat.format(getNextRun(schedule, now))}`;
    else nextRunText = 'Next run: …';
  }

  return (
    <Card>
      <CardHeader title="Automatic search" description="Let JobHunter search for you on a schedule." />

      <Switch
        id="schedule-enabled"
        label="Run automatically"
        checked={schedule.enabled}
        onChange={(enabled) => update({ enabled })}
      />

      <fieldset disabled={!schedule.enabled} className="mt-5 space-y-4 disabled:opacity-50">
        <div>
          <p id="schedule-frequency" className="text-sm font-medium">
            Frequency
          </p>
          <div role="group" aria-labelledby="schedule-frequency" className="mt-2 flex gap-2">
            {FREQUENCIES.map(({ value, label }) => (
              <Chip key={value} selected={schedule.frequency === value} onClick={() => update({ frequency: value })}>
                {label}
              </Chip>
            ))}
          </div>
        </div>

        {schedule.frequency === 'weekly' && (
          <Field label="Day" htmlFor="schedule-day">
            <Select
              id="schedule-day"
              value={schedule.dayOfWeek}
              onChange={(event) => update({ dayOfWeek: Number(event.target.value) })}
            >
              {DAYS.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Field label="Time" htmlFor="schedule-time">
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
          Each run uses {CREDIT_COST_PER_SEARCH} credit. Your agent also prepares emails for the best matches.
        </p>
        <div className="flex items-center gap-3">
          {state?.message && !dirty && !pending && <SavedNote>{state.message}</SavedNote>}
          <Button size="sm" onClick={handleSave} disabled={pending}>
            {pending ? 'Saving…' : 'Save'}
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
