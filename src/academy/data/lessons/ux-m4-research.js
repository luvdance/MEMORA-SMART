/**
 * UI/UX DESIGN · MODULE 4 · USER RESEARCH AND ANALYSIS
 *
 * Curriculum 4.1 – 4.15 and the practical 4.P. UX research, its kinds,
 * interviews, surveys, observation, competitor and market research, pain
 * points, feedback, documentation, bias, decisions and the tools (Google
 * Forms, FigJam, spreadsheets). The survey lab's numbers are computed by the
 * learner and checked exactly.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { docPage, MD } from "./ux-kit.js";

export const SECTION_ID = "ux-s4-research";

/* ── Lesson 15 lab: a research plan ────────────────────────────────────── */
const PLAN_MD = `# Research plan: paying school fees online

## Research questions
-

## Methods
| Method | Qualitative or quantitative | Primary or secondary | Why this method |
|--------|-----------------------------|----------------------|-----------------|
|        |                             |                      |                 |
`;

const PLAN_MD_DONE = `# Research plan: paying school fees online

## Research questions
- How do parents pay school fees today, and what goes wrong?
- Why do some parents still prefer to pay in cash at the school?
- How many parents would pay online if a receipt were issued instantly?

## Methods
| Method | Qualitative or quantitative | Primary or secondary | Why this method |
|--------|-----------------------------|----------------------|-----------------|
| Interviews with eight parents | Qualitative | Primary | To understand their reasons and feelings in depth |
| Survey of 120 parents with Google Forms | Quantitative | Primary | To measure how common each payment method and problem is |
| Review of published reports on digital payments in Nigeria | Quantitative | Secondary | To understand the wider market before we start |
| Observation at the bursary on fee day | Qualitative | Primary | To see the queues and problems as they happen |
`;

/* ── Lesson 16 lab: an interview guide ─────────────────────────────────── */
const GUIDE_MD = `# Interview guide: how traders save

## Warm-up
-

## Questions
- Don't you think saving every day is a good idea?
- Would you use an app that locks your savings?
- Do you like your current savings method?
- Is it hard to save?
- How much do you save, and do you use a bank or an esusu group?

## Wrap-up
-
`;

const GUIDE_MD_DONE = `# Interview guide: how traders save

## Warm-up
- Tell me a little about your business and a typical day at the market.

## Questions
- Tell me about the last time you managed to save some money. What happened?
- How do you decide how much to put aside, and when?
- What do you do with money you want to keep for later?
- Walk me through what happened the last time you had to use your savings.
- What makes saving difficult for you, if anything?
- Why did you choose the way you save now over other options?

## Wrap-up
- Is there anything about saving that I should have asked you but didn't?
`;

const OPEN = String.raw`/^(tell me|how|what|why|walk me through|describe|when|where|which|who|can you tell|could you describe)\b/i`;
const CLOSED = String.raw`/^(do|does|did|is|are|was|were|would|will|can|could|have|has|should|don't|wouldn't|isn't)\b/i`;

/* ── Lesson 17 lab: analysing survey results ───────────────────────────── */
const SURVEY = [
  ["R1", "Bank transfer", 2, "Long queues"],
  ["R2", "Cash at school", 3, "No receipt"],
  ["R3", "Cash at school", 1, "Long queues"],
  ["R4", "POS", 4, "Bank charges"],
  ["R5", "Bank transfer", 2, "Long queues"],
  ["R6", "Bank transfer", 3, "Wrong amount"],
  ["R7", "Cash at school", 2, "Long queues"],
  ["R8", "USSD", 5, "Bank charges"],
  ["R9", "Cash at school", 1, "Long queues"],
  ["R10", "Bank transfer", 3, "No receipt"],
  ["R11", "POS", 2, "Wrong amount"],
  ["R12", "Bank transfer", 4, "No receipt"],
];

