/**
 * ASSESSMENTS · FOREX TRADING · CONSOLIDATION WEEK 3
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  "fx-c3-l1-mixed-practice": {
    lessonId: "fx-c3-l1-mixed-practice",
    passMark: 70,
    questions: [
      {
        id: "fxqc3-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c3-rr",
        prompt: "A sell at 1.2700, stop 1.2730, target 1.2610. Planned R?",
        options: [
          { id: "a", text: "3R" },
          { id: "b", text: "2R" },
          { id: "c", text: "0.33R" },
          { id: "d", text: "9R" },
        ],
        correct: "a",
        explanation: "Stop 30 pips, target 90 pips: 90 ÷ 30 = 3R.",
        whyWrong: {
          b: "That would need a 60-pip target.",
          c: "That divides stop by target.",
          d: "That divides 90 by 10.",
        },
      },
      {
        id: "fxqc3-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c3-breakeven",
        prompt: "At 1R targets, what win rate breaks even before costs?",
        options: [
          { id: "a", text: "50%" },
          { id: "b", text: "33.3%" },
          { id: "c", text: "25%" },
          { id: "d", text: "66.7%" },
        ],
        correct: "a",
        explanation: "1 ÷ (1 + 1) = 50%.",
        whyWrong: {
          b: "That is for 2R.",
          c: "That is for 3R.",
          d: "That would be for a 0.5R target.",
        },
      },
      {
        id: "fxqc3-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-pf",
        prompt: "A profit factor of exactly 1.0 before costs means that after costs the strategy:",
        options: [
          { id: "a", text: "Loses money" },
          { id: "b", text: "Breaks even" },
          { id: "c", text: "Makes money" },
          { id: "d", text: "Cannot be judged" },
        ],
        correct: "a",
        explanation: "Costs are paid on every trade, so break-even before costs is a loss after them.",
        whyWrong: {
          b: "Only before costs.",
          c: "There is no surplus to pay costs from.",
          d: "The conclusion is clear.",
        },
      },
      {
        id: "fxqc3-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-c3-expectancy",
        prompt: "Win rate 35%, average win 2R, average loss 1R. Expectancy?",
        options: [
          { id: "a", text: "+0.05R" },
          { id: "b", text: "−0.05R" },
          { id: "c", text: "+0.70R" },
          { id: "d", text: "+1.35R" },
        ],
        correct: "a",
        explanation: "0.35 × 2 − 0.65 × 1 = 0.70 − 0.65 = +0.05R.",
        whyWrong: {
          b: "The sign is wrong.",
          c: "That ignores the losses.",
          d: "That adds instead of subtracting.",
        },
      },
    ],
  },

  "fx-c3-l2-mistakes": {
    lessonId: "fx-c3-l2-mistakes",
    passMark: 70,
    questions: [
      {
        id: "fxqc3-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c3-mistake-list",
        prompt: "Which tool prevents backtesting with the future visible?",
        options: [
          { id: "a", text: "Bar Replay" },
          { id: "b", text: "RSI" },
          { id: "c", text: "One-click trading" },
          { id: "d", text: "The economic calendar" },
        ],
        correct: "a",
        explanation: "Bar Replay hides future candles and reveals them one at a time.",
        whyWrong: {
          b: "An indicator does not hide the future.",
          c: "That is an order setting.",
          d: "That lists events.",
        },
      },
      {
        id: "fxqc3-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-mistake-list",
        prompt: "Placing the stop where the lot size 'works' is a mistake because:",
        options: [
          { id: "a", text: "The stop should be where the idea is invalid, then size is calculated" },
          { id: "b", text: "Stops should always be 10 pips" },
          { id: "c", text: "Stops are optional" },
          { id: "d", text: "It is not a mistake" },
        ],
        correct: "a",
        explanation: "Structure decides the stop; arithmetic decides the size.",
        whyWrong: {
          b: "A fixed distance ignores structure.",
          c: "Every trade needs a stop.",
          d: "It reverses the order of decisions.",
        },
      },
      {
        id: "fxqc3-7",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c3-mistake-check",
        prompt: "Which change would MOST improve an 18-trade, hand-picked, scrolled, cost-free backtest?",
        options: [
          { id: "a", text: "Redo it with Bar Replay over a pre-chosen 12+ months, 50+ setups, with costs" },
          { id: "b", text: "Add a filter to remove its two losers" },
          { id: "c", text: "Raise the target to 3R" },
          { id: "d", text: "Nothing; it is fine" },
        ],
        correct: "a",
        explanation: "That fixes all four flaws at once.",
        whyWrong: {
          b: "That is overfitting.",
          c: "Changing rules does not fix the test.",
          d: "It has four flaws.",
        },
      },
      {
        id: "fxqc3-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-mistake-list",
        prompt: "'Buy when price is near strong support' is a weak rule because:",
        options: [
          { id: "a", text: "'Near' and 'strong' are undefined, so two people would apply it differently" },
          { id: "b", text: "Support never works" },
          { id: "c", text: "It is too long" },
          { id: "d", text: "It does not mention RSI" },
        ],
        correct: "a",
        explanation: "Undefined words make rules subjective and untestable.",
        whyWrong: {
          b: "Support is a useful concept; the wording is the problem.",
          c: "Length is not the issue.",
          d: "Indicators are not required for a good rule.",
        },
      },
    ],
  },

  "fx-c3-l3-demo-week": {
    lessonId: "fx-c3-l3-demo-week",
    passMark: 70,
    questions: [
      {
        id: "fxqc3-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c3-week-plan",
        prompt: "What is the single focus of the Phase 3 demo week?",
        options: [
          { id: "a", text: "Doing exactly what the written strategy says" },
          { id: "b", text: "Maximising demo profit" },
          { id: "c", text: "Trying new strategies daily" },
          { id: "d", text: "Trading as often as possible" },
        ],
        correct: "a",
        explanation: "Adherence is the skill being practised.",
        whyWrong: {
          b: "Profit is not the focus.",
          c: "Strategy-hopping prevents learning.",
          d: "Frequency is not a goal.",
        },
      },
      {
        id: "fxqc3-10",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c3-week-rule",
        prompt: "Your rules do not cover a situation. What is the default?",
        options: [
          { id: "a", text: "No trade, and note it for review" },
          { id: "b", text: "Trade, since nothing forbids it" },
          { id: "c", text: "Change the rule on the spot" },
          { id: "d", text: "Double size to compensate" },
        ],
        correct: "a",
        explanation: "Silence in the rules means no trade.",
        whyWrong: {
          b: "That is trading without rules.",
          c: "Rules change only in review.",
          d: "Size never compensates for uncertainty.",
        },
      },
      {
        id: "fxqc3-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-week-plan",
        prompt: "Why prefer pending orders and alerts this week?",
        options: [
          { id: "a", text: "So the platform waits for your levels instead of you watching every tick" },
          { id: "b", text: "Because market orders are banned" },
          { id: "c", text: "Pending orders always win" },
          { id: "d", text: "They have no spread" },
        ],
        correct: "a",
        explanation: "They reduce screen time and impulsive decisions.",
        whyWrong: {
          b: "Market orders are allowed where the rules call for them.",
          c: "No order type always wins.",
          d: "All orders pay the spread.",
        },
      },
      {
        id: "fxqc3-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-week-plan",
        prompt: "What do you count at the end of the week?",
        options: [
          { id: "a", text: "Trades that passed every checklist item versus trades actually taken" },
          { id: "b", text: "Only profitable trades" },
          { id: "c", text: "Hours spent on charts" },
          { id: "d", text: "Indicators used" },
        ],
        correct: "a",
        explanation: "The gap between the two is your rule-breaking rate.",
        whyWrong: {
          b: "Outcomes are not the measure.",
          c: "Time is not the measure.",
          d: "Tool count is not the measure.",
        },
      },
    ],
  },

  "fx-c3-l4-checkpoint": {
    lessonId: "fx-c3-l4-checkpoint",
    passMark: 70,
    questions: [
      {
        id: "fxqc3-13",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c3-checkpoint-format",
        prompt: "What is the swap test?",
        options: [
          { id: "a", text: "Another learner applies your written strategy to the same chart independently, and you compare" },
          { id: "b", text: "Checking your broker's swap rates" },
          { id: "c", text: "Swapping demo accounts" },
          { id: "d", text: "Trading two pairs at once" },
        ],
        correct: "a",
        explanation: "It tests whether the rules, not your judgement, produce the trades.",
        whyWrong: {
          b: "Overnight swaps are a different topic.",
          c: "Accounts are not exchanged.",
          d: "It is about rules, not pairs.",
        },
      },
      {
        id: "fxqc3-14",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-checkpoint-format",
        prompt: "What agreement does the swap test require?",
        options: [
          { id: "a", text: "At least 80% of setups match" },
          { id: "b", text: "50%" },
          { id: "c", text: "Any agreement" },
          { id: "d", text: "100% of profitable trades" },
        ],
        correct: "a",
        explanation: "80% shows the rules are clear enough to test.",
        whyWrong: {
          b: "Too low to show clear rules.",
          c: "There is a standard.",
          d: "Profit is not involved.",
        },
      },
      {
        id: "fxqc3-15",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c3-checkpoint-swap",
        prompt: "All your swap-test disagreements involve one phrase. What do you do?",
        options: [
          { id: "a", text: "Define the phrase precisely, version the strategy and repeat" },
          { id: "b", text: "Ignore the disagreements" },
          { id: "c", text: "Find a different partner" },
          { id: "d", text: "Drop the backtest" },
        ],
        correct: "a",
        explanation: "The phrase is the cause; fixing it fixes the test.",
        whyWrong: {
          b: "They reveal a real flaw.",
          c: "Another partner would find the same ambiguity.",
          d: "The backtest is still needed.",
        },
      },
      {
        id: "fxqc3-16",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c3-checkpoint-format",
        prompt: "Why must the swap test pass before trusting a backtest?",
        options: [
          { id: "a", text: "If two people get different trades from the same rules, the backtest tests one person's judgement" },
          { id: "b", text: "Because backtests are optional" },
          { id: "c", text: "Because partners must agree on profit" },
          { id: "d", text: "There is no connection" },
        ],
        correct: "a",
        explanation: "Testable rules must produce the same trades for anyone.",
        whyWrong: {
          b: "The backtest is required.",
          c: "Profit is not compared.",
          d: "Clear rules are a precondition of a meaningful test.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
