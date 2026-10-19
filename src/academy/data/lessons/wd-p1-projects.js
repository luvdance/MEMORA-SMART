/**
 * RESPONSIVE WEB DEVELOPMENT · PHASE 1 PROJECTS AND ASSESSMENT GATE
 *
 * Curriculum P1.1 – P1.5. Four projects from the source curriculum, each a
 * brief, a planning decision and a build checked in the browser; then the
 * gate: an independent three-page website with semantic structure,
 * navigation, images and a working form. The gate's lab never shows a model
 * answer (`revealSolution: false`): it is built, not copied.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s-p1-projects";

const doc = (title, body, lang = "en") => `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body>
${body}
</body>
</html>
`;

const EMPTY = (title) => doc(title, "  <!-- Build the page here -->");

/* ── P1.1 Personal profile ─────────────────────────────────────────── */
const PROFILE_DONE = doc(
  "Amaka Obi · Profile",
  `  <header>
    <h1>Amaka Obi</h1>
    <p>Student web developer in Enugu</p>
  </header>
  <main>
    <img src="images/profile.jpg" alt="Amaka Obi smiling, wearing a green headscarf" width="300" height="300">
    <section>
      <h2>About me</h2>
      <p>I am learning to build <strong>accessible</strong> websites for small businesses.</p>
    </section>
    <section>
      <h2>Skills</h2>
      <ul>
        <li>HTML</li>
        <li>Accessibility</li>
        <li>Writing</li>
      </ul>
    </section>
    <section>
      <h2>Contact</h2>
      <p><a href="mailto:amaka@example.com">Email Amaka</a></p>
    </section>
  </main>
  <footer>
    <p>&copy; 2026 Amaka Obi</p>
  </footer>`
);

/* ── P1.2 Student registration ─────────────────────────────────────── */
const REG_DONE = doc(
  "Student registration",
  `  <main>
    <h1>Student registration</h1>
    <form action="/students" method="post">
      <fieldset>
        <legend>Your details</legend>
        <label for="first">First name</label>
        <input id="first" name="first" type="text" required autocomplete="given-name">
        <label for="last">Last name</label>
        <input id="last" name="last" type="text" required autocomplete="family-name">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required autocomplete="email">
        <label for="dob">Date of birth</label>
        <input id="dob" name="dob" type="date" required>
      </fieldset>
      <fieldset>
        <legend>Course</legend>
        <label for="course">Course</label>
        <select id="course" name="course" required>
          <option value="">Choose a course</option>
          <option value="web">Web development</option>
          <option value="data">Data analysis</option>
        </select>
        <fieldset>
          <legend>Study mode</legend>
          <input type="radio" id="m-online" name="mode" value="online" required>
          <label for="m-online">Online</label>
          <input type="radio" id="m-campus" name="mode" value="campus">
          <label for="m-campus">On campus</label>
        </fieldset>
      </fieldset>
      <input type="checkbox" id="terms" name="terms" value="yes" required>
      <label for="terms">I agree to the student terms</label>
      <button type="submit">Register</button>
    </form>
  </main>`
);

/* ── P1.3 Multi-page business ──────────────────────────────────────── */
const bizNav = (current) => `  <header>
    <p><a href="index.html"><img src="images/logo.svg" alt="Bisi's Bakery home" width="240" height="80"></a></p>
    <nav aria-label="Main">
      <ul>
        <li><a href="index.html"${current === "index.html" ? ' aria-current="page"' : ""}>Home</a></li>
        <li><a href="menu.html"${current === "menu.html" ? ' aria-current="page"' : ""}>Menu</a></li>
        <li><a href="contact.html"${current === "contact.html" ? ' aria-current="page"' : ""}>Contact</a></li>
      </ul>
    </nav>
  </header>`;
const bizFooter = `  <footer>
    <p>&copy; 2026 Bisi's Bakery, Ibadan</p>
  </footer>`;
