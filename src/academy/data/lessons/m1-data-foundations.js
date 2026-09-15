/**
 * MODULE 1 · DATA ANALYSIS FOUNDATIONS
 * Section 1 — "What Is Data Analysis, Really?"
 *
 * Authored from the Memora Smart Technologies course material
 * "Phase 0 · Week 1 — What Is Data Analysis, Really?"
 *
 * The source document is four pages read in one sitting. Here it is split into
 * FOUR short lessons of 3 to 6 atoms each, so a learner gets four completion
 * moments instead of one long read. Same material, same voice, same Nigerian
 * examples, re-cut for the lesson player.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. It ships in the browser bundle.
 * Assessment questions and their answers live in lib/academy/assessments/
 * and are graded on the server, so correct answers are never downloadable.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ATOM SHAPE
 *   id        stable key. Progress records reference this, never the index
 *   title     the concept, named as a learner would say it
 *   explain   the plain explanation (required)
 *   why       why it matters, the "so what"
 *   analogy   a real-world comparison
 *   example   a short worked example, rendered as preformatted text
 *   table     structured data rendered as a real <table>. Use this instead of
 *             drawing columns with spaces. Shape:
 *               { caption?, headers: [], rows: [[]], variant?, note? }
 *             variant "spreadsheet" adds A/B/C column letters and row numbers
 *   mistake   the error most beginners make here
 *   practice  a question the learner answers in their head before moving on
 *
 * HOUSE STYLE: write in plain sentences. Avoid dashes as connectors; use a
 * full stop and start a new sentence instead. Short sentences read better on a
 * phone, which is where most of this will be read.
 */

