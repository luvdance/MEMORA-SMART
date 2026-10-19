/**
 * RESPONSIVE WEB DEVELOPMENT · PHASE 3 PROJECTS AND ASSESSMENT GATE
 *
 * Curriculum P3.1 – P3.7. Six programs from the source curriculum, each the
 * pure logic that Phase 4 will later put on a page: calculator, grade
 * evaluation, number guessing game, expense tracker, score analyser and quiz
 * engine. Then the gate: three unfamiliar problems solved with conditions,
 * loops, functions, arrays and objects, with no model answer to copy.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s-p3-projects";

const brief = (id, explain, rows) => ({
  id,
  title: "The brief",
  explain,
  table: { caption: "Specification.", headers: ["Call", "Must return"], rows },
});

export const LESSONS = [
  /* ═══ P3.1 Calculator ═══ */
  {
    id: "wd-l84-calculator",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P3.1"],
    title: "Project: Calculator",
    subtitle: "Arithmetic with every kind of bad input handled",
    estimatedMinutes: 30,
    intro: "A calculator is easy until someone types \"abc\", divides by zero or picks an operator you did not expect. This one handles all of it, and in Phase 4 it gets buttons.",
    atoms: [
      brief("a-wd-p3-calc-brief", "Write calculate(a, operator, b). a and b arrive as text from a form. Convert them, validate them and the operator, and return either the number or an error message string.", [
        ["calculate(\"8\", \"+\", \"2\")", "10"],
        ["calculate(\"7\", \"/\", \"2\")", "3.5"],
        ["calculate(\"5\", \"/\", \"0\")", "\"Cannot divide by zero\""],
        ["calculate(\"abc\", \"*\", \"2\") or calculate(\"\", \"+\", \"1\")", "\"Invalid number\""],
        ["calculate(\"2\", \"^\", \"3\")", "\"Unknown operator\""],
      ]),
      {
        id: "a-wd-p3-calc-plan",
        title: "Validate first",
        explain: "The order of the checks decides which message the user sees when several things are wrong at once.",
        decision: {
          scenario: "Someone enters \"abc\" and divides by \"0\".",
          question: "Which message should they see?",
          options: [
            { id: "a", text: "\"Invalid number\": validate the inputs before doing anything with them", why: "Guard clauses in a sensible order: are the inputs numbers, is the operator known, then is this operation possible?" },
            { id: "b", text: "\"Cannot divide by zero\"", whyWrong: "You cannot reason about dividing something that is not a number. Validate inputs first." },
            { id: "c", text: "NaN", whyWrong: "A raw NaN means nothing to a user." },
            { id: "d", text: "Both messages joined", whyWrong: "Possible, but the first problem must be fixed first anyway." },
          ],
          correct: "a",
          aftermath: "Inputs, then operator, then the operation's own rules.",
        },
      },
      {
        id: "a-wd-p3-calc-build",
        title: "Build it",
        explain: "Write calculate to the specification. A switch suits the operator.",
        webLab: {
          task: "Write calculate(a, operator, b) to the brief.",
          files: { "app.js": "function calculate(a, operator, b) {\n}\n\nconsole.log(calculate(\"8\", \"+\", \"2\"));\n" },
          tests: [
            { label: "The four operations work on text input", check: "return calculate('8', '+', '2') === 10 && calculate('8', '-', '2') === 6 && calculate('8', '*', '2') === 16 && calculate('7', '/', '2') === 3.5;", fail: "Convert a and b with Number() before calculating." },
            { label: "Decimals and negatives work", check: "return calculate('-1.5', '+', '4') === 2.5;", fail: "Number() handles \"-1.5\"." },
            { label: "Division by zero returns \"Cannot divide by zero\"", check: "return calculate('5', '/', '0') === 'Cannot divide by zero';", fail: "Check for b === 0 before dividing." },
            { label: "Bad or empty input returns \"Invalid number\"", check: "return calculate('abc', '*', '2') === 'Invalid number' && calculate('', '+', '1') === 'Invalid number' && calculate('3', '+', ' ') === 'Invalid number';", fail: "Trim the text; treat empty text and anything Number.isFinite rejects as invalid." },
            { label: "An unknown operator returns \"Unknown operator\"", check: "return calculate('2', '^', '3') === 'Unknown operator';", fail: "Use a switch with a default case." },
            { label: "Invalid input is reported before division by zero", check: "return calculate('abc', '/', '0') === 'Invalid number';", fail: "Validate the inputs first." },
          ],
          solution: { "app.js": "function toNumber(text) {\n  const t = String(text).trim();\n  if (t === \"\") return null;\n  const n = Number(t);\n  return Number.isFinite(n) ? n : null;\n}\n\nfunction calculate(a, operator, b) {\n  const x = toNumber(a);\n  const y = toNumber(b);\n  if (x === null || y === null) return \"Invalid number\";\n  switch (operator) {\n    case \"+\":\n      return x + y;\n    case \"-\":\n      return x - y;\n    case \"*\":\n      return x * y;\n    case \"/\":\n      return y === 0 ? \"Cannot divide by zero\" : x / y;\n    default:\n      return \"Unknown operator\";\n  }\n}\n\nconsole.log(calculate(\"8\", \"+\", \"2\"));\n" },
          hint: "A small helper toNumber(text) that returns a number or null keeps calculate short.",
          successMessage: "A calculator that cannot be broken by bad input. In Module 21 you will connect it to buttons.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P3.2 Grades ═══ */
  {
    id: "wd-l85-grades",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P3.2"],
    title: "Project: Grade Evaluation System",
    subtitle: "Every student's average, grade and result, and a class summary",
    estimatedMinutes: 35,
    intro: "A school needs results for a whole class: each student's average and grade, and a summary for the head teacher. This combines arrays of objects, map, filter, reduce and conditions.",
    atoms: [
      brief("a-wd-p3-grade-brief", "students is an array of { name, scores } where scores is an array of numbers. Grades: A 70+, B 60–69, C 50–59, D 45–49, F below 45. A student passes with 50 or more.", [
        ["evaluate(students)", "A NEW array of { name, average, grade, passed }, average rounded to one decimal place"],
        ["summary(students)", "{ classAverage, passed, failed, topStudent }, classAverage rounded to one decimal place"],
        ["A student with no scores", "average 0, grade \"F\", passed false"],
      ]),
      {
        id: "a-wd-p3-grade-plan",
        title: "Reuse, do not repeat",
        explain: "summary needs every student's average and pass mark, which evaluate already works out.",
        decision: {
          scenario: "You are writing summary(students).",
          question: "What is the best approach?",
          options: [
            { id: "a", text: "Call evaluate(students) and summarise its results", why: "One function computes averages and grades; summary builds on it. A change to the grading rules then needs one edit, not two." },
            { id: "b", text: "Copy the averaging and grading code into summary", whyWrong: "Two copies of the rules will drift apart." },
            { id: "c", text: "Ask the user to type the averages", whyWrong: "The program exists to calculate them." },
            { id: "d", text: "Store the results in global variables", whyWrong: "Pure functions are easier to test and reuse." },
          ],
          correct: "a",
          aftermath: "Small functions that build on each other: the decomposition habit from Module 16.",
        },
      },
      {
        id: "a-wd-p3-grade-build",
        title: "Build it",
        explain: "Write evaluate and summary to the brief, plus any helpers you want.",
        webLab: {
          task: "Write evaluate(students) and summary(students) to the brief.",
          files: { "app.js": "const students = [\n  { name: \"Ada\", scores: [72, 80, 91] },\n  { name: \"Bayo\", scores: [45, 50, 40] },\n  { name: \"Chika\", scores: [60, 65, 70] },\n  { name: \"Dapo\", scores: [] },\n];\n\nfunction evaluate(students) {\n}\n\nfunction summary(students) {\n}\n" },
          tests: [
            { label: "evaluate gives each student's average, grade and result", check: "const r = evaluate(students); const ada = r.find((x) => x.name === 'Ada'); const chika = r.find((x) => x.name === 'Chika'); return r.length === 4 && ada.average === 81 && ada.grade === 'A' && ada.passed === true && chika.average === 65 && chika.grade === 'B';", fail: "average = sum / count, rounded to one decimal; then the grade bands; passed if average >= 50." },
            { label: "Averages are rounded to one decimal place", check: "const b = evaluate(students).find((x) => x.name === 'Bayo'); return b.average === 45 && b.grade === 'D' && b.passed === false && evaluate([{ name: 'X', scores: [70, 71, 71] }])[0].average === 70.7;", fail: "Math.round(average * 10) / 10." },
            { label: "A student with no scores gets 0, F and fails", check: "const d = evaluate(students).find((x) => x.name === 'Dapo'); return d.average === 0 && d.grade === 'F' && d.passed === false;", fail: "Guard against dividing by zero scores." },
            { label: "evaluate does not change the students array", check: "evaluate(students); return students[0].grade === undefined && Object.keys(students[0]).length === 2;", fail: "Return new objects; do not add properties to the originals." },
            { label: "summary gives passed, failed and the top student", check: "const s = summary(students); return s.passed === 2 && s.failed === 2 && s.topStudent === 'Ada';", fail: "Count passes and fails from evaluate's results; the top student has the highest average." },
            { label: "summary's class average is the mean of the students' averages", check: "return summary(students).classAverage === 47.8;", fail: "(81 + 45 + 65 + 0) / 4 = 47.75, rounded to 47.8." },
          ],
          solution: { "app.js": "const students = [\n  { name: \"Ada\", scores: [72, 80, 91] },\n  { name: \"Bayo\", scores: [45, 50, 40] },\n  { name: \"Chika\", scores: [60, 65, 70] },\n  { name: \"Dapo\", scores: [] },\n];\n\nconst round1 = (n) => Math.round(n * 10) / 10;\n\nfunction average(scores) {\n  if (scores.length === 0) return 0;\n  return round1(scores.reduce((t, s) => t + s, 0) / scores.length);\n}\n\nfunction grade(avg) {\n  if (avg >= 70) return \"A\";\n  if (avg >= 60) return \"B\";\n  if (avg >= 50) return \"C\";\n  if (avg >= 45) return \"D\";\n  return \"F\";\n}\n\nfunction evaluate(students) {\n  return students.map((s) => {\n    const avg = average(s.scores);\n    return { name: s.name, average: avg, grade: grade(avg), passed: avg >= 50 };\n  });\n}\n\nfunction summary(students) {\n  const results = evaluate(students);\n  const passed = results.filter((r) => r.passed).length;\n  const top = results.reduce((best, r) => (r.average > best.average ? r : best), results[0]);\n  const classAverage = round1(results.reduce((t, r) => t + r.average, 0) / results.length);\n  return { classAverage, passed, failed: results.length - passed, topStudent: top.name };\n}\n" },
          hint: "Write average(scores) and grade(average) first, test them, then evaluate is a single map.",
          successMessage: "A results system built from small, tested pieces. In Phase 4 it gets a page and a table.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P3.3 Guessing game ═══ */
  {
    id: "wd-l86-guessing-game",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P3.3"],
    title: "Project: Number Guessing Game",
    subtitle: "A game with state that changes on every move",
    estimatedMinutes: 30,
    intro: "Games are programs that remember things between moves: the secret number, how many guesses have been made, whether the game is over. This one keeps that state in an object.",
    atoms: [
      brief("a-wd-p3-guess-brief", "createGame(secret, maxGuesses = 7) returns a game object with a guess(n) method. The secret is passed in so the game can be tested; a real game would pass Math.floor(Math.random() * 100) + 1.", [
        ["game.guess(n) below the secret", "\"Too low\""],
        ["game.guess(n) above the secret", "\"Too high\""],
        ["game.guess(secret)", "\"Correct in N guesses\" (\"1 guess\" when N is 1)"],
        ["Any guess after the game is won or out of guesses", "\"Game over\""],
        ["A guess that is not a whole number from 1 to 100", "\"Enter a whole number from 1 to 100\", and it does not count"],
        ["Using the last guess without finding it", "\"Out of guesses. It was S\""],
      ]),
      {
        id: "a-wd-p3-guess-plan",
        title: "Where the state lives",
        explain: "The game must remember the guess count between calls to guess.",
        decision: {
          scenario: "Where should the number of guesses made so far be stored?",
          question: "Choose the best place.",
          options: [
            { id: "a", text: "In the object (or a variable inside createGame), so each game has its own count", why: "Two games created side by side each keep their own state, and nothing else in the program can interfere with it." },
            { id: "b", text: "In a global variable", whyWrong: "Two games would share one count, and any code could change it." },
            { id: "c", text: "Recalculated from scratch on each guess", whyWrong: "There is nothing to recalculate it from." },
            { id: "d", text: "In the HTML", whyWrong: "This is pure logic; the page comes in Phase 4." },
          ],
          correct: "a",
          aftermath: "State belongs to the thing it describes: here, the game object.",
        },
      },
      {
        id: "a-wd-p3-guess-build",
        title: "Build it",
        explain: "Write createGame to the brief.",
        webLab: {
          task: "Write createGame(secret, maxGuesses) to the brief.",
          files: { "app.js": "function createGame(secret, maxGuesses = 7) {\n  return {\n    guess(n) {\n    },\n  };\n}\n\nconst game = createGame(42);\nconsole.log(game.guess(50));\n" },
          tests: [
            { label: "Too low and too high", check: "const g = createGame(42); return g.guess(10) === 'Too low' && g.guess(90) === 'Too high';", fail: "Compare n with the secret." },
            { label: "Correct reports the number of guesses, with the right plural", check: "const g = createGame(42); g.guess(10); g.guess(90); const r = g.guess(42); const h = createGame(5); return r === 'Correct in 3 guesses' && h.guess(5) === 'Correct in 1 guess';", fail: "Count every valid guess, including the correct one; use \"guess\" for 1." },
            { label: "After winning, every guess returns \"Game over\"", check: "const g = createGame(42); g.guess(42); return g.guess(42) === 'Game over' && g.guess(1) === 'Game over';", fail: "Remember that the game is finished." },
            { label: "Invalid guesses get a message and do not count", check: "const g = createGame(42); const a = g.guess(0), b = g.guess(101), c = g.guess(4.5), d = g.guess('abc'); return [a, b, c, d].every((x) => x === 'Enter a whole number from 1 to 100') && g.guess(42) === 'Correct in 1 guess';", fail: "Check Number.isInteger(n) and the range before counting the guess." },
            { label: "Running out of guesses reveals the secret, then the game is over", check: "const g = createGame(42, 3); g.guess(1); g.guess(2); const r = g.guess(3); return r === 'Out of guesses. It was 42' && g.guess(42) === 'Game over';", fail: "When the last allowed guess is wrong, return \"Out of guesses. It was \" + secret." },
            { label: "Two games keep separate counts", check: "const a = createGame(10), b = createGame(20); a.guess(1); a.guess(2); return b.guess(20) === 'Correct in 1 guess' && a.guess(10) === 'Correct in 3 guesses';", fail: "Keep the count inside createGame, not in a global variable." },
          ],
          solution: { "app.js": "function createGame(secret, maxGuesses = 7) {\n  let guesses = 0;\n  let over = false;\n  return {\n    guess(n) {\n      if (over) return \"Game over\";\n      if (!Number.isInteger(n) || n < 1 || n > 100) return \"Enter a whole number from 1 to 100\";\n      guesses++;\n      if (n === secret) {\n        over = true;\n        return `Correct in ${guesses} ${guesses === 1 ? \"guess\" : \"guesses\"}`;\n      }\n      if (guesses >= maxGuesses) {\n        over = true;\n        return `Out of guesses. It was ${secret}`;\n      }\n      return n < secret ? \"Too low\" : \"Too high\";\n    },\n  };\n}\n\nconst game = createGame(42);\nconsole.log(game.guess(50));\n" },
          hint: "let variables declared inside createGame, before the return, are remembered by the guess method between calls.",
          successMessage: "A game with private state and every rule covered. Each createGame call makes an independent game.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P3.4 Expense tracker ═══ */
  {
    id: "wd-l87-expenses",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["P3.4"],
    title: "Project: Expense Tracker Logic",
    subtitle: "Recording spending and summarising it by category and month",
    estimatedMinutes: 35,
    intro: "The data layer of an expense tracker: adding expenses safely, and answering \"where did my money go?\" In Phase 4 this logic gets a form, a list and saved data.",
    atoms: [
      brief("a-wd-p3-exp-brief", "An expense is { id, title, amount, category, date }, with date as \"YYYY-MM-DD\". All functions are pure: they return new data and never change their inputs.", [
        ["addExpense(list, expense)", "A new list with the expense added, or the same list unchanged if the amount is not a positive number or the title is empty"],
        ["totalByCategory(list)", "An object such as { food: 6500, transport: 2000 }"],
        ["monthTotal(list, \"2026-03\")", "The sum of that month's amounts"],
        ["biggest(list)", "The expense with the largest amount, or null for an empty list"],
      ]),
      {
        id: "a-wd-p3-exp-plan",
        title: "Rejecting bad data",
        explain: "Data that gets into a tracker stays there and corrupts every total.",
        decision: {
          scenario: "addExpense receives { title: \"Bus\", amount: -500 }.",
          question: "What should it do?",
          options: [
            { id: "a", text: "Return the list unchanged: a negative expense is invalid", why: "Validating at the point of entry keeps every later total correct. Phase 4 shows the user a message; the logic simply refuses." },
            { id: "b", text: "Add it; the user knows best", whyWrong: "One bad entry silently corrupts every summary." },
            { id: "c", text: "Turn it into 500", whyWrong: "Guessing the user's intention hides the mistake." },
            { id: "d", text: "Throw away the whole list", whyWrong: "Far worse than the problem." },
          ],
          correct: "a",
          aftermath: "Validate input where it enters, and keep the rest of the code able to trust its data.",
        },
      },
      {
        id: "a-wd-p3-exp-build",
        title: "Build it",
        explain: "Write the four functions to the brief.",
        webLab: {
          task: "Write addExpense, totalByCategory, monthTotal and biggest to the brief.",
          files: { "app.js": "const expenses = [\n  { id: 1, title: \"Lunch\", amount: 2500, category: \"food\", date: \"2026-03-02\" },\n  { id: 2, title: \"Bus\", amount: 800, category: \"transport\", date: \"2026-03-02\" },\n  { id: 3, title: \"Groceries\", amount: 4000, category: \"food\", date: \"2026-03-10\" },\n  { id: 4, title: \"Taxi\", amount: 1200, category: \"transport\", date: \"2026-04-01\" },\n];\n\nfunction addExpense(list, expense) {\n}\n\nfunction totalByCategory(list) {\n}\n\nfunction monthTotal(list, month) {\n}\n\nfunction biggest(list) {\n}\n" },
          tests: [
            { label: "addExpense adds a valid expense, returning a new list", check: "const e = { id: 5, title: 'Data', amount: 1000, category: 'bills', date: '2026-03-15' }; const next = addExpense(expenses, e); return next.length === 5 && next[4] === e && expenses.length === 4 && next !== expenses;", fail: "Return [...list, expense]." },
            { label: "addExpense refuses a zero, negative, missing or text amount", check: "const bad = [-500, 0, NaN, '500', undefined]; return bad.every((amount) => addExpense(expenses, { id: 9, title: 'X', amount, category: 'food', date: '2026-03-01' }).length === 4);", fail: "Only add when typeof amount === \"number\", it is finite and greater than 0." },
            { label: "addExpense refuses an empty title", check: "return addExpense(expenses, { id: 9, title: '  ', amount: 100, category: 'food', date: '2026-03-01' }).length === 4;", fail: "Trim the title and refuse it if it is empty." },
            { label: "totalByCategory sums each category", check: "const t = totalByCategory(expenses); return t.food === 6500 && t.transport === 2000 && Object.keys(t).length === 2 && Object.keys(totalByCategory([])).length === 0;", fail: "A tally, adding amounts instead of counting." },
            { label: "monthTotal sums one month", check: "return monthTotal(expenses, '2026-03') === 7300 && monthTotal(expenses, '2026-04') === 1200 && monthTotal(expenses, '2026-05') === 0;", fail: "filter where date.startsWith(month), then reduce." },
            { label: "biggest returns the largest expense, or null", check: "return biggest(expenses).id === 3 && biggest([]) === null;", fail: "Return null for an empty list; otherwise keep the largest so far." },
          ],
          solution: { "app.js": "const expenses = [\n  { id: 1, title: \"Lunch\", amount: 2500, category: \"food\", date: \"2026-03-02\" },\n  { id: 2, title: \"Bus\", amount: 800, category: \"transport\", date: \"2026-03-02\" },\n  { id: 3, title: \"Groceries\", amount: 4000, category: \"food\", date: \"2026-03-10\" },\n  { id: 4, title: \"Taxi\", amount: 1200, category: \"transport\", date: \"2026-04-01\" },\n];\n\nfunction addExpense(list, expense) {\n  const { title, amount } = expense;\n  const validAmount = typeof amount === \"number\" && Number.isFinite(amount) && amount > 0;\n  const validTitle = typeof title === \"string\" && title.trim() !== \"\";\n  return validAmount && validTitle ? [...list, expense] : list;\n}\n\nfunction totalByCategory(list) {\n  const totals = {};\n  for (const e of list) {\n    totals[e.category] = (totals[e.category] || 0) + e.amount;\n  }\n  return totals;\n}\n\nfunction monthTotal(list, month) {\n  return list.filter((e) => e.date.startsWith(month)).reduce((t, e) => t + e.amount, 0);\n}\n\nfunction biggest(list) {\n  if (list.length === 0) return null;\n  return list.reduce((best, e) => (e.amount > best.amount ? e : best));\n}\n" },
          hint: "Every function here is a pattern from Module 17 or 19: spread, tally, filter and reduce, maximum.",
          successMessage: "The whole data layer of an expense tracker, validated and pure. Phase 4 adds the form, the list and saving.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P3.5 Score analyser ═══ */
  {
    id: "wd-l88-score-analyzer",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["P3.5"],
    title: "Project: Student Score Analyzer",
    subtitle: "Statistics from real, messy data",
    estimatedMinutes: 30,
    intro: "A teacher pastes a column of scores from a spreadsheet. Some are blank, some say \"absent\", one is 150 by mistake. The analyser must ignore the junk and report honest statistics.",
    atoms: [
      brief("a-wd-p3-score-brief", "analyze(scores) receives an array of mixed values. Only numbers from 0 to 100 count; everything else is reported as invalid.", [
        ["count", "How many valid scores there are"],
        ["mean", "Their average, rounded to one decimal place"],
        ["median", "The middle value when sorted (the average of the two middle values for an even count)"],
        ["highest, lowest, range", "The largest, the smallest and their difference"],
        ["invalid", "How many values were ignored"],
        ["No valid scores", "{ count: 0, mean: null, median: null, highest: null, lowest: null, range: null, invalid }"],
      ]),
      {
        id: "a-wd-p3-score-plan",
        title: "Mean or median?",
        explain: "Both describe the \"typical\" score, but they react very differently to an extreme value.",
        decision: {
          scenario: "Scores: 52, 55, 58, 60 and 100. The teacher asks for the typical score.",
          question: "Which statistic describes the typical student best?",
          options: [
            { id: "a", text: "The median, 58: one very high score does not pull it up", why: "The mean, 65, is higher than four of the five scores. The median resists outliers." },
            { id: "b", text: "The mean, 65", whyWrong: "Four students scored below it; it is distorted by one high score." },
            { id: "c", text: "The highest, 100", whyWrong: "That describes one student." },
            { id: "d", text: "The range, 48", whyWrong: "That describes spread, not the typical score." },
          ],
          correct: "a",
          aftermath: "Report both, and say which you are quoting.",
        },
      },
      {
        id: "a-wd-p3-score-build",
        title: "Build it",
        explain: "Write analyze to the brief.",
        webLab: {
          task: "Write analyze(scores) to the brief.",
          files: { "app.js": "function analyze(scores) {\n}\n\nconsole.log(analyze([52, 55, \"absent\", 58, 60, 100, null, 150]));\n" },
          tests: [
            { label: "Only numbers from 0 to 100 count; the rest are invalid", check: "const r = analyze([52, 55, 'absent', 58, 60, 100, null, 150, -3, '70']); return r.count === 5 && r.invalid === 5;", fail: "Keep values where typeof v === \"number\" and 0 <= v <= 100. Text such as \"70\" is invalid too." },
            { label: "mean, highest, lowest and range are right", check: "const r = analyze([52, 55, 58, 60, 100]); return r.mean === 65 && r.highest === 100 && r.lowest === 52 && r.range === 48;", fail: "mean = sum / count (one decimal); range = highest - lowest." },
            { label: "median of an odd count is the middle value", check: "return analyze([60, 52, 100, 55, 58]).median === 58;", fail: "Sort numerically first, then take the middle element." },
            { label: "median of an even count averages the two middle values", check: "return analyze([10, 40, 20, 30]).median === 25;", fail: "With an even count, average the elements at length / 2 - 1 and length / 2." },
            { label: "mean is rounded to one decimal", check: "return analyze([70, 71, 71]).mean === 70.7;", fail: "Math.round(mean * 10) / 10." },
            { label: "No valid scores gives nulls, not NaN or errors", check: "const r = analyze(['absent', null]); return r.count === 0 && r.invalid === 2 && [r.mean, r.median, r.highest, r.lowest, r.range].every((v) => v === null);", fail: "Return the null result as soon as you find there are no valid scores." },
            { label: "The input array is not changed (sort a copy)", check: "const a = [3, 1, 2]; analyze(a); return a.join() === '3,1,2';", fail: "Sort a copy: [...valid].sort((x, y) => x - y)." },
          ],
          solution: { "app.js": "function analyze(scores) {\n  const valid = scores.filter((v) => typeof v === \"number\" && v >= 0 && v <= 100);\n  const invalid = scores.length - valid.length;\n  if (valid.length === 0) {\n    return { count: 0, mean: null, median: null, highest: null, lowest: null, range: null, invalid };\n  }\n  const sorted = [...valid].sort((a, b) => a - b);\n  const n = sorted.length;\n  const mean = Math.round((sorted.reduce((t, v) => t + v, 0) / n) * 10) / 10;\n  const median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;\n  const highest = sorted[n - 1];\n  const lowest = sorted[0];\n  return { count: n, mean, median, highest, lowest, range: highest - lowest, invalid };\n}\n\nconsole.log(analyze([52, 55, \"absent\", 58, 60, 100, null, 150]));\n" },
          hint: "Filter, then sort a copy numerically: after sorting, lowest is first, highest is last and the median is in the middle.",
          successMessage: "Honest statistics from messy data, with nothing invalid allowed to distort them.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P3.6 Quiz engine ═══ */
  {
    id: "wd-l89-quiz-engine",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["P3.6"],
    title: "Project: Quiz Engine",
    subtitle: "Questions as data, and marking that explains itself",
    estimatedMinutes: 35,
    intro: "Every quiz app, including this Academy's lesson checks, separates the questions (data) from the marking (logic). This engine marks a set of answers and explains each result.",
    atoms: [
      brief("a-wd-p3-quiz-brief", "questions is an array of { id, prompt, options, answer } where answer is the index of the correct option. answers is an object mapping question id to the chosen index, such as { q1: 2, q2: 0 }.", [
        ["mark(questions, answers)", "{ correct, total, percent, passed, feedback }"],
        ["percent", "Rounded to the nearest whole number"],
        ["passed", "true when percent is 70 or more"],
        ["feedback", "One entry per question, in order: { id, result } where result is \"correct\", \"wrong\" or \"unanswered\""],
      ]),
      {
        id: "a-wd-p3-quiz-plan",
        title: "Questions are data",
        explain: "Storing questions as an array of objects, rather than writing an if for each one, is what makes a quiz engine an engine.",
        decision: {
          scenario: "The school wants to add twenty more questions next week.",
          question: "With a data-driven engine, what changes?",
          options: [
            { id: "a", text: "Only the questions array: the marking code is unchanged", why: "The logic works on any number of questions. Separating data from logic is why one engine serves every quiz." },
            { id: "b", text: "Twenty new if statements", whyWrong: "That is a quiz hard-coded into logic, which is what an engine avoids." },
            { id: "c", text: "A new engine", whyWrong: "The engine does not depend on which questions there are." },
            { id: "d", text: "The browser", whyWrong: "Unrelated." },
          ],
          correct: "a",
          aftermath: "This Academy's own lessons are stored exactly this way.",
        },
      },
      {
        id: "a-wd-p3-quiz-build",
        title: "Build it",
        explain: "Write mark to the brief.",
        webLab: {
          task: "Write mark(questions, answers) to the brief.",
          files: { "app.js": "const questions = [\n  { id: \"q1\", prompt: \"Capital of Nigeria?\", options: [\"Lagos\", \"Abuja\", \"Kano\"], answer: 1 },\n  { id: \"q2\", prompt: \"5 % 2?\", options: [\"1\", \"2\", \"2.5\"], answer: 0 },\n  { id: \"q3\", prompt: \"typeof \\\"5\\\"?\", options: [\"number\", \"string\"], answer: 1 },\n];\n\nfunction mark(questions, answers) {\n}\n\nconsole.log(mark(questions, { q1: 1, q2: 2 }));\n" },
          tests: [
            { label: "All correct scores 3 of 3, 100%, passed", check: "const r = mark(questions, { q1: 1, q2: 0, q3: 1 }); return r.correct === 3 && r.total === 3 && r.percent === 100 && r.passed === true;", fail: "Count answers[q.id] === q.answer." },
            { label: "Two of three is 67% and fails", check: "const r = mark(questions, { q1: 1, q2: 0, q3: 0 }); return r.correct === 2 && r.percent === 67 && r.passed === false;", fail: "percent = Math.round(correct / total * 100); passed if percent >= 70." },
            { label: "feedback marks correct, wrong and unanswered, in order", check: "const f = mark(questions, { q1: 1, q2: 2 }).feedback; return JSON.stringify(f) === JSON.stringify([{ id: 'q1', result: 'correct' }, { id: 'q2', result: 'wrong' }, { id: 'q3', result: 'unanswered' }]);", fail: "An id missing from answers is unanswered; otherwise compare with the answer." },
            { label: "Choosing option 0 counts as an answer, not as unanswered", check: "return mark(questions, { q2: 0 }).feedback[1].result === 'correct';", fail: "0 is falsy: check answers[q.id] === undefined, not !answers[q.id]." },
            { label: "An empty quiz does not divide by zero", check: "const r = mark([], {}); return r.total === 0 && r.percent === 0 && r.passed === false && r.feedback.length === 0;", fail: "If there are no questions, percent is 0." },
          ],
          solution: { "app.js": "const questions = [\n  { id: \"q1\", prompt: \"Capital of Nigeria?\", options: [\"Lagos\", \"Abuja\", \"Kano\"], answer: 1 },\n  { id: \"q2\", prompt: \"5 % 2?\", options: [\"1\", \"2\", \"2.5\"], answer: 0 },\n  { id: \"q3\", prompt: \"typeof \\\"5\\\"?\", options: [\"number\", \"string\"], answer: 1 },\n];\n\nfunction mark(questions, answers) {\n  const feedback = questions.map((q) => {\n    const chosen = answers[q.id];\n    if (chosen === undefined) return { id: q.id, result: \"unanswered\" };\n    return { id: q.id, result: chosen === q.answer ? \"correct\" : \"wrong\" };\n  });\n  const correct = feedback.filter((f) => f.result === \"correct\").length;\n  const total = questions.length;\n  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);\n  return { correct, total, percent, passed: percent >= 70, feedback };\n}\n\nconsole.log(mark(questions, { q1: 1, q2: 2 }));\n" },
          hint: "Build feedback with map first; then correct is how many feedback entries say \"correct\".",
          successMessage: "A quiz engine that works for any number of questions and explains every mark. Phase 4 builds the interface for it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P3.7 Gate ═══ */
  {
    id: "wd-l90-p3-gate",
    moduleId: "wd-p3-projects",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["P3.7"],
    gate: true,
    title: "Phase 3 Assessment Gate: Unfamiliar Problems",
    subtitle: "Conditions, loops, functions, arrays and objects, with no solution to copy",
    estimatedMinutes: 60,
    intro: "This is the Phase 3 gate. Three problems you have not seen, each specified precisely. Use the method from Module 19: read the specification, write your own test cases, then code. There is no model answer to reveal.",
    atoms: [
      {
        id: "a-wd-p3-gate-brief",
        title: "The three problems",
        explain:
          "Write all three functions in app.js. Read every row of the specification, including the edge cases: the checks test them all.",
        table: {
          caption: "Specification.",
          headers: ["Function", "Behaviour"],
          rows: [
            ["compress(text)", "Run-length encoding: each run of the same character becomes the character and its count. \"aaabcc\" → \"a3b1c2\"; \"\" → \"\"; case matters, so \"aA\" → \"a1A1\""],
            ["secondLargest(numbers)", "The second-largest DISTINCT value. [4, 9, 2, 9] → 4; fewer than two distinct values → null"],
            ["groupByLength(words)", "An object whose keys are word lengths and values are arrays of the words with that length, in their original order. [\"go\", \"tea\", \"to\"] → { 2: [\"go\", \"to\"], 3: [\"tea\"] }; [] → {}"],
          ],
        },
        why: "These are the shape of real interview questions: short to state, and full of edge cases that only a careful specification reading catches.",
      },
      {
        id: "a-wd-p3-gate-build",
        title: "Solve them",
        explain: "Write your own console.log tests for the edge cases first, then the functions.",
        webLab: {
          task: "Write compress, secondLargest and groupByLength to the specification.",
          revealSolution: false,
          files: { "app.js": "function compress(text) {\n}\n\nfunction secondLargest(numbers) {\n}\n\nfunction groupByLength(words) {\n}\n" },
          tests: [
            { label: "compress encodes runs: \"aaabcc\" → \"a3b1c2\"", check: "return compress('aaabcc') === 'a3b1c2' && compress('abc') === 'a1b1c1' && compress('zzzz') === 'z4';", fail: "Walk the string, counting how long each run of the same character is." },
            { label: "compress handles empty text and case", check: "return compress('') === '' && compress('aA') === 'a1A1' && compress('aab') === 'a2b1';", fail: "An empty string gives \"\"; a and A are different characters." },
            { label: "secondLargest finds the second distinct value", check: "return secondLargest([4, 9, 2, 9]) === 4 && secondLargest([1, 2]) === 1 && secondLargest([-5, -1, -9]) === -5;", fail: "Duplicates of the largest do not count; it must work for negatives too." },
            { label: "secondLargest returns null with fewer than two distinct values", check: "return secondLargest([7, 7, 7]) === null && secondLargest([3]) === null && secondLargest([]) === null;", fail: "If there are not two different values, return null." },
            { label: "secondLargest does not change its input", check: "const a = [3, 1, 2]; secondLargest(a); return a.join() === '3,1,2';", fail: "Do not sort the original array." },
            { label: "groupByLength groups words in their original order", check: "const g = groupByLength(['go', 'tea', 'to', 'cup', 'a']); return JSON.stringify(g[2]) === '[\"go\",\"to\"]' && JSON.stringify(g[3]) === '[\"tea\",\"cup\"]' && JSON.stringify(g[1]) === '[\"a\"]' && Object.keys(g).length === 3;", fail: "For each word, push it onto the array for its length, creating the array the first time." },
            { label: "groupByLength of an empty list is an empty object", check: "const g = groupByLength([]); return g && typeof g === 'object' && !Array.isArray(g) && Object.keys(g).length === 0;", fail: "Return {} when there are no words." },
          ],
          solution: { "app.js": "function compress(text) {\n  let out = \"\";\n  for (let i = 0; i < text.length; ) {\n    let j = i;\n    while (j < text.length && text[j] === text[i]) j++;\n    out += text[i] + (j - i);\n    i = j;\n  }\n  return out;\n}\n\nfunction secondLargest(numbers) {\n  const distinct = [...new Set(numbers)].sort((a, b) => b - a);\n  return distinct.length < 2 ? null : distinct[1];\n}\n\nfunction groupByLength(words) {\n  const groups = {};\n  for (const w of words) {\n    (groups[w.length] = groups[w.length] || []).push(w);\n  }\n  return groups;\n}\n" },
          hint: "No model answer is shown for the gate. Re-read the edge-case rows of the specification and test them with console.log before checking.",
          successMessage: "Phase 3 gate passed: you can solve problems you have not seen before, from a specification, with the core tools of programming. Phase 4 puts that logic on real pages.",
        },
      },
      {
        id: "a-wd-p3-gate-review",
        title: "Review your solutions",
        explain: "Passing the checks proves your solutions are correct for the cases tested. A professional also reviews them for clarity.",
        decision: {
          scenario: "Your compress works but is one 25-line function with variables called a, b and c.",
          question: "What should you do now that it passes?",
          options: [
            { id: "a", text: "Refactor: rename the variables and extract a helper, then run the checks again to make sure it still passes", why: "Working code is the start. Clear names and small functions make it maintainable, and the checks prove the refactor changed nothing." },
            { id: "b", text: "Leave it: it passes", whyWrong: "The next person to read it, often you, pays for unclear code." },
            { id: "c", text: "Rewrite it from scratch in a different way", whyWrong: "Improve what works; a rewrite risks new bugs." },
            { id: "d", text: "Delete the tests", whyWrong: "Tests are what make refactoring safe." },
          ],
          correct: "a",
          aftermath: "Phase 3 complete. Make it work, then make it clear: you will practise this properly in Module 28.",
        },
      },
    ],
    task: {
      title: "Phase 3 portfolio work",
      intro: "Collect your Phase 3 programs in your own repository folder.",
      prompts: [
        "Put each of the six projects in its own .js file, with a comment block describing its specification.",
        "Give each one at least eight console.log test cases with their expected results written beside them.",
        "Pick two and refactor them for clarity without changing their results.",
        "Solve two more unfamiliar problems from a site such as Exercism's JavaScript track, using the same method.",
        "Write a short note on the bug that took you longest to find this phase, and how you found it.",
      ],
      closing: "Phase 4 takes every one of these programs and gives it a real, interactive page.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
