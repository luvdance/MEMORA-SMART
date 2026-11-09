import { useEffect, useRef, useState } from "react";
import "./Portfolio.css";
import profilePic from "../assets/profile pic2.jpg";

/* ─────────────────────────────────────────────────────────────────────────
 * Daniel Nwankwo — personal portfolio (/daniel-nwankwo)
 *
 * Everything on this page describes work that exists in this repository or
 * is live on the web. Academy figures were counted from catalog.js
 * (getAcademyStats / getCourseStats) on 2026-11-07. Update them when courses
 * open; they are hard-coded on purpose so this page does not pull every
 * course outline into its chunk.
 *
 * The "illusions" are CSS: a perspective tunnel, extruded chromatic type, a
 * conic moiré ring, a scintillating grid, a 3D cube, the café wall, the
 * stepping-feet motion illusion, a Kanizsa triangle and holographic tilt
 * cards. All motion stops under prefers-reduced-motion.
 * ───────────────────────────────────────────────────────────────────────── */

const SITE = "https://www.memorasmart.com";
const NAME = "Daniel Ewezugachi Nwankwo";
const EMAIL = "danielnwankwo@memorasmart.com";
const GITHUB_URL = "https://github.com/luvdance";
const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-nwankwo-baa26b149";

const ROLES = ["platforms", "AI tools", "browser labs", "payments", "courses", "platforms"];

const STATS = [
  { value: 12, suffix: "+", label: "products shipped" },
  { value: 14, suffix: "", label: "courses authored" },
  { value: 294, suffix: "", label: "course modules" },
  { value: 4323, suffix: "", label: "graded learning units" },
];

const MARQUEE = [
  "React 19", "Node.js", "Express", "PostgreSQL", "Python", "C++", "TypeScript",
  "Firebase", "Claude API", "React Native", "Expo", "Vercel", "Paystack",
  "Tailwind", "WebAssembly", "Prisma", "MySQL", "Puppeteer", "esbuild", "Vite",
];

const CUBE_FACES = [
  { face: "front", title: "Frontend", items: ["React 19", "Vite", "Tailwind", "Web Workers"] },
  { face: "back", title: "Backend", items: ["Node.js", "Express", "Serverless", "REST & webhooks"] },
  { face: "right", title: "Data", items: ["PostgreSQL", "MySQL", "Firestore", "SQL & Prisma"] },
  { face: "left", title: "Mobile", items: ["React Native", "Expo Router", "SQLite", "iOS & Android"] },
  { face: "top", title: "AI", items: ["Claude API", "Streaming", "Prompt design", "Guardrails"] },
  { face: "bottom", title: "Systems", items: ["C++", "Python", "Algorithms", "Security"] },
];

const SKILL_GROUPS = [
  {
    n: "01",
    title: "Languages",
    items: ["JavaScript (ES2025)", "TypeScript", "Python", "C++", "SQL", "HTML & CSS", "Bash"],
  },
  {
    n: "02",
    title: "Frontend",
    items: ["React 19 & Hooks", "React Router", "React Query", "Tailwind CSS", "Vite & code splitting", "Responsive & accessible UI", "WebAudio & Speech APIs"],
  },
  {
    n: "03",
    title: "Backend & APIs",
    items: ["Node.js", "Express 5", "Vercel serverless", "Auth (JWT, Firebase Auth)", "Webhooks & idempotency", "Headless Chrome PDF", "Cron jobs"],
  },
  {
    n: "04",
    title: "Data & Databases",
    items: ["PostgreSQL 18", "MySQL 8", "Prisma ORM", "Firestore & security rules", "PGlite / WASM", "Excel, Power BI, pandas"],
  },
  {
    n: "05",
    title: "Mobile",
    items: ["React Native", "Expo SDK & Expo Router", "Offline storage", "Notifications & permissions"],
  },
  {
    n: "06",
    title: "AI Engineering",
    items: ["Anthropic Claude API", "Streaming (NDJSON)", "Structured outputs", "Truthfulness guards", "AI-assisted codebases"],
  },
  {
    n: "07",
    title: "Payments & Product",
    items: ["Paystack subscriptions", "Plans & entitlements", "SEO prerendering", "PostHog analytics", "Admin tooling"],
  },
  {
    n: "08",
    title: "Quality & Tooling",
    items: ["Differential testing", "Self-test harnesses", "esbuild bundling", "Puppeteer automation", "Git", "ESLint"],
  },
];

