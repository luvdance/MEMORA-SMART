/**
 * FOREX TRADING · WEEK 2 · HOW FOREX TRADING WORKS
 *
 * Curriculum 2.1 – 2.P. Who is on the other side of a retail trade, every
 * order type a learner will use, and when the market is open, busy and
 * expensive. The practical is the first full trade lifecycle on the demo
 * account: open, modify, close.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Session times are given in UTC and in Lagos time (WAT, UTC+1, which does
 * not change for daylight saving). London and New York DO change, so their
 * Lagos times move by an hour twice a year; the lesson says so.
 */

export const SECTION_ID = "fx-s2-mechanics";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 — BROKERS, LIQUIDITY AND EXECUTION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l05-brokers-execution",
    moduleId: "fx-w2-mechanics",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1"],
    title: "Brokers, Liquidity and Execution",
    subtitle: "Who is on the other side of your trade",
    estimatedMinutes: 16,
    intro:
      "When you click Buy on your phone, something has to sell to you. This lesson follows that click from your app to the price, explains the different kinds of broker, and shows what can happen between the price you saw and the price you got.",

    atoms: [
      {
        id: "a-fx-market-tiers",
        title: "The layers of the market",
        explain:
          "The forex market is layered. At the top is the INTERBANK market, where the largest banks trade enormous amounts with each other. Below them are LIQUIDITY PROVIDERS: banks and specialist firms that continuously quote prices at which they will buy and sell. RETAIL BROKERS connect to one or more liquidity providers, or quote prices themselves, and offer those prices to individual traders like you through a platform such as MT5.",
        why: "Each layer adds a little cost and a little delay. That is why your spread is wider than a bank's, and why the price you see is your broker's price, not 'the' price. It also means your broker matters: its connections, its business model and its regulation all affect what you pay.",
        table: {
          caption: "From the top of the market to your phone.",
          headers: ["Layer", "Who", "What they do"],
          rows: [
            ["Interbank", "The largest global banks", "Trade with each other in very large amounts"],
            ["Liquidity providers", "Banks, non-bank market makers", "Stream buy and sell prices to brokers and institutions"],
            ["Retail brokers", "Firms licensed to deal with the public", "Give you a platform, prices, leverage and an account"],
            ["Retail traders", "Individuals", "Trade small amounts through a broker"],
          ],
        },
      },
      {
        id: "a-fx-broker-models",
        title: "Market makers, STP and ECN brokers",
        explain:
          "Brokers make money in different ways. A MARKET MAKER, or dealing-desk broker, takes the other side of your trades itself: when you buy, it sells to you. An STP broker (straight-through processing) passes your orders on to its liquidity providers. An ECN-style broker gives you access to a network of competing quotes, usually with very tight 'raw' spreads plus a separate commission. Many brokers mix these models.",
        why: "A market maker profits when its clients lose, which is a conflict of interest, so how it is regulated and supervised matters a great deal. That does not make every market maker dishonest; it makes regulation essential. You will learn how to check a broker's regulation in Week 12.",
        table: {
          caption: "The models compared. Real brokers often combine them.",
          headers: ["Model", "Who takes the other side", "How it is paid", "Watch for"],
          rows: [
            ["Market maker (dealing desk)", "The broker", "Spread, and client losses", "Conflict of interest; requires strong regulation"],
            ["STP", "Liquidity providers", "A mark-up on the spread", "Spread widening at busy times"],
            ["ECN-style", "Other participants on the network", "Commission per lot, raw spread", "Commission must be counted as a cost"],
          ],
        },
        mistake:
          "Believing a broker that says it has 'no conflict of interest' and 'zero spread' without checking. Every broker is paid by someone; if you cannot see how, ask.",
      },
      {
        id: "a-fx-participants",
        title: "The main market participants",
        explain:
          "Different participants trade for different reasons and in very different sizes. CENTRAL BANKS manage reserves and policy. COMMERCIAL AND INVESTMENT BANKS make markets and trade for clients and themselves. INSTITUTIONAL INVESTORS, such as pension funds, insurers and hedge funds, move money between countries. CORPORATIONS exchange currency for trade. RETAIL TRADERS are by far the smallest participants by volume.",
        why: "Big moves are driven by big participants. A retail trader does not move EUR/USD; a change in what large institutions expect about interest rates does. Knowing that helps you ask the right question about any price move: who would have to be buying or selling to cause this?",
        table: {
          caption: "Who trades, and roughly why.",
          headers: ["Participant", "Main reason", "Typical time horizon"],
          rows: [
            ["Central banks", "Policy, reserves, stability", "Months to years"],
            ["Banks' dealing desks", "Making markets, client flow", "Seconds to days"],
            ["Pension funds and insurers", "International investment", "Months to years"],
            ["Hedge funds", "Speculation and macro views", "Days to months"],
            ["Corporations", "Paying for and selling goods", "Matched to their business"],
            ["Retail traders", "Speculation", "Minutes to weeks"],
          ],
        },
      },
      {
        id: "a-fx-execution",
        title: "Execution: what happens when you click",
        explain:
          "EXECUTION is the process of filling your order. MT5 accounts use one of a few modes. With MARKET EXECUTION, your order is filled at the best price available when it reaches the broker, which can differ from the price on your screen. With INSTANT EXECUTION, the broker tries to fill at your screen price and, if the price has moved, offers you a new one, called a REQUOTE. The difference between the price you expected and the price you got is SLIPPAGE.",
        why: "Slippage is not always against you: it can be positive. But in fast markets, especially around major news, it is usually negative and can be several pips. A plan that assumes perfect fills will look better on paper than it performs.",
        decision: {
          scenario:
            "You click Buy on EUR/USD when the ask shows 1.08514, with market execution. Your trade opens at 1.08519.",
          question: "What happened?",
          options: [
            {
              id: "a",
              text: "The broker has cheated you and you should complain",
              whyWrong:
                "Half a pip of slippage on market execution is normal; prices move between your click and the fill. Persistent one-sided slippage would be worth investigating, but one fill is not evidence.",
            },
            {
              id: "b",
              text: "Negative slippage of 0.5 pips: the best available price had moved by the time the order arrived",
              why: "Right. (1.08519 − 1.08514) ÷ 0.0001 = 0.5 pips. It is a real cost and belongs in your journal, which is how you will later measure your average slippage.",
            },
            {
              id: "c",
              text: "A requote",
              whyWrong: "A requote happens in instant execution, when the broker offers a new price and asks you to accept it. Here the order simply filled at a different price.",
            },
            {
              id: "d",
              text: "The spread was 0.5 pips",
              whyWrong: "The spread is the gap between bid and ask at one moment. This is the gap between the ask you saw and the ask you got.",
            },
          ],
          correct: "b",
          aftermath:
            "Add a column to your journal: 'Expected price vs fill'. By Week 14 you will have real data on your own execution quality.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.2 — ORDER TYPES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l06-order-types",
    moduleId: "fx-w2-mechanics",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.2"],
    title: "Orders: Market, Limit, Stop, Stop-Loss and Take-Profit",
    subtitle: "Every instruction you can give your broker",
    estimatedMinutes: 20,
    intro:
      "An order is an instruction to your broker. You can trade now, at the market, or leave an instruction to trade later if price reaches a level. And every trade can carry two exits set in advance: one that limits your loss and one that takes your profit. By the end of this lesson you will place each kind on a simulated MT5 ticket.",

    atoms: [
      {
        id: "a-fx-market-order",
        title: "Market orders: trade now",
        explain:
          "A MARKET ORDER opens a trade immediately at the current price. A market BUY fills at the ASK; a market SELL fills at the BID. In MT5 you choose 'Market Execution' as the type and click 'Buy by Market' or 'Sell by Market'.",
        why: "Use a market order when the conditions for your trade are met now. You get certainty of being in the trade, but not certainty of price, because of slippage.",
        mistake:
          "Using market orders for every trade and chasing price after it has already moved. If your plan says 'buy at 1.0820' and price is at 1.0845, a market order buys 25 pips worse than planned. That is what pending orders are for.",
      },
      {
        id: "a-fx-pending-orders",
        title: "Pending orders: trade later, at your price",
        explain:
          "A PENDING ORDER waits until price reaches a level you choose, then opens a trade. There are four. A LIMIT order trades at a BETTER price than now: a Buy Limit sits below the current price, a Sell Limit above it. A STOP order trades once price has moved FURTHER in your direction: a Buy Stop sits above the current price, a Sell Stop below it.",
        why: "Limits are for 'I want to buy cheaper, on a pullback'. Stops are for 'I want to buy only if price breaks above this level, proving strength'. Mixing them up is one of the most common platform errors, and MT5 rejects a pending order placed on the wrong side with 'Invalid price'.",
        table: {
          caption: "The four pending orders. Current EUR/USD: bid 1.08502, ask 1.08514.",
          headers: ["Order", "Where it sits", "Idea", "Example level"],
          rows: [
            ["Buy Limit", "Below the current ask", "Buy a dip", "1.08200"],
            ["Sell Limit", "Above the current bid", "Sell a rally", "1.08800"],
            ["Buy Stop", "Above the current ask", "Buy a breakout", "1.08800"],
            ["Sell Stop", "Below the current bid", "Sell a breakdown", "1.08200"],
          ],
        },
        ticketExercise: {
          task:
            "Your plan: EUR/USD may dip to support at 1.08200 before rising. Place a pending order to BUY 0.05 lots at 1.08200, with a stop-loss at 1.08000 and a take-profit at 1.08600.",
          pair: "EUR/USD",
          bid: 1.08502,
          ask: 1.08514,
          balance: 1000,
          leverage: 30,
          expect: { type: "buy-limit", side: "buy", lots: 0.05, entry: 1.082, sl: 1.08, tp: 1.086 },
          explain:
            "A Buy Limit, because you want to buy BELOW the current price. Notice the readout: 20 pips of risk at 0.05 lots is $10, and the target is twice that.",
        },
      },
      {
        id: "a-fx-pending-choice",
        title: "Choosing the right pending order",
        explain:
          "To choose, ask two questions. Am I buying or selling? Is my level better than the current price (a limit) or beyond it, after price has proved itself (a stop)? Answer both and only one order type fits.",
        decision: {
          scenario:
            "GBP/USD is at 1.26420. It has failed three times to rise above 1.26800. Your plan is to SELL only if price breaks DOWN below support at 1.26000, because that would show sellers have taken control.",
          question: "Which order do you place, and where?",
          options: [
            {
              id: "a",
              text: "Sell Limit at 1.26000",
              whyWrong:
                "A Sell Limit sells ABOVE the current price, on a rally. 1.26000 is below, so MT5 would reject it, and the idea is wrong anyway: you want to sell after a fall, not a rise.",
            },
            {
              id: "b",
              text: "Sell Stop at 1.26000",
              why: "Correct. You are selling, and only once price has moved further down, through support. That is exactly what a Sell Stop below the current bid does.",
            },
            {
              id: "c",
              text: "Buy Stop at 1.26800",
              whyWrong: "That buys a break UP through resistance. Your plan is to sell a break DOWN.",
            },
            {
              id: "d",
              text: "A market sell now at 1.26420",
              whyWrong: "Your condition, a break below 1.26000, has not happened. Selling now acts on a plan before its condition is met.",
            },
          ],
          correct: "b",
          aftermath:
            "A useful memory aid: limits are 'better price', stops are 'proof first'.",
        },
      },
      {
        id: "a-fx-stop-loss",
        title: "The stop-loss",
        explain:
          "A STOP-LOSS is an order attached to a trade that closes it automatically if price moves against you to a level you set. On a buy it sits below the entry; on a sell it sits above. It is the single most important order in trading, because it turns 'I hope it comes back' into a loss you decided in advance and can afford.",
        why: "Without a stop-loss, a single bad trade, or a sudden move while you are asleep, can take any amount of your account. Every trade in this course carries one. In Week 3 you will learn to choose its distance first and then size the trade so that the stop costs a fixed small percentage of your account.",
        mistake:
          "Moving the stop-loss further away when price approaches it, 'to give the trade room'. That is deciding, under pressure, to lose more than you planned. You may move a stop to REDUCE risk; never to increase it.",
      },
      {
        id: "a-fx-take-profit",
        title: "The take-profit",
        explain:
          "A TAKE-PROFIT closes the trade automatically when price reaches your target. On a buy it sits above the entry; on a sell, below. Together, stop-loss and take-profit define the trade before it starts: where you are wrong, where you are satisfied, and so the reward you are aiming for relative to the risk you are taking.",
        why: "Pre-set exits remove the hardest decisions from the moment of highest emotion. Many beginners close winners too early out of fear and let losers run out of hope. Exits set in advance stop both.",
        ticketExercise: {
          task:
            "Your plan: sell GBP/USD now at the market, 0.02 lots, stop-loss at 1.26700, take-profit at 1.25900.",
          pair: "GBP/USD",
          bid: 1.26418,
          ask: 1.26436,
          balance: 1000,
          leverage: 30,
          expect: { type: "market", side: "sell", lots: 0.02, sl: 1.267, tp: 1.259 },
          explain:
            "A market sell fills at the bid, 1.26418. The stop is 28.2 pips above, the target 51.8 pips below: nearly twice as much potential reward as risk.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.3 + 2.P — SESSIONS, HOURS, VOLATILITY, COSTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l07-sessions-costs",
    moduleId: "fx-w2-mechanics",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.3", "2.P"],
    title: "Sessions, Market Hours, Volatility and Costs",
    subtitle: "When the market is busy, when it is thin, and what each trade costs",
    estimatedMinutes: 18,
    intro:
      "The market is open twenty-four hours on weekdays, but it is not equally alive all that time. Activity follows the business day around the world, and with activity come movement, tighter spreads and better fills. This lesson maps that day onto Lagos time, then counts every cost of a trade.",

    atoms: [
      {
        id: "a-fx-sessions",
        title: "The four trading sessions",
        explain:
          "The trading day is usually described as four overlapping SESSIONS, named after the financial centres that dominate them: Sydney, Tokyo, London and New York. London is the largest; the London–New York overlap is usually the most active part of the day for the major pairs.",
        why: "A pair is most active when the markets of its currencies are open. EUR/USD and GBP/USD come alive at the London open; USD/JPY and AUD/USD are active in the Tokyo session. Trading a pair in its quiet hours usually means wider spreads and smaller moves.",
        table: {
          caption:
            "Approximate session hours in UTC and Lagos time (WAT, UTC+1) during the northern winter. From late March to late October London and New York run about one hour EARLIER in both columns; Sydney shifts the other way.",
          headers: ["Session", "UTC", "Lagos (WAT)", "Most active pairs"],
          rows: [
            ["Sydney", "22:00 – 07:00", "23:00 – 08:00", "AUD/USD, NZD/USD"],
            ["Tokyo", "00:00 – 09:00", "01:00 – 10:00", "USD/JPY, AUD/JPY"],
            ["London", "08:00 – 17:00", "09:00 – 18:00", "EUR/USD, GBP/USD, EUR/GBP"],
            ["New York", "13:00 – 22:00", "14:00 – 23:00", "EUR/USD, USD/CAD, all USD pairs"],
            ["London–New York overlap", "13:00 – 17:00", "14:00 – 18:00", "The majors' most active window"],
          ],
        },
      },
      {
        id: "a-fx-weekly-hours",
        title: "The trading week",
        explain:
          "The forex week opens on Sunday evening UTC, when Sydney starts Monday morning, and closes on Friday evening when New York finishes. In the northern winter that is roughly Sunday 22:00 to Friday 22:00 UTC, which is Sunday 23:00 to Friday 23:00 in Lagos. Brokers publish their exact hours, and they shift with daylight saving.",
        why: "The first hour after the Sunday open is thin: spreads can be very wide and prices can GAP from Friday's close. Holding a trade over the weekend means accepting that your stop-loss might fill at a much worse price if Monday opens beyond it.",
        mistake:
          "Placing a trade at 23:30 on a Sunday in Lagos because 'the market just opened'. That is the least liquid moment of the week. Wait for London.",
      },
      {
        id: "a-fx-volatility-sessions",
        title: "Volatility through the day",
        explain:
          "VOLATILITY is how much price moves in a period. For the majors it tends to rise at the London open, peak in the London–New York overlap and around scheduled news, and fall in the late New York afternoon and the early Asian hours. It is a pattern, not a rule: a quiet afternoon can explode on unexpected news.",
        decision: {
          scenario:
            "Amaka works 09:00–17:00 in Lagos and wants to practise trading EUR/USD on her demo account. She can trade before 08:00, at lunchtime (12:30–13:30), or in the evening after 18:00.",
          question: "Which window gives her the most typical EUR/USD activity with reasonable spreads?",
          options: [
            {
              id: "a",
              text: "Before 08:00 Lagos time",
              whyWrong: "That is the late Asian session, before London opens. EUR/USD is usually at its quietest then.",
            },
            {
              id: "b",
              text: "Lunchtime, 12:30–13:30 Lagos time",
              why: "London is in full swing and New York is about to open. EUR/USD is usually liquid and active, and on many days US data is released around 13:30–14:30 Lagos time, so she must check the calendar first.",
            },
            {
              id: "c",
              text: "After 22:00 Lagos time",
              whyWrong: "New York is closing and liquidity is thinning. Spreads often widen around the daily rollover.",
            },
            {
              id: "d",
              text: "It makes no difference; forex is a 24-hour market",
              whyWrong: "Open does not mean active. Spread, movement and fill quality all vary greatly through the day.",
            },
          ],
          correct: "b",
          aftermath:
            "Her evening window, 18:00–22:00, also works for New York-hours practice. The point is to choose a window deliberately and trade in it consistently.",
        },
      },
      {
        id: "a-fx-trading-costs",
        title: "What a trade costs",
        explain:
          "Every trade has costs, whether or not they appear as a line on your statement. The SPREAD is paid on every trade. Some accounts also charge a COMMISSION per lot traded. Positions held past the daily rollover, around 17:00 New York time, pay or receive a SWAP, an overnight interest adjustment. And SLIPPAGE can make fills worse than expected.",
        why: "Costs are certain; profits are not. A beginner focused on targets often ignores costs completely, but for anyone trading frequently they decide whether a strategy can work at all. You will measure them precisely in Week 10.",
        table: {
          caption: "The four costs.",
          headers: ["Cost", "When you pay it", "Shown where in MT5"],
          rows: [
            ["Spread", "Every trade, at entry", "Inside the price: you buy at the ask, sell at the bid"],
            ["Commission", "Per lot, on some account types", "'Commission' column in the trade history"],
            ["Swap", "Each night a position is held past rollover", "'Swap' column of the open position"],
            ["Slippage", "When a fill differs from the expected price", "Only visible if you compare expected and actual prices"],
          ],
        },
        calcExercise: {
          scenario:
            "You trade 0.50 lots of EUR/USD. The spread is 1.2 pips. One pip on one standard lot of EUR/USD is worth $10.",
          question: "What does the spread cost you on this trade, in dollars?",
          unit: "USD",
          answer: 6,
          tolerance: 0.01,
          hint: "Spread in pips × value of a pip per lot × number of lots.",
          working: "1.2 pips × $10 per pip per lot × 0.50 lots = $6.00",
          check: { fn: "spreadCost", args: { spreadPips: 1.2, pipValuePerLot: 10, lots: 0.5 } },
        },
      },
      {
        id: "a-fx-practical-lifecycle",
        title: "Practical: the life of one demo trade",
        explain:
          "This week's practical is a full trade lifecycle on your MT5 demo: open it, modify it, close it, and find it in your history. The steps are below for desktop and phone. Use 0.01 lots; the point is the process, not the result.",
        table: {
          caption: "Opening, modifying and closing in MT5. Labels can vary slightly between versions.",
          headers: ["Step", "Desktop", "Phone app"],
          rows: [
            ["Open", "Right-click EURUSD in Market Watch → New Order → Market Execution → 0.01 → Buy by Market", "Quotes → tap EURUSD → Trade → 0.01 → Buy by Market"],
            ["Add or change SL and TP", "Toolbox → Trade tab → double-click the position → set Stop Loss and Take Profit → Modify", "Trade tab → press and hold the position → Modify"],
            ["Watch it", "Toolbox → Trade: price, profit, and your account's equity", "Trade tab shows balance, equity and floating P/L"],
            ["Close", "Double-click the position → Close (or the × in the Trade tab)", "Press and hold the position → Close"],
            ["Find it", "Toolbox → History tab", "History tab"],
          ],
        },
        mistake:
          "Closing the demo trade and moving on without writing anything down. The practical is not done until the journal row is complete: entry, SL and TP, any modification, exit, result, and whether you did each step correctly.",
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "All on your MT5 demo account with 0.01 lots, the smallest standard size. Record every step in your journal.",
      prompts: [
        "Open a market BUY on EUR/USD during the London–New York overlap. Note the ask you saw and the price you got: was there slippage?",
        "Modify the trade: add a stop-loss 20 pips below the entry and a take-profit 40 pips above. Note both levels.",
        "Close the trade manually after at least ten minutes, whatever the result. Find it in the History tab and copy the details to your journal.",
        "Place one Buy Limit and one Sell Stop on GBP/USD at levels you choose, each with a stop-loss and take-profit. Then delete them before they trigger. Write down why each level was on the correct side of the price.",
        "Record EUR/USD's spread at three different times this week: before 08:00, around 14:00 and after 22:00 Lagos time. Which was widest?",
      ],
      closing:
        "If MT5 rejected an order with 'Invalid price' or 'Invalid stops', write down why. Understanding a rejection is part of the skill.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
