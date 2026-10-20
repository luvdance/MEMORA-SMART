import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTypingBoard } from "./progress.js";

/**
 * Fastest verified typists. Same privacy rules as the XP board: usernames
 * only, and the same "hide me" preference on the profile page removes you.
 */
export default function TypingBoard({ uid, optedOut }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    getTypingBoard(25)
      .then((r) => alive && setRows(r))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="ty-card ty-board">
      <h3 className="ty-card__title">Fastest verified typists</h3>
      <p className="ty-card__sub">
        Ranked by best 60-second-or-longer run at 95%+ accuracy — the way hiring tests measure it.
      </p>
      {error && <p className="ty-chart__empty">The leaderboard could not be loaded. Try again shortly.</p>}
      {!error && !rows && <p className="ty-chart__empty"><i className="fas fa-spinner fa-spin" aria-hidden="true" /> Loading…</p>}
      {rows && rows.length === 0 && <p className="ty-chart__empty">No verified runs yet. Take a 60-second test to be first.</p>}
      {rows && rows.length > 0 && (
        <ol className="ty-board__list">
          {rows.map((r) => (
            <li key={r.id} className={r.uid === uid ? "is-me" : ""}>
              <span className="ty-board__rank">{r.rank <= 3 ? <i className={`fas fa-medal is-${r.rank}`} aria-hidden="true" /> : r.rank}</span>
              <span className="ty-board__name">
                {r.name}
                <small>{r.tier} · level {r.level}</small>
              </span>
              <span className="ty-board__wpm">
                <strong>{r.wpm}</strong> WPM
                <small>{r.accuracy}%</small>
              </span>
            </li>
          ))}
        </ol>
      )}
      {optedOut && (
        <p className="ty-card__sub">
          You are hidden from leaderboards. <Link to="/academy/profile">Change this on your profile.</Link>
        </p>
      )}
    </div>
  );
}
