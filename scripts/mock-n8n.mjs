// Lokale nep-n8n om de koppeling te testen zonder n8n of Apify.
// Doet precies wat de echte workflows doen: zoekverzoek aannemen, ruwe (Apify-achtige) resultaten
// terugsturen naar de app, en "verstuurde" e-mails loggen in plaats van ze echt te versturen.
//
// Gebruik (in een tweede terminal, naast `npm run dev`):
//   npm run mock:n8n
// en zet in .env.local (daarna de dev-server herstarten):
//   N8N_SEARCH_WEBHOOK_URL=http://localhost:5679/webhook/jobhunter-search
//   N8N_SEND_EMAIL_WEBHOOK_URL=http://localhost:5679/webhook/jobhunter-send-email
//   N8N_SECRET=<zelfde geheim als de app>
//   APP_URL=http://localhost:3000

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const PORT = Number(process.env.MOCK_N8N_PORT ?? 5679);
const SECRET = process.env.N8N_SECRET ?? '';
let executions = 0;

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

// Eén nep-zoekresultaat per regel van het zoekplan, in hetzelfde formaat als de Apify-workflow
function fakeResults(plan) {
  return plan.flatMap(({ query, kind }, index) => {
    const company = ['Nordwind Robotics', 'Grachtwerk', 'Polder Data', 'Havenlicht Energy', 'Tulpstack'][index % 5];
    const site = `https://${slug(company)}.example`;
    const topic = query.replace(/\b(events?|hackathon|startups?|company news|internship|netherlands)\b/gi, '').trim();
    switch (kind) {
      case 'internship':
      case 'job':
        return [
          {
            title: `${company} hiring ${topic} in Rotterdam | LinkedIn`,
            url: `https://www.linkedin.com/jobs/view/${1000 + index}`,
            description: `${company} is looking for a ${topic}. You will work with Python and SQL in a small team.`,
          },
        ];
      case 'event':
      case 'hackathon':
        return [
          {
            title: `${topic} ${kind === 'hackathon' ? 'Hackathon' : 'Meetup'} at ${company}`,
            url: `${site}/events/${slug(topic)}`,
            description: `Join ${company} on 14 November 2026 in Rotterdam for talks, demos and drinks.`,
            contact: { email: `events@${slug(company)}.example` },
          },
        ];
      case 'news':
        return [
          {
            title: `${company} raises €8M and opens a second office in Rotterdam`,
            url: `https://www.emerce.nl/nieuws/${slug(company)}-funding`,
            description: `${company} will double its engineering team over the next year.`,
          },
        ];
      default:
        return [
          {
            title: `${company} — ${topic}`,
            url: `${site}/`,
            description: `${company} builds ${topic} products and is growing its team in the Netherlands.`,
            contact: { email: `jobs@${slug(company)}.example` },
          },
        ];
    }
  }).map((item, index) => ({ ...item, kind: plan[Math.min(index, plan.length - 1)]?.kind, query: plan[Math.min(index, plan.length - 1)]?.query, source: 'web' }));
}

async function deliver(body) {
  const plan = body.searchPlan?.length ? body.searchPlan : (body.searchQueries ?? []).map((query) => ({ query, kind: 'job' }));
  const items = fakeResults(plan);
  const response = await fetch(body.callbackUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${SECRET}` },
    body: JSON.stringify({ runId: body.runId, done: true, items }),
  });
  console.log(`  → ${items.length} resultaten naar ${body.callbackUrl}: ${response.status} ${await response.text()}`);
}

function readJson(request) {
  return new Promise((resolve) => {
    let data = '';
    request.on('data', (chunk) => (data += chunk));
    request.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve(null);
      }
    });
  });
}

function send(response, status, json) {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(json));
}

createServer(async (request, response) => {
  if (request.method !== 'POST') return send(response, 404, { error: 'Not found' });
  if (SECRET && request.headers['x-jobhunter-secret'] !== SECRET) {
    console.log(`✗ ${request.url}: verkeerd of ontbrekend x-jobhunter-secret`);
    return send(response, 401, { error: 'Unauthorized' });
  }
  const body = await readJson(request);
  if (!body) return send(response, 400, { error: 'Invalid JSON' });

  if (request.url === '/webhook/jobhunter-search') {
    const executionId = `mock-${++executions}`;
    console.log(`▶ zoekverzoek run ${body.runId} (${body.searchPlan?.length ?? 0} zoektermen, ${body.trigger})`);
    send(response, 200, { executionId });
    setTimeout(() => deliver(body).catch((error) => console.error('  ✗ terugsturen mislukt:', error.message)), 1500);
    return;
  }

  if (request.url === '/webhook/jobhunter-send-email') {
    console.log(`✉ "verstuurd" (niet echt) aan ${body.to?.email}: ${body.subject}`);
    return send(response, 200, { ok: true, messageId: body.messageId });
  }

  send(response, 404, { error: 'Unknown webhook' });
}).listen(PORT, () => {
  console.log(`Mock n8n draait op http://localhost:${PORT}`);
  console.log(`  zoeken:  http://localhost:${PORT}/webhook/jobhunter-search`);
  console.log(`  mailen:  http://localhost:${PORT}/webhook/jobhunter-send-email`);
  if (!SECRET) console.log('  let op: N8N_SECRET is leeg, de app accepteert dan geen resultaten');
});
