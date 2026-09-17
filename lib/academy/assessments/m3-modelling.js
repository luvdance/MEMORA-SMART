/**
 * ASSESSMENTS · DATA MODELLING & RELATIONSHIPS (m3-modelling)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Modelling questions are easy to write as vocabulary — "what is a fact
 * table?" — which tests nothing useful. Every question here describes a model
 * that is producing a WRONG NUMBER with no error, and asks what is wrong,
 * because that is the only symptom a bad model ever gives you.
 *
 * Figures come from the model in the lesson file, computed by lib/academy/model.js:
 *   Lagos 186,000 · Abuja 215,000 · Kano 94,000 · named 495,000
 *   orphan (OY) 33,000 · grand total 528,000
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l48-facts-and-dimensions": {
    lessonId: "l48-facts-and-dimensions",
    passMark: 70,
    questions: [
      {
        id: "q48-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mod-fact-dim",
        prompt:
          "A Region column describes which region a state belongs to. Where should it live?",
        options: [
          { id: "a", text: "In the Orders fact table, on every order" },
          { id: "b", text: "In the States dimension, beside the state it describes" },
          { id: "c", text: "In its own fact table" },
          { id: "d", text: "In a measure" },
        ],
        correct: "b",
        explanation:
          "Region is a property of a state, not of an order. Storing it beside the state means it is held once and renaming it is a one-row edit, instead of being repeated on every order that ever happens.",
        whyWrong: {
          a: "Repeating it per order wastes space and means a rename has to find every affected row.",
          c: "Facts record events. A region is a thing, not an event.",
          d: "A measure calculates a number. Region is a label you group by.",
        },
      },
      {
        id: "q48-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-keys",
        prompt:
          "Power BI refuses to create a one-to-many relationship and offers many-to-many instead. What does that tell you about your dimension?",
        options: [
          { id: "a", text: "The tables are too large" },
          { id: "b", text: "The key you thought was unique is repeated in the dimension" },
          { id: "c", text: "The data types differ" },
          { id: "d", text: "You need a bridge table" },
        ],
        correct: "b",
        explanation:
          "Power BI reads the data and decides the cardinality from it. One-to-many requires the key to be genuinely unique on the dimension side, so many-to-many means it is not — usually duplicated rows in an export.",
        whyWrong: {
          a: "Size has no bearing on cardinality.",
          c: "A type mismatch usually prevents the relationship entirely rather than downgrading it.",
          d: "A bridge is a way of living with many-to-many. Here the better move is to find and remove the duplicates.",
        },
      },
      {
        id: "q48-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mod-why-not-flat",
        prompt:
          "When is one flat table genuinely the right choice?",
        options: [
          { id: "a", text: "Never — always build a star" },
          { id: "b", text: "For a small one-off analysis from a single export", },
          { id: "c", text: "When you have two fact tables" },
          { id: "d", text: "When you need a date slicer across two tables" },
        ],
        correct: "b",
        explanation:
          "For one chart from one export, flattening is quicker and nothing is lost. The star pays off the moment there is a second fact table, a shared dimension, or a refresh schedule.",
        whyWrong: {
          a: "Dogma. A one-off answer does not need a model built around it.",
          c: "Two facts is precisely when a flat table stops working, because they cannot share a dimension.",
          d: "A shared date slicer requires a shared date dimension, which a flat table cannot provide.",
        },
      },
      {
        id: "q48-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-star",
        prompt:
          "In a star schema, what should a dimension table join to?",
        options: [
          { id: "a", text: "Other dimension tables, forming a chain" },
          { id: "b", text: "The fact table, directly" },
          { id: "c", text: "Nothing — dimensions stand alone" },
          { id: "d", text: "Whichever table is nearest on the canvas" },
        ],
        correct: "b",
        explanation:
          "Every dimension touches the fact table directly. Dimensions joined to dimensions form a snowflake, which is slower and produces filter behaviour that is harder to reason about.",
        whyWrong: {
          a: "That is a snowflake. It works, but it is usually worth flattening back into the dimension.",
          c: "An unjoined dimension cannot filter anything.",
          d: "Canvas position is cosmetic. Relationships follow the keys, not the layout.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l49-cardinality": {
    lessonId: "l49-cardinality",
    passMark: 70,
    questions: [
      {
        id: "q49-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-orphans",
        prompt:
          "Your state breakdown shows ₦186,000 + ₦215,000 + ₦94,000 = ₦495,000, but the Grand Total reads ₦528,000. What is the ₦33,000 difference?",
        options: [
          { id: "a", text: "A rounding error" },
          { id: "b", text: "Orders whose state code does not exist in the States table, grouped under (Blank)" },
          { id: "c", text: "A filter on the visual" },
          { id: "d", text: "Power BI has calculated the total wrongly" },
        ],
        correct: "b",
        explanation:
          "ORD-10 carries state code OY, which States has never heard of. Power BI does not drop the row — it groups every unmatched row under (Blank). The grand total is right; the named rows are right; the gap is exactly the orphans.",
        whyWrong: {
          a: "These are whole naira amounts. Rounding cannot produce ₦33,000.",
          c: "A visual filter would reduce the grand total too, so the two would still agree.",
          d: "₦528,000 is the honest sum of all ten orders. The breakdown is the incomplete view.",
        },
      },
      {
        id: "q49-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-orphans",
        prompt:
          "Where do you fix the orphan rows?",
        options: [
          { id: "a", text: "In the model, by changing the relationship" },
          { id: "b", text: "In Power Query — either correct the state code or add the missing state to the dimension" },
          { id: "c", text: "By hiding the (Blank) row in the visual" },
          { id: "d", text: "With a DAX measure" },
        ],
        correct: "b",
        explanation:
          "It is a data problem, so it belongs in Power Query. Either the code is wrong and should be corrected, or Oyo is a real state missing from the dimension and should be added. Both fixes are recorded steps that repeat on refresh.",
        whyWrong: {
          a: "No relationship setting can match a key to a row that does not exist.",
          c: "Hiding it conceals ₦33,000 of real revenue and makes the reconciliation impossible for the next person.",
          d: "DAX can paper over the symptom, but the missing reference is still there and every new visual inherits it.",
        },
      },
      {
        id: "q49-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mod-cardinality-kinds",
        prompt:
          "Which cardinality should the overwhelming majority of your relationships be?",
        options: [
          { id: "a", text: "One-to-one" },
          { id: "b", text: "One-to-many" },
          { id: "c", text: "Many-to-many" },
          { id: "d", text: "It does not matter" },
        ],
        correct: "b",
        explanation:
          "One dimension row, many fact rows — one state, many orders. That is the shape the engine is built for and the one with predictable filter behaviour.",
        whyWrong: {
          a: "One-to-one usually means two tables that should be a single table.",
          c: "Supported and occasionally correct, but the first time you see it, suspect duplicates in your dimension.",
          d: "It decides whether totals double-count and which way filters travel. It matters more than almost anything else in the model.",
        },
      },
      {
        id: "q49-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-build-it",
        prompt:
          "You join two tables on a column and Power BI reports many-to-many, but you are certain it should be one-to-many. What do you check first?",
        options: [
          { id: "a", text: "That both columns have the same name" },
          { id: "b", text: "Whether the key really is unique on the dimension side — count distinct values against row count" },
          { id: "c", text: "That the tables are in the same folder" },
          { id: "d", text: "The visual you were building" },
        ],
        correct: "b",
        explanation:
          "Cardinality is derived from the data. If Power BI says the key repeats, it repeats. Comparing distinct values against the row count finds the duplicate, which is usually an export that returned a row per something else as well.",
        whyWrong: {
          a: "Column names are irrelevant to the relationship; only the values matter.",
          c: "File location has no bearing on cardinality.",
          d: "The visual is downstream. The model is where the problem is.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l50-filter-direction": {
    lessonId: "l50-filter-direction",
    passMark: 70,
    questions: [
      {
        id: "q50-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-direction",
        prompt:
          "You build a slicer on a column in the Orders fact table and the other visuals do not respond. What is happening?",
        options: [
          { id: "a", text: "The slicer is broken" },
          { id: "b", text: "Filters travel from the one side to the many side, not back — so a fact-table filter does not reach the dimension" },
          { id: "c", text: "The relationship is missing" },
          { id: "d", text: "You need to refresh" },
        ],
        correct: "b",
        explanation:
          "The filter reached the end of its road. Filtering States to Lagos reaches Orders automatically; filtering Orders leaves States untouched unless the relationship filters both ways. Slicers usually belong on dimensions for exactly this reason.",
        whyWrong: {
          a: "It is filtering its own table correctly. The question is whether that filter travels.",
          c: "With no relationship at all, even the dimension-side filter would fail.",
          d: "Refreshing reloads data and changes nothing about filter direction.",
        },
      },
      {
        id: "q50-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-bidirectional",
        prompt:
          "Bidirectional filtering fixed one slicer, so you turn it on for every relationship. What is the likely result?",
        options: [
          { id: "a", text: "Everything works better" },
          { id: "b", text: "Ambiguous filter paths, unpredictable totals, and eventually an error about ambiguity" },
          { id: "c", text: "No change" },
          { id: "d", text: "Faster refreshes" },
        ],
        correct: "b",
        explanation:
          "Once two routes exist between the same tables, Power BI cannot decide which one a filter should take. Numbers start changing when unrelated slicers move, which is close to impossible to debug after the fact.",
        whyWrong: {
          a: "It fixes one visual and quietly changes others.",
          c: "The change is real but invisible until a total is wrong.",
          d: "Bidirectional relationships make the engine do more work, not less.",
        },
      },
      {
        id: "q50-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-active-inactive",
        prompt:
          "An order has both an order date and a delivery date, and you need to analyse by each. How is this normally modelled?",
        options: [
          { id: "a", text: "Two date tables" },
          { id: "b", text: "One date table with two relationships — one active, one inactive, switched on per measure with USERELATIONSHIP" },
          { id: "c", text: "Copy the orders table" },
          { id: "d", text: "A bidirectional relationship" },
        ],
        correct: "b",
        explanation:
          "Only one relationship between two tables can be active. The second is created as inactive and does nothing until a measure wrapped in USERELATIONSHIP asks for it, so one date table serves both questions.",
        whyWrong: {
          a: "Two date tables means two date slicers, and a reader who has to know which one drives which visual.",
          c: "Duplicating a fact table doubles the data and creates two versions of the truth.",
          d: "Bidirectional filtering does not choose between two date columns; it changes which way filters travel.",
        },
      },
      {
        id: "q50-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mod-direction",
        prompt:
          "Which table should a slicer usually be built on?",
        options: [
          { id: "a", text: "The fact table, where the data is" },
          { id: "b", text: "A dimension, because filters flow from there to the facts automatically" },
          { id: "c", text: "Either — it makes no difference" },
          { id: "d", text: "A measure" },
        ],
        correct: "b",
        explanation:
          "A dimension sits on the one side, so its filter travels to every fact joined to it. That is why a state slicer built on States filters everything, while the same slicer built on Orders filters only Orders.",
        whyWrong: {
          a: "The fact table is the many side, so its filters do not travel back by default.",
          c: "It makes the difference between a slicer that filters the report and one that filters a single visual.",
          d: "A measure returns a number. It is not something you can slice by.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l51-date-tables": {
    lessonId: "l51-date-tables",
    passMark: 70,
    questions: [
      {
        id: "q51-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-why-date-table",
        prompt:
          "Your line chart jumps straight from March to May. April had no sales. What is the fix?",
        options: [
          { id: "a", text: "Add a zero row for April to the fact table" },
          { id: "b", text: "Use a date table containing every date, so April appears whether or not anything happened" },
          { id: "c", text: "Change the chart type" },
          { id: "d", text: "Sort the axis" },
        ],
        correct: "b",
        explanation:
          "A date column only contains dates on which something happened, so a month with no sales cannot appear. A date table has a row for every date in the period and guarantees a continuous axis.",
        whyWrong: {
          a: "Inventing a fake order to fix an axis puts fabricated data in your fact table.",
          c: "A column chart would have the same gap. The axis is the problem, not the mark.",
          d: "The months are already in order; April simply is not there to sort.",
        },
      },
      {
        id: "q51-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mod-build-date-table",
        prompt:
          "Your chart shows months in the order Apr, Aug, Dec, Feb… What is wrong?",
        options: [
          { id: "a", text: "The data is corrupted" },
          { id: "b", text: "MonthName is text and is sorting alphabetically — it needs Sort by Column set to a month number" },
          { id: "c", text: "The date table is missing" },
          { id: "d", text: "The relationship is inactive" },
        ],
        correct: "b",
        explanation:
          "Month names are text, so Power BI sorts them alphabetically until you tell it otherwise. Column tools → Sort by column → MonthNo fixes it permanently, and it is a one-time action people routinely forget.",
        whyWrong: {
          a: "The data is fine; only the sort order is wrong.",
          c: "You would not have month names at all without one.",
          d: "An inactive relationship would leave the visual empty or unfiltered, not misordered.",
        },
      },
      {
        id: "q51-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-build-date-table",
        prompt:
          "You built a date table and joined it, but time intelligence returns odd numbers. What was probably skipped?",
        options: [
          { id: "a", text: "Marking it as the date table in Table tools" },
          { id: "b", text: "Refreshing the model" },
          { id: "c", text: "Hiding the table" },
          { id: "d", text: "Adding a measure" },
        ],
        correct: "a",
        explanation:
          "Marking the table tells Power BI this is the official date dimension, which time intelligence relies on. Everything looks right without it and the calculations return quietly wrong values — the worst kind of failure.",
        whyWrong: {
          b: "Refreshing reloads data; it does not designate a date table.",
          c: "Hiding is cosmetic and affects only what report authors see in the field list.",
          d: "The measures are the things returning wrong numbers; adding more does not help.",
        },
      },
      {
        id: "q51-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-mod-date-in-model",
        prompt:
          "You have an Orders table and a Targets table and need one date slicer to control both. How?",
        options: [
          { id: "a", text: "Put a date slicer on each table" },
          { id: "b", text: "Join both fact tables to the same date dimension, then slice on that" },
          { id: "c", text: "Merge the two tables in Power Query" },
          { id: "d", text: "Use bidirectional filtering between them" },
        ],
        correct: "b",
        explanation:
          "This is the clearest argument for the star schema. Two facts joined to one shared date dimension means a single slicer on that dimension filters both — which is exactly what a variance report needs.",
        whyWrong: {
          a: "Two slicers means the reader can set them to different periods and compare unrelated things.",
          c: "Merging actuals and targets into one table forces a row shape that suits neither.",
          d: "Bidirectional filtering between two fact tables creates ambiguity rather than a shared axis.",
        },
      },
    ],
  },
};
