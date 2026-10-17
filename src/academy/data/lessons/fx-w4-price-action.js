/**
 * FOREX TRADING · WEEK 4 · CANDLESTICKS AND PRICE ACTION
 *
 * Curriculum 4.1 – 4.P. What a candle records, the handful of patterns worth
 * knowing, and market structure: swing highs and lows, trends and ranges.
 * No trades are placed this week. The practical is annotation only.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every chart is drawn from the [open, high, low, close] arrays below. The
 * pattern a learner is asked to find is defined in lib/academy/forex/engine.js
 * (PATTERNS), the correct candles are COMPUTED from that definition, and the
 * build checks each exercise has exactly the number of matches the author
 * expects. A trend chart's `expectStructure` is checked the same way.
 */

export const SECTION_ID = "fx-s4-price-action";

/* Shared charts. Prices are EUR/USD. */
const MIXED = [
  [1.08, 1.0815, 1.0795, 1.0812], [1.0812, 1.0826, 1.0808, 1.0822], [1.0822, 1.083, 1.081, 1.0814],
  [1.0814, 1.0828, 1.0806, 1.0815], [1.0815, 1.082, 1.0798, 1.0802], [1.0802, 1.0812, 1.0796, 1.0809],
  [1.0809, 1.0824, 1.0805, 1.0821], [1.0821, 1.0827, 1.0812, 1.0816],
];
const REVERSAL_UP = [
  [1.086, 1.0864, 1.0846, 1.085], [1.085, 1.0853, 1.0836, 1.084], [1.084, 1.0844, 1.0826, 1.083],
  [1.083, 1.0838, 1.0822, 1.0835], [1.0835, 1.0837, 1.082, 1.0824], [1.0822, 1.0845, 1.0818, 1.0842],
  [1.0842, 1.0855, 1.0838, 1.0851], [1.0851, 1.0858, 1.0844, 1.0847], [1.0847, 1.0856, 1.0843, 1.085],
];
const REVERSAL_DOWN = [
  [1.08, 1.0814, 1.0797, 1.0811], [1.0811, 1.0824, 1.0808, 1.0821], [1.0821, 1.0833, 1.0818, 1.083],
  [1.083, 1.0841, 1.0826, 1.0836], [1.0838, 1.0842, 1.0815, 1.0818], [1.0818, 1.0824, 1.0806, 1.081],
  [1.081, 1.0818, 1.0803, 1.0815], [1.0815, 1.0817, 1.0806, 1.0812],
];
const PIN_AT_LOW = [
  [1.085, 1.0853, 1.0838, 1.0841], [1.0841, 1.0844, 1.0829, 1.0832], [1.0832, 1.0835, 1.082, 1.0824],
  [1.0824, 1.0828, 1.0798, 1.0825], [1.0825, 1.0838, 1.0822, 1.0835], [1.0835, 1.0846, 1.0831, 1.0843],
  [1.0843, 1.085, 1.0837, 1.084], [1.084, 1.0846, 1.083, 1.0839],
];
const UPTREND = [
  [1.0801, 1.081, 1.0798, 1.0808], [1.0809, 1.0818, 1.0806, 1.0816], [1.0817, 1.0826, 1.0814, 1.0824],
  [1.0823, 1.0834, 1.082, 1.0832], [1.0826, 1.0828, 1.0814, 1.0817], [1.082, 1.0822, 1.0808, 1.0811],
  [1.0815, 1.0826, 1.0812, 1.0824], [1.0825, 1.0836, 1.0822, 1.0834], [1.0833, 1.0845, 1.083, 1.0843],
  [1.0841, 1.0852, 1.0838, 1.085], [1.0844, 1.0846, 1.0832, 1.0835], [1.0838, 1.084, 1.0826, 1.0829],
  [1.0833, 1.0844, 1.083, 1.0842], [1.0843, 1.0856, 1.084, 1.0854], [1.0853, 1.0864, 1.085, 1.0862],
  [1.0861, 1.087, 1.0858, 1.0868],
];
const DOWNTREND = [
  [1.0899, 1.0902, 1.089, 1.0892], [1.0891, 1.0894, 1.0882, 1.0884], [1.0883, 1.0886, 1.0874, 1.0876],
  [1.0877, 1.088, 1.0866, 1.0868], [1.0874, 1.0886, 1.0872, 1.0883], [1.088, 1.0892, 1.0878, 1.0889],
  [1.0885, 1.0888, 1.0874, 1.0876], [1.0875, 1.0878, 1.0864, 1.0866], [1.0867, 1.087, 1.0855, 1.0857],
  [1.0859, 1.0862, 1.0848, 1.085], [1.0856, 1.0868, 1.0854, 1.0865], [1.0862, 1.0874, 1.086, 1.0871],
  [1.0867, 1.087, 1.0856, 1.0858], [1.0857, 1.086, 1.0844, 1.0846], [1.0847, 1.085, 1.0836, 1.0838],
  [1.0839, 1.0842, 1.083, 1.0832],
];
const RANGE = [
  [1.0809, 1.0818, 1.0806, 1.0816], [1.0817, 1.0828, 1.0814, 1.0826], [1.0825, 1.0839, 1.0822, 1.0837],
  [1.0828, 1.083, 1.0816, 1.0819], [1.082, 1.0822, 1.0808, 1.0811], [1.0813, 1.0815, 1.0802, 1.0805],
  [1.081, 1.082, 1.0807, 1.0818], [1.0818, 1.0829, 1.0815, 1.0827], [1.0825, 1.0836, 1.0822, 1.0834],
  [1.0826, 1.0828, 1.0815, 1.0818], [1.0818, 1.082, 1.0808, 1.0811], [1.0812, 1.0814, 1.0804, 1.0807],
  [1.0813, 1.0822, 1.081, 1.082], [1.0819, 1.083, 1.0816, 1.0828], [1.0825, 1.0835, 1.0822, 1.0833],
  [1.083, 1.0832, 1.0819, 1.0822],
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 4.1 — OHLC, BODIES AND WICKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l11-candle-anatomy",
    moduleId: "fx-w4-price-action",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1"],
    title: "Open, High, Low and Close",
    subtitle: "What one candle tells you, and what it does not",
    estimatedMinutes: 15,
    intro:
      "A candlestick chart is the most common way traders look at price, on MT5, on TradingView and almost everywhere else. Each candle summarises everything that happened in one period in four numbers. Reading those four numbers fluently is the base of everything in Phase 2.",

    atoms: [
      {
        id: "a-fx-ohlc",
        title: "Four prices per candle",
        explain:
          "Each candle covers one period of time, such as one hour, and records four prices: the OPEN (the first price of the period), the HIGH (the highest), the LOW (the lowest) and the CLOSE (the last). Together they are called OHLC. The candles run left to right, oldest to newest; the one on the far right is still forming until its period ends.",
        why: "A line chart shows only closes. A candle also shows how far price travelled within the period and where it ended relative to where it started, which is information about who was in control: buyers or sellers.",
        candles: {
          pair: "EUR/USD",
          timeframe: "1 hour",
          data: MIXED,
          labels: { 0: "1", 3: "4", 4: "5" },
          caption:
            "Eight one-hour candles. Green candles closed above their open; red candles closed below it. Candle 4 opened and closed at almost the same price, 1.0814 and 1.0815.",
        },
      },
      {
        id: "a-fx-body-wick",
        title: "Body and wicks",
        explain:
          "The thick part of a candle is the BODY: the range between the open and the close. The thin lines above and below are WICKS, also called shadows: they show prices that were reached during the period but not held at the close. A long upper wick means price went up and was pushed back down; a long lower wick, that price went down and was pushed back up.",
        why: "Wicks are where you see rejection. A candle with a long lower wick at a level where price has turned up before tells you buyers defended that level again during the period, even though you never saw it happen.",
        decision: {
          scenario:
            "An hourly EUR/USD candle opened at 1.0820, rose to 1.0848, and closed at 1.0823. Its low was 1.0817.",
          question: "What does this candle mostly show?",
          options: [
            {
              id: "a",
              text: "Strong buying: price rose 28 pips",
              whyWrong: "Price did reach 28 pips above the open, but it did not stay there. The close is only 3 pips above the open.",
            },
            {
              id: "b",
              text: "Buyers pushed price up, and sellers pushed it nearly all the way back: a long upper wick of rejection",
              why: "Right. The upper wick runs from 1.0823 to 1.0848, 25 pips, against a body of 3 pips. The higher prices were rejected.",
            },
            {
              id: "c",
              text: "Strong selling: the candle is red",
              whyWrong: "It closed above its open (1.0823 > 1.0820), so it is a small bullish candle, not a red one.",
            },
            {
              id: "d",
              text: "Nothing at all; a single candle has no information",
              whyWrong: "A single candle carries real information about the period. What it does not carry is certainty about the next one.",
            },
          ],
          correct: "b",
          aftermath: "One candle is a clue, never a signal on its own. Where it appears, its context, matters more than its shape.",
        },
      },
      {
        id: "a-fx-timeframes-candles",
        title: "Timeframes",
        explain:
          "The same price history can be drawn with candles of any length: one minute (M1), five (M5), fifteen (M15), one hour (H1), four hours (H4), one day (D1) or one week (W1). Change the timeframe in MT5 with the buttons on the toolbar, or in TradingView with the interval menu at the top left. One daily candle contains the same information as twenty-four hourly candles, compressed.",
        why: "A strong-looking hourly candle can be a tiny wiggle on the daily chart. Week 7 is about using several timeframes together; for now, always note which timeframe you are looking at before you describe what you see.",
        table: {
          caption: "Common timeframes and what one candle covers.",
          headers: ["Code", "One candle =", "Typical use"],
          rows: [
            ["M1, M5", "1 or 5 minutes", "Very short-term trading; noisy"],
            ["M15, H1", "15 minutes or 1 hour", "Day trading, entry timing"],
            ["H4", "4 hours", "Swing trading; a good balance for beginners"],
            ["D1", "1 day", "The main trend; swing and position trading"],
            ["W1", "1 week", "The big picture"],
          ],
        },
      },
      {
        id: "a-fx-doji",
        title: "Small bodies: the doji",
        explain:
          "When the open and close are almost equal, the body is tiny compared with the candle's range. That candle is a DOJI. In this course a candle counts as a doji when its body is no more than one tenth of its range, high to low. A doji shows that neither buyers nor sellers won the period: indecision.",
        why: "Indecision after a long move can be the first sign that the move is tiring; indecision in the middle of a quiet range means nothing at all. Again: context.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "1 hour",
          task: "Select the doji on this chart: the candle whose body is no more than a tenth of its high-to-low range.",
          data: MIXED,
          pattern: "doji",
          expectCount: 1,
          explain:
            "Candle 4: opened 1.0814, closed 1.0815, a body of 1 pip in a range of 22 pips (1.0806 to 1.0828). Under one tenth: a doji.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 4.2 — BULLISH, BEARISH, ENGULFING, PIN BARS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l12-candle-patterns",
    moduleId: "fx-w4-price-action",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.2"],
    title: "Bullish and Bearish Candles, Engulfing Patterns and Pin Bars",
    subtitle: "The few candle patterns worth knowing, defined precisely",
    estimatedMinutes: 20,
    intro:
      "Books list dozens of candlestick patterns with exotic names. You need very few, and you need them defined precisely enough that two traders looking at the same chart agree on whether one is there. This lesson gives those definitions and has you find each one.",

    atoms: [
      {
        id: "a-fx-candle-colour",
        title: "Bullish and bearish candles",
        explain:
          "A BULLISH candle closes ABOVE its open: buyers ended the period in control. A BEARISH candle closes BELOW its open: sellers did. Most platforms draw bullish candles green (or white, or hollow) and bearish ones red (or black, or filled). Colours can be changed, so read the open and close, not the colour.",
        why: "A sequence of mostly bullish candles with large bodies shows persistent buying; small bodies and alternating colours show a market without direction. This is the raw material for everything else in the lesson.",
        mistake:
          "Thinking a bullish candle means price rose during the period compared with the PREVIOUS candle. It only compares the candle's own close with its own open. A bullish candle can open well below the previous close.",
      },
      {
        id: "a-fx-bullish-engulfing",
        title: "The bullish engulfing pattern",
        explain:
          "A BULLISH ENGULFING pattern is two candles: a bearish candle, then a bullish candle whose body completely covers the first one's body. Precisely: the second candle opens at or below the first one's close and closes at or above the first one's open, and its body is larger. Sellers were in control, then buyers took back everything they had lost and more.",
        why: "At the end of a fall, near a level where price has turned before, it is evidence that buying pressure has arrived. On its own, in the middle of nowhere, it is just two candles.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          task: "EUR/USD has been falling. Select the candle that completes a bullish engulfing pattern.",
          data: REVERSAL_UP,
          pattern: "bullish-engulfing",
          expectCount: 1,
          explain:
            "The sixth candle: it opened at 1.0822, below the previous close of 1.0824, and closed at 1.0842, above the previous open of 1.0835. Its 20-pip body covers the previous 11-pip body completely.",
        },
      },
      {
        id: "a-fx-bearish-engulfing",
        title: "The bearish engulfing pattern",
        explain:
          "The mirror image: a bullish candle, then a bearish candle whose body completely covers it. The second candle opens at or above the first one's close, closes at or below the first one's open, and has the larger body. Buyers were in control, and sellers took it all back.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          task: "EUR/USD has been rising. Select the candle that completes a bearish engulfing pattern.",
          data: REVERSAL_DOWN,
          pattern: "bearish-engulfing",
          expectCount: 1,
          explain:
            "The fifth candle: it opened at 1.0838, above the previous close of 1.0836, and closed at 1.0818, below the previous open of 1.0830. A 20-pip bearish body swallowing a 6-pip bullish one, at the top of a rise.",
        },
      },
      {
        id: "a-fx-pin-bars",
        title: "Pin bars",
        explain:
          "A PIN BAR is a candle with one long wick and a small body at the other end, showing a price that was strongly rejected. A BULLISH pin bar has a long LOWER wick: price was pushed down and bought back up. In this course it qualifies when the lower wick is at least 60% of the range, the body at most 30%, and the upper wick at most 15%. A BEARISH pin bar is the mirror: a long upper wick.",
        why: "The long wick marks where the rejection happened, which makes it a natural place to put a stop-loss beyond. You will use exactly that in Week 8.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "1 hour",
          task: "Select the bullish pin bar.",
          data: PIN_AT_LOW,
          pattern: "bullish-pin",
          expectCount: 1,
          explain:
            "The fourth candle: a range of 30 pips (1.0798 to 1.0828), a lower wick of 26 pips (87%), a body of 1 pip and an upper wick of 3 pips. The last candle also has a small body, but its upper wick is 6 pips of a 16-pip range, so it is not a pin bar.",
        },
      },
      {
        id: "a-fx-pattern-context",
        title: "Patterns need context",
        explain:
          "A pattern is a piece of evidence, not a signal. Its value depends on WHERE it appears: at a level where price has turned before, after a clear move into that level, in the direction of the bigger trend. The same pattern in the middle of a range, or against a strong trend, is far weaker.",
        decision: {
          scenario:
            "You see a perfect bullish engulfing pattern on the 15-minute chart of EUR/USD. The daily chart is in a strong downtrend, and the pattern formed in the middle of the day's range, nowhere near a previous low.",
          question: "How should you treat it?",
          options: [
            {
              id: "a",
              text: "Buy immediately: it is a textbook pattern",
              whyWrong: "Textbook shape, poor context: against the higher-timeframe trend and at no meaningful level. Shape alone is weak evidence.",
            },
            {
              id: "b",
              text: "As weak evidence: note it, but do not act on it alone",
              why: "Right. Without a meaningful location or alignment with the bigger trend, it is just two candles. Week 8 turns 'context' into written rules.",
            },
            {
              id: "c",
              text: "Sell, because patterns always fail against the trend",
              whyWrong: "Nothing 'always' happens. Reversing your view because a pattern appeared is no more reasoned than following it.",
            },
            {
              id: "d",
              text: "Double the normal position size because two signals agree",
              whyWrong: "Nothing agrees here: the pattern contradicts the higher timeframe. And position size is set by risk, never by excitement.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.3 + 4.P — MARKET STRUCTURE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l13-market-structure",
    moduleId: "fx-w4-price-action",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.3", "4.P"],
    title: "Trends, Ranges, Swing Highs and Swing Lows",
    subtitle: "Market structure: the skeleton under every chart",
    estimatedMinutes: 22,
    intro:
      "Strip away indicators and patterns and every chart has a skeleton: a sequence of peaks and troughs. Whether those peaks and troughs are rising, falling or going nowhere is the single most useful thing you can know about a chart, and it can be read objectively.",

    atoms: [
      {
        id: "a-fx-swing-points",
        title: "Swing highs and swing lows",
        explain:
          "A SWING HIGH is a peak: a candle whose high is higher than the highs of the candles around it. A SWING LOW is a trough: a low lower than the lows around it. In this course a swing point needs two candles on EACH side that do not exceed it, so a swing can only be confirmed two candles after it forms.",
        why: "Swing points are where buyers or sellers stepped in. Joined up, they show the structure of the market, and they are also the natural places for stop-losses and targets.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          task: "Select every swing HIGH on this chart: candles whose high is above the highs of the two candles before AND the two candles after.",
          data: UPTREND,
          pattern: "swing-high",
          expectCount: 2,
          explain:
            "Two swing highs: the fourth candle (high 1.0834) and the tenth (high 1.0852). The candles at the far right are rising, but no swing high can be confirmed there yet because two later candles do not exist.",
        },
      },
      {
        id: "a-fx-uptrend",
        title: "An uptrend: higher highs and higher lows",
        explain:
          "An UPTREND is a sequence of HIGHER HIGHS and HIGHER LOWS: each peak above the last, each pullback ending above the last pullback. Buyers are winning each exchange. A DOWNTREND is the opposite: LOWER HIGHS and LOWER LOWS.",
        why: "This is an objective definition. 'It looks like it is going up' is an opinion; 'the last two swing highs and swing lows are each higher than the ones before' is a fact anyone can check.",
        candles: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          data: UPTREND,
          labels: { 3: "HH", 5: "HL", 9: "HH", 11: "HL" },
          expectStructure: "uptrend",
          caption:
            "Swing highs at 1.0834 then 1.0852 (higher highs); swing lows at 1.0808 then 1.0826 (higher lows). An uptrend by definition.",
        },
      },
      {
        id: "a-fx-downtrend",
        title: "A downtrend",
        explain:
          "In a downtrend each rally fails below the previous one and each fall goes further. Sellers are winning. Many traders look only for buying opportunities, but on a demo account you should be equally comfortable reading, and in time trading, falling markets.",
        candles: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          data: DOWNTREND,
          labels: { 3: "LL", 5: "LH", 9: "LL", 11: "LH" },
          expectStructure: "downtrend",
          caption: "Lower highs at 1.0892 then 1.0874; lower lows at 1.0866 then 1.0848.",
        },
        mistake: "Calling a single big red candle a downtrend. A trend is a sequence of swings, not one candle.",
      },
      {
        id: "a-fx-range",
        title: "Ranges: when there is no trend",
        explain:
          "When swings are neither consistently rising nor consistently falling, the market is in a RANGE: bouncing between a ceiling and a floor. Markets spend a great deal of time ranging. Recognising a range is as valuable as recognising a trend, because strategies that work in trends lose in ranges, and the other way round.",
        candles: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          data: RANGE,
          expectStructure: "range",
          levels: [
            { price: 1.0839, label: "Ceiling ~1.0839", kind: "resistance" },
            { price: 1.0802, label: "Floor ~1.0802", kind: "support" },
          ],
          caption:
            "Swing highs 1.0839 then 1.0836 (lower), swing lows 1.0802 then 1.0804 (higher). Neither pattern is a trend: a range.",
        },
        decision: {
          scenario:
            "On the chart above, price is at 1.0822, in the middle of the range, rising. A friend says 'it's going up, buy now'.",
          question: "What does market structure say?",
          options: [
            {
              id: "a",
              text: "Buy: the last few candles are rising, so it is an uptrend",
              whyWrong: "A few rising candles inside a range are a swing, not a trend. The swing highs are falling while the swing lows rise.",
            },
            {
              id: "b",
              text: "The market is ranging, and price is in the middle of it: there is no structural reason to buy or sell here",
              why: "Right. In a range the interesting places are near the edges, and the middle is where a trade has the least structure behind it.",
            },
            {
              id: "c",
              text: "Sell: the swing highs are falling, so it is a downtrend",
              whyWrong: "A downtrend needs lower highs AND lower lows. The lows are rising.",
            },
            {
              id: "d",
              text: "Buy with a larger size, because ranges are safe",
              whyWrong: "Ranges end, often violently. No market structure is 'safe', and size is decided by risk.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-structure-break",
        title: "When structure changes",
        explain:
          "A trend ends when its structure breaks. In an uptrend, the first warning is a failure to make a higher high; the clearer signal is price closing BELOW the last higher low. That is called a BREAK OF STRUCTURE. It does not guarantee a downtrend, only that the uptrend's definition no longer holds.",
        why: "This gives you an objective reason to stop looking for buys in a market, and an objective place, the last higher low, where an uptrend trade's idea is proved wrong. That is the seed of stop-loss placement in Week 8.",
        example:
          "UPTREND, THEN A BREAK\n\n  swing lows:   1.0808 → 1.0826       (higher low, trend intact)\n  swing highs:  1.0834 → 1.0852 → 1.0849   (failed to make a higher high: warning)\n  then a candle closes at 1.0821, below the last higher low of 1.0826\n  → break of structure: the uptrend is no longer intact",
      },
      {
        id: "a-fx-practical-annotate",
        title: "Practical: annotating a chart",
        explain:
          "This week's practical is pure observation. On historical charts in TradingView, mark every swing high and swing low, join them, label each as HH, HL, LH or LL, and write one sentence on the structure. Place no trades: the aim is to see structure before you are tempted to act on it.",
        why: "Most beginners see what they hope to see. Annotating before forming an opinion, with a fixed definition, trains your eye to read the chart that is actually there.",
        candleExercise: {
          pair: "EUR/USD",
          timeframe: "4 hours",
          task: "Annotation practice: select every swing LOW on this ranging chart.",
          data: RANGE,
          pattern: "swing-low",
          expectCount: 2,
          explain:
            "Two swing lows: 1.0802 (sixth candle) and 1.0804 (twelfth). The first candle's low is lower than its neighbours on the right, but it has no two candles before it, so it cannot be confirmed.",
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "On TradingView, using HISTORICAL charts only: scroll back at least three months. No trades this week. Save a screenshot of each annotated chart in your journal folder.",
      prompts: [
        "On EUR/USD's 4-hour chart, mark every swing high and swing low over about 100 candles using the two-candles-each-side definition. Label each HH, HL, LH or LL.",
        "Do the same on GBP/USD and USD/JPY. For each pair write one sentence: uptrend, downtrend or range, and the swing points that prove it.",
        "Find and mark three bullish or bearish engulfing patterns and three pin bars. For each, note whether it appeared at a meaningful level or in the middle of nowhere.",
        "Find one break of structure and mark the candle that broke it.",
        "Keep the daily fifteen-minute routine: each day, write the current 4-hour structure of EUR/USD in one line.",
      ],
      closing:
        "Compare your labels with another learner's on the same chart. Where you disagree, check against the definition: the disagreement is almost always a candle one of you judged by eye.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
