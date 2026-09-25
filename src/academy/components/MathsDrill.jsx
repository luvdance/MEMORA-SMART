import { useCallback, useEffect, useState } from "react";
import MathsAnswer from "./MathsAnswer";
import MathsVisual from "./MathsVisual";
import {
  fetchDrill,
  fetchHint,
  fetchReview,
  fetchScaffold,
  fetchTwin,
  gradeItem,
  gradeScaffoldStep,
} from "../services/mathsApi";

/**
 * THE MATHS DRILL — a graded atom-level practice, like every other exercise
 * in the Academy, with one difference that matters.
 *
 * It sits in a lesson exactly where ExcelGrid's `exercise` sits in Data
 * Analysis or FirewallSim's `firewallExercise` sits in Cybersecurity: the atom
 * does not advance until it is solved. `onSolved` is the same contract.
 *
 * ── THE DIFFERENCE: A WRONG ANSWER IS NOT A DEAD END ─────────────────────
 * Maths questions are GENERATED, so this component can do something a fixed
 * exercise cannot. A wrong answer starts a loop with exactly one exit — a
 * correct answer to a question the student has not seen before:
 *
 *   wrong ──▶ the misconception NAMED, not just marked
 *          ──▶ the full worked solution
 *          ──▶ a TWIN: same skill, different numbers, must be answered
 *                 │
 *                 ├─ right ──▶ cleared
 *                 └─ wrong ──▶ SCAFFOLD: the problem cut into single checked
 *                              steps, then another twin ──▶ and round again
 *
 * There is no skip and no reveal-the-answer button. Re-showing the same item
 * after revealing its solution measures whether the student can copy from the
 * screen above; a twin measures whether they learned the method.
 *
 * ── HINTS ────────────────────────────────────────────────────────────────
 * Three rungs, fetched one at a time: a nudge, the method, the first worked
 * step. Taking one is not a penalty and is never described as one.
 *
 * ── PROPS ────────────────────────────────────────────────────────────────
 *   skill     the skill code to drill, e.g. "L1-N3.1"
 *   review    instead of `skill`: a list of earlier skill codes, one question
 *             each — this is the course's interleaving
 *   kind      "build" (default), "stretch" or "exam"
 *   count     how many questions must be cleared. Default 3.
 *   intro     a line of framing shown above the first question
 */
