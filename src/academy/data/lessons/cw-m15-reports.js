/**
 * CONTENT WRITING · MODULE 15 · REPORTS, PROPOSALS AND TECHNICAL DOCUMENTATION
 *
 * Curriculum 15.1 – 15.15 and the practical 15.P. Professional reports and
 * their types, structure and formatting, executive summaries, findings and
 * recommendations, research-based reporting, project proposals, objectives
 * and deliverables, scope and implementation plans, technical documentation,
 * user guides, SOPs, progress reports, tables and visuals, and versioning;
 * then a project report and a user guide.
 *
 * Survey and project figures in briefs are invented for practice.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s15-reports";

/* ── Lesson 55 lab: executive summary and introduction ─────────────────── */
const SUMMARY_BRIEF = `You are writing a report for the **management of Sunrise Microfinance Bank, Ibadan**, on why customers are leaving its mobile app. You have finished the research. Your findings (figures invented for practice):

- 1,200 customers surveyed in February 2026; 300 also interviewed by phone.
- 41% of customers who stopped using the app said it was too slow to log in (average login time 48 seconds; competitors average 12 seconds).
- 27% said failed transfers were not refunded quickly (average refund time 6 days).
- 18% said they could not find how to reset their PIN.
- Customers who left the app moved on average ₦85,000 a month to other banks.

Your recommendations: (1) speed up login, with a target of under 15 seconds by June; (2) refund failed transfers automatically within 24 hours; (3) add a "Reset PIN" button on the login screen.`;

const SUMMARY_DOC = `# Why customers are leaving the Sunrise mobile app

## Executive summary
[The whole report in miniature: purpose, key findings with numbers, recommendations.]

## Introduction
[Purpose, scope and method.]
`;

const SUMMARY_DONE = `# Why customers are leaving the Sunrise mobile app

## Executive summary
This report explains why customers are leaving Sunrise Microfinance Bank's mobile app and what the bank should do. Of the customers who stopped using the app, 41% said logging in was too slow (48 seconds on average, compared with 12 seconds for competitors), 27% said failed transfers were refunded too slowly (6 days on average), and 18% could not find how to reset their PIN. Each customer who left moved about ₦85,000 a month to other banks. We recommend three actions: cut login time to under 15 seconds by June, refund failed transfers automatically within 24 hours, and add a Reset PIN button to the login screen.

## Introduction
Management asked us to find out why customers are leaving the mobile app and to recommend how to keep them. This report covers the experience of retail customers who use, or have stopped using, the app. In February 2026 we surveyed 1,200 customers and interviewed 300 of them by phone. The report presents the findings, the conclusions and three recommendations.
`;

/* ── Lesson 56 lab: proposal objectives, deliverables, scope and plan ──── */
const PLAN_BRIEF = `You are writing part of a **project proposal** to Sunrise Microfinance Bank's board for the **App Rescue Project**, which will act on the report's three recommendations.

- Budget: ₦38 million. Duration: 1 April to 30 June 2026.
- The team: an external development firm (Codeway Ltd) for the login and refunds work, and Sunrise's own digital team for the PIN reset button and testing.
- The board does NOT want this project to redesign the whole app or add new products; those are for next year.
- Key milestones: login speed fix live by 15 May; automatic refunds live by 31 May; Reset PIN button live by 15 April; final review 30 June.`;

const PLAN_DOC = `# App Rescue Project: proposal sections

## Objectives
[Three SMART objectives, one per "- " line.]

## Deliverables
[What will be produced, one per "- " line.]

## Scope
### In scope
### Out of scope

## Implementation plan
| Milestone | Owner | Date |
|-----------|-------|------|
|  |  |  |
`;

const PLAN_DONE = `# App Rescue Project: proposal sections

## Objectives
- Reduce average login time from 48 seconds to under 15 seconds by 15 May 2026
- Refund 100% of failed transfers automatically within 24 hours by 31 May 2026
- Let customers reset their PIN from the login screen by 15 April 2026

## Deliverables
- A faster login system, tested and live in the app
- An automatic refund process for failed transfers, with daily reports
- A Reset PIN button and process on the login screen
- A final project review report for the board

## Scope
### In scope
- Login speed, automatic refunds for failed transfers, and the Reset PIN button
- Testing, release and monitoring of these three changes

### Out of scope
- A redesign of the whole app
- New products or features beyond the three changes

## Implementation plan
| Milestone | Owner | Date |
|-----------|-------|------|
| Reset PIN button live | Sunrise digital team | 15 April 2026 |
| Login speed fix live | Codeway Ltd | 15 May 2026 |
| Automatic refunds live | Codeway Ltd | 31 May 2026 |
| Final review presented to the board | Project manager | 30 June 2026 |
`;

