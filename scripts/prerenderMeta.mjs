/**
 * PER-ROUTE META — written into real HTML files at build time
 *
 * Run automatically after `vite build`.
 *
 * WHY THIS EXISTS
 * Social crawlers do not run JavaScript. WhatsApp, Facebook, LinkedIn, X and
 * Slack fetch a URL, read the HTML that comes back, and take their snapshot.
 * A single-page app serves one index.html for every route, so every shared
 * link showed the same preview — in this case the CV builder's, because those
 * were the tags hardcoded in index.html.
 *
 * Runtime tag-setting (useSEO) cannot fix that, and no amount of it will: the
 * crawler is gone before React runs. The only fix is for the SERVER to return
 * different HTML per route.
 *
 * HOW
 * Vite emits one dist/index.html. This copies it once per route, rewriting
 * the head, so dist/cv-builder/index.html carries the CV builder's tags and
 * dist/academy/index.html carries the Academy's. Vercel checks the filesystem
 * before applying rewrites, so those files win for their paths and the SPA
 * catch-all still handles everything else.
 *
 * WHY NOT A SERVERLESS FUNCTION
 * A crawler-detecting function would also work, and costs one of the twelve
 * function slots this project is already close to. It would also be fragile:
 * every new crawler user-agent is a bug. Static files are correct for humans
 * and machines alike, and cost nothing.
 *
 * WHAT THIS IS NOT
 * Not prerendering of CONTENT — the body is still an empty root div and the
 * app still renders client-side. Only the head is per-route. That is all a
 * link preview needs, and it keeps the build fast.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");

const { ROUTE_META, SITE, PRERENDER_ROUTES, shouldNoIndex } = await import(
  new URL("../src/seo/routeMeta.js", import.meta.url).href
);

const source = join(DIST, "index.html");
if (!existsSync(source)) {
  console.error("prerenderMeta: dist/index.html not found — run vite build first.");
  process.exit(1);
}

const template = readFileSync(source, "utf8");

/** Escape for an HTML attribute. Descriptions contain apostrophes and dashes. */
const attr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Replace a meta tag's content, or append the tag if the template lacks it.
 * Matching on the identifying attribute rather than the whole tag, because
 * the attribute order in index.html is not guaranteed.
 */
function setMeta(html, selectorAttr, key, value) {
  const pattern = new RegExp(
    `<meta\\s+${selectorAttr}=["']${key}["'][^>]*>`,
    "i"
  );
  const tag = `<meta ${selectorAttr}="${key}" content="${attr(value)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function setTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${attr(title)}</title>`);
  }
  return html.replace("</head>", `    <title>${attr(title)}</title>\n  </head>`);
}

function setLink(html, rel, href) {
  const pattern = new RegExp(`<link\\s+rel=["']${rel}["'][^>]*>`, "i");
  const tag = `<link rel="${rel}" href="${attr(href)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

/**
 * Each route's page module, so its HTML can preload the page's chunk.
 *
 * Every page but Home is lazy (src/App.jsx). Without a hint, someone landing
 * on /academy downloads the main bundle, runs it, and only then learns it
 * needs the Academy chunk: two round trips in a row. A modulepreload in the
 * route's own HTML starts both downloads at once.
 */
const ROUTE_ENTRIES = {
  "/cv-builder": "src/cv-builder/components/CVLanding.jsx",
  "/ats-check": "src/pages/ATSChecker.jsx",
  "/projectpilot": "src/project-formatter/PilotLandingPage.jsx",
  "/pricing": "src/pages/Pricing.jsx",
  "/memotify": "src/memotify/MemotifyApp.jsx",
  "/memotify/jobs": "src/memotify/MemotifyApp.jsx",
  "/memotify/hire": "src/memotify/MemotifyApp.jsx",
  "/academy": "src/academy/pages/AcademyLanding.jsx",
  "/academy/courses": "src/academy/pages/AcademyCourses.jsx",
  "/academy/enroll": "src/academy/pages/AcademyEnrollChoose.jsx",
  "/library": "src/pages/Library.jsx",
  "/excel-masterclass": "src/pages/LeadMagnetExcel.jsx",
  "/ai-side-hustles": "src/pages/LeadMagnetAISideHustles.jsx",
  "/remote-jobs-guide": "src/pages/LeadMagnetRemoteJobs.jsx",
  "/content-creation": "src/pages/LeadMagnetContentCreation.jsx",
  "/digital-skills": "src/pages/LeadMagnetComputerSkills.jsx",
  "/daniel-nwankwo": "src/pages/Daniel-nwankwo.jsx",
};

const manifestPath = join(DIST, ".vite", "manifest.json");
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : null;

/** The chunk, its static imports and their CSS, as head tags. */
function preloadTags(entry) {
  if (!manifest || !manifest[entry]) {
    if (entry) console.warn(`prerenderMeta: no chunk for ${entry}; preload skipped`);
    return "";
  }
  const js = new Set();
  const css = new Set();
  const walk = (key) => {
    const chunk = manifest[key];
    if (!chunk || js.has(chunk.file)) return;
    js.add(chunk.file);
    for (const file of chunk.css || []) css.add(file);
    for (const dep of chunk.imports || []) walk(dep);
  };
  walk(entry);
  return [
    ...[...css].map((f) => `<link rel="stylesheet" href="/${f}">`),
    ...[...js].map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`),
  ]
    .map((tag) => `    ${tag}
`)
    .join("");
}

function buildHtml(route, meta) {
  const url = `${SITE.origin}${route === "/" ? "/" : route}`;
  const image = meta.image
    ? meta.image.startsWith("http")
      ? meta.image
      : `${SITE.origin}${meta.image}`
    : `${SITE.origin}${SITE.image}`;

  let html = template;
  html = setTitle(html, meta.title);
  html = setMeta(html, "name", "description", meta.description);

  html = setMeta(html, "property", "og:type", meta.type || "website");
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.description);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "property", "og:site_name", SITE.name);
  html = setMeta(html, "property", "og:locale", SITE.locale);

  html = setMeta(html, "name", "twitter:card", SITE.twitter);
  html = setMeta(html, "name", "twitter:title", meta.title);
  html = setMeta(html, "name", "twitter:description", meta.description);
  html = setMeta(html, "name", "twitter:image", image);

  // Canonical, so the same page reached by several paths is not treated as
  // duplicate content.
  html = setLink(html, "canonical", url);

  if (shouldNoIndex(route)) {
    html = setMeta(html, "name", "robots", "noindex, nofollow");
  }

  const preload = preloadTags(ROUTE_ENTRIES[route]);
  if (preload) html = html.replace("</head>", `${preload}  </head>`);

  return html;
}

let written = 0;
const report = [];

for (const route of PRERENDER_ROUTES) {
  const meta = ROUTE_META[route];
  const html = buildHtml(route, meta);

  // "/" overwrites dist/index.html; every other route gets its own directory
  // so Vercel resolves /cv-builder to cv-builder/index.html.
  const target =
    route === "/" ? source : join(DIST, route.replace(/^\//, ""), "index.html");

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html, "utf8");
  written += 1;
  report.push(`${route.padEnd(24)} ${meta.title.slice(0, 58)}`);
}

console.log(`\n  prerendered meta for ${written} routes:`);
for (const line of report) console.log(`    ${line}`);
console.log("");
