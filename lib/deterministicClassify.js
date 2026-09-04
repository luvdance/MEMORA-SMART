// lib/deterministicClassify.js
//
// Drop-in, AI-free replacement for the Claude-based paragraph classifier.
// Same input/output CONTRACT as before: give it an ordered array of
// paragraphs, get back { classifications: [{ index, role }, ...] } with
// every index present exactly once, in the same fixed ROLES vocabulary
// (extended — see EXTRA_ROLES below).
//
// Why deterministic instead of LLM-based:
// - Every distinguishing signal in the original system prompt (CHAPTER ONE,
//   "1.1" vs "2.2.1" vs "2.2.1.3" numbering depth, "Table 4.1:",
//   "REFERENCES", "APPENDIX", etc.) is a literal, matchable text pattern.
//   A regex checks it once, correctly, every time. An LLM re-derives the
//   same judgment call per paragraph, per run, with no guarantee of
//   consistency between runs.
// - No token limits, no truncated JSON, no missing/duplicated indices.
// - Zero cost, runs instantly, fully testable with unit tests (which an
//   LLM classifier fundamentally cannot be, beyond snapshot-testing luck).
//
// Trade-off, stated plainly: the free-text front-matter fields (student
// name, mat number, supervisor name, department line) are NOT rigidly
// patterned across every student's document, so this file classifies them
// into the existing catch-all `prelim_label` role and leaves *field*
// extraction (which line is the name vs the mat number) to a small,
// separate, reviewable heuristic step — see extractPrelimFields() at the
// bottom. If that heuristic guesses wrong on a given document, a human
// fixes 3-4 lines instead of the whole document silently misclassifying.

import { ROLES as BASE_ROLES } from "./classifySchema.js";

// Four roles the original schema was missing — the literal heading lines
// for front-matter sections that your rulebook otherwise auto-regenerates.
// Without these, "DECLARATION" / "CERTIFICATION" / "DEDICATION" /
// "ACKNOWLEDGEMENT" as literal heading paragraphs had nowhere correct to
// go and leaked into the *_body role instead.
const EXTRA_ROLES = [
  "declaration_heading",
  "certification_heading",
  "dedication_heading",
  "acknowledgement_heading",
];

const ROLES = [...BASE_ROLES, ...EXTRA_ROLES];

// ---- Pattern library -------------------------------------------------
// Order matters within a zone: check the most specific pattern first
// (e.g. subsubsection before subsection before section) or a "1.1.1.1"
// line will incorrectly match the "1.1" pattern too.

const RE = {
  chapterHeading: /^CHAPTER\s+([A-Z]+|\d+)\b/i,
  subsubsection: /^\d+\.\d+\.\d+\.\d+\s+\S/,   // e.g. 2.2.1.7 ...
  subsection: /^\d+\.\d+\.\d+\s+\S/,           // e.g. 2.2.1 ...
  section: /^\d+\.\d+\s+\S/,                   // e.g. 1.1 ... (checked after the above)
  tableCaption: /^Table\s+\d+(?:\.\d+)*\s*[:.\u2013-]?/i,
  figureCaption: /^Fig(?:ure)?\s+\d+(?:\.\d+)*\s*[:.\u2013-]?/i,
  plateCaption: /^Plate\s+\d+(?:\.\d+)*\s*[:.\u2013-]?/i,
  referencesHeading: /^(REFERENCES|BIBLIOGRAPHY)\s*$/i,
  appendixHeading: /^APPENDI(X|CES)\s*$/i,
  abstractHeading: /^ABSTRACT\s*$/i,
  tocHeading: /^TABLE\s+OF\s+CONTENTS\s*$/i,
  listOfTablesHeading: /^LIST\s+OF\s+TABLES\s*$/i,
  listOfFiguresHeading: /^LIST\s+OF\s+FIGURES\s*$/i,
  listOfPlatesHeading: /^LIST\s+OF\s+PLATES\s*$/i,
  declarationHeading: /^DECLARATION\s*$/i,
  certificationHeading: /^CERTIFICATION\s*$/i,
  dedicationHeading: /^DEDICATION\s*$/i,
  acknowledgementHeading: /^ACKNOWLEDGE?MENTS?\s*$/i,  // both UK and US spelling
  // a "stale listing entry" under a TOC / List of X page: text ending in
  // a page number, or a short line with lots of trailing dots/spacing —
  // the classic "Chapter Title .......... 12" pattern.
  listingEntryLike: /(\.{2,}\s*\d+\s*$)|(\s\d{1,3}\s*$)/,
};

