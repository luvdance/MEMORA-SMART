/**
 * FOREX TRADING · WEEK 16 · LAB: FINAL ASSESSMENT
 *
 * Curriculum 16.1 – 16.P. Required output: the final trading plan, a case
 * study of the learner's own trading, and an oral or recorded presentation.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * THE GRADUATION STANDARD, stated in the final lesson and nowhere softened:
 * sound risk calculations, a strategy the learner can explain, accurate
 * records, and adherence to predefined rules. Profit alone never decides a
 * pass. Completing the course does not mean a learner is consistently
 * profitable or ready to trade live with real money.
 */

export const SECTION_ID = "fx-s16-lab-final";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 16.1 — THE FINAL TRADING PLAN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l47-final-plan",
    moduleId: "fx-w16-lab-final",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1"],
    title: "Assembling the Final Trading Plan",
    subtitle: "Week 12's plan, updated with everything the lab taught you",
    estimatedMinutes: 12,
    intro:
      "Your final trading plan is the Week 12 plan revised with the evidence from the lab: the backtest, the demo journal and the review. It must be complete, current and consistent with your records.",

    atoms: [
      {
        id: "a-fx-final-plan-contents",
        title: "What the final plan must contain",
        explain:
          "All eleven sections from Week 12, plus three additions: a VERSION HISTORY of the strategy (v1.0 and any change, with its reason and test); an EVIDENCE SUMMARY (backtest and demo statistics, adherence rate); and a PERSONAL RULES section for your own most common error, such as 'after two losses, close the platform for the day'.",
        why: "A plan that does not reflect what the lab revealed is a plan written for someone else. The personal rule is often the most valuable line in it.",
      },
      {
        id: "a-fx-final-plan-consistency",
        title: "Consistency with your records",
        explain:
          "Assessors check that the plan and the records agree: the risk per trade in the plan should be what the journal shows; the strategy rules should be the ones the backtest tested; any rule change should appear in the version history. A plan that says 1% while the journal shows trades at 3% fails the consistency check, however good the plan reads.",
        decision: {
          scenario:
            "Reviewing your plan before submission, you notice it says 'maximum 2 open trades', but your journal shows three days with three open trades.",
          question: "What should you do?",
          options: [
            {
              id: "a",
              text: "Leave the plan as it is, and address the breaches openly in the case study as a compliance issue",
              why: "Right. The rule was sound; the breaches are behaviour. Saying so openly is exactly what the assessment rewards.",
            },
            {
              id: "b",
              text: "Change the plan to 'maximum 3 open trades' so it matches the journal",
              whyWrong: "Rewriting a rule to hide breaches is falsifying the record, and it changes your risk without any review.",
            },
            {
              id: "c",
              text: "Delete those days from the journal",
              whyWrong: "That destroys the accurate records the graduation standard requires.",
            },
            {
              id: "d",
              text: "Ignore it; assessors will not notice",
              whyWrong: "They check consistency specifically. And the habit of hiding breaches is the one most likely to cost real money later.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 16.2 — THE CASE STUDY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l48-case-study",
    moduleId: "fx-w16-lab-final",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.2"],
    title: "Writing the Case Study",
    subtitle: "Your own trading, examined like someone else's",
    estimatedMinutes: 14,
    intro:
      "The case study is a short, evidence-based account of your trading through the lab. It is written in the third person if that helps you be objective: 'the trader followed the rules 73% of the time'. It shows that you can evaluate a trader honestly, starting with yourself.",

    atoms: [
      {
        id: "a-fx-case-structure",
        title: "Structure",
        explain:
          "Five parts, about two pages in total. (1) The strategy and why it was chosen. (2) The evidence: backtest and demo statistics side by side. (3) Two worked trades: one rule-following trade, win or loss, and one rule-breaking trade, each with screenshots, the risk calculation and what happened. (4) Analysis: what the split between compliant and rule-breaking trades shows. (5) What you changed or will change, and why.",
        table: {
          caption: "What each part must show.",
          headers: ["Part", "Must show"],
          rows: [
            ["Strategy", "The rules, in brief, and the reason for the style chosen"],
            ["Evidence", "Statistics from the backtest and the demo, with sample sizes"],
            ["Two trades", "Screenshots, position-size working, plan versus actual"],
            ["Analysis", "Adherence, the compliant/rule-breaking split, costs"],
            ["Changes", "One decision, with evidence and reason"],
          ],
        },
      },
      {
        id: "a-fx-case-trade-choice",
        title: "Choosing the two trades",
        explain:
          "Choose trades that teach, not trades that flatter. The best rule-following example is often a LOSS that was handled perfectly, because it shows the process working when the outcome did not. The rule-breaking example should be your most typical error, not your most dramatic one.",
        decision: {
          scenario:
            "For the rule-following example, you are choosing between a +2R winner where you entered one candle early, and a −1R loss where every rule was followed exactly.",
          question: "Which is the better choice?",
          options: [
            {
              id: "a",
              text: "The −1R loss: it is a genuinely rule-following trade, and shows the process working regardless of outcome",
              why: "Right. The early entry makes the winner a rule-breaking trade. The clean loss is the honest example, and assessors value it.",
            },
            {
              id: "b",
              text: "The +2R winner, because it looks better",
              whyWrong: "It broke the entry rule, so it is not a rule-following example at all.",
            },
            {
              id: "c",
              text: "Neither; choose a trade from a different strategy",
              whyWrong: "The case study is about your strategy and your records.",
            },
            {
              id: "d",
              text: "Leave the section out",
              whyWrong: "The worked trades are required; they are where your risk calculation is checked.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 16.3 + 16.P — PRESENTATION AND GRADUATION STANDARD
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l49-presentation",
    moduleId: "fx-w16-lab-final",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.3", "16.P"],
    title: "The Presentation and the Graduation Standard",
    subtitle: "Explain it, defend it, and know what it does and does not mean",
    estimatedMinutes: 16,
    intro:
      "The last output is a ten to fifteen minute presentation, live to an assessor or recorded on your phone or laptop, in which you explain your plan, walk through your case study and answer questions. Then: the standard you are assessed against, stated exactly.",

    atoms: [
      {
        id: "a-fx-presentation",
        title: "The presentation",
        explain:
          "Cover: your strategy in under two minutes; one position-size calculation worked live from a real journal entry; your statistics and adherence; your two case-study trades; and your decision for what comes next. Expect questions like 'Where would you put the stop on this chart, and why?', 'What would you do after a third consecutive loss?', 'How did you check your broker?'. Recorded presentations should show your screen with the chart and journal.",
        why: "Explaining your process out loud, and answering questions you did not prepare for, is the strongest evidence that you understand it rather than having copied it.",
      },
      {
        id: "a-fx-graduation-standard",
        title: "The graduation standard",
        explain:
          "To graduate you must demonstrate FOUR things: SOUND RISK CALCULATIONS (position size, pip value, margin and exposure worked correctly); a STRATEGY YOU CAN EXPLAIN (objective rules that someone else could follow); ACCURATE RECORDS (backtest, journal and reconciliation that agree with the platform); and RULE ADHERENCE (following your predefined rules, and handling breaches honestly). PROFIT ALONE NEVER DECIDES WHETHER YOU PASS.",
        table: {
          caption: "What passes and what does not.",
          headers: ["Passes", "Does not pass"],
          rows: [
            ["Negative demo results, accurate records, high adherence, honest analysis", "Large demo profits from oversized, rule-breaking trades"],
            ["A strategy with no proven edge, tested and reported honestly", "A strategy whose backtest omitted losing setups"],
            ["Clear position-size working, matching the journal", "Risk calculations that do not match the trades placed"],
          ],
        },
        decision: {
          scenario:
            "Two learners finish the lab. Learner A: demo −2%, adherence 92%, records reconcile perfectly, explains every rule. Learner B: demo +35%, risked 5–10% per trade, several unrecorded trades, cannot explain their entry rule.",
          question: "Under the graduation standard, who passes?",
          options: [
            {
              id: "a",
              text: "Learner A",
              why: "Right. A meets all four requirements. B's profit came from risk the plan forbids and records that are incomplete; it is luck, and the standard is designed to tell the difference.",
            },
            {
              id: "b",
              text: "Learner B, because they made money",
              whyWrong: "Profit alone never decides a pass. B fails on risk, records and explanation.",
            },
            {
              id: "c",
              text: "Both",
              whyWrong: "B does not meet any of the four requirements.",
            },
            {
              id: "d",
              text: "Neither, because A lost money",
              whyWrong: "A small, well-managed loss with excellent process meets the standard.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-what-graduation-means",
        title: "What graduating means, and what it does not",
        explain:
          "Graduating means you understand how the forex market works, can calculate and control risk, can build, test and review a rule-based strategy, and can keep honest records of your own behaviour. It does NOT mean you are, or will become, consistently profitable, and it does NOT mean you are ready to trade live with real money. If you ever choose to, the minimum is a long demo record consistent with your backtest, sustained rule adherence through losing periods, only money you can afford to lose entirely, a broker whose regulation you have verified, and the smallest position sizes available. Many careful, intelligent people decide, after a course like this, that trading is not for them, and that is a sound, well-informed decision too.",
      },
      {
        id: "a-fx-final-output",
        title: "Required output: plan, case study, presentation",
        explain:
          "Submit the final trading plan (with version history, evidence summary and personal rules), the case study (five parts, two worked trades with screenshots), and the presentation, live or recorded. They are assessed together against the four parts of the graduation standard.",
      },
    ],

    task: {
      title: "This week's required output",
      intro: "The final assessment. Assessed against the graduation standard; profit alone never decides a pass.",
      prompts: [
        "Finalise your trading plan: all eleven Week 12 sections, plus version history, evidence summary and your personal rules.",
        "Check the plan against your journal and backtest for consistency, and address any breaches openly.",
        "Write the case study: strategy, evidence, two worked trades, analysis, and your decision.",
        "Prepare and deliver your 10–15 minute presentation, live or recorded, including one position-size calculation worked from a real journal entry.",
        "Submit all three together.",
      ],
      closing:
        "Whatever your demo results, a complete, honest submission that meets the four requirements is a pass. Congratulations on getting here: you now know more about how trading really works than most people who trade.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
