import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import { getStudent } from "../services/academyService";
import TypingDrill from "../typing/TypingDrill";
import FingerPlacement from "../typing/FingerPlacement";
import ResultsCard from "../typing/ResultsCard";
import VirtualKeyboard, { FingerLegend } from "../typing/VirtualKeyboard";
import WordRain from "../typing/WordRain";
import TypeRace from "../typing/TypeRace";
import TypingStats from "../typing/TypingStats";
import TypingBoard from "../typing/TypingBoard";
import SoundControls from "../typing/SoundControls";
import { readGuidePref, resolveGuide } from "../typing/guide.js";
import { LESSONS, LESSON_BY_ID, STAGES, isUnlocked, nextLesson, stageProgress, starsFor, PASS_ACCURACY } from "../typing/curriculum.js";
import { keyResults, speedTier, typingLevel, weakestKeys } from "../typing/engine.js";
import { FINGERS, describeStroke, strokeFor, charLabel } from "../typing/keyboard.js";
import { emptyProfile, loadTypingProfile, publishTypingBoard, recordSession, saveTypingProfile } from "../typing/progress.js";
import {
  CODE_LANGS,
  codeSnippets,
  dataEntryLine,
  numberStream,
  passage,
  punctuatedStream,
  rng,
  symbolDrill,
  weakKeyDrill,
  wordStream,
} from "../typing/text.js";
import "../academy.css";

/**
 * TYPING DOJO — the Academy's touch-typing tutor.
 *
 * The outcome it is built for: type accurately and fast WITHOUT looking at
 * the keyboard, including numbers and symbols. Everything here serves that:
 *
 *   Path       9 stages, home row → code, with keyboard guidance that fades
 *   Test       timed tests on the hiring-test definition of WPM
 *   Practice   adaptive weak-key drills, data entry, code, custom text
 *   Arcade     Word Rain and Ghost Race — the same skill under pressure
 *   Stats      trend, error heatmap, bests, achievements
 *   Board      fastest verified typists across the Academy
 *
 * The view lives in the URL (?view=…&lesson=…), so Back works and a lesson
 * can be linked to directly.
 */

const TABS = [
  { id: "path", label: "Lessons", icon: "fas fa-route" },
  { id: "test", label: "Speed test", icon: "fas fa-stopwatch" },
  { id: "practice", label: "Practice", icon: "fas fa-dumbbell" },
  { id: "arcade", label: "Arcade", icon: "fas fa-gamepad" },
  { id: "stats", label: "My stats", icon: "fas fa-chart-line" },
  { id: "board", label: "Leaderboard", icon: "fas fa-trophy" },
];

const STAGE_TIPS = {
  ready: [],
  home: [
    "Rest your left fingers on A S D F and your right on J K L ;. Thumbs float over Space.",
    "Find the small bumps on F and J without looking — that is how you find home in the dark.",
    "After every key, return the finger to its home key.",
  ],
  top: ["Reach UP with the finger that owns the column, then come straight back home.", "Keep your wrists still; only the finger moves."],
  bottom: ["Curl the finger down and slightly in. The comma and period belong to the right middle and ring fingers."],
  shift: [
    "Hold Shift with the pinky of the OTHER hand: capital J? Left Shift. Capital F? Right Shift.",
    "Press Shift first, then the letter, then release both.",
  ],
  punct: ["The right pinky owns ; ' / and the keys beyond them. Move it without lifting your other fingers off home."],
  numbers: ["Numbers are two rows up. Use the same finger as the letter column below: 3 is the left middle finger, like E and D."],
  symbols: ["Symbols are the number row with Shift held by the opposite pinky. @ is Shift + 2, # is Shift + 3."],
  code: ["Indentation is filled in after Enter. Brackets come in pairs — learn ( ) [ ] { } as one movement each."],
  fluency: ["The keyboard is gone. Trust your fingers, keep a steady rhythm and read one word ahead."],
};

const TESTS = [15, 30, 60, 120];
const TEST_CONTENT = [
  { id: "words", label: "Common words", make: (r) => wordStream(r, 400) },
  { id: "punct", label: "Punctuation", make: (r) => punctuatedStream(r, 320) },
  { id: "passage", label: "Paragraphs", make: (r) => Array.from({ length: 6 }, () => passage(r, 4)).join(" ") },
  { id: "numbers", label: "Numbers", make: (r) => `${numberStream(r, 140)} ${wordStream(r, 60)}` },
];

