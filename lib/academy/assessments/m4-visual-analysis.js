/**
 * ASSESSMENTS · VISUAL & STATISTICAL ANALYSIS (m4-visual-analysis)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * The last taught module, so the questions test judgement rather than syntax:
 * which statistic the shape of the data calls for, what a coefficient does and
 * does not license you to say, and when a correct number is still an unsafe
 * sentence. Several questions present a technically accurate figure and ask
 * whether it can be reported — because that is the actual job.
 *
 * Every figure was produced by running the code against pandas 3.0.5 and
 * matplotlib 3.11.2:
 *   mean 51,500 · median 48,000 · std 16,735.92 · skew 2.115
 *   Q1 42,500 · Q3 55,250 · IQR 12,750 · fence 74,375 → ORD-6 at 98,000
 *   shares 44.7 / 34.8 / 20.6 summing to 100.1
 *   units~amount r = -0.039 · amount~amount*1.075 r = 1.0
 *   monthly 178,000 / 237,000 / 203,000 · Lagos ÷ Kano = 2.17
 *   Kano n=3, mean 42,333.33, std 9,018.50
 *   boxes: Abuja 55k-98k median 62k · Lagos 38k-56k median 46k
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l80-descriptive-stats": {
    lessonId: "l80-descriptive-stats",
    passMark: 70,
    questions: [
      {
        id: "q80-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-central",
        prompt:
          "You report a standard deviation of ₦16,735.92 from .std(). A colleague recomputes it in Excel with STDEV.P and gets a smaller figure. Who is wrong?",
        options: [
          { id: "a", text: "Neither — .std() defaults to the sample version (ddof=1) and STDEV.P is the population version; you must agree which you mean" },
          { id: "b", text: "You are — pandas miscalculates standard deviation" },
          { id: "c", text: "Your colleague is — Excel is less precise" },
          { id: "d", text: "Both, because standard deviation cannot be compared across tools" },
        ],
        correct: "a",
        explanation:
          "pandas .std() uses ddof=1 (sample), Excel's STDEV.P uses the population divisor, which is larger and so gives a smaller result. Both are correct answers to different questions. Pass ddof=0 to .std() to match STDEV.P, and record which you used.",
        whyWrong: {
          b: "pandas is right. It is answering the sample question by default.",
          c: "Precision is not the issue; the divisor is.",
          d: "They compare perfectly well once you match the ddof.",
        },
      },
      {
        id: "q80-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-skew",
        prompt:
          "A column has a mean of ₦51,500, a median of ₦48,000 and a skew of 2.115. Which figure should the summary headline, and why?",
        options: [
          { id: "a", text: "The median, ₦48,000 — a skew above 1 means a long right tail is pulling the mean up, so the median better describes a typical order" },
          { id: "b", text: "The mean, ₦51,500, because it uses every value" },
          { id: "c", text: "Either — a ₦3,500 gap is immaterial" },
          { id: "d", text: "The skew, 2.115" },
        ],
        correct: "a",
        explanation:
          "Skew of 2.1 is strongly right-tailed: a few large orders drag the mean above what most customers actually spend. The median is the honest answer to 'what does a typical order look like'.",
        whyWrong: {
          b: "Using every value is exactly the problem when one of twelve is ₦98,000.",
          c: "The gap is the symptom, and the skew value tells you it is not noise.",
          d: "Skew tells YOU which statistic to pick; it is not the figure a reader wants.",
        },
      },
      {
        id: "q80-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-iqr",
        prompt:
          "Q1 is ₦42,500 and Q3 is ₦55,250. What does the standard outlier fence evaluate to, and what does it catch?",
        options: [
          { id: "a", text: "₦74,375, catching only ORD-6 at ₦98,000" },
          { id: "b", text: "₦55,250, catching every order above Q3" },
          { id: "c", text: "₦68,000, catching ORD-2 and ORD-6" },
          { id: "d", text: "₦12,750, catching ten of the twelve orders" },
        ],
        correct: "a",
        explanation:
          "IQR = 55,250 − 42,500 = 12,750. The fence is Q3 + 1.5 × IQR = 55,250 + 19,125 = ₦74,375. Only ₦98,000 exceeds it, so ORD-2 at ₦62,000 is a large order, not an outlier.",
        whyWrong: {
          b: "Q3 alone would flag a quarter of your data by definition. The 1.5 × IQR margin is what makes it a rule.",
          c: "Not the arithmetic — and it would wrongly flag ORD-2 at ₦62,000.",
          d: "₦12,750 is the IQR itself, not the fence.",
        },
      },
      {
        id: "q80-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-share",
        prompt:
          "Your share table reads Lagos 44.7%, Abuja 34.8%, Kano 20.6% — summing to 100.1%. A reviewer says the analysis is wrong. What is your response?",
        options: [
          { id: "a", text: "Each share is correctly rounded to one decimal place; rounding the parts independently can make them sum to 100.1, and it should be footnoted rather than hidden" },
          { id: "b", text: "They are right — one of the three figures must be miscalculated" },
          { id: "c", text: "Add decimal places until it reaches exactly 100" },
          { id: "d", text: "Drop the percentages and show only the naira values" },
        ],
        correct: "a",
        explanation:
          "44.7 + 34.8 + 20.6 = 100.1 from three correctly rounded numbers. Footnote it, or adjust the largest component down by 0.1 and say you did. Do not let a client discover it unexplained.",
        whyWrong: {
          b: "Nothing is miscalculated. The unrounded shares sum to exactly 100.",
          c: "More decimals shifts the problem rather than removing it, and makes the table harder to read.",
          d: "Shares answer a question naira values do not. Keep them and explain the arithmetic.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l81-bar-line-hist": {
    lessonId: "l81-bar-line-hist",
    passMark: 70,
    questions: [
      {
        id: "q81-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-line",
        prompt:
          "You group twelve orders by a month column holding Jan, Feb and Mar as text, then plot the result without reindexing. What appears along the x-axis?",
        options: [
          { id: "a", text: "Feb, Jan, Mar — groupby sorts the labels alphabetically, so the line implies a sequence that never happened" },
          { id: "b", text: "Jan, Feb, Mar, because pandas recognises month names" },
          { id: "c", text: "The months in the order the rows appear in the file" },
          { id: "d", text: "An error, because months cannot be grouped" },
        ],
        correct: "a",
        explanation:
          "Text is sorted as text. Feb comes before Jan comes before Mar, so the trend line is drawn through the wrong sequence. .reindex(['Jan','Feb','Mar']) fixes it — the same sort-order trap as the Power BI date table.",
        whyWrong: {
          b: "pandas has no idea those strings are months. They are just text.",
          c: "groupby sorts its keys by default; it does not preserve file order.",
          d: "It groups quite happily, and that is what makes the bug quiet.",
        },
      },
      {
        id: "q81-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-hist",
        prompt:
          "You draw a histogram of order amounts with bins=3, then with bins=20. The two pictures tell different stories. What does that mean?",
        options: [
          { id: "a", text: "Bin count is a real choice about the story, so you must try several and pick one that shows the structure without inventing detail" },
          { id: "b", text: "The data is corrupt" },
          { id: "c", text: "bins=20 is always more accurate because it uses more detail" },
          { id: "d", text: "Histograms are unreliable and should be avoided" },
        ],
        correct: "a",
        explanation:
          "Too few bins hides the shape; too many turns twelve orders into twelve spikes of noise. The default is not a neutral choice — look at a few and choose deliberately.",
        whyWrong: {
          b: "Nothing is wrong with the data. This is a property of histograms.",
          c: "Twenty bins across twelve values shows noise, not detail.",
          d: "A histogram is the best tool for showing distribution shape. Just choose the bins consciously.",
        },
      },
      {
        id: "q81-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-bar",
        prompt:
          "Which title belongs on a sorted bar chart of revenue by state?",
        options: [
          { id: "a", text: "Lagos leads on revenue, from more orders — it states the finding" },
          { id: "b", text: "Revenue by State" },
          { id: "c", text: "Sum of amount grouped by state" },
          { id: "d", text: "Chart 1" },
        ],
        correct: "a",
        explanation:
          "A title that names the fields makes the reader do the work of finding the point. A title that states the finding means the chart still communicates when someone glances at it in a meeting.",
        whyWrong: {
          b: "Accurate and empty. The axes already say this.",
          c: "This describes your groupby, not your conclusion.",
          d: "A label, not a title.",
        },
      },
      {
        id: "q81-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-bands",
        prompt:
          "pd.cut with bands [0, 40000, 60000, 100000] returns counts of 2, 8 and 2 across twelve orders. What is the reportable sentence?",
        options: [
          { id: "a", text: "Two thirds of orders — 8 of 12 — fall between ₦40,000 and ₦60,000" },
          { id: "b", text: "Order amounts are evenly spread across the three bands" },
          { id: "c", text: "Most customers spend over ₦60,000" },
          { id: "d", text: "The bands prove the data is normally distributed" },
        ],
        correct: "a",
        explanation:
          "8 of 12 in the middle band is a clustered distribution, and a countable fact you can say out loud — which is what banding gives you that a histogram's shape does not.",
        whyWrong: {
          b: "2, 8, 2 is the opposite of even.",
          c: "Two of twelve are above ₦60,000.",
          d: "Three bands cannot establish normality, and the skew of 2.1 says it is not normal anyway.",
        },
      },
      {
        id: "q81-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-bar",
        prompt:
          "A single-series bar chart of three states is drawn with each bar in a different colour. What is wrong with that?",
        options: [
          { id: "a", text: "Colour is being used to encode nothing, so the reader looks for a meaning that does not exist" },
          { id: "b", text: "Nothing — more colour makes charts friendlier" },
          { id: "c", text: "Matplotlib cannot render multiple colours in one bar call" },
          { id: "d", text: "It only matters in print" },
        ],
        correct: "a",
        explanation:
          "In one series the category is already labelled on the axis, so a second encoding of the same thing adds only the question 'what does blue mean?'. Use one colour, or one highlight colour if you are calling out a single bar.",
        whyWrong: {
          b: "Decoration that implies information is not friendly, it is misleading.",
          c: "It can — pass a list of colours. The objection is editorial, not technical.",
          d: "The confusion happens on screen too.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l82-scatter-box-correlation": {
    lessonId: "l82-scatter-box-correlation",
    passMark: 70,
    questions: [
      {
        id: "q82-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-corr",
        prompt:
          "units.corr(amount) returns -0.039. What may you write in the report?",
        options: [
          { id: "a", text: "Order size and item count show no linear relationship here (r = −0.04)" },
          { id: "b", text: "More items means a smaller order value" },
          { id: "c", text: "Item count has no effect whatsoever on order value" },
          { id: "d", text: "The correlation is negative, so reducing units would raise revenue" },
        ],
        correct: "a",
        explanation:
          "−0.04 is indistinguishable from zero. It licenses a statement about no observed LINEAR relationship in THIS data — nothing about effect, cause, or what would happen if you changed something.",
        whyWrong: {
          b: "−0.04 is not a negative relationship, it is the absence of one.",
          c: "'No effect whatsoever' is a causal claim. A coefficient near zero also cannot rule out a curved relationship.",
          d: "This turns a near-zero correlation into a business recommendation. It is the worst available answer.",
        },
      },
      {
        id: "q82-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-corr-trap",
        prompt:
          "You correlate amount against a line_total column and get exactly 1.0. What should you do first?",
        options: [
          { id: "a", text: "Check whether line_total is derived from amount — a perfect correlation almost always means you have correlated a column with itself" },
          { id: "b", text: "Report it as the strongest finding in the analysis" },
          { id: "c", text: "Conclude that line_total causes amount" },
          { id: "d", text: "Assume pandas rounded and the real value is lower" },
        ],
        correct: "a",
        explanation:
          "line_total is amount × 1.075. Multiplying by a constant cannot change how tightly two columns move together, so r = 1 exactly. Revenue against revenue-with-VAT, sales against commission — real datasets are full of these.",
        whyWrong: {
          b: "It is a finding about your own column arithmetic, not about the business.",
          c: "Neither causes the other; one IS the other with tax added.",
          d: "1.0 is exact here, and the value is not the problem.",
        },
      },
      {
        id: "q82-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-scatter",
        prompt:
          "Why draw the scatter plot when you already have the coefficient?",
        options: [
          { id: "a", text: "Pearson measures straight-line association only, so a curve, two clusters or one dominant outlier can all sit behind the same number" },
          { id: "b", text: "The scatter is more precise than the coefficient" },
          { id: "c", text: "Only to fill space in the report" },
          { id: "d", text: "Because corr() is unreliable on small samples" },
        ],
        correct: "a",
        explanation:
          "A strong curved relationship can score near zero, and a single extreme point can manufacture a high r from unrelated data. Only the picture distinguishes these, which is why you produce both.",
        whyWrong: {
          b: "They answer different questions; neither is more precise.",
          c: "It is the check on your own conclusion.",
          d: "Small samples do make r unstable, but that is not why you draw the picture — the picture shows you the SHAPE.",
        },
      },
      {
        id: "q82-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-box",
        prompt:
          "The box plot shows Abuja running ₦55,000 to ₦98,000 with a median of ₦62,000, and Lagos ₦38,000 to ₦56,000 with a median of ₦46,000. What does this add that a bar chart of averages could not?",
        options: [
          { id: "a", text: "Consistency — Abuja's orders are larger but far more variable, so its average is a less dependable planning number than Lagos's" },
          { id: "b", text: "Nothing; it is the same information drawn differently" },
          { id: "c", text: "It proves Abuja will keep outperforming Lagos" },
          { id: "d", text: "The total revenue per state" },
        ],
        correct: "a",
        explanation:
          "A bar chart of averages collapses each state to one number. The box shows spread, so you can see that Abuja's higher average rests on a much wider range — a difference in reliability, not just in level.",
        whyWrong: {
          b: "Spread is genuinely new information that an average destroys.",
          c: "Three Abuja orders prove nothing about the future.",
          d: "A box plot shows distribution, not totals. Lagos's total is the larger one.",
        },
      },
      {
        id: "q82-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-box",
        prompt:
          "A dot appears beyond the upper whisker of a box plot. What is it?",
        options: [
          { id: "a", text: "A value past Q3 + 1.5 × IQR — the same fence you computed in code, drawn automatically" },
          { id: "b", text: "A data entry error matplotlib has detected" },
          { id: "c", text: "The maximum value, always shown separately" },
          { id: "d", text: "A missing value" },
        ],
        correct: "a",
        explanation:
          "The box plot applies the 1.5 × IQR rule for you and draws whatever exceeds it as a point. It is the picture of the fence calculation, not a different test.",
        whyWrong: {
          b: "matplotlib is applying a statistical rule, not judging your data quality. An outlier can be entirely genuine.",
          c: "When the maximum is inside the fence, the whisker ends there with no separate dot.",
          d: "Missing values are dropped before the box is drawn; they are never plotted.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l83-uncertainty": {
    lessonId: "l83-uncertainty",
    passMark: 70,
    questions: [
      {
        id: "q83-1",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-small-n",
        prompt:
          "Kano's three orders give a mean of ₦42,333.33 with a standard deviation of ₦9,018.50. How should this go in the report?",
        options: [
          { id: "a", text: "Three Kano orders averaging about ₦42,000, with a spread too wide to draw a conclusion from — state n and round the false precision away" },
          { id: "b", text: "Kano's average order value is ₦42,333.33" },
          { id: "c", text: "Kano underperforms Lagos and should be deprioritised" },
          { id: "d", text: "Leave Kano out of the report entirely" },
        ],
        correct: "a",
        explanation:
          "The mean is arithmetically correct and statistically weak. A standard deviation of ₦9,018 on a mean of ₦42,333 is over a fifth of the value, from three points. Quoting kobo implies a precision three orders cannot support.",
        whyWrong: {
          b: "Two decimal places on a three-order average is false precision, and it hides n from the reader.",
          c: "A business decision built on three data points, with no test of whether the gap is real.",
          d: "Hiding data is not the fix. Report it with its sample size.",
        },
      },
      {
        id: "q83-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-axis-honesty",
        prompt:
          "Lagos earns ₦276,000 and Kano ₦127,000 — a ratio of 2.17. Your bar chart's y-axis starts at ₦120,000. What have you produced?",
        options: [
          { id: "a", text: "A chart where Lagos's bar dwarfs Kano's, overstating a real 2.17× difference — because on a bar chart the bar's LENGTH is the message" },
          { id: "b", text: "A clearer chart, since the differences are easier to see" },
          { id: "c", text: "The same chart; the axis label tells the reader everything" },
          { id: "d", text: "An error matplotlib will refuse to draw" },
        ],
        correct: "a",
        explanation:
          "Truncating to ₦120,000 leaves Lagos with ₦156,000 of visible bar and Kano with ₦7,000 — about 22 to 1 in drawn length for a 2.17× difference. Bar charts need set_ylim(0), every time.",
        whyWrong: {
          b: "It makes small differences look large, which is distortion rather than clarity.",
          c: "Readers compare lengths before they read axis numbers. That is why the technique works as a deception.",
          d: "matplotlib draws it without complaint. The safeguard has to be you.",
        },
      },
      {
        id: "q83-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-va-axis-honesty",
        prompt:
          "On which chart is a non-zero y-axis most defensible?",
        options: [
          { id: "a", text: "A line chart of a metric over time, where the slope carries the message — provided the axis range is labelled clearly" },
          { id: "b", text: "A bar chart comparing categories" },
          { id: "c", text: "A stacked bar chart of shares" },
          { id: "d", text: "None — every chart must start at zero" },
        ],
        correct: "a",
        explanation:
          "A line chart encodes change as slope, so zooming can reveal real movement that a zero baseline flattens. Say what the range is. Bars encode value as length, so they need zero.",
        whyWrong: {
          b: "This is the case where truncation does the most damage.",
          c: "Stacked shares must sum to a whole; a truncated baseline destroys that.",
          d: "Too strict — a line chart of a metric that varies by 2% is unreadable from zero.",
        },
      },
      {
        id: "q83-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-what-not-to-claim",
        prompt:
          "Revenue was ₦178,000 in January, ₦237,000 in February and ₦203,000 in March. Which sentence is safe?",
        options: [
          { id: "a", text: "Revenue rose to ₦237,000 in February and eased to ₦203,000 in March" },
          { id: "b", text: "Revenue will reach ₦250,000 in April" },
          { id: "c", text: "Revenue is in decline" },
          { id: "d", text: "February's campaign drove the increase" },
        ],
        correct: "a",
        explanation:
          "It says only what was measured. Three months cannot support a forecast, cannot establish a trend direction, and contain no information about what caused the February peak.",
        whyWrong: {
          b: "A forecast from three points, with no method behind it.",
          c: "One month down from a peak, with January the lowest of the three. The claim is not supported either way.",
          d: "A cause the data does not contain. If you know about a campaign, offer it as context and label it as such.",
        },
      },
      {
        id: "q83-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-va-checklist",
        prompt:
          "You have run the same eight-step analysis cycle in Excel, Power BI and pandas and reached ₦618,000 every time. What is the significance of that?",
        options: [
          { id: "a", text: "The cycle — profile, check the total, choose the statistic, apply rules, draw honestly, state n, claim only what you measured — is the transferable skill; the tools are interchangeable implementations of it" },
          { id: "b", text: "pandas is the best of the three" },
          { id: "c", text: "The other two tools were unnecessary" },
          { id: "d", text: "It only confirms the dataset was small" },
        ],
        correct: "a",
        explanation:
          "Three tools, one method, one answer. The next tool you are handed will have different syntax and the same eight steps — which is why an analyst who understands the cycle is employable beyond whatever software their employer happens to own.",
        whyWrong: {
          b: "Each fits different work: Excel for quick exploration, Power BI for shared dashboards, Python for repeatable pipelines.",
          c: "You will be asked for all three in real jobs, often on the same dataset.",
          d: "The agreement holds at any size. The point is the method, not the row count.",
        },
      },
    ],
  },
};
