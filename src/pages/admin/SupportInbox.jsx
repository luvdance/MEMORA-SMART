import { useCallback, useEffect, useMemo, useState } from "react";
import { supportApi, APP_NAMES, CATEGORIES, timeAgo } from "../../support/supportApi";
import "./SupportInbox.css";

/**
 * Admin "Mail" tab: every support message from every app. Replies show in the
 * user's Help dialog; "Email" opens a reply in your mail app for people who
 * wrote in signed out. The server checks the admin claim on each call.
 */
const FILTERS = [
  { id: "open", label: "Open" },
  { id: "pending", label: "Waiting on user" },
  { id: "resolved", label: "Resolved" },
  { id: "all", label: "All" },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

export default function SupportInbox({ onUnreadChange }) {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("open");
  const [appFilter, setAppFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError("");
    return supportApi("support-admin-list").then((d) => setTickets(d.tickets)).catch((err) => setError(err.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tickets) onUnreadChange?.(tickets.filter((t) => t.unread).length);
  }, [tickets, onUnreadChange]);

  const counts = useMemo(() => {
    const c = { open: 0, pending: 0, resolved: 0, all: 0 };
    for (const t of tickets || []) { c[t.status] += 1; c.all += 1; }
    return c;
  }, [tickets]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (tickets || []).filter((t) =>
      (filter === "all" || t.status === filter)
      && (appFilter === "all" || t.app === appFilter)
      && (!q || [t.subject, t.email, t.name, ...t.messages.map((m) => m.text)].join(" ").toLowerCase().includes(q)));
  }, [tickets, filter, appFilter, query]);

  const selected = tickets?.find((t) => t.id === selectedId) || null;

  const replace = (ticket) => setTickets((list) => list.map((t) => (t.id === ticket.id ? ticket : t)));

  const update = async (payload) => {
    setBusy(true);
    setError("");
    try {
      const { ticket } = await supportApi("support-admin-update", { id: selectedId, ...payload });
      replace(ticket);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const select = (t) => {
    setSelectedId(t.id);
    setReply("");
    if (t.unread) {
      replace({ ...t, unread: false });
      supportApi("support-admin-update", { id: t.id }).catch(() => {});
    }
  };

  const sendReply = async (status) => {
    if (!reply.trim()) return;
    if (await update({ message: reply, ...(status ? { status } : {}) })) setReply("");
  };

  const mailto = selected
    ? `mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}&body=${encodeURIComponent(`Hi ${selected.name || "there"},\n\n`)}`
    : "";

  if (error && !tickets) return <p className="sib__error">{error} <button className="admin__back" onClick={load}>Retry</button></p>;
  if (!tickets) return <p className="sib__muted">Loading messages…</p>;

  return (
    <div className={`sib ${selected ? "sib--reading" : ""}`}>
      <aside className="sib__list">
        <div className="sib__tools">
          <div className="sib__filters">
            {FILTERS.map((f) => (
              <button key={f.id} className={filter === f.id ? "is-on" : ""} onClick={() => setFilter(f.id)}>
                {f.label} <span>{counts[f.id]}</span>
              </button>
            ))}
          </div>
          <div className="sib__search">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or text" />
            <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)} aria-label="Filter by app">
              <option value="all">All apps</option>
              {Object.entries(APP_NAMES).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
            <button className="sib__refresh" onClick={load} title="Refresh" aria-label="Refresh"><i className="fas fa-rotate-right"></i></button>
          </div>
        </div>

        {!visible.length ? (
          <p className="sib__empty">Nothing here.</p>
        ) : (
          <ul>
            {visible.map((t) => (
              <li key={t.id}>
                <button
                  className={`sib__item ${t.id === selectedId ? "is-on" : ""} ${t.unread ? "is-unread" : ""}`}
                  onClick={() => select(t)}
                >
                  <span className="sib__item-top">
                    <strong>{t.name || t.email}</strong>
                    <span>{timeAgo(t.updatedAt)}</span>
                  </span>
                  <span className="sib__item-subject">{t.subject}</span>
                  <span className="sib__item-meta">
                    <span className="sib__tag">{APP_NAMES[t.app] || t.app}</span>
                    <span className="sib__clip">{t.messages.at(-1)?.from === "admin" ? "You: " : ""}{t.messages.at(-1)?.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="sib__read">
        {!selected ? (
          <p className="sib__empty">Select a message to read it.</p>
        ) : (
          <>
            <header className="sib__head">
              <button className="sib__back" onClick={() => setSelectedId(null)} aria-label="Back to list">
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className="sib__head-main">
                <h3>{selected.subject}</h3>
                <p>
                  <strong>{selected.name || "No name"}</strong> · {selected.email}
                  {selected.uid ? " · signed in" : " · signed out"}
                </p>
                <p className="sib__muted">
                  {APP_NAMES[selected.app] || selected.app} · {CATEGORY_LABEL[selected.category] || selected.category}
                  {selected.page ? ` · ${selected.page}` : ""} · opened {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="sib__head-actions">
                <select value={selected.status} onChange={(e) => update({ status: e.target.value })} disabled={busy} aria-label="Status">
                  <option value="open">Open</option>
                  <option value="pending">Waiting on user</option>
                  <option value="resolved">Resolved</option>
                </select>
                <a className="admin__back" href={mailto}><i className="fas fa-envelope"></i> Email</a>
                <button className="admin__back" onClick={() => update({ read: false })} disabled={busy}>Mark unread</button>
              </div>
            </header>

            <div className="sib__msgs">
              {selected.messages.map((m, i) => (
                <div key={i} className={`sib__msg sib__msg--${m.from}`}>
                  <div className="sib__bubble">{m.text}</div>
                  <span className="sib__muted">{m.from === "admin" ? "Support" : selected.name || "User"} · {new Date(m.at).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="sib__compose">
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={selected.uid
                  ? "Write a reply. They'll see it in Help → Your messages."
                  : "They wrote in signed out, so they can't see replies here. Use Email to reply."}
              />
              {error && <p className="sib__error">{error}</p>}
              <div className="sib__compose-actions">
                <button className="admin__back" onClick={() => sendReply("resolved")} disabled={busy || !reply.trim()}>Reply & resolve</button>
                <button className="sib__send" onClick={() => sendReply()} disabled={busy || !reply.trim()}>
                  {busy ? "Saving…" : "Send reply"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
