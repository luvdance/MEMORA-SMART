/**
 * C++ PROGRAMMING · MODULE 9 · CLASSES, OBJECTS AND ENCAPSULATION
 *
 * Curriculum 9.1 – 9.13. Object-oriented programming begins. Every program
 * is compiled and run by `npm run validate:content`, including the private-
 * member error that encapsulation exists to produce. Multi-file layouts
 * (9.13) are shown as files in an `example`, beside a verified single-file
 * version of the same class.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s9-classes";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 9.1 – 9.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l37-classes-intro",
    moduleId: "cp-m9-classes",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3"],
    title: "From Procedures to Objects",
    subtitle: "Why procedural programs get hard, classes versus objects, defining a class",
    estimatedMinutes: 22,
    intro:
      "Phase 3's second half is about how large software is organised. Software models things: accounts, students, products. Until now a student was three separate variables and a handful of functions that hoped to receive the right ones. A class bundles the data and the functions that work on it into one type of your own.",

    atoms: [
      {
        id: "a-cp-procedural-limits",
        title: "Why procedural programs become difficult to manage",
        explain:
          "In procedural style, data and the functions that use it live apart. A student record becomes parallel arrays (names[i], scores[i], ages[i]) that must be kept in step by hand, and any function anywhere can change any of them, including into invalid values such as a score of 250. As a program grows to thousands of lines, nobody can be sure which code is allowed to change what. Object-oriented programming answers this by keeping each piece of data together with the only code allowed to change it.",
        example:
          "Procedural: three arrays that must stay in step.\n\n  std::string names[100];\n  int scores[100];\n  int ages[100];\n\n  // Sorting by score? You must swap in all three arrays,\n  // or names and scores stop matching.\n  // Anyone can write scores[3] = 250; nothing stops it.\n\nObject-oriented: one type that owns its data and its rules.\n\n  class Student { ... };     // name, score, age together\n  std::vector<Student> students;\n\n  // Sorting moves whole students. A Student can refuse a score\n  // of 250, because only its own functions may change the score.",
        decision: {
          scenario: "A bug report: one student's score is 250, out of 100. The program has 40 functions, and any of them can write to the scores array.",
          question: "Why is this bug hard to find, and what design prevents it?",
          options: [
            {
              id: "a",
              text: "Any of 40 functions could be guilty; if only the student's own setScore function could change a score and it rejected values above 100, the bad value could never be stored",
              why: "That is encapsulation: one gatekeeper for each piece of data, enforcing its rules. You will build exactly that this week.",
            },
            {
              id: "b",
              text: "It is hard because arrays are slow",
              whyWrong: "Speed is unrelated; the problem is that too much code can change the data.",
            },
            {
              id: "c",
              text: "Add more comments to each function",
              whyWrong: "Comments do not stop code from writing bad values.",
            },
            {
              id: "d",
              text: "Make the scores array global so it is easier to find",
              whyWrong: "That gives even more code access to it, making the problem worse.",
            },
          ],
          correct: "a",
          aftermath: "Data plus the rules that protect it, in one place: that is what a class gives you.",
        },
      },
      {
        id: "a-cp-class-vs-object",
        title: "Classes and objects",
        explain:
          "A class is a blueprint: it describes what data a kind of thing has and what it can do. An object is one actual thing built from that blueprint, with its own data. Student is a class; ada and tunde are two Student objects, each with their own name and score. You write the class once and create as many objects as you need, exactly like int is a type and score is a variable.",
        analogy:
          "An architect's house plan and the houses built from it. One plan, many houses; each house has its own furniture and paint, but they all share the plan's layout.",
        table: {
          caption: "Classes and objects.",
          headers: ["Class (blueprint)", "Objects (instances)"],
          rows: [
            ["Student", "ada, tunde, chiamaka"],
            ["BankAccount", "savings, current"],
            ["Product", "rice5kg, palmOil1L"],
          ],
        },
      },
      {
        id: "a-cp-define-class",
        title: "Defining a class",
        explain:
          "class Student { public: std::string name; int score = 0; }; defines a new type called Student, with two data members. Note the semicolon after the closing brace: forgetting it is a classic compile error. The word struct does the same job: the only difference is that a struct's members are public by default and a class's are private. By convention, struct is used for simple bundles of data and class for types with rules to protect.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Student {
public:
    std::string name;
    int score = 0;
};

int main() {
    Student ada;
    ada.name = "Ada";
    ada.score = 91;

    Student tunde;
    tunde.name = "Tunde";

    std::cout << ada.name << ": " << ada.score << "\n";
    std::cout << tunde.name << ": " << tunde.score << "\n";
    return 0;
}
`,
          expectedOutput: "Ada: 91\nTunde: 0",
        },
        why: "tunde.score was never set but prints 0, because the class gives score a default value. Always give data members defaults: an object should never start life holding garbage.",
        codeFill: {
          task: "Fill the gap with the data member that holds a product's price as a double, starting at 0.",
          code: C`#include <iostream>
#include <string>

class Product {
public:
    std::string name;
    {{1}}
};

int main() {
    Product rice;
    rice.name = "Rice 5kg";
    rice.price = 8500;
    std::cout << rice.name << " costs " << rice.price << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["double price = 0;", "double price = 0.0;", "double price{};", "double price{0};"], width: 18 }],
          expectedOutput: "Rice 5kg costs 8500",
          hint: "A member is declared like a variable: type, name, a default value and a semicolon.",
          successMessage: "double price = 0; Every Product now carries its own price.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 9.4 – 9.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l38-members-access",
    moduleId: "cp-m9-classes",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.4", "9.5", "9.6"],
    title: "Members, Objects and Access",
    subtitle: "Data members, member functions, creating objects, public and private",
    estimatedMinutes: 24,
    intro:
      "A class holds data AND behaviour. This lesson adds member functions, the things an object can do, shows the different ways objects are created and used, and introduces the three access specifiers that decide who may touch what.",

    atoms: [
      {
        id: "a-cp-member-functions",
        title: "Data members and member functions",
        explain:
          "Data members are the variables inside a class: what each object knows. Member functions (methods) are functions inside a class: what each object can do. A member function can use the object's data members directly by name, because it always runs ON a particular object: ada.passed() uses ada's score. A member function that does not change the object should be marked const after its brackets, which the compiler then enforces.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Student {
public:
    std::string name;
    int score = 0;

    bool passed() const {
        return score >= 50;
    }

    void addBonus(int points) {
        score += points;
    }
};

int main() {
    Student ada;
    ada.name = "Ada";
    ada.score = 46;
    std::cout << std::boolalpha << ada.passed() << "\n";
    ada.addBonus(5);
    std::cout << ada.score << " " << ada.passed() << "\n";
    return 0;
}
`,
          expectedOutput: "false\n51 true",
        },
        codeFill: {
          task: "Fill in the member function that returns the rectangle's area. It must not change the object.",
          code: C`#include <iostream>

class Rectangle {
public:
    double width = 0;
    double height = 0;

    {{1}} {
        return width * height;
    }
};

int main() {
    Rectangle room;
    room.width = 4;
    room.height = 3.5;
    std::cout << "Area: " << room.area() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["double area() const", "double area()"], width: 20 }],
          expectedOutput: "Area: 14",
          hint: "Return type, name, empty brackets, and const to promise it does not change the rectangle.",
          successMessage: "double area() const. It reads width and height directly, because it runs on a particular rectangle.",
        },
      },
      {
        id: "a-cp-creating-objects",
        title: "Creating and using objects",
        explain:
          "Create an object like any variable: Student ada;. Use the dot operator to reach its members: ada.score, ada.passed(). Objects can be copied with =, passed to functions (by const reference to avoid copies), returned, and stored in vectors: std::vector<Student> class2026;. Through a pointer, the arrow operator -> reaches members: p->score means (*p).score.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>

class Counter {
public:
    int value = 0;
    void tick() { value++; }
};

int main() {
    Counter a;
    a.tick();
    Counter b = a;
    b.tick();
    b.tick();
    Counter* p = &a;
    p->tick();
    std::vector<Counter> all = {a, b};
    all[0].tick();
    std::cout << a.value << " " << b.value << " " << all[0].value << "\n";
    return 0;
}
`,
          question: "Copies are independent objects. Track each one. What does this print?",
          expectedOutput: "2 3 3",
          hint: "b starts as a copy of a (1), then ticks twice. p->tick() ticks a itself. The vector holds COPIES, so ticking all[0] does not change a.",
          successMessage: "2 3 3. Copying an object copies its data; afterwards the copies have separate lives.",
        },
      },
      {
        id: "a-cp-access-specifiers",
        title: "Access specifiers: public, private and protected",
        explain:
          "public: members can be used by any code. private: members can be used only by the class's own member functions; outside code that tries gets a compile error. protected: like private, except that classes derived from this one may use them too (Week 10). In a class, members are private until you say otherwise. The usual design keeps data private and makes a small set of member functions public.",
        code: {
          language: CPP,
          code: C`#include <iostream>

class Account {
private:
    double balance = 0;
public:
    void deposit(double amount) { balance += amount; }
};

int main() {
    Account acc;
    acc.deposit(5000);
    acc.balance = 1000000;
    return 0;
}
`,
          compileError: "error: 'double Account::balance' is private within this context",
        },
        why: "This error is the whole point. Code outside the class cannot set the balance to a million; it can only call deposit, and deposit can apply whatever rules the bank needs.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 9.7 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l39-encapsulation",
    moduleId: "cp-m9-classes",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.7", "9.8", "9.9", "9.10"],
    title: "Encapsulation and Constructors",
    subtitle: "Protecting data, getters and setters, constructors and overloading",
    estimatedMinutes: 26,
    intro:
      "Making data private is half of encapsulation. The other half is giving the outside world safe ways in: functions that read values, functions that change them only according to the rules, and constructors that guarantee every object starts in a valid state.",

    atoms: [
      {
        id: "a-cp-encapsulation",
        title: "Encapsulation and data protection",
        explain:
          "Encapsulation means hiding an object's data behind its public member functions, so the object itself guarantees its rules, called its invariants: a balance is never negative, a score is between 0 and 100. Because every change goes through the class, a rule is written once and enforced everywhere, and the internal details can change later without breaking any code that uses the class.",
        code: {
          language: CPP,
          code: C`#include <iostream>

class Account {
private:
    double balance = 0;
public:
    bool withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    double getBalance() const { return balance; }
};

int main() {
    Account acc;
    acc.deposit(5000);
    acc.deposit(-300);
    std::cout << std::boolalpha << acc.withdraw(8000) << " " << acc.withdraw(1500) << "\n";
    std::cout << "Balance: " << acc.getBalance() << "\n";
    return 0;
}
`,
          expectedOutput: "false true\nBalance: 3500",
        },
        why: "The negative deposit and the oversized withdrawal were both refused, by the class itself. No caller can put this account into an impossible state.",
      },
      {
        id: "a-cp-getters-setters",
        title: "Getters and setters",
        explain:
          "A getter returns a private value (getScore() const). A setter changes it, but only after checking the rules (setScore(int s) rejects anything outside 0–100). Do not add a getter and a setter for every member by reflex: a setter with no checks is just a public member with extra typing. Provide the operations the object actually needs, such as deposit and withdraw rather than setBalance.",
        codeFill: {
          task: "Complete the setter's condition so only scores from 0 to 100 are accepted.",
          code: C`#include <iostream>

class Student {
private:
    int score = 0;
public:
    bool setScore(int s) {
        if ({{1}}) {
            score = s;
            return true;
        }
        return false;
    }
    int getScore() const { return score; }
};

int main() {
    Student s;
    s.setScore(250);
    s.setScore(78);
    s.setScore(-4);
    std::cout << "Score: " << s.getScore() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["s >= 0 && s <= 100", "0 <= s && s <= 100", "s <= 100 && s >= 0"], width: 20 }],
          expectedOutput: "Score: 78",
          hint: "The same range check as Week 3: at least 0 AND at most 100.",
          successMessage: "Only 78 got through. The bad values were stopped at the one gate every change must pass.",
        },
      },
      {
        id: "a-cp-constructors",
        title: "Constructors",
        explain:
          "A constructor is a special member function that runs automatically when an object is created. It has the same name as the class and no return type. Its job is to put the object into a valid state from the start. Initialise members in the member initialiser list, after a colon: Student(std::string n, int s) : name(n), score(s) {}. Once a class has a constructor with parameters, objects must be created with those arguments: Student ada(\"Ada\", 91); or Student ada{\"Ada\", 91};.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int score;
public:
    Student(std::string n, int s) : name(n), score(s) {
        if (score < 0) score = 0;
        if (score > 100) score = 100;
    }
    void print() const { std::cout << name << ": " << score << "\n"; }
};

int main() {
    Student ada("Ada", 91);
    Student bayo{"Bayo", 140};
    ada.print();
    bayo.print();
    return 0;
}
`,
          expectedOutput: "Ada: 91\nBayo: 100",
        },
        codeFill: {
          task: "Fill the member initialiser list so the constructor stores the title and the number of pages.",
          code: C`#include <iostream>
#include <string>

class Book {
private:
    std::string title;
    int pages;
public:
    Book(std::string t, int p) : {{1}} {}
    void show() const { std::cout << title << " (" << pages << " pages)\n"; }
};

int main() {
    Book b("Things Fall Apart", 209);
    b.show();
    return 0;
}
`,
          blanks: [{ answers: ["title(t), pages(p)", "title{t}, pages{p}"], width: 20 }],
          expectedOutput: "Things Fall Apart (209 pages)",
          hint: "Each member name followed by the parameter that initialises it in brackets, separated by a comma.",
          successMessage: "title(t), pages(p). Members are initialised before the body runs, which is why the list is preferred.",
        },
      },
      {
        id: "a-cp-constructor-overloading",
        title: "Constructor overloading",
        explain:
          "Like any function, a constructor can be overloaded: several constructors with different parameter lists give several ways to create an object. A constructor with no parameters is the default constructor, used by Student s;. If you write any constructor yourself, C++ no longer generates a default one; write Student() = default; or your own if you still want it. One constructor can also hand over to another, called delegating: Student() : Student(\"Unknown\", 0) {}.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Ticket {
public:
    std::string route;
    int price;
    Ticket() : Ticket("Lagos-Ibadan", 6000) {}
    Ticket(std::string r) : Ticket(r, 5000) {}
    Ticket(std::string r, int p) : route(r), price(p) {}
};

int main() {
    Ticket a;
    Ticket b("Abuja-Kaduna");
    Ticket c("Enugu-Onitsha", 3500);
    std::cout << a.route << " " << a.price << "\n";
    std::cout << b.route << " " << b.price << "\n";
    std::cout << c.price << "\n";
    return 0;
}
`,
          question: "The number of arguments picks the constructor, and two of them delegate. What does this print?",
          expectedOutput: "Lagos-Ibadan 6000\nAbuja-Kaduna 5000\n3500",
          hint: "a uses the no-argument constructor, b the one-argument constructor, c the two-argument one.",
          successMessage: "Three constructors, three ways in, and the real work done in one place: the two-argument version.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 9.11 – 9.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l40-this-static-files",
    moduleId: "cp-m9-classes",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.11", "9.12", "9.13"],
    title: "this, static Members and Class Files",
    subtitle: "The object's own address, data shared by all objects, and splitting a class",
    estimatedMinutes: 24,
    intro:
      "Three things every real class uses: the this pointer, by which an object refers to itself; static members, which belong to the class rather than any one object; and the professional layout of a class across a header file and a source file.",

    atoms: [
      {
        id: "a-cp-this",
        title: "The this pointer",
        explain:
          "Inside a member function, this is a pointer to the object the function was called on: in ada.addBonus(5), this points at ada. You rarely need to write it, because members are found automatically, but it is useful in three cases: when a parameter has the same name as a member (this->score = score;), to return the object itself so calls can be chained (return *this;), and to pass the object to another function.",
        code: {
          language: CPP,
          code: C`#include <iostream>

class Cart {
private:
    int items = 0;
    int total = 0;
public:
    Cart& add(int price) {
        this->items++;
        this->total += price;
        return *this;
    }
    void summary() const { std::cout << items << " items, total " << total << "\n"; }
};

int main() {
    Cart cart;
    cart.add(1500).add(2500).add(800);
    cart.summary();
    return 0;
}
`,
          expectedOutput: "3 items, total 4800",
        },
        codeFill: {
          task: "The parameter has the same name as the member. Fill the gap so the member price is set from the parameter.",
          code: C`#include <iostream>

class Item {
private:
    int price = 0;
public:
    void setPrice(int price) {
        {{1}}
    }
    int getPrice() const { return price; }
};

int main() {
    Item it;
    it.setPrice(2750);
    std::cout << it.getPrice() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["this->price = price;", "(*this).price = price;"], width: 22 }],
          expectedOutput: "2750",
          hint: "Inside the function, plain price means the parameter. Reach the member through the object's own pointer, with ->.",
          successMessage: "this->price = price; Without this->, price = price; would assign the parameter to itself and the member would stay 0.",
        },
      },
      {
        id: "a-cp-static-members",
        title: "Static members",
        explain:
          "A static data member belongs to the class itself, not to any one object: there is exactly one copy, shared by every object. It is useful for counts and shared settings, such as how many accounts have been opened or the bank's interest rate. Declare it inline static int count = 0; inside the class (C++17). A static member function also belongs to the class: it is called as ClassName::function() and has no this, so it can only use static members.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

class Account {
private:
    inline static int opened = 0;
    int number;
    std::string owner;
public:
    Account(std::string o) : owner(o) {
        opened++;
        number = 1000 + opened;
    }
    void show() const { std::cout << number << " " << owner << "\n"; }
    static int count() { return opened; }
};

int main() {
    Account a("Ada");
    Account b("Bayo");
    Account c("Chi");
    b.show();
    std::cout << "Accounts opened: " << Account::count() << "\n";
    return 0;
}
`,
          expectedOutput: "1002 Bayo\nAccounts opened: 3",
        },
        why: "Each account gets its own number, but all of them share one counter. Without static, every account would have its own counter and each would say 1.",
      },
      {
        id: "a-cp-class-files",
        title: "Separating declarations and definitions into files",
        explain:
          "Real projects put each class in two files. The header, Account.h, holds the class definition: its members and the declarations of its member functions. The source file, Account.cpp, holds the member functions' definitions, each named with the class and the scope operator: double Account::getBalance() const { ... }. Other files #include \"Account.h\" (quotes, for your own headers) to use the class. All .cpp files are compiled together, and #pragma once at the top of the header stops it being included twice (Week 15 explains guards fully).",
        example:
          "Account.h\n─────────\n#pragma once\n#include <string>\n\nclass Account {\nprivate:\n    std::string owner;\n    double balance = 0;\npublic:\n    explicit Account(std::string owner);\n    void deposit(double amount);\n    double getBalance() const;\n};\n\nAccount.cpp\n───────────\n#include \"Account.h\"\n\nAccount::Account(std::string o) : owner(o) {}\n\nvoid Account::deposit(double amount) {\n    if (amount > 0) balance += amount;\n}\n\ndouble Account::getBalance() const {\n    return balance;\n}\n\nmain.cpp\n────────\n#include <iostream>\n#include \"Account.h\"\n\nint main() {\n    Account acc(\"Ada\");\n    acc.deposit(2500);\n    std::cout << acc.getBalance() << \"\\n\";\n}\n\nBuild both source files into one program:\n\n  g++ -std=c++17 -Wall -Wextra main.cpp Account.cpp -o bank",
        codeFill: {
          task: "Here is the same split in one file: the class declares getBalance, and the definition comes after it. Fill in the start of that definition.",
          code: C`#include <iostream>

class Account {
private:
    double balance = 2500;
public:
    double getBalance() const;
};

{{1}} {
    return balance;
}

int main() {
    Account acc;
    std::cout << acc.getBalance() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["double Account::getBalance() const"], width: 34 }],
          expectedOutput: "2500",
          hint: "Return type, then the class name and :: before the function name, and the same const as in the declaration.",
          successMessage: "double Account::getBalance() const. The Account:: tells the compiler this is the member declared inside the class.",
        },
      },
    ],

    task: {
      title: "Mini-project: bank account simulator",
      intro:
        "Write a BankAccount class and a menu program that uses it. Put the class in BankAccount.h and BankAccount.cpp, and main in main.cpp, and build all three together.",
      prompts: [
        "Private members: account number, owner's name and balance. Account numbers come from a static counter, so every new account gets the next number.",
        "A constructor that takes the owner's name and an optional opening deposit (a default argument of 0), rejecting a negative deposit.",
        "deposit and withdraw member functions that return bool, refusing amounts of zero or less and withdrawals larger than the balance.",
        "const getters for the balance, owner and account number, and a print() that shows all three with the balance to two decimal places.",
        "In main, keep accounts in a std::vector<BankAccount> and loop a menu: create an account, deposit, withdraw, check balance, list all, exit.",
        "Find an account by number with a function that returns a pointer to it, or nullptr if there is no such account, and handle both cases in the menu.",
        "Try to change a balance directly from main, read the compiler error, and write a comment explaining why it is a good thing.",
      ],
      closing:
        "Keep the project. In Week 11 it will save accounts to a file, and in the capstone it can grow into the full banking management system.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
