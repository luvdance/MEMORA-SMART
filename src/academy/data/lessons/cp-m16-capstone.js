/**
 * C++ PROGRAMMING · MODULE 16 · CAPSTONE PROJECT AND FINAL ASSESSMENT
 *
 * Curriculum 16.1 – 16.5 (Module 16 is a project week in the source
 * document; these topics are its stages). The learner chooses one of the
 * four capstone projects, plans it, builds it in tested steps, documents and
 * presents it, then prepares for the certification exam.
 *
 * The worked example follows Project A, the recommended Banking Management
 * System, and every program in it is compiled and run by `npm run
 * validate:content`, like the rest of the course.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s16-capstone";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 16.1 – 16.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l66-capstone-plan",
    moduleId: "cp-m16-capstone",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2"],
    title: "Choosing and Designing Your Capstone",
    subtitle: "Picking a project, writing requirements, and designing before coding",
    estimatedMinutes: 25,
    intro:
      "Fifteen weeks ago you printed one line of text. This week you build a complete application of your own: one that combines classes, the STL, files, exceptions and tests, and that you can explain to a reviewer. It starts not with code but with a decision and a plan.",

    atoms: [
      {
        id: "a-cp-capstone-choice",
        title: "The four capstone projects",
        explain:
          "Choose ONE project. Each is designed to need several parts of the course at once, so none can be built by following a single tutorial. Project A is recommended because it exercises the widest range of skills, but choose the one you will enjoy finishing: a complete, tested, well-explained smaller project beats an ambitious unfinished one.",
        table: {
          caption: "The capstone options and the skills each one demands.",
          headers: ["Project", "What it must do", "Skills it proves"],
          rows: [
            ["A · Banking Management System (recommended)", "Create accounts, deposit, withdraw, check balances, keep transaction history, validate input, store everything in files", "Classes, functions, files, exceptions, vectors, testing"],
            ["B · Student Records Management System", "Create, update, search, rank and delete records, calculate grades, save between sessions", "Structures or classes, STL, sorting, searching, file handling"],
            ["C · Inventory and Sales System", "Manage products and stock, record sales, calculate revenue, produce inventory reports", "Maps, vectors, classes, calculations, persistence, error handling"],
            ["D · Tic-Tac-Toe or Quiz Game", "Playable game logic, input validation, scoring, replay, saved high scores", "Arrays, functions, conditions, loops, strings, file handling"],
          ],
        },
        decision: {
          scenario: "A learner wants to build a full online banking website with a database, a mobile app and fingerprint login, and has one week.",
          question: "What is the best advice?",
          options: [
            {
              id: "a",
              text: "Build Project A as specified, as a console application done thoroughly, and list the web and mobile ideas as future work in the README",
              why: "Scope is the most common reason capstones fail. A finished, tested, well-explained project demonstrates far more than an unfinished ambitious one.",
            },
            {
              id: "b",
              text: "Try everything; something will probably work by Friday",
              whyWrong: "Spreading one week across a website, an app and biometrics produces nothing complete to assess.",
            },
            {
              id: "c",
              text: "Pick the smallest project and skip testing to save time",
              whyWrong: "Testing is a required deliverable and part of what the capstone proves.",
            },
            {
              id: "d",
              text: "Copy a banking system from the internet",
              whyWrong: "You must be able to explain and defend every line; copied code fails the presentation and teaches nothing.",
            },
          ],
          correct: "a",
          aftermath: "Choose a scope you can finish, then finish it properly.",
        },
      },
      {
        id: "a-cp-requirements",
        title: "Writing requirements",
        explain:
          "Requirements say WHAT the program must do, precisely enough to test, before you decide HOW. Write each as one checkable sentence: \"A withdrawal larger than the balance is refused with a message, and the balance is unchanged.\" Split them into must-have (the program is not done without it) and nice-to-have (only after every must-have works). Each requirement later becomes at least one test case.",
        example:
          "Project A · Banking Management System · requirements (extract)\n\nMUST\n  R1  Create an account with an owner's name and an opening deposit\n      of 0 or more; each account gets a unique number.\n  R2  Deposit a positive amount; anything else is refused.\n  R3  Withdraw a positive amount not larger than the balance;\n      anything else is refused and the balance is unchanged.\n  R4  Every deposit and withdrawal is recorded with its type, amount\n      and resulting balance.\n  R5  Accounts and history are saved to files and reloaded on start.\n  R6  Invalid input never crashes the program.\n\nNICE TO HAVE\n  N1  Transfer between two accounts.\n  N2  Monthly statement for one account.",
        decision: {
          scenario: "One requirement reads: \"The system should handle withdrawals properly.\"",
          question: "Why is this a weak requirement?",
          options: [
            {
              id: "a",
              text: "\"Properly\" cannot be tested; it should state exactly what happens, such as refusing amounts above the balance and leaving the balance unchanged",
              why: "A requirement you cannot test is a wish. Precise wording turns directly into test cases.",
            },
            {
              id: "b",
              text: "It is too short",
              whyWrong: "Short is fine; vague is the problem.",
            },
            {
              id: "c",
              text: "Withdrawals should not be in the requirements",
              whyWrong: "They are central to a banking system.",
            },
            {
              id: "d",
              text: "Nothing is wrong with it",
              whyWrong: "Two people would build two different programs from it.",
            },
          ],
          correct: "a",
          aftermath: "If you cannot write a test for a requirement, rewrite the requirement.",
        },
      },
      {
        id: "a-cp-capstone-design",
        title: "Designing the classes, files and data",
        explain:
          "Before coding, sketch three things. The classes: a UML box for each, with private data, public operations and relationships (Bank HAS Accounts; an Account HAS Transactions). The files: one header and one source file per class, plus main.cpp, tests and CMakeLists.txt. The data format: exactly what each line of each save file looks like. Each class gets one responsibility: Account enforces the money rules, Bank finds accounts, Storage reads and writes files, and main only handles the menu.",
        example:
          "Classes (Project A)\n\n  Transaction            plain data: type, amount, balanceAfter\n  Account                - number, owner, balance, history\n                         + deposit(), withdraw(), getBalance(),\n                           getHistory()      (throws on invalid amounts)\n  Bank                   - map<int, Account> accounts\n                         + open(), find() -> Account*, all()\n  Storage                + save(const Bank&), load() -> Bank\n                         (the ONLY class that touches files)\n\nFiles\n  include/Transaction.h  include/Account.h  include/Bank.h  include/Storage.h\n  src/Account.cpp  src/Bank.cpp  src/Storage.cpp  src/main.cpp\n  tests/test_account.cpp   CMakeLists.txt   README.md\n\nData format (accounts.csv)\n  number,owner,balance\n  1001,Ada,3800.00",
        codeFill: {
          task: "The design's simplest piece is Transaction, plain data. Fill the missing member so each transaction records the balance after it.",
          code: C`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Transaction {
    string type;
    double amount = 0;
    {{1}}
};

int main() {
    vector<Transaction> history;
    history.push_back({"deposit", 5000, 5000});
    history.push_back({"withdraw", 1200, 3800});
    for (const auto& t : history) {
        cout << t.type << " " << t.amount << " -> " << t.balanceAfter << "\n";
    }
    return 0;
}
`,
          blanks: [{ answers: ["double balanceAfter = 0;", "double balanceAfter{};", "double balanceAfter = 0.0;", "double balanceAfter;"], width: 26 }],
          expectedOutput: "deposit 5000 -> 5000\nwithdraw 1200 -> 3800",
          hint: "The third member is a double called balanceAfter, declared like amount above it.",
          successMessage: "A plain struct is right here: Transaction has no rules to protect, only data to carry.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 16.3 – 16.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l67-capstone-build",
    moduleId: "cp-m16-capstone",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.3", "16.4"],
    title: "Building, Testing and Presenting",
    subtitle: "Incremental development with tests, documentation and your presentation",
    estimatedMinutes: 30,
    intro:
      "The way to build a large program is to build a small one that works, then grow it one tested step at a time, committing after each. This lesson walks through the core of Project A that way, then covers what your README and presentation must contain.",

    atoms: [
      {
        id: "a-cp-incremental",
        title: "Building incrementally, testing each step",
        explain:
          "Never write the whole program and then try it. Build in thin vertical slices: first an Account that can deposit, with a test; then withdraw, with its tests, including the refusal; then history; then the Bank; then saving and loading; then the menu. After every slice: compile with -Wall -Wextra, run every test, and commit. When something breaks, it was the last small change, which is easy to find.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std;

struct Transaction {
    string type;
    double amount;
    double balanceAfter;
};

class Account {
    int number;
    string owner;
    double balance = 0;
    vector<Transaction> history;
public:
    Account(int n, string o) : number(n), owner(o) {}
    void deposit(double amount) {
        if (amount <= 0) throw invalid_argument("Deposit must be positive");
        balance += amount;
        history.push_back({"deposit", amount, balance});
    }
    void withdraw(double amount) {
        if (amount <= 0) throw invalid_argument("Withdrawal must be positive");
        if (amount > balance) throw runtime_error("Insufficient funds");
        balance -= amount;
        history.push_back({"withdraw", amount, balance});
    }
    double getBalance() const { return balance; }
    const vector<Transaction>& getHistory() const { return history; }
};

int failures = 0;
void check(bool ok, const string& name) {
    cout << (ok ? "PASS " : "FAIL ") << name << "\n";
    if (!ok) failures++;
}

template <typename F>
bool throws(F action) {
    try { action(); } catch (const exception&) { return true; }
    return false;
}

int main() {
    Account a(1001, "Ada");
    a.deposit(5000);
    check(a.getBalance() == 5000, "R2 deposit adds to the balance");
    check(throws([&] { a.deposit(-50); }), "R2 negative deposit refused");
    a.withdraw(1200);
    check(a.getBalance() == 3800, "R3 withdrawal subtracts");
    check(throws([&] { a.withdraw(9000); }) && a.getBalance() == 3800, "R3 overdraft refused, balance unchanged");
    check(a.getHistory().size() == 2, "R4 two transactions recorded");
    cout << failures << " failure(s)\n";
    return failures == 0 ? 0 : 1;
}
`,
          expectedOutput: "PASS R2 deposit adds to the balance\nPASS R2 negative deposit refused\nPASS R3 withdrawal subtracts\nPASS R3 overdraft refused, balance unchanged\nPASS R4 two transactions recorded\n0 failure(s)",
        },
        why: "Each test is named after the requirement it proves, so the test output doubles as evidence that the requirements are met. The throws helper is a small function template taking a lambda: Weeks 11 and 12 working together.",
        codeFill: {
          task: "Add the test for the next slice: a withdrawal of exactly the whole balance must be allowed, leaving 0.",
          code: C`#include <iostream>
#include <string>
using namespace std;

class Account {
    double balance = 0;
public:
    void deposit(double amount) { if (amount > 0) balance += amount; }
    bool withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }
    double getBalance() const { return balance; }
};

void check(bool ok, const string& name) {
    cout << (ok ? "PASS " : "FAIL ") << name << "\n";
}

int main() {
    Account a;
    a.deposit(2500);
    check({{1}}, "withdrawing the whole balance is allowed");
    check(a.getBalance() == 0, "and leaves exactly 0");
    return 0;
}
`,
          blanks: [{ answers: ["a.withdraw(2500)", "a.withdraw(2500) == true", "a.withdraw(a.getBalance())"], width: 24 }],
          expectedOutput: "PASS withdrawing the whole balance is allowed\nPASS and leaves exactly 0",
          hint: "withdraw returns true when it succeeds. Withdraw exactly what was deposited.",
          successMessage: "A boundary test: amount equal to the balance. Exactly where a > written as >= would hide.",
        },
      },
      {
        id: "a-cp-capstone-persistence",
        title: "A tested save-and-load slice",
        explain:
          "Persistence gets its own slice and its own round-trip test: save known data, load it into a fresh object, and check every field came back. Keep the file format in one class (Storage) so the rest of the program never knows how data is written. Test the unhappy paths too: a missing file on first run, and a corrupt line.",
        codeExercise: {
          language: CPP,
          code: C`#include <fstream>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
using namespace std;

struct Acc {
    string owner;
    double balance;
};

void save(const map<int, Acc>& accounts) {
    ofstream out("accounts.csv");
    out << "number,owner,balance\n" << fixed << setprecision(2);
    for (const auto& [num, a] : accounts) out << num << "," << a.owner << "," << a.balance << "\n";
}

map<int, Acc> load() {
    map<int, Acc> result;
    ifstream in("accounts.csv");
    string line, num, owner, bal;
    getline(in, line);
    while (getline(in, line)) {
        istringstream row(line);
        getline(row, num, ',');
        getline(row, owner, ',');
        getline(row, bal, ',');
        result[stoi(num)] = {owner, stod(bal)};
    }
    return result;
}

int main() {
    cout << "First run: " << load().size() << " accounts\n";
    save({{1002, {"Bayo", 250.5}}, {1001, {"Ada", 3800}}});
    auto back = load();
    cout << back.size() << " " << back.begin()->second.owner << " " << back[1002].balance << "\n";
    return 0;
}
`,
          question: "The first load runs before any file exists. Then two accounts are saved and reloaded into a map. What does this print?",
          expectedOutput: "First run: 0 accounts\n2 Ada 250.5",
          hint: "A map is ordered by key, so begin() is account 1001. Bayo's balance was saved as 250.50 and read back as a double.",
          successMessage: "0 on the first run, then a full round trip. That test belongs in your capstone's test file.",
        },
      },
      {
        id: "a-cp-documentation",
        title: "Documentation and presenting your project",
        explain:
          "Your README lets a stranger understand, build and use your project without asking you anything: what it is, the features (and the requirements they meet), how to build it with CMake, how to run it and the tests, a short example session, the design (a class diagram and why it is shaped that way), known limitations and future work. Your presentation, about ten minutes, demonstrates the program working, including an error being handled, shows the tests passing, and explains one design decision and one bug you found and fixed. Reviewers listen for understanding, not perfection.",
        example:
          "README.md (outline)\n\n  # Banking Management System\n  A console banking application in C++17: accounts, deposits,\n  withdrawals, transaction history, saved between sessions.\n\n  ## Features            R1–R6, each in one line\n  ## Build               cmake -S . -B build && cmake --build build\n  ## Run                 ./build/bank        Tests: ./build/tests\n  ## Example session     a short pasted transcript\n  ## Design              class diagram; why Storage is separate\n  ## Testing             what is tested, including boundaries\n  ## Limitations         single user; no encryption of the data file\n  ## Future work         transfers between accounts; monthly statements\n\nPresentation (about 10 minutes)\n  1. The problem and the requirements             1 min\n  2. Live demo, including a refused withdrawal    3 min\n  3. Design: classes, files and one decision      2 min\n  4. Tests running, and what they cover           2 min\n  5. One bug: how you found it and proved the fix 2 min",
        decision: {
          scenario: "During your presentation a reviewer asks why Storage is a separate class instead of Account saving itself.",
          question: "Which answer shows the strongest understanding?",
          options: [
            {
              id: "a",
              text: "Single responsibility: Account enforces money rules and Storage owns the file format, so changing the format (say to a database) touches one class and none of the banking logic",
              why: "It names the principle, explains the benefit concretely, and shows you thought about future change. That is what reviewers are listening for.",
            },
            {
              id: "b",
              text: "The tutorial did it that way",
              whyWrong: "It shows the design was copied, not understood.",
            },
            {
              id: "c",
              text: "More classes always means better code",
              whyWrong: "Classes are a tool with a reason; more is not automatically better.",
            },
            {
              id: "d",
              text: "It does not really matter",
              whyWrong: "It does matter, and the question is an invitation to show you know why.",
            },
          ],
          correct: "a",
          aftermath: "For every design decision, be ready to say what it makes easier and what it costs.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 16.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l68-final-prep",
    moduleId: "cp-m16-capstone",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.5"],
    title: "Preparing for the Final Assessment",
    subtitle: "How the certification exam works, and a review across the course",
    estimatedMinutes: 25,
    intro:
      "The last step is the certification exam. It covers all five phases, and like every lesson in this course it asks you to read real C++ and say what it does. This lesson explains how it works and gives you one last review that mixes ideas from across the sixteen weeks.",

    atoms: [
      {
        id: "a-cp-exam-format",
        title: "How the certification exam works",
        explain:
          "The exam has 30 questions in five sections, one per phase of the course, with 75 minutes to answer. Some questions show a short C++ program and ask exactly what it prints; every one of those programs has been compiled and run, so the expected output is what C++ really does. The rest test reasoning: design choices, debugging, memory and safety. To pass you need 70% overall AND at least 50% in every section, so a strong area cannot hide a weak one. Each candidate gets a different selection of questions.",
        table: {
          caption: "The five sections of the exam.",
          headers: ["Section", "Covers", "Questions"],
          rows: [
            ["1 · Foundations", "Types, input/output, operators, conditions, loops", "6"],
            ["2 · Core skills", "Functions, arrays, vectors, strings", "6"],
            ["3 · Memory and objects", "Pointers, references, classes, inheritance, polymorphism", "6"],
            ["4 · Advanced tools", "Exceptions, files, templates, the STL, data structures and algorithms", "6"],
            ["5 · Professional practice", "Modern C++, RAII, debugging, testing, project structure, security", "6"],
          ],
        },
        why: "The 50%-per-section rule reflects how real work goes: a developer who writes clever classes but cannot be trusted with memory or input validation is not yet ready. Revise your weakest phase first.",
      },
      {
        id: "a-cp-review-predict",
        title: "Review: read it like the exam",
        explain:
          "This program mixes a class, a vector, a lambda, an algorithm and integer division, as exam questions do. Read it line by line and write down each value before answering, exactly as you have done since Week 1.",
        codeExercise: {
          language: CPP,
          code: C`#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Student {
public:
    string name;
    int total;
    Student(string n, int t) : name(n), total(t) {}
    int average(int subjects) const { return total / subjects; }
};

int main() {
    vector<Student> cls = {{"Ada", 255}, {"Bayo", 170}, {"Chi", 214}};
    sort(cls.begin(), cls.end(), [](const Student& a, const Student& b) {
        return a.total > b.total;
    });
    for (const auto& s : cls) {
        cout << s.name << ":" << s.average(3) << " ";
    }
    cout << "\n";
    auto passed = count_if(cls.begin(), cls.end(), [](const Student& s) {
        return s.average(3) >= 60;
    });
    cout << passed << "\n";
    return 0;
}
`,
          question: "Sorted by total, highest first, then averaged with integer division. What does this print?",
          expectedOutput: "Ada:85 Chi:71 Bayo:56\n2",
          hint: "255 / 3 = 85, 214 / 3 = 71 (integer division), 170 / 3 = 56. Which averages are at least 60?",
          successMessage: "Classes, vectors, lambdas, algorithms and integer division in one program. You read it all. That is the course.",
        },
      },
      {
        id: "a-cp-review-fill",
        title: "Review: write the missing modern C++",
        explain:
          "One final write-the-code practice, drawing on Weeks 8, 12 and 14 at once: owning memory safely, storing objects polymorphically and calling a virtual function on each.",
        codeFill: {
          task: "Fill the gap so each new Circle is created as a unique_ptr and added to the shapes vector.",
          code: C`#include <iostream>
#include <memory>
#include <vector>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double r;
public:
    explicit Circle(double radius) : r(radius) {}
    double area() const override { return 3.0 * r * r; }
};

int main() {
    vector<unique_ptr<Shape>> shapes;
    for (double r : {1.0, 2.0}) {
        {{1}}
    }
    double total = 0;
    for (const auto& s : shapes) total += s->area();
    cout << "Total: " << total << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "shapes.push_back(make_unique<Circle>(r));",
                "shapes.push_back(std::make_unique<Circle>(r));",
                "shapes.emplace_back(make_unique<Circle>(r));",
                "shapes.emplace_back(std::make_unique<Circle>(r));"
              ],
              width: 46,
            },
          ],
          expectedOutput: "Total: 15",
          hint: "push_back onto shapes the result of make_unique<Circle>(r).",
          successMessage: "No new, no delete, correct polymorphism, and a virtual destructor in the base. Modern C++.",
        },
      },
      {
        id: "a-cp-revision-plan",
        title: "Your revision plan",
        explain:
          "Revise by doing, not rereading. For each phase: redo two predict-the-output practices without looking, rebuild one mini-project from a blank file, and re-take the lesson checks you found hardest. Spend the most time on the phase where you are weakest, because the exam requires 50% in every section. The night before, rest; the exam rewards careful reading more than speed.",
        decision: {
          scenario: "A learner scores 90% on practice questions about classes and STL, but only 40% on pointers and memory. The exam is in three days.",
          question: "How should they spend their revision time?",
          options: [
            {
              id: "a",
              text: "Mostly on pointers, references and memory (Week 8 and Week 14), redoing the practices and the mini-project, because a section below 50% fails the exam regardless of the total",
              why: "The per-section minimum means the weakest area decides the result. Raising 40% to 70% matters far more than raising 90% to 95%.",
            },
            {
              id: "b",
              text: "On classes and the STL, to make the strong area even stronger",
              whyWrong: "A higher score there cannot make up for failing the memory section.",
            },
            {
              id: "c",
              text: "Reread every lesson once, quickly",
              whyWrong: "Passive rereading feels productive but builds little skill; practise the weak area instead.",
            },
            {
              id: "d",
              text: "Memorise the answers to the practice questions",
              whyWrong: "The exam draws different questions; understanding transfers, memorised answers do not.",
            },
          ],
          correct: "a",
          aftermath: "Find your weakest phase, and practise it until it is no longer the weakest.",
        },
      },
    ],

    task: {
      title: "Capstone project: plan, build, test, document, present",
      intro:
        "Build one of the four capstone projects (A: Banking Management System, recommended; B: Student Records Management System; C: Inventory and Sales System; D: Tic-Tac-Toe or Quiz Game), and deliver everything below. It must combine several parts of the course; it must not reproduce a tutorial.",
      prompts: [
        "Plan: a written list of must-have and nice-to-have requirements, a UML class diagram, the file layout and the data file format, all before the first line of code.",
        "Build: classes with private data and validated operations, STL containers, file persistence that survives restarting, and exceptions for impossible operations, all in header and source files.",
        "Make it robust: every input validated, a missing or corrupt data file handled, and no way to crash the program from the keyboard.",
        "Test: a test program with a named test for every must-have requirement, including boundary and invalid inputs, that reports PASS or FAIL and returns non-zero on failure.",
        "Engineer it: build with CMake and -Wall -Wextra with no warnings, use modern C++ (no raw new or delete), and keep the work in Git with small, clearly described commits.",
        "Document: a README with features, build and run instructions, an example session, the design and its reasons, testing, limitations and future work.",
        "Present: about ten minutes, demonstrating the program (including an error being handled), the tests passing, one design decision and one bug you found and fixed.",
      ],
      closing:
        "When your capstone is complete and every lesson is passed, the certification exam unlocks. Well done: you have gone from \"what is a program?\" to designing, building and defending a C++ application of your own.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
