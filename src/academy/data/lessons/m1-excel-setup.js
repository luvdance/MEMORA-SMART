/**
 * LESSON · GETTING EXCEL (l90-excel-setup)
 * First lesson of m1-excel-essentials, before any teaching.
 *
 * WHY THIS EXISTS AND WHY IT IS FIRST
 * The module opened with "What Excel Is Actually For" and assumed the learner
 * already had Excel. Many do not, and the ones who do not are exactly the
 * people this Academy is for. Telling someone to "open a new workbook" when
 * they have no copy of Excel and no idea that a free one exists is where the
 * course quietly loses them.
 *
 * ── FACT VERIFICATION ────────────────────────────────────────────────────
 * Checked against Microsoft's own pages on 18 September 2026, not recalled:
 *
 *   · Excel for the web is free and needs only a free Microsoft account;
 *     the free tier includes web and mobile apps plus 5 GB of OneDrive
 *     storage (microsoft.com free-office-online-for-the-web).
 *   · PivotTables CAN be created in Excel for the web — Insert > PivotTable,
 *     with the same field-pane model as desktop and no major functional
 *     limitation stated for core operations (support.microsoft.com, "Create
 *     a PivotTable to analyze worksheet data"). This matters because Month 2
 *     is built on pivots, so the free path really does carry a learner
 *     through it.
 *   · Recommended PivotTables are a Microsoft 365 subscriber feature.
 *
 * Deliberately NOT claimed: a feature-by-feature web-versus-desktop list.
 * Microsoft does not publish one that stays current, and inventing it would
 * put a learner in the position of trusting a comparison we cannot support.
 * The lesson names the two differences that actually bite on this course and
 * tells the learner how to check the rest for themselves.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s2-meeting-excel";

/** A first workbook, for the tour. Deliberately tiny and obviously ordinary. */
const FIRST_SHEET = {
  A1: "Item", B1: "Quantity", C1: "Price",
  A2: "Rice 25kg", B2: 3, C2: 34000,
  A3: "Palm oil 5L", B3: 2, C3: 8400,
  A4: "Tomato paste", B4: 6, C4: 12500,
};

export const LESSONS = [
  {
    id: "l90-excel-setup",
    moduleId: "m1-excel-essentials",
    sectionId: SECTION_ID,
    order: 1,
    title: "Getting Excel",
    subtitle: "Including the free version, which is enough for this course",
    estimatedMinutes: 14,
    intro:
      "You do not need to buy anything to do this course. Before the first lesson on what Excel is for, let us make sure you have something to open — and that you know which option you are using, because a few instructions differ.",

    atoms: [
      {
        id: "a-xlsetup-three-ways",
        title: "Three ways to get a spreadsheet, and one costs nothing",
        explain:
          "You can practise inside these lessons, use Excel for the web free in a browser, or use the desktop app you may already have through work or school. All three are real Excel. They differ in price and in a handful of features.",
        why: "A lot of people assume Excel means a paid Microsoft 365 subscription and stop there. Excel for the web is free with a Microsoft account, and it handles everything Months 1 and 2 of this course teach — including pivot tables.",
        table: {
          caption: "What each option gives you.",
          headers: ["Option", "Cost", "Needs", "Covers this course?"],
          rows: [
            ["The grid in these lessons", "Free", "Nothing", "Every exercise here — but it is a simulator, not Excel"],
            ["Excel for the web", "Free", "A free Microsoft account", "Yes, Months 1 and 2, pivot tables included"],
            ["Excel desktop", "Paid, or through work or school", "An install", "Yes, plus Power Query and macros"],
          ],
          note: "Start with the free web version if you have nothing. You will not hit a wall in this course, and you can move to desktop later without relearning anything.",
        },
        mistake:
          "Waiting to start until you can afford a Microsoft 365 subscription. The free web version is a genuine Excel, not a trial that expires.",
      },
      {
        id: "a-xlsetup-web",
        title: "Excel for the web, in four steps",
        explain:
          "A Microsoft account is free and takes a minute. Once you have one, Excel runs in your browser, saves to OneDrive automatically, and opens the same .xlsx files everyone else uses.",
        why: "Automatic saving to OneDrive is worth more than it sounds when you are learning on a shared or unreliable machine — there is no file to lose and nothing to remember to save.",
        example: `  1. Go to  office.com  and select  Sign in
  2. Create a free Microsoft account if you do not have one
  3. Choose  Excel  from the app list
  4. Select  New blank workbook

Your work saves to OneDrive as you type. The free tier includes
5 GB of storage, which is thousands of spreadsheets this size.

To open a file someone sent you: upload it to OneDrive first,
then open it from there.`,
        table: {
          caption: "The two differences that matter on this course.",
          headers: ["Difference", "Where it comes up"],
          rows: [
            ["Recommended PivotTables are for Microsoft 365 subscribers", "Month 2. Building a pivot by hand works for everyone, and this course teaches it by hand anyway — which is the more useful skill."],
            ["Power Query is a desktop feature", "Month 3 teaches it inside Power BI Desktop, which is free, so nothing is lost."],
          ],
          note: "Beyond these, assume the web version does what the lessons describe. If a menu is somewhere different, the ribbon tab names are the same, which is usually enough to find it.",
        },
      },
      {
        id: "a-xlsetup-alternatives",
        title: "If you use Google Sheets or LibreOffice instead",
        explain:
          "Both are free and both do almost everything this course teaches. The formulas are the same names with the same arguments. The differences are in a few function names, in the interface, and in what happens when you send a file to somebody using Excel.",
        why: "It is worth being honest about this rather than pretending everything is interchangeable. The concepts transfer completely — a SUMIFS is a SUMIFS everywhere — but an employer who says \"Excel\" usually means Excel, and a file that looks right in Sheets can lose formatting on the way out.",
        table: {
          caption: "What to expect from each.",
          headers: ["Tool", "Formulas from this course", "Watch out for"],
          rows: [
            ["Excel for the web", "All of them", "Nothing significant for Months 1 and 2"],
            ["Google Sheets", "Nearly all, same names", "QUERY and ARRAYFORMULA are Sheets-only; some Excel functions differ slightly"],
            ["LibreOffice Calc", "Nearly all, same names", "Uses semicolons in some locales: SUMIFS(A1:A9;B1:B9;\"Lagos\")"],
          ],
          note: "That semicolon is a real trap: in some regional settings a formula copied from a lesson will not work until the commas are changed. If a formula is rejected for no obvious reason, try semicolons.",
        },
      },
      {
        id: "a-xlsetup-simulator",
        title: "The grid in these lessons, and what it is not",
        explain:
          "Most lessons here include a working spreadsheet. You type formulas into it, they calculate, and the lesson checks your answer. Below is one — click a cell and look at the reference.",
        sheet: {
          data: FIRST_SHEET,
          rows: 6,
          cols: 3,
        },
        why: "It exists so a lesson can check whether your formula actually returns the right number, which a video cannot do. It is not a substitute for opening real Excel — and you should open real Excel alongside these lessons as soon as you have one, because part of the skill is knowing where the buttons are.",
        table: {
          caption: "Honest limits of the practice grid.",
          headers: ["It does", "It does not"],
          rows: [
            ["Real formulas, real ranges, real errors", "Charts, printing or page layout"],
            ["The fill handle, and absolute references", "Macros or VBA"],
            ["Pivot tables, as a separate simulator", "Saving a file you can send to someone"],
            ["Mark your answer and say why it is wrong", "Replace practising in the actual application"],
          ],
          note: "Use the grid to learn what a formula does; use real Excel to learn where things live. The course is built assuming you will do both.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
