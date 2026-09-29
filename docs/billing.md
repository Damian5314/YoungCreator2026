# Betalen met Mollie

Studenten betalen per gebruik, zonder abonnement. Alles zit al in de code: je hebt alleen een Mollie API-key nodig.

## Regels

| | Gratis | Na een aankoop |
|---|---|---|
| Zoekopdracht (handmatig of gepland) | De eerste is gratis (1 welkomstcredit) | 1 credit per zoekopdracht |
| Automatisch zoeken (planning) | Vergrendeld | Beschikbaar, 1 credit per run |
| Automatiseringsniveau 2 en 3 (JobHunter verstuurt mails) | Vergrendeld; niveau 1 (zelf versturen) werkt | Beschikbaar |
| Credits | Verlopen nooit; mislukte zoekopdracht = credit terug | Idem |

- Pakketten en prijzen staan op één plek: `src/modules/billing/plans.ts` (Starter 10 credits €4,99, Plus 30 credits €11,99, Pro 75 credits €24,99).
- "Automations ontgrendeld" betekent: minstens één betaling met status `paid` (`public.has_paid_access`).
- Zonder `MOLLIE_API_KEY` kun je niets kopen en staat de betaalmuur voor automations uit (handig bij lokaal ontwikkelen). Zoekopdrachten kosten altijd credits.
- Geplande zoekopdrachten van gebruikers zonder betaald account of zonder credits worden overgeslagen, dus er komen geen mislukte runs. Na het opwaarderen pakt de volgende scheduler-ronde ze weer op.

## Instellen (± 5 minuten)

1. Draai de migratie `supabase/migrations/20260927130000_billing_mollie.sql`.
2. Ga in Mollie naar **Developers → API keys** en kopieer de **Test API key** (`test_…`).
3. Zet in `.env.local` en in Vercel:
   ```
   MOLLIE_API_KEY=test_...
   APP_URL=https://<jouw-app>.vercel.app   # publieke https-URL, anders geen webhooks (zie hieronder)
   ```
4. Controleer `GET /api/health` met de header `Authorization: Bearer <N8N_SECRET>` (zonder token toont hij alleen of de app en database werken): `payments.mode` = `test` en `database.billing` = `ok`.

Met een test-key toont de app "Test mode" op `/billing`. Mollie laat een testcheckout zien waarin je zelf kiest of de betaling lukt (paid, failed, canceled, expired). Er wordt geen echt geld afgeschreven.

## Hoe een betaling loopt

```
/billing → "Buy" → server action buyCredits
  → rij in payments (status open) → POST https://api.mollie.com/v2/payments (Idempotency-Key = onze payment-id)
  → redirect naar de Mollie-checkout
Mollie → POST /api/mollie/webhook (id=tr_…)       ─┐
Student terug op /billing/return?payment=<id>      ─┴→ GET /v2/payments/{id} bij Mollie (fetch-to-confirm)
  → public.apply_payment_status: status bijwerken; bij 'paid' precies één keer credits bijschrijven
```

- **De browser bewijst niets.** De status komt altijd van de Mollie API. De webhook bevat alleen een id en is niet ondertekend, dus die vertrouwen we niet.
- **Idempotent.** `credit_transactions.payment_id` is uniek, en de database schrijft per betaling maar één keer bij. Webhook en terugkeerpagina mogen allebei (vaker) draaien.
- **Bedrag gecontroleerd.** Credits worden alleen bijgeschreven als het bedrag bij Mollie gelijk is aan wat wij hebben aangemaakt.
- **Webhook-antwoorden.** 200 bij succes en bij onbekende ids. 500 bij een tijdelijke fout, dan probeert Mollie het later opnieuw (tot 10 keer, 26 uur lang).
- **Lokaal (localhost).** Mollie kan de webhook niet bereiken, dus de app stuurt dan geen `webhookUrl` mee. De betaling wordt bevestigd als de student terugkomt op `/billing/return`. Wil je ook de webhook lokaal testen? Gebruik `ngrok http 3000` en zet die https-URL in `APP_URL`.
- **Afgebroken checkout.** Als de student terugkomt zonder te betalen, blijft een Mollie-betaling zonder vaste methode vaak op `open` staan. De terugkeerpagina toont dan "Waiting for your payment" en ververst zichzelf een minuut lang.

## Testen

1. Log in met een nieuw account: 1 credit. Doe een zoekopdracht; daarna toont Search "Buy credits" en het dashboard "You've used your free search".
2. Automatisch zoeken (dashboard) en niveau 2/3 (Settings) staan op slot.
3. `/billing` → "Buy 30 credits" → kies in de Mollie-testcheckout **Paid** → je komt terug op "Payment received", het saldo is +30 en de automations zijn ontgrendeld.
4. Herhaal met **Failed** of **Canceled**: de terugkeerpagina meldt het, er worden geen credits bijgeschreven en de betaling staat in de geschiedenis.
5. Webhook met de hand (id van een bestaande testbetaling):
   ```bash
   curl -X POST "$APP_URL/api/mollie/webhook" -d "id=tr_xxxxxxxx"
   ```

## Demo-account opwaarderen

Nieuwe accounts krijgen 1 credit. Voor een demo met meerdere zoekopdrachten:

- **Met een test-key (aanrader):** koop op `/billing` een pakket en kies **Paid** in de testcheckout. Dat laat meteen de hele betaalflow zien en ontgrendelt ook de automations.
- **Zonder Mollie:** schrijf credits bij in Supabase → SQL editor (de betaalmuur voor automations staat zonder key al uit):
  ```sql
  insert into public.credit_transactions (user_id, amount, reason)
  select id, 50, 'bonus' from auth.users where email = 'demo@jouwdomein.nl';
  ```

## Live gaan

- [ ] Mollie-account geactiveerd (KvK, bankrekening), gewenste betaalmethodes aangezet (iDEAL, kaart, Bancontact).
- [ ] `MOLLIE_API_KEY=live_…` in Vercel (Production), `APP_URL` = het exacte productiedomein. Let op: een redirect (bv. van `www.` of een trailing slash) verandert de webhook-POST in een GET, dus gebruik exact de URL waar de app draait.
- [ ] Prijzen en btw-vermelding gecontroleerd (`plans.ts`, tekst op `/billing`); algemene voorwaarden en privacyverklaring gelinkt in Mollie → Settings → Checkout.
- [ ] Refunds en chargebacks: Mollie roept dezelfde webhook aan. Credits worden nu nog niet automatisch teruggenomen (zie backlog).

## Backlog

- Credits terugnemen bij een refund of chargeback (`amountRefunded` / `amountChargedBack` vergelijken met het grootboek).
- Facturen/bonnetjes per aankoop (Mollie stuurt geen factuur naar de klant).
- De landingspagina zegt "Free for students": kies of dat blijft ("first search free") of aangepast wordt.