const SURVEY_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>School fees survey</title>
  <style>
    body { margin: 0; padding: 24px 16px; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #1f2937; background: #f8fafc; }
    main { max-width: 720px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; color: #111827; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; }
    th, td { padding: 8px 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 15px; }
    th { background: #f1f5f9; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>School fees survey: 12 responses</h1>
    <p>Satisfaction: 1 = very unhappy, 5 = very happy, with how they pay today. Write your analysis in <code>results.md</code>.</p>
    <table>
      <thead><tr><th>Respondent</th><th>How they pay</th><th>Satisfaction</th><th>Biggest frustration</th></tr></thead>
      <tbody>
${SURVEY.map((r) => `        <tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("\n")}
      </tbody>
    </table>
  </main>
</body>
</html>
`;

const RESULTS_MD = `# School fees survey: results

## Share paying by bank transfer (%)

## Average satisfaction (all respondents)

## Respondents rating 2 or below (count)

## Average satisfaction of cash payers

## Most common frustration

## What this suggests
`;

const RESULTS_MD_DONE = `# School fees survey: results

## Share paying by bank transfer (%)
41.7%

## Average satisfaction (all respondents)
2.67

## Respondents rating 2 or below (count)
6

## Average satisfaction of cash payers
1.75

## Most common frustration
Long queues, mentioned by 5 of the 12 respondents.

## What this suggests
Parents who pay cash at the school are the least satisfied, and queues are the most common frustration. Interviews should explore why these parents still pay in cash, since an online option alone may not reach them.
`;

/* ── Lesson 18 lab: a research report ──────────────────────────────────── */
const REPORT_MD = `# Research report

## Goal
_What did you want to learn?_

## Participants
| ID | Who they are |
|----|--------------|
|    |              |

## Key findings
-

## Design decisions
| Finding | Decision |
|---------|----------|
|         |          |

## Limitations
`;

const REPORT_MD_DONE = `# Research report: a ride-sharing service for university students

## Goal
Learn how students at UNILAG travel between campus and home, what frustrates them, and whether they would share rides with other students.

## Participants
| ID | Who they are |
|----|--------------|
| P1 | 300-level student living in Yaba, travels daily by bus |
| P2 | 200-level student living off campus, uses ride-hailing twice a week |
| P3 | Final-year student who drives and often has empty seats |
| P4 | 100-level student living on campus, travels home at weekends |
| P5 | Postgraduate student who travels late after evening classes |

## Key findings
- Safety at night is the main worry, especially for women travelling alone (P2, P4, P5)
- Cost matters more than speed for most students (P1, P2, P4)
- Students would share rides only with verified students from their own university (P1, P3, P5)
- Drivers with empty seats want a simple way to offer them without haggling (P3)

## Design decisions
| Finding | Decision |
|---------|----------|
| Safety at night is the main worry | Show the driver's verified student ID and let riders share their trip live with a friend |
| Cost matters more than speed | Show the price per person upfront and sort results by price |
| Only verified students are trusted | Require a university email to sign up |

## Limitations
Five participants from one university are not representative of all students. Most were recruited through one WhatsApp group, which may have attracted people already interested in ride sharing. A survey should test how common these views are.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 4.1 – 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l15-research-intro",
    moduleId: "ux-m4-research",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3", "4.4"],
    title: "Why and How We Research Users",
    subtitle: "What UX research is, why it matters, and its four kinds",
    estimatedMinutes: 24,
    intro:
      "Phase 2 begins with the work that makes everything else in design trustworthy: finding out what people actually need, do and struggle with. This lesson explains what UX research is, why skipping it is so expensive, and the two pairs of words that describe every research method.",

    atoms: [
      {
        id: "a-ux-research-intro",
        title: "Introduction to UX research",
        explain:
          "UX research is the systematic study of the people who will use a product: their needs, behaviours, contexts, frustrations and motivations. It answers questions such as who the users are, what they are trying to do, how they do it today, what gets in their way, and whether a design works for them. Research happens throughout a project: exploratory research before design (what should we build?), evaluative research during design (does this work?), and measurement after release (is it working?). A research effort starts with clear research questions, chooses methods that can answer them, and ends with findings that change decisions.",
      },
      {
        id: "a-ux-research-matters",
        title: "Why user research matters",
        explain:
          "Without research, teams design for themselves, for the loudest stakeholder, or for an imagined average user, and discover their mistakes after building. Research reduces that risk cheaply: a week of interviews can save months of building the wrong thing. It also settles arguments with evidence instead of opinion, uncovers needs nobody had thought of, and builds empathy across the team. Research does not have to be big: five interviews or a short survey often change a design's direction.",
        why: "\"We don't have time for research\" usually means \"we have time to build the wrong thing twice\".",
      },
      {
        id: "a-ux-qual-quant",
        title: "Qualitative and quantitative research",
        explain:
          "Qualitative research explores why and how through words, observations and stories from a small number of people: interviews, observation, usability tests. It reveals reasons, feelings and problems you did not know to ask about. Quantitative research measures how many and how much through numbers from a larger number of people: surveys with fixed answers, analytics, A/B tests. It shows how common something is and whether a change made a difference. They answer different questions and work best together: qualitative research finds the problems, quantitative research shows how widespread they are.",
        decision: {
          scenario: "Analytics show that 60% of people abandon the checkout on the delivery step. The team does not know why.",
          question: "Which research would best explain why?",
          options: [
            { id: "a", text: "Qualitative: watch five to eight people go through checkout and ask them about the delivery step", why: "The numbers already show where and how many. Watching and talking to people reveals why." },
            { id: "b", text: "More analytics: count the abandonment again next month", whyWrong: "That repeats the what; it cannot explain the why." },
            { id: "c", text: "A survey of 1,000 people asking if they like the checkout", whyWrong: "\"Like\" says nothing about the delivery step, and a fixed-answer survey cannot reveal reasons you have not thought of." },
            { id: "d", text: "No research: redesign the step based on intuition", whyWrong: "Without knowing why, a redesign may not touch the cause." },
          ],
          correct: "a",
          aftermath: "Quantitative tells you what and how many; qualitative tells you why.",
        },
      },
      {
        id: "a-ux-primary-secondary",
        title: "Primary and secondary research",
        explain:
          "Primary research is research you conduct yourself, directly with your users: your own interviews, surveys, observations and tests. Secondary research uses information others have already gathered: industry reports, government statistics, academic studies, competitors' public material, app store reviews and earlier research by your own company. Secondary research is fast and cheap and should usually come first, to learn the landscape and avoid repeating known work; primary research then answers the questions specific to your product and users.",
        webLab: {
          task:
            "Plan research for an online school-fees payment service. In plan.md, write at least three research questions (each ending with a question mark), then fill the Methods table with at least three methods. Classify each as Qualitative or Quantitative and Primary or Secondary, and say why you chose it (at least five words). The plan must include at least one qualitative and one quantitative method, and at least one primary and one secondary method.",
          files: {
            "index.html": docPage("Research plan", "plan.md", [
              "At least three research questions, each ending with \"?\"",
              "At least three methods in the table, each classified and justified",
              "Use exactly: Qualitative / Quantitative, and Primary / Secondary",
              "Include both qualitative and quantitative, and both primary and secondary",
            ]),
            "plan.md": PLAN_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "At least three research questions", check: MD + String.raw`return bullets(section('plan.md', 'Research questions')).filter((l) => /\?$/.test(l) && words(l) >= 5).length >= 3;`, fail: "Write three \"- How …?\" or \"- Why …?\" questions." },
            { label: "At least three methods, each fully classified and justified", check: MD + String.raw`const r = rows(section('plan.md', 'Methods')).filter((c) => words(c[0]) >= 1 && /^(qualitative|quantitative)$/i.test(c[1] || '') && /^(primary|secondary)$/i.test(c[2] || '') && words(c[3]) >= 5); return r.length >= 3;`, fail: "Each row: a method, Qualitative or Quantitative, Primary or Secondary, and a reason of five words or more." },
            { label: "Both qualitative and quantitative methods", check: MD + String.raw`const r = rows(section('plan.md', 'Methods')); return r.some((c) => /^qualitative$/i.test(c[1] || '')) && r.some((c) => /^quantitative$/i.test(c[1] || ''));`, fail: "Combine methods that explain why with methods that measure how many." },
            { label: "Both primary and secondary research", check: MD + String.raw`const r = rows(section('plan.md', 'Methods')); return r.some((c) => /^primary$/i.test(c[2] || '')) && r.some((c) => /^secondary$/i.test(c[2] || ''));`, fail: "Add existing reports or statistics (secondary) as well as your own research (primary)." },
            { label: "Interviews are classified correctly", check: MD + String.raw`const r = rows(section('plan.md', 'Methods')).filter((c) => /interview/i.test(c[0])); return r.length === 0 || r.every((c) => /^qualitative$/i.test(c[1]) && /^primary$/i.test(c[2]));`, fail: "Interviews you run yourself are qualitative, primary research." },
          ],
          solution: { "plan.md": PLAN_MD_DONE },
          hint: "Ask of each method: does it produce words or numbers? Did we gather it, or did someone else?",
          successMessage: "A plan that mixes kinds of research on purpose: some to explain why, some to measure how many, built on what is already known.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 4.5 – 4.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l16-interviews",
    moduleId: "ux-m4-research",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.5", "4.6", "4.7"],
    title: "Interviews, Surveys and Observation",
    subtitle: "Three core methods, and how to avoid ruining them",
    estimatedMinutes: 28,
    intro:
      "Most UX research uses three methods: talking to people, asking many people the same questions, and watching what people do. Each is easy to do badly. This lesson shows how to do each well, with the mistakes that most often spoil the results.",

    atoms: [
      {
        id: "a-ux-interviews",
        title: "User interviews",
        explain:
          "A user interview is a one-to-one conversation, usually 30 to 60 minutes, to understand someone's experiences, behaviour and motivations. Prepare a guide: a warm-up, open questions on your research topics, and a wrap-up (\"anything I should have asked?\"). Ask about past behaviour, not hypothetical futures (\"tell me about the last time you…\", not \"would you use…?\"), because people are poor predictors of their own behaviour. Use open questions that start with how, what, why or \"tell me about\"; avoid leading questions that suggest an answer (\"don't you think…?\") and closed yes/no questions. Listen far more than you talk, follow interesting answers with \"why?\" or \"can you give an example?\", and record (with permission) so you can listen instead of writing.",
        table: {
          caption: "Rewriting weak interview questions.",
          headers: ["Weak", "Problem", "Better"],
          rows: [
            ["Don't you think saving daily is good?", "Leading", "How do you decide when to save?"],
            ["Would you use an app that locks savings?", "Hypothetical", "Tell me about the last time you needed savings early."],
            ["Is it hard to save?", "Closed (yes/no)", "What makes saving difficult, if anything?"],
            ["How much do you save, and where?", "Two questions in one", "Ask each separately"],
          ],
        },
        webLab: {
          task:
            "This interview guide is full of leading, hypothetical, closed and double questions. Rewrite guide.md: add a warm-up question; replace the Questions with at least six open questions, each starting with an open word (How, What, Why, When, Where, Which, Who, Tell me, Walk me through or Describe) and none starting with a closed word such as Do, Is, Would or Don't; keep each to a single question (one question mark, no \"and do/does/is…\" second question); and add a wrap-up question.",
          files: {
            "index.html": docPage("Interview guide", "guide.md", [
              "Warm-up: one question to put the person at ease",
              "Questions: six or more open questions",
              "Start with How, What, Why, When, Where, Which, Who, Tell me, Walk me through or Describe",
              "No leading, hypothetical or yes/no questions; one question per line",
              "Wrap-up: one closing question",
            ]),
            "guide.md": GUIDE_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "A warm-up and a wrap-up question", check: MD + "return bullets(section('guide.md', 'Warm-up')).some((l) => words(l) >= 5) && bullets(section('guide.md', 'Wrap-up')).some((l) => words(l) >= 5);", fail: "Add one question under Warm-up and one under Wrap-up." },
            { label: "At least six questions", check: MD + "return bullets(section('guide.md', 'Questions')).filter((l) => words(l) >= 4).length >= 6;", fail: "Write six or more questions under Questions." },
            { label: "Every question is open", check: MD + `const b = bullets(section('guide.md', 'Questions')); return b.length >= 6 && b.every((l) => ${OPEN}.test(l) && !${CLOSED}.test(l));`, fail: "Start every question with How, What, Why, When, Tell me, Walk me through or Describe." },
            { label: "No leading or hypothetical wording", check: MD + String.raw`const b = bullets(section('guide.md', 'Questions')); return b.every((l) => !/\b(don't you|wouldn't you|isn't it|would you use|would you like|do you like)\b/i.test(l));`, fail: "Remove \"don't you think\", \"would you use\" and \"do you like\"." },
            { label: "One question at a time", check: MD + String.raw`const b = bullets(section('guide.md', 'Questions')); return b.every((l) => (l.match(/\?/g) || []).length <= 1 && !/,?\s+and (do|does|did|is|are|would|will|can)\b/i.test(l));`, fail: "Split any line that asks two things." },
          ],
          solution: { "guide.md": GUIDE_MD_DONE },
          hint: "Ask about the last real time something happened, then follow up with how and why.",
          successMessage: "A guide that lets people tell their own story, so what you hear is theirs and not an echo of your question.",
        },
      },
      {
        id: "a-ux-surveys",
        title: "Surveys and questionnaires",
        explain:
          "A survey asks many people the same fixed questions, producing numbers you can count and compare. It is good for measuring how common something is, not for discovering why. Keep it short (under five minutes), ask one thing per question, use neutral wording, give balanced answer options (as many positive as negative, with a neutral middle on rating scales), include \"other\" or \"none\" where needed, and test it on two people before sending. Screen respondents so you hear from your actual users. Tools such as Google Forms collect responses straight into a spreadsheet for analysis.",
        decision: {
          scenario: "A survey question reads: \"How satisfied are you with our fast and affordable delivery?\" with options Very satisfied, Satisfied, Somewhat satisfied.",
          question: "What is wrong with it?",
          options: [
            { id: "a", text: "It is leading (\"fast and affordable\") and its answers are unbalanced, with no negative option", why: "Neutral wording (\"How satisfied are you with delivery?\") and a balanced scale from very dissatisfied to very satisfied give honest data." },
            { id: "b", text: "It is too short", whyWrong: "Length is not the problem; bias is." },
            { id: "c", text: "Delivery should not be asked about", whyWrong: "The topic is fine; the wording and options are not." },
            { id: "d", text: "Nothing: positive wording gets better responses", whyWrong: "It gets more flattering responses, which are useless for decisions." },
          ],
          correct: "a",
          aftermath: "A biased question produces confident, wrong numbers, which is worse than no numbers.",
        },
      },
      {
        id: "a-ux-observation",
        title: "Observation techniques",
        explain:
          "What people say and what they do are often different, so watch them. Contextual inquiry means observing people in their real environment (a shop, an office, a bus terminal) while they do the task, asking questions as they go. Shadowing follows someone through a period of their day. Diary studies ask people to record their experiences over days or weeks. When observing, note what people do, where they hesitate, what workarounds they use, what tools and paper are around them, and what interrupts them. Take photos (with permission) and write down exact actions, not your interpretations, until later.",
        why: "A trader may tell you she checks her balance daily; watching her may show she cannot find it and asks her son instead.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 4.8 – 4.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l17-market-feedback",
    moduleId: "ux-m4-research",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.8", "4.9", "4.10", "4.11"],
    title: "Competitors, Markets, Pain Points and Feedback",
    subtitle: "Learning from the landscape and making sense of what people tell you",
    estimatedMinutes: 30,
    intro:
      "Your users already use something to solve their problem, even if it is cash and a notebook. This lesson covers studying competitors and markets, identifying pain points, and turning raw feedback, including survey numbers, into something you can act on.",

    atoms: [
      {
        id: "a-ux-competitor-analysis",
        title: "Competitor analysis",
        explain:
          "Competitor analysis studies the products your users could use instead of yours: direct competitors (other school-fee payment apps), indirect competitors (bank transfers, paying cash at the bursary) and substitutes (asking a relative abroad to pay). Use each one for a real task, then compare them on the same criteria in a table: key features, pricing, onboarding, the steps a core task takes, strengths, weaknesses, and what their reviews complain about. The goal is not to copy, but to learn what users already expect, where the gaps are, and what you can do better.",
        table: {
          caption: "Part of a competitor analysis grid.",
          headers: ["", "Competitor A (app)", "Bank transfer", "Cash at school"],
          rows: [
            ["Steps to pay", "6", "4", "Travel and queue"],
            ["Receipt", "Instant, in app", "Bank SMS only", "Paper, if printed"],
            ["Cost", "₦100 fee", "Free to ₦50", "Transport"],
            ["Main complaint in reviews", "Login problems", "School cannot match payment", "Queues"],
          ],
        },
      },
      {
        id: "a-ux-market-research",
        title: "Market research",
        explain:
          "Market research looks at the wider context: how many potential users there are, who they are (age, location, income, devices), what trends affect them (smartphone use, mobile money adoption, data costs), and what regulations apply. Much of it is secondary research: national statistics, industry reports, telecom and banking data, news. For designers it answers practical questions: what devices and network speeds to design for, which languages to support, and whether the audience is large enough to justify the product. In Nigeria that often means designing for mid-range Android phones, intermittent data and USSD as a fallback.",
      },
      {
        id: "a-ux-pain-points",
        title: "Identifying user pain points",
        explain:
          "A pain point is a specific problem users experience. Pain points come in kinds: process pain points (too many steps, confusing flows), financial ones (unexpected fees), support ones (cannot get help), and productivity ones (wasted time). Find them in interviews, observation, support tickets, app store reviews and survey comments. Rate each by frequency (how many people) and severity (how much it hurts: does it annoy, delay or completely stop them?). The most frequent and severe pain points are where design effort pays off most.",
        decision: {
          scenario: "Research finds two pain points: 70% of users find the app's colours dull, and 25% cannot complete payment because the bank page times out.",
          question: "Which should the team tackle first?",
          options: [
            { id: "a", text: "The payment time-out: it is less frequent but completely stops people, and it costs the business sales", why: "Severity matters as much as frequency. A blocker for a quarter of users outweighs a mild preference for most." },
            { id: "b", text: "The colours, because more people mentioned them", whyWrong: "Dull colours annoy; a time-out blocks. Frequency alone is not priority." },
            { id: "c", text: "Neither, because 25% is a minority", whyWrong: "A quarter of users unable to pay is a serious problem." },
            { id: "d", text: "Both at once with equal effort", whyWrong: "Priorities exist because time is limited; the blocker comes first." },
          ],
          correct: "a",
          aftermath: "Prioritise pain points by frequency AND severity.",
        },
      },
      {
        id: "a-ux-feedback",
        title: "Gathering and interpreting user feedback",
        explain:
          "Feedback arrives from surveys, reviews, support messages, social media and interviews. Interpreting it well means: counting how many people say something rather than reacting to the loudest; separating what people report (problems) from what they request (solutions, which may not be the best answer); segmenting (do different groups feel differently?); and looking for the need behind each comment. With survey data, work in a spreadsheet: count answers, convert counts to percentages of all respondents, compute averages for ratings, and compare segments. A segment often tells a different story from the average.",
        example:
          "From a Google Forms spreadsheet:\nShare choosing an option  = count ÷ total respondents × 100\nAverage rating            = sum of ratings ÷ number of ratings\nSegment average           = the same, but only for one group's rows\n\n=COUNTIF(B2:B13,\"Bank transfer\")/COUNTA(B2:B13)\n=AVERAGE(C2:C13)\n=AVERAGEIF(B2:B13,\"Cash at school\",C2:C13)",
        webLab: {
          task:
            "Twelve parents answered a survey about paying school fees (the responses are in the preview). Analyse them in results.md: the percentage who pay by bank transfer (one decimal place); the average satisfaction of all respondents (two decimal places); how many respondents rated 2 or below; the average satisfaction of the parents who pay cash at school (two decimal places); the most common frustration; and, in at least 20 words, what this suggests.",
          files: { "index.html": SURVEY_PAGE, "results.md": RESULTS_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Share paying by bank transfer", check: MD + "return Math.abs(num(section('results.md', 'Share paying')) - 41.67) <= 0.1;", fail: "Count the bank-transfer rows, divide by 12 and multiply by 100." },
            { label: "Average satisfaction of all respondents", check: MD + "return Math.abs(num(section('results.md', 'Average satisfaction (all')) - 2.667) <= 0.006;", fail: "Add all twelve ratings and divide by 12." },
            { label: "Respondents rating 2 or below", check: MD + "return num(section('results.md', 'Respondents rating')) === 6;", fail: "Count the ratings of 1 and 2." },
            { label: "Average satisfaction of cash payers", check: MD + "return Math.abs(num(section('results.md', 'Average satisfaction of cash')) - 1.75) <= 0.006;", fail: "Only the four \"Cash at school\" rows: add their ratings and divide by 4." },
            { label: "The most common frustration", check: MD + "return /queue/i.test(section('results.md', 'Most common') || '');", fail: "Which frustration appears most often?" },
            { label: "What it suggests, in at least 20 words", check: MD + "return words(section('results.md', 'What this suggests')) >= 20;", fail: "Compare the cash payers with the average. What would you research next?" },
          ],
          solution: { "results.md": RESULTS_MD_DONE },
          hint: "The overall average hides something: compare it with the cash payers' average.",
          successMessage: "Numbers turned into a finding: the average looks merely poor, but cash payers are very unhappy. That segment is where to look next.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 4.12 – 4.15, 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l18-findings",
    moduleId: "ux-m4-research",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.12", "4.13", "4.14", "4.15", "4.P"],
    title: "From Findings to Decisions",
    subtitle: "Documenting research, avoiding bias, acting on it, and the tools",
    estimatedMinutes: 32,
    intro:
      "Research only matters if it changes what gets built. This lesson covers documenting research so others can use it, the biases that distort it, turning findings into design decisions, and the everyday tools: Google Forms, FigJam and spreadsheets. It ends with your module practical: research with five real people.",

    atoms: [
      {
        id: "a-ux-research-documentation",
        title: "Research documentation",
        explain:
          "Document research so a teammate who was not there can understand and trust it. A research report usually contains: the goal and research questions; the method and when it was done; the participants (anonymised, described by what matters: \"P3, final-year student who drives\"); the key findings, each with the evidence behind it and how many participants it came from; recommendations or decisions; and limitations. Keep raw notes and recordings organised and private. Short, visual summaries (a one-page findings sheet, a FigJam board) get read; fifty-page reports do not.",
      },
      {
        id: "a-ux-research-bias",
        title: "Identifying research biases",
        explain:
          "Bias makes research tell you what you expected instead of what is true. Confirmation bias: noticing only evidence that supports your idea. Leading questions: wording that suggests an answer. Sampling bias: talking only to people who are easy to reach (friends, colleagues, one WhatsApp group). Social desirability bias: participants saying what sounds good or what they think you want to hear. Recency bias: overweighting the last interview. Reduce bias by recruiting deliberately varied participants, asking neutral open questions, recording exactly what people said, analysing with a colleague, and actively looking for evidence against your idea.",
        decision: {
          scenario: "A designer interviews five friends from church about a new budgeting app. All five love the idea, and the designer reports strong demand.",
          question: "Which bias most threatens this conclusion?",
          options: [
            { id: "a", text: "Sampling and social desirability bias: friends from one group are not representative, and are likely to be kind", why: "Recruit strangers from the target audience, and ask about past behaviour instead of opinions of the idea." },
            { id: "b", text: "Recency bias", whyWrong: "Possible, but the bigger issue is who was asked and why they would be positive." },
            { id: "c", text: "None: five people is a good sample", whyWrong: "Five can be enough for qualitative work, if they are the right five." },
            { id: "d", text: "Confirmation bias in the app's code", whyWrong: "Bias here is in the research, not the code." },
          ],
          correct: "a",
          aftermath: "Friends are the worst research participants: they are unrepresentative and they want to be nice to you.",
        },
      },
      {
        id: "a-ux-findings-decisions",
        title: "Turning research findings into design decisions",
        explain:
          "A finding states what you learned and the evidence for it (\"Safety at night is the main worry: P2, P4, P5\"). An insight explains why it matters. A decision states what the design will do about it (\"Show the driver's verified ID and let riders share their trip live\"). Link every major decision back to a finding, and every important finding forward to a decision, or to an explicit choice not to act yet. This traceability is what lets you defend a design to stakeholders and explain it in a portfolio.",
      },
      {
        id: "a-ux-research-tools",
        title: "Research tools: Google Forms, FigJam and spreadsheets",
        explain:
          "Google Forms builds surveys and screeners for free, with question types for multiple choice, rating scales and open text, and sends every response straight into Google Sheets. Spreadsheets (Google Sheets or Excel) are where survey data is cleaned, counted and charted: COUNTIF for counts, AVERAGE and AVERAGEIF for ratings, pivot tables for segments. FigJam is Figma's online whiteboard: teams paste interview notes as sticky notes, cluster them into themes (affinity mapping), vote, and draw journey maps and flows together, in real time or asynchronously.",
        table: {
          caption: "Which tool for which research job.",
          headers: ["Job", "Tool", "How"],
          rows: [
            ["Recruit and screen participants", "Google Forms", "A short screener with qualifying questions"],
            ["Run a survey", "Google Forms", "Fixed answers, balanced scales, one thing per question"],
            ["Count and segment responses", "Google Sheets / Excel", "COUNTIF, AVERAGEIF, pivot tables, charts"],
            ["Synthesise interview notes", "FigJam", "One sticky note per observation, cluster into themes"],
            ["Share findings with the team", "FigJam or a one-page report", "Themes, quotes, numbers and decisions"],
          ],
        },
      },
      {
        id: "a-ux-report-lab",
        title: "Practical: researching with five users",
        explain:
          "Your practical is real research with at least five potential users of a proposed product. The report you write must let someone who was not there trust your conclusions: who you spoke to, what you found and how many said it, what you will do about it, and what might be wrong with your research.",
        webLab: {
          task:
            "Write the research report for a proposed product of your choice (or adapt the student ride-sharing example). In report.md: a Goal of at least 12 words; a Participants table with at least five participants (IDs P1 to P5 or more) and a description of each; at least three Key findings, each citing the participants it came from, such as \"(P1, P3)\"; a Design decisions table with at least three rows linking a finding to a decision; and Limitations of at least 20 words.",
          files: {
            "index.html": docPage("Research report", "report.md", [
              "Goal: at least 12 words",
              "Participants: five or more rows, P1 to P5, each described",
              "Key findings: three or more, each citing participants, such as (P2, P4)",
              "Design decisions: three or more rows linking a finding to a decision",
              "Limitations: at least 20 words",
            ]),
            "report.md": REPORT_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "A goal of at least 12 words", check: MD + String.raw`return words((section('report.md', 'Goal') || '').replace(/_[^_]*_/g, '')) >= 12;`, fail: "Say what you wanted to learn, and about whom." },
            { label: "At least five participants, each described", check: MD + String.raw`const r = rows(section('report.md', 'Participants')).filter((c) => /^P\d+$/i.test(c[0]) && words(c[1]) >= 4); return new Set(r.map((c) => c[0].toUpperCase())).size >= 5;`, fail: "Five rows: P1 to P5, each with who they are in four words or more." },
            { label: "Three findings, each citing participants", check: MD + String.raw`return bullets(section('report.md', 'Key findings')).filter((l) => /\(\s*P\d+(\s*,\s*P\d+)*\s*\)/i.test(l) && words(l) >= 6).length >= 3;`, fail: "End each finding with the participants it came from, such as (P1, P4)." },
            { label: "Three design decisions linked to findings", check: MD + String.raw`return rows(section('report.md', 'Design decisions')).filter((c) => words(c[0]) >= 3 && words(c[1]) >= 5).length >= 3;`, fail: "Each row: the finding (three words or more) and what the design will do (five words or more)." },
            { label: "Limitations in at least 20 words", check: MD + "return words(section('report.md', 'Limitations')) >= 20;", fail: "Who was missing from your sample? What bias might have crept in?" },
          ],
          solution: { "report.md": REPORT_MD_DONE },
          hint: "Write the findings first, then for each one ask: so what will the design do?",
          successMessage: "A report someone else can trust: real participants, findings with evidence, decisions that follow from them, and honesty about the limits.",
        },
      },
    ],

    task: {
      title: "Module 4 practical: research a proposed digital product with five users",
      intro: "Choose a product idea (your own, or the proposal from Module 2) and research it with real people.",
      prompts: [
        "Write three to five research questions and choose methods: at least five interviews, and optionally a short Google Forms survey.",
        "Recruit at least five potential users who are not your close friends, using a short screener.",
        "Run the interviews with an open-question guide, recording with permission, and observe at least one person doing the task if you can.",
        "Synthesise the notes in FigJam: one sticky note per observation, clustered into themes, with counts of how many participants each theme came from.",
        "Write a research report: goal, participants, key findings with evidence, design decisions, and limitations.",
      ],
      closing: "Module 5 turns these findings into personas, journey maps and the structure of your product.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
