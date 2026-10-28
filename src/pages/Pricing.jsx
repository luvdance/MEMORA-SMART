import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaywallModal from "../components/PaywallModal";
import { useEntitlement } from "../cv-builder/utils/cvAccess";
import { PLANS, FREE_FEATURES, PREMIUM_FEATURES, FREE_DAILY_DOWNLOADS, describeEntitlement } from "../cv-builder/utils/plans";
import { track } from "../utils/analytics";

const CARD = {
  background: "#fff",
  borderRadius: 16,
  padding: 26,
  border: "1.5px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  position: "relative",
};

const FEATURED = {
  ...CARD,
  background: "linear-gradient(135deg, rgba(102,153,255,0.06), rgba(157,0,255,0.06))",
  border: "2px solid #9D00FF",
};

const BTN = {
  width: "100%",
  padding: "11px",
  borderRadius: 25,
  border: "1.5px solid #e2e8f0",
  background: "#f8f9ff",
  color: "#333",
  fontWeight: 700,
  fontSize: "0.875rem",
  cursor: "pointer",
  fontFamily: "inherit",
  marginTop: "auto",
};

const BTN_PRIMARY = {
  ...BTN,
  border: "none",
  background: "linear-gradient(90deg, #6699FF, #9D00FF)",
  color: "#fff",
  boxShadow: "0 4px 15px rgba(157,0,255,0.3)",
};

function FeatureList({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
      {items.map((f) => (
        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.82rem", color: "#444", marginBottom: 8, lineHeight: 1.4 }}>
          <i className="fas fa-check" style={{ color: "#9D00FF", fontSize: "0.7rem", marginTop: 4 }}></i>
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const entitlement = useEntitlement(user);
  const [showPaywall, setShowPaywall] = useState(false);

  const goBuilder = () => navigate(user ? "/dashboard/cv-builder" : "/auth");

  const choosePlan = (planId) => {
    track("pricing_plan_clicked", { plan: planId });
    if (!user) {
      navigate("/auth", { state: { from: "/pricing" } });
      return;
    }
    setShowPaywall(planId);
  };

  const paidCards = [
    { id: "monthly", icon: "⚡" },
    { id: "yearly", icon: "🚀", featured: true },
    { id: "lifetime", icon: "👑" },
  ];

  return (
    <div style={{ fontFamily: "'Neulis', 'Raleway', sans-serif", background: "#f8f9ff", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 16px 60px" }}>

        {/* HEADING */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)", fontWeight: 800, color: "#111", margin: "0 0 16px" }}>
            Simple, honest pricing
          </h1>
          <p style={{ fontSize: "1rem", color: "#666", maxWidth: 560, margin: "0 auto" }}>
            Build and download for free — {FREE_DAILY_DOWNLOADS} downloads every 24 hours.
            Go Premium for unlimited downloads, every template, and the ATS checker and AI optimizer built into the builder.
          </p>
          {entitlement && (
            <p style={{ marginTop: 16, fontSize: "0.85rem", color: "#6b21a8", fontWeight: 600 }}>
              Your plan: {describeEntitlement(entitlement).label}
              {describeEntitlement(entitlement).sub ? ` · ${describeEntitlement(entitlement).sub}` : ""}
            </p>
          )}
        </div>

        {/* PLANS GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          margin: "0 auto 60px",
        }}>

          {/* FREE */}
          <div style={CARD}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🎯</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Free</h3>
              <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>Get started, no card needed</p>
            </div>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "#111" }}>₦0</span>
              <span style={{ fontSize: "0.82rem", color: "#888" }}> forever</span>
            </div>
            <FeatureList items={FREE_FEATURES} />
            <p style={{ fontSize: "0.75rem", color: "#999", margin: "-12px 0 16px" }}>
              ATS checker, AI optimization and Premium templates not included.
            </p>
            <button onClick={goBuilder} style={BTN}>Start Building Free</button>
          </div>

          {paidCards.map(({ id, icon, featured }) => {
            const p = PLANS[id];
            return (
              <div key={id} style={featured ? FEATURED : CARD}>
                {featured && (
                  <div style={{
                    position: "absolute",
                    top: -13,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, #6699FF, #9D00FF)",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    padding: "4px 16px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                    letterSpacing: 1,
                  }}>
                    BEST VALUE
                  </div>
                )}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{icon}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>{p.blurb}</p>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontSize: "2rem", fontWeight: 800, color: "#111" }}>{p.priceLabel}</span>
                  <span style={{ fontSize: "0.82rem", color: "#888" }}> {p.periodLabel}</span>
                </div>
                <FeatureList items={PREMIUM_FEATURES} />
                <button onClick={() => choosePlan(id)} style={featured ? BTN_PRIMARY : { ...BTN_PRIMARY, background: "#111", boxShadow: "none" }}>
                  {entitlement?.premium ? "Extend with" : "Get"} {p.shortName}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111", textAlign: "center", marginBottom: 32 }}>
            Frequently asked questions
          </h2>
          {[
            {
              q: "How do the free downloads work?",
              a: `Free accounts get ${FREE_DAILY_DOWNLOADS} downloads every 24 hours. The count starts with your first download and resets 24 hours later. Each download tells you how many you've used.`,
            },
            {
              q: "What's included in Premium?",
              a: "Unlimited downloads, every template (including our Premium designs), and the ATS score checker and one-click AI optimization right inside the CV builder.",
            },
            {
              q: "Can I try Premium templates before paying?",
              a: "Yes. You can switch to any template and edit it for free. A Premium plan is only needed to download a Premium template.",
            },
            {
              q: "How is my payment secured?",
              a: "All payments are processed by Paystack, Nigeria's leading payment processor. Your card details are never stored on our servers.",
            },
            {
              q: "Can I cancel Monthly or Yearly?",
              a: "Yes. Turn off auto-renew anytime from Dashboard → Payments. You keep Premium until the end of the period you've paid for. Lifetime is a one-time payment with nothing to cancel.",
            },
            {
              q: "Will my CVs be saved if I cancel?",
              a: "Yes. All your CVs stay saved in your account regardless of your plan.",
            },
          ].map((item) => (
            <div key={item.q} style={{
              borderBottom: "1px solid #e2e8f0",
              padding: "20px 0",
            }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>
                {item.q}
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#666", margin: 0, lineHeight: 1.6 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>

      </div>

      {showPaywall && (
        <PaywallModal
          key={showPaywall}
          reason="upgrade"
          initialPlan={showPaywall}
          entitlement={entitlement}
          onClose={() => setShowPaywall(false)}
          onPaymentSuccess={(plan) => {
            setShowPaywall(false);
            track("payment_completed", { plan, source: "pricing" });
            navigate("/dashboard/cv-builder");
          }}
        />
      )}

      <Footer />
    </div>
  );
}
