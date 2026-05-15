import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buyCV, subscribePro } from "../utils/paymentService";
import "./PaywallModal.css";

export default function PaywallModal({ onClose, onPaymentSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null); // "cv" | "pro" | null
  const [error, setError] = useState("");

  const handleBuyCV = () => {
    if (!user?.email) return;
    setError("");
    setLoading("cv");

    buyCV({
      email: user.email,
      onSuccess: async (result) => {
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
      onSuccess: async (result) => {
        setLoading(null);
        onPaymentSuccess("pro_subscription", result);
      },
      onClose: () => setLoading(null),
    });
  };

  return (
    <div className="paywall__backdrop" onClick={onClose}>
      <div className="paywall__modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="paywall__header">
          <div className="paywall__icon">🎯</div>
          <h2>You've used your free CV</h2>
          <p>Choose a plan to continue downloading</p>
          <button className="paywall__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* PLANS */}
        <div className="paywall__plans">

          {/* SINGLE CV */}
          <div className="paywall__plan">
            <div className="paywall__plan-header">
              <div className="paywall__plan-icon">📄</div>
              <div>
                <h3>Single CV</h3>
                <p>One-time download</p>
              </div>
              <div className="paywall__plan-price">
                <span className="paywall__price">₦3,500</span>
                <span className="paywall__price-note">once</span>
              </div>
            </div>
            <ul className="paywall__features">
              <li><i className="fas fa-check"></i> 1 PDF download</li>
              <li><i className="fas fa-check"></i> All 7 templates</li>
              <li><i className="fas fa-check"></i> ATS-optimized</li>
              <li><i className="fas fa-check"></i> AI-enhanced content</li>
            </ul>
            <button
              className="paywall__btn paywall__btn--secondary"
              onClick={handleBuyCV}
              disabled={loading !== null}
            >
              {loading === "cv" ? (
                <><i className="fas fa-spinner fa-spin"></i> Opening payment...</>
              ) : (
                <><i className="fas fa-download"></i> Buy this CV — ₦3,500</>
              )}
            </button>
          </div>

          {/* DIVIDER */}
          <div className="paywall__divider">
            <span>or</span>
          </div>

          {/* PRO */}
          <div className="paywall__plan paywall__plan--featured">
            <div className="paywall__plan-badge">BEST VALUE</div>
            <div className="paywall__plan-header">
              <div className="paywall__plan-icon">⚡</div>
              <div>
                <h3>Memora Pro</h3>
                <p>Unlimited everything</p>
              </div>
              <div className="paywall__plan-price">
                <span className="paywall__price">₦7,500</span>
                <span className="paywall__price-note">/month</span>
              </div>
            </div>
            <ul className="paywall__features">
              <li><i className="fas fa-check"></i> Unlimited downloads</li>
              <li><i className="fas fa-check"></i> All 7 templates</li>
              <li><i className="fas fa-check"></i> Unlimited template switches</li>
              <li><i className="fas fa-check"></i> Priority AI suggestions</li>
              <li><i className="fas fa-check"></i> All future templates</li>
              <li><i className="fas fa-check"></i> Cancel anytime</li>
            </ul>
            <button
              className="paywall__btn paywall__btn--primary"
              onClick={handleSubscribePro}
              disabled={loading !== null}
            >
              {loading === "pro" ? (
                <><i className="fas fa-spinner fa-spin"></i> Opening payment...</>
              ) : (
                <><i className="fas fa-bolt"></i> Go Pro — ₦7,500/mo</>
              )}
            </button>
            <p className="paywall__cancel-note">Cancel anytime. No hidden fees.</p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="paywall__error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* SECURITY NOTE */}
        <div className="paywall__security">
          <i className="fas fa-lock"></i>
          <span>Secured by Paystack. Your card details are never stored.</span>
        </div>

      </div>
    </div>
  );
}