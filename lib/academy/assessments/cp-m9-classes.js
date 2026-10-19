/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 9 · CLASSES, OBJECTS AND ENCAPSULATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l37-classes-intro": {
    lessonId: "cp-l37-classes-intro",
    passMark: 70,
    questions: [
      {
        id: "cpq37-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-class-vs-object",
        prompt: "What is the relationship between a class and an object?",
        options: [
          { id: "a", text: "A class is a blueprint; an object is one thing built from it, with its own data" },
          { id: "b", text: "They are two words for the same thing" },
          { id: "c", text: "An object is a blueprint for classes" },
          { id: "d", text: "A class is a kind of function" },
        ],
        correct: "a",
        explanation: "One class, many objects, each holding its own values.",
        whyWrong: {
          b: "A class describes; objects are the instances.",
          c: "It is the other way round.",
          d: "A class is a type: data plus the functions that work on it.",
        },
      },
      {
        id: "cpq37-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-procedural-limits",
        prompt: "Which problem of procedural programs does object-oriented design mainly address?",
        options: [
          { id: "a", text: "Data that any code can change, kept apart from the rules that should protect it" },
          { id: "b", text: "Programs that run too slowly" },
          { id: "c", text: "Not being able to use loops" },
          { id: "d", text: "Too few variables" },
        ],
        correct: "a",
        explanation: "OOP keeps data together with the only functions allowed to change it.",
        whyWrong: {
          b: "OOP is about organisation, not speed.",
          c: "Procedural programs use loops freely.",
          d: "The problem is uncontrolled access, not the number of variables.",
        },
      },
      {
        id: "cpq37-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-define-class",
        prompt: "What is the only difference between struct and class in C++?",
        options: [
          { id: "a", text: "Members of a struct are public by default; members of a class are private by default" },
          { id: "b", text: "A struct cannot have member functions" },
          { id: "c", text: "A class cannot hold data" },
          { id: "d", text: "A struct cannot be used to create objects" },
        ],
        correct: "a",
        explanation: "Apart from the default access, they are the same; convention uses struct for plain data bundles.",
        whyWrong: {
          b: "Structs can have member functions.",
          c: "Classes hold data members.",
          d: "Objects are created from structs exactly as from classes.",
        },
      },
      {
        id: "cpq37-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-define-class",
        prompt: "class Point {\npublic:\n    int x = 0;\n    int y = 0;\n}\n\nint main() { ... }\n\nWhy does this not compile?",
        options: [
          { id: "a", text: "A semicolon is missing after the class's closing brace" },
          { id: "b", text: "Members cannot have default values" },
          { id: "c", text: "public must come after the members" },
          { id: "d", text: "A class needs at least one member function" },
        ],
        correct: "a",
        explanation: "A class definition is a declaration and must end with }; .",
        whyWrong: {
          b: "Default member values are valid since C++11.",
          c: "Access specifiers come before the members they apply to.",
          d: "A class may contain only data.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l38-members-access": {
    lessonId: "cp-l38-members-access",
    passMark: 70,
    questions: [
      {
        id: "cpq38-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-member-functions",
        prompt: "What does const after a member function's brackets, as in int total() const, mean?",
        options: [
          { id: "a", text: "The function promises not to change the object, and the compiler enforces it" },
          { id: "b", text: "The function returns a constant" },
          { id: "c", text: "The function can only be called once" },
          { id: "d", text: "The function is private" },
        ],
        correct: "a",
        explanation: "A const member function can read the object's members but not change them.",
        whyWrong: {
          b: "The return type is the int before the name.",
          c: "It can be called as often as you like.",
          d: "Access is set by public/private, not const.",
        },
      },
      {
        id: "cpq38-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-creating-objects",
        prompt: "Student a; a.score = 60;\nStudent b = a;\nb.score = 90;\nstd::cout << a.score;\n\nWhat is printed?",
        options: [
          { id: "a", text: "60" },
          { id: "b", text: "90" },
          { id: "c", text: "150" },
          { id: "d", text: "0" },
        ],
        correct: "a",
        explanation: "b is a copy of a; changing b afterwards does not affect a.",
        whyWrong: {
          b: "That is b's score; the two objects are independent after the copy.",
          c: "Scores are not added.",
          d: "a.score was set to 60.",
        },
      },
      {
        id: "cpq38-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-access-specifiers",
        prompt: "Who can use a private member of a class?",
        options: [
          { id: "a", text: "Only the class's own member functions (and friends)" },
          { id: "b", text: "Any code in the same file" },
          { id: "c", text: "Only main" },
          { id: "d", text: "Any code, but with a warning" },
        ],
        correct: "a",
        explanation: "Outside code that touches a private member gets a compile error.",
        whyWrong: {
          b: "Being in the same file gives no access.",
          c: "main is outside the class and gets an error too.",
          d: "It is an error, not a warning.",
        },
      },
      {
        id: "cpq38-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-creating-objects",
        prompt: "acc is a pointer to an Account object. How do you call its deposit function?",
        options: [
          { id: "a", text: "acc->deposit(500);" },
          { id: "b", text: "acc.deposit(500);" },
          { id: "c", text: "*acc.deposit(500);" },
          { id: "d", text: "&acc.deposit(500);" },
        ],
        correct: "a",
        explanation: "-> reaches a member through a pointer; it means (*acc).deposit(500).",
        whyWrong: {
          b: "The dot works on an object, not a pointer.",
          c: "Precedence makes this *(acc.deposit(500)), which is wrong; it would need (*acc).deposit(500).",
          d: "& takes an address; it does not reach members.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l39-encapsulation": {
    lessonId: "cp-l39-encapsulation",
    passMark: 70,
    questions: [
      {
        id: "cpq39-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-encapsulation",
        prompt: "What is the main benefit of encapsulation?",
        options: [
          { id: "a", text: "The object enforces its own rules, so it can never be put into an invalid state from outside" },
          { id: "b", text: "Programs become shorter" },
          { id: "c", text: "Data is encrypted" },
          { id: "d", text: "Member functions run faster" },
        ],
        correct: "a",
        explanation: "Every change goes through the class's functions, which check the rules in one place.",
        whyWrong: {
          b: "Encapsulation is about safety and organisation, not length.",
          c: "private is about who can access data in code, not encryption.",
          d: "It has no effect on speed.",
        },
      },
      {
        id: "cpq39-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-constructors",
        prompt: "Which is true of a constructor?",
        options: [
          { id: "a", text: "It has the class's name, no return type, and runs automatically when an object is created" },
          { id: "b", text: "You must call it yourself after creating the object" },
          { id: "c", text: "It returns the new object as an int" },
          { id: "d", text: "A class can only have one" },
        ],
        correct: "a",
        explanation: "Constructors initialise objects as they are created.",
        whyWrong: {
          b: "It runs automatically during creation.",
          c: "Constructors have no return type.",
          d: "Constructors can be overloaded.",
        },
      },
      {
        id: "cpq39-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-constructor-overloading",
        prompt: "class Box {\npublic:\n    Box(int w) : width(w) {}\n    int width;\n};\n\nBox b;\n\nWhat happens?",
        options: [
          { id: "a", text: "A compilation error: writing Box(int) means no default constructor is generated" },
          { id: "b", text: "b.width is 0" },
          { id: "c", text: "b.width is garbage" },
          { id: "d", text: "It calls Box(int) with 0" },
        ],
        correct: "a",
        explanation: "Once you write any constructor, the compiler stops providing the default one. Add Box() = default; or a Box() of your own.",
        whyWrong: {
          b: "There is no constructor that takes no arguments, so b cannot be created.",
          c: "The program does not compile at all.",
          d: "C++ never invents an argument.",
        },
      },
      {
        id: "cpq39-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-getters-setters",
        prompt: "Why is a setter that simply does balance = value; with no checks a poor design?",
        options: [
          { id: "a", text: "It lets any caller set any value, so the member is effectively public and its rules are unprotected" },
          { id: "b", text: "Setters are not allowed in C++" },
          { id: "c", text: "It makes the class impossible to construct" },
          { id: "d", text: "It is fine in every case" },
        ],
        correct: "a",
        explanation: "The value of a setter is the checks it performs; without them, encapsulation is only cosmetic.",
        whyWrong: {
          b: "Setters are ordinary member functions.",
          c: "Construction is unaffected.",
          d: "For data with rules, such as a balance, it removes all protection.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l40-this-static-files": {
    lessonId: "cp-l40-this-static-files",
    passMark: 70,
    questions: [
      {
        id: "cpq40-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-this",
        prompt: "Inside a member function, what is this?",
        options: [
          { id: "a", text: "A pointer to the object the function was called on" },
          { id: "b", text: "A copy of the object" },
          { id: "c", text: "The class itself" },
          { id: "d", text: "A reference to main" },
        ],
        correct: "a",
        explanation: "In ada.addBonus(5), this points at ada, so this->score is ada's score.",
        whyWrong: {
          b: "this is a pointer, not a copy.",
          c: "this refers to one object, not the class.",
          d: "It has nothing to do with main.",
        },
      },
      {
        id: "cpq40-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-static-members",
        prompt: "A class has inline static int created = 0; and its constructor does created++. After creating 4 objects, what does each object see as created?",
        options: [
          { id: "a", text: "4, because there is one shared copy" },
          { id: "b", text: "1 each" },
          { id: "c", text: "0" },
          { id: "d", text: "1, 2, 3 and 4 respectively" },
        ],
        correct: "a",
        explanation: "A static member belongs to the class; every object reads the same variable.",
        whyWrong: {
          b: "That would be true of an ordinary (non-static) member.",
          c: "It was incremented four times.",
          d: "There is one variable, so all objects see its current value, 4.",
        },
      },
      {
        id: "cpq40-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-class-files",
        prompt: "In a class split across files, what usually goes in the header (.h) file?",
        options: [
          { id: "a", text: "The class definition, with its members and the declarations of its member functions" },
          { id: "b", text: "The main function" },
          { id: "c", text: "Only comments" },
          { id: "d", text: "The compiled machine code" },
        ],
        correct: "a",
        explanation: "The header says WHAT the class is; the .cpp file says HOW its functions work.",
        whyWrong: {
          b: "main lives in its own source file.",
          c: "The header holds the class definition.",
          d: "Headers are source code; compilation produces machine code.",
        },
      },
      {
        id: "cpq40-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-class-files",
        prompt: "How is a member function defined outside its class, in Account.cpp?",
        options: [
          { id: "a", text: "void Account::deposit(double amount) { ... }" },
          { id: "b", text: "void deposit(double amount) { ... }" },
          { id: "c", text: "Account void deposit(double amount) { ... }" },
          { id: "d", text: "void Account.deposit(double amount) { ... }" },
        ],
        correct: "a",
        explanation: "ClassName:: before the function's name says which class the function belongs to.",
        whyWrong: {
          b: "Without Account:: this defines an unrelated ordinary function.",
          c: "The class name goes before the function name with ::, after the return type.",
          d: "The dot is for objects; definitions use ::.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
