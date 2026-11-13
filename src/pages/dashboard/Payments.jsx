import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import PaymentRequery from "../../components/PaymentRequery";
import PaywallModal from "../../components/PaywallModal";
import { PLANS, FREE_DAILY_DOWNLOADS } from "../../cv-builder/utils/plans";
import { cvApi, useEntitlement } from "../../cv-builder/utils/cvAccess";
import { AI_KINDS, untilText } from "../../cv-builder/utils/aiQuota";
import { openSupport } from "../../support/supportApi";
import { track } from "../../utils/analytics";
import "./Payments.css";

// Plain names for each allowance, as people know the buttons.
const USAGE_ROWS = {
  write: { label: "Writing suggestions", hint: "Suggest buttons for summary, skills and more" },
  assist: { label: "Quick edits", hint: "The Ask Memora bar in the builder" },
  scan: { label: "Document scans", hint: "Reading a photo or scan of a CV" },
  ats: { label: "ATS checks", hint: "CV and cover letter checks" },
  optimize: { label: "CV rewrites", hint: "Optimize, in the builder or on a job" },
  letter: { label: "Cover letters", hint: "Written for a job on Memotify" },
};

/** Where the person came from, so the page can take them back there. */
function backTarget(from) {
  if (typeof from !== "string") return null;
  if (from.startsWith("/cv/") || from.startsWith("/dashboard/cv-builder")) return { to: from, label: "Back to CV Builder" };
  if (from.startsWith("/ats-check")) return { to: from, label: "Back to ATS checker" };
  if (from.startsWith("/memotify")) return { to: from, label: "Back to Memotify" };
  return null;
}

