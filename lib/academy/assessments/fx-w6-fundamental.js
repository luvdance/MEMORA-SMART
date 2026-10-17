/**
 * ASSESSMENTS · FOREX TRADING · WEEK 6
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l17-economic-drivers": {
    lessonId: "fx-l17-economic-drivers",
    passMark: 70,
    questions: [
      {
        id: "fxq17-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-interest-rates",
        prompt: "Other things equal, rising expected interest rates in a country tend to:",
        options: [
          { id: "a", text: "Strengthen its currency" },
          { id: "b", text: "Weaken its currency" },
          { id: "c", text: "Have no effect" },
          { id: "d", text: "Close its forex market" },
        ],
        correct: "a",
        explanation: "Higher expected returns on holding the currency attract international money.",
        whyWrong: {
          b: "Falling expected rates tend to weaken a currency, not rising ones.",
          c: "Interest-rate expectations are the strongest single driver of major currencies.",
          d: "Forex markets do not close because of rate changes.",
        },
      },
      {
        id: "fxq17-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-inflation",
        prompt: "Why does a higher-than-expected CPI figure often SUPPORT a currency?",
        options: [
          { id: "a", text: "Because inflation is good for an economy" },
          { id: "b", text: "Because it makes higher interest rates from the central bank more likely" },
          { id: "c", text: "Because CPI measures exports" },
          { id: "d", text: "It never does" },
        ],
        correct: "b",
        explanation: "The currency reacts to the expected central bank response: more inflation, more likely to hold or raise rates.",
        whyWrong: {
          a: "High inflation hurts households. The currency effect comes through rates.",
          c: "CPI measures consumer prices.",
          d: "It very often does, through the rate channel.",
        },
      },
      {
        id: "fxq17-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-growth-jobs",
        prompt: "What does the US Nonfarm Payrolls report mainly measure?",
        options: [
          { id: "a", text: "Jobs added in the US in the previous month" },
          { id: "b", text: "US farm output" },
          { id: "c", text: "The Federal Reserve's interest rate" },
          { id: "d", text: "US imports" },
        ],
        correct: "a",
        explanation: "NFP counts jobs added outside farming, alongside the unemployment rate and wage growth.",
        whyWrong: {
          b: "'Nonfarm' means farm jobs are EXCLUDED.",
          c: "The FOMC sets the rate; NFP is data it considers.",
          d: "Imports are in trade-balance data.",
        },
      },
      {
        id: "fxq17-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-central-banks",
        prompt:
          "Markets come to expect the Bank of Japan to raise rates while the Fed is expected to cut. Other things equal, USD/JPY tends to:",
        options: [
          { id: "a", text: "Fall" },
          { id: "b", text: "Rise" },
          { id: "c", text: "Stay exactly where it is" },
          { id: "d", text: "Become an exotic pair" },
        ],
        correct: "a",
        explanation: "The expected rate differential moves in the yen's favour: the yen strengthens and the dollar weakens, so USD/JPY falls.",
        whyWrong: {
          b: "That would need the differential to move in the dollar's favour.",
          c: "A change in expected differentials is exactly what moves major pairs.",
          d: "Pair classifications do not depend on rates.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l18-economic-calendar": {
    lessonId: "fx-l18-economic-calendar",
    passMark: 70,
    questions: [
      {
        id: "fxq18-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-calendar",
        prompt: "On an economic calendar, what does the FORECAST column represent?",
        options: [
          { id: "a", text: "What economists expect, roughly the market's expectation" },
          { id: "b", text: "The final official figure" },
          { id: "c", text: "Last month's figure" },
          { id: "d", text: "A trade signal" },
        ],
        correct: "a",
        explanation: "The forecast, or consensus, is the expected figure. Reactions depend on how the actual compares with it.",
        whyWrong: {
          b: "That is the ACTUAL, filled in at release.",
          c: "That is PREVIOUS.",
          d: "The calendar gives information, not signals.",
        },
      },
      {
        id: "fxq18-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-high-impact",
        prompt: "US NFP is released at 8:30 a.m. New York time. In January, what time is that in Lagos?",
        options: [
          { id: "a", text: "08:30" },
          { id: "b", text: "13:30" },
          { id: "c", text: "14:30" },
          { id: "d", text: "15:30" },
        ],
        correct: "c",
        explanation: "In January New York is on UTC−5, so 8:30 is 13:30 UTC, and Lagos (UTC+1) is an hour later: 14:30.",
        whyWrong: {
          a: "That is New York's own time.",
          b: "That is the Lagos time during US daylight saving (mid-March to early November).",
          d: "That adds one hour too many.",
        },
      },
      {
        id: "fxq18-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-news-risk",
        prompt: "What typically happens to spreads at the moment of a high-impact release?",
        options: [
          { id: "a", text: "They widen sharply" },
          { id: "b", text: "They fall to zero" },
          { id: "c", text: "They stay exactly the same" },
          { id: "d", text: "They are replaced by commission" },
        ],
        correct: "a",
        explanation: "Liquidity providers pull back around releases, so spreads widen, sometimes to many times normal, and slippage rises.",
        whyWrong: {
          b: "Spreads never fall to zero; at news they do the opposite.",
          c: "Variable spreads respond strongly to liquidity.",
          d: "Commission, where charged, is separate and does not replace spreads.",
        },
      },
      {
        id: "fxq18-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-news-risk",
        prompt: "Which rule best protects a learner around high-impact news?",
        options: [
          { id: "a", text: "Open no new trades in the minutes before and after a release that affects your pair" },
          { id: "b", text: "Trade every release with a market order" },
          { id: "c", text: "Remove stop-losses before releases" },
          { id: "d", text: "Increase lot size to recover the spread" },
        ],
        correct: "a",
        explanation: "Avoiding entries around releases avoids the worst spreads, slippage and spikes while skills are being built.",
        whyWrong: {
          b: "Market orders at release suffer the worst fills.",
          c: "Removing protection at the most volatile moment is the opposite of risk management.",
          d: "Bigger size multiplies the cost and the risk.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l19-expectations": {
    lessonId: "fx-l19-expectations",
    passMark: 70,
    questions: [
      {
        id: "fxq19-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-expectations",
        prompt: "Eurozone GDP growth: previous 0.1%, forecast 0.3%, actual 0.2%. What kind of surprise is it?",
        options: [
          { id: "a", text: "A downside surprise, even though growth improved" },
          { id: "b", text: "An upside surprise, because growth rose" },
          { id: "c", text: "No surprise" },
          { id: "d", text: "Impossible to tell without the chart" },
        ],
        correct: "a",
        explanation: "The surprise is actual minus forecast: 0.2 − 0.3 = −0.1. Better than last time, worse than expected.",
        whyWrong: {
          b: "Improvement on the previous figure was already expected and priced in.",
          c: "The actual differs from the forecast, which is the definition of a surprise.",
          d: "Surprise is defined by the numbers, not by the price reaction.",
        },
      },
      {
        id: "fxq19-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-reaction-differs",
        prompt: "Which is NOT a reason a currency's reaction can differ from the 'obvious' one?",
        options: [
          { id: "a", text: "Revisions to previous figures" },
          { id: "b", text: "Other parts of the same report" },
          { id: "c", text: "Traders' positioning before the release" },
          { id: "d", text: "The colour of the candles on your chart" },
        ],
        correct: "d",
        explanation: "Chart colours are a display setting. Revisions, details and positioning are all real reasons reactions differ.",
        whyWrong: {
          a: "Revisions can change the overall picture of a report.",
          b: "Markets may focus on wages or unemployment rather than the headline.",
          c: "Heavy positioning can turn good news into profit-taking.",
        },
      },
      {
        id: "fxq19-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-monetary-policy",
        prompt: "A 'hawkish' central bank is one that:",
        options: [
          { id: "a", text: "Leans towards higher rates to fight inflation" },
          { id: "b", text: "Leans towards lower rates to support growth" },
          { id: "c", text: "Never changes rates" },
          { id: "d", text: "Trades forex for profit" },
        ],
        correct: "a",
        explanation: "Hawkish means favouring tighter policy. Dovish is the opposite.",
        whyWrong: {
          b: "That is dovish.",
          c: "The terms describe tone, not inactivity.",
          d: "Central banks pursue policy goals, not trading profit.",
        },
      },
      {
        id: "fxq19-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-geopolitics",
        prompt: "A sudden global crisis triggers 'risk-off' trading. Which move is the traditional tendency?",
        options: [
          { id: "a", text: "AUD/JPY falls" },
          { id: "b", text: "AUD/JPY rises" },
          { id: "c", text: "USD/CHF and USD/JPY both double" },
          { id: "d", text: "All currencies stop moving" },
        ],
        correct: "a",
        explanation: "Risk-off tends to favour the safe-haven yen and hurt the growth-linked Australian dollar, so AUD/JPY tends to fall.",
        whyWrong: {
          b: "That is the typical risk-ON move.",
          c: "Safe-haven flows go into the dollar, yen and franc together; there is no reason for such extreme moves in those pairs.",
          d: "Crises usually increase movement.",
        },
      },
      {
        id: "fxq19-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-practical-announcement",
        prompt: "Why write the BEFORE half of an announcement note before the release?",
        options: [
          { id: "a", text: "So your expectations are recorded honestly and cannot be adjusted with hindsight" },
          { id: "b", text: "Because it lets you trade the release with certainty" },
          { id: "c", text: "Because brokers require it" },
          { id: "d", text: "It makes no difference when you write it" },
        ],
        correct: "a",
        explanation: "Written beforehand, the note shows what you really expected. Written afterwards, hindsight makes every reaction look predictable.",
        whyWrong: {
          b: "Nothing gives certainty about a release.",
          c: "Brokers do not ask for it; it is a learning tool.",
          d: "Hindsight bias makes the timing essential.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
