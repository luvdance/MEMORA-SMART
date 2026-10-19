/**
 * PYTHON PROGRAMMING · PHASE 2 ASSESSMENT · STUDENT MANAGEMENT SYSTEM
 *
 * Curriculum P2.1 – P2.5. A menu-driven console application built from
 * functions, conditions, loops and data structures. Each stage is a set of
 * functions checked by calling them directly, and the last stage is the full
 * program, driven through its menu with scripted input. Build challenges set
 * `revealSolution: false`: this is assessed work.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s-a2-student-system";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · P2.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l43-sms-design",
    moduleId: "pp-a2-student-system",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P2.1"],
    title: "Designing the Student Management System",
    subtitle: "The data structure, the functions, and the menu loop",
    estimatedMinutes: 22,
    intro:
      "Your Phase 2 project is a console application that adds students and their scores, calculates averages and grades, displays, searches, updates and deletes records, and finds the top student. Before writing it, decide how the data is stored and how the program is organised. Those two decisions shape every line that follows.",

    atoms: [
      {
        id: "a-pp-a2-data-design",
        title: "Choosing the data structure",
        explain:
          "Each student has a name and a list of scores. The program must find a student by name quickly, and names must be unique. A dictionary that maps each name to its list of scores fits exactly: students = {\"Ada\": [70, 80, 90]}. Lookups, additions, updates and deletions are each one line.",
        code: {
          language: PY,
          code: 'students = {"Ada": [70, 80, 90], "Bayo": [45, 52, 61]}\nstudents["Chi"] = [88, 92, 79]\nstudents["Bayo"] = [50, 55, 60]\ndel students["Ada"]\nprint(students)\n',
          expectedOutput: "{'Bayo': [50, 55, 60], 'Chi': [88, 92, 79]}",
        },
        decision: {
          scenario: "A teammate suggests storing students as two separate lists, names = [...] and scores = [...], kept in the same order.",
          question: "What is the main risk compared with one dictionary?",
          options: [
            {
              id: "a",
              text: "Deleting or sorting one list without the other silently pairs names with the wrong scores",
              why: "Parallel lists depend on staying in step. One missed update and every record after it is wrong. A dictionary keeps each name and its scores together.",
            },
            {
              id: "b",
              text: "Lists cannot hold names",
              whyWrong: "They can; the problem is keeping two of them synchronised.",
            },
            {
              id: "c",
              text: "There is no risk; it is equivalent",
              whyWrong: "It is equivalent only while every change is made to both lists perfectly, forever.",
            },
            {
              id: "d",
              text: "Dictionaries are slower than lists for finding a name",
              whyWrong: "The opposite: finding a key in a dictionary is effectively instant, while searching a list checks every item.",
            },
          ],
          correct: "a",
          aftermath: "Keep data that belongs together, together. It is the most important design rule in this project.",
        },
      },
      {
        id: "a-pp-a2-functions",
        title: "Planning the functions",
        explain:
          "Decompose the requirements into small functions, each with one job, taking the students dictionary as a parameter rather than using a global. The menu code then just reads input and calls them. Write the list before writing any code.",
        table: {
          caption: "The functions you will build, and what each returns.",
          headers: ["Function", "Job", "Returns"],
          rows: [
            ["average(scores)", "Mean of a list of scores", "float (0.0 for an empty list)"],
            ["grade(avg)", "Letter grade from an average", "\"A\" to \"F\""],
            ["add_student(students, name, scores)", "Add a new student", "True, or False if the name exists"],
            ["format_record(name, scores)", "One display line", "str"],
            ["find_student(students, name)", "Case-insensitive search", "The stored name, or None"],
            ["update_scores / delete_student", "Change or remove a record", "True, or False if not found"],
            ["top_student(students)", "Highest average", "(name, average) or None"],
          ],
        },
      },
      {
        id: "a-pp-a2-menu",
        title: "Stage 1: the menu loop",
        explain:
          "A menu program is a while True loop: show the options, read a choice, act on it, and break when the user chooses to exit. Build the loop first with placeholder actions, and check that every option is recognised and that exit really exits.",
        codeChallenge: {
          task: "Stage 1. Write the menu loop. Each time round, print MENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit (exactly that line) then read Choice: . For 1–6 print You chose N for now. For 0 print Goodbye and stop. For anything else print Invalid choice.",
          starter: "# Stage 1: the menu loop\n",
          sample: "MENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit\nChoice: 3\nYou chose 3\nMENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit\nChoice: 9\nInvalid choice\nMENU: ...\nChoice: 0\nGoodbye",
          tests: [
            {
              inputs: ["3", "9", "6", "0"],
              check:
                'menu = "MENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit"\n' +
                'assert lines.count(menu) == 4, "Print the menu line exactly, once per choice. Found it " + str(lines.count(menu)) + " times."\n' +
                'assert "You chose 3" in lines and "You chose 6" in lines, "Options 1–6 should print You chose N."\n' +
                'assert "Invalid choice" in lines, "9 should print Invalid choice."\n' +
                'assert lines[-1] == "Goodbye", "0 should print Goodbye and stop. Your last line: " + lines[-1]',
            },
          ],
          solution: 'MENU = "MENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit"\nwhile True:\n    print(MENU)\n    choice = input("Choice: ").strip()\n    if choice == "0":\n        print("Goodbye")\n        break\n    elif choice in ("1", "2", "3", "4", "5", "6"):\n        print("You chose", choice)\n    else:\n        print("Invalid choice")\n',
          revealSolution: false,
          hint: "while True: print the menu, read the choice, then if/elif/else. break after printing Goodbye.",
          successMessage: "The skeleton works: every option is recognised and exit really exits. Now give the options something to do.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · P2.2 – P2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l44-sms-records",
    moduleId: "pp-a2-student-system",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P2.2", "P2.3"],
    title: "Adding, Grading, Displaying and Searching",
    subtitle: "The core functions, each tested on its own",
    estimatedMinutes: 25,
    intro:
      "Stage 2 builds the functions that create and present records. Each is checked by calling it directly with test data, the way professional code is tested, before any of it is connected to the menu.",

    atoms: [
      {
        id: "a-pp-a2-add-grade",
        title: "Stage 2: average, grade and add_student",
        explain:
          "average must cope with an empty list without dividing by zero. grade uses the scale from Module 5. add_student must refuse a name that already exists, ignoring capitals, so \"ada\" cannot be added when \"Ada\" is there.",
        codeChallenge: {
          task: "Write average(scores) (0.0 for an empty list), grade(avg) (A 70+, B 60+, C 50+, D 45+, E 40+, else F) and add_student(students, name, scores) which adds the name (stripped of spaces) with its scores and returns True, or returns False and changes nothing if a student with the same name in any capitalisation exists.",
          starter: "def average(scores):\n    pass\n\ndef grade(avg):\n    pass\n\ndef add_student(students, name, scores):\n    pass\n",
          sample: "average([70, 80, 90]) → 80.0\ngrade(64.5) → B\nadd_student(students, \"Ada\", [70]) → True",
          tests: [
            {
              check:
                'assert average([70, 80, 90]) == 80.0 and average([]) == 0.0, "average([70, 80, 90]) is 80.0 and average([]) is 0.0."\n' +
                'for avg, g in [(70, "A"), (69.9, "B"), (60, "B"), (50, "C"), (45, "D"), (40, "E"), (39.9, "F")]:\n' +
                '    assert grade(avg) == g, f"grade({avg}) should be {g}, got {grade(avg)!r}"\n' +
                's = {}\n' +
                'assert add_student(s, " Ada ", [70, 80]) is True and s == {"Ada": [70, 80]}, "Adding Ada should store {\'Ada\': [70, 80]} and return True. Got " + repr(s)\n' +
                'assert add_student(s, "ada", [10]) is False and s == {"Ada": [70, 80]}, "Adding ada again must return False and change nothing."',
            },
          ],
          solution: 'def average(scores):\n    if not scores:\n        return 0.0\n    return sum(scores) / len(scores)\n\ndef grade(avg):\n    if avg >= 70:\n        return "A"\n    if avg >= 60:\n        return "B"\n    if avg >= 50:\n        return "C"\n    if avg >= 45:\n        return "D"\n    if avg >= 40:\n        return "E"\n    return "F"\n\ndef add_student(students, name, scores):\n    name = name.strip()\n    if any(existing.lower() == name.lower() for existing in students):\n        return False\n    students[name] = scores\n    return True\n',
          revealSolution: false,
          hint: "For add_student, check any(existing.lower() == name.lower() for existing in students) before adding.",
          successMessage: "Three functions, every boundary checked, and duplicate names refused regardless of capitals.",
        },
      },
      {
        id: "a-pp-a2-display-search",
        title: "Stage 3: format_record and find_student",
        explain:
          "Display is one formatted line per student, so the whole table is a loop over sorted names calling format_record. Search must be forgiving: a user typing \" ada\" should find \"Ada\". find_student returns the name AS STORED, so the caller can use it as a key.",
        codeChallenge: {
          task: "Copy in your Stage 2 functions, then add format_record(name, scores) returning a line like Ada        | 70 80 90 | avg 80.0 | A (name left-aligned in 10, scores separated by spaces, average to 1 decimal place, grade) and find_student(students, name) returning the stored name that matches ignoring case and surrounding spaces, or None.",
          starter: "# Paste average, grade and add_student here, then:\n\ndef format_record(name, scores):\n    pass\n\ndef find_student(students, name):\n    pass\n",
          sample: "format_record(\"Ada\", [70, 80, 90]) → 'Ada        | 70 80 90 | avg 80.0 | A'",
          tests: [
            {
              check:
                'want = "Ada        | 70 80 90 | avg 80.0 | A"\n' +
                'assert format_record("Ada", [70, 80, 90]) == want, "Got " + repr(format_record("Ada", [70, 80, 90])) + ", expected " + repr(want)\n' +
                'assert format_record("Bo", [45, 50]) == "Bo         | 45 50 | avg 47.5 | D", "Got " + repr(format_record("Bo", [45, 50]))\n' +
                's = {"Ada": [70], "Chi": [88]}\n' +
                'assert find_student(s, " ada ") == "Ada", "find_student(s, \\" ada \\") should return Ada."\n' +
                'assert find_student(s, "Dan") is None, "An unknown name returns None."',
            },
          ],
          solution: 'def average(scores):\n    if not scores:\n        return 0.0\n    return sum(scores) / len(scores)\n\ndef grade(avg):\n    if avg >= 70:\n        return "A"\n    if avg >= 60:\n        return "B"\n    if avg >= 50:\n        return "C"\n    if avg >= 45:\n        return "D"\n    if avg >= 40:\n        return "E"\n    return "F"\n\ndef format_record(name, scores):\n    avg = average(scores)\n    marks = " ".join(str(s) for s in scores)\n    return f"{name:<10} | {marks} | avg {avg:.1f} | {grade(avg)}"\n\ndef find_student(students, name):\n    wanted = name.strip().lower()\n    for stored in students:\n        if stored.lower() == wanted:\n            return stored\n    return None\n',
          revealSolution: false,
          hint: "\" \".join(str(s) for s in scores) turns the scores into text. For the search, normalise the typed name once, then compare with each stored name lower-cased.",
          successMessage: "Records display consistently and search forgives the way people actually type. Two stages left.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · P2.4 – P2.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l45-sms-complete",
    moduleId: "pp-a2-student-system",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P2.4", "P2.5"],
    title: "Update, Delete, Top Student and the Finished System",
    subtitle: "The last functions, then everything connected to the menu",
    estimatedMinutes: 30,
    intro:
      "The final stage adds changing and removing records and finding the best student, then connects every function to the menu from Stage 1. The finished program is tested by driving it through its menu exactly as a user would.",

    atoms: [
      {
        id: "a-pp-a2-update-top",
        title: "Stage 4: update_scores, delete_student and top_student",
        explain:
          "update and delete must use find_student, so they work with any capitalisation, and must report failure instead of crashing when the student does not exist. top_student must handle an empty system by returning None, which the menu turns into a friendly message.",
        codeChallenge: {
          task: "With your earlier functions in place, add update_scores(students, name, scores) and delete_student(students, name), each returning True on success and False if the student is not found (both use find_student), and top_student(students) returning (name, average) for the highest average, or None when there are no students.",
          starter: "# Paste average, grade, find_student here, then:\n\ndef update_scores(students, name, scores):\n    pass\n\ndef delete_student(students, name):\n    pass\n\ndef top_student(students):\n    pass\n",
          sample: "top_student({\"Ada\": [70, 80], \"Chi\": [90, 86]}) → ('Chi', 88.0)",
          tests: [
            {
              check:
                's = {"Ada": [70, 80], "Chi": [90, 86]}\n' +
                'assert top_student(s) == ("Chi", 88.0), "top_student should return (\'Chi\', 88.0). Got " + repr(top_student(s))\n' +
                'assert top_student({}) is None, "No students: return None."\n' +
                'assert update_scores(s, "ada", [100, 100]) is True and s["Ada"] == [100, 100], "update_scores(s, \\"ada\\", ...) should update Ada."\n' +
                'assert update_scores(s, "Dan", [1]) is False, "Updating an unknown student returns False."\n' +
                'assert top_student(s) == ("Ada", 100.0), "After the update Ada is top."\n' +
                'assert delete_student(s, " CHI") is True and "Chi" not in s, "delete_student(s, \\" CHI\\") should remove Chi."\n' +
                'assert delete_student(s, "Chi") is False, "Deleting again returns False."',
            },
          ],
          solution: 'def average(scores):\n    if not scores:\n        return 0.0\n    return sum(scores) / len(scores)\n\ndef find_student(students, name):\n    wanted = name.strip().lower()\n    for stored in students:\n        if stored.lower() == wanted:\n            return stored\n    return None\n\ndef update_scores(students, name, scores):\n    stored = find_student(students, name)\n    if stored is None:\n        return False\n    students[stored] = scores\n    return True\n\ndef delete_student(students, name):\n    stored = find_student(students, name)\n    if stored is None:\n        return False\n    del students[stored]\n    return True\n\ndef top_student(students):\n    if not students:\n        return None\n    best = max(students, key=lambda n: average(students[n]))\n    return best, average(students[best])\n',
          revealSolution: false,
          hint: "Call find_student first; if it returns None, return False. For the top student, max(students, key=lambda n: average(students[n])).",
          successMessage: "Every operation reports failure cleanly and nothing crashes on missing data or an empty system.",
        },
      },
      {
        id: "a-pp-a2-complete",
        title: "Stage 5: the complete Student Management System",
        explain:
          "Connect the functions to the menu. Each option reads what it needs, calls one function, and prints a short result. Scores are typed on one line separated by spaces and turned into a list of ints with [int(x) for x in text.split()]. Display shows every student in alphabetical order, or No students when empty.",
        table: {
          caption: "What each option must print.",
          headers: ["Option", "Asks for", "Prints"],
          rows: [
            ["1 Add", "Name: then Scores: ", "Added NAME, or NAME already exists"],
            ["2 Display", "nothing", "format_record line per student, by name; or No students"],
            ["3 Search", "Name: ", "the student's format_record line, or Not found"],
            ["4 Update", "Name: then Scores: ", "Updated NAME, or Not found"],
            ["5 Delete", "Name: ", "Deleted NAME, or Not found"],
            ["6 Top", "nothing", "Top: NAME (AVG to 1 dp), or No students"],
            ["0 Exit", "nothing", "Goodbye"],
          ],
        },
        codeChallenge: {
          task: "Build the finished system: the Stage 1 menu (same menu line) with every option working as in the table above, using your functions. Use the name as typed for Added/Updated/Deleted messages when adding, and the stored name for update and delete.",
          starter: "# Your complete Student Management System\n",
          sample: "MENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit\nChoice: 1\nName: Ada\nScores: 70 80 90\nAdded Ada\n...\nChoice: 6\nTop: Ada (80.0)\n...\nChoice: 0\nGoodbye",
          tests: [
            {
              label: "add, duplicate, display, top",
              inputs: ["2", "6", "1", "Ada", "70 80 90", "1", "Chi", "90 86", "1", "ada", "50", "2", "6", "0"],
              check:
                'assert lines.count("No students") == 2, "Display and Top on an empty system should each print No students."\n' +
                'assert "Added Ada" in lines and "Added Chi" in lines, "Adding should print Added NAME."\n' +
                'assert "ada already exists" in lines, "A duplicate name should print NAME already exists (with the name as typed)."\n' +
                'i = max(k for k, l in enumerate(lines) if l == "Choice: 2")\n' +
                'assert lines[i + 1:i + 3] == ["Ada        | 70 80 90 | avg 80.0 | A", "Chi        | 90 86 | avg 88.0 | A"], "Display should list students alphabetically with format_record. Got " + repr(lines[i + 1:i + 3])\n' +
                'assert "Top: Chi (88.0)" in lines, "Top should print Top: Chi (88.0)."\n' +
                'assert lines[-1] == "Goodbye", "0 should end with Goodbye."',
            },
            {
              label: "search, update, delete",
              inputs: ["1", "Bo", "40 50", "3", " bo", "3", "Zed", "4", "BO", "60 70", "3", "bo", "5", "bo", "5", "bo", "2", "0"],
              check:
                'assert "Bo         | 40 50 | avg 45.0 | D" in lines, "Search should print the student\'s record."\n' +
                'assert lines.count("Not found") == 2, "Searching for Zed and deleting Bo a second time should each print Not found. Count: " + str(lines.count("Not found"))\n' +
                'assert "Updated Bo" in lines and "Bo         | 60 70 | avg 65.0 | B" in lines, "Update should print Updated Bo, and a later search should show the new scores."\n' +
                'assert "Deleted Bo" in lines, "Delete should print Deleted Bo."\n' +
                'assert lines[-4] == "No students" and lines[-1] == "Goodbye", "After deleting the only student, Display shows No students."',
            },
          ],
          solution: 'MENU = "MENU: 1 Add  2 Display  3 Search  4 Update  5 Delete  6 Top  0 Exit"\n\ndef average(scores):\n    if not scores:\n        return 0.0\n    return sum(scores) / len(scores)\n\ndef grade(avg):\n    if avg >= 70:\n        return "A"\n    if avg >= 60:\n        return "B"\n    if avg >= 50:\n        return "C"\n    if avg >= 45:\n        return "D"\n    if avg >= 40:\n        return "E"\n    return "F"\n\ndef find_student(students, name):\n    wanted = name.strip().lower()\n    for stored in students:\n        if stored.lower() == wanted:\n            return stored\n    return None\n\ndef add_student(students, name, scores):\n    name = name.strip()\n    if find_student(students, name) is not None:\n        return False\n    students[name] = scores\n    return True\n\ndef format_record(name, scores):\n    avg = average(scores)\n    marks = " ".join(str(s) for s in scores)\n    return f"{name:<10} | {marks} | avg {avg:.1f} | {grade(avg)}"\n\ndef top_student(students):\n    if not students:\n        return None\n    best = max(students, key=lambda n: average(students[n]))\n    return best, average(students[best])\n\ndef read_scores():\n    return [int(x) for x in input("Scores: ").split()]\n\nstudents = {}\nwhile True:\n    print(MENU)\n    choice = input("Choice: ").strip()\n    if choice == "0":\n        print("Goodbye")\n        break\n    elif choice == "1":\n        name = input("Name: ").strip()\n        scores = read_scores()\n        if add_student(students, name, scores):\n            print("Added", name)\n        else:\n            print(name, "already exists")\n    elif choice == "2":\n        if not students:\n            print("No students")\n        for name in sorted(students):\n            print(format_record(name, students[name]))\n    elif choice == "3":\n        stored = find_student(students, input("Name: "))\n        print(format_record(stored, students[stored]) if stored else "Not found")\n    elif choice == "4":\n        stored = find_student(students, input("Name: "))\n        if stored is None:\n            print("Not found")\n        else:\n            students[stored] = read_scores()\n            print("Updated", stored)\n    elif choice == "5":\n        stored = find_student(students, input("Name: "))\n        if stored is None:\n            print("Not found")\n        else:\n            del students[stored]\n            print("Deleted", stored)\n    elif choice == "6":\n        top = top_student(students)\n        print(f"Top: {top[0]} ({top[1]:.1f})" if top else "No students")\n    else:\n        print("Invalid choice")\n',
          revealSolution: false,
          hint: "Keep the functions at the top and the menu loop at the bottom. Test one option at a time with Run before pressing Check. Note that update asks for the name first and only asks for scores if the student exists.",
          successMessage: "Your Student Management System is complete and passes a full scripted session. That is the Phase 2 milestone: a real, menu-driven application built from functions, conditions, loops and data structures.",
        },
      },
    ],

    task: {
      title: "Phase 2 assessment: submit your Student Management System",
      intro: "Finish the project in VS Code as student_system.py. You will be assessed on correctness, structure and robustness.",
      prompts: [
        "All six operations work: add, display (with averages and grades), search, update, delete and top student.",
        "Every operation is a function with a docstring that takes the students dictionary as a parameter; there are no global variables except constants.",
        "Write a test plan: for each menu option, one normal case and one failure case (unknown name, duplicate name, empty system), with the expected output.",
        "Explain in a short paragraph why you chose a dictionary of lists, and what would change if each student also had a class and an age.",
        "Extension: add option 7, a class report that prints how many students got each grade.",
      ],
      closing: "Phase 2 complete. In Module 12 you will make this program refuse to crash on bad input, and in Module 11 it will save its data between runs.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