export default function TypingDojo() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const view = params.get("view") || "path";
  const lessonId = params.get("lesson");

  const [profile, setProfile] = useState(emptyProfile);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guidePref, setGuidePref] = useState(readGuidePref);
  const profileRef = useRef(profile);

  useSEO({
    title: "Typing Dojo — Memora Smart Academy",
    description: "Learn to touch type: fast, accurate and without looking — letters, numbers, symbols and code.",
  });

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    Promise.all([loadTypingProfile(user.uid), getStudent(user.uid).catch(() => null)]).then(([p, s]) => {
      if (!alive) return;
      setProfile(p);
      setStudent(s);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  const go = useCallback(
    (next) => {
      const p = new URLSearchParams();
      Object.entries(next).forEach(([k, v]) => v && p.set(k, v));
      setParams(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setParams]
  );

  /**
   * Record any finished run. Synchronous on purpose — the games show the XP
   * earned on their game-over screen in the same frame.
   */
  const record = useCallback(
    (session) => {
      const outcome = recordSession(profileRef.current, session);
      profileRef.current = outcome.profile;
      setProfile(outcome.profile);
      saveTypingProfile(user?.uid, outcome.profile);
      if (outcome.newBest) publishTypingBoard(user?.uid, student, outcome.profile);
      return outcome;
    },
    [user, student]
  );

  const level = typingLevel(profile.xp);
  const tier = speedTier(profile.bestVerifiedWpm);
  const upNext = nextLesson(profile.lessons);
  const passedCount = LESSONS.filter((l) => (profile.lessons[l.id]?.stars || 0) >= 1).length;
  const avgWpm = useMemo(() => {
    const r = profile.history.slice(-10);
    return r.length ? r.reduce((n, h) => n + h.wpm, 0) / r.length : 25;
  }, [profile.history]);

  const inGame = view === "rain" || view === "race";

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section ty-page">
        <div className="ac-container">
          {/* ── HEADER ── */}
          <header className="ty-hero">
            <div className="ty-hero__title">
              <span className="ac-kicker">Academy skill</span>
              <h1>
                Typing Dojo <i className="fas fa-keyboard" aria-hidden="true" />
              </h1>
              <p>Type fast and accurately without looking at the keyboard — letters, numbers, symbols and code.</p>
            </div>
            <div className="ty-hero__meta">
              <div className="ty-level">
                <span className="ty-level__badge">{level.level}</span>
                <div>
                  <strong>{level.title}</strong>
                  <div className="ty-level__bar">
                    <div style={{ width: `${level.percent}%` }} />
                  </div>
                  <small>
                    {profile.xp.toLocaleString()} XP · {level.toNext} to level {level.level + 1}
                  </small>
                </div>
              </div>
              <div className="ty-hero__chips">
                <span className="ty-chip" title="Best verified speed (60s+, 95%+ accuracy)">
                  <i className="fas fa-gauge-high" aria-hidden="true" /> {Math.round(profile.bestVerifiedWpm)} WPM · {tier.name}
                </span>
                <span className="ty-chip">
                  <i className="fas fa-fire" aria-hidden="true" /> {profile.streak.current || 0}-day streak
                </span>
                <span className="ty-chip">
                  <i className="fas fa-star" aria-hidden="true" /> {passedCount}/{LESSONS.length} lessons
                </span>
                <SoundControls guide={guidePref} onGuide={setGuidePref} />
              </div>
            </div>
          </header>

          {/* ── TABS ── */}
          {!inGame && (
            <nav className="ty-tabs" aria-label="Typing Dojo">
              {TABS.map((t) => {
                const active = view === t.id || (t.id === "path" && view === "lesson") || (t.id === "arcade" && inGame);
                return (
                  <button
                    type="button"
                    key={t.id}
                    className={`ty-tab ${active ? "is-active" : ""}`}
                    onClick={() => go({ view: t.id })}
                    aria-current={active ? "page" : undefined}
                  >
                    <i className={t.icon} aria-hidden="true" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          )}

          {loading ? (
            <div className="ac-boot ac-boot--inline">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              <p>Loading your typing record…</p>
            </div>
          ) : (
            <>
              {view === "path" && <PathView profile={profile} upNext={upNext} onOpen={(id) => go({ view: "lesson", lesson: id })} />}

              {view === "lesson" && LESSON_BY_ID.has(lessonId) && (
                <LessonView
                  key={lessonId}
                  lesson={LESSON_BY_ID.get(lessonId)}
                  profile={profile}
                  guidePref={guidePref}
                  record={record}
                  onBack={() => go({ view: "path" })}
                  onOpen={(id) => go({ view: "lesson", lesson: id })}
                />
              )}
              {view === "lesson" && !LESSON_BY_ID.has(lessonId) && (
                <PathView profile={profile} upNext={upNext} onOpen={(id) => go({ view: "lesson", lesson: id })} />
              )}

              {view === "test" && <TestView guidePref={guidePref} record={record} profile={profile} />}

              {view === "practice" && <PracticeView guidePref={guidePref} record={record} profile={profile} initial={params.get("drill")} />}

              {view === "arcade" && <ArcadeView profile={profile} onPlay={(g) => go({ view: g })} />}

              {view === "rain" && (
                <WordRain
                  best={profile.bests.rainScore}
                  onExit={() => go({ view: "arcade" })}
                  onFinish={(res) =>
                    record({
                      mode: "rain",
                      stats: res.stats,
                      keys: res.keys,
                      bonusXp: Math.round(res.score / 200),
                      extra: { rainScore: res.score, rainWave: res.wave },
                    })
                  }
                />
              )}

              {view === "race" && (
                <TypeRace
                  ghostWpm={profile.bests.raceWpm}
                  avgWpm={avgWpm}
                  onExit={() => go({ view: "arcade" })}
                  onFinish={(res) =>
                    record({
                      mode: "race",
                      stats: res.stats,
                      bonusXp: res.won ? 40 : Math.max(0, 20 - res.place * 5),
                      extra: { raceWon: res.won, league: res.league },
                    })
                  }
                />
              )}

              {view === "stats" && <TypingStats profile={profile} onPractiseWeak={() => go({ view: "practice", drill: "weak" })} />}

              {view === "board" && <TypingBoard uid={user?.uid} optedOut={student?.leaderboardOptOut === true} />}
            </>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}

/* ── PATH ─────────────────────────────────────────────────────────────── */

function PathView({ profile, upNext, onOpen }) {
  return (
    <div className="ty-path">
      {upNext && (
        <section className="ac-resume ty-resume">
          <div className="ac-resume__body">
            <span className="ac-resume__eyebrow">Up next · {upNext.stageTitle}</span>
            <h2>{upNext.title}</h2>
            <p className="ac-resume__crumb">
              {upNext.kind === "placement"
                ? "Start here: posture, where each finger rests, and the bumps on F and J."
                : upNext.newKeys.length
                ?`New keys: ${upNext.newKeys.map((k) => (k.startsWith("Shift") ? k.replace("Shift", "") + " Shift" : charLabel(k))).join("  ")}`
                : "Put the keys you know to work."}
            </p>
          </div>
          <button type="button" className="ac-btn ac-btn--light ac-btn--lg" onClick={() => onOpen(upNext.id)}>
            Start <i className="fas fa-arrow-right" aria-hidden="true" />
          </button>
        </section>
      )}
      {!upNext && (
        <section className="ac-resume ac-resume--done ty-resume">
          <div className="ac-resume__body">
            <span className="ac-resume__eyebrow">Path complete</span>
            <h2>You are a touch typist.</h2>
            <p className="ac-resume__crumb">Go back for three stars on every lesson, or prove your speed with a 60-second test.</p>
          </div>
        </section>
      )}

      {STAGES.map((stage, s) => {
        const prog = stageProgress(stage, profile.lessons);
        const firstOpen = isUnlocked(stage.lessons[0].id, profile.lessons);
        return (
          <section className={`ty-stagecard ${firstOpen ? "" : "is-locked"}`} key={stage.id}>
            <header>
              <span className="ty-stagecard__icon">
                <i className={stage.icon} aria-hidden="true" />
              </span>
              <div>
                <span className="ty-stagecard__num">Stage {s + 1}</span>
                <h3>{stage.title}</h3>
                <p>{stage.blurb}</p>
              </div>
              <span className="ty-stagecard__prog">
                <i className="fas fa-star" aria-hidden="true" /> {prog.stars}/{prog.maxStars}
              </span>
            </header>
            <ol className="ty-nodes">
              {stage.lessons.map((l) => {
                const rec = profile.lessons[l.id];
                const open = isUnlocked(l.id, profile.lessons);
                const current = upNext?.id === l.id;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      className={`ty-node ${rec?.stars ? "is-done" : ""} ${current ? "is-current" : ""}`}
                      disabled={!open}
                      onClick={() => onOpen(l.id)}
                    >
                      <span className="ty-node__stars" aria-label={`${rec?.stars || 0} stars`}>
                        {[1, 2, 3].map((n) => (
                          <i key={n} className={`fas fa-star ${n <= (rec?.stars || 0) ? "is-on" : ""}`} aria-hidden="true" />
                        ))}
                      </span>
                      <strong>{open ? l.title : <><i className="fas fa-lock" aria-hidden="true" /> {l.title}</>}</strong>
                      <small>
                        {rec ? `Best ${Math.round(rec.bestWpm)} WPM · ${Math.round(rec.bestAcc)}%` : `Target ${l.target} WPM`}
                      </small>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

/* ── LESSON ───────────────────────────────────────────────────────────── */

function LessonView({ lesson, profile, guidePref, record, onBack, onOpen }) {
  const [phase, setPhase] = useState("intro"); // intro | drill | results
  const [seed, setSeed] = useState(() => Date.now());
  const [result, setResult] = useState(null);
  const text = useMemo(() => lesson.make(rng(seed)), [lesson, seed]);
  const rec = profile.lessons[lesson.id];
  const guide = resolveGuide(guidePref, rec?.stars >= 2 && lesson.guide === "full" ? "hint" : lesson.guide);
  const i = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[i + 1];
  const tips = STAGE_TIPS[lesson.stageId] || [];

  const restart = () => {
    setSeed(Date.now());
    setResult(null);
    setPhase("drill");
  };

  const onFinish = (stats, run) => {
    const stars = starsFor(stats, lesson.target);
    const outcome = record({ mode: "lesson", lessonId: lesson.id, stats, keys: keyResults(run), stars });
    setResult({ stats, run, stars, outcome });
    setPhase("results");
  };

  const keyChars = lesson.newKeys.filter((k) => !k.startsWith("Shift"));

  return (
    <div className="ty-lesson">
      <div className="ty-crumbs">
        <button type="button" className="ty-link" onClick={onBack}>
          <i className="fas fa-arrow-left" aria-hidden="true" /> All lessons
        </button>
        <span>
          {lesson.stageTitle} · Lesson {lesson.index + 1}
        </span>
      </div>

      {lesson.kind === "placement" && phase !== "results" && (
        <FingerPlacement key={seed} checkText={text} onComplete={onFinish} />
      )}

      {lesson.kind !== "placement" && phase === "intro" && (
        <section className="ty-intro">
          <div className="ty-intro__body">
            <h2>{lesson.title}</h2>
            {keyChars.length > 0 && (
              <ul className="ty-newkeys">
                {keyChars.map((k) => {
                  const s = strokeFor(k);
                  return (
                    <li key={k} style={{ "--finger": s ? FINGERS[s.finger].color : "#94a3b8" }}>
                      <kbd>{charLabel(k)}</kbd>
                      <span>{describeStroke(k)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <ul className="ty-tips">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
              <li>
                Pass with <strong>{PASS_ACCURACY}% accuracy</strong>. For three stars: <strong>{lesson.target} WPM</strong> at 97%.
              </li>
            </ul>
            <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" onClick={() => setPhase("drill")} autoFocus>
              <i className="fas fa-play" aria-hidden="true" /> Start lesson
            </button>
          </div>
          <div className="ty-intro__kb">
            <VirtualKeyboard nextChar={keyChars[0]} highlight compact={false} />
            <FingerLegend active={keyChars[0] ? strokeFor(keyChars[0])?.finger : null} />
          </div>
        </section>
      )}

      {lesson.kind !== "placement" && phase === "drill" && (
        <TypingDrill
          key={seed}
          text={text}
          mode="strict"
          autoIndent={lesson.kind === "code"}
          guide={guide}
          theme="focus"
          showLegend={["home", "top"].includes(lesson.stageId)}
          onFinish={onFinish}
          onRestart={restart}
        />
      )}

      {phase === "results" && result && (
        <ResultsCard
          stats={result.stats}
          run={result.run}
          stars={result.stars}
          target={lesson.target}
          passed={result.stars >= 1}
          outcome={result.outcome}
          onRetry={restart}
          onNext={result.stars >= 1 && next ? () => onOpen(next.id) : undefined}
          nextLabel={next ? `Next: ${next.title}` : undefined}
        />
      )}
    </div>
  );
}

/* ── SPEED TEST ───────────────────────────────────────────────────────── */

function TestView({ guidePref, record, profile }) {
  const [seconds, setSeconds] = useState(60);
  const [content, setContent] = useState(TEST_CONTENT[0]);
  const [seed, setSeed] = useState(() => Date.now());
  const [result, setResult] = useState(null);
  const text = useMemo(() => content.make(rng(seed)), [content, seed]);

  const restart = () => {
    setSeed(Date.now());
    setResult(null);
  };

  const onFinish = (stats, run) => {
    const outcome = record({ mode: `test${seconds}`, stats, keys: keyResults(run) });
    setResult({ stats, run, outcome });
  };

  return (
    <div className="ty-test">
      <div className="ty-options">
        <div className="ty-seg ty-seg--inline" role="group" aria-label="Duration">
          {TESTS.map((t) => (
            <button type="button" key={t} className={seconds === t ? "is-on" : ""} onClick={() => { setSeconds(t); restart(); }}>
              {t < 60 ? `${t}s` : `${t / 60} min`}
            </button>
          ))}
        </div>
        <div className="ty-seg ty-seg--inline" role="group" aria-label="Content">
          {TEST_CONTENT.map((c) => (
            <button type="button" key={c.id} className={content.id === c.id ? "is-on" : ""} onClick={() => { setContent(c); restart(); }}>
              {c.label}
            </button>
          ))}
        </div>
        <span className="ty-options__best">
          Best {seconds < 60 ? `${seconds}s` : `${seconds / 60} min`}: <strong>{Math.round(profile.bests[`test${seconds}`] || 0)} WPM</strong>
        </span>
      </div>
      {!result ? (
        <TypingDrill
          key={`${seed}-${seconds}`}
          text={text}
          mode="free"
          guide={resolveGuide(guidePref, "blind")}
          timeLimit={seconds}
          theme="focus"
          subtitle="The clock starts on your first key. Backspace fixes mistakes — but every error still counts against accuracy."
          onFinish={onFinish}
          onRestart={restart}
        />
      ) : (
        <ResultsCard stats={result.stats} run={result.run} outcome={result.outcome} onRetry={restart} onNext={restart} nextLabel="New test" />
      )}
    </div>
  );
}

/* ── PRACTICE ─────────────────────────────────────────────────────────── */

const DRILLS = [
  { id: "weak", label: "Weak keys", icon: "fas fa-crosshairs", desc: "Built from the keys you miss most. Adapts as you improve." },
  { id: "data", label: "Data entry", icon: "fas fa-table", desc: "Emails, phone numbers, invoices, dates and addresses." },
  { id: "code", label: "Code", icon: "fas fa-code", desc: "Real snippets in JavaScript, Python, SQL, C++ and more." },
  { id: "symbols", label: "Symbols", icon: "fas fa-at", desc: "Every shifted symbol on the keyboard." },
  { id: "numbers", label: "Numbers", icon: "fas fa-hashtag", desc: "Prices, percentages and dates." },
  { id: "custom", label: "Your own text", icon: "fas fa-paste", desc: "Paste anything — a report, an essay, your CV." },
];

function PracticeView({ guidePref, record, profile, initial }) {
  const [drill, setDrill] = useState(DRILLS.find((d) => d.id === initial) || null);
  const [lang, setLang] = useState("javascript");
  const [strict, setStrict] = useState(true);
  const [custom, setCustom] = useState("");
  const [seed, setSeed] = useState(() => Date.now());
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(Boolean(initial));

  const weak = useMemo(() => weakestKeys(profile.keyStats, 6).map((w) => w.ch), [profile.keyStats]);

  const text = useMemo(() => {
    if (!drill) return "";
    const r = rng(seed);
    switch (drill.id) {
      case "weak":
        return weakKeyDrill(r, weak);
      case "data":
        return Array.from({ length: 6 }, () => dataEntryLine(r)).join(" ");
      case "code":
        return codeSnippets(r, lang);
      case "symbols":
        return symbolDrill(r, [..."!@#$%^&*()-_=+[]{}\\|;:'\",.<>/?`~"], 220);
      case "numbers":
        return numberStream(r, 40);
      case "custom":
        return custom
          .replace(/[‘’]/g, "'")
          .replace(/[“”]/g, '"')
          .replace(/[–—]/g, "-")
          .replace(/\r/g, "")
          .replace(/\t/g, "  ")
          .replace(/[^\x20-\x7e\n]/g, "")
          .replace(/\n{2,}/g, "\n")
          .trim()
          .slice(0, 3000);
      default:
        return "";
    }
  }, [drill, seed, lang, weak, custom]);

  const restart = () => {
    setSeed(Date.now());
    setResult(null);
    setRunning(true);
  };

  const onFinish = (stats, run) => {
    const outcome = record({ mode: "practice", stats, keys: keyResults(run) });
    setResult({ stats, run, outcome });
  };

  if (!drill || !running) {
    return (
      <div className="ty-practice">
        <div className="ty-drills">
          {DRILLS.map((d) => (
            <button type="button" key={d.id} className={`ty-mode ty-mode--light ${drill?.id === d.id ? "is-on" : ""}`} onClick={() => setDrill(d)}>
              <i className={d.icon} aria-hidden="true" />
              <strong>{d.label}</strong>
              <span>{d.desc}</span>
            </button>
          ))}
        </div>

        {drill && (
          <div className="ty-card ty-practice__setup">
            {drill.id === "weak" && (
              <p>
                {weak.length ? (
                  <>Focusing on: {weak.map((c) => <kbd key={c}>{charLabel(c)}</kbd>)}</>
                ) : (
                  "Not enough data yet — this will start with common words and learn your weak keys as you type."
                )}
              </p>
            )}
            {drill.id === "code" && (
              <div className="ty-seg ty-seg--inline" role="group" aria-label="Language">
                {CODE_LANGS.map((l) => (
                  <button type="button" key={l.id} className={lang === l.id ? "is-on" : ""} onClick={() => setLang(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
            {drill.id === "custom" && (
              <textarea
                className="ty-custom"
                rows={6}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Paste or write the text you want to practise…"
                maxLength={5000}
              />
            )}
            <label className="ty-switch">
              <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} />
              <span>Stop on errors (recommended while learning)</span>
            </label>
            <button
              type="button"
              className="ac-btn ac-btn--primary ac-btn--lg"
              disabled={drill.id === "custom" && custom.trim().length < 10}
              onClick={restart}
            >
              <i className="fas fa-play" aria-hidden="true" /> Start
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ty-practice">
      <div className="ty-crumbs">
        <button type="button" className="ty-link" onClick={() => { setRunning(false); setResult(null); }}>
          <i className="fas fa-arrow-left" aria-hidden="true" /> Practice
        </button>
        <span>{drill.label}</span>
      </div>
      {!result ? (
        <TypingDrill
          key={seed}
          text={text || "practice makes progress"}
          mode={strict ? "strict" : "free"}
          autoIndent={drill.id === "code"}
          guide={resolveGuide(guidePref, "hint")}
          theme="focus"
          onFinish={onFinish}
          onRestart={restart}
        />
      ) : (
        <ResultsCard stats={result.stats} run={result.run} outcome={result.outcome} onRetry={restart} onNext={restart} nextLabel="New drill" />
      )}
    </div>
  );
}

/* ── ARCADE ───────────────────────────────────────────────────────────── */

function ArcadeView({ profile, onPlay }) {
  return (
    <div className="ty-arcade">
      <button type="button" className="ty-gamecard ty-gamecard--rain" onClick={() => onPlay("rain")}>
        <span className="ty-gamecard__art" aria-hidden="true">
          <i className="fas fa-meteor" />
          <i className="fas fa-meteor" />
          <i className="fas fa-city" />
        </span>
        <span className="ty-gamecard__body">
          <strong>Word Rain</strong>
          <span>Meteors carry words toward your city. Type them to fire. Waves, combos, power-ups and bosses — with music that speeds up as you do.</span>
          <small>
            Best {profile.bests.rainScore.toLocaleString()} · wave {profile.bests.rainWave}
          </small>
        </span>
        <span className="ac-btn ac-btn--primary">
          Play <i className="fas fa-play" aria-hidden="true" />
        </span>
      </button>
      <button type="button" className="ty-gamecard ty-gamecard--race" onClick={() => onPlay("race")}>
        <span className="ty-gamecard__art" aria-hidden="true">
          <i className="fas fa-car-side" />
          <i className="fas fa-ghost" />
          <i className="fas fa-flag-checkered" />
        </span>
        <span className="ty-gamecard__body">
          <strong>Ghost Race</strong>
          <span>Race three bots and the ghost of your best run across a passage. Four leagues, from Rookie to Elite.</span>
          <small>
            Best {Math.round(profile.bests.raceWpm)} WPM · {profile.raceWins} wins
          </small>
        </span>
        <span className="ac-btn ac-btn--primary">
          Race <i className="fas fa-play" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
