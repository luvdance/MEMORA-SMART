/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 8 · OBJECTS & MODERN JAVASCRIPT
 *
 * Curriculum 8.1 – 8.10. Objects arrive, and with them the course's central
 * idea: modelling a thing as data (properties) plus behaviour (methods). The
 * array-method lessons follow the curriculum's instruction to the letter —
 * every method is taught by WHAT IT RETURNS, not by its name.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s8-objects";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 8.1 – 8.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l27-objects",
    moduleId: "js-w8-objects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3"],
    title: "Objects",
    subtitle: "Key-value pairs, properties, methods and two ways to reach them",
    estimatedMinutes: 16,
    intro:
      "An array is a list of similar things in order. But a student is not a list: they have a name, an age, a set of scores and a city, each of a different kind. An object groups everything about one thing under named keys. This is where object-oriented programming begins.",

    atoms: [
      {
        id: "a-js-objects-kv",
        title: "Objects and key-value pairs",
        explain:
          "An object is written in curly braces as a list of key: value pairs, separated by commas. Each key is a name; each value can be anything: a string, a number, an array, even another object. The pairs are called properties. You find a value by its key, not by a position.",
        code: {
          language: JS,
          code: 'const student = {\n  name: "Ada",\n  age: 19,\n  city: "Lagos",\n};\n\nconsole.log(student);\nconsole.log(student.name);\nconsole.log(student.age + 1);\n',
          expectedOutput: "{ name: 'Ada', age: 19, city: 'Lagos' }\nAda\n20",
        },
        why: "Compare with an array: [\"Ada\", 19, \"Lagos\"]. Is index 1 the age or the year? You would have to remember. student.age says what it is. Objects make data self-describing.",
      },
      {
        id: "a-js-properties-change",
        title: "Adding, changing and deleting properties",
        explain:
          "Assign to a key that exists and you change its value. Assign to a key that does not exist yet and you add a new property. delete removes a property. Reading a key that does not exist gives undefined, just like an index past the end of an array.",
        codeExercise: {
          language: JS,
          code: 'const order = { item: "Rice", qty: 2 };\norder.qty = 5;\norder.paid = true;\ndelete order.item;\nconsole.log(order);\nconsole.log(order.item);\n',
          question: "Apply the three changes in order. What is printed?",
          expectedOutput: "{ qty: 5, paid: true }\nundefined",
          hint: "qty is changed, paid is added at the end, and item is removed completely.",
          successMessage: "Exactly. The object was declared with const and still changed, for the same reason the array did last week: const fixes which object the name refers to, not what is inside it.",
        },
      },
      {
        id: "a-js-methods",
        title: "Methods: functions that belong to an object",
        explain:
          "A property whose value is a function is called a method. Methods are the behaviour of an object, where the other properties are its data. Inside a method, the keyword this refers to the object the method was called on, so the method can read and change that object's own properties.",
        code: {
          language: JS,
          code: 'const account = {\n  owner: "Tunde",\n  balance: 5000,\n  deposit(amount) {\n    this.balance += amount;\n    return this.balance;\n  },\n  describe() {\n    return `${this.owner} has ${this.balance}`;\n  },\n};\n\naccount.deposit(2500);\nconsole.log(account.describe());\n',
          expectedOutput: "Tunde has 7500",
        },
        why: "This is the core idea of object-oriented programming: data and the operations on it travel together. The account knows its own balance and knows how to deposit into itself. In Week 13 classes let you stamp out as many accounts as you like from one definition.",
        mistake:
          "Writing a method as an arrow function: deposit: (amount) => { this.balance += amount; }. Arrow functions do not get their own this, so this does not refer to the account and the balance never changes. Use the method shorthand shown above.",
      },
      {
        id: "a-js-dot-bracket",
        title: "Dot notation versus bracket notation",
        explain:
          "There are two ways to reach a property. Dot notation, student.name, is shorter and used whenever you know the key while writing the code. Bracket notation, student[\"name\"], takes the key as a string, so the key can come from a variable, or contain spaces or other characters a dot cannot handle.",
        codeExercise: {
          language: JS,
          code: 'const scores = { maths: 72, english: 65, "further maths": 80 };\nconst subject = "english";\n\nconsole.log(scores.maths);\nconsole.log(scores[subject]);\nconsole.log(scores["further maths"]);\nconsole.log(scores.subject);\n',
          question: "The last line is a trap. What is printed?",
          expectedOutput: "72\n65\n80\nundefined",
          hint: "scores[subject] uses the VALUE of the variable subject. scores.subject looks for a key literally called \"subject\".",
          successMessage:
            "72, 65, 80, undefined. scores.subject looks for a property named subject, which does not exist. Whenever the key is in a variable, you need brackets.",
        },
        table: {
          caption: "When to use which.",
          headers: ["Situation", "Use", "Example"],
          rows: [
            ["Key known while writing", "Dot", "student.name"],
            ["Key held in a variable", "Brackets", "scores[subject]"],
            ["Key has a space or dash", "Brackets", "scores[\"further maths\"]"],
            ["Looping over every key", "Brackets", "obj[key] inside for…in"],
          ],
        },
      },
      {
        id: "a-js-looping-objects",
        title: "Visiting every property",
        explain:
          "Object.keys(obj) gives an array of an object's keys, Object.values(obj) an array of its values, and Object.entries(obj) an array of [key, value] pairs. Once you have an array, every loop from last week works.",
        code: {
          language: JS,
          code: 'const prices = { rice: 1200, beans: 900, oil: 2500 };\n\nconsole.log(Object.keys(prices));\n\nlet total = 0;\nfor (const p of Object.values(prices)) total += p;\nconsole.log(total);\n\nfor (const [item, price] of Object.entries(prices)) {\n  console.log(`${item}: ${price}`);\n}\n',
          expectedOutput: "[ 'rice', 'beans', 'oil' ]\n4600\nrice: 1200\nbeans: 900\noil: 2500",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 8.4 – 8.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l28-nesting-destructuring",
    moduleId: "js-w8-objects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.4", "8.5", "8.6"],
    title: "Nesting, Destructuring and Spread",
    subtitle: "Real data is shaped like this",
    estimatedMinutes: 17,
    intro:
      "Real data is never flat. A student has an address, which has a city. A class is a list of students. This lesson is about data shaped like that, and the modern syntax that makes it pleasant to work with.",

    atoms: [
      {
        id: "a-js-nested-objects",
        title: "Nested objects and arrays inside objects",
        explain:
          "A property's value can be another object or an array. To reach inside, chain the steps: student.address.city goes into the address object and reads its city. student.scores[0] goes into the scores array and reads its first element. Read the chain left to right, one step at a time.",
        code: {
          language: JS,
          code: 'const student = {\n  name: "Ada",\n  scores: [72, 81],\n  address: { city: "Lagos", state: "Lagos" },\n};\n\nconsole.log(student.address.city);\nconsole.log(student.scores[1]);\nconsole.log(student.scores.length);\nconsole.log(student);\n',
          expectedOutput: "Lagos\n81\n2\n{\n  name: 'Ada',\n  scores: [ 72, 81 ],\n  address: { city: 'Lagos', state: 'Lagos' }\n}",
        },
        mistake:
          "Reading a property of something that does not exist: student.guardian.phone, when there is no guardian, throws a TypeError, because undefined has no properties. Optional chaining, student.guardian?.phone, gives undefined instead of crashing.",
      },
      {
        id: "a-js-array-of-objects",
        title: "Arrays of objects",
        explain:
          "The most common shape of data in real applications is an array of objects: a list of students, products, messages or orders, each one an object with the same keys. Loop through the array, and inside the loop each element is one object.",
        codeExercise: {
          language: JS,
          code: 'const students = [\n  { name: "Ada", score: 72 },\n  { name: "Bisi", score: 48 },\n  { name: "Chidi", score: 91 },\n];\n\nlet best = students[0];\nfor (const s of students) {\n  if (s.score > best.score) best = s;\n}\nconsole.log(best.name);\nconsole.log(students[1].score);\nconsole.log(students.length);\n',
          question: "This finds the student with the highest score. What is printed?",
          expectedOutput: "Chidi\n48\n3",
          hint: "best holds a whole student object. It changes only when a higher score is found.",
          successMessage: "Chidi, 48, 3. Keeping the whole object as best, rather than just the score, means you still know whose score it was. That is the advantage objects give you over parallel arrays.",
        },
        why: "Every API you call in Week 12 returns data in this shape. JSON, the format of the web, is arrays of objects written as text.",
      },
      {
        id: "a-js-destructuring",
        title: "Object destructuring",
        explain:
          "Destructuring unpacks properties into variables in one line. const { name, age } = student; creates two variables, name and age, holding those properties. You can rename (const { name: fullName } = student) and give defaults (const { role = \"student\" } = user). It works in function parameters too.",
        code: {
          language: JS,
          code: 'const user = { name: "Kemi", age: 22, city: "Abuja" };\n\nconst { name, city } = user;\nconsole.log(name, city);\n\nconst { name: fullName, role = "student" } = user;\nconsole.log(fullName, role);\n\nfunction label({ name, age }) {\n  return `${name} (${age})`;\n}\nconsole.log(label(user));\n',
          expectedOutput: "Kemi Abuja\nKemi student\nKemi (22)",
        },
        why: "Destructuring in parameters is everywhere in modern code, and especially in React in Week 15, where every component receives its inputs as one object and destructures the ones it needs.",
      },
      {
        id: "a-js-spread",
        title: "Spread: copying and combining",
        explain:
          "The spread syntax, three dots, expands an array or object in place. [...a, ...b] builds a new array from the elements of both. { ...obj, key: value } builds a new object with all of obj's properties, then overrides one. Both make COPIES: the originals are untouched.",
        codeExercise: {
          language: JS,
          code: 'const original = { name: "Ada", score: 72 };\nconst updated = { ...original, score: 85 };\n\nconsole.log(original.score);\nconsole.log(updated.score);\n\nconst a = [1, 2];\nconst b = [...a, 3, ...a];\nconsole.log(b);\nconsole.log(a.length);\n',
          question: "Spread copies. What is printed?",
          expectedOutput: "72\n85\n[ 1, 2, 3, 1, 2 ]\n2",
          hint: "updated is a new object; original is not changed. b is built from a's elements, then 3, then a's elements again.",
          successMessage:
            "72, 85, the combined array, and 2. Updating by copying, rather than changing in place, is the core habit of React state in Week 15, which is why it is worth getting comfortable with now.",
        },
      },
      {
        id: "a-js-rest",
        title: "Rest: collecting what is left",
        explain:
          "The same three dots, used where variables are being created, collect the remaining items instead of expanding them. That is called rest. In a function's parameters, ...numbers collects every argument into an array. In destructuring, ...rest collects every property you did not name.",
        code: {
          language: JS,
          code: 'function total(...prices) {\n  let sum = 0;\n  for (const p of prices) sum += p;\n  return sum;\n}\nconsole.log(total(500, 1200, 300));\nconsole.log(total());\n\nconst { password, ...safeUser } = { name: "Ada", email: "ada@memora.ng", password: "x9!" };\nconsole.log(safeUser);\n',
          expectedOutput: "2000\n0\n{ name: 'Ada', email: 'ada@memora.ng' }",
        },
        why: "The last example is a real security habit: before sending a user object anywhere, pull the password out with destructuring and send only the rest.",
        table: {
          caption: "Same dots, opposite jobs.",
          headers: ["Where the dots appear", "Name", "What it does"],
          rows: [
            ["In a value: [...a] or { ...obj }", "Spread", "Expands into separate items"],
            ["Where variables are made: (...args) or { a, ...rest }", "Rest", "Collects items into one array or object"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 8.7 – 8.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l29-array-methods",
    moduleId: "js-w8-objects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.7", "8.8"],
    title: "Array Methods That Return Something",
    subtitle: "forEach, map, filter, find and reduce, by what each gives back",
    estimatedMinutes: 18,
    intro:
      "These five methods replace most of the loops you wrote last week. Each takes a callback, from Week 6, and calls it once per element. The way to learn them is not their names but what each RETURNS: nothing, a new array of the same length, a shorter array, one element, or one value.",

    atoms: [
      {
        id: "a-js-foreach",
        title: "forEach(): do something with each, return nothing",
        explain:
          "forEach calls your callback once for every element, passing the element (and its index as a second argument if you want it). It returns undefined, always. Use it when you want an effect, such as printing, and not a new value.",
        code: {
          language: JS,
          code: 'const names = ["Ada", "Bisi", "Chidi"];\nnames.forEach((name, i) => {\n  console.log(`${i + 1}. ${name}`);\n});\n\nconst result = names.forEach((n) => n.toUpperCase());\nconsole.log(result);\n',
          expectedOutput: "1. Ada\n2. Bisi\n3. Chidi\nundefined",
        },
        mistake:
          "Using forEach to build a new array and expecting it to return one. It never returns anything useful. If you want a transformed array, that is map.",
      },
      {
        id: "a-js-map",
        title: "map(): a new array, the same length",
        explain:
          "map calls your callback on every element and collects what the callback RETURNS into a new array of exactly the same length. The original is untouched. Use it whenever every item must be turned into something else: prices with VAT, names in capitals, objects into strings.",
        codeExercise: {
          language: JS,
          code: 'const prices = [1000, 2000, 400];\nconst withVat = prices.map((p) => p * 1.075);\nconsole.log(withVat);\n\nconst students = [{ name: "Ada", score: 72 }, { name: "Bisi", score: 48 }];\nconst labels = students.map((s) => `${s.name}: ${s.score >= 50 ? "pass" : "fail"}`);\nconsole.log(labels);\nconsole.log(prices);\n',
          question: "map returns a NEW array built from what the callback returns. What is printed?",
          expectedOutput: "[ 1075, 2150, 430 ]\n[ 'Ada: pass', 'Bisi: fail' ]\n[ 1000, 2000, 400 ]",
          hint: "Each price is multiplied by 1.075. Each student becomes a string. And the original prices array is never changed.",
          successMessage: "Three elements in, three elements out, every time. If your callback forgets to return, map still gives the same length, filled with undefined.",
        },
      },
      {
        id: "a-js-filter",
        title: "filter(): a new array of the ones that pass",
        explain:
          "filter calls your callback on every element and keeps only the elements for which the callback returns something truthy. It returns a new array, which may be shorter, or empty, but never longer. The elements themselves are unchanged; it only decides which ones stay.",
        code: {
          language: JS,
          code: 'const scores = [72, 48, 91, 55, 30];\nconst passed = scores.filter((s) => s >= 50);\nconsole.log(passed);\nconsole.log(passed.length);\n\nconst products = [\n  { name: "Rice", inStock: true },\n  { name: "Oil", inStock: false },\n  { name: "Salt", inStock: true },\n];\nconsole.log(products.filter((p) => p.inStock).map((p) => p.name));\n',
          expectedOutput: "[ 72, 91, 55 ]\n3\n[ 'Rice', 'Salt' ]",
        },
        why: "The last line chains two methods: filter keeps the products in stock, then map turns each remaining product into its name. Because each method returns a new array, they chain naturally, and the line reads like the requirement.",
      },
      {
        id: "a-js-find",
        title: "find(): the first match, or undefined",
        explain:
          "find returns the FIRST element for which the callback returns truthy, and stops looking. It returns the element itself, not an array. If nothing matches it returns undefined, so always handle that case before using the result.",
        code: {
          language: JS,
          code: 'const users = [\n  { id: 1, name: "Ada" },\n  { id: 2, name: "Bisi" },\n  { id: 3, name: "Chidi" },\n];\n\nconst found = users.find((u) => u.id === 2);\nconsole.log(found);\n\nconst missing = users.find((u) => u.id === 9);\nconsole.log(missing);\nconsole.log(missing ? missing.name : "No such user");\n',
          expectedOutput: "{ id: 2, name: 'Bisi' }\nundefined\nNo such user",
        },
        table: {
          caption: "filter or find?",
          headers: ["", "filter", "find"],
          rows: [
            ["Returns", "An array of every match", "The first matching element"],
            ["No match", "[] (an empty array)", "undefined"],
            ["Use when", "You want all of them", "You want one, e.g. by id"],
          ],
        },
      },
      {
        id: "a-js-reduce",
        title: "reduce(): many values into one",
        explain:
          "reduce walks the array carrying a running result, called the accumulator. Your callback receives the accumulator and the current element, and returns the new accumulator. The second argument to reduce is the starting value. What comes out at the end is a single value: a total, a count, a maximum, even an object.",
        codeExercise: {
          language: JS,
          code: 'const cart = [\n  { item: "Rice", price: 1200, qty: 2 },\n  { item: "Oil", price: 2500, qty: 1 },\n  { item: "Salt", price: 300, qty: 3 },\n];\n\nconst total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);\nconsole.log(total);\n\nconst count = cart.reduce((n, line) => n + line.qty, 0);\nconsole.log(count);\n',
          question: "Trace the accumulator through each line of the cart. What is printed?",
          expectedOutput: "5800\n6",
          hint: "Start at 0. Add 1200 × 2, then 2500 × 1, then 300 × 3. For count, add the quantities.",
          successMessage:
            "5800 and 6. sum went 0 → 2400 → 4900 → 5800. reduce is a loop with a running total, written as one expression. Always pass the starting value; without it, reduce on an empty array throws.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 8.9 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l30-choosing-structures",
    moduleId: "js-w8-objects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.9", "8.10"],
    title: "Testing, Sorting and Choosing the Right Structure",
    subtitle: "some, every, sort, Set and Map",
    estimatedMinutes: 18,
    intro:
      "Three more array methods, one of which has the most surprising default behaviour in the language. Then two more data structures, Set and Map, and the question this whole week has been building to: which structure fits the problem?",

    atoms: [
      {
        id: "a-js-some-every",
        title: "some() and every(): yes-or-no questions",
        explain:
          "some returns true if the callback returns truthy for AT LEAST ONE element. every returns true only if it returns truthy for ALL of them. Both return a boolean, and both stop as soon as the answer is known. They are || and && applied across a whole array.",
        code: {
          language: JS,
          code: "const scores = [72, 48, 91];\nconsole.log(scores.some((s) => s < 50));\nconsole.log(scores.every((s) => s >= 50));\nconsole.log(scores.every((s) => s > 0));\nconsole.log([].every((s) => s > 1000));\n",
          expectedOutput: "true\nfalse\ntrue\ntrue",
        },
        why: "The last line surprises people: every on an empty array is true, because there is no element that fails. Mathematicians call this vacuous truth. If an empty list should count as a failure, check the length first.",
      },
      {
        id: "a-js-sort",
        title: "sort(), and its trap",
        explain:
          "sort arranges an array in place, changing the original, and also returns it. With no callback, it converts every element to a STRING and sorts alphabetically, which puts 10 before 2. For numbers, always pass a compare function: (a, b) => a - b sorts ascending and (a, b) => b - a sorts descending.",
        codeExercise: {
          language: JS,
          code: 'console.log([10, 1, 25, 2].sort());\nconsole.log([10, 1, 25, 2].sort((a, b) => a - b));\nconsole.log([10, 1, 25, 2].sort((a, b) => b - a));\nconsole.log(["Chidi", "ada", "Bisi"].sort());\n',
          question: "Remember what sort does with no compare function. What is printed?",
          expectedOutput: "[ 1, 10, 2, 25 ]\n[ 1, 2, 10, 25 ]\n[ 25, 10, 2, 1 ]\n[ 'Bisi', 'Chidi', 'ada' ]",
          hint: "With no callback, numbers are compared as text, character by character, so \"10\" comes before \"2\". Capital letters sort before lower-case ones.",
          successMessage:
            "Including both traps: numbers sorted as text, and \"ada\" last because lower-case letters come after capitals. For names, use (a, b) => a.localeCompare(b).",
        },
        mistake:
          "Sorting an array that something else is still using. Because sort changes the original, sort a copy when the original order matters: [...scores].sort((a, b) => a - b).",
      },
      {
        id: "a-js-set",
        title: "Set: values with no duplicates",
        explain:
          "A Set is a collection where each value can appear only once. Adding a value that is already there does nothing. has() checks membership very quickly, and size gives the count. Spread a Set into an array to get a list of unique values in one line, replacing last week's loop.",
        code: {
          language: JS,
          code: 'const tags = new Set(["js", "web", "js", "react", "web"]);\nconsole.log(tags);\nconsole.log(tags.size);\nconsole.log(tags.has("react"));\n\ntags.add("js");\nconsole.log(tags.size);\n\nconst unique = [...new Set([3, 1, 3, 2, 1])];\nconsole.log(unique);\n',
          expectedOutput: "Set(3) { 'js', 'web', 'react' }\n3\ntrue\n3\n[ 3, 1, 2 ]",
        },
      },
      {
        id: "a-js-map-structure",
        title: "Map: looking things up by key",
        explain:
          "A Map stores key-value pairs, like an object, but is designed for lookups that change while the program runs. Its keys can be any type, it remembers insertion order, it has a size, and it has clear methods: set, get, has and delete. Use a Map when you are building a lookup table from data; use an object to describe one thing.",
        codeExercise: {
          language: JS,
          code: 'const words = "the cat and the hat and the bat".split(" ");\nconst counts = new Map();\nfor (const w of words) {\n  counts.set(w, (counts.get(w) || 0) + 1);\n}\nconsole.log(counts.get("the"));\nconsole.log(counts.get("and"));\nconsole.log(counts.size);\nconsole.log(counts.has("dog"));\n',
          question: "The Map counts how many times each word appears. What is printed?",
          expectedOutput: "3\n2\n5\nfalse",
          hint: "counts.get(w) is undefined the first time a word is seen, so || 0 starts it at 0. Count the distinct words for size.",
          successMessage: "3, 2, 5, false. A Map from item to count is one of the most useful patterns in programming: word frequencies, votes, page views, stock levels.",
        },
      },
      {
        id: "a-js-choose-structure",
        title: "Choosing the right data structure",
        explain:
          "Ask what you need to DO with the data. Keep things in order and visit them in turn: array. Describe one thing's details: object. Guarantee no duplicates or check membership quickly: Set. Look items up by a key that comes from the data: Map. Most real programs combine them, such as an array of objects, or a Map from id to object.",
        decision: {
          scenario:
            "You are building the student records manager. You need to store each student's name, scores and class; look a student up instantly by their matriculation number; and list every student in the order they enrolled.",
          question: "Which design fits best?",
          options: [
            {
              id: "a",
              text: "A Map from matriculation number to a student object, each object holding name, scores (an array) and class",
              why: "Each structure does the job it is good at. The object describes one student, the scores array keeps their results in order, and the Map gives an instant lookup by number while also remembering enrolment order.",
            },
            {
              id: "b",
              text: "One long array: [name1, scores1, class1, name2, scores2, class2, …]",
              whyWrong: "Positions carry the meaning, so every read needs arithmetic like index * 3 + 1, and one missing value shifts everything after it.",
            },
            {
              id: "c",
              text: "A Set of student names",
              whyWrong: "A Set can only say whether a name is present. It cannot hold each student's scores or class, and two students may share a name.",
            },
            {
              id: "d",
              text: "Separate arrays for names, scores and classes, matched by index",
              whyWrong: "Parallel arrays work until one is sorted or filtered without the others, and then every student is paired with the wrong scores. Keep each student's data together in one object.",
            },
          ],
          correct: "a",
          aftermath: "When choosing, say out loud the operations you need: \"find by number\", \"list in order\", \"no duplicates\". Each one points to a structure.",
        },
      },
    ],

    task: {
      title: "Mini-project: student records manager",
      intro:
        "Build records.js to store, search, filter and summarise student results. Use an array of student objects, and the array methods from this week rather than hand-written for loops wherever one fits.",
      prompts: [
        "Store at least six students, each an object with id, name, className and scores (an array of numbers).",
        "Write findById(id) with find, and studentsInClass(className) with filter. Both must handle the not-found case clearly.",
        "Write averageOf(student) with reduce, then use map to produce a summary list of \"Name: average\" strings, formatted to one decimal place.",
        "Use some and every to answer: did anyone score below 40 in any subject? Did everyone in a chosen class pass?",
        "Produce a ranking with sort on a COPY of the array, highest average first, and show that the original order is unchanged. Then use a Set to list the distinct class names.",
      ],
      closing:
        "You will come back to this file twice: in Week 9 to refactor and debug it, and in Week 13 to rebuild it with classes. Write it so you will not mind reading it again.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
