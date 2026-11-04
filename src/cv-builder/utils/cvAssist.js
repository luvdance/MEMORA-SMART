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
// Same routes as the ATS checker: PDF and TXT read in the browser, DOCX on the server.
export async function extractDocumentText(file) {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "txt") return (await file.text()).trim();
  if (ext === "pdf") {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/legacy/build/pdf.worker.mjs?url")).default;
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const content = await (await pdf.getPage(i)).getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text.trim();
  }
  if (ext === "docx" || ext === "doc") {
    const form = new FormData();
    form.append("cv", file);
    const res = await fetch("/api/parse-cv", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!data.success) throw new Error(data.error || "Could not read that document.");
    return data.text;
  }
  throw new Error("Attach a photo (JPG, PNG) or a document (PDF, DOCX, TXT).");
}
