// D: High-level modules (agents) afhankelijk van deze abstractie, niet van concrete scrapers
export interface IAgent<TInput, TOutput> {
  readonly agentName: string;
  run(input: TInput): Promise<TOutput>;
}
