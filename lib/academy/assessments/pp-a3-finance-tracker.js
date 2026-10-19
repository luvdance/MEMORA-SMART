/**
 * ASSESSMENTS · PYTHON PROGRAMMING · PHASE 3 ASSESSMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l64-ft-model": {
    lessonId: "pp-l64-ft-model",
    passMark: 70,
    questions: [
      {
        id: "ppq64-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-design",
        prompt: "Why store a positive amount plus a kind (income/expense) rather than using negative numbers for expenses?",
        options: [
          { id: "a", text: "The meaning is explicit and \"amount must be positive\" can be validated, so a stray minus sign cannot flip a record's meaning" },
          { id: "b", text: "Python cannot store negative numbers" },
          { id: "c", text: "JSON cannot save negative numbers" },
          { id: "d", text: "It uses less memory" },
        ],
        correct: "a",
        explanation: "Explicit fields make invalid data detectable at creation time.",
        whyWrong: {
          b: "Python handles negatives perfectly.",
          c: "JSON saves negative numbers fine.",
          d: "Memory is not the concern; clarity and validation are.",
        },
      },
      {
        id: "ppq64-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-transaction",
        prompt: "When does a dataclass's __post_init__ method run?",
        options: [
          { id: "a", text: "Automatically, right after the generated __init__ has set the fields" },
          { id: "b", text: "Only when you call it yourself" },
          { id: "c", text: "When the object is printed" },
          { id: "d", text: "When the program ends" },
        ],
        correct: "a",
        explanation: "It is the hook for validation and normalisation after the fields are assigned.",
        whyWrong: {
          b: "Python calls it for you on every creation.",
          c: "Printing uses __repr__ or __str__.",
          d: "It runs at creation.",
        },
      },
      {
        id: "ppq64-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-transaction",
        prompt: "What is the benefit of raising ValueError inside __post_init__ for bad data?",
        options: [
          { id: "a", text: "An invalid Transaction can never exist, so the rest of the program can trust every one it receives" },
          { id: "b", text: "It makes the program shorter" },
          { id: "c", text: "It hides bad data" },
          { id: "d", text: "It fixes the data automatically" },
        ],
        correct: "a",
        explanation: "Validating at creation means invalid objects cannot be made, so no other code needs to re-check them.",
        whyWrong: {
          b: "It adds a few lines, deliberately.",
          c: "It exposes bad data immediately.",
          d: "It refuses the data; the caller decides what to do.",
        },
      },
      {
        id: "ppq64-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a3-transaction",
        prompt: "signed_amount is defined as a @property returning the amount for income and minus the amount for expenses. Why a property rather than a stored field?",
        options: [
          { id: "a", text: "It is always calculated from amount and kind, so it can never disagree with them" },
          { id: "b", text: "Properties are saved to JSON automatically" },
          { id: "c", text: "Fields cannot be negative" },
          { id: "d", text: "It is faster" },
        ],
        correct: "a",
        explanation: "Derived values that are calculated cannot drift out of sync with the data they come from.",
        whyWrong: {
          b: "asdict() saves fields, not properties, which is exactly what we want here.",
          c: "Fields can hold any value.",
          d: "Speed is not the reason.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l65-ft-storage": {
    lessonId: "pp-l65-ft-storage",
    passMark: 70,
    questions: [
      {
        id: "ppq65-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a3-parse-amount",
        prompt: "print(float(\"2,500\".replace(\",\", \"\")))\n\nWhat is printed?",
        options: [
          { id: "a", text: "2500.0" },
          { id: "b", text: "2.5" },
          { id: "c", text: "ValueError" },
          { id: "d", text: "2,500" },
        ],
        correct: "a",
        explanation: "Removing the comma leaves \"2500\", which float() converts to 2500.0.",
        whyWrong: {
          b: "The comma is a thousands separator, not a decimal point.",
          c: "After replace() the text is a valid number.",
          d: "float() returns a number, not text.",
        },
      },
      {
        id: "ppq65-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-ledger",
        prompt: "What does Transaction(**record) do when record is a dictionary?",
        options: [
          { id: "a", text: "Passes each key as a keyword argument, so {\"amount\": 5, ...} becomes amount=5, ..." },
          { id: "b", text: "Multiplies the record" },
          { id: "c", text: "Passes the whole dictionary as the description" },
          { id: "d", text: "Raises a SyntaxError" },
        ],
        correct: "a",
        explanation: "** unpacks a dictionary into keyword arguments, rebuilding the object and re-running its validation.",
        whyWrong: {
          b: "** here is unpacking, not power.",
          c: "That would be Transaction(record).",
          d: "It is valid syntax.",
        },
      },
      {
        id: "ppq65-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-ledger",
        prompt: "Why is Ledger.load written as a @classmethod?",
        options: [
          { id: "a", text: "It is an alternative constructor: it creates and returns a new Ledger from a file" },
          { id: "b", text: "Class methods cannot read files" },
          { id: "c", text: "It makes the ledger read-only" },
          { id: "d", text: "It is required for JSON" },
        ],
        correct: "a",
        explanation: "A classmethod receives the class (cls) and is the conventional way to build objects in other ways, as in Ledger.load(path).",
        whyWrong: {
          b: "They can read files like any function.",
          c: "The returned ledger can still be changed.",
          d: "JSON has no such requirement.",
        },
      },
      {
        id: "ppq65-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-a3-ledger",
        prompt: "ledger.json was half-written when the computer lost power. What should Ledger.load do?",
        options: [
          { id: "a", text: "Catch json.JSONDecodeError, warn the user and start with an empty ledger rather than crashing" },
          { id: "b", text: "Crash with a traceback" },
          { id: "c", text: "Delete the user's other files" },
          { id: "d", text: "Silently return random data" },
        ],
        correct: "a",
        explanation: "Corrupted files are an expected failure. Warn clearly and keep running; a better version also keeps a backup of the bad file.",
        whyWrong: {
          b: "A crash on start-up would lock the user out entirely.",
          c: "Never destroy data in response to an error.",
          d: "Silent wrong data is the worst outcome.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l66-ft-reports": {
    lessonId: "pp-l66-ft-reports",
    passMark: 70,
    questions: [
      {
        id: "ppq66-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a3-reports",
        prompt: "print(f\"N{48500:,.2f}\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "N48,500.00" },
          { id: "b", text: "N48500" },
          { id: "c", text: "N48.500,00" },
          { id: "d", text: "48,500.00N" },
        ],
        correct: "a",
        explanation: ", adds thousands separators and .2f gives two decimal places.",
        whyWrong: {
          b: "The format adds a separator and decimals.",
          c: "Python uses commas for thousands and a dot for decimals.",
          d: "The N comes first in the f-string.",
        },
      },
      {
        id: "ppq66-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-reports",
        prompt: "Why are totals(), search() and report() written without input() or print()?",
        options: [
          { id: "a", text: "They can be tested directly and reused by any interface, such as a menu now or a web page later" },
          { id: "b", text: "Python forbids printing in functions" },
          { id: "c", text: "It makes them faster" },
          { id: "d", text: "No reason" },
        ],
        correct: "a",
        explanation: "Separating calculation from presentation is what makes code testable and reusable.",
        whyWrong: {
          b: "Functions may print; good design keeps it at the edges.",
          c: "Speed is not the point.",
          d: "Testability and reuse are strong reasons.",
        },
      },
      {
        id: "ppq66-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-a3-reports",
        prompt: "data = {\"food\": 500, \"fuel\": 900, \"data\": 500}\nprint(sorted(data.items(), key=lambda kv: (-kv[1], kv[0])))\n\nWhat is printed?",
        options: [
          { id: "a", text: "[('fuel', 900), ('data', 500), ('food', 500)]" },
          { id: "b", text: "[('data', 500), ('food', 500), ('fuel', 900)]" },
          { id: "c", text: "[('fuel', 900), ('food', 500), ('data', 500)]" },
          { id: "d", text: "[900, 500, 500]" },
        ],
        correct: "a",
        explanation: "Largest amount first; for the tie at 500, alphabetical order puts data before food.",
        whyWrong: {
          b: "That is smallest first.",
          c: "Ties are broken alphabetically: data comes before food.",
          d: "sorted returns the (key, value) pairs.",
        },
      },
      {
        id: "ppq66-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a3-assemble",
        prompt: "Where should a bad amount typed by the user be caught?",
        options: [
          { id: "a", text: "In the interface (main.py), around parse_amount, so it can ask again" },
          { id: "b", text: "Inside report()" },
          { id: "c", text: "Inside the JSON file" },
          { id: "d", text: "Nowhere" },
        ],
        correct: "a",
        explanation: "Lower layers detect and raise; the interface decides how to respond to the user.",
        whyWrong: {
          b: "Reports only read valid stored data.",
          c: "Files store data; they do not handle errors.",
          d: "Uncaught, it would crash the program.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
