/**
 * MODULE · VISUALISATION & DATA STORYTELLING (m3-visualisation)
 * Month 3 — Power BI · the last module of the Power BI month
 *
 * Month 2's dashboard module taught chart selection from an Excel starting
 * point. This one is about Power BI's own visual vocabulary — stacked against
 * grouped, scatter, cards, matrix — plus the interactivity that only exists in
 * a real BI tool, and then the storytelling that decides whether any of it
 * gets used.
 *
 * TEACHING APPROACH
 * Every claim about how a chart READS is shown as a rendered chart, not
 * described. Where two visuals are both defensible, the learner has to CHOOSE
 * between them in a graded practice, with the real charts of the real data in
 * front of them — because chart selection is a judgement, and judgement is not
 * tested by recall.
 *
 * Four graded chart-selection practices in this module. Each one has wrong
 * options that are charts people genuinely build, not strawmen.
 *
 * VERIFIED NUMBERS — all from the Month 2 sales data, already checked by the
 * pivot engine, plus one statistic computed for this module:
 *   Lagos 276,000 · Abuja 215,000 · Kano 127,000 · total 618,000
 *   Jan 178,000 · Feb 237,000 · Mar 203,000
 *   Cross-tab: Lagos 92/56/128 · Abuja 55/98/62 · Kano 51/33/43 (E/F/G)
 *   Units against Amount: Pearson r = -0.039 — NO relationship
 *   Price per unit ranges 3,500 to 25,500 — a 7x spread
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s13-visualisation";

const STATES = ["Lagos", "Abuja", "Kano"];
const STATE_REVENUE = [276000, 215000, 127000];
const MONTHS = ["Jan", "Feb", "Mar"];
const MONTH_REVENUE = [178000, 237000, 203000];

/** The state × category cross-tab, as three series. */
const MIX = {
  categories: STATES,
  series: [
    { name: "Electronics", values: [92000, 55000, 51000] },
    { name: "Fashion", values: [56000, 98000, 33000] },
    { name: "Groceries", values: [128000, 62000, 43000] },
  ],
};

/** Twelve orders as points: units against order value. r = -0.039. */
const ORDER_POINTS = [
  ["ORD-1", 45000, 3], ["ORD-2", 62000, 12], ["ORD-3", 38000, 9], ["ORD-4", 51000, 2],
  ["ORD-5", 47000, 4], ["ORD-6", 98000, 6], ["ORD-7", 43000, 11], ["ORD-8", 56000, 5],
  ["ORD-9", 55000, 3], ["ORD-10", 49000, 14], ["ORD-11", 33000, 4], ["ORD-12", 41000, 10],
].map(([label, amount, units]) => ({ x: units, y: amount, label }));

