// pages/api/project-formatter/classify.js
//
// Input:  { paragraphs: [{ index, text, style, bold, fontSizePt, align, isAllCaps, isListItem }, ...] }
//         (this is exactly what /api/project-formatter/upload.js returns)
// Output: { classifications: [{ index, role }, ...] }
//
// Stateless by design: the client holds the paragraph array and passes it
// straight through. No server-side job storage — safe on serverless, no DB
// needed for MVP.
//
// Large documents (a full Chapter 1–5 project can be 300-600+ paragraphs)
// are split into batches to stay well within a single request's output
// budget. Each batch gets a little context about the previous batch's last
// known chapter, so the model doesn't lose track of "which chapter are we
// in" across the split.

import { SYSTEM_PROMPT } from "../../lib/classifySchema";

const BATCH_SIZE = 120;

// Reuse the same simple in-memory rate limiter pattern as your other routes.
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

function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) {
    out.push(array.slice(i, i + size));
  }
  return out;
}

async function classifyBatch(batch, priorContextNote) {
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
    // Strip any accidental markdown fences, just in case.
    const cleaned = rawText.replace(/^```json\s*|\s*```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Classifier returned invalid JSON: " + rawText.substring(0, 300));
  }

  if (!Array.isArray(parsed.classifications)) {
    throw new Error("Classifier response missing 'classifications' array.");
  }

  return parsed.classifications;
}

// Find the most recent chapter/section heading in a batch's results, to give
// the next batch a breadcrumb of "where we are" in the document.
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Try again later." });
  }

  const { paragraphs } = req.body || {};
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    return res.status(400).json({ error: "paragraphs array is required" });
  }

  try {
    const batches = chunk(paragraphs, BATCH_SIZE);
    let allClassifications = [];
    let contextNote = null;

    for (const batch of batches) {
      const result = await classifyBatch(batch, contextNote);
      allClassifications = allClassifications.concat(result);
      contextNote = buildContextNote(batch, result) || contextNote;
    }

    // Sanity check: every input index should appear exactly once.
    const seen = new Set(allClassifications.map((c) => c.index));
    const missing = paragraphs.filter((p) => !seen.has(p.index)).map((p) => p.index);
    if (missing.length > 0) {
      // Don't hard-fail — fall back to body_paragraph for anything missed,
      // so one flaky batch doesn't sink the whole job. Log for visibility.
      console.warn("Classifier missed indices, defaulting to body_paragraph:", missing);
      for (const idx of missing) {
        allClassifications.push({ index: idx, role: "body_paragraph" });
      }
    }

    allClassifications.sort((a, b) => a.index - b.index);

    return res.status(200).json({ classifications: allClassifications });
  } catch (err) {
    console.error("Classification error:", err);
    return res.status(500).json({ error: "Failed to classify document: " + err.message });
  }
}
