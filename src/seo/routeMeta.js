/**
 * PER-ROUTE METADATA — one source of truth
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE BUG THIS FIXES
 *
 * Sharing https://www.memorasmart.com on WhatsApp showed "Memora Smart — AI
 * CV Builder for Nigerians". So did sharing the Academy. So did every other
 * page, because every route is served the same index.html and that file
 * hardcoded the CV builder's Open Graph tags.
 *
 * useSEO() already set og:title and og:description at runtime — and that does
 * nothing for this problem. WhatsApp, Facebook, LinkedIn, Twitter/X and
 * Slack fetch the URL and read the HTML; they do NOT execute JavaScript. By
 * the time React updates the tags, the crawler has taken its snapshot and
 * gone. A single-page app cannot fix link previews from inside the page.
 *
 * So the meta has to be in the HTML that is SERVED. scripts/prerenderMeta.mjs
 * reads this file at build time and writes a real index.html per route, each
 * with its own tags. React then hydrates over it exactly as before.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ADDING A ROUTE: add an entry here. The build picks it up, the runtime hook
 * picks it up, and the two cannot disagree — which is the point of the file.
 *
 * PRIVATE ROUTES are deliberately absent. A dashboard or a lesson player has
 * no business generating a link preview, and `noindex` keeps them out of
 * search results; see NOINDEX_PREFIXES.
 */

export const SITE = {
  name: "Memora Smart Technologies",
  origin: "https://www.memorasmart.com",
  /** Fallback share image. A route may override with its own. */
  image: "/og-image.png",
  locale: "en_NG",
  twitter: "summary_large_image",
};

/**
 * The company description, for the root.
 *
 * Deliberately NOT the CV builder's. The root is the company, and it has more
 * than one product — a visitor who lands there from a shared link should be
 * told what Memora Smart is, then find the product they want.
 */
export const ROUTE_META = {
  "/": {
    title: "Memora Smart Technologies — Career Tools and Practical Tech Education",
    description:
      "Nigerian-built software and training for people getting into work and getting ahead in it. Build a professional CV with AI, check it against an ATS, and learn data, web and AI skills at Memora Smart Academy.",
    type: "website",
  },

  /* ── Products ─────────────────────────────────────────────────────── */
  "/cv-builder": {
    title: "AI CV Builder for Nigerians — Memora Smart",
    description:
      "Build a professional CV in minutes with AI. Formats Nigerian employers expect, including NYSC and government, with templates you can edit and download.",
    type: "website",
  },
  "/ats-check": {
    title: "Free ATS CV Checker — Memora Smart",
    description:
      "Paste your CV and see what an applicant tracking system sees. Find the formatting and keyword problems that get a CV filtered out before a person reads it.",
    type: "website",
  },
  "/projectpilot": {
    title: "Project Pilot — Format Your Project the Way Your School Wants It",
    description:
      "Turn a finished project into a properly formatted document: chapters, headings, citations and the layout your department asks for.",
    type: "website",
  },
  "/pricing": {
    title: "Pricing — Memora Smart",
    description:
      "What each Memora Smart tool costs, in naira, with what is free and what is not stated plainly.",
    type: "website",
  },

  /* ── Academy ──────────────────────────────────────────────────────── */
  "/academy": {
    title: "Memora Smart Academy — Learn Data, Web Development, AI and Design",
    description:
      "Structured courses that take you from absolute beginner to job-ready. Data Analysis is open now — Excel, Power BI and Python, with real assessments, a capstone project and a verifiable certificate.",
    type: "website",
  },
  "/academy/courses": {
    title: "Courses — Memora Smart Academy",
    description:
      "Every Academy course and its real state: open now, in development, or planned. Data Analysis is complete, from the first spreadsheet to a final capstone.",
    type: "website",
  },
  "/academy/enroll": {
    title: "Choose your course — Memora Smart Academy",
    description:
      "Pick a course and start today. Free to register, and you get your permanent Memora ID the moment you join.",
    type: "website",
  },

  /* ── Guides and resources ─────────────────────────────────────────── */
  "/library": {
    title: "Free Library — Books and Resources | Memora Smart",
    description:
      "Free books, templates and guides for Nigerian job seekers and students. No payment, no sign-up wall.",
    type: "website",
  },
  "/excel-masterclass": {
    title: "Excel Masterclass — Memora Smart",
    description:
      "Learn the Excel that actually gets used at work: formulas, clean data, pivot tables and dashboards you can put in front of a manager.",
    type: "article",
  },
  "/ai-side-hustles": {
    title: "AI Side Hustles That Pay in Nigeria — Memora Smart",
    description:
      "Practical ways to earn with AI tools from Nigeria, with what each one actually requires before you start.",
    type: "article",
  },
  "/remote-jobs-guide": {
    title: "How to Get a Remote Job from Nigeria — Memora Smart",
    description:
      "A straight guide to finding and landing remote work from Nigeria: where to look, what employers check, and getting paid.",
    type: "article",
  },
  "/content-creation": {
    title: "Content Creation — Memora Smart",
    description:
      "Plan, produce and publish content people actually watch and read, with the tools and workflow behind it.",
    type: "article",
  },
  "/digital-skills": {
    title: "Digital Skills — Memora Smart",
    description:
      "The practical computer skills employers assume you already have, taught from zero.",
    type: "article",
  },
  "/daniel-nwankwo": {
    title: "Daniel Nwankwo — Founder, Memora Smart Technologies",
    description:
      "The founder of Memora Smart Technologies, and why the company builds career tools and training for Nigerians.",
    type: "profile",
  },
};

/**
 * Routes under these prefixes are a signed-in learner's own screens. They get
 * `noindex` and no share preview: a lesson player or a dashboard in someone's
 * search results is noise at best and a privacy leak at worst.
 */
export const NOINDEX_PREFIXES = [
  "/dashboard",
  "/admin",
  "/auth",
  "/cv/",
  "/academy/learn",
  "/academy/profile",
  "/academy/exam",
  "/academy/jobs",
];

/** The routes the build writes a real HTML file for. */
export const PRERENDER_ROUTES = Object.keys(ROUTE_META);

/** Metadata for a path, falling back to the site root. */
export function metaForPath(pathname = "/") {
  // Exact match first, then the longest matching prefix, so /academy/courses
  // beats /academy without depending on object key order.
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];

  const prefixes = Object.keys(ROUTE_META)
    .filter((p) => p !== "/" && pathname.startsWith(p))
    .sort((a, b) => b.length - a.length);

  return prefixes.length ? ROUTE_META[prefixes[0]] : ROUTE_META["/"];
}

export function shouldNoIndex(pathname = "/") {
  return NOINDEX_PREFIXES.some((p) => pathname.startsWith(p));
}

export default ROUTE_META;
