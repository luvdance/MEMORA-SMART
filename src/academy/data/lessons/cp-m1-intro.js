/**
 * C++ PROGRAMMING · MODULE 1 · INTRODUCTION TO PROGRAMMING AND C++
 *
 * Curriculum 1.0 – 1.14. The course opens with what C++ builds and the whole
 * road ahead. Then hands on straight away, in small steps: set up VS Code
 * and g++, write, compile and run Hello, World!, learn the frame of every
 * program (#include, main, braces) and printing, until starting a program
 * feels routine. Only then the ideas behind it (what a program is, what a
 * compiler does) and the errors every beginner meets in Week 1. Warnings
 * flags (-Wall -Wextra) are introduced last, once errors make sense.
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
            "Welcome to C++. Next: setting C++ up on your own computer, then your first program.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1  ·  SET UP C++ IN VS CODE
     Hands on keyboard before any theory: install, check, make a folder.
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l4a-setup",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1"],
    title: "Setting Up C++ in VS Code",
    subtitle: "Install the editor and the compiler, and check they work",
    estimatedMinutes: 25,
    intro:
      "Before you write any C++ you need two free tools on your computer. This lesson installs them one step at a time, and ends with a quick check that everything works. Take it slowly: set-up is the only part of the course that is different on every computer, and once it is done you never have to do it again.",

    atoms: [
      {
        id: "a-cp-what-you-need",
        title: "The two tools you need",
        explain:
          "You need an editor and a compiler. The editor, Visual Studio Code (VS Code), is where you type your program. The compiler, called g++, turns what you typed into a program the computer can run. Both are free. VS Code is the same on every computer; g++ is installed a little differently on Windows, macOS and Linux, so follow only the steps for your own computer.",
        analogy:
          "Writing a letter in another language and having it translated. VS Code is the notebook you write in. g++ is the translator who turns your writing into the only language the computer understands.",
        table: {
          caption: "What each tool does.",
          headers: ["Tool", "What it is", "What you do with it"],
          rows: [
            ["VS Code", "A code editor", "Type and save your C++ files"],
            ["C/C++ extension", "An add-on for VS Code", "Colours your code and spots mistakes as you type"],
            ["g++", "The C++ compiler", "Turns hello.cpp into a program you can run"],
            ["The terminal", "A window inside VS Code where you type commands", "Tell g++ to compile, then run your program"],
          ],
        },
        decision: {
          scenario: "A friend has installed VS Code and typed a C++ program into it, but cannot turn it into a program that runs.",
          question: "What is most likely missing?",
          options: [
            {
              id: "a",
              text: "The compiler (g++): VS Code is only the editor, and something must still translate the code into a program",
              why: "Exactly. VS Code is where you write; g++ is what builds the program. You need both.",
            },
            {
              id: "b",
              text: "A faster computer",
              whyWrong: "Any ordinary laptop can compile C++. The missing piece is a tool, not speed.",
            },
            {
              id: "c",
              text: "An internet connection while the program runs",
              whyWrong: "Compiled C++ programs run without the internet.",
            },
            {
              id: "d",
              text: "Nothing: VS Code runs C++ by itself",
              whyWrong: "VS Code edits text. It needs a compiler such as g++ to build C++ programs.",
            },
          ],
          correct: "a",
          aftermath: "Editor plus compiler. Next: install the editor.",
        },
      },
      {
        id: "a-cp-install-vscode",
        title: "Step 1: install VS Code and the C/C++ extension",
        explain:
          "Download VS Code, install it with the default options, and open it. Then add Microsoft's C/C++ extension, which teaches VS Code about C++: it colours your code so it is easier to read, and underlines some mistakes before you even compile.",
        example:
          "1. Go to code.visualstudio.com and click the big Download button.\n   It picks the right version for your computer.\n\n2. Run the installer. Accept the default options.\n   (On Windows, leave \"Add to PATH\" ticked.)\n\n3. Open VS Code.\n\n4. Click the Extensions icon on the left edge (four small squares),\n   or press Ctrl+Shift+X (Cmd+Shift+X on a Mac).\n\n5. In the search box type:   C/C++\n\n6. Choose the one published by Microsoft and click Install.\n\nThat is the editor ready. Next, the compiler.",
        mistake:
          "Installing a different extension with a similar name. Check that the publisher shown under the name is Microsoft.",
      },
      {
        id: "a-cp-install",
        title: "Step 2: install the g++ compiler",
        explain:
          "Now the compiler. Follow ONLY the steps for your computer. On Windows the compiler comes in a free package called MSYS2, and there is one extra step at the end: telling Windows where g++ lives, by adding its folder to a list called the PATH. That step is the one people most often miss, so do not skip it.",
        example:
          "WINDOWS\n\n  1. Go to msys2.org and download the installer (msys2-x86_64-...exe).\n  2. Run it and keep the default folder:  C:\\msys64\n  3. When it finishes, a black window opens: the \"MSYS2 UCRT64\" terminal.\n     Type this line exactly and press Enter:\n\n       pacman -S mingw-w64-ucrt-x86_64-gcc\n\n     When it asks \"Proceed with installation? [Y/n]\", press Enter.\n     Wait until it finishes, then close that window.\n  4. Add g++ to the PATH:\n     - Press the Windows key and type:  environment variables\n     - Click \"Edit the system environment variables\"\n     - Click the \"Environment Variables...\" button\n     - Under \"User variables\", click Path, then Edit...\n     - Click New, and type:   C:\\msys64\\ucrt64\\bin\n     - Click OK, OK, OK.\n\nMACOS\n\n  Open the Terminal app and type:\n\n    xcode-select --install\n\n  Click Install in the box that appears and wait for it to finish.\n\nLINUX (Ubuntu, Debian)\n\n  Open a terminal and type:\n\n    sudo apt update\n    sudo apt install g++",
        why: "The PATH is the list of folders your computer searches when you type a command. Adding C:\\msys64\\ucrt64\\bin to it is what lets you type g++ in any terminal and have Windows find the compiler.",
      },
      {
        id: "a-cp-check-install",
        title: "Step 3: check that it works",
        explain:
          "Close VS Code completely and open it again, so it picks up the changes. Open the terminal inside VS Code from the menu: Terminal, then New Terminal. A panel opens at the bottom of the window. Type g++ --version and press Enter. If you see a version number, everything is installed. If you see an error, the table below says what to do.",
        example:
          "In the VS Code terminal:\n\n  > g++ --version\n  g++ (Rev4, Built by MSYS2 project) 16.2.0\n  Copyright (C) 2026 Free Software Foundation, Inc.\n  ...\n\nYour version number may be different. Any version from 9\nupwards works for everything in this course. On a Mac the first\nline mentions \"Apple clang\": that is fine, it understands the\nsame commands.",
        table: {
          caption: "If the check fails.",
          headers: ["You see", "What it means", "What to do"],
          rows: [
            ["'g++' is not recognized ...", "Windows cannot find g++", "Check the PATH step, then close VS Code completely and open it again"],
            ["pacman: command not found", "You typed pacman in the wrong window", "Use the \"MSYS2 UCRT64\" window from the Start menu, not VS Code"],
            ["command not found: g++ (Mac)", "The Xcode tools are not installed yet", "Run xcode-select --install again and wait for it to finish"],
            ["A version number", "Everything works", "Go on to Step 4"],
          ],
        },
        decision: {
          scenario: "You installed MSYS2 and g++, and added the PATH. But VS Code was open the whole time, and its terminal now says: 'g++' is not recognized as the name of a cmdlet...",
          question: "What should you try first?",
          options: [
            {
              id: "a",
              text: "Close VS Code completely, open it again, and run g++ --version in a new terminal",
              why: "A terminal reads the PATH only when it starts. One that was already open before you changed the PATH cannot see g++ yet.",
            },
            {
              id: "b",
              text: "Uninstall VS Code",
              whyWrong: "VS Code is fine. It only needs restarting to see the new PATH.",
            },
            {
              id: "c",
              text: "Install a different compiler",
              whyWrong: "g++ is installed; the terminal just has not noticed yet.",
            },
            {
              id: "d",
              text: "Buy a new computer",
              whyWrong: "Nothing is wrong with the computer. A restart of VS Code is usually all it takes.",
            },
          ],
          correct: "a",
          aftermath: "Restart VS Code after installing anything. It solves this problem nearly every time.",
        },
      },
      {
        id: "a-cp-course-folder",
        title: "Step 4: make a folder for your programs",
        explain:
          "Keep every program from this course in one folder. Create a folder called cpp-course somewhere easy to find, such as your Documents or Desktop. In VS Code choose File, then Open Folder, and select it. If VS Code asks whether you trust the authors of the files, click Yes: you are the author. The folder's name now appears at the top of the Explorer panel on the left, and any terminal you open starts inside it.",
        example:
          "VS Code with your folder open:\n\n  EXPLORER\n  v CPP-COURSE          <- your folder (empty for now)\n\n  TERMINAL\n  PS C:\\Users\\you\\Documents\\cpp-course>\n                                   ^\n               the terminal is inside your folder\n\nThe terminal's prompt shows which folder you are in.\nWhen you compile, g++ looks for your file in THAT folder.",
        decision: {
          scenario: "You are ready to write your first program.",
          question: "Which of these is the right starting point?",
          options: [
            {
              id: "a",
              text: "VS Code open, with the cpp-course folder opened through File > Open Folder, and g++ --version working in its terminal",
              why: "Editor ready, compiler working, and the terminal inside the folder where your files will live. Everything is in place.",
            },
            {
              id: "b",
              text: "VS Code open with no folder, and the program saved somewhere in Downloads",
              whyWrong: "The terminal would start somewhere else and g++ would not find your file. Keep everything in one opened folder.",
            },
            {
              id: "c",
              text: "The program typed in Microsoft Word",
              whyWrong: "Word changes quotation marks and adds formatting the compiler cannot read. Code belongs in VS Code.",
            },
            {
              id: "d",
              text: "g++ not installed yet, planning to do it later",
              whyWrong: "Without g++ you can write code but never run it. Finish the set-up first.",
            },
          ],
          correct: "a",
          aftermath: "You are set up. Next lesson: Hello, World!",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.2 – 1.3  ·  HELLO, WORLD!  WRITE, COMPILE, RUN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l4-first-program",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.2", "1.3"],
    title: "Hello, World!",
    subtitle: "Write your first program, compile it and run it",
    estimatedMinutes: 22,
    intro:
      "Every programmer's first program prints \"Hello, World!\" on the screen. It has done so since the 1970s, because it proves that the editor, the compiler and the computer are all working together. In this lesson you will type it, compile it and run it. Do not worry yet about what each line means: the next lesson explains every character.",

    atoms: [
      {
        id: "a-cp-hello",
        title: "Type your first program",
        explain:
          "In VS Code, click the New File icon at the top of the Explorer panel (or File, then New File) and name the file hello.cpp. The .cpp ending matters: it tells VS Code and g++ that the file holds C++. Then type the program below exactly as it is shown, character by character: every symbol is there for a reason. Save it with Ctrl+S (Cmd+S on a Mac).",
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
        mistake:
          "Copying and pasting instead of typing. Type it yourself: your fingers need to learn where the brackets, quotes and semicolons go, and typing is how they learn.",
        codeFill: {
          task: "Practise typing it. Fill the gap with the text, in double quotation marks, that makes the program print exactly: Hello, World!",
          code: C`#include <iostream>

int main() {
    std::cout << {{1}} << "\n";
    return 0;
}
`,
          blanks: [{ answers: ['"Hello, World!"'] }],
          expectedOutput: "Hello, World!",
          hint: "Type the words exactly, with the comma and the exclamation mark, and put a double quotation mark \" before and after them.",
          successMessage: "That is the line that makes the program speak. Now let's turn it into a real program on your computer.",
        },
      },
      {
        id: "a-cp-compile",
        title: "Compile it: turn hello.cpp into a program",
        explain:
          "Open the terminal (Terminal, then New Terminal). Check that its prompt ends with your cpp-course folder. Then type the command below and press Enter. It asks g++ to read hello.cpp and build a program called hello. If you typed the program correctly, g++ prints NOTHING: no message at all means success. A new file appears in the Explorer panel: hello.exe on Windows, or hello on a Mac or Linux.",
        example:
          "In the VS Code terminal, inside your cpp-course folder:\n\n  > g++ hello.cpp -o hello\n  >\n\nNo message: it worked. Look in the Explorer panel:\n\n  v CPP-COURSE\n      hello.cpp      <- what you wrote\n      hello.exe      <- the program g++ built  (just \"hello\" on Mac/Linux)",
        table: {
          caption: "g++ hello.cpp -o hello, piece by piece.",
          headers: ["You type", "It means"],
          rows: [
            ["g++", "Run the C++ compiler"],
            ["hello.cpp", "The file you wrote"],
            ["-o hello", "Call the finished program hello (\"o\" stands for output)"],
          ],
        },
        why: "If something in the program is mistyped, g++ prints an error message instead, with the line number of the problem. Check that line against the program above, fix it, save, and run the same command again. Lesson 8 teaches you to read those messages properly.",
        decision: {
          scenario: "You typed g++ hello.cpp -o hello and pressed Enter. No message appeared, and a new file called hello.exe appeared in the Explorer panel.",
          question: "What happened?",
          options: [
            {
              id: "a",
              text: "It compiled successfully: hello.exe is your finished program, ready to run",
              why: "g++ only prints something when there is a problem. Silence plus a new hello.exe means success.",
            },
            {
              id: "b",
              text: "Something went wrong, because nothing was printed",
              whyWrong: "With g++, no message is good news. Errors are always printed, with a line number.",
            },
            {
              id: "c",
              text: "The program has already run and printed Hello, World! somewhere",
              whyWrong: "Compiling only BUILDS the program. Running it is the next step.",
            },
            {
              id: "d",
              text: "hello.exe is a backup copy of hello.cpp",
              whyWrong: "hello.exe is a new file: your C++ translated into a program the computer can run.",
            },
          ],
          correct: "a",
          aftermath: "Built. Now run it.",
        },
      },
      {
        id: "a-cp-run",
        title: "Run it",
        explain:
          "To run the program, type its name with .\\ in front on Windows, or ./ in front on a Mac or Linux, and press Enter. The .\\ means \"the program in this folder\". Hello, World! appears on the next line. That is your first C++ program, written, compiled and run by you.",
        example:
          "The whole thing, from start to finish:\n\n  > g++ hello.cpp -o hello      (compile)\n  > .\\hello                     (run, on Windows)\n  Hello, World!\n\nOn a Mac or Linux:\n\n  $ g++ hello.cpp -o hello\n  $ ./hello\n  Hello, World!",
        mistake:
          "Typing just hello without the .\\ in front. The terminal then looks for a command called hello somewhere else, and says it cannot find it. The .\\ (or ./) tells it to look in the current folder.",
      },
      {
        id: "a-cp-edit-cycle",
        title: "Change it: edit, save, compile, run",
        explain:
          "Change the message between the quotes to something of your own, such as Hello, Lagos!. To see the change you must do all four steps again: edit, save, compile, run. Compiling makes a NEW hello.exe from your changed code; if you skip it, you are still running the old program and see the old message. Within a week this loop will feel automatic.",
        table: {
          caption: "The loop you will repeat for every program in this course.",
          headers: ["Step", "How"],
          rows: [
            ["1 · Edit", "Change the code in hello.cpp"],
            ["2 · Save", "Ctrl+S (a white dot on the file's tab means it is not saved yet)"],
            ["3 · Compile", "g++ hello.cpp -o hello"],
            ["4 · Run", ".\\hello on Windows, ./hello on Mac and Linux"],
          ],
        },
        why: "Tip: in the terminal, press the Up arrow key to bring back the last command you typed, so you do not have to retype the compile command every time.",
        decision: {
          scenario: "You changed the message to Hello, Lagos!, saved the file, and typed .\\hello. It still prints Hello, World!",
          question: "What did you forget?",
          options: [
            {
              id: "a",
              text: "To compile again: hello.exe was built from the old code, so g++ hello.cpp -o hello must be run before .\\hello",
              why: "Saving changes hello.cpp. Only compiling changes hello.exe. Edit, save, compile, run.",
            },
            {
              id: "b",
              text: "To restart the computer",
              whyWrong: "Restarting changes nothing; hello.exe is still the old program until you compile again.",
            },
            {
              id: "c",
              text: "To delete hello.cpp",
              whyWrong: "hello.cpp holds your new code. You need it to compile the new version.",
            },
            {
              id: "d",
              text: "Nothing: C++ takes a few minutes to notice changes",
              whyWrong: "There is no delay. The program you ran is simply the old one.",
            },
          ],
          correct: "a",
          aftermath: "Edit, save, compile, run. Every time.",
        },
      },
      {
        id: "a-cp-run-button",
        title: "A shortcut: the Run button",
        explain:
          "The C/C++ extension adds a small play button (a triangle) at the top right of VS Code when a .cpp file is open. Clicking it, then \"Run C/C++ File\", compiles and runs the file in one go; the first time, choose the option that mentions g++. It is handy, but learn the terminal way first and keep using it this week: it shows you exactly what is happening, and it is how you will build bigger, multi-file projects later in the course.",
        why: "If the Run button ever does something confusing, fall back to the two commands you already know. They always work, and they are what the button runs behind the scenes.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.4 – 1.5  ·  THE SKELETON OF EVERY PROGRAM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l4b-anatomy",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.4", "1.5"],
    title: "The Skeleton of Every C++ Program",
    subtitle: "#include and libraries, main(), braces and return",
    estimatedMinutes: 22,
    intro:
      "Hello, World! has five lines, and almost every C++ program you will ever write starts with the same frame around them. This lesson takes that frame apart one line at a time, so that writing the start of a program becomes something you can do without thinking.",

    atoms: [
      {
        id: "a-cp-anatomy",
        title: "The same frame, every time",
        explain:
          "Look at Hello, World! again. Only one line, the one with the message, is about this particular program. The rest is a frame that almost every C++ program starts with: a line that brings in the tools for printing, the line where the program begins, an opening brace, a closing line that says \"finished\", and a closing brace. Learn the frame once and you can start any program.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "This line is the program's own work.\n";
    return 0;
}
`,
          expectedOutput: "This line is the program's own work.",
        },
        table: {
          caption: "The frame, line by line. The next atoms explain each one.",
          headers: ["Line", "In plain words"],
          rows: [
            ["#include <iostream>", "Bring in the ready-made tools for printing and reading"],
            ["(a blank line)", "Just spacing, to make it easier to read"],
            ["int main() {", "The program starts here. The { opens its body"],
            ["    std::cout << ...;", "Your instructions go here, one per line"],
            ["    return 0;", "Finish, and report \"all went well\""],
            ["}", "Close the body that { opened"],
          ],
        },
      },
      {
        id: "a-cp-include",
        title: "#include: borrowing ready-made tools",
        explain:
          "C++ itself is small. Most of what programs use, such as printing to the screen, lives in libraries: collections of ready-made code that come with the compiler. #include <iostream> tells the compiler \"bring in the iostream library before you start\". iostream stands for input/output stream: it holds std::cout for printing and std::cin for reading the keyboard. The rules: it starts with #, the library name goes in angle brackets < >, it has no semicolon, and it goes at the very top of the file.",
        analogy:
          "A toolbox. Before you can drive a screw you take the screwdriver out of the box. #include <iostream> takes the printing tools out of the box so your program can use them.",
        code: {
          language: CPP,
          code: C`int main() {
    std::cout << "Hello!\n";
    return 0;
}
`,
          compileError: "'cout' is not a member of 'std'",
        },
        why: "Forget the #include and g++ refuses: it has never heard of cout. g++ even adds a note suggesting you include <iostream>. When the compiler says something \"is not a member of std\" or \"was not declared\", a missing #include is one of the first things to check.",
        codeFill: {
          task: "The program above is missing its first line. Type it, so the program compiles and prints Hello!",
          code: C`{{1}}

int main() {
    std::cout << "Hello!\n";
    return 0;
}
`,
          blanks: [{ answers: ["#include <iostream>"] }],
          expectedOutput: "Hello!",
          hint: "A hash sign, the word include, then iostream inside angle brackets. No semicolon.",
          successMessage: "#include <iostream>. You will type that line at the top of nearly every program in this course.",
        },
      },
      {
        id: "a-cp-libraries",
        title: "Other libraries you will meet",
        explain:
          "iostream is the first of many. As the course goes on you will include more libraries, each on its own line at the top of the file, in any order. You only include the ones your program actually uses.",
        table: {
          caption: "Libraries you will use, and when.",
          headers: ["Line", "Gives you", "First used"],
          rows: [
            ["#include <iostream>", "Printing (cout) and reading the keyboard (cin)", "Now"],
            ["#include <string>", "Text in variables", "Week 2"],
            ["#include <iomanip>", "Neat number formatting", "Week 2"],
            ["#include <cmath>", "Powers, square roots and rounding", "Week 3"],
            ["#include <vector>", "Lists that can grow", "Week 6"],
            ["#include <fstream>", "Reading and writing files", "Week 11"],
          ],
        },
        decision: {
          scenario: "Four learners each typed the first line of their program.",
          question: "Which one is correct?",
          options: [
            {
              id: "a",
              text: "#include <iostream>",
              why: "Hash sign, include, and the library name in angle brackets. No semicolon needed.",
            },
            {
              id: "b",
              text: "include <iostream>",
              whyWrong: "The # at the start is required: it marks an instruction for the compiler's first pass.",
            },
            {
              id: "c",
              text: "#include iostream",
              whyWrong: "The library name must be inside angle brackets: <iostream>.",
            },
            {
              id: "d",
              text: "#Include <IOSTREAM>",
              whyWrong: "C++ is case-sensitive: include and iostream are both written in lower case.",
            },
          ],
          correct: "a",
          aftermath: "#include, angle brackets, lower case, no semicolon.",
        },
      },
      {
        id: "a-cp-main",
        title: "int main(): where every program starts",
        explain:
          "When you run a C++ program, the computer looks for a function called main and starts there. Every program has exactly one main. Read int main() as three parts: main is the name; the empty brackets () mean it needs nothing to start; and int (short for integer, a whole number) means that when it finishes it hands back a number to say how it went. return 0; at the end hands back 0, which means \"finished with no problems\".",
        table: {
          caption: "int main() { ... return 0; }, word by word.",
          headers: ["Part", "Meaning"],
          rows: [
            ["int", "main gives back a whole number when it finishes"],
            ["main", "The special name: the program starts here"],
            ["()", "main needs no information to start"],
            ["{", "Start of main's instructions"],
            ["return 0;", "Stop now and report success (0)"],
            ["}", "End of main's instructions"],
          ],
        },
        codeFill: {
          task: "The frame is missing two lines. Fill gap 1 with the line where the program starts (without the brace, which is already there), and gap 2 with the line that finishes it and reports success.",
          code: C`#include <iostream>

{{1}} {
    std::cout << "I can write the frame.\n";
    {{2}}
}
`,
          blanks: [{ answers: ["int main()"] }, { answers: ["return 0;"] }],
          expectedOutput: "I can write the frame.",
          hint: "Gap 1 is int main(), with empty brackets. Gap 2 is return 0; with its semicolon.",
          successMessage: "int main() and return 0;. You can now write the whole frame of a program yourself.",
        },
      },
      {
        id: "a-cp-braces",
        title: "Braces: the start and end of main",
        explain:
          "The braces { and } mark where main's instructions begin and end; everything between them belongs to main. Every { must have a matching }, and the lines between them are indented (pushed in) by four spaces so you can see at a glance what is inside. Instructions run from top to bottom, and return 0; ends the program, so anything written after it inside main never runs.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
`,
          compileError: "expected '}' at end of input",
        },
        why: "The closing brace is missing, so g++ reaches the end of the file still waiting for it: \"expected '}' at end of input\". Typing the closing brace straight after the opening one, then filling in between, makes this mistake almost impossible.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "One\n";
    std::cout << "Two\n";
    return 0;
    std::cout << "Three\n";
}
`,
          question: "Lines run from top to bottom, and return 0; ends the program. What does this print?",
          expectedOutput: "One\nTwo",
          hint: "The program finishes at return 0;. Does the line after it ever get its turn?",
          successMessage: "One and Two. return 0; ended the program, so Three was never printed. Your instructions go BEFORE return 0;.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.6 – 1.7  ·  PRINTING TEXT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l4c-printing",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.6", "1.7"],
    title: "Printing Text to the Screen",
    subtitle: "std::cout, new lines, several lines, and numbers",
    estimatedMinutes: 25,
    intro:
      "Now the part inside the frame. Printing is how your programs talk to the person using them, and for the next few weeks it is how you will see every result. By the end of this lesson you will be able to print any text you like, on as many lines as you like.",

    atoms: [
      {
        id: "a-cp-cout",
        title: "std::cout: printing a line of text",
        explain:
          "std::cout << \"Good morning\"; prints Good morning on the screen. Read it in four parts. std::cout is the screen (cout means \"console output\"; std:: means it comes from the standard library you included). << sends what is on its right to the screen: think of it as an arrow pointing into cout. \"Good morning\" is the text, inside double quotation marks. And ; ends the instruction, like a full stop ends a sentence.",
        table: {
          caption: "std::cout << \"Good morning\\n\"; piece by piece.",
          headers: ["Piece", "Meaning"],
          rows: [
            ["std::cout", "The screen"],
            ["<<", "Send this to the screen (the arrows point at cout)"],
            ["\"Good morning\\n\"", "The text, in double quotes. \\n ends the line (more on that below)"],
            [";", "End of the instruction"],
          ],
        },
        why: "Typing std:: in front of every cout gets tiring quickly. The next atom shows you the one line that lets you write just cout, and from then on that is how this course writes it.",
        codeFill: {
          task: "Write a whole printing line yourself. Fill the gap so the program prints exactly: I am learning C++",
          code: C`#include <iostream>

int main() {
    {{1}}
    return 0;
}
`,
          blanks: [
            {
              answers: [
                C`std::cout << "I am learning C++\n";`,
                C`std::cout << "I am learning C++" << "\n";`,
                C`std::cout << "I am learning C++" << std::endl;`,
                C`std::cout << "I am learning C++";`,
              ],
              width: 36,
            },
          ],
          expectedOutput: "I am learning C++",
          hint: "Copy the shape: std::cout << \"your text\\n\"; with the exact words between the quotes and a semicolon at the end.",
          successMessage: "A complete line of C++, written by you. Everything else in this lesson is variations on it.",
        },
      },
      {
        id: "a-cp-using-namespace",
        title: "using namespace std: just write cout",
        explain:
          "The std:: in std::cout names a namespace: a labelled group of names. The standard library keeps all of its tools (cout, cin, string, endl and hundreds more) inside a namespace called std, so they can never clash with names you invent. std::cout means \"the cout that lives in std\". Writing that every time is long, so add one line under your #include lines: using namespace std;. It tells the compiler \"when I write a name, look inside std as well\". After it, you can write just cout. From here on, every program in this course starts this way.",
        analogy:
          "Two classmates are both called Tunde, so the teacher says \"Tunde from Lagos\" and \"Tunde from Kano\". In a class with only one Tunde, everyone just says Tunde. using namespace std; tells the compiler that, in this program, cout simply means the standard one.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "No more std:: in front of cout!\n";
    cout << "The program works exactly the same.\n";
    return 0;
}
`,
          expectedOutput: "No more std:: in front of cout!\nThe program works exactly the same.",
        },
        table: {
          caption: "The frame you will start every program with from now on.",
          headers: ["Line", "In plain words"],
          rows: [
            ["#include <iostream>", "Bring in the printing tools"],
            ["using namespace std;", "Let me write cout instead of std::cout"],
            ["int main() {", "The program starts here"],
            ["    cout << \"...\";", "Your instructions"],
            ["    return 0;", "Finish, and report success"],
            ["}", "Close main"],
          ],
        },
        why: "Most beginner courses and books write it this way, so it is what you will see most when you look things up. In Week 15, once your programs are split across several files, you will learn why professional teams often go back to writing std:: in full, and when that matters.",
        codeFill: {
          task: "This program uses plain cout, but one line is missing, so it will not compile. Fill the gap with the line that lets you write cout instead of std::cout.",
          code: C`#include <iostream>
{{1}}

int main() {
    cout << "I can write cout on its own now.\n";
    return 0;
}
`,
          blanks: [{ answers: ["using namespace std;"] }],
          expectedOutput: "I can write cout on its own now.",
          hint: "Three words and a semicolon: using, namespace, and the name of the standard library's namespace.",
          successMessage: "using namespace std; One line under the #includes, and plain cout works everywhere in your program.",
        },
      },
      {
        id: "a-cp-text-exact",
        title: "Text is printed exactly as you type it",
        explain:
          "Whatever is between the double quotes is printed exactly: every space, every capital letter, every comma. The quotes themselves are not printed; they only mark where the text starts and ends. You can also send several pieces of text in one instruction by adding more << between them; they are printed one after another with nothing added between, so put any spaces you want inside the quotes.",
        table: {
          caption: "Common mistakes when printing text.",
          headers: ["Wrong", "Problem", "Right"],
          rows: [
            ["cout << \"Hello;", "The closing quote is missing", "cout << \"Hello\";"],
            ["cout << Hello;", "No quotes, so C++ looks for something named Hello", "cout << \"Hello\";"],
            ["cout << 'Hello';", "Single quotes are for ONE character only", "cout << \"Hello\";"],
            ["cout << \"Hello\"", "No semicolon at the end", "cout << \"Hello\";"],
            ["cout >> \"Hello\";", "The arrows point the wrong way", "cout << \"Hello\";"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "Good morning, " << "class" << "!\n";
    cout << "Today: " << "C++" << " practice\n";
    return 0;
}
`,
          question: "Each << adds the next piece straight after the last, with only the spaces that are inside the quotes. What does this print?",
          expectedOutput: "Good morning, class!\nToday: C++ practice",
          hint: "Join the pieces exactly as they are. The space after the comma is inside the first piece; the space before practice is inside the last one.",
          successMessage: "Exactly right. The pieces are glued together with only the spaces you put inside the quotes.",
        },
      },
      {
        id: "a-cp-several-lines",
        title: "Several lines: instructions run in order",
        explain:
          "A program can print as many lines as you like: write one cout instruction under another, and they run from top to bottom, in order. But cout never starts a new line by itself. If one cout does not end with \\n, the next one carries on straight after it, on the same line.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "Hello";
    cout << "World\n";
    cout << "Done\n";
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
        id: "a-cp-newlines",
        title: "Starting a new line: \\n and endl",
        explain:
          "\\n inside the quotes means \"start a new line here\". You type two keys, a backslash and the letter n, but it counts as one special character and is never printed as \\n. Put it at the end of each line of text, or in the middle to split one piece of text over two lines. You will also see endl, which ends the line too: cout << \"Hi\" << endl;. Both work; this course mostly uses \\n because it is shorter.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "Line one\n";
    cout << "Line two\nLine three\n";
    cout << "Line four" << endl;
    return 0;
}
`,
          expectedOutput: "Line one\nLine two\nLine three\nLine four",
        },
        codeFill: {
          task: "Make this address label print on three lines. Fill both gaps with what starts a new line.",
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "Memora Academy{{1}}";
    cout << "12 Allen Avenue{{2}}";
    cout << "Ikeja, Lagos\n";
    return 0;
}
`,
          blanks: [{ answers: [C`\n`] }, { answers: [C`\n`] }],
          expectedOutput: "Memora Academy\n12 Allen Avenue\nIkeja, Lagos",
          hint: "Look at the last line: it already ends with the two characters that start a new line. Type the same two characters in each gap.",
          successMessage: "\\n twice. Without them, the whole address would have run together on one line.",
        },
      },
      {
        id: "a-cp-cout-values",
        title: "Printing numbers and calculations",
        explain:
          "cout can print more than text. A number without quotes is printed as a number, and a calculation without quotes is worked out first and its answer printed. You can chain text and numbers with << in one statement; put spaces inside the quotes where you want them.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "7 + 5" << "\n";
    cout << 7 + 5 << "\n";
    cout << "7 + 5 = " << 7 + 5 << "\n";
    return 0;
}
`,
          expectedOutput: "7 + 5\n12\n7 + 5 = 12",
        },
        why: "Line 4 prints characters because they are in quotes. Line 5 prints the result because they are not. Line 6 mixes both, which is how almost every useful output line in this course is built.",
        codeFill: {
          task: "A trader sold goods worth 4850 naira in the morning and 3975 in the afternoon. Fill the gap so C++ calculates the day's total. Do not type the answer yourself: let the program do the arithmetic.",
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "Total for the day: " << {{1}} << "\n";
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
      {
        id: "a-cp-print-practice",
        title: "Your turn: print a small report",
        explain:
          "Put it all together: the frame, several cout lines, text in quotes, new lines and one calculation. Fill each gap with a complete printing instruction. This is exactly the kind of program you will build in this module's mini-project.",
        codeFill: {
          task: "Fill gap 1 so it prints the line Student: Ada, and gap 2 so it prints Total score: followed by the result of 78 + 85 (let C++ add them).",
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "=== RESULT SLIP ===\n";
    {{1}}
    {{2}}
    cout << "===================\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                C`cout << "Student: Ada\n";`,
                C`std::cout << "Student: Ada\n";`,
                C`cout << "Student: Ada" << "\n";`,
                C`std::cout << "Student: Ada" << "\n";`,
                C`cout << "Student: Ada" << endl;`,
                C`std::cout << "Student: Ada" << std::endl;`
              ],
              width: 32,
            },
            {
              answers: [
                C`cout << "Total score: " << 78 + 85 << "\n";`,
                C`std::cout << "Total score: " << 78 + 85 << "\n";`,
                C`cout << "Total score: " << 78 + 85 << endl;`,
                C`std::cout << "Total score: " << 78 + 85 << std::endl;`,
                C`cout << "Total score: " << (78 + 85) << "\n";`,
                C`std::cout << "Total score: " << (78 + 85) << "\n";`
              ],
              width: 44,
            },
          ],
          expectedOutput: "=== RESULT SLIP ===\nStudent: Ada\nTotal score: 163\n===================",
          hint: "Gap 1 is plain text in quotes ending with \\n. Gap 2 is text in quotes (ending with a space after the colon), then << and the calculation without quotes, then << \"\\n\".",
          successMessage:
            "A real little program, every printing line written by you. You can now start any C++ program and make it say anything you want.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 1.8 – 1.9  ·  THE IDEAS BEHIND WHAT YOU HAVE DONE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l2-programs",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["1.8", "1.9"],
    title: "What a Program Is, and How a Computer Runs One",
    subtitle: "Instructions, input and output, the CPU and memory",
    estimatedMinutes: 14,
    intro:
      "You have now written, compiled and run real programs. Time to step back and look at what you have been doing: what a program actually is, and what the computer physically does when you run one. You will finish by tracing a short program yourself, exactly the way a computer would.",

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
        codeFill: {
          task: "The CPU runs instructions one at a time, in order. This program prints the steps of an ATM withdrawal, but step 2 is missing. Fill the gap so it prints 2. Check PIN and balance, in the right place.",
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "1. Read card\n";
    {{1}}
    cout << "3. Give cash\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                C`cout << "2. Check PIN and balance\n";`,
                C`std::cout << "2. Check PIN and balance\n";`,
                C`cout << "2. Check PIN and balance" << "\n";`,
                C`std::cout << "2. Check PIN and balance" << "\n";`,
                C`cout << "2. Check PIN and balance" << endl;`,
                C`std::cout << "2. Check PIN and balance" << std::endl;`
              ],
              width: 42,
            },
          ],
          expectedOutput: "1. Read card\n2. Check PIN and balance\n3. Give cash",
          hint: "A normal printing line, in the same shape as the lines above and below the gap, with the step 2 text.",
          successMessage: "Three instructions, run in the order written. Put step 2 after step 3 and the ATM would give cash before checking your PIN.",
        },
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
using namespace std;
int main() {
    int a = 10;
    int b = 4;
    a = a + b;
    b = a * 2;
    cout << a << "\n";
    cout << b << "\n";
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
using namespace std;
int main() {
    int x = 7;
    int y = 2;
    x = x + y;
    y = x - y;
    x = x - y;
    cout << x << "\n";
    cout << y << "\n";
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
     LESSON 7 · 1.10 – 1.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l3-what-is-cpp",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["1.10", "1.11"],
    title: "What C++ Is, and How Code Becomes a Program",
    subtitle: "History, uses, source code, compilers and executables",
    estimatedMinutes: 15,
    intro:
      "Every time you typed g++ hello.cpp -o hello, a compiler translated your C++ into machine code: the patterns of ones and zeros a processor actually understands. This lesson explains where C++ came from, what makes it different from other languages, and exactly what happened inside that one command.",

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
        codeFill: {
          task: "C++ was started in 1979 and got its name 4 years later. Fill the gap so the program calculates the year itself, rather than you typing 1983.",
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "C++ got its name in " << {{1}} << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["1979 + 4", "4 + 1979"] }],
          expectedOutput: "C++ got its name in 1983",
          hint: "A calculation, with no quotation marks: the starting year plus the number of years.",
          successMessage: "1983. Text in quotes, a calculation without them: the printing skills from Lesson 5 at work.",
        },
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
          "hello.cpp is a plain text file. Opened in any text editor, it looks like this:\n\n  #include <iostream>\n using namespace std;\n  using namespace std;\n\n  int main() {\n      cout << \"Hello!\\n\";\n      return 0;\n  }\n\nThe same instructions as machine code would be thousands of\nbytes of numbers that no person could read.",
        mistake:
          "Writing code in a word processor such as Microsoft Word. It quietly replaces straight quotes \" with curly ones “ ”, which the compiler rejects. Always write code in a code editor such as VS Code.",
      },
      {
        id: "a-cp-compiler",
        title: "From source code to an executable",
        explain:
          "A compiler is a program that translates your whole source file into machine code before the program runs. The result is an executable: a file the computer can run directly, such as the hello.exe you built in Lesson 3. Building it happens in stages, though your one command, g++ hello.cpp -o hello, runs them all.",
        table: {
          caption: "What happens when you compile hello.cpp with g++.",
          headers: ["Stage", "What it does", "Example"],
          rows: [
            ["1 · Preprocessor", "Handles lines that start with #, such as pasting in the contents of <iostream>", "#include <iostream> brings in the tools for printing"],
            ["2 · Compiler", "Checks your C++ is valid and translates it into machine code", "Reports errors such as a missing semicolon"],
            ["3 · Linker", "Joins your machine code with the library code it uses", "Connects cout to the code that actually prints"],
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
            "You email your hello.exe to a friend who also uses Windows. They have never installed g++ or VS Code.",
          question: "Can they run it?",
          options: [
            {
              id: "a",
              text: "Yes: hello.exe is already machine code, so it runs without a compiler",
              why: "The compiler is only needed to BUILD the program. The finished executable runs on any similar computer, which is how all the software you install is delivered.",
            },
            {
              id: "b",
              text: "No: they need hello.cpp and g++ to run it",
              whyWrong: "They would need those to rebuild or change it, not to run the finished executable.",
            },
            {
              id: "c",
              text: "Only if they open it in VS Code",
              whyWrong: "An executable runs directly; it does not need an editor.",
            },
            {
              id: "d",
              text: "Yes, and it will also run on a Mac",
              whyWrong: "An executable is built for one kind of system. For a Mac, the source must be compiled again on, or for, a Mac.",
            },
          ],
          correct: "a",
          aftermath: "Compile once, run on any similar computer. That is what makes compiled programs easy to share and fast to run.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 1.12 – 1.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l5-syntax-errors",
    moduleId: "cp-m1-intro",
    sectionId: SECTION_ID,
    order: 8,
    covers: ["1.12", "1.13", "1.14"],
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
            ["End statements with ;", "cout << \"Hi\\n\"", "cout << \"Hi\\n\";"],
            ["Case matters", "Std::Cout << \"Hi\\n\";", "cout << \"Hi\\n\";"],
            ["Text needs double quotes", "cout << Hi;", "cout << \"Hi\";"],
            ["Every { needs a }", "int main() { return 0;", "int main() { return 0; }"],
            ["The arrows point into cout", "cout >> \"Hi\";", "cout << \"Hi\";"],
          ],
        },
        decision: {
          scenario: "Four students each wrote one line to print a score.",
          question: "Which line is valid C++?",
          options: [
            {
              id: "a",
              text: "cout << \"Score: \" << 85 << \"\\n\";",
              why: "Lower-case cout, << pointing into it, text in double quotes, the number without quotes, and a semicolon at the end.",
            },
            {
              id: "b",
              text: "cout << \"Score: \" << 85 << \"\\n\"",
              whyWrong: "No semicolon at the end, so the statement never finishes and the compiler reports an error.",
            },
            {
              id: "c",
              text: "Cout << \"Score: \" << 85 << \"\\n\";",
              whyWrong: "Cout with a capital C does not exist. C++ is case-sensitive.",
            },
            {
              id: "d",
              text: "cout << 'Score: ' << 85 << \"\\n\";",
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
using namespace std;

int main() {
    cout << "Ready\n"
    return 0;
}
`,
          compileError: "error: expected ';' before 'return'",
        },
        example:
          "The full message from g++ looks like this:\n\n  hello.cpp: In function 'int main()':\n  hello.cpp:4:27: error: expected ';' before 'return'\n      4 |     cout << \"Ready\\n\"\n        |                           ^\n        |                           ;\n      5 |     return 0;\n\nRead it as: in hello.cpp, line 4, column 27, a ; was expected.\ng++ even draws where it belongs.",
        codeFill: {
          task: "Here is the same program with the broken line removed. Type line 4 again, correctly, so it compiles and prints Ready and then Set.",
          code: C`#include <iostream>
using namespace std;

int main() {
    {{1}}
    cout << "Set\n";
    return 0;
}
`,
          blanks: [{ answers: [C`cout << "Ready\n";`, C`std::cout << "Ready\n";`], width: 26 }],
          expectedOutput: "Ready\nSet",
          hint: "It is the line from the example above, with the one character the compiler asked for added at the very end.",
          successMessage:
            "Fixed. One character stopped the whole program from being built; one character fixed it. That is normal, and now you know how to find it.",
        },
      },
      {
        id: "a-cp-warnings",
        title: "Ask the compiler to warn you",
        explain:
          "So far you have compiled with g++ hello.cpp -o hello. That command stops on ERRORS, but it stays quiet about code that is legal yet probably a mistake. Add two extra settings and g++ will also print WARNINGS about such code: -Wall (\"warn about all the common problems\") and -Wextra (\"and a few more\"). From now on, compile every program like this. It is the same command as before with two words added, and when nothing is wrong it still prints nothing.",
        example:
          "Before (still works):\n\n  > g++ hello.cpp -o hello\n\nFrom now on:\n\n  > g++ -Wall -Wextra hello.cpp -o hello\n  > .\\hello\n  Hello, World!\n\nIf g++ prints a line containing  warning:  the program was still\nbuilt and will run, but read the warning: it is the compiler\npointing at something that is very likely a bug. You will meet\nyour first real warnings in Week 3.\n\nYou may also see  -std=c++17  in this course's instructions. It\nsimply makes sure g++ uses the C++17 version of the language, the\none this course teaches. Recent versions of g++ use it already.",
        table: {
          caption: "The compile command, piece by piece.",
          headers: ["Piece", "Meaning"],
          rows: [
            ["g++", "Run the C++ compiler"],
            ["-Wall -Wextra", "Also warn me about code that is probably a mistake"],
            ["hello.cpp", "The file to compile"],
            ["-o hello", "Call the finished program hello"],
          ],
        },
        why: "Warnings are free help from the compiler. Professionals keep them on all the time and fix every one, and the earlier you build that habit the fewer bugs reach your running programs.",
      },
      {
        id: "a-cp-runtime-errors",
        title: "Runtime errors and logic errors",
        explain:
          "A runtime error happens while the program is running: the code was valid C++ and compiled, but something goes wrong as it executes, such as dividing a whole number by zero or opening a file that does not exist. The program may crash or stop with a message. A logic error is quieter: the program compiles, runs to the end and prints an answer, but the answer is wrong because the instructions are wrong. The compiler cannot catch either kind; only testing and tracing can.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << "Average of 70 and 80: ";
    cout << 70 + 80 / 2 << "\n";
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
using namespace std;

int main() {
    // VAT in Nigeria is 7.5%, set by the Finance Act 2019.
    cout << "Price: 2000\n";
    // cout << "Discount: 200\n";
    cout << "VAT: " << 2000 * 75 / 1000 << "\n";  // 7.5% of 2000
    /* The total is printed last.
    cout << "Thank you\n"; */
    cout << "Total: 2150\n";
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
          "Valid, but hard to read:\n\n#include <iostream>\nusing namespace std;\nint main(){cout<<\"Name: Ada\\n\";cout<<\"Goal: games\\n\";return 0;}\n\nThe same program, readable:\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Name: Ada\\n\";\n    cout << \"Goal: games\\n\";\n    return 0;\n}\n\nIdentical machine code. Only one of them shows you its shape.",
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
        "Build your own introduction program in a new file called intro.cpp, in your cpp-course folder. Compile it with g++ -Wall -Wextra intro.cpp -o intro and run it with .\\intro (./intro on a Mac or Linux). Do not copy a finished program: start from the frame, add one line at a time, and compile and run after each change.",
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
