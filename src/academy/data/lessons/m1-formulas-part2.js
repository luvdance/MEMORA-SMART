/**
 * MODULE · FORMULAS & CORE FUNCTIONS, part two (m1-formulas-functions)
 * Section — "Counting, Averaging and Ranking"
 *
 * Continues m1-formulas-functions.js. Split across two files only because one
 * file of fifteen lessons is unpleasant to edit; the registry stitches them
 * back together in curriculum order.
 *
 * ONE EXCEPTION: l13, percentages and data types, carries
 * moduleId "m1-excel-essentials", because the curriculum lists "Number, date
 * and text formats" under Excel Essentials rather than under formulas.
 *
 * Covers the statistical family an analyst reaches for daily, then number
 * formats, then the speed habits (fill down, auto-numbering) that separate
 * someone who can use Excel from someone who is fast in it.
 *
 * Every function is taught the same way: what it does, WHY an analyst needs
 * it, and a real scenario where getting it wrong costs something.
 *
 * The running dataset is a sales team, reused across the whole module so the
 * learner is never re-reading a new table.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s4-counting-formats";

/**
 * Six reps, four regions, one deliberately missing rating and one zero.
 * The gaps are the point: they are what make COUNT, COUNTA, COUNTBLANK and
 * AVERAGE behave differently from each other.
 */
