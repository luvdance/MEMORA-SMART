/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 17 · ARRAYS AND OBJECTS
 *
 * Curriculum 17.1 – 17.15. Arrays and their everyday methods, map, filter,
 * reduce, find, some and every; objects, properties and methods, dot and
 * bracket notation, nesting, arrays of objects, destructuring, spread and
 * rest, and the difference between references and primitive values.
 * Nearly every web application is an array of objects rendered on a page,
 * so this is the data model Phase 4 is built on.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s17-arrays-objects";

const JS = "javascript";

const PRODUCTS = `const products = [
  { name: "Rice, 5kg", price: 9500, category: "food", stock: 12 },
  { name: "Palm oil, 1L", price: 2800, category: "food", stock: 0 },
  { name: "Phone charger", price: 4500, category: "electronics", stock: 7 },
  { name: "Earbuds", price: 12000, category: "electronics", stock: 3 },
  { name: "Sugar, 1kg", price: 1500, category: "food", stock: 25 },
];
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 17.1 – 17.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l71-arrays",
    moduleId: "wd-m17-arrays-objects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2", "17.3", "17.4"],
    title: "Arrays",
    subtitle: "Ordered lists of values: reading, changing and counting them",
    estimatedMinutes: 24,
    intro: "A shopping list, the scores in a class, the messages in a chat: programs constantly deal with lists. In JavaScript a list is an array.",

    atoms: [
      {
        id: "a-wd-what-arrays",
        title: "What arrays are",
        explain:
          "An array is an ordered list of values in square brackets: const scores = [72, 45, 88];. It can hold any type, even a mix, but in practice each array holds one kind of thing. Arrays are objects, so typeof says \"object\"; use Array.isArray(value) to check for one. Declaring an array with const stops the variable being reassigned, but the array's contents can still change.",
        example: "const fruits = [\"mango\", \"pawpaw\", \"orange\"];\nconst empty = [];\nconsole.log(Array.isArray(fruits));   // true\nconsole.log(typeof fruits);           // object",
      },
      {
        id: "a-wd-indexing",
        title: "Indexing and accessing elements",
        explain:
          "Each element has a position called its index, counted from 0: in [\"mango\", \"pawpaw\", \"orange\"], mango is at 0 and orange at 2. Read one with square brackets: fruits[1]. Reading an index that does not exist gives undefined, not an error. at(-1) reads from the end: fruits.at(-1) is the last element.",
        codeExercise: {
          language: JS,
          code: 'const fruits = ["mango", "pawpaw", "orange"];\nconsole.log(fruits[0]);\nconsole.log(fruits[2]);\nconsole.log(fruits[3]);\nconsole.log(fruits.at(-1));\n',
          question: "What does each line print?",
          expectedOutput: "mango\norange\nundefined\norange",
          hint: "Indexes start at 0. There is no element at index 3.",
          successMessage: "Zero-based indexing, undefined for a missing index, and at(-1) for the last element.",
        },
      },
      {
        id: "a-wd-array-changes",
        title: "Adding, removing and updating elements",
        explain:
          "push adds to the end and pop removes from the end; unshift adds to the start and shift removes from the start. Assigning to an index replaces that element: list[1] = \"guava\". splice(start, count) removes count elements from start (and can insert others). includes(value) and indexOf(value) find things. These methods change the array itself.",
        table: {
          caption: "Changing an array.",
          headers: ["Method", "Does", "Returns"],
          rows: [
            ["push(x)", "Adds x to the end", "The new length"],
            ["pop()", "Removes the last element", "That element"],
            ["unshift(x)", "Adds x to the start", "The new length"],
            ["shift()", "Removes the first element", "That element"],
            ["splice(i, n)", "Removes n elements from index i", "An array of the removed elements"],
            ["includes(x)", "Nothing", "true if x is in the array"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'const queue = ["Ada", "Bayo"];\nqueue.push("Chika");\nqueue.unshift("Dapo");\nconst served = queue.shift();\nqueue[1] = "Bisi";\nconsole.log(served);\nconsole.log(queue);\n',
          question: "What is printed?",
          expectedOutput: "Dapo\n[ 'Ada', 'Bisi', 'Chika' ]",
          hint: "After push and unshift the queue is Dapo, Ada, Bayo, Chika.",
          successMessage: "Dapo joined at the front and was served first; then Bayo at index 1 was replaced by Bisi.",
        },
      },
      {
        id: "a-wd-length",
        title: "Array length",
        explain:
          "length is the number of elements. The last element is always at index length - 1, which is why loops over an array use i < array.length. An empty array has length 0, which is falsy, so if (items.length) means \"if there is anything in it\".",
        webLab: {
          task:
            "Write the functions for a bank queue stored in an array. join(queue, name) adds a customer to the end and returns the new queue length. serve(queue) removes and returns the first customer, or returns null if the queue is empty. last(queue) returns the last customer without changing the queue (or undefined if empty). isWaiting(queue, name) returns whether that name is in the queue.",
          files: { "app.js": "function join(queue, name) {\n}\n\nfunction serve(queue) {\n}\n\nfunction last(queue) {\n}\n\nfunction isWaiting(queue, name) {\n}\n" },
          tests: [
            { label: "join adds to the end and returns the new length", check: "const q = ['Ada']; const n = join(q, 'Bayo'); return n === 2 && q[1] === 'Bayo';", fail: "Use queue.push(name), which returns the new length." },
            { label: "serve removes and returns the first customer", check: "const q = ['Ada', 'Bayo']; return serve(q) === 'Ada' && q.length === 1 && q[0] === 'Bayo';", fail: "Use queue.shift()." },
            { label: "serve returns null for an empty queue", check: "return serve([]) === null;", fail: "Check queue.length first and return null if it is 0." },
            { label: "last returns the last customer without changing the queue", check: "const q = ['Ada', 'Bayo', 'Chika']; return last(q) === 'Chika' && q.length === 3 && last([]) === undefined;", fail: "Return queue[queue.length - 1] (or queue.at(-1)); do not pop." },
            { label: "isWaiting finds a name", check: "return isWaiting(['Ada', 'Bayo'], 'Bayo') === true && isWaiting(['Ada'], 'Zainab') === false;", fail: "Return queue.includes(name)." },
          ],
          solution: { "app.js": "function join(queue, name) {\n  return queue.push(name);\n}\n\nfunction serve(queue) {\n  if (queue.length === 0) return null;\n  return queue.shift();\n}\n\nfunction last(queue) {\n  return queue[queue.length - 1];\n}\n\nfunction isWaiting(queue, name) {\n  return queue.includes(name);\n}\n" },
          hint: "Each function is one or two lines using one array method from the table.",
          successMessage: "A working queue: first in, first served, with safe handling of an empty queue.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 17.5 – 17.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l72-array-methods",
    moduleId: "wd-m17-arrays-objects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.5", "17.6", "17.7"],
    title: "Iterating, map, filter, reduce, find, some and every",
    subtitle: "Asking questions of a whole list in one line",
    estimatedMinutes: 26,
    intro: "Writing a loop every time you need the total, the expensive ones or the first match gets tedious. Arrays have methods that take a callback and do these jobs for you, and they are how most array code in real projects is written.",

    atoms: [
      {
        id: "a-wd-iterate-arrays",
        title: "Iterating over arrays",
        explain:
          "Three ways to visit every element. for (let i = 0; i < arr.length; i++) gives you the index. for (const item of arr) gives you each element, and reads best. arr.forEach((item, index) => { … }) calls a callback for each. Use for...of by default, and a classic for when you need the index or to stop early.",
        codeExercise: {
          language: JS,
          code: 'const names = ["Ada", "Bayo", "Chika"];\nfor (const name of names) {\n  console.log("Hi " + name);\n}\nnames.forEach((name, i) => console.log(i + ": " + name));\n',
          question: "What does each loop print?",
          expectedOutput: "Hi Ada\nHi Bayo\nHi Chika\n0: Ada\n1: Bayo\n2: Chika",
          hint: "forEach passes each element and its index to the callback.",
          successMessage: "for...of for the elements, forEach when you also want the index.",
        },
      },
      {
        id: "a-wd-map-filter-reduce",
        title: "map(), filter() and reduce()",
        explain:
          "map(fn) returns a NEW array of the same length, with fn applied to each element: prices to prices with VAT, products to their names. filter(fn) returns a new array of only the elements for which fn returns true: products in stock. reduce(fn, start) combines all elements into one value: (total, item) => total + item.price, starting from 0, gives the sum. None of the three changes the original array.",
        codeExercise: {
          language: JS,
          code: PRODUCTS + '\nconst names = products.map((p) => p.name);\nconst inStock = products.filter((p) => p.stock > 0);\nconst value = products.reduce((sum, p) => sum + p.price * p.stock, 0);\nconsole.log(names.length, inStock.length);\nconsole.log(value);\n',
          question: "How many names, how many products in stock, and what is the total stock value?",
          expectedOutput: "5 4\n219000",
          hint: "One product has stock 0. For the value: 9500×12 + 2800×0 + 4500×7 + 12000×3 + 1500×25.",
          successMessage: "114000 + 0 + 31500 + 36000 + 37500 = 219000. Three methods, three questions, no loop written by hand.",
        },
      },
      {
        id: "a-wd-find-some-every",
        title: "find(), some() and every()",
        explain:
          "find(fn) returns the FIRST element for which fn is true, or undefined: the product called Earbuds. findIndex does the same but returns its position. some(fn) answers \"is it true for at least one?\" and every(fn) \"is it true for all?\", both as booleans, stopping as soon as the answer is known.",
        webLab: {
          task:
            "The products array is given. Write five functions, each using the right array method and no for loop: productNames() with map, available() with filter (stock above 0), stockValue() with reduce (price × stock, summed), findProduct(name) with find, and anySoldOut() with some.",
          files: { "app.js": PRODUCTS + "\nfunction productNames() {\n}\n\nfunction available() {\n}\n\nfunction stockValue() {\n}\n\nfunction findProduct(name) {\n}\n\nfunction anySoldOut() {\n}\n" },
          tests: [
            { label: "productNames() returns the five names, in order", check: "const n = productNames(); return Array.isArray(n) && n.length === 5 && n[0] === 'Rice, 5kg' && n[4] === 'Sugar, 1kg';", fail: "return products.map((p) => p.name);" },
            { label: "available() returns the four products in stock", check: "const a = available(); return a.length === 4 && a.every((p) => p.stock > 0);", fail: "return products.filter((p) => p.stock > 0);" },
            { label: "stockValue() is 219000", check: "return stockValue() === 219000;", fail: "return products.reduce((sum, p) => sum + p.price * p.stock, 0);" },
            { label: "findProduct finds one product, or undefined", check: "return findProduct('Earbuds')?.price === 12000 && findProduct('Bread') === undefined;", fail: "return products.find((p) => p.name === name);" },
            { label: "anySoldOut() is true", check: "return anySoldOut() === true;", fail: "return products.some((p) => p.stock === 0);" },
            { label: "No for loops: each uses an array method", check: "const c = code('app.js'); return !/for\\s*\\(/.test(c) && ['.map(', '.filter(', '.reduce(', '.find(', '.some('].every((m) => c.includes(m));", fail: "Use map, filter, reduce, find and some, one per function." },
            { label: "The original products array is unchanged", check: "productNames(); available(); return products.length === 5 && products[1].stock === 0;", fail: "These methods return new values; nothing should change products." },
          ],
          solution: { "app.js": PRODUCTS + "\nfunction productNames() {\n  return products.map((p) => p.name);\n}\n\nfunction available() {\n  return products.filter((p) => p.stock > 0);\n}\n\nfunction stockValue() {\n  return products.reduce((sum, p) => sum + p.price * p.stock, 0);\n}\n\nfunction findProduct(name) {\n  return products.find((p) => p.name === name);\n}\n\nfunction anySoldOut() {\n  return products.some((p) => p.stock === 0);\n}\n" },
          hint: "Each method takes an arrow function that receives one product, p. reduce also takes a starting value, 0.",
          successMessage: "Five questions about the data, five one-line answers. This is how real front-end code filters a catalogue, totals a basket and finds an item.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 17.8 – 17.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l73-objects",
    moduleId: "wd-m17-arrays-objects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.8", "17.9", "17.10"],
    title: "Objects, Properties and Methods",
    subtitle: "Grouping the facts about one thing under names",
    estimatedMinutes: 24,
    intro: "An array is a list of things. An object describes ONE thing: a student, a product, an order, with each fact under a name. Together, arrays of objects are how nearly all application data is shaped.",

    atoms: [
      {
        id: "a-wd-what-objects",
        title: "What objects are",
        explain:
          "An object is a collection of key: value pairs in curly braces. Each key (property name) labels a value: { name: \"Ada\", age: 16, isEnrolled: true }. Values can be anything, including arrays and other objects. Use an object when you have several facts about the same thing, rather than several separate variables.",
        example: "const student = {\n  name: \"Ada Obi\",\n  age: 16,\n  scores: [72, 85, 90],\n  isEnrolled: true,\n};",
      },
      {
        id: "a-wd-properties-methods",
        title: "Properties and methods",
        explain:
          "A property is a named value on an object. A method is a property whose value is a function, so the object can do something: student.average(). Inside a method, this refers to the object the method was called on, so this.scores reads the object's own scores. You can add, change and delete properties at any time.",
        codeExercise: {
          language: JS,
          code: "const student = {\n  name: \"Ada\",\n  scores: [70, 80, 90],\n  average() {\n    const sum = this.scores.reduce((t, s) => t + s, 0);\n    return sum / this.scores.length;\n  },\n};\nstudent.scores.push(100);\nstudent.class = \"SS2\";\nconsole.log(student.average());\nconsole.log(student.class);\n",
          question: "What is printed?",
          expectedOutput: "85\nSS2",
          hint: "A fourth score was added before average() is called.",
          successMessage: "(70 + 80 + 90 + 100) / 4 = 85. The method used this to read the object's own, updated, scores.",
        },
      },
      {
        id: "a-wd-dot-bracket",
        title: "Dot notation and bracket notation",
        explain:
          "Dot notation, student.name, is the usual way to read a property. Bracket notation, student[\"name\"], does the same with the key as a string, which you need when the key is in a variable (student[field]) or is not a valid identifier (data[\"date of birth\"]). Reading a property that does not exist gives undefined.",
        webLab: {
          task:
            "Create an object called book with the properties title (\"Things Fall Apart\"), author (\"Chinua Achebe\"), year (1958) and pages (209), and a method summary() that returns \"Things Fall Apart by Chinua Achebe (1958)\" using this. Then write getField(obj, key) that returns any property whose name is given as a string, using bracket notation.",
          files: { "app.js": "const book = {\n};\n\nfunction getField(obj, key) {\n}\n\nconsole.log(book.summary());\n" },
          tests: [
            { label: "book has title, author, year (a number) and pages", check: "return book.title === 'Things Fall Apart' && book.author === 'Chinua Achebe' && book.year === 1958 && book.pages === 209;", fail: "Add the four properties, with year and pages as numbers." },
            { label: "book.summary() returns the summary line", check: "return typeof book.summary === 'function' && book.summary() === 'Things Fall Apart by Chinua Achebe (1958)';", fail: "summary() { return this.title + \" by \" + this.author + \" (\" + this.year + \")\"; }" },
            { label: "summary uses this, so it follows changes to the object", check: "const old = book.year; book.year = 1959; const s = book.summary(); book.year = old; return s.endsWith('(1959)');", fail: "Read the values through this, not by typing them into the string." },
            { label: "getField(book, \"author\") and getField(book, \"pages\") work", check: "return getField(book, 'author') === 'Chinua Achebe' && getField(book, 'pages') === 209 && getField(book, 'isbn') === undefined;", fail: "return obj[key];" },
          ],
          solution: { "app.js": "const book = {\n  title: \"Things Fall Apart\",\n  author: \"Chinua Achebe\",\n  year: 1958,\n  pages: 209,\n  summary() {\n    return this.title + \" by \" + this.author + \" (\" + this.year + \")\";\n  },\n};\n\nfunction getField(obj, key) {\n  return obj[key];\n}\n\nconsole.log(book.summary());\n" },
          hint: "obj.key looks for a property literally called key. obj[key] uses the value of the variable key.",
          successMessage: "An object that describes a book and can describe itself. Bracket notation is how forms and tables read fields by name.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 17.11 – 17.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l74-nested-data",
    moduleId: "wd-m17-arrays-objects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["17.11", "17.12"],
    title: "Nested Objects and Arrays of Objects",
    subtitle: "Real data: lists of records, each with structure inside",
    estimatedMinutes: 24,
    intro: "Data from a real application, such as a list of orders from a server, is an array of objects, and each object often contains further objects and arrays. Reading it is just a chain of the steps you already know.",

    atoms: [
      {
        id: "a-wd-nested-objects",
        title: "Nested objects",
        explain:
          "An object's property can hold another object: order.customer.address.city. Read it left to right, one step at a time. If any step in the middle is missing, the next step throws a TypeError (Cannot read properties of undefined), which is why Module 25's optional chaining (?.) exists.",
        codeExercise: {
          language: JS,
          code: 'const order = {\n  id: 1042,\n  customer: { name: "Adaeze", address: { city: "Enugu", state: "Enugu" } },\n  items: [{ name: "Garri", qty: 2 }, { name: "Beans", qty: 1 }],\n};\nconsole.log(order.customer.address.city);\nconsole.log(order.items[1].name);\nconsole.log(order.items.length);\n',
          question: "What does each line print?",
          expectedOutput: "Enugu\nBeans\n2",
          hint: "Follow the path one step at a time: order, then customer, then address, then city.",
          successMessage: "A path into nested data is just dots and indexes, read left to right.",
        },
      },
      {
        id: "a-wd-arrays-of-objects",
        title: "Arrays of objects",
        explain:
          "An array of objects is a table: each object is a row and each property a column. All the array methods apply, with the callback receiving one whole object: orders.filter((o) => o.status === \"pending\"), orders.map((o) => o.total). Sorting uses sort with a compare function: products.sort((a, b) => a.price - b.price) sorts by price, ascending (and changes the array, so copy it first if you need the original).",
        webLab: {
          task:
            "Given an array of orders, write: pendingIds(orders), returning the ids of orders whose status is \"pending\"; totalFor(orders, city), returning the sum of totals for orders delivered to that city (customer.city); and cheapestFirst(orders), returning a NEW array sorted by total, lowest first, without changing the original.",
          files: { "app.js": 'const orders = [\n  { id: 1, status: "pending", total: 12000, customer: { name: "Ada", city: "Lagos" } },\n  { id: 2, status: "delivered", total: 4500, customer: { name: "Musa", city: "Kano" } },\n  { id: 3, status: "pending", total: 8000, customer: { name: "Kemi", city: "Lagos" } },\n  { id: 4, status: "cancelled", total: 30000, customer: { name: "Chidi", city: "Enugu" } },\n];\n\nfunction pendingIds(orders) {\n}\n\nfunction totalFor(orders, city) {\n}\n\nfunction cheapestFirst(orders) {\n}\n' },
          tests: [
            { label: "pendingIds(orders) is [1, 3]", check: "return JSON.stringify(pendingIds(orders)) === '[1,3]';", fail: "filter for status \"pending\", then map to the id." },
            { label: "totalFor(orders, \"Lagos\") is 20000; Kano is 4500; Abuja is 0", check: "return totalFor(orders, 'Lagos') === 20000 && totalFor(orders, 'Kano') === 4500 && totalFor(orders, 'Abuja') === 0;", fail: "filter by o.customer.city, then reduce the totals from 0." },
            { label: "cheapestFirst gives ids 2, 3, 1, 4", check: "return JSON.stringify(cheapestFirst(orders).map((o) => o.id)) === '[2,3,1,4]';", fail: "Sort a copy with (a, b) => a.total - b.total." },
            { label: "cheapestFirst does not change the original order", check: "cheapestFirst(orders); return orders.map((o) => o.id).join() === '1,2,3,4';", fail: "sort changes the array it is called on. Copy first: [...orders].sort(…)." },
          ],
          solution: { "app.js": 'const orders = [\n  { id: 1, status: "pending", total: 12000, customer: { name: "Ada", city: "Lagos" } },\n  { id: 2, status: "delivered", total: 4500, customer: { name: "Musa", city: "Kano" } },\n  { id: 3, status: "pending", total: 8000, customer: { name: "Kemi", city: "Lagos" } },\n  { id: 4, status: "cancelled", total: 30000, customer: { name: "Chidi", city: "Enugu" } },\n];\n\nfunction pendingIds(orders) {\n  return orders.filter((o) => o.status === "pending").map((o) => o.id);\n}\n\nfunction totalFor(orders, city) {\n  return orders\n    .filter((o) => o.customer.city === city)\n    .reduce((sum, o) => sum + o.total, 0);\n}\n\nfunction cheapestFirst(orders) {\n  return [...orders].sort((a, b) => a.total - b.total);\n}\n' },
          hint: "Array methods chain: filter returns an array, so you can call map or reduce on it straight away.",
          successMessage: "Filter, then map; filter, then reduce; copy, then sort. These chains are most of what a dashboard's JavaScript does.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 17.13 – 17.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l75-destructure-spread",
    moduleId: "wd-m17-arrays-objects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["17.13", "17.14", "17.15"],
    title: "Destructuring, Spread, Rest and References",
    subtitle: "Unpacking values, copying data, and the bug every developer meets once",
    estimatedMinutes: 26,
    intro: "Modern JavaScript has compact syntax for unpacking and copying data, and one rule about objects and arrays that explains a whole category of mysterious bugs.",

    atoms: [
      {
        id: "a-wd-destructuring",
        title: "Destructuring",
        explain:
          "Destructuring unpacks values into variables in one line. From an object, by name: const { name, price } = product;. From an array, by position: const [first, second] = scores;. You can rename (const { name: title } = book), give defaults (const { qty = 1 } = item) and destructure parameters: function show({ name, price }) { … }.",
        codeExercise: {
          language: JS,
          code: 'const product = { name: "Earbuds", price: 12000 };\nconst { name, price, stock = 0 } = product;\nconst [gold, silver] = ["Amaka", "Tunde", "Zara"];\nconsole.log(name, price, stock);\nconsole.log(gold, silver);\n',
          question: "What is printed?",
          expectedOutput: "Earbuds 12000 0\nAmaka Tunde",
          hint: "product has no stock property, so its default is used. Array destructuring takes elements by position.",
          successMessage: "Names from objects, positions from arrays, and defaults for anything missing.",
        },
      },
      {
        id: "a-wd-spread-rest",
        title: "Spread and rest syntax",
        explain:
          "The same three dots do two opposite jobs. Spread expands: [...a, ...b] joins arrays, { ...product, price: 9000 } copies an object and overrides one property, Math.max(...scores) passes an array as separate arguments. Rest collects: function sum(...numbers) gathers any number of arguments into an array, and const { id, ...rest } = order collects the remaining properties.",
        codeExercise: {
          language: JS,
          code: "const sum = (...numbers) => numbers.reduce((t, n) => t + n, 0);\nconst a = [1, 2];\nconst b = [3, 4];\nconst item = { name: \"Rice\", price: 9500 };\nconst discounted = { ...item, price: 8500 };\nconsole.log(sum(...a, ...b));\nconsole.log(item.price, discounted.price);\n",
          question: "What is printed?",
          expectedOutput: "10\n9500 8500",
          hint: "The spread copy has its own price; the original is untouched.",
          successMessage: "Rest gathered four arguments into numbers; spread copied item into a new object with one change.",
        },
      },
      {
        id: "a-wd-references",
        title: "Reference versus primitive values",
        explain:
          "Primitives (numbers, strings, booleans) are copied when assigned: let b = a; b++ leaves a alone. Objects and arrays are not copied: a variable holds a REFERENCE to them, so const b = a makes two names for the same array, and changing b changes a. Comparing with === compares references, so two separate but identical objects are not ===. To copy, use spread: [...a] or { ...obj } (a shallow copy: nested objects inside are still shared).",
        webLab: {
          task:
            "Fix and finish three functions so none of them changes data it was given. addItem(cart, item) must return a NEW cart array with the item added (it currently pushes into the original). updatePrice(product, price) must return a NEW product with the new price (it currently changes the original). total(...prices) must accept any number of prices using rest syntax and return their sum.",
          files: { "app.js": "function addItem(cart, item) {\n  const newCart = cart;\n  newCart.push(item);\n  return newCart;\n}\n\nfunction updatePrice(product, price) {\n  product.price = price;\n  return product;\n}\n\nfunction total(prices) {\n}\n" },
          tests: [
            { label: "addItem returns a cart with the item added", check: "const c = addItem(['rice'], 'beans'); return JSON.stringify(c) === '[\"rice\",\"beans\"]';", fail: "Return [...cart, item]." },
            { label: "addItem leaves the original cart alone", check: "const cart = ['rice']; const next = addItem(cart, 'beans'); return cart.length === 1 && next !== cart;", fail: "const newCart = cart copies the reference, not the array. Use spread to make a real copy." },
            { label: "updatePrice returns the product with the new price", check: "const p = updatePrice({ name: 'Rice', price: 9500 }, 8500); return p.name === 'Rice' && p.price === 8500;", fail: "Return { ...product, price }." },
            { label: "updatePrice leaves the original product alone", check: "const orig = { name: 'Rice', price: 9500 }; const next = updatePrice(orig, 8500); return orig.price === 9500 && next !== orig;", fail: "Assigning product.price changes the object the caller passed in. Build a new one with spread." },
            { label: "total accepts any number of prices with ...rest", check: "return total(100, 200, 300) === 600 && total() === 0 && total(5) === 5 && /\\(\\s*\\.\\.\\.\\w+/.test(code('app.js'));", fail: "function total(...prices) { return prices.reduce((t, p) => t + p, 0); }" },
          ],
          solution: { "app.js": "function addItem(cart, item) {\n  return [...cart, item];\n}\n\nfunction updatePrice(product, price) {\n  return { ...product, price };\n}\n\nfunction total(...prices) {\n  return prices.reduce((t, p) => t + p, 0);\n}\n" },
          hint: "{ ...product, price } is short for { ...product, price: price }: copy everything, then override price.",
          successMessage: "Copies, not references. Updating data by making new arrays and objects is exactly how state is updated in modern front-end code, including React in WD-201.",
        },
      },
    ],

    task: {
      title: "Module project: a product inventory",
      intro: "Build inventory.js with an array of at least eight product objects (name, price, category, stock, supplier: { name, city }).",
      prompts: [
        "Write inStock, byCategory(category), search(text) (case-insensitive name match) and totalValue, using filter, map and reduce.",
        "Write cheapest and mostExpensive without changing the original array.",
        "Write restock(products, name, amount) that returns a NEW array in which only that product's stock has increased.",
        "Write suppliersIn(city) using the nested supplier object.",
        "Print a small report with each function's result, and confirm the original array is unchanged at the end.",
      ],
      closing: "Next module: strings, numbers and errors in detail.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
