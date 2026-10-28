/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 14 · MODERN C++ AND RESOURCE MANAGEMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l58-modern-basics": {
    lessonId: "cp-l58-modern-basics",
    passMark: 70,
    questions: [
      {
        id: "cpq58-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-auto",
        prompt: "auto total = 10 / 4;\nWhat type and value does total have?",
        options: [
          { id: "a", text: "int, 2" },
          { id: "b", text: "double, 2.5" },
          { id: "c", text: "auto, 2.5" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "auto takes the type of the initialiser; 10 / 4 is integer division, an int.",
        whyWrong: {
          b: "auto cannot add decimals that the expression does not have.",
          c: "auto is not a type; the compiler deduces int.",
          d: "It compiles fine.",
        },
      },
      {
        id: "cpq58-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-range-loops-modern",
        prompt: "Which loop header reads every element of a vector of large objects without copying them?",
        options: [
          { id: "a", text: "for (const auto& x : items)" },
          { id: "b", text: "for (auto x : items)" },
          { id: "c", text: "for (auto&& x = items)" },
          { id: "d", text: "for (x in items)" },
        ],
        correct: "a",
        explanation: "const auto& refers to each element without copying and forbids changes.",
        whyWrong: {
          b: "auto x copies every element.",
          c: "That is not valid range-for syntax.",
          d: "That is not C++.",
        },
      },
      {
        id: "cpq58-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-const-correctness",
        prompt: "void show(const Account& a) { a.deposit(10); }\nWhy does this not compile?",
        options: [
          { id: "a", text: "a is a const reference, so only const member functions can be called, and deposit changes the object" },
          { id: "b", text: "References cannot be passed to functions" },
          { id: "c", text: "deposit is private" },
          { id: "d", text: "show must return a value" },
        ],
        correct: "a",
        explanation: "const promises the function will not change a; the compiler enforces it.",
        whyWrong: {
          b: "Passing references is normal.",
          c: "The error is about const, not access.",
          d: "void functions return nothing; that is fine.",
        },
      },
      {
        id: "cpq58-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-why-modern",
        prompt: "What is the modern replacement for int* a = new int[n]; ... delete[] a;?",
        options: [
          { id: "a", text: "vector<int> a(n);" },
          { id: "b", text: "int a[n];" },
          { id: "c", text: "malloc" },
          { id: "d", text: "A global array" },
        ],
        correct: "a",
        explanation: "A vector manages its own memory and knows its size.",
        whyWrong: {
          b: "A run-time size is not allowed for a standard array.",
          c: "malloc is C's raw allocator, even more manual.",
          d: "Globals do not solve ownership and need a fixed size.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l59-move-raii": {
    lessonId: "cp-l59-move-raii",
    passMark: 70,
    questions: [
      {
        id: "cpq59-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-lvalues-rvalues",
        prompt: "Which of these is an rvalue?",
        options: [
          { id: "a", text: "price * 2" },
          { id: "b", text: "price" },
          { id: "c", text: "scores[3]" },
          { id: "d", text: "*ptr" },
        ],
        correct: "a",
        explanation: "price * 2 is a temporary result with no lasting location.",
        whyWrong: {
          b: "A named variable is an lvalue.",
          c: "An element with an address is an lvalue.",
          d: "Dereferencing gives the lvalue the pointer points at.",
        },
      },
      {
        id: "cpq59-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-move-semantics",
        prompt: "What does move(x) actually do?",
        options: [
          { id: "a", text: "It casts x to an rvalue, marking it as safe to move from; the move happens only if a move constructor or assignment uses it" },
          { id: "b", text: "It copies x somewhere else" },
          { id: "c", text: "It deletes x" },
          { id: "d", text: "It moves x to the heap" },
        ],
        correct: "a",
        explanation: "move is just a cast; the receiving function does the moving.",
        whyWrong: {
          b: "Moving exists to avoid copying.",
          c: "x still exists, in a valid but unspecified state.",
          d: "Where an object lives does not change.",
        },
      },
      {
        id: "cpq59-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-smart-pointers",
        prompt: "When is the object owned by several shared_ptr copies deleted?",
        options: [
          { id: "a", text: "When the last shared_ptr owning it is destroyed or reset" },
          { id: "b", text: "When the first copy is destroyed" },
          { id: "c", text: "Never; you must delete it" },
          { id: "d", text: "At the end of the function that created it" },
        ],
        correct: "a",
        explanation: "A reference count tracks the owners; reaching zero deletes the object.",
        whyWrong: {
          b: "Other owners still use it.",
          c: "Automatic deletion is the point of a smart pointer.",
          d: "Ownership can outlive the creating function.",
        },
      },
      {
        id: "cpq59-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-raii",
        prompt: "A function creates a local RAII object that opens a file, then throws an exception before the end. What happens to the file?",
        options: [
          { id: "a", text: "It is closed: the object's destructor runs as the exception leaves the function" },
          { id: "b", text: "It stays open forever" },
          { id: "c", text: "The program crashes before anything can close it" },
          { id: "d", text: "It is closed only if the exception is never caught" },
        ],
        correct: "a",
        explanation: "C++ destroys local objects when leaving a scope by any route, which is what makes RAII reliable.",
        whyWrong: {
          b: "Destructors run during stack unwinding.",
          c: "A caught exception is a normal, controlled path.",
          d: "Clean-up happens as the exception passes, whoever catches it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l60-copy-move": {
    lessonId: "cp-l60-copy-move",
    passMark: 70,
    questions: [
      {
        id: "cpq60-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-copy-ops",
        prompt: "Widget a; Widget b = a;\nWhich special member function runs on the second line?",
        options: [
          { id: "a", text: "The copy constructor, because b is being created" },
          { id: "b", text: "Copy assignment" },
          { id: "c", text: "The move constructor" },
          { id: "d", text: "The destructor" },
        ],
        correct: "a",
        explanation: "= in a declaration initialises a new object; assignment needs an existing object.",
        whyWrong: {
          b: "That would be b = a; on a b that already exists.",
          c: "a is an lvalue, so it is copied, not moved.",
          d: "Nothing is being destroyed.",
        },
      },
      {
        id: "cpq60-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-move-ops",
        prompt: "Why should move constructors be marked noexcept?",
        options: [
          { id: "a", text: "vector only moves its elements while growing if the move cannot throw; otherwise it copies them" },
          { id: "b", text: "It makes the move faster" },
          { id: "c", text: "It is required for the code to compile" },
          { id: "d", text: "It stops the object being copied" },
        ],
        correct: "a",
        explanation: "To keep its strong safety guarantee, vector falls back to copying if a move might throw.",
        whyWrong: {
          b: "noexcept enables the move; it does not speed up its code.",
          c: "It compiles without it, just with worse performance.",
          d: "Copying is controlled separately.",
        },
      },
      {
        id: "cpq60-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-rule-of-zero",
        prompt: "What does the rule of zero recommend?",
        options: [
          { id: "a", text: "Build classes from self-managing members so you write none of the copy, move or destructor functions" },
          { id: "b", text: "Never create objects" },
          { id: "c", text: "Write all five special functions in every class" },
          { id: "d", text: "Initialise every member to zero" },
        ],
        correct: "a",
        explanation: "The compiler-generated special functions are correct when every member manages itself.",
        whyWrong: {
          b: "It is about special member functions, not avoiding objects.",
          c: "That is the rule of five, for classes that must manage a raw resource.",
          d: "Initialisation values are a separate matter.",
        },
      },
      {
        id: "cpq60-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-rule-of-zero",
        prompt: "How do you make it a compile error to copy a class?",
        options: [
          { id: "a", text: "Declare its copy constructor (and copy assignment) as = delete" },
          { id: "b", text: "Make every member public" },
          { id: "c", text: "Add a comment saying \"do not copy\"" },
          { id: "d", text: "Give it a virtual destructor" },
        ],
        correct: "a",
        explanation: "A deleted function cannot be called; any copy then fails to compile.",
        whyWrong: {
          b: "Access to members does not affect copying.",
          c: "The compiler ignores comments.",
          d: "A virtual destructor does not prevent copying.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l61-optional-cpp20": {
    lessonId: "cp-l61-optional-cpp20",
    passMark: 70,
    questions: [
      {
        id: "cpq61-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-optional",
        prompt: "What is optional<int> for?",
        options: [
          { id: "a", text: "A result that is either an int or explicitly nothing, so \"no value\" cannot be confused with real data" },
          { id: "b", text: "An int that is optional to initialise" },
          { id: "c", text: "An int stored on the heap" },
          { id: "d", text: "A faster int" },
        ],
        correct: "a",
        explanation: "optional replaces magic values like -1 with a separate, checkable empty state.",
        whyWrong: {
          b: "optional is about the result possibly being absent.",
          c: "optional stores its value inside itself.",
          d: "It is about meaning, not speed.",
        },
      },
      {
        id: "cpq61-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-string-view",
        prompt: "string_view makeView() {\n    string local = \"temporary\";\n    return local;\n}\n\nWhat is wrong?",
        options: [
          { id: "a", text: "The view points into local, which is destroyed when the function returns: a dangling view" },
          { id: "b", text: "string_view cannot be returned" },
          { id: "c", text: "Nothing" },
          { id: "d", text: "It copies the string twice" },
        ],
        correct: "a",
        explanation: "A string_view does not own its characters; it must not outlive the string it looks at.",
        whyWrong: {
          b: "Returning a view is fine when its characters outlive the call.",
          c: "Using the returned view is undefined behaviour.",
          d: "No copy is made, which is exactly the problem.",
        },
      },
      {
        id: "cpq61-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-cpp20",
        prompt: "What does auto [name, age] = person; do, where person is a struct with two members?",
        options: [
          { id: "a", text: "Unpacks the members into two new variables, name and age" },
          { id: "b", text: "Creates an array of two elements" },
          { id: "c", text: "Compares name with age" },
          { id: "d", text: "It is not valid C++" },
        ],
        correct: "a",
        explanation: "That is a structured binding, valid since C++17.",
        whyWrong: {
          b: "No array is created.",
          c: "Nothing is compared.",
          d: "It is valid in C++17 and later.",
        },
      },
      {
        id: "cpq61-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-cpp20",
        prompt: "What is true of C++20 views such as views::filter?",
        options: [
          { id: "a", text: "They are lazy: elements are processed as you iterate, without copying the container" },
          { id: "b", text: "They sort the container immediately" },
          { id: "c", text: "They create a full new vector every time" },
          { id: "d", text: "They work only in C++11" },
        ],
        correct: "a",
        explanation: "Views describe a pipeline; the work happens one element at a time when the view is used.",
        whyWrong: {
          b: "filter selects; it does not sort.",
          c: "Views avoid copies; they are not containers.",
          d: "Ranges arrived in C++20.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
