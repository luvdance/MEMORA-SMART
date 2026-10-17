/**
 * ASSESSMENTS · FOREX TRADING · WEEK 15
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l44-lab-statistics": {
    lessonId: "fx-l44-lab-statistics",
    passMark: 70,
    questions: [
      {
        id: "fxq44-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-demo-stats",
        prompt: "Why calculate the demo statistics exactly as the backtest's?",
        options: [
          { id: "a", text: "So the two can be compared directly" },
          { id: "b", text: "Because demo statistics are more important" },
          { id: "c", text: "To make the demo look better" },
          { id: "d", text: "It does not matter how they are calculated" },
        ],
        correct: "a",
        explanation: "Same definitions, same units (R after costs): otherwise any difference could be an artefact of the method.",
        whyWrong: {
          b: "Both matter; comparison is the point.",
          c: "The aim is accuracy, not appearance.",
          d: "Different methods make comparison meaningless.",
        },
      },
      {
        id: "fxq44-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-demo-stats",
        prompt: "Ten demo trades total +1.5R. What is the expectancy?",
        options: [
          { id: "a", text: "+0.15R" },
          { id: "b", text: "+1.5R" },
          { id: "c", text: "+15R" },
          { id: "d", text: "−0.15R" },
        ],
        correct: "a",
        explanation: "1.5R ÷ 10 trades = 0.15R per trade.",
        whyWrong: {
          b: "That is the total, not the average.",
          c: "That multiplies instead of dividing.",
          d: "The total is positive.",
        },
      },
      {
        id: "fxq44-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-compare",
        prompt: "Which is NOT one of the three questions asked before concluding the demo differs from the backtest?",
        options: [
          { id: "a", text: "Did a friend's strategy do better?" },
          { id: "b", text: "Were costs higher than assumed?" },
          { id: "c", text: "Were conditions different?" },
          { id: "d", text: "Were the rules followed?" },
        ],
        correct: "a",
        explanation: "Someone else's results tell you nothing about why yours differ from your backtest.",
        whyWrong: {
          b: "Costs are one of the three.",
          c: "Market conditions are one of the three.",
          d: "Compliance is one of the three.",
        },
      },
      {
        id: "fxq44-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-compare",
        prompt: "A backtest of 60 trades is +0.20R; a 15-trade demo is −0.04R. The soundest statement is:",
        options: [
          { id: "a", text: "The demo sample is too small to judge on its own; investigate costs, conditions and compliance" },
          { id: "b", text: "The strategy no longer works" },
          { id: "c", text: "The backtest proves the demo is wrong" },
          { id: "d", text: "Fifteen trades is plenty" },
        ],
        correct: "a",
        explanation: "Small samples vary a lot by chance. The audit finds the likely cause.",
        whyWrong: {
          b: "Fifteen trades cannot show that.",
          c: "Neither proves the other wrong; they need explaining.",
          d: "Fifteen trades is far below the course's minimum sample.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l45-lab-compliance": {
    lessonId: "fx-l45-lab-compliance",
    passMark: 70,
    questions: [
      {
        id: "fxq45-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-fx-lab-adherence",
        prompt: "18 of 24 trades are graded A or B. What is the adherence rate?",
        options: [
          { id: "a", text: "75%" },
          { id: "b", text: "18%" },
          { id: "c", text: "25%" },
          { id: "d", text: "133%" },
        ],
        correct: "a",
        explanation: "18 ÷ 24 = 0.75 = 75%.",
        whyWrong: {
          b: "That is the count, not the percentage.",
          c: "That is the share of C and F trades.",
          d: "That divides the wrong way.",
        },
      },
      {
        id: "fxq45-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-split",
        prompt: "Why split results into compliant and rule-breaking trades?",
        options: [
          { id: "a", text: "To separate the strategy's performance from the effect of your behaviour" },
          { id: "b", text: "To delete the rule-breaking trades" },
          { id: "c", text: "To make the totals bigger" },
          { id: "d", text: "Because brokers require it" },
        ],
        correct: "a",
        explanation: "The split shows whether losses come from the rules or from not following them.",
        whyWrong: {
          b: "Nothing is deleted; both groups are reported.",
          c: "The total does not change.",
          d: "It is for your own review.",
        },
      },
      {
        id: "fxq45-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-lab-split-meaning",
        prompt: "Compliant trades: −0.15R over 80 trades. Rule-breaking: −0.30R over 10. What is the priority?",
        options: [
          { id: "a", text: "The strategy itself needs review, as compliant trades lose over a reasonable sample; behaviour also needs work" },
          { id: "b", text: "Only behaviour; the strategy is fine" },
          { id: "c", text: "Nothing; both are negative so they cancel out" },
          { id: "d", text: "Increase risk on compliant trades" },
        ],
        correct: "a",
        explanation: "Losing even when followed, over 80 trades, is evidence against the rules themselves.",
        whyWrong: {
          b: "Compliant trades are negative, which points at the strategy.",
          c: "Two negatives make a bigger negative, not a cancellation.",
          d: "More risk on a losing approach loses faster.",
        },
      },
      {
        id: "fxq45-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-lab-split-meaning",
        prompt: "Compliant +0.09R, rule-breaking −0.40R. Where should the next month's effort go?",
        options: [
          { id: "a", text: "Behaviour and adherence" },
          { id: "b", text: "Rewriting the entry rules" },
          { id: "c", text: "Adding indicators" },
          { id: "d", text: "Nowhere; overall it nearly broke even" },
        ],
        correct: "a",
        explanation: "The written strategy did slightly better than break-even; the losses came from breaking it.",
        whyWrong: {
          b: "Rules followed were not the problem.",
          c: "The problem is behaviour, not analysis.",
          d: "The total hides a clear, actionable split.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l46-lab-changes": {
    lessonId: "fx-l46-lab-changes",
    passMark: 70,
    questions: [
      {
        id: "fxq46-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-change-rules",
        prompt: "How many rule changes should be tested at once?",
        options: [
          { id: "a", text: "One" },
          { id: "b", text: "As many as possible" },
          { id: "c", text: "Three" },
          { id: "d", text: "None ever" },
        ],
        correct: "a",
        explanation: "One change at a time is the only way to know what its effect was.",
        whyWrong: {
          b: "Several changes together cannot be evaluated separately.",
          c: "Still too many to tell apart.",
          d: "Rules may change, through the procedure.",
        },
      },
      {
        id: "fxq46-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-change-rules",
        prompt: "A valid reason for a rule change must:",
        options: [
          { id: "a", text: "Exist independently of the results, and be tested on unseen data" },
          { id: "b", text: "Simply remove past losing trades" },
          { id: "c", text: "Come from a social media post" },
          { id: "d", text: "Make the backtest look best" },
        ],
        correct: "a",
        explanation: "A reason that only describes past losers is overfitting; a real reason predicts and survives new data.",
        whyWrong: {
          b: "That is fitting to noise.",
          c: "Popularity is not evidence.",
          d: "Optimising appearance is overfitting.",
        },
      },
      {
        id: "fxq46-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-lab-change-rules",
        prompt: "What happens to the strategy's version number after a rule change?",
        options: [
          { id: "a", text: "It changes, so results under each version can be kept apart" },
          { id: "b", text: "Nothing" },
          { id: "c", text: "It is deleted" },
          { id: "d", text: "It is reset to zero each week" },
        ],
        correct: "a",
        explanation: "Versioning keeps the evidence for v1.0 and v1.1 separate.",
        whyWrong: {
          b: "Mixing results under different rules makes them meaningless.",
          c: "The record of versions is kept.",
          d: "Versions change with rules, not with the calendar.",
        },
      },
      {
        id: "fxq46-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-lab-output-15",
        prompt: "Which must the Week 15 report include?",
        options: [
          { id: "a", text: "The compliant versus rule-breaking split" },
          { id: "b", text: "Only the winning trades" },
          { id: "c", text: "A promise of future profit" },
          { id: "d", text: "Screenshots of other traders' results" },
        ],
        correct: "a",
        explanation: "The split is the heart of the compliance report.",
        whyWrong: {
          b: "All trades are included.",
          c: "No honest report promises profit.",
          d: "Only your own records are relevant.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
