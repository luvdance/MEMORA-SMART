/**
 * REACT DEVELOPMENT · MODULE 12 · AUTHENTICATION AND APPLICATION SECURITY
 *
 * Curriculum 12.1 – 12.P. Authentication versus authorization, account
 * flows, auth providers, sessions and tokens, protected and role-aware UI,
 * access-denied states, expired sessions, validation and safe rendering,
 * XSS, why frontend protection is not security, cookies versus storage,
 * secrets, profiles and settings, and testing auth flows.
 *
 * The labs' auth backend is the lab's mock API (real status codes and
 * headers). The security lessons are written to be honest about the
 * boundary: the frontend decides what to SHOW; only the server decides what
 * anyone may DO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s12-auth";
const MODULE = "rx-m12-auth";

const AUTH_CSS = `:root { font-family: system-ui, Arial, sans-serif; color: #1f2937; }
body { margin: 0; padding: 16px; }
label { display: block; margin-top: 10px; }
input { font: inherit; padding: 8px; min-height: 44px; }
button { font: inherit; min-height: 44px; padding: 8px 14px; margin-top: 10px; }
`;

const lab = (spec) => reactLab({ css: AUTH_CSS, ...spec });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 12.1 – 12.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l70-auth-flows",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3"],
    title: "Authentication Flows",
    subtitle: "Authentication versus authorization, account flows, and connecting to an auth provider",
    estimatedMinutes: 40,
    intro: "Signing in looks simple and is where security mistakes cost the most. This module is about what the React app does, and, just as important, what it must never be trusted to do.",

    atoms: [
      {
        id: "a-rx-authn-authz",
        title: "Authentication versus authorization",
        explain:
          "AUTHENTICATION answers \"who are you?\": proving identity with a password, a one-time code, a passkey or a Google account. AUTHORIZATION answers \"what may you do?\": a student may read their own grades; an instructor may edit their course; an admin may delete users. They fail differently: 401 Unauthorized really means \"not authenticated\" (sign in), while 403 Forbidden means \"authenticated but not authorized\". Authorization must be decided on the server for every request, using the identity the server verified, never a role the browser claims.",
        decision: {
          scenario: "A signed-in student opens /admin/users by typing the URL. The API returns 403.",
          question: "What happened, and what should the app show?",
          options: [
            { id: "a", text: "They are authenticated but not authorized: show an access-denied page, and keep them signed in", why: "403 means the server knows who they are and refused. Signing them out would be wrong; explaining is right." },
            { id: "b", text: "They are not authenticated: send them to the login page", whyWrong: "That is 401. They are signed in." },
            { id: "c", text: "A server bug: retry", whyWrong: "403 is a deliberate refusal." },
            { id: "d", text: "Show the admin page with empty data", whyWrong: "Confusing, and it suggests the page is theirs to use." },
          ],
          correct: "a",
          aftermath: "Authentication: who. Authorization: what. 401 versus 403.",
        },
      },
      {
        id: "a-rx-account-flows",
        title: "Registration, login, logout and password-reset flows",
        explain:
          "REGISTRATION collects the minimum, validates, and often sends an email to verify the address. LOGIN must not reveal which part was wrong: \"Email or password is incorrect\", never \"no account with that email\" (that tells attackers which emails exist). LOGOUT clears the session on the server and the client, and resets any cached user data (TanStack Query: queryClient.clear()). PASSWORD RESET emails a single-use, short-lived link, and the request page always says \"If an account exists, we sent a link\", whether or not it does. Rate limiting and lockouts are the server's job; the UI disables the button while submitting.",
        webLab: lab({
          task:
            "Build the login form. POST { email, password } as JSON to /api/login. On 200, show <p role=\"status\">Signed in as EMAIL</p> using the response's user.email. On 401, show <p role=\"alert\">Email or password is incorrect</p> (never which one) and clear the password field but keep the email. The submit button is disabled while the request is in flight.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Sign in</button>
    </form>
  );
}
`,
          },
          mocks: [{ match: "/api/login", method: "POST", status: 200, body: { user: { id: 1, email: "ada@example.com" } }, delay: 120 }],
          tests: [
            { label: "Posts JSON and disables the button meanwhile", check: "await type('#email', 'ada@example.com'); await type('#password', 'react2026!'); await submit('form'); const c = fetchCalls()[0]; return !!c && c.method === 'POST' && JSON.parse(c.body).password === 'react2026!' && c.headers['content-type'] === 'application/json' && $('button').disabled;", fail: "fetch(\"/api/login\", { method: \"POST\", headers, body: JSON.stringify({ email, password }) })" },
            { label: "Success shows who is signed in", check: "return await waitFor(() => text('[role=status]') === 'Signed in as ada@example.com');", fail: "Read user.email from the response." },
            { label: "401: a generic message, password cleared, email kept", mocks: [{ match: "/api/login", method: "POST", status: 401, body: { message: "No user with that email" }, delay: 40 }], check: "await type('#email', 'ada@example.com'); await type('#password', 'wrong'); await submit('form'); await waitFor(() => !!$('[role=alert]')); return text('[role=alert]') === 'Email or password is incorrect' && $('#password').value === '' && $('#email').value === 'ada@example.com';", fail: "Do not show the server's detailed message; show the generic one." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [user, setUser] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 401) {
        setPassword("");
        setStatus("invalid");
        return;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setUser(data.user);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={status === "submitting"}>Sign in</button>
      {status === "success" && <p role="status">Signed in as {user.email}</p>}
      {status === "invalid" && <p role="alert">Email or password is incorrect</p>}
      {status === "error" && <p role="alert">Could not sign in. Try again.</p>}
    </form>
  );
}
`,
          },
          hint: "The server's message (\"No user with that email\") leaks information. Show your own generic one.",
          successMessage: "A login that helps users without helping attackers.",
        }),
      },
      {
        id: "a-rx-auth-provider",
        title: "Connecting React to an authentication provider or backend",
        explain:
          "Most apps do not build authentication themselves: an AUTH PROVIDER (Firebase Authentication, Auth0, Clerk, Supabase Auth, AWS Cognito) or the company's own backend handles passwords, hashing, email verification, social logins and multi-factor authentication. The React side is the same shape whatever the provider: an AuthProvider component that subscribes to the provider's \"auth state changed\" event, keeps { user, status } in Context (status is \"loading\" until the first answer, so the app does not flash the login page), and exposes signIn, signOut and the user through a useAuth Hook (Module 7 and 11). Components never call the provider's SDK directly.",
        webLab: lab({
          task:
            "Build AuthProvider in auth.jsx around the provider SDK in authSdk.js (read-only; it behaves like Firebase's onAuthStateChanged). Subscribe in an effect and unsubscribe in the cleanup; keep { user, status } where status starts \"loading\" and becomes \"ready\" on the first callback; expose signIn and signOut. App shows \"Checking your session…\" while loading, then the user or a Sign in button.",
          files: {
            "src/authSdk.js": `// A pretend auth provider SDK. Do not edit.
let current = null;
const listeners = new Set();
export function onAuthStateChanged(callback) {
  listeners.add(callback);
  setTimeout(() => callback(current), 150);
  return () => listeners.delete(callback);
}
export async function signInWithPassword(email) {
  current = { email };
  listeners.forEach((l) => l(current));
}
export async function signOutUser() {
  current = null;
  listeners.forEach((l) => l(current));
}
export const listenerCount = () => listeners.size;
`,
            "src/auth.jsx": `import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPassword, signOutUser } from "./authSdk.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  return useContext(AuthContext);
}
`,
            "src/App.jsx": `import { AuthProvider, useAuth } from "./auth.jsx";
import { listenerCount } from "./authSdk.js";

function Home() {
  const { user, status, signIn, signOut } = useAuth();
  if (status === "loading") return <p role="status">Checking your session…</p>;
  return user ? (
    <p>
      {user.email} <button onClick={signOut}>Sign out</button>
      <span className="listeners">{listenerCount()}</span>
    </p>
  ) : (
    <button onClick={() => signIn("ada@example.com")}>Sign in</button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
`,
          },
          readOnly: ["src/authSdk.js", "src/App.jsx"],
          tests: [
            { label: "Loading until the provider answers", check: "const l = text('[role=status]') === 'Checking your session…'; await waitFor(() => !!$$('button').find((b) => text(b) === 'Sign in')); return l;", fail: "status starts \"loading\"; the callback sets it to \"ready\"." },
            { label: "Sign in and out go through the provider", check: "await click($$('button').find((b) => text(b) === 'Sign in')); await waitFor(() => text('p').startsWith('ada@example.com')); await click($$('button').find((b) => text(b) === 'Sign out')); return await waitFor(() => !!$$('button').find((b) => text(b) === 'Sign in'));", fail: "signIn calls signInWithPassword; signOut calls signOutUser." },
            { label: "Exactly one subscription (the cleanup works under Strict Mode)", check: "await click($$('button').find((b) => text(b) === 'Sign in')); await waitFor(() => !!$('.listeners')); return text('.listeners') === '1';", fail: "return onAuthStateChanged(…) from the effect, so its unsubscribe is the cleanup." },
          ],
          solution: {
            "src/auth.jsx": `import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPassword, signOutUser } from "./authSdk.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, status: "loading" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => setState({ user, status: "ready" }));
    return unsubscribe;
  }, []);

  const value = {
    ...state,
    signIn: (email) => signInWithPassword(email),
    signOut: () => signOutUser(),
  };
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
`,
          },
          hint: "onAuthStateChanged returns its own unsubscribe function: return it from the effect.",
          successMessage: "Any provider plugs into the same AuthProvider shape, and nothing else knows which one it is.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 12.4 – 12.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l71-sessions-roles",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.4", "12.5", "12.6", "12.7"],
    title: "Sessions, Roles and Expiry",
    subtitle: "Session persistence and tokens, role-aware interfaces, access-denied states and expired sessions",
    estimatedMinutes: 45,
    intro: "After sign-in, the app must remember the session, adapt to what the user may do, explain when they may not, and cope when the session ends.",

    atoms: [
      {
        id: "a-rx-session-tokens",
        title: "Session persistence and token handling",
        explain:
          "Two common designs. SESSION COOKIE: the server sets an httpOnly, Secure, SameSite cookie; the browser sends it automatically; JavaScript cannot read it. On load, the app asks GET /api/me to find out who is signed in. ACCESS TOKEN: the server returns a short-lived token (often a JWT) that the app keeps and sends in the Authorization header (Module 9), with a longer-lived refresh token to get new ones. Either way: on startup, restore the session before deciding what to show; treat the token as a secret (never log it, never put it in a URL); and a JWT's payload is readable by anyone, so it must never contain secrets.",
        webLab: lab({
          task:
            "Restore the session on startup. The server uses an httpOnly cookie, so the app cannot read it: instead call GET /api/me (with credentials: \"include\") when the app loads. 200 means signed in (show \"Welcome back, NAME\"); 401 means signed out (show a Sign in link). Show \"Loading…\" until the answer arrives, so the page does not flash the wrong state.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);

  return user ? <p>Welcome back, {user.name}</p> : <a href="/login">Sign in</a>;
}
`,
          },
          mocks: [{ match: "/api/me", status: 200, body: { id: 1, name: "Ada" }, delay: 150 }],
          tests: [
            { label: "Loading first, not a flash of Sign in", check: "return text('#root') === 'Loading…' && !$('a');", fail: "Track a status that starts as \"loading\"." },
            { label: "A valid session restores the user", check: "await waitFor(() => text('#root') === 'Welcome back, Ada'); const c = fetchCalls().find((x) => x.url.includes('/api/me')); return !!c;", fail: "GET /api/me in an effect, then set the user." },
            { label: "401 shows Sign in", mocks: [{ match: "/api/me", status: 401, body: {}, delay: 40 }], check: "return await waitFor(() => text('a') === 'Sign in');", fail: "On 401, the user is signed out." },
            { label: "Cookies are sent", check: "return /credentials\\s*:\\s*[\"']include[\"']/.test(code('src/App.jsx'));", fail: "fetch(\"/api/me\", { credentials: \"include\" })" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [session, setSession] = useState({ status: "loading", user: null });

  useEffect(() => {
    let ignore = false;
    fetch("/api/me", { credentials: "include" })
      .then(async (res) => {
        const user = res.ok ? await res.json() : null;
        if (!ignore) setSession({ status: "ready", user });
      })
      .catch(() => !ignore && setSession({ status: "ready", user: null }));
    return () => {
      ignore = true;
    };
  }, []);

  if (session.status === "loading") return <p>Loading…</p>;
  return session.user ? <p>Welcome back, {session.user.name}</p> : <a href="/login">Sign in</a>;
}
`,
          },
          hint: "The session is the server's knowledge; the app asks, it does not guess.",
          successMessage: "The page waits for the truth before choosing what to show.",
        }),
      },
      {
        id: "a-rx-role-ui",
        title: "Protected routes and role-aware interfaces",
        explain:
          "Beyond signed in or not, many apps have ROLES (student, instructor, admin) or finer PERMISSIONS (\"course:edit\"). The UI uses them to show only what applies: an Edit button only for the course's instructor, an Admin link only for admins, a RequireRole layout around /admin. Write it once: a can(user, permission) helper or a <Can permission=\"course:edit\"> component, rather than role checks scattered through the JSX. The server sends the user's roles with their profile; remember that hiding a button is convenience, not protection (Lesson 72).",
        webLab: lab({
          task:
            "Write can(user, permission) in permissions.js using the ROLE_PERMISSIONS table, and a <Can> component that renders its children only when the current user has the permission. Use it in the course page: students see only Enroll; instructors also see Edit course; admins also see Delete course.",
          files: {
            "src/permissions.js": `export const ROLE_PERMISSIONS = {
  student: ["course:enroll"],
  instructor: ["course:enroll", "course:edit"],
  admin: ["course:enroll", "course:edit", "course:delete"],
};

export function can(user, permission) {
  return true;
}
`,
            "src/App.jsx": `import { useState } from "react";
import { can } from "./permissions.js";

function Can({ user, permission, children }) {
  return children;
}

function CoursePage({ user }) {
  return (
    <section>
      <h1>React Development</h1>
      <Can user={user} permission="course:enroll"><button>Enroll</button></Can>
      <Can user={user} permission="course:edit"><button>Edit course</button></Can>
      <Can user={user} permission="course:delete"><button>Delete course</button></Can>
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState("student");
  return (
    <>
      <label htmlFor="role">View as</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>
      <CoursePage user={{ name: "Ada", role }} />
    </>
  );
}
`,
          },
          tests: [
            { label: "Students see only Enroll", check: "return $$('section button').map((b) => text(b)).join() === 'Enroll';", fail: "can returns ROLE_PERMISSIONS[user.role]?.includes(permission)." },
            { label: "Instructors also see Edit", check: "await type('#role', 'instructor'); return $$('section button').map((b) => text(b)).join() === 'Enroll,Edit course';", fail: "Can renders children only when can(user, permission)." },
            { label: "Admins see all three", check: "await type('#role', 'admin'); return $$('section button').map((b) => text(b)).join() === 'Enroll,Edit course,Delete course';", fail: "Admins have course:delete." },
            { label: "No user, or an unknown role, may do nothing", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/permissions.js'))); return m.can(null, 'course:enroll') === false && m.can({ role: 'hacker' }, 'course:enroll') === false;", fail: "Handle a missing user or role: return false." },
          ],
          solution: {
            "src/permissions.js": `export const ROLE_PERMISSIONS = {
  student: ["course:enroll"],
  instructor: ["course:enroll", "course:edit"],
  admin: ["course:enroll", "course:edit", "course:delete"],
};

export function can(user, permission) {
  if (!user) return false;
  return (ROLE_PERMISSIONS[user.role] ?? []).includes(permission);
}
`,
            "src/App.jsx": `import { useState } from "react";
import { can } from "./permissions.js";

function Can({ user, permission, children }) {
  return can(user, permission) ? children : null;
}

function CoursePage({ user }) {
  return (
    <section>
      <h1>React Development</h1>
      <Can user={user} permission="course:enroll"><button>Enroll</button></Can>
      <Can user={user} permission="course:edit"><button>Edit course</button></Can>
      <Can user={user} permission="course:delete"><button>Delete course</button></Can>
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState("student");
  return (
    <>
      <label htmlFor="role">View as</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>
      <CoursePage user={{ name: "Ada", role }} />
    </>
  );
}
`,
          },
          hint: "Default to no permission: an unknown role gets an empty list.",
          successMessage: "One permission table, one helper, and the UI adapts to each role.",
        }),
      },
      {
        id: "a-rx-access-denied",
        title: "Displaying permissions and access-denied states",
        explain:
          "When someone reaches something they may not use, say so plainly, instead of a blank page, a broken page or a silent redirect: \"You do not have access to the admin area. If you think this is a mistake, contact your administrator.\" Offer a way on (back to the dashboard). Show it for 403 responses from the API and for routes the user's role excludes. For actions that are visible but not available (a locked lesson), show them disabled with the reason (\"Complete Module 3 to unlock\"), so the interface stays honest about what exists.",
        webLab: lab({
          task:
            "The admin page fetches /api/admin/stats. When the API answers 403, render an AccessDenied component: <h1>Access denied</h1>, a <p> saying \"You do not have access to the admin area.\", and a link \"Back to dashboard\" to /dashboard. On 200 show the stats as before.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading…</p>;
  return <h1>Users: {stats.users}</h1>;
}
`,
          },
          mocks: [{ match: "/api/admin/stats", status: 403, body: { message: "Forbidden" }, delay: 40 }],
          tests: [
            { label: "403 shows an explained access-denied page", check: "await waitFor(() => text('h1') === 'Access denied'); const a = $$('a').find((x) => text(x) === 'Back to dashboard'); return text('p') === 'You do not have access to the admin area.' && !!a && a.getAttribute('href') === '/dashboard';", fail: "if (res.status === 403) set a denied state and render AccessDenied." },
            { label: "Allowed users still see the stats", mocks: [{ match: "/api/admin/stats", status: 200, body: { users: 1240 }, delay: 40 }], check: "return await waitFor(() => text('h1') === 'Users: 1240');", fail: "Keep the success path." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

function AccessDenied() {
  return (
    <>
      <h1>Access denied</h1>
      <p>You do not have access to the admin area.</p>
      <a href="/dashboard">Back to dashboard</a>
    </>
  );
}

export default function App() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    fetch("/api/admin/stats").then(async (r) => {
      if (r.status === 403) return setState({ status: "denied" });
      if (!r.ok) return setState({ status: "error" });
      setState({ status: "ready", stats: await r.json() });
    });
  }, []);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "denied") return <AccessDenied />;
  if (state.status === "error") return <p role="alert">Could not load the stats.</p>;
  return <h1>Users: {state.stats.users}</h1>;
}
`,
          },
          hint: "Check res.status before res.json().",
          successMessage: "A refusal that explains itself and offers a way on.",
        }),
      },
      {
        id: "a-rx-expired-auth",
        title: "Handling expired sessions",
        explain:
          "Sessions end: tokens expire, cookies time out, a password is changed on another device, an admin revokes access. Handle it centrally (Module 9): on any 401 from an authenticated request, clear the user (and any cached private data), show a clear notice (\"Your session expired. Please sign in again.\"), and send them to the login page remembering where they were, so signing in returns them there. Do not lose work: if the 401 came from saving a form, keep the draft (in state or localStorage) so it can be submitted after signing in.",
        decision: {
          scenario: "A tutor spends twenty minutes writing feedback, presses Save, and the API answers 401 because the session expired.",
          question: "What should the app do?",
          options: [
            { id: "a", text: "Keep the draft, explain the session expired, send them to sign in, and bring them back to the form with the draft intact", why: "The session ending is not the user's fault; losing twenty minutes of work would be the app's." },
            { id: "b", text: "Reload the page to show the login form", whyWrong: "The draft is lost." },
            { id: "c", text: "Show \"Error 401\"", whyWrong: "Meaningless to most people, and no way forward." },
            { id: "d", text: "Retry the save until it works", whyWrong: "It will keep returning 401 until they sign in." },
          ],
          correct: "a",
          aftermath: "Expiry is normal; losing someone's work is not.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 12.8 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l72-xss",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.8", "12.9", "12.10"],
    title: "Safe Rendering and the Limits of Frontend Security",
    subtitle: "Validation and safe rendering, cross-site scripting, and why route protection is not security",
    estimatedMinutes: 40,
    intro: "React prevents the most common web attack by default. This lesson shows how, the few ways to switch that protection off by accident, and the most important security fact about any frontend.",

    atoms: [
      {
        id: "a-rx-safe-rendering",
        title: "Input validation and safe rendering",
        explain:
          "React ESCAPES everything you put in braces: {comment.text} containing <img src=x onerror=alert(1)> shows those characters as text; it never becomes HTML. That is safe rendering by default. Validate input for correctness and helpful errors (Module 5), and treat every value from users or APIs as data to display, not code to run. Things that are NOT escaped: dangerouslySetInnerHTML; href and src attributes (a javascript: URL in an href runs code when clicked, so allow only http: and https: links you did not write); and anything you pass to eval, new Function or document.write.",
        webLab: lab({
          task:
            "User profiles have a website field typed by the user. A malicious user set theirs to javascript:alert(document.cookie), which would run when clicked. Write safeUrl(url) in safeUrl.js: return the URL only if it parses with new URL() and its protocol is http: or https:, otherwise return null. ProfileLink renders the link only for a safe URL, and plain text \"No website\" otherwise.",
          files: {
            "src/safeUrl.js": `export function safeUrl(url) {
  return url;
}
`,
            "src/App.jsx": `import { safeUrl } from "./safeUrl.js";

function ProfileLink({ name, website }) {
  const href = safeUrl(website);
  return (
    <li>
      {name}: {href ? <a href={href}>{href}</a> : "No website"}
    </li>
  );
}

const users = [
  { name: "Ada", website: "https://ada.dev" },
  { name: "Mallory", website: "javascript:alert(document.cookie)" },
  { name: "Tunde", website: "not a url" },
  { name: "Ngozi", website: "http://ngozi.ng/portfolio" },
];

export default function App() {
  return (
    <ul>
      {users.map((u) => (
        <ProfileLink key={u.name} {...u} />
      ))}
    </ul>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "https and http links are kept", check: "const a = $$('a').map((x) => x.getAttribute('href')); return a.join() === 'https://ada.dev/,http://ngozi.ng/portfolio' || a.join() === 'https://ada.dev,http://ngozi.ng/portfolio';", fail: "Allow only http: and https:." },
            { label: "javascript: and invalid URLs are rejected", check: "return text($$('li')[1]) === 'Mallory: No website' && text($$('li')[2]) === 'Tunde: No website' && !$$('a').some((x) => /^javascript:/i.test(x.getAttribute('href')));", fail: "new URL(url) throws for invalid input; check url.protocol." },
            { label: "Tricky casing and spacing do not get through", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/safeUrl.js'))); return m.safeUrl(' JavaScript:alert(1)') === null && m.safeUrl('data:text/html,<b>x</b>') === null && m.safeUrl('HTTPS://ok.com') !== null;", fail: "new URL normalises the protocol to lower case; compare that." },
          ],
          solution: {
            "src/safeUrl.js": `const ALLOWED = ["http:", "https:"];

export function safeUrl(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED.includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}
`,
          },
          hint: "Use an allow-list of protocols, never a block-list of bad ones.",
          successMessage: "An allow-list: anything not known to be safe is refused.",
        }),
      },
      {
        id: "a-rx-xss",
        title: "Cross-site scripting (XSS) risks",
        explain:
          "XSS is an attacker getting their JavaScript to run in YOUR page, in another user's browser, where it can read the page, act as that user and send their data away. It happens when user content is inserted as HTML. In React that almost always means dangerouslySetInnerHTML, named to make you stop and think. If you must render user HTML (a rich-text comment, Markdown converted to HTML), SANITISE it first with a maintained library such as DOMPurify (DOMPurify.sanitize(html)), which removes scripts, event-handler attributes and dangerous URLs. Never write your own sanitiser with regular expressions. A Content-Security-Policy header adds a second line of defence.",
        webLab: lab({
          task:
            "Comments are rendered with dangerouslySetInnerHTML, so a comment containing an <img onerror> runs code. The comments are plain text, so render them as text with braces instead: the attack must show up as harmless text, and no <img> element may exist.",
          files: {
            "src/App.jsx": `const comments = [
  { id: 1, author: "Ada", text: "Great lesson!" },
  { id: 2, author: "Mallory", text: '<img src="x" onerror="window.__pwned = true">' },
];

export default function App() {
  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>
          <strong>{c.author}</strong>: <span dangerouslySetInnerHTML={{ __html: c.text }} />
        </li>
      ))}
    </ul>
  );
}
`,
          },
          tests: [
            { label: "The attack is shown as text and does not run", check: "await wait(50); return !$('li img') && !window.__pwned && text($$('li')[1]).includes('<img src=\"x\" onerror=');", fail: "Render {c.text} instead of dangerouslySetInnerHTML." },
            { label: "No dangerouslySetInnerHTML left", check: "return !/dangerouslySetInnerHTML/.test(code('src/App.jsx'));", fail: "Remove it." },
          ],
          solution: {
            "src/App.jsx": `const comments = [
  { id: 1, author: "Ada", text: "Great lesson!" },
  { id: 2, author: "Mallory", text: '<img src="x" onerror="window.__pwned = true">' },
];

export default function App() {
  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>
          <strong>{c.author}</strong>: <span>{c.text}</span>
        </li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "React escapes text in braces, so markup is shown, never executed.",
          successMessage: "Escaped by default. Keep it that way unless you sanitise.",
        }),
      },
      {
        id: "a-rx-frontend-not-security",
        title: "Why frontend route protection is not backend security",
        explain:
          "Everything in the browser is under the user's control. They can read your JavaScript bundle (every route, every API URL, every role check), change any variable in DevTools, edit localStorage to say role: \"admin\", and call your API directly with curl, skipping React entirely. So a RequireAuth route, a hidden Delete button and a can() check only decide what to SHOW. Real protection happens on the SERVER, on every request: verify the session or token, look up the user's permissions from the server's own records, and refuse with 401 or 403. If the UI and the server disagree, the server must win.",
        decision: {
          scenario:
            "The admin page is protected by <RequireRole role=\"admin\">, and the Delete user button is hidden from non-admins. The API endpoint DELETE /api/users/:id deletes the user without checking who is asking, \"because only admins can see the button\".",
          question: "Is this secure?",
          options: [
            { id: "a", text: "No: anyone can call DELETE /api/users/7 directly; the server must check the requester is an admin", why: "The UI's checks are convenience. The endpoint is reachable by anyone with a terminal." },
            { id: "b", text: "Yes: the route is protected", whyWrong: "The route only protects what React shows. The API does not care which page you are on." },
            { id: "c", text: "Yes, if the bundle is minified", whyWrong: "Minified code is still readable, and the API URL is visible in the Network panel." },
            { id: "d", text: "Yes, if the user's role is stored in localStorage", whyWrong: "The user can edit localStorage." },
          ],
          correct: "a",
          aftermath: "The frontend decides what to show. The backend decides what is allowed.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 12.11 – 12.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l73-sessions-secrets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.11", "12.12", "12.13", "12.14"],
    title: "Secure Sessions, Secrets, Profiles and Testing",
    subtitle: "Cookies versus storage, exposed secrets, account settings, and testing authentication",
    estimatedMinutes: 45,
    intro: "The last decisions of an auth system: where the session lives, what must never be in the frontend, how users manage their accounts, and how you know it all works.",

    atoms: [
      {
        id: "a-rx-cookies-storage",
        title: "Secure session design and the trade-offs of cookies versus browser storage",
        explain:
          "localStorage and sessionStorage are readable by ANY JavaScript on the page, so a single XSS bug (or a compromised npm package) can steal a token kept there and use it elsewhere. An httpOnly cookie cannot be read by JavaScript at all; with Secure (HTTPS only) and SameSite=Lax or Strict it is also protected against most cross-site request forgery (CSRF); the server adds a CSRF token for anything SameSite does not cover. That is why most security guidance prefers httpOnly cookies set by your own backend, with short-lived access tokens kept in memory if a token is needed at all. Storage is fine for non-secret preferences (the theme), never for credentials.",
        decision: {
          scenario: "Your team stores a 30-day access token in localStorage \"so users stay signed in\". A third-party analytics script you load is later compromised.",
          question: "What is the risk, and the better design?",
          options: [
            { id: "a", text: "The script can read the token and impersonate every user for 30 days; use an httpOnly, Secure, SameSite session cookie set by the server instead", why: "JavaScript cannot read httpOnly cookies, so even malicious scripts cannot steal the session." },
            { id: "b", text: "No risk: localStorage is private to your site", whyWrong: "It is private to your ORIGIN, and every script running on that origin can read it, including third-party ones." },
            { id: "c", text: "Encrypt the token in localStorage with a key in the bundle", whyWrong: "The key is in the bundle too, so the script can decrypt it." },
            { id: "d", text: "Use sessionStorage instead", whyWrong: "Same exposure to scripts, just a shorter lifetime." },
          ],
          correct: "a",
          aftermath: "Credentials in httpOnly cookies; storage only for things that are not secrets.",
        },
      },
      {
        id: "a-rx-exposed-secrets",
        title: "Environment variables and avoiding exposed secrets",
        explain:
          "Anything in your React code, INCLUDING every VITE_ environment variable, ends up in the JavaScript sent to every visitor. Public configuration is fine there: the API's base URL, a Firebase web config, a Stripe or Paystack PUBLISHABLE key, an analytics ID. Secrets never are: secret API keys (Paystack sk_, OpenAI, payment provider secrets), database passwords, signing keys, admin tokens. A feature that needs a secret calls YOUR backend (or a serverless function), which holds the secret in a server-only environment variable and calls the third party. If a secret is ever committed or shipped, treat it as leaked: revoke and rotate it at once, then remove it from history.",
        webLab: lab({
          task:
            "The payment button calls Paystack with the SECRET key, which ships to every visitor. Fix the design: remove the secret from .env and from the code, and call your own backend instead: POST /api/payments/initialize with { courseId } (the backend holds the secret). Redirect to the authorization_url it returns by showing it as the link \"Continue to payment\". Keep the public key, which is allowed in the frontend.",
          files: {
            ".env": "VITE_PAYSTACK_PUBLIC_KEY=pk_test_9f3a2c\nVITE_PAYSTACK_SECRET_KEY=sk_test_b71e04\n",
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");

  async function pay() {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_PAYSTACK_SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "ada@example.com", amount: 3000000 }),
    });
    const data = await res.json();
    setUrl(data.data.authorization_url);
  }

  return (
    <>
      <p className="key">Public key: {import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}</p>
      <button onClick={pay}>Pay for React Development</button>
      {url && <a href={url}>Continue to payment</a>}
    </>
  );
}
`,
          },
          mocks: [
            { match: "/api/payments/initialize", method: "POST", body: { authorization_url: "https://checkout.paystack.com/abc123" }, delay: 40 },
            { match: "api.paystack.co", method: "POST", body: { data: { authorization_url: "https://checkout.paystack.com/leaked" } }, delay: 40 },
          ],
          tests: [
            { label: "Payment goes through your backend", check: "await click('button'); await waitFor(() => !!$('a')); const c = fetchCalls().find((x) => x.url.includes('/api/payments/initialize')); return !!c && JSON.parse(c.body).courseId === 'react' && $('a').getAttribute('href') === 'https://checkout.paystack.com/abc123' && !fetchCalls().some((x) => x.url.includes('api.paystack.co'));", fail: "POST /api/payments/initialize with { courseId: \"react\" }; never call Paystack's API from the browser." },
            { label: "No secret key anywhere in the frontend", check: "return !/SECRET|sk_test/.test(raw('.env') + code('src/App.jsx')) && !fetchCalls().some((x) => /sk_/.test(JSON.stringify(x.headers)));", fail: "Delete VITE_PAYSTACK_SECRET_KEY from .env and the code." },
            { label: "The public key is still used", check: "return text('.key') === 'Public key: pk_test_9f3a2c';", fail: "Publishable keys are fine in the frontend." },
          ],
          solution: {
            ".env": "VITE_PAYSTACK_PUBLIC_KEY=pk_test_9f3a2c\n",
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");

  async function pay() {
    const res = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ courseId: "react" }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setUrl(data.authorization_url);
  }

  return (
    <>
      <p className="key">Public key: {import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}</p>
      <button onClick={pay}>Pay for React Development</button>
      {url && <a href={url}>Continue to payment</a>}
    </>
  );
}
`,
          },
          hint: "The backend decides the price from courseId too: never trust an amount sent by the browser.",
          successMessage: "The secret stays on the server, and the browser only asks for a checkout link.",
        }),
      },
      {
        id: "a-rx-profile-settings",
        title: "Managing user profiles and account settings",
        explain:
          "A profile page loads the user's data, lets them edit it with validation, and saves with PATCH, showing success and errors (Modules 5 and 9). Sensitive changes need more: changing the email or password asks for the CURRENT password (re-authentication) and changing the email sends a confirmation to the new address; deleting an account asks for explicit confirmation (typing the account name, say) and explains what will be deleted. After saving, update the user in your auth context so the header shows the new name at once.",
        webLab: lab({
          task:
            "Finish the profile form. It starts with the current name. Saving PATCHes /api/me with { name } and, on success, updates the user in the auth context so the header changes immediately, and shows <p role=\"status\">Profile saved</p>. A blank name shows <p role=\"alert\">Enter your name</p> without sending anything.",
          files: {
            "src/App.jsx": `import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function Header() {
  const { user } = useContext(AuthContext);
  return <header>Signed in as {user.name}</header>;
}

function ProfileForm() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user.name);

  return (
    <form>
      <label htmlFor="name">Display name</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <button>Save</button>
    </form>
  );
}

export default function App() {
  const [user, setUser] = useState({ id: 1, name: "Ada Obi" });
  return (
    <AuthContext value={{ user, setUser }}>
      <Header />
      <ProfileForm />
    </AuthContext>
  );
}
`,
          },
          mocks: [{ match: "/api/me", method: "PATCH", body: { id: 1, name: "Ada O." }, delay: 60 }],
          tests: [
            { label: "Blank names are refused without a request", check: "await type('#name', '   '); await submit('form'); return text('[role=alert]') === 'Enter your name' && fetchCalls().length === 0;", fail: "Validate before sending." },
            { label: "Saving PATCHes the name", check: "await type('#name', 'Ada O.'); await submit('form'); await waitFor(() => fetchCalls().length === 1); const c = fetchCalls()[0]; return c.method === 'PATCH' && JSON.parse(c.body).name === 'Ada O.';", fail: "fetch(\"/api/me\", { method: \"PATCH\", … })" },
            { label: "The header updates and success is announced", check: "return await waitFor(() => text('header') === 'Signed in as Ada O.' && text('[role=status]') === 'Profile saved');", fail: "setUser(await res.json())" },
          ],
          solution: {
            "src/App.jsx": `import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function Header() {
  const { user } = useContext(AuthContext);
  return <header>Signed in as {user.name}</header>;
}

function ProfileForm() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("invalid");
      return;
    }
    setStatus("saving");
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setUser(await res.json());
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Display name</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <button disabled={status === "saving"}>Save</button>
      {status === "invalid" && <p role="alert">Enter your name</p>}
      {status === "error" && <p role="alert">Could not save. Try again.</p>}
      {status === "saved" && <p role="status">Profile saved</p>}
    </form>
  );
}

export default function App() {
  const [user, setUser] = useState({ id: 1, name: "Ada Obi" });
  return (
    <AuthContext value={{ user, setUser }}>
      <Header />
      <ProfileForm />
    </AuthContext>
  );
}
`,
          },
          hint: "Update the shared user from the server's response, not from the form value.",
          successMessage: "Saved on the server, reflected everywhere at once.",
        }),
      },
      {
        id: "a-rx-testing-auth",
        title: "Testing authentication flows",
        explain:
          "Test the flows a user goes through, with the API mocked (Module 13 covers the tools): signing in with valid and invalid details; a protected page redirecting when signed out and showing when signed in; returning to the original page after login; a 401 mid-session signing the user out; role-based visibility for each role; and logout clearing everything. End-to-end tests (Playwright, Module 13) then check the real login against a test environment with a dedicated test account, never a real customer's. And test the SERVER separately: a request without a token or with another user's id must be refused.",
        webLab: reactLab({
          task:
            "Write tests for RequireAuth in RequireAuth.test.jsx, using the given render helper. Test 1: with no user, visiting /account shows the login page. Test 2: with a user, /account shows \"Your account\". Your tests must pass against the real RequireAuth AND fail against a broken one that lets everyone in (the checker runs them both ways).",
          files: {
            "src/RequireAuth.jsx": `import { Navigate, Outlet } from "react-router";

export default function RequireAuth({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
`,
            "src/testUtils.jsx": `import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import RequireAuth from "./RequireAuth.jsx";

export function renderAt(path, user) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<h1>Sign in</h1>} />
        <Route element={<RequireAuth user={user} />}>
          <Route path="/account" element={<h1>Your account</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
`,
            "src/RequireAuth.test.jsx": `import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderAt } from "./testUtils.jsx";

describe("RequireAuth", () => {
  // write your two tests here
});
`,
            "src/App.jsx": `export default function App() {
  return <p>This lab runs your tests. The results appear in the console below.</p>;
}
`,
          },
          open: "src/RequireAuth.test.jsx",
          readOnly: ["src/RequireAuth.jsx", "src/testUtils.jsx", "src/App.jsx"],
          tests: [
            { label: "Your two tests pass against the real component", check: "const r = await tests(); return !!r && r.total >= 2 && r.failed === 0;", fail: "renderAt(\"/account\", null) then expect(screen.getByRole(\"heading\", { name: \"Sign in\" })).toBeInTheDocument()" },
            { label: "They catch a RequireAuth that lets everyone in", swap: { "src/RequireAuth.jsx": "import { Outlet } from \"react-router\";\n\nexport default function RequireAuth() {\n  return <Outlet />;\n}\n" }, check: "const r = await tests(); return !!r && r.failed > 0;", fail: "The signed-out test must expect the login page, so it fails when the guard is missing." },
            { label: "They catch a RequireAuth that locks everyone out", swap: { "src/RequireAuth.jsx": "import { Navigate } from \"react-router\";\n\nexport default function RequireAuth() {\n  return <Navigate to=\"/login\" replace />;\n}\n" }, check: "const r = await tests(); return !!r && r.failed > 0;", fail: "The signed-in test must expect \"Your account\"." },
          ],
          solution: {
            "src/RequireAuth.test.jsx": `import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderAt } from "./testUtils.jsx";

describe("RequireAuth", () => {
  it("sends signed-out visitors to the login page", () => {
    renderAt("/account", null);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByText("Your account")).toBeNull();
  });

  it("shows the page to a signed-in user", () => {
    renderAt("/account", { name: "Ada" });
    expect(screen.getByRole("heading", { name: "Your account" })).toBeInTheDocument();
  });
});
`,
          },
          hint: "getByRole(\"heading\", { name: … }) finds a heading by its text, the way a user would.",
          successMessage: "Tests that would catch both ways a guard can break.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 12.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l74-m12-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["12.P"],
    title: "Practical: An Authentication-Enabled Student Portal",
    subtitle: "Registration, login, profile management and protected dashboard pages",
    estimatedMinutes: 70,
    intro: "The Module 12 practical: a student portal with real account flows, a restored session, protected pages and a profile, built on the AuthProvider pattern.",

    atoms: [
      {
        id: "a-rx-m12-project",
        title: "Build the student portal",
        explain:
          "The backend (the lab's mock API) uses an httpOnly session cookie, so the app never handles a token: GET /api/me restores the session (200 or 401), POST /api/register and POST /api/login sign in (200 with the user, 401 or 409 on failure), POST /api/logout ends it, PATCH /api/me saves the profile. Remember the boundary: your routes decide what to show; the server enforces who may see the data.",
        webLab: reactLab({
          task:
            "Build the portal with an AuthProvider in src/auth.jsx (user, status loading/ready, login, register, logout, updateProfile; all requests with credentials: \"include\"). Routes: /login (form: Email, Password, \"Sign in\" button; on 401 show role=alert \"Email or password is incorrect\") and /register (Name, Email, Password, \"Create account\"; on 409 role=alert \"That email is already registered\"); a protected layout redirecting to /login (and back after login) around /dashboard (<h1>Welcome, NAME</h1>) and /profile (a \"Display name\" field saved with PATCH, then role=status \"Profile saved\"). A header shows \"Sign out\" when signed in. While the session is being restored, show \"Loading…\", never a flash of the login page.",
          files: {
            "src/auth.jsx": "",
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation, useNavigate } from "react-router";

export default function App() {
  return <h1>Student portal</h1>;
}
`,
          },
          path: "/dashboard",
          mocks: [
            { match: "/api/me", method: "GET", status: 401, body: {}, delay: 120 },
            { match: "/api/login", method: "POST", status: 200, body: { id: 1, name: "Ada Obi", email: "ada@example.com" }, delay: 50 },
            { match: "/api/register", method: "POST", status: 201, body: { id: 2, name: "Tunde Bello", email: "tunde@example.com" }, delay: 50 },
            { match: "/api/me", method: "PATCH", status: 200, body: { id: 1, name: "Ada O.", email: "ada@example.com" }, delay: 50 },
            { match: "/api/logout", method: "POST", status: 204, delay: 30 },
          ],
          revealSolution: false,
          tests: [
            { label: "Loading, then a redirect to /login (no flash)", check: "const loading = text('#root').includes('Loading…') && !$('form'); await waitFor(() => path() === '/login' && !!$('form')); return loading;", fail: "Wait for GET /api/me before deciding." },
            { label: "Login returns to the page wanted, and sends cookies", check: "const by = (n) => $$('input').find((i) => nameOf(i) === n); await type(by('Email'), 'ada@example.com'); await type(by('Password'), 'react2026!'); await submit(by('Email').form); await waitFor(() => path() === '/dashboard'); const c = fetchCalls().find((x) => x.url.includes('/api/login')); return text('h1') === 'Welcome, Ada Obi' && !!c && c.method === 'POST';", fail: "POST /api/login, set the user, navigate to state.from." },
            { label: "Profile saves and the dashboard reflects it", path: "/dashboard", mocks: [{ match: "/api/me", method: "GET", status: 200, body: { id: 1, name: "Ada Obi", email: "ada@example.com" }, delay: 40 }, { match: "/api/me", method: "PATCH", status: 200, body: { id: 1, name: "Ada O.", email: "ada@example.com" }, delay: 40 }], check: "await waitFor(() => text('h1') === 'Welcome, Ada Obi'); const link = $$('a').find((a) => a.getAttribute('href') === '/profile'); if (!link) return false; await click(link); const by = (n) => $$('input').find((i) => nameOf(i) === n); await waitFor(() => !!by('Display name')); await type(by('Display name'), 'Ada O.'); await submit(by('Display name').form); await waitFor(() => text('[role=status]') === 'Profile saved'); const p = fetchCalls().find((x) => x.method === 'PATCH'); return !!p && JSON.parse(p.body).name === 'Ada O.';", fail: "A Link to /profile; PATCH /api/me; update the user in context." },
            { label: "Wrong password: a generic alert", path: "/login", mocks: [{ match: "/api/me", method: "GET", status: 401, body: {}, delay: 30 }, { match: "/api/login", method: "POST", status: 401, body: { message: "Wrong password for ada@example.com" }, delay: 30 }], check: "await waitFor(() => !!$('form')); const by = (n) => $$('input').find((i) => nameOf(i) === n); await type(by('Email'), 'ada@example.com'); await type(by('Password'), 'nope'); await submit(by('Email').form); return await waitFor(() => text('[role=alert]') === 'Email or password is incorrect');", fail: "Show the generic message on 401." },
            { label: "Register handles a taken email", path: "/register", mocks: [{ match: "/api/me", method: "GET", status: 401, body: {}, delay: 30 }, { match: "/api/register", method: "POST", status: 409, body: {}, delay: 30 }], check: "await waitFor(() => !!$('form')); const by = (n) => $$('input').find((i) => nameOf(i) === n); await type(by('Name'), 'Ada'); await type(by('Email'), 'ada@example.com'); await type(by('Password'), 'react2026!'); await submit(by('Email').form); return await waitFor(() => text('[role=alert]') === 'That email is already registered');", fail: "On 409, show the alert." },
            { label: "Sign out ends the session", path: "/dashboard", mocks: [{ match: "/api/me", method: "GET", status: 200, body: { id: 1, name: "Ada Obi" }, delay: 30 }, { match: "/api/logout", method: "POST", status: 204, delay: 30 }], check: "await waitFor(() => text('h1') === 'Welcome, Ada Obi'); await click($$('button').find((b) => text(b) === 'Sign out')); await waitFor(() => path() === '/login'); return fetchCalls().some((x) => x.url.includes('/api/logout') && x.method === 'POST');", fail: "POST /api/logout, clear the user, go to /login." },
          ],
          solution: {
            "src/auth.jsx": `import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

async function api(path, options = {}) {
  return fetch(path, {
    credentials: "include",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, status: "loading" });

  useEffect(() => {
    let ignore = false;
    api("/api/me")
      .then(async (res) => {
        const user = res.ok ? await res.json() : null;
        if (!ignore) setState({ user, status: "ready" });
      })
      .catch(() => !ignore && setState({ user: null, status: "ready" }));
    return () => {
      ignore = true;
    };
  }, []);

  async function signInWith(path, body, failures) {
    const res = await api(path, { method: "POST", body: JSON.stringify(body) });
    if (failures[res.status]) throw new Error(failures[res.status]);
    if (!res.ok) throw new Error("Something went wrong. Try again.");
    const user = await res.json();
    setState({ user, status: "ready" });
    return user;
  }

  const value = {
    ...state,
    login: (email, password) => signInWith("/api/login", { email, password }, { 401: "Email or password is incorrect" }),
    register: (name, email, password) => signInWith("/api/register", { name, email, password }, { 409: "That email is already registered" }),
    logout: async () => {
      await api("/api/logout", { method: "POST" });
      setState({ user: null, status: "ready" });
    },
    updateProfile: async (changes) => {
      const res = await api("/api/me", { method: "PATCH", body: JSON.stringify(changes) });
      if (!res.ok) throw new Error("Could not save");
      const user = await res.json();
      setState({ user, status: "ready" });
    },
  };
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
`,
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation, useNavigate } from "react-router";
import { AuthProvider, useAuth } from "./auth.jsx";

function Layout() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();
  if (status === "loading") return <p>Loading…</p>;
  return (
    <>
      <header>
        <Link to="/dashboard">Dashboard</Link> <Link to="/profile">Profile</Link>
        {user && (
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function useForm(initial) {
  const [values, setValues] = useState(initial);
  const field = (name, label, type = "text") => (
    <>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} value={values[name]} onChange={(e) => setValues({ ...values, [name]: e.target.value })} />
    </>
  );
  return [values, field];
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, field] = useForm({ email: "", password: "" });
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(values.email, values.password);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign in</h1>
      {field("email", "Email", "email")}
      {field("password", "Password", "password")}
      <button>Sign in</button>
      {error && <p role="alert">{error}</p>}
      <Link to="/register">Create an account</Link>
    </form>
  );
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, field] = useForm({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(values.name, values.email, values.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Create an account</h1>
      {field("name", "Name")}
      {field("email", "Email", "email")}
      {field("password", "Password", "password")}
      <button>Create account</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

function Dashboard() {
  const { user } = useAuth();
  return <h1>Welcome, {user.name}</h1>;
}

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState("idle");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateProfile({ name });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Profile</h1>
      <label htmlFor="displayName">Display name</label>
      <input id="displayName" value={name} onChange={(e) => setName(e.target.value)} />
      <button>Save</button>
      {status === "saved" && <p role="status">Profile saved</p>}
      {status === "error" && <p role="alert">Could not save</p>}
    </form>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
`,
          },
          hint: "Build the AuthProvider first and test it with a plain page; add the routes after.",
          successMessage: "A real account system on the frontend, with the server holding every key.",
        }),
      },
    ],
    task: {
      title: "Module 12 practical: your student portal",
      intro: "Build the portal against a real provider: Firebase Authentication (free tier) or Supabase Auth both work with Vite.",
      prompts: [
        "Wrap the provider's SDK in an AuthProvider; components only use useAuth().",
        "Implement registration with email verification, login, logout and password reset with the provider's built-in flows.",
        "Protect /dashboard and /profile, return users to the page they wanted after login, and handle an expired session mid-use without losing a form draft.",
        "Write down, for each piece of data, which server rule protects it (for Firebase: Firestore security rules), and test one rule by calling the API without signing in.",
        "Mastery checkpoint: explain how your frontend participates in authentication, and demonstrate why hiding a page in React does not stop someone reading its data.",
      ],
      closing: "Next: Module 13, testing and debugging.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
