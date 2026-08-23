// lib/renderDocx.js
//
// Takes the paragraph array (from docxExtractor) + classification array
// (from the Claude classify step) and builds a correctly formatted,
// ready-to-print .docx using the `docx` npm package.
//
// Handles, per the Nigerian project-format convention confirmed against
// three real sample documents:
//  - Roman numerals (i, ii, iii...) for preliminary pages, arabic (1, 2, 3...)
//    restarting at Chapter One, via independent-numbering section breaks.
//  - Each chapter starting on a fresh page.
//  - Headings kept with their following paragraph (no orphaned headings).
//  - Times New Roman 12pt enforced document-wide.
//  - Figures/Tables/Plates auto-renumbered per chapter (Figure 2.1, 2.2...),
//    regardless of whatever numbering the student originally typed.
//  - Reference list deduplicated (real documents had literal duplicate
//    citations) and alphabetized.
//  - A native Word Table of Contents field (scans Heading 1-3 styles used
//    for chapter/section/subsection) + manually built List of
//    Tables/Figures/Plates using bookmark + PAGEREF fields, so all four
//    lists show live, correct page numbers once Word updates fields.
//
// NOTE ON FIELD UPDATING: Word does not always auto-run "update fields on
// open" for security reasons. We set `updateFields: true` at the document
// level (docx package supports this), which tells Word to prompt/auto-update
// on open. Students should still know: if numbers look off before printing,
// select all (Ctrl+A) and press F9, or right-click the TOC and "Update Field".

import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Bookmark,
  PageReference,
  TableOfContents,
  SectionType,
  NumberFormat,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
  LevelFormat,
} from "docx";

const FONT = "Times New Roman";
const BODY_SIZE = 24; // half-points => 12pt
const HEADING_SIZE = 28; // 14pt for chapter headings
const SECTION_HEADING_SIZE = 24; // 12pt for section/subsection headings
const LINE_SPACING = 360; // 1.5 lines (240 = single, 480 = double)

// ---------------------------------------------------------------------------
// Reference cleanup: dedupe near-identical entries, then sort alphabetically.
// ---------------------------------------------------------------------------
function normalizeForDedupe(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 60); // compare on the leading chunk (author + year) — good
  // enough to catch the duplicate-citation cases seen in real samples
  // without being thrown off by trailing DOI/URL variations.
}

function cleanAndSortReferences(rawEntries) {
  const seen = new Map(); // normalized -> longest version of the text seen
  for (const text of rawEntries) {
    const key = normalizeForDedupe(text);
    if (!key) continue;
    const existing = seen.get(key);
    if (!existing || text.length > existing.length) {
      seen.set(key, text.trim());
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

// ---------------------------------------------------------------------------
// Figure/Table/Plate caption renumbering.
// ---------------------------------------------------------------------------
const CAPTION_PREFIX_RE =
  /^(fig(?:ure)?|table|plate)\.?\s*\d+(?:[.\-]\d+)*\s*[:.\-]?\s*/i;

function stripExistingCaptionPrefix(text) {
  return text.replace(CAPTION_PREFIX_RE, "").trim();
}

// ---------------------------------------------------------------------------
// Small paragraph-builder helpers, all enforcing Times New Roman.
// ---------------------------------------------------------------------------
function bodyParagraph(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: LINE_SPACING, after: 200 },
    indent: opts.firstLine ? { firstLine: 720 } : undefined,
    children: [
      new TextRun({ text, font: FONT, size: opts.size || BODY_SIZE, bold: opts.bold || false }),
    ],
  });
}

function chapterHeadingParagraph(text, bookmarkId) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    keepNext: true,
    keepLines: true,
    pageBreakBefore: true,
    spacing: { after: 300 },
    children: [
      new Bookmark({
        id: bookmarkId,
        children: [
          new TextRun({
            text: text.toUpperCase(),
            font: FONT,
            size: HEADING_SIZE,
            bold: true,
          }),
        ],
      }),
    ],
  });
}

function sectionHeadingParagraph(text, level, bookmarkId) {
  const headingLevel =
    level === 2
      ? HeadingLevel.HEADING_2
      : level === 3
      ? HeadingLevel.HEADING_3
      : HeadingLevel.HEADING_4;
  return new Paragraph({
    heading: headingLevel,
    keepNext: true,
    keepLines: true,
    spacing: { before: 240, after: 160 },
    children: [
      new Bookmark({
        id: bookmarkId,
        children: [
          new TextRun({ text, font: FONT, size: SECTION_HEADING_SIZE, bold: true }),
        ],
      }),
    ],
  });
}

function captionParagraph(label, bookmarkId) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 120, after: 200 },
    children: [
      new Bookmark({
        id: bookmarkId,
        children: [new TextRun({ text: label, font: FONT, size: BODY_SIZE, bold: true })],
      }),
    ],
  });
}

