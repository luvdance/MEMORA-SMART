import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import { useAuth } from "../../context/AuthContext";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import MediaSlot from "../components/MediaSlot";
import BetaBadge from "../components/BetaBadge";
import ContinueLearning from "../components/ContinueLearning";
import ACADEMY_MEDIA from "../academyMedia";
import {
  CATALOG,
  CATEGORIES,
  FLAGSHIP,
  STATUS_LABELS,
  getAcademyStats,
  getByCategory,
  getCourseStats,
  BETA_NOTE,
} from "../data/catalog";
import { ASSESSMENT_RULES } from "../data/dataAnalysisCourse";
import { startAcademyJourney } from "../services/intent";
import "../academy.css";

const academy = getAcademyStats();
const flagship = FLAGSHIP;
const flagshipStats = getCourseStats(flagship.course);

/* ── Copy that belongs to the page, not to any one course ───────────────── */

const DISCIPLINES = [
  {
    icon: "fas fa-chart-simple",
    title: "Data & Analytics",
    text: "Analysis, dashboards and the tools employers actually ask for.",
  },
  {
    icon: "fas fa-code",
    title: "Web Development",
    text: "From your first HTML page to component-driven applications.",
  },
  {
    icon: "fas fa-robot",
    title: "AI & Automation",
    text: "Use AI deliberately and automate the repetitive work away.",
  },
  {
    icon: "fas fa-palette",
    title: "Design & Content",
    text: "Interfaces, brand and content that hold a viewer's attention.",
  },
];

const METHOD_STEPS = [
  { label: "Atom", text: "One concept. Explained plainly, with why it matters." },
  { label: "Example", text: "A real analogy and a worked example you can follow." },
  { label: "Practice", text: "A short exercise before the idea gets cold." },
  {
    label: "Assess",
    text: `${ASSESSMENT_RULES.questionsPerLesson[0]}–${ASSESSMENT_RULES.questionsPerLesson[1]} questions that test understanding, not memory.`,
  },
  {
    label: "Unlock",
    text: `Score ${ASSESSMENT_RULES.defaultPassMark}% or more and the next lesson opens.`,
  },
];

const VALUE_POINTS = [
  {
    kicker: "01",
    title: "Nothing is assumed",
    text: "Every course starts at absolute zero. If a term is used, it was taught first.",
  },
  {
    kicker: "02",
    title: "You cannot skip ahead",
    text: "Lessons stay locked until you pass the assessment. Progress means you actually learned it.",
  },
  {
    kicker: "03",
    title: "Feedback that teaches",
    text: "A wrong answer tells you why it was wrong and which concept to review — not just a red X.",
  },
  {
    kicker: "04",
    title: "Built for one screen",
    text: "The lesson player is designed for a phone first, because that is where most of you will learn.",
  },
];

const JOURNEY = [
  {
    title: "Create your account",
    text: "Register once and the Academy issues your permanent Memora ID.",
    icon: "fas fa-id-card",
  },
  {
    title: "Pick your course",
    text: "Enroll in any open programme. One account covers everything you take.",
    icon: "fas fa-list-check",
  },
  {
    title: "Learn atom by atom",
    text: "Each lesson is broken into small concepts you can finish in a sitting.",
    icon: "fas fa-cube",
  },
  {
    title: "Prove it",
    text: `A short assessment closes every lesson. ${ASSESSMENT_RULES.defaultPassMark}% to pass, retry as often as you need.`,
    icon: "fas fa-clipboard-check",
  },
  {
    title: "Get certified",
    text: "Finish the programme and receive a certificate anyone can verify.",
    icon: "fas fa-award",
  },
];

