import { useState } from "react";
import { Link } from "react-router-dom";
import BetaBadge from "./BetaBadge";
import CertificateCard from "./CertificateCard";
import { BETA_NOTE } from "../data/catalog";
import { CERTIFICATION_COPY, certificationState } from "../data/certification";

/**
 * ONE COURSE ON THE PROFILE — A DISCLOSURE
 *
 * ── WHAT THIS IS ─────────────────────────────────────────────────────────
 * The course record exactly as it was, with a toggle on it. Nothing else
 * changed: same summary, same progress bar, same lesson table, same columns.
 *
 * An earlier attempt replaced the table with a "journey" view — months, then
 * modules, then lessons on a vertical rail, with coloured state pills, a
 * coloured icon tile and four differently-tinted certification panels. It was
 * worse than what it replaced. The table answers "what have I done and what
 * is left" in one glance across five columns; the journey buried the same
 * information in three levels of nesting, and the colour carried no meaning
 * it had not already been given by the status chip.
 *
 * ── THE PATTERN ──────────────────────────────────────────────────────────
 * A standard disclosure, the way course platforms build them:
 *
 *   The header stays visually identical open or closed. No colour change, no
 *   border change — only a hover tint and the chevron rotating. A header that
 *   restyles itself when opened makes the page feel like it jumped.
 *
 *   Everything needed to decide whether to open it stays visible when closed:
 *   the title, the percentage and the progress bar. So a learner sees how far
 *   they have gone without expanding anything, and expands only to see what
 *   is left.
 *
 *   The panel is the same card, below a hairline, at the same padding. It is
 *   not a nested card and it introduces no new visual language.
 */
export default function CourseRecord({
  courseId,
  entry,
  lessons,
  outline,
  progress,
  completedLessons,
  percent,
  certificate,
  examAttempts = [],
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  const completed = completedLessons || [];
  const cert = certificationState({
    courseId,
    certificate,
    outline,
    progressByLesson: progress,
  });

  const panelId = `ac-record-${courseId}`;
  const hasPending = (outline || []).some((m) => m.modules.some((mod) => !mod.ready));

  return (
    <article className={`ac-record ac-record--collapsible ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="ac-record__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="ac-record__head">
          <span>
            <h3>
              {entry.title}
              <BetaBadge beta={entry.beta} note={BETA_NOTE} />
            </h3>
            <p>{entry.subtitle}</p>
          </span>
          <span className="ac-record__percent">
            <strong>{percent}%</strong>
            <span>
              {completed.length} of {lessons.length} lessons
            </span>
          </span>
        </span>

        {/* Visible whether open or closed. How far they have gone is the
            question the collapsed row exists to answer. */}
        <span className="ac-resume__bar">
          <span className="ac-resume__fill" style={{ width: `${percent}%` }} />
        </span>

        <span className="ac-record__more">
          {open ? "Hide lessons" : "Show lessons"}
          <i className="fas fa-chevron-down" aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div className="ac-record__panel" id={panelId}>
          {/* Wrapped so the table can scroll on a phone with a visible edge
              fade. Five columns do not fit 390px, and a clipped table with no
              affordance reads as broken rather than as scrollable. */}
          <div className="ac-record__tablewrap">
            <table className="ac-record__table">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Atoms</th>
                <th>Attempts</th>
                <th>Best score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => {
                const p = progress?.[lesson.id];
                const atoms = p?.atomsCompleted?.length || 0;
                const a = p?.assessment;
                const status = a?.passed
                  ? "Passed"
                  : a?.attempts
                  ? "Not yet passed"
                  : atoms > 0
                  ? "In progress"
                  : "Not started";

                return (
                  <tr key={lesson.id}>
                    <td>
                      <Link to={`/academy/learn/${courseId}/${lesson.id}`}>
                        {lesson.title}
                      </Link>
                      <em>{lesson.moduleTitle}</em>
                    </td>
                    <td>
                      {atoms}/{lesson.atoms.length}
                    </td>
                    <td>{a?.attempts || 0}</td>
                    <td>
                      {typeof a?.bestScore === "number" ? `${a.bestScore}%` : "—"}
                    </td>
                    <td>
                      <span
                        className={`ac-recordstatus ac-recordstatus--${status
                          .toLowerCase()
                          .replace(/[^a-z]+/g, "-")}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {hasPending && (
            <p className="ac-record__pending">
              <i className="fas fa-circle-info" aria-hidden="true" />
              Later modules of this programme are still being written. Your
              progress is measured against the lessons published so far.
            </p>
          )}

          <Certification cert={cert} entry={entry} examAttempts={examAttempts} />
        </div>
      )}
    </article>
  );
}

