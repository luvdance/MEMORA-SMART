/**
 * MOBILE APP DEVELOPMENT · MODULE 3 · JAVASCRIPT FUNDAMENTALS
 *
 * Curriculum 3.1 – 3.P. JavaScript from zero, for people who have never
 * programmed: values and types, operators and conditions, loops and
 * functions, scope and errors, arrays and objects, destructuring, spread
 * and template literals, modules and error handling.
 *
 * Two kinds of practice. "What does this print?" exercises are run in Node
 * by the validator, so every stated output is what JavaScript really prints.
 * Phone labs give each lesson's ideas a real app: the screen is provided,
 * and the learner writes the plain JavaScript (src/lib/*.js) it shows. React
 * Native itself starts in Module 7.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s3-javascript";
const MODULE = "md-m3-javascript";
const JS = "javascript";

/** A screen that shows rows of label: value, read from a module's exports. Given, read-only. */
const rowsScreen = (title, importLine, rows) => `import { ScrollView, StyleSheet, Text, View } from "react-native";
${importLine}

const rows = [
${rows.map(([label, expr]) => `  ["${label}", ${expr}],`).join("\n")}
];

export default function Screen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>${title}</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{String(value)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderRadius: 10, backgroundColor: "#f1f5f4" },
  label: { color: "#475569" },
  value: { fontWeight: "600" },
});
`;

