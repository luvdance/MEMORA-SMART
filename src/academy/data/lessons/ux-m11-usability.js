/**
 * UI/UX DESIGN · MODULE 11 · USABILITY TESTING AND UX EVALUATION
 *
 * Curriculum 11.1 – 11.19 and the practical 11.P. Usability, test methods,
 * moderated and unmoderated, remote and in-person, scenarios and objectives,
 * completion, errors, time, satisfaction (SEQ and SUS), think-aloud, A/B
 * tests, heuristic evaluation, Nielsen's ten heuristics, accessibility
 * evaluation, analysis, prioritisation and iteration. The metrics lab's
 * numbers are computed by the learner and checked exactly.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { docPage, MD } from "./ux-kit.js";

export const SECTION_ID = "ux-s11-usability";

const DATA_STYLE = `body { margin: 0; padding: 24px 16px; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #1f2937; background: #f8fafc; }
    main { max-width: 760px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; color: #111827; }
    h2 { margin: 24px 0 8px; font-size: 1.125rem; }
    .wrap { overflow-x: auto; }
    table { border-collapse: collapse; background: #ffffff; }
    th, td { padding: 6px 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 15px; }
    th { background: #f1f5f9; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }`;

const dataPage = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    ${DATA_STYLE}
  </style>
</head>
<body>
  <main>
${body}
  </main>
</body>
</html>
`;

const table = (headers, rows) => `<div class="wrap"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
${rows.map((r) => `      <tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
    </tbody></table></div>`;

/* ── Lesson 45 lab: a usability test plan ──────────────────────────────── */
const PLAN_MD = `# Usability test plan: KoboSave transfer flow

## Objectives
-

## Participants

## Method

## Tasks
| Scenario | Success criteria |
|----------|------------------|
| Click the Transfer button and send money | Finished |

## Metrics
`;

const PLAN_MD_DONE = `# Usability test plan: KoboSave transfer flow

## Objectives
- Find out whether first-time users can send money to a new recipient without help
- Learn whether people notice the transfer fee before they confirm
- Identify where people hesitate or make errors when adding a beneficiary

## Participants
Six market traders and salary earners in Lagos who have used a mobile banking app in the last month but not KoboSave, recruited with a short screener.

## Method
Moderated, in-person sessions of 30 minutes at a co-working space, using a clickable prototype on an Android phone, with think-aloud and screen recording.

## Tasks
| Scenario | Success criteria |
|----------|------------------|
| Your cousin Tunde needs ₦5,000 for transport today. Send it to his GTBank account, 0123456789. | Reaches the success screen with ₦5,000 sent to Tunde Bakare |
| Before you send it, find out how much the transfer will cost you. | States the ₦10 fee without help |
| You want to send money to Tunde again next week without typing his details. Make that possible. | Saves Tunde as a beneficiary |

## Metrics
Task completion rate, number of errors per task, time on task, and a single ease question (SEQ) after each task, plus a SUS questionnaire at the end for overall satisfaction.
`;

/* ── Lesson 46 lab: computing usability metrics ────────────────────────── */
const SESSIONS = [
  ["P1", "Success", 95, 0, 6],
  ["P2", "Success", 120, 1, 5],
  ["P3", "Failed", 300, 3, 2],
  ["P4", "Success", 80, 0, 7],
  ["P5", "Success", 110, 2, 5],
];
const SUS = [4, 2, 5, 1, 4, 2, 5, 2, 4, 1];

const METRICS_PAGE = dataPage(
  "Usability test results",
  `    <h1>Test results: "Pay an electricity bill"</h1>
    <p>Five participants. Time in seconds. SEQ: 1 = very difficult, 7 = very easy. Write your answers in <code>metrics.md</code>.</p>
    ${table(["Participant", "Outcome", "Time (s)", "Errors", "SEQ"], SESSIONS)}
    <h2>P1's SUS questionnaire (1 = strongly disagree, 5 = strongly agree)</h2>
    ${table(SUS.map((_, i) => `Q${i + 1}`), [SUS])}
    <h2>A/B test of the Pay button label</h2>
    ${table(["Version", "Visitors", "Completed payments"], [["A: \"Submit\"", "1,000", "120"], ["B: \"Pay ₦5,000\"", "1,000", "150"]])}`
);

const METRICS_MD = `# Usability metrics

## Task completion rate (%)

## Participants with at least one error (%)

## Mean time on task, successful attempts only (s)

## Median time on task, successful attempts only (s)

## Mean SEQ score

## P1's SUS score

## A/B test: relative improvement of B over A (%)
`;

