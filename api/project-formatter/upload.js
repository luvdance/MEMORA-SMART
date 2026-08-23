// pages/api/project-formatter/upload.js
//
// Accepts a raw .docx upload and returns the extracted paragraph array.
// MVP scope: .docx only (matches your CV parser's docx path). PDFs and
// scanned images are intentionally out of scope for this feature — this
// tool needs to produce an EDITABLE, correctly-formatted .docx output, and
// starting from a PDF/image loses the editable structure we'd need to
// rebuild reliably. Word-native input keeps the pipeline honest.
//
// Response shape:
//   { success: true, filename: string, paragraphs: [...] }
// The client holds `paragraphs` and passes it straight to
// /api/project-formatter/classify next. No server-side state.

import formidable from "formidable";
import { readFile } from "fs/promises";
import { extractParagraphs } from "../../lib/docxExtractor.js";

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
    // Project write-ups are long documents with embedded charts/images —
    // allow a larger ceiling than the CV parser's 10MB image limit.
    const form = formidable({ maxFileSize: 30 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.document) ? files.document[0] : files.document;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = file.originalFilename?.toLowerCase().split(".").pop();
    if (ext !== "docx") {
      return res.status(400).json({
        error:
          "Please upload a .docx file. (Legacy .doc and PDF aren't supported yet — save as .docx in Word first.)",
      });
    }

    const buffer = await readFile(file.filepath);
    const paragraphs = extractParagraphs(buffer);

    if (paragraphs.length < 5) {
      return res.status(400).json({
        error: "Could not find enough content in this document. Please check the file and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      filename: file.originalFilename,
      paragraphs,
    });
  } catch (err) {
    console.error("Upload/extraction error:", err);
    return res.status(500).json({
      error: "Failed to read this document: " + err.message,
    });
  }
}
