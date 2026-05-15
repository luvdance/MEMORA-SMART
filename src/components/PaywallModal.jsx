import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buyCV, subscribePro } from "../utils/paymentService";
import "./PaywallModal.css";

export default function PaywallModal({ onClose, onPaymentSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const handleBuyCV = () => {
    if (!user?.email) return;
    setError("");
    setLoading("cv");
    buyCV({
      email: user.email,
      onSuccess: (result) => {
        setLoading(null);
        onPaymentSuccess("single_cv", result);
      },
      onClose: () => setLoading(null),
    });
  };

  const handleSubscribePro = () => {
    if (!user?.email) return;
    setError("");
    setLoading("pro");
    subscribePro({
      email: user.email,
      onSuccess: (result) => {
        setLoading(null);
        onPaymentSuccess("pro_subscription", result);
      },
      onClose: () => setLoading(null),
    });
  };

  return (
    <div className="pw__backdrop" onClick={onClose}>
      <div className="pw__modal" onClick={(e) => e.stopPropagation()}>

        {/* CLOSE */}
        <button className="pw__close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {/* HEADER */}
        <div className="pw__header">
          <div className="pw__header-icon">
            <i className="fas fa-download"></i>
          </div>
          <h2>Download Your CV</h2>
          <p>Your free download has been used. Choose a plan to continue.</p>
        </div>

        {/* PLANS */}
        <div className="pw__plans">

          {/* SINGLE CV */}
          <div className="pw__plan">
            <div className="pw__plan-top">
              <div className="pw__plan-info">
                <h3>Single Download</h3>
                <p>One PDF — use it, keep it</p>
              </div>
              <div className="pw__plan-price">
                <span className="pw__amount">₦3,500</span>
                <span className="pw__period">one-time</span>
              </div>
            </div>

            <ul className="pw__features">
              <li><i className="fas fa-check"></i> 1 high-quality PDF download</li>
              <li><i className="fas fa-check"></i> All 7 professional templates</li>
              <li><i className="fas fa-check"></i> ATS-optimized formatting</li>
              <li><i className="fas fa-check"></i> AI-enhanced content</li>
            </ul>

            <button
              className="pw__btn"
              onClick={handleBuyCV}
              disabled={loading !== null}
            >
              {loading === "cv" ? (
                <><i className="fas fa-spinner fa-spin"></i> Opening payment...</>
              ) : (
                <>Pay ₦3,500 — Download Now</>
              )}
            </button>
          </div>

          {/* DIVIDER */}
          <div className="pw__or">
            <span>or</span>
          </div>

          {/* PRO */}
          <div className="pw__plan pw__plan--pro">
            <div className="pw__pro-badge">Most Popular</div>

            <div className="pw__plan-top">
              <div className="pw__plan-info">
                <h3>Memora Pro</h3>
                <p>Unlimited downloads, every month</p>
              </div>
              <div className="pw__plan-price">
                <span className="pw__amount">₦7,500</span>
                <span className="pw__period">/ month</span>
              </div>
            </div>

            <ul className="pw__features">
              <li><i className="fas fa-check"></i> Unlimited PDF downloads</li>
              <li><i className="fas fa-check"></i> All 7 templates, unlimited switches</li>
              <li><i className="fas fa-check"></i> Priority AI suggestions</li>
              <li><i className="fas fa-check"></i> All future templates included</li>
              <li><i className="fas fa-check"></i> Cancel anytime</li>
            </ul>

            <button
              className="pw__btn"
              onClick={handleSubscribePro}
              disabled={loading !== null}
            >
              {loading === "pro" ? (
                <><i className="fas fa-spinner fa-spin"></i> Opening payment...</>
              ) : (
                <>Subscribe — ₦7,500 / month</>
              )}
            </button>

            <p className="pw__cancel-note">No contracts. Cancel from your profile anytime.</p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="pw__error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* FOOTER */}
        <div className="pw__footer">
          <i className="fas fa-lock"></i>
          <span>Payments secured by Paystack. Your card details are never stored on our servers.</span>
        </div>

      </div>
    </div>
  );
}