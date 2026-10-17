/**
 * ASSESSMENTS · FOREX TRADING · WEEK 13
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l38-lab-prepare": {
    lessonId: "fx-l38-lab-prepare",
    passMark: 70,
    questions: [
      {
        id: "fxq38-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-freeze",
        prompt: "During the backtest you think of an improvement to a rule. What do you do?",
        options: [
          { id: "a", text: "Write it on the ideas list and keep testing the frozen rules" },
          { id: "b", text: "Apply it from this trade onwards" },
          { id: "c", text: "Apply it and re-test only the losing trades" },
          { id: "d", text: "Stop the backtest" },
        ],
        correct: "a",
        explanation: "Rules stay frozen until the test ends. Ideas are reviewed in Week 15 and tested on new data.",
        whyWrong: {
          b: "A test of changing rules measures nothing in particular.",
          c: "That uses outcomes to choose which trades get the new rule.",
          d: "The test should be finished as designed.",
        },
      },
      {
        id: "fxq38-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-period",
        prompt: "What is out-of-sample data for?",
        options: [
          { id: "a", text: "A single final test of the frozen rules on data never used to build them" },
          { id: "b", text: "Extra trades to make the sample bigger" },
          { id: "c", text: "Tuning settings until results are positive" },
          { id: "d", text: "Nothing; it is discarded" },
        ],
        correct: "a",
        explanation: "Data the strategy has never seen reveals whether results came from a real pattern or from fitting.",
        whyWrong: {
          b: "Merging it in removes its purpose.",
          c: "Tuning on it destroys its value.",
          d: "It is used, once, at the end.",
        },
      },
      {
        id: "fxq38-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-period",
        prompt: "Which test period is best?",
        options: [
          { id: "a", text: "Twelve months or more, chosen in advance, including trends and ranges" },
          { id: "b", text: "The three months where the strategy clearly worked" },
          { id: "c", text: "One week" },
          { id: "d", text: "Only the most volatile days" },
        ],
        correct: "a",
        explanation: "A long, varied, pre-chosen period shows how the strategy behaves in different conditions.",
        whyWrong: {
          b: "Choosing a period after seeing it worked biases the result.",
          c: "Far too small a sample.",
          d: "One kind of condition only.",
        },
      },
      {
        id: "fxq38-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-template",
        prompt: "What is the 'doubt' column for?",
        options: [
          { id: "a", text: "Flagging setups where applying a rule took judgement, so their effect can be checked later" },
          { id: "b", text: "Recording which trades you think will lose" },
          { id: "c", text: "Listing trades to delete" },
          { id: "d", text: "Nothing important" },
        ],
        correct: "a",
        explanation: "If removing doubtful trades changes the result, the edge depends on judgement and a rule needs clarifying.",
        whyWrong: {
          b: "Predictions of outcome have no place in the log.",
          c: "No qualifying trade is deleted.",
          d: "It is one of the three honesty checks.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l39-lab-run": {
    lessonId: "fx-l39-lab-run",
    passMark: 70,
    questions: [
      {
        id: "fxq39-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-logging",
        prompt: "When is a setup's row logged?",
        options: [
          { id: "a", text: "When the checklist is all 'yes', before revealing any more candles" },
          { id: "b", text: "After seeing whether it won" },
          { id: "c", text: "At the end of the week, from memory" },
          { id: "d", text: "Only if it looks like a good trade" },
        ],
        correct: "a",
        explanation: "Logging before the outcome keeps the result from influencing what is recorded.",
        whyWrong: {
          b: "Seeing the outcome first invites bias.",
          c: "Memory is selective.",
          d: "Every qualifying setup is logged.",
        },
      },
      {
        id: "fxq39-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-logging",
        prompt: "Entry 1.0900, stop 1.0870, target 1.0975 on a buy. What is the planned R?",
        options: [
          { id: "a", text: "2.5R" },
          { id: "b", text: "2.0R" },
          { id: "c", text: "3.0R" },
          { id: "d", text: "0.4R" },
        ],
        correct: "a",
        explanation: "Target 75 pips ÷ stop 30 pips = 2.5R.",
        whyWrong: {
          b: "That would need a 60-pip target.",
          c: "That would need a 90-pip target.",
          d: "That divides stop by target.",
        },
      },
      {
        id: "fxq39-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-doubt",
        prompt: "A trigger candle's wick is 58% of its range; the rule requires 60%. How is it recorded?",
        options: [
          { id: "a", text: "Not qualifying; noted as a near-miss" },
          { id: "b", text: "Qualifying, because it is close" },
          { id: "c", text: "Qualifying only if it won" },
          { id: "d", text: "Rule changed to 55%" },
        ],
        correct: "a",
        explanation: "Rules are applied literally during the test.",
        whyWrong: {
          b: "'Close' silently changes the rule.",
          c: "Outcome-based inclusion is bias.",
          d: "Rules are frozen until the end.",
        },
      },
      {
        id: "fxq39-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-doubt",
        prompt: "Why record near-misses?",
        options: [
          { id: "a", text: "To see later whether a threshold makes a difference" },
          { id: "b", text: "To add them to the results if needed" },
          { id: "c", text: "Because they always win" },
          { id: "d", text: "There is no reason" },
        ],
        correct: "a",
        explanation: "Near-misses are evidence about whether a rule's exact threshold matters, for the Week 15 review.",
        whyWrong: {
          b: "They are not qualifying trades and are never added to the results.",
          c: "They have no special outcome.",
          d: "They inform rule review.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l40-lab-summarise": {
    lessonId: "fx-l40-lab-summarise",
    passMark: 70,
    questions: [
      {
        id: "fxq40-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-summary",
        prompt: "A 50-trade sample has gross wins of 30R and gross losses of 25R. What is the profit factor?",
        options: [
          { id: "a", text: "1.2" },
          { id: "b", text: "0.83" },
          { id: "c", text: "5" },
          { id: "d", text: "55" },
        ],
        correct: "a",
        explanation: "30 ÷ 25 = 1.2.",
        whyWrong: {
          b: "That divides losses by wins.",
          c: "That is the net result in R.",
          d: "That adds the two.",
        },
      },
      {
        id: "fxq40-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-honesty",
        prompt: "Which is NOT one of the three honesty checks?",
        options: [
          { id: "a", text: "Removing the five largest losses to see the 'true' result" },
          { id: "b", text: "Confirming no qualifying setup is missing" },
          { id: "c", text: "Recalculating without the doubt trades" },
          { id: "d", text: "One run on the out-of-sample period" },
        ],
        correct: "a",
        explanation: "Removing losers is the opposite of an honesty check.",
        whyWrong: {
          b: "That is the completeness check.",
          c: "That is the doubt check.",
          d: "That is the out-of-sample check.",
        },
      },
      {
        id: "fxq40-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-lab-honesty",
        prompt: "The sample is positive, but negative without doubt trades and negative out of sample. The honest conclusion?",
        options: [
          { id: "a", text: "The edge is unproven; report all three figures" },
          { id: "b", text: "The strategy works; report the full-sample figure" },
          { id: "c", text: "Hide the out-of-sample figure" },
          { id: "d", text: "Add filters until all three are positive" },
        ],
        correct: "a",
        explanation: "An honest report shows every check. That is what the lab assesses.",
        whyWrong: {
          b: "That reports only the flattering number.",
          c: "Hiding evidence fails the honesty standard.",
          d: "That is overfitting.",
        },
      },
      {
        id: "fxq40-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-output-13",
        prompt: "What is the Week 13 output assessed on?",
        options: [
          { id: "a", text: "Completeness, accuracy and honesty" },
          { id: "b", text: "Whether the results are positive" },
          { id: "c", text: "The number of winning trades" },
          { id: "d", text: "How quickly it was finished" },
        ],
        correct: "a",
        explanation: "The lab assesses process. Profit alone never decides a pass.",
        whyWrong: {
          b: "A well-documented negative result passes.",
          c: "Win counts are outcomes.",
          d: "Speed is irrelevant.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
