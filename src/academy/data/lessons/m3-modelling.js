/**
 * MODULE · DATA MODELLING & RELATIONSHIPS (m3-modelling)
 * Month 3 — Power BI
 *
 * The module's own summary calls this "the part most beginners skip and
 * regret", and that is exactly right. Everything still appears to work with a
 * bad model — the visuals render, the totals look plausible — until a number
 * is wrong and nobody can explain why.
 *
 * TEACHING APPROACH
 * Two of the six topics, cardinality and filter direction, are INVISIBLE. A
 * relationship is drawn as a line between two boxes, and the line looks
 * identical whether it filters one way or both, and whether the key on one end
 * is unique or not. You cannot teach either with a diagram.
 *
 * So most atoms carry a live model canvas. The learner picks the joining
 * column in each table and the cardinality is computed FROM THE DATA rather
 * than from what they intended; then they fire a filter from either end and
 * watch it reach the fact table, or fail to reach back.
 *
 * THE PLANTED PROBLEM: ORD-10 carries state code "OY", which the States table
 * has never heard of. That single orphan row is why the state breakdown comes
 * to ₦495,000 while the grand total says ₦528,000 — the classic (Blank) row.
 * Every figure here was computed by lib/academy/model.js and is re-checked by
 * the content validator.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s11-modelling";

/** A dimension: three states, one row each, StateCode unique. */
const STATES = {
  name: "States",
  headers: ["StateCode", "StateName", "Region"],
  rows: [
    ["LA", "Lagos", "South West"],
    ["AB", "Abuja", "North Central"],
    ["KN", "Kano", "North West"],
  ],
};

/** A fact: ten orders. ORD-10 references state "OY", which does not exist. */
const ORDERS = {
  name: "Orders",
  headers: ["Order", "StateCode", "Amount"],
  rows: [
    ["ORD-1", "LA", 45000],
    ["ORD-2", "AB", 62000],
    ["ORD-3", "LA", 38000],
    ["ORD-4", "KN", 51000],
    ["ORD-5", "LA", 47000],
    ["ORD-6", "AB", 98000],
    ["ORD-7", "KN", 43000],
    ["ORD-8", "LA", 56000],
    ["ORD-9", "AB", 55000],
    ["ORD-10", "OY", 33000],
  ],
};

