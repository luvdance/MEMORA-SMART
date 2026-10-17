/**
 * FOREX TRADING · WEEK 6 · FUNDAMENTAL ANALYSIS
 *
 * Curriculum 6.1 – 6.P. What moves currencies over weeks and months:
 * interest rates, inflation, growth, jobs and the central banks that respond
 * to them. Then the economic calendar, and the idea most beginners miss —
 * markets react to SURPRISES against expectations, not to the news itself.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Release times are stated in their home time zone with the Lagos
 * equivalent, and the lesson says that daylight saving moves them by an hour.
 */

export const SECTION_ID = "fx-s6-fundamental";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 6.1 — THE ECONOMIC DRIVERS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l17-economic-drivers",
    moduleId: "fx-w6-fundamental",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1"],
    title: "Interest Rates, Inflation, Growth, Jobs and Central Banks",
    subtitle: "What a currency's value rests on",
    estimatedMinutes: 20,
    intro:
      "Charts show what price did. Fundamentals explain why large amounts of money move from one currency to another over weeks and months. At the centre of it all is one price: the interest rate a central bank sets, and what markets think it will set next.",

    atoms: [
      {
        id: "a-fx-interest-rates",
        title: "Interest rates: the strongest driver",
        explain:
          "A central bank's POLICY RATE sets the base cost of borrowing and the return on holding cash in that currency. When a country's interest rates rise, or are expected to rise, relative to other countries, holding its currency becomes more attractive, and global investors tend to buy it. The gap between two countries' rates is called the INTEREST RATE DIFFERENTIAL.",
        why: "Most large, persistent trends in major pairs are driven by changes in expected rate differentials. When markets came to expect the US to keep rates higher for longer than Japan, USD/JPY rose for long periods.",
        mistake:
          "Looking only at today's rate. Markets move on where rates are EXPECTED to go. A bank that holds rates high but signals cuts can see its currency weaken.",
      },
      {
        id: "a-fx-inflation",
        title: "Inflation",
        explain:
          "INFLATION is the rate at which prices in an economy rise, usually measured by the CONSUMER PRICE INDEX (CPI). The US Federal Reserve, the European Central Bank and the Bank of England all aim for inflation of about 2% a year. When inflation runs above target, central banks tend to raise rates or keep them high; when it falls below, they tend to cut.",
        why: "So inflation data matters to forex mainly through what it implies for interest rates. A higher-than-expected CPI figure tends to support a currency, because it raises the chance of higher rates.",
      },
      {
        id: "a-fx-growth-jobs",
        title: "Growth and employment",
        explain:
          "GROSS DOMESTIC PRODUCT (GDP) measures the total output of an economy; its growth rate shows whether the economy is expanding. EMPLOYMENT data shows the health of the labour market. The most watched release in forex is the US NONFARM PAYROLLS report (NFP): the number of jobs added in the US in the previous month, together with the unemployment rate and wage growth.",
        why: "Strong growth and a tight labour market give a central bank room to keep rates high; weakness pushes it to cut. Each data point moves the currency to the extent it changes those expectations.",
        table: {
          caption: "The main economic indicators and what a strong reading usually suggests.",
          headers: ["Indicator", "Measures", "A stronger-than-expected reading usually…"],
          rows: [
            ["CPI", "Consumer price inflation", "Supports the currency (higher rates more likely)"],
            ["GDP", "Economic output growth", "Supports the currency"],
            ["NFP / employment", "Jobs added, unemployment, wages", "Supports the currency"],
            ["PMI", "Business surveys; above 50 = expansion", "Supports the currency"],
            ["Retail sales", "Consumer spending", "Supports the currency"],
          ],
        },
      },
      {
        id: "a-fx-central-banks",
        title: "The central banks",
        explain:
          "Each major currency has a central bank whose decisions and statements move it. Each meets on a published schedule to set rates. In the US the Federal Reserve's Federal Open Market Committee (FOMC) holds eight scheduled meetings a year. For the naira, the Central Bank of Nigeria's Monetary Policy Committee plays the same role.",
        table: {
          caption: "The central banks behind the majors.",
          headers: ["Currency", "Central bank", "Decision made by"],
          rows: [
            ["USD", "Federal Reserve (Fed)", "FOMC"],
            ["EUR", "European Central Bank (ECB)", "Governing Council"],
            ["GBP", "Bank of England (BoE)", "Monetary Policy Committee"],
            ["JPY", "Bank of Japan (BoJ)", "Policy Board"],
            ["CHF", "Swiss National Bank (SNB)", "Governing Board"],
            ["AUD / NZD / CAD", "RBA / RBNZ / Bank of Canada", "Their policy boards and committees"],
            ["NGN", "Central Bank of Nigeria (CBN)", "Monetary Policy Committee"],
          ],
        },
        decision: {
          scenario:
            "Inflation in the UK has come in above the Bank of England's target for several months, while eurozone inflation has fallen close to the ECB's 2% target. Markets now expect the BoE to keep rates higher than the ECB for longer.",
          question: "Other things equal, what would you expect for EUR/GBP?",
          options: [
            {
              id: "a",
              text: "EUR/GBP to tend lower: the pound supported by higher expected UK rates",
              why: "Right. Higher expected rates attract money to the pound. EUR/GBP falls when the pound strengthens against the euro.",
            },
            {
              id: "b",
              text: "EUR/GBP to tend higher, because UK inflation is bad",
              whyWrong: "High inflation is bad for an economy, but for the currency what matters is the rate response it implies, which here supports the pound.",
            },
            {
              id: "c",
              text: "No effect; inflation does not affect currencies",
              whyWrong: "Inflation affects currencies mainly through expected interest rates, which are the strongest driver of all.",
            },
            {
              id: "d",
              text: "EUR/GBP to rise because the euro is a bigger currency",
              whyWrong: "The size of a currency area says nothing about the direction of the pair.",
            },
          ],
          correct: "a",
          aftermath: "'Other things equal' matters: growth, risk sentiment and surprises can all override a single driver in the short term.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 6.2 — THE ECONOMIC CALENDAR
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l18-economic-calendar",
    moduleId: "fx-w6-fundamental",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.2"],
    title: "Economic Calendars and High-Impact Announcements",
    subtitle: "Knowing what is scheduled before you trade",
    estimatedMinutes: 16,
    intro:
      "Most of the market's biggest moves on a given day happen at scheduled times, announced weeks in advance. A trader who does not check the calendar is walking into those moments blind. Checking it takes two minutes and becomes part of your daily routine from today.",

    atoms: [
      {
        id: "a-fx-calendar",
        title: "Reading an economic calendar",
        explain:
          "An ECONOMIC CALENDAR lists upcoming data releases and central bank events with their time, the currency affected, an impact rating, and three numbers: PREVIOUS (last time's figure), FORECAST (what economists expect, also called consensus) and ACTUAL (filled in when released). Free calendars include Forex Factory and Investing.com; MT5 also has a Calendar tab in its Toolbox.",
        why: "The forecast column is the market's expectation. Comparing the actual figure with it is how you understand a reaction, which is the subject of the next lesson.",
        table: {
          caption: "Set your calendar up once.",
          headers: ["Setting", "Do this"],
          rows: [
            ["Time zone", "Set to Lagos (GMT+1) or your own; check after each daylight-saving change"],
            ["Filter by impact", "Show high (and, later, medium) impact only"],
            ["Filter by currency", "USD, EUR, GBP, JPY: the currencies of the pairs you trade"],
            ["Check when", "Weekly on Sunday, and every day before the session"],
          ],
        },
      },
      {
        id: "a-fx-high-impact",
        title: "The high-impact events",
        explain:
          "A short list of events reliably moves the majors: central bank rate decisions and the press conferences after them, inflation (CPI), employment (US NFP), GDP, and business surveys (PMIs). US NFP is usually published on the first Friday of the month at 8:30 a.m. New York time, which is 14:30 in Lagos during the northern winter and 13:30 during US daylight saving time.",
        table: {
          caption: "Events that typically produce the largest moves.",
          headers: ["Event", "Frequency", "Why it matters"],
          rows: [
            ["Rate decisions and statements", "About 8 times a year per major bank", "Directly change the policy rate and expectations"],
            ["Central bank press conferences", "With most decisions", "Signals about future rates"],
            ["CPI", "Monthly", "Shapes the rate outlook"],
            ["US Nonfarm Payrolls", "Monthly, usually the first Friday", "The broadest read of the US economy"],
            ["GDP", "Quarterly (with revisions)", "Overall growth"],
            ["PMIs", "Monthly", "Early signal of business conditions"],
          ],
        },
      },
      {
        id: "a-fx-news-risk",
        title: "Trading around news",
        explain:
          "Around a high-impact release, liquidity providers pull back: SPREADS can widen to many times their normal size, and orders can SLIP several pips. Price can spike in both directions within seconds. Stops can fill well beyond their level. For a learner the rule is simple: do not open new trades in the minutes before and after a high-impact release that affects your pair, and know which of your open trades will be exposed.",
        decision: {
          scenario:
            "It is the first Friday of the month, 14:20 in Lagos, in December. You see what looks like a good EUR/USD setup. US NFP is due at 14:30.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Take it now, before the news moves price away",
              whyWrong: "In ten minutes the most volatile US release of the month arrives. Your stop and the spread could both behave very differently from normal.",
            },
            {
              id: "b",
              text: "Wait until well after the release, then reassess the setup from scratch",
              why: "Right. The setup was analysed on pre-news conditions. After NFP, structure and levels may have changed completely, and spreads need time to return to normal.",
            },
            {
              id: "c",
              text: "Take it with double size to profit from the volatility",
              whyWrong: "Volatility increases both the chance of a large loss and the cost of getting out. Size never goes up for excitement.",
            },
            {
              id: "d",
              text: "Take it without a stop-loss so the spike cannot stop you out",
              whyWrong: "A spike is exactly when an unprotected position can lose far more than planned.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 6.3 + 6.P — EXPECTATIONS, POLICY AND GEOPOLITICS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l19-expectations",
    moduleId: "fx-w6-fundamental",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.3", "6.P"],
    title: "Market Expectations, Monetary Policy and Geopolitical Events",
    subtitle: "Why markets react to surprises, not to news",
    estimatedMinutes: 22,
    intro:
      "A beginner reads 'US jobs report strong' and buys dollars, then watches the dollar fall. Nothing was wrong with the news. The market had expected it, or something even stronger, or it was looking at a different part of the report. This lesson explains how to think about a release before and after it.",

    atoms: [
      {
        id: "a-fx-expectations",
        title: "Priced in: the surprise is what moves price",
        explain:
          "Before any scheduled release, prices already reflect what the market expects. The forecast is, roughly, PRICED IN. What moves the market is the SURPRISE: the difference between the actual figure and the expectation. A figure that is good but less good than expected can weaken a currency.",
        example:
          "US CPI, year on year\n\n  Previous: 3.1%    Forecast: 3.4%    Actual: 3.2%\n\n  Inflation ROSE from 3.1% to 3.2%, but by less than expected.\n  Surprise = 3.2 − 3.4 = −0.2 percentage points: a DOWNSIDE surprise.\n  Typical first reaction: lower expected Fed rates → the dollar weakens,\n  even though inflation went up.",
      },
      {
        id: "a-fx-reaction-differs",
        title: "Why the reaction can differ from expectations",
        explain:
          "Even a clear surprise does not always produce the 'obvious' move. Releases have several parts, such as jobs added, the unemployment rate, wage growth and REVISIONS to previous months, and the market may focus on a different part from you. Positioning matters too: if many traders were already heavily long, good news can trigger profit-taking ('buy the rumour, sell the fact'). And the first spike often reverses as the details are read.",
        decision: {
          scenario:
            "US NFP comes in at 250,000 jobs against a forecast of 180,000. The dollar spikes up for two minutes, then falls well below where it started. On the same report, last month's figure was revised down by 90,000 and wage growth was weaker than expected.",
          question: "What is the most likely explanation?",
          options: [
            {
              id: "a",
              text: "The market is broken or manipulated",
              whyWrong: "This is a very common pattern after a mixed report. It needs no conspiracy to explain.",
            },
            {
              id: "b",
              text: "The headline beat was outweighed by the downward revision and weak wages once traders read the whole report",
              why: "Right. The first spike reacted to the headline number. As the details were absorbed, the overall picture looked weaker, and expectations for US rates fell.",
            },
            {
              id: "c",
              text: "250,000 is bad news for the dollar",
              whyWrong: "On its own, a headline beat is usually good for the dollar. The rest of the report changed the conclusion.",
            },
            {
              id: "d",
              text: "Fundamentals do not affect currencies",
              whyWrong: "They clearly did here, through the full content of the report.",
            },
          ],
          correct: "b",
          aftermath:
            "Lesson for your own trading: the first seconds after a release tell you very little. Professionals wait for the dust to settle.",
        },
      },
      {
        id: "a-fx-monetary-policy",
        title: "Hawkish and dovish: reading a central bank",
        explain:
          "A central bank is HAWKISH when its tone favours higher rates to fight inflation, and DOVISH when it favours lower rates to support growth. Because markets look ahead, the statement, the projections and the press conference often matter more than the decision itself: an expected rate hike delivered with dovish guidance can weaken a currency.",
        table: {
          caption: "Typical first reactions, all else equal.",
          headers: ["Central bank", "Market expected", "Usual first reaction in the currency"],
          rows: [
            ["Raises rates, hawkish tone", "A hold", "Strengthens"],
            ["Raises rates, signals it is the last", "A hike", "Can weaken"],
            ["Holds, signals hikes ahead", "A hold", "Strengthens"],
            ["Cuts unexpectedly", "A hold", "Weakens"],
          ],
        },
      },
      {
        id: "a-fx-geopolitics",
        title: "Risk sentiment and geopolitical events",
        explain:
          "Wars, elections, trade disputes and financial crises change how much risk investors want to take. In RISK-OFF periods money tends to flow to perceived SAFE HAVENS, traditionally the US dollar, the Japanese yen and the Swiss franc, and away from currencies tied to growth and commodities, such as the Australian and New Zealand dollars. In RISK-ON periods the reverse.",
        why: "Geopolitical shocks are unscheduled, can happen at weekends, and can overwhelm every other driver for days. This is one reason the course insists on stop-losses and small position sizes: you cannot plan for events you cannot see coming, only for how much they can cost you.",
        mistake:
          "Treating 'safe haven' as a law. In some crises the yen or franc have not behaved as expected. These are tendencies, observed over many episodes, not guarantees.",
      },
      {
        id: "a-fx-practical-announcement",
        title: "Practical: a before-and-after announcement note",
        explain:
          "This week's practical is a written note on one high-impact release. BEFORE it: what is expected, what a surprise either way would probably mean for the currency and why. AFTER it: what the actual figure and its details were, what price did in the first minutes and over the following day, and why the reaction matched or differed from your expectation.",
        example:
          "ANNOUNCEMENT NOTE — template\n\n  Event:          US CPI (y/y), 13:30 Lagos         Pair: EUR/USD\n  BEFORE  Previous 3.1% · Forecast 3.4%\n          If above forecast: higher Fed rates more likely → USD up → EUR/USD down\n          If below: the reverse\n  AFTER   Actual 3.2% (−0.2 vs forecast). Core also below forecast.\n          First 5 min: EUR/USD +38 pips. By next day: +55 pips.\n          Matched expectation: downside surprise in both headline and core.\n          Note: spread widened to 4 pips at release — no trade taken.",
        decision: {
          scenario:
            "You wrote before a Bank of England decision: 'A hike is expected. If they hike, GBP should rise.' They hiked, and GBP/USD fell 80 pips. Your after-note must explain the difference.",
          question: "Which explanation is the best place to start looking?",
          options: [
            {
              id: "a",
              text: "The hike was expected and priced in, so the guidance and the vote split decided the reaction",
              why: "Right. When the decision itself is no surprise, the market reacts to new information: how many members voted for it, and what the bank said about the future.",
            },
            {
              id: "b",
              text: "The news must have been reported incorrectly",
              whyWrong: "Look for the explanation in what was new before assuming an error.",
            },
            {
              id: "c",
              text: "Rate hikes always weaken currencies",
              whyWrong: "No 'always'. Hikes that are expected, or signalled as the last, can weaken a currency; surprise hikes usually strengthen it.",
            },
            {
              id: "d",
              text: "It was random, so there is nothing to write",
              whyWrong: "The point of the note is to find the reason. There almost always is a readable one in the statement, the votes or the projections.",
            },
          ],
          correct: "a",
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro: "Use a free economic calendar set to your time zone. Do not trade the releases; observe them on your demo charts.",
      prompts: [
        "On Sunday, list every high-impact event for USD, EUR, GBP and JPY this week, with its Lagos time, previous and forecast figures.",
        "Choose one release. Before it, write the BEFORE half of the announcement note.",
        "During it, watch the demo platform: record the spread just before, at, and five minutes after the release.",
        "After it, write the AFTER half: actual figure, the details, the first five minutes and the next day, and why the reaction matched or differed from your expectation.",
        "Add a column to your journal: 'High-impact news within 30 minutes? Y/N' and fill it for every trade from now on.",
      ],
      closing: "If the reaction surprised you, good: write down what you missed. That is exactly the skill this week builds.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