const ENGINE = [
  {
    k: "01",
    title: "A Node.js computer inside a browser tab",
    text: "Students run real Express, real zod, real JWT and the real pg driver on a virtual machine with its own clock, file system and network. A differential checker runs the same project on real Node and proves the output matches.",
  },
  {
    k: "02",
    title: "PostgreSQL 18, in a Web Worker",
    text: "Every SQL lab runs on actual PostgreSQL compiled to WebAssembly (PGlite). No fake results: the answer you see is Postgres's own, graded against a model query on the same server.",
  },
  {
    k: "03",
    title: "A practice phone with real Expo Router",
    text: "Mobile labs boot React Native apps on a simulated device, with permissions, notifications, offline mode and SQLite. Model answers are type-checked against the real Expo SDK types.",
  },
  {
    k: "04",
    title: "An AI interview coach that listens",
    text: "Memotify's mock interviewer streams Claude's questions over NDJSON and talks through the browser's speech APIs. The server owns the transcript, so nobody can game the count.",
  },
  {
    k: "05",
    title: "Billing that cannot double-grant",
    text: "Paystack subscriptions and one-time plans, granted idempotently per payment reference whether the webhook, the verify call or a requery arrives first. Plan rules are one pure module shared by browser and server.",
  },
  {
    k: "06",
    title: "An 11 MB site, made light",
    text: "Lazy routes, per-module lesson chunks, deferred analytics, stale-deploy recovery, and build-time prerendered meta so every link preview on WhatsApp and LinkedIn shows the right page.",
  },
];

