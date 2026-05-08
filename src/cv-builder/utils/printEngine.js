export function printCV({ previewRef, cv, theme, format }) {
  const content = previewRef.current;
  if (!content) {
    alert("Preview not ready");
    return;
  }

  const styleId = "cv-print-style";
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }

  // Convert pagePadding (px) → mm (1mm ≈ 3.78px)
  const verticalMargin = Math.round((format?.pagePadding || 24) / 3.78);

  style.textContent = `
  @page {
    size: A4 portrait;
    margin: ${verticalMargin}mm 0 0 0;
  }
  @page :first {
    margin-top: 0;
  }

  @media print {

    /* Force background colors and images to print exactly as shown */
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Hide everything except the CV preview */
    body * {
      visibility: hidden;
    }
    .cv-preview__page,
    .cv-preview__page *,
    .cv-preview__page *::before,
    .cv-preview__page *::after {
      visibility: visible !important;
    }

    /* Page wrapper — fill A4 width, content-driven height */
    .cv-preview__page {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 210mm !important;
      min-height: 297mm !important;       /* ← CHANGED: ensures at least one full A4 page */
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: ${theme.bg} !important;
      transform: none !important;
      box-sizing: border-box !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: ${theme.bg} !important;
      width: 210mm !important;
      height: auto !important;
      overflow: visible !important;
    }

    /* Reset wrapping containers */
    .cvb,
    .cvb__body,
    .cv-preview-panel,
    .cv-preview__workspace,
    .cv-preview__page-wrapper {
      position: static !important;
      display: block !important;
      background: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: visible !important;
      height: auto !important;
      min-height: auto !important;
    }

    /* Hide chrome */
    .cv-navbar,
    .cv-form-panel,
    .cv-preview__toolbar,
    .fmt-panel-wrapper,
    .cvb-quick-design,
    .cvb-bottom-sheet,
    .cvb-bottom-sheet-backdrop,
    .cvb-bottom-nav,
    .cvb-more-sheet,
    .cvb-more-backdrop {
      display: none !important;
    }

    /* ── SIDEBAR TEMPLATES: Full-height sidebar bleed ── */
    /* Use 297mm (A4 height) instead of 100vh — viewport units don't work in print */
    .cv-preview__page > div[style*="display: flex"],
    .cv-preview__page > div[style*="display:flex"] {
      min-height: 297mm !important;
      align-items: stretch !important;
    }

    /* Sidebar — match all common sidebar widths */
    .cv-preview__page > div[style*="display: flex"] > div[style*="width: 190px"],
    .cv-preview__page > div[style*="display: flex"] > div[style*="width: 200px"],
    .cv-preview__page > div[style*="display: flex"] > div[style*="width:190px"],
    .cv-preview__page > div[style*="display: flex"] > div[style*="width:200px"],
    .cv-preview__page > div[style*="display:flex"] > div[style*="width: 190px"],
    .cv-preview__page > div[style*="display:flex"] > div[style*="width: 200px"] {
      align-self: stretch !important;
      min-height: 297mm !important;     /* ← CHANGED from 100% to 297mm */
      height: auto !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Main content — also stretch */
    .cv-preview__page > div[style*="display: flex"] > div[style*="flex: 1"],
    .cv-preview__page > div[style*="display:flex"] > div[style*="flex: 1"],
    .cv-preview__page > div[style*="display: flex"] > div[style*="flex:1"],
    .cv-preview__page > div[style*="display:flex"] > div[style*="flex:1"] {
      align-self: stretch !important;
      min-height: 297mm !important;
    }

    /* PAGE BREAK CONTROL */
    .cv-item {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    .cv-section-heading {
      break-after: avoid !important;
      page-break-after: avoid !important;
      break-inside: avoid !important;
    }
    .cv-section-keep {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

  }
  `;

  const originalTitle = document.title;
  document.title = cv.name || "CV";

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }, 100);
}