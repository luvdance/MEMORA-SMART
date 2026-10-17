/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 3 · INTRODUCTION TO JAVASCRIPT
 *
 * Curriculum 3.1 – 3.9. The first week of real code. Every `code` and
 * `codeExercise` below is executed by `npm run validate:content` in Node, and
 * the output quoted here is the output Node actually printed.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s3-intro";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 3.1 – 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l8-meet-javascript",
    moduleId: "js-w3-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3"],
    title: "Meet JavaScript",
    subtitle: "What it is, where it runs, and your first program",
    estimatedMinutes: 14,
    intro:
      "Two weeks of logic, and now the language. JavaScript is the only programming language every web browser understands, which makes it the most widely run language in the world. By the end of this lesson it will be installed on your computer and you will have run your first program two different ways.",

    atoms: [
      {
        id: "a-js-what-is-js",
        title: "What JavaScript is, and where it is used",
        explain:
          "JavaScript is a programming language created in 1995 to make web pages interactive. Today it runs in three main places: in every web browser, on servers through Node.js, and inside apps built with frameworks such as React Native and Electron. The same language, with the same rules, everywhere.",
        origin:
          "Brendan Eich wrote the first version in ten days at Netscape in 1995. Despite the name it has nothing to do with Java; the name was a marketing decision at a time when Java was fashionable. The official standard is called ECMAScript, and a new edition is published every year.",
        table: {
          caption: "Where JavaScript runs, and what it does there.",
          headers: ["Where", "What it does", "You will meet it in"],
          rows: [
            ["The browser", "Responds to clicks, updates pages, validates forms", "Weeks 10 and 11"],
            ["Node.js", "Runs servers, scripts and build tools", "This week, and Week 14"],
            ["Frameworks such as React", "Builds whole user interfaces from components", "Week 15"],
            ["Mobile and desktop apps", "React Native, Electron (VS Code itself is built with it)", "After the course"],
          ],
        },
        why: "Learning one language that works in all of these places means everything you learn transfers. The loops you write in Node.js this week are exactly the loops you will write in the browser in Week 10.",
      },
      {
        id: "a-js-setup-vscode",
        title: "Setting up VS Code and Node.js",
        explain:
          "You need two free programs. VS Code is a code editor: a text editor that understands code, colours it, and warns you about mistakes. Node.js runs JavaScript outside the browser. Install both, then check Node.js works by typing a command in the terminal.",
        example:
          "1. Download VS Code from code.visualstudio.com and install it.\n2. Download Node.js (the LTS version) from nodejs.org and install it.\n3. In VS Code, open the terminal: View → Terminal.\n4. Type this and press Enter:\n\n     node --version\n\n   You should see a version number such as v22.11.0.\n   Any version from 20 upwards is fine for this course.\n\n5. Create a folder called js-course, then File → Open Folder\n   and choose it. Every file you make this course goes here.",
        mistake:
          "Installing Node.js while VS Code is open, then getting \"node is not recognised\" in the terminal. The terminal only reads the list of installed programs when it starts. Close VS Code completely and reopen it.",
      },
      {
        id: "a-js-first-program",
        title: "Your first program",
        explain:
          "Create a file called hello.js in your js-course folder. The .js ending tells the computer it holds JavaScript. Type one line, save it, and run it from the terminal with node hello.js. console.log() is the instruction that prints a value; you will use it constantly.",
        code: {
          language: JS,
          code: 'console.log("Hello, Memora!");\n',
          expectedOutput: "Hello, Memora!",
        },
        example:
          "In the VS Code terminal, inside your js-course folder:\n\n  > node hello.js\n  Hello, Memora!",
        why: "That is a complete program: input (none yet), processing (none yet), and output. Every program in this course is this one, grown.",
      },
      {
        id: "a-js-browser-console",
        title: "The browser console",
        explain:
          "Every modern browser has a JavaScript console built in. Open any web page, press F12 (or Ctrl+Shift+J on Windows, Cmd+Option+J on a Mac), and click the Console tab. Type JavaScript and press Enter: it runs immediately, on that page. It is the fastest way to try an idea.",
        example:
          "In the browser console:\n\n  > 2 + 3\n  5\n  > console.log(\"Hi from the browser\")\n  Hi from the browser\n  > document.title\n  'Memora Smart Academy'\n\nThe last one only works in a browser: document is the web page,\nand Node.js has no web page.",
        why: "The console shows the value of whatever you type, which makes it ideal for experiments. When something on a web page does not work, it is also where the browser reports the error, so you will open it every day from Week 10 onwards.",
      },
      {
        id: "a-js-node-basics",
        title: "Node.js basics, and the code on this page",
        explain:
          "Node.js runs a .js file from start to finish and prints whatever console.log() is given, one line per call. It has no web page, so browser-only things such as document and alert() do not exist there, but everything in the language itself works identically. Every code example in this course can be run either in Node.js or with the Run button below it.",
        codeExercise: {
          language: JS,
          code: 'console.log("Line one");\nconsole.log(10 + 5);\nconsole.log("Line three");\n',
          question: "Each console.log() prints one line. What does this program print?",
          expectedOutput: "Line one\n15\nLine three",
          hint: "The middle line prints the RESULT of 10 + 5, not the characters 10 + 5.",
          successMessage:
            "Exactly. Three calls, three lines, in order. The middle one shows that console.log() prints the value of an expression: JavaScript works out 10 + 5 first.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.4 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l9-statements-readable",
    moduleId: "js-w3-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.4", "3.5"],
    title: "Statements, Expressions and Readable Code",
    subtitle: "The grammar of JavaScript, and writing for humans",
    estimatedMinutes: 12,
    intro:
      "Every language has a grammar. JavaScript's is small: statements are sentences, expressions are the parts that produce values. Learn the difference and error messages start to make sense. Then learn to lay code out so the next person, who is usually you, can read it.",

    atoms: [
      {
        id: "a-js-statements",
        title: "Statements: the sentences of a program",
        explain:
          "A statement is one complete instruction. let total = 5; is a statement. console.log(total); is a statement. Statements run one after another, top to bottom, which is the sequence structure from Week 2. Each statement normally ends with a semicolon.",
        why: "JavaScript can often add missing semicolons for you (this is called automatic semicolon insertion), but not always correctly. Writing them yourself removes a whole category of strange bugs, and it is what every style guide in this course expects.",
        code: {
          language: JS,
          code: "let price = 1200;\nlet quantity = 3;\nlet total = price * quantity;\nconsole.log(total);\n",
          expectedOutput: "3600",
        },
      },
      {
        id: "a-js-expressions",
        title: "Expressions: anything that produces a value",
        explain:
          "An expression is any piece of code that produces a value. 5 is an expression. price * quantity is an expression. \"Hello\" is an expression. Statements are built out of expressions: in let total = price * quantity; the expression is price * quantity, and the statement stores its value.",
        table: {
          caption: "Expressions and the values they produce.",
          headers: ["Expression", "Value"],
          rows: [
            ["7", "7"],
            ["7 * 6", "42"],
            ["\"Ada\"", "Ada"],
            ["10 > 3", "true"],
            ["(2 + 3) * 4", "20"],
          ],
        },
        codeExercise: {
          language: JS,
          code: "let a = 4;\nlet b = 6;\nconsole.log(a + b * 2);\nconsole.log((a + b) * 2);\n",
          question: "Multiplication happens before addition, just as in maths, unless brackets say otherwise. What does this print?",
          expectedOutput: "16\n20",
          hint: "Line 3: b * 2 first, then add a. Line 4: the brackets go first.",
          successMessage:
            "16 then 20. Same numbers, different expressions, different values. The brackets are the only difference, and they are why you met precedence in Week 2.",
        },
      },
      {
        id: "a-js-syntax-rules",
        title: "Syntax rules that catch beginners",
        explain:
          "Syntax is the set of rules for how code must be written. Four catch almost everyone in the first week: JavaScript is case-sensitive, text must be in matching quotes, brackets must be closed in the order they were opened, and every opening brace { needs a closing brace }.",
        table: {
          caption: "Four rules, and what breaking them looks like.",
          headers: ["Rule", "Wrong", "Right"],
          rows: [
            ["Case-sensitive", "Console.log(\"Hi\");", "console.log(\"Hi\");"],
            ["Matching quotes", "console.log(\"Hi');", "console.log(\"Hi\");"],
            ["Close brackets", "console.log(\"Hi\";", "console.log(\"Hi\");"],
            ["Names are exact", "let Total = 5; console.log(total);", "let total = 5; console.log(total);"],
          ],
        },
        code: {
          language: JS,
          code: "let total = 5;\nconsole.log(Total);\n",
          raises: "ReferenceError: Total is not defined",
        },
        why: "That error is worth reading carefully, because you will see it often. ReferenceError means JavaScript looked for a name and found nothing. total and Total are two different names, and only one of them exists.",
      },
      {
        id: "a-js-comments",
        title: "Comments",
        explain:
          "A comment is text in your code that JavaScript ignores. // starts a comment that runs to the end of the line. /* starts a comment that runs until */, across as many lines as you like. Comments are for people, not for the computer.",
        code: {
          language: JS,
          code: "// VAT in Nigeria is 7.5%, set by the Finance Act 2019.\nconst VAT_RATE = 0.075;\n\n/*\n  Price of one item before tax.\n  Comes from the product list.\n*/\nlet price = 2000;\n\nconsole.log(price * VAT_RATE); // the tax on one item\n",
          expectedOutput: "150",
        },
        why: "Good comments say WHY, not what. The code already says what it does. A comment explaining that a number comes from the Finance Act saves the next reader from wondering whether 0.075 is a typo.",
        mistake:
          "Commenting the obvious: // add one to count above count = count + 1. It adds noise and goes out of date the moment the code changes. Comment the reason, the source, or the surprising part.",
      },
      {
        id: "a-js-indentation",
        title: "Indentation and readable code",
        explain:
          "Indentation is the space at the start of a line. JavaScript ignores it completely, but people do not. The convention is to indent everything inside a pair of braces by two spaces, so the structure of the code is visible at a glance, exactly as in your pseudocode.",
        example:
          "Unreadable (but valid):\n\nif(score>=50){console.log(\"Pass\");}else{console.log(\"Fail\");}\n\nReadable:\n\nif (score >= 50) {\n  console.log(\"Pass\");\n} else {\n  console.log(\"Fail\");\n}\n\nSame program. One of them shows you its shape.",
        why: "Code is read far more often than it is written. Readable code is faster to debug, easier to review and safer to change. In Week 14 you will set up a formatter that indents automatically, but the habit should be yours first.",
        decision: {
          scenario: "A teammate's code works, but every line starts at the left edge and nothing is indented.",
          question: "What is the most accurate thing to say?",
          options: [
            {
              id: "a",
              text: "It is fine; JavaScript ignores indentation, so it makes no difference",
              whyWrong: "It makes no difference to the computer. It makes a large difference to every person who has to read, debug or change the code, which is most of the code's life.",
            },
            {
              id: "b",
              text: "It will not run until it is indented",
              whyWrong: "JavaScript ignores whitespace at the start of lines, so it runs. That is true of JavaScript, but not of every language: Python, for example, does require indentation.",
            },
            {
              id: "c",
              text: "It runs correctly, but it hides the structure, so bugs are harder to see; it should be formatted",
              why: "Indentation is for the reader. Without it, you cannot see which lines belong inside which block, and that is exactly where logic errors hide.",
            },
            {
              id: "d",
              text: "Indentation makes the program run faster",
              whyWrong: "Whitespace has no effect on speed. It is ignored when the code is run.",
            },
          ],
          correct: "c",
          aftermath: "Write code for the reader first and the computer second. The computer will cope with anything valid; people will not.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.6 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l10-variables",
    moduleId: "js-w3-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.6", "3.7"],
    title: "Variables: let, const and var",
    subtitle: "Three keywords, and when each one is right",
    estimatedMinutes: 15,
    intro:
      "In Week 2 you wrote SET score TO 70. In JavaScript you write let score = 70;. There are three keywords for creating a variable, and choosing the right one is your first real design decision in the language.",

    atoms: [
      {
        id: "a-js-let",
        title: "let: a variable that can change",
        explain:
          "let creates a variable whose value can be changed later. Write let, the name, an equals sign, and the starting value. To change it later, leave out the let: you are reusing the variable, not creating a new one. The single = means \"store\", exactly like SET … TO.",
        code: {
          language: JS,
          code: "let score = 70;\nconsole.log(score);\n\nscore = 85;\nconsole.log(score);\n\nscore = score + 5;\nconsole.log(score);\n",
          expectedOutput: "70\n85\n90",
        },
        mistake:
          "Writing let again when you change the value: let score = 85; on a variable that already exists. JavaScript refuses, because it looks like you are trying to create a second variable with the same name.",
      },
      {
        id: "a-js-const",
        title: "const: a binding that must not be reassigned",
        explain:
          "const creates a variable that cannot be given a new value after it is created. Trying to reassign it is an error. Use const for anything that should stay fixed for the life of the program: a tax rate, a pass mark, a configuration value. This is the constant from Week 2, enforced by the language.",
        code: {
          language: JS,
          code: "const PASS_MARK = 50;\nconsole.log(PASS_MARK);\nPASS_MARK = 45;\n",
          raises: "TypeError: Assignment to constant variable.",
          expectedOutput: "50",
        },
        why: "The error is the point. If a line of code accidentally tries to change something that must not change, you want the program to stop and tell you, not carry on with a wrong pass mark. const turns a silent logic error into a loud runtime error.",
      },
      {
        id: "a-js-const-default",
        title: "Prefer const, use let when you must",
        explain:
          "Professional JavaScript uses const by default and let only when a variable genuinely needs to change, such as a running total or a loop counter. When you read code written this way, every let is a signal: this value changes, so watch it.",
        decision: {
          scenario: "You are writing a shopping calculator. You need: the VAT rate, the customer's name, and a running total that grows as each item is added.",
          question: "Which keywords should you use?",
          options: [
            {
              id: "a",
              text: "const for the VAT rate and the name, let for the running total",
              why: "The rate and the name are set once and never reassigned. The total changes every time an item is added, so it needs let. Each keyword now tells the reader something true.",
            },
            {
              id: "b",
              text: "let for all three, in case anything needs to change",
              whyWrong: "This works, but it throws away the protection const gives you and hides which values actually change. \"In case\" is not a reason; change const to let if and when you need to.",
            },
            {
              id: "c",
              text: "const for all three",
              whyWrong: "The running total has to be reassigned each time an item is added. With const, the first addition throws a TypeError.",
            },
            {
              id: "d",
              text: "var for all three",
              whyWrong: "var is the older keyword with behaviour that surprises people, which you will see next. Modern code uses const and let.",
            },
          ],
          correct: "a",
          aftermath: "A useful rule: write const. If the code later needs to reassign it, change that one to let. You will rarely need to go the other way.",
        },
      },
      {
        id: "a-js-var",
        title: "var, and why it behaves differently",
        explain:
          "var is the original way of creating a variable, from before 2015. It still works, and you will see it in older code and tutorials, but it behaves differently in two ways that cause bugs. A var can be declared twice without any error, and a var can be used before the line that creates it, where it holds the special value undefined instead of causing an error.",
        code: {
          language: JS,
          code: 'console.log(city);\nvar city = "Lagos";\nconsole.log(city);\n\nvar city = "Abuja";\nconsole.log(city);\n',
          expectedOutput: "undefined\nLagos\nAbuja",
        },
        why: "Both behaviours hide mistakes. Using a variable before giving it a value is almost always a bug, and var lets it through silently. Declaring the same name twice usually means two parts of the code are fighting over one variable, and var lets that through too. You will see why var works this way, a mechanism called hoisting, in Week 9.",
        table: {
          caption: "The three keywords side by side.",
          headers: ["", "const", "let", "var"],
          rows: [
            ["Can be reassigned", "No", "Yes", "Yes"],
            ["Can be declared twice", "No (error)", "No (error)", "Yes, silently"],
            ["Used before its line", "Error", "Error", "Silently undefined"],
            ["Use it in new code?", "Yes, by default", "Yes, when it changes", "No"],
          ],
        },
      },
      {
        id: "a-js-let-tdz-preview",
        title: "let fails loudly where var fails silently",
        explain:
          "Run the same mistake with let instead of var, using a variable before the line that creates it, and JavaScript stops with an error instead of giving you undefined. That is better: the mistake is reported at the line where it happens.",
        codeExercise: {
          language: JS,
          code: 'console.log("Start");\nconsole.log(total);\nlet total = 100;\n',
          question:
            "The first line runs, then line 2 uses total before it exists. Type exactly what is printed, then on the next line the error. JavaScript reports it as: ReferenceError: Cannot access 'total' before initialization",
          expectedOutput: "Start",
          raises: "ReferenceError: Cannot access 'total' before initialization",
          hint: "Line 1 prints normally. Line 2 throws, and the error message given in the question is what you see next.",
          successMessage:
            "Right. The program printed Start, then stopped at line 2 with a clear message naming the variable. With var it would have printed undefined and carried on with a wrong value.",
        },
      },
      {
        id: "a-js-naming",
        title: "Naming conventions and identifiers",
        explain:
          "A variable's name is called an identifier. It may contain letters, digits, _ and $, but cannot start with a digit, cannot contain spaces, and cannot be a reserved word such as let, if or class. By convention JavaScript uses camelCase: the first word lower case, each later word starting with a capital. Constants that are fixed values are often written in UPPER_SNAKE_CASE.",
        table: {
          caption: "Good and bad identifiers.",
          headers: ["Name", "Valid?", "Why"],
          rows: [
            ["studentName", "Yes, and good", "camelCase, says what it holds"],
            ["totalPrice2", "Yes", "Digits are fine after the first character"],
            ["2ndPlace", "No", "Cannot start with a digit"],
            ["student name", "No", "Cannot contain a space"],
            ["let", "No", "Reserved word"],
            ["x", "Valid, but poor", "Says nothing about what it holds"],
            ["MAX_ATTEMPTS", "Yes, for a constant", "Convention for fixed values"],
          ],
        },
        why: "A good name is the cheapest documentation there is. averageScore needs no comment; a needs a paragraph. Choosing names well is one of the clearest signs of an experienced programmer.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.8 – 3.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l11-output-input",
    moduleId: "js-w3-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.8", "3.9"],
    title: "Output and Input",
    subtitle: "console.log(), prompt() and getting data into Node.js",
    estimatedMinutes: 14,
    intro:
      "Input, processing, output: you have done processing. This lesson completes the picture with the two ends, and then you build the week's mini-project, a program that takes your details and introduces you.",

    atoms: [
      {
        id: "a-js-console-log",
        title: "console.log() in depth",
        explain:
          "console.log() prints whatever you give it and moves to a new line. Give it several values separated by commas and it prints them all on one line with a space between each. Text must be in quotes; numbers and variable names must not be, or they are printed as the literal characters.",
        code: {
          language: JS,
          code: 'const name = "Chidi";\nconst age = 21;\n\nconsole.log(name);\nconsole.log("name");\nconsole.log("Name:", name, "Age:", age);\n',
          expectedOutput: "Chidi\nname\nName: Chidi Age: 21",
        },
        why: "Line 2 and line 3 are the most important comparison in this lesson. name without quotes is the variable, so you see its value. \"name\" in quotes is just text, so you see the word. Mixing the two up is the first bug almost everyone writes.",
      },
      {
        id: "a-js-joining-text",
        title: "Joining text with +",
        explain:
          "The + operator joins text together when either side is text. This is called concatenation. \"Hello, \" + name produces a single piece of text. Spaces are not added for you, so you put them inside the quotes yourself.",
        codeExercise: {
          language: JS,
          code: 'const first = "Ada";\nconst last = "Obi";\nconsole.log(first + last);\nconsole.log(first + " " + last);\nconsole.log("Total: " + 5 + 5);\n',
          question: "Watch the spaces, and the last line carefully. What does this print?",
          expectedOutput: "AdaObi\nAda Obi\nTotal: 55",
          hint: "The last line works left to right. \"Total: \" + 5 is text, and text + 5 joins again rather than adding.",
          successMessage:
            "Including the trap. \"Total: \" + 5 becomes the text \"Total: 5\", and adding 5 to text joins it again: \"Total: 55\". To add first, use brackets: \"Total: \" + (5 + 5). You will meet a cleaner way, template literals, next week.",
        },
      },
      {
        id: "a-js-prompt",
        title: "Input in the browser: prompt()",
        explain:
          "In a browser, prompt() shows a small box asking the user to type something, and gives you back whatever they typed. It always gives back text, even if they typed a number. It only exists in the browser; Node.js has no prompt().",
        example:
          "In the browser console (or a <script> on a web page):\n\n  const name = prompt(\"What is your name?\");\n  console.log(\"Hello, \" + name);\n\nThe browser shows a box. If you type Zainab and press OK:\n\n  Hello, Zainab\n\nIf you press Cancel, prompt() gives back null instead.",
        mistake:
          "Doing arithmetic on what prompt() returns. If the user types 5, prompt() returns the text \"5\", and \"5\" + 1 is \"51\". Convert it first with Number(), which you will study properly in Week 4.",
      },
      {
        id: "a-js-node-input",
        title: "Input in Node.js",
        explain:
          "Node.js has no prompt box. The simplest alternative is to pass values when you run the program: everything you type after the file name arrives in a list called process.argv. Item 2 is the first value you passed, item 3 the second, and so on. For interactive questions Node.js has a module called readline, which you will use once functions and promises are familiar.",
        example:
          "intro.js:\n\n  const name = process.argv[2];\n  const city = process.argv[3];\n  console.log(\"Hello \" + name + \" from \" + city);\n\nIn the terminal:\n\n  > node intro.js Tunde Ibadan\n  Hello Tunde from Ibadan\n\nItems 0 and 1 are the path to Node.js and the path to your file,\nwhich is why your values start at 2.",
        why: "Passing values on the command line is how real tools are used: git commit -m \"message\", npm install react. Every one of those is a program reading process.argv.",
      },
      {
        id: "a-js-intro-generator",
        title: "The introduction generator",
        explain:
          "Here is the week's mini-project in its simplest working form. The inputs are written as constants so it runs anywhere; in your own version, replace them with prompt() in the browser or process.argv in Node.js. Read it as input, processing and output.",
        code: {
          language: JS,
          code: '// INPUT\nconst name = "Amaka";\nconst age = 19;\nconst city = "Enugu";\nconst goal = "build mobile apps";\n\n// PROCESSING\nconst birthYear = 2026 - age;\nconst greeting = "Hi, I am " + name + ".";\n\n// OUTPUT\nconsole.log(greeting);\nconsole.log("I live in " + city + " and I was born around " + birthYear + ".");\nconsole.log("My goal is to " + goal + ".");\n',
          expectedOutput: "Hi, I am Amaka.\nI live in Enugu and I was born around 2007.\nMy goal is to build mobile apps.",
        },
        why: "The comments mark input, processing and output, the three parts from Week 1. Keep that structure in every program you write this month, and swapping fixed values for real input later only touches the top section.",
      },
    ],

    task: {
      title: "Mini-project: personal information and introduction generator",
      intro:
        "Build your own introduction generator in a file called intro.js, run it with Node.js, then make a browser version.",
      prompts: [
        "Collect at least five pieces of information: name, age, city, favourite subject and a goal. Use const for each.",
        "Process at least two of them: work out the birth year from the age, and count how many letters are in the name using name.length.",
        "Output at least four lines of introduction with console.log(), each one built by joining text and variables with +.",
        "Make a Node.js version that takes the name and city from process.argv, and run it with your own details.",
        "Make a browser version: paste it into the browser console using prompt() for the inputs. Type your age and notice what happens if you try to add 1 to it.",
      ],
      closing:
        "Keep this file. You will rebuild it next week with template literals and see how much cleaner it becomes.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
