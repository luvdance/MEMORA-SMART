import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = {
  free: [
    "1 free CV download",
    "All 7 templates",
    "AI suggestions (3/day)",
    "Cloud save",
    "Public CV sharing",
  ],
  cv: [
    "1 PDF download per purchase",
    "All 7 templates",
    "Unlimited AI suggestions",
    "Cloud save",
    "Public CV sharing",
    "ATS-optimized formatting",
  ],
  pro: [
    "Unlimited PDF downloads",
    "All 7 templates",
    "Unlimited template switches",
    "Unlimited AI suggestions",
    "Cloud save + sharing",
    "Priority support",
    "All future templates",
    "Cancel anytime",
  ],
};

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard/cv-builder");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div style={{ fontFamily: "'Neulis', 'Raleway', sans-serif", background: "#f8f9ff", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* HEADING */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#111", margin: "0 0 16px" }}>
            Simple, honest pricing
          </h1>
          <p style={{ fontSize: "1rem", color: "#666", maxWidth: 520, margin: "0 auto" }}>
            Start free. Pay only when you download. Go Pro when you're ready.
            No subscriptions forced on you.
          </p>
        </div>

        {/* PLANS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto 60px" }}>

          {/* FREE */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 28,
            border: "1.5px solid #e2e8f0",
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🎯</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Free</h3>
              <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>Get started, no card needed</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "#111" }}>₦0</span>
              <span style={{ fontSize: "0.82rem", color: "#888" }}> forever</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {features.free.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#444", marginBottom: 8 }}>
                  <i className="fas fa-check" style={{ color: "#9D00FF", fontSize: "0.7rem" }}></i>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleGetStarted}
              style={{
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
              }}
            >
              Get Started Free
            </button>
          </div>

          {/* PAY PER CV */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 28,
            border: "1.5px solid #e2e8f0",
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>📄</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Pay per CV</h3>
              <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>Occasional job seekers</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "#111" }}>₦3,500</span>
              <span style={{ fontSize: "0.82rem", color: "#888" }}> per download</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {features.cv.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#444", marginBottom: 8 }}>
                  <i className="fas fa-check" style={{ color: "#9D00FF", fontSize: "0.7rem" }}></i>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleGetStarted}
              style={{
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
              }}
            >
              Build Your CV
            </button>
          </div>

          {/* PRO */}
          <div style={{
            background: "linear-gradient(135deg, rgba(102,153,255,0.06), rgba(157,0,255,0.06))",
            borderRadius: 16,
            padding: 28,
            border: "2px solid #9D00FF",
            position: "relative",
          }}>
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
              MOST POPULAR
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>⚡</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Memora Pro</h3>
              <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>Serious professionals</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "#111" }}>₦7,500</span>
              <span style={{ fontSize: "0.82rem", color: "#888" }}> /month</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {features.pro.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#444", marginBottom: 8 }}>
                  <i className="fas fa-check" style={{ color: "#9D00FF", fontSize: "0.7rem" }}></i>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleGetStarted}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 25,
                border: "none",
                background: "linear-gradient(90deg, #6699FF, #9D00FF)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 15px rgba(157,0,255,0.3)",
              }}
            >
              Go Pro — ₦7,500/mo
            </button>
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#888", margin: "8px 0 0" }}>
              Cancel anytime. No hidden fees.
            </p>
          </div>

        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111", textAlign: "center", marginBottom: 32 }}>
            Frequently asked questions
          </h2>
          {[
            {
              q: "What happens after I use my free CV?",
              a: "You can keep building and editing CVs for free. You only need to pay when you want to download the PDF.",
            },
            {
              q: "Can I switch templates before paying?",
              a: "Yes. Switch templates as many times as you want while building. You only pay at the point of download.",
            },
            {
              q: "How is my payment secured?",
              a: "All payments are processed by Paystack, Nigeria's leading payment processor. Your card details are never stored on our servers.",
            },
            {
              q: "Can I cancel my Pro subscription?",
              a: "Yes, cancel anytime from your profile page. You'll keep Pro access until the end of your billing period.",
            },
            {
              q: "Will my CVs be saved if I cancel?",
              a: "Yes. All your CVs are permanently saved in your account regardless of your plan.",
            },
          ].map((item, i) => (
            <div key={i} style={{
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

      <Footer />
    </div>
  );
}