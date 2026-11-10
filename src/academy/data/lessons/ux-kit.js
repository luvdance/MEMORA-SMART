/**
 * UI/UX DESIGN — SHARED LAB KIT
 *
 * Builders for the course's webLab files, and small check helpers that are
 * prepended to check strings. Everything here produces STRINGS at import
 * time, so the lessons stay pure data (a module chunk is JSON).
 *
 * CLIENT-SAFE. No answers live here.
 */

/** A complete page that links style.css (and app.js when asked). */
export const page = (title, body, { js = false } = {}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">${js ? '\n  <script src="app.js" defer></script>' : ""}
</head>
<body>
${body}
</body>
</html>
`;

/** The reset every design lab starts from. */
export const BASE = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; }
img { display: block; max-width: 100%; height: auto; }
`;

/**
 * The preview for a document lab: the learner writes Markdown, the page tells
 * them where, and the checks read the file itself with raw().
 */
export const docPage = (title, file, lines) =>
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 24px 16px; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; background: #f8fafc; }
    main { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; color: #111827; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>This is a document lab. Write in <code>${file}</code> (open it from the file tabs). "Check my work" reads the document itself.</p>
    <ul>
${lines.map((l) => `      <li>${l}</li>`).join("\n")}
    </ul>
  </main>
</body>
</html>
`;

/**
 * Markdown helpers for document checks. Prepend to a check string:
 *
 *   check: MD + "return bullets(section('persona.md', 'Goals')).length >= 3;"
 *
 *   section(file, heading)  text under the first heading (level 2 to 6; the
 *                           level-1 title never matches) that
 *                           STARTS with `heading`, case-insensitive, up to the
 *                           next heading; null when there is no such heading
 *   bullets(text)           the "- " or "* " list items in the text
 *   words(text)             number of words
 *   headings(file, level)   the text of every heading of that level
 *   rows(text)              the body rows of the first Markdown table, as
 *                           arrays of trimmed cells (header and rule skipped)
 *   num(text)               the first number in the text, or NaN
 */
export const MD = String.raw`const __lines = (f) => raw(f).replace(/\r/g, '').split('\n');
const section = (f, h) => { let on = false; const out = []; for (const l of __lines(f)) { if (/^#{1,6}\s/.test(l)) { if (on) break; on = /^#{2,6}\s/.test(l) && l.replace(/^#+\s*/, '').trim().toLowerCase().startsWith(String(h).toLowerCase()); continue; } if (on) out.push(l); } return on ? out.join('\n').trim() : null; };
const bullets = (t) => String(t || '').split('\n').filter((l) => /^\s*[-*]\s+\S/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, '').trim()).filter((l) => !/^_+$|^\.\.\.$|^TODO/i.test(l));
const words = (t) => String(t || '').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const headings = (f, n) => __lines(f).filter((l) => new RegExp('^#{' + n + '}\\s').test(l)).map((l) => l.replace(/^#+\s*/, '').trim());
const rows = (t) => String(t || '').split('\n').filter((l) => /^\s*\|/.test(l)).slice(2).map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
const num = (t) => { const m = String(t || '').replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : NaN; };
`;

/** Every text element matching the selectors passes `min` against its own background chain. */
export const CONTRAST = String.raw`const bgOf = (node) => { let n = typeof node === 'string' ? $(node) : node; while (n && n.nodeType === 1) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; n = n.parentElement; } return 'rgb(255, 255, 255)'; };
const passes = (sel, min) => $$(sel).length > 0 && $$(sel).every((n) => contrast(getComputedStyle(n).color, bgOf(n)) >= min);
const ratio = (sel) => { const n = $(sel); return n ? contrast(getComputedStyle(n).color, bgOf(n)) : 0; };
`;
