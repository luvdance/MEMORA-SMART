// ── SUPPORT CENTER ──
// Mounted once in App.jsx. Renders the floating "Help" launcher (hidden on
// focus screens that bring their own entry point) and the dialog that any
// page can open with openSupport(). Signed-in users also see their threads
// and our replies here; signed-out visitors leave an email instead.
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supportApi, onOpenSupport, appForPath, CATEGORIES, timeAgo } from "./supportApi";
import "./support.css";

// Editors, lessons and exams: the launcher would cover controls there.
const NO_LAUNCHER = /^\/(admin|cv\/|dashboard\/cv-builder|academy\/learn\/|academy\/exam|academy\/typing)/;

const EMPTY_FORM = { name: "", email: "", category: "question", subject: "", message: "", website: "" };

export default function SupportCenter() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("new"); // "new" | "sent" | "inbox" | "thread"
  const [app, setApp] = useState("site");
  const [form, setForm] = useState(EMPTY_FORM);
  const [ticketsState, setTickets] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  // Threads belong to whoever is signed in now; hide them the moment they sign out.
  const tickets = user ? ticketsState : null;
  const unread = (tickets || []).filter((t) => t.unread).length;

  const loadTickets = () =>
    supportApi("support-mine").then((d) => setTickets(d.tickets)).catch(() => setTickets((t) => t || []));

  // One quiet check per sign-in, so a reply shows as a dot on the launcher.
  useEffect(() => {
    if (!user) return undefined;
    const timer = setTimeout(loadTickets, 4000);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => onOpenSupport((opts) => {
    setApp(opts.app || appForPath(window.location.pathname));
    setForm((f) => ({ ...f, subject: opts.subject ?? f.subject }));
    setError("");
    setView(opts.view === "inbox" && user ? "inbox" : "new");
    setOpen(true);
    if (user) loadTickets();
  }), [user]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector("input:not([type=hidden]), select, textarea")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, view]);

  const openFromLauncher = () => {
    setApp(appForPath(pathname));
    setError("");
    setView(unread ? "inbox" : "new");
    setOpen(true);
    if (user) loadTickets();
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await supportApi("support-send", { ...form, app, page: window.location.pathname });
      setForm(EMPTY_FORM);
      setView("sent");
      if (user) loadTickets();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  const openThread = (t) => {
    setThreadId(t.id);
    setReplyText("");
    setError("");
    setView("thread");
    if (t.unread) {
      setTickets((list) => list.map((x) => (x.id === t.id ? { ...x, unread: false } : x)));
      supportApi("support-seen", { id: t.id }).catch(() => {});
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (busy || !replyText.trim()) return;
    setBusy(true);
    setError("");
    try {
      await supportApi("support-reply", { id: threadId, message: replyText });
      setReplyText("");
      await loadTickets();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  const thread = tickets?.find((t) => t.id === threadId);
  const showLauncher = !NO_LAUNCHER.test(pathname);
  const lifted = pathname.startsWith("/memotify"); // clears Memotify's phone tab bar

  return (
    <>
      {showLauncher && !open && (
        <button
          type="button"
          className={`sup-launch ${lifted ? "sup-launch--lifted" : ""}`}
          onClick={openFromLauncher}
          aria-label={unread ? "Support: you have a reply" : "Contact support"}
        >
          <i className="fas fa-headset"></i>
          <span className="sup-launch__label">Help</span>
          {unread > 0 && <span className="sup-launch__dot" aria-hidden="true"></span>}
        </button>
      )}

      {open && (
        <div className="sup-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="sup" role="dialog" aria-modal="true" aria-labelledby="sup-title" ref={dialogRef}>
            <header className="sup__head">
              {view === "thread" ? (
                <button type="button" className="sup__icon" onClick={() => setView("inbox")} aria-label="Back to your messages">
                  <i className="fas fa-arrow-left"></i>
                </button>
              ) : null}
              <div className="sup__titles">
                <h2 id="sup-title">{view === "thread" ? thread?.subject || "Conversation" : "Contact support"}</h2>
                {view !== "thread" && <p>We read every message and usually reply within a day.</p>}
              </div>
              <button type="button" className="sup__icon" onClick={() => setOpen(false)} aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </header>

            {user && view !== "thread" && (
              <div className="sup__tabs" role="tablist">
                <button role="tab" aria-selected={view !== "inbox"} className={view !== "inbox" ? "is-on" : ""} onClick={() => setView("new")}>
                  New message
                </button>
                <button role="tab" aria-selected={view === "inbox"} className={view === "inbox" ? "is-on" : ""} onClick={() => setView("inbox")}>
                  Your messages{unread > 0 && <span className="sup__badge">{unread}</span>}
                </button>
              </div>
            )}

            <div className="sup__body">
              {view === "new" && (
                <form className="sup__form" onSubmit={submit}>
                  {user ? (
                    <p className="sup__muted">We'll reply to <strong>{user.email}</strong> and here under Your messages.</p>
                  ) : (
                    <div className="sup__row">
                      <label>
                        <span>Your name</span>
                        <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={80} />
                      </label>
                      <label>
                        <span>Email <em>(so we can reply)</em></span>
                        <input type="email" required value={form.email} onChange={set("email")} autoComplete="email" maxLength={120} />
                      </label>
                    </div>
                  )}
                  <label>
                    <span>What's it about?</span>
                    <select value={form.category} onChange={set("category")}>
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Subject</span>
                    <input value={form.subject} onChange={set("subject")} maxLength={140} placeholder="A short summary" />
                  </label>
                  <label>
                    <span>Message</span>
                    <textarea
                      required
                      rows={5}
                      minLength={10}
                      maxLength={5000}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us what happened or what you need. Include any payment reference if it's about a payment."
                    />
                  </label>
                  {/* Honeypot: hidden from people, filled by bots. */}
                  <input className="sup__hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} aria-hidden="true" />
                  {error && <p className="sup__error">{error}</p>}
                  <button type="submit" className="sup__primary" disabled={busy}>
                    {busy ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}

              {view === "sent" && (
                <div className="sup__done">
                  <span className="sup__done-icon"><i className="fas fa-check"></i></span>
                  <h3>Message sent</h3>
                  <p>Thanks for writing in. We'll reply by email{user ? " and under Your messages" : ""}.</p>
                  <div className="sup__done-actions">
                    {user && <button type="button" className="sup__secondary" onClick={() => setView("inbox")}>View your messages</button>}
                    <button type="button" className="sup__primary" onClick={() => setOpen(false)}>Done</button>
                  </div>
                </div>
              )}

              {view === "inbox" && (
                tickets === null ? <p className="sup__muted">Loading…</p>
                  : !tickets.length ? <p className="sup__muted">No messages yet. Anything you send us will show up here.</p>
                  : (
                    <ul className="sup__list">
                      {tickets.map((t) => (
                        <li key={t.id}>
                          <button type="button" className={t.unread ? "is-unread" : ""} onClick={() => openThread(t)}>
                            <span className="sup__list-top">
                              <strong>{t.subject}</strong>
                              <span className="sup__muted">{timeAgo(t.updatedAt)}</span>
                            </span>
                            <span className="sup__list-sub">
                              <span className={`sup__status sup__status--${t.status}`}>
                                {t.status === "resolved" ? "Resolved" : t.messages.at(-1)?.from === "admin" ? "Replied" : "Waiting for us"}
                              </span>
                              <span className="sup__muted sup__clip">{t.messages.at(-1)?.text}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
              )}

              {view === "thread" && thread && (
                <div className="sup__thread">
                  <div className="sup__msgs">
                    {thread.messages.map((m, i) => (
                      <div key={i} className={`sup__msg sup__msg--${m.from}`}>
                        <div className="sup__bubble">{m.text}</div>
                        <span className="sup__muted">{m.from === "admin" ? "Support" : "You"} · {timeAgo(m.at)}</span>
                      </div>
                    ))}
                  </div>
                  <form className="sup__reply" onSubmit={sendReply}>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={thread.status === "resolved" ? "Reply to reopen this conversation" : "Write a reply"}
                      maxLength={5000}
                    />
                    <button type="submit" className="sup__primary" disabled={busy || !replyText.trim()}>
                      {busy ? "Sending…" : "Send"}
                    </button>
                  </form>
                  {error && <p className="sup__error">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
