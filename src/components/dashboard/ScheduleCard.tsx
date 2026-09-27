'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Coins, Lock, Repeat } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
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

/**
 * Automatisch zoeken: compacte samenvatting (status, schema, volgende keer, kosten) met
 * "Manage schedule", dat de instellingen openklapt. Opslaan werkt via saveSchedule, zoals altijd.
 */
export function ScheduleCard({ searchProfileId, initialSchedule, locked = false }: ScheduleCardProps) {
  const t = useT();
  const s = t.dashboard.schedule;
  const h = t.dashboard.home;
  const locale = useLocale();
  const [schedule, setSchedule] = useState<SearchSchedule>(initialSchedule);
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState(false);
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

  const active = schedule.enabled && Boolean(schedule.time);
  const cadence = schedule.time
    ? schedule.frequency === 'daily'
      ? h.scheduleDaily(schedule.time)
      : h.scheduleWeekly(s.days[schedule.dayOfWeek], schedule.time)
    : s.pickTime;

  let nextRunText = s.paused;
  if (schedule.enabled) {
    if (!schedule.time) nextRunText = s.pickTime;
    else if (now) nextRunText = new Intl.DateTimeFormat(intlLocale[locale], nextRunOptions).format(getNextRun(schedule, now));
    else nextRunText = '…';
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold tracking-tight">{s.title}</h2>
        <Badge tone={locked ? 'neutral' : active ? 'success' : 'neutral'}>
          {locked ? h.scheduleLocked : active ? h.scheduleActive : h.schedulePaused}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{h.scheduleDescription}</p>

      {locked && (
        <Link
          href="/billing"
          className="mt-4 flex items-start gap-2 rounded-lg bg-muted p-3 text-sm transition-colors hover:bg-primary-soft"
        >
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="flex-1">
            {s.locked} <span className="font-medium text-primary">{s.seePacks}</span>
          </span>
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        </Link>
      )}

      {!editing ? (
        <>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <Repeat className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <dt className="sr-only">{s.frequency}</dt>
                <dd className="font-medium">{s.frequencies[schedule.frequency]}</dd>
                <dd className="text-muted-foreground">{cadence}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <dt className="text-xs text-muted-foreground">{h.nextRun}</dt>
                <dd className="font-medium" suppressHydrationWarning>
                  {nextRunText}
                </dd>
              </div>
            </div>
          </dl>
          <p className="mt-2.5 flex items-center gap-2.5 text-sm text-muted-foreground">
            <Coins className="size-4 shrink-0" aria-hidden />
            {h.usesCredit(CREDIT_COST_PER_SEARCH)}
          </p>
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)} className="mt-4 w-full">
            {h.manage}
          </Button>
        </>
      ) : (
        <div className="mt-4">
          <Switch
            id="schedule-enabled"
            label={s.runAutomatically}
            checked={schedule.enabled}
            onChange={(enabled) => update({ enabled })}
            // Vergrendeld: aanzetten kan niet, uitzetten wel
            disabled={locked && !schedule.enabled}
          />

          <fieldset disabled={!schedule.enabled} className="mt-5 space-y-4 disabled:opacity-50">
            <div>
              <p id="schedule-frequency" className="text-sm font-medium">
                {s.frequency}
              </p>
              <div role="group" aria-labelledby="schedule-frequency" className="mt-2 flex gap-2">
                {FREQUENCIES.map((value) => (
                  <Chip key={value} selected={schedule.frequency === value} onClick={() => update({ frequency: value })}>
                    {s.frequencies[value]}
                  </Chip>
                ))}
              </div>
            </div>

            {schedule.frequency === 'weekly' && (
              <Field label={s.day} htmlFor="schedule-day">
                <Select id="schedule-day" value={schedule.dayOfWeek} onChange={(event) => update({ dayOfWeek: Number(event.target.value) })}>
                  {s.days.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            <Field label={s.time} htmlFor="schedule-time">
              <Input id="schedule-time" type="time" value={schedule.time} onChange={(event) => update({ time: event.target.value })} />
            </Field>
          </fieldset>

          <p className="mt-4 text-xs text-muted-foreground">{s.costNote(CREDIT_COST_PER_SEARCH)}</p>
          <div className="mt-4 flex items-center justify-end gap-2">
            {state?.message && !dirty && !pending && <SavedNote>{state.message}</SavedNote>}
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              {h.done}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={pending || (locked && schedule.enabled)}>
              {pending ? t.common.actions.saving : t.common.actions.save}
            </Button>
          </div>
        </div>
      )}
      {state?.error && (
        <div className="mt-3">
          <FormMessage state={{ error: state.error }} />
        </div>
      )}
    </Card>
  );
}
