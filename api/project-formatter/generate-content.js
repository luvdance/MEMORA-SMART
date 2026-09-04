// api/project-formatter/generate-content.js
//
// Node endpoint, two responsibilities selected via an `action` field:
//
//   action: "draftPrelim"
//     Input:  { personalDetails }
//     Output: { dedicationText, acknowledgementText }
//     Drafts a short Dedication (to ONE person/entity — personalDetails.
//     dedicationTo) and a warm-but-generic Acknowledgement covering
//     Almighty God, supervisor, HOD, lecturers, parents, friends and
//     well-wishers. This should ONLY be called by the frontend when the
//     classifier found no existing dedication_body/acknowledgement_body
//     content in the uploaded document — never draft over real student
//     writing.
//
//   action: "interpretDirectives"
//     Input:  { customInstruction }
//     Output: { directives: { italicizeEtAl, unsupportedRequests } }
//     Maps the user's free-text instruction box onto the fixed directives
//     schema render.py actually understands.
//
//     IMPORTANT: as of this writing, render.py's render() function only
//     ever reads and acts on ONE directive — directives.italicizeEtAl
//     (see renderer_core.py). Other fields (e.g. citationStyle) are
//     accepted into the options dict but never consulted anywhere in the
//     renderer, so they would have no real effect yet. Rather than
//     pretend a request like "use MLA instead of APA" was applied when
//     it wasn't, anything that doesn't map to italicizeEtAl is routed
//     into unsupportedRequests with a plain-language explanation, so the
//     UI can tell the user honestly that it wasn't applied instead of
//     silently dropping it.
//
// Same fetch structure / rate-limit pattern / env var as classify.js.

