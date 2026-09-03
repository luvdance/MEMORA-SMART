// src/pages/dashboard/projectFormatterUtils.js
//
// Small, dependency-free helpers for the ProjectFormatter CONFIGURING
// screen: figuring out which prelim sections were actually detected (so
// the checklist can default correctly) and best-effort guessing personal/
// institutional details out of the classified cover_title/prelim_label
// paragraphs (so the form isn't blank when the answer is already sitting
// in the document). Both are heuristics over real document text, not a
// second AI call — kept simple and editable, since the whole point is the
// user reviews/corrects these before formatting, not that they're perfect.

// Which classifier role(s) count as "this prelim section exists in the
// source document" for each checklist item.
const DETECTION_ROLES = {
  coverPage: ["cover_title"],
  titlePage: ["cover_title"],
  certification: ["certification_body"],
  declaration: ["declaration_body"],
  dedication: ["dedication_body"],
  acknowledgement: ["acknowledgement_body"],
  abstract: ["abstract_body", "abstract_heading"],
  tableOfContents: ["toc_heading"],
  listOfTables: ["list_of_tables_heading"],
  listOfFigures: ["list_of_figures_heading"],
  listOfPlates: ["list_of_plates_heading"],
};

export const PRELIM_CHECKLIST_ITEMS = [
  { key: "coverPage", label: "Cover Page" },
  { key: "titlePage", label: "Title Page" },
  { key: "certification", label: "Certification" },
  { key: "declaration", label: "Declaration" },
  { key: "dedication", label: "Dedication" },
  { key: "acknowledgement", label: "Acknowledgement" },
  { key: "abstract", label: "Abstract" },
  { key: "tableOfContents", label: "Table of Contents" },
  { key: "listOfTables", label: "List of Tables" },
  { key: "listOfFigures", label: "List of Figures" },
  { key: "listOfPlates", label: "List of Plates" },
];

/**
 * Returns { [checklistKey]: boolean } — whether that section was actually
 * found by the classifier in THIS document. Used both to pre-check boxes
 * and to decide whether AI-drafting dedication/acknowledgement is needed.
 */
export function detectPrelimSections(classifications) {
  const rolesPresent = new Set(classifications.map((c) => c.role));
  const detected = {};
  for (const key of Object.keys(DETECTION_ROLES)) {
    detected[key] = DETECTION_ROLES[key].some((role) => rolesPresent.has(role));
  }
  return detected;
}

/** Default prelimToggles: checked when detected, unchecked (but tickable) otherwise. */
export function defaultPrelimToggles(classifications) {
  return detectPrelimSections(classifications);
}

