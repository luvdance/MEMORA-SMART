/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 10 · RESPONSIVE WEB DESIGN
 *
 * Curriculum 10.1 – 10.16. The heart of the course: mobile-first design,
 * media queries and content-based breakpoints, fluid containers and type,
 * clamp(), responsive images, navigation that collapses into a menu,
 * responsive cards, tables and forms, horizontal overflow, testing at many
 * widths and device pixel ratios. Every lab is checked at phone, tablet and
 * laptop widths in a real browser.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s10-responsive";

const page = (title, body, script = "") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${body}${script ? `\n  <script src="app.js"></script>` : ""}
</body>
</html>
`;

const BASE = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; }
img { display: block; max-width: 100%; }
`;

/* ── Lesson 38: mobile first ───────────────────────────────────────── */
const MF_HTML = page(
  "Okonkwo Law Chambers",
  `  <main class="services">
    <article class="service"><h2>Property law</h2><p>Land titles, leases and conveyancing.</p></article>
    <article class="service"><h2>Family law</h2><p>Marriage, custody and inheritance.</p></article>
    <article class="service"><h2>Business law</h2><p>Registration, contracts and disputes.</p></article>
  </main>`
);

const MF_CSS = `${BASE}
/* Written desktop-first: three columns, squeezed onto phones. */
.services {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
}

.service {
  padding: 16px;
  border: 1px solid #d1d5db;
}
`;

const MF_CSS_DONE = `${BASE}
/* Mobile first: one column by default. */
.services {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

.service {
  padding: 16px;
  border: 1px solid #d1d5db;
}

/* Three columns once there is room for them. */
@media (min-width: 768px) {
  .services {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

/* ── Lesson 39: breakpoints and containers ─────────────────────────── */
const BP_HTML = page(
  "Abuja Fitness",
  `  <header class="site-header">
    <div class="container header-inner">
      <p class="logo">Abuja Fitness</p>
      <nav>
        <ul class="nav-list">
          <li><a href="classes.html">Classes</a></li>
          <li><a href="prices.html">Prices</a></li>
          <li><a href="join.html">Join</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <main class="container">
    <h1>Train with us</h1>
    <p>Classes from 6am, seven days a week, in Wuse 2.</p>
  </main>`
);

const BP_CSS = `${BASE}
.site-header { background: #312e81; color: white; }
.site-header a { color: white; }

.nav-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.container {
  width: 1100px;
}
`;

const BP_CSS_DONE = `${BASE}
.site-header { background: #312e81; color: white; }
.site-header a { color: white; }

.nav-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.container {
  width: 100%;
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: 16px;
}

/* At about 600px the header has room for the links beside the logo. */
@media (min-width: 600px) {
  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-list {
    display: flex;
    gap: 24px;
  }
}
`;

/* ── Lesson 40: fluid type and images ──────────────────────────────── */
const FLUID_HTML = page(
  "Wildlife of Yankari",
  `  <main class="article">
    <h1>The elephants of Yankari</h1>
    <img class="hero-img" src="images/hero.jpg" alt="Elephants bathing at Wikki Warm Springs" width="1600" height="900">
    <p>Yankari Game Reserve in Bauchi State is home to one of the largest elephant populations in West Africa.</p>
    <div class="thumbs">
      <img src="images/team.jpg" alt="Rangers on patrol" width="1200" height="800">
      <img src="images/map.png" alt="Map of the reserve" width="1000" height="600">
      <img src="images/profile.jpg" alt="A baboon on a branch" width="600" height="600">
    </div>
  </main>`
);

const FLUID_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; }

.article {
  padding: 16px;
}

h1 {
  font-size: 56px;
}

.thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
`;

const FLUID_CSS_DONE = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; }

.article {
  padding: 16px;
}

h1 {
  font-size: clamp(2rem, 1.2rem + 3.5vw, 3.5rem);
  line-height: 1.15;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

.thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.thumbs img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}
`;

/* ── Lesson 41: navigation ─────────────────────────────────────────── */
const NAV_HTML = page(
  "Lagos Cakes",
  `  <header class="site-header">
    <p class="logo">Lagos Cakes</p>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav">
      <ul>
        <li><a href="cakes.html">Cakes</a></li>
        <li><a href="weddings.html">Weddings</a></li>
        <li><a href="order.html">Order</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main><h1>Cakes for every celebration</h1></main>`,
  true
);

const NAV_JS = `// Given: opens and closes the menu, and keeps aria-expanded truthful.
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
`;

const NAV_CSS = `${BASE}
.site-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #831843;
  color: white;
}

.logo { margin: 0; font-weight: 700; }
.site-nav a { color: white; }

