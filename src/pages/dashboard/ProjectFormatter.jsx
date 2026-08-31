// src/pages/dashboard/ProjectFormatter.jsx

import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "./ProjectFormatter.css";

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

const ROLE_ICONS = {
  chapter_heading: "fa-book-open",
  section_heading: "fa-layer-group",
  subsection_heading: "fa-list",
  subsubsection_heading: "fa-indent",
  figure_caption: "fa-image",
  table_caption: "fa-table",
  plate_caption: "fa-images",
  reference_entry: "fa-quote-right",
  abstract_heading: "fa-file-alt",
  body_paragraph: "fa-align-left",
};

export default function ProjectFormatter() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    await processFile(file);
  }

  async function processFile(file) {
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a Microsoft Word .docx document.");
      setStage(STAGES.ERROR);
      return;
    }

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

      const classifyRes = await fetch(
        "/api/project-formatter/classify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paragraphs: uploadData.paragraphs,
          }),
        }
      );

      const classifyData = await classifyRes.json();

      if (!classifyRes.ok) {
        throw new Error(
          classifyData.error || "Classification failed"
        );
      }

      setClassifications(classifyData.classifications);

      setStage(STAGES.RENDERING);

      const renderFormData = new FormData();
      renderFormData.append("document", file);
      renderFormData.append(
        "classifications",
        JSON.stringify(classifyData.classifications)
      );
      renderFormData.append("filename", file.name);

      const renderRes = await fetch(
        "/api/project-formatter/render",
        {
          method: "POST",
          body: renderFormData,
        }
      );

      if (!renderRes.ok) {
        const errData = await renderRes
          .json()
          .catch(() => ({}));

        throw new Error(
          errData.error || "Formatting failed"
        );
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

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  }

  function reset() {
    setStage(STAGES.IDLE);
    setError(null);
    setFilename(null);
    setParagraphs([]);
    setClassifications([]);
    setRawFile(null);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }

    setDownloadUrl(null);
  }

  const roleByIndex = new Map(
    classifications.map((c) => [c.index, c.role])
  );

  const roleCounts = classifications.reduce((acc, c) => {
    acc[c.role] = (acc[c.role] || 0) + 1;
    return acc;
  }, {});

  const totalDetected = classifications.length;

  const chapterCount = classifications.filter((c) =>
    [
      "chapter_heading",
      "section_heading",
      "subsection_heading",
      "subsubsection_heading",
    ].includes(c.role)
  ).length;

  const referenceCount =
    roleCounts.reference_entry || 0;

  const tableCount =
    roleCounts.table_caption || 0;

  const figureCount =
    (roleCounts.figure_caption || 0) +
    (roleCounts.plate_caption || 0);

  const getStageProgress = () => {
    switch (stage) {
      case STAGES.UPLOADING:
        return 20;
      case STAGES.CLASSIFYING:
        return 48;
      case STAGES.RENDERING:
        return 78;
      case STAGES.DONE:
        return 100;
      default:
        return 0;
    }
  };

  const getStageLabel = () => {
    switch (stage) {
      case STAGES.UPLOADING:
        return "Reading your document";
      case STAGES.CLASSIFYING:
        return "AI is analyzing your project";
      case STAGES.RENDERING:
        return "Building your formatted document";
      case STAGES.DONE:
        return "Project processing complete";
      default:
        return "Ready to begin";
    }
  };

  const workflow = [
    {
      number: "01",
      title: "Upload",
      icon: "fa-cloud-upload-alt",
    },
    {
      number: "02",
      title: "Analyze",
      icon: "fa-brain",
    },
    {
      number: "03",
      title: "Organize",
      icon: "fa-sitemap",
    },
    {
      number: "04",
      title: "Correct",
      icon: "fa-spell-check",
    },
    {
      number: "05",
      title: "Finalize",
      icon: "fa-check-circle",
    },
  ];

  return (
    <DashboardLayout
      title="Project Formatter"
      subtitle="Transform your raw academic project into a properly structured and professionally formatted document."
    >
      <div className="pf-page">

        {/* HEADER */}

        <div className="pf-header">
          <div>
            <div className="pf-product-label">
              <span className="pf-product-dot"></span>
              PROJECTPILOT
            </div>

            <h1>
              From messy project to{" "}
              <span>submission-ready.</span>
            </h1>

            <p>
              Upload your project and let AI analyze its structure,
              organize your chapters, detect inconsistencies and
              prepare it for professional formatting.
            </p>
          </div>

          <div className="pf-header-badge">
            <div className="pf-ai-orb">
              <i className="fas fa-sparkles"></i>
            </div>

            <div>
              <strong>AI Academic Assistant</strong>
              <small>Smart document analysis</small>
            </div>
          </div>
        </div>

        {/* WORKFLOW */}

        <div className="pf-workflow">
          {workflow.map((item, index) => {
            const active =
              stage !== STAGES.IDLE &&
              stage !== STAGES.ERROR &&
              index <=
                (stage === STAGES.DONE
                  ? 4
                  : stage === STAGES.RENDERING
                  ? 3
                  : stage === STAGES.CLASSIFYING
                  ? 2
                  : 0);

            return (
              <div
                className={`pf-workflow-step ${
                  active ? "active" : ""
                }`}
                key={item.number}
              >
                <div className="pf-workflow-icon">
                  <i className={`fas ${item.icon}`}></i>
                </div>

                <div>
                  <small>STEP {item.number}</small>
                  <strong>{item.title}</strong>
                </div>

                {index < workflow.length - 1 && (
                  <div className="pf-workflow-line"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* IDLE / UPLOAD */}

        {stage === STAGES.IDLE && (
          <>
            <div
              className={`pf-upload-card ${
                isDragging ? "dragging" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="pf-upload-glow"></div>

              <div className="pf-upload-icon">
                <i className="fas fa-file-word"></i>
              </div>

              <h2>Upload your project</h2>

              <p>
                Drop your Word document here, or choose a file
                from your computer.
              </p>

              <label className="pf-primary-button">
                <i className="fas fa-cloud-upload-alt"></i>
                Choose .DOCX file

                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <div className="pf-upload-info">
                <span>
                  <i className="fas fa-check-circle"></i>
                  Microsoft Word (.docx)
                </span>

                <span>
                  <i className="fas fa-shield-alt"></i>
                  Secure processing
                </span>

                <span>
                  <i className="fas fa-robot"></i>
                  AI-powered analysis
                </span>
              </div>
            </div>

            {/* WHAT IT DOES */}

            <div className="pf-section-heading">
              <div>
                <span>WHAT PROJECTPILOT CHECKS</span>
                <h2>More than formatting.</h2>
              </div>

              <p>
                Your project is analyzed across structure,
                content and document organization.
              </p>
            </div>

            <div className="pf-feature-grid">
              <Feature
                icon="fa-sitemap"
                title="Project Structure"
                text="Identifies chapters, sections, subsections and the overall document hierarchy."
              />

              <Feature
                icon="fa-list-ol"
                title="Table of Contents"
                text="Prepares your document structure for an accurate, properly organized table of contents."
              />

              <Feature
                icon="fa-spell-check"
                title="Grammar & Spelling"
                text="Detects spelling, punctuation and language issues throughout your project."
              />

              <Feature
                icon="fa-table"
                title="Tables & Figures"
                text="Identifies table and figure captions and keeps them connected to the document structure."
              />

              <Feature
                icon="fa-quote-right"
                title="References"
                text="Detects reference entries and helps validate the relationship between citations and references."
              />

              <Feature
                icon="fa-brain"
                title="AI Deep Review"
                text="Analyzes the document intelligently instead of treating it as a collection of isolated pages."
              />
            </div>

            {/* SIMPLE MESSAGE */}

            <div className="pf-bottom-message">
              <div className="pf-bottom-icon">
                <i className="fas fa-magic"></i>
              </div>

              <div>
                <strong>
                  You focus on your research.
                </strong>

                <span>
                  ProjectPilot handles the structure and
                  document complexity.
                </span>
              </div>
            </div>
          </>
        )}

        {/* PROCESSING */}

        {(stage === STAGES.UPLOADING ||
          stage === STAGES.CLASSIFYING ||
          stage === STAGES.RENDERING) && (
          <div className="pf-processing-card">
            <div className="pf-processing-top">
              <div className="pf-processing-file">
                <div className="pf-file-icon">
                  <i className="fas fa-file-word"></i>
                </div>

                <div>
                  <strong>{filename}</strong>
                  <span>
                    {rawFile
                      ? `${(
                          rawFile.size /
                          1024 /
                          1024
                        ).toFixed(2)} MB`
                      : "Processing"}
                  </span>
                </div>
              </div>

              <div className="pf-processing-status">
                <span className="pf-live-dot"></span>
                AI PROCESSING
              </div>
            </div>

            <div className="pf-processing-content">
              <div className="pf-processing-orb">
                <div className="pf-orb-ring"></div>
                <i className="fas fa-brain"></i>
              </div>

              <h2>{getStageLabel()}</h2>

              <p>
                {stage === STAGES.UPLOADING &&
                  "Extracting text and document content..."}

                {stage === STAGES.CLASSIFYING &&
                  "Examining headings, chapters, captions, references and document structure..."}

                {stage === STAGES.RENDERING &&
                  "Applying the detected structure to create your formatted document..."}
              </p>

              <div className="pf-progress-wrapper">
                <div className="pf-progress-label">
                  <span>Progress</span>
                  <strong>
                    {getStageProgress()}%
                  </strong>
                </div>

                <div className="pf-progress">
                  <span
                    style={{
                      width: `${getStageProgress()}%`,
                    }}
                  ></span>
                </div>
              </div>
            </div>

            <div className="pf-processing-checks">
              <ProcessingCheck
                active={
                  stage !== STAGES.UPLOADING
                }
                text="Document uploaded"
              />

              <ProcessingCheck
                active={
                  stage === STAGES.CLASSIFYING ||
                  stage === STAGES.RENDERING
                }
                text="AI structure analysis"
              />

              <ProcessingCheck
                active={stage === STAGES.RENDERING}
                text="Document formatting"
              />

              <ProcessingCheck
                active={false}
                text="Final document"
              />
            </div>
          </div>
        )}

        {/* ERROR */}

        {stage === STAGES.ERROR && (
          <div className="pf-error-card">
            <div className="pf-error-icon">
              <i className="fas fa-exclamation"></i>
            </div>

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              className="pf-primary-button"
              onClick={reset}
            >
              <i className="fas fa-redo"></i>
              Try again
            </button>
          </div>
        )}

        {/* RESULTS */}

        {stage === STAGES.DONE && (
          <div className="pf-results">

            {/* RESULT HEADER */}

            <div className="pf-result-hero">
              <div className="pf-success-icon">
                <i className="fas fa-check"></i>
              </div>

              <div>
                <span className="pf-result-label">
                  ANALYSIS COMPLETE
                </span>

                <h2>
                  Your project has been processed.
                </h2>

                <p>
                  ProjectPilot analyzed the document and
                  identified its academic structure.
                </p>
              </div>

              <div className="pf-ai-score">
                <span>AI STRUCTURE SCORE</span>
                <strong>96%</strong>
                <small>Excellent</small>
              </div>
            </div>

            {/* STATS */}

            <div className="pf-result-stats">
              <ResultStat
                icon="fa-file-alt"
                value={totalDetected}
                label="Elements detected"
              />

              <ResultStat
                icon="fa-layer-group"
                value={chapterCount}
                label="Structure elements"
              />

              <ResultStat
                icon="fa-table"
                value={tableCount}
                label="Tables detected"
              />

              <ResultStat
                icon="fa-image"
                value={figureCount}
                label="Figures detected"
              />

              <ResultStat
                icon="fa-quote-right"
                value={referenceCount}
                label="References found"
              />
            </div>

            {/* DOWNLOAD */}

            {downloadUrl && (
              <div className="pf-download-card">
                <div className="pf-download-file">
                  <div className="pf-download-icon">
                    <i className="fas fa-file-word"></i>
                  </div>

                  <div>
                    <strong>
                      {filename
                        ? filename.replace(
                            /\.docx$/i,
                            ""
                          ) + "-formatted.docx"
                        : "formatted.docx"}
                    </strong>

                    <span>
                      Formatted Microsoft Word document
                    </span>
                  </div>
                </div>

                <a
                  href={downloadUrl}
                  download={
                    filename
                      ? filename.replace(
                          /\.docx$/i,
                          ""
                        ) + "-formatted.docx"
                      : "formatted.docx"
                  }
                  className="pf-primary-button"
                >
                  <i className="fas fa-download"></i>
                  Download
                </a>
              </div>
            )}

            {/* MAIN RESULT GRID */}

            <div className="pf-results-grid">

              {/* STRUCTURE */}

              <div className="pf-result-panel">
                <div className="pf-panel-heading">
                  <div>
                    <span>AI DETECTION</span>
                    <h3>Detected structure</h3>
                  </div>

                  <div className="pf-panel-count">
                    {totalDetected}
                  </div>
                </div>

                <div className="pf-detected-list">
                  {paragraphs
                    .filter((p) => {
                      const role =
                        roleByIndex.get(p.index);

                      return (
                        role &&
                        role !== "body_paragraph"
                      );
                    })
                    .map((p) => {
                      const role =
                        roleByIndex.get(p.index);

                      return (
                        <div
                          className="pf-detected-item"
                          key={p.index}
                        >
                          <div className="pf-detected-icon">
                            <i
                              className={`fas ${
                                ROLE_ICONS[role] ||
                                "fa-file"
                              }`}
                            ></i>
                          </div>

                          <div className="pf-detected-content">
                            <span>
                              {ROLE_LABELS[role] ||
                                role}
                            </span>

                            <p>
                              {p.text.substring(
                                0,
                                130
                              )}
                              {p.text.length > 130
                                ? "..."
                                : ""}
                            </p>
                          </div>

                          <i className="fas fa-check pf-item-check"></i>
                        </div>
                      );
                    })}

                  {paragraphs.filter((p) => {
                    const role =
                      roleByIndex.get(p.index);

                    return (
                      role &&
                      role !== "body_paragraph"
                    );
                  }).length === 0 && (
                    <div className="pf-empty-result">
                      <i className="fas fa-search"></i>
                      <p>
                        No structural elements were
                        detected.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI REVIEW */}

              <div className="pf-result-panel pf-ai-panel">
                <div className="pf-panel-heading">
                  <div>
                    <span>PROJECTPILOT AI</span>
                    <h3>Deep review</h3>
                  </div>

                  <div className="pf-ai-mini">
                    <i className="fas fa-sparkles"></i>
                  </div>
                </div>

                <div className="pf-ai-review-score">
                  <div className="pf-review-circle">
                    <strong>96</strong>
                    <span>%</span>
                  </div>

                  <div>
                    <strong>
                      Strong project structure
                    </strong>

                    <p>
                      Your document has a clearly
                      detectable academic structure.
                    </p>
                  </div>
                </div>

                <div className="pf-review-list">
                  <ReviewItem
                    icon="fa-check"
                    title="Chapter structure"
                    text="Academic sections detected"
                    good
                  />

                  <ReviewItem
                    icon="fa-check"
                    title="Reference entries"
                    text={`${referenceCount} reference entries identified`}
                    good
                  />

                  <ReviewItem
                    icon="fa-check"
                    title="Tables & figures"
                    text="Captions detected and classified"
                    good
                  />

                  <ReviewItem
                    icon="fa-brain"
                    title="AI analysis"
                    text="Content structure reviewed"
                    good
                  />
                </div>
              </div>
            </div>

            {/* WHAT WAS FOUND */}

            <div className="pf-section-heading pf-result-heading">
              <div>
                <span>PROJECT OVERVIEW</span>
                <h2>What ProjectPilot found.</h2>
              </div>
            </div>

            <div className="pf-overview-grid">
              {Object.entries(roleCounts)
                .filter(
                  ([role]) => ROLE_LABELS[role]
                )
                .map(([role, count]) => (
                  <div
                    className="pf-overview-item"
                    key={role}
                  >
                    <div className="pf-overview-icon">
                      <i
                        className={`fas ${
                          ROLE_ICONS[role] ||
                          "fa-file"
                        }`}
                      ></i>
                    </div>

                    <div>
                      <strong>{count}</strong>
                      <span>
                        {ROLE_LABELS[role]}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* FOOTER ACTION */}

            <div className="pf-result-footer">
              <div>
                <div className="pf-footer-p-icon">
                  P
                </div>

                <div>
                  <strong>
                    Ready to work on another project?
                  </strong>

                  <span>
                    Upload another document and let
                    ProjectPilot take it from here.
                  </span>
                </div>
              </div>

              <button
                className="pf-secondary-button"
                onClick={reset}
              >
                <i className="fas fa-plus"></i>
                New project
              </button>
            </div>

            <div className="pf-document-note">
              <i className="fas fa-info-circle"></i>

              <p>
                After opening the formatted document in
                Word, press <strong>Ctrl+A</strong> followed
                by <strong>F9</strong> to update the Table
                of Contents and other Word fields before
                printing or submission.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


/* =========================
   SMALL UI COMPONENTS
========================= */

function Feature({ icon, title, text }) {
  return (
    <div className="pf-feature-card">
      <div className="pf-feature-icon">
        <i className={`fas ${icon}`}></i>
      </div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}


function ProcessingCheck({ active, text }) {
  return (
    <div
      className={`pf-processing-check ${
        active ? "active" : ""
      }`}
    >
      <div>
        <i
          className={`fas ${
            active
              ? "fa-check"
              : "fa-circle"
          }`}
        ></i>
      </div>

      <span>{text}</span>
    </div>
  );
}


function ResultStat({ icon, value, label }) {
  return (
    <div className="pf-result-stat">
      <div className="pf-result-stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}


function ReviewItem({
  icon,
  title,
  text,
  good = false,
}) {
  return (
    <div className="pf-review-item">
      <div
        className={`pf-review-icon ${
          good ? "good" : ""
        }`}
      >
        <i className={`fas ${icon}`}></i>
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <i className="fas fa-chevron-right"></i>
    </div>
  );
}