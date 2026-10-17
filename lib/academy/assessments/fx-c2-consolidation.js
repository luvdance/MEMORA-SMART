/**
 * ASSESSMENTS · FOREX TRADING · CONSOLIDATION WEEK 2
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  "fx-c2-l1-mixed-practice": {
    lessonId: "fx-c2-l1-mixed-practice",
    passMark: 70,
    questions: [
      {
        id: "fxqc2-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-bear-pin",
        prompt: "A bearish pin bar shows that:",
        options: [
          { id: "a", text: "Higher prices were reached and firmly rejected" },
          { id: "b", text: "Lower prices were rejected" },
          { id: "c", text: "Price did not move" },
          { id: "d", text: "A gap occurred" },
        ],
        correct: "a",
        explanation: "The long upper wick is the rejected rally.",
        whyWrong: {
          b: "That is a bullish pin bar.",
          c: "The long wick shows a lot of movement within the candle.",
          d: "A pin bar is about one candle's shape, not a gap.",
        },
      },
      {
        id: "fxqc2-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-lower-highs",
        prompt: "Two consecutive swing highs at 1.0892 and then 1.0874 are:",
        options: [
          { id: "a", text: "Lower highs" },
          { id: "b", text: "Higher highs" },
          { id: "c", text: "Higher lows" },
          { id: "d", text: "A range by definition" },
        ],
        correct: "a",
        explanation: "The second peak is below the first.",
        whyWrong: {
          b: "The second is lower.",
          c: "These are highs, not lows.",
          d: "Lows are needed too before calling structure.",
        },
      },
      {
        id: "fxqc2-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c2-true-range",
        prompt: "Previous close 1.0800; candle high 1.0812, low 1.0790. True range?",
        options: [
          { id: "a", text: "0.0022" },
          { id: "b", text: "0.0012" },
          { id: "c", text: "0.0010" },
          { id: "d", text: "0.0034" },
        ],
        correct: "a",
        explanation: "High − low = 0.0022 is larger than both gaps to the previous close (0.0012 and 0.0010).",
        whyWrong: {
          b: "That is high minus previous close.",
          c: "That is previous close minus low.",
          d: "That adds two of the distances.",
        },
      },
      {
        id: "fxqc2-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c2-surprise",
        prompt: "US retail sales: forecast +0.4%, actual +0.1%. First reaction in USD, usually?",
        options: [
          { id: "a", text: "Weaker, on a downside surprise" },
          { id: "b", text: "Stronger, because sales rose" },
          { id: "c", text: "Unchanged" },
          { id: "d", text: "Impossible to say anything" },
        ],
        correct: "a",
        explanation: "Actual minus forecast is −0.3: weaker than expected.",
        whyWrong: {
          b: "The rise was expected and smaller than forecast.",
          c: "A surprise usually moves the currency.",
          d: "The usual first reaction to a clear surprise is predictable in direction, if not size.",
        },
      },
    ],
  },

  "fx-c2-l2-mistakes": {
    lessonId: "fx-c2-l2-mistakes",
    passMark: 70,
    questions: [
      {
        id: "fxqc2-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c2-mistake-list",
        prompt: "What fixes 'hindsight stories'?",
        options: [
          { id: "a", text: "Writing the analysis before price moves" },
          { id: "b", text: "Adding more indicators" },
          { id: "c", text: "Using a faster timeframe" },
          { id: "d", text: "Deleting old reports" },
        ],
        correct: "a",
        explanation: "A record made beforehand cannot be adjusted by hindsight.",
        whyWrong: {
          b: "More tools make it easier to find a story afterwards.",
          c: "Timeframe has nothing to do with hindsight.",
          d: "Old reports are the evidence.",
        },
      },
      {
        id: "fxqc2-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-mistake-list",
        prompt: "Which is a correct reading of RSI at 75?",
        options: [
          { id: "a", text: "Momentum has been strong recently" },
          { id: "b", text: "Sell now" },
          { id: "c", text: "Price must fall soon" },
          { id: "d", text: "Volatility is low" },
        ],
        correct: "a",
        explanation: "RSI describes momentum, not direction.",
        whyWrong: {
          b: "Overbought is not a sell signal.",
          c: "Strong trends can stay overbought.",
          d: "RSI does not measure volatility.",
        },
      },
      {
        id: "fxqc2-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-mistake-check",
        prompt: "RSI, MACD and Stochastic all 'confirm'. Why is this weak evidence?",
        options: [
          { id: "a", text: "They are all derived from the same prices" },
          { id: "b", text: "Because three is an unlucky number" },
          { id: "c", text: "Because MACD is broken" },
          { id: "d", text: "It is strong evidence" },
        ],
        correct: "a",
        explanation: "Correlated tools repeat one piece of information.",
        whyWrong: {
          b: "Numbers are not lucky or unlucky.",
          c: "MACD works as designed.",
          d: "Agreement between correlated tools is not independent confirmation.",
        },
      },
      {
        id: "fxqc2-8",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c2-mistake-list",
        prompt: "How is a trend defined in this course?",
        options: [
          { id: "a", text: "By swing highs and swing lows" },
          { id: "b", text: "By one large candle" },
          { id: "c", text: "By the colour of most candles" },
          { id: "d", text: "By news headlines" },
        ],
        correct: "a",
        explanation: "Higher highs and higher lows, or lower highs and lower lows.",
        whyWrong: {
          b: "One candle is not a trend.",
          c: "Colours can mislead within ranges.",
          d: "Headlines are not structure.",
        },
      },
    ],
  },

  "fx-c2-l3-demo-week": {
    lessonId: "fx-c2-l3-demo-week",
    passMark: 70,
    questions: [
      {
        id: "fxqc2-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c2-week-plan",
        prompt: "In the Phase 2 demo week, when is analysis written?",
        options: [
          { id: "a", text: "The evening before" },
          { id: "b", text: "After each trade" },
          { id: "c", text: "Only at the weekend" },
          { id: "d", text: "Never" },
        ],
        correct: "a",
        explanation: "Evening analysis sets the zones you may act at the next day.",
        whyWrong: {
          b: "Too late to guide the trade.",
          c: "It is updated daily this week.",
          d: "Analysis before action is the habit being built.",
        },
      },
      {
        id: "fxqc2-10",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c2-week-rule",
        prompt: "Price bounces from an unmarked level mid-session. This week's rule says:",
        options: [
          { id: "a", text: "No trade; consider the level in tonight's analysis" },
          { id: "b", text: "Trade it immediately" },
          { id: "c", text: "Backdate the report" },
          { id: "d", text: "Trade it on a lower timeframe" },
        ],
        correct: "a",
        explanation: "Only levels written beforehand are tradable.",
        whyWrong: {
          b: "That is acting on unprepared analysis.",
          c: "That falsifies the record.",
          d: "The timeframe does not change the rule.",
        },
      },
      {
        id: "fxqc2-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-week-plan",
        prompt: "How many demo trades per day are allowed this week?",
        options: [
          { id: "a", text: "At most one" },
          { id: "b", text: "Unlimited" },
          { id: "c", text: "At least three" },
          { id: "d", text: "Exactly five" },
        ],
        correct: "a",
        explanation: "One at most keeps the focus on the quality of the analysis.",
        whyWrong: {
          b: "That invites overtrading.",
          c: "Forcing trades breaks the analysis-first habit.",
          d: "There is no quota.",
        },
      },
      {
        id: "fxqc2-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-week-plan",
        prompt: "Which filter from Week 6 applies to every trade this week?",
        options: [
          { id: "a", text: "No entries within 30 minutes of high-impact news" },
          { id: "b", text: "Only trade on Mondays" },
          { id: "c", text: "Only trade exotics" },
          { id: "d", text: "None" },
        ],
        correct: "a",
        explanation: "The news filter avoids the worst spreads and slippage.",
        whyWrong: {
          b: "No such rule.",
          c: "Exotics are discouraged.",
          d: "The news filter applies.",
        },
      },
    ],
  },

  "fx-c2-l4-checkpoint": {
    lessonId: "fx-c2-l4-checkpoint",
    passMark: 70,
    questions: [
      {
        id: "fxqc2-13",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c2-checkpoint-format",
        prompt: "What does the Phase 2 checkpoint combine?",
        options: [
          { id: "a", text: "A chart-analysis report and a fundamental announcement note on the same pair" },
          { id: "b", text: "Ten trades with profits" },
          { id: "c", text: "A backtest" },
          { id: "d", text: "A trading plan" },
        ],
        correct: "a",
        explanation: "Technical and fundamental analysis of one pair, before and after the week.",
        whyWrong: {
          b: "Profits are not assessed.",
          c: "Backtesting is Phase 3.",
          d: "The plan is Phase 4.",
        },
      },
      {
        id: "fxqc2-14",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c2-checkpoint-review",
        prompt: "A sound report's zone breaks on surprise news. The review should say:",
        options: [
          { id: "a", text: "The reasoning was sound; note how the news changed the structure" },
          { id: "b", text: "The report was wrong" },
          { id: "c", text: "Zones never work" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "Reasoning is judged on what was knowable, not on outcomes.",
        whyWrong: {
          b: "That judges by outcome.",
          c: "One event proves nothing general.",
          d: "The review should record the lesson.",
        },
      },
      {
        id: "fxqc2-15",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c2-checkpoint-format",
        prompt: "When is the BEFORE half of the announcement note written?",
        options: [
          { id: "a", text: "Sunday, before the week's events" },
          { id: "b", text: "Friday" },
          { id: "c", text: "During the release" },
          { id: "d", text: "Any time" },
        ],
        correct: "a",
        explanation: "Writing before the event is what makes the comparison honest.",
        whyWrong: {
          b: "Friday is for the AFTER half.",
          c: "Too late for an honest expectation.",
          d: "Timing is the point.",
        },
      },
      {
        id: "fxqc2-16",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c2-checkpoint-review",
        prompt: "Which is assessed in the Phase 2 checkpoint?",
        options: [
          { id: "a", text: "The quality of the reasoning" },
          { id: "b", text: "Whether price did what you expected" },
          { id: "c", text: "Demo profit" },
          { id: "d", text: "Number of indicators used" },
        ],
        correct: "a",
        explanation: "Reasoning, consistency and honest review.",
        whyWrong: {
          b: "Outcomes are not the criterion.",
          c: "Profit is never the criterion.",
          d: "More indicators is not better analysis.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
