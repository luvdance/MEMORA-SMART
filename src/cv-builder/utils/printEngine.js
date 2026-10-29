import { shrinkPhoto } from "./imageCompress";
import { measureCvLayout, paginateInPlace, pageMarginFor, PRINT_BASE_RESET, PREVIEW_TEXT_RULES } from "./cvLayout";
import { cvFontFaceCss } from "./cvFonts";

// ── PRINT ENGINE ──
// Prints ONLY the CV, from a hidden iframe holding a copy of the preview and
// the few stylesheets it needs (fonts + icons).
//
// Why not print the app page itself (the old approach)? Chrome holds
// window.print() until the page has completely finished loading, and the app
// page pulls in third-party scripts, trackers and ~3 MB of Tailwind CSS. On a
// slow or filtered network one hung request stalled printing for minutes, and
// phones also had to re-style the whole app for print. The iframe has none of
// that, and anything that hasn't loaded after a few seconds is dropped.
//
// The old page-level print CSS is still installed as a fallback: some
// browsers (older iOS Safari) print the parent page when asked to print an
// iframe, and that CSS makes the parent print as just the CV too.

const READY_TIMEOUT_MS = 4000;

// Rules for the parent-page fallback, which prints the live preview (no
// laid-out page breaks, so the browser's keep-together rules do the work).
// layout: { sidebar, pages } measured from the on-screen preview. Sidebar
// templates print full bleed on every page; their columns repeat their own
// padding per page (box-decoration-break), so text keeps a margin.
function cvPrintRules(theme, format, layout = {}, scope = "") {
  const s = scope ? `${scope} ` : "";
  const sidebarFill = layout.sidebar ? `calc(${(layout.pages || 1) * 297}mm - 1mm)` : "calc(297mm - 1mm)";
  return `
    ${s}.cv-preview__page {
      width: 210mm !important;
      min-height: calc(297mm - 1mm) !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: ${theme?.bg || "#ffffff"} !important;
      transform: none !important;
      box-sizing: border-box !important;
    }

    /* Sidebar templates: run the sidebar the full page height (in mm, because
       viewport units don't work in print). Kept 1mm under A4 so rounding can't
       spill a blank extra page. */
    ${s}.cv-preview__page > div[style*="display: flex"],
    ${s}.cv-preview__page > div[style*="display:flex"] {
      min-height: ${sidebarFill} !important;
      align-items: stretch !important;
    }
    ${layout.sidebar ? `${s}.cv-preview__page > div > div {
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }` : ""}
    ${s}.cv-preview__page > div[style*="display: flex"] > div[style*="width: 190px"],
    ${s}.cv-preview__page > div[style*="display: flex"] > div[style*="width: 200px"],
    ${s}.cv-preview__page > div[style*="display:flex"] > div[style*="width:190px"],
    ${s}.cv-preview__page > div[style*="display:flex"] > div[style*="width:200px"] {
      align-self: stretch !important;
      min-height: calc(297mm - 1mm) !important;
      height: auto !important;
    }
    ${s}.cv-preview__page > div[style*="display: flex"] > div[style*="flex: 1"],
    ${s}.cv-preview__page > div[style*="display:flex"] > div[style*="flex:1"] {
      align-self: stretch !important;
      min-height: calc(297mm - 1mm) !important;
    }

    /* Page breaks */
    ${s}.cv-item { break-inside: avoid !important; page-break-inside: avoid !important; }
    ${s}.cv-section-heading { break-after: avoid !important; page-break-after: avoid !important; break-inside: avoid !important; }
    ${s}.cv-section-keep { break-inside: avoid !important; page-break-inside: avoid !important; }
  `;
}

// Rules for the print frame. Its pages are laid out in the frame itself by
// paginateInPlace (breaks, margins, page count), so every page prints full
// bleed; one page fills a little under A4 so it can't spill a blank page.
// Browser keep-together rules would move whole entries and undo the layout.
function paginatedPrintRules(theme) {
  return `
    @page { size: A4 portrait; margin: 0; }
    .cv-preview__page {
      width: 210mm !important;
      min-height: calc(297mm - 1mm) !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: ${theme?.bg || "#ffffff"} !important;
      transform: none !important;
      box-sizing: border-box !important;
    }
    .cv-preview__page > div {
      min-height: calc(297mm - 1mm) !important;
    }
    p, li { orphans: 2; widows: 2; }
  `;
}

function pageRules(format, layout = {}) {
  if (layout.sidebar) return `@page { size: A4 portrait; margin: 0; }`;
  // pagePadding (px) → mm (1mm ≈ 3.78px): top margin on pages 2+.
  const verticalMargin = Math.round((format?.pagePadding || 24) / 3.78);
  return `
    @page { size: A4 portrait; margin: ${verticalMargin}mm 0 0 0; }
    @page :first { margin-top: 0; }
  `;
}

