/**
 * LESSON · SETTING PYTHON UP (l89-python-setup)
 * First lesson of m4-python-foundations, before any teaching.
 *
 * WHY THIS EXISTS AND WHY IT IS FIRST
 * The module used to open with "What Programming Actually Is" and never told
 * anyone how to get Python onto their machine. A learner who cannot run a
 * single line has nowhere to put what the next seven lessons teach, and the
 * most common way someone abandons a programming course is not finding it too
 * hard — it is never getting the thing to start.
 *
 * Every module whose tool needs installing now opens with its setup lesson.
 *
 * THIS AUDIENCE, SPECIFICALLY
 * Many of these learners are on a shared or low-spec Windows laptop, paying
 * for mobile data by the megabyte. So the order is deliberate: practise in
 * the browser first (nothing to install), Colab second (nothing to install,
 * needs a connection), local install last (a real download, but works offline
 * afterwards). Nobody is told to download 100 MB before they know whether
 * they like programming.
 *
 * ── FACT VERIFICATION ────────────────────────────────────────────────────
 * Checked against the official documentation on 18 September 2026, not
 * recalled:
 *
 *   · Current stable release is Python 3.14.7, released 5 August 2026
 *     (python.org/downloads)
 *   · The Windows installer's PATH options (PrependPath / AppendPath) are
 *     BOTH DISABLED BY DEFAULT — docs.python.org/3/using/windows.html. This
 *     is the single most common reason "python" is not recognised afterwards,
 *     which is why it gets its own warning here.
 *   · The `py` launcher is installed automatically on Windows; `py --list`
 *     shows every installed version.
 *
 * Version numbers age. The lesson deliberately tells the learner to take
 * whatever python.org offers rather than hunting a specific number, so it
 * stays correct as releases move on.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s14-python-foundations";

export const LESSONS = [
  {
    id: "l89-python-setup",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 1,
    title: "Setting Python Up",
    subtitle: "Three ways to run it, cheapest first",
    estimatedMinutes: 16,
    intro:
      "Before anything else: you need somewhere to run Python. There are three options and they cost very different amounts of data and disk. Start with the free one — you can always install properly later, once you know you want to.",

    atoms: [
      {
        id: "a-pysetup-three-ways",
        title: "You have three options, and you do not need all of them",
        explain:
          "Python can run inside this page, in a free notebook in the cloud, or installed on your own machine. All three run the same language. They differ in what they cost you to start and what they give you later.",
        why: "Most courses open by telling you to download an installer. If your laptop is shared, low on disk, or you are paying for data by the megabyte, that is a bad first instruction — and it is the point where people quit before they have written a line.",
        table: {
          caption: "Pick one to start. You are not choosing forever.",
          headers: ["Where", "To start", "Needs a connection", "Good for"],
          rows: [
            ["Right here in the lesson", "Nothing — press Run", "Yes, first run downloads the runtime", "Learning the language now, at no cost"],
            ["Google Colab", "A free Google account", "Yes, always", "Real notebooks, bigger files, sharing your work"],
            ["Installed on your machine", "A download of roughly 30 MB", "Only to install and add packages", "Working offline, and real projects"],
          ],
          note: "Every code example in this module runs in all three. Nothing later in the course depends on which you chose.",
        },
        mistake:
          "Installing three things at once because a tutorial mentioned them — Python, then Anaconda, then VS Code — and ending up with several versions and no idea which one is running. Set up ONE, get it working, and add to it only when something you actually need is missing.",
      },
      {
        id: "a-pysetup-in-lesson",
        title: "Option 1 — run it in this page",
        explain:
          "Code examples in this course have a Run button. Pressing it downloads a Python runtime into your browser once and then runs your code on your own device — nothing is sent to a server, and it keeps working for the rest of the session.",
        why: "This exists so you can start now. It is also the honest option to put first, because it costs nothing but the one download and it needs no account.",
        table: {
          caption: "What to expect the first time you press Run.",
          headers: ["", "What happens"],
          rows: [
            ["The first run", "Several megabytes download. On a slow link this can take a minute or two."],
            ["Adding pandas", "A few more megabytes, once, the first time an example needs it."],
            ["Every run after", "Instant — it is already in the page."],
            ["Leaving the page", "The download is cached by your browser; a new tab may fetch it again."],
          ],
          note: "The exact size is shown on the button before you press it, so the choice is always yours. On metered data, use Colab instead — it downloads nothing.",
        },
      },
      {
        id: "a-pysetup-colab",
        title: "Option 2 — Google Colab, for real notebooks",
        explain:
          "Colab is a free Python notebook that runs on Google's machines. You need a Google account and a connection; you need no install and no disk space. pandas, NumPy and matplotlib are already there.",
        why: "This is what most working analysts reach for when they want to try something quickly, and it is the closest free thing to the environment a data job will hand you. It also means a five-year-old laptop is not a barrier — the work happens on Google's hardware, not yours.",
        example: `Getting started, once:

  1. Go to  colab.research.google.com
  2. Sign in with a Google account
  3. File  ->  New notebook
  4. Click the empty cell, type:   print("it works")
  5. Press Shift + Enter to run it

Your notebooks save to your Google Drive automatically.
To use one of this course's examples, paste it into a cell and run it.`,
        table: {
          caption: "Two things about Colab that surprise people.",
          headers: ["Behaviour", "What it means for you"],
          rows: [
            ["A notebook disconnects after a period of inactivity", "Your code and text are saved; the variables are not. Re-run the cells from the top."],
            ["Cells run in whatever order you click them", "A cell that uses a variable fails if you have not run the cell that created it. Run top to bottom when in doubt."],
          ],
          note: "That second one causes more confusion than any syntax error. A notebook is not a script: the order you RAN things in is what matters, not the order they appear on screen.",
        },
      },
      {
        id: "a-pysetup-install",
        title: "Option 3 — install Python, and the one checkbox that matters",
        explain:
          "Download the installer from python.org, run it, and tick the box that adds Python to your PATH. That box is OFF by default, and leaving it off is the single most common reason Python appears not to work afterwards.",
        why: "PATH is the list of places your computer looks when you type a command. If Python is not on it, typing `python` gets you \"not recognised\" even though Python is installed perfectly well — and the error says nothing about the real cause. Thousands of people conclude the install failed and give up here.",
        example: `WINDOWS

  1. Go to  python.org/downloads  and take the version it offers you
  2. Run the installer
  3. ON THE FIRST SCREEN, tick:  Add python.exe to PATH
     (it is at the bottom and it is NOT ticked for you)
  4. Click Install Now
  5. Open Command Prompt and check:

         python --version

     You should see a version number. If you see
     "python is not recognised", PATH was not set - re-run the
     installer, choose Modify, and tick the box.

  Windows also installs a launcher called py:

         py --version      one version installed
         py --list         every version you have

MAC

  1. Go to  python.org/downloads  and take the macOS installer
  2. Run it, then check in Terminal:

         python3 --version

     On a Mac, use python3 and pip3 - plain "python" may point at
     an old system Python that you should leave alone.`,
        code: {
          code: "import sys\n\nprint(sys.version_info.major)\nprint(sys.version_info >= (3, 9))\n",
          expectedOutput: "3\nTrue",
          runnable: true,
          packages: [],
        },
        mistake:
          "Downloading Python from somewhere other than python.org. Search results are full of repackaged installers carrying things you did not ask for. The address is python.org and nothing else is needed.",
      },
      {
        id: "a-pysetup-pandas",
        title: "Installing pandas, if you installed Python",
        explain:
          "Python on its own cannot read a spreadsheet. pandas is the library that does the data work, and pip is the tool that fetches it. One command each, and you only need this if you chose option 3.",
        why: "This is where the phrase \"pip install\" that you will see in every tutorial actually comes from, and knowing that pip is separate from Python explains why a fresh install cannot import pandas yet.",
        example: `WINDOWS                        MAC

  pip install pandas             pip3 install pandas
  pip install matplotlib         pip3 install matplotlib

If pip is not recognised on Windows, use the launcher instead:

  py -m pip install pandas

Then check it worked, in Python:

  import pandas as pd
  print(pd.__version__)

A version number means you are ready. "ModuleNotFoundError:
No module named 'pandas'" means pip installed it for a DIFFERENT
Python than the one you are running - the py -m pip form above
avoids that, because it installs into the Python you invoked.`,
        code: {
          code: 'import pandas as pd\n\nframe = pd.DataFrame({"state": ["Lagos", "Abuja"], "amount": [45000, 62000]})\nprint(type(frame).__name__)\nprint(len(frame))\n',
          expectedOutput: "DataFrame\n2",
          runnable: true,
          packages: ["pandas"],
        },
        table: {
          caption: "What each piece is, since the names are used loosely everywhere.",
          headers: ["Name", "What it actually is"],
          rows: [
            ["Python", "The language, and the program that runs it"],
            ["pip", "The installer for libraries, shipped with Python"],
            ["pandas", "A library for tables of data — the analyst's tool"],
            ["Colab / Jupyter", "A notebook: somewhere to write and run code in pieces"],
            ["Anaconda", "A bundle of Python plus many libraries. Convenient, and a much larger download — you do not need it for this course."],
          ],
          note: "You have now met every name this module will use. If a tutorial elsewhere assumes one of these and you are unsure which, come back to this table.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
