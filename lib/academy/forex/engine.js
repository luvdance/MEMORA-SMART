/**
 * FOREX ENGINE — the arithmetic and chart logic behind the Forex Trading course.
 *
 * CLIENT-SAFE. Imported by the forex practice components (FxCalc, CandleChart,
 * OrderTicket) AND by validateContent.mjs, so the number a learner is graded
 * against and the number the build verifies come from the same function.
 *
 * Every calculation exercise in the course names one of these functions and
 * its inputs. The validator recomputes the answer and fails the build if the
 * lesson's stated answer disagrees. Position sizing done in an author's head
 * is exactly the kind of arithmetic that goes wrong, and a beginner taught a
 * wrong lot size loses real money later.
 *
 * Conventions used everywhere in the course:
 *   · a "lot" means a standard lot of 100,000 units of the BASE currency
 *   · the account currency is US dollars unless an exercise says otherwise
 *   · prices are quoted as BASE/QUOTE: EUR/USD 1.0850 means 1 EUR = 1.0850 USD
 */

export const LOT_UNITS = { standard: 100000, mini: 10000, micro: 1000, nano: 100 };

const round = (x, dp = 2) => {
  const f = 10 ** dp;
  return Math.round((x + Number.EPSILON) * f) / f;
};

export function splitPair(pair) {
  const [base, quote] = String(pair).toUpperCase().split("/");
  return { base, quote };
}

/** 0.01 for yen pairs, 0.0001 for everything else the course trades. */
export function pipSize(pair) {
  return splitPair(pair).quote === "JPY" ? 0.01 : 0.0001;
}

/** Signed distance between two prices, in pips. */
export function pipsBetween({ pair, from, to }) {
  return round((to - from) / pipSize(pair), 1);
}

/** Spread in pips: ask minus bid. */
export function spreadPips({ pair, bid, ask }) {
  return round((ask - bid) / pipSize(pair), 1);
}

/** Units of base currency for a lot size. 0.25 lots = 25,000 units. */
export function unitsFor({ lots }) {
  return round(lots * LOT_UNITS.standard, 0);
}

/**
 * Value of one pip, in the ACCOUNT currency (USD).
 *
 *   quote is USD   (EUR/USD)  pip × units                       = $10 per lot
 *   base is USD    (USD/JPY)  pip × units ÷ price
 *   neither        (EUR/GBP)  pip × units × quoteToUsd  (GBP/USD rate)
 */
export function pipValue({ pair, lots, price, quoteToUsd }) {
  const { base, quote } = splitPair(pair);
  const inQuote = pipSize(pair) * lots * LOT_UNITS.standard;
  if (quote === "USD") return round(inQuote, 2);
  if (base === "USD") return round(inQuote / price, 2);
  return round(inQuote * quoteToUsd, 2);
}

/** Profit or loss in USD for a closed trade. */
export function tradePnL({ pair, side, lots, entry, exit, price, quoteToUsd }) {
  const dir = side === "sell" ? -1 : 1;
  const pips = ((exit - entry) / pipSize(pair)) * dir;
  // A pip's value in USD depends on the price for USD-based pairs; the exit
  // price is what the trade is converted at.
  const pv = pipValue({ pair, lots, price: price ?? exit, quoteToUsd });
  return round(pips * pv, 2);
}

/** The size of the position in USD — what leverage is measured against. */
export function notionalUsd({ pair, lots, price, baseToUsd }) {
  const { base, quote } = splitPair(pair);
  const units = lots * LOT_UNITS.standard;
  if (base === "USD") return round(units, 2);
  if (quote === "USD") return round(units * price, 2);
  return round(units * baseToUsd, 2);
}

/** Margin the broker locks to hold the position. */
export function marginRequired({ pair, lots, price, leverage, baseToUsd }) {
  return round(notionalUsd({ pair, lots, price, baseToUsd }) / leverage, 2);
}

/** Effective leverage actually in use: exposure ÷ equity. */
export function effectiveLeverage({ exposure, equity }) {
  return round(exposure / equity, 2);
}

