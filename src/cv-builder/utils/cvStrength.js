// ── CV STRENGTH ──
// A 0–100 completeness score with a "what to add next" hint, shown as the
// progress ring on the mobile Edit tab. Each check points at the form step
// that fixes it, so tapping the hint jumps straight there.
import { templateUsesPhoto } from "./templateMeta";

const words = (text) => String(text || "").split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
const bullets = (text) => String(text || "").split("\n").map(s => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

export const STEP_META = [
  { label: "Personal", icon: "fa-user", tone: "blue" },
  { label: "Summary", icon: "fa-align-left", tone: "violet" },
  { label: "Experience", icon: "fa-briefcase", tone: "amber" },
  { label: "Education", icon: "fa-graduation-cap", tone: "green" },
  { label: "Skills", icon: "fa-bolt", tone: "pink" },
  { label: "Extras", icon: "fa-trophy", tone: "orange" },
  { label: "Biodata", icon: "fa-id-card", tone: "teal" },
];

/** Is each form step done? (Extras and Biodata are optional, so "done" = anything filled.) */
export function stepCompletion(cv) {
  const exp = cv.experience || [];
  const edu = cv.education || [];
  return [
    !!(cv.name && cv.email && cv.phone),
    String(cv.summary || "").trim().length >= 60,
    !!(exp[0]?.company && exp[0]?.role),
    !!edu[0]?.school,
    words(cv.skills).length >= 3,
    !!(cv.achievements?.[0]?.title || cv.volunteer?.[0]?.organization || cv.publications?.[0]?.title || cv.references?.[0]?.name || cv.hobbies),
    !!(cv.dateOfBirth || cv.gender || cv.maritalStatus || cv.nationality || cv.stateOfOrigin || cv.lga || cv.placeOfBirth || cv.religion || cv.nin),
  ];
}

export function computeStrength(cv, template) {
  const exp = (cv.experience || []).filter(e => e.company || e.role);
  const firstResp = bullets(exp[0]?.responsibilities).length;
  const skills = words(cv.skills).length;
  const summaryLen = String(cv.summary || "").trim().length;
  const certs = Array.isArray(cv.certifications) ? cv.certifications.filter(c => c.name).length : 0;

  // [label for the hint, weight, earned fraction 0..1, step]
  const checks = [
    ["Add your full name", 8, cv.name ? 1 : 0, 0],
    ["Add your target job title", 6, cv.jobTitle ? 1 : 0, 0],
    ["Add your email address", 6, cv.email ? 1 : 0, 0],
    ["Add your phone number", 6, cv.phone ? 1 : 0, 0],
    ["Add your location", 4, cv.address ? 1 : 0, 0],
    ["Add your LinkedIn or website", 4, cv.linkedin || cv.website ? 1 : 0, 0],
    ...(templateUsesPhoto(template) ? [["Upload a passport photo", 4, cv.photo ? 1 : 0, 0]] : []),
    ["Write a professional summary", 14, summaryLen >= 150 ? 1 : summaryLen > 0 ? 0.5 : 0, 1],
    ["Add your work experience", 8, exp.length ? 1 : 0, 2],
    ["Describe what you achieved in your role", 12, firstResp >= 3 ? 1 : firstResp > 0 ? 0.5 : 0, 2],
    ["Add your education", 10, cv.education?.[0]?.school ? 1 : 0, 3],
    ["List at least 5 skills", 10, skills >= 5 ? 1 : skills > 0 ? 0.5 : 0, 4],
    ["Add the languages you speak", 4, cv.languages ? 1 : 0, 4],
    ["Add a certification", 4, certs ? 1 : 0, 4],
    ["Add an achievement or award", 4, cv.achievements?.[0]?.title ? 1 : 0, 5],
  ];

  const total = checks.reduce((n, [, w]) => n + w, 0);
  const earned = checks.reduce((n, [, w, f]) => n + w * f, 0);
  const score = Math.round((earned / total) * 100);

  // Biggest remaining gain first.
  const todo = checks
    .filter(([, , f]) => f < 1)
    .map(([label, w, f, step]) => ({ label, step, gain: Math.max(1, Math.round((w * (1 - f) / total) * 100)) }))
    .sort((a, b) => b.gain - a.gain);

  const level = score >= 90 ? { name: "Job-ready", tone: "green" }
    : score >= 70 ? { name: "Strong", tone: "blue" }
    : score >= 40 ? { name: "Taking shape", tone: "amber" }
    : { name: "Getting started", tone: "red" };

  return { score, level, next: todo[0] || null, steps: stepCompletion(cv) };
}
