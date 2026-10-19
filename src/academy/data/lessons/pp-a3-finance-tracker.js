/**
 * PYTHON PROGRAMMING · PHASE 3 ASSESSMENT · PERSONAL FINANCE AND EXPENSE TRACKER
 *
 * Curriculum P3.1 – P3.3. Record income and expenses, categorise them, save
 * and reload, calculate totals, search, validate and report, using functions,
 * collections, files, exceptions, modules and OOP where useful. Three tested
 * stages; build challenges set `revealSolution: false`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s-a3-finance-tracker";

const PY = "python";

// The model answer for each stage builds on the last, so the shared parts are
// written once here and joined into each stage's solution.
const STAGE1 = `from dataclasses import dataclass, asdict


@dataclass
class Transaction:
    description: str
    amount: float
    kind: str
    category: str = "general"

    def __post_init__(self):
        if self.kind not in ("income", "expense"):
            raise ValueError("kind must be income or expense")
        if not isinstance(self.amount, (int, float)) or self.amount <= 0:
            raise ValueError("amount must be positive")
        if not self.description.strip():
            raise ValueError("description is required")
        self.description = self.description.strip()
        self.category = self.category.strip().lower() or "general"

    @property
    def signed_amount(self):
        return self.amount if self.kind == "income" else -self.amount
`;

const STAGE2 = `${STAGE1}

import json


def parse_amount(text):
    try:
        value = float(str(text).replace(",", "").strip())
    except ValueError:
        raise ValueError("amount must be a positive number")
    if value <= 0:
        raise ValueError("amount must be a positive number")
    return value


class Ledger:
    def __init__(self):
        self.transactions = []

    def add(self, transaction):
        self.transactions.append(transaction)

    def save(self, path):
        with open(path, "w", encoding="utf-8") as f:
            json.dump([asdict(t) for t in self.transactions], f, indent=2)

    @classmethod
    def load(cls, path):
        ledger = cls()
        try:
            with open(path, encoding="utf-8") as f:
                records = json.load(f)
        except FileNotFoundError:
            return ledger
        except json.JSONDecodeError:
            print("Warning: could not read", path)
            return ledger
        for record in records:
            try:
                ledger.add(Transaction(**record))
            except (TypeError, ValueError):
                print("Skipped invalid record:", record)
        return ledger
`;

const STAGE3 = `${STAGE2}

def money(x):
    return f"N{x:,.2f}"


def totals(ledger):
    income = sum(t.amount for t in ledger.transactions if t.kind == "income")
    expenses = sum(t.amount for t in ledger.transactions if t.kind == "expense")
    return income, expenses, income - expenses


def search(ledger, term):
    term = term.strip().lower()
    return [t for t in ledger.transactions
            if term in t.description.lower() or term == t.category]


def report(ledger):
    income, expenses, balance = totals(ledger)
    by_category = {}
    for t in ledger.transactions:
        if t.kind == "expense":
            by_category[t.category] = by_category.get(t.category, 0) + t.amount
    lines = [
        "Income:   " + money(income),
        "Expenses: " + money(expenses),
        "Balance:  " + money(balance),
        "By category:",
    ]
    for category, amount in sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0])):
        lines.append(f"  {category}: {money(amount)}")
    return "\\n".join(lines)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · P3.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l64-ft-model",
    moduleId: "pp-a3-finance-tracker",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P3.1"],
    title: "Modelling Transactions",
    subtitle: "Designing the data and a Transaction that cannot be invalid",
    estimatedMinutes: 25,
    intro:
      "Your Phase 3 assessment is a Personal Finance and Expense Tracker: record income and expenses, categorise them, save and reload them, calculate totals, search, validate every input, and produce a summary report. It starts with the single most important design decision: what one transaction is.",

    atoms: [
      {
        id: "a-pp-a3-design",
        title: "The design: models, storage, reports, interface",
        explain:
          "Phase 3 code is organised by concern, as Module 15 taught. A Transaction class models one record and enforces its rules. A Ledger holds transactions and saves and loads them. Report functions calculate totals and summaries. A thin command-line interface collects input and prints results. In a real project each lives in its own module: models.py, storage.py, reports.py and main.py.",
        table: {
          caption: "Requirements mapped to the design.",
          headers: ["Requirement", "Where it lives", "Phase 3 skill"],
          rows: [
            ["Record income and expenses, categorised", "Transaction (dataclass)", "OOP, dataclasses"],
            ["Validate input", "Transaction checks + parse_amount", "Exceptions"],
            ["Save and reload records", "Ledger.save / Ledger.load (JSON)", "Files, JSON"],
            ["Calculate totals and search", "totals(), search()", "Collections, comprehensions"],
            ["Summary report", "report()", "Formatting"],
            ["User interface", "main.py menu", "Modules, __main__"],
          ],
        },
        decision: {
          scenario: "Should one Transaction allow a negative amount to mean an expense, or store a positive amount plus kind = \"income\" or \"expense\"?",
          question: "Which design is clearer and safer?",
          options: [
            {
              id: "a",
              text: "A positive amount plus an explicit kind, with a signed_amount property for calculations",
              why: "The meaning is explicit, validation is simple (amount must be positive), and a mistyped minus sign cannot silently turn income into an expense.",
            },
            {
              id: "b",
              text: "Negative amounts for expenses, no kind field",
              whyWrong: "It works, but the meaning is hidden in a sign that is easy to get wrong when typing or importing data, and \"amount must be positive\" can no longer be checked.",
            },
            {
              id: "c",
              text: "Store everything as text",
              whyWrong: "Then every calculation needs conversion, and invalid values cannot be caught at creation.",
            },
            {
              id: "d",
              text: "Two separate classes with nothing shared",
              whyWrong: "Income and expenses share every field; duplicating them doubles the code to maintain.",
            },
          ],
          correct: "a",
          aftermath: "Make invalid states impossible to represent: that is the goal of the Transaction class you build next.",
        },
      },
      {
        id: "a-pp-a3-transaction",
        title: "Stage 1: a Transaction that validates itself",
        explain:
          "A dataclass can run checks after its generated __init__ by defining __post_init__(self). Raise ValueError there and an invalid Transaction can never exist: every other part of the program can trust every transaction it receives. __post_init__ can also normalise values, such as lower-casing the category.",
        code: {
          language: PY,
          code: 'from dataclasses import dataclass\n\n@dataclass\nclass Reading:\n    value: float\n\n    def __post_init__(self):\n        if self.value < 0:\n            raise ValueError("value cannot be negative")\n\nprint(Reading(3.5))\ntry:\n    Reading(-1)\nexcept ValueError as e:\n    print("Rejected:", e)\n',
          expectedOutput: "Reading(value=3.5)\nRejected: value cannot be negative",
        },
        codeChallenge: {
          task: "Write a dataclass Transaction with fields description (str), amount (float), kind (str) and category (str, default \"general\"). In __post_init__: raise ValueError(\"kind must be income or expense\") for any other kind; ValueError(\"amount must be positive\") unless amount is a number above 0; ValueError(\"description is required\") for a blank description; strip the description; and store the category stripped and lower-cased (or \"general\" if blank). Add a property signed_amount: the amount for income, minus the amount for an expense.",
          starter: "from dataclasses import dataclass, asdict\n\n# Stage 1: Transaction\n",
          sample: "Transaction(\" Salary \", 300000, \"income\", \" Work \") → Transaction(description='Salary', amount=300000, kind='income', category='work')",
          tests: [
            {
              check:
                't = Transaction(" Salary ", 300000, "income", " Work ")\n' +
                'assert (t.description, t.category, t.signed_amount) == ("Salary", "work", 300000), "Normalise description and category; income is positive. Got " + repr(t)\n' +
                'e = Transaction("Bread", 1200.5, "expense", "Food")\n' +
                'assert e.signed_amount == -1200.5 and e.category == "food", "An expense\'s signed_amount is negative."\n' +
                'assert Transaction("Gift", 50, "income").category == "general" and Transaction("Gift", 50, "income", "  ").category == "general", "Blank or missing category becomes general."\n' +
                'cases = [(("X", 10, "loan"), "kind must be income or expense"), (("X", 0, "income"), "amount must be positive"), (("X", -5, "expense"), "amount must be positive"), (("X", "10", "expense"), "amount must be positive"), (("   ", 10, "income"), "description is required")]\n' +
                'for args, msg in cases:\n' +
                '    try:\n' +
                '        Transaction(*args)\n' +
                '        assert False, f"Transaction{args} should raise ValueError({msg!r})"\n' +
                '    except ValueError as err:\n' +
                '        assert str(err) == msg, f"Transaction{args} should say {msg!r}, said {str(err)!r}"',
            },
          ],
          solution: STAGE1,
          revealSolution: false,
          hint: "Check kind first, then amount (isinstance(self.amount, (int, float)) and > 0), then description. Normalise at the end of __post_init__.",
          successMessage: "Every Transaction in your system is now guaranteed valid. The rest of the tracker can trust its data completely.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · P3.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l65-ft-storage",
    moduleId: "pp-a3-finance-tracker",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P3.2"],
    title: "Saving, Reloading and Validating",
    subtitle: "A Ledger that persists to JSON and survives bad data",
    estimatedMinutes: 30,
    intro:
      "Stage 2 makes the tracker remember. A Ledger holds Transaction objects, saves them as JSON, and loads them back, rebuilding real Transaction objects so validation runs again on the way in. A missing file, a corrupted file or a bad record must never crash it.",

    atoms: [
      {
        id: "a-pp-a3-parse-amount",
        title: "Validating typed amounts",
        explain:
          "People type amounts as 1200, 1,200, 1200.50 or \" 1200 \". The interface should accept all of those and reject 12OO, -50 and blank input with a clear message. parse_amount turns typed text into a positive float, or raises ValueError, so the menu can catch it and ask again.",
        code: {
          language: PY,
          code: 'for text in ["1,200.50", " 300 "]:\n    print(float(text.replace(",", "").strip()))\n',
          expectedOutput: "1200.5\n300.0",
        },
      },
      {
        id: "a-pp-a3-ledger",
        title: "Stage 2: the Ledger, with JSON persistence",
        explain:
          "dataclasses.asdict(t) turns a Transaction into a plain dictionary that json can write. To load, read the list of dictionaries and rebuild each one with Transaction(**record), which passes the dictionary's keys as keyword arguments and runs __post_init__ again. A classmethod, decorated @classmethod and receiving the class as cls, is the conventional way to write an alternative constructor such as Ledger.load(path).",
        codeChallenge: {
          task: "Paste your Stage 1 Transaction, then add: parse_amount(text) returning a positive float (commas and surrounding spaces allowed) or raising ValueError(\"amount must be a positive number\"); and class Ledger with a transactions list, add(transaction), save(path) writing a JSON list of asdict() records, and a classmethod load(path) that returns an empty Ledger if the file is missing, prints Warning: could not read PATH and returns an empty Ledger if the JSON is invalid, and skips (printing Skipped invalid record: RECORD) any record that fails Transaction validation.",
          starter: "# Paste Stage 1 here, then add parse_amount and Ledger\n",
          sample: "ledger.save(\"money.json\"); Ledger.load(\"money.json\").transactions == ledger.transactions → True",
          tests: [
            {
              label: "parse_amount",
              check:
                'assert parse_amount("1,200.50") == 1200.5 and parse_amount(" 300 ") == 300.0 and parse_amount(45) == 45.0, "Accept commas, spaces and numbers."\n' +
                'for bad in ["12OO", "-50", "", "0"]:\n' +
                '    try:\n' +
                '        parse_amount(bad)\n' +
                '        assert False, f"parse_amount({bad!r}) should raise ValueError"\n' +
                '    except ValueError as err:\n' +
                '        assert str(err) == "amount must be a positive number", f"Message for {bad!r}: {str(err)!r}"',
            },
            {
              label: "save and load",
              check:
                'led = Ledger()\n' +
                'led.add(Transaction("Salary", 300000, "income", "work"))\n' +
                'led.add(Transaction("Fuel", 15000, "expense", "transport"))\n' +
                'led.save("money.json")\n' +
                'import json as _j\n' +
                'assert _j.load(open("money.json", encoding="utf-8"))[1] == {"description": "Fuel", "amount": 15000, "kind": "expense", "category": "transport"}, "Save each transaction as an asdict() record."\n' +
                'again = Ledger.load("money.json")\n' +
                'assert again.transactions == led.transactions and isinstance(again.transactions[0], Transaction), "Loading should rebuild equal Transaction objects."\n' +
                'assert Ledger.load("missing.json").transactions == [], "A missing file gives an empty ledger."',
            },
            {
              label: "bad files",
              files: {
                "broken.json": "[{\"description\": \"Salary\", \"amount\": 1",
                "mixed.json": "[{\"description\": \"Rent\", \"amount\": 90000, \"kind\": \"expense\", \"category\": \"home\"}, {\"description\": \"Oops\", \"amount\": -4, \"kind\": \"expense\", \"category\": \"x\"}]",
              },
              check:
                'import io, contextlib\n' +
                'buf = io.StringIO()\n' +
                'with contextlib.redirect_stdout(buf):\n' +
                '    a = Ledger.load("broken.json")\n' +
                '    b = Ledger.load("mixed.json")\n' +
                'out = buf.getvalue()\n' +
                'assert a.transactions == [] and "Warning: could not read broken.json" in out, "Invalid JSON: warn and return an empty ledger. Printed: " + repr(out)\n' +
                'assert len(b.transactions) == 1 and b.transactions[0].description == "Rent", "Keep valid records and skip invalid ones."\n' +
                'assert "Skipped invalid record:" in out, "Report each skipped record."',
            },
          ],
          solution: STAGE2,
          revealSolution: false,
          hint: "In load: try to open and json.load; catch FileNotFoundError and json.JSONDecodeError separately. Then loop the records, wrapping Transaction(**record) in try/except (TypeError, ValueError).",
          successMessage: "Data that survives the program closing, and a loader that refuses to crash on missing files, broken JSON or bad records.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · P3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l66-ft-reports",
    moduleId: "pp-a3-finance-tracker",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P3.3"],
    title: "Totals, Search and the Summary Report",
    subtitle: "Turning records into answers",
    estimatedMinutes: 28,
    intro:
      "The final stage answers the questions a user actually has: how much came in, how much went out, what is left, where did it go, and what did I spend on fuel? Then you assemble the whole tracker as a project on your machine.",

    atoms: [
      {
        id: "a-pp-a3-reports",
        title: "Stage 3: totals, search and report",
        explain:
          "These are pure functions over a Ledger: no input(), no print(), so they are easy to test and could serve a web app later. Totals are generator sums; search is a filtered comprehension; the report groups expenses by category with the dictionary pattern from Module 10 and formats money with thousands separators.",
        codeChallenge: {
          task: "Paste Stages 1 and 2, then add: money(x) returning N1,234.50 style text; totals(ledger) returning (income, expenses, balance); search(ledger, term) returning the transactions whose description contains the term (ignoring case) or whose category equals it; and report(ledger) returning the exact multi-line text in the sample: Income, Expenses and Balance lines (labels padded as shown), then By category: and one line per expense category, largest first (ties alphabetical), indented two spaces.",
          starter: "# Paste Stages 1 and 2 here, then add money, totals, search and report\n",
          sample: "Income:   N300,000.00\nExpenses: N48,500.00\nBalance:  N251,500.00\nBy category:\n  transport: N33,000.00\n  food: N15,500.00",
          tests: [
            {
              check:
                'led = Ledger()\n' +
                'for t in [("Salary", 300000, "income", "work"), ("Fuel", 15000, "expense", "transport"), ("Rice", 12000, "expense", "food"), ("Bus fare", 18000, "expense", "transport"), ("Bread", 3500, "expense", "food")]:\n' +
                '    led.add(Transaction(*t))\n' +
                'assert money(1234.5) == "N1,234.50", "money(1234.5) should be N1,234.50."\n' +
                'assert totals(led) == (300000, 48500, 251500), "Got " + repr(totals(led))\n' +
                'assert [t.description for t in search(led, "  BREAD ")] == ["Bread"], "Search descriptions ignoring case and spaces."\n' +
                'assert [t.description for t in search(led, "transport")] == ["Fuel", "Bus fare"], "Search also matches category."\n' +
                'want = "Income:   N300,000.00\\nExpenses: N48,500.00\\nBalance:  N251,500.00\\nBy category:\\n  transport: N33,000.00\\n  food: N15,500.00"\n' +
                'assert report(led) == want, "report() got:\\n" + report(led)\n' +
                'assert report(Ledger()) == "Income:   N0.00\\nExpenses: N0.00\\nBalance:  N0.00\\nBy category:", "An empty ledger reports zeros. Got:\\n" + report(Ledger())',
            },
          ],
          solution: STAGE3,
          revealSolution: false,
          hint: "sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0])) gives largest first with alphabetical ties. Build a list of lines and \"\\n\".join() it.",
          successMessage: "The tracker can now answer every question in the brief, and each answer comes from a small, tested function.",
        },
      },
      {
        id: "a-pp-a3-assemble",
        title: "Assembling the project",
        explain:
          "On your machine, split the code into modules by concern and add a menu. main.py loads the ledger at start, loops over a menu (add income, add expense, list, search, report, quit), uses parse_amount inside try/except so bad input asks again, and saves after every change. The __main__ guard keeps main.py importable for tests in Module 17.",
        example:
          "finance-tracker/\n├── models.py      Transaction\n├── storage.py     Ledger (save / load)\n├── reports.py     money, totals, search, report\n├── main.py        menu; if __name__ == \"__main__\": main()\n├── data/          ledger.json (in .gitignore)\n├── README.md\n└── requirements.txt   (empty: standard library only)",
        decision: {
          scenario: "In main.py, a user types abc when asked for an amount.",
          question: "Where should this be handled?",
          options: [
            {
              id: "a",
              text: "In main.py: call parse_amount inside try/except ValueError, show the message, and ask again",
              why: "Validation lives in parse_amount; deciding what to do about a failure (ask again) belongs to the interface. Each layer keeps its own concern.",
            },
            {
              id: "b",
              text: "Inside Transaction, by printing a message and setting the amount to 0",
              whyWrong: "The model would then create an invalid transaction and talk to the user: two concerns it should not have.",
            },
            {
              id: "c",
              text: "Nowhere; let the program crash",
              whyWrong: "A typo must never lose a user's session or data.",
            },
            {
              id: "d",
              text: "In report()",
              whyWrong: "Reports only read valid data; input belongs at the edge of the program.",
            },
          ],
          correct: "a",
          aftermath: "Detect problems deep inside (raise), decide what to do at the edge (catch). That split runs through every well-built application.",
        },
      },
    ],

    task: {
      title: "Phase 3 assessment: submit your Personal Finance and Expense Tracker",
      intro: "Build the full project in VS Code, in a Git repository. Required concepts: functions, collections, file handling, exception handling, modules, and OOP where useful.",
      prompts: [
        "Users can record income and expenses with categories, and every input is validated (amounts, kinds, blank descriptions, unknown menu options).",
        "Records are saved after every change and reloaded on start; a missing or corrupted file never crashes the program.",
        "The menu offers totals, search and the summary report.",
        "The code is split into at least three modules, with docstrings, PEP 8 names and a README (install, run, structure).",
        "Extension: add a date to each transaction (datetime.date) and a monthly report.",
      ],
      closing: "Phase 3 complete. Phase 4 begins with the engineering foundations: algorithms, data structures and complexity.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
