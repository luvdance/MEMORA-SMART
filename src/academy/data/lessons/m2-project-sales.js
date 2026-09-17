/**
 * MODULE · PROJECT — SALES PERFORMANCE ANALYSIS (m2-project-sales)
 * Month 2 — Excel Data Analysis · the capstone
 *
 * THIS IS AN EXAMINATION, NOT A TUTORIAL.
 *
 * Every other module teaches, then practises. This one only sets tasks. The
 * atoms describe what the business needs and hand over a deliberately broken
 * export; the learner has to remember which tool finds which problem. There
 * are no worked examples here on purpose — being told the answer and being
 * able to produce it are different skills, and only the second one gets
 * anybody hired.
 *
 * WHAT IS BEING TESTED, AND WHERE IT CAME FROM
 *   l21 profiling        → COUNTBLANK finds the missing rating
 *   m1 data types        → ISNUMBER catches the amount stored as text
 *   m1 TRIM / LEN        → the leading space that silently loses ₦62,000
 *   l23 the IQR rule     → the ₦980,000 order, proved rather than asserted
 *   l22 mean vs median   → 48,000 against 137,000
 *   m2-pivots            → the state breakdown, built by moving fields
 *   l31 % of target      → the KPI layer
 *   l33 chart selection  → the honest chart, not the flattering one
 *   l35 presenting       → the written findings
 *
 * THE PLANTED FLAWS — every one is findable with a tool already taught:
 *   C8   "43000" stored as TEXT, so it sits left in its cell
 *   B3   " Abuja" with a leading space — breaks SUMIFS silently
 *   B4   "lagos" lowercase — harmless to COUNTIF, and worth knowing why
 *   D6   a missing rating
 *   C9   an amount of 0
 *   C7   ₦980,000 — 89% of Abuja's entire revenue, from one order
 *
 * EVERY FIGURE BELOW WAS COMPUTED against lib/academy/spreadsheet/engine.js
 * and lib/academy/pivot.js, and is re-checked by the content validator.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s8-project-sales";

/**
 * The raw export, exactly as a system would spit it out — flaws included.
 * Do NOT "tidy" this constant. The mess is the exam paper.
 */
const RAW = {
  A1: "Order", B1: "State", C1: "Amount", D1: "Rating",
  A2: "ORD-1001", B2: "Lagos", C2: 45000, D2: 4,
  A3: "ORD-1002", B3: " Abuja", C3: 62000, D3: 5,
  A4: "ORD-1003", B4: "lagos", C4: 38000, D4: 4,
  A5: "ORD-1004", B5: "Kano", C5: 51000, D5: 3,
  A6: "ORD-1005", B6: "Lagos", C6: 47000, D6: "",
  A7: "ORD-1006", B7: "Abuja", C7: 980000, D7: 5,
  A8: "ORD-1007", B8: "Kano", C8: "43000", D8: 4,
  A9: "ORD-1008", B9: "Lagos", C9: 0, D9: 2,
  A10: "ORD-1009", B10: "Abuja", C10: 55000, D10: 1,
  A11: "ORD-1010", B11: "Lagos", C11: 49000, D11: 4,
};

/** The same ten orders after cleaning. Lagos 179,000 · Abuja 1,097,000 · Kano 94,000 */
const CLEANED = {
  headers: ["Order", "State", "Amount", "Rating"],
  rows: [
    ["ORD-1001", "Lagos", 45000, 4],
    ["ORD-1002", "Abuja", 62000, 5],
    ["ORD-1003", "Lagos", 38000, 4],
    ["ORD-1004", "Kano", 51000, 3],
    ["ORD-1005", "Lagos", 47000, ""],
    ["ORD-1006", "Abuja", 980000, 5],
    ["ORD-1007", "Kano", 43000, 4],
    ["ORD-1008", "Lagos", 0, 2],
    ["ORD-1009", "Abuja", 55000, 1],
    ["ORD-1010", "Lagos", 49000, 4],
  ],
};

