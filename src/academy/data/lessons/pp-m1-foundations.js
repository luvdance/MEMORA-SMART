/**
 * PYTHON PROGRAMMING · MODULE 1 · INTRODUCTION TO PROGRAMMING AND
 * COMPUTATIONAL THINKING
 *
 * Curriculum 1.1 – 1.10. Three lessons of thinking before any syntax, then
 * Python installed and the first programs written by the learner. Every
 * `code` and `codeExercise` is executed by `npm run validate:content`, and
 * every `codeChallenge` model answer is run against its own tests.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s1-foundations";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l1-what-is-programming",
    moduleId: "pp-m1-foundations",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2"],
    title: "What Programming Is",
    subtitle: "Programs, instructions, algorithms and problem-solving",
    estimatedMinutes: 12,
    intro:
      "Before any Python, the idea underneath all of it. A computer is extremely fast and completely literal: it does exactly what it is told, nothing more and nothing less. Programming is the skill of telling it precisely. This lesson is about that skill, and you will practise it before you type a line of code.",

    atoms: [
      {
        id: "a-pp-what-is-programming",
        title: "Programming: giving a computer exact instructions",
        explain:
          "A program is a list of instructions a computer follows to do a job. Programming is writing those instructions. It exists because computers can do enormous amounts of work quickly and without getting tired, but they cannot guess what you mean: every step has to be spelled out.",
        analogy:
          "Think of directing a visitor to your house over the phone. A friend who knows the area understands \"turn near the big church\". A visitor who has never been there needs \"at the second junction, turn left; stop at the blue gate\". A computer is the most literal visitor in the world.",
        why: "Every app you use, from a banking app to WhatsApp, is somebody's instructions written this precisely. Learning to program is learning to think that precisely.",
        decision: {
          scenario: "Three people write instructions for a robot that makes tea.",
          question: "Which instruction could a computer actually follow?",
          options: [
            {
              id: "a",
              text: "\"Make the tea nice.\"",
              whyWrong: "\"Nice\" means something different to everyone. A computer has no idea what nice is; it needs measurable steps.",
            },
            {
              id: "b",
              text: "\"Boil 250 ml of water, then pour it over one tea bag in a cup.\"",
              why: "Every word is something that can be done and checked: an amount, an action, an order. That is what an instruction for a computer looks like.",
            },
            {
              id: "c",
              text: "\"Do whatever you usually do for tea.\"",
              whyWrong: "A computer has no \"usually\". It only knows what it has been told.",
            },
            {
              id: "d",
              text: "\"Tea, quickly.\"",
              whyWrong: "That is a wish, not an instruction. It says nothing about how.",
            },
          ],
          correct: "b",
          aftermath: "Precise, ordered, checkable. Hold on to those three words: they describe every good instruction in this course.",
        },
      },
      {
        id: "a-pp-programs-instructions",
        title: "Programs are made of instructions, run in order",
        explain:
          "An instruction is one small action: show this text, add these two numbers, remember this value. A program is a sequence of instructions, and the computer runs them one at a time, from the top down, unless an instruction tells it to go somewhere else. Change the order and you change what happens.",
        example:
          "Instructions for a phone alarm:\n\n  1. Read the time the user chose.\n  2. Wait until the clock reaches that time.\n  3. Play the alarm sound.\n\nSwap steps 2 and 3 and the alarm rings immediately, then waits.\nSame instructions, different order, wrong program.",
        decision: {
          scenario: "A program to greet a new user has these three steps, in this order:\n  1. Show \"Welcome, \" followed by the user's name\n  2. Ask the user for their name\n  3. Save the name",
          question: "What is wrong with it?",
          options: [
            {
              id: "a",
              text: "Nothing; the computer will work out the right order",
              whyWrong: "The computer never reorders your instructions. It runs step 1 first, before it has any name to show.",
            },
            {
              id: "b",
              text: "Step 1 uses the name before step 2 has asked for it",
              why: "Order matters. You cannot use information before the program has collected it. Step 2 must come first, then 3, then 1.",
            },
            {
              id: "c",
              text: "There should be more than three steps",
              whyWrong: "Three steps is fine. The problem is not the number of steps but their order.",
            },
            {
              id: "d",
              text: "Programs cannot ask for names",
              whyWrong: "They can, and you will write one in Module 2. The problem is when it asks.",
            },
          ],
          correct: "b",
          aftermath: "Collect, then process, then show. You will see that order everywhere.",
        },
      },
      {
        id: "a-pp-algorithms",
        title: "Algorithms: a recipe a computer could follow",
        explain:
          "An algorithm is a step-by-step method for solving a problem. It is the plan; a program is that plan written in a programming language. A good algorithm has four properties: each step is precise, the steps are in a clear order, it has defined inputs and outputs, and it finishes.",
        table: {
          caption: "The algorithm for making a cup of tea, and the property each part shows.",
          headers: ["Step", "Instruction", "Property"],
          rows: [
            ["Input", "A tea bag, a cup, water, sugar (optional)", "Defined inputs"],
            ["1", "Fill the kettle with water and switch it on", "Precise action"],
            ["2", "Wait until the water boils", "Clear order: nothing happens before this is true"],
            ["3", "Put the tea bag in the cup", "Precise action"],
            ["4", "Pour the boiled water into the cup", "Depends on steps 2 and 3"],
            ["5", "Wait 3 minutes, then remove the tea bag", "Measurable, not \"a while\""],
            ["6", "If the person wants sugar, add one spoon and stir", "A decision"],
            ["Output", "A cup of tea", "Defined output, and it finishes"],
          ],
        },
        why: "Programmers plan an algorithm before writing code, because fixing a plan is cheap and fixing a finished program is expensive. Step 6 is a decision and step 2 is a wait-until; you will meet both again as Python's if and while.",
        decision: {
          scenario: "Someone writes this algorithm for adding two numbers:\n  1. Show the answer\n  2. Get the first number\n  3. Get the second number\n  4. Add them",
          question: "What is the correct order?",
          options: [
            {
              id: "a",
              text: "2, 3, 4, 1: get both numbers, add them, then show the answer",
              why: "Inputs first, then the processing, then the output. Every step only uses what earlier steps produced.",
            },
            {
              id: "b",
              text: "1, 2, 3, 4: it is fine as written",
              whyWrong: "Step 1 shows an answer that does not exist yet.",
            },
            {
              id: "c",
              text: "4, 2, 3, 1: add first to save time",
              whyWrong: "You cannot add two numbers you have not got yet.",
            },
            {
              id: "d",
              text: "Order does not matter in an algorithm",
              whyWrong: "Order is one of the four properties of an algorithm. It matters as much as the steps themselves.",
            },
          ],
          correct: "a",
          aftermath: "Input, process, output. It is the shape of almost every program you will write this month.",
        },
      },
      {
        id: "a-pp-problem-solving",
        title: "Problem-solving: input, process, output",
        explain:
          "Faced with any problem, a programmer asks three questions. What information do I start with (input)? What must I do with it (process)? What result do I need (output)? Answer those three and the algorithm usually writes itself.",
        table: {
          caption: "Three problems from this module's practice, broken into input, process and output.",
          headers: ["Problem", "Input", "Process", "Output"],
          rows: [
            ["Make tea", "Water, tea bag, cup, sugar choice", "Boil, steep, remove bag, sweeten if wanted", "A cup of tea"],
            ["Calculate two numbers", "Two numbers", "Add them (or subtract, multiply, divide)", "The result"],
            ["Did a student pass?", "The student's score, the pass mark (50)", "Compare the score with the pass mark", "\"Pass\" or \"Fail\""],
          ],
        },
        decision: {
          scenario: "You are planning a program that decides whether a student passed an examination. The pass mark is 50.",
          question: "Which is the PROCESS step?",
          options: [
            {
              id: "a",
              text: "Reading the student's score",
              whyWrong: "That is the input: information the program starts with.",
            },
            {
              id: "b",
              text: "Showing \"Pass\" or \"Fail\"",
              whyWrong: "That is the output: the result the program gives back.",
            },
            {
              id: "c",
              text: "Checking whether the score is 50 or more",
              why: "The process is the work done on the input to produce the output. Here that work is one comparison.",
            },
            {
              id: "d",
              text: "Switching the computer on",
              whyWrong: "That happens before the program runs at all; it is not part of the algorithm.",
            },
          ],
          correct: "c",
          aftermath: "In Lesson 3 you will draw this exact algorithm as a flowchart, and in Module 5 you will write it in Python.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.3 – 1.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l2-how-computers-run-code",
    moduleId: "pp-m1-foundations",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.3", "1.4", "1.5"],
    title: "How a Computer Runs Your Code",
    subtitle: "Hardware, software, languages, interpreters and Python",
    estimatedMinutes: 14,
    intro:
      "When you press Run, a lot happens between the text you typed and the result on screen. You do not need every detail, but you do need the map: what the hardware does, what the operating system does, and what Python itself does with your file.",

    atoms: [
      {
        id: "a-pp-hardware-software",
        title: "Hardware, software and the operating system",
        explain:
          "Hardware is the physical machine: the processor (CPU) that carries out instructions, memory (RAM) that holds what is being worked on, and storage (a hard drive or SSD) that keeps files when the power is off. Software is the instructions. The operating system is the software that manages the hardware and lets every other program use it.",
        table: {
          caption: "The layers between you and the hardware.",
          headers: ["Layer", "Examples", "Its job"],
          rows: [
            ["Applications", "VS Code, Chrome, your Python programs", "Do something useful for a person"],
            ["Operating system", "Windows, macOS, Linux, Android", "Share the hardware between programs; manage files, memory and devices"],
            ["Hardware", "CPU, RAM, SSD, keyboard, screen", "Physically carry out the instructions and store the data"],
          ],
        },
        why: "When your Python program saves a file in Module 11, it asks the operating system, which asks the storage hardware. Knowing the layers tells you where to look when something goes wrong.",
        decision: {
          scenario: "Your program has finished and you switch the computer off. The next day the numbers it calculated are gone, but the program file you wrote is still there.",
          question: "Why?",
          options: [
            {
              id: "a",
              text: "The calculated numbers were only in RAM, which is cleared when the power goes off; the program file was saved to storage",
              why: "RAM is fast working memory that forgets everything without power. Storage keeps files. To keep results you must save them to a file, which is exactly what Module 11 teaches.",
            },
            {
              id: "b",
              text: "The operating system deletes numbers every night",
              whyWrong: "It does not. The numbers were never saved anywhere permanent in the first place.",
            },
            {
              id: "c",
              text: "The CPU stores programs but not numbers",
              whyWrong: "The CPU executes instructions; it is not where files are kept.",
            },
            {
              id: "d",
              text: "Python forgot to finish the program",
              whyWrong: "The program finished. Its results simply lived only in memory.",
            },
          ],
          correct: "a",
          aftermath: "Memory is for working, storage is for keeping. That distinction comes back when you make programs remember things between runs.",
        },
      },
      {
        id: "a-pp-languages",
        title: "Programming languages: between people and machines",
        explain:
          "A CPU only understands machine code: long patterns of 1s and 0s. Nobody writes that by hand any more. Instead we write in a high-level programming language such as Python, which reads almost like English and is precise enough for a computer to translate into machine code.",
        example:
          "The same instruction at three levels:\n\n  English:      show the total of 7 and 5\n  Python:       print(7 + 5)\n  Machine code: 10110000 00000111 00000100 00000101 ...\n\nPython is the level you will work at. The translation\ndownwards is done for you.",
        why: "High-level languages let one line do the work of hundreds of machine instructions, and the same Python file runs on Windows, macOS and Linux because each has its own translator.",
      },
      {
        id: "a-pp-interpreters-compilers",
        title: "Source code, compilers and interpreters",
        explain:
          "The text you write is called source code. Before the CPU can act on it, it must be translated. A compiler translates the whole program into a separate machine-code file first, and you run that file. An interpreter translates and runs the program as it goes, instruction by instruction. Python is interpreted: you give it your source code and it runs it directly.",
        table: {
          caption: "Two ways to translate source code.",
          headers: ["", "Compiler", "Interpreter"],
          rows: [
            ["When it translates", "All at once, before running", "While running, as it goes"],
            ["What you run", "A separate executable file", "Your source code, through the interpreter"],
            ["Typical languages", "C, C++, Go, Rust", "Python, JavaScript, Ruby"],
            ["Strength", "Very fast finished programs", "Fast to try ideas; edit and run again immediately"],
          ],
        },
        decision: {
          scenario: "You edit one line of your Python program and want to see the effect.",
          question: "What do you need to do?",
          options: [
            {
              id: "a",
              text: "Save the file and run it again; the interpreter reads the new source code",
              why: "No separate build step. That quick edit-run loop is one reason Python is popular for learning and for trying ideas.",
            },
            {
              id: "b",
              text: "Recompile the program into an .exe file first",
              whyWrong: "That is how a compiled language such as C works. Python runs your source directly.",
            },
            {
              id: "c",
              text: "Restart the computer",
              whyWrong: "Never needed. Saving and running again is enough.",
            },
            {
              id: "d",
              text: "Reinstall Python",
              whyWrong: "Python reads your file fresh on every run; nothing needs reinstalling.",
            },
          ],
          correct: "a",
          aftermath: "Edit, save, run, read the result. You will do that loop thousands of times; it should feel quick.",
        },
      },
      {
        id: "a-pp-how-python-runs",
        title: "How Python executes a program",
        explain:
          "When you run a Python file, Python first checks the whole file for grammar mistakes (syntax errors). If there are none, it runs the instructions one at a time, top to bottom. If an instruction fails while running, Python stops at that line and prints an error message. Everything before that line has already happened; nothing after it runs.",
        code: {
          language: PY,
          code: 'print("Step 1: boil water")\nprint("Step 2: add tea bag")\nprnt("Step 3: pour water")\nprint("Step 4: serve")\n',
          expectedOutput: "Step 1: boil water\nStep 2: add tea bag",
          raises: "NameError: name 'prnt' is not defined. Did you mean: 'print'?",
        },
        why: "Look at what happened. Steps 1 and 2 ran. Step 3 has a spelling mistake, prnt instead of print, so Python stopped there with a NameError and even suggested the fix. Step 4 never ran. \"How far did it get?\" is the first question to ask about any error.",
        decision: {
          scenario: "A program has 20 lines. It prints the results of lines 1 to 11, then shows an error message.",
          question: "Where should you look first?",
          options: [
            {
              id: "a",
              text: "Line 1, because errors always start at the top",
              whyWrong: "Lines 1 to 11 worked; their output appeared. The problem is where the output stopped.",
            },
            {
              id: "b",
              text: "Around line 12, the first line that did not produce its result; the error message names the exact line",
              why: "Python runs top to bottom and stops at the failing instruction. The error message gives its line number, so read that before anything else.",
            },
            {
              id: "c",
              text: "Line 20, the last line",
              whyWrong: "Python never reached line 20. It stopped earlier.",
            },
            {
              id: "d",
              text: "Reinstall Python, because errors mean it is broken",
              whyWrong: "Errors are Python telling you exactly what is wrong with your code. They are help, not breakage.",
            },
          ],
          correct: "b",
          aftermath: "Error messages are the most useful text Python ever prints. Module 2 and Module 12 teach you to read them properly.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.6 – 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l3-plan-before-code",
    moduleId: "pp-m1-foundations",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.6", "1.7"],
    title: "Plan Before You Code",
    subtitle: "Decomposition, pseudocode and flowcharts",
    estimatedMinutes: 16,
    intro:
      "Professional programmers rarely start by typing code. They break the problem down, write the plan in plain language, and often draw it. This lesson gives you the three planning tools you will use for the rest of the course: decomposition, pseudocode and flowcharts.",

    atoms: [
      {
        id: "a-pp-decomposition",
        title: "Decomposition: breaking a big problem into small ones",
        explain:
          "Decomposition means splitting a problem that feels too big into smaller problems, and splitting those again, until every piece is small enough to solve directly. Solve the pieces and you have solved the whole.",
        example:
          "\"Build a school result system\" is too big to start. Decompose it:\n\n  School result system\n  ├── Collect each student's name and scores\n  ├── Calculate each student's total and average\n  ├── Decide each student's grade\n  └── Print a report card\n        ├── Print the heading\n        ├── Print one line per subject\n        └── Print the total, average and grade\n\nEvery leaf is now a few lines of code. You will build\nexactly this, piece by piece, in the Phase 1 project.",
        why: "Beginners get stuck because they try to write a whole program in one go. Nobody can. Decomposition turns \"I do not know where to start\" into a list of small jobs.",
        decision: {
          scenario: "You must write a program that works out a shop's daily profit.",
          question: "Which is the best first decomposition?",
          options: [
            {
              id: "a",
              text: "Get the day's sales; get the day's costs; subtract costs from sales; show the profit",
              why: "Four small, ordered jobs, each easy to write and test on its own: inputs, process, output.",
            },
            {
              id: "b",
              text: "Write the whole program and fix it at the end",
              whyWrong: "That is the approach decomposition exists to avoid. Errors pile up and you cannot tell where they come from.",
            },
            {
              id: "c",
              text: "Make it work for every shop in Nigeria first",
              whyWrong: "Solve one small, concrete problem first. Generalising comes later, if it is needed.",
            },
            {
              id: "d",
              text: "Choose the colours of the screen",
              whyWrong: "Presentation is the least important part until the calculation is right.",
            },
          ],
          correct: "a",
          aftermath: "When you are stuck on any task in this course, the first move is the same: break it into smaller pieces.",
        },
      },
      {
        id: "a-pp-pseudocode",
        title: "Pseudocode: program logic in plain English",
        explain:
          "Pseudocode is a plan written in structured plain language. It is not a programming language, so there are no strict rules, but it uses a few keywords consistently: INPUT to get information, OUTPUT to show it, SET to store a value, IF / ELSE for decisions and WHILE or FOR for repetition. Indentation shows which steps belong inside a decision or a loop.",
        codeExercise: {
          language: "pseudocode",
          code: "SET first TO 125\nSET second TO 37\nSET total TO first + second\nSET difference TO first - second\nOUTPUT total\nOUTPUT difference\n",
          equivalentPython: "first = 125\nsecond = 37\ntotal = first + second\ndifference = first - second\nprint(total)\nprint(difference)\n",
          question: "Dry-run this algorithm for calculating two numbers. Work each SET out in order. What does it output?",
          expectedOutput: "162\n88",
          hint: "total is 125 + 37. difference is 125 - 37. Each OUTPUT is one line.",
          successMessage:
            "162 and 88. You just ran an algorithm in your head, which is what a computer does with a program. Notice that the pseudocode already looks a lot like code; in Lesson 4 you will write the real Python version.",
        },
        mistake:
          "Writing pseudocode that is too vague (\"calculate the result\") or too close to one language's exact syntax. Aim for something any programmer could turn into code in any language.",
      },
      {
        id: "a-pp-flowchart-symbols",
        title: "Flowcharts: the standard shapes",
        explain:
          "A flowchart draws an algorithm as shapes joined by arrows. Each shape has one meaning, and these meanings are standard across the industry, so anyone can read anyone's flowchart. Workflow diagrams and process flow diagrams in business use the same shapes.",
        table: {
          caption: "The flowchart symbols you need.",
          headers: ["Shape", "Name", "Meaning", "Example"],
          rows: [
            ["Oval (rounded)", "Terminator", "Start or end of the algorithm", "START, STOP"],
            ["Parallelogram", "Input / Output", "Getting or showing information", "INPUT score; OUTPUT \"Pass\""],
            ["Rectangle", "Process", "A calculation or action", "total = a + b"],
            ["Diamond", "Decision", "A yes/no question; two arrows leave it", "Is score >= 50?"],
            ["Arrow", "Flow line", "The order the steps happen in", "→"],
            ["Small circle", "Connector", "Joins parts of a chart that do not fit on one page", "(A)"],
          ],
        },
        decision: {
          scenario: "You are drawing the pass/fail algorithm and reach the step \"Is the score 50 or more?\".",
          question: "Which shape do you draw?",
          options: [
            {
              id: "a",
              text: "A rectangle, because it is a step",
              whyWrong: "Rectangles are for processes, like a calculation. A question with two possible answers is a decision.",
            },
            {
              id: "b",
              text: "A diamond, with a YES arrow and a NO arrow leaving it",
              why: "A decision is always a diamond, and exactly two labelled arrows leave it. That diamond becomes an if statement in Python.",
            },
            {
              id: "c",
              text: "A parallelogram, because it uses the score",
              whyWrong: "Parallelograms are for input and output. Here the score is being tested, not read or shown.",
            },
            {
              id: "d",
              text: "An oval",
              whyWrong: "Ovals only mark the start and the end.",
            },
          ],
          correct: "b",
          aftermath: "Diamonds become if statements, rectangles become calculations, parallelograms become input() and print(). Flowcharts translate into Python almost shape by shape.",
        },
      },
      {
        id: "a-pp-reading-flowcharts",
        title: "Reading a flowchart: did the student pass?",
        explain:
          "To read a flowchart, start at the START oval and follow the arrows. At a diamond, answer the question for the value you have and take the matching arrow. The path you take is exactly what the program would do for that input.",
        example:
          "      ( START )\n          |\n   /INPUT score/\n          |\n   < score >= 50 ? >\n     |YES      |NO\n /OUTPUT     /OUTPUT\n \"Pass\"/     \"Fail\"/\n     |          |\n     +----+-----+\n          |\n       ( STOP )",
        codeExercise: {
          language: "pseudocode",
          code: "SET score TO 47\nIF score >= 50 THEN\n    OUTPUT \"Pass\"\nELSE\n    OUTPUT \"Fail\"\nEND IF\nOUTPUT \"Done\"\n",
          equivalentPython: "score = 47\nif score >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")\nprint(\"Done\")\n",
          question: "This is the flowchart above as pseudocode, run for a student who scored 47. What does it output?",
          expectedOutput: "Fail\nDone",
          hint: "Is 47 >= 50? Take the matching branch, then carry on after END IF.",
          successMessage:
            "Fail, then Done. 47 is not 50 or more, so the NO arrow is taken. \"Done\" is outside the decision, so it runs either way. A score of exactly 50 would pass, which is why boundaries matter; you will test them in Module 5.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.8 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l4-first-python-program",
    moduleId: "pp-m1-foundations",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.8", "1.9", "1.10"],
    title: "Meet Python: Your First Programs",
    subtitle: "What Python is for, setting it up, and writing code yourself",
    estimatedMinutes: 20,
    intro:
      "Now the language. By the end of this lesson Python will be installed, you will have run a program in VS Code, and you will have written four small programs of your own in the editor below each idea. From here on, every lesson works this way: you see it, then you write it.",

    atoms: [
      {
        id: "a-pp-why-python",
        title: "Python: what it is used for, and where it leads",
        explain:
          "Python is a high-level, interpreted programming language created by Guido van Rossum and first released in 1991. It was designed to be readable, so its code looks close to plain English. Today it is one of the most used languages in the world, in fields from web servers to artificial intelligence.",
        table: {
          caption: "Where Python is used, and the careers it leads to.",
          headers: ["Field", "What Python does there", "Career path"],
          rows: [
            ["Web backends and APIs", "Runs the server side of websites and apps (Django, Flask, FastAPI)", "Backend developer"],
            ["Automation and scripting", "Renames files, fills spreadsheets, sends reports", "Automation engineer, IT support"],
            ["Data analysis", "Cleans and analyses data (pandas), draws charts", "Data analyst"],
            ["Machine learning and AI", "Trains and runs models (scikit-learn, PyTorch)", "ML engineer, data scientist"],
            ["Testing and DevOps", "Automated tests, deployment scripts, cloud tooling", "QA engineer, DevOps / SRE"],
            ["Cybersecurity", "Scanners, log analysis, security tooling", "Security analyst"],
          ],
        },
        why: "The core you learn in this course (variables, loops, functions, files, classes) is the same in every one of those fields. Specialising later means learning a library, not a new language.",
      },
      {
        id: "a-pp-install-python",
        title: "Installing Python and setting up VS Code",
        explain:
          "You need two free programs: Python itself, and VS Code, a code editor that colours your code and runs it. Install Python first, then VS Code, then VS Code's Python extension. The editor on these lesson pages runs real Python too, so you can practise anywhere, but you should also be able to run programs on your own machine.",
        example:
          "1. Go to python.org/downloads and download Python 3 (3.12 or newer).\n2. Run the installer. On Windows, TICK \"Add python.exe to PATH\"\n   on the first screen before clicking Install.\n3. Install VS Code from code.visualstudio.com.\n4. In VS Code: Extensions (Ctrl+Shift+X), search \"Python\",\n   install the one published by Microsoft.\n5. Open the terminal in VS Code (View → Terminal) and type:\n\n     python --version        (on macOS/Linux: python3 --version)\n\n   You should see something like  Python 3.13.1\n6. Make a folder called python-course and open it with\n   File → Open Folder. Every file in this course goes there.",
        mistake:
          "Forgetting to tick \"Add python.exe to PATH\" on Windows, then getting \"python is not recognized\" in the terminal. Run the installer again, choose Modify, and tick the option; then close and reopen VS Code.",
      },
      {
        id: "a-pp-hello-world",
        title: "Your first program: print()",
        explain:
          "Create a file called hello.py (the .py ending tells the computer it holds Python). Type one line, save, and press the Run button (the triangle at the top right of VS Code), or type python hello.py in the terminal. print() is the instruction that shows something on the screen. The text to show goes inside the brackets, inside quotation marks.",
        code: {
          language: PY,
          code: 'print("Hello, World!")\n',
          expectedOutput: "Hello, World!",
        },
        why: "\"Hello, World!\" has been the traditional first program since the 1970s. It proves the whole chain works: your file, the interpreter, and the screen. The quotation marks are not printed; they tell Python where the text starts and ends.",
        codeChallenge: {
          task: "Now make it yours. Write a program that prints your own name on the screen, instead of Hello, World!",
          starter: "# Print your name below this line\n",
          sample: "Chiamaka Okafor",
          tests: [
            {
              check:
                'assert calls("print"), "Use print() to show your name."\n' +
                'assert lines, "Your program did not print anything. Put your name in quotes inside print( )."\n' +
                'assert norm(lines[0]) != "hello, world!", "That is the example. Print your own name instead."\n' +
                'assert any(c.isalpha() for c in lines[0]), "Print your name: it should contain letters."',
            },
          ],
          solution: 'print("Chiamaka Okafor")\n',
          hint: 'Copy the shape exactly: print("...") with your name between the quotation marks.',
          successMessage:
            "That is a program you wrote yourself. It is one line, and it has everything every program has: an instruction, run by Python, producing output.",
        },
      },
      {
        id: "a-pp-many-lines",
        title: "Programs run line by line",
        explain:
          "A program can have as many lines as you like. Python runs them in order, top to bottom, and each print() starts a new line on the screen. This is the sequence idea from Lesson 1, now in real code.",
        code: {
          language: PY,
          code: 'print("My name is Tunde.")\nprint("I live in Ibadan.")\nprint("I am learning Python.")\n',
          expectedOutput: "My name is Tunde.\nI live in Ibadan.\nI am learning Python.",
        },
        codeChallenge: {
          task: "Write a three-line introduction of yourself: one print() for your name, one for the city or town you live in, and one for something you want to build with Python.",
          starter: "# Three print() lines about you\n",
          sample: "My name is Ada.\nI live in Enugu.\nI want to build a school app.",
          tests: [
            {
              check:
                'assert len(lines) >= 3, "Print at least three lines: your name, your city, and what you want to build. You printed " + str(len(lines)) + "."\n' +
                'assert all(l.strip() for l in lines[:3]), "One of your first three lines is empty. Give each print() some text."\n' +
                'assert len(set(lines[:3])) == 3, "Each of the three lines should say something different."',
            },
          ],
          solution: 'print("My name is Ada.")\nprint("I live in Enugu.")\nprint("I want to build a school app.")\n',
          hint: "Three separate print() lines, one under the other, each with its own text in quotes.",
          successMessage: "Three instructions, three lines, in the order you wrote them. Swap two of your lines and run it again to see the order change.",
        },
      },
      {
        id: "a-pp-first-calculation",
        title: "Letting Python do the calculation",
        explain:
          "Text in quotes is printed exactly as written. A calculation WITHOUT quotes is worked out first, and print() shows the answer. This is the \"calculate two numbers\" algorithm from Lesson 3, now running for real.",
        code: {
          language: PY,
          code: 'print("7 + 5")\nprint(7 + 5)\nprint(125 - 37)\n',
          expectedOutput: "7 + 5\n12\n88",
        },
        why: "The first line prints the characters 7 + 5 because they are inside quotes. The second line has no quotes, so Python calculates 12 and prints that. Quotes mean \"this exact text\"; no quotes means \"work this out\".",
        codeChallenge: {
          task: "A market trader sold goods worth 4850 naira in the morning and 3975 naira in the afternoon. Write a program that prints the total for the day, then on a second line the difference between the morning and the afternoon. Let Python do the arithmetic: do not type the answers yourself.",
          starter: "# Use print() with a calculation inside, with no quotes\n",
          sample: "8825\n875",
          tests: [
            {
              check:
                'assert len(lines) >= 2, "Print two lines: the total, then the difference."\n' +
                'assert lines[0].strip() == "8825", "Your first line should be the total, 4850 + 3975. You printed: " + lines[0]\n' +
                'assert lines[1].strip() == "875", "Your second line should be the difference, 4850 - 3975. You printed: " + lines[1]\n' +
                'import re\n' +
                'assert not re.search(r"\\b(8825|875)\\b", source), "Let Python calculate. Put 4850 + 3975 inside print(), not the answer."',
            },
          ],
          solution: "print(4850 + 3975)\nprint(4850 - 3975)\n",
          hint: "print(4850 + 3975) on the first line. What goes on the second?",
          successMessage: "8825 and 875, calculated by Python. Change one of the numbers and run it again: the answers update themselves. That is the point of letting the computer calculate.",
        },
      },
    ],

    task: {
      title: "Module 1 practice: algorithms, then a program of your own",
      intro:
        "Do this in a notebook or a text file, then in VS Code. The milestone for this module is to explain what a program does and write a simple Python program independently.",
      prompts: [
        "Write the algorithm for making tea as numbered steps, with inputs and output. Include at least one decision (sugar or no sugar).",
        "Write pseudocode for calculating two numbers: their sum, difference, product and quotient. Then draw it as a flowchart using the standard shapes.",
        "Write pseudocode and draw a flowchart that decides whether a student passed an examination (pass mark 50). Dry-run it for scores of 49, 50 and 51.",
        "In VS Code, create about_me.py that prints at least four lines about you, and one line that prints the result of a calculation (for example your age in months: years × 12).",
        "Explain to someone else, in two or three sentences, what your program does and what happens when you press Run.",
      ],
      closing:
        "Keep these files. Next module you will make your programs ask the user for information instead of printing fixed text.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
