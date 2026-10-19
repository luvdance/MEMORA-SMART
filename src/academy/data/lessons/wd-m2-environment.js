/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 2 · YOUR DEVELOPMENT ENVIRONMENT
 *
 * Curriculum 2.1 – 2.10. VS Code, files and folders, the first project, the
 * browser's developer tools, the console, the errors every beginner meets,
 * the terminal and a project organised the way professionals organise one.
 *
 * The terminal transcript was recorded from a real Bash session.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s2-environment";

const LINK_START = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Linked files</title>
  <!-- 1. Link style.css here -->
</head>
<body>
  <h1>Three files, one page</h1>
  <p id="status">JavaScript has not run yet.</p>

  <!-- 2. Link app.js here, just before </body> -->
</body>
</html>
`;

const LINK_CSS = `body {
  font-family: Arial, sans-serif;
  padding: 24px;
}

h1 {
  color: rgb(29, 78, 216);
}
`;

const LINK_JS = `document.querySelector("#status").textContent = "JavaScript is connected.";
console.log("app.js loaded");
`;

const ORG_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ada's Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Ada Okafor</h1>
  <img src="profile.jpg" alt="Ada smiling in front of a bookshelf" width="200">
  <p id="greeting"></p>
  <script src="App.js"></script>
</body>
</html>
`;

const ORG_CSS = `body {
  font-family: Arial, sans-serif;
  padding: 24px;
  background: rgb(240, 253, 250);
}
`;

