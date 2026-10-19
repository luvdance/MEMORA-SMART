/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 30 · ACCESSIBILITY, SEO AND PERFORMANCE
 *
 * Curriculum 30.1 – 30.14. A professional review of the three qualities that
 * decide whether a live site works for everyone, is found, and feels fast:
 * semantic HTML, keyboard use, accessible forms and navigation, contrast and
 * focus; titles, metadata and search-friendly structure; images, lazy loading
 * and fonts; JavaScript weight, Lighthouse, Core Web Vitals, responsive
 * images and measuring improvement. Labs are audits: a page with real
 * problems, each finding fixed and measured in the browser.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s30-performance";

const A11Y_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Book a table · Iya Basira's Kitchen</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
  <div class="top">
    <div class="links">
      <a href="menu.html">Menu</a>
      <a href="book.html">Book</a>
    </div>
  </div>
  <div class="content">
    <h1>Book a table</h1>
    <div class="form">
      <span>Name</span>
      <input id="name">
      <span>Guests</span>
      <input id="guests" type="number">
      <div class="book-btn">Book now</div>
    </div>
    <p class="hint">We confirm by SMS within the hour.</p>
    <p id="result"></p>
  </div>
</body>
</html>
`;

const A11Y_CSS = `body { margin: 0; font-family: Arial, sans-serif; }
.top { background: #7f1d1d; padding: 12px 16px; }
.links a { color: #fff; margin-right: 16px; }
.content { padding: 16px; }
.hint { color: #a3a3a3; }
.book-btn, button { display: inline-block; margin-top: 12px; padding: 12px 20px; background: #7f1d1d; color: #fff; cursor: pointer; border: 0; }
*:focus { outline: none; }
`;

const A11Y_JS = `// Given: books a table when the form is submitted, or the old div is clicked.
function book() {
  const name = document.querySelector("#name").value.trim() || "guest";
  document.querySelector("#result").textContent = \`Table booked for \${name}.\`;
}
document.querySelector(".book-btn")?.addEventListener("click", book);
document.querySelector("form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  book();
});
`;

const A11Y_HTML_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Book a table · Iya Basira's Kitchen</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="top">
    <nav class="links" aria-label="Main">
      <a href="menu.html">Menu</a>
      <a href="book.html" aria-current="page">Book</a>
    </nav>
  </header>
  <main id="main" class="content">
    <h1>Book a table</h1>
    <form class="form">
      <label for="name">Name</label>
      <input id="name" name="name" autocomplete="name">
      <label for="guests">Guests</label>
      <input id="guests" name="guests" type="number" min="1">
      <button type="submit">Book now</button>
    </form>
    <p class="hint">We confirm by SMS within the hour.</p>
    <p id="result" role="status"></p>
  </main>
</body>
</html>
`;

const A11Y_CSS_DONE = `body { margin: 0; font-family: Arial, sans-serif; }
.top { background: #7f1d1d; padding: 12px 16px; }
.links a { color: #fff; margin-right: 16px; }
.content { padding: 16px; }
.hint { color: #525252; }
.book-btn, button { display: inline-block; margin-top: 12px; padding: 12px 20px; background: #7f1d1d; color: #fff; cursor: pointer; border: 0; }
:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 16px; top: 16px; background: #fff; padding: 8px; }
`;

const SEO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Home</title>
</head>
<body>
  <main>
    <p class="big">Iya Basira's Kitchen</p>
    <p>Home-style Yoruba food in Ibadan: amala, ewedu and gbegiri, every day from 11am.</p>
    <p class="big">Our menu</p>
    <p>For our menu <a href="menu.html">click here</a>.</p>
    <p class="big">Find us</p>
    <p>14 Ring Road, Ibadan, Oyo State. Call 0803 000 0003.</p>
  </main>
</body>
</html>
`;

const SEO_HTML_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Iya Basira's Kitchen · Amala and Yoruba food in Ibadan</title>
  <meta name="description" content="Home-style Yoruba food in Ibadan: amala, ewedu and gbegiri every day from 11am, at 14 Ring Road.">
  <link rel="canonical" href="https://iyabasira.ng/">
  <meta property="og:title" content="Iya Basira's Kitchen">
  <meta property="og:description" content="Amala, ewedu and gbegiri in Ibadan, every day from 11am.">
  <meta property="og:image" content="https://iyabasira.ng/images/hero.jpg">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Iya Basira's Kitchen",
    "telephone": "+2348030000003",
    "address": { "@type": "PostalAddress", "streetAddress": "14 Ring Road", "addressLocality": "Ibadan", "addressRegion": "Oyo", "addressCountry": "NG" },
    "servesCuisine": "Nigerian"
  }
  </script>
</head>
<body>
  <main>
    <h1>Iya Basira's Kitchen</h1>
    <p>Home-style Yoruba food in Ibadan: amala, ewedu and gbegiri, every day from 11am.</p>
    <h2>Our menu</h2>
    <p><a href="menu.html">See the full menu and prices</a>.</p>
    <h2>Find us</h2>
    <p>14 Ring Road, Ibadan, Oyo State. Call 0803 000 0003.</p>
  </main>
</body>
</html>
`;

const MEDIA_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gallery · Lekki Arts Centre</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <img class="hero" src="images/hero.jpg" alt="The main gallery hall during an exhibition opening" loading="lazy">
  <main>
    <h1>This month's exhibitions</h1>
    <p class="spacer">Scroll down for the gallery.</p>
    <img src="images/team.jpg" alt="The curators standing beside a large painting">
    <img src="images/product.jpg" alt="A carved wooden mask on a plinth">
    <img src="images/product-2.jpg" alt="A woven textile hanging on a wall">
  </main>
</body>
</html>
`;

const MEDIA_CSS = `@font-face {
  font-family: "Gallery Sans";
  src: url("fonts/gallery-sans.woff2") format("woff2");
}

body { margin: 0; font-family: "Gallery Sans", Arial, sans-serif; }
main { padding: 16px; }
.spacer { height: 1200px; }
`;

const MEDIA_HTML_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gallery · Lekki Arts Centre</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <picture>
    <source type="image/avif" srcset="images/hero.avif">
    <source type="image/webp" srcset="images/hero.webp">
    <img class="hero" src="images/hero.jpg" alt="The main gallery hall during an exhibition opening" width="1600" height="900" fetchpriority="high">
  </picture>
  <main>
    <h1>This month's exhibitions</h1>
    <p class="spacer">Scroll down for the gallery.</p>
    <img src="images/team.jpg" alt="The curators standing beside a large painting" width="1200" height="800" loading="lazy" decoding="async">
    <img src="images/product.jpg" alt="A carved wooden mask on a plinth" width="800" height="800" loading="lazy" decoding="async">
    <img src="images/product-2.jpg" alt="A woven textile hanging on a wall" width="800" height="800" loading="lazy" decoding="async">
  </main>
</body>
</html>
`;

const MEDIA_CSS_DONE = `@font-face {
  font-family: "Gallery Sans";
  src: url("fonts/gallery-sans.woff2") format("woff2");
  font-display: swap;
}

body { margin: 0; font-family: "Gallery Sans", Arial, sans-serif; }
main { padding: 16px; }
img { display: block; max-width: 100%; height: auto; }
.spacer { height: 1200px; }
`;

const PERF_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sales report</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js"></script>
</head>
<body>
  <main>
    <h1>Sales report</h1>
    <img class="banner" src="images/article.jpg" alt="Market stalls in Balogun market">
    <button id="show-chart">Show the chart</button>
    <div id="chart"></div>
  </main>
</body>
</html>
`;

const PERF_JS = `import { drawChart } from "./chart.js";

document.querySelector("#show-chart").addEventListener("click", () => {
  drawChart(document.querySelector("#chart"), [12, 19, 7, 25]);
});
`;

const PERF_CHART = `// Pretend this is a large charting library: 300kB that most visitors never need.
export function drawChart(el, values) {
  el.textContent = "Chart: " + values.join(" · ");
  el.dataset.drawn = "yes";
}
`;

const PERF_HTML_DONE = PERF_HTML.replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>').replace(
  '<img class="banner" src="images/article.jpg" alt="Market stalls in Balogun market">',
  '<img class="banner" src="images/article.jpg" srcset="images/article.jpg 1400w, images/team.jpg 1200w, images/profile.jpg 600w" sizes="(min-width: 800px) 760px, 100vw" alt="Market stalls in Balogun market" width="1400" height="700">'
);

const PERF_JS_DONE = `document.querySelector("#show-chart").addEventListener("click", async () => {
  // Load the heavy chart code only when someone asks for the chart.
  const { drawChart } = await import("./chart.js");
  drawChart(document.querySelector("#chart"), [12, 19, 7, 25]);
});
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 141 · 30.1 – 30.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l141-a11y-review",
    moduleId: "wd-m30-performance",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["30.1", "30.2", "30.3", "30.4"],
    title: "An Accessibility Review",
    subtitle: "Semantic HTML, keyboard use, forms, navigation, contrast and focus",
    estimatedMinutes: 26,
    intro: "Before a site is called finished, it gets a professional accessibility review. Everything in it you have met before; this lesson puts it together as a checklist you can run on any page, including your own capstone.",

    atoms: [
      {
        id: "a-wd-semantic-review",
        title: "Semantic HTML review",
        explain:
          "Start by reading the page's structure, not its looks. Are the landmarks there (header, nav, main, footer)? Is there one h1 and a logical heading outline? Are lists lists, tables tables, and buttons buttons? The browser's accessibility tree (DevTools → Elements → Accessibility) shows what assistive technology actually receives for each element, which is the quickest way to spot a div pretending to be something else.",
      },
      {
        id: "a-wd-keyboard-a11y",
        title: "Keyboard accessibility",
        explain:
          "Put the mouse away and use the page with Tab, Shift+Tab, Enter, Space, the arrow keys and Escape. Can you reach everything interactive, in a sensible order? Can you always see where you are? Can you operate every control, open and close every menu and dialog, and never get trapped? A skip link should let you jump past the navigation. Every failure here locks out keyboard users, switch users and many screen-reader users.",
      },
      {
        id: "a-wd-forms-nav-review",
        title: "Accessible forms and navigation",
        explain:
          "Forms: every field has a visible label tied to it, required fields and formats are stated, errors are announced and linked to their field, and the submit control is a real button inside a real form so Enter works. Navigation: it is a nav landmark containing a list of links, consistent across pages, with the current page marked by aria-current; menus that collapse use a button with aria-expanded.",
      },
      {
        id: "a-wd-contrast-focus",
        title: "Color contrast and visible focus",
        explain:
          "Check every text colour against its background: 4.5:1 for normal text, 3:1 for large text and for the edges of controls and focus indicators. DevTools shows the ratio when you inspect a colour. Focus must always be visible: never remove outlines without a replacement, and style :focus-visible with an indicator that has enough contrast against both the element and the page.",
        webLab: {
          task:
            "Review and fix this booking page. Replace the generic divs with landmarks: a header with a nav, and a main with the id main; add a skip link to #main as the first element; make the form a real form with real labels (for and id) instead of spans; turn the \"Book now\" div into a submit button; mark the Book link as the current page; make the hint text pass 4.5:1; and replace the rule that hides every focus outline with a visible :focus-visible style. The given app.js will book the table on submit.",
          files: { "index.html": A11Y_HTML, "style.css": A11Y_CSS, "app.js": A11Y_JS },
          readOnly: ["app.js"],
          tests: [
            { label: "Landmarks: a header with a nav, and a main with id main", check: "return !!$('header nav') && $$('main').length === 1 && $('main').id === 'main';", fail: "Use <header>, <nav> and <main id=\"main\"> instead of the divs." },
            { label: "A skip link to #main is the first element in the body", check: "const f = document.body.firstElementChild; return f.tagName === 'A' && f.getAttribute('href') === '#main';", fail: "Add <a class=\"skip-link\" href=\"#main\">Skip to main content</a> first in the body." },
            { label: "Both inputs have real labels", check: "return ['#name', '#guests'].every((s) => $(s).labels.length === 1);", fail: "Replace each span with <label for=\"…\">." },
            { label: "Book now is a submit button inside a form, and Enter books the table", check: "const b = $$('form button[type=submit], form input[type=submit]'); if (b.length !== 1 || $('.book-btn:not(button)')) return false; await type('#name', 'Tolu'); await submit('form'); return text('#result') === 'Table booked for Tolu.';", fail: "Wrap the fields in a <form> and use <button type=\"submit\">Book now</button>." },
            { label: "The Book link is marked as the current page", check: "return $('nav a[href=\"book.html\"]')?.getAttribute('aria-current') === 'page';", fail: "Add aria-current=\"page\" to the Book link." },
            { label: "The hint passes 4.5:1 contrast", check: "return contrast(style('.hint', 'color'), 'rgb(255, 255, 255)') >= 4.5;", fail: "Darken .hint, for example to #525252." },
            { label: "Focus outlines are visible, not removed", check: "return !rules().some((r) => /:focus\\b(?!-)/.test(r.selector) && /none/.test(r.style.outline)) && rules(/:focus-visible/).some((r) => r.style.outline && !/none/.test(r.style.outline));", fail: "Delete *:focus { outline: none; } and add a :focus-visible outline." },
          ],
          solution: { "index.html": A11Y_HTML_DONE, "style.css": A11Y_CSS_DONE },
          hint: "Work top to bottom: landmarks, skip link, form and labels, button, current link, then the two CSS fixes.",
          successMessage: "Seven review findings fixed. Tab through the preview: skip link, navigation, fields and button, with a clear ring at every step.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 142 · 30.5 – 30.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l142-seo",
    moduleId: "wd-m30-performance",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["30.5", "30.6"],
    title: "Titles, Metadata and Search-Friendly Structure",
    subtitle: "Helping search engines understand the page and people choose it",
    estimatedMinutes: 22,
    intro: "Module 4 introduced SEO. With a live site, it matters: the title and description are your listing in Google, and structure decides whether the page is understood at all.",

    atoms: [
      {
        id: "a-wd-titles-metadata",
        title: "Page titles and metadata",
        explain:
          "Every page needs a unique, specific title (about 50–60 characters, most important words first) and a meta description (about 150 characters) that would make someone click. A canonical link (<link rel=\"canonical\" href=\"…\">) tells search engines which address is the real one when a page is reachable at several. Open Graph tags control share previews. Structured data, a JSON-LD script describing the business, product or article with schema.org vocabulary, can earn rich results such as opening hours and ratings.",
      },
      {
        id: "a-wd-search-structure",
        title: "Search-friendly content structure",
        explain:
          "Search engines read structure the way screen readers do: one h1 that says what the page is about, h2s for its sections, descriptive link text (never \"click here\"), alt text on images, and real text rather than text inside images. Each page should have one clear topic and the words people would actually search for, used naturally. Add a sitemap.xml and a robots.txt to public/ so search engines can find every page, and check the site in Google Search Console.",
        webLab: {
          task:
            "Make this restaurant homepage search-friendly. Give it a specific title naming the restaurant, its food and Ibadan (20–65 characters); a meta description (50–160 characters); a canonical link to https://iyabasira.ng/; og:title and og:description; and a JSON-LD script with @type Restaurant, its name and its address locality, Ibadan. Then fix the structure: the three .big paragraphs become one h1 and two h2s, and the \"click here\" link gets descriptive text.",
          files: { "index.html": SEO_HTML },
          tests: [
            { label: "A specific title naming the restaurant and Ibadan", check: "const t = document.title; return /basira/i.test(t) && /ibadan/i.test(t) && t.length >= 20 && t.length <= 65;", fail: "For example: Iya Basira's Kitchen · Amala and Yoruba food in Ibadan." },
            { label: "A meta description of 50 to 160 characters", check: "const d = $('meta[name=description]')?.content || ''; return d.length >= 50 && d.length <= 160;", fail: "Add <meta name=\"description\" content=\"…\">." },
            { label: "A canonical link to https://iyabasira.ng/", check: "return $('link[rel=canonical]')?.getAttribute('href') === 'https://iyabasira.ng/';", fail: "Add <link rel=\"canonical\" href=\"https://iyabasira.ng/\">." },
            { label: "Open Graph title and description", check: "return !!$('meta[property=\"og:title\"]')?.content && !!$('meta[property=\"og:description\"]')?.content;", fail: "Add og:title and og:description meta tags." },
            { label: "JSON-LD describes a Restaurant in Ibadan", check: "const s = $('script[type=\"application/ld+json\"]'); if (!s) return false; try { const d = JSON.parse(s.textContent); return d['@type'] === 'Restaurant' && /basira/i.test(d.name) && d.address?.addressLocality === 'Ibadan'; } catch { return false; }", fail: "Add a <script type=\"application/ld+json\"> with \"@type\": \"Restaurant\", a name and an address with addressLocality Ibadan." },
            { label: "One h1 and two h2s replace the .big paragraphs", check: "return $$('h1').length === 1 && $$('h2').length === 2 && !$('p.big');", fail: "The restaurant's name is the h1; Our menu and Find us are h2s." },
            { label: "No \"click here\" link: the menu link describes itself", check: "const a = $('a[href=\"menu.html\"]'); return !!a && !/click here/i.test(text(a)) && /menu/i.test(text(a));", fail: "Make the link's own words say where it goes." },
          ],
          solution: { "index.html": SEO_HTML_DONE },
          hint: "JSON-LD is a script whose content is JSON, so it must parse: double quotes everywhere, no trailing commas.",
          successMessage: "A page a search engine can understand and a searcher would click. Paste your own pages' JSON-LD into Google's Rich Results Test to check it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 143 · 30.7 – 30.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l143-images-fonts",
    moduleId: "wd-m30-performance",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["30.7", "30.8", "30.9"],
    title: "Images, Lazy Loading and Fonts",
    subtitle: "The biggest files on most pages, and the jumps that annoy everyone",
    estimatedMinutes: 24,
    intro: "Images are usually most of a page's weight, and late-loading images and fonts make pages jump as you read. These are the cheapest performance wins there are.",

    atoms: [
      {
        id: "a-wd-image-formats",
        title: "Image compression and modern formats",
        explain:
          "Never ship a photo straight from a phone camera: resize it to the largest size it is actually displayed at (twice that for high-density screens) and compress it. Modern formats are much smaller for the same quality: WebP is supported everywhere and AVIF in most current browsers. <picture> offers them with a fallback: the browser takes the first <source> whose type it supports, and the <img> inside is the fallback and carries the alt, size and loading attributes. Use SVG for logos and icons.",
        example: "<picture>\n  <source type=\"image/avif\" srcset=\"images/hero.avif\">\n  <source type=\"image/webp\" srcset=\"images/hero.webp\">\n  <img src=\"images/hero.jpg\" alt=\"…\" width=\"1600\" height=\"900\">\n</picture>\n\nTypical sizes for one 1600px photo: JPEG 410kB · WebP 260kB · AVIF 160kB",
      },
      {
        id: "a-wd-lazy-loading",
        title: "Lazy loading",
        explain:
          "loading=\"lazy\" tells the browser not to download an image (or iframe) until the visitor scrolls near it, so images far down the page cost nothing for people who never reach them. Never lazy-load the main image at the top of the page: it is usually the Largest Contentful Paint (Lesson 144) and must load as early as possible; give it fetchpriority=\"high\" instead. decoding=\"async\" lets the browser decode large images without holding up other work.",
      },
      {
        id: "a-wd-font-loading",
        title: "Font loading and layout stability",
        explain:
          "Layout shift is content jumping as late resources arrive, so the visitor taps the wrong thing. Prevent it: give every image and iframe width and height (or aspect-ratio) so its space is reserved; use font-display: swap so text appears at once in a fallback font; choose a fallback font of similar size; and limit web fonts to the weights you use. Self-hosting fonts in WOFF2 avoids a connection to another server.",
        webLab: {
          task:
            "Fix this gallery's loading behaviour. The hero is lazy-loaded although it is the first thing seen: remove that, give it fetchpriority=\"high\", and serve it through a <picture> with AVIF and WebP sources (images/hero.avif, images/hero.webp) before the JPEG. Give every image width and height. Lazy-load the three gallery images below the fold, with decoding=\"async\". Make images responsive, and give the web font font-display: swap.",
          files: { "index.html": MEDIA_HTML, "style.css": MEDIA_CSS },
          tests: [
            { label: "The hero is not lazy-loaded and has fetchpriority=\"high\"", check: "const h = $('img.hero'); return h.getAttribute('loading') !== 'lazy' && h.getAttribute('fetchpriority') === 'high';", fail: "Remove loading=\"lazy\" from the hero and add fetchpriority=\"high\"." },
            { label: "The hero is in a picture with AVIF and WebP sources first", check: "const p = $('img.hero').closest('picture'); if (!p) return false; const types = [...p.querySelectorAll('source')].map((s) => s.type); return types[0] === 'image/avif' && types[1] === 'image/webp' && p.lastElementChild === $('img.hero');", fail: "Wrap the hero in <picture> with <source type=\"image/avif\"> then <source type=\"image/webp\">, and the img last." },
            { label: "Every image has width and height", check: "return $$('img').every((i) => i.hasAttribute('width') && i.hasAttribute('height'));", fail: "Add width and height to all four images (hero 1600×900, team 1200×800, products 800×800)." },
            { label: "The gallery images are lazy-loaded and decode asynchronously", check: "return $$('main img').length === 3 && $$('main img').every((i) => i.getAttribute('loading') === 'lazy' && i.getAttribute('decoding') === 'async');", fail: "Add loading=\"lazy\" decoding=\"async\" to the three images in main." },
            { label: "Images fit a phone without sideways scrolling", viewport: "mobile", check: "return !overflowX();", fail: "img { display: block; max-width: 100%; height: auto; }" },
            { label: "The web font uses font-display: swap", check: "return /font-display\\s*:\\s*swap/.test(code('style.css'));", fail: "Add font-display: swap; inside the @font-face rule." },
          ],
          solution: { "index.html": MEDIA_HTML_DONE, "style.css": MEDIA_CSS_DONE },
          hint: "The hero needs the opposite treatment to the gallery: load first and fast, not lazily.",
          successMessage: "The first image loads first, the others only when needed, nothing jumps, and text never waits for the font.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 144 · 30.10 – 30.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l144-js-vitals",
    moduleId: "wd-m30-performance",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["30.10", "30.11", "30.12", "30.13", "30.14"],
    title: "JavaScript Weight, Lighthouse, Core Web Vitals and Responsive Images",
    subtitle: "Measuring speed the way Google does, and the fixes that move the numbers",
    estimatedMinutes: 28,
    intro: "Speed is measured, not felt. Google's Core Web Vitals turn \"it feels slow\" into three numbers, Lighthouse tells you why, and a small set of fixes improves almost every site.",

    atoms: [
      {
        id: "a-wd-minimise-js",
        title: "Minimizing unnecessary JavaScript",
        explain:
          "JavaScript is the most expensive byte on the web: it must be downloaded, parsed and run, which blocks the main thread on cheap phones. Ship less: question every library (does a 70kB date library earn its place over three lines of code?), let the build tree-shake unused code, load scripts with defer or type=\"module\" so they never block the HTML, and load heavy features only when needed with dynamic import(), which Vite splits into its own small file.",
      },
      {
        id: "a-wd-lighthouse",
        title: "Lighthouse and browser performance tools",
        explain:
          "Lighthouse (DevTools → Lighthouse, or PageSpeed Insights online for a live URL) loads the page on a simulated mid-range phone with slow 4G and scores Performance, Accessibility, Best Practices and SEO, listing specific problems with the potential saving of each. Run it in an incognito window (extensions skew results), several times, and fix the largest opportunities first. PageSpeed Insights also shows real-visitor data for busy sites.",
      },
      {
        id: "a-wd-web-vitals",
        title: "Core Web Vitals fundamentals",
        explain:
          "Core Web Vitals are three measurements of real experience that Google uses in ranking. Largest Contentful Paint (LCP): how long until the main content (often the hero image) is shown; good is under 2.5 seconds. Interaction to Next Paint (INP): how quickly the page responds to taps and clicks; good is under 200 milliseconds. Cumulative Layout Shift (CLS): how much the content jumps; good is under 0.1.",
        table: {
          caption: "The three vitals and their usual fixes.",
          headers: ["Vital", "Good", "Usual causes", "Usual fixes"],
          rows: [
            ["LCP (loading)", "< 2.5s", "Huge or lazy hero image, slow server, render-blocking files", "Compress and size the hero, fetchpriority=high, defer scripts"],
            ["INP (interactivity)", "< 200ms", "Long JavaScript tasks", "Less JavaScript, dynamic import, split long work"],
            ["CLS (stability)", "< 0.1", "Images without dimensions, late fonts and ads", "width and height, font-display: swap, reserved space"],
          ],
        },
      },
      {
        id: "a-wd-responsive-image-strategies",
        title: "Responsive image strategies",
        explain:
          "srcset with width descriptors lists the same image at several sizes (\"photo-600.jpg 600w, photo-1200.jpg 1200w\"), and sizes tells the browser how wide the image will be displayed (\"(min-width: 800px) 760px, 100vw\"). The browser combines that with the screen's width and pixel ratio to download the smallest file that will look sharp, so a phone never downloads the laptop's image. Use <picture> with media only for art direction, when phones need a different crop.",
        example: "<img\n  src=\"market-1400.jpg\"\n  srcset=\"market-600.jpg 600w, market-1200.jpg 1200w, market-1400.jpg 1400w\"\n  sizes=\"(min-width: 800px) 760px, 100vw\"\n  alt=\"Market stalls in Balogun market\" width=\"1400\" height=\"700\">",
      },
      {
        id: "a-wd-measure-improve",
        title: "Measuring and improving performance",
        explain:
          "Improve in a loop: measure (Lighthouse, real-user data), pick the biggest problem, fix one thing, measure again, and keep a record of the before and after. Set a performance budget, such as \"under 200kB of JavaScript, LCP under 2.5s on 4G\", and check it on every release so the site does not slowly get heavier. Test on a real, inexpensive Android phone: it is closer to many of your visitors than your laptop is.",
        webLab: {
          task:
            "Improve this report page. app.js is a blocking script in the head: load it as a module instead (modules are deferred). It imports chart.js, a heavy library, on every page load although most visitors never press the button: change app.js to load chart.js with a dynamic import() only when the button is clicked. And make the banner responsive: add a srcset with width descriptors (images/article.jpg 1400w, images/team.jpg 1200w, images/profile.jpg 600w), a sizes attribute, and width and height.",
          files: { "index.html": PERF_HTML, "style.css": "body { margin: 0; font-family: Arial, sans-serif; }\nmain { padding: 16px; }\nimg { display: block; max-width: 100%; height: auto; }\n", "app.js": PERF_JS, "chart.js": PERF_CHART },
          readOnly: ["style.css", "chart.js"],
          tests: [
            { label: "app.js no longer blocks the page: it loads as a module (or deferred)", check: "return /type=[\"']module[\"']|\\bdefer\\b/.test(code('index.html').match(/<script[^>]*app\\.js[^>]*>/)?.[0] || '');", fail: "Use <script type=\"module\" src=\"app.js\"></script>." },
            { label: "chart.js is not loaded until the button is pressed", check: "return !/^\\s*import\\s*\\{[^}]*\\}\\s*from\\s*[\"']\\.\\/chart\\.js/m.test(code('app.js')) && /import\\(\\s*[\"']\\.\\/chart\\.js[\"']\\s*\\)/.test(code('app.js'));", fail: "Remove the static import and use const { drawChart } = await import(\"./chart.js\"); inside the click handler." },
            { label: "Pressing the button still draws the chart", check: "await click('#show-chart'); await waitFor(() => $('#chart').dataset.drawn === 'yes'); return text('#chart') === 'Chart: 12 · 19 · 7 · 25';", fail: "Make the click handler async and await the dynamic import before drawing." },
            { label: "The banner has a srcset with width descriptors and a sizes attribute", check: "const i = $('img.banner'); const ss = code('index.html').match(/srcset=\"([^\"]+)\"/)?.[1] || ''; return (ss.match(/\\d+w/g) || []).length >= 3 && !!i.getAttribute('sizes');", fail: "Add srcset=\"images/article.jpg 1400w, images/team.jpg 1200w, images/profile.jpg 600w\" and sizes=\"(min-width: 800px) 760px, 100vw\"." },
            { label: "The banner has width and height", check: "const i = $('img.banner'); return i.hasAttribute('width') && i.hasAttribute('height');", fail: "Add width=\"1400\" height=\"700\"." },
            { label: "No errors", check: "return errors().length === 0;", fail: "Check that the import() path is \"./chart.js\"." },
          ],
          solution: { "index.html": PERF_HTML_DONE, "app.js": PERF_JS_DONE },
          hint: "A classic script cannot use a static import at all; a module can, and can also use import() for code it needs later.",
          successMessage: "No blocking script, a heavy library loaded only for the visitors who need it, and an image the browser can choose the right size of. Run Lighthouse on your own site and work through its list the same way.",
        },
      },
    ],

    task: {
      title: "Module project: audit and improve your live site",
      intro: "Use the site you deployed in Module 29.",
      prompts: [
        "Run Lighthouse (in an incognito window, mobile mode) and record all four scores and the three Core Web Vitals.",
        "Do the manual accessibility review from Lesson 141: keyboard only, then a screen reader.",
        "Fix the five largest findings: compress and size images, fix the hero's loading, add dimensions, defer or split JavaScript, fix contrast or labels.",
        "Add a title, description, canonical, Open Graph tags and JSON-LD to your homepage, plus a sitemap.xml and robots.txt.",
        "Deploy, run Lighthouse again and put the before and after scores in your README.",
      ],
      closing: "Next module: keeping the site secure and maintained.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
