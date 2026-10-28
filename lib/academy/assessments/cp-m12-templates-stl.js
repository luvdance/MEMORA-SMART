/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 12 · TEMPLATES AND THE STL
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l49-templates": {
    lessonId: "cp-l49-templates",
    passMark: 70,
    questions: [
      {
        id: "cpq49-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-function-templates",
        prompt: "What does the compiler do with template <typename T> T twice(T x) { return x * 2; } when you call twice(3) and twice(1.5)?",
        options: [
          { id: "a", text: "Generates an int version and a double version from the one template" },
          { id: "b", text: "Converts everything to double" },
          { id: "c", text: "Reports an error: T is unknown" },
          { id: "d", text: "Runs the same machine code for both, checking the type at run time" },
        ],
        correct: "a",
        explanation: "Templates are instantiated at compile time for each type used.",
        whyWrong: {
          b: "Each call gets a version for its own type.",
          c: "T is deduced from the argument's type.",
          d: "Each type gets its own generated code; there is no run-time type check.",
        },
      },
      {
        id: "cpq49-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-function-templates",
        prompt: "template <typename T> T biggest(T a, T b) { return a > b ? a : b; }\n\nWhy does biggest(3, 2.5) fail to compile?",
        options: [
          { id: "a", text: "3 is an int and 2.5 a double, so T cannot be deduced as one type; write biggest<double>(3, 2.5)" },
          { id: "b", text: "Templates cannot use the ?: operator" },
          { id: "c", text: "Templates only work with ints" },
          { id: "d", text: "It compiles and returns 3" },
        ],
        correct: "a",
        explanation: "Both parameters are T, so both arguments must suggest the same type, or the type must be given explicitly.",
        whyWrong: {
          b: "Any expression valid for T can be used.",
          c: "Templates work with any type supporting the operations used.",
          d: "Deduction fails, so it does not compile.",
        },
      },
      {
        id: "cpq49-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-class-templates",
        prompt: "Which is an example of a class template from the standard library?",
        options: [
          { id: "a", text: "vector<T>" },
          { id: "b", text: "int" },
          { id: "c", text: "cout" },
          { id: "d", text: "main" },
        ],
        correct: "a",
        explanation: "vector is written once and instantiated for any element type: vector<int>, vector<string> and so on.",
        whyWrong: {
          b: "int is a built-in type.",
          c: "cout is an object.",
          d: "main is a function.",
        },
      },
      {
        id: "cpq49-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-why-generic",
        prompt: "What is the main benefit of templates?",
        options: [
          { id: "a", text: "Logic is written once and reused for many types, with full type checking and no speed cost" },
          { id: "b", text: "Programs need no types at all" },
          { id: "c", text: "Code runs faster than hand-written code" },
          { id: "d", text: "Templates catch logic errors automatically" },
        ],
        correct: "a",
        explanation: "Templates remove duplication across types while keeping C++'s type safety and speed.",
        whyWrong: {
          b: "Every instantiation has concrete, checked types.",
          c: "It is as fast, not faster.",
          d: "Wrong logic is wrong for every type.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l50-stl-sequences": {
    lessonId: "cp-l50-stl-sequences",
    passMark: 70,
    questions: [
      {
        id: "cpq50-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-stl-intro",
        prompt: "What are the three main parts of the STL?",
        options: [
          { id: "a", text: "Containers, iterators and algorithms" },
          { id: "b", text: "Classes, objects and pointers" },
          { id: "c", text: "Files, streams and exceptions" },
          { id: "d", text: "Headers, sources and libraries" },
        ],
        correct: "a",
        explanation: "Containers hold data, iterators step through it, algorithms operate on it through iterators.",
        whyWrong: {
          b: "Those are language features, not the STL's structure.",
          c: "Those are other parts of the standard library.",
          d: "Those describe how code is organised into files.",
        },
      },
      {
        id: "cpq50-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-array-list-deque",
        prompt: "A program must add and remove items at BOTH the front and the back, and sometimes read item i by index. Which container fits?",
        options: [
          { id: "a", text: "deque" },
          { id: "b", text: "stack" },
          { id: "c", text: "array" },
          { id: "d", text: "set" },
        ],
        correct: "a",
        explanation: "deque supports push_front, push_back, pop_front, pop_back and indexing.",
        whyWrong: {
          b: "A stack works at one end only and has no indexing.",
          c: "An array's size is fixed.",
          d: "A set keeps sorted unique values, not a front and back.",
        },
      },
      {
        id: "cpq50-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-array-list-deque",
        prompt: "What advantage does array<int, 5> have over a built-in int[5]?",
        options: [
          { id: "a", text: "It knows its size, can be copied with =, and has bounds-checked .at()" },
          { id: "b", text: "It can grow when needed" },
          { id: "c", text: "It can hold different types" },
          { id: "d", text: "It is stored on the heap" },
        ],
        correct: "a",
        explanation: "array keeps a fixed size but behaves like a proper container.",
        whyWrong: {
          b: "Its size is fixed; use vector to grow.",
          c: "It holds one element type.",
          d: "Like a built-in array, it is stored where it is declared, often on the stack.",
        },
      },
      {
        id: "cpq50-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-vector-revisited",
        prompt: "Why call reserve(100000) on a vector before adding 100,000 elements?",
        options: [
          { id: "a", text: "It sets aside room once, avoiding repeated reallocation and copying as the vector grows" },
          { id: "b", text: "It adds 100,000 zeros" },
          { id: "c", text: "Without it push_back fails" },
          { id: "d", text: "It sorts the vector in advance" },
        ],
        correct: "a",
        explanation: "reserve changes capacity, not size; push_back then fills the reserved room.",
        whyWrong: {
          b: "That is resize; reserve adds no elements.",
          c: "push_back always works; reserve only makes it cheaper.",
          d: "reserve does not order anything.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l51-adaptors-associative": {
    lessonId: "cp-l51-adaptors-associative",
    passMark: 70,
    questions: [
      {
        id: "cpq51-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-stack-queue",
        prompt: "stack<int> s; s.push(1); s.push(2); s.push(3); s.pop();\nWhat is s.top()?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "3" },
          { id: "c", text: "1" },
          { id: "d", text: "0" },
        ],
        correct: "a",
        explanation: "Last in, first out: pop removes 3, leaving 2 on top.",
        whyWrong: {
          b: "3 was the last pushed and is the one pop removed.",
          c: "1 is at the bottom.",
          d: "The stack still holds 1 and 2.",
        },
      },
      {
        id: "cpq51-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-set-map",
        prompt: "map<string, int> m;\ncout << m[\"x\"] << \" \" << m.size();\n\nWhat is printed?",
        options: [
          { id: "a", text: "0 1, because [] inserted \"x\" with a default value" },
          { id: "b", text: "0 0" },
          { id: "c", text: "It throws an exception" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "Reading a missing key with [] inserts it. Use count or find to check without inserting.",
        whyWrong: {
          b: "The read added an element, so the size is 1.",
          c: "That is what .at() does for a missing key; [] inserts instead.",
          d: "It is valid code with a surprising side effect.",
        },
      },
      {
        id: "cpq51-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-set-map",
        prompt: "set<int> s = {7, 2, 7, 5};\nfor (int x : s) cout << x;\n\nWhat is printed?",
        options: [
          { id: "a", text: "257" },
          { id: "b", text: "7275" },
          { id: "c", text: "275" },
          { id: "d", text: "752" },
        ],
        correct: "a",
        explanation: "A set removes duplicates and keeps values in ascending order.",
        whyWrong: {
          b: "Duplicates are not stored.",
          c: "A set iterates in sorted order.",
          d: "Ascending, not descending.",
        },
      },
      {
        id: "cpq51-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-unordered",
        prompt: "Why should a program never rely on the order in which it loops over an unordered_map?",
        options: [
          { id: "a", text: "That order is unspecified: it depends on the hash table and can change as elements are added" },
          { id: "b", text: "unordered_map cannot be looped over" },
          { id: "c", text: "It is always reverse alphabetical" },
          { id: "d", text: "It is always insertion order" },
        ],
        correct: "a",
        explanation: "Use map when order matters; unordered_map trades order for faster average look-up.",
        whyWrong: {
          b: "It can be looped over; the order just is not guaranteed.",
          c: "No order is guaranteed.",
          d: "Insertion order is not preserved.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l52-iterators-algorithms": {
    lessonId: "cp-l52-iterators-algorithms",
    passMark: 70,
    questions: [
      {
        id: "cpq52-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-iterators",
        prompt: "What does v.end() refer to?",
        options: [
          { id: "a", text: "The position just past the last element; it must never be dereferenced" },
          { id: "b", text: "The last element" },
          { id: "c", text: "The size of the vector" },
          { id: "d", text: "The first element" },
        ],
        correct: "a",
        explanation: "Ranges are half-open: [begin, end).",
        whyWrong: {
          b: "The last element is at end() - 1.",
          c: "end() is a position, not a count.",
          d: "That is begin().",
        },
      },
      {
        id: "cpq52-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-range-for",
        prompt: "vector<int> v = {1, 2, 3};\nfor (int x : v) x *= 10;\ncout << v[0];\n\nWhat is printed?",
        options: [
          { id: "a", text: "1, because x is a copy" },
          { id: "b", text: "10" },
          { id: "c", text: "It does not compile" },
          { id: "d", text: "60" },
        ],
        correct: "a",
        explanation: "To change the elements, the loop variable must be a reference: for (int& x : v).",
        whyWrong: {
          b: "Only the copies were multiplied.",
          c: "It compiles; it simply changes nothing.",
          d: "Nothing was totalled.",
        },
      },
      {
        id: "cpq52-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-algorithms",
        prompt: "What does find return if the value is not in the range?",
        options: [
          { id: "a", text: "The end iterator of the range" },
          { id: "b", text: "-1" },
          { id: "c", text: "nullptr" },
          { id: "d", text: "It throws an exception" },
        ],
        correct: "a",
        explanation: "Compare the result with end() to know whether anything was found.",
        whyWrong: {
          b: "find returns an iterator, not an index.",
          c: "Iterators are compared with end(), not nullptr.",
          d: "find never throws for a missing value.",
        },
      },
      {
        id: "cpq52-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-algorithms",
        prompt: "Which line sorts a vector v in ascending order?",
        options: [
          { id: "a", text: "sort(v.begin(), v.end());" },
          { id: "b", text: "v.sort();" },
          { id: "c", text: "sort(v);" },
          { id: "d", text: "sort v;" },
        ],
        correct: "a",
        explanation: "sort takes the range to sort as a pair of iterators.",
        whyWrong: {
          b: "vector has no sort member (list does).",
          c: "In C++17, sort needs begin and end iterators.",
          d: "That is not C++ syntax.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l53-lambdas-choosing": {
    lessonId: "cp-l53-lambdas-choosing",
    passMark: 70,
    questions: [
      {
        id: "cpq53-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-lambdas",
        prompt: "In [&](int x) { return x > limit; }, what does [&] do?",
        options: [
          { id: "a", text: "Lets the lambda use variables from the surrounding code, such as limit, by reference" },
          { id: "b", text: "Takes the address of x" },
          { id: "c", text: "Makes the lambda return a reference" },
          { id: "d", text: "Nothing; it is decoration" },
        ],
        correct: "a",
        explanation: "The capture list says which outside variables the lambda can use, and how.",
        whyWrong: {
          b: "x is a parameter in the round brackets; [&] is about captures.",
          c: "The return type is deduced from the body.",
          d: "Without a capture, using limit would not compile.",
        },
      },
      {
        id: "cpq53-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-lambdas",
        prompt: "sort(v.begin(), v.end(), [](int a, int b) { return a > b; });\n\nIn what order is v afterwards?",
        options: [
          { id: "a", text: "Descending: largest first" },
          { id: "b", text: "Ascending" },
          { id: "c", text: "Unchanged" },
          { id: "d", text: "Random" },
        ],
        correct: "a",
        explanation: "The comparison says a comes before b when a is larger.",
        whyWrong: {
          b: "Ascending is the default, or the comparison a < b.",
          c: "sort always reorders by the comparison.",
          d: "The comparison fully determines the order.",
        },
      },
      {
        id: "cpq53-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-choosing-container",
        prompt: "A print queue must handle jobs strictly in the order they arrive. Which container?",
        options: [
          { id: "a", text: "queue" },
          { id: "b", text: "stack" },
          { id: "c", text: "set" },
          { id: "d", text: "map" },
        ],
        correct: "a",
        explanation: "First in, first out is exactly a queue.",
        whyWrong: {
          b: "A stack serves the most recent job first.",
          c: "A set sorts and removes duplicates; arrival order is lost.",
          d: "A map orders by key, not by arrival.",
        },
      },
      {
        id: "cpq53-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-choosing-container",
        prompt: "When you are unsure which sequence container to use, which is the usual default?",
        options: [
          { id: "a", text: "vector" },
          { id: "b", text: "list" },
          { id: "c", text: "deque" },
          { id: "d", text: "stack" },
        ],
        correct: "a",
        explanation: "vector's contiguous memory makes it the fastest choice for most workloads.",
        whyWrong: {
          b: "list is rarely the best choice in practice.",
          c: "deque is for when both ends matter.",
          d: "stack is a restricted interface for LIFO only.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
