/**
 * ASSESSMENTS · COUNTING, AVERAGING, RANKING AND FORMATS
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l11-counting-family": {
    lessonId: "l11-counting-family",
    passMark: 70,
    questions: [
      {
        id: "q11-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-count-vs-counta-vs-blank",
        prompt:
          "A column holds 500 customer phone numbers, 120 of which are blank. Which formula tells you how many are missing?",
        options: [
          { id: "a", text: "=COUNT(range)" },
          { id: "b", text: "=COUNTBLANK(range)" },
          { id: "c", text: "=COUNTA(range)" },
          { id: "d", text: "=SUM(range)" },
        ],
        correct: "b",
        explanation:
          "COUNTBLANK counts empty cells. Knowing 120 are missing tells you a contact campaign reaches 380 people, not 500.",
        whyWrong: {
          a: "COUNT tells you how many hold numbers, which is the opposite end of the question.",
          c: "COUNTA tells you how many are filled. You could subtract that from 500, but COUNTBLANK answers it directly.",
          d: "SUM would add the phone numbers together, which is meaningless.",
        },
      },
      {
        id: "q11-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-count-vs-counta-vs-blank",
        prompt:
          "You run =COUNT(A2:A501) on a column of customer names and it returns 0. What has happened?",
        options: [
          { id: "a", text: "The column is empty" },
          { id: "b", text: "COUNT only counts numbers, and names are text" },
          { id: "c", text: "The range is wrong" },
          { id: "d", text: "Excel has a bug" },
        ],
        correct: "b",
        explanation:
          "COUNT ignores text entirely. On a name column it returns 0 without any error, which is what makes it dangerous. COUNTA is the one you wanted.",
        whyWrong: {
          a: "If it were empty, COUNTA would also return 0. The point is that COUNT returns 0 on a full column of text.",
          c: "The range covers the data. The function is the problem, not the range.",
          d: "This is documented behaviour, and it is why the distinction is worth learning.",
        },
      },
      {
        id: "q11-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-countif",
        prompt: "Which criterion correctly counts sales above 500,000?",
        options: [
          { id: "a", text: "=COUNTIF(C2:C7, >500000)" },
          { id: "b", text: '=COUNTIF(C2:C7, ">500000")' },
          { id: "c", text: '=COUNTIF(C2:C7, "> 500,000")' },
          { id: "d", text: "=COUNTIF(>500000, C2:C7)" },
        ],
        correct: "b",
        explanation:
          "The operator and the number both go inside one pair of quote marks, with no comma in the number.",
        whyWrong: {
          a: "Without quote marks Excel cannot read the comparison and returns an error.",
          c: "The thousands comma breaks the number, and the space is unreliable. Write it as 500000.",
          d: "The arguments are reversed. The range comes first, the criterion second.",
        },
      },
      {
        id: "q11-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-countifs",
        prompt:
          "You need to know how many Lagos customers spent over ₦50,000. A colleague suggests running COUNTIF for Lagos, running COUNTIF for over ₦50,000, and subtracting. Why is that wrong?",
        options: [
          { id: "a", text: "It is fine, just slower" },
          {
            id: "b",
            text: "Those counts overlap in a way subtraction cannot untangle. COUNTIFS applies both conditions to the same row",
          },
          { id: "c", text: "COUNTIF cannot handle text" },
          { id: "d", text: "You would need to sort the data first" },
        ],
        correct: "b",
        explanation:
          "Counting Lagos customers and counting big spenders gives you two overlapping groups. Subtracting one from the other answers no real question. COUNTIFS checks both conditions on each row, which is what was asked.",
        whyWrong: {
          a: "It is not fine. It produces a number that looks plausible and means nothing, which is the worst kind of wrong.",
          c: "COUNTIF handles text perfectly well. The problem is combining two conditions.",
          d: "Sorting changes nothing about which rows meet both conditions.",
        },
      },
      {
        id: "q11-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-countifs",
        prompt: "Your COUNTIFS returns #VALUE!. What is the most likely cause?",
        options: [
          { id: "a", text: "One range covers more rows than another" },
          { id: "b", text: "You used text criteria" },
          { id: "c", text: "The data is not sorted" },
          { id: "d", text: "There are blank cells in the range" },
        ],
        correct: "a",
        explanation:
          "Every range in a COUNTIFS must cover the same rows so Excel can line them up row by row. Mismatched ranges give #VALUE!.",
        whyWrong: {
          b: "Text criteria are normal and supported.",
          c: "COUNTIFS does not care about order. It checks each row independently.",
          d: "Blanks are handled fine. They simply do not match most criteria.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l12-averages-and-ranking": {
    lessonId: "l12-averages-and-ranking",
    passMark: 70,
    questions: [
      {
        id: "q12-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-average-vs-averagea",
        prompt:
          "A ratings column uses \"n/a\" for unrated staff. What does AVERAGEA do with those cells that AVERAGE does not?",
        options: [
          { id: "a", text: "Nothing, they behave identically" },
          { id: "b", text: "AVERAGEA counts each \"n/a\" as zero, dragging the average down" },
          { id: "c", text: "AVERAGEA ignores them" },
          { id: "d", text: "AVERAGEA returns an error" },
        ],
        correct: "b",
        explanation:
          "AVERAGEA includes text and scores it as zero. AVERAGE skips it. On a staff rating that is the difference between 3.6 and 3.0, and between a fair report and an unfair one.",
        whyWrong: {
          a: "They are identical only when every non-numeric cell is genuinely empty.",
          c: "That is AVERAGE. AVERAGEA does the opposite.",
          d: "Neither errors on text. They just disagree about it, silently.",
        },
      },
      {
        id: "q12-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-averageifs",
        prompt: "Which of these is written correctly?",
        options: [
          { id: "a", text: '=AVERAGEIFS(B2:B7,"Lagos",C2:C7)' },
          { id: "b", text: '=AVERAGEIFS(C2:C7,B2:B7,"Lagos")' },
          { id: "c", text: '=AVERAGEIF(C2:C7,B2:B7,"Lagos")' },
          { id: "d", text: '=AVERAGEIFS("Lagos",B2:B7,C2:C7)' },
        ],
        correct: "b",
        explanation:
          "AVERAGEIFS puts the range you want to average FIRST, then range and criterion pairs. This is the reverse of AVERAGEIF, which is exactly why it catches people.",
        whyWrong: {
          a: "That is AVERAGEIF's argument order used with AVERAGEIFS. It will average the wrong column or error.",
          c: "That is AVERAGEIFS's order used with AVERAGEIF. The two functions have opposite conventions.",
          d: "The criterion cannot come first. Excel needs a range to average before anything else.",
        },
      },
      {
        id: "q12-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-averageif",
        prompt:
          "Company average sales are 507,500. Lagos averages 698,333 and Abuja 320,000. Which number belongs in the report?",
        options: [
          { id: "a", text: "The company average, because it covers everyone" },
          {
            id: "b",
            text: "The regional split, because it shows where the problem actually is",
          },
          { id: "c", text: "Only the highest, to keep the report positive" },
          { id: "d", text: "None. Averages are always misleading" },
        ],
        correct: "b",
        explanation:
          "The company average is true and unactionable. It hides a region running at less than half another. The split is the finding; the overall figure is context.",
        whyWrong: {
          a: "It is accurate and tells the reader nothing they can do anything about.",
          c: "Reporting only the good number is not analysis, and it will be found out.",
          d: "Averages are extremely useful. They mislead when quoted without the segments underneath.",
        },
      },
      {
        id: "q12-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-rank",
        prompt:
          "Two reps tie for the top sales figure. What ranks does RANK.EQ give the top four?",
        options: [
          { id: "a", text: "1, 2, 3, 4" },
          { id: "b", text: "1, 1, 3, 4" },
          { id: "c", text: "1.5, 1.5, 3, 4" },
          { id: "d", text: "1, 1, 2, 3" },
        ],
        correct: "b",
        explanation:
          "RANK.EQ gives tied values the same, higher rank and then skips the position they used up. Rank 2 does not exist.",
        whyWrong: {
          a: "That would require breaking the tie arbitrarily, which RANK.EQ does not do.",
          c: "That is RANK.AVG, which averages the positions the tied values occupy.",
          d: "RANK.EQ skips a position after a tie rather than continuing consecutively.",
        },
      },
      {
        id: "q12-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-max-min-in-practice",
        prompt:
          "You run MIN over a product price column and get 0. What should you do?",
        options: [
          { id: "a", text: "Nothing, zero is a valid number" },
          {
            id: "b",
            text: "Investigate. A zero price is either a real free item or a missing value entered as zero, and you need to know which",
          },
          { id: "c", text: "Delete the row" },
          { id: "d", text: "Replace it with the average price" },
        ],
        correct: "b",
        explanation:
          "Running MAX and MIN across every numeric column is a thirty-second data quality check. A zero or a negative where none should exist is the dataset telling you something before you build on it.",
        whyWrong: {
          a: "It may be valid, and it may be a missing value silently entered as zero. You cannot know without looking, and it drags every average down either way.",
          c: "Deleting data you do not understand destroys the evidence.",
          d: "Substituting an average invents a number and hides the problem.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l13-percentages-and-formats": {
    lessonId: "l13-percentages-and-formats",
    passMark: 70,
    questions: [
      {
        id: "q13-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-percent-format",
        prompt:
          "A cell is formatted as a percentage. You type 25 into it. What does Excel display?",
        options: [
          { id: "a", text: "25%" },
          { id: "b", text: "2500%" },
          { id: "c", text: "0.25%" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation:
          "The percent format multiplies the DISPLAY by 100. Typing 25 means twenty-five whole units, which displays as 2500%. For 25% you type 0.25, or type 25% with the sign.",
        whyWrong: {
          a: "That is what you would get from typing 0.25, or from typing 25%.",
          c: "That would need the cell to hold 0.0025.",
          d: "It is perfectly valid, which is why this catches people. Excel shows a wrong-looking number rather than complaining.",
        },
      },
      {
        id: "q13-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-percentage-maths",
        prompt:
          "You write =C2/E2*100 and also format the cell as a percentage. What goes wrong?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "The value is multiplied by 100 twice, showing 10930% instead of 109%" },
          { id: "c", text: "Excel returns #VALUE!" },
          { id: "d", text: "The cell shows a decimal" },
        ],
        correct: "b",
        explanation:
          "The formula multiplies by 100 and then the format multiplies the display by 100 again. Do one or the other: the division alone, plus the percent format.",
        whyWrong: {
          a: "The number will be a hundred times too large, and it will look deliberate.",
          c: "It is valid arithmetic. Excel calculates it happily.",
          d: "The percent format is applied, so it shows a percentage. Just a wildly wrong one.",
        },
      },
      {
        id: "q13-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-percentage-maths",
        prompt: "Which formula gives growth from an old figure in E2 to a new one in C2?",
        options: [
          { id: "a", text: "=C2/E2" },
          { id: "b", text: "=(C2-E2)/E2" },
          { id: "c", text: "=C2-E2" },
          { id: "d", text: "=E2/C2" },
        ],
        correct: "b",
        explanation:
          "Growth is the change divided by what you started with. The difference over the original.",
        whyWrong: {
          a: "That gives the new figure as a proportion of the old, so 9% growth reads as 109%. Useful, but it is attainment, not growth.",
          c: "That is the change in naira, not as a percentage.",
          d: "That inverts the comparison and answers a different question.",
        },
      },
      {
        id: "q13-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-data-types",
        prompt:
          "A column of prices will not sum. You change its format to Currency and it still will not. Why?",
        options: [
          { id: "a", text: "Currency format does not support SUM" },
          {
            id: "b",
            text: "The values are stored as text. Changing the format changes appearance, not the stored type",
          },
          { id: "c", text: "The range is wrong" },
          { id: "d", text: "SUM cannot handle currency" },
        ],
        correct: "b",
        explanation:
          "Format and type are different things. A number stored as text stays text however you format it, and SUM skips text. It has to be converted, not restyled.",
        whyWrong: {
          a: "Currency-formatted numbers sum normally. The format is not the obstacle.",
          c: "Possible in general, but the giveaway here is that reformatting made no difference.",
          d: "SUM handles currency-formatted numbers without difficulty.",
        },
      },
      {
        id: "q13-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-percent-format",
        prompt: "A cell displays 109.3%. What number does it actually hold?",
        options: [
          { id: "a", text: "109.3" },
          { id: "b", text: "1.093" },
          { id: "c", text: "10930" },
          { id: "d", text: "0.1093" },
        ],
        correct: "b",
        explanation:
          "The percent format displays the stored value multiplied by 100. Showing 109.3% means the cell holds 1.093.",
        whyWrong: {
          a: "If it held 109.3 the percent format would show 10930%.",
          c: "That would display as 1,093,000%.",
          d: "That would display as 10.93%.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l14-working-fast": {
    lessonId: "l14-working-fast",
    passMark: 70,
    questions: [
      {
        id: "q14-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-fill-down",
        prompt: "You fill =B2*C2 from D2 down to D5. What does D4 contain?",
        options: [
          { id: "a", text: "=B2*C2" },
          { id: "b", text: "=B4*C4" },
          { id: "c", text: "=B5*C5" },
          { id: "d", text: "The value from D2" },
        ],
        correct: "b",
        explanation:
          "Relative references shift with the formula. Two rows down means both references move two rows down.",
        whyWrong: {
          a: "That would need both references locked with dollar signs.",
          c: "That is what D5 would hold. D4 is two rows below D2, not three.",
          d: "Filling copies the formula, not the result.",
        },
      },
      {
        id: "q14-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-absolute-when-filling",
        prompt:
          "You write =C2/C8 to get a rep's share of the team total in C8, then fill down. Every row after the first shows #DIV/0!. Why?",
        options: [
          { id: "a", text: "The total in C8 is zero" },
          {
            id: "b",
            text: "C8 shifted to C9, C10 and so on as you filled. It should have been $C$8",
          },
          { id: "c", text: "You cannot divide inside a fill" },
          { id: "d", text: "The column needs reformatting" },
        ],
        correct: "b",
        explanation:
          "The reference to the total was relative, so it slid down with each row and started pointing at empty cells. Locking it as $C$8 keeps every row pointing at the real total.",
        whyWrong: {
          a: "If the total were zero, the first row would fail too. It worked, which means the first reference was correct.",
          c: "Division fills perfectly well. The problem is which cell it points at afterwards.",
          d: "Formatting has no effect on what a reference points to.",
        },
      },
      {
        id: "q14-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-auto-numbering",
        prompt:
          "You typed row numbers 1 to 400 by hand, then sorted the data by sales. What happened to the numbering?",
        options: [
          { id: "a", text: "It renumbered itself" },
          { id: "b", text: "The numbers travelled with their rows, so the column is now out of order" },
          { id: "c", text: "The numbers stayed in place and now label different rows" },
          { id: "d", text: "Excel warned you before sorting" },
        ],
        correct: "b",
        explanation:
          "Typed numbers are data like any other, so they move with their row during a sort. Your sequence is now scrambled. =ROW()-1 renumbers itself because it depends on position, not content.",
        whyWrong: {
          a: "Only a formula-based number does that. Typed values cannot.",
          c: "They move with the row, which is the opposite of staying put.",
          d: "Excel sorts without warning you about this.",
        },
      },
      {
        id: "q14-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-shortcuts",
        prompt: "What does Ctrl + D do?",
        options: [
          { id: "a", text: "Deletes the row" },
          { id: "b", text: "Fills down from the cell above" },
          { id: "c", text: "Duplicates the sheet" },
          { id: "d", text: "Opens the date picker" },
        ],
        correct: "b",
        explanation:
          "Select the cell with the formula plus the range below it, press Ctrl+D, and the formula copies down with references shifting.",
        whyWrong: {
          a: "That is Ctrl + minus, and it is not reversible by pressing D.",
          c: "Duplicating a sheet is done from the tab's right-click menu.",
          d: "Ctrl + semicolon inserts today's date. There is no date picker.",
        },
      },
      {
        id: "q14-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-fill-down",
        prompt:
          "Why is one filled formula safer than the same formula typed into 400 rows by hand?",
        options: [
          { id: "a", text: "It is not safer, only faster" },
          {
            id: "b",
            text: "One formula is one thing to check. Four hundred typed ones are four hundred chances for one to be subtly wrong and never found",
          },
          { id: "c", text: "Filled formulas cannot contain errors" },
          { id: "d", text: "Excel validates filled formulas automatically" },
        ],
        correct: "b",
        explanation:
          "Speed is the obvious benefit and correctness is the real one. A single mistyped reference in row 287 produces a plausible number nobody will ever question.",
        whyWrong: {
          a: "The time saved matters far less than the errors avoided.",
          c: "A filled formula reproduces whatever error the original had. The point is that there is only one original.",
          d: "Excel does not check whether your formula is right, filled or typed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l15-combined-practice": {
    lessonId: "l15-combined-practice",
    passMark: 70,
    questions: [
      {
        id: "q15-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-build-quality",
        prompt:
          "Before reporting an average rating, which check tells you whether the figure covers everyone?",
        options: [
          { id: "a", text: "=SUM on the ratings" },
          { id: "b", text: "=COUNTBLANK on the ratings" },
          { id: "c", text: "=MAX on the ratings" },
          { id: "d", text: "No check is needed" },
        ],
        correct: "b",
        explanation:
          "COUNTBLANK tells you how many are missing, which tells you how many people the average actually describes. It is one formula and it protects the whole report.",
        whyWrong: {
          a: "A total of ratings is not a meaningful number and says nothing about coverage.",
          c: "MAX gives the highest rating, not how complete the data is.",
          d: "Quoting an average without knowing its coverage is how analysts lose credibility.",
        },
      },
      {
        id: "q15-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-build-segment",
        prompt:
          "Your summary says total sales 3,045,000 and average 507,500. Your manager reads it and does nothing. What is missing?",
        options: [
          { id: "a", text: "More decimal places" },
          { id: "b", text: "A comparison, such as Lagos running well above the company average" },
          { id: "c", text: "A chart" },
          { id: "d", text: "Nothing, that is a complete summary" },
        ],
        correct: "b",
        explanation:
          "Totals restate what is already in the sheet. Comparisons point at something to do. \"Lagos is 38% above average, Abuja is 37% below\" is what gets a decision made.",
        whyWrong: {
          a: "Precision is not the problem. Relevance is.",
          c: "A chart of the same two uninteresting numbers is still uninteresting.",
          d: "It is accurate and inert, which is why nothing happened.",
        },
      },
      {
        id: "q15-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-build-quality",
        prompt: "Why COUNTA rather than COUNT to count the reps on the team?",
        options: [
          { id: "a", text: "COUNTA is faster" },
          { id: "b", text: "Their names are text, and COUNT ignores text" },
          { id: "c", text: "COUNT only works on one column" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "b",
        explanation:
          "COUNT would return 0 on a column of names, without any error. COUNTA counts anything that is filled.",
        whyWrong: {
          a: "Speed is identical and irrelevant at this size.",
          c: "Both work across any range.",
          d: "The difference is the whole reason this returns 6 instead of 0.",
        },
      },
      {
        id: "q15-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-brief",
        prompt:
          "A manager asks for \"a summary of how the team is doing\". What is the first thing to do?",
        options: [
          { id: "a", text: "Start building charts" },
          {
            id: "b",
            text: "Turn the vague request into specific questions, then pick the function that answers each",
          },
          { id: "c", text: "Send the raw spreadsheet" },
          { id: "d", text: "Calculate every function you know and include them all" },
        ],
        correct: "b",
        explanation:
          "Total, average, spread, completeness, segments, ranking. Naming the questions first is what turns a vague request into a piece of work you can finish and defend.",
        whyWrong: {
          a: "A chart of the wrong number is still the wrong number.",
          c: "Sending raw data back is handing the question straight back to them.",
          d: "A screen of every possible statistic buries the two figures that mattered.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
