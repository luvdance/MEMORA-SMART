/**
 * C++ PROGRAMMING · MODULE 11 · EXCEPTION HANDLING AND FILE PROCESSING
 *
 * Curriculum 11.1 – 11.13. Programs that handle failure and keep their data.
 * Every program is compiled and run by `npm run validate:content`, each in
 * its own folder: programs that READ a file carry it in `files`, and the
 * runner places it beside the program first, so file output is verified
 * exactly like screen output.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s11-exceptions-files";

const CPP = "cpp";
const C = String.raw;

const STUDENTS_TXT = "Ada 91\nBayo 58\nChiamaka 74\n";
const RESULTS_CSV = "name,maths,english\nAda,91,84\nBayo,58,66\nChiamaka,74,79\n";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 11.1 – 11.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l45-errors-validation",
    moduleId: "cp-m11-exceptions-files",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2"],
    title: "Errors and Input Validation",
    subtitle: "What can go wrong, and stopping bad data at the door",
    estimatedMinutes: 20,
    intro:
      "A program that only works when everything goes right is a demonstration, not a tool. Real programs meet missing files, impossible values and users who type letters where numbers belong. This module makes your programs survive all of that, starting with a map of what can go wrong.",

    atoms: [
      {
        id: "a-cp-error-categories",
        title: "Common categories of errors",
        explain:
          "Errors fall into groups, and each group has its own defence. Compile-time errors are caught by the compiler. Logic errors give wrong answers and are caught by testing. Run-time failures happen while the program runs, and these are this module's subject: invalid input from users, missing or unreadable files, values outside what a function can handle (a negative withdrawal, a divisor of zero), and resources running out. A good program expects run-time failures and decides in advance what to do about each.",
        table: {
          caption: "Run-time failures and the usual response.",
          headers: ["Failure", "Example", "Usual response"],
          rows: [
            ["Invalid input", "\"abc\" typed for an age", "Validate and ask again"],
            ["Out-of-range value", "A score of 140", "Reject it, with a clear message"],
            ["Missing file", "records.txt was deleted", "Report it; start with empty data or stop"],
            ["Impossible operation", "Withdraw more than the balance", "Refuse it, or throw an exception"],
            ["Resource exhausted", "Out of memory or disk", "Report it and stop safely"],
          ],
        },
        decision: {
          scenario: "A results program reads a file of scores. One morning the file is missing, and the program prints an average of 0 as if nothing were wrong.",
          question: "What is the real problem?",
          options: [
            {
              id: "a",
              text: "The program never checked whether the file opened, so a failure was silently treated as \"no scores\"",
              why: "Silent failure is worse than a crash: people trust the wrong answer. Every operation that can fail must be checked, and a failure reported clearly.",
            },
            {
              id: "b",
              text: "The average formula is wrong",
              whyWrong: "With no scores read, the formula never received any data. The fault is the missing check.",
            },
            {
              id: "c",
              text: "It is a compile-time error",
              whyWrong: "The program compiled and ran; the failure happened at run time.",
            },
            {
              id: "d",
              text: "Nothing: 0 is a reasonable answer",
              whyWrong: "It is a confident wrong answer, the most dangerous kind.",
            },
          ],
          correct: "a",
          aftermath: "Check what can fail. Report failures loudly. Never let a failure masquerade as a result.",
        },
      },
      {
        id: "a-cp-input-validation",
        title: "Input validation",
        explain:
          "Validation means checking every value from outside the program (the keyboard, a file, a network) before using it. Two checks are needed: was it read at all (the right type), and is it within the allowed range? Put the whole job in one reusable function that keeps asking until the value is valid, so the rest of the program can trust what it receives.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <limits>
#include <string>
using namespace std;

int readInt(const string& prompt, int low, int high) {
    int value = 0;
    while (true) {
        cout << prompt;
        if (cin >> value && value >= low && value <= high) {
            return value;
        }
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Enter a whole number from " << low << " to " << high << ".\n";
    }
}

int main() {
    int score = readInt("Score: ", 0, 100);
    cout << "Recorded " << score << "\n";
    return 0;
}
`,
          inputs: ["abc", "140", "86"],
          expectedOutput: "Score: abc\nEnter a whole number from 0 to 100.\nScore: 140\nEnter a whole number from 0 to 100.\nScore: 86\nRecorded 86",
        },
        why: "readInt handles both kinds of bad input, text and out-of-range numbers, with one message. Every later part of the program can assume score is valid, because there is only one way in.",
        codeFill: {
          task: "Complete readInt's condition: the read must succeed AND the value must be within low to high.",
          code: C`#include <iostream>
#include <limits>
using namespace std;

int readInt(int low, int high) {
    int value = 0;
    while (true) {
        if ({{1}}) {
            return value;
        }
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Try again: ";
    }
}

int main() {
    cout << "Month (1-12): ";
    int month = readInt(1, 12);
    cout << "Month " << month << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "cin >> value && value >= low && value <= high",
                "std::cin >> value && value >= low && value <= high",
                "(cin >> value) && value >= low && value <= high",
                "(std::cin >> value) && value >= low && value <= high",
                "cin >> value && low <= value && value <= high",
                "std::cin >> value && low <= value && value <= high"
              ],
              width: 44,
            },
          ],
          inputs: ["13", "4"],
          expectedOutput: "Month (1-12): 13\nTry again: 4\nMonth 4",
          hint: "Three conditions joined by &&: the read itself, then the lower limit, then the upper limit.",
          successMessage: "The read comes first, so the range is only checked when a number actually arrived.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 11.3 – 11.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l46-exceptions",
    moduleId: "cp-m11-exceptions-files",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.3", "11.4", "11.5", "11.6"],
    title: "Exceptions",
    subtitle: "try, throw and catch, the standard exception classes, and when to use them",
    estimatedMinutes: 26,
    intro:
      "Returning false works when the caller is right next to the problem. But when a failure is discovered deep inside several layers of function calls, and must be handled far up in main, C++ has a better mechanism: the exception.",

    atoms: [
      {
        id: "a-cp-exceptions-intro",
        title: "Introduction to exceptions",
        explain:
          "An exception is an object that a function throws to report that it cannot do its job. Throwing stops the function immediately and travels back up through the callers, skipping their remaining code, until it reaches a catch block that handles that kind of exception. If nothing catches it, the program terminates. Exceptions separate the code that DETECTS a problem from the code that DECIDES what to do about it.",
        analogy:
          "A fire alarm. Whoever notices the fire does not have to put it out; they pull the alarm, normal work stops, and the people trained for fires respond.",
        why: "Without exceptions, every function between the problem and main would have to check and pass on an error code, and forgetting one check silently loses the error.",
      },
      {
        id: "a-cp-try-throw-catch",
        title: "try, throw and catch",
        explain:
          "throw invalid_argument(\"message\"); throws an exception object. Code that might throw goes in a try block; catch blocks after it say which exception types they handle. Catch by const reference: catch (const invalid_argument& e). Inside, e.what() returns the message. After a catch block finishes, the program continues after the whole try/catch, not back where the throw happened.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <stdexcept>
using namespace std;

double withdraw(double balance, double amount) {
    if (amount <= 0) {
        throw invalid_argument("Amount must be positive");
    }
    if (amount > balance) {
        throw runtime_error("Insufficient funds");
    }
    return balance - amount;
}

int main() {
    double balance = 5000;
    try {
        balance = withdraw(balance, 1200);
        cout << "Balance: " << balance << "\n";
        balance = withdraw(balance, 9000);
        cout << "This line never runs\n";
    } catch (const exception& e) {
        cout << "Refused: " << e.what() << "\n";
    }
    cout << "Final balance: " << balance << "\n";
    return 0;
}
`,
          expectedOutput: "Balance: 3800\nRefused: Insufficient funds\nFinal balance: 3800",
        },
        codeFill: {
          task: "Fill the gap so divide reports a zero divisor by throwing a invalid_argument with the message \"Cannot divide by zero\".",
          code: C`#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double a, double b) {
    if (b == 0) {
        {{1}}
    }
    return a / b;
}

int main() {
    try {
        cout << divide(10, 4) << "\n";
        cout << divide(3, 0) << "\n";
    } catch (const invalid_argument& e) {
        cout << "Error: " << e.what() << "\n";
    }
    return 0;
}
`,
          blanks: [{ answers: ['throw invalid_argument("Cannot divide by zero");', 'throw std::invalid_argument("Cannot divide by zero");'], width: 50 }],
          expectedOutput: "2.5\nError: Cannot divide by zero",
          hint: "throw, then create the exception object: its type followed by the message in brackets and quotes.",
          successMessage: "The second cout never ran: the throw jumped straight to the catch.",
        },
      },
      {
        id: "a-cp-standard-exceptions",
        title: "Standard exception classes",
        explain:
          "<stdexcept> provides a family of exception classes, all derived from exception. Use the one that describes the problem: invalid_argument for a bad argument, out_of_range for an index or value outside its range, runtime_error for failures only detectable while running. The standard library throws them too: vector::at throws out_of_range, stoi throws invalid_argument for text that is not a number. Catch blocks are tried in order, so put specific types before general ones, and exception last to catch everything else.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std;

void test(const string& text, int index) {
    vector<int> v = {10, 20, 30};
    try {
        int n = stoi(text);
        cout << v.at(index) + n << "\n";
    } catch (const out_of_range&) {
        cout << "bad index\n";
    } catch (const invalid_argument&) {
        cout << "not a number\n";
    }
}

int main() {
    test("5", 1);
    test("abc", 1);
    test("5", 7);
    return 0;
}
`,
          question: "stoi throws invalid_argument for text that is not a number; at() throws out_of_range for a bad index. What does this print?",
          expectedOutput: "25\nnot a number\nbad index",
          hint: "Call 1 works: 20 + 5. Call 2 fails at stoi, before at() runs. Call 3 converts fine, then at(7) fails.",
          successMessage: "25, not a number, bad index. Each failure was caught by the block for its own type.",
        },
      },
      {
        id: "a-cp-when-exceptions",
        title: "When to use exceptions, and when ordinary conditions",
        explain:
          "Use an ordinary if (or a return value) for situations that are EXPECTED and handled right there: a user typing a wrong value, a search that finds nothing. Use an exception for situations where a function genuinely cannot do what it promised and the decision belongs to someone further up: a constructor given impossible values, a file that must exist but does not, an internal rule broken. Exceptions are for exceptional cases, not for normal control flow such as ending a loop.",
        decision: {
          scenario: "Three situations in a banking program: (1) the user mistypes a menu choice; (2) a BankAccount constructor is given a negative opening balance; (3) a search for an account number finds nothing.",
          question: "Which is the best fit for throwing an exception?",
          options: [
            {
              id: "a",
              text: "Situation 2: a constructor cannot create a valid object, and it has no return value to report failure with",
              why: "A constructor's only way to say \"I cannot build this object\" is to throw. The object then never exists in an invalid state.",
            },
            {
              id: "b",
              text: "Situation 1: menu typos should throw",
              whyWrong: "Mistyped input is expected and is handled on the spot by asking again: an ordinary loop and if.",
            },
            {
              id: "c",
              text: "Situation 3: not finding something should throw",
              whyWrong: "\"Not found\" is a normal answer to a search; return nullptr, -1 or an empty optional.",
            },
            {
              id: "d",
              text: "All three, to be safe",
              whyWrong: "Using exceptions for normal events makes code harder to follow and hides the truly exceptional cases.",
            },
          ],
          correct: "a",
          aftermath: "Expected and local: use if. Impossible to continue and decided elsewhere: throw.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 11.7 – 11.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l47-file-streams",
    moduleId: "cp-m11-exceptions-files",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.7", "11.8", "11.9", "11.10"],
    title: "Reading and Writing Files",
    subtitle: "ifstream, ofstream and fstream, appending, and checking for failure",
    estimatedMinutes: 26,
    intro:
      "Everything your programs have stored so far vanished when they closed, because it lived in RAM. Files live on storage and survive. Pleasingly, C++ reads and writes files with exactly the same << and >> you already use with cout and cin.",

    atoms: [
      {
        id: "a-cp-file-streams",
        title: "File streams: ifstream, ofstream and fstream",
        explain:
          "#include <fstream> gives three stream types. ofstream (output file stream) writes to a file, like cout. ifstream (input file stream) reads from a file, like cin. fstream can do both. You open a file by giving its name when you create the stream, and the file is closed automatically when the stream object goes out of scope; you can also call .close() yourself.",
        table: {
          caption: "The three file streams.",
          headers: ["Type", "Direction", "Behaves like"],
          rows: [
            ["ofstream out(\"data.txt\");", "Write", "cout"],
            ["ifstream in(\"data.txt\");", "Read", "cin"],
            ["fstream f(\"data.txt\", mode);", "Read and/or write", "Both"],
          ],
        },
        why: "Because files are streams, everything you learned about cin and cout carries over: >> reads a word or number, getline reads a line, << writes, and fixed and setprecision format numbers in files too.",
      },
      {
        id: "a-cp-read-write",
        title: "Opening, writing and reading files",
        explain:
          "Writing: create an ofstream with a file name and send data to it with <<. Opening a file for writing CREATES it if it does not exist and EMPTIES it if it does. Reading: create an ifstream and read with >> or getline in a loop; while (in >> name >> score) keeps going until the data runs out. The file below, students.txt, is placed beside the program before it runs.",
        code: {
          language: CPP,
          code: C`#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream in("students.txt");
    string name;
    int score = 0, total = 0, count = 0;
    while (in >> name >> score) {
        cout << name << ": " << score << "\n";
        total += score;
        count++;
    }
    cout << "Average: " << static_cast<double>(total) / count << "\n";
    return 0;
}
`,
          files: { "students.txt": STUDENTS_TXT },
          expectedOutput: "Ada: 91\nBayo: 58\nChiamaka: 74\nAverage: 74.3333",
        },
        codeFill: {
          task: "Fill the gap to create an output file stream called out that writes to report.txt. The program then reads the file back to prove it was written.",
          code: C`#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    {
        {{1}}
        out << "Term: First\n";
        out << "Students: 32\n";
    }
    ifstream in("report.txt");
    string line;
    while (getline(in, line)) {
        cout << "[" << line << "]\n";
    }
    return 0;
}
`,
          blanks: [{ answers: ['ofstream out("report.txt");', 'std::ofstream out("report.txt");', 'ofstream out{"report.txt"};', 'std::ofstream out{"report.txt"};'], width: 32 }],
          expectedOutput: "[Term: First]\n[Students: 32]",
          hint: "Type ofstream, the variable name out, and the file name in brackets and quotes.",
          successMessage: "The inner braces end out's scope, which closes the file, so everything is saved before it is read back.",
        },
      },
      {
        id: "a-cp-append",
        title: "Appending to files",
        explain:
          "Opening with plain ofstream erases the file first. To add to the END of an existing file instead, open it in append mode: ofstream log(\"log.txt\", ios::app);. Use append for logs, transaction histories and anything that should grow over time; use the default mode when you are saving a complete new version of the data.",
        codeExercise: {
          language: CPP,
          code: C`#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    { ofstream f("log.txt"); f << "A\n"; }
    { ofstream f("log.txt", ios::app); f << "B\n"; }
    { ofstream f("log.txt"); f << "C\n"; }
    { ofstream f("log.txt", ios::app); f << "D\n"; }

    ifstream in("log.txt");
    string line;
    while (getline(in, line)) cout << line << "\n";
    return 0;
}
`,
          question: "Some opens erase the file and some append. What does the file contain at the end?",
          expectedOutput: "C\nD",
          hint: "The third open has no ios::app, so it empties the file before writing C.",
          successMessage: "C and D. One missing ios::app wiped the history: the most common file bug in real systems.",
        },
      },
      {
        id: "a-cp-open-failures",
        title: "Checking for file-open failures",
        explain:
          "Opening can fail: the file does not exist, the name is misspelt, you lack permission, or the folder is wrong. A failed stream does not crash; it just reads nothing and writes nothing, silently. So check immediately after opening: if (!in) or if (!in.is_open()). Then decide: report the problem and stop, ask for another file name, or throw an exception for main to handle.",
        code: {
          language: CPP,
          code: C`#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

int countLines(const string& fileName) {
    ifstream in(fileName);
    if (!in) {
        throw runtime_error("Cannot open " + fileName);
    }
    int lines = 0;
    string line;
    while (getline(in, line)) lines++;
    return lines;
}

int main() {
    try {
        cout << countLines("students.txt") << " lines\n";
        cout << countLines("missing.txt") << " lines\n";
    } catch (const runtime_error& e) {
        cout << "Error: " << e.what() << "\n";
    }
    return 0;
}
`,
          files: { "students.txt": STUDENTS_TXT },
          expectedOutput: "3 lines\nError: Cannot open missing.txt",
        },
        codeFill: {
          task: "Fill the condition that is true when settings.txt failed to open.",
          code: C`#include <fstream>
#include <iostream>
using namespace std;

int main() {
    ifstream in("settings.txt");
    if ({{1}}) {
        cout << "No settings file: using defaults\n";
        return 0;
    }
    cout << "Settings loaded\n";
    return 0;
}
`,
          blanks: [{ answers: ["!in", "!in.is_open()", "in.fail()"] }],
          expectedOutput: "No settings file: using defaults",
          hint: "A stream converts to false when it is in a failed state; use the NOT operator.",
          successMessage: "!in. The program noticed the missing file and chose a sensible fallback instead of silently reading nothing.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 11.11 – 11.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l48-records",
    moduleId: "cp-m11-exceptions-files",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.11", "11.12", "11.13"],
    title: "Records and Persistence",
    subtitle: "Processing files line by line, saving application data, and CSV",
    estimatedMinutes: 26,
    intro:
      "Now the pieces combine into what real applications do: load their data when they start, work on it, and save it when they finish, so the next run carries on where the last one stopped. You will also handle CSV, the plain-text table format every spreadsheet can open.",

    atoms: [
      {
        id: "a-cp-line-records",
        title: "Processing records line by line",
        explain:
          "A record is one line of a file describing one thing: a student, a transaction, a product. The robust pattern is to read the file ONE LINE at a time with getline, then pull the fields out of that line with a istringstream (from <sstream>), which lets you use >> on a string as if it were a file. A badly formatted line can then be detected and skipped without derailing every line after it.",
        code: {
          language: CPP,
          code: C`#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    ifstream in("scores.txt");
    string line;
    int lineNo = 0;
    while (getline(in, line)) {
        lineNo++;
        istringstream fields(line);
        string name;
        int score = 0;
        if (fields >> name >> score) {
            cout << name << " -> " << score << "\n";
        } else {
            cout << "Line " << lineNo << " skipped: " << line << "\n";
        }
    }
    return 0;
}
`,
          files: { "scores.txt": "Ada 91\nBayo absent\nChiamaka 74\n" },
          expectedOutput: "Ada -> 91\nLine 2 skipped: Bayo absent\nChiamaka -> 74",
        },
        why: "With while (in >> name >> score), the word \"absent\" would put the whole stream into a failed state and Chiamaka would never be read. Line-by-line reading contains the damage to one record.",
      },
      {
        id: "a-cp-persistence",
        title: "Persisting application data",
        explain:
          "Persistence means the program's data survives between runs. The usual design: on start-up, load the data file into a vector of objects (an empty vector if the file does not exist yet, which is normal on the first run); work on the vector while the program runs; on exit, or after every change, write the whole vector back. Keep load and save as two functions, the only two that touch the file, so the format is defined in one place.",
        code: {
          language: CPP,
          code: C`#include <fstream>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Student {
    string name;
    int score;
};

void save(const vector<Student>& list, const string& file) {
    ofstream out(file);
    for (const Student& s : list) out << s.name << " " << s.score << "\n";
}

vector<Student> load(const string& file) {
    vector<Student> list;
    ifstream in(file);
    Student s;
    while (in >> s.name >> s.score) list.push_back(s);
    return list;
}

int main() {
    vector<Student> students = load("records.txt");
    cout << "Loaded " << students.size() << "\n";
    students.push_back({"Ada", 91});
    students.push_back({"Bayo", 58});
    save(students, "records.txt");

    vector<Student> again = load("records.txt");
    cout << "Reloaded " << again.size() << ", second is " << again[1].name << "\n";
    return 0;
}
`,
          expectedOutput: "Loaded 0\nReloaded 2, second is Bayo",
        },
        why: "The first load finds no file and returns an empty list, which is correct for a first run. The second load proves that what was saved can be read back: that round trip is the test every persistence feature needs.",
        codeFill: {
          task: "Complete save: write each item's name and quantity on its own line, separated by a space.",
          code: C`#include <fstream>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Item {
    string name;
    int quantity;
};

void save(const vector<Item>& items) {
    ofstream out("stock.txt");
    for (const Item& it : items) {
        {{1}}
    }
}

int main() {
    save({{"Rice", 12}, {"Beans", 30}});
    ifstream in("stock.txt");
    string name;
    int qty = 0;
    while (in >> name >> qty) cout << name << "=" << qty << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                C`out << it.name << " " << it.quantity << "\n";`,
                C`out << it.name << ' ' << it.quantity << '\n';`,
                C`out << it.name << " " << it.quantity << endl;`,
                C`out << it.name << " " << it.quantity << std::endl;`
              ],
              width: 44,
            },
          ],
          expectedOutput: "Rice=12\nBeans=30",
          hint: "Exactly like printing with cout, but sent to out: the name, a space, the quantity, and a new line.",
          successMessage: "Writing a file is just cout with a different destination.",
        },
      },
      {
        id: "a-cp-csv",
        title: "Basic CSV-style data processing",
        explain:
          "CSV (comma-separated values) stores a table as text: one line per row, commas between fields, usually with a header row first. Excel and Google Sheets open and save it, which makes it the common language between programs. To read a row, split the line on commas: getline(fields, cell, ',') reads up to the next comma. Convert numeric cells with stoi or stod. (Real-world CSV can contain quoted commas; this basic approach assumes it does not.)",
        code: {
          language: CPP,
          code: C`#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    ifstream in("results.csv");
    string line;
    getline(in, line);
    while (getline(in, line)) {
        istringstream row(line);
        string name, maths, english;
        getline(row, name, ',');
        getline(row, maths, ',');
        getline(row, english, ',');
        int total = stoi(maths) + stoi(english);
        cout << name << ": " << total << "\n";
    }
    return 0;
}
`,
          files: { "results.csv": RESULTS_CSV },
          expectedOutput: "Ada: 175\nBayo: 124\nChiamaka: 153",
        },
        why: "The first getline before the loop reads and discards the header row, name,maths,english, so the loop only sees data.",
        codeFill: {
          task: "Fill the gap so each loop reads the next field of the row, stopping at a comma.",
          code: C`#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    istringstream row("Lagos,Ikeja,2026");
    string cell;
    int n = 0;
    while ({{1}}) {
        n++;
        cout << n << ": " << cell << "\n";
    }
    return 0;
}
`,
          blanks: [{ answers: ["getline(row, cell, ',')", "std::getline(row, cell, ',')"], width: 28 }],
          expectedOutput: "1: Lagos\n2: Ikeja\n3: 2026",
          hint: "getline with a third argument: the character to stop at, in single quotes.",
          successMessage: "getline(row, cell, ','). The third argument changes the separator from a new line to a comma.",
        },
      },
    ],

    task: {
      title: "Mini-project: student records manager",
      intro:
        "Write records.cpp: a menu-driven manager for student records that are kept in a file, so they are still there the next time the program runs.",
      prompts: [
        "Define a Student class or struct with ID, name (one word or use getline) and three scores, with an average() function.",
        "On start-up, load students.csv into a vector; a missing file means an empty list on the first run, but any malformed line must be reported and skipped.",
        "Menu: add a student, list all, search by ID, update scores, delete a student, and save and exit.",
        "Validate every input with a readInt-style function; reject duplicate IDs and scores outside 0–100.",
        "Throw a invalid_argument from the Student constructor for impossible data, and catch it in the menu with a clear message.",
        "Save the list back to students.csv after every change, with a header row, so a crash never loses more than one edit.",
        "Append a line to history.log (ios::app) for every add, update and delete, with what changed.",
        "Test: add records, quit, run again and check they are still there; then corrupt one line of the file by hand and check the program survives it.",
      ],
      closing:
        "This is the core of capstone Project B. Next week the STL makes the searching, sorting and counting far shorter.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
