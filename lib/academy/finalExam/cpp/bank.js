/**
 * EXAM BANK — C++ PROGRAMMING
 *
 * SERVER ONLY. Every item carries its answer. Nothing in src/ may import this.
 *
 * Difficulty 3–4 is "core", 5 is "advanced", per ../blueprint.js. Each domain
 * holds 8 core and 4 advanced items: twice what one paper draws, so no two
 * candidates sit the same set. Every `predict` item is compiled with g++ and
 * run by validateContent.mjs and must print exactly its `expectedOutput`.
 */

const C = String.raw;
const mcq = (o) => ({ type: "mcq", ...o });
const predict = (o) => ({ type: "predict", language: "cpp", ...o });

export const ITEMS = [
  /* ═══════════════ c1 · FOUNDATIONS ═══════════════ */
  mcq({
    id: "x-c1-001", domain: "c1-foundations", difficulty: 3, topic: "cp-compiler-role",
    skill: "Source code, compilers and executables",
    prompt: "You edit hello.cpp and run the existing hello.exe again without recompiling. What do you see?",
    options: [
      { id: "a", text: "The old behaviour: the executable was built from the previous source" },
      { id: "b", text: "The new behaviour: the executable reads the source each time" },
      { id: "c", text: "A compilation error" },
      { id: "d", text: "Nothing at all" },
    ],
    correct: "a",
    explanation: "C++ is compiled ahead of time; a changed source must be compiled again to change the executable.",
  }),
  predict({
    id: "x-c1-002", domain: "c1-foundations", difficulty: 3, topic: "cp-cout-newlines",
    skill: "cout and new lines",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    cout << "A";
    cout << "B\n";
    cout << "C" << "\n";
}`,
    lines: 2,
    expectedOutput: "AB\nC",
    explanation: "A new line starts only where \\n is printed, so A and B share the first line.",
  }),
  predict({
    id: "x-c1-003", domain: "c1-foundations", difficulty: 3, topic: "cp-int-division",
    skill: "Integer division and remainder",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int seconds = 3725;
    cout << seconds / 3600 << " " << seconds % 3600 / 60 << " " << seconds % 60 << "\n";
}`,
    lines: 1,
    expectedOutput: "1 2 5",
    explanation: "3725 is 1 hour (3600), leaving 125 seconds: 2 minutes and 5 seconds.",
  }),
  predict({
    id: "x-c1-004", domain: "c1-foundations", difficulty: 4, topic: "cp-cast-average",
    skill: "static_cast and averages",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int total = 245, count = 2;
    cout << total / count << " " << static_cast<double>(total) / count << "\n";
}`,
    lines: 1,
    expectedOutput: "122 122.5",
    explanation: "Two ints give integer division; casting one to double first keeps the .5.",
  }),
  mcq({
    id: "x-c1-005", domain: "c1-foundations", difficulty: 3, topic: "cp-type-choice",
    skill: "Choosing a type",
    prompt: "Which type should store a student's phone number such as 08031234567?",
    options: [
      { id: "a", text: "string" },
      { id: "b", text: "int" },
      { id: "c", text: "double" },
      { id: "d", text: "char" },
    ],
    correct: "a",
    explanation: "It is an identifier, not a quantity: as a number it would lose the leading 0 (and it is too large for an int).",
  }),
  predict({
    id: "x-c1-006", domain: "c1-foundations", difficulty: 4, topic: "cp-else-if-order",
    skill: "else if ladders",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int s = 72;
    if (s >= 50) cout << "C";
    else if (s >= 70) cout << "A";
    else cout << "F";
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "C",
    explanation: "The first true condition wins; s >= 50 is checked first, so the A branch is never reached.",
  }),
  predict({
    id: "x-c1-007", domain: "c1-foundations", difficulty: 4, topic: "cp-loop-trace",
    skill: "Tracing a loop",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int total = 0;
    for (int i = 1; i <= 10; i += 3) {
        total += i;
    }
    cout << total << "\n";
}`,
    lines: 1,
    expectedOutput: "22",
    explanation: "i takes 1, 4, 7 and 10; their sum is 22.",
  }),
  mcq({
    id: "x-c1-008", domain: "c1-foundations", difficulty: 4, topic: "cp-assign-vs-compare",
    skill: "= versus ==",
    prompt: "int pin = 0;\nif (pin = 1234) cout << \"Granted\";\n\nWhat happens?",
    options: [
      { id: "a", text: "Granted is printed: = stores 1234, which counts as true" },
      { id: "b", text: "Nothing is printed, because pin is 0" },
      { id: "c", text: "A compilation error" },
      { id: "d", text: "It compares pin with 1234 correctly" },
    ],
    correct: "a",
    explanation: "A single = is assignment; the condition's value is 1234, which is non-zero. Comparison needs ==.",
  }),
  predict({
    id: "x-c1-009", domain: "c1-foundations", difficulty: 5, topic: "cp-switch-fallthrough",
    compileWarning: "this statement may fall through",
    skill: "switch fall-through",
    prompt: "What does this program print? (g++ -Wextra warns about it, but it compiles.)",
    code: C`#include <iostream>
using namespace std;
int main() {
    int n = 2;
    switch (n) {
        case 1: cout << "one ";
        case 2: cout << "two ";
        case 3: cout << "three ";
            break;
        default: cout << "other ";
    }
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "two three",
    explanation: "Execution jumps to case 2 and falls through into case 3 until the break.",
  }),
  predict({
    id: "x-c1-010", domain: "c1-foundations", difficulty: 5, topic: "cp-increment-forms",
    skill: "Prefix and postfix ++",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int x = 5;
    int a = x++;
    int b = ++x;
    cout << x << " " << a << " " << b << "\n";
}`,
    lines: 1,
    expectedOutput: "7 5 7",
    explanation: "x++ hands over the old value (5); ++x increments first and hands over 7.",
  }),
  predict({
    id: "x-c1-011", domain: "c1-foundations", difficulty: 5, topic: "cp-mixed-conversion",
    skill: "Conversion inside expressions",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    cout << 7 / 2 * 2.0 << " " << 7 * 2.0 / 2 << " " << 2 / 3 * 9 << "\n";
}`,
    lines: 1,
    expectedOutput: "6 7 0",
    explanation: "Conversion happens operator by operator: 7 / 2 is 3 before 2.0 appears; 2 / 3 is 0.",
  }),
  mcq({
    id: "x-c1-012", domain: "c1-foundations", difficulty: 5, topic: "cp-chained-comparison",
    skill: "Chained comparisons",
    prompt: "For int age = 90;, what is the value of (18 <= age <= 65)?",
    options: [
      { id: "a", text: "true, because (18 <= age) gives 1, and 1 <= 65" },
      { id: "b", text: "false, because 90 is above 65" },
      { id: "c", text: "It does not compile" },
      { id: "d", text: "90" },
    ],
    correct: "a",
    explanation: "C++ evaluates one comparison at a time. The correct check is age >= 18 && age <= 65.",
  }),

  /* ═══════════════ c2 · CORE SKILLS ═══════════════ */
  predict({
    id: "x-c2-001", domain: "c2-core", difficulty: 3, topic: "cp-pass-by-value",
    compileWarning: "set but not used",
    skill: "Pass-by-value",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
void bonus(int score) { score += 10; }
int main() {
    int s = 60;
    bonus(s);
    cout << s << "\n";
}`,
    lines: 1,
    expectedOutput: "60",
    explanation: "score is a copy; the caller's variable is unchanged.",
  }),
  predict({
    id: "x-c2-002", domain: "c2-core", difficulty: 3, topic: "cp-pass-by-reference",
    skill: "Pass-by-reference",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
void swapValues(int& a, int& b) { int t = a; a = b; b = t; }
int main() {
    int x = 4, y = 9;
    swapValues(x, y);
    cout << x << " " << y << "\n";
}`,
    lines: 1,
    expectedOutput: "9 4",
    explanation: "References refer to the caller's variables, so the swap is real.",
  }),
  mcq({
    id: "x-c2-003", domain: "c2-core", difficulty: 3, topic: "cp-prototype-linker",
    skill: "Declarations and definitions",
    prompt: "A program declares int tax(int); and calls it, but never defines tax. What happens?",
    options: [
      { id: "a", text: "It compiles, then the linker reports an undefined reference" },
      { id: "b", text: "It runs and tax returns 0" },
      { id: "c", text: "The compiler writes tax automatically" },
      { id: "d", text: "It crashes when tax is called" },
    ],
    correct: "a",
    explanation: "The declaration satisfies the compiler; the linker cannot find any code for the call.",
  }),
  predict({
    id: "x-c2-004", domain: "c2-core", difficulty: 4, topic: "cp-overload-choice",
    skill: "Function overloading",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
void show(int)    { cout << "int "; }
void show(double) { cout << "double "; }
int main() {
    show(5 / 2);
    show(5 / 2.0);
    show('A' + 1);
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "int double int",
    explanation: "5 / 2 is an int; 5 / 2.0 is a double; 'A' + 1 is promoted to int.",
  }),
  predict({
    id: "x-c2-005", domain: "c2-core", difficulty: 3, topic: "cp-vector-ops",
    skill: "Vector operations",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> v = {3, 6, 9};
    v.push_back(12);
    v.pop_back();
    v.push_back(15);
    cout << v.size() << " " << v.back() << " " << v[1] << "\n";
}`,
    lines: 1,
    expectedOutput: "4 15 6",
    explanation: "{3,6,9} → {3,6,9,12} → {3,6,9} → {3,6,9,15}.",
  }),
  mcq({
    id: "x-c2-006", domain: "c2-core", difficulty: 4, topic: "cp-array-bounds",
    skill: "Array bounds",
    prompt: "int a[4] = {1, 2, 3, 4}; What is true of a[4]?",
    options: [
      { id: "a", text: "It is past the end: undefined behaviour, and the compiler usually does not stop you" },
      { id: "b", text: "It is 4, the last element" },
      { id: "c", text: "It is always 0" },
      { id: "d", text: "It throws out_of_range" },
    ],
    correct: "a",
    explanation: "Valid indexes are 0 to 3. Built-in arrays do no bounds checking; only vector::at throws.",
  }),
  predict({
    id: "x-c2-007", domain: "c2-core", difficulty: 4, topic: "cp-string-substr",
    skill: "find and substr",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <string>
using namespace std;
int main() {
    string email = "tunde@school.ng";
    size_t at = email.find('@');
    cout << email.substr(0, at) << " " << email.substr(at + 1, 6) << "\n";
}`,
    lines: 1,
    expectedOutput: "tunde school",
    explanation: "@ is at index 5: the user is the 5 characters before it, then 6 characters after it.",
  }),
  mcq({
    id: "x-c2-008", domain: "c2-core", difficulty: 4, topic: "cp-getline-skip",
    skill: "The input buffer",
    prompt: "After cin >> age;, a getline(cin, name); reads an empty line without waiting. Why?",
    options: [
      { id: "a", text: "cin >> left the newline from Enter in the buffer, and getline read up to it" },
      { id: "b", text: "getline cannot follow cin" },
      { id: "c", text: "name must be a char array" },
      { id: "d", text: "The user typed too fast" },
    ],
    correct: "a",
    explanation: "Discard the leftover line with ignore(), or use getline(cin >> ws, name).",
  }),
  predict({
    id: "x-c2-009", domain: "c2-core", difficulty: 5, topic: "cp-recursion-trace",
    skill: "Tracing recursion",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
void f(int n) {
    if (n == 0) return;
    cout << n << " ";
    f(n - 1);
    cout << n << " ";
}
int main() {
    f(3);
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "3 2 1 1 2 3",
    explanation: "Lines before the call print on the way down; lines after it print on the way back up, most recent call first.",
  }),
  predict({
    id: "x-c2-010", domain: "c2-core", difficulty: 5, topic: "cp-scope-shadow",
    skill: "Local and global scope",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int count = 10;
void add() { count += 5; }
int main() {
    int count = 1;
    add();
    cout << count << " " << ::count << "\n";
}`,
    lines: 1,
    expectedOutput: "1 15",
    explanation: "main's local count hides the global; add() changes the global, reached with ::count.",
  }),
  predict({
    id: "x-c2-011", domain: "c2-core", difficulty: 5, topic: "cp-2d-totals",
    skill: "Two-dimensional arrays",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int col = 0;
    for (int r = 0; r < 2; r++) col += m[r][1];
    cout << col << " " << m[1][2] - m[0][0] << "\n";
}`,
    lines: 1,
    expectedOutput: "7 5",
    explanation: "Column 1 holds 2 and 5; m[1][2] is 6 and m[0][0] is 1.",
  }),
  mcq({
    id: "x-c2-012", domain: "c2-core", difficulty: 5, topic: "cp-vector-param",
    skill: "Passing collections",
    prompt: "A function must read a vector of 100,000 records without changing it. Which parameter is best?",
    options: [
      { id: "a", text: "const vector<Record>& records" },
      { id: "b", text: "vector<Record> records" },
      { id: "c", text: "vector<Record>& records" },
      { id: "d", text: "Record records[]" },
    ],
    correct: "a",
    explanation: "A const reference avoids copying 100,000 records and forbids accidental changes.",
  }),

  /* ═══════════════ c3 · MEMORY & OOP ═══════════════ */
  predict({
    id: "x-c3-001", domain: "c3-objects", difficulty: 3, topic: "cp-pointer-deref",
    skill: "Dereferencing pointers",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int a = 10;
    int* p = &a;
    *p += 5;
    cout << a << " " << *p << "\n";
}`,
    lines: 1,
    expectedOutput: "15 15",
    explanation: "p holds a's address, so *p += 5 changes a itself.",
  }),
  mcq({
    id: "x-c3-002", domain: "c3-objects", difficulty: 3, topic: "cp-nullptr-check",
    skill: "nullptr",
    prompt: "What should a function do before dereferencing a pointer parameter that may be nullptr?",
    options: [
      { id: "a", text: "Check if (p != nullptr)" },
      { id: "b", text: "Nothing; dereferencing nullptr returns 0" },
      { id: "c", text: "Call delete p" },
      { id: "d", text: "Cast it to an int" },
    ],
    correct: "a",
    explanation: "Dereferencing nullptr is undefined behaviour, usually a crash.",
  }),
  predict({
    id: "x-c3-003", domain: "c3-objects", difficulty: 4, topic: "cp-pointer-arith",
    skill: "Pointer arithmetic",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int a[] = {5, 10, 15, 20};
    int* p = a + 1;
    cout << *(p + 2) << " " << p[0] << " " << (a + 3) - p << "\n";
}`,
    lines: 1,
    expectedOutput: "20 10 2",
    explanation: "p points at index 1; p + 2 is index 3; pointer subtraction counts elements.",
  }),
  mcq({
    id: "x-c3-004", domain: "c3-objects", difficulty: 4, topic: "cp-heap-vs-stack",
    skill: "Stack and heap",
    prompt: "Data whose size is only known at run time, and which must outlive the function that creates it, belongs...",
    options: [
      { id: "a", text: "On the heap, for example inside a vector" },
      { id: "b", text: "In a local array on the stack" },
      { id: "c", text: "In a register" },
      { id: "d", text: "In a constexpr variable" },
    ],
    correct: "a",
    explanation: "Stack data ends with its function and needs a compile-time size; the heap has neither limit.",
  }),
  predict({
    id: "x-c3-005", domain: "c3-objects", difficulty: 3, topic: "cp-encapsulation-setter",
    skill: "Encapsulation",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
class Account {
    double balance = 0;
public:
    bool withdraw(double a) {
        if (a <= 0 || a > balance) return false;
        balance -= a;
        return true;
    }
    void deposit(double a) { if (a > 0) balance += a; }
    double get() const { return balance; }
};
int main() {
    Account acc;
    acc.deposit(1000);
    acc.deposit(-200);
    cout << acc.withdraw(1500) << acc.withdraw(400) << " " << acc.get() << "\n";
}`,
    lines: 1,
    expectedOutput: "01 600",
    explanation: "The negative deposit and the overdraft are both refused by the class itself; bools print as 0 and 1.",
  }),
  predict({
    id: "x-c3-006", domain: "c3-objects", difficulty: 4, topic: "cp-static-member",
    skill: "Static members",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
class Ticket {
public:
    inline static int sold = 0;
    int number;
    Ticket() { sold++; number = sold; }
};
int main() {
    Ticket a, b, c;
    cout << b.number << " " << Ticket::sold << "\n";
}`,
    lines: 1,
    expectedOutput: "2 3",
    explanation: "One shared counter: b was the second ticket, and three were created.",
  }),
  predict({
    id: "x-c3-007", domain: "c3-objects", difficulty: 4, topic: "cp-ctor-dtor-order",
    skill: "Construction and destruction order",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
struct Base {
    Base() { cout << "B"; }
    ~Base() { cout << "b"; }
};
struct Derived : Base {
    Derived() { cout << "D"; }
    ~Derived() { cout << "d"; }
};
int main() {
    { Derived x; }
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "BDdb",
    explanation: "Built from the base up; destroyed from the derived part down.",
  }),
  mcq({
    id: "x-c3-008", domain: "c3-objects", difficulty: 3, topic: "cp-composition-choice",
    skill: "Composition versus inheritance",
    prompt: "A Library keeps many Book objects. Which design fits?",
    options: [
      { id: "a", text: "Library has a vector<Book> member (composition)" },
      { id: "b", text: "class Library : public Book" },
      { id: "c", text: "class Book : public Library" },
      { id: "d", text: "A global array of books" },
    ],
    correct: "a",
    explanation: "A library HAS books; it is not a book. Has-a means composition.",
  }),
  predict({
    id: "x-c3-009", domain: "c3-objects", difficulty: 5, topic: "cp-virtual-dispatch",
    skill: "Virtual functions",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
struct Animal {
    virtual void speak() const { cout << "..."; }
    void name() const { cout << "Animal"; }
    virtual ~Animal() = default;
};
struct Dog : Animal {
    void speak() const override { cout << "Woof"; }
    void name() const { cout << "Dog"; }
};
int main() {
    Dog d;
    const Animal& a = d;
    a.speak();
    cout << " ";
    a.name();
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "Woof Animal",
    explanation: "speak is virtual, so the real type (Dog) decides; name is not, so the reference type (Animal) decides.",
  }),
  predict({
    id: "x-c3-010", domain: "c3-objects", difficulty: 5, topic: "cp-reference-rebind",
    skill: "References versus pointers",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    int x = 1, y = 2;
    int& r = x;
    int* p = &x;
    r = y;
    p = &y;
    *p = 9;
    cout << x << " " << y << "\n";
}`,
    lines: 1,
    expectedOutput: "2 9",
    explanation: "r = y assigns y's value to x (a reference cannot be re-bound); p is re-aimed at y.",
  }),
  mcq({
    id: "x-c3-011", domain: "c3-objects", difficulty: 5, topic: "cp-virtual-destructor",
    skill: "Virtual destructors",
    prompt: "Base has virtual functions but a non-virtual destructor. Base* p = new Derived; delete p; What is the result?",
    options: [
      { id: "a", text: "Undefined behaviour: typically only ~Base runs and Derived's resources leak" },
      { id: "b", text: "Both destructors run correctly" },
      { id: "c", text: "A compilation error" },
      { id: "d", text: "Only ~Derived runs" },
    ],
    correct: "a",
    explanation: "Deleting through a base pointer requires a virtual destructor in the base.",
  }),
  mcq({
    id: "x-c3-012", domain: "c3-objects", difficulty: 5, topic: "cp-dangling-local",
    skill: "Dangling pointers",
    prompt: "int* make() { int v = 7; return &v; } What is wrong with using the returned pointer?",
    options: [
      { id: "a", text: "v is destroyed when make returns, so the pointer dangles: undefined behaviour" },
      { id: "b", text: "Nothing; it always reads 7" },
      { id: "c", text: "It leaks memory" },
      { id: "d", text: "Functions cannot return pointers" },
    ],
    correct: "a",
    explanation: "A local lives on the stack until its function returns; its address is invalid afterwards.",
  }),

  /* ═══════════════ c4 · ADVANCED TOOLS ═══════════════ */
  predict({
    id: "x-c4-001", domain: "c4-tools", difficulty: 3, topic: "cp-try-catch-flow",
    skill: "try, throw and catch",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <stdexcept>
using namespace std;
int main() {
    try {
        cout << "1";
        throw runtime_error("x");
        cout << "2";
    } catch (const exception&) {
        cout << "3";
    }
    cout << "4\n";
}`,
    lines: 1,
    expectedOutput: "134",
    explanation: "The throw skips the rest of the try block; after the catch, execution continues.",
  }),
  mcq({
    id: "x-c4-002", domain: "c4-tools", difficulty: 3, topic: "cp-append-mode",
    skill: "Appending to files",
    prompt: "log.txt holds 50 lines. ofstream f(\"log.txt\"); f << \"new\\n\"; How many lines does it hold afterwards?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "51" },
      { id: "c", text: "50" },
      { id: "d", text: "0" },
    ],
    correct: "a",
    explanation: "Without ios::app, opening an ofstream empties the file first.",
  }),
  mcq({
    id: "x-c4-003", domain: "c4-tools", difficulty: 4, topic: "cp-file-open-check",
    skill: "File-open failures",
    prompt: "What happens when a program reads from an ifstream whose file failed to open, without checking?",
    options: [
      { id: "a", text: "The reads silently fail, as if the file were empty" },
      { id: "b", text: "The program crashes immediately" },
      { id: "c", text: "The file is created" },
      { id: "d", text: "The compiler reports an error" },
    ],
    correct: "a",
    explanation: "A failed stream stays quiet; check if (!in) straight after opening.",
  }),
  predict({
    id: "x-c4-004", domain: "c4-tools", difficulty: 4, topic: "cp-map-count",
    skill: "map",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <map>
#include <string>
using namespace std;
int main() {
    map<string, int> votes;
    for (string v : {"Obi", "Ada", "Obi", "Kemi", "Obi"}) votes[v]++;
    for (const auto& [name, n] : votes) cout << name << n << " ";
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "Ada1 Kemi1 Obi3",
    explanation: "votes[v]++ counts each name; a map iterates in key order.",
  }),
  predict({
    id: "x-c4-005", domain: "c4-tools", difficulty: 3, topic: "cp-set-unique",
    skill: "set",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <set>
using namespace std;
int main() {
    set<int> s = {7, 2, 7, 5, 2};
    s.insert(1);
    for (int x : s) cout << x;
    cout << " " << s.size() << "\n";
}`,
    lines: 1,
    expectedOutput: "1257 4",
    explanation: "A set keeps unique values in ascending order.",
  }),
  predict({
    id: "x-c4-006", domain: "c4-tools", difficulty: 4, topic: "cp-sort-lambda",
    skill: "Algorithms and lambdas",
    prompt: "What does this program print?",
    code: C`#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> v = {40, 15, 70, 55};
    sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
    auto n = count_if(v.begin(), v.end(), [](int x) { return x >= 50; });
    cout << v[0] << " " << v[3] << " " << n << "\n";
}`,
    lines: 1,
    expectedOutput: "70 15 2",
    explanation: "The comparison sorts descending; two values are at least 50.",
  }),
  mcq({
    id: "x-c4-007", domain: "c4-tools", difficulty: 3, topic: "cp-binary-search-req",
    skill: "Binary search",
    prompt: "What must be true of data before binary search can be used on it?",
    options: [
      { id: "a", text: "It must be sorted" },
      { id: "b", text: "It must be in a linked list" },
      { id: "c", text: "It must have fewer than 1,000 items" },
      { id: "d", text: "It must contain no duplicates" },
    ],
    correct: "a",
    explanation: "Halving only works if the middle element tells you which half holds the target.",
  }),
  mcq({
    id: "x-c4-008", domain: "c4-tools", difficulty: 4, topic: "cp-big-o-growth",
    skill: "Big O",
    prompt: "An O(n²) algorithm takes 1 second for 10,000 items. Roughly how long for 100,000?",
    options: [
      { id: "a", text: "About 100 seconds" },
      { id: "b", text: "About 10 seconds" },
      { id: "c", text: "About 1 second" },
      { id: "d", text: "About 2 seconds" },
    ],
    correct: "a",
    explanation: "10 times the data means 10² = 100 times the work.",
  }),
  predict({
    id: "x-c4-009", domain: "c4-tools", difficulty: 5, topic: "cp-exception-types",
    skill: "Standard exception classes",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std;
void test(const string& text, int i) {
    vector<int> v = {10, 20};
    try {
        int n = stoi(text);
        cout << v.at(i) + n << " ";
    } catch (const out_of_range&) {
        cout << "range ";
    } catch (const invalid_argument&) {
        cout << "text ";
    }
}
int main() {
    test("5", 1);
    test("x", 0);
    test("5", 2);
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "25 text range",
    explanation: "stoi throws invalid_argument for \"x\"; at(2) throws out_of_range.",
  }),
  predict({
    id: "x-c4-010", domain: "c4-tools", difficulty: 5, topic: "cp-stack-queue-order",
    skill: "stack and queue",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <queue>
#include <stack>
using namespace std;
int main() {
    stack<int> s;
    queue<int> q;
    for (int i = 1; i <= 3; i++) { s.push(i); q.push(i); }
    s.pop();
    q.pop();
    cout << s.top() << " " << q.front() << " " << s.size() + q.size() << "\n";
}`,
    lines: 1,
    expectedOutput: "2 2 4",
    explanation: "The stack removes 3 (last in), the queue removes 1 (first in); 2 + 2 elements remain.",
  }),
  mcq({
    id: "x-c4-011", domain: "c4-tools", difficulty: 5, topic: "cp-map-bracket-insert",
    skill: "map look-ups",
    prompt: "map<string, int> m; cout << m[\"k\"] << m.size(); What is printed?",
    options: [
      { id: "a", text: "01: [] inserted \"k\" with a default value" },
      { id: "b", text: "00" },
      { id: "c", text: "An exception is thrown" },
      { id: "d", text: "It does not compile" },
    ],
    correct: "a",
    explanation: "Reading a missing key with [] inserts it; use count or find to check without inserting.",
  }),
  mcq({
    id: "x-c4-012", domain: "c4-tools", difficulty: 5, topic: "cp-container-choice",
    skill: "Choosing a container",
    prompt: "200,000 products must be found instantly by code; order never matters. Which container?",
    options: [
      { id: "a", text: "unordered_map keyed by code" },
      { id: "b", text: "vector searched with a loop" },
      { id: "c", text: "list" },
      { id: "d", text: "stack" },
    ],
    correct: "a",
    explanation: "A hash table gives O(1) average look-up when order is not needed.",
  }),

  /* ═══════════════ c5 · PROFESSIONAL PRACTICE ═══════════════ */
  predict({
    id: "x-c5-001", domain: "c5-professional", difficulty: 3, topic: "cp-auto-types",
    skill: "auto",
    prompt: "What does this program print?",
    code: C`#include <iostream>
using namespace std;
int main() {
    auto a = 9 / 2;
    auto b = 9 / 2.0;
    cout << a << " " << b << " " << sizeof(a) << "\n";
}`,
    lines: 1,
    expectedOutput: "4 4.5 4",
    explanation: "auto takes the initialiser's type: int (4 bytes) for 9 / 2, double for 9 / 2.0.",
  }),
  predict({
    id: "x-c5-002", domain: "c5-professional", difficulty: 3, topic: "cp-range-for-ref",
    compileWarning: "set but not used",
    skill: "Range-based for with references",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> v = {1, 2, 3};
    for (auto x : v) x *= 10;
    for (auto& x : v) x += 1;
    cout << v[0] << v[1] << v[2] << "\n";
}`,
    lines: 1,
    expectedOutput: "234",
    explanation: "The first loop changes copies; only the reference loop changes the vector.",
  }),
  mcq({
    id: "x-c5-003", domain: "c5-professional", difficulty: 3, topic: "cp-unique-ptr",
    skill: "Smart pointers",
    prompt: "What does unique_ptr guarantee?",
    options: [
      { id: "a", text: "Exactly one owner, and the object is deleted automatically when that owner goes away" },
      { id: "b", text: "The object can be copied freely" },
      { id: "c", text: "The object is never deleted" },
      { id: "d", text: "The object lives on the stack" },
    ],
    correct: "a",
    explanation: "unique_ptr cannot be copied, only moved, and deletes its object in its destructor.",
  }),
  predict({
    id: "x-c5-004", domain: "c5-professional", difficulty: 4, topic: "cp-raii-unwinding",
    skill: "RAII",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <stdexcept>
using namespace std;
struct Guard {
    Guard() { cout << "open "; }
    ~Guard() { cout << "close "; }
};
void work() {
    Guard g;
    throw runtime_error("fail");
}
int main() {
    try { work(); } catch (const exception&) { cout << "caught"; }
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "open close caught",
    explanation: "The destructor runs as the exception leaves work, before the catch block.",
  }),
  predict({
    id: "x-c5-005", domain: "c5-professional", difficulty: 4, topic: "cp-optional-value",
    skill: "optional",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <optional>
using namespace std;
optional<int> half(int n) {
    if (n % 2 != 0) return nullopt;
    return n / 2;
}
int main() {
    cout << half(10).value_or(-1) << " " << half(7).value_or(-1) << " "
              << half(0).has_value() << "\n";
}`,
    lines: 1,
    expectedOutput: "5 -1 1",
    explanation: "7 is odd, so no value; 0 is even, so half(0) holds 0 and has_value() is true (printed as 1).",
  }),
  mcq({
    id: "x-c5-006", domain: "c5-professional", difficulty: 3, topic: "cp-test-boundaries",
    skill: "Designing test cases",
    prompt: "Free delivery applies from 10,000 naira. Which test amounts best catch a > written instead of >=?",
    options: [
      { id: "a", text: "9,999, 10,000 and 10,001" },
      { id: "b", text: "5,000 and 50,000" },
      { id: "c", text: "Only 20,000" },
      { id: "d", text: "Random amounts" },
    ],
    correct: "a",
    explanation: "Only the value exactly on the boundary distinguishes > from >=.",
  }),
  mcq({
    id: "x-c5-007", domain: "c5-professional", difficulty: 4, topic: "cp-header-guard",
    skill: "Header guards",
    prompt: "What do #ifndef / #define / #endif guards (or #pragma once) prevent?",
    options: [
      { id: "a", text: "A header's contents being defined twice when it is included more than once" },
      { id: "b", text: "The program running too slowly" },
      { id: "c", text: "Missing semicolons" },
      { id: "d", text: "Linker errors from missing definitions" },
    ],
    correct: "a",
    explanation: "The second inclusion is skipped because the guard macro is already defined.",
  }),
  mcq({
    id: "x-c5-008", domain: "c5-professional", difficulty: 4, topic: "cp-const-ref-call",
    skill: "Const correctness",
    prompt: "void show(const Account& a) { a.deposit(10); } fails to compile. Why?",
    options: [
      { id: "a", text: "Through a const reference only const member functions can be called, and deposit modifies the object" },
      { id: "b", text: "References cannot be function parameters" },
      { id: "c", text: "deposit is private" },
      { id: "d", text: "show must return a value" },
    ],
    correct: "a",
    explanation: "const promises the function will not change a, and the compiler enforces that promise.",
  }),
  predict({
    id: "x-c5-009", domain: "c5-professional", difficulty: 5, topic: "cp-copy-vs-move",
    skill: "Copy and move operations",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <utility>
using namespace std;
struct T {
    T() = default;
    T(const T&) { cout << "C"; }
    T(T&&) noexcept { cout << "M"; }
    T& operator=(const T&) { cout << "c"; return *this; }
    T& operator=(T&&) noexcept { cout << "m"; return *this; }
};
int main() {
    T a;
    T b = a;
    T c = move(a);
    b = c;
    c = move(b);
    cout << "\n";
}`,
    lines: 1,
    expectedOutput: "CMcm",
    explanation: "Creating uses constructors (C, M); overwriting existing objects uses assignment (c, m); move selects the move versions.",
  }),
  predict({
    id: "x-c5-010", domain: "c5-professional", difficulty: 5, topic: "cp-shared-ptr-count",
    skill: "shared_ptr ownership",
    prompt: "What does this program print?",
    code: C`#include <iostream>
#include <memory>
using namespace std;
int main() {
    auto a = make_shared<int>(5);
    auto b = a;
    {
        auto c = b;
        cout << a.use_count() << " ";
    }
    b.reset();
    cout << a.use_count() << " " << *a << "\n";
}`,
    lines: 1,
    expectedOutput: "3 1 5",
    explanation: "Three owners inside the block; c's scope ends and b is reset, leaving a as the only owner.",
  }),
  mcq({
    id: "x-c5-011", domain: "c5-professional", difficulty: 5, topic: "cp-secure-overflow",
    skill: "Secure coding",
    prompt: "A payment system multiplies two user-supplied ints without checking. Why is that a security risk?",
    options: [
      { id: "a", text: "Signed integer overflow is undefined behaviour and can produce wrong, exploitable amounts" },
      { id: "b", text: "Multiplication is slow" },
      { id: "c", text: "ints cannot be multiplied" },
      { id: "d", text: "There is no risk" },
    ],
    correct: "a",
    explanation: "Check against numeric_limits before multiplying untrusted values.",
  }),
  mcq({
    id: "x-c5-012", domain: "c5-professional", difficulty: 5, topic: "cp-debug-first-move",
    skill: "Debugging a logic error",
    prompt: "A program compiles cleanly and runs, but pays every employee 10% too little. What is the best first move?",
    options: [
      { id: "a", text: "Work out one case by hand, then step through with the debugger to find the first value that differs" },
      { id: "b", text: "Recompile with a different compiler" },
      { id: "c", text: "Wrap main in try/catch" },
      { id: "d", text: "Rewrite the program from scratch" },
    ],
    correct: "a",
    explanation: "A logic error has no message; comparing against a known-correct case and finding the first divergence locates it.",
  }),
];

export default ITEMS;
