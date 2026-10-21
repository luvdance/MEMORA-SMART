import DATA_ANALYSIS_COURSE from "./dataAnalysisCourse.js";
import CYBERSECURITY_COURSE from "./cybersecurityCourse.js";
import MATHEMATICS_COURSE from "./mathematicsCourse.js";
import JAVASCRIPT_COURSE from "./javascriptCourse.js";
import FOREX_COURSE from "./forexCourse.js";
import PYTHON_COURSE from "./pythonCourse.js";
import CPP_COURSE from "./cppCourse.js";
import WEB_DEVELOPMENT_COURSE from "./webDevelopmentCourse.js";
import CODEBASE_ENGINEERING_COURSE from "./codebaseEngineeringCourse.js";
import REACT_COURSE from "./reactCourse.js";

/**
 * MEMORA SMART ACADEMY — COURSE CATALOG
 *
 * Every Academy surface reads courses from here, never from a hard-coded
 * component. Adding a course means adding a record, not editing UI.
 * When content moves to Firestore this module becomes the loader
 * (`getCourses()` / `getCourseBySlug()`) and callers do not change.
 *
 * STATUS — what a learner can actually do today. Be honest here; the UI
 * renders these verbatim and only `open` courses are enrollable:
 *
 *   open     Curriculum written, lessons live, you can enroll right now.
 *   next     Being built. Named so the roadmap is visible, not enrollable.
 *   planned  On the roadmap, no build date committed.
 *
 * A course only carries `course:` (a full curriculum object) once it is open.
 * Unbuilt courses deliberately have no module or atom counts — inventing them
 * would put numbers on the page that nothing backs.
 */

/**
 * COURSE CODES.
 *
 * Every course carries a short, human-readable code alongside its id. The id
 * is what code matches on; the CODE is what a person quotes — in an
 * enrolment, on a certificate, in an email asking for help. "I am on DA-101"
 * is unambiguous in a way "the data one" is not.
 *
 * Convention: two-letter discipline, then a level.
 *   101   no prerequisite, starts from zero
 *   201   builds on the 101 in the same discipline
 *   301   advanced, assumes real working knowledge
 *
 * A code is PERMANENT once a learner has enrolled under it, because their
 * enrolment and any certificate record it. Rename a course freely; never
 * reissue its code to something else.
 */
export const STATUS_LABELS = {
  open: "Open now",
  next: "In development",
  planned: "Planned",
};

/**
 * BETA.
 *
 * Every course carries `beta: true` while the platform is still being tested
 * and improved. It is deliberately a SEPARATE flag from `status` rather than
 * a fourth status value: a course is both "open now" and "in beta" at the
 * same time, and folding the two together would break every `status ===
 * "open"` check that decides whether a course can be enrolled on.
 *
 * Remove the flag from an entry to take that one course out of beta. Nothing
 * else needs changing — the badge disappears with it.
 */
export const BETA_LABEL = "Beta";
export const BETA_NOTE =
  "This course is in beta. The lessons are complete and the content is verified, but we are still testing and improving as people work through it — tell us anything that looks wrong.";

export const CATEGORIES = [
  { id: "all", label: "All courses" },
  { id: "data", label: "Data & Analytics" },
  { id: "web", label: "Web Development" },
  { id: "ai", label: "AI & Automation" },
  { id: "creative", label: "Design & Content" },
  { id: "skills", label: "Digital Skills" },
];

