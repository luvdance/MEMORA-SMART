/**
 * ASSESSMENTS · VISUALISATION & DATA STORYTELLING (m3-visualisation)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Visual-design questions are easy to write as opinion. These are not: each
 * has a defensible answer that follows from how reading works, from what the
 * data actually says, or from a documented Power BI behaviour. Several describe
 * a report that is misleading a reader without being wrong.
 *
 * Figures come from the Month 2 sales data plus one statistic computed for
 * this module:
 *   Lagos 276,000 · Abuja 215,000 · Kano 127,000 · total 618,000
 *   Fashion: Abuja 98,000 · Lagos 56,000 · Kano 33,000
 *   Units against Amount: Pearson r = -0.039 — no relationship
 *   Price per unit 3,500 to 25,500 — a sevenfold spread
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l57-visual-vocabulary": {
    lessonId: "l57-visual-vocabulary",
    passMark: 70,
    questions: [
      {
        id: "q57-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-card-vs-chart",
        prompt:
          "You need to show total revenue against target as one figure. Which visual?",
        options: [
          { id: "a", text: "A gauge — it shows progress to target" },
          { id: "b", text: "A card, with the comparison underneath it" },
          { id: "c", text: "A single-bar chart" },
          { id: "d", text: "A pie with two slices" },
        ],
        correct: "b",
        explanation:
          "One number belongs on a card. It reads instantly and leaves room for the comparison that makes the number judgeable. A gauge takes several times the space to show the same figure less precisely.",
        whyWrong: {
          a: "A gauge occupies four times the space of a card and a needle position is harder to read exactly than digits are.",
          c: "A chart of one value wastes the axis a chart needs and adds nothing a big number does not say.",
          d: "A two-slice pie is the least readable way to express a percentage ever devised.",
        },
      },
      {
        id: "q57-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-matrix",
        prompt:
          "Finance need to reconcile your figures against their system, to the naira. What do you give them?",
        options: [
          { id: "a", text: "A bar chart, with data labels on" },
          { id: "b", text: "A matrix — charts are for comparison, tables are for lookup" },
          { id: "c", text: "A line chart" },
          { id: "d", text: "A screenshot" },
        ],
        correct: "b",
        explanation:
          "Reading an exact figure off a bar is guesswork. A matrix is a pivot table and is the right tool for lookup and reconciliation. The professional pattern is a chart on the summary page with the matrix on a drillthrough.",
        whyWrong: {
          a: "Labels help, but forty labelled bars is a table drawn badly.",
          c: "A line shows shape over time, which is not what reconciliation needs.",
          d: "A screenshot cannot be filtered, sorted or copied, which is most of what reconciling involves.",
        },
      },
      {
        id: "q57-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-choose-one",
        prompt:
          "You are asked how revenue moved across the quarter and you present a well-made bar chart of revenue by state. What is wrong?",
        options: [
          { id: "a", text: "Nothing — it is a good chart" },
          { id: "b", text: "It answers a different question: they asked about time, it shows place" },
          { id: "c", text: "Bar charts cannot show revenue" },
          { id: "d", text: "It needs a legend" },
        ],
        correct: "b",
        explanation:
          "The chart is fine and the question is unanswered. This is the hardest failure to catch in review, because nothing about the chart looks wrong — which is why the question has to be settled before the visual is chosen.",
        whyWrong: {
          a: "A correct chart answering the wrong question still leaves the room without an answer.",
          c: "Bar charts show revenue well; the dimension is the mismatch.",
          d: "A single-series chart needs no legend — the title names the series.",
        },
      },
      {
        id: "q57-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-six",
        prompt:
          "Why stick to a small set of visual types across your reports?",
        options: [
          { id: "a", text: "Power BI runs faster with fewer types" },
          { id: "b", text: "A reader who has read one of your reports can read the next one immediately; an unfamiliar visual costs attention" },
          { id: "c", text: "Custom visuals are not allowed" },
          { id: "d", text: "There is a licence limit" },
        ],
        correct: "b",
        explanation:
          "Every visual is a demand on the reader's attention, and an unfamiliar one demands more. Consistency across reports means the reader spends their attention on the data rather than on decoding the chart.",
        whyWrong: {
          a: "Performance depends on the model and the query, not on how many chart types you used.",
          c: "They are allowed. They are just rarely the best answer.",
          d: "No licence restricts visual types.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l58-comparison-composition": {
    lessonId: "l58-comparison-composition",
    passMark: 70,
    questions: [
      {
        id: "q58-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-stacked-trap",
        prompt:
          "Why is it hard to compare the Fashion segments across three stacked bars?",
        options: [
          { id: "a", text: "The colours are too similar" },
          { id: "b", text: "Only the bottom segment starts from a common baseline, so every segment above begins at a different height" },
          { id: "c", text: "Stacked bars cannot show three series" },
          { id: "d", text: "The bars are too narrow" },
        ],
        correct: "b",
        explanation:
          "Fashion sits in the middle of each bar, starting wherever Electronics ended. Comparing the three means judging lengths that begin at different places, which people do badly — the same perceptual limit that makes pie charts weak.",
        whyWrong: {
          a: "The palette is deliberately separated for colour-blind readers. The geometry is the problem.",
          c: "They show three series happily. Reading the inner ones is what is hard.",
          d: "Width does not affect whether segments share a baseline.",
        },
      },
      {
        id: "q58-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-pick-composition",
        prompt:
          "The head of Fashion wants to compare her category across three states. Which chart?",
        options: [
          { id: "a", text: "Stacked column" },
          { id: "b", text: "Grouped column, so every Fashion bar starts at zero" },
          { id: "c", text: "100% stacked column" },
          { id: "d", text: "Pie chart per state" },
        ],
        correct: "b",
        explanation:
          "Grouped puts every Fashion bar on a common baseline, so Abuja ₦98,000, Lagos ₦56,000 and Kano ₦33,000 is a single glance. The finding — her category is strongest in the smallest-volume state — is then obvious.",
        whyWrong: {
          a: "Her segment floats in the middle of each bar and she has to subtract to read it.",
          c: "That gives her 20%, 46% and 26% — shares, not amounts. It cannot tell her ₦98,000 is her biggest number.",
          d: "Three pies means comparing angles across three charts, which is the worst option available.",
        },
      },
      {
        id: "q58-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-three-bars",
        prompt:
          "What does a 100% stacked bar chart hide?",
        options: [
          { id: "a", text: "The categories" },
          { id: "b", text: "The totals — every bar is full height, so a tiny group looks as important as a huge one" },
          { id: "c", text: "The proportions" },
          { id: "d", text: "Nothing" },
        ],
        correct: "b",
        explanation:
          "It can only answer questions about proportion. Abuja's mix would look identical whether Abuja sold ₦215,000 or ₦2, so the totals must appear somewhere else on the page beside it.",
        whyWrong: {
          a: "The categories are the axis; they are the one thing it definitely shows.",
          c: "Proportions are precisely what it does show — that is the trade.",
          d: "Removing the totals is the entire nature of the chart type.",
        },
      },
      {
        id: "q58-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-three-bars",
        prompt:
          "You need to show each state's total AND what it is made of, in one chart. Which form?",
        options: [
          { id: "a", text: "Grouped column" },
          { id: "b", text: "Stacked column" },
          { id: "c", text: "100% stacked column" },
          { id: "d", text: "Line chart" },
        ],
        correct: "b",
        explanation:
          "Bar height gives the total and the segments give the composition. You give up easy comparison of the inner segments, which is the correct trade when the question is about totals and their parts.",
        whyWrong: {
          a: "Grouped shows the parts clearly and removes the totals.",
          c: "100% stacked removes the totals completely.",
          d: "A line over categories implies an order and a continuity that states do not have.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l59-relationships-distribution": {
    lessonId: "l59-relationships-distribution",
    passMark: 70,
    questions: [
      {
        id: "q59-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-scatter",
        prompt:
          "Your scatter of units against order value is a shapeless cloud — the correlation is −0.04. What do you report?",
        options: [
          { id: "a", text: "That the chart failed and needs different measures" },
          { id: "b", text: "That order size does not predict order value — a real finding, which points at product mix rather than volume" },
          { id: "c", text: "That the data is wrong" },
          { id: "d", text: "Nothing — there is no result" },
        ],
        correct: "b",
        explanation:
          "No relationship is a finding. It means value is driven by WHAT is bought, not how much, and the sevenfold spread in price per unit — ₦3,500 to ₦25,500 — confirms it. Anyone planning to grow revenue through volume has just been redirected.",
        whyWrong: {
          a: "The chart answered the question asked. The answer was no.",
          c: "Nothing indicates bad data. Uncorrelated measures are extremely common.",
          d: "A negative answer is a result, and often a more useful one than a positive.",
        },
      },
      {
        id: "q59-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-no-causation",
        prompt:
          "Discount and units sold rise together on your scatter. Which write-up is defensible?",
        options: [
          { id: "a", text: "Discounting drives volume" },
          { id: "b", text: "Discount and volume move together; the cause is not established from this data" },
          { id: "c", text: "Volume causes discounting" },
          { id: "d", text: "There is no relationship" },
        ],
        correct: "b",
        explanation:
          "A scatter shows co-movement and cannot distinguish which causes which, or whether a third thing causes both — a seasonal campaign would produce exactly this picture. State what you can see and let someone who knows the business explain it.",
        whyWrong: {
          a: "This upgrades a correlation into a causal claim the chart cannot support.",
          c: "Equally plausible, equally unsupported — high volume may trigger a bulk discount.",
          d: "The points do move together; denying it ignores the chart.",
        },
      },
      {
        id: "q59-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-pick-relationship",
        prompt:
          "Operations ask whether bigger orders contain more items. Which visual answers it?",
        options: [
          { id: "a", text: "A bar chart of revenue by state" },
          { id: "b", text: "A scatter with units on one axis and value on the other" },
          { id: "c", text: "A line chart of revenue by month" },
          { id: "d", text: "A line chart with revenue and units on two y-axes" },
        ],
        correct: "b",
        explanation:
          "Two measures against each other need a measure on each axis, one point per order. That is a scatter, and here the answer is no — r = −0.04.",
        whyWrong: {
          a: "It contains no units data at all, so it cannot address the question.",
          c: "A line shows one measure over time, not two measures against each other.",
          d: "That is the dual-axis chart from Month 2: the scales are arbitrary, so any apparent relationship is manufactured by your choice of them.",
        },
      },
      {
        id: "q59-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-scatter",
        prompt:
          "Your scatter shows two clearly separate clusters of points. What does that suggest?",
        options: [
          { id: "a", text: "A rendering error" },
          { id: "b", text: "Two populations mixed in one chart — split them and analyse each" },
          { id: "c", text: "A strong correlation" },
          { id: "d", text: "Outliers to delete" },
        ],
        correct: "b",
        explanation:
          "Two clusters usually means two kinds of thing have been plotted together — retail and wholesale orders, say. A single trend line across both would describe neither. Split by the variable that separates them.",
        whyWrong: {
          a: "Clustering is real structure in the data, not a drawing fault.",
          c: "A correlation is a drift along one direction, not two separated groups.",
          d: "An outlier is one distant point. A whole cluster is a population.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l60-interactivity": {
    lessonId: "l60-interactivity",
    passMark: 70,
    questions: [
      {
        id: "q60-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-cross-filter",
        prompt:
          "A reader clicks a bar on your report and the headline revenue card changes. Why is that a problem, and what fixes it?",
        options: [
          { id: "a", text: "It is not a problem — that is interactivity working" },
          { id: "b", text: "They no longer know which figure is the report's headline; set that card's interaction to None" },
          { id: "c", text: "The card is broken" },
          { id: "d", text: "Turn off all cross-filtering" },
        ],
        correct: "b",
        explanation:
          "Cross-filtering is on by default. A KPI card that changes when someone clicks a chart stops being a headline figure, so set it to None in Edit interactions. Click every visual once before shipping to find pairs like this.",
        whyWrong: {
          a: "Interactivity working where it should not is the definition of the problem.",
          c: "The card is filtering correctly. The design did not intend it to.",
          d: "That throws away the main advantage of a BI tool. Fix the one pair.",
        },
      },
      {
        id: "q60-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-drillthrough",
        prompt:
          "How do you keep a summary page clean while still letting someone read the underlying rows?",
        options: [
          { id: "a", text: "Put the table on the summary page in a small font" },
          { id: "b", text: "A drillthrough page with the detail, reachable by right-clicking an item" },
          { id: "c", text: "Export to Excel" },
          { id: "d", text: "Add more pages of charts" },
        ],
        correct: "b",
        explanation:
          "Drillthrough resolves the chart-versus-table tension: the summary stays readable and the detail is one right-click away, filtered to the item selected. Remember to add a Back button — Power BI does not.",
        whyWrong: {
          a: "A small table is unreadable and still clutters the page.",
          c: "Exporting abandons the report and breaks the refresh.",
          d: "More charts is not more detail, and it makes the report longer.",
        },
      },
      {
        id: "q60-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-bookmarks-sync",
        prompt:
          "A reader sets a date filter on page one and finds page two ignoring it. What fixes this?",
        options: [
          { id: "a", text: "Tell them to set it again" },
          { id: "b", text: "Sync the slicer across pages" },
          { id: "c", text: "A bookmark" },
          { id: "d", text: "Bidirectional filtering" },
        ],
        correct: "b",
        explanation:
          "Sync slicers carries a selection across pages, which removes the commonest reader complaint about multi-page reports. Without it every page starts unfiltered and the reader has to remember.",
        whyWrong: {
          a: "That is the workaround people put up with, not a fix.",
          c: "A bookmark saves one state; it does not keep a live selection in step across pages.",
          d: "That is a model setting about how filters travel between tables, not between pages.",
        },
      },
      {
        id: "q60-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-bookmarks-sync",
        prompt:
          "What must every bookmark-driven view include?",
        options: [
          { id: "a", text: "A chart" },
          { id: "b", text: "A visible way back to the default state" },
          { id: "c", text: "A slicer" },
          { id: "d", text: "A title" },
        ],
        correct: "b",
        explanation:
          "A bookmark changes the page. Without a reset, readers click through several states, lose track of what is filtered, and stop trusting the numbers — which costs more than the feature gained.",
        whyWrong: {
          a: "A bookmarked view might deliberately show a table instead.",
          c: "Useful, but not what strands the reader.",
          d: "Titles matter everywhere; they are not what makes a bookmark safe.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l61-storytelling": {
    lessonId: "l61-storytelling",
    passMark: 70,
    questions: [
      {
        id: "q61-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-titles",
        prompt:
          "Which is the better chart title?",
        options: [
          { id: "a", text: "Revenue by State" },
          { id: "b", text: "Lagos leads on revenue, but from twice as many orders" },
          { id: "c", text: "Chart 1" },
          { id: "d", text: "Sum of Amount by StateName" },
        ],
        correct: "b",
        explanation:
          "Most readers read the title and glance at the shape. A title stating the finding means even the glancing reader leaves with the point — and writing one forces you to decide what the point is.",
        whyWrong: {
          a: "It names the axes, which the reader can already see. It says nothing.",
          c: "This tells the reader nothing at all.",
          d: "This is the auto-generated field name, and it is the worst of the four.",
        },
      },
      {
        id: "q61-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-viz-accessibility",
        prompt:
          "Your variance column is red for negative and green for positive, with no other marking. What is wrong?",
        options: [
          { id: "a", text: "Nothing — red and green are conventional" },
          { id: "b", text: "Around one man in twelve has a colour vision deficiency, so for a predictable share of readers the column says nothing" },
          { id: "c", text: "Red is too aggressive" },
          { id: "d", text: "It should be a chart" },
        ],
        correct: "b",
        explanation:
          "Colour must never be the only signal. Adding an arrow, a sign or a word costs minutes and makes the column readable for colour-blind readers, in greyscale, and when printed.",
        whyWrong: {
          a: "Conventional and inaccessible are not mutually exclusive — red/green is the textbook example.",
          c: "Tone is a style preference. Legibility is not.",
          d: "A red/green chart would have exactly the same problem.",
        },
      },
      {
        id: "q61-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-narrative",
        prompt:
          "In what order should a report page be laid out?",
        options: [
          { id: "a", text: "Detail first, so readers can form their own view" },
          { id: "b", text: "Headline KPIs at the top, the chart carrying the finding below, supporting detail under that" },
          { id: "c", text: "Charts first, numbers last" },
          { id: "d", text: "Alphabetically" },
        ],
        correct: "b",
        explanation:
          "Same order as the written findings from the Month 2 project, laid out as a page. A reader can stop at any point and still leave with something useful — and if they must scroll to learn whether things are going well, the order is wrong.",
        whyWrong: {
          a: "A reader arriving cold has no idea what the detail means yet.",
          c: "A chart with no headline figure leaves the reader guessing at the scale.",
          d: "Alphabetical order has no relationship to importance.",
        },
      },
      {
        id: "q61-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-viz-report-checklist",
        prompt:
          "Which single check best measures whether a report does its job?",
        options: [
          { id: "a", text: "The colours match the brand" },
          { id: "b", text: "Someone who has not seen the data can say, after ten seconds, whether things are going well and what needs attention" },
          { id: "c", text: "Every visual has a title" },
          { id: "d", text: "The file opens quickly" },
        ],
        correct: "b",
        explanation:
          "It is the only check that measures the thing the report was built for. Every other review item — titles, colours, chart types — is a proxy for it, and a report can pass all of them and still fail this one.",
        whyWrong: {
          a: "Brand compliance says nothing about whether the report communicates.",
          c: "Necessary, and not sufficient — titles can name fields and say nothing.",
          d: "Performance matters, but a fast report of unreadable charts has still failed.",
        },
      },
    ],
  },
};
