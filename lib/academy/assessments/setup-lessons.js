/**
 * ASSESSMENTS · THE SETUP LESSONS
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Two lessons, one bank, because they are the same kind of lesson: how to get
 * the tool running before anyone teaches you to use it.
 *
 * These questions are deliberately practical. A setup lesson is not tested by
 * asking someone to recite a version number — it is tested by whether they
 * would know what to do when the thing does not work, which is the moment the
 * lesson exists for. So most items describe a failure and ask for the cause.
 *
 * Facts verified against official documentation on 18 September 2026; see the
 * lesson files for the sources and what was deliberately not claimed.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l90-excel-setup": {
    lessonId: "l90-excel-setup",
    passMark: 70,
    questions: [
      {
        id: "q90-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-xlsetup-three-ways",
        prompt:
          "You have no copy of Excel and cannot pay for a subscription. What is the right next step?",
        options: [
          { id: "a", text: "Use Excel for the web, which is free with a Microsoft account and covers everything in Months 1 and 2" },
          { id: "b", text: "Wait until you can afford Microsoft 365" },
          { id: "c", text: "Skip the Excel modules and start with Python" },
          { id: "d", text: "Use only the practice grid in these lessons and never open Excel" },
        ],
        correct: "a",
        explanation:
          "The free web version is a genuine Excel, not a trial. It handles formulas and pivot tables, which is all this course's Excel modules need.",
        whyWrong: {
          b: "There is nothing to wait for. The free version is available today.",
          c: "Power BI and Python both assume the Excel concepts. Skipping them makes the later modules harder, not faster.",
          d: "The grid teaches what formulas do, but part of the skill is knowing your way around the real application.",
        },
      },
      {
        id: "q90-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-xlsetup-web",
        prompt:
          "You are using Excel for the web and a lesson mentions Power Query. What does that mean for you?",
        options: [
          { id: "a", text: "Nothing is lost — Power Query is taught in Month 3 inside Power BI Desktop, which is free" },
          { id: "b", text: "You need to buy Excel desktop to continue the course" },
          { id: "c", text: "Power Query works the same in the web version" },
          { id: "d", text: "You should switch to Google Sheets" },
        ],
        correct: "a",
        explanation:
          "Power Query is a desktop feature, and this course teaches it in Power BI Desktop, which costs nothing. The free path carries you through the whole curriculum.",
        whyWrong: {
          b: "No purchase is required at any point in this course.",
          c: "It is a desktop feature. Expecting it in the web version leads to hunting for a menu that is not there.",
          d: "Sheets has no Power Query either, and switching tools mid-course costs you more than it saves.",
        },
      },
      {
        id: "q90-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-xlsetup-alternatives",
        prompt:
          'You copy =SUMIFS(C2:C11,B2:B11,"Lagos") from a lesson into LibreOffice Calc and it is rejected, with no obvious error in the formula. What is worth trying first?',
        options: [
          { id: "a", text: "Replacing the commas with semicolons, which some regional settings require" },
          { id: "b", text: "Rewriting it as several SUMIF formulas added together" },
          { id: "c", text: "Giving up on LibreOffice, since it does not support SUMIFS" },
          { id: "d", text: "Removing the quotation marks around Lagos" },
        ],
        correct: "a",
        explanation:
          "Argument separators depend on locale. The same formula with semicolons is usually accepted immediately, and it is the first thing to try when a correct-looking formula is refused.",
        whyWrong: {
          b: "SUMIFS is supported. Rewriting it hides the real cause and teaches you the wrong lesson.",
          c: "LibreOffice Calc has SUMIFS. The separator is the problem, not the function.",
          d: "The text criterion must be quoted. Removing them breaks a formula that was nearly right.",
        },
      },
      {
        id: "q90-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-xlsetup-simulator",
        prompt:
          "What is the practice grid in these lessons for, and what should you not expect from it?",
        options: [
          { id: "a", text: "It runs real formulas and checks your answer, but it does not do charts, macros or saving a file — so open real Excel alongside it" },
          { id: "b", text: "It is a full replacement for Excel" },
          { id: "c", text: "It only shows pictures of formulas, not working ones" },
          { id: "d", text: "It is for people who cannot afford Excel, and others should skip it" },
        ],
        correct: "a",
        explanation:
          "It exists to mark whether your formula returns the right number, which a video cannot do. Knowing where the buttons live is a separate skill that needs the real application.",
        whyWrong: {
          b: "It has no charts, no printing and no file to save. It is a teaching tool.",
          c: "The formulas genuinely calculate, including errors and the fill handle.",
          d: "It is the fastest way for anyone to check a formula, regardless of what else they have.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l89-python-setup": {
    lessonId: "l89-python-setup",
    passMark: 70,
    questions: [
      {
        id: "q89-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pysetup-install",
        prompt:
          'You installed Python on Windows from python.org. Typing `python --version` in Command Prompt returns "python is not recognised". What is almost certainly wrong?',
        options: [
          { id: "a", text: 'The "Add python.exe to PATH" box was not ticked during install — it is off by default' },
          { id: "b", text: "The installation failed and must be downloaded again" },
          { id: "c", text: "Python does not work on Windows without Anaconda" },
          { id: "d", text: "Command Prompt cannot run Python; you need a different terminal" },
        ],
        correct: "a",
        explanation:
          "PATH is the list of places Windows looks when you type a command. The installer leaves that option unticked, so Python installs correctly and the command still fails. Re-run the installer, choose Modify, and tick it — or use the `py` launcher, which works either way.",
        whyWrong: {
          b: "Nothing failed. The files are there; the shell does not know where to look.",
          c: "Anaconda is one convenient bundle, not a requirement, and it is a far larger download.",
          d: "Command Prompt is fine once PATH is set.",
        },
      },
      {
        id: "q89-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pysetup-three-ways",
        prompt:
          "You are on a shared laptop with little free disk space and you pay for mobile data by the megabyte. Which option should you start with?",
        options: [
          { id: "a", text: "Google Colab — it installs nothing and runs on Google's machines, so your laptop's specs stop mattering" },
          { id: "b", text: "Install Python and Anaconda so you have everything locally" },
          { id: "c", text: "Buy a better laptop before starting" },
          { id: "d", text: "Skip Python; it cannot be learned without a good machine" },
        ],
        correct: "a",
        explanation:
          "Colab needs a free Google account and a connection, and nothing else. The work happens on Google's hardware, which is exactly what you want when the local machine is the constraint.",
        whyWrong: {
          b: "Anaconda is the largest of the options and the worst fit for little disk and metered data.",
          c: "No purchase is needed. The free options are genuinely sufficient.",
          d: "A five-year-old laptop and a browser is enough to learn all of this.",
        },
      },
      {
        id: "q89-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pysetup-colab",
        prompt:
          "In a Colab notebook you run a cell that uses a DataFrame and get a NameError, even though the cell that creates it is visible further up the page. Why?",
        options: [
          { id: "a", text: "You have not run that cell in this session — a notebook remembers the order you RAN cells in, not the order they appear" },
          { id: "b", text: "Colab cannot use pandas" },
          { id: "c", text: "The notebook needs to be saved before variables work" },
          { id: "d", text: "Cells must be merged into one before they can share variables" },
        ],
        correct: "a",
        explanation:
          "A notebook is not a script. After a disconnect or a fresh open, your code and text are saved but the variables are gone — run the cells from the top. This causes more confusion for beginners than any syntax error.",
        whyWrong: {
          b: "pandas is pre-installed in Colab.",
          c: "Saving stores the notebook; it has nothing to do with which variables exist.",
          d: "Separate cells share variables perfectly well once they have been run.",
        },
      },
      {
        id: "q89-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pysetup-pandas",
        prompt:
          'You ran `pip install pandas` and it reported success, but `import pandas` still raises "ModuleNotFoundError". What is the likely cause and the fix?',
        options: [
          { id: "a", text: "pip installed into a different Python than the one you are running — use `py -m pip install pandas`, which installs into the Python you invoked" },
          { id: "b", text: "pandas must be installed twice for it to register" },
          { id: "c", text: "The package name is wrong; it should be `pip install Pandas`" },
          { id: "d", text: "You need to restart the computer" },
        ],
        correct: "a",
        explanation:
          "With more than one Python on the machine, a bare `pip` can belong to a different one. The `py -m pip` form ties the install to the interpreter you are actually using, which removes the ambiguity.",
        whyWrong: {
          b: "Installing twice changes nothing; the package was already installed, just elsewhere.",
          c: "Package names are not case sensitive to pip, and `pandas` is correct.",
          d: "A restart does not move a package between Python installations.",
        },
      },
      {
        id: "q89-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pysetup-pandas",
        prompt:
          "Which statement correctly describes pip?",
        options: [
          { id: "a", text: "It is the installer for libraries, ships with Python, and fetches things like pandas that Python does not include" },
          { id: "b", text: "It is a separate language you use alongside Python" },
          { id: "c", text: "It is a notebook where you write Python" },
          { id: "d", text: "It is Python's name on Windows" },
        ],
        correct: "a",
        explanation:
          "Python on its own cannot read a spreadsheet; pandas does that, and pip is how you get pandas. Knowing pip is a separate tool explains why a fresh install cannot import pandas yet.",
        whyWrong: {
          b: "pip is a tool, not a language.",
          c: "A notebook is Colab or Jupyter. pip installs packages.",
          d: "On Windows the launcher is `py`; pip is the package installer.",
        },
      },
    ],
  },
};
