/* eslint-disable react-refresh/only-export-components -- the frame and its context belong together */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, devUser } from "./api";
import lockup from "../assets/memotify/lockup.png";
import lockupDark from "../assets/memotify/lockup-dark.png";
import {
  Briefcase, Buildings, CaretDown, FileText, GraduationCap, Kanban, SignOut, Stamp, UserCircle, UserGear, UserSound,
} from "./icons";
import "./memotify.css";

/**
 * The frame around every Memotify page, and the signed-in person's record.
 *
 * Phones get an app-style tab bar at the thumb; wider screens get a top bar.
 * `me` is loaded once here because the tabs, the job pages and the Passport
 * all need it.
 */
const MeContext = createContext(null);

export function useMe() {
  return useContext(MeContext);
}

export function MeProvider({ children }) {
  const { user: authUser, loading } = useAuth();
  const dev = devUser();
  const user = dev || authUser;
  const uid = user?.uid || null;
  const [me, setMe] = useState(null);
  const [meError, setMeError] = useState(null);

  const reloadMe = useCallback(async () => {
    if (!uid) return null;
    const next = await api("me");
    setMe(next);
    setMeError(null);
    return next;
  }, [uid]);

  useEffect(() => {
    let alive = true;
    if (uid) {
      api("me")
        .then((next) => alive && setMe(next))
        .catch((error) => alive && setMeError(error));
    }
    return () => {
      alive = false;
    };
  }, [uid]);

  const value = useMemo(
    () => ({ user, signedIn: Boolean(user), authLoading: loading && !dev, me: uid ? me : null, meError, setMe, reloadMe }),
    [user, loading, dev, uid, me, meError, reloadMe]
  );
  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

/** Send a signed-out person to sign in, and back here afterwards. */
export function useRequireSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    () => navigate("/auth", { state: { from: location.pathname + location.search } }),
    [navigate, location]
  );
}

const TABS = [
  { to: "/memotify/jobs", label: "Jobs", icon: Briefcase },
  { to: "/memotify/passport", label: "Passport", icon: Stamp },
  { to: "/memotify/tracker", label: "Tracker", icon: Kanban },
  { to: "/memotify/hire", label: "Hire", icon: Buildings },
];

const ACCOUNT_LINKS = [
  { to: "/memotify/passport", label: "My profile and Passport", icon: Stamp },
  { to: "/memotify/tracker", label: "My applications", icon: Kanban },
  { to: "/memotify/interview", label: "Interview practice", icon: UserSound },
  { to: "/memotify/hire", label: "Employer workspace", icon: Buildings },
  { to: "/dashboard/cv-builder", label: "CV Builder", icon: FileText },
  { to: "/academy", label: "Academy", icon: GraduationCap },
  { to: "/dashboard/profile", label: "Account settings", icon: UserGear },
];

/** Closes on an outside tap and on Escape. Every page has its own Shell, so navigating resets it. */
function AccountMenu() {
  const { user, me } = useMe();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!box.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const leave = async () => {
    setOpen(false);
    await logout();
    navigate("/memotify");
  };

  return (
    <div className="mf-acct" ref={box}>
      <button
        type="button"
        className="mf-top__me"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen(!open)}
      >
        <UserCircle size={26} weight="duotone" />
        <CaretDown size={12} weight="bold" />
      </button>
      {open && (
        <div className="mf-acct__menu" role="menu">
          <p className="mf-acct__who">
            <b>{me?.name || user?.displayName || "Your account"}</b>
            <span>{user?.email}</span>
          </p>
          {ACCOUNT_LINKS.map((item) => (
            <Link key={item.to} to={item.to} role="menuitem" onClick={() => setOpen(false)}>
              <item.icon size={19} /> {item.label}
            </Link>
          ))}
          <button type="button" role="menuitem" className="mf-acct__out" onClick={leave}>
            <SignOut size={19} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Shell({ children, tabs = true, dark = false, wide = false }) {
  const { signedIn } = useMe();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`mf ${tabs ? "mf--tabs" : ""}`}>
      <header className={`mf-top ${dark ? "mf-top--dark" : ""}`}>
        <div className="mf-top__in">
          <Link to="/memotify" aria-label="Memotify home" className="mf-top__logo">
            <img src={dark ? lockupDark : lockup} alt="Memotify" />
          </Link>
          <nav className="mf-top__nav" aria-label="Memotify">
            {TABS.map((tab) => (
              <NavLink key={tab.to} to={tab.to} className="mf-top__link">
                {tab.label}
              </NavLink>
            ))}
          </nav>
          {signedIn ? (
            <AccountMenu />
          ) : (
            <Link to="/auth" state={{ from: pathname }} className="mf-top__in-link">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className={wide ? "mf-main mf-main--wide" : "mf-main"}>{children}</main>

      {tabs && (
        <nav className="mf-tabs" aria-label="Memotify sections">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className="mf-tabs__tab">
              {({ isActive }) => (
                <>
                  <tab.icon size={23} weight={isActive ? "fill" : "regular"} />
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mf-foot">
      <div className="mf-foot__in">
        <img src={lockupDark} alt="Memotify" className="mf-foot__logo" />
        <p>Real opportunities. Right on time. Built in Nigeria by Memora Smart Technologies.</p>
        <nav aria-label="More from Memora Smart">
          <Link to="/memotify/jobs">Browse jobs</Link>
          <Link to="/memotify/hire">Hire on Memotify</Link>
          <Link to="/cv-builder">CV Builder</Link>
          <Link to="/ats-check">ATS checker</Link>
          <Link to="/academy">Academy</Link>
        </nav>
        <p className="mf-foot__small">
          Memotify never charges you to apply. Any employer who asks you for money is breaking our rules: report the job.
        </p>
      </div>
    </footer>
  );
}