/* ── Lesson 57 lab: an SOP ─────────────────────────────────────────────── */
const SOP_BRIEF = `Write a **standard operating procedure (SOP)** for Sunrise Microfinance Bank's customer service officers: **handling a customer report of a failed transfer**, before the automatic refund system is live.

How it is done now (from interviews with staff):
- The officer must first verify the customer's identity by asking for their account number and the last 4 digits of their BVN.
- Then find the transaction in the Transaction Monitor using the date and amount.
- If the status is "Failed – debited", log a refund request in the Refund Queue, selecting reason code RF-02.
- Tell the customer the reference number and that refunds take up to 48 hours under the new interim policy.
- If the status is "Successful", explain that the money reached the recipient's bank and advise them to contact the recipient.
- Never ask for the customer's PIN or full BVN.
- If the transaction cannot be found, escalate to the Payments Desk (ext. 2207) with the customer's details.`;

const SOP_DOC = `# SOP: Handling a failed transfer report

## Purpose

## Scope

## Responsibilities

## Procedure
[Numbered steps, one action each, each starting with a verb.]

## Important
[Safety or security rules.]

## Document control
- Version:
- Date:
- Owner:
`;

const SOP_DONE = `# SOP: Handling a failed transfer report

## Purpose
To make sure every customer who reports a failed transfer is identified securely, gets a refund request logged correctly, and knows what happens next.

## Scope
This procedure applies to all customer service officers handling failed transfer reports by phone, in a branch or by chat, until the automatic refund system is live.

## Responsibilities
Customer service officers follow this procedure. The Payments Desk handles transactions that cannot be found. The Customer Service Manager owns and reviews this SOP.

## Procedure
1. Verify the customer's identity by asking for their account number and the last 4 digits of their BVN.
2. Open the Transaction Monitor and find the transaction using its date and amount.
3. Check the transaction status.
4. If the status is "Failed – debited", log a refund request in the Refund Queue with reason code RF-02.
5. Give the customer the refund reference number and tell them the refund will arrive within 48 hours.
6. If the status is "Successful", explain that the money reached the recipient's bank and advise the customer to contact the recipient.
7. If you cannot find the transaction, escalate it to the Payments Desk on extension 2207 with the customer's details.

## Important
- Never ask for a customer's PIN or full BVN.
- Do not promise a refund until you have logged it and have a reference number.

## Document control
- Version: 1.0
- Date: 1 April 2026
- Owner: Customer Service Manager
`;

/* ── Lesson 58 lab: the practical, a progress report and a user guide ──── */
const FINAL_BRIEF = `It is **31 May 2026**. Write (1) a **progress report** on the App Rescue Project for Sunrise's board, and (2) a short **user guide** for customers on the new Reset PIN feature.

Project status (figures invented for practice):
- Reset PIN button: live since 12 April (3 days early). 9,400 customers have used it; PIN-related calls to the contact centre fell by 62%.
- Login speed: live since 20 May (5 days late, because of a security review). Average login time is now 11 seconds.
- Automatic refunds: testing found that 3% of refunds were duplicated. Release moved to 14 June. Risk: duplicated refunds could cost money; mitigation: release only after two clean test cycles.
- Budget: ₦26.5 million spent of ₦38 million (70%); forecast to finish within budget.
- Next steps: fix duplicates and retest by 10 June; release refunds on 14 June; final review on 30 June.

How customers reset their PIN in the app:
- On the login screen, tap "Reset PIN".
- Enter the phone number linked to the account.
- Enter the 6-digit code sent by SMS (valid for 5 minutes).
- Enter the last 4 digits of their BVN.
- Create a new 4-digit PIN and enter it again to confirm.
- They will see "Your PIN has been changed" and can log in with the new PIN.
- If no code arrives in 2 minutes, tap "Resend code". Sunrise will never call to ask for a PIN or code.`;

const FINAL_DOC = `# App Rescue Project: progress report, 31 May 2026

## Summary

## Status by workstream
| Workstream | Status | Progress |
|------------|--------|----------|
|  |  |  |

## Budget

## Risks and issues

## Next steps

# User guide: How to reset your PIN

## Before you start

## Steps

## If something goes wrong
`;

