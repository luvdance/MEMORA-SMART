/**
 * ASSESSMENTS · FOREX TRADING · WEEK 3
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l08-pip-values": {
    lessonId: "fx-l08-pip-values",
    passMark: 70,
    questions: [
      {
        id: "fxq08-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-pip-value-usd-quote",
        prompt: "What is one pip worth on 0.70 lots of AUD/USD?",
        options: [
          { id: "a", text: "$0.70" },
          { id: "b", text: "$7.00" },
          { id: "c", text: "$70.00" },
          { id: "d", text: "It depends on the price" },
        ],
        correct: "b",
        explanation: "With USD as the quote currency, one pip is $10 per lot: $10 × 0.70 = $7.00, whatever the price.",
        whyWrong: {
          a: "That would be the value on 0.07 lots.",
          c: "That would be the value on 7 lots.",
          d: "When the quote currency is USD, the pip value in dollars is fixed.",
        },
      },
      {
        id: "fxq08-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-pip-value-usd-base",
        prompt: "USD/JPY is at 125.00. What is one pip worth on 1 standard lot, in dollars?",
        options: [
          { id: "a", text: "$10.00" },
          { id: "b", text: "$8.00" },
          { id: "c", text: "$12.50" },
          { id: "d", text: "$1,000" },
        ],
        correct: "b",
        explanation: "A pip on one lot is ¥1,000. Converted at 125.00: ¥1,000 ÷ 125 = $8.00.",
        whyWrong: {
          a: "$10 applies only when USD is the quote currency.",
          c: "That multiplies by the price instead of dividing.",
          d: "¥1,000 is the pip value in YEN. It must be converted to dollars.",
        },
      },
      {
        id: "fxq08-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-pip-value-cross",
        prompt:
          "You size an EUR/GBP trade assuming $10 per pip per lot. GBP/USD is 1.2700. What is the real pip value per lot, and what does your mistake do?",
        options: [
          { id: "a", text: "$10; there is no mistake" },
          { id: "b", text: "$12.70; you are risking about 27% more than you planned" },
          { id: "c", text: "$7.87; you are risking less than planned" },
          { id: "d", text: "£12.70; the currency does not matter" },
        ],
        correct: "b",
        explanation: "A pip on EUR/GBP is £10 per lot, and £10 × 1.2700 = $12.70. Sizing at $10 understates the risk by 27%.",
        whyWrong: {
          a: "$10 per pip only holds for pairs quoted in USD.",
          c: "That divides by the rate. Pounds are converted to dollars by MULTIPLYING by GBP/USD.",
          d: "The pip is £10, which is $12.70. Your account is in dollars, so the conversion matters.",
        },
      },
      {
        id: "fxq08-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-contract-spec",
        prompt: "In MT5, where do you find a symbol's contract size, volume step and swap rates?",
        options: [
          { id: "a", text: "In the Specification window for that symbol" },
          { id: "b", text: "In the Navigator's list of indicators" },
          { id: "c", text: "Only by emailing the broker" },
          { id: "d", text: "In the chart's colour settings" },
        ],
        correct: "a",
        explanation: "Right-click the symbol in Market Watch and choose Specification. Read it before trading any symbol for the first time.",
        whyWrong: {
          b: "The Navigator lists indicators, scripts and accounts, not contract details.",
          c: "The details are published in the platform; emailing is unnecessary.",
          d: "Chart settings control appearance only.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l09-leverage-margin": {
    lessonId: "fx-l09-leverage-margin",
    passMark: 70,
    questions: [
      {
        id: "fxq09-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-margin",
        prompt: "At 1:50 leverage, what margin is needed for a position worth $20,000?",
        options: [
          { id: "a", text: "$40" },
          { id: "b", text: "$400" },
          { id: "c", text: "$1,000" },
          { id: "d", text: "$20,000" },
        ],
        correct: "b",
        explanation: "Margin = notional ÷ leverage = $20,000 ÷ 50 = $400.",
        whyWrong: {
          a: "That divides by 500, not 50.",
          c: "That is 1:20 leverage.",
          d: "That is the full position; with leverage you deposit only a fraction of it.",
        },
      },
      {
        id: "fxq09-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-margin",
        prompt: "Which statement about margin is TRUE?",
        options: [
          { id: "a", text: "Margin is a fee you pay the broker" },
          { id: "b", text: "A trade can never lose more than its margin" },
          { id: "c", text: "Margin is a deposit locked while the trade is open; losses are on the full position" },
          { id: "d", text: "Higher leverage reduces the loss on a trade" },
        ],
        correct: "c",
        explanation: "Margin is returned when the position closes. Losses are calculated on the full notional value and can exceed it.",
        whyWrong: {
          a: "Margin is not spent; it is held and released.",
          b: "Losses can be far larger than the margin. The stop-loss limits them, not the margin.",
          d: "Leverage changes the margin needed, not the loss per pip, which depends on lot size.",
        },
      },
      {
        id: "fxq09-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-free-margin-level",
        prompt: "Equity $600, used margin $400. What is the margin level?",
        options: [
          { id: "a", text: "66.7%" },
          { id: "b", text: "150%" },
          { id: "c", text: "200%" },
          { id: "d", text: "$200" },
        ],
        correct: "b",
        explanation: "Margin level = equity ÷ used margin × 100 = 600 ÷ 400 × 100 = 150%.",
        whyWrong: {
          a: "That divides margin by equity, the wrong way round.",
          c: "That would need equity of $800.",
          d: "$200 is the FREE margin (equity − used margin), not the margin level.",
        },
      },
      {
        id: "fxq09-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-margin-call",
        prompt: "What happens at the stop-out level?",
        options: [
          { id: "a", text: "You receive a bonus" },
          { id: "b", text: "The broker begins closing your positions automatically" },
          { id: "c", text: "Your leverage is increased" },
          { id: "d", text: "Your stop-losses are removed" },
        ],
        correct: "b",
        explanation: "At stop-out the broker liquidates positions, usually the largest loser first, to protect itself and you from further loss.",
        whyWrong: {
          a: "There is nothing rewarding about a stop-out.",
          c: "Brokers do not increase leverage in a margin emergency.",
          d: "Your stops stay in place; the broker simply closes positions before they reach them.",
        },
      },
      {
        id: "fxq09-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-effective-leverage",
        prompt:
          "Two traders both have 1:500 accounts. A holds $2,000 of positions on $1,000 equity; B holds $80,000 on $1,000. Who is using more leverage?",
        options: [
          { id: "a", text: "Neither; both use 1:500" },
          { id: "b", text: "A, at 2×" },
          { id: "c", text: "B, at 80×" },
          { id: "d", text: "It cannot be known without their stop-losses" },
        ],
        correct: "c",
        explanation: "Effective leverage is exposure ÷ equity: A uses 2×, B 80×. The account maximum is only a ceiling.",
        whyWrong: {
          a: "1:500 is the limit, not what they use.",
          b: "A uses only 2×, the lower of the two.",
          d: "Effective leverage is defined by exposure and equity alone. Stops affect risk, which is a separate question.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l10-position-sizing": {
    lessonId: "fx-l10-position-sizing",
    passMark: 70,
    questions: [
      {
        id: "fxq10-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-position-size",
        prompt: "Balance $2,000, risk 1%, stop 50 pips on EUR/USD ($10 per pip per lot). What lot size?",
        options: [
          { id: "a", text: "0.02" },
          { id: "b", text: "0.04" },
          { id: "c", text: "0.40" },
          { id: "d", text: "0.20" },
        ],
        correct: "b",
        explanation: "Risk $20 ÷ (50 × $10) = 0.04 lots.",
        whyWrong: {
          a: "0.02 lots risks only $10, which is 0.5%.",
          c: "0.40 lots risks $200, which is 10% of the account.",
          d: "0.20 lots risks $100, which is 5%.",
        },
      },
      {
        id: "fxq10-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-position-size",
        prompt: "Your stop-loss needs to be twice as far away as usual. Keeping risk at 1%, what happens to the lot size?",
        options: [
          { id: "a", text: "It doubles" },
          { id: "b", text: "It halves" },
          { id: "c", text: "It stays the same" },
          { id: "d", text: "You should tighten the stop instead" },
        ],
        correct: "b",
        explanation: "Money at risk is fixed, so a stop twice as wide needs a position half the size.",
        whyWrong: {
          a: "Doubling would quadruple the risk.",
          c: "The same size with twice the stop doubles the risk to 2%.",
          d: "The stop belongs where the idea is proved wrong. Tightening it to fit a lot size reverses the correct order.",
        },
      },
      {
        id: "fxq10-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-reward-risk",
        prompt: "A strategy targets 3R. What win rate is needed to break even before costs?",
        options: [
          { id: "a", text: "75%" },
          { id: "b", text: "50%" },
          { id: "c", text: "33.3%" },
          { id: "d", text: "25%" },
        ],
        correct: "d",
        explanation: "1 ÷ (1 + 3) = 25%. One win of +3R pays for three losses of −1R.",
        whyWrong: {
          a: "That would be the break-even rate at a reward of one third of the risk.",
          b: "That is the break-even rate at 1R.",
          c: "That is the break-even rate at 2R.",
        },
      },
      {
        id: "fxq10-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-drawdown",
        prompt: "An account falls 50%. What gain is needed to recover?",
        options: [
          { id: "a", text: "50%" },
          { id: "b", text: "75%" },
          { id: "c", text: "100%" },
          { id: "d", text: "150%" },
        ],
        correct: "c",
        explanation: "$1,000 → $500. To get back to $1,000, $500 must double: a 100% gain.",
        whyWrong: {
          a: "50% of $500 is $250, leaving you at $750.",
          b: "75% of $500 reaches only $875.",
          d: "150% overshoots, to $1,250.",
        },
      },
      {
        id: "fxq10-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-transaction-costs",
        prompt:
          "A scalping strategy risks 5 pips per trade on EUR/USD and pays a 1.0-pip spread plus commission equal to 0.7 pips. Roughly what share of each trade's risk do costs take?",
        options: [
          { id: "a", text: "About 3%" },
          { id: "b", text: "About 14%" },
          { id: "c", text: "About 34%" },
          { id: "d", text: "Nothing; costs are paid separately" },
        ],
        correct: "c",
        explanation: "Costs are 1.7 pips against 5 pips of risk: 1.7 ÷ 5 = 34%. Every trade starts a third of an R behind, which very few strategies can overcome.",
        whyWrong: {
          a: "That treats the cost as tiny in dollars, ignoring how small the risk is.",
          b: "That would be the share with only the commission.",
          d: "Spread and commission come out of the same account as the profit; they are part of every result.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
