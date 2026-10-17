/**
 * ASSESSMENTS · FOREX TRADING · WEEK 4
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l11-candle-anatomy": {
    lessonId: "fx-l11-candle-anatomy",
    passMark: 70,
    questions: [
      {
        id: "fxq11-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-ohlc",
        prompt: "What do the four letters OHLC stand for?",
        options: [
          { id: "a", text: "Order, hedge, leverage, close" },
          { id: "b", text: "Open, high, low, close" },
          { id: "c", text: "Open, hold, limit, cancel" },
          { id: "d", text: "Offer, high, liquidity, cost" },
        ],
        correct: "b",
        explanation: "Every candle records the period's open, high, low and close prices.",
        whyWrong: {
          a: "Those are trading terms, but not what a candle records.",
          c: "Those sound like order actions; a candle records prices.",
          d: "Offer is another word for ask, but OHLC is about the period's prices.",
        },
      },
      {
        id: "fxq11-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-body-wick",
        prompt:
          "A candle opened at 1.0850, fell to 1.0815 and closed at 1.0848. Its high was 1.0852. What stands out?",
        options: [
          { id: "a", text: "A long lower wick: lower prices were rejected" },
          { id: "b", text: "A long upper wick: higher prices were rejected" },
          { id: "c", text: "A large bearish body" },
          { id: "d", text: "A gap" },
        ],
        correct: "a",
        explanation: "The lower wick runs from 1.0815 to 1.0848, 33 pips, against a 2-pip body. Price was pushed down and bought back.",
        whyWrong: {
          b: "The upper wick is only 2 pips (1.0850 to 1.0852).",
          c: "The body is 2 pips, from 1.0850 to 1.0848. Small, not large.",
          d: "Nothing here describes a jump between candles.",
        },
      },
      {
        id: "fxq11-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-timeframes-candles",
        prompt: "One daily candle contains the same price information as how many one-hour candles?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "12" },
          { id: "c", text: "24" },
          { id: "d", text: "60" },
        ],
        correct: "c",
        explanation: "A day is 24 hours, so 24 hourly candles summarise into one daily candle.",
        whyWrong: {
          a: "4 hourly candles make one 4-hour candle.",
          b: "12 hours is half a day.",
          d: "60 one-minute candles make one hourly candle.",
        },
      },
      {
        id: "fxq11-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-doji",
        prompt: "A candle has a range of 40 pips and a body of 3 pips. Under this course's definition, is it a doji?",
        options: [
          { id: "a", text: "Yes: the body is under one tenth of the range" },
          { id: "b", text: "No: a doji must have no body at all" },
          { id: "c", text: "No: a doji's body must be at least half the range" },
          { id: "d", text: "It depends on the colour" },
        ],
        correct: "a",
        explanation: "One tenth of 40 pips is 4 pips. A 3-pip body is within that, so it counts as a doji.",
        whyWrong: {
          b: "An exactly equal open and close is rare; the definition allows a small body.",
          c: "That describes a strong, decisive candle, the opposite of a doji.",
          d: "A doji is defined by its body size, not its colour.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l12-candle-patterns": {
    lessonId: "fx-l12-candle-patterns",
    passMark: 70,
    questions: [
      {
        id: "fxq12-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-candle-colour",
        prompt: "What makes a candle bearish?",
        options: [
          { id: "a", text: "It is red" },
          { id: "b", text: "It closed below its own open" },
          { id: "c", text: "It closed below the previous candle's close" },
          { id: "d", text: "It has a long wick" },
        ],
        correct: "b",
        explanation: "Bearish means the close is below the open of the same candle. Colour is only a display setting.",
        whyWrong: {
          a: "Colours can be changed. The definition is about open and close.",
          c: "That compares with a different candle; a candle can close lower than the last one and still be bullish.",
          d: "Wicks show rejection, not whether the candle is bullish or bearish.",
        },
      },
      {
        id: "fxq12-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-bullish-engulfing",
        prompt:
          "Candle 1: open 1.0850, close 1.0838. Candle 2: open 1.0836, close 1.0855. Is candle 2 a bullish engulfing?",
        options: [
          { id: "a", text: "Yes: it opened below 1.0838, closed above 1.0850, and its body is larger" },
          { id: "b", text: "No: it must open above candle 1's close" },
          { id: "c", text: "No: candle 1 must be bullish" },
          { id: "d", text: "Only if candle 2 is green" },
        ],
        correct: "a",
        explanation: "All three conditions hold: open (1.0836) ≤ previous close (1.0838), close (1.0855) ≥ previous open (1.0850), and a 19-pip body versus 12.",
        whyWrong: {
          b: "A bullish engulfing opens at or BELOW the bearish candle's close.",
          c: "The first candle of a bullish engulfing is bearish.",
          d: "Its open and close make it bullish; colour is a display setting.",
        },
      },
      {
        id: "fxq12-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-bearish-engulfing",
        prompt: "Where is a bearish engulfing pattern MOST meaningful?",
        options: [
          { id: "a", text: "After a rise, at a level where price has turned down before" },
          { id: "b", text: "Anywhere; the shape is what matters" },
          { id: "c", text: "In the middle of a quiet range" },
          { id: "d", text: "After a long fall, at its lowest point" },
        ],
        correct: "a",
        explanation: "It shows sellers overpowering buyers. That matters most where buyers have been in control and a level has stopped them before.",
        whyWrong: {
          b: "Shape without context is weak evidence.",
          c: "In a quiet range the pattern has little to reverse.",
          d: "After a long fall there is little buying left to engulf; it would more likely be continuation.",
        },
      },
      {
        id: "fxq12-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-pin-bars",
        prompt: "What does a bullish pin bar look like?",
        options: [
          { id: "a", text: "A long lower wick, a small body near the top, little upper wick" },
          { id: "b", text: "A long upper wick and a small body near the bottom" },
          { id: "c", text: "A large body and no wicks" },
          { id: "d", text: "Two candles, the second covering the first" },
        ],
        correct: "a",
        explanation: "The long lower wick shows lower prices were rejected and price was bought back up.",
        whyWrong: {
          b: "That is a bearish pin bar.",
          c: "That is a strong momentum candle, not a pin bar.",
          d: "That is an engulfing pattern.",
        },
      },
      {
        id: "fxq12-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-pattern-context",
        prompt:
          "A bullish pin bar forms on GBP/USD's 4-hour chart exactly at a support level that has held three times, in a daily uptrend. Compared with the same pin bar mid-range, it is:",
        options: [
          { id: "a", text: "Stronger evidence, because location and higher-timeframe trend support it" },
          { id: "b", text: "Exactly as strong; patterns are independent of location" },
          { id: "c", text: "Weaker, because support always breaks eventually" },
          { id: "d", text: "A guaranteed winning trade" },
        ],
        correct: "a",
        explanation: "Context is what gives a pattern its value: a meaningful level plus the bigger trend make the same shape much more informative.",
        whyWrong: {
          b: "Location is the main thing that distinguishes a meaningful pattern from noise.",
          c: "Levels do break eventually, but repeated defence is evidence, not a weakness.",
          d: "Nothing in trading is guaranteed. Stronger evidence still loses sometimes, which is why every trade has a stop.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l13-market-structure": {
    lessonId: "fx-l13-market-structure",
    passMark: 70,
    questions: [
      {
        id: "fxq13-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-uptrend",
        prompt: "Which sequence defines an uptrend?",
        options: [
          { id: "a", text: "Higher highs and higher lows" },
          { id: "b", text: "Higher highs and lower lows" },
          { id: "c", text: "Several green candles in a row" },
          { id: "d", text: "Price above 1.0000" },
        ],
        correct: "a",
        explanation: "Both the peaks and the troughs must be rising.",
        whyWrong: {
          b: "Rising peaks with falling troughs is an expanding, directionless market.",
          c: "A few green candles can sit inside a range or a downtrend.",
          d: "Price level says nothing about direction.",
        },
      },
      {
        id: "fxq13-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-swing-points",
        prompt: "Why can the most recent candle on a chart never be confirmed as a swing high under this course's definition?",
        options: [
          { id: "a", text: "Because the latest candle is always bearish" },
          { id: "b", text: "Because two candles AFTER it are needed to confirm it" },
          { id: "c", text: "Because swing highs only exist on daily charts" },
          { id: "d", text: "It can; the latest candle is always the swing high" },
        ],
        correct: "b",
        explanation: "A swing high must have two candles on each side that do not exceed it. Until those later candles exist, it is only a candidate.",
        whyWrong: {
          a: "The latest candle can be either colour.",
          c: "Swing points exist on every timeframe.",
          d: "The latest candle may well be exceeded by the next one.",
        },
      },
      {
        id: "fxq13-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-range",
        prompt: "Swing highs: 1.2700, 1.2690, 1.2705. Swing lows: 1.2600, 1.2610, 1.2595. What is the structure?",
        options: [
          { id: "a", text: "Uptrend" },
          { id: "b", text: "Downtrend" },
          { id: "c", text: "Range" },
          { id: "d", text: "A break of structure upwards" },
        ],
        correct: "c",
        explanation: "Neither the highs nor the lows move consistently in one direction; price is oscillating between about 1.2595 and 1.2705.",
        whyWrong: {
          a: "The highs fell, then rose; the lows rose, then fell. Not consistently higher.",
          b: "Not consistently lower either.",
          d: "The last high is only 5 pips above an earlier one, and the lows fell. That is a range edge being tested, not a new uptrend.",
        },
      },
      {
        id: "fxq13-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-structure-break",
        prompt: "In an uptrend whose last higher low is 1.0826, which event is a break of structure?",
        options: [
          { id: "a", text: "A red candle appears" },
          { id: "b", text: "A candle closes below 1.0826" },
          { id: "c", text: "Price touches 1.0830" },
          { id: "d", text: "A new higher high forms" },
        ],
        correct: "b",
        explanation: "Closing below the last higher low means the sequence of higher lows is broken: the uptrend's definition no longer holds.",
        whyWrong: {
          a: "Pullbacks are made of red candles. One red candle breaks nothing.",
          c: "1.0830 is above the higher low; the structure is intact.",
          d: "A new higher high continues the uptrend.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
