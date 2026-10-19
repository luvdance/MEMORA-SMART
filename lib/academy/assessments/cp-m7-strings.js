/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 7 · STRINGS AND TEXT PROCESSING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l28-strings-intro": {
    lessonId: "cp-l28-strings-intro",
    passMark: 70,
    questions: [
      {
        id: "cpq28-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-char-vs-string",
        prompt: "What is the difference between 'Y' and \"Y\" in C++?",
        options: [
          { id: "a", text: "'Y' is a single char; \"Y\" is a string (text) of length one" },
          { id: "b", text: "There is no difference" },
          { id: "c", text: "'Y' is a string; \"Y\" is a char" },
          { id: "d", text: "\"Y\" is not valid C++" },
        ],
        correct: "a",
        explanation: "Single quotes make one character; double quotes make text, even when it is one character long.",
        whyWrong: {
          b: "They are different types: a char and a sequence of characters.",
          c: "It is the other way round.",
          d: "\"Y\" is valid text.",
        },
      },
      {
        id: "cpq28-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-read-word",
        prompt: "std::string answer;\nstd::cin >> answer;\n\nThe user types \"New York\" and presses Enter. What is in answer?",
        options: [
          { id: "a", text: "New" },
          { id: "b", text: "New York" },
          { id: "c", text: "York" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "cin >> stops at the first space; York stays in the buffer for the next read.",
        whyWrong: {
          b: "Reading text with spaces needs std::getline.",
          c: "cin reads from the beginning of the input.",
          d: "It reads one word, New.",
        },
      },
      {
        id: "cpq28-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-getline",
        prompt: "Which statement reads a complete line, spaces included, into the string line?",
        options: [
          { id: "a", text: "std::getline(std::cin, line);" },
          { id: "b", text: "std::cin >> line;" },
          { id: "c", text: "line = std::cin;" },
          { id: "d", text: "std::cin.getline >> line;" },
        ],
        correct: "a",
        explanation: "std::getline reads everything up to the newline and stores it without the newline.",
        whyWrong: {
          b: "That reads only up to the first space.",
          c: "cin is a stream, not a value to assign.",
          d: "That is not valid syntax; getline is called with the stream and the string as arguments.",
        },
      },
      {
        id: "cpq28-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-std-string",
        prompt: "std::string s(3, '*');\ns += \"ok\";\nstd::cout << s << \" \" << s.size();\n\nWhat is printed?",
        options: [
          { id: "a", text: "***ok 5" },
          { id: "b", text: "3*ok 4" },
          { id: "c", text: "***ok 2" },
          { id: "d", text: "*ok 3" },
        ],
        correct: "a",
        explanation: "s(3, '*') is three stars; += appends \"ok\", giving five characters.",
        whyWrong: {
          b: "(3, '*') means three copies of the character, not the digit 3.",
          c: "size() counts the whole string, not only the appended part.",
          d: "Three stars are created, not one.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l29-string-ops": {
    lessonId: "cp-l29-string-ops",
    passMark: 70,
    questions: [
      {
        id: "cpq29-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-length-index",
        prompt: "std::string w = \"Memora\";\nstd::cout << w[1] << w[w.size() - 1];\n\nWhat is printed?",
        options: [
          { id: "a", text: "ea" },
          { id: "b", text: "Ma" },
          { id: "c", text: "er" },
          { id: "d", text: "e" },
        ],
        correct: "a",
        explanation: "w[1] is the second character, e. The last character is at size() - 1, which is a.",
        whyWrong: {
          b: "M is w[0]; indexes start at 0.",
          c: "r is at index 4; the last character is index 5.",
          d: "Two characters are printed.",
        },
      },
      {
        id: "cpq29-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-find",
        prompt: "What does s.find(\"xyz\") return if \"xyz\" does not occur in s?",
        options: [
          { id: "a", text: "std::string::npos" },
          { id: "b", text: "-1, as an int" },
          { id: "c", text: "0" },
          { id: "d", text: "It throws an error" },
        ],
        correct: "a",
        explanation: "npos is a special value meaning \"not found\". Compare the result with std::string::npos.",
        whyWrong: {
          b: "find returns a size_t, which cannot be negative; npos is its special value.",
          c: "0 would mean it was found at the very start.",
          d: "find does not throw; it returns npos.",
        },
      },
      {
        id: "cpq29-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-substr",
        prompt: "std::string t = \"08:45:30\";\nstd::cout << t.substr(3, 2);\n\nWhat is printed?",
        options: [
          { id: "a", text: "45" },
          { id: "b", text: ":4" },
          { id: "c", text: "45:30" },
          { id: "d", text: "8:" },
        ],
        correct: "a",
        explanation: "substr(3, 2) takes two characters starting at index 3: the minutes.",
        whyWrong: {
          b: "Index 3 is the 4, after the colon at index 2.",
          c: "The length 2 limits it to two characters.",
          d: "That would start at index 1.",
        },
      },
      {
        id: "cpq29-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-concat-compare",
        prompt: "Which is true in C++?",
        options: [
          { id: "a", text: "std::string(\"Zebra\") < std::string(\"apple\"), because every capital letter's code is smaller than every lower-case letter's" },
          { id: "b", text: "\"apple\" < \"Zebra\" as std::strings, because a comes before Z in the alphabet" },
          { id: "c", text: "Strings cannot be compared with <" },
          { id: "d", text: "\"Hello\" + \" world\" joins two pieces of literal text" },
        ],
        correct: "a",
        explanation: "Comparison uses character codes, and 'Z' (90) is less than 'a' (97).",
        whyWrong: {
          b: "Comparison is by character code, not by dictionary order ignoring case.",
          c: "std::string supports <, >, == and the other comparisons.",
          d: "Two string literals cannot be joined with +; at least one side must be a std::string.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l30-text-processing": {
    lessonId: "cp-l30-text-processing",
    passMark: 70,
    questions: [
      {
        id: "cpq30-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-case",
        prompt: "How can a program compare two names while ignoring capital letters?",
        options: [
          { id: "a", text: "Convert both to the same case, then compare" },
          { id: "b", text: "Use == directly; it ignores case" },
          { id: "c", text: "Compare only their lengths" },
          { id: "d", text: "Use < instead of ==" },
        ],
        correct: "a",
        explanation: "== compares character codes exactly, so normalise the case of both strings first.",
        whyWrong: {
          b: "== is case-sensitive: \"Ada\" and \"ada\" are different.",
          c: "Different names can have the same length.",
          d: "< is also case-sensitive.",
        },
      },
      {
        id: "cpq30-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-counting",
        prompt: "Why do word counters count word STARTS (a non-space after a space) instead of counting spaces and adding one?",
        options: [
          { id: "a", text: "Double spaces, or spaces at the start or end, would make counting spaces give the wrong number" },
          { id: "b", text: "Counting spaces is not possible in C++" },
          { id: "c", text: "Word starts are faster to find" },
          { id: "d", text: "Spaces are counted as letters" },
        ],
        correct: "a",
        explanation: "\"Hello  World\" has two spaces but two words. Counting starts handles any spacing.",
        whyWrong: {
          b: "std::isspace makes counting spaces easy; it just gives the wrong word count.",
          c: "Both take one pass; the reason is correctness.",
          d: "isspace and isalpha are separate tests.",
        },
      },
      {
        id: "cpq30-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-palindrome",
        prompt: "In a palindrome check of s with n = s.size(), which character is compared with s[i]?",
        options: [
          { id: "a", text: "s[n - 1 - i]" },
          { id: "b", text: "s[n - i]" },
          { id: "c", text: "s[i + 1]" },
          { id: "d", text: "s[n]" },
        ],
        correct: "a",
        explanation: "The mirror of index 0 is the last index, n - 1; in general the mirror of i is n - 1 - i.",
        whyWrong: {
          b: "For i = 0 that is s[n], one past the end.",
          c: "That compares neighbours, not mirror positions.",
          d: "s[n] is past the end of the string.",
        },
      },
      {
        id: "cpq30-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-validation",
        prompt: "Which header provides std::isdigit and std::toupper?",
        options: [
          { id: "a", text: "<cctype>" },
          { id: "b", text: "<string>" },
          { id: "c", text: "<cmath>" },
          { id: "d", text: "<iomanip>" },
        ],
        correct: "a",
        explanation: "<cctype> holds the single-character tests and conversions.",
        whyWrong: {
          b: "<string> provides std::string itself.",
          c: "<cmath> is the maths library.",
          d: "<iomanip> provides output formatting such as setprecision.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l31-input-buffer": {
    lessonId: "cp-l31-input-buffer",
    passMark: 70,
    questions: [
      {
        id: "cpq31-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-buffer-problem",
        prompt: "A program does std::cin >> age; and then std::getline(std::cin, name);. The user types 30, presses Enter, and the name is read as empty. Why?",
        options: [
          { id: "a", text: "cin >> left the newline from Enter in the buffer, and getline read up to it immediately" },
          { id: "b", text: "getline cannot be used after cin" },
          { id: "c", text: "The user typed too quickly" },
          { id: "d", text: "name is the wrong type" },
        ],
        correct: "a",
        explanation: "The leftover newline makes getline return an empty line before the user can type.",
        whyWrong: {
          b: "They can be combined; the leftover newline just has to be dealt with.",
          c: "Timing has nothing to do with it; the newline is already waiting in the buffer.",
          d: "std::string is the right type for getline.",
        },
      },
      {
        id: "cpq31-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-buffer-fix",
        prompt: "Which line fixes it when placed between the cin >> and the getline?",
        options: [
          { id: "a", text: "std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');" },
          { id: "b", text: "std::cin.clear();" },
          { id: "c", text: "std::cout << std::endl;" },
          { id: "d", text: "name = \"\";" },
        ],
        correct: "a",
        explanation: "ignore throws away everything up to and including the next newline, so getline waits for new input.",
        whyWrong: {
          b: "clear() resets a FAILED stream; it does not remove the newline.",
          c: "Output has no effect on what is waiting in the input buffer.",
          d: "Emptying name does not change what getline reads.",
        },
      },
      {
        id: "cpq31-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-bad-input",
        prompt: "int qty = 5;\nstd::cin >> qty;\n\nThe user types \"ten\". What happens?",
        options: [
          { id: "a", text: "The read fails: qty becomes 0 and cin enters a failed state until clear() is called" },
          { id: "b", text: "qty becomes 10" },
          { id: "c", text: "The program crashes" },
          { id: "d", text: "qty stays 5 and nothing else changes" },
        ],
        correct: "a",
        explanation: "Since C++11 a failed numeric read stores 0 and sets the stream's fail state, which blocks every later read.",
        whyWrong: {
          b: "cin does not understand words as numbers.",
          c: "It does not crash; it fails quietly, which is worse unless you check.",
          d: "The stream changes state, so later reads are affected too.",
        },
      },
      {
        id: "cpq31-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-bad-input",
        prompt: "What does if (std::cin >> age) test?",
        options: [
          { id: "a", text: "Whether the read succeeded" },
          { id: "b", text: "Whether age is greater than 0" },
          { id: "c", text: "Whether the user pressed Enter" },
          { id: "d", text: "Whether age was declared" },
        ],
        correct: "a",
        explanation: "The expression gives back the stream, which converts to true only when the read worked.",
        whyWrong: {
          b: "It checks the read, not the value. Check the value separately.",
          c: "It is about whether a valid number was read, not about keys.",
          d: "Declarations are checked by the compiler, not at run time.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
