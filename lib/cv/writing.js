/**
 * Short writing jobs for the CV Builder and Memotify. SERVER ONLY.
 *
 * Every prompt is built here from a few named fields. The browser never sends
 * a prompt, so these routes cannot be used as a free general AI service.
 * Callers spend an allowance (lib/cv/quota.js) before calling any of these.
 */
import Anthropic from "@anthropic-ai/sdk";

const clientOf = () => new Anthropic();

// The builder's field suggestions keep the model the old /api/claude used.
const FIELD_MODEL = "claude-sonnet-4-6";
// New features: Opus 5.5 at low effort, with server-side fallback on a refusal.
const LETTER_MODEL = "claude-opus-5-5";
const BETAS = ["server-side-fallback-2026-07-01"];

const clip = (value, max) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const textOf = (msg) => msg.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();

// ── CV BUILDER FIELD SUGGESTIONS ──
const FIELD_SYSTEM = "You are a CV writer. Output plain text only. No markdown. No headings. No hashtags. No asterisks. No labels. Just the content.";

const FIELD_PROMPTS = {
  summary: ({ jobTitle, name }) =>
    `Write a 2-sentence professional summary for a ${jobTitle}${name ? ` named ${name}` : ""}. Be specific, confident, and concise. No heading, no label, no markdown. Start directly with the person's name or role.`,
  skills: ({ jobTitle }) =>
    `List 8-10 relevant professional skills for a ${jobTitle}. Return ONLY a comma-separated list of skill names. No headings, no numbers, no markdown, no preamble, no extra text. Example format: Project Management, Data Analysis, Leadership`,
  languages: ({ jobTitle }) =>
    `Suggest a realistic set of languages and proficiency levels for a ${jobTitle} based in Nigeria. Return ONLY a comma-separated list like: English (Fluent), Yoruba (Native). No headings, no markdown, no preamble.`,
  hobbies: ({ jobTitle }) =>
    `Suggest 4-6 professional-sounding hobbies and interests for a ${jobTitle}. Return ONLY a comma-separated list. No headings, no markdown, no preamble.`,
  responsibilities: ({ role, company }) =>
    `Write 4-5 concise job responsibilities for a ${role} at ${company}. Use action verbs. Each responsibility on a new line starting with a dash (-). No headings, no markdown, no preamble, no extra formatting. Just the lines.`,
  certifications: ({ jobTitle }) =>
    `Suggest 3 industry-recognized certifications for a ${jobTitle}. Return ONLY a valid JSON array, nothing else. Format: [{"name": "certification name", "issuer": "issuing organization"}]. No markdown, no backticks, no explanation, no preamble.`,
};

export const FIELD_KINDS = Object.keys(FIELD_PROMPTS);

/** One builder field. `context` holds only short named facts. */
export async function writeField(kind, context = {}) {
  const build = FIELD_PROMPTS[kind];
  if (!build) throw new Error("Unknown field");
  const facts = {
    jobTitle: clip(context.jobTitle, 100) || "professional",
    name: clip(context.name, 80),
    role: clip(context.role, 100) || "professional",
    company: clip(context.company, 100) || "a company",
  };
  const msg = await clientOf().messages.create({
    model: FIELD_MODEL,
    max_tokens: kind === "responsibilities" || kind === "certifications" ? 400 : 250,
    system: FIELD_SYSTEM,
    messages: [{ role: "user", content: build(facts) }],
  });
  return textOf(msg).replace(/^#.*$/gm, "").trim();
}

// ── COVER LETTERS (Memotify job page) ──
const LETTER_SYSTEM = `You write cover letters for job seekers in Nigeria and West Africa. You get the candidate's CV and one job advert.

Write a cover letter that:
- is 250 to 350 words, in four short paragraphs, in plain British English;
- opens with the exact job title and company name;
- uses words from the advert where the CV truly supports them, so screening software can match them;
- uses only facts from the CV. Never invent employers, dates, figures, skills, degrees or certificates. If the CV lacks something the advert wants, leave it out;
- ends with a short request for an interview and the candidate's name.

Return only the letter as plain text: no subject line, no markdown, no notes to the user. Start with "Dear Hiring Manager," unless the advert names a person.`;

export async function writeCoverLetter({ cvText, jobDescription }) {
  const msg = await clientOf().beta.messages.create({
    model: LETTER_MODEL,
    betas: BETAS,
    fallbacks: "default",
    max_tokens: 4000,
    output_config: { effort: "low" },
    system: LETTER_SYSTEM,
    messages: [{ role: "user", content: `CV:\n${cvText.slice(0, 8000)}\n\n---\n\nJob advert:\n${jobDescription.slice(0, 6000)}` }],
  });
  if (msg.stop_reason === "refusal") throw new Error("refusal");
  return textOf(msg);
}

const LETTER_CHECK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overallScore", "rating", "strengths", "fixes", "missingKeywords"],
  properties: {
    overallScore: { type: "integer" },
    rating: { type: "string", enum: ["Excellent", "Good", "Needs Work", "Critical"] },
    strengths: { type: "array", items: { type: "string" } },
    fixes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: { title: { type: "string" }, description: { type: "string" } },
      },
    },
    missingKeywords: { type: "array", items: { type: "string" } },
  },
};

const LETTER_CHECK_SYSTEM = `You are an applicant tracking system (ATS) and a Nigerian recruiter. Score a cover letter against one job advert from 0 to 100.

Judge: keywords from the advert that the letter uses (35), relevance of the examples to the role (25), structure and length, about 250 to 400 words (15), a clear opening naming the role and company (15), and a clear close (10).

Give at most 3 strengths and at most 3 fixes, each one plain sentence. missingKeywords lists at most 8 important words from the advert that the letter does not use. Do not tell the candidate to claim anything they have not said is true.`;

export async function checkCoverLetter({ letterText, jobDescription }) {
  const msg = await clientOf().beta.messages.create({
    model: LETTER_MODEL,
    betas: BETAS,
    fallbacks: "default",
    max_tokens: 4000,
    output_config: { effort: "low", format: { type: "json_schema", schema: LETTER_CHECK_SCHEMA } },
    system: LETTER_CHECK_SYSTEM,
    messages: [{ role: "user", content: `Cover letter:\n${letterText}\n\n---\n\nJob advert:\n${jobDescription.slice(0, 6000)}` }],
  });
  if (msg.stop_reason === "refusal") throw new Error("refusal");
  const out = JSON.parse(textOf(msg));
  out.overallScore = Math.max(0, Math.min(100, Math.round(Number(out.overallScore) || 0)));
  return out;
}

// ── HOMEPAGE SEARCH ──
const SEARCH_SYSTEM = `You help visitors on the website of Memora Smart, a Nigerian company. It offers web development, mobile apps, data analysis, AI automation, a CV builder, a jobs board called Memotify, and online courses in its Academy.
A visitor typed a search. In one or two short, friendly sentences, say whether the company can help and how. Plain text only. If the search has nothing to do with these services, say so politely.`;

export async function siteSearch(query) {
  const msg = await clientOf().beta.messages.create({
    model: LETTER_MODEL,
    betas: BETAS,
    fallbacks: "default",
    max_tokens: 1000,
    output_config: { effort: "low" },
    system: SEARCH_SYSTEM,
    messages: [{ role: "user", content: `Search: "${clip(query, 80)}"` }],
  });
  if (msg.stop_reason === "refusal") return "";
  return textOf(msg).slice(0, 400);
}
