/**
 * FOREX TRADING · WEEK 12 · RISK GOVERNANCE AND READINESS
 *
 * Curriculum 12.1 – 12.P. Risk across the whole account rather than one
 * trade: correlated exposure, drawdown limits and risk of ruin. Then the
 * outside risks — unregulated brokers and fraud — and when not to trade.
 * The practical is the complete written trading plan, and the lesson check
 * for Lesson 37 is the Phase 4 theory and risk-management assessment.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Regulators are named so a learner can check a broker themselves. No broker
 * is named or recommended anywhere in this course, deliberately.
 */

export const SECTION_ID = "fx-s12-governance";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 12.1 — CORRELATED EXPOSURE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l35-correlation",
    moduleId: "fx-w12-governance",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1"],
    title: "Exposure Across Correlated Currency Pairs",
    subtitle: "Three trades can be one bet",
    estimatedMinutes: 16,
    intro:
      "Risking 1% on each of three trades sounds like three separate 1% risks. If all three are really the same bet on one currency, it is a single 3% risk wearing three names. This lesson shows you how to see that before it hurts.",

    atoms: [
      {
        id: "a-fx-correlation",
        title: "Correlation between pairs",
        explain:
          "Two pairs are POSITIVELY CORRELATED when they tend to move in the same direction, and NEGATIVELY CORRELATED when they tend to move in opposite directions. EUR/USD and GBP/USD often move together, because both are priced against the dollar and the euro and pound are linked economies. EUR/USD and USD/CHF often move in opposite directions, because the dollar is the base in one and the quote in the other. Correlations change over time, so check them rather than assume them.",
        table: {
          caption: "Typical relationships. Tendencies, not rules; TradingView's correlation coefficient indicator can measure them.",
          headers: ["Pairs", "Typical relationship", "Why"],
          rows: [
            ["EUR/USD and GBP/USD", "Positive", "Both quoted against USD; linked European economies"],
            ["AUD/USD and NZD/USD", "Strongly positive", "Similar, commodity-linked economies"],
            ["EUR/USD and USD/CHF", "Negative", "USD on opposite sides of the pair"],
            ["USD/JPY and EUR/USD", "Often negative", "USD on opposite sides"],
          ],
        },
      },
      {
        id: "a-fx-currency-exposure",
        title: "Think in currencies, not pairs",
        explain:
          "To see your real exposure, break every open trade into the two currencies it buys and sells. Long EUR/USD is long euro, short dollar. Long GBP/USD is long pound, short dollar. Short USD/CHF is short dollar, long franc. Those three trades are all SHORT THE DOLLAR: if the dollar strengthens, all three lose together.",
        calcExercise: {
          scenario:
            "Your $1,000 account has three open trades, each risking 1%: long EUR/USD, long GBP/USD and short USD/CHF. A strong US jobs report lifts the dollar against everything, and all three hit their stops.",
          question: "How much do you lose in total?",
          unit: "USD",
          answer: 30,
          tolerance: 0.005,
          hint: "All three are the same bet against the dollar, so all three stops are hit together.",
          working: "Each trade risks 1% = $10. Three trades on the same idea = 3% of $1,000 = $30, from one piece of news.",
          check: { fn: "riskMoney", args: { balance: 1000, riskPercent: 3 } },
        },
      },
      {
        id: "a-fx-exposure-limits",
        title: "Limits on combined exposure",
        explain:
          "Add exposure rules to your plan: a maximum TOTAL open risk across all trades (for example 3%), and a maximum risk on any single currency (for example 2%). If a new trade would breach either, skip it or replace a weaker open position. Some traders split the normal 1% between two highly correlated trades instead of taking 1% on each.",
        decision: {
          scenario:
            "Your rules: 1% per trade, maximum 2% exposure to any one currency. You are long EUR/USD (1%). A valid setup appears to buy GBP/USD and another to sell USD/JPY.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Take both: they are different pairs",
              whyWrong: "All three trades are short the dollar. That would be 3% exposure to one currency against a 2% limit.",
            },
            {
              id: "b",
              text: "Take one of the two, so total dollar exposure is 2%, and record the other as skipped by the exposure rule",
              why: "Right. The rule allows one more dollar-short trade. Which to take can itself be a written rule, such as 'the one with the better reward'.",
            },
            {
              id: "c",
              text: "Take both at 1% each and widen the stops",
              whyWrong: "Wider stops at the same size increase risk further. The exposure limit is still broken.",
            },
            {
              id: "d",
              text: "Close the EUR/USD trade to make room for both",
              whyWrong: "That still leaves 2% short the dollar — but closing a valid open trade to chase new ones is not a written rule. It is restless trading.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 12.2 — CAPITAL PRESERVATION AND RISK OF RUIN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l36-capital-preservation",
    moduleId: "fx-w12-governance",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.2"],
    title: "Capital Preservation, Drawdown Limits and Risk of Ruin",
    subtitle: "Staying in the game long enough to learn anything",
    estimatedMinutes: 18,
    intro:
      "A trader with no capital cannot use their skill. Capital preservation means arranging your risk so that no realistic sequence of losses can take you out of the game. This lesson sets the limits that do that, and explains the idea professionals call risk of ruin.",

    atoms: [
      {
        id: "a-fx-capital-preservation",
        title: "Capital preservation first",
        explain:
          "CAPITAL PRESERVATION is the principle that protecting the account comes before growing it. In practice: small fixed risk per trade, limits on total exposure, circuit breakers, and stepping back to the demo when results or behaviour deteriorate. Every rule in Phases 1 to 4 serves it.",
        why: "Week 3 showed that a 50% loss needs a 100% gain to recover. Avoiding deep drawdowns is mathematically easier than recovering from them.",
      },
      {
        id: "a-fx-drawdown-limits",
        title: "Account-level drawdown limits",
        explain:
          "Beyond daily and weekly limits, set a MAXIMUM DRAWDOWN for the account as a whole, measured from its peak. For example: at −10%, stop trading, halve the risk per trade and run a full review; at −15%, return to the demo or to backtesting until the cause is found and fixed. Write the levels and the actions down now, while calm.",
        table: {
          caption: "An example ladder of limits.",
          headers: ["Limit", "Example level", "Action"],
          rows: [
            ["Daily", "2 losses or −2%", "Stop for the day"],
            ["Weekly", "−4% from Monday's balance", "Stop for the week; review"],
            ["Account drawdown", "−10% from peak", "Pause; halve risk per trade; full review"],
            ["Account drawdown", "−15% from peak", "Back to demo/backtesting until fixed"],
          ],
        },
      },
      {
        id: "a-fx-risk-of-ruin",
        title: "Risk of ruin",
        explain:
          "RISK OF RUIN is the probability that a trader loses so much of their account that they cannot continue. It rises sharply with risk per trade: the same strategy, with the same win rate, can have a negligible risk of ruin at 1% per trade and a substantial one at 5% or 10%, simply because long losing streaks are certain to happen eventually.",
        calcExercise: {
          scenario: "A trader risks 5% of the current balance per trade on a $1,000 account and has ten losses in a row, a streak that will eventually happen to most strategies.",
          question: "What is left of the account? Round to the cent.",
          unit: "USD",
          answer: 598.74,
          tolerance: 0.01,
          hint: "Each loss leaves 95% of the balance. Multiply by 0.95 ten times.",
          working:
            "$1,000 × 0.95¹⁰ = $598.74: a 40% drawdown, needing a 67% gain to recover.\nAt 1% per trade the same streak leaves $904.38.",
          check: { fn: "balanceAfterLosses", args: { balance: 1000, riskPercent: 5, losses: 10 } },
        },
      },
      {
        id: "a-fx-readiness",
        title: "What readiness does and does not mean",
        explain:
          "By the end of Phase 4 you can calculate risk, follow a written plan and review yourself honestly. That is necessary for trading real money and nowhere near sufficient. This course does not certify anyone as ready to trade live, and makes no promise of profitability. If you ever do consider it, the minimum responsible standard is: a long demo record that matches your backtest, consistent rule adherence through a real losing streak, money you can afford to lose entirely, and the smallest possible size.",
        decision: {
          scenario:
            "A classmate made 18% on the demo account in three weeks. They want to withdraw their savings and open a live account with high leverage next week.",
          question: "What is the soundest advice?",
          options: [
            {
              id: "a",
              text: "Go ahead: 18% in three weeks proves the strategy",
              whyWrong: "Three weeks is a tiny sample, and 18% so quickly usually means risk far above 1% per trade.",
            },
            {
              id: "b",
              text: "Three weeks proves nothing either way; look at the risk taken, rule adherence and sample size, and never trade savings you cannot afford to lose",
              why: "Right. The process evidence is what matters, and savings needed for living are never trading capital.",
            },
            {
              id: "c",
              text: "Use the savings but lower the leverage",
              whyWrong: "The problem starts with using savings at all, and with judging readiness from three weeks.",
            },
            {
              id: "d",
              text: "Hand the savings to an account manager instead",
              whyWrong: "That is the most common route into forex fraud, as the next lesson explains.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 12.3 + 12.P — BROKERS, FRAUD, WHEN NOT TO TRADE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l37-due-diligence",
    moduleId: "fx-w12-governance",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.3", "12.P"],
    title: "Broker Due Diligence, Fraud Prevention, and When Not to Trade",
    subtitle: "The risks that have nothing to do with charts",
    estimatedMinutes: 22,
    intro:
      "Many people lose money in forex without ever placing a bad trade: their broker was unregulated, their 'account manager' disappeared, or their 'investment' was a Ponzi scheme. This lesson teaches the checks that protect you, then brings Phase 4 together in your trading plan. This lesson's check is the Phase 4 theory and risk-management assessment.",

    atoms: [
      {
        id: "a-fx-regulation",
        title: "Checking a broker's regulation",
        explain:
          "A regulated broker is licensed and supervised by a financial authority, which typically requires client money to be held separately from the firm's own money and sets rules on leverage, pricing and complaints. Do not accept a logo on a website as proof. Search the regulator's own public register for the firm's name and licence number, and check that the website address listed there matches the one you are using.",
        table: {
          caption: "Some well-known regulators and their public registers.",
          headers: ["Regulator", "Country / region", "Where to check"],
          rows: [
            ["Financial Conduct Authority (FCA)", "United Kingdom", "The FCA Financial Services Register"],
            ["CFTC and National Futures Association (NFA)", "United States", "NFA BASIC search"],
            ["Australian Securities and Investments Commission (ASIC)", "Australia", "ASIC's professional registers"],
            ["Cyprus Securities and Exchange Commission (CySEC)", "Cyprus / EU", "CySEC's register of regulated entities"],
            ["Securities and Exchange Commission (SEC Nigeria)", "Nigeria", "SEC Nigeria's register and public warnings"],
          ],
        },
        mistake:
          "Trusting a 'clone firm': a scam website that copies the name and licence number of a real regulated broker. The register lists the genuine firm's web address, phone and email. If they do not match, it is not that firm.",
      },
      {
        id: "a-fx-fraud",
        title: "Recognising forex fraud",
        explain:
          "Forex fraud follows recognisable patterns. ACCOUNT MANAGEMENT schemes ask you to send money to a 'trader' who promises a fixed monthly return. SIGNAL and MENTORSHIP sellers post screenshots of profits that cannot be verified. FAKE PLATFORMS show rising balances that cannot be withdrawn without paying a 'tax' or 'fee'. PONZI schemes pay early investors from later investors' money until they collapse, as MMM did in Nigeria at the end of 2016.",
        table: {
          caption: "Red flags. Any one of them is a reason to walk away.",
          headers: ["Red flag", "Why it is a red flag"],
          rows: [
            ["Guaranteed or fixed returns ('20% a month')", "No real trading produces guaranteed returns"],
            ["Send money to a personal account or crypto wallet", "Regulated brokers take deposits in the firm's name"],
            ["Pressure: 'only three slots left', 'offer ends tonight'", "Urgency stops you checking"],
            ["Pay a fee or tax before you can withdraw", "A classic fake-platform tactic"],
            ["Recruited through WhatsApp, Telegram or a dating contact", "The most common channels for these scams"],
            ["Profits shown only as screenshots", "Screenshots are trivially faked; demand verified statements"],
          ],
        },
        decision: {
          scenario:
            "A well-dressed 'forex expert' on Instagram offers to manage your money for a guaranteed 15% monthly return. You send ₦200,000 to a personal bank account and receive a login to a dashboard showing 15% growth after a month. When you try to withdraw, you are told to pay a 10% 'withdrawal tax' first.",
          question: "What is happening, and what do you do?",
          options: [
            {
              id: "a",
              text: "Pay the tax: the dashboard proves the profits are real",
              whyWrong: "The dashboard is whatever the scammer types into it. Paying the 'tax' only adds to your loss.",
            },
            {
              id: "b",
              text: "This is fraud: stop sending money, keep every record, report it to your bank, the police and the SEC, and warn others",
              why: "Right. Guaranteed returns, a personal account and a fee to withdraw are three red flags at once. Any further payment is lost too.",
            },
            {
              id: "c",
              text: "Ask them to deduct the tax from your profits instead",
              whyWrong: "There are no profits to deduct from. That request will be refused, because the money is gone.",
            },
            {
              id: "d",
              text: "Wait another month for the returns to grow",
              whyWrong: "Waiting gives the scheme time to recruit more victims and you time to send more money.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-when-not-to-trade",
        title: "When not to trade at all",
        explain:
          "Do not trade, live or demo, when: your strategy has no tested edge; you are using money needed for rent, school fees, food or debts; you have borrowed to trade; you are ill, exhausted, angry or desperate; a loss limit has been hit; high-impact news is imminent for your pair; or you cannot explain, in one sentence, why you are entering. Not trading is a position, and often the best one.",
      },
      {
        id: "a-fx-trading-plan",
        title: "Practical: the complete trading plan",
        explain:
          "Your trading plan is the single document that governs everything you do in the market. It brings together the work of Weeks 1 to 12, and it is assessed in Phase 5. Write it so that someone else could read it and know exactly what you would do in any situation.",
        example:
          "TRADING PLAN — required sections\n\n  1. Purpose and honest expectations (demo only during this course)\n  2. Account: balance, leverage, platform, broker regulation checked (Y/N, register link)\n  3. Markets, timeframes, trading style and session hours (Lagos time)\n  4. Strategy rules: context, location, trigger, entry, stop, target, early exit\n  5. Filters and the pre-trade checklist\n  6. Risk: % per trade, max open risk, max per currency, position-size method\n  7. Circuit breakers: daily, weekly, account drawdown ladder\n  8. News policy and the economic-calendar routine\n  9. Journal fields and process grading\n 10. Review routine: daily, weekly, monthly; how rules may be changed\n 11. When not to trade",
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "Submit your complete written trading plan, then take this lesson's check: it is the Phase 4 theory and risk-management assessment, with the same 70% pass mark.",
      prompts: [
        "Look up the broker behind your demo account on the public register of the regulator it claims. Record the licence number and confirm the website matches.",
        "Write your complete trading plan with all eleven sections.",
        "Add exposure limits: maximum total open risk and maximum risk per currency. List your demo pairs' currencies to see where they overlap.",
        "Write your account drawdown ladder with levels and actions.",
        "Ask another learner to read your plan and tell you one situation it does not cover. Add a rule for it.",
      ],
      closing:
        "Phase 4 is complete when your plan is submitted and this lesson's check is passed. Then take your consolidation week on the demo account, trading strictly to the plan.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
