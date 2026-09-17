/**
 * ASSESSMENTS · CAPSTONE — BUSINESS INTELLIGENCE & SALES ANALYTICS (m4-capstone)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * The last assessment in the course, so almost nothing here is a syntax
 * question. Each item puts a correct number in front of the learner and asks
 * what may be concluded from it — because on this dataset the arithmetic is
 * easy and the conclusion is where people fail. Several questions offer the
 * answer a revenue-ranking analyst would give; it is always wrong.
 *
 * Every figure was produced by running these exact constants through the
 * spreadsheet, pivot, Power Query, model and DAX engines and through CPython
 * (pandas 3.0.5, matplotlib 3.11.2). All six agree:
 *   revenue ₦3,033,500 · cost ₦2,690,700 · margin ₦342,800 · 11.30% · 18 orders
 *   target ₦2,900,000 → 104.6% attainment · AOV ₦168,527.78 · 256 units
 *   Wholesale 2,090,500 / 147,500 / 7.06% / 68.9% rev / 43.0% margin / 6 orders
 *   Retail      637,100 / 122,900 / 19.29% / 21.0% / 35.9% / 7 orders
 *   Online      305,900 /  72,400 / 23.67% / 10.1% / 21.1% / 5 orders
 *   Rice 949,500/109,500/11.53% · Palm Oil 937,000/73,000/7.79%
 *   Groundnut 464,600/43,400/9.34% · Semolina 440,700/55,700/12.64%
 *   Tomato Paste 241,700/61,200/25.32%  ← last on revenue, third on margin
 *   raw export: revenue 3,178,000 · cost 2,758,700 · margin 13.19%
 *   " Wholesale" costs 346,500 · duplicate adds 100,000 · blank cost adds 44,000
 *   PQ: 20 → 19 → 18 rows · lookup mismatch strands 4 rows, ₦937,000
 *   r: units~amount 0.848 · units~margin 0.514 · amount~cost 1.0
 *   IQR fence 625,575 → no outliers · Jul/Aug/Sep 1,211,800 / 920,700 / 901,000
 *   5% rise on wholesale Palm Oil (₦808,500) = +₦40,425 → 12.47% blended
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l84-capstone-brief": {
    lessonId: "l84-capstone-brief",
    passMark: 70,
    questions: [
      {
        id: "q84-1",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-reconcile",
        prompt:
          "Your three channel subtotals are ₦1,744,000, ₦737,100 and ₦350,400 — they add to ₦2,831,500. The sheet's SUM of the Amount column is ₦3,178,000. What does the ₦346,500 gap tell you?",
        options: [
          { id: "a", text: "At least one row is not matching any of your three criteria — here a channel value with a leading space" },
          { id: "b", text: "The SUM formula is wrong" },
          { id: "c", text: "Rounding, since percentages rarely add to exactly 100" },
          { id: "d", text: "Nothing — subtotals are not expected to match a grand total" },
        ],
        correct: "a",
        explanation:
          'B4 holds " Wholesale". SUMIFS compares text exactly, so ORD-2103 matched none of the three criteria and its ₦346,500 vanished from every channel figure while staying in the grand total. That is precisely what this reconciliation is for.',
        whyWrong: {
          b: "SUM is right — it does not care about the leading space, which is why it disagrees with SUMIFS.",
          c: "These are naira totals, not rounded percentages. A ₦346,500 gap is a missing row.",
          d: "They must match. A breakdown that does not reconcile with its total has lost or double-counted rows.",
        },
      },
      {
        id: "q84-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-cost-of-dirt",
        prompt:
          "The raw export gives a margin of 13.19%. The cleaned data gives 11.30%. The MD says margins are thinning and the sales report disagrees. Who is right, and why does it matter which?",
        options: [
          { id: "a", text: "The MD — the raw figure is inflated by a duplicated order and a missing cost, and the defects happen to flatter the company" },
          { id: "b", text: "The sales report, because it uses every row in the export" },
          { id: "c", text: "Neither; a 1.89 point difference is immaterial" },
          { id: "d", text: "Impossible to say without more quarters of data" },
        ],
        correct: "a",
        explanation:
          "A blank cost makes ORD-2116 look like ₦59,200 of pure profit, and the duplicated ORD-2108 adds revenue at a healthy rate. Both push the percentage up. Dirty data that makes results look worse gets questioned; dirty data that flatters gets published.",
        whyWrong: {
          b: "Using every row is the problem when one row is a duplicate and one has no cost.",
          c: "1.89 points on an 11.30% margin is a sixth of the company's profitability, and it reverses the conclusion.",
          d: "This quarter's arithmetic settles it. The defects are identifiable and their effect is measurable.",
        },
      },
      {
        id: "q84-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-blanks",
        prompt:
          "ORD-2116 has ₦59,200 of revenue and a blank Cost. What does the blank do to your margin analysis if you leave it?",
        options: [
          { id: "a", text: "That order reads as pure profit, overstating total margin by ₦44,000 — 13% of the quarter's entire margin" },
          { id: "b", text: "The margin formula returns an error, so you will notice it" },
          { id: "c", text: "The order is excluded from the analysis automatically" },
          { id: "d", text: "Nothing, because one row out of eighteen cannot matter" },
        ],
        correct: "a",
        explanation:
          "Amount minus a blank is Amount. The order's real cost was ₦44,000, so the margin column gains ₦44,000 it never earned — on a total of ₦342,800.",
        whyWrong: {
          b: "No error appears. Excel treats the blank as zero and returns a confident, wrong number.",
          c: "Nothing excludes it. It participates in every total with an invented margin.",
          d: "₦44,000 of ₦342,800 is 13% of the profit for the quarter.",
        },
      },
      {
        id: "q84-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-reconcile",
        prompt:
          'The export contains one channel written "online" in lowercase. Which statement is correct?',
        options: [
          { id: "a", text: "It is harmless for SUMIFS and COUNTIFS, which ignore case — but it should still be standardised before it reaches a dashboard legend" },
          { id: "b", text: "It silently drops that row from every channel total, like the leading space does" },
          { id: "c", text: "It causes a type error" },
          { id: "d", text: "It must be fixed first, as the most damaging defect in the export" },
        ],
        correct: "a",
        explanation:
          'SUMIFS with "Online" matched the lowercase row and returned ₦350,400 including it. The value is still worth fixing, because Power BI will group "online" and "Online" as two separate legend entries.',
        whyWrong: {
          b: "That is what the leading space does. Case is not the same problem, and telling them apart saves you time.",
          c: "Both values are text. Nothing errors.",
          d: "The leading space and the missing cost both change numbers. This one does not.",
        },
      },
      {
        id: "q84-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-brief",
        prompt:
          "Mrs Okonkwo asks which channel to push. Which stage of your work most determines whether your answer is right?",
        options: [
          { id: "a", text: "The audit — on this export the uncleaned data overstates margin and hides the very problem she is asking about" },
          { id: "b", text: "The dashboard, since that is what she will look at" },
          { id: "c", text: "The Python notebook, because code is more rigorous than spreadsheets" },
          { id: "d", text: "The choice of chart type" },
        ],
        correct: "a",
        explanation:
          "Every later stage inherits stage one. Build the dashboard on the raw export and every tile is wrong by the same 1.89 points, with nothing on screen to say so.",
        whyWrong: {
          b: "A dashboard renders whatever it is given. It cannot detect a duplicated order.",
          c: "pandas reads a duplicate just as obediently as Excel does. Rigour is in the audit, not the language.",
          d: "Chart choice matters — lesson 88 — but a beautiful chart of wrong numbers is still wrong.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l85-capstone-excel": {
    lessonId: "l85-capstone-excel",
    passMark: 70,
    questions: [
      {
        id: "q85-1",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-channel-margin",
        prompt:
          "Wholesale: ₦2,090,500 revenue at a 7.06% margin rate. Online: ₦305,900 at 23.67%. Mrs Okonkwo asks which channel to push in Q4. What do you tell her?",
        options: [
          { id: "a", text: "Online and Retail earn more than three times Wholesale's rate per naira, so growth effort belongs there — while noting Online's rate rests on only five orders" },
          { id: "b", text: "Wholesale, because it is 68.9% of revenue and clearly what customers want" },
          { id: "c", text: "Wholesale, because it contributes the most margin in naira" },
          { id: "d", text: "Whichever grew fastest last quarter" },
        ],
        correct: "a",
        explanation:
          "Pushing a channel means adding revenue to it, so the rate matters more than the current size. Online converts ₦1 of revenue into 23.67 kobo of margin against Wholesale's 7.06 — and the caveat about five orders is part of the honest answer.",
        whyWrong: {
          b: "Size is not worth. Wholesale is 68.9% of revenue and only 43.0% of margin.",
          c: "True (₦147,500) and the wrong basis for a growth decision — it took ₦2,090,500 of revenue to earn it.",
          d: "Three months of data cannot establish a growth rate, and the question is about profitability.",
        },
      },
      {
        id: "q85-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-share-gap",
        prompt:
          "Wholesale is 68.9% of revenue and 43.0% of margin. Online is 10.1% of revenue and 21.1% of margin. What is the single most useful way to say this?",
        options: [
          { id: "a", text: "Wholesale does 69% of the work for 43% of the profit; Online does 10% of the work for 21% of it" },
          { id: "b", text: "Wholesale is the largest channel and Online the smallest" },
          { id: "c", text: "Online is twice as good as Wholesale" },
          { id: "d", text: "Wholesale's revenue share is 25.9 points higher than its margin share" },
        ],
        correct: "a",
        explanation:
          "It states both shares in one comparison and needs no explanation from the reader. A share-of-revenue against share-of-margin line is the most persuasive sentence available in a commercial analysis.",
        whyWrong: {
          b: "True and empty — it is the fact everyone already knew, and it omits the finding entirely.",
          c: '"Twice as good" is not a defined quantity. Say which measure and by how much.',
          d: "Arithmetically right, and it makes the reader work out what a point of share means. Keep it as supporting detail.",
        },
      },
      {
        id: "q85-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-kpi-layer",
        prompt:
          "Revenue came in at 104.6% of target, and gross margin was 11.30%. Which headline is honest and complete?",
        options: [
          { id: "a", text: "We beat the revenue target at 104.6% and earned 11.30% gross margin — both figures, because the second is the one that was in question" },
          { id: "b", text: "A strong quarter: revenue 104.6% of target" },
          { id: "c", text: "A poor quarter: margin only 11.30%" },
          { id: "d", text: "Revenue ₦3,033,500, cost ₦2,690,700, margin ₦342,800, AOV ₦168,527.78, 18 orders, 256 units" },
        ],
        correct: "a",
        explanation:
          "Both facts are true and each is misleading alone. Leading with the pair is also what makes the rest of the memo credible — you did not pick the flattering half.",
        whyWrong: {
          b: "Technically true and the reason nobody noticed the margin problem.",
          c: "Equally partial in the other direction, and it ignores a target that was genuinely beaten.",
          d: "Six numbers with no finding. A headline must say what happened, not list what you measured.",
        },
      },
      {
        id: "q85-4",
        type: "mcq",
        difficulty: 5,
        atomId: "a-cap-pivot-mix",
        prompt:
          "Palm Oil sells 86.3% of its revenue through Wholesale and earns a 7.79% margin rate. Tomato Paste sells none through Wholesale and earns 25.32%. What does that pairing change about your recommendation?",
        options: [
          { id: "a", text: "The product margin ranking is largely a channel ranking, so the action is about wholesale pricing rather than about which products to stock" },
          { id: "b", text: "Nothing — it confirms Palm Oil is a bad product and Tomato Paste a good one" },
          { id: "c", text: "It proves Tomato Paste would also earn 25.32% if sold through Wholesale" },
          { id: "d", text: "It means the product-level margin rates were calculated wrongly" },
        ],
        correct: "a",
        explanation:
          "Cross product against channel and the product rates line up almost exactly with how much of each product goes through Wholesale. Dropping or promoting products would be treating a symptom; the wholesale margin is the cause.",
        whyWrong: {
          b: "That reads a channel effect as a product quality. Palm Oil's rate is what wholesale pricing does to any product.",
          c: "The opposite — Tomato Paste's high rate exists partly BECAUSE it avoids Wholesale. Sold there it would likely earn wholesale margins too.",
          d: "The rates are correct and reconcile across three tools. The question is what explains them.",
        },
      },
      {
        id: "q85-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-channel-margin",
        prompt:
          "Wholesale's AOV is ₦348,417 against Online's ₦61,180 — Wholesale orders are nearly six times larger. What does that add to the analysis?",
        options: [
          { id: "a", text: "It explains the shape of the business without changing the recommendation: the big orders are the low-margin ones, so size and profitability run in opposite directions here" },
          { id: "b", text: "It shows Wholesale customers are the most valuable" },
          { id: "c", text: "It proves large orders receive discounts" },
          { id: "d", text: "Nothing — AOV is not a real KPI" },
        ],
        correct: "a",
        explanation:
          "AOV describes how each channel behaves. Here it reinforces the finding: the channel with the largest orders earns the thinnest rate, which is why order size is a poor proxy for customer value.",
        whyWrong: {
          b: "Largest orders, lowest margin rate. Value depends on which measure you mean, and this is the trap the whole capstone is built on.",
          c: "Plausible, and not established by this data. It is a hypothesis to put to Mrs Okonkwo.",
          d: "AOV is a standard KPI; it just does not answer the profitability question on its own.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l86-capstone-powerbi": {
    lessonId: "l86-capstone-powerbi",
    passMark: 70,
    questions: [
      {
        id: "q86-1",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-pq-clean",
        prompt:
          "Your Applied Steps list shows the row count going 20 → 20 → 20 → 19 → 18. What should you check before trusting the output?",
        options: [
          { id: "a", text: "That each drop is the row you intended — one duplicate and one keyless line — because a step removing rows you did not expect is how a refresh quietly loses data" },
          { id: "b", text: "Nothing; falling row counts always mean cleaning is working" },
          { id: "c", text: "That the row count reaches 20 again by the last step" },
          { id: "d", text: "Only the final count matters, not the sequence" },
        ],
        correct: "a",
        explanation:
          "The first three steps change values and no rows; the last two remove exactly one row each. Reading the count after every step is what tells you which step did what — and next quarter's export will have different data running through the same recipe.",
        whyWrong: {
          b: "A Remove Blank Rows step on the wrong column can delete good orders just as silently.",
          c: "Removing the duplicate and the keyless line is correct. 18 is the right answer.",
          d: "The sequence is the diagnosis. A final count of 18 could also come from dropping two good rows.",
        },
      },
      {
        id: "q86-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-model-orphan",
        prompt:
          'Your orders say "Palm Oil 5L"; the product catalogue says "Palm Oil 5Ltr". You join on the product name. What happens?',
        options: [
          { id: "a", text: "Four order rows worth ₦937,000 become orphans and fall out of every category total — with no error anywhere, appearing only as a (Blank) row" },
          { id: "b", text: "Power BI matches them, since the names are nearly identical" },
          { id: "c", text: "The relationship cannot be created" },
          { id: "d", text: "Only the Oils category is affected; the report total stays correct" },
        ],
        correct: "a",
        explanation:
          "Key matching is exact. Oils reads ₦464,600 instead of ₦1,401,600 and the report total falls to ₦2,096,500 — 31% of the quarter missing, announced by nothing but a (Blank) row you have to notice.",
        whyWrong: {
          b: "No fuzzy matching exists on relationships. One character is a different key.",
          c: "It is created happily, with correct one-to-many cardinality. That is what makes this dangerous.",
          d: "The report total drops by the same ₦937,000, because those rows reach no category at all.",
        },
      },
      {
        id: "q86-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-model-orphan",
        prompt:
          "You spot the (Blank) category row holding ₦937,000. What is the right fix?",
        options: [
          { id: "a", text: "Correct the spelling at the source, or add a Power Query step that maps it — so the join works on every future refresh" },
          { id: "b", text: "Filter the (Blank) row out of the visual so the report looks clean" },
          { id: "c", text: "Delete the four Palm Oil orders, since they do not match the catalogue" },
          { id: "d", text: "Switch the relationship to many-to-many" },
        ],
        correct: "a",
        explanation:
          "The orders are real and the catalogue is what is wrong. Fixing the key is the only change that makes the category totals correct — and doing it in Power Query means it survives the next refresh.",
        whyWrong: {
          b: "That hides ₦937,000 of real revenue and removes the only visible warning that the join is failing.",
          c: "Deleting ₦937,000 of genuine orders to match a typo in a lookup table.",
          d: "Many-to-many does not create matches for a key that does not exist. It just changes how filters travel.",
        },
      },
      {
        id: "q86-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-dax-measures",
        prompt:
          "Your matrix shows Margin % of 11.53%, 7.79%, 9.34%, 12.64% and 25.32% per product, and 11.30% on the Total row. A colleague says the total is wrong because those five average about 13.3%. What do you say?",
        options: [
          { id: "a", text: "The Total row is margin over revenue for the whole company, not the mean of five rates — each product's rate is weighted by very different revenue" },
          { id: "b", text: "They are right; the total should be the average of the rows" },
          { id: "c", text: "It is a rounding artefact" },
          { id: "d", text: "The measure needs ALL() adding to it" },
        ],
        correct: "a",
        explanation:
          "₦342,800 over ₦3,033,500 is 11.30%. An unweighted mean of rates gives every product equal say, so Tomato Paste's 25.32% on ₦241,700 would count as much as Palm Oil's 7.79% on ₦937,000. This is exactly why a ratio measure beats a calculated column of ratios.",
        whyWrong: {
          b: "Averaging ratios ignores the denominators. That is the classic reason a total 'looks wrong' to someone checking by eye.",
          c: "The gap is two full percentage points, not rounding.",
          d: "ALL() is for share-of-total measures. Margin % is correct as written.",
        },
      },
      {
        id: "q86-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-dax-all",
        prompt:
          "Your % of Total column reads 100% on every product row. What went wrong?",
        options: [
          { id: "a", text: "The denominator lost its ALL(), so it shrank to each row's own revenue instead of staying at ₦3,033,500" },
          { id: "b", text: "The percentage format is misconfigured" },
          { id: "c", text: "The relationship between Orders and Products is broken" },
          { id: "d", text: "DIVIDE cannot be used for shares" },
        ],
        correct: "a",
        explanation:
          "Without CALCULATE(..., ALL(Products)) the denominator is filtered by the same row context as the numerator, so every row divides a number by itself. With ALL() the shares read 31.30%, 30.89%, 7.97%, 14.53% and 15.32%.",
        whyWrong: {
          b: "The format is fine — 100% is what the arithmetic produced. Chasing the format here costs people whole afternoons.",
          c: "A broken relationship gives blanks or a repeated grand total, not a column of exact 100% values.",
          d: "DIVIDE is the right function; it also handles a zero denominator safely.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l87-capstone-python": {
    lessonId: "l87-capstone-python",
    passMark: 70,
    questions: [
      {
        id: "q87-1",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-py-corr",
        prompt:
          "Units correlate with revenue at r = 0.848 and with margin at only r = 0.514. What does that pair of numbers support?",
        options: [
          { id: "a", text: "Volume tracks revenue closely and profit much more loosely here — consistent with a pricing policy that trades margin for volume, which is a hypothesis to test rather than a conclusion" },
          { id: "b", text: "Selling more units causes margin to fall" },
          { id: "c", text: "Units have no relationship with margin" },
          { id: "d", text: "The margin column must contain an error" },
        ],
        correct: "a",
        explanation:
          "The gap between the two coefficients is the finding: volume converts to turnover much more reliably than to profit. Neither number establishes a cause, and the wholesale pricing explanation has to come from Mrs Okonkwo, not from r.",
        whyWrong: {
          b: "A causal claim from two correlations. Wholesale happens to combine high volume with low prices; the data cannot separate those.",
          c: "0.514 is a moderate positive relationship, not an absence of one.",
          d: "Margin reconciles to ₦342,800 across three tools. The coefficients are describing the business, not a bug.",
        },
      },
      {
        id: "q87-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-py-corr",
        prompt:
          "amount.corr(cost) returns exactly 1.0. What is the correct reaction?",
        options: [
          { id: "a", text: "Discard it — cost is close to a fixed multiple of amount on this data, so the coefficient describes your own columns rather than the business" },
          { id: "b", text: "Report it as the strongest relationship found" },
          { id: "c", text: "Conclude that cost drives revenue" },
          { id: "d", text: "Treat it as evidence the cost data is reliable" },
        ],
        correct: "a",
        explanation:
          "A perfect correlation nearly always means two columns carry the same information. It is the lesson-82 trap appearing in real work, and the right response is to stop rather than to publish.",
        whyWrong: {
          b: "It is a finding about arithmetic, not about Adanna Foods.",
          c: "Neither drives the other; both move with order size.",
          d: "It says nothing about accuracy. A perfectly correlated pair of wrong columns scores 1.0 too.",
        },
      },
      {
        id: "q87-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-py-reconcile",
        prompt:
          "pandas returns ₦3,033,500 and ₦342,800 — the same as your Excel sheet and your Power BI model. Why is that worth putting in the portfolio?",
        options: [
          { id: "a", text: "It shows the figures are not an artefact of one tool's defaults, and that you check your own work against something independent" },
          { id: "b", text: "It proves pandas is the most accurate of the three" },
          { id: "c", text: "It is not worth mentioning; matching numbers are expected" },
          { id: "d", text: "It demonstrates you can use three tools" },
        ],
        correct: "a",
        explanation:
          "Three independent implementations agreeing is the strongest evidence available that the analysis is right rather than merely consistent. It is also the habit that catches a mistake before a stakeholder does.",
        whyWrong: {
          b: "All three are equally correct here. That is the point.",
          c: "They are expected and frequently do not match — a sample standard deviation, a text number, or a filtered row will separate them.",
          d: "The tool list is the least interesting reading of it, and it belongs at the bottom of a README.",
        },
      },
      {
        id: "q87-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-py-scatter",
        prompt:
          "The IQR fence on order amount sits at ₦625,575 and the largest order is ₦462,000, so the rule flags no outliers. What do you do about the big wholesale orders?",
        options: [
          { id: "a", text: "Nothing — the rule says they are within range, so they are genuinely large orders and stay in every figure" },
          { id: "b", text: "Exclude ₦462,000 anyway, since it is far above the ₦92,000 median" },
          { id: "c", text: "Lower the fence until it flags them" },
          { id: "d", text: "Exclude all six Wholesale orders and analyse the other channels" },
        ],
        correct: "a",
        explanation:
          "This is the discipline the rule exists for. Unlike the Month 2 dataset, nothing here exceeds the fence — the wholesale orders are large because Wholesale is a wholesale channel, and removing them would delete the finding.",
        whyWrong: {
          b: "Distance from the median is not the test. You chose a rule; applying it only when you like the answer makes it decoration.",
          c: "Tuning a threshold until it removes the data you dislike is the definition of a rigged analysis.",
          d: "That discards 68.9% of revenue and the entire subject of the memo.",
        },
      },
      {
        id: "q87-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-py-chart",
        prompt:
          "In the paired share chart you set ax.set_ylim(0). What would ax.set_ylim(35) do?",
        options: [
          { id: "a", text: "Make the gaps look dramatic and misrepresent them, because on a bar chart the length of the bar is the message" },
          { id: "b", text: "Make the chart more readable by removing wasted space" },
          { id: "c", text: "Nothing visible, since the values are all above 35" },
          { id: "d", text: "Raise an error, as a bar chart requires a zero baseline" },
        ],
        correct: "a",
        explanation:
          "Online's 10.1% would vanish below the axis entirely, and Wholesale's 68.9% against 43.0% would look like an enormous gap. A zoomed line chart can be legitimate; a zoomed bar chart is a distortion.",
        whyWrong: {
          b: "It is the standard way to exaggerate a difference, and here it would hide a whole category.",
          c: "Two of the six bars are below 35 — Online's 10.1% and 21.1%.",
          d: "matplotlib draws it without complaint. The judgement has to be yours.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l88-capstone-deliver": {
    lessonId: "l88-capstone-deliver",
    passMark: 70,
    questions: [
      {
        id: "q88-1",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-memo",
        prompt:
          "Tomato Paste is last on revenue at ₦241,700. Mrs Okonkwo asks whether to drop it. What do you tell her?",
        options: [
          { id: "a", text: "Do not drop it — it earns ₦61,200 of margin, the third largest in the range, at the best rate at 25.32%" },
          { id: "b", text: "Drop it; it is the weakest product in the range" },
          { id: "c", text: "Drop it, and push Palm Oil instead since that is second on revenue" },
          { id: "d", text: "Cannot say without knowing the unit prices" },
        ],
        correct: "a",
        explanation:
          "Ranking on revenue puts Tomato Paste last and ranking on margin naira puts it third. Dropping it forfeits ₦61,200 of profit to shed ₦241,700 of turnover — and it is the most profitable thing per naira that Adanna Foods sells.",
        whyWrong: {
          b: "Weakest on the one measure that does not answer the question.",
          c: "The exact reversal of the right answer. Palm Oil earns 7.79% — the worst rate in the range — on ₦937,000.",
          d: "You have amount and cost per line, which is all margin requires.",
        },
      },
      {
        id: "q88-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-chart-choice",
        prompt:
          "You have one slide for \"which channel should we push?\". Which chart do you put on it?",
        options: [
          { id: "a", text: "Share of revenue beside share of margin, per channel — because the finding IS that comparison" },
          { id: "b", text: "Revenue by channel, since that is the measure she named" },
          { id: "c", text: "Margin by channel in naira" },
          { id: "d", text: "A pie of revenue share" },
        ],
        correct: "a",
        explanation:
          "Wholesale's revenue bar towers over its margin bar and Online's does the opposite. No other arrangement of these numbers makes the recommendation visible without a paragraph of explanation.",
        whyWrong: {
          b: "Correct data that recommends the opposite action — Wholesale's bar is three times the next one. This is the most dangerous chart in the set.",
          c: "Better, and still points at Wholesale, which contributes the most margin in naira. The finding needs margin set against the revenue it took.",
          d: "One measure as angles for three categories, showing only the half that misleads.",
        },
      },
      {
        id: "q88-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-memo",
        prompt:
          "Wholesale Palm Oil took ₦808,500 of revenue at about 6.5%. Your memo proposes a 5% price rise. Which version of the recommendation is defensible?",
        options: [
          { id: "a", text: "A 5% rise, if volume holds, adds ₦40,425 of margin and lifts the company rate from 11.30% to 12.47% — stating that the volume assumption is untested" },
          { id: "b", text: "A 5% rise will add ₦40,425 of margin and lift the rate to 12.47%" },
          { id: "c", text: "Raise wholesale prices to improve margins" },
          { id: "d", text: "A 5% rise will increase profit by 12.47%" },
        ],
        correct: "a",
        explanation:
          "The arithmetic is exact and rests entirely on an assumption the data cannot test — whether wholesale buyers accept the price. Naming the assumption is what makes the number usable rather than a hostage.",
        whyWrong: {
          b: "Same figures, no assumption stated. If volume drops 10% the recommendation reverses and you own the forecast.",
          c: "No figure, no magnitude, no product. Nobody can act on it or check it.",
          d: "A misreading of the numbers: 12.47% is the new blended margin rate, not a percentage increase in profit.",
        },
      },
      {
        id: "q88-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-cap-limits",
        prompt:
          "Revenue fell from ₦1,211,800 in July to ₦920,700 in August to ₦901,000 in September. What belongs in the memo?",
        options: [
          { id: "a", text: "The three monthly figures, with an explicit note that three months cannot establish a trend" },
          { id: "b", text: "Revenue is in decline and Q4 will be worse" },
          { id: "c", text: "Nothing, since three points prove nothing" },
          { id: "d", text: "A fitted trend line projecting October" },
        ],
        correct: "a",
        explanation:
          "The figures are facts and the trend is an inference three points cannot support. Reporting the numbers with the limit stated gives the reader everything you know and nothing you do not.",
        whyWrong: {
          b: "Two claims the data cannot carry — a direction from three points and a forecast from none.",
          c: "The measurements are worth reporting. It is the conclusion that has to be withheld.",
          d: "A line through three points will fit beautifully and predict nothing.",
        },
      },
      {
        id: "q88-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cap-portfolio",
        prompt:
          "Which README opening does most for you with a hiring manager?",
        options: [
          { id: "a", text: "\"The company beat its revenue target at 104.6% and earns 11.30% margin; Wholesale is 68.9% of revenue and 43.0% of margin. Recommendation: targeted repricing, not volume growth.\"" },
          { id: "b", text: "\"This project uses pandas, Power BI and Excel to analyse sales data.\"" },
          { id: "c", text: "\"A complete end-to-end data analysis project demonstrating advanced skills.\"" },
          { id: "d", text: "\"Dataset: 18 rows, 7 columns, Jul-Sep. Tools: Excel, Power BI, Python.\"" },
        ],
        correct: "a",
        explanation:
          "It opens with what you found and what you would do about it — the two things only you can supply. The tool list still belongs in the README, at the bottom, where it is a detail rather than the pitch.",
        whyWrong: {
          b: "Every applicant's README says this. It distinguishes you from nobody.",
          c: "Adjectives with no content. \"Advanced\" is a claim the reader has to take on trust.",
          d: "Accurate metadata, and it leads with the least impressive fact about the project — that the dataset is small.",
        },
      },
    ],
  },
};