export const SECTION_ID = "s1-what-is-data-analysis";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l1-you-already-do-this",
    moduleId: "m1-data-foundations",
    sectionId: SECTION_ID,
    order: 1,
    title: "What Data Analysis Really Is",
    subtitle: "Before we ever open Excel",
    estimatedMinutes: 8,
    intro:
      "Before you open a single spreadsheet, it is worth understanding what you are actually doing when you analyse data. Not the textbook definition, but the real thing. Once this clicks, Excel, Power BI and Python stop feeling like three separate subjects and start feeling like three tools for the same job.",

    atoms: [
      {
        id: "a-you-already-do-this",
        title: "You already do this",
        explain:
          "Imagine a neighbour who runs a small provisions store. Every evening she writes in a notebook what she sold, how much of it, and at what price. Rice, garri, milk, biscuits, quantities and prices, day after day.",
        why: "Data analysis is not a new skill you have to install in your brain. It is something you and everyone around you already do informally. This course only makes it faster, more accurate, and possible on records far bigger than one notebook.",
        mistake:
          "Assuming analysis requires software. It does not. The notebook came first and the software came later.",
      },
      {
        id: "a-what-data-is",
        title: "What data actually is",
        explain:
          "That notebook is data. Just numbers and words on paper. On its own it tells her nothing. It is simply a record.",
        why: "Most people assume that having data is the valuable part. It is not. A notebook nobody reads is worth nothing. Value only appears at the next step.",
        example:
          "One line in her notebook reads: 500, Rice, Tuesday, ₦1,200.\nIt is true. It is recorded. And it says nothing about what she should do tomorrow.",
        mistake:
          "Believing that collecting more data automatically produces more insight. A bigger notebook is still just a notebook.",
      },
      {
        id: "a-the-question-turns-it",
        title: "The question is what turns data into analysis",
        explain:
          "Three months later she flips through the notebook and starts asking questions. Which product do I sell the most of? Are my Fridays always busier than my Mondays? Am I making more profit on milk or on rice? Should I stock more biscuits before December?",
        why: "The moment she asks a question and goes back to the notebook for the answer, she is doing data analysis. Nobody taught her Excel. That is the whole job, and everything else in this course is a faster way of doing it.",
        analogy:
          "A dictionary contains every answer you will ever need and stays useless until you have a word you want to look up. The question comes first.",
        practice: {
          prompt:
            "Her notebook has not changed in three months. So what changed the moment she started flipping through it?",
          answer:
            "She brought a question to it. The record was always there. The question is what turned a record into an answer.",
        },
      },
      {
        id: "a-data-vs-information",
        title: "Data vs information",
        explain:
          "Data is the raw material. A line like \"500, Rice, Tuesday, ₦1,200\" means very little on its own. Information is that same data organised and interpreted so that it says something useful, such as \"rice sales spike every Tuesday because that is market day.\"",
        why: "Data analysis is the bridge between the two. It takes a pile of raw facts and turns them into something a person can act on. Every technique in this course sits somewhere on that bridge.",
        table: {
          caption: "The same Tuesday, described two ways.",
          headers: ["", "What it says", "Can you act on it?"],
          rows: [
            ["Data", "500, Rice, Tuesday, ₦1,200", "No"],
            [
              "Information",
              "Rice moves fastest on Tuesdays because it is market day",
              "Yes. Stock it on Monday night",
            ],
          ],
        },
        mistake:
          "Presenting data and calling it information. A screenshot of a spreadsheet is not an insight, because nobody can act on it.",
        practice: {
          prompt:
            "\"Ajah deliveries averaged 47 minutes in June.\" Is that data or information?",
          answer:
            "Data. It is organised, but nobody has interpreted it yet. It becomes information once you add what it means, for example that Ajah is the slowest area by 40% and also the one with the lowest ratings.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l2-not-all-data-looks-the-same",
    moduleId: "m1-data-foundations",
    sectionId: SECTION_ID,
    order: 2,
    title: "Not All Data Looks the Same",
    subtitle: "Three shapes you will meet constantly",
    estimatedMinutes: 6,
    intro:
      "A few terms you will hear constantly, grounded in everyday examples. Knowing which shape you are holding tells you immediately how much cleaning work is ahead of you.",

    atoms: [
      {
        id: "a-structured-data",
        title: "Structured data",
        explain:
          "Data neatly organised into rows and columns. A bank transaction log is a good example: date, amount, sender, receiver. Every row has the same fields in the same order.",
        why: "This is what Excel and Power BI are built for, which is why this course starts here. Structured data is the easiest to work with and the most common in business.",
        table: {
          caption: "A bank transaction log. Every row carries the same four fields.",
          headers: ["Date", "Amount", "Sender", "Receiver"],
          rows: [
            ["03/06", "₦12,000", "Adaeze", "Chuka"],
            ["03/06", "₦2,500", "Bola", "Adaeze"],
            ["04/06", "₦7,400", "Chuka", "Ngozi"],
          ],
        },
      },
      {
        id: "a-unstructured-data",
        title: "Unstructured data",
        explain:
          "Messy data with no fixed shape. Customer complaint emails, WhatsApp chats, product reviews on Jumia. There are no columns to line up.",
        why: "It usually needs serious cleaning before it can be analysed at all. It also tends to hold the answers structured data cannot give you, such as why a customer left.",
        mistake:
          "Trying to force unstructured data into a spreadsheet before deciding what you actually want out of it. Decide the question first, then extract only the fields that answer it.",
      },
      {
        id: "a-semi-structured-data",
        title: "Semi-structured data",
        explain:
          "Somewhere in between. A contact list exported as plain text follows a pattern of name then number, but it is not as clean as a spreadsheet.",
        why: "This is the shape most real exports arrive in. Recognising it early tells you there is cleaning work ahead, which saves you from trusting a broken analysis later.",
        table: {
          caption: "The three shapes at a glance.",
          headers: ["Shape", "Looks like", "Cleaning effort"],
          rows: [
            ["Structured", "A bank statement, a sales spreadsheet", "Low"],
            ["Semi-structured", "An exported contact list, a log file", "Medium"],
            ["Unstructured", "Complaint emails, WhatsApp voice notes", "High"],
          ],
        },
        analogy:
          "A structured file is a filing cabinet. Unstructured is a pile on the floor. Semi-structured is a stack of paper that is roughly in order but not filed.",
        practice: {
          prompt:
            "Your client sends six months of sales as WhatsApp voice notes. Which shape is that, and what does it tell you about the work ahead?",
          answer:
            "Unstructured. Before any analysis can start it has to be transcribed and given a shape, and that conversion is where most of the effort will go.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l3-the-analysts-workflow",
    moduleId: "m1-data-foundations",
    sectionId: SECTION_ID,
    order: 3,
    title: "The Analyst's Workflow",
    subtitle: "Six steps, walked through on a real dataset",
    estimatedMinutes: 12,
    intro:
      "Consider a small dispatch and delivery company with six months of records: date, rider name, area, delivery time, customer rating, and delivery fee. Here is exactly what a real analyst does with that data, step by step. You will repeat these six steps on every dataset for the rest of your career.",

    atoms: [
      {
        id: "a-step-collect",
        title: "Step 1. Collect",
        explain:
          "Bring the data together. It might be spread across three monthly spreadsheets or exported from an app. Step one is simply getting it all in one place.",
        why: "Analysis on a partial dataset produces confident, wrong answers. Knowing what you have, and what is missing, comes before everything else.",
        table: {
          caption: "The dispatch dataset you will be working with.",
          headers: ["Date", "Rider", "Area", "Minutes", "Rating"],
          rows: [
            ["03/06", "Musa", "Ikeja", "28", "5"],
            ["03/06", "Ada", "Ajah", "47", "3"],
            ["04/06", "Musa", "Yaba", "31", "4"],
            ["04/06", "Ngozi", "Ajah", "52", "2"],
          ],
        },
      },
      {
        id: "a-step-clean",
        title: "Step 2. Clean",
        explain:
          "Look for problems. Missing rider names, \"Ikeja\" spelled three different ways, delivery times stored as text instead of numbers. Nothing useful happens until this is sorted out.",
        why: "This step is unglamorous and it is usually 60 to 70% of the real work. Every professional analyst spends most of their time here. If a course tells you otherwise, it is selling you something.",
        table: {
          caption: "What one careless Area column does to your totals.",
          headers: ["Value stored", "Counted as", "Deliveries"],
          rows: [
            ["Ikeja", "Area 1", "12"],
            ["ikeja", "Area 2", "8"],
            ["Ikeja·(trailing space)", "Area 3", "3"],
          ],
          note: "The real answer was 23 deliveries to one area. Nothing on screen told you otherwise.",
        },
        mistake:
          "Skipping straight to charts because cleaning feels like a delay. A beautiful chart built on dirty data is worse than no chart at all, because it is confidently wrong.",
      },
      {
        id: "a-step-explore",
        title: "Step 3. Explore",
        explain:
          "Get a feel for the data before drawing conclusions. What is the average delivery time? How many riders are there? What is the spread of ratings?",
        why: "Exploring first stops you from chasing a pattern that was never there. You are building intuition about what is normal, so that later you can recognise what is not.",
      },
      {
        id: "a-step-analyze",
        title: "Step 4. Analyse",
        explain:
          "Now ask the real questions. Which rider has the best average rating? Which areas take longest to deliver to? Does delivery time affect customer rating? Is there a day of the week where deliveries are consistently late?",
        why: "This is the step everyone pictures when they imagine data analysis. It only works because steps 1 to 3 were done properly.",
      },
      {
        id: "a-step-visualize",
        title: "Step 5. Visualise",
        explain:
          "Turn the answer into something a human can grasp at a glance. A chart of average delivery time by area communicates far faster than a table of numbers.",
        why: "Your audience will not read a table. A chart is not decoration. It is how the finding survives the trip from your screen into someone else's head.",
      },
      {
        id: "a-step-communicate",
        title: "Step 6. Communicate",
        explain:
          "Tell the business owner what you found, in plain language. \"Deliveries to Ajah take 40% longer than any other area, and that is where ratings are lowest. You may need a dedicated rider there.\"",
        why: "That single sentence is the entire point of everything before it. If steps 1 to 5 do not lead to something like step 6, the analysis was not worth doing. The goal is not to process numbers. It is to help someone make a decision they could not confidently make before.",
        mistake:
          "Ending at the chart. Handing someone a dashboard and letting them work out the implication themselves is an unfinished job.",
        practice: {
          prompt:
            "You have cleaned the data, built the charts, and found that Ajah is slow. Your client asks, \"So what should I do?\" What went wrong in your process?",
          answer:
            "Nothing went wrong in steps 1 to 5, but the job stopped one step early. The recommendation is the deliverable, not the chart.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l4-analytics-and-the-tools",
    moduleId: "m1-data-foundations",
    sectionId: SECTION_ID,
    order: 4,
    title: "Analytics, and Where the Tools Fit",
    subtitle: "Why three tools, and why in this order",
    estimatedMinutes: 8,
    intro:
      "Two things people mix up constantly: the difference between analysis and analytics, and why this course teaches three different tools. Both answers are simpler than they look.",

    atoms: [
      {
        id: "a-analysis-vs-analytics",
        title: "Data analysis vs data analytics",
        explain:
          "Data analysis is the process you just walked through: collecting, cleaning, exploring, and finding the Ajah delivery problem. Data analytics is the broader umbrella. It includes that analysis and extends into predicting which areas will face delays next month, or recommending how many riders to hire per zone.",
        why: "Analysis looks backward at what happened. Analytics can also look forward at what is likely to happen and what should be done about it. Most of this course focuses on analysis first, because reliable predictions only come after a solid understanding of what already happened.",
        table: {
          caption: "Same dataset, two different questions.",
          headers: ["", "Question it answers", "Example"],
          rows: [
            [
              "Analysis",
              "What happened?",
              "Ajah was our slowest area last quarter",
            ],
            [
              "Analytics",
              "What will happen, and what should we do?",
              "Ajah will slip again in December, so hire a second rider",
            ],
          ],
        },
        mistake:
          "Trying to forecast before you can describe. A prediction built on data you have not cleaned or understood is a guess wearing a suit.",
      },
      {
        id: "a-where-excel-fits",
        title: "Where Excel fits",
        explain:
          "Excel is where cleaning, exploring and analysing are first practised by hand. Every step is felt because nothing is automated yet.",
        why: "This is deliberate. Doing it manually builds instinct. Later you will recognise at a glance when an automated result looks wrong, because you have done it the slow way.",
      },
      {
        id: "a-where-powerbi-fits",
        title: "Where Power BI fits",
        explain:
          "Once the workflow is understood, Power BI builds the visualise and communicate steps into interactive dashboards that update automatically.",
        why: "It removes the repetitive part of reporting. The thinking is identical. You are simply no longer rebuilding the same chart every month.",
      },
      {
        id: "a-where-python-fits",
        title: "Where Python fits",
        explain:
          "Later, once the reasoning behind each step is clear, Python performs all six steps through code. Faster, more reliably, and on datasets far too large for Excel.",
        why: "None of these tools change the job. They only change how much manual effort each step takes. That is why the order matters. Learning the tool before the thinking produces someone who can click buttons but cannot answer a question.",
        table: {
          caption: "One job, three tools, different amounts of manual effort.",
          headers: ["Tool", "Best at", "When you meet it"],
          rows: [
            ["Excel", "Feeling every step by hand", "Months 1 and 2"],
            ["Power BI", "Dashboards that refresh themselves", "Month 3"],
            ["Python", "Large data and repeatable code", "Month 4"],
          ],
        },
        practice: {
          prompt:
            "A colleague says they want to skip Excel and go straight to Python because it is more powerful. What is the flaw in that plan?",
          answer:
            "Power is not the bottleneck. Judgement is. Excel is where you feel each step and learn what a correct result looks like. Python in the hands of someone who cannot tell a wrong answer from a right one is just a faster way to be wrong.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    /* The source document's "Task Before Next Session", kept as a reflective
       task. Not graded, not blocking. */
    task: {
      title: "Before the next lesson",
      intro:
        "No spreadsheets yet, just observation. Pick a small business you interact with regularly: a shop, a barber, a food vendor, even your own phone or data spending. Spend a day noticing what data that business already generates, even informally, such as receipts, a notebook, or memory.",
      prompts: [
        "What raw data does this business have?",
        "What are three questions the owner could answer if that data were organised properly?",
        "What decision might the owner make differently with those answers?",
      ],
      closing:
        "This is the exact thinking you will apply to every dataset for the rest of the course. The tools simply make it faster.",
    },
  },
];

export default LESSONS;