const ZONES = {
  FRONT_MATTER: "front_matter",
  DECLARATION: "declaration",
  CERTIFICATION: "certification",
  DEDICATION: "dedication",
  ACKNOWLEDGEMENT: "acknowledgement",
  STALE_LISTING: "stale_listing", // TOC / List of Tables / Figures / Plates
  ABSTRACT: "abstract",
  CHAPTERS: "chapters",
  REFERENCES: "references",
  APPENDIX: "appendix",
};

function numberingDepthRole(text) {
  if (RE.subsubsection.test(text)) return "subsubsection_heading";
  if (RE.subsection.test(text)) return "subsection_heading";
  if (RE.section.test(text)) return "section_heading";
  return null;
}

// A contents block ("TABLE OF CONTENTS", "LIST OF TABLES"...) is a run of
// short entry lines. Its rows include things that look exactly like real
// structure — "CHAPTER 1: Introduction", "1.1 Background of the Study 4" —
// so no single line can be judged in isolation. Two lines can be
// character-identical, one a contents row and one the real heading.
//
// What DOES separate them is what follows: real chapters are followed by
// substantial prose, contents rows are followed by more short rows. So the
// boundary is computed once, up front: find the first real prose paragraph
// after the last contents heading, then walk back to the nearest
// chapter-heading line. Everything before that point is still contents.
//
// Nothing here assumes how many chapters or sections exist, or how deep
// the numbering goes.
const PROSE_MIN_WORDS = 20;

function looksLikeListingRow(text) {
  return RE.listingEntryLike.test(text);
}

function isSubstantialProse(text) {
  if (looksLikeListingRow(text)) return false;
  return text.split(/\s+/).filter(Boolean).length >= PROSE_MIN_WORDS;
}

function findRealChaptersStart(paragraphs) {
  const textAt = (i) => (paragraphs[i]?.text || "").trim();

  let lastListingHeading = -1;
  for (let i = 0; i < paragraphs.length; i++) {
    const t = textAt(i);
    if (RE.tocHeading.test(t) || RE.listOfTablesHeading.test(t)
        || RE.listOfFiguresHeading.test(t) || RE.listOfPlatesHeading.test(t)) {
      lastListingHeading = i;
    }
  }
  // No contents page at all: every chapter heading is genuine.
  if (lastListingHeading === -1) return 0;

  let firstProse = -1;
  for (let i = lastListingHeading + 1; i < paragraphs.length; i++) {
    if (isSubstantialProse(textAt(i))) { firstProse = i; break; }
  }
  // Contents block runs to the end of the document (no body found) —
  // treat everything after it as contents rather than inventing chapters.
  if (firstProse === -1) return paragraphs.length;

  for (let i = firstProse; i > lastListingHeading; i--) {
    if (RE.chapterHeading.test(textAt(i))) return i;
  }
  // Prose with no chapter heading before it: real content starts there.
  return firstProse;
}

/**
 * @param {Array<{text: string, style?: string, bold?: boolean,
 *   fontSizePt?: number, alignment?: string, allCaps?: boolean,
 *   isListItem?: boolean}>} paragraphs
 * @returns {{classifications: Array<{index: number, role: string}>}}
 */
