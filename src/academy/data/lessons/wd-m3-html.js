/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 3 · HTML FUNDAMENTALS
 *
 * Curriculum 3.1 – 3.12. What HTML is, the document skeleton, the anatomy of
 * an element, headings and text, links and URLs, images and alternative text,
 * lists, nesting, entities and clean markup. Every lesson ends in a lab whose
 * checks inspect the page the browser actually built.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s3-html";

const SKELETON = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chidi's Barbershop</title>
</head>
<body>
  <h1>Chidi's Barbershop</h1>
  <p>Sharp cuts in Surulere since 2015.</p>
</body>
</html>
`;

const ARTICLE_START = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Saving on a student budget</title>
</head>
<body>
  <p>Saving on a student budget</p>

  <p>Why saving matters</p>
  <p>Even small amounts add up. Saving 500 naira a week is 26,000 naira a year.</p>

  <p>Three habits that work</p>
  <p>Cook in bulk on Sundays. Share transport with friends. Never buy data bundles on impulse.</p>

  <p>Important: start this week, not next term.</p>
</body>
</html>
`;

const ARTICLE_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Saving on a student budget</title>
</head>
<body>
  <h1>Saving on a student budget</h1>

  <h2>Why saving matters</h2>
  <p>Even small amounts add up. Saving 500 naira a week is 26,000 naira a year.</p>

  <h2>Three habits that work</h2>
  <p>Cook in bulk on Sundays. Share transport with friends. <em>Never</em> buy data bundles on impulse.</p>

  <p><strong>Important:</strong> start this week, not next term.</p>
</body>
</html>
`;

const LINKS_INDEX = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Green Leaf Farms</title>
</head>
<body>
  <h1>Green Leaf Farms</h1>
  <p>Fresh vegetables from Ogun State, delivered every Saturday.</p>

  <!-- 1. A link to the About page (about.html) -->

  <!-- 2. The farm photo: images/hero.jpg -->

  <!-- 3. A link to https://www.fao.org that opens in a new tab -->

  <!-- 4. A link that jumps to the contact section below -->

  <h2 id="contact">Contact us</h2>
  <p>Call 0803 000 0000.</p>
</body>
</html>
`;

const LINKS_ABOUT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About Green Leaf Farms</title>
</head>
<body>
  <h1>About us</h1>
  <p>A family farm, growing since 1998.</p>
  <a href="index.html">Back to the homepage</a>
</body>
</html>
`;

const LINKS_DONE = LINKS_INDEX.replace(
  "  <!-- 1. A link to the About page (about.html) -->",
  '  <a href="about.html">About the farm</a>'
)
  .replace(
    "  <!-- 2. The farm photo: images/hero.jpg -->",
    '  <img src="images/hero.jpg" alt="Rows of green vegetables growing on the farm at sunrise" width="800" height="450">'
  )
  .replace(
    "  <!-- 3. A link to https://www.fao.org that opens in a new tab -->",
    '  <p>Learn about farming at the <a href="https://www.fao.org" target="_blank" rel="noopener">Food and Agriculture Organization</a>.</p>'
  )
  .replace("  <!-- 4. A link that jumps to the contact section below -->", '  <a href="#contact">Contact us</a>');

const RECIPE_START = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jollof rice</title>
</head>
<body>
  <h1>Party jollof rice</h1>

  <h2>Ingredients</h2>
  <p>4 cups of rice, 6 tomatoes, 3 red peppers, 2 onions, stock, oil</p>

  <h2>Method</h2>
  <p>Blend the tomatoes, peppers and one onion. Fry the paste in oil for 20 minutes. Add the stock and the rice, cover and cook on low heat.</p>

  <h2>For the web page</h2>
  <p>To show a paragraph tag as text, this page must display: <code>TYPE IT HERE</code></p>

  <footer>
    <p>Copyright 2026 Mama Ngozi's Kitchen</p>
  </footer>
</body>
</html>
`;