const formatDate = (value) => {
  if (!value) return "—";
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const naira = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;

function paymentTitle(p) {
  if (p.plan && PLANS[p.plan]) {
    return p.purchaseType === "cv_plan_renewal" ? `${PLANS[p.plan].name}, renewal` : PLANS[p.plan].name;
  }
  if (p.purchaseType === "pro_subscription") return "Memora Pro";
  if (p.purchaseType === "book_purchase") return "Book";
  return "Single CV download";
}

function Meter({ used, limit }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = limit > 0 && used >= limit ? "full" : pct >= 80 ? "high" : "ok";
  return (
    <div className={`pp-meter pp-meter--${tone}`} aria-hidden="true">
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

function CopyRef({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button type="button" className="pp-ref" onClick={copy} title="Copy reference">
      <span className="pp-ref__text">{value}</span>
      <span className="pp-ref__act">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export default function Payments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const entitlement = useEntitlement(user);
  const back = backTarget(location.state?.from);

  const [payments, setPayments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [ai, setAi] = useState(null);
  const [notice, setNotice] = useState(null); // { tone: "ok" | "warn", text }
  const [showRequery, setShowRequery] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user?.uid) return;
    setHistoryLoading(true);
    try {
      const snap = await getDocs(query(
        collection(db, "payments"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      ));
      setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to load payments:", err);
    }
    setHistoryLoading(false);
  }, [user?.uid]);

  const loadUsage = useCallback(async () => {
    if (!user) return;
    try {
      const { status, data } = await cvApi("access", user);
      setAi(status === 200 && data.ai ? data.ai : false);
    } catch {
      // Usage is a convenience; the page works without it.
      setAi(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
    loadUsage();
  }, [loadHistory, loadUsage]);

  // Back from Paystack's hosted page (used when the popup can't open):
  // Paystack appends ?reference=… — confirm it so access starts right away.
  useEffect(() => {
    if (!user?.uid) return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;
    window.history.replaceState(window.history.state, "", window.location.pathname);
    cvApi("verify-payment", user, { reference })
      .then(({ data }) => {
        setNotice(data.verified
          ? { tone: "ok", text: "Payment confirmed. Premium is active." }
          : { tone: "warn", text: data.message || "We could not confirm that payment yet. If Premium does not start soon, use Verify a payment below." });
        loadHistory();
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const cancelRenewal = async () => {
    setCancelling(true);
    try {
      const { data } = await cvApi("cancel-subscription", user);
      setNotice({ tone: data.success ? "ok" : "warn", text: data.message || (data.success ? "Auto-renew is off." : "Could not turn off auto-renew. Please try again.") });
    } catch (err) {
      setNotice({ tone: "warn", text: `Network error: ${err.message}` });
    }
    setCancelling(false);
    setConfirmCancel(false);
  };

  const paid = (plan) => {
    track("payment_completed", { plan, source: "payments_page" });
    setShowPaywall(false);
    setNotice({ tone: "ok", text: `${PLANS[plan]?.name || "Premium"} is active. Thank you.` });
    loadHistory();
    loadUsage();
  };

  const loading = !entitlement;
  const premium = Boolean(entitlement?.premium);
  const planInfo = entitlement && PLANS[entitlement.plan];
  const planName = !entitlement ? "" : entitlement.plan === "lifetime" ? "Premium Lifetime"
    : planInfo ? planInfo.name : premium ? "Premium" : "Free";
  const expires = entitlement?.expiresAt ? formatDate(entitlement.expiresAt) : null;

  let status = { label: "Free", tone: "free" };
  if (entitlement?.plan === "lifetime") status = { label: "Active", tone: "active" };
  else if (premium && entitlement.autoRenew) status = { label: "Active", tone: "active" };
  else if (premium) status = { label: "Ends soon", tone: "ending" };

  const facts = [];
  if (entitlement) {
    if (entitlement.plan === "lifetime") {
      facts.push(["Billing", "One payment, no renewal"]);
      facts.push(["Access", "For life"]);
    } else if (premium) {
      facts.push(["Price", planInfo ? `${planInfo.priceLabel} ${planInfo.periodLabel}` : "Premium"]);
      facts.push([entitlement.autoRenew ? "Next payment" : "Access ends", expires || "—"]);
      facts.push(["Auto-renew", entitlement.autoRenew ? "On" : "Off"]);
    } else {
      facts.push(["Price", "₦0"]);
      facts.push(["Downloads", `${entitlement.free.used} of ${entitlement.free.limit} used today`]);
      if (entitlement.credits > 0) facts.push(["Download credits", `${entitlement.credits} left from earlier purchases`]);
    }
  }

  return (
    <DashboardLayout title="Plan & payments" subtitle="Your plan, today's usage and receipts">
      <div className="pp">
        <nav className="pp-nav" aria-label="Page navigation">
          {back ? (
            <button type="button" className="pp-nav__back" onClick={() => navigate(back.to)}>
              <i className="fas fa-arrow-left" aria-hidden="true"></i> {back.label}
            </button>
          ) : (
            <button type="button" className="pp-nav__back" onClick={() => navigate("/dashboard")}>
              <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to dashboard
            </button>
          )}
          <div className="pp-nav__links">
            <Link to="/dashboard/cv-builder" className="pp-nav__link">CV Builder</Link>
            <Link to="/dashboard/my-works" className="pp-nav__link">My CVs</Link>
            <Link to="/dashboard" className="pp-nav__link">Dashboard</Link>
          </div>
        </nav>

        {notice && (
          <div className={`pp-notice pp-notice--${notice.tone}`} role="status">
            <span>{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        )}

        {/* ── Plan ── */}
        <section className="pp-card" aria-labelledby="pp-plan">
          <div className="pp-plan">
            <div>
              <p className="pp-eyebrow">Current plan</p>
              {loading ? (
                <div className="pp-skeleton pp-skeleton--title" />
              ) : (
                <div className="pp-plan__name">
                  <h2 id="pp-plan">{planName}</h2>
                  {status.tone !== "free" && <span className={`pp-status pp-status--${status.tone}`}>{status.label}</span>}
                </div>
              )}
              {!loading && premium && !entitlement.autoRenew && entitlement.plan !== "lifetime" && expires && (
                <p className="pp-plan__sub">Auto-renew is off. You keep Premium until {expires}.</p>
              )}
              {!loading && !premium && (
                <p className="pp-plan__sub">
                  {FREE_DAILY_DOWNLOADS} downloads a day and free templates. Premium adds unlimited downloads, all templates, ATS checks and CV rewrites.
                </p>
              )}
            </div>
            {!loading && (
              <div className="pp-plan__actions">
                {!premium && (
                  <button type="button" className="pp-btn pp-btn--primary" onClick={() => setShowPaywall(true)}>
                    Upgrade to Premium
                  </button>
                )}
                {premium && entitlement.plan === "monthly" && (
                  <button type="button" className="pp-btn" onClick={() => setShowPaywall(true)}>
                    Switch to yearly
                  </button>
                )}
              </div>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="pp-facts">
              {facts.map(([term, value]) => (
                <div key={term} className="pp-facts__item">
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {premium && entitlement.autoRenew && (
            <div className="pp-cancel">
              {!confirmCancel ? (
                <button type="button" className="pp-textbtn" onClick={() => setConfirmCancel(true)}>
                  Turn off auto-renew
                </button>
              ) : (
                <div className="pp-confirm">
                  <p>Turn off auto-renew? You keep Premium until {expires || "the end of the period you paid for"}, and you will not be charged again.</p>
                  <div className="pp-confirm__do">
                    <button type="button" className="pp-btn pp-btn--danger" disabled={cancelling} onClick={cancelRenewal}>
                      {cancelling ? "Turning off…" : "Turn off auto-renew"}
                    </button>
                    <button type="button" className="pp-btn" disabled={cancelling} onClick={() => setConfirmCancel(false)}>
                      Keep it on
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Usage ── */}
        <section className="pp-card" aria-labelledby="pp-usage">
          <div className="pp-card__head">
            <h3 id="pp-usage">Today's usage</h3>
            <p>Each use counts for 24 hours from when you made it.</p>
          </div>
          <ul className="pp-usage">
            <li className="pp-usage__row">
              <div className="pp-usage__label">
                <span>Downloads</span>
                <small>PDF downloads of your CVs</small>
              </div>
              {loading ? <div className="pp-skeleton" /> : premium ? (
                <span className="pp-usage__value pp-usage__value--wide">Unlimited</span>
              ) : (
                <>
                  <Meter used={entitlement.free.used} limit={entitlement.free.limit} />
                  <span className="pp-usage__value">{entitlement.free.used} / {entitlement.free.limit}</span>
                </>
              )}
            </li>
            {AI_KINDS.map((kind) => {
              const row = USAGE_ROWS[kind];
              const u = ai?.[kind];
              return (
                <li key={kind} className="pp-usage__row">
                  <div className="pp-usage__label">
                    <span>{row.label}</span>
                    <small>{row.hint}</small>
                  </div>
                  {ai === false ? (
                    <span className="pp-usage__value pp-usage__value--wide pp-usage__value--muted">—</span>
                  ) : !u ? <div className="pp-skeleton" /> : u.limit === 0 ? (
                    <span className="pp-usage__value pp-usage__value--wide pp-usage__value--muted">Premium only</span>
                  ) : (
                    <>
                      <Meter used={u.used} limit={u.limit} />
                      <span className="pp-usage__value" title={u.used >= u.limit && u.resetsAt ? `More ${untilText(u.resetsAt)}` : undefined}>
                        {Math.min(u.used, u.limit)} / {u.limit}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Billing history ── */}
        <section className="pp-card" aria-labelledby="pp-history">
          <div className="pp-card__head">
            <h3 id="pp-history">Billing history</h3>
          </div>
          {historyLoading ? (
            <div className="pp-rows-loading"><div className="pp-skeleton" /><div className="pp-skeleton" /></div>
          ) : payments.length === 0 ? (
            <p className="pp-empty">No payments yet. Your receipts will appear here after you pay.</p>
          ) : (
            <table className="pp-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col">Reference</th>
                  <th scope="col" className="pp-table__num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Date">{formatDate(p.createdAt)}</td>
                    <td data-label="Description">{paymentTitle(p)}</td>
                    <td data-label="Reference">{p.reference ? <CopyRef value={p.reference} /> : "—"}</td>
                    <td data-label="Amount" className="pp-table__num">{naira(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ── Help ── */}
        <section className="pp-help" aria-label="Payment help">
          <div className="pp-help__item">
            <div>
              <h4>Paid, but Premium has not started?</h4>
              <p>Enter the reference from your Paystack receipt and we will check it now.</p>
            </div>
            <button type="button" className="pp-btn" onClick={() => setShowRequery(true)}>Verify a payment</button>
          </div>
          <div className="pp-help__item">
            <div>
              <h4>Something else wrong?</h4>
              <p>Send us a message. We reply within 24 hours.</p>
            </div>
            <button type="button" className="pp-btn" onClick={() => openSupport({ app: "cv-builder", subject: "Payment or plan" })}>Contact support</button>
          </div>
        </section>
      </div>

      {showRequery && (
        <PaymentRequery
          onClose={() => setShowRequery(false)}
          onSuccess={() => { setShowRequery(false); loadHistory(); loadUsage(); }}
        />
      )}
      {showPaywall && (
        <PaywallModal
          reason="upgrade"
          entitlement={entitlement}
          initialPlan="yearly"
          onClose={() => setShowPaywall(false)}
          onPaymentSuccess={paid}
        />
      )}
    </DashboardLayout>
  );
}