export default function MathsDrill({
  skill,
  review,
  kind = "build",
  count = 3,
  intro,
  alreadySolved,
  onSolved,
}) {
  const [set, setSet] = useState(null);
  const [position, setPosition] = useState(0);
  const [state, setState] = useState("loading"); // loading | ready | error | done
  const [error, setError] = useState(null);

  const key = review ? review.join(",") : skill;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = review
          ? await fetchReview(review, count)
          : await fetchDrill(skill, kind, count);
        if (!alive) return;
        setSet(data);
        setPosition(0);
        setState(data.items?.length ? "ready" : "error");
        if (!data.items?.length) setError("not-authored");
      } catch (err) {
        if (!alive) return;
        setError(err.code === "not-authored" ? "not-authored" : "unavailable");
        setState("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [key, kind, count, review, skill]);

  const clearItem = useCallback(() => {
    setPosition((p) => {
      const next = p + 1;
      if (set && next >= set.items.length) {
        setState("done");
        onSolved?.();
      }
      return next;
    });
  }, [set, onSolved]);

  /* ── Already solved on a previous visit ─────────────────────────────── */
  if (alreadySolved && state !== "done") {
    return (
      <div className="ac-drill ac-drill--solved">
        <span className="ac-note__label">Practice</span>
        <p>
          <i className="fas fa-circle-check" aria-hidden="true" /> You have already worked
          through this one. Your progress is saved.
        </p>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="ac-drill">
        <div className="ac-boot ac-boot--inline">
          <i className="fas fa-spinner fa-spin" aria-hidden="true" />
          <p>Generating fresh questions…</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="ac-drill ac-drill--warn">
        <span className="ac-note__label">Practice</span>
        <p>
          {error === "not-authored"
            ? "The drill questions for this atom are not written yet. The rest of the lesson still works — this is the one part that is still being built."
            : "The practice questions could not be loaded. Check your connection; nothing you have completed is lost."}
        </p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="ac-drill ac-drill--done">
        <span className="ac-note__label">Practice</span>
        <p>
          <i className="fas fa-circle-check" aria-hidden="true" /> All{" "}
          {set.items.length} answered correctly — every one of them on a question you had not
          seen before.
        </p>
      </div>
    );
  }

  const item = set.items[position];

  return (
    <div className="ac-drill">
      <header className="ac-drill__head">
        <span className="ac-note__label">
          {review ? "Mixed review" : "Practice"}
        </span>
        <span className="ac-drill__count">
          {position + 1} of {set.items.length}
        </span>
      </header>

      {intro && position === 0 && <p className="ac-drill__intro">{intro}</p>}

      <DrillItem
        key={`${item.atom}-${set.seed}-${item.index}`}
        item={item}
        seed={set.seed}
        onCleared={clearItem}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ONE QUESTION, AND THE LOOP THAT WILL NOT LET IT GO
   ═══════════════════════════════════════════════════════════════════════ */

function DrillItem({ item, seed, onCleared }) {
  const [current, setCurrent] = useState({
    item,
    atom: item.atom,
    tier: item.tier,
    seed,
    index: item.index,
  });
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState("answering"); // answering | wrong | scaffold | cleared
  const [result, setResult] = useState(null);
  const [hints, setHints] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [misses, setMisses] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const [scaffold, setScaffold] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepValue, setStepValue] = useState("");
  const [stepResult, setStepResult] = useState(null);

  async function takeHint() {
    if (hints.length >= current.item.hintCount) return;
    try {
      const next = await fetchHint(
        current.atom,
        current.tier,
        current.seed,
        current.index,
        hints.length
      );
      if (next?.hint) setHints((prev) => [...prev, next.hint]);
    } catch {
      setError("The hint could not be loaded. Try the question anyway — nothing is lost.");
    }
  }

  async function loadTwin() {
    setBusy(true);
    try {
      const twin = await fetchTwin(current.atom, current.tier, current.seed, current.index);
      setCurrent({ item: twin, atom: twin.atom, tier: twin.tier, seed: twin.seed, index: 0 });
      setValue("");
      setHints([]);
      setResult(null);
      setScaffold(null);
      setStepResult(null);
      setAttempts(0);
      setPhase("answering");
    } catch {
      setError("A new question could not be loaded. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function loadScaffold() {
    setBusy(true);
    try {
      const steps = await fetchScaffold(
        current.atom,
        current.tier,
        current.seed,
        current.index
      );
      if (steps?.steps?.length) {
        setScaffold(steps);
        setStepIndex(0);
        setStepValue("");
        setStepResult(null);
        setPhase("scaffold");
      } else {
        // No scaffold for this item. A twin is the fallback, and the loop
        // still does not let go.
        await loadTwin();
      }
    } catch {
      await loadTwin();
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!value.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const marked = await gradeItem({
        atom: current.atom,
        tier: current.tier,
        seed: current.seed,
        index: current.index,
        value,
        attempt: attempts + 1,
      });
      setAttempts((n) => n + 1);
      setResult(marked);

      if (marked.correct) {
        setPhase("cleared");
        setTimeout(onCleared, 1000);
      } else {
        setMisses((n) => n + 1);
        setPhase("wrong");
      }
    } catch {
      setError("That answer could not be marked. Nothing has been lost — try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  async function submitStep() {
    if (!stepValue.trim() || busy) return;
    setBusy(true);
    try {
      const marked = await gradeScaffoldStep({
        atom: scaffold.atom,
        tier: scaffold.tier,
        seed: scaffold.seed,
        index: scaffold.index,
        step: stepIndex,
        value: stepValue,
      });
      setStepResult(marked);
      if (marked.correct) {
        if (marked.last) setTimeout(loadTwin, 900);
        else
          setTimeout(() => {
            setStepIndex((i) => i + 1);
            setStepValue("");
            setStepResult(null);
          }, 700);
      }
    } catch {
      setError("That step could not be checked. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  /* ── Cleared ───────────────────────────────────────────────────────── */

  if (phase === "cleared") {
    return (
      <div className="ac-drill__item is-cleared">
        <p className="ac-drill__prompt">{current.item.prompt}</p>
        <p className="ac-drill__verdict is-correct">
          <i className="fas fa-check" aria-hidden="true" /> Correct
          {misses > 0 && (
            <span>
              {" "}
              — and you got there on a question you had not seen before, which is the part
              that counts.
            </span>
          )}
        </p>
        {result?.solution?.length > 0 && <MathsSolution steps={result.solution} collapsed />}
      </div>
    );
  }

  /* ── Scaffold: one step at a time ──────────────────────────────────── */

  if (phase === "scaffold" && scaffold) {
    const step = scaffold.steps[stepIndex];
    return (
      <div className="ac-drill__item is-scaffold">
        <p className="ac-drill__lead">
          <i className="fas fa-screwdriver-wrench" aria-hidden="true" /> Two misses means the
          whole problem is too big a bite right now. Here it is in single steps. Nothing is
          being marked against you.
        </p>
        <p className="ac-drill__prompt ac-drill__prompt--quiet">{scaffold.prompt}</p>
        {scaffold.visual && <MathsVisual spec={scaffold.visual} />}

        <p className="ac-drill__step">
          Step {stepIndex + 1} of {scaffold.steps.length}. {step.prompt}
        </p>

        <MathsAnswer
          id={`step-${stepIndex}`}
          input={step.input}
          value={stepValue}
          onChange={setStepValue}
          onSubmit={submitStep}
          disabled={busy || stepResult?.correct}
          status={stepResult ? (stepResult.correct ? "correct" : "wrong") : null}
          autoFocus
        />

        {stepResult && (
          <p className={`ac-drill__feedback ${stepResult.correct ? "is-correct" : "is-wrong"}`}>
            {stepResult.feedback}
          </p>
        )}

        {!stepResult?.correct && (
          <div className="ac-drill__actions">
            {step.hint && (
              <span className="ac-drill__hintline">
                <i className="fas fa-lightbulb" aria-hidden="true" /> {step.hint}
              </span>
            )}
            <button
              className="ac-btn ac-btn--primary"
              onClick={submitStep}
              disabled={busy || !stepValue.trim()}
            >
              Check this step
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Wrong: name it, show the working, hand over a twin ────────────── */

  if (phase === "wrong" && result) {
    const willScaffold = result.next === "scaffold" && result.hasScaffold;
    return (
      <div className="ac-drill__item is-wrong">
        <p className="ac-drill__prompt ac-drill__prompt--quiet">{current.item.prompt}</p>
        <p className="ac-drill__yours">
          <span>You wrote</span> {value}
        </p>

        {/* The misconception, named. Not "incorrect". */}
        <div className="ac-drill__feedback is-wrong">{result.feedback}</div>

        {/* When the same error keeps pointing at an earlier idea, say so. */}
        {result.reallyAbout && (
          <p className="ac-drill__really">
            <i className="fas fa-arrow-turn-down" aria-hidden="true" />
            <span>
              This one keeps coming back to <strong>{result.reallyAbout.title}</strong> — the
              skill of being able to {result.reallyAbout.iCan}. If the next one goes the same
              way, that is the thing to go back over, not this.
            </span>
          </p>
        )}

        <MathsSolution steps={result.solution} answer={result.correctAnswer} />

        <div className="ac-drill__actions">
          <button
            className="ac-btn ac-btn--primary"
            onClick={willScaffold ? loadScaffold : loadTwin}
            disabled={busy}
          >
            {busy
              ? "Loading…"
              : willScaffold
              ? "Work through it step by step"
              : "Now try a new one"}
            <i className="fas fa-arrow-right" aria-hidden="true" />
          </button>
        </div>

        <p className="ac-drill__note">
          {willScaffold
            ? "The next screen breaks this into single steps, then gives you a fresh question to finish on."
            : "Different numbers, same skill. Reading a solution is not the same as being able to do it, so this one has to be answered before the lesson moves on."}
        </p>
      </div>
    );
  }

  /* ── Answering ─────────────────────────────────────────────────────── */

  return (
    <div className="ac-drill__item">
      {current.item.isTwin && (
        <p className="ac-drill__badge">
          <i className="fas fa-rotate" aria-hidden="true" /> New question, same skill
        </p>
      )}
      {current.item.skill && <p className="ac-drill__skill">{current.item.skill}</p>}

      <p className="ac-drill__prompt">{current.item.prompt}</p>

      {current.item.visual && <MathsVisual spec={current.item.visual} />}

      <MathsAnswer
        id={`drill-${current.atom}-${current.index}`}
        input={current.item.input}
        value={value}
        onChange={setValue}
        onSubmit={submit}
        disabled={busy}
        autoFocus
      />

      {hints.length > 0 && (
        <ol className="ac-drill__hints">
          {hints.map((hint, i) => (
            <li key={i}>
              <span>Hint {i + 1}</span>
              {hint}
            </li>
          ))}
        </ol>
      )}

      {error && <p className="ac-drill__feedback is-wrong">{error}</p>}

      <div className="ac-drill__actions">
        {current.item.hintCount > 0 && hints.length < current.item.hintCount && (
          <button className="ac-btn ac-btn--ghost" onClick={takeHint} disabled={busy}>
            <i className="fas fa-lightbulb" aria-hidden="true" />
            {hints.length === 0
              ? "I need a nudge"
              : hints.length === 1
              ? "Show me the method"
              : "Show the first step"}
          </button>
        )}
        <button
          className="ac-btn ac-btn--primary"
          onClick={submit}
          disabled={busy || !value.trim()}
        >
          {busy ? "Checking…" : "Check my answer"}
        </button>
      </div>
    </div>
  );
}

/** The worked solution, one line per step. Collapsed after a correct answer. */
export function MathsSolution({ steps = [], answer, collapsed }) {
  const [open, setOpen] = useState(!collapsed);
  if (!steps.length) return null;

  if (!open) {
    return (
      <button className="ac-drill__toggle" onClick={() => setOpen(true)}>
        <i className="fas fa-list-ol" aria-hidden="true" /> See how it is done
      </button>
    );
  }

  return (
    <div className="ac-drill__solution">
      <span className="ac-note__label">Worked solution</span>
      <ol>
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      {answer && (
        <p className="ac-drill__answer">
          <span>Answer</span> {answer}
        </p>
      )}
    </div>
  );
}
