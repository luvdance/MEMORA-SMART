import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getUserDoc } from "../../utils/userService";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PaymentRequery from "../../components/PaymentRequery";
import { computeEntitlement, describeEntitlement, PLANS } from "../../cv-builder/utils/plans";
import { cvApi } from "../../cv-builder/utils/cvAccess";
import "./Payments.css";

export default function Payments() {
  const { user } = useAuth();
  const [planData, setPlanData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequery, setShowRequery] = useState(false);
  const navigate = useNavigate();

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

  // Back from Paystack's hosted page (used when the popup can't open):
  // Paystack appends ?reference=… — confirm it so access starts right away.
  useEffect(() => {
    if (!user?.uid) return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;
    window.history.replaceState(null, "", window.location.pathname);
    cvApi("verify-payment", user, { reference })
      .then(({ data }) => {
        setCancelMessage(data.verified ? "Payment confirmed. Premium is active." : (data.message || "We couldn't confirm that payment yet. Use Verify Payment below if access doesn't start shortly."));
        loadData();
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

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

  const entitlement = planData ? computeEntitlement(planData) : null;
  const described = entitlement ? describeEntitlement(entitlement) : null;
  const badge = described ? { label: described.label, color: described.tone, icon: described.icon } : null;

  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const handleCancelRenewal = async () => {
    if (!window.confirm("Turn off auto-renew? You keep Premium until the end of the period you've paid for.")) return;
    setCancelling(true);
    setCancelMessage("");
    try {
      const { data } = await cvApi("cancel-subscription", user);
      setCancelMessage(data.message || (data.success ? "Auto-renew is off." : "Could not cancel. Please try again."));
      if (data.success) loadData();
    } catch (err) {
      setCancelMessage("Network error: " + err.message);
    }
    setCancelling(false);
  };

  const paymentTitle = (p) => {
    if (p.plan && PLANS[p.plan]) {
      return p.purchaseType === "cv_plan_renewal" ? `${PLANS[p.plan].name} (renewal)` : PLANS[p.plan].name;
    }
    if (p.purchaseType === "pro_subscription") return "Memora Pro Subscription";
    if (p.purchaseType === "book_purchase") return "Book Purchase";
    return "Single CV Download";
  };

  return (
    <div className="payments-page">
      <div className="payments-page__container">

        {/* MOBILE-ONLY BACK BUTTON */}
      <button className="dash-back-btn" onClick={() => navigate("/dashboard")}>
        <i className="fas fa-arrow-left"></i>
        <span>Back to Dashboard</span>
      </button>
      
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
                {described?.sub && (
                  <p className="payments-page__plan-meta">{described.sub}</p>
                )}
                {entitlement?.credits > 0 && (
                  <p className="payments-page__plan-meta">
                    {entitlement.credits} download credit{entitlement.credits !== 1 ? "s" : ""} from earlier purchases. Use them anytime.
                  </p>
                )}
                {cancelMessage && <p className="payments-page__plan-meta">{cancelMessage}</p>}
              </div>
              {!entitlement?.premium && (
                <Link to="/pricing" className="payments-page__upgrade-btn">
                  <i className="fas fa-crown"></i> Go Premium
                </Link>
              )}
              {entitlement?.premium && entitlement.autoRenew && (
                <button
                  className="payments-page__verify-btn"
                  onClick={handleCancelRenewal}
                  disabled={cancelling}
                >
                  {cancelling ? <><i className="fas fa-spinner fa-spin"></i> Cancelling...</> : "Cancel auto-renew"}
                </button>
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
                      p.plan === "lifetime" ? "crown"
                        : p.plan || p.purchaseType === "pro_subscription" ? "bolt"
                        : p.purchaseType === "book_purchase" ? "book"
                        : "file-alt"
                    }`}></i>
                  </div>
                  <div className="payments-page__item-info">
                    <div className="payments-page__item-title">
                      {paymentTitle(p)}
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