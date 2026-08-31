// src/pages/dashboard/ProjectFormatter.jsx
//
// MVP UI: upload a .docx, run extraction + classification, show the result.
// Rendering the final formatted .docx (render.js) isn't built yet, so step 3
// currently shows a readable breakdown of what the AI detected rather than a
// download — useful on its own for validating the classifier against real
// documents before we wire up the renderer.

import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const STAGES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  CLASSIFYING: "classifying",
  RENDERING: "rendering",
  DONE: "done",
  ERROR: "error",
};

const ROLE_LABELS = {
  chapter_heading: "Chapter heading",
  section_heading: "Section heading",
  subsection_heading: "Subsection heading",
  subsubsection_heading: "Sub-subsection heading",
  figure_caption: "Figure caption",
  table_caption: "Table caption",
  plate_caption: "Plate caption",
  reference_entry: "Reference entry",
  abstract_heading: "Abstract heading",
  body_paragraph: "Body text",
};

export default function ProjectFormatter() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [rawFile, setRawFile] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStage(STAGES.UPLOADING);
    setFilename(file.name);
    setRawFile(file);

    try {
      const formData = new FormData();
      formData.append("document", file);

      const uploadRes = await fetch("/api/project-formatter/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      setParagraphs(uploadData.paragraphs);
      setStage(STAGES.CLASSIFYING);

      const classifyRes = await fetch("/api/project-formatter/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraphs: uploadData.paragraphs }),
      });
      const classifyData = await classifyRes.json();

      if (!classifyRes.ok) {
        throw new Error(classifyData.error || "Classification failed");
      }

      setClassifications(classifyData.classifications);
      setStage(STAGES.RENDERING);

      const renderFormData = new FormData();
      renderFormData.append("document", file);
      renderFormData.append("classifications", JSON.stringify(classifyData.classifications));
      renderFormData.append("filename", file.name);

      const renderRes = await fetch("/api/project-formatter/render", {
        method: "POST",
        body: renderFormData,
      });

      if (!renderRes.ok) {
        const errData = await renderRes.json().catch(() => ({}));
        throw new Error(errData.error || "Formatting failed");
      }

      const blob = await renderRes.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setStage(STAGES.DONE);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStage(STAGES.ERROR);
    }
  }

  function reset() {
    setStage(STAGES.IDLE);
    setError(null);
    setFilename(null);
    setParagraphs([]);
    setClassifications([]);
    setRawFile(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  }

  const roleByIndex = new Map(classifications.map((c) => [c.index, c.role]));

  // Quick summary counts — useful while we're validating the classifier
  // against real documents, before the renderer exists.
  const roleCounts = classifications.reduce((acc, c) => {
    acc[c.role] = (acc[c.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout
      title="Project Formatter"
      subtitle="Upload your raw project write-up and let AI arrange it into the correct Nigerian format."
    >
      <div className="dash-overview__greeting">
        <h1>
          Project <span className="dash-gradient-text">Formatter</span>
        </h1>
        <p>
          Chapter 1–5 (or however many you have) — correctly numbered,
          headings kept together, references cleaned up.
        </p>
      </div>

      {stage === STAGES.IDLE && (
        <div className="dash-stat-card" style={{ padding: "2rem", textAlign: "center" }}>
          <i className="fas fa-file-word" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <p style={{ marginBottom: "1rem" }}>Upload your raw .docx project file to get started.</p>
          <label className="dash-app-card__tag" style={{ cursor: "pointer", padding: "0.6rem 1.2rem" }}>
            Choose file
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}

      {(stage === STAGES.UPLOADING || stage === STAGES.CLASSIFYING || stage === STAGES.RENDERING) && (
        <div className="dash-stat-card" style={{ padding: "2rem", textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}></i>
          <p>
            {stage === STAGES.UPLOADING
              ? `Reading ${filename}...`
              : stage === STAGES.CLASSIFYING
              ? `Analyzing document structure — this can take a moment for longer documents...`
              : `Building your formatted document...`}
          </p>
        </div>
      )}

      {stage === STAGES.ERROR && (
        <div className="dash-stat-card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</p>
          <button className="dash-app-card__tag" onClick={reset}>
            Try again
          </button>
        </div>
      )}

      {stage === STAGES.DONE && (
        <>
          {downloadUrl && (
            <div className="dash-stat-card" style={{ padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
              <a
                href={downloadUrl}
                download={filename ? filename.replace(/\.docx$/i, "") + "-formatted.docx" : "formatted.docx"}
                className="dash-app-card__tag"
                style={{ display: "inline-block", padding: "0.7rem 1.4rem" }}
              >
                <i className="fas fa-download" style={{ marginRight: "0.5rem" }}></i>
                Download formatted document
              </a>
              <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", opacity: 0.7 }}>
                Open in Word, then press Ctrl+A followed by F9 (or right-click the
                Table of Contents and choose "Update Field") so all page numbers
                display correctly before printing.
              </p>
            </div>
          )}

          <div className="dash-stats">
            {Object.entries(roleCounts)
              .filter(([role]) => ROLE_LABELS[role])
              .map(([role, count]) => (
                <div className="dash-stat-card" key={role}>
                  <div className="dash-stat-card__value">{count}</div>
                  <div className="dash-stat-card__label">{ROLE_LABELS[role]}</div>
                </div>
              ))}
          </div>

          <div className="dash-apps__title">Detected structure</div>
          <div style={{ maxHeight: "500px", overflowY: "auto", fontSize: "0.9rem" }}>
            {paragraphs
              .filter((p) => {
                const role = roleByIndex.get(p.index);
                return role && role !== "body_paragraph";
              })
              .map((p) => (
                <div
                  key={p.index}
                  style={{ padding: "0.4rem 0", borderBottom: "1px solid #eee" }}
                >
                  <span style={{ opacity: 0.6, marginRight: "0.5rem" }}>
                    [{ROLE_LABELS[roleByIndex.get(p.index)] || roleByIndex.get(p.index)}]
                  </span>
                  {p.text.substring(0, 100)}
                </div>
              ))}
          </div>

          <p style={{ marginTop: "1.5rem", opacity: 0.7 }}>
            Structure detected by the AI — full list above shows headings,
            captions, and references it found and reformatted.
          </p>
          <button className="dash-app-card__tag" onClick={reset}>
            Upload another document
          </button>
        </>
      )}
    </DashboardLayout>
  );
}