const ORG_JS = `document.querySelector("#greeting").textContent = "Welcome to my portfolio.";
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l5-editor-files",
    moduleId: "wd-m2-environment",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "VS Code, Files and Your First Project Folder",
    subtitle: "The editor professionals use, how files are named, and where a project lives",
    estimatedMinutes: 16,
    intro:
      "Every website is a folder of files. Before writing any more HTML you need a proper editor, a clear idea of what a file extension does, and a folder for each project, named so that servers and browsers can find everything in it.",

    atoms: [
      {
        id: "a-wd-install-vscode",
        title: "Installing Visual Studio Code",
        explain:
          "Visual Studio Code (VS Code) is a free code editor from Microsoft, used by most web developers. Unlike a word processor, it saves plain text exactly as you type it, colours your code so mistakes stand out, suggests completions and can open a whole project folder at once. Download it from code.visualstudio.com, run the installer, and on Windows tick \"Add to PATH\" and \"Open with Code\" so you can open folders from the terminal and from File Explorer.",
        table: {
          caption: "Three free extensions worth installing on day one (Extensions panel, Ctrl+Shift+X).",
          headers: ["Extension", "What it does"],
          rows: [
            ["Live Server", "Opens your page in the browser and reloads it every time you save"],
            ["Prettier", "Formats your code consistently when you save"],
            ["Code Spell Checker", "Catches spelling mistakes in your text and names"],
          ],
        },
        mistake:
          "Writing HTML in Microsoft Word or Notepad with \"smart quotes\". Word saves formatting, not plain text, and curly quotes (“ ”) are not the straight quotes (\" \") HTML needs. Always use a code editor.",
        why: "You will spend thousands of hours in your editor. A good one catches typos as you make them, which is most of what beginners lose time on.",
      },
      {
        id: "a-wd-files-extensions",
        title: "Files, folders and file extensions",
        explain:
          "A file's extension, the letters after the last dot, tells the computer and the browser what kind of file it is. Browsers treat index.html as a page, style.css as a stylesheet and app.js as JavaScript. Windows hides extensions by default, which causes real confusion (a file that looks like index.html may be index.html.txt), so turn them on: File Explorer → View → Show → File name extensions.",
        table: {
          caption: "Extensions you will use in this course.",
          headers: ["Extension", "Kind of file"],
          rows: [
            [".html", "A web page"],
            [".css", "A stylesheet"],
            [".js", "JavaScript"],
            [".json", "Data, in JavaScript Object Notation"],
            [".jpg .png .webp .svg", "Images: photographs, graphics, modern compressed, vector"],
            [".md", "Markdown, used for README files"],
          ],
        },
        decision: {
          scenario:
            "A friend sends you index.html. You double-click it and it opens in Notepad as text instead of in the browser. File Explorer shows its name as index.html.",
          question: "What is the most likely cause?",
          options: [
            {
              id: "a",
              text: "Extensions are hidden, and the file is really index.html.txt",
              why: "With extensions hidden, Windows shows index.html for a file whose real name ends in .txt, so it opens as a text file. Show extensions and rename it.",
            },
            {
              id: "b",
              text: "The HTML inside is wrong",
              whyWrong: "Which program opens a file depends on its extension, not on its contents. Broken HTML would still open in a browser.",
            },
            {
              id: "c",
              text: "Notepad is the only program that can open HTML",
              whyWrong: "Browsers open .html files; that is their purpose.",
            },
            {
              id: "d",
              text: "The file is too large for a browser",
              whyWrong: "Browsers open very large pages. The program chosen depends on the extension.",
            },
          ],
          correct: "a",
          aftermath: "Turn on file name extensions today. It removes a whole class of confusing problems.",
        },
      },
      {
        id: "a-wd-project-folder",
        title: "Creating a project folder",
        explain:
          "Give every project its own folder, and open that folder in VS Code (File → Open Folder) rather than single files. The homepage is called index.html, because servers send index.html when someone visits a folder's address. Name files and folders in lowercase, with hyphens instead of spaces: about-us.html, not About Us.html. Servers are often case-sensitive and spaces become %20 in URLs.",
        example:
          "projects/\n└── bakery-site/          ← one folder per project\n    ├── index.html        ← the homepage, always index.html\n    ├── about.html\n    ├── css/\n    │   └── style.css\n    ├── js/\n    │   └── app.js\n    └── images/\n        └── cake.jpg",
        decision: {
          scenario:
            "You are about to save the contact page of a bakery's website.",
          question: "Which file name is best?",
          options: [
            {
              id: "a",
              text: "contact.html",
              why: "Lowercase, no spaces, a clear name and the right extension. Its URL will be a clean /contact.html on every server.",
            },
            {
              id: "b",
              text: "Contact Page.html",
              whyWrong: "The space becomes Contact%20Page.html in the address, and the capitals break links on case-sensitive servers if anyone types contact.",
            },
            {
              id: "c",
              text: "contact",
              whyWrong: "Without .html the browser and server do not know it is a web page.",
            },
            {
              id: "d",
              text: "CONTACT.HTML",
              whyWrong: "It works only if every link uses the same capitals. Lowercase everywhere removes the risk entirely.",
            },
          ],
          correct: "a",
          aftermath: "Lowercase and hyphens, always. You will see why case matters in this module's last lesson.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.4 – 2.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l6-linking-files",
    moduleId: "wd-m2-environment",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5"],
    title: "HTML, CSS and JavaScript Files, Linked",
    subtitle: "Three files that become one page, and what the editor and the browser each do",
    estimatedMinutes: 16,
    intro:
      "A page's HTML must tell the browser where its CSS and JavaScript are. Until it does, they are just files sitting in a folder. This lesson connects them, and makes clear the difference between the program you write in and the program that shows the result.",

    atoms: [
      {
        id: "a-wd-create-files",
        title: "Creating and linking HTML, CSS and JavaScript files",
        explain:
          "Create index.html, style.css and app.js in your project folder (in VS Code: right-click in the Explorer → New File). Then link them from the HTML. A <link> element in the <head> loads the stylesheet. A <script> element loads the JavaScript; put it just before </body> so the elements it works with already exist when it runs.",
        example:
          "<head>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  ...the page...\n  <script src=\"app.js\"></script>\n</body>",
        webLab: {
          task:
            "This page has three files, but index.html is not linked to the other two yet, so the heading is not blue and JavaScript has not run. Add a <link> for style.css in the head and a <script> for app.js just before </body>.",
          files: { "index.html": LINK_START, "style.css": LINK_CSS, "app.js": LINK_JS },
          readOnly: ["style.css", "app.js"],
          tests: [
            {
              label: "style.css is linked: the heading turns blue",
              check: "return style('h1', 'color') === 'rgb(29, 78, 216)';",
              fail: "The heading is not blue, so style.css is not loading. In the head add: <link rel=\"stylesheet\" href=\"style.css\">",
            },
            {
              label: "app.js is linked and runs: the status line changes",
              check: "return text('#status') === 'JavaScript is connected.';",
              fail: "The status line has not changed, so app.js has not run. Before </body> add: <script src=\"app.js\"></script>",
            },
            {
              label: "The script runs after the elements it uses exist (no errors in the console)",
              check: "return errors().length === 0;",
              fail: "The console shows an error. If your script tag is in the head, it runs before the paragraph exists: move it to just before </body>.",
            },
          ],
          solution: {
            "index.html": LINK_START.replace("  <!-- 1. Link style.css here -->", '  <link rel="stylesheet" href="style.css">').replace(
              "  <!-- 2. Link app.js here, just before </body> -->",
              '  <script src="app.js"></script>'
            ),
          },
          hint: "A link needs rel=\"stylesheet\" and href=\"style.css\". A script needs src=\"app.js\" and a closing </script>.",
          successMessage: "Three files, one page. Every project in this course starts exactly like this.",
        },
      },
      {
        id: "a-wd-editor-browser",
        title: "The code editor and the browser",
        explain:
          "The editor and the browser do different jobs. The editor changes files on your disk; the browser reads those files and draws a page. So the browser only sees what you have SAVED, and only when it loads the page again. Live Server automates both: it serves your folder and reloads the browser whenever you save. Changes you make in the browser's developer tools are the opposite: they change the page on screen only, and vanish when you reload.",
        table: {
          caption: "Who does what.",
          headers: ["", "Code editor (VS Code)", "Browser (Chrome, Edge, Firefox)"],
          rows: [
            ["Reads", "Your files as text", "Your saved files as a page"],
            ["Changes", "The files on disk", "Only the page on screen (devtools edits are temporary)"],
            ["Shows mistakes", "Red underlines, missing tags", "Broken layout, console errors"],
          ],
        },
        decision: {
          scenario:
            "You change a heading's colour in style.css. The browser still shows the old colour. A white dot is showing on the style.css tab in VS Code.",
          question: "What should you do?",
          options: [
            {
              id: "a",
              text: "Save the file (Ctrl+S); the white dot means unsaved changes",
              why: "The browser reads the file on disk, and your change is only in the editor. Save, and Live Server reloads the page. Turn on File → Auto Save to stop this happening.",
            },
            {
              id: "b",
              text: "Reinstall the browser",
              whyWrong: "The browser is fine. It is showing the file as it is on disk, which has not changed yet.",
            },
            {
              id: "c",
              text: "Make the change again in the developer tools",
              whyWrong: "Devtools edits disappear on reload and never reach your file.",
            },
            {
              id: "d",
              text: "Rename style.css",
              whyWrong: "Renaming would break the link in your HTML. Saving is all that is missing.",
            },
          ],
          correct: "a",
          aftermath: "\"Did I save?\" is the first question for any change that does not appear. It is the most common beginner bug there is.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.6 – 2.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l7-devtools",
    moduleId: "wd-m2-environment",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.6", "2.7"],
    title: "The Browser's Developer Tools",
    subtitle: "Inspecting elements, and reading what the console tells you",
    estimatedMinutes: 17,
    intro:
      "Every modern browser has a full set of developer tools built in. They are how you find out why a page looks or behaves the way it does, instead of guessing. Open them with F12, or right-click anything on a page and choose Inspect.",

    atoms: [
      {
        id: "a-wd-devtools-panels",
        title: "Using browser developer tools",
        explain:
          "The developer tools (devtools) are a set of panels. You will use four of them all the time. The device toolbar (the phone-and-tablet icon, or Ctrl+Shift+M) makes the page behave as if it were on a phone of any width, which is how you will test responsive layouts from Phase 2 on.",
        table: {
          caption: "The panels you will use most (Chrome and Edge names).",
          headers: ["Panel", "What it shows", "Use it to"],
          rows: [
            ["Elements", "The live page as HTML, and the CSS applied to the selected element", "Find why something looks wrong; try CSS changes"],
            ["Console", "Messages and errors from the page's JavaScript", "Read errors; run JavaScript"],
            ["Network", "Every file the page requested, with status code, size and time", "Find missing (404) or slow files"],
            ["Lighthouse", "An audit of performance, accessibility and SEO", "Measure quality (Module 30)"],
            ["Device toolbar", "The page at a chosen screen width", "Test phones and tablets"],
          ],
        },
        decision: {
          scenario:
            "Your page's logo does not appear. There is a broken-image icon where it should be.",
          question: "Which panel answers \"why\" fastest?",
          options: [
            {
              id: "a",
              text: "Network, which shows the image request and its status, probably 404 with the wrong path",
              why: "The Network panel lists every request. A red 404 on the logo shows the exact path the browser tried, which you can compare with where the file really is.",
            },
            {
              id: "b",
              text: "Lighthouse",
              whyWrong: "Lighthouse audits overall quality. It is slow and indirect for one missing file.",
            },
            {
              id: "c",
              text: "None: reinstall the browser",
              whyWrong: "The browser is reporting a real problem with your page; the tools will tell you what.",
            },
            {
              id: "d",
              text: "The device toolbar",
              whyWrong: "That changes the screen size. A missing file is missing at every size.",
            },
          ],
          correct: "a",
          aftermath: "Missing image, stylesheet or script: open Network, reload, look for red.",
        },
      },
      {
        id: "a-wd-inspect-console",
        title: "Inspecting elements and console messages",
        explain:
          "In the Elements panel, click any element to see its HTML and, on the right, every CSS rule applied to it, with rules that lost the argument crossed out. In the Console you see what JavaScript reports: messages a developer printed with console.log(), warnings in yellow, and errors in red with the file and line number where they happened. A red error usually means the rest of that script stopped running.",
        example:
          "In app.js:\n  console.log(\"Menu ready\");\n  console.warn(\"Image is very large\");\n  document.querySelector(\"#cart\").textContent = \"0 items\";\n\nIn the Console, if there is no element with id=\"cart\":\n  Menu ready\n  ⚠ Image is very large\n  ✖ Uncaught TypeError: Cannot set properties of null (setting 'textContent')\n        at app.js:3",
        webLab: {
          task:
            "The panel under the preview is a console, like the one in devtools. Make app.js print exactly the message Page ready with console.log(), and fix the red error: the script looks for an element with id=\"total\", but the page's paragraph has a different id. Make the HTML and the JavaScript agree.",
          files: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Basket</title>
</head>
<body>
  <h1>Your basket</h1>
  <p id="totl">Total: loading…</p>
  <script src="app.js"></script>
</body>
</html>
`,
            "app.js": `// Print the message Page ready here

document.querySelector("#total").textContent = "Total: ₦4,500";
`,
          },
          tests: [
            {
              label: "The console shows exactly: Page ready",
              check: "return logs().includes('Page ready');",
              fail: "The console does not show Page ready. Add console.log(\"Page ready\"); to app.js, spelled exactly like that.",
            },
            {
              label: "There are no red errors in the console",
              check: "return errors().length === 0;",
              fail: "There is still an error: the script cannot find #total. Fix the misspelled id in index.html so it matches.",
            },
            {
              label: "The total is shown on the page",
              check: "return text('#total') === 'Total: ₦4,500';",
              fail: "The paragraph does not show the total yet. Its id must be exactly total.",
            },
          ],
          solution: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Basket</title>
