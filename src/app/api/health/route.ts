import { NextResponse } from 'next/server';
import { env, features } from '@/lib/env';
import { isPublicUrl } from '@/lib/mollie';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

type MigrationStatus = 'ok' | 'missing' | 'error';

// Controleert of een tabel (of kolom) uit een migratie bestaat. limit(0): geen data lezen,
// maar wel een foutcode terugkrijgen (een HEAD-request heeft geen body en dus geen code).
async function tableStatus(table: string, column = 'id'): Promise<MigrationStatus> {
  try {
    const { error } = await createAdminClient().from(table).select(column).limit(0);
    if (!error) return 'ok';
    return ['42P01', 'PGRST205', '42703', 'PGRST204'].includes(error.code) ? 'missing' : 'error';
  } catch {
    return 'error';
  }
}

// GET /api/health — wat is er gekoppeld? Alleen ja/nee en statussen, nooit geheimen.
export async function GET() {
  const database = env.supabaseUrl && env.supabaseSecretKey
    ? {
        initialSchema: await tableStatus('search_runs'),
        agentPipeline: await tableStatus('outreach_messages'),
        onboardingIntro: await tableStatus('profiles', 'onboarded_at'),
        billing: await tableStatus('payments'),
      }
    : 'not-configured';

  // Halve configuraties die pas tijdens een demo zouden opvallen
  const warnings: string[] = [];
  if (database === 'not-configured') warnings.push('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.');
  else if (Object.values(database).some((status) => status !== 'ok'))
    warnings.push('Run the missing migrations in supabase/migrations (in order).');
  const usesN8n = Boolean(env.n8nSearchWebhookUrl || env.n8nSendEmailWebhookUrl);
  if (usesN8n && !env.n8nSecret) warnings.push('N8N_SECRET is empty: n8n cannot authenticate, results will be rejected.');
  if (env.n8nSearchWebhookUrl && !env.appUrl)
    warnings.push('APP_URL is empty: n8n gets the request origin as callback URL (localhost is not reachable from n8n cloud).');
  if (env.appUrl && /localhost|127\.0\.0\.1/.test(env.appUrl) && env.n8nSearchWebhookUrl && !/localhost|127\.0\.0\.1/.test(env.n8nSearchWebhookUrl))
    warnings.push('APP_URL points to localhost while n8n runs elsewhere: use a tunnel (ngrok) or the deployed URL.');
  if (env.mollieApiKey && !/^(test|live)_\w+$/.test(env.mollieApiKey))
    warnings.push('MOLLIE_API_KEY should start with test_ or live_ (copy it from Mollie → Developers → API keys).');
  if (env.mollieApiKey && !isPublicUrl(`${env.appUrl ?? ''}/api/mollie/webhook`))
    warnings.push('Mollie webhooks are off because APP_URL is not a public https URL: payments are confirmed when the student returns from the checkout.');

  return NextResponse.json(
    {
      ok: true,
      mode: features.demoMode ? 'demo (no n8n search webhook)' : 'n8n',
      appUrl: env.appUrl ?? null,
      database,
      n8n: {
        searchWebhook: Boolean(env.n8nSearchWebhookUrl),
        sendEmailWebhook: Boolean(env.n8nSendEmailWebhookUrl),
        secret: Boolean(env.n8nSecret),
      },
      payments: env.mollieApiKey
        ? { provider: 'mollie', mode: features.paymentsTestMode ? 'test' : 'live', webhook: isPublicUrl(`${env.appUrl ?? ''}/api/mollie/webhook`) }
        : 'not-configured (no MOLLIE_API_KEY)',
      ai: env.aiProvider
        ? { provider: env.aiProvider, model: env.aiProvider === 'openai' ? env.openaiModel : env.anthropicModel }
        : 'rules only (no OPENAI_API_KEY or ANTHROPIC_API_KEY)',
      warnings,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
