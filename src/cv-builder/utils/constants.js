export const TEMPLATES = [
  "Classic Pro",
  "Modern Edge",
  "Executive Plus",
  "Minimal Clean",
  "Creative Side",
  "Corporate Bold",
  "Traditional",
];

export const ACCENT = ["#2563eb", "#0f766e", "#7c3aed", "#dc2626", "#d97706"];

export const THEME_PRESETS = [
  { label: "Default", bg: "#ffffff", text: "#222222", sidebar: "#1e293b" },
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

export const defaultFormat = {
  fontFamily: "Georgia, serif",
  nameFontSize: 22,
  headingFontSize: 11,
  bodyFontSize: 11,
  lineHeight: 1.5,
  pagePadding: 24,
  nameBold: true,
  nameItalic: false,
  headingBold: true,
  headingItalic: false,
  headingUppercase: true,
};

export const DEFAULT_SECTION_ORDER = [
  "summary",
  "objective",
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
  name: "", email: "", phone: "", address: "", linkedin: "", website: "",
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
  "Personal", "Bio Data", "Summary", "Experience",
  "Education", "Skills & More", "Extras"
];