const FAQS = [
  {
    q: "Which courses can I actually start today?",
    a: `${flagship.title} — ${flagship.subtitle} is open and complete, from the first spreadsheet to a final capstone. Everything else is labelled honestly: "In development" means it is being written now, "Planned" means it is on the roadmap without a date. We would rather show you the real state than a shelf of empty course pages.`,
  },
  {
    q: "Do I need any experience to start?",
    a: "No. Every Academy course is written for someone starting from zero. The Data Analysis programme opens with what data is, and its Python month begins with what a variable is. If you can use a computer, you can start.",
  },
  {
    q: "How much does it cost?",
    a: "Nothing to register, and the Data Analysis programme is free to begin. Paid and cohort-based options are built into the platform for later, but you will always see a price before anything is charged.",
  },
  {
    q: "What happens if I fail an assessment?",
    a: `You retake it. There is no penalty and no attempt limit. The result tells you which concepts you missed so you know exactly what to review before trying again — the pass mark is ${ASSESSMENT_RULES.defaultPassMark}%.`,
  },
  {
    q: "Can I learn on my phone?",
    a: "Yes. The lesson player is built mobile-first. Some courses have practical work that needs a computer — Data Analysis needs one for Excel and Power BI — and each course says so up front.",
  },
  {
    q: "Is the certificate verifiable?",
    a: "Every certificate carries a unique certificate ID tied to your Memora ID. An employer will be able to check that ID against our public verification page and confirm it is genuine.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function AcademyLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState("all");
  const [activeMonth, setActiveMonth] = useState(flagship.course.months[0].month);
  const [openFaq, setOpenFaq] = useState(0);
  /* Whether this learner has a course in progress. `null` while checking,
     so the hero does not flash "Enroll now" at someone it is about to
     welcome back. Signed-out visitors resolve to false immediately. */
  const [returning, setReturning] = useState(user ? null : false);

  useSEO({
    title:
      "Memora Smart Academy — Learn Data, Web Development, AI and Design Skills",
    description:
      "Structured online courses that take you from absolute beginner to job-ready. Data Analysis is open now, with Web Development, Frontend Libraries, AI & Automation and Content Creation in development. Real assessments, real projects, verifiable certificates.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Memora Smart Academy",
      description:
        "The learning arm of Memora Smart Technologies. Structured, practical courses across data, web development, AI and design.",
      parentOrganization: {
        "@type": "Organization",
        name: "Memora Smart Technologies",
        sameAs: "https://memorasmart.com",
      },
    },
  });

  // Signed in → straight to enrollment. Signed out → the existing signup,
  // with the course remembered so verification cannot lose it.
  // Pass a slug when the course is already chosen (a course card); pass
  // nothing for a generic "Enroll now", which routes to the chooser. The old
  // default of flagship.slug meant the hero button enrolled you in Data
  // Analysis without asking.
  const enroll = (slug = null) => startAcademyJourney(navigate, user, slug);

  const visibleCourses = useMemo(() => getByCategory(category), [category]);

  const selectedMonth =
    flagship.course.months.find((m) => m.month === activeMonth) ||
    flagship.course.months[0];

  return (
    <div className="academy">
      <AcademyNav />

      <main>
        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-hero">
          <div className="ac-container ac-hero__inner">
            <div className="ac-hero__copy">
              <ContinueLearning user={user} onResolved={setReturning} />

              <span className="ac-eyebrow">
                <i className="fas fa-graduation-cap" aria-hidden="true" />
                Memora Smart Academy
              </span>

              <h1 className="ac-hero__title">
                Learn a real skill.
                <span className="ac-grad"> Prove you have it.</span>
              </h1>

              <p className="ac-hero__lead">
                Structured online courses in data, web development, AI and design —
                each one starting from absolute zero and ending with work you can
                show an employer. No prior experience needed for any of them.
              </p>

              <div className="ac-hero__facts">
                <div className="ac-fact">
                  <i className="fas fa-layer-group" aria-hidden="true" />
                  <div>
                    <strong>{academy.coursesPlanned} courses</strong>
                    <span>Across 5 disciplines</span>
                  </div>
                </div>
                <div className="ac-fact">
                  <i className="fas fa-cube" aria-hidden="true" />
                  <div>
                    <strong>Atom method</strong>
                    <span>One concept at a time</span>
                  </div>
                </div>
                <div className="ac-fact">
                  <i className="fas fa-certificate" aria-hidden="true" />
                  <div>
                    <strong>Certificate</strong>
                    <span>On completion</span>
                  </div>
                </div>
              </div>

              <div className="ac-hero__actions">
                <a className="ac-btn ac-btn--primary ac-btn--lg" href="#courses">
                  Browse the courses
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </a>
                {/* The conversion action, not an anchor down the page. Runs
                    the same onboarding journey as the nav button, so there is
                    exactly one way into the course from anywhere on this
                    page. Replaced a "How it works" anchor, whose section is
                    still reachable from the nav. */}
                {/* Enrolling is onboarding. A learner who already has a
                    course gets the Continue card above instead, and is not
                    asked to "enroll" in the place they already study.
                    Hidden while that is still being checked, rather than
                    shown and then snatched away. */}
                {returning === false && (
                  <button
                    className="ac-btn ac-btn--ghost ac-btn--lg"
                    onClick={() => enroll()}
                  >
                    Enroll now
                    <i className="fas fa-user-plus" aria-hidden="true" />
                  </button>
                )}
              </div>

              <p className="ac-hero__note">
                <i className="fas fa-circle-info" aria-hidden="true" />
                Free to register. You get your Memora ID the moment you join.
              </p>
            </div>

            <div className="ac-hero__visual">
              <div className="ac-hero__glow" aria-hidden="true" />

              <MediaSlot
                src={ACADEMY_MEDIA.hero}
                alt="A Memora Smart Academy student learning on a laptop"
                label="Hero image"
                hint="1200 × 1000 · subject on the left"
                ratio="6 / 5"
                className="ac-hero__photo"
              />

              {/* Illustrative previews of the student experience.
                  `display: contents` on desktop keeps the absolute placement;
                  on mobile this wrapper becomes a swipeable row. */}
              <div className="ac-hero__previews" aria-hidden="true">
                <div className="ac-float ac-float--course">
                  <span className="ac-float__label">Enrolled</span>
                  <strong className="ac-float__title">{flagship.title}</strong>
                  <div className="ac-float__tools">
                    {flagship.course.tools.map((tool) => (
                      <span key={tool.id} className="ac-toolchip">
                        <i className={tool.icon} style={{ color: tool.accent }} />
                        {tool.short}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ac-float ac-float--progress">
                  <div className="ac-float__row">
                    <span className="ac-float__label">Course progress</span>
                    <strong>43%</strong>
                  </div>
                  <div className="ac-bar">
                    <div className="ac-bar__fill" style={{ width: "43%" }} />
                  </div>
                  <span className="ac-float__meta">Month 2 · Pivot Tables</span>
                </div>

                <div className="ac-float ac-float--id">
                  <div className="ac-float__avatar">
                    <i className="fas fa-user" />
                  </div>
                  <div>
                    <span className="ac-float__label">Memora ID</span>
                    <strong className="ac-mono">MS-2026-000001</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            DISCIPLINES
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-strip">
          <div className="ac-container ac-strip__inner">
            <p className="ac-strip__label">
              What we
              <br />
              teach.
            </p>
            <div className="ac-strip__tools ac-strip__tools--four">
              {DISCIPLINES.map((item) => (
                <div className="ac-strip__tool" key={item.title}>
                  <i className={item.icon} aria-hidden="true" />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            COURSE CATALOG
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section" id="courses">
          <div className="ac-container">
            <header className="ac-head">
              <div>
                <span className="ac-kicker">Courses</span>
                <h2 className="ac-h2">Everything the Academy teaches</h2>
              </div>
              <p className="ac-head__sub">
                Every course is labelled with what you can actually do today. We
                would rather show you the real state of the roadmap than a shelf of
                empty course pages.
              </p>
            </header>

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

            <div className="ac-catalog">
              {visibleCourses.map((entry) => {
                const isOpen = entry.status === "open";
                const stats = isOpen ? getCourseStats(entry.course) : null;

                return (
                  <article
                    className={`ac-cc ${isOpen ? "ac-cc--open" : ""}`}
                    key={entry.id}
                  >
                    <div className="ac-cc__top">
                      <span className="ac-cc__icon">
                        <i className={entry.icon} aria-hidden="true" />
                      </span>
                      <span className="ac-cc__flags">
                        <BetaBadge beta={entry.beta} note={BETA_NOTE} />
                        <span className={`ac-status ac-status--${entry.status}`}>
                          {STATUS_LABELS[entry.status]}
                        </span>
                      </span>
                    </div>

                    <h3 className="ac-cc__title">{entry.title}</h3>
                    {entry.subtitle && (
                      <p className="ac-cc__subtitle">{entry.subtitle}</p>
                    )}

                    <p className="ac-cc__summary">{entry.summary}</p>

                    <div className="ac-cc__covers">
                      {entry.covers.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

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
                    </div>

                    {isOpen && (
                      <button
                        className="ac-btn ac-btn--primary ac-cc__cta"
                        onClick={() => enroll(entry.slug)}
                      >
                        Start this course
                        <i className="fas fa-arrow-right" aria-hidden="true" />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            THE METHOD
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section ac-section--tint" id="method">
          <div className="ac-container ac-method">
            <div className="ac-method__copy">
              <span className="ac-kicker">The Memora method</span>
              <h2 className="ac-h2">
                Big topics break into <span className="ac-grad">atoms</span>.
              </h2>
              <p className="ac-lead">
                Most courses hand you a forty-minute video and hope. We do the
                opposite. Every topic, in every course, is split into its smallest
                teachable concepts — and you finish one before the next begins.
              </p>

              <p className="ac-body">
                Take <em>cell references</em> from the Data Analysis course. That is
                not one lesson, it is five atoms: what a cell is, what an address
                is, relative references, absolute references, mixed references. Each
                one is explained, shown, practised and checked on its own. Nothing
                gets skipped, because nothing was ever too big to finish.
              </p>

              <div className="ac-flow">
                {METHOD_STEPS.map((step, index) => (
                  <div className="ac-flow__step" key={step.label}>
                    <span className="ac-flow__index">{index + 1}</span>
                    <div>
                      <strong>{step.label}</strong>
                      <span>{step.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ac-method__visual">
              <div className="ac-atomcard">
                <div className="ac-atomcard__head">
                  <span className="ac-kicker">Lesson</span>
                  <strong>Understanding Cell References</strong>
                </div>

                <ul className="ac-atomlist">
                  <li className="is-done">
                    <i className="fas fa-check" aria-hidden="true" />
                    What is a cell
                  </li>
                  <li className="is-done">
                    <i className="fas fa-check" aria-hidden="true" />
                    What is a cell address
                  </li>
                  <li className="is-active">
                    <i className="fas fa-circle-dot" aria-hidden="true" />
                    Relative references
                  </li>
                  <li>
                    <i className="far fa-circle" aria-hidden="true" />
                    Absolute references
                  </li>
                  <li>
                    <i className="far fa-circle" aria-hidden="true" />
                    Mixed references
                  </li>
                </ul>

                <div className="ac-atomcard__foot">
                  <div className="ac-atomcard__gate">
                    <i className="fas fa-lock" aria-hidden="true" />
                    <div>
                      <strong>Next lesson locked</strong>
                      <span>
                        Pass the assessment at {ASSESSMENT_RULES.defaultPassMark}% to
                        continue
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="ac-caption">
                Illustration of the lesson player — the sidebar tracks every atom
                you have finished.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            VALUE POINTS
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section">
          <div className="ac-container">
            <header className="ac-head">
              <div>
                <span className="ac-kicker">Why learn here</span>
                <h2 className="ac-h2">Designed to get you to the end</h2>
              </div>
              <p className="ac-head__sub">
                Most people who start an online course never finish it. Every rule
                below exists to change that, and it applies to every course we run.
              </p>
            </header>

            <div className="ac-values">
              {VALUE_POINTS.map((point) => (
                <div className="ac-value" key={point.kicker}>
                  <span className="ac-value__num">{point.kicker}</span>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            FLAGSHIP — the course that is fully built
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section ac-section--tint" id="flagship">
          <div className="ac-container">
            <header className="ac-head">
              <div>
                <span className="ac-kicker">Start here</span>
                <h2 className="ac-h2">Our flagship programme</h2>
              </div>
              <p className="ac-head__sub">
                Data Analysis is the first course we built end to end. Everything
                else on the roadmap runs on the same lesson, assessment and
                certification engine.
              </p>
            </header>

            <div className="ac-course">
              <article className="ac-course__panel">
                <div className="ac-course__panel-body">
                  <div className="ac-pill-row">
                    <span className="ac-pill">
                      {flagship.course.durationMonths} months
                    </span>
                    <span className="ac-pill">{flagship.course.level}</span>
                  </div>

                  <h3 className="ac-course__title">
                    {flagship.course.title}
                    <span>{flagship.course.subtitle}</span>
                  </h3>

                  <p className="ac-course__text">{flagship.course.tagline}</p>

                  <dl className="ac-course__specs">
                    <div>
                      <dt>Modules</dt>
                      <dd>{flagshipStats.modules}</dd>
                    </div>
                    <div>
                      <dt>Learning atoms</dt>
                      <dd>{flagshipStats.atoms}</dd>
                    </div>
                    <div>
                      <dt>Projects</dt>
                      <dd>{flagshipStats.projects}</dd>
                    </div>
                    <div>
                      <dt>Per week</dt>
                      <dd>{flagship.course.hoursPerWeek} hrs</dd>
                    </div>
                  </dl>

                  <button
                    className="ac-btn ac-btn--light ac-btn--lg"
                    onClick={() => enroll(flagship.slug)}
                  >
                    Start learning
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </button>
                </div>

                <MediaSlot
                  src={ACADEMY_MEDIA.courseVisual}
                  alt="Excel, Power BI and Python"
                  label="Course visual"
                  hint="900 × 640 · transparent PNG"
                  ratio="7 / 5"
                  className="ac-course__art"
                />
              </article>

              <aside className="ac-outcomes">
                <h3>What you will be able to do</h3>
                <ul>
                  {flagship.course.outcomes.map((outcome) => (
                    <li key={outcome}>
                      <i className="fas fa-check" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>

                <div className="ac-outcomes__foot">
                  <span className="ac-kicker">Who it is for</span>
                  <p>
                    Complete beginners who have never written a formula, graduates
                    building an analytics portfolio, and anyone moving into a data
                    role.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            FLAGSHIP CURRICULUM
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section" id="curriculum">
          <div className="ac-container">
            <header className="ac-head">
              <div>
                <span className="ac-kicker">Inside Data Analysis</span>
                <h2 className="ac-h2">
                  Four months, {flagshipStats.modules} modules
                </h2>
              </div>
              <p className="ac-head__sub">
                The full path from a first spreadsheet to a capstone you can put in
                front of an employer. This is the level of detail every Academy
                course gets before it opens.
              </p>
            </header>

            <div className="ac-curriculum">
              <div className="ac-months" role="tablist" aria-label="Course months">
                {flagship.course.months.map((month) => {
                  const active = month.month === activeMonth;
                  return (
                    <button
                      key={month.month}
                      role="tab"
                      aria-selected={active}
                      className={`ac-month ${active ? "is-active" : ""}`}
                      onClick={() => setActiveMonth(month.month)}
                    >
                      <span className="ac-month__num">Month {month.month}</span>
                      <span className="ac-month__title">{month.title}</span>
                      <span className="ac-month__focus">
                        {month.modules.length} modules ·{" "}
                        {month.modules.reduce((total, m) => total + m.atoms, 0)} atoms
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="ac-modules" role="tabpanel">
                <p className="ac-modules__intro">{selectedMonth.summary}</p>

                {selectedMonth.modules.map((module) => (
                  <article className="ac-module" key={module.id}>
                    <div className="ac-module__index">
                      {String(module.order).padStart(2, "0")}
                    </div>

                    <div className="ac-module__main">
                      <h3>
                        {module.title}
                        {module.type && (
                          <span className={`ac-tag ac-tag--${module.type}`}>
                            {module.type}
                          </span>
                        )}
                      </h3>
                      <p>{module.summary}</p>
                      <div className="ac-module__topics">
                        {module.topics.map((topic) => (
                          <span key={topic}>{topic}</span>
                        ))}
                      </div>
                    </div>

                    <div className="ac-module__meta">
                      <strong>{module.atoms}</strong>
                      <span>atoms</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            STATS BAND
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-band">
          <div className="ac-container ac-band__inner">
            {[
              {
                value: academy.coursesPlanned,
                label: "Courses",
                sub: "On the Academy roadmap",
              },
              {
                value: academy.coursesOpen,
                label: "Open now",
                sub: "Fully written, start today",
              },
              {
                value: academy.atoms,
                label: "Learning atoms",
                sub: "Live across open courses",
              },
              {
                value: `${academy.passMark}%`,
                label: "Pass mark",
                sub: "Required to progress",
              },
            ].map((item) => (
              <div className="ac-stat" key={item.label}>
                <strong>{item.value}</strong>
                <span className="ac-stat__label">{item.label}</span>
                <span className="ac-stat__sub">{item.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section" id="how-it-works">
          <div className="ac-container">
            <header className="ac-head">
              <div>
                <span className="ac-kicker">How it works</span>
                <h2 className="ac-h2">From sign-up to certificate</h2>
              </div>
              <p className="ac-head__sub">
                The same five stages in every course. You always know where you are
                and what unlocks next.
              </p>
            </header>

            <ol className="ac-journey">
              {JOURNEY.map((step, index) => (
                <li className="ac-journey__step" key={step.title}>
                  <div className="ac-journey__icon">
                    <i className={step.icon} aria-hidden="true" />
                  </div>
                  <span className="ac-journey__num">Step {index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CERTIFICATE
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section ac-section--tint" id="certificate">
          <div className="ac-container ac-cert">
            <div className="ac-cert__visual">
              {/* Drop a certificate image into src/academy/assets/ and point
                  ACADEMY_MEDIA.certificate at it. Until then this renders a
                  labelled placeholder at the right aspect ratio. */}
              <MediaSlot
                src={ACADEMY_MEDIA.certificate}
                alt={`Sample ${flagship.course.title} certificate`}
                label="Certificate image"
                hint="1200 × 850 · landscape"
                ratio="7 / 5"
                className="ac-cert__image"
              />
              <p className="ac-caption">
                Sample certificate. Every issued certificate carries a unique ID.
              </p>
            </div>

            <div className="ac-cert__copy">
              <span className="ac-kicker">Certification</span>
              <h2 className="ac-h2">A certificate that can be checked</h2>
              <p className="ac-lead">
                Finish any Academy programme and you earn a Memora Smart certificate
                carrying a unique certificate ID tied to your Memora ID. Anyone — an
                employer, a client — will be able to enter that ID on our public
                verification page and confirm it is genuine.
              </p>

              <h3 className="ac-cert__subhead">To become eligible you must</h3>
              <ul className="ac-checklist">
                <li>
                  <i className="fas fa-check" aria-hidden="true" />
                  Complete every required lesson in the course
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true" />
                  Pass every required assessment at {ASSESSMENT_RULES.defaultPassMark}%
                  or above
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true" />
                  Submit the practical projects
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true" />
                  Complete the final capstone
                </li>
              </ul>

              <p className="ac-body ac-body--muted">
                Certificates are issued from real completion records. There is no
                way to earn one without doing the work.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-section" id="faq">
          <div className="ac-container ac-faq">
            <div className="ac-faq__head">
              <span className="ac-kicker">Questions</span>
              <h2 className="ac-h2">Before you start</h2>
              <p className="ac-body ac-body--muted">
                Anything else, reach us through the{" "}
                <a href="/#contact">contact form</a> on the main site.
              </p>
            </div>

            <div className="ac-faq__list">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    className={`ac-faq__item ${isOpen ? "is-open" : ""}`}
                    key={faq.q}
                  >
                    <button
                      className="ac-faq__q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      <span>{faq.q}</span>
                      <i
                        className={isOpen ? "fas fa-minus" : "fas fa-plus"}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && <p className="ac-faq__a">{faq.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CLOSING CTA
        ══════════════════════════════════════════════════════════ */}
        <section className="ac-cta">
          <div className="ac-container ac-cta__inner">
            <div>
              <h2>Your future starts with one atom.</h2>
              <p>
                Register free, get your Memora ID, and start the course that is open
                today. More open through the year.
              </p>
            </div>
            <button
              className="ac-btn ac-btn--light ac-btn--lg"
              onClick={() =>
                user ? navigate("/academy/learn") : enroll(flagship.slug)
              }
            >
              {user ? "Continue learning" : "Enroll free"}
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <AcademyFooter />
    </div>
  );
}
