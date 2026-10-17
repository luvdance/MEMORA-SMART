/**
 * ASSESSMENTS · FOREX TRADING · WEEK 1
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l01-practice-lab": {
    lessonId: "fx-l01-practice-lab",
    passMark: 70,
    questions: [
      {
        id: "fxq01-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-honest-start",
        prompt: "Which of these is this course designed to do?",
        options: [
          { id: "a", text: "Make you consistently profitable within five months" },
          { id: "b", text: "Teach you to understand the market, calculate risk and follow a tested plan on a demo account" },
          { id: "c", text: "Prepare you to manage other people's money" },
          { id: "d", text: "Give you signals to copy" },
        ],
        correct: "b",
        explanation:
          "The course teaches knowledge and process: how the market works, exact risk calculation, strategy building and testing, and disciplined execution. It promises nothing about profit, because nobody honestly can.",
        whyWrong: {
          a: "No course can promise consistent profitability, and this one explicitly does not. Anyone who promises it is selling something.",
          c: "Managing other people's money requires licensing and experience far beyond a foundation course. Unlicensed 'account management' is also a common scam.",
          d: "Copying signals teaches nothing and leaves you unable to judge whether the signals are any good.",
        },
      },
      {
        id: "fxq01-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-demo-why",
        prompt:
          "Tunde opens a demo with $100,000 and 1:500 leverage, and regularly risks $2,000 a trade because 'it is only 2%'. He plans to trade $800 for real next year. What is the main problem?",
        options: [
          { id: "a", text: "There is none; 2% risk per trade is reasonable" },
          { id: "b", text: "His demo is building habits and a sense of trade size that do not fit the account he will really have" },
          { id: "c", text: "Demo prices are fake, so nothing he learns counts" },
          { id: "d", text: "He should use even higher leverage to learn faster" },
        ],
        correct: "b",
        explanation:
          "A demo is useful only if it resembles real conditions. On his real $800 account, a $2,000 trade is impossible, and the instincts he is building will mislead him. He should set the demo near $800–$1,000 and use low leverage.",
        whyWrong: {
          a: "The percentage is fine, but the account it is a percentage of is fantasy. His practised trade sizes will not transfer.",
          c: "Demo accounts use real live prices. The problem is the unrealistic account size, not the prices.",
          d: "Higher leverage lets you lose faster. It teaches nothing useful.",
        },
      },
      {
        id: "fxq01-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-mt5-setup",
        prompt: "Where is it safe to get the MetaTrader 5 app?",
        options: [
          { id: "a", text: "From a link a trading 'mentor' sends you on Telegram" },
          { id: "b", text: "From metatrader5.com, the official app store listing by MetaQuotes, or a broker you have checked" },
          { id: "c", text: "From any website that appears first in a search" },
          { id: "d", text: "From an APK file shared in a WhatsApp group" },
        ],
        correct: "b",
        explanation:
          "Fake trading apps are a known scam: they show invented profits to persuade victims to deposit more. Install only from official sources.",
        whyWrong: {
          a: "Links from 'mentors' are exactly how fake trading apps are distributed.",
          c: "Search results can include advertisements and look-alike sites. Go to the official site directly.",
          d: "An APK from a group chat bypasses the app store's checks entirely.",
        },
      },
      {
        id: "fxq01-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-journal-setup",
        prompt: "When should a journal row be filled in?",
        options: [
          { id: "a", text: "At the end of the month, from memory" },
          { id: "b", text: "Only for winning trades" },
          { id: "c", text: "At the moment the trade is opened, then completed when it closes" },
          { id: "d", text: "Only when you break a rule" },
        ],
        correct: "c",
        explanation:
          "A journal is evidence. Written at the time, it records what you actually planned and did; written later, it records what you remember, which is biased towards the trades you are proud of.",
        whyWrong: {
          a: "Memory after a month is selective. The reason you took a trade is the first thing you forget.",
          b: "A journal of winners only would make any strategy look good. Losing trades are where most of the learning is.",
          d: "You need every trade to know how often you break rules, and what following them produces.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l02-what-forex-is": {
    lessonId: "fx-l02-what-forex-is",
    passMark: 70,
    questions: [
      {
        id: "fxq02-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-what-is-forex",
        prompt: "What does EUR/USD at 1.0850 mean?",
        options: [
          { id: "a", text: "1 US dollar costs 1.0850 euros" },
          { id: "b", text: "1 euro costs 1.0850 US dollars" },
          { id: "c", text: "The euro is worth 8.5% more than last year" },
          { id: "d", text: "1.0850 euros have been traded today" },
        ],
        correct: "b",
        explanation: "The price always refers to one unit of the first currency, measured in the second: 1 EUR = 1.0850 USD.",
        whyWrong: {
          a: "That reverses the pair. The quote is the price of one unit of the FIRST currency, the euro.",
          c: "A single price says nothing about change over time.",
          d: "The number is a price, not a volume.",
        },
      },
      {
        id: "fxq02-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-why-traded",
        prompt:
          "A Nigerian manufacturer must pay $500,000 for machinery in six months and arranges with her bank to fix the exchange rate for that payment today. What is this?",
        options: [
          { id: "a", text: "Speculation" },
          { id: "b", text: "Hedging" },
          { id: "c", text: "Central bank intervention" },
          { id: "d", text: "A remittance" },
        ],
        correct: "b",
        explanation:
          "She is removing the risk that the naira weakens before she pays. Reducing a risk you already have, in exchange for giving up possible gains, is hedging.",
        whyWrong: {
          a: "A speculator takes on currency risk hoping to profit. She is getting rid of a risk she already has.",
          c: "She is a private company, not a central bank.",
          d: "A remittance is money sent to someone, usually family, across borders.",
        },
      },
      {
        id: "fxq02-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-otc",
        prompt: "Why can a currency pair open on Monday at a different price from Friday's close?",
        options: [
          { id: "a", text: "Brokers reset all prices each week" },
          { id: "b", text: "The market is closed at the weekend, but news and events continue, so Monday's first price reflects them" },
          { id: "c", text: "It cannot; forex never gaps" },
          { id: "d", text: "Monday prices are set by the central exchange in London" },
        ],
        correct: "b",
        explanation:
          "Trading stops from Friday evening to Sunday evening (UTC), but the world does not. When trading resumes, the first price reflects what happened, which can leave a gap.",
        whyWrong: {
          a: "Prices are not reset; they resume from wherever the market's participants are willing to trade.",
          c: "Weekend gaps are a real and well-known risk, especially after major political or economic events.",
          d: "Forex is over-the-counter. There is no central exchange setting prices.",
        },
      },
      {
        id: "fxq02-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-fx-speculation-reality",
        prompt: "When a retail trader buys EUR/USD through a typical broker, what do they usually receive?",
        options: [
          { id: "a", text: "Euro banknotes delivered to them" },
          { id: "b", text: "A euro bank account" },
          { id: "c", text: "Only the profit or loss on the change in price, credited to their trading account" },
          { id: "d", text: "Shares in the European Central Bank" },
        ],
        correct: "c",
        explanation:
          "Retail forex is usually traded through contracts such as CFDs or rolling spot. You never take delivery of the currency; you gain or lose the difference between the opening and closing prices.",
        whyWrong: {
          a: "Delivery of currency is what a bureau de change does, not a trading broker.",
          b: "Your trading account holds your balance in its account currency; a position is not a foreign-currency deposit.",
          d: "Central bank shares are not traded by retail forex brokers.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l03-currency-pairs": {
    lessonId: "fx-l03-currency-pairs",
    passMark: 70,
    questions: [
      {
        id: "fxq03-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-pair-anatomy",
        prompt: "In GBP/JPY, which is the base currency?",
        options: [
          { id: "a", text: "The Japanese yen" },
          { id: "b", text: "The British pound" },
          { id: "c", text: "Both equally" },
          { id: "d", text: "The US dollar, because all pairs are priced through it" },
        ],
        correct: "b",
        explanation: "The base is always written first. GBP/JPY prices one British pound in yen.",
        whyWrong: {
          a: "The yen is second, so it is the quote currency: what the price is measured in.",
          c: "The two currencies play different roles: one is priced, the other is the unit of the price.",
          d: "GBP/JPY is a cross; neither currency is the dollar.",
        },
      },
      {
        id: "fxq03-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-pair-anatomy",
        prompt: "USD/JPY rises from 148.00 to 151.00. What happened?",
        options: [
          { id: "a", text: "The yen strengthened against the dollar" },
          { id: "b", text: "The dollar strengthened against the yen" },
          { id: "c", text: "Both currencies weakened" },
          { id: "d", text: "Nothing; the change is too small to matter" },
        ],
        correct: "b",
        explanation:
          "A rising price means more of the quote currency is needed for one unit of the base. One dollar now buys more yen, so the dollar strengthened and the yen weakened.",
        whyWrong: {
          a: "This is the classic reversal. More yen per dollar means the yen is WEAKER.",
          c: "An exchange rate only tells you about one currency relative to the other.",
          d: "Three yen is 300 pips, a large move for USD/JPY.",
        },
      },
      {
        id: "fxq03-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-buy-sell-pair",
        prompt: "You expect the Australian dollar to strengthen against the US dollar. Which trade fits?",
        options: [
          { id: "a", text: "Sell AUD/USD" },
          { id: "b", text: "Buy AUD/USD" },
          { id: "c", text: "Buy USD/CAD" },
          { id: "d", text: "Sell EUR/USD" },
        ],
        correct: "b",
        explanation: "Buying AUD/USD buys Australian dollars and sells US dollars. It gains if AUD strengthens.",
        whyWrong: {
          a: "Selling AUD/USD profits if the Australian dollar weakens.",
          c: "That trade is about the US and Canadian dollars; it says nothing about the Australian dollar.",
          d: "That trade is a view on the euro, not the Australian dollar.",
        },
      },
      {
        id: "fxq03-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-majors",
        prompt: "Which of these is NOT one of the seven major pairs?",
        options: [
          { id: "a", text: "USD/CHF" },
          { id: "b", text: "NZD/USD" },
          { id: "c", text: "EUR/GBP" },
          { id: "d", text: "USD/CAD" },
        ],
        correct: "c",
        explanation: "Every major contains the US dollar. EUR/GBP has no dollar, so it is a minor, or cross.",
        whyWrong: {
          a: "USD/CHF, the 'Swissie', is a major.",
          b: "NZD/USD, the 'Kiwi', is a major.",
          d: "USD/CAD, the 'Loonie', is a major.",
        },
      },
      {
        id: "fxq03-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-minors-exotics",
        prompt: "Why are exotic pairs a poor choice for a beginner?",
        options: [
          { id: "a", text: "They never move" },
          { id: "b", text: "They have much wider spreads and can jump sharply on local news" },
          { id: "c", text: "They are always more profitable, which builds bad habits" },
          { id: "d", text: "They cannot be charted" },
        ],
        correct: "b",
        explanation:
          "Fewer participants mean higher costs and rougher, gappier movement. Those make risk harder to control, which is the first skill a beginner needs.",
        whyWrong: {
          a: "Exotics often move a great deal, which is part of the danger.",
          c: "Nothing is always more profitable. Exotics are typically more expensive to trade.",
          d: "They chart like any other pair.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l04-quotes-pips-lots": {
    lessonId: "fx-l04-quotes-pips-lots",
    passMark: 70,
    questions: [
      {
        id: "fxq04-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-bid-ask",
        prompt: "EUR/USD is quoted 1.08502 / 1.08514. At what price can you BUY?",
        options: [
          { id: "a", text: "1.08502, the bid" },
          { id: "b", text: "1.08514, the ask" },
          { id: "c", text: "1.08508, the middle" },
          { id: "d", text: "Whichever price you choose" },
        ],
        correct: "b",
        explanation: "You buy at the ask, the higher price, and sell at the bid, the lower one.",
        whyWrong: {
          a: "The bid is the price at which you can SELL.",
          c: "The mid-price is a reference; you cannot trade at it.",
          d: "With a market order you take the price on offer: the ask to buy, the bid to sell.",
        },
      },
      {
        id: "fxq04-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-pips",
        prompt: "EUR/USD moves from 1.08250 to 1.08730. How many pips is that?",
        options: [
          { id: "a", text: "4.8 pips" },
          { id: "b", text: "48 pips" },
          { id: "c", text: "480 pips" },
          { id: "d", text: "0.48 pips" },
        ],
        correct: "b",
        explanation: "1.08730 − 1.08250 = 0.00480. Divided by the pip size, 0.0001, that is 48 pips.",
        whyWrong: {
          a: "That treats the fifth decimal as the pip. The pip is the fourth decimal; the fifth is a tenth of a pip.",
          c: "That would be a move of 0.0480, from 1.0825 to about 1.1305.",
          d: "That is off by a factor of one hundred.",
        },
      },
      {
        id: "fxq04-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-spread",
        prompt: "When are spreads on the major pairs usually WIDEST?",
        options: [
          { id: "a", text: "During the busiest trading hours" },
          { id: "b", text: "When the market is quiet, and around major news releases" },
          { id: "c", text: "They never change" },
          { id: "d", text: "Only on Mondays" },
        ],
        correct: "b",
        explanation:
          "Spreads reflect how much liquidity is available. When fewer participants are quoting, such as late in the US afternoon or seconds before a big release, spreads widen.",
        whyWrong: {
          a: "Busy hours have the most participants competing to quote, so spreads are usually tightest then.",
          c: "Most retail accounts have variable spreads that change constantly.",
          d: "Spreads can be wide at the Sunday-evening open, but that is one moment, not the whole of Monday.",
        },
      },
      {
        id: "fxq04-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lots",
        prompt: "You meant to open 0.10 lots of EUR/USD but typed 1.0. How much bigger is your position than intended?",
        options: [
          { id: "a", text: "The same; MT5 rounds it" },
          { id: "b", text: "Twice as big" },
          { id: "c", text: "Ten times as big" },
          { id: "d", text: "One hundred times as big" },
        ],
        correct: "c",
        explanation: "1.0 lot is 100,000 units; 0.10 lots is 10,000. Every pip now costs or earns $10 instead of $1.",
        whyWrong: {
          a: "The platform accepts what you type. Check the volume box before every order.",
          b: "1.0 ÷ 0.10 = 10, not 2.",
          d: "That would be 0.01 versus 1.0.",
        },
      },
      {
        id: "fxq04-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-terminology",
        prompt: "You have a balance of $1,000 and one open trade showing −$40. What is your equity?",
        options: [
          { id: "a", text: "$1,000" },
          { id: "b", text: "$960" },
          { id: "c", text: "$1,040" },
          { id: "d", text: "$40" },
        ],
        correct: "b",
        explanation: "Equity is the balance plus or minus the floating profit or loss of open trades: $1,000 − $40 = $960.",
        whyWrong: {
          a: "That is the balance, which ignores open trades until they close.",
          c: "The open trade is losing, so it reduces equity.",
          d: "That is only the floating loss.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
