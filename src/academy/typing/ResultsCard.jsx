import { useEffect } from "react";
import LineChart from "./LineChart";
import { ACHIEVEMENTS } from "./achievements.js";
import { isVerifiedRun, speedTier, weakestKeys, wpmTimeline, keyResults } from "./engine.js";
import { charLabel } from "./keyboard.js";
import { sound } from "./music.js";

/**
 * The scorecard after any run. It always names the ONE thing to work on
 * next — the worst key — because a list of numbers is not advice.
 */
export default function ResultsCard({ stats, run, outcome, stars, target, passed, onRetry, onNext, nextLabel, extra }) {
  const timeline = run ? wpmTimeline(run) : [];
  const weak = run ? weakestKeys(keyResults(run), 3, 3).filter((w) => w.errorRate > 0) : [];
  const verified = isVerifiedRun(stats);
  const tier = speedTier(stats.wpm);

  useEffect(() => {
    if (stars) sound().star(stars);
    if (outcome?.levelUp) setTimeout(() => sound().levelUp(), 900);
  }, [stars, outcome]);

  const seconds = Math.round(stats.ms / 1000);

  return (
    <section className="ty-results">
      {stars !== undefined && (
        <div className={`ty-results__stars ${passed ? "" : "is-failed"}`} aria-label={`${stars} of 3 stars`}>
          {[1, 2, 3].map((n) => (
            <i key={n} className={`fas fa-star ${n <= stars ? "is-on" : ""}`} style={{ animationDelay: `${0.25 + n * 0.28}s` }} aria-hidden="true" />
          ))}
          <p>
            {passed
              ? stars === 3
                ? "Perfect — fast and accurate."
                : `Passed. ${stars === 1 ? `Reach ${target} WPM at 97% accuracy for three stars.` : "One more push for three stars."}`
              : "Not yet — this lesson needs 90% accuracy. Slow down; accuracy comes first."}
          </p>
        </div>
      )}

      <div className="ty-results__grid">
        <div className="ty-results__big">
          <span>WPM</span>
          <strong>{Math.round(stats.wpm)}</strong>
        </div>
        <div className="ty-results__big">
          <span>Accuracy</span>
          <strong>{stats.accuracy}%</strong>
        </div>
        <dl className="ty-results__small">
          <div><dt>Raw</dt><dd>{Math.round(stats.raw)}</dd></div>
          <div><dt>Consistency</dt><dd>{stats.consistency}%</dd></div>
          <div><dt>Errors</dt><dd>{stats.errors}</dd></div>
          <div><dt>Best combo</dt><dd>{stats.bestCombo}</dd></div>
          <div><dt>Characters</dt><dd>{stats.correctChars}</dd></div>
          <div><dt>Time</dt><dd>{seconds}s</dd></div>
        </dl>
      </div>

      {extra}

      <div className="ty-results__tier">
        {verified ? (
          <span className="ty-pill ty-pill--good">
            <i className="fas fa-circle-check" aria-hidden="true" /> Verified speed: {tier.name}
          </span>
        ) : (
          <span className="ty-pill">
            <i className="fas fa-circle-info" aria-hidden="true" /> Speed level counts on 60s+ tests at 95%+ accuracy
          </span>
        )}
        {outcome && (
          <span className="ty-pill ty-pill--xp">
            <i className="fas fa-bolt" aria-hidden="true" /> +{outcome.xp} typing XP
          </span>
        )}
        {outcome?.newBest && (
          <span className="ty-pill ty-pill--best">
            <i className="fas fa-crown" aria-hidden="true" /> New personal best
          </span>
        )}
        {outcome?.levelUp && (
          <span className="ty-pill ty-pill--level">
            <i className="fas fa-arrow-up" aria-hidden="true" /> Level {outcome.levelUp.level} — {outcome.levelUp.title}
          </span>
        )}
      </div>

      {outcome?.newAchievements?.length > 0 && (
        <div className="ty-results__ach">
          {outcome.newAchievements.map((id) => {
            const a = ACHIEVEMENTS.find((x) => x.id === id);
            return (
              <div className="ty-ach is-new" key={id}>
                <i className={a.icon} aria-hidden="true" />
                <div>
                  <strong>Achievement unlocked: {a.name}</strong>
                  <span>{a.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {timeline.length > 2 && (
        <div className="ty-card">
          <h3 className="ty-card__title">Speed through the run</h3>
          <LineChart
            points={timeline.map((t) => ({ x: t.second, y: t.wpm, label: `${t.second}s`, sub: `burst ${t.burst} WPM` }))}
            marks={timeline.map((t) => ({ x: t.second, n: t.errors }))}
            formatX={(x) => `${x}s`}
            ariaLabel={`Words per minute over ${timeline.length} seconds, ending at ${Math.round(stats.wpm)}`}
          />
        </div>
      )}

      {weak.length > 0 && (
        <p className="ty-results__advice">
          <i className="fas fa-lightbulb" aria-hidden="true" /> Work on{" "}
          {weak.map((w, i) => (
            <span key={w.ch}>
              {i > 0 && (i === weak.length - 1 ? " and " : ", ")}
              <kbd>{charLabel(w.ch)}</kbd>
            </span>
          ))}
          {" "}— the Weak Keys practice builds a drill from exactly these.
        </p>
      )}

      <div className="ty-results__actions">
        <button type="button" className="ac-btn ac-btn--ghost ac-btn--lg" onClick={onRetry}>
          <i className="fas fa-rotate-right" aria-hidden="true" /> Try again
        </button>
        {onNext && (
          <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" onClick={onNext} autoFocus>
            {nextLabel || "Next"} <i className="fas fa-arrow-right" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
