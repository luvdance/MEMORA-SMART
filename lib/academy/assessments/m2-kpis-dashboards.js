/**
 * ASSESSMENTS · KPIs & DASHBOARD DESIGN (m2-kpis-dashboards)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Design questions are easy to write as opinion polls. These are not: each one
 * has a defensible right answer that follows from how reading works or from
 * what the numbers actually say, and each wrong option is a choice a competent
 * person genuinely makes.
 *
 * Figures come from the same twelve orders used across Month 2:
 *   618,000 total · 12 orders · avg 51,500 · target 600,000 (103%)
 *   Jan 178,000 · Feb 237,000 · Mar 203,000
 *   Lagos 276,000 (6) · Abuja 215,000 (3) · Kano 127,000 (3)
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l31-what-makes-a-kpi": {
    lessonId: "l31-what-makes-a-kpi",
    passMark: 70,
    questions: [
      {
        id: "q31-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-metric-vs-kpi",
        prompt:
          "Which of these is a KPI rather than a metric?",
        options: [
          { id: "a", text: "Number of spreadsheets exported this month" },
          { id: "b", text: "Revenue against this month's target" },
          { id: "c", text: "Total orders ever placed" },
          { id: "d", text: "Number of columns in the source data" },
        ],
        correct: "b",
        explanation:
          "It is tied to a goal, it has an owner who can act on it, and it can go down. Falling below target triggers a conversation this week — which is the test a KPI has to pass.",
        whyWrong: {
          a: "Nobody changes a decision because exports rose. It is measurable and irrelevant, which is the definition of a metric.",
          c: "A cumulative total can only rise, so it can never deliver bad news, so nobody ever acts on it.",
          d: "A fact about the file, not about the business.",
        },
      },
      {
        id: "q31-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-kpi-tests",
        prompt:
          "A proposed KPI is tied to a goal, measurable, and comparable to last month — but no single person can influence it. What should you do?",
        options: [
          { id: "a", text: "Include it — three of four tests is good enough" },
          { id: "b", text: "Leave it off the dashboard, or find the owner first" },
          { id: "c", text: "Include it but make it smaller" },
          { id: "d", text: "Include it and assign it to everyone" },
        ],
        correct: "b",
        explanation:
          "An unowned number is one nobody acts on, and a dashboard of those stops being opened within a month. Either find the person who can move it, or leave it out.",
        whyWrong: {
          a: "The tests are not a score. A number nobody can act on fails at the only thing a KPI is for.",
          c: "Size changes how much attention it gets, not whether anyone can do anything about it.",
          d: "A number owned by everyone is owned by nobody. This is the same failure with extra names attached.",
        },
      },
      {
        id: "q31-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-kpi-needs-comparison",
        prompt:
          "Your dashboard shows 'Revenue ₦618,000' and nothing else beside it. What is missing?",
        options: [
          { id: "a", text: "A chart" },
          { id: "b", text: "A comparison — a target, last month, or the same month last year" },
          { id: "c", text: "The currency symbol" },
          { id: "d", text: "More decimal places" },
        ],
        correct: "b",
        explanation:
          "618,000 is neither good nor bad on its own. Against a target of 600,000 it is 3% ahead and needs no action; against 800,000 it is a problem. Without the comparison the reader does it from memory, badly.",
        whyWrong: {
          a: "A chart of one number wastes space. The tile is the right form; it is the context that is absent.",
          c: "The symbol is already there, and it would not help anyone judge the figure.",
          d: "More precision on a number nobody can evaluate adds nothing.",
        },
      },
      {
        id: "q31-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-kpi-growth",
        prompt:
          "January was ₦178,000 and February ₦237,000. Which formula gives the correct growth?",
        options: [
          { id: "a", text: "=(237000-178000)/178000, giving 33.1%" },
          { id: "b", text: "=(237000-178000)/237000, giving 24.9%" },
          { id: "c", text: "=237000/178000, giving 133%" },
          { id: "d", text: "=237000-178000, giving 59,000" },
        ],
        correct: "a",
        explanation:
          "Growth divides the change by where you STARTED. 59,000 ÷ 178,000 = 33.1%. Dividing by February instead gives 24.9%, which understates the same event by nearly a third.",
        whyWrong: {
          b: "This divides by the end value. It is the commonest growth error and it always reports the wrong figure.",
          c: "133% is February as a proportion of January, not the growth. Growth is that minus 100%.",
          d: "59,000 is the change in naira, which is useful but is not a percentage and cannot be compared across different-sized months.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l32-choosing-kpis": {
    lessonId: "l32-choosing-kpis",
    passMark: 70,
    questions: [
      {
        id: "q32-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-vanity-metrics",
        prompt:
          "What makes 'total registered users, all time' a vanity metric?",
        options: [
          { id: "a", text: "It is hard to calculate" },
          { id: "b", text: "It can only ever rise, so it can never tell anyone to act" },
          { id: "c", text: "It is not accurate" },
          { id: "d", text: "Users are not important" },
        ],
        correct: "b",
        explanation:
          "A cumulative total rises whatever happens, including while the business is failing. A number that cannot deliver bad news cannot deliver news. 'Users active this month' can fall, so it can warn you.",
        whyWrong: {
          a: "It is one of the easiest numbers to calculate, which is part of why it ends up on dashboards.",
          c: "It is usually perfectly accurate. Accuracy is not the problem; usefulness is.",
          d: "Users matter enormously, which is why the useful version of this number deserves the space instead.",
        },
      },
      {
        id: "q32-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-leading-lagging",
        prompt:
          "Which of these is a LEADING indicator for revenue?",
        options: [
          { id: "a", text: "Revenue last month" },
          { id: "b", text: "Quotes sent this week" },
          { id: "c", text: "Orders delivered last quarter" },
          { id: "d", text: "Customers who left last year" },
        ],
        correct: "b",
        explanation:
          "Quotes sent today become revenue in the coming weeks, so a fall warns you while acting still changes the outcome. The other three describe events that are already finished.",
        whyWrong: {
          a: "Accurate and too late. By the time revenue has fallen, the period it belonged to is over.",
          c: "A lagging indicator, and a stale one — last quarter closed some time ago.",
          d: "Churn already happened. The leading version is customers who have not ordered in 60 days.",
        },
      },
      {
        id: "q32-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-too-many-kpis",
        prompt:
          "A stakeholder asks for fourteen numbers on one dashboard. What is the right response?",
        options: [
          { id: "a", text: "Put all fourteen on — they asked for them" },
          { id: "b", text: "Agree the four to six that drive decisions, and move the rest one click away" },
          { id: "c", text: "Refuse the request" },
          { id: "d", text: "Put fourteen on but shrink them" },
        ],
        correct: "b",
        explanation:
          "Beyond about six the reader stops scanning and starts searching, which is the moment a dashboard becomes a spreadsheet. Cutting is not deletion — the other eight live on a second page for whoever wants them.",
        whyWrong: {
          a: "If everything is key, nothing is. Fourteen equal-weight numbers give the reader no idea where to look.",
          c: "The request is reasonable; the single screen is not. Your job is to structure it, not to refuse it.",
          d: "Shrinking keeps every element competing for attention and makes them all harder to read as well.",
        },
      },
      {
        id: "q32-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-kpi-definition-written",
        prompt:
          "Two teams report different figures for 'active customers' from the same database. What is the most likely cause?",
        options: [
          { id: "a", text: "One team made an arithmetic error" },
          { id: "b", text: "No written definition, so each team chose its own rule for 'active'" },
          { id: "c", text: "The database is corrupted" },
          { id: "d", text: "Excel rounds differently on different machines" },
        ],
        correct: "b",
        explanation:
          "Active in the last 30 days or 90? Counting cancelled orders? Including trials? Without a written definition — especially the Excludes line — two competent people reach two different, defensible numbers and the meeting is about the number instead of the business.",
        whyWrong: {
          a: "Possible, but when two teams disagree systematically the cause is almost always definitional.",
          c: "A corrupt database would cause far more visible problems than one disputed count.",
          d: "Excel does not round differently between machines. That is not a real failure mode here.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l33-chart-selection": {
    lessonId: "l33-chart-selection",
    passMark: 70,
    questions: [
      {
        id: "q33-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-bar-vs-pie",
        prompt:
          "Three categories are 32%, 30% and 38% of revenue. Why is a bar chart better than a pie here?",
        options: [
          { id: "a", text: "Bar charts are more modern" },
          { id: "b", text: "People compare lengths accurately and angles badly, and these three slices are nearly equal" },
          { id: "c", text: "Pie charts cannot show percentages" },
          { id: "d", text: "Bar charts use less space" },
        ],
        correct: "b",
        explanation:
          "Judging which of three near-equal angles is largest is something people are measurably bad at. As sorted bars the ranking is readable before you finish the title — and 'by how much' becomes answerable too.",
        whyWrong: {
          a: "Fashion is not a reason. The reason is about how human perception works.",
          c: "Pies show percentages perfectly well. The difficulty is comparing them.",
          d: "Space is not the issue, and a pie is often the more compact of the two.",
        },
      },
      {
        id: "q33-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-line-for-time",
        prompt:
          "Why does monthly revenue belong on a line chart rather than a pie of the three months?",
        options: [
          { id: "a", text: "A pie cannot hold three values" },
          { id: "b", text: "A line shows direction — that February peaked and March fell back — which a pie cannot express" },
          { id: "c", text: "Lines are easier to build" },
          { id: "d", text: "Pies only work with percentages" },
        ],
        correct: "b",
        explanation:
          "The message is movement, and slope renders movement as a shape the eye reads in one go. A pie of three months says each is a share of the quarter — true, and useless for a question about trend.",
        whyWrong: {
          a: "Three values is a perfectly normal pie. It is the wrong form, not an impossible one.",
          c: "Both take seconds to build. Ease is not the criterion.",
          d: "A pie converts any values to shares automatically. That is not the limitation.",
        },
      },
      {
        id: "q33-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dual-axis-never",
        prompt:
          "Why should you avoid plotting revenue and order count on one chart with two y-axes?",
        options: [
          { id: "a", text: "Excel cannot do it" },
          { id: "b", text: "The two scales are arbitrary, so you can make the lines appear to track each other by choosing them" },
          { id: "c", text: "It uses too much colour" },
          { id: "d", text: "It is slower to render" },
        ],
        correct: "b",
        explanation:
          "Because you choose both scales, you choose where the lines cross. Any correlation the chart appears to show is something you manufactured rather than something you found. Two stacked charts sharing an x-axis show the same data and cannot mislead.",
        whyWrong: {
          a: "Excel supports it readily, which is exactly why the chart is so common.",
          c: "Colour is not the problem. The scales are.",
          d: "Rendering speed is irrelevant to whether a chart tells the truth.",
        },
      },
      {
        id: "q33-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-form-follows-question",
        prompt:
          "The board asked how revenue moved across the quarter. You show them a well-made bar chart of revenue by state. What is wrong?",
        options: [
          { id: "a", text: "Nothing — it is a good chart" },
          { id: "b", text: "It answers a different question from the one asked" },
          { id: "c", text: "Bar charts cannot show revenue" },
          { id: "d", text: "It should have been a pie" },
        ],
        correct: "b",
        explanation:
          "The chart is fine; it is about place, and the question was about time. This is the hardest failure to catch in review, because nothing about the chart looks wrong — which is why the question, not the chart, has to be settled first.",
        whyWrong: {
          a: "A correct chart answering the wrong question is still a wasted slide, and the board still has no answer.",
          c: "Bar charts show revenue well. The dimension is the mismatch, not the measure.",
          d: "A pie would answer the wrong question too, and less clearly.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l34-layout": {
    lessonId: "l34-layout",
    passMark: 70,
    questions: [
      {
        id: "q34-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-top-left-first",
        prompt:
          "Where should the most important KPI go?",
        options: [
          { id: "a", text: "Bottom right, as the conclusion" },
          { id: "b", text: "Top left, where the eye starts" },
          { id: "c", text: "Centre, for balance" },
          { id: "d", text: "Anywhere, as long as it is large" },
        ],
        correct: "b",
        explanation:
          "Readers start top-left and sweep right, then down. You cannot choose where people look first — only what is waiting there.",
        whyWrong: {
          a: "Bottom-right is read last and often not at all, especially on a phone where it needs a scroll.",
          c: "Centring fights the natural reading path instead of using it.",
          d: "Size helps, but a large tile in a corner still loses to a modest one in the top-left.",
        },
      },
      {
        id: "q34-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-five-second-rule",
        prompt:
          "You show someone your dashboard for ten seconds and they say 'I could not tell where to look'. What does that indicate?",
        options: [
          { id: "a", text: "They were not paying attention" },
          { id: "b", text: "Too many elements carry equal visual weight, so nothing is signalled as most important" },
          { id: "c", text: "The colours are wrong" },
          { id: "d", text: "They needed more time" },
        ],
        correct: "b",
        explanation:
          "When everything is the same size and weight the reader has to search rather than scan, and searching is what a dashboard exists to remove. The fix is hierarchy: make the important things bigger and give them the top band.",
        whyWrong: {
          a: "Ten seconds of distracted attention is a realistic simulation of how it will actually be read.",
          c: "Colour might be a symptom, but 'where do I look' is a hierarchy problem first.",
          d: "More time is exactly what the real reader will not have. The test is calibrated deliberately.",
        },
      },
      {
        id: "q34-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-chart-junk",
        prompt:
          "Why is a 3-D bar chart worse than merely ugly?",
        options: [
          { id: "a", text: "It renders slowly" },
          { id: "b", text: "The perspective distorts the values, making front bars look larger than equal bars behind" },
          { id: "c", text: "It cannot be printed" },
          { id: "d", text: "It uses more colours" },
        ],
        correct: "b",
        explanation:
          "This is the distinction between decoration and distortion. Other chart junk steals attention; 3-D actually changes the apparent values, so a reader comparing two equal bars sees a difference that is not there.",
        whyWrong: {
          a: "Rendering time is irrelevant, and would not matter if the chart were honest.",
          c: "It prints fine. It just prints something misleading.",
          d: "Colour count is not the issue; the geometry is.",
        },
      },
      {
        id: "q34-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-grouping-and-whitespace",
        prompt:
          "Your dashboard feels cluttered. Which change usually helps most?",
        options: [
          { id: "a", text: "Make every element smaller to fit more in" },
          { id: "b", text: "Remove one chart, and put space between the groups that remain" },
          { id: "c", text: "Add borders around everything" },
          { id: "d", text: "Give each chart a different colour scheme" },
        ],
        correct: "b",
        explanation:
          "Clutter is competition for attention, so the fix is fewer competitors and clearer grouping. Whitespace is what tells the eye where one idea ends and the next begins.",
        whyWrong: {
          a: "Shrinking keeps every element competing and makes them all harder to read as well.",
          c: "Borders add more lines to an already busy screen. Space separates better than a rule does.",
          d: "Multiple colour schemes make the screen noisier and drain any meaning colour had.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l35-interactivity-and-presenting": {
    lessonId: "l35-interactivity-and-presenting",
    passMark: 70,
    questions: [
      {
        id: "q35-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-interactivity",
        prompt:
          "A reader filters your dashboard to Lagos and only one of the four charts changes. What went wrong?",
        options: [
          { id: "a", text: "The other charts are broken" },
          { id: "b", text: "The slicer is connected to only one pivot instead of all of them" },
          { id: "c", text: "Lagos has no data in the other charts" },
          { id: "d", text: "The file needs reopening" },
        ],
        correct: "b",
        explanation:
          "A slicer drives only the pivots it is connected to, via Report Connections. Connect it to all four and the dashboard behaves as one thing — which is what the reader assumed it already was.",
        whyWrong: {
          a: "They are working correctly; they were simply never wired to that slicer.",
          c: "Lagos is the largest state in this dataset, so it has data everywhere.",
          d: "Reopening changes nothing. The connection has to be made.",
        },
      },
      {
        id: "q35-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dashboard-checklist",
        prompt:
          "Why does a dashboard need a visible 'last refreshed' date?",
        options: [
          { id: "a", text: "To show how hard you worked" },
          { id: "b", text: "Because it will be screenshotted and circulated later, and without a date nobody can tell it is stale" },
          { id: "c", text: "Excel requires it" },
          { id: "d", text: "To satisfy the file format" },
        ],
        correct: "b",
        explanation:
          "Dashboards outlive the moment they were built. A screenshot with no date on it reads as current forever, and a stale figure presented as current is how a decision gets made on last quarter's numbers.",
        whyWrong: {
          a: "The date is for the reader's protection, not your credit.",
          c: "Excel requires nothing of the sort. It is a discipline, not a feature.",
          d: "File formats have their own timestamps, which nobody sees in a screenshot.",
        },
      },
      {
        id: "q35-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-presenting-findings",
        prompt:
          "You have ten minutes to present. What should the first sentence be?",
        options: [
          { id: "a", text: "How you cleaned the data" },
          { id: "b", text: "The finding — Abuja earns roughly 40% more per order than Lagos" },
          { id: "c", text: "Which Excel features you used" },
          { id: "d", text: "The size of the dataset" },
        ],
        correct: "b",
        explanation:
          "Lead with the finding, then the evidence, then the recommendation. Presenting in the order you worked puts the conclusion last and loses the room long before you reach it. The method is what you have ready for whoever challenges you.",
        whyWrong: {
          a: "Necessary work, and of interest to nobody in that room unless they ask.",
          c: "Tooling is a detail. The audience cares what is true, not how you found out.",
          d: "Context can come later in one line, if at all.",
        },
      },
      {
        id: "q35-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-so-what",
        prompt:
          "A KPI on your dashboard reads 103% of target, and the honest 'so what' is 'we are on track, nobody needs to act'. Should it stay?",
        options: [
          { id: "a", text: "No — if no action is needed it is wasting space" },
          { id: "b", text: "Yes — 'no action needed' is a real answer, and knowing that instantly is the point" },
          { id: "c", text: "Only if it turns red sometimes" },
          { id: "d", text: "Replace it with a chart" },
        ],
        correct: "b",
        explanation:
          "The test is whether the number can say something, not whether it currently says something alarming. Confirming the headline goal is on track is exactly what a reader opens a dashboard for. The elements that fail are the ones that cannot say anything in any state — like a cumulative total.",
        whyWrong: {
          a: "This confuses 'no action today' with 'no information'. The reader learned something in one second.",
          c: "It will turn red when performance slips. Judging it only by today's value misses the point.",
          d: "A chart of one value against a target is a worse use of the space than the tile already is.",
        },
      },
    ],
  },
};