const SCATTER = [
  {
    name: "Orders",
    xLabel: "Units in the order",
    points: ORDER_POINTS,
  },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l57-visual-vocabulary",
    moduleId: "m3-visualisation",
    sectionId: SECTION_ID,
    order: 1,
    title: "Power BI's Visual Vocabulary",
    subtitle: "What to reach for, and what to leave in the gallery",
    estimatedMinutes: 16,
    intro:
      "Power BI ships around thirty visuals and you will use six of them. This lesson is about which six, and about resisting the other twenty-four — because a visual chosen for novelty costs the reader time they did not have.",

    atoms: [
      {
        id: "a-viz-six",
        title: "The six that do almost everything",
        explain:
          "Card for a single number. Bar or column for comparing categories. Line for change over time. Table or matrix for detail. Scatter for a relationship between two measures. Slicer for control. That is the working set.",
        why: "Every visual you add is a demand on the reader's attention, and an unfamiliar one demands more. Sticking to a small, well-chosen set means a reader who has seen one of your reports can read the next one immediately.",
        table: {
          caption: "The working set, and the question each answers.",
          headers: ["Visual", "Answers", "Reach for it when"],
          rows: [
            ["Card", "What is the number?", "One headline figure with a comparison"],
            ["Bar / column", "Which is biggest?", "Comparing categories"],
            ["Line", "Which way is it going?", "Anything over time"],
            ["Matrix", "What are the details?", "A cross-tab someone must read exactly"],
            ["Scatter", "Do these two move together?", "Testing a relationship"],
            ["Slicer", "Let me look at my bit", "Any report with more than one reader"],
          ],
          note: "Notice what is absent: gauge, funnel, treemap, radar, and the whole of the custom visual marketplace. Each has a narrow correct use and a very wide misuse.",
        },
      },
      {
        id: "a-viz-card-vs-chart",
        title: "One number belongs on a card",
        explain:
          "A single value drawn as a chart wastes the space a chart needs and adds nothing a big number does not already say. Put it on a card, with its comparison underneath.",
        kpis: [
          { label: "Revenue", value: "₦618,000", compare: "3% above target", direction: "up", note: "Target ₦600,000" },
          { label: "Orders", value: "12", compare: "2 fewer than Feb", direction: "down" },
          { label: "Avg order value", value: "₦51,500", compare: "up from ₦48,200", direction: "up" },
        ],
        why: "This is the Month 2 lesson in Power BI's vocabulary. The card is the top-left of your report — the thing read in the first three seconds — and it only works if it carries its comparison. A bare ₦618,000 makes the reader judge it from memory.",
        mistake:
          "Using a gauge for a KPI against target. It occupies four times the space of a card to show one number and a threshold, and the needle position is harder to read precisely than the digits would have been.",
      },
      {
        id: "a-viz-choose-one",
        title: "Choose the visual for the question",
        explain:
          "The question decides the form. Here the question is about change over three months, and three of these are real charts of the same real data.",
        chartChoice: {
          question:
            "The board asks: how has revenue moved across the quarter? Which of these answers that fastest?",
          correct: "line",
          options: [
            {
              id: "line",
              label: "Line chart by month",
              chart: {
                type: "line",
                categories: MONTHS,
                series: [{ name: "Revenue", values: MONTH_REVENUE }],
                valuePrefix: "₦",
              },
            },
            {
              id: "bar",
              label: "Bar chart by state",
              chart: {
                type: "bar",
                categories: STATES,
                series: [{ name: "Revenue", values: STATE_REVENUE }],
                valuePrefix: "₦",
              },
              whyWrong:
                "A good chart answering a different question. The board asked about movement over TIME; this shows a breakdown by PLACE. This is the hardest failure to catch in review, because nothing about the chart looks wrong.",
            },
            {
              id: "stacked100",
              label: "100% stacked by state",
              chart: {
                type: "stacked100",
                ...MIX,
                valuePrefix: "₦",
              },
              whyWrong:
                "This shows the product MIX within each state — a real and useful view, and completely unrelated to the quarter's trend. It also hides the totals entirely, so you could not see revenue move even if time were on the axis.",
            },
          ],
          successMessage:
            "Up to ₦237,000 in February, back to ₦203,000 in March. The slope says 'peaked and eased' before anyone reads a number, which is why time belongs on a line.",
        },
      },
      {
        id: "a-viz-matrix",
        title: "Table and matrix — when numbers must be exact",
        explain:
          "A matrix is a pivot table: rows, columns and aggregated values. Use it when the reader needs the precise figure rather than the shape — reconciliation, audit, a finance pack.",
        why: "Charts are for comparison and tables are for lookup, and confusing the two frustrates everyone. Nobody reads a precise figure off a bar; nobody sees a trend in a table of forty rows.",
        table: {
          caption: "Chart or matrix?",
          headers: ["The reader wants to", "Use"],
          rows: [
            ["See which state is biggest", "Bar chart"],
            ["Read Lagos Groceries to the naira", "Matrix"],
            ["Spot the trend", "Line chart"],
            ["Reconcile against the finance system", "Matrix"],
            ["Both", "A chart, with a matrix on a drillthrough page"],
          ],
          note: "The last row is the professional answer: lead with the chart and put the detail one click away, rather than compromising on a visual that does neither job well.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l58-comparison-composition",
    moduleId: "m3-visualisation",
    sectionId: SECTION_ID,
    order: 2,
    title: "Comparison and Composition",
    subtitle: "Stacked, grouped, or 100% stacked — they answer different questions",
    estimatedMinutes: 18,
    intro:
      "Three bar charts of exactly the same numbers, answering three different questions. Choosing between them is the most common visual decision you will make in Power BI, and the one most often made by accident.",

    atoms: [
      {
        id: "a-viz-three-bars",
        title: "The same data, three ways",
        explain:
          "Stacked shows the total and its parts. Grouped shows each part compared across categories. 100% stacked shows the mix within each category and hides the totals entirely.",
        charts: [
          {
            type: "stacked",
            title: "Stacked — the total, and what it is made of",
            ...MIX,
            valuePrefix: "₦",
            caption:
              "You can read each state's TOTAL from the bar height: Lagos ₦276,000, Abuja ₦215,000, Kano ₦127,000. What you cannot do easily is compare the Fashion segments, because only the bottom segment starts from a common baseline.",
          },
          {
            type: "column",
            title: "Grouped — each category compared across states",
            ...MIX,
            valuePrefix: "₦",
            caption:
              "Now every bar starts at zero, so Fashion is directly comparable: Abuja ₦98,000 against Lagos ₦56,000 and Kano ₦33,000. The trade-off is that the state totals have disappeared.",
          },
          {
            type: "stacked100",
            title: "100% stacked — the mix, with totals removed",
            ...MIX,
            valuePrefix: "₦",
            caption:
              "Every bar is the same height, so this can only answer questions about PROPORTION. It shows that Abuja's revenue is dominated by Fashion in a way Lagos's is not — and it would show that identically whether Abuja sold ₦215,000 or ₦2.",
          },
        ],
        table: {
          caption: "Which one the question needs.",
          headers: ["The question is about", "Use", "What you give up"],
          rows: [
            ["Totals and their parts", "Stacked", "Comparing inner segments"],
            ["One category across groups", "Grouped", "The totals"],
            ["Proportion within each group", "100% stacked", "The totals, completely"],
            ["Totals only", "Plain bar", "The breakdown"],
          ],
          note: "The 100% stacked row carries a warning: because every bar is full height, a tiny category looks exactly as important as a huge one. Always put the totals somewhere on the page beside it.",
        },
      },
      {
        id: "a-viz-stacked-trap",
        title: "Why inner segments are hard to compare",
        explain:
          "In a stacked bar only the bottom segment sits on a common baseline. Every segment above it starts wherever the one below ended, so comparing them means judging lengths that begin at different places — which people do badly.",
        why: "This is the same perceptual limit that makes pie charts weak. A reader asked to compare the Fashion segments across three stacked bars is being asked to do mental arithmetic, and they will either get it wrong or give up.",
        table: {
          caption: "Reading Fashion off each chart.",
          headers: ["Chart", "Fashion in Lagos", "How the reader gets it"],
          rows: [
            ["Stacked", "₦56,000", "Subtract the segment below from the one above"],
            ["Grouped", "₦56,000", "Read the bar length from zero"],
            ["100% stacked", "20%", "Read the proportion, not the amount"],
          ],
          note: "Same number, three amounts of effort. If the question is about Fashion, group the bars.",
        },
        mistake:
          "Using a stacked bar because it looks richer, when the question was about one of the segments. The chart contains the answer and makes the reader work for it.",
      },
      {
        id: "a-viz-pick-composition",
        title: "Pick the right one",
        explain:
          "A real request, three real charts of the same data. Read the question carefully — the wording tells you which form it needs.",
        chartChoice: {
          question:
            "The head of Fashion asks: how does MY category compare across the three states? Which chart answers that with the least effort from her?",
          correct: "grouped",
          options: [
            {
              id: "stacked",
              label: "Stacked column",
              chart: { type: "stacked", ...MIX, valuePrefix: "₦" },
              whyWrong:
                "Her Fashion segment sits in the middle of each bar, starting at a different height every time. To compare her three numbers she has to subtract the segment below from the one above, three times — for a question that should take one glance.",
            },
            {
              id: "grouped",
              label: "Grouped column",
              chart: { type: "column", ...MIX, valuePrefix: "₦" },
            },
            {
              id: "stacked100",
              label: "100% stacked column",
              chart: { type: "stacked100", ...MIX, valuePrefix: "₦" },
              whyWrong:
                "This answers 'what share of each state is Fashion' — 20%, 46%, 26% — which is a different question. It cannot tell her that Abuja's ₦98,000 is her biggest number, because the amounts are gone.",
            },
          ],
          successMessage:
            "Grouped. Every Fashion bar starts at zero, so Abuja ₦98,000, Lagos ₦56,000, Kano ₦33,000 is readable at a glance — and the finding is that her category is strongest in the smallest-volume state.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l59-relationships-distribution",
    moduleId: "m3-visualisation",
    sectionId: SECTION_ID,
    order: 3,
    title: "Relationships Between Measures",
    subtitle: "Scatter plots, and the discipline of not over-claiming",
    estimatedMinutes: 17,
    intro:
      "Sometimes the question is not how big something is but whether two things move together. That is what a scatter plot is for — and the most valuable answer it gives is often that they do not.",

    atoms: [
      {
        id: "a-viz-scatter",
        title: "Scatter — two measures, one point per row",
        explain:
          "A scatter plot puts one measure on each axis and one dot per record. An upward drift means the two rise together; a shapeless cloud means they do not.",
        charts: [
          {
            type: "scatter",
            title: "Order value against units sold — twelve orders",
            series: SCATTER,
            valuePrefix: "₦",
            showTable: false,
            caption:
              "No upward drift. The correlation coefficient is −0.04, which is as close to no relationship as real data gets. The number of items in an order tells you essentially nothing about what it is worth.",
          },
        ],
        why: "That is a genuine finding, not a failed chart. It means order value is driven by WHAT is bought rather than HOW MUCH — and the price-per-unit range confirms it, from ₦3,500 to ₦25,500, a sevenfold spread. Anyone planning to grow revenue by pushing volume has just been told to push product mix instead.",
        table: {
          caption: "Reading the shape.",
          headers: ["What you see", "What it means"],
          rows: [
            ["Points drifting up to the right", "The two measures rise together"],
            ["Points drifting down to the right", "One rises as the other falls"],
            ["A shapeless cloud", "No relationship — and that is a finding"],
            ["Two separate clusters", "Two populations mixed together; split them"],
            ["One point far from the rest", "An outlier — apply the lesson 23 rule"],
          ],
        },
      },
      {
        id: "a-viz-no-causation",
        title: "Correlation is not causation, and a scatter cannot tell you which",
        explain:
          "Even a strong relationship on a scatter plot shows only that two measures move together. It cannot tell you which one causes the other, or whether a third thing causes both.",
        why: "This is the single easiest way for an analyst to be confidently wrong in a meeting. Ice cream sales and drowning deaths correlate strongly, and neither causes the other — summer causes both. The chart looks identical either way.",
        table: {
          caption: "Three explanations for the same scatter.",
          headers: ["Possibility", "Example"],
          rows: [
            ["A causes B", "Discount raises units sold"],
            ["B causes A", "High volume triggers a bulk discount"],
            ["C causes both", "A seasonal campaign drives discount and volume"],
            ["Coincidence", "With enough measures, some will correlate by chance"],
          ],
          note: "A scatter cannot distinguish these four. Say 'these move together' and let somebody who knows the business say why.",
        },
        mistake:
          "Writing 'discounting drives volume' under a scatter that shows discount and volume rising together. You have upgraded a correlation into a causal claim, and the first person who knows about the summer campaign will say so.",
      },
      {
        id: "a-viz-pick-relationship",
        title: "Which chart tests a relationship?",
        explain:
          "You have been asked whether two measures move together. Only one of these can answer that.",
        chartChoice: {
          question:
            "Operations asks: do bigger orders contain more items? Which visual answers that?",
          correct: "scatter",
          options: [
            {
              id: "scatter",
              label: "Scatter — units against value",
              chart: {
                type: "scatter",
                series: SCATTER,
                valuePrefix: "₦",
              },
            },
            {
              id: "bars",
              label: "Bar chart of revenue by state",
              chart: {
                type: "bar",
                categories: STATES,
                series: [{ name: "Revenue", values: STATE_REVENUE }],
                valuePrefix: "₦",
              },
              whyWrong:
                "This compares totals across places. It contains no information about units at all, so it cannot say anything about whether the two measures move together.",
            },
            {
              id: "line",
              label: "Line chart of revenue by month",
              chart: {
                type: "line",
                categories: MONTHS,
                series: [{ name: "Revenue", values: MONTH_REVENUE }],
                valuePrefix: "₦",
              },
              whyWrong:
                "A line shows one measure changing over time. Two measures against each other need two axes of MEASURES, not a time axis — and plotting both on one line chart with two scales would be the dual-axis mistake from Month 2.",
            },
          ],
          successMessage:
            "The scatter, and the answer is no: r = −0.04, a shapeless cloud. Operations can stop planning around order size as a proxy for volume — and that negative answer is worth just as much as a positive one would have been.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l60-interactivity",
    moduleId: "m3-visualisation",
    sectionId: SECTION_ID,
    order: 4,
    title: "Interactivity",
    subtitle: "Cross-filtering, drillthrough, tooltips and bookmarks",
    estimatedMinutes: 17,
    intro:
      "This is what a BI tool does that a spreadsheet cannot. Used well, interactivity answers the follow-up questions you would otherwise field by email. Used carelessly, it produces a report nobody trusts because the numbers move for reasons they cannot see.",

    atoms: [
      {
        id: "a-viz-cross-filter",
        title: "Cross-filtering is on by default",
        explain:
          "Click a bar in one visual and every other visual on the page filters to match. That is cross-filtering, and it happens whether or not you designed for it.",
        why: "Readers discover it by accident, click something, and then read numbers they believe are the report's headline figures. Knowing it is on — and controlling it with Edit interactions — is the difference between a feature and a trap.",
        table: {
          caption: "The three interaction modes, per visual pair.",
          headers: ["Mode", "Effect when the source is clicked"],
          rows: [
            ["Filter", "The target shows only matching rows"],
            ["Highlight", "The target dims the rest and keeps the total visible"],
            ["None", "The target ignores the click entirely"],
          ],
          note: "Set a KPI card to None. A reader who clicks a bar and watches the headline revenue figure change will not know which number to quote.",
        },
        mistake:
          "Leaving every interaction on Filter and never testing the report by clicking things. Click every visual once before you ship — you will find at least one pair that should not be connected.",
      },
      {
        id: "a-viz-drillthrough",
        title: "Drillthrough — detail without clutter",
        explain:
          "A drillthrough page shows the detail for one selected item. Right-click a state, choose Drill through, and land on a page filtered to that state — usually a matrix of the underlying rows.",
        why: "This resolves the chart-versus-table tension from lesson 57. The summary page stays readable and the detail is one right-click away, so you never have to choose between a clean report and an answerable one.",
        table: {
          caption: "What goes where.",
          headers: ["Page", "Holds", "Read by"],
          rows: [
            ["Summary", "Cards, 2–3 charts, a slicer row", "Everyone, in ten seconds"],
            ["Drillthrough", "A matrix of rows for one item", "The person who asked a follow-up"],
            ["Appendix", "Definitions, refresh date, data sources", "Whoever challenges a number"],
          ],
          note: "Add a Back button to every drillthrough page. Power BI does not add one by default, and a reader stranded on a detail page assumes the report is broken.",
        },
      },
      {
        id: "a-viz-tooltips",
        title: "Tooltips, including report page tooltips",
        explain:
          "Hovering a data point shows its values. You can also build a whole report page and set it as the tooltip, so hovering a bar reveals a small chart instead of a list of numbers.",
        why: "A report page tooltip is the cheapest way to add depth without adding clutter. The trend behind a single bar can live in the hover, where it costs nothing until someone wants it.",
        example:
          "Build one:\n  1. New page  →  Page information  →  Tooltip = On\n  2. Size it to Tooltip in Page size\n  3. Put one small visual on it\n  4. On the main visual: Format  →  Tooltip  →  Report page  →  pick it\n\nKeep it to one visual. A tooltip that takes time to read is\na page, not a tooltip.",
      },
      {
        id: "a-viz-bookmarks-sync",
        title: "Bookmarks and synced slicers",
        explain:
          "A bookmark saves the current state of a page — filters, selections, which visuals are visible — and a button can restore it. Sync slicers keeps one slicer's selection consistent across several pages.",
        why: "Bookmarks let one page hold two views without doubling the report: a button swaps a chart for a matrix in place. Synced slicers stop the commonest reader complaint, which is setting a filter on page one and finding page two ignored it.",
        table: {
          caption: "What each is for.",
          headers: ["Feature", "Use it to"],
          rows: [
            ["Bookmark + button", "Swap between a chart and a table in the same space"],
            ["Bookmark", "Save a 'reset to default' state readers can return to"],
            ["Sync slicers", "Carry a date or region selection across pages"],
            ["Selection pane", "Control which visuals a bookmark shows or hides"],
          ],
          note: "Always provide a visible way back. A bookmark that changes the page with no reset button leaves the reader stuck in a state they did not choose.",
        },
        mistake:
          "Building an elaborate bookmark navigation and no reset. Readers click three buttons, lose track of what is filtered, and stop believing any of the numbers.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l61-storytelling",
    moduleId: "m3-visualisation",
    sectionId: SECTION_ID,
    order: 5,
    title: "Data Storytelling",
    subtitle: "Making a report that changes what someone does",
    estimatedMinutes: 17,
    intro:
      "A report that is accurate, well designed and ignored has failed. The last step is the one that decides whether the work matters: saying what you found, in the order a busy person can absorb it.",

    atoms: [
      {
        id: "a-viz-titles",
        title: "Titles should state the finding, not name the fields",
        explain:
          "'Revenue by State' tells the reader what the axes are, which they can already see. 'Lagos leads on revenue, Abuja on order size' tells them what to think about it.",
        why: "Most readers read the title and glance at the shape. A title that carries the finding means even the glancing reader leaves with the point — and writing it forces you to decide what the point is.",
        charts: [
          {
            type: "bar",
            title: "Lagos leads on revenue, but from twice as many orders",
            categories: STATES,
            series: [{ name: "Revenue", values: STATE_REVENUE }],
            valuePrefix: "₦",
            caption:
              "The title does the work. A reader who only reads titles still learns that volume, not order size, is what puts Lagos first — which is the finding the chart supports.",
          },
        ],
        table: {
          caption: "Rewriting four titles.",
          headers: ["Field-naming title", "Finding-stating title"],
          rows: [
            ["Revenue by State", "Lagos leads on revenue, Abuja on order size"],
            ["Revenue by Month", "February peaked; March eased back 14%"],
            ["Units vs Amount", "Order size does not predict order value"],
            ["Category Mix by State", "Abuja is a Fashion market; Lagos is Groceries"],
          ],
          note: "Each right-hand title is a claim the chart beneath it must support. That is the discipline — you cannot write one without deciding what is true.",
        },
      },
      {
        id: "a-viz-narrative",
        title: "The order a report should be read in",
        explain:
          "Context, then the finding, then the evidence, then what to do. That is the same order as the written findings in the Month 2 project, laid out as a page instead of a paragraph.",
        why: "A reader arriving at a report has no idea what they are looking at. Give them the headline first and the detail below, and they can stop reading at any point with something useful.",
        table: {
          caption: "A page that reads in one direction.",
          headers: ["Position", "Holds", "Reader learns"],
          rows: [
            ["Top band", "Cards with comparisons", "Are we all right?"],
            ["Upper middle", "The chart carrying the headline finding", "What is driving it"],
            ["Lower middle", "One or two supporting charts", "Where and when"],
            ["Bottom", "Slicers, definitions, refresh date", "How to check it"],
          ],
          note: "If a reader has to scroll to find out whether things are going well, the order is wrong.",
        },
      },
      {
        id: "a-viz-accessibility",
        title: "Accessibility is not optional",
        explain:
          "Do not rely on colour alone, keep text large enough to read on a phone, give every visual alt text, and check the report in the colour-blindness simulator before you publish.",
        why: "Around one man in twelve has some form of colour vision deficiency, so a red-versus-green variance chart is unreadable for a predictable share of any audience. The fix — adding a label, an arrow or a texture — costs minutes.",
        kpis: [
          { label: "Revenue vs target", value: "103%", compare: "above target", direction: "up" },
          { label: "Orders", value: "12", compare: "below last month", direction: "down" },
          { label: "Late deliveries", value: "1", compare: "unchanged", direction: "flat" },
        ],
        table: {
          caption: "Cheap changes with real effect.",
          headers: ["Change", "Helps"],
          rows: [
            ["An arrow or word beside every colour-coded figure", "Colour-blind and greyscale readers"],
            ["Alt text on each visual", "Screen reader users"],
            ["Font sizes checked on a phone", "Almost everybody"],
            ["Run the colour-blindness simulator", "Catches the red/green pair you missed"],
            ["Tab order set in the Selection pane", "Keyboard navigation"],
          ],
          note: "The tiles above state direction in words and an arrow as well as colour, so they still read correctly printed in black and white.",
        },
        mistake:
          "Signalling good and bad with red and green alone. For a meaningful share of your readers those two are the same colour, and the report silently tells them nothing.",
      },
      {
        id: "a-viz-report-checklist",
        title: "The publish checklist",
        explain:
          "Titles state findings, every card carries a comparison, interactions tested by clicking, a visible refresh date, definitions reachable, colour never the only signal, and the ten-second test passed by someone who has not seen the data.",
        why: "Every item here is something a reader will notice and you will not, because you already know what the report means. The checklist is how you see it the way they will.",
        table: {
          caption: "Before you publish.",
          headers: ["Check", "Catches"],
          rows: [
            ["Every title states a finding", "A report that names fields and says nothing"],
            ["Every card has a comparison", "Numbers nobody can judge"],
            ["Clicked every visual once", "Cross-filtering nobody intended"],
            ["Refresh date visible", "Stale figures circulated as current"],
            ["Definitions one click away", "Arguments about what 'active' means"],
            ["Colour is never the only signal", "Readers who cannot see your red/green"],
            ["Ten-second test passed", "Everything else"],
          ],
          note: "Seven checks. The last one is the only one that measures whether the report does its job, and the other six are how you pass it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