const rateLimit = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  const record = rateLimit.get(ip);
  if (now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

// Cheap, non-complex drafting/mapping tasks — Haiku-tier model. Verified
// against GET /v1/models for this API key: "claude-haiku-4-6" (the naive
// analogue of classify.js's "claude-sonnet-4-6") doesn't exist; this is
// the actual available Haiku model.
const MODEL = "claude-haiku-4-5-20251001";

// ---------------------------------------------------------------------
// FORMATTING IS NOT AN AI DECISION.
// ---------------------------------------------------------------------
// "draftPrelim" writes actual PROSE (a dedication, an acknowledgement)
// from the student's own details. That is authorship, and the model
// stays connected for it.
//
// "interpretDirectives" was different in kind: it read a free-text
// instruction and decided which FORMATTING levers to pull. That is a
// structural decision, and structural decisions now come from
// lib/project_rulebook.json only — never from a model. It is disabled.
//
// TODO(reconnect-ai): leave false. If free-text instructions are wanted
// again, map them to rulebook keys with an explicit, reviewable table
// rather than asking a model to infer the mapping.
const USE_AI_DIRECTIVE_INTERPRETER = false;

async function callClaude({ system, userContent, maxTokens }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errText.substring(0, 300)}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

function stripFences(text) {
  return text.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
}

// ---------------------------------------------------------------------------
// action: draftPrelim
// ---------------------------------------------------------------------------
const DRAFT_SYSTEM_PROMPT = `You draft short prelim-page text for Nigerian university final year project write-ups.

You will be given the student's personal/institutional details. Produce TWO pieces of plain text:

1. A DEDICATION — 1-3 sentences, dedicated to exactly ONE person or entity named in "dedicationTo". Warm, sincere, simple. No markdown, no headings, no quotation marks around it.

2. An ACKNOWLEDGEMENT — 2-4 short paragraphs (separate paragraphs joined by a blank line), warm but generic in tone, covering in this rough order: gratitude to Almighty God, the supervisor (by name if given), the Head of Department (by name if given), lecturers/department staff in general, parents/family, and friends/well-wishers. Do not invent specific anecdotes or specific help they gave — keep it generic since you don't know the real story, just warm and sincere. No markdown, no headings, no bullet points.

Respond with ONLY valid JSON, no markdown fences, no commentary, in this exact shape:
{"dedicationText": "...", "acknowledgementText": "...paragraph one...\\n\\n...paragraph two..."}`;

async function draftPrelim(personalDetails) {
  const {
    firstName = "", middleName = "", surname = "",
    supervisorName = "", hodName = "", dedicationTo = "",
  } = personalDetails || {};

  const fullName = [firstName, middleName, surname].filter(Boolean).join(" ").trim();

  const userContent = JSON.stringify({
    studentName: fullName || undefined,
    supervisorName: supervisorName || undefined,
    hodName: hodName || undefined,
    dedicationTo: dedicationTo || "my family",
  });

  const rawText = await callClaude({
    system: DRAFT_SYSTEM_PROMPT,
    userContent,
    maxTokens: 700,
  });

  let parsed;
  try {
    parsed = JSON.parse(stripFences(rawText));
  } catch {
    throw new Error("Content drafter returned invalid JSON: " + rawText.substring(0, 300));
  }

  if (typeof parsed.dedicationText !== "string" || typeof parsed.acknowledgementText !== "string") {
    throw new Error("Content drafter response missing dedicationText/acknowledgementText.");
  }

  return {
    dedicationText: parsed.dedicationText.trim(),
    acknowledgementText: parsed.acknowledgementText.trim(),
  };
}

// ---------------------------------------------------------------------------
// action: interpretDirectives
// ---------------------------------------------------------------------------
const INTERPRET_SYSTEM_PROMPT = `You map a Nigerian university student's free-text formatting request onto a FIXED set of levers a document formatter actually implements.

The ONLY lever currently implemented is:
- italicizeEtAl (boolean): italicize the phrase "et al" (and "et al.") wherever it appears in the document.

Anything the student asks for that is NOT italicizing "et al" is NOT currently implemented, no matter how reasonable it sounds (e.g. switching citation style such as MLA/Harvard/Chicago, changing margins, changing heading numbering style, reordering chapters, adding new sections, changing paper size, etc). For each such request, write ONE short, plain, honest sentence explaining to the student that this specific request was not applied and why (not supported yet) — do not apologize excessively, just state it plainly.

If the instruction is empty, vague, or doesn't ask for anything actionable, return italicizeEtAl: false and an empty unsupportedRequests array.

Respond with ONLY valid JSON, no markdown fences, no commentary, in this exact shape:
{"italicizeEtAl": false, "unsupportedRequests": ["..."]}`;

async function interpretDirectives(customInstruction) {
  const trimmed = (customInstruction || "").trim();
  if (!trimmed) {
    return { italicizeEtAl: false, unsupportedRequests: [] };
  }

  if (!USE_AI_DIRECTIVE_INTERPRETER) {
    // Deterministic replacement. Only one real formatting lever exists
    // (italicising "et al"), and matching it is a literal string test —
    // there is nothing here a model needs to reason about. Everything
    // else is reported back as unapplied rather than silently dropped,
    // which is the same honesty guarantee the AI version provided.
    const italicizeEtAl = /\bet\s*\.?\s*al\b/i.test(trimmed)
      && /\b(italici[sz]e|italics)\b/i.test(trimmed);

    const unsupportedRequests = [];
    if (!italicizeEtAl) {
      unsupportedRequests.push(
        "Custom instructions are not applied automatically: document " +
        "structure and formatting come from the project rulebook, not " +
        "from free-text requests. Your instruction was recorded but not " +
        "acted on: \"" + trimmed.slice(0, 160) + "\""
      );
    }
    return { italicizeEtAl, unsupportedRequests };
  }

  const rawText = await callClaude({
    system: INTERPRET_SYSTEM_PROMPT,
    userContent: `Student's instruction: ${JSON.stringify(trimmed)}`,
    maxTokens: 500,
  });

  let parsed;
  try {
    parsed = JSON.parse(stripFences(rawText));
  } catch {
    throw new Error("Directive interpreter returned invalid JSON: " + rawText.substring(0, 300));
  }

  return {
    italicizeEtAl: Boolean(parsed.italicizeEtAl),
    unsupportedRequests: Array.isArray(parsed.unsupportedRequests)
      ? parsed.unsupportedRequests.filter((s) => typeof s === "string" && s.trim())
      : [],
  };
}

// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Try again later." });
  }

  const { action } = req.body || {};

  try {
    if (action === "draftPrelim") {
      const { personalDetails } = req.body || {};
      const result = await draftPrelim(personalDetails);
      return res.status(200).json(result);
    }

    if (action === "interpretDirectives") {
      const { customInstruction } = req.body || {};
      const directives = await interpretDirectives(customInstruction);
      return res.status(200).json({ directives });
    }

    return res.status(400).json({ error: "Unknown or missing action. Expected 'draftPrelim' or 'interpretDirectives'." });
  } catch (err) {
    console.error("generate-content error:", err);
    return res.status(500).json({ error: "Failed to generate content: " + err.message });
  }
}
