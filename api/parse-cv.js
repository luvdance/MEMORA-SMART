import formidable from "formidable";
import { readFile } from "fs/promises";
import mammoth from "mammoth";

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
    const form = formidable({ maxFileSize: 5 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.cv) ? files.cv[0] : files.cv;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = await readFile(file.filepath);
    const ext = file.originalFilename?.toLowerCase().split(".").pop();
    let text = "";

    if (ext === "docx" || ext === "doc") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return res.status(400).json({
        error: "This endpoint only handles DOCX. PDFs are parsed in browser.",
      });
    }

    if (!text || text.trim().length < 100) {
      return res.status(400).json({
        error: "Could not extract enough text from DOCX.",
      });
    }

    return res.status(200).json({ success: true, text: text.trim() });
  } catch (err) {
    console.error("DOCX parsing error:", err);
    return res.status(500).json({
      error: "Failed to parse: " + err.message,
    });
  }
}