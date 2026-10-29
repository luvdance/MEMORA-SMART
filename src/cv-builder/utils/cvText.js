// ── CV TEXT HELPERS ──
// Shared by the in-builder ATS tools and the AI-optimized CV import.

// ── CV → PLAIN TEXT ──
// What the ATS scorer and the optimizer read. Mirrors the CV's sections in a
// recruiter-style order so the score reflects the content, not the layout.
export function cvToText(cv) {
  const lines = [];
  const add = (...parts) => {
    const text = parts.filter(Boolean).join(" ").trim();
    if (text) lines.push(text);
  };
  const section = (title) => lines.push("", title.toUpperCase());

  add(cv.name);
  add(cv.jobTitle);
  add([cv.email, cv.phone, cv.address, cv.linkedin, cv.website, cv.github].filter(Boolean).join(" | "));

  if (cv.summary) { section("Professional Summary"); add(cv.summary); }

  const exp = (cv.experience || []).filter(e => e.company || e.role);
  if (exp.length) {
    section("Work Experience");
    exp.forEach(e => {
      add(`${e.role || ""}${e.company ? ` at ${e.company}` : ""}`, e.start ? `(${e.start} – ${e.current ? "Present" : e.end || ""})` : "");
      add(e.responsibilities);
    });
  }

  const edu = (cv.education || []).filter(e => e.school || e.degree);
  if (edu.length) {
    section("Education");
    edu.forEach(e => add(e.degree, e.field && `in ${e.field}`, e.school && `— ${e.school}`, e.start && `(${e.start} – ${e.end || ""})`));
  }

  if (cv.skills) { section("Skills"); add(cv.skills); }

  const certs = Array.isArray(cv.certifications) ? cv.certifications.filter(c => c.name) : [];
  if (certs.length) { section("Certifications"); certs.forEach(c => add(c.name, c.issuer && `— ${c.issuer}`, c.issueDate)); }

  const ach = (cv.achievements || []).filter(a => a.title);
  if (ach.length) { section("Achievements"); ach.forEach(a => add(a.title, a.date && `(${a.date})`, a.description && `— ${a.description}`)); }

  const vol = (cv.volunteer || []).filter(v => v.organization);
  if (vol.length) { section("Volunteer"); vol.forEach(v => add(v.role, `at ${v.organization}`, v.description && `— ${v.description}`)); }

  const pubs = (cv.publications || []).filter(p => p.title);
  if (pubs.length) { section("Publications"); pubs.forEach(p => add(p.title, p.journal && `— ${p.journal}`, p.date)); }

  if (cv.languages) { section("Languages"); add(cv.languages); }
  if (cv.hobbies) { section("Interests"); add(cv.hobbies); }

  return lines.join("\n").trim();
}

const ARRAY_FIELDS = ["experience", "education", "certifications", "achievements", "volunteer", "publications", "references"];
const TEXT_FIELDS = ["name", "jobTitle", "email", "phone", "address", "linkedin", "website", "github", "summary", "skills", "languages", "hobbies"];

/**
 * Apply an AI-optimized CV on top of the current one. Only fields the AI
 * actually filled replace the user's; everything it doesn't know about
 * (photo, personal details, section order) is kept.
 */
export function mergeOptimizedCV(prev, optimized) {
  const next = { ...prev };
  // The AI may still return an objective; use it only if it wrote no summary.
  if (optimized && !String(optimized.summary || "").trim() && String(optimized.objective || "").trim()) {
    optimized = { ...optimized, summary: optimized.objective };
  }
  for (const key of TEXT_FIELDS) {
    const v = optimized?.[key];
    if (typeof v === "string" && v.trim()) next[key] = v.trim();
  }
  for (const key of ARRAY_FIELDS) {
    const v = optimized?.[key];
    if (Array.isArray(v) && v.length) next[key] = v;
  }
  return next;
}
