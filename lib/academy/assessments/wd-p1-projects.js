/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · PHASE 1 PROJECTS AND GATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l20-profile", [
    q({
      id: "wdq20-1", atom: "a-wd-p1-profile-brief", d: 2,
      prompt: "Why use real content rather than lorem ipsum when building a page?",
      options: ["Real text exposes problems, such as long names or awkward headings, that placeholder hides", "Lorem ipsum is not allowed in HTML", "Real text loads faster", "Browsers translate lorem ipsum"],
      correct: "a",
      explanation: "Designs that work with fake text often break with real text. Build with what the page will really say.",
      wrong: { b: "It is allowed; it is just misleading.", c: "Speed is unaffected.", d: "Browsers do no such thing." },
    }),
    q({
      id: "wdq20-2", atom: "a-wd-p1-profile-plan", d: 2,
      prompt: "On a profile page, what should the h1 be?",
      options: ["The person's name, once", "Every section title", "The word \"Profile\" in large letters, plus the name as an h3", "Nothing; profiles do not need an h1"],
      correct: "a",
      explanation: "The h1 is the page's main topic: here, the person.",
      wrong: { b: "Sections are h2s under the single h1.", c: "That chooses headings by size and buries the topic.", d: "Every page needs one h1." },
    }),
    q({
      id: "wdq20-3", atom: "a-wd-p1-profile-build", d: 2,
      prompt: "Which link lets a visitor email you with one tap?",
      options: ["<a href=\"mailto:amaka@example.com\">Email Amaka</a>", "<a href=\"amaka@example.com\">Email Amaka</a>", "<a href=\"email:amaka@example.com\">Email Amaka</a>", "<email>amaka@example.com</email>"],
      correct: "a",
      explanation: "The mailto: scheme opens the visitor's mail app.",
      wrong: { b: "Without mailto: it is treated as a relative path to a file.", c: "There is no email: scheme.", d: "There is no email element." },
    }),
    q({
      id: "wdq20-4", atom: "a-wd-p1-profile-build", d: 3, type: "scenario",
      prompt: "Your profile photo's alt text is \"profile.jpg\". What should it be?",
      options: ["A description such as \"Amaka Obi smiling, wearing a green headscarf\"", "\"image\"", "Nothing, alt is optional", "\"Photo of a photo\""],
      correct: "a",
      explanation: "Describe what the image shows that matters to the page.",
      wrong: { b: "\"image\" tells the listener nothing.", c: "A meaningful image needs alt.", d: "Meaningless." },
    }),
  ]),

  ...check("wd-l21-registration", [
    q({
      id: "wdq21-1", atom: "a-wd-p1-reg-plan", d: 3,
      prompt: "How do you make a select menu genuinely required?",
      options: ["Give it the required attribute and an empty-valued first option such as \"Choose a course\"", "Add required only", "Use a text input instead", "Add a placeholder attribute to the select"],
      correct: "a",
      explanation: "A select always has a selected option; only an empty value counts as unanswered.",
      wrong: { b: "With a real first option already selected, required is already satisfied.", c: "A free-text field invites typos and spellings you cannot match.", d: "select has no placeholder attribute." },
    }),
    q({
      id: "wdq21-2", atom: "a-wd-p1-reg-brief", d: 2,
      prompt: "Why are the two study-mode radio buttons put inside their own fieldset?",
      options: ["The legend gives the pair its question, which screen readers announce", "Radios do not work outside a fieldset", "It makes them larger", "It submits them separately"],
      correct: "a",
      explanation: "\"Study mode, group. Online, radio button\" makes sense; \"Online, radio button\" alone does not.",
      wrong: { b: "They work anywhere; the fieldset adds meaning.", c: "Size is CSS.", d: "Fieldsets do not change submission." },
    }),
    q({
      id: "wdq21-3", atom: "a-wd-p1-reg-build", d: 2,
      prompt: "How do you make the terms checkbox compulsory?",
      options: ["Add required to the checkbox", "Add checked to the checkbox", "Use a radio button instead", "Make the label bold"],
      correct: "a",
      explanation: "A required checkbox must be ticked before the form submits.",
      wrong: { b: "checked pre-ticks it for the user, which is not consent.", c: "A single radio cannot be unticked.", d: "Styling does not change validation." },
    }),
    q({
      id: "wdq21-4", atom: "a-wd-p1-reg-build", d: 2,
      prompt: "Which autocomplete value helps browsers fill a first-name field correctly?",
      options: ["given-name", "first", "name1", "firstname"],
      correct: "a",
      explanation: "given-name and family-name are the standard tokens for first and last names.",
      wrong: { b: "Not a standard token.", c: "Not a standard token.", d: "Not a standard token." },
    }),
  ]),

  ...check("wd-l22-business", [
    q({
      id: "wdq22-1", atom: "a-wd-p1-biz-plan", d: 3,
      prompt: "A logo image is the only thing inside a link to the homepage. What should its alt say?",
      options: ["Where the link goes, such as \"Bisi's Bakery home\"", "\"logo\"", "Nothing", "A description of the logo's colours"],
      correct: "a",
      explanation: "The image's alt is the link's accessible name.",
      wrong: { b: "\"logo, link\" gives no destination.", c: "The link would have no name.", d: "That describes the picture, not the link." },
    }),
    q({
      id: "wdq22-2", atom: "a-wd-p1-biz-brief", d: 2,
      prompt: "Why must every page of the site have the same header and navigation?",
      options: ["Visitors learn where things are once and expect them in the same place", "Browsers require it", "It makes pages load faster", "Search engines ignore pages without it"],
      correct: "a",
      explanation: "Consistency is a core usability and accessibility principle.",
      wrong: { b: "Browsers do not check.", c: "It has no speed effect.", d: "Pages are still indexed; they are just harder to use." },
    }),
    q({
      id: "wdq22-3", atom: "a-wd-p1-biz-brief", d: 2,
      prompt: "On menu.html, which link should carry aria-current=\"page\"?",
      options: ["The Menu link", "The Home link", "All three links", "None of them"],
      correct: "a",
      explanation: "It marks the link to the page being viewed.",
      wrong: { b: "Home is current only on index.html.", c: "Only one page is current.", d: "Then the current page is not announced." },
    }),
    q({
      id: "wdq22-4", atom: "a-wd-p1-biz-build", d: 3, type: "scenario",
      prompt: "You copy index.html to make contact.html and forget to change the title. What is the problem?",
      options: ["Both pages show the same title in search results and tabs, so visitors cannot tell them apart", "contact.html will not open", "The navigation stops working", "Nothing"],
      correct: "a",
      explanation: "Each page needs a unique, descriptive title.",
      wrong: { b: "It opens normally.", c: "Navigation is unaffected.", d: "Duplicate titles hurt search results and usability." },
    }),
  ]),

  ...check("wd-l23-article", [
    q({
      id: "wdq23-1", atom: "a-wd-p1-article-plan", d: 2,
      prompt: "What does the datetime attribute of <time> hold?",
      options: ["A machine-readable date such as 2026-04-02", "The time zone only", "How long the article takes to read", "The author's name"],
      correct: "a",
      explanation: "Content for people, datetime for machines, in year-month-day order.",
      wrong: { b: "It is the full date (and optionally time).", c: "That is not what time means.", d: "Authors are plain text." },
    }),
    q({
      id: "wdq23-2", atom: "a-wd-p1-article-brief", d: 2,
      prompt: "Where do \"Related posts\" links belong in an article page?",
      options: ["In an <aside>", "In the article's h1", "In the <head>", "In a <table>"],
      correct: "a",
      explanation: "aside holds related, secondary content.",
      wrong: { b: "The h1 is the article's title.", c: "The head holds metadata, not visible links.", d: "Links are not tabular data." },
    }),
    q({
      id: "wdq23-3", atom: "a-wd-p1-article-brief", d: 3,
      prompt: "An article has its own <header> containing its h1 and byline. Is that allowed when the page also has a site header?",
      options: ["Yes: header can introduce the page or any section or article", "No: only one header per page", "Only if it is inside the footer", "Only on blogs"],
      correct: "a",
      explanation: "header is introductory content for its nearest section or the page.",
      wrong: { b: "Multiple headers are valid; there is one main.", c: "Unrelated to footers.", d: "It is general HTML." },
    }),
    q({
      id: "wdq23-4", atom: "a-wd-p1-article-build", d: 2,
      prompt: "Which element marks a quotation from another source spanning a paragraph or more?",
      options: ["<blockquote>", "<q>", "<cite>", "<em>"],
      correct: "a",
      explanation: "blockquote is for block-level quotations; q is for short inline ones.",
      wrong: { b: "q is for short quotes inside a sentence.", c: "cite names the source, not the quote.", d: "em is emphasis." },
    }),
  ]),

  ...check("wd-l24-p1-gate", [
    q({
      id: "wdq24-1", atom: "a-wd-p1-gate-brief", d: 2,
      prompt: "Which of these does every page of the gate site need?",
      options: ["A doctype, lang, viewport tag, unique title, one h1 and the four landmarks", "Three h1s", "A form", "A table"],
      correct: "a",
      explanation: "Those are required on every page; the form is only on contact.",
      wrong: { b: "One h1 per page.", c: "Only the contact page has the form.", d: "Tables are for tabular data, only where needed." },
    }),
    q({
      id: "wdq24-2", atom: "a-wd-p1-gate-build", d: 3, type: "scenario",
      prompt: "Your contact form sends even when every field is empty. What is missing?",
      options: ["The required attribute on the fields", "A reset button", "A fieldset", "aria-current"],
      correct: "a",
      explanation: "required makes the browser block empty fields.",
      wrong: { b: "Reset clears, it does not validate.", c: "Fieldsets group, they do not validate.", d: "aria-current is for navigation." },
    }),
    q({
      id: "wdq24-3", atom: "a-wd-p1-gate-build", d: 2,
      prompt: "Why do images need width and height attributes?",
      options: ["So the browser reserves their space and the page does not jump as they load", "So they load faster", "So screen readers can describe them", "So they are responsive"],
      correct: "a",
      explanation: "Known dimensions prevent layout shift while images download.",
      wrong: { b: "Download size is unchanged.", c: "alt is what screen readers use.", d: "Responsiveness is CSS, in Module 11." },
    }),
    q({
      id: "wdq24-4", atom: "a-wd-p1-gate-review", d: 2,
      prompt: "Your site passes every automated check. What can the checks NOT tell you?",
      options: ["Whether the wording is clear to real visitors", "Whether there is an h1", "Whether the form is required", "Whether images have alt"],
      correct: "a",
      explanation: "Checks verify structure. Clarity needs human review.",
      wrong: { b: "Checked.", c: "Checked.", d: "Checked for presence, though not for quality." },
    }),
  ]),
};
