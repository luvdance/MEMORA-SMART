/**
 * PYTHON PROGRAMMING
 *
 * Authored from the Memora Smart Technologies Python curriculum: four phases,
 * twenty modules and three phase assessments over sixteen weeks, from "what
 * is a program?" to a documented, tested, deployed Python application.
 *
 * Course content is DATA, never markup. The shape is the same as
 * javascriptCourse.js, so the catalog, curriculum tree, lesson player,
 * progress engine and stats band render it without changes.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          one curriculum module (or assessment)
 *           └── lessons/{lessonId}    two to four curriculum topics
 *                 └── atoms/{atomId}  one idea each
 *
 * ── PROGRAMMING IS LEARNED BY WRITING IT ─────────────────────────────────
 * The rule this course is built on: every time a lesson shows an idea
 * working, the learner then WRITES code that uses it on something of their
 * own. The lesson prints "Hello, World!"; the learner prints their name. The
 * lesson converts naira to dollars; the learner converts their own fee. That
 * practice is a `codeChallenge`: real Python, run in the page, checked by
 * tests, and it gates the atom.
 *
 * ── EVERY ATOM IS A-T-O-M ────────────────────────────────────────────────
 *   Anchor    the idea stated plainly (`explain`, a `table` for rules)
 *   Trace     a worked example: real code and the output it really prints
 *             (`code`), or the line-by-line state of a loop (`trace`)
 *   Operate   graded practice that must be passed before moving on:
 *             `codeChallenge` (write the code), `codeExercise` (predict the
 *             output) or `decision` (make the call)
 *   Master    the lesson check, graded on the server
 *
 * Every `code` and `codeExercise` is RUN by `npm run validate:content` in
 * CPython and its real output compared with the lesson. Every challenge's
 * model solution must pass its tests there, and its starter must fail them.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the topic list from the source document,
 * numbered module.topic. Every lesson declares which numbers it `covers`, and
 * `npm run test:academy` fails if any topic is not taught.
 */

