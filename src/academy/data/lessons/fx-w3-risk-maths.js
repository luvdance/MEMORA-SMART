/**
 * FOREX TRADING · WEEK 3 · TRADING MATHEMATICS AND RISK
 *
 * Curriculum 3.1 – 3.P. The most important week of the course. Pip values,
 * leverage and margin, and the position-size formula that decides how much
 * any trade can lose. From this week on, every demo trade is sized first.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every number a learner is asked to calculate is recomputed by the build
 * from lib/academy/forex/engine.js. The account currency is USD throughout.
 */

export const SECTION_ID = "fx-s3-risk-maths";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 3.1 — PIP VALUES AND CONTRACT SPECIFICATIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l08-pip-values",
    moduleId: "fx-w3-risk-maths",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1"],
    title: "Pip Values, Lot Sizes and Contract Specifications",
    subtitle: "Turning pips into money",
    estimatedMinutes: 20,
    intro:
      "In Week 1 you measured moves in pips. A pip is not worth the same amount on every pair or every trade size, though, and until you can convert pips into dollars you cannot know what a trade risks. This lesson gives you the three conversions you will ever need.",

    atoms: [
      {
        id: "a-fx-pip-value-usd-quote",
        title: "When the dollar is the quote currency",
        explain:
          "For any pair ending in USD, such as EUR/USD, GBP/USD, AUD/USD or NZD/USD, the profit or loss is already in dollars. One pip is 0.0001, and one standard lot is 100,000 units, so one pip on one lot is 0.0001 × 100,000 = $10. On any other size, multiply by the lots.",
        why: "This is the number you will use most often, and it is fixed: $10 per pip per lot, whatever the price. Memorise it.",
        example:
          "PIP VALUE, quote currency USD\n\n  pip value = 0.0001 × 100,000 × lots\n\n  1.00 lot  →  $10.00 per pip\n  0.10 lot  →  $1.00  per pip\n  0.04 lot  →  $0.40  per pip",
        calcExercise: {
          scenario: "You buy 0.30 lots of GBP/USD.",
          question: "How much is one pip worth on this position, in dollars?",
          unit: "USD",
          answer: 3,
          tolerance: 0.005,
          hint: "The quote currency is USD, so one pip on one lot is $10.",
          working: "$10 per pip per lot × 0.30 lots = $3.00 per pip",
          check: { fn: "pipValue", args: { pair: "GBP/USD", lots: 0.3 } },
        },
      },
      {
        id: "a-fx-pip-value-usd-base",
        title: "When the dollar is the base currency",
        explain:
          "For pairs starting with USD, such as USD/JPY, USD/CHF or USD/CAD, a pip is worth a fixed amount of the QUOTE currency, and you convert it to dollars by dividing by the current price. On USD/JPY one pip on one lot is 0.01 × 100,000 = ¥1,000, and ¥1,000 ÷ 150.00 = $6.67.",
        why: "Because you divide by the price, the dollar value of a pip changes slightly as the pair moves. That is why a trade sized for $10 of risk on USD/JPY needs a different lot size from the same trade on EUR/USD.",
        example:
          "PIP VALUE, base currency USD (USD/JPY at 150.00)\n\n  pip in yen     = 0.01 × 100,000 × lots      = ¥1,000 per lot\n  pip in dollars = ¥1,000 ÷ 150.00             = $6.67 per lot",
        calcExercise: {
          scenario: "You hold 0.50 lots of USD/JPY. The price is 152.40.",
          question: "What is one pip worth, in dollars? Round to the cent.",
          unit: "USD",
          answer: 3.28,
          tolerance: 0.005,
          hint: "Find the pip value in yen first (0.01 × 100,000 × 0.50), then divide by the price.",
          working: "Pip in yen: 0.01 × 100,000 × 0.50 = ¥500\nIn dollars: ¥500 ÷ 152.40 = $3.28",
          check: { fn: "pipValue", args: { pair: "USD/JPY", lots: 0.5, price: 152.4 } },
        },
      },
      {
        id: "a-fx-pip-value-cross",
        title: "Crosses: when the dollar is in neither",
        explain:
          "For a cross such as EUR/GBP, a pip is worth a fixed amount of the quote currency, here pounds, and you convert that to dollars with the quote currency's own dollar rate, here GBP/USD. One pip on one lot of EUR/GBP is £10; if GBP/USD is 1.2640, that is £10 × 1.2640 = $12.64.",
        why: "Crosses are where beginners most often get the risk wrong, because they assume $10 a pip. On EUR/GBP that assumption understates the risk by over a quarter.",
        calcExercise: {
          scenario: "You trade 0.20 lots of EUR/GBP. GBP/USD is 1.2640.",
          question: "What is one pip worth on this position, in dollars? Round to the cent.",
          unit: "USD",
          answer: 2.53,
          tolerance: 0.005,
          hint: "The pip is worth £10 per lot in the quote currency. Convert pounds to dollars with GBP/USD.",
          working: "Pip in pounds: 0.0001 × 100,000 × 0.20 = £2.00\nIn dollars: £2.00 × 1.2640 = $2.528 ≈ $2.53",
          check: { fn: "pipValue", args: { pair: "EUR/GBP", lots: 0.2, quoteToUsd: 1.264 } },
        },
        mistake:
          "Doing these conversions in your head mid-trade. Build them into your spreadsheet calculator once, then trust it. MT5 also shows the result of an open position in dollars, so you can check your calculator against it.",
      },
      {
        id: "a-fx-contract-spec",
        title: "Reading a contract specification",
        explain:
          "Every symbol on your platform has a CONTRACT SPECIFICATION: the broker's rules for that market. In MT5 desktop, right-click the symbol in Market Watch and choose Specification; on the phone, tap the symbol and look for its details. Read it before you trade a symbol for the first time.",
        table: {
          caption: "The fields that matter, with typical EUR/USD values. Your broker's may differ.",
          headers: ["Field", "Typical value", "What it tells you"],
          rows: [
            ["Contract size", "100,000", "Units in one lot"],
            ["Digits", "5", "Decimal places in the quote (pip + pipette)"],
            ["Minimal volume / step", "0.01 / 0.01", "Smallest trade, and the increments allowed"],
            ["Margin / margin rate", "Depends on leverage", "What is locked up to open a position"],
            ["Swap long / swap short", "e.g. −6.8 / +1.9 points", "Overnight charge or credit per lot"],
            ["Trading sessions", "Mon–Fri", "When the symbol can be traded"],
            ["Stops level", "e.g. 0", "Minimum distance of SL/TP from the price"],
          ],
        },
        decision: {
          scenario:
            "Your broker's specification for GOLD shows a contract size of 100 (ounces) and 2 digits. You assumed it worked like EUR/USD, with 100,000 units per lot.",
          question: "What should you do before trading it?",
          options: [
            {
              id: "a",
              text: "Nothing; a lot is a lot",
              whyWrong: "Lot sizes differ between instruments. Gold's lot of 100 ounces behaves nothing like 100,000 euros, and the pip conventions differ too.",
            },
            {
              id: "b",
              text: "Work out what a one-dollar move in gold is worth per lot from the specification, and size from that",
              why: "Right. With 100 ounces per lot, a $1 move is $100 per lot. Never apply one market's arithmetic to another without reading its specification.",
            },
            {
              id: "c",
              text: "Use the maximum volume so the pip value is clear",
              whyWrong: "The maximum volume has nothing to do with understanding the contract, and is enormous risk.",
            },
            {
              id: "d",
              text: "Ask in a Telegram group what lot size to use",
              whyWrong: "The answer depends on YOUR account, stop and the broker's specification. Strangers cannot know it.",
            },
          ],
          correct: "b",
          aftermath: "This course trades currency pairs. Gold and indices appear on most platforms, but leave them alone until you have finished it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.2 — LEVERAGE AND MARGIN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l09-leverage-margin",
    moduleId: "fx-w3-risk-maths",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.2"],
    title: "Leverage, Margin and Margin Calls",
    subtitle: "Why a small account can control a large position, and why that is dangerous",
    estimatedMinutes: 20,
    intro:
      "Leverage is the feature forex is marketed on and the one that destroys most accounts. It is not extra money. It is permission to hold a position much bigger than your account, with your account as the deposit. This lesson makes the numbers concrete.",

    atoms: [
      {
        id: "a-fx-leverage",
        title: "Leverage and the size of a position",
        explain:
          "The NOTIONAL value of a position is its full size in your account currency: 0.50 lots of EUR/USD at 1.0850 is €50,000, worth $54,250. LEVERAGE, written as a ratio like 1:30, means the broker lets you hold a position up to thirty times your margin deposit. Your gains and losses are on the whole $54,250, not on the deposit.",
        why: "A 1% move in EUR/USD on $54,250 is $542.50. On a $1,000 account that is more than half the account, from a move the pair can make in a single day. The leverage did not change the market; it changed how much of your account each move represents.",
        calcExercise: {
          scenario: "You buy 0.50 lots of EUR/USD at 1.0850.",
          question: "What is the notional value of the position, in dollars?",
          unit: "USD",
          answer: 54250,
          tolerance: 0.5,
          hint: "Lots × 100,000 gives euros. Multiply by the price to convert euros to dollars.",
          working: "0.50 × 100,000 = €50,000\n€50,000 × 1.0850 = $54,250",
          check: { fn: "notionalUsd", args: { pair: "EUR/USD", lots: 0.5, price: 1.085 } },
        },
      },
      {
        id: "a-fx-margin",
        title: "Margin: the deposit for a position",
        explain:
          "MARGIN is the part of your account the broker locks while a position is open, as a deposit against losses. Margin = notional value ÷ leverage. At 1:30, a position worth $10,850 needs $361.67 of margin. Margin is not a fee; it is returned when the trade closes. But money locked as margin cannot be used to absorb further losses on other trades.",
        calcExercise: {
          scenario: "Your leverage is 1:30. You buy 0.10 lots of EUR/USD at 1.0850.",
          question: "How much margin does the position require, in dollars?",
          unit: "USD",
          answer: 361.67,
          tolerance: 0.01,
          hint: "Find the notional value in dollars, then divide by 30.",
          working: "Notional: 0.10 × 100,000 × 1.0850 = $10,850\nMargin: $10,850 ÷ 30 = $361.67",
          check: { fn: "marginRequired", args: { pair: "EUR/USD", lots: 0.1, price: 1.085, leverage: 30 } },
        },
        mistake:
          "Thinking that because the margin is only $361.67, the trade can only lose $361.67. Losses are on the full $10,850 position and can exceed the margin; the stop-loss, not the margin, is what limits them.",
      },
      {
        id: "a-fx-free-margin-level",
        title: "Equity, free margin and margin level",
        explain:
          "MT5's Trade tab shows four numbers. BALANCE is closed-trade money. EQUITY is balance plus floating profit or loss. FREE MARGIN is equity minus used margin: what is left to absorb losses or open new trades. MARGIN LEVEL is equity ÷ used margin × 100%, and it is the number your broker watches.",
        calcExercise: {
          scenario:
            "Your open trades use $361.67 of margin. After a losing morning your equity is $420.00.",
          question: "What is your margin level, as a percentage? Round to one decimal place.",
          unit: "%",
          answer: 116.1,
          tolerance: 0.05,
          hint: "Margin level = equity ÷ used margin × 100.",
          working: "$420.00 ÷ $361.67 × 100 = 116.1%\n(Free margin is $420.00 − $361.67 = $58.33.)",
          check: { fn: "marginLevel", args: { equity: 420, usedMargin: 361.67 } },
        },
      },
      {
        id: "a-fx-margin-call",
        title: "Margin calls, stop-outs and liquidation",
        explain:
          "When your margin level falls to the broker's MARGIN CALL level, often 100%, you are warned and usually cannot open new trades. If it keeps falling to the STOP-OUT level, the broker starts closing your positions automatically, largest loser first, at whatever the price is. Retail clients of EU and UK regulated brokers are protected by a rule that positions are closed by 50%. Levels vary by broker; read yours in the account terms.",
        why: "A stop-out is liquidation at the worst moment: deep in a loss, with no control over the price. If your account is ever stopped out, your position sizes were too big. Correct sizing, the next lesson, means you should never come close.",
        decision: {
          scenario:
            "Your margin level is 105% and falling. Your broker's margin call is at 100% and stop-out at 50%. A friend tells you to deposit more money so the trades can 'come back'.",
          question: "What is the sound response?",
          options: [
            {
              id: "a",
              text: "Deposit more, so the positions are not stopped out",
              whyWrong:
                "Adding money to rescue oversized losing positions is how small losses become large ones. It is the margin version of moving your stop-loss.",
            },
            {
              id: "b",
              text: "Reduce or close positions now, accept the loss, and work out why the sizing was too big",
              why: "Right. You choose the exit instead of the broker choosing it at a worse moment, and the real lesson, the sizing error, gets fixed.",
            },
            {
              id: "c",
              text: "Increase leverage so the margin needed falls",
              whyWrong: "Changing leverage does not change the loss, which is on the full position. It only lets you dig deeper.",
            },
            {
              id: "d",
              text: "Do nothing; stop-out is at 50%, so there is plenty of room",
              whyWrong: "Hoping the gap between 105% and 50% saves you is not a plan. Many accounts travel that distance in minutes.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-effective-leverage",
        title: "The leverage that matters: effective leverage",
        explain:
          "Your account's maximum leverage, 1:30 or 1:500, is only a limit. What matters is the leverage you actually USE: EFFECTIVE LEVERAGE = total position size ÷ equity. A $1,000 account holding a $54,250 position is using about 54 times leverage, whatever the account's maximum.",
        why: "Professionals tend to keep effective leverage low, often in single figures. Position sizing by risk, which you learn next, keeps it under control automatically; leverage only becomes deadly when people size by how much the margin allows.",
        calcExercise: {
          scenario: "Your equity is $1,000. You hold one position with a notional value of $54,250.",
          question: "What effective leverage are you using? (Give the number, e.g. 12.5 for 12.5×.)",
          unit: "×",
          answer: 54.25,
          tolerance: 0.01,
          hint: "Effective leverage = total exposure ÷ equity.",
          working: "$54,250 ÷ $1,000 = 54.25 times",
          check: { fn: "effectiveLeverage", args: { exposure: 54250, equity: 1000 } },
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.3 + 3.P — POSITION SIZING, REWARD:RISK, DRAWDOWN, COSTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l10-position-sizing",
    moduleId: "fx-w3-risk-maths",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.3", "3.P"],
    title: "Position Sizing, Reward-to-Risk, Drawdown and Costs",
    subtitle: "Decide the loss first, then the size",
    estimatedMinutes: 24,
    intro:
      "Beginners choose a lot size and then discover what it risks. Professionals do it the other way round: decide how much of the account a trade may lose, decide where the stop-loss belongs, and calculate the lot size that makes the two agree. That single habit is the core of risk management.",

    atoms: [
      {
        id: "a-fx-risk-per-trade",
        title: "Risk a small, fixed percentage per trade",
        explain:
          "Choose a fixed percentage of your account that any single trade may lose if its stop-loss is hit. A common professional range is 0.5% to 2%; this course uses 1%. On a $1,000 account, 1% is $10. That is the most a trade may lose, whatever the pair, the setup or your confidence.",
        why: "Losing streaks are certain. Even a good strategy will have runs of five, eight or ten losses. At 1% risk, ten losses in a row costs about 10% of the account; at 10% risk the same streak costs about 65%. Small, fixed risk is what lets you survive long enough for any edge to show.",
        calcExercise: {
          scenario: "Your demo account balance is $1,000 and your plan risks 1% per trade.",
          question: "What is the most any single trade may lose?",
          unit: "USD",
          answer: 10,
          tolerance: 0.005,
          hint: "1% of the balance.",
          working: "$1,000 × 1 ÷ 100 = $10.00",
          check: { fn: "riskMoney", args: { balance: 1000, riskPercent: 1 } },
        },
      },
      {
        id: "a-fx-position-size",
        title: "The position-size formula",
        explain:
          "Once the money at risk and the stop distance are fixed, the lot size follows from one formula: LOTS = money at risk ÷ (stop distance in pips × pip value per lot). Round DOWN to the broker's 0.01 step, never up, so that rounding can only reduce risk.",
        why: "The stop-loss goes where the trade idea is proved wrong, a chart decision. The risk is a percentage of the account, a money decision. The lot size is the only thing left free, so it is the thing you calculate. A wide stop gives a small position; a tight stop a bigger one; the money at risk is the same.",
        example:
          "POSITION SIZE\n\n  balance           $1,000\n  risk 1%           $10.00\n  stop distance     25 pips (EUR/USD)\n  pip value / lot   $10\n\n  lots = 10 ÷ (25 × 10) = 0.04 lots\n  check: 25 pips × $10 × 0.04 = $10.00 at risk  ✓",
        calcExercise: {
          scenario:
            "Balance $1,000, risk 1%. You want to buy USD/JPY with a 40-pip stop-loss. At the current price one pip on one lot is worth $6.67.",
          question: "What lot size should you trade? Round down to 0.01.",
          unit: "lots",
          answer: 0.03,
          tolerance: 0.0001,
          hint: "Money at risk ÷ (stop pips × pip value per lot). Then round DOWN.",
          working:
            "Money at risk: $1,000 × 1% = $10\nLots: 10 ÷ (40 × 6.67) = 10 ÷ 266.80 = 0.0375\nRounded down: 0.03 lots (risking $8.00). Rounding up to 0.04 would risk $10.67, more than planned.",
          check: { fn: "positionSize", args: { balance: 1000, riskPercent: 1, stopPips: 40, pipValuePerLot: 6.67 } },
        },
      },
      {
        id: "a-fx-sized-ticket",
        title: "Sizing a real order",
        explain:
          "Now put the formula onto a ticket. Work the size on paper or in your calculator first, then type it in, and check the ticket's readout agrees with your calculation before sending.",
        ticketExercise: {
          task:
            "Balance $1,000, risk exactly 1%. Plan: BUY EUR/USD now at the market, stop-loss at 1.08264, take-profit at 1.09014. Work out the lot size yourself and place the order.",
          pair: "EUR/USD",
          bid: 1.08502,
          ask: 1.08514,
          balance: 1000,
          leverage: 30,
          riskPercent: 1,
          expect: { type: "market", side: "buy", lots: 0.04, sl: 1.08264, tp: 1.09014 },
          explain:
            "The buy fills at the ask, 1.08514. The stop is 25 pips below, so 1% ($10) ÷ (25 × $10) = 0.04 lots. The target is 50 pips away: a reward of $20 for a risk of $10.",
        },
      },
      {
        id: "a-fx-reward-risk",
        title: "Reward-to-risk and the break-even win rate",
        explain:
          "REWARD-TO-RISK compares the distance to the target with the distance to the stop. A 25-pip stop and a 50-pip target is 2:1, often written '2R': if it works you make twice what you risked. The higher the ratio, the fewer trades need to win for you to break even: BREAK-EVEN WIN RATE = 1 ÷ (1 + R).",
        why: "This turns 'I need to be right most of the time' into arithmetic. At 1:1 you must win more than 50% of trades just to break even before costs; at 2:1, more than a third; at 3:1, more than a quarter. But a higher ratio usually means the target is reached less often, so neither number means anything without the other.",
        calcExercise: {
          scenario: "Your strategy targets 2R on every trade: the target is twice as far away as the stop.",
          question: "What win rate do you need just to break even, before costs? Round to one decimal place.",
          unit: "%",
          answer: 33.3,
          tolerance: 0.05,
          hint: "Break-even win rate = 1 ÷ (1 + R), as a percentage.",
          working: "1 ÷ (1 + 2) = 0.333… = 33.3%\nWin one in three at 2R: +2R − 1R − 1R = 0.",
          check: { fn: "breakevenWinRate", args: { rr: 2 } },
        },
      },
      {
        id: "a-fx-drawdown",
        title: "Drawdown, and why losses are harder to recover than to make",
        explain:
          "DRAWDOWN is the fall from an account's highest value to a later low, usually as a percentage. Losses and gains are not symmetric: after losing 20% you need 25% to get back, after 50% you need 100%. The deeper the hole, the steeper the climb.",
        why: "This is why the first job of a trader is not making money but not losing much of it. A strategy that never draws down more than 10% can recover easily; one that loses 50% may never recover, because it would have to double what is left.",
        table: {
          caption:
            "Two tables side by side. Left: a loss and the gain needed to recover it. Right: what ten losses in a row do to $1,000 at different risk-per-trade levels.",
          headers: ["Loss", "Gain needed to recover", "Risk per trade", "After ten straight losses"],
          rows: [
            ["10%", "11.1%", "1%", "$904.38 of $1,000"],
            ["20%", "25.0%", "2%", "$817.07 of $1,000"],
            ["50%", "100.0%", "5%", "$598.74 of $1,000"],
            ["75%", "300.0%", "10%", "$348.68 of $1,000"],
          ],
        },
        calcExercise: {
          scenario: "Your demo account has fallen 20% from its peak.",
          question: "What percentage gain do you need to get back to the peak?",
          unit: "%",
          answer: 25,
          tolerance: 0.05,
          hint: "Recovery = loss ÷ (1 − loss), with the loss as a decimal.",
          working: "0.20 ÷ (1 − 0.20) = 0.20 ÷ 0.80 = 0.25 = 25%\nCheck: $1,000 → $800, and $800 × 1.25 = $1,000.",
          check: { fn: "recoveryNeeded", args: { lossPercent: 20 } },
        },
      },
      {
        id: "a-fx-transaction-costs",
        title: "Transaction costs as a share of your risk",
        explain:
          "Costs look tiny in dollars and are large compared with the risk. Add the spread, any commission and any swap, then compare the total with the money at risk. That ratio tells you how much of every trade's edge the costs consume.",
        calcExercise: {
          scenario:
            "You trade 0.04 lots of EUR/USD. Spread 1.2 pips ($10 a pip per lot), commission $7 per lot round trip, and you hold it one night for a swap charge of $0.35.",
          question: "What is the total cost of the trade, in dollars?",
          unit: "USD",
          answer: 1.11,
          tolerance: 0.005,
          hint: "Spread cost (pips × pip value × lots) + commission × lots + swap.",
          working:
            "Spread: 1.2 × $10 × 0.04 = $0.48\nCommission: $7 × 0.04 = $0.28\nSwap: $0.35\nTotal: $1.11 — about 11% of the $10 at risk. Every trade starts 0.11R behind.",
          check: { fn: "tradeCost", args: { spreadPips: 1.2, pipValuePerLot: 10, lots: 0.04, commissionPerLot: 7, swap: 0.35 } },
        },
      },
      {
        id: "a-fx-practical-exposure",
        title: "Practical: the pre-trade calculation",
        explain:
          "This week's practical is a routine you will use before every trade for the rest of the course: before entering, write down the position's notional size, the margin it needs, its stop distance and the money lost if the stop is hit. Only then may the trade be placed.",
        example:
          "PRE-TRADE CHECK (add these columns to your journal)\n\n  Pair / direction          GBP/USD buy\n  Lots                      0.03\n  Notional                  0.03 × 100,000 × 1.2640 = $3,792\n  Margin at 1:30            $3,792 ÷ 30 = $126.40\n  Stop distance             32 pips\n  Loss if stop is hit       32 × $10 × 0.03 = $9.60  (0.96% of $1,000)  ✓",
        calcExercise: {
          scenario: "You plan to buy 0.03 lots of GBP/USD with a 32-pip stop-loss. One pip on one lot is $10.",
          question: "How much do you lose if the stop is hit?",
          unit: "USD",
          answer: 9.6,
          tolerance: 0.005,
          hint: "Stop pips × pip value per lot × lots.",
          working: "32 × $10 × 0.03 = $9.60",
          check: { fn: "riskAmount", args: { stopPips: 32, pipValuePerLot: 10, lots: 0.03 } },
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "Build your calculator, then use it. From today, no demo trade is placed without the pre-trade calculation written in your journal first.",
      prompts: [
        "Build a position-size calculator in Google Sheets or Excel: inputs for balance, risk %, stop pips and pip value per lot; output lots rounded down to 0.01 and the money at risk.",
        "Add pip-value cells for the three cases: USD as quote, USD as base (divide by price) and a cross (multiply by the quote currency's USD rate).",
        "Check your calculator against ten examples worked by hand, including one yen pair and one cross. Fix any disagreement.",
        "Place three demo trades sized at 1% with your calculator. For each, record notional, margin, stop distance and loss if stopped BEFORE you enter. Compare your figures with MT5's.",
        "Write down your account's margin-call and stop-out levels from your broker's terms.",
      ],
      closing:
        "After the trades close, check: did each loss or gain match what your calculation said it would be at the stop or target? If not, find out why — slippage, spread or a sizing error.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
