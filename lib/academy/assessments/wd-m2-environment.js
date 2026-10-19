/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 2 · DEVELOPMENT ENVIRONMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l5-editor-files", [
    q({
      id: "wdq5-1", atom: "a-wd-install-vscode", d: 1,
      prompt: "Why should HTML be written in a code editor such as VS Code rather than a word processor?",
      options: [
        "Word processors save formatting and curly quotes, not the plain text HTML must be",
        "Word processors cannot open .html files at all",
        "Code editors make the page load faster for visitors",
        "Browsers only accept files made in VS Code",
      ],
      correct: "a",
      explanation: "HTML is plain text. A code editor saves exactly what you type and helps you see mistakes.",
      wrong: { b: "They can open them, which is part of the danger: they save them wrongly.", c: "The editor does not affect loading speed.", d: "Any plain-text file with the right extension works." },
    }),
    q({
      id: "wdq5-2", atom: "a-wd-files-extensions", d: 2,
      prompt: "What tells a browser that app.js is JavaScript?",
      options: ["Its file extension, .js", "Its size", "The folder it is in", "The first word inside it"],
      correct: "a",
      explanation: "The extension identifies the type of file to the operating system and, through the server, to the browser.",
      wrong: { b: "Size says nothing about type.", c: "Folders organise files; they do not define types.", d: "Contents are not used to decide what kind of file it is." },
    }),
    q({
      id: "wdq5-3", atom: "a-wd-project-folder", d: 2,
      prompt: "Why is a site's homepage usually named index.html?",
      options: [
        "Servers send index.html when someone visits a folder's address",
        "Browsers refuse other names",
        "It loads faster than other names",
        "Search engines only index that file",
      ],
      correct: "a",
      explanation: "Visiting kitchen.ng/ makes the server look for index.html in that folder.",
      wrong: { b: "Browsers open any .html file.", c: "The name has no effect on speed.", d: "Search engines index every linked page." },
    }),
    q({
      id: "wdq5-4", atom: "a-wd-project-folder", d: 2, type: "scenario",
      prompt: "Which file name follows the conventions taught in this lesson?",
      options: ["Our Team.html", "our-team.html", "OurTeam.HTML", "our team.htm"],
      correct: "b",
      explanation: "Lowercase, hyphens for spaces, the .html extension.",
      wrong: { a: "Spaces and capitals cause %20 in URLs and case problems on servers.", c: "Capitals can break links on case-sensitive servers.", d: "It has a space, and the course uses .html consistently." },
    }),
  ]),

  ...check("wd-l6-linking-files", [
    q({
      id: "wdq6-1", atom: "a-wd-create-files", d: 2,
      prompt: "Which element loads an external stylesheet?",
      options: [
        "<link rel=\"stylesheet\" href=\"style.css\">",
        "<script src=\"style.css\"></script>",
        "<style src=\"style.css\">",
        "<css href=\"style.css\">",
      ],
      correct: "a",
      explanation: "A link element in the head with rel=\"stylesheet\" loads CSS.",
      wrong: { b: "script loads JavaScript, not CSS.", c: "style holds CSS written inside the page; it has no src.", d: "There is no css element in HTML." },
    }),
    q({
      id: "wdq6-2", atom: "a-wd-create-files", d: 3, type: "scenario",
      prompt: "A script in the <head> runs document.querySelector(\"#status\") and gets null, though the page has <p id=\"status\">. Why?",
      options: [
        "The script runs before the browser has read the paragraph",
        "querySelector does not work on paragraphs",
        "ids cannot be used in scripts",
        "The CSS has not loaded",
      ],
      correct: "a",
      explanation: "The browser reads HTML top to bottom. A script placed before the element runs before the element exists. Put it before </body>.",
      wrong: { b: "querySelector finds any element.", c: "ids are exactly what scripts use to find elements.", d: "CSS loading does not create or remove elements." },
    }),
    q({
      id: "wdq6-3", atom: "a-wd-editor-browser", d: 1,
      prompt: "You change a colour using the browser's developer tools, then reload. What happens to your change?",
      options: ["It disappears, because devtools change only the page on screen", "It is saved to style.css", "It is published to the server", "It stays until the computer restarts"],
      correct: "a",
      explanation: "Devtools edits are experiments. Copy what works into your file in the editor.",
      wrong: { b: "Devtools do not write to your files.", c: "Nothing is published from devtools.", d: "A reload is enough to discard it." },
    }),
    q({
      id: "wdq6-4", atom: "a-wd-editor-browser", d: 2,
      prompt: "What does the Live Server extension do?",
      options: [
        "Serves your folder to the browser and reloads the page whenever you save",
        "Publishes your site to the internet",
        "Checks your spelling",
        "Converts CSS into HTML",
      ],
      correct: "a",
      explanation: "It shortens the edit, save, look loop to just edit and save.",
      wrong: { b: "It runs on your computer only; deploying is Module 34.", c: "That is a spell-checker extension.", d: "No tool does that; they are different languages." },
    }),
  ]),

  ...check("wd-l7-devtools", [
    q({
      id: "wdq7-1", atom: "a-wd-devtools-panels", d: 2,
      prompt: "Which developer tools panel lists every file the page requested, with its status code?",
      options: ["Network", "Elements", "Console", "Lighthouse"],
      correct: "a",
      explanation: "Network shows each request, its status (200, 404) and how long it took.",
      wrong: { b: "Elements shows the HTML and CSS of the page.", c: "Console shows JavaScript messages and errors.", d: "Lighthouse audits overall quality." },
    }),
    q({
      id: "wdq7-2", atom: "a-wd-devtools-panels", d: 2,
      prompt: "How do you see what your page looks like on a 375-pixel phone without owning one?",
      options: ["Turn on the device toolbar in the developer tools", "Zoom the browser to 50%", "Make the font smaller", "Open the Console"],
      correct: "a",
      explanation: "The device toolbar sets the viewport width exactly, which is what responsive CSS reacts to.",
      wrong: { b: "Zooming changes scale but is not the same as a phone's viewport.", c: "Font size is unrelated to screen width.", d: "The Console shows messages, not layouts." },
    }),
    q({
      id: "wdq7-3", atom: "a-wd-inspect-console", d: 2,
      prompt: "In the Elements panel's styles list, a CSS declaration is shown crossed out. What does that mean?",
      options: ["Another rule overrides it, so it is not applied", "It has a spelling mistake that deleted it", "It was applied twice", "It will apply after reloading"],
      correct: "a",
      explanation: "Crossed-out declarations lost to a stronger or later rule. Module 7 explains how CSS decides.",
      wrong: { b: "Invalid declarations show a warning icon; crossing out means overridden.", c: "Applying twice is not a thing CSS shows.", d: "Reloading changes nothing about which rule wins." },
    }),
    q({
      id: "wdq7-4", atom: "a-wd-inspect-console", d: 3, type: "scenario",
      prompt: "The Console shows: Uncaught TypeError: Cannot set properties of null (setting 'textContent') at app.js:7. What is the most likely cause?",
      options: [
        "On line 7, querySelector found no matching element, often a misspelled id or selector",
        "The CSS file is missing",
        "The browser does not support textContent",
        "The page has too many paragraphs",
      ],
      correct: "a",
      explanation: "null means nothing was found. Compare the selector on line 7 with the HTML.",
      wrong: { b: "CSS does not produce JavaScript errors.", c: "Every browser supports textContent.", d: "The number of elements is not the problem; a missing one is." },
    }),
  ]),

  ...check("wd-l8-errors-terminal", [
    q({
      id: "wdq8-1", atom: "a-wd-beginner-errors", d: 3, type: "scenario",
      prompt: "The logo shows on your laptop but is broken on the live site. The HTML says src=\"images/Logo.png\" and the file is logo.png. Why?",
      options: [
        "The server is case-sensitive, so Logo.png and logo.png are different files",
        "The live site has no images folder at all",
        "PNG images are not allowed on servers",
        "The laptop is faster",
      ],
      correct: "a",
      explanation: "Your laptop ignored the capital letter; most web servers do not. Use lowercase names everywhere.",
      wrong: { b: "Possible in general, but the capital letter explains the difference between laptop and server exactly.", c: "PNG is a standard web format.", d: "Speed does not turn a working image into a broken one." },
    }),
    q({
      id: "wdq8-2", atom: "a-wd-terminal", d: 2,
      prompt: "Which command moves you up to the parent folder?",
      options: ["cd ..", "ls", "mkdir ..", "cd /up"],
      correct: "a",
      explanation: ".. means the folder above the current one.",
      wrong: { b: "ls lists what is here.", c: "mkdir makes folders; it does not move you.", d: "There is no /up folder." },
    }),
    q({
      id: "wdq8-3", atom: "a-wd-terminal", d: 3,
      prompt: "You type mkdir My Site. What happens?",
      options: ["Two folders are made, My and Site", "One folder called My Site is made", "An error, because mkdir needs a file", "A file called My Site is made"],
      correct: "a",
      explanation: "Spaces separate arguments, so mkdir received two names. Use my-site.",
      wrong: { b: "Only with quotes, which is why spaces in names are avoided.", c: "mkdir is given folder names, which is what happened.", d: "mkdir makes folders, not files." },
    }),
    q({
      id: "wdq8-4", atom: "a-wd-organise-project", d: 2,
      prompt: "index.html is in the top folder and the stylesheet is in css/style.css. Which link is right?",
      options: [
        "<link rel=\"stylesheet\" href=\"css/style.css\">",
        "<link rel=\"stylesheet\" href=\"style.css\">",
        "<link rel=\"stylesheet\" href=\"/Users/ada/portfolio/css/style.css\">",
        "<link rel=\"stylesheet\" href=\"CSS/Style.css\">",
      ],
      correct: "a",
      explanation: "Relative to the page: into the css folder, then the file.",
      wrong: { b: "That looks for style.css next to index.html, where it is not.", c: "A path on your own computer does not exist on the server.", d: "Wrong capitals break on case-sensitive servers." },
    }),
  ]),
};
