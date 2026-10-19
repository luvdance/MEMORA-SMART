/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 19 · PROBLEM-SOLVING AND ALGORITHMS
 *
 * Curriculum 19.1 – 19.12. A method for unfamiliar problems: decompose,
 * pin down the requirements, the inputs and outputs, trace by hand and
 * write test cases; then the classic beginner algorithms (maximum and
 * minimum, counting, searching, sorting, reversal and palindromes, number
 * classification) and a first look at efficiency. One lab asks the learner
 * to write the TEST CASES, and checks that they would catch a real bug.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s19-problem-solving";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 80 · 19.1 – 19.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l80-requirements",
    moduleId: "wd-m19-problem-solving",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["19.1", "19.2", "19.3"],
    title: "Breaking Problems Down and Pinning Down Requirements",
    subtitle: "What exactly is being asked, what comes in and what must come out",
    estimatedMinutes: 24,
    intro: "Faced with a problem you have never seen, the worst move is to start typing. This module gives you a method that works on any problem, then practises it on the classic ones.",

    atoms: [
      {
        id: "a-wd-break-down",
        title: "Breaking problems into smaller tasks",
        explain:
          "Split a problem until each piece is small enough to solve on its own, then solve the pieces and combine them. \"Build a password checker\" becomes: measure the length, check for a digit, check for an upper-case letter, check for a symbol, combine the results into a rating. Each piece is a function you can write and test in a few minutes.",
      },
      {
        id: "a-wd-requirements",
        title: "Understanding requirements",
        explain:
          "Requirements are the exact rules the solution must satisfy. Vague requirements produce wrong programs. Before coding, write each rule as a testable statement, and ask about the edge cases nobody mentioned: what about an empty password? Spaces? Exactly eight characters? If you cannot ask, write down the assumption you made.",
        decision: {
          scenario: "A client says: \"Passwords must be long enough and not too simple.\"",
          question: "What should you do before writing code?",
          options: [
            { id: "a", text: "Turn it into precise rules and confirm them: at least 8 characters, at least one digit and one capital letter; what counts as \"strong\"?", why: "\"Long enough\" and \"too simple\" cannot be tested. Precise rules can be, and agreeing them first avoids rewriting the code later." },
            { id: "b", text: "Guess and start coding", whyWrong: "You will build your own idea of the rules, which may not be the client's." },
            { id: "c", text: "Accept every password to be safe", whyWrong: "That ignores the requirement completely." },
            { id: "d", text: "Copy the rules from a random website", whyWrong: "They may not match this client's needs; agree them with the client." },
          ],
          correct: "a",
          aftermath: "A requirement you can test is a requirement you can meet.",
        },
      },
      {
        id: "a-wd-inputs-outputs",
        title: "Identifying inputs and expected outputs",
        explain:
          "For each piece, write down what goes in (its type and range) and what must come out, with examples. \"passwordStrength(text: a string) → \"weak\" | \"medium\" | \"strong\"\" plus a table of example passwords and their ratings is a specification you can code against and test.",
        table: {
          caption: "A specification for passwordStrength(password).",
          headers: ["Input", "Rule met", "Output"],
          rows: [
            ["\"abc\"", "Under 8 characters", "weak"],
            ["\"sunshine\"", "8+ characters, no digit or capital", "weak"],
            ["\"sunshine7\"", "8+ characters and a digit OR a capital", "medium"],
            ["\"Sunshine7\"", "8+ characters, a digit AND a capital", "strong"],
          ],
        },
        webLab: {
          task:
            "Implement passwordStrength(password) to the specification table above: under 8 characters is \"weak\"; 8 or more with neither a digit nor a capital letter is \"weak\"; 8 or more with one of the two is \"medium\"; 8 or more with both is \"strong\". Break it into small helper functions such as hasDigit and hasCapital.",
          files: { "app.js": "function passwordStrength(password) {\n}\n\nconsole.log(passwordStrength(\"Sunshine7\"));\n" },
          tests: [
            { label: "Short passwords are weak, even with digits and capitals", check: "return passwordStrength('abc') === 'weak' && passwordStrength('Ab1') === 'weak' && passwordStrength('Abcdef1') === 'weak';", fail: "Anything under 8 characters is weak: check length first." },
            { label: "8+ characters with no digit or capital is weak", check: "return passwordStrength('sunshine') === 'weak';", fail: "Long but simple is still weak." },
            { label: "8+ characters with only a digit, or only a capital, is medium", check: "return passwordStrength('sunshine7') === 'medium' && passwordStrength('Sunshine') === 'medium';", fail: "One of the two extra rules gives medium." },
            { label: "8+ characters with a digit and a capital is strong", check: "return passwordStrength('Sunshine7') === 'strong' && passwordStrength('12345678A') === 'strong';", fail: "Both rules together give strong." },
            { label: "Exactly 8 characters counts as long enough", check: "return passwordStrength('Abcdefg1') === 'strong';", fail: "8 or more means >= 8." },
          ],
          solution: { "app.js": "const hasDigit = (text) => /[0-9]/.test(text);\nconst hasCapital = (text) => /[A-Z]/.test(text);\n\nfunction passwordStrength(password) {\n  if (password.length < 8) return \"weak\";\n  const extras = [hasDigit(password), hasCapital(password)].filter(Boolean).length;\n  if (extras === 2) return \"strong\";\n  if (extras === 1) return \"medium\";\n  return \"weak\";\n}\n\nconsole.log(passwordStrength(\"Sunshine7\"));\n" },
          hint: "To check for a digit without regular expressions, loop over the characters and test \"0123456789\".includes(ch); for a capital, ch !== ch.toLowerCase().",
          successMessage: "Specification first, small helpers second, the combining function last. That order works on problems far bigger than this one.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 81 · 19.4 – 19.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l81-trace-tests",
    moduleId: "wd-m19-problem-solving",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["19.4", "19.5"],
    title: "Tracing Code and Building Test Cases",
    subtitle: "Running a program in your head, and choosing inputs that find bugs",
    estimatedMinutes: 24,
    intro: "Two habits make you trustworthy as a programmer: you can predict what code does before running it, and you test it with inputs chosen to break it, not to flatter it.",

    atoms: [
      {
        id: "a-wd-tracing",
        title: "Tracing code manually",
        explain:
          "Tracing (a dry run) means executing code by hand, line by line, keeping a table of every variable's value after each step. It is how you understand unfamiliar code and how you find logic errors without a computer. Write one row per loop iteration; the bug usually shows itself as a value that is not what you expected.",
        codeExercise: {
          language: JS,
          code: "let a = 0;\nlet b = 1;\nfor (let i = 0; i < 5; i++) {\n  const next = a + b;\n  a = b;\n  b = next;\n}\nconsole.log(a, b);\n",
          question: "Trace the loop with a table of a and b after each of the five iterations. What is printed?",
          expectedOutput: "5 8",
          hint: "After each iteration (a, b) becomes (1, 1), (1, 2), (2, 3), (3, 5), (5, 8).",
          successMessage: "This is the Fibonacci sequence. A five-row table made it obvious; reading the loop alone would not have.",
        },
      },
      {
        id: "a-wd-test-cases",
        title: "Building test cases",
        explain:
          "A good set of test cases covers: typical inputs, boundaries (the exact values where behaviour changes), edge cases (empty, zero, one item, very large) and invalid input. Write the expected output for each BEFORE running the code. A test that only uses easy, typical values will pass even when the code is wrong.",
        webLab: {
          task:
            "A year is a leap year if it is divisible by 4, EXCEPT years divisible by 100, which are not, EXCEPT years divisible by 400, which are. Write the test cases in the cases array: each is { year, expected }. Your cases must all pass against a correct isLeapYear, and must be good enough to catch a common buggy version that only checks \"divisible by 4\". Include at least six cases.",
          files: { "app.js": "// Each case: { year: 2024, expected: true }\nconst cases = [\n  { year: 2024, expected: true },\n];\n" },
          tests: [
            { label: "At least six test cases, each with a year and an expected true or false", check: "return Array.isArray(cases) && cases.length >= 6 && cases.every((c) => Number.isInteger(c.year) && typeof c.expected === 'boolean');", fail: "Add more cases, each { year: …, expected: true or false }." },
            { label: "Every case is right for a correct leap-year function", check: "const ok = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; return cases.every((c) => ok(c.year) === c.expected);", fail: "One of your expected values is wrong. Work each year out by the three rules." },
            { label: "Your cases catch the buggy version that only checks divisibility by 4", check: "const bad = (y) => y % 4 === 0; return cases.some((c) => bad(c.year) !== c.expected);", fail: "Every case gives the same answer for the buggy version. Include a century year that is NOT a leap year, such as 1900." },
            { label: "Your cases also catch a version that forgets the 400 rule", check: "const bad = (y) => y % 4 === 0 && y % 100 !== 0; return cases.some((c) => bad(c.year) !== c.expected);", fail: "Include a year divisible by 400, such as 2000, which IS a leap year." },
            { label: "Your cases include an ordinary non-leap year", check: "return cases.some((c) => c.year % 4 !== 0 && c.expected === false);", fail: "Include a typical non-leap year, such as 2023." },
          ],
          solution: { "app.js": "// Each case: { year: 2024, expected: true }\nconst cases = [\n  { year: 2024, expected: true },\n  { year: 2023, expected: false },\n  { year: 1900, expected: false },\n  { year: 2100, expected: false },\n  { year: 2000, expected: true },\n  { year: 1600, expected: true },\n];\n" },
          hint: "Think about which years make each rule matter: one divisible by 4 only, one by 100 but not 400, one by 400.",
          successMessage: "Your tests would catch two real, common bugs. Choosing inputs that make each rule matter is the core of testing, and Module 28 automates it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 82 · 19.6 – 19.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l82-max-count-search",
    moduleId: "wd-m19-problem-solving",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["19.6", "19.7", "19.8"],
    title: "Maximum, Minimum, Counting and Searching",
    subtitle: "Three algorithms behind half of all data processing",
    estimatedMinutes: 24,
    intro: "Find the best score. Count how many times each answer was chosen. Find where an item is in a list. These are the first algorithms every programmer learns, and they appear everywhere.",

    atoms: [
      {
        id: "a-wd-max-min",
        title: "Finding maximum and minimum values",
        explain:
          "To find the largest value, start with the first element as the best so far, then look at each remaining element and replace the best whenever one is bigger. Start with the first element, not 0, or a list of negative numbers gives the wrong answer. Math.max(...values) does this for plain numbers; for objects (the highest-paid order) you write the loop or use reduce.",
        codeExercise: {
          language: JS,
          code: "function maxOf(values) {\n  let best = 0;\n  for (const v of values) {\n    if (v > best) best = v;\n  }\n  return best;\n}\nconsole.log(maxOf([4, 9, 2]));\nconsole.log(maxOf([-5, -2, -8]));\n",
          question: "This maximum function has a bug. What does it print?",
          expectedOutput: "9\n0",
          hint: "For the second list, is any value bigger than the starting best of 0?",
          successMessage: "0 is not even in the second list. Starting from values[0] instead of 0 fixes it.",
        },
      },
      {
        id: "a-wd-counting",
        title: "Counting occurrences",
        explain:
          "To count how many times each value appears, use an object as a tally: for each item, counts[item] = (counts[item] || 0) + 1. The keys are the values seen and the numbers are their counts. A Map does the same with any kind of key (Module 25).",
        codeExercise: {
          language: JS,
          code: 'const votes = ["jollof", "suya", "jollof", "amala", "jollof", "suya"];\nconst counts = {};\nfor (const v of votes) {\n  counts[v] = (counts[v] || 0) + 1;\n}\nconsole.log(counts);\n',
          question: "What is the tally?",
          expectedOutput: "{ jollof: 3, suya: 2, amala: 1 }",
          hint: "The first time a dish appears, counts[v] is undefined, so (undefined || 0) + 1 is 1.",
          successMessage: "A tally in four lines: the pattern behind every poll, word count and report by category.",
        },
      },
      {
        id: "a-wd-searching",
        title: "Searching arrays",
        explain:
          "Linear search checks each element in turn until it finds a match, returning its index, or -1 if there is none. It works on any list and takes longer the longer the list. indexOf, includes and findIndex are linear searches built in. On a SORTED list, binary search is far faster: check the middle, then discard the half that cannot contain the target, repeating until found.",
        webLab: {
          task:
            "Write three algorithms by hand, without Math.max, Math.min or indexOf. highestScorer(students) returns the NAME of the student with the highest score. tally(items) returns an object counting each item. search(list, target) returns the index of target using a linear search, or -1.",
          files: { "app.js": "function highestScorer(students) {\n}\n\nfunction tally(items) {\n}\n\nfunction search(list, target) {\n}\n" },
          tests: [
            { label: "highestScorer finds the top student's name", check: "return highestScorer([{ name: 'Ada', score: 72 }, { name: 'Bayo', score: 91 }, { name: 'Chika', score: 88 }]) === 'Bayo';", fail: "Keep the best student so far, starting from the first, and compare scores." },
            { label: "highestScorer works when every score is negative", check: "return highestScorer([{ name: 'A', score: -5 }, { name: 'B', score: -1 }]) === 'B';", fail: "Start from the first student, not from a score of 0." },
            { label: "tally counts each item", check: "const t = tally(['a', 'b', 'a', 'c', 'a']); return t.a === 3 && t.b === 1 && t.c === 1 && Object.keys(t).length === 3 && Object.keys(tally([])).length === 0;", fail: "counts[item] = (counts[item] || 0) + 1 for each item." },
            { label: "search returns the index, or -1", check: "return search(['x', 'y', 'z'], 'z') === 2 && search(['x'], 'q') === -1 && search([], 'x') === -1;", fail: "Loop with an index and return it when list[i] === target; return -1 after the loop." },
            { label: "Written by hand: no Math.max, Math.min, indexOf or findIndex", check: "return !/Math\\.max|Math\\.min|indexOf|findIndex/.test(code('app.js'));", fail: "Write the loops yourself for this practice." },
          ],
          solution: { "app.js": "function highestScorer(students) {\n  let best = students[0];\n  for (const s of students) {\n    if (s.score > best.score) best = s;\n  }\n  return best.name;\n}\n\nfunction tally(items) {\n  const counts = {};\n  for (const item of items) {\n    counts[item] = (counts[item] || 0) + 1;\n  }\n  return counts;\n}\n\nfunction search(list, target) {\n  for (let i = 0; i < list.length; i++) {\n    if (list[i] === target) return i;\n  }\n  return -1;\n}\n" },
          hint: "highestScorer keeps the best STUDENT object, so it can return the name at the end.",
          successMessage: "Three classic algorithms, written from scratch. Now you know what the built-in methods do inside.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 83 · 19.9 – 19.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l83-classic-algorithms",
    moduleId: "wd-m19-problem-solving",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["19.9", "19.10", "19.11", "19.12"],
    title: "Sorting, Palindromes, Number Problems and Efficiency",
    subtitle: "Classic exercises, and how to tell a fast solution from a slow one",
    estimatedMinutes: 28,
    intro: "These are the problems that appear in every beginner interview. Each is small, and each teaches a way of thinking you will reuse.",

    atoms: [
      {
        id: "a-wd-sorting",
        title: "Basic sorting concepts",
        explain:
          "Sorting puts items in order by comparing and swapping. Bubble sort, the simplest, repeatedly walks the list swapping neighbours that are out of order until a full pass makes no swaps; the largest values \"bubble\" to the end. It is slow on big lists but shows the idea. In practice use array.sort with a compare function, and remember that without one, sort compares as STRINGS: [10, 9, 1].sort() gives [1, 10, 9].",
        codeExercise: {
          language: JS,
          code: "console.log([10, 9, 1, 100].sort());\nconsole.log([10, 9, 1, 100].sort((a, b) => a - b));\nconsole.log([\"Musa\", \"ada\", \"Bayo\"].sort());\n",
          question: "What does each sort produce?",
          expectedOutput: "[ 1, 10, 100, 9 ]\n[ 1, 9, 10, 100 ]\n[ 'Bayo', 'Musa', 'ada' ]",
          hint: "Without a compare function, values are compared as text, character by character, and capital letters come before lower-case ones.",
          successMessage: "Always pass (a, b) => a - b for numbers. For names, a.localeCompare(b) sorts the way people expect.",
        },
      },
      {
        id: "a-wd-palindrome",
        title: "String reversal and palindrome checking",
        explain:
          "To reverse a string, split it into characters, reverse the array and join it: text.split(\"\").reverse().join(\"\"). A palindrome reads the same forwards and backwards (racecar, \"Madam\"). To check one fairly, first normalise: lower-case it and remove anything that is not a letter or digit, then compare it with its reverse.",
      },
      {
        id: "a-wd-number-classification",
        title: "Number classification problems",
        explain:
          "Classifying numbers means deciding which group each belongs to: even or odd (n % 2), positive, negative or zero, prime or not. A prime has exactly two divisors, 1 and itself, so 1 is not prime; to test n, try dividing by every whole number from 2 up to the square root of n, because any larger factor would pair with a smaller one you have already tried. FizzBuzz, the most famous interview question, is a classification problem too.",
        codeExercise: {
          language: JS,
          code: "for (let n = 1; n <= 15; n++) {\n  if (n % 15 === 0) console.log(\"FizzBuzz\");\n  else if (n % 3 === 0) console.log(\"Fizz\");\n  else if (n % 5 === 0) console.log(\"Buzz\");\n  else if (n === 7) console.log(n);\n}\n",
          question: "FizzBuzz, printing only the words and the number 7. What is printed, in order?",
          expectedOutput: "Fizz\nBuzz\nFizz\n7\nFizz\nBuzz\nFizz\nFizzBuzz",
          hint: "Multiples of 3: 3, 6, 9, 12. Of 5: 5, 10. Of both: 15. And 7 on its own.",
          successMessage: "The 15 check comes first, because a multiple of 15 is also a multiple of 3: ordering conditions from most specific to least.",
        },
      },
      {
        id: "a-wd-efficiency",
        title: "Algorithm efficiency fundamentals",
        explain:
          "Efficiency is how the work grows as the input grows. One loop over n items does about n steps (linear, written O(n)). A loop inside a loop over the same items does about n × n (quadratic, O(n²)): fine for 10 items, painful for 100,000. For a web page, the usual win is avoiding a nested loop by using a lookup: build an object or Set once, then check membership in one step.",
        table: {
          caption: "How work grows.",
          headers: ["Approach", "Steps for 100 items", "Steps for 100,000 items"],
          rows: [
            ["One loop: O(n)", "100", "100,000"],
            ["Loop inside a loop: O(n²)", "10,000", "10,000,000,000"],
            ["Binary search on a sorted list: O(log n)", "about 7", "about 17"],
          ],
        },
        webLab: {
          task:
            "Write four classic algorithms. isPalindrome(text) ignores case and anything that is not a letter or digit. isPrime(n) is false for numbers below 2 and checks divisors only up to the square root. bubbleSort(numbers) returns a NEW array sorted ascending using bubble sort, without calling .sort(). hasDuplicate(values) must use a Set (one pass, not a nested loop) to say whether any value appears twice.",
          files: { "app.js": "function isPalindrome(text) {\n}\n\nfunction isPrime(n) {\n}\n\nfunction bubbleSort(numbers) {\n}\n\nfunction hasDuplicate(values) {\n}\n" },
          tests: [
            { label: "isPalindrome: racecar and \"Never odd or even\" yes; hello no", check: "return isPalindrome('racecar') && isPalindrome('Never odd or even') && isPalindrome('A man, a plan, a canal: Panama!') && !isPalindrome('hello');", fail: "Lower-case, remove non-letters and digits, then compare with the reverse." },
            { label: "isPrime: 2, 13 and 97 are prime; 0, 1, 9 and 91 are not", check: "return isPrime(2) && isPrime(13) && isPrime(97) && !isPrime(0) && !isPrime(1) && !isPrime(9) && !isPrime(91);", fail: "Numbers below 2 are not prime; otherwise try every divisor from 2 to Math.sqrt(n)." },
            { label: "bubbleSort sorts numbers correctly, including 10 and 9", check: "return JSON.stringify(bubbleSort([5, 10, 1, 9, 3])) === '[1,3,5,9,10]' && JSON.stringify(bubbleSort([])) === '[]';", fail: "Repeatedly swap neighbours that are out of order until a pass makes no swaps." },
            { label: "bubbleSort returns a new array and does not use .sort()", check: "const a = [3, 1, 2]; const b = bubbleSort(a); return a.join() === '3,1,2' && b !== a && !/\\.sort\\(/.test(code('app.js'));", fail: "Copy the array first with [...numbers], and write the swapping yourself." },
            { label: "hasDuplicate uses a Set and is right", check: "return hasDuplicate([1, 2, 3, 2]) === true && hasDuplicate(['a', 'b']) === false && hasDuplicate([]) === false && /new Set/.test(code('app.js'));", fail: "Keep a Set of values seen; if a value is already in it, return true." },
          ],
          solution: { "app.js": "function isPalindrome(text) {\n  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  return clean === clean.split(\"\").reverse().join(\"\");\n}\n\nfunction isPrime(n) {\n  if (n < 2) return false;\n  for (let d = 2; d <= Math.sqrt(n); d++) {\n    if (n % d === 0) return false;\n  }\n  return true;\n}\n\nfunction bubbleSort(numbers) {\n  const list = [...numbers];\n  let swapped = true;\n  while (swapped) {\n    swapped = false;\n    for (let i = 0; i < list.length - 1; i++) {\n      if (list[i] > list[i + 1]) {\n        [list[i], list[i + 1]] = [list[i + 1], list[i]];\n        swapped = true;\n      }\n    }\n  }\n  return list;\n}\n\nfunction hasDuplicate(values) {\n  const seen = new Set();\n  for (const v of values) {\n    if (seen.has(v)) return true;\n    seen.add(v);\n  }\n  return false;\n}\n" },
          hint: "To clean a string without a regular expression, keep only characters c where \"abcdefghijklmnopqrstuvwxyz0123456789\".includes(c). Destructuring swaps two elements in one line.",
          successMessage: "Four interview classics, including one that is fast because it uses a Set instead of a loop inside a loop.",
        },
      },
    ],

    task: {
      title: "Module project: five unfamiliar problems",
      intro: "Solve each of these end to end on your own computer: specification, test cases, code and a trace.",
      prompts: [
        "Second largest: return the second-largest distinct number in an array, or null if there is none.",
        "Anagrams: decide whether two words use exactly the same letters.",
        "Vowel report: count each vowel in a sentence and return the most common one.",
        "Change maker: given an amount in naira, return the fewest notes of ₦1000, ₦500, ₦200, ₦100 and ₦50 needed.",
        "For each one, write at least five test cases first (including boundaries and invalid input), then the code, then a trace table of one run.",
      ],
      closing: "The Phase 3 gate asks you to do exactly this, without help. Practise the method, not the answers.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
