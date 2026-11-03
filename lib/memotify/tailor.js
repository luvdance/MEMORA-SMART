/**
 * THE TRUTH GUARD FOR TAILORED CVS
 *
 * Tested against the real model, the optimizer wrote a Google certificate,
 * "certified in SQL", "₦2M+ in transactions" and a "4.2-star rating" onto a CV
 * that had none of them, despite a prompt telling it not to. A CV is a claim to
 * an employer, so a prompt alone is not enough here. Pure, so it is unit-tested.
 *
 * mergeTailored decides what the rewrite may change: wording of the summary,
 * skills and bullets. Who you worked for, when, your degree and your
 * certificates always stay yours.
 *
 * unverifiedClaims then lists anything still in the new text with no basis in
 * the original, for the person to confirm or remove before an employer sees it.
 */
import { skillsIn } from "./screen.js";

/** Keep the skills the CV already shows; a job asking for one isn't evidence of it. */
function honestSkills(proposed, originalIds) {
  return String(proposed || "")
    .split(/,(?![^()]*\))/) // not the comma in "SQL (SELECT, JOIN)"
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => skillsIn(item).every((id) => originalIds.has(id)))
    .join(", ");
}

const sameEmployer = (a, b) =>
  String(a.company || "").trim().toLowerCase() === String(b.company || "").trim().toLowerCase();

export function mergeTailored(original, optimized, originalText) {
  const known = new Set(skillsIn(originalText));
  const proposed = Array.isArray(optimized?.experience) ? optimized.experience : [];
  const next = { ...original };

  if (String(optimized?.summary || "").trim()) next.summary = optimized.summary.trim();
  const skills = honestSkills(optimized?.skills, known);
  if (skills) next.skills = skills;

  next.experience = (original.experience || []).map((role) => {
    const rewritten = proposed.find((candidate) => sameEmployer(candidate, role));
    const text = String(rewritten?.responsibilities || "").trim();
    return text ? { ...role, responsibilities: text } : role;
  });
  return next;
}

const FIGURE = /[₦$£€]?\d[\d,.]*\s?(?:%|\+|k\b|m\b|million\b|billion\b)?/gi;
const digitsOf = (text) => text.replace(/\D/g, "");

/** Figures and skills in the new wording that the original never mentioned. */
export function unverifiedClaims(data, originalText) {
  const source = String(originalText || "");
  const seen = new Set((source.match(FIGURE) || []).map(digitsOf));
  const text = [data.summary, ...(data.experience || []).map((role) => role.responsibilities)]
    .filter(Boolean)
    .join("\n");

  const figures = [...new Set((text.match(FIGURE) || []).map((value) => value.trim().replace(/[.,]$/, "")))]
    .filter((value) => !seen.has(digitsOf(value)));
  const known = new Set(skillsIn(source));
  return { figures, skills: skillsIn(text).filter((id) => !known.has(id)) };
}