const METRICS_MD_DONE = `# Usability metrics

## Task completion rate (%)
80

## Participants with at least one error (%)
60

## Mean time on task, successful attempts only (s)
101.25

## Median time on task, successful attempts only (s)
102.5

## Mean SEQ score
5

## P1's SUS score
85

## A/B test: relative improvement of B over A (%)
25
`;

/* ── Lesson 47 lab: a heuristic evaluation ─────────────────────────────── */
const BAD_APP = dataPage(
  "Screens to evaluate",
  `    <h1>PayFast: screens to evaluate</h1>
    <p>Evaluate these screens against Nielsen's ten heuristics. Write your evaluation in <code>evaluation.md</code>.</p>
    <h2>Screen 1: Pay a bill</h2>
    <ul>
      <li>The main button says <strong>"Initiate TRX"</strong>.</li>
      <li>After tapping it, nothing changes on screen for about 20 seconds: no spinner, no message.</li>
    </ul>
    <h2>Screen 2: Confirm</h2>
    <ul>
      <li>The screen asks you to <strong>re-type the 13-digit meter number</strong> shown on the previous screen, which is no longer visible.</li>
      <li>The Confirm button is green and rounded; the Cancel button on the previous screen was a grey square, and here it is a red text link.</li>
    </ul>
    <h2>Screen 3: Error</h2>
    <ul>
      <li>If the payment fails, the only message is <strong>"ERR_502"</strong> with an OK button.</li>
    </ul>
    <h2>Screen 4: Saved meters</h2>
    <ul>
      <li>A <strong>"Delete all"</strong> button sits right next to "Add meter", and deletes every saved meter instantly, with no confirmation and no undo.</li>
    </ul>`
);

const EVAL_MD = `# Heuristic evaluation: PayFast

Heuristic: the number from 1 to 10. Severity: 0 (not a problem) to 4 (catastrophe).

| Issue | Heuristic | Severity | Recommendation |
|-------|-----------|----------|----------------|
|       |           |          |                |
`;

const EVAL_MD_DONE = `# Heuristic evaluation: PayFast

| Issue | Heuristic | Severity | Recommendation |
|-------|-----------|----------|----------------|
| No feedback for 20 seconds after tapping the pay button | 1 | 3 | Show a progress state immediately and say what is happening |
| Button label "Initiate TRX" is system jargon | 2 | 2 | Use plain words: "Pay ₦5,000" |
| "Delete all" deletes every meter instantly with no undo | 3 | 4 | Ask for confirmation and offer undo for ten seconds |
| Confirm and Cancel buttons change style between screens | 4 | 2 | Use the same button components on every screen |
| "Delete all" sits right next to "Add meter", inviting accidental taps | 5 | 3 | Move destructive actions away and make them less prominent |
| Users must re-type the meter number from the previous screen | 6 | 3 | Show the meter number on the confirm screen instead of asking for it |
| Payment failure shows only "ERR_502" | 9 | 4 | Explain what happened, whether money was taken, and what to do next |
`;

/* ── Lesson 48 lab: prioritising issues ────────────────────────────────── */
const ISSUES = [
  ["I1", "Could not find the Transfer button", 4, 3],
  ["I2", "Confused by the word \"Beneficiary\"", 3, 2],
  ["I3", "Error unclear when the amount had no kobo", 2, 3],
  ["I4", "Did not notice the transfer fee", 5, 2],
  ["I5", "Thought the payment had failed (no confirmation)", 3, 4],
];

const ISSUES_PAGE = dataPage(
  "Issues from testing",
  `    <h1>Issues found with five participants</h1>
    <p>Frequency = how many of the 5 participants hit the issue. Severity: 1 (minor) to 4 (blocks the task). Priority score = frequency × severity; when two scores tie, the higher severity goes first. Write your analysis in <code>priority.md</code>.</p>
    ${table(["ID", "Issue", "Frequency", "Severity"], ISSUES)}`
);

const PRIORITY_MD = `# Prioritised issues

| ID | Score |
|----|-------|
| I1 |       |
| I2 |       |
| I3 |       |
| I4 |       |
| I5 |       |

## Fix order
1.
2.
3.
4.
5.

## First fix
`;

const PRIORITY_MD_DONE = `# Prioritised issues

| ID | Score |
|----|-------|
| I1 | 12 |
| I2 | 6 |
| I3 | 6 |
| I4 | 10 |
| I5 | 12 |

## Fix order
1. I5
2. I1
3. I4
4. I3
5. I2

## First fix
Add a clear success screen with the amount, the recipient and a reference, so people know their payment worked and do not pay twice.
`;

