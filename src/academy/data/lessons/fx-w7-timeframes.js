/**
 * FOREX TRADING · WEEK 7 · MULTI-TIMEFRAME ANALYSIS
 *
 * Curriculum 7.1 – 7.P. Trading styles and the timeframes each one uses;
 * reading context on a higher timeframe and timing entries on a lower one;
 * and the three things every trade idea needs before it is a plan: aligned
 * timeframes, an entry condition and an invalidation level.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s7-timeframes";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 7.1 — TRADING STYLES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l20-trading-styles",
    moduleId: "fx-w7-timeframes",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1"],
    title: "Scalping, Day Trading, Swing Trading and Position Trading",
    subtitle: "Choosing a style that fits your life, not your hopes",
    estimatedMinutes: 15,
    intro:
      "There is no best trading style, only one that fits the time you have, the costs you pay and your temperament. Most beginners are drawn to the fastest style because it looks exciting. For most of them, with jobs, studies or families, it is the worst possible choice.",

    atoms: [
      {
        id: "a-fx-styles",
        title: "Four styles",
        explain:
          "Styles are defined by how long a trade is held. SCALPERS hold for seconds to minutes and aim for a few pips. DAY TRADERS open and close within one day. SWING TRADERS hold for several days to a few weeks, aiming to catch one swing of a trend. POSITION TRADERS hold for weeks to months, mainly on fundamentals and the daily or weekly chart.",
        table: {
          caption: "The styles side by side.",
          headers: ["Style", "Holding period", "Main charts", "Typical stop", "Screen time"],
          rows: [
            ["Scalping", "Seconds – minutes", "M1, M5", "A few pips", "Many focused hours a day"],
            ["Day trading", "Minutes – hours", "M15, H1", "10 – 40 pips", "Several hours in one session"],
            ["Swing trading", "Days – weeks", "H4, D1", "40 – 150 pips", "30–60 minutes a day"],
            ["Position trading", "Weeks – months", "D1, W1", "150+ pips", "A few hours a week"],
          ],
        },
      },
      {
        id: "a-fx-style-costs",
        title: "Costs and style",
        explain:
          "The shorter the style, the more trades, and the larger the costs relative to each trade's risk. A 1.5-pip cost is 30% of a 5-pip scalp's risk but under 3% of a 60-pip swing trade's. Swing and position traders also pay or receive SWAP on every night held, which must be counted.",
        why: "This is arithmetic, not opinion, and it is why scalping is so difficult for retail traders: their costs are much higher than those of banks and professional firms competing for the same few pips.",
      },
      {
        id: "a-fx-choosing-style",
        title: "Choosing a style",
        explain:
          "Choose the style that matches your available time and lets you follow your rules calmly. If you cannot watch the screen during the London session, you cannot day trade it. If you check your phone every five minutes at work, a style with trades open during work hours will damage both.",
        decision: {
          scenario:
            "Chidi is a bank officer in Abuja, at work from 08:00 to 17:00 with little phone access. He has about an hour each evening and more at weekends. He wants to practise on his demo account.",
          question: "Which style suits him best?",
          options: [
            {
              id: "a",
              text: "Scalping during his breaks",
              whyWrong: "Scalping needs long, uninterrupted focus and the best possible costs. A few minutes in a break are the worst conditions for it.",
            },
            {
              id: "b",
              text: "Swing trading on the 4-hour and daily charts, analysed in the evening, with pending orders and stop-losses set in advance",
              why: "Right. Analysis fits his evening hour, pending orders work while he is at his desk, and stops protect him without needing to watch.",
            },
            {
              id: "c",
              text: "Day trading the London–New York overlap",
              whyWrong: "That window, roughly 14:00–18:00 in Lagos and Abuja, is when he is at work.",
            },
            {
              id: "d",
              text: "Whichever style makes the most money",
              whyWrong: "No style makes money by itself. The one he can execute consistently is the one with any chance.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 7.2 — CONTEXT AND EXECUTION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l21-top-down",
    moduleId: "fx-w7-timeframes",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.2"],
    title: "Higher-Timeframe Context, Lower-Timeframe Execution",
    subtitle: "Top-down analysis",
    estimatedMinutes: 16,
    intro:
      "A one-hour chart can show a perfect uptrend that is just a small bounce inside a daily downtrend. Looking at one timeframe alone is like reading one sentence of a book. Top-down analysis reads the chapter first.",

    atoms: [
      {
        id: "a-fx-top-down",
        title: "Top-down analysis",
        explain:
          "In TOP-DOWN analysis you start on a HIGHER timeframe to establish the context: the main trend and the major levels. Then you move to a MIDDLE timeframe for the setup, and finally a LOWER timeframe to time the entry. A common rule of thumb is that each timeframe is four to six times the next: D1 → H4 → H1 for swing trading, or H4 → H1 → M15 for day trading.",
        why: "The higher timeframe tells you which side of the market to favour and where the big levels are. The lower timeframe lets you enter with a tighter, more precise stop than the higher one would allow.",
        table: {
          caption: "The three roles. Swing-trading example.",
          headers: ["Timeframe", "Role", "Question it answers"],
          rows: [
            ["Daily (D1)", "Context", "What is the main trend? Where are the big levels?"],
            ["4-hour (H4)", "Setup", "Is price in an area where my strategy would act?"],
            ["1-hour (H1)", "Execution", "Has the entry condition happened? Where exactly is my stop?"],
          ],
        },
      },
      {
        id: "a-fx-timeframe-conflict",
        title: "When timeframes disagree",
        explain:
          "Timeframes often disagree: a daily uptrend with an hourly downtrend is simply a pullback seen up close. The usual principle is to trade in the direction of the higher timeframe and use the lower one's moves against it as opportunities to enter at a better price.",
        decision: {
          scenario:
            "GBP/USD daily: clear downtrend, lower highs and lower lows. 1-hour: a strong rally of 80 pips over the last day, making higher highs. Price is now approaching a daily resistance zone at 1.2700.",
          question: "What does top-down analysis suggest?",
          options: [
            {
              id: "a",
              text: "Buy: the 1-hour trend is up",
              whyWrong: "The 1-hour rally is happening inside a daily downtrend and is running into daily resistance. Buying fights the bigger picture at its strongest level.",
            },
            {
              id: "b",
              text: "Watch for signs of the 1-hour rally failing at the daily resistance, as a possible sell in the daily trend's direction",
              why: "Right. The higher timeframe gives the direction and the level; the lower timeframe's rally into it is the opportunity, if it shows signs of failing.",
            },
            {
              id: "c",
              text: "Sell immediately at market, before price reaches resistance",
              whyWrong: "The setup needs price to reach the level and show it is failing. Selling now acts before either has happened.",
            },
            {
              id: "d",
              text: "Ignore the daily chart; only the timeframe you trade on matters",
              whyWrong: "Ignoring the higher timeframe is how traders end up buying the top of a pullback in a downtrend.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-mtf-levels",
        title: "Higher-timeframe levels outrank lower ones",
        explain:
          "When levels from different timeframes are close to each other, the higher timeframe's level usually matters more, because more participants are watching it. An hourly resistance just below a daily resistance is the daily one's front edge, not a separate level.",
        mistake:
          "Placing a target just beyond a daily resistance because the hourly chart shows clear space. The daily level is where the trade is most likely to stall; place the target before it.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 7.3 + 7.P — ALIGNMENT, ENTRY, INVALIDATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l22-alignment-invalidation",
    moduleId: "fx-w7-timeframes",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.3", "7.P"],
    title: "Aligning Trends, Entry Conditions and Invalidation Levels",
    subtitle: "Three things every trade idea needs before it is a plan",
    estimatedMinutes: 20,
    intro:
      "A trade idea becomes a plan when you can answer three questions in writing. Do the timeframes support it? What exactly must happen before I enter? At what price is the idea wrong? This lesson answers them, then turns a plan into a correctly sized order.",

    atoms: [
      {
        id: "a-fx-alignment",
        title: "Alignment",
        explain:
          "A trade is ALIGNED when the higher-timeframe trend, the setup timeframe and the entry signal all point the same way. A long trade in a daily uptrend, from an H4 demand zone, triggered by an H1 bullish engulfing, is aligned. The same H1 signal in a daily downtrend is not.",
        why: "Alignment does not make a trade win; it removes one common reason for losing: fighting the larger flow of money for a small move.",
      },
      {
        id: "a-fx-entry-conditions",
        title: "Entry conditions",
        explain:
          "An ENTRY CONDITION is the specific event that must happen before you enter: 'an H1 candle closes above the high of the bullish pin bar', 'price reaches the zone and an H1 bearish engulfing forms'. It must be observable on the chart, so that you either clearly have it or clearly do not.",
        mistake:
          "Entering because a setup 'looks like it is about to' trigger. Anticipating the condition is how most impulsive trades start.",
      },
      {
        id: "a-fx-invalidation",
        title: "Invalidation: where the idea is wrong",
        explain:
          "The INVALIDATION LEVEL is the price at which your reason for the trade no longer holds. For a buy from a demand zone in an uptrend, it is usually just beyond the zone or the last higher low: if price closes there, the uptrend's structure is broken. Your stop-loss goes beyond the invalidation level, never at an arbitrary number of pips.",
        why: "This is what links analysis to risk. Structure decides where the stop goes; Week 3's formula then decides the lot size. Neither decision is made by how much you want to make.",
        ticketExercise: {
          task:
            "Plan, on a $1,000 account risking exactly 1%: GBP/USD is in a daily downtrend and is rallying towards daily resistance at 1.26800. You will SELL at 1.26800 if price gets there. The idea is invalid above 1.27000, so the stop goes there. Target: 1.26200. Work out the lot size and place the pending order.",
          pair: "GBP/USD",
          bid: 1.26418,
          ask: 1.26436,
          balance: 1000,
          leverage: 30,
          riskPercent: 1,
          expect: { type: "sell-limit", side: "sell", lots: 0.05, entry: 1.268, sl: 1.27, tp: 1.262 },
          explain:
            "A Sell Limit, because you are selling ABOVE the current price. The stop is 20 pips above the entry: $10 ÷ (20 × $10) = 0.05 lots. The target is 60 pips away: 3R.",
        },
      },
      {
        id: "a-fx-practical-mtf",
        title: "Practical: a three-timeframe written analysis",
        explain:
          "This week's practical is a written top-down analysis of one pair on three timeframes, ending with either a complete plan (direction, entry condition, invalidation, stop, target, lot size) or the explicit conclusion that there is no trade. 'No trade' is a valid and frequent answer.",
        example:
          "THREE-TIMEFRAME ANALYSIS — template\n\n  Pair: EUR/USD                    Date (Lagos): 2026-11-02\n  D1  Context:   Uptrend (HH 1.0950 > 1.0890, HL 1.0820 > 1.0760).\n                 Resistance 1.0990–1.1000 (round number, two rejections).\n  H4  Setup:     Pulling back into demand 1.0880–1.0890 (previous breakout level).\n  H1  Execution: Waiting for an H1 bullish engulfing or pin bar inside the zone.\n  Plan:          Buy on a close above the signal candle's high.\n                 Invalidation: H4 close below 1.0870 → stop at 1.0865.\n                 Target: 1.0980, before daily resistance.\n                 Size: calculator, 1% risk.\n  Or:            If no signal forms in the zone by Friday — no trade.",
        decision: {
          scenario:
            "Your analysis: D1 uptrend; H4 price in a demand zone; H1 has formed a bullish pin bar inside the zone, but the high-impact US CPI release is in 15 minutes.",
          question: "What does your written plan say to do?",
          options: [
            {
              id: "a",
              text: "Enter now; three timeframes are aligned",
              whyWrong: "Alignment is necessary but not sufficient. Your news filter from Week 6 says no new entries in the minutes around a high-impact release.",
            },
            {
              id: "b",
              text: "Wait; reassess after the release once spreads normalise, and only enter if the setup is still valid",
              why: "Right. A plan includes its filters. The setup may still be there afterwards, or CPI may have changed everything.",
            },
            {
              id: "c",
              text: "Enter with a wider stop to survive the news",
              whyWrong: "Widening the stop to fit the situation reverses the order of decisions, and does not protect against slippage at the release.",
            },
            {
              id: "d",
              text: "Abandon multi-timeframe analysis because the news makes it useless",
              whyWrong: "News is a temporary condition. The analysis remains useful; the timing must respect the release.",
            },
          ],
          correct: "b",
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro: "Use your saved TradingView layout and the template above. Write it in your journal before looking at what price does next.",
      prompts: [
        "Choose the trading style that fits your week, and write two sentences explaining why, including the hours you will analyse and the hours you cannot watch the screen.",
        "Produce a written three-timeframe analysis of one pair (D1, H4, H1, or H4, H1, M15 if you day trade).",
        "End it with a complete plan, including entry condition, invalidation, stop, target and lot size from your calculator, or with an explicit 'no trade' and the reason.",
        "If the plan triggers, place it on your demo account exactly as written, as a pending order where possible.",
        "Repeat the analysis on a second pair. Note whether the two pairs' trades would be in the same currency direction (you will need this in Week 12).",
      ],
      closing: "Judge this week's work on the analysis, not on whether a trade won. A well-reasoned 'no trade' is a good result.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