const MATRIC_RE = /\b[A-Za-z0-9]{2,6}[/-][A-Za-z0-9]{1,8}[/-]?[0-9]{2,8}\b|\b[0-9]{2}[/-][0-9A-Za-z]{2,10}[/-][0-9]{2,6}\b|\b[A-Za-z]{2,6}[0-9]{6,12}\b/;
// The submission/degree-award sentence ("A PROJECT SUBMITTED TO THE
// DEPARTMENT OF...") is also classified cover_title, and must not be
// mistaken for the project topic. Anchored to how these sentences actually
// START — NOT just "contains DEPARTMENT OF/FACULTY OF/etc", since a real
// project title can legitimately mention a department or faculty by name
// (e.g. "A DECISION SUPPORT SYSTEM FOR THE DEPARTMENT OF COMPUTER
// SCIENCE"). A loose contains-anywhere match excluded exactly that kind
// of real title in testing.
const ADMIN_SENTENCE_RE = /^(A|THIS)\s+(PROJECT|RESEARCH(\s+PROJECT)?|SEMINAR|THESIS|DISSERTATION)(\s+REPORT)?\s+(SUBMITTED|IS SUBMITTED)|^SUBMITTED\s+(TO|IN|BY)|^IN\s+PARTIAL\s+FULFIL/i;
const DEGREE_RE = /\b(BACHELOR OF [A-Z ]+|B\.?\s?SC\.?(?:\s?\([A-Z ]+\))?|B\.?\s?ENG\.?|B\.?\s?TECH\.?|B\.?\s?A\.?|HND|OND|MASTER OF [A-Z ]+|M\.?\s?SC\.?|PGD)\b/i;
const DEPARTMENT_RE = /DEPARTMENT OF ([A-Z][A-Z &,'-]+?)(?:,|\.|$)/i;
const FACULTY_RE = /FACULTY OF ([A-Z][A-Z &,'-]+?)(?:,|\.|$)/i;
const UNIVERSITY_LINE_RE = /\b([A-Z][A-Za-z .'-]*UNIVERSITY[A-Za-z .'-]*)\b/;

function splitName(fullNameUpper) {
  const words = fullNameUpper.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { firstName: "", middleName: "", surname: "" };
  if (words.length === 1) return { firstName: words[0], middleName: "", surname: "" };
  if (words.length === 2) return { firstName: words[0], middleName: "", surname: words[1] };
  return {
    firstName: words[0],
    middleName: words.slice(1, -1).join(" "),
    surname: words[words.length - 1],
  };
}

function isLikelyNameLine(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) return false;
  return words.every((w) => /^[A-Z][A-Za-z.'-]*$/.test(w) || /^[A-Z]\.?$/.test(w));
}

/**
 * Best-effort extraction of personalDetails from the classified cover_title
 * / prelim_label paragraphs. Never invents anything not present in the
 * text — every field is either a direct match or left blank for the user
 * to fill in themselves.
 */
export function guessPersonalDetails(paragraphs, classifications) {
  const roleByIndex = new Map(classifications.map((c) => [c.index, c.role]));
  const prelimParas = paragraphs
    .filter((p) => {
      const role = roleByIndex.get(p.index);
      return role === "cover_title" || role === "prelim_label";
    })
    .sort((a, b) => a.index - b.index);

  const result = {
    firstName: "", middleName: "", surname: "", matricNumber: "",
    projectTopic: "", department: "", faculty: "", university: "",
    degreeAwarded: "", supervisorName: "", hodName: "", deanName: "",
    externalExaminerName: "", submissionMonth: "", submissionYear: "",
    dedicationTo: "",
  };

  // Also sweep ALL paragraph text (not just prelim) for department/
  // faculty/university/degree phrasing — these often sit inside a longer
  // "submitted in partial fulfilment..." sentence rather than their own line.
  const allText = paragraphs.map((p) => p.text).join("\n");

  const deptMatch = allText.match(DEPARTMENT_RE);
  if (deptMatch) result.department = deptMatch[1].trim().replace(/\s+/g, " ");

  const facMatch = allText.match(FACULTY_RE);
  if (facMatch) result.faculty = facMatch[1].trim().replace(/\s+/g, " ");

  const uniMatch = allText.match(UNIVERSITY_LINE_RE);
  if (uniMatch) result.university = uniMatch[1].trim().replace(/\s+/g, " ");

  const degreeMatch = allText.match(DEGREE_RE);
  if (degreeMatch) result.degreeAwarded = degreeMatch[1].trim().toUpperCase();

  let matricCandidate = "";
  let nameCandidate = "";
  let topicCandidate = "";

  for (let i = 0; i < prelimParas.length; i++) {
    const p = prelimParas[i];
    const text = p.text.trim();
    const role = roleByIndex.get(p.index);

    if (!matricCandidate) {
      const m = text.match(MATRIC_RE);
      if (m) matricCandidate = m[0];
    }

    if (role === "prelim_label" && /SUPERVISOR/i.test(text)) {
      const next = prelimParas[i + 1];
      if (next && isLikelyNameLine(next.text)) {
        result.supervisorName = titleCaseName(next.text);
      }
    }

    if (role === "prelim_label" && text.trim().toUpperCase() === "BY") {
      const next = prelimParas[i + 1];
      if (next && isLikelyNameLine(next.text)) {
        nameCandidate = next.text.trim();
      }
    }

    if (role === "cover_title") {
      if (!nameCandidate && isLikelyNameLine(text) && !MATRIC_RE.test(text)) {
        nameCandidate = text;
      }
      // Topic candidate: picked by DOCUMENT ORDER (the first one that
      // survives the filters), not by length — a Nigerian project cover
      // page conventionally reads Title -> "BY" -> Name -> Matric ->
      // submission statement -> date, so the first plausible multi-word,
      // non-name, non-matric, non-admin-sentence cover_title paragraph IS
      // the title far more reliably than "whichever is longest" (the
      // submission statement is often the longest paragraph on the page).
      if (
        !topicCandidate &&
        text.split(/\s+/).filter(Boolean).length >= 3 &&
        !MATRIC_RE.test(text) &&
        !isLikelyNameLine(text) &&
        !ADMIN_SENTENCE_RE.test(text)
      ) {
        topicCandidate = text;
      }
    }
  }

  result.matricNumber = matricCandidate;
  result.projectTopic = topicCandidate;

  if (nameCandidate) {
    const { firstName, middleName, surname } = splitName(nameCandidate.toUpperCase());
    result.firstName = titleCase(firstName);
    result.middleName = titleCase(middleName);
    result.surname = titleCase(surname);
  }

  return result;
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function titleCaseName(s) {
  return titleCase(s.replace(/^(DR|PROF|MR|MRS|MISS|ENGR|BARR)\.?\s*/i, (m) => m).trim());
}
