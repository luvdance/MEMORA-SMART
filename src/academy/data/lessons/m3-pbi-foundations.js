/**
 * MODULE · POWER BI FOUNDATIONS (m3-pbi-foundations)
 * Month 3 — Power BI
 *
 * The first module of Month 3, and the one that has to get a learner from
 * "I have heard of Power BI" to "it is installed and I have built a report".
 *
 * WHY SETUP GETS A WHOLE LESSON
 * Every other Power BI course starts at the interface and assumes the software
 * is running. For a self-funded learner on a personal laptop that assumption
 * breaks three times: Power BI Desktop is Windows-only, it refuses to run
 * properly below 1440x900 — which is above the resolution of a great many
 * budget laptops — and the Power BI SERVICE will not accept a Gmail address.
 * A learner who hits any of those with no warning concludes the course is
 * broken and leaves. So they are taught up front, with the workaround.
 *
 * SOURCES — every setup fact here was checked against Microsoft's own
 * documentation rather than written from memory:
 *   learn.microsoft.com/power-bi/fundamentals/desktop-get-the-desktop
 *   learn.microsoft.com/power-bi/fundamentals/service-self-service-signup-for-power-bi
 * Those pages change. The atoms deliberately avoid quoting version numbers or
 * prices, and point at aka.ms links that Microsoft maintains.
 *
 * WHAT CARRIES OVER FROM MONTH 2
 * Power BI's field wells ARE the pivot table's four areas under new names, so
 * the same simulator is reused with Power BI labels. A learner who can build a
 * pivot can already build a Power BI visual, and being told that explicitly
 * saves them believing they are starting from zero.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s9-pbi-foundations";

/** The Month 2 sales data, reused so nothing new has to be learned to read it. */
const SALES = {
  headers: ["Order", "Month", "State", "Category", "Amount"],
  rows: [
    ["ORD-1", "Jan", "Lagos", "Electronics", 45000],
    ["ORD-2", "Jan", "Abuja", "Groceries", 62000],
    ["ORD-3", "Jan", "Lagos", "Groceries", 38000],
    ["ORD-4", "Feb", "Kano", "Electronics", 51000],
    ["ORD-5", "Feb", "Lagos", "Electronics", 47000],
    ["ORD-6", "Feb", "Abuja", "Fashion", 98000],
    ["ORD-7", "Mar", "Kano", "Groceries", 43000],
    ["ORD-8", "Mar", "Lagos", "Fashion", 56000],
    ["ORD-9", "Mar", "Abuja", "Electronics", 55000],
    ["ORD-10", "Mar", "Lagos", "Groceries", 49000],
    ["ORD-11", "Jan", "Kano", "Fashion", 33000],
    ["ORD-12", "Feb", "Lagos", "Groceries", 41000],
  ],
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l39-what-is-power-bi",
    moduleId: "m3-pbi-foundations",
    sectionId: SECTION_ID,
    order: 2,
    title: "What Power BI Is, and When to Use It",
    subtitle: "And when Excel is still the better answer",
    estimatedMinutes: 14,
    intro:
      "You have spent two months becoming genuinely capable in Excel. Power BI is not a replacement for that — it is what you reach for when the thing you built in Excel has to be refreshed every week, shared with forty people, and still be fast at a million rows.",

    atoms: [
      {
        id: "a-what-pbi-is",
        title: "Power BI is three products with one name",
        explain:
          "Power BI Desktop is a free Windows application where you build. The Power BI Service is a website where you publish and share. Power BI Mobile is the phone app for reading. Most of your work happens in Desktop.",
        why: "People get stuck early because they read 'Power BI is free' and 'Power BI needs a paid licence' and assume one is wrong. Both are true of different products: Desktop is free forever, and sharing through the Service is the part that needs a licence.",
        table: {
          caption: "The three pieces, and who needs which.",
          headers: ["Product", "What it is", "Cost", "You need it"],
          rows: [
            ["Desktop", "Windows app where reports are built", "Free", "For everything in this course"],
            ["Service", "Website at app.powerbi.com for sharing", "Free tier, paid to share", "Only when publishing"],
            ["Mobile", "Phone and tablet app for viewing", "Free", "Optional"],
          ],
          note: "The whole of this module and the next three can be completed in Desktop alone, at no cost. Publishing is the last step, and it is optional.",
        },
      },
      {
        id: "a-excel-vs-pbi",
        title: "When Excel is still the right tool",
        explain:
          "Excel is better for building something once, for ad-hoc calculation, and for anything you hand over as a file someone will edit. Power BI is better for anything repeated on a schedule, shared widely, or larger than Excel comfortably holds.",
        why: "Choosing Power BI for a one-off analysis costs you an afternoon of modelling for a result Excel would have given you in twenty minutes. Choosing Excel for a weekly report costs you that twenty minutes every week forever, plus the errors that creep in each time.",
        table: {
          caption: "A decision you should be able to make in ten seconds.",
          headers: ["The work is…", "Use", "Why"],
          rows: [
            ["A one-off question", "Excel", "Faster to answer than to model"],
            ["A weekly or monthly report", "Power BI", "Refresh replaces rebuilding"],
            ["Shared with 40 people", "Power BI", "One source, not 40 emailed copies"],
            ["Over a million rows", "Power BI", "Excel's sheet limit is 1,048,576 rows"],
            ["Data from 5 systems joined", "Power BI", "Power Query and the model do this natively"],
            ["A file someone must edit", "Excel", "Power BI reports are read, not edited"],
          ],
          note: "The last row is the one people forget. A Power BI report is not a spreadsheet — a reader consumes it, they do not type into it.",
        },
        mistake:
          "Rebuilding a working Excel model in Power BI because Power BI is newer. If nobody is asking for a refresh, a wider audience or more rows, you have spent a day to arrive back where you started.",
      },
      {
        id: "a-pbi-workflow",
        title: "The workflow, and why it matches what you already do",
        explain:
          "Get data, clean it in Power Query, model it by joining tables, calculate with DAX, visualise it, publish. Five of those six steps are things you did in Month 2 under different names.",
        why: "Power BI looks intimidating because it names everything differently. It is the same cycle you already ran on the sales project: profile and clean, then summarise, then present. Recognising that is worth more than any single feature.",
        table: {
          caption: "The same job, two toolsets.",
          headers: ["Step", "In Excel you used", "In Power BI you use"],
          rows: [
            ["Clean", "TRIM, Remove Duplicates, manual fixes", "Power Query — recorded and repeatable"],
            ["Join tables", "VLOOKUP / XLOOKUP", "Relationships in the Model view"],
            ["Calculate", "SUMIFS, AVERAGEIFS", "DAX measures"],
            ["Summarise", "Pivot tables", "Visuals with field wells"],
            ["Present", "Charts on a dashboard sheet", "Report pages with slicers"],
            ["Update", "Paste new data, rebuild", "Click Refresh"],
          ],
          note: "The last row is the entire argument for Power BI. Everything above it is done once; the refresh is done forever.",
        },
      },
      {
        id: "a-pbi-honest-limits",
        title: "What Power BI will not do for you",
        explain:
          "It will not clean data you have not told it how to clean, it will not fix a broken data model, and it will not make a badly chosen KPI meaningful. Every judgement you learned in Month 2 still applies.",
        why: "Power BI makes it dramatically faster to produce a confident, wrong dashboard. The tool got faster; the responsibility did not move. The profiling habits from lesson 21 matter more here, not less, because the output looks so much more finished.",
        mistake:
          "Assuming that because Power BI is a professional tool, its output is automatically trustworthy. It will happily chart an average of ₦137,000 that describes no customer in your dataset, exactly as Excel did.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l40-install-power-bi",
    moduleId: "m3-pbi-foundations",
    sectionId: SECTION_ID,
    order: 1,
    title: "Download, Install and Sign In",
    subtitle: "Including the three things that stop people before they start",
    estimatedMinutes: 18,
    intro:
      "Get this lesson right and the rest of Month 3 is straightforward. There are three specific obstacles — the operating system, the screen resolution and the email address — and each has a workaround. Read all four atoms before you download anything.",

    atoms: [
      {
        id: "a-pbi-requirements",
        title: "Check these BEFORE you download",
        explain:
          "Power BI Desktop runs on Windows 10 or later, needs .NET 4.7.2 or later, a 64-bit processor, at least 2 GB of free RAM, and a screen of at least 1440x900. There is no macOS or Linux version.",
        why: "The resolution requirement catches more learners than anything else. A very common budget laptop screen is 1366x768, which is BELOW the supported minimum — Microsoft documents that some dialogs render off-screen at lower resolutions, including the ones you need to dismiss the startup screen.",
        table: {
          caption: "Minimum requirements, from Microsoft's documentation.",
          headers: ["Requirement", "Minimum", "Notes"],
          rows: [
            ["Operating system", "Windows 10 or Windows Server 2016+", "No Mac or Linux version exists"],
            ["Processor", "64-bit", "The 32-bit version is no longer supported"],
            ["RAM", "2 GB free", "4 GB or more recommended"],
            [".NET", "4.7.2 or later", "Usually already present on Windows 10+"],
            ["Screen", "1440x900 or 1600x900", "1366x768 is BELOW the minimum"],
            ["Display scaling", "100%", "Above 100% can hide dialogs you must click"],
            ["Browser", "Microsoft Edge", "Internet Explorer is not supported"],
          ],
          note: "If your display scaling is above 100%, set it back: Settings → System → Display. Dialogs rendering off-screen is the documented symptom.",
        },
        mistake:
          "Downloading first and checking later. If you are on a Mac or a 1366x768 screen, the next atom's workarounds will save you an hour of confusion.",
      },
      {
        id: "a-pbi-no-windows",
        title: "If you do not have Windows — or have a small screen",
        explain:
          "There is no Mac build and there never has been. The realistic options are a Windows virtual machine, a cloud Windows desktop, or a borrowed machine. For a screen below 1440x900, an external monitor is the cheapest fix.",
        why: "This is a real barrier and pretending otherwise wastes your time. It is better to know on day one that you need a plan, than to discover it after three failed installs and conclude you are doing something wrong.",
        table: {
          caption: "Workarounds, roughly cheapest first.",
          headers: ["Situation", "Option", "Reality check"],
          rows: [
            ["Mac, occasional use", "A cloud Windows desktop, hourly", "Cheap per session, needs steady internet"],
            ["Mac, regular use", "Parallels or similar, plus a Windows licence", "Works well, costs real money"],
            ["Mac with Apple silicon", "Windows on ARM in a VM", "Supported, but check the current update level"],
            ["Screen under 1440x900", "Any external monitor", "The single cheapest fix on this list"],
            ["No Windows machine at all", "A friend's PC, a cybercafé, or a campus lab", "Save the .pbix file to cloud storage as you go"],
          ],
          note: "Whatever you choose, keep your .pbix files in OneDrive, Google Drive or Dropbox. You will be moving between machines more than you expect.",
        },
      },
      {
        id: "a-pbi-download",
        title: "Two ways to install it, and which to choose",
        explain:
          "Install from the Microsoft Store, or download the .exe from Microsoft's Download Center. Both give you the same latest version. The Store version updates itself and does not need administrator rights.",
        why: "Choose the Store version unless something prevents it. Power BI Desktop updates monthly and only the latest version is supported — so an install that updates itself is one less thing that quietly rots. The .exe requires admin rights, which a shared or work laptop may not give you.",
        table: {
          caption: "Microsoft Store against the direct download.",
          headers: ["", "Microsoft Store", "Direct .exe"],
          rows: [
            ["Updates", "Automatic, in the background", "You reinstall manually each month"],
            ["Admin rights needed", "No", "Yes"],
            ["Download size", "Smaller — only what changed", "Full installer every time"],
            ["Where", "aka.ms/pbidesktopstore", "Microsoft Download Center"],
            ["Choose it when", "Almost always", "Store is blocked, or you need a specific version"],
          ],
          note: "Do not install both. Microsoft does not support the Store version and the older installer side by side — uninstall one before installing the other.",
        },
        example:
          "Install from the Store:\n  1. Open aka.ms/pbidesktopstore in a browser\n  2. Select Install\n  3. Launch Power BI Desktop from the Start menu\n\nCheck what you have:\n  Help ribbon  →  About  →  read the Version line\n\nNote: only the latest version is supported, and a file saved\nin a newer version cannot be opened by an older one.",
      },
      {
        id: "a-pbi-account",
        title: "The Gmail problem — and why it does not block this course",
        explain:
          "Power BI Desktop is free and does NOT require you to sign in. You can build every report in this course without an account. The Power BI Service is different: signing up for it requires a work or school email address, and consumer addresses such as Gmail or Hotmail are refused.",
        why: "This stops a great many independent learners dead, because almost everyone learning on their own has a Gmail address. The important and reassuring fact is that it blocks only publishing. Everything you are about to learn — Power Query, the model, DAX, visuals — happens in Desktop, offline, signed out.",
        table: {
          caption: "What you can do with which account.",
          headers: ["Task", "No account", "Gmail", "Work / school account"],
          rows: [
            ["Install Power BI Desktop", "Yes", "Yes", "Yes"],
            ["Build reports, models, DAX", "Yes", "Yes", "Yes"],
            ["Save and open .pbix files", "Yes", "Yes", "Yes"],
            ["Sign in to the Service", "No", "No", "Yes"],
            ["Publish and share a report", "No", "No", "Yes, with a Pro licence"],
          ],
          note: "Read the middle column carefully: a Gmail address gives you everything except publishing. Do not let it stop you starting.",
        },
        example:
          "If you later need the Service:\n\n  Option 1  Use a work or school address if you have one\n  Option 2  A Microsoft 365 trial creates a work address for you\n            (an onmicrosoft.com account, and a new tenant)\n            — a credit card is required, so cancel before 30 days\n            if you are not continuing\n  Option 3  Skip it. Your portfolio can be .pbix files and\n            screenshots, which is what most employers ask to see anyway.",
        mistake:
          "Spending a week trying to force a Gmail address through the Service sign-up. It is documented as unsupported. Build in Desktop and come back to publishing when you have a work account.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l41-the-interface",
    moduleId: "m3-pbi-foundations",
    sectionId: SECTION_ID,
    order: 3,
    title: "Finding Your Way Around",
    subtitle: "Three views, four panes, one file",
    estimatedMinutes: 15,
    intro:
      "Power BI Desktop looks crowded on first launch. It is actually three screens wearing one window, and knowing which one you are on explains most of what is confusing about it.",

    atoms: [
      {
        id: "a-pbi-three-views",
        title: "The three views down the left edge",
        explain:
          "Report view is where you build visuals. Table view shows the data as rows, like a spreadsheet. Model view shows your tables as boxes with lines joining them. The icons sit on the far left and you will switch between them constantly.",
        why: "Almost every 'I cannot find it' question is really 'I am on the wrong view'. You cannot create a relationship in Report view and you cannot place a chart in Model view, and neither tells you that is the problem.",
        table: {
          caption: "What each view is for.",
          headers: ["View", "Shows", "You go there to"],
          rows: [
            ["Report", "A blank canvas and your visuals", "Build charts, slicers and pages"],
            ["Table", "One table's rows and columns", "Check the data actually loaded correctly"],
            ["Model", "Tables as boxes, joined by lines", "Create and fix relationships"],
          ],
          note: "Visit Table view immediately after every data load. It is the Power BI equivalent of the profiling habit from lesson 21, and it catches the same class of problem.",
        },
      },
      {
        id: "a-pbi-panes",
        title: "The panes on the right",
        explain:
          "The Data pane lists your tables and fields. The Visualizations pane holds the chart types and the field wells. The Filters pane controls what each visual, page or report shows. Select a visual and all three change to describe it.",
        why: "The panes are contextual — they describe whatever is currently selected. Learners report that the options 'keep changing'; they are not changing, you are selecting different things. Click an empty part of the canvas to deselect and see the report-level options again.",
        table: {
          caption: "The right-hand panes.",
          headers: ["Pane", "Holds", "Equivalent in Excel"],
          rows: [
            ["Data", "Your tables and their fields", "The PivotTable Field List"],
            ["Visualizations", "Chart types, then the field wells", "The chart gallery plus the pivot areas"],
            ["Filters", "Filters for visual, page and report", "Slicers and the Filters area"],
            ["Format (paint roller)", "Colours, labels, titles", "Format Chart Area"],
          ],
        },
      },
      {
        id: "a-pbi-field-wells",
        title: "Field wells are pivot areas with new names",
        explain:
          "Drop a field into X-axis and it becomes the category. Drop a measure into Values and it gets aggregated. Drop a field into Legend and each bar splits into a series. You already know this — it is Rows, Values and Columns from the pivot module.",
        why: "This is the single biggest head start you have. Two months of pivot tables means you already understand the hardest conceptual part of Power BI visuals. The names changed; the idea did not.",
        pivotExercise: {
          source: SALES,
          wells: "powerbi",
          task:
            "This is the Power BI field well layout — the same simulator you used for pivots, relabelled. Put State on the X-axis and Amount in Values, summarised by Sum, to build the visual Power BI would draw.",
          expect: { row: "State", value: "Amount", agg: "sum" },
          successMessage:
            "Lagos ₦276,000, Abuja ₦215,000, Kano ₦127,000. In Power BI that same arrangement draws a bar chart instead of a table — but the thinking, and the field wells, are identical to the pivot you built in Month 2.",
        },
        table: {
          caption: "The same four wells, two products.",
          headers: ["Excel pivot area", "Power BI well", "Effect"],
          rows: [
            ["Rows", "X-axis (or Y-axis on a bar)", "The category broken down by"],
            ["Columns", "Legend", "Splits each bar into a series"],
            ["Values", "Values", "The number, aggregated"],
            ["Filters", "Filters", "Restricts before aggregation"],
          ],
          note: "Power BI defaults to Sum for a numeric field and Count for text, exactly as a pivot does — and 'Count of Amount' means the same thing here as it did there.",
        },
      },
      {
        id: "a-pbi-pbix",
        title: "The .pbix file, and what is inside it",
        explain:
          "Everything lives in one .pbix file: the queries, the data model, a compressed copy of the data itself, and the report pages. That is why the file is large and why emailing it sends the data too.",
        why: "People expect a .pbix to behave like an .xlsx that links to a source. It does not — it contains a loaded copy of the data. Send someone a .pbix and you have sent them every row, which matters when the rows are customer records.",
        table: {
          caption: "What is in the file.",
          headers: ["Part", "What it holds"],
          rows: [
            ["Queries", "The Power Query steps that load and clean"],
            ["Model", "Tables, relationships and DAX measures"],
            ["Data", "A compressed copy of every loaded row"],
            ["Report", "Pages, visuals and formatting"],
          ],
          note: "Save early and save often, and keep the file in cloud storage. A .pbix has no autosave of the kind Excel has.",
        },
        mistake:
          "Emailing a .pbix to share a report. You have sent the underlying data as well, usually to someone who was never meant to see the row level. Publishing to the Service shares the report without handing over the file.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l42-first-report",
    moduleId: "m3-pbi-foundations",
    sectionId: SECTION_ID,
    order: 4,
    title: "Your First Report",
    subtitle: "Load, visualise, check, save",
    estimatedMinutes: 16,
    intro:
      "Time to build something. Four steps, and the third one is the step most people skip and later regret.",

    atoms: [
      {
        id: "a-pbi-get-data",
        title: "Step 1 — Get data",
        explain:
          "Home ribbon → Get data. Pick Excel workbook for a spreadsheet, Text/CSV for an export. Power BI shows a Navigator listing the sheets and tables it found, and you tick what you want.",
        why: "The Navigator distinguishes a formatted Table from a plain worksheet, and you should always choose the Table where one exists. A worksheet import guesses at where your data starts and often drags in a title row as a header.",
        example:
          "Home  →  Get data  →  Excel workbook\n  →  choose the file\n  →  in the Navigator, tick the TABLE (not the sheet) if one exists\n  →  Transform Data   to clean first   (recommended)\n      or Load           to import as-is\n\nChoose Transform Data if you are unsure. You can always click\nClose & Apply without changing anything.",
        mistake:
          "Clicking Load without looking at the preview. Thirty seconds in the Navigator saves you reloading the whole thing after you notice the header row is wrong.",
      },
      {
        id: "a-pbi-first-visual",
        title: "Step 2 — Build a visual",
        explain:
          "In Report view, click a chart type in the Visualizations pane, then drag fields from the Data pane into the wells. Or tick two fields and let Power BI choose a visual for you, then change it.",
        why: "Ticking fields is faster while exploring, and dragging into named wells is how you get exactly what you intended. Use ticking to look around, then switch to dragging when you know what you want.",
        charts: [
          {
            type: "bar",
            title: "What Power BI draws from State on the axis and Sum of Amount in Values",
            categories: ["Lagos", "Abuja", "Kano"],
            series: [{ name: "Revenue", values: [276000, 215000, 127000] }],
            valuePrefix: "₦",
            caption:
              "The same three numbers your Month 2 pivot produced. Power BI sorts by value by default, which a pivot does not — a small difference worth knowing before you wonder why the order changed.",
          },
        ],
        table: {
          caption: "Two ways to build the same visual.",
          headers: ["Method", "Good for", "Risk"],
          rows: [
            ["Tick the fields", "Exploring quickly", "Power BI guesses the visual and the wells"],
            ["Drag into wells", "Building deliberately", "None — you said exactly what you meant"],
          ],
        },
      },
      {
        id: "a-pbi-check-it",
        title: "Step 3 — Check it before you believe it",
        explain:
          "Go to Table view and confirm the rows loaded. Check the total against a figure you already trust. Read the Values well and confirm it says Sum where you meant Sum, not Count.",
        why: "This is the profiling habit from lesson 21 and the pivot checklist from Month 2, applied to a new tool. Power BI's output looks more finished than Excel's, which makes an unchecked error more convincing, not less.",
        table: {
          caption: "The same checks, in Power BI's language.",
          headers: ["Check", "Where", "Catches"],
          rows: [
            ["Row count matches the source", "Table view", "A failed or partial load"],
            ["Total matches a trusted figure", "A card visual or the Values well", "Filters, wrong join, dropped rows"],
            ["Values says Sum, not Count", "Visualizations pane", "A numeric column loaded as text"],
            ["No unexpected blanks", "Table view, or the column profile", "Missing data you have not noticed"],
          ],
          note: "'Count of Amount' in Power BI means exactly what it meant in a pivot: the column is not fully numeric. Fix it in Power Query, which is the next module.",
        },
        mistake:
          "Trusting the visual because it rendered. A chart drawing successfully proves the field wells are valid, and nothing at all about whether the data is right.",
      },
      {
        id: "a-pbi-save-publish",
        title: "Step 4 — Save, and optionally publish",
        explain:
          "File → Save saves the .pbix to your machine. Home → Publish uploads it to the Service, which requires a signed-in work or school account. Saving locally is enough for everything in this course.",
        why: "Treat publishing as optional. Your .pbix file is the deliverable for this course and, for most junior roles, a perfectly good portfolio piece — a screenshot plus the file demonstrates the same skill as a shared link.",
        table: {
          caption: "Save against publish.",
          headers: ["", "Save (.pbix)", "Publish"],
          rows: [
            ["Needs an account", "No", "Yes — work or school"],
            ["Needs a licence to share", "No", "Yes — Pro or PPU"],
            ["Others can view it", "Only by opening the file", "Yes, in a browser"],
            ["Good enough for this course", "Yes", "Not required"],
          ],
          note: "If you have no work account, save the file and take a screenshot of the report. That is a portfolio piece.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
