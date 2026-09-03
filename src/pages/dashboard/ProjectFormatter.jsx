// src/pages/dashboard/ProjectFormatter.jsx
//
// Stage flow:
//   IDLE (upload prompt)
//     -> UPLOADING (upload.py call)
//     -> UPLOADED (file held, shown to user, waits for their command)
//     -> CLASSIFYING (classify.js call, runs once, silently feeds CONFIGURING)
//     -> CONFIGURING (checklist / personal details / formatting screen)
//     -> [DRAFTING] (only if AI dedication/acknowledgement text is needed)
//     -> RENDERING (render.py call)
//     -> DONE
//
// Design note on stage order: the brief that shaped this flow lists
// CLASSIFYING as happening AFTER the user clicks "Format Project", with
// the render step described as "classify (if not already done) and
// render". But the CONFIGURING screen needs classification results
// already in hand to default-check the prelim checklist and pre-fill the
// personal details form. Those two requirements only both hold if
// classification actually runs once, right after UPLOADED and before
// CONFIGURING is shown — so that's what happens here. By the time
// "Format Project" is clicked, classification is already done, and the
// click goes straight to drafting (if needed) and rendering.
import { useRef, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  PRELIM_CHECKLIST_ITEMS,
  detectPrelimSections,
  defaultPrelimToggles,
  guessPersonalDetails,
} from "./projectFormatterUtils";
import {
  fileCacheKey,
  getCachedClassifications,
  setCachedClassifications,
  getCachedDraft,
  setCachedDraft,
  clearCacheForFile,
} from "./projectFormatterCache";
import "./ProjectFormatter.css";

const STAGES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  CLASSIFYING: "classifying",
  CONFIGURING: "configuring",
  DRAFTING: "drafting",
  RENDERING: "rendering",
  DONE: "done",
  ERROR: "error",
};

const PROCESSING_STAGES = [
  STAGES.UPLOADING,
  STAGES.CLASSIFYING,
  STAGES.DRAFTING,
  STAGES.RENDERING,
];

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

