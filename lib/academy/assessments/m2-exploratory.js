/**
 * ASSESSMENTS · EXPLORATORY DATA ANALYSIS (m2-exploratory)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * These questions deliberately avoid "which function does X". A learner can
 * pass that by memorising a table. Every question here puts a number or a
 * decision in front of them and asks what it MEANS, because that is the part
 * the job actually tests.
 *
 * The figures all come from the ORDERS dataset in the lesson file:
 *   mean 137,000 · median 48,000 · Q1 43,500 · Q3 54,000
 *   IQR 10,500 · upper fence 69,750 · lower fence 27,750
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l21-meeting-a-dataset": {
    lessonId: "l21-meeting-a-dataset",
    passMark: 70,
    questions: [
      {
        id: "q21-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-what-eda-is",
        prompt:
          "A client sends you a sales export at 9am and needs a revenue figure by 11am. What do you do first?",
        options: [
          { id: "a", text: "Build the pivot table immediately — there is no time to waste" },
          { id: "b", text: "Spend ten minutes profiling the data, then build" },
          { id: "c", text: "Ask the client to clean the file before sending it" },
          { id: "d", text: "Sum the revenue column and send it" },
        ],
        correct: "b",
        explanation:
          "Profiling is fast and it is what makes the 11am number defensible. Ten minutes spent finding a duplicated export or a text column is ten minutes that prevents a wrong figure reaching a client.",
        whyWrong: {
          a: "The pivot will build happily on broken data and give you a confident, wrong total. Speed is not the constraint here; being right is.",
          c: "The client sent you the file because cleaning it is your job. This also burns the two hours you were given.",
          d: "A bare SUM cannot tell you the column contains a duplicate export or an extra zero. That is exactly the failure profiling prevents.",
        },
      },
      {
        id: "q21-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-profiling-completeness",
        prompt:
          "On a column of 500 order values, =COUNTA(B2:B501) returns 500 but =COUNT(B2:B501) returns 460. What have you found?",
        options: [
          { id: "a", text: "40 cells are empty" },
          { id: "b", text: "40 cells contain something that is not a number" },
          { id: "c", text: "40 orders were cancelled" },
          { id: "d", text: "The range is wrong" },
        ],
        correct: "b",
        explanation:
          "COUNTA counts anything non-empty and COUNT counts only numbers. The gap of 40 is entries that are filled but not numeric — typically numbers stored as text, or a stray 'N/A'. Any SUM over that column is currently understating by 40 rows.",
        whyWrong: {
          a: "If 40 were empty, COUNTA would have returned 460 as well. COUNTA saw all 500 as filled.",
          c: "Nothing in a count of numbers versus a count of entries says anything about cancellations. That would be a value in a status column.",
          d: "Both formulas cover the same 500 cells and COUNTA found 500 of them. The range is fine; the contents are not.",
        },
      },
      {
        id: "q21-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-profiling-range",
        prompt:
          "You run MIN and MAX on a column of product prices and get MIN 0 and MAX 0, though you can plainly see prices in the cells. What is the most likely explanation?",
        options: [
          { id: "a", text: "Every price is genuinely zero" },
          { id: "b", text: "The prices are stored as text, so MIN and MAX ignore them all" },
          { id: "c", text: "MIN and MAX cannot handle currency formatting" },
          { id: "d", text: "The file is corrupted" },
        ],
        correct: "b",
        explanation:
          "MIN and MAX ignore text. When every value in a range is text they have nothing to work with and both return 0. Seeing 0 from both on a visibly populated column is the classic signature of a text-formatted number column.",
        whyWrong: {
          a: "If the cells display real prices, they are not zero. The functions are reporting on what they can read, not on what you can see.",
          c: "Currency formatting is only a display layer. A genuinely numeric cell formatted as currency is still a number to MIN and MAX.",
          d: "A corrupted file would usually fail to open or error. This is normal, documented behaviour with a specific cause.",
        },
      },
      {
        id: "q21-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-row-count-truth",
        prompt:
          "You profile a dataset with COUNTA on the customer email column and report 920 records. The source system says there are 1,000 orders. What is the most likely cause?",
        options: [
          { id: "a", text: "The source system is wrong" },
          { id: "b", text: "80 orders have no email address recorded" },
          { id: "c", text: "80 orders were deleted from the export" },
          { id: "d", text: "COUNTA has a row limit" },
        ],
        correct: "b",
        explanation:
          "You counted on a column that is allowed to be blank. Email is optional in most systems, so 80 orders simply have none. Count rows on a column that can never be blank — an order ID — and you would have found all 1,000.",
        whyWrong: {
          a: "Possible but far less likely than the ordinary explanation, and you should exhaust your own method before doubting the source.",
          c: "Deletion is possible, but the far commoner cause is profiling on an optional column. Check the ID column before raising an alarm.",
          d: "COUNTA has no such limit. It handles entire columns without difficulty.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l22-descriptive-statistics": {
    lessonId: "l22-descriptive-statistics",
    passMark: 70,
    questions: [
      {
        id: "q22-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mean-vs-median",
        prompt:
          "In the orders dataset the mean amount is 137,000 and the median is 48,000. A manager asks for 'the average order value'. What do you report?",
        options: [
          { id: "a", text: "137,000, because that is the average" },
          { id: "b", text: "48,000, noting it is the median and that one outlier distorts the mean" },
          { id: "c", text: "Both numbers, and let the manager choose" },
          { id: "d", text: "92,500, the midpoint of the two" },
        ],
        correct: "b",
        explanation:
          "A gap of 89,000 between mean and median means the distribution is badly skewed. The median describes a typical order; the mean describes a dataset containing one 980,000 sale. Report the median and say why in one sentence.",
        whyWrong: {
          a: "Technically the mean, but nobody's order looks like 137,000. Nine of the ten orders are below 62,000, so the figure describes no real customer.",
          c: "Handing over two numbers without a recommendation moves your job to the manager. Choose, and justify the choice.",
          d: "Averaging a mean and a median is not a statistic. It has no definition and no interpretation.",
        },
      },
      {
        id: "q22-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-mode",
        prompt:
          "=MODE.SNGL(C2:C11) on the order amounts returns #N/A. What does that tell you?",
        options: [
          { id: "a", text: "The formula is wrong" },
          { id: "b", text: "No amount appears more than once, so there is no mode" },
          { id: "c", text: "The column contains text" },
          { id: "d", text: "The range needs to be sorted first" },
        ],
        correct: "b",
        explanation:
          "MODE.SNGL returns #N/A when nothing repeats. On continuous values like currency that is normal and it confirms the column is continuous, which tells you mean and median are the right tools here.",
        whyWrong: {
          a: "The formula is correct. #N/A is MODE.SNGL reporting a genuine fact about the data rather than a fault.",
          c: "Text in the range would simply be ignored. It would not by itself produce #N/A.",
          d: "MODE.SNGL does not care about order. It counts occurrences wherever they sit.",
        },
      },
      {
        id: "q22-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-spread-stdev",
        prompt:
          "Two delivery teams both average 5 days. Team A has a standard deviation of 0.4 days, Team B of 6 days. What is the practical difference?",
        options: [
          { id: "a", text: "There is none — the averages are identical" },
          { id: "b", text: "Team B is faster on average" },
          { id: "c", text: "Team A is predictable; Team B is a lottery, and needs managing differently" },
          { id: "d", text: "Team B has more deliveries" },
        ],
        correct: "c",
        explanation:
          "The mean tells you where the middle is, the standard deviation tells you whether the middle describes anything. Team A delivers in about 5 days every time. Team B averages 5 but individual customers might wait 1 day or 17. Same mean, completely different customer experience.",
        whyWrong: {
          a: "This is precisely the trap. Identical means routinely hide completely different distributions, which is why a spread is quoted alongside a middle.",
          b: "Both averages are 5 days. Standard deviation measures spread, not speed.",
          d: "Standard deviation says nothing about how many deliveries there were. That would be a count.",
        },
      },
      {
        id: "q22-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-choosing-a-summary",
        prompt:
          "You are summarising house prices for a neighbourhood report. Which summary is the professional default?",
        options: [
          { id: "a", text: "Mean, because it uses every value" },
          { id: "b", text: "Median, because property prices are almost always skewed by a few expensive homes" },
          { id: "c", text: "Mode, because it shows the commonest price" },
          { id: "d", text: "Maximum, because it shows the ceiling" },
        ],
        correct: "b",
        explanation:
          "Property prices are the textbook skewed distribution: most homes cluster and a few mansions sit far above. This is why every housing statistic you have ever read quotes a median. The mean would describe a house nobody is selling.",
        whyWrong: {
          a: "Using every value is exactly the problem when a handful of values are extreme. Those few drag the mean away from typical.",
          c: "Prices rarely repeat exactly, so the mode is usually #N/A or an accident of rounding.",
          d: "The maximum is one house. It describes the ceiling, not the neighbourhood.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l23-outliers": {
    lessonId: "l23-outliers",
    passMark: 70,
    questions: [
      {
        id: "q23-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-quartiles",
        prompt:
          "For the order amounts, Q1 is 43,500 and Q3 is 54,000. What does that pair of numbers tell you?",
        options: [
          { id: "a", text: "The smallest and largest orders" },
          { id: "b", text: "The middle half of all orders falls between 43,500 and 54,000" },
          { id: "c", text: "Half of all orders are above 54,000" },
          { id: "d", text: "The average order is about 48,750" },
        ],
        correct: "b",
        explanation:
          "Q1 marks the quarter point and Q3 the three-quarter point, so the span between them contains the middle 50% of the data. Against a middle half that narrow, both the 0 and the 980,000 are clearly a different kind of thing.",
        whyWrong: {
          a: "The smallest and largest are 0 and 980,000, which are QUARTILE.INC cuts 0 and 4.",
          c: "A quarter of orders are above Q3, not half. Half sit above the median.",
          d: "That is the midpoint of the two quartiles, which is not a defined statistic. The median here is 48,000.",
        },
      },
      {
        id: "q23-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-iqr-rule",
        prompt:
          "With Q1 = 43,500 and Q3 = 54,000, what is the upper fence under the 1.5 × IQR rule?",
        options: [
          { id: "a", text: "69,750" },
          { id: "b", text: "81,000" },
          { id: "c", text: "64,500" },
          { id: "d", text: "54,000" },
        ],
        correct: "a",
        explanation:
          "IQR = 54,000 − 43,500 = 10,500. The upper fence is Q3 + 1.5 × IQR = 54,000 + 15,750 = 69,750. The 980,000 order sits far above it, which is what makes calling it an outlier a rule-based decision rather than an opinion.",
        whyWrong: {
          b: "81,000 is Q3 × 1.5. The multiplier applies to the IQR, not to Q3 itself.",
          c: "64,500 adds the IQR once rather than one and a half times.",
          d: "54,000 is Q3, the starting point. The fence sits above it by 1.5 IQRs.",
        },
      },
      {
        id: "q23-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-what-to-do-with-outliers",
        prompt:
          "The 980,000 order is flagged as an outlier. Your contact confirms it was a genuine bulk purchase by a regional distributor. What now?",
        options: [
          { id: "a", text: "Delete it — it distorts the averages" },
          { id: "b", text: "Keep it in the totals, and report the median alongside so one sale does not define the typical order" },
          { id: "c", text: "Halve it so it fits the pattern" },
          { id: "d", text: "Keep it and report only the mean" },
        ],
        correct: "b",
        explanation:
          "It is real revenue, so it belongs in the totals. It is also unrepresentative, so it must not set the 'typical order'. Keeping it while reporting the median is the only approach that is both complete and honest.",
        whyWrong: {
          a: "Deleting confirmed revenue understates the business. Outliers are excluded when unexplainable, not when merely inconvenient.",
          c: "Altering a verified value to fit an expected pattern is fabrication, whatever the intention behind it.",
          d: "The mean alone tells a reader the typical order is 137,000, which is true of no order in the dataset.",
        },
      },
      {
        id: "q23-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-large-small",
        prompt:
          "Why would you use =LARGE(C2:C11,2) rather than just looking at =MAX(C2:C11)?",
        options: [
          { id: "a", text: "LARGE is faster" },
          { id: "b", text: "To see the runner-up, so you can measure the gap between the top value and the rest" },
          { id: "c", text: "MAX does not work on ranges" },
          { id: "d", text: "LARGE ignores outliers automatically" },
        ],
        correct: "b",
        explanation:
          "MAX only ever shows you the single highest value, which tells you nothing about whether it belongs. LARGE(range,2) gives the runner-up: here 62,000 against 980,000, and a gap that large is the evidence that the top value is a different kind of thing.",
        whyWrong: {
          a: "Speed is irrelevant at this scale, and LARGE(range,1) is simply MAX anyway.",
          c: "MAX works on ranges perfectly well. It just answers a narrower question.",
          d: "LARGE does nothing automatically. It returns the nth value, outlier or not — the judgement stays yours.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l24-missing-values": {
    lessonId: "l24-missing-values",
    passMark: 70,
    questions: [
      {
        id: "q24-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-blank-vs-zero",
        prompt:
          "A colleague fills every blank rating with 0 so the sheet 'looks complete'. What have they done to the average rating?",
        options: [
          { id: "a", text: "Nothing — blanks were being ignored anyway" },
          { id: "b", text: "Lowered it, by turning 'we do not know' into a score of zero" },
          { id: "c", text: "Raised it" },
          { id: "d", text: "Made it more accurate" },
        ],
        correct: "b",
        explanation:
          "AVERAGE skips blanks but counts zeros. Filling the gap invents a measurement of 0 for a customer who never rated, pulling the mean down. Nothing on screen indicates anything changed, which is what makes this class of error so dangerous.",
        whyWrong: {
          a: "They were being ignored, which was correct. Now they are counted as a real score of zero, so the result genuinely changes.",
          c: "Zero is below every real rating in the scale, so it can only pull the average down.",
          d: "It is less accurate. A fabricated measurement has replaced an honest gap.",
        },
      },
      {
        id: "q24-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-counting-missing",
        prompt:
          "In a delivery dataset, every missing postcode belongs to one courier. What is the right response?",
        options: [
          { id: "a", text: "Delete those rows — under 5% of the data" },
          { id: "b", text: "Fill them with the most common postcode" },
          { id: "c", text: "Treat the pattern as a finding and report it, because one courier is not recording postcodes" },
          { id: "d", text: "Ignore it, as postcodes are not part of the analysis" },
        ],
        correct: "c",
        explanation:
          "Missing data that clusters is not noise, it is a signal about a process. One courier failing to record postcodes is an operational problem worth more than whatever analysis you were asked for.",
        whyWrong: {
          a: "Deleting them removes the evidence of the pattern and quietly biases the dataset against that courier's deliveries.",
          b: "Inventing locations puts deliveries in places they never went, and any geographic analysis afterwards is fiction.",
          d: "Even if postcodes are irrelevant to this task, a systematic recording failure is worth telling someone about.",
        },
      },
      {
        id: "q24-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-iferror-missing",
        prompt:
          "Which use of IFERROR is genuinely dangerous?",
        options: [
          { id: "a", text: '=IFERROR(C2/D2,"")' },
          { id: "b", text: '=IFERROR(C2/D2,0)' },
          { id: "c", text: '=IFERROR(VLOOKUP(A2,Table,2,FALSE),"Not found")' },
          { id: "d", text: "Not using IFERROR at all" },
        ],
        correct: "b",
        explanation:
          "Replacing an error with 0 converts a visible problem into an invisible one. That 0 then flows into every AVERAGE and SUM downstream as though it were a genuine measurement, and nothing on screen indicates it was manufactured.",
        whyWrong: {
          a: 'An empty string leaves the cell blank, and blanks are skipped by AVERAGE. It is the safe default.',
          c: "This states what happened in plain words. A reader can see the lookup failed and act on it.",
          d: "Leaving errors visible is not dangerous — it is often correct. An error you can see is an error you can fix.",
        },
      },
      {
        id: "q24-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-counting-missing",
        prompt:
          "You report a mean customer rating of 3.56 from a 10-row dataset where one order was never rated. What must accompany that number?",
        options: [
          { id: "a", text: "Nothing — 3.56 is correct" },
          { id: "b", text: "The fact that it is based on 9 of the 10 orders" },
          { id: "c", text: "The maximum rating given" },
          { id: "d", text: "The name of the customer who did not rate" },
        ],
        correct: "b",
        explanation:
          "The figure is right, but it is based on 9 responses rather than 10. Stating the n pre-empts the only question a careful reader will ask, and it costs you four words.",
        whyWrong: {
          a: "The arithmetic is correct, but a summary statistic without its sample size is incomplete rather than wrong.",
          c: "The maximum adds nothing about the reliability of the mean.",
          d: "Naming an individual customer is both irrelevant to the statistic and a privacy problem.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l25-framing-questions": {
    lessonId: "l25-framing-questions",
    passMark: 70,
    questions: [
      {
        id: "q25-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-making-a-question-measurable",
        prompt:
          "Your manager asks 'is delivery a problem?'. Which rewrite is actually answerable?",
        options: [
          { id: "a", text: "Are customers unhappy with delivery?" },
          { id: "b", text: "What share of orders took more than 5 days to deliver, by state, this quarter?" },
          { id: "c", text: "How fast is our delivery?" },
          { id: "d", text: "Is delivery slower than our competitors?" },
        ],
        correct: "b",
        explanation:
          "It names the metric (share over 5 days), the grouping (by state) and the period (this quarter). There is exactly one number that answers it, and you can start building immediately.",
        whyWrong: {
          a: "Still subjective, and it measures sentiment rather than delivery. You would need a different dataset entirely.",
          c: "'Fast' is undefined. Mean days? Median? Share within target? Each gives a different answer.",
          d: "Answerable in principle, but you have no competitor data. A question you cannot source is not yet a question.",
        },
      },
      {
        id: "q25-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-sumifs",
        prompt:
          "What is wrong with =SUMIFS(B2:B11,\"Lagos\",C2:C11)?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "The range to total must come first, then range and criteria in pairs" },
          { id: "c", text: "Lagos needs single quotes" },
          { id: "d", text: "SUMIFS cannot take text criteria" },
        ],
        correct: "b",
        explanation:
          "SUMIFS starts with the sum_range, then takes criteria_range and criteria in pairs: =SUMIFS(C2:C11,B2:B11,\"Lagos\"). The written version passes a criterion where a range was expected. Note SUMIF puts its sum range LAST, which is why the two get confused.",
        whyWrong: {
          a: "The argument order is wrong, so Excel returns an error rather than a total.",
          c: "Excel uses double quotes for text. Single quotes mean something else entirely.",
          d: "SUMIFS handles text criteria perfectly well — that is most of what it is for.",
        },
      },
      {
        id: "q25-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-countifs-segments",
        prompt:
          "Lagos totals 179,000 from 5 orders and Abuja 1,097,000 from 3. What is the responsible way to compare them?",
        options: [
          { id: "a", text: "Abuja is six times better than Lagos" },
          { id: "b", text: "Report per-order figures and flag that one 980,000 outlier drives almost all of Abuja's total" },
          { id: "c", text: "Compare only the totals, since that is the revenue" },
          { id: "d", text: "Drop Abuja as unreliable" },
        ],
        correct: "b",
        explanation:
          "Abuja's total is 1,097,000, of which 980,000 is a single outlier order. Strip it and Abuja's remaining two orders total 117,000. Per-order figures plus an explicit note about the outlier is the only comparison that survives scrutiny.",
        whyWrong: {
          a: "This is the conclusion the raw totals invite and it is wrong. One order, not regional strength, produces the difference.",
          c: "The totals are real revenue but they answer 'how much' rather than 'which region performs better', which was the question.",
          d: "Dropping a whole region because one order is unusual discards two perfectly good orders and the revenue with them.",
        },
      },
      {
        id: "q25-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-segment-with-fill",
        prompt:
          "You write =SUMIFS(C2:C11,B2:B11,A15) in B15 without locking anything and fill down to B17. All three totals look correct. Why is the sheet still wrong?",
        options: [
          { id: "a", text: "It is not wrong — the totals are right, so the formula is fine" },
          { id: "b", text: "B17 now reads C4:C13 and B4:B13. It matched by luck, and will report a silently wrong total the moment a state's rows fall outside the shifted window" },
          { id: "c", text: "SUMIFS cannot be filled down at all" },
          { id: "d", text: "A15 should have been locked as $A$15" },
        ],
        correct: "b",
        explanation:
          "Unlocked ranges slide with the fill: by B17 the formula is scanning C4:C13 instead of C2:C11. Kano's two orders happen to still sit inside that window, so the total is right by accident. Put Lagos third instead and the same sheet drops row 2 and reports 134,000 rather than 179,000 — with no error and no warning. A formula that is right by coincidence is not right.",
        whyWrong: {
          a: "This is the trap. A correct-looking answer from a broken formula is more dangerous than an error, because nothing prompts you to check it.",
          c: "SUMIFS fills down perfectly well. It just needs its fixed ranges locked, like any other function.",
          d: "The opposite: A15 is the one reference that MUST stay relative, so each row totals a different state.",
        },
      },
    ],
  },
};