.site-nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
`;

const NAV_CSS_DONE = `${BASE}
.site-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #831843;
  color: white;
}

.logo { margin: 0; font-weight: 700; }
.site-nav a { color: white; display: block; padding: 12px 0; }

.site-nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-toggle {
  min-height: 44px;
  padding: 8px 16px;
}

/* Phones: the menu is hidden until the button opens it. */
.site-nav {
  display: none;
  width: 100%;
}

.site-nav.is-open {
  display: block;
}

/* Wider screens: no button, links in a row. */
@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }

  .site-nav {
    display: block;
    width: auto;
  }

  .site-nav ul {
    display: flex;
    gap: 24px;
  }
}
`;

/* ── Lesson 42: components and overflow ───────────────────────────── */
const COMP_HTML = page(
  "Results",
  `  <main class="container">
    <h1>Exam results</h1>
    <p class="notice">Download from https://results.example-school.edu.ng/2026/term-two/jss-three/final-results-sheet.pdf</p>
    <div class="banner">Results day: Friday</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Maths</th><th>English</th><th>Science</th><th>Civic</th><th>Average</th></tr></thead>
        <tbody>
          <tr><td>Chiamaka Okeke</td><td>88</td><td>91</td><td>79</td><td>85</td><td>85.75</td></tr>
          <tr><td>Babatunde Adewale</td><td>72</td><td>68</td><td>81</td><td>77</td><td>74.50</td></tr>
        </tbody>
      </table>
    </div>
    <form class="search">
      <label for="q">Search by name</label>
      <input id="q" name="q" type="search">
    </form>
    <img src="images/logo.svg" srcset="images/logo.svg 1x" alt="Unity Secondary School" width="240" height="80">
  </main>`
);

const COMP_CSS = `${BASE}
.container { padding: 16px; }

.banner {
  width: 500px;
  padding: 12px;
  background: #fef9c3;
}

