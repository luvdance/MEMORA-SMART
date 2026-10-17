/**
 * FOREX TRADING · CONSOLIDATION WEEK 2 · PHASE 2 REVIEW AND DEMO PRACTICE
 *
 * Curriculum C2.1 – C2.P. Interleaved practice across price action,
 * technical and fundamental analysis; the phase's commonest mistakes; a
 * guided demo week in which every trade starts from written analysis; and
 * the Phase 2 checkpoint.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s-c2";

/** The Week 4 pin-bar chart mirrored: the same shapes, upside down. */
const PIN_AT_HIGH = [
  [1.085, 1.0862, 1.0847, 1.0859], [1.0859, 1.0871, 1.0856, 1.0868], [1.0868, 1.088, 1.0865, 1.0876],
  [1.0876, 1.0902, 1.0872, 1.0875], [1.0875, 1.0878, 1.0862, 1.0865], [1.0865, 1.0869, 1.0854, 1.0857],
  [1.0857, 1.0863, 1.085, 1.086], [1.086, 1.087, 1.0854, 1.0861],
];
const DOWNTREND = [
  [1.0899, 1.0902, 1.089, 1.0892], [1.0891, 1.0894, 1.0882, 1.0884], [1.0883, 1.0886, 1.0874, 1.0876],
  [1.0877, 1.088, 1.0866, 1.0868], [1.0874, 1.0886, 1.0872, 1.0883], [1.088, 1.0892, 1.0878, 1.0889],
  [1.0885, 1.0888, 1.0874, 1.0876], [1.0875, 1.0878, 1.0864, 1.0866], [1.0867, 1.087, 1.0855, 1.0857],
  [1.0859, 1.0862, 1.0848, 1.085], [1.0856, 1.0868, 1.0854, 1.0865], [1.0862, 1.0874, 1.086, 1.0871],
  [1.0867, 1.087, 1.0856, 1.0858], [1.0857, 1.086, 1.0844, 1.0846], [1.0847, 1.085, 1.0836, 1.0838],
  [1.0839, 1.0842, 1.083, 1.0832],
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     C2.1 — INTERLEAVED PRACTICE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c2-l1-mixed-practice",
    moduleId: "fx-c2-consolidation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["C2.1"],
    title: "Interleaved Practice: Candles, Structure, Averages, ATR and Surprises",
    subtitle: "Phase 2's skills, mixed",
    estimatedMinutes: 18,
    intro:
      "Each exercise below draws on a different week of Phase 2, in no particular order. Decide which tool the question needs before you answer it.",

    atoms: [
      {
        id: "a-fx-c2-bear-pin",
        title: "A bearish pin bar",
        explain:
          "Week 4 had you find a bullish pin bar. Its mirror image, a BEARISH pin bar, has a long UPPER wick (at least 60% of the range), a body of at most 30%, and a lower wick of at most 15%.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "1 hour",
          task: "Select the bearish pin bar.",
          data: PIN_AT_HIGH,
          pattern: "bearish-pin",
          expectCount: 1,
          explain:
            "The fourth candle: a range of 30 pips (1.0872 to 1.0902), an upper wick of 26 pips, a 1-pip body. Higher prices were firmly rejected.",
        },
      },
      {
        id: "a-fx-c2-lower-highs",
        title: "Lower highs",
        explain: "In a downtrend the swing highs are the rallies that failed. Find them by the definition, not by eye.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          task: "Select every swing high on this downtrend chart.",
          data: DOWNTREND,
          pattern: "swing-high",
          expectCount: 2,
          explain: "Two: 1.0892 (sixth candle) and 1.0874 (twelfth). Each lower than the one before: lower highs.",
        },
      },
      {
        id: "a-fx-c2-sma",
        title: "A moving average on a yen pair",
        explain: "Same formula as Week 5; the prices just have fewer decimals.",
        calcExercise: {
          scenario: "USD/JPY's last four closes: 150.12, 150.48, 150.31, 150.66.",
          question: "What is the 4-period SMA, to two decimal places?",
          unit: "",
          answer: 150.39,
          tolerance: 0.005,
          hint: "Add the four closes and divide by four.",
          working: "150.12 + 150.48 + 150.31 + 150.66 = 601.57\n601.57 ÷ 4 = 150.3925 ≈ 150.39",
          check: { fn: "sma", args: { values: [150.12, 150.48, 150.31, 150.66], period: 4 } },
        },
      },
      {
        id: "a-fx-c2-true-range",
        title: "True range after a gap up",
        explain: "Week 5's true range, with the gap in the other direction.",
        calcExercise: {
          scenario: "Previous close 1.2640. Current candle: high 1.2688, low 1.2651.",
          question: "What is the true range, in price terms?",
          unit: "",
          answer: 0.0048,
          tolerance: 0.00005,
          hint: "Largest of: high − low, |high − prev close|, |low − prev close|.",
          working: "High − low = 0.0037\n|1.2688 − 1.2640| = 0.0048\n|1.2651 − 1.2640| = 0.0011\nTrue range = 0.0048 (48 pips)",
          check: { fn: "trueRange", args: { high: 1.2688, low: 1.2651, prevClose: 1.264 } },
        },
      },
      {
        id: "a-fx-c2-surprise",
        title: "Reading a release",
        explain: "Week 6: the surprise is actual minus forecast.",
        decision: {
          scenario: "UK CPI: previous 4.0%, forecast 3.8%, actual 4.1%.",
          question: "What is the surprise, and the usual first reaction in GBP?",
          options: [
            {
              id: "a",
              text: "Upside surprise of 0.3 points; GBP tends to strengthen on higher expected BoE rates",
              why: "Right. 4.1 − 3.8 = +0.3. Hotter inflation than expected makes higher rates more likely.",
            },
            {
              id: "b",
              text: "Downside surprise; GBP weakens",
              whyWrong: "The actual is ABOVE the forecast, so it is an upside surprise.",
            },
            {
              id: "c",
              text: "No surprise, because inflation is roughly unchanged",
              whyWrong: "The comparison that matters is with the forecast, not the previous figure.",
            },
            {
              id: "d",
              text: "GBP must rise exactly 30 pips",
              whyWrong: "There is no fixed conversion from surprise to pips, and reactions can differ.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C2.2 — COMMON MISTAKES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c2-l2-mistakes",
    moduleId: "fx-c2-consolidation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["C2.2"],
    title: "The Most Common Phase 2 Mistakes",
    subtitle: "Analysis errors that look like insight",
    estimatedMinutes: 12,
    intro: "Analysis mistakes are harder to spot than arithmetic ones, because they feel like good judgement. Here are the commonest.",

    atoms: [
      {
        id: "a-fx-c2-mistake-list",
        title: "The list",
        explain:
          "Trading a pattern without context. Calling one candle a trend. Marking levels as exact lines. Loading the chart with indicators that repeat each other. Treating 'overbought' as a sell signal. Trading the first seconds of a news release. Explaining every move after the fact with whichever tool fits.",
        table: {
          caption: "Each mistake and its fix.",
          headers: ["Mistake", "Fix"],
          rows: [
            ["Pattern without context", "Pattern only counts at a pre-marked level, with the higher timeframe"],
            ["One candle = trend", "Trend is defined by swings"],
            ["Exact lines", "Zones, with a buffer"],
            ["Indicator overload", "One fixed toolkit"],
            ["Overbought = sell", "RSI describes momentum, not direction"],
            ["Trading the release", "No entries 30 minutes either side"],
            ["Hindsight stories", "Write the analysis before price moves"],
          ],
        },
      },
      {
        id: "a-fx-c2-mistake-check",
        title: "Spot the mistake",
        explain: "Apply the list.",
        decision: {
          scenario:
            "A learner writes after the fact: 'I knew EUR/USD would fall because RSI was 72, MACD crossed, the Stochastic was overbought, and there was a bearish candle.' They did not write anything before the move.",
          question: "Which mistakes are present?",
          options: [
            {
              id: "a",
              text: "Hindsight story, indicator overload, and treating overbought as a sell signal",
              why: "Right. Three momentum indicators repeat one piece of information, 'overbought' is not a direction, and nothing was written beforehand.",
            },
            {
              id: "b",
              text: "None; four signals agreed",
              whyWrong: "They are all derived from the same prices, and the 'agreement' was noticed only afterwards.",
            },
            {
              id: "c",
              text: "Only that they should have used five indicators",
              whyWrong: "More of the same evidence is not more evidence.",
            },
            {
              id: "d",
              text: "Only that the candle was not a doji",
              whyWrong: "The candle type is not the main problem.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C2.3 — THE GUIDED DEMO WEEK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c2-l3-demo-week",
    moduleId: "fx-c2-consolidation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["C2.3"],
    title: "A Guided Demo Week: Analysis Before Every Trade",
    subtitle: "Write it first, trade it second",
    estimatedMinutes: 10,
    intro:
      "This week, every demo trade starts with a written chart-analysis report and a check of the calendar. You still have no formal strategy; the aim is the habit of analysis before action.",

    atoms: [
      {
        id: "a-fx-c2-week-plan",
        title: "The week",
        explain:
          "Each evening: update your report for two pairs (structure, zones, 50 EMA, RSI, ATR) and check the next day's calendar. Each trading day: at most one demo trade, only at a zone named in the previous evening's report, sized at 1%, never within 30 minutes of high-impact news. Every report and trade is journaled, including the days with no trade.",
      },
      {
        id: "a-fx-c2-week-rule",
        title: "Only pre-marked zones",
        explain: "The rule that keeps analysis honest: you may only act at levels written down BEFORE the session.",
        decision: {
          scenario: "During the day you see GBP/USD bounce sharply from a level you had not marked. It looks like strong support.",
          question: "What does this week's rule say?",
          options: [
            {
              id: "a",
              text: "No trade: the level was not in last night's report. Add it to tonight's analysis if it still matters",
              why: "Right. Levels discovered in the heat of a move are usually found because price is already moving, which is FOMO wearing analysis clothes.",
            },
            {
              id: "b",
              text: "Trade it; a bounce proves it is support",
              whyWrong: "One bounce does not make a significant level, and the rule exists to stop exactly this.",
            },
            {
              id: "c",
              text: "Draw the level now and backdate the report",
              whyWrong: "That falsifies the record.",
            },
            {
              id: "d",
              text: "Trade it at double size because it is so clear",
              whyWrong: "Size is set by risk, and the trade is not allowed in the first place.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C2.4 + C2.P — THE PHASE 2 CHECKPOINT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c2-l4-checkpoint",
    moduleId: "fx-c2-consolidation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["C2.4", "C2.P"],
    title: "The Phase 2 Checkpoint",
    subtitle: "A report and a fundamental note on one pair, before and after",
    estimatedMinutes: 14,
    intro: "The checkpoint asks you to combine technical and fundamental analysis on one pair, write it before the week's events, and review it honestly afterwards.",

    atoms: [
      {
        id: "a-fx-c2-checkpoint-format",
        title: "The checkpoint",
        explain:
          "Choose one pair. On Sunday, write a chart-analysis report (Week 5 template) and the BEFORE half of an announcement note for the week's most important release for that pair (Week 6 template). On Friday, write the AFTER half and a review of the report: which zones held, which broke, and whether your reasoning, not price, was sound. Pass mark 70%.",
        why: "Combining the two kinds of analysis on one pair shows you can hold a whole picture, and reviewing the reasoning rather than the outcome is the habit that Phases 3 and 4 build on.",
      },
      {
        id: "a-fx-c2-checkpoint-review",
        title: "Reviewing reasoning, not outcome",
        explain: "The review grades whether the analysis was well made, not whether price did what you expected.",
        decision: {
          scenario:
            "Your report correctly identified an uptrend and a demand zone. A surprise central bank statement sent price straight through the zone on Wednesday.",
          question: "How should your review judge the report?",
          options: [
            {
              id: "a",
              text: "The analysis was sound; the zone broke on new information no chart could contain. Note how the news affected the structure",
              why: "Right. Good analysis can be overtaken by events. The review asks whether the reasoning was good with what was knowable.",
            },
            {
              id: "b",
              text: "The analysis was wrong because price broke the zone",
              whyWrong: "Judging analysis by outcome alone is the error the whole course warns against.",
            },
            {
              id: "c",
              text: "Delete the report",
              whyWrong: "The record of what you thought beforehand is the point.",
            },
            {
              id: "d",
              text: "Zones never work",
              whyWrong: "One broken zone, on major news, says nothing general.",
            },
          ],
          correct: "a",
        },
      },
    ],

    task: {
      title: "Phase 2 checkpoint",
      intro: "One pair, one week. Writing happens BEFORE the events; the review happens after.",
      prompts: [
        "Sunday: chart-analysis report for your pair (structure, zones, 50 EMA, RSI, ATR).",
        "Sunday: BEFORE half of an announcement note for the week's key release for that pair.",
        "During the week: the guided demo week, at most one trade a day, only at pre-marked zones.",
        "Friday: AFTER half of the announcement note, and a review of the report's reasoning.",
        "Three lines: what you read well, what you missed, one question for Phase 3.",
      ],
      closing: "Phase 3 turns this analysis into rules that someone else could follow.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
