import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
  getActiveLearners,
  getBlockedUids,
  getPublicKey,
  publishPublicKey,
  reportUser,
  sendMessage,
  watchConversation,
} from "../services/social";
import { conversationFingerprint, isE2eeAvailable } from "../services/e2ee";

/**
 * THE SOCIAL PANE — leaderboard, who is around, and encrypted chat
 *
 * Lives in the right pane of the lesson player, and the constraint from the
 * leaderboard applies here twice over: this must not interrupt the lesson.
 *
 *   · Collapsed by default in a lesson, every time. No auto-open.
 *   · Nothing is fetched, no key is published and no presence is announced
 *     until the learner opens it. A closed pane is inert — it costs no reads,
 *     no writes and no data.
 *   · On a phone it is a panel in the page flow below the lesson, not an
 *     overlay. On a wide screen it becomes a column beside the lesson, which
 *     is what "right pane" means when there is room for one.
 *   · Opening it never moves the lesson text that is already on screen.
 *
 * ENCRYPTION, HONESTLY LABELLED
 * The pane says "encrypted in your browser" and links to what that does and
 * does not cover. It does not say "end-to-end encrypted" full stop, because
 * this app serves its own JavaScript and therefore cannot make the promise a
 * pinned native app makes. See services/e2ee.js for the full threat model.
 *
 * And because nobody at Memora can read these messages, nobody can moderate
 * them — so Block and Report are on every card rather than buried.
 */

const TABS = [
  { id: "board", label: "Ranking", icon: "fas fa-ranking-star" },
  { id: "active", label: "Active now", icon: "fas fa-circle" },
  { id: "chats", label: "Messages", icon: "fas fa-comment-dots" },
];

const badgeById = new Map(BADGES.map((b) => [b.id, b]));

/* ── A learner's card: badges, and the way into a conversation ──────────── */

