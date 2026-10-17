/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 13 · ADVANCED LANGUAGE CONCEPTS & OOP
 *
 * Curriculum 13.1 – 13.10, plus the curriculum's note on the event loop,
 * microtasks and the task queue (recorded as 13.EL). This is the week the
 * course is named for: classes, prototypes, inheritance and encapsulation,
 * with the student records manager rebuilt as objects.
 *
 * Every snippet is executed by the content validator in Node. The one on
 * module behaviour runs as an ES module (`module: true`). Multi-file
 * import/export is shown as a worked example, because a single snippet cannot
 * import a second file.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s13-advanced";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 13.1 – 13.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l46-modules-classes",
    moduleId: "js-w13-advanced",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2"],
    title: "Modules and Classes",
    subtitle: "Splitting code into files, and a blueprint for objects",
    estimatedMinutes: 18,
    intro:
      "Two tools for programs that have outgrown a single file. Modules let each file own one part of the program and share only what it chooses. Classes let you define a kind of object once, its data and its behaviour, and create as many of them as you need.",

    atoms: [
      {
        id: "a-js-modules",
        title: "ES modules: import and export",
        explain:
          "A module is a file with its own private scope. Nothing inside it is visible to other files unless it is exported. export makes a function, class or value available; import brings it into another file. A file can have many named exports and one default export.",
        example:
          "grades.js\n\n  export const PASS_MARK = 50;\n\n  export function gradeFor(avg) {\n    if (avg >= 70) return \"A\";\n    if (avg >= 50) return \"C\";\n    return \"F\";\n  }\n\n  export default function average(scores) {\n    return scores.reduce((a, b) => a + b, 0) / scores.length;\n  }\n\nmain.js\n\n  import average, { gradeFor, PASS_MARK } from \"./grades.js\";\n\n  const avg = average([72, 65, 80]);\n  console.log(gradeFor(avg), avg >= PASS_MARK);   // A true\n\nIn the browser:   <script type=\"module\" src=\"main.js\"></script>\nIn Node.js:       name the files .mjs, or add \"type\": \"module\" to package.json",
        why: "Modules are how every real project is organised, and they make decomposition physical: one file per responsibility. Anything you do not export is private to the file, so other code cannot depend on your internal helpers.",
        table: {
          caption: "The import forms.",
          headers: ["Export", "Import"],
          rows: [
            ["export function gradeFor() {}", "import { gradeFor } from \"./grades.js\";"],
            ["export default function average() {}", "import average from \"./grades.js\";"],
            ["several named exports", "import { a, b as renamed } from \"./file.js\";"],
            ["everything", "import * as grades from \"./grades.js\";"],
          ],
        },
      },
      {
        id: "a-js-module-strict",
        title: "Modules are strict",
        explain:
          "Module code always runs in strict mode, which turns several silent mistakes into errors. The most important one: assigning to a variable that was never declared. In an ordinary script that quietly creates a global variable; in a module it throws.",
        codeExercise: {
          language: JS,
          module: true,
          code: 'let total = 0;\nconsole.log("Adding...");\ntotl = total + 10;\nconsole.log(total);\n',
          question: "This file runs as a module. Line 3 has a typo. Type what is printed, then the error.",
          expectedOutput: "Adding...",
          raises: "ReferenceError: totl is not defined",
          hint: "In a module, assigning to a name that was never declared is an error, not a new global.",
          successMessage:
            "In an old-style script, totl would silently become a new global, total would stay 0, and you would hunt for the bug. Strict mode reports the typo at the exact line. It is one of the quiet benefits of modules.",
        },
      },
      {
        id: "a-js-classes",
        title: "Classes, constructors and instances",
        explain:
          "A class is a blueprint for objects. Its constructor runs once for each new object and sets up its properties on this. Its methods are shared by every object made from it. new ClassName(arguments) creates an object, called an instance, runs the constructor, and returns the instance.",
        code: {
          language: JS,
          code: 'class Student {\n  constructor(name, scores) {\n    this.name = name;\n    this.scores = scores;\n  }\n\n  average() {\n    return this.scores.reduce((a, b) => a + b, 0) / this.scores.length;\n  }\n\n  passed(mark = 50) {\n    return this.average() >= mark;\n  }\n}\n\nconst ada = new Student("Ada", [72, 65, 80]);\nconst sani = new Student("Sani", [40, 45, 52]);\n\nconsole.log(ada);\nconsole.log(ada.average().toFixed(1), ada.passed());\nconsole.log(sani.average().toFixed(1), sani.passed());\n',
          expectedOutput: "Student { name: 'Ada', scores: [ 72, 65, 80 ] }\n72.3 true\n45.7 false",
        },
        why: "In Week 8 you wrote one account object by hand. A class lets you make thousands, each with its own data and all sharing the same methods. Node prints the class name in front of the object, so you can always see what kind of thing it is.",
        mistake:
          "Forgetting new: Student(\"Ada\", []) throws TypeError: Class constructor Student cannot be invoked without 'new'. A class can only be used to construct.",
      },
      {
        id: "a-js-class-instances",
        title: "Each instance has its own data",
        explain:
          "Instances share their methods but not their properties. Changing one instance never changes another, because each constructor call set up a separate object.",
        codeExercise: {
          language: JS,
          code: 'class Counter {\n  constructor(label) {\n    this.label = label;\n    this.count = 0;\n  }\n  increment() {\n    this.count++;\n    return this;\n  }\n}\n\nconst likes = new Counter("likes");\nconst views = new Counter("views");\nlikes.increment().increment();\nviews.increment();\n\nconsole.log(`${likes.label}: ${likes.count}`);\nconsole.log(`${views.label}: ${views.count}`);\nconsole.log(likes.increment === views.increment);\n',
          question: "Two counters, one class. increment returns this, so calls can be chained. What is printed?",
          expectedOutput: "likes: 2\nviews: 1\ntrue",
          hint: "Each counter has its own count. The method itself is the same function for both, defined once on the class.",
          successMessage:
            "Separate data, shared behaviour. The last line proves the method is literally the same function, stored once. Returning this from a method is what makes chaining like likes.increment().increment() work.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 13.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l47-prototypes-inheritance",
    moduleId: "js-w13-advanced",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.3"],
    title: "Prototypes and Inheritance",
    subtitle: "How classes actually work, and how one class extends another",
    estimatedMinutes: 18,
    intro:
      "JavaScript's classes are a cleaner way of writing something the language has always had: prototypes. Understanding the prototype chain explains where methods really live, and it is the mechanism behind inheritance, where a specialised class builds on a general one.",

    atoms: [
      {
        id: "a-js-prototypes",
        title: "The prototype chain",
        explain:
          "Every object has a hidden link to another object, its prototype. When you read a property, JavaScript looks on the object itself first; if it is not there, it looks on the prototype, then the prototype's prototype, until it finds it or reaches the end. A class's methods live on ClassName.prototype, and every instance's prototype is that object. That is how all instances share one copy of each method.",
        code: {
          language: JS,
          code: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}\n\nconst dog = new Animal("Bingo");\nconsole.log(Object.keys(dog));\nconsole.log(Object.getPrototypeOf(dog) === Animal.prototype);\nconsole.log(dog.hasOwnProperty("speak"));\nconsole.log(typeof Animal.prototype.speak);\nconsole.log(dog.speak());\n',
          expectedOutput: "[ 'name' ]\ntrue\nfalse\nfunction\nBingo makes a sound",
        },
        example:
          "Looking up dog.speak:\n\n  dog                       { name: 'Bingo' }        speak? no\n   └─▶ Animal.prototype     { speak, constructor }    speak? YES → use it\n        └─▶ Object.prototype { toString, … }\n             └─▶ null        (end of the chain)",
        why: "This is why array methods work on every array: map and filter live once on Array.prototype, and every array's prototype chain leads there. Arrays, strings, functions and your own classes all work the same way.",
      },
      {
        id: "a-js-inheritance",
        title: "Inheritance with extends and super",
        explain:
          "class Child extends Parent creates a class whose instances have Parent's methods too: Child.prototype's own prototype is Parent.prototype, so the lookup continues up the chain. In the child's constructor you must call super(...) before using this, which runs the parent's constructor. A child can override a parent method by defining one with the same name, and can still call the parent's version with super.method().",
        code: {
          language: JS,
          code: 'class Account {\n  constructor(owner, balance = 0) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n  withdraw(amount) {\n    if (amount > this.balance) return "Insufficient funds";\n    this.balance -= amount;\n    return `Withdrew ${amount}, balance ${this.balance}`;\n  }\n}\n\nclass SavingsAccount extends Account {\n  constructor(owner, balance, rate) {\n    super(owner, balance);\n    this.rate = rate;\n  }\n  addInterest() {\n    this.balance += this.balance * this.rate;\n    return this.balance;\n  }\n  withdraw(amount) {\n    if (amount > 50000) return "Savings withdrawals are limited to 50000";\n    return super.withdraw(amount);\n  }\n}\n\nconst s = new SavingsAccount("Kemi", 100000, 0.05);\nconsole.log(s.addInterest());\nconsole.log(s.withdraw(80000));\nconsole.log(s.withdraw(20000));\nconsole.log(s instanceof SavingsAccount, s instanceof Account);\n',
          expectedOutput: "105000\nSavings withdrawals are limited to 50000\nWithdrew 20000, balance 85000\ntrue true",
        },
        why: "SavingsAccount adds what is special about it (interest, a withdrawal limit) and reuses everything else. The override calls super.withdraw, so the balance check is still written in exactly one place.",
      },
      {
        id: "a-js-inheritance-lookup",
        title: "Which method runs?",
        explain:
          "When a child overrides a method, a lookup finds the child's version first and stops. When it does not, the lookup continues to the parent. Trace the chain for each call.",
        codeExercise: {
          language: JS,
          code: 'class Shape {\n  constructor(name) {\n    this.name = name;\n  }\n  area() {\n    return 0;\n  }\n  describe() {\n    return `${this.name} with area ${this.area()}`;\n  }\n}\n\nclass Square extends Shape {\n  constructor(side) {\n    super("Square");\n    this.side = side;\n  }\n  area() {\n    return this.side ** 2;\n  }\n}\n\nclass Dot extends Shape {\n  constructor() {\n    super("Dot");\n  }\n}\n\nconsole.log(new Square(3).describe());\nconsole.log(new Dot().describe());\n',
          question: "describe is defined only on Shape, but it calls this.area(). What is printed?",
          expectedOutput: "Square with area 9\nDot with area 0",
          hint: "For the square, this.area() is looked up starting from the square, whose class overrides area. Dot does not override it.",
          successMessage:
            "The parent's describe called the CHILD'S area for the square, because this is the square and the lookup starts there. That is polymorphism: the same call doing the right thing for each kind of object.",
        },
      },
      {
        id: "a-js-composition",
        title: "Inheritance or composition?",
        explain:
          "Inheritance models an \"is a\" relationship: a savings account is an account. Composition models \"has a\": a student has a list of scores, an order has a customer. Deep inheritance chains become hard to change, so modern practice uses inheritance sparingly, for genuine \"is a\" relationships, and builds most things by combining smaller objects.",
        decision: {
          scenario: "You are modelling a school. A Student needs a name, a list of scores, and a way to send an email notification. You already have a Notifier class that sends emails.",
          question: "How should Student relate to Notifier?",
          options: [
            {
              id: "a",
              text: "Student HAS a Notifier: pass one into the constructor and store it as this.notifier",
              why: "A student is not a kind of notifier; it uses one. Composition keeps Student focused, lets you swap in an SMS notifier later, and lets tests pass in a fake notifier that records messages instead of sending them.",
            },
            {
              id: "b",
              text: "class Student extends Notifier",
              whyWrong: "That says a student IS a notifier, which is false, and gives Student every Notifier method it does not need. Changing Notifier would now risk breaking Student.",
            },
            {
              id: "c",
              text: "Copy the email-sending code into Student",
              whyWrong: "Duplicated logic, the problem functions were invented to solve in Week 6. A fix to the email code would have to be made twice.",
            },
            {
              id: "d",
              text: "class Notifier extends Student",
              whyWrong: "A notifier is not a kind of student either. Inheritance in either direction models a relationship that does not exist.",
            },
          ],
          correct: "a",
          aftermath: "Ask \"is a\" or \"has a\" out loud. If \"is a\" sounds wrong, it is composition. The widely quoted rule of thumb: favour composition over inheritance.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 13.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l48-encapsulation-design",
    moduleId: "js-w13-advanced",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.4"],
    title: "Encapsulation and Object-Oriented Design",
    subtitle: "Protecting an object's data, and designing classes that stay correct",
    estimatedMinutes: 18,
    intro:
      "An object that anyone can change from outside cannot guarantee anything about itself. A bank account whose balance can be set to minus a million by any line of code is not really a bank account. Encapsulation is how an object protects its own rules, and it is the principle that makes object-oriented code reliable at scale.",

    atoms: [
      {
        id: "a-js-private-fields",
        title: "Private fields",
        explain:
          "A field whose name starts with # is private: it can only be read or changed by code inside the class body. Outside, it does not exist, and trying to reach it is a syntax error. Private data is changed only through methods, so the class can check every change against its rules.",
        code: {
          language: JS,
          code: 'class BankAccount {\n  #balance = 0;\n\n  constructor(owner) {\n    this.owner = owner;\n  }\n\n  deposit(amount) {\n    if (!(amount > 0)) throw new Error("Deposit must be positive");\n    this.#balance += amount;\n  }\n\n  get balance() {\n    return this.#balance;\n  }\n}\n\nconst acct = new BankAccount("Tunde");\nacct.deposit(5000);\nconsole.log(acct.balance);\nacct.balance = 1000000;\nconsole.log(acct.balance);\nconsole.log(acct);\n',
          expectedOutput: "5000\n5000\nBankAccount { owner: 'Tunde' }",
        },
        why: "acct.balance = 1000000 did nothing, because balance is a getter with no setter, and #balance cannot be reached from outside at all. Node does not even print private fields. The only way to change the balance is deposit, which checks the amount first.",
      },
      {
        id: "a-js-getters-setters",
        title: "Getters and setters",
        explain:
          "A getter, written get name() { … }, runs when a property is read. A setter, set name(value) { … }, runs when it is assigned, and can validate or transform the value. To the outside they look like ordinary properties, but the class keeps control of what is allowed.",
        codeExercise: {
          language: JS,
          code: 'class Product {\n  #price = 0;\n  constructor(name, price) {\n    this.name = name;\n    this.price = price;\n  }\n  set price(value) {\n    if (typeof value !== "number" || value < 0) {\n      console.log(`Rejected price for ${this.name}: ${value}`);\n      return;\n    }\n    this.#price = value;\n  }\n  get price() {\n    return this.#price;\n  }\n  get priceWithVat() {\n    return this.#price * 1.075;\n  }\n}\n\nconst rice = new Product("Rice", 2000);\nrice.price = -50;\nrice.price = "free";\nconsole.log(rice.price);\nconsole.log(rice.priceWithVat);\n',
          question: "The constructor's this.price = price also goes through the setter. Two bad assignments follow. What is printed?",
          expectedOutput: "Rejected price for Rice: -50\nRejected price for Rice: free\n2000\n2150",
          hint: "2000 passes the check in the constructor. -50 fails the < 0 check, and \"free\" fails the type check. priceWithVat is computed every time it is read.",
          successMessage:
            "Both bad values were rejected, by one setter, wherever they came from. priceWithVat has no stored value at all: it is calculated on demand, so it can never be out of date.",
        },
      },
      {
        id: "a-js-oop-principles",
        title: "The principles of object-oriented design",
        explain:
          "Object-oriented design rests on four ideas. Encapsulation: an object guards its own data and exposes only safe operations. Abstraction: users of a class need to know what it does, not how. Inheritance: a specialised class reuses a general one. Polymorphism: different classes answer the same method call in their own way. Behind all four is one habit: give each class a single, clear responsibility.",
        table: {
          caption: "The four principles, in the code from this week.",
          headers: ["Principle", "Means", "Example from this week"],
          rows: [
            ["Encapsulation", "Data protected behind methods", "#balance changed only by deposit"],
            ["Abstraction", "Use it without knowing how it works", "acct.balance, whatever is stored inside"],
            ["Inheritance", "A specialised class extends a general one", "SavingsAccount extends Account"],
            ["Polymorphism", "One call, the right behaviour for each type", "shape.area() for a Square and a Dot"],
          ],
        },
        why: "These principles are the vocabulary of every technical interview about design, and of every large codebase. More practically, they are what let a team of fifty change a program for years without it falling apart.",
      },
      {
        id: "a-js-oop-records",
        title: "Designing the records manager with classes",
        explain:
          "Here is the student records manager from Week 8, redesigned. A Student is responsible for its own scores and average. A Gradebook is responsible for the collection: adding, finding and ranking students. Each class has one job, and each protects its own data.",
        code: {
          language: JS,
          code: 'class Student {\n  #scores = [];\n  constructor(id, name) {\n    this.id = id;\n    this.name = name;\n  }\n  addScore(score) {\n    if (!Number.isFinite(score) || score < 0 || score > 100) {\n      throw new RangeError(`Invalid score ${score} for ${this.name}`);\n    }\n    this.#scores.push(score);\n  }\n  get average() {\n    if (this.#scores.length === 0) return 0;\n    return this.#scores.reduce((a, b) => a + b, 0) / this.#scores.length;\n  }\n}\n\nclass Gradebook {\n  #students = new Map();\n  add(student) {\n    this.#students.set(student.id, student);\n  }\n  find(id) {\n    return this.#students.get(id) ?? null;\n  }\n  ranking() {\n    return [...this.#students.values()]\n      .sort((a, b) => b.average - a.average)\n      .map((s) => `${s.name} ${s.average.toFixed(1)}`);\n  }\n}\n\nconst book = new Gradebook();\nconst ada = new Student(1, "Ada");\nconst bisi = new Student(2, "Bisi");\n[72, 88].forEach((s) => ada.addScore(s));\n[91, 79].forEach((s) => bisi.addScore(s));\nbook.add(ada);\nbook.add(bisi);\n\nconsole.log(book.ranking());\nconsole.log(book.find(3));\ntry {\n  ada.addScore(140);\n} catch (err) {\n  console.log(err.message);\n}\n',
          expectedOutput: "[ 'Bisi 85.0', 'Ada 80.0' ]\nnull\nInvalid score 140 for Ada",
        },
        why: "Nothing outside Student can put an invalid score into it, and nothing outside Gradebook can corrupt the collection. In Week 8's version, any line of code could push 140 into an array of scores. Here it is impossible, and the error says exactly what was wrong.",
      },
      {
        id: "a-js-oop-decision",
        title: "Where does the logic belong?",
        explain:
          "The hardest design question in OOP is which class a piece of behaviour belongs to. The usual answer: put it with the data it needs. If a method mostly reads another object's fields, it probably belongs in that other object.",
        decision: {
          scenario: "You need to decide whether a student is on the honours list: an average of 75 or more with no single score below 60. The scores live privately inside Student.",
          question: "Where should isOnHonoursList go?",
          options: [
            {
              id: "a",
              text: "A method on Student, since it only needs that student's own scores",
              why: "The rule depends entirely on data Student owns and protects. Putting it there keeps the scores private and keeps the rule next to the data it describes. Gradebook can then filter with student.isOnHonoursList().",
            },
            {
              id: "b",
              text: "A method on Gradebook that reads each student's #scores directly",
              whyWrong: "Gradebook cannot read another class's private fields; that is a syntax error. And if it could, the rule would depend on Student's internals, which is exactly what encapsulation prevents.",
            },
            {
              id: "c",
              text: "Make #scores public so any code can check the rule",
              whyWrong: "Removing the protection to save writing one method throws away the guarantee that scores are always valid.",
            },
            {
              id: "d",
              text: "A global function that takes a student and an array of scores",
              whyWrong: "The caller would need the scores, which are private, and the rule would live far from the data it is about.",
            },
          ],
          correct: "a",
          aftermath: "\"Tell, don't ask\": rather than asking an object for its data and deciding for it, tell the object what you want to know and let it decide.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 13.5 – 13.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l49-error-handling",
    moduleId: "js-w13-advanced",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.5", "13.6"],
    title: "Error Handling",
    subtitle: "try, catch, finally, and errors of your own",
    estimatedMinutes: 16,
    intro:
      "You have caught errors from awaits and thrown a RangeError from a class. This lesson makes error handling deliberate: where to catch, what to do with what you catch, and how to define error types that carry exactly the information the caller needs.",

    atoms: [
      {
        id: "a-js-try-catch-finally",
        title: "try, catch and finally",
        explain:
          "Code that might fail goes in try. If anything inside throws, the rest of try is skipped and catch runs with the error. finally runs afterwards whether or not there was an error, even if try or catch returned. Catch errors where you can actually do something about them; let them travel further otherwise.",
        codeExercise: {
          language: JS,
          code: 'function parseAge(text) {\n  try {\n    console.log("trying", text);\n    const data = JSON.parse(text);\n    return data.age;\n  } catch (err) {\n    console.log("bad input:", err.name);\n    return null;\n  } finally {\n    console.log("finished", text);\n  }\n}\n\nconsole.log(parseAge(\'{"age":21}\'));\nconsole.log(parseAge("{oops"));\n',
          question: "finally runs even when try or catch has already returned. Trace both calls. What is printed?",
          expectedOutput: "trying {\"age\":21}\nfinished {\"age\":21}\n21\ntrying {oops\nbad input: SyntaxError\nfinished {oops\nnull",
          hint: "In each call, finally prints BEFORE the returned value reaches the console.log outside. In the second call, JSON.parse throws a SyntaxError.",
          successMessage:
            "finally printed before each result, because it runs on the way out of the function, after return has chosen a value but before the caller receives it. That guarantee is what makes finally the place for clean-up.",
        },
      },
      {
        id: "a-js-throwing",
        title: "Throwing errors",
        explain:
          "throw stops the current function and sends an error up the call stack until something catches it. Throw an Error object, not a string, because an Error records a stack trace showing where it came from. Choose the built-in type that fits: TypeError for a wrong type, RangeError for a value out of range, Error otherwise.",
        code: {
          language: JS,
          code: 'function withdraw(balance, amount) {\n  if (typeof amount !== "number") throw new TypeError("Amount must be a number");\n  if (amount <= 0) throw new RangeError("Amount must be positive");\n  if (amount > balance) throw new Error("Insufficient funds");\n  return balance - amount;\n}\n\nfor (const amount of [500, "500", -5, 9000]) {\n  try {\n    console.log("New balance:", withdraw(1000, amount));\n  } catch (err) {\n    console.log(`${err.name}: ${err.message}`);\n  }\n}\n',
          expectedOutput: "New balance: 500\nTypeError: Amount must be a number\nRangeError: Amount must be positive\nError: Insufficient funds",
        },
        mistake:
          "throw \"Insufficient funds\" with a plain string. It works, but there is no stack trace, no name, and err.message is undefined, so any code that expects an Error breaks.",
      },
      {
        id: "a-js-custom-errors",
        title: "Custom error classes",
        explain:
          "Extend Error to create your own error types. Set this.name so messages identify the type, and add properties carrying the details the caller needs, such as which field failed. Callers can then use instanceof to handle each kind differently, and let unexpected errors keep travelling.",
        codeExercise: {
          language: JS,
          code: 'class ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.name = "ValidationError";\n    this.field = field;\n  }\n}\n\nfunction register(user) {\n  if (!user.email?.includes("@")) throw new ValidationError("email", "Enter a valid email");\n  if (user.password.length < 8) throw new ValidationError("password", "Use at least 8 characters");\n  return `Welcome, ${user.email}`;\n}\n\nfunction attempt(user) {\n  try {\n    console.log(register(user));\n  } catch (err) {\n    if (err instanceof ValidationError) {\n      console.log(`[${err.field}] ${err.message}`);\n    } else {\n      console.log(`Unexpected: ${err.name}`);\n    }\n  }\n}\n\nattempt({ email: "ada@memora.ng", password: "longenough" });\nattempt({ email: "ada", password: "longenough" });\nattempt({ email: "bisi@memora.ng", password: "short" });\nattempt({ email: "chidi@memora.ng" });\n',
          question: "Four attempts. The last one has no password at all. What is printed?",
          expectedOutput: "Welcome, ada@memora.ng\n[email] Enter a valid email\n[password] Use at least 8 characters\nUnexpected: TypeError",
          hint: "The last user's password is undefined, so password.length throws a built-in TypeError, which is not a ValidationError.",
          successMessage:
            "The validation errors were shown against their fields; the genuinely unexpected TypeError was told apart, because instanceof checks the class. In a real form, the field property tells you which input to highlight.",
        },
      },
      {
        id: "a-js-error-strategy",
        title: "Where to catch",
        explain:
          "Catching an error is only useful if you can do something sensible: show a message, retry, use a fallback. Catching it and doing nothing, often called swallowing the error, is worse than not catching it at all, because the program carries on in a broken state and nobody knows why.",
        decision: {
          scenario: "A function loadSettings() reads settings from localStorage and parses them. It sometimes throws on corrupt data.",
          question: "Which handling is best?",
          options: [
            {
              id: "a",
              text: "Catch it in loadSettings, log a warning, and return the default settings",
              why: "Corrupt saved settings are a known, recoverable situation, and loadSettings knows the sensible fallback. The app keeps working and the warning leaves a trail for debugging.",
            },
            {
              id: "b",
              text: "try { loadSettings(); } catch {} with an empty catch",
              whyWrong: "The error disappears and so does any settings object: the code that follows now uses undefined, and fails later somewhere unrelated, with no clue why.",
            },
            {
              id: "c",
              text: "Wrap the entire application in one try / catch at the top",
              whyWrong: "At the top level, nothing knows what the settings should have been. The best that handler can do is show a generic error for a problem that had an easy, local fix.",
            },
            {
              id: "d",
              text: "Never catch it; let the app crash on corrupt settings",
              whyWrong: "A user would be locked out of the app permanently by one bad saved value, until they found out how to clear their browser storage.",
            },
          ],
          correct: "a",
          aftermath: "Catch where you can recover, and nowhere else. An error you cannot handle should be allowed to travel up to code that can, or to a top-level handler that reports it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 13.7 – 13.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l50-iterators-regex-dates",
    moduleId: "js-w13-advanced",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["13.7", "13.8", "13.9"],
    title: "Iterators, Regular Expressions, Dates and Timers",
    subtitle: "Four tools you will reach for constantly",
    estimatedMinutes: 19,
    intro:
      "Four practical topics. Iterators are what for…of really uses. Regular expressions describe patterns in text. Dates are famously awkward, and the Intl API formats them, and money, correctly for every country. Timers schedule code for later.",

    atoms: [
      {
        id: "a-js-iterators",
        title: "Iterators and generators (introduction)",
        explain:
          "An iterator is an object with a next() method that returns { value, done } each time it is called. Anything that can produce one, such as arrays, strings, Maps and Sets, is iterable, and that is what for…of and spread work with. A generator function, written function*, makes iterators easily: each yield hands out the next value and pauses until it is asked again.",
        code: {
          language: JS,
          code: 'function* idGenerator(prefix) {\n  let n = 1;\n  while (true) {\n    yield `${prefix}-${String(n).padStart(3, "0")}`;\n    n++;\n  }\n}\n\nconst ids = idGenerator("MST");\nconsole.log(ids.next());\nconsole.log(ids.next().value);\nconsole.log(ids.next().value);\n\nfunction* range(from, to) {\n  for (let i = from; i <= to; i++) yield i;\n}\nconsole.log([...range(1, 5)]);\n',
          expectedOutput: "{ value: 'MST-001', done: false }\nMST-002\nMST-003\n[ 1, 2, 3, 4, 5 ]",
        },
        why: "The id generator loops forever, and that is fine, because a generator only runs until the next yield. Values are produced only when asked for. That makes generators good for sequences that are long, endless or expensive to compute.",
      },
      {
        id: "a-js-regex",
        title: "Regular expressions",
        explain:
          "A regular expression describes a pattern of characters, written between slashes. regex.test(text) says whether the text matches; text.match(regex) returns the matching parts; text.replace(regex, …) changes them. ^ and $ anchor to the start and end, \\d is a digit, + means one or more, {n} means exactly n, [abc] means any one of those characters, and the g flag finds every match rather than the first.",
        table: {
          caption: "The pieces you will use most.",
          headers: ["Pattern", "Matches"],
          rows: [
            ["\\d", "Any digit 0 to 9"],
            ["\\s", "Any whitespace"],
            ["\\w", "A letter, digit or underscore"],
            ["[789]", "One of 7, 8 or 9"],
            ["x+  x*  x?", "One or more, zero or more, zero or one x"],
            ["x{3}  x{2,4}", "Exactly 3, between 2 and 4 x"],
            ["^ … $", "The whole string, start to end"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'const ngMobile = /^0[789][01]\\d{8}$/;\nconsole.log(ngMobile.test("08031234567"));\nconsole.log(ngMobile.test("0803123456"));\nconsole.log(ngMobile.test("09012345678"));\n\nconst text = "Call 0803 123 4567 or 0705 999 0000 today";\nconsole.log(text.match(/\\d{4} \\d{3} \\d{4}/g));\nconsole.log("  too   many   spaces ".trim().replace(/\\s+/g, " "));\n',
          question: "The first pattern checks an 11-digit Nigerian mobile number starting 070, 071, 080, 081, 090 or 091. What is printed?",
          expectedOutput: "true\nfalse\ntrue\n[ '0803 123 4567', '0705 999 0000' ]\ntoo many spaces",
          hint: "The second number has only 10 digits. \\s+ matches any run of whitespace, and g replaces every run.",
          successMessage:
            "A regular expression is a tiny language of its own. Keep them short, test them against both good and bad examples as you just did, and add a comment saying what they are meant to match.",
        },
        mistake:
          "Validating emails with an elaborate regular expression. Real addresses are more varied than any pattern you will write. Check for something@something.something, then confirm the address by sending an email to it.",
      },
      {
        id: "a-js-dates-intl",
        title: "Dates and internationalisation",
        explain:
          "A Date stores a single moment in time. Months are numbered from 0, so January is 0 and October is 9, a famous trap. Dates are shown in the computer's local time zone unless you say otherwise, so for predictable results, create them in UTC and format with an explicit timeZone. Intl.DateTimeFormat and Intl.NumberFormat format dates and money in the conventions of any country.",
        code: {
          language: JS,
          code: 'const launch = new Date(Date.UTC(2026, 9, 17));\nconsole.log(launch.toISOString());\n\nconst dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });\nconsole.log(dateFmt.format(launch));\n\nconst naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });\nconsole.log(naira.format(1234567.5));\n\nconst due = new Date(Date.UTC(2026, 9, 31));\nconst days = Math.round((due - launch) / (1000 * 60 * 60 * 24));\nconsole.log(`${days} days left`);\n',
          expectedOutput: "2026-10-17T00:00:00.000Z\n17 October 2026\n₦1,234,567.50\n14 days left",
        },
        why: "Subtracting two dates gives the difference in milliseconds, which is how every countdown and \"days overdue\" figure is calculated. Formatting money with Intl gets the symbol, the separators and the decimals right for the user's country, instead of gluing \"N\" onto a number.",
      },
      {
        id: "a-js-timers",
        title: "Timers",
        explain:
          "setTimeout(callback, ms) runs a function once, after at least that many milliseconds. setInterval(callback, ms) runs it repeatedly. Both return an id that clearTimeout or clearInterval can use to cancel them. The delay is a minimum, not a promise: the callback runs when JavaScript is next free after the time has passed.",
        codeExercise: {
          language: JS,
          code: 'let ticks = 0;\nconst timer = setInterval(() => {\n  ticks++;\n  console.log(`tick ${ticks}`);\n  if (ticks === 3) {\n    clearInterval(timer);\n    console.log("stopped");\n  }\n}, 20);\n\nconst cancelled = setTimeout(() => console.log("never runs"), 10);\nclearTimeout(cancelled);\nconsole.log("timers scheduled");\n',
          question: "An interval ticks three times and cancels itself; a timeout is cancelled straight away. What is printed?",
          expectedOutput: "timers scheduled\ntick 1\ntick 2\ntick 3\nstopped",
          hint: "The last line runs first, because both timers are asynchronous. The cancelled timeout never fires.",
          successMessage:
            "Forgetting clearInterval is a classic leak: the callback keeps running forever, even after the part of the page it updates has gone. Always keep the id and cancel when you are done.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 13.10 + the event loop
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l51-testing-event-loop",
    moduleId: "js-w13-advanced",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["13.10", "13.EL"],
    title: "Testing and the Event Loop",
    subtitle: "Proving code works, and how asynchronous code really runs",
    estimatedMinutes: 19,
    intro:
      "Two topics to close the language. Unit tests are code that checks your code, automatically, every time you change it. And the event loop is the explanation, promised since Week 12, for the order in which synchronous code, promises and timers run.",

    atoms: [
      {
        id: "a-js-unit-tests",
        title: "Unit testing",
        explain:
          "A unit test calls one small piece of code, such as a function or a method, with chosen inputs, and checks the result against what it should be. Node.js has a built-in test runner and an assert module. A good test suite covers the normal case, the boundaries and the error cases, and runs in seconds.",
        example:
          "grades.test.js\n\n  import { test } from \"node:test\";\n  import assert from \"node:assert/strict\";\n  import { gradeFor } from \"./grades.js\";\n\n  test(\"70 and above is an A\", () => {\n    assert.equal(gradeFor(70), \"A\");\n    assert.equal(gradeFor(95), \"A\");\n  });\n\n  test(\"the boundary at 50 is a pass\", () => {\n    assert.equal(gradeFor(50), \"C\");\n    assert.equal(gradeFor(49), \"F\");\n  });\n\nIn the terminal:\n\n  > node --test\n  ✔ 70 and above is an A\n  ✔ the boundary at 50 is a pass\n  ℹ tests 2  pass 2  fail 0",
        why: "The boundary test is Week 2's habit, made permanent. Once written, it runs every time anything changes, so a bug fixed today cannot quietly come back next month.",
      },
      {
        id: "a-js-assertions",
        title: "Writing assertions",
        explain:
          "An assertion states something that must be true and throws if it is not. assert.equal compares simple values; assert.deepEqual compares the contents of arrays and objects; assert.throws checks that a function throws. A test passes when none of its assertions throw.",
        codeExercise: {
          language: JS,
          code: '// A two-method stand-in for node:assert, so this runs anywhere.\nconst assert = {\n  equal(actual, expected) {\n    if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);\n  },\n  throws(fn, ErrorType) {\n    try {\n      fn();\n    } catch (err) {\n      if (err instanceof ErrorType) return;\n    }\n    throw new Error("Expected an error");\n  },\n};\n\nfunction applyDiscount(total) {\n  if (total < 0) throw new RangeError("Negative total");\n  return total >= 10000 ? total * 0.9 : total;\n}\n\nconst cases = [\n  ["below threshold", () => assert.equal(applyDiscount(9999), 9999)],\n  ["at threshold", () => assert.equal(applyDiscount(10000), 9000)],\n  ["rejects negatives", () => assert.throws(() => applyDiscount(-1), RangeError)],\n  ["wrong expectation", () => assert.equal(applyDiscount(20000), 20000)],\n];\n\nfor (const [name, check] of cases) {\n  try {\n    check();\n    console.log(`pass  ${name}`);\n  } catch {\n    console.log(`FAIL  ${name}`);\n  }\n}\n',
          question: "A tiny test runner made of try / catch. One test has a wrong expectation. What is printed?",
          expectedOutput: "pass  below threshold\npass  at threshold\npass  rejects negatives\nFAIL  wrong expectation",
          hint: "20000 is over the threshold, so the function returns 18000, and the assertion expected 20000.",
          successMessage:
            "A failing test is not always a bug in the code; sometimes the expectation is wrong. Either way it has done its job: it made you look. Real runners like node --test do exactly this loop, with better output.",
        },
      },
      {
        id: "a-js-tdd",
        title: "Test-driven problem-solving",
        explain:
          "Test-driven development reverses the usual order: write a failing test for the behaviour you want, write the simplest code that makes it pass, then tidy the code while the tests stay green. It is called red, green, refactor. Even when you do not follow it strictly, writing the test first forces you to decide exactly what \"correct\" means before you start.",
        decision: {
          scenario: "You need a function that formats a duration in seconds as minutes and seconds, such as 125 → \"2:05\".",
          question: "Following test-driven development, what do you write first?",
          options: [
            {
              id: "a",
              text: "Tests for 125 → \"2:05\", 60 → \"1:00\", 59 → \"0:59\" and 0 → \"0:00\", run them and watch them fail",
              why: "The tests pin down the exact format, including the padded seconds and the boundaries at 0, 59 and 60, before any code exists. Seeing them fail proves the tests can actually detect a wrong answer.",
            },
            {
              id: "b",
              text: "The complete function, then a test for 125 to confirm it",
              whyWrong: "That is testing after, which is useful but not test-driven, and a single test misses the boundaries where formatting bugs live, such as 65 printing as \"1:5\".",
            },
            {
              id: "c",
              text: "The function, and test it by running it once with console.log",
              whyWrong: "A one-off console.log is checked by eye once and never again. It cannot catch the bug when someone changes the function next month.",
            },
            {
              id: "d",
              text: "A test that passes immediately, to make sure the test runner works",
              whyWrong: "A test that has never failed has never proved it can. Red first is the point.",
            },
          ],
          correct: "a",
          aftermath: "Red, green, refactor. The red step is the one people skip, and it is the one that proves your test is testing something.",
        },
      },
      {
        id: "a-js-event-loop",
        title: "The event loop, microtasks and the task queue",
        explain:
          "JavaScript runs one thing at a time, on a single thread. When asynchronous work finishes, its callback is not run immediately; it is queued. Timer and event callbacks go in the task queue. Promise callbacks (.then, and code after an await) go in the microtask queue. The event loop repeats one rule: run the current code to completion, then run EVERY waiting microtask, then take ONE task from the task queue, and repeat.",
        example:
          "  ┌────────────────────────────┐\n  │ Call stack: run the script │  ← synchronous code, to completion\n  └─────────────┬──────────────┘\n                ▼\n  ┌────────────────────────────┐\n  │ Microtask queue: run ALL   │  ← promise callbacks, await continuations\n  └─────────────┬──────────────┘\n                ▼\n  ┌────────────────────────────┐\n  │ Task queue: run ONE        │  ← setTimeout, setInterval, clicks\n  └─────────────┬──────────────┘\n                └────── then all microtasks again, and so on",
        why: "This explains everything about ordering from Week 12. A 0 ms setTimeout still runs after promise callbacks, because it is a task and they are microtasks. And a long synchronous loop freezes the page, because nothing in either queue can run until the current code finishes.",
      },
      {
        id: "a-js-event-loop-trace",
        title: "Tracing the event loop",
        explain:
          "To predict the order, sort each line into three groups: synchronous, microtask or task. Synchronous lines run first, in order. Then all microtasks, in the order they were queued. Then tasks, one at a time, with any microtasks they create running straight after each one.",
        codeExercise: {
          language: JS,
          code: 'console.log("1 sync");\n\nsetTimeout(() => {\n  console.log("5 task");\n  Promise.resolve().then(() => console.log("6 microtask from task"));\n}, 0);\n\nsetTimeout(() => console.log("7 task"), 0);\n\nPromise.resolve()\n  .then(() => console.log("3 microtask"))\n  .then(() => console.log("4 microtask"));\n\nconsole.log("2 sync");\n',
          question: "The numbers in the messages are deliberately the answer's order, but check that you can explain it. Type the output.",
          expectedOutput: "1 sync\n2 sync\n3 microtask\n4 microtask\n5 task\n6 microtask from task\n7 task",
          hint: "Synchronous first. Then both chained .then callbacks, since the second is queued as soon as the first finishes. Then the first timer, and the microtask it creates runs before the second timer.",
          successMessage:
            "The key line is 6: a microtask created inside a task runs before the NEXT task, because the loop empties the microtask queue after every single task. If you could explain each line, you understand asynchronous JavaScript better than most working developers.",
        },
      },
    ],

    task: {
      title: "Project: the records manager, object-oriented",
      intro:
        "Rebuild the student records manager one last time, as a small object-oriented program split into modules and covered by tests.",
      prompts: [
        "Create a Student class with private scores, a validated addScore method, and getters for average and grade. Create a Gradebook class that holds students in a private Map and offers add, find, inClass and ranking.",
        "Define ValidationError and NotFoundError classes extending Error, with useful properties, and throw them from your classes instead of returning error strings.",
        "Split the code into modules: student.js, gradebook.js, errors.js and main.js, each exporting only what others need.",
        "Write at least eight tests with node --test and node:assert, including every boundary of your grade bands and every error case. Watch each test fail before you make it pass.",
        "Add a generator that yields matriculation numbers, and format every average and date in main.js with Intl.",
      ],
      closing:
        "Compare this with your Week 8 version. The behaviour is the same; what changed is that the program now protects its own rules, and proves it.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
