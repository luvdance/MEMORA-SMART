import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TypingDrill from "./TypingDrill";
import { sound } from "./music.js";
import { passage, rng } from "./text.js";

/**
 * GHOST RACE — race a passage against three bots and your own best.
 *
 * Strict mode, like a real typing race: you cannot move past a wrong key, so
 * speed only comes from accuracy. The ghost runs at your personal best race
 * speed, which makes the race against yourself — the only opponent that
 * actually measures improvement.
 *
 * Bot speed wobbles a little around its average, so a race is never decided
 * at the start and a lead can change hands.
 */

const LEAGUES = [
  { id: "rookie", name: "Rookie", range: [16, 30], desc: "Bots at 16–30 WPM. Start here.", icon: "fas fa-seedling" },
  { id: "pro", name: "Pro", range: [34, 58], desc: "Bots at 34–58 WPM — office speed.", icon: "fas fa-briefcase" },
  { id: "elite", name: "Elite", range: [62, 100], desc: "Bots at 62–100 WPM. Good luck.", icon: "fas fa-crown" },
  { id: "match", name: "Matched", range: null, desc: "Bots tuned around your recent average.", icon: "fas fa-scale-balanced" },
];

const BOT_NAMES = ["Byte", "Pixel", "Turbo", "Nova", "Echo", "Sparks", "Comet", "Glitch"];
const BOT_COLORS = ["#f59e0b", "#0d9488", "#c026d3"];

function makeBots(league, avg) {
  const [lo, hi] = league.range || [Math.max(10, avg * 0.8), Math.max(18, avg * 1.2)];
  const names = [...BOT_NAMES].sort(() => Math.random() - 0.5);
  return [0, 1, 2].map((i) => ({
    name: names[i],
    wpm: Math.round(lo + ((hi - lo) * (i + Math.random())) / 3),
    color: BOT_COLORS[i],
    phase: Math.random() * 6,
  }));
}

