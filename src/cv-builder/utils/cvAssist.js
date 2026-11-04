// ── QUICK EDIT (builder assistant) ──
// The server returns only the fields it changed (see assistCv in lib/cv/ai.js).
// This module shrinks the CV before it is sent and applies the reply safely:
// unknown keys are dropped and list items are coerced to the builder's shapes.
import { emptyCV } from "./constants";

const TEXT_FIELDS = [
  "name", "jobTitle", "email", "phone", "address", "linkedin", "website", "github",
  "summary", "objective", "skills", "languages", "hobbies",
  "dateOfBirth", "gender", "maritalStatus", "nationality", "stateOfOrigin", "lga",
  "placeOfBirth", "religion", "nin",
];

const ITEM_SHAPES = {
  experience: emptyCV.experience[0],
  education: emptyCV.education[0],
  certifications: { name: "", issuer: "", issueDate: "", expiryDate: "", noExpiry: false, credentialId: "", credentialUrl: "" },
  achievements: emptyCV.achievements[0],
  volunteer: emptyCV.volunteer[0],
  references: emptyCV.references[0],
  publications: emptyCV.publications[0],
};

const LABELS = {
  name: "Name", jobTitle: "Job title", email: "Email", phone: "Phone", address: "Location",
  linkedin: "LinkedIn", website: "Website", github: "GitHub", summary: "Summary", objective: "Objective",
  skills: "Skills", languages: "Languages", hobbies: "Interests", dateOfBirth: "Date of birth",
  gender: "Gender", maritalStatus: "Marital status", nationality: "Nationality",
  stateOfOrigin: "State of origin", lga: "LGA", placeOfBirth: "Place of birth", religion: "Religion",
  nin: "NIN", experience: "Experience", education: "Education", certifications: "Certifications",
  achievements: "Achievements", volunteer: "Volunteer", references: "References",
  publications: "Publications", photo: "Photo",
};

export const labelFor = (key) => LABELS[key] || key;

const isBlank = (v) => v === "" || v === null || v === undefined || v === false;
const itemIsBlank = (item) => !item || Object.values(item).every(isBlank);

/**
 * The CV as the assistant sees it: no photo or layout data, no empty values.
 * Blank list items stay as {} so the indices the assistant edits by still
 * line up with the builder's lists.
 */
export function compactCV(cv) {
  const out = {};
  for (const key of TEXT_FIELDS) {
    const v = String(cv[key] || "").trim();
    if (v) out[key] = v;
  }
  for (const key of Object.keys(ITEM_SHAPES)) {
    const list = Array.isArray(cv[key]) ? cv[key] : [];
    if (list.every(itemIsBlank)) continue;
    out[key] = list.map((item) => {
      const kept = {};
      for (const [k, v] of Object.entries(item || {})) if (!isBlank(v)) kept[k] = v;
      return kept;
    });
  }
  return out;
}

function coerceItem(shape, raw, base = shape) {
  const item = { ...base };
  if (!raw || typeof raw !== "object") return item;
  for (const k of Object.keys(shape)) {
    if (!(k in raw)) continue;
    item[k] = typeof shape[k] === "boolean" ? Boolean(raw[k]) : String(raw[k] ?? "");
  }
  if (item.current === true && "end" in item) item.end = "";
  return item;
}

function applyList(key, current, change) {
  const shape = ITEM_SHAPES[key];
  if (Array.isArray(change)) return change.map((raw) => coerceItem(shape, raw));
  if (!change || typeof change !== "object") return null;

  let list = current.map((item) => ({ ...item }));
  for (const [idx, raw] of Object.entries(change)) {
    const i = Number(idx);
    if (Number.isInteger(i) && list[i]) list[i] = coerceItem(shape, raw, list[i]);
  }
  if (Array.isArray(change["-"])) {
    const drop = new Set(change["-"].map(Number));
    list = list.filter((_, i) => !drop.has(i));
  }
  if (Array.isArray(change["+"])) {
    // The builder starts lists with one blank row; fill that instead of keeping it.
    list = list.filter((item) => !itemIsBlank(item)).concat(change["+"].map((raw) => coerceItem(shape, raw)));
  }
  return list;
}

/** Apply the assistant's patch. Returns the next CV and the labels of what changed. */
export function applyAssistPatch(cv, set) {
  const next = { ...cv };
  const changed = [];
  for (const [key, value] of Object.entries(set || {})) {
    if (TEXT_FIELDS.includes(key)) {
      if (typeof value !== "string" && typeof value !== "number") continue;
      const v = String(value).trim();
      if (v === String(cv[key] || "")) continue;
      next[key] = v;
      changed.push(key);
    } else if (ITEM_SHAPES[key]) {
      const list = applyList(key, Array.isArray(cv[key]) ? cv[key] : [], value);
      if (!list || JSON.stringify(list) === JSON.stringify(cv[key] || [])) continue;
      // Forms expect at least one row to type into (certifications start empty).
      next[key] = list.length || key === "certifications" ? list : [{ ...ITEM_SHAPES[key] }];
      changed.push(key);
    }
  }
  return { next, changed };
}

// ── DOCUMENT TEXT ──
// PDF and TXT are read in the browser and DOCX by mammoth on the server.
// Scans (photos of a CV, image-only PDFs) go through the Claude Vision OCR in
// /api/parse-cv. Pages are downscaled to JPEG first, which keeps uploads small
// and costs fewer image tokens without hurting legibility.
const OCR_SIDE = 1600;
const OCR_MAX_PAGES = 3;
// A text-layer PDF of a one-page CV has well over this many letters.
const MIN_PDF_TEXT = 200;

export const DOC_IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp"];

async function postParse(blob, name) {
  const form = new FormData();
  form.append("cv", blob, name);
  const res = await fetch("/api/parse-cv", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!data.success) throw new Error(data.error || "Could not read that document.");
  return data.text;
}

const canvasToJpeg = (canvas) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read that image."))), "image/jpeg", 0.85));

async function ocrImageFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("This browser can't open that image. Please try a JPG or PNG."));
      el.src = url;
    });
    const scale = Math.min(1, OCR_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await postParse(await canvasToJpeg(canvas), "scan.jpg");
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function readPdf(file, onProgress) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/legacy/build/pdf.worker.mjs?url")).default;
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  if (text.replace(/\s/g, "").length >= MIN_PDF_TEXT) return text.trim();

  // No text layer: a scanned PDF. Render the first pages and OCR them.
  const pages = Math.min(pdf.numPages, OCR_MAX_PAGES);
  const parts = [];
  for (let i = 1; i <= pages; i++) {
    onProgress?.(`Scanning page ${i} of ${pages}…`);
    const page = await pdf.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: OCR_SIDE / Math.max(base.width, base.height) });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    try {
      parts.push(await postParse(await canvasToJpeg(canvas), `page-${i}.jpg`));
    } catch (err) {
      if (i === 1) throw err; // a blank later page shouldn't sink the whole CV
    }
  }
  return parts.join("\n\n").trim();
}

/** Text of a CV or any document the user attaches, OCR included. */
export async function extractDocumentText(file, onProgress) {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "txt" || ext === "md") return (await file.text()).trim();
  if (ext === "pdf") return readPdf(file, onProgress);
  if (ext === "docx") return postParse(file, file.name);
  if (ext === "doc") throw new Error("Old .doc files can't be read. Save it as .docx or PDF and try again.");
  if (DOC_IMAGE_EXT.includes(ext) || file.type.startsWith("image/")) {
    onProgress?.("Scanning the document…");
    return ocrImageFile(file);
  }
  throw new Error("Attach a PDF, Word (.docx), text file or a photo of your CV.");
}
