/**
 * ASSESSMENTS · FOREX TRADING · WEEK 8
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l23-objective-rules": {
    lessonId: "fx-l23-objective-rules",
    passMark: 70,
    questions: [
      {
        id: "fxq23-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-why-rules",
        prompt: "When is a trading rule objective?",
        options: [
          { id: "a", text: "When anyone applying it to the same chart reaches the same answer" },
          { id: "b", text: "When it has made money recently" },
          { id: "c", text: "When an experienced trader wrote it" },
          { id: "d", text: "When it uses an indicator" },
        ],
        correct: "a",
        explanation: "Objectivity means the rule does not depend on who applies it or how they feel that day.",
        whyWrong: {
          b: "Recent profit says nothing about whether a rule is clearly defined.",
          c: "Experience does not make a vague rule precise.",
          d: "'Price is near the moving average' uses an indicator and is still vague.",
        },
      },
      {
        id: "fxq23-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-why-rules",
        prompt: "Why must a strategy be objective before it can be backtested?",
        options: [
          { id: "a", text: "Because a backtest has to apply exactly the same decisions to every historical setup" },
          { id: "b", text: "Because TradingView refuses subjective strategies" },
          { id: "c", text: "Because subjective strategies always lose" },
          { id: "d", text: "It does not need to be" },
        ],
        correct: "a",
        explanation: "If a rule can be read several ways, hindsight will quietly choose the reading that worked, and the test measures your hindsight, not the strategy.",
        whyWrong: {
          b: "Software does not judge your rules; you apply them.",
          c: "Some may win, but you could never know why or repeat it.",
          d: "Testing vague rules produces results that cannot be reproduced.",
        },
      },
      {
        id: "fxq23-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-entry-rules",
        prompt: "What are the three parts of an entry rule taught in this lesson?",
        options: [
          { id: "a", text: "Context, location, trigger" },
          { id: "b", text: "Hope, confidence, size" },
          { id: "c", text: "Indicator, indicator, indicator" },
          { id: "d", text: "Broker, platform, leverage" },
        ],
        correct: "a",
        explanation: "The trend gives context, the zone gives location, and a defined candle or break is the trigger.",
        whyWrong: {
          b: "Feelings are not conditions.",
          c: "Stacking indicators does not create context or location.",
          d: "Those are account settings, not entry conditions.",
        },
      },
      {
        id: "fxq23-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-exit-rules",
        prompt:
          "A trade is open with SL and TP. Price stalls and you feel nervous, but no written exit rule has been triggered. What do you do?",
        options: [
          { id: "a", text: "Leave the trade to its stop, target or a written exit rule" },
          { id: "b", text: "Close it now because it feels wrong" },
          { id: "c", text: "Move the target closer so it hits sooner" },
          { id: "d", text: "Double the position to make the waiting worthwhile" },
        ],
        correct: "a",
        explanation: "If an exit is not in the rules, you do not take it. Write the feeling in your journal instead.",
        whyWrong: {
          b: "Emotional exits tend to cut winners short and make results impossible to evaluate.",
          c: "Changing the target mid-trade is changing the rules under pressure.",
          d: "Adding size because of a feeling increases risk with no rule behind it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l24-stops-targets": {
    lessonId: "fx-l24-stops-targets",
    passMark: 70,
    questions: [
      {
        id: "fxq24-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-stop-placement",
        prompt:
          "You sell GBP/USD. The last lower high is 1.2715 and your buffer is 8 pips. Ignoring spread, where is the stop?",
        options: [
          { id: "a", text: "1.2723" },
          { id: "b", text: "1.2707" },
          { id: "c", text: "1.2715" },
          { id: "d", text: "1.2795" },
        ],
        correct: "a",
        explanation: "On a sell the stop goes ABOVE the lower high plus the buffer: 1.2715 + 0.0008 = 1.2723.",
        whyWrong: {
          b: "That is below the lower high: inside the structure the idea depends on.",
          c: "Exactly at the swing point, with no buffer, it is exposed to normal noise.",
          d: "That adds 80 pips, not 8.",
        },
      },
      {
        id: "fxq24-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-spread-stops",
        prompt: "Why should a SELL's stop include the spread in its buffer?",
        options: [
          { id: "a", text: "Because a sell is closed by buying at the ask, which is above the bid shown on the chart" },
          { id: "b", text: "Because spreads are only charged on sells" },
          { id: "c", text: "Because sells are riskier than buys" },
          { id: "d", text: "It should not; the chart price is what triggers it" },
        ],
        correct: "a",
        explanation: "Charts usually show the bid. A sell's stop triggers on the ask, so the ask can hit it while the chart never seems to.",
        whyWrong: {
          b: "Every trade pays the spread.",
          c: "Direction does not make a trade riskier; the stop mechanics differ.",
          d: "For sells, the ask triggers the stop, not the bid on the chart.",
        },
      },
      {
        id: "fxq24-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-targets",
        prompt:
          "Rule: target 2R or 5 pips before the next opposing zone, whichever is nearer. Stop 25 pips; the next zone is 80 pips away. Target?",
        options: [
          { id: "a", text: "50 pips (2R)" },
          { id: "b", text: "75 pips" },
          { id: "c", text: "80 pips" },
          { id: "d", text: "25 pips" },
        ],
        correct: "a",
        explanation: "2R is 50 pips, nearer than 75 pips (5 before the zone), so 2R applies.",
        whyWrong: {
          b: "That would be the zone-based target, but it is farther than 2R.",
          c: "That is the zone itself, not 5 pips before it.",
          d: "That is 1R.",
        },
      },
      {
        id: "fxq24-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-invalidation-exits",
        prompt: "What separates a good early exit from a bad one?",
        options: [
          { id: "a", text: "Whether it follows a written rule, such as an H4 close beyond the zone" },
          { id: "b", text: "Whether the trade later turned around" },
          { id: "c", text: "Whether you felt anxious" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "a",
        explanation: "A written, objective early exit can be tested and followed consistently. An emotional one cannot.",
        whyWrong: {
          b: "Judging by what happened next is hindsight.",
          c: "Anxiety is information about you, not about the trade.",
          d: "Rule-based exits can be evaluated; emotional ones cannot.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l25-filters-checklist": {
    lessonId: "fx-l25-filters-checklist",
    passMark: 70,
    questions: [
      {
        id: "fxq25-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-filters",
        prompt: "What is a filter?",
        options: [
          { id: "a", text: "A condition that blocks a trade even when the entry trigger appears" },
          { id: "b", text: "An indicator that predicts price" },
          { id: "c", text: "A broker setting that removes spreads" },
          { id: "d", text: "A type of pending order" },
        ],
        correct: "a",
        explanation: "Filters say no: wrong session, news nearby, spread too wide, reward too small, against the trend.",
        whyWrong: {
          b: "Filters restrict when you trade; they do not predict.",
          c: "No setting removes spreads.",
          d: "Pending orders are entries, not filters.",
        },
      },
      {
        id: "fxq25-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-checklist",
        prompt: "Seven of eight checklist items are 'yes'. The spread is above your maximum. What do you do?",
        options: [
          { id: "a", text: "No trade, and record which item failed" },
          { id: "b", text: "Trade; seven out of eight is close enough" },
          { id: "c", text: "Trade with a market order to save time" },
          { id: "d", text: "Raise the maximum spread for this trade" },
        ],
        correct: "a",
        explanation: "Any 'no' means no trade. Recording which item failed shows you later how often each filter blocks trades.",
        whyWrong: {
          b: "A checklist that allows exceptions is a suggestion list.",
          c: "The spread problem remains whatever the order type.",
          d: "Changing a rule to permit a trade in the moment defeats the rule.",
        },
      },
      {
        id: "fxq25-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-staying-out",
        prompt: "Which is a reason to stay out of the market entirely?",
        options: [
          { id: "a", text: "You have hit your daily loss limit" },
          { id: "b", text: "The London session has opened" },
          { id: "c", text: "Your checklist is complete" },
          { id: "d", text: "The spread is normal" },
        ],
        correct: "a",
        explanation: "Loss limits exist to keep you out when you are most likely to make emotional decisions.",
        whyWrong: {
          b: "That is often the best time to trade.",
          c: "A complete, all-yes checklist permits a trade.",
          d: "A normal spread is a reason you may trade, not a reason to stop.",
        },
      },
      {
        id: "fxq25-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-fx-example-strategy",
        prompt:
          "Under the example strategy, a valid setup's target is 1.33R because a zone is in the way. What happens?",
        options: [
          { id: "a", text: "No trade: the filter requires a target of at least 1.5R" },
          { id: "b", text: "Trade, but move the target beyond the zone to make it 2R" },
          { id: "c", text: "Trade with a tighter stop so the target becomes 2R" },
          { id: "d", text: "Trade; filters are only guidelines" },
        ],
        correct: "a",
        explanation: "The minimum-reward filter blocks it. Bending the stop or target to pass the filter would break other rules.",
        whyWrong: {
          b: "The target rule says before the zone, not beyond it.",
          c: "The stop is set by structure and buffer, not adjusted to make the numbers look better.",
          d: "In this course a filter is a rule.",
        },
      },
      {
        id: "fxq25-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-example-strategy",
        prompt: "What does the course claim about the example strategy's profitability?",
        options: [
          { id: "a", text: "Nothing: it is a teaching example of how rules are written, to be tested in Week 9" },
          { id: "b", text: "That it wins most of the time" },
          { id: "c", text: "That it is guaranteed to be profitable on demo" },
          { id: "d", text: "That professionals use it exactly" },
        ],
        correct: "a",
        explanation: "The course makes no profitability claim. Only an honest test can say whether any strategy has an edge.",
        whyWrong: {
          b: "No such claim is made.",
          c: "No strategy is guaranteed to be profitable anywhere.",
          d: "It is an illustration of format, not a copy of anyone's system.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
