// ── CV FONTS ──
// The CV font choices are system fonts (Georgia, Calibri, Arial...). The PDF
// server has none of them and phones lack most, so a CV looked different in
// the preview than in the downloaded PDF. Here each of those names is
// redefined as a web font shipped with the app (public/cv-fonts), a
// metric-compatible twin wherever one exists. A page-defined font overrides
// an installed font of the same name, so the preview, print and PDF all draw
// from the same font files on every device: what you see is what downloads.
//
// Twins: Georgia→Gelasio, Arial/Helvetica→Arimo, Calibri→Carlito,
// Times→Tinos, Palatino→TeX Gyre Pagella (metric-compatible); Garamond→
// EB Garamond, Verdana→DejaVu Sans, Trebuchet→Fira Sans (closest open look).

const BASE = "/cv-fonts/";

// Google Fonts' subset ranges. latin-ext and vietnamese carry the accented
// and dot-below letters in Nigerian names (ẹ, ọ, ṣ, ń...).
const RANGES = {
  latin: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  "latin-ext": "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
  vietnamese: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
};
const ALL_SUBSETS = ["latin", "latin-ext", "vietnamese"];

// names: the font names CVs use. file: the shipped font. subsets: null for
// a single file covering every range.
const FAMILIES = [
  { names: ["Georgia"], file: "gelasio", weights: [400, 500, 600, 700], italic: [400, 700], subsets: ALL_SUBSETS },
  { names: ["Arial", "Helvetica", "Helvetica Neue"], file: "arimo", weights: [400, 500, 600, 700], italic: [400, 700], subsets: ALL_SUBSETS },
  { names: ["Calibri"], file: "carlito", weights: [400, 700], italic: [400, 700], subsets: ALL_SUBSETS },
  { names: ["Times New Roman", "Times"], file: "tinos", weights: [400, 700], italic: [400, 700], subsets: ALL_SUBSETS },
  { names: ["Garamond"], file: "eb-garamond", weights: [400, 500, 600, 700, 800], italic: [400, 700], subsets: ALL_SUBSETS },
  { names: ["Palatino Linotype", "Palatino"], file: "tex-gyre-pagella", weights: [400, 700], italic: [400, 700], subsets: null },
  { names: ["Verdana"], file: "dejavu-sans", weights: [400, 700], italic: [400, 700], subsets: ["latin"] },
  { names: ["Trebuchet MS"], file: "fira-sans", weights: [400, 500, 600, 700], italic: [400, 700], subsets: ALL_SUBSETS },
];

const familyByName = new Map(FAMILIES.flatMap((f) => f.names.map((n) => [n.toLowerCase(), f])));

// Every face of a family: { name, weight, style, url, range, subset }.
function facesOf(family, subsets = family.subsets, names = family.names) {
  const styles = [...family.weights.map((w) => [w, "normal"]), ...family.italic.map((w) => [w, "italic"])];
  const out = [];
  for (const name of names) {
    for (const [weight, style] of styles) {
      if (!family.subsets) {
        out.push({ name, weight, style, url: `${BASE}${family.file}-${weight}-${style}.woff2`, range: null, subset: null });
        continue;
      }
      for (const subset of subsets) {
        out.push({ name, weight, style, url: `${BASE}${family.file}-${subset}-${weight}-${style}.woff2`, range: RANGES[subset], subset });
      }
    }
  }
  return out;
}

function faceRule(face, src) {
  return `@font-face { font-family: "${face.name}"; font-style: ${face.style}; font-weight: ${face.weight}; font-display: swap; src: url("${src}") format("woff2");${face.range ? ` unicode-range: ${face.range};` : ""} }`;
}

/** @font-face rules for every CV font (files load only when text uses them). */
export function cvFontFaceCss() {
  return FAMILIES.flatMap((f) => facesOf(f)).map((face) => faceRule(face, face.url)).join("\n");
}

/** Installs the CV fonts on this page (once). */
export function ensureCvFonts() {
  if (typeof document === "undefined" || document.getElementById("cv-fonts")) return;
  const style = document.createElement("style");
  style.id = "cv-fonts";
  style.textContent = cvFontFaceCss();
  document.head.appendChild(style);
}

// The CV font names the page actually draws with, by family: for each font
// stack in use, the first name is the one that renders (every CV font name is
// defined here, and the other names in our stacks are web fonts the PDF
// loads too).
function familiesInUse(root) {
  const used = new Map();
  const seen = new Set();
  for (const el of [root, ...root.querySelectorAll("*")]) {
    const stack = getComputedStyle(el).fontFamily;
    if (seen.has(stack)) continue;
    seen.add(stack);
    const first = stack.split(",")[0].trim().replace(/^["']|["']$/g, "");
    const family = familyByName.get(first.toLowerCase());
    if (!family) continue;
    const name = family.names.find((n) => n.toLowerCase() === first.toLowerCase());
    used.set(family, new Set([...(used.get(family) || []), name]));
  }
  return used;
}

async function toDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font ${url}: ${res.status}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return `data:font/woff2;base64,${btoa(binary)}`;
}

/**
 * @font-face rules with the font files embedded, for the CV fonts `root`
 * uses — so the PDF server renders with exactly the preview's fonts and
 * needs no network for them. Accented ranges are added only when the CV's
 * text needs them.
 */
export async function embeddedCvFontCss(root) {
  const families = familiesInUse(root);
  if (!families.size) return "";
  const accented = [...(root.textContent || "")].some((ch) => ch.codePointAt(0) > 0xff);
  const faces = [...families].flatMap(([f, names]) =>
    facesOf(f, f.subsets && (accented ? f.subsets : ["latin"]), [...names]));
  // Each file once, however many names share it.
  const urls = [...new Set(faces.map((f) => f.url))];
  const data = new Map(await Promise.all(urls.map(async (u) => [u, await toDataUrl(u)])));
  return faces.map((face) => faceRule(face, data.get(face.url))).join("\n");
}
