/**
 * FOREX TRADING · CONSOLIDATION WEEK 1 · PHASE 1 REVIEW AND DEMO PRACTICE
 *
 * Curriculum C1.1 – C1.P. No new theory. Interleaved practice across the
 * whole of Phase 1 (mixing problem types is what makes them stick), the
 * phase's commonest mistakes, a guided week on the demo account, and the
 * Phase 1 checkpoint.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s-c1";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     C1.1 — INTERLEAVED PRACTICE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c1-l1-mixed-practice",
    moduleId: "fx-c1-consolidation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["C1.1"],
    title: "Interleaved Practice: Quotes, Pips, Lots, Margin and Size",
    subtitle: "Every Phase 1 calculation, mixed up on purpose",
    estimatedMinutes: 20,
    intro:
      "In Weeks 1 to 3 each calculation came right after the lesson that taught it, so you always knew which method to use. Real trading never tells you. This lesson mixes them: for each problem, first decide WHICH calculation it needs, then do it.",

    atoms: [
      {
        id: "a-fx-c1-movement",
        title: "Movement in pips",
        explain: "Start with the most basic one. Identify the pair's pip size, then measure.",
        calcExercise: {
          scenario: "EUR/USD rose from 1.07650 to 1.08115.",
          question: "How many pips did it rise?",
          unit: "pips",
          answer: 46.5,
          tolerance: 0.05,
          hint: "Not a yen pair, so one pip is 0.0001.",
          working: "1.08115 − 1.07650 = 0.00465 → 46.5 pips",
          check: { fn: "pipsBetween", args: { pair: "EUR/USD", from: 1.0765, to: 1.08115 } },
        },
      },
      {
        id: "a-fx-c1-spread",
        title: "A yen spread",
        explain: "Same skill, different pair. Watch the pip size.",
        calcExercise: {
          scenario: "USD/JPY: bid 151.204, ask 151.221.",
          question: "What is the spread in pips?",
          unit: "pips",
          answer: 1.7,
          tolerance: 0.05,
          hint: "Yen pairs: one pip is 0.01.",
          working: "151.221 − 151.204 = 0.017 → 0.017 ÷ 0.01 = 1.7 pips",
          check: { fn: "spreadPips", args: { pair: "USD/JPY", bid: 151.204, ask: 151.221 } },
        },
      },
      {
        id: "a-fx-c1-pip-value",
        title: "Pip value with the dollar as base",
        explain: "Decide which of the three pip-value cases this is before calculating.",
        calcExercise: {
          scenario: "You hold 0.40 lots of USD/CAD at 1.3600.",
          question: "What is one pip worth, in dollars? Round to the cent.",
          unit: "USD",
          answer: 2.94,
          tolerance: 0.005,
          hint: "USD is the BASE, so convert the quote-currency pip value by dividing by the price.",
          working: "Pip in CAD: 0.0001 × 100,000 × 0.40 = C$4.00\nIn USD: 4.00 ÷ 1.3600 = $2.94",
          check: { fn: "pipValue", args: { pair: "USD/CAD", lots: 0.4, price: 1.36 } },
        },
      },
      {
        id: "a-fx-c1-margin",
        title: "Margin",
        explain: "Notional value first, then leverage.",
        calcExercise: {
          scenario: "Leverage 1:30. You buy 0.20 lots of GBP/USD at 1.2700.",
          question: "What margin does it require, in dollars?",
          unit: "USD",
          answer: 846.67,
          tolerance: 0.01,
          hint: "Notional = lots × 100,000 × price (quote is USD). Then divide by 30.",
          working: "0.20 × 100,000 × 1.2700 = $25,400\n$25,400 ÷ 30 = $846.67\nOn a $1,000 account that leaves almost no free margin: a warning sign that 0.20 lots is far too big.",
          check: { fn: "marginRequired", args: { pair: "GBP/USD", lots: 0.2, price: 1.27, leverage: 30 } },
        },
      },
      {
        id: "a-fx-c1-size",
        title: "Position size on a larger account",
        explain: "The formula does not change with the balance; only the money at risk does.",
        calcExercise: {
          scenario: "Balance $2,500, risk 1%, stop 35 pips on EUR/USD ($10 per pip per lot).",
          question: "What lot size? Round down to 0.01.",
          unit: "lots",
          answer: 0.07,
          tolerance: 0.0001,
          hint: "Money at risk ÷ (stop pips × pip value per lot).",
          working: "$25 ÷ (35 × $10) = 0.0714 → 0.07 lots ($24.50 at risk)",
          check: { fn: "positionSize", args: { balance: 2500, riskPercent: 1, stopPips: 35, pipValuePerLot: 10 } },
        },
      },
      {
        id: "a-fx-c1-ticket",
        title: "All of it on one ticket",
        explain: "Direction, order type, size, stop and target together, exactly as on the platform.",
        ticketExercise: {
          task:
            "$1,000 account, risk exactly 1%. SELL GBP/USD at the market, stop-loss 1.26818, take-profit 1.25618. Size it and place it.",
          pair: "GBP/USD",
          bid: 1.26418,
          ask: 1.26436,
          balance: 1000,
          leverage: 30,
          riskPercent: 1,
          expect: { type: "market", side: "sell", lots: 0.02, sl: 1.26818, tp: 1.25618 },
          explain:
            "A sell fills at the bid, 1.26418. The stop is 40 pips above: $10 ÷ (40 × $10) = 0.025, rounded down to 0.02 ($8 at risk). Target 80 pips: 2R.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C1.2 — COMMON MISTAKES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c1-l2-mistakes",
    moduleId: "fx-c1-consolidation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["C1.2"],
    title: "The Five Most Common Phase 1 Mistakes",
    subtitle: "Learn them from this page instead of from your account",
    estimatedMinutes: 12,
    intro:
      "These five errors account for a large share of beginners' early losses. Each one has appeared in a lesson already. Here they are together, so you can check yourself against the list.",

    atoms: [
      {
        id: "a-fx-c1-mistake-list",
        title: "The five",
        explain:
          "1. Reading a pair backwards: thinking USD/JPY rising means the yen is strengthening. 2. Using 0.0001 as the pip size on yen pairs. 3. Assuming $10 a pip on every pair, including crosses and USD-base pairs. 4. Treating leverage as extra money rather than as permission to take bigger losses. 5. Trading without a stop-loss, or choosing the lot size before the stop.",
        table: {
          caption: "Each mistake and the habit that prevents it.",
          headers: ["Mistake", "Prevention habit"],
          rows: [
            ["Pair read backwards", "Say 'I am buying the FIRST currency' before every trade"],
            ["Wrong pip size on yen pairs", "Check: does the pair end in JPY?"],
            ["$10 a pip everywhere", "Your calculator's three pip-value cases"],
            ["Leverage as money", "Look at effective leverage, not the account maximum"],
            ["Size before stop", "Stop from structure first; size from the formula second"],
          ],
        },
      },
      {
        id: "a-fx-c1-mistake-check",
        title: "Spot the mistake",
        explain: "Apply the list to a real-looking plan.",
        decision: {
          scenario:
            "A learner's plan: 'Buy USD/JPY 0.10 lots, stop 30 pips. At $10 a pip that risks $30, which is 3% of my $1,000. That's fine because my leverage is 1:500.'",
          question: "How many of the five mistakes does this plan contain?",
          options: [
            {
              id: "a",
              text: "Two: it assumes $10 a pip on a USD-base pair (it is about $6.67 at 150), and it uses high leverage to justify the risk",
              why: "Right. The pip value is wrong (0.10 lots is about $0.67 a pip, so the stop risks about $20), and leverage is never a reason that a risk is acceptable. The 3% risk is also above the course's 1%.",
            },
            {
              id: "b",
              text: "None; the plan is fine",
              whyWrong: "The pip value is wrong for a USD-base pair, and leverage does not make any risk acceptable.",
            },
            {
              id: "c",
              text: "Only that 0.10 lots is too small",
              whyWrong: "Size follows from risk and stop; 'too small' is not the problem here.",
            },
            {
              id: "d",
              text: "Only that it is a yen pair, which should be avoided",
              whyWrong: "Yen pairs are majors and perfectly tradable; the problem is the arithmetic and the reasoning.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C1.3 — THE GUIDED DEMO WEEK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c1-l3-demo-week",
    moduleId: "fx-c1-consolidation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["C1.3"],
    title: "A Guided Demo Week: Every Trade Sized First",
    subtitle: "Learning on the go, with one rule that never bends",
    estimatedMinutes: 10,
    intro:
      "You do not yet have a strategy; that comes in Phase 3. This week's demo trading is about mechanics and arithmetic: every trade sized before entry, every trade journaled, on whichever device you have with you.",

    atoms: [
      {
        id: "a-fx-c1-week-plan",
        title: "The week",
        explain:
          "Five days, about twenty minutes a day, on your phone or laptop. Each day: one pair, one small trade at 1% risk with a stop and target placed by the simplest logic you know (beyond the last swing), the pre-trade calculation written first, and the journal row completed. Rotate pairs: EUR/USD, GBP/USD, USD/JPY, EUR/GBP, USD/CAD, so you meet every pip-value case.",
        why: "The point is not to make money: you have no edge yet. The point is to make sizing automatic on every kind of pair before strategy is added on top.",
      },
      {
        id: "a-fx-c1-week-rule",
        title: "The one rule",
        explain: "No trade is placed until the written calculation exists. If you are on your phone without your calculator, use the formula by hand.",
        decision: {
          scenario:
            "You are on a bus with only your phone. USD/CAD is moving and you want to take this week's practice trade now. Your spreadsheet is on your laptop at home.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Work the size by hand in your phone's notes app using the formula, then place the trade",
              why: "Right. The calculator is a convenience; the formula is the skill. If you can do it by hand, you can trade anywhere.",
            },
            {
              id: "b",
              text: "Place 0.01 lots without calculating, since it is small",
              whyWrong: "'Small' is not a calculation. The habit is the point of this week.",
            },
            {
              id: "c",
              text: "Place the trade and calculate when you get home",
              whyWrong: "Calculating after entry is the exact habit this course is trying to replace.",
            },
            {
              id: "d",
              text: "Skip trading forever on the phone",
              whyWrong: "The phone is fine; skipping the calculation is not.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C1.4 + C1.P — THE PHASE 1 CHECKPOINT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c1-l4-checkpoint",
    moduleId: "fx-c1-consolidation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["C1.4", "C1.P"],
    title: "The Phase 1 Checkpoint",
    subtitle: "Ten quotes, ten position sizes, by hand",
    estimatedMinutes: 15,
    intro:
      "The Phase 1 checkpoint confirms the foundations before analysis is built on them. Everything in Phases 2 to 5 assumes you can do these calculations without hesitating.",

    atoms: [
      {
        id: "a-fx-c1-checkpoint-format",
        title: "The checkpoint",
        explain:
          "Ten live quotes from your demo platform: for each, write the bid, ask, spread in pips and which currency is the base. Then ten position sizes on different pairs and stop distances, calculated BY HAND and checked against your spreadsheet. Pass mark 70%, the same as every check in the course.",
        why: "Doing it by hand proves you understand the method, and checking against the spreadsheet proves the spreadsheet is right. Both matter: a broken calculator is a silent, repeated error.",
      },
      {
        id: "a-fx-c1-checkpoint-sample",
        title: "A sample item",
        explain: "One item in the format of the checkpoint.",
        calcExercise: {
          scenario: "You hold 0.02 lots of EUR/USD with a 45-pip stop. One pip on one lot is $10.",
          question: "How much is lost if the stop is hit?",
          unit: "USD",
          answer: 9,
          tolerance: 0.005,
          hint: "Stop pips × pip value per lot × lots.",
          working: "45 × $10 × 0.02 = $9.00",
          check: { fn: "riskAmount", args: { stopPips: 45, pipValuePerLot: 10, lots: 0.02 } },
        },
      },
    ],

    task: {
      title: "Phase 1 checkpoint",
      intro: "Do it on a weekday during the London–New York overlap, with your demo platform open.",
      prompts: [
        "Record ten live quotes (at least three pairs, including a yen pair and a cross): bid, ask, spread in pips, base currency.",
        "Calculate ten position sizes by hand, on different pairs and stop distances, at 1% of your demo balance.",
        "Check each against your spreadsheet calculator. Fix whichever is wrong.",
        "Complete the guided demo week and review your five journal rows: was every trade sized before entry?",
        "Write three lines: what is now automatic, what still needs care, and one question for Phase 2.",
      ],
      closing: "When the checkpoint is done, Phase 2 begins: reading the market itself.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
