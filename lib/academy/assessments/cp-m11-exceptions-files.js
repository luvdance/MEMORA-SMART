/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 11 · EXCEPTION HANDLING AND FILE PROCESSING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l45-errors-validation": {
    lessonId: "cp-l45-errors-validation",
    passMark: 70,
    questions: [
      {
        id: "cpq45-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-error-categories",
        prompt: "Which of these is a RUN-TIME failure?",
        options: [
          { id: "a", text: "The data file the program needs has been deleted" },
          { id: "b", text: "A missing semicolon" },
          { id: "c", text: "A misspelt keyword" },
          { id: "d", text: "A missing #include" },
        ],
        correct: "a",
        explanation: "Only a running program can discover that a file is missing.",
        whyWrong: {
          b: "The compiler catches that before the program exists.",
          c: "That is a compile-time error.",
          d: "That is reported by the compiler as an undeclared name.",
        },
      },
      {
        id: "cpq45-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-input-validation",
        prompt: "What two things must input validation check about a number typed by the user?",
        options: [
          { id: "a", text: "That a number was actually read, and that it is within the allowed range" },
          { id: "b", text: "That it is positive and even" },
          { id: "c", text: "Only that it is in range" },
          { id: "d", text: "Only that the user pressed Enter" },
        ],
        correct: "a",
        explanation: "Text instead of a number fails the read; a number like 140 for a score passes the read but breaks the range.",
        whyWrong: {
          b: "Those rules depend on the data; type and range always apply.",
          c: "If the read failed, there is no valid value to range-check.",
          d: "Pressing Enter says nothing about what was typed.",
        },
      },
      {
        id: "cpq45-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-error-categories",
        prompt: "Why is a program that prints a wrong result silently considered worse than one that stops with an error message?",
        options: [
          { id: "a", text: "People trust and act on the wrong result, while an error message tells them something needs fixing" },
          { id: "b", text: "Error messages use less memory" },
          { id: "c", text: "Stopping is always faster" },
          { id: "d", text: "It is not worse" },
        ],
        correct: "a",
        explanation: "A silent failure disguised as a result causes harm far from where the problem started.",
        whyWrong: {
          b: "Memory is irrelevant here.",
          c: "Speed is not the concern; correctness is.",
          d: "Confident wrong answers are the most dangerous output a program can give.",
        },
      },
      {
        id: "cpq45-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-input-validation",
        prompt: "Why put all validation for one kind of input in a single function such as readInt?",
        options: [
          { id: "a", text: "There is then one way in, so every value the rest of the program receives is already valid" },
          { id: "b", text: "Functions are required for cin" },
          { id: "c", text: "It makes the program use the heap" },
          { id: "d", text: "It avoids needing loops" },
        ],
        correct: "a",
        explanation: "The rules are written once, and every caller can trust the result.",
        whyWrong: {
          b: "cin works anywhere; the function is about organisation.",
          c: "It has nothing to do with heap memory.",
          d: "readInt itself contains the loop that keeps asking.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l46-exceptions": {
    lessonId: "cp-l46-exceptions",
    passMark: 70,
    questions: [
      {
        id: "cpq46-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-try-throw-catch",
        prompt: "try {\n    std::cout << \"1\";\n    throw std::runtime_error(\"x\");\n    std::cout << \"2\";\n} catch (const std::exception& e) {\n    std::cout << \"3\";\n}\nstd::cout << \"4\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "134" },
          { id: "b", text: "1234" },
          { id: "c", text: "13" },
          { id: "d", text: "123" },
        ],
        correct: "a",
        explanation: "The throw skips the rest of the try block; the catch runs; execution continues after the try/catch.",
        whyWrong: {
          b: "Code after a throw in the same try block never runs.",
          c: "After the catch finishes, the program carries on and prints 4.",
          d: "2 is skipped and 4 runs.",
        },
      },
      {
        id: "cpq46-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-try-throw-catch",
        prompt: "How should exceptions usually be caught?",
        options: [
          { id: "a", text: "By const reference: catch (const std::exception& e)" },
          { id: "b", text: "By pointer: catch (std::exception* e)" },
          { id: "c", text: "By value only" },
          { id: "d", text: "They cannot be caught" },
        ],
        correct: "a",
        explanation: "Catching by reference avoids copying and keeps the derived type, so e.what() gives the right message.",
        whyWrong: {
          b: "Standard exceptions are thrown as objects, not pointers.",
          c: "By value copies and can slice away derived information.",
          d: "catch exists to handle them.",
        },
      },
      {
        id: "cpq46-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-standard-exceptions",
        prompt: "What does std::vector's at() do when given an invalid index?",
        options: [
          { id: "a", text: "Throws std::out_of_range" },
          { id: "b", text: "Returns 0" },
          { id: "c", text: "Grows the vector" },
          { id: "d", text: "Reads past the end silently" },
        ],
        correct: "a",
        explanation: "at() is the checked access; [] is the unchecked one.",
        whyWrong: {
          b: "It reports an error rather than inventing a value.",
          c: "Only functions like push_back or resize grow a vector.",
          d: "That is what [] might do.",
        },
      },
      {
        id: "cpq46-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-when-exceptions",
        prompt: "A function searches for a product by code and may find nothing. Should it throw an exception when nothing is found?",
        options: [
          { id: "a", text: "Usually not: \"not found\" is an expected result, so return something like nullptr or an empty optional" },
          { id: "b", text: "Yes, always" },
          { id: "c", text: "Yes, and then terminate the program" },
          { id: "d", text: "It should print an error and return a random product" },
        ],
        correct: "a",
        explanation: "Exceptions are for situations where a function cannot do its job; an empty search result is a normal answer.",
        whyWrong: {
          b: "Throwing for ordinary outcomes makes code harder to follow.",
          c: "A missing product is no reason to end the program.",
          d: "A wrong answer is never better than an honest \"none\".",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l47-file-streams": {
    lessonId: "cp-l47-file-streams",
    passMark: 70,
    questions: [
      {
        id: "cpq47-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-file-streams",
        prompt: "Which stream type is used to READ a file?",
        options: [
          { id: "a", text: "std::ifstream" },
          { id: "b", text: "std::ofstream" },
          { id: "c", text: "std::cout" },
          { id: "d", text: "std::string" },
        ],
        correct: "a",
        explanation: "i for input: ifstream reads, ofstream writes.",
        whyWrong: {
          b: "ofstream writes to a file.",
          c: "cout writes to the screen.",
          d: "std::string holds text; it is not a stream to a file.",
        },
      },
      {
        id: "cpq47-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-append",
        prompt: "history.txt already holds 200 lines. A program runs std::ofstream f(\"history.txt\"); f << \"new entry\\n\";. How many lines does the file have afterwards?",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "201" },
          { id: "c", text: "200" },
          { id: "d", text: "0" },
        ],
        correct: "a",
        explanation: "Opening an ofstream without std::ios::app empties the file first.",
        whyWrong: {
          b: "That needs append mode: std::ofstream f(\"history.txt\", std::ios::app);.",
          c: "The new line is written, after the old content is erased.",
          d: "The new entry is written successfully.",
        },
      },
      {
        id: "cpq47-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-open-failures",
        prompt: "What happens if you read from an ifstream whose file failed to open, without checking?",
        options: [
          { id: "a", text: "Reads silently fail and read nothing; the program carries on as if the file were empty" },
          { id: "b", text: "The program crashes immediately" },
          { id: "c", text: "The file is created" },
          { id: "d", text: "The compiler reports an error" },
        ],
        correct: "a",
        explanation: "A failed stream stays quiet, which is why if (!in) must be checked right after opening.",
        whyWrong: {
          b: "There is no crash; that is the danger.",
          c: "ifstream never creates files.",
          d: "The compiler cannot know whether a file exists at run time.",
        },
      },
      {
        id: "cpq47-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-read-write",
        prompt: "Which loop reads every name-and-score pair from an ifstream in?",
        options: [
          { id: "a", text: "while (in >> name >> score) { ... }" },
          { id: "b", text: "for (int i = 0; i < 100; i++) in >> name >> score;" },
          { id: "c", text: "while (true) in >> name >> score;" },
          { id: "d", text: "if (in >> name >> score) { ... }" },
        ],
        correct: "a",
        explanation: "The read is the condition: the loop continues while a full pair is read and stops when the data runs out.",
        whyWrong: {
          b: "The file may have more or fewer than 100 records.",
          c: "This never stops.",
          d: "if reads only one pair.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l48-records": {
    lessonId: "cp-l48-records",
    passMark: 70,
    questions: [
      {
        id: "cpq48-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-line-records",
        prompt: "Why read a record file with getline and an istringstream per line, instead of while (in >> name >> score)?",
        options: [
          { id: "a", text: "A badly formatted line can be detected and skipped without putting the whole file stream into a failed state" },
          { id: "b", text: "getline is the only way to read files" },
          { id: "c", text: "istringstream makes the file smaller" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "a",
        explanation: "A failure while parsing one line affects only that line's stringstream.",
        whyWrong: {
          b: ">> reads files too; the issue is recovering from bad data.",
          c: "It does not change the file at all.",
          d: "With >> on the file, one bad record stops every record after it.",
        },
      },
      {
        id: "cpq48-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-persistence",
        prompt: "On a program's very first run, its data file does not exist yet. What should load() do?",
        options: [
          { id: "a", text: "Return an empty collection: no file yet simply means no data yet" },
          { id: "b", text: "Crash" },
          { id: "c", text: "Invent some sample records" },
          { id: "d", text: "Delete the program" },
        ],
        correct: "a",
        explanation: "For a data file that the program itself creates, absence on the first run is normal.",
        whyWrong: {
          b: "A normal first run must not crash.",
          c: "Fake data would be saved and mistaken for real records.",
          d: "That would be absurd.",
        },
      },
      {
        id: "cpq48-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-csv",
        prompt: "std::istringstream row(\"Kano,Nasarawa,40\");\nstd::string a, b;\nstd::getline(row, a, ',');\nstd::getline(row, b, ',');\n\nWhat is in b?",
        options: [
          { id: "a", text: "Nasarawa" },
          { id: "b", text: "Kano" },
          { id: "c", text: "Nasarawa,40" },
          { id: "d", text: "40" },
        ],
        correct: "a",
        explanation: "Each getline with ',' reads up to the next comma: the first gives Kano, the second Nasarawa.",
        whyWrong: {
          b: "Kano is a, read first.",
          c: "The second getline stops at the next comma.",
          d: "40 would be the third field.",
        },
      },
      {
        id: "cpq48-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-csv",
        prompt: "Why is the first line of a CSV file often read once before the main loop?",
        options: [
          { id: "a", text: "To skip the header row of column names" },
          { id: "b", text: "Because the first line is always empty" },
          { id: "c", text: "To open the file" },
          { id: "d", text: "To count the columns automatically" },
        ],
        correct: "a",
        explanation: "The header holds labels such as name,maths,english, which are not data.",
        whyWrong: {
          b: "It usually holds the column names.",
          c: "The file is opened when the ifstream is created.",
          d: "Reading and discarding it does not count anything.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
