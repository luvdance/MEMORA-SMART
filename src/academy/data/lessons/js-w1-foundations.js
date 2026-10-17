/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 1 · THE FOUNDATION OF EVERYTHING
 *
 * Curriculum 1.1 – 1.8. No JavaScript this week, on purpose: the learner meets
 * programs, algorithms, pseudocode, flowcharts and decomposition first, so the
 * syntax that arrives in Week 3 has logic to attach to.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Pseudocode exercises carry an `equivalent` in JavaScript. The learner never
 * sees it run; the content validator does, so every dry-run answer in this
 * week is checked by a machine rather than by the author's arithmetic.
 */

export const SECTION_ID = "js-s1-foundations";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l1-what-a-program-is",
    moduleId: "js-w1-foundations",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2", "1.3"],
    title: "What a Program Actually Is",
    subtitle: "Before any code, the idea code is made of",
    estimatedMinutes: 12,
    intro:
      "Most people who give up on programming were taught to type before they were taught to think. This course does it the other way round. For two weeks there is no JavaScript at all, only the logic every program in every language is built from. When the syntax arrives in Week 3, it will have somewhere to land.",

    atoms: [
      {
        id: "a-js-what-is-programming",
        title: "Programming is giving exact instructions",
        explain:
          "Programming is the work of describing a task so precisely that a machine with no common sense can carry it out. A program is the result: a list of instructions, written in a language the computer can follow, that turns some starting information into a useful result.",
        why: "A computer never guesses what you meant. It does exactly what you wrote, in exactly the order you wrote it, every time. That is why programs are reliable, and also why almost every bug is a gap between what the author meant and what they actually said.",
        analogy:
          "Explaining to a friend how to get to your house, versus programming a robot to do it. Your friend fills in the gaps: \"turn left at the big tree\" works because they know what a tree is. The robot needs the distance, the angle and what to do if the road is closed.",
        table: {
          caption: "The two words this whole course rests on.",
          headers: ["Word", "Meaning", "Example"],
          rows: [
            ["Programming", "The activity: designing and writing instructions", "Working out how to calculate a student's grade"],
            ["Program", "The product: the finished set of instructions", "The grade calculator a teacher actually runs"],
            ["Instruction", "One step the computer can carry out", "Add the three scores together"],
          ],
        },
        mistake:
          "Thinking programming means memorising a language. The language is the easy part and changes every decade. The skill is breaking a task into precise steps, and that transfers to every language you will ever use.",
      },
      {
        id: "a-js-ipo",
        title: "Input, processing, output",
        explain:
          "Every program, from a calculator to a banking app, does three things. It takes INPUT (information coming in), PROCESSES it (calculates, compares, decides, stores), and produces OUTPUT (information going out). Naming these three before you write anything is the first step of designing any program.",
        why: "If you cannot say what goes in and what should come out, you cannot write the middle, and you cannot test whether it works. Professional developers write the inputs and expected outputs down first for exactly this reason.",
        table: {
          caption: "The same three parts, in programs you already use.",
          headers: ["Program", "Input", "Processing", "Output"],
          rows: [
            ["Calculator", "Two numbers and an operation", "Perform the operation", "The result"],
            ["ATM withdrawal", "Card, PIN, amount", "Check PIN, check balance, subtract", "Cash, receipt, new balance"],
            ["Maps app", "Start and destination", "Search possible routes", "The fastest route and an arrival time"],
            ["Grade calculator", "Three test scores", "Add, divide by 3, compare to grade bands", "Average and a letter grade"],
          ],
        },
        decision: {
          scenario:
            "You are designing a program for a shop that prints a receipt. The cashier scans items and the program shows the total, then prints a receipt.",
          question: "Which of these is PROCESSING rather than input or output?",
          options: [
            {
              id: "a",
              text: "The barcode of each item being scanned",
              whyWrong: "The barcode arrives from outside the program, from the scanner. Information coming in is input.",
            },
            {
              id: "b",
              text: "Looking up each item's price and adding it to a running total",
              why: "This happens inside the program, turning what came in into what will go out. Looking things up, calculating and deciding are all processing.",
            },
            {
              id: "c",
              text: "The printed receipt",
              whyWrong: "The receipt leaves the program and goes to the customer. Information going out is output.",
            },
            {
              id: "d",
              text: "The total shown on the screen",
              whyWrong: "The total is the result being shown to a person, which makes it output, even though it was calculated by processing.",
            },
          ],
          correct: "b",
          aftermath:
            "A useful test: if it crosses the boundary of the program, coming in or going out, it is input or output. If it happens entirely inside, it is processing.",
        },
      },
      {
        id: "a-js-languages-source",
        title: "Programming languages and source code",
        explain:
          "A computer's processor only understands machine code: long sequences of numbers. Writing that by hand is slow and error-prone, so people invented programming languages, which read much more like English and mathematics. What you write in one of those languages is called source code: plain text that a person can read and edit.",
        why: "Source code is written for two readers. The computer has to be able to run it, and a person, often you in six months, has to be able to understand and change it. A program that works but nobody can read is a program nobody can fix.",
        example:
          "The same instruction at three levels:\n\n  Machine code     10110000 01100001          (what the processor runs)\n  Assembly         MOV AL, 61h                (a thin layer over it)\n  JavaScript       let letter = \"a\";          (what you will write)\n\nAll three can mean \"store the letter a\". Only one is pleasant to read.",
        table: {
          caption: "A few languages, and where you meet them.",
          headers: ["Language", "Mostly used for"],
          rows: [
            ["JavaScript", "Websites, web apps, servers with Node.js, mobile apps"],
            ["Python", "Data analysis, automation, machine learning"],
            ["Java and Kotlin", "Android apps, large business systems"],
            ["C and C++", "Operating systems, games, devices"],
            ["SQL", "Asking questions of databases"],
          ],
        },
      },
      {
        id: "a-js-compilers-interpreters",
        title: "Compilers and interpreters",
        explain:
          "Source code has to be translated into something the machine can run. A compiler translates the whole program ahead of time into a separate file that runs on its own. An interpreter reads the source and carries it out as it goes. Modern JavaScript engines do a mixture of both: they start interpreting immediately and compile the parts that run often, while the program is running. This is called just-in-time compilation.",
        why: "This explains something you will see in Week 3. In JavaScript, a mistake on line 40 may not be reported until line 40 is actually reached, because nothing checked the whole program in advance. In a compiled language that same mistake might stop the program from being built at all.",
        table: {
          caption: "Two strategies, and JavaScript's mixture.",
          headers: ["", "Compiler", "Interpreter", "JavaScript engine (V8, SpiderMonkey)"],
          rows: [
            ["When it translates", "All at once, before running", "Line by line, while running", "Starts at once, compiles hot code while running"],
            ["What you run", "A compiled file", "The source itself", "The source itself"],
            ["Example languages", "C, Rust, Go", "Early BASIC, shell scripts", "JavaScript"],
          ],
        },
        mistake:
          "Saying \"JavaScript is interpreted, so it is slow\". That was true in 1998. Today's engines compile frequently used code to machine code while it runs, which is why JavaScript runs everything from Google Maps to game engines.",
      },
      {
        id: "a-js-program-precision",
        title: "Why precision is the whole job",
        explain:
          "A program cannot handle a situation its author did not describe. If the instructions say what to do when a score is above 70 and when it is below 70, the program has no idea what to do with exactly 70. Most of the thinking in programming is finding these gaps before the computer does.",
        why: "Every lesson in this course trains the same habit: asking \"what happens if…?\" about every input. Empty input, zero, a negative number, the exact boundary value, text where a number was expected. Programmers who ask these questions early write programs that do not break.",
        practice: {
          prompt:
            "An instruction reads: \"If the customer is over 18, let them in. If they are under 18, turn them away.\" What is missing?",
          answer:
            "What to do with someone who is exactly 18. The instructions cover over and under, but not equal. In code this is a boundary bug, and it is one of the most common bugs there is. A precise version: \"If the customer is 18 or over, let them in. Otherwise, turn them away.\" Now every possible age has exactly one outcome.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.4 – 1.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l2-algorithms-pseudocode",
    moduleId: "js-w1-foundations",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.4", "1.5"],
    title: "Algorithms and Pseudocode",
    subtitle: "Designing the steps before writing the code",
    estimatedMinutes: 13,
    intro:
      "An algorithm is the plan. Code is one way of writing the plan down. In this lesson you design algorithms and write them in pseudocode, a structured plain-English notation that every programmer uses to think before typing.",

    atoms: [
      {
        id: "a-js-algorithm-def",
        title: "An algorithm is a finite list of precise steps",
        explain:
          "An algorithm is a step-by-step method for solving a problem. A good algorithm has four properties: every step is precise, the steps are in a definite order, it accepts some input and produces some output, and it always finishes.",
        why: "An algorithm does not need a computer. A recipe is an algorithm, and so is long division. Learning to write algorithms for everyday tasks is how you learn to write them for programs, because the thinking is identical.",
        example:
          "ALGORITHM: Make a cup of tea\n\n  1. Fill the kettle with water\n  2. Switch the kettle on\n  3. Wait until the water boils\n  4. Put one tea bag in a cup\n  5. Pour the boiled water into the cup\n  6. Wait 3 minutes\n  7. Remove the tea bag\n  8. If the person wants milk, add milk\n  9. If the person wants sugar, add one spoon of sugar and stir\n 10. Serve the tea\n\nInput: water, tea bag, the person's preferences\nOutput: a cup of tea made the way they asked",
        table: {
          caption: "The four properties, checked against the tea algorithm.",
          headers: ["Property", "Means", "In the tea algorithm"],
          rows: [
            ["Precise", "Each step has one meaning", "\"Wait 3 minutes\", not \"wait a bit\""],
            ["Ordered", "Steps happen in a fixed sequence", "Boil before pouring, not after"],
            ["Input and output", "Something goes in, something comes out", "Preferences in, a cup of tea out"],
            ["Finite", "It always ends", "Step 10 ends it; \"wait until it boils\" ends when it boils"],
          ],
        },
      },
      {
        id: "a-js-algorithm-order",
        title: "Order changes the result",
        explain:
          "The same steps in a different order can produce a different result, or no result at all. Pouring water into the cup before boiling it gives you cold tea. Removing the tea bag before pouring gives you hot water. Sequence is not a detail; it is part of the meaning.",
        why: "This is the first of the three structures every program is built from, and you will study it formally in Week 2. In code, a variable used before it has been given a value, or a total printed before the numbers have been added, are both ordering bugs.",
        decision: {
          scenario:
            "An algorithm for withdrawing cash reads:\n1. Give the customer the cash\n2. Ask for the amount\n3. Check the balance is high enough\n4. Subtract the amount from the balance",
          question: "What is the correct order?",
          options: [
            {
              id: "a",
              text: "2, 3, 4, 1",
              why: "Ask, check, record, then pay out. The cash leaves last, only after the balance has been checked and the withdrawal recorded, so the bank can never pay out money it has not accounted for.",
            },
            {
              id: "b",
              text: "2, 1, 3, 4",
              whyWrong: "This pays out before checking the balance. A customer with no money gets cash, and the check afterwards is too late to matter.",
            },
            {
              id: "c",
              text: "3, 2, 4, 1",
              whyWrong: "You cannot check whether the balance is high enough before you know the amount. Step 3 needs the input that step 2 collects.",
            },
            {
              id: "d",
              text: "2, 3, 1, 4",
              whyWrong: "Close, but if the machine fails between paying out and recording, the customer has the cash and the balance never changed. Recording before paying out is the safer order.",
            },
          ],
          correct: "a",
          aftermath:
            "Two lessons in one question. A step cannot use information that has not been collected yet, and when two orders both seem to work, choose the one that fails safely.",
        },
      },
      {
        id: "a-js-pseudocode",
        title: "Pseudocode: structured plain English",
        explain:
          "Pseudocode is a way of writing an algorithm that sits between English and code. It uses a small set of capitalised keywords (INPUT, OUTPUT, SET, IF, THEN, ELSE, END IF, WHILE, FOR) and indentation to show structure. It is not a real programming language and nothing runs it. It exists so you can think about the logic without worrying about syntax.",
        why: "Pseudocode translates almost line for line into any programming language. If your pseudocode is right, writing the JavaScript is mostly typing. If it is wrong, no amount of JavaScript knowledge will save the program.",
        table: {
          caption: "The pseudocode keywords used in this course.",
          headers: ["Keyword", "Meaning", "Example"],
          rows: [
            ["INPUT", "Receive a value from outside", "INPUT price"],
            ["OUTPUT", "Show or send a value out", "OUTPUT total"],
            ["SET … TO", "Store a value under a name", "SET total TO 0"],
            ["IF … THEN … ELSE … END IF", "Make a decision", "IF age >= 18 THEN …"],
            ["WHILE … END WHILE", "Repeat while a condition is true", "WHILE balance > 0"],
            ["FOR … FROM … TO … END FOR", "Repeat a set number of times", "FOR i FROM 1 TO 3"],
          ],
        },
        mistake:
          "Writing pseudocode that is really just vague English: \"work out the price and stuff\". If a step could mean two different things, it is not pseudocode yet. Each line should be something you could hand to someone and they would do exactly one thing.",
      },
      {
        id: "a-js-pseudo-total",
        title: "Pseudocode for the total cost of three products",
        explain:
          "Here is a complete piece of pseudocode for one of this week's practical exercises: calculating the total cost of three products. Read it from top to bottom, one line at a time, keeping track of what each name holds.",
        why: "Reading pseudocode line by line and tracking values is called dry-running. It is the single most important skill in this course, and you will do it formally with a table in Week 2.",
        codeExercise: {
          language: "pseudocode",
          code:
            "SET priceA TO 1200\nSET priceB TO 850\nSET priceC TO 450\nSET total TO priceA + priceB + priceC\nOUTPUT total\n",
          question: "The three products cost 1200, 850 and 450. What does this algorithm OUTPUT?",
          expectedOutput: "2500",
          hint: "Line 4 adds the three values stored on lines 1 to 3. Add 1200 and 850 first, then add 450.",
          successMessage:
            "2500. You just dry-ran your first algorithm: you followed the names, worked out the value at each step, and arrived at the output without a computer.",
          equivalent:
            "let priceA = 1200;\nlet priceB = 850;\nlet priceC = 450;\nlet total = priceA + priceB + priceC;\nconsole.log(total);\n",
        },
      },
      {
        id: "a-js-pseudo-input",
        title: "Generalising with INPUT",
        explain:
          "The algorithm above only ever works out one total, because the prices are written into it. Replace the fixed values with INPUT and the same algorithm works for any three products. That move, from a specific answer to a general method, is what makes something a program rather than a calculation.",
        why: "Programs are valuable because they are reused. A teacher does not want a program that grades one student; they want one that grades any student. Every time you write a fixed number into an algorithm, ask whether it should really be an input.",
        example:
          "ALGORITHM: Total cost of three products\n\n  INPUT priceA\n  INPUT priceB\n  INPUT priceC\n  SET total TO priceA + priceB + priceC\n  OUTPUT \"Total: \", total\n\nRun 1:  inputs 1200, 850, 450   output  Total: 2500\nRun 2:  inputs 300, 300, 400    output  Total: 1000\n\nOne algorithm, any three prices.",
        practice: {
          prompt:
            "Extend the algorithm so it also outputs the average price of the three products. What line or lines do you add, and where?",
          answer:
            "After total has been calculated, add: SET average TO total / 3, then OUTPUT \"Average: \", average. It must come after the total line, because average uses total. Placed before it, total would not have a value yet: an ordering bug.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l3-flowcharts",
    moduleId: "js-w1-foundations",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.6"],
    title: "Flowcharts",
    subtitle: "Sequence, decisions and repetition, drawn",
    estimatedMinutes: 12,
    intro:
      "Pseudocode describes an algorithm in words. A flowchart draws it. Both say the same thing, but a flowchart makes the shape of the logic visible: where it branches, where it loops back, and whether every path actually reaches the end.",

    atoms: [
      {
        id: "a-js-flow-symbols",
        title: "The flowchart symbols",
        explain:
          "Flowcharts use a small set of standard shapes joined by arrows. The shape tells you what kind of step it is; the arrows tell you the order. Every flowchart has exactly one Start and at least one End.",
        table: {
          caption: "The five shapes you need.",
          headers: ["Shape", "Name", "Used for", "Example"],
          rows: [
            ["Rounded rectangle (oval)", "Terminator", "Start and End", "Start"],
            ["Parallelogram", "Input / Output", "Reading or showing a value", "INPUT age"],
            ["Rectangle", "Process", "Calculating or storing", "SET total TO a + b"],
            ["Diamond", "Decision", "A yes/no question", "Is age >= 18?"],
            ["Arrow", "Flow line", "What happens next", "→"],
          ],
        },
        why: "Because the shapes are standard, anyone can read your flowchart, a teammate, an examiner or a client, without knowing any programming language.",
        mistake:
          "Writing two questions in one diamond, like \"Is age over 18 and a citizen?\". Each diamond asks one yes/no question with exactly two exits. Two conditions need two diamonds, or the logic becomes impossible to follow.",
      },
      {
        id: "a-js-flow-sequence",
        title: "Sequence in a flowchart",
        explain:
          "The simplest flowchart is a straight line: each step leads to exactly one next step. This is sequence, the same idea as the numbered steps of an algorithm. The flowchart below calculates the total of three products.",
        example:
          "    ( Start )\n        │\n        ▼\n  / INPUT a, b, c /\n        │\n        ▼\n  [ SET total TO a + b + c ]\n        │\n        ▼\n  / OUTPUT total /\n        │\n        ▼\n     ( End )",
        why: "Every more complicated flowchart is made of straight sequences joined by decisions and loops. If you can read a straight line, you can read any flowchart one segment at a time.",
      },
      {
        id: "a-js-flow-decision",
        title: "Decisions: the voting age flowchart",
        explain:
          "A decision diamond asks a question with two possible answers, and each answer has its own arrow. The paths split at the diamond and usually join up again before End. Here is one of this week's practical exercises: deciding whether someone is old enough to vote, with a voting age of 18.",
        example:
          "        ( Start )\n            │\n            ▼\n       / INPUT age /\n            │\n            ▼\n      ◇ age >= 18 ? ◇\n       │          │\n      Yes         No\n       │          │\n       ▼          ▼\n / OUTPUT      / OUTPUT\n  \"Can vote\" /  \"Cannot vote yet\" /\n       │          │\n       └────┬─────┘\n            ▼\n         ( End )",
        why: "Notice the question is age >= 18, not age > 18. Someone who is exactly 18 can vote. Checking the boundary value is the habit from Lesson 1, and a flowchart makes the boundary impossible to ignore because you have to write the condition in the diamond.",
        decision: {
          scenario:
            "A cinema charges 1500 for children under 12, 3000 for adults, and 2000 for people aged 65 and over.",
          question: "What is the fewest number of decision diamonds a correct flowchart needs?",
          options: [
            {
              id: "a",
              text: "One",
              whyWrong: "One yes/no question can only separate two groups. There are three prices, so at least one more question is needed to split one of the groups again.",
            },
            {
              id: "b",
              text: "Two",
              why: "Ask \"age < 12?\" first: yes gives 1500. On the No path ask \"age >= 65?\": yes gives 2000, no gives 3000. Three outcomes need two diamonds, because each diamond splits one path into two.",
            },
            {
              id: "c",
              text: "Three, one for each price",
              whyWrong: "That works but uses one more question than needed. Once you know someone is not under 12 and not 65 or over, they must be an adult: there is nothing left to ask.",
            },
            {
              id: "d",
              text: "It cannot be drawn as a flowchart",
              whyWrong: "Any decision with any number of outcomes can be drawn, by chaining yes/no questions. This is exactly what flowcharts are for.",
            },
          ],
          correct: "b",
          aftermath:
            "A rule worth keeping: N different outcomes need at least N − 1 yes/no decisions. You will see the same chain in code in Week 5 as if, else if, else.",
        },
      },
      {
        id: "a-js-flow-repetition",
        title: "Repetition: arrows that go back",
        explain:
          "When an arrow loops back to an earlier step, the steps between are repeated. A decision controls the loop: each time round it asks whether to go again or carry on to the end. This is repetition, also called iteration.",
        example:
          "Counting from 1 to 3:\n\n        ( Start )\n            │\n            ▼\n   [ SET count TO 1 ]\n            │\n            ▼\n  ┌──▶ ◇ count <= 3 ? ◇ ──No──▶ ( End )\n  │         │\n  │        Yes\n  │         ▼\n  │   / OUTPUT count /\n  │         │\n  │         ▼\n  └── [ SET count TO count + 1 ]\n\nOutput: 1, then 2, then 3. When count becomes 4,\nthe question is answered No and the loop ends.",
        why: "Without the step that adds 1 to count, the question would be answered Yes forever, and the loop would never end. An algorithm must be finite, and the thing that makes a loop finite is something inside it that moves it towards the exit.",
        mistake:
          "Drawing a loop with no way out, or with an exit condition that can never become true. On paper this is easy to spot if you trace the arrows; in a running program it freezes the page.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.7 – 1.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l4-decomposition-thinking",
    moduleId: "js-w1-foundations",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.7", "1.8"],
    title: "Decomposition and Computational Thinking",
    subtitle: "Big problems are just small problems stacked up",
    estimatedMinutes: 14,
    intro:
      "Nobody writes a banking app in one go. They break it into accounts, transactions, statements and security, then break each of those down again until every piece is small enough to solve in a few lines. That habit has a name, and it is the core of how programmers think.",

    atoms: [
      {
        id: "a-js-decomposition",
        title: "Decomposition",
        explain:
          "Decomposition is breaking a large problem into smaller sub-problems, and breaking those down again, until each piece is simple enough to solve directly. Solve the pieces, put them together, and you have solved the whole problem.",
        why: "A problem that feels impossible is usually just a problem that has not been broken down enough. Every function you write from Week 6 onwards is the result of decomposition: one small, named piece of a larger task.",
        example:
          "Problem: Student grade calculator\n\n  1. Get the scores\n       1a. Ask for the student's name\n       1b. Ask for three test scores\n  2. Calculate\n       2a. Add the three scores\n       2b. Divide by 3 to get the average\n  3. Decide the grade\n       3a. Compare the average to each grade band\n  4. Report\n       4a. Show the name, the average and the grade\n\nEach numbered line is now small enough to write in one or two lines of pseudocode.",
      },
      {
        id: "a-js-ipo-banking",
        title: "Decomposing a banking transaction",
        explain:
          "Decomposition and input-processing-output work together. Break a task into steps, then label each step as input, processing or output. Here is a transfer between two bank accounts, decomposed.",
        table: {
          caption: "A bank transfer, decomposed and labelled.",
          headers: ["Step", "Type"],
          rows: [
            ["Receive the sender's account, the recipient's account and the amount", "Input"],
            ["Check the sender's PIN or one-time code is correct", "Processing"],
            ["Check the amount is greater than zero", "Processing"],
            ["Check the sender's balance is at least the amount", "Processing"],
            ["Subtract the amount from the sender's balance", "Processing"],
            ["Add the amount to the recipient's balance", "Processing"],
            ["Show a confirmation with the new balance", "Output"],
            ["Send an SMS alert to both account holders", "Output"],
          ],
          note: "Most of the work is processing, and most of the processing is checks. That is typical of real programs.",
        },
        why: "Writing it out like this exposes questions you would otherwise miss. What if the amount is negative? What if the recipient account does not exist? Each question you find on paper is a bug you do not ship.",
      },
      {
        id: "a-js-computational-thinking",
        title: "Computational thinking: four habits",
        explain:
          "Computational thinking is the set of habits programmers use to approach any problem. There are four: decomposition (break it down), pattern recognition (notice what is similar to something you have solved), abstraction (ignore the details that do not matter), and algorithm design (write the precise steps).",
        table: {
          caption: "The four habits, applied to the grade calculator.",
          headers: ["Habit", "Question it asks", "Applied"],
          rows: [
            ["Decomposition", "What are the smaller parts?", "Input, calculate average, choose grade, report"],
            ["Pattern recognition", "Have I solved something like this?", "Averaging is the same for any number of scores"],
            ["Abstraction", "What can I ignore?", "The student's height, the date, the colour of the paper"],
            ["Algorithm design", "What are the exact steps?", "The pseudocode, line by line"],
          ],
        },
        why: "These habits are not specific to computers. They are why programmers are often good at planning projects, debugging a car, or organising an event: it is the same thinking.",
      },
      {
        id: "a-js-debugging-intro",
        title: "Debugging: finding where it goes wrong",
        explain:
          "A bug is a difference between what a program does and what it was meant to do. Debugging is the systematic search for that difference. The method is always the same: reproduce the problem, trace the steps one at a time, find the first step where the actual value differs from the expected value, then fix that step.",
        why: "Beginners debug by guessing and changing things at random. Professionals debug by tracing, because the first step that goes wrong is where the bug is, and everything after it is just a consequence.",
        codeExercise: {
          language: "pseudocode",
          code:
            "SET score1 TO 70\nSET score2 TO 80\nSET score3 TO 90\nSET average TO score1 + score2 + score3 / 3\nOUTPUT average\n",
          question:
            "This algorithm is meant to output the average of 70, 80 and 90, which is 80. Division happens before addition, just as in mathematics. What does it ACTUALLY output?",
          expectedOutput: "180",
          hint: "Only score3 is divided by 3, because division is done before addition. Work out 90 / 3 first, then add 70 and 80.",
          successMessage:
            "180, not 80. 90 / 3 is 30, then 70 + 80 + 30 is 180. The fix is brackets: (score1 + score2 + score3) / 3. You found the bug by tracing the one line where the value went wrong.",
          equivalent:
            "let score1 = 70;\nlet score2 = 80;\nlet score3 = 90;\nlet average = score1 + score2 + score3 / 3;\nconsole.log(average);\n",
        },
      },
      {
        id: "a-js-grade-design",
        title: "Designing the grade calculator",
        explain:
          "This is the week's mini-project, designed in full. The pseudocode below is the complete logic for a student grade calculator. Compare it with the flowchart you will draw for the project: they must describe exactly the same decisions in the same order.",
        example:
          "ALGORITHM: Student grade calculator\n\n  INPUT name\n  INPUT score1, score2, score3\n  SET average TO (score1 + score2 + score3) / 3\n\n  IF average >= 70 THEN\n      SET grade TO \"A\"\n  ELSE IF average >= 60 THEN\n      SET grade TO \"B\"\n  ELSE IF average >= 50 THEN\n      SET grade TO \"C\"\n  ELSE IF average >= 45 THEN\n      SET grade TO \"D\"\n  ELSE\n      SET grade TO \"F\"\n  END IF\n\n  OUTPUT name, average, grade",
        why: "The order of the checks matters. Checking average >= 50 first would give a student with 85 a C, because 85 is also greater than 50. Checking from the highest band down means the first true condition is always the right one.",
        codeExercise: {
          language: "pseudocode",
          code:
            "SET average TO 64\nIF average >= 70 THEN\n    SET grade TO \"A\"\nELSE IF average >= 60 THEN\n    SET grade TO \"B\"\nELSE IF average >= 50 THEN\n    SET grade TO \"C\"\nELSE\n    SET grade TO \"F\"\nEND IF\nOUTPUT grade\n",
          question: "A student's average is 64. What grade does the algorithm OUTPUT?",
          expectedOutput: "B",
          hint: "Check each condition from the top. Is 64 >= 70? If not, move to the next ELSE IF. The first condition that is true decides the grade, and the rest are skipped.",
          successMessage:
            "B. 64 is not 70 or more, but it is 60 or more, so the second branch runs and every branch after it is skipped. That skipping is what makes the order of the checks so important.",
          equivalent:
            "let average = 64;\nlet grade;\nif (average >= 70) {\n  grade = \"A\";\n} else if (average >= 60) {\n  grade = \"B\";\n} else if (average >= 50) {\n  grade = \"C\";\n} else {\n  grade = \"F\";\n}\nconsole.log(grade);\n",
        },
      },
    ],

    task: {
      title: "This week's practical work",
      intro:
        "Do these on paper or in any text editor. No code yet: the point is the logic. Keep them, because in Week 3 you will turn two of them into JavaScript.",
      prompts: [
        "Write an algorithm for making a cup of tea. Then swap with someone, or read it back pretending to be a robot, and find one step that could be misread.",
        "Design a flowchart that decides whether someone is old enough to vote. Use the correct shapes and test it with ages 17, 18 and 19.",
        "Write pseudocode that calculates the total cost of three products, using INPUT so it works for any three prices.",
        "Identify the inputs, processing steps and outputs of one simple banking transaction of your choice: a deposit, a withdrawal or a transfer.",
        "Mini-project: design the full logic for a student grade calculator, as both pseudocode and a flowchart. Dry-run it with averages of 45, 50, 69 and 70 and write down the grade each one should get.",
      ],
      closing:
        "If your pseudocode and your flowchart disagree for any of those test values, one of them has a bug. Finding it is exactly the skill this week is about.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
