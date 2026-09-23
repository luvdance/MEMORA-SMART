import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordAssessment } from "../services/academyService";
import { ERROR_CODES, reportError } from "../services/errors";

/**
 * ASSESSMENT PANEL
 *
 * Questions come from /api/academy/assessment, which never sends the answer
 * key. The same endpoint grades the submission. Nothing in this component —
 * or anywhere in the bundle — knows which option is correct.
 *
 * Failure is written to be survivable: no penalty, no attempt limit, and the
 * feedback names the exact atom to reopen rather than saying "incorrect".
 */
export default function AssessmentPanel({
  lesson,
  slug,
  user,
  alreadyPassed,
  allAtomsDone,
  nextLesson,
  onReviewAtom,
  onBackToAtoms,
  onPassed,
  flash,
}) {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | grading | done | error
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    let alive = true;
    setState("loading");

    // No seed: the server picks a fresh random one, so the option order is
    // different on every attempt. Sending `attempt` here would pin the order
    // and let a learner memorise positions instead of answers.
    fetch(`/api/academy/assessment?lessonId=${encodeURIComponent(lesson.id)}`)
      .then(async (res) => {
        // The API's own message describes the request, not the learner's
        // situation ("lessonId is required"), so it is logged and discarded
        // rather than shown. The status is what tells us how to classify it.
        if (!res.ok) {
          const failure = new Error("assessment-load-failed");
          failure.code = res.status === 404 ? "not-found" : "unavailable";
          throw failure;
        }
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        setQuestions(data);
        setState("ready");
      })
      .catch((err) => {
        if (!alive) return;
        setError(reportError("assessment:load", err, ERROR_CODES.UNAVAILABLE));
        setState("error");
      });

    return () => {
      alive = false;
    };
  }, [lesson.id, attempt]);

  async function submit() {
    setState("grading");
    try {
      const res = await fetch("/api/academy/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, answers }),
      });
      if (!res.ok) {
        const failure = new Error("assessment-grade-failed");
        failure.code = res.status === 404 ? "not-found" : "unavailable";
        throw failure;
      }

      const graded = await res.json();
      setResult(graded);
      setState("done");

      const saved = await recordAssessment(user, slug, lesson.id, graded);
      if (saved.xpAwarded) flash(`+${saved.xpAwarded} XP`);
      if (saved.leveledUp) flash(`Level up — ${saved.newLevel.name}!`, "fas fa-star");
      if (graded.passed) onPassed?.(graded);
    } catch (err) {
      setError(reportError("assessment:grade", err, ERROR_CODES.UNAVAILABLE));
      setState("error");
    }
  }

  function retry() {
    setAnswers({});
    setResult(null);
    setAttempt((n) => n + 1);
  }

  /* ── Already passed on a previous visit ──────────────────────────── */
  if (alreadyPassed && !result) {
    return (
      <div className="ac-assess">
        <div className="ac-assess__banner ac-assess__banner--pass">
          <i className="fas fa-circle-check" aria-hidden="true" />
          <div>
            <strong>You have already passed this lesson</strong>
            <span>Your progress is saved. You can move on or review the atoms.</span>
          </div>
        </div>
        <div className="ac-assess__actions">
          <button className="ac-btn ac-btn--ghost" onClick={onBackToAtoms}>
            Review the atoms
          </button>
          {nextLesson ? (
            <button
              className="ac-btn ac-btn--primary ac-btn--lg"
              onClick={() => navigate(`/academy/learn/${slug}/${nextLesson.id}`)}
            >
              Next lesson
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </button>
          ) : (
            <button
              className="ac-btn ac-btn--primary ac-btn--lg"
              onClick={() => navigate("/academy/learn")}
            >
              Back to My Learning
            </button>
          )}
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="ac-boot ac-boot--inline">
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <p>Loading the knowledge check…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="ac-assess">
        <div className="ac-assess__banner ac-assess__banner--fail">
          <i className="fas fa-triangle-exclamation" aria-hidden="true" />
          <div>
            <strong>{error?.title || "The knowledge check could not load"}</strong>
            <span>{error?.message}</span>
          </div>
        </div>
        <p className="ac-body ac-body--muted">
          Nothing you have completed is lost. Your atoms and any earlier passes
          on this lesson are saved.
        </p>
        <button className="ac-btn ac-btn--ghost" onClick={() => setAttempt((n) => n + 1)}>
          Try again
        </button>
        <span className="ac-assess__code">Reference {error?.code}</span>
      </div>
    );
  }

  /* ── Result ──────────────────────────────────────────────────────── */
  if (state === "done" && result) {
    return (
      <div className="ac-assess">
        <div
          className={`ac-assess__banner ${
            result.passed ? "ac-assess__banner--pass" : "ac-assess__banner--retry"
          }`}
        >
          <span className="ac-assess__score">{result.score}%</span>
          <div>
            <strong>
              {result.passed
                ? "Passed — the next lesson is unlocked"
                : "You're close. Review and try again."}
            </strong>
            <span>
              {result.correctCount} of {result.total} correct · {result.passMark}% needed
            </span>
          </div>
        </div>

        {!result.passed && result.conceptsToReview.length > 0 && (
          <div className="ac-review">
            <span className="ac-note__label">Concepts to review</span>
            <div className="ac-review__chips">
              {result.conceptsToReview.map((atomId) => {
                const atom = lesson.atoms.find((a) => a.id === atomId);
                if (!atom) return null;
                return (
                  <button key={atomId} onClick={() => onReviewAtom(atomId)}>
                    <i className="fas fa-rotate-left" aria-hidden="true" />
                    {atom.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <ol className="ac-results">
          {result.results.map((r) => (
            <li
              key={r.questionId}
              className={r.isCorrect ? "is-correct" : "is-wrong"}
            >
              <div className="ac-results__head">
                <i
                  className={r.isCorrect ? "fas fa-check" : "fas fa-xmark"}
                  aria-hidden="true"
                />
                <p>{r.prompt}</p>
              </div>

              {!r.isCorrect && (
                <p className="ac-results__yours">
                  <span>Your answer</span> {r.yourAnswer || "No answer"}
                </p>
              )}
              <p className="ac-results__correct">
                <span>Correct answer</span> {r.correctAnswer}
              </p>

              <p className="ac-results__why">{r.explanation}</p>

              {r.whyYoursWasWrong && (
                <p className="ac-results__wrong">{r.whyYoursWasWrong}</p>
              )}
            </li>
          ))}
        </ol>

        <div className="ac-assess__actions">
          {!result.passed && (
            <>
              <button className="ac-btn ac-btn--ghost" onClick={onBackToAtoms}>
                Re-read the lesson
              </button>
              <button className="ac-btn ac-btn--primary ac-btn--lg" onClick={retry}>
                Try again
                <i className="fas fa-rotate-right" aria-hidden="true" />
              </button>
            </>
          )}

          {result.passed &&
            (nextLesson ? (
              <button
                className="ac-btn ac-btn--primary ac-btn--lg"
                onClick={() => navigate(`/academy/learn/${slug}/${nextLesson.id}`)}
              >
                Next lesson: {nextLesson.title}
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            ) : (
              <button
                className="ac-btn ac-btn--primary ac-btn--lg"
                onClick={() => navigate("/academy/learn")}
              >
                Back to My Learning
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            ))}
        </div>
      </div>
    );
  }

  /* ── Questions ───────────────────────────────────────────────────── */
  const answeredCount = Object.keys(answers).length;
  const ready = answeredCount === questions.questionCount;

  return (
    <div className="ac-assess">
      <header className="ac-assess__head">
        <span className="ac-kicker">Knowledge check</span>
        <h1 className="ac-assess__title">{lesson.title}</h1>
        <p className="ac-body ac-body--muted">
          {questions.questionCount} questions · {questions.passMark}% to pass ·
          unlimited retries, no penalty
        </p>
        {!allAtomsDone && (
          <p className="ac-assess__hint">
            <i className="fas fa-circle-info" aria-hidden="true" />
            You have not finished every atom yet. You can still take the check.
          </p>
        )}
      </header>

      <ol className="ac-questions">
        {questions.questions.map((q, i) => (
          <li key={q.id}>
            <p className="ac-questions__prompt">
              <span>{i + 1}</span>
              {q.prompt}
            </p>
            <div className="ac-options">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className={`ac-option ${answers[q.id] === o.id ? "is-picked" : ""}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === o.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="ac-assess__actions">
        <button className="ac-btn ac-btn--ghost" onClick={onBackToAtoms}>
          Back to the lesson
        </button>
        <button
          className="ac-btn ac-btn--primary ac-btn--lg"
          disabled={!ready || state === "grading"}
          onClick={submit}
        >
          {state === "grading"
            ? "Marking…"
            : ready
            ? "Submit answers"
            : `${answeredCount} of ${questions.questionCount} answered`}
        </button>
      </div>
    </div>
  );
}