export const CATALOG = [
  {
    id: "data-analysis",
    code: "DA-101",
    slug: "data-analysis",
    title: "Data Analysis",
    subtitle: "Beginner to Professional",
    category: "data",
    icon: "fas fa-chart-line",
    status: "open",
    beta: true,
    level: "Beginner → Professional",
    summary:
      "Clean messy data, build dashboards people actually use, and defend your findings to a business. Our flagship programme.",
    covers: ["Microsoft Excel", "Power BI", "Python", "Dashboards", "Capstone project"],
    course: DATA_ANALYSIS_COURSE,
  },
  {
    id: "cybersecurity",
    code: "CS-101",
    slug: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Beginner to Pro",
    // Listed under Digital Skills rather than a security category of its own:
    // one course does not justify a category that would sit empty beside it on
    // the filter bar. Move it when a second security course opens.
    category: "skills",
    icon: "fas fa-shield-halved",
    status: "open",
    beta: true,
    level: "Beginner → Pro",
    summary:
      "How attacks actually happen and how to stop them. Sixteen weeks from your first virtual machine to an authorised penetration test and a SOC detection you wrote yourself.",
    covers: [
      "Linux hardening",
      "Networks & Wireshark",
      "OWASP Top 10",
      "Penetration testing",
      "SIEM & incident response",
      "Capstone project",
    ],
    course: CYBERSECURITY_COURSE,
  },
  {
    id: "mathematics",
    code: "MA-101",
    slug: "mathematics",
    title: "Mathematics",
    subtitle: "Elementary to University-Ready",
    category: "skills",
    icon: "fas fa-square-root-variable",
    status: "open",
    beta: true,
    level: "Foundations → SS3",
    // Its own player. See the PLAYER note above.
    player: "/academy/maths",
    summary:
      "Start below JSS1 and finish past SS3. The language of the subject, then number, algebra, geometry, trigonometry and calculus - explained, worked, drilled and assessed, through to a certification exam and a university bridge.",
    covers: [
      "Number & numeration",
      "Algebra",
      "Geometry & mensuration",
      "Trigonometry",
      "Statistics & probability",
      "WAEC / NECO / JAMB technique",
    ],
    course: MATHEMATICS_COURSE,
  },
  {
    id: "javascript",
    code: "JS-101",
    slug: "javascript",
    title: "Object Oriented Programming (JavaScript)",
    subtitle: "Logic first, then JavaScript to React",
    category: "web",
    icon: "fab fa-js",
    status: "open",
    beta: true,
    level: "Absolute beginner → Job-ready",
    summary:
      "Learn to think like a programmer before you type a line: algorithms, pseudocode and flowcharts first, then JavaScript from variables to closures, classes and inheritance, the browser and APIs, and finally React. Every code example is run and verified.",
    covers: [
      "Programming logic",
      "JavaScript & Node.js",
      "Objects, classes & OOP",
      "DOM, events & storage",
      "APIs & async/await",
      "Git, Vite & React",
      "Capstone project",
    ],
    course: JAVASCRIPT_COURSE,
  },
  {
    id: "python",
    code: "PY-101",
    slug: "python",
    title: "Python Programming",
    subtitle: "Learn to program by writing Python",
    category: "web",
    icon: "fab fa-python",
    status: "open",
    beta: true,
    level: "Absolute beginner → Job-ready",
    summary:
      "Programming learned by doing it. Algorithms and flowcharts first, then Python from your first print() to files, OOP, testing, SQL, APIs and automation. Every time a lesson shows you something, you write code that uses it, run in the page and checked before you move on.",
    covers: [
      "Programming logic & flowcharts",
      "Core Python",
      "Strings & collections",
      "Files, errors & OOP",
      "Git & professional practice",
      "Algorithms, testing & SQL",
      "APIs & automation",
    ],
    course: PYTHON_COURSE,
  },
  {
    id: "cpp",
    code: "CP-101",
    slug: "cpp",
    title: "C++ Programming",
    subtitle: "Fundamentals to advanced development",
    category: "web",
    icon: "fas fa-microchip",
    status: "open",
    beta: true,
    level: "Complete beginner → Advanced",
    summary:
      "Learn the language behind game engines, browsers, operating systems and trading systems. Sixteen weeks from your first compiled program to memory and pointers, object-oriented design, the STL, modern C++, debugging and testing, and a capstone application you build and present. Every program in the course is compiled and run, so every output you see is real.",
    covers: [
      "Variables, operators, decisions & loops",
      "Functions, arrays, vectors & strings",
      "Pointers, references & memory",
      "Classes, inheritance & polymorphism",
      "Exceptions, files, templates & the STL",
      "Data structures & algorithms",
      "Modern C++, debugging, testing & CMake",
      "Capstone project",
    ],
    course: CPP_COURSE,
  },
  {
    id: "forex-trading",
    code: "FX-101",
    slug: "forex-trading",
    title: "Forex Trading",
    subtitle: "Foundations to professional practice",
    // Under Digital Skills for the same reason as Cybersecurity: one course
    // does not justify a finance category of its own on the filter bar.
    category: "skills",
    icon: "fas fa-money-bill-trend-up",
    status: "open",
    beta: true,
    level: "Complete beginner → Professional practice",
    summary:
      "Five months from your first currency quote to a tested, written trading plan. Real tools from Week 1 (an MT5 demo account, TradingView and a journal), risk mathematics before any strategy, and a four-week practical lab. Assessed on process, never on profit, and no promise that anyone becomes profitable.",
    covers: [
      "MT5 demo account & TradingView",
      "Pips, lots, leverage & position sizing",
      "Price action & technical analysis",
      "Fundamentals & the economic calendar",
      "Strategy building & backtesting",
      "Trading psychology & risk governance",
      "Four-week practical trading lab",
    ],
    course: FOREX_COURSE,
  },
  {
    id: "web-development",
    code: "WD-101",
    slug: "web-development",
    title: "Responsive Web Development",
    subtitle: "HTML, CSS and JavaScript, from first page to live site",
    category: "web",
    icon: "fas fa-code",
    status: "open",
    beta: true,
    level: "Absolute beginner → Job-ready",
    summary:
      "Build websites that work on every screen. Six phases from how the web works to semantic, accessible HTML; modern CSS, Flexbox, Grid and mobile-first responsive design; JavaScript from first principles; the DOM, forms, storage and APIs; Git, npm, Vite and testing; and deployment, performance, security and your portfolio. Every lesson makes you build a page, checked in a real browser at phone, tablet and laptop widths.",
    covers: [
      "Semantic HTML & accessible forms",
      "CSS, Flexbox & Grid",
      "Mobile-first responsive design",
      "JavaScript programming",
      "DOM, events, storage & APIs",
      "Git, npm, Vite & testing",
      "Deployment, performance & security",
      "Portfolio & capstone",
    ],
    course: WEB_DEVELOPMENT_COURSE,
  },
  {
    id: "codebase-engineering",
    code: "CE-101",
    slug: "codebase-engineering",
    title: "Codebase Engineering",
    subtitle: "Understand, navigate and own any codebase in the AI era",
    // Under AI & Automation: managing code that AI assistants and agents help
    // write is the point of the course, and it is the category's first open
    // course. It is equally a software engineering course; move it if a
    // software engineering category is added.
    category: "ai",
    icon: "fas fa-diagram-project",
    status: "open",
    beta: true,
    level: "Beginner–Intermediate → Professional",
    summary:
      "AI can generate code faster than anyone can read it, so the scarce skill is understanding and controlling a codebase. Eight weeks on a real, unfamiliar application: map it from the terminal, trace features from click to database, use Git to see and undo any change, put AI assistants and agents to work under review, debug with evidence, refactor safely and understand deployment and security. Every command was run on the real project, so every output you see is real.",
    covers: [
      "Bash, PowerShell & ripgrep",
      "Project archaeology & codebase maps",
      "Feature tracing & data flow",
      "Git, GitHub & reviewing AI changes",
      "Cursor, Claude Code, Copilot & Codex",
      "Debugging, logs & tests",
      "Refactoring & technical debt",
      "Environments, deployment & security",
    ],
    course: CODEBASE_ENGINEERING_COURSE,
  },
  {
    // The course reserved as WD-201 ("Frontend Libraries") while it was being
    // planned. It never opened under that name, so no enrolment records the
    // old slug; the code WD-201 is kept because WD-101 refers to it.
    id: "react",
    code: "WD-201",
    slug: "react",
    title: "React Development",
    subtitle: "Modern, Hooks-first React from foundations to production",
    category: "web",
    icon: "fab fa-react",
    status: "open",
    beta: true,
    level: "Intermediate → Job-ready",
    summary:
      "The step after Responsive Web Development (WD-101). Sixteen weeks of modern, Hooks-first React: components, props and state, forms, effects and custom Hooks, Context and Zustand, React Router, APIs and TanStack Query, Tailwind and TypeScript, then security, testing, performance and deployment. Every lesson makes you build a real React app, checked in a real browser.",
    covers: [
      "JSX, components & props",
      "State, events & forms",
      "Hooks & side effects",
      "Context, reducers & Zustand",
      "React Router",
      "APIs & TanStack Query",
      "Tailwind CSS & TypeScript",
      "Testing, performance & deployment",
    ],
    course: REACT_COURSE,
  },
  {
    id: "ai-automation",
    code: "AI-101",
    slug: "ai-automation",
    title: "AI & Automation",
    subtitle: "For work and for business",
    category: "ai",
    icon: "fas fa-robot",
    status: "next",
    beta: true,
    level: "Beginner → Intermediate",
    summary:
      "Use AI tools properly instead of guessing at them, and automate the repetitive work out of a real business.",
    covers: ["Prompt design", "Workflow automation", "AI tooling", "Integrations", "Practical use cases"],
  },
  {
    id: "content-creation",
    code: "CC-101",
    slug: "content-creation",
    title: "Content Creation",
    subtitle: "Plan, produce, publish",
    category: "creative",
    icon: "fas fa-video",
    status: "next",
    beta: true,
    level: "Beginner → Intermediate",
    summary:
      "Turn an idea into content that gets watched — scripting, shooting, editing and the discipline of publishing consistently.",
    covers: ["Content strategy", "Scripting", "Filming", "Editing", "Distribution"],
  },
  {
    id: "uiux-design",
    code: "UX-101",
    slug: "uiux-design",
    title: "UI/UX Design",
    category: "creative",
    icon: "fas fa-pen-ruler",
    status: "planned",
    beta: true,
    level: "Beginner → Professional",
    summary:
      "Research, wireframe and design interfaces people can use, then hand them over in a way developers can build.",
    covers: ["User research", "Wireframing", "Figma", "Design systems", "Prototyping"],
  },
  {
    id: "graphics-design",
    code: "GD-101",
    slug: "graphics-design",
    title: "Graphics Design",
    category: "creative",
    icon: "fas fa-palette",
    status: "planned",
    beta: true,
    level: "Beginner → Intermediate",
    summary:
      "Layout, typography and colour for brands, social media and print — the fundamentals before the software.",
    covers: ["Typography", "Colour", "Layout", "Branding", "Design tools"],
  },
  {
    id: "digital-marketing",
    code: "DM-101",
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "skills",
    icon: "fas fa-bullhorn",
    status: "planned",
    beta: true,
    level: "Beginner → Intermediate",
    summary:
      "Reach the right people and measure whether it worked, across social, search and email.",
    covers: ["Social media", "SEO basics", "Paid ads", "Email marketing", "Analytics"],
  },
  {
    id: "data-science",
    code: "DA-301",
    slug: "data-science",
    title: "Data Science",
    category: "data",
    icon: "fas fa-brain",
    status: "planned",
    beta: true,
    level: "Intermediate → Advanced",
    summary:
      "The step after Data Analysis — statistics, machine learning and modelling on real datasets.",
    covers: ["Statistics", "Machine learning", "Model evaluation", "Python libraries"],
  },
  {
    id: "microsoft-office",
    code: "MO-101",
    slug: "microsoft-office",
    title: "Microsoft Office",
    category: "skills",
    icon: "fas fa-file-lines",
    status: "planned",
    beta: true,
    level: "Absolute beginner → Intermediate",
    summary:
      "Word, Excel and PowerPoint to a standard an employer expects, taught for people starting from zero.",
    covers: ["Word", "Excel", "PowerPoint", "Professional documents"],
  },
];

