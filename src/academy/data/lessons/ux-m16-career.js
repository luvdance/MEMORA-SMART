/**
 * UI/UX DESIGN · MODULE 16 · PORTFOLIO DEVELOPMENT, FREELANCING AND CAREER PREPARATION
 *
 * Curriculum 16.1 – 16.23 and the final practical 16.P. The design
 * industry and its roles, portfolios, choosing projects, case studies,
 * decisions, process, research, prototypes and measured improvements,
 * Behance, Dribbble and personal sites, remote work and freelancing,
 * clients, briefs, communication, pricing, proposals, revisions, interviews
 * and continuous learning. The proposal lab's fees are computed and checked.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, docPage, MD, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s16-career";

/* ── Lesson 66 lab: a portfolio plan ───────────────────────────────────── */
const PLAN_MD = `# Portfolio plan

## Target role

## Projects
| Project | Problem | Platform | Skills shown |
|---------|---------|----------|--------------|
|         |         |          |              |
`;

const PLAN_MD_DONE = `# Portfolio plan

## Target role
Junior product designer at a FinTech or EdTech company in Lagos, or a remote role with a similar team.

## Projects
| Project | Problem | Platform | Skills shown |
|---------|---------|----------|--------------|
| KoboSave | Daily earners struggle to save small amounts regularly | Mobile | Research, interaction design, prototyping, usability testing |
| Memora Learn | Working learners cannot finish long lessons on their commute | Web | Information architecture, visual design, design system, accessibility |
| School fees dashboard | Bursars cannot see who has paid without manual spreadsheets | Web | Dashboard design, data visualisation, research, handoff |
`;

/* ── Lesson 67 lab: a case study ───────────────────────────────────────── */
const CASE_MD = `# Case study

## Overview
- Role:
- Team:
- Timeline:
- Tools:

## Problem

## Research

## Key decisions
-

## Testing and results

## Outcome

## Reflection
`;

const CASE_MD_DONE = `# Case study: KoboSave, a savings app for daily earners

## Overview
- Role: Lead UX/UI designer (research, flows, UI, testing)
- Team: Me, a product manager and two developers
- Timeline: 8 weeks
- Tools: Figma, FigJam, Google Forms, Google Sheets

## Problem
Market traders earn in cash every day but have no simple way to put small amounts aside, so money meant for rent and school fees is spent before it is needed.

## Research
I interviewed 6 traders in Lagos and surveyed 42 more. 5 of the 6 said they "forget" rather than choose not to save, and 71% of survey respondents already used a mobile money app.

## Key decisions
- We chose a daily reminder at closing time because 5 of 6 traders said they forget to save
- We chose to show the recipient's name before every transfer because two testers sent money to the wrong account
- We chose USSD as a fallback because a third of the traders had unreliable data

## Testing and results
Two rounds of usability testing with five traders each. Task completion for the first deposit rose from 60% to 100%, median time fell from 95s to 41s, and the SUS score rose from 62 to 84.

## Outcome
The developers built the MVP from the handoff file; in the pilot, 340 traders saved at least once in the first month.

## Reflection
I would recruit beyond one market earlier, because my first round of research over-represented traders who already used apps.
`;

/* ── Lesson 68 lab: a portfolio website page ───────────────────────────── */
const SITE_HTML = page(
  "Amaka Eze, product designer",
  `  <header class="hero">
    <h1 class="hero__name">Amaka Eze</h1>
    <p class="hero__role">Product designer in Lagos. I design savings, learning and health products for people on the move.</p>
    <a class="hero__cta" href="mailto:hello@example.com">Email me</a>
  </header>
  <main class="work">
    <h2 class="work__title">Selected work</h2>
    <div class="grid">
      <a class="project" href="kobosave.html"><img src="images/product.jpg"><h3>KoboSave</h3><p>Helping daily earners save: completion up from 60% to 100%.</p></a>
      <a class="project" href="learn.html"><img src="images/team.jpg"><h3>Memora Learn</h3><p>Lessons that fit a commute, with an accessible design system.</p></a>
      <a class="project" href="fees.html"><img src="images/hero.jpg"><h3>School fees dashboard</h3><p>From spreadsheets to a live view of who has paid.</p></a>
    </div>
  </main>`
);

const SITE_HTML_DONE = SITE_HTML.replace(
  '<img src="images/product.jpg">',
  '<img src="images/product.jpg" alt="KoboSave savings app screens on an Android phone">'
)
  .replace('<img src="images/team.jpg">', '<img src="images/team.jpg" alt="Memora Learn lesson screens on a laptop and a phone">')
  .replace('<img src="images/hero.jpg">', '<img src="images/hero.jpg" alt="School fees dashboard showing payment status by class">');

const SITE_CSS = `${BASE}
body { color: #111827; }

.hero { padding: 24px 16px; }
.hero__name { font-size: 22px; }
.hero__role { color: #a1a1aa; }
.hero__cta { font-size: 12px; color: #a1a1aa; }

.work { padding: 16px; }
.grid { display: grid; grid-template-columns: repeat(3, 360px); gap: 8px; }
.project { color: inherit; text-decoration: none; }
.project img { border-radius: 8px; }
`;

