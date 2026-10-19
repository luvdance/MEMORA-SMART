/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 1 · INTRODUCTION TO THE WEB
 *
 * Curriculum 1.0 – 1.10. The course opens with the destination (what you will
 * build and the whole road ahead) and a first page edited in the browser,
 * then what the web actually is: websites and applications, who builds which
 * part, the internet, browsers and servers, URLs, HTTP and how a page loads.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s1-web";

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My first page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello, world</h1>
  <p>This page was built by a web developer.</p>
</body>
</html>
`;

const PAGE_CSS = `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 24px;
  background: #f0fdfa;
  color: #134e4a;
}

h1 {
  color: #0f766e;
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0 · THE FORESIGHT LESSON
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l1-welcome",
    moduleId: "wd-m1-web",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Welcome to Responsive Web Development",
    subtitle: "What you will build, how you will learn, and the road ahead",
    estimatedMinutes: 15,
    intro:
      "Before any code, the destination. Every website you have ever used, from a bank's login page to a news site on your phone, is built from the same three languages you are about to learn. This lesson shows you where the course goes, how every lesson works, and then you change a real web page in the first five minutes.",

    atoms: [
      {
        id: "a-wd-welcome-phases",
        title: "What you will be able to build, phase by phase",
        explain:
          "The course has six phases. Each one ends with projects and an assessment gate: something you build on your own that proves you can move on. You measure your progress by what you make, not by how many pages you have read.",
        table: {
          caption: "The six phases, and what you can build at the end of each.",
          headers: ["Phase", "You learn", "By the end you can build"],
          rows: [
            ["1 · Web foundations and HTML", "How the web works, your tools, HTML, semantic structure, forms and accessibility", "A three-page website with navigation, images and a working form"],
            ["2 · CSS and responsive design", "Selectors, colour and type, the box model, Flexbox, Grid, responsive and modern CSS", "A portfolio or landing page that works on every phone, tablet and laptop"],
            ["3 · JavaScript fundamentals", "Programming itself: variables, conditions, loops, functions, arrays, objects, debugging", "A calculator, a grading system, a guessing game, a quiz engine"],
            ["4 · Interactive web development", "The DOM, events, form validation, browser storage, APIs and modern JavaScript", "A to-do app that remembers tasks, and a weather app that loads live data"],
            ["5 · Professional workflow", "Git and GitHub, npm and Vite, code quality and automated tests", "A maintainable, tested, multi-page application in a GitHub repository"],
            ["6 · Deployment and portfolio", "Hosting, accessibility, SEO, performance, security and presenting your work", "A live, fast, accessible site at a public address, and a portfolio around it"],
          ],
        },
        why: "Knowing the destination makes every early lesson make sense. When Module 3 asks you to choose the right heading level, it is because Phase 6 measures how search engines and screen readers read your page.",
      },
      {
        id: "a-wd-welcome-method",
        title: "How every lesson works",
        explain:
          "Each lesson is a few atoms, one idea each. An atom explains the idea, shows it working, and then asks you to use it. From Module 3 onwards nearly every lesson has a lab: real files (index.html, style.css, app.js) in an editor beside a live preview. You can switch the preview between a phone (375 pixels wide), a tablet (768) and a laptop (1280), and when you press Check my page, your page itself is inspected, at the width each check names.",
        table: {
          caption: "What you will meet in a lesson.",
          headers: ["Part", "What it is", "What it asks of you"],
          rows: [
            ["Explanation", "The idea, plainly, with an example", "Read it, and look at the example"],
            ["Try it", "A worked example running live", "Change the code and watch what happens"],
            ["Build it", "A lab with a checklist", "Make the page meet every item on the list"],
            ["Make the call", "A real decision a developer faces", "Choose, and read why the others are wrong"],
            ["Lesson check", "Four questions, marked on our server", "Score 70% to complete the lesson"],
          ],
        },
        mistake:
          "Reading a lab's model answer and copying it. It passes the check and teaches nothing. The model answer appears after two attempts so you can compare, not so you can skip the thinking.",
        decision: {
          scenario:
            "You have tried a lab twice. Two items on the checklist are still red, and the button to show the model answer has appeared.",
          question: "What is the most useful thing to do next?",
          options: [
            {
              id: "a",
              text: "Read the red items again, read the hint, change your code and check again; open the model answer only to compare once you are truly stuck",
              why: "The checklist tells you exactly what the page is missing. Fixing it yourself is where the learning happens; the model answer is a last resort and a comparison, not a shortcut.",
            },
            {
              id: "b",
              text: "Copy the model answer into the editor to get the green tick",
              whyWrong: "It passes, and you leave knowing nothing you did not know before. The next lab builds on this one and you will be stuck again.",
            },
            {
              id: "c",
              text: "Skip the lab and go on to the next lesson",
              whyWrong: "A lab must be passed before the atom can be left, because the next idea depends on it.",
            },
            {
              id: "d",
              text: "Start again from an empty file",
              whyWrong: "Most of your page is probably right. Throwing it away hides the one or two things the checklist says are missing.",
            },
          ],
          correct: "a",
          aftermath: "Professional developers spend much of their day reading what is wrong and fixing it. You are practising that from lesson one.",
        },
      },
      {
        id: "a-wd-welcome-roadmap",
        title: "The road ahead: every module",
        explain:
          "Here is the whole course in order. Thirty-two modules teach, and after each phase a projects module asks you to build on your own. React is not in this course on purpose: it is the next course, WD-201, and it is far easier once you know what React is built on, which is everything below.",
        table: {
          caption: "All 38 modules, in teaching order.",
          headers: ["Module", "What it covers", "Phase"],
          rows: [
            ["Module 1", "Introduction to the Web", "1"],
            ["Module 2", "Your Development Environment", "1"],
            ["Module 3", "HTML Fundamentals", "1"],
            ["Module 4", "Semantic HTML and Page Structure", "1"],
            ["Module 5", "Forms and Accessibility", "1"],
            ["Phase 1 Projects", "Structured Websites", "1"],
            ["Module 6", "CSS Fundamentals", "2"],
            ["Module 7", "Colors, Typography and Styling", "2"],
            ["Module 8", "The CSS Box Model", "2"],
            ["Module 9", "Layout and Positioning", "2"],
            ["Module 10", "Responsive Web Design", "2"],
            ["Module 11", "Modern CSS Techniques", "2"],
            ["Module 12", "Design Implementation", "2"],
            ["Phase 2 Projects", "Responsive Interfaces", "2"],
            ["Module 13", "Introduction to Programming", "3"],
            ["Module 14", "Conditions and Decision-Making", "3"],
            ["Module 15", "Loops and Repetition", "3"],
            ["Module 16", "Functions", "3"],
            ["Module 17", "Arrays and Objects", "3"],
            ["Module 18", "Strings, Numbers and Errors", "3"],
            ["Module 19", "Problem-Solving and Algorithms", "3"],
            ["Phase 3 Projects", "Programming Problems", "3"],
            ["Module 20", "The Document Object Model (DOM)", "4"],
            ["Module 21", "Events and Interaction", "4"],
            ["Module 22", "Forms and Validation", "4"],
            ["Module 23", "Browser Storage", "4"],
            ["Module 24", "Asynchronous JavaScript and APIs", "4"],
            ["Module 25", "Modern JavaScript", "4"],
            ["Phase 4 Projects", "Interactive Applications", "4"],
            ["Module 26", "Git, GitHub and Development Tools", "5"],
            ["Module 27", "npm and Modern Tooling", "5"],
            ["Module 28", "Frontend Quality and Testing", "5"],
            ["Phase 5 Projects", "Maintainable Applications", "5"],
            ["Module 29", "Deployment and Hosting", "6"],
            ["Module 30", "Accessibility, SEO and Performance", "6"],
            ["Module 31", "Security and Maintenance", "6"],
            ["Module 32", "Portfolio and Professional Practice", "6"],
            ["Final Capstone Project", "A complete, deployed application", "6"],
          ],
        },
        why: "Phase 3 teaches programming with no web page in sight for a reason. People who learn the DOM before they can write a loop end up copying code they cannot change. You will understand why your code works.",
      },
      {
        id: "a-wd-welcome-first-page",
        title: "Your first change to a web page",
        explain:
          "This is a real web page: an HTML file that says what is on the page, and a CSS file that says how it looks. The preview beside the code is a browser showing it. You do not need to understand every line yet. Find the line that says Hello, world, change it to say hello in your own words, and add a second paragraph about yourself between <p> and </p>, copying the shape of the one that is there.",
        webLab: {
          task:
            "Change the main heading so it no longer says \"Hello, world\", and add a second paragraph of your own under the first one. Watch the preview change as you type.",
          files: { "index.html": PAGE, "style.css": PAGE_CSS },
          readOnly: ["style.css"],
          tests: [
            {
              label: "The heading says something of your own, not \"Hello, world\"",
              check: "const t = text('h1'); return t.length > 0 && t.toLowerCase() !== 'hello, world';",
              fail: "The heading still says Hello, world (or is empty). Change the words between <h1> and </h1>.",
            },
            {
              label: "The page has at least two paragraphs",
              check: "return $$('p').filter((p) => text(p).length > 0).length >= 2;",
              fail: "Add a second paragraph: a new line starting with <p> and ending with </p>, with your own words between them.",
            },
          ],
          solution: {
            "index.html": PAGE.replace("<h1>Hello, world</h1>", "<h1>Hello from Lagos</h1>").replace(
              "  <p>This page was built by a web developer.</p>\n",
              "  <p>This page was built by a web developer.</p>\n  <p>I am learning to build websites that work on every screen.</p>\n"
            ),
          },
          hint: "Every paragraph is wrapped in an opening <p> and a closing </p>. Copy the existing line, paste it below, and change only the words inside.",
          successMessage:
            "You just edited a web page and the browser redrew it. That loop, change the file and look at the result, is what web development is, every day, for the rest of the course.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 – 1.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l2-websites",
    moduleId: "wd-m1-web",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1", "1.2", "1.3", "1.4"],
    title: "Websites, Web Applications and Who Builds Them",
    subtitle: "What a website is, what web developers do, and frontend versus backend",
    estimatedMinutes: 17,
    intro:
      "You use websites every day without thinking about what they are made of. This lesson takes one apart: what files it is, who writes which part, and the difference between a site you read and an application you use.",

    atoms: [
      {
        id: "a-wd-what-is-website",
        title: "What is a website?",
        explain:
          "A website is a collection of related web pages, published under one address such as memorasmart.com, that anyone with a browser can visit. Each page is a file of HTML, usually with CSS that styles it, JavaScript that makes it interactive, and images, fonts and videos it uses. A browser downloads those files and turns them into the page you see.",
        table: {
          caption: "The three languages of every web page.",
          headers: ["Language", "Its job", "If it were a house"],
          rows: [
            ["HTML", "Structure and content: headings, paragraphs, images, links, forms", "The walls, rooms and doors"],
            ["CSS", "Presentation: colours, fonts, spacing, layout, how it adapts to the screen", "The paint, furniture and where everything stands"],
            ["JavaScript", "Behaviour: responding to clicks, checking forms, loading new data", "The electricity: lights, doorbell, alarm"],
          ],
        },
        webDemo: {
          caption: "One tiny page, all three languages. Click the button, then try changing the colour in style.css or the message in app.js.",
          files: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mama Put Kitchen</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Mama Put Kitchen</h1>
  <p>Jollof rice, plantain and pepper soup, served daily in Yaba.</p>
  <button id="hours">Show opening hours</button>
  <p id="answer"></p>
  <script src="app.js"></script>
</body>
</html>
`,
            "style.css": `body { font-family: Georgia, serif; padding: 24px; background: #fff7ed; }
h1 { color: #c2410c; }
button { padding: 10px 16px; border: 0; border-radius: 8px; background: #c2410c; color: white; }
`,
            "app.js": `document.querySelector("#hours").addEventListener("click", () => {
  document.querySelector("#answer").textContent = "Open 8am to 9pm, Monday to Saturday.";
});
`,
          },
        },
        why: "Every topic in this course belongs to one of these three languages or to the tools around them. When something on a page is wrong, the first question is always: is this structure, presentation or behaviour?",
      },
      {
        id: "a-wd-what-is-webdev",
        title: "What is web development?",
        explain:
          "Web development is the work of building websites and web applications: planning what a site must do, writing its code, testing it on real devices, publishing it on the internet and keeping it working. It is different from web design, which decides how a site should look and feel. Designers often hand developers a mockup; developers turn it into working pages.",
        table: {
          caption: "The work a web developer does in a typical project.",
          headers: ["Stage", "What happens"],
          rows: [
            ["Plan", "Agree what the site must do, for whom, and on which devices"],
            ["Build", "Write the HTML, CSS and JavaScript, often from a design"],
            ["Test", "Check it on phones and laptops, with a keyboard, in different browsers"],
            ["Deploy", "Publish it to a server so the public can reach it"],
            ["Maintain", "Fix bugs, update content and dependencies, improve speed"],
          ],
        },
        why: "Clients and employers pay for the whole cycle, not for typing code. A beautiful page that breaks on a cheap Android phone, or that nobody can find, has failed at the job.",
      },
      {
        id: "a-wd-front-back-full",
        title: "Frontend, backend and full-stack",
        explain:
          "The frontend is everything that runs in the user's browser: the HTML, CSS and JavaScript they see and click. The backend runs on a server the user never sees: it stores data in a database, checks passwords, takes payments and sends the frontend what it needs. A full-stack developer works on both. This course makes you a frontend developer, and teaches enough about servers to work with any backend.",
        table: {
          caption: "Who builds what on a food-delivery site.",
          headers: ["Part", "Frontend (in the browser)", "Backend (on the server)"],
          rows: [
            ["Menu", "Shows dishes, photos and prices, filters by category", "Stores the menu and prices in a database"],
            ["Login", "The form, and the message when a field is empty", "Checks the password and starts a session"],
            ["Checkout", "The basket, delivery form and order summary", "Charges the card and records the order"],
            ["Tracking", "A map that updates as the rider moves", "Receives the rider's location and sends updates"],
          ],
        },
        decision: {
          scenario:
            "A restaurant's ordering site has a bug: on phones, the Place order button is hidden behind the cookie banner, so customers cannot tap it.",
          question: "Whose work is this bug?",
          options: [
            {
              id: "a",
              text: "Frontend: it is about how the page is laid out in the browser",
              why: "Where elements sit on the screen, and what covers what, is CSS and HTML running in the browser. A frontend developer fixes it, and Module 10 is about exactly this kind of bug.",
            },
            {
              id: "b",
              text: "Backend: the server must be sending the wrong page",
              whyWrong: "The server sent the right page; the button exists. It is the layout on small screens that hides it.",
            },
            {
              id: "c",
              text: "The database administrator",
              whyWrong: "No stored data is wrong. The problem is entirely in what the browser draws.",
            },
            {
              id: "d",
              text: "Nobody: customers should use a laptop",
              whyWrong: "Most web traffic is on phones. A site that only works on laptops loses most of its customers.",
            },
          ],
          correct: "a",
          aftermath: "Most of what users complain about, things they cannot see, tap or read, is frontend work. That is why responsive design runs through this whole course.",
        },
      },
      {
        id: "a-wd-site-vs-app",
        title: "Websites versus web applications",
        explain:
          "There is no hard line, but a useful one. A website mainly presents information for you to read: a restaurant's menu, a news article, a company's About page. A web application lets you do things and remembers what you did: online banking, email, a spreadsheet, a ride-hailing booking. Applications have more JavaScript, user accounts and data that changes; websites have more content and must be found by search engines.",
        table: {
          caption: "Leaning one way or the other.",
          headers: ["Mostly a website", "Mostly a web application"],
          rows: [
            ["A church's events page", "A bank's internet banking"],
            ["A news article", "Gmail"],
            ["A portfolio", "Google Docs"],
            ["A hotel's brochure pages", "The hotel's booking and payment system"],
          ],
        },
        decision: {
          scenario:
            "A school asks for two things: pages describing the school, its fees and its location, and a portal where parents log in to see their child's results.",
          question: "How would you describe the two?",
          options: [
            {
              id: "a",
              text: "The information pages are a website; the results portal is a web application",
              why: "The pages present information that is the same for everyone. The portal has accounts and personal data that changes. They need different priorities: the site must be findable and fast, the portal must be secure.",
            },
            {
              id: "b",
              text: "Both are web applications because they are both on the internet",
              whyWrong: "Being on the internet makes both of them part of the web. What separates them is whether users read or do.",
            },
            {
              id: "c",
              text: "Both are websites because they are both made of HTML",
              whyWrong: "Applications are made of HTML too. The difference is purpose and behaviour, not the language.",
            },
            {
              id: "d",
              text: "The portal is a website and the pages are an application",
              whyWrong: "That is backwards: the portal is the part with logins and changing data.",
            },
          ],
          correct: "a",
          aftermath: "Phases 1 and 2 build websites. Phase 4 starts building applications. Most real projects, like this school's, are both.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.5 – 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l3-internet",
    moduleId: "wd-m1-web",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.5", "1.6", "1.7"],
    title: "The Internet, Browsers and Servers",
    subtitle: "How data travels, who asks and who answers, and what a URL means",
    estimatedMinutes: 18,
    intro:
      "When you type an address and press Enter, your phone talks to a computer that may be on another continent, and the page arrives in under a second. This lesson explains the machinery, because every performance and deployment decision later in the course rests on it.",

    atoms: [
      {
        id: "a-wd-internet",
        title: "How the internet works",
        explain:
          "The internet is a worldwide network of networks: cables under the sea, fibre between cities, mobile masts and home routers, all connected. Every device on it has an IP address, a number such as 142.250.200.4 that identifies it. Data travels in small packets; routers pass each packet along, network by network, until it reaches the address on it, where the packets are put back together.",
        table: {
          caption: "The pieces, and an everyday comparison.",
          headers: ["Piece", "What it does", "Like"],
          rows: [
            ["IP address", "Identifies a device on the internet", "A house's full postal address"],
            ["Packet", "A small piece of the data, carrying the destination address", "One parcel in a large delivery"],
            ["Router", "Passes packets towards their destination", "A sorting office"],
            ["DNS", "Turns a name like google.com into an IP address", "A phone book"],
            ["ISP", "The company connecting you: MTN, Airtel, a fibre provider", "The road from your street to the motorway"],
          ],
        },
        why: "A page made of 80 files means 80 requests travelling this network, each with a delay. That is why later modules care so much about fewer, smaller files: on a slow mobile connection every request costs the user time.",
      },
      {
        id: "a-wd-browser-server",
        title: "Browsers and web servers",
        explain:
          "The web works by request and response. A browser (Chrome, Safari, Firefox, Edge) is a client: it requests files and displays them. A web server is a computer that is always on, holding a site's files and answering requests for them. The browser asks for /menu.html, the server sends back the file with a status code saying whether it worked, and the browser renders it.",
        example:
          "  Your phone (browser)                       Server for kitchen.ng\n  ───────────────────                       ─────────────────────\n  \"Please send /menu.html\"   ───────────▶\n                             ◀───────────   \"200 OK\" + the HTML file\n  Reads the HTML, finds it needs style.css\n  \"Please send /style.css\"   ───────────▶\n                             ◀───────────   \"200 OK\" + the CSS file\n  Draws the page",
        decision: {
          scenario:
            "You save a change to your page's CSS on your laptop. Your friend in Abuja opens your published site and still sees the old colours.",
          question: "What is the most likely reason?",
          options: [
            {
              id: "a",
              text: "The change is only on your laptop; the server still has the old file, so that is what it sends",
              why: "Visitors get files from the server, never from your laptop. Until the new file is deployed to the server, everyone else receives the old one. Module 29 covers deploying.",
            },
            {
              id: "b",
              text: "Your friend's browser cannot display colours",
              whyWrong: "Every modern browser displays CSS colours. The problem is which file it received.",
            },
            {
              id: "c",
              text: "CSS only works in the city where it was written",
              whyWrong: "Files work the same everywhere; the question is which copy was sent.",
            },
            {
              id: "d",
              text: "The internet is too slow to send CSS",
              whyWrong: "A slow connection delays a file, it does not swap it for an older one.",
            },
          ],
          correct: "a",
          aftermath: "There are always two copies of a site: yours, which you edit, and the server's, which the world sees. Deploying is copying one to the other. Your friend's browser may also have cached the old file, which you will deal with in Phase 6.",
        },
      },
      {
        id: "a-wd-domains-urls",
        title: "Domains, hosting and URLs",
        explain:
          "Hosting is renting space on a server for your site's files. A domain name, such as kitchen.ng, is a human-friendly name you rent from a registrar and point at that server. A URL (uniform resource locator) is the full address of one resource on the web, and every part of it means something.",
        table: {
          caption: "Taking apart https://shop.kitchen.ng:443/menu/rice.html?size=large#reviews",
          headers: ["Part", "Example", "Meaning"],
          rows: [
            ["Scheme", "https://", "How to talk to the server: HTTP, encrypted"],
            ["Subdomain", "shop.", "A section of the domain, chosen by the owner"],
            ["Domain", "kitchen.ng", "The registered name; .ng is the top-level domain"],
            ["Port", ":443", "Which door on the server; usually left out, because 443 is HTTPS's default"],
            ["Path", "/menu/rice.html", "Which file or page on that server"],
            ["Query string", "?size=large", "Extra information for the page, as name=value pairs"],
            ["Fragment", "#reviews", "A place within the page to scroll to; never sent to the server"],
          ],
        },
        decision: {
          scenario:
            "A link to https://kitchen.ng/menu.html?category=soups#pepper-soup opens the menu page, already filtered to soups, scrolled to pepper soup.",
          question: "Which part of the URL did the server use to know which page to send?",
          options: [
            {
              id: "a",
              text: "The path, /menu.html",
              why: "The path names the resource. The query string adds detail the page can use (soups), and the fragment is used only by the browser to scroll after the page arrives.",
            },
            {
              id: "b",
              text: "The fragment, #pepper-soup",
              whyWrong: "The fragment is never sent to the server at all. The browser keeps it and scrolls to that spot.",
            },
            {
              id: "c",
              text: "The scheme, https://",
              whyWrong: "The scheme says how to connect (securely), not which page to fetch.",
            },
            {
              id: "d",
              text: "The domain, kitchen.ng",
              whyWrong: "The domain finds the server. The server then needs the path to know which of its pages you want.",
            },
          ],
          correct: "a",
          aftermath: "You will build URLs with query strings yourself in Module 24, when your JavaScript asks an API for data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.8 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l4-http-loading",
    moduleId: "wd-m1-web",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.8", "1.9", "1.10"],
    title: "HTTP, Page Loading and the Developer's Workflow",
    subtitle: "The language of requests, what happens after Enter, and how developers work",
    estimatedMinutes: 18,
    intro:
      "Browsers and servers speak a language called HTTP. This lesson teaches the words you will see every day in the developer tools, follows a page from the moment you press Enter to the moment it is drawn, and shows the loop a developer repeats all day.",

    atoms: [
      {
        id: "a-wd-http",
        title: "HTTP and HTTPS fundamentals",
        explain:
          "HTTP (hypertext transfer protocol) is the set of rules for requests and responses. A request has a method, saying what the browser wants to do, and a path. A response has a status code, saying how it went, headers describing the content, and usually a body: the HTML, image or data. HTTPS is HTTP inside an encrypted connection (TLS), so nobody between you and the server can read or change what is sent. Browsers mark plain HTTP pages as Not secure.",
        table: {
          caption: "The methods and status codes you will meet most.",
          headers: ["Code or method", "Meaning"],
          rows: [
            ["GET", "Send me this resource (loading a page, an image, data)"],
            ["POST", "Here is some data for you to process (submitting a form)"],
            ["200 OK", "It worked, here it is"],
            ["301 Moved Permanently", "It lives at a new address now; go there"],
            ["404 Not Found", "There is nothing at that path"],
            ["403 Forbidden", "It exists, and you may not have it"],
            ["500 Internal Server Error", "The server broke while answering"],
          ],
        },
        decision: {
          scenario:
            "A customer emails: \"Your contact page shows 404 Not Found.\" The rest of the site works.",
          question: "What does that tell you?",
          options: [
            {
              id: "a",
              text: "The server is running, but it has nothing at the path the link points to: the file is missing or the link is misspelled",
              why: "A 404 is a working server answering \"nothing here\". Check the link's spelling and that the file was deployed. Typos like contact.htm versus contact.html are the usual cause.",
            },
            {
              id: "b",
              text: "The whole server has crashed",
              whyWrong: "A crashed server could not reply with 404, or with the rest of the site. A server error would be a 500.",
            },
            {
              id: "c",
              text: "The customer is not allowed to see the page",
              whyWrong: "That would be 403 Forbidden. 404 means the server found nothing at all.",
            },
            {
              id: "d",
              text: "The page is loading slowly",
              whyWrong: "Slowness gives no status code; it just takes time. 404 is a definite answer.",
            },
          ],
          correct: "a",
          aftermath: "Status codes turn \"it's broken\" into a precise question. You will read them in the Network panel next module.",
        },
      },
      {
        id: "a-wd-page-load",
        title: "How a browser loads a webpage",
        explain:
          "Between pressing Enter and seeing the page, the browser works through a sequence. Each step takes time, and later modules on performance are about making each one faster.",
        table: {
          caption: "From Enter to pixels.",
          headers: ["Step", "What happens"],
          rows: [
            ["1 · DNS lookup", "Find the server's IP address for the domain"],
            ["2 · Connect", "Open a connection to the server, and for HTTPS agree encryption keys"],
            ["3 · Request the HTML", "GET the page; the server responds with HTML"],
            ["4 · Parse the HTML", "Read it top to bottom and build the DOM, a tree of every element"],
            ["5 · Fetch what it needs", "Request the CSS, JavaScript, images and fonts the HTML refers to"],
            ["6 · Build styles", "Combine the CSS into rules for every element"],
            ["7 · Layout", "Work out the size and position of every element for this screen width"],
            ["8 · Paint", "Draw the pixels; the page appears"],
            ["9 · Run JavaScript", "Scripts run, and can change the page, which may repeat steps 6 to 8"],
          ],
        },
        mistake:
          "Thinking the page is downloaded as one thing. It is the HTML first, and only then does the browser discover everything else it needs. A huge image or a slow script found late in the HTML delays the whole page.",
        decision: {
          scenario:
            "A page shows its text quickly, but stays unstyled (plain black text on white) for two seconds on a slow connection before the colours and layout appear.",
          question: "Which step is slow?",
          options: [
            {
              id: "a",
              text: "Fetching the CSS file, which the browser needs before it can style the page",
              why: "The HTML arrived and was drawn; the styles came later. A large or slow-to-download stylesheet, or one requested late, causes exactly this. Phase 6 shows how to speed it up.",
            },
            {
              id: "b",
              text: "The DNS lookup",
              whyWrong: "DNS happens before any HTML arrives. The text appeared quickly, so DNS was finished.",
            },
            {
              id: "c",
              text: "Running JavaScript",
              whyWrong: "Colours and layout come from CSS, not JavaScript, on a normal page.",
            },
            {
              id: "d",
              text: "Parsing the HTML",
              whyWrong: "The HTML was parsed: the text is on the screen.",
            },
          ],
          correct: "a",
          aftermath: "Knowing the order lets you diagnose a slow page by what you see, before you open a single tool.",
        },
      },
      {
        id: "a-wd-workflow",
        title: "Introduction to the developer's workflow",
        explain:
          "Developers work in a tight loop: edit a file in the code editor, save, look at the result in the browser, inspect anything that is wrong with the developer tools, and repeat. Around that loop sit two more habits: saving versions of the work with Git so nothing is ever lost, and deploying finished work to a server. You will set up the loop in Module 2, add Git in Module 26 and deploying in Module 29.",
        table: {
          caption: "One working session.",
          headers: ["Step", "Tool", "Where in the course"],
          rows: [
            ["Edit and save a file", "VS Code", "Module 2"],
            ["Look at the page", "A browser, at several widths", "Module 2, then every lab"],
            ["Find what is wrong", "The browser's developer tools", "Module 2"],
            ["Save a version of the work", "Git", "Module 26"],
            ["Share and back it up", "GitHub", "Module 26"],
            ["Publish it", "A host such as Netlify or Vercel", "Module 29"],
          ],
        },
        decision: {
          scenario:
            "You have spent an hour on a page and it looks right on your laptop.",
          question: "Before calling it finished, what should you do?",
          options: [
            {
              id: "a",
              text: "Check it at phone and tablet widths, try it with only the keyboard, and look in the console for errors",
              why: "\"Works on my laptop\" is where bugs hide. Most visitors use phones; some use only a keyboard; errors in the console are invisible until you look. These three checks find most problems before users do.",
            },
            {
              id: "b",
              text: "Nothing: if it looks right, it is right",
              whyWrong: "It looks right at one width, in one browser, with a mouse. Real visitors use many devices.",
            },
            {
              id: "c",
              text: "Ask the client to test it for you",
              whyWrong: "Testing is part of the developer's job. A client who finds the first bug stops trusting the rest.",
            },
            {
              id: "d",
              text: "Rewrite it in a different way to be safe",
              whyWrong: "Rewriting without a reason creates new bugs. Test what you have.",
            },
          ],
          correct: "a",
          aftermath: "Every lab in this course checks at least one of these for you. By Phase 6 you will do them by habit.",
        },
      },
    ],

    task: {
      title: "Module project: trace a real website",
      intro:
        "Pick a website you use often (your bank, a news site, your school). On a laptop, open it in Chrome or Edge and use what you learned in this module to take it apart. Write your answers in a notes file; you will open the developer tools properly in Module 2, so for now use only the address bar and your eyes.",
      prompts: [
        "Write the full URL of one page and label every part: scheme, subdomain, domain, path, and any query string or fragment.",
        "Is it served over HTTPS? How does the browser show you that?",
        "Is it mostly a website or mostly a web application? Give two reasons.",
        "Name two things on the page that are frontend work and two that must need a backend.",
        "Load the page on your phone and on your laptop. Write down three things that change between the two.",
      ],
      closing:
        "Keep these notes. In Module 2 you will open the Network panel on the same site and see every request you predicted here.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
