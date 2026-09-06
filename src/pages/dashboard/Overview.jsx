import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { getUserCVs } from "../../cv-builder/utils/cvService";

const apps = [
  {
    icon: "fas fa-file-alt",
    name: "CV Builder",
    desc: "Create stunning, AI-powered CVs with multiple templates and PDF export.",
    tag: "Live",
    path: "/dashboard/cv-builder",
  },
  {
    icon: "fas fa-laptop-code",
    name: "Website Builder",
    desc: "Build and launch professional websites with our drag-and-drop builder.",
    tag: "Coming Soon",
    path: null,
  },
  {
    icon: "fas fa-mobile-alt",
    name: "Mobile App Builder",
    desc: "Turn your ideas into mobile apps without writing a single line of code.",
    tag: "Coming Soon",
    path: null,
  },
  {
    icon: "fas fa-chart-line",
    name: "Data Analysis",
    desc: "Upload your data and get AI-powered insights, charts and reports instantly.",
    tag: "Coming Soon",
    path: null,
  },
  {
    icon: "fas fa-robot",
    name: "AI Automation",
    desc: "Automate your business workflows with powerful AI integrations.",
    tag: "Coming Soon",
    path: null,
  },
  {
    icon: "fas fa-graduation-cap",
    name: "Academy",
    desc: "Learn web development, data analysis, mathematics, physics and more.",
    tag: "Coming Soon",
    path: null,
  },
  {
    icon: "fas fa-file-word",
    name: "Project Formatter",
    desc: "Upload your raw project write-up and get it correctly arranged, numbered, and referenced — ready to print.",
    tag: "Live",
    path: "/dashboard/project-formatter",
  },
];

/* Quick actions — the "Quick Steps" row of the mobile layout */
const quickActions = [
  { icon: "fas fa-file-alt", label: "New CV", path: "/dashboard/cv-builder" },
  { icon: "fas fa-folder-open", label: "My Works", path: "/dashboard/my-works" },
  { icon: "fas fa-shield-alt", label: "ATS Check", path: "/ats-check" },
  { icon: "fas fa-file-word", label: "Formatter", path: "/dashboard/project-formatter" },
];

/* Template carousel. The thumbnails are CSS mock-ups — tapping one opens the
   builder, where the real template picker lives. */
const templates = [
  { name: "Classic Pro", variant: "classic" },
  { name: "Modern Edge", variant: "modern" },
  { name: "Executive Plus", variant: "exec" },
  { name: "Minimal Clean", variant: "minimal" },
  { name: "Creative Side", variant: "creative" },
];

