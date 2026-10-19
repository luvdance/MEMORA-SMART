/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 20
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l82-automate-files": {
    lessonId: "pp-l82-automate-files",
    passMark: 70,
    questions: [
      {
        id: "ppq82-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-automating",
        prompt: "Which task is the best candidate for automation?",
        options: [
          { id: "a", text: "Renaming hundreds of files every week according to a fixed rule" },
          { id: "b", text: "Deciding the company's strategy" },
          { id: "c", text: "A task done once, in a different way each time" },
          { id: "d", text: "Comforting an upset customer" },
        ],
        correct: "a",
        explanation: "Repetitive, rule-based and frequent: if it fits a checklist, a script can do it.",
        whyWrong: {
          b: "Judgement-heavy work is not rule-based.",
          c: "One-off, changing tasks cost more to automate than to do.",
          d: "That needs a person.",
        },
      },
      {
        id: "ppq82-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-automating",
        prompt: "What does a dry-run mode do in an automation script?",
        options: [
          { id: "a", text: "Reports what it would do without changing anything" },
          { id: "b", text: "Runs faster by skipping checks" },
          { id: "c", text: "Deletes temporary files" },
          { id: "d", text: "Runs the script twice" },
        ],
        correct: "a",
        explanation: "It lets you review the plan before any file is touched.",
        whyWrong: {
          b: "It still does every check; it just does not act.",
          c: "It changes nothing at all.",
          d: "It runs once, without side effects.",
        },
      },
      {
        id: "ppq82-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-batch-files",
        prompt: "Which call moves (or renames) a file?",
        options: [
          { id: "a", text: "shutil.move(src, dest)" },
          { id: "b", text: "shutil.rmtree(src)" },
          { id: "c", text: "Path(src).read_text()" },
          { id: "d", text: "os.getcwd()" },
        ],
        correct: "a",
        explanation: "shutil.move moves a file or folder, and renames it if the destination name differs.",
        whyWrong: {
          b: "rmtree deletes a whole folder tree.",
          c: "read_text only reads the content.",
          d: "getcwd reports the current directory.",
        },
      },
      {
        id: "ppq82-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-batch-files",
        prompt: "An organiser moves files into folders. documents/report.pdf already exists and another report.pdf is about to be moved there. What should a safe script do?",
        options: [
          { id: "a", text: "Skip it (or rename it) and report the clash, never overwriting the existing file" },
          { id: "b", text: "Overwrite the existing file" },
          { id: "c", text: "Delete both files" },
          { id: "d", text: "Crash" },
        ],
        correct: "a",
        explanation: "Automation must never silently destroy data.",
        whyWrong: {
          b: "That loses the older file.",
          c: "That loses both.",
          d: "A clash is an expected case to handle.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l83-spreadsheets-reports": {
    lessonId: "pp-l83-spreadsheets-reports",
    passMark: 70,
    questions: [
      {
        id: "ppq83-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-spreadsheets",
        prompt: "Which library loads an Excel sheet into a table that can be grouped and summarised in a few lines?",
        options: [
          { id: "a", text: "pandas" },
          { id: "b", text: "math" },
          { id: "c", text: "random" },
          { id: "d", text: "argparse" },
        ],
        correct: "a",
        explanation: "pandas.read_excel gives a DataFrame with groupby, filtering and export built in.",
        whyWrong: {
          b: "math is for numeric functions.",
          c: "random generates random values.",
          d: "argparse reads command-line arguments.",
        },
      },
      {
        id: "ppq83-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-spreadsheets",
        prompt: "When cleaning data, why normalise each field BEFORE checking for duplicates?",
        options: [
          { id: "a", text: "So rows that differ only in spaces or capitals are recognised as the same" },
          { id: "b", text: "It makes the file smaller" },
          { id: "c", text: "Duplicates cannot be found otherwise at all" },
          { id: "d", text: "No reason" },
        ],
        correct: "a",
        explanation: "\" ada obi\" and \"Ada Obi\" are the same person; only after cleaning do they compare equal.",
        whyWrong: {
          b: "Size is a side effect, not the reason.",
          c: "Exact duplicates are found either way; near-duplicates are not.",
          d: "It is essential for correct de-duplication.",
        },
      },
      {
        id: "ppq83-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-reports-notifications",
        prompt: "Where should the password for sending automated emails come from?",
        options: [
          { id: "a", text: "An environment variable, such as MAIL_APP_PASSWORD" },
          { id: "b", text: "Written in the script" },
          { id: "c", text: "The email subject" },
          { id: "d", text: "A comment in the README" },
        ],
        correct: "a",
        explanation: "Secrets stay out of code and out of Git.",
        whyWrong: {
          b: "Anyone with the code would have the password.",
          c: "That would send it to every recipient.",
          d: "READMEs are public documentation.",
        },
      },
      {
        id: "ppq83-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-scheduling",
        prompt: "Who usually starts a scheduled Python job every Monday at 07:00?",
        options: [
          { id: "a", text: "The operating system's scheduler: cron on Linux/macOS, Task Scheduler on Windows" },
          { id: "b", text: "Python itself, automatically" },
          { id: "c", text: "The email server" },
          { id: "d", text: "Nobody; scripts cannot be scheduled" },
        ],
        correct: "a",
        explanation: "The OS (or a cloud scheduler) starts the script; the script just does its job.",
        whyWrong: {
          b: "Python does not run scripts on its own.",
          c: "Email servers deliver mail; they do not run your code.",
          d: "Scheduling scripts is routine.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l84-cli-tools": {
    lessonId: "pp-l84-cli-tools",
    passMark: 70,
    questions: [
      {
        id: "ppq84-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-argparse",
        prompt: "With parser.add_argument(\"--verbose\", action=\"store_true\"), what is args.verbose when the flag is NOT given?",
        options: [
          { id: "a", text: "False" },
          { id: "b", text: "True" },
          { id: "c", text: "None" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "store_true defaults to False and becomes True when the flag appears.",
        whyWrong: {
          b: "Only when --verbose is given.",
          c: "store_true defaults to False, not None.",
          d: "Optional flags may be left out.",
        },
      },
      {
        id: "ppq84-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-argparse",
        prompt: "What does argparse do if a required positional argument is missing?",
        options: [
          { id: "a", text: "Prints a usage message and an error, then exits" },
          { id: "b", text: "Uses None silently" },
          { id: "c", text: "Asks with input()" },
          { id: "d", text: "Crashes with a long traceback" },
        ],
        correct: "a",
        explanation: "argparse handles bad arguments for you with a clear, standard message.",
        whyWrong: {
          b: "Required arguments must be given.",
          c: "argparse never prompts.",
          d: "It exits cleanly with a usage message.",
        },
      },
      {
        id: "ppq84-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-config-layers",
        prompt: "Settings come from defaults, a config file, environment variables and command-line arguments. Which normally wins?",
        options: [
          { id: "a", text: "Command-line arguments" },
          { id: "b", text: "The defaults" },
          { id: "c", text: "The config file" },
          { id: "d", text: "Whichever was read first" },
        ],
        correct: "a",
        explanation: "Each layer overrides the one before; the CLI is the most specific, for this one run.",
        whyWrong: {
          b: "Defaults are the weakest, used only when nothing else is set.",
          c: "Environment variables and CLI arguments override it.",
          d: "Precedence is a fixed, deliberate order.",
        },
      },
      {
        id: "ppq84-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-distributable-cli",
        prompt: "Why should a CLI's main(argv=None) return an exit code instead of calling sys.exit inside?",
        options: [
          { id: "a", text: "Tests can call main([...]) and check the returned code without the test run exiting" },
          { id: "b", text: "Exit codes are not allowed" },
          { id: "c", text: "It makes the program faster" },
          { id: "d", text: "sys.exit does not exist" },
        ],
        correct: "a",
        explanation: "The __main__ guard does sys.exit(main()); everything else stays testable.",
        whyWrong: {
          b: "Exit codes are how shells and schedulers know a tool succeeded.",
          c: "Speed is unaffected.",
          d: "It exists; it is just best called in one place.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l85-deploy-portfolio": {
    lessonId: "pp-l85-deploy-portfolio",
    passMark: 70,
    questions: [
      {
        id: "ppq85-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-deployment",
        prompt: "Why pin exact versions in requirements.txt for deployment?",
        options: [
          { id: "a", text: "So the server installs exactly the versions you tested, avoiding surprise breakages" },
          { id: "b", text: "Pinning makes packages download faster" },
          { id: "c", text: "Servers only accept pinned files" },
          { id: "d", text: "It encrypts the dependencies" },
        ],
        correct: "a",
        explanation: "Unpinned dependencies drift to newer versions, which may change or remove features.",
        whyWrong: {
          b: "Download speed is not the point.",
          c: "Servers accept either; pinned is just safer.",
          d: "Pinning has nothing to do with encryption.",
        },
      },
      {
        id: "ppq85-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-app-security",
        prompt: "How should an application store users' passwords?",
        options: [
          { id: "a", text: "As a salted, slow hash such as PBKDF2, never as the password itself" },
          { id: "b", text: "As plain text in the database" },
          { id: "c", text: "Base64-encoded" },
          { id: "d", text: "In a JSON file next to the code" },
        ],
        correct: "a",
        explanation: "If the database leaks, salted slow hashes are extremely hard to reverse.",
        whyWrong: {
          b: "A leak would expose every password immediately.",
          c: "Base64 is encoding, trivially reversible, not security.",
          d: "That is still plain text.",
        },
      },
      {
        id: "ppq85-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-app-security",
        prompt: "A download endpoint opens Path(\"files\") / name, where name comes from the URL. A user requests ../../etc/passwd. What is the danger and the fix?",
        options: [
          { id: "a", text: "Path traversal escapes the folder; resolve the path and refuse it unless it stays inside the base folder" },
          { id: "b", text: "No danger; Path ignores ..", },
          { id: "c", text: "Rename the folder" },
          { id: "d", text: "Only allow downloads at night" },
        ],
        correct: "a",
        explanation: ".. moves up a folder. Resolving and checking is_relative_to(base) blocks any escape.",
        whyWrong: {
          b: "Path keeps .. and the operating system follows it.",
          c: "Any name can be escaped from with ..",
          d: "Time of day changes nothing.",
        },
      },
      {
        id: "ppq85-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-portfolio",
        prompt: "What makes a portfolio project most convincing to an employer?",
        options: [
          { id: "a", text: "It solves a real problem, runs from a clear README, has tests and an honest account of decisions and fixes" },
          { id: "b", text: "It has the most lines of code" },
          { id: "c", text: "It uses as many libraries as possible" },
          { id: "d", text: "It is described as perfect and bug-free" },
        ],
        correct: "a",
        explanation: "Employers look for working, maintainable software and evidence of how you think.",
        whyWrong: {
          b: "Size says nothing about quality.",
          c: "Unnecessary dependencies are a weakness.",
          d: "Honest reflection is more credible than claimed perfection.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
