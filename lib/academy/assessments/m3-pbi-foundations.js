/**
 * ASSESSMENTS · POWER BI FOUNDATIONS (m3-pbi-foundations)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * The setup questions are deliberately practical. A learner who can recite
 * "Power BI Desktop is free" but does not know a Gmail address is refused by
 * the Service will lose an evening to it. These questions test the things that
 * actually block people.
 *
 * Every setup fact was checked against Microsoft's documentation:
 *   desktop-get-the-desktop · service-self-service-signup-for-power-bi
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l39-what-is-power-bi": {
    lessonId: "l39-what-is-power-bi",
    passMark: 70,
    questions: [
      {
        id: "q39-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-excel-vs-pbi",
        prompt:
          "Your manager asks a one-off question about last month's orders and needs the answer in twenty minutes. Excel or Power BI?",
        options: [
          { id: "a", text: "Power BI — it is the more professional tool" },
          { id: "b", text: "Excel — for a single question, answering it is faster than modelling it" },
          { id: "c", text: "Power BI, so the answer can be refreshed later" },
          { id: "d", text: "Either; they take the same time" },
        ],
        correct: "b",
        explanation:
          "Power BI's advantage is repetition — refresh instead of rebuild. For a question asked once, the modelling time is pure overhead and Excel answers it sooner.",
        whyWrong: {
          a: "Professionalism is choosing the tool that fits the job, not the newest one on the list.",
          c: "Nobody has asked for a refresh. Building for a requirement that does not exist is how twenty minutes becomes an afternoon.",
          d: "They do not. Power BI needs data loaded, cleaned and modelled before it answers anything.",
        },
      },
      {
        id: "q39-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-what-pbi-is",
        prompt:
          "Which statement about cost is accurate?",
        options: [
          { id: "a", text: "Power BI costs money to install" },
          { id: "b", text: "Power BI Desktop is free; sharing through the Service is the part that needs a licence" },
          { id: "c", text: "Everything about Power BI is free" },
          { id: "d", text: "Desktop is free for 30 days" },
        ],
        correct: "b",
        explanation:
          "Desktop is free with no time limit and no sign-in. The Service has a free tier for your own workspace, and sharing with others requires Pro or PPU. Both 'it is free' and 'it costs money' are true of different products.",
        whyWrong: {
          a: "Desktop costs nothing to download, install or use.",
          c: "Sharing a report with colleagues requires a paid per-user licence.",
          d: "There is no trial clock on Desktop. It is free permanently.",
        },
      },
      {
        id: "q39-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-excel-vs-pbi",
        prompt:
          "Which of these is the strongest single reason to move a working Excel report into Power BI?",
        options: [
          { id: "a", text: "The charts look better" },
          { id: "b", text: "It is rebuilt by hand every month and sent to forty people" },
          { id: "c", text: "Power BI is newer" },
          { id: "d", text: "The file is 2 MB" },
        ],
        correct: "b",
        explanation:
          "Repetition plus a wide audience is exactly the case Power BI is built for: the rebuild becomes a Refresh, and forty emailed copies become one published report.",
        whyWrong: {
          a: "Appearance is the weakest of the reasons, and Excel charts can be made to look good too.",
          c: "Newness is not a benefit. Migrating a working model for its own sake costs a day and returns nothing.",
          d: "2 MB is tiny. Size only argues for Power BI past Excel's million-row limit.",
        },
      },
      {
        id: "q39-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-honest-limits",
        prompt:
          "Does moving your analysis into Power BI make the numbers more trustworthy?",
        options: [
          { id: "a", text: "Yes — it is an enterprise tool with validation built in" },
          { id: "b", text: "No — it will chart a misleading average just as willingly as Excel did, and look more convincing doing it" },
          { id: "c", text: "Yes, because it refuses to load bad data" },
          { id: "d", text: "Only if you publish it" },
        ],
        correct: "b",
        explanation:
          "The tool got faster; the responsibility did not move. A polished Power BI report of a mean that describes no customer is more dangerous than the same error in Excel, precisely because it looks finished.",
        whyWrong: {
          a: "There is no validation that knows which statistic your question needed. That judgement is still yours.",
          c: "It loads whatever you point it at, including a column of numbers stored as text.",
          d: "Publishing changes who can see it, not whether it is right.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l40-install-power-bi": {
    lessonId: "l40-install-power-bi",
    passMark: 70,
    questions: [
      {
        id: "q40-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pbi-account",
        prompt:
          "You only have a Gmail address. What can you NOT do?",
        options: [
          { id: "a", text: "Install Power BI Desktop" },
          { id: "b", text: "Build reports, models and DAX measures" },
          { id: "c", text: "Sign up for the Power BI Service and publish" },
          { id: "d", text: "Save and reopen .pbix files" },
        ],
        correct: "c",
        explanation:
          "Microsoft documents that Service sign-up requires a work or school account and refuses consumer addresses such as Gmail or Hotmail. Everything in Desktop — install, build, model, DAX, save — works signed out, so only publishing is blocked.",
        whyWrong: {
          a: "Desktop installs without any account at all.",
          b: "All of that happens locally in Desktop, no sign-in required.",
          d: "A .pbix is an ordinary file on your machine.",
        },
      },
      {
        id: "q40-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-requirements",
        prompt:
          "Your laptop screen is 1366x768. What does Microsoft's documentation say about that?",
        options: [
          { id: "a", text: "It is fine — Power BI adapts to any resolution" },
          { id: "b", text: "It is below the supported minimum, and some dialogs render off-screen where you cannot click them" },
          { id: "c", text: "Power BI will refuse to install" },
          { id: "d", text: "Only the Service is affected" },
        ],
        correct: "b",
        explanation:
          "The documented minimum is 1440x900 or 1600x900. Below that, Microsoft states some controls display beyond the screen — including ones needed to close the startup screens. An external monitor is the cheapest fix.",
        whyWrong: {
          a: "It does not adapt below the minimum; that is what makes this a documented limitation rather than a preference.",
          c: "It installs. The problem appears afterwards, when a dialog you must click is off-screen.",
          d: "The Service runs in a browser. This is a Desktop limitation.",
        },
      },
      {
        id: "q40-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pbi-download",
        prompt:
          "You are on a work laptop without administrator rights. Which install route works?",
        options: [
          { id: "a", text: "The direct .exe from the Download Center" },
          { id: "b", text: "The Microsoft Store version, which does not require admin rights" },
          { id: "c", text: "Neither — you need IT to install it" },
          { id: "d", text: "Either; admin rights are never needed" },
        ],
        correct: "b",
        explanation:
          "Microsoft lists 'admin privilege isn't required' as one of the Store version's advantages, while the direct executable must be run by an administrator. The Store version also updates itself, which matters because only the latest version is supported.",
        whyWrong: {
          a: "The .exe installation requires administrator rights to complete.",
          c: "The Store route is specifically designed for this situation.",
          d: "The .exe route does require them. That is the difference between the two.",
        },
      },
      {
        id: "q40-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-no-windows",
        prompt:
          "A classmate on a MacBook asks how to install the Mac version. What do you tell them?",
        options: [
          { id: "a", text: "Download it from the Mac App Store" },
          { id: "b", text: "There is no Mac version — they need a Windows VM, a cloud Windows desktop, or another machine" },
          { id: "c", text: "Use Power BI Desktop in a browser instead" },
          { id: "d", text: "Install the Linux version" },
        ],
        correct: "b",
        explanation:
          "Power BI Desktop is Windows-only and always has been. The realistic routes are a virtual machine, a cloud Windows desktop or a borrowed PC — and keeping .pbix files in cloud storage, since they will be moving between machines.",
        whyWrong: {
          a: "It is not published for macOS in any store.",
          c: "The Service runs in a browser but does not let you build models and reports the way Desktop does; it is not a substitute for this course.",
          d: "No Linux build exists either.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l41-the-interface": {
    lessonId: "l41-the-interface",
    passMark: 70,
    questions: [
      {
        id: "q41-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pbi-three-views",
        prompt:
          "You need to join two tables. Which view?",
        options: [
          { id: "a", text: "Report view" },
          { id: "b", text: "Table view" },
          { id: "c", text: "Model view" },
          { id: "d", text: "Any of them" },
        ],
        correct: "c",
        explanation:
          "Model view shows tables as boxes and lets you drag a line between them to create a relationship. Most 'I cannot find it' problems in Power BI are really 'I am on the wrong view', and nothing tells you that.",
        whyWrong: {
          a: "Report view is the visual canvas. Relationships cannot be created there.",
          b: "Table view shows one table's rows. It is where you check a load, not where you join.",
          d: "Each view does different things, which is the point of having three.",
        },
      },
      {
        id: "q41-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-field-wells",
        prompt:
          "In Power BI, which field well does the same job as a pivot table's Columns area?",
        options: [
          { id: "a", text: "X-axis" },
          { id: "b", text: "Legend" },
          { id: "c", text: "Values" },
          { id: "d", text: "Filters" },
        ],
        correct: "b",
        explanation:
          "Legend splits each bar or line into a series, which is exactly what Columns does to a pivot table. X-axis corresponds to Rows, Values to Values, Filters to Filters. The names changed; the four ideas did not.",
        whyWrong: {
          a: "X-axis is the equivalent of Rows — the category you break down by.",
          c: "Values is the equivalent of Values; it aggregates the measure.",
          d: "Filters is the equivalent of Filters; it restricts before aggregation.",
        },
      },
      {
        id: "q41-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-pbix",
        prompt:
          "Why is emailing someone a .pbix file a data-protection risk?",
        options: [
          { id: "a", text: "The file might be corrupted in transit" },
          { id: "b", text: "A .pbix contains a compressed copy of every loaded row, so you have sent the underlying data too" },
          { id: "c", text: "It contains your password" },
          { id: "d", text: "It is too large for email" },
        ],
        correct: "b",
        explanation:
          "A .pbix is not a link to a source; it holds the queries, the model, the report AND a copy of the data. Sending one hands over every row, which matters when the rows are customer records. Publishing shares the report without the file.",
        whyWrong: {
          a: "Corruption is a general file risk and not a privacy issue.",
          c: "Credentials are not stored in the file in retrievable form. The data is the exposure.",
          d: "Size is an inconvenience, not a data-protection problem.",
        },
      },
      {
        id: "q41-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pbi-panes",
        prompt:
          "A learner complains that the options in the Visualizations pane 'keep changing on their own'. What is happening?",
        options: [
          { id: "a", text: "Power BI is updating in the background" },
          { id: "b", text: "The panes are contextual — they describe whatever visual is currently selected" },
          { id: "c", text: "The file is corrupted" },
          { id: "d", text: "They are in the wrong view" },
        ],
        correct: "b",
        explanation:
          "The panes describe the current selection. Select a bar chart and you see its wells; select a card and you see different ones. Clicking empty canvas deselects everything and returns the report-level options.",
        whyWrong: {
          a: "Updates do not change panes mid-session.",
          c: "This is normal, designed behaviour.",
          d: "It happens within Report view, which is the correct view for building visuals.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l42-first-report": {
    lessonId: "l42-first-report",
    passMark: 70,
    questions: [
      {
        id: "q42-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-check-it",
        prompt:
          "Your new visual shows 'Count of Amount' rather than a total. What does that mean here?",
        options: [
          { id: "a", text: "Power BI chose a random default" },
          { id: "b", text: "The Amount column did not load as fully numeric, so Power BI defaulted to Count" },
          { id: "c", text: "The visual type is wrong" },
          { id: "d", text: "You need to refresh" },
        ],
        correct: "b",
        explanation:
          "Exactly as in a pivot table, Sum is the default for a fully numeric field and Count for anything else. Seeing Count is Power BI reporting a data-type problem. The fix is in Power Query, which is the next module.",
        whyWrong: {
          a: "The default is derived from the column's type, not chosen at random.",
          c: "The visual is fine. The field's data type is the problem.",
          d: "Refreshing reloads the same text values and produces the same Count.",
        },
      },
      {
        id: "q42-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pbi-get-data",
        prompt:
          "In the Navigator you can see both a worksheet and a formatted Table containing your data. Which should you tick?",
        options: [
          { id: "a", text: "The worksheet — it has everything" },
          { id: "b", text: "The Table, because its boundaries and headers are explicit" },
          { id: "c", text: "Both, to be safe" },
          { id: "d", text: "Neither; import the whole file" },
        ],
        correct: "b",
        explanation:
          "A Table declares exactly where the data starts and what the headers are. Importing the worksheet makes Power BI guess, which is how a title row ends up as your column names.",
        whyWrong: {
          a: "It also has whatever else is on that sheet, including stray cells above and beside the data.",
          c: "You would load the same data twice, and then have to work out which copy your visuals used.",
          d: "There is no such option, and it would import every sheet including unrelated ones.",
        },
      },
      {
        id: "q42-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pbi-check-it",
        prompt:
          "Your first visual renders beautifully. What has that proved about the data?",
        options: [
          { id: "a", text: "That it loaded correctly" },
          { id: "b", text: "Nothing — it proves only that the field wells are valid" },
          { id: "c", text: "That the totals are right" },
          { id: "d", text: "That the relationships are correct" },
        ],
        correct: "b",
        explanation:
          "A chart drawing successfully says the fields are of a type the visual accepts. It says nothing about whether rows were dropped, a filter is applied, or a column is text. Check the row count and the total against something you already trust.",
        whyWrong: {
          a: "A partial load renders just as prettily as a complete one.",
          c: "Totals can be wrong for half a dozen reasons that do not stop a chart rendering.",
          d: "A wrong relationship produces a perfectly drawn, wrong chart — which is the most dangerous kind.",
        },
      },
      {
        id: "q42-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pbi-save-publish",
        prompt:
          "You have no work or school account. Can you still complete this course and show your work?",
        options: [
          { id: "a", text: "No — publishing is required" },
          { id: "b", text: "Yes — build and save .pbix files, and use the file plus screenshots as your portfolio" },
          { id: "c", text: "Only if you buy a Pro licence" },
          { id: "d", text: "Only by using Excel instead" },
        ],
        correct: "b",
        explanation:
          "Everything taught in Month 3 happens in Desktop, offline. Publishing is the one optional step. A .pbix file and a screenshot demonstrate the same skill to an employer as a shared link does.",
        whyWrong: {
          a: "Publishing is a distribution step, not a building step. Nothing in the curriculum depends on it.",
          c: "A Pro licence still requires a work or school account first, and you do not need either to learn.",
          d: "Power BI Desktop works fully without an account, so there is no reason to fall back to Excel.",
        },
      },
    ],
  },
};
