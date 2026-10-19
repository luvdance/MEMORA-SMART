/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 8
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l31-index-slice": {
    lessonId: "pp-l31-index-slice",
    passMark: 70,
    questions: [
      {
        id: "ppq31-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-string-immutable",
        prompt: "name = \"ada\"\nname.upper()\nprint(name)\n\nWhat is printed?",
        options: [
          { id: "a", text: "ADA" },
          { id: "b", text: "ada" },
          { id: "c", text: "Ada" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "Strings are immutable. upper() returned a new string, which was thrown away because it was not stored.",
        whyWrong: {
          a: "That needs name = name.upper().",
          c: "upper() makes every letter a capital, and its result was discarded anyway.",
          d: "Calling a method and ignoring its result is allowed.",
        },
      },
      {
        id: "ppq31-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-indexing",
        prompt: "word = \"BINARY\"\nprint(word[1], word[-1])\n\nWhat is printed?",
        options: [
          { id: "a", text: "B Y" },
          { id: "b", text: "I Y" },
          { id: "c", text: "I R" },
          { id: "d", text: "B R" },
        ],
        correct: "b",
        explanation: "Index 1 is the second character, I. Index -1 is the last, Y.",
        whyWrong: {
          a: "Indexes start at 0, so [1] is the second character.",
          c: "[-1] is the very last character.",
          d: "Both are off by one position.",
        },
      },
      {
        id: "ppq31-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-slicing",
        prompt: "s = \"MEMORA\"\nprint(s[1:4])\n\nWhat is printed?",
        options: [
          { id: "a", text: "EMO" },
          { id: "b", text: "EMOR" },
          { id: "c", text: "MEM" },
          { id: "d", text: "MEMO" },
        ],
        correct: "a",
        explanation: "From index 1 up to but not including 4: indexes 1, 2, 3, which are E, M, O.",
        whyWrong: {
          b: "The stop index, 4, is not included.",
          c: "That is s[0:3].",
          d: "That is s[0:4].",
        },
      },
      {
        id: "ppq31-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-slicing",
        prompt: "Which expression reverses the string t?",
        options: [
          { id: "a", text: "t[-1]" },
          { id: "b", text: "t[::-1]" },
          { id: "c", text: "t.reverse()" },
          { id: "d", text: "t[0:-1]" },
        ],
        correct: "b",
        explanation: "A step of -1 walks the string backwards from end to start.",
        whyWrong: {
          a: "That is only the last character.",
          c: "Strings have no reverse() method (lists do).",
          d: "That drops the last character; it does not reverse.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l32-string-methods": {
    lessonId: "pp-l32-string-methods",
    passMark: 70,
    questions: [
      {
        id: "ppq32-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-string-methods",
        prompt: "print(\"a,b,,c\".split(\",\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "['a', 'b', 'c']" },
          { id: "b", text: "['a', 'b', '', 'c']" },
          { id: "c", text: "['a,b,,c']" },
          { id: "d", text: "abc" },
        ],
        correct: "b",
        explanation: "Splitting at every comma: between the two commas there is an empty string.",
        whyWrong: {
          a: "split(\",\") keeps the empty piece between two commas.",
          c: "There are commas to split at.",
          d: "split returns a list.",
        },
      },
      {
        id: "ppq32-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-string-methods",
        prompt: "print(\"-\".join([\"2026\", \"10\", \"18\"]))\n\nWhat is printed?",
        options: [
          { id: "a", text: "2026-10-18" },
          { id: "b", text: "-2026-10-18-" },
          { id: "c", text: "20261018" },
          { id: "d", text: "['2026', '10', '18']" },
        ],
        correct: "a",
        explanation: "join puts the separator between the items, not at the ends.",
        whyWrong: {
          b: "No separator is added at the start or end.",
          c: "The separator \"-\" goes between the items.",
          d: "join returns a single string.",
        },
      },
      {
        id: "ppq32-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-case-whitespace",
        prompt: "print(\"  python course \".strip().title())\n\nWhat is printed?",
        options: [
          { id: "a", text: "Python course" },
          { id: "b", text: "Python Course" },
          { id: "c", text: "  Python Course " },
          { id: "d", text: "PYTHON COURSE" },
        ],
        correct: "b",
        explanation: "strip() removes the outer spaces; title() capitalises the first letter of every word.",
        whyWrong: {
          a: "That would be capitalize(), which only capitalises the first word.",
          c: "strip() removed the outer spaces first.",
          d: "That would be upper().",
        },
      },
      {
        id: "ppq32-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-find-replace",
        prompt: "print(\"banana\".find(\"n\"), \"banana\".find(\"x\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "2 -1" },
          { id: "b", text: "3 0" },
          { id: "c", text: "2 None" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "The first n is at index 2. find() returns -1 when the text is not found.",
        whyWrong: {
          b: "Indexes start at 0, and not-found is -1, not 0.",
          c: "find() returns -1, not None.",
          d: "find() never raises for a missing substring (index() does).",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l33-fstrings-counting": {
    lessonId: "pp-l33-fstrings-counting",
    passMark: 70,
    questions: [
      {
        id: "ppq33-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-fstrings",
        prompt: "print(f\"{2500000:,}\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "2500000" },
          { id: "b", text: "2,500,000" },
          { id: "c", text: "2.500.000" },
          { id: "d", text: "2,500,000.00" },
        ],
        correct: "b",
        explanation: "The , format adds thousands separators.",
        whyWrong: {
          a: "The format adds separators.",
          c: "Python uses commas for this format.",
          d: "No decimals were requested; that needs ,.2f.",
        },
      },
      {
        id: "ppq33-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-fstrings",
        prompt: "print(f\"{7:03d}\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "007" },
          { id: "c", text: "700" },
          { id: "d", text: "7.000" },
        ],
        correct: "b",
        explanation: "03d pads the integer with zeros to a width of 3.",
        whyWrong: {
          a: "The format pads to three characters.",
          c: "Padding goes on the left.",
          d: "d is a whole-number format; there are no decimals.",
        },
      },
      {
        id: "ppq33-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-prefix-suffix",
        prompt: "print(\"notes.pdf.txt\".endswith(\".pdf\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
          { id: "c", text: ".txt" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "The string ends with .txt. endswith only looks at the end.",
        whyWrong: {
          a: ".pdf appears in the middle, not at the end.",
          c: "endswith returns a bool.",
          d: "endswith works on any string.",
        },
      },
      {
        id: "ppq33-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-char-frequency",
        prompt: "print(\"Mississippi\".count(\"ss\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "2" },
          { id: "c", text: "4" },
          { id: "d", text: "0" },
        ],
        correct: "b",
        explanation: "\"ss\" appears twice: Mi-ss-i-ss-ippi.",
        whyWrong: {
          a: "There are two separate ss pairs.",
          c: "That is the number of single s characters.",
          d: "ss is definitely there.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l34-normalise-regex": {
    lessonId: "pp-l34-normalise-regex",
    passMark: 70,
    questions: [
      {
        id: "ppq34-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-normalise",
        prompt: "print(\" \".join(\"  too   many    spaces \".split()))\n\nWhat is printed?",
        options: [
          { id: "a", text: "too many spaces" },
          { id: "b", text: "  too   many    spaces " },
          { id: "c", text: "toomanyspaces" },
          { id: "d", text: "['too', 'many', 'spaces']" },
        ],
        correct: "a",
        explanation: "split() breaks on any run of whitespace and ignores the ends; join puts single spaces back.",
        whyWrong: {
          b: "The split and join collapse the spaces.",
          c: "The separator is a single space, not nothing.",
          d: "join turns the list back into a string.",
        },
      },
      {
        id: "ppq34-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-normalise",
        prompt: "Why normalise text before saving or comparing it?",
        options: [
          { id: "a", text: "So different spellings of the same value, such as \" ADA \" and \"Ada\", are treated as the same" },
          { id: "b", text: "To make the program run faster" },
          { id: "c", text: "Python requires it" },
          { id: "d", text: "To encrypt it" },
        ],
        correct: "a",
        explanation: "People type inconsistently. Normalising gives one standard form, avoiding duplicates and failed matches.",
        whyWrong: {
          b: "The purpose is correctness, not speed.",
          c: "Python does not require it; correct programs do.",
          d: "Normalising is not encryption.",
        },
      },
      {
        id: "ppq34-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-regex",
        prompt: "Which pattern fully matches exactly four digits, such as 2026?",
        options: [
          { id: "a", text: "re.fullmatch(r\"\\d{4}\", text)" },
          { id: "b", text: "re.fullmatch(r\"d{4}\", text)" },
          { id: "c", text: "re.fullmatch(r\"\\d+\", text)" },
          { id: "d", text: "re.fullmatch(r\"[A-Z]{4}\", text)" },
        ],
        correct: "a",
        explanation: "\\d is a digit and {4} means exactly four; fullmatch requires the whole text to match.",
        whyWrong: {
          b: "Without the backslash, d means the letter d.",
          c: "\\d+ matches any number of digits, such as 12 or 123456.",
          d: "[A-Z] matches capital letters, not digits.",
        },
      },
      {
        id: "ppq34-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-regex",
        prompt: "import re\nprint(re.findall(r\"\\d+\", \"Room 4, floor 12\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "['4', '12']" },
          { id: "b", text: "[4, 12]" },
          { id: "c", text: "['4', '1', '2']" },
          { id: "d", text: "16" },
        ],
        correct: "a",
        explanation: "\\d+ matches each run of one or more digits, returned as strings.",
        whyWrong: {
          b: "findall returns strings, not numbers.",
          c: "+ takes the whole run of digits together.",
          d: "findall does not add anything.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