function classify(paragraphs) {
  const classifications = [];
  // Index at/after which a chapter-heading line is a real chapter rather
  // than a contents row. See findRealChaptersStart.
  const realChaptersStart = findRealChaptersStart(paragraphs);
  let zone = ZONES.FRONT_MATTER;
  // Which literal heading role reopened stale-listing consumption, so we
  // know when to close it (any strong heading pattern below closes it).
  let staleListingActive = false;
  // Set when a chapter heading carried no title on its own line, so the
  // following paragraph is the continuation of that heading.
  let expectChapterTitle = false;

  paragraphs.forEach((p, index) => {
    const text = (p.text || "").trim();
    let role = null;

    // --- Strong, order-independent structural headings -----------------
    // These always end a stale-listing block if one was open, and always
    // move the zone forward, regardless of current zone.
    if (RE.chapterHeading.test(text) && index >= realChaptersStart) {
      zone = ZONES.CHAPTERS;
      staleListingActive = false;
      role = "chapter_heading";
      // A bare "CHAPTER TWO" with no title on the same line means the
      // title sits on the NEXT paragraph. Flag it so that line is also
      // tagged chapter_heading and the renderer merges the two into one
      // heading, instead of the title becoming body prose.
      expectChapterTitle = !/^CHAPTER\s+([A-Z]+|\d+)\s*[:.\u2013-]?\s*\S/i.test(text);
    } else if (RE.referencesHeading.test(text)) {
      zone = ZONES.REFERENCES;
      staleListingActive = false;
      role = "references_heading";
    } else if (RE.appendixHeading.test(text)) {
      zone = ZONES.APPENDIX;
      staleListingActive = false;
      role = "appendix_heading";
    } else if (RE.abstractHeading.test(text)) {
      zone = ZONES.ABSTRACT;
      staleListingActive = false;
      role = "abstract_heading";
    } else if (RE.tocHeading.test(text)) {
      zone = ZONES.STALE_LISTING;
      staleListingActive = true;
      role = "toc_heading";
    } else if (RE.listOfTablesHeading.test(text)) {
      zone = ZONES.STALE_LISTING;
      staleListingActive = true;
      role = "list_of_tables_heading";
    } else if (RE.listOfFiguresHeading.test(text)) {
      zone = ZONES.STALE_LISTING;
      staleListingActive = true;
      role = "list_of_figures_heading";
    } else if (RE.listOfPlatesHeading.test(text)) {
      zone = ZONES.STALE_LISTING;
      staleListingActive = true;
      role = "list_of_plates_heading";
    } else if (RE.declarationHeading.test(text)) {
      zone = ZONES.DECLARATION;
      staleListingActive = false;
      role = "declaration_heading";
    } else if (RE.certificationHeading.test(text)) {
      zone = ZONES.CERTIFICATION;
      staleListingActive = false;
      role = "certification_heading";
    } else if (RE.dedicationHeading.test(text)) {
      zone = ZONES.DEDICATION;
      staleListingActive = false;
      role = "dedication_heading";
    } else if (RE.acknowledgementHeading.test(text)) {
      zone = ZONES.ACKNOWLEDGEMENT;
      staleListingActive = false;
      role = "acknowledgement_heading";
    } else if (expectChapterTitle && zone === ZONES.CHAPTERS) {
      // Continuation line of a split chapter heading ("CHAPTER TWO" then
      // "LITERATURE REVIEW"). Same role, so the renderer merges them.
      role = "chapter_heading";
      expectChapterTitle = false;
    } else if (staleListingActive) {
      // Anything under an active TOC/List-of-X heading that isn't itself
      // a strong heading (handled above) is a stale entry to be dropped —
      // we regenerate these lists from real content, not from old text.
      role = "stale_listing_entry";
    } else {
      // --- Zone-dependent classification --------------------------------
      switch (zone) {
        case ZONES.CHAPTERS: {
          const depthRole = numberingDepthRole(text);
          if (depthRole) {
            role = depthRole;
          } else if (RE.tableCaption.test(text)) {
            role = "table_caption";
          } else if (RE.figureCaption.test(text)) {
            role = "figure_caption";
          } else if (RE.plateCaption.test(text)) {
            role = "plate_caption";
          } else if (p.isListItem || p.style === "TableGrid" || p.style === "TableCell") {
            role = "table_data";
          } else {
            role = "body_paragraph";
          }
          break;
        }
        case ZONES.REFERENCES:
          role = "reference_entry";
          break;
        case ZONES.APPENDIX:
          role = "appendix_body";
          break;
        case ZONES.ABSTRACT:
          role = "abstract_body";
          break;
        case ZONES.DECLARATION:
          role = "declaration_body";
          break;
        case ZONES.CERTIFICATION:
          role = "certification_body";
          break;
        case ZONES.DEDICATION:
          role = "dedication_body";
          break;
        case ZONES.ACKNOWLEDGEMENT:
          role = "acknowledgement_body";
          break;
        case ZONES.FRONT_MATTER:
        default:
          // Cover/title page: a bold/all-caps, longer line before any
          // label pattern is almost certainly the project title; short
          // lines and known labels fall back to prelim_label for the
          // heuristic field-extraction pass below.
          if ((p.bold || p.allCaps) && text.split(/\s+/).length >= 4) {
            role = "cover_title";
          } else if (text.length > 0) {
            role = "prelim_label";
          }
          break;
      }
    }

    if (role !== "chapter_heading") expectChapterTitle = false;
    classifications.push({ index, role: role || "body_paragraph" });
  });

  return { classifications };
}