table { border-collapse: collapse; }
th, td { padding: 8px 12px; border: 1px solid #d1d5db; white-space: nowrap; }

.search input { width: 420px; padding: 10px; }
`;

const COMP_CSS_DONE = `${BASE}
.container { padding: 16px; }

.notice { overflow-wrap: anywhere; }

.banner {
  max-width: 500px;
  padding: 12px;
  background: #fef9c3;
}

.table-wrap { overflow-x: auto; }

table { border-collapse: collapse; }
th, td { padding: 8px 12px; border: 1px solid #d1d5db; white-space: nowrap; }

.search input { width: 100%; max-width: 420px; padding: 10px; }
`;

const COMP_HTML_DONE = COMP_HTML.replace('srcset="images/logo.svg 1x"', 'srcset="images/logo.svg 1x, images/logo.svg 2x"');

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 10.1 – 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l38-mobile-first",
    moduleId: "wd-m10-responsive",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "Responsive Design and Mobile First",
    subtitle: "One page for every screen, starting from the smallest",
    estimatedMinutes: 20,
    intro:
      "Most people in Nigeria, and most people in the world, browse on a phone. A site that only works on a laptop is broken for most of its visitors. This module is the reason the course has the word Responsive in its name.",

    atoms: [
      {
        id: "a-wd-what-responsive",
        title: "What responsive design means",
        explain:
          "A responsive page adapts its layout to the space it has: one column on a narrow phone, two on a tablet, three on a laptop, with readable text and tappable controls at every size, and never a sideways scrollbar. It is built from three ingredients you will meet in this module: fluid layouts (widths in percentages, fr and max-width rather than fixed pixels), flexible media (images that shrink to fit) and media queries (CSS that applies only at certain widths). Ethan Marcotte named the approach in 2010.",
        why: "Google indexes the mobile version of a site first, and pages that are hard to use on phones rank lower and lose customers: people leave a page they have to pinch and zoom.",
      },
      {
        id: "a-wd-mobile-first",
        title: "Mobile-first design",
        explain:
          "Mobile first means writing the CSS for the smallest screen first, as the default, then adding media queries with min-width that rearrange things as space grows. Small-screen layouts are usually simpler (one column, normal flow), so the default CSS stays short, and phones, often on slower connections, are not made to download and then undo desktop rules. It also forces the right priority: what matters most when there is room for almost nothing?",
        example:
          "/* Default: phones. One column. */\n.services { display: grid; grid-template-columns: 1fr; }\n\n/* From 768px up: three columns. */\n@media (min-width: 768px) {\n  .services { grid-template-columns: repeat(3, 1fr); }\n}",
        webLab: {
          task:
            "This stylesheet was written desktop-first: three columns everywhere, so on a phone each service is a narrow strip. Rewrite it mobile first: one column by default, and a min-width media query at 768px that switches to three columns.",
          files: { "index.html": MF_HTML, "style.css": MF_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "On a phone, the services stack in one column", viewport: "mobile", check: "const s = $$('.service').map((x) => rect(x)); return s[1].top >= s[0].bottom && Math.abs(s[0].left - s[1].left) < 1;", fail: "The default (no media query) layout should be one column: grid-template-columns: 1fr." },
            { label: "On a laptop, they sit in three columns", check: "const s = $$('.service').map((x) => rect(x)); return s.every((r) => Math.abs(r.top - s[0].top) < 1) && s[2].left > s[1].left;", fail: "Add @media (min-width: 768px) { .services { grid-template-columns: repeat(3, 1fr); } }" },
            { label: "On a tablet (768px), they are already three columns", viewport: "tablet", check: "const s = $$('.service').map((x) => rect(x)); return Math.abs(s[0].top - s[2].top) < 1;", fail: "The breakpoint should be min-width: 768px." },
            { label: "The layout change uses a min-width media query (mobile first)", check: "return media().some((m) => /min-width/.test(m)) && !media().some((m) => /max-width/.test(m));", fail: "Use @media (min-width: …), adding layout as the screen grows, not max-width." },
          ],
          solution: { "style.css": MF_CSS_DONE },
          hint: "Change the default grid-template-columns to 1fr, then put the three-column version inside the media query.",
          successMessage: "Switch the preview between Phone, Tablet and Laptop. The default is the phone layout, and the media query only adds to it.",
        },
      },
      {
        id: "a-wd-responsive-adaptive",
        title: "Responsive versus adaptive layouts",
        explain:
          "An adaptive layout snaps between a few fixed designs, say exactly 375px, 768px and 1280px wide, and looks awkward at sizes in between. A responsive layout is fluid: it stretches smoothly between breakpoints and only rearranges where the content needs it. Devices come in hundreds of widths, from 320px phones to folding phones to 4K monitors, so the web uses responsive design, with fluid sizing between a few content-based breakpoints.",
        decision: {
          scenario: "A designer hands you three mockups: phone at 375px, tablet at 768px and desktop at 1440px. A client then opens the site on a 1024px tablet in landscape.",
          question: "What should the site do at 1024px?",
          options: [
            { id: "a", text: "Stretch fluidly from the tablet layout, so 1024px looks intentional even though no mockup shows it", why: "The mockups are reference points, not the only sizes that exist. Fluid widths and max-width make every in-between size work." },
            { id: "b", text: "Show the 768px layout centred with empty space on each side", whyWrong: "That is an adaptive snap: it wastes the space and looks unfinished." },
            { id: "c", text: "Show the 1440px layout and let it scroll sideways", whyWrong: "A sideways scrollbar is the clearest sign of a broken responsive layout." },
            { id: "d", text: "Ask the designer for a 1024px mockup, and one for every other width", whyWrong: "There are hundreds of widths. Fluid CSS handles them, not more mockups." },
          ],
          correct: "a",
          aftermath: "Build fluid by default; add a breakpoint only where the layout actually starts to look wrong.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 10.4 – 10.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l39-media-queries",
    moduleId: "wd-m10-responsive",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5", "10.6"],
    title: "Media Queries, Breakpoints and Containers",
    subtitle: "CSS that applies at certain widths, chosen by the content, inside a fluid container",
    estimatedMinutes: 22,
    intro:
      "Media queries are the switch in responsive design, and breakpoints are where you flip it. The skill is not the syntax, which is short, but choosing the right places, and building containers that stay fluid in between.",

    atoms: [
      {
        id: "a-wd-media-queries",
        title: "Media queries",
        explain:
          "A media query wraps CSS that applies only when a condition is true: @media (min-width: 768px) { … } applies from 768px wide upwards; (max-width: 767px) up to 767px. Conditions can be combined with and, and can test other features: (orientation: landscape), (hover: hover) for devices with a real pointer, (prefers-color-scheme: dark) and (prefers-reduced-motion: reduce), which you will use in Module 11. Rules inside a media query follow the normal cascade, so put media queries after the rules they change.",
        table: {
          caption: "Common media queries.",
          headers: ["Query", "Applies when"],
          rows: [
            ["@media (min-width: 768px)", "The viewport is 768px wide or more"],
            ["@media (max-width: 767px)", "The viewport is 767px wide or less"],
            ["@media (min-width: 600px) and (max-width: 1023px)", "Between the two"],
            ["@media (hover: hover)", "The device has a real hover, such as a mouse"],
            ["@media (orientation: landscape)", "The viewport is wider than it is tall"],
          ],
        },
        mistake: "Forgetting the viewport meta tag. Without it, a phone reports a width of 980px, so min-width: 768px is always true and your phone layout never appears.",
      },
      {
        id: "a-wd-content-breakpoints",
        title: "Choosing breakpoints based on content",
        explain:
          "Do not choose breakpoints from a list of popular devices; devices change every year. Start with the phone layout, slowly widen the browser (or drag the device toolbar), and add a breakpoint at the width where the layout starts to look wrong: lines too long to read, cards too wide, empty space where a second column would fit. Most sites need only two or three. Use em or px consistently, and name them in a comment.",
        decision: {
          scenario: "Widening your phone layout, you notice that at about 600px the header has plenty of room for the logo and the links side by side, but they are still stacked.",
          question: "Where should the breakpoint for the header go?",
          options: [
            { id: "a", text: "At about 600px, where the content shows it is needed", why: "The content tells you: from 600px there is room. A device list would have put it at 768px and wasted the space on large phones and small tablets." },
            { id: "b", text: "At 768px, because that is the iPad's width", whyWrong: "The header had room long before that. Device widths are arbitrary for your content." },
            { id: "c", text: "At 1920px, to be safe", whyWrong: "Almost nobody would ever see the side-by-side header." },
            { id: "d", text: "No breakpoint; stacked is fine everywhere", whyWrong: "Stacking wastes a whole row on wide screens; the content asks for a change." },
          ],
          correct: "a",
          aftermath: "Breakpoints belong to components, not devices: the header can switch at 600px while the card grid switches at 900px.",
        },
      },
      {
        id: "a-wd-fluid-containers",
        title: "Flexible widths and containers",
        explain:
          "A container is a wrapper that keeps content at a readable width and centred: width: 100% so it fills small screens, max-width so it stops growing on large ones, auto inline margins to centre it, and inline padding so text never touches the screen edge on a phone. Inside, use percentages, fr and flex rather than fixed pixel widths. margin-inline and padding-inline set left and right together.",
        example:
          ".container {\n  width: 100%;\n  max-width: 1100px;\n  margin-inline: auto;     /* centred */\n  padding-inline: 16px;    /* breathing room on phones */\n}",
        webLab: {
          task:
            "Fix this gym site. (1) The container is a fixed 1100px, so phones scroll sideways: make it fluid, 100% wide with a max-width of 1100px, centred, with 16px inline padding. (2) Mobile first, the header stacks; at a breakpoint of 600px (where the content needs it), make .header-inner a flex row with the logo left and nav right, and the nav links a row with a gap.",
          files: { "index.html": BP_HTML, "style.css": BP_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "On a phone, nothing scrolls sideways", viewport: "mobile", check: "return !overflowX();", fail: "The 1100px container is wider than the phone. Use width: 100% and max-width: 1100px." },
            { label: "On a phone, text keeps 16px from the screen edge", viewport: "mobile", check: "return Math.round(rect('main h1').left) === 16;", fail: "Give .container padding-inline: 16px." },
            { label: "On a laptop, the container is 1100px wide and centred", check: "const r = rect('main.container'); return Math.round(r.width) === 1100 && Math.abs(r.left - (width() - r.right)) < 2;", fail: ".container { max-width: 1100px; margin-inline: auto; }" },
            { label: "On a phone, the nav stacks below the logo", viewport: "mobile", check: "return rect('.site-header nav').top >= rect('.logo').bottom - 1;", fail: "Keep the default (phone) header stacked: no flex outside the media query." },
            { label: "On a tablet, logo and nav share one row, with the links in a row", viewport: "tablet", check: "const l = rect('.logo'), n = rect('.site-header nav'); const li = $$('.nav-list li').map((x) => rect(x)); return Math.abs((l.top + l.height / 2) - (n.top + n.height / 2)) < 4 && n.left > l.right && li.every((r) => Math.abs(r.top - li[0].top) < 2);", fail: "In @media (min-width: 600px), make .header-inner and .nav-list flex rows." },
            { label: "The breakpoint is a min-width query around 600px", check: "return media().some((m) => /min-width:\\s*(600px|37\\.5em)/.test(m));", fail: "Use @media (min-width: 600px)." },
          ],
          solution: { "style.css": BP_CSS_DONE },
          hint: "Container first: width, max-width, margin-inline, padding-inline. Then everything layout-related for the header goes inside the media query.",
          successMessage: "Drag between Phone, Tablet and Laptop: the content keeps its distance from the edges, stops growing at 1100px, and the header rearranges exactly where it has room to.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 10.7 – 10.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l40-fluid-type-images",
    moduleId: "wd-m10-responsive",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.7", "10.8", "10.9", "10.10"],
    title: "Responsive Typography and Images",
    subtitle: "Text that scales smoothly with clamp(), and images that never overflow",
    estimatedMinutes: 22,
    intro:
      "A 56px heading is striking on a laptop and absurd on a phone, where it breaks into one word per line. A 1600px photo is perfect on a large monitor and breaks the layout of a phone. This lesson makes both behave at every width.",

    atoms: [
      {
        id: "a-wd-responsive-type",
        title: "Responsive typography",
        explain:
          "Body text stays about 1rem on every screen: phones are held closer to the eyes. Headings should scale: big on wide screens, smaller on phones, so long words do not overflow and a title does not fill the whole screen. One way is to set a smaller size by default and a larger one in a media query. The modern way is fluid type, which grows smoothly with the viewport.",
        example:
          "h1 { font-size: 2rem; }                      /* phones */\n@media (min-width: 768px) {\n  h1 { font-size: 3rem; }                    /* jumps at 768px */\n}",
      },
      {
        id: "a-wd-clamp",
        title: "Fluid sizing with clamp()",
        explain:
          "clamp(minimum, preferred, maximum) returns the preferred value, kept between the minimum and the maximum. With a preferred value that mixes rem and vw, such as clamp(2rem, 1.2rem + 3.5vw, 3.5rem), a heading grows smoothly with the screen but never below 32px or above 56px. Including a rem part in the middle value keeps the text responsive to the visitor's zoom setting; pure vw does not.",
        example:
          "h1 { font-size: clamp(2rem, 1.2rem + 3.5vw, 3.5rem); }\n\nAt 375px:   1.2rem + 3.5vw = 19.2 + 13.1 = 32.3px → about 32px (the minimum)\nAt 768px:   19.2 + 26.9 = 46.1px\nAt 1280px:  19.2 + 44.8 = 64px → capped at 56px (the maximum)",
      },
      {
        id: "a-wd-responsive-images",
        title: "Responsive images with max-width",
        explain:
          "An image is as wide as its file by default: a 1600px photo is 1600px wide even on a 375px phone, which forces sideways scrolling. max-width: 100% lets it shrink to fit its container but never stretch beyond its real size, and height: auto keeps its proportions, even when width and height attributes are set in the HTML. Put it, with display: block, in the base of every stylesheet.",
        example: "img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}",
      },
      {
        id: "a-wd-object-fit",
        title: "Image cropping with object-fit",
        explain:
          "Sometimes images of different shapes must fill identical boxes, such as square thumbnails or same-height card images. Setting both width and height would squash them. object-fit: cover keeps the image's proportions and crops whatever does not fit, like a photo in a frame; object-fit: contain fits the whole image inside, leaving bars. object-position chooses which part to keep. aspect-ratio: 1 (Module 11) gives a box a shape without a fixed height.",
        webLab: {
          task:
            "Make this article work on every screen. (1) The 56px heading is too big on phones: make it fluid with clamp() so it is about 32px on a phone and 56px on a laptop. (2) The hero photo makes the phone scroll sideways: make all images shrink to fit with max-width: 100% and height: auto. (3) Make the three thumbnails identical squares that are cropped, not squashed, using aspect-ratio: 1 and object-fit: cover.",
          files: { "index.html": FLUID_HTML, "style.css": FLUID_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The heading uses clamp()", check: "return rules('h1').some((r) => /clamp\\(/.test(r.style.fontSize));", fail: "Set h1's font-size with clamp(min, preferred, max)." },
            { label: "On a phone the heading is between 28px and 36px", viewport: "mobile", check: "const f = px(style('h1', 'font-size')); return f >= 28 && f <= 36;", fail: "The minimum in clamp() should be about 2rem (32px)." },
            { label: "On a laptop the heading is between 50px and 60px", check: "const f = px(style('h1', 'font-size')); return f >= 50 && f <= 60;", fail: "The maximum in clamp() should be about 3.5rem (56px), and the middle value must grow with vw." },
            { label: "On a phone the hero photo fits and nothing scrolls sideways", viewport: "mobile", check: "return rect('.hero-img').width <= 375 - 32 + 1 && !overflowX();", fail: "img { max-width: 100%; height: auto; }" },
            { label: "The hero keeps its proportions (16:9)", viewport: "mobile", check: "const r = rect('.hero-img'); return Math.abs(r.width / r.height - 16 / 9) < 0.02;", fail: "Add height: auto so the image is not stretched by its height attribute." },
            { label: "Thumbnails are equal squares, cropped with object-fit: cover", check: "const t = $$('.thumbs img').map((i) => rect(i)); return t.every((r) => Math.abs(r.width - r.height) < 1.5 && Math.abs(r.width - t[0].width) < 1) && $$('.thumbs img').every((i) => style(i, 'object-fit') === 'cover');", fail: ".thumbs img { width: 100%; aspect-ratio: 1; object-fit: cover; }" },
          ],
          solution: { "style.css": FLUID_CSS_DONE },
          hint: "Try clamp(2rem, 1.2rem + 3.5vw, 3.5rem). A general img rule fixes the hero; a more specific .thumbs img rule crops the thumbnails.",
          successMessage: "Watch the heading shrink as you switch to Phone, and the photo with it. The thumbnails are three different shapes in the HTML and three identical squares on the page.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 10.11 – 10.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l41-responsive-nav",
    moduleId: "wd-m10-responsive",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.11", "10.12"],
    title: "Responsive Navigation and Mobile Menus",
    subtitle: "A navigation bar that becomes a menu button on phones, and stays accessible",
    estimatedMinutes: 22,
    intro:
      "Five links fit in a laptop's header and do not fit on a phone. The standard answer, a menu button that reveals the links, is everywhere, and it is often built in a way that keyboard and screen-reader users cannot open. Yours will work for everyone.",

    atoms: [
      {
        id: "a-wd-responsive-navbar",
        title: "Responsive navigation bars",
        explain:
          "There are three common patterns. With few links, let them wrap or scroll horizontally and keep them visible. With more, collapse them behind a menu button on small screens. On wide screens, show them in a row. Whatever the pattern, links must be at least 44px tap targets on touch screens, and the current page should be marked with aria-current.",
        table: {
          caption: "Patterns for small screens.",
          headers: ["Pattern", "Good when"],
          rows: [
            ["Links wrap onto two rows", "Three or four short links"],
            ["Links scroll horizontally", "Many categories, such as a news site's sections"],
            ["A menu button that reveals the links", "Five or more links, or long labels"],
            ["A bottom tab bar", "App-like sites with four or five main sections"],
          ],
        },
      },
      {
        id: "a-wd-hamburger",
        title: "Hamburger menus and mobile navigation",
        explain:
          "A menu toggle must be a real <button>, labelled (the word Menu is clearer than a ☰ icon alone), with aria-expanded saying whether the menu is open and aria-controls pointing at the nav's id. A few lines of JavaScript toggle a class and aria-expanded (you will write this yourself in Module 21; it is given here). The CSS does the rest: on phones the nav is hidden until it has the open class; from the breakpoint up, the button is hidden and the links are always shown in a row.",
        example:
          "<button class=\"menu-toggle\" aria-expanded=\"false\" aria-controls=\"site-nav\">Menu</button>\n<nav id=\"site-nav\" class=\"site-nav\"> … </nav>\n\n.site-nav { display: none; }              /* phones: hidden */\n.site-nav.is-open { display: block; }     /* until opened */\n@media (min-width: 768px) {\n  .menu-toggle { display: none; }\n  .site-nav { display: block; }\n}",
        mistake: "Hiding the menu with opacity: 0 or by moving it off screen. It is still there for keyboard users, who tab through invisible links. display: none (or the hidden attribute) removes it properly.",
        webLab: {
          task:
            "Write the CSS for the cake shop's responsive navigation; app.js is given and toggles the is-open class. On phones: the nav is hidden until it has is-open, the Menu button is shown and at least 44px tall, and an open menu fills the width with links stacked. From 768px: the button is hidden and the links are always visible in a row.",
          files: { "index.html": NAV_HTML, "style.css": NAV_CSS, "app.js": NAV_JS },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "On a phone, the links are hidden at first and the Menu button is visible", viewport: "mobile", check: "return !visible('#site-nav') && visible('.menu-toggle');", fail: "On phones (the default), .site-nav needs display: none until it has .is-open." },
            { label: "The Menu button is at least 44px tall", viewport: "mobile", check: "return rect('.menu-toggle').height >= 44;", fail: "Give .menu-toggle min-height: 44px." },
            { label: "On a phone, pressing Menu shows the links, stacked, and sets aria-expanded", viewport: "mobile", check: "await click('.menu-toggle'); const li = $$('#site-nav li').map((x) => rect(x)); return visible('#site-nav') && $('.menu-toggle').getAttribute('aria-expanded') === 'true' && li[1].top >= li[0].bottom - 1;", fail: "Add .site-nav.is-open { display: block; } and keep the links stacked on phones." },
            { label: "Pressing Menu again hides them", viewport: "mobile", check: "await click('.menu-toggle'); return !visible('#site-nav') && $('.menu-toggle').getAttribute('aria-expanded') === 'false';", fail: "When is-open is removed, the nav must be hidden again." },
            { label: "On a laptop, the button is hidden and the links are visible in a row", check: "const li = $$('#site-nav li').map((x) => rect(x)); return !visible('.menu-toggle') && visible('#site-nav') && li.every((r) => Math.abs(r.top - li[0].top) < 2) && li[1].left > li[0].right;", fail: "In @media (min-width: 768px): hide .menu-toggle, show .site-nav and make its ul a flex row." },
            { label: "No sideways scrolling at any width", viewport: "mobile", check: "await click('.menu-toggle'); return !overflowX();", fail: "Something is wider than the phone when the menu is open." },
          ],
          solution: { "style.css": NAV_CSS_DONE },
          hint: "Write the phone rules first, outside any media query. Then one media query undoes the hiding and arranges the row.",
          successMessage: "Open the menu on the Phone preview, then switch to Laptop. One HTML nav, two layouts, and a button that tells screen readers whether the menu is open.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 10.13 – 10.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l42-responsive-components",
    moduleId: "wd-m10-responsive",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.13", "10.14", "10.15", "10.16"],
    title: "Responsive Components, Overflow and Testing",
    subtitle: "Cards, tables and forms on small screens, stopping sideways scroll, and testing properly",
    estimatedMinutes: 25,
    intro:
      "A page can have a responsive layout and still break on a phone because one component does not adapt: a wide table, a fixed-width input, a long URL. This lesson finds and fixes those, and shows how to test so you catch them before your visitors do.",

    atoms: [
      {
        id: "a-wd-responsive-components",
        title: "Responsive cards, tables and forms",
        explain:
          "Cards: let a grid decide how many fit, with repeat(auto-fit, minmax(240px, 1fr)), so they reflow from one column to four with no media query. Tables: wrap them in a container with overflow-x: auto so the table scrolls inside its box, or, for simple tables, restack each row as a block on phones. Forms: make inputs width: 100% with a max-width, put labels above inputs on phones, and make buttons full width where they are the main action.",
        example:
          ".cards { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }\n\n<div class=\"table-wrap\"><table>…</table></div>\n.table-wrap { overflow-x: auto; }\n\ninput, select, textarea { width: 100%; max-width: 420px; }",
      },
      {
        id: "a-wd-prevent-overflow",
        title: "Preventing horizontal overflow",
        explain:
          "A page that scrolls sideways on a phone has one or more elements wider than the screen. The usual culprits: fixed widths (width: 500px), images without max-width, long words and URLs that cannot wrap, wide tables, and negative margins or 100vw widths that ignore scrollbars. Find the culprit in devtools (set the width to 320px and look for what sticks out, or temporarily outline everything), then fix the cause: max-width instead of width, overflow-wrap: anywhere for long strings, a scrolling wrapper for tables. Never hide the symptom with overflow-x: hidden on body: that cuts off content people need.",
        decision: {
          scenario: "Your page scrolls sideways on a 360px phone. A colleague suggests adding body { overflow-x: hidden; }.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Find the element that is too wide and fix its width instead; hiding overflow just cuts off part of the page", why: "The scrollbar is a symptom. Something is wider than the screen, and with overflow hidden, part of it, perhaps a button, becomes unreachable." },
            { id: "b", text: "Agree: it removes the scrollbar", whyWrong: "It removes the scrollbar and leaves the content cut off." },
            { id: "c", text: "Make the whole page 360px wide", whyWrong: "Then it is broken on every other width." },
            { id: "d", text: "Add a note asking visitors to rotate their phones", whyWrong: "Visitors leave; they do not follow instructions to fix your layout." },
          ],
          correct: "a",
          aftermath: "In devtools, Elements panel, hover elements at 320px wide: the one that sticks out past the edge is your culprit.",
        },
      },
      {
        id: "a-wd-viewport-testing",
        title: "Testing different viewport sizes",
        explain:
          "Test continuously, not at the end. Use the device toolbar to try 320px (the smallest common phone), 375px, 768px, 1024px and 1280px, and drag the width slowly between them, watching for the moment anything breaks. Then test on at least one real phone: touch, real fonts, the on-screen keyboard covering fields and slow networks are things a desktop simulation misses. Rotate it to landscape too.",
        table: {
          caption: "A minimum test plan.",
          headers: ["Width", "Represents", "Look for"],
          rows: [
            ["320px", "Small Android phones", "Sideways scroll, words overflowing, cramped buttons"],
            ["375–414px", "Most phones", "Readable text, 44px tap targets, menu works"],
            ["768px", "Tablets in portrait", "The first breakpoint looks intentional"],
            ["1024–1280px", "Laptops", "Line length, use of space"],
            ["1440px+", "Large monitors", "Content capped by max-width, not stretched"],
          ],
        },
      },
      {
        id: "a-wd-pixel-ratio",
        title: "Understanding device pixel ratios",
        explain:
          "CSS pixels are not screen pixels. A phone 375 CSS pixels wide may have 1125 physical pixels: a device pixel ratio (DPR) of 3. Text and CSS shapes stay sharp automatically, but a 400px-wide photo shown 400 CSS pixels wide looks blurry on a 2x or 3x screen. srcset lets the browser choose: srcset=\"logo.png 1x, logo@2x.png 2x\" for fixed-size images, or width descriptors with sizes for fluid ones (Module 30). SVG images, which are drawn from shapes, are sharp at any ratio.",
        webLab: {
          task:
            "Fix every cause of sideways scrolling on this results page at phone width, without hiding overflow on the body: (1) let the long URL wrap with overflow-wrap; (2) give the banner a max-width instead of a fixed width; (3) let the wide table scroll inside its wrapper; (4) make the search input fluid with width: 100% and a max-width. Finally, in the HTML, add a 2x candidate to the logo's srcset for high-density screens.",
          files: { "index.html": COMP_HTML, "style.css": COMP_CSS },
          tests: [
            { label: "On a 375px phone, the page does not scroll sideways", viewport: "mobile", check: "return !overflowX();", fail: "Something is still wider than the phone. Check the URL, the banner, the table and the input." },
            { label: "Overflow is not simply hidden on the page", viewport: "mobile", check: "return style('body', 'overflow-x') !== 'hidden' && style('html', 'overflow-x') !== 'hidden';", fail: "Do not use overflow-x: hidden on body or html; fix each wide element instead." },
            { label: "The long URL wraps inside the page", viewport: "mobile", check: "return rect('.notice').right <= 375 && ['anywhere', 'break-word'].includes(style('.notice', 'overflow-wrap'));", fail: ".notice { overflow-wrap: anywhere; }" },
            { label: "The banner fits the phone and is still 500px on a laptop", viewport: "mobile", check: "return rect('.banner').right <= 375 - 15;", fail: "Change the banner's width: 500px to max-width: 500px." },
            { label: "The table scrolls inside its wrapper", viewport: "mobile", check: "const w = $('.table-wrap'); return ['auto', 'scroll'].includes(style(w, 'overflow-x')) && w.scrollWidth > w.clientWidth;", fail: ".table-wrap { overflow-x: auto; }" },
            { label: "The search input fits the phone", viewport: "mobile", check: "return rect('.search input').right <= 375 - 15;", fail: ".search input { width: 100%; max-width: 420px; }" },
            { label: "The logo offers a 2x image for high-density screens", check: "return /\\s2x/.test($('img').getAttribute('srcset') || '');", fail: "Add a second candidate: srcset=\"images/logo.svg 1x, images/logo.svg 2x\" (on a real site, the 2x file would be a larger version)." },
            { label: "The banner is still 500px wide on a laptop", check: "return Math.round(rect('.banner').width) === 500;", fail: "Use max-width: 500px so the banner is 500px when there is room." },
          ],
          solution: { "style.css": COMP_CSS_DONE, "index.html": COMP_HTML_DONE },
          hint: "Each culprit needs its own fix: overflow-wrap for the text, max-width for the banner and input, overflow-x on the table's wrapper.",
          successMessage: "Four separate causes of sideways scrolling, each fixed at its source. This is the most common responsive bug there is, and you can now find and fix it.",
        },
      },
    ],

    task: {
      title: "Module project: make your layout fully responsive",
      intro: "Take the product page from the Module 9 project and make it work from 320px to 1440px.",
      prompts: [
        "Rewrite the CSS mobile first, with no more than three breakpoints, each chosen by widening the browser until something looks wrong.",
        "Use a fluid container, clamp() for headings, and max-width on every image.",
        "Collapse the navigation behind an accessible Menu button below your first breakpoint.",
        "Make the product grid reflow with repeat(auto-fit, minmax(…, 1fr)) and wrap any table in a scrolling container.",
        "Test at 320, 375, 768, 1024 and 1440px and on a real phone; confirm there is no sideways scrolling at any width.",
      ],
      closing: "This is the core skill of the course. Phase 2's assessment gate checks it at three widths.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
