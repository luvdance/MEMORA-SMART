import { inspect, formatArgs } from "./jsRunner.js";

/**
 * THE WEB LAB HARNESS
 *
 * The Responsive Web Development course is taught by building pages, so its
 * practice is a small set of real files (index.html, style.css, app.js) that
 * the learner edits while a live preview renders them. This module turns those
 * files into ONE document and injects the runtime that makes the preview
 * behave like a real site and lets the checks inspect it.
 *
 * The same document is used in two places, which is the whole point:
 *
 *   · in the lesson, inside a sandboxed iframe (scripts only, no same-origin
 *     access), so nothing a learner types can read the Academy's session;
 *   · in `npm run validate:content`, inside headless Chrome, where every
 *     lab's model answer must pass every check and its starter must fail one.
 *
 * Because both run this exact text, a check that passes at build time passes
 * for the learner, at the same viewport width.
 *
 * WHAT THE RUNTIME DOES
 *   · links: <link href="style.css"> and <script src="app.js"> are resolved
 *     to the lab's own files, so learners write real, linked pages;
 *   · images: paths under images/ resolve to built-in placeholder pictures,
 *     so pages have real images with real sizes and no network;
 *   · console.log output and uncaught errors are captured (formatted the way
 *     Node prints them, like the rest of the Academy's JavaScript);
 *   · localStorage and sessionStorage are in-memory stand-ins, because a
 *     sandboxed frame has no storage of its own;
 *   · fetch() answers from the lab's declared mock responses: no network,
 *     the same data every time, and failures on demand;
 *   · clicks on links to other pages of the lab switch page; a form that is
 *     really submitted is recorded instead of navigating the frame away.
 */

/** The three widths every responsive check is written against. */
export const VIEWPORTS = {
  mobile: { width: 375, label: "Phone", icon: "fas fa-mobile-screen" },
  tablet: { width: 768, label: "Tablet", icon: "fas fa-tablet-screen-button" },
  desktop: { width: 1280, label: "Laptop", icon: "fas fa-laptop" },
};

export const LAB_HEIGHT = 800;

/* ── Built-in images ──────────────────────────────────────────────────────
 * SVG placeholders with real intrinsic sizes, so "make this image responsive"
 * has something wide enough to overflow a phone. Lessons refer to them by an
 * ordinary path, exactly as they would on a real site. */
function placeholder(width, height, label, from, to) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="100%" height="100%" fill="url(#g)"/>` +
    `<text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="${Math.round(Math.min(width, height) / 9)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export const ASSETS = {
  "images/hero.jpg": placeholder(1600, 900, "hero.jpg", "#0f766e", "#1e3a8a"),
  "images/team.jpg": placeholder(1200, 800, "team.jpg", "#7c3aed", "#db2777"),
  "images/profile.jpg": placeholder(600, 600, "profile.jpg", "#b45309", "#be123c"),
  "images/product.jpg": placeholder(800, 800, "product.jpg", "#0369a1", "#0f766e"),
  "images/product-2.jpg": placeholder(800, 800, "product-2.jpg", "#4d7c0f", "#0369a1"),
  "images/product-3.jpg": placeholder(800, 800, "product-3.jpg", "#9d174d", "#6d28d9"),
  "images/article.jpg": placeholder(1400, 700, "article.jpg", "#1d4ed8", "#0891b2"),
  "images/map.png": placeholder(1000, 600, "map.png", "#166534", "#65a30d"),
  "images/logo.svg": placeholder(240, 80, "LOGO", "#111827", "#374151"),
};

/**
 * In HTML, an attribute naming a built-in image keeps its original path in
 * data-lab-src, so a check can still ask "is this images/logo.svg?" after the
 * path has been replaced by the picture itself.
 */
