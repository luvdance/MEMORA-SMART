/**
 * FOREX TRADING · CONSOLIDATION WEEK 3 · PHASE 3 REVIEW AND DEMO PRACTICE
 *
 * Curriculum C3.1 – C3.P. Interleaved practice across timeframes, strategy
 * rules and backtest statistics; the phase's commonest mistakes; the first
 * week of trading the written strategy on the demo account; and the Phase 3
 * checkpoint.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s-c3";

/** Ten trades at 1.5R: four winners, six losers — exactly break-even. */
const BREAK_EVEN_10 = [1.5, -1, -1, 1.5, -1, 1.5, -1, -1, 1.5, -1];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     C3.1 — INTERLEAVED PRACTICE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c3-l1-mixed-practice",
    moduleId: "fx-c3-consolidation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["C3.1"],
    title: "Interleaved Practice: Reward-to-Risk, Break-Even, Expectancy and Sizing",
    subtitle: "The numbers behind a strategy, mixed",
    estimatedMinutes: 18,
    intro: "Phase 3's arithmetic, out of order. For each, name the statistic before you calculate it.",

    atoms: [
      {
        id: "a-fx-c3-rr",
        title: "Planned reward-to-risk",
        explain: "Distances, then the ratio.",
        calcExercise: {
          scenario: "A buy at 1.0920 with the stop at 1.0895 and the target at 1.0970.",
          question: "What is the planned reward-to-risk, in R?",
          unit: "R",
          answer: 2,
          tolerance: 0.005,
          hint: "Target distance ÷ stop distance.",
          working: "Stop: 25 pips. Target: 50 pips. 50 ÷ 25 = 2.0R",
          check: { fn: "rewardToRisk", args: { entry: 1.092, stop: 1.0895, target: 1.097 } },
        },
      },
      {
        id: "a-fx-c3-breakeven",
        title: "Break-even win rate",
        explain: "What a 1.5R strategy needs just to stand still.",
        calcExercise: {
          scenario: "A strategy targets 1.5R on every trade.",
          question: "What win rate breaks even before costs? Round to one decimal place.",
          unit: "%",
          answer: 40,
          tolerance: 0.05,
          hint: "1 ÷ (1 + R).",
          working: "1 ÷ 2.5 = 0.40 = 40.0%",
          check: { fn: "breakevenWinRate", args: { rr: 1.5 } },
        },
      },
      {
        id: "a-fx-c3-pf",
        title: "Profit factor at break-even",
        explain:
          "Ten backtested trades at 1.5R: +1.5, −1, −1, +1.5, −1, +1.5, −1, −1, +1.5, −1. Four winners, a 40% win rate: exactly the break-even rate you just calculated.",
        calcExercise: {
          scenario: "Use the ten trades above.",
          question: "What is the profit factor?",
          unit: "",
          answer: 1,
          tolerance: 0.005,
          hint: "Gross wins ÷ gross losses.",
          working: "Gross wins: 4 × 1.5 = 6R. Gross losses: 6 × 1 = 6R. 6 ÷ 6 = 1.00: break-even, and after costs, a loss.",
          check: { fn: "profitFactor", args: { results: BREAK_EVEN_10 } },
        },
      },
      {
        id: "a-fx-c3-expectancy",
        title: "Expectancy from rates",
        explain: "Now improve the win rate a little and see what happens.",
        calcExercise: {
          scenario: "Same 1.5R strategy, but the win rate is 45%. Average loss 1R.",
          question: "What is the expectancy per trade, in R? Round to two decimal places.",
          unit: "R",
          answer: 0.13,
          tolerance: 0.005,
          hint: "(Win rate × average win) − (loss rate × average loss).",
          working: "0.45 × 1.5 − 0.55 × 1 = 0.675 − 0.550 = 0.125 ≈ 0.13R\nFive extra percentage points of wins turned break-even into a small edge.",
          check: { fn: "expectancyFromRates", args: { winRatePercent: 45, avgWin: 1.5, avgLoss: 1 } },
        },
      },
      {
        id: "a-fx-c3-ticket",
        title: "A strategy order",
        explain: "A Phase 3 plan, placed as a pending order, sized exactly.",
        ticketExercise: {
          task:
            "$1,000 account, risk exactly 1%. Plan: EUR/USD is in a daily downtrend; SELL if price rallies to the H4 supply zone at 1.08800. Stop beyond the zone plus buffer at 1.09030. Target 1.08340. Size and place it.",
          pair: "EUR/USD",
          bid: 1.08502,
          ask: 1.08514,
          balance: 1000,
          leverage: 30,
          riskPercent: 1,
          expect: { type: "sell-limit", side: "sell", lots: 0.04, entry: 1.088, sl: 1.0903, tp: 1.0834 },
          explain: "A Sell Limit above the current price. Stop 23 pips: $10 ÷ (23 × $10) = 0.043 → 0.04 lots. Target 46 pips: 2R.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C3.2 — COMMON MISTAKES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c3-l2-mistakes",
    moduleId: "fx-c3-consolidation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["C3.2"],
    title: "The Most Common Phase 3 Mistakes",
    subtitle: "How strategies get broken before they are tested",
    estimatedMinutes: 12,
    intro: "Phase 3's mistakes are about rules and evidence. They are subtle, and they are the reason most strategies people trade have never really been tested.",

    atoms: [
      {
        id: "a-fx-c3-mistake-list",
        title: "The list",
        explain:
          "Rules with undefined words ('near', 'strong'). Ignoring the higher timeframe. Stops placed by affordability instead of structure. Backtesting with the future visible. Skipping 'unclear' losers. Testing too few trades. Tuning settings until the past looks perfect. Forgetting costs.",
        table: {
          caption: "Mistake, and the Week that fixes it.",
          headers: ["Mistake", "Fixed in"],
          rows: [
            ["Undefined words in rules", "Week 8: objective rules"],
            ["Ignoring the higher timeframe", "Week 7: top-down analysis"],
            ["Stops by affordability", "Weeks 7–8: invalidation, structure plus buffer"],
            ["Future visible in the backtest", "Week 9: Bar Replay"],
            ["Skipping unclear losers", "Week 9: every qualifying setup recorded"],
            ["Tiny samples, tuned settings, no costs", "Week 9: sample size, overfitting, realistic costs"],
          ],
        },
      },
      {
        id: "a-fx-c3-mistake-check",
        title: "Spot the mistake",
        explain: "Apply the list.",
        decision: {
          scenario:
            "A learner's backtest: 18 trades, on the three months where EUR/USD trended strongly, scrolling a normal chart, with a profit factor of 2.4 and no costs deducted.",
          question: "What is the most accurate verdict?",
          options: [
            {
              id: "a",
              text: "The result is close to meaningless: tiny sample, a hand-picked period, the future visible, and no costs",
              why: "Right. Four separate problems, each of which flatters the result. The strategy may still be good; this test cannot say.",
            },
            {
              id: "b",
              text: "A profit factor of 2.4 proves the strategy",
              whyWrong: "The number is only as good as the test that produced it.",
            },
            {
              id: "c",
              text: "Only the missing costs matter",
              whyWrong: "Costs are one of four problems; the sample, period and visible future matter as much.",
            },
            {
              id: "d",
              text: "18 trades is plenty if they all came from good months",
              whyWrong: "Choosing good months is the problem, not a reassurance.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C3.3 — THE GUIDED DEMO WEEK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c3-l3-demo-week",
    moduleId: "fx-c3-consolidation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["C3.3"],
    title: "A Guided Demo Week: Trading the Written Strategy",
    subtitle: "The checklist, every time",
    estimatedMinutes: 10,
    intro: "For the first time, your demo trades follow your own written strategy. This week is about one thing: doing exactly what the document says.",

    atoms: [
      {
        id: "a-fx-c3-week-plan",
        title: "The week",
        explain:
          "Trade only setups that pass every checklist item. Use pending orders and alerts wherever the strategy allows, so the platform waits instead of you. Journal each trade with its checklist answers. Record every no-trade decision with the item that failed. At the end of the week, count: how many trades passed every item, and how many did you take anyway?",
      },
      {
        id: "a-fx-c3-week-rule",
        title: "When the strategy is silent",
        explain: "Some situations your rules do not cover. The default is always the same.",
        decision: {
          scenario: "A setup appears that your strategy neither clearly allows nor clearly forbids: the zone is on the H4 but the trigger formed on the M30, which your rules do not mention.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "No trade; add a note to the ideas list so the rule can be clarified after review",
              why: "Right. When the rules are silent, the answer is no trade. Gaps are fixed in review, not in the moment.",
            },
            {
              id: "b",
              text: "Take it, because nothing forbids it",
              whyWrong: "Trading in the gaps of your rules means trading without rules.",
            },
            {
              id: "c",
              text: "Rewrite the rule now to include M30, then take it",
              whyWrong: "Changing rules to permit the trade in front of you is the fastest way to untested rules.",
            },
            {
              id: "d",
              text: "Ask a group chat",
              whyWrong: "Someone else cannot settle what your rules mean.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C3.4 + C3.P — THE PHASE 3 CHECKPOINT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c3-l4-checkpoint",
    moduleId: "fx-c3-consolidation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["C3.4", "C3.P"],
    title: "The Phase 3 Checkpoint",
    subtitle: "A strategy someone else can follow, and 30 honest setups",
    estimatedMinutes: 14,
    intro: "The checkpoint tests the two properties a strategy must have before it is worth trading: it can be followed by someone else, and it has been honestly tested.",

    atoms: [
      {
        id: "a-fx-c3-checkpoint-format",
        title: "The checkpoint",
        explain:
          "Two parts. (1) The SWAP TEST: another learner applies your written strategy to a historical chart you both have, independently. You compare where each of you would have traded; at least 80% of the setups must match. (2) Your backtest of at least 30 qualifying setups, with costs, from Week 9, and its statistics.",
        why: "If two people get different trades from the same rules, any backtest of those rules is testing one person's judgement, not the rules.",
      },
      {
        id: "a-fx-c3-checkpoint-swap",
        title: "When the swap test fails",
        explain: "A disagreement is information about a rule, not about either person.",
        decision: {
          scenario: "In the swap test you and your partner agree on 7 of 10 setups. All three disagreements involve whether price was 'in the zone'.",
          question: "What is the right next step?",
          options: [
            {
              id: "a",
              text: "Define 'in the zone' precisely (for example, an H1 candle's low within the zone's boundaries), version the strategy, and repeat the test",
              why: "Right. One vague phrase caused every disagreement. Fixing it makes the strategy testable.",
            },
            {
              id: "b",
              text: "Count it as a pass; 70% is close",
              whyWrong: "The standard is 80%, and the cause of the gap is known and fixable.",
            },
            {
              id: "c",
              text: "Decide your partner was wrong",
              whyWrong: "If the rule allows both readings, neither of you was wrong; the rule is.",
            },
            {
              id: "d",
              text: "Remove zones from the strategy",
              whyWrong: "The concept is fine; the definition needs tightening.",
            },
          ],
          correct: "a",
        },
      },
    ],

    task: {
      title: "Phase 3 checkpoint",
      intro: "Both parts are needed. Neither is assessed on profit.",
      prompts: [
        "Swap test: exchange strategies and a historical chart with another learner; mark setups independently; compare.",
        "Fix any rule that caused disagreement; version the strategy; repeat until at least 80% of setups match.",
        "Complete your backtest to at least 30 qualifying setups with costs, and calculate its statistics.",
        "Complete the guided demo week and count checklist-passing trades versus trades taken.",
        "Three lines: what the strategy does well, where it is weak, one question for Phase 4.",
      ],
      closing: "Phase 4 is about the trader: execution, psychology and the risk of the whole account.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