const MODEL = {
  dim: STATES,
  fact: ORDERS,
  labelColumn: "StateName",
  measureColumn: "Amount",
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l48-facts-and-dimensions",
    moduleId: "m3-modelling",
    sectionId: SECTION_ID,
    order: 1,
    title: "Facts, Dimensions and Keys",
    subtitle: "Why one big flat table is the wrong answer",
    estimatedMinutes: 16,
    intro:
      "Your instinct from Excel is to get everything into one wide table. Power BI is built on the opposite instinct, and the reason is worth understanding before you fight it.",

    atoms: [
      {
        id: "a-mod-fact-dim",
        title: "Facts record events. Dimensions describe things.",
        explain:
          "A fact table has one row per event — an order, a payment, a delivery — and holds the numbers you add up. A dimension table has one row per thing — a state, a product, a customer — and holds the words you slice by.",
        why: "Once you can tell them apart, every modelling decision becomes obvious. Numbers you sum live in the fact table. Labels you filter and group by live in dimensions. A column you would never add up and never group by probably should not be in the model at all.",
        table: {
          caption: "Sorting a real dataset into the two kinds.",
          headers: ["Column", "Belongs in", "Because"],
          rows: [
            ["Order amount", "Fact", "You sum it"],
            ["Order date", "Fact", "One per event — and joins to a date dimension"],
            ["State name", "Dimension", "You group by it, and it repeats"],
            ["Region", "Dimension", "A property of the state, not of the order"],
            ["Customer name", "Dimension", "Describes a thing, not an event"],
            ["Quantity", "Fact", "You sum it"],
          ],
          note: "The Region row is the giveaway. Region describes a state, so it belongs beside the state — not copied onto every order.",
        },
      },
      {
        id: "a-mod-keys",
        title: "Primary and foreign keys",
        explain:
          "A primary key uniquely identifies a row in a dimension — one StateCode, one state, no repeats. A foreign key is that same value sitting in the fact table, where it repeats freely because many orders come from one state.",
        why: "Uniqueness is not a detail; it is the whole basis of the relationship. Power BI works out cardinality by checking whether the key is genuinely unique, so a dimension with a duplicated key silently becomes a many-to-many relationship and stops filtering predictably.",
        table: {
          caption: "The same column, two roles.",
          headers: ["", "States.StateCode", "Orders.StateCode"],
          rows: [
            ["Role", "Primary key", "Foreign key"],
            ["Repeats?", "Never", "Constantly"],
            ["Rows", "3", "10"],
            ["Side of the relationship", "The ONE side", "The MANY side"],
          ],
          note: "The one side is always the side where the key is unique. That is not a convention — Power BI reads the data and decides.",
        },
        mistake:
          "Assuming a column called 'ID' is unique. Check it. A dimension exported with duplicated rows is the most common cause of a relationship Power BI refuses to create as one-to-many.",
      },
      {
        id: "a-mod-why-not-flat",
        title: "Why not just one flat table?",
        explain:
          "You can flatten everything into one table, and for a small one-off it is fine. It costs you repetition, size and the ability to change a label in one place — and it makes a date dimension impossible to add later.",
        why: "Repeating 'South West' on every Lagos order is not just wasteful. When someone renames a region, you have to find and change every row instead of one — and the moment two facts need the same dimension, a flat table cannot serve both.",
        table: {
          caption: "One flat table against a star.",
          headers: ["", "One flat table", "Fact + dimensions"],
          rows: [
            ["Renaming a region", "Edit every affected row", "Edit one row"],
            ["File size", "Labels repeated per row", "Labels stored once"],
            ["Two facts sharing a dimension", "Impossible", "Both join to it"],
            ["Adding a date table", "Nowhere to put it", "Straightforward"],
            ["Small one-off analysis", "Perfectly fine", "Overkill"],
          ],
          note: "The last row is honest. For one chart from one export, flat is quicker. The star pays off the moment there is a second fact table or a second refresh.",
        },
      },
      {
        id: "a-mod-star",
        title: "The star schema",
        explain:
          "One fact table in the middle, dimensions around it, each joined by a single key. Drawn out it looks like a star. It is the shape Power BI is optimised for and the shape almost every well-behaved model has.",
        why: "Power BI's engine is built assuming this shape. Models that drift away from it — dimensions joined to dimensions, chains of relationships — are slower, harder to reason about, and produce filter behaviour that surprises people.",
        table: {
          caption: "A star for this data.",
          headers: ["Table", "Kind", "Joins to", "On"],
          rows: [
            ["Orders", "Fact", "—", "—"],
            ["States", "Dimension", "Orders", "StateCode"],
            ["Products", "Dimension", "Orders", "ProductId"],
            ["Calendar", "Dimension", "Orders", "OrderDate"],
          ],
          note: "Every dimension touches the fact table directly. Nothing joins dimension to dimension — that is a snowflake, and it is usually worth flattening back.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l49-cardinality",
    moduleId: "m3-modelling",
    sectionId: SECTION_ID,
    order: 2,
    title: "Cardinality",
    subtitle: "Which side is the one, and what happens when neither is",
    estimatedMinutes: 17,
    intro:
      "Cardinality is decided by your data, not by your intentions. Power BI checks whether each key is unique and tells you what it found — and when it says many-to-many, it has discovered something about your data that you did not know.",

    atoms: [
      {
        id: "a-mod-build-it",
        title: "Build the relationship",
        explain:
          "Join the States dimension to the Orders fact on StateCode. Power BI inspects both columns, finds StateCode unique in States and repeated in Orders, and creates a one-to-many relationship.",
        modelExercise: {
          ...MODEL,
          task:
            "Click StateCode in States and StateCode in Orders to join them. Watch what cardinality gets detected — and read the warning that appears underneath.",
          expect: { dimCol: "StateCode", factCol: "StateCode", cardinality: "one-to-many" },
          successMessage:
            "One-to-many, from States to Orders. Notice the orphan warning: ORD-10 carries state code OY, which States has never heard of. That row is about to cause a problem you can see in the breakdown below.",
        },
        why: "Note that you did not tell Power BI which side was which. It read the data. If States had contained a duplicated StateCode, the same click would have produced many-to-many and behaved completely differently.",
      },
      {
        id: "a-mod-cardinality-kinds",
        title: "The four cardinalities",
        explain:
          "One-to-many is the normal case and what you should almost always have. One-to-one usually means two tables that should be one. Many-to-many is a warning that at least one key is not what you thought.",
        table: {
          caption: "What each one means.",
          headers: ["Cardinality", "Means", "Normal?"],
          rows: [
            ["1 : *", "Unique on the dimension, repeated on the fact", "Yes — aim for this"],
            ["* : 1", "The same thing written the other way round", "Yes"],
            ["1 : 1", "Unique on both sides", "Rare — usually one table, split"],
            ["* : *", "Unique on neither side", "Almost always a mistake"],
          ],
          note: "Many-to-many is supported, and occasionally correct. But the first time you see it, assume your dimension has duplicates — that is what it usually is.",
        },
        why: "Many-to-many relationships cannot decide which rows belong together, so totals can be counted more than once and filters behave in ways that are genuinely hard to predict. Fixing the duplicate is nearly always better than accepting the relationship.",
        mistake:
          "Accepting a many-to-many because Power BI allowed it. Allowed and correct are different. Go and look at whether the key on the 'one' side really is unique.",
      },
      {
        id: "a-mod-orphans",
        title: "Orphans, and the (Blank) row",
        explain:
          "A fact row whose key is missing from the dimension cannot be attributed to anything. Power BI does not drop it — it groups every such row under a label of (Blank), which is why a breakdown can fail to add up to its own grand total.",
        why: "This is the most confusing symptom in Power BI for a beginner. The grand total is right, every named row is right, and they do not agree. The difference is always the orphans, and the fix is in Power Query, not in the model.",
        model: {
          ...MODEL,
          initial: { dimCol: "StateCode", factCol: "StateCode" },
        },
        table: {
          caption: "The breakdown, and the gap.",
          headers: ["Row", "Amount", "Orders"],
          rows: [
            ["Lagos", "₦186,000", "4"],
            ["Abuja", "₦215,000", "3"],
            ["Kano", "₦94,000", "2"],
            ["(Blank)", "₦33,000", "1 — state code OY"],
            ["Named states only", "₦495,000", "9"],
            ["Grand Total", "₦528,000", "10"],
          ],
          note: "₦495,000 + ₦33,000 = ₦528,000. Whenever a breakdown does not reconcile to its grand total, look for the (Blank) row first.",
        },
        mistake:
          "Hiding the (Blank) row to make the visual tidy. You have hidden ₦33,000 of real revenue and made the reconciliation impossible for whoever checks it next.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l50-filter-direction",
    moduleId: "m3-modelling",
    sectionId: SECTION_ID,
    order: 3,
    title: "Filter Direction",
    subtitle: "The invisible arrow that decides what your slicers do",
    estimatedMinutes: 17,
    intro:
      "Every relationship carries a direction, and it is the single most important invisible property in your model. Filters flow one way by default, and understanding which way explains most of the behaviour that otherwise looks like a bug.",

    atoms: [
      {
        id: "a-mod-direction",
        title: "Filters flow from one to many",
        explain:
          "A filter applied to the dimension travels down to the fact table automatically. A filter applied to the fact table does NOT travel back up to the dimension. The arrow on the relationship line shows which way.",
        why: "This is why a slicer built on your dimension filters everything, and a slicer built on the fact table appears to do nothing to the other visuals. Nothing is broken — the filter reached the end of its road.",
        modelExercise: {
          ...MODEL,
          initial: { dimCol: "StateCode", factCol: "StateCode" },
          task:
            "The relationship is already built. Use the filter test: first filter States to Lagos and see what reaches Orders, then filter Orders to ORD-1 and see what happens going the other way. Then tick 'Filter both ways' and try again.",
          expect: { dimCol: "StateCode", factCol: "StateCode" },
          successMessage:
            "Filtering States to Lagos leaves 4 orders worth ₦186,000. Filtering Orders to ORD-1 leaves States untouched at 3 rows — until you tick 'Filter both ways'. That asymmetry is the default, and it is deliberate.",
        },
        table: {
          caption: "What travels, and what does not.",
          headers: ["Filter applied to", "Reaches the other table?", "Why"],
          rows: [
            ["States (the one side)", "Yes", "One to many is the default direction"],
            ["Orders (the many side)", "No", "Filters do not travel back by default"],
            ["Orders, both ways enabled", "Yes", "You have opened the return path"],
          ],
        },
      },
      {
        id: "a-mod-bidirectional",
        title: "Bidirectional filtering, and why it is not the default",
        explain:
          "You can set a relationship to filter both ways. It solves a real problem occasionally, and it creates ambiguity whenever two paths exist between the same tables — at which point Power BI cannot decide which route a filter should take.",
        why: "Beginners discover bidirectional filtering while fixing one slicer and then apply it everywhere. In a model with several dimensions that produces circular paths, unpredictable totals and, eventually, an error saying the relationship would create ambiguity.",
        table: {
          caption: "When both directions is justified.",
          headers: ["Situation", "Verdict"],
          rows: [
            ["A slicer on the fact table must filter a dimension", "Sometimes justified"],
            ["A bridge table joining two dimensions", "Often justified"],
            ["It fixed one visual and you left it on", "Not justified"],
            ["Several dimensions, all bidirectional", "Actively harmful"],
          ],
          note: "The safer alternative is usually a measure using CROSSFILTER, which turns the direction on for that one calculation instead of for the whole model.",
        },
        mistake:
          "Turning on bidirectional filtering to fix a slicer, and leaving it on. The slicer works and three other numbers quietly change.",
      },
      {
        id: "a-mod-active-inactive",
        title: "Active and inactive relationships",
        explain:
          "Only one relationship between two tables can be active at a time. A second one — an order has both an order date and a delivery date, for example — is created as inactive, drawn as a dotted line, and does nothing until a measure asks for it.",
        why: "This is the standard solution to the two-dates problem. Your Calendar table joins to OrderDate as the active relationship, and to DeliveryDate as an inactive one; a measure wrapped in USERELATIONSHIP switches to it for that calculation only.",
        syntax: {
          pattern:
            "Delivered Revenue =\n    CALCULATE(\n        SUM(Orders[Amount]),\n        USERELATIONSHIP(Orders[DeliveryDate], Calendar[Date])\n    )",
          args: [
            ["CALCULATE", "Evaluates an expression under modified filter conditions. The workhorse of DAX."],
            ["USERELATIONSHIP", "Activates an inactive relationship for THIS calculation only."],
            ["Orders[DeliveryDate], Calendar[Date]", "The two ends of the inactive relationship being switched on."],
          ],
          returns: "Revenue grouped by delivery date instead of order date, without changing the model.",
          note: "DAX is the next module; this is here because the two-dates problem is a modelling decision and this is the modelling answer to it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l51-date-tables",
    moduleId: "m3-modelling",
    sectionId: SECTION_ID,
    order: 4,
    title: "The Date Table",
    subtitle: "The one dimension every model needs",
    estimatedMinutes: 16,
    intro:
      "Almost every business question has a time component, and almost every time-based calculation in Power BI needs a proper date table. This is the least glamorous thing in the module and the one that breaks the most reports.",

    atoms: [
      {
        id: "a-mod-why-date-table",
        title: "Why the date column in your fact table is not enough",
        explain:
          "A date column records when something happened. A date table records every date in the period, whether anything happened on it or not — plus the year, month, quarter and day names you want to group by.",
        why: "Without one, a month with no sales simply does not appear in your chart, so a line goes straight from March to May and nobody notices the gap. A date table guarantees a continuous axis.",
        table: {
          caption: "What a date table gives you that a date column cannot.",
          headers: ["Need", "Date column alone", "Date table"],
          rows: [
            ["Months with no sales appear", "No — they vanish", "Yes"],
            ["Group by quarter or day name", "Needs a new column each time", "Already there"],
            ["Year-to-date, same period last year", "Unreliable", "Works"],
            ["One axis shared by two fact tables", "Impossible", "Both join to it"],
            ["Sort months in calendar order", "Alphabetical unless fixed", "Sorted by a month number"],
          ],
          note: "The last row is the classic symptom: a chart running April, August, December. That is a date table problem, and it has a standard fix.",
        },
      },
      {
        id: "a-mod-build-date-table",
        title: "Building one",
        explain:
          "Create it in Power Query or in DAX with CALENDAR, add the columns you will group by, mark it as the official date table, and join it to your fact table's date column.",
        syntax: {
          pattern:
            'Calendar =\n    ADDCOLUMNS(\n        CALENDAR(DATE(2024,1,1), DATE(2026,12,31)),\n        "Year",       YEAR([Date]),\n        "MonthNo",    MONTH([Date]),\n        "MonthName",  FORMAT([Date], "MMM"),\n        "Quarter",    "Q" & ROUNDUP(MONTH([Date])/3, 0)\n    )',
          args: [
            ["CALENDAR(start, end)", "Generates one row per day across the whole range, gaps included."],
            ["ADDCOLUMNS", "Adds the grouping columns you will actually use in visuals."],
            ["MonthNo", "The sort key. Without it, MonthName sorts alphabetically — Apr, Aug, Dec."],
            ["Quarter", "Optional, but almost always asked for eventually.", "optional"],
          ],
          returns: "A table with one row per date, ready to be marked as the date table.",
          note: "Cover every date your data could contain, and whole years. A range starting mid-year breaks year-to-date calculations in the first year.",
        },
        table: {
          caption: "The three steps people forget.",
          headers: ["Step", "Where", "If you skip it"],
          rows: [
            ["Mark as date table", "Table tools → Mark as date table", "Time intelligence misbehaves"],
            ["Sort MonthName by MonthNo", "Column tools → Sort by column", "Months sort alphabetically"],
            ["Join to the fact's date column", "Model view", "The date slicer filters nothing"],
          ],
          note: "All three are one-time actions. All three are invisible when missed, and each produces a different confusing symptom.",
        },
        mistake:
          "Building the date table and forgetting to mark it. Everything looks right, the visuals work, and time intelligence functions return quietly wrong numbers.",
      },
      {
        id: "a-mod-date-in-model",
        title: "Where the date table sits in the star",
        explain:
          "It is a dimension like any other: one row per date, joined one-to-many to the fact table's date column. If you have two fact tables, both join to the same date table — which is how one date slicer controls both.",
        why: "This is the clearest example of why the star schema matters. Two fact tables sharing one date dimension means one slicer filters both. Flatten the dates into each fact table instead and no slicer can ever control them together.",
        table: {
          caption: "One date table, two facts.",
          headers: ["Table", "Kind", "Joins to Calendar on"],
          rows: [
            ["Calendar", "Dimension", "—"],
            ["Orders", "Fact", "OrderDate"],
            ["Targets", "Fact", "MonthStart"],
          ],
          note: "Now a single date slicer filters both actuals and targets, which is exactly what a variance report needs.",
        },
      },
      {
        id: "a-mod-checklist",
        title: "The model checklist",
        explain:
          "Before you write a single measure: every relationship one-to-many, arrows pointing from dimensions to facts, no bidirectional filtering you cannot justify, a marked date table, and no orphan rows.",
        why: "Every one of these is invisible in a finished report and each produces a different wrong number. Checking them takes two minutes in Model view and saves the afternoon you would otherwise spend wondering why a total moved.",
        table: {
          caption: "Check these in Model view.",
          headers: ["Check", "Symptom if wrong"],
          rows: [
            ["Every relationship is 1 : *", "Totals double-count unpredictably"],
            ["Arrows run dimension → fact", "Slicers appear to do nothing"],
            ["No unjustified bidirectional filters", "Numbers change when unrelated slicers move"],
            ["A date table exists and is marked", "Time intelligence returns wrong values"],
            ["MonthName sorts by MonthNo", "Charts run Apr, Aug, Dec"],
            ["No orphan keys", "A (Blank) row, and a breakdown that will not reconcile"],
          ],
          note: "Six checks, two minutes, in the view most beginners never open. This is the module people skip and regret.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
