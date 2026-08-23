// lib/classifySchema.js
//
// Defines the fixed set of paragraph "roles" the classifier assigns, and
// builds the system prompt sent to Claude. Keeping this in one file makes it
// easy to tune as we test against more real sample documents.

const ROLES = [
  "cover_title",           // title on the cover/title page
  "prelim_label",          // "BY", "SUPERVISOR:", student name, matric no, etc.
  "declaration_body",
  "certification_body",
  "dedication_body",
  "acknowledgement_body",
  "abstract_heading",
  "abstract_body",
  "toc_heading",           // literal "TABLE OF CONTENTS" line (we regenerate the list itself)
  "list_of_tables_heading",
  "list_of_figures_heading",
  "list_of_plates_heading",
  "chapter_heading",       // "CHAPTER ONE", "CHAPTER 1: INTRODUCTION"
  "section_heading",       // "1.1 Background to the Study"
  "subsection_heading",    // "2.2.1 Waste Management Strategies"
  "subsubsection_heading", // "2.2.1.7 Current Waste Management Strategies..."
  "body_paragraph",
  "figure_caption",        // "Fig 4.1: ..." / "Figure 3.1: ..."
  "table_caption",         // "Table 3.1: ..."
  "plate_caption",
  "table_data",            // rows of an actual data table (kept, not reformatted as prose)
  "reference_entry",       // one entry in the reference list
  "references_heading",    // the literal "REFERENCES" section heading
  "appendix_heading",
  "appendix_body",
];

const SYSTEM_PROMPT = `You are a document-structure classifier for Nigerian university project write-ups (final year projects, seminars, theses).

You will receive a numbered list of paragraphs extracted from a raw student document, in original order. Each paragraph includes its text and weak formatting hints (existing Word style name, bold, font size, alignment, all-caps, whether it's a list item). These formatting hints are UNRELIABLE — Word heading styles are frequently misapplied or unused by students. Judge structure primarily from the TEXT CONTENT itself (e.g. "CHAPTER ONE", "1.1", "2.2.1.3", "REFERENCES", "Table 4.1:", "Figure 3.1:", "APPENDIX"), using formatting hints only as weak secondary support.

Classify EVERY paragraph into exactly one role from this fixed list:
${ROLES.map((r) => `- ${r}`).join("\n")}

Rules:
- The document may be incomplete (e.g. only Chapter 1–2, or Chapter 1–3). Only emit chapter_heading for chapters that actually appear. Never invent structure that isn't present.
- A duplicate or near-duplicate table_of_contents-style listing of headings with page numbers should be classified as toc_heading (the single line "TABLE OF CONTENTS") followed by body_paragraph for its listed entries — we regenerate the actual TOC ourselves, so its old content is not otherwise meaningful.
- The heading paragraph that literally reads "REFERENCES" (or "BIBLIOGRAPHY") should be classified as references_heading, distinct from the reference_entry items that follow it.
- Reference list entries: classify each individual citation as its own reference_entry, even if duplicated or malformed. Do not deduplicate or clean text yourself — just tag them; cleanup happens in a later deterministic step.
- Distinguish section_heading (e.g. "1.1 Background to the Study") from subsection_heading (e.g. "2.2.1 Waste Management Strategies") from subsubsection_heading (e.g. "2.2.1.7 ...") using the numbering depth in the text itself.
- Figure/Table/Plate captions: classify by keyword ("Fig", "Figure", "Table", "Plate") regardless of exact formatting.
- If a paragraph is genuinely ambiguous, choose the most likely role rather than inventing a new one.

Respond with ONLY valid JSON, no markdown fences, no commentary, in this exact shape:
{"classifications": [{"index": 0, "role": "cover_title"}, {"index": 1, "role": "prelim_label"}, ...]}

Every input paragraph index must appear exactly once in the output.`;

export { ROLES, SYSTEM_PROMPT };
