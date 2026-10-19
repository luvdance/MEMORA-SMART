/**
 * C++ PROGRAMMING · MODULE 14 · MODERN C++ AND RESOURCE MANAGEMENT
 *
 * Curriculum 14.1 – 14.13. Practices that make C++ safer, cleaner and more
 * maintainable. Every program is compiled and run by `npm run
 * validate:content`: C++17 throughout, except the C++20 ranges program,
 * which is compiled with -std=c++20 (`std: "c++20"`). The content of a
 * moved-from object is "valid but unspecified", so no program here prints
 * one: only what the standard guarantees is shown as output.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s14-modern";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 14.1 – 14.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l58-modern-basics",
    moduleId: "cp-m14-modern",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3", "14.4"],
    title: "Modern C++ Habits",
    subtitle: "Why modern practice matters, auto, range loops and const correctness",
    estimatedMinutes: 24,
    intro:
      "C++ written in 1998 and C++ written today can look like different languages. Since C++11 the language has gained features whose whole purpose is to make the safe way also the easy way. You have already used several; this week names them, explains them, and makes them habits.",

    atoms: [
      {
        id: "a-cp-why-modern",
        title: "Why modern C++ practices matter",
        explain:
          "Most of C++'s reputation for danger comes from old habits: raw new and delete, manual sizes passed beside raw arrays, casts that silence the compiler. Modern C++ replaces each with a tool that the compiler can check: containers instead of raw arrays, smart pointers instead of delete, references and const instead of unchecked pointers, auto instead of long repeated types. The code becomes shorter AND safer, with no loss of speed.",
        table: {
          caption: "Old habits and their modern replacements.",
          headers: ["Older style", "Modern C++", "What it prevents"],
          rows: [
            ["int* a = new int[n]; ... delete[] a;", "std::vector<int> a(n);", "Leaks, double deletes, lost sizes"],
            ["Widget* w = new Widget; ... delete w;", "auto w = std::make_unique<Widget>();", "Leaks and dangling pointers"],
            ["for (int i = 0; i < n; i++) use(a[i]);", "for (const auto& x : a) use(x);", "Off-by-one errors"],
            ["(int)value", "static_cast<int>(value)", "Accidental dangerous casts"],
            ["NULL or 0 for pointers", "nullptr", "Pointer/integer confusion"],
            ["Returning -1 for \"not found\"", "std::optional", "Magic values mistaken for data"],
          ],
        },
        why: "Every replacement in this table has appeared earlier in the course, often without being named as \"modern\". This module ties them together into one consistent style for your capstone.",
      },
      {
        id: "a-cp-auto",
        title: "Type inference with auto",
        explain:
          "auto lets the compiler work out a variable's type from its initial value: auto count = 0; is an int, auto it = scores.begin(); is a std::vector<int>::iterator. The type is still fixed at compile time; auto only saves you writing it. Use it where the type is long or obvious from the right-hand side, and write the type out where it adds clarity. auto drops const and references unless you ask: write const auto& to avoid copying.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <map>
#include <string>

int main() {
    auto a = 7 / 2;
    auto b = 7 / 2.0;
    auto c = 'x';
    std::map<std::string, int> ages = {{"Ada", 19}};
    auto it = ages.find("Ada");
    std::cout << a << " " << b << " " << c << " " << it->second << "\n";
    std::cout << sizeof(a) << " " << sizeof(b) << " " << sizeof(c) << "\n";
    return 0;
}
`,
          question: "auto takes the type of the initial value. Which types do a, b and c get? What does this print?",
          expectedOutput: "3 3.5 x 19\n4 8 1",
          hint: "7 / 2 is an int expression; 7 / 2.0 is a double; 'x' is a char.",
          successMessage: "int, double, char: 4, 8 and 1 bytes. auto never changes the rules of types, it just reads them.",
        },
      },
      {
        id: "a-cp-range-loops-modern",
        title: "Range-based loops, the modern way",
        explain:
          "Combine range-based for with auto and the right kind of reference. for (const auto& x : container) reads every element without copying: the default choice. for (auto& x : container) modifies elements in place. for (auto x : container) copies each element, which is fine only for small types such as int. With a map, each element is a key-value pair, and C++17's structured bindings unpack it: for (const auto& [key, value] : m).",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> names = {"ada", "bayo"};
    for (auto& n : names) n[0] = static_cast<char>(n[0] - 'a' + 'A');
    for (const auto& n : names) std::cout << n << " ";
    std::cout << "\n";

    std::map<std::string, double> prices = {{"rice", 8500}, {"oil", 2600}};
    for (auto& [item, price] : prices) price *= 1.1;
    for (const auto& [item, price] : prices) std::cout << item << "=" << price << " ";
    std::cout << "\n";
    return 0;
}
`,
          expectedOutput: "Ada Bayo\noil=2860 rice=9350",
        },
        codeFill: {
          task: "Fill the loop header so every score is increased in place, without writing the element type.",
          code: C`#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {55, 61, 48};
    for ({{1}} : scores) {
        s += 5;
    }
    for (const auto& s : scores) std::cout << s << " ";
    std::cout << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["auto& s", "auto &s", "int& s", "int &s"] }],
          expectedOutput: "60 66 53",
          hint: "auto with the symbol that makes the loop variable refer to the real element.",
          successMessage: "auto& s. Without the &, the loop would change copies and the scores would stay the same.",
        },
      },
      {
        id: "a-cp-const-correctness",
        title: "References and const correctness",
        explain:
          "Const correctness means marking everything that should not change as const, and letting the compiler enforce it: const variables, const references for parameters that are only read (const std::string& name), and const member functions for anything that does not modify the object (double balance() const). Once a function takes a const reference, it can only call const member functions on it, so const spreads through a design and documents, in code the compiler checks, what can change what.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Account {
    double balance = 0;
public:
    void deposit(double amount) { balance += amount; }
    double getBalance() const { return balance; }
};

void report(const Account& acc) {
    std::cout << "Balance: " << acc.getBalance() << "\n";
    acc.deposit(100);
}

int main() {
    Account a;
    a.deposit(500);
    report(a);
    return 0;
}
`,
          compileError: "passing 'const Account' as 'this' argument discards qualifiers",
        },
        why: "report promised, with const Account&, only to read. Calling deposit would break that promise, so the compiler refuses. Remove that line and it compiles: getBalance is const, so reading is allowed. The message is cryptic the first time; it always means \"you tried to change something you said was const\".",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 14.5 – 14.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l59-move-raii",
    moduleId: "cp-m14-modern",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.5", "14.6", "14.7", "14.8"],
    title: "Moving, Owning and RAII",
    subtitle: "Lvalues and rvalues, std::move, unique_ptr and shared_ptr, RAII",
    estimatedMinutes: 28,
    intro:
      "Copying a vector of a million elements copies a million elements. Often the original is about to be thrown away anyway, so the copy is pure waste. Move semantics let C++ transfer the contents instead. Together with smart pointers and RAII they are the heart of how modern C++ manages resources without leaks and without waste.",

    atoms: [
      {
        id: "a-cp-lvalues-rvalues",
        title: "Lvalues and rvalues: introductory concepts",
        explain:
          "Every expression is either an lvalue or an rvalue. An lvalue has a name or a lasting location: you can take its address, and it can appear on the left of =, like score or v[2]. An rvalue is a temporary value about to disappear: 42, a + b, or the string returned by a function. The distinction matters because a temporary's contents can safely be stolen: nobody will use it again. An rvalue reference, written T&&, binds to such temporaries.",
        table: {
          caption: "Examples.",
          headers: ["Expression", "Kind", "Why"],
          rows: [
            ["score", "lvalue", "A named variable"],
            ["v[2]", "lvalue", "A lasting element with an address"],
            ["42", "rvalue", "A literal, no lasting location"],
            ["a + b", "rvalue", "A temporary result"],
            ["makeName()", "rvalue (when it returns by value)", "A temporary returned object"],
            ["std::move(name)", "rvalue", "An lvalue explicitly marked \"may be moved from\""],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

void take(const std::string&) { std::cout << "lvalue\n"; }
void take(std::string&&)      { std::cout << "rvalue\n"; }

int main() {
    std::string name = "Ada";
    take(name);
    take(name + " Lovelace");
    take(std::string("temp"));
    take(std::move(name));
    return 0;
}
`,
          question: "The compiler picks the && overload for temporaries. Which is chosen for each call?",
          expectedOutput: "lvalue\nrvalue\nrvalue\nrvalue",
          hint: "name is a named variable. name + \" Lovelace\" and std::string(\"temp\") are temporaries. std::move turns name into an rvalue.",
          successMessage: "Only the plain named variable is an lvalue. std::move does not move anything by itself: it just marks name as movable.",
        },
      },
      {
        id: "a-cp-move-semantics",
        title: "Move semantics and std::move",
        explain:
          "Moving transfers an object's resources (a vector's heap buffer, a string's characters) to another object instead of copying them: a few pointer changes instead of a full copy. C++ moves automatically from temporaries, and from local variables being returned. To move from a named variable you no longer need, wrap it in std::move. Afterwards the source is in a valid but unspecified state: you may assign to it or destroy it, but do not rely on its contents.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <utility>
#include <vector>

std::vector<int> makeBig() {
    std::vector<int> v(1000000, 7);
    return v;
}

int main() {
    std::vector<int> data = makeBig();
    std::vector<std::vector<int>> archive;
    archive.push_back(std::move(data));
    std::cout << "Archived " << archive[0].size() << " values\n";

    std::string report = "Term 1 results";
    std::string saved = std::move(report);
    report = "Term 2 results";
    std::cout << saved << " / " << report << "\n";
    return 0;
}
`,
          expectedOutput: "Archived 1000000 values\nTerm 1 results / Term 2 results",
        },
        why: "A million ints moved into the archive with no copying. report was moved from, then given a new value, which is always allowed. Printing report BETWEEN the move and the reassignment would show an unspecified value, which is why this program never does.",
        codeFill: {
          task: "names is not needed after this line. Fill the gap so its contents are moved into the vector instead of copied.",
          code: C`#include <iostream>
#include <string>
#include <utility>
#include <vector>

int main() {
    std::vector<std::string> classes;
    std::string names = "Ada,Bayo,Chi,Dayo";
    classes.push_back({{1}});
    std::cout << classes.size() << " class list stored: " << classes[0] << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["std::move(names)"] }],
          expectedOutput: "1 class list stored: Ada,Bayo,Chi,Dayo",
          hint: "Wrap the variable in the standard function that marks it as safe to move from.",
          successMessage: "std::move(names). push_back's rvalue version then steals the characters instead of copying them.",
        },
      },
      {
        id: "a-cp-smart-pointers",
        title: "Smart pointers: unique_ptr and shared_ptr",
        explain:
          "std::unique_ptr expresses sole ownership: exactly one unique_ptr owns the object, it cannot be copied, but ownership can be transferred with std::move. std::shared_ptr expresses shared ownership: copies of a shared_ptr all own the same object, a reference count tracks how many there are (use_count()), and the object is deleted when the last owner goes away. Prefer unique_ptr: it costs nothing extra over a raw pointer. Use shared_ptr only when ownership genuinely is shared.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>
#include <string>
#include <utility>

struct Document {
    std::string title;
    explicit Document(std::string t) : title(t) {}
    ~Document() { std::cout << "Deleting " << title << "\n"; }
};

int main() {
    auto draft = std::make_unique<Document>("Draft");
    auto owner = std::move(draft);
    std::cout << std::boolalpha << (draft == nullptr) << "\n";

    auto shared = std::make_shared<Document>("Timetable");
    {
        auto copy = shared;
        std::cout << "Owners: " << shared.use_count() << "\n";
    }
    std::cout << "Owners: " << shared.use_count() << "\n";
    std::cout << "End of main\n";
    return 0;
}
`,
          expectedOutput: "true\nOwners: 2\nOwners: 1\nEnd of main\nDeleting Timetable\nDeleting Draft",
        },
        why: "After the move, draft is empty and owner holds the document. When main ends, local objects are destroyed in reverse order of creation: shared (Timetable) first, then owner (Draft). No delete was written anywhere.",
      },
      {
        id: "a-cp-raii",
        title: "Resource Acquisition Is Initialization (RAII)",
        explain:
          "RAII is the central idea of C++ resource management: tie every resource (memory, an open file, a network connection, a lock) to an object, acquire it in the constructor and release it in the destructor. Because C++ always runs destructors when objects go out of scope, including when an exception is thrown, the resource can never be leaked. std::vector, std::string, std::ifstream and the smart pointers are all RAII classes; that is why you have not written a single close() or delete in a long time.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <stdexcept>
#include <string>

class Connection {
    std::string name;
public:
    explicit Connection(std::string n) : name(n) { std::cout << "Open " << name << "\n"; }
    ~Connection() { std::cout << "Close " << name << "\n"; }
};

void transfer(bool fail) {
    Connection db("database");
    if (fail) throw std::runtime_error("transfer failed");
    std::cout << "Transfer done\n";
}

int main() {
    transfer(false);
    try {
        transfer(true);
    } catch (const std::exception& e) {
        std::cout << "Caught: " << e.what() << "\n";
    }
    return 0;
}
`,
          expectedOutput: "Open database\nTransfer done\nClose database\nOpen database\nClose database\nCaught: transfer failed",
        },
        why: "Look at the second call: the exception left transfer early, yet \"Close database\" still printed BEFORE the catch ran. The destructor ran as the exception passed through. With RAII, error paths clean up exactly like normal ones.",
        codeFill: {
          task: "Complete the destructor's name so the Timer class prints its message when the object is destroyed.",
          code: C`#include <iostream>
#include <string>

class Timer {
    std::string label;
public:
    explicit Timer(std::string l) : label(l) { std::cout << "Start " << label << "\n"; }
    {{1}}() { std::cout << "Stop " << label << "\n"; }
};

int main() {
    {
        Timer t("report");
        std::cout << "Working\n";
    }
    std::cout << "After\n";
    return 0;
}
`,
          blanks: [{ answers: ["~Timer"] }],
          expectedOutput: "Start report\nWorking\nStop report\nAfter",
          hint: "A destructor is named after the class with a tilde in front.",
          successMessage: "~Timer. It ran at the closing brace of the block, automatically: that is RAII.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 14.9 – 14.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l60-copy-move",
    moduleId: "cp-m14-modern",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.9", "14.10"],
    title: "Copy and Move Operations",
    subtitle: "Copy constructors and assignment, move constructors and assignment",
    estimatedMinutes: 26,
    intro:
      "When an object is copied or moved, C++ calls special member functions. Usually the compiler writes them for you, correctly. This lesson shows what they are, when each one runs, and the rule that tells you when you must write them yourself.",

    atoms: [
      {
        id: "a-cp-copy-ops",
        title: "Copy constructors and copy assignment",
        explain:
          "The copy constructor, Buffer(const Buffer& other), creates a NEW object as a copy: it runs for Buffer b = a; and when an object is passed by value. The copy assignment operator, Buffer& operator=(const Buffer& other), overwrites an EXISTING object: it runs for b = a; when b already exists. The compiler generates both, copying each member in turn. That is exactly right for members that manage themselves, such as std::string and std::vector, and exactly wrong for a raw pointer, where it would copy the address and leave two objects deleting the same memory.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Tracker {
public:
    std::string name;
    explicit Tracker(std::string n) : name(n) {}
    Tracker(const Tracker& other) : name(other.name + " copy") {
        std::cout << "copy constructor\n";
    }
    Tracker& operator=(const Tracker& other) {
        std::cout << "copy assignment\n";
        name = other.name + " assigned";
        return *this;
    }
};

void byValue(Tracker t) { std::cout << "got " << t.name << "\n"; }

int main() {
    Tracker a("A");
    Tracker b = a;
    Tracker c("C");
    c = a;
    byValue(a);
    std::cout << b.name << " / " << c.name << "\n";
    return 0;
}
`,
          expectedOutput: "copy constructor\ncopy assignment\ncopy constructor\ngot A copy\nA copy / A assigned",
        },
        why: "Tracker b = a; looks like assignment but creates b, so it is the copy CONSTRUCTOR. Only c = a;, where c already exists, is assignment. Passing by value copied a third time, which is why large objects are passed by const reference.",
      },
      {
        id: "a-cp-move-ops",
        title: "Move constructors and move assignment",
        explain:
          "The move constructor, Buffer(Buffer&& other) noexcept, creates a new object by taking over other's resources; the move assignment operator, Buffer& operator=(Buffer&& other) noexcept, does the same for an existing object. Each must leave the source valid, usually empty. Mark them noexcept: std::vector only moves elements during growth when the move cannot throw. The rule of zero: if your members all manage themselves (strings, vectors, smart pointers), write none of these five special functions and let the compiler generate them. The rule of five: if you must write one (destructor, copy or move), write all five.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <utility>
#include <vector>

class Buffer {
public:
    std::vector<int> data;
    Buffer() = default;
    Buffer(const Buffer& o) : data(o.data) { std::cout << "copy "; }
    Buffer(Buffer&& o) noexcept : data(std::move(o.data)) { std::cout << "move "; }
    Buffer& operator=(const Buffer& o) { data = o.data; std::cout << "copy= "; return *this; }
    Buffer& operator=(Buffer&& o) noexcept { data = std::move(o.data); std::cout << "move= "; return *this; }
};

int main() {
    Buffer a;
    a.data = {1, 2, 3};
    Buffer b = a;
    Buffer c = std::move(a);
    Buffer d;
    d = b;
    d = std::move(c);
    std::cout << "\n" << d.data.size() << " " << b.data.size() << "\n";
    return 0;
}
`,
          question: "Decide for each line: construct or assign, and copy or move. What does this print?",
          expectedOutput: "copy move copy= move=\n3 3",
          hint: "b and c are being created (constructors); d already exists for the last two lines (assignment). std::move picks the move versions.",
          successMessage: "copy, move, copy=, move=. Creating versus overwriting picks constructor or assignment; std::move picks move over copy.",
        },
      },
      {
        id: "a-cp-rule-of-zero",
        title: "The rule of zero in practice",
        explain:
          "The best special member functions are the ones you never write. Design classes from members that already manage themselves, and the compiler-generated copy, move and destructor are correct automatically. Write them by hand only for a class whose whole job is to manage one raw resource, and even then prefer wrapping it in a smart pointer or container. If a class must never be copied, say so: Logger(const Logger&) = delete;.",
        codeFill: {
          task: "A Session must never be copied. Fill the gap to delete its copy constructor, so the commented-out copy would be a compile error.",
          code: C`#include <iostream>
#include <string>

class Session {
    std::string user;
public:
    explicit Session(std::string u) : user(u) {}
    {{1}}
    std::string who() const { return user; }
};

int main() {
    Session s("ada");
    // Session copy = s;   // would not compile
    std::cout << s.who() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["Session(const Session&) = delete;", "Session(const Session& other) = delete;"], width: 34 }],
          expectedOutput: "ada",
          hint: "Write the copy constructor's declaration, and instead of a body put = delete;",
          successMessage: "Session(const Session&) = delete; Copying is now a compile error, not a runtime surprise.",
        },
      },
      {
        id: "a-cp-special-choice",
        title: "Deciding what to write",
        explain:
          "Before writing any special member function, look at the members. Each one either manages itself (std::string, std::vector, smart pointers, ints) or does not (a raw owning pointer, a raw file handle). If every member manages itself, the compiler's versions are correct and you write nothing. If one does not, wrap it in a class that does, and you are back to writing nothing.",
        decision: {
          scenario: "A class holds a std::string name, a std::vector<double> scores and a std::unique_ptr<Report> report.",
          question: "Which special member functions should you write by hand?",
          options: [
            {
              id: "a",
              text: "None (rule of zero): each member manages itself, so the generated functions are correct; the unique_ptr even makes the class move-only automatically",
              why: "string and vector copy and move themselves; unique_ptr moves and refuses to copy. The compiler composes those behaviours correctly.",
            },
            {
              id: "b",
              text: "All five, always",
              whyWrong: "Hand-written versions add code and bugs where the generated ones are already correct.",
            },
            {
              id: "c",
              text: "Only a destructor that deletes report",
              whyWrong: "unique_ptr already deletes it; a manual delete would be a double delete.",
            },
            {
              id: "d",
              text: "A copy constructor that copies the unique_ptr",
              whyWrong: "A unique_ptr cannot be copied, by design: ownership is unique.",
            },
          ],
          correct: "a",
          aftermath: "Choose self-managing members, and the special functions take care of themselves.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 14.11 – 14.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l61-optional-cpp20",
    moduleId: "cp-m14-modern",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.11", "14.12", "14.13"],
    title: "Safer Interfaces and a Taste of C++20",
    subtitle: "optional, string_view, structured bindings and ranges",
    estimatedMinutes: 26,
    intro:
      "Three last tools that make interfaces say exactly what they mean: optional for a value that may be missing, string_view for reading text without copying, and structured bindings and ranges for working with data more directly. The last program in this lesson is compiled as C++20.",

    atoms: [
      {
        id: "a-cp-optional",
        title: "std::optional and safer return values",
        explain:
          "std::optional<T>, from <optional>, holds either a T or nothing (std::nullopt). It replaces magic values such as returning -1 for \"not found\", which can be confused with real data, and pointers used only to mean \"maybe\". The caller must check before using it: if (result) or result.has_value(), then *result or result.value(). value_or(fallback) gives a default when it is empty.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <map>
#include <optional>
#include <string>

std::optional<int> findScore(const std::map<std::string, int>& scores, const std::string& name) {
    auto it = scores.find(name);
    if (it == scores.end()) return std::nullopt;
    return it->second;
}

int main() {
    std::map<std::string, int> scores = {{"Ada", 91}, {"Bayo", 0}};
    if (auto s = findScore(scores, "Bayo")) {
        std::cout << "Bayo scored " << *s << "\n";
    }
    auto missing = findScore(scores, "Chi");
    std::cout << std::boolalpha << missing.has_value() << " " << missing.value_or(-1) << "\n";
    return 0;
}
`,
          expectedOutput: "Bayo scored 0\nfalse -1",
        },
        why: "Bayo really scored 0. With \"return 0 for not found\", Bayo and a missing student would be indistinguishable. optional makes \"no value\" a separate state the type system tracks.",
        codeFill: {
          task: "Fill the return statement for the case where the text is not a valid percentage, so the function returns \"no value\".",
          code: C`#include <iostream>
#include <optional>

std::optional<int> parsePercent(int raw) {
    if (raw < 0 || raw > 100) {
        {{1}}
    }
    return raw;
}

int main() {
    std::cout << parsePercent(75).value_or(-1) << " " << parsePercent(140).value_or(-1) << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["return std::nullopt;", "return {};"] }],
          expectedOutput: "75 -1",
          hint: "The special value that means an optional holds nothing.",
          successMessage: "return std::nullopt; The caller can now tell a valid 0 from \"no value\".",
        },
      },
      {
        id: "a-cp-string-view",
        title: "Introduction to string_view",
        explain:
          "std::string_view, from <string_view>, is a lightweight, read-only view of characters that live somewhere else: it stores only a pointer and a length. A function taking std::string_view can be called with a std::string or a literal without making a copy, and substr on a view creates another view, not a new string. The one danger: a view does not own its characters, so it must never outlive the string it looks at.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <string_view>

std::string_view firstWord(std::string_view text) {
    auto space = text.find(' ');
    return text.substr(0, space);
}

int main() {
    std::string sentence = "Memora Smart Academy";
    std::cout << firstWord(sentence) << "\n";
    std::cout << firstWord("Hello there") << "\n";
    std::string_view v = sentence;
    v.remove_prefix(7);
    std::cout << v << " (" << v.size() << ")\n";
    return 0;
}
`,
          expectedOutput: "Memora\nHello\nSmart Academy (13)",
        },
        why: "No characters were copied anywhere in this program. Returning firstWord's view is safe here because the caller's sentence is still alive; returning a view of a LOCAL std::string would dangle, exactly like a pointer to a local.",
      },
      {
        id: "a-cp-cpp20",
        title: "Structured bindings and C++20 ranges",
        explain:
          "Structured bindings (C++17), auto [a, b] = pair;, unpack a pair, a struct or a map element into named variables, as you have seen in map loops. Ranges (C++20, <ranges>) let you describe a pipeline over a container with the | operator: v | std::views::filter(...) | std::views::transform(...). Views are lazy: nothing is copied, each element flows through the pipeline as you loop. Compile C++20 programs with -std=c++20.",
        code: {
          language: CPP,
          std: "c++20",
          code: C`#include <iostream>
#include <map>
#include <ranges>
#include <string>
#include <vector>

struct Result {
    std::string name;
    int score;
};

int main() {
    std::vector<Result> results = {{"Ada", 91}, {"Bayo", 48}, {"Chi", 74}, {"Dayo", 55}};

    auto passed = results
        | std::views::filter([](const Result& r) { return r.score >= 50; })
        | std::views::transform([](const Result& r) { return r.name; });
    for (const auto& name : passed) std::cout << name << " ";
    std::cout << "\n";

    auto [best, bestScore] = results[0];
    std::cout << best << " " << bestScore << "\n";

    std::map<std::string, int> counts = {{"A", 2}, {"B", 1}};
    for (const auto& [grade, n] : counts) std::cout << grade << ":" << n << " ";
    std::cout << "\n";
    return 0;
}
`,
          expectedOutput: "Ada Chi Dayo \nAda 91\nA:2 B:1",
        },
        codeFill: {
          task: "Fill the gap with a structured binding that unpacks the pair into two variables called city and population.",
          code: C`#include <iostream>
#include <string>
#include <utility>

int main() {
    std::pair<std::string, long long> biggest = {"Lagos", 15000000};
    {{1}}
    std::cout << city << ": " << population << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["auto [city, population] = biggest;", "const auto& [city, population] = biggest;", "auto& [city, population] = biggest;"], width: 36 }],
          expectedOutput: "Lagos: 15000000",
          hint: "auto, then the two new names in square brackets, then = and the pair.",
          successMessage: "auto [city, population] = biggest; Much clearer than biggest.first and biggest.second.",
        },
      },
    ],

    task: {
      title: "Mini-project: modernise an earlier application",
      intro:
        "Take your Week 11 records manager (or the Week 9 bank simulator) and refactor it to modern C++, keeping its behaviour identical. Commit or copy the original first so you can compare the two.",
      prompts: [
        "Remove every raw new and delete: use std::vector, std::unique_ptr or std::make_shared instead.",
        "Make every parameter that is only read a const reference (or std::string_view for text), and every member function that does not modify the object const.",
        "Replace any \"-1 means not found\" or nullptr-means-missing results with std::optional.",
        "Use auto where the type is long or obvious, range-based for with const auto& for reading, and structured bindings for map loops.",
        "Wrap the data file in a small RAII class that opens it in the constructor and reports in the destructor, and check that it closes even when an exception is thrown.",
        "Make the main record class follow the rule of zero; if any class must not be copied, delete its copy constructor.",
        "Run every test case from the original version and confirm the output is the same. Write a short note listing three bugs the modern version makes impossible.",
      ],
      closing:
        "Modern C++ makes correct code easier to write. Next week: finding and proving correctness when something does go wrong.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
