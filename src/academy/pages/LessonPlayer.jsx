import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import LessonSidebar from "../components/LessonSidebar";
import SocialPane from "../components/SocialPane";
import AssessmentPanel from "../components/AssessmentPanel";
import AtomTable from "../components/AtomTable";
import FormulaSyntax from "../components/FormulaSyntax";
import PivotSim from "../components/PivotSim";
import AcademyChart, { KpiRow } from "../components/AcademyChart";
import ChartChoice from "../components/ChartChoice";
import QuerySteps from "../components/QuerySteps";
import ModelSim from "../components/ModelSim";
import DaxSim from "../components/DaxSim";
import CodeTrace from "../components/CodeTrace";
import ExamCard from "../components/ExamCard";
import ExcelGrid from "../components/ExcelGrid";
import BetaBadge from "../components/BetaBadge";
import { getCatalogEntry, BETA_NOTE } from "../data/catalog";
import { getExamForModule } from "../data/exams";
import { getCourseOutline, getLesson, getNextLesson } from "../data/lessons";
import {
  completeAtom,
  completePractice,
  getAllProgress,
  getEnrollment,
  savePosition,
} from "../services/academyService";
import "../academy.css";

/**
 * LESSON PLAYER
 *
 * One atom on screen at a time. The whole design rests on that: a forty-minute
 * page of text is what makes people quit, and progress that only moves when a
 * whole lesson ends makes a ten-minute session feel like nothing happened.
 * Here every atom is a visible step forward.
 */
