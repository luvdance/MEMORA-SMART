/**
 * UI/UX DESIGN · MODULE 2 · DESIGN THINKING AND HUMAN-CENTRED DESIGN
 *
 * Curriculum 2.1 – 2.11 and the practical 2.P. Design thinking, human-centred
 * principles, the five stages, problems before solutions, frustrations,
 * defining problems, ideation, divergent and convergent thinking, problem
 * statements, validating assumptions and iteration.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { docPage, MD } from "./ux-kit.js";

export const SECTION_ID = "ux-s2-design-thinking";

/* ── Lesson 6 lab: sort activities into the five stages ────────────────── */
const ACTIVITIES = [
  "Interview five market traders about how they save money today",
  "Watch a trader deposit cash with a mobile money agent",
  "Write: \"Traders need to save small daily amounts without the temptation to withdraw\"",
  "Group the interview notes into themes on sticky notes",
  "Sketch eight different solutions in ten minutes",
  "Vote on the three most promising ideas",
  "Draw the savings screen on paper",
  "Build a clickable Figma version of the deposit flow",
  "Ask five traders to make a deposit with the clickable version while you watch",
  "Count how many traders completed the deposit without help",
];

const STAGES_MD = `# The five stages of design thinking

Write the number of each activity under the stage it belongs to,
one "- " line per activity (for example "- 1").

## Empathize
-

## Define
-

## Ideate
-

## Prototype
-

## Test
-
`;

const STAGES_MD_DONE = `# The five stages of design thinking

## Empathize
- 1
- 2

## Define
- 3
- 4

## Ideate
- 5
- 6

## Prototype
- 7
- 8

## Test
- 9
- 10
`;

const stageCheck = (stage, nums) =>
  MD +
  `const got = bullets(section('stages.md', '${stage}')).map((l) => num(l)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b); return got.join() === '${nums.join()}';`;

/* ── Lesson 7 lab: frustrations from interview notes ───────────────────── */
const QUOTES = [
  ["P1", "Half the time the top-up machine at the terminal is not working, so I queue at the counter."],
  ["P1", "I never know my balance until the gate beeps at me."],
  ["P2", "The machine was down again this morning."],
  ["P2", "Morning queues at the counter are twenty minutes long, and I missed my bus."],
  ["P3", "I can't see how much is left on my card, so I top up too much just in case."],
  ["P3", "The counter only takes cash, and I don't carry cash any more."],
  ["P4", "Machine broken, as usual. I had to beg the conductor to let me through."],
  ["P4", "They had no change at the counter for my ₦1,000 note."],
  ["P5", "Every machine at Obalende was off when I got there."],
  ["P5", "I found out my card was empty at the gate, with people pushing behind me."],
];

