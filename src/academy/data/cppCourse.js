/**
 * C++ PROGRAMMING: FUNDAMENTALS TO ADVANCED DEVELOPMENT
 *
 * Authored from the Memora Smart Technologies C++ curriculum: five phases and
 * sixteen modules over sixteen weeks, from "what is a computer program?" to a
 * tested, documented C++ application built and presented by the learner.
 *
 * Course content is DATA, never markup. The shape is the same as
 * pythonCourse.js, so the catalog, curriculum tree, lesson player, progress
 * engine and stats band render it without changes.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          one curriculum module (one week)
 *           └── lessons/{lessonId}    two to four curriculum topics
 *                 └── atoms/{atomId}  one idea each
 *
 * ── THE LEARNING MODEL ───────────────────────────────────────────────────
 * Every concept moves through six steps, and the lesson player enforces the
 * order rather than leaving it to good intentions:
 *
 *   Understand   one idea in plain language, and why it exists (`explain`,
 *                `why`, `analogy`)
 *   Demonstrate  a complete, working program and its real output (`code`)
 *   Practice     graded, and it gates the atom: predict what a program
 *                prints (`codeExercise`), write the missing C++ (`codeFill`)
 *                or make the call (`decision`)
 *   Validate     the 4–5 question lesson check, graded on the server
 *   Apply        each module ends with a mini-project built in VS Code
 *   Advance      70% on the check marks the lesson passed
 *
 * ── EVERY PROGRAM IS REAL ────────────────────────────────────────────────
 * C++ cannot run inside the learner's browser here, so `npm run
 * validate:content` compiles and runs every `code`, `codeExercise` and
 * `codeFill` with g++ (C++17, -Wall -Wextra) and fails the build if a lesson
 * quotes an output the program does not print, or if any accepted answer to
 * a `codeFill` does not compile and work. See lib/academy/cpp/run.mjs.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the topic list from the source document,
 * numbered module.topic. Every lesson declares which numbers it `covers`, and
 * `npm run test:academy` fails if any topic is not taught. Topic 1.0 (what
 * C++ can build and the road ahead) and the Module 16 topics are additions:
 * the source document asks for that introduction and lists Module 16 as a
 * project week without numbered topics.
 */

