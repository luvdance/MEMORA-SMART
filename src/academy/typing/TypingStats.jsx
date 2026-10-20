import LineChart from "./LineChart";
import VirtualKeyboard from "./VirtualKeyboard";
import { ACHIEVEMENTS } from "./achievements.js";
import { speedTier, weakestKeys, VERIFIED_ACCURACY } from "./engine.js";
import { charLabel } from "./keyboard.js";

/**
 * The typing record: where you are, how you got here, and what to fix.
 * Every number is read from the stored profile; nothing is estimated.
 */

const MODE_LABEL = {
  lesson: "Lesson",
  test15: "15s test",
  test30: "30s test",
  test60: "60s test",
  test120: "2 min test",
  practice: "Practice",
  rain: "Word Rain",
  race: "Race",
};

function duration(ms) {
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default function TypingStats({ profile, onPractiseWeak }) {
  const tier = speedTier(profile.bestVerifiedWpm);
  const recent = profile.history.slice(-10);
  const avg = (key) => (recent.length ? Math.round(recent.reduce((n, r) => n + r[key], 0) / recent.length) : 0);
  const weak = weakestKeys(profile.keyStats, 8);
  const history = profile.history.slice(-30);
  const earned = new Set(profile.achievements);

  return (
    <div className="ty-statsview">
      <div className="ty-tiles">
        <div className="ty-tile ty-tile--feature">
          <span>Verified speed</span>
          <strong>{Math.round(profile.bestVerifiedWpm)} <small>WPM</small></strong>
          <em>{tier.name}</em>
          <p>{tier.note}</p>
        </div>
        <div className="ty-tile">
          <span>Last 10 runs</span>
          <strong>{avg("wpm")} <small>WPM</small></strong>
          <em>{avg("acc")}% accuracy</em>
        </div>
        <div className="ty-tile">
          <span>Practice time</span>
          <strong>{duration(profile.totalMs)}</strong>
          <em>{profile.sessions} sessions</em>
        </div>
        <div className="ty-tile">
          <span>Correct keys</span>
          <strong>{profile.totalKeys.toLocaleString()}</strong>
          <em>best combo {profile.bests.combo}</em>
        </div>
        <div className="ty-tile">
          <span>Streak</span>
          <strong>{profile.streak.current || 0} <small>days</small></strong>
          <em>longest {profile.streak.longest || 0}</em>
        </div>
      </div>

      <div className="ty-card">
        <h3 className="ty-card__title">Speed over your last {history.length} runs</h3>
        {history.length >= 2 ? (
          <LineChart
            points={history.map((h, i) => ({
              x: i + 1,
              y: Math.round(h.wpm),
              label: `${MODE_LABEL[h.mode] || h.mode} · ${new Date(h.at).toLocaleDateString()}`,
              sub: `${h.acc}% accuracy`,
            }))}
            formatX={(x) => `#${x}`}
            ariaLabel={`Words per minute across your last ${history.length} runs`}
          />
        ) : (
          <p className="ty-chart__empty">Finish two runs to see your trend.</p>
        )}
      </div>

      <div className="ty-card">
        <h3 className="ty-card__title">Where your mistakes are</h3>
        <p className="ty-card__sub">Darker keys are missed more often. Hover a key for its error rate.</p>
        <VirtualKeyboard heat={profile.keyStats} highlight={false} />
        {weak.length > 0 ? (
          <>
            <table className="ty-table">
              <thead>
                <tr><th>Key</th><th>Error rate</th><th>Avg reaction</th><th>Presses</th></tr>
              </thead>
              <tbody>
                {weak.map((w) => (
                  <tr key={w.ch}>
                    <td><kbd>{charLabel(w.ch)}</kbd></td>
                    <td>{(w.errorRate * 100).toFixed(1)}%</td>
                    <td>{Math.round(w.avgMs)} ms</td>
                    <td>{w.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="ac-btn ac-btn--primary" onClick={onPractiseWeak}>
              <i className="fas fa-crosshairs" aria-hidden="true" /> Practise these keys
            </button>
          </>
        ) : (
          <p className="ty-chart__empty">Type a little more and your weakest keys will show here.</p>
        )}
      </div>

      <div className="ty-card">
        <h3 className="ty-card__title">Personal bests</h3>
        <dl className="ty-bests">
          <div><dt>15s test</dt><dd>{Math.round(profile.bests.test15)} WPM</dd></div>
          <div><dt>30s test</dt><dd>{Math.round(profile.bests.test30)} WPM</dd></div>
          <div><dt>60s test</dt><dd>{Math.round(profile.bests.test60)} WPM</dd></div>
          <div><dt>2 min test</dt><dd>{Math.round(profile.bests.test120)} WPM</dd></div>
          <div><dt>Word Rain</dt><dd>{profile.bests.rainScore.toLocaleString()} pts · wave {profile.bests.rainWave}</dd></div>
          <div><dt>Race</dt><dd>{Math.round(profile.bests.raceWpm)} WPM · {profile.raceWins} wins</dd></div>
        </dl>
        <p className="ty-card__sub">Test bests count at 90%+ accuracy. Verified speed needs 60s+ at {VERIFIED_ACCURACY}%+.</p>
      </div>

      <div className="ty-card">
        <h3 className="ty-card__title">
          Achievements <small>{earned.size} of {ACHIEVEMENTS.length}</small>
        </h3>
        <div className="ty-achs">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.id} className={`ty-ach ${earned.has(a.id) ? "is-earned" : "is-locked"}`}>
              <i className={earned.has(a.id) ? a.icon : "fas fa-lock"} aria-hidden="true" />
              <div>
                <strong>{a.name}</strong>
                <span>{a.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