const NOTES_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bus card interviews</title>
  <style>
    body { margin: 0; padding: 24px 16px; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937; background: #f8fafc; }
    main { max-width: 680px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; color: #111827; }
    ol { padding-left: 0; list-style: none; }
    li { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 8px; }
    strong { color: #0f766e; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>Interview notes: topping up a bus card</h1>
    <p>Five commuters (P1 to P5) were interviewed about topping up their bus cards. Write your analysis in <code>frustrations.md</code>.</p>
    <ol>
${QUOTES.map(([p, t]) => `      <li><strong>${p}:</strong> "${t}"</li>`).join("\n")}
    </ol>
  </main>
</body>
</html>
`;

const FRUSTRATIONS_MD = `# Frustrations with topping up a bus card

| Frustration | Participants | Count |
|-------------|--------------|-------|
|             |              |       |

## Most common frustration
`;

const FRUSTRATIONS_MD_DONE = `# Frustrations with topping up a bus card

| Frustration | Participants | Count |
|-------------|--------------|-------|
| Top-up machines are broken or switched off | P1, P2, P4, P5 | 4 |
| Cannot see the card balance until the gate | P1, P3, P5 | 3 |
| Counter problems with cash and change | P3, P4 | 2 |
| Long queues at the counter | P2 | 1 |

## Most common frustration
Broken or switched-off top-up machines: four of the five commuters mentioned them, and they push everyone to the counter, which causes the queues.
`;

const groupCheck = (ids) =>
  MD +
  `const want = '${ids.join()}'; return rows(raw('frustrations.md')).some((c) => { const ps = (c[1] || '').toUpperCase().match(/P\\d/g) || []; return [...new Set(ps)].sort().join() === want && num(c[2]) === ${ids.length}; });`;

/* ── Lesson 8 lab: a problem statement and How Might We questions ─────── */
const PROBLEM_MD = `# Defining the problem: hospital appointments

The hospital's brief said: "We need an app with a chatbot for booking."
Rewrite it as a problem, not a solution.

## Problem statement
We need an app with a chatbot for booking.

## How might we
-

## Chosen direction
`;

const PROBLEM_MD_DONE = `# Defining the problem: hospital appointments

## Problem statement
Working parents in Ibadan need to see a doctor without losing a whole day of work, because the hospital gives no appointment times and patients must queue from 6am to be seen.

## How might we
- How might we let patients know roughly when they will be seen before they leave home?
- How might we make waiting time useful instead of wasted?
- How might we reduce the number of visits that could be handled by phone?

## Chosen direction
Give every patient an estimated time slot by SMS when they register, because most parents have basic phones and the biggest loss is the unpredictable wait.
`;

const SOLUTION_WORDS = String.raw`/\b(app|application|website|chatbot|bot|button|screen|feature|dashboard|platform|AI)\b/i`;

/* ── Lesson 9 lab: a proposal for a Nigerian digital service ───────────── */
const PROPOSAL_MD = `# Design proposal

## Service
_Which Nigerian digital service, and what does it do?_

## Problem statement
_[User] needs [need] because [insight]._

## Evidence
-

## Proposed solution
_What would you change, and how would it help?_

## Assumptions
| Assumption | Risk | How to test | Pass if |
|------------|------|-------------|---------|
|            |      |             |         |
`;

const PROPOSAL_MD_DONE = `# Design proposal

## Service
A government online portal for registering a business name, used by small business owners to register without visiting an office.

## Problem statement
First-time business owners need to know exactly which documents to prepare before they start, because the portal only reveals each requirement on the step that needs it and many applications are abandoned halfway.

## Evidence
- Four of the six people I asked abandoned their application at least once
- Three of them had to start again because the session expired while they fetched a document
- Online forums contain many posts asking what documents are needed

## Proposed solution
Add a "Before you start" checklist on the first page listing every document and its format, and save progress automatically so applicants can leave and come back without starting again.

## Assumptions
| Assumption | Risk | How to test | Pass if |
|------------|------|-------------|---------|
| Applicants abandon mainly because of missing documents | High | Ask ten recent applicants why they stopped | At least 6 of 10 mention documents |
| A checklist would be read before starting | Medium | Show a paper prototype to five people and watch | At least 4 of 5 read it before continuing |
| Saved progress would bring people back | Medium | Test a clickable prototype with five people who are interrupted halfway | At least 4 of 5 resume without help |
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l6-design-thinking",
    moduleId: "ux-m2-design-thinking",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "Design Thinking and Human-Centred Design",
    subtitle: "A problem-solving process that starts with people",
    estimatedMinutes: 24,
    intro:
      "Design thinking is the name for how designers solve problems: understand the people first, decide exactly what to solve, explore many ideas, make cheap versions and test them. It is not only for designers; banks, hospitals and governments use it. This lesson explains the mindset, its principles and its five stages.",

    atoms: [
      {
        id: "a-ux-design-thinking",
        title: "What is design thinking?",
        explain:
          "Design thinking is a problem-solving approach that starts from the needs of the people involved rather than from a technology or an assumption. Instead of jumping to a solution (\"let's build an app\"), you first understand people's real situation, then frame the right problem, then generate and test many possible solutions quickly and cheaply, keeping what works. It suits problems where the answer is not obvious and people's behaviour matters, which describes almost every digital product.",
        why: "Most failed products did not fail because they were badly built. They failed because they solved a problem people did not have, or solved it in a way people would not use.",
      },
      {
        id: "a-ux-hcd-principles",
        title: "Human-centred design principles",
        explain:
          "Human-centred design (HCD) puts the people who will use something at the centre of every decision. Its core principles: understand people in their real context, not in a meeting room; involve them throughout, not only at the end; design for the whole experience, not only the screen; solve the real problem, not the stated one; and iterate, improving through repeated testing. HCD also means designing for the full range of people, including those with disabilities, low literacy, old phones or poor connectivity, not only the average user.",
        decision: {
          scenario: "A team is designing a pension app for retired teachers in Enugu. They plan to test it with colleagues in the office because \"everyone uses apps\".",
          question: "Which human-centred principle does this break most?",
          options: [
            { id: "a", text: "Involve the real users in their real context", why: "Office colleagues are younger, tech-confident and know the product. Retired teachers may have older phones, weaker eyesight and different expectations; only testing with them reveals that." },
            { id: "b", text: "Design for the whole experience", whyWrong: "That matters too, but the immediate problem is testing with the wrong people." },
            { id: "c", text: "Iterate through repeated testing", whyWrong: "They do plan to test; the problem is who they test with." },
            { id: "d", text: "None: colleagues are good enough testers", whyWrong: "Colleagues are among the least representative testers possible for this audience." },
          ],
          correct: "a",
          aftermath: "Test with the people who will actually use the product, where and how they will use it.",
        },
      },
      {
        id: "a-ux-five-stages",
        title: "The five stages of design thinking",
        explain:
          "The best-known model, from Stanford's d.school, has five stages. Empathize: learn about the people through interviews, observation and immersion. Define: turn what you learned into a clear statement of the problem to solve. Ideate: generate many possible solutions before judging them. Prototype: make quick, cheap versions of the most promising ideas. Test: put the prototypes in front of real people and learn. The stages are not a strict sequence: a test often sends you back to define or ideate, and you may run through them many times on one project.",
        table: {
          caption: "The five stages and what each produces.",
          headers: ["Stage", "Question", "Typical methods", "Output"],
          rows: [
            ["Empathize", "Who are the people and what do they experience?", "Interviews, observation, diary studies", "Notes, quotes, photos"],
            ["Define", "What exactly is the problem?", "Affinity mapping, personas, problem statements", "A problem statement"],
            ["Ideate", "What could we do about it?", "Brainstorming, sketching, How Might We", "Many ideas, a shortlist"],
            ["Prototype", "What would it look like?", "Paper sketches, clickable Figma prototypes", "A testable version"],
            ["Test", "Does it work for them?", "Usability tests, interviews", "Evidence and what to change"],
          ],
        },
      },
      {
        id: "a-ux-stages-lab",
        title: "Recognising the stages in real work",
        explain:
          "On a real project the stages blur, so it helps to recognise them by their purpose. Activities that learn about people belong to empathize. Activities that make sense of what you learned and commit to a problem belong to define. Activities that generate or choose ideas belong to ideate. Activities that make something people can react to belong to prototype. Activities that watch people use it and measure the result belong to test.",
        webLab: {
          task:
            "A team is designing a savings product for market traders. Sort the ten activities listed in the preview into the five stages: under each heading in stages.md, write the number of every activity that belongs there (two per stage), one \"- \" line each.",
          files: {
            "index.html": docPage("Sort ten activities into the five stages", "stages.md", ACTIVITIES.map((a, i) => `<strong>${i + 1}.</strong> ${a}`)),
            "stages.md": STAGES_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Empathize: learning about people", check: stageCheck("Empathize", [1, 2]), fail: "Which two activities learn about the traders directly?" },
            { label: "Define: making sense and committing to a problem", check: stageCheck("Define", [3, 4]), fail: "Grouping notes into themes and writing the need are both about defining." },
            { label: "Ideate: generating and choosing ideas", check: stageCheck("Ideate", [5, 6]), fail: "Generating ideas, then choosing among them." },
            { label: "Prototype: making something to react to", check: stageCheck("Prototype", [7, 8]), fail: "Paper and clickable versions are both prototypes." },
            { label: "Test: watching and measuring", check: stageCheck("Test", [9, 10]), fail: "Watching people use it, and counting the results." },
          ],
          solution: { "stages.md": STAGES_MD_DONE },
          hint: "Ask of each activity: is it learning, deciding the problem, generating ideas, making something, or watching it used?",
          successMessage: "Ten activities, five stages. You can now tell where any piece of design work fits, and what should come before it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.4 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l7-problems",
    moduleId: "ux-m2-design-thinking",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6"],
    title: "Problems Before Solutions",
    subtitle: "Finding the real problem, and the frustrations that point to it",
    estimatedMinutes: 24,
    intro:
      "The most common mistake in design is starting with a solution. This lesson trains the opposite habit: finding the problem first, listening for frustrations, and defining the problem from evidence rather than opinion.",

    atoms: [
      {
        id: "a-ux-problem-first",
        title: "Identifying problems before designing solutions",
        explain:
          "Requests usually arrive as solutions: \"we need an app\", \"add a chatbot\", \"make the button bigger\". Behind each is a problem someone has, and the requested solution may not be the best answer to it, or the problem may be different from what everyone assumes. Ask why the solution is wanted, who has the problem, how they cope today, and what happens if nothing changes. The \"five whys\" technique keeps asking why until you reach a cause you can act on.",
        example:
          "Request: \"Add a chatbot to the bank app.\"\nWhy?   Customers keep calling the contact centre.\nWhy?   They don't know if their transfer went through.\nWhy?   The app shows \"Processing\" with no follow-up.\nWhy?   The app never updates the status after the first screen.\n→ The problem is transfer status, not a missing chatbot.",
        decision: {
          scenario: "A client says: \"Our sales are down. We need a redesign with a modern look.\" You have not seen any data yet.",
          question: "What should you do first?",
          options: [
            { id: "a", text: "Ask where in the journey customers are dropping off, and look at the data and a few customers before proposing anything", why: "A modern look may be irrelevant if customers abandon at a surprise delivery fee or a broken payment step." },
            { id: "b", text: "Start the new visual style straight away", whyWrong: "You would be solving a guessed problem. The look may not be why sales fell." },
            { id: "c", text: "Recommend copying the market leader's design", whyWrong: "Their situation may differ, and you still would not know the real cause." },
            { id: "d", text: "Tell the client a redesign never helps", whyWrong: "Sometimes it does; you just need evidence first." },
          ],
          correct: "a",
          aftermath: "A redesign that does not touch the real cause can cost months and change nothing.",
        },
      },
      {
        id: "a-ux-frustrations",
        title: "Understanding user frustrations",
        explain:
          "Frustrations (often called pain points) are the moments where people struggle, waste time, feel anxious or give up. They are the most reliable clues to what to design, because people describe them vividly: \"I never know if my money arrived\", \"I had to start again\". Listen for complaints, workarounds (writing a PIN on paper, asking a friend to help, keeping two phones), and emotional words (\"annoying\", \"scared\", \"embarrassed\"). One person's frustration is an anecdote; the same frustration from several people is a pattern worth designing for.",
        why: "Workarounds are especially valuable: they show a need so strong that people solve it themselves, badly.",
      },
      {
        id: "a-ux-define-problem",
        title: "Defining design problems",
        explain:
          "Defining the problem means turning many observations into a clear statement of what to solve. Gather your notes, group similar observations together (affinity mapping), count how many people each pattern came from, and choose the problem that is frequent, severe and within your power to change. Write it in terms of people and their needs, not features. A good definition is narrow enough to act on and broad enough to allow several solutions.",
        webLab: {
          task:
            "Five commuters were interviewed about topping up their bus cards (the notes are in the preview). Find the patterns. In frustrations.md, fill the table with one row per frustration: a short name, the participants who mentioned it (for example \"P1, P3\"), and the count. There are four distinct frustrations. Then name the most common one under \"Most common frustration\".",
          files: { "index.html": NOTES_PAGE, "frustrations.md": FRUSTRATIONS_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Broken or switched-off machines: the right participants and count", check: groupCheck(["P1", "P2", "P4", "P5"]), fail: "Read every quote about machines. Who mentioned them?" },
            { label: "Not knowing the card balance: the right participants and count", check: groupCheck(["P1", "P3", "P5"]), fail: "Several people only discover their balance at the gate." },
            { label: "Cash and change at the counter: the right participants and count", check: groupCheck(["P3", "P4"]), fail: "Two people had trouble paying at the counter." },
            { label: "Queues at the counter: the right participant and count", check: groupCheck(["P2"]), fail: "One person mentioned the length of the queue." },
            { label: "The most common frustration is named", check: MD + String.raw`const s = section('frustrations.md', 'Most common') || ''; return /machine|kiosk/i.test(s) && words(s) >= 3;`, fail: "Which frustration did the most people mention?" },
          ],
          solution: { "frustrations.md": FRUSTRATIONS_MD_DONE },
          hint: "Go quote by quote and tag each with a theme first. Then, for each theme, list the people (not the quotes): one person mentioning it twice counts once.",
          successMessage: "Ten quotes became four patterns with evidence behind each. The problem to solve first is now obvious, and it came from users, not from a meeting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.7 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l8-ideas",
    moduleId: "ux-m2-design-thinking",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.7", "2.8", "2.9"],
    title: "Ideas and Problem Statements",
    subtitle: "Generating many ideas, choosing well, and framing the problem",
    estimatedMinutes: 26,
    intro:
      "Once the problem is clear, the job is to find the best solution, and the best solution is rarely the first one anyone thinks of. This lesson covers how to generate ideas, the two modes of thinking that make ideation work, and the problem statement that keeps it on track.",

    atoms: [
      {
        id: "a-ux-brainstorming",
        title: "Brainstorming and idea generation",
        explain:
          "Brainstorming is generating many ideas quickly, as a group or alone. It works best with rules: defer judgement (criticism kills ideas early), go for quantity, build on others' ideas, encourage wild ideas (they often lead to practical ones), stay on topic, and make it visual. Useful techniques include Crazy 8s (fold a page into eight panels and sketch eight ideas in eight minutes), How Might We questions, and borrowing: how would a bank, a market, or a game solve this? Ideas are cheap at this stage; keep them all until you choose.",
        example:
          "Crazy 8s, for \"traders forget to save daily\":\n1. Daily SMS reminder at closing time\n2. Agent collects at the stall, like esusu\n3. Round-up every sale to the nearest ₦100\n4. Savings streaks with a weekly reward\n5. Lock money until a goal date\n6. Save with a USSD code, no smartphone needed\n7. Group savings with friends who can see progress\n8. Voice note confirmation in Pidgin or Yoruba",
      },
      {
        id: "a-ux-divergent-convergent",
        title: "Divergent and convergent thinking",
        explain:
          "Divergent thinking opens up: it generates many options without judging them. Convergent thinking narrows down: it evaluates options against criteria and chooses. Good design alternates between them, and the key is never to do both at once, because judging while generating stops the flow of ideas. The design process is often drawn as a double diamond: diverge to explore the problem, converge on a definition, diverge to explore solutions, converge on one to build. To converge, use criteria such as impact on the user, evidence it is needed, cost and feasibility, and techniques such as dot voting or an impact/effort grid.",
        decision: {
          scenario: "In a brainstorm, every time someone suggests an idea the team lead says why it would not work. After ten minutes there are three ideas on the wall.",
          question: "What is going wrong?",
          options: [
            { id: "a", text: "Convergent judging is happening during the divergent phase, so ideas are killed before they can grow", why: "Separate the phases: generate first with judgement deferred, evaluate afterwards against agreed criteria." },
            { id: "b", text: "The team is not judging ideas strictly enough", whyWrong: "Judging is the problem here; there is too much of it, too early." },
            { id: "c", text: "Three ideas is plenty", whyWrong: "With so few options the best solution is unlikely to be among them." },
            { id: "d", text: "Brainstorming never works; the lead should decide alone", whyWrong: "Brainstorming works when its rules are followed." },
          ],
          correct: "a",
          aftermath: "Diverge, then converge. Never both at once.",
        },
      },
      {
        id: "a-ux-problem-statements",
        title: "Problem statements",
        explain:
          "A problem statement (or point-of-view statement) frames the problem from the user's side in one sentence: [user] needs [need] because [insight]. The user is specific (\"working parents in Ibadan\", not \"people\"); the need is a need, not a solution (\"to see a doctor without losing a day of work\", not \"a booking app\"); and the insight is what you learned from research that makes the need matter. From it you write How Might We questions (\"How might we let patients know when they will be seen?\"), which are wide enough for many solutions and narrow enough to act on.",
        table: {
          caption: "Turning a solution into a problem statement.",
          headers: ["", "Weak", "Strong"],
          rows: [
            ["User", "Patients", "Working parents in Ibadan"],
            ["Need", "A booking app with a chatbot", "To see a doctor without losing a whole day of work"],
            ["Insight", "(none)", "The hospital gives no times, so patients queue from 6am"],
          ],
        },
        webLab: {
          task:
            "A hospital's brief says \"We need an app with a chatbot for booking.\" That is a solution. Rewrite it in problem.md: a Problem statement that names a specific user, says what they \"need\", and gives an insight with \"because\", without naming any solution (no app, website, chatbot, button, screen, feature, dashboard or platform). Then write at least three How Might We questions, each starting \"How might we\" and ending with a question mark. Finally, write your Chosen direction in at least 12 words.",
          files: {
            "index.html": docPage("Problem statement and How Might We", "problem.md", [
              "Problem statement: [specific user] needs [need] because [insight]",
              "No solution words: app, website, chatbot, button, screen, feature, dashboard or platform",
              "At least three \"How might we …?\" questions",
              "Chosen direction: at least 12 words",
            ]),
            "problem.md": PROBLEM_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "The statement has a user, a need and an insight", check: MD + String.raw`const s = section('problem.md', 'Problem statement') || ''; return /\bneeds?\b/i.test(s) && /\bbecause\b/i.test(s) && words(s.split(/\bneeds?\b/i)[0]) >= 2 && words(s) >= 15;`, fail: "Use the shape: [specific user, two words or more] needs [need] because [insight]." },
            { label: "The statement names no solution", check: MD + `const s = section('problem.md', 'Problem statement') || ''; return !${SOLUTION_WORDS}.test(s);`, fail: "Describe the need, not an app or a chatbot. Solutions come later." },
            { label: "At least three How Might We questions", check: MD + String.raw`const b = bullets(section('problem.md', 'How might we')); return b.filter((l) => /^how might we\b/i.test(l) && /\?$/.test(l) && words(l) >= 6).length >= 3;`, fail: "Write three \"- How might we …?\" lines." },
            { label: "A chosen direction of at least 12 words", check: MD + "return words(section('problem.md', 'Chosen direction')) >= 12;", fail: "Say which direction you would pursue and why." },
          ],
          solution: { "problem.md": PROBLEM_MD_DONE },
          hint: "Ask why the hospital wants booking at all. What are patients going through today?",
          successMessage: "The chatbot is gone and a real problem has taken its place. Now several solutions are possible, and you can choose the best one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.10, 2.11, 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l9-validate-iterate",
    moduleId: "ux-m2-design-thinking",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.10", "2.11", "2.P"],
    title: "Validating Assumptions and Iterating",
    subtitle: "Testing what you believe, improving in loops, and your first proposal",
    estimatedMinutes: 28,
    intro:
      "Every design rests on assumptions: that people have the problem, that they will understand the solution, that they will use it. This lesson shows how to test the riskiest ones cheaply, why design improves in loops, and ends with your module practical: a proposal for a real Nigerian digital service.",

    atoms: [
      {
        id: "a-ux-validate-assumptions",
        title: "How to validate design assumptions",
        explain:
          "List what must be true for your design to succeed: \"people abandon because of missing documents\", \"traders will save daily if reminded\". Rate each by risk (how bad it would be if wrong, and how little evidence you have) and test the riskiest first. Choose the cheapest test that could prove it wrong: a few interviews, a paper prototype, a fake button that counts clicks, a survey. Decide the pass mark before you test (\"at least 4 of 5 complete the deposit\"), so you cannot reinterpret the result afterwards to fit what you hoped.",
        table: {
          caption: "From assumption to test.",
          headers: ["Assumption", "Risk", "Cheapest test", "Pass if"],
          rows: [
            ["Traders forget rather than choose not to save", "High", "Interview eight traders", "6 of 8 say they forget"],
            ["An SMS at closing time would be noticed", "Medium", "Send SMS reminders to ten traders for a week", "7 of 10 recall it"],
            ["Traders trust an app with daily deposits", "High", "Paper prototype with five traders", "4 of 5 would deposit"],
          ],
        },
      },
      {
        id: "a-ux-iterative-design",
        title: "Introduction to iterative design",
        explain:
          "Iterative design improves a product through repeated cycles of design, test and refine, instead of trying to get it right in one attempt. Each loop is small and fast: make the cheapest version that can answer your current question, test it, learn, change it. Early loops use paper and quick sketches; later loops use high-fidelity prototypes and then the real product. Iteration is cheaper than perfection because problems are found when they are still easy to fix, and because each version is based on evidence rather than the team's guesses.",
        decision: {
          scenario: "A team has two weeks to design a new checkout. One plan: design the perfect version for two weeks, then test once. The other: test a rough version on day 3, a better one on day 7 and a polished one on day 12.",
          question: "Which plan is more likely to produce a good checkout, and why?",
          options: [
            { id: "a", text: "The three-test plan: each loop finds problems while they are cheap to fix", why: "By day 12 the design has been corrected twice by real users. The single-test plan finds the same problems with no time left to fix them." },
            { id: "b", text: "The single-test plan: a polished design gets better feedback", whyWrong: "Polish makes people comment on looks and makes the team reluctant to change. And there is no time to act on the findings." },
            { id: "c", text: "Neither: testing is a waste of time with a two-week deadline", whyWrong: "Short deadlines make cheap early testing more valuable, not less." },
            { id: "d", text: "They are the same, as long as the tests are good", whyWrong: "The timing of the tests changes what you can still fix." },
          ],
          correct: "a",
          aftermath: "Test early, test rough, test often.",
        },
      },
      {
        id: "a-ux-proposal-lab",
        title: "Practical: a design proposal for a Nigerian digital service",
        explain:
          "A design proposal brings the whole module together in one page: the service and its users, the problem statement, the evidence for it, the proposed solution, and the assumptions it rests on with a plan to test each. Evidence must come from people, not opinion: what did they say or do, and how many of them? Every assumption gets a pass mark with a number, decided before testing.",
        webLab: {
          task:
            "Choose an existing Nigerian digital service you or people you know have struggled with (a government portal, a bank app, an exam registration site, a utility payment service). Complete proposal.md: the Service (at least 10 words); a Problem statement with \"needs\" and \"because\"; at least two pieces of Evidence that include a number of people; a Proposed solution of at least 20 words; and an Assumptions table with at least three rows, each with a risk (High, Medium or Low), a test of at least four words and a pass mark that contains a number. At least one assumption must be rated High.",
          files: {
            "index.html": docPage("Design proposal", "proposal.md", [
              "Service: at least 10 words",
              "Problem statement: with \"needs\" and \"because\"",
              "Evidence: at least two points, each with a number of people",
              "Proposed solution: at least 20 words",
              "Assumptions: three or more rows, risk High, Medium or Low, a test, and a numeric pass mark; at least one High",
            ]),
            "proposal.md": PROPOSAL_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Service described in at least 10 words", check: MD + String.raw`return words((section('proposal.md', 'Service') || '').replace(/_[^_]*_/g, '')) >= 10;`, fail: "Name the service and say what it does." },
            { label: "Problem statement with a need and an insight", check: MD + String.raw`const s = (section('proposal.md', 'Problem statement') || '').replace(/_[^_]*_/g, ''); return /\bneeds?\b/i.test(s) && /\bbecause\b/i.test(s) && words(s) >= 15;`, fail: "[User] needs [need] because [insight]." },
            { label: "At least two pieces of evidence with numbers", check: MD + String.raw`return bullets(section('proposal.md', 'Evidence')).filter((l) => /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i.test(l) && words(l) >= 5).length >= 2;`, fail: "Evidence says how many people: \"4 of the 6 people I asked …\"." },
            { label: "A proposed solution of at least 20 words", check: MD + String.raw`return words((section('proposal.md', 'Proposed solution') || '').replace(/_[^_]*_/g, '')) >= 20;`, fail: "Say what you would change and how it helps." },
            { label: "Three assumptions with risk, test and numeric pass mark, one High", check: MD + String.raw`const r = rows(section('proposal.md', 'Assumptions')).filter((c) => words(c[0]) >= 3 && /^(high|medium|low)$/i.test(c[1] || '') && words(c[2]) >= 4 && /\d/.test(c[3] || '')); return r.length >= 3 && r.some((c) => /^high$/i.test(c[1]));`, fail: "Each row: the assumption, High/Medium/Low, how you would test it, and a pass mark with a number." },
          ],
          solution: { "proposal.md": PROPOSAL_MD_DONE },
          hint: "The best proposals are about a service you have actually used. Ask four or five people about it before you write the evidence.",
          successMessage: "A complete proposal: a real problem, real evidence, a solution, and a plan to find out quickly if you are wrong. That is design thinking end to end.",
        },
      },
    ],

    task: {
      title: "Module 2 practical: a problem and a proposal for a Nigerian digital service",
      intro: "Work through every stage of design thinking on a real service.",
      prompts: [
        "Choose an existing Nigerian digital service and use it yourself for a real task, noting every moment of friction.",
        "Talk to at least four people who use it. Record their frustrations and workarounds, and how many people mentioned each.",
        "Write a problem statement ([user] needs [need] because [insight]) and three How Might We questions.",
        "Generate at least eight ideas (try Crazy 8s), then choose one using clear criteria.",
        "Sketch your solution on paper, list its riskiest assumptions with a test and a pass mark for each, and show the sketch to two of the people you spoke to.",
      ],
      closing: "Module 3 gives you the visual skills to turn ideas like this into interfaces that look as good as they work.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
