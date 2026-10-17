/**
 * FOREX TRADING · WEEK 14 · LAB: DEMO EXECUTION
 *
 * Curriculum 14.1 – 14.P. Required output: a live-market simulated trading
 * journal, every entry written at the time, on the demo account set up in
 * Week 1, following the Week 12 trading plan exactly.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s14-lab-demo";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 14.1 — THE DAILY ROUTINE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l41-lab-routine",
    moduleId: "fx-w14-lab-demo",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1"],
    title: "A Daily Routine: Before, During and After the Session",
    subtitle: "The same steps every trading day",
    estimatedMinutes: 12,
    intro:
      "Week 14 is live-market practice: real prices, virtual money, your plan followed exactly. What makes it a lab rather than a game is routine. This lesson sets out the daily routine the week is run on.",

    atoms: [
      {
        id: "a-fx-lab-before",
        title: "Before the session",
        explain:
          "Ten to twenty minutes before your session: check the economic calendar for the day; note any high-impact releases and their Lagos times; update structure and zones on your pairs; set TradingView alerts on the zones; write a one-line state check ('slept well, calm' or 'tired, stressed'); and confirm your circuit breakers are not already triggered.",
      },
      {
        id: "a-fx-lab-during",
        title: "During the session",
        explain:
          "Wait for alerts rather than watching every candle. When one fires, work the checklist on paper or your phone. If everything is 'yes', size with your calculator, place the order with the full routine, check the Trade tab and write the journal row immediately. Otherwise write a one-line no-trade note and close the chart.",
        decision: {
          scenario:
            "An alert fires during a work meeting. You can glance at the chart on your phone but cannot work the checklist properly for 40 minutes.",
          question: "What does the routine say?",
          options: [
            {
              id: "a",
              text: "Skip the setup unless it is still valid when you can work the full checklist",
              why: "Right. A setup you cannot check properly is not a trade. Missing some setups is a normal cost of a sustainable routine.",
            },
            {
              id: "b",
              text: "Place a quick market order from the phone and check it later",
              whyWrong: "That skips the checklist, the calculator and the read-back: the very steps that prevent errors.",
            },
            {
              id: "c",
              text: "Leave the meeting to trade",
              whyWrong: "Your plan's session hours were chosen to fit your life. Trading should not disrupt it.",
            },
            {
              id: "d",
              text: "Turn off alerts so you are never tempted",
              whyWrong: "Alerts are what make the routine workable. The answer is to act on them only when you can follow the process.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-lab-after",
        title: "After the session",
        explain:
          "Five to ten minutes after: complete any open journal rows; grade each trade's process (A, B, C, F) before thinking about results; note the day's emotions; check open trades against the exposure limits; and write one sentence on what to do the same or differently tomorrow.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 14.2 — THE LIVE-MARKET JOURNAL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l42-lab-journal",
    moduleId: "fx-w14-lab-demo",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.2"],
    title: "The Live-Market Journal: What to Record, and When",
    subtitle: "Written at the time, or it is not evidence",
    estimatedMinutes: 12,
    intro:
      "This week's journal is assessed for accuracy and completeness, so it has to be written in real time. Here is exactly what goes in it, and when.",

    atoms: [
      {
        id: "a-fx-lab-journal-timing",
        title: "When each part is written",
        explain:
          "Three moments. AT ENTRY: date and time, pair, direction, setup, checklist answers, planned entry, stop, target, lot size, risk in dollars and R, emotional state, and a screenshot. AT EXIT: actual entry and exit, result in dollars and R, costs, exit reason, a second screenshot. AT REVIEW: process grade and notes. A row completed after the fact is marked as such.",
        table: {
          caption: "The journal's columns grouped by when they are filled.",
          headers: ["Moment", "Columns"],
          rows: [
            ["At entry", "Time · pair · direction · setup · checklist · planned prices · lots · risk $ and R · state · screenshot"],
            ["At exit", "Actual fill and exit · result $ and R · spread, commission, swap · exit reason · screenshot"],
            ["At review", "Process grade A/B/C/F · what went well · what to change"],
            ["No-trade notes", "Time · pair · which checklist item failed"],
          ],
        },
      },
      {
        id: "a-fx-lab-journal-accuracy",
        title: "Accuracy checks",
        explain:
          "At the end of each day, reconcile the journal with MT5's History tab: every trade in the platform must appear in the journal with the same prices, volume and result, and the journal's running balance must match the account's. A discrepancy is either a recording error or an unrecorded trade, and both matter.",
        decision: {
          scenario:
            "Reconciling on Thursday, you find a trade in the MT5 History that is not in your journal: a 0.05-lot impulse buy on Tuesday evening that lost $12. You would rather not record it.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Record it, marked as entered after the fact, grade it F, and note what led to it",
              why: "Right. An unrecorded impulse trade is the most important row in the journal. The lab is assessed on accurate records, and this is what accuracy means.",
            },
            {
              id: "b",
              text: "Leave it out; it was not part of the strategy",
              whyWrong: "It happened in the account, so it is part of your results and your behaviour. Leaving it out makes the journal false.",
            },
            {
              id: "c",
              text: "Record it as a strategy trade with an A grade",
              whyWrong: "That falsifies both the setup and the grade.",
            },
            {
              id: "d",
              text: "Reset the demo account to remove it",
              whyWrong: "That destroys the record the lab is assessed on.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 14.3 + 14.P — EXECUTION QUALITY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l43-lab-execution",
    moduleId: "fx-w14-lab-demo",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.3", "14.P"],
    title: "Execution Quality: Planned Versus Actual",
    subtitle: "Measuring the gap between the plan and the platform",
    estimatedMinutes: 16,
    intro:
      "Every trade has a planned version and an actual one. The gap between them, made of slippage, spread, fills and your own errors, is measurable, and it is part of this week's output.",

    atoms: [
      {
        id: "a-fx-lab-slippage",
        title: "Measuring slippage per trade",
        explain:
          "For each trade, record slippage in pips on entry and on exit: actual minus planned, signed so that a worse fill is negative. Over the week, average them. Compare the average with the cost assumption in your backtest.",
        calcExercise: {
          scenario: "You planned a buy-stop entry at 1.08500 on EUR/USD. It filled at 1.08507.",
          question: "By how many pips did the fill differ from the plan? (Give the size; it was worse.)",
          unit: "pips",
          answer: 0.7,
          tolerance: 0.05,
          hint: "Actual − planned, divided by the pip size.",
          working: "1.08507 − 1.08500 = 0.00007 = 0.7 pips worse on a buy.",
          check: { fn: "pipsBetween", args: { pair: "EUR/USD", from: 1.085, to: 1.08507 } },
        },
      },
      {
        id: "a-fx-lab-cross-ticket",
        title: "A cross-pair order, sized correctly",
        explain:
          "The lab often involves crosses, where pip value must be converted. This ticket checks that you can place one exactly to plan.",
        ticketExercise: {
          task:
            "Plan, on a $1,000 account risking exactly 1%: BUY EUR/GBP now at the market, stop-loss at 0.85174, take-profit at 0.85924. GBP/USD is 1.2640, so one pip on one lot of EUR/GBP is $12.64. Size it yourself and place the order.",
          pair: "EUR/GBP",
          bid: 0.8541,
          ask: 0.85424,
          balance: 1000,
          leverage: 30,
          quoteToUsd: 1.264,
          baseToUsd: 1.085,
          riskPercent: 1,
          expect: { type: "market", side: "buy", lots: 0.03, sl: 0.85174, tp: 0.85924 },
          explain:
            "The buy fills at the ask, 0.85424. The stop is 25 pips below: $10 ÷ (25 × $12.64) = 0.0316, rounded down to 0.03 lots. Wrongly assuming $10 a pip would give 0.04 lots, which really risks $12.64, over plan.",
        },
      },
      {
        id: "a-fx-lab-output-14",
        title: "Required output: the live-market simulated journal",
        explain:
          "Submit: the journal for the whole week, every row written at the time (or marked otherwise); the daily reconciliation notes; the average slippage and cost per trade in R; and the daily before/after routine notes. The number of trades does not matter. A week with three well-documented trades and many no-trade notes is a complete output.",
      },
    ],

    task: {
      title: "This week's required output",
      intro: "A live-market simulated trading journal. Demo account only, following your Week 12 trading plan exactly.",
      prompts: [
        "Run the daily routine on every trading day: before, during and after the session.",
        "Journal every trade at entry, at exit and at review; write a no-trade note whenever an alert fires and the checklist fails.",
        "Reconcile the journal with MT5's History every day; record and explain any discrepancy.",
        "Measure slippage and total cost per trade; calculate the weekly average in R.",
        "Submit the journal, reconciliation notes and cost summary.",
      ],
      closing: "Results will be compared with your backtest next week. Do not change anything this week to make that comparison look better.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
