/**
 * FOREX TRADING · WEEK 11 · PSYCHOLOGY AND DISCIPLINE
 *
 * Curriculum 11.1 – 11.P. The emotions that break rules, the journal and
 * review routine that catches them, and how to survive losing streaks. The
 * practical grades past trades on process, INDEPENDENTLY of profit or loss.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "fx-s11-psychology";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 11.1 — FEAR, GREED, FOMO, REVENGE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l32-emotions",
    moduleId: "fx-w11-psychology",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1"],
    title: "Fear, Greed, FOMO and Revenge Trading",
    subtitle: "The four ways rules get broken",
    estimatedMinutes: 16,
    intro:
      "Almost every trader knows what they should do. Most losses that matter come from not doing it, at a moment when an emotion was louder than the plan. Naming those emotions, and the exact behaviour each produces, is the first step to catching them.",

    atoms: [
      {
        id: "a-fx-fear",
        title: "Fear",
        explain:
          "FEAR shows up as hesitation and early exits: skipping valid setups after a loss, closing winning trades long before the target because a pullback feels threatening, or moving a stop to breakeven too early. The trader avoids pain in the moment and, over time, cuts their winners while still taking their full losers.",
        mistake:
          "Thinking fear only affects nervous people. It affects everyone, especially after a losing streak, and its signature in a journal is clear: many trades closed between +0.3R and +0.8R when the target was 2R.",
      },
      {
        id: "a-fx-greed",
        title: "Greed",
        explain:
          "GREED shows up as excess: risking more than the plan after some wins, removing a take-profit 'to let it run', adding to positions without a rule, or trading pairs and timeframes outside the strategy because a move looks big. It often follows a winning streak, when confidence outruns evidence.",
        why: "A winning streak in a small sample is mostly luck. Increasing risk because of it means you are biggest exactly when the streak ends.",
      },
      {
        id: "a-fx-fomo",
        title: "FOMO: fear of missing out",
        explain:
          "FOMO is entering late because a move is already happening and you cannot bear to watch it without being in: chasing a breakout 40 pips after the entry level, entering before the trigger candle has closed, or buying because a WhatsApp group is posting screenshots. FOMO entries have worse prices, wider stops and no setup behind them.",
      },
      {
        id: "a-fx-revenge",
        title: "Revenge trading",
        explain:
          "REVENGE TRADING is trying to win back a loss immediately: taking the next trade without a setup, doubling the size, or switching to a faster timeframe to 'make it back today'. It is the most destructive pattern of all, because it combines bigger risk with worse decisions at the moment you are least able to judge either.",
        decision: {
          scenario:
            "You have just lost two trades in a row on GBP/USD, both following your rules. You feel the market 'owes' you. A move starts on EUR/USD; it is not a setup under your strategy, but it is moving fast.",
          question: "Which response shows discipline?",
          options: [
            {
              id: "a",
              text: "Take the EUR/USD move with double size to recover both losses in one trade",
              whyWrong: "That is revenge trading in its purest form: no setup, double the risk, and the decision made from frustration.",
            },
            {
              id: "b",
              text: "Stop trading for the day as your daily-loss rule says, and journal how you feel",
              why: "Right. Two rule-following losses are normal. The danger is the next decision, and the daily limit exists to remove it.",
            },
            {
              id: "c",
              text: "Take it with normal size; it is moving so it must be a good trade",
              whyWrong: "Movement is not a setup. This is FOMO on top of frustration.",
            },
            {
              id: "d",
              text: "Delete the strategy, since it lost twice",
              whyWrong: "Two losses say nothing about a strategy with a large-sample backtest. Abandoning it now would be a decision made by emotion.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 11.2 — JOURNALS, ADHERENCE, REVIEWS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l33-journal-review",
    moduleId: "fx-w11-psychology",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.2"],
    title: "Trading Journals, Rule Adherence and Post-Trade Reviews",
    subtitle: "Grading the decision, not the outcome",
    estimatedMinutes: 18,
    intro:
      "A good decision can lose money and a terrible one can make it. If you judge trades by their result, you will learn from luck. This lesson gives you a way to grade every trade on the quality of the decision, which is the only thing you control.",

    atoms: [
      {
        id: "a-fx-process-vs-outcome",
        title: "Process versus outcome",
        explain:
          "Every trade has two separate qualities: its PROCESS (did you follow your rules?) and its OUTCOME (did it make money?). Put them in a grid and there are four kinds of trade. Only the process can be repeated on purpose.",
        table: {
          caption: "The four kinds of trade.",
          headers: ["", "Made money", "Lost money"],
          rows: [
            ["Followed the rules", "Earned win — repeat it", "Good loss — the cost of doing business; repeat it"],
            ["Broke the rules", "Lucky win — dangerous; it rewards a bad habit", "Deserved loss — the clearest lesson"],
          ],
        },
        why: "The 'lucky win' is the most dangerous trade a beginner can have, because it teaches them that breaking rules works. The 'good loss' is the one most beginners wrongly feel bad about.",
      },
      {
        id: "a-fx-journal-columns",
        title: "The full journal",
        explain:
          "By now your journal should record, for every trade: date and time, pair, direction, setup type, each checklist answer, entry, stop, target, lot size and risk; planned versus actual entry and exit; result in dollars and in R; costs; screenshots before and after; your emotional state before entry (calm, impatient, anxious, overconfident); and a PROCESS GRADE.",
        table: {
          caption: "A process grade, decided BEFORE looking at the result.",
          headers: ["Grade", "Meaning"],
          rows: [
            ["A", "Every rule followed: entry, size, stop, target, management"],
            ["B", "A minor deviation with no change to risk (e.g. entered 1 pip late)"],
            ["C", "A rule broken that changed the trade (early exit, moved target, skipped a filter)"],
            ["F", "No valid setup, or risk rules broken (oversized, no stop, revenge)"],
          ],
        },
      },
      {
        id: "a-fx-post-trade-review",
        title: "The post-trade and weekly review",
        explain:
          "After each trade, grade it and write one sentence on what happened. Each week, review all trades together: your RULE-ADHERENCE RATE (the percentage graded A or B), your most common error, and any emotion that kept appearing before C and F trades. Then choose one thing to improve next week, and only one.",
        decision: {
          scenario:
            "Review of a trade: you entered without waiting for the trigger candle to close, because price was 'clearly' turning. The trade hit its target for +2R.",
          question: "What process grade does it get?",
          options: [
            {
              id: "a",
              text: "A, because it made 2R",
              whyWrong: "The grade is about the decision, not the result. The entry rule was broken.",
            },
            {
              id: "b",
              text: "C: a rule that changes the trade was broken; record it as a lucky win",
              why: "Right. Entering before the close changes which trades you take. It worked this time, which is exactly what makes it a dangerous habit.",
            },
            {
              id: "c",
              text: "B, since it was only a little early",
              whyWrong: "A minor deviation does not change which trades are taken. Entering before the trigger exists does.",
            },
            {
              id: "d",
              text: "No grade; winning trades do not need reviewing",
              whyWrong: "Winning trades with broken rules need reviewing most of all.",
            },
          ],
          correct: "b",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 11.3 + 11.P — LOSS STREAKS, OVERTRADING, BREAKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "fx-l34-streaks-control",
    moduleId: "fx-w11-psychology",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.3", "11.P"],
    title: "Loss Streaks, Overtrading, Breaks and Emotional Control",
    subtitle: "Surviving the part of trading nobody posts online",
    estimatedMinutes: 20,
    intro:
      "Losing streaks are not a sign that something is wrong; they are a certainty for every strategy. What decides whether you survive them is the size of your risk and what you do in the middle of one. This lesson prepares you for both, then has you review trades as an independent judge of your own behaviour.",

    atoms: [
      {
        id: "a-fx-loss-streaks",
        title: "Losing streaks are normal",
        explain:
          "A strategy that wins 40% of the time will, over a few hundred trades, very likely produce runs of eight or more losses in a row. That is ordinary probability. At 1% risk per trade, eight losses cost about 8% of the account; at 5% they cost about a third.",
        calcExercise: {
          scenario: "Your $1,000 demo account risks 1% per trade, recalculated on the current balance each time. You lose eight trades in a row.",
          question: "What is the balance afterwards? Round to the cent.",
          unit: "USD",
          answer: 922.74,
          tolerance: 0.01,
          hint: "Each loss leaves 99% of the balance: multiply by 0.99 eight times.",
          working: "$1,000 × 0.99⁸ = $1,000 × 0.92274 = $922.74\nAt 5% per trade: $1,000 × 0.95⁸ = $663.42",
          check: { fn: "balanceAfterLosses", args: { balance: 1000, riskPercent: 1, losses: 8 } },
        },
      },
      {
        id: "a-fx-overtrading",
        title: "Overtrading",
        explain:
          "OVERTRADING is taking more trades than the strategy produces: trading out of boredom, lowering standards to find setups, trading extra pairs, or watching low timeframes all day. Its signs in the journal are a rising number of trades, a falling share of A grades and rising costs.",
        why: "Each extra trade without an edge has negative expectancy, because costs are certain. Overtrading turns a strategy with a small edge into a losing one.",
        mistake:
          "Measuring effort by how many trades you placed. In a good week, most of your work is analysis and waiting.",
      },
      {
        id: "a-fx-breaks",
        title: "Breaks and circuit breakers",
        explain:
          "Professionals use CIRCUIT BREAKERS: written rules that stop trading automatically. A daily loss limit (for example 2 losses or −2%), a weekly limit (for example −4%), a mandatory break after three consecutive losses to review whether rules were followed, and no trading when ill, exhausted or upset. A break is not a punishment; it protects the account from your worst decisions.",
        decision: {
          scenario:
            "You have hit your weekly loss limit of −4% on Wednesday. Every trade was graded A. You feel calm and think the losses were just normal variance.",
          question: "What do your rules say?",
          options: [
            {
              id: "a",
              text: "Stop trading for the rest of the week; use the time to review and backtest",
              why: "Right. The limit applies whatever the reason for the losses. Following it when you feel calm is what makes it reliable when you do not.",
            },
            {
              id: "b",
              text: "Continue, because all trades were A grades",
              whyWrong: "Circuit breakers that can be overridden by your own judgement do not protect you on the day your judgement is wrong.",
            },
            {
              id: "c",
              text: "Continue with half size",
              whyWrong: "A partial rule break is still a rule break.",
            },
            {
              id: "d",
              text: "Raise the weekly limit to −8% for this week only",
              whyWrong: "Changing a limit at the moment it binds defeats its purpose. Limits are reviewed calmly, at the weekly review, never mid-week.",
            },
          ],
          correct: "a",
        },
      },
      {
        id: "a-fx-emotional-control",
        title: "Emotional control is mostly design",
        explain:
          "Willpower is unreliable under stress, so disciplined traders rely on DESIGN instead: risk small enough that no single trade matters emotionally; pending orders and alerts so they are not staring at every tick; checklists so decisions are made before emotion arrives; and circuit breakers that end the day before tilt does. Write down how you feel before each trade, and you will start to see your own patterns.",
      },
      {
        id: "a-fx-practical-review",
        title: "Practical: reviewing trades independently of profit or loss",
        explain:
          "This week's practical is a review of at least twenty of your demo trades, graded on process only. Cover the result column before grading, so the outcome cannot influence you. Then uncover it and sort the trades into the four boxes: earned win, good loss, lucky win, deserved loss.",
        decision: {
          scenario:
            "In your review: Trade 7 followed every rule and lost 1R. Trade 8 was taken 10 minutes after Trade 7, with no setup and double size, and won 3R.",
          question: "Which behavioural mistake does the review identify?",
          options: [
            {
              id: "a",
              text: "Trade 7: the strategy failed",
              whyWrong: "Trade 7 is a good loss. Following the rules and losing is part of every strategy.",
            },
            {
              id: "b",
              text: "Trade 8: a revenge trade, with no setup and oversized risk, graded F despite the profit",
              why: "Right. The profit is irrelevant to the grade. This is the most dangerous pattern in the journal, because it was rewarded.",
            },
            {
              id: "c",
              text: "No mistakes; the two trades together made a profit",
              whyWrong: "Netting the results hides a revenge trade behind luck.",
            },
            {
              id: "d",
              text: "Trade 8 shows you should increase size after losses",
              whyWrong: "One lucky outcome is not evidence. Increasing size after losses is the exact behaviour that destroys accounts over time.",
            },
          ],
          correct: "b",
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro: "Use your journal. Grade process with the result column covered.",
      prompts: [
        "Add an 'emotional state before entry' column and a 'process grade' column to your journal if you have not already.",
        "Review at least twenty demo trades. Grade each A, B, C or F with the result hidden, then sort them into the four boxes.",
        "Calculate your rule-adherence rate: the percentage of trades graded A or B.",
        "Identify your single most frequent behavioural mistake and the emotion most often recorded before it.",
        "Write your circuit breakers (daily limit, weekly limit, break after three consecutive losses, conditions for not trading) into your strategy document.",
      ],
      closing:
        "Your review is assessed on honesty, not on how good the numbers look. A low adherence rate, honestly measured, is far more valuable than a high one you made up.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
