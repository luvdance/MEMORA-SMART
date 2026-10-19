/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 4 · SEMANTIC HTML
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l13-semantic", [
    q({
      id: "wdq13-1", atom: "a-wd-what-semantic", d: 2,
      prompt: "Why use <button> rather than a <div> styled to look like one?",
      options: [
        "A button can be focused with the keyboard, pressed with Enter or Space, and is announced as a button",
        "Buttons load faster",
        "Divs cannot be styled",
        "Buttons are the only elements that can be clicked",
      ],
      correct: "a",
      explanation: "Native elements come with behaviour and meaning; a div has neither.",
      wrong: { b: "Speed is not the difference.", c: "Divs can be styled; that is how the imitation is made.", d: "Mouse users can click a div; keyboard and screen-reader users cannot use it." },
    }),
    q({
      id: "wdq13-2", atom: "a-wd-landmarks", d: 2,
      prompt: "How many <main> elements should a page have?",
      options: ["One", "One per section", "None", "As many as there are articles"],
      correct: "a",
      explanation: "main marks the page's unique content, so there is one, which assistive technology can jump straight to.",
      wrong: { b: "Sections go inside the single main.", c: "Without it, users cannot skip to the content.", d: "Articles go inside main." },
    }),
    q({
      id: "wdq13-3", atom: "a-wd-landmarks", d: 3, type: "scenario",
      prompt: "A news site lists six stories, each with a headline, summary and link, any of which could be shared on its own. Which element should wrap each story?",
      options: ["<article>", "<section>", "<aside>", "<nav>"],
      correct: "a",
      explanation: "An article is self-contained: it would make sense on its own.",
      wrong: { b: "A section is a themed group; the six stories together could be one section.", c: "aside is secondary, related content.", d: "nav is for major navigation blocks." },
    }),
    q({
      id: "wdq13-4", atom: "a-wd-div-span", d: 2,
      prompt: "Which is a good use of <span>?",
      options: [
        "Marking the price within a sentence so CSS can colour it",
        "Wrapping the whole site footer",
        "Making a clickable menu button",
        "Holding the main navigation",
      ],
      correct: "a",
      explanation: "A span marks part of a line when no meaningful element fits.",
      wrong: { b: "Use <footer>.", c: "Use <button>.", d: "Use <nav>." },
    }),
  ]),

  ...check("wd-l14-pages-tables", [
    q({
      id: "wdq14-1", atom: "a-wd-multi-section", d: 2,
      prompt: "A link has href=\"#pricing\". What must exist for it to work?",
      options: ["An element with id=\"pricing\" on the page", "A file called pricing.html", "A class called pricing", "A heading containing the word Pricing"],
      correct: "a",
      explanation: "A fragment link jumps to the element whose id matches.",
      wrong: { b: "That would be href=\"pricing.html\".", c: "Fragments match ids, not classes.", d: "The text of a heading is not used; the id is." },
    }),
    q({
      id: "wdq14-2", atom: "a-wd-multi-page-nav", d: 2,
      prompt: "What does aria-current=\"page\" on a navigation link do?",
      options: [
        "Tells screen readers that this link is the page being viewed, and lets CSS style it",
        "Makes the link open in a new tab",
        "Hides the link",
        "Makes the page load first",
      ],
      correct: "a",
      explanation: "It marks the current page so it is announced, and gives CSS a hook to highlight it.",
      wrong: { b: "That is target=\"_blank\".", c: "It does not hide anything.", d: "It has no effect on loading." },
    }),
    q({
      id: "wdq14-3", atom: "a-wd-tables", d: 2,
      prompt: "When should you use a <table>?",
      options: ["For data in rows and columns, such as a timetable", "To arrange the page into columns", "To centre an image", "For every list"],
      correct: "a",
      explanation: "Tables are for tabular data. Layout is CSS's job (Flexbox and Grid in Module 10).",
      wrong: { b: "Layout tables confuse screen readers and cannot adapt to phones.", c: "Centring is CSS.", d: "Lists use ul and ol." },
    }),
    q({
      id: "wdq14-4", atom: "a-wd-tables", d: 3,
      prompt: "What does scope=\"col\" on a <th> do?",
      options: [
        "Says the header labels the column, so screen readers announce it with each cell below",
        "Makes the column wider",
        "Sorts the column",
        "Hides the column on phones",
      ],
      correct: "a",
      explanation: "It ties header to cells: \"Venue: Away\" rather than just \"Away\".",
      wrong: { b: "Width is CSS.", c: "Sorting needs JavaScript.", d: "Hiding is CSS." },
    }),
  ]),

  ...check("wd-l15-media-metadata", [
    q({
      id: "wdq15-1", atom: "a-wd-video-audio", d: 2,
      prompt: "Which element gives a video captions for deaf viewers?",
      options: ["<track kind=\"captions\" src=\"….vtt\">", "<caption>", "<source type=\"captions\">", "<p class=\"captions\">"],
      correct: "a",
      explanation: "A track pointing at a WebVTT file adds selectable captions.",
      wrong: { b: "caption names a table.", c: "source provides media files, not captions.", d: "A paragraph is not synchronised with the video." },
    }),
    q({
      id: "wdq15-2", atom: "a-wd-iframes", d: 3, type: "scenario",
      prompt: "You embed a booking widget in an iframe. Which attribute lets a screen-reader user know what it is?",
      options: ["title", "loading", "sandbox", "width"],
      correct: "a",
      explanation: "The iframe's title is announced, for example \"Book an appointment\".",
      wrong: { b: "loading controls when it downloads.", c: "sandbox limits what it may do.", d: "width sets its size." },
    }),
    q({
      id: "wdq15-3", atom: "a-wd-metadata", d: 2,
      prompt: "Which page title is best for a dentist's services page?",
      options: ["Services · Bright Smile Dental, Ikeja", "Home", "Page 2", "Welcome to our website"],
      correct: "a",
      explanation: "Specific and unique: it says what the page is and whose it is, which is what appears in search results.",
      wrong: { b: "Vague, and probably duplicated on other pages.", c: "Meaningless to a searcher.", d: "Says nothing about the business or page." },
    }),
    q({
      id: "wdq15-4", atom: "a-wd-seo-intro", d: 2,
      prompt: "Which of these most helps a page's search ranking?",
      options: [
        "Clear structure, a unique title and description, and fast, mobile-friendly pages",
        "Repeating keywords hundreds of times in white text",
        "Hiding text in comments",
        "Using only images instead of text",
      ],
      correct: "a",
      explanation: "SEO is good structure and good content, delivered quickly to every device.",
      wrong: { b: "Keyword stuffing and hidden text are penalised.", c: "Comments are not page content.", d: "Search engines read text; images need alt text and still carry less." },
    }),
  ]),
};