function TemplateThumb({ variant }) {
  return (
    <span className={`dash-tpl__thumb dash-tpl__thumb--${variant}`}>
      <span className="dash-tpl__side"></span>
      <span className="dash-tpl__body">
        <span className="dash-tpl__avatar"></span>
        <span className="dash-tpl__headline"></span>
        <span className="dash-tpl__sub"></span>
        <span className="dash-tpl__rule"></span>
        <span className="dash-tpl__line"></span>
        <span className="dash-tpl__line dash-tpl__line--short"></span>
        <span className="dash-tpl__line"></span>
        <span className="dash-tpl__rule"></span>
        <span className="dash-tpl__line"></span>
        <span className="dash-tpl__line dash-tpl__line--short"></span>
      </span>
    </span>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  // Live count of saved CVs. Read-only; falls back to 0 so the tiles never break.
  const [cvCount, setCvCount] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    let alive = true;
    getUserCVs(user.uid)
      .then((list) => { if (alive) setCvCount(Array.isArray(list) ? list.length : 0); })
      .catch(() => { if (alive) setCvCount(0); });
    return () => { alive = false; };
  }, [user]);

  const liveApps = apps.filter((a) => a.tag === "Live").length;
  const count = cvCount === null ? "—" : String(cvCount);

  const stats = [
    { icon: "fas fa-file-alt", value: count, label: "CVs Created" },
    { icon: "fas fa-folder-open", value: count, label: "Saved Works" },
    { icon: "fas fa-th-large", value: String(liveApps), label: "Apps Available" },
    { icon: "fas fa-star", value: "Free", label: "Current Plan" },
  ];

  return (
    <DashboardLayout title="Overview" subtitle={`Welcome back, ${firstName}!`}>
      {/* ── HERO ── */}
      <section className="dash-hero">
        <div className="dash-hero__copy">
          <p className="dash-hero__eyebrow">Good day, {firstName} 👋</p>
          <h1 className="dash-hero__title">
            Create a Professional <span>CV</span> in Minutes
          </h1>
          <p className="dash-hero__sub">
            Build, customize and download your CV in PDF or Word format.
          </p>
          <div className="dash-hero__actions">
            <button
              className="dash-hero__btn dash-hero__btn--primary"
              onClick={() => navigate("/dashboard/cv-builder")}
            >
              <i className="fas fa-plus"></i>
              <span>Create New CV</span>
            </button>
            <button
              className="dash-hero__btn dash-hero__btn--ghost"
              onClick={() => navigate("/dashboard/my-works")}
            >
              <i className="fas fa-folder-open"></i>
              <span>My CVs</span>
            </button>
          </div>
        </div>

        <div className="dash-hero__art" aria-hidden="true">
          <span className="dash-hero__sheet dash-hero__sheet--back"></span>
          <span className="dash-hero__sheet dash-hero__sheet--mid"></span>
          <span className="dash-hero__sheet dash-hero__sheet--front">
            <span className="dash-hero__sheet-avatar"></span>
            <span className="dash-hero__sheet-line"></span>
            <span className="dash-hero__sheet-line dash-hero__sheet-line--short"></span>
            <span className="dash-hero__sheet-line"></span>
            <span className="dash-hero__sheet-line dash-hero__sheet-line--short"></span>
            <span className="dash-hero__sheet-line"></span>
          </span>
          <span className="dash-hero__spark dash-hero__spark--1">✦</span>
          <span className="dash-hero__spark dash-hero__spark--2">✦</span>
        </div>
      </section>

      {/* ── QUICK STEPS ── */}
      <section className="dash-section">
        <div className="dash-section__head">
          <h2 className="dash-section__title">Quick Steps</h2>
        </div>
        <div className="dash-quick">
          {quickActions.map((q) => (
            <button key={q.label} className="dash-quick__item" onClick={() => navigate(q.path)}>
              <span className="dash-quick__icon">
                <i className={q.icon}></i>
              </span>
              <span className="dash-quick__label">{q.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="dash-section">
        <div className="dash-section__head">
          <h2 className="dash-section__title">Choose a Template</h2>
          <button
            className="dash-section__link"
            onClick={() => navigate("/dashboard/cv-builder")}
          >
            View all <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="dash-templates">
          {templates.map((t) => (
            <button
              key={t.name}
              className="dash-tpl"
              onClick={() => navigate("/dashboard/cv-builder")}
            >
              <TemplateThumb variant={t.variant} />
              <span className="dash-tpl__label">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="dash-section">
        <div className="dash-section__head">
          <h2 className="dash-section__title">At a Glance</h2>
        </div>
        <div className="dash-stats">
          {stats.map((s, i) => (
            <div className="dash-stat-card" key={i}>
              <div className="dash-stat-card__icon">
                <i className={s.icon}></i>
              </div>
              <div className="dash-stat-card__value">{s.value}</div>
              <div className="dash-stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── APPS ── */}
      <section className="dash-section">
        <div className="dash-section__head">
          <h2 className="dash-section__title">Your Apps</h2>
        </div>
        <div className="dash-apps-grid">
          {apps.map((app, i) => (
            <div
              key={i}
              className={`dash-app-card ${app.tag !== "Live" ? "dash-app-card--soon" : ""}`}
              onClick={() => app.path && navigate(app.path)}
            >
              <div className="dash-app-card__icon">
                <i className={app.icon}></i>
              </div>
              <div className="dash-app-card__name">{app.name}</div>
              <div className="dash-app-card__desc">{app.desc}</div>
              <div className="dash-app-card__footer">
                <span
                  className={`dash-app-card__tag ${
                    app.tag !== "Live" ? "dash-app-card__tag--soon" : ""
                  }`}
                >
                  {app.tag}
                </span>
                {app.path && (
                  <div className="dash-app-card__arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST ── */}
      <div className="dash-trust">
        <div className="dash-trust__badge">
          <i className="fas fa-check"></i>
        </div>
        <div className="dash-trust__copy">
          <h3>Your Data is Safe</h3>
          <p>We don&apos;t sell your data. Everything is secure and private.</p>
        </div>
        <div className="dash-trust__shield">
          <i className="fas fa-lock"></i>
        </div>
      </div>
    </DashboardLayout>
  );
}
