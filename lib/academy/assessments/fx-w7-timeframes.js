/**
 * ASSESSMENTS · FOREX TRADING · WEEK 7
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l20-trading-styles": {
    lessonId: "fx-l20-trading-styles",
    passMark: 70,
    questions: [
      {
        id: "fxq20-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-styles",
        prompt: "Which style typically holds trades for several days to a few weeks?",
        options: [
          { id: "a", text: "Scalping" },
          { id: "b", text: "Day trading" },
          { id: "c", text: "Swing trading" },
          { id: "d", text: "High-frequency trading" },
        ],
        correct: "c",
        explanation: "Swing traders aim to catch one swing of a trend, held for days to weeks.",
        whyWrong: {
          a: "Scalpers hold for seconds to minutes.",
          b: "Day traders close everything within the day.",
          d: "High-frequency trading is done by computers in fractions of a second.",
        },
      },
      {
        id: "fxq20-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-style-costs",
        prompt: "Costs are 1.5 pips per trade. What share of risk do they take on a 5-pip-stop scalp versus a 50-pip-stop swing trade?",
        options: [
          { id: "a", text: "30% versus 3%" },
          { id: "b", text: "3% versus 30%" },
          { id: "c", text: "The same for both" },
          { id: "d", text: "1.5% for both" },
        ],
        correct: "a",
        explanation: "1.5 ÷ 5 = 30%; 1.5 ÷ 50 = 3%. Shorter styles pay far more relative to each trade's risk.",
        whyWrong: {
          b: "Reversed: the scalp's small stop makes the cost proportionally larger.",
          c: "The cost in pips is the same, but the risk it is compared with is not.",
          d: "That treats pips as percentages.",
        },
      },
      {
        id: "fxq20-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-choosing-style",
        prompt: "What should decide a beginner's trading style?",
        options: [
          { id: "a", text: "Which style has the most exciting screenshots online" },
          { id: "b", text: "The time they actually have, their costs and whether they can follow rules calmly in it" },
          { id: "c", text: "Whatever their favourite influencer trades" },
          { id: "d", text: "The style with the highest advertised returns" },
        ],
        correct: "b",
        explanation: "A style you can execute consistently, at reasonable cost, within your real schedule, is the only one with a chance of working.",
        whyWrong: {
          a: "Excitement is a cost, not a qualification.",
          c: "Someone else's schedule, costs and temperament are not yours.",
          d: "Advertised returns are marketing, not evidence.",
        },
      },
      {
        id: "fxq20-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-style-costs",
        prompt: "Which cost matters for swing and position traders but barely for scalpers?",
        options: [
          { id: "a", text: "Swap" },
          { id: "b", text: "Spread" },
          { id: "c", text: "Slippage" },
          { id: "d", text: "None of them" },
        ],
        correct: "a",
        explanation: "Swap is charged or credited for each night a position is held. Scalpers rarely hold overnight.",
        whyWrong: {
          b: "Spread is paid on every trade by every style.",
          c: "Slippage affects every style, and scalpers most of all relative to their targets.",
          d: "Swap clearly matters more for longer holding periods.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l21-top-down": {
    lessonId: "fx-l21-top-down",
    passMark: 70,
    questions: [
      {
        id: "fxq21-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-top-down",
        prompt: "In top-down analysis, what is the higher timeframe used for?",
        options: [
          { id: "a", text: "Context: the main trend and major levels" },
          { id: "b", text: "Timing the exact entry" },
          { id: "c", text: "Calculating pip values" },
          { id: "d", text: "Nothing; only the lowest timeframe matters" },
        ],
        correct: "a",
        explanation: "The higher timeframe sets the context; the lower timeframes find the setup and time the entry.",
        whyWrong: {
          b: "Timing is the lower timeframe's job.",
          c: "Pip values depend on the pair and size, not the timeframe.",
          d: "The lowest timeframe alone shows only a fragment of the picture.",
        },
      },
      {
        id: "fxq21-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-top-down",
        prompt: "A day trader's execution timeframe is M15. Following the four-to-six times rule, which pair of higher timeframes fits?",
        options: [
          { id: "a", text: "H1 for setup, H4 for context" },
          { id: "b", text: "M5 and M1" },
          { id: "c", text: "W1 and monthly" },
          { id: "d", text: "M30 and M45" },
        ],
        correct: "a",
        explanation: "M15 × 4 = H1, and H1 × 4 = H4.",
        whyWrong: {
          b: "Those are lower, not higher.",
          c: "Weekly and monthly are far too high for a day trader's context.",
          d: "M30 is only twice M15, and M45 is not a standard timeframe.",
        },
      },
      {
        id: "fxq21-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-timeframe-conflict",
        prompt: "The daily chart is in an uptrend; the 1-hour chart shows a downtrend. What is the usual interpretation?",
        options: [
          { id: "a", text: "A pullback within the daily uptrend" },
          { id: "b", text: "The daily uptrend has ended" },
          { id: "c", text: "The charts are wrong" },
          { id: "d", text: "A signal to sell with large size" },
        ],
        correct: "a",
        explanation: "A lower-timeframe move against the higher trend is usually a pullback, a potential opportunity to join the bigger trend.",
        whyWrong: {
          b: "Only a break of the DAILY structure would show that.",
          c: "Both charts are correct; they show different scales.",
          d: "That fights the higher timeframe, and size is set by risk.",
        },
      },
      {
        id: "fxq21-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-fx-mtf-levels",
        prompt: "An H1 resistance sits 8 pips below a daily resistance. How should you treat them?",
        options: [
          { id: "a", text: "As one area, led by the daily level" },
          { id: "b", text: "As two equally important levels" },
          { id: "c", text: "Ignore the daily level; H1 is closer" },
          { id: "d", text: "As a reason to put the target beyond both" },
        ],
        correct: "a",
        explanation: "Nearby levels merge into one area, and the higher timeframe's level carries more weight.",
        whyWrong: {
          b: "The daily level is watched by more participants.",
          c: "Closeness does not make a level more important.",
          d: "Targets are usually placed BEFORE significant resistance, not beyond it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l22-alignment-invalidation": {
    lessonId: "fx-l22-alignment-invalidation",
    passMark: 70,
    questions: [
      {
        id: "fxq22-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-alignment",
        prompt: "Which long trade is aligned?",
        options: [
          { id: "a", text: "D1 uptrend, H4 demand zone, H1 bullish engulfing" },
          { id: "b", text: "D1 downtrend, H4 resistance, H1 bullish engulfing" },
          { id: "c", text: "D1 range middle, H1 bullish engulfing" },
          { id: "d", text: "Any trade with an engulfing pattern" },
        ],
        correct: "a",
        explanation: "All three timeframes point the same way for a long trade.",
        whyWrong: {
          b: "The higher timeframe and the setup both oppose a buy.",
          c: "The higher timeframe gives no direction, and the middle of a range has no structure.",
          d: "A pattern alone says nothing about alignment.",
        },
      },
      {
        id: "fxq22-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-entry-conditions",
        prompt: "Which is an objective entry condition?",
        options: [
          { id: "a", text: "Enter when price looks strong" },
          { id: "b", text: "Enter when an H1 candle closes above the high of the bullish pin bar" },
          { id: "c", text: "Enter when I feel confident" },
          { id: "d", text: "Enter when the chart looks ready" },
        ],
        correct: "b",
        explanation: "It is observable on the chart: either the candle closed above that price or it did not.",
        whyWrong: {
          a: "'Looks strong' means different things to different people, and to you on different days.",
          c: "Feelings are not observable conditions.",
          d: "'Ready' is undefined.",
        },
      },
      {
        id: "fxq22-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-invalidation",
        prompt: "You buy from a demand zone at 1.0880–1.0890 in an uptrend. Where does the stop-loss belong?",
        options: [
          { id: "a", text: "Just beyond the level where the idea is invalid, such as below the zone" },
          { id: "b", text: "Exactly 10 pips below entry, always" },
          { id: "c", text: "Wherever gives the biggest lot size" },
          { id: "d", text: "No stop; the zone will hold" },
        ],
        correct: "a",
        explanation: "The stop goes beyond invalidation. The lot size is then calculated to fit the risk.",
        whyWrong: {
          b: "A fixed number of pips ignores where the idea is actually wrong.",
          c: "That reverses the order of decisions and usually puts the stop inside normal noise.",
          d: "No zone is certain to hold.",
        },
      },
      {
        id: "fxq22-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-invalidation",
        prompt: "Balance $2,000, risk 1%. A sell on EUR/USD has its stop 40 pips above entry. What lot size?",
        options: [
          { id: "a", text: "0.05" },
          { id: "b", text: "0.50" },
          { id: "c", text: "0.02" },
          { id: "d", text: "0.10" },
        ],
        correct: "a",
        explanation: "Risk $20 ÷ (40 × $10) = 0.05 lots.",
        whyWrong: {
          b: "That risks $200, 10% of the account.",
          c: "That risks $8, 0.4%.",
          d: "That risks $40, 2%.",
        },
      },
      {
        id: "fxq22-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-practical-mtf",
        prompt: "Your three-timeframe analysis finds no setup. What is the correct output?",
        options: [
          { id: "a", text: "A written 'no trade' with the reason" },
          { id: "b", text: "Find a trade on a lower timeframe so the work was not wasted" },
          { id: "c", text: "Take a smaller trade anyway" },
          { id: "d", text: "Delete the analysis" },
        ],
        correct: "a",
        explanation: "'No trade' is a valid, frequent and valuable result. Recording it builds the discipline to stay out.",
        whyWrong: {
          b: "Hunting for a trade to justify the effort is the start of overtrading.",
          c: "A small trade without a setup is still a trade without a reason.",
          d: "Your no-trade decisions are evidence too.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
