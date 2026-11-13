import formidable from "formidable";
import { readFile } from "fs/promises";
import mammoth from "mammoth";
import { db, verifyCaller } from "../lib/cv/admin.js";
import { spendAi } from "../lib/cv/quota.js";
import { computeEntitlement } from "../src/cv-builder/utils/plans.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10MB for images
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.cv) ? files.cv[0] : files.cv;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = await readFile(file.filepath);
    const ext = file.originalFilename?.toLowerCase().split(".").pop();
    let text = "";

    // ── DOCX — server-side via mammoth ──
    if (ext === "docx" || ext === "doc") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;

    // ── IMAGE — Claude Vision OCR ──
    // Each scan is a paid model call, so it needs a signed-in user and
    // spends one "document scan" from their daily allowance.
    } else if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      const who = await verifyCaller(req);
      if (!who.uid) {
        return res.status(401).json({ error: "Please sign in to read a scanned image." });
      }
      const user = await db().collection("users").doc(who.uid).get();
      const premium = who.admin || computeEntitlement(user.exists ? user.data() : {}).premium;
      const spend = await spendAi(db(), who, "scan", premium);
      if (!spend.ok) {
        return res.status(429).json({ error: spend.message, reason: "ai_limit", quota: spend.quota });
      }
      try {
        text = await extractTextFromImage(buffer, file.mimetype || `image/${ext}`);
      } catch (err) {
        await spend.refund();
        throw err;
      }

    } else {
      return res.status(400).json({
        error: "This endpoint handles DOCX and image files. PDFs and TXT are parsed in the browser.",
      });
    }

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        error: "Could not extract enough text from this file. If it's a scanned image, ensure it's clear and well-lit.",
      });
    }

    return res.status(200).json({ success: true, text: text.trim() });

  } catch (err) {
    console.error("File parsing error:", err);
    return res.status(500).json({
      error: "Failed to parse file: " + err.message,
    });
  }
}

async function extractTextFromImage(buffer, mimeType) {
  const base64 = buffer.toString("base64");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64,
              },
            },
            {
              type: "text",
              text: `This is an image of a CV/resume. Please extract ALL the text from this document exactly as it appears, preserving the structure and layout as much as possible in plain text. Include:
- Full name and contact details
- All section headings
- All work experience entries with dates and descriptions
- All education entries
- Skills, certifications, languages, interests
- Any other content visible in the document

Return ONLY the extracted text — no commentary, no explanations, no formatting instructions. Just the raw CV text content.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude Vision error: ${response.status} ${err.substring(0, 200)}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}