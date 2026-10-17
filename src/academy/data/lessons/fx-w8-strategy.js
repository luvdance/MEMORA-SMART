/**
 * FOREX TRADING · WEEK 8 · BUILDING A TRADING STRATEGY
 *
 * Curriculum 8.1 – 8.P. A strategy is a set of rules another person could
 * follow and reach the same decision. This week turns the analysis of Weeks
 * 4–7 into objective entries and exits, stops and targets placed by
 * structure, filters, and a checklist that says when to do nothing.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The example strategy in Lesson 3 is a TEACHING EXAMPLE of how rules are
 * written. It is not a recommendation, and the course never claims it is
 * profitable: whether it has any edge is exactly what Week 9 tests.
 */

export const SECTION_ID = "fx-s8-strategy";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 8.1 — OBJECTIVE RULES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l23-objective-rules",
    moduleId: "fx-w8-strategy",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1"],
    title: "Defining Objective Entry and Exit Rules",
    subtitle: "If two people can disagree about a rule, it is not a rule yet",
    estimatedMinutes: 16,
    intro:
      "Most traders have a vague method: 'I buy when it looks like it is bouncing.' Vague methods cannot be tested, cannot be followed consistently and cannot be improved, because nobody knows exactly what was done. This lesson turns a method into rules.",

    atoms: [
      {
        id: "a-fx-why-rules",
        title: "Why a strategy must be written as rules",
        explain:
          "A TRADING STRATEGY is a complete, written set of rules saying which markets and timeframes you trade, exactly when you enter, where your stop and target go, how big the position is, and when you do not trade. A rule is OBJECTIVE when anyone applying it to the same chart reaches the same answer.",
        why: "Only objective rules can be backtested (Week 9), followed under pressure, and audited afterwards (Week 15). If a rule needs your judgement in the moment, then in the moment your judgement will be affected by fear and greed, which is the subject of Week 11.",
        table: {
          caption: "Subjective versus objective.",
          headers: ["Subjective (not a rule yet)", "Objective"],
          rows: [
            ["The trend is up", "The last two D1 swing highs and swing lows are each higher than the ones before"],
            ["Price is at support", "Price has traded inside a zone marked before the session, from a swing low respected at least twice"],
            ["A strong bullish candle", "An H1 bullish engulfing as defined in Week 4"],
            ["Take profit when it looks done", "Take profit at 2R, or before the next H4 resistance zone, whichever is nearer"],
          ],
        },
      },
      {
        id: "a-fx-entry-rules",
        title: "Writing entry rules",
        explain:
          "An entry rule has three parts: the CONTEXT that must be present (the trend, from Week 7), the LOCATION (a zone, from Week 5) and the TRIGGER (a specific candle or break, from Week 4). Write each as a yes-or-no question. All must be 'yes' before a trade is allowed.",
        decision: {
          scenario: "A learner writes an entry rule: 'Buy EUR/USD when RSI is low and price is near support.'",
          question: "What is the most important improvement?",
          options: [
            {
              id: "a",
              text: "Define 'low' and 'near' precisely, and add a trigger: for example 'RSI(14) below 40, price inside a pre-marked H4 demand zone, and an H1 bullish engulfing closes'",
              why: "Right. Every word that two people could interpret differently is replaced by something checkable, and the rule now says exactly what event causes the entry.",
            },
            {
              id: "b",
              text: "Add three more indicators so the signal is stronger",
              whyWrong: "More conditions do not fix vague ones. The rule would be longer and still impossible to apply consistently.",
            },
            {
              id: "c",
              text: "Nothing; experienced traders know what 'near' means",
              whyWrong: "Experienced traders disagree about it all the time, and you will disagree with yourself on a bad day.",
            },
            {
              id: "d",
              text: "Remove the rule and trade on instinct",
              whyWrong: "Instinct cannot be tested or audited, which leaves no way to learn whether it works.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-exit-rules",
        title: "Writing exit rules",
        explain:
          "Exit rules cover every way a trade can end: the stop-loss, the take-profit, and any rule-based early exit, such as 'close the trade if an H4 candle closes back below the zone' or 'close all trades by 21:00 Lagos on Friday'. If an exit is not in the rules, you do not take it.",
        mistake:
          "Writing careful entry rules and leaving exits 'to feel'. Exits decide the size of wins and losses, which matters as much to results as whether trades win at all.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 8.2 — STOPS, INVALIDATION AND TARGETS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l24-stops-targets",
    moduleId: "fx-w8-strategy",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.2"],
    title: "Stop-Loss Placement, Trade Invalidation and Profit Targets",
    subtitle: "Stops where the idea fails, targets where the market is likely to pause",
    estimatedMinutes: 20,
    intro:
      "Week 7 said the stop belongs beyond the invalidation level. This lesson makes that a rule you can apply to the pip: structure, plus a buffer for normal noise, plus the spread where it matters. Then it gives you the main ways to set targets.",

    atoms: [
      {
        id: "a-fx-stop-placement",
        title: "Structure plus a buffer",
        explain:
          "A common objective stop rule: place the stop beyond the invalidating swing point, plus a BUFFER for normal movement, such as half of the ATR. For a buy, that is below the last higher low minus the buffer; for a sell, above the last lower high plus the buffer. The buffer keeps the stop out of the noise that happens around every level.",
        why: "Stops placed exactly at an obvious swing point are hit surprisingly often by small spikes before price moves on. A buffer based on ATR scales automatically: wider in volatile markets, tighter in quiet ones.",
        calcExercise: {
          scenario:
            "You plan to buy EUR/USD at 1.0850. The last higher low is 1.0826. ATR(14) is 18 pips, so your rule's buffer is half of it: 9 pips. Then you size for 1% of $1,000 ($10 per pip per lot).",
          question: "What lot size does the rule give? Round down to 0.01.",
          unit: "lots",
          answer: 0.03,
          tolerance: 0.0001,
          hint: "Stop = higher low − 9 pips. Then stop distance from 1.0850, then the position-size formula.",
          working:
            "Stop: 1.0826 − 0.0009 = 1.0817\nStop distance: 1.0850 − 1.0817 = 0.0033 = 33 pips\nLots: $10 ÷ (33 × $10) = 0.0303 → 0.03 lots ($9.90 at risk)",
          check: { fn: "positionSize", args: { balance: 1000, riskPercent: 1, stopPips: 33, pipValuePerLot: 10 } },
        },
      },
      {
        id: "a-fx-spread-stops",
        title: "Stops on sells and the spread",
        explain:
          "Charts normally show the BID price. A buy's stop is triggered when the bid reaches it, so the chart is accurate. A SELL's stop is triggered when the ASK reaches it, and the ask is above the bid by the spread. So on a sell, add the spread to the stop's buffer, or a spike that never touches your level on the chart can still stop you out.",
        mistake:
          "Being stopped out of a sell 'without price reaching the stop' at 23:00 Lagos, when the spread widens at the daily rollover, and blaming the broker. Check the ask, not just the chart.",
      },
      {
        id: "a-fx-targets",
        title: "Profit targets",
        explain:
          "Targets are set in advance by rule. The main methods: a FIXED MULTIPLE of the risk (for example 2R); the next STRUCTURAL level in the way (the nearest opposing zone, with the target just before it); or a combination, 'at 2R or just before the next zone, whichever is nearer'. Some traders also take PARTIAL profits or TRAIL the stop behind new swings; each must be a written rule.",
        decision: {
          scenario:
            "Your rules say: target 2R, unless an H4 opposing zone is nearer, in which case target 5 pips before the zone. You are buying with a 30-pip stop. An H4 supply zone begins 45 pips above your entry.",
          question: "Where is the target?",
          options: [
            {
              id: "a",
              text: "60 pips above entry, at 2R",
              whyWrong: "The supply zone is nearer than 60 pips, so the rule switches to the zone-based target.",
            },
            {
              id: "b",
              text: "40 pips above entry, 5 pips before the zone",
              why: "Right. 2R would be 60 pips, but the zone at 45 pips is nearer, so the target is 45 − 5 = 40 pips: a 1.33R trade. Whether that still meets your minimum reward is a filter question for the next lesson.",
            },
            {
              id: "c",
              text: "Inside the zone, 50 pips above entry, to squeeze out more",
              whyWrong: "The rule says before the zone. Extending a target 'to squeeze out more' is changing the rule mid-trade.",
            },
            {
              id: "d",
              text: "No target; let it run",
              whyWrong: "The rules specify a target, so 'let it run' is not one of your options.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-invalidation-exits",
        title: "Exiting when the idea is invalid, before the stop",
        explain:
          "Sometimes the reason for a trade disappears before the stop is reached: the higher-timeframe structure breaks, or a candle closes back through the zone. A written early-exit rule, such as 'close if an H4 candle closes beyond the zone', lets you act on that objectively. Without a rule, early exits become emotional.",
        why: "A good early-exit rule reduces average losses. A bad habit of exiting early 'because it felt wrong' usually cuts winners short too. The difference is whether it is written.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 8.3 + 8.P — FILTERS, CHECKLISTS AND STAYING OUT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l25-filters-checklist",
    moduleId: "fx-w8-strategy",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.3", "8.P"],
    title: "Filters, Trading Checklists and Staying Out of the Market",
    subtitle: "The rules that say no",
    estimatedMinutes: 22,
    intro:
      "The most profitable decision many traders could make is to take fewer trades. Filters and checklists are the rules that say no: not now, not this pair, not in these conditions. This lesson adds them, and ends with a complete example strategy written the way yours should be.",

    atoms: [
      {
        id: "a-fx-filters",
        title: "Filters",
        explain:
          "A FILTER is a condition that blocks a trade even when the entry trigger appears. Common filters: SESSION (only trade between set hours), NEWS (no entries within 30 minutes of high-impact releases), SPREAD (no entry if the spread is above a set maximum), MINIMUM REWARD (no trade if the target is less than, say, 1.5R), and TREND (only trade in the higher-timeframe direction).",
        table: {
          caption: "Example filters and what they protect against.",
          headers: ["Filter", "Example rule", "Protects against"],
          rows: [
            ["Session", "Entries only 09:00–18:00 Lagos", "Thin markets and wide spreads"],
            ["News", "No entries 30 min either side of high-impact news", "Spikes, slippage, wide spreads"],
            ["Spread", "No entry if spread > 1.5 pips on EUR/USD", "Paying abnormal costs"],
            ["Minimum reward", "Target must be at least 1.5R", "Trades that cannot pay for losers"],
            ["Trend", "Only trade in the direction of D1 structure", "Fighting the bigger trend"],
            ["Daily loss limit", "Stop trading for the day after 2 losses", "Revenge trading (Week 11)"],
          ],
        },
      },
      {
        id: "a-fx-checklist",
        title: "The pre-trade checklist",
        explain:
          "A CHECKLIST lists every rule as a yes-or-no question, in order. You go through it before every trade, on paper, in your journal or on your phone. If any answer is 'no', there is no trade. Pilots and surgeons use checklists for the same reason traders should: under pressure, people skip steps they know perfectly well.",
        example:
          "PRE-TRADE CHECKLIST — example\n\n  [ ] D1 structure supports this direction?\n  [ ] Price inside a zone marked BEFORE the session?\n  [ ] H1 trigger candle CLOSED (engulfing or pin bar, by definition)?\n  [ ] Inside my session window? No high-impact news within 30 min?\n  [ ] Spread at or below my maximum?\n  [ ] Stop beyond structure + buffer; target ≥ 1.5R?\n  [ ] Lot size from calculator; risk = 1%?\n  [ ] Total open risk still within my limit?\n  All YES → place the order.  Any NO → no trade, and write down which.",
      },
      {
        id: "a-fx-staying-out",
        title: "When to stay out",
        explain:
          "Some conditions mean no trading at all, regardless of setups: when you are ill, exhausted, angry or under financial pressure; when you have hit your daily or weekly loss limit; around major scheduled events you have decided to avoid; on public holidays and at year-end when markets are thin; and whenever you notice yourself wanting a trade rather than seeing one.",
        decision: {
          scenario:
            "It is Friday evening. You have lost two demo trades today, which is your daily limit, and you are frustrated. A perfect-looking setup appears on GBP/USD that passes every other item on your checklist.",
          question: "What do your rules say?",
          options: [
            {
              id: "a",
              text: "Take it; it passes the checklist",
              whyWrong: "It does not: the daily-loss-limit item is a 'no'. A checklist with an item you can override when you like is not a checklist.",
            },
            {
              id: "b",
              text: "No trade. Record the setup in your journal as a missed trade that the rules correctly blocked",
              why: "Right. The daily limit exists exactly for this moment. Recording the setup lets you check later, calmly, how often the limit costs you a good trade and how often it saves you a bad one.",
            },
            {
              id: "c",
              text: "Take it with half size",
              whyWrong: "A smaller rule break is still a rule break. And frustration is precisely the state the limit is meant to keep out of the market.",
            },
            {
              id: "d",
              text: "Take it, then raise the daily limit next week",
              whyWrong: "Rules may be changed, but only after review, not in the moment to justify a trade.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-example-strategy",
        title: "A complete strategy, written as rules",
        explain:
          "Here is a complete example of the format your strategy must take. It is a TEACHING EXAMPLE, not a recommendation, and nothing about it is claimed to be profitable. Whether it has any edge at all is the question you will learn to answer in Week 9.",
        example:
          "STRATEGY: H4 TREND PULLBACK (teaching example)\n\n  Markets     EUR/USD, GBP/USD. Account risk 1% per trade.\n  Context     D1: last two swing highs AND lows rising (long) or falling (short).\n  Location    Price trades into an H4 zone marked before the session, formed\n              where the latest D1-direction swing began.\n  Trigger     H1 bullish (long) or bearish (short) engulfing or pin bar, by the\n              Week 4 definitions, closing inside or at the edge of the zone.\n  Entry       Pending stop order 1 pip beyond the trigger candle's high (long)\n              or low (short). Cancel if not filled within 4 H1 candles.\n  Stop        Beyond the zone's far edge + 0.5 × ATR(14) on H1 (+ spread on sells).\n  Target      2R, or 5 pips before the next opposing H4 zone if nearer.\n  Filters     Target ≥ 1.5R · entries 09:00–18:00 Lagos · no high-impact news\n              within 30 min · spread ≤ 1.5 pips · max 2 open trades.\n  Exit early  Close if an H4 candle closes beyond the zone's far edge.\n  Stop day    After 2 losses in a day. Stop week after −4% from Monday's balance.\n  Review      Journal every trade. Weekly rule-compliance check.",
        decision: {
          scenario:
            "Another learner applies this strategy to the same GBP/USD chart as you. You both agree on the context and the zone, but you think a candle is a pin bar and they do not.",
          question: "What is the right way to settle it?",
          options: [
            {
              id: "a",
              text: "Check the candle against the written pin-bar definition: wick at least 60% of the range, body at most 30%, other wick at most 15%",
              why: "Right. That is why the strategy points to precise definitions: the disagreement is resolved by measurement, not by who is more confident.",
            },
            {
              id: "b",
              text: "The more experienced trader decides",
              whyWrong: "Experience does not make a judgement testable. If the rule depends on who is looking, it cannot be backtested.",
            },
            {
              id: "c",
              text: "Take the trade if either of you sees the pattern",
              whyWrong: "That makes the rule looser in an undefined way and will change your results unpredictably.",
            },
            {
              id: "d",
              text: "Remove pin bars from the strategy",
              whyWrong: "The definition already exists. The fix is to apply it, not to delete the rule.",
            },
          ],
          correct: "a",
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "Write your own strategy in the format above. You may adapt the example, but every line must be your decision, and every rule must be objective.",
      prompts: [
        "Write your strategy: markets, risk per trade, context, location, trigger, entry, stop, target, filters, early-exit rule, daily and weekly stop rules, and review routine.",
        "Turn it into a pre-trade checklist of yes-or-no questions.",
        "Give your strategy and one historical chart to another learner. Each of you independently marks where the strategy would have traded. Compare.",
        "For every place you disagreed, rewrite the rule that caused the disagreement until it cannot be read two ways.",
        "Trade the strategy on your demo account for the rest of the week, only when every checklist item is 'yes'. Record no-trade decisions too.",
      ],
      closing:
        "A strategy that two people apply identically is now testable. Next week you will find out what it would actually have done.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
