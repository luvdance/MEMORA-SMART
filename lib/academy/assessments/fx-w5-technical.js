/**
 * ASSESSMENTS · FOREX TRADING · WEEK 5
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l14-support-resistance": {
    lessonId: "fx-l14-support-resistance",
    passMark: 70,
    questions: [
      {
        id: "fxq14-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-support-resistance",
        prompt: "What is resistance?",
        options: [
          { id: "a", text: "A price area where rising price has repeatedly stopped and turned down" },
          { id: "b", text: "The broker's refusal to fill an order" },
          { id: "c", text: "A price area where falling price has repeatedly turned up" },
          { id: "d", text: "The highest price a pair has ever reached" },
        ],
        correct: "a",
        explanation: "Resistance is where sellers have repeatedly stepped in, stopping rises.",
        whyWrong: {
          b: "That is a rejected order, not a chart concept.",
          c: "That is support.",
          d: "An all-time high can act as resistance, but resistance can form at any level that has repeatedly stopped rises.",
        },
      },
      {
        id: "fxq14-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-zones",
        prompt: "Why mark support and resistance as zones rather than exact lines?",
        options: [
          { id: "a", text: "Zones look better on a chart" },
          { id: "b", text: "Price rarely turns at exactly the same price twice, so a level is really an area" },
          { id: "c", text: "Zones guarantee that price will react" },
          { id: "d", text: "MT5 cannot draw lines" },
        ],
        correct: "b",
        explanation: "Turning points cluster a few pips apart. A zone reflects that and avoids entering early or placing stops just beyond an exact line.",
        whyWrong: {
          a: "Appearance is not the reason; accuracy is.",
          c: "Nothing guarantees a reaction.",
          d: "MT5 draws lines perfectly well.",
        },
      },
      {
        id: "fxq14-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-role-reversal",
        prompt:
          "GBP/USD closes decisively above resistance at 1.2700, then falls back to 1.2705 and turns up. What is this called?",
        options: [
          { id: "a", text: "A false breakout" },
          { id: "b", text: "Role reversal: old resistance acting as support" },
          { id: "c", text: "A break of structure downwards" },
          { id: "d", text: "A doji" },
        ],
        correct: "b",
        explanation: "After a decisive break, the old ceiling acting as a floor on the retest is role reversal.",
        whyWrong: {
          a: "A false breakout would close back below 1.2700 and stay there.",
          c: "Price held above the old level; nothing broke downwards.",
          d: "A doji is a single candle with a tiny body, not a sequence of moves.",
        },
      },
      {
        id: "fxq14-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-level-strength",
        prompt: "Which factor makes a level LESS significant?",
        options: [
          { id: "a", text: "It appears on the daily chart" },
          { id: "b", text: "Price has reacted strongly from it several times" },
          { id: "c", text: "It was last tested two years ago and price has moved far away since" },
          { id: "d", text: "It is a round number" },
        ],
        correct: "c",
        explanation: "Old, distant levels are watched by fewer participants. Recency is one of the factors that make a level matter.",
        whyWrong: {
          a: "Higher-timeframe levels are more significant.",
          b: "Repeated strong reactions add significance.",
          d: "Round numbers often attract orders.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l15-trendlines-mas": {
    lessonId: "fx-l15-trendlines-mas",
    passMark: 70,
    questions: [
      {
        id: "fxq15-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-trendlines",
        prompt: "An uptrend line is drawn by joining:",
        options: [
          { id: "a", text: "Higher lows" },
          { id: "b", text: "Lower highs" },
          { id: "c", text: "Every candle's close" },
          { id: "d", text: "The first and last candles on the chart" },
        ],
        correct: "a",
        explanation: "An uptrend line joins the rising troughs, the higher lows.",
        whyWrong: {
          b: "Lower highs make a downtrend line.",
          c: "Joining closes gives a line chart, not a trendline.",
          d: "That ignores the swings that define the trend.",
        },
      },
      {
        id: "fxq15-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-sma",
        prompt: "The last four closes are 1.2600, 1.2620, 1.2640 and 1.2660. What is the 4-period SMA?",
        options: [
          { id: "a", text: "1.2620" },
          { id: "b", text: "1.2630" },
          { id: "c", text: "1.2640" },
          { id: "d", text: "1.2660" },
        ],
        correct: "b",
        explanation: "(1.2600 + 1.2620 + 1.2640 + 1.2660) ÷ 4 = 5.0520 ÷ 4 = 1.2630.",
        whyWrong: {
          a: "That is the second close, not the average.",
          c: "That is the third close.",
          d: "That is the latest close. The average sits below it in a rising market.",
        },
      },
      {
        id: "fxq15-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-ema",
        prompt: "Compared with an SMA of the same length, an EMA:",
        options: [
          { id: "a", text: "Reacts more slowly" },
          { id: "b", text: "Reacts faster, because it weights recent closes more" },
          { id: "c", text: "Predicts the next close" },
          { id: "d", text: "Ignores the latest candle" },
        ],
        correct: "b",
        explanation: "Heavier weighting of recent prices makes the EMA turn sooner, at the cost of more false signals.",
        whyWrong: {
          a: "The SMA is the slower one.",
          c: "No average predicts; both summarise the past.",
          d: "The EMA gives the latest candle the MOST weight.",
        },
      },
      {
        id: "fxq15-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-fx-ma-structure",
        prompt: "Why do moving averages always confirm a trend change late?",
        options: [
          { id: "a", text: "Because brokers delay the data" },
          { id: "b", text: "Because they are calculated from past closes, so recent turns are diluted by older prices" },
          { id: "c", text: "Because they are drawn on the wrong timeframe" },
          { id: "d", text: "They do not; they turn before price" },
        ],
        correct: "b",
        explanation: "An average of the last N closes includes prices from before the turn, so it moves only after enough new closes accumulate.",
        whyWrong: {
          a: "The lag is in the mathematics, not the data feed.",
          c: "Lag exists on every timeframe.",
          d: "An average of past prices cannot turn before the prices it averages.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l16-indicators": {
    lessonId: "fx-l16-indicators",
    passMark: 70,
    questions: [
      {
        id: "fxq16-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-rsi",
        prompt: "RSI reads 25. What does that conventionally describe?",
        options: [
          { id: "a", text: "Oversold: strong recent downward momentum" },
          { id: "b", text: "Overbought" },
          { id: "c", text: "A guaranteed reversal up" },
          { id: "d", text: "Low volatility" },
        ],
        correct: "a",
        explanation: "Below 30 is conventionally called oversold. It describes momentum, not what happens next.",
        whyWrong: {
          b: "Overbought is above 70.",
          c: "In a strong downtrend RSI can stay below 30 while price keeps falling.",
          d: "RSI measures momentum, not volatility. ATR measures volatility.",
        },
      },
      {
        id: "fxq16-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-macd",
        prompt: "What is the MACD line?",
        options: [
          { id: "a", text: "The 12-period EMA minus the 26-period EMA" },
          { id: "b", text: "The average of the last 9 closes" },
          { id: "c", text: "The average true range" },
          { id: "d", text: "A line joining swing highs" },
        ],
        correct: "a",
        explanation: "MACD is the difference between a fast and a slow EMA. Its 9-period EMA is the signal line.",
        whyWrong: {
          b: "The 9 is the period of the signal line, which smooths MACD itself.",
          c: "That is ATR.",
          d: "That is a trendline.",
        },
      },
      {
        id: "fxq16-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-atr",
        prompt: "ATR(14) on GBP/USD's 1-hour chart is 15 pips. Your planned stop-loss is 6 pips from entry. What is the concern?",
        options: [
          { id: "a", text: "None; tight stops are always better" },
          { id: "b", text: "The stop is well inside normal hourly movement, so ordinary noise is likely to hit it" },
          { id: "c", text: "ATR shows the trend is down" },
          { id: "d", text: "ATR means the stop must be exactly 15 pips" },
        ],
        correct: "b",
        explanation: "If price typically moves 15 pips an hour, a 6-pip stop is likely to be triggered by random movement, not by the idea being wrong.",
        whyWrong: {
          a: "A stop inside the noise is not safer; it just loses more often.",
          c: "ATR says nothing about direction.",
          d: "ATR informs stop placement; it does not dictate an exact distance. Structure decides the location.",
        },
      },
      {
        id: "fxq16-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-fx-indicator-limits",
        prompt: "Why does adding a fifth indicator rarely add new evidence?",
        options: [
          { id: "a", text: "Because they are all calculated from the same price data" },
          { id: "b", text: "Because MT5 limits indicators to four" },
          { id: "c", text: "Because indicators only work on daily charts" },
          { id: "d", text: "It always adds evidence" },
        ],
        correct: "a",
        explanation: "Indicators transform the same OHLC data. Several of them agreeing is often one piece of information counted several times.",
        whyWrong: {
          b: "There is no such limit.",
          c: "Indicators can be applied to any timeframe.",
          d: "Correlated tools repeat each other; they do not add independent confirmation.",
        },
      },
      {
        id: "fxq16-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-practical-report",
        prompt: "Why use the same small toolkit on every chart-analysis report?",
        options: [
          { id: "a", text: "So analysis is repeatable and can later be tested" },
          { id: "b", text: "Because other tools are forbidden" },
          { id: "c", text: "To guarantee correct predictions" },
          { id: "d", text: "To save chart space only" },
        ],
        correct: "a",
        explanation: "Analysis done the same way every time can be written as rules, and rules can be backtested. Changing tools chart by chart makes that impossible.",
        whyWrong: {
          b: "Nothing is forbidden; consistency is a choice that makes testing possible.",
          c: "No toolkit guarantees correct predictions.",
          d: "Space is a side benefit, not the reason.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
