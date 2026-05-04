export async function downloadCVPdf({ previewRef, cv, theme, format }) {
  const content = previewRef.current;
  if (!content) {
    throw new Error("Preview not ready");
  }

  const allStyles = await collectAllStyles();
  const clonedHTML = content.outerHTML;

  // Convert pagePadding (px) → mm
  const verticalMargin = Math.round((format?.pagePadding || 24) / 3.78);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${cv.name || "CV"}</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&family=Source+Serif+4:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    @page {
      size: A4 portrait;
      margin: ${verticalMargin}mm 0 0 0;
    }

    @page :first {
      margin-top: 0;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: ${theme.bg || "#ffffff"};
      width: 210mm;
    }

    .cv-preview__page {
      width: 210mm !important;
      min-height: 297mm !important;
      background: ${theme.bg || "#ffffff"} !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
    }

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

    ${allStyles}
  </style>
</head>
<body>
  ${clonedHTML}
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

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cv.name || "CV"}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

async function collectAllStyles() {
  const styles = [];

  const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
  for (const link of linkTags) {
    if (link.href) {
      try {
        const res = await fetch(link.href);
        if (res.ok) {
          const text = await res.text();
          styles.push(text);
        }
      } catch (e) {}
    }
  }

  const styleTags = document.querySelectorAll('style');
  for (const style of styleTags) {
    if (style.textContent) {
      styles.push(style.textContent);
    }
  }

  for (const sheet of document.styleSheets) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      if (rules) {
        for (const rule of rules) {
          styles.push(rule.cssText);
        }
      }
    } catch (e) {}
  }

  return styles.join("\n");
}