export default function LessonPlayer() {
  const { slug, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // These are memoised in the registry, but pinning them here too keeps the
  // component correct even if that ever changes. A lesson object with an
  // unstable identity in a dependency array re-runs its effect every render.
  const entry = useMemo(() => getCatalogEntry(slug), [slug]);
  const lesson = useMemo(() => getLesson(slug, lessonId), [slug, lessonId]);
  const outline = useMemo(() => getCourseOutline(slug), [slug]);
  const nextLesson = useMemo(() => getNextLesson(slug, lessonId), [slug, lessonId]);

  // Primitive keys for effect dependencies. `lesson` is null for an unknown
  // lesson id, so these must be null-safe or the dep array itself throws.
  const lessonKey = lesson?.id ?? null;
  const moduleKey = lesson?.moduleId ?? null;

  // The industry certification this module builds toward, if there is one.
  const exam = useMemo(() => getExamForModule(moduleKey), [moduleKey]);

  const [atomIndex, setAtomIndex] = useState(0);
  const [done, setDone] = useState(new Set());
  const [progressMap, setProgressMap] = useState({});
  const [phase, setPhase] = useState("learning"); // learning | assessment
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Atoms whose practice has been solved. A practice gates progression, so an
  // atom with an unsolved exercise cannot be left.
  const [solved, setSolved] = useState(() => new Set());
  // Set when someone tries to move on with an unsolved practice. Cleared as
  // soon as they solve it or navigate away.
  const [practiceWarning, setPracticeWarning] = useState(false);

  useSEO({
    title: lesson ? `${lesson.title} — Memora Smart Academy` : "Lesson",
  });

  /* ── Load saved progress ─────────────────────────────────────────── */
  useEffect(() => {
    if (!user || !lesson) return;
    let alive = true;
    setLoading(true);

    (async () => {
      try {
        const [all, enrollment] = await Promise.all([
          getAllProgress(user.uid, slug),
          getEnrollment(user.uid, slug),
        ]);
        if (!alive) return;

        setProgressMap(all);
        const completedAtoms = all[lesson.id]?.atomsCompleted || [];
        setDone(new Set(completedAtoms));
        // Practices solved previously, read from the record rather than
        // inferred from atomsCompleted.
        setSolved(new Set(all[lesson.id]?.practicesSolved || []));
        setPracticeWarning(false);

        // Resume at the first atom not yet finished
        const firstUnfinished = lesson.atoms.findIndex(
          (a) => !completedAtoms.includes(a.id)
        );
        setAtomIndex(firstUnfinished === -1 ? lesson.atoms.length - 1 : firstUnfinished);

        // Set the phase UNCONDITIONALLY. React Router reuses this component
        // when only :lessonId changes, so a phase left as "assessment" by the
        // previous lesson would drop the learner straight into the next
        // lesson's knowledge check instead of its first atom.
        setPhase(all[lesson.id]?.assessment?.passed ? "assessment" : "learning");

        if (!enrollment) {
          navigate(`/academy/enroll/${slug}`, { replace: true });
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user, slug, lesson, navigate]);

  /* ── Remember position across devices ────────────────────────────── */
  useEffect(() => {
    if (!user || !lessonKey || loading) return;
    savePosition(user.uid, slug, {
      moduleId: moduleKey,
      lessonId: lessonKey,
      atomIndex,
    }).catch(() => {});
    // Keyed on primitives, not the lesson object: depending on the object
    // wrote to Firestore on every single render.
  }, [user, slug, lessonKey, moduleKey, atomIndex, loading]);

  const flash = useCallback((message, icon = "fas fa-bolt") => {
    setToast({ message, icon, key: Date.now() });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const atom = lesson?.atoms[atomIndex];
  const isLastAtom = lesson && atomIndex === lesson.atoms.length - 1;
  const allAtomsDone = lesson && lesson.atoms.every((a) => done.has(a.id));

  // An atom with a practice is not finished until the practice is right.
  //
  // Deliberately NOT exempting atoms in `done`: that record only means the
  // atom was moved past, and atoms completed before this gate existed were
  // never checked. Trusting it would mark a skipped exercise as passed.
  // Either kind of practice — a formula in a cell, or a pivot arrangement —
  // gates progression. Without the pivot half, a learner could walk past the
  // only atom in the module that actually proves they can build one.
  const practiceUnsolved = Boolean(
    (atom?.exercise ||
      atom?.pivotExercise ||
      atom?.chartChoice ||
      atom?.queryExercise ||
      atom?.modelExercise ||
      atom?.codeExercise) &&
      !solved.has(atom.id)
  );

  async function handleGotIt() {
    if (!atom) return;

    // Validate on click. The button stays live so it never looks broken; the
    // check happens here and explains itself instead of silently refusing.
    if (practiceUnsolved) {
      setPracticeWarning(true);
      // Scroll to whichever kind of practice this atom carries, so the warning
      // never points at something off screen.
      document
        .querySelector(
          ".ac-sheet-sim, .ac-pivot, .ac-choice, .ac-pq, .ac-model, .ac-trace"
        )
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!done.has(atom.id)) {
      setDone((prev) => new Set(prev).add(atom.id));
      try {
        const res = await completeAtom(user, slug, lesson.id, atom.id);
        if (res.xpAwarded) flash(`+${res.xpAwarded} XP`);
        if (res.leveledUp) flash(`Level up — ${res.newLevel.name}!`, "fas fa-star");
        for (const badge of res.newBadges || []) {
          flash("Badge unlocked", "fas fa-award");
          void badge;
        }
      } catch (err) {
        console.error("Could not save atom progress", err);
      }
    }

    if (isLastAtom) setPhase("assessment");
    else setAtomIndex((i) => i + 1);
  }

  if (!entry || !lesson) {
    return (
      <div className="academy">
        <AcademyNav />
        <main className="ac-section">
          <div className="ac-container ac-empty">
            <h1 className="ac-h2">This lesson has not been written yet</h1>
            <p className="ac-body">
              The curriculum lists it, but the content is still being authored.
            </p>
            <Link className="ac-btn ac-btn--primary" to="/academy/learn">
              Back to My Learning
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const lessonProgress = progressMap[lesson.id];
  const passed = lessonProgress?.assessment?.passed;

  return (
    <div className="academy ac-player">
      <AcademyNav />

      <div className="ac-player__bar">
        <div className="ac-container ac-player__bar-inner">
          <button
            className="ac-player__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open curriculum"
          >
            <i className="fas fa-list-ul" aria-hidden="true" />
            <span>Curriculum</span>
          </button>

          <div className="ac-player__crumb">
            <BetaBadge beta={entry?.beta} note={BETA_NOTE} />
            <span>{lesson.moduleTitle}</span>
            <i className="fas fa-chevron-right" aria-hidden="true" />
            <strong>{lesson.title}</strong>
          </div>

          <Link to="/academy/learn" className="ac-player__exit">
            <i className="fas fa-xmark" aria-hidden="true" />
            <span>Exit</span>
          </Link>
        </div>
      </div>

      <div className="ac-player__grid">
        <LessonSidebar
          outline={outline}
          slug={slug}
          currentLessonId={lesson.id}
          progressMap={progressMap}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="ac-player__main">
          {loading ? (
            <div className="ac-boot ac-boot--inline">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              <p>Loading your place…</p>
            </div>
          ) : phase === "learning" ? (
            <article className="ac-atomview">
              <header className="ac-atomview__head">
                <span className="ac-atomview__count">
                  Atom {atomIndex + 1} of {lesson.atoms.length}
                </span>
                <div className="ac-atomview__pips" aria-hidden="true">
                  {lesson.atoms.map((a, i) => (
                    <span
                      key={a.id}
                      className={`ac-pip ${done.has(a.id) ? "is-done" : ""} ${
                        i === atomIndex ? "is-current" : ""
                      }`}
                    />
                  ))}
                </div>
              </header>

              {atomIndex === 0 && lesson.intro && (
                <p className="ac-atomview__intro">{lesson.intro}</p>
              )}

              <h1 className="ac-atomview__title">{atom.title}</h1>

              <p className="ac-atomview__explain">{atom.explain}</p>

              {/* Signature first: a learner who knows the shape of a function
                  can generalise it, instead of copying one worked example. */}
              {atom.syntax && <FormulaSyntax syntax={atom.syntax} />}

              {atom.why && (
                <div className="ac-note ac-note--why">
                  <span className="ac-note__label">Why it matters</span>
                  <p>{atom.why}</p>
                </div>
              )}

              {atom.analogy && (
                <div className="ac-note ac-note--analogy">
                  <span className="ac-note__label">Think of it like</span>
                  <p>{atom.analogy}</p>
                </div>
              )}

              {atom.table && <AtomTable table={atom.table} />}

              {/* A live spreadsheet. `sheet` is a read-only demonstration,
                  `exercise` makes it a graded practice the learner must solve. */}
              {(atom.sheet || atom.exercise) && (
                <ExcelGrid
                  // Keyed per atom. Without this the component is reused
                  // between atoms and keeps the previous sheet, because
                  // useState only runs its initialiser on mount.
                  key={atom.id}
                  data={atom.sheet?.data || atom.exercise?.data || {}}
                  rows={atom.sheet?.rows || atom.exercise?.rows || 6}
                  cols={atom.sheet?.cols || atom.exercise?.cols || 4}
                  exercise={atom.exercise || null}
                  readOnly={Boolean(atom.sheet && !atom.exercise)}
                  formats={atom.sheet?.formats || atom.exercise?.formats || {}}
                  allowFill={Boolean(
                    atom.sheet?.allowFill || atom.exercise?.allowFill
                  )}
                  alreadySolved={solved.has(atom.id)}
                  onSolved={() => {
                    setSolved((prev) => new Set(prev).add(atom.id));
                    setPracticeWarning(false);
                    completePractice(user, slug, lesson.id, atom.id).catch(
                      (err) => console.error("Could not save practice", err)
                    );
                  }}
                />
              )}

              {/* Stat tiles. A single headline number is not a chart, and
                  drawing it as one wastes the space it needs. */}
              {atom.kpis && <KpiRow items={atom.kpis} />}

              {/* Charts, rendered from the same numbers the lesson quotes. */}
              {atom.charts &&
                atom.charts.map((c, i) => <AcademyChart key={i} {...c} />)}

              {atom.chartChoice && (
                <ChartChoice
                  key={atom.id}
                  {...atom.chartChoice}
                  alreadySolved={solved.has(atom.id)}
                  onSolved={() => {
                    setSolved((prev) => new Set(prev).add(atom.id));
                    setPracticeWarning(false);
                    completePractice(user, slug, lesson.id, atom.id).catch(
                      (err) => console.error("Could not save practice", err)
                    );
                  }}
                />
              )}

              {/* Python. `code` demonstrates and shows its output;
                  `codeExercise` makes the learner predict it. */}
              {atom.code && <CodeTrace key={`${atom.id}-demo`} {...atom.code} showOutput />}
              {atom.codeExercise && (
                <CodeTrace
                  key={atom.id}
                  {...atom.codeExercise}
                  alreadySolved={solved.has(atom.id)}
                  onSolved={() => {
                    setSolved((prev) => new Set(prev).add(atom.id));
                    setPracticeWarning(false);
                    completePractice(user, slug, lesson.id, atom.id).catch(
                      (err) => console.error("Could not save practice", err)
                    );
                  }}
                />
              )}

              {/* A measure evaluated once per row, so filter context is
                  something the learner watches rather than reads about. */}
              {atom.dax && <DaxSim key={atom.id} {...atom.dax} />}

              {/* The Model view, with cardinality and filter direction made
                  visible. `model` demonstrates, `modelExercise` grades. */}
              {(atom.model || atom.modelExercise) && (
                <ModelSim
                  key={atom.id}
                  {...(atom.model || atom.modelExercise)}
                  exercise={atom.modelExercise || null}
                  alreadySolved={solved.has(atom.id)}
                  onSolved={() => {
                    setSolved((prev) => new Set(prev).add(atom.id));
                    setPracticeWarning(false);
                    completePractice(user, slug, lesson.id, atom.id).catch(
                      (err) => console.error("Could not save practice", err)
                    );
                  }}
                />
              )}

              {/* The Power Query editor in miniature. `query` demonstrates a
                  recipe, `queryExercise` makes the learner build one. */}
              {(atom.query || atom.queryExercise) && (
                <QuerySteps
                  key={atom.id}
                  source={atom.query?.source || atom.queryExercise?.source}
                  initialSteps={
                    atom.query?.steps || atom.queryExercise?.initialSteps || []
                  }
                  showM={atom.query?.showM ?? atom.queryExercise?.showM ?? true}
                  exercise={atom.queryExercise || null}
                  alreadySolved={solved.has(atom.id)}
                  onSolved={() => {
                    setSolved((prev) => new Set(prev).add(atom.id));
                    setPracticeWarning(false);
                    completePractice(user, slug, lesson.id, atom.id).catch(
                      (err) => console.error("Could not save practice", err)
                    );
                  }}
                />
              )}

              {/* A live pivot table. `pivot` demonstrates, `pivotExercise`
                  asks the learner to arrange the fields themselves. */}
              {(atom.pivot || atom.pivotExercise) && (
                <PivotSim
                  key={atom.id}
                  source={atom.pivot?.source || atom.pivotExercise?.source}
                  initial={atom.pivot?.initial || atom.pivotExercise?.initial || {}}
                  wells={atom.pivot?.wells || atom.pivotExercise?.wells || "excel"}
                  exercise={atom.pivotExercise || null}
                  alreadySolved={solved.has(atom.id)}
                  onSolved={() => {
                    setSolved((prev) => new Set(prev).add(atom.id));
                    setPracticeWarning(false);
                    completePractice(user, slug, lesson.id, atom.id).catch(
                      (err) => console.error("Could not save practice", err)
                    );
                  }}
                />
              )}

              {atom.example && (
                <div className="ac-note ac-note--example">
                  <span className="ac-note__label">Example</span>
                  <pre>{atom.example}</pre>
                </div>
              )}

              {atom.mistake && (
                <div className="ac-note ac-note--mistake">
                  <span className="ac-note__label">Common mistake</span>
                  <p>{atom.mistake}</p>
                </div>
              )}

              {atom.practice && <AtomPractice practice={atom.practice} key={atom.id} />}

              {practiceWarning && practiceUnsolved && (
                <p className="ac-gate" role="alert">
                  <i className="fas fa-circle-exclamation" aria-hidden="true" />
                  <span>
                    <strong>Not yet. Finish the practice first.</strong>{" "}
                    {atom.exercise ? (
                      <>
                        Your answer in cell {atom.exercise.target} is not right
                        yet. Type a formula there and press{" "}
                        <em>Check my answer</em>.
                      </>
                    ) : atom.pivotExercise ? (
                      <>
                        Your pivot is not arranged correctly yet. Move the
                        fields between the areas and press{" "}
                        <em>Check my pivot</em>.
                      </>
                    ) : atom.chartChoice ? (
                      <>
                        You have not picked the right chart yet. Compare the
                        options and press <em>Check my choice</em>.
                      </>
                    ) : atom.queryExercise ? (
                      <>
                        The table is not clean yet. Add or remove steps and
                        press <em>Check my table</em>.
                      </>
                    ) : atom.modelExercise ? (
                      <>
                        The relationship is not right yet. Pick the joining
                        column in each table and press{" "}
                        <em>Check my model</em>.
                      </>
                    ) : (
                      <>
                        Your predicted output is not right yet. Read the code
                        one line at a time and press{" "}
                        <em>Check my answer</em>.
                      </>
                    )}{" "}
                    It is not marked or timed and you can try as many times as
                    you like, but this one is worth getting working before the
                    idea moves on.
                  </span>
                </p>
              )}

              <div className="ac-atomview__actions">
                <button
                  className="ac-btn ac-btn--ghost"
                  disabled={atomIndex === 0}
                  onClick={() => setAtomIndex((i) => Math.max(0, i - 1))}
                >
                  <i className="fas fa-arrow-left" aria-hidden="true" />
                  Back
                </button>

                <button className="ac-btn ac-btn--primary ac-btn--lg" onClick={handleGotIt}>
                  {isLastAtom ? "Finish and take the check" : "Got it"}
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </button>
              </div>

              {exam && isLastAtom && (
                <div className="ac-examslot">
                  <p className="ac-examslot__lead">
                    Finishing this module puts a real certification within reach.
                  </p>
                  <ExamCard exam={exam} />
                </div>
              )}

              {lesson.task && isLastAtom && (
                <aside className="ac-task">
                  <span className="ac-note__label">{lesson.task.title}</span>
                  <p>{lesson.task.intro}</p>
                  <ol>
                    {lesson.task.prompts.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ol>
                  <p className="ac-task__closing">{lesson.task.closing}</p>
                </aside>
              )}
            </article>
          ) : (
            <AssessmentPanel
              lesson={lesson}
              slug={slug}
              user={user}
              alreadyPassed={passed}
              allAtomsDone={allAtomsDone}
              nextLesson={nextLesson}
              onReviewAtom={(atomId) => {
                const i = lesson.atoms.findIndex((a) => a.id === atomId);
                if (i >= 0) {
                  setAtomIndex(i);
                  setPhase("learning");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              onBackToAtoms={() => setPhase("learning")}
              onPassed={(result) => {
                setProgressMap((prev) => ({
                  ...prev,
                  [lesson.id]: {
                    ...(prev[lesson.id] || {}),
                    assessment: { ...result, passed: true },
                  },
                }));
              }}
              flash={flash}
            />
          )}

        </main>

        {/* The study circle: ranking, who is around, and encrypted chat.
            A SIBLING of <main>, not a child, so on a wide screen it is a real
            third grid column to the right of the lesson; below 1180px the
            grid collapses and it falls into the flow underneath, which is
            where it belongs on a phone.

            Collapsed by default and completely inert until opened — no reads,
            no key generation, no presence announced — so it can neither slow
            the lesson nor pull attention from it. */}
        <SocialPane lessonTitle={lesson?.title || null} variant="lesson" />
      </div>

      {toast && (
        <div className="ac-toast" key={toast.key}>
          <i className={toast.icon} aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  );
}

/** Mini practice — the answer stays hidden until the learner commits to a guess. */
function AtomPractice({ practice }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="ac-practice">
      <span className="ac-note__label">Quick practice</span>
      <p className="ac-practice__prompt">{practice.prompt}</p>

      {revealed ? (
        <p className="ac-practice__answer">
          <i className="fas fa-lightbulb" aria-hidden="true" />
          {practice.answer}
        </p>
      ) : (
        <button className="ac-btn ac-btn--ghost" onClick={() => setRevealed(true)}>
          Think first, then reveal
        </button>
      )}
    </div>
  );
}
