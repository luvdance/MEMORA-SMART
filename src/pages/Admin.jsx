import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection, query, where, getDocs,
  doc, updateDoc, serverTimestamp, increment, orderBy
} from "firebase/firestore";
import { db } from "../firebase";

// ⚠️ Replace with YOUR actual Firebase UID
const ADMIN_UID = "REPLACE_WITH_YOUR_FIREBASE_UID";

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [transfers, setTransfers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [tab, setTab] = useState("pending"); // "pending" | "approved"
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

  useEffect(() => {
    if (!loading && (!user || user.uid !== ADMIN_UID)) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.uid === ADMIN_UID) {
      fetchTransfers();
    }
  }, [user, tab]);

  const fetchTransfers = async () => {
    setFetching(true);
    try {
      const q = query(
        collection(db, "pending_transfers"),
        where("status", "==", tab === "pending" ? "pending" : "approved"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransfers(data);

      // Get stats
      const allQ = query(collection(db, "pending_transfers"));
      const allSnap = await getDocs(allQ);
      const all = allSnap.docs.map(d => d.data());
      setStats({
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
      // 1. Update transfer status
      await updateDoc(doc(db, "pending_transfers", transfer.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
        approvedBy: user.uid,
      });

      // 2. Find user and grant access
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", transfer.userId)
      );
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userRef = userSnap.docs[0].ref;

        if (transfer.type === "single_cv") {
          await updateDoc(userRef, {
            paidDownloads: increment(1),
            updatedAt: serverTimestamp(),
          });
        } else if (transfer.type === "pro_monthly") {
          const proExpiresAt = new Date();
          proExpiresAt.setDate(proExpiresAt.getDate() + 31);
          await updateDoc(userRef, {
            isPro: true,
            proExpiresAt,
            updatedAt: serverTimestamp(),
          });
        }

        // 3. Record payment
        await fetch("/api/record-manual-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: transfer.userId,
            email: transfer.userEmail,
            amount: transfer.amount,
            currency: transfer.currency,
            type: transfer.type,
            transferId: transfer.id,
          }),
        });
      }

      // Refresh list
      await fetchTransfers();
    } catch (err) {
      console.error(err);
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

  if (loading) return null;
  if (!user || user.uid !== ADMIN_UID) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9ff",
      fontFamily: "'Neulis', 'Raleway', sans-serif",
      padding: 24,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111", margin: "0 0 6px" }}>
            💳 Payment Admin
          </h1>
          <p style={{ color: "#888", fontSize: "0.875rem", margin: 0 }}>
            Review and approve NGN bank transfers
          </p>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Requests", value: stats.total, color: "#6699FF" },
            { label: "Pending Approval", value: stats.pending, color: "#f59e0b" },
            { label: "Approved", value: stats.approved, color: "#16a34a" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 14,
              padding: "20px",
              border: "1px solid rgba(0,0,0,0.06)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["pending", "approved"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: 25,
                border: "none",
                background: tab === t
                  ? "linear-gradient(90deg, #6699FF, #9D00FF)"
                  : "#fff",
                color: tab === t ? "#fff" : "#555",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "inherit",
                border: tab === t ? "none" : "1px solid #e2e8f0",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* TRANSFERS LIST */}
        {fetching ? (
          <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem", color: "#9D00FF" }}></i>
            <p style={{ marginTop: 12 }}>Loading transfers...</p>
          </div>
        ) : transfers.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: 60,
            background: "#fff",
            borderRadius: 16,
            border: "1px dashed #e2e8f0",
            color: "#888",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>
              {tab === "pending" ? "🎉" : "📋"}
            </div>
            <p style={{ margin: 0 }}>
              {tab === "pending" ? "No pending transfers. All clear!" : "No approved transfers yet."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {transfers.map(t => (
              <div key={t.id} style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                border: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}>
                {/* TYPE ICON */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(102,153,255,0.12), rgba(157,0,255,0.12))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}>
                  {t.type === "single_cv" ? "📄" : "⚡"}
                </div>

                {/* INFO */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, color: "#111", fontSize: "0.9rem", marginBottom: 2 }}>
                    {t.userEmail}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#888" }}>
                    {t.type === "single_cv" ? "Single CV Download" : "Pro Monthly Subscription"}
                    {" · "}
                    ₦{t.amount?.toLocaleString()}
                    {" · "}
                    {t.createdAt?.toDate
                      ? t.createdAt.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "Just now"
                    }
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  background: t.status === "pending"
                    ? "#fff8e6"
                    : t.status === "approved"
                    ? "#f0fdf4"
                    : "#fff1f1",
                  color: t.status === "pending"
                    ? "#d97706"
                    : t.status === "approved"
                    ? "#16a34a"
                    : "#ef4444",
                }}>
                  {t.status.toUpperCase()}
                </div>

                {/* ACTIONS */}
                {t.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleMarkPaid(t)}
                      disabled={processing === t.id}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: "none",
                        background: "linear-gradient(90deg, #6699FF, #9D00FF)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {processing === t.id ? (
                        <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                      ) : (
                        <><i className="fas fa-check"></i> Mark Paid</>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(t.id)}
                      disabled={processing === t.id}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        border: "1px solid #fca5a5",
                        background: "#fff",
                        color: "#ef4444",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}