const SITE_CSS_DONE = `${BASE}
body { color: #111827; }

.hero { max-width: 1104px; margin: 0 auto; padding: 48px 16px 32px; }
.hero__name { margin: 0 0 8px; font-size: clamp(32px, 1.6rem + 2vw, 48px); line-height: 1.1; }
.hero__role { max-width: 600px; margin: 0 0 24px; font-size: 18px; color: #374151; }
.hero__cta { display: inline-block; min-height: 48px; padding: 14px 24px; border-radius: 10px; background: #6d28d9; color: #ffffff; font-weight: 700; text-decoration: none; }

.work { max-width: 1104px; margin: 0 auto; padding: 16px; }
.grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 900px) { .grid { grid-template-columns: repeat(3, 1fr); } }
.project { display: block; color: inherit; text-decoration: none; }
.project img { border-radius: 12px; aspect-ratio: 4 / 3; object-fit: cover; width: 100%; }
.project h3 { margin: 12px 0 4px; }
.project p { margin: 0; color: #374151; }
`;

/* ── Lesson 69 lab: a priced proposal ──────────────────────────────────── */
const HOURS = [["Research", 12], ["Wireframes", 16], ["UI design", 24], ["Prototype and testing", 12], ["Handoff", 6]];

const ESTIMATE_PAGE = docPage("Price the clinic website project", "proposal.md", [
  ...HOURS.map(([p, h]) => `${p}: ${h} hours`),
  "Your rate: ₦15,000 per hour",
  "Add a 10% contingency on top of the fee",
  "Deposit: 50% of the total including contingency, before work starts",
]);

const PROPOSAL_MD = `# Proposal: Kano Clinic website redesign

## Total hours

## Fee before contingency (₦)

## Total with 10% contingency (₦)

## Deposit (₦)

## Deliverables
-

## Revisions included

## Out of scope
-
`;

const PROPOSAL_MD_DONE = `# Proposal: Kano Clinic website redesign

## Total hours
70

## Fee before contingency (₦)
₦1,050,000

## Total with 10% contingency (₦)
₦1,155,000

## Deposit (₦)
₦577,500

## Deliverables
- Research summary with five patient interviews
- Wireframes and high-fidelity designs for five pages at desktop and mobile sizes
- An interactive prototype tested with five patients
- A Figma handoff package for the developer

## Revisions included
Two rounds of revisions at each stage.

## Out of scope
- Writing the website code
- Photography and copywriting
- Hosting and domain registration
`;

/* ── Lesson 70 lab: a STAR interview answer ────────────────────────────── */
const STAR_MD = `# Interview answer: "Tell me about a time a design you made did not work"

## Situation

## Task

## Action

## Result

## Questions to ask the interviewer
-
`;