</head>
<body>
  <h1>Your basket</h1>
  <p id="total">Total: loading…</p>
  <script src="app.js"></script>
</body>
</html>
`,
            "app.js": `console.log("Page ready");

document.querySelector("#total").textContent = "Total: ₦4,500";
`,
          },
          hint: "Read the red error in the console: it names what was null. The id in the HTML is missing a letter.",
          successMessage:
            "You read an error, found its cause and fixed it. That is the core skill of debugging, and the console is where it starts.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.8 – 2.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l8-errors-terminal",
    moduleId: "wd-m2-environment",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.8", "2.9", "2.10"],
    title: "Beginner Errors, the Terminal and a Well-Organised Project",
    subtitle: "The mistakes everyone makes, your first commands, and folders that scale",
    estimatedMinutes: 19,
    intro:
      "Most hours lost by beginners go on the same handful of mistakes. This lesson names them, introduces the terminal you will use for Git and npm later, and organises a project the way you will organise every project from now on.",

    atoms: [
      {
        id: "a-wd-beginner-errors",
        title: "Understanding common beginner errors",
        explain:
          "When a change does not show or a file does not load, the cause is almost always one of a few things. Check them in this order before anything else.",
        table: {
          caption: "The usual suspects.",
          headers: ["Symptom", "Most likely cause", "Check"],
          rows: [
            ["My change does not appear", "File not saved, or the wrong file is open", "The dot on the editor tab; the file name in the address bar"],
            ["Styles do not apply at all", "Wrong path in <link>, or a missing rel=\"stylesheet\"", "Network panel: is style.css a 404?"],
            ["Image is broken", "Wrong path or wrong capitals: Photo.JPG versus photo.jpg", "Network panel; compare the exact name"],
            ["Half the page is bold or in a link", "A tag that was never closed", "Look for the missing </b> or </a>"],
            ["Script does nothing", "Error earlier in the script, or it ran before the HTML existed", "Console: read the first red error"],
            ["Works locally, broken online", "Case-sensitive server and a capital letter in a path", "Rename everything to lowercase"],
          ],
        },
        why: "Windows and macOS usually ignore capital letters in file names; most web servers do not. A link to Images/Logo.png that works on your laptop can be a 404 the moment the site goes live.",
      },
      {
        id: "a-wd-terminal",
        title: "Introduction to the terminal",
        explain:
          "The terminal (also called the command line or shell) lets you control the computer by typing commands. Web developers use it every day for Git, npm and build tools. In VS Code open one with Terminal → New Terminal; it starts in your project folder. A few commands get you a long way: ls lists what is in the current folder, cd moves into a folder (cd .. moves up one), and mkdir makes a new folder.",
        table: {
          caption: "Your first commands (Bash, which Git for Windows, macOS and Linux all provide).",
          headers: ["Command", "What it does"],
          rows: [
            ["ls", "List the files and folders here"],
            ["cd portfolio", "Move into the portfolio folder"],
            ["cd ..", "Move up to the parent folder"],
            ["mkdir portfolio", "Make a new folder called portfolio"],
            ["touch index.html", "Create an empty file"],
            ["clear", "Clear the screen"],
          ],
        },
        terminalExercise: {
          prompt: "ada@laptop:~/projects$",
          intro: "Recorded from a real Bash session, in a folder that already holds some notes and a recipes project.",
          goal: "You are starting a new portfolio project. First see what is in this folder, then make a new folder called portfolio for it.",
          commands: {
            ls: "notes.txt  recipes",
            "mkdir portfolio": "",
            "cd protfolio": "bash: cd: protfolio: No such file or directory",
            "mkdir Portfolio Site": "",
          },
          available: ["ls", "mkdir portfolio"],
          accept: ["mkdir portfolio"],
          near: [
            {
              command: "mkdir Portfolio Site",
              why: "That made TWO folders, Portfolio and Site, because a space separates arguments. Project folders should be one lowercase word or hyphenated: portfolio.",
            },
            {
              command: "cd protfolio",
              why: "cd moves into a folder that already exists, and this one is misspelled. Make the folder first, with mkdir.",
            },
          ],
          hint: "The command to make a directory is mkdir, followed by the folder's name.",
          success:
            "mkdir printed nothing, and that is success: most commands only speak up when something goes wrong. Next you would cd portfolio and create your files.",
        },
      },
      {
        id: "a-wd-organise-project",
        title: "Organizing a web project correctly",
        explain:
          "As soon as a site has more than a couple of files, group them by kind: css/ for stylesheets, js/ for scripts, images/ for pictures, with the HTML pages at the top. Paths in your HTML are then written relative to the page: a page in the top folder links css/style.css. Keep every name lowercase and consistent, and the same paths work on your laptop and on any server.",
        example:
          "portfolio/\n├── index.html          <link rel=\"stylesheet\" href=\"css/style.css\">\n├── css/                <script src=\"js/app.js\"></script>\n│   └── style.css       <img src=\"images/profile.jpg\" alt=\"…\">\n├── js/\n│   └── app.js\n└── images/\n    └── profile.jpg",
        webLab: {
          task:
            "This project has been organised into css/, js/ and images/ folders, but index.html still uses the old paths, and one has the wrong capitals. Fix the three paths in index.html so the styles load, the photo shows and the greeting appears. The files are listed in the tabs with their folders.",
          files: {
            "index.html": ORG_HTML,
            "css/style.css": ORG_CSS,
            "js/app.js": ORG_JS,
          },
          readOnly: ["css/style.css", "js/app.js"],
          tests: [
            {
              label: "The stylesheet loads from css/style.css (the page turns pale green)",
              check: "return style('body', 'background-color') === 'rgb(240, 253, 250)';",
              fail: "The styles are not loading. The link must point to css/style.css.",
            },
            {
              label: "The photo loads from images/profile.jpg",
              check: "const img = $('img'); return img && img.complete && img.naturalWidth > 0;",
              fail: "The photo is broken. Its file is images/profile.jpg.",
            },
            {
              label: "The script loads from js/app.js and shows the greeting",
              check: "return text('#greeting') === 'Welcome to my portfolio.';",
              fail: "The greeting is missing, so the script did not load. Its path is js/app.js, all lowercase: App.js is a different name on a web server.",
            },
          ],
          solution: {
            "index.html": ORG_HTML.replace('href="style.css"', 'href="css/style.css"')
              .replace('src="profile.jpg"', 'src="images/profile.jpg"')
              .replace('src="App.js"', 'src="js/app.js"'),
          },
          hint: "Each path starts from where index.html is: the folder name, a slash, then the file name, exactly as the tabs show them.",
          successMessage:
            "Every file found, every path relative to the page and all in lowercase. This structure will work unchanged on any web server in the world.",
        },
      },
    ],

    task: {
      title: "Module project: your first real project folder",
      intro:
        "On your own computer, set up the workspace you will use for the rest of the course.",
      prompts: [
        "Install VS Code with the Live Server and Prettier extensions, and turn on Auto Save.",
        "Turn on file name extensions in your file manager.",
        "Using the terminal, make a folder called portfolio with css, js and images folders inside it.",
        "Create index.html, css/style.css and js/app.js, link them, and give the page a heading and a coloured background.",
        "Make app.js print a message with console.log(). Open the page with Live Server, open the devtools, and confirm the message appears in the Console and that all three files show 200 in the Network panel.",
      ],
      closing:
        "Take a screenshot of the Network panel with all three requests at 200. That folder is where your Phase 1 projects will live.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