export const PYTHON_COURSE = {
  id: "python",
  slug: "python",
  title: "Python Programming",
  subtitle: "Learn to program by writing Python, from zero to professional",
  tagline:
    "Understand what a program is, then learn Python the only way that works: by writing it, every lesson, until you can build and ship real applications.",
  description:
    "A sixteen-week programme in four phases. You begin with programming itself (algorithms, pseudocode and flowcharts) and run your first Python program in Week 1. Then the core of the language: variables, operators, decisions, loops, functions, strings and collections. Then real software: files, exceptions, object-oriented programming, modules and professional practice with Git. Finally the engineering foundations: algorithms and complexity, testing and type hints, databases and SQL, APIs and web backends, automation and deployment. Practice is the method, not an extra: whenever a lesson shows you something, you immediately write code that uses it, and that code is run and checked before you move on. Three phase projects and a final portfolio application prove what you can do. No prior programming experience required.",

  status: "live",
  level: "Absolute beginner → Job-ready",
  durationMonths: 4,
  hoursPerWeek: "8–12",
  language: "English",
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
      name: "Algorithms, pseudocode & flowcharts",
      short: "Logic",
      blurb: "Plan a program before you type it, and trace it before you trust it.",
      icon: "fas fa-diagram-project",
      accent: "#7c3aed",
    },
    {
      id: "python",
      name: "Python 3 & VS Code",
      short: "Python",
      blurb: "The language, written every lesson, run and checked in the page.",
      icon: "fab fa-python",
      accent: "#2563eb",
    },
    {
      id: "engineering",
      name: "Git, pytest & SQLite",
      short: "Engineering",
      blurb: "Version control, automated tests, type hints and real databases.",
      icon: "fas fa-code-branch",
      accent: "#0e7490",
    },
    {
      id: "backend",
      name: "APIs, Flask & automation",
      short: "Backend",
      blurb: "HTTP, JSON and REST, a small API of your own, and scripts that do real work.",
      icon: "fas fa-server",
      accent: "#b45309",
    },
  ],

  outcomes: [
    "Break a problem into steps, express it as pseudocode and a flowchart, and turn it into Python",
    "Write correct Python with variables, types, operators, conditions, loops and functions",
    "Process text and data with strings, lists, tuples, sets, dictionaries and comprehensions",
    "Build programs that save their data in text, CSV and JSON files, and fail gracefully on bad input",
    "Design small applications with classes, inheritance, composition and dataclasses",
    "Structure projects with modules, packages, virtual environments, Git and clear documentation",
    "Choose efficient algorithms, explain Big-O, and prove behaviour with automated tests",
    "Store data safely in SQLite, consume and build APIs, and automate real tasks with command-line tools",
  ],

  audience: [
    "Complete beginners who have never written a line of code",
    "Learners who watched tutorials but cannot yet write a program on their own",
    "Students heading into computer science, data or engineering",
    "Career switchers aiming for a first developer, automation or data role",
  ],

  requirements: [
    "A laptop or desktop computer (Windows, macOS or Linux). The in-lesson editor also works on a phone",
    "A stable internet connection",
    "Permission to install free software: Python 3 and VS Code (Git later)",
    "No prior programming experience",
  ],

  phases: [
    { phase: 1, title: "Programming foundations", weeks: [1, 2] },
    { phase: 2, title: "Core Python programming", weeks: [3, 4, 5, 6] },
    { phase: 3, title: "Intermediate Python and software development", weeks: [7, 8, 9, 10] },
    { phase: 4, title: "Advanced programming and professional application", weeks: [11, 12, 13, 14, 15, 16] },
  ],

  months: [
    {
      month: 1,
      title: "Foundations and Control",
      focus: "Beginner",
      summary:
        "Phase 1 and the start of Phase 2. What programming is, your first Python, input and output, variables, types and operators, the Phase 1 project, then decisions, loops and functions.",
      modules: [
        {
          id: "pp-m1-foundations",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 1 · Introduction to Programming and Computational Thinking",
          summary:
            "What a program is, how a computer and Python run one, how to plan with pseudocode and flowcharts, and your first Python program.",
          atoms: 17,
          topics: [
            "Programs, instructions and algorithms",
            "Hardware, software, operating systems and languages",
            "Source code, interpreters, compilers and how Python runs",
            "Decomposition, pseudocode and flowcharts",
            "Python, its uses and careers",
            "Installing Python and VS Code, and the first program",
          ],
          curriculum: [
            ["1.1", "What programming is and why it exists"],
            ["1.2", "Programs, instructions, algorithms and problem-solving"],
            ["1.3", "Hardware, software, operating systems and programming languages"],
            ["1.4", "Source code, interpreters and compilers"],
            ["1.5", "How Python executes a program"],
            ["1.6", "Breaking complex problems into smaller steps"],
            ["1.7", "Pseudocode and flowcharts"],
            ["1.8", "Introduction to Python, its uses and career paths"],
            ["1.9", "Installing Python and setting up VS Code"],
            ["1.10", "Running the first Python program"],
          ],
          project:
            "Write algorithms for making tea, calculating two numbers and deciding whether a student passed, then write a simple Python program on your own.",
        },
        {
          id: "pp-m2-syntax-io",
          order: 2,
          phase: 1,
          week: "Week 1",
          title: "Module 2 · Python Syntax and Basic Input/Output",
          summary:
            "The grammar of Python, print() in depth, escape characters, input(), and reading the error messages beginners meet first.",
          atoms: 14,
          topics: [
            "Syntax, indentation, statements, expressions and comments",
            "print(), escape characters and formatted output",
            "input() and collecting information from users",
            "Displaying versus collecting data",
            "Syntax errors and debugging",
          ],
          curriculum: [
            ["2.1", "Python syntax and indentation"],
            ["2.2", "Statements, expressions and comments"],
            ["2.3", "The print() function"],
            ["2.4", "Escape characters and formatted output"],
            ["2.5", "The input() function"],
            ["2.6", "Receiving information from users"],
            ["2.7", "The difference between displaying and collecting data"],
            ["2.8", "Basic syntax errors and debugging"],
          ],
          project:
            "Personal introduction program, simple receipt, student information form and a basic calculator.",
        },
        {
          id: "pp-m3-variables",
          order: 3,
          phase: 1,
          week: "Week 2",
          title: "Module 3 · Variables, Data Types and Memory Concepts",
          summary:
            "Names and values, the four basic types, converting between them, dynamic typing, None, constants and the type errors they cause.",
          atoms: 12,
          topics: [
            "What variables represent, naming and keywords",
            "Assignment and reassignment",
            "int, float, str and bool, and type()",
            "Type conversion and dynamic typing",
            "None, constants and common type errors",
          ],
          curriculum: [
            ["3.1", "What variables represent"],
            ["3.2", "Variable naming conventions and reserved keywords"],
            ["3.3", "Assignment and reassignment"],
            ["3.4", "Integers, floating-point numbers, strings and Booleans"],
            ["3.5", "The type() function"],
            ["3.6", "Type conversion using int(), float() and str()"],
            ["3.7", "Dynamic typing"],
            ["3.8", "None and the concept of missing values"],
            ["3.9", "Constants by naming convention"],
            ["3.10", "Common type errors"],
          ],
          project:
            "Age calculator, school fee calculator, student profile and currency conversion using supplied exchange rates.",
        },
        {
          id: "pp-m4-operators",
          order: 4,
          phase: 1,
          week: "Week 2",
          title: "Module 4 · Operators and Expressions",
          summary:
            "Every operator a beginner needs, precedence, string operators, truthiness, and the two numeric traps: division by zero and floating-point precision.",
          atoms: 13,
          topics: [
            "Arithmetic operators, including //, % and **",
            "Assignment, comparison and logical operators",
            "Precedence and parentheses",
            "String concatenation and repetition",
            "Membership, identity, truthy and falsy",
            "Division by zero and numerical precision",
          ],
          curriculum: [
            ["4.1", "Arithmetic operators: +, -, *, /, //, %, **"],
            ["4.2", "Assignment operators"],
            ["4.3", "Comparison operators"],
            ["4.4", "Logical operators: and, or, not"],
            ["4.5", "Operator precedence and parentheses"],
            ["4.6", "String concatenation and repetition"],
            ["4.7", "Membership and identity operators"],
            ["4.8", "Truthy and falsy values"],
            ["4.9", "Division by zero and numerical precision"],
          ],
          project:
            "Profit and loss, averages, discounts, simple interest, even/odd detection and time conversion.",
        },
        {
          id: "pp-a1-score-calculator",
          order: 5,
          phase: 1,
          week: "Week 2",
          type: "project",
          title: "Phase 1 Assessment · Student Score Calculator",
          summary:
            "Your first complete program, planned and built without copying a solution: a name and scores in, a total, an average and a formatted result out.",
          atoms: 6,
          topics: [
            "Planning: algorithm, pseudocode and flowchart",
            "Building the program one tested step at a time",
            "Formatting the result and checking it by hand",
          ],
          curriculum: [
            ["P1.1", "Plan the Student Score Calculator as an algorithm and a flowchart"],
            ["P1.2", "Accept a student's name and scores"],
            ["P1.3", "Calculate the total and average and print a formatted result"],
          ],
          project:
            "Student Score Calculator: accept a student's name and scores, calculate the total and average, and print a formatted result.",
        },
        {
          id: "pp-m5-conditions",
          order: 6,
          phase: 2,
          week: "Week 3",
          title: "Module 5 · Conditional Statements and Decision-Making",
          summary:
            "if, elif and else; nested and combined conditions; validating input; boundaries; match-case; and turning a flowchart into code.",
          atoms: 11,
          topics: [
            "Boolean conditions and if / elif / else",
            "Nested and combined conditions",
            "Conditions on numbers and strings",
            "Input validation and boundary conditions",
            "match-case, and flowcharts into code",
          ],
          curriculum: [
            ["5.1", "Boolean conditions"],
            ["5.2", "if, elif and else"],
            ["5.3", "Nested conditions"],
            ["5.4", "Multiple conditions using logical operators"],
            ["5.5", "Conditions involving numbers and strings"],
            ["5.6", "Validation of user input"],
            ["5.7", "Boundary conditions and off-by-one mistakes"],
            ["5.8", "Introduction to match-case statements"],
            ["5.9", "Converting flowcharts into conditional code"],
          ],
          project:
            "Examination grading, age eligibility, leap-year checker, login validation, electricity billing and discount calculation.",
        },
        {
          id: "pp-m6-loops",
          order: 7,
          phase: 2,
          week: "Week 3",
          title: "Module 6 · Loops and Repetition",
          summary:
            "while and for, range(), counters and accumulators, break, continue and pass, nested loops, and dry-running a loop by hand.",
          atoms: 12,
          topics: [
            "Why loops exist, and while",
            "for and range()",
            "Counters and accumulators",
            "break, continue and pass",
            "Nested loops, infinite loops and tracing",
          ],
          curriculum: [
            ["6.1", "Why loops exist"],
            ["6.2", "while loops"],
            ["6.3", "for loops"],
            ["6.4", "The range() function"],
            ["6.5", "Loop counters and accumulators"],
            ["6.6", "break, continue and pass"],
            ["6.7", "Nested loops"],
            ["6.8", "Infinite loops and termination conditions"],
            ["6.9", "Loop tracing and dry-running code"],
          ],
          project:
            "Multiplication tables, factorials, number guessing, sum of numbers, prime checking and simple text patterns.",
        },
        {
          id: "pp-m7-functions",
          order: 8,
          phase: 2,
          week: "Week 4",
          title: "Module 7 · Functions and Modular Programming",
          summary:
            "Defining and calling functions, parameters and return values, keyword and default arguments, scope, docstrings, decomposition and recursion.",
          atoms: 11,
          topics: [
            "Why functions are needed; def and calling",
            "Parameters, arguments and return versus print",
            "Positional, keyword and default arguments",
            "Scope, multiple return values and docstrings",
            "Decomposition and basic recursion",
          ],
          curriculum: [
            ["7.1", "Why functions are needed"],
            ["7.2", "Defining and calling functions"],
            ["7.3", "Parameters and arguments"],
            ["7.4", "Return values versus printing"],
            ["7.5", "Positional and keyword arguments"],
            ["7.6", "Default parameters"],
            ["7.7", "Scope: local and global variables"],
            ["7.8", "Multiple return values"],
            ["7.9", "Docstrings and function naming"],
            ["7.10", "Decomposing a large problem into small functions"],
            ["7.11", "Basic recursion"],
          ],
          project:
            "Calculator functions, a reusable grading system, a tax calculator and functions for geometric areas.",
        },
      ],
    },
    {
      month: 2,
      title: "Data and Real Programs",
      focus: "Beginner → Intermediate",
      summary:
        "The rest of Phase 2 and the start of Phase 3. Text processing, collections and iteration, the Student Management System, then files, exceptions and object-oriented programming.",
      modules: [
        {
          id: "pp-m8-strings",
          order: 9,
          phase: 2,
          week: "Week 5",
          title: "Module 8 · Strings and Text Processing",
          summary:
            "Indexing and slicing, the string methods you will use daily, f-strings, counting characters, normalising text and a first regular expression.",
          atoms: 11,
          topics: [
            "Immutability, indexing and slicing",
            "strip, split, join, replace and find",
            "Case, whitespace and f-strings",
            "Prefixes, suffixes and character frequency",
            "Text normalisation and regular expressions",
          ],
          curriculum: [
            ["8.1", "String creation and immutability"],
            ["8.2", "Indexing and negative indexing"],
            ["8.3", "Slicing and step values"],
            ["8.4", "String methods: strip(), split(), join(), replace(), find()"],
            ["8.5", "Case conversion and whitespace handling"],
            ["8.6", "String formatting with f-strings"],
            ["8.7", "Checking prefixes and suffixes"],
            ["8.8", "Character counting and frequency"],
            ["8.9", "Basic text normalization"],
            ["8.10", "Introduction to regular expressions"],
          ],
          project:
            "Palindrome checker, word counter, password validator, username formatter and a simple text analyser.",
        },
        {
          id: "pp-m9-collections",
          order: 10,
          phase: 2,
          week: "Weeks 5–6",
          title: "Module 9 · Lists, Tuples, Sets and Dictionaries",
          summary:
            "Python's four core collections: how to build, change, search and loop over each, and how to choose between them.",
          atoms: 11,
          topics: [
            "Lists: indexing, slicing, nesting, adding and removing",
            "List methods and sorting; iterating",
            "Tuples and immutable sequences",
            "Sets and set operations",
            "Dictionaries and nested dictionaries",
            "Mutability, aliasing, copying and comprehensions",
          ],
          curriculum: [
            ["9.1", "Lists, indexing, slicing and nested lists"],
            ["9.2", "Adding, updating and removing elements"],
            ["9.3", "List methods and sorting"],
            ["9.4", "Iterating over collections"],
            ["9.5", "Tuples and immutable sequences"],
            ["9.6", "Sets, uniqueness and set operations"],
            ["9.7", "Dictionaries and key-value relationships"],
            ["9.8", "Dictionary methods and nested dictionaries"],
            ["9.9", "Membership testing"],
            ["9.10", "Mutable versus immutable objects"],
            ["9.11", "Aliasing, copying and basic list comprehensions"],
          ],
          project:
            "Shopping cart, student records, inventory tracker, contact book and a duplicate-value remover.",
        },
        {
          id: "pp-m10-iteration",
          order: 11,
          phase: 2,
          week: "Week 6",
          title: "Module 10 · Working with Collections and Iteration",
          summary:
            "Iterables and iterators, enumerate and zip, sorting with keys, any and all, comprehensions, searching and filtering, and generator expressions.",
          atoms: 9,
          topics: [
            "Iterables, iterators, enumerate() and zip()",
            "Sorting with key functions; any() and all()",
            "List, dictionary and set comprehensions",
            "Nested collections, searching and filtering",
            "Generator expressions and readable code",
          ],
          curriculum: [
            ["10.1", "Iterables and iterators"],
            ["10.2", "enumerate() and zip()"],
            ["10.3", "Sorting with key functions"],
            ["10.4", "any() and all()"],
            ["10.5", "List, dictionary and set comprehensions"],
            ["10.6", "Nested collection processing"],
            ["10.7", "Searching and filtering data"],
            ["10.8", "Basic generator expressions"],
            ["10.9", "Choosing readable code over unnecessary shortcuts"],
          ],
          project:
            "Rank examination scores, summarise sales records, find the most frequent word and filter a dataset.",
        },
        {
          id: "pp-a2-student-system",
          order: 12,
          phase: 2,
          week: "Week 6",
          type: "project",
          title: "Phase 2 Assessment · Student Management System",
          summary:
            "A menu-driven console application built from functions, conditions, loops and the right data structures.",
          atoms: 7,
          topics: [
            "Designing the data and the menu loop",
            "Adding, displaying and searching records",
            "Updating, deleting and finding the top student",
          ],
          curriculum: [
            ["P2.1", "Design the data structure and the menu loop"],
            ["P2.2", "Add students and their scores; calculate averages and grades"],
            ["P2.3", "Display all records and search for a student"],
            ["P2.4", "Update or delete a record"],
            ["P2.5", "Display the highest-scoring student"],
          ],
          project:
            "Student Management System (console): add, grade, display, search, update, delete and rank students, using functions, conditions, loops and suitable data structures.",
        },
        {
          id: "pp-m11-files",
          order: 13,
          phase: 3,
          week: "Week 7",
          title: "Module 11 · File Handling and Data Persistence",
          summary:
            "Paths, opening and closing, with, reading, writing and appending, encodings, CSV, JSON and pathlib: data that survives the program closing.",
          atoms: 10,
          topics: [
            "Files, paths, open, close and with",
            "Reading, writing and appending; encodings",
            "CSV with the csv module",
            "JSON with the json module",
            "pathlib and saving data between sessions",
          ],
          curriculum: [
            ["11.1", "Files, paths and file extensions"],
            ["11.2", "Opening and closing files"],
            ["11.3", "Context managers and the with statement"],
            ["11.4", "Reading and writing text files"],
            ["11.5", "Append mode versus write mode"],
            ["11.6", "File encoding and Unicode"],
            ["11.7", "Working with CSV files using csv"],
            ["11.8", "Working with JSON using json"],
            ["11.9", "File and directory operations with pathlib"],
            ["11.10", "Preserving data between program sessions"],
          ],
          project:
            "Save and load student records, an expense tracker, a CSV grade report and JSON-based settings.",
        },
        {
          id: "pp-m12-exceptions",
          order: 14,
          phase: 3,
          week: "Week 7",
          title: "Module 12 · Exceptions, Debugging and Input Validation",
          summary:
            "Reading tracebacks, try/except/else/finally, raising and defining exceptions, defensive programming, the VS Code debugger and assertions.",
          atoms: 10,
          topics: [
            "Syntax, runtime and logical errors; tracebacks",
            "try, except, else and finally",
            "Raising and defining exceptions",
            "Defensive programming and assertions",
            "Debugging in VS Code and handling bad input",
          ],
          curriculum: [
            ["12.1", "Syntax, runtime and logical errors"],
            ["12.2", "Reading Python tracebacks"],
            ["12.3", "try, except, else and finally"],
            ["12.4", "Common exceptions: ValueError, TypeError, KeyError and FileNotFoundError"],
            ["12.5", "Raising exceptions with raise"],
            ["12.6", "Creating custom exception classes"],
            ["12.7", "Defensive programming"],
            ["12.8", "Debugging with breakpoints and variable inspection in VS Code"],
            ["12.9", "Assertions and validation rules"],
            ["12.10", "Handling unexpected user input"],
          ],
          project:
            "Harden the Student Management System against invalid input, missing files and incorrect data.",
        },
        {
          id: "pp-m13-oop",
          order: 15,
          phase: 3,
          week: "Weeks 8–9",
          title: "Module 13 · Object-Oriented Programming",
          summary:
            "Classes and objects, __init__ and self, encapsulation and properties, inheritance and polymorphism, composition, special methods and dataclasses.",
          atoms: 11,
          topics: [
            "Classes, objects, attributes and methods",
            "__init__, self, instance and class attributes",
            "Encapsulation, properties, inheritance and polymorphism",
            "Composition, __str__ and dataclasses",
            "When OOP helps, and when functions are better",
          ],
          curriculum: [
            ["13.1", "Classes and objects"],
            ["13.2", "Attributes and methods"],
            ["13.3", "Constructors and __init__()"],
            ["13.4", "The meaning of self"],
            ["13.5", "Instance attributes versus class attributes"],
            ["13.6", "Encapsulation and properties"],
            ["13.7", "Inheritance and method overriding"],
            ["13.8", "Polymorphism"],
            ["13.9", "Composition versus inheritance"],
            ["13.10", "Special methods such as __str__()"],
            ["13.11", "Dataclasses"],
            ["13.12", "When to use OOP and when simpler functions are better"],
          ],
          project:
            "Bank account, employee payroll, library management and school administration models.",
        },
      ],
    },
    {
      month: 3,
      title: "Software Development and Engineering",
      focus: "Intermediate",
      summary:
        "The end of Phase 3 and the start of Phase 4. Modules and the ecosystem, professional practice with Git, the Personal Finance Tracker, then algorithms, complexity and testing.",
      modules: [
        {
          id: "pp-m14-modules",
          order: 16,
          phase: 3,
          week: "Week 9",
          title: "Module 14 · Modules, Packages and the Python Ecosystem",
          summary:
            "Importing, the standard library, your own modules and packages, __main__, pip, virtual environments and requirements.txt.",
          atoms: 10,
          topics: [
            "Importing and the standard library",
            "Your own modules and packages",
            "Import paths, naming conflicts and __main__",
            "pip, venv and requirements.txt",
          ],
          curriculum: [
            ["14.1", "Importing modules"],
            ["14.2", "Standard library overview: math, random, datetime, statistics, collections and itertools"],
            ["14.3", "Creating your own modules"],
            ["14.4", "Packages and __init__.py"],
            ["14.5", "Import paths and naming conflicts"],
            ["14.6", "The if __name__ == \"__main__\": pattern"],
            ["14.7", "Installing packages using pip"],
            ["14.8", "Virtual environments with venv"],
            ["14.9", "Dependency management and requirements.txt"],
            ["14.10", "Introduction to documentation and package selection"],
          ],
          project:
            "Split a calculator into modules, create a reusable utility package and set up a clean project environment.",
        },
        {
          id: "pp-m15-practices",
          order: 17,
          phase: 3,
          week: "Week 10",
          title: "Module 15 · Software Development Practices",
          summary:
            "PEP 8, naming and docstrings, refactoring and separation of concerns, Git, secrets and configuration, READMEs, reviews and linters.",
          atoms: 10,
          topics: [
            "PEP 8, naming, comments and docstrings",
            "Refactoring and separation of concerns",
            "Git: repositories, commits, branches and merges",
            ".gitignore, secrets and configuration",
            "READMEs, code reviews and static analysis",
          ],
          curriculum: [
            ["15.1", "Readable code and PEP 8 conventions"],
            ["15.2", "Naming, comments and docstrings"],
            ["15.3", "Refactoring and avoiding unnecessary repetition"],
            ["15.4", "Separation of concerns"],
            ["15.5", "Git fundamentals: repository, commit, branch and merge"],
            ["15.6", ".gitignore and environment files"],
            ["15.7", "Managing secrets and configuration"],
            ["15.8", "Writing useful README documentation"],
            ["15.9", "Basic code reviews and project organization"],
            ["15.10", "Introduction to static analysis and formatting tools"],
          ],
          project: "Refactor and publish a Python project to GitHub with clear instructions.",
        },
        {
          id: "pp-a3-finance-tracker",
          order: 18,
          phase: 3,
          week: "Week 10",
          type: "project",
          title: "Phase 3 Assessment · Personal Finance and Expense Tracker",
          summary:
            "Record, categorise, save, reload, search, validate and summarise transactions, using everything from Phase 3.",
          atoms: 6,
          topics: [
            "Modelling transactions",
            "Saving, reloading and validating",
            "Searching and the summary report",
          ],
          curriculum: [
            ["P3.1", "Model income and expense transactions with categories"],
            ["P3.2", "Save and reload records, and validate every input"],
            ["P3.3", "Calculate totals, search transactions and generate a summary report"],
          ],
          project:
            "Personal Finance and Expense Tracker using functions, collections, file handling, exception handling, modules and OOP where useful.",
        },
        {
          id: "pp-m16-dsa",
          order: 19,
          phase: 4,
          week: "Week 11",
          title: "Module 16 · Data Structures, Algorithms and Complexity",
          summary:
            "Searching and sorting, stacks, queues and linked lists, recursion versus iteration, hashing, trees and graphs, and Big-O.",
          atoms: 13,
          topics: [
            "Algorithm design, linear and binary search",
            "Bubble, selection, insertion and merge sort",
            "Stacks, queues, linked lists and hashing",
            "Recursion and iteration",
            "Trees, graphs and Big-O",
          ],
          curriculum: [
            ["16.1", "Problem decomposition and algorithm design"],
            ["16.2", "Linear search and binary search"],
            ["16.3", "Bubble, selection, insertion and merge sort"],
            ["16.4", "Stacks and queues"],
            ["16.5", "Linked-list concepts"],
            ["16.6", "Recursion and iterative solutions"],
            ["16.7", "Hash-based lookups"],
            ["16.8", "Trees and graph fundamentals"],
            ["16.9", "Big-O notation and time/space complexity"],
            ["16.10", "Choosing efficient solutions without premature optimization"],
          ],
          project:
            "Implement searching and sorting algorithms, a balanced task queue and a simple graph traversal.",
        },
        {
          id: "pp-m17-testing",
          order: 20,
          phase: 4,
          week: "Week 12",
          title: "Module 17 · Testing, Quality Assurance and Type Hints",
          summary:
            "Unit tests with unittest and pytest, choosing test cases, fixtures, mocking, integration tests, type hints and logging.",
          atoms: 10,
          topics: [
            "Why testing matters; unittest and pytest",
            "Positive, negative, boundary and edge cases",
            "Fixtures, mocking and integration tests",
            "Type hints and static checking",
            "Logging",
          ],
          curriculum: [
            ["17.1", "Why testing matters"],
            ["17.2", "Unit testing with unittest or pytest"],
            ["17.3", "Assertions and expected outcomes"],
            ["17.4", "Positive, negative, boundary and edge-case tests"],
            ["17.5", "Test fixtures and test organization"],
            ["17.6", "Mocking external dependencies"],
            ["17.7", "Integration testing basics"],
            ["17.8", "Type hints and annotations"],
            ["17.9", "Static type checking concepts"],
            ["17.10", "Logging with the logging module"],
          ],
          project: "Write tests for a calculator, a student grading engine and the expense tracker.",
        },
      ],
    },
    {
      month: 4,
      title: "Databases, APIs and Shipping",
      focus: "Professional",
      summary:
        "The rest of Phase 4. Databases and SQL, HTTP and APIs, automation and deployment, and a finished portfolio application.",
      modules: [
        {
          id: "pp-m18-databases",
          order: 21,
          phase: 4,
          week: "Week 13",
          title: "Module 18 · Databases and SQL with Python",
          summary:
            "Tables and keys, SELECT, INSERT, UPDATE and DELETE, joins and grouping, sqlite3, parameterised queries and transactions.",
          atoms: 10,
          topics: [
            "Why databases; tables, records and keys",
            "SQL basics, filtering, sorting, grouping and joins",
            "Relationships and normalisation",
            "sqlite3, parameterised queries and injection",
            "Transactions and error handling",
          ],
          curriculum: [
            ["18.1", "Why databases are needed"],
            ["18.2", "Tables, records, fields and data types"],
            ["18.3", "Primary keys and foreign keys"],
            ["18.4", "SQL basics: SELECT, INSERT, UPDATE and DELETE"],
            ["18.5", "Filtering, sorting, grouping and joins"],
            ["18.6", "Database relationships and normalization fundamentals"],
            ["18.7", "SQLite using Python's sqlite3"],
            ["18.8", "Parameterized queries and SQL injection prevention"],
            ["18.9", "Transactions and commit/rollback"],
            ["18.10", "Database connections and error handling"],
          ],
          project: "A persistent student registration system or inventory database.",
        },
        {
          id: "pp-m19-apis",
          order: 22,
          phase: 4,
          week: "Week 14",
          title: "Module 19 · APIs, HTTP and Web Development Foundations",
          summary:
            "Client and server, requests and responses, REST, consuming APIs safely, building a small Flask API, validation, authentication and async/await.",
          atoms: 12,
          topics: [
            "Client-server, HTTP, status codes, headers and JSON",
            "REST and consuming APIs with requests",
            "Timeouts, network errors and API keys",
            "Building an API with Flask; validation and auth",
            "async and await",
          ],
          curriculum: [
            ["19.1", "Client-server architecture"],
            ["19.2", "HTTP requests and responses"],
            ["19.3", "Methods, status codes, headers and JSON"],
            ["19.4", "REST API concepts"],
            ["19.5", "Consuming APIs using requests or an equivalent HTTP client"],
            ["19.6", "Timeouts and network errors"],
            ["19.7", "API keys and environment variables"],
            ["19.8", "Building a basic API using Flask or FastAPI"],
            ["19.9", "Request validation and response formatting"],
            ["19.10", "Basic authentication and secure configuration"],
            ["19.11", "Introduction to asynchronous programming and async/await"],
          ],
          project:
            "Consume a public API and build a simple service that exposes student or inventory records.",
        },
        {
          id: "pp-m20-automation",
          order: 23,
          phase: 4,
          week: "Weeks 15–16",
          type: "capstone",
          title: "Module 20 · Automation, Deployment and Portfolio Development",
          summary:
            "Automating real tasks, files and spreadsheets, reports and notifications, argparse and configuration, packaging, deployment, security and your portfolio.",
          atoms: 11,
          topics: [
            "Automating repetitive tasks and batch file operations",
            "Spreadsheets, reports, notifications and scheduling",
            "argparse, configuration and command-line tools",
            "Deployment and application security",
            "Documentation, demonstration and portfolio",
          ],
          curriculum: [
            ["20.1", "Automating repetitive tasks"],
            ["20.2", "Batch file operations and directory management"],
            ["20.3", "Processing spreadsheets with openpyxl or pandas"],
            ["20.4", "Generating reports and sending automated notifications"],
            ["20.5", "Date-based scheduling concepts"],
            ["20.6", "Command-line arguments using argparse"],
            ["20.7", "Configuration management and environment variables"],
            ["20.8", "Building a distributable command-line tool"],
            ["20.9", "Deployment fundamentals and dependency installation"],
            ["20.10", "Application security basics"],
            ["20.11", "Project documentation, demonstrations and portfolio presentation"],
          ],
          project:
            "A report generator, spreadsheet cleaner, file organiser or automated invoice generator, delivered with documentation, tests and a demonstration.",
        },
      ],
    },
  ],

  capstone: {
    title: "A Complete, Documented Python Application",
    summary:
      "Choose one: a report generator, a spreadsheet cleaner, a file organiser or an automated invoice generator. Whichever you pick, it is a command-line tool with configuration, tests and a README, kept in Git from the first commit and demonstrated to a reviewer.",
    deliverables: [
      "A working command-line application with argparse and configuration",
      "Input validation and graceful handling of every expected failure",
      "Automated tests that pass, including boundary and error cases",
      "A Git repository with a meaningful history and a README a stranger can follow",
      "A requirements.txt and installation instructions that work on a clean machine",
      "A short demonstration explaining one design decision and one bug you fixed",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Python Programming",
    covers: "Programming foundations • Core Python • Files, errors & OOP • Testing, SQL & APIs • Automation",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson, including every write-the-code practice",
      "Pass every required assessment at 70% or above",
      "Complete the three phase projects",
      "Complete and demonstrate the final portfolio application",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Phase 1 assessment",
      format:
        "Student Score Calculator, written without copying a solution: name and scores in, total, average and a formatted result out.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Phase 2 assessment",
      format:
        "Student Management System (console): a menu-driven program built from functions, conditions, loops and data structures.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Phase 3 assessment",
      format:
        "Personal Finance and Expense Tracker: saved records, validated input, search and a summary report.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format: "The portfolio application, delivered with documentation, tests and a demonstration.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const PYTHON_MODULE_IDS = PYTHON_COURSE.months.flatMap((m) =>
  m.modules.map((mod) => mod.id)
);

export default PYTHON_COURSE;
