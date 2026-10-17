/**
 * ASSESSMENTS · FOREX TRADING · WEEK 10
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l29-platforms": {
    lessonId: "fx-l29-platforms",
    passMark: 70,
    questions: [
      {
        id: "fxq29-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-mt5-layout",
        prompt: "In MT5 desktop, where do you see why an order was rejected?",
        options: [
          { id: "a", text: "Toolbox → Journal" },
          { id: "b", text: "Market Watch → Spread column" },
          { id: "c", text: "Navigator → Indicators" },
          { id: "d", text: "The chart's colour settings" },
        ],
        correct: "a",
        explanation: "The Journal tab logs platform events, including rejected orders and their reasons.",
        whyWrong: {
          b: "That shows the spread, not order events.",
          c: "That lists indicators.",
          d: "Display settings contain no order information.",
        },
      },
      {
        id: "fxq29-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-tradingview-layout",
        prompt: "How do price alerts help a learner with a full-time job?",
        options: [
          { id: "a", text: "The platform notifies you when price reaches a pre-analysed level, so you do not watch all day" },
          { id: "b", text: "They place trades automatically with no rules" },
          { id: "c", text: "They guarantee the level will hold" },
          { id: "d", text: "They remove the need for analysis" },
        ],
        correct: "a",
        explanation: "Analysis is done in advance; the alert tells you when to look again.",
        whyWrong: {
          b: "A basic alert only notifies; it does not trade.",
          c: "An alert says price arrived, not what happens next.",
          d: "The alert is only as useful as the analysis that placed it.",
        },
      },
      {
        id: "fxq29-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-one-click",
        prompt: "Why turn one-click trading OFF?",
        options: [
          { id: "a", text: "It removes the confirmation step, which makes accidental orders easy" },
          { id: "b", text: "It makes spreads wider" },
          { id: "c", text: "It is illegal" },
          { id: "d", text: "It disables stop-losses" },
        ],
        correct: "a",
        explanation: "A confirmation window costs a second and prevents a whole class of costly mistakes.",
        whyWrong: {
          b: "It has no effect on spreads.",
          c: "It is a normal platform feature.",
          d: "Stops can still be set; the risk is accidental entry.",
        },
      },
      {
        id: "fxq29-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-one-click",
        prompt: "Platforms often remember your last volume. What habit protects you?",
        options: [
          { id: "a", text: "Check the volume box against your calculator on every ticket" },
          { id: "b", text: "Always trade 1.00 lot so it never changes" },
          { id: "c", text: "Trust the platform's memory" },
          { id: "d", text: "Use maximum volume to be safe" },
        ],
        correct: "a",
        explanation: "Every trade's size comes from its own stop distance, so the volume must be checked each time.",
        whyWrong: {
          b: "A fixed size ignores the stop distance and breaks fixed-percentage risk.",
          c: "The remembered value belongs to a different trade.",
          d: "Maximum volume is maximum risk.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l30-order-management": {
    lessonId: "fx-l30-order-management",
    passMark: 70,
    questions: [
      {
        id: "fxq30-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-order-routine",
        prompt: "Which step of the order routine catches most errors while they are still cheap?",
        options: [
          { id: "a", text: "Checking the Trade tab immediately after sending" },
          { id: "b", text: "Looking at the result the next day" },
          { id: "c", text: "Asking a friend if the trade will win" },
          { id: "d", text: "Increasing the volume" },
        ],
        correct: "a",
        explanation: "Seeing the position as the platform recorded it reveals wrong direction, size or a missing stop within seconds.",
        whyWrong: {
          b: "By then an error may have cost a great deal.",
          c: "Nobody knows whether a trade will win.",
          d: "That adds risk; it checks nothing.",
        },
      },
      {
        id: "fxq30-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-pending-ticket",
        prompt:
          "Balance $1,000, risk 1%. You buy USD/JPY with a 50-pip stop; a pip on one lot is $6.67. What lot size?",
        options: [
          { id: "a", text: "0.02" },
          { id: "b", text: "0.03" },
          { id: "c", text: "0.20" },
          { id: "d", text: "0.10" },
        ],
        correct: "a",
        explanation:
          "$10 ÷ (50 × $6.67) = $10 ÷ $333.50 = 0.0299…, rounded DOWN to 0.02 lots (risking $6.67). Rounding never goes up into more risk.",
        whyWrong: {
          b: "0.03 lots risks 50 × $6.67 × 0.03 = $10.01, just over the 1% limit. Position sizes are always rounded down.",
          c: "That risks about $66.70.",
          d: "That risks about $33.35.",
        },
      },
      {
        id: "fxq30-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-modifying",
        prompt: "Which modification is NEVER legitimate?",
        options: [
          { id: "a", text: "Moving the stop further away to avoid being stopped out" },
          { id: "b", text: "Moving the stop to breakeven under a written rule" },
          { id: "c", text: "Trailing the stop behind new swings under a written rule" },
          { id: "d", text: "Deleting a pending order whose setup has expired" },
        ],
        correct: "a",
        explanation: "Increasing risk after entry, out of hope, is never a legitimate modification.",
        whyWrong: {
          b: "A written breakeven rule reduces risk.",
          c: "A written trailing rule reduces risk.",
          d: "Removing an expired order follows the plan.",
        },
      },
      {
        id: "fxq30-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-closing",
        prompt: "Your calculator said a stop-out would lose $10.00. The History tab shows −$10.60. What should you investigate?",
        options: [
          { id: "a", text: "Slippage, spread or a sizing error" },
          { id: "b", text: "Nothing; it is close enough" },
          { id: "c", text: "Whether the strategy is broken" },
          { id: "d", text: "Whether to stop journaling" },
        ],
        correct: "a",
        explanation: "The $0.60 difference has a cause, and each cause needs a different fix.",
        whyWrong: {
          b: "6% extra on every loss adds up quickly.",
          c: "One loss says nothing about the strategy; this is about execution.",
          d: "The journal is how you found the problem.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l31-costs-errors": {
    lessonId: "fx-l31-costs-errors",
    passMark: 70,
    questions: [
      {
        id: "fxq31-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-swaps",
        prompt: "Why do many brokers charge a triple swap on one weekday, commonly Wednesday?",
        options: [
          { id: "a", text: "To cover the weekend nights, because of how settlement dates fall" },
          { id: "b", text: "As a penalty for midweek trading" },
          { id: "c", text: "Because markets are closed on Wednesday" },
          { id: "d", text: "There is no such thing" },
        ],
        correct: "a",
        explanation: "Positions are financed for every calendar night. Settlement conventions put the weekend's nights on one weekday's rollover.",
        whyWrong: {
          b: "It is financing, not a penalty.",
          c: "Markets are open on Wednesday.",
          d: "It is standard practice; the day is shown in many brokers' specifications.",
        },
      },
      {
        id: "fxq31-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-execution-errors",
        prompt: "You meant to sell, and the Trade tab shows a buy. What kind of error is this?",
        options: [
          { id: "a", text: "An execution error" },
          { id: "b", text: "A strategy error" },
          { id: "c", text: "Slippage" },
          { id: "d", text: "A swap" },
        ],
        correct: "a",
        explanation: "The plan was right; carrying it out went wrong. Close it at once, and record what happened.",
        whyWrong: {
          b: "The strategy said sell; the mistake was in execution.",
          c: "Slippage is a price difference, not a reversed direction.",
          d: "A swap is an overnight financing charge.",
        },
      },
      {
        id: "fxq31-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-measure-costs",
        prompt: "What should your backtest deduct as costs?",
        options: [
          { id: "a", text: "Your measured average cost per trade, including slippage, from your own journal" },
          { id: "b", text: "The lowest spread the broker advertises" },
          { id: "c", text: "Nothing; backtests are theoretical" },
          { id: "d", text: "A random amount" },
        ],
        correct: "a",
        explanation: "Measured costs make the backtest reflect the conditions you actually trade in.",
        whyWrong: {
          b: "Advertised minimums are rarely what you pay at the times you trade.",
          c: "A cost-free test overstates every result.",
          d: "Costs should be measured, not guessed.",
        },
      },
      {
        id: "fxq31-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-supervised-session",
        prompt: "What does the observer check in the supervised session?",
        options: [
          { id: "a", text: "Process: checklist, calculator, ticket read-back, Trade tab check, journal row" },
          { id: "b", text: "Only how much money was made" },
          { id: "c", text: "Whether each trade won" },
          { id: "d", text: "How fast trades were placed" },
        ],
        correct: "a",
        explanation: "The course assesses process. Profit or loss in one session is mostly chance.",
        whyWrong: {
          b: "Profit alone never decides a pass in this course.",
          c: "Single outcomes are not evidence of skill.",
          d: "Speed is not a goal; accuracy is.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
