/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 6 · CSS FUNDAMENTALS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l25-css-intro", [
    q({
      id: "wdq25-1", atom: "a-wd-what-css", d: 1,
      prompt: "What is CSS responsible for?",
      options: ["How HTML is presented: colours, fonts, spacing and layout", "What the content means", "Fetching data from servers", "Storing user accounts"],
      correct: "a",
      explanation: "HTML is structure and meaning; CSS is presentation.",
      wrong: { b: "Meaning is HTML's job.", c: "That is JavaScript.", d: "That is the backend." },
    }),
    q({
      id: "wdq25-2", atom: "a-wd-css-locations", d: 2,
      prompt: "Why is an external stylesheet the best place for a site's CSS?",
      options: ["One file serves every page and is cached after the first visit", "It is the only kind browsers support", "It makes HTML files larger", "It has higher specificity"],
      correct: "a",
      explanation: "Change it once and every page changes; the browser downloads it once.",
      wrong: { b: "All three kinds work.", c: "It makes HTML smaller.", d: "Location does not change specificity; inline styles are the hardest to override." },
    }),
    q({
      id: "wdq25-3", atom: "a-wd-css-syntax", d: 2,
      prompt: "In `.price { color: green; }`, what is `color: green;`?",
      options: ["A declaration", "A selector", "A comment", "A class"],
      correct: "a",
      explanation: "A declaration is a property and a value, ending in a semicolon.",
      wrong: { b: ".price is the selector.", c: "Comments are /* … */.", d: "price is a class name; the line is a declaration." },
    }),
    q({
      id: "wdq25-4", atom: "a-wd-css-syntax", d: 3, type: "scenario",
      prompt: "`h1 { colr: red; font-size: 40px; }` makes the heading 40px but not red. Why?",
      options: ["colr is not a property, so the browser ignores that declaration", "Colours cannot be set on headings", "font-size overrides colour", "red is not a valid colour"],
      correct: "a",
      explanation: "Unknown properties are silently skipped; the next declaration still works.",
      wrong: { b: "Any element can be coloured.", c: "They are different properties.", d: "red is a valid named colour." },
    }),
  ]),

  ...check("wd-l26-selectors", [
    q({
      id: "wdq26-1", atom: "a-wd-specificity", d: 3,
      prompt: "Which selector has the highest specificity?",
      options: ["#nav a", ".menu .link", "ul li a", "a:hover"],
      correct: "a",
      explanation: "#nav a is (1,0,1). An ID outranks any number of classes.",
      wrong: { b: "(0,2,0): two classes, no ID.", c: "(0,0,3): elements only.", d: "(0,1,1): a pseudo-class counts as a class." },
    }),
    q({
      id: "wdq26-2", atom: "a-wd-basic-selectors", d: 2,
      prompt: "Why prefer classes to IDs for styling?",
      options: ["Classes are reusable and easy to override; IDs are unique and very specific", "IDs do not work in CSS", "Classes load faster", "IDs cannot be used in HTML"],
      correct: "a",
      explanation: "Low, even specificity keeps a stylesheet predictable.",
      wrong: { b: "They work, which is part of the problem.", c: "No speed difference.", d: "IDs are valid; they are best for links and JavaScript." },
    }),
    q({
      id: "wdq26-3", atom: "a-wd-combinators-attributes", d: 3,
      prompt: "Which selector matches only list items that are direct children of .menu?",
      options: [".menu > li", ".menu li", ".menu + li", ".menu ~ li"],
      correct: "a",
      explanation: "> is the child combinator.",
      wrong: { b: "A space matches descendants at any depth.", c: "+ is the next sibling of .menu.", d: "~ is any later sibling of .menu." },
    }),
    q({
      id: "wdq26-4", atom: "a-wd-pseudo", d: 2,
      prompt: "What does `.new::before { content: \"New: \"; }` do?",
      options: ["Inserts the text \"New: \" before the content of every .new element", "Selects the element before .new", "Runs only before the page loads", "Adds a new class"],
      correct: "a",
      explanation: "::before is a pseudo-element that generates content.",
      wrong: { b: "Pseudo-elements style parts of the element itself.", c: "It applies whenever the rule matches.", d: "It changes no classes." },
    }),
  ]),

  ...check("wd-l27-cascade", [
    q({
      id: "wdq27-1", atom: "a-wd-inheritance-cascade", d: 2,
      prompt: "Which property is inherited by default?",
      options: ["color", "margin", "border", "background-color"],
      correct: "a",
      explanation: "Text properties such as color and font-family inherit; box properties do not.",
      wrong: { b: "Margins are not inherited.", c: "Borders are not inherited.", d: "Backgrounds are not inherited (children are transparent, so it shows through)." },
    }),
    q({
      id: "wdq27-2", atom: "a-wd-inheritance-cascade", d: 3, type: "scenario",
      prompt: "Two rules with exactly the same selector set different colours on a paragraph. Which wins?",
      options: ["The one written later in the stylesheet", "The one written first", "Neither; the colours mix", "The shorter rule"],
      correct: "a",
      explanation: "With equal importance and specificity, source order decides.",
      wrong: { b: "Earlier loses ties.", c: "One value wins.", d: "Length is irrelevant." },
    }),
    q({
      id: "wdq27-3", atom: "a-wd-css-organisation", d: 2,
      prompt: "In what order should a stylesheet's sections usually go?",
      options: ["General base styles first, then layout, then components", "Components first, base last", "Alphabetical by selector", "The order styles were thought of"],
      correct: "a",
      explanation: "General to specific matches the cascade: later, more specific rules refine earlier ones.",
      wrong: { b: "Base rules last would override components when specificity ties.", c: "Alphabetical order ignores how the cascade works.", d: "That produces unpredictable files." },
    }),
    q({
      id: "wdq27-4", atom: "a-wd-browser-defaults", d: 2,
      prompt: "A page has an unexplained white gap around its edges. What is the usual cause?",
      options: ["The browser's default 8px margin on body", "A missing doctype", "Too many images", "The viewport tag"],
      correct: "a",
      explanation: "body { margin: 0; } removes it.",
      wrong: { b: "Quirks mode causes other problems, not this gap.", c: "Images do not add page margins.", d: "The viewport tag sets the layout width." },
    }),
  ]),
};
