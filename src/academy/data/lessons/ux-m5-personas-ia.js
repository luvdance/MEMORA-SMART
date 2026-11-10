/**
 * UI/UX DESIGN · MODULE 5 · USER PERSONAS, USER JOURNEYS AND INFORMATION ARCHITECTURE
 *
 * Curriculum 5.1 – 5.17 and the practical 5.P. Evidence-based personas,
 * goals, behaviours and frustrations, scenarios, user stories, jobs to be
 * done, journey maps, friction, information architecture, content
 * hierarchy, site maps, navigation, card sorting and tree testing. The site
 * map lab parses the learner's nested list and measures its depth and width.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { docPage, MD } from "./ux-kit.js";

export const SECTION_ID = "ux-s5-personas-ia";

/* ── Lesson 19 lab: a persona with stories and a job ───────────────────── */
const PERSONA_MD = `# Persona

## Profile
- Name:
- Age:
- Occupation:
- Location:

## Goals
-

## Behaviours
-

## Frustrations
-

## Quote

## Evidence
-

## User stories
-

## Job to be done
`;

const PERSONA_MD_DONE = `# Persona: Chiamaka, the evening learner

## Profile
- Name: Chiamaka Obi
- Age: 27
- Occupation: Customer service officer at a bank
- Location: Lekki, Lagos

## Goals
- Move into a product design role within a year
- Learn in short sessions after work without falling behind
- Earn a certificate employers recognise

## Behaviours
- Studies on her phone on the bus home, usually 20 to 30 minutes
- Downloads videos on office Wi-Fi to save data
- Asks questions in WhatsApp groups when she is stuck

## Frustrations
- Long videos she cannot finish in one journey
- Losing her place when the app logs her out
- Paying for courses that turn out to be outdated

## Quote
"If I can't finish a lesson between Ajah and Obalende, I won't finish it at all."

## Evidence
- Based on interviews with five working learners (P1, P2, P4, P5, P7)
- 68% of 40 survey respondents study mainly on a phone

## User stories
- As an evening learner, I want lessons under 15 minutes so that I can finish one on my commute
- As an evening learner, I want the app to remember where I stopped so that I can continue after an interruption
- As a career changer, I want to see what employers think of a certificate so that I can choose a course worth paying for

## Job to be done
When I have a spare half hour on my commute, I want to make real progress on a skill, so I can change careers without giving up my job.
`;

/* ── Lesson 20 lab: a journey map ──────────────────────────────────────── */
const JOURNEY_MD = `# Journey map: renewing a driver's licence online

| Stage | Actions | Thoughts | Emotion (1-5) | Pain points | Opportunities |
|-------|---------|----------|---------------|-------------|---------------|
|       |         |          |               |             |               |

## Biggest friction point
`;

const JOURNEY_MD_DONE = `# Journey map: renewing a driver's licence online

| Stage | Actions | Thoughts | Emotion (1-5) | Pain points | Opportunities |
|-------|---------|----------|---------------|-------------|---------------|
| Discover | Searches online for how to renew | "Is this the official site?" | 3 | Several unofficial sites look official | Clear official branding and verified links |
| Apply | Fills the online form | "Why do they need my old licence number?" | 3 | Field names use internal jargon | Plain-language labels with examples |
| Pay | Pays the renewal fee with a card | "Did the payment go through?" | 2 | No confirmation for several minutes | Instant receipt by SMS and email |
| Book capture | Chooses a date for photo capture | "There are no free dates for a month" | 1 | Very few slots and no waiting list | Show more centres and offer a waiting list |
| Collect | Collects the licence at the centre | "Finally, but why two trips?" | 4 | Has to travel twice | SMS when the licence is ready |

## Biggest friction point
Book capture: the lowest emotion on the journey, because there are almost no capture slots and no way to be told when one opens.
`;

const JOURNEY_LOWEST = String.raw`const r = rows(raw('journey.md')).filter((c) => c[0] && !Number.isNaN(num(c[3]))); const low = r.reduce((a, c) => (num(c[3]) < num(a[3]) ? c : a), r[0]);`;