const FINAL_DONE = `# App Rescue Project: progress report, 31 May 2026

## Summary
Two of the project's three changes are live and already working: the Reset PIN button and the faster login. The automatic refund system is delayed to 14 June after testing found duplicate refunds. The project has spent 70% of its budget and is forecast to finish within it.

## Status by workstream
| Workstream | Status | Progress |
|------------|--------|----------|
| Reset PIN button | Green | Live since 12 April, 3 days early; 9,400 customers have used it and PIN calls fell by 62% |
| Login speed | Green | Live since 20 May, 5 days late after a security review; average login is now 11 seconds |
| Automatic refunds | Amber | Testing found 3% duplicated refunds; release moved from 31 May to 14 June |

## Budget
₦26.5 million of the ₦38 million budget has been spent (70%). We forecast that the project will finish within budget.

## Risks and issues
- Duplicated refunds could cost the bank money if released too early. We will release the refund system only after two clean test cycles.

## Next steps
- Fix the duplicate refunds and retest by 10 June
- Release automatic refunds on 14 June
- Present the final review to the board on 30 June

# User guide: How to reset your PIN

## Before you start
You need your phone with the number linked to your Sunrise account, and the last 4 digits of your BVN. It takes about 2 minutes.

## Steps
1. Open the Sunrise app and tap Reset PIN on the login screen.
2. Enter the phone number linked to your account.
3. Enter the 6-digit code we send you by SMS. The code works for 5 minutes.
4. Enter the last 4 digits of your BVN.
5. Create a new 4-digit PIN, then enter it again to confirm.
6. When you see "Your PIN has been changed", log in with your new PIN.

## If something goes wrong
- No code after 2 minutes? Tap Resend code.
- Code expired? Start again from step 1.
- Sunrise will never call, text or email you to ask for your PIN or code. Never share them with anyone.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 15.1 – 15.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l55-reports",
    moduleId: "cw-m15-reports",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4"],
    title: "Professional Reports",
    subtitle: "What reports are, their types, structure and formatting, and how they open",
    estimatedMinutes: 40,
    intro:
      "Module 13 introduced the business report. This module goes deeper into structured, analytical and technical writing, starting with how professional reports are built.",

    atoms: [
      {
        id: "a-cw-professional-reports",
        title: "Understanding professional reports",
        explain:
          "A professional report is a structured document that presents evidence and analysis about a defined question so that its readers can understand a situation or make a decision. Reports differ from essays and articles in four ways. They are commissioned for a purpose and a specific audience (management, a board, a client, a donor, a regulator). They are structured with standard, labelled sections so readers can find what they need. They are objective: findings are based on evidence, and facts are separated from interpretation and opinion. And they are actionable: most end with conclusions and recommendations. Before writing, confirm the terms of reference: the question the report must answer, its scope, who will read it, the deadline and the expected length and format.",
      },
      {
        id: "a-cw-report-types",
        title: "Types of business reports",
        explain:
          "Common types include: informational reports, which present facts without recommendations (monthly sales, attendance, incident reports); analytical reports, which analyse a problem and recommend action (why customers are leaving); research reports, which present the results of a study (a customer survey); feasibility reports, which assess whether a proposed project is practical and worthwhile; progress or status reports, which update stakeholders on a project (Lesson 58); annual reports, which summarise an organisation's year for shareholders and the public; audit and compliance reports, which check against rules; and donor or grant reports, which show how funds were used and what was achieved. The type determines the structure, length and how much interpretation is expected.",
        table: {
          caption: "Report types and their purpose.",
          headers: ["Type", "Answers the question", "Recommendations?"],
          rows: [
            ["Informational", "What happened?", "Usually not"],
            ["Analytical", "Why, and what should we do?", "Yes"],
            ["Research", "What did the study find?", "Often"],
            ["Feasibility", "Should we do this?", "Yes: go or no-go"],
            ["Progress", "Where is the project now?", "Next steps"],
            ["Donor / grant", "How were funds used, and what was achieved?", "Sometimes"],
          ],
        },
      },
      {
        id: "a-cw-report-structure",
        title: "Report structure and formatting",
        explain:
          "A formal report usually contains: a title page (title, prepared for, prepared by, date, version); an executive summary; a table of contents for longer reports; an introduction (purpose, scope, method); findings, organised under descriptive headings, often with tables and charts; conclusions (what the findings mean); recommendations (specific, numbered actions with owners and timing where possible); references; and appendices (detailed data, questionnaires). Short reports may combine sections or use a memo format. Format for scanning: numbered headings (1, 1.1, 1.2) in long reports, consistent styles, short paragraphs, tables and charts labelled and referred to in the text (\"see Table 2\"), and page numbers. Write findings in the past tense (what was found) and recommendations in the imperative or with \"should\".",
        decision: {
          scenario: "A draft report mixes findings and opinions in the same paragraph: \"41% said login was slow, which is obviously because the developers are lazy.\"",
          question: "How should it be rewritten?",
          options: [
            { id: "a", text: "Report the finding objectively, and put any interpretation, supported by evidence, in the conclusions", why: "Right. Reports separate evidence from interpretation, and never blame without evidence." },
            { id: "b", text: "Keep it: it is honest", whyWrong: "It is an unsupported opinion that undermines the report's credibility." },
            { id: "c", text: "Remove the finding as well", whyWrong: "The finding is valuable evidence; only the unsupported opinion should go." },
            { id: "d", text: "Move the opinion to the executive summary", whyWrong: "That gives the unsupported claim more prominence." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-report-openings",
        title: "Writing introductions and executive summaries",
        explain:
          "The executive summary (Module 13) and the introduction do different jobs. The executive summary is for decision-makers: it states the purpose in one sentence, the most important findings with their key numbers, the conclusion and the recommendations, so a reader can act without reading further. It is written last and usually runs to about one paragraph per five pages of report. The introduction is for readers of the full report: it explains the purpose (who asked for the report and why), the scope (what is and is not covered), the method (how the evidence was gathered: surveys, interviews, data, sources) and the structure of what follows. Neither should contain information that does not appear in the body.",
        writingLab: {
          task:
            "Write the opening of the Sunrise report. Executive summary (90 to 150 words): the purpose in the first sentence, all three main findings with their percentages, at least one comparison or impact figure (such as 48 versus 12 seconds, or ₦85,000), and all three recommendations, including the June target. Introduction (50 to 110 words): who asked and why, the scope, the method (with 1,200 surveyed and 300 interviewed, February 2026) and what the report contains. Keep opinions out.",
          brief: SUMMARY_BRIEF,
          doc: SUMMARY_DOC,
          tests: [
            { label: "Executive summary: 90 to 150 words, purpose first", check: String.raw`const s = section('Executive summary') || ''; return words(s) >= 90 && words(s) <= 150 && /(report|explains|examines|why)/i.test(firstSentence(s)) && /(leav|stop)/i.test(firstSentence(s));`, fail: "Open with the report's purpose in one sentence, and keep to 90 to 150 words." },
            { label: "All three findings with percentages", check: String.raw`const s = section('Executive summary') || ''; return /41\s?%/.test(s) && /27\s?%/.test(s) && /18\s?%/.test(s);`, fail: "Include all three findings: 41%, 27% and 18%." },
            { label: "An impact or comparison figure", check: String.raw`const s = section('Executive summary') || ''; return /48/.test(s) && /12/.test(s) || /₦\s?85,?000/.test(s);`, fail: "Show scale: the 48-second login against competitors' 12, or the ₦85,000 a month lost." },
            { label: "All three recommendations, with the June target", check: String.raw`const s = section('Executive summary') || ''; return /15 seconds/i.test(s) && /june/i.test(s) && /24 hours/i.test(s) && /reset pin/i.test(s);`, fail: "Give the three recommendations: login under 15 seconds by June, refunds within 24 hours, and the Reset PIN button." },
            { label: "Introduction: purpose, scope and method, 50 to 110 words", check: String.raw`const i = section('Introduction') || ''; return words(i) >= 50 && words(i) <= 110 && /1,?200/.test(i) && /300/.test(i) && /february 2026/i.test(i) && /(cover|scope|focus)/i.test(i);`, fail: "In 50 to 110 words, say who asked and why, what the report covers, and how the evidence was gathered." },
            { label: "No opinions or blame", check: String.raw`return !/(obviously|lazy|terrible|incompetent|clearly the fault|I think|I feel)/i.test(doc);`, fail: "Report evidence, not opinion: remove judgemental words." },
          ],
          solution: SUMMARY_DONE,
          hint: "Write the executive summary as: purpose (1 sentence), findings (2 sentences), recommendations (1 sentence).",
          successMessage: "A board can now decide from one paragraph, and anyone reading on knows exactly how the evidence was gathered.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 15.5 – 15.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l56-findings-proposals",
    moduleId: "cw-m15-reports",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.5", "15.6", "15.7", "15.8", "15.9"],
    title: "Findings, Research and Project Proposals",
    subtitle: "Presenting evidence and recommendations, and proposing a project",
    estimatedMinutes: 45,
    intro:
      "Reports end in recommendations, and good recommendations often become projects. This lesson covers both sides: presenting findings convincingly, and writing the proposal that turns them into a funded plan.",

    atoms: [
      {
        id: "a-cw-findings",
        title: "Presenting findings and recommendations",
        explain:
          "Findings are the evidence: what the research found, organised by theme or by question under descriptive headings (\"Slow login is the main reason customers leave\"), with the key number in the first sentence of each section and supporting detail, tables or quotes after it. Present findings objectively, include results that are inconvenient, and state limitations. Conclusions interpret: what the findings mean for the organisation. Recommendations say what to do. Make each recommendation specific (what exactly), actionable (within the organisation's control), linked to a finding, and, where possible, assigned an owner, a deadline and a measure of success: \"Reduce average login time to under 15 seconds by June\" rather than \"Improve the app\". Number recommendations and order them by priority or impact.",
        samples: [
          { label: "Vague", tone: "bad", text: "The bank should consider improving the app experience going forward." },
          { label: "Specific and linked to a finding", tone: "good", text: "1. Reduce average login time from 48 seconds to under 15 seconds by June (Finding 1: 41% of lost customers cited slow login)." },
        ],
      },
      {
        id: "a-cw-research-reporting",
        title: "Research-based reporting",
        explain:
          "A research-based report must let readers judge how much to trust its findings. Describe the method precisely: who was studied, how many, how they were chosen, when, and how (survey, interviews, analysis of records). Report numbers accurately, with the base (\"41% of the 520 customers who had stopped using the app\") and avoid overclaiming: a survey of one bank's customers does not describe all Nigerian bank customers. Distinguish correlation from cause (Module 5). Use quotations from interviews to illustrate findings, not to replace data. Acknowledge limitations honestly (small samples, people who did not respond, self-reported answers). Cite secondary sources properly. A report that is open about its limits is more credible, not less.",
      },
      {
        id: "a-cw-project-proposals",
        title: "Writing project proposals",
        explain:
          "A project proposal asks a decision-maker (a board, a manager, a donor, a grant committee) to approve and fund a project. It differs from the sales proposal of Module 13 in its focus on planning and accountability. A typical structure: title and summary; background and problem statement (with evidence, often from a report); goal and objectives; deliverables; scope; methodology or approach; implementation plan and timeline; team and responsibilities; budget; risks and how they will be managed; monitoring and evaluation (how success will be measured); and sustainability or next steps. Donors and grant-makers often provide their own template and scoring criteria: follow them exactly, because reviewers score each section.",
      },
      {
        id: "a-cw-objectives-deliverables",
        title: "Project objectives and deliverables",
        explain:
          "The project goal is the broad change the project contributes to (\"keep customers using the Sunrise app\"). Objectives are the specific, measurable results the project will achieve, written in SMART form (Module 8): \"Reduce average login time from 48 seconds to under 15 seconds by 15 May 2026.\" Each objective starts with a verb (reduce, increase, launch, train), names a measurable target and a deadline, and is within the project's control. Deliverables are the tangible things the project will produce or hand over: a working feature, a trained team, a report, a manual. Objectives say what will change; deliverables say what will exist. Every deliverable should serve an objective, and every objective should be measurable at the end.",
        decision: {
          scenario: "Which is a SMART project objective?",
          question: "Choose the SMART objective.",
          options: [
            { id: "a", text: "\"Refund 100% of failed transfers automatically within 24 hours by 31 May 2026.\"", why: "Right. Specific, measurable, achievable within the project, relevant and time-bound." },
            { id: "b", text: "\"Make refunds better.\"", whyWrong: "Not specific or measurable." },
            { id: "c", text: "\"Become the best bank in Nigeria.\"", whyWrong: "Not measurable or within the project's control." },
            { id: "d", text: "\"Work on the refund system.\"", whyWrong: "An activity, not a result." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-scope-plans",
        title: "Scope of work and implementation plans",
        explain:
          "The scope defines the project's boundaries: what is included (in scope) and, just as importantly, what is not (out of scope). Writing out-of-scope items explicitly prevents scope creep, where extra work is added without extra time or money. A scope of work (SOW) in a contract with a supplier also lists the tasks, deliverables, standards, timelines and acceptance criteria. The implementation plan shows how the work will be done: phases or workstreams, the main tasks, milestones (key points such as \"Login fix live\"), owners and dates, usually as a table or a Gantt chart (a bar chart of tasks over time). Include dependencies (what must happen before what) and review points. Keep the plan realistic: a plan that slips in week one loses the board's trust.",
        writingLab: {
          task:
            "Write the App Rescue Project's planning sections. Objectives: three SMART objectives, each starting with a verb, with a measurable target and a 2026 date (one per recommendation). Deliverables: at least three tangible outputs. Scope: in-scope bullets for the three changes, and out-of-scope bullets that include the app redesign and new products. Implementation plan: at least four milestones with an owner and a date each, matching the brief, in date order.",
          brief: PLAN_BRIEF,
          doc: PLAN_DOC,
          tests: [
            { label: "Three SMART objectives with verbs, targets and dates", check: String.raw`const o = bullets(section('Objectives')); return o.length >= 3 && o.every((x) => /^(reduce|increase|refund|launch|let|enable|cut|add|deliver|release|introduce|lower|raise|achieve|make)\b/i.test(x) && /\d/.test(x.replace(/2026/g, '')) && /2026/.test(x));`, fail: "Start each objective with a verb, include a measurable number and a date in 2026." },
            { label: "Objectives cover login, refunds and PIN reset", check: String.raw`const o = section('Objectives') || ''; return /login/i.test(o) && /refund/i.test(o) && /pin/i.test(o) && /15 seconds/i.test(o) && /24 hours/i.test(o);`, fail: "One objective per recommendation: login under 15 seconds, refunds within 24 hours, PIN reset." },
            { label: "At least three deliverables", check: "return bullets(section('Deliverables')).filter((b) => words(b) >= 4).length >= 3;", fail: "List at least three tangible things the project will produce." },
            { label: "Scope states what is out, including the redesign and new products", check: String.raw`const out = section('Out of scope') || ''; return bullets(section('In scope')).length >= 1 && /redesign/i.test(out) && /(new products|new features)/i.test(out);`, fail: "List what is in scope, and state that the full redesign and new products are out of scope." },
            { label: "Four milestones with owners and dates, in order", check: String.raw`const r = rows(section('Implementation plan')).filter((c) => words(c[0]) >= 2 && words(c[1]) >= 1 && /\d/.test(c[2] || '')); const months = { april: 4, may: 5, june: 6 }; const key = (t) => { const m = (t.match(/(april|may|june)/i) || [])[1]; return m ? months[m.toLowerCase()] * 100 + num(t) : 0; }; return r.length >= 4 && r.every((c, i) => i === 0 || key(c[2]) >= key(r[i - 1][2])) && /codeway/i.test(r.map((c) => c[1]).join(' '));`, fail: "List at least four milestones with an owner and a date, in date order, using the brief's owners." },
          ],
          solution: PLAN_DONE,
          hint: "Turn each recommendation into one objective, one deliverable and one milestone.",
          successMessage: "Objectives the board can measure, a scope that prevents creep, and a dated plan with owners.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 15.10 – 15.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l57-technical",
    moduleId: "cw-m15-reports",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.10", "15.11", "15.12"],
    title: "Technical Documentation, User Guides and SOPs",
    subtitle: "Writing that helps people use products and follow processes correctly",
    estimatedMinutes: 45,
    intro:
      "Technical writing is one of the steadiest-paying writing careers. Its measure is simple: can the reader do the task correctly, first time, using only your document?",

    atoms: [
      {
        id: "a-cw-technical-docs",
        title: "Writing technical documentation",
        explain:
          "Technical documentation explains how a product, system or process works and how to use it. It includes user guides, manuals, installation guides, help-centre articles, API and developer documentation, release notes, troubleshooting guides, specifications and SOPs. Principles: know the user's task and skill level; write task-based content (organised around what users want to do, not around the product's features); use plain language, consistent terms (if it is the \"Reset PIN\" button, always call it that, with the same capitals as on screen), and the active, imperative voice; break information into small, scannable chunks with headings, numbered steps and tables; show expected results; warn before the step where risk occurs; and test the documentation with real users. Many organisations follow a style guide such as the Microsoft Writing Style Guide or Google's developer documentation style guide.",
      },
      {
        id: "a-cw-user-guides",
        title: "User guides and instruction manuals",
        explain:
          "A user guide helps someone use a product to achieve their goals. Start with what the user needs before they begin (\"Before you start: your phone and the last 4 digits of your BVN\"). Give each task its own section with a task-based heading (\"Reset your PIN\"). Write numbered steps, one action per step, starting with a verb, naming interface elements exactly as they appear (tap Reset PIN), and stating the result where it helps (\"You will see 'Your PIN has been changed'\"). Put conditions before actions (\"If no code arrives in 2 minutes, tap Resend code\"). Include troubleshooting for the problems users really hit, and safety and security warnings where they matter. Keep sentences short; many users read guides while doing the task, on a small screen. Add screenshots or diagrams when they show something words cannot.",
        mistake: "Writing \"The user should then proceed to input the required credentials\" instead of \"Enter your phone number.\" Guides talk directly to the user, in the imperative.",
        decision: {
          scenario: "A customer service officer's instructions need a step for logging refunds.",
          question: "Which step is written correctly?",
          options: [
            { id: "a", text: "\"4. If the status is 'Failed – debited', log a refund request in the Refund Queue with reason code RF-02.\"", why: "Right. Condition first, one action, starting with a verb, and exact names from the system." },
            { id: "b", text: "\"4. Refunds should be handled appropriately.\"", whyWrong: "Vague: what, where and how?" },
            { id: "c", text: "\"4. The officer may wish to consider logging a refund if it seems necessary.\"", whyWrong: "Optional and vague; procedures state required actions." },
            { id: "d", text: "\"4. Log refund (see system).\"", whyWrong: "Too abbreviated: which system, which code, under what condition?" },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-sops",
        title: "Standard Operating Procedures (SOPs)",
        explain:
          "A standard operating procedure (SOP) is a documented, approved set of steps that staff must follow to carry out a routine task the same way every time, safely and correctly. SOPs are essential in banking, healthcare, manufacturing, logistics, food and anywhere mistakes are costly or regulated. A typical SOP contains: title and ID; purpose; scope (who and which situations it applies to); responsibilities; definitions if needed; the procedure as numbered steps (with decision points written as \"If…, …\"); safety, security or compliance rules; related documents and forms; and document control (version, effective date, owner, approver, review date). Write steps for the least experienced person who will perform the task, interview the people who do the work to capture the real process, and have them test the draft.",
        writingLab: {
          task:
            "Write the SOP for handling a failed transfer report. Purpose, Scope and Responsibilities: one to three sentences each. Procedure: at least six numbered steps, each starting with a verb (or with \"If\" for a decision), covering identity checks, finding the transaction, logging the refund with RF-02, telling the customer the reference and the 48 hours, the \"Successful\" case, and escalation to extension 2207. Important: the rule about PIN and BVN. Document control: version, date and owner.",
          brief: SOP_BRIEF,
          doc: SOP_DOC,
          tests: [
            { label: "Purpose, scope and responsibilities written", check: "return ['Purpose', 'Scope', 'Responsibilities'].every((h) => { const n = sentences(section(h)).length; return n >= 1 && n <= 3 && words(section(h)) >= 10; });", fail: "Write one to three sentences for each of Purpose, Scope and Responsibilities." },
            { label: "Six or more numbered steps, each starting with a verb or \"If\"", check: String.raw`const s = numbered(section('Procedure')); return s.length >= 6 && s.every((x) => isAction(x) || /^if\b/i.test(x) || /^(verify|open|check|log|give|explain|escalate|record|confirm|ask|find|enter|select)\b/i.test(x));`, fail: "Write at least six numbered steps, each starting with a verb, or with \"If\" for a decision." },
            { label: "Covers identity, RF-02, the reference and 48 hours", check: String.raw`const p = section('Procedure') || ''; return /account number/i.test(p) && /last 4 digits/i.test(p) && /RF-02/.test(p) && /reference/i.test(p) && /48 hours/i.test(p);`, fail: "Include the identity check, reason code RF-02, the reference number and the 48-hour timing." },
            { label: "Covers the successful case and escalation", check: String.raw`const p = section('Procedure') || ''; return /successful/i.test(p) && /2207/.test(p);`, fail: "Say what to do if the status is \"Successful\", and when to escalate to extension 2207." },
            { label: "The security rule and document control", check: String.raw`return /never ask[^.]*pin/i.test(section('Important') || '') && /BVN/.test(section('Important') || '') && /\d/.test(field(section('Document control'), 'Version') || '') && words(field(section('Document control'), 'Owner') || '') >= 1;`, fail: "State never to ask for the PIN or full BVN, and fill in version, date and owner." },
          ],
          solution: SOP_DONE,
          hint: "Read the staff notes in the order a call happens, and turn each sentence into one step.",
          successMessage: "An SOP a new officer could follow on their first day, the same way every time.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 15.13 – 15.15 · PRACTICAL 15.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l58-progress",
    moduleId: "cw-m15-reports",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.13", "15.14", "15.15", "15.P"],
    title: "Progress Reports, Tables, Versions and the Practical",
    subtitle: "Reporting on projects, presenting data, keeping documents consistent, and the module practical",
    estimatedMinutes: 75,
    intro:
      "Projects need regular, honest updates, and documents need to stay consistent as they change. This lesson covers both, then you write a progress report and a user guide.",

    atoms: [
      {
        id: "a-cw-progress-reports",
        title: "Writing project progress reports",
        explain:
          "A progress (or status) report tells stakeholders where a project stands against its plan, so they can trust it or intervene. It is short and regular (weekly or monthly) and follows a consistent structure: a summary (overall status in two or three sentences); status by workstream or milestone, often with a RAG rating (Red: serious problem, needs action; Amber: at risk or delayed, being managed; Green: on track); what was achieved since the last report; budget (spent, remaining, forecast); risks and issues, each with its impact and what is being done; decisions needed from the reader; and next steps with dates. Be honest about delays: report them early, with the reason, the new date and the mitigation. Stakeholders forgive bad news reported early; they do not forgive surprises.",
        table: {
          caption: "RAG status ratings.",
          headers: ["Rating", "Meaning", "Reader should…"],
          rows: [
            ["Green", "On track", "Note it"],
            ["Amber", "At risk or slightly delayed, being managed", "Watch it"],
            ["Red", "Serious problem, needs a decision or help", "Act on it"],
          ],
        },
      },
      {
        id: "a-cw-tables-visuals",
        title: "Using tables and visual information effectively",
        explain:
          "Tables and charts present data that would be hard to follow in sentences. Use a table when readers need to look up or compare exact values (status by workstream, prices, specifications); use a chart when the pattern matters more than the exact numbers: a bar chart to compare categories, a line chart for change over time, and a pie chart only for parts of a whole with few categories. Give every table and chart a number and a descriptive title (\"Table 2: Reasons customers stopped using the app\"), label columns, axes and units, cite the source, and refer to it in the text with the point it makes (\"As Table 2 shows, slow login was the main reason\"). Keep them simple: no 3D effects, no unnecessary colours, and colours that remain readable for colour-blind readers and in black and white.",
        decision: {
          scenario: "You want to show how average login time fell each week from March to May.",
          question: "Which visual is best?",
          options: [
            { id: "a", text: "A line chart of login time by week", why: "Right. Line charts show change over time clearly." },
            { id: "b", text: "A pie chart", whyWrong: "Pie charts show parts of a whole, not change over time." },
            { id: "c", text: "A 3D bar chart with many colours", whyWrong: "3D effects distort values and colours add noise." },
            { id: "d", text: "A long paragraph listing every weekly figure", whyWrong: "Hard to see the trend in prose." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-versioning",
        title: "Document versioning and consistency",
        explain:
          "Professional documents change many times, so readers must always know which version they have. Use version numbers: 0.1, 0.2… for drafts, 1.0 for the first approved version, 1.1 for minor changes and 2.0 for major revisions. Keep a version history table (version, date, author, summary of changes) at the start or end of important documents, and include the version and date in the file name (AppRescue_ProgressReport_v1.2_2026-05-31) and the footer. Use one master copy in a shared location (SharePoint, Google Drive) instead of emailing attachments, and use tracked changes or suggestion mode for reviews. Consistency within and across documents matters just as much: the same terms, names, dates, figures and formats everywhere. Keep a short glossary or style sheet for each project.",
      },
      {
        id: "a-cw-m15-practical",
        title: "Practical: a project report and a technical user guide",
        explain:
          "Write the App Rescue Project's progress report for the board as of 31 May 2026, and a short user guide for customers on resetting their PIN. The report must be honest about the delay, rated clearly, and end with next steps. The guide must let any customer reset their PIN without help, and keep them safe from fraud.",
        writingLab: {
          task:
            "Progress report: a Summary of two or three sentences; a status table with all three workstreams, each rated Green, Amber or Red (rate the delayed refunds Amber or Red), with its progress; Budget with spent, total and percentage and the forecast; Risks and issues with the duplicate-refund risk and its mitigation; Next steps with three dated actions. User guide: Before you start (what they need); at least six numbered steps, each starting with a verb, naming buttons exactly as in the brief, with the 5-minute code limit; and If something goes wrong (including Resend code and the security warning). Write the guide to the customer as \"you\".",
          brief: FINAL_BRIEF,
          doc: FINAL_DOC,
          tests: [
            { label: "Summary: two or three sentences, mentioning the delay", check: String.raw`const s = section('Summary') || ''; const n = sentences(s).length; return n >= 2 && n <= 3 && /(delay|14 june|late)/i.test(s);`, fail: "Summarise the overall status in two or three sentences, including the refund delay." },
            { label: "Status table: three workstreams with honest RAG ratings", check: String.raw`const r = rows(section('Status by workstream')); const get = (k) => r.find((c) => new RegExp(k, 'i').test(c[0])) || []; return r.length >= 3 && /^green$/i.test(get('pin')[1] || '') && /^(green|amber)$/i.test(get('login')[1] || '') && /^(amber|red)$/i.test(get('refund')[1] || '') && r.every((c) => words(c[2]) >= 5);`, fail: "Rate each workstream Green, Amber or Red: the PIN button is on track, but the delayed refunds must be Amber or Red." },
            { label: "Progress uses the real figures", check: String.raw`const t = rows(section('Status by workstream')).map((c) => c.join(' ')).join(' '); return /9,?400/.test(t) && /62\s?%/.test(t) && /11 seconds/i.test(t) && /3\s?%/.test(t);`, fail: "Report the results: 9,400 users and 62% fewer PIN calls, 11-second logins, and 3% duplicated refunds." },
            { label: "Budget, risk with mitigation, and dated next steps", check: String.raw`const b = section('Budget') || ''; const r = section('Risks and issues') || ''; const n = bullets(section('Next steps')); return /26\.5/.test(b) && /38/.test(b) && /70\s?%/.test(b) && /duplicat/i.test(r) && /(only after|two clean test|mitigat)/i.test(r) && n.length >= 3 && n.every((x) => /\d/.test(x));`, fail: "Give spent, total and 70%; the duplicate-refund risk with its mitigation; and three next steps with dates." },
            { label: "Guide: what you need, then six verb-first numbered steps", check: String.raw`const g = doc.split(/^#\s+User guide/m)[1] || ''; const steps = numbered(sections('Steps', g)[0]?.text || ''); const before = sections('Before you start', g)[0]?.text || ''; return /BVN/.test(before) && /phone/i.test(before) && steps.length >= 6 && steps.every((x) => isAction(x) || /^(open|enter|create|when|if)\b/i.test(x));`, fail: "List what customers need before starting, then at least six numbered steps that start with a verb." },
            { label: "Guide: exact button names, the 5-minute limit, \"you\", troubleshooting and security", check: String.raw`const g = doc.split(/^#\s+User guide/m)[1] || ''; const t = sections('If something goes wrong', g)[0]?.text || ''; return /Reset PIN/.test(g) && /5 minutes/i.test(g) && you(g) >= 3 && /Resend code/.test(t) && /never/i.test(t);`, fail: "Name the buttons as in the brief (Reset PIN, Resend code), mention the 5-minute code, write to \"you\", and include the security warning." },
          ],
          solution: FINAL_DONE,
          hint: "Write the report for a board member with two minutes; write the guide for a customer holding their phone in one hand.",
          successMessage: "An honest project report and a guide any customer can follow: two of the most useful documents in professional writing.",
        },
      },
    ],

    task: {
      title: "Module 15 practical: a report and a guide from real work",
      intro: "Document something real.",
      prompts: [
        "Choose a real question at your workplace, school or community (for example, why a service is underused) and gather evidence: a short survey or five interviews.",
        "Write a short analytical report: executive summary, introduction, findings with a table, conclusions and three specific recommendations.",
        "Turn one recommendation into a one-page project proposal with SMART objectives, scope and a dated plan.",
        "Write a user guide or SOP for a process you know well, then watch someone follow it and fix every step where they hesitate.",
        "Add version numbers and a version history to both documents.",
      ],
      closing: "Module 16 applies professional writing to your own career: CVs, cover letters and LinkedIn.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