function referenceEntryParagraph(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 720, hanging: 720 }, // APA hanging indent
    spacing: { after: 200, line: LINE_SPACING },
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE })],
  });
}

// A "Title  ....  ii" style list entry using a bookmark + live PAGEREF field,
// used for Declaration/Certification/etc. NOT auto-generated — used for
// List of Tables / List of Figures / List of Plates, since docx's built-in
// TableOfContents field only scans heading STYLES (Heading 1-3), and our
// captions intentionally aren't heading-styled (they shouldn't show up in
// the main chapter TOC).
function listEntryWithPageRef(label, bookmarkId) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: "dot" }],
    spacing: { after: 120 },
    children: [
      new TextRun({ text: label, font: FONT, size: BODY_SIZE }),
      new TextRun({ text: "\t", font: FONT, size: BODY_SIZE }),
      new PageReference(bookmarkId, { font: FONT, size: BODY_SIZE }),
    ],
  });
}

function prelimHeading(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    pageBreakBefore: true,
    spacing: { after: 300 },
    children: [new TextRun({ text: text.toUpperCase(), font: FONT, size: HEADING_SIZE, bold: true })],
  });
}

// ---------------------------------------------------------------------------
// Main entry point.
// ---------------------------------------------------------------------------
/**
 * @param {Array} paragraphs - from docxExtractor
 * @param {Array<{index:number, role:string}>} classifications - from Claude
 * @param {{ includeListOfTables?: boolean, includeListOfFigures?: boolean, includeListOfPlates?: boolean }} options
 * @returns {Document} - a docx Document instance; caller uses Packer to get a Buffer
 */
