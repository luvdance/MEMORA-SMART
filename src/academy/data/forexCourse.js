/**
 * FOREX TRADING — FOUNDATIONS TO PROFESSIONAL PRACTICE
 *
 * Authored from the Memora Smart Technologies forex curriculum: five phases
 * over sixteen taught weeks, run across five months. Each of the first four
 * phases is followed by a consolidation week on the demo account, which is
 * where the fifth month comes from: 16 taught weeks + 4 demo weeks = 20.
 *
 * Course content is DATA, never markup. This object mirrors the shape of
 * javascriptCourse.js and cybersecurityCourse.js exactly, so the catalog, the
 * curriculum sidebar, the lesson player, the progress engine and the stats
 * band render it without a single change.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          one module per WEEK
 *           └── lessons/{lessonId}    one curriculum topic each
 *                 └── atoms/{atomId}  one idea each
 *
 * ── WHAT THIS COURSE PROMISES, AND WHAT IT DOES NOT ──────────────────────
 * It promises a learner will understand how the forex market works, calculate
 * risk correctly, build and test a rule-based plan, execute it on a demo
 * account and review their own behaviour honestly. It does NOT promise that
 * anyone will become consistently profitable, or that completing it makes
 * them ready to trade real money. That sentence is in the course description,
 * in Week 1, in Week 12 and in Week 16, because it is the most important true
 * thing a forex course can say and most of them never say it.
 *
 * Graduation is assessed on process — risk arithmetic, a strategy another
 * person could follow, accurate records and rule adherence. PROFIT ALONE
 * NEVER DECIDES A PASS. A lucky month on a demo account proves nothing; a
 * journal that shows every rule followed through a losing month proves a lot.
 *
 * ── THE TOOLS ARE THE REAL ONES ──────────────────────────────────────────
 * From Week 1 the learner opens a free MetaTrader 5 demo account and a free
 * TradingView account, sets them to a REALISTIC balance and leverage, and
 * keeps a journal. Every week's practical work is done on those tools, on a
 * laptop or a phone, so the course is learned on the go rather than read.
 *
 * ── THE PRACTICE TOOLS INSIDE THE LESSONS ────────────────────────────────
 *   calcExercise    pip values, lot sizes, margin, risk, statistics. The
 *                   answer is recomputed by validateContent.mjs from the
 *                   function and inputs named in `check`, using the same
 *                   engine as the component (lib/academy/forex/engine.js).
 *   candleExercise  click every candle matching a pattern. The correct set is
 *                   computed from the pattern's written definition.
 *   ticketExercise  an MT5-style order ticket, validated as an order a real
 *                   platform would accept, with the correct position size.
 *   decision        a judgement call with every wrong option explained.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the lesson list from the source document,
 * numbered by week and lesson; "n.P" is the week's practical. Every lesson
 * declares which numbers it `covers`, and `npm run test:academy` fails if any
 * number in the table is not taught, so the course cannot quietly drop one.
 */

