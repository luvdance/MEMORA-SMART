// lib/docxExtractor.js
//
// Extracts an ordered list of paragraphs from a .docx file, including weak
// formatting signals (bold, font size, alignment, existing Word style name).
//
// WHY NOT mammoth (already used in your CV parser)?
// mammoth.extractRawText() collapses everything to plain text and throws away
// paragraph boundaries and formatting. That's fine for a CV blurb, but for
// structure classification we need to know things like "this paragraph is
// bold, centered, and in caps" even when the student never touched Word's
// Heading styles (confirmed from real sample projects: Heading styles are
// applied inconsistently — "CHAPTER TWO" was tagged as plain bold Normal text
// in one sample, and numbered headings randomly alternated between Heading 1
// and Heading 2 in another). So this extractor reads the raw XML directly.
//
// KNOWN LIMITATIONS (fine for MVP, revisit if real documents break these):
// - Does not specially handle footnotes, comments, or hyperlink-wrapped runs.
// - Tables are extracted as a single block of concatenated cell text per row;
//   good enough to detect "this looks like a data table", not for reproducing
//   the exact table layout. Chapter 4 data tables are typically kept/rebuilt
//   by the student or handled as a separate feature later, not reformatted.
// - Only reads word/document.xml (main body). Headers/footers are ignored,
//   since we generate our own via the renderer anyway.

import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: false, // CRITICAL: Word splits sentences across multiple <w:t>
  // runs, and some runs contain nothing but a single space
  // (xml:space="preserve"). Trimming here silently glues
  // words together (e.g. "I want to thank" -> "Iwant to thank").
  isArray: (name) =>
    ["w:p", "w:r", "w:tbl", "w:tr", "w:tc", "w:t"].includes(name),
});

// Recursively collect all w:t text nodes under a node, in document order.
function collectText(node) {
  if (node == null) return "";
  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    return node.map(collectText).join("");
  }

  if (typeof node === "object") {
    let text = "";
    if (node["#text"] !== undefined) text += node["#text"];
    for (const key of Object.keys(node)) {
      if (key === "#text" || key.startsWith("@_")) continue;
      text += collectText(node[key]);
    }
    return text;
  }

  return "";
}

// Pull weak formatting signals out of a <w:p> node.
function extractParagraphMeta(pNode) {
  const pPr = pNode["w:pPr"];
  let styleName = null;
  let alignment = null;
  let isListItem = false;

  if (pPr) {
    if (pPr["w:pStyle"] && pPr["w:pStyle"]["@_w:val"]) {
      styleName = pPr["w:pStyle"]["@_w:val"];
    }
    if (pPr["w:jc"] && pPr["w:jc"]["@_w:val"]) {
      alignment = pPr["w:jc"]["@_w:val"]; // e.g. "center", "both"
    }
    if (pPr["w:numPr"]) {
      isListItem = true;
    }
  }

  // Bold / font size: check paragraph mark run props AND every run in the
  // paragraph. If ANY run is bold and there's meaningful text, treat the
  // paragraph as "bold" for heading-detection purposes.
  let isBold = false;
  let maxFontSize = null; // half-points, per OOXML (24 = 12pt)

  const runs = pNode["w:r"] || [];
  const runArray = Array.isArray(runs) ? runs : [runs];

  for (const run of runArray) {
    const rPr = run && run["w:rPr"];
    if (!rPr) continue;
    if (rPr["w:b"] !== undefined && rPr["w:b"]["@_w:val"] !== "0") {
      isBold = true;
    }
    if (rPr["w:sz"] && rPr["w:sz"]["@_w:val"]) {
      const sz = parseInt(rPr["w:sz"]["@_w:val"], 10);
      if (!isNaN(sz) && (maxFontSize === null || sz > maxFontSize)) {
        maxFontSize = sz;
      }
    }
  }

  return { styleName, alignment, isListItem, isBold, maxFontSize };
}

/**
 * @param {Buffer} buffer - raw .docx file contents
 * @returns {Array<{
 *   index: number,
 *   text: string,
 *   style: string|null,
 *   bold: boolean,
 *   fontSizePt: number|null,
 *   align: string|null,
 *   isAllCaps: boolean,
 *   isListItem: boolean
 * }>}
 */
function extractParagraphs(buffer) {
  const zip = new AdmZip(buffer);
  const entry = zip.getEntry("word/document.xml");
  if (!entry) {
    throw new Error("Not a valid .docx file (word/document.xml not found).");
  }

  const xml = entry.getData().toString("utf-8");
  const parsed = parser.parse(xml);

  const body = parsed?.["w:document"]?.["w:body"];
  if (!body) {
    throw new Error("Could not locate document body in .docx XML.");
  }

  const pNodes = body["w:p"] || [];
  const paragraphs = [];

  let index = 0;
  for (const pNode of pNodes) {
    const text = collectText(pNode).replace(/\s+/g, " ").trim();
    if (!text) continue; // skip empty paragraphs — they're spacing, not content

    const meta = extractParagraphMeta(pNode);
    const isAllCaps =
      text.length > 2 && text === text.toUpperCase() && /[A-Z]/.test(text);

    paragraphs.push({
      index,
      text,
      style: meta.styleName,
      bold: meta.isBold,
      fontSizePt: meta.maxFontSize ? meta.maxFontSize / 2 : null,
      align: meta.alignment,
      isAllCaps,
      isListItem: meta.isListItem,
    });
    index++;
  }

  return paragraphs;
}

export { extractParagraphs };
