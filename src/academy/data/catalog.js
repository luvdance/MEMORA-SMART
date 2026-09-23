import DATA_ANALYSIS_COURSE from "./dataAnalysisCourse.js";
import CYBERSECURITY_COURSE from "./cybersecurityCourse.js";

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
    id: "web-development",
    code: "WD-101",
    slug: "web-development",
    title: "Web Development",
    subtitle: "Foundations",
    category: "web",
    icon: "fas fa-code",
    status: "next",
    beta: true,
    level: "Absolute beginner → Intermediate",
    summary:
      "Build and ship real websites from scratch. Structure, style, behaviour and deployment, with nothing assumed.",
    covers: ["HTML", "CSS", "JavaScript", "Responsive layout", "Git & deployment"],
  },
  {
    id: "frontend-libraries",
    code: "WD-201",
    slug: "frontend-libraries",
    title: "Frontend Libraries",
    subtitle: "React and the modern toolchain",
    category: "web",
    icon: "fas fa-layer-group",
    status: "next",
    beta: true,
    level: "Intermediate",
    summary:
      "Move from plain JavaScript to component-driven applications, state management and a professional build setup.",
    covers: ["React", "Components & props", "State & hooks", "Routing", "Tailwind CSS"],
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
