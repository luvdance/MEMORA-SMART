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
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body * {
      visibility: hidden;
    }

    .cv-preview__page,
    .cv-preview__page *,
    .cv-preview__page *::before,
    .cv-preview__page *::after {
      visibility: visible !important;
    }

    /* The page itself — let it grow naturally with content, no min-height */
    .cv-preview__page {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 210mm !important;
      min-height: auto !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: ${theme.bg} !important;
      transform: none !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: ${theme.bg} !important;
      width: 210mm !important;
      height: auto !important;
      overflow: visible !important;
    }

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

    .cv-navbar,
    .cv-form-panel,
    .cv-preview__toolbar,
    .fmt-panel-wrapper,
    .cvb-quick-design,
    .cvb-bottom-sheet,
    .cvb-bottom-sheet-backdrop {
      display: none !important;
    }

    /* ── SIDEBAR TEMPLATES: Full-height sidebar bleed ── */
    .cv-preview__page > div[style*="display: flex"] {
      min-height: 100vh !important;
      align-items: stretch !important;
    }

    .cv-preview__page > div[style*="display: flex"] > div[style*="width: 190px"],
    .cv-preview__page > div[style*="display: flex"] > div[style*="width: 200px"] {
      align-self: stretch !important;
      min-height: 100% !important;
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