export const FOREX_COURSE = {
  id: "forex-trading",
  slug: "forex-trading",
  title: "Forex Trading",
  subtitle: "Foundations to professional practice",
  tagline:
    "Learn how the currency market really works, manage risk like a professional, and prove your process on a demo account before a single naira or dollar is at stake.",
  description:
    "A five-month programme in five phases. You start with what a currency pair, a pip and a lot actually are, open a free demo account in Week 1, and from then on practise every idea on real charts and a real trading platform. You learn the mathematics of risk before you learn any strategy; then price action, technical and fundamental analysis; then how to build, write down and backtest a rule-based strategy; then execution, trading psychology and risk governance. The final month is a four-week practical lab: a documented backtest, a live-market demo journal, a performance and rule-compliance review, and a final trading plan you present and defend. You are assessed on sound risk calculations, a strategy someone else could follow, accurate records and following your own rules, never on profit alone. Honest warning: no course can make you consistently profitable, and completing this one does not mean you are ready to trade real money. What it gives you is the knowledge and the discipline to find out safely.",

  status: "live", // "live" | "coming-soon" | "draft"
  level: "Complete beginner → Professional practice",
  durationMonths: 5,
  hoursPerWeek: "6–8",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "mt5",
      name: "MetaTrader 5 (demo account)",
      short: "MetaTrader 5",
      blurb: "The trading platform most retail brokers offer. Desktop and mobile, virtual money only.",
      icon: "fas fa-desktop",
      accent: "#1d4ed8",
    },
    {
      id: "tradingview",
      name: "TradingView",
      short: "TradingView",
      blurb: "Charting, drawing tools, indicators, Bar Replay for backtesting and Paper Trading.",
      icon: "fas fa-chart-line",
      accent: "#0e7490",
    },
    {
      id: "calendar",
      name: "Economic calendar",
      short: "Calendar",
      blurb: "Forex Factory or Investing.com, set to Lagos time, for every high-impact release.",
      icon: "fas fa-calendar-days",
      accent: "#b45309",
    },
    {
      id: "journal",
      name: "Trading journal & risk sheet",
      short: "Journal",
      blurb: "A Google Sheets or Excel journal and position-size calculator you build yourself.",
      icon: "fas fa-book-open",
      accent: "#7c3aed",
    },
  ],

  outcomes: [
    "Read any currency quote and explain base, quote, bid, ask, spread, pips and lots without notes",
    "Open, modify and close market and pending orders correctly on a MetaTrader 5 demo account",
    "Calculate pip value, position size, margin and money at risk before every trade, to the cent",
    "Read price action, market structure, support and resistance, and use indicators knowing their limits",
    "Explain how interest rates, inflation, jobs data and central banks move currencies, and why reactions can surprise",
    "Write a rule-based strategy with objective entries, exits, filters and a checklist another trader could follow",
    "Backtest honestly, recording every qualifying setup, and judge results by expectancy, profit factor and drawdown",
    "Keep an accurate journal, recognise your own behavioural mistakes and follow a written trading plan",
    "Check a broker's regulation, recognise forex scams, and know when not to trade at all",
  ],

  audience: [
    "Complete beginners who have heard about forex and want the truth before risking money",
    "People who have already lost money trading and want to understand why",
    "Students of finance, economics or business who want practical market skills",
    "Anyone who has been offered a 'forex account management' or signal scheme and wants to judge it",
  ],

  requirements: [
    "A smartphone at minimum; a laptop or desktop makes charting and backtesting much easier",
    "A stable internet connection",
    "A free MetaTrader 5 demo account and a free TradingView account — both set up in Week 1",
    "Basic arithmetic: percentages and multiplication. Everything else is taught",
    "No money. This course is completed entirely on demo accounts with virtual funds",
  ],

  /**
   * The five phases of the source curriculum. Here each phase is one month in
   * the sidebar, which is also how the course is paced: three taught weeks,
   * then a consolidation week (a real module, `consolidation: true`) of
   * interleaved practice, demo trading and the phase checkpoint, except
   * Phase 5, the four-week lab. `weeks` lists the TAUGHT weeks only.
   */
  phases: [
    { phase: 1, title: "Forex foundations", weeks: [1, 2, 3] },
    { phase: 2, title: "Market analysis", weeks: [4, 5, 6] },
    { phase: 3, title: "Trading systems and strategy", weeks: [7, 8, 9] },
    { phase: 4, title: "Execution, psychology and evaluation", weeks: [10, 11, 12] },
    { phase: 5, title: "Four-week practical trading lab", weeks: [13, 14, 15, 16] },
  ],

  months: [
    {
      month: 1,
      title: "Phase 1 · Forex Foundations",
      focus: "Beginner",
      summary:
        "What the forex market is, how trades are placed and what they cost, and the mathematics of risk. Your demo account and journal are set up in the first lesson and used every week after.",
      modules: [
        {
          id: "fx-w1-intro",
          order: 1,
          phase: 1,
          title: "Week 1 · Introduction to Forex",
          summary:
            "Set up your practice lab, then learn what forex is, how currency pairs work, and the vocabulary every trade is described in.",
          atoms: 21,
          topics: [
            "Your practice lab: MT5 demo, TradingView and a journal",
            "What forex is and why currencies are traded",
            "Base and quote currencies; majors, minors and exotics",
            "Bid, ask, spread, pips and lots",
          ],
          curriculum: [
            ["1.0", "Setting up your practice lab: a demo account, charts and a journal"],
            ["1.1", "What forex is and why currencies are traded"],
            ["1.2", "Currency pairs, base currency, quote currency, majors, minors and exotics"],
            ["1.3", "Bid, ask, spread, pips, lots and basic trade terminology"],
            ["1.P", "Practical: read currency quotes and calculate the movement of a currency pair"],
          ],
          project: "Read live quotes on your demo platform and calculate the movement of three pairs in pips.",
        },
        {
          id: "fx-w2-mechanics",
          order: 2,
          phase: 1,
          title: "Week 2 · How Forex Trading Works",
          summary:
            "Who is on the other side of your trade, every order type you will use, and when the market is open, active and expensive.",
          atoms: 14,
          topics: [
            "Brokers, liquidity providers and market participants",
            "Order execution: market and pending orders",
            "Stop-loss and take-profit",
            "Sessions, market hours, volatility and costs",
          ],
          curriculum: [
            ["2.1", "Brokers, liquidity providers, market participants and order execution"],
            ["2.2", "Market orders, limit orders, stop orders, stop-loss and take-profit"],
            ["2.3", "Forex sessions, market hours, volatility and trading costs"],
            ["2.P", "Practical: simulate opening, modifying and closing a trade in a demo account"],
          ],
          project: "Open, modify and close a trade on your MT5 demo account and record each step.",
        },
        {
          id: "fx-w3-risk-maths",
          order: 3,
          phase: 1,
          title: "Week 3 · Trading Mathematics and Risk",
          summary:
            "Pip values, lot sizes, leverage and margin, and the one formula that decides how much you can lose: position size.",
          atoms: 16,
          topics: [
            "Pip values and contract specifications",
            "Leverage, margin, free margin and margin calls",
            "Position sizing and reward-to-risk",
            "Drawdown and transaction costs",
          ],
          curriculum: [
            ["3.1", "Pip values, lot sizes and contract specifications"],
            ["3.2", "Leverage, margin, free margin, margin calls and liquidation risk"],
            ["3.3", "Position sizing, risk-to-reward ratios, drawdown and transaction costs"],
            ["3.P", "Practical: calculate trade exposure and potential losses before entering a simulated trade"],
          ],
          project: "Build your own position-size calculator in a spreadsheet and use it before every demo trade.",
        },
        {
          id: "fx-c1-consolidation",
          order: 4,
          phase: 1,
          consolidation: true,
          title: "Consolidation Week · Phase 1 Review and Demo Practice",
          summary:
            "No new theory. Interleaved practice across risk mathematics, quotes and orders, the phase's common mistakes, a guided week on the demo account, and the Phase 1 checkpoint.",
          atoms: 12,
          topics: [
            "Interleaved practice",
            "The five most common Phase 1 mistakes",
            "A guided demo week",
            "The Phase 1 checkpoint",
          ],
          curriculum: [
            ["C1.1", "Interleaved practice: quotes, pips, lots, margin and position size"],
            ["C1.2", "The five most common Phase 1 mistakes"],
            ["C1.3", "A guided demo week: every trade sized first"],
            ["C1.4", "The Phase 1 checkpoint"],
            ["C1.P", "Checkpoint: Ten quotes read and ten position sizes calculated by hand, checked against your spreadsheet calculator"],
          ],
          project: "Ten quotes read and ten position sizes calculated by hand, checked against your spreadsheet calculator.",
        },
      ],
    },
    {
      month: 2,
      title: "Phase 2 · Market Analysis",
      focus: "Analysis",
      summary:
        "Reading price itself, then technical tools, then the economics that move currencies. No trades this phase are judged on outcome — only on the quality of the reasoning.",
      modules: [
        {
          id: "fx-w4-price-action",
          order: 5,
          phase: 2,
          title: "Week 4 · Candlesticks and Price Action",
          summary:
            "What a candle records, the few patterns worth knowing, and how swing highs and lows define a trend.",
          atoms: 15,
          topics: [
            "Open, high, low, close; bodies and wicks",
            "Bullish and bearish candles, engulfing patterns, pin bars",
            "Trends, ranges, swing highs and swing lows",
          ],
          curriculum: [
            ["4.1", "Open, high, low and close; candle bodies and wicks"],
            ["4.2", "Bullish and bearish candles, engulfing patterns and pin bars"],
            ["4.3", "Trends, ranges, swing highs, swing lows and market structure"],
            ["4.P", "Practical: annotate historical charts and identify trends without placing trades"],
          ],
          project: "Annotate three historical charts on TradingView: swings, structure and trend, with no trades.",
        },
        {
          id: "fx-w5-technical",
          order: 6,
          phase: 2,
          title: "Week 5 · Technical Analysis",
          summary:
            "Support, resistance and zones; trendlines and moving averages; RSI, MACD and ATR — and what none of them can do.",
          atoms: 13,
          topics: [
            "Support, resistance and supply/demand zones",
            "Trendlines and moving averages",
            "RSI, MACD and ATR",
            "Indicator limitations",
          ],
          curriculum: [
            ["5.1", "Support, resistance and supply/demand zones"],
            ["5.2", "Trendlines, moving averages and market structure"],
            ["5.3", "RSI, MACD, ATR and indicator limitations"],
            ["5.P", "Practical: build a chart-analysis report using a consistent set of tools"],
          ],
          project: "Write a one-page chart-analysis report using the same small toolkit on every chart.",
        },
        {
          id: "fx-w6-fundamental",
          order: 7,
          phase: 2,
          title: "Week 6 · Fundamental Analysis",
          summary:
            "Interest rates, inflation, growth and jobs; the economic calendar; and why markets react to surprises, not to news.",
          atoms: 12,
          topics: [
            "Interest rates, inflation, GDP and employment",
            "Central banks and monetary policy",
            "Economic calendars and high-impact releases",
            "Expectations, surprises and geopolitics",
          ],
          curriculum: [
            ["6.1", "Interest rates, inflation, GDP, employment and central banks"],
            ["6.2", "Economic calendars and high-impact announcements"],
            ["6.3", "Market expectations, monetary policy and geopolitical events"],
            ["6.P", "Practical: explain how an announcement might affect a currency, and why the reaction can differ"],
          ],
          project: "Write a before-and-after note on one high-impact release from the economic calendar.",
        },
        {
          id: "fx-c2-consolidation",
          order: 8,
          phase: 2,
          consolidation: true,
          title: "Consolidation Week · Phase 2 Review and Demo Practice",
          summary:
            "No new theory. Interleaved practice across candles, levels, indicators and the calendar, the phase's common mistakes, a guided week on the demo account, and the Phase 2 checkpoint.",
          atoms: 11,
          topics: [
            "Interleaved practice",
            "The most common Phase 2 mistakes",
            "A guided demo week",
            "The Phase 2 checkpoint",
          ],
          curriculum: [
            ["C2.1", "Interleaved practice: candles, structure, averages, ATR and surprises"],
            ["C2.2", "The most common Phase 2 mistakes"],
            ["C2.3", "A guided demo week: analysis before every trade"],
            ["C2.4", "The Phase 2 checkpoint"],
            ["C2.P", "Checkpoint: A chart-analysis report and a fundamental note on the same pair, written before the week's events and reviewed after"],
          ],
          project: "A chart-analysis report and a fundamental note on the same pair, written before the week's events and reviewed after.",
        },
      ],
    },
    {
      month: 3,
      title: "Phase 3 · Trading Systems and Strategy",
      focus: "Strategy",
      summary:
        "Choosing a trading style, reading several timeframes together, writing a strategy as rules, and testing it honestly.",
      modules: [
        {
          id: "fx-w7-timeframes",
          order: 9,
          phase: 3,
          title: "Week 7 · Multi-Timeframe Analysis",
          summary:
            "Trading styles and the timeframes they use; context from the higher timeframe, execution on the lower one.",
          atoms: 10,
          topics: [
            "Scalping, day, swing and position trading",
            "Higher-timeframe context, lower-timeframe execution",
            "Alignment, entry conditions and invalidation",
          ],
          curriculum: [
            ["7.1", "Scalping, day trading, swing trading and position trading"],
            ["7.2", "Higher-timeframe context and lower-timeframe execution"],
            ["7.3", "Aligning trends, entry conditions and invalidation levels"],
            ["7.P", "Practical: produce a written analysis of one currency pair across three timeframes"],
          ],
          project: "Write a top-down analysis of one pair on the daily, 4-hour and 1-hour charts.",
        },
        {
          id: "fx-w8-strategy",
          order: 10,
          phase: 3,
          title: "Week 8 · Building a Trading Strategy",
          summary:
            "Rules a stranger could follow: objective entries and exits, stops and targets, filters, and a checklist that says when to do nothing.",
          atoms: 11,
          topics: [
            "Objective entry and exit rules",
            "Stop-loss placement, invalidation and targets",
            "Filters, checklists and staying out",
          ],
          curriculum: [
            ["8.1", "Defining objective entry and exit rules"],
            ["8.2", "Stop-loss placement, trade invalidation and profit targets"],
            ["8.3", "Filters, trading checklists and conditions for staying out of the market"],
            ["8.P", "Practical: write a rule-based strategy that another student could follow consistently"],
          ],
          project: "Write your strategy as numbered rules and have another learner apply it to the same chart.",
        },
        {
          id: "fx-w9-backtesting",
          order: 11,
          phase: 3,
          title: "Week 9 · Backtesting and Performance",
          summary:
            "Testing on history, measuring with the right statistics, and the ways a backtest lies to the person who ran it.",
          atoms: 12,
          topics: [
            "Manual and platform-assisted backtesting",
            "Win rate, expectancy, profit factor, maximum drawdown",
            "Sample size, overfitting, slippage and real costs",
          ],
          curriculum: [
            ["9.1", "Manual and platform-assisted backtesting"],
            ["9.2", "Win rate, expectancy, profit factor and maximum drawdown"],
            ["9.3", "Sample size, overfitting, slippage and realistic trading costs"],
            ["9.P", "Practical: test a strategy on historical data and document every qualifying setup"],
          ],
          project: "Backtest your Week 8 strategy with TradingView Bar Replay and log every qualifying setup.",
        },
        {
          id: "fx-c3-consolidation",
          order: 12,
          phase: 3,
          consolidation: true,
          title: "Consolidation Week · Phase 3 Review and Demo Practice",
          summary:
            "No new theory. Interleaved practice across timeframes, strategy rules and backtest statistics, the phase's common mistakes, a guided week on the demo account, and the Phase 3 checkpoint.",
          atoms: 11,
          topics: [
            "Interleaved practice",
            "The most common Phase 3 mistakes",
            "A guided demo week",
            "The Phase 3 checkpoint",
          ],
          curriculum: [
            ["C3.1", "Interleaved practice: reward-to-risk, break-even, expectancy and sizing"],
            ["C3.2", "The most common Phase 3 mistakes"],
            ["C3.3", "A guided demo week: trading the written strategy"],
            ["C3.4", "The Phase 3 checkpoint"],
            ["C3.P", "Checkpoint: Your written strategy applied by another learner with the same result, and a backtest of at least 30 setups"],
          ],
          project: "Your written strategy applied by another learner with the same result, and a backtest of at least 30 setups.",
        },
      ],
    },
    {
      month: 4,
      title: "Phase 4 · Execution, Psychology and Evaluation",
      focus: "Discipline",
      summary:
        "Executing without errors, managing yourself, and governing risk across the whole account. Ends with your trading plan and the theory and risk assessment.",
      modules: [
        {
          id: "fx-w10-execution",
          order: 13,
          phase: 4,
          title: "Week 10 · Trading Platform and Execution",
          summary:
            "The platform in depth, orders placed and managed without mistakes, and every cost that sits between the plan and the result.",
          atoms: 11,
          topics: [
            "Navigating MT5 and TradingView",
            "Placing, modifying and closing orders",
            "Spreads, commissions, swaps, slippage and execution errors",
          ],
          curriculum: [
            ["10.1", "Navigating charting and trading platforms"],
            ["10.2", "Placing, modifying and closing simulated orders"],
            ["10.3", "Spreads, commissions, swaps, slippage and execution errors"],
            ["10.P", "Practical: complete a supervised demo-trading exercise with predefined risk limits"],
          ],
          project: "A supervised demo session: five trades, each within the risk limits set before the session.",
        },
        {
          id: "fx-w11-psychology",
          order: 14,
          phase: 4,
          title: "Week 11 · Psychology and Discipline",
          summary:
            "Fear, greed, FOMO and revenge; the journal and the post-trade review; and how to survive a losing streak.",
          atoms: 12,
          topics: [
            "Fear, greed, FOMO and revenge trading",
            "Journals, rule adherence and post-trade reviews",
            "Loss streaks, overtrading, breaks and emotional control",
          ],
          curriculum: [
            ["11.1", "Fear, greed, FOMO and revenge trading"],
            ["11.2", "Trading journals, rule adherence and post-trade reviews"],
            ["11.3", "Loss streaks, overtrading, breaks and emotional control"],
            ["11.P", "Practical: review simulated trades and identify behavioural mistakes independently of profit or loss"],
          ],
          project: "Review your last twenty demo trades and grade each one on process, not outcome.",
        },
        {
          id: "fx-w12-governance",
          order: 15,
          phase: 4,
          title: "Week 12 · Risk Governance and Readiness",
          summary:
            "Correlated exposure, drawdown limits and risk of ruin; broker due diligence and fraud; and when not to trade.",
          atoms: 11,
          topics: [
            "Exposure across correlated pairs",
            "Capital preservation, drawdown limits, risk of ruin",
            "Broker due diligence, fraud prevention, when not to trade",
          ],
          curriculum: [
            ["12.1", "Exposure across correlated currency pairs"],
            ["12.2", "Capital preservation, drawdown limits and risk of ruin"],
            ["12.3", "Broker due diligence, fraud prevention, and when not to trade"],
            ["12.P", "Practical: submit a complete trading plan and sit the theory and risk-management assessment"],
          ],
          project: "Submit your complete written trading plan.",
        },
        {
          id: "fx-c4-consolidation",
          order: 16,
          phase: 4,
          consolidation: true,
          title: "Consolidation Week · Phase 4 Review and Demo Practice",
          summary:
            "No new theory. Interleaved practice across execution, psychology and risk governance, the phase's common mistakes, a guided week on the demo account, and the Phase 4 checkpoint.",
          atoms: 11,
          topics: [
            "Interleaved practice",
            "The most common Phase 4 mistakes",
            "A guided demo week",
            "The Phase 4 checkpoint",
          ],
          curriculum: [
            ["C4.1", "Interleaved practice: costs, drawdown, exposure and margin"],
            ["C4.2", "The most common Phase 4 mistakes"],
            ["C4.3", "A guided demo week: the full trading plan, unsupervised"],
            ["C4.4", "The Phase 4 checkpoint"],
            ["C4.P", "Checkpoint: Your complete trading plan and the Week 12 theory and risk-management assessment"],
          ],
          project: "Your complete trading plan and the Week 12 theory and risk-management assessment.",
        },
      ],
    },
    {
      month: 5,
      title: "Phase 5 · The Practical Trading Lab",
      focus: "Demonstration",
      summary:
        "Four weeks in which you demonstrate that you can apply what you learned, not simply pass quizzes: a documented backtest, a live-market demo journal, a performance review and a final assessment.",
      modules: [
        {
          id: "fx-w13-lab-backtest",
          order: 17,
          phase: 5,
          type: "project",
          title: "Week 13 · Lab: Strategy Backtesting",
          summary:
            "Required output: a documented historical trade sample — every qualifying setup, wins and losses alike.",
          atoms: 8,
          topics: [
            "Preparing a backtest you can trust",
            "Recording every qualifying setup",
            "Summarising the sample honestly",
          ],
          curriculum: [
            ["13.1", "Preparing the backtest: data, rules and the journal template"],
            ["13.2", "Running the test and recording every qualifying setup"],
            ["13.3", "Summarising the sample and checking it for honesty"],
            ["13.P", "Required output: a documented historical trade sample"],
          ],
          project: "A documented historical sample of at least 50 qualifying setups.",
        },
        {
          id: "fx-w14-lab-demo",
          order: 18,
          phase: 5,
          type: "project",
          title: "Week 14 · Lab: Demo Execution",
          summary:
            "Required output: a live-market simulated trading journal kept in real time on your demo account.",
          atoms: 8,
          topics: [
            "A daily execution routine",
            "Keeping a real-time journal",
            "Comparing planned and actual execution",
          ],
          curriculum: [
            ["14.1", "A daily routine: before, during and after the session"],
            ["14.2", "The live-market journal: what to record, and when"],
            ["14.3", "Execution quality: planned versus actual"],
            ["14.P", "Required output: a live-market simulated trading journal"],
          ],
          project: "A complete live-market demo journal, every entry written at the time.",
        },
        {
          id: "fx-w15-lab-review",
          order: 19,
          phase: 5,
          type: "project",
          title: "Week 15 · Lab: Strategy Review",
          summary:
            "Required output: performance statistics and a rule-compliance report built from your own journal.",
          atoms: 7,
          topics: [
            "Statistics from your own journal",
            "The rule-compliance audit",
            "Deciding what to change, and what not to",
          ],
          curriculum: [
            ["15.1", "Performance statistics from your journal"],
            ["15.2", "The rule-compliance audit"],
            ["15.3", "Deciding what to change, and what not to"],
            ["15.P", "Required output: performance statistics and a rule-compliance report"],
          ],
          project: "A review comparing your demo results with your backtest, and your actions with your rules.",
        },
        {
          id: "fx-w16-lab-final",
          order: 20,
          phase: 5,
          type: "capstone",
          title: "Week 16 · Lab: Final Assessment",
          summary:
            "Required output: your final trading plan, a case study and an oral or recorded presentation.",
          atoms: 8,
          topics: [
            "The final trading plan",
            "The case study",
            "The presentation, and the graduation standard",
          ],
          curriculum: [
            ["16.1", "Assembling the final trading plan"],
            ["16.2", "Writing the case study"],
            ["16.3", "The presentation and the graduation standard"],
            ["16.P", "Required output: trading plan, case study and oral or recorded presentation"],
          ],
          project: "Final trading plan, case study, and an oral or recorded presentation defending both.",
        },
      ],
    },
  ],

  capstone: {
    title: "The Final Assessment",
    summary:
      "Your complete trading plan, a case study of your own trading drawn from the lab, and a ten to fifteen minute oral or recorded presentation in which you explain your strategy, show your risk calculations and answer questions about your records. You pass by demonstrating process. You do not pass, or fail, because of profit.",
    deliverables: [
      "A written trading plan: markets, sessions, strategy rules, risk limits, checklist and review routine",
      "A documented backtest of at least 50 qualifying setups, every one recorded",
      "A live-market demo journal kept in real time through the lab",
      "Performance statistics and a rule-compliance report comparing demo with backtest",
      "A case study of your trading: what worked, what did not, and what you changed and why",
      "An oral or recorded presentation defending the plan and the case study",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Forex Trading: Foundations to Professional Practice",
    covers: "Market mechanics • Risk mathematics • Technical & fundamental analysis • Strategy & backtesting • Execution & psychology",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every lesson check at 70% or above, including the Week 12 theory and risk assessment",
      "Submit every lab output in Weeks 13 to 16",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
      "Meet the graduation standard: sound risk calculations, a strategy you can explain, accurate records and rule adherence — profit alone never decides a pass",
    ],
  },

  /**
   * One checkpoint per phase. The first four sit in the consolidation week
   * after each phase, which the learner spends on the demo account.
   */
  checkpoints: [
    {
      afterMonth: 1,
      title: "Phase 1 checkpoint",
      format:
        "Ten quotes read and ten position sizes calculated by hand, then checked against your spreadsheet calculator. A week of demo practice with the calculator before every trade.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Phase 2 checkpoint",
      format: "A chart-analysis report and a fundamental note on the same pair, written before the week's events and reviewed after.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Phase 3 checkpoint",
      format: "Your written strategy, applied by another learner to the same chart with the same result, and a backtest of at least 30 setups.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Phase 4 checkpoint",
      format: "Your complete trading plan and the Week 12 theory and risk-management assessment.",
      passMark: 70,
    },
    {
      afterMonth: 5,
      title: "Final",
      format: "The four lab outputs and the presentation, assessed against the graduation standard.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order (taught weeks and consolidation weeks). */
export const FOREX_MODULE_IDS = FOREX_COURSE.months.flatMap((m) => m.modules.map((mod) => mod.id));

export default FOREX_COURSE;
