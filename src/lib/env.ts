import 'server-only';

// Server-side configuratie. Alles behalve Supabase is optioneel:
// zonder n8n draait de app in demo-modus, zonder AI-key gebruikt hij simpele regels.
function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export type AiProvider = 'openai' | 'anthropic';

function aiProvider(): AiProvider | null {
  const forced = optional('AI_PROVIDER')?.toLowerCase();
  if (forced === 'openai' && optional('OPENAI_API_KEY')) return 'openai';
  if (forced === 'anthropic' && optional('ANTHROPIC_API_KEY')) return 'anthropic';
  if (optional('OPENAI_API_KEY')) return 'openai';
  if (optional('ANTHROPIC_API_KEY')) return 'anthropic';
  return null;
}

export const env = {
  supabaseUrl: optional('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseSecretKey: optional('SUPABASE_SECRET_KEY'),
  // Publieke URL van deze app; n8n stuurt hier zijn resultaten naartoe
  appUrl: optional('APP_URL')?.replace(/\/+$/, ''),
  // n8n: webhook die een zoekopdracht start en webhook die een e-mail verstuurt
  n8nSearchWebhookUrl: optional('N8N_SEARCH_WEBHOOK_URL'),
  n8nSendEmailWebhookUrl: optional('N8N_SEND_EMAIL_WEBHOOK_URL'),
  // Gedeeld geheim, beide kanten op: app → n8n (header) en n8n → app (Bearer)
  n8nSecret: optional('N8N_SECRET'),
  // AI: OpenAI of Claude. Met beide keys kiest AI_PROVIDER, anders OpenAI.
  aiProvider: aiProvider(),
  openaiApiKey: optional('OPENAI_API_KEY'),
  openaiModel: optional('OPENAI_MODEL') ?? 'gpt-5-mini',
  openaiBaseUrl: (optional('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1').replace(/\/+$/, ''),
  anthropicApiKey: optional('ANTHROPIC_API_KEY'),
  anthropicModel: optional('ANTHROPIC_MODEL') ?? 'claude-opus-5',
};

export const features = {
  // Zonder zoek-webhook levert de app zelf voorbeelddata, zodat de hele flow te testen is
  demoMode: !env.n8nSearchWebhookUrl,
  canSendEmail: Boolean(env.n8nSendEmailWebhookUrl),
  ai: env.aiProvider !== null,
};
