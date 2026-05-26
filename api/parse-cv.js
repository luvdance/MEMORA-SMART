import formidable from "formidable";
import { readFile } from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const config = {
  api: {
    bodyParser: false, // formidable handles parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB max
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.cv) ? files.cv[0] : files.cv;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = await readFile(file.filepath);
    let text = "";

    const ext = file.originalFilename?.toLowerCase().split(".").pop();

    if (ext === "pdf") {
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (ext === "docx" || ext === "doc") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === "txt") {
      text = buffer.toString("utf-8");
    } else {
      return res.status(400).json({
        error: "Unsupported file type. Please upload PDF, DOCX, or TXT.",
      });
    }

    if (!text || text.trim().length < 100) {
      return res.status(400).json({
        error: "Could not extract enough text. Is your CV image-only or password-protected?",
      });
    }

    return res.status(200).json({ success: true, text: text.trim() });
  } catch (err) {
    console.error("CV parsing error:", err);
    return res.status(500).json({
      error: "Failed to parse file: " + err.message,
    });
  }
}