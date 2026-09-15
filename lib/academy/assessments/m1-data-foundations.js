/**
 * ASSESSMENTS · MODULE 1 · DATA ANALYSIS FOUNDATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. This file lives in lib/ and is imported exclusively by
 * api/academy/*. It must NEVER be imported from anything under src/, because
 * Vite would bundle the correct answers into the browser and every score in
 * the platform, and therefore every certificate, would be meaningless.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * QUESTION SHAPE
 *   id          stable key. Attempts reference this
 *   type        "mcq" | "truefalse" | "scenario"
 *   prompt      the question as the learner reads it
 *   options     [{ id, text }]. Order is shuffled per attempt at serve time
 *   correct     option id
 *   explanation why the correct answer is correct
 *   whyWrong    per option: why THAT specific answer was wrong
 *   atomId      the concept under test. Drives the "review this" feedback
 *   difficulty  1 recall · 2 understanding · 3 application
 *
 * WRITING STYLE
 *   Short, plain sentences. Do not join two clauses with a dash; end the
 *   sentence and start a new one. A learner reading on a phone, possibly in a
 *   second language, should never have to re-read a question to parse it.
 *
 * `whyWrong` is the reason this platform exists. Telling a learner
 * "incorrect" teaches nothing. Telling them why their specific reasoning
 * failed, and which atom to reopen, closes the loop.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l1-you-already-do-this": {
    lessonId: "l1-you-already-do-this",
    passMark: 70,
    questions: [
      {
        id: "q1-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-the-question-turns-it",
        prompt:
          "The shopkeeper has kept her notebook for three months without looking at it. What has to happen before it becomes data analysis?",
        options: [
          { id: "a", text: "She has to enter the notebook into Excel" },
          {
            id: "b",
            text: "She has to ask a question and go back to the record for the answer",
          },
          { id: "c", text: "She has to collect at least six months of records" },
          { id: "d", text: "She has to learn what an average is" },
        ],
        correct: "b",
        explanation:
          "Analysis begins with a question. The record was already complete. What changed was that she brought a question to it and went looking for the answer.",
        whyWrong: {
          a: "Software is not what makes it analysis. She analysed her notebook on paper long before Excel was involved. The tool only changes how fast it goes.",
          c: "More data does not create insight. A six-month notebook that nobody questions is just a longer record.",
          d: "Techniques come later. Plenty of real analysis is done by counting, and no technique helps until there is a question to answer.",
        },
      },
      {
        id: "q1-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-data-vs-information",
        prompt: "Which of these is information rather than data?",
        options: [
          { id: "a", text: "500, Rice, Tuesday, ₦1,200" },
          { id: "b", text: "A spreadsheet containing every sale from June" },
          {
            id: "c",
            text: "Rice sells fastest on Tuesdays because that is market day",
          },
          { id: "d", text: "The customer's phone number and address" },
        ],
        correct: "c",
        explanation:
          "Information is data that has been organised and interpreted so that it means something. This one tells you what is happening and why. You could act on it tonight.",
        whyWrong: {
          a: "That is a raw record. It is true, but it is silent. It does not tell you anything to do.",
          b: "A full spreadsheet is still raw material. Volume does not turn data into information. Interpretation does.",
          d: "Also a raw record. It is accurate, but it carries no meaning until someone asks something of it.",
        },
      },
      {
        id: "q1-3",
        type: "truefalse",
        difficulty: 1,
        atomId: "a-what-data-is",
        prompt: "Collecting more data automatically produces more insight.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. A bigger notebook is still just a notebook. Insight comes from questions and interpretation, not from volume.",
        whyWrong: {
          a: "This is one of the most expensive assumptions in business. Companies gather data for years and get nothing back, because nobody ever brought a question to it.",
        },
      },
      {
        id: "q1-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-data-vs-information",
        prompt:
          "You send your manager a spreadsheet of every delivery made in June. She replies, \"What am I looking at?\" What did you actually send her?",
        options: [
          { id: "a", text: "Information, because it is organised into rows and columns" },
          { id: "b", text: "Data, because it is a record and not yet an interpretation" },
          { id: "c", text: "Analysis, because the file is the result of your work" },
          { id: "d", text: "A dashboard" },
        ],
        correct: "b",
        explanation:
          "You sent a record. Being neat is not the same as being interpreted, and her reply is the proof. It becomes information when you tell her what it means.",
        whyWrong: {
          a: "Rows and columns make it structured, not interpreted. Structure and meaning are different things.",
          c: "Exporting a file is not analysis. Nothing was explored, questioned or concluded.",
          d: "A dashboard presents findings. This is the raw material a dashboard would be built from.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l2-not-all-data-looks-the-same": {
    lessonId: "l2-not-all-data-looks-the-same",
    passMark: 70,
    questions: [
      {
        id: "q2-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-structured-data",
        prompt:
          "A bank transaction log has the same four fields on every row: date, amount, sender, receiver. What shape is this?",
        options: [
          { id: "a", text: "Structured" },
          { id: "b", text: "Unstructured" },
          { id: "c", text: "Semi-structured" },
          { id: "d", text: "It depends on the file format" },
        ],
        correct: "a",
        explanation:
          "Structured data is organised into rows and columns with the same fields every time. This is exactly what Excel and Power BI are built for.",
        whyWrong: {
          b: "Unstructured data has no fixed shape at all. Think complaint emails or voice notes. This has a very fixed shape.",
          c: "Semi-structured data has some pattern but is not cleanly tabular. Every row here has identical fields, which makes it fully structured.",
          d: "The shape is about how the data is organised, not which program saved it. A transaction log is structured whether it is a CSV, an Excel file or a database table.",
        },
      },
      {
        id: "q2-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-unstructured-data",
        prompt: "Which of these is unstructured data?",
        options: [
          { id: "a", text: "A sales spreadsheet with one row per order" },
          { id: "b", text: "Product reviews customers left on Jumia" },
          { id: "c", text: "A contact list exported as plain text" },
          { id: "d", text: "A table of rider names and delivery times" },
        ],
        correct: "b",
        explanation:
          "Reviews are free text with no fixed shape. Every one is a different length and says something different. It usually needs heavy cleaning, but it often answers the question structured data cannot: why.",
        whyWrong: {
          a: "One row per order with consistent columns is structured.",
          c: "That is semi-structured. There is a repeating pattern of name and number, just not a clean table.",
          d: "A table with consistent columns is structured.",
        },
      },
      {
        id: "q2-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-semi-structured-data",
        prompt: "Why does this course start with structured data?",
        options: [
          { id: "a", text: "It is the only kind that matters in business" },
          {
            id: "b",
            text: "Excel and Power BI are built for it, and it is the most common shape in business",
          },
          { id: "c", text: "Unstructured data cannot be analysed" },
          { id: "d", text: "It requires no cleaning" },
        ],
        correct: "b",
        explanation:
          "It is where the tools you are learning first are strongest, and it is what most business records look like. Python is what later opens up the messier shapes.",
        whyWrong: {
          a: "Unstructured data matters enormously. Complaints and reviews are where the reasons live. It is just harder, so it comes later.",
          c: "It can absolutely be analysed. It needs to be given a shape first, which is why it is not the starting point.",
          d: "Structured data very often needs cleaning. Consistent columns say nothing about whether the values inside them are correct.",
        },
      },
      {
        id: "q2-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-unstructured-data",
        prompt:
          "A client offers you six months of sales history as WhatsApp voice notes. What does that tell you before you quote a timeline?",
        options: [
          { id: "a", text: "Nothing. Data is data" },
          {
            id: "b",
            text: "It is unstructured, so most of the effort will go into giving it a shape before any analysis starts",
          },
          { id: "c", text: "The job is impossible" },
          { id: "d", text: "It will be quick, since audio files are small" },
        ],
        correct: "b",
        explanation:
          "Recognising the shape early is how you predict the work. Voice notes have to be transcribed and structured before a single question can be answered, and that conversion is the bulk of the job.",
        whyWrong: {
          a: "The shape changes the effort enormously. A clean spreadsheet and six months of voice notes are not the same job.",
          c: "It is very possible, just slow. Unstructured does not mean unusable.",
          d: "File size has nothing to do with analysis effort. The work is in the conversion, not the storage.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l3-the-analysts-workflow": {
    lessonId: "l3-the-analysts-workflow",
    passMark: 70,
    questions: [
      {
        id: "q3-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-step-clean",
        prompt: "Which step usually takes 60 to 70% of a real analyst's time?",
        options: [
          { id: "a", text: "Collect" },
          { id: "b", text: "Clean" },
          { id: "c", text: "Visualise" },
          { id: "d", text: "Communicate" },
        ],
        correct: "b",
        explanation:
          "Cleaning. It is the least glamorous step and the one beginners most want to skip, and it is where most of the job actually happens.",
        whyWrong: {
          a: "Collecting is usually quick. Often it is one export.",
          c: "Charts feel like the work because they are visible, but they are fast once the data is trustworthy.",
          d: "Communicating is the most important step and one of the shortest. Sometimes it is a single sentence.",
        },
      },
      {
        id: "q3-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-step-clean",
        prompt:
          "Your delivery data contains \"Ikeja\", \"ikeja\" and \"Ikeja \" with a trailing space. Which step catches this, and what happens if you miss it?",
        options: [
          { id: "a", text: "Explore, because you would notice the average looks odd" },
          {
            id: "b",
            text: "Clean. Miss it and Ikeja splits into three separate areas in every result",
          },
          { id: "c", text: "Visualise, because the chart would look wrong" },
          { id: "d", text: "It does not matter. Excel treats them as the same" },
        ],
        correct: "b",
        explanation:
          "This is exactly what cleaning is for. To a computer those are three different areas, so every count, average and chart grouped by area would silently split Ikeja into three.",
        whyWrong: {
          a: "You might spot it while exploring, but exploring is where you notice problems. Cleaning is where you fix them.",
          c: "By the time it reaches a chart the damage is already in the numbers. The chart would be drawn perfectly from wrong data.",
          d: "Excel does not. Capitalisation and whitespace make them distinct values, which is precisely why this catches so many beginners.",
        },
      },
      {
        id: "q3-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-step-explore",
        prompt:
          "Why explore before analysing, instead of going straight to your question?",
        options: [
          { id: "a", text: "To make the dataset smaller" },
          {
            id: "b",
            text: "To build a sense of what is normal, so you can recognise what is not",
          },
          { id: "c", text: "Because the software requires it" },
          { id: "d", text: "To decide which chart colours to use" },
        ],
        correct: "b",
        explanation:
          "Exploring builds intuition. Average delivery time, how many riders, the spread of ratings. Without that baseline you cannot tell a real pattern from a normal fluctuation.",
        whyWrong: {
          a: "Exploring does not reduce the data. It familiarises you with it.",
          c: "No tool requires it. It is a discipline, which is exactly why it gets skipped.",
          d: "Presentation decisions come much later, and they never drive the analysis.",
        },
      },
      {
        id: "q3-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-step-communicate",
        prompt:
          "You cleaned the data, built a clear chart showing Ajah is 40% slower than every other area, and emailed it over. The owner replies, \"So what should I do?\" What went wrong?",
        options: [
          { id: "a", text: "Nothing. Interpreting the chart is the owner's job" },
          {
            id: "b",
            text: "The analysis stopped at step 5. The recommendation is the deliverable, not the chart",
          },
          { id: "c", text: "The chart should have been a table" },
          { id: "d", text: "You should have collected more data first" },
        ],
        correct: "b",
        explanation:
          "Steps 1 to 5 were done properly and the job still stopped one step early. \"Ajah takes 40% longer and has the lowest ratings, so you may need a dedicated rider there\" is the actual product of the work.",
        whyWrong: {
          a: "If the owner could interpret it unaided they would not have needed an analyst. Handing over the interpretation is the job.",
          c: "The format was fine. The chart communicated the finding. What was missing was what to do about it.",
          d: "More data would not have helped. The finding was already clear and already actionable.",
        },
      },
      {
        id: "q3-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-step-visualize",
        prompt:
          "A well-built chart drawn from data you have not cleaned is still better than no chart at all.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False, and this is the dangerous one. A polished chart built on dirty data is worse than nothing. It is confidently wrong, and its polish is exactly what persuades someone to act on it.",
        whyWrong: {
          a: "The professionalism of the chart is what makes it hazardous. Nobody makes a bad decision from a blank page. Plenty of people make one from a convincing chart.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l4-analytics-and-the-tools": {
    lessonId: "l4-analytics-and-the-tools",
    passMark: 70,
    questions: [
      {
        id: "q4-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-analysis-vs-analytics",
        prompt:
          "\"Ajah will probably face the worst delays next month, so hire a second rider there.\" Is this analysis or analytics?",
        options: [
          { id: "a", text: "Analysis, because it is based on the delivery data" },
          { id: "b", text: "Analytics, because it predicts forward and recommends an action" },
          { id: "c", text: "Neither" },
          { id: "d", text: "Both words mean the same thing" },
        ],
        correct: "b",
        explanation:
          "Analysis looks backward at what happened. This looks forward at what is likely to happen and what to do about it, which puts it under the wider analytics umbrella.",
        whyWrong: {
          a: "It is built on the analysis, but the analysis itself stops at \"Ajah was slowest.\" The prediction goes beyond that.",
          c: "It is squarely analytics. A forecast plus a recommendation.",
          d: "They overlap but they are not the same. Analytics contains analysis and extends past it.",
        },
      },
      {
        id: "q4-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-where-excel-fits",
        prompt: "Why does this course teach Excel before Power BI and Python?",
        options: [
          { id: "a", text: "Excel is the most powerful of the three" },
          {
            id: "b",
            text: "Doing each step by hand builds the instinct to recognise a wrong result later",
          },
          { id: "c", text: "Power BI and Python are too expensive for beginners" },
          { id: "d", text: "Employers only ask for Excel" },
        ],
        correct: "b",
        explanation:
          "Nothing is automated yet, so every step is felt. That is deliberate. It is how you later recognise at a glance when an automated result looks wrong.",
        whyWrong: {
          a: "It is the least powerful of the three on large data. It comes first because it is the best teacher, not the strongest tool.",
          c: "Power BI Desktop and Python are both free. Cost is not the reason.",
          d: "Employers ask for all three, and increasingly for Power BI and Python specifically.",
        },
      },
      {
        id: "q4-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-where-powerbi-fits",
        prompt:
          "What does Power BI mainly add once you already understand the workflow?",
        options: [
          { id: "a", text: "It cleans data automatically without instruction" },
          {
            id: "b",
            text: "It builds the visualise and communicate steps into dashboards that update automatically",
          },
          { id: "c", text: "It replaces the need to ask questions" },
          { id: "d", text: "It performs the analysis for you" },
        ],
        correct: "b",
        explanation:
          "It removes the repetitive part of reporting. The thinking is identical. You are simply no longer rebuilding the same chart every month.",
        whyWrong: {
          a: "You still specify every cleaning step, in Power Query. It repeats them for you. It does not decide them.",
          c: "No tool will ever do that. The question is the one part that is always yours.",
          d: "It presents the analysis. You still decide what to ask and what the answer means.",
        },
      },
      {
        id: "q4-4",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-where-python-fits",
        prompt: "Moving from Excel to Python changes what the analyst's job actually is.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. None of these tools change the job: collect, clean, explore, analyse, visualise, communicate. They only change how much manual effort each step takes.",
        whyWrong: {
          a: "This is the assumption behind \"I will just skip to Python.\" The six steps are identical. Python only does them faster and on bigger data.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
