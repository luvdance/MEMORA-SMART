/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 15 · REPORTS AND TECHNICAL WRITING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l55-reports", [
    q({
      id: "cw-q55-01", atom: "a-cw-professional-reports", d: 2,
      prompt: "What should you confirm before writing a report?",
      options: ["The terms of reference: the question, scope, audience, deadline and format", "The font", "The number of pages only", "The cover photo"],
      correct: "a",
      explanation: "A report answers a defined question for a defined audience.",
      wrong: { b: "Formatting comes later.", c: "Only one element.", d: "Decoration." },
    }),
    q({
      id: "cw-q55-02", atom: "a-cw-report-types", d: 2,
      prompt: "Which report assesses whether a proposed project is practical and worthwhile?",
      options: ["Feasibility report", "Annual report", "Incident report", "Informational report"],
      correct: "a",
      explanation: "It ends in a go or no-go recommendation.",
      wrong: { b: "Summarises a year.", c: "Records an event.", d: "Presents facts without recommendations." },
    }),
    q({
      id: "cw-q55-03", atom: "a-cw-report-structure", d: 2,
      prompt: "In which tense are report findings usually written?",
      options: ["Past tense: what was found", "Future tense", "Imperative", "Conditional"],
      correct: "a",
      explanation: "Findings report research already done; recommendations use \"should\" or the imperative.",
      wrong: { b: "Findings already happened.", c: "Used for recommendations.", d: "Not standard." },
    }),
    q({
      id: "cw-q55-04", atom: "a-cw-report-openings", d: 3,
      prompt: "Which belongs in the introduction rather than the executive summary?",
      options: ["The method: how the evidence was gathered", "The key recommendations", "The headline findings", "The conclusion"],
      correct: "a",
      explanation: "The introduction sets out purpose, scope and method for full readers.",
      wrong: { b: "Belongs in the summary.", c: "Belongs in the summary.", d: "Belongs in the summary." },
    }),
  ]),

  ...check("cw-l56-findings-proposals", [
    q({
      id: "cw-q56-01", atom: "a-cw-findings", d: 2,
      prompt: "Which recommendation is strongest?",
      options: ["\"Reduce average login time to under 15 seconds by June.\"", "\"Improve the app.\"", "\"Consider looking at user experience.\"", "\"Do better going forward.\""],
      correct: "a",
      explanation: "Specific, measurable, actionable and timed.",
      wrong: { b: "Vague.", c: "Vague and hesitant.", d: "Meaningless." },
    }),
    q({
      id: "cw-q56-02", atom: "a-cw-research-reporting", d: 3,
      prompt: "A survey of one bank's 1,200 customers found 41% left because of slow login. Which claim is justified?",
      options: ["41% of the bank's surveyed former app users cited slow login", "41% of all Nigerians hate banking apps", "Slow login is the cause of all customer losses in Nigeria", "Every bank has this problem"],
      correct: "a",
      explanation: "Keep claims within the population that was studied.",
      wrong: { b: "Overclaims the population.", c: "Overclaims cause and scope.", d: "Unsupported." },
    }),
    q({
      id: "cw-q56-03", atom: "a-cw-project-proposals", d: 2,
      prompt: "A donor provides a proposal template with scoring criteria. What should you do?",
      options: ["Follow the template and criteria exactly", "Use your own structure", "Skip sections you dislike", "Send a sales brochure"],
      correct: "a",
      explanation: "Reviewers score each section of their template.",
      wrong: { b: "Loses marks.", c: "Loses marks.", d: "Not a proposal." },
    }),
    q({
      id: "cw-q56-04", atom: "a-cw-objectives-deliverables", d: 2,
      prompt: "What is the difference between an objective and a deliverable?",
      options: ["An objective is a measurable result; a deliverable is a tangible output", "They are the same", "Deliverables are always reports", "Objectives are always money"],
      correct: "a",
      explanation: "Objectives say what will change; deliverables say what will exist.",
      wrong: { b: "They differ.", c: "Many kinds of deliverable.", d: "Not always." },
    }),
    q({
      id: "cw-q56-05", atom: "a-cw-scope-plans", d: 2,
      prompt: "Why list what is out of scope?",
      options: ["To prevent scope creep", "To make the proposal longer", "Because the board likes lists", "It is never needed"],
      correct: "a",
      explanation: "Clear boundaries stop extra work being added without extra time or money.",
      wrong: { b: "Not the aim.", c: "Not the reason.", d: "It is valuable." },
    }),
  ]),

  ...check("cw-l57-technical", [
    q({
      id: "cw-q57-01", atom: "a-cw-technical-docs", d: 2,
      prompt: "What does task-based documentation mean?",
      options: ["Organised around what users want to do, not around product features", "Written as a list of tasks for the writer", "Documentation with homework", "Only for software"],
      correct: "a",
      explanation: "Users come to documentation to complete tasks.",
      wrong: { b: "Not the meaning.", c: "Not the meaning.", d: "Applies to all products." },
    }),
    q({
      id: "cw-q57-02", atom: "a-cw-user-guides", d: 2,
      prompt: "Which user guide step is best?",
      options: ["\"Tap Reset PIN on the login screen.\"", "\"The user should proceed to the reset functionality.\"", "\"Reset things as needed.\"", "\"Navigate appropriately.\""],
      correct: "a",
      explanation: "Imperative, one action, exact interface name.",
      wrong: { b: "Indirect and vague.", c: "Vague.", d: "Vague." },
    }),
    q({
      id: "cw-q57-03", atom: "a-cw-user-guides", d: 3,
      prompt: "Where should a condition such as \"if no code arrives\" go in a step?",
      options: ["Before the action: \"If no code arrives in 2 minutes, tap Resend code.\"", "After the action", "In a separate appendix", "Nowhere"],
      correct: "a",
      explanation: "Readers need the condition before they act.",
      wrong: { b: "They may act before reading it.", c: "Too far from the step.", d: "Users need it." },
    }),
    q({
      id: "cw-q57-04", atom: "a-cw-sops", d: 2,
      prompt: "Why should SOP writers interview the people who do the work?",
      options: ["To capture the real process and test that the steps work", "To make them feel important", "Interviews replace the SOP", "It is not useful"],
      correct: "a",
      explanation: "The real process often differs from what managers assume.",
      wrong: { b: "Not the purpose.", c: "They inform it.", d: "It is essential." },
    }),
  ]),

  ...check("cw-l58-progress", [
    q({
      id: "cw-q58-01", atom: "a-cw-progress-reports", d: 2,
      prompt: "In a RAG status, what does Amber mean?",
      options: ["At risk or slightly delayed, being managed", "Completed", "Cancelled", "Serious problem needing a decision"],
      correct: "a",
      explanation: "Green: on track; Amber: at risk; Red: needs action.",
      wrong: { b: "Not a RAG meaning.", c: "Not a RAG meaning.", d: "That is Red." },
    }),
    q({
      id: "cw-q58-02", atom: "a-cw-progress-reports", d: 3,
      prompt: "A milestone will be two weeks late. When should the progress report say so?",
      options: ["As soon as it is known, with the reason, new date and mitigation", "After the deadline passes", "Never", "Only if asked"],
      correct: "a",
      explanation: "Stakeholders forgive early bad news; they do not forgive surprises.",
      wrong: { b: "Too late.", c: "Dishonest.", d: "Proactive reporting builds trust." },
    }),
    q({
      id: "cw-q58-03", atom: "a-cw-tables-visuals", d: 2,
      prompt: "Which chart best compares the number of complaints in five branches?",
      options: ["A bar chart", "A pie chart with 3D effects", "A line chart", "No chart; a paragraph"],
      correct: "a",
      explanation: "Bar charts compare categories.",
      wrong: { b: "Distorting and not ideal.", c: "For change over time.", d: "Harder to compare." },
    }),
    q({
      id: "cw-q58-04", atom: "a-cw-versioning", d: 2,
      prompt: "Which version number usually marks the first approved version?",
      options: ["1.0", "0.1", "0.9", "2.5"],
      correct: "a",
      explanation: "0.x are drafts; 1.0 is the first approved version.",
      wrong: { b: "A first draft.", c: "A late draft.", d: "A later revision." },
    }),
    q({
      id: "cw-q58-05", atom: "a-cw-m15-practical", d: 3,
      prompt: "In a customer user guide for a banking feature, which warning is essential?",
      options: ["The bank will never ask for your PIN or code", "Banks love their customers", "Read slowly", "Use a big phone"],
      correct: "a",
      explanation: "Security warnings protect customers from fraud.",
      wrong: { b: "Not a warning.", c: "Not essential.", d: "Not relevant." },
    }),
  ]),
};

export default ASSESSMENTS;
