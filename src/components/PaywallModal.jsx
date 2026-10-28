import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buyPlan } from "../utils/paymentService";
import { PLANS, PREMIUM_FEATURES, formatResetIn } from "../cv-builder/utils/plans";
import "./PaywallModal.css";

// Why the paywall opened, in the user's terms.
const REASONS = {
  daily_limit: {
    icon: "hourglass-half",
    title: "You've used today's free downloads",
    body: (ent) => ent?.free?.resetsAt
      ? `Your ${ent.free.limit} free downloads reset ${formatResetIn(ent.free.resetsAt)}. Go Premium to download now, as often as you like.`
      : "Go Premium to download as often as you like.",
  },
  premium_template: {
    icon: "crown",
    title: "This is a Premium template",
    body: () => "You can keep editing it for free. To download it, choose a Premium plan, or switch to one of the free templates.",
  },
  premium_feature: {
    icon: "magic",
    title: "ATS check & AI optimization are Premium",
    body: () => "Score your CV against real ATS rules and rewrite it in one click, right inside the builder.",
  },
  upgrade: {
    icon: "bolt",
    title: "Go Premium",
    body: () => "Unlimited downloads, every template, and AI tools built into the builder.",
  },
};

const ORDER = ["yearly", "monthly", "lifetime"];

export default function PaywallModal({ reason = "upgrade", entitlement, initialPlan = "yearly", onClose, onPaymentSuccess }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(PLANS[initialPlan] ? initialPlan : "yearly");
  const [loading, setLoading] = useState(false);
  const copy = REASONS[reason] || REASONS.upgrade;

  const handlePay = () => {
    if (!user?.email || loading) return;
    setLoading(true);
    buyPlan({
      user,
      plan: selected,
      onSuccess: (result) => {
        setLoading(false);
        onPaymentSuccess(selected, result);
      },
      onClose: () => setLoading(false),
    });
  };

  const chosen = PLANS[selected];

  return (
    <div className="pw__backdrop" onClick={() => onClose()}>
      <div className="pw__modal" role="dialog" aria-modal="true" aria-labelledby="pw-title" onClick={(e) => e.stopPropagation()}>

        <button className="pw__close" onClick={() => onClose()} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>

        <div className="pw__header">
          <div className="pw__header-icon">
            <i className={`fas fa-${copy.icon}`}></i>
          </div>
          <h2 id="pw-title">{copy.title}</h2>
          <p>{copy.body(entitlement)}</p>
          {entitlement && !entitlement.premium && reason !== "premium_feature" && (
            <div className="pw__usage">
              <span>Free plan: {entitlement.free.used} of {entitlement.free.limit} downloads used today</span>
              <span className="pw__usage-bar">
                <span style={{ width: `${(entitlement.free.used / entitlement.free.limit) * 100}%` }} />
              </span>
            </div>
          )}
        </div>

        <div className="pw__choices" role="radiogroup" aria-label="Choose a plan">
          {ORDER.map((id) => {
            const p = PLANS[id];
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`pw__choice ${active ? "pw__choice--active" : ""}`}
                onClick={() => setSelected(id)}
              >
                <span className="pw__choice-radio" aria-hidden="true" />
                <span className="pw__choice-text">
                  <span className="pw__choice-name">
                    {p.shortName}
                    {p.badge && <span className="pw__choice-badge">{p.badge}</span>}
                  </span>
                  <span className="pw__choice-blurb">{p.blurb}</span>
                </span>
                <span className="pw__choice-price">
                  <strong>{p.priceLabel}</strong>
                  <small>{p.periodLabel}</small>
                </span>
              </button>
            );
          })}
        </div>

        <ul className="pw__features pw__features--compact">
          {PREMIUM_FEATURES.map((f) => (
            <li key={f}><i className="fas fa-check"></i> {f}</li>
          ))}
        </ul>

        <div className="pw__cta-wrap">
          <button className="pw__btn" onClick={handlePay} disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Opening payment...</>
            ) : (
              <>Continue — {chosen.priceLabel} {chosen.periodLabel === "one-time" ? "once" : chosen.periodLabel}</>
            )}
          </button>
          {selected !== "lifetime" && (
            <p className="pw__cancel-note">Cancel auto-renew anytime from Payments.</p>
          )}
        </div>

        <div className="paywall__requery-link">
          Already paid but no access?{" "}
          <button onClick={() => onClose("requery")}>Verify payment</button>
        </div>

        <div className="pw__footer">
          <i className="fas fa-lock"></i>
          <span>Payments secured by Paystack. Your card details are never stored on our servers.</span>
        </div>

      </div>
    </div>
  );
}
