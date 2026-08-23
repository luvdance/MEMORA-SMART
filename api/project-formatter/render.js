// api/project-formatter/render.js
//
// Final step of the pipeline. Input: { paragraphs, classifications, options }
// (paragraphs from /upload, classifications from /classify — client passes
// both straight through, stateless as with the other two routes).
// Output: the formatted .docx file itself, streamed back as a download.

import { Packer } from "docx";
import { renderDocument } from "../../lib/renderDocx.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { paragraphs, classifications, options, filename } = req.body || {};

  if (!Array.isArray(paragraphs) || !Array.isArray(classifications)) {
    return res.status(400).json({ error: "paragraphs and classifications arrays are required" });
  }

  try {
    const doc = renderDocument(paragraphs, classifications, options || {});
    const buffer = await Packer.toBuffer(doc);

    const outName = (filename || "project").replace(/\.docx$/i, "") + "-formatted.docx";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${outName}"`);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error("Render error:", err);
    return res.status(500).json({ error: "Failed to build the formatted document: " + err.message });
  }
}
