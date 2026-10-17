/**
 * MATHEMATICS · MONTH 10 · MODULE 40 · EXAM MASTERY: WAEC, NECO AND JAMB
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 *
 * The content is finished. This module trains the paper itself. Atoms from
 * L6-E2 onwards are techniques rather than calculations, so they carry
 * `teaches` instead of a generated drill of their own; where practice is the
 * point (pacing, mocks), they attach a timed mixed drill drawn from the
 * whole course.
 */

export const SECTION_ID = "ma-s40-exam-mastery";

/** One skill from every corner of the syllabus, for mixed timed practice. */
const WHOLE_COURSE = [
  "L1-N3.3", "L1-N4.2", "L2-N1.1", "L2-N2.2", "L2-A2.2", "L2-G3.1", "L2-S1.2",
  "L3-A1.3", "L3-A2.2", "L3-T1.1", "L4-N3.2", "L4-N4.2", "L4-N5.3", "L4-A1.3",
  "L4-G1.2", "L5-N1.2", "L5-G1.2", "L5-T1.2", "L5-S3.3", "L6-C2.3",
];

export const LESSONS = [
  {
    id: "ma-l6-e1",
    moduleId: "ma-40-exam-mastery",
    sectionId: SECTION_ID,
    skillGroup: "L6-E1",
    order: 1,
    title: "Word Problems",
    subtitle: "Read it, draw it, write it, solve it",
    estimatedMinutes: 40,
    intro: "Most lost marks are lost in the reading, not the arithmetic. Three steps turn any worded problem into one you already know how to solve.",

    atoms: [
      {
        id: "a-ma-l6-e1-1",
        title: "Find the key words",
        explain: "Name the unknown with a letter. Then translate each phrase into an operation.",
        table: [
          ["Words", "Maths"],
          ["sum, more than, increased by", "+"],
          ["difference, less than, reduced by", "−   (watch the order: '5 less than x' is x − 5)"],
          ["product, times, of", "×"],
          ["quotient, per, shared", "÷"],
          ["is, gives, equals", "="],
        ],
        example: "  'Three more than twice a number is 17'\n    2n + 3 = 17  →  n = 7",
        mistake: "Writing '5 less than x' as 5 − x. It is x − 5.",
        drill: { skill: "L6-E1.1", count: 3 },
      },
      {
        id: "a-ma-l6-e1-2",
        title: "Draw the model",
        explain: "Before any algebra, draw it: a BAR MODEL for sharing, parts and differences; a sketch for any geometry; a timeline for ages. The drawing shows what to do.",
        example: "  ₦600 shared 2 : 3\n    [■■][■■■]  5 equal bars = ₦600\n    one bar = ₦120  →  ₦240 and ₦360",
        mistake: "Skipping the picture on a question that 'looks easy' and misreading which quantity is asked for.",
        drill: { skill: "L6-E1.2", count: 3 },
      },
      {
        id: "a-ma-l6-e1-3",
        title: "Write the equation and check it",
        explain: "Write one equation per fact. Solve. Then put the answer back into the WORDS, not just the equation, to check it answers the question that was asked.",
        example: "  40 tickets, adults ₦500, children ₦200, total ₦11 000\n    a + c = 40, 500a + 200c = 11 000\n    500a + 200(40 − a) = 11 000  →  300a = 3 000  →  a = 10\n    Check: 10 × 500 + 30 × 200 = 11 000 ✓",
        mistake: "Answering with the wrong unknown: finding c when the question asks for a.",
        drill: { skill: "L6-E1.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-e2",
    moduleId: "ma-40-exam-mastery",
    sectionId: SECTION_ID,
    skillGroup: "L6-E2",
    order: 2,
    title: "Objective Papers",
    subtitle: "Speed, elimination and the computer screen",
    estimatedMinutes: 40,
    intro: "In an objective paper every question carries the same mark. The aim is the most correct answers in the time, not perfection on each one.",

    atoms: [
      {
        id: "a-ma-l6-e2-1",
        title: "Pacing",
        teaches: "L6-E2.1",
        explain: "Work out your time per question before you start: total minutes ÷ number of questions. Aim for 10 questions in 12 minutes. If a question passes double its share with no route in sight, mark it, move on, and come back at the end. Never leave a blank: there is no penalty for a wrong answer.",
        example: "  50 questions in 90 minutes: 1.8 min each (about 1 min 48 s)\n  After 30 minutes you should be near question 17.",
        mistake: "Spending eight minutes on question 4 and rushing the last ten.",
        drill: { review: WHOLE_COURSE.slice(0, 10), count: 10 },
      },
      {
        id: "a-ma-l6-e2-2",
        title: "Using the options",
        teaches: "L6-E2.2",
        explain: "The answer is on the page. SUBSTITUTE: put each option into the equation. ELIMINATE: cross out options with the wrong sign, size or units. ESTIMATE: round the numbers, and the nearest option is usually right.",
        example: "  Solve x² − 5x + 6 = 0:  A {2, 3}  B {−2, −3}  C {1, 6}  D {−1, 6}\n    try 2: 4 − 10 + 6 = 0 ✓, try 3: 9 − 15 + 6 = 0 ✓  →  A\n\n  49.8 × 0.21 ≈ 50 × 0.2 = 10  →  pick the option near 10",
        mistake: "Doing a full solution when substituting one option would settle it in ten seconds.",
      },
      {
        id: "a-ma-l6-e2-3",
        title: "Computer-based tests",
        teaches: "L6-E2.3",
        explain: "In a CBT (as in JAMB), use the rough sheet as you would on paper: write the working, do not do it in your head because the question is on a screen. Use the question map to jump to flagged questions. Check the timer every ten questions. Confirm each answer is actually selected before moving on.",
        example: "  Routine: read → rough sheet → choose → check the selection → next\n  Every 10 questions: glance at the clock against your plan",
        mistake: "Doing long working mentally because there is no paper in front of the question.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-e3",
    moduleId: "ma-40-exam-mastery",
    sectionId: SECTION_ID,
    skillGroup: "L6-E3",
    order: 3,
    title: "Theory Papers",
    subtitle: "Writing answers that collect every mark",
    estimatedMinutes: 40,
    intro: "In a theory (essay) paper, most marks are METHOD marks. A wrong final answer with clear correct working can still score most of the marks. A right answer with no working may score almost nothing.",

    atoms: [
      {
        id: "a-ma-l6-e3-1",
        title: "Show full working",
        teaches: "L6-E3.1",
        explain: "Write the formula, then the substitution, then the result, each on its own line. Keep the equals signs lined up. Never cross out working you have not replaced: it can still earn marks.",
        example: "  Area = ½ab sin C\n       = ½ × 8 × 5 × sin 30°\n       = 10 cm²",
        mistake: "Writing only '10 cm²'. If that is wrong, there is nothing to award marks for.",
      },
      {
        id: "a-ma-l6-e3-2",
        title: "Units and accuracy",
        teaches: "L6-E3.2",
        explain: "Keep full calculator accuracy in every middle step; round ONLY the final answer, and exactly as the question asks (decimal places or significant figures). Always write the unit.",
        example: "  Height = 40 × tan 52°\n    full accuracy: 40 × 1.27994… = 51.198 → 51.2 m ✓\n    rounding tan 52° to 1.3 first: 40 × 1.3 = 52.0 m ✗",
        mistake: "Rounding at every step, so the final answer drifts away from the mark scheme's.",
        drill: { review: ["L5-T1.2", "L5-T1.3", "L4-G1.2", "L5-S2.3"], count: 4 },
      },
      {
        id: "a-ma-l6-e3-3",
        title: "Graphs and diagrams",
        teaches: "L6-E3.3",
        explain: "Graphs need: a title, both axes labelled with quantity and unit, a uniform scale that uses most of the paper, points plotted accurately, and a smooth curve (not dot-to-dot) for a quadratic. Diagrams need all given lengths and angles marked.",
        example: "  Checklist: title · axes named · scale stated · points × · smooth curve · readings shown with dashed lines",
        mistake: "A tiny graph in one corner. Most of the plotting marks are for using a sensible scale.",
      },
      {
        id: "a-ma-l6-e3-4",
        title: "Choosing optional questions",
        teaches: "L6-E3.4",
        explain: "When you must choose some questions from a section, spend the first three minutes reading ALL of them. Pick the ones where you can see the method for every part, not just the first. Start with your strongest.",
        example: "  For each question, rate it: ✓ whole method clear   ~ part of it   ✗ no idea\n  Answer the ✓ questions first, then the best ~.",
        mistake: "Starting the first optional question without reading the others, then getting stuck in part (c).",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-e4",
    moduleId: "ma-40-exam-mastery",
    sectionId: SECTION_ID,
    skillGroup: "L6-E4",
    order: 4,
    title: "Full Mocks",
    subtitle: "The real thing, before the real thing",
    estimatedMinutes: 240,
    intro: "A mock only helps if it is sat like the exam: timed, in one sitting, with no notes and no checking answers part-way.",

    atoms: [
      {
        id: "a-ma-l6-e4-1",
        title: "WAEC and NECO mock",
        teaches: "L6-E4.1",
        explain: "Sit a full past paper: the objective paper, then the theory paper, timed to the minute. Before starting, write your timing plan at the top. Afterwards, mark it strictly with the official marking scheme, including method marks.",
        example: "  Plan: objectives at 1.8 min each; theory by question, leaving 10 minutes to check\n  Mark against the scheme; record the score per TOPIC, not just the total.",
        mistake: "Pausing the clock 'just to check something'. The exam clock does not pause.",
        drill: { review: WHOLE_COURSE, count: 20 },
      },
      {
        id: "a-ma-l6-e4-2",
        title: "JAMB CBT mock",
        teaches: "L6-E4.2",
        explain: "Sit a UTME-style computer-based mock under its real time limit, with your other subjects. Practise moving between subjects so Mathematics gets its planned share of the time.",
        example: "  Plan your minutes per subject before you start, and check them at each subject switch.",
        mistake: "Doing Mathematics first and letting it eat the time for the other subjects.",
        drill: { review: WHOLE_COURSE.slice(5), count: 15 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-e5",
    moduleId: "ma-40-exam-mastery",
    sectionId: SECTION_ID,
    skillGroup: "L6-E5",
    order: 5,
    title: "Recovery",
    subtitle: "Turning a mock score into a plan",
    estimatedMinutes: 30,
    intro: "A mock score is not a verdict. It is a list of exactly which atoms to fix next.",

    atoms: [
      {
        id: "a-ma-l6-e5-1",
        title: "Reading your mock",
        teaches: "L6-E5.1",
        explain: "For every lost mark, write down the ATOM it came from and the TYPE of error: didn't know the method, slip in arithmetic, misread the question, or ran out of time. Count them. The biggest pile is the next thing to work on.",
        example: "  Lost 18 marks: 9 in circle theorems (method), 5 slips, 4 time\n    → re-master circle theorems first; then pacing practice",
        mistake: "Reacting to the total ('I got 58%') instead of the list. The total does not say what to fix.",
      },
      {
        id: "a-ma-l6-e5-2",
        title: "Re-mastering a weak atom",
        teaches: "L6-E5.2",
        explain: "For each weak atom: re-read its Anchor, redo its Trace, then drill until you pass a FRESH check at 70% or more. Only then sit the next mock. Repeat the cycle until every atom is above the line.",
        example: "  Weak: sine rule\n    re-read → worked example → drill 10 → fresh check 4/5 ✓ → next atom",
        mistake: "Re-sitting the same mock. You remember the answers, so it proves nothing.",
      },
      {
        id: "a-ma-review-40",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L6-C2.3", "L6-C2.6", "L6-C3.2", "L6-C3.3", "L6-S1.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