export function renderDocument(paragraphs, classifications, options = {}) {
  const roleByIndex = new Map(classifications.map((c) => [c.index, c.role]));
  const getRole = (p) => roleByIndex.get(p.index) || "body_paragraph";

  // --- Bucket the simple single-section prelim content by role -----------
  const bucket = (role) => paragraphs.filter((p) => getRole(p) === role);
  const declarationParas = bucket("declaration_body");
  const certificationParas = bucket("certification_body");
  const dedicationParas = bucket("dedication_body");
  const acknowledgementParas = bucket("acknowledgement_body");
  const abstractHeadingParas = bucket("abstract_heading");
  const abstractBodyParas = bucket("abstract_body");
  const titleParas = paragraphs.filter((p) =>
    ["cover_title", "prelim_label"].includes(getRole(p))
  );

  // --- First pass: collect + clean reference entries ----------------------
  const rawReferenceTexts = paragraphs
    .filter((p) => getRole(p) === "reference_entry")
    .map((p) => p.text);
  const cleanedReferences = cleanAndSortReferences(rawReferenceTexts);

  // --- Second pass: walk the main body in document order ------------------
  const firstChapterIndex = paragraphs.findIndex((p) => getRole(p) === "chapter_heading");
  const mainBodySlice =
    firstChapterIndex === -1 ? [] : paragraphs.slice(firstChapterIndex);

  const bodyChildren = [];
  let chapterCounter = 0;
  let figureCounter = 0;
  let tableCounter = 0;
  let plateCounter = 0;
  let bookmarkSeq = 0;

  const tocFigureEntries = [];
  const tocTableEntries = [];
  const tocPlateEntries = [];

  for (const p of mainBodySlice) {
    const role = getRole(p);
    bookmarkSeq++;

    switch (role) {
      case "chapter_heading": {
        chapterCounter++;
        figureCounter = 0;
        tableCounter = 0;
        plateCounter = 0;
        bodyChildren.push(chapterHeadingParagraph(p.text, `chapter_${chapterCounter}`));
        break;
      }
      case "section_heading":
        bodyChildren.push(sectionHeadingParagraph(p.text, 2, `bm_${bookmarkSeq}`));
        break;
      case "subsection_heading":
        bodyChildren.push(sectionHeadingParagraph(p.text, 3, `bm_${bookmarkSeq}`));
        break;
      case "subsubsection_heading":
        bodyChildren.push(sectionHeadingParagraph(p.text, 4, `bm_${bookmarkSeq}`));
        break;
      case "figure_caption": {
        figureCounter++;
        const bmId = `fig_${chapterCounter}_${figureCounter}`;
        const label = `Figure ${chapterCounter}.${figureCounter}: ${stripExistingCaptionPrefix(
          p.text
        )}`;
        bodyChildren.push(captionParagraph(label, bmId));
        tocFigureEntries.push({ label, bookmarkId: bmId });
        break;
      }
      case "table_caption": {
        tableCounter++;
        const bmId = `tbl_${chapterCounter}_${tableCounter}`;
        const label = `Table ${chapterCounter}.${tableCounter}: ${stripExistingCaptionPrefix(
          p.text
        )}`;
        bodyChildren.push(captionParagraph(label, bmId));
        tocTableEntries.push({ label, bookmarkId: bmId });
        break;
      }
      case "plate_caption": {
        plateCounter++;
        const bmId = `plt_${chapterCounter}_${plateCounter}`;
        const label = `Plate ${chapterCounter}.${plateCounter}: ${stripExistingCaptionPrefix(
          p.text
        )}`;
        bodyChildren.push(captionParagraph(label, bmId));
        tocPlateEntries.push({ label, bookmarkId: bmId });
        break;
      }
      case "table_data":
        // Data table rows: kept as plain paragraphs for MVP. Rebuilding
        // exact table grids is a separate feature — flagged in README.
        bodyChildren.push(bodyParagraph(p.text));
        break;
      case "reference_entry":
        // Skipped here — already collected + cleaned above, rendered in
        // full right after references_heading below.
        break;
      case "references_heading":
        bodyChildren.push(chapterHeadingParagraph(p.text, `refs_heading`));
        for (const refText of cleanedReferences) {
          bodyChildren.push(referenceEntryParagraph(refText));
        }
        break;
      case "appendix_heading":
        bodyChildren.push(chapterHeadingParagraph(p.text, `bm_${bookmarkSeq}`));
        break;
      case "appendix_body":
        bodyChildren.push(bodyParagraph(p.text));
        break;
      case "body_paragraph":
      default:
        bodyChildren.push(bodyParagraph(p.text, { firstLine: true }));
        break;
    }
  }

  // --- Build preliminary-section content ----------------------------------
  const prelimChildren = [];

  if (declarationParas.length) {
    prelimChildren.push(prelimHeading("Declaration"));
    declarationParas.forEach((p) => prelimChildren.push(bodyParagraph(p.text)));
  }
  if (certificationParas.length) {
    prelimChildren.push(prelimHeading("Certification"));
    certificationParas.forEach((p) => prelimChildren.push(bodyParagraph(p.text)));
  }
  if (dedicationParas.length) {
    prelimChildren.push(prelimHeading("Dedication"));
    dedicationParas.forEach((p) => prelimChildren.push(bodyParagraph(p.text)));
  }
  if (acknowledgementParas.length) {
    prelimChildren.push(prelimHeading("Acknowledgements"));
    acknowledgementParas.forEach((p) => prelimChildren.push(bodyParagraph(p.text)));
  }

  // Table of Contents — native Word field, scans Heading 1-3 used above.
  prelimChildren.push(prelimHeading("Table of Contents"));
  prelimChildren.push(
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    })
  );

  const wantTables = options.includeListOfTables !== false && tocTableEntries.length > 0;
  const wantFigures = options.includeListOfFigures !== false && tocFigureEntries.length > 0;
  const wantPlates = options.includeListOfPlates !== false && tocPlateEntries.length > 0;

  if (wantTables) {
    prelimChildren.push(prelimHeading("List of Tables"));
    tocTableEntries.forEach((e) =>
      prelimChildren.push(listEntryWithPageRef(e.label, e.bookmarkId))
    );
  }
  if (wantFigures) {
    prelimChildren.push(prelimHeading("List of Figures"));
    tocFigureEntries.forEach((e) =>
      prelimChildren.push(listEntryWithPageRef(e.label, e.bookmarkId))
    );
  }
  if (wantPlates) {
    prelimChildren.push(prelimHeading("List of Plates"));
    tocPlateEntries.forEach((e) =>
      prelimChildren.push(listEntryWithPageRef(e.label, e.bookmarkId))
    );
  }

  if (abstractHeadingParas.length || abstractBodyParas.length) {
    const abstractTitle =
      abstractHeadingParas.length > 0 ? abstractHeadingParas[0].text : "Abstract";
    prelimChildren.push(prelimHeading(abstractTitle));
    abstractBodyParas.forEach((p) =>
      prelimChildren.push(bodyParagraph(p.text, { firstLine: true }))
    );
  }

  // --- Footers -------------------------------------------------------------
  const centeredPageNumberFooter = () =>
    new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: BODY_SIZE })],
        }),
      ],
    });

  // --- Assemble the document: 3 sections -----------------------------------
  const doc = new Document({
    features: { updateFields: true },
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY_SIZE },
        },
      },
    },
    sections: [
      {
        // Section A: Title page. No footer at all -> no visible page number.
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } },
        },
        children:
          titleParas.length > 0
            ? titleParas.map((p) =>
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 200 },
                  children: [
                    new TextRun({ text: p.text, font: FONT, size: BODY_SIZE, bold: true }),
                  ],
                })
              )
            : [new Paragraph({ children: [new TextRun({ text: "", font: FONT })] })],
      },
      {
        // Section B: preliminary pages, roman numerals, visible starting ii.
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN } },
        },
        footers: { default: centeredPageNumberFooter() },
        children: prelimChildren,
      },
      {
        // Section C: Chapter One onward, arabic numerals restarting at 1.
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
        },
        footers: { default: centeredPageNumberFooter() },
        children: bodyChildren,
      },
    ],
  });

  return doc;
}