const KPI_SHEET = {
  A1: "Measure", B1: "Value",
  A2: "Revenue (cleaned)", B2: 1370000,
  A3: "Quarter target", B3: 1250000,
  A5: "% of target",
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l36-project-clean",
    moduleId: "m2-project-sales",
    sectionId: SECTION_ID,
    order: 1,
    title: "Project — Clean the Export",
    subtitle: "Find what is wrong before you build anything on it",
    estimatedMinutes: 20,
    intro:
      "This is the capstone. From here on you are not being taught, you are being asked. The export below has six deliberate problems and nobody is going to tell you where they are. Find them with the tools you already have.",

    atoms: [
      {
        id: "a-project-brief",
        title: "The brief",
        explain:
          "You are the analyst. Sales has sent a ten-row export of last quarter's orders and asked for a performance summary by Friday: how much did we make, which state performs best, and is anything worth worrying about.",
        why: "Everything you have learned this month exists for this moment. The export is broken in ways that will not announce themselves — no errors, no red cells, just numbers that are quietly wrong. Build on it unexamined and you will present a confident, incorrect answer.",
        table: {
          caption: "What you have to deliver.",
          headers: ["Stage", "Deliverable", "Tool from"],
          rows: [
            ["1. Clean", "A data-quality note listing every problem found", "Module 1 and lesson 21"],
            ["2. Analyse", "Typical order value, and any outlier proved by rule", "Lessons 22 and 23"],
            ["3. Summarise", "Revenue by state, from a pivot", "Module 2, pivots"],
            ["4. Present", "A KPI, one honest chart, and three sentences", "Lessons 31 to 35"],
          ],
          note: "Stage 1 is where most analysts lose the job. The other three are only as good as it is.",
        },
        mistake:
          "Reading the brief and starting with the pivot table, because that is the fun part. Every figure in that pivot will be wrong in a way nobody in the room can see.",
      },
      {
        id: "a-project-completeness",
        title: "Task 1 — profile the export",
        explain:
          "Before anything else, measure completeness. One of the four columns has a gap in it. Find how many values are missing, because every average you quote later depends on how many rows genuinely contributed.",
        why: "If you report an average rating without knowing it came from nine orders rather than ten, the first person to recount it finds the discrepancy and stops trusting the rest of your work.",
        exercise: {
          data: RAW,
          rows: 13,
          cols: 4,
          target: "C13",
          expected: 1,
          mustUseFormula: true,
          mustUse: "COUNTBLANK",
          task: "In C13, count how many orders are missing a rating. Ratings are in D2 to D11.",
          hint: "One function, one range. You used it in lesson 21 to profile a column.",
          successMessage:
            "One gap, at ORD-1005. Any average rating you quote is based on nine orders — and saying so out loud is what separates an analyst from a spreadsheet operator.",
        },
      },
      {
        id: "a-project-text-number",
        title: "Task 2 — one of these amounts is not a number",
        explain:
          "Look at the Amount column in the grid. Nine values sit to the right of their cell. One sits to the left. In Excel that alignment is not cosmetic — it is the cell telling you what it holds.",
        why: "A number stored as text is the most expensive silent error in business data. It looks identical in a report, it is ignored by some functions and included by others, and nothing on screen marks it out except which side of the cell it sits on.",
        exercise: {
          data: RAW,
          rows: 13,
          cols: 4,
          target: "C13",
          expected: false,
          mustUseFormula: true,
          mustUse: "ISNUMBER",
          task: "C8 is the amount that sits on the wrong side of its cell. In C13, ask Excel directly whether C8 holds a number.",
          hint: "One function, one cell reference. The answer you are looking for is FALSE — which is the finding, not a failure.",
          successMessage:
            "FALSE. ORD-1007's 43,000 is text, not money. Convert it before the analysis, and note it in your data-quality log — it is exactly the kind of thing the client will ask how you caught.",
        },
        mistake:
          "Trying to find it by comparing COUNTA with COUNT. That trick catches blanks and some junk, but a tidy numeric string can slip through both. ISNUMBER asks the question directly and cannot be fooled.",
      },
      {
        id: "a-project-space-cost",
        title: "Task 3 — prove what the dirty data costs",
        explain:
          "One state value has a leading space. Total the Abuja orders exactly as the data stands, then compare that with what the three Abuja orders actually add up to.",
        why: "This is the single most important habit in the whole module. A leading space does not produce an error — SUMIFS simply does not match that row, drops it, and returns a smaller number with total confidence. You will never spot it by looking at the total.",
        exercise: {
          data: RAW,
          rows: 13,
          cols: 4,
          target: "C13",
          expected: 1035000,
          mustUseFormula: true,
          mustUse: "SUMIFS",
          task: 'In C13, total the Amount column for Abuja, using the data exactly as it is. States are in B2:B11 and amounts in C2:C11.',
          hint: 'The range to total comes first, then the range to test, then "Abuja" in double quotes.',
          successMessage:
            "₦1,035,000 — and it is wrong. The three Abuja orders are 62,000, 980,000 and 55,000, which total ₦1,097,000. ORD-1002 holds \" Abuja\" with a leading space, so SUMIFS never matched it and quietly lost ₦62,000.",
        },
        table: {
          caption: "What each flaw does to a total, and what finds it.",
          headers: ["Flaw", "Effect", "Found with"],
          rows: [
            ['" Abuja" leading space', "Drops ₦62,000 from the Abuja total, silently", "TRIM, or LEN vs LEN(TRIM)"],
            ['"lagos" lowercase', "Nothing — COUNTIF and SUMIFS ignore case", "EXACT, if case matters to you"],
            ['"43000" as text', "Excluded by some functions, included by others", "ISNUMBER"],
            ["Missing rating", "Changes the denominator of any average", "COUNTBLANK"],
          ],
          note: "The second row is worth as much as the first. Knowing which mess is harmless stops you wasting a morning fixing something that was never broken.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l37-project-analyse",
    moduleId: "m2-project-sales",
    sectionId: SECTION_ID,
    order: 2,
    title: "Project — Analyse",
    subtitle: "Find the typical order, and prove the outlier",
    estimatedMinutes: 20,
    intro:
      "The export is clean. Now answer the two questions the brief actually asked: what does a typical order look like, and is there anything worth worrying about. Both need a rule you chose before you looked at the answer.",

    atoms: [
      {
        id: "a-project-outlier",
        title: "Task 4 — prove the outlier with a rule",
        explain:
          "One order is far larger than the rest. Anyone can point at it. Your job is to show it falls outside a boundary you defined in advance, so the finding survives being challenged by the person whose sale it was.",
        why: "You will be asked to justify excluding or flagging that order, and 'it looked wrong to me' is not a justification. A fence computed from the data is, and it would have flagged any order above it, including one you liked.",
        exercise: {
          data: RAW,
          rows: 13,
          cols: 4,
          target: "C13",
          expected: 69750,
          mustUseFormula: true,
          mustUse: "QUARTILE",
          task: "In C13, calculate the upper outlier fence for the amounts in C2:C11 — the third quartile plus one and a half times the interquartile range.",
          hint: "You need the function twice: once for quartile 3 and once for quartile 1. The IQR is the gap between them.",
          successMessage:
            "₦69,750. Exactly one of the ten orders sits above it: ORD-1006 at ₦980,000, fourteen times the fence. You did not decide it was unusual — the rule did, and that is what makes it defensible.",
        },
      },
      {
        id: "a-project-typical",
        title: "Task 5 — what does a typical order look like?",
        explain:
          "The brief asked how much a typical order is worth. You now know one order is an extreme outlier, which rules out one of the two obvious answers.",
        why: "The mean of these ten orders is ₦137,000. Not one order in the dataset is near that figure — nine of the ten are below ₦63,000. Quote the mean and you describe a customer who does not exist.",
        exercise: {
          data: RAW,
          rows: 13,
          cols: 4,
          target: "C13",
          expected: 48000,
          mustUseFormula: true,
          mustUse: "MEDIAN",
          task: "In C13, calculate the typical order value in a way that ORD-1006 cannot distort.",
          hint: "The measure of the middle that sorts the values rather than adding them.",
          successMessage:
            "₦48,000 — against a mean of ₦137,000. That gap of ₦89,000 is your headline finding, and the sentence that goes with it writes itself: one exceptional order makes the average nearly three times the typical sale.",
        },
        table: {
          caption: "The two answers, and what each one claims.",
          headers: ["Measure", "Value", "What it tells the board"],
          rows: [
            ["Mean", "₦137,000", "A typical order is ₦137,000 — untrue of every order here"],
            ["Median", "₦48,000", "Half our orders are above ₦48,000 — true and useful"],
            ["Gap", "₦89,000", "The distribution is badly skewed. Say so."],
          ],
          note: "Report the median, state that you used it, and give the one-line reason. All three parts matter.",
        },
      },
      {
        id: "a-project-pivot",
        title: "Task 6 — revenue by state",
        explain:
          "Build the state breakdown the brief asked for. The data here has been cleaned, so the totals you get are the true ones — compare Abuja's figure with the ₦1,035,000 your dirty SUMIFS produced in task 3.",
        pivotExercise: {
          source: CLEANED,
          task:
            "Build a pivot showing total revenue for each state: State on the rows, Amount in the values, summarised by Sum.",
          expect: { row: "State", value: "Amount", agg: "sum" },
          successMessage:
            "Abuja ₦1,097,000, Lagos ₦179,000, Kano ₦94,000, grand total ₦1,370,000. Abuja's figure is ₦62,000 higher than the dirty SUMIFS gave you in task 3 — that gap is precisely what the leading space was costing.",
        },
        why: "Always read the Grand Total first. ₦1,370,000 is the total of all ten cleaned orders, so nothing has been filtered out and nothing has been dropped by a mismatched label.",
        table: {
          caption: "What the pivot should show.",
          headers: ["State", "Revenue", "Orders", "So what?"],
          rows: [
            ["Abuja", "₦1,097,000", "3", "89% of it is one order"],
            ["Lagos", "₦179,000", "5", "Most orders, least revenue each"],
            ["Kano", "₦94,000", "2", "Smallest, but only two orders"],
            ["Grand Total", "₦1,370,000", "10", "Matches the cleaned SUM — nothing lost"],
          ],
          note: "That first So what? is the whole analysis. Abuja does not outperform Lagos six times over; Abuja had one exceptional sale.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l38-project-present",
    moduleId: "m2-project-sales",
    sectionId: SECTION_ID,
    order: 3,
    title: "Project — Build and Present",
    subtitle: "The KPI, the honest chart, and three sentences",
    estimatedMinutes: 20,
    intro:
      "You have the numbers. The last stage is the one that decides whether any of it gets used: turning them into something a board reads in ten seconds, without overstating what you found.",

    atoms: [
      {
        id: "a-project-kpi",
        title: "Task 7 — the KPI layer",
        explain:
          "The quarter target was ₦1,250,000 and cleaned revenue came in at ₦1,370,000. Turn those two numbers into the KPI that goes top-left on the dashboard.",
        why: "A tile reading ₦1,370,000 makes the reader do the comparison from memory. A tile reading 110% of target has already answered the question, which is the entire job of the top band.",
        exercise: {
          data: KPI_SHEET,
          rows: 7,
          cols: 2,
          target: "B5",
          expected: 1.096,
          mustUseFormula: true,
          task: "In B5, express revenue (B2) as a proportion of the target (B3). Do not multiply by 100 — that is the number format's job.",
          hint: "Actual divided by target.",
          successMessage:
            "1.096, which formats as 110%. Ahead of target — but read the next task before you put that on a slide on its own.",
        },
        kpis: [
          { label: "Revenue", value: "₦1,370,000", compare: "10% above target", direction: "up", note: "Target ₦1,250,000" },
          { label: "Orders", value: "10", compare: "1 missing a rating", direction: "flat" },
          { label: "Typical order", value: "₦48,000", compare: "median, not mean", direction: "flat" },
          { label: "Flagged orders", value: "1", compare: "above the ₦69,750 fence", direction: "down" },
        ],
        table: {
          caption: "The honest version of that KPI row.",
          headers: ["Tile", "Value", "Why it is on the dashboard"],
          rows: [
            ["Revenue vs target", "110%", "The headline goal"],
            ["Typical order", "₦48,000", "Stops 110% being read as broad strength"],
            ["Flagged orders", "1", "Names the reason for the caveat"],
          ],
          note: "Those three tiles together tell the truth. The first one alone does not, which is why a dashboard is a set rather than a number.",
        },
      },
      {
        id: "a-project-chart",
        title: "Task 8 — the honest chart",
        explain:
          "The board wants to know which state is performing most strongly. You have two defensible charts and one that should never be used. Choose the one that answers the question actually asked.",
        chartChoice: {
          question:
            "Abuja's ₦1,097,000 is 89% one order. The board asks which state has the strongest UNDERLYING performance. Which chart answers that without overstating Abuja?",
          correct: "median",
          options: [
            {
              id: "totals",
              label: "Total revenue by state",
              chart: {
                type: "bar",
                categories: ["Abuja", "Lagos", "Kano"],
                series: [{ name: "Revenue", values: [1097000, 179000, 94000] }],
                valuePrefix: "₦",
              },
              whyWrong:
                "Accurate, and it answers a different question. This says Abuja earns six times Lagos, which invites the board to conclude Abuja is six times stronger. Take away one order and Abuja drops to ₦117,000 — below Lagos. Totals answer 'how much', not 'how strong'.",
            },
            {
              id: "median",
              label: "Median order value by state",
              chart: {
                type: "bar",
                categories: ["Abuja", "Kano", "Lagos"],
                series: [{ name: "Median order", values: [62000, 47000, 45000] }],
                valuePrefix: "₦",
              },
            },
            {
              id: "pie",
              label: "Share of revenue by state",
              chart: {
                type: "pie",
                categories: ["Abuja", "Lagos", "Kano"],
                series: [{ name: "Revenue", values: [1097000, 179000, 94000] }],
              },
              whyWrong:
                "This takes the misleading total and makes it worse: an 80% slice for Abuja, driven almost entirely by a single sale, and no way to see the order counts that would explain it. It also makes the two smaller states nearly impossible to compare.",
            },
          ],
          successMessage:
            "Abuja ₦62,000, Kano ₦47,000, Lagos ₦45,000. Abuja still leads — but by 38%, not by 600%. That is the difference between a chart that informs a decision and one that distorts it.",
        },
        why: "Both bar charts are truthful. Only one of them answers the question the board asked, and the difference between the two stories they tell — six times versus 38% — is the whole reason chart selection is a professional skill rather than a matter of taste.",
      },
      {
        id: "a-project-findings",
        title: "Task 9 — write the findings",
        explain:
          "Three sentences: the headline, the caveat, the recommendation. Lead with what you found, not with what you did. If it takes more than three sentences, you have not finished deciding what matters.",
        why: "This is the deliverable. Everything before it was preparation. An analysis nobody can act on is a spreadsheet, and the difference is almost always whether somebody wrote down what it meant.",
        table: {
          caption: "A model answer, and why each sentence is there.",
          headers: ["Sentence", "Job it does"],
          rows: [
            [
              "Revenue closed the quarter at ₦1,370,000, 10% above the ₦1,250,000 target.",
              "The headline. The question they asked, answered first.",
            ],
            [
              "That figure depends heavily on one ₦980,000 order in Abuja — 89% of the state's revenue and the only order above our ₦69,750 outlier threshold; excluding it, the typical order is ₦48,000 and Abuja falls below Lagos.",
              "The caveat, with the rule named. This is what makes you credible.",
            ],
            [
              "Recommend treating the Abuja result as a single account win rather than regional strength, and reviewing whether it is repeatable before setting next quarter's target.",
              "The recommendation. What to DO about it.",
            ],
          ],
          note: "Note what is absent: how the data was cleaned, which functions were used, how long it took. Keep all of that ready for the person who challenges you, and none of it in the first three sentences.",
        },
        mistake:
          "Leaving the outlier out of the write-up because it complicates a good headline. Somebody will find it, and everything else you said becomes suspect at the same moment.",
      },
      {
        id: "a-project-checklist",
        title: "Before you send it",
        explain:
          "Run the same checks you would on any deliverable: the grand total matches a figure you trust, every Values header says the aggregation you intended, the Filters area is empty or deliberate, every KPI carries a comparison, and the data-quality note lists all six problems you found.",
        why: "You have now done the whole cycle once — profile, clean, analyse, summarise, present. That cycle is the job. The tools change between Excel, Power BI and Python; the order does not.",
        table: {
          caption: "The project, checked.",
          headers: ["Check", "Expected"],
          rows: [
            ["Grand total matches the cleaned SUM", "₦1,370,000"],
            ["Data-quality note lists every flaw", "6 problems"],
            ["Typical order is the median, and says so", "₦48,000"],
            ["Outlier flagged by a stated rule", "Above ₦69,750"],
            ["KPI carries a comparison", "110% of target"],
            ["Chart answers the question asked", "Median by state"],
            ["Findings are three sentences", "Headline, caveat, recommendation"],
          ],
          note: "Seven checks. If all seven pass, the work is defensible — which is a higher standard than being right, and the one that actually matters in a meeting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
