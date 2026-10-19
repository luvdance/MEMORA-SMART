/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 1 · INTRODUCTION TO PROGRAMMING AND C++
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l1-welcome": {
    lessonId: "cp-l1-welcome",
    passMark: 70,
    questions: [
      {
        id: "cpq1-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-welcome-builds",
        prompt: "Which of these is largely written in C++?",
        options: [
          { id: "a", text: "The Unreal Engine, used to build many major games" },
          { id: "b", text: "A restaurant's one-page menu website" },
          { id: "c", text: "A PDF of last year's exam questions" },
          { id: "d", text: "A spreadsheet of class scores" },
        ],
        correct: "a",
        explanation: "Unreal Engine is written in C++, and games built on it are programmed in C++. Game engines are one of C++'s biggest homes because every frame must be computed in a few milliseconds.",
        whyWrong: {
          b: "A simple menu page is HTML and CSS. It does not need a compiled language.",
          c: "A PDF is a document: data, not a program.",
          d: "A spreadsheet file is data. The spreadsheet application is a program, but the file of scores is not.",
        },
      },
      {
        id: "cpq1-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-welcome-why",
        prompt: "What is the main reason C++ programs are fast?",
        options: [
          { id: "a", text: "They are compiled into the processor's own machine code before they run" },
          { id: "b", text: "C++ programs are always shorter than programs in other languages" },
          { id: "c", text: "C++ only runs on expensive computers" },
          { id: "d", text: "C++ skips checking whether the code is valid" },
        ],
        correct: "a",
        explanation: "A compiler translates C++ into machine code once, ahead of time. When the program runs there is nothing in between the program and the processor.",
        whyWrong: {
          b: "C++ programs are often longer than the same program in Python. Speed comes from compilation, not length.",
          c: "C++ runs on everything from tiny microcontrollers to supercomputers.",
          d: "The compiler checks C++ very strictly before building anything.",
        },
      },
      {
        id: "cpq1-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-welcome-phases",
        prompt: "In which phase of this course do you learn classes, encapsulation, inheritance and polymorphism?",
        options: [
          { id: "a", text: "Phase 3: object-oriented programming (Weeks 8–10)" },
          { id: "b", text: "Phase 1: programming foundations (Weeks 1–4)" },
          { id: "c", text: "Phase 2: core programming skills (Weeks 5–7)" },
          { id: "d", text: "They are not covered" },
        ],
        correct: "a",
        explanation: "Phase 3 covers memory and pointers, then classes, encapsulation, inheritance and polymorphism, ending with a school management model.",
        whyWrong: {
          b: "Phase 1 is variables, operators, decisions and loops: the foundations objects are built from.",
          c: "Phase 2 is functions, arrays, vectors and strings.",
          d: "Object-oriented programming is a whole phase of the course.",
        },
      },
      {
        id: "cpq1-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-welcome-method",
        prompt: "You have read a lesson's explanation and seen its example program. According to the course's learning method, what comes next?",
        options: [
          { id: "a", text: "Practise it yourself: predict the output, write the missing code, or make the call, and get it right before moving on" },
          { id: "b", text: "Move straight to the next lesson" },
          { id: "c", text: "Take the final certification exam" },
          { id: "d", text: "Memorise the example program word for word" },
        ],
        correct: "a",
        explanation: "Understand, demonstrate, practise, validate, apply, advance. Practice comes straight after the demonstration, and it gates progress.",
        whyWrong: {
          b: "Moving on before practising is how people end up able to read code but not write it.",
          c: "The final exam comes at the end of the course, after every lesson and module.",
          d: "Memorising a program is exactly what the method is designed to replace with understanding.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l2-programs": {
    lessonId: "cp-l2-programs",
    passMark: 70,
    questions: [
      {
        id: "cpq2-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-program-defined",
        prompt: "What is a computer program?",
        options: [
          { id: "a", text: "A set of exact instructions that tells a computer how to do a job" },
          { id: "b", text: "Any file stored on a computer" },
          { id: "c", text: "The physical parts of a computer" },
          { id: "d", text: "A list of suggestions the computer may choose to follow" },
        ],
        correct: "a",
        explanation: "A program is instructions, and the computer follows them exactly, in order, without guessing what you meant.",
        whyWrong: {
          b: "Most files are data, such as photos and documents. Only some files are programs.",
          c: "The physical parts are hardware. Programs are software.",
          d: "A computer does not choose. It does exactly what the instructions say.",
        },
      },
      {
        id: "cpq2-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-programs-daily",
        prompt: "A school portal takes a student number, looks up the student's scores, calculates their average and shows a result slip. Which part is the OUTPUT?",
        options: [
          { id: "a", text: "The result slip" },
          { id: "b", text: "The student number" },
          { id: "c", text: "Calculating the average" },
          { id: "d", text: "The database of scores" },
        ],
        correct: "a",
        explanation: "Output is the result the program produces for the user: here, the result slip.",
        whyWrong: {
          b: "The student number is the input the program starts with.",
          c: "Calculating the average is processing.",
          d: "The stored scores are data the processing uses, not the output.",
        },
      },
      {
        id: "cpq2-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-cpu-memory",
        prompt: "When you start a program, where is it copied so that the processor can execute it?",
        options: [
          { id: "a", text: "Into memory (RAM)" },
          { id: "b", text: "Onto the keyboard" },
          { id: "c", text: "Into the screen" },
          { id: "d", text: "It stays only in storage and runs from there" },
        ],
        correct: "a",
        explanation: "The program is loaded from storage into RAM, and the CPU fetches, decodes and executes its instructions from there.",
        whyWrong: {
          b: "The keyboard is an input device; it holds no programs.",
          c: "The screen only displays output.",
          d: "Storage keeps the program file, but it is copied into fast working memory to run.",
        },
      },
      {
        id: "cpq2-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-trace-practice",
        prompt: "Trace this sequence:\n\nSET n TO 5\nSET n TO n * 2\nSET m TO n - 3\nSET n TO m + n\nOUTPUT n\n\nWhat is output?",
        options: [
          { id: "a", text: "17" },
          { id: "b", text: "12" },
          { id: "c", text: "10" },
          { id: "d", text: "7" },
        ],
        correct: "a",
        explanation: "n becomes 10, m becomes 7, then n becomes 7 + 10 = 17.",
        whyWrong: {
          b: "That uses the original n (5) in the last line. Line 2 had already changed n to 10.",
          c: "10 is n after line 2, but line 4 changes it again.",
          d: "7 is m, not n.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l3-what-is-cpp": {
    lessonId: "cp-l3-what-is-cpp",
    passMark: 70,
    questions: [
      {
        id: "cpq3-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-history",
        prompt: "What does the name C++ mean?",
        options: [
          { id: "a", text: "\"One step beyond C\": ++ is C's operator for adding one" },
          { id: "b", text: "\"C, plus a second version of C\"" },
          { id: "c", text: "\"Computer plus plus\", a brand name with no meaning" },
          { id: "d", text: "That it is twice as fast as C" },
        ],
        correct: "a",
        explanation: "Bjarne Stroustrup built C++ on top of C. ++ adds one to a value, so the name says C++ is C taken one step further.",
        whyWrong: {
          b: "C++ is one language that extends C, not two versions of C.",
          c: "The name is a deliberate programmer's joke about the ++ operator.",
          d: "The name says nothing about speed. C and C++ are both very fast.",
        },
      },
      {
        id: "cpq3-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-compiler",
        prompt: "What does a compiler do?",
        options: [
          { id: "a", text: "Translates the whole source code into machine code before the program runs" },
          { id: "b", text: "Runs the source code one line at a time while you watch" },
          { id: "c", text: "Writes the program for you" },
          { id: "d", text: "Saves your source file" },
        ],
        correct: "a",
        explanation: "A compiler checks your C++ and translates it into an executable of machine code. You then run the executable.",
        whyWrong: {
          b: "That describes an interpreter, which is how languages such as Python usually run.",
          c: "You write the program; the compiler translates it.",
          d: "Your editor saves files. The compiler reads them.",
        },
      },
      {
        id: "cpq3-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-compiler",
        prompt: "Which stage of building a program joins your code with the library code it uses, such as the code that makes std::cout actually print?",
        options: [
          { id: "a", text: "The linker" },
          { id: "b", text: "The preprocessor" },
          { id: "c", text: "The editor" },
          { id: "d", text: "The keyboard driver" },
        ],
        correct: "a",
        explanation: "The linker combines your compiled code with library code to produce one executable.",
        whyWrong: {
          b: "The preprocessor handles # lines such as #include, before compilation.",
          c: "The editor is where you write the code; it is not part of the build.",
          d: "A keyboard driver lets the computer read the keyboard; it has nothing to do with building programs.",
        },
      },
      {
        id: "cpq3-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-compiled-vs-interpreted",
        prompt: "You fix a typo in the message inside score.cpp and save it. What must happen before running score.exe shows the corrected message?",
        options: [
          { id: "a", text: "Compile score.cpp again to rebuild score.exe" },
          { id: "b", text: "Nothing: score.exe updates itself when the source is saved" },
          { id: "c", text: "Restart the computer" },
          { id: "d", text: "Rename score.exe" },
        ],
        correct: "a",
        explanation: "The executable is built from the source at compile time. A changed source file needs compiling again.",
        whyWrong: {
          b: "The executable is a separate file and does not watch the source.",
          c: "Restarting does not rebuild anything.",
          d: "Renaming the old executable still leaves it built from the old code.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l4-first-program": {
    lessonId: "cp-l4-first-program",
    passMark: 70,
    questions: [
      {
        id: "cpq4-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-anatomy",
        prompt: "Where does every C++ program start running?",
        options: [
          { id: "a", text: "In the function main()" },
          { id: "b", text: "At the #include line" },
          { id: "c", text: "At the last line of the file" },
          { id: "d", text: "Wherever the first std::cout is" },
        ],
        correct: "a",
        explanation: "main() is the entry point. When the program runs, the operating system calls main, and its statements run from the top.",
        whyWrong: {
          b: "#include is handled by the preprocessor before compiling; it does not run.",
          c: "The program starts at main, wherever main is in the file.",
          d: "cout is used inside main. Execution starts at main itself.",
        },
      },
      {
        id: "cpq4-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-anatomy",
        prompt: "std::cout << \"Hi\";\nstd::cout << \"there\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "Hithere" },
          { id: "b", text: "Hi there" },
          { id: "c", text: "Hi\nthere" },
          { id: "d", text: "\"Hi\"\"there\"" },
        ],
        correct: "a",
        explanation: "cout prints exactly what it is given. The first line has no space and no \\n, so the second continues straight after it.",
        whyWrong: {
          b: "There is no space in either piece of text, so none is printed.",
          c: "A new line starts only where there is a \\n, and the first line has none.",
          d: "The quotation marks mark where the text starts and ends; they are not printed.",
        },
      },
      {
        id: "cpq4-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-build-command",
        prompt: "In g++ -std=c++17 -Wall -Wextra calc.cpp -o calc, what does -o calc do?",
        options: [
          { id: "a", text: "Names the executable that is produced calc" },
          { id: "b", text: "Opens calc.cpp in the editor" },
          { id: "c", text: "Runs the program immediately" },
          { id: "d", text: "Switches on optimisation" },
        ],
        correct: "a",
        explanation: "-o means output file: the executable is called calc (calc.exe on Windows).",
        whyWrong: {
          b: "g++ does not open editors; it compiles.",
          c: "Compiling and running are separate. You run ./calc afterwards.",
          d: "Optimisation uses -O (capital O) with a level, such as -O2. -o names the output.",
        },
      },
      {
        id: "cpq4-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-cout-values",
        prompt: "std::cout << \"3 * 4 = \" << 3 * 4 << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "3 * 4 = 12" },
          { id: "b", text: "12 = 12" },
          { id: "c", text: "3 * 4 = 3 * 4" },
          { id: "d", text: "3 * 4 =12" },
        ],
        correct: "a",
        explanation: "The text in quotes is printed exactly, including its spaces; the calculation outside quotes is worked out and its answer printed.",
        whyWrong: {
          b: "The first part is in quotes, so it is printed as characters, not calculated.",
          c: "The second 3 * 4 has no quotes, so it is calculated.",
          d: "The text \"3 * 4 = \" ends with a space, and that space is printed before 12.",
        },
      },
      {
        id: "cpq4-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-install",
        prompt: "You have just installed g++ and the terminal in VS Code (already open) says \"g++ is not recognized\". What is the most likely fix?",
        options: [
          { id: "a", text: "Close VS Code completely and reopen it so the terminal reads the updated PATH" },
          { id: "b", text: "Rewrite hello.cpp" },
          { id: "c", text: "Uninstall VS Code" },
          { id: "d", text: "Add a semicolon to the end of the command" },
        ],
        correct: "a",
        explanation: "A terminal reads the PATH, the list of places to look for programs, only when it starts. A terminal opened before the install cannot see g++.",
        whyWrong: {
          b: "The message is about finding g++, not about your code.",
          c: "VS Code is fine; it just needs restarting to see the new PATH.",
          d: "Terminal commands do not need semicolons; the problem is that g++ cannot be found.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l5-syntax-errors": {
    lessonId: "cp-l5-syntax-errors",
    passMark: 70,
    questions: [
      {
        id: "cpq5-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-statements-syntax",
        prompt: "Which line is valid C++?",
        options: [
          { id: "a", text: "std::cout << \"Total: \" << 40 << \"\\n\";" },
          { id: "b", text: "std::cout << \"Total: \" << 40 << \"\\n\"" },
          { id: "c", text: "Std::cout << \"Total: \" << 40 << \"\\n\";" },
          { id: "d", text: "std::cout >> \"Total: \" >> 40;" },
        ],
        correct: "a",
        explanation: "Lower-case std::cout, << arrows pointing into it, text in double quotes and a semicolon at the end.",
        whyWrong: {
          b: "There is no semicolon at the end of the statement.",
          c: "Std with a capital S does not exist. C++ is case-sensitive.",
          d: "Output uses <<. The >> arrows are for input, with std::cin.",
        },
      },
      {
        id: "cpq5-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-compile-errors",
        prompt: "g++ reports: main.cpp:6:5: error: expected ';' before 'return'. Where is the missing semicolon most likely to be?",
        options: [
          { id: "a", text: "At the end of the statement just before line 6" },
          { id: "b", text: "In the middle of the return statement on line 6" },
          { id: "c", text: "On line 1" },
          { id: "d", text: "There is no missing semicolon; it is a runtime error" },
        ],
        correct: "a",
        explanation: "The compiler only notices a statement has not ended when it reaches the next one. The semicolon belongs at the end of the previous statement.",
        whyWrong: {
          b: "The message says before 'return', so the gap is in front of the return statement.",
          c: "Line 6 column 5 points at the return; line 1 is unrelated.",
          d: "It is reported by g++ while compiling, so it is a compilation error.",
        },
      },
      {
        id: "cpq5-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-runtime-errors",
        prompt: "A program compiles and runs to the end without crashing, but prints 110 as the average of 70 and 80. What kind of error is this?",
        options: [
          { id: "a", text: "A logic error" },
          { id: "b", text: "A compilation error" },
          { id: "c", text: "A runtime error" },
          { id: "d", text: "Not an error" },
        ],
        correct: "a",
        explanation: "The program compiled and finished, but the instructions are wrong: 70 + 80 / 2 divides first. Only testing reveals a logic error.",
        whyWrong: {
          b: "It compiled successfully, so it is not a compilation error.",
          c: "Nothing failed while running; the program finished normally with a wrong answer.",
          d: "An average of 110 for 70 and 80 is wrong. A wrong answer is a fault even when nothing crashes.",
        },
      },
      {
        id: "cpq5-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-comments",
        prompt: "std::cout << \"A\\n\";\n// std::cout << \"B\\n\";\nstd::cout << \"C\\n\"; // print C\n\nWhat is printed?",
        options: [
          { id: "a", text: "A\nC" },
          { id: "b", text: "A\nB\nC" },
          { id: "c", text: "A" },
          { id: "d", text: "A\nC // print C" },
        ],
        correct: "a",
        explanation: "The second line is entirely a comment, so it never runs. On the third line, the code before // runs and the comment after it is ignored.",
        whyWrong: {
          b: "The B line starts with //, so the compiler ignores it.",
          c: "The comment on the third line comes after the code; the code still runs.",
          d: "Comments are never printed; the compiler throws them away.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