const RECIPE_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jollof rice</title>
</head>
<body>
  <h1>Party jollof rice</h1>

  <h2>Ingredients</h2>
  <ul>
    <li>4 cups of rice</li>
    <li>6 tomatoes</li>
    <li>3 red peppers</li>
    <li>2 onions</li>
    <li>Stock and oil</li>
  </ul>

  <h2>Method</h2>
  <ol>
    <li>Make the paste:
      <ul>
        <li>Blend the tomatoes</li>
        <li>Blend the peppers and one onion</li>
      </ul>
    </li>
    <li>Fry the paste in oil for 20 minutes.</li>
    <li>Add the stock and the rice, cover and cook on low heat.</li>
  </ol>

  <!-- Show the tag as text, not as a real paragraph -->
  <h2>For the web page</h2>
  <p>To show a paragraph tag as text, this page must display: <code>&lt;p&gt;</code></p>

  <footer>
    <p>&copy; 2026 Mama Ngozi's Kitchen</p>
  </footer>
</body>
</html>
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.1 – 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l9-html-structure",
    moduleId: "wd-m3-html",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3"],
    title: "What HTML Is and How a Document Is Built",
    subtitle: "The skeleton every page shares, and the anatomy of an element",
    estimatedMinutes: 18,
    intro:
      "HTML is the foundation of every web page. Before you style anything, you need a correctly built document, because browsers, search engines and screen readers all read its structure, and a missing line at the top can quietly change how the whole page behaves.",

    atoms: [
      {
        id: "a-wd-what-is-html",
        title: "What HTML is and what it does",
        explain:
          "HTML (HyperText Markup Language) is not a programming language: it does not calculate or decide anything. It is a markup language: you wrap pieces of content in tags that say what each piece IS. This is a heading, this is a paragraph, this is a link, this is an image. The browser uses that meaning to display the content, search engines use it to understand the page, and screen readers use it to read the page aloud to blind users.",
        example:
          "Plain text says nothing about itself:\n\n  Chidi's Barbershop  Sharp cuts since 2015\n\nMarked up, every part has a meaning:\n\n  <h1>Chidi's Barbershop</h1>          ← the page's main heading\n  <p>Sharp cuts since 2015</p>         ← a paragraph",
        why: "\"Hyper text\" means text with links to other text, which is the whole idea of the web. Getting meaning right in HTML is what makes a page work for everyone, not only for people looking at a screen.",
      },
      {
        id: "a-wd-document-structure",
        title: "HTML document structure",
        explain:
          "Every page starts with the same skeleton. <!DOCTYPE html> tells the browser to use modern standards mode. <html lang=\"en\"> wraps everything and says what language the page is in. The <head> holds information ABOUT the page: the character set, the viewport setting phones need, and the title shown on the browser tab. The <body> holds everything the visitor sees.",
        webDemo: {
          caption: "The skeleton, with something in the body. Change the title in <title> and the heading in <h1>: one appears in the page, the other would appear on the browser tab.",
          files: { "index.html": SKELETON },
        },
        table: {
          caption: "Each line of the skeleton, and why it is there.",
          headers: ["Line", "Purpose"],
          rows: [
            ["<!DOCTYPE html>", "Standards mode. Without it browsers fall back to \"quirks mode\" and lay out pages like it is 1999"],
            ["<html lang=\"en\">", "The root element; lang lets screen readers pronounce it correctly and browsers offer translation"],
            ["<meta charset=\"UTF-8\">", "Text encoding, so ₦, é and emoji display correctly"],
            ["<meta name=\"viewport\" …>", "Tells phones to use their real width instead of pretending to be a desktop"],
            ["<title>…</title>", "The tab title, bookmark name and search-result headline"],
            ["<body>…</body>", "Everything visible on the page"],
          ],
        },
        mistake:
          "Leaving out the viewport meta tag. Without it a phone renders the page as if it were 980 pixels wide and shrinks it, so text is tiny and nothing responsive in Phase 2 will work.",
      },
      {
        id: "a-wd-element-anatomy",
        title: "Elements, tags, attributes and content",
        explain:
          "An element is usually an opening tag, some content and a closing tag. The opening tag can carry attributes: extra information written as name=\"value\". A few elements are void (empty): they have no content and no closing tag, such as <img>, <br> and <meta>.",
        table: {
          caption: "The parts of <a href=\"about.html\" title=\"Our story\">About us</a>",
          headers: ["Part", "Here", "Meaning"],
          rows: [
            ["Opening tag", "<a …>", "Starts the element; a means anchor (link)"],
            ["Attribute", "href=\"about.html\"", "Where the link goes"],
            ["Attribute", "title=\"Our story\"", "Extra advisory text shown on hover"],
            ["Content", "About us", "What the visitor sees and clicks"],
            ["Closing tag", "</a>", "Ends the element; note the slash"],
            ["Void element", "<img src=\"a.jpg\" alt=\"…\">", "No content, no closing tag"],
          ],
        },
        webLab: {
          task:
            "This page has content but no document structure, so the browser is in quirks mode and a phone would shrink it. Turn it into a complete HTML document: add the doctype, an html element with lang=\"en\", a head containing the charset and viewport meta tags and a title, and put the existing content inside the body.",
          files: {
            "index.html": `<h1>Chidi's Barbershop</h1>
<p>Sharp cuts in Surulere since 2015.</p>
`,
          },
          tests: [
            {
              label: "The document starts with <!DOCTYPE html> (standards mode)",
              check: "return document.compatMode === 'CSS1Compat' && document.doctype?.name === 'html';",
              fail: "The browser is still in quirks mode. The very first line must be <!DOCTYPE html>.",
            },
            {
              label: "The html element says the page is in English: lang=\"en\"",
              check: "return document.documentElement.getAttribute('lang') === 'en';",
              fail: "Add lang=\"en\" to the opening <html> tag.",
            },
            {
              label: "The head declares the UTF-8 character set",
              check: "return /utf-8/i.test(document.characterSet) && !!$('head meta[charset]');",
              fail: "Add <meta charset=\"UTF-8\"> inside the head.",
            },
            {
              label: "The head has the viewport meta tag phones need",
              check: "const m = $('head meta[name=viewport]'); return !!m && /width=device-width/.test(m.content);",
              fail: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> inside the head.",
            },
            {
              label: "The page has a title",
              check: "return document.title.trim().length > 0;",
              fail: "Add a <title> inside the head, for example <title>Chidi's Barbershop</title>.",
            },
            {
              label: "The heading and paragraph are inside the body",
              check: "return !!$('body > h1') && !!$('body > p');",
              fail: "Keep the h1 and p between <body> and </body>.",
            },
          ],
          solution: { "index.html": SKELETON },
          hint: "The order is: doctype, then <html lang=\"en\">, then <head> with the meta tags and title, </head>, <body> with the content, </body>, </html>.",
          successMessage:
            "That skeleton is the start of every page you will build. In VS Code, typing ! and pressing Tab in an empty .html file writes most of it for you.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.4 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l10-headings-text",
    moduleId: "wd-m3-html",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.4", "3.5"],
    title: "Headings, Paragraphs and Emphasis",
    subtitle: "The outline of a page, and words that carry weight",
    estimatedMinutes: 16,
    intro:
      "People scan web pages, they do not read them line by line. Headings are how they scan, and screen-reader users jump from heading to heading in exactly the same way. Getting headings and emphasis right is one of the highest-value habits in HTML.",

    atoms: [
      {
        id: "a-wd-headings-paragraphs",
        title: "Headings and paragraphs",
        explain:
          "HTML has six heading levels, <h1> to <h6>. They form an outline, like the chapters and sections of a report: one <h1> for the page's main topic, <h2> for its main sections, <h3> for subsections inside an <h2>, and so on, without skipping levels on the way down. Choose a heading by its place in the outline, never by how big you want the text; size is CSS's job. Ordinary text goes in <p> paragraphs.",
        example:
          "<h1>Saving on a student budget</h1>          ← the page's topic\n  <h2>Why saving matters</h2>               ← a section\n  <h2>Three habits that work</h2>           ← another section\n    <h3>Cook in bulk</h3>                   ← inside \"Three habits\"\n    <h3>Share transport</h3>",
        mistake:
          "Using <h4> for a section heading because <h2> \"looks too big\", or a bold <p> as a heading. Screen-reader users who list the headings on the page will not find that section, and search engines lose the outline. Style the size with CSS instead.",
      },
      {
        id: "a-wd-text-emphasis",
        title: "Text formatting and emphasis",
        explain:
          "A few elements give text meaning inside a paragraph. <strong> marks strong importance (shown bold); <em> marks stress emphasis, the word you would say louder (shown italic). Screen readers can announce both. <b> and <i> are only visual (bold and italic with no extra importance). Others you will use: <mark> for highlighted text, <small> for side comments and fine print, <br> for a line break inside an address or poem, <blockquote> for a long quotation and <code> for code.",
        table: {
          caption: "Choosing the element by meaning.",
          headers: ["You mean", "Use", "Shown as"],
          rows: [
            ["This is important or a warning", "<strong>", "Bold"],
            ["Stress this word when reading", "<em>", "Italic"],
            ["A highlighted search match", "<mark>", "Yellow background"],
            ["Fine print, a disclaimer", "<small>", "Smaller text"],
            ["A piece of code", "<code>", "Monospace font"],
            ["A quoted passage", "<blockquote>", "Indented block"],
          ],
        },
        webLab: {
          task:
            "Every line of this article is a <p>, so it has no outline at all. Make the first line the page's <h1>, make the two section titles <h2>s, mark the word \"Never\" with stress emphasis (<em>), and mark \"Important:\" as strongly important (<strong>).",
          files: { "index.html": ARTICLE_START },
          tests: [
            {
              label: "There is exactly one h1, and it is the article title",
              check: "return $$('h1').length === 1 && text('h1') === 'Saving on a student budget';",
              fail: "The page needs exactly one <h1>: \"Saving on a student budget\".",
            },
            {
              label: "Both section titles are h2 headings",
              check: "const h = $$('h2').map((e) => text(e)); return h.includes('Why saving matters') && h.includes('Three habits that work');",
              fail: "\"Why saving matters\" and \"Three habits that work\" should each be an <h2>.",
            },
            {
              label: "No heading level is skipped",
              check: "let last = 0; for (const h of $$('h1,h2,h3,h4,h5,h6')) { const n = Number(h.tagName[1]); if (n > last + 1) return false; last = n; } return last > 0;",
              fail: "A heading level is skipped (for example an h3 straight after the h1). Go down one level at a time.",
            },
            {
              label: "\"Never\" is emphasised with <em>",
              check: "return $$('em').some((e) => text(e) === 'Never');",
              fail: "Wrap the word Never in <em> and </em>.",
            },
            {
              label: "\"Important:\" is marked with <strong>",
              check: "return $$('strong').some((e) => text(e).startsWith('Important'));",
              fail: "Wrap Important: in <strong> and </strong>.",
            },
          ],
          solution: { "index.html": ARTICLE_DONE },
          hint: "Change the tag names, not the words: <p>Why saving matters</p> becomes <h2>Why saving matters</h2>.",
          successMessage:
            "The page now has an outline a screen reader can navigate and a search engine can understand, and nothing about it changed except the tags.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.6 – 3.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l11-links-images",
    moduleId: "wd-m3-html",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.6", "3.7", "3.8"],
    title: "Links, URLs and Images",
    subtitle: "Connecting pages, choosing the right kind of address, and describing pictures",
    estimatedMinutes: 19,
    intro:
      "Links are what make it a web. This lesson covers every kind of link you will write: to your own pages, to other sites, and to a place further down the same page, along with the two kinds of address, and images that make sense even to someone who cannot see them.",

    atoms: [
      {
        id: "a-wd-links",
        title: "Links and navigation",
        explain:
          "The <a> (anchor) element makes a link; its href attribute is where it goes, and its content is what the visitor clicks. Link text must make sense on its own: \"Read our delivery terms\", never \"click here\", because screen-reader users often list all the links on a page and \"click here\" ten times tells them nothing. A link to another site can open in a new tab with target=\"_blank\"; add rel=\"noopener\" so the new page cannot control yours.",
        table: {
          caption: "Kinds of href.",
          headers: ["href", "Goes to"],
          rows: [
            ["about.html", "Another page in the same folder"],
            ["https://www.fao.org", "Another website"],
            ["#contact", "The element with id=\"contact\" on this page"],
            ["mailto:hello@farm.ng", "A new email in the visitor's mail app"],
            ["tel:+2348030000000", "A phone call, on a phone"],
          ],
        },
        mistake: "Link text such as \"click here\" or \"read more\". Describe the destination: \"Read the full delivery policy\".",
      },
      {
        id: "a-wd-absolute-relative",
        title: "Absolute versus relative URLs",
        explain:
          "An absolute URL is the full address, starting with https://. Use it for other websites. A relative URL is a path from the current page: about.html, images/logo.png, ../index.html. Use it for your own files, because it keeps working when the whole site moves, from your laptop to a test server to your real domain.",
        table: {
          caption: "From the page site/blog/post.html",
          headers: ["Relative URL", "Points to"],
          rows: [
            ["photo.jpg", "site/blog/photo.jpg (the same folder)"],
            ["images/photo.jpg", "site/blog/images/photo.jpg (a folder inside this one)"],
            ["../index.html", "site/index.html (.. goes up one folder)"],
            ["/index.html", "index.html at the root of the domain (root-relative)"],
          ],
        },
        decision: {
          scenario:
            "Your site's pages all link to each other with href=\"https://localhost:5500/about.html\", copied from your browser's address bar while testing.",
          question: "What happens when the site is deployed to greenleaf.ng?",
          options: [
            {
              id: "a",
              text: "Every link breaks, because it points at your own laptop; the links should be relative, like about.html",
              why: "localhost means \"this computer\". On a visitor's phone there is no server there. Relative links work on any domain the site is moved to.",
            },
            {
              id: "b",
              text: "The links keep working because the host rewrites them",
              whyWrong: "Hosts serve your files as they are. Nothing rewrites absolute links to your laptop.",
            },
            {
              id: "c",
              text: "Only the first link breaks",
              whyWrong: "Every one of them points at localhost, so every one breaks.",
            },
            {
              id: "d",
              text: "Nothing changes; absolute URLs are always better",
              whyWrong: "Absolute URLs are right for other sites. For your own pages they tie the site to one address.",
            },
          ],
          correct: "a",
          aftermath: "Your own pages: relative. Other people's sites: absolute.",
        },
      },
      {
        id: "a-wd-images-alt",
        title: "Images and alternative text",
        explain:
          "<img> shows an image. src is the file, and alt is its alternative text: what a screen reader says aloud, what shows if the image fails to load, and what search engines read. Describe what the image shows that matters on this page. A purely decorative image gets an empty alt=\"\" so screen readers skip it. Give width and height too: the browser then reserves the space before the image arrives, so the page does not jump as it loads.",
        table: {
          caption: "Writing alt text.",
          headers: ["Image", "Good alt", "Poor alt"],
          rows: [
            ["A photo of the farm on the homepage", "Rows of green vegetables growing on the farm at sunrise", "image1.jpg"],
            ["A logo that is also the home link", "Green Leaf Farms home", "logo"],
            ["A decorative swirl between sections", "(empty: alt=\"\")", "decorative swirl graphic"],
            ["A chart of monthly sales", "Sales rose from ₦2m in January to ₦5m in June", "chart"],
          ],
        },
        webLab: {
          task:
            "Complete the homepage of this two-page site. Where the comments are: (1) add a relative link to about.html; (2) add the farm photo images/hero.jpg with meaningful alt text and width and height attributes; (3) add a link to https://www.fao.org that opens in a new tab safely; (4) add a link that jumps to the Contact section on this page. Click your links in the preview to test them.",
          files: { "index.html": LINKS_INDEX, "about.html": LINKS_ABOUT },
          readOnly: ["about.html"],
          tests: [
            {
              label: "A relative link goes to about.html",
              check: "return $$('a').some((a) => a.getAttribute('href') === 'about.html' || a.getAttribute('href') === './about.html');",
              fail: "Add a link with href=\"about.html\", a relative URL, no https:// and no localhost.",
            },
            {
              label: "The photo images/hero.jpg is on the page and loads",
              check: "const img = $$('img').find((i) => i.getAttribute('src') !== null); return !!img && img.complete && img.naturalWidth === 1600;",
              fail: "Add <img src=\"images/hero.jpg\" …>. Check the folder name and spelling if it shows as broken.",
            },
            {
              label: "The photo has alt text that describes it (at least three words)",
              check: "const img = $('img'); const alt = (img?.getAttribute('alt') || '').trim(); return alt.split(/\\s+/).length >= 3 && !/\\.(jpg|png)|image|photo of/i.test(alt);",
              fail: "Give the image alt text describing what it shows, in at least three words, without file names or \"image of\".",
            },
            {
              label: "The photo has width and height attributes",
              check: "const img = $('img'); return !!img?.getAttribute('width') && !!img?.getAttribute('height');",
              fail: "Add width and height attributes so the browser can reserve the space, for example width=\"800\" height=\"450\".",
            },
            {
              label: "The FAO link is absolute, opens in a new tab and uses rel=\"noopener\"",
              check: "const a = $$('a').find((x) => /^https:\\/\\/(www\\.)?fao\\.org/.test(x.getAttribute('href') || '')); return !!a && a.target === '_blank' && /noopener/.test(a.rel);",
              fail: "The link to https://www.fao.org needs target=\"_blank\" and rel=\"noopener\".",
            },
            {
              label: "A link jumps to the Contact section with #contact",
              check: "return $$('a').some((a) => a.getAttribute('href') === '#contact');",
              fail: "Add a link with href=\"#contact\"; the Contact heading already has id=\"contact\".",
            },
            {
              label: "No link text says \"click here\"",
              check: "return $$('a').every((a) => !/click here|^here$/i.test(text(a)));",
              fail: "Rewrite any \"click here\" link so the words describe where it goes.",
            },
          ],
          solution: { "index.html": LINKS_DONE },
          hint: "Each link is <a href=\"…\">words</a>. The image is a single tag: <img src=\"…\" alt=\"…\" width=\"…\" height=\"…\">.",
          successMessage:
            "Relative links for your own pages, an absolute one for another site, an in-page link, and an image that makes sense without being seen. That covers almost every link you will ever write.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.9 – 3.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l12-lists-clean-markup",
    moduleId: "wd-m3-html",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.9", "3.10", "3.11", "3.12"],
    title: "Lists, Nesting, Entities and Clean Markup",
    subtitle: "Grouping items, putting elements inside elements correctly, and special characters",
    estimatedMinutes: 20,
    intro:
      "Ingredients, steps, menus, search results: much of the web is lists. This lesson builds lists, including lists inside lists, then covers the rules for putting elements inside each other, how to write characters HTML would otherwise treat as code, and how to keep markup readable.",

    atoms: [
      {
        id: "a-wd-lists",
        title: "Ordered and unordered lists",
        explain:
          "Use <ul> (unordered list) when order does not matter, such as ingredients, and <ol> (ordered list) when it does, such as steps. Each item is an <li>. Navigation menus are also lists of links, which lets screen readers announce \"list, 5 items\". There is also <dl>, a description list of terms <dt> and their descriptions <dd>, for glossaries and specifications.",
        example:
          "<ul>                     <ol>\n  <li>Rice</li>             <li>Wash the rice</li>\n  <li>Tomatoes</li>         <li>Fry the paste</li>\n</ul>                       <li>Add the stock</li>\n                          </ol>\n\n• Rice                    1. Wash the rice\n• Tomatoes                2. Fry the paste\n                          3. Add the stock",
        why: "An <ol> numbers itself. Insert a step in the middle and every number after it updates; typed numbers in paragraphs would all be wrong.",
      },
      {
        id: "a-wd-nesting",
        title: "Nesting elements correctly",
        explain:
          "Elements go inside other elements like boxes inside boxes: whatever opens last must close first. <p><strong>Hi</strong></p> is correct; <p><strong>Hi</p></strong> overlaps and is wrong. Some elements may only contain certain children: an <li> belongs directly inside a <ul> or <ol>, and a list inside a list must sit inside an <li>. Indent each level of nesting by two spaces so the structure is visible.",
        example:
          "Correct: the inner list is inside an <li>      Wrong: the inner list is a child of the <ol>\n\n<ol>                                          <ol>\n  <li>Make the paste:                           <li>Make the paste:</li>\n    <ul>                                        <ul>\n      <li>Blend the tomatoes</li>                 <li>Blend the tomatoes</li>\n    </ul>                                       </ul>\n  </li>                                       </ol>\n</ol>",
        decision: {
          scenario:
            "A colleague writes <p>Sale ends <em>tonight</p></em> and says \"it looks fine in Chrome\".",
          question: "What is the right response?",
          options: [
            {
              id: "a",
              text: "Close them in reverse order, </em></p>: the browser is guessing and other tools may guess differently",
              why: "Browsers repair overlapping tags silently, each by its own rules, so \"looks fine\" hides a bug that can surface in other browsers, validators or screen readers. The rule is last opened, first closed.",
            },
            {
              id: "b",
              text: "It is fine because Chrome displays it",
              whyWrong: "Chrome repaired it for you. Code that relies on the browser fixing it is fragile.",
            },
            {
              id: "c",
              text: "Remove the <em> to avoid the problem",
              whyWrong: "The emphasis was meaningful. Fix the order instead of losing the meaning.",
            },
            {
              id: "d",
              text: "Add a second </p> at the end",
              whyWrong: "That adds another error. The two closing tags just need to swap places.",
            },
          ],
          correct: "a",
          aftermath: "Install an HTML validator extension, or paste your page into validator.w3.org. It finds overlapping and unclosed tags instantly.",
        },
      },
      {
        id: "a-wd-entities",
        title: "HTML entities and special characters",
        explain:
          "Some characters mean something to HTML. A < starts a tag, so to show a < as text you write the entity &lt;. Every entity starts with & and ends with ;. Because & starts an entity, a literal & is written &amp;. Entities also give you characters that are hard to type, such as ©, and a non-breaking space that keeps two words on the same line.",
        table: {
          caption: "Entities you will actually use.",
          headers: ["Entity", "Shows", "When"],
          rows: [
            ["&lt;  &gt;", "<  >", "Showing a tag as text"],
            ["&amp;", "&", "A literal ampersand, as in Fish &amp; Chips"],
            ["&quot;", "\"", "A double quote inside an attribute value"],
            ["&copy;", "©", "Copyright notices"],
            ["&nbsp;", "(a space that does not break)", "Keeping \"₦ 500\" or \"10 kg\" together"],
          ],
        },
        why: "With <meta charset=\"UTF-8\">, you can type most characters (₦, é, emoji) directly. Entities remain essential for <, > and &, which would otherwise be read as code.",
      },
      {
        id: "a-wd-clean-markup",
        title: "Comments and clean markup",
        explain:
          "An HTML comment, <!-- like this -->, is visible in the source but never shown on the page. Use comments to label sections and explain anything surprising, not to describe the obvious. Clean markup means consistent two-space indentation, lowercase tags, every attribute value in double quotes and every non-void element closed. Remember that comments are public: anyone can read them with View Source, so never put passwords or private notes in them.",
        webLab: {
          task:
            "Turn this recipe into clean, well-structured HTML. The ingredients become an unordered list (at least four items); the method becomes an ordered list of at least three steps, where the first step contains a nested list of what to blend. Replace TYPE IT HERE so the page displays a paragraph tag, <p>, as visible text, using entities. Make the footer show the © symbol, and add at least one HTML comment.",
          files: { "index.html": RECIPE_START },
          tests: [
            {
              label: "The ingredients are an unordered list of at least four items",
              check: "return $$('ul').some((u) => u.closest('ol') === null && u.children.length >= 4 && [...u.children].every((c) => c.tagName === 'LI'));",
              fail: "Put the ingredients in a <ul>, one <li> per ingredient, at least four.",
            },
            {
              label: "The method is an ordered list of at least three steps",
              check: "const ol = $('ol'); return !!ol && [...ol.children].filter((c) => c.tagName === 'LI').length >= 3;",
              fail: "Put the method in an <ol>, one <li> per step, at least three steps.",
            },
            {
              label: "A list is nested correctly inside the first step (inside an li, not straight in the ol)",
              check: "const first = $('ol > li'); return !!first && !!first.querySelector('ul > li, ol > li') && !$('ol > ul, ol > ol, ul > ul');",
              fail: "The inner list must sit inside the first step's <li>, before its </li>.",
            },
            {
              label: "The page shows the text <p> literally, written with entities",
              check: "return $$('code').some((c) => c.textContent.trim() === '<p>') && /&lt;p&gt;/.test(code('index.html'));",
              fail: "Replace TYPE IT HERE with &lt;p&gt; so the browser shows <p> instead of starting a paragraph.",
            },
            {
              label: "The footer shows the © symbol",
              check: "return text('footer').includes('©');",
              fail: "Use &copy; in the footer's copyright line.",
            },
            {
              label: "The page has at least one HTML comment",
              check: "return document.createTreeWalker(document, NodeFilter.SHOW_COMMENT).nextNode() !== null;",
              fail: "Add a comment such as <!-- Ingredients --> somewhere in the page.",
            },
          ],
          solution: { "index.html": RECIPE_DONE },
          hint: "A nested list goes inside an <li>: write the step's words, then the whole <ul>…</ul>, then the step's </li>.",
          successMessage:
            "Lists that number and announce themselves, nesting a validator would approve, characters HTML would otherwise misread, and a comment for the next developer. That is clean markup.",
        },
      },
    ],

    task: {
      title: "Module project: a recipe page",
      intro:
        "In your portfolio folder, build recipes.html: a page for a dish you know well, using everything from this module.",
      prompts: [
        "A complete document skeleton with a meaningful <title>.",
        "One h1, then h2 sections for Ingredients, Method and Tips, with no skipped levels.",
        "An unordered list of ingredients and an ordered list of steps, with at least one nested list.",
        "An image of the dish with good alt text, width and height, plus a relative link back to index.html and an absolute link to a source that inspired you.",
        "Run it through validator.w3.org and fix every error it reports.",
      ],
      closing: "In Module 6 you will style this exact page, so keep the structure clean now.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
