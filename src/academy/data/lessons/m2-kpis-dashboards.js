/**
 * MODULE · KPIs & DASHBOARD DESIGN (m2-kpis-dashboards)
 * Month 2 — Excel Data Analysis
 *
 * The module where the learner stops producing numbers and starts producing
 * something a busy person can act on in ten seconds.
 *
 * TEACHING APPROACH
 * A dashboard lesson made of prose teaches nothing, because every claim in it
 * is about how a picture READS. So the atoms here carry real rendered output:
 * stat tiles, bar charts, line charts and — where the lesson is about what NOT
 * to do — the bad chart itself, drawn from the same numbers so the comparison
 * is honest.
 *
 * The chart-selection atoms are graded practices. The learner is given a
 * business question and three genuine charts of the same data, and has to pick
 * the one that answers it. The wrong options are not strawmen; they are the
 * charts people actually build.
 *
 * NUMBERS: the same twelve orders used in m2-pivots, so nothing new has to be
 * learned to read the examples. Every figure here is one the pivot module
 * already computed and the validator already checks:
 *   618,000 total · Lagos 276,000 · Abuja 215,000 · Kano 127,000
 *   Jan 178,000 · Feb 237,000 · Mar 203,000 · 12 orders · avg 51,500
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s7-kpis-dashboards";

const MONTHS = ["Jan", "Feb", "Mar"];
const MONTH_REVENUE = [178000, 237000, 203000];
const STATES = ["Lagos", "Abuja", "Kano"];
const STATE_REVENUE = [276000, 215000, 127000];
const CATEGORIES = ["Electronics", "Fashion", "Groceries"];
const CATEGORY_REVENUE = [198000, 187000, 233000];

/** A small sheet for the KPI arithmetic practices. */
const KPI_SHEET = {
  A1: "Measure", B1: "Value",
  A2: "Revenue this month", B2: 618000,
  A3: "Target", B3: 600000,
  A5: "% of target",
};

