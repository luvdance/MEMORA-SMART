import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/memora logo.PNG";
import { useAuth } from "../../context/AuthContext";
import { startAcademyJourney } from "../services/intent";

/**
 * Academy navigation.
 *
 * Every destination here belongs to the Academy. Someone inside a learning
 * platform is trying to find a course, resume a lesson or check their record —
 * not browse an agency site. The single route back out is deliberate and
 * visually separated so the Academy is never a dead end.
 *
 * The bar changes with the learner's state:
 *   signed out   marketing anchors + "Enroll free"
 *   signed in    My Learning · Courses · Profile + avatar
 */

const MARKETING_LINKS = [
  { label: "Courses", to: "/academy/courses" },
  { label: "How it works", href: "/academy#how-it-works" },
  { label: "Certification", href: "/academy#certificate" },
  { label: "FAQ", href: "/academy#faq" },
];

const STUDENT_LINKS = [
  { label: "My Learning", to: "/academy/learn", icon: "fas fa-graduation-cap" },
  { label: "Courses", to: "/academy/courses", icon: "fas fa-layer-group" },
  { label: "Jobs", to: "/academy/jobs", icon: "fas fa-briefcase" },
  { label: "Profile", to: "/academy/profile", icon: "fas fa-user" },
];

export default function AcademyNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1000) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const isActive = (to) => location.pathname === to.split("#")[0];

  /** Enroll is the only conversion action — never a link to the product dashboard. */
  const enroll = () => {
    close();
    startAcademyJourney(navigate, user, "data-analysis");
  };

  const initial = (user?.displayName || user?.email || "S").charAt(0).toUpperCase();

  return (
    <>
      <header className={`ac-nav ${scrolled ? "ac-nav--scrolled" : ""}`}>
        <div className="ac-nav__inner">
          {/* Always the public Academy landing. Inside the lesson player the
              brand is the one predictable way back out to the shop window. */}
          <Link to="/academy" className="ac-brand" onClick={close}>
            <img src={logo} alt="" className="ac-brand__mark" />
            <span className="ac-brand__text">
              <span className="ac-brand__name">Memora Smart</span>
              <span className="ac-brand__sub">Academy</span>
            </span>
          </Link>

          <nav className="ac-nav__links" aria-label="Academy">
            {user
              ? STUDENT_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`ac-nav__link ${isActive(link.to) ? "is-active" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))
              : MARKETING_LINKS.map((link) =>
                  link.to ? (
                    <Link key={link.label} to={link.to} className="ac-nav__link">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href} className="ac-nav__link">
                      {link.label}
                    </a>
                  )
                )}
          </nav>

          <div className="ac-nav__actions">
            <Link to="/" className="ac-nav__home" title="Back to Memora Smart">
              <i className="fas fa-arrow-left" aria-hidden="true" />
              Main site
            </Link>

            <span className="ac-nav__divider" aria-hidden="true" />

            {user ? (
              <Link to="/academy/profile" className="ac-nav__avatar" title="Your profile">
                {user.photoURL ? <img src={user.photoURL} alt="" /> : initial}
              </Link>
            ) : (
              <>
                <button className="ac-nav__login" onClick={enroll}>
                  Log in
                </button>
                <button className="ac-btn ac-btn--primary" onClick={enroll}>
                  Enroll free
                </button>
              </>
            )}
          </div>

          <button
            className="ac-nav__burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <i className="fas fa-bars" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`ac-sheet ${menuOpen ? "is-open" : ""}`}>
        <div className="ac-sheet__top">
          <Link to="/academy" className="ac-brand" onClick={close}>
            <img src={logo} alt="" className="ac-brand__mark" />
            <span className="ac-brand__text">
              <span className="ac-brand__name">Memora Smart</span>
              <span className="ac-brand__sub">Academy</span>
            </span>
          </Link>
          <button className="ac-sheet__close" onClick={close} aria-label="Close menu">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>

        <nav className="ac-sheet__links" aria-label="Academy">
          {user
            ? STUDENT_LINKS.map((link) => (
                <Link key={link.label} to={link.to} onClick={close}>
                  {link.label}
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              ))
            : MARKETING_LINKS.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to} onClick={close}>
                    {link.label}
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} onClick={close}>
                    {link.label}
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </a>
                )
              )}

          <Link to="/" onClick={close} className="ac-sheet__home">
            <span>
              <i className="fas fa-arrow-left" aria-hidden="true" />
              Back to main site
            </span>
          </Link>
        </nav>

        <div className="ac-sheet__actions">
          {user ? (
            <Link
              to="/academy/learn"
              className="ac-btn ac-btn--primary ac-btn--block"
              onClick={close}
            >
              Continue learning
            </Link>
          ) : (
            <>
              <button className="ac-btn ac-btn--primary ac-btn--block" onClick={enroll}>
                Enroll free
              </button>
              <button className="ac-btn ac-btn--ghost ac-btn--block" onClick={enroll}>
                Log in
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && <div className="ac-sheet__scrim" onClick={close} />}
    </>
  );
}
