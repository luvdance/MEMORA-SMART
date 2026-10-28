import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection, query, where, getDocs,
  doc, updateDoc, serverTimestamp, increment, orderBy, getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import "./Admin.css";
import AcademyAdmin from "./admin/AcademyAdmin";
import AdminCVs from "./admin/AdminCVs";
import { PLANS, addPlanPeriod, computeEntitlement, describeEntitlement, toMillis } from "../cv-builder/utils/plans";

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [mainTab, setMainTab] = useState(location.state?.tab || "users"); // "users" | "cvs" | "transfers" | "academy"

  // Transfers state
  const [transfers, setTransfers] = useState([]);
  const [transferTab, setTransferTab] = useState("pending");
  const [transferStats, setTransferStats] = useState({ total: 0, pending: 0, approved: 0 });

  // Users state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userFilter, setUserFilter] = useState("all"); // "all" | "pro" | "credits" | "free"
  const [searchQuery, setSearchQuery] = useState("");
  const [userStats, setUserStats] = useState({ total: 0, pro: 0, paid: 0, free: 0 });
  const [selectedUser, setSelectedUser] = useState(null);

  // Shared state
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(null);


  useEffect(() => {
  if (loading) return;
  if (!user) {
    navigate("/dashboard");
    return;
  }
  
  user.getIdTokenResult().then((token) => {
    if (token.claims.admin === true) {
      setIsAdmin(true);
    } else {
      navigate("/dashboard");
    }
    setCheckingAdmin(false);
  });
}, [user, loading, navigate]);

  useEffect(() => {
  if (isAdmin) {
    if (mainTab === "users") fetchUsers();
    else if (mainTab === "transfers") fetchTransfers();
  }
}, [isAdmin, mainTab, transferTab]);

  // Apply filter + search
  useEffect(() => {
    let result = [...users];

    if (userFilter === "pro") result = result.filter(u => u.entitlement.premium);
    else if (userFilter === "credits") result = result.filter(u => u.entitlement.credits > 0 && !u.entitlement.premium);
    else if (userFilter === "free") result = result.filter(u => !u.entitlement.premium && !u.entitlement.credits);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.uid?.toLowerCase().includes(q)
      );
    }

    setFilteredUsers(result);
  }, [users, userFilter, searchQuery]);

  // ───── USERS ─────
  const fetchUsers = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Fetch download count for each user (count of payments)
      const enriched = await Promise.all(
        data.map(async u => {
          const entitlement = computeEntitlement(u);
          try {
            const payQ = query(collection(db, "payments"), where("userId", "==", u.uid || u.id));
            const paySnap = await getDocs(payQ);
            return { ...u, entitlement, paymentCount: paySnap.size };
          } catch {
            return { ...u, entitlement, paymentCount: 0 };
          }
        })
      );

      setUsers(enriched);

      // Stats
      setUserStats({
        total: enriched.length,
        pro: enriched.filter(u => u.entitlement.premium).length,
        paid: enriched.filter(u => u.entitlement.credits > 0 && !u.entitlement.premium).length,
        free: enriched.filter(u => !u.entitlement.premium && !u.entitlement.credits).length,
      });
    } catch (err) {
      console.error("fetchUsers error:", err);
    }
    setFetching(false);
  };

  const grantCredit = async (u) => {
    setProcessing(u.id);
    try {
      await updateDoc(doc(db, "users", u.id), {
        paidDownloads: increment(1),
        updatedAt: serverTimestamp(),
      });
      await fetchUsers();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setProcessing(null);
  };

  // Give a plan by hand (e.g. a bank transfer or a goodwill gesture).
  // Monthly/Yearly extend from the later of now or the current end date.
  const grantPlan = async (u, planId) => {
    const plan = PLANS[planId];
    if (!window.confirm(`Grant ${plan.name} to ${u.email}?`)) return;
    setProcessing(u.id);
    try {
      let updates;
      if (planId === "lifetime") {
        updates = {
          plan: "lifetime",
          lifetime: true,
          planExpiresAt: null,
          autoRenew: false,
          isPro: true,
          proExpiresAt: new Date("2099-12-31T00:00:00Z"),
        };
      } else {
        const currentEnd = u.entitlement?.premium ? (u.entitlement.expiresAt || 0) : 0;
        const end = new Date(addPlanPeriod(Math.max(Date.now(), currentEnd), plan.months));
        updates = {
          plan: planId,
          lifetime: false,
          planExpiresAt: end,
          autoRenew: false,
          isPro: true,
          proExpiresAt: end,
        };
      }
      await updateDoc(doc(db, "users", u.id), {
        ...updates,
        planSource: "admin",
        updatedAt: serverTimestamp(),
      });
      await fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setProcessing(null);
  };

  const revokePro = async (u) => {
    if (!window.confirm(`Remove Premium from ${u.email}? They go back to the free plan.`)) return;
    setProcessing(u.id);
    try {
      await updateDoc(doc(db, "users", u.id), {
        plan: "free",
        lifetime: false,
        planExpiresAt: null,
        autoRenew: false,
        isPro: false,
        proExpiresAt: null,
        updatedAt: serverTimestamp(),
      });
      await fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setProcessing(null);
  };

  // Give a free user their 5 daily downloads back now.
  const resetFreeDownloads = async (u) => {
    setProcessing(u.id);
    try {
      await updateDoc(doc(db, "users", u.id), {
        freeDownloads: { windowStart: null, used: 0 },
        updatedAt: serverTimestamp(),
      });
      await fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setProcessing(null);
  };

  // ───── TRANSFERS (existing) ─────
  const fetchTransfers = async () => {
    setFetching(true);
    try {
      const q = query(
        collection(db, "pending_transfers"),
        where("status", "==", transferTab === "pending" ? "pending" : "approved"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setTransfers(snap.docs.map(d => ({ id: d.id, ...d.data() })));

      const allSnap = await getDocs(query(collection(db, "pending_transfers")));
      const all = allSnap.docs.map(d => d.data());
      setTransferStats({
        total: all.length,
        pending: all.filter(d => d.status === "pending").length,
        approved: all.filter(d => d.status === "approved").length,
      });
    } catch (err) {
      console.error(err);
    }
    setFetching(false);
  };

  const handleMarkPaid = async (transfer) => {
    setProcessing(transfer.id);
    try {
      await updateDoc(doc(db, "pending_transfers", transfer.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
        approvedBy: user.uid,
      });

      const userSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", transfer.userId))
      );

      if (!userSnap.empty) {
        const userRef = userSnap.docs[0].ref;
        if (transfer.type === "single_cv") {
        // Check promo state
        const settingsRef = doc(db, "settings", "global");
        const settingsSnap = await getDoc(settingsRef);
        const settings = settingsSnap.data() || {};
        const promoActive = settings.launchPromoActive === true;
        const promoCount = settings.launchPromoCount || 0;
        const promoLimit = settings.launchPromoLimit || 50;
        const promoBonus = settings.launchPromoBonus || 5;

        let totalCredits = 1;

        if (promoActive && promoCount < promoLimit) {
            totalCredits += promoBonus;
            const newCount = promoCount + 1;
            const updates = { launchPromoCount: newCount };
            if (newCount >= promoLimit) {
            updates.launchPromoActive = false;
            updates.launchPromoEndedAt = serverTimestamp();
            }
            await updateDoc(settingsRef, updates);
        }

        await updateDoc(userRef, {
            paidDownloads: increment(totalCredits),
            updatedAt: serverTimestamp(),
        });
        }
      }
      await fetchTransfers();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setProcessing(null);
  };

  const handleReject = async (transferId) => {
    if (!window.confirm("Reject this payment?")) return;
    setProcessing(transferId);
    try {
      await updateDoc(doc(db, "pending_transfers", transferId), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });
      await fetchTransfers();
    } catch (err) {
      console.error(err);
    }
    setProcessing(null);
  };

  // ───── HELPERS ─────
  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getUserBadge = (u) => {
    const d = describeEntitlement(u.entitlement || computeEntitlement(u));
    return { label: d.label, color: d.tone, sub: d.sub };
  };

  if (loading || checkingAdmin) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#9D00FF" }}></i>
    </div>
  );
}
if (!isAdmin) return null;

  return (
    <div className="admin">
      <div className="admin__container">

        {/* HEADER */}
        <div className="admin__header">
          <div>
            <h1>🛠️ Admin Panel</h1>
            <p>Manage users, payments, and platform operations</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="admin__back">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        {/* MAIN TABS */}
        <div className="admin__main-tabs">
          <button
            className={`admin__main-tab ${mainTab === "users" ? "admin__main-tab--active" : ""}`}
            onClick={() => setMainTab("users")}
          >
            <i className="fas fa-users"></i> Users
          </button>
          <button
            className={`admin__main-tab ${mainTab === "cvs" ? "admin__main-tab--active" : ""}`}
            onClick={() => setMainTab("cvs")}
          >
            <i className="fas fa-file-alt"></i> CVs
          </button>
          <button
            className={`admin__main-tab ${mainTab === "transfers" ? "admin__main-tab--active" : ""}`}
            onClick={() => setMainTab("transfers")}
          >
            <i className="fas fa-money-bill-wave"></i> Manual Transfers
          </button>
          <button
            className={`admin__main-tab ${mainTab === "academy" ? "admin__main-tab--active" : ""}`}
            onClick={() => setMainTab("academy")}
          >
            <i className="fas fa-graduation-cap"></i> Academy
          </button>
        </div>


        {/* ────── USERS TAB ────── */}
        {mainTab === "users" && (
          <>
            {/* STATS */}
            <div className="admin__stats">
              {[
                { label: "Total Users", value: userStats.total, color: "#6699FF", icon: "users" },
                { label: "Premium Users", value: userStats.pro, color: "#9D00FF", icon: "crown" },
                { label: "Legacy Credits", value: userStats.paid, color: "#16a34a", icon: "coins" },
                { label: "Free Users", value: userStats.free, color: "#888", icon: "gift" },
              ].map((s, i) => (
                <div key={i} className="admin__stat-card">
                  <i className={`fas fa-${s.icon}`} style={{ color: s.color }}></i>
                  <div className="admin__stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="admin__stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* SEARCH + FILTER */}
            <div className="admin__controls">
              <div className="admin__search">
                <i className="fas fa-search"></i>
                <input
                  placeholder="Search by email, name, or UID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="admin__filter">
                {[["all", "All"], ["pro", "Premium"], ["credits", "Credits"], ["free", "Free"]].map(([f, label]) => (
                  <button
                    key={f}
                    onClick={() => setUserFilter(f)}
                    className={`admin__filter-btn ${userFilter === f ? "admin__filter-btn--active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* USERS LIST */}
            {fetching ? (
              <div className="admin__loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="admin__empty">
                <div>👤</div>
                <p>No users match your filter</p>
              </div>
            ) : (
              <div className="admin__list">
                {filteredUsers.map(u => {
                  const badge = getUserBadge(u);
                  return (
                    <div key={u.id} className="admin__user-card">
                      <div className="admin__user-avatar">
                        {(u.name || u.email || "?").charAt(0).toUpperCase()}
                      </div>

                      <div className="admin__user-info">
                        <div className="admin__user-name">
                          {u.name || "Unnamed User"}
                        </div>
                        <div className="admin__user-meta">
                          <span>{u.email}</span>
                          <span>•</span>
                          <span>Joined {formatDate(u.createdAt)}</span>
                          {u.paymentCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{u.paymentCount} payment{u.paymentCount !== 1 ? "s" : ""}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className={`admin__badge admin__badge--${badge.color}`} title={badge.sub}>
                        {badge.label}
                      </div>

                      <div className="admin__user-actions">
                        <button
                          onClick={() => grantCredit(u)}
                          disabled={processing === u.id}
                          title="Grant 1 free download credit"
                          className="admin__action-btn"
                        >
                          <i className="fas fa-coins"></i>
                        </button>
                        {u.entitlement.premium ? (
                          <button
                            onClick={() => revokePro(u)}
                            disabled={processing === u.id}
                            title="Remove Premium"
                            className="admin__action-btn admin__action-btn--danger"
                          >
                            <i className="fas fa-ban"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => grantPlan(u, "monthly")}
                            disabled={processing === u.id}
                            title="Grant Premium Monthly (more plans in details)"
                            className="admin__action-btn admin__action-btn--primary"
                          >
                            <i className="fas fa-bolt"></i>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedUser(u)}
                          title="View details"
                          className="admin__action-btn"
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ────── TRANSFERS TAB ────── */}
        {mainTab === "transfers" && (
          <>
            <div className="admin__stats">
              {[
                { label: "Total Requests", value: transferStats.total, color: "#6699FF" },
                { label: "Pending Approval", value: transferStats.pending, color: "#f59e0b" },
                { label: "Approved", value: transferStats.approved, color: "#16a34a" },
              ].map((s, i) => (
                <div key={i} className="admin__stat-card">
                  <div className="admin__stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="admin__stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="admin__sub-tabs">
              {["pending", "approved"].map(t => (
                <button
                  key={t}
                  onClick={() => setTransferTab(t)}
                  className={`admin__sub-tab ${transferTab === t ? "admin__sub-tab--active" : ""}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {fetching ? (
              <div className="admin__loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading transfers...</p>
              </div>
            ) : transfers.length === 0 ? (
              <div className="admin__empty">
                <div>{transferTab === "pending" ? "🎉" : "📋"}</div>
                <p>{transferTab === "pending" ? "No pending transfers. All clear!" : "No approved transfers yet."}</p>
              </div>
            ) : (
              <div className="admin__list">
                {transfers.map(t => (
                  <div key={t.id} className="admin__user-card">
                    <div className="admin__user-avatar">
                      {t.type === "single_cv" ? "📄" : "⚡"}
                    </div>
                    <div className="admin__user-info">
                      <div className="admin__user-name">{t.userEmail}</div>
                      <div className="admin__user-meta">
                        <span>{t.type === "single_cv" ? "Single CV" : "Pro Monthly"}</span>
                        <span>•</span>
                        <span>₦{t.amount?.toLocaleString()}</span>
                        <span>•</span>
                        <span>{formatDate(t.createdAt)}</span>
                      </div>
                    </div>
                    <div className={`admin__badge admin__badge--${
                      t.status === "pending" ? "pending"
                        : t.status === "approved" ? "credits"
                        : "danger"
                    }`}>
                      {t.status.toUpperCase()}
                    </div>
                    {t.status === "pending" && (
                      <div className="admin__user-actions">
                        <button
                          onClick={() => handleMarkPaid(t)}
                          disabled={processing === t.id}
                          className="admin__action-btn admin__action-btn--primary"
                        >
                          {processing === t.id ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Mark Paid</>}
                        </button>
                        <button
                          onClick={() => handleReject(t.id)}
                          className="admin__action-btn admin__action-btn--danger"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* USER DETAIL MODAL */}
        {selectedUser && (
          <div className="admin__modal-backdrop" onClick={() => setSelectedUser(null)}>
            <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
              <button className="admin__modal-close" onClick={() => setSelectedUser(null)}>
                <i className="fas fa-times"></i>
              </button>
              <h2>{selectedUser.name || "Unnamed User"}</h2>
              <p>{selectedUser.email}</p>
              <div className="admin__modal-grid">
                <div className="admin__modal-item">
                  <span>UID</span>
                  <code>{selectedUser.uid || selectedUser.id}</code>
                </div>
                <div className="admin__modal-item">
                  <span>Joined</span>
                  <strong>{formatDate(selectedUser.createdAt)}</strong>
                </div>
                <div className="admin__modal-item">
                  <span>Plan</span>
                  <strong>{getUserBadge(selectedUser).label}</strong>
                </div>
                <div className="admin__modal-item">
                  <span>{selectedUser.entitlement.autoRenew ? "Renews" : "Premium Until"}</span>
                  <strong>
                    {selectedUser.entitlement.plan === "lifetime"
                      ? "Lifetime"
                      : selectedUser.entitlement.premium
                        ? formatDate(selectedUser.entitlement.expiresAt)
                        : "—"}
                  </strong>
                </div>
                <div className="admin__modal-item">
                  <span>Free Downloads Today</span>
                  <strong>{selectedUser.entitlement.free.used} of {selectedUser.entitlement.free.limit}</strong>
                </div>
                <div className="admin__modal-item">
                  <span>Legacy Credits</span>
                  <strong>{selectedUser.paidDownloads || 0}</strong>
                </div>
                <div className="admin__modal-item">
                  <span>Total Payments</span>
                  <strong>{selectedUser.paymentCount || 0}</strong>
                </div>
                <div className="admin__modal-item">
                  <span>Plan Source</span>
                  <strong>{selectedUser.planSource === "admin" ? "Granted by admin" : selectedUser.entitlement.premium ? "Paystack" : "—"}</strong>
                </div>
                <div className="admin__modal-item">
                  <span>Last Renewal Failed</span>
                  <strong>{toMillis(selectedUser.lastRenewalFailedAt) ? formatDate(selectedUser.lastRenewalFailedAt) : "—"}</strong>
                </div>
              </div>

              <div className="admin__modal-actions">
                <span className="admin__modal-actions-label">Change plan</span>
                <div className="admin__modal-actions-row">
                  {["monthly", "yearly", "lifetime"].map(p => (
                    <button
                      key={p}
                      className="admin__action-btn admin__action-btn--primary"
                      disabled={processing === selectedUser.id}
                      onClick={() => grantPlan(selectedUser, p)}
                    >
                      <i className={`fas fa-${p === "lifetime" ? "crown" : "bolt"}`}></i> {PLANS[p].shortName}
                    </button>
                  ))}
                  {selectedUser.entitlement.premium && (
                    <button
                      className="admin__action-btn admin__action-btn--danger"
                      disabled={processing === selectedUser.id}
                      onClick={() => revokePro(selectedUser)}
                    >
                      <i className="fas fa-ban"></i> Remove Premium
                    </button>
                  )}
                  {selectedUser.entitlement.free.used > 0 && (
                    <button
                      className="admin__action-btn"
                      disabled={processing === selectedUser.id}
                      onClick={() => resetFreeDownloads(selectedUser)}
                    >
                      <i className="fas fa-redo"></i> Reset free downloads
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {mainTab === "cvs" && <AdminCVs />}

        {mainTab === "academy" && <AcademyAdmin />}

      </div>
    </div>
  );
}