/**
 * ASSESSMENTS · FOREX TRADING · WEEK 2
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l05-brokers-execution": {
    lessonId: "fx-l05-brokers-execution",
    passMark: 70,
    questions: [
      {
        id: "fxq05-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-market-tiers",
        prompt: "What does a liquidity provider do?",
        options: [
          { id: "a", text: "Lends money to retail traders" },
          { id: "b", text: "Continuously quotes prices at which it will buy and sell" },
          { id: "c", text: "Sets the official exchange rate for each country" },
          { id: "d", text: "Writes the trading platform software" },
        ],
        correct: "b",
        explanation:
          "Liquidity providers, mostly large banks and specialist market makers, stream two-way prices to brokers and institutions. Their quotes are what make it possible to trade instantly.",
        whyWrong: {
          a: "Leverage is provided by your broker, not by liquidity providers lending you money.",
          c: "In the OTC forex market there is no single official rate set by anyone for trading purposes.",
          d: "MT5 is written by MetaQuotes, a software company.",
        },
      },
      {
        id: "fxq05-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-broker-models",
        prompt: "Why does a market-maker broker need especially strong regulation?",
        options: [
          { id: "a", text: "Because it charges commission" },
          { id: "b", text: "Because it takes the other side of client trades, so it can profit when clients lose" },
          { id: "c", text: "Because it only offers exotic pairs" },
          { id: "d", text: "It does not; market makers are always safer" },
        ],
        correct: "b",
        explanation:
          "When the broker is your counterparty, your loss is its gain. That conflict of interest is manageable only with strict rules on pricing, execution and the separation of client money.",
        whyWrong: {
          a: "Commission is typical of ECN-style accounts. Market makers are usually paid through the spread.",
          c: "Market makers commonly offer all kinds of pairs; the model says nothing about which.",
          d: "No model is automatically safer. Regulation and supervision are what protect clients.",
        },
      },
      {
        id: "fxq05-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-participants",
        prompt: "Which participant is the SMALLEST by trading volume?",
        options: [
          { id: "a", text: "Central banks" },
          { id: "b", text: "Large commercial banks" },
          { id: "c", text: "Retail traders" },
          { id: "d", text: "Pension funds" },
        ],
        correct: "c",
        explanation:
          "Retail traders are a tiny share of total forex volume. Large moves are driven by banks, institutions and policy, which is why retail traders try to anticipate those flows.",
        whyWrong: {
          a: "Central banks can trade enormous amounts when they intervene, and they move markets with policy alone.",
          b: "The largest banks are the core of the interbank market.",
          d: "Pension funds move very large sums between countries.",
        },
      },
      {
        id: "fxq05-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-execution",
        prompt:
          "You sell EUR/USD at market when the bid shows 1.08620. Your trade opens at 1.08605. What happened, and how much?",
        options: [
          { id: "a", text: "Positive slippage of 1.5 pips" },
          { id: "b", text: "Negative slippage of 1.5 pips" },
          { id: "c", text: "Negative slippage of 15 pips" },
          { id: "d", text: "A requote" },
        ],
        correct: "b",
        explanation:
          "On a sell, a LOWER fill is worse: you sold for less than you expected. (1.08620 − 1.08605) ÷ 0.0001 = 1.5 pips against you.",
        whyWrong: {
          a: "Positive slippage on a sell would be a HIGHER fill. You got less, which is worse.",
          c: "0.00015 is 1.5 pips, not 15. The fifth decimal is a tenth of a pip.",
          d: "A requote is an offer of a new price under instant execution. Here the order filled.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l06-order-types": {
    lessonId: "fx-l06-order-types",
    passMark: 70,
    questions: [
      {
        id: "fxq06-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-market-order",
        prompt: "A market SELL order fills at which price?",
        options: [
          { id: "a", text: "The ask" },
          { id: "b", text: "The bid" },
          { id: "c", text: "The last candle's close" },
          { id: "d", text: "A price you type in" },
        ],
        correct: "b",
        explanation: "Sells fill at the bid, buys at the ask. (Subject to slippage.)",
        whyWrong: {
          a: "The ask is the price for buying.",
          c: "Market orders fill at the live bid or ask, not a historical price.",
          d: "Typing a price is what you do for a pending order.",
        },
      },
      {
        id: "fxq06-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-pending-orders",
        prompt:
          "USD/JPY is at 150.20. You want to BUY only if price breaks above resistance at 150.80. Which order?",
        options: [
          { id: "a", text: "Buy Limit at 150.80" },
          { id: "b", text: "Buy Stop at 150.80" },
          { id: "c", text: "Sell Stop at 150.80" },
          { id: "d", text: "Sell Limit at 150.80" },
        ],
        correct: "b",
        explanation: "Buying above the current price, once price has proved strength, is a Buy Stop.",
        whyWrong: {
          a: "A Buy Limit buys BELOW the current price. MT5 would reject one placed above it.",
          c: "A Sell Stop sells below the current price.",
          d: "A Sell Limit sells a rally. You want to buy.",
        },
      },
      {
        id: "fxq06-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-pending-choice",
        prompt: "Which pair of statements is correct?",
        options: [
          { id: "a", text: "Limits trade at a better price than now; stops trade after price has moved further" },
          { id: "b", text: "Limits are for buying; stops are for selling" },
          { id: "c", text: "Limits close trades; stops open them" },
          { id: "d", text: "Limits and stops are the same thing with different names" },
        ],
        correct: "a",
        explanation:
          "A limit gets you a better price: buy lower, sell higher. A stop waits for proof: buy higher, sell lower, after a break.",
        whyWrong: {
          b: "There are buy and sell versions of both.",
          c: "All four pending orders open trades. Stop-loss and take-profit are what close them.",
          d: "They sit on opposite sides of the price and express opposite ideas.",
        },
      },
      {
        id: "fxq06-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-stop-loss",
        prompt:
          "You are long EUR/USD with a stop-loss at 1.08000. Price falls to 1.08030. What should you NOT do?",
        options: [
          { id: "a", text: "Leave the stop where it is" },
          { id: "b", text: "Move the stop down to 1.07700 to give the trade room" },
          { id: "c", text: "Close the trade early if your plan's exit rule says so" },
          { id: "d", text: "Write the situation in your journal" },
        ],
        correct: "b",
        explanation:
          "Moving a stop further away increases the loss you agreed to take. Stops may be moved to reduce risk, never to increase it.",
        whyWrong: {
          a: "Leaving the stop is exactly what the plan intended.",
          c: "Exiting earlier under a written rule reduces risk and is acceptable.",
          d: "Recording what happened, and how you felt, is always correct.",
        },
      },
      {
        id: "fxq06-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-take-profit",
        prompt:
          "You SELL GBP/USD at 1.26400. Where must the take-profit be?",
        options: [
          { id: "a", text: "Above 1.26400" },
          { id: "b", text: "Below 1.26400" },
          { id: "c", text: "Exactly at 1.26400" },
          { id: "d", text: "Anywhere; it is optional" },
        ],
        correct: "b",
        explanation: "A sell profits as price falls, so its target is below the entry.",
        whyWrong: {
          a: "Above the entry is where a sell's stop-loss goes.",
          c: "A target at the entry price is no target; the trade would close for minus the spread.",
          d: "It is optional on the platform, but if set it must be below the entry; MT5 rejects it otherwise.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l07-sessions-costs": {
    lessonId: "fx-l07-sessions-costs",
    passMark: 70,
    questions: [
      {
        id: "fxq07-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-sessions",
        prompt: "Which window is usually the most active for EUR/USD?",
        options: [
          { id: "a", text: "The Sydney session" },
          { id: "b", text: "The London–New York overlap" },
          { id: "c", text: "Late New York afternoon" },
          { id: "d", text: "Saturday" },
        ],
        correct: "b",
        explanation:
          "Both the euro's and the dollar's biggest markets are open together. In the northern winter that is about 14:00–18:00 in Lagos.",
        whyWrong: {
          a: "Sydney is the quietest session for EUR/USD.",
          c: "Activity falls as New York heads for its close.",
          d: "The market is closed at the weekend.",
        },
      },
      {
        id: "fxq07-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-weekly-hours",
        prompt: "Why is holding a trade over the weekend risky?",
        options: [
          { id: "a", text: "Brokers close all trades on Friday" },
          { id: "b", text: "Monday can open beyond your stop-loss, so it may fill at a much worse price" },
          { id: "c", text: "Swaps are charged five times on Friday" },
          { id: "d", text: "It is not risky; nothing happens at weekends" },
        ],
        correct: "b",
        explanation:
          "Events continue over the weekend. If Monday's first price is past your stop, the stop fills at the first available price, which can be far worse than its level.",
        whyWrong: {
          a: "Most brokers let you hold positions over the weekend.",
          c: "Swap for the weekend is usually charged once, as a triple swap midweek (commonly Wednesday). It is a cost, but not the main risk.",
          d: "Elections, policy announcements and crises happen at weekends too.",
        },
      },
      {
        id: "fxq07-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-volatility-sessions",
        prompt:
          "You notice your USD/JPY trades placed at 03:00 Lagos time move more than your EUR/USD trades at the same hour. Why?",
        options: [
          { id: "a", text: "USD/JPY is always more volatile" },
          { id: "b", text: "03:00 Lagos is during the Tokyo session, when yen pairs are most active" },
          { id: "c", text: "Your broker is manipulating EUR/USD" },
          { id: "d", text: "Pure coincidence; sessions do not matter" },
        ],
        correct: "b",
        explanation: "Pairs are most active when the markets of their currencies are open. Tokyo is open; Europe is asleep.",
        whyWrong: {
          a: "In the London–New York overlap EUR/USD is often more active than USD/JPY.",
          c: "There is a simple, well-known explanation; no manipulation is needed to explain it.",
          d: "Session activity is one of the most consistent patterns in forex.",
        },
      },
      {
        id: "fxq07-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-trading-costs",
        prompt:
          "You trade 0.20 lots of EUR/USD with a 1.5-pip spread. One pip on one lot is $10. What does the spread cost?",
        options: [
          { id: "a", text: "$0.30" },
          { id: "b", text: "$3.00" },
          { id: "c", text: "$30.00" },
          { id: "d", text: "$1.50" },
        ],
        correct: "b",
        explanation: "1.5 pips × $10 × 0.20 lots = $3.00.",
        whyWrong: {
          a: "That is a factor of ten too small; check the pip value per lot.",
          c: "That would be the cost on 2 lots, not 0.20.",
          d: "That forgets to multiply by the lot size and pip value properly.",
        },
      },
      {
        id: "fxq07-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-practical-lifecycle",
        prompt: "In MT5 on a desktop, where do you change the stop-loss of an open trade?",
        options: [
          { id: "a", text: "Market Watch → Specification" },
          { id: "b", text: "Toolbox → Trade tab → double-click the position → Modify" },
          { id: "c", text: "File → Open an Account" },
          { id: "d", text: "You cannot change it once the trade is open" },
        ],
        correct: "b",
        explanation: "Open positions are listed in the Toolbox's Trade tab. Double-clicking one opens a window where SL and TP can be modified.",
        whyWrong: {
          a: "Specification shows the contract details of a symbol, not your trades.",
          c: "That opens a new account.",
          d: "Stops and targets can be modified at any time while the trade is open.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
