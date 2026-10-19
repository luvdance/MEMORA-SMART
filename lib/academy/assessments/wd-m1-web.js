/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 1 · INTRODUCTION TO THE WEB
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l1-welcome", [
    q({
      id: "wdq1-1", atom: "a-wd-welcome-phases", d: 1,
      prompt: "In which phase of this course do you learn programming logic (variables, loops, functions) before working with the DOM?",
      options: ["Phase 1", "Phase 3", "Phase 5", "Phase 6"],
      correct: "b",
      explanation: "Phase 3 teaches JavaScript programming on its own, so that the interactive work in Phase 4 is built on understanding rather than copying.",
      wrong: { a: "Phase 1 is HTML and the web.", c: "Phase 5 is the professional workflow: Git, npm, Vite and testing.", d: "Phase 6 is deployment, performance, security and portfolio." },
    }),
    q({
      id: "wdq1-2", atom: "a-wd-welcome-method", d: 1,
      prompt: "What does pressing \"Check my page\" in a lab actually check?",
      options: [
        "Whether your code is identical to the model answer",
        "Your rendered page itself: its elements, styles and layout at the widths each check names",
        "Only whether the file has been saved",
        "How long you spent on the lab",
      ],
      correct: "b",
      explanation: "The checks inspect the real page in a browser, so any correct solution passes, not just one spelling of it.",
      wrong: { a: "Many different pages are correct; the checks test what the page does, not what the text is.", c: "Nothing is saved to a server; the page is rendered and inspected.", d: "Time is never measured." },
    }),
    q({
      id: "wdq1-3", atom: "a-wd-welcome-roadmap", d: 2,
      prompt: "Why is React not part of this course?",
      options: [
        "React is outdated",
        "It is a separate course, taken after you know the HTML, CSS and JavaScript it is built on",
        "React cannot build responsive sites",
        "React only works on the backend",
      ],
      correct: "b",
      explanation: "React is a JavaScript library for building interfaces. It is taught in its own course, WD-201, because it is much easier once the platform underneath it is solid.",
      wrong: { a: "React is widely used in industry.", c: "React pages are styled with the same CSS you will learn here.", d: "React runs in the browser; it is frontend." },
    }),
    q({
      id: "wdq1-4", atom: "a-wd-welcome-first-page", d: 1, type: "scenario",
      prompt: "In the first lab you changed the text between <h1> and </h1>. What did that change on the page?",
      options: ["The main heading", "The page's colour", "The browser tab's title", "Nothing until the page was published"],
      correct: "a",
      explanation: "h1 is the page's main heading element, and the preview redraws as soon as the file changes.",
      wrong: { b: "Colours come from the CSS file, which you did not edit.", c: "The tab's title comes from the <title> element in the head.", d: "The preview is a browser; it shows changes immediately, no publishing needed." },
    }),
  ]),

  ...check("wd-l2-websites", [
    q({
      id: "wdq2-1", atom: "a-wd-what-is-website", d: 1,
      prompt: "Which language controls the colours, fonts and layout of a web page?",
      options: ["HTML", "CSS", "JavaScript", "HTTP"],
      correct: "b",
      explanation: "CSS is the presentation layer: how the structured content looks and is arranged.",
      wrong: { a: "HTML gives structure and content.", c: "JavaScript gives behaviour, such as responding to clicks.", d: "HTTP is how files are requested and sent, not a page language." },
    }),
    q({
      id: "wdq2-2", atom: "a-wd-what-is-webdev", d: 2,
      prompt: "Which of these is part of a web developer's job, rather than a web designer's?",
      options: [
        "Turning a mockup into working HTML, CSS and JavaScript and testing it on real devices",
        "Choosing the brand's logo",
        "Writing the company's marketing slogans",
        "Deciding the company's prices",
      ],
      correct: "a",
      explanation: "Developers build, test, deploy and maintain. Designers decide how it should look; marketing and pricing belong to other roles.",
      wrong: { b: "Logos are branding and design work.", c: "Slogans are copywriting.", d: "Pricing is a business decision." },
    }),
    q({
      id: "wdq2-3", atom: "a-wd-front-back-full", d: 2, type: "scenario",
      prompt: "On a banking site, which task belongs to the backend?",
      options: [
        "Showing a red message when the password field is empty",
        "Checking the password against the stored account and transferring money",
        "Making the menu collapse into a button on phones",
        "Animating the Transfer button when it is pressed",
      ],
      correct: "b",
      explanation: "Verifying credentials and moving money must happen on the server, where users cannot interfere with it.",
      wrong: { a: "That message can be shown by the browser before anything is sent.", c: "Responsive menus are CSS and JavaScript in the browser.", d: "Animation is frontend presentation." },
    }),
    q({
      id: "wdq2-4", atom: "a-wd-site-vs-app", d: 2,
      prompt: "Which is the clearest example of a web application rather than a website?",
      options: ["A restaurant's menu page", "An online spreadsheet you edit and that saves your work", "A news article", "A portfolio of photographs"],
      correct: "b",
      explanation: "An application lets users do things and keeps their changing data. The others mainly present information.",
      wrong: { a: "A menu is information to read.", c: "An article is content to read.", d: "A portfolio presents work." },
    }),
  ]),

  ...check("wd-l3-internet", [
    q({
      id: "wdq3-1", atom: "a-wd-internet", d: 2,
      prompt: "What does DNS do?",
      options: [
        "Encrypts the connection",
        "Turns a domain name such as kitchen.ng into the server's IP address",
        "Stores the website's files",
        "Draws the page on the screen",
      ],
      correct: "b",
      explanation: "DNS works like a phone book: names in, numeric IP addresses out, so the browser knows where to connect.",
      wrong: { a: "Encryption is done by TLS, the S in HTTPS.", c: "Files are stored on the web server (hosting).", d: "The browser draws the page." },
    }),
    q({
      id: "wdq3-2", atom: "a-wd-browser-server", d: 2,
      prompt: "In the request and response model, what is the browser?",
      options: ["The server", "The client, which requests files and displays them", "The domain registrar", "The database"],
      correct: "b",
      explanation: "The browser asks; the server answers. That is the client and server relationship.",
      wrong: { a: "The server holds the files and answers requests.", c: "A registrar rents out domain names.", d: "A database stores data for the backend." },
    }),
    q({
      id: "wdq3-3", atom: "a-wd-domains-urls", d: 3, type: "scenario",
      prompt: "In https://blog.ada.dev/posts/first.html?ref=twitter#comments, which part is never sent to the server?",
      options: ["/posts/first.html", "?ref=twitter", "#comments", "blog."],
      correct: "c",
      explanation: "The fragment stays in the browser, which uses it to scroll to the element with that id.",
      wrong: { a: "The path is sent: it tells the server which page.", b: "The query string is sent with the request.", d: "The subdomain is part of the host name the browser connects to." },
    }),
    q({
      id: "wdq3-4", atom: "a-wd-domains-urls", d: 2,
      prompt: "What is web hosting?",
      options: [
        "Renting space on an always-on server that stores your site's files and answers requests for them",
        "Buying a domain name",
        "Designing the homepage",
        "Installing a browser",
      ],
      correct: "a",
      explanation: "Hosting is where the files live. The domain is a separate thing you point at the host.",
      wrong: { b: "A domain is the name; hosting is the place. You usually need both.", c: "Design is about how it looks.", d: "Browsers are what visitors use to view the hosted site." },
    }),
  ]),

  ...check("wd-l4-http-loading", [
    q({
      id: "wdq4-1", atom: "a-wd-http", d: 2,
      prompt: "A server replies 500 Internal Server Error. What does that mean?",
      options: [
        "The page does not exist",
        "Something went wrong on the server while it was answering",
        "You are not allowed to see the page",
        "Everything worked",
      ],
      correct: "b",
      explanation: "5xx codes are server failures. The request was fine; the server broke handling it.",
      wrong: { a: "That is 404 Not Found.", c: "That is 403 Forbidden.", d: "That is 200 OK." },
    }),
    q({
      id: "wdq4-2", atom: "a-wd-http", d: 2,
      prompt: "What does HTTPS add to HTTP?",
      options: [
        "Faster images",
        "An encrypted connection, so nobody in between can read or alter the data",
        "Automatic translation",
        "A free domain name",
      ],
      correct: "b",
      explanation: "HTTPS is HTTP over TLS. Passwords and personal data must always travel this way.",
      wrong: { a: "Speed comes from other things; encryption is the point.", c: "Translation is unrelated.", d: "Domains are bought separately." },
    }),
    q({
      id: "wdq4-3", atom: "a-wd-page-load", d: 3,
      prompt: "What does the browser do first after it receives the HTML of a page?",
      options: [
        "Paint the final pixels",
        "Parse it top to bottom into the DOM and discover the CSS, scripts and images it needs",
        "Look up the domain in DNS",
        "Run every JavaScript file before reading the HTML",
      ],
      correct: "b",
      explanation: "Parsing builds the DOM and reveals the other files to fetch. Painting comes after styles and layout are known.",
      wrong: { a: "Painting is one of the last steps.", c: "DNS has to happen before the HTML can be requested at all.", d: "Scripts are found by reading the HTML, so they cannot run first." },
    }),
    q({
      id: "wdq4-4", atom: "a-wd-workflow", d: 2, type: "scenario",
      prompt: "Which order matches the developer's everyday loop?",
      options: [
        "Edit and save, look in the browser, inspect what is wrong, repeat",
        "Deploy, then write the code",
        "Write everything, never look at it until the end",
        "Edit the live server's files directly while users browse",
      ],
      correct: "a",
      explanation: "Small changes, checked in the browser immediately, catch mistakes while they are easy to fix.",
      wrong: { b: "You cannot deploy what is not written.", c: "Problems pile up and become hard to untangle.", d: "Editing the live site exposes users to broken work; that is what local development and deploys avoid." },
    }),
  ]),
};
