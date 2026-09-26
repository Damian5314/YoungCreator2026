import { PRICING_TIERS } from '../../../../shared/constants/opportunityTypes';

export function PricingSection() {
  return (
    <section>
      <h2>Simpele prijzen, geen abonnement</h2>
      <p>Koop credits. Gebruik ze wanneer jij wil.</p>

      <div>
        {PRICING_TIERS.map((tier) => (
          <div key={tier.name}>
            <h3>{tier.name}</h3>
            <p>{tier.credits === 999 ? 'Onbeperkt' : `${tier.credits} searches`}</p>
            <p>€{tier.priceEur}</p>
            <a href={`/checkout?tier=${tier.name.toLowerCase()}`}>Kies dit pakket</a>
          </div>
        ))}
      </div>

      <p>1 credit = 1 zoekactie of 2 credits = 1 sollicitatie-actie</p>
    </section>
  );
}
