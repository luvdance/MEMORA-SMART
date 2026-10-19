/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 4 · SEMANTIC HTML AND PAGE STRUCTURE
 *
 * Curriculum 4.1 – 4.10. Landmarks and generic containers, multi-section and
 * multi-page sites, tables, video and audio, iframes embedded safely, the
 * metadata in the head, and what search engines need from a page.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s4-semantic";

const HEAD = (title) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>`;

const DIV_SOUP = `${HEAD("Tola's Tech Blog")}
<body>
  <div class="header">
    <div class="logo">Tola's Tech Blog</div>
    <div class="nav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>

  <div class="content">
    <div class="post">
      <h1>Five ways to make your phone battery last longer</h1>
      <p>Posted on 3 March 2026 by <span class="author">Tola Bello</span></p>
      <p>Lower the brightness, turn off background refresh, and keep it out of the sun.</p>
    </div>
  </div>

  <div class="footer">
    <p>&copy; 2026 Tola Bello</p>
  </div>
</body>
</html>
`;

const SEMANTIC = `${HEAD("Tola's Tech Blog")}
<body>
  <header>
    <p class="logo">Tola's Tech Blog</p>
    <nav>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Five ways to make your phone battery last longer</h1>
      <p>Posted on 3 March 2026 by <span class="author">Tola Bello</span></p>
      <p>Lower the brightness, turn off background refresh, and keep it out of the sun.</p>
    </article>
  </main>

  <footer>
    <p>&copy; 2026 Tola Bello</p>
  </footer>
</body>
</html>
`;

const NAV = (current) => `  <header>
    <nav aria-label="Main">
      <ul>
        <li><a href="index.html"${current === "index" ? ' aria-current="page"' : ""}>Home</a></li>
        <li><a href="fixtures.html"${current === "fixtures" ? ' aria-current="page"' : ""}>Fixtures</a></li>
      </ul>
    </nav>
  </header>`;

const CLUB_INDEX = `${HEAD("Surulere Stars FC")}
<body>
${NAV("index")}
  <main>
    <h1>Surulere Stars FC</h1>
    <p>Community football for under-16s, training every Saturday.</p>
  </main>
</body>
</html>
`;

const FIXTURES_START = `${HEAD("Fixtures · Surulere Stars FC")}
<body>
  <!-- Add the same navigation as index.html here, marking this page as current -->

  <main>
    <h1>Fixtures</h1>
    <!-- Turn this into a table with a caption, a header row and one row per match -->
    <p>Date, Opponent, Venue</p>
    <p>14 March, Yaba United, Home</p>
    <p>21 March, Ikeja Rangers, Away</p>
    <p>28 March, Lekki Lions, Home</p>
  </main>
</body>
</html>
`;

const FIXTURES_DONE = `${HEAD("Fixtures · Surulere Stars FC")}
<body>
${NAV("fixtures")}

  <main>
    <h1>Fixtures</h1>
    <table>
      <caption>Spring fixtures, 2026</caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Opponent</th>
          <th scope="col">Venue</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>14 March</td><td>Yaba United</td><td>Home</td></tr>
        <tr><td>21 March</td><td>Ikeja Rangers</td><td>Away</td></tr>
        <tr><td>28 March</td><td>Lekki Lions</td><td>Home</td></tr>
      </tbody>
    </table>
  </main>
</body>
</html>
`;

const MEDIA_START = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page</title>
  <!-- Add a meta description and Open Graph tags here -->
</head>
<body>
  <main>
    <h1>Visit Lekki Arts Centre</h1>
    <p>Exhibitions, workshops and a café, open Tuesday to Sunday.</p>

    <h2>Take the tour</h2>
    <!-- A video, media/tour.mp4, with controls and English captions from media/tour-en.vtt -->

    <h2>Find us</h2>
    <!-- Embed the map https://www.openstreetmap.org/export/embed.html?bbox=3.47,6.43,3.49,6.45 -->
  </main>
</body>
</html>
`;

