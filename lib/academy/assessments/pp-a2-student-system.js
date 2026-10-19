/**
 * ASSESSMENTS · PYTHON PROGRAMMING · PHASE 2 ASSESSMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l43-sms-design": {
    lessonId: "pp-l43-sms-design",
    passMark: 70,
    questions: [
      {
        id: "ppq43-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a2-data-design",
        prompt: "Why is a dictionary of name → list of scores a good fit for the Student Management System?",
        options: [
          { id: "a", text: "Students are found by name instantly, names are unique keys, and each name stays with its scores" },
          { id: "b", text: "Dictionaries keep students in score order automatically" },
          { id: "c", text: "Dictionaries cannot be changed, which keeps records safe" },
          { id: "d", text: "Lists cannot store numbers" },
        ],
        correct: "a",
        explanation: "Lookup by key, unique keys and data kept together are exactly the system's needs.",
        whyWrong: {
          b: "Dictionaries keep insertion order, not score order.",
          c: "Dictionaries are mutable; that is what makes update and delete easy.",
          d: "Lists store numbers perfectly well; they are used for the scores.",
        },
      },
      {
        id: "ppq43-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a2-data-design",
        prompt: "students = {\"Ada\": [70, 80]}\nstudents[\"Ada\"].append(90)\nprint(students)\n\nWhat is printed?",
        options: [
          { id: "a", text: "{'Ada': [70, 80, 90]}" },
          { id: "b", text: "{'Ada': [70, 80], 'Ada': [90]}" },
          { id: "c", text: "{'Ada': 90}" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "students[\"Ada\"] is the list itself, so append adds a score to it in place.",
        whyWrong: {
          b: "A dictionary cannot hold the same key twice.",
          c: "append adds to the list; it does not replace it.",
          d: "Lists inside dictionaries can be changed.",
        },
      },
      {
        id: "ppq43-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a2-functions",
        prompt: "Why do the system's functions take students as a parameter instead of using a global variable?",
        options: [
          { id: "a", text: "Each function can be tested on its own with any test data, and its inputs are visible in its definition" },
          { id: "b", text: "Global variables are not allowed in Python" },
          { id: "c", text: "Parameters make the program run faster" },
          { id: "d", text: "It makes no difference" },
        ],
        correct: "a",
        explanation: "Passing data in makes functions predictable and testable: the checks in this project call them with their own dictionaries.",
        whyWrong: {
          b: "Globals are allowed, just harder to reason about.",
          c: "Speed is not the reason.",
          d: "It makes testing and understanding much easier.",
        },
      },
      {
        id: "ppq43-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-a2-menu",
        prompt: "What is the standard structure of a console menu program?",
        options: [
          { id: "a", text: "A while True loop that shows the menu, reads a choice, acts on it, and breaks on exit" },
          { id: "b", text: "One input() and one if statement" },
          { id: "c", text: "A for loop over range(6)" },
          { id: "d", text: "A recursive function with no base case" },
        ],
        correct: "a",
        explanation: "The menu must repeat an unknown number of times until the user exits: a while loop with break.",
        whyWrong: {
          b: "That handles one choice, then ends.",
          c: "The user, not a fixed count, decides how many times the menu appears.",
          d: "That would crash with RecursionError.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l44-sms-records": {
    lessonId: "pp-l44-sms-records",
    passMark: 70,
    questions: [
      {
        id: "ppq44-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a2-add-grade",
        prompt: "def average(scores):\n    return sum(scores) / len(scores)\n\nWhat happens with average([])?",
        options: [
          { id: "a", text: "Returns 0" },
          { id: "b", text: "ZeroDivisionError, because len([]) is 0" },
          { id: "c", text: "Returns None" },
          { id: "d", text: "Returns an empty list" },
        ],
        correct: "b",
        explanation: "sum([]) is 0 and len([]) is 0, and 0 / 0 raises ZeroDivisionError. Check for an empty list first.",
        whyWrong: {
          a: "Nothing makes it return 0 without an explicit check.",
          c: "The function crashes before returning.",
          d: "Division produces a number or an error, never a list.",
        },
      },
      {
        id: "ppq44-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a2-add-grade",
        prompt: "Why should add_student compare names in lower case?",
        options: [
          { id: "a", text: "So \"ada\" is recognised as a duplicate of \"Ada\"" },
          { id: "b", text: "Because dictionaries only allow lower-case keys" },
          { id: "c", text: "To save memory" },
          { id: "d", text: "It should not; names are case-sensitive" },
        ],
        correct: "a",
        explanation: "Without it, the same student could be added twice with different capitals.",
        whyWrong: {
          b: "Keys can contain any characters.",
          c: "It does not affect memory meaningfully.",
          d: "For people's names, Ada and ada are the same student.",
        },
      },
      {
        id: "ppq44-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a2-display-search",
        prompt: "print(\" \".join(str(s) for s in [70, 85]))\n\nWhat is printed?",
        options: [
          { id: "a", text: "70 85" },
          { id: "b", text: "[70, 85]" },
          { id: "c", text: "7085" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "Each score is converted to text, then joined with a space.",
        whyWrong: {
          b: "join produces a plain string, not the list's representation.",
          c: "The separator is a space.",
          d: "Converting with str() first makes join work.",
        },
      },
      {
        id: "ppq44-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a2-display-search",
        prompt: "Why does find_student return the stored name rather than True or False?",
        options: [
          { id: "a", text: "The caller needs the exact stored key (for example \"Ada\") to read, update or delete the record" },
          { id: "b", text: "Functions cannot return bools" },
          { id: "c", text: "To print it" },
          { id: "d", text: "There is no reason" },
        ],
        correct: "a",
        explanation: "The user may type \" ada\", but the dictionary key is \"Ada\"; returning it lets the caller use students[stored].",
        whyWrong: {
          b: "Functions return bools all the time.",
          c: "Returning and printing are different jobs.",
          d: "Without the stored key, the record cannot be used.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l45-sms-complete": {
    lessonId: "pp-l45-sms-complete",
    passMark: 70,
    questions: [
      {
        id: "ppq45-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a2-update-top",
        prompt: "s = {\"A\": [60], \"B\": [90, 70]}\nprint(max(s, key=lambda n: sum(s[n]) / len(s[n])))\n\nWhat is printed?",
        options: [
          { id: "a", text: "B" },
          { id: "b", text: "A" },
          { id: "c", text: "80.0" },
          { id: "d", text: "[90, 70]" },
        ],
        correct: "a",
        explanation: "B's average is 80, A's is 60. max returns the KEY with the largest average.",
        whyWrong: {
          b: "A's average is lower.",
          c: "max returns the key, not the average.",
          d: "max over a dictionary returns a key.",
        },
      },
      {
        id: "ppq45-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a2-update-top",
        prompt: "What should delete_student do when the name is not found?",
        options: [
          { id: "a", text: "Return False so the menu can print Not found" },
          { id: "b", text: "Let del raise KeyError and crash the program" },
          { id: "c", text: "Delete a random student" },
          { id: "d", text: "Add the student instead" },
        ],
        correct: "a",
        explanation: "Reporting failure lets the program stay running and tell the user clearly.",
        whyWrong: {
          b: "A user typo should never crash the system.",
          c: "That would destroy data.",
          d: "Doing something different from what was asked is a bug.",
        },
      },
      {
        id: "ppq45-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a2-complete",
        prompt: "print([int(x) for x in \"70 85 90\".split()])\n\nWhat is printed?",
        options: [
          { id: "a", text: "[70, 85, 90]" },
          { id: "b", text: "['70', '85', '90']" },
          { id: "c", text: "[708590]" },
          { id: "d", text: "245" },
        ],
        correct: "a",
        explanation: "split() gives three strings and int() converts each one, producing a list of ints.",
        whyWrong: {
          b: "int() converts each piece to a number.",
          c: "split() separates at spaces first.",
          d: "Nothing is added up.",
        },
      },
      {
        id: "ppq45-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-a2-complete",
        prompt: "In the finished system, what happens if the user types abc when asked for scores?",
        options: [
          { id: "a", text: "int(\"abc\") raises ValueError and the program crashes; Module 12 shows how to catch it" },
          { id: "b", text: "The score is saved as 0" },
          { id: "c", text: "Python asks again automatically" },
          { id: "d", text: "The score is saved as the text abc" },
        ],
        correct: "a",
        explanation: "Nothing in the program handles bad input yet. Hardening it with try/except is the practice project in Module 12.",
        whyWrong: {
          b: "Python never silently converts bad text to 0.",
          c: "Python does not retry input by itself.",
          d: "int() fails before anything is saved.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
