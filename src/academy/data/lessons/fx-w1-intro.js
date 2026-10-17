/**
 * FOREX TRADING · WEEK 1 · INTRODUCTION TO FOREX
 *
 * Curriculum 1.0 – 1.P. The first lesson sets up the practice lab, a demo
 * account, a charting account and a journal, because every week after this
 * one is practised on them. Then what forex is, how pairs work, and the
 * vocabulary every trade is described in.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every `calcExercise` names the engine function that produces its answer;
 * validateContent.mjs recomputes it, so no number here is taken on trust.
 */

export const SECTION_ID = "fx-s1-intro";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0 — THE PRACTICE LAB
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l01-practice-lab",
    moduleId: "fx-w1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Set Up Your Practice Lab",
    subtitle: "A demo account, a charting account and a journal, before anything else",
    estimatedMinutes: 20,
    intro:
      "You will learn forex the way pilots learn to fly: in a simulator first, for months, with every flight written down. This lesson sets up the three tools you will use every week of the course. None of them costs anything, none of them needs a deposit, and all of them work on a phone.",

    atoms: [
      {
        id: "a-fx-honest-start",
        title: "What this course can and cannot do for you",
        explain:
          "This course will teach you how the currency market works, how to calculate risk exactly, how to build and test a trading strategy and how to execute it with discipline. It will NOT make you consistently profitable, and finishing it does not mean you are ready to trade real money. Nobody can honestly promise either of those things, and anyone who does is selling something.",
        why: "Retail forex trading is hard. Brokers regulated in the UK and the European Union are required to publish the share of their retail accounts that lose money on these products, and those published figures are commonly between about 60% and 80%. Knowing that before you start is not discouraging; it is the first piece of risk management. The goal of this course is to put you among the people who understand why, and who protect their capital while they find out whether trading suits them.",
        table: {
          caption: "What you are assessed on, from Week 1 to graduation.",
          headers: ["Assessed", "Not assessed"],
          rows: [
            ["Correct risk calculations before every trade", "How much virtual money you made"],
            ["A written strategy another person could follow", "Whether a particular trade won"],
            ["Accurate, complete records of every trade", "How confident you sound"],
            ["Following your own rules, especially when losing", "Predicting where price goes next"],
          ],
        },
        mistake:
          "Judging yourself by your profit in the first months. A beginner can make money for weeks by taking huge risks and being lucky, and then lose all of it in a day. A beginner who loses a little while following every rule is learning far more.",
      },
      {
        id: "a-fx-demo-why",
        title: "A demo account, set up like a real one",
        explain:
          "A demo account is a trading account funded with virtual money. It uses real, live market prices, so everything you practise on it behaves like the real market, but a loss costs you nothing. You will use one for the whole course. The most important thing is to set it up REALISTICALLY: a balance close to what you might one day actually trade with, and modest leverage.",
        why: "Most platforms offer a demo with $10,000 or $100,000 and leverage of 1:500. Practising with an amount you will never have teaches you habits that ruin real accounts: risking $500 on a trade feels like nothing on $100,000 but is half of a $1,000 account. Regulators in the UK and EU cap retail leverage on major pairs at 1:30, and the US caps it at 1:50, because higher leverage is so reliably destructive for beginners.",
        table: {
          caption: "The settings this course asks you to use.",
          headers: ["Setting", "Use", "Why"],
          rows: [
            ["Account type", "Demo", "Virtual money, real prices"],
            ["Deposit / balance", "$1,000 (or the realistic amount you have in mind)", "Every lesson's examples use a small account"],
            ["Leverage", "1:30 if offered; otherwise the lowest available", "Matches the retail limits of strict regulators"],
            ["Account currency", "USD", "The lessons' pip values are in dollars"],
          ],
        },
        decision: {
          scenario:
            "You are opening your first demo account. The form offers a deposit of $100,000 by default and leverage up to 1:1000. You honestly expect that, if you ever trade for real, you would start with about $500.",
          question: "What should you choose?",
          options: [
            {
              id: "a",
              text: "Keep $100,000 and 1:1000 — it is virtual money, so it does not matter",
              whyWrong:
                "It matters a great deal. Your sense of what a 'normal' trade size is will be set by this account. On $100,000, a trade that would wipe out a $500 account looks tiny, and you will carry that instinct into real trading.",
            },
            {
              id: "b",
              text: "Set the balance to about $500–$1,000 and choose the lowest leverage available, ideally 1:30",
              why: "A demo is only useful if it resembles the account you would really trade. Small balance, modest leverage: every result you get is then something you could actually have achieved.",
            },
            {
              id: "c",
              text: "Set $500 but keep 1:1000 leverage, so you can open bigger trades",
              whyWrong:
                "Leverage does not make you more money; it lets you lose it faster. With 1:1000 on $500 you could open a position worth $500,000, where a move of one tenth of one percent wipes out the account.",
            },
            {
              id: "d",
              text: "Skip the demo and practise with a small amount of real money instead",
              whyWrong:
                "Later, perhaps. Not in Week 1. You do not yet know how to size a trade or place a stop-loss, and real money adds emotion before you have the skills to manage it.",
            },
          ],
          correct: "b",
          aftermath:
            "If your platform will not let you choose the balance, you can still behave as if you had $1,000: size every trade as if that were your balance. That is the discipline this course asks for either way.",
        },
      },
      {
        id: "a-fx-mt5-setup",
        title: "Opening a MetaTrader 5 demo account",
        explain:
          "MetaTrader 5, usually called MT5, is the trading platform most retail forex brokers offer. It is free from metatrader5.com and from the Google Play and Apple app stores. You can open a demo from inside the platform in a few minutes, without depositing anything.",
        why: "Learning the platform now, with no money at stake, means that by Week 10 you place, modify and close orders without thinking about the buttons. Order-entry mistakes, such as buying when you meant to sell, or typing 10 lots instead of 0.10, are a real and expensive cause of losses.",
        table: {
          caption: "The steps, on a computer and on a phone. Menu names can differ slightly between versions.",
          headers: ["Step", "Desktop (Windows or Mac)", "Phone (Android or iPhone)"],
          rows: [
            ["1. Install", "Download MT5 from metatrader5.com, or from a regulated broker's website", "Install 'MetaTrader 5' by MetaQuotes from the app store"],
            ["2. Start a new account", "File → Open an Account", "Settings → New Account (or Manage Accounts → +)"],
            ["3. Choose a server", "Pick a broker's demo server, or MetaQuotes-Demo", "Search for a broker, or choose MetaQuotes-Demo"],
            ["4. Choose demo", "Select 'Open a demo account to trade virtual money without risk'", "Select 'Open a demo account'"],
            ["5. Fill in the form", "Name, email, account type, deposit $1,000, leverage 1:30 or lowest", "The same fields"],
            ["6. Save your login", "Write down the login number, password and server name", "The app saves them; note them anyway"],
          ],
        },
        mistake:
          "Downloading a 'MetaTrader' app or file from a link someone sent you on WhatsApp or Telegram. Fake trading apps are a common scam. Install only from metatrader5.com, the official app store listing by MetaQuotes, or the website of a broker you have checked.",
      },
      {
        id: "a-fx-tradingview-setup",
        title: "TradingView: your charts, and a second demo",
        explain:
          "TradingView is a charting website and app with a free plan. It is where you will do most of your analysis: drawing levels, adding indicators, and, from Week 9, replaying history bar by bar to backtest. It also has a built-in Paper Trading account, a simple demo you can use straight from the chart.",
        why: "MT5 is built for placing trades; TradingView is built for reading charts. Using both is normal practice, and both are what you will meet if you ever trade seriously. The free plan is enough for this whole course.",
        table: {
          caption: "Set this up once, then save it as your chart layout.",
          headers: ["Do this", "Where"],
          rows: [
            ["Create a free account", "tradingview.com or the TradingView app"],
            ["Open a chart of EUR/USD", "Search 'EURUSD' and choose a forex (FX) feed"],
            ["Set the time zone to Lagos (UTC+1), or your own", "Click the clock at the bottom right of the chart"],
            ["Choose candlesticks", "The chart-type button on the top toolbar"],
            ["Connect Paper Trading", "Trading Panel at the bottom → Paper Trading → Connect"],
            ["Reset Paper Trading to a realistic balance", "Paper Trading account settings → Reset, then set the balance"],
          ],
        },
      },
      {
        id: "a-fx-journal-setup",
        title: "The trading journal",
        explain:
          "A trading journal is a record of every trade: why you took it, exactly how, and what happened. Professionals keep one; most losing beginners do not. Make yours today in Google Sheets or Excel, with one row per trade. You will add columns as the course goes on, and in Phase 5 your journal is one of the things you are assessed on.",
        why: "Memory is a terrible record. After a month you will remember your best trades clearly and your rule-breaking ones vaguely. A journal written at the time is the only honest evidence of whether you are following a plan, and it is impossible to improve something you have not measured.",
        table: {
          caption: "Your starting columns. Fill a row the moment you open a trade, not afterwards.",
          headers: ["Column", "Example"],
          rows: [
            ["Date and time (Lagos)", "2026-10-19 14:05"],
            ["Pair", "EUR/USD"],
            ["Direction", "Buy"],
            ["Entry price", "1.08514"],
            ["Stop-loss and take-profit", "1.08260 / 1.09020"],
            ["Lot size", "0.04"],
            ["Money at risk ($)", "10.16"],
            ["Reason for the trade", "Week 1 practice: quote-reading only"],
            ["Exit price, result ($), result (pips)", "Filled in when the trade closes"],
            ["Did I follow my rules? (Y/N) and notes", "Y — sized before entry"],
          ],
        },
      },
      {
        id: "a-fx-on-the-go",
        title: "Learning on the go: the fifteen-minute routine",
        explain:
          "You do not need hours at a desk to make progress. The course is designed so that, between lessons, you spend about fifteen minutes a day with your phone: open the MT5 and TradingView apps, look at the same few pairs, and do the week's small practical task. Consistency beats long, irregular sessions.",
        why: "Market sense comes from seeing the market every day: how far a pair usually moves, when it is quiet and when it jumps. A few minutes daily builds that faster than a long session once a week, and it builds the habit of checking before acting, which is the habit that protects capital.",
        example:
          "THE DAILY ROUTINE (about 15 minutes, any time the market is open)\n\n  1. Open MT5 → Quotes. Note the bid, ask and spread of EUR/USD, GBP/USD and USD/JPY.\n  2. Open TradingView → your saved layout. Look at today's candles on each pair.\n  3. Do this week's practical task (each lesson ends with one).\n  4. Write one line in your journal, even if you placed no trade:\n       \"2026-10-19 · EUR/USD spread 1.2 pips · quiet morning · no trade\"",
        mistake:
          "Treating the demo as a game and clicking buy and sell for excitement. The demo is your training ground; every trade on it should follow whatever rules you have learned so far, and from Week 3 every trade should be sized with your calculator first.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 — WHAT FOREX IS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l02-what-forex-is",
    moduleId: "fx-w1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1"],
    title: "What Forex Is",
    subtitle: "The world's largest market, and why currencies are traded at all",
    estimatedMinutes: 14,
    intro:
      "Every time money crosses a border, one currency is exchanged for another. Forex is the market where that happens. Most of the people in it are not speculators like you will be, and understanding who they are explains a great deal about how prices move.",

    atoms: [
      {
        id: "a-fx-what-is-forex",
        title: "Forex is the exchange of one currency for another",
        explain:
          "Forex, short for FOREIGN EXCHANGE and also called FX, is the global market for exchanging currencies. When a Nigerian importer pays a Chinese supplier, naira are exchanged, directly or through dollars, for yuan. When you change money at a bureau de change before travelling, you are using the forex market. Its price, the EXCHANGE RATE, is simply how much of one currency it costs to buy another.",
        why: "It is the largest financial market in the world. The Bank for International Settlements surveys it every three years: in its 2022 survey average trading was about $7.5 trillion a day, and its 2025 survey reported a higher figure still. The US dollar is on one side of nearly nine in every ten trades. That size is why major currencies can be bought and sold almost instantly, at almost any time on a weekday.",
        table: {
          caption: "Exchange rates you already know, written the way the market writes them.",
          headers: ["Written as", "Means"],
          rows: [
            ["EUR/USD 1.0850", "1 euro costs 1.0850 US dollars"],
            ["USD/JPY 150.25", "1 US dollar costs 150.25 Japanese yen"],
            ["GBP/USD 1.2642", "1 British pound costs 1.2642 US dollars"],
            ["USD/NGN 1,550", "1 US dollar costs about 1,550 naira (illustrative)"],
          ],
        },
      },
      {
        id: "a-fx-why-traded",
        title: "Why currencies are traded",
        explain:
          "Most currency trading exists because of real economic activity. Companies exchange currencies to pay for imports and to bring home export earnings. Investors exchange them to buy foreign shares and bonds. Travellers and families sending remittances exchange them. Central banks buy and sell them to manage their reserves and their exchange rates. Speculators, including retail traders, trade them purely to profit from price changes.",
        why: "The non-speculators are the reason prices move in big, persistent ways: when a central bank raises interest rates, investors worldwide move money into that currency, and that flow can last months. A speculator is trying to anticipate those flows, not to cause them.",
        table: {
          caption: "The main reasons, and an example of each.",
          headers: ["Reason", "Who", "Example"],
          rows: [
            ["Trade", "Importers and exporters", "A Lagos importer buys dollars to pay a supplier"],
            ["Investment", "Funds, pension schemes, individuals", "A US fund buys euros to purchase German bonds"],
            ["Hedging", "Companies with future foreign payments", "An airline fixes today's rate for fuel it pays for in dollars next quarter"],
            ["Policy and reserves", "Central banks", "A central bank sells dollars to support its own currency"],
            ["Remittances and travel", "Individuals", "A nurse in London sends pounds home to family in naira"],
            ["Speculation", "Banks' trading desks, hedge funds, retail traders", "A trader buys EUR/USD expecting the euro to strengthen"],
          ],
        },
        decision: {
          scenario:
            "A cocoa exporter in Ghana will receive $2 million from a European buyer in three months. She is worried the cedi will strengthen against the dollar before then, which would make those dollars worth fewer cedis. She agrees a rate with her bank today for exchanging the dollars in three months.",
          question: "What is she doing?",
          options: [
            {
              id: "a",
              text: "Speculating that the cedi will strengthen",
              whyWrong:
                "She is doing the opposite of betting on a move. She is removing the effect of any move on her business, whichever way the rate goes.",
            },
            {
              id: "b",
              text: "Hedging: fixing the rate so a currency move cannot hurt her business",
              why: "Exactly. A hedge reduces a risk you already have. She gives up any gain from a favourable move in exchange for certainty, which is what a business with costs to pay usually wants.",
            },
            {
              id: "c",
              text: "Investing in dollar assets",
              whyWrong:
                "She is not buying a dollar asset to hold; she is arranging to exchange dollars she will be paid for her goods.",
            },
            {
              id: "d",
              text: "Managing central bank reserves",
              whyWrong: "She is a private business, not a central bank.",
            },
          ],
          correct: "b",
          aftermath:
            "Hedgers are on the other side of a lot of speculative trades. They are willing to accept a price that a speculator thinks is attractive, because their aim is certainty, not profit from the market.",
        },
      },
      {
        id: "a-fx-otc",
        title: "No central exchange, open around the clock on weekdays",
        explain:
          "Shares are traded on an exchange, such as the Nigerian Exchange in Lagos, with fixed opening hours. Forex has no single exchange. It is OVER-THE-COUNTER (OTC): banks, brokers and other institutions trade directly with each other through electronic networks. Because those institutions are spread across time zones, the market is open 24 hours a day from Monday morning in Asia to Friday evening in New York.",
        why: "Two consequences matter to you. First, there is no single official price: your broker's quote may differ very slightly from another broker's. Second, the market closes over the weekend, but the world does not stop, so prices can open on Monday some distance from where they closed on Friday. That jump is called a GAP, and you will meet it again in risk management.",
        mistake:
          "Thinking 'open 24 hours' means 'always good to trade'. Activity, and so cost and opportunity, varies hugely through the day. Week 2 shows you when the market is busy and when it is thin.",
      },
      {
        id: "a-fx-speculation-reality",
        title: "What retail speculation really is",
        explain:
          "As a retail trader you are speculating: trying to profit from price changes, with nothing to buy or pay for in another currency. You usually do it through a broker using contracts that track the exchange rate, such as CFDs (contracts for difference) or rolling spot forex. You never receive the actual currency; you receive, or pay, the difference between the price you opened at and the price you closed at.",
        why: "Every trade has costs, and you are competing with banks and funds that have better information, faster systems and lower costs. Before costs, currency speculation is close to a zero-sum game between participants; after costs, the average participant loses. Trading can still be done well, but only with an edge, strict risk control and honest records, which is what the rest of this course builds.",
        table: {
          caption: "Speculating versus exchanging money.",
          headers: ["", "Changing money for travel", "Speculating with a broker"],
          rows: [
            ["You receive", "Actual foreign banknotes or a balance in that currency", "Only the profit or loss on the price change"],
            ["Purpose", "To spend the currency", "To profit from the movement"],
            ["You can profit if the price falls", "No", "Yes, by selling first (going short)"],
            ["Leverage", "None", "Usually available, which magnifies gains and losses"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.2 — CURRENCY PAIRS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l03-currency-pairs",
    moduleId: "fx-w1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.2"],
    title: "Currency Pairs",
    subtitle: "Base, quote, majors, minors and exotics",
    estimatedMinutes: 14,
    intro:
      "A currency is never priced alone, only against another currency. So everything in forex is traded in pairs, and reading a pair correctly, which currency you are buying and which you are selling, is the first skill to make automatic.",

    atoms: [
      {
        id: "a-fx-pair-anatomy",
        title: "The base currency and the quote currency",
        explain:
          "A currency pair is written BASE/QUOTE, for example EUR/USD. The BASE currency is the first one; it is the thing being priced, and the quote always refers to exactly one unit of it. The QUOTE currency is the second one; it is what the price is measured in. EUR/USD at 1.0850 means one euro costs 1.0850 US dollars.",
        why: "If the number goes up, the base currency has strengthened against the quote. If it goes down, the base has weakened. That one rule tells you which way every chart in the course should be read.",
        table: {
          caption: "Reading the same idea in three pairs.",
          headers: ["Pair and price", "Base", "Quote", "If the price rises…"],
          rows: [
            ["EUR/USD 1.0850", "Euro", "US dollar", "The euro has strengthened against the dollar"],
            ["USD/JPY 150.25", "US dollar", "Japanese yen", "The dollar has strengthened against the yen"],
            ["GBP/JPY 190.10", "British pound", "Japanese yen", "The pound has strengthened against the yen"],
          ],
        },
        mistake:
          "Reading USD/JPY going up as 'the yen is rising'. It is the opposite: more yen are needed to buy one dollar, so the yen has weakened.",
      },
      {
        id: "a-fx-buy-sell-pair",
        title: "Buying or selling a pair",
        explain:
          "When you BUY a pair, also called going LONG, you are buying the base currency and selling the quote currency. You profit if the price rises. When you SELL a pair, going SHORT, you are selling the base and buying the quote, and you profit if the price falls. Every forex trade is both a purchase of one currency and a sale of another.",
        why: "This is how you act on a view. If you think the US dollar will weaken against the yen, you do not 'buy yen' on its own; you sell USD/JPY. Getting this backwards is a classic beginner error.",
        decision: {
          scenario:
            "You believe the British pound will weaken against the US dollar over the next few days. Your platform lists the pair GBP/USD.",
          question: "What trade expresses that view?",
          options: [
            {
              id: "a",
              text: "Buy GBP/USD",
              whyWrong: "Buying GBP/USD buys pounds. It profits if the pound strengthens, which is the opposite of your view.",
            },
            {
              id: "b",
              text: "Sell GBP/USD",
              why: "Selling GBP/USD sells pounds and buys dollars. If the pound weakens, the price falls and the short position gains.",
            },
            {
              id: "c",
              text: "Buy USD/GBP, which you cannot find, so do nothing",
              whyWrong:
                "Markets quote GBP/USD, not USD/GBP, but you do not need the reversed pair. Selling GBP/USD is exactly the same view.",
            },
            {
              id: "d",
              text: "It depends whether the price is above or below 1.0000",
              whyWrong: "The level of the price says nothing about direction. Only which currency you expect to strengthen matters.",
            },
          ],
          correct: "b",
          aftermath:
            "Say it out loud before every trade: 'I am buying (or selling) the FIRST currency.' It takes one second and prevents a costly reversal.",
        },
      },
      {
        id: "a-fx-majors",
        title: "The major pairs",
        explain:
          "The MAJORS are the most traded pairs. Each contains the US dollar and one of the other most traded currencies. They have the most participants, so they usually have the lowest trading costs and move the most smoothly. Beginners should start with them.",
        table: {
          caption: "The seven majors and their trader nicknames.",
          headers: ["Pair", "Currencies", "Nickname"],
          rows: [
            ["EUR/USD", "Euro / US dollar", "Fibre"],
            ["USD/JPY", "US dollar / Japanese yen", "Gopher"],
            ["GBP/USD", "British pound / US dollar", "Cable"],
            ["USD/CHF", "US dollar / Swiss franc", "Swissie"],
            ["AUD/USD", "Australian dollar / US dollar", "Aussie"],
            ["USD/CAD", "US dollar / Canadian dollar", "Loonie"],
            ["NZD/USD", "New Zealand dollar / US dollar", "Kiwi"],
          ],
        },
        why: "EUR/USD alone is the single most traded pair in the world. In this course most worked examples use EUR/USD, GBP/USD and USD/JPY, because their behaviour and costs are what you will meet first on any platform.",
      },
      {
        id: "a-fx-minors-exotics",
        title: "Minors (crosses) and exotics",
        explain:
          "A MINOR, also called a CROSS, pairs two major currencies without the US dollar: EUR/GBP, EUR/JPY, GBP/JPY, AUD/JPY. An EXOTIC pairs a major currency with the currency of a smaller or emerging economy: USD/ZAR (South African rand), USD/TRY (Turkish lira), USD/MXN (Mexican peso), USD/NGN (Nigerian naira).",
        why: "Fewer participants means higher costs and rougher movement. Exotic spreads can be ten or more times wider than EUR/USD, they can jump sharply on local news, and many retail brokers do not offer them at all. Learn on the majors first; the skills transfer later.",
        table: {
          caption: "The three groups compared.",
          headers: ["Group", "Examples", "Typical cost", "Typical behaviour"],
          rows: [
            ["Majors", "EUR/USD, USD/JPY, GBP/USD", "Lowest", "Smooth, deep, well covered by news"],
            ["Minors / crosses", "EUR/GBP, EUR/JPY, GBP/JPY", "Moderate", "Often larger moves (GBP/JPY especially)"],
            ["Exotics", "USD/ZAR, USD/TRY, USD/NGN", "High to very high", "Gappy, sensitive to local politics and policy"],
          ],
        },
        decision: {
          scenario:
            "A friend tells you to trade USD/ZAR because 'it moves 1,000 pips a day, so the profits are bigger'.",
          question: "What is the best response?",
          options: [
            {
              id: "a",
              text: "Agree — more movement means more profit",
              whyWrong:
                "More movement means more profit AND more loss, and with an exotic you also pay a much wider spread on every trade. Movement is not an advantage on its own.",
            },
            {
              id: "b",
              text: "Point out that the pip count is misleading: the cost per trade is far higher and the moves are harder to manage, so learn on majors first",
              why: "Right. A pip on USD/ZAR is a far smaller fraction of the price than a pip on EUR/USD, so pip counts are not comparable, and the spread and gaps make exotics a poor place to learn.",
            },
            {
              id: "c",
              text: "Exotics are illegal to trade",
              whyWrong: "They are legal. They are simply expensive and difficult, which is a practical reason, not a legal one, to avoid them as a beginner.",
            },
            {
              id: "d",
              text: "Trade it, but only with high leverage so the profit is bigger",
              whyWrong: "Adding leverage to the most volatile, most expensive kind of pair is the fastest way to lose an account.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-iso-codes",
        title: "Currency codes",
        explain:
          "Every currency has a three-letter code from the international standard ISO 4217. The first two letters are usually the country, the third the currency's name: NGN is the Nigerian naira, GBP the British pound, JPY the Japanese yen. The euro, used by many countries, is EUR. Platforms often drop the slash, so EUR/USD appears as EURUSD.",
        table: {
          caption: "Codes you will see on platforms and economic calendars.",
          headers: ["Code", "Currency", "Code", "Currency"],
          rows: [
            ["USD", "US dollar", "NGN", "Nigerian naira"],
            ["EUR", "Euro", "GHS", "Ghanaian cedi"],
            ["GBP", "British pound", "ZAR", "South African rand"],
            ["JPY", "Japanese yen", "KES", "Kenyan shilling"],
            ["CHF", "Swiss franc", "CNY", "Chinese yuan"],
            ["AUD / NZD / CAD", "Australian / New Zealand / Canadian dollar", "XAU", "Gold (one troy ounce), often listed with forex"],
          ],
        },
        mistake:
          "Assuming a symbol like 'EURUSD.m', 'EURUSDx' or 'EURUSD.pro' is a different market. Brokers add suffixes for different account types; check the contract specification (Week 3) to see what it is.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.3 + 1.P — BID, ASK, SPREAD, PIPS, LOTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l04-quotes-pips-lots",
    moduleId: "fx-w1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.3", "1.P"],
    title: "Bid, Ask, Spread, Pips and Lots",
    subtitle: "The vocabulary every trade is written in",
    estimatedMinutes: 18,
    intro:
      "Open the Quotes window in MT5 and you will see two prices for every pair, numbers with five decimal places, and a column called spread. By the end of this lesson every one of those numbers will mean something precise, and you will be able to calculate how far a pair has moved.",

    atoms: [
      {
        id: "a-fx-bid-ask",
        title: "Two prices: bid and ask",
        explain:
          "Every quote has two prices. The BID is the price at which you can SELL. The ASK (also called the offer) is the price at which you can BUY. The ask is always higher than the bid. On MT5's Quotes window they appear side by side, bid on the left, ask on the right.",
        why: "This is how your broker and the market makers behind it are paid: you buy slightly above and sell slightly below the middle price. It also means that the moment you open any trade, you are slightly behind, because to close a buy you must sell at the bid.",
        table: {
          caption: "One quote, read correctly.",
          headers: ["Quote", "Bid (you sell)", "Ask (you buy)"],
          rows: [
            ["EUR/USD", "1.08502", "1.08514"],
            ["USD/JPY", "150.245", "150.262"],
            ["GBP/USD", "1.26418", "1.26436"],
          ],
        },
        mistake:
          "Placing a stop-loss on a sell trade exactly at a chart level and being surprised when it triggers early. Charts usually show the BID price, but a sell is closed by buying at the ASK, which is higher. You will deal with this properly in Week 8.",
      },
      {
        id: "a-fx-pips",
        title: "Pips: the unit of price movement",
        explain:
          "A PIP is the standard unit for how far a price has moved. For most pairs it is the fourth decimal place, 0.0001. For pairs quoted in Japanese yen it is the second decimal place, 0.01. Most platforms show one more digit than that, a tenth of a pip, called a PIPETTE or fractional pip.",
        why: "Pips let you talk about movement independently of money: 'EUR/USD moved 40 pips' means the same thing whether you traded a tiny or a large position. You will plan every stop-loss and target in pips first, then convert to money in Week 3.",
        table: {
          caption: "Where the pip sits.",
          headers: ["Pair", "Quote", "Pip size", "The pip digit", "Pipette (last digit)"],
          rows: [
            ["EUR/USD", "1.08514", "0.0001", "1.085[1]4", "4 tenths of a pip"],
            ["GBP/USD", "1.26436", "0.0001", "1.264[3]6", "6 tenths of a pip"],
            ["USD/JPY", "150.262", "0.01", "150.2[6]2", "2 tenths of a pip"],
          ],
        },
        calcExercise: {
          scenario:
            "USD/JPY was at 149.250 this morning. It is now at 150.130.",
          question: "How many pips has USD/JPY risen?",
          unit: "pips",
          answer: 88,
          tolerance: 0.05,
          hint: "It is a yen pair, so one pip is 0.01. Find the difference in price, then divide by the pip size.",
          working:
            "Difference: 150.130 − 149.250 = 0.880\nPip size for a yen pair: 0.01\nPips: 0.880 ÷ 0.01 = 88 pips",
          check: { fn: "pipsBetween", args: { pair: "USD/JPY", from: 149.25, to: 150.13 } },
        },
      },
      {
        id: "a-fx-spread",
        title: "The spread",
        explain:
          "The SPREAD is the difference between the ask and the bid, measured in pips. It is the main cost of most trades: if you bought and immediately sold, you would lose exactly the spread. Spreads are usually tightest on the majors during busy hours and widen when the market is quiet or during major news.",
        why: "A strategy that aims for 5 pips per trade cannot survive a 2-pip spread: 40% of every target is gone before price moves. Knowing the spread of what you trade, at the time you trade it, is basic due diligence.",
        calcExercise: {
          scenario: "Your MT5 Quotes window shows EUR/USD with a bid of 1.08502 and an ask of 1.08514.",
          question: "What is the spread, in pips?",
          unit: "pips",
          answer: 1.2,
          tolerance: 0.05,
          hint: "Ask minus bid gives the spread as a price. EUR/USD's pip is 0.0001.",
          working:
            "Ask − bid: 1.08514 − 1.08502 = 0.00012\nPip size: 0.0001\nSpread: 0.00012 ÷ 0.0001 = 1.2 pips",
          check: { fn: "spreadPips", args: { pair: "EUR/USD", bid: 1.08502, ask: 1.08514 } },
        },
      },
      {
        id: "a-fx-lots",
        title: "Lots: the size of a trade",
        explain:
          "Forex positions are measured in LOTS. One STANDARD lot is 100,000 units of the BASE currency. Platforms let you trade fractions: a MINI lot is 0.1 (10,000 units), a MICRO lot is 0.01 (1,000 units), and some brokers offer NANO lots of 0.001 (100 units). The volume box in MT5 is always in standard lots.",
        why: "Lot size is what turns pips into money. Buying 1 lot of EUR/USD controls €100,000, worth over $108,000. A beginner who types 1.00 instead of 0.01 has opened a position one hundred times bigger than intended.",
        table: {
          caption: "The lot sizes. Volume in MT5 is entered in the first column.",
          headers: ["MT5 volume", "Name", "Units of base currency", "EUR/USD: value of 1 pip"],
          rows: [
            ["1.00", "Standard lot", "100,000", "$10.00"],
            ["0.10", "Mini lot", "10,000", "$1.00"],
            ["0.01", "Micro lot", "1,000", "$0.10"],
            ["0.001", "Nano lot (some brokers)", "100", "$0.01"],
          ],
        },
        calcExercise: {
          scenario: "You enter 0.35 in the Volume box of an EUR/USD order.",
          question: "How many euros does that position control?",
          unit: "EUR",
          answer: 35000,
          tolerance: 0.5,
          hint: "Volume is in standard lots of 100,000 units of the base currency.",
          working: "0.35 lots × 100,000 units per lot = 35,000 units of the base currency (euros).",
          check: { fn: "unitsFor", args: { lots: 0.35 } },
        },
      },
      {
        id: "a-fx-terminology",
        title: "The words you will hear every day",
        explain:
          "A handful of terms describe every trade and every account. Learn them now; the platform uses them without explanation.",
        table: {
          caption: "Basic trade and account terminology.",
          headers: ["Term", "Meaning"],
          rows: [
            ["Position", "A trade that is currently open"],
            ["Long / short", "A buy position / a sell position"],
            ["Open / close", "Enter a trade / exit it"],
            ["Stop-loss (SL)", "An order that closes the trade automatically at a set loss level"],
            ["Take-profit (TP)", "An order that closes the trade automatically at a set profit level"],
            ["Balance", "Account value counting only CLOSED trades"],
            ["Equity", "Balance plus or minus the profit or loss of OPEN trades"],
            ["Floating P/L", "Profit or loss on open trades, which changes with price"],
            ["Volatility", "How much and how quickly price moves"],
            ["Liquidity", "How easily large amounts can be traded without moving the price"],
          ],
        },
        mistake:
          "Looking at the balance while trades are open and thinking nothing is at risk. The balance only changes when trades close; the equity shows what the account is worth right now.",
      },
      {
        id: "a-fx-practical-movement",
        title: "Practical: measuring a pair's movement",
        explain:
          "This is the week's practical skill: read a quote, identify the pip digit and calculate how far the pair moved, with the correct sign. A rise is positive, a fall negative. You will do it below on a historical move, then on live prices in your demo account.",
        why: "Every plan you ever write starts in pips: 'stop 25 pips below the entry, target 50 pips above'. If the pip arithmetic is shaky, everything built on it is wrong.",
        calcExercise: {
          scenario:
            "On Monday GBP/USD opened at 1.26420. By Friday's close it was 1.25875.",
          question: "How many pips did GBP/USD move over the week? Use a minus sign for a fall.",
          unit: "pips",
          answer: -54.5,
          tolerance: 0.05,
          hint: "Work out finish minus start, then divide by GBP/USD's pip size. A fall is negative.",
          working:
            "Finish − start: 1.25875 − 1.26420 = −0.00545\nPip size: 0.0001\nMovement: −0.00545 ÷ 0.0001 = −54.5 pips (the fifth decimal is half a pip)",
          check: { fn: "pipsBetween", args: { pair: "GBP/USD", from: 1.2642, to: 1.25875 } },
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "Do these on your MT5 demo account and TradingView, on a computer or your phone. Record each one in your journal. No trades are needed yet, though you may open a 0.01-lot trade just to see where things appear.",
      prompts: [
        "Open your MT5 demo account with a realistic balance and the lowest leverage offered. Write the login, server and settings in your journal.",
        "In MT5's Quotes window, record the bid, ask and spread of EUR/USD, GBP/USD, USD/JPY and one exotic pair if your broker lists one. Compare the spreads.",
        "Pick three pairs on TradingView. Note each one's price at the start of a day and at the end. Calculate each pair's movement in pips, with the correct sign.",
        "For each of the three pairs, write one sentence saying which currency strengthened and which weakened.",
        "Do the fifteen-minute routine on at least four days this week and write one journal line each day.",
      ],
      closing:
        "If your spread readings change a lot through the day, good: that is exactly what Week 2 explains.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
