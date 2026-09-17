/**
 * ASSESSMENTS · PROJECT — SALES PERFORMANCE ANALYSIS (m2-project-sales)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * This is the capstone check, so the questions deliberately cross module
 * boundaries: a cleaning question that only makes sense if you remember what
 * SUMIFS does, an analysis question that depends on the outlier rule, a
 * presentation question that depends on both. A learner who memorised each
 * module separately will find these harder than one who understood the cycle.
 *
 * Every figure comes from the project dataset and is verified by the validator:
 *   dirty Abuja SUMIFS 1,035,000 · true Abuja 1,097,000 · gap 62,000
 *   median 48,000 · mean 137,000 · fence 69,750 · total 1,370,000
 *   Abuja without the outlier 117,000 · Lagos 179,000
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l36-project-clean": {
    lessonId: "l36-project-clean",
    passMark: 70,
    questions: [
      {
        id: "q36-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-space-cost",
        prompt:
          "Your SUMIFS for Abuja returns ₦1,035,000, but the three Abuja orders are 62,000, 980,000 and 55,000 — ₦1,097,000. What happened?",
        options: [
          { id: "a", text: "SUMIFS has a rounding error" },
          { id: "b", text: 'One row holds " Abuja" with a leading space, so SUMIFS never matched it' },
          { id: "c", text: "One order was filtered out" },
          { id: "d", text: "SUMIFS cannot total more than two rows" },
        ],
        correct: "b",
        explanation:
          'A leading space makes " Abuja" a different string from "Abuja". SUMIFS finds no match, silently skips the row, and returns a smaller total with complete confidence. The ₦62,000 gap is exactly the skipped order.',
        whyWrong: {
          a: "These are whole naira amounts. Rounding cannot lose ₦62,000.",
          c: "Nothing was filtered — SUMIFS was given every row and rejected one because the label did not match.",
          d: "SUMIFS handles hundreds of thousands of rows. Two is not a limit.",
        },
      },
      {
        id: "q36-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-space-cost",
        prompt:
          'The export also contains "lagos" in lowercase where every other row says "Lagos". How much does that cost your SUMIFS total?',
        options: [
          { id: "a", text: "The whole row is dropped, like the leading space" },
          { id: "b", text: "Nothing — SUMIFS and COUNTIF ignore case" },
          { id: "c", text: "It halves the value" },
          { id: "d", text: "It produces a #VALUE! error" },
        ],
        correct: "b",
        explanation:
          "Case is ignored by SUMIFS, COUNTIF and their relatives, so lowercase costs you nothing. Knowing which mess is harmless matters as much as knowing which is not — it stops you spending a morning fixing something that was never broken. Use EXACT when case genuinely matters.",
        whyWrong: {
          a: "This is the trap. A leading space breaks matching; different capitalisation does not.",
          c: "Nothing halves. The row matches and contributes in full.",
          d: "No error is produced. That is rather the point — these problems are silent.",
        },
      },
      {
        id: "q36-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-text-number",
        prompt:
          "One Amount sits on the LEFT of its cell while the others sit right. What does that tell you, and which function confirms it?",
        options: [
          { id: "a", text: "It is formatted differently — check Format Cells" },
          { id: "b", text: "Excel is storing it as text rather than a number — confirm with ISNUMBER" },
          { id: "c", text: "It is negative — confirm with ABS" },
          { id: "d", text: "Nothing; alignment is cosmetic" },
        ],
        correct: "b",
        explanation:
          "Excel right-aligns numbers and left-aligns text by default, so alignment is the cell telling you what it holds. ISNUMBER asks directly and returns FALSE — which is the finding, not a failure.",
        whyWrong: {
          a: "Number formatting changes how a value displays, not which side it sits on. The alignment is reporting the underlying type.",
          c: "Negative numbers are still numbers and still sit right.",
          d: "Default alignment is precisely the opposite of cosmetic — it is the fastest type check in Excel.",
        },
      },
      {
        id: "q36-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-project-brief",
        prompt:
          "You have two hours and a broken export. Where do you start?",
        options: [
          { id: "a", text: "The pivot table — it answers the brief fastest" },
          { id: "b", text: "Profiling the data for completeness, types and impossible values" },
          { id: "c", text: "The dashboard layout, so it looks finished" },
          { id: "d", text: "Emailing sales to ask them to fix the export" },
        ],
        correct: "b",
        explanation:
          "Profiling takes minutes and everything downstream depends on it. A pivot built on this export would show Abuja at ₦1,035,000 and an average order of ₦137,000 — both wrong, both entirely believable.",
        whyWrong: {
          a: "The pivot will build happily on broken data and give you confident, wrong totals.",
          c: "A beautiful dashboard of wrong numbers is worse than no dashboard, because it gets believed.",
          d: "Cleaning the export is the job you were given, and waiting for a reply burns the two hours.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l37-project-analyse": {
    lessonId: "l37-project-analyse",
    passMark: 70,
    questions: [
      {
        id: "q37-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-outlier",
        prompt:
          "The sales rep who closed the ₦980,000 order objects to you flagging it. What is your strongest response?",
        options: [
          { id: "a", text: "It is much bigger than the others" },
          { id: "b", text: "It sits above the ₦69,750 upper fence, a threshold computed from the data before the order was examined" },
          { id: "c", text: "Outliers are always excluded" },
          { id: "d", text: "The average looks wrong with it in" },
        ],
        correct: "b",
        explanation:
          "A rule chosen in advance and applied to every order is defensible; a judgement about one order is not. The fence would have flagged any order above it, including one you liked. Note that flagging is not excluding — it means investigate.",
        whyWrong: {
          a: "True, and it is an opinion. 'Much bigger' has no threshold anyone can check.",
          c: "They are not. A verified bulk order stays in the totals and gets mentioned.",
          d: "Working backwards from the answer you wanted is exactly what the rule exists to prevent.",
        },
      },
      {
        id: "q37-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-typical",
        prompt:
          "Mean ₦137,000, median ₦48,000. The brief asks for a typical order value. What do you report?",
        options: [
          { id: "a", text: "₦137,000, the mean" },
          { id: "b", text: "₦48,000, the median, stating that one outlier inflates the mean" },
          { id: "c", text: "The midpoint of the two" },
          { id: "d", text: "Both, without comment" },
        ],
        correct: "b",
        explanation:
          "Nine of the ten orders are below ₦63,000, so ₦137,000 describes no order in the dataset. Report the median, say that you did, and give the one-line reason — all three parts matter.",
        whyWrong: {
          a: "Arithmetically the mean, and untrue of every actual order. It exists only because of ORD-1006.",
          c: "The midpoint of a mean and a median is not a statistic and has no interpretation.",
          d: "Handing over two numbers without a recommendation passes your job to the reader.",
        },
      },
      {
        id: "q37-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-pivot",
        prompt:
          "Your cleaned pivot shows a Grand Total of ₦1,370,000. Why check that number first?",
        options: [
          { id: "a", text: "It is the biggest number on screen" },
          { id: "b", text: "It should match the SUM of the cleaned Amount column — if it does not, a filter, a stale cache or a dropped row is at work" },
          { id: "c", text: "Pivots always show a Grand Total" },
          { id: "d", text: "The board asks for it" },
        ],
        correct: "b",
        explanation:
          "Matching the Grand Total against a figure you already trust rules out an active filter, a stale cache and a source range that misses rows, in one check. It is thirty seconds that validates the entire table.",
        whyWrong: {
          a: "Size is not why it matters. Its job as a cross-check is.",
          c: "True and beside the point. The question is why you read it first.",
          d: "They may not ask for it at all. You check it for yourself, before they see anything.",
        },
      },
      {
        id: "q37-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-pivot",
        prompt:
          "Abuja totals ₦1,097,000 from 3 orders; Lagos ₦179,000 from 5. Remove the ₦980,000 order and what happens?",
        options: [
          { id: "a", text: "Abuja still leads comfortably" },
          { id: "b", text: "Abuja falls to ₦117,000 — below Lagos" },
          { id: "c", text: "The two become equal" },
          { id: "d", text: "Nothing meaningful changes" },
        ],
        correct: "b",
        explanation:
          "62,000 + 55,000 = ₦117,000, against Lagos's ₦179,000. One order is the entire difference between 'Abuja is our strongest state' and 'Abuja is our smallest' — which is why the caveat belongs in the write-up.",
        whyWrong: {
          a: "The opposite: without that order Abuja is the weakest of the three by revenue.",
          c: "₦117,000 and ₦179,000 are not close. Lagos leads by more than half.",
          d: "A reversal of the headline ranking is the single most meaningful thing in the analysis.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l38-project-present": {
    lessonId: "l38-project-present",
    passMark: 70,
    questions: [
      {
        id: "q38-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-chart",
        prompt:
          "Totals by state show Abuja at six times Lagos. Median order value shows Abuja ahead by 38%. Both are accurate. Which belongs on a slide answering 'which state is strongest'?",
        options: [
          { id: "a", text: "Totals — it is the real revenue" },
          { id: "b", text: "Median order value, because the totals figure is 89% one order and would be read as regional strength" },
          { id: "c", text: "Neither; use a pie" },
          { id: "d", text: "Whichever makes the better story" },
        ],
        correct: "b",
        explanation:
          "Both are true; only one answers the question asked. The totals chart invites a conclusion the data does not support — that Abuja is six times stronger — when removing one order puts it below Lagos.",
        whyWrong: {
          a: "Real revenue, and the wrong question. Totals answer 'how much', not 'how strong'.",
          c: "A pie makes it worse: an 80% slice driven by one sale, and the two smaller states become impossible to compare.",
          d: "Choosing the flattering chart is how analysts lose their reputation, usually exactly once.",
        },
      },
      {
        id: "q38-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-project-kpi",
        prompt:
          "Revenue ₦1,370,000 against a ₦1,250,000 target. What goes on the KPI tile?",
        options: [
          { id: "a", text: "₦1,370,000" },
          { id: "b", text: "110% of target, with ₦1,370,000 of ₦1,250,000 beneath it" },
          { id: "c", text: "₦120,000 over" },
          { id: "d", text: "1.096" },
        ],
        correct: "b",
        explanation:
          "The comparison is the point. 110% is judgeable at a glance; the underlying figures beneath it let anyone who wants to check. A bare ₦1,370,000 makes the reader do the comparison from memory.",
        whyWrong: {
          a: "A bare number nobody can evaluate without knowing the target.",
          c: "Better than a bare total, but a percentage travels across differently-sized periods and an absolute gap does not.",
          d: "That is the raw ratio before formatting. Format it as a percentage; do not show the reader 1.096.",
        },
      },
      {
        id: "q38-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-findings",
        prompt:
          "Which opening sentence should your written findings use?",
        options: [
          { id: "a", text: "I cleaned the export and found six data quality problems." },
          { id: "b", text: "Revenue closed the quarter at ₦1,370,000, 10% above target." },
          { id: "c", text: "I used pivot tables and the IQR method." },
          { id: "d", text: "The dataset contained ten orders across three states." },
        ],
        correct: "b",
        explanation:
          "Lead with the finding, then the caveat, then the recommendation. The cleaning and the method are what you have ready for whoever challenges you — they are not the first thing anyone needs to hear.",
        whyWrong: {
          a: "Important work, and it belongs in the data-quality note rather than the opening line.",
          c: "Tooling. The audience cares what is true, not which features you used.",
          d: "Context, and thin context at that. It delays the answer without adding to it.",
        },
      },
      {
        id: "q38-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-project-findings",
        prompt:
          "You are ahead of target and the outlier complicates a clean headline. Should the write-up mention it?",
        options: [
          { id: "a", text: "No — the total is accurate either way" },
          { id: "b", text: "Yes, as the second sentence, with the rule that flagged it named" },
          { id: "c", text: "Only if somebody asks" },
          { id: "d", text: "Yes, but bury it in an appendix" },
        ],
        correct: "b",
        explanation:
          "Somebody will find it. Raising it yourself, with the threshold that flagged it, makes the rest of your work more credible rather than less. Omitting it means everything else you said becomes suspect the moment it surfaces.",
        whyWrong: {
          a: "The total is accurate and the impression it creates is not. Accuracy and honesty are not the same test.",
          c: "Waiting to be asked means being caught, and being caught costs far more than volunteering it.",
          d: "An appendix is where findings go to be missed. This one changes the interpretation of the headline.",
        },
      },
    ],
  },
};
