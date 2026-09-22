import { useEffect, useRef, useState } from "react";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { user, logout } = useAuth();
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

  /* The account menu closes on an outside click, on Escape and on any
     navigation. Without the outside-click and Escape handlers a dropdown is
     a trap on a touch device, where there is no cursor to move away. */
  useEffect(() => {
    if (!accountOpen) return;

    const onPointerDown = (e) => {
      if (!accountRef.current?.contains(e.target)) setAccountOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  // Any navigation dismisses both menus, so neither is left open over a page
  // the learner has already moved on from.
  useEffect(() => {
    setAccountOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const close = () => setMenuOpen(false);
  const isActive = (to) => location.pathname === to.split("#")[0];

  /**
   * Enroll is the only conversion action — never a link to the product
   * dashboard, and never a specific course. A button labelled "Enroll now"
   * that silently picked Data Analysis was telling the learner one thing and
   * doing another; with no slug this routes to the chooser, where they pick.
   */
  /**
   * WHERE "LOG IN" GOES.
   *
   * It used to call enroll(), which routes to /academy/enroll — the course
   * chooser. So tapping "Log in" showed a list of courses and never offered
   * anywhere to sign in. enroll() does close the mobile sheet, so the
   * navigation was visible; it simply went to the wrong place, on every
   * device.
   *
   * `from` is the page they were on, so signing in returns them to the
   * Academy. AuthPage defaults to the CV dashboard, which is the wrong place
   * to land someone who was reading a course page.
   */
  const login = () => {
    close();
    setAccountOpen(false);
    navigate("/auth", {
      state: { from: `${location.pathname}${location.hash || ""}` },
    });
  };

  const signOut = async () => {
    setAccountOpen(false);
    close();
    try {
      await logout();
    } finally {
      // Back to the public Academy either way. Staying put after signing out
      // leaves a learner looking at an empty copy of their own dashboard,
      // and a failed sign-out must not trap them on it.
      navigate("/academy");
    }
  };

  const enroll = () => {
    close();
    startAcademyJourney(navigate, user);
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
              /* NO ENROLL BUTTON WHEN SIGNED IN.
                 Enroll is an ONBOARDING action — it brings someone into the
                 Academy. Showing it to a student who is already enrolled
                 labels the wrong thing: they do not need enrolling, they need
                 their course. My Learning and Courses above already cover
                 that, and /academy/enroll stays reachable from the dashboard
                 for adding a second course.
                 It also avoids a Firestore read on every page load just to
                 decide what the button should say. */
              /* The badge was a plain link straight to the profile, which
                 left no way to sign out anywhere in the Academy. It is now a
                 menu: profile, and a way out. */
              <div className="ac-nav__account" ref={accountRef}>
                <button
                  type="button"
                  className="ac-nav__avatar"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label="Your account"
                >
                  {user.photoURL ? <img src={user.photoURL} alt="" /> : initial}
                </button>

                {accountOpen && (
                  <div className="ac-nav__menu" role="menu">
                    <p className="ac-nav__menuwho">
                      {/* The account they are signed in AS. Two accounts on
                          one machine is this audience's normal case, and
                          "log out" is the wrong thing to click if you are
                          not sure which one you are in. */}
                      <span>Signed in as</span>
                      <strong>{user.displayName || user.email}</strong>
                    </p>

                    <Link
                      to="/academy/profile"
                      role="menuitem"
                      className="ac-nav__menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      <i className="fas fa-user" aria-hidden="true" />
                      Your profile
                    </Link>

                    <Link
                      to="/academy/learn"
                      role="menuitem"
                      className="ac-nav__menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      <i className="fas fa-graduation-cap" aria-hidden="true" />
                      My learning
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      className="ac-nav__menuitem is-signout"
                      onClick={signOut}
                    >
                      <i className="fas fa-arrow-right-from-bracket" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="ac-nav__login" onClick={login}>
                  Log in
                </button>
                <button className="ac-btn ac-btn--primary" onClick={enroll}>
                  Enroll now
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
            <>
              <Link
                to="/academy/learn"
                className="ac-btn ac-btn--primary ac-btn--block"
                onClick={close}
              >
                Continue learning
              </Link>
              <Link
                to="/academy/profile"
                className="ac-btn ac-btn--ghost ac-btn--block"
                onClick={close}
              >
                Your profile
              </Link>
              {/* The desktop account menu lives in .ac-nav__actions, which is
                  display:none below 1000px — so without this there is no way
                  to sign out on a phone at all. */}
              <button
                className="ac-btn ac-btn--ghost ac-btn--block ac-sheet__signout"
                onClick={signOut}
              >
                <i className="fas fa-arrow-right-from-bracket" aria-hidden="true" />
                Log out
              </button>
              <p className="ac-sheet__who">
                Signed in as {user.displayName || user.email}
              </p>
            </>
          ) : (
            <>
              <button className="ac-btn ac-btn--primary ac-btn--block" onClick={enroll}>
                Enroll now
              </button>
              <button className="ac-btn ac-btn--ghost ac-btn--block" onClick={login}>
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
