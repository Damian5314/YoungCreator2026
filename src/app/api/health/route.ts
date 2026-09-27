import { NextResponse } from 'next/server';
import { env, features } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Controleert of een tabel uit een migratie bestaat (zonder data te lezen)
async function tableStatus(table: string): Promise<'ok' | 'missing' | 'error'> {
  try {
    const { error } = await createAdminClient().from(table).select('id', { head: true, count: 'exact' }).limit(1);
    if (!error) return 'ok';
    return error.code === '42P01' || error.code === 'PGRST205' ? 'missing' : 'error';
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
      }
    : 'not-configured';

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
      ai: env.aiProvider
        ? { provider: env.aiProvider, model: env.aiProvider === 'openai' ? env.openaiModel : env.anthropicModel }
        : 'rules only (no OPENAI_API_KEY or ANTHROPIC_API_KEY)',
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
