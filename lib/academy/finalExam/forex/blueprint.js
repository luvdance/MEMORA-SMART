/**
 * FINAL CERTIFICATION EXAM — FOREX TRADING
 *
 * The test specification, in the same shape as the Data Analysis blueprint.
 *
 * What this exam certifies, and what it does not. It certifies KNOWLEDGE:
 * market mechanics, exact risk arithmetic, analysis, strategy testing and the
 * governance of risk. It does not, and cannot, certify trading skill or
 * profitability, and passing it is not a statement that the holder is ready
 * to trade real money. The course's graduation standard (Week 16) remains the
 * practical assessment of process; this exam is its theory counterpart.
 *
 * Every numeric item in the bank carries `verify: { fn, args }`, naming a
 * function in lib/academy/forex/engine.js. `npm run test:exam` recomputes it
 * and fails if the keyed option is not the right number, so a candidate can
 * never be marked wrong for doing the arithmetic correctly.
 */

export const DOMAINS = [
  {
    id: "f1-mechanics",
    name: "Market mechanics, quotes and orders",
    short: "Mechanics",
    items: { core: 4, advanced: 2 },
    covers: [
      "Currency pairs, base and quote, majors, minors and exotics",
      "Bid, ask, spread, pips and lots",
      "Brokers, execution, market and pending orders",
      "Sessions, volatility and trading costs",
    ],
    review: ["fx-w1-intro", "fx-w2-mechanics"],
  },
  {
    id: "f2-risk-maths",
    name: "Trading mathematics and risk",
    short: "Risk maths",
    items: { core: 4, advanced: 2 },
    covers: [
      "Pip values on USD-quote, USD-base and cross pairs",
      "Leverage, margin, free margin and margin level",
      "Position sizing and reward-to-risk",
      "Drawdown, recovery and transaction costs",
    ],
    review: ["fx-w3-risk-maths", "fx-c1-consolidation"],
  },
  {
    id: "f3-analysis",
    name: "Technical and fundamental analysis",
    short: "Analysis",
    items: { core: 4, advanced: 2 },
    covers: [
      "Candles, patterns and market structure",
      "Support, resistance, moving averages, RSI, MACD and ATR",
      "Interest rates, inflation, central banks and the calendar",
      "Expectations, surprises and risk sentiment",
    ],
    review: ["fx-w4-price-action", "fx-w5-technical", "fx-w6-fundamental"],
  },
  {
    id: "f4-strategy",
    name: "Strategy, timeframes and backtesting",
    short: "Strategy",
    items: { core: 4, advanced: 2 },
    covers: [
      "Trading styles and multi-timeframe analysis",
      "Objective rules, stops, targets and filters",
      "Win rate, expectancy, profit factor and drawdown",
      "Sample size, overfitting and realistic costs",
    ],
    review: ["fx-w7-timeframes", "fx-w8-strategy", "fx-w9-backtesting"],
  },
  {
    id: "f5-governance",
    name: "Execution, psychology and risk governance",
    short: "Governance",
    items: { core: 4, advanced: 2 },
    covers: [
      "Order execution, slippage and execution errors",
      "Fear, greed, FOMO, revenge and process grading",
      "Correlated exposure, drawdown limits and risk of ruin",
      "Broker regulation, fraud and when not to trade",
    ],
    review: ["fx-w10-execution", "fx-w11-psychology", "fx-w12-governance"],
  },
];

export const BLUEPRINT = {
  id: "mst-fx-final",
  version: "2026.1",
  courseId: "forex-trading",
  courseCode: "FX-101",
  courseTitle: "Forex Trading",
  title: "Memora Smart Certification — Forex Trading",
  subtitle: "Mechanics · Risk mathematics · Analysis · Strategy · Governance",
  briefingNote:
    "Many questions are calculations: pip values, position sizes, margin, drawdown and statistics. Every one has been recomputed by the same engine the lessons use, so do the arithmetic carefully. The rest test judgement. This exam certifies knowledge of trading and risk; it does not certify that anyone will be profitable or is ready to trade real money.",

  requiresModules: [
    "fx-w1-intro",
    "fx-w2-mechanics",
    "fx-w3-risk-maths",
    "fx-c1-consolidation",
    "fx-w4-price-action",
    "fx-w5-technical",
    "fx-w6-fundamental",
    "fx-c2-consolidation",
    "fx-w7-timeframes",
    "fx-w8-strategy",
    "fx-w9-backtesting",
    "fx-c3-consolidation",
    "fx-w10-execution",
    "fx-w11-psychology",
    "fx-w12-governance",
    "fx-c4-consolidation",
    "fx-w13-lab-backtest",
    "fx-w14-lab-demo",
    "fx-w15-lab-review",
    "fx-w16-lab-final",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 75,
  attemptLimit: null,
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Forex Trading: Foundations to Professional Practice",
    covers: "Market mechanics • Risk mathematics • Technical & fundamental analysis • Strategy & backtesting • Execution & psychology",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
