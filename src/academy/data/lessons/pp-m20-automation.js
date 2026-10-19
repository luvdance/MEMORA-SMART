/**
 * PYTHON PROGRAMMING · MODULE 20 · AUTOMATION, DEPLOYMENT AND PORTFOLIO
 *
 * Curriculum 20.1 – 20.11. Automating repetitive work, batch file operations,
 * spreadsheets, reports and notifications, scheduling, argparse,
 * configuration, distributable command-line tools, deployment, application
 * security, and presenting a portfolio. The module ends with the course's
 * final project.
 *
 * Challenges use only the standard library so they run identically in the
 * page and on the build machine. openpyxl and pandas are taught by example
 * for VS Code.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s20-automation";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 82 · 20.1 – 20.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l82-automate-files",
    moduleId: "pp-m20-automation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["20.1", "20.2"],
    title: "Automating Repetitive Work",
    subtitle: "What to automate, and batch operations on files and folders",
    estimatedMinutes: 24,
    intro:
      "Renaming 300 photos, sorting a Downloads folder, merging 40 monthly spreadsheets: jobs that take a person an afternoon take a script seconds. Automation is where Python pays for itself fastest, and where your skills become immediately useful to any office or business.",

    atoms: [
      {
        id: "a-pp-automating",
        title: "Automating repetitive tasks",
        explain:
          "Good candidates for automation are tasks that are repetitive, rule-based and frequent: if you can write the steps as a checklist, a script can follow it. Build automation safely: run on a COPY first, add a dry-run mode that prints what it WOULD do, log every action, never overwrite or delete without a check, and make the script safe to run twice.",
        decision: {
          scenario: "You have written a script that renames 2,000 files in the company's shared folder. It has worked on your test folder.",
          question: "What should you do before running it on the real folder?",
          options: [
            {
              id: "a",
              text: "Back up the folder, run the script in dry-run mode to review what it will change, then run it for real with logging",
              why: "A dry run catches surprises, the backup makes any mistake recoverable, and the log records exactly what happened.",
            },
            {
              id: "b",
              text: "Run it straight away; it worked on the test folder",
              whyWrong: "Real data always contains cases the test folder did not: odd names, duplicates, open files.",
            },
            {
              id: "c",
              text: "Run it twice to be sure",
              whyWrong: "If the script is not idempotent, running it twice could rename files again.",
            },
            {
              id: "d",
              text: "Ask everyone to stop using computers for the day",
              whyWrong: "Unnecessary. A backup and dry run make it safe.",
            },
          ],
          correct: "a",
          aftermath: "Backup, dry run, log. Automation that destroys data destroys trust in automation.",
        },
      },
      {
        id: "a-pp-batch-files",
        title: "Batch file operations and directory management",
        explain:
          "pathlib finds and inspects files (iterdir, glob, rglob for subfolders, suffix, stat().st_size). shutil does the heavy lifting: shutil.move(src, dest) moves or renames, shutil.copy2 copies with timestamps, shutil.rmtree deletes a folder tree (carefully!). Path.mkdir(parents=True, exist_ok=True) creates folders safely. Before moving a file, check whether the destination already exists, so nothing is silently overwritten.",
        code: {
          language: PY,
          code: 'from pathlib import Path\nimport shutil\n\nbase = Path("demo")\n(base / "in").mkdir(parents=True, exist_ok=True)\nfor name in ["a.txt", "b.txt", "c.log"]:\n    (base / "in" / name).write_text("x", encoding="utf-8")\n(base / "out").mkdir(exist_ok=True)\nfor f in sorted((base / "in").glob("*.txt")):\n    shutil.move(str(f), str(base / "out" / f.name))\nprint(sorted(p.name for p in (base / "out").iterdir()))\nprint(sorted(p.name for p in (base / "in").iterdir()))\n',
          expectedOutput: "['a.txt', 'b.txt']\n['c.log']",
        },
        codeChallenge: {
          task: "File organiser. Write organise(folder, dry_run=False) that sorts the files directly inside folder into subfolders by type: .jpg/.jpeg/.png → images, .pdf/.docx/.txt → documents, .csv/.xlsx → data, anything else → other. Extensions are case-insensitive. If a file of the same name already exists in the destination, leave the file where it is and count it as skipped. Return a dict of counts, such as {\"images\": 2, \"documents\": 1, \"skipped\": 1}, including only non-zero counts. With dry_run=True, move nothing but return the same counts.",
          starter: "from pathlib import Path\nimport shutil\n\ndef organise(folder, dry_run=False):\n    pass\n",
          sample: "organise(\"downloads\") → {'images': 2, 'documents': 2, 'data': 1, 'other': 1, 'skipped': 1}",
          tests: [
            {
              files: {
                "downloads/Photo.JPG": "x",
                "downloads/logo.png": "x",
                "downloads/cv.pdf": "x",
                "downloads/notes.txt": "x",
                "downloads/sales.csv": "x",
                "downloads/song.mp3": "x",
                "downloads/report.pdf": "new",
                "downloads/documents/report.pdf": "old",
              },
              check:
                'from pathlib import Path\n' +
                'before = sorted(p.name for p in Path("downloads").iterdir() if p.is_file())\n' +
                'assert organise("downloads", dry_run=True) == {"images": 2, "documents": 2, "data": 1, "other": 1, "skipped": 1}, "Dry run counts. Got " + repr(organise("downloads", dry_run=True))\n' +
                'assert sorted(p.name for p in Path("downloads").iterdir() if p.is_file()) == before, "A dry run must not move anything."\n' +
                'got = organise("downloads")\n' +
                'assert got == {"images": 2, "documents": 2, "data": 1, "other": 1, "skipped": 1}, "Got " + repr(got)\n' +
                'assert sorted(p.name for p in Path("downloads/images").iterdir()) == ["Photo.JPG", "logo.png"], "Images moved."\n' +
                'assert (Path("downloads/other") / "song.mp3").exists() and (Path("downloads/data") / "sales.csv").exists(), "Other and data moved."\n' +
                'assert (Path("downloads") / "report.pdf").read_text() == "new" and (Path("downloads/documents") / "report.pdf").read_text() == "old", "A name clash must be skipped: neither file overwritten."',
            },
          ],
          solution: 'from pathlib import Path\nimport shutil\n\nKINDS = {\n    "images": {".jpg", ".jpeg", ".png"},\n    "documents": {".pdf", ".docx", ".txt"},\n    "data": {".csv", ".xlsx"},\n}\n\ndef kind_of(path):\n    for kind, extensions in KINDS.items():\n        if path.suffix.lower() in extensions:\n            return kind\n    return "other"\n\ndef organise(folder, dry_run=False):\n    folder = Path(folder)\n    counts = {}\n    for path in sorted(p for p in folder.iterdir() if p.is_file()):\n        target_dir = folder / kind_of(path)\n        target = target_dir / path.name\n        if target.exists():\n            counts["skipped"] = counts.get("skipped", 0) + 1\n            continue\n        if not dry_run:\n            target_dir.mkdir(exist_ok=True)\n            shutil.move(str(path), str(target))\n        counts[kind_of(path)] = counts.get(kind_of(path), 0) + 1\n    return counts\n',
          hint: "List the files first (sorted(p for p in folder.iterdir() if p.is_file())) so you are not changing the folder while iterating it. Check target.exists() before moving, and only move when not dry_run.",
          successMessage: "A real tool: dry-run mode, no overwrites, a summary of what happened. Point it at your own Downloads folder (on a copy first!).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 83 · 20.3 – 20.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l83-spreadsheets-reports",
    moduleId: "pp-m20-automation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["20.3", "20.4", "20.5"],
    title: "Spreadsheets, Reports, Notifications and Schedules",
    subtitle: "Cleaning business data, producing reports, and running on time",
    estimatedMinutes: 28,
    intro:
      "Most organisations run on spreadsheets that someone cleans, summarises and emails every week by hand. That entire job can be a script that runs on a schedule. This lesson builds the pieces.",

    atoms: [
      {
        id: "a-pp-spreadsheets",
        title: "Processing spreadsheets with openpyxl or pandas",
        explain:
          "openpyxl reads and writes .xlsx files cell by cell, including formatting and formulas. pandas loads a sheet into a DataFrame, a table you can filter, group and summarise in a few lines, and writes results back to Excel or CSV. Both are installed with pip. Many spreadsheet jobs also start from a CSV export, which the standard csv module handles with no installation at all.",
        example:
          "# python -m pip install openpyxl pandas\nfrom openpyxl import load_workbook\n\nwb = load_workbook(\"sales.xlsx\")\nws = wb[\"January\"]\nfor row in ws.iter_rows(min_row=2, values_only=True):\n    region, rep, amount = row\n    print(region, rep, amount)\nws[\"E1\"] = \"Checked\"\nwb.save(\"sales_checked.xlsx\")\n\nimport pandas as pd\n\ndf = pd.read_excel(\"sales.xlsx\", sheet_name=\"January\")\nsummary = df.groupby(\"region\")[\"amount\"].sum().sort_values(ascending=False)\nsummary.to_excel(\"summary.xlsx\")",
        codeChallenge: {
          task: "Spreadsheet cleaner. raw_sales.csv (an export with columns rep, region, amount) is messy: extra spaces, inconsistent capitals, amounts like \"1,200\" and \"N3,500.50\", blank rows and exact duplicate rows. Write clean_sales(src, dest) that writes dest as a CSV with the same header, where rep is title case, region is upper case, amount is a plain number with 2 decimals, blank rows (no rep) and repeated rows (after cleaning) are dropped, and rows whose amount cannot be read are dropped too. Return (rows_written, rows_dropped).",
          starter: "import csv\n\ndef clean_sales(src, dest):\n    pass\n",
          sample: "rep,region,amount\nAda Obi,LAGOS,1200.00\nMusa Bello,KANO,3500.50",
          tests: [
            {
              files: {
                "raw_sales.csv": "rep,region,amount\n  ada obi ,lagos,\"1,200\"\nMUSA BELLO, Kano ,N3500.50\n,,\nAda Obi,LAGOS,1200\nchi eze,abuja,twelve\nchi eze,abuja,800\n",
              },
              check:
                'result = clean_sales("raw_sales.csv", "clean.csv")\n' +
                'import csv as _c\n' +
                'with open("clean.csv", newline="", encoding="utf-8") as f:\n' +
                '    rows = list(_c.reader(f))\n' +
                'assert rows == [["rep", "region", "amount"], ["Ada Obi", "LAGOS", "1200.00"], ["Musa Bello", "KANO", "3500.50"], ["Chi Eze", "ABUJA", "800.00"]], "clean.csv: " + repr(rows)\n' +
                'assert tuple(result) == (3, 3), "3 written; dropped the blank row, the duplicate Ada row and the unreadable amount. Got " + repr(result)',
            },
          ],
          solution: 'import csv\n\ndef parse_amount(text):\n    cleaned = text.replace(",", "").replace("N", "").replace("\\u20a6", "").strip()\n    return float(cleaned)\n\ndef clean_sales(src, dest):\n    written, dropped = 0, 0\n    seen = set()\n    with open(src, newline="", encoding="utf-8") as fin, open(dest, "w", newline="", encoding="utf-8") as fout:\n        reader = csv.DictReader(fin)\n        writer = csv.writer(fout)\n        writer.writerow(["rep", "region", "amount"])\n        for row in reader:\n            rep = " ".join((row.get("rep") or "").split()).title()\n            region = (row.get("region") or "").strip().upper()\n            if not rep:\n                dropped += 1\n                continue\n            try:\n                amount = f"{parse_amount(row.get(\'amount\') or \'\'):.2f}"\n            except ValueError:\n                dropped += 1\n                continue\n            key = (rep, region, amount)\n            if key in seen:\n                dropped += 1\n                continue\n            seen.add(key)\n            writer.writerow([rep, region, amount])\n            written += 1\n    return written, dropped\n',
          hint: "Normalise each field first, THEN check for blanks and duplicates (a set of cleaned tuples), so \"  ada obi \" and \"Ada Obi\" are recognised as the same row.",
          successMessage: "A real data-cleaning pipeline. This exact kind of script saves analysts hours every week, and it is the first step of every report.",
        },
      },
      {
        id: "a-pp-reports-notifications",
        title: "Generating reports and sending automated notifications",
        explain:
          "A report script reads data, calculates a summary and writes it somewhere people look: a text or HTML file, a spreadsheet, or an email. The email.message.EmailMessage class builds a proper email (subject, sender, recipients, body, attachments); smtplib.SMTP_SSL sends it through a mail server, with the password read from an environment variable. Messaging apps such as Slack and Telegram accept notifications through simple HTTP APIs (Module 19).",
        example:
          "import os, smtplib\nfrom email.message import EmailMessage\n\nmsg = build_report_email(...)            # the function you write below\nwith smtplib.SMTP_SSL(\"smtp.gmail.com\", 465) as smtp:\n    smtp.login(os.environ[\"MAIL_USER\"], os.environ[\"MAIL_APP_PASSWORD\"])\n    smtp.send_message(msg)",
        codeChallenge: {
          task: "Write build_report_email(totals, to_address, report_date) that returns an email.message.EmailMessage with From set to reports@memora.ng, To set to to_address, Subject set to Sales report for YYYY-MM-DD (report_date is a datetime.date), and a plain-text body: one line per region as REGION: N1,234.00 sorted from highest to lowest, then a blank line, then Total: N... . totals is a dict of region → amount.",
          starter: "from email.message import EmailMessage\n\ndef build_report_email(totals, to_address, report_date):\n    pass\n",
          sample: "Subject: Sales report for 2026-10-18\n\nLAGOS: N1,200,000.00\nKANO: N450,500.00\n\nTotal: N1,650,500.00",
          tests: [
            {
              check:
                'from datetime import date\n' +
                'msg = build_report_email({"KANO": 450500, "LAGOS": 1200000}, "boss@memora.ng", date(2026, 10, 18))\n' +
                'from email.message import EmailMessage as _EM\n' +
                'assert isinstance(msg, _EM), "Return an EmailMessage."\n' +
                'assert msg["From"] == "reports@memora.ng" and msg["To"] == "boss@memora.ng", "Set From and To."\n' +
                'assert msg["Subject"] == "Sales report for 2026-10-18", "Subject got " + repr(msg["Subject"])\n' +
                'body = msg.get_content().strip()\n' +
                'assert body == "LAGOS: N1,200,000.00\\nKANO: N450,500.00\\n\\nTotal: N1,650,500.00", "Body got:\\n" + body',
            },
          ],
          solution: 'from email.message import EmailMessage\n\ndef build_report_email(totals, to_address, report_date):\n    lines = [f"{region}: N{amount:,.2f}" for region, amount in sorted(totals.items(), key=lambda kv: -kv[1])]\n    lines.append("")\n    lines.append(f"Total: N{sum(totals.values()):,.2f}")\n    msg = EmailMessage()\n    msg["From"] = "reports@memora.ng"\n    msg["To"] = to_address\n    msg["Subject"] = f"Sales report for {report_date.isoformat()}"\n    msg.set_content("\\n".join(lines))\n    return msg\n',
          hint: "msg = EmailMessage(); set msg[\"From\"], msg[\"To\"], msg[\"Subject\"]; msg.set_content(text). date.isoformat() gives YYYY-MM-DD.",
          successMessage: "A correctly formed email, ready for smtplib to send. Combined with the cleaner above, that is a complete weekly report robot.",
        },
      },
      {
        id: "a-pp-scheduling",
        title: "Date-based scheduling concepts",
        explain:
          "Automation usually runs on a timetable. The operating system does the scheduling: cron on Linux and macOS (0 7 * * MON runs every Monday at 07:00), Task Scheduler on Windows, or a cloud scheduler. Your script just needs to do its job when started, and often to work out dates: the next run, whether a job is due, the last day of the month. datetime and timedelta do that arithmetic correctly across months and years.",
        code: {
          language: PY,
          code: 'from datetime import datetime, timedelta\nnow = datetime(2026, 10, 18, 9, 30)        # a Sunday\nprint(now.strftime("%A %d %B %Y %H:%M"))\nnext_monday = now + timedelta(days=(7 - now.weekday()) % 7 or 7)\nprint(next_monday.date())\nprint((now - datetime(2026, 10, 1)).days, "days since the 1st")\n',
          expectedOutput: "Sunday 18 October 2026 09:30\n2026-10-19\n17 days since the 1st",
        },
        codeChallenge: {
          task: "Write next_run(now, weekday, hour) that returns the next datetime, strictly after now, falling on the given weekday (0 = Monday … 6 = Sunday) at hour:00. If today is that weekday and the hour is still to come, it is today.",
          starter: "from datetime import datetime, timedelta\n\ndef next_run(now, weekday, hour):\n    pass\n",
          sample: "next_run(datetime(2026, 10, 18, 9, 30), 0, 7) → datetime(2026, 10, 19, 7, 0)",
          tests: [
            {
              check:
                'from datetime import datetime\n' +
                'sun = datetime(2026, 10, 18, 9, 30)\n' +
                'assert next_run(sun, 0, 7) == datetime(2026, 10, 19, 7, 0), "Sunday 09:30 → Monday 07:00. Got " + repr(next_run(sun, 0, 7))\n' +
                'assert next_run(sun, 6, 18) == datetime(2026, 10, 18, 18, 0), "Later the same Sunday. Got " + repr(next_run(sun, 6, 18))\n' +
                'assert next_run(sun, 6, 9) == datetime(2026, 10, 25, 9, 0), "09:00 Sunday has passed, so next Sunday. Got " + repr(next_run(sun, 6, 9))\n' +
                'assert next_run(datetime(2026, 12, 31, 23, 0), 4, 8) == datetime(2027, 1, 1, 8, 0), "Across a year boundary. Got " + repr(next_run(datetime(2026, 12, 31, 23, 0), 4, 8))',
            },
          ],
          solution: "from datetime import datetime, timedelta\n\ndef next_run(now, weekday, hour):\n    days_ahead = (weekday - now.weekday()) % 7\n    candidate = (now + timedelta(days=days_ahead)).replace(hour=hour, minute=0, second=0, microsecond=0)\n    if candidate <= now:\n        candidate += timedelta(days=7)\n    return candidate\n",
          hint: "days_ahead = (weekday - now.weekday()) % 7; build the candidate with .replace(hour=hour, minute=0, second=0, microsecond=0); if it is not after now, add 7 days.",
          successMessage: "Correct across weeks and years. This is the calculation behind every \"next run\" column in a job scheduler.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 84 · 20.6 – 20.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l84-cli-tools",
    moduleId: "pp-m20-automation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["20.6", "20.7", "20.8"],
    title: "Command-Line Tools and Configuration",
    subtitle: "argparse, layered configuration, and a tool others can install",
    estimatedMinutes: 28,
    intro:
      "A script with its settings hard-coded is useful to you. A command-line tool with arguments, --help, sensible defaults and configuration is useful to everyone. This is how your automation becomes a product.",

    atoms: [
      {
        id: "a-pp-argparse",
        title: "Command-line arguments using argparse",
        explain:
          "argparse turns the words after your script's name into values. add_argument(\"path\") defines a required positional argument; add_argument(\"--top\", type=int, default=10) an optional one with a type and default; choices= restricts values; action=\"store_true\" makes a flag. argparse writes --help automatically and rejects bad input with a clear message. parse_args(list) accepts a list of words, which is how you test it.",
        code: {
          language: PY,
          code: 'import argparse\nparser = argparse.ArgumentParser(prog="report", description="Summarise a sales CSV.")\nparser.add_argument("path")\nparser.add_argument("--top", type=int, default=3)\nparser.add_argument("--verbose", action="store_true")\nargs = parser.parse_args(["sales.csv", "--top", "5"])\nprint(args.path, args.top, args.verbose)\n',
          expectedOutput: "sales.csv 5 False",
        },
        codeChallenge: {
          task: "Write build_parser() returning an argparse.ArgumentParser (prog=\"organise\") with: a required positional folder; --dry-run as a flag; --format with choices text or json, default text; and --min-size as an int in kilobytes, default 0. (argparse turns --dry-run into args.dry_run and --min-size into args.min_size.)",
          starter: "import argparse\n\ndef build_parser():\n    pass\n",
          sample: "build_parser().parse_args([\"downloads\", \"--dry-run\", \"--format\", \"json\"]) → folder='downloads', dry_run=True, format='json', min_size=0",
          tests: [
            {
              check:
                'p = build_parser()\n' +
                'a = p.parse_args(["downloads"])\n' +
                'assert (a.folder, a.dry_run, a.format, a.min_size) == ("downloads", False, "text", 0), "Defaults. Got " + repr(vars(a))\n' +
                'a = p.parse_args(["docs", "--dry-run", "--format", "json", "--min-size", "250"])\n' +
                'assert (a.folder, a.dry_run, a.format, a.min_size) == ("docs", True, "json", 250), "Got " + repr(vars(a))\n' +
                'import io, contextlib\n' +
                'for bad in (["docs", "--format", "xml"], []):\n' +
                '    try:\n' +
                '        with contextlib.redirect_stderr(io.StringIO()):\n' +
                '            p.parse_args(bad)\n' +
                '        assert False, f"parse_args({bad}) should be rejected."\n' +
                '    except SystemExit:\n' +
                '        pass\n' +
                'assert p.prog == "organise", "Set prog=\\"organise\\"."',
            },
          ],
          solution: 'import argparse\n\ndef build_parser():\n    parser = argparse.ArgumentParser(prog="organise", description="Sort files into folders by type.")\n    parser.add_argument("folder", help="folder to organise")\n    parser.add_argument("--dry-run", action="store_true", help="show what would happen")\n    parser.add_argument("--format", choices=["text", "json"], default="text")\n    parser.add_argument("--min-size", type=int, default=0, help="ignore files smaller than this (KB)")\n    return parser\n',
          hint: "add_argument(\"--format\", choices=[\"text\", \"json\"], default=\"text\") and add_argument(\"--min-size\", type=int, default=0).",
          successMessage: "Typed, validated arguments with automatic --help. argparse rejected the bad format and the missing folder for you.",
        },
      },
      {
        id: "a-pp-config-layers",
        title: "Configuration management and environment variables",
        explain:
          "Real tools read settings from several places, in a fixed order of precedence, each overriding the one before: built-in DEFAULTS, then a CONFIG FILE (JSON or TOML), then ENVIRONMENT VARIABLES, then COMMAND-LINE ARGUMENTS. That lets a team share a config file, a server override it with environment variables, and a user override anything for one run.",
        codeChallenge: {
          task: "Write load_config(config_path, env, cli) returning the final settings dictionary. Start from DEFAULTS = {\"output\": \"report.txt\", \"currency\": \"NGN\", \"top\": 5}. Override with the JSON file at config_path if it exists; then with environment variables REPORT_OUTPUT, REPORT_CURRENCY and REPORT_TOP from the env dict (REPORT_TOP converted to int); then with any cli values that are not None. Unknown keys in the file are ignored.",
          starter: "import json\nimport os\n\nDEFAULTS = {\"output\": \"report.txt\", \"currency\": \"NGN\", \"top\": 5}\n\ndef load_config(config_path, env, cli):\n    pass\n",
          sample: "File {\"top\": 10}, env {\"REPORT_CURRENCY\": \"USD\"}, cli {\"output\": \"x.txt\", \"top\": None} → {'output': 'x.txt', 'currency': 'USD', 'top': 10}",
          tests: [
            {
              files: { "settings.json": "{\"top\": 10, \"output\": \"weekly.txt\", \"colour\": \"blue\"}" },
              check:
                'assert load_config("none.json", {}, {}) == {"output": "report.txt", "currency": "NGN", "top": 5}, "Defaults only."\n' +
                'assert load_config("settings.json", {}, {}) == {"output": "weekly.txt", "currency": "NGN", "top": 10}, "The file overrides defaults; unknown keys are ignored. Got " + repr(load_config("settings.json", {}, {}))\n' +
                'env = {"REPORT_CURRENCY": "USD", "REPORT_TOP": "3", "PATH": "x"}\n' +
                'assert load_config("settings.json", env, {}) == {"output": "weekly.txt", "currency": "USD", "top": 3}, "Environment overrides the file. Got " + repr(load_config("settings.json", env, {}))\n' +
                'cli = {"output": "today.txt", "top": None, "currency": None}\n' +
                'assert load_config("settings.json", env, cli) == {"output": "today.txt", "currency": "USD", "top": 3}, "CLI overrides everything, but None means not given. Got " + repr(load_config("settings.json", env, cli))',
            },
          ],
          solution: 'import json\nimport os\n\nDEFAULTS = {"output": "report.txt", "currency": "NGN", "top": 5}\nENV_KEYS = {"REPORT_OUTPUT": "output", "REPORT_CURRENCY": "currency", "REPORT_TOP": "top"}\n\ndef load_config(config_path, env, cli):\n    config = dict(DEFAULTS)\n    if os.path.exists(config_path):\n        with open(config_path, encoding="utf-8") as f:\n            from_file = json.load(f)\n        config.update({k: v for k, v in from_file.items() if k in DEFAULTS})\n    for var, key in ENV_KEYS.items():\n        if var in env:\n            config[key] = int(env[var]) if key == "top" else env[var]\n    config.update({k: v for k, v in cli.items() if v is not None and k in DEFAULTS})\n    return config\n',
          hint: "Copy DEFAULTS, then update in order: file (keys in DEFAULTS only), environment (via a name map), then CLI values that are not None.",
          successMessage: "Four layers, the right one winning every time. This is exactly how tools such as pip, git and ruff resolve their settings.",
        },
      },
      {
        id: "a-pp-distributable-cli",
        title: "Building a distributable command-line tool",
        explain:
          "To make a tool installable, give it a main(argv=None) function that parses arguments, does the work and RETURNS an exit code (0 success, non-zero failure), and describe the project in a pyproject.toml with a [project.scripts] entry. python -m pip install . then creates a real command. Others install it from your Git repository, or you publish it to PyPI. Keeping main(argv) separate from sys.argv makes the tool testable.",
        example:
          "# pyproject.toml\n[project]\nname = \"organise-files\"\nversion = \"1.0.0\"\nrequires-python = \">=3.11\"\ndependencies = []\n\n[project.scripts]\norganise = \"organise.cli:main\"\n\n[build-system]\nrequires = [\"setuptools>=69\"]\nbuild-backend = \"setuptools.build_meta\"\n\n# organise/cli.py\nimport sys\n\ndef main(argv=None):\n    args = build_parser().parse_args(argv)\n    ...\n    return 0\n\nif __name__ == \"__main__\":\n    sys.exit(main())\n\n> python -m pip install .\n> organise ~/Downloads --dry-run",
        codeChallenge: {
          task: "Write main(argv=None) for a word-count tool: it parses argv with argparse (a positional path and an optional --top int, default 3), reads the text file, and prints the top N most common words (lower-cased) as word: count, one per line, most common first (ties alphabetical). It returns 0 on success; if the file does not exist it prints error: file not found: PATH to sys.stderr and returns 1.",
          starter: "import argparse\nimport sys\nfrom collections import Counter\n\ndef main(argv=None):\n    pass\n",
          sample: "main([\"essay.txt\", \"--top\", \"2\"]) prints\nthe: 3\nand: 2\nand returns 0",
          tests: [
            {
              files: { "essay.txt": "The cat and the dog and THE bird" },
              check:
                'import io, contextlib\n' +
                'out, err = io.StringIO(), io.StringIO()\n' +
                'with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):\n' +
                '    code = main(["essay.txt", "--top", "2"])\n' +
                'assert code == 0, "Return 0 on success. Got " + repr(code)\n' +
                'assert out.getvalue().strip().splitlines() == ["the: 3", "and: 2"], "Got " + repr(out.getvalue())\n' +
                'out, err = io.StringIO(), io.StringIO()\n' +
                'with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):\n' +
                '    code = main(["essay.txt"])\n' +
                'assert out.getvalue().strip().splitlines() == ["the: 3", "and: 2", "bird: 1"], "Default --top 3, ties alphabetical. Got " + repr(out.getvalue())\n' +
                'out, err = io.StringIO(), io.StringIO()\n' +
                'with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):\n' +
                '    code = main(["missing.txt"])\n' +
                'assert code == 1 and err.getvalue().strip() == "error: file not found: missing.txt", "Missing file: message on stderr and return 1. Got code " + repr(code) + ", stderr " + repr(err.getvalue())',
            },
          ],
          solution: 'import argparse\nimport sys\nfrom collections import Counter\n\ndef main(argv=None):\n    parser = argparse.ArgumentParser(prog="wordcount")\n    parser.add_argument("path")\n    parser.add_argument("--top", type=int, default=3)\n    args = parser.parse_args(argv)\n    try:\n        with open(args.path, encoding="utf-8") as f:\n            words = f.read().lower().split()\n    except FileNotFoundError:\n        print(f"error: file not found: {args.path}", file=sys.stderr)\n        return 1\n    counts = Counter(words)\n    for word, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[: args.top]:\n        print(f"{word}: {count}")\n    return 0\n',
          hint: "parse_args(argv) uses the list you pass in. print(..., file=sys.stderr) writes an error message. Sort counts by (-count, word) and slice the first args.top.",
          successMessage: "A testable, installable CLI with proper exit codes and error output. Add the pyproject.toml from the example and it becomes a real command on your machine.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 85 · 20.9 – 20.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l85-deploy-portfolio",
    moduleId: "pp-m20-automation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["20.9", "20.10", "20.11"],
    title: "Deployment, Security and Your Portfolio",
    subtitle: "Running in production, protecting users, and showing your work",
    estimatedMinutes: 30,
    intro:
      "The last lesson of the course. Code that only runs on your laptop helps nobody else, code that leaks passwords hurts people, and work nobody can see does not get you hired. Deployment, security and presentation are what turn a programmer into a professional.",

    atoms: [
      {
        id: "a-pp-deployment",
        title: "Deployment fundamentals and dependency installation",
        explain:
          "Deployment means running your application somewhere other than your laptop: a server, a cloud platform, or a colleague's machine. The essentials: pin dependencies (requirements.txt with exact versions, or a lock file) so the same versions install everywhere; create a fresh virtual environment on the target; configure with environment variables, never edited code; run web apps with a production server (gunicorn or uvicorn, not the development server); log to files or a logging service; and make deployment a repeatable script, not a sequence of remembered commands. Docker packages the whole environment into one image.",
        example:
          "Deploying a Flask API to a Linux server:\n\n  git clone https://github.com/you/school-api.git\n  cd school-api\n  python3 -m venv .venv && source .venv/bin/activate\n  python -m pip install -r requirements.txt\n  export DATABASE_PATH=/srv/data/school.db API_KEYS=...\n  gunicorn --workers 3 --bind 0.0.0.0:8000 app:app\n\nA Dockerfile does the same, reproducibly:\n\n  FROM python:3.13-slim\n  WORKDIR /app\n  COPY requirements.txt .\n  RUN pip install --no-cache-dir -r requirements.txt\n  COPY . .\n  CMD [\"gunicorn\", \"--bind\", \"0.0.0.0:8000\", \"app:app\"]",
        decision: {
          scenario: "Your API works on your laptop but crashes on the server with ImportError: cannot import name ... from a library.",
          question: "What is the most likely cause, and the fix?",
          options: [
            {
              id: "a",
              text: "The server installed a different version of the library; pin exact versions in requirements.txt and reinstall in a fresh virtual environment",
              why: "Unpinned dependencies drift. Pinning makes every machine install the versions you tested.",
            },
            {
              id: "b",
              text: "Servers cannot run Python",
              whyWrong: "Most of the web's Python runs on servers.",
            },
            {
              id: "c",
              text: "Copy your laptop's whole Python folder to the server",
              whyWrong: "Fragile and platform-specific; a pinned requirements file is the reliable way.",
            },
            {
              id: "d",
              text: "Delete the import",
              whyWrong: "The code needs it; the environment is what is wrong.",
            },
          ],
          correct: "a",
          aftermath: "Same versions, fresh environment, configuration from the environment: the three habits that make \"works on my machine\" work everywhere.",
        },
      },
      {
        id: "a-pp-app-security",
        title: "Application security basics",
        explain:
          "The essentials, most of which you have already practised: validate all input; use parameterised SQL (Module 18); keep secrets out of code (Module 15); give every account and service the least privilege it needs; keep dependencies updated (pip-audit lists known vulnerabilities); never trust file paths from users (a name like ../../etc/passwd escapes your folder); and NEVER store passwords. Store a salted, slow hash instead: hashlib.pbkdf2_hmac with a random salt from secrets, and compare with hmac.compare_digest.",
        codeChallenge: {
          task: "Write hash_password(password) that returns a string \"SALT_HEX$HASH_HEX\" using a 16-byte random salt from secrets.token_bytes and hashlib.pbkdf2_hmac(\"sha256\", password.encode(), salt, 100_000). Write verify_password(password, stored) that recomputes the hash with the stored salt and compares with hmac.compare_digest. Also write safe_path(base, filename) that returns the resolved Path of base/filename, raising ValueError(\"unsafe path\") if it would fall outside base.",
          starter: "import hashlib\nimport hmac\nimport secrets\nfrom pathlib import Path\n\ndef hash_password(password):\n    return password\n\ndef verify_password(password, stored):\n    return password == stored\n\ndef safe_path(base, filename):\n    return Path(base) / filename\n",
          sample: "hash_password(\"Py#2026\") → '9f2c…$4b1a…' (different every time)",
          tests: [
            {
              check:
                'h1 = hash_password("Py#2026")\n' +
                'h2 = hash_password("Py#2026")\n' +
                'assert "Py#2026" not in h1 and "$" in h1, "Never store the password itself: return SALT$HASH."\n' +
                'salt, digest = h1.split("$")\n' +
                'assert len(bytes.fromhex(salt)) == 16 and len(bytes.fromhex(digest)) == 32, "Use a 16-byte salt and a sha256 hash (32 bytes), both as hex."\n' +
                'assert h1 != h2, "A random salt makes the same password hash differently each time."\n' +
                'assert verify_password("Py#2026", h1) and verify_password("Py#2026", h2), "The right password verifies."\n' +
                'assert not verify_password("py#2026", h1), "A wrong password fails."\n' +
                'import hashlib as _h\n' +
                'assert digest == _h.pbkdf2_hmac("sha256", b"Py#2026", bytes.fromhex(salt), 100_000).hex(), "Use pbkdf2_hmac with sha256 and 100,000 iterations."\n' +
                'from pathlib import Path\n' +
                'Path("uploads").mkdir(exist_ok=True)\n' +
                'assert safe_path("uploads", "cv.pdf") == (Path("uploads") / "cv.pdf").resolve(), "A normal name resolves inside the folder."\n' +
                'for bad in ["../secret.txt", "../../etc/passwd", "sub/../../x"]:\n' +
                '    try:\n' +
                '        safe_path("uploads", bad)\n' +
                '        assert False, f"safe_path should reject {bad!r}"\n' +
                '    except ValueError as e:\n' +
                '        assert str(e) == "unsafe path", "Message: unsafe path"\n' +
                'assert calls("compare_digest") and calls("token_bytes"), "Use secrets.token_bytes and hmac.compare_digest."',
            },
          ],
          solution: 'import hashlib\nimport hmac\nimport secrets\nfrom pathlib import Path\n\nITERATIONS = 100_000\n\ndef hash_password(password):\n    salt = secrets.token_bytes(16)\n    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, ITERATIONS)\n    return salt.hex() + "$" + digest.hex()\n\ndef verify_password(password, stored):\n    salt_hex, digest_hex = stored.split("$")\n    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), ITERATIONS)\n    return hmac.compare_digest(digest.hex(), digest_hex)\n\ndef safe_path(base, filename):\n    root = Path(base).resolve()\n    target = (root / filename).resolve()\n    if not target.is_relative_to(root):\n        raise ValueError("unsafe path")\n    return target\n',
          hint: "Store salt.hex() + \"$\" + digest.hex(). To verify, split on $, rebuild the digest from the salt, and compare_digest. For paths, resolve both and use target.is_relative_to(root).",
          successMessage: "Salted, slow password hashes and path-traversal protection: two of the most common security failures in real applications, both prevented.",
        },
      },
      {
        id: "a-pp-portfolio",
        title: "Project documentation, demonstrations and portfolio presentation",
        explain:
          "A portfolio shows employers what you can do. Choose three to five projects that solve real problems, each in its own GitHub repository with a clear README (what, why, how to install and run, a screenshot or short demo GIF), tests, and a clean commit history. Pin them on your GitHub profile. In a demonstration, show the problem first, then the working tool, then one design decision and one bug you fixed, in under five minutes. Be honest about what you built and what you would improve.",
        decision: {
          scenario: "You have five minutes to demonstrate your file organiser to a hiring panel.",
          question: "Which plan is strongest?",
          options: [
            {
              id: "a",
              text: "Show a messy folder, run the tool live (dry run, then real), show the tests passing, then explain one design decision and one bug you fixed",
              why: "Problem, solution, proof, and insight into how you think: exactly what a panel wants to see in five minutes.",
            },
            {
              id: "b",
              text: "Scroll through every line of code from top to bottom",
              whyWrong: "Nobody can follow a code dump; it hides the value of the work.",
            },
            {
              id: "c",
              text: "Talk about the technologies you plan to learn next",
              whyWrong: "The panel asked about what you built; show it.",
            },
            {
              id: "d",
              text: "Claim the tool is bug-free and perfect",
              whyWrong: "Honesty about trade-offs and fixes is far more convincing than claimed perfection.",
            },
          ],
          correct: "a",
          aftermath: "Problem, live demo, evidence, reflection. Practise it until it fits comfortably in the time.",
        },
      },
    ],

    task: {
      title: "Final project: a complete, documented Python application",
      intro:
        "Choose one: a report generator, a spreadsheet cleaner, a file organiser or an automated invoice generator. Build it as your portfolio centrepiece. The milestone is to deliver a complete Python application with documentation, tests and a clear demonstration.",
      prompts: [
        "A command-line tool with argparse, a main(argv) that returns exit codes, layered configuration, and a dry-run mode where it changes files.",
        "Robust input handling and logging; every expected failure (missing file, bad data, wrong arguments) handled with a clear message.",
        "Automated tests with pytest, including boundary and error cases, and an integration test on temporary files.",
        "A Git repository with a meaningful history, a README (what, install, run, configure, test, structure), a pinned requirements.txt and a pyproject.toml so it installs as a command.",
        "A five-minute demonstration: the problem, a live run, the tests, one design decision and one bug you fixed.",
      ],
      closing:
        "That is the course. You started by writing an algorithm for making tea; you finish with an installable, tested, documented tool. Keep building: the best programmers are simply the ones who kept writing code.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