const MEDIA_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lekki Arts Centre · Exhibitions and workshops in Lagos</title>
  <meta name="description" content="Exhibitions, art workshops and a café in Lekki, Lagos. Open Tuesday to Sunday, 10am to 6pm.">
  <meta property="og:title" content="Lekki Arts Centre">
  <meta property="og:description" content="Exhibitions, workshops and a café in Lekki, Lagos.">
  <meta property="og:image" content="https://lekkiarts.ng/images/hero.jpg">
</head>
<body>
  <main>
    <h1>Visit Lekki Arts Centre</h1>
    <p>Exhibitions, workshops and a café, open Tuesday to Sunday.</p>

    <h2>Take the tour</h2>
    <video controls width="640" height="360" preload="metadata">
      <source src="media/tour.mp4" type="video/mp4">
      <track kind="captions" src="media/tour-en.vtt" srclang="en" label="English">
      <p>Your browser cannot play this video. <a href="media/tour.mp4">Download the tour</a>.</p>
    </video>

    <h2>Find us</h2>
    <iframe
      src="https://www.openstreetmap.org/export/embed.html?bbox=3.47,6.43,3.49,6.45"
      title="Map showing Lekki Arts Centre"
      width="600" height="400"
      loading="lazy"
      referrerpolicy="no-referrer"></iframe>
  </main>
