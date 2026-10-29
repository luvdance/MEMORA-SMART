import { shrinkPhoto } from "./imageCompress";

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

// Rules the CV relies on, shared by the iframe and the parent fallback.
function cvPrintRules(theme, format, scope = "") {
  const s = scope ? `${scope} ` : "";
  return `
    ${s}.cv-preview__page {
      width: 210mm !important;
      min-height: 297mm !important;
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

    /* Sidebar templates: run the sidebar the full page height
       (297mm, because viewport units don't work in print). */
    ${s}.cv-preview__page > div[style*="display: flex"],
    ${s}.cv-preview__page > div[style*="display:flex"] {
      min-height: 297mm !important;
      align-items: stretch !important;
    }
    ${s}.cv-preview__page > div[style*="display: flex"] > div[style*="width: 190px"],
    ${s}.cv-preview__page > div[style*="display: flex"] > div[style*="width: 200px"],
    ${s}.cv-preview__page > div[style*="display:flex"] > div[style*="width:190px"],
    ${s}.cv-preview__page > div[style*="display:flex"] > div[style*="width:200px"] {
      align-self: stretch !important;
      min-height: 297mm !important;
      height: auto !important;
    }
    ${s}.cv-preview__page > div[style*="display: flex"] > div[style*="flex: 1"],
    ${s}.cv-preview__page > div[style*="display:flex"] > div[style*="flex:1"] {
      align-self: stretch !important;
      min-height: 297mm !important;
    }

    /* Page breaks */
    ${s}.cv-item { break-inside: avoid !important; page-break-inside: avoid !important; }
    ${s}.cv-section-heading { break-after: avoid !important; page-break-after: avoid !important; break-inside: avoid !important; }
    ${s}.cv-section-keep { break-inside: avoid !important; page-break-inside: avoid !important; }
  `;
}

function pageRules(format) {
  // pagePadding (px) → mm (1mm ≈ 3.78px): top margin on pages 2+.
  const verticalMargin = Math.round((format?.pagePadding || 24) / 3.78);
  return `
    @page { size: A4 portrait; margin: ${verticalMargin}mm 0 0 0; }
    @page :first { margin-top: 0; }
  `;
}

// ── FALLBACK: make the app page itself print as just the CV ──
function installParentPrintStyle(theme, format) {
  const styleId = "cv-print-style";
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
  ${pageRules(format)}
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
    ${cvPrintRules(theme, format)}
  }
  `;
}

// A minimal slice of the base reset (Tailwind preflight) the preview runs
// under, so spacing in print matches what the user sees on screen.
const BASE_RESET = `
  *, *::before, *::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: currentColor; }
  html { line-height: 1.5; -webkit-text-size-adjust: 100%; }
  body { margin: 0; font-family: inherit; line-height: inherit; }
  h1, h2, h3, h4, h5, h6, p, blockquote, figure, hr, pre { margin: 0; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  ol, ul { list-style: none; margin: 0; padding: 0; }
  b, strong { font-weight: bolder; }
  img, svg { display: block; vertical-align: middle; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; text-indent: 0; border-color: inherit; }
  a { color: inherit; text-decoration: inherit; }
`;

// Same justification the preview applies to body text.
const PREVIEW_TEXT_RULES = `
  .cv-preview__page p, .cv-preview__page .cv-item div { text-align: justify; text-justify: inter-word; }
  .cv-preview__page .cv-section-heading { text-align: left; }
`;

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

export async function printCV({ previewRef, cv, theme, format }) {
  const content = previewRef.current;
  if (!content) {
    alert("Preview not ready");
    return;
  }

  installParentPrintStyle(theme, format);

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
<style>
  ${BASE_RESET}
  ${PREVIEW_TEXT_RULES}
  ${pageRules(format)}
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  html, body { margin: 0; padding: 0; background: ${theme?.bg || "#ffffff"}; }
  ${cvPrintRules(theme, format)}
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
