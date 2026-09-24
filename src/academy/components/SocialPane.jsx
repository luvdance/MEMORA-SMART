import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { reportError } from "../services/errors";
import { BADGES } from "../data/gamification";
import {
  getLeaderboard,
  getMyRank,
  getStudent,
  isOnLeaderboard,
  setLeaderboardVisibility,
} from "../services/academyService";
import {
  announcePresence,
  clearPresence,
  blockUser,
  getBlockedUids,
  getConversations,
  getPublicKey,
  publishPublicKey,
  reportUser,
  sendMessage,
  startPresenceHeartbeat,
  subscribeActiveStudents,
  watchConversation,
} from "../services/social";
import {
  conversationFingerprint,
  conversationIdFor,
  isE2eeAvailable,
} from "../services/e2ee";
import { isMuted, playReceived, playSent, setMuted } from "../services/chime";
import {
  STATUS_LABEL,
  isAround,
  lastSeenMs,
  presenceStatus,
  serverNow,
} from "../data/presence";

const READ_KEY = "ac-chat-read";

function loadReadMarkers() {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function saveReadMarker(conversationId, when = Date.now()) {
  try {
    const all = loadReadMarkers();
    all[conversationId] = when;
    localStorage.setItem(READ_KEY, JSON.stringify(all));
    return all;
  } catch {
    return loadReadMarkers();
  }
}

const TABS = [
  { id: "board", label: "Ranking", icon: "fas fa-ranking-star" },
  { id: "active", label: "Active now", icon: "fas fa-circle" },
  { id: "chats", label: "Messages", icon: "fas fa-comment-dots" },
];

const badgeById = new Map(BADGES.map((b) => [b.id, b]));

/* ── Status indicator ───────────────────────────────────────────────────── */

function StatusDot({ status }) {
  const label = STATUS_LABEL[status] || STATUS_LABEL.offline;
  return (
    <span
      className={`ac-sp__status ac-sp__status--${status || "offline"}`}
      role="img"
      aria-label={label}
      title={label}
    />
  );
}

/* ── Learner card ──────────────────────────────────────────────────────── */

function StudentCard({ person, status, onMessage, onBlock, onReport, busy }) {
  const badges = (person.badges || []).map((id) => badgeById.get(id)).filter(Boolean);

  return (
    <div className="ac-sp__card">
      <div className="ac-sp__cardhead">
        <span className="ac-sp__avatar ac-sp__avatar--dot">
          {(person.name || "S").charAt(0).toUpperCase()}
          <StatusDot status={status} />
        </span>
        <div>
          <strong>{person.name}</strong>
          <span className="ac-sp__meta">
            <span className={`ac-sp__statustext is-${status}`}>
              {STATUS_LABEL[status] || STATUS_LABEL.offline}
            </span>
            {person.levelName || person.level || person.lessonTitle ? " · " : null}
            {person.levelName || person.level ? (
              <>{person.levelName || `Level ${person.level}`}</>
            ) : null}
            {person.lessonTitle && <> · reading {person.lessonTitle}</>}
          </span>
        </div>
      </div>

      {badges.length > 0 ? (
        <ul className="ac-sp__badges">
          {badges.map((b) => (
            <li key={b.id} title={b.description}>
              <i className={b.icon} aria-hidden="true" />
              <span>{b.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ac-sp__nobadges">No badges yet.</p>
      )}

      <div className="ac-sp__cardactions">
        <button
          type="button"
          className="ac-btn ac-btn--primary"
          onClick={() => onMessage(person)}
          disabled={busy}
        >
          <i className="fas fa-comment" aria-hidden="true" /> Message
        </button>
        <button type="button" className="ac-sp__quiet" onClick={() => onBlock(person)}>
          Block
        </button>
        <button type="button" className="ac-sp__quiet" onClick={() => onReport(person)}>
          Report
        </button>
      </div>
    </div>
  );
}

/* ── Chat thread ───────────────────────────────────────────────────────── */

function ChatThread({ user, person, status, onBack, onSent }) {
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [safetyCode, setSafetyCode] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());
  const endRef = useRef(null);
  const seenRef = useRef(null);

  useEffect(() => {
    if (!user || !person) return;
    seenRef.current = null;
    const stop = watchConversation(
      user,
      person.id,
      (list) => {
        if (seenRef.current === null) {
          seenRef.current = new Set(list.map((m) => m.id));
        } else {
          const arrived = list.filter(
            (m) => !m.mine && !seenRef.current.has(m.id)
          );
          for (const m of list) seenRef.current.add(m.id);
          if (arrived.length > 0) playReceived();
        }

        setMessages(list);
        setError(null);
      },
      // A live-listener failure can carry the path it was denied on. The
      // learner gets the outcome, which is all they can act on anyway.
      (err) => setError(reportError("chat:listen", err).message)
    );
    return stop;
  }, [user, person]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { publicKey: mine } = await publishPublicKey(user);
        const theirs = await getPublicKey(person.id);
        if (!theirs || !alive) return;
        const code = await conversationFingerprint(mine, theirs);
        if (alive) setSafetyCode(code);
      } catch {
        /* fail silently rather than showing an invalid code */
      }
    })();
    return () => {
      alive = false;
    };
  }, [user, person]);

  /* What this device can actually open.
   *
   * decryptMessage returns null rather than throwing for a message encrypted
   * to a key this device does not hold — which happens whenever either side
   * signs in somewhere new or clears their browser. Those are dropped here, so
   * the thread shows the conversation rather than a column of notices about
   * one. null while loading, so the empty state does not flash. */
  const readable = useMemo(
    () => (messages === null ? null : messages.filter((m) => m.text !== null)),
    [messages]
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  const send = async (e) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    try {
      await sendMessage(user, person.id, text);
      playSent();
      setDraft("");
      onSent?.(conversationIdFor(user.uid, person.id));
    } catch (err) {
      setError(reportError("chat:send", err).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ac-sp__thread">
      <div className="ac-sp__threadhead">
        <button type="button" className="ac-sp__back" onClick={onBack}>
          <i className="fas fa-chevron-left" aria-hidden="true" /> Back
        </button>
        <StatusDot status={status} />
        <strong>{person.name}</strong>
        <button
          type="button"
          className="ac-sp__mute"
          onClick={() => setMutedState(setMuted(!muted))}
          aria-pressed={muted}
          title={muted ? "Turn message sounds on" : "Turn message sounds off"}
        >
          <i
            className={`fas fa-${muted ? "volume-xmark" : "volume-low"}`}
            aria-hidden="true"
          />
          <span className="ac-sp__sr">
            {muted ? "Turn message sounds on" : "Turn message sounds off"}
          </span>
        </button>
      </div>

      <p className="ac-sp__crypto">
        <i className="fas fa-lock" aria-hidden="true" /> End-to-end encrypted{" "}
        <button
          type="button"
          className="ac-sp__codelink"
          onClick={() => setShowCode((v) => !v)}
        >
          {showCode ? "Hide safety code" : "Safety code"}
        </button>
      </p>

      {showCode && (
        <div className="ac-sp__code">
          <span className="ac-mono">{safetyCode || "…"}</span>
          <p>
            Read this aloud to {person.name}. If their code matches, nobody is
            intercepting. Messages sent before you first opened chat on this device
            cannot be read here.
          </p>
        </div>
      )}

      <div className="ac-sp__messages">
        {messages === null && <p className="ac-sp__msg">Opening…</p>}
        {readable?.length === 0 && (
          <p className="ac-sp__msg">
            No messages yet. Ask your question — {person.name} will see it next
            time they are on.
          </p>
        )}
        {/* Messages this device cannot decrypt are simply not shown.
            They first rendered one warning line each, then one grouped
            explanation; both were noise in a thread. A message that cannot be
            opened is not something the reader can act on, and the panel
            already says the conversation is end-to-end encrypted, which is the
            whole reason older messages sometimes do not appear. */}
        {readable?.map((m) => (
          <div key={m.id} className={`ac-sp__bubble ${m.mine ? "is-mine" : ""}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && (
        <p className="ac-sp__msg is-error" role="status">
          {error}
        </p>
      )}

      <form className="ac-sp__composer" onSubmit={send}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${person.name}…`}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) send(e);
          }}
        />
        <button
          type="submit"
          className="ac-btn ac-btn--primary"
          disabled={sending || !draft.trim()}
        >
          {sending ? "…" : <i className="fas fa-paper-plane" aria-hidden="true" />}
          <span className="ac-sp__sendlabel">Send</span>
        </button>
      </form>
    </div>
  );
}

/* ── Main pane component ────────────────────────────────────────────────── */

export default function SocialPane({ lessonTitle = null, variant = "lesson" }) {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("board");
  const [board, setBoard] = useState(null);
  const [rank, setRank] = useState(null);
  const [active, setActive] = useState(null);

  const meRef = useRef(null);
  const lessonRef = useRef(lessonTitle);
  const [blocked, setBlocked] = useState([]);
  const [chatWith, setChatWith] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [chatAllowed, setChatAllowed] = useState(null);
  const [keyError, setKeyError] = useState(null);
  const [activeError, setActiveError] = useState(null);
  const [presenceError, setPresenceError] = useState(null);
  const [anchor, setAnchor] = useState({ serverMs: null, localMs: Date.now() });
  const [presenceInfo, setPresenceInfo] = useState(null);
  const [, setTick] = useState(0);
  const [meReady, setMeReady] = useState(false);
  const [threads, setThreads] = useState(null);
  const [readAt, setReadAt] = useState(() => loadReadMarkers());
  const [hidden, setHidden] = useState(false);
  const [working, setWorking] = useState(false);

  const available = useMemo(() => isE2eeAvailable(), []);

  // Sync current lesson title reference without causing unnecessary re-renders
  useEffect(() => {
    lessonRef.current = lessonTitle;
  }, [lessonTitle]);

  // Load account data on mount
  useEffect(() => {
    if (!user) return;
    let alive = true;

    (async () => {
      try {
        const me = await getStudent(user.uid);
        if (!alive) return;
        meRef.current = me;
        setMeReady(true);
        setChatAllowed(me?.chatEnabled === true);
        setHidden(!isOnLeaderboard(me));
      } catch {
        if (alive) {
          setChatAllowed(false);
          setError("Could not load your account. Try again.");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  // Heartbeat runs when student is ready, even if drawer is collapsed
  useEffect(() => {
    if (!user || hidden || !meReady) return;
    return startPresenceHeartbeat(
      user,
      () => ({ student: meRef.current, lessonTitle: lessonRef.current }),
      {
        onResult: (result) => {
          if (result?.ok) {
            setPresenceError(null);
            return;
          }
          // Both outcomes read the same on purpose. Which one a learner hit
          // is our diagnostic, not their problem, and naming the refusal told
          // them what the storage layer was and that it had said no.
          setPresenceError(
            "Other learners cannot see you right now. This retries on its own, and messaging still works."
          );
        },
      }
    );
  }, [user, hidden, meReady]);

  // Load leaderboard & keys on open
  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    setKeyError(null);

    if (available) {
      try {
        await publishPublicKey(user);
      } catch (err) {
        // Was: "the security rules have not been deployed". That is a
        // deployment status, told to a student, and it is neither their
        // business nor anything they can do something about.
        reportError("chat:publishKey", err);
        setKeyError(
          "Your encryption key could not be published, so others cannot message you yet. This retries when you reopen the panel."
        );
      }
    }

    const [rows, myRank, blocks] = await Promise.allSettled([
      getLeaderboard({ top: 15 }),
      getMyRank(user.uid, meRef.current?.xp || 0),
      getBlockedUids(user.uid),
    ]);

    setBoard(rows.status === "fulfilled" ? rows.value : []);
    setRank(myRank.status === "fulfilled" ? myRank.value : null);
    setBlocked(blocks.status === "fulfilled" ? blocks.value : []);

    if (rows.status === "rejected") {
      setError(reportError("chat:leaderboard", rows.reason).message);
    }
  }, [user, available]);

  useEffect(() => {
    if (!open || board !== null) return;
    load();
  }, [open, board, load]);

  // Clock tick to invalidate relative presence timestamps
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTick((n) => n + 1), 30 * 1000);
    return () => clearInterval(t);
  }, [open]);

  // Real-time active presence listener
  useEffect(() => {
    if (!open || !user) return;
    return subscribeActiveStudents(
      (rows, meta) => {
        setActive(rows);
        if (meta) {
          setAnchor({ serverMs: meta.serverMs, localMs: meta.localMs });
          setPresenceInfo(meta);
        }
        setActiveError(null);
      },
      {
        excludeUid: user.uid,
        onError: (err) => {
          setActiveError(
            err?.code === "failed-precondition"
              ? "The active list needs a database index. It may still be building — this clears itself once ready."
              : "The active list could not load just now. It will retry."
          );
        },
      }
    );
  }, [open, user]);

  // Existing conversations loader
  const loadThreads = useCallback(async () => {
    if (!user) return;
    const rows = await getConversations(user.uid);
    setThreads(rows);
  }, [user]);

  useEffect(() => {
    if (!open || !user || tab !== "chats" || threads !== null) return;
    loadThreads();
  }, [open, user, tab, threads, loadThreads]);

  const openThread = (person, conversationId) => {
    setChatWith(person);
    if (conversationId) setReadAt(saveReadMarker(conversationId));
  };

  const startChat = async (person) => {
    if (chatAllowed === false) {
      setNotice(
        "Private messaging is off on your account — open the Messages tab for instructions."
      );
      setTab("chats");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const theirs = await getPublicKey(person.id);
      if (!theirs) {
        setNotice(
          keyError
            ? "Messaging is not working yet on this account — see the note in Messages."
            : `${person.name} has not opened messages yet, so there is no key to encrypt to.`
        );
        return;
      }
      setChatWith(person);
      setTab("chats");
    } finally {
      setBusy(false);
    }
  };

  const toggleVisibility = async (visible) => {
    if (!user || working) return;
    setWorking(true);
    setError(null);
    try {
      await setLeaderboardVisibility(user, visible);
      if (visible) {
        const me = await getStudent(user.uid);
        meRef.current = me;
        await announcePresence(user, { student: me, lessonTitle });
        setBoard(null);
      } else {
        await clearPresence(user.uid);
        setBoard((rows) => (rows || []).filter((r) => r.id !== user.uid));
        setRank(null);
      }
      setHidden(!visible);
      setNotice(
        visible
          ? "You are visible again. Others can see you in the ranking and message you."
          : "You are hidden. Nobody sees you in the ranking or the active list."
      );
    } catch {
      setError("That could not be saved. Try again.");
    } finally {
      setWorking(false);
    }
  };

  const block = async (person) => {
    await blockUser(user.uid, person.id);
    setBlocked((b) => [...b, person.id]);
    setNotice(`${person.name} has been blocked.`);
    if (chatWith?.id === person.id) setChatWith(null);
  };

  const report = async (person) => {
    await reportUser(user, { aboutUid: person.id, reason: "reported-from-pane" });
    setNotice("User report submitted.");
  };

  // Estimate server time with resilience against skew
  const now = serverNow(anchor.serverMs, anchor.localMs, Date.now());
  const statusOf = (row) => {
    try {
      return presenceStatus(row, now) || (row.online ? "online" : "offline");
    } catch {
      return row.online ? "online" : "offline";
    }
  };

  const checkIsAround = (row) => {
    try {
      if (typeof isAround === "function") {
        return isAround(row, now);
      }
      return row.online === true;
    } catch {
      return row.online === true;
    }
  };

  /**
   * Status for a row that did NOT come from the live subscription.
   *
   * The Messages list is fetched once, when the tab opens, so every person in
   * it carries a `lastSeen` frozen at that instant. Ageing a frozen timestamp
   * against a clock that keeps advancing turned every conversation Idle after
   * three minutes and Offline after ten, while the learner was sitting there
   * online the whole time. The Active tab never showed this because its rows
   * arrive by snapshot and are always current.
   *
   * So: use the live row when the subscription has this person, and otherwise
   * read the flag as it was stored rather than computing an age from a
   * timestamp that has stopped moving.
   */
  const storedStatus = (person) => {
    const live = (active || []).find((p) => p.id === person?.id);
    if (live) return statusOf(live);
    if (person?.online !== true) return "offline";
    return person.status === "idle" ? "idle" : "online";
  };

  const RANK = { online: 0, idle: 1, offline: 2 };
  const visibleActive = (active || [])
    .filter((p) => !blocked.includes(p.id))
    .filter((p) => checkIsAround(p))
    .sort((a, b) => RANK[statusOf(a)] - RANK[statusOf(b)]);

  return (
    <aside className={`ac-sp ac-sp--${variant} ${open ? "is-open" : ""}`}>
      <h3 className="ac-sp__bar">
        <button
          type="button"
          className="ac-sp__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="ac-sp-body"
        >
          <i className="fas fa-users" aria-hidden="true" />
          <span className="ac-sp__title">Study circle</span>
          {open && rank && <span className="ac-sp__rank">#{rank}</span>}
          <i
            className={`fas fa-chevron-${open ? "up" : "down"} ac-sp__chev`}
            aria-hidden="true"
          />
        </button>
      </h3>

      {open && (
        <div className="ac-sp__body" id="ac-sp-body">
          <div className="ac-sp__tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={`ac-sp__tab ${tab === t.id ? "is-on" : ""}`}
                onClick={() => {
                  setTab(t.id);
                  setChatWith(null);
                }}
              >
                <i className={t.icon} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>

          {notice && (
            <p className="ac-sp__msg is-notice" role="status">
              {notice}{" "}
              <button
                type="button"
                className="ac-sp__codelink"
                onClick={() => setNotice(null)}
              >
                Dismiss
              </button>
            </p>
          )}

          {error && (
            <p className="ac-sp__msg is-error" role="status">
              {error}
            </p>
          )}

          {/* ── Ranking Tab ── */}
          {tab === "board" && (
            <>
              {board === null && !error && <p className="ac-sp__msg">Loading…</p>}
              {board?.length === 0 && (
                <p className="ac-sp__msg">
                  Nobody is on the board yet. Finish a lesson and you will be first.
                </p>
              )}
              {board?.length > 0 && (
                <ol className="ac-sp__list">
                  {board.map((row) => (
                    <li
                      key={row.id}
                      className={`ac-sp__row ${row.id === user?.uid ? "is-me" : ""}`}
                    >
                      <span className="ac-sp__pos">{row.rank}</span>
                      <span className="ac-sp__name">
                        {row.name}
                        {row.id === user?.uid && <em> — you</em>}
                      </span>
                      <span className="ac-sp__xp">
                        {(row.xp || 0).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}

          {/* ── Active Tab ── */}
          {tab === "active" && (
            <>
              {activeError && (
                <p className="ac-sp__msg is-error" role="status">
                  {activeError}
                </p>
              )}
              {presenceError && (
                <p className="ac-sp__msg is-error" role="status">
                  <i className="fas fa-eye-slash" aria-hidden="true" />{" "}
                  {presenceError}
                </p>
              )}
              {active === null && !activeError && (
                <p className="ac-sp__msg">Loading…</p>
              )}
              {active !== null && visibleActive.length === 0 && (
                <>
                  <p className="ac-sp__msg">
                    Nobody else is studying right now. This list updates automatically.
                  </p>
                  <p className="ac-sp__diag">
                    {presenceInfo?.self ? (
                      <>
                        You are published as{" "}
                        <strong>{presenceInfo.self.name}</strong>
                        {presenceInfo.self.lastSeen ? (
                          <>
                            , last seen{" "}
                            {Math.max(
                              0,
                              Math.round(
                                (now - (lastSeenMs?.(presenceInfo.self) || now)) / 1000
                              )
                            )}
                            s ago
                          </>
                        ) : (
                          <>, active</>
                        )}
                        .
                      </>
                    ) : (
                      <>Your presence status is broadcasting…</>
                    )}{" "}
                    {presenceInfo
                      ? `${presenceInfo.total} learner${
                          presenceInfo.total === 1 ? "" : "s"
                        } connected.`
                      : ""}
                  </p>
                </>
              )}
              {visibleActive.map((person) => (
                <StudentCard
                  key={person.id}
                  person={person}
                  status={statusOf(person)}
                  busy={busy}
                  onMessage={startChat}
                  onBlock={block}
                  onReport={report}
                />
              ))}
            </>
          )}

          {/* ── Messages Tab ── */}
          {tab === "chats" && (
            <>
              {!available && (
                <p className="ac-sp__msg is-error">
                  Encrypted chat requires a secure connection (HTTPS).
                </p>
              )}
              {keyError && (
                <p className="ac-sp__msg is-error" role="status">
                  <i className="fas fa-key" aria-hidden="true" /> {keyError}{" "}
                  <button
                    type="button"
                    className="ac-sp__retry"
                    onClick={() => {
                      setBoard(null);
                      setKeyError(null);
                    }}
                  >
                    Try again
                  </button>
                </p>
              )}
              {chatAllowed === false && (
                <p className="ac-sp__msg is-notice">
                  <i className="fas fa-shield-halved" aria-hidden="true" /> Private
                  messaging is off on your account. These messages are encrypted,
                  so nobody — including us — can read or moderate them, and that
                  is not a safe default for under-18s or for an account whose age
                  we do not know.{" "}
                  {/* The instruction has to be reachable. Saying it is
                      disabled without saying how to enable it leaves the
                      learner with a dead end and no way to act. */}
                  <a href="/academy/profile" className="ac-sp__fix">
                    Add your age band on your profile
                  </a>{" "}
                  to turn it on.
                </p>
              )}
              {available && chatAllowed && !chatWith && (
                <>
                  {threads === null && (
                    <p className="ac-sp__msg">Loading your conversations…</p>
                  )}

                  {threads !== null && threads.length === 0 && (
                    <p className="ac-sp__msg">
                      No conversations yet. Open <strong>Active now</strong> and
                      select a learner to chat with.
                    </p>
                  )}

                  {threads !== null && threads.length > 0 && (
                    <ul className="ac-sp__threads">
                      {threads
                        .filter((t) => !blocked.includes(t.otherUid))
                        .map((t) => {
                          const unread =
                            (t.updatedAt?.getTime() || 0) > (readAt[t.id] || 0);
                          return (
                            <li key={t.id}>
                              <button
                                type="button"
                                className={`ac-sp__thread-item ${
                                  unread ? "is-unread" : ""
                                }`}
                                onClick={() => openThread(t.person, t.id)}
                              >
                                <span className="ac-sp__avatar ac-sp__avatar--dot">
                                  {(t.person.name || "S").charAt(0).toUpperCase()}
                                  <StatusDot status={storedStatus(t.person)} />
                                </span>
                                <span className="ac-sp__thread-meta">
                                  <strong>{t.person.name}</strong>
                                  <em>{STATUS_LABEL[storedStatus(t.person)]}</em>
                                </span>
                                {unread && (
                                  <span
                                    className="ac-sp__dot"
                                    aria-label="New messages"
                                  />
                                )}
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </>
              )}
              {available && chatAllowed && chatWith && (
                <ChatThread
                  user={user}
                  person={chatWith}
                  status={storedStatus(chatWith)}
                  onBack={() => {
                    setChatWith(null);
                    setThreads(null);
                  }}
                  onSent={(conversationId) =>
                    setReadAt(saveReadMarker(conversationId))
                  }
                />
              )}
            </>
          )}

          {/* ── Footer / Privacy Controls ── */}
          <div className="ac-sp__foot">
            {hidden ? (
              <>
                <p>
                  <i className="fas fa-eye-slash" aria-hidden="true" /> You are
                  hidden from the ranking and active list.
                </p>
                <button
                  type="button"
                  className="ac-sp__optout is-show"
                  onClick={() => toggleVisibility(true)}
                  disabled={working}
                >
                  {working ? "Working…" : "Show me and let others chat with me"}
                </button>
              </>
            ) : (
              <>
                <p>
                  Your profile and active status are visible to other study circle
                  members.
                </p>
                <button
                  type="button"
                  className="ac-sp__optout"
                  onClick={() => toggleVisibility(false)}
                  disabled={working}
                >
                  {working ? "Working…" : "Hide me from others"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}