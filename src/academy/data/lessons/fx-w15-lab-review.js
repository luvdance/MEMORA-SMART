/**
 * FOREX TRADING · WEEK 15 · LAB: STRATEGY REVIEW
 *
 * Curriculum 15.1 – 15.P. Required output: performance statistics and a
 * rule-compliance report built from the learner's own Week 14 journal,
 * compared with the Week 13 backtest.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The worked example follows one learner's fifteen demo trades. Overall
 * they lost a little; the rule-following trades made a little and the
 * rule-breaking trades lost a lot. That split, not the total, is the point.
 */

export const SECTION_ID = "fx-s15-lab-review";

/** Fifteen demo trades in R. Trades 5, 10, 13 and 14 broke rules. */
const DEMO_15 = [2, -1, -1, -1, 1.6, -1, 2, -1, -1, -1.2, 2, -1, -1, -1, 2];
const COMPLIANT = [2, -1, -1, -1, -1, 2, -1, -1, 2, -1, 2];
const BROKEN = [1.6, -1.2, -1, -1];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 15.1 — PERFORMANCE STATISTICS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l44-lab-statistics",
    moduleId: "fx-w15-lab-review",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1"],
    title: "Performance Statistics from Your Journal",
    subtitle: "Demo results, measured the same way as the backtest",
    estimatedMinutes: 14,
    intro:
      "Calculate the same statistics from your demo journal as from your backtest, so the two can be compared directly. The example below follows one learner, Ada, through the review.",

    atoms: [
      {
        id: "a-fx-lab-demo-stats",
        title: "The demo statistics",
        explain:
          "Ada's backtest showed +0.20R per trade. Her fifteen demo trades, in R after costs: +2, −1, −1, −1, +1.6, −1, +2, −1, −1, −1.2, +2, −1, −1, −1, +2. Calculate win rate, expectancy, profit factor and drawdown exactly as in Week 9.",
        calcExercise: {
          scenario: "Use Ada's fifteen demo trades above.",
          question: "What is the expectancy per trade, in R? Round to two decimal places.",
          unit: "R",
          answer: -0.04,
          tolerance: 0.005,
          hint: "Add the fifteen results and divide by fifteen.",
          working: "Wins: 2 + 1.6 + 2 + 2 + 2 = +9.6R\nLosses: −1 × 9 − 1.2 = −10.2R\nTotal −0.6R ÷ 15 = −0.04R per trade",
          check: { fn: "expectancy", args: { results: DEMO_15 } },
        },
      },
      {
        id: "a-fx-lab-compare",
        title: "Comparing demo with backtest",
        explain:
          "Fifteen trades is a small sample, so a difference from the backtest may be chance. Before concluding anything, ask three questions: Were costs higher than the backtest assumed (Week 14's measurement)? Were the market conditions different from the backtest period? Were the rules actually followed? The third is answered by the compliance audit in the next lesson.",
        decision: {
          scenario: "Ada's backtest was +0.20R over 60 trades. Her demo is −0.04R over 15.",
          question: "What can she conclude so far?",
          options: [
            {
              id: "a",
              text: "Nothing firm yet: 15 trades is too few, so she must check costs, conditions and rule compliance before judging",
              why: "Right. The demo might differ by chance, costs, conditions or execution. The audit tells her which.",
            },
            {
              id: "b",
              text: "The strategy has stopped working",
              whyWrong: "Fifteen trades cannot show that, and the cause may be her execution rather than the strategy.",
            },
            {
              id: "c",
              text: "The backtest was faked",
              whyWrong: "There is no evidence of that; differences between backtest and demo are normal and have explanations.",
            },
            {
              id: "d",
              text: "Increase risk so the demo catches up",
              whyWrong: "That is revenge trading, applied to a whole review.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 15.2 — THE RULE-COMPLIANCE AUDIT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l45-lab-compliance",
    moduleId: "fx-w15-lab-review",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.2"],
    title: "The Rule-Compliance Audit",
    subtitle: "Separating the strategy's results from your behaviour",
    estimatedMinutes: 16,
    intro:
      "The compliance audit splits your trades by process grade and calculates the statistics for each group separately. It answers the question every losing trader needs answered: is the problem the strategy, or how I traded it?",

    atoms: [
      {
        id: "a-fx-lab-adherence",
        title: "Adherence rate",
        explain:
          "Ada's process grades: trades 5 (closed early at +1.6R instead of the 2R target), 10 (stop moved further away, lost 1.2R) and 13 and 14 (revenge trades after two losses) were graded C or F. The other eleven were A or B. Her ADHERENCE RATE is 11 ÷ 15 = 73%.",
        why: "Adherence is the first number in the report because every other number depends on it. Results from a strategy followed 73% of the time are a mixture of two different things.",
      },
      {
        id: "a-fx-lab-split",
        title: "Splitting the results",
        explain:
          "Now calculate expectancy separately. Ada's eleven compliant trades: +2, −1, −1, −1, −1, +2, −1, −1, +2, −1, +2. Her four rule-breaking trades: +1.6, −1.2, −1, −1.",
        calcExercise: {
          scenario: "Use Ada's eleven compliant trades above.",
          question: "What is the expectancy of the COMPLIANT trades, in R? Round to two decimal places.",
          unit: "R",
          answer: 0.09,
          tolerance: 0.005,
          hint: "Add the eleven results and divide by eleven.",
          working:
            "Compliant: 4 × 2R − 7 × 1R = +1R ÷ 11 = +0.09R\nRule-breaking: 1.6 − 1.2 − 1 − 1 = −1.6R ÷ 4 = −0.40R\nThe strategy, as written, made a little. The rule breaks cost more than it made.",
          check: { fn: "expectancy", args: { results: COMPLIANT } },
        },
      },
      {
        id: "a-fx-lab-split-meaning",
        title: "What the split means",
        explain:
          "The split tells you where to work. If compliant trades are positive and rule-breaking trades negative, the priority is behaviour, not rules. If compliant trades are negative too, over a sufficient sample, the strategy itself needs review. Ada's rule-breaking trades averaged −0.40R against +0.09R for her compliant ones.",
        decision: {
          scenario: "Ada's compliant trades: +0.09R. Rule-breaking trades: −0.40R. Adherence 73%.",
          question: "What should her report say is the priority for the next month?",
          options: [
            {
              id: "a",
              text: "Behaviour: raise adherence, especially around revenge trades after two losses",
              why: "Right. The strategy as written was slightly positive; the rule breaks turned it negative. Two of the four were revenge trades, so the daily-loss rule is the place to start.",
            },
            {
              id: "b",
              text: "Rewrite the entry rules",
              whyWrong: "The compliant trades were positive. Changing the rules would not fix the losses caused by not following them.",
            },
            {
              id: "c",
              text: "Add more indicators",
              whyWrong: "The problem identified is behaviour, not analysis.",
            },
            {
              id: "d",
              text: "Nothing; overall it nearly broke even",
              whyWrong: "The near break-even hides two very different results. The report must show the split.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 15.3 + 15.P — WHAT TO CHANGE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l46-lab-changes",
    moduleId: "fx-w15-lab-review",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.3", "15.P"],
    title: "Deciding What to Change, and What Not To",
    subtitle: "One change, with a reason, tested before it is trusted",
    estimatedMinutes: 14,
    intro:
      "A review should end with a decision. Most of the time the right decision is to change nothing in the strategy and one thing in your behaviour. When a rule does need changing, there is a procedure.",

    atoms: [
      {
        id: "a-fx-lab-change-rules",
        title: "The change procedure",
        explain:
          "To change a rule: (1) state the problem with evidence from the journal or backtest; (2) state a reason the change should help that exists independently of the results; (3) make ONE change and give the strategy a new version number; (4) test it on data it was not designed on, before using it on the demo. Ideas from the Week 13 list go through the same procedure.",
        decision: {
          scenario:
            "Ada wants to make three changes at once: a 1.5R target instead of 2R, a new RSI filter, and adding GBP/JPY. Her compliant trades were slightly positive over 11 trades.",
          question: "What does the procedure advise?",
          options: [
            {
              id: "a",
              text: "Change nothing in the strategy for now; work on adherence, and test at most one rule change, with a reason, on unseen data",
              why: "Right. With only eleven compliant trades there is no evidence any rule is the problem, and three changes at once would make it impossible to know which one mattered.",
            },
            {
              id: "b",
              text: "Make all three changes: more changes, more improvement",
              whyWrong: "Three simultaneous changes cannot be evaluated separately, and none is supported by evidence.",
            },
            {
              id: "c",
              text: "Make the changes and go live with real money to test them",
              whyWrong: "Untested changes on real money combine every risk the course warns against.",
            },
            {
              id: "d",
              text: "Abandon the strategy and find a new one online",
              whyWrong: "Restarting discards all the evidence gathered. Strategy-hopping is a common way never to learn anything.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-lab-output-15",
        title: "Required output: statistics and compliance report",
        explain:
          "Submit a two-page report: demo statistics beside backtest statistics; measured costs against assumed costs; adherence rate; the compliant versus rule-breaking split; your most frequent behavioural error and its trigger; and your decision, either 'no strategy change' with the behavioural focus, or one change taken through the full procedure.",
        example:
          "REVIEW REPORT — summary table (Ada)\n\n                     Backtest (v1.0)    Demo (Week 14)\n  Trades                    60                15\n  Win rate                  40%               33%\n  Expectancy (R)           +0.20             −0.04\n  Cost per trade (R)        0.11 assumed      0.14 measured\n\n  Adherence: 73%  ·  Compliant +0.09R (11)  ·  Rule-breaking −0.40R (4)\n  Main error: revenge trades after 2 losses (2 of 4 breaks)\n  Decision: no rule change. Daily-loss rule made a hard stop:\n            close the platform after the second loss.",
      },
    ],

    task: {
      title: "This week's required output",
      intro: "Performance statistics and a rule-compliance report from your own Week 14 journal and Week 13 backtest.",
      prompts: [
        "Calculate demo statistics in the same way as the backtest, and set them side by side.",
        "Compare measured costs with the backtest's assumed costs.",
        "Grade-split your trades: adherence rate, compliant expectancy, rule-breaking expectancy.",
        "Identify your most frequent behavioural error and what triggered it, from the emotional-state column.",
        "Write your decision: no strategy change plus one behavioural focus, or one rule change taken through the full procedure. Submit the report.",
      ],
      closing: "A report that shows you broke your rules and explains why is a strong report. A report that hides it is a failed one.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

// Exported for the self-test, which checks the split adds back to the whole.
export const REVIEW_EXAMPLE = { DEMO_15, COMPLIANT, BROKEN };

export default LESSONS;