const GROWTH_SHEET = {
  A1: "Month", B1: "Revenue",
  A2: "Jan", B2: 178000,
  A3: "Feb", B3: 237000,
  A5: "Growth Jan to Feb",
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l31-what-makes-a-kpi",
    moduleId: "m2-kpis-dashboards",
    sectionId: SECTION_ID,
    order: 1,
    title: "What Makes a Number a KPI",
    subtitle: "The difference between a metric and something worth watching",
    estimatedMinutes: 16,
    intro:
      "Most dashboards fail before a single chart is drawn, because the numbers chosen for them were never worth watching. A KPI is not just a number you can calculate. It is a number that changes what someone does.",

    atoms: [
      {
        id: "a-metric-vs-kpi",
        title: "A metric measures. A KPI decides.",
        explain:
          "A metric is anything you can count. A Key Performance Indicator is the small subset of metrics that are tied to a goal, where a bad reading triggers an action. Every KPI is a metric; almost no metric is a KPI.",
        why: "This distinction is the whole reason dashboards get ignored. Put forty metrics on a screen and the reader has to work out which ones matter — which is your job, not theirs. Put four KPIs on it and they know within seconds whether anything needs attention.",
        analogy:
          "A car measures hundreds of things. The dashboard shows you five, because those are the five where a bad reading means pull over. The rest are available when you go looking.",
        table: {
          caption: "The same business, metrics against KPIs.",
          headers: ["Number", "Metric or KPI?", "Why"],
          rows: [
            ["Total orders", "Metric", "Interesting, but no action attached"],
            ["Revenue vs monthly target", "KPI", "Below target means someone must act this week"],
            ["Average order value", "KPI", "A fall means pricing or product mix is shifting"],
            ["Number of Excel files exported", "Metric", "Nobody changes anything because of it"],
            ["Orders taking over 5 days to deliver", "KPI", "Directly triggers an operations conversation"],
          ],
          note: "Test it by asking: if this number doubled tomorrow, what would we DO? No answer means it is a metric.",
        },
      },
      {
        id: "a-kpi-tests",
        title: "The four tests a KPI must pass",
        explain:
          "It must be tied to a goal, measurable from data you actually have, owned by someone who can change it, and comparable against a target or a previous period. Fail any one and it is decoration.",
        why: "The 'owned by someone' test is the one people skip, and it is the one that kills dashboards. A number nobody is responsible for is a number nobody acts on, and a dashboard full of those stops being opened within a month.",
        table: {
          caption: "Running the tests on 'Average order value'.",
          headers: ["Test", "Passes?", "Detail"],
          rows: [
            ["Tied to a goal", "Yes", "Grow revenue without adding headcount"],
            ["Measurable", "Yes", "Amount ÷ order count, both in the data"],
            ["Owned", "Yes", "The sales lead sets pricing and product mix"],
            ["Comparable", "Yes", "51,500 this month against 48,200 last"],
          ],
          note: "A number that passes three of four is not 80% of a KPI. It is a metric with a nice name.",
        },
        mistake:
          "Choosing KPIs because the data is easy to get. The easiest number to calculate and the number that matters are almost never the same one.",
      },
      {
        id: "a-kpi-needs-comparison",
        title: "A number alone means nothing",
        explain:
          "Revenue of 618,000 is not good or bad. It is good against a target of 600,000 and bad against 800,000. Every KPI on a dashboard needs a comparison beside it — a target, last month, or the same month last year.",
        why: "This is the single highest-impact change you can make to any dashboard. A tile showing a bare number makes the reader do the comparison in their head, using whatever they half-remember. A tile showing the comparison has already answered the question.",
        kpis: [
          { label: "Revenue", value: "₦618,000", compare: "3% above target", direction: "up", note: "Target ₦600,000" },
          { label: "Orders", value: "12", compare: "2 fewer than Feb", direction: "down" },
          { label: "Avg order value", value: "₦51,500", compare: "up from ₦48,200", direction: "up" },
          { label: "Late deliveries", value: "1", compare: "same as Feb", direction: "flat", note: "Over 5 days" },
        ],
        table: {
          caption: "The same four numbers, with and without context.",
          headers: ["Bare number", "With comparison", "What the reader does"],
          rows: [
            ["Revenue ₦618,000", "₦618,000 — 3% above target", "Nothing needed. Move on."],
            ["Orders 12", "12 — two fewer than February", "Asks why volume fell"],
            ["Avg order ₦51,500", "₦51,500 — up from ₦48,200", "Sees fewer, larger orders"],
          ],
          note: "Read together, those three say: we hit target on fewer, bigger orders. That is a finding. The bare numbers are just numbers.",
        },
      },
      {
        id: "a-kpi-arithmetic",
        title: "Percentage of target",
        explain:
          "The most common KPI calculation there is: the actual divided by the target, formatted as a percentage. Above 100% is ahead, below is behind.",
        syntax: {
          pattern: "=actual / target",
          args: [
            ["actual", "The value achieved, such as B2."],
            ["target", "The goal it is measured against, such as B3. Lock it as $B$3 if you will fill the formula down a column of months."],
          ],
          returns: "A ratio. Format it as a percentage — 1.03 displays as 103%.",
          note: "Format, do not multiply. Writing =B2/B3*100 gives 103 as a raw number, which then breaks every percentage format and comparison you apply afterwards.",
        },
        exercise: {
          data: KPI_SHEET,
          rows: 7,
          cols: 2,
          target: "B5",
          expected: 1.03,
          mustUseFormula: true,
          task: "In B5, work out what percentage of the target this month's revenue represents. Revenue is in B2 and the target in B3.",
          hint: "Divide the actual by the target. Do not multiply by 100 — that is the number format's job.",
          successMessage:
            "1.03, which formats as 103%. Three percent ahead of target — and a reader can tell that at a glance, which a bare 618,000 never allowed.",
        },
      },
      {
        id: "a-kpi-growth",
        title: "Period-on-period growth",
        explain:
          "The second most common KPI calculation: the change divided by the starting value. Always divide by where you STARTED, not where you ended, or the percentage is wrong in a way that flatters or damns you at random.",
        syntax: {
          pattern: "=(new - old) / old",
          args: [
            ["new", "The current period's value."],
            ["old", "The previous period's value. This is the denominator — always the earlier figure."],
          ],
          returns: "A ratio. 0.331 formats as 33.1% growth; a negative result is a decline.",
          note: "Wrap it in IFERROR when `old` could be zero: a month with no sales gives #DIV/0!, and a dashboard full of errors gets closed.",
        },
        exercise: {
          data: GROWTH_SHEET,
          rows: 7,
          cols: 2,
          target: "B5",
          expected: 0.331,
          mustUseFormula: true,
          mustUse: "ROUND",
          task: "In B5, calculate the growth from January (B2) to February (B3) as a ratio, rounded to three decimal places.",
          hint: "The change is B3 minus B2. Divide that by B2, the month you started from, then wrap the whole thing in ROUND with 3.",
          successMessage:
            "0.331 — a 33.1% jump. Divide by the wrong month and you would have reported 24.9%, which is the same event described considerably less impressively.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l32-choosing-kpis",
    moduleId: "m2-kpis-dashboards",
    sectionId: SECTION_ID,
    order: 2,
    title: "Choosing the Right KPIs",
    subtitle: "Vanity metrics, leading indicators, and knowing when to stop",
    estimatedMinutes: 15,
    intro:
      "Choosing which numbers go on the dashboard is the most consequential decision in the whole build, and it happens before you open Excel. Choose badly and no amount of design rescues it.",

    atoms: [
      {
        id: "a-vanity-metrics",
        title: "Vanity metrics",
        explain:
          "A vanity metric is a number that only ever goes up, looks impressive, and cannot fall in a way that would make anyone act. Total registered users, cumulative revenue, total orders ever placed.",
        why: "Cumulative numbers always rise, so they always look like success. That is precisely why they get put on dashboards, and precisely why they are useless: a number that cannot deliver bad news cannot deliver news.",
        table: {
          caption: "Vanity, and the honest number underneath it.",
          headers: ["Vanity metric", "The useful version", "Why it is better"],
          rows: [
            ["Total users ever", "Users active this month", "Can fall, so it can warn you"],
            ["Cumulative revenue", "Revenue this month vs target", "Tied to a goal and a period"],
            ["Total orders ever", "Orders this month vs last", "Shows direction, not accumulation"],
            ["Page views", "Views that ended in an order", "Connected to something that matters"],
          ],
          note: "The test: can this number go DOWN? If not, it belongs in a press release, not on a dashboard.",
        },
        mistake:
          "Keeping a cumulative total on the dashboard because leadership likes seeing it rise. It will rise whatever happens, including while the business is failing.",
      },
      {
        id: "a-leading-lagging",
        title: "Leading and lagging indicators",
        explain:
          "A lagging indicator tells you what happened: revenue, orders closed, churn. A leading indicator predicts what is about to happen: proposals sent, orders in the pipeline, delivery times creeping up. You need both.",
        why: "Lagging indicators are accurate and too late. By the time revenue has fallen, the quarter it belonged to is over. Leading indicators are how you act while acting still changes the outcome.",
        table: {
          caption: "Pairing them for this business.",
          headers: ["Lagging (what happened)", "Leading (what is coming)"],
          rows: [
            ["Revenue this month", "Quotes sent this week"],
            ["Orders delivered", "Orders currently in transit over 3 days"],
            ["Customers who left", "Customers who have not ordered in 60 days"],
            ["Average order value", "Share of orders including a premium item"],
          ],
          note: "A dashboard of only lagging indicators is a history lesson. A dashboard of only leading ones has no idea whether any of it worked.",
        },
      },
      {
        id: "a-too-many-kpis",
        title: "Four to six, and no more",
        explain:
          "A dashboard has room for four to six KPIs. Beyond that the reader stops scanning and starts searching, and the whole advantage of a dashboard over a spreadsheet is gone.",
        why: "If everything is a key indicator then nothing is. The discipline of cutting to six forces the conversation nobody wants to have — which of these actually drives a decision — and that conversation is where the value in the project sits.",
        table: {
          caption: "Cutting a request of fourteen numbers down.",
          headers: ["Asked for", "Decision", "Reason"],
          rows: [
            ["Revenue vs target", "Keep", "The headline goal"],
            ["Orders this month", "Keep", "Explains revenue movement"],
            ["Average order value", "Keep", "The other half of that explanation"],
            ["Late deliveries", "Keep", "The one operational risk with an owner"],
            ["Revenue by state", "Demote to a chart", "A breakdown, not a KPI"],
            ["Revenue by category", "Demote to a chart", "Same"],
            ["Total users ever", "Cut", "Vanity — it cannot fall"],
            ["Eight more", "Cut or move to page 2", "Nobody acts on them weekly"],
          ],
          note: "Cut does not mean deleted. It means it lives one click away, where somebody who wants it can find it.",
        },
      },
      {
        id: "a-kpi-definition-written",
        title: "Write the definition down",
        explain:
          "Every KPI needs a one-line written definition: what is counted, what is excluded, over what period, against what comparison. Put it on the dashboard or one hover away.",
        why: "Without it, two people will compute 'active customers' differently and the argument will be about the number rather than the business. The definition is what makes a dashboard a shared fact instead of a starting position.",
        table: {
          caption: "A KPI definition that survives being challenged.",
          headers: ["Field", "Value"],
          rows: [
            ["Name", "Average order value"],
            ["Definition", "Total order amount ÷ number of orders"],
            ["Includes", "All completed orders in the calendar month"],
            ["Excludes", "Cancelled orders, and orders with an amount of 0"],
            ["Comparison", "Previous calendar month"],
            ["Owner", "Sales lead"],
            ["Source", "Orders export, refreshed each Monday"],
          ],
          note: "The Excludes line is the one that ends arguments. Everything else is usually agreed already.",
        },
        mistake:
          "Assuming the definition is obvious. 'Revenue' alone hides at least four questions: before or after tax, before or after refunds, booked or collected, and on what date.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l33-chart-selection",
    moduleId: "m2-kpis-dashboards",
    sectionId: SECTION_ID,
    order: 3,
    title: "Choosing the Chart",
    subtitle: "The form follows the question, never the other way round",
    estimatedMinutes: 18,
    intro:
      "There are perhaps five chart types you will ever need, and picking between them is not a matter of taste. Each question has a shape, and one form answers it faster than the others. This lesson makes you choose, with the real charts in front of you.",

    atoms: [
      {
        id: "a-form-follows-question",
        title: "The question picks the chart",
        explain:
          "Comparing amounts across categories is a bar chart. Change over time is a line. A single headline number is not a chart at all — it is a big number. Composition is usually a bar too, despite what everyone reaches for.",
        why: "Choosing the chart first and fitting the question to it is how dashboards end up with three pie charts and no answers. The form is a decision about how the reader's eye works, not about variety.",
        table: {
          caption: "The whole decision, in one table.",
          headers: ["The question is about…", "Use", "Because"],
          rows: [
            ["Comparing categories", "Bar / column", "The eye compares lengths accurately"],
            ["Change over time", "Line", "Slope is read as direction instantly"],
            ["One headline number", "A stat tile", "A chart of one value wastes the space"],
            ["Parts of a whole", "Bar, sorted", "Angles are read badly; lengths are not"],
            ["Two measures per category", "Grouped bar", "Never two y-axes — see below"],
          ],
          note: "Notice there is no row for 3-D, doughnut or radar. None of them answers a question the forms above do not answer better.",
        },
        charts: [
          {
            type: "column",
            title: "Change over time — a column chart works, but a line is faster",
            categories: MONTHS,
            series: [{ name: "Revenue", values: MONTH_REVENUE }],
            valuePrefix: "₦",
            caption:
              "You can read the trend here, but you read it by comparing three heights. The line chart below gives you the same information as a single shape.",
          },
          {
            type: "line",
            title: "The same three numbers as a line",
            categories: MONTHS,
            series: [{ name: "Revenue", values: MONTH_REVENUE }],
            valuePrefix: "₦",
            caption:
              "Up then slightly down. One glance, no comparing. That is why time goes on a line.",
          },
        ],
      },
      {
        id: "a-bar-vs-pie",
        title: "Bar against pie",
        explain:
          "A pie chart asks the reader to compare angles, which people do badly. A sorted bar chart asks them to compare lengths, which people do well. The bar wins at almost every size of question.",
        why: "With three nearly-equal slices — 32%, 30%, 38% — a pie makes ranking them genuinely hard. The same three numbers as bars are ordered before you have finished reading the title.",
        chartChoice: {
          question:
            "Your manager asks: which product category brings in the most revenue, and by how much? Which of these answers that fastest?",
          correct: "bar",
          options: [
            {
              id: "pie",
              label: "Pie chart",
              chart: {
                type: "pie",
                categories: CATEGORIES,
                series: [{ name: "Revenue", values: CATEGORY_REVENUE }],
              },
              whyWrong:
                "The three slices are 32%, 30% and 38%. Rank them without reading the labels — you cannot, because judging angles that close is something people are measurably bad at. And 'by how much' is unanswerable from a pie.",
            },
            {
              id: "bar",
              label: "Sorted bar chart",
              chart: {
                type: "bar",
                categories: ["Groceries", "Electronics", "Fashion"],
                series: [{ name: "Revenue", values: [233000, 198000, 187000] }],
                valuePrefix: "₦",
              },
            },
            {
              id: "line",
              label: "Line chart",
              chart: {
                type: "line",
                categories: CATEGORIES,
                series: [{ name: "Revenue", values: CATEGORY_REVENUE }],
                valuePrefix: "₦",
              },
              whyWrong:
                "A line implies the categories have an order and that the space between them means something. Electronics does not lead to Fashion. Lines are for time, not for categories.",
            },
          ],
          successMessage:
            "Sorted bars, labelled directly. Groceries leads at ₦233,000, ahead of Electronics by ₦35,000 — both the ranking and the gap are readable without effort.",
        },
      },
      {
        id: "a-line-for-time",
        title: "Time belongs on a line",
        explain:
          "When the x-axis is time, use a line. The slope between points carries the message, and a line renders that slope as a shape the eye reads in one movement.",
        chartChoice: {
          question:
            "You need to show the board how monthly revenue has moved across the quarter. Which chart?",
          correct: "line",
          options: [
            {
              id: "line",
              label: "Line chart over months",
              chart: {
                type: "line",
                categories: MONTHS,
                series: [{ name: "Revenue", values: MONTH_REVENUE }],
                valuePrefix: "₦",
              },
            },
            {
              id: "pie",
              label: "Pie of the three months",
              chart: {
                type: "pie",
                categories: MONTHS,
                series: [{ name: "Revenue", values: MONTH_REVENUE }],
              },
              whyWrong:
                "This says each month is a share of the quarter, which is true and useless. It cannot show that February was the peak and March fell back — the direction is the entire point and a pie has no direction.",
            },
            {
              id: "bar-state",
              label: "Bar chart by state",
              chart: {
                type: "bar",
                categories: STATES,
                series: [{ name: "Revenue", values: STATE_REVENUE }],
                valuePrefix: "₦",
              },
              whyWrong:
                "A perfectly good chart answering a completely different question. The board asked about movement over time; this shows a breakdown by place.",
            },
          ],
          successMessage:
            "Up to ₦237,000 in February, back to ₦203,000 in March. The shape says 'peaked and eased' before anyone reads a single number.",
        },
        why: "The commonest failure here is not choosing a pie. It is choosing a genuinely good chart that answers a question nobody asked — which is far harder to spot in review, because nothing about it looks wrong.",
      },
      {
        id: "a-dual-axis-never",
        title: "Never two y-axes",
        explain:
          "Plotting revenue and order count on one chart with two different vertical scales lets you make the two lines cross wherever you like. Change either scale and the apparent relationship changes with it.",
        why: "This is the most misleading chart in common business use, and mostly not on purpose. Because the scales are arbitrary, the 'correlation' the chart appears to show is something you chose rather than something you found.",
        table: {
          caption: "What to do instead.",
          headers: ["Situation", "Do this"],
          rows: [
            ["Two measures, different units", "Two charts, stacked, sharing an x-axis"],
            ["Comparing growth rates", "Index both to 100 at the start, one axis"],
            ["A total and its parts", "One chart for the total, one for the breakdown"],
            ["It really must be one chart", "It does not. This is the whole point."],
          ],
          note: "Two small charts above one another are read faster than one clever chart, and cannot mislead.",
        },
        charts: [
          {
            type: "column",
            title: "Revenue by month",
            categories: MONTHS,
            series: [{ name: "Revenue", values: MONTH_REVENUE }],
            valuePrefix: "₦",
          },
          {
            type: "column",
            title: "Orders by month — a second chart, not a second axis",
            categories: MONTHS,
            series: [{ name: "Orders", values: [4, 4, 4] }],
            caption:
              "Revenue swung by 59,000 across the quarter while order count never moved. On a dual-axis chart the two lines would have appeared to track each other, and that impression would have been manufactured by the choice of scales.",
          },
        ],
        mistake:
          "Using a second axis because the two measures 'look better together'. Looking better is exactly the symptom — you have made a relationship visible that the data does not support.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l34-layout",
    moduleId: "m2-kpis-dashboards",
    sectionId: SECTION_ID,
    order: 4,
    title: "Layout and Visual Hierarchy",
    subtitle: "Designing something readable in ten seconds",
    estimatedMinutes: 15,
    intro:
      "A dashboard is read in a hurry, usually on a phone, usually by someone about to walk into a meeting. Everything about the layout should serve that person.",

    atoms: [
      {
        id: "a-top-left-first",
        title: "The top-left is the most valuable space you have",
        explain:
          "Readers start at the top-left and sweep right, then down. Put the headline KPIs across the top, the supporting breakdown in the middle, and detail at the bottom. Nothing important goes bottom-right.",
        why: "You do not get to choose where people look first; you only get to choose what is there. Putting the most important number bottom-right means it is the last thing read, and often not read at all.",
        kpis: [
          { label: "Revenue vs target", value: "103%", compare: "₦618,000 of ₦600,000", direction: "up" },
          { label: "Orders", value: "12", compare: "2 fewer than Feb", direction: "down" },
          { label: "Avg order value", value: "₦51,500", compare: "up ₦3,300", direction: "up" },
          { label: "Late deliveries", value: "1", compare: "same as Feb", direction: "flat" },
        ],
        table: {
          caption: "The three-band layout.",
          headers: ["Band", "Holds", "Reader spends"],
          rows: [
            ["Top", "4–6 KPI tiles with comparisons", "3 seconds"],
            ["Middle", "2–3 charts explaining the KPIs", "10 seconds"],
            ["Bottom", "Detail table, filters, definitions", "Only if they need it"],
          ],
          note: "If someone has to scroll to learn whether things are going well, the layout has already failed.",
        },
      },
      {
        id: "a-five-second-rule",
        title: "The ten-second test",
        explain:
          "Show your dashboard to someone for ten seconds, take it away, and ask them: is the business doing well, and what needs attention? If they cannot answer both, the design is not finished.",
        why: "It is the only test that measures the thing you actually built it for. Every other review — colours, alignment, chart types — is a proxy for this, and a dashboard can pass all of them and still fail this one.",
        table: {
          caption: "What failure usually means.",
          headers: ["They said", "The problem"],
          rows: [
            ["I could not tell where to look", "Too many elements at equal weight"],
            ["I do not know if 618,000 is good", "KPIs have no comparison"],
            ["I read the chart titles instead", "The titles carry the message, not the charts"],
            ["I ran out of time", "Too much on one screen"],
          ],
          note: "Run it on someone who has not seen the data. Anyone who helped build it has already loaded the answers into their head.",
        },
      },
      {
        id: "a-grouping-and-whitespace",
        title: "Grouping, alignment and whitespace",
        explain:
          "Things that belong together should sit together, share an alignment and be separated from everything else by space. Whitespace is not wasted space — it is what tells the eye where one idea ends.",
        why: "Readers group things by position before they read a single label. Get the grouping wrong and they will connect two unrelated charts and draw a conclusion neither supports.",
        table: {
          caption: "Cheap changes with large effects.",
          headers: ["Change", "Effect"],
          rows: [
            ["Align every tile to one grid", "The screen stops feeling noisy"],
            ["Group related charts, space unrelated ones", "Relationships become visible"],
            ["One accent colour, used sparingly", "The accent means something again"],
            ["Remove one chart", "The remaining ones get read"],
          ],
          note: "The last row is the one nobody wants to hear and the one that helps most.",
        },
      },
      {
        id: "a-chart-junk",
        title: "Chart junk",
        explain:
          "Anything on a chart that is not carrying information is taking attention from what is. Gridlines shouting for attention, 3-D effects, heavy borders, a legend for a single series, a number printed on every bar.",
        why: "3-D is the worst offender because it does not merely distract, it distorts: the perspective makes front bars look bigger than back ones at the same value. You have decorated the chart into being wrong.",
        charts: [
          {
            type: "bar",
            title: "Clean: sorted, direct labels, recessive grid, no legend needed",
            categories: ["Lagos", "Abuja", "Kano"],
            series: [{ name: "Revenue", values: STATE_REVENUE }],
            valuePrefix: "₦",
            caption:
              "One series, so no legend box — the title names it. Labels sit at the end of each bar, so the reader never crosses to an axis to decode a value.",
          },
        ],
        table: {
          caption: "Remove these, in this order.",
          headers: ["Junk", "Replace with"],
          rows: [
            ["3-D effects", "Flat. Always."],
            ["A legend for one series", "A title naming the series"],
            ["A value on every bar", "Values on the ones being discussed"],
            ["Heavy gridlines", "Faint ones, or none with direct labels"],
            ["A rainbow of colours", "One colour, unless the colour means something"],
          ],
          note: "Colour should encode something. If every bar is a different colour and they are all the same measure, the colour is noise.",
        },
        mistake:
          "Using a different colour for each bar in a single-series chart. The reader looks for the meaning of the colours, finds none, and trusts the chart slightly less.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l35-interactivity-and-presenting",
    moduleId: "m2-kpis-dashboards",
    sectionId: SECTION_ID,
    order: 5,
    title: "Interactivity and Presenting Findings",
    subtitle: "Letting people explore, and telling them what you found",
    estimatedMinutes: 16,
    intro:
      "The last two steps are the ones that decide whether the work gets used: making the dashboard answer follow-up questions on its own, and saying out loud what it means.",

    atoms: [
      {
        id: "a-interactivity",
        title: "Interactivity, in one row at the top",
        explain:
          "Slicers and timelines let a reader filter without asking you. Put them in one row above the charts, connect one slicer to every pivot, and keep the number of controls small.",
        why: "Every filter you add is a question you no longer have to answer by email. It is also the difference between a report someone reads once and a tool they come back to.",
        table: {
          caption: "Which controls earn their place.",
          headers: ["Control", "Worth it when"],
          rows: [
            ["Date / timeline", "Almost always"],
            ["Region or state", "The reader owns a region"],
            ["Category", "Product mix is part of the decision"],
            ["Sales rep", "Only for the person who manages them"],
          ],
          note: "Four controls is plenty. Beyond that you have built a query tool, and people will go back to asking you instead.",
        },
        mistake:
          "Adding a slicer per pivot instead of connecting one slicer to all of them. The reader filters one chart, the others do not move, and they conclude the dashboard is broken — reasonably.",
      },
      {
        id: "a-dashboard-checklist",
        title: "The build checklist",
        explain:
          "Source formatted as a Table, pivots on a hidden calculation sheet, KPIs with comparisons across the top, two or three charts, one slicer row, definitions one hover away, and a visible 'last refreshed' date.",
        why: "The refresh date is the item people skip and the one that protects you. A dashboard with no date on it will eventually be screenshotted and circulated months later as though it were current.",
        table: {
          caption: "Before you send it.",
          headers: ["Check", "Catches"],
          rows: [
            ["Source is a Table (Ctrl+T)", "New rows silently excluded"],
            ["Pivots on a separate sheet", "A reader breaking the layout"],
            ["Every KPI has a comparison", "Numbers nobody can judge"],
            ["Grand totals match a trusted figure", "Filters and stale caches"],
            ["Last refreshed date is visible", "Old figures circulated as current"],
            ["Ten-second test passed", "Everything else"],
          ],
        },
      },
      {
        id: "a-presenting-findings",
        title: "Presenting what you found",
        explain:
          "Lead with the finding, then the evidence, then the recommendation. Not the method. Nobody in the room wants the story of how you cleaned the data.",
        why: "Analysts routinely present in the order they worked, which puts the conclusion last and loses the room by minute three. Reverse it: the conclusion is what they are there for, and the method is what you have ready for the person who challenges it.",
        table: {
          caption: "The same analysis, two orders.",
          headers: ["Worked order (loses the room)", "Presented order (keeps it)"],
          rows: [
            ["I cleaned the export", "Abuja earns 40% more per order than Lagos"],
            ["I built the pivots", "Three orders, ₦215,000, average ₦71,667"],
            ["I found an outlier", "One 980,000 order flatters that — excluding it, ₦58,500"],
            ["Abuja earns more per order", "Recommend testing Abuja's product mix in Lagos"],
          ],
          note: "The outlier still gets mentioned. Putting it third makes you credible; leaving it out entirely is where analysts lose their reputation.",
        },
      },
      {
        id: "a-so-what",
        title: "The 'so what' test",
        explain:
          "For every chart and every KPI on the dashboard, answer: so what? If the honest answer is 'it is interesting', it does not go on the dashboard.",
        why: "This is the same discipline as the metric-versus-KPI test at the start of the module, applied at the end when the dashboard exists and cutting things is painful. Applying it twice is why good dashboards stay small.",
        kpis: [
          { label: "Revenue vs target", value: "103%", compare: "so what: on track, no action", direction: "up" },
          { label: "Orders", value: "12", compare: "so what: volume fell, check pipeline", direction: "down" },
          { label: "Late deliveries", value: "1", compare: "so what: within tolerance", direction: "flat" },
        ],
        table: {
          caption: "Running it on four candidates.",
          headers: ["Element", "So what?", "Verdict"],
          rows: [
            ["Revenue vs target", "On track — nobody acts", "Keep: absence of action IS the answer"],
            ["Orders down 2", "Check whether the pipeline is thinning", "Keep"],
            ["Revenue by state", "Abuja over-indexes on order size", "Keep as a chart"],
            ["Total orders ever", "Nothing. It only rises.", "Cut"],
          ],
          note: "A KPI that says 'no action needed' has passed the test. A KPI that cannot say anything has not.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