const CHECKLIST_ICONS = {
  coverPage: "fa-solid fa-file-shield",
  titlePage: "fa-solid fa-file-signature",
  certification: "fa-solid fa-stamp",
  declaration: "fa-solid fa-file-pen",
  dedication: "fa-solid fa-heart",
  acknowledgement: "fa-solid fa-hands-praying",
  abstract: "fa-solid fa-file-lines",
  tableOfContents: "fa-solid fa-list-ol",
  listOfTables: "fa-solid fa-table",
  listOfFigures: "fa-solid fa-image",
  listOfPlates: "fa-solid fa-images",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const FONT_OPTIONS = ["Times New Roman", "Arial", "Calibri", "Cambria"];
const SIZE_OPTIONS = [11, 12, 13, 14];
const SPACING_OPTIONS = [
  { value: 1.0, label: "Single" },
  { value: 1.5, label: "1.5 lines" },
  { value: 2.0, label: "Double" },
];

const DEFAULT_PERSONAL_DETAILS = {
  firstName: "", middleName: "", surname: "", matricNumber: "",
  projectTopic: "", department: "", faculty: "", university: "",
  degreeAwarded: "", supervisorName: "", hodName: "", deanName: "",
  externalExaminerName: "", submissionMonth: "", submissionYear: "",
  dedicationTo: "",
};

function base64ToBlob(base64, mime) {
  const byteChars = atob(base64);
  const byteNumbers = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([byteNumbers], { type: mime });
}

export default function ProjectFormatter() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [processingLabel, setProcessingLabel] = useState("");
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [rawFile, setRawFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [classifications, setClassifications] = useState([]);
  // Content hash of the uploaded file — the cache key for this document's
  // classification and AI-drafted text. See projectFormatterCache.js.
  const [fileKey, setFileKey] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(null); // { cachedAt } when reused
  const [detectedPrelim, setDetectedPrelim] = useState({});
  const [prelimToggles, setPrelimToggles] = useState({});
  const [personalDetails, setPersonalDetails] = useState(DEFAULT_PERSONAL_DETAILS);
  const [formatting, setFormatting] = useState({
    fontFamily: "Times New Roman",
    fontSizePt: 12,
    lineSpacing: 2.0,
  });
  const [customInstruction, setCustomInstruction] = useState("");

  const [aiDraftedFlags, setAiDraftedFlags] = useState({ dedication: false, acknowledgement: false });
  const [unsupportedRequests, setUnsupportedRequests] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");

  const fileInputRef = useRef(null);

  // ---------------------------------------------------------------------
  // Stage 1: upload
  // ---------------------------------------------------------------------
  async function processFile(file) {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a Microsoft Word (.docx) document.");
      setStage(STAGES.ERROR);
      return;
    }

    setError(null);
    setStage(STAGES.UPLOADING);
    setProcessingLabel("Reading your project...");
    setFilename(file.name);
    setRawFile(file);
    setCacheInfo(null);

    try {
      // Hash the file's bytes up front so the classify step can look for
      // a previous result for this exact document. Never fatal — a
      // hashing failure just means this run goes uncached.
      try {
        setFileKey(await fileCacheKey(file));
      } catch {
        setFileKey(null);
      }

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
      setStage(STAGES.UPLOADED);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setStage(STAGES.ERROR);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  // ---------------------------------------------------------------------
  // Stage 2: classify (runs once, right after the user confirms UPLOADED,
  // so CONFIGURING can be pre-filled with real detection results)
  // ---------------------------------------------------------------------
  async function handleContinueToConfigure({ forceReanalyze = false } = {}) {
    setStage(STAGES.CLASSIFYING);
    setProcessingLabel("Understanding your project structure...");

    try {
      // Classification is the one genuinely expensive step in the whole
      // pipeline — it sends every paragraph to the model. Re-formatting
      // the same document (the normal loop when someone is adjusting
      // options) shouldn't pay for it again, so a previous result for
      // this exact file is reused. Keyed by the file's content hash, so
      // an edited document never gets a stale structure map.
      let cls = null;
      let fromCache = null;

      if (fileKey && !forceReanalyze) {
        const hit = getCachedClassifications(fileKey);
        if (hit) {
          cls = hit.classifications;
          fromCache = { cachedAt: hit.cachedAt };
        }
      }

      if (!cls) {
        const classifyRes = await fetch("/api/project-formatter/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paragraphs }),
        });

        const classifyData = await classifyRes.json();
        if (!classifyRes.ok) {
          throw new Error(classifyData.error || "Classification failed");
        }
        cls = classifyData.classifications;
        if (fileKey) setCachedClassifications(fileKey, cls);
      }

      setCacheInfo(fromCache);
      setClassifications(cls);

      const detected = detectPrelimSections(cls);
      setDetectedPrelim(detected);
      // NOT the same object as `detected` — Cover/Title/Declaration/
      // Certification default CHECKED only when missing (offering to
      // generate them), the opposite of every other item, because
      // checking one of these when already present would silently
      // replace the student's real original page. See
      // defaultPrelimToggles in projectFormatterUtils.js.
      setPrelimToggles(defaultPrelimToggles(cls));

      const guessed = guessPersonalDetails(paragraphs, cls);
      setPersonalDetails((prev) => {
        const merged = { ...prev };
        for (const key of Object.keys(guessed)) {
          if (guessed[key]) merged[key] = guessed[key];
        }
        return merged;
      });

      setStage(STAGES.CONFIGURING);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setStage(STAGES.ERROR);
    }
  }

  // ---------------------------------------------------------------------
  // Stage 3: CONFIGURING form handlers
  // ---------------------------------------------------------------------
  function togglePrelim(key) {
    setPrelimToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  /**
   * Returns to the options screen with the SAME document still loaded —
   * the file, its structure scan and the details already filled in all
   * stay in memory, so changing a setting and re-formatting costs no AI
   * call at all (not even a cache lookup). Only the previous run's
   * output is discarded, since it no longer reflects the new options.
   */
  function handleAdjustOptions() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setDownloadFilename(null);
    setPreviewHtml("");
    setAiDraftedFlags({ dedication: false, acknowledgement: false });
    setUnsupportedRequests([]);
    setError(null);
    setStage(STAGES.CONFIGURING);
  }

  /** Discards this document's cached AI results and classifies it again. */
  function handleReanalyze() {
    if (fileKey) clearCacheForFile(fileKey);
    setCacheInfo(null);
    handleContinueToConfigure({ forceReanalyze: true });
  }

  function updatePersonal(field, value) {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  }

  function updateFormatting(field, value) {
    setFormatting((prev) => ({ ...prev, [field]: value }));
  }

  // ---------------------------------------------------------------------
  // Stage 4: "Format Project" — interpret custom instruction (if any),
  // draft dedication/acknowledgement (only if toggled on AND genuinely
  // absent from the source document), render, and build the preview.
  // ---------------------------------------------------------------------
  async function handleFormatProject() {
    let directives = { italicizeEtAl: false, unsupportedRequests: [] };

    if (customInstruction.trim()) {
      try {
        const res = await fetch("/api/project-formatter/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "interpretDirectives", customInstruction }),
        });
        const data = await res.json();
        if (res.ok && data.directives) {
          directives = data.directives;
        }
      } catch (err) {
        // Soft failure: a hiccup interpreting the custom instruction box
        // shouldn't block the rest of the formatting the user asked for.
        console.error("Directive interpretation failed:", err);
      }
    }
    setUnsupportedRequests(directives.unsupportedRequests || []);

    const needsDedicationDraft = prelimToggles.dedication && !detectedPrelim.dedication;
    const needsAckDraft = prelimToggles.acknowledgement && !detectedPrelim.acknowledgement;

    let aiDraftedContent = {};
    const draftedFlags = { dedication: false, acknowledgement: false };

    if (needsDedicationDraft || needsAckDraft) {
      setStage(STAGES.DRAFTING);
      setProcessingLabel("Drafting your dedication and acknowledgement...");
      try {
        // Cheaper than classification, but this fires on EVERY "Format
        // Project" click, so repeated runs while adjusting options add
        // up. Reuse the previous draft when the details it's built from
        // haven't changed — change the supervisor or who the work is
        // dedicated to and it re-drafts.
        let data = fileKey ? getCachedDraft(fileKey, personalDetails) : null;

        if (!data) {
          const res = await fetch("/api/project-formatter/generate-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "draftPrelim", personalDetails }),
          });
          const fetched = await res.json();
          if (res.ok) {
            data = fetched;
            if (fileKey) setCachedDraft(fileKey, personalDetails, fetched);
          }
        }

        if (data) {
          if (needsDedicationDraft && data.dedicationText) {
            aiDraftedContent.dedicationText = data.dedicationText;
            draftedFlags.dedication = true;
          }
          if (needsAckDraft && data.acknowledgementText) {
            aiDraftedContent.acknowledgementText = data.acknowledgementText;
            draftedFlags.acknowledgement = true;
          }
        }
      } catch (err) {
        // Soft failure again: proceed without AI-drafted text rather than
        // blocking the whole formatting job. render.py simply won't add a
        // Dedication/Acknowledgement page if the text never arrives.
        console.error("AI drafting failed:", err);
      }
    }
    setAiDraftedFlags(draftedFlags);

    setStage(STAGES.RENDERING);
    setProcessingLabel("Preparing your formatted document...");

    try {
      const options = {
        prelimToggles,
        personalDetails,
        formatting,
        aiDraftedContent,
        directives,
      };

      const renderFormData = new FormData();
      renderFormData.append("document", rawFile);
      renderFormData.append("classifications", JSON.stringify(classifications));
      renderFormData.append("options", JSON.stringify(options));
      renderFormData.append("filename", filename);

      const renderRes = await fetch("/api/project-formatter/render", {
        method: "POST",
        body: renderFormData,
      });

      const renderData = await renderRes.json();
      if (!renderRes.ok || !renderData.success) {
        throw new Error(renderData.error || "Formatting failed");
      }

      const blob = base64ToBlob(
        renderData.docxBase64,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(renderData.filename || "formatted.docx");
      setPreviewHtml(renderData.previewHtml || "");
      setStage(STAGES.DONE);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setStage(STAGES.ERROR);
    }
  }

  // ---------------------------------------------------------------------
  function reset() {
    setStage(STAGES.IDLE);
    setError(null);
    setFilename(null);
    setParagraphs([]);
    setRawFile(null);
    setClassifications([]);
    setFileKey(null);
    setCacheInfo(null);
    setDetectedPrelim({});
    setPrelimToggles({});
    setPersonalDetails(DEFAULT_PERSONAL_DETAILS);
    setFormatting({ fontFamily: "Times New Roman", fontSizePt: 12, lineSpacing: 2.0 });
    setCustomInstruction("");
    setAiDraftedFlags({ dedication: false, acknowledgement: false });
    setUnsupportedRequests([]);
    setPreviewHtml("");

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setDownloadFilename(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const roleByIndex = new Map(classifications.map((c) => [c.index, c.role]));

  const roleCounts = classifications.reduce((acc, c) => {
    acc[c.role] = (acc[c.role] || 0) + 1;
    return acc;
  }, {});

  const detectedItems = paragraphs.filter((p) => {
    const role = roleByIndex.get(p.index);
    return role && role !== "body_paragraph" && ROLE_LABELS[role];
  });

  const totalParagraphs = paragraphs.length;
  const chapters = roleCounts.chapter_heading || 0;
  const sections = roleCounts.section_heading || 0;
  const references = roleCounts.reference_entry || 0;

  const showAiNotice = aiDraftedFlags.dedication || aiDraftedFlags.acknowledgement;

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
              Upload your project work and let ProjectPilot intelligently
              identify your chapters, headings, tables, figures, references
              and other academic structures — then prepare everything for a
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

          <div className={`pf-workflow-step ${stage !== STAGES.IDLE ? "is-active" : ""}`}>
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
              [STAGES.CLASSIFYING, STAGES.CONFIGURING, STAGES.DRAFTING, STAGES.RENDERING, STAGES.DONE].includes(stage)
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
              [STAGES.CONFIGURING, STAGES.DRAFTING, STAGES.RENDERING, STAGES.DONE].includes(stage) ? "is-active" : ""
            }`}
          >
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-sliders" />
            </div>
            <div>
              <strong>Configure</strong>
              <span>Your preferences</span>
            </div>
          </div>

          <div className={`pf-workflow-step ${stage === STAGES.DONE ? "is-active" : ""}`}>
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
              className={`pf-upload-card ${isDragging ? "is-dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="pf-upload-card__glow" />
              <div className="pf-upload-icon">
                <i className="fa-solid fa-file-word" />
              </div>
              <div className="pf-upload-card__content">
                <h2>Drop your project here</h2>
                <p>
                  Upload your Microsoft Word project and let ProjectPilot
                  analyze its structure.
                </p>
                <button
                  type="button"
                  className="pf-primary-button"
                  onClick={() => fileInputRef.current?.click()}
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
                <div className="pf-capability__icon"><i className="fa-solid fa-book-open" /></div>
                <div>
                  <strong>Project structure</strong>
                  <span>Chapters, sections & subsections</span>
                </div>
                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon"><i className="fa-solid fa-table" /></div>
                <div>
                  <strong>Tables & figures</strong>
                  <span>Captions and academic placement</span>
                </div>
                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon"><i className="fa-solid fa-quote-left" /></div>
                <div>
                  <strong>References</strong>
                  <span>Identify and organize references</span>
                </div>
                <i className="fa-solid fa-check" />
              </div>

              <div className="pf-capability">
                <div className="pf-capability__icon"><i className="fa-solid fa-list-ol" /></div>
                <div>
                  <strong>Academic hierarchy</strong>
                  <span>Heading levels and document flow</span>
                </div>
                <i className="fa-solid fa-check" />
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            UPLOADED — file held, waits for explicit command
        ====================================================== */}

        {stage === STAGES.UPLOADED && (
          <section className="pf-uploaded">
            <div className="pf-uploaded__icon">
              <i className="fa-solid fa-file-word" />
            </div>

            <div className="pf-uploaded__body">
              <span className="pf-uploaded__eyebrow">FILE READY</span>
              <h2>{filename}</h2>
              <p>
                We read <strong>{totalParagraphs}</strong> paragraphs from
                your document. Nothing has been changed yet — when you're
                ready, ProjectPilot will scan its structure so you can
                choose exactly what to format.
              </p>
            </div>

            <div className="pf-uploaded__actions">
              <button className="pf-secondary-button" onClick={reset}>
                <i className="fa-solid fa-rotate-left" />
                Choose a different file
              </button>
              <button className="pf-primary-button" onClick={handleContinueToConfigure}>
                <i className="fa-solid fa-magnifying-glass-chart" />
                Analyze structure
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            PROCESSING (uploading / classifying / drafting / rendering)
        ====================================================== */}

        {PROCESSING_STAGES.includes(stage) && (
          <section className="pf-processing">
            <div className="pf-processing__orb">
              <div className="pf-processing__icon">
                {stage === STAGES.UPLOADING && <i className="fa-solid fa-file-arrow-up" />}
                {stage === STAGES.CLASSIFYING && <i className="fa-solid fa-brain" />}
                {stage === STAGES.DRAFTING && <i className="fa-solid fa-feather-pointed" />}
                {stage === STAGES.RENDERING && <i className="fa-solid fa-file-circle-check" />}
              </div>
            </div>

            <div className="pf-processing__text">
              <span className="pf-processing__label">
                {stage === STAGES.UPLOADING && "STEP 01 · READING DOCUMENT"}
                {stage === STAGES.CLASSIFYING && "STEP 02 · AI ANALYSIS"}
                {stage === STAGES.DRAFTING && "STEP 03 · AI DRAFTING"}
                {stage === STAGES.RENDERING && "STEP 04 · BUILDING DOCUMENT"}
              </span>
              <h2>{processingLabel}</h2>
              <p>
                {stage === STAGES.UPLOADING && "We're extracting the content from your Word document."}
                {stage === STAGES.CLASSIFYING && "ProjectPilot is identifying chapters, headings, captions and references."}
                {stage === STAGES.DRAFTING && "Writing a short dedication and acknowledgement based on your details — you'll be able to review and edit them."}
                {stage === STAGES.RENDERING && "Your chosen structure and formatting are being applied to the document."}
              </p>
            </div>

            <div className="pf-progress">
              <div className="pf-progress__track"><div className="pf-progress__bar" /></div>
              <div className="pf-progress__meta">
                <span>{filename}</span>
                <span>Please keep this page open</span>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            CONFIGURING
        ====================================================== */}

        {stage === STAGES.CONFIGURING && (
          <section className="pf-configuring">

            {cacheInfo && (
              <div className="pf-notice pf-notice--cache">
                <i className="fa-solid fa-bolt" />
                <div>
                  <strong>Reusing this document's saved structure scan.</strong>
                  <p>
                    We analyzed this exact file before, so we skipped the
                    AI scan and went straight here. Re-format it as many
                    times as you like at no extra cost. If you've edited
                    the document since, upload it again and it will be
                    re-scanned automatically.
                  </p>
                  <button
                    type="button"
                    className="pf-inline-button"
                    onClick={handleReanalyze}
                  >
                    <i className="fa-solid fa-rotate" />
                    Scan again anyway
                  </button>
                </div>
              </div>
            )}

            {/* Section 1: preliminary pages checklist */}
            <div className="pf-config-card">
              <div className="pf-card-heading">
                <div>
                  <span>SECTION 1 OF 3</span>
                  <h3>Preliminary pages</h3>
                </div>
                <div className="pf-card-heading__icon">
                  <i className="fa-solid fa-list-check" />
                </div>
              </div>
              <p className="pf-config-card__hint">
                Checked items were found in your document. Unchecked items
                weren't detected — tick any you'd like ProjectPilot to
                generate for you.
              </p>

              <div className="pf-checklist">
                {PRELIM_CHECKLIST_ITEMS.map(({ key, label }) => (
                  <label className="pf-checklist-item" key={key}>
                    <input
                      type="checkbox"
                      checked={!!prelimToggles[key]}
                      onChange={() => togglePrelim(key)}
                    />
                    <span className="pf-checklist-item__icon">
                      <i className={CHECKLIST_ICONS[key]} />
                    </span>
                    <span className="pf-checklist-item__label">{label}</span>
                    {detectedPrelim[key] ? (
                      <span className="pf-checklist-item__tag pf-checklist-item__tag--found">
                        Found in document
                      </span>
                    ) : (
                      <span className="pf-checklist-item__tag">Not detected</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 2: personal & institutional details */}
            <div className="pf-config-card">
              <div className="pf-card-heading">
                <div>
                  <span>SECTION 2 OF 3</span>
                  <h3>Personal &amp; institutional details</h3>
                </div>
                <div className="pf-card-heading__icon">
                  <i className="fa-solid fa-id-card" />
                </div>
              </div>
              <p className="pf-config-card__hint">
                Pre-filled wherever we could find it in your document.
                Double-check before formatting.
              </p>

              <div className="pf-form-grid">
                <div className="pf-field-group-label">Name &amp; matriculation</div>
                <div className="pf-field">
                  <label>First name</label>
                  <input value={personalDetails.firstName} onChange={(e) => updatePersonal("firstName", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Middle name</label>
                  <input value={personalDetails.middleName} onChange={(e) => updatePersonal("middleName", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Surname</label>
                  <input value={personalDetails.surname} onChange={(e) => updatePersonal("surname", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Matric number</label>
                  <input value={personalDetails.matricNumber} onChange={(e) => updatePersonal("matricNumber", e.target.value)} />
                </div>

                <div className="pf-field-group-label">Project</div>
                <div className="pf-field pf-field--wide">
                  <label>Project topic</label>
                  <textarea
                    rows={2}
                    value={personalDetails.projectTopic}
                    onChange={(e) => updatePersonal("projectTopic", e.target.value)}
                  />
                </div>

                <div className="pf-field-group-label">Institution</div>
                <div className="pf-field">
                  <label>Department</label>
                  <input value={personalDetails.department} onChange={(e) => updatePersonal("department", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Faculty</label>
                  <input value={personalDetails.faculty} onChange={(e) => updatePersonal("faculty", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>University</label>
                  <input value={personalDetails.university} onChange={(e) => updatePersonal("university", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Degree awarded</label>
                  <input value={personalDetails.degreeAwarded} onChange={(e) => updatePersonal("degreeAwarded", e.target.value)} />
                </div>

                <div className="pf-field-group-label">Supervision &amp; approval</div>
                <div className="pf-field">
                  <label>Supervisor</label>
                  <input value={personalDetails.supervisorName} onChange={(e) => updatePersonal("supervisorName", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Head of Department</label>
                  <input value={personalDetails.hodName} onChange={(e) => updatePersonal("hodName", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>Dean of Faculty</label>
                  <input value={personalDetails.deanName} onChange={(e) => updatePersonal("deanName", e.target.value)} />
                </div>
                <div className="pf-field">
                  <label>External Examiner <span className="pf-optional-tag">optional</span></label>
                  <input value={personalDetails.externalExaminerName} onChange={(e) => updatePersonal("externalExaminerName", e.target.value)} />
                </div>

                <div className="pf-field-group-label">Submission</div>
                <div className="pf-field">
                  <label>Month</label>
                  <select value={personalDetails.submissionMonth} onChange={(e) => updatePersonal("submissionMonth", e.target.value)}>
                    <option value="">Select month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="pf-field">
                  <label>Year</label>
                  <input
                    type="number"
                    value={personalDetails.submissionYear}
                    onChange={(e) => updatePersonal("submissionYear", e.target.value)}
                    placeholder={String(new Date().getFullYear())}
                  />
                </div>

                {prelimToggles.dedication && (
                  <>
                    <div className="pf-field-group-label">Dedication</div>
                    <div className="pf-field pf-field--wide">
                      <label>Dedicate this project to</label>
                      <input
                        value={personalDetails.dedicationTo}
                        onChange={(e) => updatePersonal("dedicationTo", e.target.value)}
                        placeholder="e.g. my parents, my late father, Almighty God..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 3: formatting overrides */}
            <div className="pf-config-card">
              <div className="pf-card-heading">
                <div>
                  <span>SECTION 3 OF 3</span>
                  <h3>Formatting &amp; custom instructions</h3>
                </div>
                <div className="pf-card-heading__icon">
                  <i className="fa-solid fa-text-height" />
                </div>
              </div>

              <div className="pf-formatting-grid">
                <div className="pf-field">
                  <label>Font</label>
                  <select value={formatting.fontFamily} onChange={(e) => updateFormatting("fontFamily", e.target.value)}>
                    {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="pf-field">
                  <label>Size</label>
                  <select
                    value={formatting.fontSizePt}
                    onChange={(e) => updateFormatting("fontSizePt", Number(e.target.value))}
                  >
                    {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} pt</option>)}
                  </select>
                </div>
                <div className="pf-field">
                  <label>Line spacing</label>
                  <select
                    value={formatting.lineSpacing}
                    onChange={(e) => updateFormatting("lineSpacing", Number(e.target.value))}
                  >
                    {SPACING_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <p className="pf-config-card__note">
                <i className="fa-solid fa-circle-info" />
                Abstract is always single-spaced regardless of this setting.
                Cover Page, Table of Contents, and List pages use their own
                fixed layout.
              </p>

              <div className="pf-field pf-field--wide pf-custom-instruction">
                <label>Custom instructions (optional)</label>
                <textarea
                  rows={3}
                  placeholder='e.g. "italicize et al throughout"'
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                />
                <span className="pf-field-hint">
                  We'll apply what we can and tell you honestly about
                  anything we can't.
                </span>
              </div>
            </div>

            <div className="pf-config-footer">
              <button className="pf-secondary-button" onClick={reset}>
                <i className="fa-solid fa-rotate-left" />
                Start over
              </button>
              <button className="pf-primary-button" onClick={handleFormatProject}>
                <i className="fa-solid fa-wand-magic-sparkles" />
                Format Project
                <i className="fa-solid fa-arrow-right" />
              </button>
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
              <h2>We couldn't complete the formatting.</h2>
              <p>{error || "Something went wrong while processing your document."}</p>
              <button className="pf-secondary-button" onClick={reset}>
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
                <span>FORMATTING COMPLETE</span>
                <h2>Your project is ready.</h2>
                <p>ProjectPilot successfully analyzed and formatted your document structure.</p>
              </div>

              {downloadUrl && (
                <a href={downloadUrl} download={downloadFilename || "formatted.docx"} className="pf-primary-button">
                  <i className="fa-solid fa-download" />
                  Download document
                </a>
              )}
            </div>

            {showAiNotice && (
              <div className="pf-notice pf-notice--ai">
                <i className="fa-solid fa-feather-pointed" />
                <div>
                  <strong>Some sections were AI-drafted.</strong>
                  <p>
                    {aiDraftedFlags.dedication && aiDraftedFlags.acknowledgement
                      ? "Your Dedication and Acknowledgement"
                      : aiDraftedFlags.dedication
                      ? "Your Dedication"
                      : "Your Acknowledgement"}{" "}
                    weren't found in your original document, so ProjectPilot
                    drafted a starting version for you. They render in
                    italics in the document — please review and personalize
                    them before submitting.
                  </p>
                </div>
              </div>
            )}

            {unsupportedRequests.length > 0 && (
              <div className="pf-notice pf-notice--warn">
                <i className="fa-solid fa-circle-exclamation" />
                <div>
                  <strong>Some custom instructions couldn't be applied.</strong>
                  <ul className="pf-unsupported-list">
                    {unsupportedRequests.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* DOCUMENT SUMMARY */}
            <div className="pf-results-grid">
              <div className="pf-summary-card pf-summary-card--main">
                <div className="pf-card-heading">
                  <div>
                    <span>DOCUMENT ANALYSIS</span>
                    <h3>Detected structure</h3>
                  </div>
                  <div className="pf-card-heading__icon">
                    <i className="fa-solid fa-chart-simple" />
                  </div>
                </div>

                <div className="pf-stat-grid">
                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon"><i className="fa-solid fa-book-open" /></span>
                    <strong>{chapters}</strong>
                    <span>Chapters</span>
                  </div>
                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon"><i className="fa-solid fa-layer-group" /></span>
                    <strong>{sections}</strong>
                    <span>Sections</span>
                  </div>
                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon"><i className="fa-solid fa-quote-left" /></span>
                    <strong>{references}</strong>
                    <span>References</span>
                  </div>
                  <div className="pf-result-stat">
                    <span className="pf-result-stat__icon"><i className="fa-solid fa-align-left" /></span>
                    <strong>{totalParagraphs}</strong>
                    <span>Paragraphs</span>
                  </div>
                </div>
              </div>

              <div className="pf-summary-card">
                <div className="pf-card-heading">
                  <div>
                    <span>PROJECT FILE</span>
                    <h3>{filename}</h3>
                  </div>
                  <i className="fa-solid fa-file-word pf-word-icon" />
                </div>

                <div className="pf-file-details">
                  <div><i className="fa-solid fa-circle-check" /><span>Document processed</span></div>
                  <div><i className="fa-solid fa-circle-check" /><span>Structure analyzed</span></div>
                  <div><i className="fa-solid fa-circle-check" /><span>Formatting generated</span></div>
                </div>
              </div>
            </div>

            {/* STRUCTURAL PREVIEW */}
            {previewHtml && (
              <div className="pf-preview">
                <div className="pf-card-heading">
                  <div>
                    <span>APPROXIMATE PREVIEW</span>
                    <h3>Structural preview</h3>
                  </div>
                  <div className="pf-card-heading__icon">
                    <i className="fa-solid fa-eye" />
                  </div>
                </div>
                <p className="pf-config-card__note">
                  <i className="fa-solid fa-circle-info" />
                  This shows your document's structure and content, not
                  pixel-perfect Word layout. The downloaded file is the
                  authoritative, exactly-formatted version.
                </p>
                <div className="pf-preview-frame-wrap">
                  <iframe
                    className="pf-preview-frame"
                    title="Structural preview"
                    sandbox=""
                    srcDoc={`<html><head><meta charset="utf-8"><style>
                      body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.6;color:#222;padding:24px;max-width:800px;margin:0 auto;}
                      h1{font-size:19px;text-align:center;margin:28px 0 14px;}
                      h2{font-size:16px;margin:20px 0 10px;}
                      h3,h4{font-size:14px;margin:16px 0 8px;}
                      p{margin:0 0 10px;text-align:justify;}
                      table{border-collapse:collapse;width:100%;margin:10px 0;}
                      td,th{padding:6px 8px;border-bottom:1px solid #999;}
                    </style></head><body>${previewHtml}</body></html>`}
                  />
                </div>
              </div>
            )}

            {/* DETECTED STRUCTURE */}
            <div className="pf-detected">
              <div className="pf-card-heading">
                <div>
                  <span>AI STRUCTURE MAP</span>
                  <h3>What ProjectPilot found</h3>
                </div>
                <span className="pf-item-count">{detectedItems.length} items</span>
              </div>

              <div className="pf-detected-list">
                {detectedItems.length > 0 ? (
                  detectedItems.map((p) => {
                    const role = roleByIndex.get(p.index);
                    return (
                      <div className="pf-detected-item" key={p.index}>
                        <div className="pf-detected-item__icon">
                          <i className={ROLE_ICONS[role] || "fa-solid fa-file-lines"} />
                        </div>
                        <div className="pf-detected-item__body">
                          <span>{ROLE_LABELS[role] || role}</span>
                          <p>
                            {p.text.substring(0, 180)}
                            {p.text.length > 180 ? "..." : ""}
                          </p>
                        </div>
                        <i className="fa-solid fa-check pf-detected-item__check" />
                      </div>
                    );
                  })
                ) : (
                  <div className="pf-empty">
                    <i className="fa-solid fa-magnifying-glass" />
                    <p>No classified structural elements were detected.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pf-result-footer">
              <div className="pf-result-footer__actions">
                <button className="pf-primary-button" onClick={handleAdjustOptions}>
                  <i className="fa-solid fa-sliders" />
                  Change options &amp; re-format
                </button>
                <button className="pf-secondary-button" onClick={reset}>
                  <i className="fa-solid fa-plus" />
                  Format another project
                </button>
              </div>
              <p>
                <i className="fa-solid fa-circle-info" />
                For the best final result, open the document in Microsoft
                Word and update the Table of Contents fields before printing.
              </p>
            </div>
          </section>
        )}

      </div>
    </DashboardLayout>
  );
}
