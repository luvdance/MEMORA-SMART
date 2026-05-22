import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserDoc } from "../../utils/userService";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PaymentRequery from "../../components/PaymentRequery";
import "./Payments.css";

export default function Payments() {
  const { user } = useAuth();
  const [planData, setPlanData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequery, setShowRequery] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Plan data
      const plan = await getUserDoc(user.uid);
      setPlanData(plan);

      // Payment history
      const q = query(
        collection(db, "payments"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to load payments:", err);
    }
    setLoading(false);
  };

  const handleRequerySuccess = () => {
    setShowRequery(false);
    loadData(); // Refresh after successful verification
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const planBadge = () => {
    if (!planData) return null;
    if (planData.isPro) return { label: "Memora Pro", color: "pro", icon: "bolt" };
    if (planData.paidDownloads > 0) return { label: `${planData.paidDownloads} credit${planData.paidDownloads !== 1 ? "s" : ""}`, color: "credits", icon: "coins" };
    if (planData.freeCVUsed) return { label: "Free (used)", color: "exhausted", icon: "lock" };
    return { label: "Free", color: "free", icon: "gift" };
  };

  const badge = planBadge();

  return (
    <div className="payments-page">
      <div className="payments-page__container">

        {/* HEADER */}
        <div className="payments-page__header">
          <h1><i className="fas fa-credit-card"></i> Payments</h1>
          <p>Manage your plan, view payment history, and resolve payment issues.</p>
        </div>

        {/* CURRENT PLAN CARD */}
        <div className="payments-page__card">
          <h2>Current Plan</h2>
          {loading ? (
            <div className="payments-page__loading">
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : (
            <div className="payments-page__plan">
              <div className="payments-page__plan-info">
                {badge && (
                  <div className={`payments-page__badge payments-page__badge--${badge.color}`}>
                    <i className={`fas fa-${badge.icon}`}></i>
                    {badge.label}
                  </div>
                )}
                {planData?.isPro && planData?.proExpiresAt && (
                  <p className="payments-page__plan-meta">
                    Renews on {formatDate(planData.proExpiresAt)}
                  </p>
                )}
                {planData?.paidDownloads > 0 && (
                  <p className="payments-page__plan-meta">
                    Use them anytime — no expiry
                  </p>
                )}
              </div>
              {!planData?.isPro && (
                <a href="/pricing" className="payments-page__upgrade-btn">
                  <i className="fas fa-bolt"></i> Upgrade to Pro
                </a>
              )}
            </div>
          )}
        </div>

        {/* PAYMENT ISSUES CARD */}
        <div className="payments-page__card payments-page__card--issue">
          <div className="payments-page__issue">
            <div className="payments-page__issue-icon">
              <i className="fas fa-search-dollar"></i>
            </div>
            <div className="payments-page__issue-content">
              <h3>Payment Issues?</h3>
              <p>
                If you paid but your access didn't activate, enter your payment
                reference to verify and recover access immediately.
              </p>
            </div>
            <button
              className="payments-page__verify-btn"
              onClick={() => setShowRequery(true)}
            >
              <i className="fas fa-check"></i> Verify Payment
            </button>
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="payments-page__card">
          <h2>Payment History</h2>
          {loading ? (
            <div className="payments-page__loading">
              <i className="fas fa-spinner fa-spin"></i> Loading history...
            </div>
          ) : payments.length === 0 ? (
            <div className="payments-page__empty">
              <i className="fas fa-receipt"></i>
              <p>No payments yet</p>
              <span>Your payment history will appear here</span>
            </div>
          ) : (
            <div className="payments-page__list">
              {payments.map((p) => (
                <div key={p.id} className="payments-page__item">
                  <div className="payments-page__item-icon">
                    <i className={`fas fa-${
                      p.purchaseType === "pro_subscription" ? "bolt" : "file-alt"
                    }`}></i>
                  </div>
                  <div className="payments-page__item-info">
                    <div className="payments-page__item-title">
                      {p.purchaseType === "pro_subscription"
                        ? "Memora Pro Subscription"
                        : "Single CV Download"}
                    </div>
                    <div className="payments-page__item-meta">
                      {formatDate(p.createdAt)}
                      {p.reference && (
                        <span className="payments-page__item-ref">
                          • Ref: {p.reference.substring(0, 20)}...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="payments-page__item-amount">
                    ₦{p.amount?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUPPORT */}
        <div className="payments-page__support">
          <p>
            Still having issues? Email{" "}
            <a href="mailto:support@memorasmart.com">support@memorasmart.com</a>{" "}
            and we'll resolve it within 24 hours.
          </p>
        </div>

      </div>

      {/* REQUERY MODAL */}
      {showRequery && (
        <PaymentRequery
          onClose={() => setShowRequery(false)}
          onSuccess={handleRequerySuccess}
        />
      )}
    </div>
  );
}