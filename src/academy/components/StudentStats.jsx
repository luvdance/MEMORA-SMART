import { BADGES, getLevel } from "../data/gamification";

/**
 * The gamification strip: level, XP, streak, mastery counts.
 *
 * Level names are the course's own levels — Novice through Professional — so
 * the progress bar is a statement about competence, not an arcade score.
 */
export default function StudentStats({ student, showBadges = true }) {
  if (!student) return null;

  const level = getLevel(student.xp || 0);
  const streak = student.streak || {};
  const earned = new Set(student.badges || []);

  return (
    <section className="ac-stats">
      <div className="ac-stats__row">
        <div className="ac-stat-tile ac-stat-tile--level">
          <span className="ac-stat-tile__label">Level {level.level}</span>
          <strong className="ac-stat-tile__value">{level.name}</strong>
          <div className="ac-levelbar">
            <div
              className="ac-levelbar__fill"
              style={{ width: `${level.percentToNext}%` }}
            />
          </div>
          <span className="ac-stat-tile__sub">
            {level.next
              ? `${level.xpForNextLevel} XP to ${level.next.name}`
              : "Top level reached"}
          </span>
        </div>

        <div className="ac-stat-tile">
          <i className="fas fa-bolt" aria-hidden="true" />
          <strong className="ac-stat-tile__value">{student.xp || 0}</strong>
          <span className="ac-stat-tile__label">XP earned</span>
        </div>

        <div className="ac-stat-tile">
          <i className="fas fa-fire" aria-hidden="true" />
          <strong className="ac-stat-tile__value">{streak.current || 0}</strong>
          <span className="ac-stat-tile__label">Day streak</span>
          {streak.freezes > 0 && (
            <span className="ac-stat-tile__sub">
              <i className="fas fa-snowflake" aria-hidden="true" /> {streak.freezes}{" "}
              freeze{streak.freezes > 1 ? "s" : ""} held
            </span>
          )}
        </div>

        <div className="ac-stat-tile">
          <i className="fas fa-cube" aria-hidden="true" />
          <strong className="ac-stat-tile__value">{student.atomsCompleted || 0}</strong>
          <span className="ac-stat-tile__label">Atoms mastered</span>
        </div>

        <div className="ac-stat-tile">
          <i className="fas fa-clipboard-check" aria-hidden="true" />
          <strong className="ac-stat-tile__value">
            {student.assessmentsPassed || 0}
          </strong>
          <span className="ac-stat-tile__label">Assessments passed</span>
        </div>
      </div>

      {showBadges && (
        <div className="ac-badges">
          {BADGES.map((badge) => {
            const has = earned.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`ac-badge ${has ? "is-earned" : ""}`}
                title={badge.description}
              >
                <i className={badge.icon} aria-hidden="true" />
                <span>{badge.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