/** Margin level %, the number margin calls and stop-outs are triggered on. */
export function marginLevel({ equity, usedMargin }) {
  return round((equity / usedMargin) * 100, 1);
}

export function freeMargin({ equity, usedMargin }) {
  return round(equity - usedMargin, 2);
}

/**
 * Position size in lots, rounded DOWN to the broker's 0.01 step: you never
 * round up into more risk than you planned.
 */
export function positionSize({ balance, riskPercent, stopPips, pipValuePerLot }) {
  const riskMoney = balance * (riskPercent / 100);
  const lots = riskMoney / (stopPips * pipValuePerLot);
  return Math.floor(lots * 100 + 1e-9) / 100;
}

/** Money at risk if the stop is hit. */
export function riskAmount({ stopPips, pipValuePerLot, lots }) {
  return round(stopPips * pipValuePerLot * lots, 2);
}

export function riskMoney({ balance, riskPercent }) {
  return round(balance * (riskPercent / 100), 2);
}

/** Reward-to-risk as a single number: 2 means "2R", twice the risk. */
export function rewardToRisk({ entry, stop, target }) {
  return round(Math.abs(target - entry) / Math.abs(entry - stop), 2);
}

/** Win rate needed just to break even at a given reward-to-risk. */
export function breakevenWinRate({ rr }) {
  return round((1 / (1 + rr)) * 100, 1);
}

/** Cost of the spread in USD for a round trip. */
export function spreadCost({ spreadPips: s, pipValuePerLot, lots }) {
  return round(s * pipValuePerLot * lots, 2);
}

/** Total cost of a trade: spread + commission (per lot, round trip) + swap. */
export function tradeCost({ spreadPips: s, pipValuePerLot, lots, commissionPerLot = 0, swap = 0 }) {
  return round(s * pipValuePerLot * lots + commissionPerLot * lots + swap, 2);
}

/** Gain needed to recover a percentage loss. A 50% loss needs a 100% gain. */
export function recoveryNeeded({ lossPercent }) {
  const l = lossPercent / 100;
  return round((l / (1 - l)) * 100, 1);
}

/** Balance after n consecutive losses of a fixed percentage. */
export function balanceAfterLosses({ balance, riskPercent, losses }) {
  return round(balance * (1 - riskPercent / 100) ** losses, 2);
}

/* ── Performance statistics ─────────────────────────────────────────── */

/** `results` are trade outcomes in money or in R. */
export function winRate({ results }) {
  const wins = results.filter((r) => r > 0).length;
  return round((wins / results.length) * 100, 1);
}

export function profitFactor({ results }) {
  const gross = results.filter((r) => r > 0).reduce((a, b) => a + b, 0);
  const loss = Math.abs(results.filter((r) => r < 0).reduce((a, b) => a + b, 0));
  return round(gross / loss, 2);
}

/** Average outcome per trade. In R, this is the expectancy in R. */
export function expectancy({ results }) {
  return round(results.reduce((a, b) => a + b, 0) / results.length, 2);
}

/** Expectancy from the formula: (W × avg win) − (L × avg loss). */
export function expectancyFromRates({ winRatePercent, avgWin, avgLoss }) {
  const w = winRatePercent / 100;
  return round(w * avgWin - (1 - w) * avgLoss, 2);
}

/** Running equity from a starting balance and a list of money results. */
export function equityCurve({ start, results }) {
  const curve = [start];
  for (const r of results) curve.push(round(curve[curve.length - 1] + r, 2));
  return curve;
}

/** Largest peak-to-trough fall, as money and as a percentage of the peak. */
export function maxDrawdown({ start, results }) {
  const curve = equityCurve({ start, results });
  let peak = curve[0];
  let worst = 0;
  let worstPct = 0;
  for (const v of curve) {
    peak = Math.max(peak, v);
    if (peak - v > worst) {
      worst = peak - v;
      worstPct = ((peak - v) / peak) * 100;
    }
  }
  return { amount: round(worst, 2), percent: round(worstPct, 1) };
}

export function maxDrawdownPercent(args) {
  return maxDrawdown(args).percent;
}

