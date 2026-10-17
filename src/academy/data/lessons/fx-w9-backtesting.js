/**
 * FOREX TRADING · WEEK 9 · BACKTESTING AND PERFORMANCE
 *
 * Curriculum 9.1 – 9.P. Testing a written strategy on history, measuring it
 * with the statistics professionals use, and the ways a backtest misleads the
 * person who ran it: small samples, overfitting, and ignored costs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every statistic in Lesson 2 is computed from the same sixteen-trade sample
 * (SAMPLE below) by the engine the validator uses, so the numbers in the
 * exercises cannot contradict each other.
 */

export const SECTION_ID = "fx-s9-backtesting";

/** Sixteen backtested trades, in dollars, risking $10 (1R) each. */
const SAMPLE = [20, -10, -10, -10, 20, -10, -10, -10, -10, 20, 20, -10, 20, -10, -10, 20];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 9.1 — MANUAL AND PLATFORM-ASSISTED BACKTESTING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l26-backtesting",
    moduleId: "fx-w9-backtesting",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1"],
    title: "Manual and Platform-Assisted Backtesting",
    subtitle: "What your strategy would have done, measured honestly",
    estimatedMinutes: 18,
    intro:
      "A BACKTEST applies your written rules to past price data, setup by setup, and records what would have happened. It cannot tell you what will happen next. What it can do is tell you whether your rules have ever had an edge, which is something no amount of opinion can.",

    atoms: [
      {
        id: "a-fx-backtest-what",
        title: "What a backtest is, and is not",
        explain:
          "A backtest walks forward through history, applying the strategy exactly as written, and records every trade the rules would have taken. A strategy that lost money over a large, honest sample of history gives you a strong reason not to trade it. A strategy that made money gives you a reason to test it further on a demo account, not a promise.",
        why: "Markets change, so past results never guarantee future ones. But if a strategy did not work over hundreds of historical setups, there is no reason to expect it to start working with your money.",
      },
      {
        id: "a-fx-bar-replay",
        title: "Manual backtesting with TradingView Bar Replay",
        explain:
          "TradingView's BAR REPLAY hides every candle after a starting point you choose, then reveals them one at a time. You apply your rules as if it were live: mark the zone, wait for the trigger, record the entry, stop and target, then step forward to see the result. Some timeframes in Bar Replay may need a paid plan; daily and 4-hour charts are enough for this course's examples. MT5's Strategy Tester can also replay history in visual mode.",
        table: {
          caption: "A manual backtest, step by step.",
          headers: ["Step", "Do this"],
          rows: [
            ["1", "Choose the pair, timeframe and a starting date at least a year back"],
            ["2", "Start Bar Replay; mark structure and zones using only what is visible"],
            ["3", "Step forward one candle at a time"],
            ["4", "When every checklist item is 'yes', log the trade in the backtest sheet BEFORE revealing more candles"],
            ["5", "Step forward until the stop, target or exit rule is hit; log the result in R"],
            ["6", "Continue to the end of the period; never skip ahead"],
          ],
        },
        mistake:
          "Scrolling a normal chart and 'seeing' where trades would have been. With the future visible, your eye finds the winners and ignores the losers. Hide the future.",
      },
      {
        id: "a-fx-automated-testing",
        title: "Platform-assisted and automated testing",
        explain:
          "If a strategy can be written as code, MT5's Strategy Tester can run it automatically over years of data as an Expert Advisor. That is fast, but only as honest as the code and the data: it needs realistic spreads, commission and slippage, and the code must match the written rules exactly. For this course, careful manual testing is the standard; automated testing is something to learn after it.",
        decision: {
          scenario:
            "During a manual backtest, you reach a setup that meets every rule. Glancing at the next candle (you scrolled too far by accident), you see that it would have been a loss.",
          question: "What do you record?",
          options: [
            {
              id: "a",
              text: "Record it as a loss, exactly as the rules would have traded it, and add a note that you saw the result early",
              why: "Right. Every qualifying setup goes in, wins and losses alike. The note is honest about the mistake so you can watch for it.",
            },
            {
              id: "b",
              text: "Skip it, because you saw the answer and it would bias the test",
              whyWrong: "Skipping it removes a known loss from the results, which biases the test far more. The rules took it; it counts.",
            },
            {
              id: "c",
              text: "Skip it, because it was probably a bad setup anyway",
              whyWrong: "It met every rule. Deciding afterwards that losing setups 'were not really setups' is the most common way backtests lie.",
            },
            {
              id: "d",
              text: "Change the rule so this setup would not qualify",
              whyWrong: "Changing rules to remove individual losers during the test is overfitting (Lesson 3). Finish the test as written first.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 9.2 — WIN RATE, EXPECTANCY, PROFIT FACTOR, DRAWDOWN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l27-performance-stats",
    moduleId: "fx-w9-backtesting",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.2"],
    title: "Win Rate, Expectancy, Profit Factor and Maximum Drawdown",
    subtitle: "The four numbers that describe a strategy",
    estimatedMinutes: 22,
    intro:
      "Total profit tells you very little about a strategy. Two strategies with the same profit can have completely different risks. This lesson works through the four statistics that professionals use, all calculated from the same sixteen backtested trades.",

    atoms: [
      {
        id: "a-fx-sample-intro",
        title: "The sample",
        explain:
          "Below is a backtest of sixteen trades, each risking $10 (1R) on a $1,000 account, with a 2R target. Results in order, in dollars: +20, −10, −10, −10, +20, −10, −10, −10, −10, +20, +20, −10, +20, −10, −10, +20. Six winners, ten losers. Every exercise in this lesson uses these sixteen trades.",
        table: {
          caption: "The sixteen trades.",
          headers: ["Trades 1–8", "Result", "Trades 9–16", "Result"],
          rows: [
            ["1", "+$20", "9", "−$10"],
            ["2", "−$10", "10", "+$20"],
            ["3", "−$10", "11", "+$20"],
            ["4", "−$10", "12", "−$10"],
            ["5", "+$20", "13", "+$20"],
            ["6", "−$10", "14", "−$10"],
            ["7", "−$10", "15", "−$10"],
            ["8", "−$10", "16", "+$20"],
          ],
        },
      },
      {
        id: "a-fx-win-rate",
        title: "Win rate",
        explain:
          "WIN RATE is the percentage of trades that made money. It is the statistic beginners care about most and the one that means least on its own: a 90% win rate loses money if the one loss in ten is bigger than the nine wins together.",
        calcExercise: {
          scenario: "Use the sixteen-trade sample.",
          question: "What is the win rate? Round to one decimal place.",
          unit: "%",
          answer: 37.5,
          tolerance: 0.05,
          hint: "Count the winning trades and divide by the total number of trades.",
          working: "6 winners ÷ 16 trades = 0.375 = 37.5%",
          check: { fn: "winRate", args: { results: SAMPLE } },
        },
      },
      {
        id: "a-fx-expectancy",
        title: "Expectancy",
        explain:
          "EXPECTANCY is the average result per trade: the total result divided by the number of trades, or equivalently (win rate × average win) − (loss rate × average loss). Positive expectancy means that, over many trades, the strategy made money on average. Expressed in R, it is comparable across account sizes.",
        calcExercise: {
          scenario: "Use the sixteen-trade sample.",
          question: "What is the expectancy per trade, in dollars?",
          unit: "USD",
          answer: 1.25,
          tolerance: 0.005,
          hint: "Add up all sixteen results, then divide by sixteen.",
          working:
            "Total: 6 × $20 − 10 × $10 = $120 − $100 = $20\nExpectancy: $20 ÷ 16 = $1.25 per trade = 0.125R\nCheck: 0.375 × $20 − 0.625 × $10 = $7.50 − $6.25 = $1.25",
          check: { fn: "expectancy", args: { results: SAMPLE } },
        },
      },
      {
        id: "a-fx-profit-factor",
        title: "Profit factor",
        explain:
          "PROFIT FACTOR is gross profit divided by gross loss. Above 1 the strategy made money; below 1 it lost. A profit factor of 1.2 means every dollar lost was matched by $1.20 won. It is a compact measure of how much margin of safety a strategy has against costs and bad luck.",
        calcExercise: {
          scenario: "Use the sixteen-trade sample.",
          question: "What is the profit factor? Round to two decimal places.",
          unit: "",
          answer: 1.2,
          tolerance: 0.005,
          hint: "Add up only the winning trades, add up only the losing trades (as a positive number), and divide.",
          working: "Gross profit: 6 × $20 = $120\nGross loss: 10 × $10 = $100\nProfit factor: 120 ÷ 100 = 1.20",
          check: { fn: "profitFactor", args: { results: SAMPLE } },
        },
      },
      {
        id: "a-fx-max-drawdown",
        title: "Maximum drawdown and losing streaks",
        explain:
          "MAXIMUM DRAWDOWN is the largest fall from a peak in the account's equity to a later low, as money or a percentage of the peak. Alongside it, note the LONGEST LOSING STREAK. These tell you what living through the strategy actually feels like, and whether you could have kept following it.",
        why: "A strategy is only useful if you can stick to it. A drawdown that would make you abandon the rules halfway through is a drawdown the strategy's expectancy will never get the chance to recover.",
        calcExercise: {
          scenario:
            "Use the sixteen-trade sample, starting from $1,000. The equity reaches $1,020 after trade 1, then falls through trades 2–4, recovers to $1,010 after trade 5, and falls again through trades 6–9.",
          question: "What is the maximum drawdown as a percentage of the peak? Round to one decimal place.",
          unit: "%",
          answer: 4.9,
          tolerance: 0.05,
          hint: "Write out the equity after each trade. Find the highest peak before the lowest point that follows it.",
          working:
            "Equity: 1000 → 1020 → 1010 → 1000 → 990 → 1010 → 1000 → 990 → 980 → 970 → …\nPeak $1,020 (after trade 1), trough $970 (after trade 9)\nDrawdown: $50 ÷ $1,020 = 4.9%\nLongest losing streak: 4 (trades 6–9)",
          check: { fn: "maxDrawdownPercent", args: { start: 1000, results: SAMPLE } },
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 9.3 + 9.P — SAMPLE SIZE, OVERFITTING, REAL COSTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l28-backtest-pitfalls",
    moduleId: "fx-w9-backtesting",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.3", "9.P"],
    title: "Sample Size, Overfitting, Slippage and Realistic Costs",
    subtitle: "How backtests lie to the people who run them",
    estimatedMinutes: 22,
    intro:
      "The sixteen-trade sample in the last lesson had positive expectancy. Is that strategy any good? You cannot tell from sixteen trades, and if the results were produced by adjusting the rules until they looked good, or without costs, you cannot tell at all. This lesson is about not fooling yourself.",

    atoms: [
      {
        id: "a-fx-sample-size",
        title: "Sample size",
        explain:
          "A small sample is dominated by luck. With sixteen trades, two extra wins or losses would change the expectancy from positive to negative. As a working minimum this course asks for at least 50 qualifying setups before drawing any conclusion, and treats 100 or more, across different market conditions, as much more meaningful.",
        why: "Losing streaks that look alarming in a small sample are normal in a large one, and winning streaks that look like genius are too. Only a large sample shows what is typical.",
        mistake:
          "Testing a strategy on the three months where it obviously worked. Test across trends AND ranges, quiet AND volatile periods, or you have tested the period, not the strategy.",
      },
      {
        id: "a-fx-overfitting",
        title: "Overfitting",
        explain:
          "OVERFITTING is adjusting a strategy's rules until they fit the past data almost perfectly: adding a filter that removes the three worst losers, changing the RSI setting from 14 to 11 because 11 tested better. The result describes the past in detail and predicts the future badly, because it has learned the noise, not a real pattern.",
        why: "The protection is to keep rules few and simple, to decide them BEFORE testing, and to keep some data aside: develop on one period, then test once, unchanged, on a later period you have not looked at. If performance collapses there, the rules were fitted to noise.",
        decision: {
          scenario:
            "Your 80-trade backtest has a profit factor of 1.05. You notice that most losers happened on Tuesdays, so you add 'no trades on Tuesdays' and the profit factor jumps to 1.6.",
          question: "What is the right conclusion?",
          options: [
            {
              id: "a",
              text: "Excellent: the strategy is much better now",
              whyWrong: "There is no reason to believe Tuesday matters. A filter chosen because it removes past losers will almost always improve past results and usually nothing else.",
            },
            {
              id: "b",
              text: "This is probably overfitting; test the original rules on fresh data you have not seen, and only add a filter with a reason that exists before looking at results",
              why: "Right. A real edge has a reason. 'Losers happened on Tuesday' is a description of this sample, not a rule about markets.",
            },
            {
              id: "c",
              text: "Remove Mondays too, to reach a profit factor of 2",
              whyWrong: "That is overfitting further. Eventually any sample can be made to look perfect by deleting its bad days.",
            },
            {
              id: "d",
              text: "Profit factor does not matter; only win rate does",
              whyWrong: "Profit factor matters a great deal. The problem is how the improvement was obtained.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-realistic-costs",
        title: "Slippage and realistic costs",
        explain:
          "A backtest that ignores spread, commission, swap and slippage overstates every result. Include them: deduct your typical spread and commission from every trade, add a slippage allowance (for example 0.5 pips on entry and on stop exits), and use spreads typical of the TIME you would have traded, not the tightest ever seen.",
        calcExercise: {
          scenario:
            "Before costs, a strategy wins 40% of trades at 2R and loses 1R otherwise. After realistic costs of about 0.11R per trade, the average win is 1.89R and the average loss 1.11R.",
          question: "What is the expectancy after costs, in R?",
          unit: "R",
          answer: 0.09,
          tolerance: 0.005,
          hint: "(Win rate × average win) − (loss rate × average loss).",
          working:
            "Before costs: 0.40 × 2 − 0.60 × 1 = 0.80 − 0.60 = 0.20R\nAfter costs:  0.40 × 1.89 − 0.60 × 1.11 = 0.756 − 0.666 = 0.09R\nCosts removed more than half the edge.",
          check: { fn: "expectancyFromRates", args: { winRatePercent: 40, avgWin: 1.89, avgLoss: 1.11 } },
        },
      },
      {
        id: "a-fx-practical-backtest",
        title: "Practical: documenting every qualifying setup",
        explain:
          "This week's practical is a backtest of your Week 8 strategy, documented so that someone else could check it. Every qualifying setup gets a row, wins and losses alike, with a screenshot. The test is only as good as its completeness: one skipped loser per ten trades can turn a losing strategy into an apparently winning one.",
        example:
          "BACKTEST SHEET — columns\n\n  #  Date/time  Pair  Dir  Context✓ Zone✓ Trigger✓  Entry  Stop  Target\n  Stop pips  Target R  Spread  Result (R, after costs)  Exit reason\n  Screenshot link  Notes (any doubt about a rule? any rule unclear?)\n\nSUMMARY (bottom of the sheet)\n  Trades · win rate · average win/loss (R) · expectancy (R)\n  Profit factor · max drawdown · longest losing streak\n  Period tested · market conditions covered",
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "Use TradingView Bar Replay (or MT5's visual Strategy Tester) and a spreadsheet with the columns above. Test your Week 8 strategy exactly as written.",
      prompts: [
        "Choose a test period of at least twelve months on one pair, covering at least one clear trend and one clear range.",
        "Replay candle by candle and log EVERY qualifying setup before revealing its outcome, with a screenshot.",
        "Deduct realistic costs from every trade: your typical spread, any commission, and 0.5 pips of slippage on entries and stop exits.",
        "Aim for at least 30 setups this week; you will extend the sample to 50 or more in Week 13.",
        "Calculate win rate, expectancy in R, profit factor, maximum drawdown and longest losing streak. Write three sentences on what they say and what they cannot yet say.",
      ],
      closing:
        "If you found yourself wanting to change a rule during the test, write the idea down and change nothing. Rule changes are decided in review (Week 15), and then tested on new data.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