const BIZ_DONE = {
  "index.html": doc("Bisi's Bakery · Fresh bread in Ibadan", `${bizNav("index.html")}
  <main>
    <h1>Bisi's Bakery</h1>
    <p>Fresh bread, cakes and meat pies, baked every morning in Bodija.</p>
  </main>
${bizFooter}`),
  "menu.html": doc("Menu · Bisi's Bakery", `${bizNav("menu.html")}
  <main>
    <h1>Menu</h1>
    <table>
      <caption>Prices in naira</caption>
      <thead><tr><th scope="col">Item</th><th scope="col">Price</th></tr></thead>
      <tbody>
        <tr><td>Agege bread</td><td>₦1,200</td></tr>
        <tr><td>Meat pie</td><td>₦800</td></tr>
      </tbody>
    </table>
  </main>
${bizFooter}`),
  "contact.html": doc("Contact · Bisi's Bakery", `${bizNav("contact.html")}
  <main>
    <h1>Contact us</h1>
    <p><a href="tel:+2348030000001">Call 0803 000 0001</a></p>
  </main>
${bizFooter}`),
};

/* ── P1.4 Article ──────────────────────────────────────────────────── */
const ARTICLE_DONE = doc(
  "How to start a vegetable garden on a balcony · Green Fingers Blog",
  `  <header>
    <p>Green Fingers Blog</p>
  </header>
  <main>
    <article>
      <header>
        <h1>How to start a vegetable garden on a balcony</h1>
        <p>By Kemi Adeyemi · <time datetime="2026-04-02">2 April 2026</time></p>
      </header>
      <img src="images/article.jpg" alt="Tomato and pepper plants in pots on a sunny balcony" width="700" height="350">
      <p>You do not need a farm to grow your own food.</p>
      <h2>Choose the right containers</h2>
      <p>Any pot with drainage holes will do.</p>
      <h2>Pick easy crops</h2>
      <ol>
        <li>Pepper</li>
        <li>Tomato</li>
        <li>Spinach (efo)</li>
      </ol>
      <blockquote>
        <p>The best time to plant was last season. The second best time is now.</p>
      </blockquote>
    </article>
    <aside>
      <h2>Related posts</h2>
      <ul>
        <li><a href="composting.html">Composting kitchen waste</a></li>
      </ul>
    </aside>
  </main>
  <footer>
    <p>&copy; 2026 Green Fingers Blog</p>
  </footer>`
);

