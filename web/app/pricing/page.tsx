import { PRICING_PLANS } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow" style={{ textAlign: "center", display: "block" }}>Pricing</p>
        <h1 style={{ fontSize: 32, marginTop: 8, textAlign: "center" }}>Simple, usage-based pricing</h1>
        <p className="lede" style={{ marginTop: 8, textAlign: "center", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Start free. Upgrade when workflows become part of how you work.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 40,
          }}
        >
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className="card"
              style={{
                borderColor: plan.highlighted ? "var(--accent)" : "var(--line)",
                borderWidth: plan.highlighted ? 2 : 1,
                position: "relative",
              }}
            >
              {plan.highlighted && (
                <span
                  className="tag"
                  style={{ position: "absolute", top: -11, left: 20 }}
                >
                  Most popular
                </span>
              )}
              <h2 style={{ fontSize: 18 }}>{plan.name}</h2>
              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 32, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>{plan.description}</p>

              <ul style={{ marginTop: 20, paddingLeft: 0, listStyle: "none", fontSize: 14 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 8, marginBottom: 10, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--accent)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-block ${plan.highlighted ? "btn-primary" : "btn-secondary"}`}
                style={{ marginTop: 20 }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