const TEAM = {
  A1: "Rep", B1: "Region", C1: "Sales", D1: "Rating", E1: "Target",
  A2: "Ada", B2: "Lagos", C2: 820000, D2: 4, E2: 750000,
  A3: "Musa", B3: "Abuja", C3: 640000, D3: 5, E3: 700000,
  A4: "Ngozi", B4: "Lagos", C4: 820000, D4: 3, E4: 800000,
  A5: "Bola", B5: "Kano", C5: 310000, D5: "", E5: 500000,
  A6: "Chuka", B6: "Lagos", C6: 455000, D6: 4, E6: 500000,
  A7: "Tunde", B7: "Abuja", C7: 0, D7: 2, E7: 400000,
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l11-counting-family",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 3,
    title: "Counting Things Properly",
    subtitle: "COUNT, COUNTA, COUNTBLANK, COUNTIF, COUNTIFS",
    estimatedMinutes: 14,
    intro:
      "Five functions that all look like counting and all count something different. Choosing the wrong one does not produce an error, it produces a plausible number that is quietly wrong, which is far worse. You will use the same sales team sheet throughout.",

    atoms: [
      {
        id: "a-count-vs-counta-vs-blank",
        title: "COUNT, COUNTA and COUNTBLANK",
        explain:
          "COUNT counts cells holding numbers. COUNTA counts cells holding anything at all. COUNTBLANK counts the empty ones.",
        why: "In data analysis this trio is how you measure data quality before you trust a dataset. If you have 500 customer records but COUNTBLANK says 120 phone numbers are missing, you know your contact campaign will reach 380 people, not 500. Skipping that check is how people present confident numbers built on a quarter of a dataset.",
        table: {
          caption: "The Rating column: six reps, one has not been rated.",
          headers: ["Formula", "Counts", "Result", "Why"],
          rows: [
            ["=COUNT(D2:D7)", "Numbers only", "5", "Bola has no rating"],
            ["=COUNTA(D2:D7)", "Anything filled", "5", "The blank is still blank"],
            ["=COUNTBLANK(D2:D7)", "Empty cells", "1", "Bola"],
            ["=COUNT(A2:A7)", "Numbers in a name column", "0", "Names are text"],
          ],
        },
        mistake:
          "Using COUNT on a column of names or IDs and reporting 0 customers. COUNT ignores text entirely, so it returns zero rather than complaining.",
        exercise: {
          data: { ...TEAM, A9: "Reps missing a rating" },
          rows: 10,
          cols: 5,
          target: "B9",
          expected: 1,
          mustUseFormula: true,
          mustUse: "COUNTBLANK",
          task: "Before reporting an average rating you need to know how complete the data is. In B9, count how many reps have no rating recorded.",
          hint: "The ratings are in D2 to D7.",
          successMessage:
            "One missing out of six. Now you know any average rating is based on five people, not six.",
        },
      },
      {
        id: "a-countif",
        title: "COUNTIF",
        explain:
          "COUNTIF counts only the cells that meet one condition. =COUNTIF(B2:B7,\"Lagos\") counts the Lagos reps. =COUNTIF(C2:C7,\">500000\") counts reps above half a million in sales.",
        why: "This is how you answer \"how many of them\" without filtering and manually counting rows. Every segment figure in a report, every conversion count, every how-many-customers-did-X, is a COUNTIF underneath.",
        table: {
          caption: "Criteria are written as text, including the operator.",
          headers: ["You write", "Means", "On this sheet"],
          rows: [
            ['"Lagos"', "Exactly equal to Lagos", "3"],
            ['">500000"', "Greater than 500,000", "3"],
            ['">="&E2', "At least whatever E2 holds", "Compares to a cell"],
            ['"<>Lagos"', "Anything except Lagos", "3"],
          ],
        },
        mistake:
          "Forgetting the quote marks around a comparison. The operator and the number both go inside them: \">500000\", not >500000.",
        exercise: {
          data: { ...TEAM, A9: "Reps in Lagos" },
          rows: 10,
          cols: 5,
          target: "B9",
          expected: 3,
          mustUseFormula: true,
          mustUse: "COUNTIF",
          task: "The regional manager wants a headcount for Lagos. In B9, count how many reps are based there.",
          hint: 'The regions are in B2 to B7. The criterion is the text "Lagos".',
          successMessage: "Three. Change one region in the sheet and watch the count update.",
        },
      },
      {
        id: "a-countifs",
        title: "COUNTIFS, when one condition is not enough",
        explain:
          "COUNTIFS takes several range and criteria pairs and counts only the rows that satisfy every one of them. =COUNTIFS(B2:B7,\"Lagos\",C2:C7,\">500000\") counts Lagos reps who also sold over half a million.",
        why: "Real business questions are almost never single-condition. \"How many Lagos customers bought twice last quarter?\" is a COUNTIFS. Answering it with two separate COUNTIFs and subtracting is where people introduce errors they cannot find later.",
        example:
          "=COUNTIFS(B2:B7,\"Lagos\",C2:C7,\">500000\")\n\nLagos reps:            Ada, Ngozi, Chuka\nOf those, above 500k:  Ada, Ngozi\nAnswer: 2",
        mistake:
          "Giving the ranges different sizes. Every range in a COUNTIFS must cover the same rows, or Excel cannot line them up and returns #VALUE!.",
        exercise: {
          data: { ...TEAM, A9: "Lagos reps above 500k" },
          rows: 10,
          cols: 5,
          target: "B9",
          expected: 2,
          mustUseFormula: true,
          mustUse: "COUNTIFS",
          task: "In B9, count the reps who are BOTH based in Lagos AND sold more than 500,000.",
          hint: 'Two pairs: the region range with "Lagos", then the sales range with ">500000".',
          successMessage:
            "Two. Ada and Ngozi. Chuka is in Lagos but sold 455,000, so he does not qualify.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l12-averages-and-ranking",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 4,
    title: "Averages That Tell the Truth, and Ranking",
    subtitle: "AVERAGEA, AVERAGEIF, AVERAGEIFS, MAX, MIN, RANK.EQ, RANK.AVG",
    estimatedMinutes: 15,
    intro:
      "An average is the most quoted and most misused number in business. This lesson is about producing one that survives being questioned, then about ranking people and products fairly when there are ties.",

    atoms: [
      {
        id: "a-average-vs-averagea",
        title: "AVERAGE vs AVERAGEA",
        explain:
          "AVERAGE skips cells that are not numbers. AVERAGEA includes them and counts text as zero, so a stray word drags the result down.",
        why: "This is the difference between \"the average rating of reps we have rated\" and \"the average rating of all reps, treating unrated as zero\". Both are defensible; quoting one while meaning the other is not. When a number is challenged in a meeting, this is the kind of detail you need to be able to answer.",
        table: {
          caption: "Ratings 4, 5, 3, blank, 4, 2.",
          headers: ["Formula", "Treats the blank as", "Result"],
          rows: [
            ["=AVERAGE(D2:D7)", "Not there", "3.6"],
            ["=AVERAGEA(D2:D7)", "Not there (truly empty)", "3.6"],
            ["If the cell held \"n/a\"", "AVERAGE skips, AVERAGEA counts it as 0", "3.6 vs 3.0"],
          ],
          note: "A truly empty cell is skipped by both. A cell holding TEXT is where they diverge.",
        },
        mistake:
          "Averaging a column that contains \"n/a\" or \"-\" placeholders with AVERAGEA and reporting the result as a performance figure. Those placeholders become zeros.",
      },
      {
        id: "a-averageif",
        title: "AVERAGEIF",
        explain:
          "Averages only the rows meeting a condition. =AVERAGEIF(B2:B7,\"Lagos\",C2:C7) gives the average sales of Lagos reps only.",
        why: "Segment averages are how you find out whether a problem is everywhere or somewhere. A company-wide average of 507,500 hides that Lagos averages 698,333 while Abuja averages 320,000. The overall number tells you nothing actionable; the split tells you where to send help.",
        table: {
          caption: "The same team, split by region.",
          headers: ["Region", "Formula", "Average sales"],
          rows: [
            ["All", "=AVERAGE(C2:C7)", "507,500"],
            ["Lagos", '=AVERAGEIF(B2:B7,"Lagos",C2:C7)', "698,333"],
            ["Abuja", '=AVERAGEIF(B2:B7,"Abuja",C2:C7)', "320,000"],
          ],
          note: "The company average is true and useless. The split is what you act on.",
        },
        exercise: {
          data: { ...TEAM, A9: "Average sales in Lagos" },
          rows: 10,
          cols: 5,
          target: "B9",
          expected: 698333.3333333334,
          mustUseFormula: true,
          mustUse: "AVERAGEIF",
          task: "In B9, find the average sales figure for Lagos reps only.",
          hint: "Three arguments: the region range, the criterion, then the range to average.",
          successMessage:
            "698,333. Well above the company average of 507,500, which is the finding worth reporting.",
        },
      },
      {
        id: "a-averageifs",
        title: "AVERAGEIFS, and the argument order trap",
        explain:
          "AVERAGEIFS averages rows meeting several conditions. The catch: the range you want to average comes FIRST, whereas in AVERAGEIF it comes last.",
        why: "Two conditions is where segment analysis starts being genuinely useful. \"Average order value for Lagos customers who bought more than once\" is the kind of question a business actually pays for.",
        table: {
          caption: "The argument order flips between the two. This catches everyone.",
          headers: ["Function", "Order", "Example"],
          rows: [
            ["AVERAGEIF", "range, criterion, averageRange", '=AVERAGEIF(B2:B7,"Lagos",C2:C7)'],
            ["AVERAGEIFS", "averageRange FIRST, then pairs", '=AVERAGEIFS(C2:C7,B2:B7,"Lagos")'],
          ],
        },
        mistake:
          "Writing AVERAGEIFS with the same argument order as AVERAGEIF. It will either error or silently average the wrong column.",
        exercise: {
          data: { ...TEAM, A9: "Avg sales, Lagos, rating above 3" },
          rows: 10,
          cols: 5,
          target: "B9",
          expected: 637500,
          mustUseFormula: true,
          mustUse: "AVERAGEIFS",
          task: "In B9, find the average sales of reps who are in Lagos AND have a rating above 3.",
          hint: "Sales range first, then the region pair, then the rating pair with \">3\".",
          successMessage:
            "637,500. Ada and Chuka qualify. Ngozi is in Lagos but rated 3, so she is excluded.",
        },
      },
      {
        id: "a-max-min-in-practice",
        title: "MAX and MIN, and what they are really for",
        explain:
          "MAX returns the largest value in a range, MIN the smallest.",
        why: "Beyond finding the best and worst performer, MIN is how you spot data that should be impossible. A MIN of -50 in an age column or 0 in a price column tells you the dataset has a problem before you build anything on it. Running MAX and MIN over every numeric column is a thirty-second data quality check that professionals do by reflex.",
        example:
          "=MAX(C2:C7)  ->  820,000   the best month\n=MIN(C2:C7)  ->  0         Tunde sold nothing, which is worth asking about",
        mistake:
          "Seeing a MIN of 0 and moving on. Zero is either a real result worth investigating or a missing value someone typed as zero. Both need an answer.",
      },
      {
        id: "a-rank",
        title: "RANK.EQ and RANK.AVG",
        explain:
          "Both rank a value within a list. They differ only on ties. RANK.EQ gives tied values the same, higher rank and then skips: 1, 2, 2, 4. RANK.AVG gives them the average of the positions they occupy: 1, 2.5, 2.5, 4.",
        why: "Ranking is how leaderboards, commission tiers and performance bands are built. The tie rule matters the moment money depends on it: if two reps tie for second, RANK.EQ says both are second and nobody is third, while RANK.AVG says both are 2.5. Decide which one your bonus scheme means BEFORE you build the sheet.",
        table: {
          caption: "Ada and Ngozi both sold 820,000.",
          headers: ["Rep", "Sales", "RANK.EQ", "RANK.AVG"],
          rows: [
            ["Ada", "820,000", "1", "1.5"],
            ["Ngozi", "820,000", "1", "1.5"],
            ["Musa", "640,000", "3", "3"],
            ["Chuka", "455,000", "4", "4"],
          ],
          note: "RANK.EQ skips rank 2 entirely. RANK.AVG splits the difference between 1 and 2.",
        },
        exercise: {
          data: { ...TEAM, A9: "Musa's rank by sales" },
          rows: 10,
          cols: 5,
          target: "B9",
          expected: 3,
          mustUseFormula: true,
          mustUse: "RANK.EQ",
          task: "In B9, work out where Musa sits in the sales ranking, highest first. Use the tie rule that skips a position.",
          hint: "Three parts: the value in C3, the range C2 to C7, and you can leave the order out for highest-first.",
          successMessage:
            "Third. Two people tie for first, so second does not exist under RANK.EQ.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l13-percentages-and-formats",
    moduleId: "m1-excel-essentials",
    sectionId: SECTION_ID,
    order: 4,
    title: "Percentages and Data Types",
    subtitle: "What a cell holds vs how it looks",
    estimatedMinutes: 13,
    intro:
      "Percentages confuse people because Excel stores one thing and shows another. Get this straight once and formatting stops being guesswork.",

    atoms: [
      {
        id: "a-percentage-maths",
        title: "Working out a percentage",
        explain:
          "A percentage is just a division. Part divided by whole. Ada sold 820,000 against a target of 750,000, so =C2/E2 gives 1.093.",
        why: "Every performance figure, conversion rate, margin and growth number in business is this one division. The formula never changes; only what you call the part and the whole.",
        table: {
          caption: "The same division, three business questions.",
          headers: ["Question", "Part / Whole", "Formula"],
          rows: [
            ["Did the rep hit target?", "Sales / Target", "=C2/E2"],
            ["What share of total sales?", "Their sales / all sales", "=C2/SUM($C$2:$C$7)"],
            ["How much did we grow?", "(New - Old) / Old", "=(C2-E2)/E2"],
          ],
          note: "The third is the growth formula. It returns 0.093, which is 9.3% above target.",
        },
        mistake:
          "Multiplying by 100 in the formula AND formatting the cell as a percentage. You then see 10930% instead of 109%. Pick one: the format, not the maths.",
      },
      {
        id: "a-percent-format",
        title: "Making Excel show it as a percentage",
        explain:
          "Excel stores 1.093 and displays 109.3% when the cell is formatted as a percentage. The stored number never changes; only the display does.",
        why: "This is the single most confusing thing about Excel formatting. Once you know the cell holds a decimal and the percent format simply multiplies the DISPLAY by 100, everything else about formatting follows.",
        table: {
          caption: "One stored value, different displays.",
          headers: ["Cell holds", "Format", "Cell shows"],
          rows: [
            ["1.093", "General", "1.093"],
            ["1.093", "Percentage, 1 decimal", "109.3%"],
            ["25", "Percentage", "2500%"],
            ["0.25", "Percentage", "25%"],
          ],
          note: "Row three is the trap. Typing 25 into a percent cell means twenty-five WHOLE units, which is 2500%.",
        },
        exercise: {
          data: { ...TEAM, A9: "Ada: sales as % of target" },
          rows: 10,
          cols: 5,
          allowFill: true,
          target: "B9",
          expected: 1.0933333333,
          mustUseFormula: true,
          mustFormat: "percent",
          task: "In B9, divide Ada's sales by her target. Then, with B9 still selected, press Format as % above the grid so it displays as a percentage rather than a decimal.",
          hint: "Ada's sales are in C2 and her target in E2. Do the division only, no multiplying by 100.",
          successMessage:
            "109.3% of target. The cell still holds 1.0933; only the display changed.",
        },
      },
      {
        id: "a-data-types",
        title: "The data types you will meet",
        explain:
          "A cell has a value and a format. The format decides how the value is drawn on screen without altering what is stored.",
        why: "Choosing the right type is not decoration. A number stored as text will not sum. A date stored as text will not sort chronologically. Most \"Excel is broken\" moments are a value stored as the wrong type.",
        table: {
          caption: "The common types, and what goes wrong with each.",
          headers: ["Type", "Stores", "Shows", "Goes wrong when"],
          rows: [
            ["Number", "1200", "1200 or 1,200", "Typed with ₦ or a space, becoming text"],
            ["Currency", "1200", "₦1,200.00", "Mixing currencies in one column"],
            ["Percentage", "0.25", "25%", "Typing 25 and getting 2500%"],
            ["Date", "A day count", "03/06/2026", "Pasted as text, so it will not sort"],
            ["Time", "A fraction of a day", "14:30", "Adding past 24h without the right format"],
            ["Text", "Exactly what you typed", "As typed", "Holding numbers you meant to total"],
          ],
        },
        mistake:
          "Fixing a numbers-stored-as-text column by changing the format. Changing the format alone does not convert existing text, which is why the column still will not sum afterwards.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l14-working-fast",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 6,
    title: "Working Fast",
    subtitle: "Fill down, auto-numbering and the shortcuts that pay for themselves",
    estimatedMinutes: 11,
    intro:
      "Everything so far works. This lesson is about not doing it four hundred times by hand. These are the habits that make the difference between finishing an analysis in an hour and in a day.",

    atoms: [
      {
        id: "a-fill-down",
        title: "Copying a formula down a column",
        explain:
          "Write the formula once in the top row, then drag the small square at the bottom-right of the cell down the column. Excel copies it and shifts the references for each row automatically.",
        why: "You will never type a formula into four hundred rows. More importantly, one formula filled down is one thing to check. Four hundred typed formulas are four hundred chances for one of them to be subtly wrong, and you will not find it.",
        table: {
          caption: "Fill =B2*C2 from D2 down and the references move with it.",
          headers: ["Cell", "Formula becomes", "Because"],
          rows: [
            ["D2", "=B2*C2", "The original"],
            ["D3", "=B3*C3", "One row down, so both refs move one row"],
            ["D4", "=B4*C4", "Two rows down"],
          ],
          note: "This shifting is what relative references mean. It is the default and it is what you usually want.",
        },
        example:
          "Fill handle:  the small square at the bottom-right corner of the selected cell.\nDouble-click it and Excel fills down as far as the neighbouring column has data.\n\nKeyboard: select the range and press Ctrl + D.",
        exercise: {
          data: {
            A1: "Product", B1: "Price", C1: "Qty", D1: "Total",
            A2: "Rice", B2: 1200, C2: 500, D2: "=B2*C2",
            A3: "Garri", B3: 800, C3: 320,
            A4: "Milk", B4: 450, C4: 210,
            A5: "Biscuits", B5: 150, C5: 90,
            A7: "Total value",
          },
          rows: 8,
          cols: 4,
          allowFill: true,
          target: "D7",
          expected: 964000,
          mustUseFormula: true,
          mustUse: "SUM",
          task: "D2 already has its formula. Select D2, press Fill down above the grid to copy it to the rest of the column, then in D7 use SUM to total the whole column.",
          hint: "Select D2 first, then Fill down. Then total D2 to D5.",
          successMessage:
            "One formula written, three filled, one total. Click D4 and read the formula bar: Excel shifted it to =B4*C4 on its own.",
        },
      },
      {
        id: "a-absolute-when-filling",
        title: "When filling breaks, and the $ that fixes it",
        explain:
          "Sometimes a formula should keep pointing at ONE cell as you fill. Lock it with dollar signs: $C$9 never moves, however far you drag.",
        why: "This is the most common fill-down failure. You divide each rep's sales by the team total, fill down, and every row after the first shows a wrong number or an error, because the reference to the total slid down with it.",
        table: {
          caption: "Each rep's share of total sales, filled down from B2.",
          headers: ["Written as", "When filled to row 3", "Result"],
          rows: [
            ["=C2/C8", "=C3/C9", "Wrong. C9 is empty, so #DIV/0!"],
            ["=C2/$C$8", "=C3/$C$8", "Correct. The total stays put"],
          ],
        },
        mistake:
          "Filling down and seeing #DIV/0! or steadily shrinking numbers. That is almost always a reference that should have been locked with $.",
      },
      {
        id: "a-auto-numbering",
        title: "Numbering rows automatically",
        explain:
          "Type 1 in the first cell and 2 in the second, select both, then drag the fill handle. Excel recognises the pattern and continues it. A formula works too: =ROW()-1 in row 2 gives 1, and it renumbers itself if rows are inserted.",
        why: "Manually typed row numbers go wrong the first time anyone sorts, deletes or inserts a row, and then your numbering no longer matches your data. A formula-based number survives all three.",
        table: {
          caption: "Three ways to number, and how each survives a change.",
          headers: ["Method", "How", "Survives a sort?"],
          rows: [
            ["Typed by hand", "1, 2, 3 …", "No, and it goes wrong silently"],
            ["Fill pattern", "Type 1 and 2, then drag", "No, but quick to redo"],
            ["Formula", "=ROW()-1, filled down", "Yes, it renumbers itself"],
          ],
        },
      },
      {
        id: "a-shortcuts",
        title: "The shortcuts worth memorising",
        explain:
          "A small handful of key combinations cover most of the repetitive work.",
        why: "Each one saves a few seconds. Across a working day of cleaning data, they add up to the difference between finishing and not.",
        table: {
          caption: "Learn these five first.",
          headers: ["Keys", "Does", "Use it when"],
          rows: [
            ["Ctrl + D", "Fill down from the cell above", "Copying a formula down"],
            ["Ctrl + Shift + ↓", "Select to the bottom of the data", "Selecting a whole column of values"],
            ["Ctrl + ;", "Insert today's date as a fixed value", "Stamping when a row was checked"],
            ["F4", "Cycle through $ locking on a reference", "Turning C8 into $C$8 while typing"],
            ["Alt + =", "Insert a SUM of the range above", "Totalling a column instantly"],
          ],
        },
        practice: {
          prompt:
            "You have 400 rows and a formula in the first one. Describe two different ways to apply it to every row, and say which survives someone later inserting a row in the middle.",
          answer:
            "Double-click the fill handle, or select the column range and press Ctrl+D. Both copy the formula with shifting references. Neither auto-fills a row inserted later, so after an insert you fill again. A formula referencing a whole column or an Excel Table would extend automatically, which is why Tables are worth learning next.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l15-combined-practice",
    moduleId: "m1-formulas-functions",
    sectionId: SECTION_ID,
    order: 7,
    title: "Putting It Together",
    subtitle: "One dataset, one report, every function you have learned",
    estimatedMinutes: 16,
    intro:
      "A regional manager has asked for a summary of the sales team. Nothing new is introduced here. You will build the whole thing from what you already know, which is exactly how a real request arrives.",

    atoms: [
      {
        id: "a-brief",
        title: "The brief",
        explain:
          "Six reps, four regions, sales against target. The manager wants to know: how the team did overall, how complete the data is, how Lagos compares, and who is top.",
        why: "This is the shape of almost every analysis request you will receive: a vague question, a messy sheet and someone who wants one screen of answers rather than a spreadsheet.",
        table: {
          caption: "What the manager actually asked for, translated into functions.",
          headers: ["The question", "The function"],
          rows: [
            ["What did the team sell in total?", "SUM"],
            ["What is the average sale?", "AVERAGE"],
            ["Best and worst month?", "MAX and MIN"],
            ["How many reps do we have?", "COUNTA"],
            ["Is any data missing?", "COUNTBLANK"],
            ["How many beat 500,000?", "COUNTIF"],
            ["How many in Lagos beat it?", "COUNTIFS"],
            ["How does Lagos average compare?", "AVERAGEIF"],
            ["Where does each rep rank?", "RANK.EQ"],
            ["Did they hit target, as a percentage?", "Division plus percent format"],
          ],
        },
      },
      {
        id: "a-build-total",
        title: "Total and average",
        explain: "Start with the two figures every summary opens with.",
        why: "The total says how big the business is. The average says what a typical rep looks like. Together they frame everything that follows.",
        exercise: {
          data: { ...TEAM, A9: "Total team sales", A10: "Average sale" },
          rows: 11,
          cols: 5,
          allowFill: true,
          target: "B9",
          expected: 3045000,
          mustUseFormula: true,
          mustUse: "SUM",
          task: "In B9, total the sales for the whole team.",
          hint: "Sales are in C2 to C7.",
          successMessage: "₦3,045,000 across six reps.",
        },
      },
      {
        id: "a-build-quality",
        title: "Check the data before you trust it",
        explain:
          "Count the reps, then count what is missing. A summary built on incomplete data needs a caveat, and you cannot write the caveat if you never looked.",
        why: "Presenting an average without knowing that a sixth of the ratings are missing is how analysts lose credibility. Checking takes one formula.",
        exercise: {
          data: { ...TEAM, A9: "Reps on the team", A10: "Ratings missing" },
          rows: 11,
          cols: 5,
          target: "B9",
          expected: 6,
          mustUseFormula: true,
          mustUse: "COUNTA",
          task: "In B9, count how many reps are on the team. Their names are in column A, so pick the counting function that works on text.",
          hint: "COUNT would return 0 here, because names are not numbers.",
          successMessage:
            "Six. Now you could add =COUNTBLANK(D2:D7) below to see that one rating is missing.",
        },
      },
      {
        id: "a-build-segment",
        title: "The finding worth reporting",
        explain:
          "The overall average is 507,500. The interesting number is how far Lagos sits from it.",
        why: "A summary that only restates totals gets skimmed. A summary that says \"Lagos is running 38% above the company average, Abuja is 37% below\" gets acted on. The functions are the easy part; noticing which comparison matters is the job.",
        exercise: {
          data: { ...TEAM, A9: "Lagos reps above 500k", A10: "Lagos average" },
          rows: 11,
          cols: 5,
          target: "B9",
          expected: 2,
          mustUseFormula: true,
          mustUse: "COUNTIFS",
          task: "In B9, count the Lagos reps who also sold more than 500,000. This is the number the manager will ask about first.",
          hint: 'Region range with "Lagos", then sales range with ">500000".',
          successMessage:
            "Two of the three Lagos reps cleared half a million. That is your headline.",
        },
      },
      {
        id: "a-build-rank",
        title: "Rank the team",
        explain: "Finish with a ranking so the manager can see the order at a glance.",
        why: "Ranking turns a column of numbers into a list people can act on. It is also where the tie rule you learned earlier stops being academic: two of these reps are level.",
        exercise: {
          data: { ...TEAM, F1: "Rank", A9: "Chuka's rank" },
          rows: 10,
          cols: 6,
          allowFill: true,
          target: "B9",
          expected: 4,
          mustUseFormula: true,
          mustUse: "RANK.EQ",
          task: "In B9, find Chuka's rank by sales, highest first. Remember Ada and Ngozi are tied at the top.",
          hint: "Chuka's sales are in C6. Rank him against C2 to C7.",
          successMessage:
            "Fourth. Two tied at first, Musa third, Chuka fourth. Rank two does not exist, which is RANK.EQ behaving exactly as documented.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
