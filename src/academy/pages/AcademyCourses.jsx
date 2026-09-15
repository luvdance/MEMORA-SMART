import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import ExamCard from "../components/ExamCard";
import { CATALOG, CATEGORIES, STATUS_LABELS, getCourseStats } from "../data/catalog";
import { getAuthoredStats } from "../data/lessons";
import { EXAMS } from "../data/exams";
import { startAcademyJourney } from "../services/intent";
import "../academy.css";

//the nature of the export
export default function AcademyCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(false);

  useSEO({
    title: "All Courses — Memora Smart Academy",
    description:
      "Every course the Academy teaches, across data, web development, AI, design and digital skills. Each one is labelled with what you can start today.",
  });

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return CATALOG.filter((entry) => {
      if (openOnly && entry.status !== "open") return false;
      if (category !== "all" && entry.category !== category) return false;
      if (!term) return true;
      return (
        entry.title.toLowerCase().includes(term) ||
        (entry.subtitle || "").toLowerCase().includes(term) ||
        entry.summary.toLowerCase().includes(term) ||
        entry.covers.some((c) => c.toLowerCase().includes(term))
      );
    });
  }, [category, query, openOnly]);

  const openCount = CATALOG.filter((c) => c.status === "open").length;

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section ac-section--learn">
        <div className="ac-container">
          <header className="ac-head">
            <div>
              <span className="ac-kicker">Courses</span>
              <h1 className="ac-h2">Everything the Academy teaches</h1>
            </div>
            <p className="ac-head__sub">
              {CATALOG.length} courses across {CATEGORIES.length - 1} disciplines.{" "}
              {openCount === 1
                ? "One is fully written and open today."
                : `${openCount} are fully written and open today.`}{" "}
              The rest are labelled honestly so you always know what you are
              signing up for.
            </p>
          </header>

          {/* ── CONTROLS ── */}
          <div className="ac-coursebar">
            <div className="ac-search">
              <i className="fas fa-search" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, tools or topics"
                aria-label="Search courses"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <i className="fas fa-xmark" aria-hidden="true" />
                </button>
              )}
            </div>

            <label className="ac-toggle">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
              />
              <span>Open now only</span>
            </label>
          </div>

          <div className="ac-filters" role="tablist" aria-label="Course categories">
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === "all"
                  ? CATALOG.length
                  : CATALOG.filter((c) => c.category === cat.id).length;
              if (!count) return null;
              const active = cat.id === category;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={active}
                  className={`ac-filter ${active ? "is-active" : ""}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                  <span className="ac-filter__count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* ── RESULTS ── */}
          {visible.length === 0 ? (
            <div className="ac-empty ac-empty--panel">
              <p className="ac-body">
                Nothing matches <strong>{query}</strong>
                {category !== "all" ? " in that discipline" : ""}.
              </p>
              <button
                className="ac-btn ac-btn--ghost"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setOpenOnly(false);
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="ac-catalog">
              {visible.map((entry) => {
                const isOpen = entry.status === "open";
                const stats = isOpen ? getCourseStats(entry.course) : null;
                const authored = isOpen ? getAuthoredStats(entry.slug) : null;
                const exams = EXAMS.filter((e) => e.courseId === entry.id);

                return (
                  <article
                    className={`ac-cc ${isOpen ? "ac-cc--open" : ""}`}
                    key={entry.id}
                  >
                    <div className="ac-cc__top">
                      <span className="ac-cc__icon">
                        <i className={entry.icon} aria-hidden="true" />
                      </span>
                      <span className={`ac-status ac-status--${entry.status}`}>
                        {STATUS_LABELS[entry.status]}
                      </span>
                    </div>

                    <h2 className="ac-cc__title">{entry.title}</h2>
                    {entry.subtitle && (
                      <p className="ac-cc__subtitle">{entry.subtitle}</p>
                    )}
                    <p className="ac-cc__summary">{entry.summary}</p>

                    <div className="ac-cc__covers">
                      {entry.covers.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

                    {/* The certifications this course builds toward */}
                    {exams.length > 0 && (
                      <div className="ac-cc__exams">
                        <span className="ac-note__label">Prepares you for</span>
                        <div className="ac-cc__examchips">
                          {exams.map((exam) => (
                            <span key={exam.id} title={exam.name}>
                              <i className={exam.icon} style={{ color: exam.accent }} />
                              {exam.code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="ac-cc__foot">
                      <span className="ac-cc__level">
                        <i className="fas fa-signal" aria-hidden="true" />
                        {entry.level}
                      </span>

                      {isOpen && stats && (
                        <span className="ac-cc__stats">
                          {stats.months} months · {stats.modules} modules ·{" "}
                          {stats.atoms} atoms
                        </span>
                      )}

                      {isOpen && authored && (
                        <span className="ac-cc__written">
                          {authored.lessons} lessons published so far
                        </span>
                      )}
                    </div>

                    {isOpen && (
                      <button
                        className="ac-btn ac-btn--primary ac-cc__cta"
                        onClick={() => startAcademyJourney(navigate, user, entry.slug)}
                      >
                        Start this course
                        <i className="fas fa-arrow-right" aria-hidden="true" />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* ── CERTIFICATIONS ── */}
          <section className="ac-learn__section" id="exams">
            <header className="ac-head">
              <div>
                <span className="ac-kicker">Professional exams</span>
                <h2 className="ac-h2">Where these courses can take you</h2>
              </div>
              <p className="ac-head__sub">
                Recognised certifications our courses prepare you for. These are
                awarded by Microsoft and the Python Institute, not by us. We tell
                you which one your current module is building toward as you learn.
              </p>
            </header>

            <div className="ac-examgrid">
              {EXAMS.map((exam) => (
                <ExamCard key={exam.id} exam={exam} variant="compact" />
              ))}
            </div>
          </section>
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