export const CPP_COURSE = {
  id: "cpp",
  slug: "cpp",
  title: "C++ Programming",
  subtitle: "Fundamentals to advanced development",
  tagline:
    "Learn to program in the language behind game engines, browsers, operating systems and trading systems, from your first line of code to a complete application you designed, tested and built yourself.",
  description:
    "A sixteen-week programme in five phases, adjustable to four to six months at a slower pace. You start with what a program is and compile your first C++ program in Week 1. Phase 1 builds the foundations: variables, data types, input and output, operators, decisions and loops. Phase 2 teaches you to structure programs with functions, arrays, vectors and strings. Phase 3 opens up how C++ really works: pointers, references and memory, then classes, encapsulation, inheritance and polymorphism. Phase 4 adds the professional toolkit: exceptions and files, templates and the Standard Template Library, and data structures with searching and sorting. Phase 5 makes you a developer rather than a student: modern C++ and resource management, debugging, testing, multi-file builds with CMake and Git, and a capstone application you plan, build, test and present. Every concept follows the same path: understand it, see a complete working program, practise it yourself, prove it on a short check, then apply it in a mini-project. Every program in the course has been compiled and run, so every output you are shown is what C++ really prints. No prior programming experience required.",

  status: "live",
  level: "Complete beginner → Advanced",
  durationMonths: 4,
  hoursPerWeek: "8–12",
  language: "English",
  standard: "C++17, with selected C++20 features",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "logic",
      name: "Problem-solving & tracing",
      short: "Logic",
      blurb: "Break a problem into steps, and trace a program line by line before you trust it.",
      icon: "fas fa-diagram-project",
      accent: "#7c3aed",
    },
    {
      id: "cpp",
      name: "C++17 / C++20 & g++",
      short: "C++",
      blurb: "The language itself, compiled with GCC (MinGW-w64 on Windows) in VS Code.",
      icon: "fas fa-microchip",
      accent: "#1d4ed8",
    },
    {
      id: "stl",
      name: "The Standard Template Library",
      short: "STL",
      blurb: "Vectors, maps, sets, iterators, algorithms and lambdas: the tools every C++ developer reaches for.",
      icon: "fas fa-cubes",
      accent: "#0e7490",
    },
    {
      id: "engineering",
      name: "Debugger, tests, CMake & Git",
      short: "Engineering",
      blurb: "Breakpoints, assertions and unit tests, multi-file builds and version control.",
      icon: "fas fa-code-branch",
      accent: "#b45309",
    },
  ],

  outcomes: [
    "Explain how source code becomes a running program, and set up and use a C++ compiler and editor",
    "Write correct C++ with variables, types, operators, conditions and loops, and trace any program by hand",
    "Structure programs with functions, and process data with arrays, vectors and strings",
    "Understand memory: addresses, pointers, references, the stack and the heap, and how to avoid leaks",
    "Design programs with classes, encapsulation, inheritance, polymorphism and composition",
    "Handle errors with exceptions and keep data between runs with files",
    "Use templates and the STL, and choose data structures and algorithms by their cost",
    "Write modern, safe C++ with RAII, smart pointers and move semantics, and debug, test and build multi-file projects",
  ],

  audience: [
    "Complete beginners who have never written a line of code",
    "Students preparing for computer science or engineering studies",
    "Aspiring software developers who want to understand how programs really work",
    "Learners who know another language and want C++'s depth: memory, performance and systems",
  ],

  requirements: [
    "A laptop or desktop computer (Windows, macOS or Linux)",
    "A stable internet connection for the lessons",
    "Permission to install free software: Visual Studio Code and a C++ compiler (GCC / MinGW-w64)",
    "No prior programming experience",
  ],

  phases: [
    {
      phase: 1,
      title: "Programming foundations",
      weeks: [1, 2, 3, 4],
      summary:
        "Learn what programming is, write your first programs, work with variables and operators, and master decision-making and loops.",
    },
    {
      phase: 2,
      title: "Core programming skills",
      weeks: [5, 6, 7],
      summary:
        "Break programs into reusable components, work with collections of data, and manipulate text effectively.",
    },
    {
      phase: 3,
      title: "Object-oriented programming",
      weeks: [8, 9, 10],
      summary:
        "Learn how software models real-world entities, how objects manage data, and how to structure larger applications.",
    },
    {
      phase: 4,
      title: "Advanced programming tools",
      weeks: [11, 12, 13],
      summary:
        "Handle failures, organise multi-file projects, use the C++ Standard Library, and develop efficient algorithms.",
    },
    {
      phase: 5,
      title: "Professional application development",
      weeks: [14, 15, 16],
      summary:
        "Apply modern C++ practices, test and debug programs, and build complete applications.",
    },
  ],

  months: [
    {
      month: 1,
      title: "Programming Foundations",
      focus: "Beginner",
      summary:
        "Phase 1. What a program is and how C++ turns your code into one, then variables, types, input and output, operators, decisions and loops.",
      modules: [
        {
          id: "cp-m1-intro",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 1 · Introduction to Programming and C++",
          summary:
            "What you can build with C++ and the road ahead, what a program is, how C++ becomes a running program, and your first program.",
          atoms: 26,
          topics: [
            "What C++ can build, and the sixteen weeks ahead",
            "Programs, and how computers execute instructions",
            "C++: its uses and history",
            "Source code, compilers and executables",
            "Setting up VS Code and g++, and the first program",
            "Syntax, errors and comments",
          ],
          curriculum: [
            ["1.0", "Course introduction: what you can build with C++ and what you will learn"],
            ["1.1", "What is a computer program?"],
            ["1.2", "How computers execute instructions"],
            ["1.3", "What is C++? Its uses and history"],
            ["1.4", "Source code, compilers and executables"],
            ["1.5", "Installing and configuring a C++ environment"],
            ["1.6", "Your first C++ program"],
            ["1.7", "Understanding #include, main() and cout"],
            ["1.8", "Statements, syntax and braces"],
            ["1.9", "Compilation errors versus runtime errors"],
            ["1.10", "Comments and basic code readability"],
          ],
          project:
            "Build a personal introduction program that prints a student's name, learning goals, and a welcome message.",
        },
        {
          id: "cp-m2-variables",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Module 2 · Variables, Data Types and Input/Output",
          summary:
            "Store, retrieve and display information correctly: variables, the core types, constants, cout and cin, conversion and formatted numbers.",
          atoms: 20,
          topics: [
            "Data, variables and memory",
            "Naming, integers and decimals",
            "char, bool and constants",
            "Output with cout, input with cin",
            "Conversion, integer division and formatting",
          ],
          curriculum: [
            ["2.1", "What is data?"],
            ["2.2", "Variables and memory concepts"],
            ["2.3", "Declaring and initializing variables"],
            ["2.4", "Naming rules and meaningful identifiers"],
            ["2.5", "Integers: int and long long"],
            ["2.6", "Decimal numbers: float and double"],
            ["2.7", "Characters and char"],
            ["2.8", "Boolean values: bool"],
            ["2.9", "Constants: const and basic constexpr"],
            ["2.10", "Output with cout and newline characters"],
            ["2.11", "Input with cin"],
            ["2.12", "Reading multiple values"],
            ["2.13", "Type conversion and casting"],
            ["2.14", "Understanding integer division and precision"],
            ["2.15", "Formatting numbers with fixed and setprecision"],
          ],
          project:
            "Student information and result calculator that accepts student details and examination scores and displays a formatted report.",
        },
        {
          id: "cp-m3-operators",
          order: 3,
          phase: 1,
          week: "Week 3",
          title: "Module 3 · Operators and Expressions",
          summary:
            "Perform calculations and understand exactly how C++ evaluates an expression: operators, precedence, conversion and the classic arithmetic mistakes.",
          atoms: 14,
          topics: [
            "Arithmetic, assignment, increment and decrement",
            "Comparison and logical operators",
            "Precedence, evaluation order and conversion",
            "Common mistakes and formula translation",
          ],
          curriculum: [
            ["3.1", "Arithmetic operators: +, -, *, /, %"],
            ["3.2", "Assignment and compound assignment"],
            ["3.3", "Increment and decrement"],
            ["3.4", "Comparison operators"],
            ["3.5", "Logical operators: &&, ||, !"],
            ["3.6", "Operator precedence and associativity"],
            ["3.7", "Expressions and evaluation order"],
            ["3.8", "Implicit and explicit conversion"],
            ["3.9", "Common arithmetic mistakes"],
            ["3.10", "Practical calculations and formula translation"],
          ],
          project:
            "A calculator that performs arithmetic operations, calculates percentages, converts temperatures, and computes simple interest.",
        },
        {
          id: "cp-m4-control",
          order: 4,
          phase: 1,
          week: "Week 4",
          title: "Module 4 · Conditions, Loops and Program Flow",
          summary:
            "Teach programs to make decisions and repeat tasks: if, else if, switch, the conditional operator, while, do-while and for, and tracing loops by hand.",
          atoms: 19,
          topics: [
            "Boolean conditions, if and if-else",
            "Nested conditions, else if, switch and ?:",
            "while, do-while and for",
            "Counters, accumulators, nested loops, break and continue",
            "Infinite loops, off-by-one errors, and combining it all",
          ],
          curriculum: [
            ["4.1", "Boolean conditions"],
            ["4.2", "The if statement"],
            ["4.3", "if-else"],
            ["4.4", "Nested conditions"],
            ["4.5", "The else if ladder"],
            ["4.6", "switch statements"],
            ["4.7", "The conditional operator ?:"],
            ["4.8", "The while loop"],
            ["4.9", "The do-while loop"],
            ["4.10", "The for loop"],
            ["4.11", "Counters, accumulators and loop tracing"],
            ["4.12", "Nested loops"],
            ["4.13", "break and continue"],
            ["4.14", "Infinite loops and off-by-one errors"],
            ["4.15", "Combining conditions and loops"],
          ],
          project:
            "Grade classification system, multiplication table generator, number guessing game, prime number checker and a basic ATM menu simulator.",
          mastery:
            "Write a program that accepts several scores, calculates their average, assigns a grade, and repeats the process for multiple students.",
        },
      ],
    },
    {
      month: 2,
      title: "Core Skills and Memory",
      focus: "Beginner → Intermediate",
      summary:
        "Phase 2 and the start of Phase 3. Functions, arrays and vectors, strings, then pointers, references and how C++ uses memory.",
      modules: [
        {
          id: "cp-m5-functions",
          order: 5,
          phase: 2,
          week: "Week 5",
          title: "Module 5 · Functions and Modular Programming",
          summary:
            "Move from long programs to reusable components: defining and calling functions, parameters and returns, scope, references, overloading, defaults and recursion.",
          atoms: 15,
          topics: [
            "Why functions exist; defining and calling them",
            "Parameters, return values, scope and prototypes",
            "Pass-by-value, pass-by-reference, overloading and defaults",
            "Recursion and breaking a problem into functions",
          ],
          curriculum: [
            ["5.1", "Why functions exist"],
            ["5.2", "Declaring and defining functions"],
            ["5.3", "Calling a function"],
            ["5.4", "Parameters and arguments"],
            ["5.5", "Return values and void"],
            ["5.6", "Local and global scope"],
            ["5.7", "Function prototypes"],
            ["5.8", "Pass-by-value"],
            ["5.9", "Pass-by-reference"],
            ["5.10", "Function overloading"],
            ["5.11", "Default arguments"],
            ["5.12", "Basic recursion"],
            ["5.13", "Breaking a problem into functions"],
          ],
          project:
            "A menu-driven mathematics toolkit with separate functions for addition, subtraction, multiplication, division, and other calculations.",
        },
        {
          id: "cp-m6-arrays",
          order: 6,
          phase: 2,
          week: "Week 6",
          title: "Module 6 · Arrays, Vectors and Multidimensional Data",
          summary:
            "Manage collections of related information: arrays and their bounds, totals and searches, sorting, two-dimensional data and std::vector.",
          atoms: 14,
          topics: [
            "Why collections; arrays, indexing and traversal",
            "Sum, average, min, max, searching and sorting",
            "Two-dimensional arrays and matrices",
            "std::vector, and passing collections to functions",
          ],
          curriculum: [
            ["6.1", "Why collections of data are useful"],
            ["6.2", "Declaring and initializing arrays"],
            ["6.3", "Array indexing and bounds"],
            ["6.4", "Traversing arrays with loops"],
            ["6.5", "Calculating sum, average, minimum and maximum"],
            ["6.6", "Searching arrays"],
            ["6.7", "Basic array sorting"],
            ["6.8", "Two-dimensional arrays"],
            ["6.9", "Matrix operations"],
            ["6.10", "Introduction to std::vector"],
            ["6.11", "Adding, removing and accessing vector elements"],
            ["6.12", "Arrays versus vectors"],
            ["6.13", "Passing arrays and vectors to functions"],
          ],
          project:
            "Student performance analyzer that stores scores, calculates class averages, identifies the highest and lowest scores, and ranks results.",
        },
        {
          id: "cp-m7-strings",
          order: 7,
          phase: 2,
          week: "Week 7",
          title: "Module 7 · Strings and Text Processing",
          summary:
            "Work with names, sentences, passwords and other text: std::string, getline, searching and slicing, case, counting, palindromes and the input buffer.",
          atoms: 15,
          topics: [
            "Characters, std::string, words and whole lines",
            "Length, indexing, joining, comparing, find and substr",
            "Case, counting and palindromes",
            "Input-buffer problems",
          ],
          curriculum: [
            ["7.1", "Characters versus strings"],
            ["7.2", "Introduction to std::string"],
            ["7.3", "Reading a single word"],
            ["7.4", "Reading complete sentences with getline"],
            ["7.5", "String length and indexing"],
            ["7.6", "Concatenation and comparison"],
            ["7.7", "Searching within strings"],
            ["7.8", "Extracting substrings"],
            ["7.9", "Changing character case"],
            ["7.10", "Counting letters, words and spaces"],
            ["7.11", "Palindromes and basic text validation"],
            ["7.12", "Common input-buffer problems"],
          ],
          project:
            "Text analyzer that counts words, characters, vowels, and spaces and checks whether a phrase is a palindrome.",
        },
        {
          id: "cp-m8-pointers",
          order: 8,
          phase: 3,
          week: "Week 8",
          title: "Module 8 · Pointers, References and Memory",
          summary:
            "How C++ accesses memory and why pointers matter. Taught slowly: addresses first, then pointers, references, arrays, the stack and heap, new and delete, and smart pointers.",
          atoms: 16,
          topics: [
            "Memory addresses and the & operator",
            "Pointers, dereferencing and nullptr",
            "Pointers versus references, and passing pointers",
            "Pointer arithmetic, arrays, the stack and the heap",
            "new and delete, leaks, dangling pointers and smart pointers",
          ],
          curriculum: [
            ["8.1", "Variables and memory addresses"],
            ["8.2", "The address-of operator &"],
            ["8.3", "Pointer declaration and initialization"],
            ["8.4", "Dereferencing with *"],
            ["8.5", "Null pointers and nullptr"],
            ["8.6", "Pointers versus references"],
            ["8.7", "Passing pointers to functions"],
            ["8.8", "Pointer arithmetic and its limits"],
            ["8.9", "The relationship between arrays and pointers"],
            ["8.10", "Stack and heap memory concepts"],
            ["8.11", "Dynamic allocation with new and delete"],
            ["8.12", "Dangling pointers, memory leaks and invalid access"],
            ["8.13", "Introduction to smart pointers"],
          ],
          project:
            "A program that swaps two values using references and then demonstrates how pointers access and modify values.",
        },
      ],
    },
    {
      month: 3,
      title: "Objects and the Standard Library",
      focus: "Intermediate",
      summary:
        "The rest of Phase 3 and most of Phase 4. Classes and encapsulation, inheritance and polymorphism, exceptions and files, and templates with the STL.",
      modules: [
        {
          id: "cp-m9-classes",
          order: 9,
          phase: 3,
          week: "Week 9",
          title: "Module 9 · Classes, Objects and Encapsulation",
          summary:
            "Object-oriented programming begins: classes and objects, members, access specifiers, encapsulation, constructors, this, static members and multi-file classes.",
          atoms: 13,
          topics: [
            "Why OOP; classes versus objects",
            "Members, objects and access specifiers",
            "Encapsulation, getters, setters and constructors",
            "this, static members and splitting a class across files",
          ],
          curriculum: [
            ["9.1", "Why procedural programs become difficult to manage"],
            ["9.2", "The difference between classes and objects"],
            ["9.3", "Defining a class"],
            ["9.4", "Data members and member functions"],
            ["9.5", "Creating objects"],
            ["9.6", "Access specifiers: public, private, protected"],
            ["9.7", "Encapsulation and data protection"],
            ["9.8", "Getters and setters"],
            ["9.9", "Constructors"],
            ["9.10", "Constructor overloading"],
            ["9.11", "The this pointer"],
            ["9.12", "Static members"],
            ["9.13", "Separating class declarations and definitions into files"],
          ],
          project:
            "Bank account simulator with account creation, deposits, withdrawals, and balance inquiries.",
        },
        {
          id: "cp-m10-inheritance",
          order: 10,
          phase: 3,
          week: "Week 10",
          title: "Module 10 · Inheritance, Polymorphism and OOP Design",
          summary:
            "How classes relate: derived classes and their constructors, overriding, virtual functions, abstract classes, virtual destructors, composition, UML and good design.",
          atoms: 14,
          topics: [
            "Inheritance and derived-class constructors",
            "Overriding, polymorphism and virtual functions",
            "Abstract classes, virtual destructors and composition",
            "Interfaces, UML class diagrams and good class design",
          ],
          curriculum: [
            ["10.1", "Revisiting encapsulation"],
            ["10.2", "Inheritance and derived classes"],
            ["10.3", "Base-class and derived-class constructors"],
            ["10.4", "Public, protected and private inheritance"],
            ["10.5", "Function overriding"],
            ["10.6", "Compile-time and runtime polymorphism"],
            ["10.7", "Virtual functions"],
            ["10.8", "Abstract classes and pure virtual functions"],
            ["10.9", "Virtual destructors"],
            ["10.10", "Composition versus inheritance"],
            ["10.11", "Introduction to interfaces through abstract classes"],
            ["10.12", "Basic UML class diagrams"],
            ["10.13", "Principles of good class design"],
          ],
          project:
            "School management model with a common Person base class and specialised Student and Teacher classes.",
          mastery:
            "Design classes, protect internal data, use inheritance appropriately, and explain when composition is a better choice.",
        },
        {
          id: "cp-m11-exceptions-files",
          order: 11,
          phase: 4,
          week: "Week 11",
          title: "Module 11 · Exception Handling and File Processing",
          summary:
            "Build programs that handle errors and keep their data: input validation, try, throw and catch, standard exceptions, file streams, appending, records and CSV.",
          atoms: 13,
          topics: [
            "Kinds of error, and validating input",
            "Exceptions: try, throw, catch and the standard classes",
            "File streams: reading, writing, appending and failures",
            "Records, persistence and CSV-style data",
          ],
          curriculum: [
            ["11.1", "Common categories of errors"],
            ["11.2", "Input validation"],
            ["11.3", "Introduction to exceptions"],
            ["11.4", "try, throw and catch"],
            ["11.5", "Standard exception classes"],
            ["11.6", "When to use exceptions versus ordinary conditions"],
            ["11.7", "File streams: ifstream, ofstream, fstream"],
            ["11.8", "Opening, reading and writing files"],
            ["11.9", "Appending to files"],
            ["11.10", "Checking file-open failures"],
            ["11.11", "Processing records line by line"],
            ["11.12", "Persisting application data"],
            ["11.13", "Basic CSV-style data processing"],
          ],
          project:
            "A student records manager that adds, searches, displays and saves student information to a file, so records remain available after the program closes.",
        },
        {
          id: "cp-m12-templates-stl",
          order: 12,
          phase: 4,
          week: "Week 12",
          title: "Module 12 · Templates and the Standard Template Library",
          summary:
            "Reuse code and the tools C++ already gives you: function and class templates, the STL containers, iterators, algorithms and lambdas, and choosing the right container.",
          atoms: 15,
          topics: [
            "Generic code: function and class templates",
            "The STL; vector, array, list and deque",
            "stack, queue, set, map and the unordered containers",
            "Iterators, range-based for and algorithms",
            "Lambdas, and choosing the right container",
          ],
          curriculum: [
            ["12.1", "Why reusable generic code matters"],
            ["12.2", "Function templates"],
            ["12.3", "Class templates"],
            ["12.4", "Introduction to the Standard Template Library (STL)"],
            ["12.5", "vector revisited"],
            ["12.6", "array, list and deque"],
            ["12.7", "stack and queue"],
            ["12.8", "set and map"],
            ["12.9", "unordered_set and unordered_map"],
            ["12.10", "Iterators"],
            ["12.11", "Range-based for loops"],
            ["12.12", "Algorithms such as sort, find, and count"],
            ["12.13", "Lambda expressions"],
            ["12.14", "Choosing the right container"],
          ],
          project:
            "Inventory management system using vectors, maps and STL algorithms to store products, update quantities, search records and calculate stock value.",
        },
      ],
    },
    {
      month: 4,
      title: "Professional Development",
      focus: "Advanced",
      summary:
        "The end of Phase 4 and all of Phase 5. Data structures and algorithms, modern C++ and resource management, debugging, testing and project structure, and the capstone.",
      modules: [
        {
          id: "cp-m13-dsa",
          order: 13,
          phase: 4,
          week: "Week 13",
          title: "Module 13 · Data Structures, Searching and Sorting",
          summary:
            "Organise data and judge an algorithm's cost: Big O, linear and binary search, three sorts, linked lists, stacks, queues, trees, graphs, recursion and hashing.",
          atoms: 13,
          topics: [
            "Data structures, Big O, linear and binary search",
            "Bubble, selection and insertion sort",
            "Linked lists, stacks, queues, trees and graphs",
            "Recursion, hashing and choosing a structure",
          ],
          curriculum: [
            ["13.1", "What is a data structure?"],
            ["13.2", "Time complexity and Big O notation"],
            ["13.3", "Linear search"],
            ["13.4", "Binary search and its requirements"],
            ["13.5", "Bubble, selection and insertion sort"],
            ["13.6", "Comparing sorting algorithms"],
            ["13.7", "Introduction to linked lists"],
            ["13.8", "Stacks and queues in practice"],
            ["13.9", "Introduction to trees and binary search trees"],
            ["13.10", "Introduction to graphs"],
            ["13.11", "Recursion and recursive problem-solving"],
            ["13.12", "Introduction to hash-based data structures"],
            ["13.13", "Choosing an appropriate data structure"],
          ],
          project: "A contact directory with fast searching, sorting, insertion and deletion.",
        },
        {
          id: "cp-m14-modern",
          order: 14,
          phase: 5,
          week: "Week 14",
          title: "Module 14 · Modern C++ and Resource Management",
          summary:
            "Safer, cleaner C++: auto, const correctness, lvalues and rvalues, move semantics, smart pointers and RAII, copy and move operations, optional, string_view and C++20.",
          atoms: 15,
          topics: [
            "Why modern C++; auto, range loops and const correctness",
            "Lvalues, rvalues, std::move, smart pointers and RAII",
            "Copy and move constructors and assignment",
            "optional, string_view and C++20 features",
          ],
          curriculum: [
            ["14.1", "Why modern C++ practices matter"],
            ["14.2", "Type inference with auto"],
            ["14.3", "Range-based loops"],
            ["14.4", "References and const correctness"],
            ["14.5", "Lvalues and rvalues: introductory concepts"],
            ["14.6", "Move semantics and std::move"],
            ["14.7", "Smart pointers: unique_ptr and shared_ptr"],
            ["14.8", "Resource Acquisition Is Initialization (RAII)"],
            ["14.9", "Copy constructors and assignment"],
            ["14.10", "Move constructors and move assignment"],
            ["14.11", "optional and safer return values"],
            ["14.12", "Introduction to string_view"],
            ["14.13", "Basic C++20 features: structured bindings and ranges"],
          ],
          project:
            "Refactor an earlier file-based application to use safer resource management, clearer interfaces and modern C++ conventions.",
        },
        {
          id: "cp-m15-debugging",
          order: 15,
          phase: 5,
          week: "Week 15",
          title: "Module 15 · Debugging, Testing and Software Design",
          summary:
            "Find errors systematically and produce reliable programs: diagnostics, the debugger, test design, assertions, headers, namespaces, CMake, Git, refactoring and secure coding.",
          atoms: 14,
          topics: [
            "Kinds of error, compiler diagnostics and the debugger",
            "Test cases, boundaries, assertions and unit tests",
            "Headers, guards, namespaces and CMake",
            "Git, readable code, refactoring and secure coding",
          ],
          curriculum: [
            ["15.1", "Syntax, runtime and logic errors"],
            ["15.2", "Reading compiler diagnostics"],
            ["15.3", "Debugging with breakpoints"],
            ["15.4", "Stepping through execution and inspecting variables"],
            ["15.5", "Designing test cases"],
            ["15.6", "Boundary cases and invalid inputs"],
            ["15.7", "Assertions and basic unit testing"],
            ["15.8", "Organizing header and source files"],
            ["15.9", "Header guards and #pragma once"],
            ["15.10", "Namespaces and the std namespace"],
            ["15.11", "Introduction to CMake and build configuration"],
            ["15.12", "Git basics and version control"],
            ["15.13", "Code readability, naming and refactoring"],
            ["15.14", "Introduction to secure coding practices"],
          ],
          project:
            "Practical assessment: given a faulty program, reproduce the problem, identify the cause, correct it, and demonstrate that the fix works.",
        },
        {
          id: "cp-m16-capstone",
          order: 16,
          phase: 5,
          week: "Week 16",
          type: "capstone",
          title: "Module 16 · Capstone Project and Final Assessment",
          summary:
            "Combine the whole course into one application you plan, build, test, document and present, then prepare for the final certification exam.",
          atoms: 10,
          topics: [
            "Choosing a project and writing its requirements",
            "Designing classes, files and data",
            "Building in small tested steps",
            "Documentation and presentation",
            "Preparing for the final assessment",
          ],
          curriculum: [
            ["16.1", "Choosing a capstone project and writing its requirements"],
            ["16.2", "Designing the classes, files and data"],
            ["16.3", "Building incrementally, testing each step"],
            ["16.4", "Documentation and presenting your project"],
            ["16.5", "Preparing for the final assessment"],
          ],
          project:
            "One of: a banking management system (recommended), a student records management system, an inventory and sales system, or a tic-tac-toe or quiz game, planned, built, tested, documented and presented.",
        },
      ],
    },
  ],

  capstone: {
    title: "A Complete C++ Application, Planned to Presented",
    summary:
      "Choose one project. Whichever you pick, it must combine several parts of the course rather than reproduce a tutorial, keep its data between runs, survive bad input, and be explained by you to a reviewer.",
    projects: [
      {
        id: "A",
        title: "Banking Management System",
        recommended: true,
        summary:
          "Account creation, deposits, withdrawals, balance inquiries, transaction history, input validation and file-based storage.",
        skills: ["classes", "functions", "files", "exceptions", "vectors", "testing"],
      },
      {
        id: "B",
        title: "Student Records Management System",
        summary:
          "Create, update, search, rank and delete student records, calculate grades, and save records between sessions.",
        skills: ["structures or classes", "STL", "sorting", "searching", "file handling"],
      },
      {
        id: "C",
        title: "Inventory and Sales System",
        summary:
          "Manage products, update stock, record sales, calculate revenue, and produce basic inventory reports.",
        skills: ["maps", "vectors", "classes", "calculations", "persistence", "error handling"],
      },
      {
        id: "D",
        title: "Tic-Tac-Toe or Quiz Game",
        summary:
          "A playable game with game logic, input validation, scoring, replay and saved high scores.",
        skills: ["arrays", "functions", "conditions", "loops", "strings", "file handling"],
      },
    ],
    deliverables: [
      "A written plan: requirements, a class diagram and the file layout, before the first line of code",
      "A working program that combines classes, the STL, files and exceptions",
      "Input validation and graceful handling of every expected failure",
      "Test cases, including boundary and invalid inputs, that pass",
      "A Git repository with a meaningful history, built with CMake",
      "A README a stranger can follow, and a short presentation explaining one design decision and one bug you fixed",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "C++ Programming",
    covers: "Foundations • Functions, arrays & strings • Memory & OOP • STL & algorithms • Modern C++ & testing",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson, including every practice",
      "Pass every lesson check at 70% or above",
      "Complete the module mini-projects",
      "Complete and present the capstone project",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Phase 1 mastery checkpoint",
      format:
        "A program that accepts several scores, calculates their average, assigns a grade, and repeats for multiple students.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Phase 2 and memory",
      format:
        "Student performance analyser and text analyser, then swapping and modifying values through references and pointers.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Phase 3 mastery checkpoint",
      format:
        "Design classes, protect internal data, use inheritance appropriately, and explain when composition is a better choice.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format:
        "The capstone application, presented with its tests and documentation, and the final certification exam.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const CPP_MODULE_IDS = CPP_COURSE.months.flatMap((m) => m.modules.map((mod) => mod.id));

export default CPP_COURSE;
