// src/pages/dashboard/ProjectFormatter.jsx

import { useRef, useState } from "react";
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
  chapter_heading: "Chapter",
  section_heading: "Section",
  subsection_heading: "Subsection",
  subsubsection_heading: "Sub-subsection",
  figure_caption: "Figure caption",
  table_caption: "Table caption",
  plate_caption: "Plate caption",
  reference_entry: "Reference",
  abstract_heading: "Abstract",
  body_paragraph: "Body text",
};

const ROLE_ICONS = {
  chapter_heading: "fa-solid fa-book-open",
  section_heading: "fa-solid fa-layer-group",
  subsection_heading: "fa-solid fa-list",
  subsubsection_heading: "fa-solid fa-list-check",
  figure_caption: "fa-solid fa-image",
  table_caption: "fa-solid fa-table",
  plate_caption: "fa-solid fa-images",
  reference_entry: "fa-solid fa-quote-left",
  abstract_heading: "fa-solid fa-file-lines",
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

  const fileInputRef = useRef(null);

  async function processFile(file) {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a Microsoft Word (.docx) document.");
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

      const classifyRes = await fetch("/api/project-formatter/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paragraphs: uploadData.paragraphs,
        }),
      });

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

      setError(err.message || "Something went wrong.");

      setStage(STAGES.ERROR);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (file) {
      processFile(file);
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const roleByIndex = new Map(
    classifications.map((c) => [c.index, c.role])
  );

  const roleCounts = classifications.reduce((acc, c) => {
    acc[c.role] = (acc[c.role] || 0) + 1;
    return acc;
  }, {});

  const detectedItems = paragraphs.filter((p) => {
    const role = roleByIndex.get(p.index);

    return (
      role &&
      role !== "body_paragraph" &&
      ROLE_LABELS[role]
    );
  });

  const totalParagraphs = paragraphs.length;

  const chapters =
    roleCounts.chapter_heading || 0;

  const sections =
    roleCounts.section_heading || 0;

  const references =
    roleCounts.reference_entry || 0;

  return (
    <DashboardLayout
      title="Project Formatter"
      subtitle="Transform a messy academic document into a structured, professionally formatted project."
    >
      <div className="project-formatter">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="pf-header">

          <div className="pf-header__content">

            <div className="pf-eyebrow">
              <span className="pf-eyebrow__icon">
                <i className="fa-solid fa-wand-magic-sparkles" />
              </span>

              AI-POWERED ACADEMIC FORMATTING
            </div>

            <h1>
              From messy project
              <span> to polished document.</span>
            </h1>

            <p>
              Upload your project work and let ProjectPilot
              intelligently identify your chapters, headings,
              tables, figures, references and other academic
              structures — then prepare everything for a
              professionally formatted document.
            </p>

          </div>

          <div className="pf-header__badge">

            <div className="pf-brand-mark">
              <i className="fa-solid fa-file-circle-check" />
            </div>

            <div>
              <strong>ProjectPilot</strong>
              <span>by Memora Smart</span>
            </div>

          </div>

        </section>


        {/* =====================================================
            WORKFLOW
        ====================================================== */}

        <section className="pf-workflow">

          <div className="pf-workflow__line" />

          <div
            className={`pf-workflow-step ${
              stage !== STAGES.IDLE ? "is-active" : ""
            }`}
          >
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-cloud-arrow-up" />
            </div>

            <div>
              <strong>Upload</strong>
              <span>Your project</span>
            </div>
          </div>

          <div
            className={`pf-workflow-step ${
              [
                STAGES.CLASSIFYING,
                STAGES.RENDERING,
                STAGES.DONE,
              ].includes(stage)
                ? "is-active"
                : ""
            }`}
          >
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-brain" />
            </div>

            <div>
              <strong>Analyze</strong>
              <span>AI structure scan</span>
            </div>
          </div>

          <div
            className={`pf-workflow-step ${
              [
                STAGES.RENDERING,
                STAGES.DONE,
              ].includes(stage)
                ? "is-active"
                : ""
            }`}
          >
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-layer-group" />
            </div>

            <div>
              <strong>Organize</strong>
              <span>Structure & format</span>
            </div>
          </div>

          <div
            className={`pf-workflow-step ${
              stage === STAGES.DONE
                ? "is-active"
                : ""
            }`}
          >
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-circle-check" />
            </div>

            <div>
              <strong>Finalize</strong>
              <span>Download document</span>
            </div>
          </div>

        </section>


        {/* =====================================================
            IDLE / UPLOAD
        ====================================================== */}

        {stage === STAGES.IDLE && (
          <section className="pf-upload-layout">

            <div
              className={`pf-upload-card ${
                isDragging ? "is-dragging" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >

              <div className="pf-upload-card__glow" />

              <div className="pf-upload-icon">
                <i className="fa-solid fa-file-word" />
              </div>

              <div className="pf-upload-card__content">

                <h2>
                  Drop your project here
                </h2>

                <p>
                  Upload your Microsoft Word project and
                  let ProjectPilot analyze its structure.
                </p>

                <button
                  type="button"
                  className="pf-primary-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <i className="fa-solid fa-arrow-up-from-bracket" />

                  Choose .DOCX file

                  <i className="fa-solid fa-arrow-right" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  hidden
                />

                <span className="pf-upload-hint">
                  <i className="fa-solid fa-shield-halved" />
                  Your document is processed securely
                </span>

              </div>

            </div>


            <div className="pf-capabilities">

              <div className="pf-capabilities__heading">
                <span>WHAT PROJECTPILOT CHECKS</span>
                <i className="fa-solid fa-sliders" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon">
                  <i className="fa-solid fa-book-open" />
                </div>

                <div>
                  <strong>Project structure</strong>
                  <span>
                    Chapters, sections & subsections
                  </span>
                </div>

                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon">
                  <i className="fa-solid fa-table" />
                </div>

                <div>
                  <strong>Tables & figures</strong>
                  <span>
                    Captions and academic placement
                  </span>
                </div>

                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon">
                  <i className="fa-solid fa-quote-left" />
                </div>

                <div>
                  <strong>References</strong>
                  <span>
                    Identify and organize references
                  </span>
                </div>

                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon">
                  <i className="fa-solid fa-list-ol" />
                </div>

                <div>
                  <strong>Academic hierarchy</strong>
                  <span>
                    Heading levels and document flow
                  </span>
                </div>

                <i className="fa-solid fa-check" />
              </div>

            </div>

          </section>
        )}


        {/* =====================================================
            PROCESSING
        ====================================================== */}

        {(stage === STAGES.UPLOADING ||
          stage === STAGES.CLASSIFYING ||
          stage === STAGES.RENDERING) && (

          <section className="pf-processing">

            <div className="pf-processing__orb">
              <div className="pf-processing__icon">

                {stage === STAGES.UPLOADING && (
                  <i className="fa-solid fa-file-arrow-up" />
                )}

                {stage === STAGES.CLASSIFYING && (
                  <i className="fa-solid fa-brain" />
                )}

                {stage === STAGES.RENDERING && (
                  <i className="fa-solid fa-file-circle-check" />
                )}

              </div>
            </div>

            <div className="pf-processing__text">

              <span className="pf-processing__label">
                {stage === STAGES.UPLOADING &&
                  "STEP 01 · READING DOCUMENT"}

                {stage === STAGES.CLASSIFYING &&
                  "STEP 02 · AI ANALYSIS"}

                {stage === STAGES.RENDERING &&
                  "STEP 03 · BUILDING DOCUMENT"}
              </span>

              <h2>
                {stage === STAGES.UPLOADING &&
                  "Reading your project..."}

                {stage === STAGES.CLASSIFYING &&
                  "Understanding your project structure..."}

                {stage === STAGES.RENDERING &&
                  "Preparing your formatted document..."}
              </h2>

              <p>
                {stage === STAGES.UPLOADING &&
                  "We're extracting the content from your Word document."}

                {stage === STAGES.CLASSIFYING &&
                  "ProjectPilot is identifying chapters, headings, captions and references."}

                {stage === STAGES.RENDERING &&
                  "Your detected structure is being applied to the document."}
              </p>

            </div>

            <div className="pf-progress">

              <div className="pf-progress__track">
                <div className="pf-progress__bar" />
              </div>

              <div className="pf-progress__meta">
                <span>
                  {filename}
                </span>

                <span>
                  Please keep this page open
                </span>
              </div>

            </div>

          </section>
        )}


        {/* =====================================================
            ERROR
        ====================================================== */}

        {stage === STAGES.ERROR && (

          <section className="pf-error">

            <div className="pf-error__icon">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>

            <div>
              <span>PROCESSING ERROR</span>

              <h2>
                We couldn't complete the formatting.
              </h2>

              <p>
                {error ||
                  "Something went wrong while processing your document."}
              </p>

              <button
                className="pf-secondary-button"
                onClick={reset}
              >
                <i className="fa-solid fa-rotate-left" />
                Try again
              </button>
            </div>

          </section>
        )}


        {/* =====================================================
            COMPLETED
        ====================================================== */}

        {stage === STAGES.DONE && (

          <section className="pf-results">

            <div className="pf-success">

              <div className="pf-success__check">
                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-success__content">

                <span>
                  FORMATTING COMPLETE
                </span>

                <h2>
                  Your project is ready.
                </h2>

                <p>
                  ProjectPilot successfully analyzed and
                  formatted your document structure.
                </p>

              </div>

              {downloadUrl && (
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
                  <i className="fa-solid fa-download" />
                  Download document
                </a>
              )}

            </div>


            {/* DOCUMENT SUMMARY */}

            <div className="pf-results-grid">

              <div className="pf-summary-card pf-summary-card--main">

                <div className="pf-card-heading">

                  <div>
                    <span>DOCUMENT ANALYSIS</span>

                    <h3>
                      Detected structure
                    </h3>
                  </div>

                  <div className="pf-card-heading__icon">
                    <i className="fa-solid fa-chart-simple" />
                  </div>

                </div>


                <div className="pf-stat-grid">

                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon">
                      <i className="fa-solid fa-book-open" />
                    </span>

                    <strong>{chapters}</strong>

                    <span>Chapters</span>
                  </div>

                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon">
                      <i className="fa-solid fa-layer-group" />
                    </span>

                    <strong>{sections}</strong>

                    <span>Sections</span>
                  </div>

                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon">
                      <i className="fa-solid fa-quote-left" />
                    </span>

                    <strong>{references}</strong>

                    <span>References</span>
                  </div>

                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon">
                      <i className="fa-solid fa-align-left" />
                    </span>

                    <strong>{totalParagraphs}</strong>

                    <span>Paragraphs</span>
                  </div>

                </div>

              </div>


              <div className="pf-summary-card">

                <div className="pf-card-heading">

                  <div>
                    <span>PROJECT FILE</span>

                    <h3>
                      {filename}
                    </h3>
                  </div>

                  <i className="fa-solid fa-file-word pf-word-icon" />

                </div>

                <div className="pf-file-details">

                  <div>
                    <i className="fa-solid fa-circle-check" />
                    <span>Document processed</span>
                  </div>

                  <div>
                    <i className="fa-solid fa-circle-check" />
                    <span>Structure analyzed</span>
                  </div>

                  <div>
                    <i className="fa-solid fa-circle-check" />
                    <span>Formatting generated</span>
                  </div>

                </div>

              </div>

            </div>


            {/* DETECTED STRUCTURE */}

            <div className="pf-detected">

              <div className="pf-card-heading">

                <div>
                  <span>AI STRUCTURE MAP</span>

                  <h3>
                    What ProjectPilot found
                  </h3>
                </div>

                <span className="pf-item-count">
                  {detectedItems.length} items
                </span>

              </div>


              <div className="pf-detected-list">

                {detectedItems.length > 0 ? (
                  detectedItems.map((p) => {

                    const role =
                      roleByIndex.get(p.index);

                    return (
                      <div
                        className="pf-detected-item"
                        key={p.index}
                      >

                        <div className="pf-detected-item__icon">
                          <i
                            className={
                              ROLE_ICONS[role] ||
                              "fa-solid fa-file-lines"
                            }
                          />
                        </div>

                        <div className="pf-detected-item__body">

                          <span>
                            {ROLE_LABELS[role] ||
                              role}
                          </span>

                          <p>
                            {p.text.substring(0, 180)}
                            {p.text.length > 180
                              ? "..."
                              : ""}
                          </p>

                        </div>

                        <i className="fa-solid fa-check pf-detected-item__check" />

                      </div>
                    );
                  })
                ) : (
                  <div className="pf-empty">
                    <i className="fa-solid fa-magnifying-glass" />

                    <p>
                      No classified structural elements
                      were detected.
                    </p>
                  </div>
                )}

              </div>

            </div>


            <div className="pf-result-footer">

              <button
                className="pf-secondary-button"
                onClick={reset}
              >
                <i className="fa-solid fa-plus" />
                Format another project
              </button>

              <p>
                <i className="fa-solid fa-circle-info" />

                For the best final result, open the document
                in Microsoft Word and update the Table of
                Contents fields before printing.
              </p>

            </div>

          </section>
        )}

      </div>
    </DashboardLayout>
  );
}