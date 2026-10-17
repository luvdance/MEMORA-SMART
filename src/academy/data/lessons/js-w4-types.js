/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 4 · DATA TYPES & OPERATORS
 *
 * Curriculum 4.1 – 4.10. Every snippet is executed by the content validator in
 * Node; the outputs below, including the floating-point ones, are real.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s4-types";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 4.1 – 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l12-values-types",
    moduleId: "js-w4-types",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3", "4.4"],
    title: "Values and Their Types",
    subtitle: "Strings, numbers, booleans, undefined, null, and how to tell them apart",
    estimatedMinutes: 15,
    intro:
      "Every value in JavaScript has a type, and the type decides what you can do with it. You can multiply two numbers but not two names. Most beginner bugs this month are type bugs, so this lesson is about recognising every type on sight.",

    atoms: [
      {
        id: "a-js-primitives",
        title: "The seven primitive types",
        explain:
          "A primitive is a simple, single value. JavaScript has seven primitive types. You will use the first five every day; bigint and symbol are specialised and appear only briefly in this course. Everything that is not a primitive is an object, which you will meet in Week 8.",
        table: {
          caption: "The seven primitives.",
          headers: ["Type", "Example values", "Used for"],
          rows: [
            ["string", "\"Ada\", 'Lagos', \"\"", "Text of any kind"],
            ["number", "42, -3, 3.14, 0", "All numbers, whole or decimal"],
            ["boolean", "true, false", "Yes/no answers and conditions"],
            ["undefined", "undefined", "\"No value has been given yet\""],
            ["null", "null", "\"Deliberately empty\""],
            ["bigint", "9007199254740993n", "Whole numbers too big for number"],
            ["symbol", "Symbol(\"id\")", "Unique identifiers (advanced)"],
          ],
        },
        why: "The type of a value is the first thing to check when code behaves strangely. \"5\" and 5 look the same when printed, but one is text and one is a number, and they behave completely differently.",
      },
      {
        id: "a-js-strings-numbers",
        title: "Strings and numbers",
        explain:
          "A string is text inside quotes. Double quotes, single quotes and backticks all work; pick one style and keep to it. A string has a length, the number of characters in it. A number in JavaScript is a single type for both whole numbers and decimals, which is simpler than most languages but has one famous consequence.",
        code: {
          language: JS,
          code: 'const name = "Ngozi";\nconsole.log(name.length);\nconsole.log(7 / 2);\nconsole.log(0.1 + 0.2);\nconsole.log((0.1 + 0.2).toFixed(2));\n',
          expectedOutput: "5\n3.5\n0.30000000000000004\n0.30",
        },
        why: "0.1 + 0.2 is not exactly 0.3 in JavaScript, or in almost any language, because computers store decimals in binary and 0.1 cannot be written exactly in binary, the same way 1/3 cannot be written exactly in decimal. For money, round when you display (toFixed(2)) or calculate in kobo, as whole numbers.",
        mistake:
          "Comparing decimals directly: if (0.1 + 0.2 === 0.3) is false. Compare rounded values, or check whether the difference is tiny.",
      },
      {
        id: "a-js-booleans-undefined-null",
        title: "Booleans, undefined and null",
        explain:
          "A boolean is one of exactly two values, true or false. Every comparison produces one. undefined means a value has not been given: a variable declared with no value, or a property that does not exist. null means \"empty, on purpose\": a programmer wrote null to say there is deliberately nothing here.",
        code: {
          language: JS,
          code: "const isAdult = 20 >= 18;\nconsole.log(isAdult);\n\nlet middleName;\nconsole.log(middleName);\n\nlet selectedCourse = null;\nconsole.log(selectedCourse);\n",
          expectedOutput: "true\nundefined\nnull",
        },
        why: "The difference tells you whose decision it was. undefined usually means JavaScript is telling you something was never set, which is often a bug. null means a programmer chose emptiness, such as \"no course selected yet\".",
        table: {
          caption: "Where you will meet each one.",
          headers: ["Value", "Typical source"],
          rows: [
            ["undefined", "let x; with no value, a missing property, a function with no return"],
            ["null", "Set deliberately by code; prompt() when the user presses Cancel"],
          ],
        },
      },
      {
        id: "a-js-typeof",
        title: "typeof: asking a value its type",
        explain:
          "The typeof operator gives back the type of a value, as a string. It is how you check what you are dealing with when something misbehaves. It has one well-known quirk: typeof null is \"object\". That is a bug from the very first version of JavaScript in 1995, kept ever since because fixing it would break existing websites.",
        codeExercise: {
          language: JS,
          code: 'console.log(typeof "42");\nconsole.log(typeof 42);\nconsole.log(typeof true);\nconsole.log(typeof undefined);\nconsole.log(typeof null);\n',
          question: "Predict all five lines. Remember the quirk.",
          expectedOutput: "string\nnumber\nboolean\nundefined\nobject",
          hint: "\"42\" is in quotes. And null is the historical exception: it does not report \"null\".",
          successMessage:
            "All five, quirk included. To check for null specifically, write value === null rather than relying on typeof.",
        },
      },
      {
        id: "a-js-type-inspection",
        title: "Type inspection in practice",
        explain:
          "When a calculation gives a strange result, print the value AND its type side by side. The type usually explains the result immediately. This is the same debugging method as Week 1: find the first value that is not what you expected.",
        code: {
          language: JS,
          code: 'const quantity = "3";\nconst price = 500;\nconsole.log(quantity, typeof quantity);\nconsole.log(price, typeof price);\nconsole.log(quantity + price);\n',
          expectedOutput: "3 string\n500 number\n3500",
        },
        why: "The total should be 1500, or at least 503, but it is 3500. The type check explains why: quantity is the string \"3\", so + joins \"3\" and 500 into \"3500\". Whenever input comes from a user, a form or a file, check its type before you do arithmetic.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.5 – 4.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l13-operators",
    moduleId: "js-w4-types",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.5", "4.6", "4.7", "4.8"],
    title: "Operators",
    subtitle: "Arithmetic, assignment, comparison, logic, and the order they run in",
    estimatedMinutes: 16,
    intro:
      "Operators are the symbols that do things to values: + adds, > compares, && combines. You met most of them as pseudocode in Week 2. This lesson gives you their JavaScript spelling, and the two places where JavaScript differs from what you would expect.",

    atoms: [
      {
        id: "a-js-arithmetic-ops",
        title: "Arithmetic operators",
        explain:
          "JavaScript has the four familiar operators plus % for the remainder (MOD in Week 2) and ** for powers. There is no separate whole-number division operator; use Math.floor(a / b) for DIV. Dividing by zero does not crash: it gives Infinity. Arithmetic on something that is not a number gives NaN, meaning \"Not a Number\".",
        table: {
          caption: "Arithmetic in JavaScript.",
          headers: ["Operator", "Meaning", "Example", "Result"],
          rows: [
            ["+", "Add", "7 + 2", "9"],
            ["-", "Subtract", "7 - 2", "5"],
            ["*", "Multiply", "7 * 2", "14"],
            ["/", "Divide", "7 / 2", "3.5"],
            ["%", "Remainder", "7 % 2", "1"],
            ["**", "Power", "2 ** 3", "8"],
          ],
        },
        code: {
          language: JS,
          code: 'console.log(17 % 5);\nconsole.log(Math.floor(17 / 5));\nconsole.log(2 ** 10);\nconsole.log(10 / 0);\nconsole.log("abc" * 2);\n',
          expectedOutput: "2\n3\n1024\nInfinity\nNaN",
        },
        mistake:
          "Expecting a crash when dividing by zero. JavaScript returns Infinity and carries on, so a total of Infinity on a receipt is a bug that no error message will warn you about. Check for zero yourself before dividing.",
      },
      {
        id: "a-js-assignment-ops",
        title: "Assignment operators",
        explain:
          "= stores a value. The compound operators update a variable using its own value: total += 500 means total = total + 500. There are versions for every arithmetic operator. ++ adds exactly one and -- subtracts exactly one, which is how loop counters are usually written.",
        codeExercise: {
          language: JS,
          code: "let balance = 1000;\nbalance += 500;\nbalance -= 200;\nbalance *= 2;\nconsole.log(balance);\n\nlet visits = 0;\nvisits++;\nvisits++;\nconsole.log(visits);\n",
          question: "Apply each update in order. What is printed?",
          expectedOutput: "2600\n2",
          hint: "1000 + 500 = 1500, then subtract 200, then double the result.",
          successMessage: "2600 and 2. Each compound operator reads the current value, updates it and stores it back, exactly like SET balance TO balance + 500.",
        },
      },
      {
        id: "a-js-comparison-ops",
        title: "Comparison operators, and === versus ==",
        explain:
          "Comparisons produce a boolean. The important JavaScript detail: always use === for \"is equal to\" and !== for \"is not equal to\". These are strict: they are only true when the values AND the types are the same. The older == and != try to convert types first, which produces results nobody expects. Week 9 looks at the rules; until then, use ===.",
        code: {
          language: JS,
          code: 'console.log(5 === 5);\nconsole.log(5 === "5");\nconsole.log(5 == "5");\nconsole.log(5 !== 3);\nconsole.log(10 >= 10);\nconsole.log("apple" < "banana");\n',
          expectedOutput: "true\nfalse\ntrue\ntrue\ntrue\ntrue",
        },
        why: "5 == \"5\" is true because == converts the string to a number before comparing. That sounds helpful until a form sends the text \"0\" and == treats it as equal to false. === never converts, so it never surprises you. Strings compare alphabetically, by character code, which is why \"apple\" < \"banana\".",
        mistake:
          "Writing if (x = 5) when you mean if (x === 5). A single = is assignment: it stores 5 in x, and the condition is always truthy. It is one of the most common bugs in every C-style language.",
      },
      {
        id: "a-js-logical-ops",
        title: "Logical operators: &&, || and !",
        explain:
          "AND, OR and NOT from Week 2 are written && , || and ! in JavaScript. They combine conditions exactly as the truth table said. They also short-circuit: && stops as soon as it finds something false, and || stops as soon as it finds something true, because the rest cannot change the answer.",
        code: {
          language: JS,
          code: "const age = 20;\nconst hasTicket = true;\nconst isBanned = false;\n\nconsole.log(age >= 18 && hasTicket);\nconsole.log(age < 18 || hasTicket);\nconsole.log(!isBanned);\nconsole.log(age >= 18 && hasTicket && !isBanned);\n",
          expectedOutput: "true\ntrue\ntrue\ntrue",
        },
        why: "Short-circuiting matters in real code. In user && user.name, if user does not exist, && stops before trying to read .name, which would otherwise crash. You will use that pattern constantly once you meet objects.",
        decision: {
          scenario: "A discount applies to members who spend at least 10,000, and to anyone during a sale. Variables: isMember, total, isSale.",
          question: "Which condition is correct?",
          options: [
            {
              id: "a",
              text: "(isMember && total >= 10000) || isSale",
              why: "Members must meet BOTH requirements, so they are joined with &&; the sale is an alternative, so it joins with ||. The brackets make the grouping explicit.",
            },
            {
              id: "b",
              text: "isMember || total >= 10000 || isSale",
              whyWrong: "This gives the discount to any member regardless of spend, and to any non-member who spends 10,000. Both requirements must hold together.",
            },
            {
              id: "c",
              text: "isMember && total >= 10000 && isSale",
              whyWrong: "This only gives a discount to members who spend enough DURING a sale, which is much narrower than the rule.",
            },
            {
              id: "d",
              text: "isMember && (total >= 10000 || isSale)",
              whyWrong: "The brackets are in the wrong place. Non-members would never get the sale discount, because isMember must be true for anything to pass.",
            },
          ],
          correct: "a",
          aftermath: "When && and || appear together, always add brackets, even where the precedence rules would give the right answer. They are for the reader.",
        },
      },
      {
        id: "a-js-precedence",
        title: "Operator precedence",
        explain:
          "When an expression has several operators, precedence decides which runs first. The order is the one from maths, extended: brackets first, then **, then * / %, then + -, then comparisons, then &&, then ||, and assignment last of all. When in doubt, add brackets: they are never wrong and always clearer.",
        table: {
          caption: "Precedence, highest first.",
          headers: ["Level", "Operators"],
          rows: [
            ["1 (first)", "( ) brackets"],
            ["2", "! (NOT), and ++ / --"],
            ["3", "** power"],
            ["4", "* / %"],
            ["5", "+ -"],
            ["6", "< <= > >="],
            ["7", "=== !=="],
            ["8", "&&"],
            ["9", "||"],
            ["10 (last)", "= += -= and the other assignments"],
          ],
        },
        codeExercise: {
          language: JS,
          code: "console.log(2 + 3 * 4 ** 2);\nconsole.log((2 + 3) * 4);\nconsole.log(10 - 4 - 3);\nconsole.log(3 > 2 && 5 < 1 || true);\n",
          question: "Apply the precedence table to each line. What is printed?",
          expectedOutput: "50\n20\n3\ntrue",
          hint: "Line 1: 4 ** 2 first, then the multiplication, then the addition. Line 3: equal operators go left to right. Line 4: comparisons first, then &&, then ||.",
          successMessage:
            "50, 20, 3, true. Line 4 is the kind nobody should have to work out in their head: write (3 > 2 && 5 < 1) || true and the meaning is obvious.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 4.9 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l14-conversion-templates",
    moduleId: "js-w4-types",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.9", "4.10"],
    title: "Type Conversion and Template Literals",
    subtitle: "Changing types on purpose, and building text cleanly",
    estimatedMinutes: 15,
    intro:
      "JavaScript will convert types for you whether you ask or not, and the results are a famous source of confusion. This lesson teaches you to convert deliberately, to recognise when JavaScript has converted behind your back, and then a much cleaner way to build text.",

    atoms: [
      {
        id: "a-js-explicit-conversion",
        title: "Converting on purpose",
        explain:
          "Explicit conversion means you choose the type. Number() turns text into a number, giving NaN if it cannot. parseInt() and parseFloat() read a number from the start of some text and stop at the first character that does not fit. String() turns anything into text. Boolean() turns anything into true or false.",
        code: {
          language: JS,
          code: 'console.log(Number("42"));\nconsole.log(Number("42abc"));\nconsole.log(Number(""));\nconsole.log(parseInt("42px"));\nconsole.log(parseFloat("3.5kg"));\nconsole.log(String(99) + 1);\nconsole.log(Boolean(0), Boolean("hi"));\n',
          expectedOutput: "42\nNaN\n0\n42\n3.5\n991\nfalse true",
        },
        why: "Every value from prompt(), a form field or a URL arrives as a string. Converting it with Number() the moment it arrives, and checking for NaN, is the single habit that prevents most arithmetic bugs in web apps.",
        mistake:
          "Checking for NaN with value === NaN. NaN is the only value in JavaScript that is not equal to itself, so that is always false. Use Number.isNaN(value).",
      },
      {
        id: "a-js-coercion",
        title: "Coercion: when JavaScript converts for you",
        explain:
          "Coercion is automatic conversion. The rule that explains most of it: + prefers text, so if either side is a string, it joins. Every other arithmetic operator (- * / %) only works on numbers, so it converts strings to numbers. That is why \"5\" + 2 and \"5\" - 2 give completely different answers.",
        codeExercise: {
          language: JS,
          code: 'console.log("5" + 2);\nconsole.log("5" - 2);\nconsole.log("5" * "2");\nconsole.log(true + 1);\nconsole.log("3" + 4 + 5);\nconsole.log(3 + 4 + "5");\n',
          question: "Apply the rule: + joins if either side is text, the others convert to numbers. Work left to right. What is printed?",
          expectedOutput: "52\n3\n10\n2\n345\n75",
          hint: "true becomes 1 in arithmetic. For the last two lines, go strictly left to right: is the left side text yet?",
          successMessage:
            "All six. The last two are the clearest proof that + is evaluated left to right: \"3\" + 4 is already text, so 5 is joined; 3 + 4 is the number 7 before \"5\" arrives.",
        },
      },
      {
        id: "a-js-template-literals",
        title: "Template literals",
        explain:
          "A template literal is a string written between backticks ` instead of quotes. Inside it, ${ } inserts the value of any expression. This is called string interpolation. It replaces long chains of + with text that reads the way it will look.",
        code: {
          language: JS,
          code: 'const name = "Tolu";\nconst items = 3;\nconst price = 1500;\n\nconsole.log("Hi " + name + ", your " + items + " items cost " + items * price + ".");\nconsole.log(`Hi ${name}, your ${items} items cost ${items * price}.`);\n',
          expectedOutput: "Hi Tolu, your 3 items cost 4500.\nHi Tolu, your 3 items cost 4500.",
        },
        why: "Same output, but the template literal shows exactly where the spaces and punctuation go, and the arithmetic inside ${ } happens before the result is inserted, so the \"5\" + 5 trap from last week cannot happen.",
      },
      {
        id: "a-js-template-multiline",
        title: "Multi-line text and formatting numbers",
        explain:
          "Template literals can span several lines: the line breaks are kept. Combined with toFixed(), which formats a number with a fixed number of decimal places, and toLocaleString(), which adds thousands separators, you can produce output that looks like a real receipt.",
        codeExercise: {
          language: JS,
          code: 'const subtotal = 12000;\nconst tax = subtotal * 0.075;\nconst receipt = `Subtotal: ${subtotal}\nTax: ${tax.toFixed(2)}\nTotal: ${(subtotal + tax).toFixed(2)}`;\nconsole.log(receipt);\n',
          question: "The template literal spans three lines. What does it print?",
          expectedOutput: "Subtotal: 12000\nTax: 900.00\nTotal: 12900.00",
          hint: "7.5% of 12000 is 900. toFixed(2) always shows exactly two decimal places.",
          successMessage: "Three lines, two decimal places where it matters. toFixed returns a string, which is exactly what you want for display, and never what you want for further arithmetic.",
        },
      },
      {
        id: "a-js-shopping-calculator",
        title: "The shopping cost calculator",
        explain:
          "This week's mini-project, worked. It calculates a subtotal, applies a 10% discount when the subtotal is 10,000 or more, adds 7.5% VAT to the discounted amount, and prints the final price. Every operator from this week appears in it.",
        code: {
          language: JS,
          code: 'const DISCOUNT_RATE = 0.1;\nconst DISCOUNT_THRESHOLD = 10000;\nconst VAT_RATE = 0.075;\n\nconst shirtPrice = 4500;\nconst shirtQty = 2;\nconst capPrice = 3000;\nconst capQty = 1;\n\nconst subtotal = shirtPrice * shirtQty + capPrice * capQty;\nconst discount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;\nconst afterDiscount = subtotal - discount;\nconst vat = afterDiscount * VAT_RATE;\nconst finalPrice = afterDiscount + vat;\n\nconsole.log(`Subtotal:  ${subtotal.toFixed(2)}`);\nconsole.log(`Discount: -${discount.toFixed(2)}`);\nconsole.log(`VAT:       ${vat.toFixed(2)}`);\nconsole.log(`Total:     ${finalPrice.toFixed(2)}`);\n',
          expectedOutput: "Subtotal:  12000.00\nDiscount: -1200.00\nVAT:       810.00\nTotal:     11610.00",
        },
        why: "The constants at the top mean the shop can change its discount or the VAT rate by editing one line. The ? : on the discount line is the ternary operator, a one-line if/else you will study properly next week; read it as \"if the subtotal is at least the threshold, take 10%, otherwise 0\".",
      },
    ],

    task: {
      title: "Mini-project: shopping cost calculator",
      intro:
        "Write your own calculator in shopping.js and run it with Node.js.",
      prompts: [
        "Store at least three products, each with a price and a quantity, using const.",
        "Calculate the subtotal with the arithmetic operators, and print it.",
        "Apply a discount using a rule of your own (for example 5% over 5,000 and 10% over 10,000), and print the discount.",
        "Add 7.5% VAT to the discounted amount and print the final price with toFixed(2), using template literals for every line.",
        "Then make one quantity a string, \"2\" instead of 2, run it again, and explain in a comment exactly which line the output went wrong on and why. Fix it with Number().",
      ],
      closing:
        "That last step is the week in one exercise: values have types, operators behave according to them, and the fix is to convert deliberately.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
