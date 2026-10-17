/**
 * FOREX TRADING · WEEK 5 · TECHNICAL ANALYSIS
 *
 * Curriculum 5.1 – 5.P. Levels and zones, trendlines and moving averages,
 * three indicators (RSI, MACD, ATR) and, deliberately given equal weight,
 * what none of them can do. The practical is a chart-analysis report made
 * with the same small toolkit every time.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s5-technical";

const RANGE = [
  [1.0809, 1.0818, 1.0806, 1.0816], [1.0817, 1.0828, 1.0814, 1.0826], [1.0825, 1.0839, 1.0822, 1.0837],
  [1.0828, 1.083, 1.0816, 1.0819], [1.082, 1.0822, 1.0808, 1.0811], [1.0813, 1.0815, 1.0802, 1.0805],
  [1.081, 1.082, 1.0807, 1.0818], [1.0818, 1.0829, 1.0815, 1.0827], [1.0825, 1.0836, 1.0822, 1.0834],
  [1.0826, 1.0828, 1.0815, 1.0818], [1.0818, 1.082, 1.0808, 1.0811], [1.0812, 1.0814, 1.0804, 1.0807],
  [1.0813, 1.0822, 1.081, 1.082], [1.0819, 1.083, 1.0816, 1.0828], [1.0825, 1.0835, 1.0822, 1.0833],
  [1.083, 1.0832, 1.0819, 1.0822],
];
const UPTREND = [
  [1.0801, 1.081, 1.0798, 1.0808], [1.0809, 1.0818, 1.0806, 1.0816], [1.0817, 1.0826, 1.0814, 1.0824],
  [1.0823, 1.0834, 1.082, 1.0832], [1.0826, 1.0828, 1.0814, 1.0817], [1.082, 1.0822, 1.0808, 1.0811],
  [1.0815, 1.0826, 1.0812, 1.0824], [1.0825, 1.0836, 1.0822, 1.0834], [1.0833, 1.0845, 1.083, 1.0843],
  [1.0841, 1.0852, 1.0838, 1.085], [1.0844, 1.0846, 1.0832, 1.0835], [1.0838, 1.084, 1.0826, 1.0829],
  [1.0833, 1.0844, 1.083, 1.0842], [1.0843, 1.0856, 1.084, 1.0854], [1.0853, 1.0864, 1.085, 1.0862],
  [1.0861, 1.087, 1.0858, 1.0868],
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 5.1 — SUPPORT, RESISTANCE AND ZONES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l14-support-resistance",
    moduleId: "fx-w5-technical",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1"],
    title: "Support, Resistance and Supply/Demand Zones",
    subtitle: "The prices the market remembers",
    estimatedMinutes: 18,
    intro:
      "Price tends to react at levels where it has reacted before, because traders remember them, have orders resting there, and act when price returns. Those levels are the most useful lines you can draw on a chart, as long as you remember they are areas, not exact prices.",

    atoms: [
      {
        id: "a-fx-support-resistance",
        title: "Support and resistance",
        explain:
          "SUPPORT is a price area where falling price has repeatedly stopped and turned up: buyers have been willing to step in there. RESISTANCE is an area where rising price has repeatedly stopped and turned down: sellers have stepped in. You find them by joining swing lows (support) and swing highs (resistance) that line up at similar prices.",
        why: "These levels give your analysis locations: places where a reaction is more likely, which is where patterns gain meaning (Week 4), and where stops and targets naturally sit (Week 8).",
        candles: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          data: RANGE,
          levels: [
            { price: 1.0837, label: "Resistance 1.0835–1.0839", kind: "resistance" },
            { price: 1.0804, label: "Support 1.0802–1.0806", kind: "support" },
          ],
          caption:
            "Price turned down three times between 1.0835 and 1.0839, and up twice between 1.0802 and 1.0806. Notice that none of the turns is at exactly the same price.",
        },
      },
      {
        id: "a-fx-zones",
        title: "Zones, not lines",
        explain:
          "Because price rarely turns at exactly the same price twice, professionals mark levels as ZONES: a band a few pips deep. A DEMAND ZONE is an area from which price rose sharply, suggesting unfilled buy orders were there; a SUPPLY ZONE is an area from which price fell sharply. In TradingView, draw them with the Rectangle tool.",
        why: "Treating a level as an exact line leads to two errors: entering too early because price 'touched' it, and placing a stop just beyond it, where it is easily triggered by normal noise.",
        candles: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          data: UPTREND,
          zones: [
            { from: 1.0808, to: 1.0814, label: "Demand zone (first pullback low)", kind: "support" },
            { from: 1.0826, to: 1.0832, label: "Demand zone (second pullback low)", kind: "support" },
          ],
          caption: "In an uptrend, the areas where pullbacks ended become demand zones the next pullback may respect.",
        },
      },
      {
        id: "a-fx-role-reversal",
        title: "When a level breaks: role reversal",
        explain:
          "When price breaks decisively through resistance, that old resistance often acts as SUPPORT on the next pullback, and broken support often becomes resistance. This is called ROLE REVERSAL. Traders who sold at the old resistance and were proved wrong may buy back there to exit, and those who missed the break may buy the retest.",
        example:
          "ROLE REVERSAL ON GBP/USD\n\n  1.2700  resistance: price turned down here three times\n  → a daily candle closes at 1.2745, decisively above\n  → two days later price pulls back to 1.2705 and turns up again\n  The old ceiling is acting as a floor.",
        mistake:
          "Calling every brief poke above a level a breakout. A wick through the level that closes back below it is a rejection, not a break. Wait for a CLOSE beyond the zone.",
      },
      {
        id: "a-fx-level-strength",
        title: "Which levels matter most",
        explain:
          "Not all levels are equal. A level is more significant when it has been respected several times, when the reactions from it were strong, when it shows up on a higher timeframe, and when it is recent. Round numbers, such as 1.1000 or 150.00, often attract orders too.",
        decision: {
          scenario:
            "You are analysing USD/JPY. Level A: a daily-chart level at 150.00 where price turned down sharply three times in the last two months. Level B: a 15-minute chart level at 149.37 where price paused once this morning.",
          question: "Which level should carry more weight in your analysis?",
          options: [
            {
              id: "a",
              text: "Level A: higher timeframe, several strong reactions, recent and a round number",
              why: "Right. Every factor that makes a level significant points to Level A.",
            },
            {
              id: "b",
              text: "Level B, because it is closer to the current price",
              whyWrong: "Closeness makes a level relevant soon, not significant. One pause on a 15-minute chart is weak evidence.",
            },
            {
              id: "c",
              text: "They are equal; a level is a level",
              whyWrong: "Levels differ greatly in how many participants watch them and how strongly price has reacted.",
            },
            {
              id: "d",
              text: "Neither; support and resistance do not work in forex",
              whyWrong: "No level guarantees a reaction, but the tendency for price to react at well-watched levels is one of the most widely used ideas in trading.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 5.2 — TRENDLINES AND MOVING AVERAGES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l15-trendlines-mas",
    moduleId: "fx-w5-technical",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.2"],
    title: "Trendlines, Moving Averages and Market Structure",
    subtitle: "Two ways of seeing the trend, and how they relate to swings",
    estimatedMinutes: 18,
    intro:
      "Market structure (Week 4) defines a trend from swing points. Trendlines and moving averages are two other ways to see it: one drawn by hand, one calculated. Both are useful, both are imperfect, and both should agree with the swings before you trust them.",

    atoms: [
      {
        id: "a-fx-trendlines",
        title: "Trendlines",
        explain:
          "An uptrend line joins two or more higher LOWS and is extended to the right; a downtrend line joins lower HIGHS. In TradingView use the Trend Line tool and snap it to the wicks or bodies, consistently. A line touched three or more times is more widely watched than one touched twice.",
        why: "A trendline gives the trend a visible slope and a dynamic level: in an uptrend, pullbacks to the line are where buyers may step in.",
        mistake:
          "Redrawing the line every time price breaks it so that the trend 'continues'. Two traders often draw different lines on the same chart, which is why this course uses swing structure as the definition of trend and trendlines only as a picture of it.",
      },
      {
        id: "a-fx-sma",
        title: "The simple moving average",
        explain:
          "A SIMPLE MOVING AVERAGE (SMA) is the average closing price of the last N candles, recalculated as each new candle closes, and drawn as a line. A 20-period SMA on the 4-hour chart averages the last 20 four-hour closes. It smooths out noise, so the direction of the line shows the trend, and price above a rising average is a sign of an uptrend.",
        calcExercise: {
          scenario: "The last five closes of EUR/USD were 1.0820, 1.0832, 1.0828, 1.0841 and 1.0839.",
          question: "What is the 5-period simple moving average? Give it to four decimal places.",
          unit: "",
          answer: 1.0832,
          tolerance: 0.00005,
          hint: "Add the five closes and divide by five.",
          working: "1.0820 + 1.0832 + 1.0828 + 1.0841 + 1.0839 = 5.4160\n5.4160 ÷ 5 = 1.0832",
          check: { fn: "sma", args: { values: [1.082, 1.0832, 1.0828, 1.0841, 1.0839], period: 5 } },
        },
      },
      {
        id: "a-fx-ema",
        title: "Exponential averages and common settings",
        explain:
          "An EXPONENTIAL MOVING AVERAGE (EMA) also averages recent prices, but gives the most recent ones more weight, so it reacts faster. Common choices: the 20 EMA for the short-term trend, the 50 for the medium term and the 200 on the daily chart for the long term. In MT5 add them from Insert → Indicators → Trend → Moving Average; in TradingView, from Indicators.",
        table: {
          caption: "SMA and EMA compared.",
          headers: ["", "SMA", "EMA"],
          rows: [
            ["Weights", "Every close equally", "Recent closes more"],
            ["Reacts to a turn", "Slower", "Faster"],
            ["False signals in choppy markets", "Fewer", "More"],
          ],
        },
      },
      {
        id: "a-fx-ma-structure",
        title: "Averages and structure together",
        explain:
          "Moving averages LAG: they are made of past prices, so they always confirm a trend after it has started and a turn after it has happened. Use them as a summary and a filter, for example 'only look for buys while price is above a rising 50 EMA', and use swing structure for the precise picture.",
        candles: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          data: UPTREND,
          ma: 5,
          caption:
            "A 5-period SMA on the uptrend from Week 4. The average rises with the swings but turns later than price at every pullback.",
        },
        decision: {
          scenario:
            "Price on EUR/USD's 4-hour chart is below a falling 50 EMA, and the last two swing highs and lows are both lower. A strong bullish candle has just closed.",
          question: "What is the most reasonable reading?",
          options: [
            {
              id: "a",
              text: "The trend has reversed up",
              whyWrong: "One candle does not change structure. The swings and the average both say downtrend.",
            },
            {
              id: "b",
              text: "The downtrend is intact; this may be a pullback, and only a break of structure would change that",
              why: "Right. Structure and the moving average agree, and a single candle is not a break of structure.",
            },
            {
              id: "c",
              text: "The 50 EMA is wrong because it lags",
              whyWrong: "Lag is a property of the average, not an error. Here it agrees with the swings, which is useful confirmation.",
            },
            {
              id: "d",
              text: "Buy, because price is far below the average and must return to it",
              whyWrong: "Nothing obliges price to return to an average. In strong trends it can stay away for a long time.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 5.3 + 5.P — RSI, MACD, ATR AND THEIR LIMITS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l16-indicators",
    moduleId: "fx-w5-technical",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.3", "5.P"],
    title: "RSI, MACD, ATR and Indicator Limitations",
    subtitle: "Useful summaries of price, never predictions",
    estimatedMinutes: 22,
    intro:
      "Indicators are formulas applied to price. They can summarise momentum and volatility very usefully, and they are sold, endlessly, as secret keys to the market. This lesson teaches three that professionals actually use, and spends as long on what they cannot do.",

    atoms: [
      {
        id: "a-fx-rsi",
        title: "RSI: momentum on a 0–100 scale",
        explain:
          "The RELATIVE STRENGTH INDEX (RSI), usually over 14 periods, compares the size of recent up-moves with recent down-moves and expresses the result between 0 and 100. Above 70 is conventionally called OVERBOUGHT, below 30 OVERSOLD. A DIVERGENCE is when price makes a new high but RSI makes a lower high, suggesting momentum is fading.",
        why: "RSI tells you how strong recent movement has been. It does not tell you that price must reverse. In a strong uptrend RSI can stay above 70 for days while price keeps rising.",
        decision: {
          scenario:
            "EUR/USD's daily chart shows a clear uptrend: higher highs and higher lows for six weeks. RSI(14) has just risen to 74.",
          question: "What does the RSI reading justify?",
          options: [
            {
              id: "a",
              text: "Selling now, because the market is overbought",
              whyWrong: "'Overbought' is a description of strong momentum, not a sell signal. Selling a strong uptrend on that basis alone fights the trend.",
            },
            {
              id: "b",
              text: "Noting that momentum is strong; it says nothing certain about the next move",
              why: "Right. In a trend, high RSI often just confirms the trend. It may be a reason not to chase a new buy far from support, but not a reason to sell.",
            },
            {
              id: "c",
              text: "Buying more, because RSI above 70 means the trend is guaranteed to continue",
              whyWrong: "Nothing is guaranteed by an indicator. Strong momentum can end abruptly.",
            },
            {
              id: "d",
              text: "Removing the indicator, because it is useless",
              whyWrong: "It is not useless; it is being misread. Its job is to describe momentum, which it is doing.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-macd",
        title: "MACD: the gap between two averages",
        explain:
          "MACD (moving average convergence divergence) is the 12-period EMA minus the 26-period EMA. A 9-period EMA of that difference is drawn as the SIGNAL line, and the gap between MACD and its signal is shown as a HISTOGRAM. MACD above zero means the short-term average is above the long-term one: upward momentum.",
        why: "MACD summarises trend and momentum in one panel. Because it is built from moving averages, it inherits their lag: its crossovers come after the move has begun, and in ranges it gives many false crossovers.",
        table: {
          caption: "Reading MACD.",
          headers: ["Reading", "Means"],
          rows: [
            ["MACD above zero and rising", "Upward momentum strengthening"],
            ["MACD crosses above its signal line", "Momentum turning up (late, by construction)"],
            ["Histogram shrinking", "Momentum fading in the current direction"],
            ["Many crossovers close to zero", "No trend: probably a range"],
          ],
        },
      },
      {
        id: "a-fx-atr",
        title: "ATR: how far price typically moves",
        explain:
          "The AVERAGE TRUE RANGE (ATR), usually over 14 periods, measures volatility: how far price typically moves per candle. Each candle's TRUE RANGE is the largest of three distances: high to low, high to the previous close, and low to the previous close. That captures gaps. ATR is the average of those true ranges. It says nothing about direction.",
        why: "ATR is the most practical indicator for a risk manager. A stop-loss tighter than one ATR is inside normal noise and likely to be hit for no reason; in Week 8 you will place stops beyond structure with an ATR buffer.",
        calcExercise: {
          scenario:
            "The previous candle closed at 1.0870. The current candle's high is 1.0862 and its low is 1.0838.",
          question: "What is the current candle's true range, in price terms (for example 0.0015)?",
          unit: "",
          answer: 0.0032,
          tolerance: 0.00005,
          hint: "Calculate high − low, |high − previous close| and |low − previous close|. The true range is the largest.",
          working:
            "High − low: 1.0862 − 1.0838 = 0.0024\n|High − prev close|: |1.0862 − 1.0870| = 0.0008\n|Low − prev close|: |1.0838 − 1.0870| = 0.0032\nTrue range = 0.0032 (32 pips): the gap down from the previous close counts.",
          check: { fn: "trueRange", args: { high: 1.0862, low: 1.0838, prevClose: 1.087 } },
        },
      },
      {
        id: "a-fx-indicator-limits",
        title: "What indicators cannot do",
        explain:
          "Every indicator on a price chart is calculated from the same open, high, low and close you can already see. They cannot know anything price does not; most of them lag; adding more of them does not add independent evidence, because they are all derived from the same data; and settings tuned until an indicator looked perfect on past charts usually stop working on future ones.",
        why: "Beginners often load a chart with five or six indicators and wait for them all to agree. That rarely happens, and when it does the move is usually over. A few tools, understood well and used the same way every time, beat a crowded chart.",
        decision: {
          scenario:
            "A seller on Instagram offers an indicator for ₦150,000 that 'shows buy and sell arrows with 95% accuracy'. The screenshots show arrows at every top and bottom.",
          question: "What is the most likely explanation of those perfect arrows?",
          options: [
            {
              id: "a",
              text: "It has found a genuine edge the banks have missed",
              whyWrong: "An indicator using the same price data as everyone else, sold for a few hundred dollars, is very unlikely to beat every bank's research team.",
            },
            {
              id: "b",
              text: "The arrows repaint: they are drawn or moved after the fact, so they look perfect on history but cannot be traded live",
              why: "Very likely. 'Repainting' indicators recalculate past signals using later prices. On a historical chart they look flawless; in real time the arrows appear late or disappear.",
            },
            {
              id: "c",
              text: "95% accuracy is normal for good indicators",
              whyWrong: "No honest indicator is 95% accurate. And accuracy alone is meaningless without the size of wins and losses.",
            },
            {
              id: "d",
              text: "Indicators are always perfect in hindsight, so it must be real",
              whyWrong: "Being perfect in hindsight is exactly the warning sign, not the proof.",
            },
          ],
          correct: "b",
          aftermath:
            "Test any indicator yourself with TradingView's Bar Replay in Week 9, revealing one candle at a time. Repainting indicators fail that test immediately.",
        },
      },
      {
        id: "a-fx-practical-report",
        title: "Practical: a consistent chart-analysis report",
        explain:
          "This week's practical is a one-page analysis report built with the SAME toolkit every time: swing structure, two or three support and resistance zones, one moving average, and ATR. Using the same tools on every chart is what makes your analysis repeatable, and repeatability is what makes it testable later.",
        example:
          "CHART-ANALYSIS REPORT — template\n\n  Pair / timeframe:     EUR/USD, H4         Date (Lagos): 2026-10-23\n  Structure:            Uptrend. HH 1.0852 > 1.0834, HL 1.0826 > 1.0808\n  50 EMA:               Rising; price above it\n  Key zones:            Resistance 1.0870–1.0875 · Demand 1.0826–1.0832\n  ATR(14):              18 pips\n  Momentum (RSI 14):    61, no divergence\n  Summary:              Uptrend intact. Interesting area for buys: a pullback\n                        into 1.0826–1.0832. Structure breaks below 1.0826.\n  Not a trade signal — analysis only.",
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "On TradingView, with the same toolkit on every chart: swing structure, zones, the 50 EMA, RSI(14) and ATR(14). No other indicators.",
      prompts: [
        "Write a chart-analysis report, using the template, for EUR/USD, GBP/USD and USD/JPY on the 4-hour chart.",
        "Draw support and resistance as zones with the Rectangle tool. For each, write how many times it was respected and on which timeframe it appears.",
        "Find one example of role reversal on any of the three pairs and screenshot it.",
        "Find one moment where RSI was above 70 or below 30 and price kept going. Write two sentences on what that teaches you.",
        "Revisit your reports at the end of the week. Without judging whether price 'did what you expected', check: did you apply the same tools in the same way each time?",
      ],
      closing: "Your reports are not predictions. They are the starting point for the rule-based strategy you write in Week 8.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
