/**
 * PYTHON PROGRAMMING · MODULE 11 · FILE HANDLING AND DATA PERSISTENCE
 *
 * Curriculum 11.1 – 11.10. Paths, open and close, with, reading, writing and
 * appending, encodings, csv, json, pathlib, and data that survives the program
 * closing. Challenges that read files supply them as `files` fixtures, which
 * the harness writes into an empty folder before each run.
 *
 * Every open() in this module passes encoding="utf-8". On Windows the default
 * encoding is not UTF-8, so leaving it out is a real bug, not a style point.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s11-files";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 11.1 – 11.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l46-files-with",
    moduleId: "pp-m11-files",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3"],
    title: "Files, Paths and the with Statement",
    subtitle: "Where files live, opening and closing them safely",
    estimatedMinutes: 18,
    intro:
      "Every program so far forgot everything the moment it ended. Files fix that: write data to storage and it is still there tomorrow. First, how files are named and found, and the one safe way to open them.",

    atoms: [
      {
        id: "a-pp-files-paths",
        title: "Files, paths and file extensions",
        explain:
          "A file is named data on storage. Its PATH says where it is: an absolute path starts from the top of the drive (C:\\Users\\Ada\\notes.txt or /home/ada/notes.txt); a relative path starts from the program's current working directory (data/notes.txt). The extension (.txt, .csv, .json) hints at the format but does not change the content.",
        table: {
          caption: "Paths and extensions you will use.",
          headers: ["Example", "Meaning"],
          rows: [
            ["notes.txt", "A file in the current working directory"],
            ["data/scores.csv", "A file inside the data folder, relative to the current directory"],
            ["../backup.json", "A file in the folder ABOVE the current one"],
            ["C:\\Users\\Ada\\file.txt", "An absolute path on Windows"],
            [".txt  .csv  .json", "Plain text, comma-separated values, JavaScript Object Notation"],
          ],
        },
        mistake:
          "Running a program from a different folder and getting FileNotFoundError: relative paths are relative to the folder you run from, not the folder the .py file is in. In VS Code, open the project folder and run from there.",
      },
      {
        id: "a-pp-open-close",
        title: "Opening and closing files",
        explain:
          "open(path, mode, encoding=\"utf-8\") returns a file object. Mode \"r\" reads (the default), \"w\" writes (creating the file, or ERASING an existing one), \"a\" appends to the end. Read with .read() or by looping over the lines; write with .write(text), which does not add a new line for you. Call .close() when finished, so the data is written to storage and the file is released.",
        code: {
          language: PY,
          code: 'f = open("greeting.txt", "w", encoding="utf-8")\nf.write("Hello\\n")\nf.write("from Python\\n")\nf.close()\nf = open("greeting.txt", "r", encoding="utf-8")\nprint(f.read())\nf.close()\n',
          expectedOutput: "Hello\nfrom Python",
        },
        why: "If an error happens between open() and close(), close() never runs and data can be lost. That is why the next atom's with statement is the normal way to open files.",
      },
      {
        id: "a-pp-with",
        title: "Context managers and the with statement",
        explain:
          "with open(...) as f: opens the file and guarantees it is closed when the indented block ends, even if an error happens inside it. An object that sets something up and cleans it up like this is a context manager. Use with for every file you open.",
        code: {
          language: PY,
          code: 'with open("todo.txt", "w", encoding="utf-8") as f:\n    f.write("Buy rice\\n")\n    f.write("Pay fees\\n")\nwith open("todo.txt", encoding="utf-8") as f:\n    for line in f:\n        print("-", line.strip())\n',
          expectedOutput: "- Buy rice\n- Pay fees",
        },
        codeChallenge: {
          task: "Write save_list(path, items) that writes each item of a list on its own line to the file at path (replacing any old content), and load_list(path) that reads the file back and returns the list of lines without their new-line characters. Use with in both.",
          starter: "def save_list(path, items):\n    pass\n\ndef load_list(path):\n    pass\n",
          sample: "save_list(\"subjects.txt\", [\"Maths\", \"English\"])\nload_list(\"subjects.txt\") → ['Maths', 'English']",
          tests: [
            {
              check:
                'save_list("subjects.txt", ["Maths", "English", "Physics"])\n' +
                'assert open("subjects.txt", encoding="utf-8").read() == "Maths\\nEnglish\\nPhysics\\n", "The file should contain each item on its own line, ending with a new line."\n' +
                'assert load_list("subjects.txt") == ["Maths", "English", "Physics"], "load_list should return the three items. Got " + repr(load_list("subjects.txt"))\n' +
                'save_list("subjects.txt", ["Biology"])\n' +
                'assert load_list("subjects.txt") == ["Biology"], "Saving again should REPLACE the old content (mode \\"w\\")."\n' +
                'assert uses("With"), "Use the with statement."',
            },
          ],
          solution: 'def save_list(path, items):\n    with open(path, "w", encoding="utf-8") as f:\n        for item in items:\n            f.write(item + "\\n")\n\ndef load_list(path):\n    with open(path, encoding="utf-8") as f:\n        return [line.rstrip("\\n") for line in f]\n',
          hint: "In save_list write item + \"\\n\" for each item. In load_list loop over the file and strip the new line from each line.",
          successMessage: "A list that survives the program closing. Everything else in this module is this idea with richer formats.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 11.4 – 11.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l47-read-write-append",
    moduleId: "pp-m11-files",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.4", "11.5", "11.6"],
    title: "Reading, Writing, Appending and Encodings",
    subtitle: "Text files in practice, and why encoding=\"utf-8\" matters",
    estimatedMinutes: 20,
    intro:
      "Three everyday file jobs: read a whole text file and process it, write a report, and add to a log without destroying what is there. Plus the one setting that stops names like Adébáyọ̀ and the ₦ sign from turning into garbage.",

    atoms: [
      {
        id: "a-pp-read-write-text",
        title: "Reading and writing text files",
        explain:
          "f.read() returns the whole file as one string; f.readlines() returns a list of lines (each ending in \\n); looping over f gives one line at a time, which is best for large files. Strip each line before using it. To write, build the text and call f.write(), or use print(..., file=f), which adds the new line for you.",
        code: {
          language: PY,
          code: 'with open("scores.txt", "w", encoding="utf-8") as f:\n    print("Ada 72", file=f)\n    print("Bayo 45", file=f)\ntotal = 0\nwith open("scores.txt", encoding="utf-8") as f:\n    for line in f:\n        name, score = line.split()\n        total += int(score)\nprint("Total:", total)\n',
          expectedOutput: "Total: 117",
        },
        codeChallenge: {
          task: "The file poem.txt is provided. Write file_stats(path) that returns three numbers: the number of lines, the number of words, and the number of characters (counting every character in the file, new lines included).",
          starter: "def file_stats(path):\n    pass\n",
          sample: "file_stats(\"poem.txt\") → (3, 13, 65)",
          tests: [
            {
              files: { "poem.txt": "The sun rose over Lagos\nmarkets woke with song\nand the day began\n" },
              check:
                'assert tuple(file_stats("poem.txt")) == (3, 13, 65), "poem.txt has 3 lines, 13 words and 65 characters. Got " + repr(file_stats("poem.txt"))',
            },
            {
              files: { "one.txt": "single line no newline" },
              check: 'assert tuple(file_stats("one.txt")) == (1, 4, 22), "A one-line file without a final new line: (1, 4, 22). Got " + repr(file_stats("one.txt"))',
            },
          ],
          solution: 'def file_stats(path):\n    with open(path, encoding="utf-8") as f:\n        text = f.read()\n    return len(text.splitlines()), len(text.split()), len(text)\n',
          hint: "Read the whole file into text. text.splitlines() gives the lines, text.split() the words, len(text) the characters.",
          successMessage: "A miniature version of the wc tool every programmer uses. Note how the second file, with no final new line, still counts as one line.",
        },
      },
      {
        id: "a-pp-append-mode",
        title: "Append mode versus write mode",
        explain:
          "\"w\" erases the file and starts again; \"a\" adds to the end and keeps what is there. A log, a history or a diary uses \"a\". Opening a file with \"w\" by mistake is one of the commonest ways programs lose data: there is no undo.",
        code: {
          language: PY,
          code: 'with open("log.txt", "w", encoding="utf-8") as f:\n    f.write("start\\n")\nwith open("log.txt", "a", encoding="utf-8") as f:\n    f.write("login Ada\\n")\nwith open("log.txt", "a", encoding="utf-8") as f:\n    f.write("logout Ada\\n")\nwith open("log.txt", encoding="utf-8") as f:\n    print(f.read())\n',
          expectedOutput: "start\nlogin Ada\nlogout Ada",
        },
        codeChallenge: {
          task: "Expense log. Write log_expense(path, item, amount) that APPENDS one line in the form item,amount to the file, and total_expenses(path) that reads the file and returns the sum of the amounts as a float (0.0 if the file does not exist yet; check with import os and os.path.exists(path)).",
          starter: "def log_expense(path, item, amount):\n    with open(path, \"w\", encoding=\"utf-8\") as f:\n        f.write(f\"{item},{amount}\\n\")\n\ndef total_expenses(path):\n    pass\n",
          sample: "log_expense(\"spend.csv\", \"bread\", 1200)\nlog_expense(\"spend.csv\", \"fuel\", 5000)\ntotal_expenses(\"spend.csv\") → 6200.0",
          tests: [
            {
              check:
                'assert total_expenses("missing.csv") == 0.0, "A file that does not exist yet totals 0.0."\n' +
                'log_expense("spend.csv", "bread", 1200)\n' +
                'log_expense("spend.csv", "fuel", 5000)\n' +
                'log_expense("spend.csv", "airtime", 500.5)\n' +
                'assert open("spend.csv", encoding="utf-8").read() == "bread,1200\\nfuel,5000\\nairtime,500.5\\n", "Each call should ADD a line. File now: " + repr(open("spend.csv", encoding="utf-8").read())\n' +
                'assert total_expenses("spend.csv") == 6700.5, "Total should be 6700.5. Got " + repr(total_expenses("spend.csv"))',
            },
          ],
          solution: 'import os\n\ndef log_expense(path, item, amount):\n    with open(path, "a", encoding="utf-8") as f:\n        f.write(f"{item},{amount}\\n")\n\ndef total_expenses(path):\n    if not os.path.exists(path):\n        return 0.0\n    total = 0.0\n    with open(path, encoding="utf-8") as f:\n        for line in f:\n            item, amount = line.strip().split(",")\n            total += float(amount)\n    return total\n',
          hint: "The starter's \"w\" erases the log on every call. Change it to \"a\". In total_expenses, split each line at the comma and add float(amount).",
          successMessage: "One letter, \"w\" to \"a\", is the difference between a log and a single line. You will reuse this in the Phase 3 finance tracker.",
        },
      },
      {
        id: "a-pp-encoding",
        title: "File encoding and Unicode",
        explain:
          "Text is stored as bytes, and an encoding is the rule that maps characters to bytes. Unicode gives every character in every language a number; UTF-8 is the standard way to store Unicode as bytes. Python strings are Unicode, but open() without encoding= uses the operating system's default, which on Windows is often not UTF-8, so ₦ or Ọ̀ can be corrupted or raise UnicodeDecodeError. Always write encoding=\"utf-8\".",
        code: {
          language: PY,
          code: 'names = ["Adébáyọ̀", "Ngozi", "Ọlá"]\nwith open("names.txt", "w", encoding="utf-8") as f:\n    f.write("\\n".join(names) + "\\n")\nwith open("names.txt", encoding="utf-8") as f:\n    print(f.read().split())\nprint(len("₦"), len("₦".encode("utf-8")))\n',
          expectedOutput: "['Adébáyọ̀', 'Ngozi', 'Ọlá']\n1 3",
        },
        why: "The naira sign is one character but three bytes in UTF-8. The text survives the round trip only because both open() calls name the same encoding.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 11.7 – 11.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l48-csv-json",
    moduleId: "pp-m11-files",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.7", "11.8"],
    title: "CSV and JSON",
    subtitle: "Tables for spreadsheets, structured data for programs",
    estimatedMinutes: 22,
    intro:
      "Two formats cover most data a program saves. CSV is a table that opens in Excel. JSON holds nested lists and dictionaries, and is what web APIs speak (Module 19). Python has a module for each, and both are safer than splitting text yourself.",

    atoms: [
      {
        id: "a-pp-csv",
        title: "Working with CSV files using csv",
        explain:
          "CSV (comma-separated values) stores one row per line with commas between the fields. Real CSV has traps, such as a comma inside a quoted name, so use the csv module. csv.DictReader(f) gives each row as a dictionary keyed by the header row; csv.DictWriter writes dictionaries. Open CSV files with newline=\"\" as the csv documentation requires. Every value read is a string: convert numbers yourself.",
        code: {
          language: PY,
          code: 'import csv\nrows = [{"name": "Ada", "score": 72}, {"name": "Obi, Jnr", "score": 64}]\nwith open("class.csv", "w", newline="", encoding="utf-8") as f:\n    writer = csv.DictWriter(f, fieldnames=["name", "score"])\n    writer.writeheader()\n    writer.writerows(rows)\nwith open("class.csv", newline="", encoding="utf-8") as f:\n    for row in csv.DictReader(f):\n        print(row["name"], int(row["score"]) + 5)\n',
          expectedOutput: "Ada 77\nObi, Jnr 69",
        },
        why: "\"Obi, Jnr\" contains a comma. The csv module wrote it in quotes and read it back as one field. Splitting the line at commas by hand would have broken it into two.",
        codeChallenge: {
          task: "CSV grade report. grades.csv is provided with columns name, maths, english, science. Write make_report(src, dest) that reads it and writes dest as a CSV with columns name, average, grade: the average to 1 decimal place and the grade A (70+), B (60+), C (50+) or F. Return the number of students written.",
          starter: "import csv\n\ndef make_report(src, dest):\n    pass\n",
          sample: "report.csv:\nname,average,grade\nAda,80.0,A\nBayo,55.3,C",
          tests: [
            {
              files: { "grades.csv": "name,maths,english,science\nAda,70,80,90\nBayo,50,61,55\nChi,40,45,50\n" },
              check:
                'n = make_report("grades.csv", "report.csv")\n' +
                'assert n == 3, "make_report should return 3. Got " + repr(n)\n' +
                'import csv as _csv\n' +
                'with open("report.csv", newline="", encoding="utf-8") as f:\n' +
                '    rows = list(_csv.reader(f))\n' +
                'assert rows == [["name", "average", "grade"], ["Ada", "80.0", "A"], ["Bayo", "55.3", "C"], ["Chi", "45.0", "F"]], "report.csv content: " + repr(rows)',
            },
          ],
          solution: 'import csv\n\ndef make_report(src, dest):\n    with open(src, newline="", encoding="utf-8") as f:\n        rows = list(csv.DictReader(f))\n    with open(dest, "w", newline="", encoding="utf-8") as f:\n        writer = csv.writer(f)\n        writer.writerow(["name", "average", "grade"])\n        for row in rows:\n            avg = (int(row["maths"]) + int(row["english"]) + int(row["science"])) / 3\n            grade = "A" if avg >= 70 else "B" if avg >= 60 else "C" if avg >= 50 else "F"\n            writer.writerow([row["name"], f"{avg:.1f}", grade])\n    return len(rows)\n',
          hint: "Read rows with csv.DictReader. Write with csv.writer: one writerow for the header, then one per student. Convert each score with int() before averaging.",
          successMessage: "Data in from a spreadsheet, processed, and a new spreadsheet out. A large share of office automation is exactly this.",
        },
      },
      {
        id: "a-pp-json",
        title: "Working with JSON using json",
        explain:
          "JSON stores dictionaries, lists, strings, numbers, true/false and null as text. json.dump(data, f, indent=2) writes a Python object to a file; json.load(f) reads it back as Python objects. json.dumps and json.loads (with an s, for string) do the same with a string. Dictionary keys always come back as strings.",
        code: {
          language: PY,
          code: 'import json\nsettings = {"theme": "dark", "font_size": 14, "recent": ["a.py", "b.py"], "beta": False}\nwith open("settings.json", "w", encoding="utf-8") as f:\n    json.dump(settings, f, indent=2)\nwith open("settings.json", encoding="utf-8") as f:\n    loaded = json.load(f)\nprint(loaded == settings, loaded["recent"][0])\nprint(json.dumps({"ok": True, "n": None}))\n',
          expectedOutput: "True a.py\n{\"ok\": true, \"n\": null}",
        },
        codeChallenge: {
          task: "JSON-based settings. Write load_settings(path) that returns the saved settings dictionary, or the defaults {\"theme\": \"light\", \"font_size\": 12} if the file does not exist. Saved values should override defaults, and any default missing from the file should still be present. Write save_settings(path, settings) that writes the dictionary as JSON with indent=2.",
          starter: "import json\n\ndef load_settings(path):\n    pass\n\ndef save_settings(path, settings):\n    pass\n",
          sample: "load_settings(\"s.json\") → {'theme': 'light', 'font_size': 12}",
          tests: [
            {
              check:
                'assert load_settings("none.json") == {"theme": "light", "font_size": 12}, "No file: return the defaults."\n' +
                'save_settings("s.json", {"theme": "dark", "font_size": 16})\n' +
                'import json as _j\n' +
                'assert _j.load(open("s.json", encoding="utf-8")) == {"theme": "dark", "font_size": 16}, "save_settings should write the dictionary as JSON."\n' +
                'assert load_settings("s.json") == {"theme": "dark", "font_size": 16}, "Saved values should come back."',
            },
            {
              files: { "old.json": "{\"theme\": \"dark\"}" },
              check: 'assert load_settings("old.json") == {"theme": "dark", "font_size": 12}, "A file missing font_size should still get the default 12. Got " + repr(load_settings("old.json"))',
            },
          ],
          solution: 'import json\nimport os\n\nDEFAULTS = {"theme": "light", "font_size": 12}\n\ndef load_settings(path):\n    settings = dict(DEFAULTS)\n    if os.path.exists(path):\n        with open(path, encoding="utf-8") as f:\n            settings.update(json.load(f))\n    return settings\n\ndef save_settings(path, settings):\n    with open(path, "w", encoding="utf-8") as f:\n        json.dump(settings, f, indent=2)\n',
          hint: "Start from a copy of the defaults, then settings.update(json.load(f)) if the file exists. update() overwrites matching keys and keeps the rest.",
          successMessage: "Defaults plus saved overrides is how almost every application's settings work, including VS Code's own settings.json.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 11.9 – 11.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l49-pathlib-persistence",
    moduleId: "pp-m11-files",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.9", "11.10"],
    title: "pathlib, and Data That Survives",
    subtitle: "Working with folders, and saving state between sessions",
    estimatedMinutes: 22,
    intro:
      "pathlib is the modern way to work with paths and folders, and it works the same on Windows, macOS and Linux. Then the payoff of the whole module: a program that loads its data when it starts and saves it when it changes.",

    atoms: [
      {
        id: "a-pp-pathlib",
        title: "File and directory operations with pathlib",
        explain:
          "from pathlib import Path. Path(\"data\") / \"scores.csv\" joins paths with / on every operating system. A Path knows .name, .stem (name without extension), .suffix (the extension) and .parent. .exists(), .is_file() and .is_dir() test it; .mkdir(parents=True, exist_ok=True) creates folders; .iterdir() lists a folder; .glob(\"*.txt\") finds matching files; .read_text() and .write_text() handle a whole file in one call.",
        code: {
          language: PY,
          code: 'from pathlib import Path\nfolder = Path("reports") / "2026"\nfolder.mkdir(parents=True, exist_ok=True)\n(folder / "jan.txt").write_text("January\\n", encoding="utf-8")\n(folder / "feb.txt").write_text("February\\n", encoding="utf-8")\np = folder / "jan.txt"\nprint(p.name, p.stem, p.suffix, p.parent.name)\nprint(sorted(f.name for f in folder.glob("*.txt")))\nprint(p.read_text(encoding="utf-8").strip())\n',
          expectedOutput: "jan.txt jan .txt 2026\n['feb.txt', 'jan.txt']\nJanuary",
        },
        codeChallenge: {
          task: "Write count_by_extension(folder) that looks at every FILE directly inside the folder (not sub-folders) and returns a dictionary of extension → count, with extensions in lower case and files with no extension counted under \"(none)\".",
          starter: "from pathlib import Path\n\ndef count_by_extension(folder):\n    pass\n",
          sample: "count_by_extension(\"docs\") → {'.pdf': 2, '.txt': 1, '(none)': 1}",
          tests: [
            {
              files: { "docs/cv.PDF": "x", "docs/letter.pdf": "x", "docs/notes.txt": "x", "docs/README": "x", "docs/old/archive.zip": "x" },
              check:
                'got = count_by_extension("docs")\n' +
                'assert got == {".pdf": 2, ".txt": 1, "(none)": 1}, "Expected {\'.pdf\': 2, \'.txt\': 1, \'(none)\': 1}; the zip is inside a sub-folder and must not count. Got " + repr(got)',
            },
          ],
          solution: 'from pathlib import Path\n\ndef count_by_extension(folder):\n    counts = {}\n    for p in Path(folder).iterdir():\n        if p.is_file():\n            ext = p.suffix.lower() or "(none)"\n            counts[ext] = counts.get(ext, 0) + 1\n    return counts\n',
          hint: "Loop over Path(folder).iterdir(), skip anything that is not p.is_file(), and use p.suffix.lower() or \"(none)\".",
          successMessage: "Folder scanning with pathlib. The file organiser in Module 20 starts from exactly this function.",
        },
      },
      {
        id: "a-pp-persistence",
        title: "Preserving data between program sessions",
        explain:
          "A program that keeps data between sessions follows one pattern: on start, LOAD the data from a file (or start empty if there is no file yet); whenever the data changes, SAVE it. JSON suits nested data such as a dictionary of lists. Keep loading and saving in two small functions so the rest of the program never touches the file directly.",
        code: {
          language: PY,
          code: 'import json\nfrom pathlib import Path\n\nDATA = Path("students.json")\n\ndef load():\n    if DATA.exists():\n        return json.loads(DATA.read_text(encoding="utf-8"))\n    return {}\n\ndef save(students):\n    DATA.write_text(json.dumps(students, indent=2), encoding="utf-8")\n\nstudents = load()\nstudents["Ada"] = [70, 80]\nsave(students)\nprint(load())\n',
          expectedOutput: "{'Ada': [70, 80]}",
        },
        codeChallenge: {
          task: "Expense tracker that remembers. Write load_expenses(path) returning the list of expense dicts saved in a JSON file (an empty list if there is no file), add_expense(path, item, amount, category) that loads, appends {\"item\": ..., \"amount\": ..., \"category\": ...}, saves and returns the new count, and total_by_category(path) returning a dict of category → total.",
          starter: "import json\nfrom pathlib import Path\n\ndef load_expenses(path):\n    pass\n\ndef add_expense(path, item, amount, category):\n    pass\n\ndef total_by_category(path):\n    pass\n",
          sample: "add_expense(\"exp.json\", \"bread\", 1200, \"food\") → 1",
          tests: [
            {
              check:
                'assert load_expenses("exp.json") == [], "No file yet: an empty list."\n' +
                'assert add_expense("exp.json", "bread", 1200, "food") == 1, "The first expense makes 1."\n' +
                'assert add_expense("exp.json", "fuel", 5000, "transport") == 2, "The second makes 2."\n' +
                'assert add_expense("exp.json", "rice", 3000, "food") == 3, "The third makes 3."\n' +
                'import json as _j\n' +
                'saved = _j.load(open("exp.json", encoding="utf-8"))\n' +
                'assert saved[0] == {"item": "bread", "amount": 1200, "category": "food"}, "Each expense is saved as a dict. First: " + repr(saved[0])\n' +
                'assert total_by_category("exp.json") == {"food": 4200, "transport": 5000}, "Got " + repr(total_by_category("exp.json"))',
            },
          ],
          solution: 'import json\nfrom pathlib import Path\n\ndef load_expenses(path):\n    p = Path(path)\n    if not p.exists():\n        return []\n    return json.loads(p.read_text(encoding="utf-8"))\n\ndef add_expense(path, item, amount, category):\n    expenses = load_expenses(path)\n    expenses.append({"item": item, "amount": amount, "category": category})\n    Path(path).write_text(json.dumps(expenses, indent=2), encoding="utf-8")\n    return len(expenses)\n\ndef total_by_category(path):\n    totals = {}\n    for e in load_expenses(path):\n        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]\n    return totals\n',
          hint: "add_expense: load, append a dict, write the whole list back with json.dumps, return len(). total_by_category: the grouping pattern from Module 10.",
          successMessage: "Close the program, open it again, and your expenses are still there. That is the milestone for this module.",
        },
      },
    ],

    task: {
      title: "Module 11 practice: four programs that remember",
      intro: "Every file operation uses with and encoding=\"utf-8\". The milestone is to build a program whose data remains available after it closes.",
      prompts: [
        "Save and load student records: make your Phase 2 Student Management System load students.json on start and save after every change.",
        "Expense tracker: a menu to add an expense, list them and show totals by category, stored in JSON.",
        "CSV grade report: read a class CSV, write a report CSV with averages and grades, and open the result in Excel or Google Sheets.",
        "JSON-based settings: a program with at least three settings, defaults, and a menu to change and save them.",
      ],
      closing: "Next: exceptions. Your programs will stop crashing on bad input and missing files.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
