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
  getBlockedUids,
  getConversations,
  getPublicKey,
  publishPublicKey,
  reportUser,
  sendMessage,
  startPresenceHeartbeat,
  subscribeActiveStudents,
  watchConversation,
  startPresenceHeartbeat,
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
  presenceStatus,
  serverNow,
} from "../data/presence";

/**
 * WHICH THREADS HAVE BEEN READ.
 *
 * Kept in this browser, not on the server, and deliberately so: the server
 * cannot read these conversations, so it has no business holding a
 * per-message read receipt either. A thread counts as unread when it was
 * touched after the last time this device opened it.
 *
 * Every access is wrapped because localStorage throws in a private window
 * and returns nothing when site data is cleared. An unread dot is a
 * convenience; losing it must never break the pane.
 */
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

/**
 * A presence dot.
 *
 * Never colour alone: the state is also in the accessible label and the
 * tooltip, because red/green distinctions are exactly the ones a large share
 * of people cannot see.
 */
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

/* ── One conversation ───────────────────────────────────────────────────── */

function ChatThread({ user, person, status, onBack, onSent }) {
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [safetyCode, setSafetyCode] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());
  const endRef = useRef(null);
  /* Which messages this thread has already announced.
   *
   * Opening a conversation delivers its whole history in one snapshot. Without
   * this, every reopen would play a chime per past message — a burst of
   * beeping for messages the learner has already read. Only ids that appear
   * AFTER the first snapshot count as new. */
  const seenRef = useRef(null);

  useEffect(() => {
    if (!user || !person) return;
    // A different conversation starts its own history.
    seenRef.current = null;
    const stop = watchConversation(
      user,
      person.id,
      (list) => {
        /* The first snapshot is history, not news: record it silently. */
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
      playSent();
      setDraft("");
      // Marks the thread read at the moment of sending. Without it the
      // learner's own message bumped `updatedAt` and came straight back as
      // an unread dot on their own conversation.
      onSent?.(conversationIdFor(user.uid, person.id));
    } catch (err) {
      /* A refusal is deliberately NOT explained. The rules reject a send to
         someone who has blocked you, and telling the sender that would hand
         them the one fact a block is supposed to withhold. They get the same
         neutral message any delivery failure produces. */
      setError(
        err?.code === "permission-denied"
          ? "That message could not be delivered."
          : err?.message || "The message could not be sent."
      );
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
  /* The heartbeat needs the student record and the current lesson, but must
     not RE-ARM when either changes, so both are read from refs.

     `lessonTitle` used to be a dependency of that effect. When it resolved
     from undefined to a title the effect tore down -- calling clearPresence
     -- and immediately re-announced. Two unordered writes to the same
     document: if the clear landed second, `online` was left false and the
     learner was invisible until the next heartbeat 90 seconds later. */
  const meRef = useRef(null);
  const lessonRef = useRef(lessonTitle);
  const [blocked, setBlocked] = useState([]);
  const [chatWith, setChatWith] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [chatAllowed, setChatAllowed] = useState(null);
  /* Kept apart from `error` so a key failure is named as a key failure. */
  const [keyError, setKeyError] = useState(null);
  /* The active list is a live subscription; its failures are separate from
     the one-off reads in load(), and must clear when it recovers. */
  const [activeError, setActiveError] = useState(null);
  /* Whether OTHER learners can see this one. Set from every presence write,
     so a refused write is shown instead of leaving the learner invisible with
     no idea why — which is how the Active list stayed empty for several
     rounds with nothing on screen. */
  const [presenceError, setPresenceError] = useState(null);
  /* A server-anchored clock: the freshest server timestamp in view and the
     local time it was seen. See serverNow() in data/presence.js. */
  const [anchor, setAnchor] = useState({ serverMs: null, localMs: Date.now() });
  /* Re-evaluates statuses as time passes. Someone who goes quiet produces no
     snapshot, so without a tick their dot would stay green indefinitely. */
  const [, setTick] = useState(0);
  /* Presence is only announced once the student record is loaded, because
     the first write has to be a COMPLETE row -- see announcePresence. */
  const [meReady, setMeReady] = useState(false);
  const [threads, setThreads] = useState(null);
  const [readAt, setReadAt] = useState(() => loadReadMarkers());
  const [hidden, setHidden] = useState(false);
  const [working, setWorking] = useState(false);

  const available = useMemo(() => isE2eeAvailable(), []);

  /* Everything starts on first open — nothing before it.
   *
   * THE PARTS ARE INDEPENDENT ON PURPOSE. This used to be one try block over
   * a Promise.all, so a single failing read took the whole pane down with it
   * — and because publishing the key came last, it never ran. The learner's
   * public key was therefore never written, the other side asked for it, got
   * nothing, and was told "they have not opened the chat yet". The real cause
   * was an unrelated leaderboard read failing. Messaging must not depend on
   * the ranking loading. */
  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    setKeyError(null);

    let me = null;
    try {
      me = await getStudent(user.uid);
    } catch {
      // Without the record we cannot prove they are an adult, and the
      // protective default is the closed one.
      setChatAllowed(false);
      setError("Could not load your account. Try again.");
      return;
    }

    meRef.current = me;
    setMeReady(true);

    // The under-18 safeguard, read from the record rather than recomputed
    // here so there is one authoritative value. Undefined (a learner who
    // has not completed onboarding) is treated as NOT allowed: when we
    // cannot tell someone's age, the protective default is the right one.
    setChatAllowed(me?.chatEnabled === true);
    setHidden(!isOnLeaderboard(me));

    /* The key goes FIRST and on its own. It is what messaging depends on,
       it is the cheapest write here, and a failure has to be reported as
       itself rather than mistaken for the other side being absent. */
    if (available) {
      try {
        await publishPublicKey(user);
      } catch (err) {
        setKeyError(
          err?.code === "permission-denied"
            ? "Messaging is not available yet — the Academy security rules have not been deployed."
            : "Your encryption key could not be published, so others cannot message you yet."
        );
      }
    }

    /* The active list is NOT fetched here — it is a live subscription set up
       in its own effect below. Everything left is a one-off read. */
    const [rows, myRank, blocks] = await Promise.allSettled([
      getLeaderboard({ top: 15 }),
      getMyRank(user.uid, me?.xp || 0),
      getBlockedUids(user.uid),
    ]);

    // Settled, not all-or-nothing: an empty board is a usable pane, and a
    // learner can still message someone even if the ranking will not load.
    setBoard(rows.status === "fulfilled" ? rows.value : []);
    setRank(myRank.status === "fulfilled" ? myRank.value : null);
    setBlocked(blocks.status === "fulfilled" ? blocks.value : []);

    if (rows.status === "rejected") {
      setError(
        rows.reason?.code === "permission-denied"
          ? "The leaderboard is unavailable on this account."
          : "The leaderboard could not load. Try again."
      );
    }
  }, [user, available]);

  /* `board` is set even on failure now, so this no longer needs `error` in
     the guard — which previously meant one bad load disabled the pane until
     the learner reloaded the whole lesson. */
  useEffect(() => {
    if (!open || board !== null) return;
    let alive = true;
    (async () => {
      if (alive) await load();
    })();
    return () => {
      alive = false;
    };
  }, [open, board, load]);

  /* Presence, only while the pane is open AND they are not hidden.
     Without the `hidden` guard this would re-announce someone who had just
     hidden themselves, putting them back in the active list 90 seconds
     later — the same self-undoing failure the stored opt-out fixes for the
     leaderboard.

     The meta is read through a function so the heartbeat always sees the
     current lesson and student record without this effect being torn down
     and rebuilt whenever either changes. The record matters because the
     write is a merge: sending no record used to blank out level and badges. */
  /* Kept current without re-arming the heartbeat. */
  useEffect(() => {
    lessonRef.current = lessonTitle;
  }, [lessonTitle]);

  useEffect(() => {
    if (!open || !user || hidden || !meReady) return;
    return startPresenceHeartbeat(
      user,
      () => ({ student: meRef.current, lessonTitle: lessonRef.current }),
      {
        onResult: (result) => {
          if (result?.ok) {
            setPresenceError(null);
            return;
          }
          setPresenceError(
            result?.code === "permission-denied"
              ? "Other learners cannot see you right now — the database refused your status update. Messaging still works."
              : "Other learners cannot see you right now. This retries on its own."
          );
        },
      }
    );
  }, [open, user, hidden, meReady]);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTick((n) => n + 1), 30 * 1000);
    return () => clearInterval(t);
  }, [open]);

  /* WHO ELSE IS HERE — a live subscription.
   *
   * The bug this fixes: the active list was fetched once, inside load(), and
   * load() never ran again — its guard is `board !== null` and closing the
   * pane does not reset it. The list was frozen at the instant the pane
   * first opened, so two people studying the same lesson never saw each
   * other arrive and both were told "Nobody else is studying right now"
   * indefinitely.
   *
   * A snapshot listener rather than a poll: someone appears the moment they
   * arrive, and it costs one connection instead of a read every few seconds.
   * Only while the pane is open, like everything else here. */
  useEffect(() => {
    if (!open || !user) return;
    return subscribeActiveStudents(
      (rows, nextAnchor) => {
        setActive(rows);
        if (nextAnchor) setAnchor(nextAnchor);
        // A snapshot arrived, so whatever went wrong before is over. Without
        // this the message latched: one failure -- including during the
        // minutes a new index is still building -- pinned "no index" on the
        // pane for the rest of the session, long after it was true.
        setActiveError(null);
      },
      {
        excludeUid: user.uid,
        onError: (err) => {
          setActiveError(
            err?.code === "failed-precondition"
              ? "The active list needs a database index. It may still be building — this clears itself once it is ready."
              : "The active list could not load just now. It will retry."
          );
        },
      }
    );
  }, [open, user]);

  /* Existing conversations.
   *
   * Without this the only way into a chat was the "Active now" list, so a
   * thread became unreachable the moment the other person closed their pane
   * — every conversation was lost as soon as it ended. A chat system has to
   * let you go back to what was already said. */
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
        "Private messaging is off on your account — open the Messages tab for why, and how to turn it on."
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
            : `${person.name} has not opened messages yet, so there is no key to encrypt to. They need to open this pane once.`
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
        meRef.current = me;
        await announcePresence(user, { student: me, lessonTitle });
        // Only the board is refetched. `active` belongs to the live
        // subscription, which reports the change on its own.
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
    setNotice(
      `${person.name} is blocked. The server now refuses their messages to you, and their conversation is hidden from your list.`
    );
    if (chatWith?.id === person.id) setChatWith(null);
  };

  const report = async (person) => {
    await reportUser(user, { aboutUid: person.id, reason: "reported-from-pane" });
    setNotice(
      `Reported. We can see who and when, but not what was said — paste anything we should look at into your report reply.`
    );
  };

  /* Server time, estimated. Recomputed every render; the 30-second tick
     above is what keeps renders coming when nothing else changes. */
  const now = serverNow(anchor.serverMs, anchor.localMs, Date.now());
  const statusOf = (row) => presenceStatus(row, now);

  /* Online and idle both belong here; offline does not. Sorted so the people
     you can talk to right now come first. */
  const RANK = { online: 0, idle: 1, offline: 2 };
  const visibleActive = (active || [])
    .filter((p) => !blocked.includes(p.id))
    .filter((p) => isAround(p, now))
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
                <p className="ac-sp__msg">
                  Nobody else is studying right now. This list checks again
                  every few seconds, so anyone who arrives will appear on their
                  own — and like you, they only show up while they have this
                  panel open.
                </p>
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

          {/* ── Messages ── */}
          {tab === "chats" && (
            <>
              {!available && (
                <p className="ac-sp__msg is-error">
                  Encrypted chat needs a secure connection (HTTPS). It is
                  disabled here rather than falling back to something weaker.
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
                  <i className="fas fa-shield-halved" aria-hidden="true" />{" "}
                  Private messaging is off on your account. These messages are
                  encrypted, so nobody — including us — can read or moderate
                  them, and that is not a safe default for under-18s or for an
                  account whose age we do not know.{" "}
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
                      No conversations yet. Open <strong>Active now</strong>
                      {" "}and choose someone to message. Conversations are
                      encrypted in your browser, so they are readable on this
                      device only.
                    </p>
                  )}

                  {threads !== null && threads.length > 0 && (
                    <ul className="ac-sp__threads">
                      {threads
                        // A blocked person's thread stays out of the list.
                        // The messages are still on the device; they are
                        // simply not offered back to the learner.
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
                                  {(t.person.name || "S")
                                    .charAt(0)
                                    .toUpperCase()}
                                  <StatusDot status={statusOf(t.person)} />
                                </span>
                                <span className="ac-sp__thread-meta">
                                  <strong>{t.person.name}</strong>
                                  {/* The SAME classifier as the Active tab.
                                      This used to read `online` alone, so a
                                      row abandoned at online:true said
                                      "studying now" here while Active
                                      correctly left it out. */}
                                  <em>{STATUS_LABEL[statusOf(t.person)]}</em>
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

                  <p className="ac-sp__msg">
                    Only this device can read these. A conversation opened on
                    another computer starts empty, because the key never
                    leaves the browser it was made in.
                  </p>
                </>
              )}
              {available && chatAllowed && chatWith && (
                <ChatThread
                  user={user}
                  person={chatWith}
                  status={statusOf(
                    // Prefer the live row if they are in the active list, so
                    // the header dot updates while the thread is open.
                    (active || []).find((p) => p.id === chatWith.id) || chatWith
                  )}
                  onBack={() => {
                    setChatWith(null);
                    // Re-read the list so a thread just used moves to the top
                    // and loses its unread dot.
                    setThreads(null);
                  }}
                  onSent={(conversationId) =>
                    setReadAt(saveReadMarker(conversationId))
                  }
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
