/**
 * ASSESSMENTS · FOREX TRADING · WEEK 14
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l41-lab-routine": {
    lessonId: "fx-l41-lab-routine",
    passMark: 70,
    questions: [
      {
        id: "fxq41-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-before",
        prompt: "Which belongs in the BEFORE-session routine?",
        options: [
          { id: "a", text: "Checking the economic calendar and setting alerts on your zones" },
          { id: "b", text: "Grading the day's trades" },
          { id: "c", text: "Reconciling with the History tab" },
          { id: "d", text: "Writing tomorrow's improvement" },
        ],
        correct: "a",
        explanation: "Preparation happens first: news times, updated zones and alerts.",
        whyWrong: {
          b: "Grading is after the session.",
          c: "Reconciliation is after the session.",
          d: "That is the last step after the session.",
        },
      },
      {
        id: "fxq41-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-during",
        prompt: "An alert fires, but you cannot work the full checklist for 40 minutes. What happens?",
        options: [
          { id: "a", text: "No trade unless the setup is still valid when you can check it properly" },
          { id: "b", text: "A quick market order from the phone" },
          { id: "c", text: "A trade at double size to make up for the delay" },
          { id: "d", text: "Ask a friend to place it" },
        ],
        correct: "a",
        explanation: "A setup you cannot check properly is not a trade.",
        whyWrong: {
          b: "That skips the steps that prevent errors.",
          c: "Size is set by risk, never by circumstance.",
          d: "Your account and decisions are your own responsibility.",
        },
      },
      {
        id: "fxq41-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-after",
        prompt: "After the session, what is graded first?",
        options: [
          { id: "a", text: "Each trade's process, before thinking about results" },
          { id: "b", text: "The day's profit" },
          { id: "c", text: "The broker's spreads" },
          { id: "d", text: "Nothing; grading is weekly" },
        ],
        correct: "a",
        explanation: "Process is graded before results so the outcome cannot colour the grade.",
        whyWrong: {
          b: "Profit is not the assessment measure.",
          c: "Spreads are measured, not graded.",
          d: "Grading is done daily in the lab.",
        },
      },
      {
        id: "fxq41-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-before",
        prompt: "Why write a one-line state check before the session?",
        options: [
          { id: "a", text: "To notice when you are tired or stressed, which your plan may say is a reason not to trade" },
          { id: "b", text: "Because the broker asks for it" },
          { id: "c", text: "To predict the market" },
          { id: "d", text: "It has no purpose" },
        ],
        correct: "a",
        explanation: "Your state affects your decisions, and recording it builds the evidence for Week 11's patterns.",
        whyWrong: {
          b: "It is for you, not the broker.",
          c: "Your mood says nothing about the market.",
          d: "It is how emotional patterns become visible.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l42-lab-journal": {
    lessonId: "fx-l42-lab-journal",
    passMark: 70,
    questions: [
      {
        id: "fxq42-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-journal-timing",
        prompt: "When is the emotional state recorded?",
        options: [
          { id: "a", text: "At entry" },
          { id: "b", text: "At the end of the month" },
          { id: "c", text: "Only after losses" },
          { id: "d", text: "Never" },
        ],
        correct: "a",
        explanation: "The state before entry is the one that influenced the decision.",
        whyWrong: {
          b: "By then it would be guessed.",
          c: "That would bias the record towards losses.",
          d: "It is a required column.",
        },
      },
      {
        id: "fxq42-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-journal-timing",
        prompt: "What goes in a no-trade note?",
        options: [
          { id: "a", text: "Time, pair and which checklist item failed" },
          { id: "b", text: "Nothing; no trade means no note" },
          { id: "c", text: "The profit you would have made" },
          { id: "d", text: "A screenshot of someone else's trade" },
        ],
        correct: "a",
        explanation: "No-trade notes show how often each rule keeps you out, which is evidence about your discipline and your filters.",
        whyWrong: {
          b: "Decisions not to trade are part of the record.",
          c: "That invites regret, not learning.",
          d: "Other people's trades are irrelevant.",
        },
      },
      {
        id: "fxq42-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-journal-accuracy",
        prompt: "Reconciling, you find an unrecorded impulse trade in MT5's History. What do you do?",
        options: [
          { id: "a", text: "Record it, marked as after the fact, grade it F and note the cause" },
          { id: "b", text: "Leave it out" },
          { id: "c", text: "Record it as an A trade" },
          { id: "d", text: "Reset the account" },
        ],
        correct: "a",
        explanation: "Accurate records include every trade the account made, especially the unplanned ones.",
        whyWrong: {
          b: "That makes the journal false.",
          c: "That falsifies the grade.",
          d: "That destroys the record.",
        },
      },
      {
        id: "fxq42-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-journal-accuracy",
        prompt: "What must match during the daily reconciliation?",
        options: [
          { id: "a", text: "Every platform trade appears in the journal with the same prices, volume and result, and the balances agree" },
          { id: "b", text: "Only the number of trades" },
          { id: "c", text: "Only the winning trades" },
          { id: "d", text: "Nothing; reconciliation is optional" },
        ],
        correct: "a",
        explanation: "Full agreement between journal and platform is what makes the journal trustworthy evidence.",
        whyWrong: {
          b: "Counts can match while details are wrong.",
          c: "Losers matter just as much.",
          d: "It is part of the required output.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l43-lab-execution": {
    lessonId: "fx-l43-lab-execution",
    passMark: 70,
    questions: [
      {
        id: "fxq43-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-slippage",
        prompt: "A sell-stop was planned at 1.26000 and filled at 1.25988. What was the slippage?",
        options: [
          { id: "a", text: "1.2 pips worse" },
          { id: "b", text: "1.2 pips better" },
          { id: "c", text: "12 pips worse" },
          { id: "d", text: "None" },
        ],
        correct: "a",
        explanation: "On a sell, a lower fill is worse: 1.26000 − 1.25988 = 0.00012 = 1.2 pips.",
        whyWrong: {
          b: "Selling lower than planned is worse, not better.",
          c: "0.00012 is 1.2 pips, not 12.",
          d: "The fill differs from the plan.",
        },
      },
      {
        id: "fxq43-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-lab-cross-ticket",
        prompt: "On EUR/GBP with GBP/USD at 1.2640, a 25-pip stop at 0.04 lots risks how much?",
        options: [
          { id: "a", text: "$12.64" },
          { id: "b", text: "$10.00" },
          { id: "c", text: "$1.26" },
          { id: "d", text: "$126.40" },
        ],
        correct: "a",
        explanation: "25 pips × $12.64 per lot × 0.04 = $12.64.",
        whyWrong: {
          b: "That assumes $10 a pip, which only applies to USD-quoted pairs.",
          c: "A factor of ten too small.",
          d: "That would be 0.40 lots.",
        },
      },
      {
        id: "fxq43-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-slippage",
        prompt: "What do you do with the week's average slippage?",
        options: [
          { id: "a", text: "Compare it with the cost assumption in your backtest" },
          { id: "b", text: "Ignore it" },
          { id: "c", text: "Use it to move stops further away" },
          { id: "d", text: "Subtract it from your losses only" },
        ],
        correct: "a",
        explanation: "If real costs exceed the backtest's assumption, the backtest overstated the edge.",
        whyWrong: {
          b: "It is part of the required output.",
          c: "Stops are set by structure, not by slippage.",
          d: "Slippage affects every trade.",
        },
      },
      {
        id: "fxq43-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-output-14",
        prompt: "A learner's Week 14 journal has three trades and fifteen no-trade notes, all accurate. Is the output complete?",
        options: [
          { id: "a", text: "Yes: the number of trades does not matter, accuracy does" },
          { id: "b", text: "No: at least twenty trades are required" },
          { id: "c", text: "No: no-trade notes do not count" },
          { id: "d", text: "Only if the three trades won" },
        ],
        correct: "a",
        explanation: "The output is assessed on accurate, real-time records, not on activity or profit.",
        whyWrong: {
          b: "No minimum trade count exists; forcing trades would break the plan.",
          c: "No-trade notes are part of the journal.",
          d: "Profit never decides the pass.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
