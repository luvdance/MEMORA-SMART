/**
 * ASSESSMENTS · DAX FROM ZERO (m3-dax)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * DAX is the easiest subject in the course to assess badly, because "what does
 * SUM do?" is answerable by anyone who has used Excel. Every question here
 * describes a measure returning a WRONG NUMBER with no error — which is the
 * only symptom DAX ever gives you — and asks what is actually wrong.
 *
 * Figures come from the model in the lesson file, computed by lib/academy/dax.js:
 *   Lagos 186,000 (4) · Abuja 215,000 (3) · Kano 94,000 (2) · Total 495,000 (9)
 *   average order 55,000 · % of total 37.58 / 43.43 / 18.99
 *   over 50,000: Lagos 56,000 · Abuja 215,000 · Kano 51,000 · all 322,000
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l52-measures-vs-columns": {
    lessonId: "l52-measures-vs-columns",
    passMark: 70,
    questions: [
      {
        id: "q52-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-which-one",
        prompt:
          "You write total revenue as a calculated column. The card shows a number, but no slicer changes it. Why?",
        options: [
          { id: "a", text: "The slicer is not connected" },
          { id: "b", text: "A calculated column is evaluated once on refresh and stored, so it cannot respond to a filter applied later" },
          { id: "c", text: "Cards cannot be filtered" },
          { id: "d", text: "You need to refresh" },
        ],
        correct: "b",
        explanation:
          "The value was computed before the slicer existed and written into the file. Only a measure is re-evaluated when the visual asks, which is why anything that must react to a filter has to be a measure.",
        whyWrong: {
          a: "The slicer is working; the stored column simply cannot react to it.",
          c: "Cards filter perfectly well when they display a measure.",
          d: "Refreshing recomputes the same stored value against the same data.",
        },
      },
      {
        id: "q52-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-dax-which-one",
        prompt:
          "You need an 'order size band' — Small, Medium, Large — to group a chart by. Measure or calculated column?",
        options: [
          { id: "a", text: "A measure" },
          { id: "b", text: "A calculated column, because you need to slice and group BY the result" },
          { id: "c", text: "Either works" },
          { id: "d", text: "Neither; do it in the visual" },
        ],
        correct: "b",
        explanation:
          "The test is whether you group or filter BY the result. You can only put a real column on an axis; a measure returns a number and cannot be an axis. Better still, create the band in Power Query, which costs less than a calculated column.",
        whyWrong: {
          a: "A measure cannot be placed on an axis, so there would be nothing to group by.",
          c: "Only one of them can appear on an axis.",
          d: "A visual can bin a numeric field, but a named band you control is clearer and reusable.",
        },
      },
      {
        id: "q52-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-dax-divide",
        prompt:
          "Why prefer DIVIDE([Revenue], [Orders]) over [Revenue] / [Orders]?",
        options: [
          { id: "a", text: "It is faster" },
          { id: "b", text: "It returns blank instead of an error when the denominator is zero or blank" },
          { id: "c", text: "The slash operator does not work in DAX" },
          { id: "d", text: "It rounds automatically" },
        ],
        correct: "b",
        explanation:
          "A state with no orders divides by zero. The slash produces an error that spreads into every visual reading the measure; DIVIDE returns blank, which renders as an empty cell and is excluded from averages.",
        whyWrong: {
          a: "Performance is not the argument; error handling is.",
          c: "The slash works fine. It just fails badly on zero.",
          d: "Neither form rounds. That is what number formatting is for.",
        },
      },
      {
        id: "q52-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-divide",
        prompt:
          "Should you use DIVIDE's third argument to return 0 instead of blank?",
        options: [
          { id: "a", text: "Yes — blank looks untidy in a report" },
          { id: "b", text: "Usually not: 0 looks like a real measurement and will be averaged as one, where blank is correctly excluded" },
          { id: "c", text: "Yes, always" },
          { id: "d", text: "It makes no difference" },
        ],
        correct: "b",
        explanation:
          "This is the Month 2 blank-versus-zero lesson in a new language. A blank means 'no value exists'; a 0 is a measurement that drags every average down. Only pass 0 when zero is genuinely the right answer.",
        whyWrong: {
          a: "Tidiness is not worth fabricating a measurement for.",
          c: "Occasionally right, usually wrong — and never as a default.",
          d: "It changes every average computed over that column.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l53-aggregations": {
    lessonId: "l53-aggregations",
    passMark: 70,
    questions: [
      {
        id: "q53-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-count-variants",
        prompt:
          "You report COUNTROWS(Orders) as your customer count. One customer placed 40 of the 100 orders. What have you reported?",
        options: [
          { id: "a", text: "The correct customer count" },
          { id: "b", text: "100 customers, when the real number is far lower — you counted orders, not people" },
          { id: "c", text: "40 customers" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation:
          "COUNTROWS counts rows. For people you need DISTINCTCOUNT(Orders[CustomerId]). The gap between the two figures is repeat business — which is useful information, once you know which number is which.",
        whyWrong: {
          a: "It is a correct count of the wrong thing, which is the most dangerous kind of wrong.",
          c: "40 is one customer's order count, not a customer count.",
          d: "It returns a number without complaint. That is the problem.",
        },
      },
      {
        id: "q53-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-dax-four",
        prompt:
          "Which of these is the correct syntax?",
        options: [
          { id: "a", text: "COUNTROWS(Orders[Amount])" },
          { id: "b", text: "COUNTROWS(Orders)" },
          { id: "c", text: "SUM(Orders)" },
          { id: "d", text: "AVERAGE(Orders)" },
        ],
        correct: "b",
        explanation:
          "COUNTROWS takes a TABLE; SUM and AVERAGE take a COLUMN. Passing a column to COUNTROWS is the commonest DAX syntax error a beginner hits, and the message is not especially helpful about it.",
        whyWrong: {
          a: "That passes a column where a table is required.",
          c: "SUM needs a column — SUM(Orders[Amount]).",
          d: "AVERAGE needs a column too.",
        },
      },
      {
        id: "q53-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-per-row",
        prompt:
          "Your Revenue measure reads ₦186,000 on the Lagos row and ₦495,000 on the Total row. Is something wrong?",
        options: [
          { id: "a", text: "Yes — a measure should return one value" },
          { id: "b", text: "No — a measure is re-evaluated in every cell against the rows that cell's filter allows" },
          { id: "c", text: "Yes, the relationship is broken" },
          { id: "d", text: "Yes, the Total row is double-counting" },
        ],
        correct: "b",
        explanation:
          "This is filter context working exactly as intended. The Lagos row filters Orders to 4 rows; the Total row filters nothing and sees all 9. One definition, a different answer per cell — and ₦186,000 + ₦215,000 + ₦94,000 = ₦495,000 confirms it.",
        whyWrong: {
          a: "A measure returns one value PER CELL, not one value overall. That is the central idea in DAX.",
          c: "A broken relationship would show the same total on every row, or blanks.",
          d: "The three state rows sum exactly to the total, so nothing is counted twice.",
        },
      },
      {
        id: "q53-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-dax-four",
        prompt:
          "Revenue is ₦495,000 across 9 orders, and your Avg Order measure shows ₦55,000. What does that tell you?",
        options: [
          { id: "a", text: "Nothing useful" },
          { id: "b", text: "The measures are consistent — 495,000 ÷ 9 = 55,000 — which is a sanity check worth running on every new measure" },
          { id: "c", text: "The average is wrong" },
          { id: "d", text: "There must be a hidden filter" },
        ],
        correct: "b",
        explanation:
          "Cross-checking a new measure against two you already trust is the cheapest way to catch a mistake. When the three numbers reconcile, the definition is very unlikely to be badly wrong.",
        whyWrong: {
          a: "A reconciliation between three measures is one of the most useful things you can check.",
          c: "It is exactly right, which is the point.",
          d: "A hidden filter would break the reconciliation rather than preserve it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l54-context": {
    lessonId: "l54-context",
    passMark: 70,
    questions: [
      {
        id: "q54-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-see-it",
        prompt:
          "Your percent-of-total measure shows 100% on every single row. What is wrong?",
        options: [
          { id: "a", text: "The data has only one state" },
          { id: "b", text: "The denominator is missing ALL(), so it is filtered by the same row as the numerator and each row divides by itself" },
          { id: "c", text: "The measure needs DIVIDE" },
          { id: "d", text: "The percentages need formatting" },
        ],
        correct: "b",
        explanation:
          "Without ALL() the denominator inherits the row's filter, so Lagos revenue is divided by Lagos revenue. Nothing errors and the visual renders, which is why this specific bug reaches production more than any other in DAX.",
        whyWrong: {
          a: "With one state the answer would legitimately be 100%, but you would see one row, not several.",
          c: "DIVIDE prevents divide-by-zero errors. It cannot fix a denominator that is filtered wrongly.",
          d: "The values really are 1.0. Formatting would only change how 100% is displayed.",
        },
      },
      {
        id: "q54-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-row-context",
        prompt:
          "Why does SUM(Orders[Price] * Orders[Quantity]) fail?",
        options: [
          { id: "a", text: "You cannot multiply in DAX" },
          { id: "b", text: "SUM takes a single column, and multiplying two columns is a row-by-row operation — it needs SUMX, which supplies a row context" },
          { id: "c", text: "The columns are the wrong type" },
          { id: "d", text: "You need CALCULATE" },
        ],
        correct: "b",
        explanation:
          "SUM expects one column reference. Multiplying two columns has to happen per row, and a measure has no row context — so you need an iterator: SUMX(Orders, Orders[Price] * Orders[Quantity]).",
        whyWrong: {
          a: "Multiplication is fine. The problem is where it happens.",
          c: "Both are numeric. The issue is the missing row context.",
          d: "CALCULATE changes filter context; it does not create a row context.",
        },
      },
      {
        id: "q54-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-filter-context",
        prompt:
          "A filter on the States table reaches the Orders table. What carries it there?",
        options: [
          { id: "a", text: "DAX searches every table automatically" },
          { id: "b", text: "The relationship between them — filter context travels along the joins in your model" },
          { id: "c", text: "The RELATED function" },
          { id: "d", text: "Nothing; you must filter Orders separately" },
        ],
        correct: "b",
        explanation:
          "This is where the modelling module pays off. A filter on the one side flows down the relationship to the many side automatically, which is why a slicer on a dimension filters every measure built on the fact table — no function required.",
        whyWrong: {
          a: "There is no automatic search. Without a relationship the filter goes nowhere.",
          c: "RELATED fetches a value in a row context. The filter travels without it.",
          d: "Filtering both separately is what people do when they have not built the relationship.",
        },
      },
      {
        id: "q54-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-dax-row-context",
        prompt:
          "Which has a row context?",
        options: [
          { id: "a", text: "A measure" },
          { id: "b", text: "A calculated column, and anything inside SUMX" },
          { id: "c", text: "A slicer" },
          { id: "d", text: "Everything in DAX" },
        ],
        correct: "b",
        explanation:
          "A calculated column knows which row it is on. A measure does not — it has filter context instead. Iterators like SUMX create a row context deliberately, which is the whole reason the X functions exist.",
        whyWrong: {
          a: "A measure aggregates over rows; it never stands on one.",
          c: "A slicer contributes to filter context, not row context.",
          d: "The distinction between the two is precisely what makes DAX hard.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l55-calculate": {
    lessonId: "l55-calculate",
    passMark: 70,
    questions: [
      {
        id: "q55-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-calculate",
        prompt:
          'You write CALCULATE(SUM(Orders[Amount]), States[StateName] = "Lagos") and every row of your state visual shows the Lagos figure. Why?',
        options: [
          { id: "a", text: "The measure is broken" },
          { id: "b", text: "A CALCULATE filter REPLACES any existing filter on that column, so it overwrote each row's own state filter" },
          { id: "c", text: "The relationship is bidirectional" },
          { id: "d", text: "You need ALL()" },
        ],
        correct: "b",
        explanation:
          "CALCULATE replaces rather than narrows. Each row tried to filter to its own state and CALCULATE overwrote that with Lagos. Wrap the filter in KEEPFILTERS when you want to narrow the existing context instead.",
        whyWrong: {
          a: "It is doing exactly what CALCULATE is defined to do, which is the part that surprises people.",
          c: "Filter direction is not involved; the replacement happens inside CALCULATE.",
          d: "ALL() removes filters. That would make the problem broader, not narrower.",
        },
      },
      {
        id: "q55-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-calculate-condition",
        prompt:
          "Your 'orders over ₦50,000' measure shows ₦215,000 for Abuja — identical to Abuja's total revenue. What should you conclude?",
        options: [
          { id: "a", text: "The measure is broken" },
          { id: "b", text: "Every Abuja order is over ₦50,000, so the filter removes nothing there — a finding about Abuja, not a bug" },
          { id: "c", text: "CALCULATE ignored the condition" },
          { id: "d", text: "The threshold is wrong" },
        ],
        correct: "b",
        explanation:
          "Abuja's three orders are ₦62,000, ₦98,000 and ₦55,000 — all above the threshold. Checking a surprising result against the underlying rows, rather than assuming the measure is wrong, is the habit worth building.",
        whyWrong: {
          a: "Lagos shows ₦56,000 of ₦186,000 and Kano ₦51,000 of ₦94,000, so the condition is clearly working.",
          c: "If it had been ignored, every state would show its full total, not just Abuja.",
          d: "The threshold is doing its job. Abuja simply has no small orders.",
        },
      },
      {
        id: "q55-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-filter-function",
        prompt:
          "When should you use FILTER rather than a simple condition inside CALCULATE?",
        options: [
          { id: "a", text: "Always — it is more reliable" },
          { id: "b", text: "Only when the condition is too complex for the simple form, such as comparing two columns or involving a measure" },
          { id: "c", text: "Never" },
          { id: "d", text: "When the table is small" },
        ],
        correct: "b",
        explanation:
          "FILTER iterates row by row, so it costs more than the simple form. Use it when you genuinely need its power — a comparison between columns, or a condition referencing a measure — and the simple condition otherwise.",
        whyWrong: {
          a: "Wrapping everything in FILTER is a real performance cost on a large model for no benefit.",
          c: "Some conditions cannot be expressed any other way.",
          d: "Table size is not the criterion; what the condition needs to express is.",
        },
      },
      {
        id: "q55-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-dax-variables",
        prompt:
          "What do variables give you beyond readability?",
        options: [
          { id: "a", text: "Nothing — they are purely cosmetic" },
          { id: "b", text: "A repeated sub-expression is evaluated once instead of every time it appears, and you can RETURN a variable to debug it" },
          { id: "c", text: "They make measures recalculate faster on refresh" },
          { id: "d", text: "They allow row context" },
        ],
        correct: "b",
        explanation:
          "A VAR is evaluated once, so repeating it is free. And temporarily changing RETURN to a variable name shows you what that step produced, which is the closest thing DAX has to a debugger.",
        whyWrong: {
          a: "The single-evaluation behaviour is a genuine performance property.",
          c: "Measures are not evaluated on refresh at all; they run when a visual asks.",
          d: "Row context comes from iterators and calculated columns, not from variables.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l56-time-and-relationships": {
    lessonId: "l56-time-and-relationships",
    passMark: 70,
    questions: [
      {
        id: "q56-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-time-needs-date-table",
        prompt:
          "Your TOTALYTD measure returns odd numbers. Everything renders and nothing errors. What do you check first?",
        options: [
          { id: "a", text: "The measure syntax" },
          { id: "b", text: "That a proper date table exists, covers whole years, and is MARKED as the date table" },
          { id: "c", text: "The visual type" },
          { id: "d", text: "Whether you have Power BI Pro" },
        ],
        correct: "b",
        explanation:
          "Time intelligence assumes a marked, continuous date dimension. Without one the functions do not error — they return plausible wrong values, which is the worst failure mode available.",
        whyWrong: {
          a: "Worth a glance, but the syntax is usually fine; the prerequisite is what is missing.",
          c: "The visual displays whatever the measure returns.",
          d: "Licensing has no bearing on how a measure calculates.",
        },
      },
      {
        id: "q56-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-ytd",
        prompt:
          "Which date column should a time intelligence function reference?",
        options: [
          { id: "a", text: "The fact table's own date column" },
          { id: "b", text: "The date column of the marked date table" },
          { id: "c", text: "Either" },
          { id: "d", text: "A calculated column of dates" },
        ],
        correct: "b",
        explanation:
          "The date table has a row for every date, so accumulation and period shifting work even across periods with no sales. A fact table's date column only contains dates on which something happened.",
        whyWrong: {
          a: "It works on the data you have and breaks the moment a period is empty, because that date is not there to accumulate.",
          c: "They behave differently precisely where it matters most.",
          d: "A calculated column of the dates you already have has the same gaps as the original.",
        },
      },
      {
        id: "q56-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-related",
        prompt:
          "Why does RELATED not work inside a plain measure?",
        options: [
          { id: "a", text: "It is deprecated" },
          { id: "b", text: "It needs a row context to know which row to look up from, and a measure has filter context instead" },
          { id: "c", text: "It only works on one-to-one relationships" },
          { id: "d", text: "It requires bidirectional filtering" },
        ],
        correct: "b",
        explanation:
          "RELATED follows the relationship from the current row, so it needs a row to stand on. That exists in a calculated column or inside an iterator, and not in a plain measure — a direct consequence of the row-versus-filter-context distinction.",
        whyWrong: {
          a: "It is current and widely used, in the right places.",
          c: "It follows many-to-one relationships, which is the normal shape.",
          d: "Filter direction is a separate concern from row context.",
        },
      },
      {
        id: "q56-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-dax-userelationship",
        prompt:
          "An order has an order date and a delivery date, and you need revenue by each. What does USERELATIONSHIP do for you?",
        options: [
          { id: "a", text: "Creates a second relationship" },
          { id: "b", text: "Activates an existing INACTIVE relationship for one calculation, so one date table serves both questions" },
          { id: "c", text: "Makes both relationships active permanently" },
          { id: "d", text: "Duplicates the date table" },
        ],
        correct: "b",
        explanation:
          "The inactive relationship must already exist. Wrapped in CALCULATE, USERELATIONSHIP switches to it for that measure only, leaving the model's active relationship untouched — so [Revenue] and [Delivered Revenue] can sit side by side on one date axis.",
        whyWrong: {
          a: "It activates a relationship; it does not create one. Build the inactive relationship first.",
          c: "Only one relationship between two tables can ever be active, and this changes nothing permanently.",
          d: "A second date table is exactly what this technique avoids.",
        },
      },
    ],
  },
};