/* ── Lesson 21 lab: a site map ─────────────────────────────────────────── */
const PAGES = [
  "Home", "All courses", "Course categories", "Course details", "My courses", "Progress",
  "Certificates", "Profile", "Payment methods", "Notification settings", "Help centre",
  "Contact support", "Pricing", "Sign in", "Create account",
];

const SITEMAP_MD = `# Site map: Memora Learn

Indent with two spaces per level.

${PAGES.map((p) => `- ${p}`).join("\n")}
`;

const SITEMAP_MD_DONE = `# Site map: Memora Learn

- Home
- Courses
  - All courses
  - Course categories
    - Course details
  - Pricing
- My learning
  - My courses
  - Progress
  - Certificates
- Account
  - Profile
  - Payment methods
  - Notification settings
  - Sign in
  - Create account
- Help
  - Help centre
  - Contact support
`;

const TREE = String.raw`const tree = raw('sitemap.md').replace(/\r/g, '').split('\n').map((l) => l.match(/^( *)[-*]\s+(.+?)\s*$/)).filter(Boolean).map((m) => ({ depth: Math.floor(m[1].length / 2) + 1, label: m[2].trim() }));
`;

/* ── Lesson 22 lab: tree test results ──────────────────────────────────── */
const TREE_RESULTS = [
  ["T1", "Find your certificate for the Figma course", ["✓", "✓", "✓", "✓", "✗ Account", "✓", "✓", "✓"]],
  ["T2", "Change the card you pay with", ["✗ My learning", "✓", "✗ My learning", "✗ Help", "✓", "✗ My learning", "✓", "✗ My learning"]],
  ["T3", "Find out how much a course costs", ["✓", "✓", "✗ Help", "✓", "✓", "✓", "✗ Account", "✓"]],
];