/**
 * Certification, for this course.
 *
 * Inside the course it certifies, because a certificate belongs to an
 * enrolment — a student on two courses has two independent states, and one
 * shared line further down the page could not have described both.
 *
 * Styled with the existing quiet status block rather than a tinted panel per
 * state. The state is carried by the heading and the words; colour is spent
 * only on the one thing that is actionable, which is the button.
 */
function Certification({ cert, entry, examAttempts }) {
  const copy = CERTIFICATION_COPY[cert.state];

  return (
    <div className="ac-certstatus ac-certstatus--nested">
      <i
        className={`fas fa-${
          cert.state === "certified"
            ? "award"
            : cert.state === "ready"
            ? "file-pen"
            : cert.state === "locked"
            ? "lock"
            : "hourglass-half"
        }`}
        aria-hidden="true"
      />
      <div>
        <strong>{copy.heading}</strong>

        {cert.state === "certified" && <CertificateCard certificate={cert.certificate} />}

        {cert.state === "ready" && (
          <>
            <p>
              You have passed every module this exam covers. The paper is{" "}
              {cert.exam.questionCount} questions in {cert.exam.durationMinutes}{" "}
              minutes, built from real company case studies. {cert.exam.passMark}%
              overall passes, with at least {cert.exam.domainMinimum}% in every
              section, and every paper is generated for the candidate so a
              retake is a new exam.
            </p>
            <Link className="ac-btn ac-btn--primary" to={cert.exam.path}>
              Sit the certification exam
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </Link>
          </>
        )}

        {cert.state === "locked" && (
          <>
            <p>
              The exam certifies the whole of {entry.title}, so it opens once
              you have passed every module it covers. There is no waiting
              period — it unlocks the moment you finish.
            </p>
            <p className="ac-certstatus__count">
              {cert.doneCount} of {cert.requiredCount} required modules passed
              {cert.outstanding.length > 0 && (
                <>
                  {" · still to pass: "}
                  <span>{cert.outstanding.join(", ")}</span>
                </>
              )}
            </p>
          </>
        )}

        {cert.state === "unavailable" && (
          <p>
            There is no certification exam for {entry.title} yet. This is about
            us, not about you: an exam has to be written and validated before it
            can certify anything. Your progress is recorded against your Memora
            ID and will count towards it when the exam opens.
          </p>
        )}

        {examAttempts.length > 0 && (
          <table className="ac-record__table ac-certstatus__attempts">
            <thead>
              <tr>
                <th>Exam attempt</th>
                <th>Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {examAttempts.map((a, i) => (
                <tr key={a.id}>
                  <td>
                    Attempt {examAttempts.length - i}
                    {a.submittedAt?.toDate && (
                      <em>{a.submittedAt.toDate().toLocaleDateString()}</em>
                    )}
                  </td>
                  <td>{a.score}%</td>
                  <td>
                    <span
                      className={`ac-recordstatus ac-recordstatus--${
                        a.passed ? "passed" : "not-yet-passed"
                      }`}
                    >
                      {a.passed
                        ? "Passed"
                        : a.verdict === "domain-floor"
                        ? "A section below minimum"
                        : "Not passed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
