// Async wachtrij voor zware scraping-jobs zodat de API snel blijft reageren
export interface IJobQueue {
  enqueue<T>(jobName: string, data: T, options?: JobOptions): Promise<string>;
  onProcess<T>(jobName: string, handler: (data: T) => Promise<void>): void;
}

export interface JobOptions {
  delayMs?: number;
  repeatCron?: string; // voor periodieke company hunter jobs
  priority?: number;
}
