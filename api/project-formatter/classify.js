// api/project-formatter/classify.js
//
// Input:  { paragraphs: [{ index, text, style, bold, fontSizePt, align, isAllCaps, isListItem }, ...] }
//         (exactly what /api/project-formatter/upload returns)
// Output: { classifications: [{ index, role }, ...],
//           prelimFields: {...}, missingFields: [...], classifier: "deterministic" }
//
// STRUCTURE IS NOT AN AI DECISION.
// ---------------------------------------------------------------------
// This endpoint used to send every paragraph of the document to Claude
// and ask it to label roles. That is now disabled. Paragraph roles are
// decided by lib/deterministicClassify.js — a regex/state-machine
// classifier — because every signal that distinguishes these roles
// (CHAPTER ONE, "1.1" vs "2.2.1" numbering depth, "Table 4.1:",
// REFERENCES, APPENDIX) is a literal text pattern. A regex evaluates it
// identically on every run; a model re-derives the judgement each time
// and can disagree with itself between runs on the same document, which
// is what produced inconsistent structural output.
//
// The AI path below is retained but unreachable — see USE_AI_CLASSIFIER.
// It is kept for reference only. Per the project rule, the model may be
// reconnected for DRAFTING CHAPTER PROSE, never for structure,
// classification, or formatting decisions.

import { classify, extractPrelimFields } from "../../lib/deterministicClassify.js";
import { SYSTEM_PROMPT } from "../../lib/classifySchema.js";

// ---------------------------------------------------------------------
// TODO(reconnect-ai): Leave false. Flipping this restores LLM-based role
// classification, which reintroduces run-to-run structural drift. If the
// model is ever reconnected in this file it should be for drafting prose
// only — a separate endpoint — not for deciding roles.
// ---------------------------------------------------------------------
const USE_AI_CLASSIFIER = false;

// Front-matter fields the downstream document genuinely cannot be built
// correctly without: they are interpolated into the declaration and
// certification templates and printed on the cover/title pages. If
// extraction can't find them we say so loudly rather than rendering a
// document with blanks where a student's name should be.
const REQUIRED_PRELIM_FIELDS = ["student_name", "mat_number", "supervisor_name"];

const BATCH_SIZE = 120;

const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 20;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  const record = rateLimit.get(ip);
  if (now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

/**
 * The deterministic classifier keys results by array position. The
 * paragraph objects carry their own `index` from the extractor, and the
 * renderer matches roles to paragraphs by that index — so map position
 * back onto it rather than assuming the two always coincide.
 */
function alignToParagraphIndices(classifications, paragraphs) {
  return classifications.map((entry, position) => {
    const source = paragraphs[position];
    const index =
      source && typeof source.index === "number" ? source.index : entry.index;
    return { index, role: entry.role };
  });
}

function classifyDeterministically(paragraphs) {
  const { classifications } = classify(paragraphs);
  const aligned = alignToParagraphIndices(classifications, paragraphs);
  const prelimFields = extractPrelimFields(paragraphs, classifications);

  const missingFields = REQUIRED_PRELIM_FIELDS.filter(
    (field) => !prelimFields[field] || !String(prelimFields[field]).trim()
  );

  if (missingFields.length > 0) {
    // Deliberately noisy: a silently missing student name becomes a
    // declaration reading "I,  () hereby declare...".
    console.warn(
      "[project-formatter] Front-matter extraction could not find:",
      missingFields.join(", "),
      "- the UI must prompt for these before rendering."
    );
  }

  return { classifications: aligned, prelimFields, missingFields };
}

// =====================================================================
// DISABLED: AI classification path. Unreachable while USE_AI_CLASSIFIER
// is false. Retained so the integration isn't lost, not as a fallback —
// there is deliberately no automatic failover to it, so the deterministic
// path can be verified standing on its own.
// =====================================================================
function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
}

async function classifyBatchWithAI(batch, priorContextNote) {
  const userContent = [
    priorContextNote ? `Context from previous batch: ${priorContextNote}` : null,
    "Paragraphs to classify:",
    JSON.stringify(
      batch.map((p) => ({
        index: p.index,
        text: p.text,
        style: p.style,
        bold: p.bold,
        fontSizePt: p.fontSizePt,
        align: p.align,
        isAllCaps: p.isAllCaps,
        isListItem: p.isListItem,
      }))
    ),
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errText.substring(0, 300)}`);
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text || "";
  let parsed;
  try {
    parsed = JSON.parse(rawText.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    throw new Error("Classifier returned invalid JSON: " + rawText.substring(0, 300));
  }
  if (!Array.isArray(parsed.classifications)) {
    throw new Error("Classifier response missing 'classifications' array.");
  }
  return parsed.classifications;
}

function buildContextNote(batch, classifications) {
  const roleByIndex = new Map(classifications.map((c) => [c.index, c.role]));
  let lastHeading = null;
  for (const p of batch) {
    const role = roleByIndex.get(p.index);
    if (role && role.includes("chapter_heading")) {
      lastHeading = `Most recently seen: "${p.text}" (chapter_heading)`;
    } else if (role && role.includes("section_heading")) {
      lastHeading = `Most recently seen: "${p.text}" (section_heading)`;
    }
  }
  return lastHeading;
}

async function classifyWithAI(paragraphs) {
  const batches = chunk(paragraphs, BATCH_SIZE);
  let all = [];
  let contextNote = null;
  for (const batch of batches) {
    const result = await classifyBatchWithAI(batch, contextNote);
    all = all.concat(result);
    contextNote = buildContextNote(batch, result) || contextNote;
  }
  const seen = new Set(all.map((c) => c.index));
  for (const p of paragraphs) {
    if (!seen.has(p.index)) all.push({ index: p.index, role: "body_paragraph" });
  }
  all.sort((a, b) => a.index - b.index);
  return all;
}
// ===================== end disabled AI path ==========================

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Try again later." });
  }

  const { paragraphs } = req.body || {};
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    return res.status(400).json({ error: "paragraphs array is required" });
  }

  try {
    if (USE_AI_CLASSIFIER) {
      const classifications = await classifyWithAI(paragraphs);
      return res.status(200).json({ classifications, classifier: "ai" });
    }

    const { classifications, prelimFields, missingFields } =
      classifyDeterministically(paragraphs);

    return res.status(200).json({
      classifications,
      prelimFields,
      missingFields,
      classifier: "deterministic",
    });
  } catch (err) {
    console.error("Classification error:", err);
    return res.status(500).json({ error: "Failed to classify document: " + err.message });
  }
}
