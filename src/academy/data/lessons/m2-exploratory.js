/**
 * MODULE · EXPLORATORY DATA ANALYSIS (m2-exploratory)
 * Month 2 — Excel Data Analysis
 *
 * The first module where the learner stops being told what a function does
 * and starts being asked what a dataset MEANS. Every atom here exists to
 * answer one question: when a spreadsheet lands in your inbox and nobody
 * tells you what is wrong with it, what do you actually do first?
 *
 * TEACHING RULES FOR THIS MODULE
 *   · Every function states its SIGNATURE before its example, so a learner
 *     can generalise it rather than copy one worked case.
 *   · Every number in a table is real: computed from ORDERS below, not
 *     invented. A learner who checks us in Excel must find we were right.
 *   · Every planted flaw in the data is findable with the tools taught here.
 *     The outlier and the zero are both caught by the IQR rule in l23, which
 *     is the point of choosing those values.
 *
 * THE RUNNING DATASET — ten orders, reused across all five lessons so the
 * learner is never re-reading a new table:
 *   · ORD-1006 is 980,000 against a typical 45,000 — a genuine outlier that
 *     drags the mean from 48,000 to 137,000.
 *   · ORD-1008 has an amount of 0 — either a cancellation or a data error,
 *     and the learner is taught to ask which.
 *   · ORD-1005 has no rating — the missing value that makes COUNT and
 *     COUNTA disagree.
 *   · ORD-1009 took 21 days to deliver against a typical 3 — an outlier in a
 *     different column, to show that profiling is per-column work.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s5-exploratory";

/**
 * Ten orders. The flaws are deliberate and each one is teachable.
 * Amounts sorted: 0, 38k, 43k, 45k, 47k, 49k, 51k, 55k, 62k, 980k
 *   SUM 1,370,000 · AVERAGE 137,000 · MEDIAN 48,000
 *   Q1 43,500 · Q3 54,000 · IQR 10,500 · upper fence 69,750
 */
