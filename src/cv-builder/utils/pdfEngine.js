import { paginationScript, PRINT_BASE_RESET, PREVIEW_TEXT_RULES } from "./cvLayout";
import { embeddedCvFontCss } from "./cvFonts";

// Builds the CV's PDF on the server and returns it as a Blob.
export async function buildCvPdfBlob({ previewRef, cv, theme, format }) {
  const content = previewRef.current;
  if (!content) throw new Error("Preview not ready");

  // ── RESET any mobile transform/size overrides before capturing HTML ──
  const saved = {
    transform: content.style.transform,
    transformOrigin: content.style.transformOrigin,
    width: content.style.width,
    minHeight: content.style.minHeight,
    height: content.style.height,
    overflow: content.style.overflow,
    padding: content.style.padding,
  };

  content.style.transform = "none";
  content.style.transformOrigin = "top left";
  content.style.width = "794px";
  content.style.minHeight = "1123px";
  content.style.height = "auto";
  content.style.overflow = "visible";

  // Wait for browser to repaint with reset styles
  await new Promise(r => setTimeout(r, 100));

  // Capture HTML AFTER reset
  const clonedHTML = content.outerHTML;

  // The CV fonts the preview draws with, embedded so the PDF uses the same
  // files (the server has no Georgia, Calibri...; see cvFonts.js).
  let fontCss = "";
  try {
    fontCss = await embeddedCvFontCss(content);
  } catch (err) {
    console.error("Embedding CV fonts failed:", err);
  }

  // Restore immediately
  Object.assign(content.style, saved);

  // Every page prints full bleed. The pages themselves (breaks, margins,
  // page count) are laid out by paginationScript inside the PDF server's
  // page, so they're measured with the exact fonts the PDF uses. One page
  // fills a little under A4: anything taller spills a blank extra page.
  const fillHeight = "calc(297mm - 1mm)";
  const pageCss = `@page { size: A4 portrait; margin: 0; }`;

  // ── Only send what Puppeteer actually needs ──
  // No site CSS collected — React inline styles are already in the HTML
  // We only need fonts + Font Awesome + a minimal page reset
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${cv.name || "CV"}</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Georgia&display=swap" rel="stylesheet">

  <style>${fontCss}</style>
  <style>
    /* ── BASE RESET — the slice of the site reset the preview runs under, so
       the PDF lays out like the on-screen preview ── */
    ${PRINT_BASE_RESET}
    ${PREVIEW_TEXT_RULES}

    /* ── MINIMAL RESET — no site CSS, no mobile overrides ── */
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html {
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background: ${theme?.bg || "#ffffff"};
      /* A4 width — Puppeteer renders at this width */
      width: 210mm;
      /* Let content define height — no clipping */
      height: auto;
      overflow: visible;
    }

    /* ── THE CV PAGE — force A4 width, let height grow naturally ── */
    .cv-preview__page {
      width: 210mm !important;
      min-height: ${fillHeight} !important;
      height: auto !important;
      background: ${theme?.bg || "#ffffff"} !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      /* Absolutely critical — remove any transform */
      transform: none !important;
      transform-origin: top left !important;
    }

    /* The template fills the page height, so sidebars run to the bottom
       (align-items: stretch is the flex default). */
    .cv-preview__page > div {
      min-height: ${fillHeight} !important;
    }

    /* Page breaks are laid out by paginationScript. Browser keep-together
       rules would move whole entries and undo that, so only lines are kept. */
    p, li { orphans: 2; widows: 2; }

    /* ── PAGE SETUP — full bleed; page margins are part of the layout ── */
    ${pageCss}

    /* ── ICON FONTS — ensure Font Awesome renders ── */
    .fas, .far, .fab, .fa {
      font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  ${clonedHTML}
  ${paginationScript(format)}
</body>
</html>`;

  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      filename: cv.name || "CV",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("PDF service error:", errText);
    throw new Error(`PDF generation failed: ${response.status}`);
  }

  return response.blob();
}

export async function downloadCVPdf({ previewRef, cv, theme, format }) {
  const blob = await buildCvPdfBlob({ previewRef, cv, theme, format });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cv.name || "CV"}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}