const PROJECTS = [
  {
    id: "01",
    title: "Memora Smart Technologies",
    kind: "SaaS platform · Founder",
    desc: "The company I built: career tools and practical tech education for Nigerians, in one React app with serverless APIs, Firebase, Claude and Paystack.",
    tags: ["React", "Node.js", "Vercel", "Firebase", "Claude API", "Paystack"],
    href: SITE,
    feature: true,
  },
  {
    id: "02",
    title: "Memotify",
    kind: "Job platform",
    desc: "Current jobs Nigerian graduates can actually take, pulled from employer boards. Skills are backed by evidence tiers, and an AI coach runs mock interviews.",
    tags: ["React", "Node.js", "Firebase Admin", "Claude API", "Cron"],
    href: `${SITE}/memotify`,
  },
  {
    id: "03",
    title: "Memora Smart Academy",
    kind: "Learning platform",
    desc: "14 open courses with in-browser labs that run real code: Python, C++, SQL, Node.js, React and React Native. XP levels, graded practice, certification exams and a touch-typing dojo.",
    tags: ["React", "WebAssembly", "PGlite", "Web Workers", "esbuild"],
    href: `${SITE}/academy`,
    feature: true,
  },
  {
    id: "04",
    title: "AI CV Builder",
    kind: "Document tool",
    desc: "Build, style and download CVs from many templates, with AI quick-edit, shareable links, admin corrections and paid plans.",
    tags: ["React", "Puppeteer", "react-pdf", "docx", "Paystack"],
    href: `${SITE}/cv-builder`,
  },
  {
    id: "05",
    title: "ATS Checker & CV Optimiser",
    kind: "AI tool",
    desc: "Scores a CV against applicant tracking systems and rewrites it for the job, parsing PDF and Word uploads in the browser.",
    tags: ["Claude API", "pdf.js", "mammoth", "Serverless"],
    href: `${SITE}/ats-check`,
  },
  {
    id: "06",
    title: "Project Pilot",
    kind: "Academic formatter",
    desc: "Turns a finished final-year project into a properly formatted document: chapters, headings, citations and the layout a department asks for.",
    tags: ["Python", "python-docx", "Claude API", "React"],
    href: `${SITE}/projectpilot`,
  },
  {
    id: "07",
    title: "Typing Dojo",
    kind: "Game-style tutor",
    desc: "Touch typing taught like a game: lessons for letters, symbols and code, its own XP ladder, achievements, a public leaderboard and music made with WebAudio.",
    tags: ["React", "WebAudio", "Firestore"],
    href: `${SITE}/academy/typing`,
  },
  {
    id: "08",
    title: "Mercy's Closet Luxe",
    kind: "E-commerce",
    desc: "A fashion boutique storefront with a rich visual UI, a dark-mode toggle and ordering through the WhatsApp Business API.",
    tags: ["JavaScript", "Bootstrap", "Node.js", "Firestore", "WhatsApp API"],
    href: "https://mercyscloset.vercel.app/",
  },
  {
    id: "09",
    title: "Pre-Retirement Portal",
    kind: "Finance tool",
    desc: "Helps people plan retirement: savings calculators, progress tracking and resources for better financial decisions.",
    tags: ["JavaScript", "Bootstrap", "Node.js", "Firebase"],
    href: "https://pre-retirement-portal.vercel.app/",
  },
  {
    id: "10",
    title: "Accounts & Dashboard",
    kind: "Auth system",
    desc: "Sign-in, protected routes and one dashboard for every Memora product, with Firestore rules that stop users granting themselves paid features.",
    tags: ["Firebase Auth", "Firestore rules", "React"],
    href: `${SITE}/dashboard`,
  },
  {
    id: "11",
    title: "Free Library & Guides",
    kind: "Content platform",
    desc: "Free books and career guides on Excel, remote work, AI side hustles and content creation, with paid titles sold through Paystack.",
    tags: ["React", "Paystack", "SEO"],
    href: `${SITE}/library`,
  },
  {
    id: "12",
    title: "Sports Oracle",
    kind: "Analytics app",
    desc: "Turns raw sports data into predictions and compares model probabilities with market odds to surface value.",
    tags: ["React", "Node.js", "Claude API", "Firebase"],
    href: "https://sports-oracle-sigma.vercel.app/",
    feature: true,
  },
];

const COURSES = [
  ["DA-101", "Data Analysis"],
  ["CS-101", "Cybersecurity"],
  ["MA-101", "Mathematics"],
  ["JS-101", "OOP with JavaScript"],
  ["PY-101", "Python Programming"],
  ["CP-101", "C++ Programming"],
  ["AL-101", "Design & Analysis of Algorithms"],
  ["FX-101", "Forex Trading"],
  ["WD-101", "Responsive Web Development"],
  ["CE-101", "Codebase Engineering"],
  ["WD-201", "React Development"],
  ["MD-101", "Mobile App Development"],
  ["DB-101", "Relational Databases & SQL"],
  ["BE-101", "Backend Engineering with Node.js"],
];

const STORY = [
  {
    n: "01",
    title: "It started with one real problem",
    text: "I picked up code to fix something small and practical, and never stopped. That habit of turning a messy process into something clean became the way I work.",
  },
  {
    n: "02",
    title: "Then I built a company around it",
    text: "Memora Smart Technologies gives Nigerians the tools and skills employers expect: a CV builder, an ATS checker, a job platform and an academy. I design it, write it, ship it and keep it running.",
  },
  {
    n: "03",
    title: "I teach what I build",
    text: "I wrote 14 courses, from Python and C++ to backend engineering and mobile apps. Every lab runs real code, which meant building the machines that run it.",
  },
];

/* ── hooks ─────────────────────────────────────────────────────────────── */

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** One observer reveals every [data-reveal] element once. */
function useRevealAll(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll("[data-reveal]");
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [rootRef]);
}

