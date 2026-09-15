/**
 * DATA ANALYSIS — BEGINNER TO PROFESSIONAL
 *
 * Course content is DATA, never markup. This object is the single source of
 * truth for every Academy surface that describes the course (landing page,
 * course page, curriculum sidebar, progress engine).
 *
 * The shape intentionally mirrors the future Firestore documents:
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          (month + order)
 *           └── sections/{sectionId}
 *                 └── lessons/{lessonId}
 *                       └── atoms/{atomId}
 *
 * So when content moves into Firestore the UI keeps rendering the same shape
 * and only the loader changes. Do not put JSX or styling concerns in here.
 */

export const DATA_ANALYSIS_COURSE = {
  id: "data-analysis",
  slug: "data-analysis",
  title: "Data Analysis",
  subtitle: "Beginner to Professional",
  tagline:
    "Master Excel, Power BI and Python with real-world projects — then get certified.",
  description:
    "A structured four-month programme that takes you from someone who has never analysed a dataset to an analyst who can clean messy data, build dashboards and defend findings to a business. No prior experience and no programming background required.",

  status: "live", // "live" | "coming-soon" | "draft"
  level: "Beginner → Professional",
  durationMonths: 4,
  hoursPerWeek: "5–7",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  // Commerce fields exist from day one so pricing can be switched on later
  // without a schema migration. Nothing here is charged yet.
  access: {
    accessType: "free", // "free" | "paid" | "subscription" | "cohort"
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "excel",
      name: "Microsoft Excel",
      short: "Excel",
      blurb: "From cell references to interactive dashboards.",
      icon: "fas fa-table-cells",
      accent: "#217346",
    },
    {
      id: "power-bi",
      name: "Power BI",
      short: "Power BI",
      blurb: "Power Query, modelling, DAX and report design.",
      icon: "fas fa-chart-column",
      accent: "#b58a00",
    },
    {
      id: "python",
      name: "Python",
      short: "Python",
      blurb: "Pandas, NumPy and visual analysis from zero code.",
      icon: "fab fa-python",
      accent: "#2f66b3",
    },
  ],

  outcomes: [
    "Clean and structure messy, real-world datasets with confidence",
    "Build pivot-driven Excel dashboards that answer business questions",
    "Model data in Power BI and write DAX measures that hold up",
    "Analyse data in Python with Pandas, starting from your first variable",
    "Turn analysis into a clear recommendation a manager can act on",
    "Ship a portfolio-ready capstone across all three tools",
  ],

  audience: [
    "Complete beginners who have never written a formula",
    "Graduates and job seekers building an analytics portfolio",
    "Professionals who live in spreadsheets and want to go further",
    "Career switchers moving into data roles",
  ],

  requirements: [
    "A laptop or desktop computer (Windows recommended for Power BI)",
    "Microsoft Excel 2016 or newer, or Microsoft 365",
    "A stable internet connection",
    "No prior programming or statistics knowledge",
  ],

  /**
   * MONTHS → MODULES.
   * `atoms` is the number of individual concepts the module breaks down into.
   * Every atom is taught, practised and assessed on its own.
   */
  months: [
    {
      month: 1,
      title: "Foundations & Excel",
      focus: "Excel",
      summary:
        "Start at absolute zero. Understand what data actually is, then learn Excel properly — interface, references, formulas and the functions analysts reach for every day.",
      modules: [
        {
          id: "m1-data-foundations",
          order: 1,
          title: "Data Analysis Foundations",
          summary:
            "What data is, why analysis matters, and how a real analysis actually runs.",
          atoms: 22,
          topics: [
            "What is data",
            "Types of data",
            "Structured vs unstructured",
            "The analysis lifecycle",
            "Analyst vs data scientist",
            "Collection, cleaning, exploration",
            "Interpretation and decision making",
          ],
        },
        {
          id: "m1-excel-essentials",
          order: 2,
          title: "Excel Essentials",
          summary:
            "The interface, workbooks, worksheets, cells and how to enter data without creating a mess.",
          atoms: 26,
          topics: [
            "Workbooks and worksheets",
            "Rows, columns, cells",
            "Cell addresses",
            "Ribbon, formula bar, name box",
            "Data entry discipline",
            "Number, date and text formats",
          ],
        },
        {
          id: "m1-formulas-functions",
          order: 3,
          title: "Formulas & Core Functions",
          summary:
            "Operators, relative vs absolute references, and the functions you will use every day.",
          atoms: 24,
          topics: [
            "Operators and order of operations",
            "Relative, absolute and mixed references",
            "SUM, AVERAGE, MIN, MAX",
            "COUNT, COUNTA, COUNTIF",
            "IF and nested logic",
            "Error handling",
          ],
        },
        {
          id: "m1-clean-structure",
          order: 4,
          title: "Sorting, Filtering & Clean Data",
          summary: "Turn a raw export into a dataset you can actually trust.",
          atoms: 25,
          topics: [
            "Sorting and multi-level sorting",
            "Filters and advanced filters",
            "Excel Tables",
            "Conditional formatting",
            "Data validation",
            "Text and date functions",
            "XLOOKUP, INDEX/MATCH",
            "Duplicates, blanks and Flash Fill",
          ],
        },
      ],
    },
    {
      month: 2,
      title: "Excel Data Analysis",
      focus: "Excel",
      summary:
        "Stop being an Excel user and start being an analyst. Explore datasets, summarise them with pivots, define KPIs and build a dashboard that answers a business question.",
      modules: [
        {
          id: "m2-exploratory",
          order: 5,
          title: "Exploratory Data Analysis",
          summary:
            "Meet a dataset for the first time and work out what it is hiding.",
          atoms: 18,
          topics: [
            "Profiling a dataset",
            "Distributions and outliers",
            "Missing values strategy",
            "Descriptive statistics",
            "Framing business questions",
          ],
        },
        {
          id: "m2-pivots",
          order: 6,
          title: "Pivot Tables & Aggregation",
          summary:
            "The highest-leverage skill in Excel, taught one atom at a time.",
          atoms: 21,
          topics: [
            "Pivot table anatomy",
            "Rows, columns, values, filters",
            "Grouping and date grouping",
            "Calculated fields",
            "Pivot charts",
            "Slicers and timelines",
          ],
        },
        {
          id: "m2-kpis-dashboards",
          order: 7,
          title: "KPIs & Dashboard Design",
          summary: "Design a dashboard someone can read in ten seconds.",
          atoms: 19,
          topics: [
            "Choosing the right KPI",
            "Layout and visual hierarchy",
            "Chart selection",
            "Interactivity",
            "Presenting findings",
          ],
        },
        {
          id: "m2-project-sales",
          order: 8,
          type: "project",
          title: "Project — Sales Performance Analysis",
          summary:
            "A deliberately messy sales dataset. Clean it, analyse it, build the dashboard, explain what you found.",
          atoms: 8,
          topics: [
            "Cleaning the raw export",
            "Building the KPI layer",
            "Pivot analysis",
            "Dashboard build",
            "Written findings",
          ],
        },
      ],
    },
    {
      month: 3,
      title: "Power BI",
      focus: "Power BI",
      summary:
        "Power BI from the very first click. Load and shape data in Power Query, build a proper model, write DAX, and tell a story with a report people will actually use.",
      modules: [
        {
          id: "m3-pbi-foundations",
          order: 9,
          title: "Power BI Foundations",
          summary:
            "What Power BI is, why it exists, and how Desktop and Service fit together.",
          atoms: 16,
          topics: [
            "Desktop vs Service",
            "Reports vs dashboards",
            "Connecting to data",
            "Excel and CSV sources",
            "The refresh model",
          ],
        },
        {
          id: "m3-power-query",
          order: 10,
          title: "Power Query & Data Preparation",
          summary:
            "Shape data once, correctly, and never clean it by hand again.",
          atoms: 24,
          topics: [
            "The query editor",
            "Data types",
            "Removing and renaming columns",
            "Split, merge and transform",
            "Duplicates and missing values",
            "Appending and combining datasets",
            "Applied steps as a recipe",
          ],
        },
        {
          id: "m3-modelling",
          order: 11,
          title: "Data Modelling & Relationships",
          summary:
            "Fact tables, dimensions and the star schema — the part most beginners skip and regret.",
          atoms: 18,
          topics: [
            "Primary and foreign keys",
            "Fact vs dimension tables",
            "Star schema",
            "Cardinality",
            "Filter direction",
            "Date tables",
          ],
        },
        {
          id: "m3-dax",
          order: 12,
          title: "DAX from Zero",
          summary:
            "Measures, context and time intelligence — built up slowly, not dumped on you.",
          atoms: 26,
          topics: [
            "Measures vs calculated columns",
            "SUM, COUNT, AVERAGE, DISTINCTCOUNT",
            "CALCULATE and FILTER",
            "Row vs filter context",
            "Variables",
            "Time intelligence",
          ],
        },
        {
          id: "m3-visualisation",
          order: 13,
          title: "Visualisation & Data Storytelling",
          summary:
            "Build a report that survives contact with a real stakeholder.",
          atoms: 20,
          topics: [
            "Choosing visuals",
            "Cards, tables and matrices",
            "Slicers and filters",
            "Drill-through and tooltips",
            "Report navigation",
            "Narrative structure",
          ],
        },
      ],
    },
    {
      month: 4,
      title: "Python & Capstone",
      focus: "Python",
      summary:
        "Your first line of code to a full Python analysis. Programming fundamentals, then Pandas, then visual analysis — and finally the capstone that pulls all three tools together.",
      modules: [
        {
          id: "m4-python-foundations",
          order: 14,
          title: "Programming Foundations with Python",
          summary:
            "Written for someone who has never programmed. Nothing is assumed.",
          atoms: 28,
          topics: [
            "What programming is",
            "Variables and data types",
            "Strings, numbers, booleans",
            "Lists, tuples, dictionaries, sets",
            "Conditions and loops",
            "Functions and return values",
            "Reading errors and debugging",
          ],
        },
        {
          id: "m4-pandas",
          order: 15,
          title: "NumPy & Pandas",
          summary:
            "DataFrames, Series, and loading real files instead of toy examples.",
          atoms: 24,
          topics: [
            "Why NumPy exists",
            "Series and DataFrames",
            "Reading CSV and Excel",
            "Inspecting a dataset",
            "Selecting and filtering",
            "Sorting and indexing",
          ],
        },
        {
          id: "m4-transform",
          order: 16,
          title: "Cleaning, Grouping & Joining",
          summary:
            "Everything you did in Excel, now in ten lines of reproducible code.",
          atoms: 22,
          topics: [
            "Missing values and duplicates",
            "Type conversion",
            "GroupBy and aggregation",
            "Merging and joining",
            "Reshaping data",
          ],
        },
        {
          id: "m4-visual-analysis",
          order: 17,
          title: "Visual & Statistical Analysis",
          summary:
            "Matplotlib and Seaborn, plus enough statistics to avoid saying something wrong.",
          atoms: 20,
          topics: [
            "Bar, line and histogram",
            "Scatter and box plots",
            "Correlation",
            "Distribution analysis",
            "Communicating uncertainty",
          ],
        },
        {
          id: "m4-capstone",
          order: 18,
          type: "capstone",
          title: "Capstone — Business Intelligence & Sales Analytics",
          summary:
            "One realistic business scenario. Excel, Power BI and Python. This is what goes in your portfolio.",
          atoms: 10,
          topics: [
            "Inspect and clean the dataset",
            "Excel analysis layer",
            "Power BI dashboard",
            "Python deep-dive",
            "KPI definition",
            "Insights and recommendations",
          ],
        },
      ],
    },
  ],

  capstone: {
    title: "Business Intelligence & Sales Analytics",
    summary:
      "A realistic company, a realistic mess of data, and a real question from a real stakeholder. You deliver the cleaned dataset, the Excel analysis, the Power BI dashboard, the Python notebook and a written recommendation.",
    deliverables: [
      "Cleaned and documented dataset",
      "Excel analysis workbook with KPIs",
      "Interactive Power BI dashboard",
      "Python analysis notebook",
      "Written insight and recommendation memo",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Data Analysis — Beginner to Professional",
    covers: "Microsoft Excel • Power BI • Python",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every required assessment at 70% or above",
      "Submit both practical projects",
      "Complete the final capstone",
    ],
  },
};

/** Rules the assessment + progression engine will enforce. */
export const ASSESSMENT_RULES = {
  defaultPassMark: 70,
  questionsPerLesson: [4, 5],
  attemptLimit: null, // null = unlimited retries
  lockNextLessonUntilPassed: true,
};

export default DATA_ANALYSIS_COURSE;