// ── FALLBACK: make the app page itself print as just the CV ──
function installParentPrintStyle(theme, format, layout) {
  const styleId = "cv-print-style";
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
  ${pageRules(format, layout)}
  @media print {
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body * { visibility: hidden; }
    .cv-preview__page,
    .cv-preview__page *,
    .cv-preview__page *::before,
    .cv-preview__page *::after { visibility: visible !important; }
    .cv-preview__page { position: absolute !important; top: 0 !important; left: 0 !important; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: ${theme?.bg || "#ffffff"} !important;
      width: 210mm !important;
      height: auto !important;
      overflow: visible !important;
    }
    .cvb, .cvb__body, .cv-preview-panel, .cv-preview__workspace, .cv-preview__page-wrapper {
      position: static !important;
      display: block !important;
      background: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: visible !important;
      height: auto !important;
      min-height: auto !important;
    }
    /* Take the app chrome out of layout entirely (visibility alone still paginates it). */
    .cvnav, .wnav, .cv-form-panel, .cv-preview__toolbar, .fmt-panel-wrapper, .cvb-quick-design,
    .cvb__ats-actions, .cvb-notice, .cv-optimized-banner, .cvnav__footer,
    .cvb-bottom-sheet, .cvb-bottom-sheet-backdrop, .cvb-bottom-nav, .cvb-more-sheet,
    .cvb-more-backdrop, .cvb-toast, .cvb-dl-toast, .cv-ats, .cv-ats__backdrop,
    iframe[data-cv-print] {
      display: none !important;
    }
    ${cvPrintRules(theme, format, layout)}
  }
  `;
}

/** Font and icon stylesheets the page already loaded (same URLs, so served from cache). */
function fontStylesheetLinks() {
  return [...document.querySelectorAll('link[rel="stylesheet"]')]
    .map((l) => l.href)
    .filter((href) => /fonts\.googleapis\.com|font-awesome/i.test(href))
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join("\n");
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
}

/** Copy of the preview page with on-screen scaling removed and huge photos shrunk. */
async function cloneForPrint(content) {
  const clone = content.cloneNode(true);
  for (const prop of ["transform", "transformOrigin", "marginRight", "marginBottom", "minHeight", "width"]) {
    clone.style[prop] = "";
  }
  // CVs saved before uploads were compressed can carry multi-MB photos, which
  // phones are very slow to put into a print job.
  const originals = [...content.querySelectorAll("img")];
  await Promise.all([...clone.querySelectorAll("img")].map(async (img, i) => {
    const src = img.getAttribute("src") || "";
    if (src.startsWith("data:image/")) {
      const smaller = await shrinkPhoto(src);
      if (smaller !== src) img.setAttribute("src", smaller);
    } else if (originals[i]?.src) {
      // Absolute URL: relative paths would resolve against the frame, not the site.
      img.setAttribute("src", originals[i].src);
    }
  }));
  return clone;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// Browsers whose print can't be trusted with the CV: every iPhone/iPad
// browser (they are all Safari underneath), desktop Safari, and phone
// browsers in general. They ignore the zero page margin, so they add their
// own header/footer (URL, date, page numbers) and the shrunken page pushes a
// one-page CV onto two; some print the whole app page instead of the frame.
// These print the PDF the server makes instead, which is exact.
export function isAppleMobile() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent || "")
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS reports as a Mac
}

export function printNeedsPdf() {
  const ua = navigator.userAgent || "";
  const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
  const mobile = /Android|Mobi/i.test(ua);
  return isAppleMobile() || safari || mobile;
}

export async function printCV({ previewRef, cv, theme, format }) {
  const content = previewRef.current;
  if (!content) {
    alert("Preview not ready");
    return;
  }

  // The fallback prints the live page, which has no laid-out page breaks.
  installParentPrintStyle(theme, format, measureCvLayout(content));

  // One print frame at a time; the previous one is kept until now because
  // mobile browsers read it after print() has already returned.
  document.querySelectorAll("iframe[data-cv-print]").forEach((f) => f.remove());

  const clone = await cloneForPrint(content);
  const title = escapeHtml(cv?.name || "CV");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<base href="${escapeHtml(document.baseURI)}">
<title>${title}</title>
${fontStylesheetLinks()}
<style>${cvFontFaceCss()}</style>
<style>
  ${PRINT_BASE_RESET}
  ${PREVIEW_TEXT_RULES}
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  html, body { margin: 0; padding: 0; background: ${theme?.bg || "#ffffff"}; }
  ${paginatedPrintRules(theme)}
</style>
</head>
<body>${clone.outerHTML}</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("data-cv-print", "");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  // Off-screen but rendered (display:none / visibility:hidden frames may print blank).
  Object.assign(iframe.style, {
    position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0", opacity: "0", pointerEvents: "none",
  });
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = win.document;
  const loaded = new Promise((resolve) => iframe.addEventListener("load", resolve, { once: true }));
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts/icons (cached, so normally instant), but never for long:
  // a stylesheet still pending after the timeout is removed so it can't hold
  // up print(); the CV then prints with fallback fonts.
  await withTimeout(loaded, READY_TIMEOUT_MS);
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (!link.sheet) link.remove();
  });
  await withTimeout(doc.fonts ? doc.fonts.ready : Promise.resolve(), 1500);
  await withTimeout(Promise.all([...doc.images].map((img) => (img.decode ? img.decode().catch(() => {}) : null))), 1500);

  // Lay the pages out in the frame, now that its fonts are in.
  paginateInPlace(doc.querySelector(".cv-preview__page"), pageMarginFor(format));

  // Some browsers name the saved PDF after the top-level page title.
  const originalTitle = document.title;
  document.title = cv?.name || "CV";
  try {
    win.focus();
    win.print();
  } catch {
    // Frame printing blocked: print the page (the fallback CSS keeps it to the CV).
    window.print();
  }
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
