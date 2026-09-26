export type ScheduleFrequency = 'daily' | 'weekly';

// Wanneer de search automatisch draait (later: cron-trigger voor de n8n workflow)
export interface SearchSchedule {
  userId: string;
  enabled: boolean;
  frequency: ScheduleFrequency;
  dayOfWeek: number; // 0 = zondag ... 6 = zaterdag, alleen gebruikt bij 'weekly'
  time: string;      // 'HH:mm', lokale tijd
}