const layout = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 3.1 – 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l6-values",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3"],
    title: "Values, Variables and Types",
    subtitle: "let and const, the kinds of value, and converting between them",
    estimatedMinutes: 40,
    intro:
      "A program is instructions that work with values: a name, a price, whether the user is signed in. This lesson is about those values, how you give them names, and the surprises when they are of the wrong kind.",

    atoms: [
      {
        id: "a-md-let-const",
        title: "Variables: let and const",
        explain:
          "A VARIABLE is a name for a value. const price = 1500; creates a name, price, for the number 1500, and it can never point at another value. let count = 0; creates a name that CAN change later: count = count + 1. Use const by default and let only when the value really changes; you will avoid a whole class of bugs. (You may see the old var in tutorials; do not use it.) Names are case-sensitive (total and Total are different), cannot start with a digit, and by convention are written in camelCase: firstName, cartTotal. console.log(x) prints a value, which is how you look inside a running program.",
        codeExercise: {
          language: JS,
          code: 'const shop = "Mama Put";\nlet orders = 2;\norders = orders + 3;\nconsole.log(shop, orders);\nlet greeting = "Hello";\ngreeting = greeting + ", Ada";\nconsole.log(greeting);\n',
          question: "What does this print?",
          expectedOutput: "Mama Put 5\nHello, Ada",
          hint: "orders starts at 2 and is changed once. + joins two pieces of text.",
          successMessage: "const for values that never change, let for values that do.",
        },
      },
      {
        id: "a-md-types-conversion",
        title: "Data types and type conversion",
        explain:
          "Every value has a TYPE. The basic ones: string (text, in quotes: \"Ada\"), number (42, 3.5, -7), boolean (true or false), null (deliberately empty), undefined (never given a value). typeof tells you the type. The trap for app developers: whatever a user types into a text field is a STRING, even \"42\". And + with a string JOINS instead of adding: \"5\" + 2 is \"52\". Convert explicitly: Number(\"42\") is 42, Number(\"abc\") is NaN (\"not a number\"), String(42) is \"42\", parseInt(\"12px\") is 12. Other operators convert automatically (\"6\" * 2 is 12), which is why bugs only appear on +.",
        codeExercise: {
          language: JS,
          code: 'const typed = "2500";\nconsole.log(typed + 500);\nconsole.log(Number(typed) + 500);\nconsole.log(typeof typed, typeof Number(typed));\nconsole.log(Number("two"), "6" * 2);\n',
          question: "What does this print?",
          expectedOutput: "2500500\n3000\nstring number\nNaN 12",
          hint: "+ with a string joins. Number() converts. \"two\" is not a number.",
          successMessage: "This is the most common bug in forms: \"2500\" + 500 is \"2500500\". Always convert input first.",
        },
      },
      {
        id: "a-md-primitives",
        title: "Strings, numbers, booleans and null",
        explain:
          "STRINGS have a length (\"Lagos\".length is 5), and methods: toUpperCase(), toLowerCase(), trim() (removes spaces at the ends), includes(\"x\"), and slice(start, end). NUMBERS include decimals; toFixed(2) gives a string with two decimal places, and Math.round, Math.floor and Math.max do what they say. BOOLEANS come from comparisons: 5 > 3 is true. NULL means \"no value, on purpose\" (a user has no profile photo yet). In the lab, the screen is already built: it shows the values exported by src/lib/profile.js, which you will complete.",
        webLab: expoLab({
          name: "Profile",
          layout: layout("Profile"),
          task:
            "Complete src/lib/profile.js so the screen shows the right values. The user typed their name with extra spaces and their age as text. Make displayName the name without the spaces at the ends and in capital letters; nameLength its number of characters; ageNextYear the typed age as a NUMBER plus 1; isAdult whether that next-year age is 18 or more (true or false); and photo should be null because the user has no photo yet.",
          files: {
            "src/lib/profile.js": `// What the user typed into the sign-up form:
const typedName = "   chioma okafor  ";
const typedAge = "17";

// Change each value below to the right expression.
export const displayName = typedName;
export const nameLength = 0;
export const ageNextYear = typedAge + 1;
export const isAdult = false;
export const photo = "none";
`,
            "src/app/index.js": rowsScreen("Your profile", 'import { displayName, nameLength, ageNextYear, isAdult, photo } from "@/lib/profile";', [["Name", "displayName"], ["Letters", "nameLength"], ["Age next year", "ageNextYear"], ["Adult next year", "isAdult"], ["Photo", "photo"]]),
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/profile.js": `// What the user typed into the sign-up form:
const typedName = "   chioma okafor  ";
const typedAge = "17";

// Change each value below to the right expression.
export const displayName = typedName.trim().toUpperCase();
export const nameLength = typedName.trim().length;
export const ageNextYear = Number(typedAge) + 1;
export const isAdult = ageNextYear >= 18;
export const photo = null;
`,
          },
          tests: [
            { label: "The name is trimmed and in capitals", check: "return load('src/lib/profile.js').displayName === 'CHIOMA OKAFOR' && has('CHIOMA OKAFOR');", fail: "typedName.trim().toUpperCase()" },
            { label: "Letters counts the trimmed name (13)", check: "return load('src/lib/profile.js').nameLength === 13;", fail: "The length of the TRIMMED name: typedName.trim().length" },
            { label: "Age next year is the number 18", check: "const v = load('src/lib/profile.js').ageNextYear; return v === 18 && typeof v === 'number' && has('18');", fail: "Convert first: Number(typedAge) + 1. Otherwise \"17\" + 1 is \"171\"." },
            { label: "Adult next year is worked out, and is true", check: "const p = load('src/lib/profile.js'); return p.isAdult === true && /ageNextYear\\s*>=\\s*18/.test(code('src/lib/profile.js'));", fail: "Compare: ageNextYear >= 18. Do not just type true." },
            { label: "Photo is null and the screen shows it", check: "return load('src/lib/profile.js').photo === null && has('null');", fail: "null, without quotes, means deliberately empty." },
          ],
          hint: "Methods chain: first trim(), then toUpperCase(). Number(\"17\") converts text to a number.",
          successMessage: "Text from a form, cleaned and converted. You will do exactly this in every form you build.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 3.4 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l7-operators-conditions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.4", "3.5"],
    title: "Operators and Decisions",
    subtitle: "Expressions, comparisons, and making the program choose",
    estimatedMinutes: 40,
    intro: "Programs make decisions all the time: is the password long enough, is the cart empty, is it morning or evening. This lesson gives you the tools to compute and to choose.",

    atoms: [
      {
        id: "a-md-operators",
        title: "Operators and expressions",
        explain:
          "An EXPRESSION is anything that produces a value. Arithmetic: + - * / and % (the remainder: 7 % 3 is 1, handy for \"is it even?\"), and ** for powers. Comparison gives booleans: === (equal, same type), !== (not equal), <, >, <=, >=. Always use === and !==: the loose == converts types first, so 0 == \"\" is true, a classic bug. Logical operators combine booleans: && (and), || (or), ! (not). They also work on any value using TRUTHINESS: false, 0, \"\", null, undefined and NaN are FALSY, everything else is truthy. So name || \"Guest\" gives \"Guest\" when name is empty, and ?? (nullish coalescing) does the same only for null and undefined, which keeps a real 0.",
        codeExercise: {
          language: JS,
          code: 'console.log(17 % 5, 2 ** 3);\nconsole.log(5 === "5", 5 == "5");\nconst name = "";\nconsole.log(name || "Guest");\nconst score = 0;\nconsole.log(score || 10, score ?? 10);\nconsole.log(!true, true && "yes");\n',
          question: "What does this print?",
          expectedOutput: "2 8\nfalse true\nGuest\n10 0\nfalse yes",
          hint: "0 is falsy, so || replaces it; ?? only replaces null and undefined. && returns its right side when the left is truthy.",
          successMessage: "score || 10 turning a real 0 into 10 is a bug you will now spot instantly.",
        },
      },
      {
        id: "a-md-if-else",
        title: "Conditional statements: if and else",
        explain:
          "if (condition) { … } runs its block only when the condition is truthy. else { … } runs otherwise, and else if chains more cases, checked top to bottom: the first one that is true wins, so order them from most specific to least. The TERNARY operator is an expression version: const label = stock > 0 ? \"In stock\" : \"Sold out\"; you will use it constantly inside screens. Keep conditions readable: name them (const isEmpty = items.length === 0) instead of writing long expressions inside if.",
        webLab: expoLab({
          name: "Greeter",
          layout: layout("Good day"),
          task:
            "Write greetingFor(hour) in src/lib/greeting.js. It returns \"Good morning\" from 5 until before 12, \"Good afternoon\" from 12 until before 17, \"Good evening\" from 17 until before 22, and \"Good night\" otherwise. The screen shows the greeting for several hours of the day.",
          files: {
            "src/lib/greeting.js": `// hour is a whole number from 0 to 23.
export function greetingFor(hour) {
  return "Hello";
}
`,
            "src/app/index.js": rowsScreen("Greetings", 'import { greetingFor } from "@/lib/greeting";', [["4:00", "greetingFor(4)"], ["9:00", "greetingFor(9)"], ["12:00", "greetingFor(12)"], ["16:00", "greetingFor(16)"], ["17:00", "greetingFor(17)"], ["23:00", "greetingFor(23)"]]),
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/greeting.js": `// hour is a whole number from 0 to 23.
export function greetingFor(hour) {
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
}
`,
          },
          tests: [
            { label: "Morning from 5 until before 12", check: "const g = load('src/lib/greeting.js').greetingFor; return g(5) === 'Good morning' && g(11) === 'Good morning' && g(4) !== 'Good morning';", fail: "if (hour >= 5 && hour < 12)" },
            { label: "Afternoon from 12 until before 17", check: "const g = load('src/lib/greeting.js').greetingFor; return g(12) === 'Good afternoon' && g(16) === 'Good afternoon';", fail: "else if (hour >= 12 && hour < 17)" },
            { label: "Evening from 17 until before 22", check: "const g = load('src/lib/greeting.js').greetingFor; return g(17) === 'Good evening' && g(21) === 'Good evening';", fail: "else if (hour >= 17 && hour < 22)" },
            { label: "Night otherwise, including 22, 23 and 0 to 4", check: "const g = load('src/lib/greeting.js').greetingFor; return [22, 23, 0, 4].every((h) => g(h) === 'Good night') && has('Good night');", fail: "A final else returns \"Good night\"." },
          ],
          hint: "Check the boundaries: 12 is afternoon, not morning, so the morning test is hour < 12.",
          successMessage: "Every boundary right. Off-by-one mistakes at boundaries are among the most common bugs; you just tested yours.",
        }),
      },
      {
        id: "a-md-switch",
        title: "Conditional statements: switch",
        explain:
          "switch compares ONE value against several exact cases: switch (status) { case \"paid\": … break; case \"pending\": … break; default: … }. Each case runs until a break (or return); forgetting break makes execution \"fall through\" into the next case, which is occasionally useful and usually a bug. default handles anything not listed. Use switch when one value has many named possibilities, such as an order's status or a tab's name; use if/else for ranges (hour < 12).",
        codeExercise: {
          language: JS,
          code: 'function label(status) {\n  switch (status) {\n    case "paid":\n      return "Paid";\n    case "pending":\n    case "processing":\n      return "Waiting for payment";\n    default:\n      return "Unknown";\n  }\n}\nconsole.log(label("paid"));\nconsole.log(label("processing"));\nconsole.log(label("refunded"));\nlet n = 0;\nswitch (2) {\n  case 1:\n    n += 1;\n  case 2:\n    n += 10;\n  case 3:\n    n += 100;\n}\nconsole.log(n);\n',
          question: "What does this print?",
          expectedOutput: "Paid\nWaiting for payment\nUnknown\n110",
          hint: "Two cases can share one block. With no break, case 2 falls through into case 3.",
          successMessage: "And that 110 is why every case should end with break or return.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 3.6 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l8-loops-functions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.6", "3.7"],
    title: "Loops and Functions",
    subtitle: "Repeating work, and packaging it so you can reuse it",
    estimatedMinutes: 45,
    intro: "Loops let a program repeat work over many items; functions give a piece of work a name so you can use it anywhere. Between them they are most of what programs are made of.",

    atoms: [
      {
        id: "a-md-for-while",
        title: "Loops: for and while",
        explain:
          "A for loop counts: for (let i = 0; i < 5; i++) { … } runs the block with i = 0, 1, 2, 3, 4: start, keep going while the condition holds, step. A while loop repeats while a condition is true: while (balance < goal) { … }. Make sure something inside changes so the condition eventually becomes false, or the loop never ends (the practice phone stops any loop that runs for more than a second and a half). break leaves a loop early; continue skips to the next round.",
        codeExercise: {
          language: JS,
          code: 'let total = 0;\nfor (let day = 1; day <= 5; day++) {\n  total = total + day * 100;\n}\nconsole.log(total);\nlet savings = 1000;\nlet months = 0;\nwhile (savings < 2000) {\n  savings = savings * 2;\n  months++;\n}\nconsole.log(months, savings);\nfor (let i = 0; i < 10; i++) {\n  if (i % 2 === 1) continue;\n  if (i > 6) break;\n  console.log(i);\n}\n',
          question: "What does this print?",
          expectedOutput: "1500\n1 2000\n0\n2\n4\n6",
          hint: "100 + 200 + 300 + 400 + 500. The while loop doubles once. continue skips odd numbers; break stops at 8.",
          successMessage: "Counting loops, condition loops, and skipping or stopping early.",
        },
      },
      {
        id: "a-md-iteration",
        title: "Array iteration: for…of and forEach",
        explain:
          "Most loops in apps go through a list. for (const item of items) { … } visits each item of an array in order; it is clearer than counting with an index. items.forEach((item, index) => { … }) does the same with a function, and also gives you the position. You will meet map, filter and reduce in Module 4, which BUILD new arrays and are what screens use most; for…of is the plain, readable way to do something with every item.",
        codeExercise: {
          language: JS,
          code: 'const cart = [\n  { name: "Rice", price: 2500 },\n  { name: "Beans", price: 1800 },\n  { name: "Oil", price: 3200 },\n];\nlet sum = 0;\nfor (const item of cart) {\n  sum += item.price;\n}\nconsole.log(sum);\ncart.forEach((item, i) => console.log(i + 1, item.name));\n',
          question: "What does this print?",
          expectedOutput: "7500\n1 Rice\n2 Beans\n3 Oil",
          hint: "for…of gives each item; forEach also gives its index, starting at 0.",
          successMessage: "Visiting every item in a list: the start of every cart, feed and inbox.",
        },
      },
      {
        id: "a-md-functions",
        title: "Functions, parameters and arguments",
        explain:
          "A FUNCTION is a named, reusable piece of work. function formatNaira(amount) { … } declares one; formatNaira(1500) CALLS it. amount is a PARAMETER (a name inside the function); 1500 is the ARGUMENT (the value passed in). A function can take several parameters, and give a default for a missing one: function greet(name = \"friend\"). Good functions do one job and are named for it (calculateTotal, isValidEmail). In the lab the screen formats prices with a function you write.",
        webLab: expoLab({
          name: "Price Tags",
          layout: layout("Prices"),
          task:
            "Write formatNaira(amount) in src/lib/money.js. It returns the amount as naira with a thousands separator and no decimals: formatNaira(1500) is \"₦1,500\" and formatNaira(250000) is \"₦250,000\". It rounds to the nearest naira (formatNaira(99.6) is \"₦100\"). Use Math.round and the number method toLocaleString(\"en-NG\").",
          files: {
            "src/lib/money.js": `export function formatNaira(amount) {
  return amount;
}
`,
            "src/app/index.js": rowsScreen("Price tags", 'import { formatNaira } from "@/lib/money";', [["Bread", "formatNaira(1500)"], ["Phone", "formatNaira(250000)"], ["Gum", "formatNaira(99.6)"], ["Free", "formatNaira(0)"]]),
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/money.js": `export function formatNaira(amount) {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}
`,
          },
          tests: [
            { label: "1500 becomes ₦1,500", check: "return load('src/lib/money.js').formatNaira(1500) === '₦1,500' && has('₦1,500');", fail: "\"₦\" + amount.toLocaleString(\"en-NG\")" },
            { label: "250000 becomes ₦250,000", check: "return load('src/lib/money.js').formatNaira(250000) === '₦250,000';", fail: "toLocaleString adds the comma for you." },
            { label: "99.6 rounds to ₦100, and 0 is ₦0", check: "const f = load('src/lib/money.js').formatNaira; return f(99.6) === '₦100' && f(0) === '₦0';", fail: "Round first: Math.round(amount)." },
          ],
          hint: "Build it in steps: Math.round(amount), then .toLocaleString(\"en-NG\"), then put \"₦\" in front with +.",
          successMessage: "One function, used for every price in the app: change it once, and every screen follows.",
        }),
      },
      {
        id: "a-md-return-values",
        title: "Return values",
        explain:
          "return sends a value back to whoever called the function and ENDS the function at once: any line after it does not run. A function with no return gives back undefined, a common surprise (\"why is my total undefined?\"). Return early to handle special cases first: if (!items.length) return 0; then do the normal work. A function that only CALCULATES and returns (it changes nothing outside itself) is called PURE; pure functions are the easiest code there is to test and reuse, and you will write many of them.",
        codeExercise: {
          language: JS,
          code: 'function discount(total) {\n  if (total < 10000) return 0;\n  return total * 0.1;\n  console.log("never printed");\n}\nfunction logTotal(total) {\n  console.log("Total:", total);\n}\nconsole.log(discount(5000), discount(20000));\nconst result = logTotal(800);\nconsole.log(result);\n',
          question: "What does this print?",
          expectedOutput: "0 2000\nTotal: 800\nundefined",
          hint: "return ends the function. logTotal prints but returns nothing.",
          successMessage: "Printing is not returning. A function the screen needs a value from must return it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.8 – 3.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l9-scope-arrays",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.8", "3.9"],
    title: "Scope, Errors and Arrays",
    subtitle: "Where names exist, the mistakes everyone makes, and working with lists",
    estimatedMinutes: 45,
    intro: "Knowing where a variable exists explains half the error messages you will ever see. Arrays are how every list in an app is stored.",

    atoms: [
      {
        id: "a-md-scope",
        title: "Scope",
        explain:
          "SCOPE is where a name exists. A variable declared with let or const inside { } (a function, an if, a loop) exists only inside those braces; outside, using it is an error: \"ReferenceError: x is not defined\". An inner function can read the variables of the functions around it, even after the outer function has finished: that is a CLOSURE, and it is how a button's onPress handler remembers which item it belongs to. Keep variables in the smallest scope that works; a variable that everything can change is a bug waiting to happen.",
        codeExercise: {
          language: JS,
          code: 'const appName = "Kobo";\nfunction makeCounter() {\n  let taps = 0;\n  return function tap() {\n    taps = taps + 1;\n    return appName + " " + taps;\n  };\n}\nconst a = makeCounter();\nconst b = makeCounter();\nconsole.log(a(), a(), b());\nif (true) {\n  const inside = "only here";\n}\nconsole.log(typeof inside);\n',
          question: "What does this print?",
          expectedOutput: "Kobo 1 Kobo 2 Kobo 1\nundefined",
          hint: "Each counter has its own taps. inside does not exist outside its braces (typeof does not throw).",
          successMessage: "Each counter remembered its own taps: a closure. Every event handler you write relies on this.",
        },
      },
      {
        id: "a-md-common-errors",
        title: "Common programming errors",
        explain:
          "Read error messages: they name the problem and the line. ReferenceError: you used a name that does not exist here (a typo, or out of scope). TypeError: you used a value the wrong way, most often \"Cannot read properties of undefined (reading 'name')\": you asked for user.name but user is undefined, for example because the data has not arrived yet. SyntaxError: the code itself is malformed (a missing bracket or quote); nothing runs. Logic errors give no message at all: the program runs but does the wrong thing, which is why you test. Optional chaining, user?.name, returns undefined instead of crashing when user is missing.",
        codeExercise: {
          language: JS,
          code: 'const order = { id: 7, customer: null };\ntry {\n  console.log(order.customer.name);\n} catch (err) {\n  console.log(err.constructor.name);\n}\nconsole.log(order.customer?.name);\nconsole.log(order.customer?.name ?? "Walk-in customer");\ntry {\n  console.log(totl);\n} catch (err) {\n  console.log(err.message);\n}\n',
          question: "What does this print?",
          expectedOutput: "TypeError\nundefined\nWalk-in customer\ntotl is not defined",
          hint: "Reading .name of null is a TypeError. ?. stops at null. A misspelt name is a ReferenceError: \"totl is not defined\".",
          successMessage: "The two errors you will see most, and the operator (?.) that prevents the first.",
        },
      },
      {
        id: "a-md-arrays",
        title: "Arrays and array methods",
        explain:
          "An ARRAY is an ordered list: const tasks = [\"Buy data\", \"Call mum\"]. Positions (indexes) start at 0: tasks[0] is \"Buy data\", tasks.length is 2, and the last item is tasks[tasks.length - 1]. Methods that CHANGE the array: push(x) adds at the end, pop() removes the last, unshift(x) adds at the start, splice(i, n) removes n items at position i. Methods that READ it: includes(x), indexOf(x) (-1 if missing), slice(a, b) (a copy of part), join(\", \"), and sort(). In the lab, you write the functions behind a small to-do screen.",
        webLab: expoLab({
          name: "Shopping List",
          layout: layout("Shopping list"),
          task:
            "Complete src/lib/list.js. addItem(list, item) adds item to the END of the list, unless it is already in the list, and returns the list. removeItem(list, item) removes the item if it is there and returns the list. summary(list) returns \"3 items: Bread, Eggs, Milk\" (the count, then the items in alphabetical order, joined with a comma and a space), or \"Your list is empty\" for an empty list. The screen builds a list with your functions.",
          files: {
            "src/lib/list.js": `export function addItem(list, item) {
  return list;
}

export function removeItem(list, item) {
  return list;
}

export function summary(list) {
  return "";
}
`,
            "src/app/index.js": `import { StyleSheet, Text, View } from "react-native";
import { addItem, removeItem, summary } from "@/lib/list";

const list = [];
addItem(list, "Milk");
addItem(list, "Bread");
addItem(list, "Milk");
addItem(list, "Eggs");
addItem(list, "Sugar");
removeItem(list, "Sugar");

export default function Screen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{summary(list)}</Text>
      {list.map((item) => (
        <Text key={item} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 8 },
  title: { fontSize: 18, fontWeight: "700" },
  item: { padding: 12, borderRadius: 8, backgroundColor: "#f1f5f4" },
});
`,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/list.js": `export function addItem(list, item) {
  if (!list.includes(item)) {
    list.push(item);
  }
  return list;
}

export function removeItem(list, item) {
  const index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
  return list;
}

export function summary(list) {
  if (list.length === 0) {
    return "Your list is empty";
  }
  const sorted = list.slice().sort();
  return list.length + " items: " + sorted.join(", ");
}
`,
          },
          tests: [
            { label: "addItem adds to the end, but not twice", check: "const { addItem } = load('src/lib/list.js'); const l = ['Rice']; addItem(l, 'Beans'); addItem(l, 'Rice'); return JSON.stringify(l) === '[\"Rice\",\"Beans\"]';", fail: "Use list.includes(item) before list.push(item)." },
            { label: "removeItem removes an item that is there, and ignores one that is not", check: "const { removeItem } = load('src/lib/list.js'); const l = ['A', 'B', 'C']; removeItem(l, 'B'); removeItem(l, 'Z'); return JSON.stringify(l) === '[\"A\",\"C\"]';", fail: "indexOf gives the position (-1 if missing); splice(index, 1) removes one item there." },
            { label: "summary lists the items alphabetically with the count", check: "const { summary } = load('src/lib/list.js'); return summary(['Milk', 'Bread', 'Eggs']) === '3 items: Bread, Eggs, Milk' && has('3 items: Bread, Eggs, Milk');", fail: "Sort a copy (list.slice().sort()), then join(\", \")." },
            { label: "summary handles an empty list, and does not reorder the original", check: "const { summary } = load('src/lib/list.js'); const l = ['b', 'a']; const s = summary(l); return summary([]) === 'Your list is empty' && l[0] === 'b' && s === '2 items: a, b';", fail: "Return early for an empty list; sort a copy, because sort() changes the array it is called on." },
          ],
          hint: "sort() changes the array you call it on. list.slice() makes a copy to sort instead.",
          successMessage: "Adding, removing and summarising a list: every list screen you build starts with these.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.10 – 3.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l10-objects",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.10", "3.11", "3.12"],
    title: "Objects, Destructuring, Spread and Templates",
    subtitle: "Grouping related values, unpacking them, copying them and putting them into text",
    estimatedMinutes: 45,
    intro: "Real app data is objects: a user, an order, a message, each with named properties. Modern JavaScript has a compact syntax for working with them that you will see in every React Native file.",

    atoms: [
      {
        id: "a-md-objects",
        title: "Objects and object properties",
        explain:
          "An OBJECT groups named values (PROPERTIES): const user = { name: \"Ada\", city: \"Abuja\", verified: true }. Read a property with a dot, user.name, or with brackets when the name is in a variable, user[field]. Assign to add or change one: user.city = \"Lagos\". Properties can hold anything: numbers, arrays, other objects, functions (then they are METHODS). Object.keys(user) lists the names, Object.values the values, Object.entries the pairs. Reading a property that does not exist gives undefined, not an error. Objects and arrays are REFERENCES: const b = a makes b another name for the SAME object, so changing b changes a.",
        codeExercise: {
          language: JS,
          code: 'const user = { name: "Ada", city: "Abuja", orders: [12, 40] };\nuser.city = "Lagos";\nuser.verified = true;\nconsole.log(user.name, user.city, user.orders.length);\nconst field = "verified";\nconsole.log(user[field], user.phone);\nconsole.log(Object.keys(user).join(","));\nconst copy = user;\ncopy.name = "Tunde";\nconsole.log(user.name);\n',
          question: "What does this print?",
          expectedOutput: "Ada Lagos 2\ntrue undefined\nname,city,orders,verified\nTunde",
          hint: "A missing property is undefined. copy is not a copy: it is the same object.",
          successMessage: "One object, two names. React state (Module 7) depends on you remembering this.",
        },
      },
      {
        id: "a-md-destructuring",
        title: "Destructuring",
        explain:
          "DESTRUCTURING unpacks values into variables in one line. Objects, by property name: const { name, city } = user; is const name = user.name; const city = user.city. Rename with a colon ({ name: fullName }) and give defaults ({ role = \"member\" }). Arrays, by position: const [first, second] = scores. React Native code uses it everywhere: const { id } = useLocalSearchParams(); and const [count, setCount] = useState(0); are both destructuring, and so are a component's props: function Card({ title, price }).",
        codeExercise: {
          language: JS,
          code: 'const order = { id: 31, total: 4500, customer: { name: "Bisi" } };\nconst { id, total, status = "pending" } = order;\nconsole.log(id, total, status);\nconst { customer: { name: buyer } } = order;\nconsole.log(buyer);\nconst [gold, silver, bronze = "none"] = ["Ama", "Kofi"];\nconsole.log(gold, silver, bronze);\nfunction card({ title, price = 0 }) {\n  return title + ": " + price;\n}\nconsole.log(card({ title: "Tea" }));\n',
          question: "What does this print?",
          expectedOutput: "31 4500 pending\nBisi\nAma Kofi none\nTea: 0",
          hint: "Defaults fill in what is missing. customer: { name: buyer } reaches inside and renames.",
          successMessage: "You now recognise half the syntax of a React Native file.",
        },
      },
      {
        id: "a-md-spread-templates",
        title: "Spread syntax and template literals",
        explain:
          "SPREAD (...) copies the contents of an array or object into a new one: [...items, newItem] is a new array with one more item; { ...user, city: \"Kano\" } is a new object with one property changed. The original is untouched, which is exactly what React needs (Module 7). REST is the same dots on the receiving side: const { password, ...safe } = user leaves password out. TEMPLATE LITERALS are strings in backticks that can hold expressions: `Hello, ${name}! You have ${count} messages.` is far clearer than joining with +, and can span several lines. In the lab you build an order receipt with both.",
        webLab: expoLab({
          name: "Receipt",
          layout: layout("Receipt"),
          task:
            "Complete src/lib/receipt.js. withItem(order, item) returns a NEW order with item added to the end of items (the original order must not change). receiptLine(item) returns a template literal like \"2 × Rice @ ₦2,500 = ₦5,000\" (quantity, ×, name, @, unit price, =, quantity times price), using the formatNaira function that is already there. The screen shows the receipt.",
          files: {
            "src/lib/receipt.js": `export function formatNaira(amount) {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

// Return a NEW order with item at the end of items.
export function withItem(order, item) {
  order.items.push(item);
  return order;
}

// "2 × Rice @ ₦2,500 = ₦5,000"
export function receiptLine(item) {
  return item.name;
}
`,
            "src/app/index.js": `import { StyleSheet, Text, View } from "react-native";
import { receiptLine, withItem } from "@/lib/receipt";

const empty = { id: "A-104", items: [] };
const one = withItem(empty, { name: "Rice", qty: 2, price: 2500 });
const two = withItem(one, { name: "Palm oil", qty: 1, price: 3200 });

export default function Screen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Order {two.id}</Text>
      {two.items.map((item) => (
        <Text key={item.name} style={styles.line}>
          {receiptLine(item)}
        </Text>
      ))}
      <Text style={styles.note}>The empty order still has {empty.items.length} items.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  title: { fontSize: 20, fontWeight: "700" },
  line: { fontSize: 16 },
  note: { color: "#64748b", marginTop: 12 },
});
`,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/receipt.js": `export function formatNaira(amount) {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

// Return a NEW order with item at the end of items.
export function withItem(order, item) {
  return { ...order, items: [...order.items, item] };
}

// "2 × Rice @ ₦2,500 = ₦5,000"
export function receiptLine(item) {
  return \`\${item.qty} × \${item.name} @ \${formatNaira(item.price)} = \${formatNaira(item.qty * item.price)}\`;
}
`,
          },
          tests: [
            { label: "withItem returns a new order and leaves the old one alone", check: "const { withItem } = load('src/lib/receipt.js'); const a = { id: 'X', items: [] }; const b = withItem(a, { name: 'Tea', qty: 1, price: 100 }); return a.items.length === 0 && b.items.length === 1 && b !== a && b.id === 'X' && has('The empty order still has 0 items.');", fail: "Build a new object with spread: { ...order, items: [...order.items, item] }" },
            { label: "receiptLine shows quantity, name, unit price and line total", check: "const { receiptLine } = load('src/lib/receipt.js'); return receiptLine({ name: 'Rice', qty: 2, price: 2500 }) === '2 × Rice @ ₦2,500 = ₦5,000' && has('1 × Palm oil @ ₦3,200 = ₦3,200');", fail: "Use a template literal with ${...} for each part, and formatNaira for both prices." },
            { label: "receiptLine uses a template literal", check: "return /`[^`]*\\$\\{/.test(code('src/lib/receipt.js'));", fail: "Write the line in backticks, with ${...} placeholders." },
          ],
          hint: "Spread copies: [...order.items, item] is a new array; { ...order, items: … } is a new object.",
          successMessage: "New data instead of changed data, and readable text from values: two habits React Native depends on.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.13 – 3.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l11-modules-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["3.13", "3.14"],
    title: "Modules and Error Handling",
    subtitle: "Splitting code into files, and handling what goes wrong",
    estimatedMinutes: 45,
    intro: "Real apps are hundreds of files that use each other's code, and real programs meet bad input. This lesson covers both: modules, and try, catch and finally.",

    atoms: [
      {
        id: "a-md-modules",
        title: "Modules: import and export",
        explain:
          "Each file is a MODULE with its own scope. To share something, EXPORT it: export function formatNaira() {} or export const TAX_RATE = 0.075 (named exports, any number per file), or export default function HomeScreen() {} (one default export per file; Expo Router requires each screen file to default-export its screen). Another file IMPORTS what it needs: import { formatNaira, TAX_RATE } from \"./money\" (names must match), import HomeScreen from \"./index\" (any name for a default). Paths starting with ./ or ../ are relative to the current file; the \"@/\" alias in an Expo project means the src folder, so \"@/lib/money\" works from any file. Packages are imported by name: import { Text } from \"react-native\".",
        webLab: expoLab({
          name: "Tax Calculator",
          layout: layout("VAT"),
          task:
            "The screen imports from a module that does not exist yet. Create the module the screen expects in src/lib/tax.js: export a constant VAT_RATE of 0.075, and export a function addVat(amount) that returns the amount plus 7.5% VAT, rounded to the nearest naira. Then the screen will load. (Read src/app/index.js to see exactly what it imports.)",
          files: {
            "src/lib/tax.js": `// Export VAT_RATE and addVat(amount) from here.
`,
            "src/app/index.js": rowsScreen("Value added tax", 'import { VAT_RATE, addVat } from "@/lib/tax";', [["Rate", "`${VAT_RATE * 100}%`"], ["₦10,000 with VAT", "addVat(10000)"], ["₦2,999 with VAT", "addVat(2999)"]]),
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/tax.js": `// Export VAT_RATE and addVat(amount) from here.
export const VAT_RATE = 0.075;

export function addVat(amount) {
  return Math.round(amount * (1 + VAT_RATE));
}
`,
          },
          tests: [
            { label: "The screen loads: both names are exported", check: "const m = load('src/lib/tax.js'); return typeof m.addVat === 'function' && m.VAT_RATE === 0.075 && has('7.5%');", fail: "export const VAT_RATE = 0.075; and export function addVat(amount) { … }" },
            { label: "addVat adds 7.5% and rounds", check: "const { addVat } = load('src/lib/tax.js'); return addVat(10000) === 10750 && addVat(2999) === 3224 && has('10750');", fail: "Math.round(amount * (1 + VAT_RATE))" },
            { label: "addVat uses VAT_RATE rather than repeating 0.075", check: "return /addVat[\\s\\S]*VAT_RATE/.test(code('src/lib/tax.js'));", fail: "Use the constant, so the rate lives in one place." },
          ],
          hint: "The screen's import line lists the names it needs; each must be exported with exactly that name.",
          successMessage: "A module with a constant and a function, imported by name. Every Expo project is made of files like this.",
        }),
      },
      {
        id: "a-md-try-catch",
        title: "Error handling with try and catch",
        explain:
          "Some code can fail at run time: reading JSON from a server, converting user input, saving to storage. Wrap it in try { … } catch (err) { … }: if anything inside try throws, JavaScript jumps straight to catch with the error, and the program carries on instead of crashing. err.message is the description. Catch only around code that can genuinely fail, and do something useful: show a message, use a default, report it. Never write an empty catch {} that hides problems. JSON.parse is the classic example: it throws a SyntaxError for text that is not valid JSON.",
        webLab: expoLab({
          name: "Settings Import",
          layout: layout("Import settings"),
          task:
            "readSettings(text) in src/lib/settings.js turns saved settings text into an object with JSON.parse. Today a corrupted file crashes the whole screen. Make it safe: if the text parses, return the parsed object; if JSON.parse throws, return the DEFAULTS object instead (and console.warn the error's message). The screen tries a good and a corrupted file.",
          files: {
            "src/lib/settings.js": `export const DEFAULTS = { theme: "light", fontSize: 16 };

export function readSettings(text) {
  return JSON.parse(text);
}
`,
            "src/app/index.js": rowsScreen("Import settings", 'import { readSettings } from "@/lib/settings";\n\nconst good = readSettings(\'{"theme":"dark","fontSize":18}\');\nconst broken = readSettings("{theme: dark");', [["Good file: theme", "good.theme"], ["Good file: size", "good.fontSize"], ["Broken file: theme", "broken.theme"], ["Broken file: size", "broken.fontSize"]]),
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/settings.js": `export const DEFAULTS = { theme: "light", fontSize: 16 };

export function readSettings(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn("Could not read settings: " + err.message);
    return DEFAULTS;
  }
}
`,
          },
          tests: [
            { label: "The screen no longer crashes", check: "return has('Broken file: theme') && !overlay();", fail: "Wrap JSON.parse in try { … } catch (err) { … }." },
            { label: "A good file is read", check: "const { readSettings } = load('src/lib/settings.js'); return readSettings('{\"theme\":\"dark\",\"fontSize\":18}').theme === 'dark' && has('dark');", fail: "Return JSON.parse(text) inside try." },
            { label: "A broken file gives the defaults, with a warning", check: "const { readSettings, DEFAULTS } = load('src/lib/settings.js'); return readSettings('nope') === DEFAULTS && has('light') && /Could not read settings/.test(output());", fail: "In catch: console.warn(...) and return DEFAULTS." },
          ],
          hint: "Everything that can throw goes inside try; what to do instead goes in catch.",
          successMessage: "One bad file no longer takes down the screen. Saved data and server responses deserve the same care.",
        }),
      },
      {
        id: "a-md-finally-throw",
        title: "finally, and throwing your own errors",
        explain:
          "finally { … } runs AFTER try and catch whatever happened, even if try returned: it is where you put clean-up, such as hiding a loading spinner. You can also create errors: throw new Error(\"Amount must be positive\") stops the current function and hands the error to the nearest catch. Throw when a function is given something it cannot work with, so the problem is reported where it happens rather than causing a confusing bug later. err.message is your text; err.name is \"Error\" (or \"TypeError\", \"SyntaxError\" for built-in ones).",
        codeExercise: {
          language: JS,
          code: 'function withdraw(balance, amount) {\n  if (amount <= 0) throw new Error("Amount must be positive");\n  if (amount > balance) throw new Error("Insufficient funds");\n  return balance - amount;\n}\nfunction attempt(amount) {\n  let loading = true;\n  try {\n    return "New balance: " + withdraw(5000, amount);\n  } catch (err) {\n    return "Failed: " + err.message;\n  } finally {\n    loading = false;\n    console.log("loading:", loading);\n  }\n}\nconsole.log(attempt(2000));\nconsole.log(attempt(9000));\n',
          question: "What does this print?",
          expectedOutput: "loading: false\nNew balance: 3000\nloading: false\nFailed: Insufficient funds",
          hint: "finally runs before the function actually returns, so its line prints first each time.",
          successMessage: "finally runs no matter what: the right place to turn a loading spinner off.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l12-m3-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["3.P"],
    title: "Practical: The Logic of a Shopping Cart",
    subtitle: "Modules, functions, arrays, objects, conditions and errors in one program",
    estimatedMinutes: 75,
    intro: "This practical uses every idea from the module: a shopping cart's logic, written as a JavaScript module that a real app screen uses.",

    atoms: [
      {
        id: "a-md-m3-project",
        title: "Write the cart module",
        explain:
          "The cart is an array of line objects: { id, name, price, qty }. Write each function in src/lib/cart.js so it does one job and returns a value (do not change the cart passed in: return a new one). The screen is given: it builds a cart with your functions and shows the result, so you will see your logic working on the phone.",
        webLab: expoLab({
          name: "Cart",
          layout: layout("Your cart"),
          task:
            "Write five exported functions in src/lib/cart.js. addToCart(cart, product): returns a new cart; if a line with that product's id exists, its qty goes up by 1, otherwise a line { ...product, qty: 1 } is added at the end. removeFromCart(cart, id): returns a new cart without that line. subtotal(cart): the sum of price × qty. discountFor(subtotal): 10% (rounded) when the subtotal is ₦20,000 or more, otherwise 0. checkout(cart): throws an Error with the message \"Your cart is empty\" for an empty cart, otherwise returns the text \"Pay ₦X\" where X is the subtotal minus the discount, formatted with formatNaira (already written).",
          files: {
            "src/lib/cart.js": `export function formatNaira(amount) {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

// Write addToCart, removeFromCart, subtotal, discountFor and checkout here.
`,
            "src/app/index.js": `import { StyleSheet, Text, View } from "react-native";
import { addToCart, checkout, discountFor, formatNaira, removeFromCart, subtotal } from "@/lib/cart";

const rice = { id: "rice", name: "Rice (5kg)", price: 9500 };
const oil = { id: "oil", name: "Palm oil", price: 3200 };
const salt = { id: "salt", name: "Salt", price: 400 };

let cart = [];
cart = addToCart(cart, rice);
cart = addToCart(cart, oil);
cart = addToCart(cart, rice);
cart = addToCart(cart, salt);
cart = removeFromCart(cart, "salt");

let message;
try {
  message = checkout(cart);
} catch (err) {
  message = err.message;
}
let emptyMessage;
try {
  emptyMessage = checkout([]);
} catch (err) {
  emptyMessage = err.message;
}

export default function Screen() {
  const total = subtotal(cart);
  return (
    <View style={styles.page}>
      {cart.map((line) => (
        <Text key={line.id} style={styles.line}>
          {line.qty} × {line.name}
        </Text>
      ))}
      <Text>Subtotal: {formatNaira(total)}</Text>
      <Text>Discount: {formatNaira(discountFor(total))}</Text>
      <Text style={styles.pay}>{message}</Text>
      <Text style={styles.note}>Empty cart: {emptyMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 10 },
  line: { fontSize: 16 },
  pay: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  note: { color: "#64748b" },
});
`,
          },
          readOnly: ["src/app/index.js"],
          revealSolution: false,
          solution: {
            "src/lib/cart.js": `export function formatNaira(amount) {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

export function addToCart(cart, product) {
  const existing = cart.find((line) => line.id === product.id);
  if (existing) {
    return cart.map((line) => (line.id === product.id ? { ...line, qty: line.qty + 1 } : line));
  }
  return [...cart, { ...product, qty: 1 }];
}

export function removeFromCart(cart, id) {
  return cart.filter((line) => line.id !== id);
}

export function subtotal(cart) {
  let sum = 0;
  for (const line of cart) {
    sum += line.price * line.qty;
  }
  return sum;
}

export function discountFor(subtotal) {
  if (subtotal >= 20000) {
    return Math.round(subtotal * 0.1);
  }
  return 0;
}

export function checkout(cart) {
  if (cart.length === 0) {
    throw new Error("Your cart is empty");
  }
  const total = subtotal(cart);
  return \`Pay \${formatNaira(total - discountFor(total))}\`;
}
`,
          },
          tests: [
            { label: "addToCart adds new products and increases the quantity of existing ones", check: "const { addToCart } = load('src/lib/cart.js'); const a = addToCart([], { id: 'x', name: 'X', price: 10 }); const b = addToCart(a, { id: 'x', name: 'X', price: 10 }); const c = addToCart(b, { id: 'y', name: 'Y', price: 5 }); return a.length === 1 && a[0].qty === 1 && b.length === 1 && b[0].qty === 2 && c.length === 2 && c[1].id === 'y';", fail: "Look for an existing line with the same id first." },
            { label: "addToCart and removeFromCart never change the cart passed in", check: "const { addToCart, removeFromCart } = load('src/lib/cart.js'); const start = [{ id: 'x', name: 'X', price: 10, qty: 1 }]; const snap = JSON.stringify(start); addToCart(start, { id: 'x', name: 'X', price: 10 }); addToCart(start, { id: 'z', name: 'Z', price: 1 }); removeFromCart(start, 'x'); return JSON.stringify(start) === snap;", fail: "Return new arrays and objects with spread, map and filter instead of push or changing qty in place." },
            { label: "subtotal multiplies price by quantity", check: "const { subtotal } = load('src/lib/cart.js'); return subtotal([{ price: 9500, qty: 2 }, { price: 3200, qty: 1 }]) === 22200 && subtotal([]) === 0 && has('Subtotal: ₦22,200');", fail: "Add up price * qty for every line." },
            { label: "discountFor gives 10% from ₦20,000, else 0", check: "const { discountFor } = load('src/lib/cart.js'); return discountFor(22200) === 2220 && discountFor(20000) === 2000 && discountFor(19999) === 0;", fail: ">= 20000, and round the 10%." },
            { label: "checkout throws for an empty cart and otherwise says what to pay", check: "const { checkout } = load('src/lib/cart.js'); let threw = ''; try { checkout([]); } catch (e) { threw = e.message; } return threw === 'Your cart is empty' && checkout([{ price: 9500, qty: 2 }, { price: 3200, qty: 1 }]) === 'Pay ₦19,980' && has('Pay ₦19,980') && has('Empty cart: Your cart is empty');", fail: "throw new Error(\"Your cart is empty\"), otherwise `Pay ${formatNaira(total - discount)}`." },
          ],
          hint: "Write and check one function at a time. The screen shows your results as you go.",
          successMessage: "A complete, tested cart module. In Module 7 you will build the screen for it too.",
        }),
      },
    ],
    task: {
      title: "Module 3 practical: the cart, on your own computer",
      intro: "Recreate the cart module in your own Expo project from Module 2.",
      prompts: [
        "Create src/lib/cart.js in your project with the five functions, and show the results on your home screen as the lab did.",
        "Add a removeOne(cart, id) function that lowers a line's quantity by one and removes the line when it reaches zero.",
        "Add a delivery fee: free above ₦30,000, otherwise ₦1,500, and include it in checkout's message.",
        "Run the app on your phone with npx expo start, and commit your work to Git.",
        "Mastery checkpoint: read checkout aloud, line by line, and say exactly what it returns for a cart holding two bags of rice.",
      ],
      closing: "Next: Module 4, modern JavaScript, asynchronous code, APIs and an introduction to TypeScript.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