export default function TypeRace({ ghostWpm = 0, avgWpm = 25, onFinish, onExit }) {
  const [league, setLeague] = useState(LEAGUES[0]);
  const [phase, setPhase] = useState("menu"); // menu | countdown | racing | done
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(() => Date.now());
  const [bots, setBots] = useState([]);
  const [now, setNow] = useState(0);
  const [myPos, setMyPos] = useState(0);
  const [doneAt, setDoneAt] = useState(null);
  const [result, setResult] = useState(null);
  const goAt = useRef(0);

  const text = useMemo(() => passage(rng(seed), league.id === "elite" ? 2 : 1), [seed, league.id]);
  const len = text.length;

  // Characters a racer at `wpm` has covered after `t` seconds, with a wobble.
  const covered = (wpm, t, ph = 0) => {
    const cps = (wpm * 5) / 60;
    return Math.min(len, cps * t + Math.sin(t * 0.9 + ph) * cps * 0.9);
  };

  const start = () => {
    setSeed(Date.now());
    setBots(makeBots(league, avgWpm));
    setMyPos(0);
    setDoneAt(null);
    setResult(null);
    setCount(3);
    setPhase("countdown");
    sound().countdown();
  };

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) {
      sound().countdown(true);
      sound().playTheme("race", { intensity: 2 });
      const t = performance.now();
      goAt.current = t;
      setNow(t);
      setPhase("racing");
      return;
    }
    const id = setTimeout(() => {
      setCount((c) => c - 1);
      if (count > 1) sound().countdown();
    }, 800);
    return () => clearTimeout(id);
  }, [phase, count]);

  // Animate the bots' lanes while racing.
  useEffect(() => {
    if (phase !== "racing") return;
    let raf;
    let last = 0;
    const loop = (t) => {
      if (t - last > 50) {
        last = t;
        setNow(t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => () => sound().stopMusic(), []);

  const [goTime, setGoTime] = useState(0);
  useEffect(() => {
    if (phase === "racing") setGoTime(goAt.current);
  }, [phase]);
  const elapsed = phase === "racing" || phase === "done" ? Math.max(0, ((doneAt ?? now) - goTime) / 1000) : 0;

  const finishTime = (wpm) => {
    // When a bot crosses the line — solved numerically because of the wobble.
    for (let t = 0; t < 900; t += 0.05) if (covered(wpm, t) >= len) return t;
    return 900;
  };

  const onDrillFinish = useCallback(
    (stats) => {
      const end = performance.now();
      setDoneAt(end);
      const myTime = (end - goAt.current) / 1000;
      const field = [
        ...bots.map((b) => ({ name: b.name, time: finishTime(b.wpm), wpm: b.wpm, color: b.color })),
        ...(ghostWpm ? [{ name: "Your ghost", time: finishTime(ghostWpm), wpm: ghostWpm, ghost: true }] : []),
        { name: "You", time: myTime, wpm: Math.round(stats.wpm), me: true },
      ].sort((a, b) => a.time - b.time);
      const place = field.findIndex((r) => r.me) + 1;
      const won = place === 1;
      sound().stopMusic();
      if (won) sound().win();
      else sound().lose();
      const outcome = onFinish?.({ stats, place, won, league: league.id, keys: null });
      setResult({ field, place, won, stats, xp: outcome?.xp });
      setPhase("done");
    },
    // finishTime depends on len, which follows text
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bots, ghostWpm, league.id, onFinish, len]
  );

  const lanes = [
    { name: "You", me: true, color: "#3b52f0", pos: myPos / len },
    ...bots.map((b) => ({ name: b.name, wpm: b.wpm, color: b.color, pos: covered(b.wpm, elapsed, b.phase) / len })),
    ...(ghostWpm ? [{ name: "Ghost", wpm: Math.round(ghostWpm), ghost: true, color: "#94a3b8", pos: covered(ghostWpm, elapsed) / len }] : []),
  ];

  const ordinal = (n) => `${n}${["th", "st", "nd", "rd"][n % 10 > 3 || Math.floor(n / 10) === 1 ? 0 : n % 10]}`;

  return (
    <div className="ty-game ty-race">
      <div className="ty-game__bar">
        <button type="button" className="ty-link" onClick={onExit}>
          <i className="fas fa-arrow-left" aria-hidden="true" /> Arcade
        </button>
        <h2>
          <i className="fas fa-flag-checkered" aria-hidden="true" /> Ghost Race
        </h2>
        <span className="ty-game__best">{ghostWpm ? `Ghost ${Math.round(ghostWpm)} WPM` : "No ghost yet"}</span>
      </div>

      {phase === "menu" && (
        <div className="ty-race__menu">
          <p>
            Race three bots across a passage. You cannot pass a wrong key, so the fastest way to win is
            to make no mistakes. Beat your <strong>ghost</strong> — it runs at your best race speed.
          </p>
          <div className="ty-modes">
            {LEAGUES.map((l) => (
              <button type="button" key={l.id} className={`ty-mode ty-mode--light ${league.id === l.id ? "is-on" : ""}`} onClick={() => setLeague(l)}>
                <i className={l.icon} aria-hidden="true" />
                <strong>{l.name}</strong>
                <span>{l.desc}</span>
              </button>
            ))}
          </div>
          <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" onClick={start}>
            <i className="fas fa-flag" aria-hidden="true" /> Start race
          </button>
        </div>
      )}

      {phase !== "menu" && (
        <div className="ty-track" aria-label="Race positions">
          {lanes.map((lane) => (
            <div className={`ty-lane ${lane.me ? "is-me" : ""} ${lane.ghost ? "is-ghost" : ""}`} key={lane.name}>
              <span className="ty-lane__name">
                {lane.name}
                {lane.wpm ? <small> {lane.wpm} wpm</small> : null}
              </span>
              <div className="ty-lane__road">
                <span className="ty-lane__car" style={{ left: `calc(${Math.min(1, lane.pos) * 100}% - ${Math.min(1, lane.pos) * 34}px)`, color: lane.color }}>
                  <i className={lane.ghost ? "fas fa-ghost" : lane.me ? "fas fa-car-side" : "fas fa-truck-fast"} aria-hidden="true" />
                </span>
                <span className="ty-lane__flag" aria-hidden="true">
                  <i className="fas fa-flag-checkered" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === "countdown" && (
        <div className="ty-lights" aria-live="assertive">
          {[3, 2, 1].map((n) => (
            <span key={n} className={`ty-light ${count === 0 ? "is-go" : 4 - n <= 3 - count + 1 ? "is-on" : ""}`} />
          ))}
          <strong>{count || "GO!"}</strong>
        </div>
      )}

      {phase === "racing" && (
        <TypingDrill
          key={seed}
          text={text}
          mode="strict"
          guide="blind"
          theme="race"
          autoStartMusic={false}
          onProgress={(run) => {
            setMyPos(run.pos);
          }}
          onFinish={onDrillFinish}
          onRestart={() => setPhase("menu")}
        />
      )}

      {phase === "done" && result && (
        <div className="ty-race__result">
          <h3 className={result.won ? "is-win" : ""}>
            {result.won ? <><i className="fas fa-trophy" aria-hidden="true" /> You won!</> : `You finished ${ordinal(result.place)}`}
          </h3>
          <ol className="ty-podium">
            {result.field.map((r) => (
              <li key={r.name} className={r.me ? "is-me" : r.ghost ? "is-ghost" : ""}>
                <span>{r.name}</span>
                <span>{r.wpm} WPM</span>
                <span>{r.time.toFixed(1)}s</span>
              </li>
            ))}
          </ol>
          <p className="ty-race__stats">
            {Math.round(result.stats.wpm)} WPM · {result.stats.accuracy}% accuracy
            {result.xp != null && <> · <i className="fas fa-bolt" aria-hidden="true" /> +{result.xp} XP</>}
          </p>
          <div className="ty-overlay__row">
            <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" onClick={start} autoFocus>
              <i className="fas fa-rotate-right" aria-hidden="true" /> Race again
            </button>
            <button type="button" className="ac-btn ac-btn--ghost" onClick={() => setPhase("menu")}>
              Change league
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
