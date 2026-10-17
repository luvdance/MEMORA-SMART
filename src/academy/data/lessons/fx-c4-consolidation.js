/**
 * FOREX TRADING · CONSOLIDATION WEEK 4 · PHASE 4 REVIEW AND DEMO PRACTICE
 *
 * Curriculum C4.1 – C4.P. Interleaved practice across costs, drawdown,
 * exposure and margin; the phase's commonest mistakes; a week trading the
 * full plan unsupervised; and the Phase 4 checkpoint, which leads into the
 * four-week lab.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s-c4";

/** Ten trades in dollars from $1,000: two wins, four losses, then recovery. */
const DRAWDOWN_10 = [10, 10, -10, -10, -10, -10, 20, -10, 20, 20];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     C4.1 — INTERLEAVED PRACTICE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c4-l1-mixed-practice",
    moduleId: "fx-c4-consolidation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["C4.1"],
    title: "Interleaved Practice: Costs, Drawdown, Exposure and Margin",
    subtitle: "The risk numbers of the whole account, mixed",
    estimatedMinutes: 18,
    intro: "Phase 4 moved from single trades to the whole account. These problems are mixed; name the measure before you calculate it.",

    atoms: [
      {
        id: "a-fx-c4-cost",
        title: "A swing trade's costs",
        explain: "Spread and swap on a trade held for several nights.",
        calcExercise: {
          scenario: "0.05 lots of EUR/USD, spread 1.0 pip ($10 per pip per lot), no commission, swap charges of $0.90 over the nights held.",
          question: "Total cost in dollars?",
          unit: "USD",
          answer: 1.4,
          tolerance: 0.005,
          hint: "Spread × pip value × lots, plus swap.",
          working: "1.0 × $10 × 0.05 = $0.50; + $0.90 swap = $1.40",
          check: { fn: "tradeCost", args: { spreadPips: 1, pipValuePerLot: 10, lots: 0.05, commissionPerLot: 0, swap: 0.9 } },
        },
      },
      {
        id: "a-fx-c4-streak",
        title: "A losing streak at 2%",
        explain: "The arithmetic of a streak, at the top of the professional range.",
        calcExercise: {
          scenario: "$1,000 account, 2% risk per trade on the current balance, six losses in a row.",
          question: "Balance afterwards? Round to the cent.",
          unit: "USD",
          answer: 885.84,
          tolerance: 0.01,
          hint: "Multiply by 0.98 six times.",
          working: "$1,000 × 0.98⁶ = $885.84: an 11.4% drawdown from six ordinary losses.",
          check: { fn: "balanceAfterLosses", args: { balance: 1000, riskPercent: 2, losses: 6 } },
        },
      },
      {
        id: "a-fx-c4-margin-level",
        title: "Margin level under pressure",
        explain: "Equity has fallen; how close is the margin call?",
        calcExercise: {
          scenario: "Equity $520, used margin $480. Margin call at 100%.",
          question: "What is the margin level? Round to one decimal place.",
          unit: "%",
          answer: 108.3,
          tolerance: 0.05,
          hint: "Equity ÷ used margin × 100.",
          working: "520 ÷ 480 × 100 = 108.3%: barely above the margin call. The positions are far too large for the account.",
          check: { fn: "marginLevel", args: { equity: 520, usedMargin: 480 } },
        },
      },
      {
        id: "a-fx-c4-recovery",
        title: "Recovery from a drawdown",
        explain: "Why the account drawdown ladder stops trading early.",
        calcExercise: {
          scenario: "An account has fallen 30% from its peak.",
          question: "What gain is needed to recover? Round to one decimal place.",
          unit: "%",
          answer: 42.9,
          tolerance: 0.05,
          hint: "loss ÷ (1 − loss).",
          working: "0.30 ÷ 0.70 = 0.4286 = 42.9%",
          check: { fn: "recoveryNeeded", args: { lossPercent: 30 } },
        },
      },
      {
        id: "a-fx-c4-max-dd",
        title: "Maximum drawdown from a journal",
        explain: "Ten trades in dollars from $1,000: +10, +10, −10, −10, −10, −10, +20, −10, +20, +20.",
        calcExercise: {
          scenario: "Use the ten trades above.",
          question: "What is the maximum drawdown as a percentage of the peak? Round to one decimal place.",
          unit: "%",
          answer: 3.9,
          tolerance: 0.05,
          hint: "Track the equity: find the peak, then the lowest point after it.",
          working: "Equity: 1000 → 1010 → 1020 → 1010 → 1000 → 990 → 980 → …\nPeak $1,020, trough $980: $40 ÷ $1,020 = 3.9%",
          check: { fn: "maxDrawdownPercent", args: { start: 1000, results: DRAWDOWN_10 } },
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C4.2 — COMMON MISTAKES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c4-l2-mistakes",
    moduleId: "fx-c4-consolidation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["C4.2"],
    title: "The Most Common Phase 4 Mistakes",
    subtitle: "The trader, not the trade",
    estimatedMinutes: 12,
    intro: "Phase 4's mistakes are about behaviour and the account as a whole. They are the ones that end trading careers.",

    atoms: [
      {
        id: "a-fx-c4-mistake-list",
        title: "The list",
        explain:
          "Execution errors from skipping the order routine. Ignoring swaps on long holds. Revenge trading after losses. Raising risk after wins. Grading trades by outcome. Overriding circuit breakers 'just this once'. Holding several trades that are really one bet. Trusting a broker's logo instead of the regulator's register. Handing money to an 'account manager'.",
        table: {
          caption: "Mistake and the safeguard that stops it.",
          headers: ["Mistake", "Safeguard"],
          rows: [
            ["Execution errors", "Order routine, read-back, Trade tab check"],
            ["Revenge or greed", "Fixed 1% and daily loss limit"],
            ["Grading by outcome", "Process grade with results covered"],
            ["Overriding limits", "Limits change only at the weekly review"],
            ["Hidden correlated exposure", "Per-currency and total exposure limits"],
            ["Unregulated broker or fraud", "Regulator's register; the red-flag list"],
          ],
        },
      },
      {
        id: "a-fx-c4-mistake-check",
        title: "Spot the mistakes",
        explain: "Apply the list.",
        decision: {
          scenario:
            "Friday's journal: long EUR/USD, long GBP/USD, short USD/CHF, each 1%. After two losses Kemi added a fourth trade, long AUD/USD at 2% 'to get it back'. All four lost when US data surprised. Her daily limit was two losses.",
          question: "Which mistakes are present?",
          options: [
            {
              id: "a",
              text: "Hidden correlated exposure, a revenge trade at doubled risk, and an overridden daily limit",
              why: "Right. The first three were already one short-dollar bet (3%), the fourth made it 5%, at double size, after the limit was hit.",
            },
            {
              id: "b",
              text: "Only bad luck with the US data",
              whyWrong: "The data was the trigger; the size of the loss came from the decisions.",
            },
            {
              id: "c",
              text: "Only the AUD/USD trade",
              whyWrong: "The first three were already concentrated on one currency.",
            },
            {
              id: "d",
              text: "None; four different pairs is diversification",
              whyWrong: "All four were short the dollar. Different pairs, one bet.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C4.3 — THE GUIDED DEMO WEEK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c4-l3-demo-week",
    moduleId: "fx-c4-consolidation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["C4.3"],
    title: "A Guided Demo Week: The Full Trading Plan, Unsupervised",
    subtitle: "A dress rehearsal for the lab",
    estimatedMinutes: 10,
    intro: "This week you trade your complete plan from Week 12 with no observer: every rule, every limit, every journal field. It is a rehearsal for Weeks 13 to 16.",

    atoms: [
      {
        id: "a-fx-c4-week-plan",
        title: "The week",
        explain:
          "Run the full daily routine (calendar, analysis, alerts, state check). Trade only under the plan. Grade every trade's process before seeing its result. Check exposure before every new trade. Reconcile with MT5's History each evening. At the end of the week, find the one rule you found hardest to follow: that is what the lab will test hardest.",
      },
      {
        id: "a-fx-c4-week-rule",
        title: "No observer, same rules",
        explain: "Discipline that depends on being watched is not discipline yet.",
        decision: {
          scenario: "Nobody is checking this week. On Tuesday you skip the read-back step 'because it is only demo'. The trade is fine.",
          question: "How do you record it?",
          options: [
            {
              id: "a",
              text: "As a process deviation, graded B or C by your own definitions, with a note",
              why: "Right. The journal records what you did, observed or not. Recording small slips honestly is what makes the lab's records trustworthy.",
            },
            {
              id: "b",
              text: "Not at all; nothing went wrong",
              whyWrong: "Nothing went wrong this time. The routine exists for the time it would.",
            },
            {
              id: "c",
              text: "As an A, since the trade was fine",
              whyWrong: "That grades by outcome.",
            },
            {
              id: "d",
              text: "Drop the read-back step from the plan",
              whyWrong: "Rules change at review, with a reason, not because one was inconvenient.",
            },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     C4.4 + C4.P — THE PHASE 4 CHECKPOINT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-c4-l4-checkpoint",
    moduleId: "fx-c4-consolidation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["C4.4", "C4.P"],
    title: "The Phase 4 Checkpoint",
    subtitle: "Your plan and the theory and risk assessment, then the lab",
    estimatedMinutes: 12,
    intro: "The Phase 4 checkpoint confirms you are ready for the four-week practical lab: a complete trading plan and a passed theory and risk-management assessment.",

    atoms: [
      {
        id: "a-fx-c4-checkpoint-format",
        title: "The checkpoint",
        explain:
          "Two items: your complete trading plan from Week 12, revised with anything this consolidation week revealed; and the theory and risk-management assessment, which is the check at the end of Week 12's final lesson, passed at 70% or above. If you have not yet passed it, retake it now.",
        why: "The lab assumes the plan exists and that the risk arithmetic is secure. Starting Weeks 13 to 16 without them would make the lab a test of something else.",
      },
      {
        id: "a-fx-c4-checkpoint-ready",
        title: "Ready for the lab, not for live trading",
        explain: "The lab is still demo-only. Being ready for it means something specific.",
        decision: {
          scenario: "You pass the Phase 4 checkpoint. A friend says that means you are now 'a qualified trader' and should open a live account before the lab.",
          question: "What is accurate?",
          options: [
            {
              id: "a",
              text: "Passing means you are ready for the demo-based lab; it says nothing about readiness for live trading",
              why: "Right. Even graduation does not certify live readiness, as Week 16 states plainly.",
            },
            {
              id: "b",
              text: "Passing qualifies you to trade real money",
              whyWrong: "No checkpoint in this course certifies that.",
            },
            {
              id: "c",
              text: "You should skip the lab and go live",
              whyWrong: "The lab is where your process is demonstrated; skipping it removes the evidence.",
            },
            {
              id: "d",
              text: "You should manage your friend's money",
              whyWrong: "Managing others' money needs licensing far beyond this course.",
            },
          ],
          correct: "a",
        },
      },
    ],

    task: {
      title: "Phase 4 checkpoint",
      intro: "Two items, then the lab begins.",
      prompts: [
        "Revise your trading plan with what the unsupervised demo week revealed, and add your hardest-to-follow rule to the personal-rules notes.",
        "Make sure the Week 12 theory and risk-management assessment is passed at 70% or above; retake it if not.",
        "Reconcile your demo journal for the week against MT5's History.",
        "Prepare the lab: freeze your strategy (version and date) for Week 13's backtest.",
        "Three lines: what you are most confident about, what you expect the lab to expose, and how you will handle it.",
      ],
      closing: "Next: the four-week practical trading lab. This is where you demonstrate what you can do.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
