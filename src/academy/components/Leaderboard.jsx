import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getLeaderboard,
  getMyRank,
  getStudent,
  leaveLeaderboard,
} from "../services/academyService";

/**
 * THE LEADERBOARD
 *
 * Two rules govern this component, and both come from the same instruction:
 * be collapsible, and do not interrupt the lessons.
 *
 * 1. IT NEVER INTERRUPTS.
 *    It is a panel in the page flow — never a modal, never an overlay, never
 *    a toast. It does not steal focus, does not auto-expand, and does not
 *    move content that is already on screen: the body is only mounted when
 *    the learner opens it, so nothing under it shifts while a lesson is being
 *    read. In the lesson player it starts CLOSED, every time, for everyone.
 *
 * 2. IT COSTS NOTHING WHILE CLOSED.
 *    No query runs until the learner expands it. A collapsed board issues
 *    zero Firestore reads, so putting it on a lesson page cannot slow the
 *    lesson down or spend a learner's data. That is not just an optimisation
 *    — it is what makes it safe to have on the page at all.
 *
 * The open/closed choice is remembered per variant in localStorage, so a
 * learner who likes it open on the dashboard still gets it closed in lessons.
 *
 * VARIANTS
 *   panel    the dashboard: a full section, remembered open if they open it
 *   compact  the lesson player: smaller, always starts closed
 *
 * HONESTY: XP is written by the client, so a determined user could inflate
 * their own row. A board cannot be more trustworthy than the number it ranks.
 * See the leaderboard notes in academyService.js for the fix.
 */

const STORE = "mst-leaderboard-open";

export default function Leaderboard({
  variant = "panel",
  student = null,
  title = "Leaderboard",
}) {
  const { user } = useAuth();

  // The lesson player always starts closed — a learner opening a lesson is
  // there to learn, not to check their rank. On the dashboard we remember.
  const [open, setOpen] = useState(() => {
    if (variant === "compact") return false;
    try {
      return localStorage.getItem(`${STORE}-${variant}`) === "1";
    } catch {
      return false;
    }
  });

  const [rows, setRows] = useState(null);
  const [myRank, setMyRank] = useState(null);
  const [error, setError] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // The caller may already hold the student record (the dashboard does). Where
  // it does not — the lesson player, which must not spend a read per lesson on
  // this — we fetch it here, on open, so a closed board still costs nothing.
  const [me, setMe] = useState(student);

  // Loading is DERIVED, not stored. Keeping it as state meant the fetch effect
  // had to setState synchronously on mount, which is the pattern
  // react-hooks/set-state-in-effect exists to prevent. Here the effect only
  // ever sets state after an await.
  const loading = open && rows === null && !error;

  /* Fetch once, when first opened. A closed board issues no query at all. */
  useEffect(() => {
    if (!open || rows !== null || error) return;
    let alive = true;

    (async () => {
      try {
        const record = student || (user ? await getStudent(user.uid) : null);
        const [board, rank] = await Promise.all([
          getLeaderboard({ top: variant === "compact" ? 5 : 20 }),
          user ? getMyRank(user.uid, record?.xp || 0) : Promise.resolve(null),
        ]);
        if (!alive) return;
        setMe(record);
        setRows(board);
        setMyRank(rank);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "The leaderboard could not be loaded.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, rows, error, student, user, variant, attempt]);

  /** Clearing the error lets the effect above run again. */
  const retry = useCallback(() => {
    setError(null);
    setRows(null);
    setAttempt((n) => n + 1);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (variant !== "compact") {
      try {
        localStorage.setItem(`${STORE}-${variant}`, next ? "1" : "0");
      } catch {
        /* private mode — the panel still works, it just will not remember */
      }
    }
  };

  const optOut = async () => {
    if (!user) return;
    try {
      await leaveLeaderboard(user.uid);
      setHidden(true);
      setRows((prev) => (prev || []).filter((r) => r.id !== user.uid));
      setMyRank(null);
    } catch {
      setError("Could not remove you from the board. Try again.");
    }
  };

  const mine = rows?.find((r) => r.id === user?.uid) || null;
  const inTop = Boolean(mine);

  return (
    <section className={`ac-lb ac-lb--${variant} ${open ? "is-open" : ""}`}>
      <h3 className="ac-lb__bar">
        <button
          type="button"
          className="ac-lb__toggle"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`ac-lb-body-${variant}`}
        >
          <i className="fas fa-ranking-star" aria-hidden="true" />
          <span className="ac-lb__title">{title}</span>
          {/* A rank is only shown once loaded — never a placeholder number,
              which would read as a real position. */}
          {open && myRank && !hidden && (
            <span className="ac-lb__myrank">You are #{myRank}</span>
          )}
          <i
            className={`fas fa-chevron-${open ? "up" : "down"} ac-lb__chev`}
            aria-hidden="true"
          />
        </button>
      </h3>

      {/* Mounted only when open, so nothing on the page moves while closed. */}
      {open && (
        <div className="ac-lb__body" id={`ac-lb-body-${variant}`}>
          {loading && (
            <p className="ac-lb__msg">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Loading
              the board…
            </p>
          )}

          {error && (
            <p className="ac-lb__msg is-error" role="status">
              {error}{" "}
              <button type="button" className="ac-lb__retry" onClick={retry}>
                Try again
              </button>
            </p>
          )}

          {!loading && !error && rows?.length === 0 && (
            <p className="ac-lb__msg">
              Nobody is on the board yet. Finish a lesson and you will be
              first.
            </p>
          )}

          {!error && rows?.length > 0 && (
            <>
              <ol className="ac-lb__list">
                {rows.map((row) => {
                  const isMe = row.id === user?.uid;
                  return (
                    <li
                      key={row.id}
                      className={`ac-lb__row ${isMe ? "is-me" : ""}`}
                    >
                      <span className="ac-lb__pos">{row.rank}</span>
                      <span className="ac-lb__name">
                        {row.name}
                        {isMe && <em> — you</em>}
                      </span>
                      <span className="ac-lb__lvl">{row.levelName}</span>
                      <span className="ac-lb__xp">
                        {(row.xp || 0).toLocaleString()} XP
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* If they are not in the visible top, show where they are
                  rather than leaving them to wonder. */}
              {!inTop && myRank && !hidden && (
                <p className="ac-lb__msg">
                  You are ranked #{myRank} with{" "}
                  {(me?.xp || 0).toLocaleString()} XP.
                </p>
              )}

              {hidden ? (
                <p className="ac-lb__msg">
                  You have been removed from the board. Earning XP will put you
                  back on it.
                </p>
              ) : (
                <div className="ac-lb__foot">
                  <p>
                    Only your name, level and XP are shared here — never your
                    email or your scores.
                  </p>
                  <button type="button" className="ac-lb__optout" onClick={optOut}>
                    Hide me from the leaderboard
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