/** Courses a learner can enroll in today. */
export const COURSES = CATALOG.filter((entry) => entry.status === "open").map(
  (entry) => entry.course
);

/** The course the Academy leads with. */
export const FLAGSHIP = CATALOG.find((entry) => entry.slug === "data-analysis");

export function getCourseBySlug(slug) {
  const entry = CATALOG.find((item) => item.slug === slug);
  return entry?.course || null;
}

export function getCatalogEntry(slug) {
  return CATALOG.find((item) => item.slug === slug) || null;
}

export function getByCategory(categoryId) {
  if (!categoryId || categoryId === "all") return CATALOG;
  return CATALOG.filter((entry) => entry.category === categoryId);
}

/** Flatten a full course into an ordered module list across all months. */
export function getModules(course) {
  return course.months.flatMap((month) =>
    month.modules.map((module) => ({ ...module, month: month.month }))
  );
}

/**
 * Figures quoted on marketing surfaces are DERIVED from the curriculum, never
 * typed by hand, so the page can never drift from the real course.
 */
export function getCourseStats(course) {
  const modules = getModules(course);
  return {
    months: course.durationMonths,
    modules: modules.length,
    atoms: modules.reduce((total, module) => total + (module.atoms || 0), 0),
    tools: course.tools.length,
    projects: modules.filter((m) => m.type === "project" || m.type === "capstone")
      .length,
  };
}

/** Academy-wide numbers for the stats band. Counts, not claims. */
export function getAcademyStats() {
  const open = CATALOG.filter((c) => c.status === "open");
  const atoms = open.reduce(
    (total, entry) => total + (entry.course ? getCourseStats(entry.course).atoms : 0),
    0
  );
  return {
    coursesPlanned: CATALOG.length,
    coursesOpen: open.length,
    atoms,
    passMark: 70,
  };
}
