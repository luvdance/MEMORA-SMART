/**
 * EXAM BANK · DOMAIN 5 — INTERPRETATION AND COMMUNICATION
 *
 * SERVER ONLY. Carries the answer key.
 *
 * The domain that decides whether a candidate can be trusted with a
 * conclusion. Every technical step in this course can be checked by someone
 * else; the claims in a write-up usually cannot, which makes this the only
 * place a candidate's judgement is actually visible.
 *
 * Most items here present a CORRECT number and ask what may be said about it.
 * The wrong options are all things a competent-but-overconfident analyst
 * writes, which is what makes them worth marking.
 */

export const ITEMS = [
  /* ── core (difficulty 3-4) ──────────────────────────────────────────── */
  {
    id: "x-d5-001",
    domain: "d5-judgement",
    difficulty: 4,
    topic: "chart-answers-question",
    skill: "Choosing a chart for the question asked",
    caseId: "adanna",
    type: "mcq",
    prompt:
      "Wholesale is 68.9% of revenue and 43.0% of margin; Online is 10.1% and 21.1%. You have one slide to answer 'which channel should we grow?'. What goes on it?",
    options: [
      { id: "a", text: "Share of revenue beside share of margin, one pair of bars per channel" },
      { id: "b", text: "Revenue by channel, since revenue is what she asked about" },
      { id: "c", text: "Margin by channel in naira" },
      { id: "d", text: "A pie of revenue share" },
    ],
    correct: "a",
    explanation:
      "The finding IS the comparison between the two shares. Revenue alone points at Wholesale, the 7.06% channel; margin in naira also points at Wholesale, which contributes the most. Only the pair shows the gap.",
  },
  {
    id: "x-d5-002",
    domain: "d5-judgement",
    difficulty: 4,
    topic: "small-n-claim",
    skill: "What a small sample supports",
    caseId: "zuri",
    type: "mcq",
    prompt:
      "Lekki's no-show rate is 40% — the worst of the three clinics — from 5 appointments. Ikeja's is 20% from 10. What may the report say?",
    options: [
      { id: "a", text: "Lekki shows the highest rate at 2 of 5 appointments, too few to conclude a real difference from Ikeja" },
      { id: "b", text: "Lekki has double Ikeja's no-show problem" },
      { id: "c", text: "Lekki is the priority for intervention" },
      { id: "d", text: "Nothing about Lekki should be reported" },
    ],
    correct: "a",
    explanation:
      "Two appointments out of five is a rate that would swing wildly with one more booking. Report it with n attached; do not build a ranking on it, and do not suppress it either.",
  },
  {
    id: "x-d5-003",
    domain: "d5-judgement",
    difficulty: 3,
    topic: "axis-truncation",
    skill: "Axis honesty",
    caseId: null,
    type: "mcq",
    prompt:
      "Two revenue figures are ₦276,000 and ₦127,000 — a ratio of 2.17. You draw a bar chart with the y-axis starting at ₦120,000. What have you produced?",
    options: [
      { id: "a", text: "A chart whose drawn bars exaggerate a real 2.17× difference into something far larger, because on a bar chart the bar's length is the message" },
      { id: "b", text: "A clearer chart, since the difference is easier to see" },
      { id: "c", text: "The same chart; the axis label tells the reader everything" },
      { id: "d", text: "An invalid chart that most tools will refuse to draw" },
    ],
    correct: "a",
    explanation:
      "Readers compare lengths before they read axis numbers, which is exactly why the technique works as a deception. Bars need a zero baseline; a line chart may sometimes be zoomed if the range is labelled.",
  },
  {
    id: "x-d5-004",
    domain: "d5-judgement",
    difficulty: 4,
    topic: "reported-average-dispute",
    skill: "Choosing the statistic to report",
    caseId: "logistics",
    type: "mcq",
    prompt:
      "Naija Logistics reports a mean delay of 1.25 days. The median delay is 0 days and one delivery ran 15 days late. The client says the reported average does not match their experience. Who is right?",
    options: [
      { id: "a", text: "Both — the mean is arithmetically correct and one extreme delivery is dragging it above what a typical delivery looks like, so the median plus the outlier named separately is the honest report" },
      { id: "b", text: "The client is wrong; the mean is the correct statistic" },
      { id: "c", text: "The company is wrong; the mean should never be used" },
      { id: "d", text: "Neither, since a 1.25-day mean and a 0-day median are consistent" },
    ],
    correct: "a",
    explanation:
      "With a skew of 3.77 the mean describes no actual delivery. Reporting the median alongside the one 15-day exception tells the client both things they need: the usual case and the failure.",
  },
  {
    id: "x-d5-005",
    domain: "d5-judgement",
    difficulty: 4,
    topic: "correlation-causation",
    skill: "Correlation is not cause",
    caseId: null,
    type: "mcq",
    prompt:
      "Units correlate with revenue at r = 0.85 and with margin at r = 0.51. Which sentence is defensible?",
    options: [
      { id: "a", text: "Volume tracks revenue closely and profit much more loosely, which is consistent with pricing that trades margin for volume — a hypothesis to test with the sales team" },
      { id: "b", text: "Selling more units causes margin to fall" },
      { id: "c", text: "Units have no relationship with margin" },
      { id: "d", text: "Increasing volume by 10% will raise margin by 5.1%" },
    ],
    correct: "a",
    explanation:
      "The gap between the two coefficients is the finding. Neither establishes cause, and option d invents a linear prediction a correlation coefficient cannot support.",
  },
  {
    id: "x-d5-006",
    domain: "d5-judgement",
    difficulty: 3,
    topic: "headline-completeness",
    skill: "An honest headline",
    caseId: null,
    type: "mcq",
    prompt:
      "Revenue came in at 104.6% of target and gross margin was 11.30%, down on prior periods. What is the honest headline?",
    options: [
      { id: "a", text: "Both figures together, because each is misleading on its own and the margin is the one in question" },
      { id: "b", text: "A strong quarter: revenue 104.6% of target" },
      { id: "c", text: "A poor quarter: margin only 11.30%" },
      { id: "d", text: "A list of every figure measured, so the reader can decide" },
    ],
    correct: "a",
    explanation:
      "Leading with the pair is also what makes the rest of the report credible: you did not select the flattering half. Option d is not a headline, it is a data dump.",
  },
  {
    id: "x-d5-007",
    domain: "d5-judgement",
    difficulty: 4,
    topic: "revenue-vs-profit-ranking",
    skill: "Ranking on the right measure",
    caseId: "solar",
    type: "mcq",
    prompt:
      "Sunbeam's SME package earns a 25.83% gross margin but 18.50% net once warranty is counted; Home earns 28.40% gross and 27.01% net. SME claims on 80% of jobs against Home's 28.6%. Which package should the company push?",
    options: [
      { id: "a", text: "Home — it keeps far more of its margin after warranty, and the gross figures the company has been using hide an eight-point gap" },
      { id: "b", text: "SME, because each job brings in ₦2.4m against ₦850,000" },
      { id: "c", text: "SME, because its gross margin is within three points of Home's" },
      { id: "d", text: "Neither can be judged without more months of data" },
    ],
    correct: "a",
    explanation:
      "Warranty is a real cost of selling SME systems and it falls on this business. Job size is turnover, not profit, and the gross comparison is precisely the figure that concealed the problem.",
  },
  {
    id: "x-d5-008",
    domain: "d5-judgement",
    difficulty: 3,
    topic: "chart-junk",
    skill: "Removing what carries no information",
    caseId: null,
    type: "mcq",
    prompt:
      "A single-series bar chart of three regions is drawn with each bar a different colour. What is the objection?",
    options: [
      { id: "a", text: "Colour is encoding nothing the axis does not already say, so the reader looks for a meaning that is not there" },
      { id: "b", text: "Nothing — more colour makes charts friendlier" },
      { id: "c", text: "It will not render correctly in print" },
      { id: "d", text: "Bar charts may only use one colour by convention" },
    ],
    correct: "a",
    explanation:
      "In one series the category is already labelled. A second encoding of the same thing adds only the question 'what does blue mean?'. One colour, or one highlight colour to call out a single bar.",
  },

  /* ── advanced (difficulty 5) ───────────────────────────────────────── */
  {
    id: "x-d5-051",
    domain: "d5-judgement",
    difficulty: 5,
    topic: "forecast-from-three-points",
    skill: "What a short series cannot support",
    caseId: null,
    type: "mcq",
    prompt:
      "Revenue ran ₦1,211,800 in July, ₦920,700 in August and ₦901,000 in September. What belongs in the report?",
    options: [
      { id: "a", text: "The three monthly figures, with an explicit note that three points cannot establish a trend" },
      { id: "b", text: "Revenue is declining and Q4 will be worse" },
      { id: "c", text: "Nothing, since three points prove nothing" },
      { id: "d", text: "A fitted trend line projecting October" },
    ],
    correct: "a",
    explanation:
      "The measurements are facts worth reporting; the trend and the forecast are inferences three points cannot carry. A line through three points fits beautifully and predicts nothing.",
  },
  {
    id: "x-d5-052",
    domain: "d5-judgement",
    difficulty: 5,
    topic: "recommendation-assumption",
    skill: "Stating the assumption in a recommendation",
    caseId: null,
    type: "mcq",
    prompt:
      "You propose a 5% price rise on a product line worth ₦808,500, adding ₦40,425 of margin and lifting the company rate from 11.30% to 12.47%. Which version of the recommendation is defensible?",
    options: [
      { id: "a", text: "The figures, stated as conditional on volume holding, with the note that this data cannot test that assumption" },
      { id: "b", text: "The figures, stated plainly, since the arithmetic is exact" },
      { id: "c", text: "Raise prices to improve margins" },
      { id: "d", text: "A 5% rise will increase profit by 12.47%" },
    ],
    correct: "a",
    explanation:
      "The arithmetic is exact and rests entirely on an assumption the data cannot test. Naming it is what makes the number usable; option d also misreads 12.47% as a change in profit rather than the new margin rate.",
  },
  {
    id: "x-d5-053",
    domain: "d5-judgement",
    difficulty: 5,
    topic: "true-chart-wrong-action",
    skill: "A correct chart that misleads",
    caseId: null,
    type: "mcq",
    prompt:
      "Which is the more dangerous deliverable: a chart with an obvious error, or a chart whose data is entirely correct but which leads the reader to the wrong decision?",
    options: [
      { id: "a", text: "The correct one — an obvious error gets caught in review, while a true chart that answers a different question than the one asked passes unchallenged" },
      { id: "b", text: "The one with the error, because errors undermine trust" },
      { id: "c", text: "They are equally dangerous" },
      { id: "d", text: "Neither, provided the underlying data is clean" },
    ],
    correct: "a",
    explanation:
      "Nothing about a revenue-by-channel chart looks wrong, which is exactly why it ships and why the meeting acts on it. This is the hardest failure mode to catch and the reason charts are chosen against the question, not the dataset.",
  },
  {
    id: "x-d5-054",
    domain: "d5-judgement",
    difficulty: 5,
    topic: "rate-count-inversion",
    skill: "Rate against count",
    caseId: "zuri",
    type: "mcq",
    prompt:
      "Ikeja has as many no-shows as Lekki in absolute terms but runs twice the appointments. Dr Balogun asks which clinic has 'the worst problem'. How do you answer?",
    options: [
      { id: "a", text: "Give both: Ikeja loses the most slots in absolute terms, Lekki has the higher rate on a small sample — the answer depends on whether he is sizing the loss or diagnosing a clinic" },
      { id: "b", text: "Lekki, because rates are the only fair comparison" },
      { id: "c", text: "Ikeja, because it loses the most appointments" },
      { id: "d", text: "They are identical, since the counts match" },
    ],
    correct: "a",
    explanation:
      "Count sizes the loss and rate diagnoses the process; a question phrased as 'the worst problem' has not said which. Answering with one number and no caveat is how an analyst gets a decision made on the wrong basis.",
  },
  {
    id: "x-d5-055",
    domain: "d5-judgement",
    difficulty: 5,
    topic: "readme-opening",
    skill: "Leading with the finding",
    caseId: null,
    type: "mcq",
    prompt:
      "Which opening line does most for you in a portfolio project's README?",
    options: [
      { id: "a", text: "The company beat its revenue target at 104.6% but earns 11.30% margin; one channel is 69% of revenue and 43% of profit. Recommendation: targeted repricing, not volume growth." },
      { id: "b", text: "This project uses pandas, Power BI and Excel to analyse sales data." },
      { id: "c", text: "A complete end-to-end data analysis project demonstrating advanced skills." },
      { id: "d", text: "Dataset: 18 rows, 7 columns. Tools: Excel, Power BI, Python." },
    ],
    correct: "a",
    explanation:
      "It leads with what you found and what you would do — the only parts a reader cannot get from anyone else's project. The tool list belongs at the bottom, and 'advanced' is a claim the reader has to take on trust.",
  },
];

export default ITEMS;
