/**
 * ASSESSMENTS · FOREX TRADING · WEEK 11
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l32-emotions": {
    lessonId: "fx-l32-emotions",
    passMark: 70,
    questions: [
      {
        id: "fxq32-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-fear",
        prompt: "Your journal shows most winning trades closed manually between +0.4R and +0.8R, though targets were 2R. Which emotion is most likely at work?",
        options: [
          { id: "a", text: "Fear" },
          { id: "b", text: "Greed" },
          { id: "c", text: "FOMO" },
          { id: "d", text: "None; this is good risk management" },
        ],
        correct: "a",
        explanation: "Closing winners early to avoid the pain of a pullback is the classic signature of fear.",
        whyWrong: {
          b: "Greed tends to push targets further, not closer.",
          c: "FOMO is about late entries.",
          d: "Unplanned early exits cut winners while losers still run to their stops.",
        },
      },
      {
        id: "fxq32-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-greed",
        prompt: "After five wins in a row, a trader raises risk from 1% to 4% per trade. What is the problem?",
        options: [
          { id: "a", text: "A short winning streak is mostly luck, so the trader is biggest just as it ends" },
          { id: "b", text: "None; confidence should be rewarded" },
          { id: "c", text: "4% is the correct professional risk" },
          { id: "d", text: "The problem is that they did not raise it to 10%" },
        ],
        correct: "a",
        explanation: "Five trades is no evidence of a changed edge. Raising risk on a streak is greed.",
        whyWrong: {
          b: "Confidence is not evidence.",
          c: "This course uses 1%; 0.5–2% is the common professional range.",
          d: "Larger risk would only make the inevitable losing streak more damaging.",
        },
      },
      {
        id: "fxq32-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fx-fomo",
        prompt: "Which is an example of FOMO?",
        options: [
          { id: "a", text: "Chasing a breakout 40 pips past your planned entry" },
          { id: "b", text: "Waiting for the trigger candle to close" },
          { id: "c", text: "Skipping a trade because the spread is too wide" },
          { id: "d", text: "Following your checklist" },
        ],
        correct: "a",
        explanation: "Entering late because a move is underway, at a worse price and without a valid setup, is FOMO.",
        whyWrong: {
          b: "That is discipline.",
          c: "That is a filter working.",
          d: "That is the cure.",
        },
      },
      {
        id: "fxq32-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-revenge",
        prompt: "What makes revenge trading so destructive?",
        options: [
          { id: "a", text: "It combines bigger risk with worse decisions, at the moment judgement is weakest" },
          { id: "b", text: "It is slower than normal trading" },
          { id: "c", text: "It only happens to beginners" },
          { id: "d", text: "Brokers charge extra for it" },
        ],
        correct: "a",
        explanation: "Trying to win back losses immediately usually means no setup and larger size, made from frustration.",
        whyWrong: {
          b: "It is usually faster and more frantic.",
          c: "Experienced traders fall into it too; that is why circuit breakers exist.",
          d: "There is no such charge; the cost is the losses.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l33-journal-review": {
    lessonId: "fx-l33-journal-review",
    passMark: 70,
    questions: [
      {
        id: "fxq33-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-process-vs-outcome",
        prompt: "Which kind of trade is the most dangerous for a beginner?",
        options: [
          { id: "a", text: "A lucky win: rules broken, money made" },
          { id: "b", text: "A good loss: rules followed, money lost" },
          { id: "c", text: "An earned win" },
          { id: "d", text: "A deserved loss" },
        ],
        correct: "a",
        explanation: "A lucky win rewards a bad habit, making it more likely to be repeated.",
        whyWrong: {
          b: "A good loss is a normal cost of a strategy.",
          c: "An earned win reinforces the right behaviour.",
          d: "A deserved loss is painful but teaches the right lesson.",
        },
      },
      {
        id: "fxq33-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-journal-columns",
        prompt: "A trade followed every rule, entered 1 pip later than planned, and lost 1R. What process grade?",
        options: [
          { id: "a", text: "B: a minor deviation that did not change the risk" },
          { id: "b", text: "F, because it lost" },
          { id: "c", text: "C" },
          { id: "d", text: "It cannot be graded until next week" },
        ],
        correct: "a",
        explanation: "The grade is about process. A one-pip late entry with correct risk is a minor deviation.",
        whyWrong: {
          b: "Losing is not a grading criterion.",
          c: "C is for a broken rule that changed the trade.",
          d: "Grades are given immediately, before looking at outcomes.",
        },
      },
      {
        id: "fxq33-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-post-trade-review",
        prompt: "What is the rule-adherence rate?",
        options: [
          { id: "a", text: "The percentage of trades graded A or B" },
          { id: "b", text: "The win rate" },
          { id: "c", text: "The number of rules in the strategy" },
          { id: "d", text: "The percentage of profitable weeks" },
        ],
        correct: "a",
        explanation: "It measures how consistently you followed the plan, independent of results.",
        whyWrong: {
          b: "Win rate measures outcomes.",
          c: "That counts rules, not adherence to them.",
          d: "Profitable weeks are outcomes too.",
        },
      },
      {
        id: "fxq33-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-post-trade-review",
        prompt: "After a weekly review, how many improvements should you work on next week?",
        options: [
          { id: "a", text: "One" },
          { id: "b", text: "Every problem found" },
          { id: "c", text: "None; reviews are only for recording" },
          { id: "d", text: "As many as there are trades" },
        ],
        correct: "a",
        explanation: "Changing one thing at a time makes it possible to see whether that change helped.",
        whyWrong: {
          b: "Changing everything at once makes it impossible to tell what worked.",
          c: "A review that changes nothing is a diary, not a review.",
          d: "That would mean changing something every trade.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "fx-l34-streaks-control": {
    lessonId: "fx-l34-streaks-control",
    passMark: 70,
    questions: [
      {
        id: "fxq34-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-loss-streaks",
        prompt: "A strategy wins 40% of trades. Over a few hundred trades, a run of eight losses is:",
        options: [
          { id: "a", text: "Quite likely, and ordinary" },
          { id: "b", text: "Proof the strategy has stopped working" },
          { id: "c", text: "Impossible" },
          { id: "d", text: "A sign the broker is cheating" },
        ],
        correct: "a",
        explanation: "Long losing runs are a normal feature of probability, which is why risk per trade must be small.",
        whyWrong: {
          b: "A streak alone is not evidence of a broken strategy; a large-sample review is needed.",
          c: "With a 60% loss rate, eight in a row is entirely possible.",
          d: "Ordinary probability explains it.",
        },
      },
      {
        id: "fxq34-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-overtrading",
        prompt: "Which journal trend suggests overtrading?",
        options: [
          { id: "a", text: "More trades per week, fewer A grades, and higher total costs" },
          { id: "b", text: "Fewer trades, all A grades" },
          { id: "c", text: "Several no-trade days in a row" },
          { id: "d", text: "A stable number of trades" },
        ],
        correct: "a",
        explanation: "Taking more trades than the strategy produces lowers quality and raises costs.",
        whyWrong: {
          b: "That suggests selectivity.",
          c: "No-trade days are normal when there are no setups.",
          d: "Stability is not a warning sign.",
        },
      },
      {
        id: "fxq34-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fx-breaks",
        prompt: "Why follow a weekly loss limit even when every losing trade followed the rules?",
        options: [
          { id: "a", text: "Because a limit you can override when you feel sure will fail on the day you are wrong" },
          { id: "b", text: "Because rule-following trades should be punished" },
          { id: "c", text: "Because the broker requires it" },
          { id: "d", text: "You should not; override it" },
        ],
        correct: "a",
        explanation: "Circuit breakers work because they are automatic. Judgement in the moment is exactly what they replace.",
        whyWrong: {
          b: "A break is protection, not punishment.",
          c: "It is your own rule, not a broker's.",
          d: "Overriding it defeats its purpose.",
        },
      },
      {
        id: "fxq34-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-emotional-control",
        prompt: "What does 'emotional control is mostly design' mean?",
        options: [
          { id: "a", text: "Small risk, pending orders, checklists and circuit breakers reduce the decisions emotion can affect" },
          { id: "b", text: "Design a nicer chart" },
          { id: "c", text: "Emotions can be removed completely with willpower" },
          { id: "d", text: "Only experienced traders feel emotions" },
        ],
        correct: "a",
        explanation: "You cannot stop feeling emotions, but you can build a process in which they have little to act on.",
        whyWrong: {
          b: "Chart appearance is not the point.",
          c: "Willpower is unreliable under stress, which is why design is used.",
          d: "Everyone feels them.",
        },
      },
      {
        id: "fxq34-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-fx-practical-review",
        prompt: "Why cover the result column before grading trades?",
        options: [
          { id: "a", text: "So the outcome cannot influence the process grade" },
          { id: "b", text: "To make the review faster" },
          { id: "c", text: "Because results are not recorded" },
          { id: "d", text: "To hide losses from yourself" },
        ],
        correct: "a",
        explanation: "Knowing a trade won makes rule-breaks look forgivable; knowing it lost makes good trades look bad.",
        whyWrong: {
          b: "Speed is not the reason.",
          c: "Results are recorded and used after grading.",
          d: "The results are uncovered and analysed afterwards.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
