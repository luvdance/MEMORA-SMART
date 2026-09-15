import DATA_ANALYSIS_COURSE from "./dataAnalysisCourse.js";

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

export const STATUS_LABELS = {
  open: "Open now",
  next: "In development",
  planned: "Planned",
};

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
    slug: "data-analysis",
    title: "Data Analysis",
    subtitle: "Beginner to Professional",
    category: "data",
    icon: "fas fa-chart-line",
    status: "open",
    level: "Beginner → Professional",
    summary:
      "Clean messy data, build dashboards people actually use, and defend your findings to a business. Our flagship programme.",
    covers: ["Microsoft Excel", "Power BI", "Python", "Dashboards", "Capstone project"],
    course: DATA_ANALYSIS_COURSE,
  },
  {
    id: "web-development",
    slug: "web-development",
    title: "Web Development",
    subtitle: "Foundations",
    category: "web",
    icon: "fas fa-code",
    status: "next",
    level: "Absolute beginner → Intermediate",
    summary:
      "Build and ship real websites from scratch. Structure, style, behaviour and deployment, with nothing assumed.",
    covers: ["HTML", "CSS", "JavaScript", "Responsive layout", "Git & deployment"],
  },
  {
    id: "frontend-libraries",
    slug: "frontend-libraries",
    title: "Frontend Libraries",
    subtitle: "React and the modern toolchain",
    category: "web",
    icon: "fas fa-layer-group",
    status: "next",
    level: "Intermediate",
    summary:
      "Move from plain JavaScript to component-driven applications, state management and a professional build setup.",
    covers: ["React", "Components & props", "State & hooks", "Routing", "Tailwind CSS"],
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    title: "AI & Automation",
    subtitle: "For work and for business",
    category: "ai",
    icon: "fas fa-robot",
    status: "next",
    level: "Beginner → Intermediate",
    summary:
      "Use AI tools properly instead of guessing at them, and automate the repetitive work out of a real business.",
    covers: ["Prompt design", "Workflow automation", "AI tooling", "Integrations", "Practical use cases"],
  },
  {
    id: "content-creation",
    slug: "content-creation",
    title: "Content Creation",
    subtitle: "Plan, produce, publish",
    category: "creative",
    icon: "fas fa-video",
    status: "next",
    level: "Beginner → Intermediate",
    summary:
      "Turn an idea into content that gets watched — scripting, shooting, editing and the discipline of publishing consistently.",
    covers: ["Content strategy", "Scripting", "Filming", "Editing", "Distribution"],
  },
  {
    id: "uiux-design",
    slug: "uiux-design",
    title: "UI/UX Design",
    category: "creative",
    icon: "fas fa-pen-ruler",
    status: "planned",
    level: "Beginner → Professional",
    summary:
      "Research, wireframe and design interfaces people can use, then hand them over in a way developers can build.",
    covers: ["User research", "Wireframing", "Figma", "Design systems", "Prototyping"],
  },
  {
    id: "graphics-design",
    slug: "graphics-design",
    title: "Graphics Design",
    category: "creative",
    icon: "fas fa-palette",
    status: "planned",
    level: "Beginner → Intermediate",
    summary:
      "Layout, typography and colour for brands, social media and print — the fundamentals before the software.",
    covers: ["Typography", "Colour", "Layout", "Branding", "Design tools"],
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "skills",
    icon: "fas fa-bullhorn",
    status: "planned",
    level: "Beginner → Intermediate",
    summary:
      "Reach the right people and measure whether it worked, across social, search and email.",
    covers: ["Social media", "SEO basics", "Paid ads", "Email marketing", "Analytics"],
  },
  {
    id: "data-science",
    slug: "data-science",
    title: "Data Science",
    category: "data",
    icon: "fas fa-brain",
    status: "planned",
    level: "Intermediate → Advanced",
    summary:
      "The step after Data Analysis — statistics, machine learning and modelling on real datasets.",
    covers: ["Statistics", "Machine learning", "Model evaluation", "Python libraries"],
  },
  {
    id: "microsoft-office",
    slug: "microsoft-office",
    title: "Microsoft Office",
    category: "skills",
    icon: "fas fa-file-lines",
    status: "planned",
    level: "Absolute beginner → Intermediate",
    summary:
      "Word, Excel and PowerPoint to a standard an employer expects, taught for people starting from zero.",
    covers: ["Word", "Excel", "PowerPoint", "Professional documents"],
  },
  {
    id: "cybersecurity",
    slug: "cybersecurity",
    title: "Cybersecurity",
    category: "skills",
    icon: "fas fa-shield-halved",
    status: "planned",
    level: "Beginner → Intermediate",
    summary:
      "How attacks actually happen and the practical habits that stop them, for individuals and small teams.",
    covers: ["Threat basics", "Safe practice", "Network fundamentals", "Incident response"],
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
