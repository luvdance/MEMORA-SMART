/**
 * C++ PROGRAMMING · MODULE 10 · INHERITANCE, POLYMORPHISM AND OOP DESIGN
 *
 * Curriculum 10.1 – 10.13, ending with the Phase 3 mastery checkpoint.
 * Every program is compiled and run by `npm run validate:content`. The
 * missing-virtual-destructor bug (10.9) is undefined behaviour, so it is
 * described in an `example`; the corrected version is the one that runs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s10-inheritance";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 10.1 – 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l41-inheritance",
    moduleId: "cp-m10-inheritance",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "Inheritance",
    subtitle: "Encapsulation revisited, derived classes and their constructors",
    estimatedMinutes: 24,
    intro:
      "A school has students and teachers. Both have a name, an ID and an email; each also has things the other does not. Writing those shared parts twice is the repetition functions were invented to avoid, one level up. Inheritance lets one class build on another.",

    atoms: [
      {
        id: "a-cp-encapsulation-revisited",
        title: "Revisiting encapsulation",
        explain:
          "Last week's rule still holds, and inheritance must not break it: each class keeps its data private and exposes a small set of member functions that protect its invariants. A class designed for others to build on decides deliberately what to expose to them: public for everyone, protected for derived classes only, private for itself alone. Good base classes keep data private and offer protected or public functions instead.",
        table: {
          caption: "Who can use a member, by access level.",
          headers: ["Member is", "The class itself", "Derived classes", "Other code"],
          rows: [
            ["public", "Yes", "Yes", "Yes"],
            ["protected", "Yes", "Yes", "No"],
            ["private", "Yes", "No", "No"],
          ],
        },
        why: "If a derived class could reach a base class's private data, encapsulation would leak through inheritance: anyone could write a derived class to get at it. So private stays private, even from children.",
      },
      {
        id: "a-cp-derived-classes",
        title: "Inheritance and derived classes",
        explain:
          "class Student : public Person { ... }; declares Student as a derived class of the base class Person. A Student object contains everything a Person has, and gets all of Person's public member functions, plus whatever Student adds. Inheritance models an \"is-a\" relationship: a Student is a Person. Use it only when that sentence is true.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

class Person {
private:
    string name;
public:
    void setName(const string& n) { name = n; }
    string getName() const { return name; }
};

class Student : public Person {
private:
    int level = 100;
public:
    void promote() { level += 100; }
    int getLevel() const { return level; }
};

int main() {
    Student s;
    s.setName("Amaka");
    s.promote();
    cout << s.getName() << " is in level " << s.getLevel() << "\n";
    return 0;
}
`,
          expectedOutput: "Amaka is in level 200",
        },
        codeFill: {
          task: "Fill the gap so Teacher inherits publicly from Person.",
          code: C`#include <iostream>
#include <string>
using namespace std;

class Person {
public:
    string name = "Unknown";
};

class Teacher {{1}} {
public:
    string subject = "Mathematics";
};

int main() {
    Teacher t;
    t.name = "Mr Bello";
    cout << t.name << " teaches " << t.subject << "\n";
    return 0;
}
`,
          blanks: [{ answers: [": public Person"] }],
          expectedOutput: "Mr Bello teaches Mathematics",
          hint: "A colon, the word public, and the base class's name.",
          successMessage: ": public Person. Teacher gets name from Person without writing it again.",
        },
      },
      {
        id: "a-cp-derived-constructors",
        title: "Base-class and derived-class constructors",
        explain:
          "A derived object is built in layers: the base part first, then the derived part. The derived constructor chooses which base constructor runs by naming it first in its initialiser list: Student(string n, int lvl) : Person(n), level(lvl) {}. If it names none, the base's default constructor is used. Destruction happens in the reverse order: the derived part first, then the base.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

class Person {
public:
    Person(const string& n) { cout << "Person " << n << "\n"; }
    ~Person() { cout << "~Person\n"; }
};

class Student : public Person {
public:
    Student(const string& n) : Person(n) { cout << "Student\n"; }
    ~Student() { cout << "~Student\n"; }
};

int main() {
    Student s("Ada");
    cout << "Working\n";
    return 0;
}
`,
          question: "~Person and ~Student are destructors: they run automatically when an object is destroyed, here at the end of main. In what order is everything printed?",
          expectedOutput: "Person Ada\nStudent\nWorking\n~Student\n~Person",
          hint: "Built from the base up; destroyed from the top down.",
          successMessage: "Base built first, derived destroyed first. Like a building: foundations first on the way up, roof first on the way down.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 10.4 – 10.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l42-polymorphism",
    moduleId: "cp-m10-inheritance",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5", "10.6", "10.7"],
    title: "Overriding and Polymorphism",
    subtitle: "Kinds of inheritance, overriding, and virtual functions",
    estimatedMinutes: 26,
    intro:
      "Inheritance becomes powerful when derived classes can REPLACE behaviour, and when code written for the base class automatically runs the right version for each object. That is polymorphism, and in C++ it hinges on one keyword: virtual.",

    atoms: [
      {
        id: "a-cp-inheritance-kinds",
        title: "Public, protected and private inheritance",
        explain:
          "The word after the colon controls how the base's members appear to the outside world through the derived class. public inheritance keeps them as they are: public stays public, so a Student can be used anywhere a Person can. protected inheritance makes the base's public members protected; private inheritance makes them private, so outside code cannot treat the object as the base type. Almost all real code uses public inheritance; the other two mean \"is implemented using\", which composition (Lesson 43) usually expresses better.",
        table: {
          caption: "A base class's public member, seen through the derived class.",
          headers: ["Inheritance", "Becomes in the derived class", "Is a Student usable as a Person by outside code?"],
          rows: [
            ["class Student : public Person", "public", "Yes"],
            ["class Student : protected Person", "protected", "No"],
            ["class Student : private Person", "private", "No"],
          ],
        },
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

class Engine {
public:
    void start() { cout << "Engine started\n"; }
};

class Car : private Engine {
public:
    void drive() {
        start();
        cout << "Driving\n";
    }
};

int main() {
    Car c;
    c.drive();
    c.start();
    return 0;
}
`,
          compileError: "'Engine' is not an accessible base of 'Car'",
        },
        why: "Inside Car, start() works. Outside, c.start() does not: private inheritance hid Engine's public interface. A car is not an engine, so outside code should not be able to treat it as one.",
      },
      {
        id: "a-cp-overriding",
        title: "Function overriding",
        explain:
          "A derived class can provide its own version of a base-class member function with the same name and parameters: this is overriding. Calls on a derived object then use the derived version. The derived version can still call the base's with the scope operator, Person::describe(), to add to it rather than replace it entirely.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

class Person {
public:
    string name;
    void describe() const { cout << "I am " << name; }
};

class Teacher : public Person {
public:
    string subject;
    void describe() const {
        Person::describe();
        cout << " and I teach " << subject;
    }
};

int main() {
    Teacher t;
    t.name = "Mrs Eze";
    t.subject = "Physics";
    t.describe();
    cout << "\n";
    return 0;
}
`,
          expectedOutput: "I am Mrs Eze and I teach Physics",
        },
      },
      {
        id: "a-cp-static-dynamic-poly",
        title: "Compile-time and runtime polymorphism",
        explain:
          "Polymorphism means one interface, many behaviours. C++ has two kinds. Compile-time (static) polymorphism is decided by the compiler from the types it can see: function overloading (Week 5) and templates (Week 12). Runtime (dynamic) polymorphism is decided while the program runs, from the ACTUAL type of the object, even when the code only has a pointer or reference to the base class. Runtime polymorphism needs virtual functions. Without virtual, a base pointer always calls the base version.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

class Shape {
public:
    void name() const { cout << "Shape\n"; }
};

class Circle : public Shape {
public:
    void name() const { cout << "Circle\n"; }
};

int main() {
    Circle c;
    Shape& ref = c;
    c.name();
    ref.name();
    return 0;
}
`,
          question: "name() is NOT virtual here. ref refers to a Circle but has type Shape&. What does this print?",
          expectedOutput: "Circle\nShape",
          hint: "Without virtual, the compiler chooses by the type it can see: c is a Circle, ref is a Shape&.",
          successMessage: "Circle, then Shape. The object really is a Circle both times, but without virtual the base reference cannot know that. That is the problem virtual solves.",
        },
      },
      {
        id: "a-cp-virtual",
        title: "Virtual functions",
        explain:
          "Marking a base-class function virtual tells C++ to choose the version by the object's ACTUAL type at run time, even through a base pointer or reference. In the derived class, write override after the parameter list: the compiler then checks that you really are overriding a virtual function, catching typos in the name or parameters. This lets one loop over vector<Shape*> call the right area() for every circle, rectangle and triangle.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>
#include <vector>
using namespace std;

class Shape {
public:
    virtual double area() const { return 0; }
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double r;
public:
    Circle(double radius) : r(radius) {}
    double area() const override { return 3.14159 * r * r; }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double width, double height) : w(width), h(height) {}
    double area() const override { return w * h; }
};

int main() {
    vector<unique_ptr<Shape>> shapes;
    shapes.push_back(make_unique<Circle>(1));
    shapes.push_back(make_unique<Rect>(4, 2.5));
    double total = 0;
    for (const auto& s : shapes) {
        total += s->area();
    }
    cout << "Total area: " << total << "\n";
    return 0;
}
`,
          expectedOutput: "Total area: 13.1416",
        },
        why: "The loop knows nothing about circles or rectangles; it only knows Shape. Add a Triangle class next year and this loop works unchanged. (for (const auto& s : shapes) visits every element; Weeks 12 and 14 explain it fully.)",
        codeFill: {
          task: "Fill the gap so speak() is chosen by the object's actual type at run time.",
          code: C`#include <iostream>
using namespace std;

class Animal {
public:
    {{1}} void speak() const { cout << "...\n"; }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void speak() const override { cout << "Woof\n"; }
};

int main() {
    Dog d;
    const Animal& a = d;
    a.speak();
    return 0;
}
`,
          blanks: [{ answers: ["virtual"] }],
          expectedOutput: "Woof",
          hint: "The keyword that makes a call depend on the object's real type.",
          successMessage: "virtual. Now a base reference to a Dog really barks. Without it, override would not even compile: there would be nothing to override.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 10.8 – 10.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l43-abstract-composition",
    moduleId: "cp-m10-inheritance",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.8", "10.9", "10.10"],
    title: "Abstract Classes and Composition",
    subtitle: "Pure virtual functions, virtual destructors, and has-a versus is-a",
    estimatedMinutes: 25,
    intro:
      "Some base classes describe an idea rather than a thing: there is no such object as \"a shape\" that is not some particular shape. This lesson covers classes that cannot be created on their own, the destructor rule that keeps polymorphism safe, and the design choice that experienced developers reach for more often than inheritance.",

    atoms: [
      {
        id: "a-cp-abstract",
        title: "Abstract classes and pure virtual functions",
        explain:
          "A pure virtual function has no body in the base class: virtual double area() const = 0;. It says \"every kind of Shape must provide this\". A class with at least one pure virtual function is abstract: you cannot create an object of it directly, only of derived classes that override every pure virtual function. Trying to create one is a compile error, which is exactly what you want.",
        code: {
          language: CPP,
          code: C`class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

int main() {
    Shape s;
    return 0;
}
`,
          compileError: "cannot declare variable 's' to be of abstract type 'Shape'",
        },
        codeFill: {
          task: "Fill the gap to declare pay() as a pure virtual function, so every kind of Employee must define its own pay.",
          code: C`#include <iostream>
using namespace std;

class Employee {
public:
    {{1}}
    virtual ~Employee() = default;
};

class Intern : public Employee {
public:
    double pay() const override { return 60000; }
};

int main() {
    Intern i;
    const Employee& e = i;
    cout << "Monthly pay: " << e.pay() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["virtual double pay() const = 0;"], width: 30 }],
          expectedOutput: "Monthly pay: 60000",
          hint: "virtual, the function's normal signature (including const), then = 0 instead of a body.",
          successMessage: "virtual double pay() const = 0; Employee is now abstract: you can only create the specific kinds.",
        },
      },
      {
        id: "a-cp-virtual-destructor",
        title: "Virtual destructors",
        explain:
          "If objects are deleted through a pointer to their base class, the base class's destructor MUST be virtual. Otherwise only the base destructor runs, the derived part is never cleaned up, and the behaviour is undefined. The rule is simple: any class with a virtual function gets virtual ~Base() = default;. Smart pointers to the base, as in the shapes example, rely on this too.",
        example:
          "WITHOUT a virtual destructor (do not do this):\n\n  class Base { public: ~Base() { ... } virtual void f() {} };\n  class Derived : public Base { /* owns a big buffer */ };\n\n  Base* p = new Derived;\n  delete p;      // only ~Base runs: Derived's buffer leaks,\n                 // and the behaviour is undefined\n\ng++ -Wall warns: \"deleting object of polymorphic class type\n'Derived' which has non-virtual destructor might cause undefined\nbehavior\". The fix is one line in Base:\n\n  virtual ~Base() = default;",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>