/** Pointer position and scroll progress as CSS variables on the page. */
function usePointerAndScroll(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 3;

    const paint = () => {
      frame = 0;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      root.style.setProperty("--px", `${px}px`);
      root.style.setProperty("--py", `${py}px`);
      root.style.setProperty("--mx", ((px / w) * 2 - 1).toFixed(3));
      root.style.setProperty("--my", ((py / h) * 2 - 1).toFixed(3));
      const max = document.documentElement.scrollHeight - h;
      root.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      queue();
    };

    paint();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    if (!prefersReducedMotion()) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("pointermove", onMove);
    };
  }, [rootRef]);
}

/* ── small components ──────────────────────────────────────────────────── */

function CountUp({ value, suffix }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const run = (t) => {
        const k = Math.min(1, (t - start) / 1600);
        const eased = 1 - Math.pow(1 - k, 4);
        setShown(Math.round(value * eased));
        if (k < 1) raf = requestAnimationFrame(run);
      };
      setShown(0);
      raf = requestAnimationFrame(run);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="dn-stat-num">
      {shown.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function tilt(e) {
  if (prefersReducedMotion()) return;
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  card.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
  card.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
  card.style.setProperty("--gx", `${x * 100}%`);
  card.style.setProperty("--gy", `${y * 100}%`);
}

function untilt(e) {
  const card = e.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
}

function Kanizsa() {
  // Three discs with a wedge cut out. No triangle is drawn: the brain
  // completes the edges between the wedges.
  const pts = [
    [100, 44],
    [170, 165],
    [30, 165],
  ];
  return (
    <svg className="dn-kanizsa" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <mask id="dn-kz-mask">
          <rect width="200" height="200" fill="white" />
          <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="black" />
        </mask>
      </defs>
      <g mask="url(#dn-kz-mask)">
        {pts.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="30" className="dn-kz-disc" />
        ))}
      </g>
    </svg>
  );
}

/* ── page ──────────────────────────────────────────────────────────────── */