export function maxDrawdownAmount(args) {
  return maxDrawdown(args).amount;
}

/** Longest run of consecutive losing trades. */
export function longestLosingStreak({ results }) {
  let run = 0;
  let best = 0;
  for (const r of results) {
    run = r < 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

/* ── Indicators (used to check the numbers the lessons quote) ───────── */

export function sma({ values, period }) {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return round(slice.reduce((a, b) => a + b, 0) / period, 5);
}

/** True range of a candle given the previous close. */
export function trueRange({ high, low, prevClose }) {
  return round(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)), 5);
}

/* ── Candles and patterns ───────────────────────────────────────────── */

/**
 * A candle is [open, high, low, close] or { o, h, l, c }. The definitions
 * below are deliberately strict and written out, because the validator uses
 * them to prove that the candle an exercise calls "the bullish engulfing
 * candle" is the ONLY one on the chart that qualifies. An exercise with two
 * defensible answers and one accepted is worse than no exercise.
 */
export function toCandle(c) {
  if (Array.isArray(c)) return { o: c[0], h: c[1], l: c[2], c: c[3] };
  return c;
}

export function candleIsValid(raw) {
  const c = toCandle(raw);
  return c.h >= Math.max(c.o, c.c) && c.l <= Math.min(c.o, c.c) && c.h > c.l;
}

const body = (c) => Math.abs(c.c - c.o);
const range = (c) => c.h - c.l;
const upperWick = (c) => c.h - Math.max(c.o, c.c);
const lowerWick = (c) => Math.min(c.o, c.c) - c.l;
const bull = (c) => c.c > c.o;
const bear = (c) => c.c < c.o;

export const PATTERNS = {
  bullish: {
    label: "Bullish candle",
    test: (d, i) => bull(d[i]),
  },
  bearish: {
    label: "Bearish candle",
    test: (d, i) => bear(d[i]),
  },
  doji: {
    label: "Doji",
    // Open and close almost equal: body no more than a tenth of the range.
    test: (d, i) => body(d[i]) <= range(d[i]) * 0.1,
  },
  "bullish-engulfing": {
    label: "Bullish engulfing",
    // A bearish candle, then a bullish candle whose body completely covers it.
    test: (d, i) =>
      i > 0 &&
      bear(d[i - 1]) &&
      bull(d[i]) &&
      d[i].o <= d[i - 1].c &&
      d[i].c >= d[i - 1].o &&
      body(d[i]) > body(d[i - 1]),
  },
  "bearish-engulfing": {
    label: "Bearish engulfing",
    test: (d, i) =>
      i > 0 &&
      bull(d[i - 1]) &&
      bear(d[i]) &&
      d[i].o >= d[i - 1].c &&
      d[i].c <= d[i - 1].o &&
      body(d[i]) > body(d[i - 1]),
  },
  "bullish-pin": {
    label: "Bullish pin bar",
    // A long lower wick (two thirds of the range or more) rejecting lower
    // prices, a small body near the top, and little upper wick.
    test: (d, i) =>
      lowerWick(d[i]) >= range(d[i]) * 0.6 &&
      body(d[i]) <= range(d[i]) * 0.3 &&
      upperWick(d[i]) <= range(d[i]) * 0.15,
  },
  "bearish-pin": {
    label: "Bearish pin bar",
    test: (d, i) =>
      upperWick(d[i]) >= range(d[i]) * 0.6 &&
      body(d[i]) <= range(d[i]) * 0.3 &&
      lowerWick(d[i]) <= range(d[i]) * 0.15,
  },
  "swing-high": {
    label: "Swing high",
    // A high above the highs of the two candles either side of it.
    test: (d, i) =>
      i >= 2 &&
      i <= d.length - 3 &&
      [i - 2, i - 1, i + 1, i + 2].every((j) => d[i].h > d[j].h),
  },
  "swing-low": {
    label: "Swing low",
    test: (d, i) =>
      i >= 2 &&
      i <= d.length - 3 &&
      [i - 2, i - 1, i + 1, i + 2].every((j) => d[i].l < d[j].l),
  },
};

