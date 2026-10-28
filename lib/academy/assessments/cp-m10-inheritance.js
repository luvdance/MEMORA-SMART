/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 10 · INHERITANCE, POLYMORPHISM AND OOP DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l41-inheritance": {
    lessonId: "cp-l41-inheritance",
    passMark: 70,
    questions: [
      {
        id: "cpq41-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-derived-classes",
        prompt: "Which relationship does public inheritance model?",
        options: [
          { id: "a", text: "is-a: a derived object is a kind of base object" },
          { id: "b", text: "has-a: the derived object owns a base object" },
          { id: "c", text: "uses-a: it calls the base occasionally" },
          { id: "d", text: "none; it only saves typing" },
        ],
        correct: "a",
        explanation: "class Student : public Person says every Student is a Person and can be used as one.",
        whyWrong: {
          b: "has-a is composition: a member object.",
          c: "Occasional use is a function call or a parameter, not inheritance.",
          d: "It makes a promise about the relationship, which must be true.",
        },
      },
      {
        id: "cpq41-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-encapsulation-revisited",
        prompt: "Can a derived class's member functions use the base class's PRIVATE members directly?",
        options: [
          { id: "a", text: "No; private members are accessible only inside the base class itself" },
          { id: "b", text: "Yes, always" },
          { id: "c", text: "Only if inheritance is private" },
          { id: "d", text: "Only in the constructor" },
        ],
        correct: "a",
        explanation: "Private stays private even from derived classes. Use protected, or better, public/protected member functions.",
        whyWrong: {
          b: "That would let anyone bypass encapsulation by writing a derived class.",
          c: "The kind of inheritance does not unlock private members.",
          d: "No member function of the derived class can reach them.",
        },
      },
      {
        id: "cpq41-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-derived-constructors",
        prompt: "class Account { public: Account(int n) {...} };\nclass Savings : public Account { public: Savings(int n, double rate) : ??? , rate_(rate) {} double rate_; };\n\nWhat replaces ??? to pass n to the base constructor?",
        options: [
          { id: "a", text: "Account(n)" },
          { id: "b", text: "base(n)" },
          { id: "c", text: "Savings(n)" },
          { id: "d", text: "this->Account = n" },
        ],
        correct: "a",
        explanation: "The derived constructor names the base constructor first in its initialiser list.",
        whyWrong: {
          b: "C++ has no base keyword; use the base class's name.",
          c: "That would call Savings itself, not the base.",
          d: "The base part is built through the initialiser list, not assigned.",
        },
      },
      {
        id: "cpq41-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-derived-constructors",
        prompt: "When a derived object is destroyed, in what order do the destructors run?",
        options: [
          { id: "a", text: "Derived destructor first, then the base destructor" },
          { id: "b", text: "Base destructor first, then the derived" },
          { id: "c", text: "Only the base destructor" },
          { id: "d", text: "In a random order" },
        ],
        correct: "a",
        explanation: "Destruction reverses construction: the derived part, built last, is removed first.",
        whyWrong: {
          b: "That is the construction order.",
          c: "Both run, derived first.",
          d: "The order is fully defined.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l42-polymorphism": {
    lessonId: "cp-l42-polymorphism",
    passMark: 70,
    questions: [
      {
        id: "cpq42-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-virtual",
        prompt: "class A { public: virtual void hi() const { cout << \"A\"; } };\nclass B : public A { public: void hi() const override { cout << \"B\"; } };\n\nB b; const A& r = b; r.hi();\n\nWhat is printed?",
        options: [
          { id: "a", text: "B" },
          { id: "b", text: "A" },
          { id: "c", text: "AB" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "hi is virtual, so the version is chosen by the object's actual type, B, even through an A&.",
        whyWrong: {
          b: "That would happen without virtual.",
          c: "Only one version runs; B's does not call A's.",
          d: "This is a correct override.",
        },
      },
      {
        id: "cpq42-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-virtual",
        prompt: "What does the override keyword do?",
        options: [
          { id: "a", text: "Asks the compiler to check that this function really overrides a virtual function in the base" },
          { id: "b", text: "Makes the function virtual in the base class" },
          { id: "c", text: "Hides the base version from everyone" },
          { id: "d", text: "Makes the function run faster" },
        ],
        correct: "a",
        explanation: "If the name or parameters do not match a base virtual function, override makes it a compile error instead of a silent new function.",
        whyWrong: {
          b: "virtual must be written in the base.",
          c: "It does not change access.",
          d: "It is a compile-time check only.",
        },
      },
      {
        id: "cpq42-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-static-dynamic-poly",
        prompt: "Which is an example of COMPILE-TIME polymorphism?",
        options: [
          { id: "a", text: "Function overloading: print(int) and print(double)" },
          { id: "b", text: "Calling a virtual function through a base pointer" },
          { id: "c", text: "A vector of unique_ptr<Shape> holding circles and rectangles" },
          { id: "d", text: "An abstract base class" },
        ],
        correct: "a",
        explanation: "The compiler chooses the overload from the argument types it can see.",
        whyWrong: {
          b: "That is decided at run time from the object's real type.",
          c: "That relies on runtime (virtual) dispatch.",
          d: "Abstract classes are used for runtime polymorphism.",
        },
      },
      {
        id: "cpq42-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-inheritance-kinds",
        prompt: "class Car : private Engine { ... }; What does private inheritance mean for code outside Car?",
        options: [
          { id: "a", text: "It cannot use Engine's public members through a Car, or treat a Car as an Engine" },
          { id: "b", text: "Car cannot use Engine's members either" },
          { id: "c", text: "Engine's private members become public" },
          { id: "d", text: "Nothing changes compared with public inheritance" },
        ],
        correct: "a",
        explanation: "Engine's public members become private inside Car, so only Car's own code can use them.",
        whyWrong: {
          b: "Car's own member functions can still use them.",
          c: "Inheritance never makes private members public.",
          d: "Outside code loses access; that is the whole effect.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l43-abstract-composition": {
    lessonId: "cp-l43-abstract-composition",
    passMark: 70,
    questions: [
      {
        id: "cpq43-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-abstract",
        prompt: "What makes a class abstract?",
        options: [
          { id: "a", text: "It has at least one pure virtual function (= 0)" },
          { id: "b", text: "All its members are private" },
          { id: "c", text: "It has no constructor" },
          { id: "d", text: "It is declared with the word abstract" },
        ],
        correct: "a",
        explanation: "A pure virtual function has no implementation, so objects of the class cannot be created.",
        whyWrong: {
          b: "Private members do not stop objects being created.",
          c: "Constructors are unrelated.",
          d: "C++ has no abstract keyword.",
        },
      },
      {
        id: "cpq43-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-virtual-destructor",
        prompt: "Why must a base class used polymorphically have a virtual destructor?",
        options: [
          { id: "a", text: "Deleting a derived object through a base pointer otherwise runs only the base destructor: undefined behaviour" },
          { id: "b", text: "Otherwise the class will not compile" },
          { id: "c", text: "Virtual destructors run faster" },
          { id: "d", text: "So the object is never destroyed" },
        ],
        correct: "a",
        explanation: "With a virtual destructor, delete through a base pointer destroys the whole object, derived part first.",
        whyWrong: {
          b: "It compiles; that is why the bug is dangerous.",
          c: "Speed is not the reason.",
          d: "Objects should be destroyed, correctly.",
        },
      },
      {
        id: "cpq43-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-composition",
        prompt: "A Library keeps many Book objects. Which design fits?",
        options: [
          { id: "a", text: "Composition: Library has a vector<Book> member" },
          { id: "b", text: "class Library : public Book" },
          { id: "c", text: "class Book : public Library" },
          { id: "d", text: "A global array of books" },
        ],
        correct: "a",
        explanation: "A library HAS books; it is not a book.",
        whyWrong: {
          b: "A library is not a kind of book.",
          c: "A book is not a kind of library.",
          d: "Globals remove the library's control over its own books.",
        },
      },
      {
        id: "cpq43-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-composition",
        prompt: "Why is composition often preferred over inheritance?",
        options: [
          { id: "a", text: "It keeps classes independent and flexible, and avoids claiming is-a relationships that are not true" },
          { id: "b", text: "Inheritance is deprecated in C++" },
          { id: "c", text: "Composition makes objects smaller" },
          { id: "d", text: "Composed members are always public" },
        ],
        correct: "a",
        explanation: "Members can be swapped or changed without reshaping a class hierarchy.",
        whyWrong: {
          b: "Inheritance is fully supported; it should be used where is-a is true.",
          c: "Size is not the reason.",
          d: "Members can and usually should be private.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l44-oop-design": {
    lessonId: "cp-l44-oop-design",
    passMark: 70,
    questions: [
      {
        id: "cpq44-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-interfaces",
        prompt: "In C++, what is usually meant by an interface?",
        options: [
          { id: "a", text: "An abstract class containing only pure virtual functions and a virtual destructor" },
          { id: "b", text: "A class with only public data" },
          { id: "c", text: "A header file" },
          { id: "d", text: "The main function" },
        ],
        correct: "a",
        explanation: "It defines what implementing classes must do, with no data and no implementation.",
        whyWrong: {
          b: "Public data is the opposite of a contract of behaviour.",
          c: "A header may contain an interface, but they are not the same thing.",
          d: "main is the program's entry point.",
        },
      },
      {
        id: "cpq44-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-uml",
        prompt: "In a UML class diagram, what does a minus sign (-) before a member mean?",
        options: [
          { id: "a", text: "The member is private" },
          { id: "b", text: "The member is public" },
          { id: "c", text: "The member is deleted" },
          { id: "d", text: "The member is negative" },
        ],
        correct: "a",
        explanation: "+ public, - private, # protected.",
        whyWrong: {
          b: "Public is +.",
          c: "UML has no symbol for deleted members.",
          d: "The symbol is about visibility, not value.",
        },
      },
      {
        id: "cpq44-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-design-principles",
        prompt: "What does the single responsibility principle say?",
        options: [
          { id: "a", text: "Each class should have one job, so it has one reason to change" },
          { id: "b", text: "Each program should have one class" },
          { id: "c", text: "Each class should have one member function" },
          { id: "d", text: "Only one programmer should edit a class" },
        ],
        correct: "a",
        explanation: "A focused class is easier to understand, test and change safely.",
        whyWrong: {
          b: "Programs usually need many focused classes.",
          c: "A class may need several functions to do its one job.",
          d: "It is about what a class does, not who edits it.",
        },
      },
      {
        id: "cpq44-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-school-model",
        prompt: "In the school model, print() is written only in Person, yet each line shows \"Student, level 200\" or \"Teacher of 2 subjects\". Why?",
        options: [
          { id: "a", text: "print() calls the virtual role(), which runs the derived class's version for each object" },
          { id: "b", text: "Student and Teacher each copy print()" },
          { id: "c", text: "The vector sorts them by type" },
          { id: "d", text: "role() is static" },
        ],
        correct: "a",
        explanation: "A base function calling a virtual function gets the derived behaviour: runtime polymorphism.",
        whyWrong: {
          b: "print exists only in Person.",
          c: "The vector keeps insertion order and knows nothing of roles.",
          d: "A static function has no object and could not be virtual.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
