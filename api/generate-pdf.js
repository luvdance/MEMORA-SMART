import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let browser = null;

  try {
    const { html, filename } = req.body || {};

    if (!html) {
      return res.status(400).json({ error: "Missing html content" });
    }

    console.log("HTML length:", html.length);

browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: {
    width: 794,
    height: 1123, // initial viewport — Puppeteer expands beyond this for PDF
    deviceScaleFactor: 2,
  },
  executablePath: await chromium.executablePath(),
  headless: true,
});

const page = await browser.newPage();

await page.setContent(html, {
  waitUntil: ["networkidle0", "domcontentloaded", "load"],
  timeout: 25000,
});

// ── Let page expand to full content height before PDF capture ──
await page.evaluate(() => {
  // Remove any height constraints that could clip multi-page content
  document.body.style.height = "auto";
  document.body.style.overflow = "visible";
  document.documentElement.style.height = "auto";
  document.documentElement.style.overflow = "visible";
});

await page.evaluate(async () => {
  await document.fonts.ready;
  const families = [
    "Raleway", "Source Serif 4", "Inter", "Source Sans 3",
    "EB Garamond", "Cormorant Garamond", "DM Sans", "Manrope",
    "Lora", "Georgia", "Font Awesome 6 Free", "Font Awesome 6 Brands",
  ];
  for (const family of families) {
    try {
      await document.fonts.load(`400 16px "${family}"`);
      await document.fonts.load(`700 16px "${family}"`);
      await document.fonts.load(`900 16px "${family}"`);
    } catch (e) {}
  }
  await document.fonts.ready;
});

// Extra wait for complex templates with many elements
await new Promise(r => setTimeout(r, 1500));

const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
  // This is key — don't clip to viewport height
  height: undefined,
});

    await browser.close();
    browser = null;

    console.log("PDF generated, size:", pdfBuffer.length);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename || "CV"}.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("PDF generation error:", err);
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}