function StudentCard({ person, onMessage, onBlock, onReport, busy }) {
  const badges = (person.badges || []).map((id) => badgeById.get(id)).filter(Boolean);

  return (
    <div className="ac-sp__card">
      <div className="ac-sp__cardhead">
        <span className="ac-sp__avatar">{(person.name || "S").charAt(0).toUpperCase()}</span>
        <div>
          <strong>{person.name}</strong>
          <span className="ac-sp__meta">
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

/* ── One conversation ───────────────────────────────────────────────────── */

function ChatThread({ user, person, onBack }) {
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [safetyCode, setSafetyCode] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!user || !person) return;
    const stop = watchConversation(
      user,
      person.id,
      (list) => {
        setMessages(list);
        setError(null);
      },
      (err) => setError(err?.message || "Could not load this conversation.")
    );
    return stop;
  }, [user, person]);

  /* The safety code, for checking nobody swapped a key. */
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
        /* no code shown rather than a wrong one */
      }
    })();
    return () => {
      alive = false;
    };
  }, [user, person]);

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
      setDraft("");
    } catch (err) {
      setError(err?.message || "The message could not be sent.");
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
        <strong>{person.name}</strong>
      </div>

      <p className="ac-sp__crypto">
        <i className="fas fa-lock" aria-hidden="true" />
        Encrypted in your browser — we store only the ciphertext and cannot
        read this.{" "}
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
            intercepting. If it differs, stop and tell us. Messages sent before
            you first opened chat on this device cannot be read here — the key
            never leaves your browser, so it cannot be recovered.
          </p>
        </div>
      )}

      <div className="ac-sp__messages">
        {messages === null && <p className="ac-sp__msg">Opening…</p>}
        {messages?.length === 0 && (
          <p className="ac-sp__msg">
            No messages yet. Ask your question — {person.name} will see it next
            time they are on.
          </p>
        )}
        {messages?.map((m) => (
          <div
            key={m.id}
            className={`ac-sp__bubble ${m.mine ? "is-mine" : ""} ${
              m.text === null ? "is-unreadable" : ""
            }`}
          >
            {m.text === null ? (
              <em>Encrypted with a key this browser does not have.</em>
            ) : (
              m.text
            )}
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

/* ── The pane ───────────────────────────────────────────────────────────── */

export default function SocialPane({ lessonTitle = null, variant = "lesson" }) {
  const { user } = useAuth();

  // Closed every time in a lesson. Never remembered open here: a learner
  // opening a lesson is there to learn.
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("board");
  const [board, setBoard] = useState(null);
  const [rank, setRank] = useState(null);
  const [active, setActive] = useState(null);
  const [blocked, setBlocked] = useState([]);
  const [chatWith, setChatWith] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [chatAllowed, setChatAllowed] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [working, setWorking] = useState(false);

  const available = useMemo(() => isE2eeAvailable(), []);

  /* Everything starts on first open — nothing before it. */
  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const me = await getStudent(user.uid);
      // The under-18 safeguard, read from the record rather than recomputed
      // here so there is one authoritative value. Undefined (a learner who
      // has not completed onboarding) is treated as NOT allowed: when we
      // cannot tell someone's age, the protective default is the right one.
      setChatAllowed(me?.chatEnabled === true);
      setHidden(!isOnLeaderboard(me));
      const [rows, myRank, live, blocks] = await Promise.all([
        getLeaderboard({ top: 15 }),
        getMyRank(user.uid, me?.xp || 0),
        getActiveLearners({ top: 20, excludeUid: user.uid }),
        getBlockedUids(user.uid),
      ]);
      setBoard(rows);
      setRank(myRank);
      setActive(live);
      setBlocked(blocks);

      // Publishing a key and announcing presence are also deferred to here,
      // so a learner who never opens the pane never appears in the active
      // list and never generates a key.
      if (available) await publishPublicKey(user).catch(() => {});
      // Only appear in the active list if they have not hidden themselves.
      if (isOnLeaderboard(me)) {
        await announcePresence(user, { student: me, lessonTitle });
      }
    } catch (err) {
      setError(err?.message || "Could not load the pane.");
    }
  }, [user, lessonTitle, available]);

  useEffect(() => {
    if (!open || board !== null || error) return;
    let alive = true;
    (async () => {
      if (alive) await load();
    })();
    return () => {
      alive = false;
    };
  }, [open, board, error, load]);

  /* Heartbeat, only while the pane is open AND they are not hidden.
     Without the `hidden` guard this would re-announce someone who had just
     hidden themselves, putting them back in the active list 90 seconds
     later — the same self-undoing failure the stored opt-out fixes for the
     leaderboard. */
  useEffect(() => {
    if (!open || !user || hidden) return;
    const t = setInterval(() => {
      announcePresence(user, { lessonTitle });
    }, 90 * 1000);
    return () => clearInterval(t);
  }, [open, user, lessonTitle, hidden]);

  const startChat = async (person) => {
    if (chatAllowed === false) {
      setNotice(
        "Private messaging is off on your account — see the Messages tab for why."
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
          `${person.name} has not opened messages yet, so there is no key to encrypt to. Try again once they have.`
        );
        return;
      }
      setChatWith(person);
      setTab("chats");
    } finally {
      setBusy(false);
    }
  };

  /**
   * Show or hide this learner across the whole pane.
   *
   * Hiding removes the leaderboard row AND the presence row, so they vanish
   * from both lists rather than only one. Showing republishes both, so the
   * button has an effect they can see immediately.
   */
  const toggleVisibility = async (visible) => {
    if (!user || working) return;
    setWorking(true);
    setError(null);
    try {
      await setLeaderboardVisibility(user, visible);
      if (visible) {
        const me = await getStudent(user.uid);
        await announcePresence(user, { student: me, lessonTitle });
        setBoard(null);
        setActive(null);
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
    setNotice(`${person.name} is blocked. They cannot message you.`);
    if (chatWith?.id === person.id) setChatWith(null);
  };

  const report = async (person) => {
    await reportUser(user, { aboutUid: person.id, reason: "reported-from-pane" });
    setNotice(
      `Reported. We can see who and when, but not what was said — paste anything we should look at into your report reply.`
    );
  };

  const visibleActive = (active || []).filter((p) => !blocked.includes(p.id));

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
              <button type="button" className="ac-sp__codelink" onClick={() => setNotice(null)}>
                Dismiss
              </button>
            </p>
          )}

          {error && (
            <p className="ac-sp__msg is-error" role="status">
              {error}
            </p>
          )}

          {/* ── Ranking ── */}
          {tab === "board" && (
            <>
              {board === null && !error && <p className="ac-sp__msg">Loading…</p>}
              {board?.length === 0 && (
                <p className="ac-sp__msg">
                  Nobody is on the board yet. Finish a lesson and you will be
                  first.
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

          {/* ── Active now ── */}
          {tab === "active" && (
            <>
              {active === null && !error && <p className="ac-sp__msg">Loading…</p>}
              {active !== null && visibleActive.length === 0 && (
                <p className="ac-sp__msg">
                  Nobody else is studying right now. You appear here only while
                  this panel is open.
                </p>
              )}
              {visibleActive.map((person) => (
                <StudentCard
                  key={person.id}
                  person={person}
                  busy={busy}
                  onMessage={startChat}
                  onBlock={block}
                  onReport={report}
                />
              ))}
            </>
          )}

          {/* ── Messages ── */}
          {tab === "chats" && (
            <>
              {!available && (
                <p className="ac-sp__msg is-error">
                  Encrypted chat needs a secure connection (HTTPS). It is
                  disabled here rather than falling back to something weaker.
                </p>
              )}
              {chatAllowed === false && (
                <p className="ac-sp__msg is-notice">
                  <i className="fas fa-shield-halved" aria-hidden="true" />{" "}
                  Private messaging is off on your account. These messages are
                  encrypted, so nobody — including us — can read or moderate
                  them, and that is not a safe default for under-18s or for an
                  account whose age we do not know. Complete your profile if
                  this is wrong.
                </p>
              )}
              {available && chatAllowed && !chatWith && (
                <p className="ac-sp__msg">
                  Open <strong>Active now</strong> and choose someone to
                  message. Conversations are encrypted in your browser, so they
                  are readable on this device only.
                </p>
              )}
              {available && chatAllowed && chatWith && (
                <ChatThread
                  user={user}
                  person={chatWith}
                  onBack={() => setChatWith(null)}
                />
              )}
            </>
          )}

          {/* Visibility, both ways. Hiding covers the ranking AND the active
              list: appearing in one while hidden from the other would make
              the control a half-measure a learner could not reason about. */}
          <div className="ac-sp__foot">
            {hidden ? (
              <>
                <p>
                  <i className="fas fa-eye-slash" aria-hidden="true" /> You are
                  hidden. Nobody sees your name in the ranking or the active
                  list, and you stay hidden until you choose otherwise —
                  finishing lessons will not put you back.
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
                  Only your name, level, badges and XP are shared here — never
                  your email or your scores. Messages are encrypted in your
                  browser, which also means we cannot moderate them: use Block
                  or Report if someone is a problem.
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
