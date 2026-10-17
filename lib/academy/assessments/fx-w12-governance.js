/**
 * ASSESSMENTS · FOREX TRADING · WEEK 12
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The check for fx-l37-due-diligence doubles as the Phase 4 theory and
 * risk-management assessment, so its questions reach back across Weeks 3,
 * 8 and 12 as well as the lesson itself. Each still points at an atom in
 * this lesson for "review this concept", as the grader requires.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l35-correlation": {
    lessonId: "fx-l35-correlation",
    passMark: 70,
    questions: [
      {
        id: "fxq35-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-correlation",
        prompt: "EUR/USD and USD/CHF are typically:",
        options: [
          { id: "a", text: "Negatively correlated" },
          { id: "b", text: "Positively correlated" },
          { id: "c", text: "Identical" },
          { id: "d", text: "Unrelated" },
        ],
        correct: "a",
        explanation: "The dollar is the quote in one and the base in the other, so they tend to move in opposite directions.",
        whyWrong: {
          b: "EUR/USD and GBP/USD are a typical positive pair.",
          c: "They move differently and are often opposite.",
          d: "The shared dollar links them strongly.",
        },
      },
      {
        id: "fxq35-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-currency-exposure",
        prompt: "You are short EUR/USD and long USD/JPY. What is your exposure?",
        options: [
          { id: "a", text: "Long the dollar twice" },
          { id: "b", text: "Short the dollar twice" },
          { id: "c", text: "Neutral: the trades cancel out" },
          { id: "d", text: "Long the euro" },
        ],
        correct: "a",
        explanation: "Short EUR/USD buys dollars; long USD/JPY buys dollars. Both gain if the dollar strengthens.",
        whyWrong: {
          b: "Both trades BUY the dollar.",
          c: "They point the same way on the dollar.",
          d: "Short EUR/USD sells the euro.",
        },
      },
      {
        id: "fxq35-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-exposure-limits",
        prompt: "Your maximum exposure per currency is 2%. You hold long AUD/USD and long AUD/CAD at 1% each. A valid long AUD/JPY setup appears. What do you do?",
        options: [
          { id: "a", text: "Skip it: it would make you 3% long the Australian dollar, beyond the 2% limit" },
          { id: "b", text: "Take it: it is a different pair" },
          { id: "c", text: "Take it at 3%" },
          { id: "d", text: "Close a trade at random" },
        ],
        correct: "a",
        explanation: "All three trades buy the Australian dollar: 1% + 1% + 1% = 3% on one currency, above the 2% limit.",
        whyWrong: {
          b: "Different pairs can carry the same currency risk.",
          c: "That breaches every limit.",
          d: "Random closes are not a rule.",
        },
      },
      {
        id: "fxq35-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-correlation",
        prompt: "Why should correlations be checked rather than assumed?",
        options: [
          { id: "a", text: "Because they change over time" },
          { id: "b", text: "Because they never change" },
          { id: "c", text: "Because brokers set them" },
          { id: "d", text: "They should not be checked" },
        ],
        correct: "a",
        explanation: "Relationships between pairs strengthen, weaken and occasionally reverse as economic conditions change.",
        whyWrong: {
          b: "They do change, sometimes quickly.",
          c: "Correlations arise from market behaviour, not broker settings.",
          d: "Unchecked assumptions are how hidden exposure builds up.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l36-capital-preservation": {
    lessonId: "fx-l36-capital-preservation",
    passMark: 70,
    questions: [
      {
        id: "fxq36-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-capital-preservation",
        prompt: "What does capital preservation mean?",
        options: [
          { id: "a", text: "Protecting the account comes before growing it" },
          { id: "b", text: "Never taking any trade" },
          { id: "c", text: "Keeping all money in one currency" },
          { id: "d", text: "Using maximum leverage carefully" },
        ],
        correct: "a",
        explanation: "Small risk, exposure limits and circuit breakers keep you able to keep learning and trading.",
        whyWrong: {
          b: "It is about managing risk, not avoiding the market entirely.",
          c: "It is not about currency of savings.",
          d: "Maximum leverage is the opposite of preservation.",
        },
      },
      {
        id: "fxq36-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-drawdown-limits",
        prompt: "Your plan says: at −10% from peak, pause, halve risk and review. Your account is at −10.4%. What happens next?",
        options: [
          { id: "a", text: "Pause trading, halve risk per trade and run the full review" },
          { id: "b", text: "Double risk to recover faster" },
          { id: "c", text: "Ignore it until −20%" },
          { id: "d", text: "Open a new account and start again" },
        ],
        correct: "a",
        explanation: "The ladder was written calmly in advance precisely so this moment requires no judgement.",
        whyWrong: {
          b: "That is revenge trading at account scale.",
          c: "Moving a limit when it is reached defeats it.",
          d: "That hides the problem without finding its cause.",
        },
      },
      {
        id: "fxq36-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-risk-of-ruin",
        prompt: "What increases risk of ruin most for a given strategy?",
        options: [
          { id: "a", text: "Raising the risk per trade" },
          { id: "b", text: "Keeping a journal" },
          { id: "c", text: "Using a checklist" },
          { id: "d", text: "Trading only during the London session" },
        ],
        correct: "a",
        explanation: "With the same win rate, higher risk per trade makes the inevitable losing streaks far more damaging.",
        whyWrong: {
          b: "Journaling reduces errors.",
          c: "Checklists reduce rule-breaking.",
          d: "A session filter has no direct effect on risk of ruin.",
        },
      },
      {
        id: "fxq36-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-readiness",
        prompt: "Which statement about this course and live trading is TRUE?",
        options: [
          { id: "a", text: "Completing it does not certify you as ready to trade real money, and it promises no profitability" },
          { id: "b", text: "Passing Week 12 means you are ready for a live account" },
          { id: "c", text: "Graduates are guaranteed consistent profits" },
          { id: "d", text: "The demo results prove you will profit live" },
        ],
        correct: "a",
        explanation: "The course builds knowledge and discipline. It makes no promise about profit or live readiness.",
        whyWrong: {
          b: "Week 12 is a checkpoint of knowledge and process, not a licence to trade live.",
          c: "No course can honestly guarantee profits.",
          d: "Demo results, especially short ones, prove nothing about future live results.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     Phase 4 theory and risk-management assessment
  ═══════════════════════════════════════════════════════════════════ */
  "fx-l37-due-diligence": {
    lessonId: "fx-l37-due-diligence",
    passMark: 70,
    questions: [
      {
        id: "fxq37-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-regulation",
        prompt: "How do you confirm that a broker is really regulated?",
        options: [
          { id: "a", text: "Search the regulator's own public register and check the listed website matches" },
          { id: "b", text: "Look for a regulator's logo on the broker's website" },
          { id: "c", text: "Ask the broker's support chat" },
          { id: "d", text: "Check how many Instagram followers it has" },
        ],
        correct: "a",
        explanation: "Only the regulator's register is authoritative, and matching contact details protect against clone firms.",
        whyWrong: {
          b: "Logos can be copied by anyone.",
          c: "A fraudulent firm will simply say yes.",
          d: "Followers can be bought.",
        },
      },
      {
        id: "fxq37-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-fraud",
        prompt: "Which offer shows the MOST red flags?",
        options: [
          { id: "a", text: "'Guaranteed 20% monthly — send to my personal account — only 3 slots left'" },
          { id: "b", text: "A regulated broker's demo account" },
          { id: "c", text: "A free economic calendar" },
          { id: "d", text: "A TradingView free plan" },
        ],
        correct: "a",
        explanation: "Guaranteed returns, payment to a personal account and pressure to act are three red flags at once.",
        whyWrong: {
          b: "A regulated demo involves no money at all.",
          c: "A calendar is information, not an investment.",
          d: "A free charting plan asks for no money.",
        },
      },
      {
        id: "fxq37-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-trading-plan",
        prompt:
          "Theory and risk: balance $1,500, risk 1%, stop 30 pips on GBP/USD ($10 per pip per lot). What lot size, and how much is lost if the stop is hit?",
        options: [
          { id: "a", text: "0.05 lots, $15.00" },
          { id: "b", text: "0.15 lots, $45.00" },
          { id: "c", text: "0.50 lots, $150.00" },
          { id: "d", text: "0.03 lots, $9.00" },
        ],
        correct: "a",
        explanation: "Risk $15 ÷ (30 × $10) = 0.05 lots; 30 × $10 × 0.05 = $15.00.",
        whyWrong: {
          b: "That risks 3%.",
          c: "That risks 10%.",
          d: "That risks 0.6%, less than the plan.",
        },
      },
      {
        id: "fxq37-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-trading-plan",
        prompt:
          "Theory and risk: equity $950, used margin $400. Your broker's margin call is at 100%. What is your margin level, and are you at the margin call?",
        options: [
          { id: "a", text: "237.5%; no" },
          { id: "b", text: "42.1%; yes" },
          { id: "c", text: "$550; no" },
          { id: "d", text: "100%; yes" },
        ],
        correct: "a",
        explanation: "Margin level = 950 ÷ 400 × 100 = 237.5%, comfortably above a 100% margin call.",
        whyWrong: {
          b: "That divides margin by equity, the wrong way round.",
          c: "$550 is the free margin, not the margin level.",
          d: "That would need equity equal to used margin.",
        },
      },
      {
        id: "fxq37-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-when-not-to-trade",
        prompt: "Which is a reason not to trade at all?",
        options: [
          { id: "a", text: "You would be using money needed for rent or school fees" },
          { id: "b", text: "Your checklist is complete and all 'yes'" },
          { id: "c", text: "It is the London–New York overlap" },
          { id: "d", text: "The spread is normal" },
        ],
        correct: "a",
        explanation: "Trading capital must be money you can afford to lose entirely. Needed money makes every decision fearful.",
        whyWrong: {
          b: "A complete all-yes checklist permits a trade.",
          c: "That is often the best window to trade.",
          d: "A normal spread is a condition for trading, not against it.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