const ORDERS = {
  A1: "Order", B1: "State", C1: "Amount", D1: "Days", E1: "Rating",
  A2: "ORD-1001", B2: "Lagos", C2: 45000, D2: 3, E2: 4,
  A3: "ORD-1002", B3: "Abuja", C3: 62000, D3: 5, E3: 5,
  A4: "ORD-1003", B4: "Lagos", C4: 38000, D4: 2, E4: 4,
  A5: "ORD-1004", B5: "Kano", C5: 51000, D5: 4, E5: 3,
  A6: "ORD-1005", B6: "Lagos", C6: 47000, D6: 3, E6: "",
  A7: "ORD-1006", B7: "Abuja", C7: 980000, D7: 6, E7: 5,
  A8: "ORD-1007", B8: "Kano", C8: 43000, D8: 4, E8: 4,
  A9: "ORD-1008", B9: "Lagos", C9: 0, D9: 3, E9: 2,
  A10: "ORD-1009", B10: "Abuja", C10: 55000, D10: 21, E10: 1,
  A11: "ORD-1010", B11: "Lagos", C11: 49000, D11: 3, E11: 4,
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l21-meeting-a-dataset",
    moduleId: "m2-exploratory",
    sectionId: SECTION_ID,
    order: 1,
    title: "Meeting a Dataset",
    subtitle: "The profile you run before you analyse anything",
    estimatedMinutes: 16,
    intro:
      "A spreadsheet arrives. Nobody tells you it has a duplicate, a missing rating and one order a hundred times bigger than the rest. Your job is to find all three before you build anything on top of them. This lesson is the checklist professionals run by reflex, and it takes about two minutes.",

    atoms: [
      {
        id: "a-what-eda-is",
        title: "What exploratory analysis actually is",
        explain:
          "Exploratory Data Analysis is the deliberate half-hour you spend understanding a dataset before you answer any question with it. You are not looking for the answer yet. You are looking for the reasons your answer might be wrong.",
        why: "Every analyst who has been burned has been burned the same way: they built a confident number on data they had not looked at. The chart was beautiful, the average was wrong, and the meeting went badly. EDA is cheap insurance. Thirty minutes of profiling has saved more careers than any chart type.",
        analogy:
          "It is the walk around a car before you buy it. You are not driving anywhere yet. You are checking the tyres, because finding a problem now is free and finding it on the motorway is not.",
        mistake:
          "Opening a file and immediately building a pivot table. The pivot will work. It will also faithfully summarise whatever is broken underneath it, and it will look just as convincing either way.",
      },
      {
        id: "a-profile-checklist",
        title: "The five-question profile",
        explain:
          "Run these five questions against every dataset you receive, in this order: How many rows? How many are actually filled? What TYPE is each column? What is the range of each number column? And what is obviously impossible?",
        why: "Having a fixed order matters more than the specific questions. An unstructured poke around a dataset finds whatever happens to catch your eye. A checklist finds the thing you were not looking for, which is always the one that costs money.",
        table: {
          caption: "The profile, and the tool for each question.",
          headers: ["Question", "Tool", "What a bad answer looks like"],
          rows: [
            ["How many rows?", "COUNTA on a column that is never blank", "Fewer rows than the source system reported"],
            ["How complete?", "COUNT, COUNTA, COUNTBLANK", "A column that is 30% empty"],
            ["What type?", "ISNUMBER, ISTEXT", "Numbers that are secretly text"],
            ["What range?", "MIN, MAX", "A negative age, a zero price"],
            ["What is impossible?", "Your own judgement", "A delivery that took 21 days"],
          ],
          note: "Nothing here needs a pivot table, a chart, or more than two minutes.",
        },
      },
      {
        id: "a-profiling-completeness",
        title: "Measuring completeness",
        explain:
          "COUNTA tells you how many cells are filled, COUNT how many hold numbers, and COUNTBLANK how many are empty. Run all three on the same column and the gaps between them describe the column exactly.",
        syntax: {
          pattern:
            "=COUNTA(value1, [value2], ...)\n=COUNT(value1, [value2], ...)\n=COUNTBLANK(range)",
          args: [
            ["value1 / range", "The column you are profiling, such as E2:E11."],
            ["[value2], ...", "Further ranges. COUNTBLANK takes only one range, which is a common trip-up.", "optional"],
          ],
          returns: "A count of cells. Never an error, which is exactly why you must read the number critically.",
          note: "COUNTA minus COUNT is your count of non-numeric entries in a column that should be numeric. That single subtraction finds 'numbers stored as text' faster than any other method.",
        },
        table: {
          caption: "Profiling the Rating column, E2:E11.",
          headers: ["Formula", "Result", "What it tells you"],
          rows: [
            ["=COUNTA(E2:E11)", "9", "Nine orders carry a rating"],
            ["=COUNT(E2:E11)", "9", "All nine are genuine numbers"],
            ["=COUNTBLANK(E2:E11)", "1", "One order was never rated"],
          ],
          note: "COUNTA equals COUNT, so nothing in this column is text pretending to be a number. The single blank is a real gap, not a formatting problem.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 1,
          mustUseFormula: true,
          mustUse: "COUNTBLANK",
          task: "In C13, count how many orders have no rating at all. The ratings are in E2 to E11.",
          hint: "COUNTBLANK takes a single range and nothing else.",
          successMessage:
            "One missing rating. Now you know any average rating you quote is based on nine orders, not ten — and you can say so out loud before someone asks.",
        },
      },
      {
        id: "a-profiling-range",
        title: "MIN and MAX as a data quality check",
        explain:
          "Running MIN and MAX over every numeric column is a thirty-second sanity check. You are not looking for the best and worst result. You are looking for values that should be impossible.",
        syntax: {
          pattern: "=MIN(number1, [number2], ...)\n=MAX(number1, [number2], ...)",
          args: [
            ["number1", "The column to scan, such as C2:C11."],
            ["[number2], ...", "Further ranges, if the column is split across areas.", "optional"],
          ],
          returns: "The smallest or largest number found. Text and blanks are ignored.",
          note: "If MIN and MAX return 0 on a column you know has data, the column is text, not numbers. That is a finding, not a failure.",
        },
        table: {
          caption: "MIN and MAX across the three numeric columns.",
          headers: ["Column", "MIN", "MAX", "Verdict"],
          rows: [
            ["Amount (C)", "0", "980,000", "Both ends need an explanation"],
            ["Days (D)", "2", "21", "21 days is not a normal delivery"],
            ["Rating (E)", "1", "5", "Plausible — ratings run 1 to 5"],
          ],
          note: "Two of the three columns failed the check in under a minute. That is the whole return on this habit.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 980000,
          mustUseFormula: true,
          mustUse: "MAX",
          task: "In C13, find the largest order amount in C2 to C11. Then ask yourself whether it looks like the others.",
          hint: "MAX takes the range and nothing else.",
          successMessage:
            "980,000 against a typical 45,000. That is not a big order, it is a question: a genuine bulk sale, or an extra zero someone typed. Lesson 23 gives you a rule for deciding.",
        },
      },
      {
        id: "a-row-count-truth",
        title: "Counting rows honestly",
        explain:
          "Count rows on a column that can never legitimately be blank — an ID or an order number. Counting on a column with gaps under-reports your dataset, and you will not notice.",
        why: "This is how people quietly lose records. They profile on a column that is 8% empty, report 920 rows to a client, and the source system says 1,000. Now the whole analysis is under suspicion, including the parts that were right.",
        syntax: {
          pattern: "=COUNTA(range)",
          args: [["range", "A column guaranteed to be populated for every record, such as an order ID."]],
          returns: "The number of non-empty cells, which on an ID column is your true row count.",
          note: "Cross-check it against whatever the source system claims. A mismatch is the single most valuable thing you can find in the first five minutes.",
        },
        mistake:
          "Using the row number of the last filled cell as your row count. A single blank row in the middle, or a stray value pasted far below the data, and the number is wrong in either direction.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l22-descriptive-statistics",
    moduleId: "m2-exploratory",
    sectionId: SECTION_ID,
    order: 2,
    title: "The Middle and the Spread",
    subtitle: "AVERAGE, MEDIAN, MODE.SNGL, STDEV.S, STDEV.P",
    estimatedMinutes: 18,
    intro:
      "Two numbers describe most datasets: where the middle is, and how far things sit from it. Choosing the wrong measure of the middle is the most common way an honest analyst produces a misleading report — and in this dataset it is the difference between 48,000 and 137,000.",

    atoms: [
      {
        id: "a-mean-vs-median",
        title: "AVERAGE and MEDIAN disagree, and that is the point",
        explain:
          "AVERAGE adds everything and divides by the count, so every value pulls on it. MEDIAN sorts the values and takes the middle one, so a single enormous value moves it barely at all.",
        why: "This is the most consequential choice in descriptive statistics. Report the mean order value of this dataset and you claim a typical customer spends 137,000. Report the median and you claim 48,000. One of those is a number you could defend to a room; the other is one outlier wearing a disguise.",
        syntax: {
          pattern: "=AVERAGE(number1, [number2], ...)\n=MEDIAN(number1, [number2], ...)",
          args: [
            ["number1", "The range to summarise, such as C2:C11."],
            ["[number2], ...", "Further numbers or ranges.", "optional"],
          ],
          returns: "AVERAGE returns the arithmetic mean. MEDIAN returns the middle value — or the mean of the two middle values when the count is even.",
          note: "Both ignore blanks. Neither ignores zeros: the 0 in C9 is counted as a real value by both, and it drags the mean down while barely touching the median.",
        },
        table: {
          caption: "The same ten amounts, two different middles.",
          headers: ["Measure", "Formula", "Result", "What it is telling you"],
          rows: [
            ["Mean", "=AVERAGE(C2:C11)", "137,000", "Distorted upward by ORD-1006"],
            ["Median", "=MEDIAN(C2:C11)", "48,000", "What a typical order really looks like"],
            ["Gap", "—", "89,000", "A gap this large always means outliers or skew"],
          ],
          note: "Rule of thumb: when the mean and the median are far apart, report the median and explain why. When they are close, either is fine.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 48000,
          mustUseFormula: true,
          mustUse: "MEDIAN",
          task: "In C13, find the median order amount from C2 to C11, so you have a middle that ORD-1006 cannot distort.",
          hint: "MEDIAN takes the range, exactly like AVERAGE does.",
          successMessage:
            "48,000 — against a mean of 137,000. If anyone ever asks you for 'the average order value', this dataset is why the correct reply is 'mean or median?'",
        },
      },
      {
        id: "a-mode",
        title: "MODE.SNGL, and when it earns its place",
        explain:
          "MODE.SNGL returns the value that appears most often. On continuous numbers like currency it is usually useless, because no two values repeat. On categories, sizes, ratings and prices it is often the most actionable number you have.",
        syntax: {
          pattern: "=MODE.SNGL(number1, [number2], ...)",
          args: [
            ["number1", "The range to search for the most frequent value."],
            ["[number2], ...", "Further ranges.", "optional"],
          ],
          returns: "The most frequently occurring number. If several tie, the one that appears first.",
          note: "If NOTHING repeats, MODE.SNGL returns #N/A. That error is a genuine finding: it means every value in the column is unique, which is what you would expect from an ID and not from a rating.",
        },
        table: {
          caption: "MODE across the columns.",
          headers: ["Column", "=MODE.SNGL(...)", "Useful?"],
          rows: [
            ["Amount (C)", "#N/A", "No — every amount is unique"],
            ["Days (D)", "3", "Yes — the typical delivery takes 3 days"],
            ["Rating (E)", "4", "Yes — most customers give 4"],
          ],
          note: "The #N/A on Amount is not a failure. It confirms the column is continuous, so mean and median are the right tools there.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 3,
          mustUseFormula: true,
          mustUse: "MODE",
          task: "In C13, find the most common number of delivery days in D2 to D11.",
          hint: "=MODE.SNGL(D2:D11). The older name MODE works too.",
          successMessage:
            "Three days is the norm. Now the 21-day delivery in ORD-1009 is not just a big number, it is seven times the typical experience — and that is a customer service problem, not a rounding issue.",
        },
      },
      {
        id: "a-spread-stdev",
        title: "Standard deviation: how spread out is it?",
        explain:
          "Standard deviation measures the typical distance between a value and the mean. A small one means the values huddle together; a large one means they are scattered. It is the number that tells you whether the average is describing anything real.",
        why: "Two teams both average 60% on a test. One team scored between 58 and 62; the other scored between 20 and 95. The mean is identical and the story is completely different. Without a measure of spread you cannot tell those two situations apart, and you will manage them the same way.",
        syntax: {
          pattern: "=STDEV.S(number1, [number2], ...)\n=STDEV.P(number1, [number2], ...)",
          args: [
            ["number1", "The range to measure, such as C2:C11."],
            ["[number2], ...", "Further numbers or ranges.", "optional"],
          ],
          returns: "A number in the SAME UNITS as your data. A standard deviation of 296,668 on naira amounts means naira, not a percentage.",
          note: "STDEV.S is for a SAMPLE — data representing a bigger group — and divides by n-1. STDEV.P is for the whole POPULATION and divides by n. If in doubt use STDEV.S: almost every dataset you meet is a sample of something larger.",
        },
        sheet: {
          data: {
            ...ORDERS,
            A13: "Mean", C13: "=AVERAGE(C2:C11)",
            A14: "Std dev (sample)", C14: "=STDEV.S(C2:C11)",
            A15: "Std dev without ORD-1006", C15: "=STDEV.S(C2:C6,C8:C11)",
          },
          rows: 16,
          cols: 5,
        },
        table: {
          caption: "What one outlier does to the spread.",
          headers: ["Measure", "With ORD-1006", "Without it"],
          rows: [
            ["Mean", "137,000", "43,333"],
            ["Standard deviation", "≈296,669", "≈18,343"],
          ],
          note: "Removing one row out of ten cuts the spread by a factor of sixteen. Any statistic that moves that much on a single row is a statistic you must caveat.",
        },
        mistake:
          "Quoting a standard deviation without saying which one you used. On small datasets STDEV.S and STDEV.P give visibly different answers, and a reviewer who recomputes with the other one will think you made an error.",
      },
      {
        id: "a-choosing-a-summary",
        title: "Choosing which summary to report",
        explain:
          "Mean for symmetric data with no outliers. Median for skewed data or anything involving money and property prices. Mode for categories and repeated values. Always pair your middle with a spread.",
        why: "Analysts are rarely caught lying. They are frequently caught choosing the flattering statistic. Deciding the rule BEFORE you see which number is bigger is what makes you trustworthy, and it is a habit that survives your first uncomfortable meeting.",
        table: {
          caption: "A decision rule you can apply without thinking.",
          headers: ["If the data is...", "Report", "Because"],
          rows: [
            ["Symmetric, no outliers", "Mean + standard deviation", "The mean genuinely sits in the middle"],
            ["Skewed, or has outliers", "Median + quartile range", "The mean has been dragged away from typical"],
            ["Categories or ratings", "Mode + a frequency count", "An average rating of 3.4 describes nobody"],
            ["You are not sure", "Both, and say why", "Showing both is honest, not indecisive"],
          ],
        },
        mistake:
          "Reporting a mean and a median and letting the reader choose. Your job is to pick one, say which, and give the reason in a sentence. The other number belongs in an appendix.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l23-outliers",
    moduleId: "m2-exploratory",
    sectionId: SECTION_ID,
    order: 3,
    title: "Outliers and How to Prove One",
    subtitle: "LARGE, SMALL, QUARTILE.INC and the 1.5 × IQR rule",
    estimatedMinutes: 18,
    intro:
      "Everyone can point at 980,000 and say it looks wrong. An analyst has to say WHY it is wrong, using a rule they chose in advance and would have applied to any value. This lesson gives you that rule, and applies it to the two values in this dataset that fail it.",

    atoms: [
      {
        id: "a-large-small",
        title: "LARGE and SMALL: the top and bottom n",
        explain:
          "MAX gives you the biggest value. LARGE gives you the nth biggest, so LARGE(range,2) is the runner-up. SMALL does the same from the bottom. Together they let you inspect the edges of a distribution instead of guessing at them.",
        syntax: {
          pattern: "=LARGE(array, k)\n=SMALL(array, k)",
          args: [
            ["array", "The range to rank, such as C2:C11."],
            ["k", "Which position you want. 1 is the largest for LARGE and the smallest for SMALL. Both arguments are required."],
          ],
          returns: "The value sitting at position k.",
          note: "If k is less than 1, or larger than the count of numbers in the range, you get #NUM!. LARGE(range,1) is exactly MAX(range), and SMALL(range,1) is exactly MIN(range).",
        },
        table: {
          caption: "The top three amounts, and the gap that gives the outlier away.",
          headers: ["Formula", "Result", "Gap to the next"],
          rows: [
            ["=LARGE(C2:C11,1)", "980,000", "— "],
            ["=LARGE(C2:C11,2)", "62,000", "918,000"],
            ["=LARGE(C2:C11,3)", "55,000", "7,000"],
          ],
          note: "The gap between first and second is 918,000. The gap between second and third is 7,000. When one gap is a hundred times the next, you are not looking at a large value, you are looking at a different kind of thing.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 62000,
          mustUseFormula: true,
          mustUse: "LARGE",
          task: "In C13, find the SECOND largest order amount in C2 to C11 — the biggest order that is not ORD-1006.",
          hint: "LARGE needs two arguments: the range, then which position you want.",
          successMessage:
            "62,000. The largest genuine-looking order is fifteen times smaller than the largest recorded one. That gap is your evidence.",
        },
      },
      {
        id: "a-quartiles",
        title: "Quartiles: cutting the data into four",
        explain:
          "Sort the values and cut them into four equal groups. Q1 is the value a quarter of the way up, Q2 is the median, and Q3 is three quarters of the way up. The distance from Q1 to Q3 contains the middle half of your data.",
        syntax: {
          pattern: "=QUARTILE.INC(array, quart)",
          args: [
            ["array", "The range of numbers, such as C2:C11."],
            ["quart", "Which cut you want: 0 = minimum, 1 = Q1, 2 = median, 3 = Q3, 4 = maximum."],
          ],
          returns: "The value at that quarter point, interpolating between two values where the cut falls between them.",
          note: "QUARTILE.INC includes the median when splitting, which is Excel's default and matches the older QUARTILE function. QUARTILE.EXC excludes it and will give slightly different numbers — pick one and stay with it across a report.",
        },
        table: {
          caption: "The five-number summary of the Amount column.",
          headers: ["Cut", "Formula", "Value"],
          rows: [
            ["Minimum", "=QUARTILE.INC(C2:C11,0)", "0"],
            ["Q1", "=QUARTILE.INC(C2:C11,1)", "43,500"],
            ["Median", "=QUARTILE.INC(C2:C11,2)", "48,000"],
            ["Q3", "=QUARTILE.INC(C2:C11,3)", "54,000"],
            ["Maximum", "=QUARTILE.INC(C2:C11,4)", "980,000"],
          ],
          note: "The middle half of all orders sits between 43,500 and 54,000. Against that, both 0 and 980,000 look like visitors from another dataset.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 54000,
          mustUseFormula: true,
          mustUse: "QUARTILE",
          task: "In C13, find Q3 of the order amounts in C2 to C11 — the value three quarters of the way up the sorted list.",
          hint: "The second argument selects the cut. Q3 is cut number 3.",
          successMessage:
            "54,000. Three quarters of all orders are at or below this. You now have the number the outlier rule is built on.",
        },
      },
      {
        id: "a-iqr-rule",
        title: "The 1.5 × IQR rule",
        explain:
          "The interquartile range is Q3 minus Q1 — the width of the middle half. Anything above Q3 + 1.5 × IQR, or below Q1 − 1.5 × IQR, is conventionally an outlier. It is a convention, not a law of nature, but it is one you can state and defend.",
        why: "This converts 'that looks wrong to me' into 'that sits outside the fence, and here is the fence'. When a client challenges your decision to exclude a row — and they will, especially when the row is their biggest sale — you need a rule you applied before you saw the answer.",
        syntax: {
          pattern:
            "IQR         = QUARTILE.INC(range,3) - QUARTILE.INC(range,1)\nUpper fence = QUARTILE.INC(range,3) + 1.5 * IQR\nLower fence = QUARTILE.INC(range,1) - 1.5 * IQR",
          args: [
            ["range", "The numeric column being tested."],
            ["1.5", "The conventional multiplier. Use 3 instead of 1.5 to flag only extreme outliers.", "optional"],
          ],
          returns: "Two boundary values. Anything outside them is flagged for investigation — not automatically deleted.",
          note: "Write the fences into cells and reference them. A fence buried inside a formula cannot be checked by anyone, including you in three weeks.",
        },
        table: {
          caption: "Applying the rule to the Amount column.",
          headers: ["Step", "Working", "Value"],
          rows: [
            ["Q1", "=QUARTILE.INC(C2:C11,1)", "43,500"],
            ["Q3", "=QUARTILE.INC(C2:C11,3)", "54,000"],
            ["IQR", "Q3 − Q1", "10,500"],
            ["Upper fence", "54,000 + 1.5 × 10,500", "69,750"],
            ["Lower fence", "43,500 − 1.5 × 10,500", "27,750"],
          ],
          note: "980,000 is above the upper fence and 0 is below the lower one. Both planted problems are caught by a rule chosen before either was examined. That is what makes the finding defensible.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 69750,
          mustUseFormula: true,
          mustUse: "QUARTILE",
          task: "In C13, calculate the upper fence for the Amount column: Q3 plus 1.5 times the interquartile range of C2 to C11.",
          hint: "You need QUARTILE.INC twice — once for cut 3 and once for cut 1. The IQR is the difference between them.",
          successMessage:
            "69,750. Any order above this is flagged for investigation, and exactly one is. You did not decide that 980,000 was wrong; the rule did.",
        },
      },
      {
        id: "a-what-to-do-with-outliers",
        title: "Flag, investigate, then decide — in that order",
        explain:
          "An outlier is a question, not a mistake. Investigate it: a genuine bulk order stays in and gets mentioned, a typo gets corrected, an unexplainable value gets excluded and documented. Deleting first is how real revenue disappears from a report.",
        why: "The 980,000 order might be a distributor buying stock for a whole region. Delete it and you have understated the year. It might equally be 98,000 with a fat-fingered zero. The formula cannot tell you which, and neither can your instinct. Someone in the business can, and asking them takes five minutes.",
        table: {
          caption: "What to do once a value is flagged.",
          headers: ["What you find", "Action", "What you write down"],
          rows: [
            ["A real, explainable event", "Keep it", "Note it beside the headline figure"],
            ["A clear data entry error", "Correct it", "Record the original value and the fix"],
            ["Cannot be explained by anyone", "Exclude it", "State the rule and the row you removed"],
            ["Nobody has time to check", "Keep it, caveat it", "Never silently drop it"],
          ],
          note: "Every one of those four rows ends in writing something down. An undocumented exclusion is indistinguishable from a mistake.",
        },
        mistake:
          "Deleting outliers because they make the chart look untidy. The row you delete is frequently the most interesting thing in the dataset — the fraud, the bulk buyer, the broken sensor.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l24-missing-values",
    moduleId: "m2-exploratory",
    sectionId: SECTION_ID,
    order: 4,
    title: "Missing Values",
    subtitle: "Blank, zero and 'N/A' are three different things",
    estimatedMinutes: 15,
    intro:
      "A blank cell means 'we do not know'. A zero means 'we know, and it is none'. Treating one as the other is quiet, plausible and wrong, and this dataset contains an example of each.",

    atoms: [
      {
        id: "a-blank-vs-zero",
        title: "Blank is not zero",
        explain:
          "An empty cell is an absence of information. A zero is a measurement. AVERAGE skips blanks entirely but includes zeros, so the two produce different answers from the same column.",
        why: "ORD-1005 has no rating and ORD-1008 has an amount of zero. If somebody 'tidies' the sheet by filling blanks with zeros, the average rating drops from 3.56 to 3.2 and nothing on screen indicates anything changed. That is the most dangerous class of error there is: invisible, plausible and confident.",
        table: {
          caption: "The same ten ratings, treated two ways.",
          headers: ["Treatment", "Formula", "Result"],
          rows: [
            ["Blank left alone", "=AVERAGE(E2:E11)", "3.56 — the mean of the 9 real ratings"],
            ["Blank filled with 0", "=AVERAGE(E2:E11)", "3.20 — a customer who never rated now counts as 0"],
            ["Counted honestly", "=COUNT(E2:E11)", "9 — say this out loud when you report the mean"],
          ],
          note: "Nothing about the second row looks wrong on screen. That is precisely why the rule has to be a habit rather than a judgement call.",
        },
        mistake:
          "Using Find and Replace to turn blanks into zeros so the sheet 'looks complete'. You have not filled a gap, you have fabricated nine measurements and hidden one.",
      },
      {
        id: "a-counting-missing",
        title: "Quantifying what is missing",
        explain:
          "Before deciding what to do about missing data, measure it. A column that is 2% empty and a column that is 40% empty are completely different problems and deserve different answers.",
        syntax: {
          pattern: "=COUNTBLANK(range)\n=COUNTBLANK(range)/ROWS(range)",
          args: [
            ["range", "One contiguous range. COUNTBLANK accepts a single range only — pass it two and you get #VALUE!."],
          ],
          returns: "The number of empty cells. Divide by the row count and format as a percentage for the completeness rate.",
          note: "A cell containing \"\" — an empty text string, common in system exports — is counted as blank by COUNTBLANK but as filled by COUNTA. When those two disagree, you have invisible junk in the column.",
        },
        table: {
          caption: "A completeness rule of thumb.",
          headers: ["Missing", "Usual response"],
          rows: [
            ["Under 5%", "Exclude those rows from that measure, and say so"],
            ["5% to 20%", "Investigate the pattern before deciding"],
            ["Over 20%", "Ask whether the column is usable at all"],
            ["Missing in a pattern", "Stop. This is a finding, not a gap"],
          ],
          note: "The last row matters most. If every missing rating comes from one state, the gap is telling you something about that state's process.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 9,
          mustUseFormula: true,
          mustUse: "COUNT",
          task: "In C13, count how many orders actually carry a numeric rating in E2 to E11, so you know what any average rating is really based on.",
          hint: "COUNT counts numbers only, and the missing rating is not a number.",
          successMessage:
            "Nine, not ten. Quote your average rating as 'based on 9 of 10 orders' and you have pre-empted the only question that matters.",
        },
      },
      {
        id: "a-iferror-missing",
        title: "IFERROR, and when hiding an error is wrong",
        explain:
          "IFERROR replaces an error with whatever you choose. It is the right tool when you know exactly why the error happens and the replacement is genuinely correct — and the wrong tool when you simply want the red text gone.",
        syntax: {
          pattern: "=IFERROR(value, value_if_error)",
          args: [
            ["value", "The formula that might fail, such as C2/D2."],
            ["value_if_error", "What to show instead. Use \"\" for a clean blank, 0 only when zero is genuinely the right answer, or a message like \"No orders\"."],
          ],
          returns: "The formula's own result when it works, and your replacement when it does not.",
          note: "IFERROR catches EVERY error type, including #REF! and #NAME? from a broken formula. That is why wrapping a formula in it while you are still building is how a genuine mistake gets hidden from you.",
        },
        table: {
          caption: "The same wrapper, used well and used badly.",
          headers: ["Formula", "Verdict"],
          rows: [
            ['=IFERROR(C2/D2,"")', "Fine — a blank where the division is impossible"],
            ['=IFERROR(C2/D2,0)', "Dangerous — 0 will be averaged as a real value"],
            ['=IFERROR(VLOOKUP(...),"Not found")', "Good — states what happened"],
            ['=IFERROR(<whole model>,0)', "Never. You have silenced every error at once"],
          ],
          note: "Replacing an error with 0 turns a visible problem into an invisible one that then contaminates every average downstream.",
        },
        mistake:
          "Wrapping a formula in IFERROR before you have found out what the error was. The error was information; you paid for it with a broken formula and then threw it away.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l25-framing-questions",
    moduleId: "m2-exploratory",
    sectionId: SECTION_ID,
    order: 5,
    title: "From Vague Request to Answerable Question",
    subtitle: "SUMIFS, COUNTIFS and segment comparison",
    estimatedMinutes: 16,
    intro:
      "'How are we doing?' cannot be answered. 'Which state has the highest median order value, and is the difference big enough to act on?' can. Turning the first into the second is the skill that separates an analyst from a spreadsheet operator.",

    atoms: [
      {
        id: "a-making-a-question-measurable",
        title: "Making a question measurable",
        explain:
          "A measurable question names the metric, the grouping and the comparison. 'Total sales' names a metric. 'Total sales by state, this quarter versus last' names a metric, a grouping and a comparison — and can only be answered one way.",
        why: "Most analysis that gets rejected was never wrong. It answered a different question from the one the requester had in their head, and neither side noticed until the meeting. Writing the question down and getting it agreed takes two minutes and saves two days.",
        table: {
          caption: "Rewriting four real requests.",
          headers: ["What you were asked", "What to build"],
          rows: [
            ["How are sales doing?", "Total and median order value by month, last 6 months"],
            ["Which state is best?", "Median order value by state, with the order count beside it"],
            ["Are customers happy?", "Mean rating by state, excluding unrated orders, n shown"],
            ["Is delivery a problem?", "Share of orders delivered in more than 5 days, by state"],
          ],
          note: "Every rewrite names a metric AND a grouping, and three of the four carry the sample size. A percentage without an n is not an answer.",
        },
        mistake:
          "Starting to build before the question is written down. You will produce something defensible and irrelevant, and you will have to do it again.",
      },
      {
        id: "a-sumifs",
        title: "SUMIFS: totals for a segment",
        explain:
          "SUMIFS adds up the rows that meet every condition you give it. It is how you answer 'total sales in Lagos' without sorting, filtering or touching the original data.",
        syntax: {
          pattern:
            "=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
          args: [
            ["sum_range", "The numbers to add. This comes FIRST — the opposite of SUMIF, where it comes last."],
            ["criteria_range1", "The first column to test, such as B2:B11 for state."],
            ["criteria1", "The condition, such as \"Lagos\" or \">50000\". Text and operators need double quotes."],
            ["[criteria_range2, criteria2], ...", "Further pairs. Every pair narrows the result further.", "optional"],
          ],
          returns: "The total of rows meeting EVERY condition. Conditions are combined with AND, never OR.",
          note: "All ranges must be the same height or Excel returns #VALUE!. If no row qualifies you get 0, not an error — so a surprising 0 means 'nothing matched', which is usually a criteria typo.",
        },
        table: {
          caption: "Total order value by state.",
          headers: ["State", "Formula", "Total", "Orders"],
          rows: [
            ["Lagos", '=SUMIFS(C2:C11,B2:B11,"Lagos")', "179,000", "5"],
            ["Abuja", '=SUMIFS(C2:C11,B2:B11,"Abuja")', "1,097,000", "3"],
            ["Kano", '=SUMIFS(C2:C11,B2:B11,"Kano")', "94,000", "2"],
          ],
          note: "Abuja appears to be six times Lagos. It is not: 980,000 of that total is the single outlier from lesson 23. This is exactly why profiling comes before segmentation.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 179000,
          mustUseFormula: true,
          mustUse: "SUMIFS",
          task: "In C13, total the order amounts for Lagos only. States are in B2 to B11 and amounts in C2 to C11.",
          hint: "The range you want to ADD comes first, then the range you TEST, then the condition in double quotes.",
          successMessage:
            "179,000 across five Lagos orders. Compare that with Abuja's 1,097,000 from three orders and you can already see the outlier distorting the comparison.",
        },
      },
      {
        id: "a-countifs-segments",
        title: "COUNTIFS: how many, and the n behind every percentage",
        explain:
          "COUNTIFS counts rows meeting every condition. Its most important job is supplying the denominator — the n that turns a raw total into a rate you can compare between groups of different sizes.",
        syntax: {
          pattern:
            "=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
          args: [
            ["criteria_range1", "The first column to test."],
            ["criteria1", "The condition it must meet."],
            ["[criteria_range2, criteria2], ...", "Further range-and-condition pairs, always supplied in pairs.", "optional"],
          ],
          returns: "The count of rows satisfying every condition.",
          note: "Unlike SUMIFS there is no separate range to total, so COUNTIFS takes ONLY pairs. An odd number of arguments is always a mistake.",
        },
        table: {
          caption: "Why a total without a count misleads.",
          headers: ["State", "Total", "Orders", "Total ÷ orders"],
          rows: [
            ["Lagos", "179,000", "5", "35,800"],
            ["Abuja", "1,097,000", "3", "365,667"],
            ["Kano", "94,000", "2", "47,000"],
          ],
          note: "Abuja's average is inflated by one order. Kano has the highest typical order value of the three, and looking only at totals would have hidden that completely.",
        },
        exercise: {
          data: ORDERS,
          rows: 13,
          cols: 5,
          target: "C13",
          expected: 3,
          mustUseFormula: true,
          mustUse: "COUNTIFS",
          task: "In C13, count the Lagos orders worth more than 40,000. States are in B2 to B11, amounts in C2 to C11.",
          hint: "Two pairs: the state range with \"Lagos\", then the amount range with \">40000\". The operator goes inside the quotes.",
          successMessage:
            "Three of the five Lagos orders clear 40,000. That is a rate you can compare against other states — which a raw total never lets you do.",
        },
      },
      {
        id: "a-segment-with-fill",
        title: "Building the whole summary in one pass",
        explain:
          "Write the formula once against the first state, lock the data ranges with dollar signs, then drag the fill handle down. One formula, three answers, and only one thing to check.",
        why: "This is where locking stops being an abstract rule. The state label must move as you fill, so it stays relative. The data ranges must not move, so they get locked. Get either one wrong and the second row is silently wrong rather than visibly broken.",
        syntax: {
          pattern: '=SUMIFS($C$2:$C$11, $B$2:$B$11, A16)',
          args: [
            ["$C$2:$C$11", "The amounts, fully locked. Every row of the summary totals the SAME data."],
            ["$B$2:$B$11", "The states, fully locked for the same reason."],
            ["A16", "The state label for THIS row, left relative so it becomes A17, A18 as you fill down."],
          ],
          returns: "One total per summary row, all from a single formula you wrote once.",
          note: "The rule: lock what stays the same, leave relative what should change. Press F4 on a reference to cycle the dollar signs.",
        },
        exercise: {
          data: {
            ...ORDERS,
            A14: "State", B14: "Total",
            A15: "Lagos",
            A16: "Abuja",
            A17: "Kano",
          },
          rows: 18,
          cols: 5,
          allowFill: true,
          target: "B15",
          expected: 179000,
          mustUseFormula: true,
          mustUse: "SUMIFS",
          task: "In B15, total the orders for the state named in A15. Lock the two data ranges, then drag B15's fill handle down to B17 to complete the summary for all three states.",
          hint: "=SUMIFS($C$2:$C$11,$B$2:$B$11,A15) — the ranges locked, the state reference left free to move.",
          successMessage:
            "Lagos 179,000, Abuja 1,097,000, Kano 94,000 — from one formula dragged twice. Click B17 and read the formula bar: the ranges held still and only A15 became A17.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
