/**
 * ASSESSMENTS · FOREX TRADING · CONSOLIDATION WEEK 1
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  "fx-c1-l1-mixed-practice": {
    lessonId: "fx-c1-l1-mixed-practice",
    passMark: 70,
    questions: [
      {
        id: "fxqc1-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-movement",
        prompt: "GBP/JPY moves from 190.250 to 189.730. How many pips, with sign?",
        options: [
          { id: "a", text: "−52 pips" },
          { id: "b", text: "−5.2 pips" },
          { id: "c", text: "−5,200 pips" },
          { id: "d", text: "+52 pips" },
        ],
        correct: "a",
        explanation: "189.730 − 190.250 = −0.520; yen pip 0.01 → −52 pips.",
        whyWrong: {
          b: "That uses the wrong decimal place for a yen pair.",
          c: "That uses 0.0001 as the pip size on a yen pair.",
          d: "Price fell, so the movement is negative.",
        },
      },
      {
        id: "fxqc1-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-pip-value",
        prompt: "Which pair needs its pip value DIVIDED by the price to convert to dollars?",
        options: [
          { id: "a", text: "USD/CHF" },
          { id: "b", text: "EUR/USD" },
          { id: "c", text: "EUR/GBP" },
          { id: "d", text: "AUD/USD" },
        ],
        correct: "a",
        explanation: "When USD is the base, the pip is in the quote currency and is converted by dividing by the price.",
        whyWrong: {
          b: "USD is the quote: $10 per lot directly.",
          c: "A cross: multiply by the quote currency's USD rate (GBP/USD).",
          d: "USD is the quote: $10 per lot directly.",
        },
      },
      {
        id: "fxqc1-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-margin",
        prompt: "At 1:30, 0.10 lots of EUR/USD at 1.0800 needs what margin?",
        options: [
          { id: "a", text: "$360" },
          { id: "b", text: "$36" },
          { id: "c", text: "$3,600" },
          { id: "d", text: "$10,800" },
        ],
        correct: "a",
        explanation: "Notional 10,000 × 1.08 = $10,800; ÷ 30 = $360.",
        whyWrong: {
          b: "A factor of ten too small.",
          c: "A factor of ten too big.",
          d: "That is the notional value, not the margin.",
        },
      },
      {
        id: "fxqc1-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-c1-size",
        prompt: "Balance $800, risk 1%, stop 20 pips on GBP/USD. What lot size?",
        options: [
          { id: "a", text: "0.04" },
          { id: "b", text: "0.40" },
          { id: "c", text: "0.08" },
          { id: "d", text: "0.02" },
        ],
        correct: "a",
        explanation: "$8 ÷ (20 × $10) = 0.04 lots.",
        whyWrong: {
          b: "That risks $80, 10%.",
          c: "That risks $16, 2%.",
          d: "That risks $4, 0.5%.",
        },
      },
    ],
  },

  "fx-c1-l2-mistakes": {
    lessonId: "fx-c1-l2-mistakes",
    passMark: 70,
    questions: [
      {
        id: "fxqc1-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c1-mistake-list",
        prompt: "Which habit prevents reading a pair backwards?",
        options: [
          { id: "a", text: "Saying 'I am buying the first currency' before every trade" },
          { id: "b", text: "Using higher leverage" },
          { id: "c", text: "Trading only exotics" },
          { id: "d", text: "Ignoring the quote currency" },
        ],
        correct: "a",
        explanation: "Naming the base currency out loud makes the direction of the bet explicit.",
        whyWrong: {
          b: "Leverage has nothing to do with reading a pair.",
          c: "Exotics are read the same way and are harder to trade.",
          d: "The quote currency matters for understanding the price.",
        },
      },
      {
        id: "fxqc1-6",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-mistake-check",
        prompt: "At USD/JPY 150, what is one pip worth on 0.10 lots?",
        options: [
          { id: "a", text: "About $0.67" },
          { id: "b", text: "$1.00" },
          { id: "c", text: "$10.00" },
          { id: "d", text: "$6.67" },
        ],
        correct: "a",
        explanation: "¥1,000 per lot ÷ 150 = $6.67 per lot; × 0.10 = $0.67.",
        whyWrong: {
          b: "That assumes the USD-quote rule.",
          c: "That is the EUR/USD value for a full lot.",
          d: "That is for a full lot, not 0.10.",
        },
      },
      {
        id: "fxqc1-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c1-mistake-list",
        prompt: "Why is 'my leverage is 1:500' never a reason a risk is acceptable?",
        options: [
          { id: "a", text: "Leverage only allows bigger positions; the loss depends on size and stop" },
          { id: "b", text: "Because 1:500 is illegal" },
          { id: "c", text: "Because leverage reduces losses" },
          { id: "d", text: "It is a good reason" },
        ],
        correct: "a",
        explanation: "Leverage changes the margin needed, not the money lost per pip.",
        whyWrong: {
          b: "It is available in some jurisdictions; legality is not the issue.",
          c: "Leverage does not reduce losses.",
          d: "It says nothing about whether the risk fits the account.",
        },
      },
      {
        id: "fxqc1-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c1-mistake-list",
        prompt: "What is the correct order of decisions?",
        options: [
          { id: "a", text: "Stop from structure, then size from the formula" },
          { id: "b", text: "Size first, then fit a stop to it" },
          { id: "c", text: "Size from leverage, no stop" },
          { id: "d", text: "Target first, then decide the stop to make 3R" },
        ],
        correct: "a",
        explanation: "The stop goes where the idea is wrong; size is calculated so that stop costs the planned risk.",
        whyWrong: {
          b: "That places stops where they are affordable, not where they make sense.",
          c: "No stop means no limit on the loss.",
          d: "Bending the stop to manufacture a ratio ignores structure.",
        },
      },
    ],
  },

  "fx-c1-l3-demo-week": {
    lessonId: "fx-c1-l3-demo-week",
    passMark: 70,
    questions: [
      {
        id: "fxqc1-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c1-week-plan",
        prompt: "What is the purpose of the Phase 1 demo week?",
        options: [
          { id: "a", text: "Making sizing automatic on every kind of pair" },
          { id: "b", text: "Making as much demo profit as possible" },
          { id: "c", text: "Testing a strategy" },
          { id: "d", text: "Trying the highest leverage" },
        ],
        correct: "a",
        explanation: "There is no strategy yet; the week drills mechanics and arithmetic.",
        whyWrong: {
          b: "Without an edge, profit is luck.",
          c: "The strategy comes in Phase 3.",
          d: "Leverage is kept low throughout.",
        },
      },
      {
        id: "fxqc1-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-c1-week-plan",
        prompt: "Why rotate across EUR/USD, USD/JPY, EUR/GBP and USD/CAD?",
        options: [
          { id: "a", text: "To meet every pip-value case in practice" },
          { id: "b", text: "Because one of them is guaranteed to win" },
          { id: "c", text: "To increase total risk" },
          { id: "d", text: "No reason" },
        ],
        correct: "a",
        explanation: "USD-quote, USD-base and cross pairs each need a different conversion.",
        whyWrong: {
          b: "No pair is guaranteed to win.",
          c: "Risk per trade stays at 1%.",
          d: "The rotation is deliberate.",
        },
      },
      {
        id: "fxqc1-11",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-week-rule",
        prompt: "No calculator to hand. What is the right approach?",
        options: [
          { id: "a", text: "Work the formula by hand before entering" },
          { id: "b", text: "Enter now, calculate later" },
          { id: "c", text: "Use the platform's default volume" },
          { id: "d", text: "Guess" },
        ],
        correct: "a",
        explanation: "The formula is the skill; the calculator is a convenience.",
        whyWrong: {
          b: "Calculating after entry is the habit being replaced.",
          c: "The default volume belongs to no particular trade.",
          d: "Guessing risk is not risk management.",
        },
      },
      {
        id: "fxqc1-12",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c1-week-rule",
        prompt: "When is the pre-trade calculation written?",
        options: [
          { id: "a", text: "Before the order is placed" },
          { id: "b", text: "After the trade closes" },
          { id: "c", text: "Only for large trades" },
          { id: "d", text: "Only on the laptop" },
        ],
        correct: "a",
        explanation: "No trade is placed until the written calculation exists.",
        whyWrong: {
          b: "Too late to control the risk.",
          c: "Every trade, whatever the size.",
          d: "It can be done anywhere, by hand.",
        },
      },
    ],
  },

  "fx-c1-l4-checkpoint": {
    lessonId: "fx-c1-l4-checkpoint",
    passMark: 70,
    questions: [
      {
        id: "fxqc1-13",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c1-checkpoint-format",
        prompt: "Why are checkpoint position sizes done by hand AND checked against the spreadsheet?",
        options: [
          { id: "a", text: "Hand working proves the method; the comparison proves the spreadsheet is correct" },
          { id: "b", text: "To take longer" },
          { id: "c", text: "Because spreadsheets are banned" },
          { id: "d", text: "There is no reason" },
        ],
        correct: "a",
        explanation: "A broken calculator produces the same error on every trade; the check catches it.",
        whyWrong: {
          b: "Time is not the point.",
          c: "The spreadsheet is a required tool.",
          d: "Each half checks the other.",
        },
      },
      {
        id: "fxqc1-14",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-checkpoint-sample",
        prompt: "0.03 lots of EUR/USD, 30-pip stop. Loss if stopped?",
        options: [
          { id: "a", text: "$9.00" },
          { id: "b", text: "$90.00" },
          { id: "c", text: "$0.90" },
          { id: "d", text: "$3.00" },
        ],
        correct: "a",
        explanation: "30 × $10 × 0.03 = $9.00.",
        whyWrong: {
          b: "That would be 0.30 lots.",
          c: "That would be 0.003 lots.",
          d: "That forgets the stop distance.",
        },
      },
      {
        id: "fxqc1-15",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-c1-checkpoint-format",
        prompt: "EUR/GBP bid 0.85410, ask 0.85424. Spread and base currency?",
        options: [
          { id: "a", text: "1.4 pips; euro" },
          { id: "b", text: "14 pips; pound" },
          { id: "c", text: "1.4 pips; pound" },
          { id: "d", text: "0.14 pips; euro" },
        ],
        correct: "a",
        explanation: "0.85424 − 0.85410 = 0.00014 = 1.4 pips. The first currency, EUR, is the base.",
        whyWrong: {
          b: "Wrong decimal and wrong base.",
          c: "The base is the first currency.",
          d: "One decimal place too far.",
        },
      },
      {
        id: "fxqc1-16",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-c1-checkpoint-format",
        prompt: "What is the checkpoint's pass mark?",
        options: [
          { id: "a", text: "70%" },
          { id: "b", text: "50%" },
          { id: "c", text: "100%" },
          { id: "d", text: "There is none" },
        ],
        correct: "a",
        explanation: "The same 70% as every check in the course.",
        whyWrong: {
          b: "Lower than the course standard.",
          c: "Higher than the course standard.",
          d: "Every checkpoint has a pass mark.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
