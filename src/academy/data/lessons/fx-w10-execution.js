/**
 * FOREX TRADING · WEEK 10 · TRADING PLATFORM AND EXECUTION
 *
 * Curriculum 10.1 – 10.P. The platform in depth, orders placed and managed
 * without errors, and every cost between the plan and the result. The
 * practical is a supervised demo session with risk limits set in advance.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s10-execution";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 10.1 — NAVIGATING THE PLATFORMS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l29-platforms",
    moduleId: "fx-w10-execution",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1"],
    title: "Navigating Charting and Trading Platforms",
    subtitle: "Setting up MT5 and TradingView so mistakes are hard to make",
    estimatedMinutes: 16,
    intro:
      "You have been using MT5 and TradingView since Week 1. This week you set them up deliberately, the way a professional sets up a workstation: everything you need visible, nothing that makes an accidental order easy.",

    atoms: [
      {
        id: "a-fx-mt5-layout",
        title: "The MT5 workspace",
        explain:
          "MT5's desktop window has four main areas. MARKET WATCH lists symbols with bid and ask. The NAVIGATOR lists your accounts, indicators and scripts. CHARTS fill the centre. The TOOLBOX at the bottom has tabs for Trade (open positions and orders), History, Journal (the platform's log) and Calendar. Save a layout with File → Profiles, and a chart setup with a Template.",
        table: {
          caption: "Where to find what you need.",
          headers: ["You want to…", "Desktop", "Phone app"],
          rows: [
            ["See bid, ask and spread", "Market Watch (right-click → Columns → Spread)", "Quotes tab (Advanced view)"],
            ["See open trades and equity", "Toolbox → Trade", "Trade tab"],
            ["See closed trades", "Toolbox → History", "History tab"],
            ["See why an order was rejected", "Toolbox → Journal", "Settings → Journal"],
            ["Read a symbol's rules", "Market Watch → right-click → Specification", "Tap the symbol → details"],
          ],
        },
      },
      {
        id: "a-fx-tradingview-layout",
        title: "The TradingView workspace",
        explain:
          "On TradingView, save one chart LAYOUT with your standard toolkit: candles, the 50 EMA, RSI(14) and ATR(14), and the time zone set to Lagos. Use the multi-chart layout, or separate saved layouts, to see the daily, 4-hour and 1-hour charts of one pair together. Set ALERTS on your zones so the platform tells you when price arrives, instead of you watching all day.",
        why: "Alerts are what make the course workable alongside a job: your analysis is done in the evening, and your phone tells you when price reaches a level that deserves a look.",
      },
      {
        id: "a-fx-one-click",
        title: "Settings that prevent expensive accidents",
        explain:
          "MT5 has a ONE-CLICK TRADING option that places an order the instant you click Buy or Sell on the chart, without a confirmation window. It is fast, and it is the source of a great many accidental trades. Platforms also remember the last volume you used, so a lot size from one trade can carry over to the next.",
        decision: {
          scenario: "You are setting up MT5 on your laptop for the supervised session this week.",
          question: "Which setup is safest?",
          options: [
            {
              id: "a",
              text: "One-click trading OFF, and check the volume box on every ticket against your calculator before sending",
              why: "Right. A confirmation step and a habit of checking volume prevent most order-entry errors at almost no cost in speed.",
            },
            {
              id: "b",
              text: "One-click trading ON, so you never miss an entry",
              whyWrong: "Your strategy uses closed candles and pending orders; a second of speed buys nothing, and accidental clicks cost real money.",
            },
            {
              id: "c",
              text: "One-click ON, but only on the phone",
              whyWrong: "Phones are where accidental taps are most likely.",
            },
            {
              id: "d",
              text: "It does not matter on a demo",
              whyWrong: "The demo is where you build the habits you would use on a live account. Build safe ones.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 10.2 — PLACING, MODIFYING AND CLOSING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l30-order-management",
    moduleId: "fx-w10-execution",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.2"],
    title: "Placing, Modifying and Closing Simulated Orders",
    subtitle: "Order management, done exactly to plan",
    estimatedMinutes: 20,
    intro:
      "Placing an order is a skill with steps that can each go wrong: the type, the direction, the volume, the price, the stop and the target. Managing it afterwards has its own rules. This lesson drills both until they are routine.",

    atoms: [
      {
        id: "a-fx-order-routine",
        title: "The order-entry routine",
        explain:
          "Use the same routine every time: (1) checklist all 'yes'; (2) calculator gives the lot size; (3) open the ticket and select the symbol; (4) choose the type; (5) type volume, price, stop and target from your written plan; (6) read the whole ticket back aloud, out loud if it helps; (7) send; (8) check the Trade tab shows what you intended; (9) write the journal row.",
        why: "Step 8 catches most errors within seconds, while they are still cheap. Traders who skip it discover a missing stop-loss hours later.",
      },
      {
        id: "a-fx-pending-ticket",
        title: "A pending order on a yen pair",
        explain:
          "Yen pairs are where sizing mistakes are most common, because a pip is 0.01 and its dollar value depends on the price. Size it with the formula, using the pip value at the ENTRY price.",
        ticketExercise: {
          task:
            "Plan, on a $1,000 account risking exactly 1%: SELL USD/JPY only if it breaks down to 149.800. Stop at 150.200, target at 149.000. Size it yourself (at 149.80, a pip on one lot is $6.68) and place the pending order.",
          pair: "USD/JPY",
          bid: 150.245,
          ask: 150.262,
          balance: 1000,
          leverage: 30,
          riskPercent: 1,
          expect: { type: "sell-stop", side: "sell", lots: 0.03, entry: 149.8, sl: 150.2, tp: 149.0 },
          explain:
            "A Sell Stop, because you sell BELOW the current price after a break. Stop distance 40 pips × $6.68 = $267.20 per lot; $10 ÷ $267.20 = 0.037, rounded DOWN to 0.03. The target is 80 pips: 2R.",
        },
      },
      {
        id: "a-fx-modifying",
        title: "Modifying a trade: only to reduce risk, only by rule",
        explain:
          "Once a trade is open there are a few legitimate modifications, each of which must be a written rule. Moving the stop to BREAKEVEN (the entry price) after price has moved a set distance. TRAILING the stop behind new swing points. Taking a PARTIAL close at a set level. Deleting a pending order whose setup has expired. What is never legitimate is moving a stop further away or a target further out because of hope.",
        decision: {
          scenario:
            "Your rules say: move the stop to breakeven once price reaches +1R. Price reaches +0.8R and then starts to pull back. You feel the urge to move the stop to breakeven now 'to be safe'.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Leave the stop where it is; the rule triggers at +1R",
              why: "Right. Moving early feels safe but changes the strategy: in your backtest, trades were allowed to pull back from +0.8R, and some of those went on to win.",
            },
            {
              id: "b",
              text: "Move it to breakeven now; it cannot hurt",
              whyWrong: "It can: it turns some future winners into breakeven exits, and your live results stop matching your tested strategy.",
            },
            {
              id: "c",
              text: "Close the trade at +0.8R",
              whyWrong: "No rule says to close at +0.8R. An unplanned exit is as much a rule break as an unplanned entry.",
            },
            {
              id: "d",
              text: "Move the stop further away so the pullback cannot reach it",
              whyWrong: "That increases risk, which is never a legitimate modification.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-closing",
        title: "Closing, and checking the result",
        explain:
          "A trade closes when the stop or target is hit, or when you close it under a written exit rule. Afterwards, find it in the History tab and compare: did the exit price match the level? Was the loss at the stop the amount your calculator said? A difference means slippage, a spread you did not account for, or a sizing error, and each needs a different fix.",
        mistake:
          "Looking only at whether the trade made or lost money. A loss of $10.40 on a trade planned to lose $10.00 is information: 0.4R of extra cost you need to understand.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 10.3 + 10.P — COSTS AND EXECUTION ERRORS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l31-costs-errors",
    moduleId: "fx-w10-execution",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.3", "10.P"],
    title: "Spreads, Commissions, Swaps, Slippage and Execution Errors",
    subtitle: "Everything between the plan and the result",
    estimatedMinutes: 20,
    intro:
      "Week 3 introduced trading costs. This lesson measures them on your own account and adds the cost nobody advertises: your own mistakes. Then you put it all together in a supervised demo session with limits fixed in advance.",

    atoms: [
      {
        id: "a-fx-swaps",
        title: "Swaps in detail",
        explain:
          "A SWAP (also called rollover or overnight financing) is charged or paid on positions held past the daily rollover, around 17:00 New York time. It reflects the interest-rate difference between the two currencies plus the broker's fee, so it can be positive on one side and negative on the other. Many brokers apply a TRIPLE swap on one weekday, commonly Wednesday, to cover the weekend. MT5's Specification window shows the swap rates for each symbol.",
        calcExercise: {
          scenario:
            "On a raw-spread account you hold 0.20 lots of EUR/USD for three nights. Spread 0.2 pips ($10 per pip per lot), commission $7 per lot round trip, and swap charges totalling $2.04.",
          question: "What is the total cost of the trade?",
          unit: "USD",
          answer: 3.84,
          tolerance: 0.005,
          hint: "Spread cost + commission × lots + swap.",
          working: "Spread: 0.2 × $10 × 0.20 = $0.40\nCommission: $7 × 0.20 = $1.40\nSwap: $2.04\nTotal: $3.84 — the swap is the biggest part.",
          check: { fn: "tradeCost", args: { spreadPips: 0.2, pipValuePerLot: 10, lots: 0.2, commissionPerLot: 7, swap: 2.04 } },
        },
      },
      {
        id: "a-fx-execution-errors",
        title: "Execution errors",
        explain:
          "An EXECUTION ERROR is a mistake in carrying out the plan, as opposed to a plan that lost. They are common, they are expensive, and they are almost entirely preventable with the routine in the last lesson.",
        table: {
          caption: "The commonest errors and what prevents them.",
          headers: ["Error", "Prevention"],
          rows: [
            ["Wrong direction (buy instead of sell)", "Say the direction aloud; read the ticket back"],
            ["Wrong volume (1.00 instead of 0.10)", "Calculator first; check the volume box every time"],
            ["Missing stop-loss", "Type SL on the ticket before sending; check the Trade tab"],
            ["Wrong symbol or account", "Check the symbol and the account number in the title bar"],
            ["Pending order on the wrong side", "Limits are better price, stops are proof first"],
            ["Forgotten pending order triggers later", "Expiry time on every pending order; delete expired setups"],
          ],
        },
      },
      {
        id: "a-fx-measure-costs",
        title: "Measuring your real costs",
        explain:
          "From now on, every journal row records the planned entry, the actual fill, the planned stop or target and the actual exit, plus commission and swap. Over twenty trades, average them. That gives your true cost per trade in R, which is the number your backtest should deduct.",
        decision: {
          scenario:
            "Over 20 demo trades, your stops have filled on average 0.6 pips worse than their levels, and your entries 0.3 pips worse. Your backtest assumed no slippage.",
          question: "What should you do with this information?",
          options: [
            {
              id: "a",
              text: "Add this measured slippage to the backtest's costs and recalculate its expectancy",
              why: "Right. The backtest should reflect the conditions you actually trade in. If the edge survives realistic costs, good; if not, better to know now.",
            },
            {
              id: "b",
              text: "Ignore it; it is less than a pip",
              whyWrong: "Under a pip can be a large share of a small stop's risk, and it applies to every single trade.",
            },
            {
              id: "c",
              text: "Change broker immediately",
              whyWrong: "Some slippage is normal. Compare first; if it is persistently one-sided and large, then investigate the broker.",
            },
            {
              id: "d",
              text: "Remove stop-losses to avoid stop slippage",
              whyWrong: "That removes the protection that limits losses to a planned size.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-supervised-session",
        title: "Practical: the supervised demo session",
        explain:
          "This week's practical is a demo session with risk limits written BEFORE it starts, observed by a fellow learner or tutor (in person or on a screen-share call), or recorded on your screen if neither is available. The observer checks process only: was the checklist done, the size calculated, the ticket read back, the journal written?",
        example:
          "SESSION LIMITS — written before starting\n\n  Account balance at start:    $1,000.00\n  Risk per trade:              1% ($10.00)\n  Maximum trades:              5\n  Maximum open at once:        2\n  Session loss limit:          −2% ($20.00) → session ends\n  Session window:              14:00–18:00 Lagos\n  Observer:                    ______________\n\n  Observer's checklist per trade:  checklist ✓  calculator ✓\n  ticket read back ✓  Trade tab checked ✓  journal row ✓",
      },
    ],

    task: {
      title: "This week's practical work",
      intro: "Supervised, with limits written first. The result in dollars is not assessed; the process is.",
      prompts: [
        "Set up MT5 with one-click trading off, a saved profile and template, and TradingView with alerts on your current zones.",
        "Write your session limits, using the template, and give them to your observer before you start.",
        "Run the session: up to five trades, each following the full order-entry routine, under observation or screen recording.",
        "Afterwards, for each trade, record planned versus actual entry and exit, commission and swap, and the observer's process notes.",
        "Calculate your average cost per trade in R and add it to your backtest from Week 9.",
      ],
      closing: "A session with no trades because nothing met the checklist is a completed exercise. Hitting the session loss limit and stopping is too.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
