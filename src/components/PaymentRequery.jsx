import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./PaymentRequery.css";

export default function PaymentRequery({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!reference.trim()) {
      setResult({ type: "error", message: "Please enter your payment reference" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/requery-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.trim(),
          userId: user?.uid,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.alreadyProcessed) {
          setResult({
            type: "info",
            message: "This payment has already been verified. Your access should be active. Try refreshing the page.",
          });
        } else {
          setResult({
            type: "success",
            message: `Payment verified! ₦${data.amount?.toLocaleString()} credited. ${
              data.purchaseType === "single_cv" 
                ? "You can now download your CV." 
                : "Your Pro subscription is now active."
            }`,
          });
          setTimeout(() => {
            if (onSuccess) onSuccess(data);
          }, 2000);
        }
      } else {
        setResult({
          type: "error",
          message: data.message || "Could not verify payment. Please check the reference.",
        });
      }
    } catch (err) {
      setResult({
        type: "error",
        message: "Network error. Please try again or contact support.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="prq__backdrop" onClick={onClose}>
      <div className="prq__modal" onClick={(e) => e.stopPropagation()}>

        <div className="prq__header">
          <div className="prq__icon">
            <i className="fas fa-search-dollar"></i>
          </div>
          <h2>Verify Payment</h2>
          <p>Paid but no access yet? Enter your payment reference to verify and recover access.</p>
          <button className="prq__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="prq__body">

          <div className="prq__field">
            <label>Payment Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. cv_1716234567_abc123xyz"
              disabled={loading}
            />
            <p className="prq__hint">
              <i className="fas fa-info-circle"></i>
              Find this in your Paystack confirmation email or SMS
            </p>
          </div>

          {result && (
            <div className={`prq__result prq__result--${result.type}`}>
              <i className={`fas fa-${
                result.type === "success" ? "check-circle" :
                result.type === "info" ? "info-circle" : "exclamation-circle"
              }`}></i>
              <span>{result.message}</span>
            </div>
          )}

          <div className="prq__actions">
            <button
              className="prq__btn prq__btn--primary"
              onClick={handleVerify}
              disabled={loading || !reference.trim()}
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
              ) : (
                <><i className="fas fa-check"></i> Verify Payment</>
              )}
            </button>
          </div>

          <div className="prq__help">
            <p>
              <strong>Still having issues?</strong> Email{" "}
              <a href="mailto:support@memorasmart.com">support@memorasmart.com</a>{" "}
              with your payment reference and we'll resolve it within 24 hours.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}