/**
 * C++ PROGRAMMING · MODULE 1 · INTRODUCTION TO PROGRAMMING AND C++
 *
 * Curriculum 1.0 – 1.10. The course opens with what C++ builds and the whole
 * road ahead, so a learner knows where sixteen weeks lead before the first
 * line of syntax. Then what a program is, how C++ becomes one, the first
 * compiled program, and the errors every beginner meets in Week 1.
 *
 * Every `code`, `codeExercise` and `codeFill` here is compiled and run with
 * g++ by `npm run validate:content`; the outputs quoted are the real ones.
 * C++ is written with String.raw so it reads exactly as it does in VS Code:
 * "\n" below is the two characters a learner types, not a JavaScript newline.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s1-intro";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0  ·  THE FORESIGHT LESSON
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l1-welcome",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Welcome to C++",
    subtitle: "What you can build with it, and everything you are about to learn",
    estimatedMinutes: 15,
    intro:
      "Before any syntax, the destination. C++ is the language underneath much of the software the world depends on, from the browser you may be reading this in to the game engines behind blockbuster games and the systems that trade on stock exchanges. This lesson shows you what C++ builds, where it can take you, and the exact path this course follows over sixteen weeks, so every lesson after this one has a reason you can see.",

    atoms: [
      {
        id: "a-cp-welcome-builds",
        title: "What C++ builds",
        explain:
          "C++ is a general-purpose programming language, which means it can build almost anything. In practice it is chosen when software must be very fast, must run close to the hardware, or must handle enormous amounts of work without wasting memory. That is why so much of the software people never think about, the software other software runs on, is written in it.",
        table: {
          caption: "Real software built largely in C++, and why C++ was the choice.",
          headers: ["Area", "Examples", "Why C++"],
          rows: [
            ["Games and game engines", "Unreal Engine and the games built on it; most major console games", "Sixty frames a second leaves about 16 milliseconds per frame; nothing can be wasted"],
            ["Web browsers", "Google Chrome (Chromium), Mozilla Firefox", "Pages must load and scroll instantly on cheap phones as well as fast laptops"],
            ["Databases", "MySQL, MongoDB", "Millions of queries a second, with careful control of memory and disk"],
            ["AI and machine learning", "The fast cores of TensorFlow and PyTorch", "You write Python on top; the heavy number-crunching underneath is C++"],
            ["Embedded and IoT devices", "Arduino boards, car systems, medical devices", "Small chips with little memory, and software that must never pause"],
            ["Finance", "High-frequency trading and exchange systems", "A millionth of a second can decide who gets a trade"],
            ["Tools for programmers", "The GCC and Clang compilers, parts of VS Code's tooling", "Compilers translate millions of lines of code and must be fast and exact"],
            ["Desktop applications", "Adobe Photoshop, Microsoft Office", "Large, long-lived programs that work directly with images and documents in memory"],
          ],
        },
        why: "When you learn C++ you are not learning a niche language. You are learning the language of the foundations, and the habits it teaches (thinking about memory, types and cost) make you better in every other language too.",
        decision: {
          scenario:
            "Four teams are starting new projects. Each must choose a language, and they ask what you would recommend.",
          question: "Which project is the strongest fit for C++?",
          options: [
            {
              id: "a",
              text: "A physics engine for a racing game that must calculate every car's movement 60 times a second",
              why: "Hard real-time speed, careful memory use and direct control over the hardware: this is exactly the kind of software C++ exists for, and game engines are one of its biggest homes.",
            },
            {
              id: "b",
              text: "A one-page website that shows a restaurant's menu",
              whyWrong: "A menu page is HTML and CSS, perhaps with a little JavaScript. C++ would add enormous effort for no benefit.",
            },
            {
              id: "c",
              text: "A ten-line script, run once, to rename the photos in a folder",
              whyWrong: "A short one-off task is quicker to write in a scripting language such as Python. C++ shines where performance and control matter, not for throwaway scripts.",
            },
            {
              id: "d",
              text: "A spreadsheet of monthly sales figures",
              whyWrong: "That needs a spreadsheet application, not a new program at all.",
            },
          ],
          correct: "a",
          aftermath:
            "Choosing the right tool is a professional skill. C++ is the right tool when speed, memory and control matter, which is why it powers the foundations of so much software.",
        },
      },
      {
        id: "a-cp-welcome-why",
        title: "Why learn C++, and where it can take you",
        explain:
          "Three reasons. First, C++ is fast: it is compiled into the machine's own instructions, with nothing in between. Second, it shows you how computers really work: you will see memory addresses, decide where data lives, and understand why some programs are slow. Third, its syntax is the ancestor of many others: Java, C#, JavaScript and others borrowed its braces, loops and operators, so after C++ they look familiar.",
        table: {
          caption: "Careers where C++ is a core skill.",
          headers: ["Role", "What they build"],
          rows: [
            ["Game or engine programmer", "Game logic, physics, graphics and the engines themselves"],
            ["Software engineer (systems)", "Browsers, databases, operating-system components, cloud infrastructure"],
            ["Embedded or firmware engineer", "Software inside cars, drones, medical devices, routers and factory machines"],
            ["Robotics engineer", "Control, sensing and navigation software for robots"],
            ["Quantitative or low-latency developer", "Trading systems where speed is money"],
            ["Graphics programmer", "3D rendering, image processing and video software"],
            ["Machine-learning infrastructure engineer", "The fast engines that run AI models"],
          ],
        },
        why: "C++ is also the language of competitive programming contests and of many university computer-science courses, because it makes you understand what your code costs. Those skills transfer to every technical interview you will ever sit.",
        decision: {
          scenario:
            "A friend says: \"There's no point learning C++. Python is easier, so learn that and nothing else.\"",
          question: "What is the most accurate reply?",
          options: [
            {
              id: "a",
              text: "Python is easier to start with, but C++ teaches how memory and performance really work, and it is the language behind games, browsers, devices and much of Python's own speed",
              why: "Both are valuable. Python's fast libraries are themselves often written in C or C++. Knowing C++ means knowing what happens underneath, which no amount of Python alone teaches.",
            },
            {
              id: "b",
              text: "Python is useless; C++ is the only real language",
              whyWrong: "Python is excellent for scripting, data and many web services. Good programmers choose languages by the job, not by loyalty.",
            },
            {
              id: "c",
              text: "C++ is outdated and nobody uses it any more",
              whyWrong: "C++ is updated every three years and is still used for some of the most demanding software in the world: browsers, game engines, databases and trading systems.",
            },
            {
              id: "d",
              text: "You can only learn C++ after a computer-science degree",
              whyWrong: "This course starts from zero. C++ asks for care, not a degree, and every concept is introduced before it is used.",
            },
          ],
          correct: "a",
          aftermath: "You are learning the language underneath. That depth is what this course is built to give you.",
        },
      },
      {
        id: "a-cp-welcome-phases",
        title: "What you will be able to do, phase by phase",
        explain:
          "The course has five phases. Each one ends with something you can build that you could not build before, so you can measure your progress by what you make, not by how many pages you have read.",
        table: {
          caption: "The five phases, and what you can build at the end of each.",
          headers: ["Phase", "Weeks", "You learn", "By the end you can build"],
          rows: [
            ["1 · Programming foundations", "1–4", "What a program is, variables and types, input and output, operators, decisions and loops", "A grade calculator for a whole class, a number-guessing game, an ATM menu"],
            ["2 · Core programming skills", "5–7", "Functions, arrays, vectors and strings", "A maths toolkit, a student performance analyser, a text analyser"],
            ["3 · Object-oriented programming", "8–10", "Pointers and memory, classes, encapsulation, inheritance and polymorphism", "A bank account simulator and a school management model"],
            ["4 · Advanced programming tools", "11–13", "Exceptions, files, templates, the Standard Template Library, data structures and algorithms", "A records manager that saves to disk, an inventory system, a fast contact directory"],
            ["5 · Professional development", "14–16", "Modern C++ and safe memory, debugging, testing, CMake and Git", "A complete, tested application of your own, presented like a professional"],
          ],
        },
        why: "Knowing the destination keeps the early lessons meaningful. When Week 2 asks you to store a score in a variable, you will know it is the first brick of the grade calculator in Week 4 and the records system in Week 11.",
      },
      {
        id: "a-cp-welcome-roadmap",
        title: "The sixteen modules at a glance",
        explain:
          "One module per week, each finishing with a mini-project that uses what that week taught. Week 16 is your capstone: you choose a project, plan it, build it, test it, document it and present it.",
        table: {
          caption: "Every module and its mini-project.",
          headers: ["Week", "Module", "Mini-project"],
          rows: [
            ["1", "Introduction to Programming and C++", "A personal introduction program"],
            ["2", "Variables, Data Types and Input/Output", "A student information and result calculator"],
            ["3", "Operators and Expressions", "A calculator for percentages, temperatures and interest"],
            ["4", "Conditions, Loops and Program Flow", "Grades, times tables, a guessing game, a prime checker, an ATM menu"],
            ["5", "Functions and Modular Programming", "A menu-driven mathematics toolkit"],
            ["6", "Arrays, Vectors and Multidimensional Data", "A student performance analyser"],
            ["7", "Strings and Text Processing", "A text analyser with a palindrome checker"],
            ["8", "Pointers, References and Memory", "Swapping and changing values through references and pointers"],
            ["9", "Classes, Objects and Encapsulation", "A bank account simulator"],
            ["10", "Inheritance, Polymorphism and OOP Design", "A school management model"],
            ["11", "Exception Handling and File Processing", "A student records manager that saves to a file"],
            ["12", "Templates and the Standard Template Library", "An inventory management system"],
            ["13", "Data Structures, Searching and Sorting", "A contact directory with fast search"],
            ["14", "Modern C++ and Resource Management", "Refactoring an earlier project to modern C++"],
            ["15", "Debugging, Testing and Software Design", "Find, fix and prove the fix in a faulty program"],
            ["16", "Capstone Project and Final Assessment", "Banking system, records system, inventory system or a game"],
          ],
        },
        why: "Week 8, pointers and memory, is the one most beginners find hardest, so it is given extra lessons and introduced slowly: you will understand what a memory address is before you ever see the syntax for one.",
      },
      {
        id: "a-cp-welcome-first-look",
        title: "A first look at a program you will write",
        explain:
          "Here is a complete C++ program. Do not try to understand every line yet: by the end of Week 4 you will have written programs like this yourself, and you will be able to explain every character. For now, notice its shape: it works out three students' scores, adds them up, calculates an average and makes a decision about the result.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int total = 0;
    for (int student = 1; student <= 3; student++) {
        int score = 50 + student * 12;
        total += score;
        std::cout << "Student " << student << ": " << score << "\n";
    }
    double average = total / 3.0;
    std::cout << "Class average: " << average << "\n";
    if (average >= 70) {
        std::cout << "Result: Distinction\n";
    } else {
        std::cout << "Result: Pass\n";
    }
    return 0;
}
`,
          expectedOutput: "Student 1: 62\nStudent 2: 74\nStudent 3: 86\nClass average: 74\nResult: Distinction",
        },
        why: "Every program in this course, including this one, has been compiled with a real C++ compiler and run. The output you are shown is exactly what the program prints. You can trust it, and when your own program prints something different you will know the difference is real.",
      },
      {
        id: "a-cp-welcome-method",
        title: "How every lesson works",
        explain:
          "Each idea in this course goes through the same six steps. You will understand it in plain language first, see a complete program that uses it, practise it yourself, prove you understand it on a short check, apply it in a mini-project, and only then move on. The practice is not optional: an idea with a practice is not finished until the practice is right.",
        table: {
          caption: "The six steps, and what you do in each.",
          headers: ["Step", "What happens", "What you do"],
          rows: [
            ["1 · Understand", "One concept, explained simply, with why it exists", "Read, and connect it to what you already know"],
            ["2 · Demonstrate", "A complete, working program and its real output", "Read it line by line; type it into VS Code and run it"],
            ["3 · Practise", "Predict what a program prints, write the missing C++, or make a decision", "Get it right before moving on; try as often as you need"],
            ["4 · Validate", "A 4–5 question check at the end of each lesson", "Score 70% or more to pass the lesson"],
            ["5 · Apply", "A mini-project at the end of each module", "Build it yourself in VS Code, without copying a solution"],
            ["6 · Advance", "The next lesson builds on this one", "Move on knowing the foundation is solid"],
          ],
        },
        why: "This order exists to stop the most common way people fail to learn programming: copying code that works without understanding why, and then being unable to write anything on their own. Predicting output and writing the missing code force you to think like the computer.",
        mistake:
          "Rushing past a practice by revealing the answer and moving on. The reveal is there for when you are truly stuck, and even then, type the answer in yourself and read the program again until it makes sense.",
        decision: {
          scenario:
            "You are asked what a short program prints. You answer, and the course tells you that you are wrong.",
          question: "What is the most useful thing to do next?",
          options: [
            {
              id: "a",
              text: "Go back to the first line and trace the program one line at a time, writing down each value, until you find where your answer and the program part ways",
              why: "That is the skill this course builds. The place where your prediction differs from reality is exactly the idea you have not understood yet, and finding it is how you learn it.",
            },
            {
              id: "b",
              text: "Reveal the answer, copy it and move on quickly",
              whyWrong: "You would pass the practice and learn nothing. The same misunderstanding would return in the next lesson and in every program you write.",
            },
            {
              id: "c",
              text: "Guess different answers until one is accepted",
              whyWrong: "Guessing can eventually get a green tick, but it teaches nothing about how the program works.",
            },
            {
              id: "d",
              text: "Skip programming practice and only read the explanations",
              whyWrong: "Reading about programming is like reading about swimming. Understanding only comes from doing it.",
            },
          ],
          correct: "a",
          aftermath:
            "Welcome to C++. Next: what a computer program actually is, and how a computer carries one out.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 – 1.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l2-programs",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1", "1.2"],
    title: "What a Program Is, and How a Computer Runs One",
    subtitle: "Instructions, input and output, the CPU and memory",
    estimatedMinutes: 14,
    intro:
      "You use dozens of programs every day without thinking about them. This lesson is about what they all have in common, and about what the computer is physically doing while one of them runs. You will finish by tracing a short program yourself, exactly the way a computer would.",

    atoms: [
      {
        id: "a-cp-program-defined",
        title: "A program is a list of exact instructions",
        explain:
          "A computer program is a set of instructions that tells a computer how to do a job. The computer follows them exactly, one at a time, and it cannot guess what you meant: if a step is missing or in the wrong order, the program does the wrong thing, very quickly. Programming is the skill of writing those instructions precisely.",
        analogy:
          "A recipe written for someone who has never cooked. \"Add some salt\" is useless to them; \"add half a teaspoon of salt, then stir for one minute\" is something they can follow. A computer is the most literal cook in the world.",
        decision: {
          scenario: "Here are four things you might find on a phone or laptop.",
          question: "Which one is a program?",
          options: [
            {
              id: "a",
              text: "The calculator app",
              why: "It is a set of instructions: read the numbers you tap, do the arithmetic, show the result. That is what makes it a program.",
            },
            {
              id: "b",
              text: "A photo of your friends",
              whyWrong: "A photo is data: information that programs work with. A photo viewer is a program; the photo is not.",
            },
            {
              id: "c",
              text: "A spreadsheet file of monthly expenses",
              whyWrong: "The file is data. The spreadsheet application that opens it is the program.",
            },
            {
              id: "d",
              text: "The keyboard",
              whyWrong: "The keyboard is hardware: a physical device. Programs read what it sends, but it is not itself a program.",
            },
          ],
          correct: "a",
          aftermath: "Programs are instructions; files such as photos and documents are data that programs work on. Keep the two apart.",
        },
      },
      {
        id: "a-cp-programs-daily",
        title: "Every program: input, processing, output",
        explain:
          "Almost every program follows the same shape. It takes input (information coming in), does processing (the work), and produces output (a result going out). When you plan a program, those three questions come first: what do I start with, what must I do with it, and what must I produce?",
        table: {
          caption: "Programs you use daily, broken into input, processing and output.",
          headers: ["Program", "Input", "Processing", "Output"],
          rows: [
            ["Calculator app", "The numbers and operation you tap", "The arithmetic", "The answer on screen"],
            ["ATM", "Your card, PIN and the amount", "Check the PIN and balance, subtract the amount", "Cash, a receipt and a new balance"],
            ["WhatsApp", "The message you type", "Encrypt it and send it to the right phone", "The message on your friend's screen"],
            ["Maps app", "Where you are and where you want to go", "Search for the fastest route", "Directions and an arrival time"],
            ["Your school portal", "Your student number", "Look up your scores and calculate your average", "A result slip"],
          ],
        },
        decision: {
          scenario: "You withdraw 20,000 naira from an ATM.",
          question: "Which part is PROCESSING?",
          options: [
            {
              id: "a",
              text: "Typing your PIN and the amount",
              whyWrong: "That is input: information you give the program.",
            },
            {
              id: "b",
              text: "Checking the PIN is correct and that your balance covers 20,000, then subtracting it",
              why: "Processing is the work done on the input to produce the output. Here it is two checks and one subtraction.",
            },
            {
              id: "c",
              text: "The cash coming out of the slot",
              whyWrong: "That is output: the result the program produces.",
            },
            {
              id: "d",
              text: "Walking to the ATM",
              whyWrong: "That happens before the program is involved at all.",
            },
          ],
          correct: "b",
          aftermath: "Input, processing, output. You will use these three words to plan every program in this course.",
        },
      },
      {
        id: "a-cp-cpu-memory",
        title: "What the computer does while a program runs",
        explain:
          "Three parts of a computer work together. Storage (an SSD or hard drive) keeps the program file when the power is off. When you start the program, it is copied into memory (RAM), fast working space that is cleared when the power goes. The processor (CPU) then carries out the instructions one at a time: it fetches the next instruction from memory, works out what it means, and does it. This fetch, decode, execute cycle repeats billions of times a second.",
        table: {
          caption: "The parts involved in running a program.",
          headers: ["Part", "What it does", "Kept when the power is off?"],
          rows: [
            ["Storage (SSD / hard drive)", "Holds programs and files permanently", "Yes"],
            ["Memory (RAM)", "Holds the running program and the data it is working on", "No"],
            ["Processor (CPU)", "Fetches, decodes and executes instructions, one after another", "It keeps nothing"],
          ],
        },
        analogy:
          "A chef (the CPU) working from a recipe book on the shelf (storage). To cook, the chef copies today's recipe onto the counter (memory) and follows it step by step. When the kitchen closes, the counter is wiped, but the book is still on the shelf.",
        why: "C++ gives you direct control over memory, more than most languages. In Week 8 you will see the actual addresses where your data lives in RAM. It all starts with this picture.",
      },
      {
        id: "a-cp-trace-demo",
        title: "Tracing: following instructions the way a computer does",
        explain:
          "To trace a program is to follow its instructions in order, by hand, writing down the value of everything after each step. It is how you check a program before you trust it, and how you find out why a program did something you did not expect. Below, each SET stores a value under a name, and OUTPUT shows a value. Follow the table one row at a time.",
        code: {
          language: "pseudocode",
          code: "SET a TO 10\nSET b TO 4\nSET a TO a + b\nSET b TO a * 2\nOUTPUT a\nOUTPUT b\n",
          equivalentCpp: C`#include <iostream>
int main() {
    int a = 10;
    int b = 4;
    a = a + b;
    b = a * 2;
    std::cout << a << "\n";
    std::cout << b << "\n";
}
`,
          expectedOutput: "14\n28",
          trace: {
            headers: ["Line", "Instruction", "a", "b", "Output"],
            rows: [
              ["1", "SET a TO 10", "10", "–", ""],
              ["2", "SET b TO 4", "10", "4", ""],
              ["3", "SET a TO a + b", "14", "4", ""],
              ["4", "SET b TO a * 2", "14", "28", ""],
              ["5", "OUTPUT a", "14", "28", "14"],
              ["6", "OUTPUT b", "14", "28", "28"],
            ],
            note: "Line 4 uses the NEW value of a (14), because line 3 has already run. Order is everything.",
          },
        },
        why: "Line 3 replaces the old value of a. The computer does not remember that a used to be 10; only the latest value exists. That one fact explains a huge number of beginner surprises.",
      },
      {
        id: "a-cp-trace-practice",
        title: "Your turn: trace a sequence",
        explain:
          "Trace this sequence exactly as the computer would. Draw your own table with columns for x and y, update it after every line, and only then write down what the two OUTPUT lines show.",
        codeExercise: {
          language: "pseudocode",
          code: "SET x TO 7\nSET y TO 2\nSET x TO x + y\nSET y TO x - y\nSET x TO x - y\nOUTPUT x\nOUTPUT y\n",
          equivalentCpp: C`#include <iostream>
int main() {
    int x = 7;
    int y = 2;
    x = x + y;
    y = x - y;
    x = x - y;
    std::cout << x << "\n";
    std::cout << y << "\n";
}
`,
          question: "Trace it line by line. What are the two lines of output?",
          expectedOutput: "2\n7",
          hint: "After line 3, x is 9. Line 4 uses that 9, and line 5 uses the y from line 4.",
          successMessage:
            "2 then 7. The two values have swapped places using only arithmetic. You found that by following the instructions exactly, which is precisely what a computer does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.3 – 1.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l3-what-is-cpp",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.3", "1.4"],
    title: "What C++ Is, and How Code Becomes a Program",
    subtitle: "History, uses, source code, compilers and executables",
    estimatedMinutes: 15,
    intro:
      "A CPU understands only machine code: patterns of ones and zeros. Nobody writes that by hand. You will write C++, and a program called a compiler will translate it. This lesson covers where C++ came from, what makes it different, and exactly what happens between the text you type and the program you run.",

    atoms: [
      {
        id: "a-cp-history",
        title: "Where C++ came from",
        explain:
          "C++ is a programming language built on an older language called C. C is fast and close to the hardware but has few tools for organising large programs. C++ kept C's speed and added ways to build large, well-organised software, starting with classes, which you will meet in Week 9.",
        origin:
          "Bjarne Stroustrup began C++ in 1979 at Bell Labs in the United States, calling it \"C with Classes\". It was renamed C++ in 1983: ++ is C's operator for \"add one\", so the name means \"one step beyond C\". It became an international (ISO) standard in 1998, was modernised heavily in 2011, and has had a new standard every three years since.",
        table: {
          caption: "The C++ standards. This course teaches C++17, with selected C++20 features in Week 14.",
          headers: ["Standard", "Year", "What it is known for"],
          rows: [
            ["C++98", "1998", "The first international standard, including the Standard Template Library"],
            ["C++11", "2011", "The great modernisation: auto, smart pointers, lambdas, move semantics"],
            ["C++14", "2014", "Small improvements to C++11"],
            ["C++17", "2017", "optional, string_view, structured bindings, and much more: the version this course is taught in"],
            ["C++20", "2020", "Ranges, concepts, modules and other major additions"],
            ["C++23", "2023", "Further library improvements"],
          ],
        },
        why: "Knowing the standards explains why tutorials online look different from each other. Old tutorials written before 2011 show habits modern C++ has replaced, and this course will point those out when they come up.",
      },
      {
        id: "a-cp-strengths",
        title: "What makes C++ different",
        explain:
          "Four things. Speed: C++ compiles to the processor's own machine code. Control: you decide how memory is used, which matters on small devices and in large systems. Abstraction without waste: C++ lets you build high-level tools, such as classes and templates, that cost nothing extra when the program runs; its design rule is that you do not pay for what you do not use. Portability: the same C++ source code can be compiled for Windows, macOS, Linux, phones and tiny chips.",
        why: "These strengths come with a price: C++ trusts you. It will let you make mistakes that other languages prevent, especially with memory. A large part of this course, particularly Weeks 8 and 14, is about using that power safely.",
        decision: {
          scenario:
            "Your manager asks you to choose a language for four tasks. For one of them, C++ would be a poor choice.",
          question: "Which one?",
          options: [
            {
              id: "a",
              text: "A quick script, used once, to count how many lines a text file has",
              why: "C++ could do it, but a scripting language does it in a couple of minutes with no compile step. C++ earns its extra effort where speed and control matter; a throwaway task is not that.",
            },
            {
              id: "b",
              text: "The control software inside a heart-rate monitor with very little memory",
              whyWrong: "Tight memory and real-time behaviour are exactly where C++ is strong. Embedded devices are one of its main homes.",
            },
            {
              id: "c",
              text: "The rendering engine of a 3D game",
              whyWrong: "Rendering many frames a second is one of the most performance-hungry jobs there is, and C++ is the industry standard for it.",
            },
            {
              id: "d",
              text: "A database server handling millions of requests",
              whyWrong: "Databases such as MySQL and MongoDB are written in C++ precisely because of its speed and memory control.",
            },
          ],
          correct: "a",
          aftermath: "Professional programmers know several languages and pick the one that fits. Knowing when NOT to use C++ is part of knowing C++.",
        },
      },
      {
        id: "a-cp-source-code",
        title: "Source code: the text you write",
        explain:
          "Source code is the program as you write it: plain text, in a file whose name ends in .cpp, such as hello.cpp. It is written for people as much as for the computer. The CPU cannot run it directly; it must first be translated into machine code.",
        example:
          "hello.cpp is a plain text file. Opened in any text editor, it looks like this:\n\n  #include <iostream>\n\n  int main() {\n      std::cout << \"Hello!\\n\";\n      return 0;\n  }\n\nThe same instructions as machine code would be thousands of\nbytes of numbers that no person could read.",
        mistake:
          "Writing code in a word processor such as Microsoft Word. It quietly replaces straight quotes \" with curly ones “ ”, which the compiler rejects. Always write code in a code editor such as VS Code.",
      },
      {
        id: "a-cp-compiler",
        title: "From source code to an executable",
        explain:
          "A compiler is a program that translates your whole source file into machine code before the program runs. The result is an executable: a file the computer can run directly, such as hello.exe on Windows or hello on macOS and Linux. Building it happens in stages, though one command runs them all.",
        table: {
          caption: "What happens when you compile hello.cpp with g++.",
          headers: ["Stage", "What it does", "Example"],
          rows: [
            ["1 · Preprocessor", "Handles lines that start with #, such as pasting in the contents of <iostream>", "#include <iostream> brings in the tools for printing"],
            ["2 · Compiler", "Checks your C++ is valid and translates it into machine code", "Reports errors such as a missing semicolon"],
            ["3 · Linker", "Joins your machine code with the library code it uses", "Connects std::cout to the code that actually prints"],
            ["4 · Executable", "One file you can run, with no compiler needed", "hello.exe (Windows) or hello (macOS, Linux)"],
          ],
        },
        why: "When something goes wrong, knowing the stages tells you where to look. A message from the compiler means your C++ is not valid. A message from the linker means a piece is missing, such as a function you declared but never wrote; you will meet that in Week 5.",
      },
      {
        id: "a-cp-compiled-vs-interpreted",
        title: "Compiled versus interpreted languages",
        explain:
          "C++ is compiled: translation happens once, before running, and you run the result. Languages such as Python are interpreted: a program reads your source code and carries it out as it goes, every time. Compiled programs are usually much faster, and errors in the language itself are caught before the program ever runs. The cost is an extra step: every time you change the source, you must compile again.",
        table: {
          caption: "The two approaches side by side.",
          headers: ["", "Compiled (C++)", "Interpreted (Python)"],
          rows: [
            ["When translation happens", "Once, before running", "While running, every time"],
            ["What you run", "The executable file", "The source code, through the interpreter"],
            ["Speed", "Very fast", "Usually slower"],
            ["After editing the code", "Compile again, then run", "Just run again"],
            ["Grammar mistakes found", "Before the program runs", "When the faulty line is reached"],
          ],
        },
        decision: {
          scenario:
            "You compiled hello.cpp into hello.exe and ran it. Then you changed the message in hello.cpp, saved the file, and ran hello.exe again. It still prints the old message.",
          question: "Why?",
          options: [
            {
              id: "a",
              text: "hello.exe was built from the old source code; you must compile again to rebuild it from the new version",
              why: "The executable is a separate file made at compile time. Changing the source does not change it. Edit, save, compile, run: that loop becomes automatic within a week.",
            },
            {
              id: "b",
              text: "VS Code did not save the file properly",
              whyWrong: "The file was saved. The problem is that the program you ran was built before you saved it.",
            },
            {
              id: "c",
              text: "C++ caches messages for speed",
              whyWrong: "There is no such cache. You simply ran an executable made from the old source.",
            },
            {
              id: "d",
              text: "The computer needs restarting",
              whyWrong: "Restarting changes nothing. hello.exe is still the old program until it is rebuilt.",
            },
          ],
          correct: "a",
          aftermath: "Edit, save, compile, run. In the next lesson you will set up exactly that loop on your own computer.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.5 – 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l4-first-program",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.5", "1.6", "1.7"],
    title: "Your First C++ Program",
    subtitle: "Installing a compiler, compiling, and what every line means",
    estimatedMinutes: 20,
    intro:
      "Time to write real C++. You will install VS Code and the g++ compiler, compile and run a program from the terminal, and then take the program apart line by line until nothing in it is a mystery. From this lesson on, every lesson asks you to write C++ yourself.",

    atoms: [
      {
        id: "a-cp-install",
        title: "Installing VS Code and a C++ compiler",
        explain:
          "You need two free tools. Visual Studio Code is the editor where you write code. g++ is the compiler from the GCC project that turns it into a program; on Windows it comes as MinGW-w64, installed through MSYS2. Install both, then check the compiler works by asking it for its version.",
        example:
          "1. Install VS Code from code.visualstudio.com. In VS Code, open\n   Extensions (Ctrl+Shift+X) and install \"C/C++\" by Microsoft.\n\n2. Install the compiler:\n\n   Windows   Install MSYS2 from msys2.org. In the \"MSYS2 UCRT64\"\n             terminal run:\n               pacman -S mingw-w64-ucrt-x86_64-gcc\n             Then add C:\\msys64\\ucrt64\\bin to your Windows PATH\n             (Start → \"Edit the system environment variables\").\n\n   macOS     In Terminal run:  xcode-select --install\n\n   Linux     sudo apt install g++      (Ubuntu / Debian)\n\n3. Close and reopen VS Code, open the terminal (View → Terminal)\n   and type:\n\n     g++ --version\n\n   You should see a version number. Any version from 9 upwards\n   supports everything in this course.\n\n4. Make a folder called cpp-course and open it in VS Code\n   (File → Open Folder). Every program you write goes here.",
        mistake:
          "\"g++ is not recognized\" right after installing. The terminal reads the list of program locations (the PATH) only when it starts. Close VS Code completely and open it again; on Windows, check that C:\\msys64\\ucrt64\\bin really is on your PATH.",
      },
      {
        id: "a-cp-build-command",
        title: "Compiling and running from the terminal",
        explain:
          "To build a program you give g++ the source file and the name of the executable to make. Then you run the executable. The extra settings shown here ask for the C++17 standard and switch on warnings: messages about code that is legal but probably a mistake. Use them for every program in this course.",
        table: {
          caption: "g++ -std=c++17 -Wall -Wextra hello.cpp -o hello, piece by piece.",
          headers: ["Part", "Meaning"],
          rows: [
            ["g++", "Run the GCC C++ compiler"],
            ["-std=c++17", "Use the C++17 standard, the one this course teaches"],
            ["-Wall -Wextra", "Warn about code that is valid but suspicious; read every warning"],
            ["hello.cpp", "The source file to compile"],
            ["-o hello", "Name the executable hello (hello.exe on Windows)"],
          ],
        },
        example:
          "In the VS Code terminal, inside your cpp-course folder:\n\n  > g++ -std=c++17 -Wall -Wextra hello.cpp -o hello\n  > ./hello              (macOS and Linux)\n  > .\\hello.exe          (Windows)\n  Hello, World!\n\nNo message from g++ means it compiled cleanly. Silence is success.",
        decision: {
          scenario:
            "You run g++ -std=c++17 -Wall -Wextra score.cpp -o score and press Enter. Nothing is printed, and the prompt comes back.",
          question: "What does that mean?",
          options: [
            {
              id: "a",
              text: "It compiled successfully and created the executable; now run it",
              why: "g++ only speaks when something is wrong or suspicious. No output means a clean build. Run ./score (or .\\score.exe) to see the program's output.",
            },
            {
              id: "b",
              text: "It failed silently",
              whyWrong: "g++ never fails silently: errors are always printed, with the file and line.",
            },
            {
              id: "c",
              text: "The program ran but printed nothing",
              whyWrong: "Compiling does not run the program. It builds the executable; running it is a separate command.",
            },
            {
              id: "d",
              text: "You need to press Enter again",
              whyWrong: "The command has already finished. The returned prompt is waiting for your next command: running the program.",
            },
          ],
          correct: "a",
          aftermath: "Compile, then run: two separate commands. Most editors can do both with one key, but you should know what that key is doing.",
        },
      },
      {
        id: "a-cp-hello",
        title: "Hello, World!",
        explain:
          "Create a file called hello.cpp in your cpp-course folder, type this program exactly, save it, then compile and run it. Printing \"Hello, World!\" has been the traditional first program since the 1970s: it proves that the editor, compiler and computer are all working together.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "Hello, World!\n";
    return 0;
}
`,
          expectedOutput: "Hello, World!",
        },
        codeFill: {
          task: "Now make it yours. Fill the gap so the program prints exactly: Welcome to C++, Ada! (Type the text with its quotation marks.)",
          code: C`#include <iostream>

int main() {
    std::cout << {{1}} << "\n";
    return 0;
}
`,
          blanks: [{ answers: ['"Welcome to C++, Ada!"'] }],
          expectedOutput: "Welcome to C++, Ada!",
          hint: "Text in C++ goes inside double quotation marks: \"like this\". Copy the message exactly, including the comma and the exclamation mark.",
          successMessage:
            "That is a C++ program you completed yourself. Type it into VS Code with your own name, compile it and run it.",
        },
      },
      {
        id: "a-cp-anatomy",
        title: "Every line explained: #include, main() and cout",
        explain:
          "Six lines, and every one has a job. #include <iostream> brings in the input/output tools from the standard library. int main() is where every C++ program starts running. The braces { } mark the start and end of main's instructions. std::cout is the standard output stream, the screen; << sends a value into it. return 0; tells the operating system the program finished successfully.",
        table: {
          caption: "The Hello, World! program, line by line.",
          headers: ["Code", "What it does"],
          rows: [
            ["#include <iostream>", "Copy in the declarations for input and output (cout, cin) before compiling"],
            ["int main()", "Define the main function: the program starts here, and it gives back an int (a whole number)"],
            ["{", "Begin main's body: the instructions that belong to it"],
            ["std::cout << \"Hello, World!\\n\";", "Send the text to standard output. \\n means \"start a new line\". The ; ends the statement"],
            ["return 0;", "End main and report success (0) to the operating system"],
            ["}", "End main's body"],
          ],
        },
        why: "std:: means \"from the standard library\". Many tutorials write using namespace std; at the top so they can type cout instead of std::cout. This course writes std:: in full, which is what most professional style guides require; Week 15 explains why.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "Hello";
    std::cout << "World\n";
    std::cout << "Done\n";
    return 0;
}
`,
          question: "Each cout sends text to the screen. A new line only starts where there is a \\n. What does this program print?",
          expectedOutput: "HelloWorld\nDone",
          hint: "The first cout has no \\n at the end, so the second one carries on on the same line.",
          successMessage:
            "HelloWorld, then Done. cout prints exactly what you give it and nothing more: no space, no new line, unless you ask for one.",
        },
      },
      {
        id: "a-cp-cout-values",
        title: "Printing text, numbers and calculations",
        explain:
          "cout can print more than text. A number without quotes is printed as a number, and a calculation without quotes is worked out first and its answer printed. You can chain several values with << in one statement; they are printed in order with nothing between them, so put spaces inside the quotes where you want them.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "7 + 5" << "\n";
    std::cout << 7 + 5 << "\n";
    std::cout << "7 + 5 = " << 7 + 5 << "\n";
    return 0;
}
`,
          expectedOutput: "7 + 5\n12\n7 + 5 = 12",
        },
        why: "Line 4 prints characters because they are in quotes. Line 5 prints the result because they are not. Line 6 mixes both, which is how almost every useful output line in this course is built.",
        codeFill: {
          task: "A trader sold goods worth 4850 naira in the morning and 3975 in the afternoon. Fill the gap so C++ calculates the day's total. Do not type the answer yourself: let the program do the arithmetic.",
          code: C`#include <iostream>

int main() {
    std::cout << "Total for the day: " << {{1}} << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["4850 + 3975", "3975 + 4850"] }],
          expectedOutput: "Total for the day: 8825",
          hint: "Put the two amounts with a + between them, and no quotation marks, so C++ treats it as a calculation.",
          successMessage:
            "8825, worked out by the program. That is the whole point of programming: you write the method, the computer does the work.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.8 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l5-syntax-errors",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.8", "1.9", "1.10"],
    title: "Syntax, Errors and Readable Code",
    subtitle: "Statements and braces, compile and runtime errors, comments",
    estimatedMinutes: 18,
    intro:
      "Every C++ programmer sees error messages every day, including experts. The difference is that experts read them calmly and fix them quickly. This lesson teaches the grammar rules behind most first-week errors, how to read what the compiler tells you, and how to write code that people can read.",

    atoms: [
      {
        id: "a-cp-statements-syntax",
        title: "Statements, semicolons and braces",
        explain:
          "Syntax is the set of grammar rules for writing C++. A statement is one complete instruction, and almost every statement ends with a semicolon. Braces { } group statements into a block, such as the body of main. C++ is case-sensitive: cout, Cout and COUT are three different names, and only cout exists. Spaces and line breaks between parts mostly do not matter to the compiler, but they matter a great deal to people.",
        table: {
          caption: "The rules that cause most first-week errors.",
          headers: ["Rule", "Wrong", "Right"],
          rows: [
            ["End statements with ;", "std::cout << \"Hi\\n\"", "std::cout << \"Hi\\n\";"],
            ["Case matters", "Std::Cout << \"Hi\\n\";", "std::cout << \"Hi\\n\";"],
            ["Text needs double quotes", "std::cout << Hi;", "std::cout << \"Hi\";"],
            ["Every { needs a }", "int main() { return 0;", "int main() { return 0; }"],
            ["The arrows point into cout", "std::cout >> \"Hi\";", "std::cout << \"Hi\";"],
          ],
        },
        decision: {
          scenario: "Four students each wrote one line to print a score.",
          question: "Which line is valid C++?",
          options: [
            {
              id: "a",
              text: "std::cout << \"Score: \" << 85 << \"\\n\";",
              why: "Lower-case std::cout, << pointing into it, text in double quotes, the number without quotes, and a semicolon at the end.",
            },
            {
              id: "b",
              text: "std::cout << \"Score: \" << 85 << \"\\n\"",
              whyWrong: "No semicolon at the end, so the statement never finishes and the compiler reports an error.",
            },
            {
              id: "c",
              text: "std::Cout << \"Score: \" << 85 << \"\\n\";",
              whyWrong: "Cout with a capital C does not exist. C++ is case-sensitive.",
            },
            {
              id: "d",
              text: "std::cout << 'Score: ' << 85 << \"\\n\";",
              whyWrong: "Single quotes are for one character, such as 'A'. Text of several characters needs double quotes.",
            },
          ],
          correct: "a",
          aftermath: "Semicolons, case, quotes and braces. Check those four first whenever the compiler complains.",
        },
      },
      {
        id: "a-cp-compile-errors",
        title: "Compilation errors: the compiler refuses",
        explain:
          "A compilation error means your code breaks C++'s rules, so the compiler refuses to build the program and no executable is made. g++ tells you the file, the line and the column, then describes the problem. Read the FIRST error first: one mistake often causes several messages, and fixing the first usually clears the rest. A missing semicolon is often reported at the start of the NEXT line, because that is where the compiler realised the statement had not ended.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "Ready\n"
    return 0;
}
`,
          compileError: "error: expected ';' before 'return'",
        },
        example:
          "The full message from g++ looks like this:\n\n  hello.cpp: In function 'int main()':\n  hello.cpp:4:27: error: expected ';' before 'return'\n      4 |     std::cout << \"Ready\\n\"\n        |                           ^\n        |                           ;\n      5 |     return 0;\n\nRead it as: in hello.cpp, line 4, column 27, a ; was expected.\ng++ even draws where it belongs.",
        codeFill: {
          task: "Here is the same program with the broken line removed. Type line 4 again, correctly, so it compiles and prints Ready and then Set.",
          code: C`#include <iostream>

int main() {
    {{1}}
    std::cout << "Set\n";
    return 0;
}
`,
          blanks: [{ answers: [C`std::cout << "Ready\n";`], width: 26 }],
          expectedOutput: "Ready\nSet",
          hint: "It is the line from the example above, with the one character the compiler asked for added at the very end.",
          successMessage:
            "Fixed. One character stopped the whole program from being built; one character fixed it. That is normal, and now you know how to find it.",
        },
      },
      {
        id: "a-cp-runtime-errors",
        title: "Runtime errors and logic errors",
        explain:
          "A runtime error happens while the program is running: the code was valid C++ and compiled, but something goes wrong as it executes, such as dividing a whole number by zero or opening a file that does not exist. The program may crash or stop with a message. A logic error is quieter: the program compiles, runs to the end and prints an answer, but the answer is wrong because the instructions are wrong. The compiler cannot catch either kind; only testing and tracing can.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "Average of 70 and 80: ";
    std::cout << 70 + 80 / 2 << "\n";
    return 0;
}
`,
          expectedOutput: "Average of 70 and 80: 110",
        },
        why: "This program compiles and runs without complaint, and prints 110, which cannot be the average of 70 and 80. Division happens before addition, so C++ worked out 70 + 40. The fix is (70 + 80) / 2. You will learn the full rules in Week 3; the lesson here is that a program that runs is not the same as a program that is right.",
        table: {
          caption: "Three kinds of error.",
          headers: ["Kind", "When it shows up", "Example", "Who catches it"],
          rows: [
            ["Compilation error", "When you compile", "A missing semicolon", "The compiler"],
            ["Runtime error", "While the program runs", "Dividing a whole number by zero; a file that is missing", "The program crashes or reports it"],
            ["Logic error", "Only in the results", "70 + 80 / 2 used for an average", "You, by testing and tracing"],
          ],
        },
        decision: {
          scenario:
            "Your program compiles with no errors. When you run it and type 0 for the number of students, it crashes before printing the average.",
          question: "What kind of error is this?",
          options: [
            {
              id: "a",
              text: "A runtime error",
              why: "The code was valid enough to compile, and it failed only while running, with one particular input. Dividing by a count of zero is a classic cause, and in Week 11 you will learn to check for it before it happens.",
            },
            {
              id: "b",
              text: "A compilation error",
              whyWrong: "It compiled with no errors. Compilation errors stop the executable from being made at all.",
            },
            {
              id: "c",
              text: "A logic error",
              whyWrong: "A logic error lets the program finish with a wrong answer. Here the program did not finish at all.",
            },
            {
              id: "d",
              text: "Not an error; zero students is just unusual",
              whyWrong: "A program that crashes on an input a user can type has a fault. Good programs handle every input they can be given.",
            },
          ],
          correct: "a",
          aftermath: "Compile-time, run-time, or wrong-answer. Naming the kind of error tells you where to start looking.",
        },
      },
      {
        id: "a-cp-comments",
        title: "Comments",
        explain:
          "A comment is a note in your code that the compiler ignores completely. // starts a comment that runs to the end of the line. /* starts a comment that runs until */, across as many lines as you like. Comments are for people: they explain why the code does what it does, where a number came from, or what a block of code is for.",
        why: "Programmers also use comments to switch a line off temporarily while testing. That is useful, but it means a line that looks like code may not run at all, so always check for // at the start of a line.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    // VAT in Nigeria is 7.5%, set by the Finance Act 2019.
    std::cout << "Price: 2000\n";
    // std::cout << "Discount: 200\n";
    std::cout << "VAT: " << 2000 * 75 / 1000 << "\n";  // 7.5% of 2000
    /* The total is printed last.
    std::cout << "Thank you\n"; */
    std::cout << "Total: 2150\n";
    return 0;
}
`,
          question: "Comments are ignored by the compiler. Which lines actually run? Write exactly what this program prints.",
          expectedOutput: "Price: 2000\nVAT: 150\nTotal: 2150",
          hint: "Line 6 starts with //, so it never runs. Lines 8 and 9 are inside /* … */, so neither does \"Thank you\".",
          successMessage:
            "Three lines. The discount line and the thank-you line are comments, so the compiler never sees them. The comment on line 7 is fine: everything before the // still runs.",
        },
      },
      {
        id: "a-cp-readability",
        title: "Writing code that people can read",
        explain:
          "The compiler accepts badly laid-out code, but people struggle with it, and code is read far more often than it is written. Indent everything inside braces by four spaces, put one statement on each line, leave a blank line between separate steps, and use comments for the why, not the what.",
        example:
          "Valid, but hard to read:\n\n#include <iostream>\nint main(){std::cout<<\"Name: Ada\\n\";std::cout<<\"Goal: games\\n\";return 0;}\n\nThe same program, readable:\n\n#include <iostream>\n\nint main() {\n    std::cout << \"Name: Ada\\n\";\n    std::cout << \"Goal: games\\n\";\n    return 0;\n}\n\nIdentical machine code. Only one of them shows you its shape.",
        decision: {
          scenario:
            "A classmate's program works perfectly, but everything inside main is written on one long line with no indentation and no comments.",
          question: "What is the best advice?",
          options: [
            {
              id: "a",
              text: "It runs, but it should be laid out with one statement per line and indentation, because people must read and change it",
              why: "Layout is for the reader. When this program grows, or has a bug, the person fixing it (probably your classmate) needs to see its structure at a glance.",
            },
            {
              id: "b",
              text: "Nothing: the compiler ignores spaces, so layout is irrelevant",
              whyWrong: "Irrelevant to the compiler, not to people. Most of a program's life is spent being read and changed.",
            },
            {
              id: "c",
              text: "It will run faster if it is indented",
              whyWrong: "Spacing has no effect on speed. The machine code is identical either way.",
            },
            {
              id: "d",
              text: "Add a comment above every single line saying what it does",
              whyWrong: "Comments that repeat the code add clutter and go out of date. Comment the why, and let clear layout and names show the what.",
            },
          ],
          correct: "a",
          aftermath: "Write for the next reader first. The compiler will cope with anything valid; people will not.",
        },
      },
    ],

    task: {
      title: "Mini-project: personal introduction program",
      intro:
        "Build your own introduction program in a file called intro.cpp, compile it with g++ -std=c++17 -Wall -Wextra, and run it. Do not copy a finished program: build it one line at a time, compiling after each change.",
      prompts: [
        "Print a welcome banner of at least two lines, such as a line of = signs and a title.",
        "Print your name, the town or city you live in, and the date you started this course, each on its own line.",
        "Print at least two learning goals: what you want to be able to build with C++ by the end of the course.",
        "Use one line that mixes text and a calculation, such as how many weeks the course has left (16 - 1), letting C++ do the arithmetic.",
        "Add a comment at the top with your name and what the program does, and lay the code out with one statement per line and four-space indentation.",
        "Break it on purpose: delete one semicolon, compile, and read the error message. Then fix it and compile again until g++ prints nothing.",
      ],
      closing:
        "Keep intro.cpp. In Week 2 you will make it ask the user for their details instead of printing fixed text.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
