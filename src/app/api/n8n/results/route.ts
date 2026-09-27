import { after, NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedN8nRequest } from '@/lib/n8n';
import { failRun, ingestResults } from '@/modules/pipeline/ingest';
import { ingestEnvelopeSchema, parseIngestItems } from '@/modules/pipeline/schema';

// Scoren met AI kan even duren; de verwerking loopt na het antwoord aan n8n door
export const maxDuration = 300;

// POST /api/n8n/results — n8n levert de gevonden kansen voor een run aan.
// Auth: "Authorization: Bearer <N8N_SECRET>". Zie docs/n8n.md voor het formaat.
export async function POST(request: NextRequest) {
  if (!isAuthorizedN8nRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const envelope = ingestEnvelopeSchema.safeParse(json);
  if (!envelope.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: envelope.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`) },
      { status: 400 },
    );
  }

  const { runId, done, error } = envelope.data;
  const { items, rejected } = parseIngestItems(envelope.data.items);

  after(async () => {
    try {
      const summary = await ingestResults({ runId, items, done, error });
      if (summary) console.info(`[n8n] run ${runId}: ${summary.found} found, ${summary.newMatches} new matches`);
    } catch (ingestError) {
      console.error(`[n8n] processing run ${runId} failed`, ingestError);
      await failRun(runId, ingestError instanceof Error ? ingestError.message : 'Processing failed');
    }
  });

  return NextResponse.json({ ok: true, accepted: items.length, rejected }, { status: 202 });
}
