export const TEMPLATES = [
  "Classic Pro",
  "Modern Edge",
  "Executive Plus",
  "Minimal Clean",
  "Creative Side",
  "Corporate Bold",
  "Traditional",
  "Editorial Modern",
  "Modern Timeline",
  "Compact Pro", 
  "Bold Statement",
  "Horizon", 
  "Refined",
  "Signature Edge", 
  "Dark Geo",
  "Summit",
];

export const ACCENT = ["#2563eb", "#0f766e", "#7c3aed", "#dc2626", "#d97706"];

export const THEME_PRESETS = [
  { label: "White", bg: "#ffffff", text: "#222222", sidebar: "#1e293b" },
  { label: "Warm", bg: "#fffaf5", text: "#2c1810", sidebar: "#7c3a20" },
  { label: "Cool", bg: "#f0f7ff", text: "#0f2a4a", sidebar: "#0f2a4a" },
  { label: "Dark", bg: "#1a1a2e", text: "#e0e0e0", sidebar: "#16213e" },
  { label: "Sage", bg: "#f4f7f4", text: "#1a2e1a", sidebar: "#2d5a27" },
  { label: "Rose", bg: "#fff5f7", text: "#2d0a14", sidebar: "#8b1a2e" },
];

export const defaultTheme = {
  bg: "#ffffff",
  text: "#222222",
  sidebar: "#1e293b",
};

// Page background is white unless the user has picked one themselves.
// A picked background is stored with chosen: true; anything without it
// (older drafts, earlier accidental picks) falls back to white.
export function resolveTheme(theme) {
  return theme && theme.chosen ? { ...defaultTheme, ...theme } : defaultTheme;
}

// The theme to store when the user picks a background preset.
export function chooseTheme(preset) {
  return { bg: preset.bg, text: preset.text, sidebar: preset.sidebar, chosen: true };
}

export const defaultFormat = {
  fontFamily: "Georgia, serif",
  nameFontSize: 28,
  headingFontSize: 13,
  bodyFontSize: 11.5,
  lineHeight: 1.5,
  pagePadding: 26,
  nameBold: true,
  nameItalic: false,
  headingBold: true,
  headingItalic: false,
  headingUppercase: true,
};

// "objective" (career objective) was merged into the professional summary.
export const DEFAULT_SECTION_ORDER = [
  "summary",
  "biodata",
  "experience",
  "education",
  "achievements",
  "volunteer",
  "publications",
  "skills",
  "languages",
  "certifications",
  "hobbies",
  "references",
];

// Saved/drafted section orders: drop retired sections and add any new ones.
export function normalizeSectionOrder(order) {
  const base = Array.isArray(order) && order.length ? order : DEFAULT_SECTION_ORDER;
  const kept = base.filter((k) => k !== "objective" && DEFAULT_SECTION_ORDER.includes(k));
  return [...kept, ...DEFAULT_SECTION_ORDER.filter((k) => !kept.includes(k))];
}

// The career objective is no longer a separate section. A CV that only had
// an objective keeps it as its summary, so no one loses text they wrote.
export function migrateCV(cv) {
  if (!cv) return cv;
  const summary = String(cv.summary || "").trim();
  const objective = String(cv.objective || "").trim();
  if (!summary && objective) return { ...cv, summary: objective, objective: "" };
  return cv;
}

export const FONT_OPTIONS = [
  { label: "Georgia",   value: "Georgia, 'Source Serif 4', serif" },
  { label: "Helvetica", value: "'Helvetica Neue', Helvetica, 'Inter', sans-serif" },
  { label: "Calibri",   value: "Calibri, 'Source Sans 3', 'Trebuchet MS', sans-serif" },
  { label: "Garamond",  value: "Garamond, 'EB Garamond', 'Times New Roman', serif" },
  { label: "Arial",     value: "Arial, 'Inter', sans-serif" },
  { label: "Palatino",  value: "'Palatino Linotype', Palatino, 'Cormorant Garamond', serif" },
  { label: "Verdana",   value: "Verdana, 'DM Sans', Geneva, sans-serif" },
  { label: "Trebuchet", value: "'Trebuchet MS', 'Manrope', sans-serif" },
];

export const emptyCV = {
  name: "", email: "", phone: "", address: "", linkedin: "", website: "", github: "",
  jobTitle: "", summary: "", objective: "",

  // ── BIO DATA (all optional) ──
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  nationality: "",
  stateOfOrigin: "",
  lga: "",
  placeOfBirth: "",
  religion: "",
  nin: "",

  experience: [{ company: "", role: "", start: "", end: "", current: false, responsibilities: "" }],
  education: [{ school: "", degree: "", field: "", start: "", end: "" }],
  skills: "", certifications: [], languages: "", photo: null,
  achievements: [{ title: "", date: "", description: "" }],
  volunteer: [{ organization: "", role: "", start: "", end: "", description: "" }],
  references: [{ name: "", title: "", company: "", email: "", phone: "" }],
  publications: [{ title: "", journal: "", date: "", url: "", description: "" }],
  hobbies: "",
  sectionOrder: DEFAULT_SECTION_ORDER,
};

export const STEPS = [
  "Personal",
  "Summary",
  "Experience",
  "Education",
  "Skills & More",
  "Extras",
  "Biodata",
];