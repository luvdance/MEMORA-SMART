/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 14 · CONDITIONS AND DECISION-MAKING
 *
 * Curriculum 14.1 – 14.12. Every operator a decision needs, booleans and
 * logic, if, else and else if, nesting, switch, truthy and falsy values, and
 * the conditional operator. Outputs are verified in Node; labs call the
 * learner's functions with boundary values, which is where decisions break.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s14-conditions";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 14.1 – 14.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l60-operators",
    moduleId: "wd-m14-conditions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3"],
    title: "Arithmetic, Assignment and Comparison",
    subtitle: "Calculating, updating values and asking questions about them",
    estimatedMinutes: 22,
    intro: "Decisions are built from comparisons, and comparisons are built from values you have calculated. This lesson covers the three families of operator that do the work.",

    atoms: [
      {
        id: "a-wd-arithmetic",
        title: "Arithmetic operators",
        explain:
          "Beyond + - * and /, two operators matter constantly. % is the remainder after division: 17 % 5 is 2, and n % 2 is 0 exactly when n is even, which is how you test for even numbers or every third row. ** is exponentiation: 2 ** 3 is 8. Division never rounds: 7 / 2 is 3.5. Use brackets whenever the order is not obvious to a reader.",
        codeExercise: {
          language: JS,
          code: "console.log(17 % 5);\nconsole.log(12 % 2);\nconsole.log(2 ** 3);\nconsole.log(7 / 2);\nconsole.log((2 + 3) * 4);\n",
          question: "What does each line print?",
          expectedOutput: "2\n0\n8\n3.5\n20",
          hint: "% is what is left over: 17 is three fives (15) and 2 more.",
          successMessage: "The remainder operator will come back constantly: even and odd, wrapping around, every nth item.",
        },
      },
      {
        id: "a-wd-assignment",
        title: "Assignment operators",
        explain:
          "= assigns a value; it does not compare. Compound operators update a variable using its own value: total += 500 means total = total + 500, and there are -=, *= and /= too. ++ adds one and -- subtracts one, which you will see in loops. These only work on variables declared with let.",
        codeExercise: {
          language: JS,
          code: "let balance = 1000;\nbalance += 500;\nbalance -= 200;\nbalance *= 2;\nlet visits = 0;\nvisits++;\nvisits++;\nconsole.log(balance, visits);\n",
          question: "What are balance and visits at the end?",
          expectedOutput: "2600 2",
          hint: "Work through it: 1000, then 1500, then 1300, then doubled.",
          successMessage: "2600 and 2. Compound assignment reads as \"update this by\", which is how running totals are kept.",
        },
      },
      {
        id: "a-wd-comparison",
        title: "Comparison operators",
        explain:
          "Comparison operators ask a question and answer true or false: > < >= <=, === (strictly equal: same value AND same type) and !== (not strictly equal). Avoid == and !=: they convert types before comparing, so \"5\" == 5 is true, which hides bugs where a number arrived as text. Always use === and !==.",
        table: {
          caption: "Comparison results.",
          headers: ["Expression", "Result", "Why"],
          rows: [
            ["10 >= 10", "true", "Equal counts for >="],
            ["5 === 5", "true", "Same value, same type"],
            ["\"5\" === 5", "false", "A string is not a number"],
            ["\"5\" == 5", "true", "== converts the string first: avoid it"],
            ["\"apple\" < \"banana\"", "true", "Strings compare alphabetically, by character code"],
          ],
        },
        webLab: {
          task:
            "Write three small functions. isEven(n) returns true when n is even, using the remainder operator. applyDiscount(price) returns the price with 10% taken off, rounded is not needed. isExactPin(entered) returns true only when entered is the number 4821, so the string \"4821\" must NOT count: use strict equality.",
          files: { "app.js": "function isEven(n) {\n}\n\nfunction applyDiscount(price) {\n}\n\nfunction isExactPin(entered) {\n}\n" },
          tests: [
            { label: "isEven: 4 and 0 are even, 7 and -3 are not", check: "return isEven(4) === true && isEven(0) === true && isEven(7) === false && isEven(-3) === false;", fail: "Return n % 2 === 0." },
            { label: "isEven uses the remainder operator", check: "return /%/.test(code('app.js'));", fail: "Use % to test for a remainder of 0." },
            { label: "applyDiscount(5000) is 4500 and applyDiscount(1200) is 1080", check: "return applyDiscount(5000) === 4500 && applyDiscount(1200) === 1080;", fail: "Return price * 0.9, or price - price * 0.1." },
            { label: "isExactPin accepts the number 4821 only", check: "return isExactPin(4821) === true && isExactPin(4820) === false;", fail: "Return entered === 4821." },
            { label: "isExactPin rejects the string \"4821\"", check: "return isExactPin('4821') === false && !/[^=!]==[^=]/.test(code('app.js'));", fail: "Use === so that the string \"4821\" is not equal to the number 4821." },
          ],
          solution: { "app.js": "function isEven(n) {\n  return n % 2 === 0;\n}\n\nfunction applyDiscount(price) {\n  return price * 0.9;\n}\n\nfunction isExactPin(entered) {\n  return entered === 4821;\n}\n" },
          hint: "A comparison is itself a value, true or false, so a function can return it directly: return n % 2 === 0;",
          successMessage: "Three operators, three functions, and the strict comparison that refuses to treat text as a number.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 14.4 – 14.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l61-logic-if",
    moduleId: "wd-m14-conditions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.4", "14.5", "14.6"],
    title: "Booleans, Logic and if",
    subtitle: "true and false, combining conditions, and running code only when it should",
    estimatedMinutes: 22,
    intro: "Real rules have more than one condition: free delivery if you are a member OR spend over ₦10,000; access only if logged in AND verified. Logical operators combine conditions, and if acts on the result.",

    atoms: [
      {
        id: "a-wd-booleans",
        title: "Boolean values",
        explain:
          "A boolean is true or false, nothing else. Every comparison produces one, and you can store it in a variable with a name that reads like a question: isMember, hasPaid, canVote. Named booleans make conditions read like sentences: if (hasPaid && isMember).",
        codeExercise: {
          language: JS,
          code: "const age = 17;\nconst isAdult = age >= 18;\nconst hasTicket = true;\nconsole.log(isAdult);\nconsole.log(typeof hasTicket);\nconsole.log(10 > 3);\n",
          question: "What is printed?",
          expectedOutput: "false\nboolean\ntrue",
          hint: "17 >= 18 is a question with an answer.",
          successMessage: "A comparison's answer can be stored, named and reused, which keeps conditions readable.",
        },
      },
      {
        id: "a-wd-logical-operators",
        title: "Logical AND, OR and NOT",
        explain:
          "&& (AND) is true only when both sides are true. || (OR) is true when at least one side is true. ! (NOT) flips true and false. AND has higher precedence than OR, so use brackets when mixing them. Both stop early: in a && b, if a is false, b is never evaluated, which is called short-circuiting.",
        table: {
          caption: "Truth table.",
          headers: ["a", "b", "a && b", "a || b", "!a"],
          rows: [
            ["true", "true", "true", "true", "false"],
            ["true", "false", "false", "true", "false"],
            ["false", "true", "false", "true", "true"],
            ["false", "false", "false", "false", "true"],
          ],
        },
        codeExercise: {
          language: JS,
          code: "const isMember = false;\nconst total = 12000;\nconsole.log(isMember || total >= 10000);\nconsole.log(isMember && total >= 10000);\nconsole.log(!isMember);\n",
          question: "Free delivery is for members OR orders of ₦10,000 and above. What does each line print?",
          expectedOutput: "true\nfalse\ntrue",
          hint: "OR needs one true side; AND needs both.",
          successMessage: "This customer gets free delivery through the OR rule, but not through an AND rule. Choosing AND or OR is choosing the business rule.",
        },
      },
      {
        id: "a-wd-if",
        title: "if statements",
        explain:
          "if (condition) { … } runs the block only when the condition is true; otherwise it is skipped and the program carries on after it. Always use the braces, even for one line: it prevents a classic bug when a second line is added later. Return early from a function with if to handle special cases first.",
        webLab: {
          task:
            "Write two decision functions. canVote(age, isRegistered) returns true only for people aged 18 or over who are registered. freeDelivery(total, isMember) returns true for members, or for anyone spending ₦10,000 or more. Use the logical operators.",
          files: { "app.js": "function canVote(age, isRegistered) {\n}\n\nfunction freeDelivery(total, isMember) {\n}\n" },
          tests: [
            { label: "canVote: 18 and registered can vote", check: "return canVote(18, true) === true && canVote(40, true) === true;", fail: "Both conditions true should return true. 18 itself counts." },
            { label: "canVote: under 18, or not registered, cannot", check: "return canVote(17, true) === false && canVote(30, false) === false && canVote(16, false) === false;", fail: "Both conditions must be true: use &&." },
            { label: "freeDelivery: members always qualify", check: "return freeDelivery(500, true) === true;", fail: "A member should get free delivery whatever the total." },
            { label: "freeDelivery: ₦10,000 or more qualifies for anyone", check: "return freeDelivery(10000, false) === true && freeDelivery(25000, false) === true;", fail: "10000 and above should qualify: use >=." },
            { label: "freeDelivery: non-members under ₦10,000 pay", check: "return freeDelivery(9999, false) === false;", fail: "Only one of the two conditions needs to be true: use ||." },
          ],
          solution: { "app.js": "function canVote(age, isRegistered) {\n  return age >= 18 && isRegistered;\n}\n\nfunction freeDelivery(total, isMember) {\n  return isMember || total >= 10000;\n}\n" },
          hint: "canVote needs both conditions, freeDelivery needs either. You can return the combined condition directly.",
          successMessage: "Each rule is one line, and reads almost exactly like the sentence that describes it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 14.7 – 14.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l62-else",
    moduleId: "wd-m14-conditions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.7", "14.8", "14.9"],
    title: "if...else, else if and Nested Conditions",
    subtitle: "Choosing between two, then many, paths",
    estimatedMinutes: 22,
    intro: "Most decisions have more than one outcome: pass or fail, or a grade from A to F. else and else if choose exactly one path out of several.",

    atoms: [
      {
        id: "a-wd-if-else",
        title: "if...else",
        explain:
          "if (condition) { A } else { B } runs exactly one of the two blocks: A when the condition is true, B when it is false. Use it whenever there are exactly two outcomes.",
        codeExercise: {
          language: JS,
          code: "function result(score) {\n  if (score >= 50) {\n    return \"Pass\";\n  } else {\n    return \"Fail\";\n  }\n}\nconsole.log(result(72));\nconsole.log(result(50));\nconsole.log(result(49));\n",
          question: "What does each call print?",
          expectedOutput: "Pass\nPass\nFail",
          hint: "50 >= 50 is true.",
          successMessage: "Exactly one path every time, and the boundary, 50, lands where the rule says it should.",
        },
      },
      {
        id: "a-wd-else-if",
        title: "else if",
        explain:
          "A chain of if, else if, … else checks conditions top to bottom and runs the FIRST block whose condition is true; the rest are skipped. So order matters: check the highest band first. Put the final else last as a catch-all.",
        codeExercise: {
          language: JS,
          code: "function grade(score) {\n  if (score >= 50) {\n    return \"C\";\n  } else if (score >= 60) {\n    return \"B\";\n  } else if (score >= 70) {\n    return \"A\";\n  } else {\n    return \"F\";\n  }\n}\nconsole.log(grade(85));\n",
          question: "This grading function has a bug. What does grade(85) actually return?",
          expectedOutput: "C",
          hint: "The first condition checked is score >= 50. Is 85 >= 50?",
          successMessage: "C, for 85. The first true condition wins, so the bands must be checked from the highest down. A dry run finds this in seconds.",
        },
      },
      {
        id: "a-wd-nested",
        title: "Nested conditions",
        explain:
          "An if can contain another if. Nesting is natural when one question only makes sense after another: check that a score is valid at all, then decide its grade. But deep nesting is hard to read; often a guard clause (an early return for the special case) or && does the same job flatter.",
        example:
          "// Nested                         // Flatter, with a guard clause\nif (score >= 0 && score <= 100) {   if (score < 0 || score > 100) {\n  if (score >= 70) {                  return \"Invalid\";\n    return \"A\";                     }\n  }                                 if (score >= 70) return \"A\";\n  …                                 …\n} else {\n  return \"Invalid\";\n}",
        webLab: {
          task:
            "Write grade(score) for this scale: 70 and above A, 60 to 69 B, 50 to 59 C, 45 to 49 D, below 45 F. Scores below 0 or above 100 are not valid: return \"Invalid\" for them, checked first. The checks test every boundary.",
          files: { "app.js": "function grade(score) {\n}\n\nconsole.log(grade(65));\n" },
          tests: [
            { label: "Invalid scores return \"Invalid\": -1 and 101", check: "return grade(-1) === 'Invalid' && grade(101) === 'Invalid';", fail: "Check first: if (score < 0 || score > 100) return \"Invalid\";" },
            { label: "0 and 100 are valid: F and A", check: "return grade(0) === 'F' && grade(100) === 'A';", fail: "0 and 100 are inside the valid range." },
            { label: "Boundaries: 70 A, 69 B, 60 B, 59 C", check: "return grade(70) === 'A' && grade(69) === 'B' && grade(60) === 'B' && grade(59) === 'C';", fail: "Check from the highest band down, using >=." },
            { label: "Boundaries: 50 C, 49 D, 45 D, 44 F", check: "return grade(50) === 'C' && grade(49) === 'D' && grade(45) === 'D' && grade(44) === 'F';", fail: "D is 45 to 49; anything below 45 is F." },
          ],
          solution: { "app.js": "function grade(score) {\n  if (score < 0 || score > 100) {\n    return \"Invalid\";\n  }\n  if (score >= 70) {\n    return \"A\";\n  } else if (score >= 60) {\n    return \"B\";\n  } else if (score >= 50) {\n    return \"C\";\n  } else if (score >= 45) {\n    return \"D\";\n  } else {\n    return \"F\";\n  }\n}\n\nconsole.log(grade(65));\n" },
          hint: "Guard clause first, then the bands from A downwards.",
          successMessage: "Every boundary right, and invalid input refused before anything else. That is how real grading systems are written.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 14.10 – 14.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l63-switch-truthy-ternary",
    moduleId: "wd-m14-conditions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.10", "14.11", "14.12"],
    title: "switch, Truthy and Falsy, and the Ternary Operator",
    subtitle: "Matching one value against many, what JavaScript treats as true, and decisions in a single expression",
    estimatedMinutes: 24,
    intro: "Three more tools for decisions: switch for matching exact values, the rules for which values count as true, and the compact ternary operator for choosing between two values.",

    atoms: [
      {
        id: "a-wd-switch",
        title: "switch statements",
        explain:
          "switch compares one value against several exact cases with ===. Each case's code runs until a break (or return). Forgetting break makes execution fall through into the next case, which is occasionally useful (several cases sharing code) and usually a bug. default handles anything not listed. Use switch for exact matches; use if for ranges such as score >= 70.",
        codeExercise: {
          language: JS,
          code: 'function kind(day) {\n  switch (day) {\n    case "Saturday":\n    case "Sunday":\n      return "Weekend";\n    case "Friday":\n      return "Almost weekend";\n    default:\n      return "Weekday";\n  }\n}\nconsole.log(kind("Sunday"));\nconsole.log(kind("Friday"));\nconsole.log(kind("Monday"));\n',
          question: "What does each call print?",
          expectedOutput: "Weekend\nAlmost weekend\nWeekday",
          hint: "Saturday has no code of its own, so it falls through to Sunday's return.",
          successMessage: "Two cases sharing one result through deliberate fall-through, and default catching everything else.",
        },
      },
      {
        id: "a-wd-truthy-falsy",
        title: "Truthy and falsy values",
        explain:
          "In a condition, any value is treated as true or false. Exactly these are falsy: false, 0, \"\" (an empty string), null, undefined and NaN. Everything else is truthy, including \"0\", \"false\", [] and {}. So if (name) means \"if name is not empty\", and || gives a default: name || \"friend\" uses name if it is truthy, otherwise \"friend\". Beware: 0 is falsy, so quantity || 1 turns a real 0 into 1 (Module 25's ?? fixes that).",
        codeExercise: {
          language: JS,
          code: 'console.log(Boolean(""));\nconsole.log(Boolean("0"));\nconsole.log(Boolean(0));\nconsole.log(Boolean([]));\nconst name = "";\nconsole.log(name || "friend");\n',
          question: "Which values are truthy, and what is the last line?",
          expectedOutput: "false\ntrue\nfalse\ntrue\nfriend",
          hint: "Only six values are falsy. A non-empty string is truthy even if it says \"0\".",
          successMessage: "\"0\" is truthy and 0 is not, which surprises everyone once. Knowing the six falsy values removes the surprise.",
        },
      },
      {
        id: "a-wd-ternary",
        title: "The conditional (ternary) operator",
        explain:
          "condition ? valueIfTrue : valueIfFalse is an expression that picks one of two values, so it can sit inside a template, an assignment or a return. Use it for simple two-way choices such as a label or a plural; use if...else when either side does more than produce a value, and never nest ternaries more than once.",
        webLab: {
          task:
            "Write three functions. dayType(day) uses a switch: \"Weekend\" for Saturday and Sunday, \"Weekday\" for anything else. greet(name) returns \"Hello, NAME!\" but uses \"friend\" when name is empty or missing (truthy/falsy). itemsLabel(n) uses the ternary operator to return \"1 item\" for one and \"N items\" otherwise.",
          files: { "app.js": "function dayType(day) {\n}\n\nfunction greet(name) {\n}\n\nfunction itemsLabel(n) {\n}\n" },
          tests: [
            { label: "dayType: Saturday and Sunday are Weekend, others Weekday", check: "return dayType('Saturday') === 'Weekend' && dayType('Sunday') === 'Weekend' && dayType('Monday') === 'Weekday' && dayType('Friday') === 'Weekday';", fail: "Two cases sharing return \"Weekend\", and default returning \"Weekday\"." },
            { label: "dayType uses a switch", check: "return /switch\\s*\\(/.test(code('app.js'));", fail: "Write dayType with switch (day) { … }." },
            { label: "greet uses the name when there is one", check: "return greet('Ada') === 'Hello, Ada!';", fail: "Return \"Hello, \" + name + \"!\"." },
            { label: "greet falls back to friend for \"\" and for no name", check: "return greet('') === 'Hello, friend!' && greet() === 'Hello, friend!';", fail: "Use name || \"friend\": an empty string and undefined are both falsy." },
            { label: "itemsLabel: 1 item, 0 items, 3 items, with a ternary", check: "return itemsLabel(1) === '1 item' && itemsLabel(0) === '0 items' && itemsLabel(3) === '3 items' && /\\?[^:]*:/.test(code('app.js'));", fail: "return n === 1 ? \"1 item\" : n + \" items\";" },
          ],
          solution: { "app.js": 'function dayType(day) {\n  switch (day) {\n    case "Saturday":\n    case "Sunday":\n      return "Weekend";\n    default:\n      return "Weekday";\n  }\n}\n\nfunction greet(name) {\n  return "Hello, " + (name || "friend") + "!";\n}\n\nfunction itemsLabel(n) {\n  return n === 1 ? "1 item" : n + " items";\n}\n' },
          hint: "In greet, wrap name || \"friend\" in brackets before joining it into the string.",
          successMessage: "Three decision tools, each used for the job it is best at: exact matches, defaults and a two-way label.",
        },
      },
    ],

    task: {
      title: "Module project: a shipping-rules engine",
      intro: "In app.js on your own computer, write shippingQuote(weightKg, destination, isMember).",
      prompts: [
        "Return \"Invalid\" for weights of 0 or less, or over 30kg (a guard clause).",
        "Use a switch on destination (Lagos, Abuja, Port Harcourt, other) to set a base price.",
        "Add ₦200 per kg over 5kg, and halve the total for members.",
        "Return a message such as \"₦3,500 · arrives in 2 days\" using a ternary for \"day\" or \"days\".",
        "Test at least ten cases, including every boundary, and write each one down with its expected result before running it.",
      ],
      closing: "Next module: doing things more than once.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
