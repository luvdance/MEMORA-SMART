/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 1
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l1-what-is-programming": {
    lessonId: "pp-l1-what-is-programming",
    passMark: 70,
    questions: [
      {
        id: "ppq1-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-what-is-programming",
        prompt: "What is a program?",
        options: [
          { id: "a", text: "A list of instructions a computer follows to do a job" },
          { id: "b", text: "The physical parts inside a computer" },
          { id: "c", text: "Any file saved on a computer" },
          { id: "d", text: "A website" },
        ],
        correct: "a",
        explanation: "A program is a sequence of instructions. Programming is the work of writing them precisely enough for a computer to follow.",
        whyWrong: {
          b: "The physical parts are hardware. A program is software: instructions.",
          c: "A photo or a document is a file but not a program; it contains data, not instructions.",
          d: "A website is built from programs, but the word program means the instructions themselves.",
        },
      },
      {
        id: "ppq1-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-programs-instructions",
        prompt: "A program shows a receipt total, then asks for the price of the item. What is wrong?",
        options: [
          { id: "a", text: "Nothing: the computer will reorder the steps" },
          { id: "b", text: "It uses the price before collecting it; collecting must come first" },
          { id: "c", text: "Receipts cannot be printed by programs" },
          { id: "d", text: "It needs more steps to be valid" },
        ],
        correct: "b",
        explanation: "Instructions run in the order they are written. Information must be collected before it can be used.",
        whyWrong: {
          a: "Computers never reorder your instructions. They do exactly what is written, in order.",
          c: "They can; you will print one in Module 2.",
          d: "The number of steps is not the issue. Their order is.",
        },
      },
      {
        id: "ppq1-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-algorithms",
        prompt: "Which of these is NOT a property of a good algorithm?",
        options: [
          { id: "a", text: "Each step is precise" },
          { id: "b", text: "It finishes" },
          { id: "c", text: "It must be written in Python" },
          { id: "d", text: "It has defined inputs and outputs" },
        ],
        correct: "c",
        explanation: "An algorithm is the method itself. It can be written in plain English, pseudocode, a flowchart or any programming language.",
        whyWrong: {
          a: "Precision is essential: a computer cannot guess what a vague step means.",
          b: "An algorithm that never finishes never produces its output.",
          d: "Without known inputs and outputs you cannot tell whether it works.",
        },
      },
      {
        id: "ppq1-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-problem-solving",
        prompt: "For a program that converts a temperature from Celsius to Fahrenheit, what is the OUTPUT?",
        options: [
          { id: "a", text: "The temperature in Celsius" },
          { id: "b", text: "The formula F = C × 9 / 5 + 32" },
          { id: "c", text: "The temperature in Fahrenheit" },
          { id: "d", text: "The thermometer" },
        ],
        correct: "c",
        explanation: "The output is the result the program gives back: the converted temperature.",
        whyWrong: {
          a: "That is the input, the information the program starts with.",
          b: "The formula is the process, the work done on the input.",
          d: "A thermometer is not part of the program at all.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l2-how-computers-run-code": {
    lessonId: "pp-l2-how-computers-run-code",
    passMark: 70,
    questions: [
      {
        id: "ppq2-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-hardware-software",
        prompt: "Which of these is an operating system?",
        options: [
          { id: "a", text: "VS Code" },
          { id: "b", text: "Windows" },
          { id: "c", text: "The CPU" },
          { id: "d", text: "Python" },
        ],
        correct: "b",
        explanation: "Windows, macOS, Linux and Android are operating systems: the software that manages the hardware for every other program.",
        whyWrong: {
          a: "VS Code is an application that runs on top of the operating system.",
          c: "The CPU is hardware: the chip that carries out instructions.",
          d: "Python is a programming language and its interpreter, an application.",
        },
      },
      {
        id: "ppq2-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-languages",
        prompt: "Why do programmers write in high-level languages like Python instead of machine code?",
        options: [
          { id: "a", text: "Machine code is illegal" },
          { id: "b", text: "High-level code is readable by people and is translated into machine code for them" },
          { id: "c", text: "Computers understand Python directly, without translation" },
          { id: "d", text: "High-level languages need no precision" },
        ],
        correct: "b",
        explanation: "A high-level language is close to human language yet precise, and an interpreter or compiler translates it to the machine code the CPU runs.",
        whyWrong: {
          a: "It is legal, just extremely slow and error-prone to write by hand.",
          c: "The CPU only runs machine code. Python must be translated by the interpreter.",
          d: "They need exactly as much precision; they are simply easier to read.",
        },
      },
      {
        id: "ppq2-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-interpreters-compilers",
        prompt: "Which statement about Python is true?",
        options: [
          { id: "a", text: "It is interpreted: Python runs your source code directly, instruction by instruction" },
          { id: "b", text: "It must be compiled into an .exe file before every run" },
          { id: "c", text: "It only runs on Windows" },
          { id: "d", text: "Source code is the 1s and 0s a CPU runs" },
        ],
        correct: "a",
        explanation: "Python is an interpreted language: save your .py file and run it, with no separate build step.",
        whyWrong: {
          b: "That describes compiled languages such as C. Python runs source directly.",
          c: "Python runs on Windows, macOS and Linux.",
          d: "Source code is the text you write. Machine code is the 1s and 0s.",
        },
      },
      {
        id: "ppq2-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-how-python-runs",
        prompt: "print(\"A\")\nprint(\"B\")\nprint(C)\nprint(\"D\")\n\nWhat appears before the error message?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "A and B" },
          { id: "c", text: "A, B and D" },
          { id: "d", text: "A, B, C and D" },
        ],
        correct: "b",
        explanation: "Python runs top to bottom. Line 3 uses a name C that does not exist (it has no quotes), so Python stops there. Lines 1 and 2 already ran; line 4 never runs.",
        whyWrong: {
          a: "The file has no syntax error, so lines 1 and 2 run before the failure.",
          c: "Python stops at the failing line. Nothing after it runs.",
          d: "C has no quotes, so Python looks for a variable called C and fails.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l3-plan-before-code": {
    lessonId: "pp-l3-plan-before-code",
    passMark: 70,
    questions: [
      {
        id: "ppq3-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-decomposition",
        prompt: "What is decomposition?",
        options: [
          { id: "a", text: "Deleting old code" },
          { id: "b", text: "Breaking a big problem into smaller problems that are easy to solve" },
          { id: "c", text: "Translating Python into machine code" },
          { id: "d", text: "Drawing a flowchart" },
        ],
        correct: "b",
        explanation: "Decomposition splits a problem into smaller pieces until each one is small enough to solve directly.",
        whyWrong: {
          a: "Deleting code is not decomposition.",
          c: "That is what an interpreter or compiler does.",
          d: "A flowchart is a way to draw an algorithm; decomposition is about breaking the problem down.",
        },
      },
      {
        id: "ppq3-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-pseudocode",
        prompt: "SET a TO 10\nSET b TO 4\nSET a TO a - b\nOUTPUT a\n\nWhat is output?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "4" },
          { id: "c", text: "6" },
          { id: "d", text: "14" },
        ],
        correct: "c",
        explanation: "a starts at 10, b is 4, then a is set to 10 - 4, which is 6.",
        whyWrong: {
          a: "a changed on line 3. The output shows its latest value.",
          b: "That is b, not a.",
          d: "That would be a + b. Line 3 subtracts.",
        },
      },
      {
        id: "ppq3-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-flowchart-symbols",
        prompt: "In a flowchart, which shape is used for INPUT and OUTPUT?",
        options: [
          { id: "a", text: "Diamond" },
          { id: "b", text: "Oval" },
          { id: "c", text: "Parallelogram" },
          { id: "d", text: "Rectangle" },
        ],
        correct: "c",
        explanation: "A parallelogram means getting or showing information.",
        whyWrong: {
          a: "A diamond is a decision: a yes/no question.",
          b: "An oval marks the start or end.",
          d: "A rectangle is a process, such as a calculation.",
        },
      },
      {
        id: "ppq3-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-reading-flowcharts",
        prompt: "In the pass/fail flowchart (pass mark 50), a student scores exactly 50. Which arrow leaves the diamond \"score >= 50?\"",
        options: [
          { id: "a", text: "YES, so the output is \"Pass\"" },
          { id: "b", text: "NO, so the output is \"Fail\"" },
          { id: "c", text: "Both arrows" },
          { id: "d", text: "Neither; the chart stops" },
        ],
        correct: "a",
        explanation: ">= means \"greater than or equal to\". 50 is equal to 50, so the answer is YES.",
        whyWrong: {
          b: "That would be true for > 50. The diamond says >= 50, which includes 50.",
          c: "Exactly one arrow is taken from a decision.",
          d: "Every input takes one of the two paths.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l4-first-python-program": {
    lessonId: "pp-l4-first-python-program",
    passMark: 70,
    questions: [
      {
        id: "ppq4-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-why-python",
        prompt: "Which of these is Python commonly used for?",
        options: [
          { id: "a", text: "Only making video games" },
          { id: "b", text: "Web backends, automation, data analysis and machine learning" },
          { id: "c", text: "Only teaching children" },
          { id: "d", text: "Designing computer chips by hand" },
        ],
        correct: "b",
        explanation: "Python is a general-purpose language used across backends, automation, data, AI, testing and security.",
        whyWrong: {
          a: "Games are possible but far from Python's main use.",
          c: "It is easy to learn, but it runs some of the largest systems in the world.",
          d: "That is not something Python is used for.",
        },
      },
      {
        id: "ppq4-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-install-python",
        prompt: "On Windows, after installing Python, typing python --version says \"python is not recognized\". What is the most likely cause?",
        options: [
          { id: "a", text: "The computer is too old for Python" },
          { id: "b", text: "\"Add python.exe to PATH\" was not ticked during installation" },
          { id: "c", text: "Python only works inside a browser" },
          { id: "d", text: "VS Code must be uninstalled" },
        ],
        correct: "b",
        explanation: "PATH is the list of places the terminal looks for programs. Without the option ticked, the terminal cannot find python. Modify the install and reopen VS Code.",
        whyWrong: {
          a: "Python runs on very old computers. This is a settings problem.",
          c: "Python is installed on your computer and runs in the terminal.",
          d: "VS Code is not the problem; the terminal simply cannot find Python.",
        },
      },
      {
        id: "ppq4-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-hello-world",
        prompt: "print(\"Good morning\")\n\nWhat is shown on the screen?",
        options: [
          { id: "a", text: "print(\"Good morning\")" },
          { id: "b", text: "\"Good morning\"" },
          { id: "c", text: "Good morning" },
          { id: "d", text: "Nothing" },
        ],
        correct: "c",
        explanation: "print() shows the text between the quotes. The quotes mark where the text begins and ends; they are not printed.",
        whyWrong: {
          a: "The instruction is run, not displayed.",
          b: "The quotation marks are not part of the output.",
          d: "print() always shows something on the screen.",
        },
      },
      {
        id: "ppq4-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-first-calculation",
        prompt: "print(\"3 * 4\")\nprint(3 * 4)\n\nWhat is printed?",
        options: [
          { id: "a", text: "12\n12" },
          { id: "b", text: "3 * 4\n3 * 4" },
          { id: "c", text: "3 * 4\n12" },
          { id: "d", text: "12\n3 * 4" },
        ],
        correct: "c",
        explanation: "Text in quotes is printed exactly as written. Without quotes, Python calculates 3 × 4 and prints 12.",
        whyWrong: {
          a: "The first line is inside quotes, so it is printed as text, not calculated.",
          b: "The second line has no quotes, so Python works it out.",
          d: "The lines run in order: the quoted text comes first.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
