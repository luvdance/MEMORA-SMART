import excelCover from "../assets/covers/excel-masterclass.jpg";
import remoteJobsCover from "../assets/covers/remote-jobs-guide.jpg";
import aiSideHustlesCover from "../assets/covers/ai-side-hustles.jpg";
import contentCreationCover from "../assets/covers/content-creation.jpg";
import computerSkillsCover from "../assets/covers/computer-digital-skills.jpg";

/**
 * BOOK CATALOG — single source of truth for the /library page.
 *
 * To add a new book in future, just push a new object into the
 * relevant array below. Nothing else needs to change — Library.jsx
 * and the card components render whatever is in these arrays.
 */

/**
 * FREE READS
 * Each of these should have a matching lead magnet page already
 * built at src/pages/LeadMagnet*.jsx, routed at `route` below.
 */
export const freeBooks = [
  {
    slug: "excel-masterclass",
    title: "25 Excel Formulas That'll Save You Hours",
    parentBook: "Excel Master Class — Beginner to Pro",
    description:
      "A free quick-reference cheat sheet covering the Excel formulas beginners and professionals actually use.",
    icon: "fa-solid fa-table-cells",
    cover: excelCover,
    route: "/excel-masterclass",
  },
  {
    slug: "remote-jobs-guide",
    title: "7 Remote Job Platforms That Hire From Nigeria",
    parentBook: "The Nigerian's Guide to Remote Jobs",
    description:
      "A free checklist of vetted remote job platforms, CV fixes, and what to expect from international interviews.",
    icon: "fa-solid fa-earth-africa",
    cover: remoteJobsCover,
    route: "/remote-jobs-guide",
  },
  {
    slug: "ai-side-hustles",
    title: "3 AI Side Hustles You Can Start This Week",
    parentBook: "AI Side Hustles in Nigeria",
    description:
      "A free preview of practical, low-cost ways to start earning online with AI — no tech background required.",
    icon: "fa-solid fa-robot",
    cover: aiSideHustlesCover,
    route: "/ai-side-hustles",
  },
  {
    slug: "content-creation",
    title: "Free Content Calendar + Caption Formulas",
    parentBook: "Content Creation",
    description:
      "A ready-to-use content calendar and caption formulas to plan a full month of content in one sitting.",
    icon: "fa-solid fa-photo-film",
    cover: contentCreationCover,
    route: "/content-creation",
  },
  {
    slug: "computer-digital-skills",
    title: "The Digital Skills Starter Kit",
    parentBook: "Complete Computer and Digital Skills Handbook",
    description:
      "Essential keyboard shortcuts, a plain-English glossary, and a roadmap for anyone just getting comfortable with a computer.",
    icon: "fa-solid fa-computer",
    cover: computerSkillsCover,
    route: "/digital-skills",
  },
];

/**
 * FULL BOOKS
 * price is in Naira (converted to kobo at checkout, *100).
 * downloadUrl is revealed to the buyer after a verified Paystack payment.
 * category groups books on the /library page (used to build category chips).
 * freeSlug (optional) links to a matching entry in freeBooks — shows a
 * "Read a free preview" link on the card.
 * spotlight (optional, one book only) — featured in the hero preview section.
 *
 * TODO: replace placeholder price / downloadUrl on each entry with the real values.
 */
export const paidBooks = [
  {
    slug: "excel-full",
    category: "Productivity",
    freeSlug: "excel-masterclass",
    spotlight: true,
    title: "Excel Master Class — Beginner to Pro",
    description:
      "Go from total beginner to confident, capable Excel user — formulas, pivot tables, dashboards, and automation, taught step by step.",
    price: 6500,
    icon: "fa-solid fa-table-cells",
    cover: excelCover,
    features: [
      "Formulas explained from the ground up, with real examples",
      "Pivot tables and dashboards you build along with",
      "Shortcuts and habits that make you faster every day",
      "Practice files so you learn by doing",
    ],
    downloadUrl: "https://your-storage-link.com/excel-masterclass-full.pdf",
  },
  {
    slug: "remote-jobs-full",
    category: "Career",
    freeSlug: "remote-jobs-guide",
    title: "The Nigerian's Guide to Remote Jobs",
    description:
      "How to find, apply for, and land international remote jobs from Nigeria — platforms, CVs, interviews, and getting paid.",
    price: 12000,
    icon: "fa-solid fa-earth-africa",
    cover: remoteJobsCover,
    features: [
      "Vetted platforms that genuinely hire from Nigeria",
      "CV and portfolio fixes that get past screening",
      "Interview prep for international employers",
      "How to receive international payments from Nigeria",
    ],
    downloadUrl: "https://your-storage-link.com/remote-jobs-guide-full.pdf",
  },
  {
    slug: "ai-side-hustles-full",
    category: "Technology & AI",
    freeSlug: "ai-side-hustles",
    title: "AI Side Hustles in Nigeria",
    description:
      "10 practical, low-cost ways to use AI to start earning online — with tools, steps, and where to find paying clients.",
    price: 12000,
    icon: "fa-solid fa-robot",
    cover: aiSideHustlesCover,
    features: [
      "10 side hustles with real earning potential",
      "No coding or design skills required",
      "Free and low-cost AI tools for each hustle",
      "Where to find your first paying client",
    ],
    downloadUrl: "https://your-storage-link.com/ai-side-hustles-full.pdf",
  },
  {
    slug: "content-creation-full",
    category: "Marketing",
    freeSlug: "content-creation",
    title: "Content Creation",
    description:
      "The complete system for planning, writing, filming, and growing an audience — for Instagram, TikTok, LinkedIn and more.",
    price: 8000,
    icon: "fa-solid fa-photo-film",
    cover: contentCreationCover,
    features: [
      "A full 30-day content planning system",
      "Caption formulas for hooks, stories & CTAs",
      "How to never run out of content ideas",
      "A realistic weekly posting rhythm",
    ],
    downloadUrl: "https://your-storage-link.com/content-creation-full.pdf",
  },
  {
    slug: "computer-skills-full",
    category: "Digital Skills",
    freeSlug: "computer-digital-skills",
    title: "Complete Computer and Digital Skills Handbook",
    description:
      "From total beginner to confident, capable computer user — shortcuts, terms, file management, and where to go next.",
    price: 25000,
    icon: "fa-solid fa-computer",
    cover: computerSkillsCover,
    features: [
      "Every essential shortcut, explained plainly",
      "A jargon-free glossary of computer terms",
      "File and folder management fundamentals",
      "A clear roadmap of what to learn next",
    ],
    downloadUrl: "https://your-storage-link.com/computer-skills-handbook-full.pdf",
  },
];