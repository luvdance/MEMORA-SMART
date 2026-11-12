/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 5 · OFFICE APPLICATIONS
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l29-word-docs", [
    q({
      id: "va-q29-01", atom: "a-va-word", d: 2,
      prompt: "Which Word feature records every edit so it can be accepted or rejected?",
      options: ["Track Changes", "Styles", "Page Number", "Table of Contents"],
      correct: "a",
      explanation: "Review > Track Changes shows each edit for approval.",
      wrong: { b: "Styles format text.", c: "Numbers pages.", d: "Lists headings." },
    }),
    q({
      id: "va-q29-02", atom: "a-va-word", d: 2,
      prompt: "What should the executive summary of a report contain?",
      options: ["The conclusion and key recommendations in a few sentences", "The full data tables", "The author's biography", "A list of every source"],
      correct: "a",
      explanation: "Busy readers may read only the summary.",
      wrong: { b: "Those belong in findings or appendices.", c: "Not relevant.", d: "Belongs at the end if needed." },
    }),
    q({
      id: "va-q29-03", atom: "a-va-gdocs", d: 2,
      prompt: "In Google Docs, how do you assign a comment to a colleague?",
      options: ["@mention them in the comment", "Make the text red", "Email them the document", "Type their name in bold"],
      correct: "a",
      explanation: "An @mention notifies them and can assign the task.",
      wrong: { b: "Nobody is notified.", c: "Creates copies.", d: "Nobody is notified." },
    }),
    q({
      id: "va-q29-04", atom: "a-va-gdocs", d: 2,
      prompt: "Which Google Docs feature restores an earlier version of a document?",
      options: ["Version history", "Suggesting mode", "Word count", "Explore"],
      correct: "a",
      explanation: "File > Version history lists and restores versions.",
      wrong: { b: "Shows suggestions, not old versions.", c: "Counts words.", d: "A research tool." },
    }),
  ]),

  ...check("va-l30-sheets-basics", [
    q({
      id: "va-q30-01", atom: "a-va-sheet-basics", d: 1,
      prompt: "What does D2:D8 mean?",
      options: ["The cells from D2 down to D8", "Only cells D2 and D8", "Row 2 to row 8 in every column", "Divide D2 by D8"],
      correct: "a",
      explanation: "A colon makes a range.",
      wrong: { b: "That would be D2,D8.", c: "No; one column.", d: "Division uses /." },
    }),
    q({
      id: "va-q30-02", atom: "a-va-sort-filter", d: 2,
      prompt: "Why must you sort the whole table, not just one column?",
      options: ["Otherwise the rows are scrambled and values no longer match their records", "Sorting one column is slower", "It changes the font", "Sheets does not allow it"],
      correct: "a",
      explanation: "Each row is one record; keep it together.",
      wrong: { b: "Speed is not the issue.", c: "No.", d: "It allows it, which is the danger." },
    }),
    q({
      id: "va-q30-03", atom: "a-va-sheet-format", d: 2,
      prompt: "Which feature makes staff choose the same category names?",
      options: ["A data validation drop-down", "Conditional formatting", "Freeze panes", "Bold text"],
      correct: "a",
      explanation: "Drop-downs prevent \"travel\", \"Travel\" and \"trvl\".",
      wrong: { b: "Colours cells; does not control entry.", c: "Keeps headers visible.", d: "Formatting only." },
    }),
    q({
      id: "va-q30-04", atom: "a-va-sort-filter", d: 2,
      prompt: "In a shared Google Sheet, how do you filter without changing what others see?",
      options: ["Use a filter view", "Delete the rows you don't need", "Hide columns for everyone", "Make a copy and email it"],
      correct: "a",
      explanation: "Filter views are personal.",
      wrong: { b: "Destroys data.", c: "Affects everyone.", d: "Creates versions." },
    }),
  ]),

  ...check("va-l31-formulas", [
    q({
      id: "va-q31-01", atom: "a-va-formula-basics", d: 1,
      prompt: "What must every formula start with?",
      options: ["=", "+", "#", "@"],
      correct: "a",
      explanation: "The equals sign tells the spreadsheet to calculate.",
      wrong: { b: "Not standard.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q31-02", atom: "a-va-formula-basics", d: 2,
      prompt: "What does =2+3*4 return?",
      options: ["14", "20", "24", "9"],
      correct: "a",
      explanation: "Multiplication comes first: 3×4 = 12, plus 2.",
      wrong: { b: "That needs brackets: =(2+3)*4.", c: "Arithmetic error.", d: "Arithmetic error." },
    }),
    q({
      id: "va-q31-03", atom: "a-va-if", d: 2,
      prompt: "=IF(D3>50000,\"Needs approval\",\"OK\") with D3 = 7,800 returns…",
      options: ["OK", "Needs approval", "7800", "An error"],
      correct: "a",
      explanation: "The test is false, so the third argument is returned.",
      wrong: { b: "Only when D3 is over 50,000.", c: "IF returns one of its values.", d: "The formula is valid." },
    }),
    q({
      id: "va-q31-04", atom: "a-va-sumif", d: 3,
      prompt: "Which formula totals the Meals amounts in D2:D8, with categories in C2:C8?",
      options: ["=SUMIF(C2:C8,\"Meals\",D2:D8)", "=SUM(\"Meals\")", "=COUNTIF(C2:C8,\"Meals\")", "=SUMIF(D2:D8,\"Meals\",C2:C8)"],
      correct: "a",
      explanation: "Range to check, criterion, range to add.",
      wrong: { b: "Not valid.", c: "Counts rows, does not add amounts.", d: "The ranges are swapped." },
    }),
    q({
      id: "va-q31-05", atom: "a-va-average", d: 2,
      prompt: "What does =ROUND(AVERAGE(D2:D8),0) do?",
      options: ["Gives the average rounded to whole numbers", "Counts the cells", "Rounds every cell permanently", "Finds the largest value"],
      correct: "a",
      explanation: "ROUND with 0 decimal places around the average.",
      wrong: { b: "That is COUNT.", c: "It only affects this result.", d: "That is MAX." },
    }),
  ]),

  ...check("va-l32-slides", [
    q({
      id: "va-q32-01", atom: "a-va-slide-design", d: 2,
      prompt: "Which slide title is best?",
      options: ["Spending rose 20% in two months", "Spending", "Slide 2", "Some numbers"],
      correct: "a",
      explanation: "A title that states the point.",
      wrong: { b: "A topic, not a point.", c: "Meaningless.", d: "Vague." },
    }),
    q({
      id: "va-q32-02", atom: "a-va-slide-design", d: 2,
      prompt: "Where should the detail of a slide go?",
      options: ["In the speaker notes and the speaker's words", "In small text at the bottom of the slide", "In a second identical slide", "Nowhere"],
      correct: "a",
      explanation: "Slides support the speaker; notes hold the detail.",
      wrong: { b: "Unreadable.", c: "Repetitive.", d: "The speaker still needs it." },
    }),
    q({
      id: "va-q32-03", atom: "a-va-slide-tools", d: 2,
      prompt: "Where do you set the fonts, colours and logo once for every slide?",
      options: ["The slide master (or theme builder)", "On each slide individually", "In speaker notes", "In the file name"],
      correct: "a",
      explanation: "The master applies to all slides.",
      wrong: { b: "Slow and inconsistent.", c: "Notes are not formatting.", d: "No." },
    }),
    q({
      id: "va-q32-04", atom: "a-va-slide-tools", d: 2,
      prompt: "A 6-minute talk needs roughly how many slides?",
      options: ["Six to eight", "One", "Thirty", "Fifty"],
      correct: "a",
      explanation: "About one slide per minute.",
      wrong: { b: "Too few to structure the talk.", c: "Too many.", d: "Far too many." },
    }),
  ]),

  ...check("va-l33-pdf-collab", [
    q({
      id: "va-q33-01", atom: "a-va-pdf", d: 1,
      prompt: "Why send final documents as PDF?",
      options: ["The layout stays identical on every device and is hard to edit by accident", "PDFs are always smaller than Word files", "PDFs cannot be printed", "Email requires PDF"],
      correct: "a",
      explanation: "PDF preserves layout.",
      wrong: { b: "Not always.", c: "They print well.", d: "No such requirement." },
    }),
    q({
      id: "va-q33-02", atom: "a-va-pdf", d: 2,
      prompt: "Two people in different cities must sign a contract. What do you use?",
      options: ["An e-signature service such as DocuSign or Acrobat Sign", "Print, sign, scan and post", "Type their names in Word", "A screenshot of their signatures"],
      correct: "a",
      explanation: "E-signature tools record who signed and when.",
      wrong: { b: "Slow and unnecessary.", c: "Not a verified signature.", d: "Insecure and unverifiable." },
    }),
    q({
      id: "va-q33-03", atom: "a-va-pdf", d: 2,
      prompt: "You need to merge confidential payslips into one PDF. What should you avoid?",
      options: ["Uploading them to a free online converter without the client's agreement", "Using Adobe Acrobat on your work computer", "Naming the file with the convention", "Saving it in the client's drive"],
      correct: "a",
      explanation: "Confidential files should not go to third-party free websites.",
      wrong: { b: "A desktop tool is the right choice.", c: "Good practice.", d: "Correct place." },
    }),
    q({
      id: "va-q33-04", atom: "a-va-collab", d: 2,
      prompt: "What is a \"single source of truth\" in a document workflow?",
      options: ["One shared file everyone works on, instead of emailed copies", "The most senior person's opinion", "A printed master copy", "The first draft"],
      correct: "a",
      explanation: "One file prevents version confusion.",
      wrong: { b: "Not the meaning.", c: "Not shared.", d: "Drafts change." },
    }),
    q({
      id: "va-q33-05", atom: "a-va-collab", d: 2,
      prompt: "When should you resolve a comment in a shared document?",
      options: ["When the point it raised has been dealt with", "Immediately, to tidy the page", "Never", "Only at the end of the year"],
      correct: "a",
      explanation: "Resolved comments show what has been done.",
      wrong: { b: "Hides open questions.", c: "Clutters the document.", d: "Too late." },
    }),
  ]),

  ...check("va-l34-practical", [
    q({
      id: "va-q34-01", atom: "a-va-m5-expense", d: 2,
      prompt: "Why point at F2 in =SUMIF(C2:C8,F2,D2:D8) instead of typing \"Office\"?",
      options: ["The same formula works for every category typed in column F", "Typing text is not allowed", "It makes the total larger", "It formats the cell"],
      correct: "a",
      explanation: "Referencing the criterion cell makes the formula reusable.",
      wrong: { b: "Text criteria are allowed.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q34-02", atom: "a-va-m5-pack", d: 2,
      prompt: "Diesel spending fell from ₦4.8 million to ₦1.1 million. What is the monthly saving?",
      options: ["₦3.7 million", "₦5.9 million", "₦1.1 million", "₦4.8 million"],
      correct: "a",
      explanation: "4.8 − 1.1 = 3.7 million.",
      wrong: { b: "That adds them.", c: "That is the new spending.", d: "That is the old spending." },
    }),
    q({
      id: "va-q34-03", atom: "a-va-m5-pack", d: 2,
      prompt: "What should the last slide of a client review deck usually show?",
      options: ["Next steps or the decision needed", "A thank-you clip art", "The full data table", "Your phone wallpaper"],
      correct: "a",
      explanation: "End on what happens next.",
      wrong: { b: "Adds nothing.", c: "Too detailed for the end.", d: "No." },
    }),
    q({
      id: "va-q34-04", atom: "a-va-m5-pack", d: 2,
      prompt: "How should issues be reported to a client in an update?",
      options: ["Honestly, each with the fix and its current status", "Left out so the update looks good", "Blamed on the client", "Hidden in an appendix"],
      correct: "a",
      explanation: "Honest reporting with fixes builds trust.",
      wrong: { b: "Clients find out and stop trusting you.", c: "Unprofessional.", d: "Evasive." },
    }),
  ]),
};

export default ASSESSMENTS;
