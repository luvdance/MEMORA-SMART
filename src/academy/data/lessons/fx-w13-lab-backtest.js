/**
 * FOREX TRADING · WEEK 13 · LAB: STRATEGY BACKTESTING
 *
 * Curriculum 13.1 – 13.P. The first week of the four-week practical lab.
 * Required output: a documented historical trade sample of at least 50
 * qualifying setups, every one recorded, wins and losses alike.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * In the lab, lessons are short and the work is long. Each lesson gives the
 * standard the output is assessed against, and one practice that checks the
 * learner can apply it.
 */

export const SECTION_ID = "fx-s13-lab-backtest";

/** Twenty logged backtest results, in R, after costs. */
const BACKTEST_20 = [2, -1, -1, 2, -1, -1, 2, 2, -1, -1, -1, 2, -1, 2, -1, 2, -1, -1, 2, -1];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 13.1 — PREPARING THE BACKTEST
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l38-lab-prepare",
    moduleId: "fx-w13-lab-backtest",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1"],
    title: "Preparing the Backtest: Data, Rules and the Journal Template",
    subtitle: "Freeze the rules before you look at a single candle",
    estimatedMinutes: 14,
    intro:
      "Phase 5 is where you demonstrate that you can apply the course, not simply pass quizzes. Week 13's output is a documented historical sample. Its value depends entirely on decisions made before the test starts, so this lesson is about preparation.",

    atoms: [
      {
        id: "a-fx-lab-freeze",
        title: "Freeze the rules",
        explain:
          "Before testing, copy your strategy and checklist from your trading plan into the backtest file, add today's date and a version number ('v1.0'), and do not change them until the test is finished. If you think of an improvement, write it in a separate 'ideas' list. It will be considered in Week 15, and tested on new data.",
        why: "A test of rules that changed halfway through is a test of nothing in particular. Freezing the rules is what lets the result mean something.",
      },
      {
        id: "a-fx-lab-period",
        title: "Choose the data honestly",
        explain:
          "Choose the pair or pairs and the period BEFORE looking at how the strategy did in them. Cover at least twelve months and different conditions: a trend up, a trend down, a range, a volatile period around major news. Keep the most recent three months aside, untouched, as OUT-OF-SAMPLE data: you will test on it once, at the end.",
        decision: {
          scenario:
            "You scroll through EUR/USD's last two years and notice that the strategy would obviously have done well in the first half of this year, a strong trend. You consider testing only that period to save time.",
          question: "What should you do?",
          options: [
            {
              id: "a",
              text: "Test that period; it gives the most trades fastest",
              whyWrong: "Choosing a period because you can already see the strategy worked there guarantees a flattering result that says nothing about other conditions.",
            },
            {
              id: "b",
              text: "Test a full twelve months or more, chosen in advance and covering trends and ranges, and keep the last three months as out-of-sample",
              why: "Right. A test that includes the conditions where the strategy struggles is the only one that tells you what to expect.",
            },
            {
              id: "c",
              text: "Test only the ranging months, to be conservative",
              whyWrong: "Choosing only bad conditions is as biased as choosing only good ones.",
            },
            {
              id: "d",
              text: "Skip the backtest; the demo will show the truth",
              whyWrong: "A few weeks of demo trading is a far smaller sample than a year of history.",
            },
          ],
          correct: "b",
        },
      },
      {
        id: "a-fx-lab-template",
        title: "The backtest file",
        explain:
          "Set up the file with the columns from Week 9, a 'rule version' cell at the top, a 'doubt' column for any setup where applying a rule took judgement, and a summary block. Each row gets a screenshot link: TradingView's camera icon can save an image and copy its link.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 13.2 — RUNNING THE TEST
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l39-lab-run",
    moduleId: "fx-w13-lab-backtest",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.2"],
    title: "Running the Test and Recording Every Qualifying Setup",
    subtitle: "Completeness is the whole standard",
    estimatedMinutes: 14,
    intro:
      "Now the long part: Bar Replay, one candle at a time, logging every setup the rules produce. Plan several sessions across the week. Fifty setups on an H4 strategy can take ten hours or more.",

    atoms: [
      {
        id: "a-fx-lab-logging",
        title: "Logging a setup",
        explain:
          "When every checklist item is 'yes', stop the replay and log the row before revealing anything more: entry, stop, target, their distances in pips, and the planned reward-to-risk. Then step forward until the trade ends and record the result in R after costs.",
        calcExercise: {
          scenario: "A logged GBP/USD buy: entry 1.2650, stop 1.2622, target 1.2706.",
          question: "What is the planned reward-to-risk (in R)?",
          unit: "R",
          answer: 2,
          tolerance: 0.005,
          hint: "Distance to target ÷ distance to stop.",
          working: "Stop distance: 1.2650 − 1.2622 = 28 pips\nTarget distance: 1.2706 − 1.2650 = 56 pips\n56 ÷ 28 = 2.0R",
          check: { fn: "rewardToRisk", args: { entry: 1.265, stop: 1.2622, target: 1.2706 } },
        },
      },
      {
        id: "a-fx-lab-doubt",
        title: "Setups that needed judgement",
        explain:
          "Some setups will be borderline: a candle that is almost a pin bar, a zone that is arguably two zones. Log them, mark the 'doubt' column, and apply the rule as literally as you can. At the end you will check whether the doubtful trades changed the result. If they did, the rule needs clarifying, and that goes on the ideas list.",
        decision: {
          scenario: "You reach a setup where the trigger candle's lower wick is 58% of its range. Your rule requires 60%.",
          question: "How do you record it?",
          options: [
            {
              id: "a",
              text: "Not a qualifying setup: 58% does not meet the written 60% rule. Note it as a near-miss",
              why: "Right. The rule is literal. Recording near-misses lets you see later whether the threshold matters.",
            },
            {
              id: "b",
              text: "Count it: 58% is close enough",
              whyWrong: "'Close enough' is how a rule silently becomes a different rule during the test.",
            },
            {
              id: "c",
              text: "Count it only if it won",
              whyWrong: "That uses the outcome to decide whether a trade counts, the clearest form of backtest bias.",
            },
            {
              id: "d",
              text: "Change the rule to 55% so it qualifies",
              whyWrong: "The rules are frozen until the test ends.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 13.3 + 13.P — SUMMARISING THE SAMPLE HONESTLY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l40-lab-summarise",
    moduleId: "fx-w13-lab-backtest",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.3", "13.P"],
    title: "Summarising the Sample and Checking It for Honesty",
    subtitle: "The required output for Week 13",
    estimatedMinutes: 16,
    intro:
      "With the sample complete, calculate its statistics, then run three honesty checks before you trust any of them. The finished file is this week's required output.",

    atoms: [
      {
        id: "a-fx-lab-summary",
        title: "The summary statistics",
        explain:
          "Calculate, from the R column: number of trades, win rate, average win and loss, expectancy, profit factor, maximum drawdown and longest losing streak. Below are the first twenty logged trades of a sample, in R after costs: +2, −1, −1, +2, −1, −1, +2, +2, −1, −1, −1, +2, −1, +2, −1, +2, −1, −1, +2, −1.",
        calcExercise: {
          scenario: "Use the twenty results above.",
          question: "What is the expectancy per trade, in R?",
          unit: "R",
          answer: 0.2,
          tolerance: 0.005,
          hint: "Add up all twenty results and divide by twenty.",
          working: "8 wins × 2R = +16R; 12 losses × 1R = −12R\nTotal +4R ÷ 20 = +0.20R per trade\n(Win rate 40%, profit factor 16 ÷ 12 = 1.33, longest losing streak 3.)",
          check: { fn: "expectancy", args: { results: BACKTEST_20 } },
        },
      },
      {
        id: "a-fx-lab-honesty",
        title: "Three honesty checks",
        explain:
          "First, COMPLETENESS: scroll the replay period again and confirm no qualifying setup is missing. Second, DOUBT: recalculate the statistics without the 'doubt' trades; if the result changes sign, the strategy's edge depends on judgement calls, not rules. Third, OUT-OF-SAMPLE: run the frozen rules once on the three months you kept aside and compare.",
        decision: {
          scenario:
            "Your 60-trade sample shows +0.18R expectancy. Without the 9 'doubt' trades it is −0.02R. On the out-of-sample period it is −0.10R over 14 trades.",
          question: "What is the honest conclusion for your report?",
          options: [
            {
              id: "a",
              text: "The strategy works: the full sample is +0.18R",
              whyWrong: "The edge disappears when judgement calls are removed and does not appear on unseen data. Reporting only the headline number would be misleading.",
            },
            {
              id: "b",
              text: "The apparent edge depends on borderline setups and did not hold out of sample; report all three figures and treat the edge as unproven",
              why: "Right. That is an honest, useful result. It points directly at which rule needs clarifying, and it is exactly the kind of conclusion the lab is assessed on.",
            },
            {
              id: "c",
              text: "Delete the out-of-sample test; it is too small",
              whyWrong: "It is small, which is a reason for caution, not for hiding it.",
            },
            {
              id: "d",
              text: "Add filters until the out-of-sample result is positive",
              whyWrong: "Fitting rules to the out-of-sample data destroys its only purpose.",
            },
          ],
          correct: "b",
          aftermath: "A strategy with no proven edge is not a failed lab. A dishonest report is.",
        },
      },
      {
        id: "a-fx-lab-output-13",
        title: "Required output: the documented historical sample",
        explain:
          "Submit the backtest file: frozen rules with version and date; at least 50 qualifying setups, each with a screenshot; the summary statistics; the three honesty checks; and a half-page conclusion stating what the sample suggests and what it cannot show.",
      },
    ],

    task: {
      title: "This week's required output",
      intro: "A documented historical trade sample. Assessed on completeness, accuracy and honesty, not on whether the results are positive.",
      prompts: [
        "Freeze your rules (version and date) and choose your pair, period and out-of-sample months before testing.",
        "Run Bar Replay and log at least 50 qualifying setups, each with entry, stop, target, R planned, R result after costs, a doubt flag and a screenshot.",
        "Calculate the summary statistics.",
        "Run the three honesty checks: completeness, without-doubt, out-of-sample.",
        "Write the half-page conclusion and submit the file.",
      ],
      closing: "Keep your ideas list. It is the starting point for Week 15.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
