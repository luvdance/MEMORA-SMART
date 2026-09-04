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
 * found by the classifier in THIS document. Used both to show the "Found
 * in document" tag and to decide whether AI-drafting dedication/
 * acknowledgement is needed. This is RAW detection, not the checkbox
 * default — see defaultPrelimToggles for why those two differ.
 */
export function detectPrelimSections(classifications) {
  const rolesPresent = new Set(classifications.map((c) => c.role));
  const detected = {};
  for (const key of Object.keys(DETECTION_ROLES)) {
    detected[key] = DETECTION_ROLES[key].some((role) => rolesPresent.has(role));
  }
  return detected;
}

// render.py treats these four checkboxes as "regenerate from the form,
// REPLACING whatever original content is there" (see cover_title/
// declaration_body/certification_body handling in renderer_core.py) —
// unlike the derived listings (TOC, List of Tables/Figures/Plates) where
// regenerating is exactly the tool's job and never destroys real prose.
// Checking one of these four when the section is ALREADY present would
// silently throw away the student's real declaration wording, real
// certification signature block (supervisor/HOD/dean names), or real
// cover/title page — and replace it with boilerplate built from
// whatever the personalDetails form happens to contain (which may well
// be blank for fields the heuristic parser couldn't confidently fill).
// So these default CHECKED only when the section is genuinely MISSING
// (offering to fill the gap) and UNCHECKED when it was found (preserving
// the student's real original page untouched) — the opposite polarity
// from every other checklist item, but the only default that doesn't
// destroy real content by default.
const DESTRUCTIVE_REGENERATE_KEYS = new Set(["coverPage", "titlePage", "declaration", "certification"]);

