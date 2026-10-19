/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 11
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l46-files-with": {
    lessonId: "pp-l46-files-with",
    passMark: 70,
    questions: [
      {
        id: "ppq46-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-files-paths",
        prompt: "A relative path such as data/scores.csv is relative to what?",
        options: [
          { id: "a", text: "The current working directory the program was run from" },
          { id: "b", text: "The top of the C: drive" },
          { id: "c", text: "The Python installation folder" },
          { id: "d", text: "The user's Downloads folder" },
        ],
        correct: "a",
        explanation: "Relative paths start from the current working directory, which is why running from the wrong folder causes FileNotFoundError.",
        whyWrong: {
          b: "That would be an absolute path.",
          c: "Python's install folder is not involved.",
          d: "Downloads is not special to Python.",
        },
      },
      {
        id: "ppq46-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-open-close",
        prompt: "What does opening an existing file with mode \"w\" do?",
        options: [
          { id: "a", text: "Erases its contents and starts writing from empty" },
          { id: "b", text: "Adds to the end of it" },
          { id: "c", text: "Opens it for reading only" },
          { id: "d", text: "Raises an error because it exists" },
        ],
        correct: "a",
        explanation: "\"w\" truncates the file. Use \"a\" to keep the existing contents.",
        whyWrong: {
          b: "That is \"a\", append.",
          c: "That is \"r\".",
          d: "That is mode \"x\", exclusive creation.",
        },
      },
      {
        id: "ppq46-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-with",
        prompt: "What is the main advantage of with open(...) as f:?",
        options: [
          { id: "a", text: "The file is closed automatically when the block ends, even if an error occurs" },
          { id: "b", text: "It makes reading faster" },
          { id: "c", text: "It encrypts the file" },
          { id: "d", text: "It lets several programs write at once" },
        ],
        correct: "a",
        explanation: "with is a context manager: cleanup is guaranteed however the block ends.",
        whyWrong: {
          b: "Speed is the same.",
          c: "with does no encryption.",
          d: "It does nothing about concurrent writers.",
        },
      },
      {
        id: "ppq46-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-with",
        prompt: "with open(\"a.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"x\")\n    f.write(\"y\")\n\nWhat does a.txt contain?",
        options: [
          { id: "a", text: "xy" },
          { id: "b", text: "x\ny" },
          { id: "c", text: "y" },
          { id: "d", text: "x y" },
        ],
        correct: "a",
        explanation: "write() adds exactly the text given, with no new line or space.",
        whyWrong: {
          b: "write() does not add new lines; print(..., file=f) would.",
          c: "Both writes go into the same open file.",
          d: "No space is added.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l47-read-write-append": {
    lessonId: "pp-l47-read-write-append",
    passMark: 70,
    questions: [
      {
        id: "ppq47-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-read-write-text",
        prompt: "Which is best for processing a very large text file line by line?",
        options: [
          { id: "a", text: "for line in f:" },
          { id: "b", text: "text = f.read() then split it" },
          { id: "c", text: "Copy it into a list by hand" },
          { id: "d", text: "Open it in \"w\" mode" },
        ],
        correct: "a",
        explanation: "Looping over the file object reads one line at a time, so memory use stays small.",
        whyWrong: {
          b: "read() loads the whole file into memory at once.",
          c: "That is what the loop already does, more efficiently.",
          d: "\"w\" would erase the file.",
        },
      },
      {
        id: "ppq47-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-append-mode",
        prompt: "log.txt contains one line. A program opens it with \"a\" and writes \"new\\n\". How many lines does it have now?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "1" },
          { id: "c", text: "0" },
          { id: "d", text: "It depends on the operating system" },
        ],
        correct: "a",
        explanation: "Append mode keeps the existing line and adds the new one at the end.",
        whyWrong: {
          b: "That would be \"w\", which replaces the contents.",
          c: "Append never removes content.",
          d: "Append behaves the same everywhere.",
        },
      },
      {
        id: "ppq47-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-encoding",
        prompt: "Why should open() be given encoding=\"utf-8\"?",
        options: [
          { id: "a", text: "Without it, the operating system's default is used, which may corrupt characters like ₦ or accented names" },
          { id: "b", text: "Python cannot open files without it" },
          { id: "c", text: "It compresses the file" },
          { id: "d", text: "It is only needed for CSV files" },
        ],
        correct: "a",
        explanation: "UTF-8 stores every Unicode character. Naming it explicitly makes the file behave the same on every computer.",
        whyWrong: {
          b: "open() works without it, which is exactly why the bug is easy to miss.",
          c: "Encoding is not compression.",
          d: "Every text file has an encoding.",
        },
      },
      {
        id: "ppq47-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-encoding",
        prompt: "print(len(\"₦100\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "6" },
          { id: "c", text: "3" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "len counts characters, and ₦ is one character (even though UTF-8 stores it in three bytes).",
        whyWrong: {
          b: "That is the number of UTF-8 BYTES, not characters.",
          c: "₦ counts as one character.",
          d: "Python strings handle any Unicode character.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l48-csv-json": {
    lessonId: "pp-l48-csv-json",
    passMark: 70,
    questions: [
      {
        id: "ppq48-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-csv",
        prompt: "Why use the csv module rather than line.split(\",\")?",
        options: [
          { id: "a", text: "It correctly handles quoted fields that contain commas, such as \"Obi, Jnr\"" },
          { id: "b", text: "split() cannot be used on strings from files" },
          { id: "c", text: "The csv module converts every value to a number automatically" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "a",
        explanation: "Real CSV quotes fields containing commas; splitting by hand breaks them.",
        whyWrong: {
          b: "split() works on any string; it just gets CSV wrong.",
          c: "csv returns strings; you convert numbers yourself.",
          d: "Quoted commas are a real difference.",
        },
      },
      {
        id: "ppq48-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-csv",
        prompt: "A csv.DictReader row is {\"name\": \"Ada\", \"score\": \"72\"}. What is row[\"score\"] + 8?",
        options: [
          { id: "a", text: "TypeError, because \"72\" is a string" },
          { id: "b", text: "80" },
          { id: "c", text: "\"728\"" },
          { id: "d", text: "72" },
        ],
        correct: "a",
        explanation: "Everything read from CSV is text. Use int(row[\"score\"]) + 8.",
        whyWrong: {
          b: "That needs int() first.",
          c: "Joining needs both sides to be strings; 8 is an int.",
          d: "The expression fails before producing anything.",
        },
      },
      {
        id: "ppq48-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-json",
        prompt: "import json\nprint(json.dumps({\"done\": False, \"x\": None}))\n\nWhat is printed?",
        options: [
          { id: "a", text: "{\"done\": false, \"x\": null}" },
          { id: "b", text: "{'done': False, 'x': None}" },
          { id: "c", text: "{\"done\": False, \"x\": None}" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "JSON uses double quotes, false and null: the JSON spellings of False and None.",
        whyWrong: {
          b: "That is Python's own representation, not JSON.",
          c: "JSON spells them false and null.",
          d: "Both values can be converted.",
        },
      },
      {
        id: "ppq48-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-json",
        prompt: "What is the difference between json.load and json.loads?",
        options: [
          { id: "a", text: "load reads from a file object; loads reads from a string" },
          { id: "b", text: "loads is faster" },
          { id: "c", text: "load writes; loads reads" },
          { id: "d", text: "They are identical" },
        ],
        correct: "a",
        explanation: "The s stands for string. dump/dumps follow the same rule for writing.",
        whyWrong: {
          b: "Speed is not the difference.",
          c: "Both read; dump and dumps write.",
          d: "They take different inputs.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l49-pathlib-persistence": {
    lessonId: "pp-l49-pathlib-persistence",
    passMark: 70,
    questions: [
      {
        id: "ppq49-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-pathlib",
        prompt: "from pathlib import Path\np = Path(\"reports\") / \"march.csv\"\nprint(p.stem, p.suffix)\n\nWhat is printed?",
        options: [
          { id: "a", text: "march .csv" },
          { id: "b", text: "march.csv csv" },
          { id: "c", text: "reports march" },
          { id: "d", text: "march csv" },
        ],
        correct: "a",
        explanation: "stem is the name without the extension; suffix is the extension including the dot.",
        whyWrong: {
          b: "That is name, and suffix includes the dot.",
          c: "reports is the parent folder.",
          d: "suffix includes the dot.",
        },
      },
      {
        id: "ppq49-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-pathlib",
        prompt: "Why join paths with Path(\"a\") / \"b\" instead of \"a\" + \"\\\\\" + \"b\"?",
        options: [
          { id: "a", text: "pathlib uses the correct separator on every operating system" },
          { id: "b", text: "Strings cannot contain backslashes" },
          { id: "c", text: "It creates the folder automatically" },
          { id: "d", text: "It is required by open()" },
        ],
        correct: "a",
        explanation: "Windows uses \\ and macOS/Linux use /. pathlib handles both.",
        whyWrong: {
          b: "They can, with escaping; it is just not portable.",
          c: "Joining does not create anything; mkdir() does.",
          d: "open() accepts plain strings too.",
        },
      },
      {
        id: "ppq49-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-persistence",
        prompt: "What is the standard pattern for a program that keeps data between sessions?",
        options: [
          { id: "a", text: "Load from the file at start (or start empty), and save whenever the data changes" },
          { id: "b", text: "Save only when the computer shuts down" },
          { id: "c", text: "Keep everything in variables" },
          { id: "d", text: "Ask the user to retype the data each time" },
        ],
        correct: "a",
        explanation: "Load on start, save on change: a crash then loses at most the last action.",
        whyWrong: {
          b: "Programs are not told reliably about shutdowns.",
          c: "Variables live in RAM and vanish when the program ends.",
          d: "That defeats the purpose.",
        },
      },
      {
        id: "ppq49-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-persistence",
        prompt: "A load() function reads data.json, but the program crashes on the very first run with FileNotFoundError. What is the fix?",
        options: [
          { id: "a", text: "Check whether the file exists first and return an empty structure if it does not" },
          { id: "b", text: "Delete data.json" },
          { id: "c", text: "Open it with \"r\" instead" },
          { id: "d", text: "Rename it to data.txt" },
        ],
        correct: "a",
        explanation: "On the first run there is nothing saved yet. Starting empty is the correct behaviour.",
        whyWrong: {
          b: "It does not exist yet; that is the problem.",
          c: "\"r\" is already the default and still fails on a missing file.",
          d: "The name does not matter; the file is missing.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