const pageHas = (page) => ({ page });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     P1.1 · PERSONAL PROFILE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l20-profile",
    moduleId: "wd-p1-projects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P1.1"],
    title: "Project: Personal Profile Webpage",
    subtitle: "A single page that introduces you, built with semantic structure",
    estimatedMinutes: 30,
    intro:
      "Your first project is about you. A profile page is the simplest real website there is, and also the start of your portfolio: by the end of Phase 6 this page will have grown into the site you send employers.",

    atoms: [
      {
        id: "a-wd-p1-profile-brief",
        title: "The brief",
        explain:
          "Build a one-page profile that a stranger could read in thirty seconds and know who you are, what you do and how to reach you. Use real content about yourself, or about a person you invent, but no lorem ipsum: placeholder text hides problems that real text exposes.",
        table: {
          caption: "Requirements.",
          headers: ["#", "The page must have"],
          rows: [
            ["1", "A header with your name as the page's only h1, and a one-line description"],
            ["2", "A photo with descriptive alt text, width and height"],
            ["3", "Sections with h2 headings: About me, Skills (a list) and Contact"],
            ["4", "At least one emphasised phrase using strong or em"],
            ["5", "A contact link (mailto: or tel:) and a footer with ©"],
          ],
        },
      },
      {
        id: "a-wd-p1-profile-plan",
        title: "Plan before you type",
        explain:
          "Professionals write the outline before the markup: the landmarks, then the headings in order, then the content under each. It takes two minutes and prevents most structural mistakes.",
        decision: {
          scenario: "You are planning the profile's outline.",
          question: "Which outline is right?",
          options: [
            {
              id: "a",
              text: "header (h1 name) → main (img, section h2 About, section h2 Skills, section h2 Contact) → footer",
              why: "One h1, three h2 sections at the same level inside main, landmarks around them. It is the page's table of contents.",
            },
            {
              id: "b",
              text: "h1 Name → h1 About → h1 Skills → h1 Contact",
              whyWrong: "One page, one h1. The others are sections of it.",
            },
            {
              id: "c",
              text: "h3 Name → h1 About → h2 Skills",
              whyWrong: "Headings chosen by size, out of order. The outline makes no sense.",
            },
            {
              id: "d",
              text: "Everything in one paragraph, styled later",
              whyWrong: "Styling cannot add structure that the HTML lacks.",
            },
          ],
          correct: "a",
          aftermath: "Write this outline as comments in your file first, then fill each one in.",
        },
      },
      {
        id: "a-wd-p1-profile-build",
        title: "Build it",
        explain:
          "Build the profile from the empty page. Use images/profile.jpg for the photo. Check it in the preview as you go, and read the checklist: every item is one of the requirements in the brief.",
        webLab: {
          task: "Build the personal profile page described in the brief, inside the body of index.html.",
          files: { "index.html": EMPTY("My profile") },
          tests: [
            { label: "A header contains the page's only h1", check: "return $$('h1').length === 1 && !!$('header h1');", fail: "Put your name in a single <h1> inside a <header>." },
            { label: "A photo, images/profile.jpg, with descriptive alt, width and height", check: "const i = $('img'); return !!i && i.naturalWidth === 600 && i.alt.trim().split(/\\s+/).length >= 3 && i.hasAttribute('width') && i.hasAttribute('height');", fail: "Add <img src=\"images/profile.jpg\"> with alt text of at least three words, and width and height." },
            { label: "h2 sections for About me, Skills and Contact, inside main", check: "const h = $$('main h2').map((e) => text(e).toLowerCase()); return ['about','skills','contact'].every((w) => h.some((x) => x.includes(w)));", fail: "Inside <main>, add three sections with h2 headings: About me, Skills and Contact." },
            { label: "Skills are a list of at least three items", check: "return $$('main ul li, main ol li').length >= 3;", fail: "List your skills in a <ul> with at least three <li> items." },
            { label: "Something is emphasised with strong or em", check: "return !!$('main strong, main em');", fail: "Mark an important word or phrase with <strong> or <em>." },
            { label: "A mailto: or tel: contact link", check: "return $$('a').some((a) => /^(mailto|tel):/.test(a.getAttribute('href') || ''));", fail: "Add a link like <a href=\"mailto:you@example.com\">Email me</a>." },
            { label: "A footer with the © symbol", check: "return text('footer').includes('©');", fail: "Add a <footer> with a copyright line using &copy;." },
          ],
          solution: { "index.html": PROFILE_DONE },
          hint: "Start with the three landmarks, header, main and footer, then fill main with the image and three sections.",
          successMessage: "Your first complete page, built to a brief and checked against it. Copy it into your portfolio folder: it is the seed of your portfolio site.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     P1.2 · STUDENT REGISTRATION FORM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l21-registration",
    moduleId: "wd-p1-projects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P1.2"],
    title: "Project: Student Registration Form",
    subtitle: "A complete, accessible, self-validating form",
    estimatedMinutes: 30,
    intro:
      "Registration forms are where many sites lose people: unclear fields, lost answers, rejections with no explanation. Yours will be clear, labelled, grouped and checked by the browser before it is sent.",

    atoms: [
      {
        id: "a-wd-p1-reg-brief",
        title: "The brief",
        explain:
          "A school is moving its paper registration online. Build the form. It posts to /students. Every field is required. It must work with the keyboard alone and announce every field correctly.",
        table: {
          caption: "Fields.",
          headers: ["Field", "Control", "Rule"],
          rows: [
            ["First and last name", "Text inputs, names first and last", "Required"],
            ["Email", "Email input, name email", "Required, valid format"],
            ["Date of birth", "Date input, name dob", "Required"],
            ["Course", "Select, name course, first option empty (\"Choose a course\")", "Required"],
            ["Study mode", "Radios, name mode: online or campus, in a fieldset", "Required"],
            ["Terms", "Checkbox, name terms", "Must be ticked"],
          ],
        },
      },
      {
        id: "a-wd-p1-reg-plan",
        title: "Make the course choice required",
        explain:
          "A select always has some option selected, usually the first. So required on a select only works if the first option has an empty value: the browser then treats \"still on the first option\" as empty.",
        decision: {
          scenario: "Your select's first option is <option value=\"web\">Web development</option>, and the select is required.",
          question: "What happens if the student never touches the menu?",
          options: [
            {
              id: "a",
              text: "The form submits with course=web, because an option with a value is already selected",
              why: "required sees a value and is satisfied. Add a first option with value=\"\" (\"Choose a course\") so that untouched really means empty.",
            },
            {
              id: "b",
              text: "The browser blocks the form",
              whyWrong: "Only if the selected option's value is empty. Here it is \"web\".",
            },
            {
              id: "c",
              text: "The form sends course= with no value",
              whyWrong: "The selected option's value is sent, and it is web.",
            },
            {
              id: "d",
              text: "The select is removed from the form",
              whyWrong: "Nothing removes it; it simply sends its default.",
            },
          ],
          correct: "a",
          aftermath: "An empty first option is the standard pattern for a required select.",
        },
      },
      {
        id: "a-wd-p1-reg-build",
        title: "Build it",
        explain:
          "Build the form from the brief. The checks submit it in the browser: first empty, then filled in, so your validation is tested for real.",
        webLab: {
          task: "Build the student registration form inside the body: every field in the brief, labelled, grouped and required.",
          files: { "index.html": EMPTY("Student registration") },
          tests: [
            { label: "The form posts to /students", check: "const f = $('form'); return !!f && f.getAttribute('action') === '/students' && f.method === 'post';", fail: "Use <form action=\"/students\" method=\"post\">." },
            { label: "Every input, select and text area has a label", check: "const c = $$('form input, form select, form textarea'); return c.length >= 7 && c.every((x) => x.labels && x.labels.length);", fail: "Every control needs its own <label for>." },
            { label: "The right types: email and date", check: "return $('input[name=email]')?.type === 'email' && $('input[name=dob]')?.type === 'date';", fail: "Use type=\"email\" for email and type=\"date\" for date of birth." },
            { label: "The study mode radios are grouped in a fieldset with a legend", check: "const f = $$('fieldset').find((x) => x.querySelector(':scope > input[name=mode]')); return !!f && !!f.querySelector('legend') && f.querySelectorAll('input[type=radio][name=mode]').length === 2;", fail: "Put the two mode radios in their own <fieldset> with a <legend>." },
            { label: "Submitting the empty form is blocked", check: "await submit('form'); return submissions().length === 0;", fail: "The empty form was sent. Mark every field required, and give the select an empty first option." },
            { label: "Without choosing a course, it is still blocked", check: "await type('input[name=first]','Ifeanyi'); await type('input[name=last]','Nwosu'); await type('input[name=email]','ifeanyi@example.com'); await type('input[name=dob]','2008-05-14'); await choose('input[name=mode][value=online]'); await choose('input[name=terms]'); await submit('form'); return submissions().length === 0;", fail: "The form was sent without a course. The select's first option needs value=\"\"." },
            { label: "A complete form is sent with every field", check: "const s = $('select[name=course]'); s.value = [...s.options].find((o) => o.value)?.value; s.dispatchEvent(new Event('change', { bubbles: true })); await submit('form'); const d = submissions()[0]; return submissions().length === 1 && !!d && ['first','last','email','dob','course','mode','terms'].every((k) => d[k]);", fail: "A correct form was not sent, or a field is missing its name. Check the names in the brief." },
          ],
          solution: { "index.html": REG_DONE },
          hint: "Build it in two fieldsets: Your details, then Course (with a nested fieldset for the radios). Then add the checkbox and the button.",
          successMessage: "A form that refuses incomplete answers, explains itself to a screen reader and sends exactly the data the school asked for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     P1.3 · MULTI-PAGE BUSINESS WEBSITE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l22-business",
    moduleId: "wd-p1-projects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P1.3"],
    title: "Project: Multi-Page Business Website",
    subtitle: "Three pages, one consistent site",
    estimatedMinutes: 35,
    intro:
      "Small businesses need small websites: who they are, what they sell, how to reach them. This project builds one with shared navigation that works the same on every page.",

    atoms: [
      {
        id: "a-wd-p1-biz-brief",
        title: "The brief",
        explain:
          "Bisi's Bakery in Ibadan needs a three-page site: Home, Menu and Contact. Every page shares the same header (the logo, images/logo.svg, linking home, and the navigation) and the same footer. Menu has a price table. Contact has a phone link.",
        table: {
          caption: "Requirements.",
          headers: ["#", "Requirement"],
          rows: [
            ["1", "index.html, menu.html, contact.html, each with a unique title and one h1"],
            ["2", "The same header on all three: logo link to index.html, nav list to all three pages"],
            ["3", "aria-current=\"page\" on the current page's link, on each page"],
            ["4", "menu.html: a table with a caption and th scope=\"col\" headers"],
            ["5", "contact.html: a tel: link; every page: the same footer"],
          ],
        },
      },
      {
        id: "a-wd-p1-biz-plan",
        title: "A logo that links home",
        explain:
          "On most sites the logo links to the homepage. When an image is the only content of a link, its alt text becomes the link's name, so it should say where the link goes, not describe the picture.",
        decision: {
          scenario: "The logo image is the link to the homepage.",
          question: "Which alt text is best?",
          options: [
            { id: "a", text: "alt=\"Bisi's Bakery home\"", why: "The link's name is the alt, so it should name the destination. A screen reader says \"Bisi's Bakery home, link\"." },
            { id: "b", text: "alt=\"logo\"", whyWrong: "\"logo, link\" says nothing about where it goes." },
            { id: "c", text: "alt=\"\"", whyWrong: "An empty alt leaves the link with no name at all." },
            { id: "d", text: "alt=\"A brown circle with a loaf of bread drawn in it\"", whyWrong: "Describes the picture, not the link's purpose." },
          ],
          correct: "a",
          aftermath: "For an image that is a link, alt says what the link does.",
        },
      },
      {
        id: "a-wd-p1-biz-build",
        title: "Build it",
        explain: "Build all three pages. Use the page buttons above the preview, or your own navigation, to move between them.",
        webLab: {
          task: "Build the three pages of Bisi's Bakery to the brief: shared header and footer, current page marked, a menu table and a phone link.",
          files: {
            "index.html": EMPTY("Bisi's Bakery"),
            "menu.html": EMPTY("Menu"),
            "contact.html": EMPTY("Contact"),
          },
          tests: [
            ...["index.html", "menu.html", "contact.html"].map((p) => ({
              ...pageHas(p),
              label: `${p}: header with a logo link home and a nav list to all three pages`,
              check: "const hrefs = $$('header nav li a').map((a) => a.getAttribute('href')); const logo = $('header a > img'); return ['index.html','menu.html','contact.html'].every((h) => hrefs.includes(h)) && !!logo && logo.closest('a').getAttribute('href') === 'index.html' && /home/i.test(logo.alt);",
              fail: `On ${p}, the header needs the logo (alt naming the home page) linked to index.html, and a nav list linking all three pages.`,
            })),
            ...["index.html", "menu.html", "contact.html"].map((p) => ({
              ...pageHas(p),
              label: `${p}: one h1, a footer, and aria-current on this page's link only`,
              check: `const cur = $$('nav a[aria-current="page"]'); return $$('h1').length === 1 && !!$('footer') && cur.length === 1 && cur[0].getAttribute('href') === '${p}';`,
              fail: `On ${p}: exactly one h1, a footer, and aria-current="page" on the link to ${p} only.`,
            })),
            { page: "menu.html", label: "menu.html: a price table with a caption and column headers", check: "return !!$('table caption') && $$('thead th[scope=col]').length >= 2 && $$('tbody tr').length >= 2;", fail: "On menu.html add a table with a caption, th scope=\"col\" headers and at least two rows." },
            { page: "contact.html", label: "contact.html: a tel: link", check: "return $$('a').some((a) => (a.getAttribute('href') || '').startsWith('tel:'));", fail: "Add a link like <a href=\"tel:+2348030000001\">Call us</a>." },
            {
              label: "The three pages have three different titles",
              check: "const t = ['index.html', 'menu.html', 'contact.html'].map((f) => (code(f).match(/<title>([^<]*)<.title>/i) || [])[1]?.trim() || ''); return t.every((x) => x.length > 0) && new Set(t).size === t.length;",
              fail: "Give every page its own <title>, for example \"Menu · Bisi's Bakery\".",
            },
          ],
          solution: BIZ_DONE,
          hint: "Build index.html completely first, then copy it to the other two pages and change the title, the h1, the main content and which link is current.",
          successMessage: "A real, consistent multi-page site. Notice how much you copied between pages: Phase 5 shows how professionals avoid that.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     P1.4 · STRUCTURED ARTICLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l23-article",
    moduleId: "wd-p1-projects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["P1.4"],
    title: "Project: Structured Article or Blog Page",
    subtitle: "Long-form content with an outline readers and search engines can follow",
    estimatedMinutes: 30,
    intro:
      "Blogs and news sites are mostly articles. A well-structured article ranks better, reads better on a phone and can be navigated by screen-reader users heading by heading.",

    atoms: [
      {
        id: "a-wd-p1-article-brief",
        title: "The brief",
        explain:
          "Write and mark up a blog post of at least two sections on a topic you know. The post is an <article> inside main, with its own header holding the title, the author and a <time> element for the date. Related links go in an <aside>.",
        table: {
          caption: "Requirements.",
          headers: ["#", "Requirement"],
          rows: [
            ["1", "A specific page title; the article's h1 inside the article's own header"],
            ["2", "A byline with a <time datetime=\"YYYY-MM-DD\"> element"],
            ["3", "An image with alt text; at least two h2 sections"],
            ["4", "A list and a blockquote somewhere in the article"],
            ["5", "An aside with related links, and a site footer"],
          ],
        },
      },
      {
        id: "a-wd-p1-article-plan",
        title: "Dates machines can read",
        explain:
          "People read \"2 April 2026\"; software reads 2026-04-02. The <time> element holds both: the human text as content and the machine date in datetime. Search engines use it to show the date in results.",
        decision: {
          scenario: "The post was published on 2 April 2026.",
          question: "Which markup is right?",
          options: [
            { id: "a", text: "<time datetime=\"2026-04-02\">2 April 2026</time>", why: "Readable text for people, an unambiguous ISO date for machines." },
            { id: "b", text: "<time>02/04/26</time>", whyWrong: "Is that 2 April or 4 February? And 26 could be any century." },
            { id: "c", text: "<date>2 April 2026</date>", whyWrong: "There is no <date> element." },
            { id: "d", text: "<span>2 April 2026</span>", whyWrong: "Readable, but machines get no date from it." },
          ],
          correct: "a",
          aftermath: "The datetime format is year-month-day: 2026-04-02.",
        },
      },
      {
        id: "a-wd-p1-article-build",
        title: "Build it",
        explain: "Build the article page to the brief. Use images/article.jpg for its image.",
        webLab: {
          task: "Build a structured blog post page inside the body: article with header, time, image, sections, a list and a quote, plus an aside and a footer.",
          files: { "index.html": EMPTY("Blog post") },
          tests: [
            { label: "A specific page title (not \"Blog post\"), at least 20 characters", check: "return document.title !== 'Blog post' && document.title.length >= 20;", fail: "Write a <title> naming the article and the blog." },
            { label: "The h1 is inside the article's own header, in main", check: "return $$('h1').length === 1 && !!$('main article header h1');", fail: "Structure: <main><article><header><h1>…</h1>…</header>…" },
            { label: "A byline with a machine-readable date", check: "const t = $('article time'); return !!t && /^\\d{4}-\\d{2}-\\d{2}$/.test(t.getAttribute('datetime') || '');", fail: "Add <time datetime=\"2026-04-02\">2 April 2026</time> to the byline." },
            { label: "An image with alt text", check: "const i = $('article img'); return !!i && i.alt.trim().length > 5 && i.naturalWidth > 0;", fail: "Add images/article.jpg with descriptive alt text." },
            { label: "At least two h2 sections in the article", check: "return $$('article h2').length >= 2;", fail: "Give the article at least two h2 section headings." },
            { label: "A list and a blockquote in the article", check: "return !!$('article ul li, article ol li') && !!$('article blockquote');", fail: "Add a list and a <blockquote> to the article." },
            { label: "An aside with related links, and a footer", check: "return $$('aside a').length >= 1 && !!$('body > footer, footer');", fail: "Add an <aside> with at least one related link, and a <footer>." },
          ],
          solution: { "index.html": ARTICLE_DONE },
          hint: "The article's header is a header element inside the article, separate from the site's header at the top of the body.",
          successMessage: "An article with a real outline, a machine-readable date and related content set apart. This is the shape of most of the content on the web.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     P1.5 · ASSESSMENT GATE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l24-p1-gate",
    moduleId: "wd-p1-projects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["P1.5"],
    gate: true,
    title: "Phase 1 Assessment Gate: Your Own Three-Page Website",
    subtitle: "Semantic structure, navigation, images and a working form, built independently",
    estimatedMinutes: 60,
    intro:
      "This is the Phase 1 gate. You build a three-page website on your own, for a business or organisation of your choice, and it must pass every check before Phase 2 opens. There is no model answer to reveal: everything you need is in Modules 3 to 5 and the projects you just built.",

    atoms: [
      {
        id: "a-wd-p1-gate-brief",
        title: "The gate brief",
        explain:
          "Choose a real or invented organisation: a salon, a church, a tutoring centre, a farm. Build three pages: index.html (home), about.html and contact.html. Contact holds a form. You will be checked on structure, navigation, images and the form, on every page.",
        table: {
          caption: "What the gate checks.",
          headers: ["Area", "Requirement"],
          rows: [
            ["Every page", "Doctype, lang, viewport, a unique title, one h1, header, nav, main and footer"],
            ["Navigation", "A nav list linking all three pages, with aria-current on the current one"],
            ["Images", "At least one image on the home and about pages, each with alt text, width and height"],
            ["Form (contact)", "Name, email and message, all labelled and required; email typed as email"],
            ["Form behaviour", "An empty form is blocked; a complete one is sent"],
          ],
        },
        why: "A gate is not a test of memory: it is the same work a junior developer is given in their first week. If you can pass it without help, you are ready to style what you build.",
      },
      {
        id: "a-wd-p1-gate-build",
        title: "Build your site",
        explain:
          "Build all three pages. Use any of the built-in images: images/hero.jpg, images/team.jpg, images/profile.jpg, images/product.jpg or images/logo.svg. When a check fails, the checklist tells you which page and which requirement.",
        webLab: {
          task: "Build your three-page website to the gate brief.",
          revealSolution: false,
          files: {
            "index.html": "<!-- Your home page -->\n",
            "about.html": "<!-- Your about page -->\n",
            "contact.html": "<!-- Your contact page, with the form -->\n",
          },
          tests: [
            ...["index.html", "about.html", "contact.html"].flatMap((p) => [
              {
                page: p,
                label: `${p}: a complete document (doctype, lang, viewport, title)`,
                check: "return document.compatMode === 'CSS1Compat' && !!document.documentElement.lang && !!$('meta[name=viewport]') && document.title.trim().length > 0;",
                fail: `${p} needs the full skeleton: <!DOCTYPE html>, <html lang>, the viewport meta tag and a title.`,
              },
              {
                page: p,
                label: `${p}: landmarks and one h1`,
                check: "return !!$('header') && !!$('nav') && $$('main').length === 1 && !!$('footer') && $$('h1').length === 1;",
                fail: `${p} needs a header, a nav, one main, a footer and exactly one h1.`,
              },
              {
                page: p,
                label: `${p}: a nav list to all three pages, with this page marked current`,
                check: `const hrefs = $$('nav li a').map((a) => (a.getAttribute('href') || '').replace(/^\\.\\//, '')); const cur = $$('nav a[aria-current="page"]'); return ['index.html','about.html','contact.html'].every((h) => hrefs.includes(h)) && cur.length === 1 && cur[0].getAttribute('href').replace(/^\\.\\//, '') === '${p}';`,
                fail: `${p}: the nav list must link index.html, about.html and contact.html, and only the ${p} link has aria-current="page".`,
              },
            ]),
            {
              page: "index.html",
              label: "The three pages have three different titles",
              check: "const t = ['index.html', 'about.html', 'contact.html'].map((f) => (code(f).match(/<title>([^<]*)<.title>/i) || [])[1]?.trim() || ''); return t.every((x) => x.length > 0) && new Set(t).size === t.length;",
              fail: "Each page needs its own title: the page's name and your organisation's.",
            },
            ...["index.html", "about.html"].map((p) => ({
              page: p,
              label: `${p}: at least one image with alt text, width and height, that loads`,
              check: "const imgs = $$('main img'); return imgs.length > 0 && imgs.every((i) => i.alt.trim().length > 2 && i.hasAttribute('width') && i.hasAttribute('height') && i.complete && i.naturalWidth > 0);",
              fail: `${p} needs an image in main with alt text, width and height, from the built-in images folder.`,
            })),
            {
              page: "contact.html",
              label: "contact.html: name, email and message fields, labelled, required, email typed as email",
              check: "const f = $('form'); if (!f) return false; const n = f.querySelector('input[name=name]'), e = f.querySelector('input[name=email]'), m = f.querySelector('textarea[name=message]'); return !!n && !!e && !!m && e.type === 'email' && [n, e, m].every((x) => x.required && x.labels && x.labels.length);",
              fail: "The contact form needs inputs named name and email (type email) and a textarea named message, each with a label and required.",
            },
            {
              page: "contact.html",
              label: "contact.html: the empty form is blocked and a complete one is sent",
              check: "await submit('form'); if (submissions().length !== 0) return false; await type('input[name=name]', 'Tunde Bakare'); await type('input[name=email]', 'tunde@example.com'); await type('textarea[name=message]', 'Do you open on Sundays?'); await submit('form'); return submissions().length === 1;",
              fail: "Either the empty form was sent, or a complete one was not. Check required, the names, and that nothing else is required.",
            },
          ],
          solution: {
            "index.html": doc("Home · Glow Salon, Port Harcourt", `  <header><nav aria-label="Main"><ul><li><a href="index.html" aria-current="page">Home</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li></ul></nav></header>
  <main><h1>Glow Salon</h1><img src="images/hero.jpg" alt="The salon's bright reception with three styling chairs" width="800" height="450"></main>
  <footer><p>&copy; 2026 Glow Salon</p></footer>`),
            "about.html": doc("About · Glow Salon", `  <header><nav aria-label="Main"><ul><li><a href="index.html">Home</a></li><li><a href="about.html" aria-current="page">About</a></li><li><a href="contact.html">Contact</a></li></ul></nav></header>
  <main><h1>About us</h1><img src="images/team.jpg" alt="The four stylists of Glow Salon" width="600" height="400"></main>
  <footer><p>&copy; 2026 Glow Salon</p></footer>`),
            "contact.html": doc("Contact · Glow Salon", `  <header><nav aria-label="Main"><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="contact.html" aria-current="page">Contact</a></li></ul></nav></header>
  <main><h1>Contact</h1>
    <form action="/contact" method="post">
      <label for="name">Name</label><input id="name" name="name" required>
      <label for="email">Email</label><input id="email" name="email" type="email" required>
      <label for="message">Message</label><textarea id="message" name="message" required></textarea>
      <button type="submit">Send message</button>
    </form>
  </main>
  <footer><p>&copy; 2026 Glow Salon</p></footer>`),
          },
          hint: "Build the home page completely and pass its checks first. Then copy it twice and change the title, the h1, the main content and which link is current.",
          successMessage:
            "Phase 1 gate passed. You can build structured, navigable, accessible websites with working forms, on your own. Phase 2 makes them beautiful and responsive.",
        },
      },
      {
        id: "a-wd-p1-gate-review",
        title: "Review your own work like a professional",
        explain:
          "Passing the checks proves the requirements are met. A professional also reviews what no checklist can: is the content clear, are the headings what a visitor would look for, would the form make sense to your grandmother? Do it now, before Phase 2, while the HTML is fresh.",
        decision: {
          scenario: "Your site passes every gate check. A friend says the contact page's button says \"Submit\" and the message box is labelled \"Text\".",
          question: "What should you do?",
          options: [
            { id: "a", text: "Change them to \"Send message\" and \"Your message\": the checks prove structure, not clarity", why: "Checks confirm that labels exist; only people can tell you whether they are clear. Clear words are part of usability and accessibility." },
            { id: "b", text: "Nothing: the checks passed", whyWrong: "Passing checks is the minimum. Real visitors still have to understand the page." },
            { id: "c", text: "Remove the labels so the form looks cleaner", whyWrong: "That would fail the checks and make the form inaccessible." },
            { id: "d", text: "Add placeholders saying the same thing", whyWrong: "Placeholders disappear; better label text is the fix." },
          ],
          correct: "a",
          aftermath: "Phase 1 complete. Keep this site: you will style it in Phase 2.",
        },
      },
    ],

    task: {
      title: "Phase 1 portfolio work",
      intro: "Bring the Phase 1 projects together in your own portfolio folder.",
      prompts: [
        "Copy your profile, registration form, business site, article and gate site into your portfolio folder, each in its own subfolder.",
        "Make index.html in the portfolio folder link to each project.",
        "Run every page through validator.w3.org and fix all errors.",
        "Test every page with the keyboard only, and once with a screen reader.",
        "Write a short notes.md describing one decision you made in each project and why.",
      ],
      closing: "All of these pages are plain HTML. In Phase 2 they get colour, type, layout and, above all, responsiveness.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
