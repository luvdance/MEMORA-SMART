import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

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

const stats = [
  { icon: "fas fa-file-alt", value: "0", label: "CVs Created" },
  { icon: "fas fa-download", value: "0", label: "Downloads" },
  { icon: "fas fa-th-large", value: "1", label: "Apps Available" },
  { icon: "fas fa-star", value: "Free", label: "Current Plan" },
];

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <DashboardLayout
      title="Overview"
      subtitle={`Welcome back, ${firstName}!`}
    >
      {/* Greeting */}
      <div className="dash-overview__greeting">
        <h1>
          Good day, <span className="dash-gradient-text">{firstName}!</span> 👋
        </h1>
        <p>Here's everything you have access to from your Memora dashboard.</p>
      </div>

      {/* Stats */}
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

      {/* Apps */}
      <div className="dash-apps__title">Your Apps</div>
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
              <span className={`dash-app-card__tag ${app.tag !== "Live" ? "dash-app-card__tag--soon" : ""}`}>
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
    </DashboardLayout>
  );
}