const TREE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tree test results</title>
  <style>
    body { margin: 0; padding: 24px 16px; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #1f2937; background: #f8fafc; }
    main { max-width: 760px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; color: #111827; }
    .wrap { overflow-x: auto; }
    table { border-collapse: collapse; background: #ffffff; min-width: 640px; }
    th, td { padding: 6px 8px; border: 1px solid #e2e8f0; text-align: center; font-size: 14px; }
    td:nth-child(2), th:nth-child(2) { text-align: left; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>Tree test: 8 participants, 3 tasks</h1>
    <p>✓ = found the right page. ✗ = failed, followed by the top-level section they wrongly chose first. The correct answers: T1 is under My learning, T2 under Account, T3 under Courses. Write your analysis in <code>results.md</code>.</p>
    <div class="wrap">
    <table>
      <thead><tr><th>Task</th><th>Description</th>${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<th>U${n}</th>`).join("")}</tr></thead>
      <tbody>
${TREE_RESULTS.map(([id, d, r]) => `        <tr><td>${id}</td><td>${d}</td>${r.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("\n")}
      </tbody>
    </table>
    </div>
  </main>
</body>
</html>
`;

const TREE_MD = `# Tree test analysis

## T1 success rate (%)

## T2 success rate (%)

## T3 success rate (%)

## Task that needs attention

## Most common wrong first choice for that task

## Proposed fix
`;

const TREE_MD_DONE = `# Tree test analysis

## T1 success rate (%)
87.5

## T2 success rate (%)
37.5

## T3 success rate (%)
75

## Task that needs attention
T2: changing the payment card.

## Most common wrong first choice for that task
My learning (4 of the 5 failures).

## Proposed fix
People think of payment as part of their learning, not their account. Rename Account to "Account and billing" and add a "Payments" link under My learning that leads to the same page, then test again.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 5.1 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l19-personas",
    moduleId: "ux-m5-personas-ia",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6"],
    title: "Personas, Scenarios, Stories and Jobs",
    subtitle: "Turning research into people the whole team can design for",
    estimatedMinutes: 30,
    intro:
      "Research produces pages of notes; teams need something they can keep in mind while designing. This lesson covers the tools that compress research into a usable form: personas, scenarios, user stories and jobs to be done.",

    atoms: [
      {
        id: "a-ux-personas",
        title: "What are user personas, and evidence-based ones",
        explain:
          "A persona is a fictional but realistic description of a type of user, built from research: a name, a short profile, their goals, behaviours and frustrations, and often a quote. It lets a team ask \"would Chiamaka understand this?\" instead of arguing about an abstract \"user\". Personas are only useful when they are evidence-based: every goal, behaviour and frustration should trace back to things real participants said or did, and the persona should state what research it comes from. Personas invented in a meeting (\"proto-personas\") are acceptable only as clearly labelled assumptions to be tested. Most products need two to four personas, one of them primary.",
        why: "A persona made up from imagination just gives the team's assumptions a name and a face, which makes them harder to challenge.",
      },
      {
        id: "a-ux-persona-parts",
        title: "User goals, behaviours and frustrations",
        explain:
          "Three parts carry most of a persona's value. Goals: what the person is trying to achieve, both practical (\"pay fees before the deadline\") and life goals (\"get a better job\"). Behaviours: what they actually do today, including devices, habits, context and workarounds (\"studies on the bus, downloads videos on office Wi-Fi\"). Frustrations: what gets in their way. Demographic details (age, location) matter only when they change behaviour. Avoid irrelevant detail such as favourite food: it makes a persona feel real but gives no design guidance.",
        decision: {
          scenario: "A persona includes: \"Loves jollof rice, supports Arsenal, owns a cat named Biscuit.\" It has no frustrations listed.",
          question: "What is the problem?",
          options: [
            { id: "a", text: "The details are colourful but irrelevant, while the frustrations that should guide design are missing", why: "Every line of a persona should help the team make a design decision. Replace trivia with goals, behaviours and frustrations from research." },
            { id: "b", text: "It needs more hobbies", whyWrong: "More trivia adds nothing for design." },
            { id: "c", text: "Nothing: personas should feel like real people", whyWrong: "They should feel real through relevant detail, not trivia." },
            { id: "d", text: "Cats should not appear in personas", whyWrong: "The specific trivia is not the issue; the missing frustrations are." },
          ],
          correct: "a",
          aftermath: "Ask of every line in a persona: which design decision does this help?",
        },
      },
      {
        id: "a-ux-scenarios-stories",
        title: "User scenarios and user stories",
        explain:
          "A user scenario is a short story of a persona using the product in a specific situation: \"Chiamaka has 25 minutes on the bus home and wants to finish the lesson she started at lunch.\" Scenarios reveal context and constraints a feature list misses. A user story is a one-sentence requirement written from the user's side, in the form agile development teams use: \"As a [type of user], I want [goal] so that [benefit].\" The \"so that\" is essential: it explains why, which lets designers and developers find the best way to deliver it. Stories are usually paired with acceptance criteria that say when the story is done.",
        example:
          "Scenario: Chiamaka is on the bus with patchy data and 25 minutes. She opens the app to continue yesterday's lesson.\n\nUser story: As an evening learner, I want the app to remember where I stopped so that I can continue after an interruption.\n\nAcceptance criteria:\n- Opening the app shows \"Continue: Lesson 4, 6 minutes left\"\n- Progress is saved even if the connection drops",
      },
      {
        id: "a-ux-jtbd",
        title: "Jobs to Be Done (JTBD) fundamentals",
        explain:
          "Jobs to Be Done is a way of thinking that focuses on the progress a person is trying to make, rather than on who they are. People \"hire\" a product to get a job done in a particular situation, and \"fire\" it when something does the job better. A job statement has the form: \"When [situation], I want to [motivation], so I can [expected outcome].\" JTBD helps you see real competition (a learner might hire a YouTube video, a friend or a night class for the same job) and keeps attention on outcomes. It complements personas: personas describe people, jobs describe what they are trying to achieve.",
        webLab: {
          task:
            "Write an evidence-based persona for a learner on an e-learning platform. Complete persona.md: a Profile with name, age, occupation and location filled; at least three Goals, three Behaviours and three Frustrations (each at least four words); a Quote in quotation marks; at least one Evidence line citing participants or a number; at least two User stories in the form \"As a …, I want … so that …\"; and a Job to be done in the form \"When …, I want to …, so I can …\".",
          files: {
            "index.html": docPage("Persona", "persona.md", [
              "Profile: name, age, occupation and location",
              "Goals, Behaviours and Frustrations: three or more each",
              "Quote: in quotation marks",
              "Evidence: participants or numbers your persona is based on",
              "User stories: two or more, As a … I want … so that …",
              "Job to be done: When …, I want to …, so I can …",
            ]),
            "persona.md": PERSONA_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Profile: name, age, occupation and location", check: MD + String.raw`const b = bullets(section('persona.md', 'Profile')); const f = (k) => b.some((l) => new RegExp('^' + k + '\\s*:\\s*\\S').test(l)); return f('Name') && f('Age') && f('Occupation') && f('Location') && b.some((l) => /^Age\s*:\s*\d+/.test(l));`, fail: "Fill in each Profile line, with a number for Age." },
            { label: "Three goals, three behaviours and three frustrations", check: MD + "return ['Goals', 'Behaviours', 'Frustrations'].every((s) => bullets(section('persona.md', s)).filter((l) => words(l) >= 4).length >= 3);", fail: "Three lines of four words or more in each of Goals, Behaviours and Frustrations." },
            { label: "A quote in quotation marks", check: MD + String.raw`return /["“][^"”]{12,}["”]/.test(section('persona.md', 'Quote') || '');`, fail: "Write something this person might say, in quotation marks." },
            { label: "Evidence cites participants or numbers", check: MD + String.raw`return bullets(section('persona.md', 'Evidence')).some((l) => /\bP\d+\b|\d/.test(l) && words(l) >= 4);`, fail: "Say which research the persona comes from, such as \"interviews with P1, P3 and P4\"." },
            { label: "Two user stories in the right form", check: MD + String.raw`return bullets(section('persona.md', 'User stories')).filter((l) => /^As an? .+?, I want .+? so that .+/i.test(l)).length >= 2;`, fail: "As a [user], I want [goal] so that [benefit]." },
            { label: "A job statement in the right form", check: MD + String.raw`return /^When .+?, I want to .+?, so I can .+/im.test(section('persona.md', 'Job to be done') || '');`, fail: "When [situation], I want to [motivation], so I can [outcome]." },
          ],
          solution: { "persona.md": PERSONA_MD_DONE },
          hint: "Write behaviours as things the person actually does, with context: where, when, on what device.",
          successMessage: "A persona the team can design for: grounded in evidence, with stories and a job that tell developers what to build and why.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 5.7 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l20-journeys",
    moduleId: "ux-m5-personas-ia",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.7", "5.8", "5.9"],
    title: "Journey Maps and Friction Points",
    subtitle: "Seeing the whole experience, stage by stage",
    estimatedMinutes: 26,
    intro:
      "A persona says who; a journey map says what they go through. This lesson shows how to map an experience from start to finish, how a user journey differs from a customer journey, and how to find the friction points where people struggle.",

    atoms: [
      {
        id: "a-ux-journey-mapping",
        title: "User journey mapping",
        explain:
          "A journey map is a visual timeline of one persona achieving one goal. Across the top are stages (discover, apply, pay, wait, collect). For each stage it records the person's actions, their thoughts (often quotes from research), their emotional state (often a line rising and falling, or a 1 to 5 score), the pain points, and the opportunities to improve. Journey maps are built from research, made collaboratively (FigJam is ideal), and used to agree where to focus. Map the current experience before designing the future one.",
        example:
          "Stage     Discover → Apply → Pay → Book capture → Collect\nEmotion      3         3       2         1             4\n                                         ▲ lowest point: the opportunity",
      },
      {
        id: "a-ux-customer-vs-user",
        title: "Customer journey versus user journey",
        explain:
          "A customer journey covers the whole relationship with an organisation across every channel and over a long period: seeing an advert, visiting a branch, calling support, receiving a letter, renewing. A user journey is narrower: one person using one product to complete one task, usually step by step through the interface. Customer journeys help organisations fix gaps between channels (\"the app says one thing, the branch says another\"); user journeys help designers fix a specific flow. The customer and the user may also be different people: a parent pays (customer) for a course their child takes (user).",
        decision: {
          scenario: "A school buys a learning platform for its students. The bursar chooses and pays; the students use it every day.",
          question: "How should the design team treat these two groups?",
          options: [
            { id: "a", text: "Design for both: the bursar's purchasing journey and the students' daily user journeys have different goals", why: "The customer must be convinced to buy and renew; the users must be able to learn. Neglect either and the product fails." },
            { id: "b", text: "Design only for the bursar, who pays", whyWrong: "If students cannot use it, the school will not renew." },
            { id: "c", text: "Design only for students; the bursar does not matter", whyWrong: "The bursar decides whether the product is bought at all." },
            { id: "d", text: "Treat them as one persona", whyWrong: "Their goals, contexts and tasks are completely different." },
          ],
          correct: "a",
          aftermath: "When the customer and the user are different people, both journeys need designing.",
        },
      },
      {
        id: "a-ux-friction-points",
        title: "Identifying friction points",
        explain:
          "Friction is anything that slows people down, confuses them or makes them anxious: an unclear step, a long form, a wait with no feedback, a surprise fee, a dead end. On a journey map friction shows up as dips in emotion and clusters of pain points. Look especially at transitions between stages and channels (paying online then waiting for an SMS), at steps where people must remember or look something up, and at moments of uncertainty (\"did it work?\"). The deepest dip is usually the best opportunity.",
        webLab: {
          task:
            "Map the journey of renewing a driver's licence online. In journey.md, fill the table with at least five stages in order; for each, the person's actions and thoughts (at least three words each), an emotion score from 1 (very negative) to 5 (very positive), a pain point and an opportunity (at least three words each). Use at least three different emotion scores. Then, under \"Biggest friction point\", name the stage with the lowest emotion score and explain why in at least 10 words.",
          files: {
            "index.html": docPage("Journey map", "journey.md", [
              "Five or more stages in order",
              "Actions, Thoughts, Pain points and Opportunities: three words or more each",
              "Emotion: a whole number from 1 to 5, with at least three different scores",
              "Biggest friction point: name the lowest-scoring stage and explain why",
            ]),
            "journey.md": JOURNEY_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "At least five complete stages", check: MD + String.raw`const r = rows(raw('journey.md')).filter((c) => words(c[0]) >= 1 && words(c[1]) >= 3 && words(c[2]) >= 3 && words(c[4]) >= 3 && words(c[5]) >= 3); return r.length >= 5;`, fail: "Each row needs a stage, actions, thoughts, a pain point and an opportunity." },
            { label: "Emotion scores are whole numbers from 1 to 5", check: MD + String.raw`const r = rows(raw('journey.md')).filter((c) => c[0]); return r.length >= 5 && r.every((c) => /^[1-5]$/.test((c[3] || '').trim()));`, fail: "Write a single number from 1 to 5 in every Emotion cell." },
            { label: "The emotion varies along the journey", check: MD + String.raw`return new Set(rows(raw('journey.md')).filter((c) => c[0]).map((c) => num(c[3]))).size >= 3;`, fail: "Real journeys rise and fall: use at least three different scores." },
            { label: "The biggest friction point is the lowest-scoring stage", check: MD + JOURNEY_LOWEST + String.raw`const s = section('journey.md', 'Biggest friction') || ''; return !!low && s.toLowerCase().includes(low[0].toLowerCase()) && words(s) >= 10;`, fail: "Name the stage with the lowest emotion score, exactly as written in the table, and say why." },
          ],
          solution: { "journey.md": JOURNEY_MD_DONE },
          hint: "Think about the moments of waiting and uncertainty: those are usually where emotion drops.",
          successMessage: "A whole experience on one page, with the deepest friction point identified. That stage is where your design effort should go first.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 5.10 – 5.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l21-ia",
    moduleId: "ux-m5-personas-ia",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.10", "5.11", "5.12", "5.13", "5.14"],
    title: "Information Architecture and Site Maps",
    subtitle: "Organising content so people can find it",
    estimatedMinutes: 30,
    intro:
      "If people cannot find something, it may as well not exist. Information architecture is the discipline of organising and labelling content so that people can find what they need. This lesson covers its principles, content hierarchy, site maps and navigation structures.",

    atoms: [
      {
        id: "a-ux-ia",
        title: "Information architecture (IA)",
        explain:
          "Information architecture is the structure of a product's content: how it is grouped, labelled, ordered and connected, so that people can find information and complete tasks. It has four main systems: organisation (how content is grouped), labelling (what groups and links are called), navigation (how people move between them) and search (how they find things directly). Good IA matches users' mental models, the way they already think about the content, rather than the organisation's internal structure. A bank organised by its departments (\"Retail Banking Division\") instead of by customer tasks (\"Send money\", \"Pay bills\") has inside-out IA.",
      },
      {
        id: "a-ux-organising-information",
        title: "Organising information and content hierarchy",
        explain:
          "Content can be organised by exact schemes (alphabetical, chronological, geographical), which work when people know exactly what they want, or by ambiguous schemes (by topic, by task, by audience), which suit browsing. Most products mix them: a course catalogue grouped by topic, sortable by date. Content hierarchy then orders information by importance, from broad to specific: categories contain subcategories, which contain pages; and on each page, the most important content comes first. Keep groups meaningful, labels in users' words, and avoid catch-all groups such as \"Other\" or \"Resources\" that become dumping grounds.",
        table: {
          caption: "Organisation schemes and when they suit.",
          headers: ["Scheme", "Example", "Works when"],
          rows: [
            ["Alphabetical", "A to Z list of drugs", "People know the exact name"],
            ["Chronological", "News, transaction history", "Time is what matters"],
            ["Geographical", "Branches by state", "Location matters"],
            ["Topic", "Courses by subject", "People browse"],
            ["Task", "Send money, Pay bills, Buy airtime", "People come to do something"],
            ["Audience", "Students, Parents, Staff", "Groups need very different content"],
          ],
        },
      },
      {
        id: "a-ux-site-maps",
        title: "Site maps",
        explain:
          "A site map is a diagram of a product's structure: every page or screen, arranged in a hierarchy from the home page down. It shows what exists, how pages group, and how deep the structure goes. Designers draw site maps after research and card sorting, and before wireframes, because they decide the navigation. Good site maps are broad and shallow rather than narrow and deep: people find things faster choosing among five to seven sensible options at each level than clicking through many levels, and anything important should be no more than three levels down.",
        example:
          "Home\n├── Courses\n│   ├── All courses\n│   └── Course categories\n│       └── Course details\n├── My learning\n│   ├── My courses\n│   └── Certificates\n├── Account\n└── Help",
      },
      {
        id: "a-ux-navigation-structures",
        title: "Navigation structures",
        explain:
          "Navigation turns the site map into ways of moving around. Global navigation is available everywhere (a top bar on websites, a bottom tab bar in mobile apps, usually three to five items). Local navigation moves within a section (sub-menus, side menus, tabs). Contextual navigation links related content within the page (\"related courses\"). Utility navigation holds secondary tools (account, language, help). Breadcrumbs show where you are in a hierarchy (Home › Courses › Design). Structures follow the site map's shape: hierarchical (tree), hub and spoke (return to a home screen between tasks, common in apps), or sequential (step-by-step, as in checkout).",
        webLab: {
          task:
            "Memora Learn's site map is a flat list of 15 pages, which would mean 15 items in the main navigation. Restructure sitemap.md as a nested list (two spaces of indentation per level): between 4 and 7 top-level items; nothing deeper than 3 levels; every one of the 15 pages appearing exactly once (you may add group labels such as \"Courses\" or \"Account\"); and every top-level group that is not a page itself containing at least two items.",
          files: {
            "index.html": docPage("Restructure the site map", "sitemap.md", [
              "Between 4 and 7 top-level items",
              "No more than 3 levels deep",
              "All 15 pages, each exactly once (group labels may be added)",
              "Each top-level group label contains at least two items",
              "Indent two spaces per level: \"- Courses\" then \"  - All courses\"",
            ]),
            "sitemap.md": SITEMAP_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Between 4 and 7 top-level items", check: TREE + "const top = tree.filter((n) => n.depth === 1).length; return top >= 4 && top <= 7;", fail: "Group the pages under a few top-level sections." },
            { label: "No more than 3 levels deep", check: TREE + "return tree.length > 0 && tree.every((n) => n.depth <= 3);", fail: "Flatten anything indented more than two levels." },
            { label: "All 15 pages, each exactly once", check: TREE + `const pages = ${JSON.stringify(PAGES)}; const labels = tree.map((n) => n.label.toLowerCase()); return pages.every((p) => labels.filter((l) => l === p.toLowerCase()).length === 1);`, fail: "Every original page must appear once, with its exact name." },
            { label: "Each top-level group holds at least two items", check: TREE + `const pages = ${JSON.stringify(PAGES)}.map((p) => p.toLowerCase()); let ok = true; tree.forEach((n, i) => { if (n.depth !== 1 || pages.includes(n.label.toLowerCase())) return; let kids = 0; for (let j = i + 1; j < tree.length && tree[j].depth > 1; j += 1) if (tree[j].depth === 2) kids += 1; if (kids < 2) ok = false; }); return ok && tree.some((n) => n.depth === 2);`, fail: "A group with only one item is not a group: merge it or add a related page." },
          ],
          solution: { "sitemap.md": SITEMAP_MD_DONE },
          hint: "Think about why someone visits: to find courses, to continue learning, to manage their account, or to get help.",
          successMessage: "Fifteen pages in five clear sections, none more than three clicks down. That is a navigation people can learn at a glance.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 5.15 – 5.17, 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l22-sorting-testing",
    moduleId: "ux-m5-personas-ia",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.15", "5.16", "5.17", "5.P"],
    title: "Card Sorting, Tree Testing and Intuitive Navigation",
    subtitle: "Testing structure with users before any screen exists",
    estimatedMinutes: 30,
    intro:
      "You can test a structure before drawing a single screen. Card sorting shows how users would group your content; tree testing shows whether they can find things in the structure you chose. This lesson covers both, what makes navigation intuitive, and your module practical.",

    atoms: [
      {
        id: "a-ux-card-sorting",
        title: "Card sorting",
        explain:
          "In a card sort, participants group cards, each naming one piece of content (\"Change password\", \"Certificates\"), into categories that make sense to them. In an open card sort they create and name their own categories, which reveals their mental model and vocabulary. In a closed card sort they sort into categories you provide, which tests whether your categories work. Use 30 to 60 cards and around 15 participants for patterns; tools such as Optimal Workshop or a FigJam board work, as do paper cards. Look for cards that are consistently grouped together, cards that are split across groups (a sign of an unclear label), and the words people use for their groups.",
      },
      {
        id: "a-ux-tree-testing",
        title: "Tree testing",
        explain:
          "A tree test checks whether people can find things in a proposed structure, with no visual design at all. Participants see only the text hierarchy (the \"tree\") and are given tasks (\"Where would you change your payment card?\"); they click down through the levels until they choose an answer. Measure each task's success rate (the percentage who found the right place), directness (whether they went straight there without backtracking), and where wrong answers went, especially the first click. A task with a low success rate points to a misleading label or a misplaced page; the most common wrong first click tells you where people expected it.",
        example:
          "Success rate = participants who found the right page ÷ all participants × 100\n\nT2 \"Change the card you pay with\": 3 of 8 succeeded → 37.5%\nWrong first clicks: My learning ×4, Help ×1\n→ People expect payment under My learning, not Account",
        webLab: {
          task:
            "Eight people tried three tasks on Memora Learn's new tree (results in the preview). In results.md, give the success rate of each task as a percentage; name the task that needs attention; name the most common wrong first choice for that task; and propose a fix in at least 15 words.",
          files: { "index.html": TREE_PAGE, "results.md": TREE_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "T1 success rate", check: MD + "return Math.abs(num(section('results.md', 'T1 success')) - 87.5) < 0.06;", fail: "Count the ✓ marks for T1 and divide by 8." },
            { label: "T2 success rate", check: MD + "return Math.abs(num(section('results.md', 'T2 success')) - 37.5) < 0.06;", fail: "Count the ✓ marks for T2 and divide by 8." },
            { label: "T3 success rate", check: MD + "return Math.abs(num(section('results.md', 'T3 success')) - 75) < 0.06;", fail: "Count the ✓ marks for T3 and divide by 8." },
            { label: "The task that needs attention", check: MD + String.raw`return /\bT2\b/.test(section('results.md', 'Task that needs') || '');`, fail: "Which task has by far the lowest success rate?" },
            { label: "The most common wrong first choice", check: MD + "return /my learning/i.test(section('results.md', 'Most common wrong') || '');", fail: "Count where the failed attempts on that task went first." },
            { label: "A proposed fix of at least 15 words", check: MD + "return words(section('results.md', 'Proposed fix')) >= 15;", fail: "Use where people looked to suggest a better label or location, and say how you would check it." },
          ],
          solution: { "results.md": TREE_MD_DONE },
          hint: "The wrong answers are the most useful data: they show where people expected to find it.",
          successMessage: "You found a navigation problem with no screens designed and no code written, and you know exactly where users expected the page to be.",
        },
      },
      {
        id: "a-ux-intuitive-navigation",
        title: "Designing intuitive navigation systems",
        explain:
          "Intuitive navigation lets people answer three questions at any moment: where am I, where can I go, and how do I get back? Use labels in users' own words (from card sorts and interviews), not internal jargon; keep global navigation short (three to five items on mobile, up to about seven on desktop); show the current location clearly (highlighted tab, breadcrumbs, page title); follow platform conventions (bottom tabs on phones, a top bar on websites); keep navigation in the same place on every screen; and give search to people who know what they want. Test it: tree tests before design, usability tests after.",
        decision: {
          scenario: "A bank app's main tabs are labelled \"Retail\", \"Channels\", \"Instruments\" and \"Services\", the names of the bank's internal departments.",
          question: "What is the best fix?",
          options: [
            { id: "a", text: "Relabel by customer tasks in their words, such as Home, Send money, Pay bills, Cards, and test with a tree test", why: "Labels from users' vocabulary, organised around their tasks, match how they think. Testing confirms it." },
            { id: "b", text: "Add icons to the existing labels", whyWrong: "Icons cannot rescue labels that mean nothing to customers." },
            { id: "c", text: "Add a tutorial explaining the departments", whyWrong: "People should not have to learn an organisation chart to send money." },
            { id: "d", text: "Hide the tabs in a hamburger menu", whyWrong: "That hides the problem and the navigation." },
          ],
          correct: "a",
          aftermath: "Organise around what users want to do, labelled in the words they use.",
        },
      },
    ],

    task: {
      title: "Module 5 practical: persona, journey map and site map for an e-learning platform",
      intro: "Use your Module 4 research, or interview three learners, to ground every artefact.",
      prompts: [
        "Create one evidence-based primary persona for an e-learning platform: profile, goals, behaviours, frustrations, a quote, user stories, a job statement, and the research it comes from.",
        "Map that persona's current journey of finding, buying and starting a course, with stages, actions, thoughts, emotions, pain points and opportunities, in FigJam.",
        "Run a quick open card sort with at least five people using 25 to 30 content cards, and note the groups and labels they create.",
        "Draw the site map for the platform in FigJam, broad and shallow, using the labels people used.",
        "Run a short tree test with five people and three tasks, record the success rates, and revise the site map.",
      ],
      closing: "Module 6 designs how people move through this structure: user flows and interaction design.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
