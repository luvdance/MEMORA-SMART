/**
 * ASSESSMENTS · FOREX TRADING · WEEK 9
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l26-backtesting": {
    lessonId: "fx-l26-backtesting",
    passMark: 70,
    questions: [
      {
        id: "fxq26-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-backtest-what",
        prompt: "What can a good backtest tell you?",
        options: [
          { id: "a", text: "Whether the written rules would have had an edge on past data" },
          { id: "b", text: "Exactly what the strategy will earn next month" },
          { id: "c", text: "That the strategy is safe to trade with real money" },
          { id: "d", text: "Nothing at all" },
        ],
        correct: "a",
        explanation: "A backtest measures the past. A good result justifies more testing, such as demo trading, not certainty.",
        whyWrong: {
          b: "Markets change; past results do not predict specific future earnings.",
          c: "Many strategies that tested well fail live. Demo testing and review come next.",
          d: "A poor result over a large, honest sample is strong evidence against a strategy.",
        },
      },
      {
        id: "fxq26-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-bar-replay",
        prompt: "Why use Bar Replay instead of scrolling a normal historical chart?",
        options: [
          { id: "a", text: "It hides future candles, so you cannot unconsciously pick the winners" },
          { id: "b", text: "It shows better prices" },
          { id: "c", text: "It removes spreads" },
          { id: "d", text: "It automatically finds setups" },
        ],
        correct: "a",
        explanation: "With the future visible, the eye finds winners and overlooks losers. Revealing one candle at a time recreates live decision-making.",
        whyWrong: {
          b: "The prices are the same historical data.",
          c: "Spreads must still be deducted by you.",
          d: "You apply the rules yourself; it does not search for them.",
        },
      },
      {
        id: "fxq26-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-automated-testing",
        prompt: "During a manual backtest you accidentally see that a qualifying setup lost. What do you record?",
        options: [
          { id: "a", text: "The loss, with a note that you saw it early" },
          { id: "b", text: "Nothing; skip it" },
          { id: "c", text: "A win, to balance your bias" },
          { id: "d", text: "Change the rules so it does not qualify" },
        ],
        correct: "a",
        explanation: "Every qualifying setup counts. Omitting known losers is the most common way backtests overstate results.",
        whyWrong: {
          b: "Skipping it removes a loss and biases the results upwards.",
          c: "Recording a false result is falsifying the test.",
          d: "Editing rules to remove individual losers is overfitting.",
        },
      },
      {
        id: "fxq26-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-automated-testing",
        prompt: "What must an automated MT5 Strategy Tester run include to be realistic?",
        options: [
          { id: "a", text: "Realistic spreads, commission and slippage, and code that matches the written rules exactly" },
          { id: "b", text: "The highest leverage available" },
          { id: "c", text: "Only the most recent month" },
          { id: "d", text: "Nothing extra; testers are always realistic" },
        ],
        correct: "a",
        explanation: "An automated test is only as honest as its cost assumptions and the accuracy of its code.",
        whyWrong: {
          b: "Leverage does not make a test more realistic.",
          c: "One month is far too small a sample.",
          d: "Default settings can use unrealistically low spreads.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l27-performance-stats": {
    lessonId: "fx-l27-performance-stats",
    passMark: 70,
    questions: [
      {
        id: "fxq27-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-win-rate",
        prompt: "A strategy wins 9 of 10 trades, making $5 each, and loses $60 on the tenth. Is it profitable?",
        options: [
          { id: "a", text: "No: it makes $45 and loses $60, a net loss of $15" },
          { id: "b", text: "Yes: a 90% win rate is excellent" },
          { id: "c", text: "Yes: it made money nine times" },
          { id: "d", text: "It breaks even" },
        ],
        correct: "a",
        explanation: "Win rate alone says nothing about profitability. 9 × $5 = $45 against one $60 loss.",
        whyWrong: {
          b: "A high win rate with large losses can lose money.",
          c: "Counting wins ignores their size.",
          d: "$45 − $60 = −$15, not zero.",
        },
      },
      {
        id: "fxq27-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-expectancy",
        prompt: "Win rate 50%, average win 1.5R, average loss 1R. What is the expectancy?",
        options: [
          { id: "a", text: "0.25R" },
          { id: "b", text: "0.5R" },
          { id: "c", text: "1.25R" },
          { id: "d", text: "−0.25R" },
        ],
        correct: "a",
        explanation: "0.5 × 1.5 − 0.5 × 1 = 0.75 − 0.5 = 0.25R per trade.",
        whyWrong: {
          b: "That is the difference between average win and loss, not weighted by the rates.",
          c: "That is the average of the win and loss sizes.",
          d: "The sign is wrong: wins are bigger than losses at an equal rate.",
        },
      },
      {
        id: "fxq27-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-profit-factor",
        prompt: "Gross profit $900, gross loss $1,000. What does the profit factor tell you?",
        options: [
          { id: "a", text: "0.9: the strategy lost money" },
          { id: "b", text: "1.1: the strategy made money" },
          { id: "c", text: "90%: a high win rate" },
          { id: "d", text: "−$100: the drawdown" },
        ],
        correct: "a",
        explanation: "900 ÷ 1,000 = 0.9. Below 1 means losses exceeded profits.",
        whyWrong: {
          b: "That inverts the ratio.",
          c: "Profit factor is not a win rate.",
          d: "−$100 is the net result, not the drawdown or the profit factor.",
        },
      },
      {
        id: "fxq27-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-max-drawdown",
        prompt: "Why does maximum drawdown matter even for a strategy with positive expectancy?",
        options: [
          { id: "a", text: "Because a drawdown deep enough to make you abandon the rules means the expectancy is never realised" },
          { id: "b", text: "It does not; only expectancy matters" },
          { id: "c", text: "Because drawdown increases the win rate" },
          { id: "d", text: "Because brokers charge for drawdowns" },
        ],
        correct: "a",
        explanation: "A strategy only works if you keep following it through its worst periods.",
        whyWrong: {
          b: "Expectancy is an average over many trades; drawdown is what you live through to reach it.",
          c: "Drawdown and win rate are separate measures.",
          d: "There is no such charge.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l28-backtest-pitfalls": {
    lessonId: "fx-l28-backtest-pitfalls",
    passMark: 70,
    questions: [
      {
        id: "fxq28-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-sample-size",
        prompt: "What is this course's working minimum sample before drawing any conclusion?",
        options: [
          { id: "a", text: "At least 50 qualifying setups" },
          { id: "b", text: "5 trades" },
          { id: "c", text: "One good week" },
          { id: "d", text: "However many it takes to show a profit" },
        ],
        correct: "a",
        explanation: "Below about 50 setups, luck dominates. 100 or more across different conditions is far more meaningful.",
        whyWrong: {
          b: "Five trades can be all wins or all losses by chance.",
          c: "A week is one set of conditions.",
          d: "Stopping when the result looks good is a form of bias.",
        },
      },
      {
        id: "fxq28-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-overfitting",
        prompt: "Which change is most likely to be overfitting?",
        options: [
          { id: "a", text: "Changing RSI from 14 to 11 because 11 gave the best past results" },
          { id: "b", text: "Deciding before testing that you will only trade the London session, for its liquidity" },
          { id: "c", text: "Including realistic spreads in the test" },
          { id: "d", text: "Testing over a longer period" },
        ],
        correct: "a",
        explanation: "Choosing a setting because it fitted past data best, with no independent reason, is fitting to noise.",
        whyWrong: {
          b: "A rule with a reason, decided in advance, is not overfitting.",
          c: "Adding costs makes the test more realistic.",
          d: "More data reduces the chance of fooling yourself.",
        },
      },
      {
        id: "fxq28-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-overfitting",
        prompt: "What is the main protection against overfitting?",
        options: [
          { id: "a", text: "Few, simple rules decided before testing, then one test on unseen data" },
          { id: "b", text: "Adding a filter for every loss" },
          { id: "c", text: "Testing only on the period where the strategy worked" },
          { id: "d", text: "Using more indicators" },
        ],
        correct: "a",
        explanation: "A real edge survives data it was not built on. Fitted rules collapse there.",
        whyWrong: {
          b: "That is overfitting itself.",
          c: "That tests the period, not the strategy.",
          d: "More indicators means more settings to fit.",
        },
      },
      {
        id: "fxq28-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-realistic-costs",
        prompt:
          "A backtest shows 0.05R expectancy BEFORE costs, on trades where costs are about 0.10R each. What is the realistic conclusion?",
        options: [
          { id: "a", text: "After costs the strategy loses money" },
          { id: "b", text: "The strategy is profitable" },
          { id: "c", text: "Costs do not apply in backtests" },
          { id: "d", text: "It breaks even exactly" },
        ],
        correct: "a",
        explanation: "0.05R − 0.10R = −0.05R per trade. An edge smaller than costs is no edge.",
        whyWrong: {
          b: "Only before costs, which no real trade avoids.",
          c: "They apply to every real trade, so a test must include them.",
          d: "The costs are double the edge.",
        },
      },
      {
        id: "fxq28-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-practical-backtest",
        prompt: "Why does every qualifying setup need a row, including losers?",
        options: [
          { id: "a", text: "Because omitting even a few losers can turn a losing strategy into an apparently winning one" },
          { id: "b", text: "Because spreadsheets need many rows" },
          { id: "c", text: "Because losers are more interesting" },
          { id: "d", text: "It does not; losers can be summarised" },
        ],
        correct: "a",
        explanation: "Completeness is what makes the statistics true. Missing losers inflate every number.",
        whyWrong: {
          b: "Row count is not the point; honesty is.",
          c: "Both winners and losers are needed equally.",
          d: "Summaries hide which setups were skipped.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