/** Default prelimToggles (the checkbox state, not raw detection — see above). */
export function defaultPrelimToggles(classifications) {
  const detected = detectPrelimSections(classifications);
  const toggles = {};
  for (const key of Object.keys(detected)) {
    toggles[key] = DESTRUCTIVE_REGENERATE_KEYS.has(key) ? !detected[key] : detected[key];
  }
  return toggles;
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
// Department/faculty names routinely contain a "/" (e.g. "CHEMICAL/
// PETROCHEMICAL ENGINEERING", "ELECTRICAL/ELECTRONIC ENGINEERING") — a
// real pattern that silently broke this regex in testing, since the
// character class didn't allow "/" and the pattern has no other way to
// terminate at it, so the whole match failed and department came back
// empty (which then produced a visibly broken "DEPARTMENT OF ," in
// generated certification/title text).
const DEPARTMENT_RE = /DEPARTMENT OF ([A-Z][A-Z &,'/-]+?)(?:,|\.|$)/i;
const FACULTY_RE = /FACULTY OF ([A-Z][A-Z &,'/-]+?)(?:,|\.|$)/i;
const UNIVERSITY_LINE_RE = /\b([A-Z][A-Za-z .'-]*UNIVERSITY[A-Za-z .'-]*)\b/;
const HOD_LABEL_RE = /\b(HOD|HEAD OF DEPARTMENT)\b/i;
const DEAN_LABEL_RE = /\bDEAN\b/i;

// Nigerian formal documents very commonly write names as
// "SURNAME, FIRSTNAME MIDDLENAME" (comma-separated) on the cover page —
// e.g. "IKECHUKWU, GOODLUCK IHEOMA". A plain space-split treats the whole
// thing as one ungrammatical blob and everything downstream (Declaration/
// Certification text) renders with a blank name. Handle both that format
// and the plain "FIRSTNAME MIDDLENAME SURNAME" format.
function splitName(fullNameUpper) {
  const commaIdx = fullNameUpper.indexOf(",");
  if (commaIdx !== -1) {
    const surname = fullNameUpper.slice(0, commaIdx).trim();
    const rest = fullNameUpper.slice(commaIdx + 1).trim().split(/\s+/).filter(Boolean);
    return {
      firstName: rest[0] || "",
      middleName: rest.slice(1).join(" "),
      surname,
    };
  }
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

// Fields the classifier now extracts deterministically arrive in the
// rulebook's snake_case vocabulary; the renderer consumes the UI's
// camelCase personalDetails shape. This is the one translation point
// between them — and it is where the single `student_name` string gets
// split into the first/middle/surname parts the Declaration and
// Certification templates interpolate separately.
export function mapPrelimFieldsToPersonalDetails(prelimFields = {}) {
  const mapped = {};
  if (prelimFields.project_title) mapped.projectTopic = prelimFields.project_title;
  if (prelimFields.mat_number) mapped.matricNumber = prelimFields.mat_number;
  if (prelimFields.supervisor_name) mapped.supervisorName = prelimFields.supervisor_name;
  if (prelimFields.student_name) {
    const { firstName, middleName, surname } = splitName(
      prelimFields.student_name.toUpperCase()
    );
    if (firstName) mapped.firstName = titleCase(firstName);
    if (middleName) mapped.middleName = titleCase(middleName);
    if (surname) mapped.surname = titleCase(surname);
  }
  return mapped;
}

function isLikelyNameLine(text) {
  const trimmed = text.trim();
  // Comma format: "SURNAME, FIRSTNAME MIDDLENAME" — validate each side
  // separately rather than treating the whole line as one space-split run.
  const commaIdx = trimmed.indexOf(",");
  if (commaIdx !== -1) {
    const surnamePart = trimmed.slice(0, commaIdx).trim();
    const restPart = trimmed.slice(commaIdx + 1).trim();
    if (!/^[A-Z][A-Za-z'-]*$/.test(surnamePart)) return false;
    const restWords = restPart.split(/\s+/).filter(Boolean);
    if (restWords.length < 1 || restWords.length > 3) return false;
    return restWords.every((w) => /^[A-Z][A-Za-z.'-]*$/.test(w));
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) return false;
  return words.every((w) => /^[A-Z][A-Za-z.'-]*$/.test(w) || /^[A-Z]\.?$/.test(w));
}

// Supervisor/HOD/Dean names in a real signature block routinely carry an
// honorific ("Engr. Dr. (Mrs) G.O. Chie-Amadi", "Prof. E. Ehirim") that
// isLikelyNameLine's strict word-count/shape rules reject outright. Strip
// the honorific before validating, but keep the ORIGINAL text (with
// title) for display — unlike the student's own name, a supervisor's
// title is meant to show in the generated certification text.
const TITLE_PREFIX_RE = /^(?:(?:ENGR|DR|PROF|MR|MRS|MISS|BARR)\.?\s*)+(?:\([A-Za-z]+\)\s*)?/i;

function isLikelyTitledNameLine(text) {
  const core = text.trim().replace(TITLE_PREFIX_RE, "").trim();
  if (!core) return false;
  const words = core.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 5) return false;
  return words.every((w) => /^[A-Z][A-Za-z.'-]*$/.test(w) || /^[A-Z]\.?$/.test(w));
}

/**
 * Best-effort extraction of personalDetails from the classified cover_title
 * / prelim_label / certification_body paragraphs (the certification page's
 * signature block is where a real document's HOD/Dean/Supervisor names
 * actually live, alongside "Supervisor"/"HOD"/"Dean" role labels). Never
 * invents anything not present in the text — every field is either a
 * direct match or left blank for the user to fill in themselves.
 */
export function guessPersonalDetails(paragraphs, classifications) {
  const roleByIndex = new Map(classifications.map((c) => [c.index, c.role]));
  const prelimParas = paragraphs
    .filter((p) => {
      const role = roleByIndex.get(p.index);
      return role === "cover_title" || role === "prelim_label" || role === "certification_body";
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
  const claimedNameIndices = new Set();

  for (let i = 0; i < prelimParas.length; i++) {
    const p = prelimParas[i];
    const text = p.text.trim();
    const role = roleByIndex.get(p.index);

    if (!matricCandidate) {
      const m = text.match(MATRIC_RE);
      if (m) matricCandidate = m[0];
    }

    // "SUPERVISOR"/"HOD"/"DEAN" labels are often classified prelim_label,
    // but just as often cover_title or certification_body (confirmed
    // against a real document) — check the label text regardless of role,
    // as long as the line is basically just that label (a generous length
    // cap, not a tight one — "HOD Chemical/ Petrochemical Engineering."
    // alone is 40 characters, and department names run long) so we don't
    // misfire on body prose that happens to mention a role in passing.
    //
    // A real signature block puts the NAME BEFORE its label ("Prof. E.
    // Ehirim" / "HOD ..." on the next line), so prev is checked first;
    // next is a fallback for the "SUPERVISOR:" cover-page style where the
    // label comes first. claimedNameIndices stops one name paragraph
    // (e.g. sitting between two labels) from being grabbed by both.
    if (/SUPERVISOR/i.test(text) && text.length < 60 && !result.supervisorName) {
      const prev = prelimParas[i - 1];
      const next = prelimParas[i + 1];
      if (prev && !claimedNameIndices.has(prev.index) && isLikelyTitledNameLine(prev.text)) {
        result.supervisorName = titleCaseName(prev.text);
        claimedNameIndices.add(prev.index);
      } else if (next && !claimedNameIndices.has(next.index) && isLikelyTitledNameLine(next.text)) {
        result.supervisorName = titleCaseName(next.text);
        claimedNameIndices.add(next.index);
      }
    }

    if (HOD_LABEL_RE.test(text) && text.length < 60 && !result.hodName) {
      const prev = prelimParas[i - 1];
      const next = prelimParas[i + 1];
      if (prev && !claimedNameIndices.has(prev.index) && isLikelyTitledNameLine(prev.text)) {
        result.hodName = titleCaseName(prev.text);
        claimedNameIndices.add(prev.index);
      } else if (next && !claimedNameIndices.has(next.index) && isLikelyTitledNameLine(next.text)) {
        result.hodName = titleCaseName(next.text);
        claimedNameIndices.add(next.index);
      }
    }

    if (DEAN_LABEL_RE.test(text) && text.length < 60 && !result.deanName) {
      const prev = prelimParas[i - 1];
      const next = prelimParas[i + 1];
      if (prev && !claimedNameIndices.has(prev.index) && isLikelyTitledNameLine(prev.text)) {
        result.deanName = titleCaseName(prev.text);
        claimedNameIndices.add(prev.index);
      } else if (next && !claimedNameIndices.has(next.index) && isLikelyTitledNameLine(next.text)) {
        result.deanName = titleCaseName(next.text);
        claimedNameIndices.add(next.index);
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