</body>
</html>
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.1 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l13-semantic",
    moduleId: "wd-m4-semantic",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3"],
    title: "Semantic HTML and Landmarks",
    subtitle: "Elements that say what a part of the page is, and the two that say nothing",
    estimatedMinutes: 18,
    intro:
      "Two pages can look identical and be built completely differently. One is a pile of anonymous boxes; the other tells every browser, search engine and screen reader exactly where the navigation, the main content and the footer are. This lesson is about building the second kind.",

    atoms: [
      {
        id: "a-wd-what-semantic",
        title: "What semantic HTML means",
        explain:
          "Semantic means \"carrying meaning\". Semantic HTML uses the element whose meaning matches the content: <nav> for navigation, <button> for a button, <h2> for a section heading, instead of a generic box styled to look like one. The page looks the same, but machines can understand it: screen readers offer \"jump to main content\" and \"list navigation\", search engines know which text is the article, and your own code is easier to read.",
        decision: {
          scenario:
            "A developer builds a menu button as <div class=\"btn\" onclick=\"openMenu()\">Menu</div>, styled to look exactly like a button.",
          question: "What is wrong with it?",
          options: [
            {
              id: "a",
              text: "A div has no button meaning: keyboard users cannot tab to it or press Enter on it, and screen readers do not announce it as a button",
              why: "<button> gives focus, Enter and Space support, and the right announcement for free. A div gives none of that; recreating it by hand is long and usually incomplete.",
            },
            {
              id: "b",
              text: "Nothing: it looks like a button, so it is one",
              whyWrong: "It only looks like one to sighted mouse users. Everyone else gets nothing.",
            },
            {
              id: "c",
              text: "divs are slower to load than buttons",
              whyWrong: "Speed is not the issue; meaning and keyboard access are.",
            },
            {
              id: "d",
              text: "It should be a span instead",
              whyWrong: "A span has no meaning either. The right element is <button>.",
            },
          ],
          correct: "a",
          aftermath: "The rule: use the native element that means what you mean. It brings behaviour and accessibility you would otherwise have to rebuild.",
        },
      },
      {
        id: "a-wd-landmarks",
        title: "header, nav, main, section, article and footer",
        explain:
          "Landmark elements divide a page into regions that assistive technology can jump between. Use one <main> per page for its unique content. <header> holds introductory content (a logo, the site navigation); <nav> wraps a major block of navigation links; <footer> holds closing information (copyright, contact links). Inside main, <article> is content that would make sense on its own, such as a blog post or a product card, and <section> is a themed group of content with its own heading.",
        table: {
          caption: "Which element for which region.",
          headers: ["Element", "Holds", "Typical example"],
          rows: [
            ["<header>", "Introductory content for the page or a section", "Logo and main menu"],
            ["<nav>", "A major group of navigation links", "The main menu; a table of contents"],
            ["<main>", "The page's unique content, once per page", "Everything except header, nav and footer"],
            ["<article>", "A self-contained piece", "A blog post, a news story, a comment, a product"],
            ["<section>", "A themed group with a heading", "Pricing, Testimonials, FAQ"],
            ["<aside>", "Related but secondary content", "A sidebar of related posts"],
            ["<footer>", "Closing information", "Copyright, contact and policy links"],
          ],
        },
        why: "A screen-reader user arriving on your page can press one key to skip straight to <main>, past forty navigation links. Without the landmark they hear all forty, on every page.",
      },
      {
        id: "a-wd-div-span",
        title: "Generic containers: div and span",
        explain:
          "<div> and <span> mean nothing at all, which is exactly their purpose. Use a div to group block content for layout or styling when no semantic element fits, and a span to mark a piece of text inside a line, such as a price or an author's name, so CSS or JavaScript can target it. Reach for them last, after asking whether a meaningful element exists.",
        example:
          "Good uses:\n  <div class=\"card-grid\"> … </div>          a box only for layout\n  <p>Price: <span class=\"price\">₦4,500</span></p>   a piece of a line to style\n\nPoor uses:\n  <div class=\"footer\">  →  <footer>\n  <div class=\"nav\">     →  <nav>\n  <div onclick=…>        →  <button>",
        webLab: {
          task:
            "This blog page is built entirely from divs. Rebuild its structure with semantic elements: the top becomes a <header> containing a <nav>, with the three links in a list; the post is an <article> inside the page's <main>; the bottom becomes a <footer>. Keep the span around the author's name: that is a correct use of a span.",
          files: { "index.html": DIV_SOUP },
          tests: [
            {
              label: "The top of the page is a <header> containing a <nav>",
              check: "return !!$('header nav');",
              fail: "Replace <div class=\"header\"> with <header>, and <div class=\"nav\"> inside it with <nav>.",
            },
            {
              label: "The navigation links are in a list (ul > li > a)",
              check: "return $$('nav ul > li > a').length === 3;",
              fail: "Put the three links in a <ul>, each inside its own <li>.",
            },
            {
              label: "There is exactly one <main>, containing the post as an <article>",
              check: "return $$('main').length === 1 && !!$('main article h1');",
              fail: "Wrap the post in <article>, inside a single <main>.",
            },
            {
              label: "The bottom of the page is a <footer>",
              check: "return !!$('footer') && text('footer').includes('2026');",
              fail: "Replace <div class=\"footer\"> with <footer>.",
            },
            {
              label: "No divs are left pretending to be landmarks",
              check: "return !$('div.header, div.nav, div.footer, div.content, div.post');",
              fail: "Some div.header, div.nav, div.content, div.post or div.footer is still there. Replace each one.",
            },
            {
              label: "The author's name is still in a span",
              check: "return text('span.author') === 'Tola Bello';",
              fail: "Keep <span class=\"author\">Tola Bello</span>; a span is right for a piece of a line.",
            },
          ],
          solution: { "index.html": SEMANTIC },
          hint: "Change the tag names first (div class=\"footer\" becomes footer), then wrap the links in <ul> and <li>.",
          successMessage:
            "It looks exactly the same, and it is a different page to a screen reader: landmarks to jump between, a navigation list with three items, and an article that search engines can identify.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 4.4 – 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l14-pages-tables",
    moduleId: "wd-m4-semantic",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.4", "4.5", "4.6"],
    title: "Multi-Section Pages, Multi-Page Sites and Tables",
    subtitle: "Organising content within a page, across pages, and in rows and columns",
    estimatedMinutes: 20,
    intro:
      "Real sites are several pages, each with several sections, and some content is genuinely a grid of data. This lesson structures all three: sections that can be linked to, navigation that works the same on every page, and tables a screen reader can read.",

    atoms: [
      {
        id: "a-wd-multi-section",
        title: "Structuring a multi-section webpage",
        explain:
          "A long page, such as a business homepage, is a sequence of sections: hero, services, testimonials, contact. Give each one a <section> with its own heading, and an id so that links (and your navigation) can jump to it with href=\"#services\". Plan the outline first: write the headings down as a list, and you have the page's skeleton before any detail.",
        example:
          "<main>\n  <section id=\"hero\">\n    <h1>Bright Smile Dental</h1>\n    <p>Gentle care in Ikeja.</p>\n  </section>\n  <section id=\"services\">\n    <h2>Services</h2>\n    …\n  </section>\n  <section id=\"contact\">\n    <h2>Contact</h2>\n    …\n  </section>\n</main>",
        mistake: "A <section> with no heading. If a group has nothing to call it, it is probably just a div for layout.",
      },
      {
        id: "a-wd-multi-page-nav",
        title: "Building multi-page navigation",
        explain:
          "Each page of a site is its own HTML file, and each one repeats the same header and navigation so visitors can always get anywhere. Link pages with relative URLs, keep the links in the same order on every page, and mark the link to the page you are on with aria-current=\"page\": screen readers announce \"current page\", and CSS can style it later. (In Phase 5 you will stop copying the navigation by hand.)",
        example:
          "On fixtures.html:\n\n<nav aria-label=\"Main\">\n  <ul>\n    <li><a href=\"index.html\">Home</a></li>\n    <li><a href=\"fixtures.html\" aria-current=\"page\">Fixtures</a></li>\n  </ul>\n</nav>",
        why: "Consistent navigation is a usability rule and an accessibility requirement: people learn where things are on the first page and expect them in the same place on every other.",
      },
      {
        id: "a-wd-tables",
        title: "Tables and tabular information",
        explain:
          "Use a <table> for data that has rows and columns, such as fixtures, prices or timetables, and never for page layout. A <caption> names the table. The header row sits in <thead> and uses <th> cells with scope=\"col\"; data rows go in <tbody> as <tr> rows of <td> cells. The th and scope tell a screen reader, as it moves through a cell, which column it is in: \"Venue: Away\".",
        webLab: {
          task:
            "Finish the club site's Fixtures page. Copy the navigation from index.html, marking Fixtures as the current page with aria-current=\"page\". Then turn the fixtures into a proper table: a caption, a header row of th cells with scope=\"col\" in a thead, and the three matches as rows in a tbody.",
          files: { "fixtures.html": FIXTURES_START, "index.html": CLUB_INDEX },
          readOnly: ["index.html"],
          tests: [
            {
              label: "Fixtures has the same navigation: links to index.html and fixtures.html",
              check: "const h = $$('nav a').map((a) => a.getAttribute('href')); return h.includes('index.html') && h.includes('fixtures.html');",
              fail: "Copy the <header> and <nav> from index.html into fixtures.html.",
            },
            {
              label: "The Fixtures link is marked aria-current=\"page\", and only that one",
              check: "const cur = $$('nav a[aria-current=\"page\"]'); return cur.length === 1 && cur[0].getAttribute('href') === 'fixtures.html';",
              fail: "On this page, aria-current=\"page\" belongs on the Fixtures link, not Home.",
            },
            {
              label: "The table has a caption",
              check: "return text('table caption').length > 0;",
              fail: "Add a <caption> as the first thing inside the <table>.",
            },
            {
              label: "The header row is in a thead, made of th cells with scope=\"col\"",
              check: "const th = $$('thead th'); return th.length === 3 && th.every((c) => c.getAttribute('scope') === 'col');",
              fail: "Put Date, Opponent and Venue in <thead><tr> as three <th scope=\"col\"> cells.",
            },
            {
              label: "The three matches are rows of td cells in a tbody",
              check: "const rows = $$('tbody tr'); return rows.length === 3 && rows.every((r) => r.querySelectorAll('td').length === 3) && text(rows[1]).includes('Ikeja Rangers');",
              fail: "Each match is a <tr> in <tbody>, with three <td> cells.",
            },
            {
              label: "The old paragraphs are gone",
              check: "return !$$('main p').some((p) => /Yaba United|Date, Opponent/.test(text(p)));",
              fail: "Remove the paragraphs once the table holds the same information.",
            },
          ],
          solution: { "fixtures.html": FIXTURES_DONE },
          hint: "Structure: <table> <caption> <thead><tr><th scope=\"col\">…</th></tr></thead> <tbody><tr><td>…</td></tr></tbody> </table>.",
          successMessage:
            "Use the page buttons above the preview, or the navigation itself, to move between the two pages. Consistent navigation, the current page marked, and a table a screen reader can read cell by cell.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 4.7 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l15-media-metadata",
    moduleId: "wd-m4-semantic",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.7", "4.8", "4.9", "4.10"],
    title: "Video, Audio, Embeds, Metadata and SEO",
    subtitle: "Media everyone can use, embedding safely, and how pages present themselves to the world",
    estimatedMinutes: 22,
    intro:
      "A page also has a life outside itself: in a search result, in a WhatsApp preview, on a slow connection, read by a deaf visitor. This lesson covers the media and head elements that decide how it does there.",

    atoms: [
      {
        id: "a-wd-video-audio",
        title: "Embedding video and audio",
        explain:
          "<video> and <audio> play media natively. Add controls so visitors can play, pause and change the volume, give video a width and height, and list one or more <source> files so the browser can pick a format it supports. Captions come from a <track kind=\"captions\"> pointing to a WebVTT (.vtt) file: they are essential for deaf visitors and for the many people who watch with the sound off. Do not autoplay sound: it startles people and browsers block it anyway.",
        example:
          "<video controls width=\"640\" height=\"360\" preload=\"metadata\">\n  <source src=\"media/tour.mp4\" type=\"video/mp4\">\n  <track kind=\"captions\" src=\"media/tour-en.vtt\" srclang=\"en\" label=\"English\">\n  <p>Your browser cannot play this video. <a href=\"media/tour.mp4\">Download it</a>.</p>\n</video>\n\n<audio controls src=\"media/sermon.mp3\"></audio>",
        why: "preload=\"metadata\" downloads only the length and size until the visitor presses play, which saves mobile data on pages where most visitors never play the video.",
      },
      {
        id: "a-wd-iframes",
        title: "iframe fundamentals and safe embedding",
        explain:
          "An <iframe> embeds another web page inside yours: a map, a YouTube video, a booking widget. That page runs code you did not write, so embed only from sources you trust. Always give an iframe a title (screen readers announce it), a width and height, and loading=\"lazy\" so it only loads when scrolled near. The sandbox attribute restricts what the embedded page may do, and referrerpolicy controls what it learns about your page.",
        table: {
          caption: "Attributes for a safe, accessible iframe.",
          headers: ["Attribute", "Why"],
          rows: [
            ["title=\"Map showing our office\"", "Screen readers announce what the frame is"],
            ["width and height", "Space is reserved, so the page does not jump"],
            ["loading=\"lazy\"", "Not downloaded until the visitor scrolls near it"],
            ["sandbox=\"allow-scripts\"", "Blocks everything not listed: forms, pop-ups, navigating your page"],
            ["referrerpolicy=\"no-referrer\"", "The embedded site is not told which page embedded it"],
          ],
        },
        mistake: "Pasting embed code from an unknown site. An iframe can show phishing forms or run heavy scripts on your page; only embed from providers you trust.",
      },
      {
        id: "a-wd-metadata",
        title: "Metadata and page titles",
        explain:
          "The <head> describes the page to the outside world. The <title> is the most important line on the page for search: it is the clickable headline in Google and the name on the tab, so make it unique per page, specific and under about 60 characters: \"Lekki Arts Centre · Exhibitions and workshops in Lagos\", never just \"Home\". The meta description is the summary under the headline. Open Graph tags (og:title, og:description, og:image) control the preview card when someone shares your link on WhatsApp, Facebook or LinkedIn.",
        example:
          "<title>Lekki Arts Centre · Exhibitions and workshops in Lagos</title>\n<meta name=\"description\" content=\"Exhibitions, art workshops and a café in Lekki, Lagos. Open Tuesday to Sunday.\">\n<meta property=\"og:title\" content=\"Lekki Arts Centre\">\n<meta property=\"og:image\" content=\"https://lekkiarts.ng/images/hero.jpg\">",
      },
      {
        id: "a-wd-seo-intro",
        title: "Introduction to search engine optimization",
        explain:
          "Search engine optimization (SEO) is helping search engines understand your page and helping people choose it in the results. Most of it is what you have already learned: a clear, unique title and description; one h1 that matches what the page is about; a logical heading outline; descriptive link text; alt text on images; fast loading; and pages that work on phones. There are no tricks that beat good, well-structured content.",
        table: {
          caption: "SEO basics, and where they are in this course.",
          headers: ["Practice", "Where"],
          rows: [
            ["Unique, descriptive titles and descriptions", "This lesson"],
            ["One h1 and a logical outline", "Module 3"],
            ["Descriptive link text and alt text", "Module 3"],
            ["Mobile-friendly, responsive pages", "Module 10"],
            ["Fast loading and Core Web Vitals", "Module 30"],
          ],
        },
        webLab: {
          task:
            "Finish this arts centre page. In the head, replace the vague title with a specific one, add a meta description, and add og:title and og:description tags. Where the comments are, add the tour video (media/tour.mp4) with controls and an English captions track (media/tour-en.vtt), and embed the map in an iframe with a title, loading=\"lazy\" and a width and height.",
          files: { "index.html": MEDIA_START },
          tests: [
            {
              label: "The title is specific: it names the centre and is 20 to 65 characters long",
              check: "const t = document.title; return /lekki arts/i.test(t) && t.length >= 20 && t.length <= 65;",
              fail: "Write a title that names Lekki Arts Centre and says what it is, between 20 and 65 characters.",
            },
            {
              label: "There is a meta description of 50 to 160 characters",
              check: "const d = $('meta[name=description]')?.content || ''; return d.length >= 50 && d.length <= 160;",
              fail: "Add <meta name=\"description\" content=\"…\"> with a one- or two-sentence summary (50 to 160 characters).",
            },
            {
              label: "Open Graph og:title and og:description are set",
              check: "return !!$('meta[property=\"og:title\"]')?.content && !!$('meta[property=\"og:description\"]')?.content;",
              fail: "Add <meta property=\"og:title\" content=\"…\"> and <meta property=\"og:description\" content=\"…\">.",
            },
            {
              label: "The video has controls and plays media/tour.mp4",
              check: "const v = $('video'); return !!v && v.controls && (v.getAttribute('src') === 'media/tour.mp4' || !!v.querySelector('source[src=\"media/tour.mp4\"]'));",
              fail: "Add <video controls> with <source src=\"media/tour.mp4\" type=\"video/mp4\">.",
            },
            {
              label: "The video has an English captions track",
              check: "const t = $('video track'); return !!t && t.getAttribute('kind') === 'captions' && t.getAttribute('src') === 'media/tour-en.vtt' && t.getAttribute('srclang') === 'en';",
              fail: "Inside the video add <track kind=\"captions\" src=\"media/tour-en.vtt\" srclang=\"en\" label=\"English\">.",
            },
            {
              label: "The map iframe has a title, lazy loading and a size",
              check: "const f = $('iframe'); return !!f && /openstreetmap\\.org/.test(f.src) && f.title.trim().length > 3 && f.getAttribute('loading') === 'lazy' && !!f.getAttribute('width') && !!f.getAttribute('height');",
              fail: "Add an <iframe> for the map with title=\"…\", loading=\"lazy\", width and height.",
            },
          ],
          solution: { "index.html": MEDIA_DONE },
          hint: "The head tags are all <meta> elements; the video holds a <source> and a <track>; the iframe is one element with several attributes.",
          successMessage:
            "The page now introduces itself properly in search results and share previews, its video works for people who cannot hear it, and its map loads only when it is needed.",
        },
      },
    ],

    task: {
      title: "Module project: a two-page club website",
      intro: "Build a small site for a club, church, school or society you know.",
      prompts: [
        "Two pages, index.html and events.html, each with the same header, nav (as a list) and footer, and the current page marked with aria-current.",
        "index.html has at least three sections with headings and ids, and a link in the nav that jumps to one of them.",
        "events.html has a table of upcoming events with a caption, a header row and scope attributes.",
        "Embed a map of the venue in an iframe with a title and lazy loading.",
        "Give each page a unique title, a meta description and Open Graph tags, then share a link to yourself on WhatsApp once it is deployed in Phase 6 and check the preview.",
      ],
      closing: "This is the structure you will turn into the Phase 1 business website.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