const SCORES = { I1: 12, I2: 6, I3: 6, I4: 10, I5: 12 };

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 11.1 – 11.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l45-usability",
    moduleId: "ux-m11-usability",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7"],
    title: "Usability and Planning a Test",
    subtitle: "What usability is, the ways to test it, and how to plan a session",
    estimatedMinutes: 32,
    intro:
      "Usability testing is watching real people try to use your design, and it is the single most valuable thing a designer can do. This lesson defines usability, compares the ways to test it, and shows how to write test objectives and scenarios that produce honest results.",

    atoms: [
      {
        id: "a-ux-usability",
        title: "What is usability?",
        explain:
          "Usability is how easily and effectively people can use a product to achieve their goals. Jakob Nielsen describes five components: learnability (how easily first-time users succeed), efficiency (how quickly experienced users work), memorability (how easily returning users remember it), errors (how many people make, how serious, how easily recovered) and satisfaction (how pleasant it is). The ISO definition adds context: specified users achieving specified goals with effectiveness, efficiency and satisfaction in a specified context. A product can be usable for one group in one context and unusable for another.",
      },
      {
        id: "a-ux-testing-fundamentals",
        title: "Usability testing fundamentals and methods",
        explain:
          "In a usability test, a participant from the target audience attempts realistic tasks with a design while an observer watches, notes where they succeed, struggle or fail, and asks questions afterwards. Testing with about five participants typically reveals most of the serious problems in a design (Nielsen's research found around 85%), so it is better to run several small rounds than one big one. Methods range from quick guerrilla tests (asking people in a café or market for five minutes) to lab studies, first-click tests, five-second tests (what do people remember after seeing a screen for five seconds?), and benchmark studies that measure a product over time.",
        why: "Five people in an afternoon will show you problems that a team of experts arguing for a week will miss.",
      },
      {
        id: "a-ux-moderated-remote",
        title: "Moderated, unmoderated, remote and in-person",
        explain:
          "Moderated tests have a facilitator present (in the room or on a video call) who gives tasks, observes and asks follow-up questions: richer insight, more effort. Unmoderated tests are completed by participants alone, guided by a tool that records their screen and voice: faster, cheaper, more participants, but no chance to ask why. In-person tests show body language and the real device in hand, and suit people less comfortable with video calls; remote tests reach people anywhere, in their own environment, at lower cost. Choose by what you need to learn, your budget and your participants.",
        table: {
          caption: "Choosing a test format.",
          headers: ["Format", "Strengths", "Weaknesses"],
          rows: [
            ["Moderated, in-person", "Rich insight, body language, real devices", "Slow, travel, small numbers"],
            ["Moderated, remote", "Rich insight, reach anywhere", "Depends on connection and video skills"],
            ["Unmoderated, remote", "Fast, cheap, many participants", "No follow-up questions; people may rush"],
            ["Guerrilla (in-person, informal)", "Very fast and cheap", "Participants may not match your audience"],
          ],
        },
      },
      {
        id: "a-ux-scenarios-objectives",
        title: "Test scenarios and test objectives",
        explain:
          "Start with objectives: what you need to learn (\"can first-time users send money to a new recipient without help?\"). Each objective leads to tasks, written as scenarios: short, realistic stories that give a goal and context without telling people how to do it. A good scenario uses the user's words, not the interface's: \"Your cousin needs ₦5,000 for transport; send it to him\" rather than \"Click Transfer and add a beneficiary\", which gives away both the location and the label. Each task needs success criteria decided in advance. A test plan also names the participants (who, how many, how recruited), the method, the prototype and the metrics.",
        webLab: {
          task:
            "Write the test plan for KoboSave's transfer flow in plan.md: at least two Objectives (each at least 8 words); Participants describing who and how many, with a number of at least 5; a Method that says whether it is moderated or unmoderated AND remote or in-person; at least three Tasks written as scenarios that do not give away the interface (no \"click\", \"tap\", \"button\" or \"select\"), each at least 10 words, with success criteria of at least 4 words; and Metrics that name completion, errors, time and satisfaction.",
          files: {
            "index.html": docPage("Usability test plan", "plan.md", [
              "Objectives: two or more, 8 words or more each",
              "Participants: who and how many (at least 5)",
              "Method: moderated or unmoderated, and remote or in-person",
              "Tasks: three or more realistic scenarios with no click, tap, button or select, and success criteria",
              "Metrics: completion, errors, time and satisfaction",
            ]),
            "plan.md": PLAN_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "At least two objectives", check: MD + "return bullets(section('plan.md', 'Objectives')).filter((l) => words(l) >= 8).length >= 2;", fail: "Write two \"- Find out whether …\" lines." },
            { label: "Participants: who and how many (at least 5)", check: MD + String.raw`const s = section('plan.md', 'Participants') || ''; const n = num(s.replace(/\b(five|six|seven|eight)\b/i, (w) => ({ five: 5, six: 6, seven: 7, eight: 8 })[w.toLowerCase()])); return words(s) >= 8 && n >= 5;`, fail: "Say how many (at least 5) and who they are." },
            { label: "Method: moderated or unmoderated, remote or in-person", check: MD + String.raw`const s = section('plan.md', 'Method') || ''; return /\b(un)?moderated\b/i.test(s) && /\b(remote|in-person|in person)\b/i.test(s);`, fail: "Say both: for example \"Moderated, in-person\"." },
            { label: "Three realistic scenarios that do not give the answer away", check: MD + String.raw`const r = rows(section('plan.md', 'Tasks')).filter((c) => words(c[0]) >= 10 && words(c[1]) >= 4); return r.length >= 3 && rows(section('plan.md', 'Tasks')).every((c) => !/\b(click|tap|button|select)\b/i.test(c[0]));`, fail: "Give a goal and context in the user's words, not instructions about the interface." },
            { label: "Metrics: completion, errors, time and satisfaction", check: MD + String.raw`const s = section('plan.md', 'Metrics') || ''; return /complet/i.test(s) && /error/i.test(s) && /time/i.test(s) && /satisf|SUS|SEQ/i.test(s);`, fail: "Name all four kinds of metric." },
          ],
          solution: { "plan.md": PLAN_MD_DONE },
          hint: "A scenario says what the person wants and why, never where to tap.",
          successMessage: "A test plan that will produce honest results: real goals, real participants, and nothing in the tasks that gives the answer away.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 11.8 – 11.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l46-metrics",
    moduleId: "ux-m11-usability",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.8", "11.9", "11.10", "11.11", "11.12", "11.13"],
    title: "Measuring Usability",
    subtitle: "Completion, errors, time, satisfaction, think-aloud and A/B tests",
    estimatedMinutes: 34,
    intro:
      "Watching people tells you what goes wrong; metrics tell you how much, and whether a redesign helped. This lesson covers the standard usability metrics and how to calculate them, the think-aloud technique, and the basics of A/B testing.",

    atoms: [
      {
        id: "a-ux-completion-rate",
        title: "Task completion rates",
        explain:
          "Task completion rate (or success rate) is the percentage of participants who complete a task successfully: successes divided by attempts, times 100. It is the most fundamental usability metric: if people cannot complete the task, nothing else matters. Define success before the test (\"reaches the success screen with the correct amount and recipient\"). Some teams also record partial success (completed with help, or with a wrong detail) separately. Across many studies the average task completion rate is around 78%, so a rate well below that signals a serious problem.",
        example: "4 of 5 participants paid the bill successfully\nCompletion rate = 4 ÷ 5 × 100 = 80%",
      },
      {
        id: "a-ux-error-rate",
        title: "Error rates",
        explain:
          "An error is any action that moves a participant away from completing the task: tapping the wrong item, entering an invalid value, going down the wrong path. Count errors per participant per task, and report them as the average number of errors per attempt or as the percentage of participants who made at least one error. Note which errors happen and how serious they are: a mistake corrected instantly is different from one that loses money. Patterns of errors at the same point reveal design problems more clearly than totals.",
        example: "Errors: P1 0, P2 1, P3 3, P4 0, P5 2\nAverage errors per attempt = 6 ÷ 5 = 1.2\nParticipants with at least one error = 3 ÷ 5 × 100 = 60%",
      },
      {
        id: "a-ux-time-on-task",
        title: "Time on task",
        explain:
          "Time on task is how long participants take to complete a task, measuring efficiency. Usually report it for successful attempts only, because a participant who gives up after five minutes did not take five minutes to succeed. Times are skewed (a few slow participants pull the average up), so report the median (the middle value when sorted) alongside the mean, and compare it with a target or with an earlier version. Do not use think-aloud sessions for precise timing, because talking slows people down.",
        example: "Successful times (s): 95, 120, 80, 110\nMean   = (95 + 120 + 80 + 110) ÷ 4 = 101.25 s\nSorted: 80, 95, 110, 120\nMedian = (95 + 110) ÷ 2 = 102.5 s",
      },
      {
        id: "a-ux-satisfaction",
        title: "User satisfaction",
        explain:
          "Satisfaction is measured with standard questionnaires. The Single Ease Question (SEQ), asked after each task, is \"Overall, how difficult or easy was this task?\" on a 7-point scale. The System Usability Scale (SUS), asked at the end, has ten statements rated 1 to 5. To score SUS: for the odd-numbered items subtract 1 from the answer; for the even-numbered items subtract the answer from 5; add the ten results and multiply by 2.5, giving a score from 0 to 100. The average SUS score across products is about 68; above 80 is excellent. Standard questionnaires let you compare results across rounds and products.",
        example: "SUS answers: 4, 2, 5, 1, 4, 2, 5, 2, 4, 1\nOdd items (answer − 1):   3 + 4 + 3 + 4 + 3 = 17\nEven items (5 − answer):  3 + 4 + 3 + 3 + 4 = 17\nSUS = (17 + 17) × 2.5 = 85",
      },
      {
        id: "a-ux-think-aloud",
        title: "Think-aloud testing",
        explain:
          "In think-aloud testing, participants say what they are thinking as they work: what they are looking for, what they expect to happen, what confuses them. It reveals the reasons behind behaviour that metrics alone cannot (\"I thought 'Beneficiary' meant the person receiving an inheritance\"). The facilitator explains the method, practises it with a neutral warm-up task, and gently prompts when people go quiet (\"what are you thinking now?\"), without leading (\"did you see the button at the bottom?\"). Remind participants that you are testing the design, not them: there are no wrong answers.",
        decision: {
          scenario: "During a think-aloud session a participant hesitates over the Transfer screen. The facilitator says: \"The button you want is at the bottom right.\"",
          question: "What went wrong?",
          options: [
            { id: "a", text: "The facilitator led the participant, so the test no longer shows whether people can find the button", why: "Neutral prompts such as \"what are you looking for?\" keep the data honest. Note the hesitation; it is a finding." },
            { id: "b", text: "Nothing: helping keeps the session moving", whyWrong: "Helping hides exactly the problem the test exists to find." },
            { id: "c", text: "The facilitator should have helped sooner", whyWrong: "Helping at all spoils the measure." },
            { id: "d", text: "The participant should not have been asked to think aloud", whyWrong: "Think-aloud was not the problem; leading was." },
          ],
          correct: "a",
          aftermath: "Struggling is data. Let it happen, note it, and ask about it afterwards.",
        },
      },
      {
        id: "a-ux-ab-testing",
        title: "A/B testing fundamentals",
        explain:
          "An A/B test shows two versions of a design to different groups of real users at the same time, at random, and measures which performs better on a chosen metric (completed payments, sign-ups). Change one thing at a time so you know what caused the difference, decide the metric and sample size in advance, and run the test long enough to get a reliable result (small differences need large samples to be sure they are not chance). Report the relative improvement: (B's rate − A's rate) ÷ A's rate × 100. A/B tests tell you which version wins, not why, so combine them with qualitative research.",
        webLab: {
          task:
            "Analyse the results of a usability test and an A/B test (the data is in the preview). In metrics.md, calculate: the task completion rate; the percentage of participants who made at least one error; the mean and the median time on task for successful attempts only; the mean SEQ score of all five participants; P1's SUS score; and the relative improvement of version B over version A in the A/B test.",
          files: { "index.html": METRICS_PAGE, "metrics.md": METRICS_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Task completion rate", check: MD + "return Math.abs(num(section('metrics.md', 'Task completion')) - 80) < 0.01;", fail: "Successes ÷ participants × 100." },
            { label: "Participants with at least one error", check: MD + "return Math.abs(num(section('metrics.md', 'Participants with')) - 60) < 0.01;", fail: "Count the participants whose errors are more than 0." },
            { label: "Mean time, successful attempts only", check: MD + "return Math.abs(num(section('metrics.md', 'Mean time')) - 101.25) < 0.01;", fail: "Leave out the failed attempt, then average the four times." },
            { label: "Median time, successful attempts only", check: MD + "return Math.abs(num(section('metrics.md', 'Median time')) - 102.5) < 0.01;", fail: "Sort the four successful times; with an even count, average the middle two." },
            { label: "Mean SEQ score", check: MD + "return Math.abs(num(section('metrics.md', 'Mean SEQ')) - 5) < 0.01;", fail: "Add all five SEQ scores and divide by 5." },
            { label: "P1's SUS score", check: MD + "return Math.abs(num(section('metrics.md', \"P1's SUS\")) - 85) < 0.01;", fail: "Odd items: answer − 1. Even items: 5 − answer. Add them up, multiply by 2.5." },
            { label: "A/B relative improvement", check: MD + "return Math.abs(num(section('metrics.md', 'A/B')) - 25) < 0.01;", fail: "Rates: A 12%, B 15%. (15 − 12) ÷ 12 × 100." },
          ],
          solution: { "metrics.md": METRICS_MD_DONE },
          hint: "Time on task counts successes only, and the median of four values is the average of the middle two.",
          successMessage: "Seven numbers that turn five sessions and an experiment into evidence anyone can compare with the next round.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 11.14 – 11.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l47-heuristics",
    moduleId: "ux-m11-usability",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.14", "11.15", "11.16"],
    title: "Heuristic Evaluation and Accessibility Evaluation",
    subtitle: "Expert reviews against principles, and checking a design works for everyone",
    estimatedMinutes: 32,
    intro:
      "Not every evaluation needs users. Experts can review a design against well-tested principles and find many problems quickly and cheaply. This lesson covers heuristic evaluation, Nielsen's ten usability heuristics, and evaluating a design for accessibility.",

    atoms: [
      {
        id: "a-ux-heuristic-evaluation",
        title: "Heuristic evaluation",
        explain:
          "In a heuristic evaluation, a few evaluators (three to five finds most issues) independently inspect an interface against a set of usability principles (heuristics), note every problem, which heuristic it violates, and how severe it is, then combine their findings. Severity is usually rated 0 (not a problem) to 4 (usability catastrophe: fix before release), considering how often it happens, how much it hurts, and whether people can work around it. It is fast and cheap and catches many problems before testing, but it does not replace testing with real users, because experts are not your users.",
        table: {
          caption: "Nielsen's severity scale.",
          headers: ["Rating", "Meaning"],
          rows: [
            ["0", "Not a usability problem"],
            ["1", "Cosmetic: fix if there is time"],
            ["2", "Minor: low priority"],
            ["3", "Major: important to fix, high priority"],
            ["4", "Catastrophe: must fix before release"],
          ],
        },
      },
      {
        id: "a-ux-nielsen-heuristics",
        title: "Nielsen's 10 usability heuristics",
        explain:
          "Jakob Nielsen's ten heuristics (1994, still the standard) are broad rules of thumb for interface design. Learn them by number: evaluators and teams refer to them that way. Most usability problems you will ever find fall under one of them.",
        table: {
          caption: "Nielsen's ten usability heuristics.",
          headers: ["#", "Heuristic", "In short"],
          rows: [
            ["1", "Visibility of system status", "Always show what is happening, with timely feedback"],
            ["2", "Match between system and the real world", "Use users' words and concepts, not jargon"],
            ["3", "User control and freedom", "Clearly marked exits, undo and redo"],
            ["4", "Consistency and standards", "Same things look and work the same; follow conventions"],
            ["5", "Error prevention", "Prevent problems before they happen; confirm risky actions"],
            ["6", "Recognition rather than recall", "Show options and information; do not make people remember"],
            ["7", "Flexibility and efficiency of use", "Shortcuts and personalisation for experienced users"],
            ["8", "Aesthetic and minimalist design", "No irrelevant or rarely needed information competing for attention"],
            ["9", "Help users recognise, diagnose and recover from errors", "Plain-language error messages with a solution"],
            ["10", "Help and documentation", "Easy-to-search help, focused on tasks, when needed"],
          ],
        },
        webLab: {
          task:
            "Evaluate the PayFast screens described in the preview against Nielsen's heuristics. In evaluation.md, fill the table with at least five issues: describe each issue, give the number (1 to 10) of the heuristic it violates, a severity from 1 to 4, and a recommendation (at least 5 words). Use at least four different heuristics and rate at least two issues 3 or higher. Your evaluation must include the jargon on the pay button (heuristic 2) and the \"ERR_502\" error message (heuristic 9).",
          files: { "index.html": BAD_APP, "evaluation.md": EVAL_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "At least five complete issues", check: MD + String.raw`const r = rows(raw('evaluation.md')).filter((c) => words(c[0]) >= 4 && /^([1-9]|10)$/.test((c[1] || '').trim()) && /^[1-4]$/.test((c[2] || '').trim()) && words(c[3]) >= 5); return r.length >= 5;`, fail: "Each row: an issue, a heuristic number 1–10, a severity 1–4 and a recommendation." },
            { label: "At least four different heuristics", check: MD + String.raw`return new Set(rows(raw('evaluation.md')).map((c) => (c[1] || '').trim()).filter((h) => /^([1-9]|10)$/.test(h))).size >= 4;`, fail: "These screens break many different heuristics: feedback, words, control, consistency, prevention, memory, errors." },
            { label: "At least two major issues (severity 3 or 4)", check: MD + String.raw`return rows(raw('evaluation.md')).filter((c) => /^[34]$/.test((c[2] || '').trim())).length >= 2;`, fail: "Losing all saved meters, or not knowing if a payment worked, are major problems." },
            { label: "The jargon on the pay button, under heuristic 2", check: MD + String.raw`return rows(raw('evaluation.md')).some((c) => /TRX|initiate|jargon/i.test(c[0]) && (c[1] || '').trim() === '2');`, fail: "\"Initiate TRX\" is system language, not the user's: heuristic 2." },
            { label: "The \"ERR_502\" message, under heuristic 9", check: MD + String.raw`return rows(raw('evaluation.md')).some((c) => /502|error message/i.test(c[0]) && (c[1] || '').trim() === '9');`, fail: "An error code with no explanation breaks heuristic 9." },
          ],
          solution: { "evaluation.md": EVAL_MD_DONE },
          hint: "Go screen by screen and ask of each problem: which of the ten rules does this break?",
          successMessage: "A structured expert review: every problem named, mapped to a heuristic and rated, so the team knows what to fix first.",
        },
      },
      {
        id: "a-ux-accessibility-evaluation",
        title: "Accessibility evaluation",
        explain:
          "An accessibility evaluation checks whether people with disabilities can use the design. Combine automated tools (browser extensions and Lighthouse find contrast failures, missing labels and alternative text, but only about a third of issues) with manual checks: use the product with the keyboard only (can you reach and operate everything, and see where focus is?); zoom to 200% (does anything break or get cut off?); check colour contrast for every text and control; check that colour is never the only signal; try a screen reader (TalkBack on Android, VoiceOver on iPhone) on key flows; and include people with disabilities in usability tests. Module 13 covers the standards in depth.",
        decision: {
          scenario: "An automated accessibility checker reports zero errors on a sign-up page. The team declares the page accessible.",
          question: "Is that justified?",
          options: [
            { id: "a", text: "No: automated tools find only part of the problems; keyboard, zoom and screen reader checks are still needed", why: "Tools cannot judge whether a label makes sense, whether focus order is logical, or whether a flow is usable with a screen reader." },
            { id: "b", text: "Yes: zero errors means fully accessible", whyWrong: "Automated tools miss most issues that need human judgement." },
            { id: "c", text: "Yes, as long as the page is pretty", whyWrong: "Looks have nothing to do with it." },
            { id: "d", text: "No: accessibility can only be checked by lawyers", whyWrong: "Designers and developers can check most of it themselves." },
          ],
          correct: "a",
          aftermath: "Automated checks are the start of an accessibility evaluation, not the end.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 11.17 – 11.19, 11.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l48-analysis",
    moduleId: "ux-m11-usability",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.17", "11.18", "11.19", "11.P"],
    title: "Analysing Results, Prioritising and Iterating",
    subtitle: "From observations to a ranked list of fixes, and the next round",
    estimatedMinutes: 32,
    intro:
      "A test produces pages of notes. This lesson shows how to analyse them into issues, decide which to fix first, and iterate, then sets your practical: test your banking prototype with five users and improve it.",

    atoms: [
      {
        id: "a-ux-analysing-results",
        title: "Analysing test results",
        explain:
          "After each session, write up observations while they are fresh. Then analyse across sessions: list every issue observed, note which participants hit it (a \"rainbow spreadsheet\" gives each participant a colour, so patterns jump out), and combine with the metrics (completion, errors, time, satisfaction per task). Separate observations (\"P3 tapped Help instead of Transfer\") from interpretations (\"the Transfer icon is not recognisable\"), and look for the cause behind each issue. Pick out memorable quotes and short video clips: they persuade stakeholders far more than tables.",
      },
      {
        id: "a-ux-prioritising-issues",
        title: "Prioritising usability issues",
        explain:
          "You will find more issues than you can fix, so rank them. A common method scores each issue by frequency (how many participants hit it) times severity (how badly it hurt: 1 minor, 2 moderate, 3 serious, 4 blocks the task), breaking ties by severity. Then weigh the score against effort: a high-priority issue that is quick to fix goes first. Present the result as a ranked list with evidence for each issue, so the team agrees on what to do next sprint, and so that a severe problem seen in only one participant is not dismissed.",
        example: "Issue                              Freq  Sev  Score\nThought payment failed (no confirm)  3  ×  4  =  12  ← fix first (tie: higher severity)\nCould not find Transfer              4  ×  3  =  12\nDid not notice the fee               5  ×  2  =  10",
        webLab: {
          task:
            "Five participants tested a transfer flow (the issues are in the preview). In priority.md, give each issue its priority score (frequency × severity), list the five issue IDs in fix order (highest score first; when scores tie, higher severity first), and describe the first fix in at least 12 words.",
          files: { "index.html": ISSUES_PAGE, "priority.md": PRIORITY_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Every score is frequency × severity", check: MD + `const want = ${JSON.stringify(SCORES)}; const r = rows(raw('priority.md')); return Object.entries(want).every(([id, s]) => r.some((c) => (c[0] || '').trim().toUpperCase() === id && num(c[1]) === s));`, fail: "For example I1: 4 × 3 = 12." },
            { label: "The fix order is correct, ties broken by severity", check: MD + String.raw`const order = (section('priority.md', 'Fix order') || '').split('\n').map((l) => (l.match(/\bI\d\b/i) || [''])[0].toUpperCase()).filter(Boolean); return order.join() === 'I5,I1,I4,I3,I2';`, fail: "Sort by score; I1 and I5 tie at 12, so the one with severity 4 goes first. I2 and I3 tie too." },
            { label: "The first fix is described", check: MD + String.raw`return words(section('priority.md', 'First fix')) >= 12 && /confirm|success|receipt|reference/i.test(section('priority.md', 'First fix') || '');`, fail: "What would stop people thinking their payment failed?" },
          ],
          solution: { "priority.md": PRIORITY_MD_DONE },
          hint: "Write each score in the table first, then sort. Two pairs of issues tie.",
          successMessage: "A ranked list the whole team can act on, with the reasoning visible. The most dangerous issue goes first, not just the most common.",
        },
      },
      {
        id: "a-ux-iterative-improvements",
        title: "Iterative design improvements",
        explain:
          "Fix the top issues, then test again with new participants, using the same tasks so results are comparable: did completion rise, did errors and time fall, did satisfaction improve? Each round should be small and fast (often one or two weeks). Fixes can introduce new problems, which is why retesting matters. Keep a log of each round: what was tested, what was found, what changed, and the metrics, so you can show the improvement over time. That log is also the heart of a strong portfolio case study (Module 16).",
        decision: {
          scenario: "After fixing the top three issues, the team wants to skip retesting and move straight to development to save a week.",
          question: "What is the risk?",
          options: [
            { id: "a", text: "The fixes may not work or may create new problems, which will then be found after development, at much higher cost", why: "A quick retest with five new people confirms the fixes and catches new issues while they are still cheap to change." },
            { id: "b", text: "There is no risk: fixes always work", whyWrong: "Fixes are new designs, and new designs need testing." },
            { id: "c", text: "Developers will refuse to build untested designs", whyWrong: "They usually will build them; that is the problem." },
            { id: "d", text: "Retesting should use the same participants as before", whyWrong: "Returning participants already know the tasks; new ones give a fair test." },
          ],
          correct: "a",
          aftermath: "Test, fix, retest. The second round is often where the real improvement is proven.",
        },
      },
    ],

    task: {
      title: "Module 11 practical: test a prototype with five users and improve it",
      intro: "Use your Module 10 banking prototype (or another prototype of your own).",
      prompts: [
        "Write a test plan: objectives, participants (five), method, three scenario tasks with success criteria, and metrics.",
        "Run five moderated think-aloud sessions, recording completion, errors, time, the SEQ after each task and the SUS at the end.",
        "Analyse the results in a spreadsheet: completion rate, error rate, median time, SEQ and SUS per task, and a rainbow sheet of issues.",
        "Score and rank the issues by frequency and severity, and redesign the prototype to fix the top three.",
        "Retest the improved prototype with at least two new participants and document the before-and-after metrics.",
      ],
      closing: "Module 12 shows how professional teams keep designs consistent at scale: design systems.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
