/**
 * ASSESSMENTS · FOREX TRADING · WEEK 16
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l47-final-plan": {
    lessonId: "fx-l47-final-plan",
    passMark: 70,
    questions: [
      {
        id: "fxq47-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-final-plan-contents",
        prompt: "Which section is NEW in the final plan compared with Week 12?",
        options: [
          { id: "a", text: "Version history, evidence summary and personal rules" },
          { id: "b", text: "Risk per trade" },
          { id: "c", text: "Strategy rules" },
          { id: "d", text: "When not to trade" },
        ],
        correct: "a",
        explanation: "The final plan adds what the lab revealed: how the strategy changed, the evidence and your personal rules.",
        whyWrong: {
          b: "Risk per trade was already in the Week 12 plan.",
          c: "Strategy rules were already there.",
          d: "That was section 11 in Week 12.",
        },
      },
      {
        id: "fxq47-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-final-plan-consistency",
        prompt: "Your plan says 1% risk, but your journal shows several trades at 3%. What does the consistency check find?",
        options: [
          { id: "a", text: "A failure that must be addressed openly, not hidden" },
          { id: "b", text: "Nothing; the plan is what matters" },
          { id: "c", text: "A reason to change the plan to 3%" },
          { id: "d", text: "A reason to delete those trades" },
        ],
        correct: "a",
        explanation: "Plans and records must agree. Breaches are discussed honestly in the case study.",
        whyWrong: {
          b: "Records are what show whether the plan was followed.",
          c: "Rewriting the plan to fit breaches hides them.",
          d: "Deleting records fails the accuracy requirement.",
        },
      },
      {
        id: "fxq47-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-final-plan-contents",
        prompt: "What is a good 'personal rule'?",
        options: [
          { id: "a", text: "A specific rule targeting your own most common error, such as closing the platform after two losses" },
          { id: "b", text: "'Trade better'" },
          { id: "c", text: "'Make 10% a month'" },
          { id: "d", text: "'Follow the best signal group'" },
        ],
        correct: "a",
        explanation: "Personal rules are specific and aimed at the behaviour your records show causes most harm.",
        whyWrong: {
          b: "Too vague to follow.",
          c: "A profit target is not a rule you control.",
          d: "That replaces your process with someone else's.",
        },
      },
      {
        id: "fxq47-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-final-plan-consistency",
        prompt: "Which rules should the final plan's strategy section contain?",
        options: [
          { id: "a", text: "The rules actually tested, with any change recorded in the version history" },
          { id: "b", text: "New rules written this week and never tested" },
          { id: "c", text: "Rules copied from an online course" },
          { id: "d", text: "Whatever sounds most impressive" },
        ],
        correct: "a",
        explanation: "The plan must describe the strategy your evidence relates to.",
        whyWrong: {
          b: "Untested rules have no evidence behind them.",
          c: "Your evidence relates to your own rules.",
          d: "Assessors check substance, not impression.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l48-case-study": {
    lessonId: "fx-l48-case-study",
    passMark: 70,
    questions: [
      {
        id: "fxq48-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-case-structure",
        prompt: "How many worked trades does the case study include?",
        options: [
          { id: "a", text: "Two: one rule-following and one rule-breaking" },
          { id: "b", text: "One: the best winner" },
          { id: "c", text: "All of them" },
          { id: "d", text: "None" },
        ],
        correct: "a",
        explanation: "One of each shows both the process working and the most typical error.",
        whyWrong: {
          b: "A single flattering trade teaches nothing.",
          c: "All trades are in the journal; the case study works through two in depth.",
          d: "Worked trades are where risk calculations are checked.",
        },
      },
      {
        id: "fxq48-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-case-structure",
        prompt: "What must the analysis section show?",
        options: [
          { id: "a", text: "Adherence, the compliant versus rule-breaking split, and costs" },
          { id: "b", text: "Only total profit" },
          { id: "c", text: "Predictions for next year" },
          { id: "d", text: "Other traders' results" },
        ],
        correct: "a",
        explanation: "The analysis connects behaviour to results, which is the point of the lab.",
        whyWrong: {
          b: "Totals hide the split.",
          c: "No predictions are required or appropriate.",
          d: "Only your own evidence is relevant.",
        },
      },
      {
        id: "fxq48-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-case-trade-choice",
        prompt: "Which is the best rule-following example?",
        options: [
          { id: "a", text: "A −1R loss with every rule followed exactly" },
          { id: "b", text: "A +3R win after entering early" },
          { id: "c", text: "A +2R win on oversized risk" },
          { id: "d", text: "A trade from someone else's journal" },
        ],
        correct: "a",
        explanation: "A clean loss shows the process working regardless of outcome.",
        whyWrong: {
          b: "Entering early broke a rule.",
          c: "Oversized risk broke a rule.",
          d: "It must be your own trade.",
        },
      },
      {
        id: "fxq48-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-case-trade-choice",
        prompt: "Which rule-breaking trade should you choose?",
        options: [
          { id: "a", text: "Your most typical error" },
          { id: "b", text: "Your most dramatic loss" },
          { id: "c", text: "None; leave rule breaks out" },
          { id: "d", text: "One that made money, to balance the story" },
        ],
        correct: "a",
        explanation: "The typical error is the one most worth understanding and fixing.",
        whyWrong: {
          b: "Drama is not the same as relevance.",
          c: "Leaving breaches out fails the honesty standard.",
          d: "Choosing by outcome misses the point.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l49-presentation": {
    lessonId: "fx-l49-presentation",
    passMark: 70,
    questions: [
      {
        id: "fxq49-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-graduation-standard",
        prompt: "Which is NOT part of the graduation standard?",
        options: [
          { id: "a", text: "Making a profit on the demo account" },
          { id: "b", text: "Sound risk calculations" },
          { id: "c", text: "Accurate records" },
          { id: "d", text: "Following predefined rules" },
        ],
        correct: "a",
        explanation: "Profit alone never decides whether a learner passes.",
        whyWrong: {
          b: "Risk calculation is one of the four requirements.",
          c: "Accurate records are one of the four.",
          d: "Rule adherence is one of the four.",
        },
      },
      {
        id: "fxq49-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-graduation-standard",
        prompt: "A learner made +40% on demo using 10% risk per trade and has gaps in their journal. Do they meet the standard?",
        options: [
          { id: "a", text: "No: risk calculations, records and adherence all fail, whatever the profit" },
          { id: "b", text: "Yes: +40% proves skill" },
          { id: "c", text: "Yes, if they promise to use 1% in future" },
          { id: "d", text: "Only if the profit is above 50%" },
        ],
        correct: "a",
        explanation: "Large profit from forbidden risk and incomplete records is luck, and the standard is designed to tell the difference.",
        whyWrong: {
          b: "Profit is not one of the four requirements.",
          c: "The standard assesses what was done, not promises.",
          d: "No profit level changes the requirements.",
        },
      },
      {
        id: "fxq49-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-what-graduation-means",
        prompt: "What does graduating from this course mean?",
        options: [
          { id: "a", text: "You understand the market, control risk, test strategies and keep honest records; it does not mean you are ready for live trading or will be profitable" },
          { id: "b", text: "You are certified to trade real money" },
          { id: "c", text: "You will be consistently profitable" },
          { id: "d", text: "You can manage other people's money" },
        ],
        correct: "a",
        explanation: "The course certifies knowledge and process, and is explicit that it promises neither profitability nor live readiness.",
        whyWrong: {
          b: "The course explicitly does not certify live readiness.",
          c: "No course can honestly promise that.",
          d: "Managing others' money needs licensing far beyond this course.",
        },
      },
      {
        id: "fxq49-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-presentation",
        prompt: "Why does the presentation include questions you did not prepare for?",
        options: [
          { id: "a", text: "Answering them shows you understand your process rather than having copied it" },
          { id: "b", text: "To trick you into failing" },
          { id: "c", text: "To test your public-speaking style" },
          { id: "d", text: "To predict the market together" },
        ],
        correct: "a",
        explanation: "Applying your rules to a new chart or situation, out loud, is strong evidence of understanding.",
        whyWrong: {
          b: "The questions are about your own plan, not tricks.",
          c: "Content, not style, is assessed.",
          d: "Prediction is not part of the assessment.",
        },
      },
      {
        id: "fxq49-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-final-output",
        prompt: "How are the three final outputs assessed?",
        options: [
          { id: "a", text: "Together, against the four parts of the graduation standard" },
          { id: "b", text: "Only the presentation counts" },
          { id: "c", text: "By the demo account balance" },
          { id: "d", text: "By the length of the documents" },
        ],
        correct: "a",
        explanation: "Plan, case study and presentation are judged together on risk, strategy, records and adherence.",
        whyWrong: {
          b: "All three are required.",
          c: "The balance is not a criterion.",
          d: "Quality and honesty count, not length.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