/** Indices of every candle matching a named pattern. */
export function findPattern(data, pattern) {
  const spec = PATTERNS[pattern];
  if (!spec) throw new Error(`unknown pattern "${pattern}"`);
  const d = data.map(toCandle);
  return d.map((_, i) => i).filter((i) => spec.test(d, i));
}

/**
 * Trend from swing points: higher highs AND higher lows is an uptrend, lower
 * highs AND lower lows a downtrend, anything else a range. The course's
 * definition of market structure, as code.
 */
export function classifyStructure(data) {
  const highs = findPattern(data, "swing-high").map((i) => toCandle(data[i]).h);
  const lows = findPattern(data, "swing-low").map((i) => toCandle(data[i]).l);
  if (highs.length < 2 || lows.length < 2) return "unclear";
  const rising = (xs) => xs.every((x, i) => i === 0 || x > xs[i - 1]);
  const falling = (xs) => xs.every((x, i) => i === 0 || x < xs[i - 1]);
  if (rising(highs) && rising(lows)) return "uptrend";
  if (falling(highs) && falling(lows)) return "downtrend";
  return "range";
}

/* ── Order tickets ──────────────────────────────────────────────────── */

export const ORDER_TYPES = {
  market: "Market execution",
  "buy-limit": "Buy Limit",
  "sell-limit": "Sell Limit",
  "buy-stop": "Buy Stop",
  "sell-stop": "Sell Stop",
};

export function sideOf(type, side) {
  if (type === "market") return side;
  return type.startsWith("buy") ? "buy" : "sell";
}

/**
 * Is this order something a real platform would accept? Returns a list of
 * plain-English problems; empty means valid. These are the same rejections
 * MetaTrader gives ("Invalid stops", "Invalid price"), explained.
 */
export function checkOrder({ type, side, bid, ask, entry, sl, tp }) {
  const problems = [];
  const s = sideOf(type, side);
  const price = type === "market" ? (s === "buy" ? ask : bid) : entry;

  if (type === "buy-limit" && !(entry < ask))
    problems.push("A Buy Limit must sit BELOW the current ask: it buys a dip.");
  if (type === "sell-limit" && !(entry > bid))
    problems.push("A Sell Limit must sit ABOVE the current bid: it sells a rally.");
  if (type === "buy-stop" && !(entry > ask))
    problems.push("A Buy Stop must sit ABOVE the current ask: it buys a breakout.");
  if (type === "sell-stop" && !(entry < bid))
    problems.push("A Sell Stop must sit BELOW the current bid: it sells a breakdown.");

  if (sl != null) {
    if (s === "buy" && !(sl < price)) problems.push("On a buy, the stop-loss must be below the entry price.");
    if (s === "sell" && !(sl > price)) problems.push("On a sell, the stop-loss must be above the entry price.");
  }
  if (tp != null) {
    if (s === "buy" && !(tp > price)) problems.push("On a buy, the take-profit must be above the entry price.");
    if (s === "sell" && !(tp < price)) problems.push("On a sell, the take-profit must be below the entry price.");
  }
  return problems;
}

/** Entry price a ticket would fill at (before slippage). */
export function fillPrice({ type, side, bid, ask, entry }) {
  if (type !== "market") return entry;
  return side === "buy" ? ask : bid;
}

/** The functions an exercise may name in `check.fn`. */
export const CALCULATORS = {
  pipsBetween,
  spreadPips,
  unitsFor,
  pipValue,
  tradePnL,
  notionalUsd,
  marginRequired,
  effectiveLeverage,
  marginLevel,
  freeMargin,
  positionSize,
  riskAmount,
  riskMoney,
  rewardToRisk,
  breakevenWinRate,
  spreadCost,
  tradeCost,
  recoveryNeeded,
  balanceAfterLosses,
  winRate,
  profitFactor,
  expectancy,
  expectancyFromRates,
  maxDrawdownPercent,
  maxDrawdownAmount,
  longestLosingStreak,
  sma,
  trueRange,
};
