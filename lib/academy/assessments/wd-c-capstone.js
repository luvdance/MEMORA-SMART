/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · FINAL CAPSTONE PROJECT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l153-capstone-shell", [
    q({ id: "wdq153-1", atom: "a-wd-capstone-brief", d: 2, prompt: "Which application is the best capstone choice?", options: ["One a real person or business would use, meeting all eight requirements", "A copy of a tutorial project", "A single static page", "A React app"], correct: "a",
      explanation: "A believable, complete application shows everything the course taught.",
      wrong: { b: "It shows little of your own work.", c: "It cannot meet the multi-page, data or form requirements.", d: "This course's capstone is built without a framework; React is its own course." } }),
    q({ id: "wdq153-2", atom: "a-wd-capstone-mobile-first", d: 2, prompt: "When should accessibility be checked in the capstone?", options: ["From the first line, with a full review before submission", "Only at the end", "Only if a reviewer asks", "Never, the browser handles it"], correct: "a",
      explanation: "Building it in is far cheaper than retrofitting it.",
      wrong: { b: "Retrofitting is slow and misses things.", c: "It is a requirement.", d: "The browser only does what your HTML tells it." } }),
    q({ id: "wdq153-3", atom: "a-wd-capstone-pages", d: 2, prompt: "Why build the header with one renderHeader(current) function?", options: ["Every page shares the same header, so a change is made once", "Functions load faster than HTML", "Search engines require it", "It removes the need for a nav element"], correct: "a",
      explanation: "One component, used by every page.",
      wrong: { b: "Not the reason.", c: "No.", d: "It builds the nav element." } }),
    q({ id: "wdq153-4", atom: "a-wd-capstone-pages", d: 3, prompt: "What should the phone menu button's aria-expanded be after it opens the menu?", options: ["\"true\"", "\"false\"", "\"open\"", "It should be removed"], correct: "a",
      explanation: "Screen readers announce the menu as expanded.",
      wrong: { b: "That means closed.", c: "Not a valid value.", d: "Then the state is lost." } }),
  ]),

  ...check("wd-l154-capstone-data-forms", [
    q({ id: "wdq154-1", atom: "a-wd-capstone-structure", d: 2, prompt: "In a clean capstone structure, which module calls fetch?", options: ["Only the data layer, such as api.js", "Every page script", "components.js", "layout.js"], correct: "a",
      explanation: "One place for requests and their error handling.",
      wrong: { b: "Duplicates request and error code.", c: "Components only build interface.", d: "The shell has no data." } }),
    q({ id: "wdq154-2", atom: "a-wd-capstone-validation", d: 3, prompt: "A booking form has three invalid fields. What should happen on submit?", options: ["All three errors show next to their fields, they get aria-invalid, and the first is focused", "An alert lists the errors", "Only the first error is shown", "The form submits and the server decides"], correct: "a",
      explanation: "Everything at once, where it applies, with focus on the first.",
      wrong: { b: "Alerts are disruptive and disappear.", c: "Visitors then fix errors one by one.", d: "Frontend validation is still for the visitor." } }),
    q({ id: "wdq154-3", atom: "a-wd-capstone-validation", d: 2, prompt: "The server refuses a booking. What should the page do with the visitor's answers?", options: ["Keep them, and show the server's message", "Clear the form", "Reload the page", "Show nothing"], correct: "a",
      explanation: "They can adjust and try again.",
      wrong: { b: "They would have to retype everything.", c: "Loses their answers.", d: "They need to know what happened." } }),
    q({ id: "wdq154-4", atom: "a-wd-capstone-data-layer", d: 2, prompt: "Which three states must a page that loads data handle?", options: ["Loading, success and failure", "Open, closed and hidden", "Mobile, tablet and desktop", "Draft, review and done"], correct: "a",
      explanation: "Say it is loading, show the data, or explain the failure.",
      wrong: { b: "Those are menu states.", c: "Those are widths.", d: "Those are workflow stages." } }),
    q({ id: "wdq154-5", atom: "a-wd-capstone-data-layer", d: 3, prompt: "Why does request() throw when res.ok is false?", options: ["fetch only rejects on network failure; a 409 or 500 is still a response", "fetch never rejects", "JSON cannot be parsed from errors", "Browsers require it"], correct: "a",
      explanation: "Throwing turns server refusals into errors pages can catch.",
      wrong: { b: "It rejects on network failure.", c: "Error responses usually have JSON.", d: "It is your design choice." } }),
  ]),

  ...check("wd-l155-capstone-gate", [
    q({ id: "wdq155-1", atom: "a-wd-capstone-responsive", d: 2, prompt: "Which widths should every capstone page be tested at, as a minimum?", options: ["About 375px, 768px and 1280px, plus a real phone", "Only 1280px", "Only the developer's screen", "Only 320px"], correct: "a",
      explanation: "Phone, tablet and laptop.",
      wrong: { b: "Most visitors use phones.", c: "Not representative.", d: "One width is not enough." } }),
    q({ id: "wdq155-2", atom: "a-wd-capstone-gate-brief", d: 3, prompt: "The tutors API returns a 500. What should tutors.html show?", options: ["\"Could not load tutors. Please refresh the page.\" with no uncaught errors", "A blank page", "The raw error object", "\"Loading tutors…\" forever"], correct: "a",
      explanation: "Explain and suggest what to do; log the details.",
      wrong: { b: "Visitors cannot tell what happened.", c: "Not meaningful to visitors.", d: "Misleading." } }),
    q({ id: "wdq155-3", atom: "a-wd-capstone-github-docs", d: 2, prompt: "Which Git history best supports the capstone?", options: ["Small commits with clear messages throughout the project, merged through pull requests", "One commit at the end called \"final\"", "No Git, just a zip file", "Commits with the message \"update\""], correct: "a",
      explanation: "The history shows how you work.",
      wrong: { b: "Shows nothing of the process.", c: "GitHub is a requirement.", d: "Uninformative." } }),
    q({ id: "wdq155-4", atom: "a-wd-capstone-deploy-present", d: 2, prompt: "What completes requirement C.8?", options: ["A live HTTPS deployment, the project in your portfolio and a presentation of it", "A screenshot of the site", "A local npm run dev link", "The repository alone"], correct: "a",
      explanation: "Live, showcased and presented.",
      wrong: { b: "Not a live site.", c: "Only works on your computer.", d: "That is C.7." } }),
  ]),
};