function resolveHtmlAssets(html) {
  return String(html ?? "").replace(
    /(\s(?:src|poster)\s*=\s*)(["'])(?:\.\/)?(images\/[^"']+)\2/gi,
    (m, attr, quote, path) => (ASSETS[path] ? `${attr}${quote}${ASSETS[path]}${quote} data-lab-src="${path}"` : m)
  );
}

/** Paths in source that refer to a built-in image, replaced by its data URI. */
function resolveAssets(text) {
  let out = String(text ?? "");
  for (const [path, uri] of Object.entries(ASSETS)) {
    out = out.split(`./${path}`).join(uri).split(path).join(uri);
  }
  return out;
}

/**
 * Loop protection, the technique CodePen uses. A learner's `while (true) {}`
 * in a preview would freeze the lesson, so every braced loop body starts with
 * a call that throws once one synchronous task has looped for 1.5 seconds.
 * The budget resets when the task ends, so long-lived pages are unaffected.
 * Applied identically in the lesson and in the validator.
 */
export function protectLoops(code) {
  return String(code ?? "")
    .replace(/(\b(?:for|while)\s*\((?:[^()]|\([^()]*\))*\)\s*)\{/g, "$1{ __labLoop();")
    .replace(/\bdo\s*\{/g, "do { __labLoop();");
}

const LOOP_GUARD =
  "var __labLoopStart = 0, __labLoopArmed = false;\n" +
  "function __labLoop() {\n" +
  "  if (!__labLoopArmed) { __labLoopArmed = true; __labLoopStart = Date.now(); setTimeout(function () { __labLoopArmed = false; }, 0); }\n" +
  "  else if (Date.now() - __labLoopStart > 1500) throw new RangeError(\"A loop ran for more than 1.5 seconds, so the practice page stopped it. Check that the loop's condition eventually becomes false.\");\n" +
  "}\n";

const escapeScript = (code) => String(code ?? "").replace(/<\/script/gi, "<\\/script");
const escapeStyle = (code) => String(code ?? "").replace(/<\/style/gi, "<\\/style");
const fileName = (href) => String(href || "").replace(/^\.\//, "").split(/[?#]/)[0];

/**
 * ES modules. A module inlined into the page cannot import "./math.js" by
 * path, because the page has no real address for it to be resolved against.
 * So every import of one of the lab's own files is rewritten to a data: URL
 * of that file, with its own imports resolved the same way first. The result
 * behaves exactly like separate module files: each is evaluated once, has its
 * own scope, and only what it exports is visible.
 */
function resolveImports(code, files, seen = []) {
  const toUrl = (spec) => {
    const name = fileName(spec);
    if (files[name] === undefined || seen.includes(name)) return null;
    const inner = resolveImports(resolveAssets(protectLoops(files[name])), files, [...seen, name]);
    // encodeURIComponent leaves ' unencoded, which would end a quoted import.
    return "data:text/javascript;charset=utf-8," + encodeURIComponent(inner).replace(/'/g, "%27");
  };
  return String(code ?? "")
    .replace(/(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\2/g, (m, head, quote, spec) => {
      const url = toUrl(spec);
      return url ? `${head}${quote}${url}${quote}` : m;
    });
}

/**
 * The runtime, as a plain function so it can be serialised into the page with
 * Function.prototype.toString. It must reference nothing outside its own body
 * except `inspect` and `formatArgs`, which are serialised in ahead of it.
 */
function labRuntime(config) {
  const logs = [];
  const errors = [];
  const fetchCalls = [];
  const submissions = [];
  const send = (message) => {
    try {
      window.parent.postMessage({ __lab: config.nonce, ...message }, "*");
    } catch {
      /* no parent: running headless */
    }
  };

  /* Console: kept, formatted like Node, and streamed to the lesson's panel. */
  for (const level of ["log", "info", "warn", "error"]) {
    const original = console[level] ? console[level].bind(console) : () => {};
    console[level] = (...args) => {
      const line = formatArgs(args);
      logs.push(line);
      send({ type: "console", level, line });
      original(...args);
    };
  }
  window.addEventListener("error", (event) => {
    const message = event.error
      ? `${event.error.name || "Error"}: ${event.error.message}`
      : String(event.message || "Script error");
    errors.push(message);
    send({ type: "console", level: "error", line: `Uncaught ${message}` });
  });
  window.addEventListener("unhandledrejection", (event) => {
    const r = event.reason;
    const message = r && r.message ? `${r.name || "Error"}: ${r.message}` : String(r);
    errors.push(message);
    send({ type: "console", level: "error", line: `Uncaught (in promise) ${message}` });
  });

  /* Storage: a sandboxed frame has none, so both are in-memory stand-ins that
     behave like the real Storage API, seeded by the lab when it asks. */
  function makeStorage(seed) {
    const map = new Map(Object.entries(seed || {}).map(([k, v]) => [k, String(v)]));
    const api = {
      get length() { return map.size; },
      key: (i) => [...map.keys()][i] ?? null,
      getItem: (k) => (map.has(String(k)) ? map.get(String(k)) : null),
      setItem: (k, v) => { map.set(String(k), String(v)); },
      removeItem: (k) => { map.delete(String(k)); },
      clear: () => { map.clear(); },
    };
    return new Proxy(api, {
      get(target, prop) {
        if (prop in target) return target[prop];
        return typeof prop === "string" && map.has(prop) ? map.get(prop) : undefined;
      },
      set(target, prop, value) {
        map.set(String(prop), String(value));
        return true;
      },
    });
  }
  const local = makeStorage(config.seed);
  const session = makeStorage({});
  try { Object.defineProperty(window, "localStorage", { value: local, configurable: true }); } catch { /* keep */ }
  try { Object.defineProperty(window, "sessionStorage", { value: session, configurable: true }); } catch { /* keep */ }

  /* fetch: answered from the lab's mocks, in order of declaration. */
  const mocks = config.mocks || [];
  window.fetch = (input, init = {}) => {
    const url = String(input && input.url ? input.url : input);
    const method = String(init.method || "GET").toUpperCase();
    fetchCalls.push({ url, method, body: init.body ?? null });
    const mock = mocks.find((m) => (m.method ? m.method.toUpperCase() === method : true) && url.includes(m.match));
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!mock) {
          reject(new TypeError("Failed to fetch"));
          return;
        }
        if (mock.networkError) {
          reject(new TypeError("Failed to fetch"));
          return;
        }
        const body = typeof mock.body === "string" ? mock.body : JSON.stringify(mock.body ?? null);
        resolve(
          new Response(body, {
            status: mock.status || 200,
            headers: { "Content-Type": typeof mock.body === "string" ? "text/plain" : "application/json" },
          })
        );
      }, mock?.delay ?? 30);
    });
  };

  /* Dialogs never block a check; in the preview they work normally. */
  if (config.mode === "grade") {
    window.alert = (m) => logs.push(`[alert] ${m}`);
    window.confirm = () => true;
    window.prompt = () => null;
  }

  /* Links between the lab's own pages, and links that would leave it. */
  document.addEventListener("click", (event) => {
    const a = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!a || event.defaultPrevented) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#") || href.startsWith("javascript:")) return;
    event.preventDefault();
    const page = href.replace(/^\.\//, "").split(/[?#]/)[0];
    if ((config.pages || []).includes(page)) send({ type: "navigate", page });
    else send({ type: "external", href });
  });

  /* A real submission would navigate the frame away. Record it instead. */
  window.addEventListener("submit", (event) => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    const form = event.target;
    submissions.push(Object.fromEntries(new FormData(form).entries()));
    send({ type: "submitted", action: form.getAttribute("action") || "(this page)" });
  });

  if (config.mode !== "grade") return;

  /* ── The checks ─────────────────────────────────────────────────────── */
  const el = (x) => (typeof x === "string" ? document.querySelector(x) : x);
  const parseRgb = (c) => {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const luminance = ({ r, g, b }) => {
    const ch = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  function allRules(list = document.styleSheets, media = null, out = []) {
    for (const sheet of [...list]) {
      let rules;
      try { rules = sheet.cssRules || sheet.rules; } catch { continue; }
      for (const rule of [...rules]) {
        if (rule.selectorText !== undefined) out.push({ selector: rule.selectorText, style: rule.style, media, cssText: rule.cssText });
        else if (rule.media && rule.cssRules) allRules([{ cssRules: rule.cssRules }], rule.media.mediaText, out);
        else if (rule.cssRules) allRules([{ cssRules: rule.cssRules }], media, out);
        if (rule.type === 7 || rule.constructor?.name === "CSSKeyframesRule") out.push({ keyframes: rule.name, cssText: rule.cssText, media });
      }
    }
    return out;
  }
  const strip = (text, kind) =>
    kind === "html"
      ? String(text).replace(/<!--[\s\S]*?-->/g, "")
      : kind === "css"
        ? String(text).replace(/\/\*[\s\S]*?\*\//g, "")
        : String(text).replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/.*$/gm, "$1");

  const helpers = {
    $: (s) => document.querySelector(s),
    $$: (s) => [...document.querySelectorAll(s)],
    el,
    text: (x) => (el(x)?.textContent || "").replace(/\s+/g, " ").trim(),
    style: (x, prop) => {
      const node = el(x);
      return node ? getComputedStyle(node).getPropertyValue(prop).trim() : "";
    },
    pseudo: (x, which, prop) => {
      const node = el(x);
      return node ? getComputedStyle(node, which).getPropertyValue(prop).trim() : "";
    },
    px: (v) => parseFloat(v) || 0,
    // The path an author wrote, even for a built-in image that was resolved.
    srcOf: (x) => {
      const node = el(x);
      return node ? node.getAttribute("data-lab-src") || node.getAttribute("src") || "" : "";
    },
    rect: (x) => el(x)?.getBoundingClientRect() || { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 },
    visible: (x) => {
      const node = el(x);
      if (!node) return false;
      const cs = getComputedStyle(node);
      const r = node.getBoundingClientRect();
      return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
    },
    overflowX: () => document.documentElement.scrollWidth > window.innerWidth + 1,
    width: () => window.innerWidth,
    click: (x) => { el(x)?.click(); return helpers.tick(); },
    type: (x, value) => {
      const node = el(x);
      if (!node) return helpers.tick();
      node.focus?.();
      node.value = value;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
      return helpers.tick();
    },
    choose: (x, checked = true) => {
      const node = el(x);
      if (node) {
        node.checked = checked;
        node.dispatchEvent(new Event("input", { bubbles: true }));
        node.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return helpers.tick();
    },
    key: (x, key, opts = {}) => {
      const node = el(x) || document.body;
      node.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }));
      node.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true, ...opts }));
      return helpers.tick();
    },
    submit: (x) => {
      const form = el(x);
      if (form?.requestSubmit) form.requestSubmit();
      return helpers.tick();
    },
    wait: (ms = 0) => new Promise((r) => setTimeout(r, ms)),
    // Timers only, never requestAnimationFrame: a hidden or off-screen frame
    // gets no animation frames, so a check waiting on one would never finish.
    tick: () => new Promise((r) => setTimeout(() => setTimeout(r, 0), 0)),
    waitFor: async (fn, ms = 2000) => {
      const end = Date.now() + ms;
      for (;;) {
        try { if (await fn()) return true; } catch { /* not yet */ }
        if (Date.now() > end) return false;
        await new Promise((r) => setTimeout(r, 25));
      }
    },
    logs: () => logs.slice(),
    output: () => logs.join("\n"),
    errors: () => errors.slice(),
    fetchCalls: () => fetchCalls.slice(),
    submissions: () => submissions.slice(),
    storage: local,
    rules: (test) => allRules().filter((r) => r.selector && (!test || (test instanceof RegExp ? test.test(r.selector) : r.selector === test))),
    media: () => [...new Set(allRules().map((r) => r.media).filter(Boolean))],
    keyframes: () => allRules().filter((r) => r.keyframes).map((r) => r.keyframes),
    code: (name) => {
      const src = (config.files || {})[name] ?? "";
      const kind = name.endsWith(".html") ? "html" : name.endsWith(".css") ? "css" : "js";
      return strip(src, kind);
    },
    // A file exactly as written, comments included.
    raw: (name) => String((config.files || {})[name] ?? ""),
    contrast: (fg, bg) => {
      const a = parseRgb(fg);
      const b = parseRgb(bg);
      if (!a || !b) return 0;
      const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
    },
    nameOf: (x) => {
      const node = el(x);
      if (!node) return "";
      const label = node.getAttribute("aria-label");
      if (label) return label.trim();
      const by = node.getAttribute("aria-labelledby");
      if (by) return by.split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ").replace(/\s+/g, " ").trim();
      if (node.labels && node.labels.length) return [...node.labels].map((l) => l.textContent).join(" ").replace(/\s+/g, " ").trim();
      if (node.tagName === "IMG") return (node.getAttribute("alt") || "").trim();
      const own = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (own) return own;
      const img = node.querySelector?.("img[alt]");
      return img ? img.getAttribute("alt").trim() : (node.getAttribute("title") || "").trim();
    },
  };

  async function runTests() {
    const results = [];
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    for (const test of config.tests || []) {
      let passed = false;
      let error = "";
      try {
        const fn = new AsyncFunction("h", `with (h) {\n${test.check}\n}`);
        passed = Boolean(await Promise.race([
          fn(helpers),
          new Promise((_, reject) => setTimeout(() => reject(new Error("the check timed out")), 4000)),
        ]));
      } catch (err) {
        error = `${err && err.name ? err.name : "Error"}: ${err && err.message ? err.message : err}`;
      }
      results.push({ index: test.index, passed, error });
    }
    return results;
  }

  const ready = new Promise((resolve) => {
    const go = () => setTimeout(resolve, 50);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
  window.__labDone = ready.then(runTests).then((results) => {
    send({ type: "results", results, errors: errors.slice() });
    return { results, errors: errors.slice(), logs: logs.slice() };
  });
}

/** The lab's HTML pages, in the order the lesson declares them. */
export function labPages(files) {
  return Object.keys(files || {}).filter((name) => name.endsWith(".html"));
}

/**
 * One document from the lab's files.
 *
 *   files    { "index.html": "...", "style.css": "...", "app.js": "..." }
 *   page     which HTML file to render (default: the first)
 *   mode     "preview" or "grade"
 *   tests    in grade mode, the checks for this page load: [{ index, check }]
 *   mocks    fetch mocks: [{ match, status, body, delay, method, networkError }]
 *   seed     localStorage contents before any script runs
 *
 * A lab with no HTML file (a pure JavaScript exercise) gets a blank page with
 * app.js linked at the end of the body, which is how scripts are run there.
 */
export function buildLabDocument(files = {}, { page, mode = "preview", tests = [], mocks = [], seed = null, nonce = "" } = {}) {
  const pages = labPages(files);
  const current = page && files[page] !== undefined ? page : pages[0];
  let html = current
    ? String(files[current])
    : '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Practice</title>\n</head>\n<body>\n<script src="app.js"></script>\n</body>\n</html>';

  // Linked stylesheets and scripts that name one of the lab's files.
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
    const href = fileName(tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1]);
    if (files[href] === undefined) return tag;
    return `<style data-file="${href}">\n${escapeStyle(resolveAssets(files[href]))}\n</style>`;
  });
  const deferred = [];
  html = html.replace(/<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (tag, before, src, after) => {
    const name = fileName(src);
    if (files[name] === undefined) return tag;
    const attrs = `${before} ${after}`;
    const isModule = /type\s*=\s*["']?module/i.test(attrs);
    const source = resolveAssets(protectLoops(files[name]));
    const body = isModule ? resolveImports(source, files, [name]) : source;
    const block = `<script data-file="${name}"${isModule ? ' type="module"' : ""}>\n${escapeScript(body)}\n</script>`;
    // An inline script ignores `defer`, so a deferred script is moved to the
    // end of the body, which is exactly when a deferred script would run.
    if (!isModule && /\bdefer\b/i.test(attrs)) {
      deferred.push(block);
      return "";
    }
    return block;
  });
  // Inline scripts the learner wrote in the HTML itself are protected too.
  html = html.replace(/(<script\b(?![^>]*\bsrc\s*=)(?![^>]*data-file)[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (m, open, body, close) => `${open}${protectLoops(body)}${close}`);
  html = resolveAssets(resolveHtmlAssets(html));

  const runtime =
    `<script data-lab-runtime>\n${LOOP_GUARD}(function(){\n${inspect.toString()}\n${formatArgs.toString()}\n` +
    `(${labRuntime.toString()})(${JSON.stringify({
      mode,
      nonce,
      tests: mode === "grade" ? tests : [],
      mocks,
      seed,
      pages,
      files: mode === "grade" ? files : {},
    // Every "<" escaped: a "</script>" or an HTML "<!--" inside the JSON would
    // otherwise end the script early or confuse the parser's script states.
    }).replace(/</g, "\\u003c")});\n})();\n</script>`;

  // The runtime must run before any of the learner's scripts, and must not
  // land in front of <!DOCTYPE html>, which would put the page in quirks mode.
  const headOpen = html.match(/<head(\s[^>]*)?>/i);
  // Function replacers throughout: a replacement STRING would treat "$$" and
  // "$'" inside the code as patterns, and quietly corrupt it.
  if (headOpen) html = html.replace(headOpen[0], () => `${headOpen[0]}\n${runtime}`);
  else if (/<html(\s[^>]*)?>/i.test(html)) html = html.replace(/<html(\s[^>]*)?>/i, (m) => `${m}\n${runtime}`);
  else if (/<!doctype[^>]*>/i.test(html)) html = html.replace(/<!doctype[^>]*>/i, (m) => `${m}\n${runtime}`);
  else html = runtime + "\n" + html;

  if (deferred.length) {
    html = /<\/body>/i.test(html)
      ? html.replace(/<\/body>/i, () => `${deferred.join("\n")}\n</body>`)
      : html + "\n" + deferred.join("\n");
  }
  return html;
}

/**
 * The page loads a lab's checks need. Checks that share a page, a viewport
 * width, seeded storage and fetch mocks run in ONE load, in order, so a check can click a
 * button and the next can look at what the click changed.
 */
export function groupTests(lab) {
  const pages = labPages(lab.files);
  const groups = new Map();
  (lab.tests || []).forEach((test, index) => {
    const width = VIEWPORTS[test.viewport]?.width || Number(test.viewport) || VIEWPORTS.desktop.width;
    const page = test.page || pages[0] || null;
    const seed = test.seed || lab.seed || null;
    // A check may answer fetch differently (a failing API, say): it gets its own load.
    const mocks = test.mocks || lab.mocks || [];
    const key = `${page}|${width}|${JSON.stringify(seed)}|${test.mocks ? JSON.stringify(mocks) : ""}`;
    if (!groups.has(key)) groups.set(key, { page, width, seed, mocks, tests: [] });
    groups.get(key).tests.push({ index, check: test.check });
  });
  return [...groups.values()];
}

/** The files a learner ends with: the starter, with the solution laid over it. */
export function solvedFiles(lab) {
  return { ...(lab.files || {}), ...(lab.solution || {}) };
}

/** Turn per-load results back into one verdict, in the lab's test order. */
export function summarise(lab, loads) {
  const byIndex = new Map();
  const errors = [];
  for (const load of loads) {
    for (const r of load.results || []) byIndex.set(r.index, r);
    errors.push(...(load.errors || []));
  }
  const checks = (lab.tests || []).map((test, index) => ({
    index,
    label: test.label,
    fail: test.fail,
    passed: Boolean(byIndex.get(index)?.passed),
    error: byIndex.get(index)?.error || "",
  }));
  return { passed: checks.length > 0 && checks.every((c) => c.passed), checks, errors: [...new Set(errors)] };
}