using namespace std;

class Base {
public:
    virtual ~Base() { cout << "~Base\n"; }
};

class Derived : public Base {
public:
    ~Derived() override { cout << "~Derived\n"; }
};

int main() {
    unique_ptr<Base> p = make_unique<Derived>();
    p.reset();
    cout << "Done\n";
    return 0;
}
`,
          expectedOutput: "~Derived\n~Base\nDone",
        },
        why: "p.reset() deletes the object now. Because ~Base is virtual, the whole object is destroyed properly: the derived part, then the base part.",
      },
      {
        id: "a-cp-composition",
        title: "Composition versus inheritance",
        explain:
          "Composition means building a class out of other objects as members: a Car HAS an Engine; a Course HAS a list of Students. Inheritance means is-a: a Student IS a Person. Use inheritance only for a true is-a relationship where you want to use derived objects through the base type. For everything else, prefer composition: it is more flexible (the part can be swapped), keeps classes independent, and avoids deep, fragile class trees. \"Prefer composition over inheritance\" is one of the best-known rules in software design.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Address {
public:
    string city;
    string describe() const { return "lives in " + city; }
};

class Student {
public:
    string name;
    Address home;
    vector<string> courses;
};

int main() {
    Student s;
    s.name = "Bayo";
    s.home.city = "Kano";
    s.courses = {"CSC101", "MTH101"};
    cout << s.name << " " << s.home.describe() << ", taking " << s.courses.size() << " courses\n";
    return 0;
}
`,
          expectedOutput: "Bayo lives in Kano, taking 2 courses",
        },
        decision: {
          scenario: "You are designing a Car class and need it to use an Engine's start() and stop().",
          question: "Which design is right?",
          options: [
            {
              id: "a",
              text: "Composition: Car has an Engine member and calls engine.start()",
              why: "A car HAS an engine; it is not one. Composition also lets you give a car a different engine later without changing what a Car is.",
            },
            {
              id: "b",
              text: "class Car : public Engine",
              whyWrong: "That claims a car IS an engine, so a Car could be passed anywhere an Engine is expected, which makes no sense.",
            },
            {
              id: "c",
              text: "class Engine : public Car",
              whyWrong: "An engine is not a car either.",
            },
            {
              id: "d",
              text: "Copy the engine's code into Car",
              whyWrong: "Duplicated code, with no reuse.",
            },
          ],
          correct: "a",
          aftermath: "Say it out loud: \"is a\" suggests inheritance, \"has a\" means composition.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 10.11 – 10.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l44-oop-design",
    moduleId: "cp-m10-inheritance",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.11", "10.12", "10.13"],
    title: "Designing with Classes",
    subtitle: "Interfaces, UML class diagrams, and principles of good design",
    estimatedMinutes: 25,
    intro:
      "The last step of Phase 3 is design: deciding which classes a program needs and how they relate, before writing them. You will meet interfaces, the standard way to draw classes, and the principles that keep a design easy to change. Then the Phase 3 mastery checkpoint.",

    atoms: [
      {
        id: "a-cp-interfaces",
        title: "Interfaces through abstract classes",
        explain:
          "An interface is an abstract class with only pure virtual functions and a virtual destructor: no data, no code. It is a contract that says what something can do, not how. Code written against the interface works with every class that implements it, which keeps the parts of a program independent. A class may implement several interfaces at once.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

class Notifier {
public:
    virtual void send(const string& message) const = 0;
    virtual ~Notifier() = default;
};

class SmsNotifier : public Notifier {
public:
    void send(const string& m) const override { cout << "SMS: " << m << "\n"; }
};

class EmailNotifier : public Notifier {
public:
    void send(const string& m) const override { cout << "Email: " << m << "\n"; }
};

void announceResults(const Notifier& n) {
    n.send("Results are out");
}

int main() {
    SmsNotifier sms;
    EmailNotifier email;
    announceResults(sms);
    announceResults(email);
    return 0;
}
`,
          expectedOutput: "SMS: Results are out\nEmail: Results are out",
        },
        why: "announceResults has no idea how messages travel. Add a WhatsAppNotifier tomorrow and it works without a single change to announceResults.",
        codeFill: {
          task: "Fill the gap so Printer implements the Report interface's print function.",
          code: C`#include <iostream>
using namespace std;

class Report {
public:
    virtual void print() const = 0;
    virtual ~Report() = default;
};

class TermReport : public Report {
public:
    {{1}} { cout << "Term report printed\n"; }
};

int main() {
    TermReport t;
    const Report& r = t;
    r.print();
    return 0;
}
`,
          blanks: [{ answers: ["void print() const override", "void print() const"], width: 26 }],
          expectedOutput: "Term report printed",
          hint: "Copy the interface's signature exactly (including const), then add override.",
          successMessage: "void print() const override. If the signature differed even slightly, override would make the compiler say so.",
        },
      },
      {
        id: "a-cp-uml",
        title: "Basic UML class diagrams",
        explain:
          "UML (Unified Modelling Language) is a standard way to draw classes before you write them. Each class is a box in three parts: the name, the data members, and the member functions, with + for public, - for private and # for protected. Lines between boxes show relationships: a hollow triangle arrow for inheritance (pointing at the base), a filled diamond for composition (at the owner's end).",
        example:
          "  ┌───────────────────────┐\n  │        Person         │\n  ├───────────────────────┤\n  │ - name : string       │\n  │ - id : int            │\n  ├───────────────────────┤\n  │ + getName() : string  │\n  │ + describe() : void   │\n  └───────────▲───────────┘\n              │  (hollow triangle: inheritance)\n      ┌───────┴────────┐\n┌─────┴──────┐  ┌──────┴──────┐\n│  Student   │  │   Teacher   │\n├────────────┤  ├─────────────┤\n│ - level    │  │ - subject   │\n├────────────┤  ├─────────────┤\n│ + promote()│  │ + teach()   │\n└────────────┘  └─────────────┘\n\n  Student ◆──── Address      (filled diamond: a Student HAS an Address)",
        decision: {
          scenario: "In a UML diagram, a box for BankAccount lists \"- balance : double\" and \"+ deposit(amount : double) : void\".",
          question: "What does this tell a programmer?",
          options: [
            {
              id: "a",
              text: "balance is a private double member; deposit is a public member function taking a double and returning nothing",
              why: "- means private, + means public, and the type follows a colon. A diagram like this is enough to write the class header.",
            },
            {
              id: "b",
              text: "balance is subtracted and deposit is added",
              whyWrong: "The symbols mark visibility, not arithmetic.",
            },
            {
              id: "c",
              text: "Both are public",
              whyWrong: "- marks private.",
            },
            {
              id: "d",
              text: "deposit returns a double",
              whyWrong: "The type after the brackets, void, is the return type; double is the parameter's type.",
            },
          ],
          correct: "a",
          aftermath: "Draw the boxes first. Ten minutes of diagram regularly saves hours of rewriting.",
        },
      },
      {
        id: "a-cp-design-principles",
        title: "Principles of good class design",
        explain:
          "A handful of principles keep classes easy to use and change. Single responsibility: each class has one job (a Student does not also print reports and send emails). Encapsulation: private data, a small public interface. Valid from birth: constructors leave every object in a valid state. Is-a for inheritance, has-a for composition, and prefer composition. Program to interfaces: code that depends on abstract classes, not specific ones, does not break when new kinds are added. Names that describe: a reader should know what a class is from its name alone.",
        decision: {
          scenario: "A class StudentManager stores students, calculates grades, prints formatted reports, sends results by email, and saves everything to a file.",
          question: "What is the main design problem?",
          options: [
            {
              id: "a",
              text: "It has too many responsibilities; split it into classes that each do one job, such as a grade calculator, a report printer, a notifier and a repository",
              why: "With five jobs, any change to emailing, printing or saving risks breaking the others. One responsibility per class keeps changes small and safe.",
            },
            {
              id: "b",
              text: "It should use more inheritance",
              whyWrong: "The problem is too many jobs in one class; inheritance would not separate them.",
            },
            {
              id: "c",
              text: "All of its data should be public",
              whyWrong: "That breaks encapsulation and makes things worse.",
            },
            {
              id: "d",
              text: "Nothing: one big class is simpler",
              whyWrong: "Simpler to start, much harder to change, test and understand as it grows.",
            },
          ],
          correct: "a",
          aftermath: "If describing a class needs the word \"and\" several times, it probably wants to be several classes.",
        },
      },
      {
        id: "a-cp-school-model",
        title: "Mastery checkpoint: a school management model",
        explain:
          "This program brings Phase 3 together: an abstract Person with private data and a pure virtual role(), Student and Teacher derived from it with their own constructors, composition (a Teacher has a list of subjects), a static ID counter, and polymorphism through a vector of smart pointers to the base. Read every line and say which lesson it comes from.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Person {
private:
    inline static int nextId = 1;
    int id;
    string name;
public:
    explicit Person(string n) : id(nextId++), name(n) {}
    virtual ~Person() = default;
    virtual string role() const = 0;
    void print() const { cout << "#" << id << " " << name << " (" << role() << ")\n"; }
};

class Student : public Person {
    int level;
public:
    Student(string n, int lvl) : Person(n), level(lvl) {}
    string role() const override { return "Student, level " + to_string(level); }
};

class Teacher : public Person {
    vector<string> subjects;
public:
    Teacher(string n, vector<string> s) : Person(n), subjects(s) {}
    string role() const override {
        return "Teacher of " + to_string(subjects.size()) + " subjects";
    }
};

int main() {
    vector<unique_ptr<Person>> school;
    school.push_back(make_unique<Student>("Amaka", 200));
    school.push_back(make_unique<Teacher>("Mr Bello", vector<string>{"Maths", "Physics"}));
    school.push_back(make_unique<Student>("Femi", 100));
    for (const auto& p : school) {
        p->print();
    }
    return 0;
}
`,
          expectedOutput: "#1 Amaka (Student, level 200)\n#2 Mr Bello (Teacher of 2 subjects)\n#3 Femi (Student, level 100)",
        },
        why: "print() is written once, in Person, yet each line shows the right role, because print calls the virtual role(). explicit on Person's constructor stops a plain string being silently converted into a Person. to_string turns a number into text so it can be joined with +.",
      },
    ],

    task: {
      title: "Mini-project and Phase 3 mastery checkpoint: school management model",
      intro:
        "Design first, then build. Draw a UML class diagram on paper for Person, Student and Teacher (and any class you compose into them), then implement it with each class in its own header and source file.",
      prompts: [
        "An abstract Person base class: private ID (from a static counter), name and email; a constructor; const getters; a pure virtual role(); a virtual destructor.",
        "Student derives from Person and adds a level and a vector of scores, with addScore (validated 0–100) and average().",
        "Teacher derives from Person and HAS a list of subjects (composition), with addSubject and teaches(subject).",
        "Override a virtual describe() in each derived class that calls Person's version and then adds its own details.",
        "Keep everyone in a vector<unique_ptr<Person>> and loop over it to print every member of the school, polymorphically.",
        "Add a menu: add a student, add a teacher, record a score, list everyone, and list the students whose average is 70 or more.",
        "In a comment, explain one place where you chose composition over inheritance, and why.",
      ],
      closing:
        "Phase 3 is complete. Next: programs that survive errors and remember their data after they close.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