const STAR_MD_DONE = `# Interview answer: "Tell me about a time a design you made did not work"

## Situation
On the KoboSave project, my first transfer design looked clean and the team loved it in review.

## Task
I had to find out why, in our first usability test, several traders sent money to the wrong account, and fix it before development started.

## Action
I watched the session recordings and found that people trusted the account number they had typed without checking it. I redesigned the confirmation step to show the recipient's name from the bank before sending, and I tested the new version with five more traders.

## Result
Wrong-recipient errors dropped from 2 of 5 participants to 0 of 5, and the team adopted the name check as a standard for every payment flow.

## Questions to ask the interviewer
- How do designers and developers work together here day to day?
- How does the team decide what to research and test?
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 16.1 – 16.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l66-industry",
    moduleId: "ux-m16-career",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3", "16.4"],
    title: "The Design Industry and Your Portfolio",
    subtitle: "Where designers work, the roles, and choosing what to show",
    estimatedMinutes: 30,
    intro:
      "The last module turns your skills into a career. This lesson maps the UI/UX design industry and its roles, explains what a professional portfolio is for, and helps you choose the projects that will go into yours.",

    atoms: [
      {
        id: "a-ux-industry",
        title: "Understanding the UI/UX design industry",
        explain:
          "Designers work in several settings. In-house product teams (banks, FinTechs, e-commerce, telecoms, EdTech, health) design one company's products over time. Agencies and studios design for many clients, project by project. Startups need generalists who do everything from research to UI. Freelancers work directly for clients, locally and abroad. Remote work has made international roles available from Nigeria, with competition to match. Hiring managers look for evidence of problem solving, a clear process, strong visual and interaction skills, communication, and collaboration with developers, more than for any single tool.",
      },
      {
        id: "a-ux-roles",
        title: "UI designer versus UX designer versus product designer",
        explain:
          "Job titles vary between companies, but the common pattern is this. A UX designer focuses on research, information architecture, flows, wireframes and testing. A UI designer focuses on visual and interaction design: layouts, typography, colour, components and design systems. A product designer does both, plus product thinking: working with product managers on what to build and measuring outcomes. Specialist roles include UX researcher, content designer (UX writer), interaction designer, design systems designer and design lead. Most junior roles in Nigeria are advertised as \"UI/UX designer\" or \"product designer\" and expect both sides.",
        table: {
          caption: "Common design roles.",
          headers: ["Role", "Focus", "Typical outputs"],
          rows: [
            ["UX designer", "Research, structure, flows, testing", "Journeys, site maps, wireframes, test reports"],
            ["UI designer", "Visual and interaction design", "High-fidelity screens, components, style guides"],
            ["Product designer", "End to end, plus product thinking", "Everything above, plus metrics and strategy"],
            ["UX researcher", "Research only, in depth", "Studies, insights, personas"],
            ["Content designer", "Words in the interface", "Labels, messages, content guidelines"],
          ],
        },
      },
      {
        id: "a-ux-building-portfolio",
        title: "Building a professional portfolio",
        explain:
          "A portfolio is your evidence: it shows how you think and work, not just what your screens look like. Most hiring managers spend only a few minutes on it, so make it easy: a short introduction (who you are, what you design, what you are looking for), three to five strong case studies rather than many weak ones, each with a clear summary at the top, real outcomes where possible, and a way to contact you. Quality beats quantity: one deep case study that shows research, decisions, testing and iteration is worth more than ten pretty screens.",
      },
      {
        id: "a-ux-selecting-projects",
        title: "Selecting portfolio projects",
        explain:
          "Choose projects that show the range of skills your target role needs (research, interaction design, visual design, testing, systems), on the platforms you want to work on (mobile and web), in domains that interest your target employers (FinTech, EdTech, health). Real projects are best (freelance, volunteer work for a local business or NGO, a redesign done for a real organisation), but strong self-initiated projects based on real research count too. The course practicals are your raw material: choose the three with the clearest problems, the best evidence and the most visible improvement.",
        webLab: {
          task:
            "Plan your portfolio in plan.md: a Target role of at least 8 words; and a Projects table with exactly three projects, each with a problem of at least 6 words, a platform (Mobile or Web), and the skills it shows. Across the three, include at least one Mobile and one Web project, and make sure research, testing, visual design and accessibility (or design system) are each shown at least once.",
          files: {
            "index.html": docPage("Portfolio plan", "plan.md", [
              "Target role: at least 8 words",
              "Projects: exactly three rows",
              "Each: a problem (6+ words), Mobile or Web, and skills shown",
              "At least one Mobile and one Web project",
              "Across them: research, testing, visual design, and accessibility or a design system",
            ]),
            "plan.md": PLAN_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "A target role of at least 8 words", check: MD + "return words(section('plan.md', 'Target role')) >= 8;", fail: "Say what role, in what kind of company or sector." },
            { label: "Exactly three complete projects", check: MD + String.raw`const r = rows(section('plan.md', 'Projects')).filter((c) => words(c[0]) >= 1); return r.length === 3 && r.every((c) => words(c[1]) >= 6 && /^(mobile|web)$/i.test((c[2] || '').trim()) && words(c[3]) >= 2);`, fail: "Three rows: name, problem, Mobile or Web, skills." },
            { label: "At least one Mobile and one Web project", check: MD + String.raw`const p = rows(section('plan.md', 'Projects')).map((c) => (c[2] || '').trim().toLowerCase()); return p.includes('mobile') && p.includes('web');`, fail: "Show both platforms." },
            { label: "Research, testing, visual design and accessibility or systems are covered", check: MD + String.raw`const s = rows(section('plan.md', 'Projects')).map((c) => c[3] || '').join(' ').toLowerCase(); return /research/.test(s) && /test/.test(s) && /visual|ui design/.test(s) && /accessib|design system/.test(s);`, fail: "Spread the skills across your three projects." },
          ],
          solution: { "plan.md": PLAN_MD_DONE },
          hint: "Look back at your module practicals: which three tell the strongest stories?",
          successMessage: "Three projects chosen on purpose, covering both platforms and every core skill. That is a portfolio with a plan.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 16.5 – 16.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l67-case-studies",
    moduleId: "ux-m16-career",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.5", "16.6", "16.7", "16.8", "16.9", "16.10"],
    title: "Writing Case Studies",
    subtitle: "Telling the story of a project so employers can see how you think",
    estimatedMinutes: 34,
    intro:
      "Case studies are the heart of a design portfolio. This lesson covers how to structure one, document decisions, present your problem-solving process, show research and wireframes, present prototypes, and demonstrate measurable usability improvements.",

    atoms: [
      {
        id: "a-ux-case-study-structure",
        title: "Writing design case studies",
        explain:
          "A case study tells the story of one project. A reliable structure: an overview (the product, your role, the team, the timeline and tools, and a one-line summary of the outcome); the problem (who had it, why it mattered, the constraints); research (what you did, what you found, with numbers); the process and key decisions; the solution (final designs, prototype); testing and results (what changed, with metrics); and a reflection (what you learned, what you would do differently). Lead with the outcome: many readers only read the top. Keep text short and visual, and be honest about your role in team projects.",
      },
      {
        id: "a-ux-documenting-decisions",
        title: "Documenting design decisions",
        explain:
          "Employers hire designers for judgement, so show your decisions and the reasons for them: \"We chose X because Y\", linked to evidence (\"because 5 of 6 traders said they forget to save\"). Include the options you considered and rejected, the trade-offs (\"we dropped the custom chart to ship two weeks sooner\"), and decisions that changed after testing. A decision log kept during a project (date, decision, reason, evidence) makes this easy to write later, and is good practice on real teams anyway.",
        decision: {
          scenario: "A junior designer's case study shows twenty polished screens with captions such as \"Home screen\" and \"Profile screen\", and nothing else.",
          question: "What is the biggest weakness?",
          options: [
            { id: "a", text: "It shows outputs but not the problem, the decisions or the evidence, so employers cannot see how the designer thinks", why: "Screens without reasoning look like decoration. Show the problem, research, decisions and results." },
            { id: "b", text: "It needs more screens", whyWrong: "More screens without reasoning adds nothing." },
            { id: "c", text: "The captions are too long", whyWrong: "They are too short and empty, if anything." },
            { id: "d", text: "It should be a video", whyWrong: "The format is not the problem; the missing story is." },
          ],
          correct: "a",
          aftermath: "A case study is an argument for your judgement, not a gallery.",
        },
      },
      {
        id: "a-ux-presenting-process",
        title: "Presenting the problem-solving process",
        explain:
          "Show how you moved from problem to solution, but do not narrate every step of a textbook process (\"Empathize, Define, Ideate…\"). Highlight the moments that mattered: the research insight that changed direction, the idea you abandoned and why, the test that revealed a problem. Use visuals to carry the story: a journey map with the key pain point circled, a before-and-after flow, sketches next to the final design. The reader should finish knowing what was hard about this problem and how you dealt with it.",
      },
      {
        id: "a-ux-showcasing-research",
        title: "Showcasing research and wireframes",
        explain:
          "Show research through its findings, not its raw materials: a few key insights with the evidence behind them (quotes, numbers), a persona or journey map only if it shaped the design, and a photo of an affinity map can show the work without being read. Show wireframes and sketches to reveal exploration: two or three layout options side by side with why you chose one. Annotate everything briefly. Protect confidentiality: anonymise participants and blur or recreate client data you are not allowed to share.",
      },
      {
        id: "a-ux-presenting-prototypes",
        title: "Presenting prototypes and demonstrating improvements",
        explain:
          "Bring the design to life with short screen recordings or GIFs of key interactions and a link to the clickable prototype (set to view only). Then show that it worked: usability results before and after changes (\"task completion rose from 60% to 100%; median time fell from 95 to 41 seconds; SUS rose from 62 to 84\"), product metrics after launch if you have them, and quotes from users. Numbers make improvements concrete and credible; if you have no launch data, test results from your own rounds of testing are perfectly valid evidence.",
        webLab: {
          task:
            "Write a case study in case.md for one of your projects (or adapt the KoboSave example): an Overview with role, team, timeline and tools filled; a Problem of at least 20 words; Research that includes numbers; at least two Key decisions written as \"We chose … because …\" (or \"I chose …\"); Testing and results with before-and-after numbers (at least two numbers, such as a percentage, seconds or a SUS score); an Outcome of at least 12 words; and a Reflection of at least 12 words.",
          files: {
            "index.html": docPage("Case study", "case.md", [
              "Overview: role, team, timeline and tools",
              "Problem: at least 20 words",
              "Research: include numbers",
              "Key decisions: two or more, \"We chose … because …\"",
              "Testing and results: before-and-after numbers",
              "Outcome and Reflection: 12+ words each",
            ]),
            "case.md": CASE_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Overview: role, team, timeline and tools", check: MD + String.raw`const b = bullets(section('case.md', 'Overview')); const f = (k) => b.some((l) => new RegExp('^' + k + '\\s*:\\s*\\S').test(l)); return f('Role') && f('Team') && f('Timeline') && f('Tools');`, fail: "Fill in all four Overview lines." },
            { label: "A problem of at least 20 words", check: MD + "return words(section('case.md', 'Problem')) >= 20;", fail: "Who had the problem, and why did it matter?" },
            { label: "Research with numbers", check: MD + String.raw`const s = section('case.md', 'Research') || ''; return words(s) >= 15 && /\d/.test(s);`, fail: "How many people, and what did they say or do?" },
            { label: "Two decisions with reasons", check: MD + String.raw`return bullets(section('case.md', 'Key decisions')).filter((l) => /\b(we|I) chose\b.+\bbecause\b/i.test(l)).length >= 2;`, fail: "\"We chose a daily reminder because 5 of 6 traders said they forget.\"" },
            { label: "Results with before-and-after numbers", check: MD + String.raw`const s = section('case.md', 'Testing') || ''; return (s.match(/\d+(\.\d+)?\s?(%|s\b|seconds?)|\bSUS\b/gi) || []).length >= 2 && /\b(from|before|rose|fell|improved|dropped|increased|decreased)\b/i.test(s);`, fail: "\"Completion rose from 60% to 100%; median time fell from 95s to 41s.\"" },
            { label: "Outcome and reflection", check: MD + "return words(section('case.md', 'Outcome')) >= 12 && words(section('case.md', 'Reflection')) >= 12;", fail: "What happened as a result, and what would you do differently?" },
          ],
          solution: { "case.md": CASE_MD_DONE },
          hint: "Write the results first: they decide what the rest of the story has to explain.",
          successMessage: "A case study that argues for your judgement: a real problem, evidence, decisions with reasons, and measured improvement.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 16.11 – 16.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l68-presence",
    moduleId: "ux-m16-career",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.11", "16.12", "16.13", "16.14", "16.15"],
    title: "Behance, Dribbble, Your Site and Finding Work",
    subtitle: "Where to show your work and where the opportunities are",
    estimatedMinutes: 32,
    intro:
      "Your work needs to be found. This lesson covers the main places designers publish (Behance, Dribbble and a personal website), how to find remote design opportunities, and how freelancing platforms work.",

    atoms: [
      {
        id: "a-ux-behance",
        title: "Behance portfolio",
        explain:
          "Behance, owned by Adobe, is a free platform for long-form project presentations: each project is a scrolling page of images, text and embedded prototypes, ideal for case studies. Recruiters and clients search it, and it has job listings. To use it well: create a project per case study, start with a strong cover image and a one-line summary, tell the story with large visuals and short captions, tag it with relevant fields (UI/UX, Interaction Design, Mobile), and link to your prototype and your own site. Appreciations and follows build visibility over time.",
      },
      {
        id: "a-ux-dribbble",
        title: "Dribbble fundamentals",
        explain:
          "Dribbble is a community for sharing short visual \"shots\": a single screen, an animation or a component, with a brief description. It is strong for visual and interaction design, inspiration and attracting clients who value polish, and it has a job board and freelance hiring features. Its weakness is that shots show outputs without process, so beautiful but impractical concepts are common there. Use it to show visual craft and interactions from your real projects, and always link to the full case study on Behance or your site.",
      },
      {
        id: "a-ux-portfolio-website",
        title: "Personal portfolio websites",
        explain:
          "A personal website gives you full control and a professional address (your-name.com): a short introduction with what you design and what you are looking for, three to five case studies, an about page, and a clear way to contact you. Build it with Framer, Webflow, Squarespace, Notion or your own code (Module 14 gave you enough HTML and CSS to start). It must practise what you preach: fast, responsive, accessible (alt text, contrast, keyboard focus), and readable on a phone, because recruiters often open it on one.",
        webLab: {
          task:
            "Make this portfolio page practise what it preaches, in index.html and style.css: give each project image alt text that describes what it shows (at least 4 words); make the name at least 32px; make the role and project text readable (4.5:1); make the contact link a clear button at least 44px tall with readable text; and lay the projects out in three columns on a laptop and one column on a phone, with no sideways scrolling.",
          files: { "index.html": SITE_HTML, "style.css": SITE_CSS },
          tests: [
            { label: "Every project image has descriptive alt text", check: "return $$('.project img').every((i) => (i.getAttribute('alt') || '').trim().split(/\\s+/).length >= 4);", fail: "alt=\"KoboSave savings app screens on an Android phone\" and similar." },
            { label: "The name is at least 32px", viewport: "mobile", check: "return px(style('.hero__name', 'font-size')) >= 32;", fail: ".hero__name { font-size: clamp(32px, …, 48px); }" },
            { label: "Role and project text are readable", check: CONTRAST + "return passes('.hero__role', 4.5) && passes('.project p', 4.5);", fail: "Use #374151 instead of #a1a1aa." },
            { label: "The contact link is a clear, readable button", check: CONTRAST + "const c = $('.hero__cta'); return rect(c).height >= 44 && style(c, 'background-color') !== 'rgba(0, 0, 0, 0)' && contrast(style(c, 'color'), style(c, 'background-color')) >= 4.5;", fail: ".hero__cta { display: inline-block; min-height: 48px; background: #6d28d9; color: #fff; }" },
            { label: "Laptop: three columns", check: "const r = $$('.project').map((p) => Math.round(rect(p).top)); return r[0] === r[1] && r[1] === r[2];", fail: "repeat(3, 1fr) from about 900px." },
            { label: "Phone: one column, no sideways scroll", viewport: "mobile", check: "const r = $$('.project').map((p) => rect(p)); return r[1].top > r[0].bottom && !overflowX();", fail: "Start with grid-template-columns: 1fr; fixed 360px columns overflow a phone." },
          ],
          solution: { "index.html": SITE_HTML_DONE, "style.css": SITE_CSS_DONE },
          hint: "Recruiters often open portfolios on a phone. Design that view first.",
          successMessage: "A portfolio page that is itself evidence of your skills: responsive, readable and accessible.",
        },
      },
      {
        id: "a-ux-remote-opportunities",
        title: "Finding remote design opportunities",
        explain:
          "Remote roles are advertised on general job boards (LinkedIn, Indeed), remote-specific boards (We Work Remotely, Remote OK, Working Nomads), design communities (Dribbble and Behance jobs, design Slack and Discord groups) and African tech networks and newsletters. Many roles are never advertised and come through people, so build relationships: share your work and what you are learning on LinkedIn and X, join and contribute to design communities, attend meetups and events, and ask for informal conversations. Before applying, check time-zone expectations, contract type and payment method, and research the company.",
      },
      {
        id: "a-ux-freelancing-platforms",
        title: "Freelancing platforms",
        explain:
          "Freelancing platforms such as Upwork, Fiverr, Contra and Toptal connect designers with clients. Clients post jobs and freelancers send proposals (Upwork), or freelancers list fixed services that clients buy (Fiverr). They provide payment protection and reach, but take fees (often 10% to 20%) and are competitive on price. To succeed: a focused profile (\"mobile app UX for FinTech startups\") with portfolio pieces that match, proposals tailored to each client's problem rather than templates, clear scope and milestones, excellent communication, and reviews that build over time. Many freelancers later move their best clients off-platform to direct relationships, within the platform's rules.",
        decision: {
          scenario: "A new freelancer sends the same copied proposal to fifty Upwork jobs a day: \"I am an expert designer with many skills. Hire me.\" Nobody replies.",
          question: "What would work better?",
          options: [
            { id: "a", text: "Fewer, tailored proposals that restate the client's problem, show one relevant project, and suggest a first step", why: "Clients choose people who understand their problem. A specific proposal stands out among dozens of copies." },
            { id: "b", text: "Send a hundred copies a day", whyWrong: "More of the same is still ignored." },
            { id: "c", text: "Offer to work for free", whyWrong: "Devalues the work and attracts the wrong clients." },
            { id: "d", text: "Add more skills to the generic message", whyWrong: "It is still not about the client." },
          ],
          correct: "a",
          aftermath: "Every proposal should be about the client's problem, not your list of skills.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 16.16 – 16.21
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l69-clients",
    moduleId: "ux-m16-career",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.16", "16.17", "16.18", "16.19", "16.20", "16.21"],
    title: "Clients, Briefs, Pricing and Proposals",
    subtitle: "Running design work as a professional service",
    estimatedMinutes: 34,
    intro:
      "Whether you freelance or work in an agency, you will work with clients. This lesson covers working with clients, understanding briefs, communicating well, pricing projects, writing proposals, and handling feedback and revisions without losing control of the project.",

    atoms: [
      {
        id: "a-ux-working-clients",
        title: "Working with clients and understanding design briefs",
        explain:
          "A client relationship starts with understanding. A design brief should tell you the business and its goals, the problem, the target users, what success looks like, the scope and deliverables, constraints (budget, timeline, technology, brand), and who decides. Briefs are often incomplete or describe a solution (\"we need a new website\"), so run a discovery conversation: ask why, for whom, what happens if nothing changes, and how you will measure success. Agree everything in writing before starting. Clients are experts in their business; you are the expert in design; good projects combine both.",
      },
      {
        id: "a-ux-client-communication",
        title: "Client communication",
        explain:
          "Communicate early, regularly and predictably: agree how and when you will update the client (a weekly summary, a call at each milestone), respond within an agreed time, and never let bad news wait (delays, scope problems). Present work with its reasoning (Module 10), and ask for specific feedback. Write down decisions and approvals after every meeting (\"As agreed today: …\"), so nothing is disputed later. Use plain language instead of design jargon. Set boundaries on working hours and channels: WhatsApp at midnight is not an emergency line.",
        decision: {
          scenario: "Halfway through a project, you realise the agreed deadline is not achievable because the client delivered content two weeks late.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Tell the client now, explain the cause, and propose options (a new date, or a reduced scope for the original date)", why: "Early, factual communication with options keeps trust and lets the client decide." },
            { id: "b", text: "Say nothing and hope to catch up", whyWrong: "Surprising a client at the deadline destroys trust." },
            { id: "c", text: "Work through the nights without telling anyone", whyWrong: "Unsustainable, and the client never learns about the cause." },
            { id: "d", text: "Deliver lower quality quietly to meet the date", whyWrong: "Hidden compromises damage your reputation and the client's product." },
          ],
          correct: "a",
          aftermath: "Bad news early, with options, is good communication.",
        },
      },
      {
        id: "a-ux-pricing",
        title: "Pricing design projects",
        explain:
          "Three common models. Hourly or daily rates: simple, and fair when scope is uncertain, but they reward slowness and clients fear open-ended bills. Fixed project prices: estimate the hours for each phase, multiply by your rate, add a contingency (often 10% to 20%) for the unexpected, and agree a clear scope; clients like certainty, but you carry the risk of underestimating. Value-based pricing: charge according to the value to the client's business (a checkout redesign that could earn millions is worth more than its hours). Always take a deposit (often 30% to 50%) before starting, tie payments to milestones, and raise your rates as your portfolio and demand grow.",
        example: "Estimate:  12 + 16 + 24 + 12 + 6 = 70 hours\nFee:       70 × ₦15,000 = ₦1,050,000\nContingency 10%: ₦1,050,000 × 1.10 = ₦1,155,000\nDeposit 50%: ₦577,500 before work starts",
      },
      {
        id: "a-ux-proposals",
        title: "Preparing design proposals",
        explain:
          "A proposal turns a conversation into an agreement. It restates the client's problem and goals in their words (showing you understood), describes your approach and the phases, lists the deliverables precisely, gives the timeline with milestones, the price and payment terms, the number of revision rounds included, what is out of scope, and the next step to start. A short, clear proposal that addresses the client's specific situation wins more work than a long generic one. Follow it with a simple contract covering scope, payment, revisions, ownership of the work and cancellation.",
        webLab: {
          task:
            "Price and scope the Kano Clinic website redesign in proposal.md using the estimate in the preview: the total hours; the fee before contingency at ₦15,000 per hour; the total with a 10% contingency; and the 50% deposit of that total. Then list at least three Deliverables, state how many revision rounds are included (a number), and list at least two things that are Out of scope.",
          files: { "index.html": ESTIMATE_PAGE, "proposal.md": PROPOSAL_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Total hours", check: MD + "return num(section('proposal.md', 'Total hours')) === 70;", fail: "Add the five phases' hours." },
            { label: "Fee before contingency", check: MD + "return num(section('proposal.md', 'Fee before')) === 1050000;", fail: "Hours × ₦15,000." },
            { label: "Total with 10% contingency", check: MD + "return num(section('proposal.md', 'Total with')) === 1155000;", fail: "The fee × 1.10." },
            { label: "Deposit", check: MD + "return num(section('proposal.md', 'Deposit')) === 577500;", fail: "Half of the total including contingency." },
            { label: "Deliverables, revisions and scope limits", check: MD + String.raw`const n = num((section('proposal.md', 'Revisions') || '').replace(/\b(one|two|three)\b/i, (w) => ({ one: 1, two: 2, three: 3 })[w.toLowerCase()])); return bullets(section('proposal.md', 'Deliverables')).filter((l) => words(l) >= 3).length >= 3 && n >= 1 && bullets(section('proposal.md', 'Out of scope')).filter((l) => words(l) >= 2).length >= 2;`, fail: "Three deliverables, a number of revision rounds, and two out-of-scope items." },
          ],
          solution: { "proposal.md": PROPOSAL_MD_DONE },
          hint: "Write the numbers without the naira sign or with it, as you like; the check reads the first number in each section.",
          successMessage: "A proposal with a price you can defend, a deposit that protects you, and a scope that protects both of you.",
        },
      },
      {
        id: "a-ux-client-feedback",
        title: "Handling feedback and revisions",
        explain:
          "Agree the revision process in the proposal: how many rounds at each stage, how feedback is given (consolidated by one decision-maker, in writing, by a date), and what happens with extra rounds or new requests (a change request with its own price and time). When feedback arrives, look for the problem behind it, respond to each point (do it, discuss it, or explain why not), and confirm the changes before making them. Scope creep (\"while you're at it, could you also design the app?\") is normal: welcome it as new work, priced separately, rather than absorbing it quietly.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 16.22, 16.23, 16.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l70-career",
    moduleId: "ux-m16-career",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["16.22", "16.23", "16.P"],
    title: "Interviews, Lifelong Learning and Your Final Practical",
    subtitle: "Getting hired, keeping growing, and three case studies to present",
    estimatedMinutes: 34,
    intro:
      "The final lesson prepares you for design interviews and for a career of continuous learning, then sets the course's final practical: three professional portfolio case studies, presented.",

    atoms: [
      {
        id: "a-ux-job-interviews",
        title: "Preparing for UI/UX interviews",
        explain:
          "Design hiring usually has several stages: a screening call; a portfolio presentation (walk through one or two case studies in 15 to 20 minutes, focusing on problem, decisions and results, and invite questions); a design exercise (a take-home task or a live whiteboard challenge, where interviewers judge how you clarify the problem and reason, more than the final pixels); an app critique (\"what would you improve in this app?\"); and behavioural questions. Answer behavioural questions with STAR: Situation, Task, Action (what you did, using \"I\"), Result (with numbers if possible). Prepare questions for them too: it shows interest and helps you judge the team.",
        webLab: {
          task:
            "Prepare a STAR answer to a common interview question, \"Tell me about a time a design you made did not work\", in star.md: a Situation of at least 12 words; a Task of at least 12 words; an Action of at least 25 words written about what you did (using \"I\"); a Result of at least 12 words that includes a number; and at least two questions you would ask the interviewer, each ending with a question mark.",
          files: {
            "index.html": docPage("A STAR interview answer", "star.md", [
              "Situation: 12+ words",
              "Task: 12+ words",
              "Action: 25+ words, using \"I\"",
              "Result: 12+ words, with a number",
              "Two or more questions for the interviewer, ending with \"?\"",
            ]),
            "star.md": STAR_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Situation and Task, at least 12 words each", check: MD + "return words(section('star.md', 'Situation')) >= 12 && words(section('star.md', 'Task')) >= 12;", fail: "Set the scene, then say what you had to do." },
            { label: "Action: at least 25 words about what you did", check: MD + String.raw`const s = section('star.md', 'Action') || ''; return words(s) >= 25 && /\bI\b/.test(s);`, fail: "Describe your own actions, using \"I\"." },
            { label: "Result with a number", check: MD + String.raw`const s = section('star.md', 'Result') || ''; return words(s) >= 12 && /\d/.test(s);`, fail: "What changed, and by how much?" },
            { label: "Two questions for the interviewer", check: MD + String.raw`return bullets(section('star.md', 'Questions')).filter((l) => /\?$/.test(l) && words(l) >= 5).length >= 2;`, fail: "Ask about how the team works, researches or decides." },
          ],
          solution: { "star.md": STAR_MD_DONE },
          hint: "Interviewers love a failure story with a clear lesson and a measured recovery.",
          successMessage: "A structured, specific answer with a measurable result, and good questions of your own. Practise saying it aloud.",
        },
      },
      {
        id: "a-ux-continuous-learning",
        title: "Continuous learning and professional development",
        explain:
          "Design changes constantly: tools, platforms, patterns, AI, and expectations. Keep growing deliberately: read and watch good sources (Nielsen Norman Group articles, the Material and Apple guidelines, Smashing Magazine, Figma's own resources); study products you admire and critique them; join communities (local design meetups, online groups) and contribute; find a mentor and, later, mentor others; take on projects slightly beyond your comfort zone; get feedback on your work often; and keep a log of what you learn. Strengthen adjacent skills too: writing, presenting, basic front-end code, business and data.",
        decision: {
          scenario: "Two years into a job, a designer realises they have only used one company's design system and have not learned anything new in months.",
          question: "Which plan best restarts their growth?",
          options: [
            { id: "a", text: "Set a learning goal, take on a stretch project, get regular feedback, join a community and find a mentor", why: "Deliberate practice, feedback and people outside your team are what keep designers growing." },
            { id: "b", text: "Collect more tool certificates", whyWrong: "Tools are the least important part of growth." },
            { id: "c", text: "Wait for the company to send them on training", whyWrong: "Growth is the designer's own responsibility." },
            { id: "d", text: "Change jobs immediately", whyWrong: "Sometimes right, but without a plan the stagnation can follow." },
          ],
          correct: "a",
          aftermath: "Your portfolio and skills are never finished; neither is your learning.",
        },
      },
      {
        id: "a-ux-final-practical",
        title: "Final practical: three professional case studies",
        explain:
          "The course ends with three portfolio case studies, built from your module practicals, and a presentation of them. Each should show a researched problem, your role, the key decisions and their evidence, the designs and prototype, testing and the improvements it led to, accessibility, and a reflection. Together they should cover research, interaction design, visual design and systems, on both mobile and web. Publish them on Behance, Dribbble or your own site, and present one to a real audience, ideally a designer who will give you honest feedback.",
        example: "Final checklist for each case study\n□ One-line summary with the outcome at the top\n□ Problem, users and constraints\n□ Research with numbers\n□ Two or more decisions with reasons and evidence\n□ Final designs and a prototype link\n□ Before-and-after test results\n□ Accessibility checked to WCAG AA\n□ Reflection: what you learned",
      },
    ],

    task: {
      title: "Final practical: develop and present three professional portfolio case studies",
      intro: "Bring the whole course together. This is the work you will show employers and clients.",
      prompts: [
        "Choose three projects from your module practicals (or real work) that together show research, interaction design, visual design and systems, on both mobile and web.",
        "Write each case study: overview and outcome, problem, research with evidence, key decisions with reasons, final designs and prototype, testing with before-and-after results, accessibility, and reflection.",
        "Design the case studies visually in Figma or your portfolio tool, with annotated images rather than walls of text, and check them on a phone.",
        "Publish them: on Behance, Dribbble or your own responsive, accessible portfolio website, with a short introduction and contact details.",
        "Present one case study in 15 minutes to a real audience, ideally a working designer, using STAR for the story, and act on their feedback.",
      ],
      closing: "Congratulations on completing UI/UX Design. Sit the certification exam when you are ready, and keep designing.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