export default function Portfolio() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useRevealAll(rootRef);
  usePointerAndScroll(rootRef);

  const year = new Date().getFullYear();
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="dn-page" ref={rootRef}>
      <div className="dn-progress" aria-hidden="true" />
      <div className="dn-spotlight" aria-hidden="true" />
      <div className="dn-grain" aria-hidden="true" />

      {/* NAV */}
      <nav className={`dn-nav${menuOpen ? " is-open" : ""}`} aria-label="Main">
        <a href="#top" className="dn-logo" onClick={closeMenu} aria-label="Back to top">
          <span className="dn-logo-cube" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>DN</span>
        </a>
        <button
          type="button"
          className="dn-burger"
          aria-expanded={menuOpen}
          aria-controls="dn-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="dn-sr">Menu</span>
          <i /><i />
        </button>
        <div className="dn-nav-links" id="dn-menu">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#engine" onClick={closeMenu}>Engine room</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#academy" onClick={closeMenu}>Courses</a>
          <a href={`mailto:${EMAIL}`} className="dn-nav-cta" onClick={closeMenu}>
            Hire me
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="dn-hero">
        <div className="dn-tunnel" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={{ "--i": i }} />
          ))}
        </div>
        <div className="dn-floor" aria-hidden="true" />

        <div className="dn-hero-inner">
          <div className="dn-hero-copy">
            <p className="dn-kicker">
              <span className="dn-dot" /> Full-stack engineer · Founder, Memora Smart
            </p>
            <h1 className="dn-name">
              <span className="dn-name-line dn-extrude" data-text="DANIEL">DANIEL</span>
              <span className="dn-name-line dn-outline" data-text="NWANKWO">NWANKWO</span>
            </h1>
            <p className="dn-roles">
              I build
              <span className="dn-roles-window" aria-hidden="true">
                <span className="dn-roles-track">
                  {ROLES.map((r, i) => (
                    <span key={i}>{r}</span>
                  ))}
                </span>
              </span>
              <span className="dn-sr">platforms, AI tools, browser labs, payments and courses</span>
              <br />
              that real people pay for and learn from.
            </p>
            <div className="dn-hero-actions">
              <a href="#work" className="dn-btn dn-btn-solid">
                <span>See the work</span>
              </a>
              <a href="#engine" className="dn-btn dn-btn-ghost">
                <span>How it's built ↓</span>
              </a>
            </div>
          </div>

          <div className="dn-portrait">
            <div className="dn-ring dn-ring-a" aria-hidden="true" />
            <div className="dn-ring dn-ring-b" aria-hidden="true" />
            <div className="dn-orbit" aria-hidden="true">
              <span>React</span>
              <span>Node</span>
              <span>SQL</span>
              <span>AI</span>
            </div>
            <div className="dn-photo">
              <img src={profilePic} alt={NAME} width="420" height="420" />
            </div>
            <span className="dn-badge">
              <span className="dn-dot" /> Available for work
            </span>
          </div>
        </div>

        <a href="#about" className="dn-scroll-cue" aria-label="Scroll to About">
          <span />
        </a>
      </header>

      {/* MARQUEE */}
      <div className="dn-marquee" aria-label="Technologies I use">
        <div className="dn-marquee-row">
          {[0, 1].map((k) => (
            <div className="dn-marquee-track" key={k} aria-hidden={k === 1}>
              {MARQUEE.map((t) => (
                <span key={t}>{t}<b>✦</b></span>
              ))}
            </div>
          ))}
        </div>
        <div className="dn-marquee-row dn-marquee-rev" aria-hidden="true">
          {[0, 1].map((k) => (
            <div className="dn-marquee-track" key={k}>
              {[...MARQUEE].reverse().map((t) => (
                <span key={t}>{t}<b>◆</b></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="dn-section dn-about">
        <div className="dn-section-head" data-reveal>
          <span className="dn-label">01 — About</span>
          <h2 className="dn-h2">
            One engineer.
            <br />
            <em>A whole platform.</em>
          </h2>
        </div>

        <div className="dn-about-grid">
          <div className="dn-story">
            {STORY.map((s) => (
              <article className="dn-story-item" key={s.n} data-reveal>
                <span className="dn-story-n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="dn-stats" data-reveal>
            {STATS.map((s) => (
              <div className="dn-stat" key={s.label}>
                <CountUp value={s.value} suffix={s.suffix} />
                <span className="dn-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="dn-section dn-skills">
        <div className="dn-scint" aria-hidden="true" />
        <div className="dn-section-head" data-reveal>
          <span className="dn-label">02 — Skill set</span>
          <h2 className="dn-h2">
            Front to back.
            <br />
            <em>Browser to database.</em>
          </h2>
          <p className="dn-lede">
            Count the black dots in the grid behind this text. There aren't any: the
            grid is grey and white. What you know is what you can show, so every
            skill below is used in something live.
          </p>
        </div>

        <div className="dn-skills-layout">
          <div className="dn-cube-stage" data-reveal>
            <div className="dn-cube">
              {CUBE_FACES.map((f) => (
                <div className={`dn-face dn-face-${f.face}`} key={f.face}>
                  <strong>{f.title}</strong>
                  {f.items.map((i) => (
                    <span key={i}>{i}</span>
                  ))}
                </div>
              ))}
            </div>
            <div className="dn-cube-shadow" />
          </div>

          <div className="dn-skill-grid">
            {SKILL_GROUPS.map((g) => (
              <article className="dn-skill-card" key={g.n} data-reveal>
                <header>
                  <span>{g.n}</span>
                  <h3>{g.title}</h3>
                </header>
                <ul>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ENGINE ROOM */}
      <section id="engine" className="dn-section dn-engine">
        <div className="dn-engine-head" data-reveal>
          <Kanizsa />
          <div>
            <span className="dn-label">03 — Engine room</span>
            <h2 className="dn-h2">
              Impossible things,
              <br />
              <em>made to work.</em>
            </h2>
            <p className="dn-lede">
              Nobody drew the triangle in that box. Your brain fills in the edges.
              Good engineering works the same way: people see a smooth product, not
              the machinery underneath. Here is some of that machinery.
            </p>
          </div>
        </div>

        <ol className="dn-engine-list">
          {ENGINE.map((e) => (
            <li className="dn-engine-item" key={e.k} data-reveal>
              <span className="dn-engine-k">{e.k}</span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* STEPPING-FEET INTERLUDE */}
      <section className="dn-feet" aria-label="Motion illusion">
        <div className="dn-feet-stage" tabIndex={0}>
          <span className="dn-foot dn-foot-a" />
          <span className="dn-foot dn-foot-b" />
        </div>
        <p className="dn-feet-caption">
          <strong>The two blocks look like they take turns stepping.</strong> They move
          at exactly the same steady speed. Hover or tap the stripes to remove them and
          see. Details change what people perceive, and I sweat the details.
        </p>
      </section>

      {/* WORK */}
      <section id="work" className="dn-section dn-work">
        <div className="dn-section-head" data-reveal>
          <span className="dn-label">04 — Selected work</span>
          <h2 className="dn-h2">
            Shipped, live,
            <br />
            <em>and used.</em>
          </h2>
        </div>

        <div className="dn-work-grid">
          {PROJECTS.map((p) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`dn-card${p.feature ? " dn-card-feature" : ""}`}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              data-reveal
            >
              <span className="dn-card-holo" aria-hidden="true" />
              <span className="dn-card-top">
                <span className="dn-card-id">{p.id}</span>
                <span className="dn-card-kind">{p.kind}</span>
              </span>
              <span className="dn-card-title">{p.title}</span>
              <span className="dn-card-desc">{p.desc}</span>
              <span className="dn-card-tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
              <span className="dn-card-link">
                Visit project <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* CAFÉ WALL + ACADEMY */}
      <div className="dn-cafe" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} style={{ "--row": i }} />
        ))}
      </div>
      <p className="dn-cafe-note">
        ↑ Every line in that wall is perfectly straight and parallel. Café-wall illusion.
      </p>

      <section id="academy" className="dn-section dn-academy">
        <div className="dn-section-head" data-reveal>
          <span className="dn-label">05 — Courses I wrote</span>
          <h2 className="dn-h2">
            14 courses.
            <br />
            <em>All real code.</em>
          </h2>
          <p className="dn-lede">
            Every course on Memora Smart Academy is mine, from outline to final
            exam. Labs run Python, compiled C++, PostgreSQL, Node.js, React and React
            Native in the browser, so students practise on the real thing.
          </p>
        </div>

        <ul className="dn-course-grid">
          {COURSES.map(([code, title], i) => (
            <li key={code} data-reveal style={{ "--d": `${(i % 7) * 60}ms` }}>
              <a href={`${SITE}/academy/courses`} target="_blank" rel="noopener noreferrer">
                <span className="dn-course-code">{code}</span>
                <span className="dn-course-title">{title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* CONTACT */}
      <footer id="contact" className="dn-contact">
        <div className="dn-moire" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="dn-contact-inner" data-reveal>
          <span className="dn-label">06 — Contact</span>
          <h2 className="dn-contact-title">
            Let's build
            <br />
            <span className="dn-extrude" data-text="something real.">something real.</span>
          </h2>
          <p className="dn-lede">
            Need a product built end to end, a platform rescued, or AI added to
            something that already works? I'm taking on new work.
          </p>
          <a href={`mailto:${EMAIL}`} className="dn-mail">
            {EMAIL}
          </a>
          <div className="dn-socials">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href={SITE} target="_blank" rel="noopener noreferrer">Memora Smart ↗</a>
          </div>
        </div>
        <p className="dn-copy">
          © {year} {NAME}. Designed and built by hand. No templates.
        </p>
      </footer>
    </div>
  );
}
