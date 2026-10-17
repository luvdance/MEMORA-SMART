/**
 * ASSESSMENTS · FOREX TRADING · CONSOLIDATION WEEK 4
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  "fx-c4-l1-mixed-practice": {
    lessonId: "fx-c4-l1-mixed-practice",
    passMark: 70,
    questions: [
      {
        id: "fxqc4-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c4-cost",
        prompt: "0.10 lots, 0.5-pip spread ($10/pip/lot), $7 per lot commission, no swap. Total cost?",
        options: [
          { id: "a", text: "$1.20" },
          { id: "b", text: "$0.50" },
          { id: "c", text: "$7.50" },
          { id: "d", text: "$12.00" },
        ],
        correct: "a",
        explanation: "Spread 0.5 × $10 × 0.10 = $0.50; commission $7 × 0.10 = $0.70; total $1.20.",
        whyWrong: {
          b: "That forgets the commission.",
          c: "That charges a full lot's commission.",
          d: "A factor of ten too big.",
        },
      },
      {
        id: "fxqc4-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-streak",
        prompt: "Why compound losses on the CURRENT balance?",
        options: [
          { id: "a", text: "Because 1% of a smaller balance is a smaller loss, which slows drawdown" },
          { id: "b", text: "To make losses bigger" },
          { id: "c", text: "Because brokers require it" },
          { id: "d", text: "It makes no difference" },
        ],
        correct: "a",
        explanation: "Fixed-percentage sizing shrinks risk automatically as the account falls.",
        whyWrong: {
          b: "It does the opposite.",
          c: "It is your rule, not the broker's.",
          d: "Over a long streak the difference is significant.",
        },
      },
      {
        id: "fxqc4-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c4-margin-level",
        prompt: "Margin level 108% with a 100% margin call. What does it tell you?",
        options: [
          { id: "a", text: "Positions are far too large for the account" },
          { id: "b", text: "Everything is fine" },
          { id: "c", text: "Leverage should be increased" },
          { id: "d", text: "Deposit more immediately" },
        ],
        correct: "a",
        explanation: "Correct sizing keeps margin level far above the call level.",
        whyWrong: {
          b: "It is 8 points from a margin call.",
          c: "That digs deeper.",
          d: "That rescues an oversized position instead of fixing the sizing.",
        },
      },
      {
        id: "fxqc4-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c4-recovery",
        prompt: "After a 20% drawdown, what gain recovers it?",
        options: [
          { id: "a", text: "25%" },
          { id: "b", text: "20%" },
          { id: "c", text: "40%" },
          { id: "d", text: "16.7%" },
        ],
        correct: "a",
        explanation: "0.20 ÷ 0.80 = 25%.",
        whyWrong: {
          b: "20% of the smaller balance does not get back to the peak.",
          c: "That doubles it.",
          d: "That is 0.20 ÷ 1.20.",
        },
      },
    ],
  },

  "fx-c4-l2-mistakes": {
    lessonId: "fx-c4-l2-mistakes",
    passMark: 70,
    questions: [
      {
        id: "fxqc4-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-mistake-list",
        prompt: "What safeguard stops 'hidden correlated exposure'?",
        options: [
          { id: "a", text: "Per-currency and total exposure limits" },
          { id: "b", text: "More pairs" },
          { id: "c", text: "Higher leverage" },
          { id: "d", text: "A bigger target" },
        ],
        correct: "a",
        explanation: "Counting exposure by currency reveals trades that are one bet.",
        whyWrong: {
          b: "More pairs can mean more of the same bet.",
          c: "Leverage does not reduce exposure.",
          d: "Targets do not affect exposure.",
        },
      },
      {
        id: "fxqc4-6",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c4-mistake-check",
        prompt: "Long EUR/USD, long GBP/USD, short USD/CHF, long AUD/USD. What is the common exposure?",
        options: [
          { id: "a", text: "All short the US dollar" },
          { id: "b", text: "All long the dollar" },
          { id: "c", text: "Fully diversified" },
          { id: "d", text: "All long the euro" },
        ],
        correct: "a",
        explanation: "Each trade sells dollars.",
        whyWrong: {
          b: "Every trade sells the dollar.",
          c: "One currency is common to all four.",
          d: "Only one trade is long the euro.",
        },
      },
      {
        id: "fxqc4-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-mistake-list",
        prompt: "When may a circuit breaker's limit be changed?",
        options: [
          { id: "a", text: "Only at the weekly review, with a reason" },
          { id: "b", text: "Whenever it is hit" },
          { id: "c", text: "When you feel confident" },
          { id: "d", text: "Never under any circumstances" },
        ],
        correct: "a",
        explanation: "Calm review, not the moment of pressure, is when rules change.",
        whyWrong: {
          b: "That defeats the limit.",
          c: "Feelings are what the limit protects against.",
          d: "Limits may be reviewed; just not mid-session.",
        },
      },
      {
        id: "fxqc4-8",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c4-mistake-list",
        prompt: "How should a broker's regulation be verified?",
        options: [
          { id: "a", text: "On the regulator's own public register" },
          { id: "b", text: "By the logo on its website" },
          { id: "c", text: "By its advertising" },
          { id: "d", text: "By a friend's recommendation" },
        ],
        correct: "a",
        explanation: "Only the regulator's register is authoritative.",
        whyWrong: {
          b: "Logos are easily copied.",
          c: "Advertising proves nothing.",
          d: "A recommendation is not a check.",
        },
      },
    ],
  },

  "fx-c4-l3-demo-week": {
    lessonId: "fx-c4-l3-demo-week",
    passMark: 70,
    questions: [
      {
        id: "fxqc4-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c4-week-plan",
        prompt: "What is the Phase 4 demo week a rehearsal for?",
        options: [
          { id: "a", text: "The four-week practical lab" },
          { id: "b", text: "A live account" },
          { id: "c", text: "A signal service" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "It runs the whole plan exactly as the lab will.",
        whyWrong: {
          b: "The course does not prepare you to go live.",
          c: "Signals are not part of the course.",
          d: "It is a deliberate rehearsal.",
        },
      },
      {
        id: "fxqc4-10",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c4-week-rule",
        prompt: "You skipped a routine step on an unobserved trade that turned out fine. Record it as:",
        options: [
          { id: "a", text: "A process deviation with a note" },
          { id: "b", text: "Nothing" },
          { id: "c", text: "An A grade" },
          { id: "d", text: "A reason to drop the step" },
        ],
        correct: "a",
        explanation: "The journal records what you did, observed or not.",
        whyWrong: {
          b: "Unrecorded slips make the records untrustworthy.",
          c: "That grades by outcome.",
          d: "Rules change at review.",
        },
      },
      {
        id: "fxqc4-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-week-plan",
        prompt: "What do you identify at the end of the week?",
        options: [
          { id: "a", text: "The rule you found hardest to follow" },
          { id: "b", text: "The most profitable pair" },
          { id: "c", text: "The best indicator" },
          { id: "d", text: "The highest leverage used" },
        ],
        correct: "a",
        explanation: "That rule is where the lab will test you hardest.",
        whyWrong: {
          b: "A week's profit says nothing.",
          c: "Indicators are not the focus.",
          d: "Leverage stays low.",
        },
      },
      {
        id: "fxqc4-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-week-plan",
        prompt: "When is exposure checked this week?",
        options: [
          { id: "a", text: "Before every new trade" },
          { id: "b", text: "Once a month" },
          { id: "c", text: "Only after losses" },
          { id: "d", text: "Never" },
        ],
        correct: "a",
        explanation: "Each new trade can push total or per-currency exposure over the limit.",
        whyWrong: {
          b: "Too rare to prevent anything.",
          c: "Too late.",
          d: "Exposure limits are part of the plan.",
        },
      },
    ],
  },

  "fx-c4-l4-checkpoint": {
    lessonId: "fx-c4-l4-checkpoint",
    passMark: 70,
    questions: [
      {
        id: "fxqc4-13",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c4-checkpoint-format",
        prompt: "What are the two items of the Phase 4 checkpoint?",
        options: [
          { id: "a", text: "The complete trading plan and the passed theory and risk assessment" },
          { id: "b", text: "A profit target and a screenshot" },
          { id: "c", text: "A live account and a deposit" },
          { id: "d", text: "A backtest only" },
        ],
        correct: "a",
        explanation: "The lab needs both in place.",
        whyWrong: {
          b: "Neither is assessed.",
          c: "The course is demo-only.",
          d: "The backtest was the Phase 3 checkpoint.",
        },
      },
      {
        id: "fxqc4-14",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-checkpoint-ready",
        prompt: "Passing the Phase 4 checkpoint means:",
        options: [
          { id: "a", text: "You are ready for the demo-based lab" },
          { id: "b", text: "You are certified for live trading" },
          { id: "c", text: "You will be profitable" },
          { id: "d", text: "You may manage others' money" },
        ],
        correct: "a",
        explanation: "It is a step in the course, not a licence.",
        whyWrong: {
          b: "No checkpoint certifies that.",
          c: "Nothing guarantees profit.",
          d: "That requires licensing.",
        },
      },
      {
        id: "fxqc4-15",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-checkpoint-format",
        prompt: "What must be prepared before Week 13 begins?",
        options: [
          { id: "a", text: "A frozen, versioned strategy for the backtest" },
          { id: "b", text: "A new strategy from the internet" },
          { id: "c", text: "Higher leverage" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "Week 13 tests frozen rules.",
        whyWrong: {
          b: "The lab tests your own strategy.",
          c: "Leverage stays low.",
          d: "Freezing the rules is a required step.",
        },
      },
      {
        id: "fxqc4-16",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c4-checkpoint-format",
        prompt: "If you have not yet passed the Week 12 assessment, what do you do?",
        options: [
          { id: "a", text: "Retake it until you pass at 70% or above" },
          { id: "b", text: "Skip it" },
          { id: "c", text: "Start the lab anyway" },
          { id: "d", text: "Lower the pass mark" },
        ],
        correct: "a",
        explanation: "The lab assumes secure risk arithmetic.",
        whyWrong: {
          b: "It is required.",
          c: "The lab would then test something else.",
          d: "The pass mark is fixed.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