// ---- Optional second pass: split prelim_label into named fields -------
// Small, isolated, and easy to unit-test or manually correct — unlike an
// LLM call, you can see exactly why a line was assigned to a field.
const FIELD_PATTERNS = {
  // Matric formats differ by institution. Common real shapes:
  //   DE.2020/0589   UG/20/2932   19/SCI01/045   CSC/2019/045
  mat_number: /^(?=.*\d)[A-Z0-9]{2,8}[./-][A-Z0-9]{2,8}(?:[./-][A-Z0-9]{2,8})?$/i,
  supervisor_name_labelled: /^SUPERVISORS?\s*[:-]?\s*(.*)$/i,
  by_label: /^BY\s*[:-]?\s*$/i,
  submission_statement: /SUBMITTED TO THE DEPARTMENT OF/i,
};

function extractPrelimFields(paragraphs, classifications) {
  const fields = {};
  let nextIsName = false;
  let nextIsSupervisor = false;

  classifications.forEach(({ index, role }) => {
    if (role !== "prelim_label" && role !== "cover_title") return;
    const text = (paragraphs[index].text || "").trim();

    if (role === "cover_title" && !fields.project_title) {
      fields.project_title = text;
      return;
    }
    if (FIELD_PATTERNS.by_label.test(text)) {
      nextIsName = true;
      return;
    }
    if (nextIsName) {
      fields.student_name = text;
      nextIsName = false;
      return;
    }
    if (FIELD_PATTERNS.mat_number.test(text)) {
      fields.mat_number = text;
      return;
    }
    if (nextIsSupervisor) {
      fields.supervisor_name = text;
      nextIsSupervisor = false;
      return;
    }
    const supMatch = text.match(FIELD_PATTERNS.supervisor_name_labelled);
    if (supMatch) {
      const inline = (supMatch[1] || "").trim();
      if (inline) {
        fields.supervisor_name = inline;
      } else {
        // Bare "SUPERVISOR:" label — the name is on the following line.
        nextIsSupervisor = true;
      }
      return;
    }
    if (FIELD_PATTERNS.submission_statement.test(text)) {
      fields.submission_statement = text;
      return;
    }
  });

  return fields;
}

export { ROLES, classify, extractPrelimFields };
